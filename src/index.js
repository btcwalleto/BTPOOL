const html = String.raw`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#eaf6ec">
<title>BTPOOL | Bitcoin Mining Pool</title>
<style>
:root{
 --bg:#eff8f0;--panel:#fff;--panel2:#f5fbf5;--text:#203c2a;
 --muted:#718477;--green:#348653;--green2:#247043;
 --border:#dcecdf;--danger:#c83d3d;--shadow:0 8px 28px #244f2c0d
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:Tahoma,Arial,sans-serif}
button,input,select{font:inherit}
button{cursor:pointer}
header{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:5}
.top{max-width:1150px;margin:auto;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.logo{display:flex;align-items:center;gap:10px}
.logo-icon{width:43px;height:43px;border-radius:14px;background:#e4f5e8;color:var(--green);display:grid;place-items:center;font-weight:bold;font-size:21px}
.logo strong{font-size:20px;letter-spacing:1px}
.logo small{display:block;color:var(--muted);font-size:11px;margin-top:4px}
.btn{border:0;border-radius:11px;padding:11px 15px;font-weight:bold}
.primary{background:var(--green);color:#fff}
.primary:hover{background:var(--green2)}
.secondary{background:#e9f5eb;color:var(--green2)}
.danger{background:#fff0f0;color:var(--danger)}
main{max-width:1150px;margin:24px auto;padding:0 16px 50px}
.hidden{display:none!important}
.card{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:20px;box-shadow:var(--shadow);min-width:0}
h1,h2,h3,p{margin-top:0}
h2{font-size:19px;margin-bottom:17px}
.muted{color:var(--muted);font-size:13px;line-height:1.9}
.auth{max-width:490px;margin:38px auto}
.tabs{display:flex;background:var(--panel2);border-radius:12px;padding:4px;margin-bottom:20px}
.tabs button{flex:1;border:0;border-radius:9px;padding:11px;background:transparent;color:var(--muted)}
.tabs button.active{background:var(--green);color:#fff}
.field{margin:13px 0}
label{display:block;font-size:13px;font-weight:bold;margin-bottom:8px}
input,select{width:100%;padding:13px;border:1px solid var(--border);background:#fbfefb;color:var(--text);border-radius:11px;outline:none}
input:focus,select:focus{border-color:var(--green)}
.hint{font-size:11px;color:var(--muted);margin-top:6px;line-height:1.8}
.full{width:100%}
.alert{padding:12px 14px;border-radius:11px;background:#eff8f0;color:var(--green2);font-size:13px;line-height:1.9;margin:12px 0}
.alert.error{background:#fff0f0;color:var(--danger)}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}
.stat{padding:17px}
.stat .label{font-size:12px;color:var(--muted)}
.stat .value{font-size:22px;font-weight:bold;margin-top:13px;overflow-wrap:anywhere}
.stat .sub{font-size:11px;color:var(--muted);margin-top:8px}
.dashboard-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:16px;margin-top:16px}
.connection{display:flex;align-items:center;gap:10px;background:var(--panel2);padding:13px;border-radius:12px;font-size:13px}
.dot{width:10px;height:10px;background:#a6b8aa;border-radius:50%;flex-shrink:0}
.dot.online{background:#35ad62;box-shadow:0 0 0 5px #35ad621b}
.linebox{height:110px;background:linear-gradient(180deg,#eff9f1,#fff);border-radius:13px;margin-top:14px;overflow:hidden}
.linebox svg{width:100%;height:100%}
.quick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.quick button{padding:13px 7px}
.menu{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.menu button{background:#fff;border:1px solid var(--border);color:var(--text);border-radius:10px;padding:10px 13px}
.menu button.active{background:#e2f3e6;color:var(--green2);border-color:#b8dfc0}
.section{margin-top:16px}
.worker{background:var(--panel2);padding:13px;border-radius:12px;margin-top:10px;overflow-wrap:anywhere;line-height:1.9}
.copy{border:0;border-radius:8px;background:#e2f3e6;color:var(--green2);padding:7px 10px;margin:5px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:right;padding:12px 8px;border-bottom:1px solid var(--border);vertical-align:top}
th{color:var(--muted);font-weight:normal}
.table-wrap{overflow:auto}
.badge{display:inline-block;padding:5px 9px;border-radius:8px;background:#edf7ee;color:var(--green2);font-size:11px}
.badge.pending{background:#fff5df;color:#8a6615}
.badge.rejected{background:#fff0f0;color:var(--danger)}
footer{text-align:center;color:var(--muted);font-size:12px;margin-top:30px;line-height:2}
@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.dashboard-grid{grid-template-columns:1fr}.stat .value{font-size:19px}}
@media(max-width:420px){.top{padding:11px}.logo strong{font-size:17px}.card{padding:15px}.grid{gap:9px}.stat{padding:12px}.stat .value{font-size:17px}}
</style>
</head>
<body>
<header>
 <div class="top">
  <div class="logo">
   <div class="logo-icon">₿</div>
   <div><strong>BTPOOL</strong><small>Bitcoin Mining Pool</small></div>
  </div>
  <button id="headerBtn" class="btn secondary" onclick="showAuth()">ورود / ثبت‌نام</button>
 </div>
</header>

<main>
<section id="auth" class="auth card">
 <h2>ورود به حساب BTPOOL</h2>
 <p class="muted">با آدرس بیت‌کوین و رمز عبور خود وارد شوید.</p>
 <div class="tabs">
  <button id="loginTab" class="active" onclick="setAuthMode('login')">ورود</button>
  <button id="registerTab" onclick="setAuthMode('register')">ثبت‌نام</button>
 </div>
 <form id="authForm">
  <div class="field">
   <label for="btcAddress">آدرس بیت‌کوین (شناسه ثابت شما)</label>
   <input id="btcAddress" name="address" placeholder="آدرس BTC خود را وارد کنید" autocomplete="off" required>
  </div>
  <div class="field">
   <label for="password">رمز عبور ۱۰ رقمی</label>
   <input id="password" name="password" type="password" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" placeholder="دقیقاً ۱۰ رقم" autocomplete="current-password" required>
   <div class="hint">رمز باید دقیقاً ۱۰ رقم انگلیسی باشد؛ مانند 1234567890.</div>
  </div>
  <div id="confirmField" class="field hidden">
   <label for="confirmPassword">تکرار رمز عبور</label>
   <input id="confirmPassword" type="password" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" placeholder="رمز را دوباره وارد کنید" autocomplete="new-password">
  </div>
  <div id="authMessage" class="alert hidden"></div>
  <button id="authSubmit" class="btn primary full" type="submit">ورود</button>
 </form>
 <p class="muted" style="margin-top:15px">آدرس بیت‌کوین شناسه حساب شماست. رمز عبور را با دیگران به اشتراک نگذارید.</p>
</section>

<section id="dashboard" class="hidden">
 <div class="card">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
   <div><h2 style="margin-bottom:6px">داشبورد ماینینگ</h2><div class="muted">خوش آمدید به BTPOOL</div></div>
   <span class="badge">حساب کاربری</span>
  </div>
  <div class="worker">
   <div class="muted">شناسه بیت‌کوین شما</div>
   <strong id="userAddress">—</strong>
   <button class="copy" onclick="copyText(document.getElementById('userAddress').textContent)">کپی آدرس</button>
  </div>
 </div>

 <div class="grid">
  <div class="card stat"><div class="label">هش‌ریت فعلی</div><div class="value">—</div><div class="sub">پس از اتصال API استخر</div></div>
  <div class="card stat"><div class="label">هش‌ریت ۲۴ ساعت</div><div class="value">—</div><div class="sub">داده زنده هنوز متصل نیست</div></div>
  <div class="card stat"><div class="label">موجودی حساب</div><div class="value" id="balance">0.00000000 BTC</div><div class="sub">موجودی ثبت‌شده در حساب</div></div>
  <div class="card stat"><div class="label">تعداد Worker</div><div class="value">—</div><div class="sub">پس از اتصال API استخر</div></div>
 </div>

 <div class="dashboard-grid">
  <div class="card">
   <h2>اتصال ماینر</h2>
   <div class="connection"><span class="dot" id="connectionDot"></span><span id="connectionText">وضعیت اتصال هنوز از API تأیید نشده است.</span></div>
   <div class="linebox">
    <svg viewBox="0 0 600 110" preserveAspectRatio="none" aria-label="نمودار نمایشی">
     <path d="M0 80 L600 80" stroke="#dcecdf" stroke-width="1" fill="none"/>
     <path d="M0 55 L600 55" stroke="#dcecdf" stroke-width="1" fill="none"/>
     <path d="M0 30 L600 30" stroke="#dcecdf" stroke-width="1" fill="none"/>
     <path d="M0 83 L45 83 L75 80 L100 84 L130 62 L160 70 L195 39 L225 55 L260 35 L295 50 L330 28 L370 43 L400 25 L440 42 L480 19 L515 34 L555 15 L600 25" stroke="#49a36a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
   </div>
   <p class="muted" style="margin:10px 0 0">این نمودار فعلاً نمایشی است؛ تا زمان اتصال API، وضعیت واقعی ماینر نمایش داده نمی‌شود.</p>
  </div>
  <div class="card">
   <h2>درآمد تخمینی</h2>
   <div class="worker"><div class="muted">۲۴ ساعت</div><strong>— BTC / — USD</strong></div>
   <div class="worker"><div class="muted">۷ روز</div><strong>— BTC / — USD</strong></div>
   <div class="worker"><div class="muted">۳۰ روز</div><strong>— BTC / — USD</strong></div>
   <p class="muted" style="margin:10px 0 0">درآمد واقعی پس از اتصال منبع داده استخر قابل نمایش است.</p>
  </div>
 </div>

 <div class="menu">
  <button class="active" data-section="overview" onclick="openSection('overview',this)">داشبورد</button>
  <button data-section="connection" onclick="openSection('connection',this)">تنظیمات ماینر</button>
  <button data-section="withdraw" onclick="openSection('withdraw',this)">برداشت</button>
  <button data-section="history" onclick="openSection('history',this)">تاریخچه برداشت</button>
  <button data-section="management" id="managementMenu" class="hidden" onclick="openSection('management',this)">مدیریت</button>
  <button onclick="logout()" class="danger">خروج</button>
 </div>

 <div id="section-overview" class="section card">
  <h2>حساب شما</h2>
  <p class="muted">برای مشاهده اطلاعات واقعی ماینینگ باید API رسمی و قابل دسترس PECPool در بخش Worker پیکربندی شود. این نسخه به‌تنهایی هش‌ریت یا درآمد واقعی را جعل نمی‌کند.</p>
 </div>

 <div id="section-connection" class="section card hidden">
  <h2>تنظیمات اتصال ماینر</h2>
  <p class="muted">نام Worker باید با شناسه ثابت حساب شما یکسان باشد.</p>
  <div class="worker"><div class="muted">نام کاربری / Worker</div><strong id="workerName">—</strong><button class="copy" onclick="copyText(document.getElementById('workerName').textContent)">کپی</button></div>
  <div class="worker"><div class="muted">رمز استخر</div><strong>x</strong><button class="copy" onclick="copyText('x')">کپی</button></div>
  <h3 style="margin-top:20px">سرورهای اتصال</h3>
  <div class="worker"><strong>ایران</strong><br><span dir="ltr">btc-ir.pecpool.com:8443</span><button class="copy" onclick="copyText('btc-ir.pecpool.com:8443')">کپی</button></div>
  <div class="worker"><strong>روسیه</strong><br><span dir="ltr">btc-ru.pecpool.com:3333</span><button class="copy" onclick="copyText('btc-ru.pecpool.com:3333')">کپی</button></div>
  <div class="worker"><strong>آسیا</strong><br><span dir="ltr">btc-as.pecpool.com:8443</span><button class="copy" onclick="copyText('btc-as.pecpool.com:8443')">کپی</button></div>
  <div class="alert">فرمت نام کاربری: <strong dir="ltr">btpool.آدرس_بیت‌کوین_شما</strong></div>
 </div>

 <div id="section-withdraw" class="section card hidden">
  <h2>درخواست برداشت BTC</h2>
  <p class="muted">حداقل درخواست برداشت 0.001 BTC است. ارسال درخواست به معنی پرداخت قطعی نیست؛ درخواست باید توسط مدیریت بررسی شود.</p>
  <form id="withdrawForm">
   <div class="field"><label for="withdrawAddress">آدرس مقصد بیت‌کوین</label><input id="withdrawAddress" required placeholder="آدرس BTC مقصد"></div>
   <div class="field"><label for="withdrawAmount">مقدار BTC</label><input id="withdrawAmount" type="number" min="0.001" step="0.00000001" required placeholder="مثلاً 0.001"></div>
   <div id="withdrawMessage" class="alert hidden"></div>
   <button class="btn primary" type="submit">ثبت درخواست برداشت</button>
  </form>
 </div>

 <div id="section-history" class="section card hidden">
  <h2>تاریخچه برداشت</h2>
  <div class="table-wrap"><table><thead><tr><th>تاریخ</th><th>مبلغ BTC</th><th>آدرس مقصد</th><th>وضعیت</th></tr></thead><tbody id="withdrawRows"><tr><td colspan="4" class="muted">در حال دریافت اطلاعات…</td></tr></tbody></table></div>
 </div>

 <div id="section-management" class="section card hidden">
  <h2>مدیریت درخواست‌ها</h2>
  <p class="muted">این بخش فقط برای حسابی نمایش داده می‌شود که نقش مدیر آن در سرور تنظیم شده باشد.</p>
  <div class="table-wrap"><table><thead><tr><th>کاربر</th><th>مبلغ</th><th>مقصد</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="adminRows"><tr><td colspan="5">در حال دریافت اطلاعات…</td></tr></tbody></table></div>
 </div>
</section>
<footer>BTPOOL · Bitcoin Mining Pool<br>نمایش هش‌ریت و درآمد واقعی نیازمند اتصال API رسمی استخر است.</footer>
</main>

<script>
let authMode='login';
let currentUser=null;

const $=id=>document.getElementById(id);

function setAuthMode(mode){
 authMode=mode;
 $('loginTab').classList.toggle('active',mode==='login');
 $('registerTab').classList.toggle('active',mode==='register');
 $('confirmField').classList.toggle('hidden',mode!=='register');
 $('authSubmit').textContent=mode==='register'?'ایجاد حساب':'ورود';
 $('password').autocomplete=mode==='register'?'new-password':'current-password';
 $('authMessage').classList.add('hidden');
 $('confirmPassword').required=mode==='register';
}

function showAuth(){
 $('auth').classList.remove('hidden');
 $('dashboard').classList.add('hidden');
 $('headerBtn').classList.add('hidden');
 window.scrollTo({top:0,behavior:'smooth'});
}

function showDashboard(){
 $('auth').classList.add('hidden');
 $('dashboard').classList.remove('hidden');
 $('headerBtn').classList.add('hidden');
 $('userAddress').textContent=currentUser.address||currentUser.username||'—';
 $('workerName').textContent='btpool.'+(currentUser.address||currentUser.username);
 $('balance').textContent=(Number(currentUser.balance_satoshis||0)/100000000).toFixed(8)+' BTC';
 $('managementMenu').classList.toggle('hidden',currentUser.role!=='admin');
 loadWithdrawals();
 if(currentUser.role==='admin')loadAdminWithdrawals();
}

function message(id,text,error=false){
 const el=$(id);el.textContent=text;el.classList.remove('hidden','error');
 if(error)el.classList.add('error');
}

async function api(path,options={}){
 const response=await fetch(path,{
  ...options,
  headers:{'Content-Type':'application/json',...(options.headers||{})}
 });
 let data={};
 try{data=await response.json()}catch{}
 if(!response.ok)throw new Error(data.error||data.message||'خطا در ارتباط با سرور');
 return data;
}

function validBTC(address){
 return /^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[ac-hj-np-z02-9]{11,71})$/.test(address);
}

$('authForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const address=$('btcAddress').value.trim();
 const password=$('password').value;
 const confirm=$('confirmPassword').value;
 $('authMessage').classList.add('hidden');

 if(!validBTC(address)){
  message('authMessage','آدرس بیت‌کوین معتبر وارد کنید.',true);return;
 }
 if(!/^[0-9]{10}$/.test(password)){
  message('authMessage','رمز عبور باید دقیقاً ۱۰ رقم انگلیسی باشد.',true);return;
 }
 if(authMode==='register'&&password!==confirm){
  message('authMessage','رمز عبور و تکرار آن یکسان نیست.',true);return;
 }

 const button=$('authSubmit');button.disabled=true;
 button.textContent='لطفاً صبر کنید…';
 try{
  const data=await api(authMode==='register'?'/api/register':'/api/login',{
   method:'POST',body:JSON.stringify({address,username:address,password})
  });
  currentUser=data.user||data;
  if(!currentUser.address)currentUser.address=address;
  if(!currentUser.username)currentUser.username=address;
  if(!currentUser.role)currentUser.role='user';
  showDashboard();
 }catch(err){
  message('authMessage',err.message||'عملیات انجام نشد.',true);
 }finally{
  button.disabled=false;
  button.textContent=authMode==='register'?'ایجاد حساب':'ورود';
 }
});

$('withdrawForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const address=$('withdrawAddress').value.trim();
 const amount=Number($('withdrawAmount').value);
 if(!validBTC(address)){message('withdrawMessage','آدرس مقصد معتبر نیست.',true);return}
 if(!Number.isFinite(amount)||amount<0.001){message('withdrawMessage','حداقل برداشت 0.001 BTC است.',true);return}
 try{
  await api('/api/withdrawals',{method:'POST',body:JSON.stringify({address,amount})});
  message('withdrawMessage','درخواست ثبت شد و در انتظار بررسی مدیریت است.');
  $('withdrawForm').reset();
  loadWithdrawals();
 }catch(err){message('withdrawMessage',err.message,true)}
});

function openSection(name,button){
 document.querySelectorAll('[id^="section-"]').forEach(el=>el.classList.add('hidden'));
 $('section-'+name).classList.remove('hidden');
 document.querySelectorAll('.menu button[data-section]').forEach(el=>el.classList.remove('active'));
 if(button)button.classList.add('active');
 if(name==='history')loadWithdrawals();
 if(name==='management'&&currentUser?.role==='admin')loadAdminWithdrawals();
}

function copyText(text){
 if(!text||text==='—')return;
 navigator.clipboard.writeText(text).then(()=>alert('کپی شد')).catch(()=>prompt('کپی کنید:',text));
}

function escapeHTML(value){
 return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function statusBadge(status){
 const s=String(status||'pending').toLowerCase();
 if(['approved','paid','completed','accepted'].includes(s))return '<span class="badge">تأیید شده</span>';
 if(['rejected','denied','cancelled'].includes(s))return '<span class="badge rejected">رد شده</span>';
 return '<span class="badge pending">در انتظار</span>';
}

async function loadWithdrawals(){
 try{
  const data=await api('/api/withdrawals');
  const rows=Array.isArray(data)?data:(data.withdrawals||[]);
  $('withdrawRows').innerHTML=rows.length?rows.map(r=>'<tr><td>'+escapeHTML(r.created_at||r.createdAt||'—')+'</td><td>'+escapeHTML(r.amount_btc??r.amount??'—')+'</td><td style="overflow-wrap:anywhere">'+escapeHTML(r.address||r.btc_address||'—')+'</td><td>'+statusBadge(r.status)+'</td></tr>').join(''):'<tr><td colspan="4" class="muted">هنوز درخواستی ثبت نشده است.</td></tr>';
 }catch(err){
  $('withdrawRows').innerHTML='<tr><td colspan="4" class="muted">دریافت تاریخچه ناموفق بود.</td></tr>';
 }
}

async function loadAdminWithdrawals(){
 try{
  const data=await api('/api/admin/withdrawals');
  const rows=Array.isArray(data)?data:(data.withdrawals||[]);
  $('adminRows').innerHTML=rows.length?rows.map(r=>{
   const id=Number(r.id);
   const status=String(r.status||'pending').toLowerCase();
   const actions=['pending','requested'].includes(status)
    ?'<button class="copy" onclick="adminAction('+id+',\\'approved\\')">تأیید</button><button class="copy" onclick="adminAction('+id+',\\'rejected\\')">رد</button>'
    :'—';
   return '<tr><td>'+escapeHTML(r.username||r.user_id||'—')+'</td><td>'+escapeHTML(r.amount_btc??r.amount??'—')+'</td><td style="overflow-wrap:anywhere">'+escapeHTML(r.address||r.btc_address||'—')+'</td><td>'+statusBadge(status)+'</td><td>'+actions+'</td></tr>';
  }).join(''):'<tr><td colspan="5">درخواستی وجود ندارد.</td></tr>';
 }catch(err){
  $('adminRows').innerHTML='<tr><td colspan="5">دسترسی مدیریت ناموفق بود.</td></tr>';
 }
}

async function adminAction(id,status){
 if(!confirm(status==='approved'?'درخواست تأیید شود؟':'درخواست رد شود؟'))return;
 try{
  await api('/api/admin/withdrawals',{method:'PATCH',body:JSON.stringify({id,status})});
  await loadAdminWithdrawals();
  await loadWithdrawals();
 }catch(err){alert(err.message)}
}

async function logout(){
 try{await api('/api/logout',{method:'POST',body:JSON.stringify({})})}catch{}
 currentUser=null;
 $('authForm').reset();
 setAuthMode('login');
 $('headerBtn').classList.remove('hidden');
 showAuth();
}

async function restoreSession(){
 try{
  const data=await api('/api/me');
  currentUser=data.user||data;
  if(currentUser&& (currentUser.address||currentUser.username))showDashboard();
  else showAuth();
 }catch{showAuth()}
}

restoreSession();
</script>
</body>
</html>`;

