(function () {
  "use strict";
  if (window.__BDS_SHIELD_V70__) return;
  window.__BDS_SHIELD_V70__ = true;

  var DOMINIOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
  var MAX_INTENTOS = 5;
  var K_FAILS = "pt_v7_auth_fails";

  function escHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  window.bdsEscHtml = escHtml;

  function correoAutorizado(val) {
    var s = String(val || "").trim().toLowerCase();
    var p = s.split("@");
    return p.length === 2 && p[0].length > 0 && DOMINIOS.indexOf(p[1]) !== -1;
  }

  function syncContrasteClaro() {
    try {
      var html = document.documentElement, body = document.body;
      if (!body) return;
      var cls = (html.className + " " + body.className).toLowerCase();
      var dt = (html.getAttribute("data-theme") || body.getAttribute("data-theme") || "").toLowerCase();
      var esClaro = dt === "light" || cls.indexOf("bds-light") !== -1 || (cls.indexOf("light") !== -1 && cls.indexOf("dark") === -1);
      var tiene = html.classList.contains("bds-light-aaa");
      if (esClaro && !tiene) html.classList.add("bds-light-aaa");
      else if (!esClaro && tiene) html.classList.remove("bds-light-aaa");
    } catch (_e) {}
  }

  function activarMoptTactil(canvas) {
    try {
      if (!canvas || canvas.dataset.bdsMoptV7 === "1") return;
      canvas.dataset.bdsMoptV7 = "1";
      canvas.style.touchAction = "none";
      canvas.style.cursor = "grab";
      var drag = false, lx = 0, ly = 0, kd = null;
      function soltar() { if (kd) { window.dispatchEvent(new KeyboardEvent("keyup", { key: kd, bubbles: true })); kd = null; } }
      function pulsar(k) { if (kd === k) return; soltar(); kd = k; window.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })); }
      canvas.addEventListener("pointerdown", function (e) { try { canvas.setPointerCapture(e.pointerId); } catch (_e) {} drag = true; lx = e.clientX; ly = e.clientY; });
      canvas.addEventListener("pointermove", function (e) {
        if (!drag) return;
        var dx = e.clientX - lx, dy = e.clientY - ly;
        if (Math.abs(dx) > 10) { pulsar(dx > 0 ? "ArrowRight" : "ArrowLeft"); lx = e.clientX; }
        else if (Math.abs(dy) > 16) { pulsar(dy < 0 ? "ArrowUp" : "ArrowDown"); ly = e.clientY; }
      });
      canvas.addEventListener("pointerup", function () { drag = false; soltar(); });
      canvas.addEventListener("pointercancel", function () { drag = false; soltar(); });
    } catch (_e) {}
  }

  document.addEventListener("submit", function (ev) {
    try {
      var form = ev.target;
      if (!form || !form.querySelector) return;
      var pass = form.querySelector("input[type='password']");
      var mail = form.querySelector("input[type='email'], input[name*='mail' i], input[placeholder*='correo' i], input[placeholder*='mep' i]");
      if (!pass || !mail) return;

      var fails = Number(localStorage.getItem(K_FAILS) || "0");
      if (fails >= MAX_INTENTOS) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        mail.setCustomValidity("Acceso bloqueado tras 5 intentos fallidos. Contacta al administrador de soporte.");
        mail.reportValidity();
        return;
      }
      if (!correoAutorizado(mail.value)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var next = fails + 1;
        localStorage.setItem(K_FAILS, String(next));
        mail.setCustomValidity("Solo se permiten correos @gmail.com, @mep.go.cr o @est.mep.go.cr (" + next + "/" + MAX_INTENTOS + ").");
        mail.reportValidity();
        setTimeout(function () { mail.setCustomValidity(""); }, 3200);
      } else {
        localStorage.setItem(K_FAILS, "0");
      }
    } catch (_e) {}
  }, true);

  function boot() {
    syncContrasteClaro();
    document.querySelectorAll("canvas").forEach(activarMoptTactil);
    var timer = 0;
    var obs = new MutationObserver(function () {
      if (timer) return;
      timer = setTimeout(function () {
        timer = 0;
        syncContrasteClaro();
        document.querySelectorAll("canvas").forEach(activarMoptTactil);
      }, 150);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-theme"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();