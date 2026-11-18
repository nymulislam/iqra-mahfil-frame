/* sw.js — Modern Cache-Buster & Offline Handler for Next.js */
const VERSION = "v2.0.0-nextjs";
const CACHE_NAME = `iqra-mahfil-${VERSION}`;

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // For HTML navigation: Network first, fallback to cache
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // Next.js hashed assets in _next/ are immutable, safe to cache-first
  if (url.pathname.startsWith("/_next/")) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((hit) => {
          if (hit) return hit;
          return fetch(req).then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // Static assets (images, frames, posters): Stale-while-revalidate
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req).then((hit) => {
        const netFetch = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || netFetch;
      })
    )
  );
});
