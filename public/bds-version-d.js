(function () {
  "use strict";
  if (window.__BDS_VERSION_D2_LOADED__) return;
  window.__BDS_VERSION_D2_LOADED__ = true;

  var DOMINIOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
  var SESION_KEY = "practicatecnica_bds_sesion_vD2";
  var LOCK_KEY = "practicatecnica_bds_intentos_vD2";
  var TEMA_KEY = "practicatecnica_bds_tema_vD2";
  var MAX_INTENTOS = 5;
  var COLON = "\u20A1";

  var BUHO_CIRCULAR_SVG =
    '<svg viewBox="0 0 128 128" width="42" height="42" role="img" aria-label="B\u00faho Azul Circular pracTICAtecnica.com" style="display:block;flex-shrink:0">' +
    '<defs><radialGradient id="bdsOwlD2" cx="50%" cy="38%" r="60%">' +
    '<stop offset="0%" stop-color="#3b82f6"/><stop offset="65%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e3a8a"/>' +
    '</radialGradient></defs>' +
    '<circle cx="64" cy="64" r="60" fill="url(#bdsOwlD2)" stroke="#93c5fd" stroke-width="4"/>' +
    '<path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="44" cy="63" r="18" fill="#ffffff"/><circle cx="84" cy="63" r="18" fill="#ffffff"/>' +
    '<circle cx="46" cy="63" r="9" fill="#0f172a"/><circle cx="82" cy="63" r="9" fill="#0f172a"/>' +
    '<circle cx="49" cy="59" r="3.2" fill="#ffffff"/><circle cx="85" cy="59" r="3.2" fill="#ffffff"/>' +
    '<polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';

  var ITEMS = [
    { id: "en-01", area: "Ingl\u00e9s", lang: "en-US", consigna: "Choose the word that has the same meaning as 'After that'.", contexto: "We made a lot of progress on our 25-mile journey. We had started hiking five miles the first day. After that, we hiked 10 miles.", ops: ["Therefore", "Consequently", "Subsequently", "Nevertheless"], ok: 2, exp: "'After that' equivale a 'Subsequently'." },
    { id: "en-02", area: "Ingl\u00e9s", lang: "en-US", consigna: "Choose the word that has the same meaning as 'Also'.", contexto: "The politician said everyone should have quality health care. Also, he said everyone should have a chance at a good education.", ops: ["Therefore", "However", "Furthermore", "Otherwise"], ok: 2, exp: "'Also' equivale a 'Furthermore'." },
    { id: "en-03", area: "Ingl\u00e9s", lang: "en-US", consigna: "Choose the connector that best replaces 'Even so'.", contexto: "The server passed the load test. Even so, the security team requested a full encryption audit before launch.", ops: ["Similarly", "Nevertheless", "Moreover", "Meanwhile"], ok: 1, exp: "'Even so' equivale a 'Nevertheless'." },
    { id: "fr-01", area: "Franc\u00e9s", lang: "fr-FR", consigna: "Choisissez le sens de 'Ensuite'.", contexto: "Nous arrivons \u00e0 Lyon ce matin. Ensuite, nous prenons le train pour Gen\u00e8ve.", ops: ["Apr\u00e8s cela", "Cependant", "Jamais", "Autrefois"], ok: 0, exp: "'Ensuite' significa 'Apr\u00e8s cela'." },
    { id: "fr-02", area: "Franc\u00e9s", lang: "fr-FR", consigna: "Identifiez le motif du retard de Claire.", contexto: "Claire est arriv\u00e9e en retard au lyc\u00e9e parce que le bus a eu une panne m\u00e9canique.", ops: ["Elle a oubli\u00e9 son cahier", "Le bus a eu une panne m\u00e9canique", "Le cours \u00e9tait annul\u00e9", "Il neigeait tr\u00e8s fort"], ok: 1, exp: "'Parce que' introduce la aver\u00eda mec\u00e1nica del bus." },
    { id: "fr-03", area: "Franc\u00e9s", lang: "fr-FR", consigna: "Synonyme le plus proche de 'Aussi'.", contexto: "L'application permet de r\u00e9viser le vocabulaire. Aussi, elle offre des exercices d'\u00e9coute.", ops: ["Malgr\u00e9 tout", "Au contraire", "De plus", "Pourtant"], ok: 2, exp: "'De plus' suma informaci\u00f3n adicional." },
    { id: "de-01", area: "Alem\u00e1n", lang: "de-DE", consigna: "Passende Bedeutung f\u00fcr 'danach'.", contexto: "Zuerst lesen wir die Aufgabe und danach besprechen wir die L\u00f6sung im Team.", ops: ["Trotzdem", "Anschlie\u00dfend / Sp\u00e4ter", "Gestern", "Niemals"], ok: 1, exp: "'Danach' indica lo que sigue inmediatamente." },
    { id: "de-02", area: "Alem\u00e1n", lang: "de-DE", consigna: "Gleiche Bedeutung wie 'Deshalb'.", contexto: "Es regnet stark in San Jos\u00e9. Deshalb fahren wir heute mit dem Bus zur Schule.", ops: ["Obwohl", "Selten", "W\u00e4hrend", "Darum"], ok: 3, exp: "'Deshalb' y 'Darum' indican consecuencia." },
    { id: "de-03", area: "Alem\u00e1n", lang: "de-DE", consigna: "Welche Aussage stimmt?", contexto: "Die Sch\u00fcler testen die Webseite auf dem Computer und pr\u00fcfen au\u00dferdem die mobile Ansicht.", ops: ["Sie pr\u00fcfen Desktop- und Mobilansicht", "Sie l\u00f6schen die Webseite", "Sie arbeiten ohne Computer", "Sie drucken leere Bl\u00e4tter"], ok: 0, exp: "Prueban computadora y m\u00f3vil." },
    { id: "pt-01", area: "Portugu\u00e9s", lang: "pt-BR", consigna: "Equivalente a 'Em seguida'.", contexto: "Estudamos redes de computadores pela manh\u00e3. Em seguida, praticamos firewall.", ops: ["Contudo", "Antes de tudo", "Logo depois", "Entretanto"], ok: 2, exp: "'Em seguida' equivale a 'Logo depois'." },
    { id: "pt-02", area: "Portugu\u00e9s", lang: "pt-BR", consigna: "Sin\u00f4nimo adequado para 'Portanto'.", contexto: "Todos os dados foram verificados com SHA-256; portanto, o documento \u00e9 aut\u00eantico.", ops: ["Por conseguinte", "Entretanto", "Embora", "Todavia"], ok: 0, exp: "'Portanto' equivale a 'Por conseguinte'." },
    { id: "pt-03", area: "Portugu\u00e9s", lang: "pt-BR", consigna: "Mesmo sentido de 'Al\u00e9m disso'.", contexto: "A cooperativa oferece bebidas naturais. Al\u00e9m disso, aceita pagamento digital.", ops: ["Por\u00e9m", "Ademais", "Caso contr\u00e1rio", "Apesar disso"], ok: 1, exp: "'Al\u00e9m disso' equivale a 'Ademais'." },
    { id: "es-01", area: "Espa\u00f1ol", lang: "es-CR", consigna: "Conector equivalente a 'por lo tanto'.", contexto: "El equipo verific\u00f3 los certificados TLS; por lo tanto, el portal qued\u00f3 protegido.", ops: ["Sin embargo", "No obstante", "A pesar de", "Por consiguiente"], ok: 3, exp: "'Por lo tanto' y 'Por consiguiente' expresan consecuencia." },
    { id: "es-02", area: "Espa\u00f1ol", lang: "es-CR", consigna: "Conector adversativo equivalente a 'sin embargo'.", contexto: "La PWA funciona sin conexi\u00f3n; sin embargo, requiere internet para sincronizar respaldos.", ops: ["En consecuencia", "No obstante", "Asimismo", "Por ende"], ok: 1, exp: "'No obstante' expresa contraste." },
    { id: "es-03", area: "Espa\u00f1ol", lang: "es-CR", consigna: "Finalidad del QR firmado con SHA-256.", contexto: "Para evitar errores al digitar c\u00f3digos extensos, se implementaron QR con SHA-256 para permisos y horarios.", ops: ["Validar con precisi\u00f3n sin digitar hashes largos", "Reemplazar el horario por juegos", "Permitir acceso an\u00f3nimo", "Mostrar anuncios externos"], ok: 0, exp: "El QR agiliza y asegura la verificaci\u00f3n criptogr\u00e1fica." },
    { id: "mat-01", area: "Matem\u00e1ticas", lang: "es-CR", consigna: "Criterio correcto del costo total C(x).", contexto: "Un taller cobra 15 000 colones de revisi\u00f3n base m\u00e1s 2 500 colones por cada hora x.", ops: ["C(x) = 15000x + 2500", "C(x) = 15000 - 2500x", "C(x) = 15000 + 2500x", "C(x) = 17500x"], ok: 2, exp: "Cargo fijo 15000 + 2500 por hora x." },
    { id: "mat-02", area: "Matem\u00e1ticas", lang: "es-CR", consigna: "Monto total con 10 % de descuento.", contexto: "Una bebida cuesta 1 000 colones y un emparedado 1 500 colones. Con 10 % de descuento sobre el total, \u00bfcu\u00e1nto paga?", ops: ["2 250 colones", "2 400 colones", "2 500 colones", "2 750 colones"], ok: 0, exp: "2500 - 250 = 2250 colones." },
    { id: "mat-03", area: "Matem\u00e1ticas", lang: "es-CR", consigna: "Probabilidad de elegir Matem\u00e1ticas.", contexto: "En un banco de 24 \u00edtems, 3 son de Matem\u00e1ticas. \u00bfCu\u00e1l es la probabilidad?", ops: ["1/4 (25 %)", "1/8 (12,5 %)", "1/3 (33,3 %)", "1/6 (16,7 %)"], ok: 1, exp: "3/24 = 1/8 = 12,5 %." },
    { id: "web-01", area: "Desarrollo Web", lang: "es-CR", consigna: "Causa de pantalla vieja tras desplegar en Vercel.", contexto: "Tras publicar cambios en GitHub y Vercel, el navegador sigue mostrando la versi\u00f3n anterior.", ops: ["Brillo bajo del monitor", "Error de HTML div", "Service Worker antiguo sirviendo cach\u00e9 PWA", "Idioma del teclado"], ok: 2, exp: "Un Service Worker viejo retiene el bundle anterior." },
    { id: "web-02", area: "Desarrollo Web", lang: "es-CR", consigna: "C\u00f3mo evitar botones de audio cortados.", contexto: "El bot\u00f3n de play queda recortado abajo en m\u00f3vil y computadora.", ops: ["Usar overflow hidden de 20px", "Quitar vista escritorio", "Duplicar scripts en index.html", "Usar layout flexbox/grid responsivo con padding seguro"], ok: 3, exp: "El flujo responsivo evita recortes." },
    { id: "web-03", area: "Desarrollo Web", lang: "es-CR", consigna: "C\u00f3mo erradicar \u00edtems en blanco.", contexto: "Algunos registros incompletos muestran botones de opciones vac\u00edos.", ops: ["Validar textos y cantidad de opciones antes de renderizar", "Agrandar la letra", "Quitar las keys de React", "Ocultar errores en consola"], ok: 0, exp: "Un validador estricto impide renderizar blancos." },
    { id: "cib-01", area: "Ciberseguridad", lang: "es-CR", consigna: "Medida contra robo de cookies por XSS.", contexto: "Una app web expone tokens de sesi\u00f3n accesibles desde JavaScript.", ops: ["Desactivar HTTPS", "Cookies HttpOnly y Secure validadas en servidor", "Guardar claves en localStorage", "Permitir acceso sin correo"], ok: 1, exp: "HttpOnly bloquea lectura desde document.cookie." },
    { id: "cib-02", area: "Ciberseguridad", lang: "es-CR", consigna: "Qu\u00e9 garantiza verificar SHA-256 en un QR.", contexto: "Un permiso estudiantil incluye firma SHA-256 de 64 caracteres hex.", ops: ["Descargas m\u00e1s r\u00e1pidas", "Eliminar la c\u00e1mara", "Integridad: confirma que no fue alterado ni falsificado", "Bajar brillo de pantalla"], ok: 2, exp: "SHA-256 garantiza integridad criptogr\u00e1fica." },
    { id: "cib-03", area: "Ciberseguridad", lang: "es-CR", consigna: "Ventaja de exigir @gmail.com o @mep.go.cr.", contexto: "Antes cualquiera entraba poniendo cualquier nombre inventado.", ops: ["Modificar notas ajenas", "Deshabilitar privacidad", "Bloquear navegadores", "Trazabilidad real y separaci\u00f3n de prueba gratuita limitada"], ok: 3, exp: "Garantiza autenticaci\u00f3n verificable y control de funciones." }
  ];

  var CATALOGO = [
    { id: "te", nombre: "T\u00e9 Fr\u00edo (500 ml)", precio: 700 },
    { id: "tr", nombre: "Tropical (surtido)", precio: 800 },
    { id: "pv", nombre: "Prote\u00edna con sabor (Vainilla / Chocolate)", precio: 1500 },
    { id: "pf", nombre: "Prote\u00edna con sabor (Fresa)", precio: 1500 },
    { id: "ag", nombre: "Agua embotellada", precio: 600 },
    { id: "em", nombre: "Empanada arreglada", precio: 1000 },
    { id: "sw", nombre: "S\u00e1ndwich jam\u00f3n y queso", precio: 1200 },
    { id: "cf", nombre: "Caf\u00e9 negro / con leche", precio: 700 }
  ];

  var SENALES_MOPT = [
    { codigo: "ALTO", color: "#b91c1c", regla: "Detenci\u00f3n obligatoria antes de la l\u00ednea de parada." },
    { codigo: "CEDA", color: "#a16207", regla: "Reduzca velocidad y ceda el paso al tr\u00e1nsito prioritario." },
    { codigo: "ZONA ESCOLAR 25", color: "#b45309", regla: "Velocidad m\u00e1xima 25 km/h frente a centros educativos." },
    { codigo: "L\u00cdMITE 60", color: "#1e40af", regla: "Mantenga su carril dentro del l\u00edmite reglamentario." }
  ];

  function inyectarEstilosContrasteAAA() {
    var oldStyle = document.getElementById("bds-vd-contrast-css");
    if (oldStyle) oldStyle.remove();
    var st = document.createElement("style");
    st.id = "bds-vd-contrast-css";
    st.textContent = [
      "#bds-version-d-root { --bg:#f1f5f9; --surface:#ffffff; --surface-soft:#e2e8f0; --ink:#0f172a; --ink-muted:#334155; --border:#64748b; --border-soft:#94a3b8; --primary:#1e40af; --primary-hover:#1e3a8a; --primary-ink:#ffffff; --accent:#4338ca; --audio:#c2410c; --audio-bg:#fff7ed; --audio-border:#ea580c; --audio-ink:#7c2d12; --warn-bg:#fef3c7; --warn-border:#b45309; --warn-ink:#451a03; --err-bg:#fee2e2; --err-border:#b91c1c; --err-ink:#7f1d1d; --ok-bg:#dcfce7; --ok-border:#15803d; --ok-ink:#14532d; --sel-bg:#dbeafe; --sel-border:#1d4ed8; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif !important; color-scheme:light !important; background:var(--bg) !important; color:var(--ink) !important; min-height:100vh !important; }",
      "#bds-version-d-root[data-theme='dark'] { --bg:#0f172a; --surface:#1e293b; --surface-soft:#334155; --ink:#f8fafc; --ink-muted:#e2e8f0; --border:#94a3b8; --border-soft:#64748b; --primary:#2563eb; --primary-hover:#3b82f6; --primary-ink:#ffffff; --accent:#4f46e5; --audio:#ea580c; --audio-bg:#292524; --audio-border:#fb923c; --audio-ink:#ffedd5; --warn-bg:#451a03; --warn-border:#f59e0b; --warn-ink:#fef3c7; --err-bg:#450a0a; --err-border:#f87171; --err-ink:#fee2e2; --ok-bg:#052e16; --ok-border:#4ade80; --ok-ink:#dcfce7; --sel-bg:#1e3a8a; --sel-border:#93c5fd; color-scheme:dark !important; }",
      "#bds-version-d-root * { box-sizing:border-box; }",
      "#bds-version-d-root .bds-card { background:var(--surface) !important; color:var(--ink) !important; border:1.5px solid var(--border-soft) !important; border-radius:16px !important; box-shadow:0 4px 14px rgba(15,23,42,.08) !important; }",
      "#bds-version-d-root .bds-header { position:sticky; top:0; z-index:30; background:var(--surface) !important; color:var(--ink) !important; border-bottom:2px solid var(--border-soft) !important; padding:12px 18px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; }",
      "#bds-version-d-root .bds-title { color:var(--ink) !important; font-weight:900 !important; }",
      "#bds-version-d-root .bds-muted { color:var(--ink-muted) !important; font-weight:600 !important; }",
      "#bds-version-d-root .bds-input, #bds-version-d-root .bds-select { width:100%; background:var(--surface) !important; color:var(--ink) !important; border:2px solid var(--border) !important; border-radius:10px !important; padding:10px 12px !important; font-size:14px !important; font-weight:600 !important; }",
      "#bds-version-d-root .bds-input::placeholder { color:var(--ink-muted) !important; opacity:0.85 !important; }",
      "#bds-version-d-root .bds-input:focus, #bds-version-d-root .bds-select:focus { outline:3px solid #2563eb !important; outline-offset:1px !important; border-color:#1e40af !important; }",
      "#bds-version-d-root .bds-btn { border-radius:10px !important; padding:9px 14px !important; font-size:13px !important; font-weight:800 !important; cursor:pointer !important; transition:transform .08s ease; }",
      "#bds-version-d-root .bds-btn-primary { background:var(--primary) !important; color:var(--primary-ink) !important; border:2px solid var(--primary) !important; }",
      "#bds-version-d-root .bds-btn-primary:hover { background:var(--primary-hover) !important; }",
      "#bds-version-d-root .bds-btn-secondary { background:var(--surface) !important; color:var(--ink) !important; border:2px solid var(--border) !important; }",
      "#bds-version-d-root .bds-btn-secondary:hover { background:var(--surface-soft) !important; }",
      "#bds-version-d-root .bds-btn-accent { background:var(--accent) !important; color:#ffffff !important; border:2px solid var(--accent) !important; }",
      "#bds-version-d-root .bds-btn-audio { background:var(--audio) !important; color:#ffffff !important; border:2px solid var(--audio) !important; border-radius:999px !important; padding:10px 16px !important; font-size:13px !important; font-weight:800 !important; cursor:pointer !important; }",
      "#bds-version-d-root .bds-btn-danger { background:#b91c1c !important; color:#ffffff !important; border:2px solid #991b1b !important; }",
      "#bds-version-d-root .bds-btn-opt { width:100%; display:flex; align-items:center; gap:12px; text-align:left; padding:13px 14px; margin-bottom:10px; border-radius:12px !important; cursor:pointer !important; background:var(--surface) !important; color:var(--ink) !important; border:2px solid var(--border-soft) !important; font-size:14px !important; font-weight:700 !important; }",
      "#bds-version-d-root .bds-btn-opt:hover { background:var(--surface-soft) !important; border-color:var(--primary) !important; }",
      "#bds-version-d-root .bds-btn-opt-active { background:var(--sel-bg) !important; color:var(--ink) !important; border:2.5px solid var(--sel-border) !important; }",
      "#bds-version-d-root .bds-badge-letter { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; flex-shrink:0; background:var(--surface-soft) !important; color:var(--ink) !important; border:1.5px solid var(--border) !important; }",
      "#bds-version-d-root .bds-btn-opt-active .bds-badge-letter { background:var(--primary) !important; color:#ffffff !important; border-color:var(--primary) !important; }",
      "#bds-version-d-root button:disabled { background:var(--surface-soft) !important; color:var(--ink-muted) !important; border:2px solid var(--border-soft) !important; cursor:not-allowed !important; opacity:0.75 !important; }",
      "#bds-version-d-root .bds-pill { border-radius:999px !important; padding:7px 13px !important; font-size:12px !important; font-weight:800 !important; cursor:pointer !important; }",
      "#bds-version-d-root .bds-alert-warn { background:var(--warn-bg) !important; color:var(--warn-ink) !important; border:2px solid var(--warn-border) !important; border-radius:12px !important; padding:12px 14px !important; font-size:13px !important; font-weight:700 !important; }",
      "#bds-version-d-root .bds-alert-err { background:var(--err-bg) !important; color:var(--err-ink) !important; border:2px solid var(--err-border) !important; border-radius:12px !important; padding:12px 14px !important; font-size:13px !important; font-weight:700 !important; }",
      "#bds-version-d-root .bds-alert-ok { background:var(--ok-bg) !important; color:var(--ok-ink) !important; border:2px solid var(--ok-border) !important; border-radius:12px !important; padding:12px 14px !important; font-size:13px !important; font-weight:700 !important; }"
    ].join("\n");
    document.head.appendChild(st);
  }

  var vocesCargadas = [];
  function cargarVoces() {
    if ("speechSynthesis" in window) {
      vocesCargadas = window.speechSynthesis.getVoices() || [];
    }
  }
  cargarVoces();
  if ("speechSynthesis" in window && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = cargarVoces;
  }

  function elegirVoz(lang) {
    cargarVoces();
    if (!vocesCargadas.length) return null;
    var t = String(lang || "es-CR").toLowerCase();
    var p = t.split("-")[0];
    return vocesCargadas.find(function (v) { return v.lang && v.lang.toLowerCase() === t; }) ||
           vocesCargadas.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }) ||
           vocesCargadas[0];
  }

  function hablarPregunta(texto, lang, rate, onStatus) {
    if (!("speechSynthesis" in window)) {
      if (onStatus) onStatus("Tu navegador no soporta lectura de voz.");
      return;
    }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = lang || "es-CR";
    u.rate = rate || 1;
    var voz = elegirVoz(u.lang);
    if (voz) u.voice = voz;
    u.onstart = function () { if (onStatus) onStatus("Reproduciendo audio (" + u.lang + ")..."); };
    u.onend = function () { if (onStatus) onStatus(""); };
    u.onerror = function () { if (onStatus) onStatus("Audio detenido o bloqueado por el navegador."); };
    try { window.speechSynthesis.resume(); } catch (_e) {}
    window.speechSynthesis.speak(u);
  }

  function detenerVoz() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function correoValido(c) {
    var s = String(c || "").trim().toLowerCase();
    var p = s.split("@");
    return p.length === 2 && p[0].length > 0 && DOMINIOS.indexOf(p[1]) !== -1;
  }

  function leerSesion() {
    try {
      var raw = localStorage.getItem(SESION_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (obj && (obj.modo === "prueba" || correoValido(obj.correo))) return obj;
    } catch (_e) {}
    return null;
  }

  function guardarSesion(obj) {
    try {
      if (obj) localStorage.setItem(SESION_KEY, JSON.stringify(obj));
      else localStorage.removeItem(SESION_KEY);
    } catch (_e) {}
  }

  async function sha256(txt) {
    var data = new TextEncoder().encode(String(txt || ""));
    var buf = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function opcionesSegunNivel(item, nivel) {
    var l4 = ["A", "B", "C", "D"];
    if (nivel === "macro") {
      return {
        opciones: item.ops.map(function (t, i) { return { letra: l4[i], texto: t }; }),
        correcta: l4[item.ok]
      };
    }
    var okTexto = item.ops[item.ok];
    var dist = item.ops.filter(function (_t, i) { return i !== item.ok; }).slice(0, 2);
    var seed = 0;
    for (var k = 0; k < item.id.length; k++) seed += item.id.charCodeAt(k);
    var pos = seed % 3;
    var arr = [];
    var d = 0;
    for (var j = 0; j < 3; j++) arr.push(j === pos ? okTexto : dist[d++]);
    var l3 = ["A", "B", "C"];
    return {
      opciones: arr.map(function (t, i) { return { letra: l3[i], texto: t }; }),
      correcta: l3[pos]
    };
  }

  function montarVersionD2() {
    inyectarEstilosContrasteAAA();

    var fav = document.querySelector("link[rel='icon']") || document.createElement("link");
    fav.rel = "icon";
    fav.type = "image/svg+xml";
    fav.href = "/buho-azul-circular.svg";
    if (!fav.parentNode) document.head.appendChild(fav);

    // Ocultar cualquier contenedor viejo (cero versiones anteriores visibles)
    ["root", "app", "bds-v334-root", "bds-version-d-root"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && id !== "bds-version-d-root") el.style.display = "none";
      if (el && id === "bds-version-d-root") el.remove();
    });

    var root = document.createElement("div");
    root.id = "bds-version-d-root";
    document.body.appendChild(root);

    var temaInicial = "light";
    try {
      var tSaved = localStorage.getItem(TEMA_KEY);
      if (tSaved === "dark" || tSaved === "light") temaInicial = tSaved;
    } catch (_e) {}

    var state = {
      tema: temaInicial,
      vistaAuth: "login",
      verClave: false,
      tab: "practica",
      nivel: "macro",
      area: "Ingl\u00e9s",
      idx: 0,
      sel: null,
      rate: 1,
      carrito: [],
      comedorLogs: [],
      qrUltimo: null,
      qrInst: null,
      moptRaf: 0
    };

    function limpiarRecursos() {
      detenerVoz();
      if (state.moptRaf) { cancelAnimationFrame(state.moptRaf); state.moptRaf = 0; }
      if (state.qrInst) {
        try { state.qrInst.stop().then(function () { state.qrInst.clear(); }); } catch (_e) {}
        state.qrInst = null;
      }
    }

    function iniciarMoptCanvas() {
      var canvas = document.getElementById("bds-mopt-canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var st = {
        dragging: false, carX: 210, carY: 360, targetX: 210, targetY: 360,
        freno: false, roadOffset: 0, obstaculos: [], puntaje: 100, semaforo: "VERDE", tick: 0
      };

      function setUi(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
      function moverPuntero(ev) {
        var rect = canvas.getBoundingClientRect();
        st.targetX = (ev.clientX - rect.left) * (canvas.width / rect.width);
        st.targetY = (ev.clientY - rect.top) * (canvas.height / rect.height);
      }

      canvas.onpointerdown = function (e) {
        try { canvas.setPointerCapture(e.pointerId); } catch (_err) {}
        st.dragging = true;
        canvas.style.cursor = "grabbing";
        moverPuntero(e);
      };
      canvas.onpointermove = function (e) { if (st.dragging) moverPuntero(e); };
      canvas.onpointerup = function () { st.dragging = false; canvas.style.cursor = "grab"; };
      canvas.onpointercancel = function () { st.dragging = false; canvas.style.cursor = "grab"; };

      var btnFreno = document.getElementById("bds-mopt-brake");
      if (btnFreno) {
        btnFreno.onpointerdown = function () { st.freno = true; };
        btnFreno.onpointerup = function () { st.freno = false; };
        btnFreno.onpointerleave = function () { st.freno = false; };
      }
      var btnReset = document.getElementById("bds-mopt-reset");
      if (btnReset) {
        btnReset.onclick = function () {
          st.puntaje = 100;
          st.obstaculos = [];
          setUi("bds-mopt-score", "100 / 100");
          setUi("bds-mopt-msg", "Simulador reiniciado. Arrastra el carro azul con tu dedo o mouse.");
        };
      }

      function frame() {
        st.tick++;
        if (st.tick % 360 === 0) {
          st.semaforo = st.semaforo === "VERDE" ? "ROJO" : "VERDE";
          var semEl = document.getElementById("bds-mopt-sem");
          if (semEl) {
            semEl.textContent = "Sem\u00e1foro: " + st.semaforo;
            semEl.style.background = st.semaforo === "VERDE" ? "#15803d" : "#b91c1c";
          }
          var sObj = SENALES_MOPT[((st.tick / 360) | 0) % SENALES_MOPT.length];
          var badge = document.getElementById("bds-mopt-sign-badge");
          if (badge) { badge.textContent = "SE\u00d1AL: " + sObj.codigo; badge.style.background = sObj.color; }
          setUi("bds-mopt-sign-rule", sObj.regla);
        }

        var vel = st.freno ? 0.6 : 4.2;
        st.roadOffset = (st.roadOffset + vel) % 48;

        st.carX += (st.targetX - st.carX) * 0.24;
        st.carY += (st.targetY - st.carY) * 0.24;
        st.carX = Math.max(78, Math.min(342, st.carX));
        st.carY = Math.max(110, Math.min(415, st.carY));

        if (st.tick % 75 === 0) {
          var lanes = [110, 210, 310];
          st.obstaculos.push({ x: lanes[Math.floor(Math.random() * 3)], y: -50 });
        }

        ctx.fillStyle = "#15803d";
        ctx.fillRect(0, 0, 420, 480);
        ctx.fillStyle = "#334155";
        ctx.fillRect(54, 0, 312, 480);
        ctx.fillStyle = "#facc15";
        ctx.fillRect(58, 0, 5, 480);
        ctx.fillRect(357, 0, 5, 480);

        ctx.fillStyle = "#ffffff";
        for (var y = -48; y < 480; y += 48) {
          ctx.fillRect(158, y + st.roadOffset, 4, 26);
          ctx.fillRect(258, y + st.roadOffset, 4, 26);
        }

        if (st.semaforo === "ROJO") {
          ctx.fillStyle = "rgba(185,28,28,0.92)";
          ctx.fillRect(63, 76, 294, 8);
          if (!st.freno && st.carY < 160 && st.tick % 30 === 0) {
            st.puntaje = Math.max(0, st.puntaje - 5);
            setUi("bds-mopt-score", st.puntaje + " / 100");
            setUi("bds-mopt-msg", "Sem\u00e1foro en ROJO: usa FRENAR o arrastra atr\u00e1s de la l\u00ednea roja (-5 pts).");
          }
        }

        st.obstaculos = st.obstaculos.filter(function (o) { return o.y < 540; });
        for (var i = 0; i < st.obstaculos.length; i++) {
          var ob = st.obstaculos[i];
          ob.y += vel + 1.4;
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(ob.x - 21, ob.y - 36, 42, 72);
          ctx.fillStyle = "#fee2e2";
          ctx.fillRect(ob.x - 14, ob.y - 24, 28, 12);

          if (Math.abs(st.carX - ob.x) < 36 && Math.abs(st.carY - ob.y) < 58) {
            ob.y = 600;
            st.puntaje = Math.max(0, st.puntaje - 10);
            setUi("bds-mopt-score", st.puntaje + " / 100");
            setUi("bds-mopt-msg", "Colisi\u00f3n evitada tarde: cambia de carril arrastrando con dedo o mouse (-10 pts).");
          }
        }

        ctx.fillStyle = "#1d4ed8";
        ctx.fillRect(st.carX - 22, st.carY - 38, 44, 76);
        ctx.fillStyle = "#bfdbfe";
        ctx.fillRect(st.carX - 15, st.carY - 22, 30, 16);
        ctx.fillStyle = "#fde047";
        ctx.fillRect(st.carX - 18, st.carY - 38, 9, 6);
        ctx.fillRect(st.carX + 9, st.carY - 38, 9, 6);

        state.moptRaf = requestAnimationFrame(frame);
      }

      state.moptRaf = requestAnimationFrame(frame);
    }

    function render() {
      limpiarRecursos();
      root.setAttribute("data-theme", state.tema);
      var s = leerSesion();
      var areas = ["Ingl\u00e9s", "Franc\u00e9s", "Alem\u00e1n", "Portugu\u00e9s", "Espa\u00f1ol", "Matem\u00e1ticas", "Desarrollo Web", "Ciberseguridad"];

      if (!s) {
        var intentos = Number(localStorage.getItem(LOCK_KEY) || "0");
        var locked = intentos >= MAX_INTENTOS;
        root.innerHTML =
          '<div style="min-height:100vh;padding:28px 16px;background:var(--bg)">' +
          '<div class="bds-card" style="max-width:540px;margin:16px auto;padding:28px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px">' +
          '<div style="display:flex;align-items:center;gap:12px">' + BUHO_CIRCULAR_SVG +
          '<div><div style="font-size:12px;font-weight:800;color:var(--primary)">pracTICAtecnica.com &bull; BDS Devs</div>' +
          '<div class="bds-title" style="font-size:21px">' + (state.vistaAuth === "login" ? "Acceso Exclusivo Gmail / MEP" : "Recuperar contrase\u00f1a") + '</div></div></div>' +
          '<button id="bds-vd-theme" type="button" class="bds-btn bds-btn-secondary" style="padding:6px 10px !important;font-size:12px !important">' + (state.tema === "light" ? "Oscuro" : "Claro AAA") + '</button>' +
          '</div>' +
          (locked ? '<div class="bds-alert-err" style="margin-bottom:14px">Cuenta bloqueada tras 5 intentos fallidos consecutivos. Comun\u00edcate con el soporte de pracTICAtecnica.com.</div>' : '') +
          (state.vistaAuth === "login"
            ? '<form id="bds-vd-login">' +
              '<label class="bds-title" style="display:block;font-size:13px;margin-bottom:6px">Correo autorizado (@gmail.com o @mep.go.cr)</label>' +
              '<input id="bds-vd-mail" class="bds-input" type="email" required ' + (locked ? 'disabled ' : '') + 'placeholder="usuario@est.mep.go.cr o usuario@gmail.com"/>' +
              '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:12px">' +
              '<div><label class="bds-title" style="display:block;font-size:13px;margin-bottom:6px">Rol RBAC</label>' +
              '<select id="bds-vd-rol" class="bds-select" ' + (locked ? 'disabled ' : '') + '>' +
              '<option value="Estudiante">Estudiante</option><option value="Docente">Docente</option><option value="Padre/Madre">Padre / Madre</option><option value="Jefatura">Jefatura</option><option value="Auxiliar">Auxiliar</option></select></div>' +
              '<div><label class="bds-title" style="display:block;font-size:13px;margin-bottom:6px">Contrase\u00f1a</label>' +
              '<div style="display:flex;gap:6px"><input id="bds-vd-pass" class="bds-input" type="' + (state.verClave ? 'text' : 'password') + '" required ' + (locked ? 'disabled ' : '') + 'placeholder="Tu contrase\u00f1a"/>' +
              '<button id="bds-vd-eye" type="button" class="bds-btn bds-btn-secondary" style="white-space:nowrap">' + (state.verClave ? "Ocultar" : "Ver") + '</button></div></div></div>' +
              '<div id="bds-vd-err" style="margin-top:10px"></div>' +
              '<button type="submit" ' + (locked ? 'disabled ' : '') + 'class="bds-btn bds-btn-primary" style="width:100%;margin-top:14px;padding:12px !important;font-size:14px !important">Iniciar sesi\u00f3n con Gmail o MEP</button>' +
              '<button id="bds-vd-oauth" type="button" ' + (locked ? 'disabled ' : '') + 'class="bds-btn bds-btn-secondary" style="width:100%;margin-top:10px">Continuar con Google (OAuth)</button>' +
              '<div style="text-align:right;margin-top:10px"><button id="bds-vd-go-rec" type="button" class="bds-btn bds-btn-secondary" style="padding:6px 10px !important;font-size:12px !important">\u00bfOlvidaste tu contrase\u00f1a?</button></div>' +
              '</form>'
            : '<form id="bds-vd-rec">' +
              '<input id="bds-vd-rec-mail" class="bds-input" type="email" required placeholder="usuario@est.mep.go.cr o usuario@gmail.com" style="margin-bottom:10px"/>' +
              '<input id="bds-vd-rec-p1" class="bds-input" type="password" required placeholder="Nueva contrase\u00f1a (m\u00ednimo 8 caracteres)" style="margin-bottom:10px"/>' +
              '<input id="bds-vd-rec-p2" class="bds-input" type="password" required placeholder="Confirmar nueva contrase\u00f1a"/>' +
              '<div id="bds-vd-rec-msg" style="margin-top:10px"></div>' +
              '<div style="display:flex;gap:8px;margin-top:12px"><button type="submit" class="bds-btn bds-btn-primary" style="flex:1">Enviar verificaci\u00f3n</button>' +
              '<button id="bds-vd-back-login" type="button" class="bds-btn bds-btn-secondary">Volver</button></div></form>'
          ) +
          '<div style="margin-top:18px;padding-top:16px;border-top:2px solid var(--border-soft)">' +
          '<div class="bds-alert-warn"><strong>Publicidad oficial pracTICAtecnica.com (BDS Devs):</strong> La prueba gratuita limita funciones avanzadas (1 muestra por materia, sin MOPT completo, QR, Cooperativa ni Comedor). Inicia con Gmail o MEP para acceso total.</div>' +
          '<button id="bds-vd-trial" type="button" class="bds-btn bds-btn-secondary" style="width:100%;margin-top:10px">Entrar en prueba gratuita limitada (con publicidad nuestra)</button>' +
          '</div></div></div>';

        document.getElementById("bds-vd-theme").onclick = function () {
          state.tema = state.tema === "light" ? "dark" : "light";
          try { localStorage.setItem(TEMA_KEY, state.tema); } catch (_e) {}
          render();
        };
        document.getElementById("bds-vd-trial").onclick = function () {
          guardarSesion({ correo: "prueba@practicatecnica.com", rol: "Prueba", modo: "prueba" });
          render();
        };

        if (state.vistaAuth === "login") {
          document.getElementById("bds-vd-eye").onclick = function () { state.verClave = !state.verClave; render(); };
          document.getElementById("bds-vd-go-rec").onclick = function () { state.vistaAuth = "recover"; render(); };
          document.getElementById("bds-vd-oauth").onclick = function () {
            var mail = document.getElementById("bds-vd-mail").value;
            var rol = document.getElementById("bds-vd-rol").value;
            if (!correoValido(mail)) {
              document.getElementById("bds-vd-err").innerHTML = '<div class="bds-alert-err">Escribe tu correo @gmail.com o @mep.go.cr para continuar con Google OAuth.</div>';
              return;
            }
            localStorage.setItem(LOCK_KEY, "0");
            guardarSesion({ correo: mail.trim().toLowerCase(), rol: rol, modo: "completo" });
            render();
          };
          document.getElementById("bds-vd-login").onsubmit = function (ev) {
            ev.preventDefault();
            var mail = document.getElementById("bds-vd-mail").value;
            var rol = document.getElementById("bds-vd-rol").value;
            var pass = document.getElementById("bds-vd-pass").value;
            if (!correoValido(mail) || String(pass).trim().length < 6) {
              var n = Number(localStorage.getItem(LOCK_KEY) || "0") + 1;
              localStorage.setItem(LOCK_KEY, String(n));
              document.getElementById("bds-vd-err").innerHTML =
                '<div class="bds-alert-err">Solo correos @gmail.com, @mep.go.cr o @est.mep.go.cr y contrase\u00f1a de m\u00ednimo 6 caracteres (' + n + '/' + MAX_INTENTOS + ').</div>';
              if (n >= MAX_INTENTOS) render();
              return;
            }
            localStorage.setItem(LOCK_KEY, "0");
            guardarSesion({ correo: mail.trim().toLowerCase(), rol: rol, modo: "completo" });
            render();
          };
        } else {
          document.getElementById("bds-vd-back-login").onclick = function () { state.vistaAuth = "login"; render(); };
          document.getElementById("bds-vd-rec").onsubmit = function (ev) {
            ev.preventDefault();
            var m = document.getElementById("bds-vd-rec-mail").value;
            var p1 = document.getElementById("bds-vd-rec-p1").value;
            var p2 = document.getElementById("bds-vd-rec-p2").value;
            var box = document.getElementById("bds-vd-rec-msg");
            if (!correoValido(m)) {
              box.innerHTML = '<div class="bds-alert-err">Usa un correo @gmail.com, @mep.go.cr o @est.mep.go.cr.</div>';
              return;
            }
            if (p1.length < 8 || p1 !== p2) {
              box.innerHTML = '<div class="bds-alert-err">La nueva contrase\u00f1a debe tener m\u00ednimo 8 caracteres y coincidir.</div>';
              return;
            }
            box.innerHTML = '<div class="bds-alert-ok">Enlace de verificaci\u00f3n preparado para ' + m.trim().toLowerCase() + '.</div>';
          };
        }
        return;
      }

      var esPrueba = s.modo === "prueba";
      var bodyHtml = "";

      if (state.tab === "practica") {
        var lista = ITEMS.filter(function (i) { return i.area === state.area; });
        if (esPrueba) lista = lista.slice(0, 1);
        if (state.idx >= lista.length) state.idx = 0;
        var item = lista[state.idx];
        var prep = opcionesSegunNivel(item, state.nivel);

        bodyHtml =
          '<div class="bds-card" style="padding:14px 16px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
          '<div class="bds-title" style="font-size:14px">Evaluaci\u00f3n: <span style="color:var(--primary)">' +
          (state.nivel === "macro" ? "Macroevaluaci\u00f3n (A, B, C, D)" : "Microevaluaci\u00f3n (A, B, C)") + '</span></div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button data-nivel="macro" class="bds-btn ' + (state.nivel === "macro" ? "bds-btn-primary" : "bds-btn-secondary") + '">Macro (A-B-C-D)</button>' +
          '<button data-nivel="micro" class="bds-btn ' + (state.nivel === "micro" ? "bds-btn-accent" : "bds-btn-secondary") + '">Micro (A-B-C)</button>' +
          '</div></div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">' +
          areas.map(function (a) {
            return '<button data-area="' + a + '" class="bds-pill ' + (state.area === a ? "bds-btn-primary" : "bds-btn-secondary") + '">' + a + '</button>';
          }).join("") + '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px">' +
          '<div class="bds-card" style="padding:20px">' +
          '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;color:var(--primary);margin-bottom:10px"><span>' + item.area + '</span><span>\u00cdtem ' + (state.idx + 1) + ' de ' + lista.length + '</span></div>' +
          '<h3 class="bds-title" style="margin:0 0 12px;font-size:19px;line-height:1.35">' + item.consigna + '</h3>' +
          '<div style="background:var(--surface-soft);color:var(--ink);border:1.5px solid var(--border-soft);border-radius:12px;padding:15px;font-size:15px;line-height:1.6;font-weight:600;margin-bottom:16px">' + item.contexto + '</div>' +
          '<div style="background:var(--audio-bg);border:2px solid var(--audio-border);border-radius:14px;padding:13px">' +
          '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
          '<button id="bds-vd-play-q" type="button" class="bds-btn-audio">&#9654; Escuchar pregunta</button>' +
          '<button id="bds-vd-play-ops" type="button" class="bds-btn bds-btn-secondary">Escuchar opciones</button>' +
          '<button id="bds-vd-stop" type="button" class="bds-btn bds-btn-danger">&#9632; Detener</button>' +
          '</div>' +
          '<select id="bds-vd-rate" class="bds-select" style="width:auto !important;padding:7px 10px !important">' +
          '<option value="0.75"' + (state.rate === 0.75 ? ' selected' : '') + '>0.75x</option>' +
          '<option value="1"' + (state.rate === 1 ? ' selected' : '') + '>1.0x</option>' +
          '<option value="1.2"' + (state.rate === 1.2 ? ' selected' : '') + '>1.2x</option></select>' +
          '</div><div id="bds-vd-audio-st" style="margin-top:8px;font-size:13px;font-weight:800;color:var(--audio-ink)"></div></div>' +
          '</div>' +
          '<div class="bds-card" style="padding:20px;display:flex;flex-direction:column;justify-content:space-between">' +
          '<div><div class="bds-muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px">Opciones (' + prep.opciones.length + ' alternativas)</div>' +
          prep.opciones.map(function (o) {
            var active = state.sel === o.letra;
            return '<button data-op="' + o.letra + '" type="button" class="bds-btn-opt ' + (active ? "bds-btn-opt-active" : "") + '">' +
              '<span class="bds-badge-letter">' + o.letra + '</span><span>' + o.texto + '</span></button>';
          }).join("") +
          (state.sel
            ? '<div class="' + (state.sel === prep.correcta ? "bds-alert-ok" : "bds-alert-warn") + '" style="margin-top:12px"><strong>' +
              (state.sel === prep.correcta ? "Respuesta correcta." : "Respuesta sugerida: " + prep.correcta + ".") + '</strong> ' + item.exp + '</div>'
            : '') +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1.5px solid var(--border-soft)">' +
          '<button id="bds-vd-prev" type="button" ' + (state.idx === 0 ? 'disabled ' : '') + 'class="bds-btn bds-btn-secondary">Anterior</button>' +
          '<button id="bds-vd-next" type="button" ' + (state.idx >= lista.length - 1 ? 'disabled ' : '') + 'class="bds-btn bds-btn-primary">Siguiente</button>' +
          '</div></div></div>';
      } else if (state.tab === "mopt") {
        bodyHtml =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;align-items:start">' +
          '<div class="bds-card" style="padding:18px;display:flex;flex-direction:column;align-items:center">' +
          '<div style="width:100%;max-width:420px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<span class="bds-title" style="font-size:15px">Simulador Vial MOPT (T\u00e1ctil / Mouse)</span>' +
          '<span id="bds-mopt-sem" style="background:#15803d;color:#ffffff;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:800">Sem\u00e1foro: VERDE</span></div>' +
          '<canvas id="bds-mopt-canvas" width="420" height="480" style="width:100%;max-width:420px;border-radius:14px;border:2px solid var(--border);touch-action:none;user-select:none;cursor:grab"></canvas>' +
          '<div style="width:100%;max-width:420px;display:flex;gap:8px;margin-top:12px">' +
          '<button id="bds-mopt-brake" type="button" class="bds-btn bds-btn-danger" style="flex:1;padding:12px !important">Mantener presionado: FRENAR</button>' +
          '<button id="bds-mopt-reset" type="button" class="bds-btn bds-btn-secondary">Reiniciar</button>' +
          '</div></div>' +
          '<div class="bds-card" style="padding:20px">' +
          '<h3 class="bds-title" style="margin:0 0 10px;font-size:19px">Control T\u00e1ctil y Mouse</h3>' +
          '<p class="bds-muted" style="margin:0 0 14px;font-size:14px;line-height:1.5">Toca y arrastra con tu dedo en celular/tablet o mant\u00e9n clic y mueve el mouse en computadora para guiar el veh\u00edculo azul.</p>' +
          '<div style="background:var(--sel-bg);border:2px solid var(--sel-border);border-radius:12px;padding:14px;margin-bottom:12px"><div class="bds-title" style="font-size:12px">Puntaje Vial MOPT</div><div id="bds-mopt-score" class="bds-title" style="font-size:28px">100 / 100</div></div>' +
          '<div class="bds-card" style="padding:14px;margin-bottom:12px"><span id="bds-mopt-sign-badge" style="background:#b91c1c;color:#ffffff;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800">SE\u00d1AL: ALTO</span><p id="bds-mopt-sign-rule" class="bds-muted" style="margin:10px 0 0;font-size:14px">Detenci\u00f3n obligatoria antes de la l\u00ednea de parada.</p></div>' +
          '<div id="bds-mopt-msg" class="bds-alert-warn">Arrastra el carro azul con tu dedo o mouse para esquivar tr\u00e1fico y respetar el sem\u00e1foro.</div>' +
          '</div></div>';
      } else if (state.tab === "qr") {
        bodyHtml =
          '<div class="bds-card" style="padding:20px">' +
          '<h3 class="bds-title" style="margin:0 0 6px;font-size:19px">Esc\u00e1ner QR y C\u00f3digos de Barras (SHA-256)</h3>' +
          '<p class="bds-muted" style="margin:0 0 14px;font-size:14px">Lee carnets, permisos, justificaciones, horarios y notas con c\u00e1mara o lector USB.</p>' +
          '<div style="margin-bottom:12px"><button id="bds-vd-cam-start" type="button" class="bds-btn bds-btn-primary">Activar c\u00e1mara QR / Barras</button></div>' +
          '<div id="bds-vd-qr-box" style="max-width:420px;margin-bottom:12px"></div>' +
          '<form id="bds-vd-usb-form" style="display:flex;gap:8px;flex-wrap:wrap"><input id="bds-vd-usb-in" class="bds-input" style="flex:1;min-width:220px" placeholder="Escanea con lector USB o pega SHA-256..."/><button type="submit" class="bds-btn bds-btn-primary">Validar</button></form>' +
          '<div id="bds-vd-qr-out" style="margin-top:12px">' + (state.qrUltimo ? '<div class="bds-alert-ok" style="word-break:break-all"><strong>Lectura:</strong> ' + state.qrUltimo + '</div>' : '') + '</div></div>';
      } else if (state.tab === "coop") {
        var total = state.carrito.reduce(function (a, b) { return a + b.precio * b.qty; }, 0);
        bodyHtml =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px">' +
          CATALOGO.map(function (p) {
            return '<div class="bds-card" style="padding:14px;display:flex;flex-direction:column;justify-content:space-between"><div class="bds-title" style="font-size:14px">' + p.nombre + '</div><div style="color:var(--primary);font-weight:900;font-size:16px;margin:8px 0">' + COLON + p.precio + '</div><button data-add="' + p.id + '" type="button" class="bds-btn bds-btn-primary" style="width:100%">Agregar</button></div>';
          }).join("") + '</div>' +
          '<div class="bds-card" style="padding:18px"><h3 class="bds-title" style="margin:0 0 10px;font-size:18px">Factura Cooperativa</h3>' +
          (state.carrito.length === 0 ? '<p class="bds-muted" style="font-size:14px">Sin art\u00edculos a\u00fan.</p>' : state.carrito.map(function (c) {
            return '<div style="display:flex;justify-content:space-between;font-size:14px;padding:8px 0;border-bottom:1.5px solid var(--border-soft);font-weight:700"><span>' + c.qty + 'x ' + c.nombre + '</span><span>' + COLON + (c.qty * c.precio) + '</span></div>';
          }).join("")) +
          '<div class="bds-title" style="display:flex;justify-content:space-between;font-size:18px;margin:14px 0"><span>Total</span><span>' + COLON + total + '</span></div>' +
          '<button id="bds-vd-fact" type="button" ' + (state.carrito.length === 0 ? 'disabled ' : '') + 'class="bds-btn bds-btn-primary" style="width:100%">Emitir factura SHA-256</button>' +
          '<div id="bds-vd-fact-out" style="margin-top:12px;word-break:break-all"></div></div></div>';
      } else if (state.tab === "comedor") {
        bodyHtml =
          '<div class="bds-card" style="padding:20px">' +
          '<h3 class="bds-title" style="margin:0 0 8px;font-size:19px">Comedor Institucional \u2014 Control QR SHA-256</h3>' +
          '<p class="bds-muted" style="margin:0 0 14px;font-size:14px">Escanea con lector USB o pega el QR del carnet para registrar paso \u00fanico diario.</p>' +
          '<form id="bds-vd-com-form" style="display:flex;gap:8px;flex-wrap:wrap"><input id="bds-vd-com-in" class="bds-input" style="flex:1;min-width:220px" placeholder="Escanea QR de estudiante o docente..."/><button type="submit" class="bds-btn bds-btn-primary">Registrar Comedor</button></form>' +
          '<div style="margin-top:14px;font-size:14px">' +
          (state.comedorLogs.length === 0 ? '<p class="bds-muted">Sin registros en esta sesi\u00f3n.</p>' : state.comedorLogs.map(function (l) {
            return '<div style="padding:10px 0;border-bottom:1.5px solid var(--border-soft);font-weight:700"><strong>' + l.hora + '</strong> \u2014 ' + l.texto + ' <span style="font-family:monospace;color:var(--primary)">(' + l.hash.slice(0, 16) + '...)</span></div>';
          }).join("")) + '</div></div>';
      }

      root.innerHTML =
        '<div style="min-height:100vh;background:var(--bg)">' +
        '<header class="bds-header">' +
        '<div style="display:flex;align-items:center;gap:12px">' + BUHO_CIRCULAR_SVG +
        '<div><div class="bds-title" style="font-size:16px">pracTICAtecnica.com &bull; Versi\u00f3n D2</div>' +
        '<div class="bds-muted" style="font-size:12px">' + (esPrueba ? "Prueba Gratuita Limitada (con publicidad nuestra)" : "Sesi\u00f3n (" + (s.rol || "Usuario") + "): " + s.correo) + '</div></div></div>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:6px">' +
        '<button data-tab="practica" type="button" class="bds-btn ' + (state.tab === "practica" ? "bds-btn-primary" : "bds-btn-secondary") + '">Pr\u00e1ctica 3x</button>' +
        '<button data-tab="mopt" type="button" ' + (esPrueba ? 'disabled ' : '') + 'class="bds-btn ' + (state.tab === "mopt" ? "bds-btn-primary" : "bds-btn-secondary") + '">Simulador MOPT</button>' +
        '<button data-tab="qr" type="button" ' + (esPrueba ? 'disabled ' : '') + 'class="bds-btn ' + (state.tab === "qr" ? "bds-btn-primary" : "bds-btn-secondary") + '">QR SHA-256</button>' +
        '<button data-tab="coop" type="button" ' + (esPrueba ? 'disabled ' : '') + 'class="bds-btn ' + (state.tab === "coop" ? "bds-btn-primary" : "bds-btn-secondary") + '">Cooperativa</button>' +
        '<button data-tab="comedor" type="button" ' + (esPrueba ? 'disabled ' : '') + 'class="bds-btn ' + (state.tab === "comedor" ? "bds-btn-primary" : "bds-btn-secondary") + '">Comedor</button>' +
        '<button id="bds-vd-theme" type="button" class="bds-btn bds-btn-secondary">' + (state.tema === "light" ? "Oscuro" : "Claro AAA") + '</button>' +
        '<button id="bds-vd-out" type="button" class="bds-btn bds-btn-danger">Cerrar sesi\u00f3n</button>' +
        '</nav></header>' +
        '<main style="max-width:1120px;margin:0 auto;padding:20px 16px 48px">' +
        (esPrueba ? '<div class="bds-alert-warn" style="margin-bottom:14px"><strong>Publicidad oficial pracTICAtecnica.com (BDS Devs):</strong> Est\u00e1s en modo prueba gratuita. Inicia con tu correo <strong>@gmail.com</strong> o <strong>@mep.go.cr / @est.mep.go.cr</strong> para desbloquear todos los \u00edtems, Simulador MOPT t\u00e1ctil, QR SHA-256, Cooperativa y Comedor.</div>' : '') +
        bodyHtml + '</main></div>';

      root.querySelectorAll("[data-tab]").forEach(function (btn) {
        btn.onclick = function () { state.tab = btn.getAttribute("data-tab"); render(); };
      });
      document.getElementById("bds-vd-theme").onclick = function () {
        state.tema = state.tema === "light" ? "dark" : "light";
        try { localStorage.setItem(TEMA_KEY, state.tema); } catch (_e) {}
        render();
      };
      document.getElementById("bds-vd-out").onclick = function () { guardarSesion(null); render(); };

      if (state.tab === "practica") {
        root.querySelectorAll("[data-nivel]").forEach(function (b) {
          b.onclick = function () { state.nivel = b.getAttribute("data-nivel"); state.sel = null; render(); };
        });
        root.querySelectorAll("[data-area]").forEach(function (b) {
          b.onclick = function () { state.area = b.getAttribute("data-area"); state.idx = 0; state.sel = null; render(); };
        });
        root.querySelectorAll("[data-op]").forEach(function (b) {
          b.onclick = function () { state.sel = b.getAttribute("data-op"); render(); };
        });
        var listaNow = ITEMS.filter(function (i) { return i.area === state.area; });
        var cur = listaNow[state.idx] || listaNow[0];
        var prepNow = opcionesSegunNivel(cur, state.nivel);
        var setAudioSt = function (msg) { var el = document.getElementById("bds-vd-audio-st"); if (el) el.textContent = msg; };
        document.getElementById("bds-vd-rate").onchange = function (e) { state.rate = Number(e.target.value); };
        document.getElementById("bds-vd-play-q").onclick = function () {
          hablarPregunta(cur.consigna + ". " + cur.contexto, cur.lang, state.rate, setAudioSt);
        };
        document.getElementById("bds-vd-play-ops").onclick = function () {
          var txt = prepNow.opciones.map(function (o) { return "Opci\u00f3n " + o.letra + ": " + o.texto; }).join(". ");
          hablarPregunta(txt, cur.lang, state.rate, setAudioSt);
        };
        document.getElementById("bds-vd-stop").onclick = function () { detenerVoz(); setAudioSt(""); };
        document.getElementById("bds-vd-prev").onclick = function () { state.idx = Math.max(0, state.idx - 1); state.sel = null; render(); };
        document.getElementById("bds-vd-next").onclick = function () { state.idx = Math.min(listaNow.length - 1, state.idx + 1); state.sel = null; render(); };
      } else if (state.tab === "mopt") {
        iniciarMoptCanvas();
      } else if (state.tab === "qr") {
        document.getElementById("bds-vd-usb-form").onsubmit = async function (ev) {
          ev.preventDefault();
          var v = document.getElementById("bds-vd-usb-in").value.trim();
          if (!v) return;
          var h = await sha256(v);
          state.qrUltimo = v + " | SHA-256: " + h;
          render();
        };
        document.getElementById("bds-vd-cam-start").onclick = function () {
          function startMotor() {
            if (!window.Html5Qrcode) {
              document.getElementById("bds-vd-qr-out").innerHTML = '<div class="bds-alert-warn">Motor de c\u00e1mara no disponible; usa el campo de lector USB.</div>';
              return;
            }
            var q = new window.Html5Qrcode("bds-vd-qr-box");
            state.qrInst = q;
            q.start({ facingMode: "environment" }, { fps: 10, qrbox: 240 }, async function (txt) {
              var h = await sha256(txt);
              state.qrUltimo = txt + " | SHA-256: " + h;
              render();
            }, function () {});
          }
          if (window.Html5Qrcode) { startMotor(); return; }
          var sc = document.createElement("script");
          sc.src = "/vendor/html5-qrcode.min.js";
          sc.onload = startMotor;
          sc.onerror = startMotor;
          document.head.appendChild(sc);
        };
      } else if (state.tab === "coop") {
        root.querySelectorAll("[data-add]").forEach(function (b) {
          b.onclick = function () {
            var id = b.getAttribute("data-add");
            var prod = CATALOGO.find(function (p) { return p.id === id; });
            var ex = state.carrito.find(function (c) { return c.id === id; });
            if (ex) ex.qty++; else state.carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1 });
            render();
          };
        });
        document.getElementById("bds-vd-fact").onclick = async function () {
          var t = state.carrito.reduce(function (a, b) { return a + b.precio * b.qty; }, 0);
          var fol = "COOP-" + Date.now().toString().slice(-6);
          var h = await sha256(fol + "|" + t + "|" + JSON.stringify(state.carrito));
          state.carrito = [];
          render();
          var out = document.getElementById("bds-vd-fact-out");
          if (out) out.innerHTML = '<div class="bds-alert-ok"><strong>Factura ' + fol + '</strong> (' + COLON + t + ')<br/>SHA-256: ' + h + '</div>';
        };
      } else if (state.tab === "comedor") {
        document.getElementById("bds-vd-com-form").onsubmit = async function (ev) {
          ev.preventDefault();
          var v = document.getElementById("bds-vd-com-in").value.trim();
          if (!v) return;
          var h = await sha256(v);
          state.comedorLogs.unshift({ hora: new Date().toLocaleTimeString("es-CR"), texto: v, hash: h });
          render();
        };
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montarVersionD2);
  } else {
    montarVersionD2();
  }
})();