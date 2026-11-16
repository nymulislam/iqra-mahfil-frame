/* config.js — কনফিগ — ইভেন্ট, ফ্রেমের মাপ, লিংক। বছর বদলালে মূলত এই ফাইল
   ক্লাসিক স্ক্রিপ্ট; index.html-এর ক্রমে লোড হয় (সব একই গ্লোবাল স্কোপ)। */
const SRC=["assets/frames/frame-1.webp","assets/frames/frame-2.webp"],POSTER="assets/poster.jpg"; // ফ্রেম ১ = সবুজ-নীল, ফ্রেম ২ = মাটি রঙ
/* ===== CONFIG: ফ্রেম/ইভেন্ট বদলাতে শুধু এই অংশ বদলান ===== */
const CFG={
 photo:{x:207,y:634,w:332,h:350},          // ফ্রেমের স্বচ্ছ জানালার সীমানা (১০৮০ মাপে) — ফ্রেম ছবির উপরে বসে
 box:{x:565,y:738,w:420,h:122,fill:"#e6f5fc",cx:775},  // নাম-পদবীর বক্স
 phone:"01797-091817",phoneRaw:"01797091817",
 date:[2026,11,5],                                      // বছর, মাস(০ থেকে), দিন
 fb:"https://www.facebook.com/iqramadrasah25",
 place:"ইক্বরা ইন্টারন্যাশনাল মাদরাসা, পাটওয়ারী বাজার, ফরিদগঞ্জ, চাঁদপুর",   // ক্যালেন্ডারের স্থান
 map:"পাটওয়ারী বাজার, বালিথুবা, ফরিদগঞ্জ, চাঁদপুর, বাংলাদেশ",             // ম্যাপ আইকনে এই জায়গা খোলে
 titles:["ছাত্র","শিক্ষক","হাফেজ","মাওলানা","অভিভাবক","ব্যবসায়ী","মুসল্লি","প্রাক্তন ছাত্র"]
};
const MAP="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(CFG.map),
 CAL="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("তাফসীরুল কুরআন মাহফিল ২০২৬")+"&dates=20261205T070000Z/20261205T140000Z&location="+encodeURIComponent(CFG.place);
const LOW=(navigator.deviceMemory&&navigator.deviceMemory<=2)||matchMedia("(prefers-reduced-motion:reduce)").matches;
const $=s=>document.querySelector(s),W=1080,H=1078,R=CFG.photo,PHONE=CFG.phone;
const bn=n=>String(n).replace(/\d/g,d=>"০১২৩৪৫৬৭৮৯"[d]);
