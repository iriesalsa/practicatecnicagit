(function () {
  "use strict";
  if (window.__BDS_SUITE_V61_LOADED__) return;
  window.__BDS_SUITE_V61_LOADED__ = true;

  var DOMINIOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
  var ROLES = ["Estudiante", "Padre/Madre", "Auxiliar", "Docente", "Jefatura", "SuperAdmin"];
  var MAX_INTENTOS = 5;
  var K_PERFILES = "pt_v6_perfiles_rbac";
  var K_INGRESOS = "pt_v6_trazabilidad";
  var K_AUDITORIA = "pt_v6_auditoria_roles";
  var K_PRODHAB = "pt_v6_prodhab";
  var K_SESION = "pt_v6_sesion_id";
  var K_SA = "pt_v6_superadmin";
  var K_QR_LOGS = "pt_v6_qr_bitacora";
  var K_AUTH_FAILS = "pt_v6_auth_fails";

  // Sanitizador estricto anti-XSS para cualquier texto dinamico en DOM
  function escHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var BUHO_SVG =
    '<svg viewBox="0 0 128 128" width="28" height="28" aria-label="B\u00faho Azul Circular" style="display:block;flex-shrink:0">' +
    '<defs><radialGradient id="bdsOwlV61" cx="50%" cy="38%" r="60%">' +
    '<stop offset="0%" stop-color="#3b82f6"/><stop offset="65%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e3a8a"/>' +
    '</radialGradient></defs>' +
    '<circle cx="64" cy="64" r="60" fill="url(#bdsOwlV61)" stroke="#93c5fd" stroke-width="4"/>' +
    '<path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="44" cy="63" r="18" fill="#ffffff"/><circle cx="84" cy="63" r="18" fill="#ffffff"/>' +
    '<circle cx="46" cy="63" r="9" fill="#0f172a"/><circle cx="82" cy="63" r="9" fill="#0f172a"/>' +
    '<circle cx="49" cy="59" r="3.2" fill="#ffffff"/><circle cx="85" cy="59" r="3.2" fill="#ffffff"/>' +
    '<polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';

  var CODE39 = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    "A": "wnnnnwnnw", "B": "nnwnnwnnw", "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn",
    "F": "nnwnwwnnn", "G": "nnnnnwwnw", "H": "wnnnnwwnn", "I": "nnwnnwwnn", "J": "nnnnwwwnn",
    "K": "wnnnnnnww", "L": "nnwnnnnww", "M": "wnwnnnnwn", "N": "nnnnwnnww", "O": "wnnnwnnwn",
    "P": "nnwnwnnwn", "Q": "nnnnnnwww", "R": "wnnnnnwwn", "S": "nnwnnnwwn", "T": "nnnnwnwwn",
    "U": "wwnnnnnnw", "V": "nwwnnnnnw", "W": "wwwnnnnnn", "X": "nwnnwnnnw", "Y": "wwnnwnnnn",
    "Z": "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "*": "nwnnwnwnn"
  };

  var ATLAS_MEP = [
    { id: "en", mat: "Ingl\u00e9s", niv: "10.\u00b0-12.\u00b0 MEP", lang: "en-US", cont: "Discourse Markers & Listening", saber: "After that = Subsequently; Also = Furthermore; Even so = Nevertheless.", des: "Infere significados en contexto escrito y auditivo.", audio: "After that means Subsequently. Also means Furthermore. Even so means Nevertheless." },
    { id: "id", mat: "Franc\u00e9s / Alem\u00e1n / Portugu\u00e9s", niv: "Ciclo Diversificado", lang: "es-CR", cont: "Conectores multiling\u00fces", saber: "FR: Ensuite, De plus | DE: Danach, Deshalb=Darum | PT: Em seguida, Portanto=Por conseguinte.", des: "Identifica conectores de secuencia, causa y conclusi\u00f3n en audios.", audio: "En frances ensuite es despues. En aleman deshalb equivale a darum. En portugues em seguida es logo depois y portanto es por conseguinte." },
    { id: "es", mat: "Espa\u00f1ol", niv: "10.\u00b0-12.\u00b0 MEP", lang: "es-CR", cont: "Comprensi\u00f3n inferencial y conectores", saber: "Consecutivos (por lo tanto = por consiguiente) y adversativos (sin embargo = no obstante).", des: "Eval\u00faa coherencia textual e intenci\u00f3n comunicativa.", audio: "Por lo tanto y por consiguiente introducen consecuencia. Sin embargo y no obstante introducen contraste." },
    { id: "ma", mat: "Matem\u00e1ticas", niv: "10.\u00b0-12.\u00b0 MEP", lang: "es-CR", cont: "Funci\u00f3n Lineal y Probabilidad", saber: "C(x) = m\u00b7x + b (b fijo, m tarifa por hora), descuentos y P(A) = fav / total.", des: "Modela problemas de costos, facturaci\u00f3n y probabilidad.", audio: "En la funcion lineal C de x igual a m por x mas b, b es el cargo fijo y m la tasa por unidad." },
    { id: "ti", mat: "Desarrollo Web y Ciberseguridad", niv: "10.\u00b0-12.\u00b0 ETP", lang: "es-CR", cont: "RBAC, RLS, Anti-XSS, CSP, SHA-256 y PRODHAB", saber: "Rol inicial Estudiante, cambio exclusivo por SuperAdmin, CSP + cookies HttpOnly contra XSS y Ley N.\u00b0 8968.", des: "Aplica m\u00ednimo privilegio, sanitizaci\u00f3n DOM e integridad criptogr\u00e1fica.", audio: "Por minimo privilegio toda cuenta nueva inicia como Estudiante y solo SuperAdmin cambia roles. CSP y HttpOnly protegen contra ataques XSS." }
  ];

  var PRACTICAS = [
    { id: "en-01", area: "Ingl\u00e9s", lang: "en-US", q: "Same meaning as 'After that':", ctx: "We hiked five miles the first day. After that, we hiked 10 miles.", ops: ["Therefore", "Consequently", "Subsequently", "Nevertheless"], ok: 2, exp: "'After that' = 'Subsequently'." },
    { id: "en-02", area: "Ingl\u00e9s", lang: "en-US", q: "Same meaning as 'Also':", ctx: "Everyone needs quality health care. Also, everyone deserves good education.", ops: ["Therefore", "However", "Furthermore", "Otherwise"], ok: 2, exp: "'Also' = 'Furthermore'." },
    { id: "fr-01", area: "Franc\u00e9s", lang: "fr-FR", q: "Sens de 'Ensuite':", ctx: "Nous arrivons \u00e0 Lyon ce matin. Ensuite, nous prenons le train.", ops: ["Apr\u00e8s cela", "Cependant", "Jamais", "Autrefois"], ok: 0, exp: "'Ensuite' = 'Apr\u00e8s cela'." },
    { id: "de-01", area: "Alem\u00e1n", lang: "de-DE", q: "Gleiche Bedeutung wie 'Deshalb':", ctx: "Es regnet stark. Deshalb fahren wir heute mit dem Bus.", ops: ["Obwohl", "Selten", "W\u00e4hrend", "Darum"], ok: 3, exp: "'Deshalb' = 'Darum'." },
    { id: "pt-01", area: "Portugu\u00e9s", lang: "pt-BR", q: "Equivalente a 'Em seguida':", ctx: "Estudamos redes pela manh\u00e3. Em seguida, praticamos firewall.", ops: ["Contudo", "Antes de tudo", "Logo depois", "Entretanto"], ok: 2, exp: "'Em seguida' = 'Logo depois'." },
    { id: "es-01", area: "Espa\u00f1ol", lang: "es-CR", q: "Equivalente a 'por lo tanto':", ctx: "Se verificaron los certificados TLS; por lo tanto, el portal qued\u00f3 protegido.", ops: ["Sin embargo", "No obstante", "A pesar de", "Por consiguiente"], ok: 3, exp: "'Por lo tanto' = 'Por consiguiente'." },
    { id: "mat-01", area: "Matem\u00e1ticas", lang: "es-CR", q: "Criterio del costo total C(x):", ctx: "Un taller cobra 15 000 colones fijos m\u00e1s 2 500 por cada hora x.", ops: ["C(x) = 15000x + 2500", "C(x) = 15000 - 2500x", "C(x) = 15000 + 2500x", "C(x) = 17500x"], ok: 2, exp: "Cargo fijo 15000 + 2500x." },
    { id: "ti-01", area: "Desarrollo Web y Ciberseguridad", lang: "es-CR", q: "Rol inicial obligatorio al registrarse (RBAC):", ctx: "Una persona crea su cuenta con correo Gmail o MEP.", ops: ["SuperAdmin autom\u00e1tico", "Estudiante hasta que SuperAdmin cambie su rol", "Cualquier rol libre", "Sin registro"], ok: 1, exp: "M\u00ednimo privilegio: siempre inicia como Estudiante." }
  ];

  var MODULOS_QR = ["Port\u00f3n", "Comedor", "Becas", "Matr\u00edcula", "Salidas"];
  var PERFILES_QR = ["Estudiante", "Docente", "Padre / Madre de familia", "Persona Encargada Legal"];

  function leerJ(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (_e) { return d; } }
  function guardarJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {} }
  function mailOk(c) { var s = String(c || "").trim().toLowerCase(), p = s.split("@"); return p.length === 2 && p[0].length > 0 && DOMINIOS.indexOf(p[1]) !== -1; }
  function tipoCta(c) { var s = String(c || "").toLowerCase(); return (s.endsWith("@mep.go.cr") || s.endsWith("@est.mep.go.cr")) ? "mep" : "gmail"; }

  async function sha256(txt) {
    try {
      var buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(txt || "")));
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    } catch (_e) { return "sha256-" + Date.now().toString(16); }
  }

  function hablar(texto, lang) {
    try {
      if (!("speechSynthesis" in window)) return;
      var limpio = String(texto || "").replace(/\s+/g, " ").trim();
      if (!limpio) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(limpio);
      u.lang = lang || "es-CR";
      var voces = window.speechSynthesis.getVoices() || [];
      var pref = u.lang.toLowerCase().split("-")[0];
      var voz = voces.find(function (v) { return v.lang && v.lang.toLowerCase() === u.lang.toLowerCase(); }) ||
                voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; });
      if (voz) u.voice = voz;
      try { window.speechSynthesis.resume(); } catch (_e) {}
      window.speechSynthesis.speak(u);
    } catch (_e) {}
  }

  function barcodeSvg(txt) {
    var limpio = String(txt || "PT-EST-001").toUpperCase().replace(/[^0-9A-Z\-. ]/g, "") || "PT-EST-001";
    var seq = "*" + limpio + "*", x = 14, rects = [];
    for (var i = 0; i < seq.length; i++) {
      var pat = CODE39[seq[i]] || CODE39["-"];
      for (var j = 0; j < pat.length; j++) {
        var w = pat[j] === "w" ? 5 : 2;
        if (j % 2 === 0) rects.push('<rect x="' + x + '" y="10" width="' + w + '" height="64" fill="#0f172a"/>');
        x += w;
      }
      x += 2;
    }
    var tw = x + 14;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + tw + ' 96" style="width:100%;max-width:400px;height:auto;background:#fff;border:1.5px solid #94a3b8;border-radius:10px;display:block;margin:0 auto"><rect width="' + tw + '" height="96" fill="#fff"/>' + rects.join("") + '<text x="' + (tw / 2) + '" y="89" text-anchor="middle" fill="#0f172a" font-family="monospace" font-size="13" font-weight="800">' + escHtml(limpio) + '</text></svg>';
  }

  function opcionesNivel(it, niv) {
    var l4 = ["A", "B", "C", "D"];
    if (niv === "macro") return { ops: it.ops.map(function (t, i) { return { l: l4[i], t: t }; }), ok: l4[it.ok] };
    var okT = it.ops[it.ok], dist = it.ops.filter(function (_t, i) { return i !== it.ok; }).slice(0, 2);
    var pos = it.id.charCodeAt(it.id.length - 1) % 3, arr = [], d = 0;
    for (var i = 0; i < 3; i++) arr.push(i === pos ? okT : dist[d++]);
    var l3 = ["A", "B", "C"];
    return { ops: arr.map(function (t, j) { return { l: l3[j], t: t }; }), ok: l3[pos] };
  }

  function syncRest(tabla, payload) {
    try {
      var url = window.__BDS_SUPABASE_URL__ || localStorage.getItem("VITE_SUPABASE_URL") || "";
      var key = window.__BDS_SUPABASE_ANON__ || localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "";
      if (!url || !key || url.indexOf("tu-proyecto.supabase.co") !== -1) return;
      fetch(url.replace(/\/$/, "") + "/rest/v1/" + tabla, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": key, "Authorization": "Bearer " + key, "Prefer": "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (_e) {}
  }

  function syncContrasteClaro() {
    try {
      var html = document.documentElement, body = document.body;
      if (!body) return;
      var cls = (html.className + " " + body.className).toLowerCase();
      var dt = (html.getAttribute("data-theme") || body.getAttribute("data-theme") || "").toLowerCase();
      var m = String(window.getComputedStyle(body).backgroundColor || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      var lum = m ? (0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3])) / 255 : 0;
      var claro = dt === "light" || cls.indexOf("light") !== -1 || cls.indexOf("claro") !== -1 || (cls.indexOf("dark") === -1 && lum > 0.65);
      if (claro) html.classList.add("bds-light-aaa"); else html.classList.remove("bds-light-aaa");
    } catch (_e) {}
  }

  // Bloqueo de selectores publicos de rol (todo nuevo usuario inicia como Estudiante)
  function bloquearSelectoresRolPublicos() {
    try {
      document.querySelectorAll("select").forEach(function (sel) {
        if (sel.closest("#bds-v6-modal")) return;
        var txt = (sel.textContent || "").toLowerCase();
        if (txt.indexOf("superadmin") !== -1 || (txt.indexOf("jefatura") !== -1 && txt.indexOf("docente") !== -1 && txt.indexOf("estudiante") !== -1)) {
          for (var i = 0; i < sel.options.length; i++) {
            if ((sel.options[i].value || sel.options[i].text).toLowerCase().indexOf("estudiante") !== -1) {
              sel.selectedIndex = i; break;
            }
          }
          sel.disabled = true;
          sel.title = "Rol inicial obligatorio: Estudiante. Solo SuperAdmin puede cambiar roles.";
        }
      });
    } catch (_e) {}
  }

  // Blindaje antifraude (5 intentos fallidos + solo @gmail.com / @mep.go.cr / @est.mep.go.cr)
  document.addEventListener("submit", function (ev) {
    try {
      var form = ev.target;
      if (!form || !form.querySelector || form.closest("#bds-v6-modal")) return;
      var pass = form.querySelector("input[type='password']");
      var mail = form.querySelector("input[type='email'], input[name*='mail' i], input[placeholder*='correo' i], input[placeholder*='mep' i]");
      if (!pass || !mail) return;

      var fails = Number(localStorage.getItem(K_AUTH_FAILS) || "0");
      if (fails >= MAX_INTENTOS) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        mail.setCustomValidity("Acceso bloqueado tras 5 intentos fallidos. Contacta al administrador de soporte.");
        mail.reportValidity();
        return;
      }

      if (!mailOk(mail.value)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var next = fails + 1;
        localStorage.setItem(K_AUTH_FAILS, String(next));
        mail.setCustomValidity("Solo se permiten correos @gmail.com, @mep.go.cr o @est.mep.go.cr (" + next + "/" + MAX_INTENTOS + ").");
        mail.reportValidity();
        setTimeout(function () { mail.setCustomValidity(""); }, 3200);
      } else {
        localStorage.setItem(K_AUTH_FAILS, "0");
      }
    } catch (_e) {}
  }, true);

  function activarMoptTactil(canvas) {
    try {
      if (!canvas || canvas.dataset.bdsMoptV6 === "1") return;
      canvas.dataset.bdsMoptV6 = "1";
      canvas.style.touchAction = "none";
      canvas.style.cursor = "grab";
      var drag = false, lx = 0, ly = 0, kd = null;
      function upK() { if (kd) { window.dispatchEvent(new KeyboardEvent("keyup", { key: kd, bubbles: true })); kd = null; } }
      function dnK(k) { if (kd === k) return; upK(); kd = k; window.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })); }
      canvas.addEventListener("pointerdown", function (e) { try { canvas.setPointerCapture(e.pointerId); } catch (_e) {} drag = true; lx = e.clientX; ly = e.clientY; });
      canvas.addEventListener("pointermove", function (e) {
        if (!drag) return;
        var dx = e.clientX - lx, dy = e.clientY - ly;
        if (Math.abs(dx) > 10) { dnK(dx > 0 ? "ArrowRight" : "ArrowLeft"); lx = e.clientX; }
        else if (Math.abs(dy) > 16) { dnK(dy < 0 ? "ArrowUp" : "ArrowDown"); ly = e.clientY; }
      });
      canvas.addEventListener("pointerup", function () { drag = false; upK(); });
      canvas.addEventListener("pointercancel", function () { drag = false; upK(); });
    } catch (_e) {}
  }

  async function latidoTrazabilidad(vista) {
    try {
      var sid = sessionStorage.getItem(K_SESION);
      if (!sid) { sid = "SES-" + Date.now().toString(36).toUpperCase(); sessionStorage.setItem(K_SESION, sid); }
      var correo = null;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf("pt_v6_") === 0) continue;
        var m = (localStorage.getItem(k) || "").match(/[a-zA-Z0-9._%+-]+@(gmail\.com|mep\.go\.cr|est\.mep\.go\.cr)/i);
        if (m) { correo = m[0].toLowerCase(); break; }
      }
      var tipo = correo ? "con_cuenta" : "sin_cuenta";
      var perfiles = leerJ(K_PERFILES, []);
      var perf = correo ? perfiles.find(function (p) { return p.correo === correo; }) : null;
      if (correo && !perf) {
        perf = { correo: correo, tipo: tipoCta(correo), rol: "Estudiante", creado: new Date().toISOString() };
        perfiles.unshift(perf); guardarJ(K_PERFILES, perfiles);
      }
      var rol = perf ? perf.rol : "Estudiante";
      var ahora = new Date().toISOString();
      var sha = await sha256(sid + "|" + (correo || "sin_cuenta") + "|" + rol);
      var list = leerJ(K_INGRESOS, []);
      var idx = list.findIndex(function (x) { return x.sid === sid; });
      var reg = { sid: sid, correo: correo || "Sin cuenta (Prueba)", tipo: tipo, rol: rol, vista: vista || "Inicio", disp: (window.innerWidth <= 640 ? "Celular" : "Computadora"), activo: true, latido: ahora, sha: sha };
      if (idx >= 0) list[idx] = reg; else list.unshift(reg);
      guardarJ(K_INGRESOS, list.slice(0, 200));
      syncRest("trazabilidad_ingresos", { sesion_id: sid, correo: correo, tipo_ingreso: tipo, rol_en_sesion: rol, vista_actual: reg.vista, dispositivo: reg.disp, activo: true, ultimo_latido: ahora, sha256_evento: sha });
    } catch (_e) {}
  }

  function montarInterfazFlotante() {
    if (document.getElementById("bds-v6-btn-centro")) return;

    var bCentro = document.createElement("button");
    bCentro.id = "bds-v6-btn-centro";
    bCentro.type = "button";
    bCentro.style.cssText = "position:fixed;right:12px;bottom:76px;z-index:2147483630;display:flex;align-items:center;gap:6px;background:#1e40af;color:#fff;border:2px solid #93c5fd;border-radius:999px;padding:7px 12px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 20px rgba(15,23,42,.38);cursor:pointer";
    bCentro.innerHTML = BUHO_SVG + "<span>Centro BDS</span>";
    document.body.appendChild(bCentro);

    var bQr = document.createElement("button");
    bQr.id = "bds-v6-btn-qr";
    bQr.type = "button";
    bQr.style.cssText = "position:fixed;left:12px;bottom:76px;z-index:2147483630;display:flex;align-items:center;gap:6px;background:#047857;color:#fff;border:2px solid #6ee7b7;border-radius:999px;padding:7px 12px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 20px rgba(15,23,42,.38);cursor:pointer";
    bQr.innerHTML = BUHO_SVG + "<span>QR / Barras</span>";
    document.body.appendChild(bQr);

    var modal = document.createElement("div");
    modal.id = "bds-v6-modal";
    modal.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483645;background:rgba(15,23,42,.82);overflow:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var ui = { modo: "centro", tab: "atlas", nivel: "macro", pIdx: 0, pSel: null, qMod: "Port\u00f3n", qTab: "cam", camOn: false, err: "", lastQr: null, carne: null, aviso: "" };
    var streamRef = null, rafRef = 0, html5Ref = null, lastTs = 0, lastVal = "";

    async function stopCam() {
      if (rafRef) { cancelAnimationFrame(rafRef); rafRef = 0; }
      if (streamRef) { streamRef.getTracks().forEach(function (t) { try { t.stop(); } catch (_e) {} }); streamRef = null; }
      if (html5Ref) { try { await html5Ref.stop(); await html5Ref.clear(); } catch (_e) {} html5Ref = null; }
      ui.camOn = false;
    }

    async function validarQr(raw, fmt) {
      var limpio = String(raw || "").trim();
      if (!limpio) return;
      if (limpio === lastVal && Date.now() - lastTs < 2000) return;
      lastVal = limpio; lastTs = Date.now();
      var p = limpio.split("|");
      var rol = p.length >= 4 ? p[0] : (/^DOC-/i.test(limpio) ? "Docente" : /^ENC-|^PAD-/i.test(limpio) ? "Persona Encargada Legal" : "Estudiante");
      var idVal = p.length >= 4 ? p[1] : limpio;
      var nom = p.length >= 4 ? p[2] : ("ID " + limpio);
      var sha = (p.length >= 5 && /^[a-f0-9]{64}$/i.test(p[4])) ? p[4] : await sha256(rol + "|" + idVal + "|" + nom + "|" + ui.qMod);
      var logs = leerJ(K_QR_LOGS, []);
      var hoy = new Date().toISOString().slice(0, 10);
      var clave = hoy + "|" + ui.qMod + "|" + idVal;
      var dup = (ui.qMod === "Comedor" || ui.qMod === "Becas") && logs.some(function (x) { return x.clave === clave && x.estado === "AUTORIZADO"; });
      var reg = { clave: clave, hora: new Date().toLocaleString("es-CR"), mod: ui.qMod, rol: rol, id: idVal, nom: nom, fmt: fmt || "QR/BARCODE", sha: sha, estado: dup ? "DUPLICADO_HOY" : "AUTORIZADO" };
      logs.unshift(reg); guardarJ(K_QR_LOGS, logs.slice(0, 200));
      syncRest("validaciones_qr_institucional", { modulo: reg.mod, tipo_persona: reg.rol, identificacion: reg.id, nombre_persona: reg.nom, formato_codigo: reg.fmt, codigo_crudo: limpio, estado_validacion: reg.estado, sha256_sello: reg.sha });
      ui.lastQr = reg;
      if (navigator.vibrate) navigator.vibrate(dup ? [80, 50, 80] : 80);
      render();
    }

    async function startCam() {
      ui.err = ""; await stopCam();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { ui.err = "Requiere HTTPS para c\u00e1mara. Usa foto o lector USB."; render(); return; }
      if ("BarcodeDetector" in window) {
        try {
          var det = new window.BarcodeDetector({ formats: ["qr_code", "code_128", "code_39", "ean_13", "ean_8", "pdf417"] });
          streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
          ui.camOn = true; render();
          var v = document.getElementById("bds-v6-vid");
          if (v) {
            v.srcObject = streamRef; await v.play();
            var loop = async function () {
              if (!streamRef || !v) return;
              try {
                if (v.readyState >= 2) {
                  var found = await det.detect(v);
                  if (found && found.length > 0 && found[0].rawValue) await validarQr(found[0].rawValue, String(found[0].format || "QR").toUpperCase());
                }
              } catch (_e) {}
              rafRef = requestAnimationFrame(loop);
            };
            rafRef = requestAnimationFrame(loop);
          }
          return;
        } catch (_e1) { await stopCam(); }
      }
      function runH5() {
        if (!window.Html5Qrcode) { ui.err = "Usa foto o lector USB abajo."; render(); return; }
        ui.camOn = true; render();
        var q = new window.Html5Qrcode("bds-v6-h5");
        html5Ref = q;
        q.start({ facingMode: "environment" }, { fps: 10, qrbox: 220 }, function (t) { validarQr(t, "QR/BARCODE"); }, function () {}).catch(function (e) { ui.err = "Permiso de c\u00e1mara requerido (" + escHtml(e) + ")."; stopCam(); render(); });
      }
      if (window.Html5Qrcode) { runH5(); return; }
      var sc = document.createElement("script"); sc.src = "/vendor/html5-qrcode.min.js"; sc.onload = runH5; sc.onerror = runH5; document.head.appendChild(sc);
    }

    function render() {
      var body = "";
      if (ui.modo === "qr") {
        var logs = leerJ(K_QR_LOGS, []);
        if (ui.qTab === "cam") {
          body =
            '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px;margin-bottom:12px"><div style="font-size:12px;font-weight:800;margin-bottom:8px">Punto de control:</div><div style="display:flex;flex-wrap:wrap;gap:6px">' +
            MODULOS_QR.map(function (m) { return '<button data-qm="' + escHtml(m) + '" type="button" style="padding:7px 12px;border-radius:999px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #047857;background:' + (ui.qMod === m ? '#047857;color:#fff' : '#fff;color:#047857') + '">' + escHtml(m) + '</button>'; }).join("") + '</div></div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px">' +
            '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px">' +
            (!ui.camOn ? '<button id="bds-v6-cam-go" type="button" style="width:100%;background:#1e40af;color:#fff;border:none;border-radius:10px;padding:11px;font-weight:800;cursor:pointer">Activar C\u00e1mara Nativa QR / Barras</button>' : '<button id="bds-v6-cam-stop" type="button" style="width:100%;background:#b91c1c;color:#fff;border:none;border-radius:10px;padding:10px;font-weight:800;cursor:pointer">Detener C\u00e1mara</button>') +
            (ui.err ? '<div style="margin-top:8px;padding:8px;border-radius:8px;background:#fef3c7;color:#451a03;font-size:12px;font-weight:700">' + escHtml(ui.err) + '</div>' : '') +
            '<div style="margin-top:10px;background:#0f172a;border-radius:10px;overflow:hidden;min-height:190px;display:flex;align-items:center;justify-content:center">' +
            '<video id="bds-v6-vid" playsinline muted style="' + (ui.camOn && !html5Ref ? 'width:100%;max-height:280px;object-fit:cover;display:block' : 'display:none') + '"></video>' +
            '<div id="bds-v6-h5" style="width:100%"></div>' +
            (!ui.camOn ? '<div style="padding:16px;color:#cbd5e1;font-size:12px;text-align:center">Apunta al QR o c\u00f3digo de barras del carn\u00e9 de estudiante, docente o encargado legal.</div>' : '') +
            '</div></div>' +
            '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px">' +
            '<form id="bds-v6-usb" style="display:flex;gap:6px;flex-wrap:wrap"><input id="bds-v6-usb-in" placeholder="Lector USB o pegar QR/SHA-256..." style="flex:1;min-width:170px;padding:9px;border:2px solid #475569;border-radius:8px;font-size:13px"/><button type="submit" style="background:#0f172a;color:#fff;border:none;border-radius:8px;padding:9px 12px;font-weight:800;cursor:pointer">Validar</button></form>' +
            (ui.lastQr ? '<div style="padding:12px;border-radius:10px;font-size:12px;background:' + (ui.lastQr.estado === "AUTORIZADO" ? '#dcfce7;border:2px solid #15803d;color:#14532d' : '#fef3c7;border:2px solid #b45309;color:#451a03') + '"><strong style="font-size:14px">' + escHtml(ui.lastQr.estado) + ' (' + escHtml(ui.lastQr.mod) + ')</strong><br/>' + escHtml(ui.lastQr.nom) + ' &bull; ' + escHtml(ui.lastQr.rol) + ' &bull; ID: ' + escHtml(ui.lastQr.id) + '<br/><span style="font-family:monospace;word-break:break-all">SHA-256: ' + escHtml(ui.lastQr.sha) + '</span></div>' : '<div style="font-size:12px;color:#475569">Resultado de validaci\u00f3n en tiempo real aqu\u00ed.</div>') +
            '</div></div>';
        } else if (ui.qTab === "carnet") {
          body =
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px">' +
            '<form id="bds-v6-gen" style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px">' +
            '<strong style="font-size:15px">Generar Carn\u00e9 Code-39 + SHA-256</strong>' +
            '<select id="bds-v6-gp" style="padding:8px;border:2px solid #475569;border-radius:8px">' + PERFILES_QR.map(function (p) { return '<option>' + escHtml(p) + '</option>'; }).join("") + '</select>' +
            '<input id="bds-v6-gi" required placeholder="C\u00e9dula o TIM (Ej. EST-1101)" style="padding:8px;border:2px solid #475569;border-radius:8px"/>' +
            '<input id="bds-v6-gn" required placeholder="Nombre completo" style="padding:8px;border:2px solid #475569;border-radius:8px"/>' +
            '<select id="bds-v6-gm" style="padding:8px;border:2px solid #475569;border-radius:8px">' + MODULOS_QR.map(function (m) { return '<option>' + escHtml(m) + '</option>'; }).join("") + '</select>' +
            '<button type="submit" style="background:#1e40af;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:800;cursor:pointer">Emitir Carn\u00e9</button></form>' +
            '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px">' +
            (ui.carne ? '<div style="font-weight:900;margin-bottom:8px">' + escHtml(ui.carne.nom) + ' (' + escHtml(ui.carne.rol) + ')</div>' + barcodeSvg(ui.carne.bar) + '<div style="margin-top:8px;font-family:monospace;font-size:11px;word-break:break-all">' + escHtml(ui.carne.payload) + '</div><button id="bds-v6-test-c" type="button" style="margin-top:10px;width:100%;background:#047857;color:#fff;border:none;border-radius:8px;padding:9px;font-weight:800;cursor:pointer">Probar validaci\u00f3n</button>' : '<span style="font-size:12px;color:#475569">Genera un carn\u00e9 para escanearlo con tu c\u00e1mara.</span>') +
            '</div></div>';
        } else {
          body = '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px;overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left"><th style="padding:6px">Hora</th><th style="padding:6px">Punto</th><th style="padding:6px">Estado</th><th style="padding:6px">Perfil</th><th style="padding:6px">Persona</th></tr></thead><tbody>' +
            (logs.length ? logs.map(function (l) { return '<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:6px">' + escHtml(l.hora) + '</td><td style="padding:6px">' + escHtml(l.mod) + '</td><td style="padding:6px;font-weight:800">' + escHtml(l.estado) + '</td><td style="padding:6px">' + escHtml(l.rol) + '</td><td style="padding:6px">' + escHtml(l.nom) + '</td></tr>'; }).join("") : '<tr><td colspan="5" style="padding:10px">Sin registros a\u00fan.</td></tr>') + '</tbody></table></div>';
        }
      } else if (ui.tab === "atlas") {
        body = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px">' +
          ATLAS_MEP.map(function (a) {
            return '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px"><div style="font-size:11px;font-weight:900;color:#1e40af">' + escHtml(a.mat) + ' &bull; ' + escHtml(a.niv) + '</div><div style="font-weight:900;font-size:15px;margin:4px 0">' + escHtml(a.cont) + '</div><div style="font-size:12px;margin-bottom:6px"><strong>Saber esencial:</strong> ' + escHtml(a.saber) + '</div><div style="font-size:12px;margin-bottom:10px"><strong>Desempe\u00f1o:</strong> ' + escHtml(a.des) + '</div><button data-aplay="' + escHtml(a.id) + '" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:800;cursor:pointer">&#9654; Escuchar repaso</button></div>';
          }).join("") + '</div>';
      } else if (ui.tab === "practicas") {
        var it = PRACTICAS[ui.pIdx] || PRACTICAS[0], pr = opcionesNivel(it, ui.nivel);
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px;margin-bottom:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px"><strong style="font-size:13px">' + (ui.nivel === "macro" ? "Macroevaluaci\u00f3n (A-B-C-D)" : "Microevaluaci\u00f3n (A-B-C)") + '</strong><div style="display:flex;gap:6px"><button data-pn="macro" type="button" style="padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.nivel === "macro" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Macro (A-D)</button><button data-pn="micro" type="button" style="padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #4338ca;background:' + (ui.nivel === "micro" ? '#4338ca;color:#fff' : '#fff;color:#4338ca') + '">Micro (A-C)</button></div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:16px"><div style="font-size:12px;font-weight:800;color:#1e40af">' + escHtml(it.area) + ' (' + (ui.pIdx + 1) + '/' + PRACTICAS.length + ')</div><h3 style="margin:6px 0">' + escHtml(it.q) + '</h3><p style="background:#f1f5f9;padding:10px;border-radius:10px;font-size:14px">' + escHtml(it.ctx) + '</p><button id="bds-v6-pplay" type="button" style="margin-bottom:12px;background:#c2410c;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">&#9654; Escuchar pregunta</button>' +
          pr.ops.map(function (o) { return '<button data-pop="' + escHtml(o.l) + '" type="button" style="width:100%;text-align:left;padding:10px;margin-bottom:6px;border-radius:10px;cursor:pointer;font-weight:700;border:2px solid ' + (ui.pSel === o.l ? '#1e40af;background:#dbeafe' : '#94a3b8;background:#fff') + '"><strong>' + escHtml(o.l) + '.</strong> ' + escHtml(o.t) + '</button>'; }).join("") +
          (ui.pSel ? '<div style="margin-top:8px;padding:10px;border-radius:8px;background:#dcfce7;color:#14532d;font-size:13px;font-weight:700">' + (ui.pSel === pr.ok ? "Correcto. " : "Sugerida: " + escHtml(pr.ok) + ". ") + escHtml(it.exp) + '</div>' : '') +
          '<div style="display:flex;justify-content:space-between;margin-top:12px"><button id="bds-v6-pprev" type="button" style="padding:8px 14px;border-radius:8px;border:2px solid #475569;background:#fff;font-weight:800;cursor:pointer">Anterior</button><button id="bds-v6-pnext" type="button" style="padding:8px 14px;border-radius:8px;border:none;background:#1e40af;color:#fff;font-weight:800;cursor:pointer">Siguiente</button></div></div>';
      } else if (ui.tab === "traza") {
        var ing = leerJ(K_INGRESOS, []), perfs = leerJ(K_PERFILES, []), sa = localStorage.getItem(K_SA) === "1";
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px;margin-bottom:12px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px"><strong>RBAC: Todos inician como Estudiante (Cambio exclusivo SuperAdmin)</strong><button id="bds-v6-sa" type="button" style="padding:7px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:' + (sa ? '#15803d' : '#1e40af') + ';color:#fff">' + (sa ? 'SuperAdmin ACTIVO' : 'Activar SuperAdmin') + '</button></div>' +
          (ui.aviso ? '<div style="margin-bottom:8px;padding:8px;border-radius:8px;background:#dbeafe;color:#1e3a8a;font-size:12px;font-weight:700">' + escHtml(ui.aviso) + '</div>' : '') +
          '<form id="bds-v6-add" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><input id="bds-v6-mail" type="email" required placeholder="usuario@est.mep.go.cr o usuario@gmail.com" style="flex:1;min-width:200px;padding:8px;border:2px solid #475569;border-radius:8px"/><button type="submit" style="background:#0f172a;color:#fff;border:none;border-radius:8px;padding:8px 12px;font-weight:800;cursor:pointer">+ Registrar Estudiante</button></form>' +
          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left"><th style="padding:6px">Correo</th><th style="padding:6px">Rol</th><th style="padding:6px">Cambiar (SuperAdmin)</th></tr></thead><tbody>' +
          (perfs.length ? perfs.map(function (p) { return '<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:6px;font-weight:700">' + escHtml(p.correo) + '</td><td style="padding:6px">' + escHtml(p.rol) + '</td><td style="padding:6px"><select data-rm="' + escHtml(p.correo) + '" ' + (sa ? '' : 'disabled ') + 'style="padding:5px;border:1.5px solid #475569;border-radius:6px">' + ROLES.map(function (rn) { return '<option' + (p.rol === rn ? ' selected' : '') + '>' + escHtml(rn) + '</option>'; }).join("") + '</select></td></tr>'; }).join("") : '<tr><td colspan="3" style="padding:8px">Sin cuentas registradas a\u00fan.</td></tr>') + '</tbody></table></div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px;overflow-x:auto"><strong style="font-size:14px">Ingresos: Total ' + ing.length + ' | Con cuenta: ' + ing.filter(function (x) { return x.tipo === "con_cuenta"; }).length + ' | Sin cuenta: ' + ing.filter(function (x) { return x.tipo === "sin_cuenta"; }).length + ' | Activos: ' + ing.filter(function (x) { return x.activo; }).length + '</strong></div>';
      } else {
        var ph = leerJ(K_PRODHAB, null);
        body = '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:16px;font-size:13px"><h3 style="margin:0 0 8px">Cumplimiento PRODHAB (Ley N.\u00b0 8968 CR) &amp; Ciberseguridad BDS</h3><p>Datos usados solo con fines educativos en pracTICAtecnica.com. Derechos ARCO garantizados. Defensa activa: CSP, HSTS, COOP, Anti-XSS DOM, bloqueo a 5 intentos, RBAC (rol base Estudiante), RLS en Supabase y sellos SHA-256.</p>' + (ph ? '<div style="padding:10px;border-radius:8px;background:#dcfce7;color:#14532d;font-weight:700">Consentimiento registrado (' + escHtml(ph.fecha) + ') &bull; SHA-256: ' + escHtml(ph.sha.slice(0, 20)) + '...</div>' : '<button id="bds-v6-ph" type="button" style="background:#15803d;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:800;cursor:pointer">Aceptar Consentimiento PRODHAB (SHA-256)</button>') + '</div>';
      }

      var headerBtns = ui.modo === "qr"
        ? '<button data-qt="cam" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #047857;background:' + (ui.qTab === "cam" ? '#047857;color:#fff' : '#fff;color:#047857') + '">C\u00e1mara</button>' +
          '<button data-qt="carnet" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.qTab === "carnet" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Carn\u00e9 Prueba</button>' +
          '<button data-qt="log" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #0f172a;background:' + (ui.qTab === "log" ? '#0f172a;color:#fff' : '#fff;color:#0f172a') + '">Bit\u00e1cora</button>'
        : '<button data-ct="atlas" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "atlas" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Atlas MEP</button>' +
          '<button data-ct="practicas" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "practicas" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Pr\u00e1cticas</button>' +
          '<button data-ct="traza" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #0f172a;background:' + (ui.tab === "traza" ? '#0f172a;color:#fff' : '#fff;color:#0f172a') + '">Trazabilidad &amp; RBAC</button>' +
          '<button data-ct="legal" type="button" style="padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #15803d;background:' + (ui.tab === "legal" ? '#15803d;color:#fff' : '#fff;color:#15803d') + '">PRODHAB &amp; Ciber</button>';

      modal.innerHTML =
        '<div style="max-width:1040px;margin:8px auto;background:#f1f5f9;color:#0f172a;border-radius:18px;border:2px solid #94a3b8;overflow:hidden">' +
        '<div style="background:#fff;border-bottom:2px solid #cbd5e1;padding:10px 14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px">' +
        '<div style="display:flex;align-items:center;gap:8px">' + BUHO_SVG + '<strong style="font-size:14px">pracTICAtecnica.com &bull; Blindaje BDS v6.1</strong></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' + headerBtns + '<button id="bds-v6-close" type="button" style="padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Cerrar</button></div></div>' +
        '<div style="padding:14px">' + body + '</div></div>';

      document.getElementById("bds-v6-close").onclick = async function () { await stopCam(); modal.style.display = "none"; };
      modal.querySelectorAll("[data-ct]").forEach(function (b) { b.onclick = function () { ui.tab = b.getAttribute("data-ct"); render(); }; });
      modal.querySelectorAll("[data-qt]").forEach(function (b) { b.onclick = async function () { await stopCam(); ui.qTab = b.getAttribute("data-qt"); render(); }; });

      if (ui.modo === "qr") {
        modal.querySelectorAll("[data-qm]").forEach(function (b) { b.onclick = function () { ui.qMod = b.getAttribute("data-qm"); render(); }; });
        var cg = document.getElementById("bds-v6-cam-go"); if (cg) cg.onclick = startCam;
        var cs = document.getElementById("bds-v6-cam-stop"); if (cs) cs.onclick = async function () { await stopCam(); render(); };
        var uf = document.getElementById("bds-v6-usb");
        if (uf) uf.onsubmit = async function (e) { e.preventDefault(); var i = document.getElementById("bds-v6-usb-in"); await validarQr(i.value, "USB"); i.value = ""; };
        var gf = document.getElementById("bds-v6-gen");
        if (gf) gf.onsubmit = async function (e) {
          e.preventDefault();
          var r = document.getElementById("bds-v6-gp").value, idv = document.getElementById("bds-v6-gi").value.trim().toUpperCase(), n = document.getElementById("bds-v6-gn").value.trim(), m = document.getElementById("bds-v6-gm").value;
          var s = await sha256(r + "|" + idv + "|" + n + "|" + m);
          var bar = (idv).replace(/[^0-9A-Z\-]/g, "").slice(0, 16) || "PT-001";
          ui.carne = { rol: r, id: idv, nom: n, mod: m, bar: bar, payload: r + "|" + idv + "|" + n + "|" + m + "|" + s };
          render();
        };
        var tc = document.getElementById("bds-v6-test-c");
        if (tc && ui.carne) tc.onclick = async function () { ui.qMod = ui.carne.mod; ui.qTab = "cam"; render(); await validarQr(ui.carne.payload, "CARNE_SHA256"); };
      } else if (ui.tab === "atlas") {
        modal.querySelectorAll("[data-aplay]").forEach(function (b) { b.onclick = function () { var a = ATLAS_MEP.find(function (x) { return x.id === b.getAttribute("data-aplay"); }); if (a) hablar(a.audio, a.lang); }; });
      } else if (ui.tab === "practicas") {
        modal.querySelectorAll("[data-pn]").forEach(function (b) { b.onclick = function () { ui.nivel = b.getAttribute("data-pn"); ui.pSel = null; render(); }; });
        modal.querySelectorAll("[data-pop]").forEach(function (b) { b.onclick = function () { ui.pSel = b.getAttribute("data-pop"); render(); }; });
        var cIt = PRACTICAS[ui.pIdx] || PRACTICAS[0];
        document.getElementById("bds-v6-pplay").onclick = function () { hablar(cIt.q + ". " + cIt.ctx, cIt.lang); };
        document.getElementById("bds-v6-pprev").onclick = function () { ui.pIdx = Math.max(0, ui.pIdx - 1); ui.pSel = null; render(); };
        document.getElementById("bds-v6-pnext").onclick = function () { ui.pIdx = Math.min(PRACTICAS.length - 1, ui.pIdx + 1); ui.pSel = null; render(); };
      } else if (ui.tab === "traza") {
        document.getElementById("bds-v6-sa").onclick = function () { localStorage.setItem(K_SA, localStorage.getItem(K_SA) === "1" ? "0" : "1"); render(); };
        document.getElementById("bds-v6-add").onsubmit = function (e) {
          e.preventDefault();
          var mv = document.getElementById("bds-v6-mail").value.trim().toLowerCase();
          if (!mailOk(mv)) { ui.aviso = "Solo @gmail.com, @mep.go.cr o @est.mep.go.cr."; render(); return; }
          var lp = leerJ(K_PERFILES, []);
          if (!lp.some(function (x) { return x.correo === mv; })) { lp.unshift({ correo: mv, tipo: tipoCta(mv), rol: "Estudiante" }); guardarJ(K_PERFILES, lp); }
          syncRest("perfiles_rbac", { correo: mv, tipo_cuenta: tipoCta(mv), rol: "Estudiante" });
          ui.aviso = "Registrado como Estudiante: " + mv; render();
        };
        modal.querySelectorAll("[data-rm]").forEach(function (s) {
          s.onchange = function () {
            if (localStorage.getItem(K_SA) !== "1") return;
            var ml = s.getAttribute("data-rm"), lp = leerJ(K_PERFILES, []), o = lp.find(function (x) { return x.correo === ml; });
            if (o) { o.rol = s.value; guardarJ(K_PERFILES, lp); ui.aviso = "Rol actualizado: " + ml + " -> " + s.value; render(); }
          };
        });
      } else {
        var bp = document.getElementById("bds-v6-ph");
        if (bp) bp.onclick = async function () {
          var f = new Date().toLocaleString("es-CR"), s = await sha256("PRODHAB-8968|" + f);
          guardarJ(K_PRODHAB, { fecha: f, sha: s });
          syncRest("consentimientos_prodhab", { correo: "usuario@practicatecnica.com", sha256_constancia: s });
          render();
        };
      }
    }

    bCentro.onclick = function () { ui.modo = "centro"; modal.style.display = "block"; render(); };
    bQr.onclick = function () { ui.modo = "qr"; modal.style.display = "block"; render(); };
  }

  function boot() {
    try {
      var fav = document.querySelector("link[rel='icon']") || document.createElement("link");
      fav.rel = "icon"; fav.type = "image/svg+xml"; fav.href = "/buho-azul-circular.svg";
      if (!fav.parentNode) document.head.appendChild(fav);
    } catch (_e) {}

    syncContrasteClaro();
    bloquearSelectoresRolPublicos();
    latidoTrazabilidad("Inicio");
    montarInterfazFlotante();
    document.querySelectorAll("canvas").forEach(activarMoptTactil);
    setInterval(function () { latidoTrazabilidad(document.title || "Activa"); }, 30000);

    var obs = new MutationObserver(function () {
      syncContrasteClaro();
      bloquearSelectoresRolPublicos();
      document.querySelectorAll("canvas").forEach(activarMoptTactil);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-theme"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();