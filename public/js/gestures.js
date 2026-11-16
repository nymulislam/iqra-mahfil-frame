/* gestures.js — ছবি টানা ও দুই আঙুলে জুম
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
const P=new Map();
let pd=0;
const dist=()=>{const a=[...P.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])||1};

const cvEl=$("#c0");
if(cvEl){
  cvEl.addEventListener("pointerdown",e=>{
    if(!st.img)return;
    cvEl.setPointerCapture(e.pointerId);
    P.set(e.pointerId,[e.clientX,e.clientY]);
    if(P.size==2)pd=dist();
  });

  cvEl.addEventListener("pointermove",e=>{
    if(!P.has(e.pointerId))return;
    const o=P.get(e.pointerId),k=W/cvEl.getBoundingClientRect().width;
    P.set(e.pointerId,[e.clientX,e.clientY]);
    if(Math.abs(e.clientX-o[0])+Math.abs(e.clientY-o[1])>1)moved=1;
    if(P.size==1){
      st.ox+=(e.clientX-o[0])*k;
      st.oy+=(e.clientY-o[1])*k;
    }else{
      const d=dist();
      if(pd){
        st.z=Math.max(1,Math.min(3,st.z*d/pd));
        const zm=$("#zm");if(zm)zm.value=st.z;
      }
      pd=d;
    }
    draw();
  });

  ["pointerup","pointercancel"].forEach(t=>cvEl.addEventListener(t,e=>{
    P.delete(e.pointerId);
    pd=0;
  }));

  cvEl.addEventListener("wheel",e=>{
    if(!st.img)return;
    e.preventDefault();
    st.z=Math.max(1,Math.min(3,st.z-e.deltaY*.002));
    const zm=$("#zm");if(zm)zm.value=st.z;
    draw();
  },{passive:false});
}
