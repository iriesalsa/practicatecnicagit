(function () {
  async function limpiarCacheYActualizar(silencioso) {
    try {
      if (typeof caches !== "undefined" && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if (typeof navigator !== "undefined" && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.update().catch(() => {})));
      }
      if (!silencioso && typeof window !== "undefined" && window.location) {
        const u = new URL(window.location.href);
        u.searchParams.set("v215_sync", String(Date.now()));
        window.location.replace(u.toString());
      }
      return true;
    } catch {
      if (!silencioso && typeof window !== "undefined" && window.location) {
        window.location.reload();
      }
      return false;
    }
  }

  function registrarEscuchaSW() {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;
    navigator.serviceWorker.register("/sw-bds-v215.js?v=215").then((reg) => {
      reg.update().catch(() => {});
    }).catch(() => {});

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "BDS_SW_UPDATED") {
        if (typeof window !== "undefined" && window.BDS_NATIVE && window.BDS_NATIVE.showInAppToast) {
          window.BDS_NATIVE.showInAppToast("🔄 Versión v215.0 Lista", "Caché actualizada en este dispositivo.");
        }
      }
    });
  }

  window.BDS_CACHE_PURGE = { limpiarCacheYActualizar, registrarEscuchaSW };
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", registrarEscuchaSW);
  }
})();