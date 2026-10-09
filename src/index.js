
const html = String.raw`<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#071a35">
<title>BTPOOL | Bitcoin Mining Pool</title>
<style>
:root{color-scheme:dark;--bg:#071326;--panel:#10213b;--line:#243b5d;--blue:#2684ff;--text:#edf4ff;--muted:#9aacc8;--green:#35d49a}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(140deg,#071326,#0b2040);color:var(--text);font-family:Tahoma,Arial,sans-serif;min-height:100vh}
header{padding:22px 16px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.logo{font-size:25px;font-weight:900;color:#62a7ff;letter-spacing:1px}.sub{font-size:12px;color:var(--muted);margin-top:5px}
main{max-width:1050px;margin:25px auto;padding:0 15px}.panel,.stat{background:rgba(16,33,59,.94);border:1px solid var(--line);border-radius:15px;padding:19px;margin-bottom:15px}
h2{font-size:19px;margin:0 0 17px}h3{font-size:15px;margin:0 0 12px}
input,select,button{width:100%;padding:13px;border-radius:9px;border:1px solid #314969;background:#09172c;color:var(--text);font:inherit;margin:6px 0}
button{background:var(--blue);border:0;font-weight:bold;cursor:pointer}button.secondary{background:#233956}button.danger{background:#a83245}
label{font-size:13px;color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:13px}
.stat small{color:var(--muted)}.value{font-size:21px;font-weight:bold;margin-top:12px;overflow-wrap:anywhere}
.muted{color:var(--muted);font-size:13px;line-height:1.9}.good{color:var(--green)}.warn{color:#ffc76b}
.hidden{display:none!important}.row{display:flex;gap:10px;flex-wrap:wrap}.row>*{flex:1;min-width:120px}
pre{white-space:pre-wrap;overflow-wrap:anywhere;direction:ltr;text-align:left;background:#061020;padding:13px;border-radius:9px;color:#9ed0ff}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:10px;border-bottom:1px solid var(--line);text-align:right;overflow-wrap:anywhere}
.tablewrap{overflow-x:auto}.notice{padding:12px;border-radius:9px;background:#172e4d;margin:12px 0;font-size:13px;line-height:1.9}
footer{text-align:center;color:var(--muted);padding:28px;font-size:12px}
</style>
</head>
<body>
<header><div><div class="logo">BTPOOL</div><div class="sub">Bitcoin Mining Pool</div></div><div id="headStatus" class="muted">سیستم آماده است</div></header>
<main>
<section id="auth">
<div class="panel">
<h2>ورود به حساب</h2>
<label>آدرس بیت‌کوین (شناسه ثابت حساب)</label>
<input id="loginAddress" autocomplete="username" placeholder="آدرس BTC">
<label>رمز عبور</label>
<input id="loginPassword" type="password" autocomplete="current-password" placeholder="رمز عبور">
<button onclick="login()">ورود</button>
</div>
<div class="panel">
<h2>ساخت حساب جدید</h2>
<label>آدرس بیت‌کوین</label>
<input id="regAddress" autocomplete="username" placeholder="آدرس دریافت BTC">
<label>رمز عبور (حداقل ۱۰ نویسه)</label>
<input id="regPassword" type="password" autocomplete="new-password" minlength="10" placeholder="یک رمز قوی انتخاب کن">
<button onclick="register()">ثبت‌نام</button>
<p class="muted">آدرس بیت‌کوین شناسه حساب شما خواهد بود. برای امنیت بیشتر، رمز منحصربه‌فرد انتخاب کن.</p>
</div>
</section>

<section id="dashboard" class="hidden">
<div class="panel">
<div class="row"><div><h2>داشبورد BTPOOL</h2><div id="accountAddress" class="muted"></div></div><div><button class="secondary" onclick="logout()">خروج از حساب</button></div></div>
<div class="notice">وضعیت استخراج: <strong id="miningStatus" class="warn">هنوز به داده زنده PECPool متصل نشده‌ایم</strong><br>آمار واقعی هش‌ریت و درآمد فقط پس از اتصال API معتبر نمایش داده می‌شود.</div>
</div>
<div class="grid">
<div class="stat"><small>هش‌ریت فعلی</small><div class="value">—</div><div class="muted">در انتظار API واقعی</div></div>
<div class="stat"><small>هش‌ریت ۲۴ ساعته</small><div class="value">—</div><div class="muted">در انتظار API واقعی</div></div>
<div class="stat"><small>کارگران فعال</small><div class="value">—</div><div class="muted">در انتظار API واقعی</div></div>
<div class="stat"><small>موجودی حساب</small><div class="value" id="balance">0 BTC</div><div class="muted">موجودی داخلی ثبت‌شده در BTPOOL</div></div>
</div>
<div class="panel">
<h2>اتصال ماینر</h2>
<p class="muted">نام کاربری ماینر را دقیقاً مطابق الگوی زیر وارد کن. اتصال واقعی به استخر باید توسط ماینر انجام شود.</p>
<label>نام کاربری / Worker</label><pre id="worker"></pre>
<label>رمز استخر</label><pre>x</pre>
<h3>آدرس‌های اتصال ارائه‌شده برای PECPool</h3>
<label>ایران</label><pre>btc-ir.pecpool.com:8443</pre>
<label>روسیه</label><pre>btc-ru.pecpool.com:3333</pre>
<label>آسیا</label><pre>btc-as.pecpool.com:8443</pre>
<p class="muted">این نشانی‌ها هنوز از داخل این داشبورد تأیید زنده نشده‌اند؛ پیش از استفاده، پورت و آدرس را در راهنمای رسمی استخر بررسی کن.</p>
</div>
<div class="panel">
<h2>درخواست برداشت</h2>
<p class="muted">حداقل برداشت ۰٫۰۰۱ بیت‌کوین است. درخواست برای بررسی مدیر ثبت می‌شود و به معنی پرداخت خودکار نیست.</p>
<label>مبلغ به BTC</label><input id="withdrawAmount" type="number" min="0.001" step="0.00000001" placeholder="0.001">
<label>آدرس مقصد بیت‌کوین</label><input id="withdrawAddress" placeholder="آدرس BTC مقصد">
<button onclick="withdraw()">ثبت درخواست برداشت</button>
<div id="withdrawMsg" class="muted"></div>
</div>
<div class="panel"><h2>تاریخچه برداشت‌ها</h2><div id="myWithdrawals" class="muted">در حال بارگذاری...</div></div>
<div id="adminPanel" class="panel hidden">
<h2>مدیریت درخواست‌های برداشت</h2><p class="muted">درخواست‌ها را بررسی کن. تأیید در این پنل به معنی ارسال واقعی بیت‌کوین نیست.</p>
<button class="secondary" onclick="loadAdmin()">به‌روزرسانی درخواست‌ها</button><div id="adminWithdrawals" class="tablewrap"></div>
</div>
</section>
<div id="message" class="notice hidden" role="status"></div>
</main>
<footer>BTPOOL · Bitcoin Mining Pool · آمار واقعی استخراج نیازمند اتصال API معتبر است.</footer>
<script>
let token = localStorage.getItem("btpool_token") || "";
let me = null;
const $ = id => document.getElementById(id);
function msg(s){$("message").textContent=s;$("message").classList.remove("hidden")}
function clearMsg(){$("message").classList.add("hidden")}
async function api(path,method="GET",body){
 const headers={"Content-Type":"application/json"};
 if(token) headers.Authorization="Bearer "+token;
 const res=await fetch(path,{method,headers,body:body?JSON.stringify(body):undefined});
 let data={};try{data=await res.json()}catch{}
 if(!res.ok)throw new Error(data.error||"خطا در ارتباط با سرور");
 return data;
}
async function register(){
 clearMsg();
 const address=$("regAddress").value.trim(),password=$("regPassword").value;
 if(!address||password.length<10)return msg("آدرس و رمز حداقل ۱۰ نویسه‌ای را وارد کن.");
 try{const d=await api("/api/register","POST",{address,password});token=d.token;localStorage.setItem("btpool_token",token);await loadMe();msg("حساب با موفقیت ساخته شد.");}
 catch(e){msg(e.message)}
}
async function login(){
 clearMsg();
 const address=$("loginAddress").value.trim(),password=$("loginPassword").value;
 if(!address||!password)return msg("آدرس و رمز عبور را وارد کن.");
 try{const d=await api("/api/login","POST",{address,password});token=d.token;localStorage.setItem("btpool_token",token);await loadMe();msg("ورود موفق بود.");}
 catch(e){msg(e.message)}
}
async function logout(){
 try{await api("/api/logout","POST",{})}catch{}
 token="";me=null;localStorage.removeItem("btpool_token");showAuth();msg("از حساب خارج شدی.");
}
function showAuth(){$("auth").classList.remove("hidden");$("dashboard").classList.add("hidden");$("headStatus").textContent="سیستم آماده است"}
async function loadMe(){
 const d=await api("/api/me");me=d.user;
 $("auth").classList.add("hidden");$("dashboard").classList.remove("hidden");
 $("accountAddress").textContent=me.address;
 $("worker").textContent="btpool."+me.address;
 $("balance").textContent=(Number(me.balance_satoshis||0)/100000000).toFixed(8)+" BTC";
 $("headStatus").textContent=me.role==="admin"?"مدیر":"حساب کاربری";
 $("adminPanel").classList.toggle("hidden",me.role!=="admin");
 await loadWithdrawals();if(me.role==="admin")await loadAdmin();
}
async function withdraw(){
 $("withdrawMsg").textContent="";
 const amount=Number($("withdrawAmount").value),address=$("withdrawAddress").value.trim();
 if(!Number.isFinite(amount)||amount<0.001)return $("withdrawMsg").textContent="حداقل برداشت 0.001 BTC است.";
 if(!address)return $("withdrawMsg").textContent="آدرس مقصد را وارد کن.";
 try{await api("/api/withdrawals","POST",{amount,address});$("withdrawMsg").textContent="درخواست برای بررسی مدیر ثبت شد.";await loadWithdrawals();}
 catch(e){$("withdrawMsg").textContent=e.message}
}
async function loadWithdrawals(){
 const d=await api("/api/withdrawals");
 if(!d.items.length){$("myWithdrawals").textContent="هنوز درخواستی ثبت نشده است.";return}
 $("myWithdrawals").innerHTML="<div class='tablewrap'><table><tr><th>مبلغ BTC</th><th>آدرس مقصد</th><th>وضعیت</th><th>تاریخ</th></tr>"+d.items.map(x=>"<tr><td>"+(Number(x.amount_satoshis)/1e8).toFixed(8)+"</td><td>"+esc(x.address)+"</td><td>"+esc(x.status)+"</td><td>"+esc(x.created_at||"")+"</td></tr>").join("")+"</table></div>";
}
async function loadAdmin(){
 if(!me||me.role!=="admin")return;
 try{
 const d=await api("/api/admin/withdrawals");
 if(!d.items.length){$("adminWithdrawals").textContent="درخواستی وجود ندارد.";return}
 $("adminWithdrawals").innerHTML="<table><tr><th>کاربر</th><th>مبلغ</th><th>مقصد</th><th>وضعیت</th><th>عملیات</th></tr>"+d.items.map(x=>"<tr><td>"+esc(x.username)+"</td><td>"+(Number(x.amount_satoshis)/1e8).toFixed(8)+" BTC</td><td>"+esc(x.address)+"</td><td>"+esc(x.status)+"</td><td>"+(x.status==="pending"?"<button onclick='review("+x.id+",\"approved\")'>تأیید</button><button class='danger' onclick='review("+x.id+",\"rejected\")'>رد</button>":"—")+"</td></tr>").join("")+"</table>";
 }catch(e){$("adminWithdrawals").textContent=e.message}
}
async function review(id,status){
 try{await api("/api/admin/withdrawals","PATCH",{id,status});await loadAdmin();await loadWithdrawals();msg("وضعیت درخواست تغییر کرد.")}
 catch(e){msg(e.message)}
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
(async()=>{if(token){try{await loadMe()}catch(e){token="";localStorage.removeItem("btpool_token");showAuth()}}})();
</script>
</body></html>`;

