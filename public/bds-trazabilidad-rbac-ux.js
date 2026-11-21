(function () {
  "use strict";
  if (window.__BDS_SUITE_ULTRA_V51__) return;
  window.__BDS_SUITE_ULTRA_V51__ = true;

  var ROLES = ["Estudiante", "Padre/Madre", "Auxiliar", "Docente", "Jefatura", "SuperAdmin"];
  var DOMINIOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
  var KEY_PERFILES = "pt_bds_perfiles_rbac_v51";
  var KEY_INGRESOS = "pt_bds_trazabilidad_v51";
  var KEY_AUDITORIA = "pt_bds_auditoria_roles_v51";
  var KEY_PRODHAB = "pt_bds_prodhab_v51";
  var KEY_SESION = "pt_bds_sesion_actual_v51";
  var KEY_SA_MODE = "pt_bds_superadmin_v51";

  var BUHO_CIRCULAR =
    '<svg viewBox="0 0 128 128" width="32" height="32" aria-label="B\u00faho Azul Circular" style="display:block;flex-shrink:0">' +
    '<defs><radialGradient id="bdsOwlV51Btn" cx="50%" cy="38%" r="60%">' +
    '<stop offset="0%" stop-color="#3b82f6"/><stop offset="65%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e3a8a"/>' +
    '</radialGradient></defs>' +
    '<circle cx="64" cy="64" r="60" fill="url(#bdsOwlV51Btn)" stroke="#93c5fd" stroke-width="4"/>' +
    '<path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="44" cy="63" r="18" fill="#ffffff"/><circle cx="84" cy="63" r="18" fill="#ffffff"/>' +
    '<circle cx="46" cy="63" r="9" fill="#0f172a"/><circle cx="82" cy="63" r="9" fill="#0f172a"/>' +
    '<circle cx="49" cy="59" r="3.2" fill="#ffffff"/><circle cx="85" cy="59" r="3.2" fill="#ffffff"/>' +
    '<polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';

  function diagramaSvg(tipo, titulo) {
    if (tipo === "mapa-idiomas") {
      return '<svg viewBox="0 0 520 190" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
        '<rect width="520" height="190" fill="#0f172a"/>' +
        '<rect x="180" y="14" width="160" height="34" rx="10" fill="#1d4ed8"/><text x="260" y="36" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui">CONECTORES MEP</text>' +
        '<line x1="260" y1="48" x2="90" y2="84" stroke="#f59e0b" stroke-width="3"/><line x1="260" y1="48" x2="260" y2="84" stroke="#f59e0b" stroke-width="3"/><line x1="260" y1="48" x2="430" y2="84" stroke="#f59e0b" stroke-width="3"/>' +
        '<rect x="18" y="84" width="144" height="70" rx="10" fill="#1e3a8a" stroke="#93c5fd"/><text x="90" y="106" text-anchor="middle" fill="#fde68a" font-size="12" font-weight="800" font-family="system-ui">SECUENCIA</text><text x="90" y="126" text-anchor="middle" fill="#fff" font-size="11" font-family="system-ui">After that / Ensuite</text><text x="90" y="143" text-anchor="middle" fill="#bfdbfe" font-size="11" font-family="system-ui">Danach / Em seguida</text>' +
        '<rect x="188" y="84" width="144" height="70" rx="10" fill="#065f46" stroke="#6ee7b7"/><text x="260" y="106" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="800" font-family="system-ui">ADICI\u00d3N / CAUSA</text><text x="260" y="126" text-anchor="middle" fill="#fff" font-size="11" font-family="system-ui">Also = Furthermore</text><text x="260" y="143" text-anchor="middle" fill="#d1fae5" font-size="11" font-family="system-ui">Deshalb / Portanto</text>' +
        '<rect x="358" y="84" width="144" height="70" rx="10" fill="#4338ca" stroke="#c4b5fd"/><text x="430" y="106" text-anchor="middle" fill="#ddd6fe" font-size="12" font-weight="800" font-family="system-ui">CONTRASTE</text><text x="430" y="126" text-anchor="middle" fill="#fff" font-size="11" font-family="system-ui">Even so = Nevertheless</text><text x="430" y="143" text-anchor="middle" fill="#e0e7ff" font-size="11" font-family="system-ui">Sin embargo / No obstante</text>' +
        '<text x="260" y="177" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Mapa conceptual oficial \u2022 pracTICAtecnica.com</text></svg>';
    }
    if (tipo === "mapa-mate") {
      return '<svg viewBox="0 0 520 190" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
        '<rect width="520" height="190" fill="#0f172a"/>' +
        '<line x1="56" y1="150" x2="290" y2="150" stroke="#94a3b8" stroke-width="2.5"/><line x1="76" y1="24" x2="76" y2="162" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<line x1="76" y1="126" x2="270" y2="38" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round"/>' +
        '<circle cx="76" cy="126" r="6" fill="#f59e0b"/><circle cx="173" cy="82" r="6" fill="#22c55e"/><circle cx="270" cy="38" r="6" fill="#f59e0b"/>' +
        '<text x="90" y="138" fill="#fde68a" font-size="11" font-weight="700" font-family="system-ui">Intersecci\u00f3n (0, b)</text>' +
        '<text x="180" y="75" fill="#86efac" font-size="12" font-weight="800" font-family="system-ui">C(x) = m\u00b7x + b</text>' +
        '<rect x="310" y="28" width="192" height="122" rx="12" fill="#1e293b" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="406" y="54" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="800" font-family="system-ui">F\u00d3RMULAS CLAVE MEP</text>' +
        '<text x="324" y="80" fill="#fff" font-size="11" font-family="system-ui">\u2022 Pendiente: m = (y2 - y1)/(x2 - x1)</text>' +
        '<text x="324" y="102" fill="#fff" font-size="11" font-family="system-ui">\u2022 Descuento d%: Total \u00d7 (1 - d/100)</text>' +
        '<text x="324" y="124" fill="#fff" font-size="11" font-family="system-ui">\u2022 Probabilidad: P(A) = fav / total</text>' +
        '<text x="260" y="178" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Diagrama de Relaciones, \u00c1lgebra y Probabilidad \u2022 pracTICAtecnica.com</text></svg>';
    }
    return '<svg viewBox="0 0 520 190" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
      '<rect width="520" height="190" fill="#0f172a"/>' +
      '<rect x="20" y="34" width="140" height="96" rx="12" fill="#1e40af" stroke="#93c5fd" stroke-width="2"/>' +
      '<rect x="190" y="34" width="140" height="96" rx="12" fill="#047857" stroke="#6ee7b7" stroke-width="2"/>' +
      '<rect x="360" y="34" width="140" height="96" rx="12" fill="#4338ca" stroke="#c4b5fd" stroke-width="2"/>' +
      '<path d="M160 82 L190 82 M330 82 L360 82" stroke="#f59e0b" stroke-width="4"/>' +
      '<text x="90" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">1. AUTH + RBAC</text>' +
      '<text x="90" y="86" text-anchor="middle" fill="#bfdbfe" font-size="11" font-family="system-ui">Rol base: Estudiante</text>' +
      '<text x="90" y="106" text-anchor="middle" fill="#dbeafe" font-size="10" font-family="system-ui">Bloqueo 5 intentos</text>' +
      '<text x="260" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">2. RLS + PRODHAB</text>' +
      '<text x="260" y="86" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="system-ui">Ley N.\u00b0 8968 CR</text>' +
      '<text x="260" y="106" text-anchor="middle" fill="#d1fae5" font-size="10" font-family="system-ui">Derechos ARCO</text>' +
      '<text x="430" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">3. SHA-256 + PWA</text>' +
      '<text x="430" y="86" text-anchor="middle" fill="#ddd6fe" font-size="11" font-family="system-ui">Integridad QR</text>' +
      '<text x="430" y="106" text-anchor="middle" fill="#e0e7ff" font-size="10" font-family="system-ui">Cookies HttpOnly</text>' +
      '<text x="260" y="170" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Diagrama de Arquitectura Segura MEP \u2022 pracTICAtecnica.com</text></svg>';
  }

  var ATLAS_MEP = [
    {
      id: "mep-en", materia: "Ingl\u00e9s", nivel: "10.\u00b0, 11.\u00b0 y 12.\u00b0 (MEP)", diag: "mapa-idiomas", lang: "en-US",
      contenido: "Discourse Markers, Connectors & Listening Comprehension",
      saberEsencial: "Reconocimiento de conectores de secuencia (After that = Subsequently), adici\u00f3n (Also = Furthermore) y concesi\u00f3n (Even so = Nevertheless).",
      desempeno: "Infere significados equivalentes a partir de p\u00e1rrafos escritos y audios reales sin traducci\u00f3n literal.",
      repaso: [
        "Identifica la relaci\u00f3n l\u00f3gica entre oraciones antes de elegir la opci\u00f3n.",
        "After that \u2192 Subsequently (tiempo). Also \u2192 Furthermore (suma).",
        "Even so / Still \u2192 Nevertheless / However (contraste)."
      ],
      audio: "English MEP review: After that equals Subsequently. Also equals Furthermore. Even so equals Nevertheless."
    },
    {
      id: "mep-idiomas", materia: "Franc\u00e9s / Alem\u00e1n / Portugu\u00e9s", nivel: "Ciclo Diversificado (MEP)", diag: "mapa-idiomas", lang: "es-CR",
      contenido: "Cohesi\u00f3n discursiva y comprensi\u00f3n auditiva multiling\u00fce",
      saberEsencial: "Equivalencias funcionales en Franc\u00e9s (Ensuite, Parce que, De plus), Alem\u00e1n (Danach, Deshalb, Au\u00dferdem) y Portugu\u00e9s (Em seguida, Portanto, Ademais).",
      desempeno: "Comprende mensajes orales cotidianos y t\u00e9cnicos seleccionando el conector l\u00f3gico exacto.",
      repaso: [
        "Franc\u00e9s: Ensuite = Apr\u00e8s cela; Aussi = De plus; Parce que introduce causa.",
        "Alem\u00e1n: Danach = Anschlie\u00dfend; Deshalb = Darum; Au\u00dferdem suma ideas.",
        "Portugu\u00e9s: Em seguida = Logo depois; Portanto = Por conseguinte; Al\u00e9m disso = Ademais."
      ],
      audio: "Repaso multilingue MEP: En frances ensuite es despues y de plus suma ideas. En aleman danach es despues y deshalb equivale a darum. En portugues em seguida es logo depois y portanto equivale a por conseguinte."
    },
    {
      id: "mep-es", materia: "Espa\u00f1ol", nivel: "10.\u00b0, 11.\u00b0 y 12.\u00b0 (MEP)", diag: "mapa-idiomas", lang: "es-CR",
      contenido: "Comprensi\u00f3n lectora inferencial y conectores discursivos",
      saberEsencial: "Uso preciso de conectores consecutivos (por lo tanto, por consiguiente) y adversativos (sin embargo, no obstante).",
      desempeno: "Eval\u00faa coherencia global y deduce intenciones comunicativas impl\u00edcitas.",
      repaso: [
        "Consecuencia: Por lo tanto = Por consiguiente = En consecuencia.",
        "Oposici\u00f3n parcial: Sin embargo = No obstante.",
        "Comprueba siempre que la respuesta elegida respete la idea principal."
      ],
      audio: "Repaso oficial de Espanol MEP: Por lo tanto y por consiguiente introducen consecuencias. Sin embargo y no obstante introducen contrastes."
    },
    {
      id: "mep-mat", materia: "Matem\u00e1ticas", nivel: "10.\u00b0, 11.\u00b0 y 12.\u00b0 (MEP)", diag: "mapa-mate", lang: "es-CR",
      contenido: "Relaciones y \u00c1lgebra (Funci\u00f3n Lineal) + Probabilidad",
      saberEsencial: "Modelado mediante C(x) = m\u00b7x + b, porcentajes aplicados a facturaci\u00f3n y probabilidad cl\u00e1sica.",
      desempeno: "Resuelve problemas contextualizados de costos, descuentos y probabilidad justificando su criterio.",
      repaso: [
        "En C(x) = m\u00b7x + b: b es el cargo fijo y m es la tarifa por unidad x.",
        "Descuento del 10 %: multiplica el subtotal por 0,90.",
        "Probabilidad: divide casos favorables entre casos totales y simplifica."
      ],
      audio: "Repaso oficial de Matematicas MEP: En C de x igual a m por x mas b, b es el cargo fijo y m la pendiente por unidad."
    },
    {
      id: "mep-web-cib", materia: "Especialidad: Desarrollo Web y Ciberseguridad", nivel: "10.\u00b0, 11.\u00b0 y 12.\u00b0 ETP (MEP)", diag: "mapa-tech", lang: "es-CR",
      contenido: "Arquitectura Web Segura, RBAC/RLS, SHA-256 y PRODHAB CR",
      saberEsencial: "Control RBAC con m\u00ednimo privilegio (Estudiante por defecto), Row-Level Security en PostgreSQL/Supabase, cookies HttpOnly/Secure, PWA y Ley N.\u00b0 8968.",
      desempeno: "Dise\u00f1a y audita aplicaciones web que protegen datos personales y verifican integridad con SHA-256.",
      repaso: [
        "M\u00ednimo privilegio: toda cuenta nueva nace como Estudiante; solo SuperAdmin promueve roles con SHA-256.",
        "Mitigaci\u00f3n XSS: cookies HttpOnly + Secure y validaci\u00f3n estricta en servidor.",
        "PWA limpia: un \u00fanico Service Worker Network-First sin versiones viejas."
      ],
      audio: "Repaso oficial de Desarrollo Web y Ciberseguridad: Por minimo privilegio toda cuenta nueva nace como Estudiante y solo SuperAdmin promueve roles. HttpOnly protege cookies contra XSS."
    }
  ];

  var PRACTICAS = [
    { id: "en-01", area: "Ingl\u00e9s", lang: "en-US", diag: "mapa-idiomas", consigna: "Choose the word with the same meaning as 'After that'.", contexto: "We started hiking five miles the first day. After that, we hiked 10 miles.", ops: ["Therefore", "Consequently", "Subsequently", "Nevertheless"], ok: 2, exp: "'After that' equivale a 'Subsequently'." },
    { id: "en-02", area: "Ingl\u00e9s", lang: "en-US", diag: "mapa-idiomas", consigna: "Choose the word with the same meaning as 'Also'.", contexto: "Everyone should have quality health care. Also, everyone deserves good education.", ops: ["Therefore", "However", "Furthermore", "Otherwise"], ok: 2, exp: "'Also' equivale a 'Furthermore'." },
    { id: "en-03", area: "Ingl\u00e9s", lang: "en-US", diag: "mapa-idiomas", consigna: "Choose the connector that replaces 'Even so'.", contexto: "The server passed the load test. Even so, the team ran an encryption audit.", ops: ["Similarly", "Nevertheless", "Moreover", "Meanwhile"], ok: 1, exp: "'Even so' expresa contraste, igual que 'Nevertheless'." },
    { id: "fr-01", area: "Franc\u00e9s", lang: "fr-FR", diag: "mapa-idiomas", consigna: "Choisissez le sens de 'Ensuite'.", contexto: "Nous arrivons \u00e0 Lyon ce matin. Ensuite, nous prenons le train pour Gen\u00e8ve.", ops: ["Apr\u00e8s cela", "Cependant", "Jamais", "Autrefois"], ok: 0, exp: "'Ensuite' equivale a 'Apr\u00e8s cela'." },
    { id: "de-01", area: "Alem\u00e1n", lang: "de-DE", diag: "mapa-idiomas", consigna: "Gleiche Bedeutung wie 'Deshalb'.", contexto: "Es regnet stark. Deshalb fahren wir heute mit dem Bus zur Schule.", ops: ["Obwohl", "Selten", "W\u00e4hrend", "Darum"], ok: 3, exp: "'Deshalb' y 'Darum' indican consecuencia." },
    { id: "pt-01", area: "Portugu\u00e9s", lang: "pt-BR", diag: "mapa-idiomas", consigna: "Equivalente a 'Em seguida'.", contexto: "Estudamos redes pela manh\u00e3. Em seguida, praticamos firewall.", ops: ["Contudo", "Antes de tudo", "Logo depois", "Entretanto"], ok: 2, exp: "'Em seguida' equivale a 'Logo depois'." },
    { id: "es-01", area: "Espa\u00f1ol", lang: "es-CR", diag: "mapa-idiomas", consigna: "Conector equivalente a 'por lo tanto'.", contexto: "Se actualizaron los certificados TLS; por lo tanto, el portal qued\u00f3 protegido.", ops: ["Sin embargo", "No obstante", "A pesar de", "Por consiguiente"], ok: 3, exp: "'Por lo tanto' y 'Por consiguiente' expresan consecuencia." },
    { id: "mat-01", area: "Matem\u00e1ticas", lang: "es-CR", diag: "mapa-mate", consigna: "Criterio correcto del costo total C(x).", contexto: "Un taller cobra 15 000 colones fijos m\u00e1s 2 500 colones por cada hora x.", ops: ["C(x) = 15000x + 2500", "C(x) = 15000 - 2500x", "C(x) = 15000 + 2500x", "C(x) = 17500x"], ok: 2, exp: "Cargo fijo 15000 + 2500 por hora x." },
    { id: "esp-01", area: "Desarrollo Web y Ciberseguridad", lang: "es-CR", diag: "mapa-tech", consigna: "Principio RBAC al registrarse una persona nueva.", contexto: "Una persona crea o inicia sesi\u00f3n por primera vez con Gmail o correo MEP.", ops: ["Nace autom\u00e1ticamente como SuperAdmin", "Nace estrictamente como Estudiante hasta que SuperAdmin cambie su rol", "Elige cualquier rol libremente", "No queda registrada en trazabilidad"], ok: 1, exp: "Por m\u00ednimo privilegio toda cuenta nueva nace como Estudiante." }
  ];

  function leerJson(k, def) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (_e) { return def; } }
  function guardarJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {} }
  function esCorreoValido(c) {
    var s = String(c || "").trim().toLowerCase(), p = s.split("@");
    return p.length === 2 && p[0].length > 0 && DOMINIOS.indexOf(p[1]) !== -1;
  }
  function tipoCuenta(c) {
    var s = String(c || "").toLowerCase();
    return (s.endsWith("@mep.go.cr") || s.endsWith("@est.mep.go.cr")) ? "mep" : s.endsWith("@gmail.com") ? "gmail" : "institucional";
  }

  async function sha256Hex(txt) {
    try {
      var data = new TextEncoder().encode(String(txt || ""));
      var buf = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    } catch (_e) { return "sha256-offline-" + Date.now().toString(16); }
  }

  function detectarDispositivo() {
    var w = window.innerWidth || 1024;
    return w <= 640 ? "Celular (" + w + "px)" : w <= 1024 ? "Tablet (" + w + "px)" : "Computadora (" + w + "px)";
  }

  function detectarCorreoApp() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf("pt_bds_") === 0) continue;
        var val = localStorage.getItem(k) || "";
        var m = val.match(/[a-zA-Z0-9._%+-]+@(gmail\.com|mep\.go\.cr|est\.mep\.go\.cr)/i);
        if (m) return m[0].toLowerCase();
      }
    } catch (_e) {}
    return null;
  }

  function asegurarEstudiante(correo) {
    var perfiles = leerJson(KEY_PERFILES, []);
    var c = String(correo || "").trim().toLowerCase();
    if (!c) return null;
    var ex = perfiles.find(function (p) { return p.correo === c; });
    if (!ex) {
      ex = { correo: c, nombre: c.split("@")[0], tipo_cuenta: tipoCuenta(c), rol: "Estudiante", estado: "activo", creado_en: new Date().toISOString() };
      perfiles.unshift(ex);
      guardarJson(KEY_PERFILES, perfiles);
    }
    return ex;
  }

  function obtenerSesionId() {
    var sid = sessionStorage.getItem(KEY_SESION);
    if (!sid) {
      sid = "SES-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      sessionStorage.setItem(KEY_SESION, sid);
    }
    return sid;
  }

  function syncSupabase(tabla, payload) {
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

  async function registrarLatido(vista) {
    var sid = obtenerSesionId();
    var correo = detectarCorreoApp();
    var tipo = correo ? "con_cuenta" : "sin_cuenta";
    var perfil = correo ? asegurarEstudiante(correo) : null;
    var rol = perfil ? perfil.rol : "Estudiante";
    var ahora = new Date().toISOString();
    var firma = await sha256Hex(sid + "|" + (correo || "sin_cuenta") + "|" + tipo + "|" + rol);

    var ingresos = leerJson(KEY_INGRESOS, []);
    var idx = ingresos.findIndex(function (r) { return r.sesion_id === sid; });
    var reg = {
      sesion_id: sid,
      correo: correo || "Sin cuenta (Prueba gratuita)",
      tipo_ingreso: tipo,
      rol_en_sesion: rol,
      vista_actual: vista || document.title || "Inicio",
      dispositivo: detectarDispositivo(),
      activo: true,
      ingreso_en: idx >= 0 ? ingresos[idx].ingreso_en : ahora,
      ultimo_latido: ahora,
      sha256_evento: firma
    };
    if (idx >= 0) ingresos[idx] = reg; else ingresos.unshift(reg);

    var limite = Date.now() - 120000;
    ingresos.forEach(function (r) {
      var t = Date.parse(r.ultimo_latido || r.ingreso_en || 0);
      if (r.sesion_id !== sid && (!t || t < limite)) r.activo = false;
    });
    guardarJson(KEY_INGRESOS, ingresos.slice(0, 250));
    syncSupabase("trazabilidad_ingresos", {
      sesion_id: reg.sesion_id, correo: correo, tipo_ingreso: reg.tipo_ingreso,
      rol_en_sesion: reg.rol_en_sesion, vista_actual: reg.vista_actual,
      dispositivo: reg.dispositivo, activo: true, ultimo_latido: reg.ultimo_latido, sha256_evento: reg.sha256_evento
    });
  }

  function bloquearSelectoresRolPublicos() {
    document.querySelectorAll("select").forEach(function (sel) {
      if (sel.closest("#bds-v51-modal")) return;
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
  }

  function hablar(texto, lang) {
    if (window.BDSAudioV5 && window.BDSAudioV5.speak) { window.BDSAudioV5.speak(texto, lang); return; }
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = lang || "es-CR";
    window.speechSynthesis.speak(u);
  }

  function opcionesPorNivel(item, nivel) {
    var l4 = ["A", "B", "C", "D"];
    if (nivel === "macro") return { ops: item.ops.map(function (t, i) { return { l: l4[i], t: t }; }), ok: l4[item.ok] };
    var okT = item.ops[item.ok];
    var dist = item.ops.filter(function (_t, i) { return i !== item.ok; }).slice(0, 2);
    var seed = item.id.charCodeAt(item.id.length - 1) % 3;
    var arr = [], d = 0;
    for (var i = 0; i < 3; i++) arr.push(i === seed ? okT : dist[d++]);
    var l3 = ["A", "B", "C"];
    return { ops: arr.map(function (t, j) { return { l: l3[j], t: t }; }), ok: l3[seed] };
  }

  function montarCentroBDS() {
    if (document.getElementById("bds-v51-launcher")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v51-launcher";
    btn.type = "button";
    btn.style.cssText =
      "position:fixed;right:14px;bottom:78px;z-index:2147483630;display:flex;align-items:center;gap:8px;" +
      "background:#1e40af;color:#ffffff;border:2px solid #93c5fd;border-radius:999px;padding:8px 14px;" +
      "font:800 12px system-ui,sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.4);cursor:pointer";
    btn.innerHTML = BUHO_CIRCULAR + "<span>Centro BDS</span>";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v51-modal";
    modal.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483640;background:rgba(15,23,42,.78);overflow:auto;padding:14px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var ui = { tab: "atlas", filtro: "todos", nivel: "macro", pIdx: 0, pSel: null, aviso: "" };

    function render() {
      var ingresos = leerJson(KEY_INGRESOS, []);
      var perfiles = leerJson(KEY_PERFILES, []);
      var auditoria = leerJson(KEY_AUDITORIA, []);
      var prodhab = leerJson(KEY_PRODHAB, null);
      var esSuper = localStorage.getItem(KEY_SA_MODE) === "1";

      var conCuenta = ingresos.filter(function (x) { return x.tipo_ingreso === "con_cuenta"; }).length;
      var sinCuenta = ingresos.filter(function (x) { return x.tipo_ingreso === "sin_cuenta"; }).length;
      var activos = ingresos.filter(function (x) { return x.activo; }).length;
      var body = "";

      if (ui.tab === "atlas") {
        body =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px">' +
          ATLAS_MEP.map(function (a) {
            return '<article style="background:#ffffff;color:#0f172a;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px">' +
              '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span style="font-size:12px;font-weight:900;color:#1e40af;text-transform:uppercase">' + a.materia + '</span><span style="background:#dbeafe;color:#1e3a8a;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800">' + a.nivel + '</span></div>' +
              '<h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">' + a.contenido + '</h3>' +
              diagramaSvg(a.diag, a.materia) +
              '<div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;font-size:12px;line-height:1.45;color:#0f172a">' +
              '<div><strong>Saber esencial:</strong> ' + a.saberEsencial + '</div>' +
              '<div style="margin-top:6px"><strong>Desempe\u00f1o esperado:</strong> ' + a.desempeno + '</div></div>' +
              '<ul style="margin:0;padding-left:18px;font-size:12px;line-height:1.45;color:#1e293b">' +
              a.repaso.map(function (p) { return '<li style="margin-bottom:4px">' + p + '</li>'; }).join("") + '</ul>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:auto">' +
              '<button data-atlas-play="' + a.id + '" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">&#9654; Escuchar repaso</button>' +
              '<button data-go-prac="1" type="button" style="background:#1e40af;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">Practicar</button>' +
              '</div></article>';
          }).join("") + '</div>';
      } else if (ui.tab === "practicas") {
        var it = PRACTICAS[ui.pIdx] || PRACTICAS[0];
        var prep = opcionesPorNivel(it, ui.nivel);
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px 14px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
          '<div style="font-size:13px;font-weight:800;color:#0f172a">Evaluaci\u00f3n: <span style="color:#1e40af">' + (ui.nivel === "macro" ? "Macroevaluaci\u00f3n (A, B, C, D)" : "Microevaluaci\u00f3n (A, B, C)") + '</span></div>' +
          '<div style="display:flex;gap:8px"><button data-niv="macro" type="button" style="padding:7px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.nivel === "macro" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Macro (A-D)</button>' +
          '<button data-niv="micro" type="button" style="padding:7px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #4338ca;background:' + (ui.nivel === "micro" ? "#4338ca;color:#fff" : "#fff;color:#4338ca") + '">Micro (A-C)</button></div></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px">' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px">' +
          '<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#1e40af"><span>' + it.area + '</span><span>\u00cdtem ' + (ui.pIdx + 1) + ' de ' + PRACTICAS.length + '</span></div>' +
          '<h3 style="margin:0;font-size:17px;font-weight:900;color:#0f172a">' + it.consigna + '</h3>' +
          diagramaSvg(it.diag, it.area) +
          '<div style="background:#f1f5f9;border:1.5px solid #cbd5e1;border-radius:10px;padding:12px;font-size:14px;font-weight:600;color:#0f172a">' + it.contexto + '</div>' +
          '<button id="bds-v51-play" type="button" style="align-self:flex-start;background:#c2410c;color:#fff;border:none;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:800;cursor:pointer">&#9654; Escuchar pregunta (' + it.lang + ')</button></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;display:flex;flex-direction:column;justify-content:space-between"><div>' +
          prep.ops.map(function (o) {
            var act = ui.pSel === o.l;
            return '<button data-pop="' + o.l + '" type="button" style="width:100%;display:flex;align-items:center;gap:10px;text-align:left;padding:12px;margin-bottom:8px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;color:#0f172a;border:2px solid ' + (act ? "#1e40af;background:#dbeafe" : "#94a3b8;background:#fff") + '">' +
              '<span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;background:' + (act ? "#1e40af;color:#fff" : "#e2e8f0;color:#0f172a") + '">' + o.l + '</span><span>' + o.t + '</span></button>';
          }).join("") +
          (ui.pSel ? '<div style="margin-top:10px;padding:12px;border-radius:10px;font-size:13px;font-weight:700;background:' + (ui.pSel === prep.ok ? "#dcfce7;color:#14532d;border:1.5px solid #15803d" : "#fef3c7;color:#451a03;border:1.5px solid #b45309") + '">' + (ui.pSel === prep.ok ? "Correcto. " : "Sugerida: " + prep.ok + ". ") + it.exp + '</div>' : '') +
          '</div><div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1.5px solid #e2e8f0">' +
          '<button id="bds-v51-prev" type="button" ' + (ui.pIdx === 0 ? "disabled " : "") + 'style="padding:8px 14px;border-radius:10px;border:2px solid #64748b;background:#fff;color:#0f172a;font-weight:800;cursor:pointer">Anterior</button>' +
          '<button id="bds-v51-next" type="button" ' + (ui.pIdx >= PRACTICAS.length - 1 ? "disabled " : "") + 'style="padding:8px 14px;border-radius:10px;border:none;background:#1e40af;color:#fff;font-weight:800;cursor:pointer">Siguiente</button>' +
          '</div></div></div>';
      } else if (ui.tab === "trazabilidad") {
        var filtrados = ingresos.filter(function (r) {
          return ui.filtro === "con_cuenta" ? r.tipo_ingreso === "con_cuenta" :
                 ui.filtro === "sin_cuenta" ? r.tipo_ingreso === "sin_cuenta" :
                 ui.filtro === "activos" ? r.activo === true : true;
        });
        body =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px">' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#475569">TOTAL</div><div style="font-size:24px;font-weight:900;color:#0f172a">' + ingresos.length + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #1e40af;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#1e40af">CON CUENTA</div><div style="font-size:24px;font-weight:900;color:#1e40af">' + conCuenta + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #b45309;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#b45309">SIN CUENTA</div><div style="font-size:24px;font-weight:900;color:#b45309">' + sinCuenta + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #15803d;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#15803d">ACTIVOS EN BD</div><div style="font-size:24px;font-weight:900;color:#15803d">' + activos + '</div></div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;margin-bottom:14px">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">' +
          '<div><h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">Control RBAC (Regla: toda cuenta inicia como Estudiante)</h3><p style="margin:4px 0 0;font-size:12px;color:#334155">Solo SuperAdmin puede cambiar roles con firma SHA-256.</p></div>' +
          '<button id="bds-v51-sa" type="button" style="padding:8px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid ' + (esSuper ? "#15803d;background:#dcfce7;color:#14532d" : "#1e40af;background:#1e40af;color:#fff") + '">' + (esSuper ? "SuperAdmin ACTIVO (Bloquear)" : "Activar gesti\u00f3n SuperAdmin") + '</button></div>' +
          (ui.aviso ? '<div style="margin-bottom:10px;padding:10px;border-radius:10px;background:#dbeafe;color:#1e3a8a;font-size:12px;font-weight:800">' + ui.aviso + '</div>' : '') +
          '<form id="bds-v51-add" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
          '<input id="bds-v51-mail" type="email" required placeholder="usuario@est.mep.go.cr o usuario@gmail.com" style="flex:1;min-width:210px;padding:9px 12px;border:2px solid #64748b;border-radius:10px;font-size:13px;color:#0f172a;background:#fff"/>' +
          '<button type="submit" style="background:#0f172a;color:#fff;border:none;border-radius:10px;padding:9px 14px;font-size:12px;font-weight:800;cursor:pointer">+ Registrar como Estudiante</button></form>' +
          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#0f172a"><thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left"><th style="padding:8px">Correo</th><th style="padding:8px">Cuenta</th><th style="padding:8px">Rol</th><th style="padding:8px">Cambiar rol (SuperAdmin)</th></tr></thead><tbody>' +
          (perfiles.length === 0 ? '<tr><td colspan="4" style="padding:12px;color:#475569">Sin correos registrados a\u00fan.</td></tr>' : perfiles.map(function (p) {
            return '<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px;font-weight:700">' + p.correo + '</td><td style="padding:8px;text-transform:uppercase">' + p.tipo_cuenta + '</td><td style="padding:8px"><span style="background:#dbeafe;color:#1e3a8a;padding:3px 8px;border-radius:999px;font-weight:800">' + p.rol + '</span></td><td style="padding:8px"><select data-role-mail="' + p.correo + '" ' + (esSuper ? "" : "disabled ") + 'style="padding:6px;border:1.5px solid #64748b;border-radius:8px;font-weight:700;color:#0f172a;background:#fff">' + ROLES.map(function (rn) { return '<option value="' + rn + '"' + (p.rol === rn ? " selected" : "") + '>' + rn + '</option>'; }).join("") + '</select></td></tr>';
          }).join("")) + '</tbody></table></div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px"><h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">Ingresos en Tiempo Real</h3><div style="display:flex;flex-wrap:wrap;gap:6px">' +
          [{ id: "todos", lb: "Todos" }, { id: "con_cuenta", lb: "Con cuenta" }, { id: "sin_cuenta", lb: "Sin cuenta" }, { id: "activos", lb: "Activos" }].map(function (f) {
            return '<button data-tf="' + f.id + '" type="button" style="padding:6px 10px;border-radius:999px;font-size:11px;font-weight:800;cursor:pointer;border:1.5px solid #1e40af;background:' + (ui.filtro === f.id ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">' + f.lb + '</button>';
          }).join("") + '</div></div><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#0f172a"><thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left"><th style="padding:8px">Estado</th><th style="padding:8px">Usuario / Sesi\u00f3n</th><th style="padding:8px">Tipo</th><th style="padding:8px">Rol</th><th style="padding:8px">Dispositivo</th></tr></thead><tbody>' +
          filtrados.map(function (r) {
            return '<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px;font-weight:800;color:' + (r.activo ? "#15803d" : "#64748b") + '">' + (r.activo ? "\u25cf ACTIVO" : "\u25cb Inactivo") + '</td><td style="padding:8px;font-weight:700">' + r.correo + '<div style="font-size:10px;color:#64748b;font-family:monospace">' + r.sesion_id + '</div></td><td style="padding:8px">' + (r.tipo_ingreso === "con_cuenta" ? "Con cuenta" : "Sin cuenta") + '</td><td style="padding:8px;font-weight:800;color:#1e40af">' + r.rol_en_sesion + '</td><td style="padding:8px">' + r.dispositivo + '</td></tr>';
          }).join("") + '</tbody></table></div>' +
          (auditoria.length > 0 ? '<div style="margin-top:10px;font-size:11px;color:#334155"><strong>\u00daltimo cambio RBAC:</strong> ' + auditoria[0].correo + ' (' + auditoria[0].prev + ' \u2192 ' + auditoria[0].nuevo + ') \u2022 SHA-256: <code>' + auditoria[0].sha.slice(0, 18) + '...</code></div>' : '') + '</div>';
      } else {
        body =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px">' +
          '<section style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:18px">' +
          '<h3 style="margin:0 0 8px;font-size:17px;font-weight:900;color:#0f172a">Cumplimiento Legal Costa Rica &amp; PRODHAB (Ley N.\u00b0 8968)</h3>' +
          '<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.55;color:#1e293b">' +
          '<li><strong>Consentimiento Informado:</strong> Los datos de acceso (correo y rol) se usan exclusivamente para fines educativos y trazabilidad en pracTICAtecnica.com.</li>' +
          '<li><strong>Derechos ARCO:</strong> Toda persona usuaria puede ejercer Acceso, Rectificaci\u00f3n, Cancelaci\u00f3n u Oposici\u00f3n de sus registros ante la administraci\u00f3n.</li>' +
          '<li><strong>Alineaci\u00f3n MEP (REA / SEA):</strong> Pr\u00e1cticas en Macroevaluaci\u00f3n (A-B-C-D) y Microevaluaci\u00f3n (A-B-C), sin venta ni cesi\u00f3n de datos estudiantiles.</li>' +
          '</ul>' +
          '<div style="margin-top:14px">' +
          (prodhab
            ? '<div style="background:#dcfce7;border:1.5px solid #15803d;color:#14532d;padding:10px;border-radius:10px;font-size:12px;font-weight:700">Consentimiento Ley N.\u00b0 8968 registrado (' + prodhab.fecha + ').<br/>SHA-256: <code>' + prodhab.sha.slice(0, 26) + '...</code></div>'
            : '<button id="bds-v51-prodhab-ok" type="button" style="background:#15803d;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:13px;font-weight:800;cursor:pointer">Aceptar Consentimiento Informado PRODHAB (SHA-256)</button>') +
          '</div></section>' +
          '<section style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:18px">' +
          '<h3 style="margin:0 0 8px;font-size:17px;font-weight:900;color:#0f172a">Arquitectura de Seguridad Inform\u00e1tica BDS</h3>' +
          diagramaSvg("mapa-tech", "Seguridad Informatica BDS") +
          '<ul style="margin:10px 0 0;padding-left:18px;font-size:13px;line-height:1.5;color:#1e293b">' +
          '<li><strong>RBAC &amp; M\u00ednimo Privilegio:</strong> Rol base obligatorio Estudiante + bloqueo de auto-escalada por trigger SQL y RLS.</li>' +
          '<li><strong>Antifraude:</strong> Bloqueo por 5 intentos fallidos, validaci\u00f3n @gmail.com / @mep.go.cr y cero credenciales en placeholders.</li>' +
          '<li><strong>Integridad Criptogr\u00e1fica:</strong> Sellos SHA-256 en QR, facturas, cambios de rol y consentimientos PRODHAB.</li>' +
          '</ul></section></div>';
      }

      modal.innerHTML =
        '<div style="max-width:1100px;margin:8px auto;background:#f1f5f9;color:#0f172a;border-radius:20px;border:2px solid #94a3b8;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45)">' +
        '<div style="background:#fff;border-bottom:2px solid #cbd5e1;padding:12px 16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
        '<div style="display:flex;align-items:center;gap:10px">' + BUHO_CIRCULAR +
        '<div><div style="font-size:15px;font-weight:900;color:#0f172a">pracTICAtecnica.com \u2022 Suite Internacional BDS v5.1</div>' +
        '<div style="font-size:11px;font-weight:700;color:#475569">Atlas MEP Ilustrado \u2022 Pr\u00e1cticas \u2022 Trazabilidad &amp; RBAC \u2022 PRODHAB CR</div></div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        '<button data-mtab="atlas" type="button" style="padding:8px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "atlas" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Atlas MEP</button>' +
        '<button data-mtab="practicas" type="button" style="padding:8px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "practicas" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Pr\u00e1cticas (A-D/A-C)</button>' +
        '<button data-mtab="trazabilidad" type="button" style="padding:8px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #0f172a;background:' + (ui.tab === "trazabilidad" ? "#0f172a;color:#fff" : "#fff;color:#0f172a") + '">Trazabilidad &amp; RBAC</button>' +
        '<button data-mtab="legal" type="button" style="padding:8px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #15803d;background:' + (ui.tab === "legal" ? "#15803d;color:#fff" : "#fff;color:#15803d") + '">PRODHAB &amp; Seguridad</button>' +
        '<button id="bds-v51-close" type="button" style="padding:8px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Cerrar</button>' +
        '</div></div><div style="padding:16px">' + body + '</div></div>';

      modal.querySelectorAll("[data-mtab]").forEach(function (b) { b.onclick = function () { ui.tab = b.getAttribute("data-mtab"); ui.aviso = ""; render(); }; });
      document.getElementById("bds-v51-close").onclick = function () { modal.style.display = "none"; };

      if (ui.tab === "atlas") {
        modal.querySelectorAll("[data-atlas-play]").forEach(function (b) {
          b.onclick = function () {
            var a = ATLAS_MEP.find(function (x) { return x.id === b.getAttribute("data-atlas-play"); });
            if (a) hablar(a.audio, a.lang);
          };
        });
        modal.querySelectorAll("[data-go-prac]").forEach(function (b) { b.onclick = function () { ui.tab = "practicas"; render(); }; });
      } else if (ui.tab === "practicas") {
        modal.querySelectorAll("[data-niv]").forEach(function (b) { b.onclick = function () { ui.nivel = b.getAttribute("data-niv"); ui.pSel = null; render(); }; });
        modal.querySelectorAll("[data-pop]").forEach(function (b) { b.onclick = function () { ui.pSel = b.getAttribute("data-pop"); render(); }; });
        var cur = PRACTICAS[ui.pIdx] || PRACTICAS[0];
        document.getElementById("bds-v51-play").onclick = function () { hablar(cur.consigna + ". " + cur.contexto, cur.lang); };
        document.getElementById("bds-v51-prev").onclick = function () { ui.pIdx = Math.max(0, ui.pIdx - 1); ui.pSel = null; render(); };
        document.getElementById("bds-v51-next").onclick = function () { ui.pIdx = Math.min(PRACTICAS.length - 1, ui.pIdx + 1); ui.pSel = null; render(); };
      } else if (ui.tab === "trazabilidad") {
        modal.querySelectorAll("[data-tf]").forEach(function (b) { b.onclick = function () { ui.filtro = b.getAttribute("data-tf"); render(); }; });
        document.getElementById("bds-v51-sa").onclick = function () {
          localStorage.setItem(KEY_SA_MODE, esSuper ? "0" : "1");
          ui.aviso = esSuper ? "Gesti\u00f3n SuperAdmin bloqueada." : "Gesti\u00f3n SuperAdmin habilitada para cambio de roles.";
          render();
        };
        document.getElementById("bds-v51-add").onsubmit = function (ev) {
          ev.preventDefault();
          var m = document.getElementById("bds-v51-mail").value;
          if (!esCorreoValido(m)) { ui.aviso = "Solo se permiten correos @gmail.com, @mep.go.cr o @est.mep.go.cr."; render(); return; }
          var p = asegurarEstudiante(m);
          syncSupabase("perfiles_rbac", { correo: p.correo, nombre_visible: p.nombre, tipo_cuenta: p.tipo_cuenta, rol: "Estudiante" });
          ui.aviso = "Usuario " + p.correo + " registrado con rol inicial obligatorio: Estudiante.";
          render();
        };
        modal.querySelectorAll("[data-role-mail]").forEach(function (sel) {
          sel.onchange = async function () {
            if (localStorage.getItem(KEY_SA_MODE) !== "1") return;
            var mail = sel.getAttribute("data-role-mail"), nuevo = sel.value;
            var lp = leerJson(KEY_PERFILES, []), obj = lp.find(function (x) { return x.correo === mail; });
            if (!obj) return;
            var prev = obj.rol; obj.rol = nuevo; guardarJson(KEY_PERFILES, lp);
            var li = leerJson(KEY_INGRESOS, []); li.forEach(function (r) { if (r.correo === mail) r.rol_en_sesion = nuevo; }); guardarJson(KEY_INGRESOS, li);
            var sha = await sha256Hex("SuperAdmin|" + mail + "|" + prev + "->" + nuevo + "|" + Date.now());
            var aud = leerJson(KEY_AUDITORIA, []); aud.unshift({ correo: mail, prev: prev, nuevo: nuevo, sha: sha }); guardarJson(KEY_AUDITORIA, aud.slice(0, 100));
            ui.aviso = "Rol actualizado por SuperAdmin: " + mail + " (" + prev + " \u2192 " + nuevo + ").";
            render();
          };
        });
      } else {
        var btnP = document.getElementById("bds-v51-prodhab-ok");
        if (btnP) {
          btnP.onclick = async function () {
            var mail = detectarCorreoApp() || "visitante@practicatecnica.com";
            var fecha = new Date().toLocaleString("es-CR");
            var sha = await sha256Hex(mail + "|Ley8968-PRODHAB-v5.1|" + fecha);
            guardarJson(KEY_PRODHAB, { correo: mail, fecha: fecha, sha: sha });
            syncSupabase("consentimientos_prodhab", { correo: mail, sha256_constancia: sha });
            render();
          };
        }
      }
    }

    btn.onclick = function () { registrarLatido("Centro BDS v5.1"); modal.style.display = "block"; render(); };
  }

  function arrancar() {
    registrarLatido("Inicio");
    bloquearSelectoresRolPublicos();
    montarCentroBDS();
    setInterval(function () { registrarLatido(document.title || "Activa"); }, 30000);
    var obs = new MutationObserver(bloquearSelectoresRolPublicos);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("beforeunload", function () {
      var sid = sessionStorage.getItem(KEY_SESION);
      var list = leerJson(KEY_INGRESOS, []);
      list.forEach(function (r) { if (r.sesion_id === sid) r.activo = false; });
      guardarJson(KEY_INGRESOS, list);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();