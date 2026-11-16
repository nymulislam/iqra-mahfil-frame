/* ui.js — Back-বাটন লেয়ার, ডায়ালগ, ভ্যালিডেশন, যোগাযোগ পপআপ
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// back-button layers
const LS=[];let hist=1,skip=0;
function pushL(fn){LS.push(fn);try{history.pushState({l:1},"")}catch(_){hist=0}}
function popL(fn){const i=LS.lastIndexOf(fn);if(i<0)return;LS.splice(i,1);if(hist){skip++;try{history.back()}catch(_){skip--}}}
addEventListener("popstate",()=>{if(skip){skip--;return}const f=LS.pop();f&&f()});
function sheet(id,open,close){const el=$("#"+id),fn=()=>el.classList.remove("on");
  const op=()=>{if(el.classList.contains("on"))return;el.classList.add("on");pushL(fn)},cl=()=>{if(!el.classList.contains("on"))return;fn();popL(fn)};
  (open||[]).forEach(b=>$("#"+b).onclick=op);(close||[]).forEach(b=>$("#"+b).onclick=cl);el.addEventListener("click",e=>{if(e.target==el)cl()});return{op,cl}}
// dialog
function dlg(o){return new Promise(ok=>{const ov=$("#ov");$("#dic").className="dic"+(o.warm?" warm":"");$("#dic").innerHTML=ico(o.ic);$("#dt").textContent=o.t;
  $("#dp").innerHTML=o.p||"";$("#dev").innerHTML=o.x||"";$("#dx").innerHTML="";
  let cl=0;const fin=v=>{if(cl)return;cl=1;ov.classList.remove("on");ok(v)},fn=()=>fin(null),done=v=>{if(cl)return;fin(v);popL(fn)};pushL(fn);
  o.b.forEach(b=>{const e=document.createElement(b.h?"a":"button");e.className="btn "+(b.c||"");e.innerHTML=(b.i?ico(b.i):"")+b.l;if(b.h)e.href=b.h;e.onclick=()=>{if(b.f)b.f();done(b.v)};$("#dx").appendChild(e)});
  ov.onclick=e=>{if(e.target==ov)done(null)};ov.classList.add("on")})}
$("#nc").onclick=()=>dlg({ic:"ph",t:"যোগাযোগ",p:'প্রয়োজনে কল করুন<div class="num">'+PHONE+'<span class="pay"><b class="bk">বিকাশ</b><b class="ng">নগদ</b></span></div><div class="fbr"><a class="fbk" href="'+CFG.fb+'" target="_blank" rel="noopener">'+ico("fb")+'ফেসবুক</a><a class="fbk" href="'+MAP+'" target="_blank" rel="noopener">'+ico("pin")+'ম্যাপ</a><a class="fbk" href="'+CAL+'" target="_blank" rel="noopener">'+ico("cal")+'ক্যালেন্ডার</a>'+PWA.btn()+'</div>',b:[
  {l:"কপি",c:"ghost",i:"cp",v:0,f:()=>{try{navigator.clipboard.writeText("01797091817");toast("নম্বর কপি হয়েছে")}catch(_){}}},
  {l:"কল করুন",i:"ph",h:"tel:01797091817",v:1}],x:DEV});
// validate
async function ready(){
  const bad=[[!st.img,"cam","ছবি যোগ করুন","ফ্রেমে বসানোর জন্য আপনার একটি ছবি বেছে নিন।","ছবি বাছুন",openPick,$("#pick")],
   [!nm.value.trim(),"user","নাম লিখুন","ফ্রেমে আপনার নাম দেখানো হবে, তাই নাম দেওয়া আবশ্যক।","ঠিক আছে",()=>nm.focus(),$("#fn")],
   [!ds.value.trim(),"badge","পদবী / পরিচয় লিখুন","যেমন: ছাত্র, শিক্ষক, ব্যবসায়ী, হাফেজ ইত্যাদি।","ঠিক আছে",()=>ds.focus(),$("#fd")]].find(a=>a[0]);
  if(!bad)return true;
  bad[6].classList.add("bad");setTimeout(()=>bad[6].classList.remove("bad"),1500);
  await dlg({ic:bad[1],warm:1,t:bad[2],p:bad[3],b:[{l:bad[4],v:1,f:bad[5]}]});return false}
