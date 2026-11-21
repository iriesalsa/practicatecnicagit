(function () {
  "use strict";
  if (window.__BDS_CAP_GUARD_V80__) return;
  window.__BDS_CAP_GUARD_V80__ = true;

  function mostrarAvisoPrivado() {
    try {
      var id = "bds-v80-toast";
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.setAttribute("role", "status");
        el.setAttribute("aria-live", "polite");
        el.style.cssText =
          "position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:2147483647;" +
          "max-width:min(420px,calc(100vw - 24px));background:#0f172a;color:#f8fafc;" +
          "border:2px solid #38bdf8;border-radius:12px;padding:10px 14px;" +
          "font:700 12.5px system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.45);display:none";
        document.body.appendChild(el);
      }
      el.textContent = "Este espacio es privado: se restringen capturas, copia o descarga no autorizada de la pantalla.";
      el.style.display = "block";
      clearTimeout(el.__t);
      el.__t = setTimeout(function () { el.style.display = "none"; }, 2600);
    } catch (_e) {}
  }

  // Bloquear menu contextual, copia y arrastre fuera de campos de texto
  document.addEventListener("contextmenu", function (ev) {
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    ev.preventDefault();
    mostrarAvisoPrivado();
  }, true);

  document.addEventListener("copy", function (ev) {
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    ev.preventDefault();
    mostrarAvisoPrivado();
  }, true);

  document.addEventListener("dragstart", function (ev) {
    ev.preventDefault();
  }, true);

  // Disuasion de atajos comunes de impresion/guardar/captura en navegador (no bloquea Alt+L)
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "PrintScreen") {
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(""); } catch (_e) {}
      mostrarAvisoPrivado();
      return;
    }
    var ctrlOrMeta = ev.ctrlKey || ev.metaKey;
    if (ctrlOrMeta && ev.shiftKey && (ev.key === "I" || ev.key === "i" || ev.key === "J" || ev.key === "j" || ev.key === "C" || ev.key === "c" || ev.key === "S" || ev.key === "s")) {
      ev.preventDefault();
      mostrarAvisoPrivado();
      return;
    }
    if (ctrlOrMeta && !ev.shiftKey && !ev.altKey && (ev.key === "p" || ev.key === "P" || ev.key === "s" || ev.key === "S")) {
      ev.preventDefault();
      mostrarAvisoPrivado();
    }
  }, true);

  // Velo de privacidad al ocultar pestana o cambiar de aplicacion
  var velo = document.createElement("div");
  velo.id = "bds-v80-privacy-veil";
  velo.setAttribute("aria-hidden", "true");
  velo.style.cssText =
    "display:none;position:fixed;inset:0;z-index:2147483645;" +
    "background:#0f172a;color:#f8fafc;align-items:center;justify-content:center;padding:20px;" +
    "font-family:system-ui,-apple-system,sans-serif;text-align:center";
  velo.innerHTML =
    '<div style="max-width:380px;padding:20px;border-radius:16px;border:1.5px solid #334155;background:#1e293b">' +
    '<div style="font-size:15px;font-weight:800;margin-bottom:6px">Vista en pausa por privacidad</div>' +
    '<div style="font-size:12.5px;color:#cbd5e1">Vuelve a la ventana para continuar con tu sesi\u00f3n privada.</div>' +
    '</div>';

  function syncVelo() {
    try {
      if (document.hidden) {
        velo.style.display = "flex";
      } else {
        velo.style.display = "none";
      }
    } catch (_e) {}
  }

  function montar() {
    if (!document.getElementById("bds-v80-privacy-veil")) {
      document.body.appendChild(velo);
    }
    document.addEventListener("visibilitychange", syncVelo);
  }

  window.BDSCapGuardV80 = {
    isReady: function () { return true; },
    triggerNotice: mostrarAvisoPrivado
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();