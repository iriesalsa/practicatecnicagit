const CACHE_NAME = "bds-practicatecnica-v179-admision";
const ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/buho-original.svg", "/escudo-ctpmn.svg", "/logo-mep.svg", "/bds-banco-mep.js", "/bds-admision.js", "/bds-biblioteca-ilustrada.js", "/bds-juegos.js", "/bds-admin-mep.js", "/bds-auth-guard.js"];
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS).catch(() => {}))); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, cp)).catch(() => {}); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html"))));
});