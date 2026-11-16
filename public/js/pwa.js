/* pwa.js — Service Worker রেজিস্টার ও "ইনস্টল" বাটন */
const PWA={
  ev:null,
  ios:/iphone|ipad|ipod/i.test(navigator.userAgent)&&!navigator.standalone,
  btn(){return (this.ev||this.ios)?'<a class="fbk" id="pwa-i" href="#">'+ico("dl")+'<span>অ্যাপ ইনস্টল</span></a>':""}
};
addEventListener("beforeinstallprompt",e=>{e.preventDefault();PWA.ev=e});
addEventListener("appinstalled",()=>{PWA.ev=null;toast("অ্যাপ ইনস্টল হয়েছে")});
document.addEventListener("click",async e=>{
  if(!e.target.closest("#pwa-i"))return;e.preventDefault();
  if(PWA.ev){PWA.ev.prompt();await PWA.ev.userChoice;PWA.ev=null}
  else toast("Safari-র শেয়ার বাটন চেপে “Add to Home Screen” বাছুন")});
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
