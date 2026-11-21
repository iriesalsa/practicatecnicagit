(function () {
  "use strict";
  if (window.__BDS_DUA_CTRL_V86__) return;
  window.__BDS_DUA_CTRL_V86__ = true;

  var state = {
    activo: false,
    soloItem: true,
    idioma: "es-CR"
  };

  function detenerVoz() {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (_e) {}
  }

  function hablarTexto(texto, langOverride) {
    var limpio = String(texto || "").replace(/\s+/g, " ").trim();
    if (!limpio) return;
    detenerVoz();
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;

    var langTarget = langOverride || state.idioma || "es-CR";
    var utter = new SpeechSynthesisUtterance(limpio);
    utter.lang = langTarget;
    utter.rate = 1.0;

    try {
      var voices = window.speechSynthesis.getVoices() || [];
      var pref = langTarget.split("-")[0].toLowerCase();
      var elegida = voices.find(function (v) { return String(v.lang || "").toLowerCase() === langTarget.toLowerCase(); })
        || voices.find(function (v) { return String(v.lang || "").toLowerCase().indexOf(pref) === 0; });
      if (elegida) utter.voice = elegida;
    } catch (_e) {}

    window.speechSynthesis.speak(utter);
  }

  function obtenerTextoSeleccionado() {
    try {
      var sel = window.getSelection ? String(window.getSelection().toString() || "").trim() : "";
      if (sel) return sel;
    } catch (_e) {}
    return "";
  }

  function extraerTextoElemento(el) {
    if (!el || el.closest("#bds-v86-dua-bar")) return "";
    var target = el.closest("button, a, label, [role='button'], h1, h2, h3, h4, p, li, td, th, span") || el;
    var txt = String(target.innerText || target.textContent || "").replace(/\s+/g, " ").trim();
    return txt.slice(0, 400);
  }

  function montarBarraDua() {
    if (document.getElementById("bds-v86-dua-bar")) return;

    var bar = document.createElement("div");
    bar.id = "bds-v86-dua-bar";
    bar.style.cssText =
      "position:fixed;right:12px;bottom:64px;z-index:2147483638;" +
      "display:flex;flex-wrap:wrap;align-items:center;gap:6px;" +
      "background:#0f172a;color:#f8fafc;border:2px solid #38bdf8;border-radius:14px;" +
      "padding:6px 10px;font:700 12px system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)";

    bar.innerHTML =
      '<button id="bds-dua-toggle" type="button" style="background:#334155;color:#fff;border:none;border-radius:8px;padding:5px 9px;font-weight:800;cursor:pointer">DUA: OFF</button>' +
      '<button id="bds-dua-item" type="button" style="background:#0284c7;color:#fff;border:none;border-radius:8px;padding:5px 9px;font-weight:800;cursor:pointer">Solo item: ON</button>' +
      '<button id="bds-dua-leer-sel" type="button" style="background:#047857;color:#fff;border:none;border-radius:8px;padding:5px 9px;font-weight:800;cursor:pointer">Leer item/sel</button>' +
      '<button id="bds-dua-stop" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:5px 9px;font-weight:800;cursor:pointer">Detener</button>' +
      '<select id="bds-dua-lang" aria-label="Idioma de lectura DUA" style="background:#1e293b;color:#f8fafc;border:1px solid #64748b;border-radius:8px;padding:5px 7px;font-weight:800;cursor:pointer">' +
      '<option value="es-CR">ES</option>' +
      '<option value="en-US">EN</option>' +
      '<option value="fr-FR">FR</option>' +
      '<option value="pt-BR">PT</option>' +
      '<option value="de-DE">DE</option>' +
      '</select>';

    document.body.appendChild(bar);

    var btnToggle = document.getElementById("bds-dua-toggle");
    var btnItem   = document.getElementById("bds-dua-item");
    var btnLeer   = document.getElementById("bds-dua-leer-sel");
    var btnStop   = document.getElementById("bds-dua-stop");
    var selLang   = document.getElementById("bds-dua-lang");

    function syncUI() {
      btnToggle.textContent = state.activo ? "DUA: ON" : "DUA: OFF";
      btnToggle.style.background = state.activo ? "#16a34a" : "#334155";
      btnItem.textContent = state.soloItem ? "Solo item: ON" : "Solo item: OFF";
      btnItem.style.background = state.soloItem ? "#0284c7" : "#475569";
      selLang.value = state.idioma;
    }

    btnToggle.onclick = function () {
      state.activo = !state.activo;
      if (!state.activo) detenerVoz();
      syncUI();
    };

    btnItem.onclick = function () {
      state.soloItem = !state.soloItem;
      syncUI();
    };

    btnLeer.onclick = function () {
      if (!state.activo) { state.activo = true; syncUI(); }
      var sel = obtenerTextoSeleccionado();
      if (sel) {
        hablarTexto(sel, state.idioma);
      } else {
        hablarTexto("Seleccione un texto o active Solo item y toque un elemento.", state.idioma);
      }
    };

    btnStop.onclick = function () {
      detenerVoz();
    };

    selLang.onchange = function () {
      state.idioma = selLang.value;
      detenerVoz();
      var sel = obtenerTextoSeleccionado();
      if (state.activo && sel) hablarTexto(sel, state.idioma);
    };

    document.addEventListener("click", function (ev) {
      if (!state.activo || !state.soloItem) return;
      if (ev.target && ev.target.closest && ev.target.closest("#bds-v86-dua-bar")) return;
      var txt = extraerTextoElemento(ev.target);
      if (txt) hablarTexto(txt, state.idioma);
    }, true);

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") {
        detenerVoz();
      }
    });

    window.BDSDuaCtrlV86 = {
      setEnabled: function (v) { state.activo = Boolean(v); if (!state.activo) detenerVoz(); syncUI(); return state.activo; },
      setSoloItem: function (v) { state.soloItem = Boolean(v); syncUI(); return state.soloItem; },
      setLang: function (l) { state.idioma = String(l || "es-CR"); syncUI(); return state.idioma; },
      speakItem: function (txt, l) { state.activo = true; syncUI(); hablarTexto(txt, l || state.idioma); return true; },
      stop: function () { detenerVoz(); return true; },
      getState: function () { return { activo: state.activo, soloItem: state.soloItem, idioma: state.idioma }; }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarBarraDua);
  else montarBarraDua();
})();