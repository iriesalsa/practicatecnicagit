const CACHE_NAME = "practicatecnica-bds-v520";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/buho-azul-circular.svg",
  "/bds-responsive-pro.css?v=510",
  "/bds-responsive-pro.js?v=510",
  "/bds-trazabilidad-rbac-ux.js?v=510",
  "/bds-qr-validacion-pro.js?v=520"
];
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(CORE_ASSETS).catch(() => {})));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const cl = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, cl)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});