/* core.js — স্টেট, ক্যানভাসে ফ্রেম আঁকা (render), ফন্ট লোড
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
const TXT="আমি আসছি, আপনি আসছেন তো? ৫ ডিসেম্বর ২০২৬, শনিবার বাদ যোহর — ইক্বরা ইন্টারন্যাশনাল মাদরাসার বার্ষিক তাফসীরুল কুরআন মাহফিল।";
const ico=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const DEV='<div class="dev">'+ico("code")+'<span>Made by <b>NAYMUL ISLAM</b></span><a href="https://wa.me/8801822667737?text='+encodeURIComponent("আসসালামু আলাইকুম, ইক্বরা মাহফিল ২০২৬ ফটো ফ্রেম ওয়েবসাইটটি দেখলাম। আপনার সাথে কথা বলতে চাই।")+'" target="_blank" rel="noopener" aria-label="WhatsApp">'+ico("wa")+'</a><a href="https://github.com/nymulislam" target="_blank" rel="noopener" aria-label="GitHub">'+ico("gh")+'</a></div>';
let loaded=0;const F=SRC.map(s=>{const i=new Image();i.onload=()=>{draw();if(++loaded==2)cvs.forEach(c=>c.classList.remove("ld"))};i.src=s;return i});
$("#np").addEventListener("click",()=>{const m=$("#pm");if(!m.getAttribute("src"))m.src=POSTER});$("#pm").onclick=()=>$("#pm").classList.toggle("zoom");
const st={m:0,img:null,z:1,ox:0,oy:0,adj:false},cvs=[$("#c0"),$("#c1")],NM=["ফ্রেম ১","ফ্রেম ২"];
const nm=$("#nm"),ds=$("#ds");
try{nm.value=localStorage.getItem("nm")||"";ds.value=localStorage.getItem("ds")||""}catch(_){}
function toast(t){const e=$("#ts");e.textContent=t;e.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("on"),2400)}
function path(x){const{x:a,y:b,w,h}=R,r1=82,r2=92;x.beginPath();x.moveTo(a+r1,b);x.lineTo(a+w,b);x.lineTo(a+w,b+h-r2);x.arcTo(a+w,b+h,a+w-r2,b+h,r2);x.lineTo(a,b+h);x.lineTo(a,b+r1);x.arcTo(a,b,a+r1,b,r1);x.closePath()}
function fit(x,t,max,min,wd,wt){let s=max;do{x.font=wt+" "+s+"px 'Hind Siliguri',sans-serif";s-=2}while(x.measureText(t).width>wd&&s>min)}
let dq=0;function draw(){if(dq)return;dq=requestAnimationFrame(()=>{dq=0;cvs.forEach((c,i)=>one2(c,i,1));av()})}
function ph(x){x.save();x.beginPath();x.rect(R.x,R.y,R.w,R.h);x.clip();
  const g=x.createLinearGradient(R.x,R.y,R.x+R.w,R.y+R.h);g.addColorStop(0,"#ecfbf8");g.addColorStop(1,"#c6ebf5");x.fillStyle=g;x.fillRect(R.x,R.y,R.w,R.h);
  x.fillStyle="#ffffff99";x.beginPath();x.arc(R.x+R.w*.88,R.y+R.h*.1,92,0,6.3);x.fill();
  x.fillStyle="#3fc4d426";x.beginPath();x.arc(R.x+R.w*.08,R.y+R.h*.92,110,0,6.3);x.fill();
  const cx=R.x+R.w/2;x.fillStyle="#1b8f9d38";x.beginPath();x.arc(cx,R.y+R.h*.29,42,0,6.3);x.fill();
  x.beginPath();x.ellipse(cx,R.y+R.h*.66,90,68,0,Math.PI,0);x.fill();
    const w=236,h=56,bx=cx-w/2,by=R.y+R.h*.74,gg=x.createLinearGradient(bx,by,bx+w,by);gg.addColorStop(0,"#1b8f9d");gg.addColorStop(1,"#3fc4d4");
  x.fillStyle=gg;x.beginPath();x.roundRect?x.roundRect(bx,by,w,h,28):x.rect(bx,by,w,h);x.fill();
  x.fillStyle="#fff";x.beginPath();x.arc(bx+32,by+h/2,15,0,6.3);x.fill();x.strokeStyle="#1b8f9d";x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(bx+25,by+h/2);x.lineTo(bx+39,by+h/2);x.moveTo(bx+32,by+h/2-7);x.lineTo(bx+32,by+h/2+7);x.stroke();
  x.fillStyle="#fff";x.textAlign="left";x.textBaseline="middle";x.font="600 27px 'Hind Siliguri',sans-serif";x.fillText("ছবি যোগ করুন",bx+58,by+h/2+2);x.restore()}
function one2(c,i,k){
  const x=c.getContext("2d"),f=F[i];if(!f.complete||!f.naturalWidth)return;
  x.setTransform(k,0,0,k,0,0);x.clearRect(0,0,W,H);
  if(st.img){x.save();x.beginPath();x.rect(R.x-2,R.y-2,R.w+4,R.h+4);x.clip();
    const s=Math.max(R.w/st.img.width,R.h/st.img.height)*st.z,w=st.img.width*s,h=st.img.height*s,mx=(w-R.w)/2,my=(h-R.h)/2;
    st.ox=Math.max(-mx,Math.min(mx,st.ox));st.oy=Math.max(-my,Math.min(my,st.oy));
    x.drawImage(st.img,R.x+R.w/2-w/2+st.ox,R.y+R.h/2-h/2+st.oy,w,h);x.restore()}else ph(x);
  x.drawImage(f,0,0,W,H); // স্বচ্ছ জানালাওয়ালা ফ্রেম ছবির উপরে
  const B=CFG.box,cx=B.cx;x.fillStyle=B.fill;x.fillRect(B.x,B.y,B.w,B.h);x.textAlign="center";x.textBaseline="alphabetic";
  const n=nm.value.trim()||"আপনার নাম",d=ds.value.trim()||"আপনার পরিচয়";fit(x,d,40,28,400,500);
  if(x.measureText(d).width>400&&d.includes(" ")){const w=d.split(" ");let bi=1,bd=1e9;for(let q=1;q<w.length;q++){const df=Math.abs(w.slice(0,q).join(" ").length-w.slice(q).join(" ").length);if(df<bd){bd=df;bi=q}}
    const l1=w.slice(0,bi).join(" "),l2=w.slice(bi).join(" ");
    x.fillStyle="#c4161c";fit(x,n,54,28,400,700);x.fillText(n,cx,772);
    x.fillStyle="#1a1a1a";fit(x,l1,32,20,400,500);x.fillText(l1,cx,812);fit(x,l2,32,20,400,500);x.fillText(l2,cx,848)}
  else{x.fillStyle="#c4161c";fit(x,n,62,28,400,700);x.fillText(n,cx,787);x.fillStyle="#1a1a1a";fit(x,d,40,20,400,500);x.fillText(d,cx,839)}
}
function av(){const a=$("#av"),x=a.getContext("2d");x.clearRect(0,0,140,140);if(st.img){const s=Math.max(140/st.img.width,140/st.img.height);x.drawImage(st.img,(140-st.img.width*s)/2,(140-st.img.height*s)/2,st.img.width*s,st.img.height*s)}$("#pick").classList.toggle("has",!!st.img)}
function state(){$("#fn").classList.toggle("ok",!!nm.value.trim());$("#fd").classList.toggle("ok",!!ds.value.trim());
  ["rst","adjb"].forEach(i=>$("#"+i).classList.toggle("hide",!st.img));const ok=!!(st.img&&nm.value.trim()&&ds.value.trim());["dl","sh"].forEach(i=>$("#"+i).classList.toggle("dim",!ok))}
document.fonts&&document.fonts.load("700 50px 'Hind Siliguri'","আপনার").then(()=>document.fonts.load("500 40px 'Hind Siliguri'","আপনার")).then(draw);
state();draw();