const schema = [
`CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 username TEXT NOT NULL UNIQUE,
 password_hash TEXT,
 role TEXT NOT NULL DEFAULT 'user',
 balance_satoshis INTEGER NOT NULL DEFAULT 0,
 address TEXT,
 salt TEXT
);`,
`CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,
 user_id INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS withdrawals (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 username TEXT,
 address TEXT NOT NULL,
 amount_satoshis INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 reviewed_at TEXT
);`,
`CREATE TABLE IF NOT EXISTS transactions (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 type TEXT NOT NULL,
 amount_satoshis INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`
];

function json(data,status=200){
 return new Response(JSON.stringify(data),{
  status,
  headers:{
   'Content-Type':'application/json; charset=utf-8',
   'Cache-Control':'no-store',
   'Access-Control-Allow-Origin':'same-origin',
   'Access-Control-Allow-Headers':'Content-Type',
   'Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS'
  }
 });
}

function htmlResponse(){
 return new Response(html,{
  headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
 });
}

const encoder=new TextEncoder();
const decoder=new TextDecoder();
const MIN_WITHDRAWAL=100000;

function bytesToHex(bytes){
 return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
function hexToBytes(hex){
 const out=new Uint8Array(hex.length/2);
 for(let i=0;i<out.length;i++)out[i]=parseInt(hex.slice(i*2,i*2+2),16);
 return out;
}
function randomHex(length=32){
 const b=new Uint8Array(length);
 crypto.getRandomValues(b);
 return bytesToHex(b);
}
async function sha256(text){
 return bytesToHex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));
}
async function hashPassword(password,salt){
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({
  name:'PBKDF2',salt:encoder.encode(salt),iterations:210000,hash:'SHA-256'
 },key,256);
 return bytesToHex(bits);
}
function validAddress(address){
 return typeof address==='string'&&/^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[ac-hj-np-z02-9]{11,71})$/.test(address);
}
function validPassword(password){
 return typeof password==='string'&&/^[0-9]{10}$/.test(password);
}
async function bodyJSON(request){
 try{return await request.json()}catch{return {}}
}
async function ensureColumn(db,table,column,definition){
 const result=await db.prepare('PRAGMA table_info('+table+')').all();
 const cols=result.results||[];
 if(!cols.some(c=>c.name===column)){
  await db.prepare('ALTER TABLE '+table+' ADD COLUMN '+column+' '+definition).run();
 }
}
async function initDB(db){
 for(const sql of schema)await db.prepare(sql).run();
 await ensureColumn(db,'users','password_hash','TEXT');
 await ensureColumn(db,'users','role',"TEXT NOT NULL DEFAULT 'user'");
 await ensureColumn(db,'users','balance_satoshis','INTEGER NOT NULL DEFAULT 0');
 await ensureColumn(db,'users','address','TEXT');
 await ensureColumn(db,'users','salt','TEXT');
 await ensureColumn(db,'withdrawals','username','TEXT');
 await ensureColumn(db,'withdrawals','reviewed_at','TEXT');
 await ensureColumn(db,'sessions','created_at',"TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP");
}
function getCookie(request,name){
 const cookie=request.headers.get('Cookie')||'';
 const match=cookie.match(new RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
 return match?decodeURIComponent(match[1]):null;
}
function cookieHeader(token,secure=true){
 return 'btpool_session='+encodeURIComponent(token)+'; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800'+(secure?'; Secure':'');
}
function clearCookie(secure=true){
 return 'btpool_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'+(secure?'; Secure':'');
}
async function getSession(request,env){
 const token=getCookie(request,'btpool_session');
 if(!token)return null;
 const tokenHash=await sha256(token);
 const now=Math.floor(Date.now()/1000);
 const row=await env.DB.prepare(
  'SELECT u.id,u.username,u.address,u.role,u.balance_satoshis FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?'
 ).bind(tokenHash,now).first();
 return row||null;
}
function publicUser(user){
 return {
  id:user.id,username:user.username,address:user.address||user.username,
  role:user.role||'user',balance_satoshis:Number(user.balance_satoshis||0)
 };
}
async function createSession(userId,env,secure=true){
 const token=randomHex(32);
 const tokenHash=await sha256(token);
 const now=Math.floor(Date.now()/1000);
 await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)')
  .bind(tokenHash,userId,now+604800).run();
 return token;
}
async function handleRegister(request,env){
 const data=await bodyJSON(request);
 const address=String(data.address||data.username||'').trim();
 const password=data.password;
 if(!validAddress(address))return json({error:'آدرس بیت‌کوین معتبر نیست.'},400);
 if(!validPassword(password))return json({error:'رمز عبور باید دقیقاً ۱۰ رقم انگلیسی باشد.'},400);

 const existing=await env.DB.prepare('SELECT id FROM users WHERE username=? OR address=?')
  .bind(address,address).first();
 if(existing)return json({error:'این آدرس قبلاً ثبت شده است. وارد حساب شوید.'},409);

 const salt=randomHex(16);
 const passwordHash=await hashPassword(password,salt);
 let role='user';

 // مدیر را فقط با Secrets تنظیم‌شده در Worker ایجاد کنید؛ هیچ رمز مدیریتی در کد قرار ندهید.
 if(env.ADMIN_BTC_ADDRESS&&env.ADMIN_PASSWORD&&address===env.ADMIN_BTC_ADDRESS&&password===env.ADMIN_PASSWORD){
  role='admin';
 }

 try{
  const result=await env.DB.prepare(
   'INSERT INTO users(username,address,password_hash,salt,role,balance_satoshis) VALUES(?,?,?,?,?,0)'
  ).bind(address,address,passwordHash,salt,role).run();
  const userId=result.meta?.last_row_id;
  if(!userId)return json({error:'ساخت حساب ناموفق بود؛ ساختار جدول دیتابیس را بررسی کنید.'},500);
  const token=await createSession(userId,env,new URL(request.url).protocol==='https:');
  const user=await env.DB.prepare('SELECT id,username,address,role,balance_satoshis FROM users WHERE id=?').bind(userId).first();
  return new Response(JSON.stringify({user:publicUser(user)}),{
   status:201,headers:{
    'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
    'Set-Cookie':cookieHeader(token,new URL(request.url).protocol==='https:')
   }
  });
 }catch(error){
  return json({error:'ثبت‌نام انجام نشد. ساختار جدول users و اتصال DB را بررسی کنید.'},500);
 }
}
async function handleLogin(request,env){
 const data=await bodyJSON(request);
 const address=String(data.address||data.username||'').trim();
 const password=data.password;
 if(!validAddress(address)||!validPassword(password)){
  return json({error:'آدرس بیت‌کوین یا رمز ۱۰ رقمی معتبر نیست.'},400);
 }
 const user=await env.DB.prepare('SELECT * FROM users WHERE username=? OR address=?')
  .bind(address,address).first();
 if(!user||!user.password_hash||!user.salt){
  return json({error:'حساب پیدا نشد یا اطلاعات ورود آن کامل نیست.'},401);
 }
 const computed=await hashPassword(password,user.salt);
 if(computed!==user.password_hash)return json({error:'آدرس یا رمز عبور اشتباه است.'},401);
 const token=await createSession(user.id,env,new URL(request.url).protocol==='https:');
 return new Response(JSON.stringify({user:publicUser(user)}),{
  headers:{
   'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
   'Set-Cookie':cookieHeader(token,new URL(request.url).protocol==='https:')
  }
 });
}
async function handleMe(request,env){
 const user=await getSession(request,env);
 if(!user)return json({error:'وارد حساب نشده‌اید.'},401);
 return json({user:publicUser(user)});
}
async function handleLogout(request,env){
 const token=getCookie(request,'btpool_session');
 if(token){
  await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run();
 }
 return new Response(JSON.stringify({ok:true}),{
  headers:{
   'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
   'Set-Cookie':clearCookie(new URL(request.url).protocol==='https:')
  }
 });
}
async function handleWithdrawals(request,env){
 const user=await getSession(request,env);
 if(!user)return json({error:'ابتدا وارد حساب شوید.'},401);

 if(request.method==='GET'){
  const rows=await env.DB.prepare(
   'SELECT id,username,address,amount_satoshis,status,created_at,reviewed_at FROM withdrawals WHERE user_id=? ORDER BY id DESC LIMIT 100'
  ).bind(user.id).all();
  return json({withdrawals:(rows.results||[]).map(r=>({
   ...r,amount_btc:(Number(r.amount_satoshis)/100000000).toFixed(8)
  }))});
 }

 const data=await bodyJSON(request);
 const address=String(data.address||'').trim();
 const amount=Number(data.amount);
 if(!validAddress(address))return json({error:'آدرس مقصد بیت‌کوین معتبر نیست.'},400);
 if(!Number.isFinite(amount)||amount<0.001||amount>100000000){
  return json({error:'حداقل برداشت 0.001 BTC است.'},400);
 }
 const satoshis=Math.round(amount*100000000);
 if(!Number.isSafeInteger(satoshis)||satoshis<MIN_WITHDRAWAL){
  return json({error:'مبلغ برداشت معتبر نیست.'},400);
 }

 // این مسیر فقط درخواست را ثبت می‌کند و انتقال BTC انجام نمی‌دهد.
 const result=await env.DB.prepare(
  "INSERT INTO withdrawals(user_id,username,address,amount_satoshis,status) VALUES(?,?,?,?,'pending')"
 ).bind(user.id,user.username,address,satoshis).run();

 await env.DB.prepare(
  "INSERT INTO transactions(user_id,type,amount_satoshis,status) VALUES(?,?,?,'pending')"
 ).bind(user.id,'withdrawal',satoshis).run();

 return json({ok:true,id:result.meta?.last_row_id,message:'درخواست برداشت ثبت شد و در انتظار بررسی مدیریت است.'},201);
}
async function handleAdminWithdrawals(request,env){
 const user=await getSession(request,env);
 if(!user)return json({error:'ابتدا وارد حساب شوید.'},401);
 if(user.role!=='admin')return json({error:'دسترسی مدیریت ندارید.'},403);

 if(request.method==='GET'){
  const rows=await env.DB.prepare(
   'SELECT id,user_id,username,address,amount_satoshis,status,created_at,reviewed_at FROM withdrawals ORDER BY id DESC LIMIT 200'
  ).all();
  return json({withdrawals:(rows.results||[]).map(r=>({
   ...r,amount_btc:(Number(r.amount_satoshis)/100000000).toFixed(8)
  }))});
 }

 if(request.method==='PATCH'){
  const data=await bodyJSON(request);
  const id=Number(data.id);
  const status=String(data.status||'');
  if(!Number.isSafeInteger(id)||id<1||!['approved','rejected'].includes(status)){
   return json({error:'اطلاعات درخواست معتبر نیست.'},400);
  }
  const existing=await env.DB.prepare('SELECT id,status FROM withdrawals WHERE id=?').bind(id).first();
  if(!existing)return json({error:'درخواست پیدا نشد.'},404);
  if(existing.status!=='pending')return json({error:'این درخواست قبلاً بررسی شده است.'},409);

  await env.DB.prepare('UPDATE withdrawals SET status=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status=?')
   .bind(status,id,'pending').run();
  await env.DB.prepare(
   "UPDATE transactions SET status=? WHERE user_id=(SELECT user_id FROM withdrawals WHERE id=?) AND type='withdrawal' AND status='pending'"
  ).bind(status,id).run();
  return json({ok:true});
 }
 return json({error:'روش درخواست پشتیبانی نمی‌شود.'},405);
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{
   'Access-Control-Allow-Origin':'same-origin',
   'Access-Control-Allow-Headers':'Content-Type',
   'Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS'
  }});
  try{
   if(url.pathname.startsWith('/api/')){
    if(!env.DB)return json({error:'اتصال دیتابیس DB تنظیم نشده است.'},500);
    await initDB(env.DB);

    if(url.pathname==='/api/register'&&request.method==='POST')return await handleRegister(request,env);
    if(url.pathname==='/api/login'&&request.method==='POST')return await handleLogin(request,env);
    if(url.pathname==='/api/me'&&request.method==='GET')return await handleMe(request,env);
    if(url.pathname==='/api/logout'&&request.method==='POST')return await handleLogout(request,env);
    if(url.pathname==='/api/withdrawals'&&(request.method==='GET'||request.method==='POST'))return await handleWithdrawals(request,env);
    if(url.pathname==='/api/admin/withdrawals'&&(request.method==='GET'||request.method==='PATCH'))return await handleAdminWithdrawals(request,env);
    return json({error:'مسیر API پیدا نشد.'},404);
   }
   return htmlResponse();
  }catch(error){
   return json({error:'خطای داخلی سرور. تنظیمات DB و ساختار جدول‌ها را بررسی کنید.'},500);
  }
 }
};
