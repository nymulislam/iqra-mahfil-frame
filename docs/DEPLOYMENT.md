# ডিপ্লয় (Cloudflare)

> এই নির্দেশনা Cloudflare-এর সাধারণ ওয়ার্কফ্লো অনুযায়ী লেখা; এখান থেকে আমি আসল Cloudflare অ্যাকাউন্টে ডিপ্লয় করে দেখিনি। কোনো ধাপ না মিললে Cloudflare ডকুমেন্টেশন দেখুন।

সাইট পুরোপুরি স্ট্যাটিক: ডিপ্লয় ফোল্ডার **`public/`**, বিল্ড কমান্ড **নেই**।

## পথ ক: Cloudflare Pages (Git দিয়ে — সবচেয়ে সহজ)

1. প্রজেক্ট GitHub-এ পুশ করুন।
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**।
3. রিপো বাছুন। সেটিংস:
   - Framework preset: **None**
   - Build command: *(খালি)*
   - Build output directory: **`public`**
4. Save and Deploy। প্রতি `git push`-এ নিজে নিজে ডিপ্লয় হবে।

> Pages প্রজেক্টে রুটের `wrangler.jsonc` নিয়ে সমস্যা মনে হলে ফাইলটা সরিয়ে রাখুন বা Pages-কে আলাদা রিপোতে দিন।

### Pages (CLI দিয়ে সরাসরি আপলোড)

```bash
npx wrangler login
npx wrangler pages deploy public --project-name iqra-mahfil-frame
```

## পথ খ: Workers (Static Assets)

`wrangler.jsonc` তৈরিই আছে (`assets.directory = ./public`)।

```bash
npm install
npx wrangler login
npx wrangler deploy
```

## ডোমেইন

Pages/Workers প্রজেক্ট → **Custom domains** → `iqra.annujum.org` যোগ করুন। ডোমেইন Cloudflare DNS-এ থাকলে SSL সার্টিফিকেট নিজে নিজে সক্রিয় হয়।

## ডিপ্লয়ের পরে চেকলিস্ট

1. **ডোমেইন কনফিগারেশন:** `public/index.html` ও `public/js/share.js`-এ ইতোমধ্যে `https://iqra.annujum.org/` সেট করা আছে।
2. **সার্ভিস ওয়ার্কার:** `public/sw.js`-এ `VERSION` বাড়ানো আছে (`2026.11.3`) এবং Hind Siliguri ফন্টগুলো সেলফ-হোস্টেড হিসেবে প্রি-ক্যাশ করা হয়েছে।
3. **ফোনে খুলে ইনস্টল করে দেখুন:** (Chrome: মেনু → Install app; Safari: Share → Add to Home Screen)।
4. **লিংক প্রিভিউ যাচাই:** Facebook Sharing Debugger-এ `https://iqra.annujum.org/` দিয়ে "Scrape Again" চাপুন।

## ক্যাশ ও আপডেট

- `_headers`: HTML/JS/CSS/`sw.js` সবসময় যাচাই হয় (`no-cache`), তাই নতুন ডিপ্লয় দ্রুত পৌঁছায়।
- ইউজারের কাছে নতুন কোড পৌঁছাতে `sw.js`-এর `VERSION` বাড়ানো জরুরি। পুরনো ক্যাশ `activate`-এ মুছে যায়।
- `assets/` ৭ দিন ক্যাশ হয়; ফ্রেম/পোস্টার বদলালে ফাইলের নাম বদলান (`frame-1-v2.webp`) এবং `PRECACHE` ও `config.js`-এ নাম ঠিক করুন।

## ঐচ্ছিক কঠোর CSP

`_headers`-এর শেষে কমেন্ট করা `Content-Security-Policy` আছে। চালু করতে `#` তুলুন, তারপর পুরো সাইট টেস্ট করুন (ছবি বাছা, ডাউনলোড, শেয়ার, পোস্টার, ইনস্টল)। কিছু ভাঙলে নীতি ঢিলা করুন।

## পরে Worker (সার্ভার-কোড) যোগ করতে চাইলে

লাইভ কাউন্টার, ফ্রেম-তৈরির সংখ্যা ইত্যাদির জন্য:

1. `src/worker.js` বানান (`export default { async fetch(req, env) { ... } }`)।
2. `wrangler.jsonc`-এ `"main": "src/worker.js"` ও দরকার হলে `kv_namespaces`/`d1_databases` যোগ করুন; `assets` ব্লক যেমন আছে থাকবে।
3. `/api/*` রুট Worker সামলাবে, বাকি সব স্ট্যাটিক ফাইল ডিফল্টে `public/` থেকে যাবে।
