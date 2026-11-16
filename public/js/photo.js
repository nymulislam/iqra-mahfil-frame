/* photo.js — ছবি বাছা/লোড, সরানো, রিসেট
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// photo
function openPick(){const f=$("#file");try{f.showPicker?f.showPicker():f.click()}catch(_){f.click()}}
let fp=0;function firstPhoto(){if(fp)return;fp=1;toast("ছবি শুধু আপনার ফোনেই থাকে, কোথাও আপলোড হয় না")}
async function loadImg(fl){let b;try{b=await createImageBitmap(fl,{imageOrientation:"from-image"})}catch(_){b=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=URL.createObjectURL(fl)})}
  const w=b.width,h=b.height,m=Math.max(w,h);if(m<=2000)return b;const s=2000/m,c=document.createElement("canvas");c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext("2d").drawImage(b,0,0,c.width,c.height);return c}
$("#file").onchange=async e=>{const fl=e.target.files[0];e.target.value="";if(!fl)return;
  let im;try{im=await loadImg(fl)}catch(_){dlg({ic:"al",warm:1,t:"ছবিটা পড়া যায়নি",p:"দয়া করে JPG বা PNG ছবি দিন। আইফোনের HEIC ছবি হলে তার স্ক্রিনশট নিয়ে সেটা দিন।",b:[{l:"ঠিক আছে",v:1}]});return}
  st.img=im;
  st.z=1;st.ox=0;{const s=Math.max(R.w/im.width,R.h/im.height),my=(im.height*s-R.h)/2;st.oy=Math.max(0,my)*.6}$("#zm").value=1;e.target.value="";state();firstPhoto();setAdj(true);draw();
  const r=cvs[st.m].getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,22)};
function setAdj(v){st.adj=v;cvs[st.m].classList.toggle("adj",v);$("#adjb").classList.toggle("on",v);$("#zr").classList.toggle("on",v);$("#tip").classList.toggle("on",v);if(v)setTimeout(()=>$("#tip").classList.remove("on"),3500)}
$("#adjb").onclick=()=>setAdj(!st.adj);
$("#zm").oninput=e=>{st.z=+e.target.value;draw()};
$("#rst").onclick=async()=>{const v=await dlg({ic:"tr",warm:1,t:"ছবি মুছে ফেলবেন?",p:"ফ্রেম থেকে আপনার ছবি সরে যাবে। চাইলে আবার নতুন ছবি দিতে পারবেন।",b:[{l:"থাক",c:"ghost",v:0},{l:"মুছুন",c:"warm",v:1}]});
  if(v){st.img=null;st.z=1;st.ox=st.oy=0;setAdj(false);state();draw();toast("ছবি মুছে ফেলা হয়েছে")}};
