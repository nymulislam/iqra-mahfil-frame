/* fields.js — নাম ও পদবীর ঘর, চিপ
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
// fields
[nm,ds].forEach(i=>i.addEventListener("input",()=>{i.parentNode.classList.remove("bad");state();draw();try{localStorage.setItem(i.id,i.value)}catch(_){}}));
nm.addEventListener("keydown",e=>{if(e.key=="Enter"){e.preventDefault();ds.focus()}});
ds.addEventListener("keydown",e=>{if(e.key=="Enter"){e.preventDefault();ds.blur()}});
const ch=$("#chips");CFG.titles.forEach(s=>{const b=document.createElement("button");b.textContent=s;b.onpointerdown=e=>e.preventDefault();b.onclick=()=>{ds.value=s;ds.dispatchEvent(new Event("input"));ds.blur()};ch.appendChild(b)});
ds.addEventListener("focus",()=>ch.classList.add("on"));ds.addEventListener("blur",()=>setTimeout(()=>ch.classList.remove("on"),120));
