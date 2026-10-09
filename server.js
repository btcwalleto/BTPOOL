
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

const PORT = Number(process.env.PORT || 3000);
const MIN_WITHDRAWAL = Number(process.env.MIN_WITHDRAWAL_BTC || 0.001);
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET === "replace-this-with-a-long-random-secret") {
  if (IS_PRODUCTION) {
    throw new Error("Set a strong SESSION_SECRET before production deployment.");
  }
  console.warn("WARNING: Set a private SESSION_SECRET in .env before deployment.");
}

if (!process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD === "CHANGE_THIS_ADMIN_PASSWORD") {
  throw new Error("Set ADMIN_PASSWORD in your .env file before starting BTPOOL.");
}

if (!Number.isFinite(MIN_WITHDRAWAL) || MIN_WITHDRAWAL <= 0) {
  throw new Error("MIN_WITHDRAWAL_BTC must be a positive number.");
}

const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "btpool.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
      CHECK(role IN ('user', 'admin')),
    balance REAL NOT NULL DEFAULT 0 CHECK(balance >= 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK(status IN ('pending', 'paid', 'rejected')),
    admin_note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS balance_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    reason TEXT NOT NULL,
    admin_user TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
  );
`);

const adminUsername = String(process.env.ADMIN_USERNAME || "admin").trim();
const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12);
const existingAdmin = db.prepare(
  "SELECT id FROM users WHERE user_id = ?"
).get(adminUsername);

if (!existingAdmin) {
  db.prepare(`
    INSERT INTO users (user_id, password_hash, role, balance)
    VALUES (?, ?, 'admin', 0)
  `).run(adminUsername, adminHash);
} else {
  db.prepare(`
    UPDATE users SET password_hash = ?, role = 'admin'
    WHERE user_id = ?
  `).run(adminHash, adminUsername);
}

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.coingecko.com"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.use(session({
  name: "btpool.sid",
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: IS_PRODUCTION,
    maxAge: 1000 * 60 * 60 * 12
  }
  // For production, replace the default MemoryStore with a persistent
  // session store such as a SQLite or Redis-backed store.
}));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 180,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false
}));

function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

function normalizeUserId(value) {
  return String(value || "").trim();
}

function validBtcAddress(value) {
  const address = String(value || "").trim();

  // Basic format check only; this does not prove the address is valid
  // or belongs to the user.
  return /^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,87})$/.test(address);
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return fail(res, 401, "ابتدا وارد حساب خود شوید.");
  }

  const user = db.prepare(`
    SELECT id, user_id, role, balance, created_at
    FROM users WHERE id = ?
  `).get(req.session.user.id);

  if (!user) {
    req.session.destroy(() => {});
    return fail(res, 401, "جلسه ورود معتبر نیست.");
  }

  req.currentUser = user;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.currentUser || req.currentUser.role !== "admin") {
    return fail(res, 403, "دسترسی فقط برای مدیر مجاز است.");
  }
  next();
}

function publicUser(user) {
  return {
    userId: user.user_id,
    role: user.role,
    balance: user.balance,
    createdAt: user.created_at
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "BTPOOL",
    miningPoolConnected: false,
    message: "پنل فعال است؛ اتصال واقعی استخر هنوز تنظیم نشده است."
  });
});

// Register: the Bitcoin address becomes the fixed user ID.
app.post("/api/auth/register", async (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const password = String(req.body.password || "");

  if (!validBtcAddress(userId)) {
    return fail(res, 400, "یک آدرس بیت‌کوین معتبر وارد کنید.");
  }

  if (password.length < 8 || password.length > 128) {
    return fail(res, 400, "رمز عبور باید حداقل ۸ کاراکتر باشد.");
  }

  const existing = db.prepare(
    "SELECT id FROM users WHERE user_id = ?"
  ).get(userId);

  if (existing) {
    return fail(res, 409, "این آدرس قبلاً ثبت‌نام کرده است.");
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = db.prepare(`
      INSERT INTO users (user_id, password_hash, role, balance)
      VALUES (?, ?, 'user', 0)
    `).run(userId, hash);

    req.session.user = { id: Number(result.lastInsertRowid) };

    return res.status(201).json({
      message: "حساب ساخته شد.",
      user: publicUser(db.prepare(`
        SELECT id, user_id, role, balance, created_at
        FROM users WHERE id = ?
      `).get(Number(result.lastInsertRowid)))
    });
  } catch (error) {
    if (String(error.code).includes("SQLITE_CONSTRAINT")) {
      return fail(res, 409, "این شناسه قبلاً ثبت شده است.");
    }
    console.error("Register error:", error);
    return fail(res, 500, "ساخت حساب انجام نشد.");
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const password = String(req.body.password || "");

  const user = db.prepare(
    "SELECT * FROM users WHERE user_id = ?"
  ).get(userId);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return fail(res, 401, "شناسه یا رمز عبور اشتباه است.");
  }

  // Rotate the session ID after successful authentication.
  req.session.regenerate((error) => {
    if (error) {
      return fail(res, 500, "ورود انجام نشد.");
    }

    req.session.user = { id: user.id };
    req.session.save((saveError) => {
      if (saveError) {
        return fail(res, 500, "ذخیره جلسه ورود انجام نشد.");
      }

      return res.json({
        message: "با موفقیت وارد شدید.",
        user: publicUser(user)
      });
    });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.currentUser) });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  req.session.destroy((error) => {
    if (error) return fail(res, 500, "خروج انجام نشد.");

    res.clearCookie("btpool.sid", {
      httpOnly: true,
      sameSite: "strict",
      secure: IS_PRODUCTION
    });

    return res.json({ message: "از حساب خارج شدید." });
  });
});

// User's own withdrawal history only.
app.get("/api/withdrawals", requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT id, amount, destination, status, admin_note,
           created_at AS createdAt, updated_at AS updatedAt
    FROM withdrawals
    WHERE user_id = ?
    ORDER BY id DESC LIMIT 100
  `).all(req.currentUser.user_id);

  res.json({ withdrawals: rows });
});

