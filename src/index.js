
const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#123d68">
<title>BTPOOL | استخر بیت‌کوین</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Tahoma,Arial,sans-serif;background:#eaf5ff;color:#18324b}
header{background:#123d68;color:#fff;padding:22px;text-align:center}
header h1{color:#ffbd35;margin:0;font-size:30px}
main{max-width:850px;margin:25px auto;padding:12px}
.card{background:#fff;padding:22px;border-radius:16px;margin-bottom:18px;box-shadow:0 5px 20px #173d6412}
h2{margin-top:0}
input,button{width:100%;padding:13px;margin:7px 0;border-radius:9px;border:1px solid #c5d8e9;font-size:15px}
button{background:#1769aa;color:#fff;border:0;cursor:pointer;font-weight:bold}
button.gold{background:#ffbd35;color:#18324b}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:12px}
.stat{background:#edf7ff;padding:16px;border-radius:12px;text-align:center}
.value{font-size:20px;font-weight:bold;color:#1769aa;margin-top:10px}
.hidden{display:none}
.note{font-size:12px;color:#62788c;line-height:1.9}
footer{text-align:center;padding:20px;color:#61788d}
</style>
</head>
<body>
<header><h1>₿ BTPOOL</h1><p>داشبورد استخراج بیت‌کوین</p></header>
<main>
<section class="card" id="login">
<h2>ورود به حساب</h2>
<p class="note">نسخه اولیه سایت؛ برای فعال شدن حساب‌های واقعی باید پایگاه داده و احراز هویت امن متصل شود.</p>
<input id="user" placeholder="شناسه کاربری یا آدرس بیت‌کوین" autocomplete="username">
<input id="pass" type="password" placeholder="رمز عبور" autocomplete="current-password">
<button onclick="enter()">ورود آزمایشی</button>
<p id="msg" role="status"></p>
</section>
<section id="dash" class="hidden">
<div class="card">
<h2>داشبورد کاربر</h2>
<p>شناسه: <b id="uid"></b></p>
<div class="grid">
<div class="stat">موجودی<div class="value">0 BTC</div></div>
<div class="stat">هش‌ریت<div class="value">—</div></div>
<div class="stat">ماینر فعال<div class="value">—</div></div>
<div class="stat">درآمد ۲۴ ساعت<div class="value">— BTC</div></div>
</div>
<p class="note">آمار استخراج تا اتصال به سرویس استخر واقعی در دسترس نیست.</p>
</div>
<div class="card">
<h2>درخواست برداشت</h2>
<input id="amount" type="number" min="0.001" step="0.001" placeholder="مقدار BTC (حداقل 0.001)">
<input id="address" placeholder="آدرس دریافت BTC">
<button onclick="requestWithdrawal()">ثبت درخواست آزمایشی</button>
<p id="withdrawMsg" role="status"></p>
<ul id="history"></ul>
<button class="gold" onclick="exit()">خروج از حساب</button>
</div>
</section>
</main>
<footer>BTPOOL · نسخه اولیه</footer>
<script>
async function enter(){
 const u=document.getElementById('user').value.trim();
 const p=document.getElementById('pass').value;
 if(!u||!p){document.getElementById('msg').textContent='شناسه و رمز عبور را وارد کن.';return}
 document.getElementById('uid').textContent=u;
 document.getElementById('login').classList.add('hidden');
 document.getElementById('dash').classList.remove('hidden');
}
function exit(){
 document.getElementById('dash').classList.add('hidden');
 document.getElementById('login').classList.remove('hidden');
 document.getElementById('pass').value='';
}
function requestWithdrawal(){
 const amount=Number(document.getElementById('amount').value);
 const address=document.getElementById('address').value.trim();
 const out=document.getElementById('withdrawMsg');
 if(!Number.isFinite(amount)||amount<0.001||!address){
  out.textContent='مقدار حداقل 0.001 BTC و آدرس دریافت را وارد کن.';return;
 }
 const li=document.createElement('li');
 li.textContent=amount+' BTC — '+address+' — درخواست آزمایشی';
 document.getElementById('history').prepend(li);
 out.textContent='درخواست فقط در همین صفحه ثبت شد؛ هنوز به سرور ارسال نشده است.';
}
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, service: "BTPOOL" });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return new Response(request.method === "HEAD" ? null : html, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
};