const encoder = new TextEncoder();
const MIN_WITHDRAWAL = 100000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function digest(value) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes = 32) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return [...a].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: encoder.encode(salt),
    iterations: 210000,
    hash: "SHA-256"
  }, key, 256);
  return [...new Uint8Array(bits)].map(x => x.toString(16).padStart(2, "0")).join("");
}

function validAddress(a) {
  if (typeof a !== "string" || a.length < 14 || a.length > 90) return false;
  return /^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[ac-hj-np-z02-9]{11,71})$/.test(a);
}

async function initDB(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount_satoshis INTEGER NOT NULL CHECK(amount_satoshis > 0),
    address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount_satoshis INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`).run();
  // Additive migration only; existing users and tables are not dropped.
  const columns = await db.prepare("PRAGMA table_info(users)").all();
  const names = (columns.results || []).map(c => c.name);
  if (!names.includes("address")) {
    await db.prepare("ALTER TABLE users ADD COLUMN address TEXT").run();
  }
  if (!names.includes("salt")) {
    await db.prepare("ALTER TABLE users ADD COLUMN salt TEXT").run();
  }
}

async function createSession(db, userId) {
  const token = randomHex(32);
  const tokenHash = await digest(token);
  const expires = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  await db.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)")
    .bind(tokenHash, userId, expires).run();
  return token;
}

async function currentUser(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const tokenHash = await digest(token);
  const now = Math.floor(Date.now() / 1000);
  return await env.DB.prepare(
    `SELECT u.id,u.username,u.address,u.role,u.balance_satoshis
     FROM sessions s JOIN users u ON u.id=s.user_id
     WHERE s.token_hash=? AND s.expires_at>?`
  ).bind(tokenHash, now).first();
}

async function handle(request, env) {
  if (!env.DB) return json({error:"اتصال دیتابیس D1 با نام DB تنظیم نشده است."},500);
  await initDB(env.DB);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === "/api/health") {
    await env.DB.prepare("SELECT 1").first();
    return json({ok:true,service:"BTPOOL",database:"connected"});
  }

  if (path === "/api/register" && method === "POST") {
    const b = await request.json();
    const address = String(b.address || "").trim();
    const password = String(b.password || "");
    if (!validAddress(address)) return json({error:"فرمت آدرس بیت‌کوین معتبر نیست."},400);
    if (password.length < 10 || password.length > 200)
      return json({error:"رمز عبور باید حداقل ۱۰ نویسه داشته باشد."},400);
    const exists = await env.DB.prepare("SELECT id FROM users WHERE username=? OR address=?")
      .bind(address,address).first();
    if (exists) return json({error:"این آدرس قبلاً ثبت‌نام کرده است. وارد حساب شو."},409);
    const salt = randomHex(16);
    const hash = await passwordHash(password,salt);
    const isAdmin = Boolean(env.ADMIN_BTC_ADDRESS && env.ADMIN_PASSWORD &&
      address.toLowerCase() === env.ADMIN_BTC_ADDRESS.trim().toLowerCase() &&
      password === env.ADMIN_PASSWORD);
    const role = isAdmin ? "admin" : "user";
    const result = await env.DB.prepare(
      "INSERT INTO users(username,password_hash,role,address,salt) VALUES(?,?,?,?,?)"
    ).bind(address,hash,role,address,salt).run();
    const token = await createSession(env.DB,result.meta.last_row_id);
    return json({ok:true,token});
  }

  if (path === "/api/login" && method === "POST") {
    const b = await request.json();
    const address = String(b.address || "").trim();
    const password = String(b.password || "");
    const user = await env.DB.prepare(
      "SELECT id,password_hash,salt FROM users WHERE username=? OR address=?"
    ).bind(address,address).first();
    if (!user || !user.salt) return json({error:"آدرس یا رمز عبور اشتباه است."},401);
    const hash = await passwordHash(password,user.salt);
    if (hash !== user.password_hash) return json({error:"آدرس یا رمز عبور اشتباه است."},401);
    const token = await createSession(env.DB,user.id);
    return json({ok:true,token});
  }

  if (path === "/api/me" && method === "GET") {
    const u = await currentUser(request,env);
    if (!u) return json({error:"نشست ورود معتبر نیست؛ دوباره وارد شو."},401);
    return json({user:{id:u.id,address:u.address || u.username,role:u.role,balance_satoshis:u.balance_satoshis || 0}});
  }

  if (path === "/api/logout" && method === "POST") {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();
    return json({ok:true});
  }

  if (path === "/api/withdrawals" && method === "GET") {
    const u = await currentUser(request,env);
    if (!u) return json({error:"ابتدا وارد حساب شو."},401);
    const items = await env.DB.prepare(
      "SELECT id,amount_satoshis,address,status,created_at FROM withdrawals WHERE user_id=? ORDER BY id DESC LIMIT 100"
    ).bind(u.id).all();
    return json({items:items.results || []});
  }

  if (path === "/api/withdrawals" && method === "POST") {
    const u = await currentUser(request,env);
    if (!u) return json({error:"ابتدا وارد حساب شو."},401);
    const b = await request.json();
    const amount = Number(b.amount);
    const address = String(b.address || "").trim();
    if (!Number.isFinite(amount) || amount < 0.001 || amount > 21_000_000)
      return json({error:"حداقل برداشت 0.001 BTC است."},400);
    if (!validAddress(address)) return json({error:"فرمت آدرس مقصد بیت‌کوین معتبر نیست."},400);
    const satoshis = Math.round(amount * 100000000);
    await env.DB.prepare(
      "INSERT INTO withdrawals(user_id,amount_satoshis,address,status) VALUES(?,?,?,'pending')"
    ).bind(u.id,satoshis,address).run();
    return json({ok:true});
  }

  if (path === "/api/admin/withdrawals" && method === "GET") {
    const u = await currentUser(request,env);
    if (!u || u.role !== "admin") return json({error:"دسترسی مدیر لازم است."},403);
    const items = await env.DB.prepare(
      `SELECT w.id,w.user_id,w.amount_satoshis,w.address,w.status,w.created_at,u.username
       FROM withdrawals w JOIN users u ON u.id=w.user_id ORDER BY w.id DESC LIMIT 300`
    ).all();
    return json({items:items.results || []});
  }

  if (path === "/api/admin/withdrawals" && method === "PATCH") {
    const u = await currentUser(request,env);
    if (!u || u.role !== "admin") return json({error:"دسترسی مدیر لازم است."},403);
    const b = await request.json();
    const id = Number(b.id);
    const status = String(b.status || "");
    if (!Number.isSafeInteger(id) || id < 1 || !["approved","rejected"].includes(status))
      return json({error:"درخواست یا وضعیت نامعتبر است."},400);
    const result = await env.DB.prepare(
      "UPDATE withdrawals SET status=? WHERE id=? AND status='pending'"
    ).bind(status,id).run();
    if (!result.meta.changes) return json({error:"درخواست پیدا نشد یا قبلاً بررسی شده است."},409);
    return json({ok:true});
  }

  if (path.startsWith("/api/")) return json({error:"مسیر API پیدا نشد."},404);
  return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request,env);
    } catch (e) {
      console.error("BTPOOL error:",e && e.stack ? e.stack : e);
      return json({error:"خطای داخلی سرور. لاگ‌های Cloudflare را بررسی کن."},500);
    }
  }
};