// Create a withdrawal request. Funds are deducted only when admin marks it paid.
app.post("/api/withdrawals", requireAuth, (req, res) => {
  if (req.currentUser.role !== "user") {
    return fail(res, 403, "این عملیات برای حساب کاربری عادی است.");
  }

  const amount = Number(req.body.amount);
  const destination = String(req.body.destination || "").trim();

  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
    return fail(
      res,
      400,
      `حداقل برداشت ${MIN_WITHDRAWAL} BTC است.`
    );
  }

  if (amount > 21000000) {
    return fail(res, 400, "مقدار برداشت نامعتبر است.");
  }

  if (!validBtcAddress(destination)) {
    return fail(res, 400, "آدرس مقصد از نظر قالب معتبر نیست.");
  }

  if (amount > req.currentUser.balance) {
    return fail(res, 400, "موجودی ثبت‌شده برای این برداشت کافی نیست.");
  }

  const result = db.prepare(`
    INSERT INTO withdrawals (user_id, amount, destination)
    VALUES (?, ?, ?)
  `).run(req.currentUser.user_id, amount, destination);

  res.status(201).json({
    message: "درخواست برداشت برای بررسی مدیر ثبت شد.",
    withdrawalId: Number(result.lastInsertRowid),
    status: "pending"
  });
});

