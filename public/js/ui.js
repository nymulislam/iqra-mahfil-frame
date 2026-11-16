/* ui.js — ব্যাক-বাটন লেয়ার, ডায়ালগ, ইনফো শিট, ভ্যালিডেশন, যোগাযোগ পপআপ
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
const LS=[];let hist=1,skip=0;
function pushL(fn){LS.push(fn);try{history.pushState({l:1},"")}catch(_){hist=0}}
function popL(fn){const i=LS.lastIndexOf(fn);if(i<0)return;LS.splice(i,1);if(hist){skip++;try{history.back()}catch(_){skip--}}}
addEventListener("popstate",()=>{if(skip){skip--;return}const f=LS.pop();f&&f()});

function sheet(id,open,close){
  const el=$("#"+id);if(!el)return{op:()=>{},cl:()=>{}};
  const fn=()=>el.classList.remove("on");
  const op=()=>{if(el.classList.contains("on"))return;el.classList.add("on");pushL(fn)};
  const cl=()=>{if(!el.classList.contains("on"))return;fn();popL(fn)};
  (open||[]).forEach(b=>{const e=$("#"+b);if(e)e.onclick=op});
  (close||[]).forEach(b=>{const e=$("#"+b);if(e)e.onclick=cl});
  el.addEventListener("click",e=>{if(e.target==el)cl()});
  return{op,cl};
}

// নাম ও পদবী বটম শিট
const INFO=sheet("info-sheet",["open-info"],["info-cl"]);
window.INFO=INFO;

function doneInfo(){
  nm.blur();ds.blur();
  INFO.cl();
  state();draw();
  if(nm.value.trim()&&ds.value.trim()){
    burst(innerWidth/2,innerHeight*0.45,22);
    toast("তথ্য সংরক্ষিত হয়েছে");
  }
}
const bTop=$("#info-done-top"),bBtn=$("#info-done-btn");
if(bTop)bTop.onclick=doneInfo;
if(bBtn)bBtn.onclick=doneInfo;

// ডায়ালগ
function dlg(o){
  return new Promise(ok=>{
    const ov=$("#ov");
    $("#dic").className="dic"+(o.warm?" warm":"");
    $("#dic").innerHTML=ico(o.ic);
    $("#dt").textContent=o.t;
    $("#dp").innerHTML=o.p||"";
    $("#dev").innerHTML=o.x||"";
    $("#dx").innerHTML="";
    let cl=0;
    const fin=v=>{if(cl)return;cl=1;ov.classList.remove("on");ok(v)};
    const fn=()=>fin(null),done=v=>{if(cl)return;fin(v);popL(fn)};
    pushL(fn);
    o.b.forEach(b=>{
      const e=document.createElement(b.h?"a":"button");
      e.className="btn "+(b.c||"");
      e.innerHTML=(b.i?ico(b.i):"")+b.l;
      if(b.h)e.href=b.h;
      e.onclick=()=>{if(b.f)b.f();done(b.v)};
      $("#dx").appendChild(e);
    });
    ov.onclick=e=>{if(e.target==ov)done(null)};
    ov.classList.add("on");
  });
}

$("#nc").onclick=()=>dlg({
  ic:"ph",t:"যোগাযোগ",
  p:'প্রয়োজনে সরাসরি কল বা আর্থিক সহযোগিতা পাঠাতে পারেন' +
    '<div class="contact-box">' +
      '<div class="contact-num-row">' +
        '<div class="contact-phone">'+PHONE+'</div>' +
        '<div class="contact-pay">' +
          '<span class="pay bk">বিকাশ</span>' +
          '<span class="pay ng">নগদ</span>' +
          '<span class="pay-sub">পার্সোনাল</span>' +
        '</div>' +
      '</div>' +
      '<div class="contact-grid">' +
        '<a class="fbk" href="'+CFG.fb+'" target="_blank" rel="noopener">'+ico("fb")+'<span>ফেসবুক পেজ</span></a>' +
        '<a class="fbk" href="'+MAP+'" target="_blank" rel="noopener">'+ico("pin")+'<span>গুগল ম্যাপ</span></a>' +
        '<a class="fbk" href="'+CAL+'" target="_blank" rel="noopener">'+ico("cal")+'<span>ক্যালেন্ডার</span></a>' +
        (PWA.btn() || '<a class="fbk" href="https://wa.me/8801797091817" target="_blank" rel="noopener">'+ico("wa")+'<span>হোয়াটসঅ্যাপ</span></a>') +
      '</div>' +
    '</div>',
  b:[
    {l:"কপি",c:"ghost",i:"cp",v:0,f:()=>{try{navigator.clipboard.writeText("01797091817");toast("নম্বর কপি হয়েছে")}catch(_){}}},
    {l:"কল করুন",i:"ph",h:"tel:01797091817",v:1}
  ],
  x:DEV
});

// ভ্যালিডেশন
async function ready(){
  if(!st.img){
    $("#pick").classList.add("bad");setTimeout(()=>$("#pick").classList.remove("bad"),1500);
    await dlg({ic:"cam",warm:1,t:"ছবি যোগ করুন",p:"ফ্রেমে বসানোর জন্য আপনার একটি ছবি বেছে নিন।",b:[{l:"ছবি বাছুন",v:1,f:openPick}]});
    return false;
  }
  if(!nm.value.trim()){
    $("#open-info").classList.add("bad");setTimeout(()=>$("#open-info").classList.remove("bad"),1500);
    INFO.op();
    setTimeout(()=>nm.focus(),250);
    toast("অনুগ্রহ করে আপনার নাম লিখুন");
    return false;
  }
  if(!ds.value.trim()){
    $("#open-info").classList.add("bad");setTimeout(()=>$("#open-info").classList.remove("bad"),1500);
    INFO.op();
    setTimeout(()=>ds.focus(),250);
    toast("অনুগ্রহ করে আপনার পদবী বা পরিচয় বাছুন");
    return false;
  }
  return true;
}
