(function () {
  "use strict";
  if (window.__BDS_RESPONSIVE_PRO_V5__) return;
  window.__BDS_RESPONSIVE_PRO_V5__ = true;

  var DOMINIOS_OK = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];

  function setBuhoFavicon() {
    var fav = document.querySelector("link[rel='icon']") || document.createElement("link");
    fav.rel = "icon";
    fav.type = "image/svg+xml";
    fav.href = "/buho-azul-circular.svg";
    if (!fav.parentNode) document.head.appendChild(fav);
  }

  function calcularLuminancia(rgbStr) {
    var m = String(rgbStr || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return 0;
    return (0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3])) / 255;
  }

  function sincronizarContrasteModoClaro() {
    var html = document.documentElement;
    var body = document.body;
    if (!body) return;
    var cls = (html.className + " " + body.className).toLowerCase();
    var dataTheme = (html.getAttribute("data-theme") || body.getAttribute("data-theme") || "").toLowerCase();
    var bgLum = calcularLuminancia(window.getComputedStyle(body).backgroundColor);
    var esClaro = dataTheme === "light" || cls.indexOf("light") !== -1 || cls.indexOf("claro") !== -1 || (cls.indexOf("dark") === -1 && bgLum > 0.65);
    if (esClaro) html.classList.add("bds-light-aaa");
    else html.classList.remove("bds-light-aaa");
  }

  var voces = [];
  function cargarVoces() {
    if ("speechSynthesis" in window) voces = window.speechSynthesis.getVoices() || [];
  }
  cargarVoces();
  if ("speechSynthesis" in window && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  function leerTextoSeguro(texto, lang) {
    if (!("speechSynthesis" in window)) return;
    var limpio = String(texto || "").replace(/\s+/g, " ").trim();
    if (!limpio) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(limpio);
    u.lang = lang || "es-CR";
    cargarVoces();
    var pref = u.lang.toLowerCase().split("-")[0];
    var voz = voces.find(function (v) { return v.lang && v.lang.toLowerCase() === u.lang.toLowerCase(); }) ||
              voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; });
    if (voz) u.voice = voz;
    try { window.speechSynthesis.resume(); } catch (_e) {}
    window.speechSynthesis.speak(u);
  }
  window.BDSAudioV5 = { speak: leerTextoSeguro };

  document.addEventListener("click", function (ev) {
    setTimeout(sincronizarContrasteModoClaro, 60);
    var btn = ev.target && ev.target.closest ? ev.target.closest("button") : null;
    if (!btn) return;
    var label = (btn.textContent || "").toLowerCase();
    if (label.indexOf("escuchar") !== -1 && !btn.closest("#bds-v50-modal")) {
      setTimeout(function () {
        if ("speechSynthesis" in window && !window.speechSynthesis.speaking) {
          var card = btn.closest("section, article, [class*='rounded-'], main") || document.body;
          var texto = (card.innerText || "").replace(/Escuchar|Motivaci\u00f3n|Recordatorio/gi, "").trim().slice(0, 320);
          var lang = /\b(choose|therefore|however|consequently|subsequently|furthermore)\b/i.test(texto) ? "en-US" :
                     /\b(choisissez|ensuite|parce que|bonjour)\b/i.test(texto) ? "fr-FR" :
                     /\b(w\u00e4hle|deshalb|danach|schule)\b/i.test(texto) ? "de-DE" :
                     /\b(escolha|portanto|seguida|al\u00e9m disso)\b/i.test(texto) ? "pt-BR" : "es-CR";
          leerTextoSeguro(texto, lang);
        }
      }, 180);
    }
  }, true);

  function activarArrastreMopt(canvas) {
    if (!canvas || canvas.dataset.bdsDragReady === "1") return;
    canvas.dataset.bdsDragReady = "1";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    var activo = false, lastX = 0, lastY = 0, keyDown = null;
    function soltar() {
      if (keyDown) {
        window.dispatchEvent(new KeyboardEvent("keyup", { key: keyDown, bubbles: true }));
        keyDown = null;
      }
    }
    function presionar(key) {
      if (keyDown === key) return;
      soltar();
      keyDown = key;
      window.dispatchEvent(new KeyboardEvent("keydown", { key: key, bubbles: true }));
    }

    canvas.addEventListener("pointerdown", function (e) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_err) {}
      activo = true; lastX = e.clientX; lastY = e.clientY;
      canvas.style.cursor = "grabbing";
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!activo) return;
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx) > 10) { presionar(dx > 0 ? "ArrowRight" : "ArrowLeft"); lastX = e.clientX; }
      else if (Math.abs(dy) > 16) { presionar(dy < 0 ? "ArrowUp" : "ArrowDown"); lastY = e.clientY; }
    });
    canvas.addEventListener("pointerup", function () { activo = false; canvas.style.cursor = "grab"; soltar(); });
    canvas.addEventListener("pointercancel", function () { activo = false; canvas.style.cursor = "grab"; soltar(); });
  }

  function validarDominioAutorizado(valor) {
    var v = String(valor || "").trim().toLowerCase();
    var p = v.split("@");
    return p.length === 2 && p[0].length > 0 && DOMINIOS_OK.indexOf(p[1]) !== -1;
  }

  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    if (!form || !form.querySelector || form.closest("#bds-v50-modal")) return;
    var pass = form.querySelector("input[type='password']");
    var mail = form.querySelector("input[type='email'], input[name*='mail' i], input[placeholder*='correo' i], input[placeholder*='mep' i]");
    if (pass && mail && !validarDominioAutorizado(mail.value)) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      mail.setCustomValidity("Acceso restringido: solo correos @gmail.com, @mep.go.cr o @est.mep.go.cr.");
      mail.reportValidity();
      setTimeout(function () { mail.setCustomValidity(""); }, 3000);
    }
  }, true);

  function iniciar() {
    setBuhoFavicon();
    sincronizarContrasteModoClaro();
    document.querySelectorAll("canvas").forEach(activarArrastreMopt);
    var obs = new MutationObserver(function () {
      document.querySelectorAll("canvas").forEach(activarArrastreMopt);
      sincronizarContrasteModoClaro();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-theme"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();