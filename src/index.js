
const encoder = new TextEncoder();
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });

const html = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BTPOOL | Bitcoin Mining</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#07140e;color:#e8f8ed;font-family:Arial,sans-serif}
header{padding:18px;background:#10271a;border-bottom:1px solid #245c3a}
h1{margin:0;color:#5cff8b;font-size:25px}
main{max-width:850px;margin:auto;padding:18px}
.card{background:#10271a;border:1px solid #245c3a;border-radius:16px;padding:18px;margin:14px 0}
input,button,select{width:100%;padding:13px;margin:7px 0;border-radius:9px;border:1px solid #326947;background:#07140e;color:white;font-size:15px}
button{background:#28bd60;color:#031309;font-weight:bold;border:0;cursor:pointer}
button.secondary{background:#214532;color:white}
button.danger{background:#9c3535;color:white}
.small{font-size:13px;color:#a8c8b2;line-height:1.8}
.hidden{display:none!important}
.stat{padding:13px;background:#0a1c12;border-radius:10px;margin:8px 0}
.stat strong{color:#61ff92}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#061009;padding:12px;border-radius:8px;direction:ltr;text-align:left}
.item{border-bottom:1px solid #285239;padding:12px 0;overflow-wrap:anywhere}
#message{white-space:pre-wrap;color:#7dff9d}
</style>
</head>
<body>
<header><h1>₿ BTPOOL</h1><div class="small">Bitcoin mining dashboard</div></header>
<main>
<div id="auth">
 <div class="card">
  <h2 id="authTitle">ورود به حساب</h2>
  <p class="small">آدرس بیت‌کوین شناسهٔ ثابت حساب شماست.</p>
  <form id="authForm">
   <input id="btc" placeholder="Bitcoin address" required autocomplete="username">
   <input id="password" type="password" placeholder="Password" required minlength="10" autocomplete="current-password">
   <button id="authSubmit">ورود</button>
  </form>
  <button class="secondary" id="toggle">ایجاد حساب جدید</button>
 </div>
</div>

<div id="app" class="hidden">
 <div class="card">
  <h2>داشبورد استخراج</h2>
  <div class="stat">شناسه: <strong id="userAddress"></strong></div>
  <div class="stat">Hashrate: <strong>در انتظار اتصال API است</strong></div>
  <div class="stat">درآمد استخراج: <strong>در انتظار دادهٔ واقعی است</strong></div>
  <div class="stat">Workers: <strong>در انتظار اتصال API است</strong></div>
  <p class="small">اطلاعات هش‌ریت و درآمد تا زمان اتصال تأییدشده به API رسمی استخر نمایش داده نمی‌شوند.</p>
 </div>

 <div class="card">
  <h3>راهنمای اتصال ماینر</h3>
  <p class="small">این نمونه آدرس‌ها را از تنظیمات قبلی پروژه گرفته است؛ پیش از استفاده، آدرس و پورت را در راهنمای رسمی PECPool بررسی کن.</p>
  <div class="small">Stratum URL</div>
  <pre>stratum+tcp://btc-ru.pecpool.com:3333</pre>
  <div class="small">Worker / Username</div>
  <pre id="worker"></pre>
  <div class="small">Password: x (فقط اگر استخر پشتیبانی کند)</div>
  <button class="secondary" id="copyWorker">کپی نام Worker</button>
 </div>

 <div class="card">
  <h3>درخواست برداشت</h3>
  <form id="withdrawForm">
   <input id="amount" type="number" min="0.00000001" step="0.00000001" placeholder="مقدار BTC" required>
   <input id="destination" placeholder="آدرس مقصد بیت‌کوین" required>
   <button>ثبت درخواست برداشت</button>
  </form>
  <p class="small">ثبت درخواست به معنی پرداخت نیست؛ درخواست باید توسط مدیریت بررسی شود. موجودی واقعی استخر هنوز به این حساب متصل نیست.</p>
 </div>

 <div class="card">
  <h3>تاریخچه درخواست‌ها</h3>
  <button class="secondary" id="refresh">به‌روزرسانی</button>
  <div id="history"></div>
 </div>

 <div class="card hidden" id="admin">
  <h3>پنل مدیریت</h3>
  <div id="adminHistory"></div>
 </div>
 <div class="card">
  <button class="danger" id="logout">خروج از حساب</button>
 </div>
</div>
<p id="message"></p>
</main>
<script>
const $=id=>document.getElementById(id);
let token="", registering=false, isAdmin=false;

function msg(s){$("message").textContent=s}
async function api(path,method="GET",body){
 const r=await fetch(path,{
  method,
  headers:{
   "content-type":"application/json",
   ...(token?{authorization:"Bearer "+token}:{})
  },
  ...(body?{body:JSON.stringify(body)}:{})
 });
 const d=await r.json().catch(()=>({error:"پاسخ سرور قابل خواندن نیست"}));
 if(!r.ok)throw Error(d.error||"خطای سرور");
 return d;
}
function showApp(user){
 $("auth").classList.add("hidden");
 $("app").classList.remove("hidden");
 $("userAddress").textContent=user.address;
 $("worker").textContent="btpool."+user.address;
 isAdmin=user.role==="admin";
 $("admin").classList.toggle("hidden",!isAdmin);
 loadHistory();
}
$("toggle").onclick=()=>{
 registering=!registering;
 $("authTitle").textContent=registering?"ایجاد حساب":"ورود به حساب";
 $("authSubmit").textContent=registering?"ثبت‌نام":"ورود";
 $("password").autocomplete=registering?"new-password":"current-password";
 $("toggle").textContent=registering?"بازگشت به ورود":"ایجاد حساب جدید";
 msg("");
};
$("authForm").onsubmit=async e=>{
 e.preventDefault();msg("در حال بررسی...");
 try{
  const d=await api(registering?"/api/register":"/api/login","POST",{
   address:$("btc").value.trim(),
   password:$("password").value
  });
  token=d.token;
  showApp(d.user);
  msg("ورود موفق بود.");
 }catch(err){msg(err.message)}
};
$("logout").onclick=async()=>{
 try{await api("/api/logout","POST",{})}catch(e){}
 token="";
 $("app").classList.add("hidden");
 $("auth").classList.remove("hidden");
 msg("از حساب خارج شدی.");
};
$("copyWorker").onclick=async()=>{
 try{await navigator.clipboard.writeText($("worker").textContent);msg("نام Worker کپی شد")}
 catch(e){msg($("worker").textContent)}
};
$("withdrawForm").onsubmit=async e=>{
 e.preventDefault();
 try{
  const d=await api("/api/withdrawals","POST",{
   amount:$("amount").value,
   address:$("destination").value.trim()
  });
  msg("درخواست ثبت شد. شماره: "+d.id);
  $("withdrawForm").reset();
  loadHistory();
 }catch(err){msg(err.message)}
};
$("refresh").onclick=loadHistory;
async function loadHistory(){
 try{
  const d=await api("/api/withdrawals");
  $("history").innerHTML=d.items.length?d.items.map(x=>
   '<div class="item">مقدار: '+x.amount_btc+' BTC<br>مقصد: '+esc(x.address)+
   '<br>وضعیت: '+esc(x.status)+'<br>زمان: '+esc(x.created_at)+'</div>'
  ).join(""):"هنوز درخواستی ثبت نشده است.";
  if(isAdmin){
   const a=await api("/api/admin/withdrawals");
   $("adminHistory").innerHTML=a.items.length?a.items.map(x=>
    '<div class="item">شناسه: '+x.id+'<br>کاربر: '+esc(x.user_address)+
    '<br>مقدار: '+x.amount_btc+' BTC<br>مقصد: '+esc(x.address)+
    '<br>وضعیت: '+esc(x.status)+
    (x.status==="pending"?
     '<button onclick="review('+x.id+',\\'approved\\')">تأیید</button>'+
     '<button class="danger" onclick="review('+x.id+',\\'rejected\\')">رد</button>':'')+
    '</div>'
   ).join(""):"درخواستی وجود ندارد.";
  }
 }catch(e){msg(e.message)}
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.review=async(id,status)=>{
 try{await api("/api/admin/withdrawals/"+id,"PATCH",{status});msg("وضعیت درخواست تغییر کرد");loadHistory()}
 catch(e){msg(e.message)}
};
</script>
</body>
</html>`;

async function hashText(s) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(s));
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: encoder.encode(salt),
    iterations: 150000,
    hash: "SHA-256"
  }, key, 256);
  return [...new Uint8Array(bits)].map(x => x.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes = 32) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return [...a].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function initDB(db) {
  const sql = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL UNIQUE,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount_satoshis INTEGER NOT NULL CHECK(amount_satoshis > 0),
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`
  ];
  for (const statement of sql) await db.prepare(statement).run();
}

async function createSession(db, user) {
  const token = randomHex(32);
  await db.prepare(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)"
  ).bind(await hashText(token), user.id, Math.floor(Date.now()/1000)+604800).run();
  return token;
}

async function currentUser(request, db) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const h = await hashText(token);
  const row = await db.prepare(
    `SELECT users.id,users.address,users.role
     FROM sessions JOIN users ON users.id=sessions.user_id
     WHERE sessions.token_hash=? AND sessions.expires_at>?`
  ).bind(h, Math.floor(Date.now()/1000)).first();
  return row || null;
}

function validAddress(s) {
  return typeof s === "string" && /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(s);
}

export default {
 async fetch(request, env) {
  try {
   if (!env.DB) return json({error:"اتصال دیتابیس D1 با نام DB تنظیم نشده است."},500);
   await initDB(env.DB);

   const url = new URL(request.url);
   const path = url.pathname;
   const method = request.method;

   if (method==="GET" && path==="/api/health")
    return json({ok:true,service:"BTPOOL",database:"connected"});

   if (method==="GET" && path==="/")
    return new Response(html,{headers:{"content-type":"text/html; charset=utf-8"}});

   if (method==="POST" && path==="/api/register") {
    const b=await request.json();
    const address=String(b.address||"").trim();
    const password=String(b.password||"");
    if (!validAddress(address)) return json({error:"آدرس معتبر Bitcoin وارد کن."},400);
    if (password.length<10) return json({error:"رمز باید حداقل ۱۰ کاراکتر باشد."},400);
    if (env.ADMIN_BTC_ADDRESS && address===env.ADMIN_BTC_ADDRESS)
      return json({error:"این آدرس برای ثبت‌نام عمومی مجاز نیست."},400);
    const salt=randomHex(16), ph=await passwordHash(password,salt);
    try {
      await env.DB.prepare(
       "INSERT INTO users(address,salt,password_hash) VALUES(?,?,?)"
      ).bind(address,salt,ph).run();
    } catch(e) { return json({error:"این آدرس قبلاً ثبت‌نام کرده یا ذخیره‌سازی ناموفق بود."},409); }
    const user=await env.DB.prepare("SELECT id,address,role FROM users WHERE address=?").bind(address).first();
    return json({token:await createSession(env.DB,user),user:{address:user.address,role:user.role}});
   }

   if (method==="POST" && path==="/api/login") {
    const b=await request.json();
    const address=String(b.address||"").trim();
    const password=String(b.password||"");
    if (!address || !password) return json({error:"آدرس و رمز را وارد کن."},400);

    // Admin account is bootstrapped from Cloudflare secrets.
    if (env.ADMIN_BTC_ADDRESS && env.ADMIN_PASSWORD &&
        address===env.ADMIN_BTC_ADDRESS && password===env.ADMIN_PASSWORD) {
      let user=await env.DB.prepare("SELECT id,address,role FROM users WHERE address=?").bind(address).first();
      if (!user) {
        const salt=randomHex(16), ph=await passwordHash(password,salt);
        await env.DB.prepare(
         "INSERT INTO users(address,salt,password_hash,role) VALUES(?,?,?,'admin')"
        ).bind(address,salt,ph).run();
        user=await env.DB.prepare("SELECT id,address,role FROM users WHERE address=?").bind(address).first();
      } else {
        await env.DB.prepare("UPDATE users SET role='admin' WHERE id=?").bind(user.id).run();
        user.role="admin";
      }
      return json({token:await createSession(env.DB,user),user:{address:user.address,role:user.role}});
    }

    const user=await env.DB.prepare("SELECT * FROM users WHERE address=?").bind(address).first();
    if (!user || await passwordHash(password,user.salt)!==user.password_hash)
      return json({error:"آدرس یا رمز اشتباه است."},401);
    return json({token:await createSession(env.DB,user),user:{address:user.address,role:user.role}});
   }

   if (path==="/api/logout" && method==="POST") {
    const auth=request.headers.get("authorization")||"";
    if(auth.startsWith("Bearer "))
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?")
       .bind(await hashText(auth.slice(7))).run();
    return json({ok:true});
   }

   const user=await currentUser(request,env.DB);
   if (!user) return json({error:"ابتدا وارد حساب شو."},401);

   if (path==="/api/withdrawals" && method==="POST") {
    const b=await request.json();
    const amount=Number(b.amount);
    const destination=String(b.address||"").trim();
    if(!Number.isFinite(amount)||amount<=0||amount>21000000)
      return json({error:"مقدار BTC معتبر وارد کن."},400);
    if(!validAddress(destination))
      return json({error:"آدرس مقصد باید یک آدرس معمولی Bitcoin باشد."},400);
    const sats=Math.round(amount*100000000);
    if(sats<=0) return json({error:"مقدار بسیار کوچک است."},400);
    const result=await env.DB.prepare(
     "INSERT INTO withdrawals(user_id,amount_satoshis,address) VALUES(?,?,?)"
    ).bind(user.id,sats,destination).run();
    return json({ok:true,id:result.meta.last_row_id});
   }

   if(path==="/api/withdrawals" && method==="GET") {
    const result=await env.DB.prepare(
     "SELECT id,amount_satoshis,address,status,created_at FROM withdrawals WHERE user_id=? ORDER BY id DESC LIMIT 100"
    ).bind(user.id).all();
    return json({items:(result.results||[]).map(x=>({
     id:x.id,amount_btc:(x.amount_satoshis/100000000).toFixed(8),
     address:x.address,status:x.status,created_at:x.created_at
    }))});
   }

   if(path==="/api/admin/withdrawals" && method==="GET") {
    if(user.role!=="admin") return json({error:"دسترسی مدیریت لازم است."},403);
    const result=await env.DB.prepare(
     `SELECT w.id,w.amount_satoshis,w.address,w.status,w.created_at,u.address AS user_address
      FROM withdrawals w JOIN users u ON u.id=w.user_id ORDER BY w.id DESC LIMIT 200`
    ).all();
    return json({items:(result.results||[]).map(x=>({
     id:x.id,user_address:x.user_address,
     amount_btc:(x.amount_satoshis/100000000).toFixed(8),
     address:x.address,status:x.status,created_at:x.created_at
    }))});
   }

   if(path.startsWith("/api/admin/withdrawals/") && method==="PATCH") {
    if(user.role!=="admin") return json({error:"دسترسی مدیریت لازم است."},403);
    const id=Number(path.split("/").pop());
    const b=await request.json();
    if(!Number.isInteger(id)||!["approved","rejected"].includes(b.status))
      return json({error:"درخواست نامعتبر است."},400);
    const result=await env.DB.prepare(
     "UPDATE withdrawals SET status=? WHERE id=? AND status='pending'"
    ).bind(b.status,id).run();
    if(!result.meta.changes) return json({error:"درخواست پیدا نشد یا قبلاً بررسی شده است."},404);
    return json({ok:true});
   }

   return json({error:"مسیر پیدا نشد."},404);
  } catch (e) {
   return json({error:"خطای داخلی. اتصال D1 و تنظیمات را بررسی کن."},500);
  }
 }
};
