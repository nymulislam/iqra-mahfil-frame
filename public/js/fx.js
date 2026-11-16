/* fx.js — রিপল, ৩ডি টিল্ট, কাউন্টডাউন, তারা ও ট্যাপ অ্যানিমেশন
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// ripple on buttons
document.addEventListener("pointerdown",e=>{const b=e.target.closest(".btn,.ib");if(!b)return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),p=document.createElement("span");
  p.className="rp";p.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px;background:#3fc4d455`;b.appendChild(p);setTimeout(()=>p.remove(),650)});
// 3D tilt
const dk=$("#deck"),stg=$("#stage");
function tilt(x,y){if(st.adj)return;const r=stg.getBoundingClientRect();dk.classList.remove("idle");dk.style.setProperty("--ry",((x-r.left)/r.width-.5)*14+"deg");dk.style.setProperty("--rx",-((y-r.top)/r.height-.5)*8+"deg");clearTimeout(tilt.t);tilt.t=setTimeout(()=>{dk.classList.add("idle");dk.style.removeProperty("--ry");dk.style.removeProperty("--rx")},1800)}
stg.addEventListener("pointermove",e=>tilt(e.clientX,e.clientY));stg.addEventListener("pointerdown",e=>tilt(e.clientX,e.clientY));
(function(){const t=new Date(),a=new Date(t.getFullYear(),t.getMonth(),t.getDate()),dd=Math.round((new Date(...CFG.date)-a)/864e5);
 $("#sub").textContent=dd>1?"৫ ডিসেম্বর · আর "+bn(dd)+" দিন বাকি":dd==1?"৫ ডিসেম্বর · আগামীকাল মাহফিল":dd==0?"আজ মাহফিল · বাদ যোহর":"৫ ডিসেম্বর ২০২৬ · মাহফিল সম্পন্ন"})();
cvs.forEach(c=>c.classList.add("ld"));if(F.every(f=>f.complete&&f.naturalWidth))cvs.forEach(c=>c.classList.remove("ld"));
// stars and bursts (teal, sky, mint; rare coral)
const PAL=["27,143,157","63,196,212","143,220,240","169,235,220"],fx=$("#fx"),fb=$("#fb"),g=fx.getContext("2d"),g2=fb.getContext("2d");let S=[],B=[],dpr=Math.min(devicePixelRatio||1,2);
function rs(){fx.width=fb.width=innerWidth*dpr;fx.height=fb.height=innerHeight*dpr}rs();addEventListener("resize",rs);
const col=()=>Math.random()<.1?"236,107,124":PAL[Math.random()*4|0];
if(LOW)$("#deck").classList.remove("idle");for(let i=0;i<(LOW?6:18);i++)S.push({x:Math.random(),y:Math.random(),r:6+Math.random()*13,v:.00006+Math.random()*.00014,a:Math.random()*6,w:(Math.random()-.5)*.01,c:col()});
function burst(x,y,n){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=2+Math.random()*4;B.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,r:3+Math.random()*6,l:1,a:Math.random()*6,c:col()})}}
addEventListener("pointerdown",e=>burst(e.clientX,e.clientY,12));
function sq(r,h){h=h||g;h.beginPath();h.rect(-r/2,-r/2,r,r);h.rotate(Math.PI/4);h.rect(-r/2,-r/2,r,r);h.fill()}
(function loop(){g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,innerWidth,innerHeight);g2.setTransform(dpr,0,0,dpr,0,0);g2.clearRect(0,0,innerWidth,innerHeight);
  for(const s of S){s.y-=s.v*16;s.a+=s.w;if(s.y<-.05){s.y=1.05;s.x=Math.random()}g.fillStyle=`rgba(${s.c},.2)`;g.save();g.translate(s.x*innerWidth,s.y*innerHeight);g.rotate(s.a);sq(s.r);g.restore()}
  for(let i=B.length-1;i>=0;i--){const p=B[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.18;p.l-=.022;p.a+=.15;if(p.l<=0){B.splice(i,1);continue}
    g2.fillStyle=`rgba(${p.c},${p.l})`;g2.save();g2.translate(p.x,p.y);g2.rotate(p.a);sq(p.r,g2);g2.restore()}
  requestAnimationFrame(loop)})();
