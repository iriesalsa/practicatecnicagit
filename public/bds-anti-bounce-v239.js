(function () {
  if (typeof window === "undefined") return;
  if (window.__BDS_ANTI_BOUNCE_V239) return;
  window.__BDS_ANTI_BOUNCE_V239 = true;

  const SES_KEY = "bds_session_v184_ctpmn_c02";
  const LOCK_FLAG = "__BDS_ACTIVE_SESSION_LOCK_V239";

  function readSes() {
    try {
      const raw = sessionStorage.getItem(SES_KEY) || localStorage.getItem(SES_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (parsed && parsed.email) ? parsed : null;
    } catch {
      return null;
    }
  }

  function writeSes(obj) {
    if (!obj || !obj.email) return;
    try {
      const s = JSON.stringify(obj);
      sessionStorage.setItem(SES_KEY, s);
      localStorage.setItem(SES_KEY, s);
      window.__BDS_SESSION = obj;
      window[LOCK_FLAG] = Date.now();
    } catch {}
  }

  // Evitar que una recarga accidental tras loguear borre la sesión recién creada
  const existing = readSes();
  if (existing && existing.email) {
    writeSes(existing);
  }

  // Proteger removeItem/clear sobre la sesión mientras está recién iniciada (ventana de 8s)
  const origRemove = Storage.prototype.removeItem;
  Storage.prototype.removeItem = function (k) {
    if (String(k) === SES_KEY && window[LOCK_FLAG] && (Date.now() - window[LOCK_FLAG]) < 8000) {
      return;
    }
    return origRemove.apply(this, arguments);
  };

  const origClear = Storage.prototype.clear;
  Storage.prototype.clear = function () {
    const keep = readSes();
    const res = origClear.apply(this, arguments);
    if (keep && keep.email) writeSes(keep);
    return res;
  };

  // Asegurar que el menú y el shell queden visibles si existe sesión activa
  function asegurarMenuVisible() {
    try {
      if (typeof document === "undefined" || !document.body) return;
      const ses = readSes();
      if (!ses || !ses.email) return;
      const loginEl = document.getElementById("bds-login-v193");
      if (loginEl && loginEl.parentElement) {
        loginEl.style.display = "none";
      }
      const shell = document.getElementById("bds-shell");
      if (shell) {
        shell.style.display = "";
        shell.style.visibility = "visible";
        shell.style.opacity = "1";
      }
      ["bds-header", "bds-subnav", "bds-dock"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.display = "";
          el.style.visibility = "visible";
          el.style.opacity = "1";
        }
      });
    } catch {}
  }

  window.BDS_ANTI_BOUNCE_V239 = {
    readSes,
    writeSes,
    asegurarMenuVisible
  };

  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      asegurarMenuVisible();
      setTimeout(asegurarMenuVisible, 250);
      setTimeout(asegurarMenuVisible, 900);
    });
    window.addEventListener("load", () => {
      asegurarMenuVisible();
      setTimeout(asegurarMenuVisible, 400);
    });
  }
})();