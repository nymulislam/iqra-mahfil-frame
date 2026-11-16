/* layout.js — একক ফ্রেম স্টেজ সাইজিং ও ফ্রেম অদলবদল (ট্যাব)
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
let moved=0;

function layout(){
  const s=$("#stage").getBoundingClientRect();
  const maxW=s.width-20;
  const maxH=s.height-48;
  const M=Math.min(maxW,maxH,440);
  $("#app").style.setProperty("--M",Math.max(140,M)+"px");
}

new ResizeObserver(layout).observe($("#stage"));
layout();

if(window.visualViewport){
  const v=visualViewport,f=()=>{
    const h=Math.round(v.height);
    document.documentElement.style.setProperty("--vh",h+"px");
    $("#app").style.setProperty("--vh",h+"px");
    layout();
  };
  v.addEventListener("resize",f);
  v.addEventListener("scroll",f);
  f();
}

// ফ্রেম অদলবদল (ট্যাব ১ ও ২)
function setMain(i,u){
  st.m=i;
  const t0=$("#tab0"),t1=$("#tab1");
  if(t0)t0.classList.toggle("on",i===0);
  if(t1)t1.classList.toggle("on",i===1);
  draw();
  if(u){
    burst(innerWidth/2,innerHeight*0.35,18);
    navigator.vibrate&&navigator.vibrate(12);
  }
}

const t0=$("#tab0"),t1=$("#tab1");
if(t0)t0.onclick=()=>setMain(0,1);
if(t1)t1.onclick=()=>setMain(1,1);

// ক্যানভাসে ছবি বা নামের বক্সে ট্যাপ করলে সংশ্লিষ্ট অ্যাকশন চালু
const cv=$("#c0");
if(cv){
  cv.addEventListener("click",e=>{
    if(moved){moved=0;return;}
    const rect=cv.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const kX=W/rect.width, kY=H/rect.height;
    const x=(e.clientX-rect.left)*kX, y=(e.clientY-rect.top)*kY;

    // ১. নামের বক্সে ট্যাপ করলে সরাসরি তথ্য সম্পাদন মডাল (#info-sheet) ওপেন
    const B=CFG.box;
    if(x>=B.x-25 && x<=B.x+B.w+25 && y>=B.y-25 && y<=B.y+B.h+30){
      if(window.INFO)window.INFO.op();
      setTimeout(()=>{const nm=$("#nm");if(nm)nm.focus()},250);
      return;
    }

    // ২. ছবির উইন্ডোতে ট্যাপ করলে গ্যালারি/ফাইল বাছা ওপেন
    const R=CFG.photo;
    if(x>=R.x-20 && x<=R.x+R.w+20 && y>=R.y-20 && y<=R.y+R.h+20){
      openPick();
      return;
    }

    // ৩. ছবি না থাকলে ক্যানভাসের যেকোনো অংশে ট্যাপে গ্যালারি ওপেন
    if(!st.img)openPick();
  });
}
