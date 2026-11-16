/* layout.js — এক স্ক্রিন লেআউট, কিবোর্ড মোড, ফ্রেম বদল (swap/swipe)
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// layout fits one screen
let H0=0,KB=0;
function layout(){const s=$("#stage").getBoundingClientRect(),M=KB?Math.min(s.width*.84,s.height-10,430):Math.min(s.width*.84,(s.height-56)/1.47,430);$("#app").style.setProperty("--M",Math.max(130,M)+"px")}
new ResizeObserver(layout).observe($("#stage"));layout();
if(window.visualViewport){const v=visualViewport,f=()=>{H0=Math.max(H0,v.height);KB=v.height<H0-120?1:0;$("#app").classList.toggle("kb",!!KB);$("#app").style.setProperty("--vh",v.height+"px");scrollTo(0,0);layout()};v.addEventListener("resize",f);v.addEventListener("scroll",f)}
// frame swap
function setMain(i,u){st.m=i;cvs.forEach((c,j)=>{c.classList.toggle("main",j==i);c.classList.toggle("alt",j!=i);c.classList.toggle("adj",j==i&&st.adj)});$("#lt").textContent=NM[1-i]+" নিন";
  if(u){const r=cvs[i].getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,20);navigator.vibrate&&navigator.vibrate(12)}}
let moved=0;
cvs.forEach((c,j)=>{c.addEventListener("pointerdown",()=>moved=0);c.addEventListener("click",()=>{if(j!=st.m)setMain(j,1);else if(!moved&&!(st.adj&&st.img))openPick()})});
$("#lbl").onclick=()=>setMain(1-st.m,1);
let sx=0,sy=0;cvs.forEach((c,j)=>{c.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY});c.addEventListener("pointerup",e=>{if(st.adj||j!=st.m)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dy)<60){moved=1;setMain(1-st.m,1)}})});
