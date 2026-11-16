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
    $("#app").style.setProperty("--vh",v.height+"px");
    layout();
  };
  v.addEventListener("resize",f);
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

// ক্যানভাসে ছবি না থাকলে ট্যাপে ছবি বাছা
const cv=$("#c0");
if(cv){
  cv.addEventListener("click",()=>{
    if(!st.img)openPick();
  });
}
