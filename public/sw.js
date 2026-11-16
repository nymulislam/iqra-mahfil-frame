/* sw.js — Service Worker (অফলাইনে চালানো ও দ্রুত লোড)
 * ডিপ্লয়ের সময় কোড/ফ্রেম/পোস্টার বদলালে VERSION বদলান — নইলে পুরনো ক্যাশ থেকে যেতে পারে।
 * কৌশল: নেভিগেশন = আগে নেটওয়ার্ক, না পেলে ক্যাশ; নিজের ফাইল = ক্যাশ আগে + পেছনে আপডেট;
 *        Google Fonts = ক্যাশ আগে + পেছনে আপডেট (আলাদা ক্যাশে)। */
const VERSION = "2026.11.4";
const CACHE = `mahfil-frame-${VERSION}`;
const FONTS = "mahfil-fonts";
const PRECACHE = [
  "/", "/index.html", "/manifest.webmanifest", "/favicon.svg",
  "/css/base.css", "/css/layout.css", "/css/components.css", "/css/overlays.css", "/css/features.css",
  "/js/config.js", "/js/core.js", "/js/layout.js", "/js/photo.js", "/js/fields.js",
  "/js/gestures.js", "/js/ui.js", "/js/share.js", "/js/fx.js", "/js/pwa.js",
  "/assets/frames/frame-1.webp", "/assets/frames/frame-2.webp", "/assets/poster.jpg",
  "/assets/icons/icon-192.png", "/assets/icons/icon-512.png",
  "/assets/fonts/hind-siliguri-bengali-400.woff2",
  "/assets/fonts/hind-siliguri-bengali-500.woff2",
  "/assets/fonts/hind-siliguri-bengali-600.woff2",
  "/assets/fonts/hind-siliguri-bengali-700.woff2",
  "/assets/fonts/hind-siliguri-latin-400.woff2",
  "/assets/fonts/hind-siliguri-latin-500.woff2",
  "/assets/fonts/hind-siliguri-latin-600.woff2",
  "/assets/fonts/hind-siliguri-latin-700.woff2",
  "/assets/fonts/hind-siliguri-latin-ext-400.woff2",
  "/assets/fonts/hind-siliguri-latin-ext-500.woff2",
  "/assets/fonts/hind-siliguri-latin-ext-600.woff2",
  "/assets/fonts/hind-siliguri-latin-ext-700.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const swr = (req, name) => caches.open(name).then(cache =>
  cache.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })
);

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (req.mode === "navigate") {
      e.respondWith(fetch(req).catch(() => caches.match("/index.html")));
      return;
    }
    e.respondWith(swr(req, CACHE));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(swr(req, FONTS));
  }
});
