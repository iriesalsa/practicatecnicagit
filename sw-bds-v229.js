const CACHE_PREFIX = "bds-practica-";
const CACHE_NAME = "bds-practica-v229-realtime-push";
const ICON_PATH = "/buho-oficial.png?v=229";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

// Notificaciones Push en segundo plano (suenan aun con la app cerrada)
self.addEventListener("push", (event) => {
  let payload = {
    title: "pracTICAtecnica.com — Aviso Institucional",
    body: "Se registró un nuevo movimiento de entrada o salida.",
    url: "/"
  };
  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    }
  } catch {
    try { if (event.data) payload.body = event.data.text(); } catch {}
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: ICON_PATH,
      badge: ICON_PATH,
      vibrate: [200, 100, 200],
      tag: payload.tag || "bds-porton-push",
      renotify: true,
      data: { url: payload.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});