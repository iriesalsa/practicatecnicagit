(function () {
  "use strict";
  if (window.__BDS_SUITE_V75__) return;
  window.__BDS_SUITE_V75__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Normaliza etiquetas REAC -> REA 2026 en nodos de texto visibles (sin tocar React)
  function normalizarRea2026EnDom() {
    try {
      var walk = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walk.nextNode())) {
        var val = node.nodeValue;
        if (!val || val.indexOf("REAC") === -1) continue;
        var next = val
          .replace(/\bSeguimiento\s+REAC(?:\s+2026)?\b/g, "Seguimiento REA 2026")
          .replace(/\bOrientaci[oó]n\s+REAC(?:\s+2026)?\b/g, "Orientaci\u00f3n REA 2026")
          .replace(/\bNotas\s+REAC(?:\s+2026)?\b/g, "Notas REA 2026")
          .replace(/\bREAC\s+2026\b/g, "REA 2026")
          .replace(/\bREAC\b/g, "REA 2026");
        if (next !== val) node.nodeValue = next;
      }
    } catch (_e) {}
  }

  // Ejecuta cierre de sesion / logout de forma limpia y segura
  function ejecutarCerrarSesion() {
    try {
      var keysToRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k) continue;
        if (/auth|session|user|cuenta|token|sb-|supabase|rbac|rol/i.test(k) && !/theme|lang|pt_lang|prodhab/i.test(k)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(function (k) { try { localStorage.removeItem(k); } catch (_e) {} });
      try { sessionStorage.clear(); } catch (_e) {}

      // Si existe un boton visible de Salir / Logout / Cerrar sesion en la app, dispararlo
      var btns = Array.from(document.querySelectorAll("button, a, [role='button']"));
      var logoutBtn = btns.find(function (el) {
        if (el.closest("#bds-v75-back-modal")) return false;
        var t = (el.textContent || "").trim().toLowerCase();
        return t === "salir" || t === "logout" || t === "cerrar sesi\u00f3n" || t === "cerrar sesion" || /cerrar\s+sesi[oó]n|sign\s*out/i.test(t);
      });
      if (logoutBtn) {
        logoutBtn.click();
      } else {
        window.location.reload();
      }
    } catch (_e) {
      window.location.reload();
    }
  }

  // Modal formal, claro y respetuoso estilo MEP al presionar Atras en el navegador
  function montarModalAtrasLogout() {
    if (document.getElementById("bds-v75-back-modal")) return;

    var modal = document.createElement("div");
    modal.id = "bds-v75-back-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "bds-v75-back-title");
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.76);" +
      "backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:16px;" +
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif";

    modal.innerHTML =
      '<div style="width:100%;max-width:460px;background:#ffffff;color:#0f172a;border-radius:18px;' +
      'border:2px solid #cbd5e1;box-shadow:0 24px 60px rgba(15,23,42,.45);overflow:hidden">' +
      '<div style="background:#0f172a;color:#f8fafc;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1d4ed8">' +
      '<div><div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#93c5fd;text-transform:uppercase">pracTICAtecnica.com \u2022 Aviso de Sesi\u00f3n</div>' +
      '<h2 id="bds-v75-back-title" style="margin:2px 0 0;font-size:17px;font-weight:900;color:#ffffff">Confirmaci\u00f3n de Salida</h2></div>' +
      '<button id="bds-v75-back-x" type="button" aria-label="Cerrar aviso" style="background:rgba(255,255,255,.12);color:#fff;border:none;border-radius:8px;width:30px;height:30px;font-size:16px;font-weight:800;cursor:pointer">&times;</button>' +
      '</div>' +
      '<div style="padding:18px;font-size:14px;line-height:1.55;color:#1e293b">' +
      '<p style="margin:0 0 10px">Has presionado el bot\u00f3n <strong>Atr\u00e1s</strong> del navegador.</p>' +
      '<p style="margin:0 0 12px">Para resguardar tu cuenta institucional y tus registros conforme a la normativa educativa <strong>REA 2026 (MEP)</strong> y la <strong>Ley N.\u00b0 8968 (PRODHAB)</strong>, ind\u00edcanos qu\u00e9 deseas hacer:</p>' +
      '<div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px;font-size:12.5px;color:#334155">' +
      '<div style="margin-bottom:6px">&bull; <strong>Cerrar sesi\u00f3n (Salir / Log out):</strong> finaliza la sesi\u00f3n activa en este dispositivo y protege el acceso a tu cuenta.</div>' +
      '<div>&bull; <strong>Continuar en la sesi\u00f3n:</strong> permanece en la plataforma sin interrumpir tu trabajo actual.</div>' +
      '</div></div>' +
      '<div style="padding:0 18px 18px;display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end">' +
      '<button id="bds-v75-stay" type="button" style="flex:1;min-width:150px;padding:11px 14px;border-radius:10px;border:2px solid #0f172a;background:#ffffff;color:#0f172a;font-size:13px;font-weight:800;cursor:pointer">Continuar sesi\u00f3n</button>' +
      '<button id="bds-v75-logout" type="button" style="flex:1;min-width:165px;padding:11px 14px;border-radius:10px;border:none;background:#b91c1c;color:#ffffff;font-size:13px;font-weight:800;cursor:pointer">Cerrar sesi\u00f3n (Salir)</button>' +
      '</div></div>';

    document.body.appendChild(modal);

    function abrirModal() {
      modal.style.display = "flex";
    }
    function cerrarModal() {
      modal.style.display = "none";
    }

    document.getElementById("bds-v75-back-x").onclick = cerrarModal;
    document.getElementById("bds-v75-stay").onclick = cerrarModal;
    document.getElementById("bds-v75-logout").onclick = function () {
      cerrarModal();
      ejecutarCerrarSesion();
    };
    modal.addEventListener("click", function (ev) {
      if (ev.target === modal) cerrarModal();
    });

    // Ancla de historial para interceptar el boton Atras sin salir bruscamente de la app
    try {
      history.pushState({ bdsGuardV75: true }, "", window.location.href);
    } catch (_e) {}

    window.addEventListener("popstate", function () {
      try {
        history.pushState({ bdsGuardV75: true }, "", window.location.href);
      } catch (_e) {}
      abrirModal();
    });

    window.BDSLogoutModalV75 = { open: abrirModal, close: cerrarModal, logout: ejecutarCerrarSesion };
  }

  // Audio Latino Neutral + DUA + 5 Manuales descargables
  var voces = [];
  var speakTimer = 0;
  function cargarVoces() {
    try {
      if ("speechSynthesis" in window) {
        var v = window.speechSynthesis.getVoices();
        if (v && v.length) voces = v;
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
      var lat = ["es-419", "es-cr", "es-mx", "es-us", "es-co", "es-cl", "es-ar", "es-pe", "es-es"];
      for (var i = 0; i < lat.length; i++) {
        var f = voces.find(function (v) { return v.lang && v.lang.toLowerCase() === lat[i]; });
        if (f) return f;
      }
      return voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf("es") === 0; }) || voces[0];
    }
    var pref = target.split("-")[0];
    return voces.find(function (v) { return v.lang && v.lang.toLowerCase() === target; }) ||
           voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; }) ||
           voces[0];
  }

  function hablar(texto, lang, rate) {
    try {
      if (!("speechSynthesis" in window)) return;
      var limpio = String(texto || "").replace(/\s+/g, " ").trim();
      if (!limpio) return;
      if (speakTimer) clearTimeout(speakTimer);
      window.speechSynthesis.cancel();
      speakTimer = setTimeout(function () {
        speakTimer = 0;
        var u = new SpeechSynthesisUtterance(limpio);
        u.lang = lang || "es-419";
        u.rate = rate || 0.96;
        var v = elegirVoz(u.lang);
        if (v) u.voice = v;
        try { window.speechSynthesis.resume(); } catch (_e) {}
        window.speechSynthesis.speak(u);
      }, 65);
    } catch (_e) {}
  }

  var MANUALES = [
    { id: "dir", file: "Manual-Direccion-Jefatura-REA2026.html", tit: "Manual de Direcci\u00f3n y Jefatura", sub: "REA 2026, RBAC y Trazabilidad", audio: "Manual de Direccion y Jefatura conforme a la normativa REA dos mil veintiseis.", secs: [
      { h: "1. Supervisi\u00f3n REA 2026", p: "Gestione seguimiento acad\u00e9mico, orientaci\u00f3n, secretar\u00eda, grupos y aulas bajo criterios oficiales REA 2026." },
      { h: "2. Seguridad y Cierre de Sesi\u00f3n", p: "Al dar Atr\u00e1s, un modal formal permite confirmar si desea cerrar sesi\u00f3n o continuar trabajando." }
    ]},
    { id: "doc", file: "Manual-Docente-REA2026.html", tit: "Manual de Usuario Docente", sub: "DUA, Evaluaci\u00f3n REA 2026, Idiomas y Simuladores", audio: "Manual Docente con estrategias DUA, audio latino neutral y evaluacion REA dos mil veintiseis.", secs: [
      { h: "1. Mediaci\u00f3n DUA Inclusiva", p: "Combine audio latino neutral (0.82x o 1.0x), modo claro/oscuro y pr\u00e1cticas adaptadas." },
      { h: "2. Evaluaci\u00f3n REA 2026", p: "Aplique pr\u00e1cticas, retroalimentaci\u00f3n formativa y seguimiento continuo." }
    ]},
    { id: "est", file: "Manual-Estudiante-REA2026.html", tit: "Manual de Usuario Estudiantil", sub: "Gu\u00eda clara para estudiar a tu ritmo con DUA", audio: "Manual Estudiantil. Practica con audio, idiomas y juegos a tu propio ritmo.", secs: [
      { h: "1. Tu espacio de aprendizaje", p: "Elige tu idioma, alterna modo claro u oscuro y escucha cualquier texto con voz neutral." },
      { h: "2. Cierre de sesi\u00f3n seguro", p: "Si pulsas Atr\u00e1s, la ventana te preguntar\u00e1 de forma clara si deseas salir de tu cuenta." }
    ]},
    { id: "pag", file: "Manual-Pagos-Suscripciones.html", tit: "Manual de Pagos y Suscripciones", sub: "SINPE M\u00f3vil Costa Rica y comprobantes", audio: "Manual de Pagos y Suscripciones mediante SINPE Movil en Costa Rica.", secs: [
      { h: "1. Proceso SINPE M\u00f3vil", p: "Realice su transferencia por SINPE M\u00f3vil en Costa Rica y guarde su comprobante para activaci\u00f3n." }
    ]},
    { id: "ing", file: "Manual-Ingenieria-BDS-Devs.html", tit: "Manual de Ingenier\u00eda (BDS Devs)", sub: "Requerimientos, Procesos, Stack y Seguridad", audio: "Manual de Ingenieria de BDS Devs para pracTICAtecnica punto com.", secs: [
      { h: "1. Stack y Calidad", p: "React + Vite + pnpm + Tailwind CSS est\u00e1tico + Supabase (RLS) + Vercel con Puerta Chrome y respaldos Od\u00edn SHA-256." },
      { h: "2. Seguridad y Privacidad", p: "Cabeceras CSP/HSTS/COOP, anti-XSS, bloqueo a 5 intentos, rol base Estudiante y cumplimiento Ley N.\u00b0 8968 (PRODHAB)." }
    ]}
  ];

  function buildManualDoc(m) {
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><title>' + esc(m.tit) + '</title>' +
      '<style>body{font-family:system-ui,sans-serif;max-width:780px;margin:24px auto;padding:0 16px;color:#0f172a;line-height:1.6}h1{color:#1e3a8a;border-bottom:2px solid #1e40af;padding-bottom:8px}.box{background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:14px;margin:12px 0}</style></head><body>' +
      '<h1>' + esc(m.tit) + '</h1><p><strong>' + esc(m.sub) + '</strong> \u2022 pracTICAtecnica.com</p>' +
      m.secs.map(function (s) { return '<div class="box"><h3>' + esc(s.h) + '</h3><p>' + esc(s.p) + '</p></div>'; }).join("") +
      '</body></html>';
  }

  function descargarManual(m) {
    var blob = new Blob([buildManualDoc(m)], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = m.file;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
  }

  function montarManualesBtn() {
    if (document.getElementById("bds-v75-man-btn")) return;
    var b = document.createElement("button");
    b.id = "bds-v75-man-btn";
    b.type = "button";
    b.style.cssText = "position:fixed;right:12px;bottom:76px;z-index:2147483630;background:#1e40af;color:#fff;border:2px solid #93c5fd;border-radius:999px;padding:8px 13px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 20px rgba(15,23,42,.4);cursor:pointer";
    b.textContent = "\ud83d\udcda Manuales & DUA";
    document.body.appendChild(b);

    var md = document.createElement("div");
    md.id = "bds-v75-man-modal";
    md.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483645;background:rgba(15,23,42,.8);overflow:auto;padding:14px;font-family:system-ui,sans-serif";
    document.body.appendChild(md);

    var selId = "dir";
    function paint() {
      var cur = MANUALES.find(function (x) { return x.id === selId; }) || MANUALES[0];
      md.innerHTML =
        '<div style="max-width:860px;margin:10px auto;background:#f1f5f9;color:#0f172a;border-radius:18px;border:2px solid #94a3b8;overflow:hidden">' +
        '<div style="background:#fff;padding:12px 16px;border-bottom:2px solid #cbd5e1;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px">' +
        '<strong style="font-size:15px">Manuales Ilustrados &amp; DUA \u2022 REA 2026</strong>' +
        '<button id="bds-v75-man-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:7px 12px;font-weight:800;cursor:pointer">Cerrar</button></div>' +
        '<div style="padding:14px"><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">' +
        MANUALES.map(function (m) {
          return '<button data-ms="' + esc(m.id) + '" type="button" style="padding:7px 11px;border-radius:999px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (m.id === cur.id ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">' + esc(m.tit.replace("Manual de ", "")) + '</button>';
        }).join("") + '</div>' +
        '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:16px">' +
        '<h3 style="margin:0 0 4px;font-size:18px;font-weight:900">' + esc(cur.tit) + '</h3>' +
        '<div style="font-size:12px;color:#475569;margin-bottom:10px">' + esc(cur.sub) + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
        '<button id="bds-v75-m-audio" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:9px;padding:8px 13px;font-size:12px;font-weight:800;cursor:pointer">\ud83d\udd0a Escuchar (Latino Neutral)</button>' +
        '<button id="bds-v75-m-dl" type="button" style="background:#047857;color:#fff;border:none;border-radius:9px;padding:8px 13px;font-size:12px;font-weight:800;cursor:pointer">\u2b07\ufe0f Descargar Manual</button>' +
        '</div>' +
        cur.secs.map(function (s) { return '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px;margin-top:8px"><strong>' + esc(s.h) + '</strong><p style="margin:4px 0 0;font-size:13px">' + esc(s.p) + '</p></div>'; }).join("") +
        '</div></div></div>';

      document.getElementById("bds-v75-man-close").onclick = function () { md.style.display = "none"; };
      md.querySelectorAll("[data-ms]").forEach(function (btnM) { btnM.onclick = function () { selId = btnM.getAttribute("data-ms"); paint(); }; });
      document.getElementById("bds-v75-m-audio").onclick = function () { hablar(cur.audio, "es-419", 0.96); };
      document.getElementById("bds-v75-m-dl").onclick = function () { descargarManual(cur); };
    }

    b.onclick = function () { md.style.display = "block"; paint(); };
  }

  function init() {
    normalizarRea2026EnDom();
    montarModalAtrasLogout();
    montarManualesBtn();
    var t = 0;
    var obs = new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = 0; normalizarRea2026EnDom(); }, 200);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();