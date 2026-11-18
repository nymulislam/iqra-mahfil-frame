/* sw.js — Modern Cache-Buster & Offline Handler for Next.js */
const VERSION = "v2.0.1-nextjs";
const CACHE_NAME = `iqra-mahfil-${VERSION}`;

const isLocalhost = Boolean(
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '::1' ||
  self.location.hostname.endsWith('.local')
);

if (isLocalhost) {
  // In development, instantly self-destruct and purge caches to avoid breaking Webpack HMR
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
  });

  // Zero fetch interception on localhost
} else {
  // Production Service Worker
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
    if (url.pathname.startsWith("/api/live/")) return;

    // For HTML navigation: Network first, fallback to cache
    if (req.mode === "navigate") {
      e.respondWith(
        fetch(req).catch(() => caches.match(req))
      );
      return;
    }

    // Next.js hashed assets in _next/ are immutable in production, safe to cache-first
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
          const netFetch = fetch(req, url.origin === self.location.origin ? { cache: "no-cache" } : undefined)
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
}