// Admin: list users without exposing password hashes.
app.get("/api/admin/users", requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT user_id AS userId, role, balance, created_at AS createdAt
    FROM users ORDER BY id DESC LIMIT 500
  `).all();

  res.json({ users });
});

// Admin: list all withdrawal requests.
app.get("/api/admin/withdrawals", requireAuth, requireAdmin, (req, res) => {
  const withdrawals = db.prepare(`
    SELECT id, user_id AS userId, amount, destination, status,
           admin_note AS adminNote,
           created_at AS createdAt, updated_at AS updatedAt
    FROM withdrawals ORDER BY id DESC LIMIT 500
  `).all();

  res.json({ withdrawals });
});

// Admin: manually credit a user's site balance.
// This is an internal ledger adjustment, not an on-chain deposit.
app.post("/api/admin/credit", requireAuth, requireAdmin, (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const amount = Number(req.body.amount);
  const reason = String(req.body.reason || "Admin balance adjustment").trim().slice(0, 200);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
    return fail(res, 400, "مقدار افزایش موجودی نامعتبر است.");
  }

  const user = db.prepare(
    "SELECT user_id, role FROM users WHERE user_id = ?"
  ).get(userId);

  if (!user || user.role !== "user") {
    return fail(res, 404, "کاربر عادی پیدا نشد.");
  }

  const credit = db.transaction(() => {
    db.prepare("UPDATE users SET balance = balance + ? WHERE user_id = ?")
      .run(amount, userId);

    db.prepare(`
      INSERT INTO balance_log (user_id, amount, reason, admin_user)
      VALUES (?, ?, ?, ?)
    `).run(userId, amount, reason, req.currentUser.user_id);
  });

  credit();

  const updated = db.prepare(
    "SELECT balance FROM users WHERE user_id = ?"
  ).get(userId);

  res.json({
    message: "موجودی ثبت‌شده به‌روزرسانی شد.",
    userId,
    balance: updated.balance
  });
});

// Admin: approve, reject, or mark paid.
// Once paid, a request cannot be reopened, preventing duplicate deductions.
app.patch(
  "/api/admin/withdrawals/:id",
  requireAuth,
  requireAdmin,
  (req, res) => {
    const id = Number(req.params.id);
    const status = String(req.body.status || "");
    const note = String(req.body.adminNote || "").trim().slice(0, 500);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return fail(res, 400, "شناسه درخواست نامعتبر است.");
    }

    if (!["pending", "paid", "rejected"].includes(status)) {
      return fail(res, 400, "وضعیت درخواست نامعتبر است.");
    }

    try {
      const update = db.transaction(() => {
        const withdrawal = db.prepare(
          "SELECT * FROM withdrawals WHERE id = ?"
        ).get(id);

        if (!withdrawal) {
          throw new Error("NOT_FOUND");
        }

        if (withdrawal.status === "paid") {
          throw new Error("ALREADY_PAID");
        }

        if (status === "paid") {
          const user = db.prepare(
            "SELECT balance FROM users WHERE user_id = ?"
          ).get(withdrawal.user_id);

          if (!user || user.balance < withdrawal.amount) {
            throw new Error("INSUFFICIENT_BALANCE");
          }

          db.prepare(`
            UPDATE users SET balance = balance - ?
            WHERE user_id = ?
          `).run(withdrawal.amount, withdrawal.user_id);

          db.prepare(`
            INSERT INTO balance_log (user_id, amount, reason, admin_user)
            VALUES (?, ?, ?, ?)
          `).run(
            withdrawal.user_id,
            -withdrawal.amount,
            `Withdrawal #${id} marked paid`,
            req.currentUser.user_id
          );
        }

        db.prepare(`
          UPDATE withdrawals
          SET status = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(status, note, id);
      });

      update();

      return res.json({
        message: "وضعیت درخواست به‌روزرسانی شد.",
        id,
        status
      });
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return fail(res, 404, "درخواست پیدا نشد.");
      }
      if (error.message === "ALREADY_PAID") {
        return fail(res, 409, "درخواست پرداخت‌شده قابل بازگشایی نیست.");
      }
      if (error.message === "INSUFFICIENT_BALANCE") {
        return fail(res, 409, "موجودی کاربر برای ثبت پرداخت کافی نیست.");
      }

      console.error("Withdrawal update error:", error);
      return fail(res, 500, "به‌روزرسانی درخواست انجام نشد.");
    }
  }
);

// Placeholder stats until a real, authorized PECPool integration is configured.
app.get("/api/mining/stats", requireAuth, (req, res) => {
  res.json({
    connected: false,
    hashrate: null,
    workers: null,
    earnings24h: null,
    earnings7d: null,
    earnings30d: null,
    message: "آمار واقعی استخراج هنوز به PECPool متصل نشده است."
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*path", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return fail(res, 404, "مسیر API پیدا نشد.");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"), (error) => {
    if (error) next(error);
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);
  if (res.headersSent) return next(error);
  return fail(res, 500, "خطای داخلی سرور.");
});

app.listen(PORT, () => {
  console.log(`BTPOOL is running on http://localhost:${PORT}`);
  console.log(`Minimum withdrawal: ${MIN_WITHDRAWAL} BTC`);
});
