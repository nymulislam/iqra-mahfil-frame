# ইক্বরা মাহফিল ২০২৬ — ফটো ফ্রেম (PWA)

ইক্বরা ইন্টারন্যাশনাল মাদরাসার বার্ষিক তাফসীরুল কুরআন মাহফিলের ফটো ফ্রেম ওয়েবসাইট।
ব্যবহারকারী ছবি, নাম ও পদবী দিয়ে ফ্রেম বানায়, ডাউনলোড বা শেয়ার করে। মোবাইল-প্রথম, এক স্ক্রিনের অ্যাপের মতো, ইনস্টল করা যায় (PWA)।

- কোনো ব্যাকএন্ড বা বিল্ড ধাপ নেই — শুধু স্ট্যাটিক ফাইল (`public/`)।
- ব্যবহারকারীর ছবি কোথাও আপলোড হয় না; সব কাজ ফোনের ব্রাউজারেই হয়।
- হোস্টিং: **Cloudflare Pages** অথবা **Cloudflare Workers (Static Assets)**।

## ফোল্ডার কাঠামো

```
mahfil-frame/
├─ README.md                 এই ফাইল
├─ package.json              স্ক্রিপ্ট শর্টকাট (dev / deploy)
├─ wrangler.jsonc            Workers Static Assets কনফিগ
├─ docs/
│  ├─ ARCHITECTURE.md        কোড কীভাবে সাজানো, কীভাবে কাজ করে
│  ├─ DEPLOYMENT.md          Cloudflare-এ ডিপ্লয়, ডোমেইন, হেডার
│  ├─ MAINTENANCE.md         প্রতি বছর/পরিবর্তনের চেকলিস্ট
│  └─ TECH-DECISIONS.md      কেন এই স্ট্যাক, কখন বদলাবেন
├─ scripts/
│  ├─ make-icons.py          PWA আইকন + og-image তৈরি
│  └─ prepare-frame.py       নতুন ফ্রেম PNG → WebP + মাপ
└─ public/                   ← শুধু এই ফোল্ডারটাই ডিপ্লয় হয়
   ├─ index.html             পেজ কাঠামো + আইকন স্প্রাইট
   ├─ manifest.webmanifest   PWA ম্যানিফেস্ট
   ├─ sw.js                  Service Worker (অফলাইন/ক্যাশ)
   ├─ _headers               ক্যাশ ও সিকিউরিটি হেডার
   ├─ favicon.svg, og-image.jpg
   ├─ css/                   base → layout → components → overlays → features
   ├─ js/                    config → core → layout → photo → fields → gestures → ui → share → fx → pwa
   └─ assets/
      ├─ frames/             frame-1.webp (সবুজ-নীল), frame-2.webp (মাটি রঙ)
      ├─ icons/              PWA/অ্যাপল আইকন
      └─ poster.jpg          মাহফিলের পোস্টার
```

## দ্রুত শুরু

```bash
npm install            # একবার (wrangler)
npm run dev            # লোকাল সার্ভার (wrangler dev)
# অথবা কিছু ইনস্টল না করে:  cd public && python3 -m http.server 8788
```

ডিপ্লয়: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) · পরিবর্তন/পরের বছর: [docs/MAINTENANCE.md](docs/MAINTENANCE.md) · কোডের গঠন: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## ডেভেলপার

Made by NAYMUL ISLAM
