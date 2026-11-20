const CACHE_PREFIX = "bds-practica-";
const CACHE_NAME = "bds-practica-v232-superadmin-auth";
const ICON_PATH = "/buho-oficial.png?v=232";
self.addEventListener("install", (e) => e.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
self.addEventListener("push", (event) => {
  let payload = { title: "pracTICAtecnica.com — Aviso Privado", body: "Nuevo registro verificado con sello SHA-256.", url: "/" };
  try { if (event.data) payload = { ...payload, ...event.data.json() }; } catch {}
  event.waitUntil(self.registration.showNotification(payload.title, { body: payload.body, icon: ICON_PATH, badge: ICON_PATH, vibrate: [200, 100, 200], tag: payload.tag || "bds-porton-push", renotify: true, data: { url: payload.url || "/" } }));
});