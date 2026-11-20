const CACHE_PREFIX = "bds-practica-";
const CACHE_NAME = "bds-practica-v233-safe-network";
self.addEventListener("install", (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Nunca servir HTML ni bundles JS desde caché antigua
  if (e.request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.startsWith("/assets/")) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});