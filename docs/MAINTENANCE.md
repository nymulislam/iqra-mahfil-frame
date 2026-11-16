# রক্ষণাবেক্ষণ

## সবচেয়ে সাধারণ পরিবর্তন

| কাজ | কোথায় |
|---|---|
| তারিখ, ফোন, ফেসবুক, ঠিকানা, ম্যাপের জায়গা (`map`), পদবীর চিপ | `public/js/config.js` → `CFG` |
| বিকাশ/নগদ ব্যাজ | `public/js/ui.js` (যোগাযোগ পপআপ) ও `public/css/overlays.css` (`.pay`) |
| শেয়ার ক্যাপশনের লেখা | `public/js/share.js` → `CAP()` |
| ক্যালেন্ডার সময় (এখন আনুমানিক দুপুর ১টা) | `config.js` → `CAL` (`dates=` UTC-তে, বাংলাদেশ = UTC+৬) |
| রঙ | `public/css/base.css` → `:root` টোকেন |
| ডেভেলপারের লাইন | `public/js/core.js` → `DEV` |
| যোগাযোগ পপআপের লেখা | `public/js/ui.js` → `$("#nc").onclick` |
| শেয়ার লিংক (`SITE`) | `public/js/share.js` |
| অ্যাপের নাম/আইকন রঙ | `manifest.webmanifest`, `scripts/make-icons.py` |

## পরের বছর (বা নতুন মাহফিল)

1. **ডিজাইনারের নতুন ফ্রেম PNG নিন** (ছবির জায়গা স্বচ্ছ রাখতে বলুন)।
2. প্রতিটার জন্য চালান:
   ```bash
   pip install pillow numpy scipy
   python3 scripts/prepare-frame.py নতুন.png public/assets/frames/frame-1.webp
   ```
   এটা WebP বানায় আর `CFG.photo = {...}` ছাপে — সেটা `config.js`-এ বসান।
3. **নামের বক্স (`CFG.box`) মাপুন:** ফ্রেম ১০৮০px প্রস্থে ছোট করে ছবি-এডিটরে বক্সের বাঁ-উপর কোণ (x, y), প্রস্থ, উচ্চতা, মাঝের x (`cx`) ও রঙ (`fill`) বসান। বক্সের ধার ঢেকে না যায়, তাই ভেতরের দিকে ২–৩px কম রাখুন। টেক্সট লাইনের y (`772/787/812/839/848`) `js/core.js`-এ আছে।
4. **তারিখ** `CFG.date = [বছর, মাস(০ থেকে), দিন]`, এবং `index.html`/`core.js`/`share.js`/`sw`-এর বাংলা লেখায় "২০২৬" খুঁজে বদলান (`grep -rn "২০২৬" public`)।
5. **পোস্টার** `public/assets/poster.jpg` বদলান (সম্ভব হলে ≥ ২০০০px উচ্চতা)। তারপর `python3 scripts/make-icons.py` চালালে `og-image.jpg` নতুন পোস্টার থেকে হবে।
6. `sw.js` → `VERSION` বাড়ান। ডিপ্লয় করুন।

## ছবির জানালা ভুল বসলে

- ছবির কিনারায় ফাঁক/কালো দাগ → `CFG.photo` ছোট; `prepare-frame.py`-এর ছাপা মাপ ব্যবহার করুন।
- ফ্রেমের ধার ছবির উপরে না এলে → PNG-তে জানালার চারপাশ অস্বচ্ছ কি না দেখুন।

## নিজের সার্ভারে ফন্ট (প্রস্তাবিত)

ক্যানভাসে লেখা Google Fonts-এর উপর নির্ভর করে; নেটওয়ার্ক না থাকলে অন্য ফন্টে আসে। সমাধান:
1. Hind Siliguri (400/500/600/700) `woff2` ডাউনলোড করুন (যেমন Fontsource: `npm i @fontsource/hind-siliguri`, `files/` থেকে বাংলা সাবসেট)।
2. `public/assets/fonts/`-এ রাখুন।
3. `public/css/base.css`-এর শুরুতে `@font-face` যোগ করুন (`font-display: swap`)।
4. `index.html` থেকে Google Fonts `<link>` তিনটি সরান।
5. `sw.js`-এর `PRECACHE`-এ ফন্ট ফাইল যোগ করুন, `VERSION` বাড়ান।

## নতুন আইকন যোগ

`index.html`-এর স্প্রাইটে `<symbol id="i-নাম" viewBox="0 0 24 24">...</symbol>` যোগ করুন (স্ট্রোক আইকন, ২৪×২৪)। ব্যবহার: `<svg class="ic"><use href="#i-নাম"/></svg>` বা JS-এ `ico("নাম")`।

## বাগ খোঁজার টিপস

- Chrome DevTools → Application → Service Workers: "Update on reload" চালু রাখুন, সমস্যা হলে "Unregister" ও Clear storage।
- মোবাইল ডিবাগ: Android Chrome → `chrome://inspect`; iPhone → Mac Safari Web Inspector।
- ছবি বাছা না খুললে: ব্রাউজার/অ্যাপের ধরন জানুন (ইন-অ্যাপ ব্রাউজারে ফাইল পিকার সীমিত থাকতে পারে)।

## লঞ্চ চেকলিস্ট

- [x] `og:image`/`og:url` ডোমেইন বসানো (`https://iqra.annujum.org/`)
- [x] `SITE` (share.js) বসানো (`https://iqra.annujum.org/`)
- [x] Hind Siliguri সেলফ-হোস্টেড ফন্ট ডাউনলোড ও লিঙ্ক করা
- [x] `sw.js` VERSION বাড়ানো (`2026.11.3`)
- [ ] Cloudflare Pages-এ `iqra.annujum.org` কাস্টম ডোমেইন ম্যাপ করা
- [ ] দুই ফ্রেমে ছবি-নাম-পদবী দিয়ে ডাউনলোড টেস্ট
- [ ] শেয়ার (WhatsApp/Messenger) টেস্ট
- [ ] PWA ইনস্টল ও অফলাইন টেস্ট
- [ ] ফেসবুক ইন-অ্যাপ ব্রাউজারে টেস্ট
