/* share.js — রেন্ডার/এক্সপোর্ট, সেভ, শেয়ার, পোস্টার, রেজাল্ট শিট
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// save / share
const blobOf=c=>new Promise(r=>c.toBlob(r,"image/png"));
async function save(blob,name){
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();toast("ডাউনলোড শুরু হয়েছে")}
async function share(blob,name){const f=new File([blob],name,{type:blob.type});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],text:CAP()});return}catch(e){if(e.name=="AbortError")return}}
  try{await navigator.clipboard.writeText(CAP());toast("টেক্সট কপি হয়েছে — ছবি ডাউনলোড করে শেয়ার করুন")}catch(_){toast("ছবি ডাউনলোড করে শেয়ার করুন")}}
const SITE="https://iqra.annujum.org/";const link=()=>SITE||location.href.split("#")[0];
const CAP=()=>"ইনশাআল্লাহ, আমি আসছি! ৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর — ইক্বরা ইন্টারন্যাশনাল মাদরাসার বার্ষিক তাফসীরুল কুরআন মাহফিল, মাদরাসা সংলগ্ন বালুর মাঠ, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর। আপনি আসছেন তো?\n\n"+link();
async function ensureFonts(){try{await Promise.all([document.fonts.load("700 50px 'Hind Siliguri'","আপনার"),document.fonts.load("500 40px 'Hind Siliguri'","আপনার"),document.fonts.load("600 27px 'Hind Siliguri'","ছবি")])}catch(_){}
  if(!document.fonts.check("700 50px 'Hind Siliguri'","আপনার"))toast("ফন্ট লোড হয়নি — ছবিতে ফন্ট আলাদা হতে পারে")}
async function render(){await ensureFonts();const c=document.createElement("canvas");c.width=W*2;c.height=H*2;one2(c,st.m,2);return blobOf(c)}
let RB=null;const IAB=/FBAN|FBAV|FB_IAB|Messenger|Instagram|Line\//i.test(navigator.userAgent);
function showResult(b){RB=b;const img=$("#rimg");if(img.src.startsWith("blob:"))URL.revokeObjectURL(img.src);img.src=URL.createObjectURL(b);$("#iab").classList.toggle("on",IAB);RS.op();
  setTimeout(()=>burst(innerWidth/2,innerHeight*.3,26),250);navigator.vibrate&&navigator.vibrate([12,40,12])}
$("#rsv").onclick=()=>RB&&save(RB,FN());$("#rsh").onclick=()=>RB&&share(RB,FN());
$("#rcp").onclick=async()=>{try{await navigator.clipboard.writeText(CAP());toast("ক্যাপশন কপি হয়েছে — পোস্টে পেস্ট করুন")}catch(_){toast("কপি করা যায়নি")}};
const FN=()=>"iqra-mahfil-2026-frame-"+(st.m+1)+".png";
$("#dl").onclick=async()=>{if(await ready())showResult(await render())};
$("#sh").onclick=async()=>{if(await ready())share(await render(),FN())};
const pb=()=>fetch(POSTER).then(r=>r.blob());
sheet("ps",["np"],["pcl"]);const RS=sheet("rs",null,["rcl"]);
$("#pd").onclick=async()=>save(await pb(),"iqra-mahfil-2026-poster.jpg");$("#psh").onclick=async()=>share(await pb(),"iqra-mahfil-2026-poster.jpg");
