/* fields.js — নাম ও পদবীর ঘর এবং পদবীর চিপস
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
[nm,ds].forEach(i=>i.addEventListener("input",()=>{
  i.parentNode.classList.remove("bad");
  state();
  draw();
  try{localStorage.setItem(i.id,i.value)}catch(_){}
}));

nm.addEventListener("keydown",e=>{if(e.key=="Enter"){e.preventDefault();ds.focus()}});
ds.addEventListener("keydown",e=>{if(e.key=="Enter"){e.preventDefault();ds.blur();if(window.INFO)INFO.cl()}});

[nm,ds].forEach(i=>{
  i.addEventListener("focus",()=>{
    setTimeout(()=>{
      try{i.scrollIntoView({behavior:"smooth",block:"center"})}catch(_){}
    },280);
  });
});

const ch=$("#chips");
if(ch){
  CFG.titles.forEach(s=>{
    const b=document.createElement("button");
    b.textContent=s;
    b.type="button";
    b.onpointerdown=e=>e.preventDefault();
    b.onclick=()=>{
      ds.value=s;
      ds.dispatchEvent(new Event("input"));
      ch.querySelectorAll("button").forEach(x=>x.classList.toggle("sel",x.textContent===s));
    };
    ch.appendChild(b);
  });
}
