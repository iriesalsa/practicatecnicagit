(function () {
  "use strict";
  if (window.__BDS_VOZ_CIEGOS_V78__) return;
  window.__BDS_VOZ_CIEGOS_V78__ = true;

  var voces = [];
  var cola = [];
  var timerId = 0;
  var rateActual = 0.94;

  function cargarVoces() {
    try {
      if ("speechSynthesis" in window) {
        var lista = window.speechSynthesis.getVoices();
        if (lista && lista.length) voces = lista;
      }
    } catch (_e) {}
  }
  cargarVoces();
  if ("speechSynthesis" in window && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  function elegirVoz(lang) {
    cargarVoces();
    if (!voces.length) return null;
    var target = String(lang || "es-419").toLowerCase();
    if (target.indexOf("es") === 0) {
      var prefLat = ["es-419", "es-cr", "es-mx", "es-us", "es-co", "es-cl", "es-ar", "es-pe", "es-es"];
      for (var i = 0; i < prefLat.length; i++) {
        var vLat = voces.find(function (v) { return v.lang && v.lang.toLowerCase() === prefLat[i]; });
        if (vLat) return vLat;
      }
      return voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf("es") === 0; }) || voces[0];
    }
    var pref = target.split("-")[0];
    return voces.find(function (v) { return v.lang && v.lang.toLowerCase() === target; }) ||
           voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; }) ||
           voces[0];
  }

  function dividirTexto(texto) {
    var limpio = String(texto || "").replace(/\s+/g, " ").trim();
    if (!limpio) return [];
    var trozos = limpio.match(/[^.!?\n]+[.!?\n]?/g) || [limpio];
    var out = [];
    trozos.forEach(function (t) {
      var s = t.trim();
      while (s.length > 165) {
        var idx = s.lastIndexOf(" ", 165);
        if (idx < 35) idx = 165;
        out.push(s.slice(0, idx).trim());
        s = s.slice(idx).trim();
      }
      if (s) out.push(s);
    });
    return out;
  }

  function hablarSiguiente(lang, rate) {
    if (!("speechSynthesis" in window)) return;
    if (!cola.length) {
      anunciarEstado("Lectura finalizada.");
      return;
    }
    var frase = cola.shift();
    var utter = new SpeechSynthesisUtterance(frase);
    utter.lang = lang || "es-419";
    utter.rate = rate || rateActual;
    utter.pitch = 1.0;
    var voz = elegirVoz(utter.lang);
    if (voz) utter.voice = voz;

    utter.onend = function () {
      if (cola.length) hablarSiguiente(lang, rate);
      else anunciarEstado("Lectura finalizada.");
    };
    utter.onerror = function () {
      cola = [];
    };

    try { window.speechSynthesis.resume(); } catch (_e) {}
    window.speechSynthesis.speak(utter);
  }

  function leerEnVozAlta(texto, lang, rate) {
    try {
      if (!("speechSynthesis" in window)) {
        anunciarEstado("Este dispositivo no tiene sintesis de voz disponible.");
        return false;
      }
      var partes = dividirTexto(texto);
      if (!partes.length) return false;
      cola = partes;
      if (timerId) clearTimeout(timerId);
      window.speechSynthesis.cancel();
      anunciarEstado("Reproduciendo en voz alta.");
      timerId = setTimeout(function () {
        timerId = 0;
        hablarSiguiente(lang || "es-419", rate || rateActual);
      }, 65);
      return true;
    } catch (_e) {
      return false;
    }
  }

  function detenerLectura() {
    try {
      cola = [];
      if (timerId) { clearTimeout(timerId); timerId = 0; }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      anunciarEstado("Lectura detenida.");
    } catch (_e) {}
  }

  // Region aria-live para lectores de pantalla de personas ciegas
  function asegurarLiveRegion() {
    if (document.getElementById("bds-v78-live")) return;
    var live = document.createElement("div");
    live.id = "bds-v78-live";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;";
    document.body.appendChild(live);
  }

  function anunciarEstado(msg) {
    try {
      asegurarLiveRegion();
      var el = document.getElementById("bds-v78-live");
      if (el) {
        el.textContent = "";
        setTimeout(function () { if (el) el.textContent = String(msg || ""); }, 20);
      }
    } catch (_e) {}
  }

  function obtenerMotivacionVisible() {
    try {
      var textos = Array.from(document.querySelectorAll("p, blockquote, div, article, section"));
      for (var i = 0; i < textos.length; i++) {
        var el = textos[i];
        if (el.children && el.children.length > 4) continue;
        var t = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
        if (t.length >= 25 && t.length <= 420 && /felicidades|racha|paso a paso|ritmo|aprender|motivaci|esfuerzo|practica|pr[aá]ctica|constancia/i.test(t)) {
          return t;
        }
      }
    } catch (_e) {}
    return "Cada persona aprende a su propio ritmo. Un paso claro hoy construye confianza y avance real. Respira, t\u00f3mate tu tiempo y contin\u00faa con tranquilidad.";
  }

  function extraerContextoBoton(btn) {
    var box = btn.closest("article, section, form, [role='dialog'], .rounded-xl, .rounded-2xl, main") || document.body;
    var clon = box.cloneNode(true);
    clon.querySelectorAll("script, style, nav, header, footer").forEach(function (n) { n.remove(); });
    var limpio = (clon.innerText || clon.textContent || "")
      .replace(/\b(Escuchar|Motivaci[oó]n|Recordatorio|Siguiente|Anterior|Cerrar)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!limpio || limpio.length < 15) return obtenerMotivacionVisible();
    return limpio.slice(0, 620);
  }

  // Enriquecer botones con aria-label claro para personas ciegas
  function mejorarAccesibilidadCiegos() {
    try {
      asegurarLiveRegion();
      document.querySelectorAll("button, a, [role='button'], input, select").forEach(function (el) {
        if (!el.getAttribute("aria-label")) {
          var txt = (el.textContent || el.getAttribute("placeholder") || "").replace(/\s+/g, " ").trim();
          if (txt) el.setAttribute("aria-label", txt);
        }
      });
    } catch (_e) {}
  }

  // Interceptar clics en Escuchar o Motivacion para garantizar audio audible
  document.addEventListener("click", function (ev) {
    try {
      var btn = ev.target && ev.target.closest ? ev.target.closest("button, [role='button']") : null;
      if (!btn) return;
      var txt = ((btn.textContent || "") + " " + (btn.getAttribute("aria-label") || "")).trim();
      var esEscuchar = /\bescuchar\b|\baudio\b|\blisten\b|\bvoz\b|🔊|🔈/i.test(txt);
      var esMotivacion = /\bmotivaci[oó]n\b/i.test(txt);

      if (esMotivacion && !esEscuchar) {
        var mot = obtenerMotivacionVisible();
        setTimeout(function () {
          if ("speechSynthesis" in window && !window.speechSynthesis.speaking) {
            leerEnVozAlta(mot, "es-419", rateActual);
          }
        }, 180);
        return;
      }

      if (esEscuchar) {
        var texto = btn.getAttribute("data-audio-text") || btn.getAttribute("data-speak") || extraerContextoBoton(btn);
        var lang = btn.getAttribute("data-lang") || "es-419";
        setTimeout(function () {
          if ("speechSynthesis" in window && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
            leerEnVozAlta(texto, lang, rateActual);
          }
        }, 180);
      }
    } catch (_e) {}
  }, true);

  // Atajo universal para personas ciegas: Alt + L lee la motivacion o bloque activo
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey && (ev.key === "l" || ev.key === "L")) {
      ev.preventDefault();
      leerEnVozAlta(obtenerMotivacionVisible(), "es-419", rateActual);
    }
  });

  // Panel flotante compacto de Voz Inclusiva DUA (Personas Ciegas / Baja Vision)
  function montarPanelVozCiegos() {
    if (document.getElementById("bds-v78-voz-btn")) return;
    var b = document.createElement("button");
    b.id = "bds-v78-voz-btn";
    b.type = "button";
    b.setAttribute("aria-label", "Escuchar motivacion y lectura en voz alta para personas ciegas y accesibilidad DUA");
    b.style.cssText =
      "position:fixed;left:12px;bottom:76px;z-index:2147483630;" +
      "background:#047857;color:#ffffff;border:2px solid #6ee7b7;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 20px rgba(15,23,42,.42);cursor:pointer";
    b.textContent = "\ud83d\udd0a Voz DUA / Ciegos";
    document.body.appendChild(b);

    var panel = document.createElement("div");
    panel.id = "bds-v78-voz-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Lectura en voz alta inclusiva DUA");
    panel.style.cssText =
      "display:none;position:fixed;left:12px;bottom:124px;z-index:2147483640;" +
      "width:min(360px,calc(100vw - 24px));background:#ffffff;color:#0f172a;" +
      "border:2px solid #047857;border-radius:16px;padding:14px;" +
      "box-shadow:0 20px 45px rgba(15,23,42,.45);font-family:system-ui,sans-serif";
    document.body.appendChild(panel);

    function renderPanel() {
      var mot = obtenerMotivacionVisible();
      panel.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<strong style="font-size:14px;color:#065f46">Lectura Inclusiva DUA (Voz Alta)</strong>' +
        '<button id="bds-v78-close" type="button" aria-label="Cerrar panel de voz" style="background:#b91c1c;color:#fff;border:none;border-radius:7px;padding:4px 9px;font-weight:800;cursor:pointer">Cerrar</button></div>' +
        '<p id="bds-v78-mot-txt" style="margin:0 0 10px;font-size:13px;line-height:1.5;background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:10px;color:#0f172a">' +
        mot.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">' +
        '<button id="bds-v78-play" type="button" style="flex:1;background:#047857;color:#fff;border:none;border-radius:9px;padding:8px 10px;font-size:12px;font-weight:800;cursor:pointer">\u25b6 Escuchar Motivaci\u00f3n</button>' +
        '<button id="bds-v78-slow" type="button" style="background:#1e40af;color:#fff;border:none;border-radius:9px;padding:8px 10px;font-size:12px;font-weight:800;cursor:pointer">0.82x Lenta</button>' +
        '<button id="bds-v78-stop" type="button" style="background:#475569;color:#fff;border:none;border-radius:9px;padding:8px 10px;font-size:12px;font-weight:800;cursor:pointer">Detener</button></div>' +
        '<div style="font-size:11.5px;color:#334155;line-height:1.4">' +
        'Accesibilidad universal DUA e inclusi\u00f3n de personas con discapacidad (p. ej. Ley N.\u00b0 7600 en Costa Rica). Atajo: <strong>Alt + L</strong>.</div>';

      document.getElementById("bds-v78-close").onclick = function () { panel.style.display = "none"; };
      document.getElementById("bds-v78-play").onclick = function () { rateActual = 0.94; leerEnVozAlta(mot, "es-419", 0.94); };
      document.getElementById("bds-v78-slow").onclick = function () { rateActual = 0.82; leerEnVozAlta(mot, "es-419", 0.82); };
      document.getElementById("bds-v78-stop").onclick = detenerLectura;
    }

    b.onclick = function () {
      var abrir = panel.style.display !== "block";
      panel.style.display = abrir ? "block" : "none";
      if (abrir) {
        renderPanel();
        leerEnVozAlta(obtenerMotivacionVisible(), "es-419", rateActual);
      }
    };
  }

  window.BDSVozCiegosV78 = {
    speak: leerEnVozAlta,
    stop: detenerLectura,
    getMotivation: obtenerMotivacionVisible
  };

  function boot() {
    cargarVoces();
    mejorarAccesibilidadCiegos();
    montarPanelVozCiegos();
    var t = 0;
    var obs = new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = 0; mejorarAccesibilidadCiegos(); }, 250);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();