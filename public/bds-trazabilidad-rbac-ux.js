(function () {
  "use strict";
  if (window.__BDS_TRAZA_RBAC_UX_V41__) return;
  window.__BDS_TRAZA_RBAC_UX_V41__ = true;

  var ROLES_OFICIALES = ["Estudiante", "Padre/Madre", "Auxiliar", "Docente", "Jefatura", "SuperAdmin"];
  var DOMINIOS_CUENTA = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
  var KEY_PERFILES = "pt_bds_perfiles_rbac_v41";
  var KEY_INGRESOS = "pt_bds_trazabilidad_v41";
  var KEY_AUDITORIA = "pt_bds_auditoria_roles_v41";
  var KEY_SESION_ACTUAL = "pt_bds_sesion_actual_v41";
  var KEY_SUPERADMIN_FLAG = "pt_bds_superadmin_activo_v41";

  var BUHO_CIRCULAR =
    '<svg viewBox="0 0 128 128" width="32" height="32" aria-label="B\u00faho Azul Circular" style="display:block;flex-shrink:0">' +
    '<defs><radialGradient id="bdsOwlMenu" cx="50%" cy="38%" r="60%">' +
    '<stop offset="0%" stop-color="#3b82f6"/><stop offset="65%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e3a8a"/>' +
    '</radialGradient></defs>' +
    '<circle cx="64" cy="64" r="60" fill="url(#bdsOwlMenu)" stroke="#93c5fd" stroke-width="4"/>' +
    '<path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="44" cy="63" r="18" fill="#ffffff"/><circle cx="84" cy="63" r="18" fill="#ffffff"/>' +
    '<circle cx="46" cy="63" r="9" fill="#0f172a"/><circle cx="82" cy="63" r="9" fill="#0f172a"/>' +
    '<circle cx="49" cy="59" r="3.2" fill="#ffffff"/><circle cx="85" cy="59" r="3.2" fill="#ffffff"/>' +
    '<polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';

  // Ilustraciones SVG limpias (marca blanca pracTICAtecnica.com) para Resumenes y Practicas
  function svgIlustracion(tipo, titulo) {
    if (tipo === "idiomas") {
      return '<svg viewBox="0 0 480 180" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
        '<rect width="480" height="180" fill="#0f172a"/>' +
        '<circle cx="95" cy="90" r="52" fill="#1d4ed8" opacity="0.9"/>' +
        '<circle cx="240" cy="90" r="52" fill="#0284c7" opacity="0.9"/>' +
        '<circle cx="385" cy="90" r="52" fill="#4338ca" opacity="0.9"/>' +
        '<path d="M147 90 L188 90 M292 90 L333 90" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>' +
        '<text x="95" y="95" text-anchor="middle" fill="#fff" font-size="14" font-weight="800" font-family="system-ui">SECUENCIA</text>' +
        '<text x="240" y="95" text-anchor="middle" fill="#fff" font-size="14" font-weight="800" font-family="system-ui">ADICI\u00d3N</text>' +
        '<text x="385" y="95" text-anchor="middle" fill="#fff" font-size="14" font-weight="800" font-family="system-ui">CONTRASTE</text>' +
        '<text x="240" y="164" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="system-ui">Mapa visual de conectores \u2022 pracTICAtecnica.com</text></svg>';
    }
    if (tipo === "mate") {
      return '<svg viewBox="0 0 480 180" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
        '<rect width="480" height="180" fill="#0f172a"/>' +
        '<line x1="60" y1="145" x2="430" y2="145" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<line x1="90" y1="22" x2="90" y2="155" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<line x1="90" y1="120" x2="390" y2="38" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round"/>' +
        '<circle cx="90" cy="120" r="6" fill="#f59e0b"/><circle cx="240" cy="79" r="6" fill="#22c55e"/><circle cx="390" cy="38" r="6" fill="#f59e0b"/>' +
        '<text x="104" y="132" fill="#fde68a" font-size="12" font-weight="700" font-family="system-ui">b = cargo fijo (0, b)</text>' +
        '<text x="252" y="75" fill="#86efac" font-size="13" font-weight="800" font-family="system-ui">C(x) = m\u00b7x + b</text>' +
        '<text x="240" y="168" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="system-ui">Modelo lineal aplicado y probabilidad \u2022 pracTICAtecnica.com</text></svg>';
    }
    return '<svg viewBox="0 0 480 180" style="width:100%;height:auto;border-radius:12px;display:block" role="img" aria-label="' + titulo + '">' +
      '<rect width="480" height="180" fill="#0f172a"/>' +
      '<rect x="34" y="42" width="118" height="80" rx="12" fill="#1e40af" stroke="#93c5fd" stroke-width="2"/>' +
      '<rect x="182" y="42" width="118" height="80" rx="12" fill="#047857" stroke="#6ee7b7" stroke-width="2"/>' +
      '<rect x="330" y="42" width="118" height="80" rx="12" fill="#4338ca" stroke="#c4b5fd" stroke-width="2"/>' +
      '<path d="M152 82 L182 82 M300 82 L330 82" stroke="#f59e0b" stroke-width="4"/>' +
      '<text x="93" y="78" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui">CLIENTE PWA</text>' +
      '<text x="93" y="98" text-anchor="middle" fill="#bfdbfe" font-size="11" font-family="system-ui">HTTPS + HttpOnly</text>' +
      '<text x="241" y="78" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui">RBAC + RLS</text>' +
      '<text x="241" y="98" text-anchor="middle" fill="#a7f3d0" font-size="11" font-family="system-ui">Rol: Estudiante</text>' +
      '<text x="389" y="78" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui">SHA-256</text>' +
      '<text x="389" y="98" text-anchor="middle" fill="#ddd6fe" font-size="11" font-family="system-ui">Integridad QR</text>' +
      '<text x="240" y="162" text-anchor="middle" fill="#cbd5e1" font-size="12" font-family="system-ui">Arquitectura Web &amp; Ciberseguridad \u2022 pracTICAtecnica.com</text></svg>';
  }

  var RESUMENES = [
    {
      id: "res-en", area: "Ingl\u00e9s", lang: "en-US", ilus: "idiomas",
      titulo: "Conectores clave en comprensi\u00f3n lectora y auditiva",
      puntos: [
        "Secuencia temporal: After that = Subsequently / Afterwards (indican qu\u00e9 pas\u00f3 despu\u00e9s).",
        "Adici\u00f3n de ideas: Also = Furthermore / Moreover (suman un argumento en la misma direcci\u00f3n).",
        "Contraste o concesi\u00f3n: Even so / Although = Nevertheless / However (introducen un giro opuesto).",
        "Causa y consecuencia: Therefore / Consequently conectan un hecho con su resultado l\u00f3gico."
      ],
      audio: "Key English connectors: After that means Subsequently. Also means Furthermore. Even so means Nevertheless. Therefore introduces a logical consequence."
    },
    {
      id: "res-fr-de-pt", area: "Franc\u00e9s / Alem\u00e1n / Portugu\u00e9s", lang: "es-CR", ilus: "idiomas",
      titulo: "Puente r\u00e1pido de conectores multiling\u00fces",
      puntos: [
        "Franc\u00e9s: Ensuite (despu\u00e9s), Parce que (causa), Aussi / De plus (adem\u00e1s).",
        "Alem\u00e1n: Danach (despu\u00e9s), Deshalb / Darum (por eso), Au\u00dferdem (adem\u00e1s).",
        "Portugu\u00e9s: Em seguida / Logo depois (despu\u00e9s), Portanto / Por conseguinte (conclusi\u00f3n), Al\u00e9m disso / Ademais (adici\u00f3n)."
      ],
      audio: "Resumen multilingue: En frances, ensuite es despues y de plus es ademas. En aleman, danach es despues y deshalb equivale a darum. En portugues, em seguida es logo depois y portanto equivale a por conseguinte."
    },
    {
      id: "res-es", area: "Espa\u00f1ol", lang: "es-CR", ilus: "idiomas",
      titulo: "Cohesi\u00f3n textual y conectores discursivos",
      puntos: [
        "Consecutivos: Por lo tanto, por consiguiente y en consecuencia se\u00f1alan el resultado.",
        "Adversativos: Sin embargo y no obstante introducen una restricci\u00f3n sin anular lo anterior.",
        "Inferencia: Identifica siempre el prop\u00f3sito central del p\u00e1rrafo antes de leer las opciones."
      ],
      audio: "Resumen de Espanol: Por lo tanto y por consiguiente expresan consecuencia. Sin embargo y no obstante expresan contraste u oposicion."
    },
    {
      id: "res-mat", area: "Matem\u00e1ticas", lang: "es-CR", ilus: "mate",
      titulo: "Funci\u00f3n lineal, porcentajes y probabilidad",
      puntos: [
        "Funci\u00f3n lineal C(x) = m\u00b7x + b: b es el monto fijo inicial; m es la tasa por cada unidad o hora x.",
        "Descuentos: Multiplica por (1 - descuento). Ejemplo: 10 % de descuento equivale a multiplicar por 0,90.",
        "Probabilidad cl\u00e1sica: P(A) = casos favorables / casos totales, simplificando siempre la fracci\u00f3n."
      ],
      audio: "Resumen de Matematicas: En la funcion lineal C de x igual a m por x mas b, b es el cargo fijo y m es el cambio por unidad. La probabilidad se calcula dividiendo casos favorables entre casos totales."
    },
    {
      id: "res-esp", area: "Desarrollo Web y Ciberseguridad", lang: "es-CR", ilus: "tech",
      titulo: "RBAC, RLS, Cookies HttpOnly, PWA y SHA-256",
      puntos: [
        "Principio de m\u00ednimo privilegio (RBAC): todo usuario nuevo arranca como Estudiante; solo SuperAdmin promueve roles.",
        "Protecci\u00f3n XSS: las cookies de sesi\u00f3n deben llevar HttpOnly y Secure para que JavaScript no pueda robarlas.",
        "Integridad SHA-256: cualquier alteraci\u00f3n m\u00ednima cambia completamente el hash de 64 caracteres del c\u00f3digo QR.",
        "PWA limpia: un solo Service Worker Network-First evita que el navegador muestre versiones obsoletas."
      ],
      audio: "Resumen de Desarrollo Web y Ciberseguridad: Por minimo privilegio todo usuario nuevo inicia como Estudiante y solo el SuperAdmin cambia roles. HttpOnly protege cookies contra XSS y SHA doscientos cincuenta y seis garantiza integridad en codigos QR."
    }
  ];

  var PRACTICAS_BANCO = [
    { id: "en-01", area: "Ingl\u00e9s", lang: "en-US", ilus: "idiomas", consigna: "Choose the word with the same meaning as 'After that'.", contexto: "We started hiking five miles the first day. After that, we hiked 10 miles.", ops: ["Therefore", "Consequently", "Subsequently", "Nevertheless"], ok: 2, exp: "'After that' equivale a 'Subsequently'." },
    { id: "en-02", area: "Ingl\u00e9s", lang: "en-US", ilus: "idiomas", consigna: "Choose the word with the same meaning as 'Also'.", contexto: "He said everyone should have quality health care. Also, everyone deserves good education.", ops: ["Therefore", "However", "Furthermore", "Otherwise"], ok: 2, exp: "'Also' equivale a 'Furthermore'." },
    { id: "en-03", area: "Ingl\u00e9s", lang: "en-US", ilus: "idiomas", consigna: "Choose the best replacement for 'Even so'.", contexto: "The server passed the load test. Even so, the team ran a security audit.", ops: ["Similarly", "Nevertheless", "Moreover", "Meanwhile"], ok: 1, exp: "'Even so' expresa contraste, igual que 'Nevertheless'." },
    { id: "fr-01", area: "Franc\u00e9s", lang: "fr-FR", ilus: "idiomas", consigna: "Choisissez le sens de 'Ensuite'.", contexto: "Nous arrivons \u00e0 Lyon ce matin. Ensuite, nous prenons le train pour Gen\u00e8ve.", ops: ["Apr\u00e8s cela", "Cependant", "Jamais", "Autrefois"], ok: 0, exp: "'Ensuite' equivale a 'Apr\u00e8s cela'." },
    { id: "de-01", area: "Alem\u00e1n", lang: "de-DE", ilus: "idiomas", consigna: "Gleiche Bedeutung wie 'Deshalb'.", contexto: "Es regnet stark. Deshalb fahren wir heute mit dem Bus zur Schule.", ops: ["Obwohl", "Selten", "W\u00e4hrend", "Darum"], ok: 3, exp: "'Deshalb' y 'Darum' indican consecuencia." },
    { id: "pt-01", area: "Portugu\u00e9s", lang: "pt-BR", ilus: "idiomas", consigna: "Equivalente a 'Em seguida'.", contexto: "Estudamos redes pela manh\u00e3. Em seguida, praticamos firewall.", ops: ["Contudo", "Antes de tudo", "Logo depois", "Entretanto"], ok: 2, exp: "'Em seguida' equivale a 'Logo depois'." },
    { id: "es-01", area: "Espa\u00f1ol", lang: "es-CR", ilus: "idiomas", consigna: "Conector equivalente a 'por lo tanto'.", contexto: "Se actualizaron los certificados TLS; por lo tanto, el portal qued\u00f3 protegido.", ops: ["Sin embargo", "No obstante", "A pesar de", "Por consiguiente"], ok: 3, exp: "'Por lo tanto' y 'Por consiguiente' expresan consecuencia." },
    { id: "mat-01", area: "Matem\u00e1ticas", lang: "es-CR", ilus: "mate", consigna: "Criterio correcto del costo total C(x).", contexto: "Un taller cobra 15 000 colones fijos m\u00e1s 2 500 colones por cada hora x.", ops: ["C(x) = 15000x + 2500", "C(x) = 15000 - 2500x", "C(x) = 15000 + 2500x", "C(x) = 17500x"], ok: 2, exp: "Cargo fijo 15000 + 2500 por hora x." },
    { id: "esp-01", area: "Desarrollo Web y Ciberseguridad", lang: "es-CR", ilus: "tech", consigna: "Principio RBAC al registrarse un usuario nuevo en la plataforma.", contexto: "Una persona ingresa por primera vez con su correo institucional o Gmail.", ops: ["Inicia autom\u00e1ticamente como SuperAdmin", "Inicia siempre como Estudiante hasta que SuperAdmin cambie su rol", "Puede elegir cualquier rol libremente", "Entra sin quedar registrado en trazabilidad"], ok: 1, exp: "Por m\u00ednimo privilegio todo usuario nuevo inicia como Estudiante y solo SuperAdmin promueve roles." }
  ];

  function leerJson(k, def) {
    try {
      var r = localStorage.getItem(k);
      return r ? JSON.parse(r) : def;
    } catch (_e) { return def; }
  }

  function guardarJson(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {}
  }

  function esCorreoValido(c) {
    var s = String(c || "").trim().toLowerCase();
    var p = s.split("@");
    return p.length === 2 && p[0].length > 0 && DOMINIOS_CUENTA.indexOf(p[1]) !== -1;
  }

  function tipoCuentaDeCorreo(correo) {
    var s = String(correo || "").toLowerCase();
    if (s.endsWith("@mep.go.cr") || s.endsWith("@est.mep.go.cr")) return "mep";
    if (s.endsWith("@gmail.com")) return "gmail";
    return "institucional";
  }

  async function sha256Hex(txt) {
    try {
      var data = new TextEncoder().encode(String(txt || ""));
      var buf = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    } catch (_e) {
      return "local-" + Math.abs(String(txt).split("").reduce(function (a, c) { return ((a << 5) - a + c.charCodeAt(0)) | 0; }, 0)).toString(16);
    }
  }

  function detectarDispositivo() {
    var w = window.innerWidth || 1024;
    if (w <= 640) return "Celular (" + w + "px)";
    if (w <= 1024) return "Tablet (" + w + "px)";
    return "Computadora (" + w + "px)";
  }

  // Detectar sesion actual (con cuenta o sin cuenta) escaneando almacenamiento de la app
  function detectarCorreoSesionActual() {
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

  function asegurarPerfilEstudiante(correo, nombre) {
    var perfiles = leerJson(KEY_PERFILES, []);
    var c = String(correo || "").trim().toLowerCase();
    if (!c) return null;
    var ex = perfiles.find(function (p) { return p.correo === c; });
    if (!ex) {
      ex = {
        correo: c,
        nombre: nombre || c.split("@")[0],
        tipo_cuenta: tipoCuentaDeCorreo(c),
        rol: "Estudiante", // REGLA INQUEBRANTABLE: SIEMPRE INICIA COMO ESTUDIANTE
        estado: "activo",
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString(),
        actualizado_por: "sistema-rbac-default"
      };
      perfiles.unshift(ex);
      guardarJson(KEY_PERFILES, perfiles);
    }
    return ex;
  }

  function obtenerSesionId() {
    var sid = sessionStorage.getItem(KEY_SESION_ACTUAL);
    if (!sid) {
      sid = "SES-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      sessionStorage.setItem(KEY_SESION_ACTUAL, sid);
    }
    return sid;
  }

  function sincronizarSupabaseRest(tabla, payload) {
    try {
      var url = window.__BDS_SUPABASE_URL__ || localStorage.getItem("VITE_SUPABASE_URL") || "";
      var key = window.__BDS_SUPABASE_ANON__ || localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "";
      if (!url || !key || url.indexOf("tu-proyecto.supabase.co") !== -1) return;
      fetch(url.replace(/\/$/, "") + "/rest/v1/" + tabla, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": key,
          "Authorization": "Bearer " + key,
          "Prefer": "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (_e) {}
  }

  async function registrarLatidoTrazabilidad(vistaNombre) {
    var sid = obtenerSesionId();
    var correo = detectarCorreoSesionActual();
    var tipo = correo ? "con_cuenta" : "sin_cuenta";
    var perfil = correo ? asegurarPerfilEstudiante(correo) : null;
    var rolActual = perfil ? perfil.rol : "Estudiante";
    var ahora = new Date().toISOString();
    var firma = await sha256Hex(sid + "|" + (correo || "visitante") + "|" + tipo + "|" + rolActual);

    var ingresos = leerJson(KEY_INGRESOS, []);
    var idx = ingresos.findIndex(function (r) { return r.sesion_id === sid; });
    var registro = {
      sesion_id: sid,
      correo: correo || "Sin cuenta (Prueba gratuita)",
      tipo_ingreso: tipo,
      rol_en_sesion: rolActual,
      vista_actual: vistaNombre || document.title || "Inicio",
      dispositivo: detectarDispositivo(),
      activo: true,
      ingreso_en: idx >= 0 ? ingresos[idx].ingreso_en : ahora,
      ultimo_latido: ahora,
      sha256_evento: firma
    };

    if (idx >= 0) ingresos[idx] = registro;
    else ingresos.unshift(registro);

    // Marcar inactivos los registros cuyo ultimo latido supere 2 minutos
    var limiteMs = Date.now() - 120000;
    ingresos.forEach(function (r) {
      var t = Date.parse(r.ultimo_latido || r.ingreso_en || 0);
      if (r.sesion_id !== sid && (!t || t < limiteMs)) r.activo = false;
    });

    guardarJson(KEY_INGRESOS, ingresos.slice(0, 250));
    sincronizarSupabaseRest("trazabilidad_ingresos", {
      sesion_id: registro.sesion_id,
      correo: correo,
      tipo_ingreso: registro.tipo_ingreso,
      rol_en_sesion: registro.rol_en_sesion,
      vista_actual: registro.vista_actual,
      dispositivo: registro.dispositivo,
      activo: true,
      ultimo_latido: registro.ultimo_latido,
      sha256_evento: registro.sha256_evento
    });
  }

  // Ocultar cualquier selector publico de rol en pantallas de login para evitar confusion de roles
  function ocultarSelectoresRolPublicos() {
    document.querySelectorAll("select").forEach(function (sel) {
      if (sel.closest("#bds-v41-modal")) return;
      var txt = (sel.textContent || "").toLowerCase();
      if (txt.indexOf("superadmin") !== -1 || (txt.indexOf("jefatura") !== -1 && txt.indexOf("docente") !== -1 && txt.indexOf("estudiante") !== -1)) {
        var wrap = sel.closest("div") || sel;
        if (sel.value !== "Estudiante") {
          for (var i = 0; i < sel.options.length; i++) {
            if ((sel.options[i].value || sel.options[i].text).toLowerCase().indexOf("estudiante") !== -1) {
              sel.selectedIndex = i;
              sel.dispatchEvent(new Event("change", { bubbles: true }));
              break;
            }
          }
        }
        if (wrap && !wrap.dataset.bdsRolFixed) {
          wrap.dataset.bdsRolFixed = "1";
          sel.disabled = true;
          sel.title = "Rol inicial asignado autom\u00e1ticamente: Estudiante. Solo SuperAdmin puede cambiar roles.";
        }
      }
    });
  }

  function hablar(texto, lang) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = lang || "es-CR";
    try { window.speechSynthesis.resume(); } catch (_e) {}
    window.speechSynthesis.speak(u);
  }

  function opcionesPorNivel(item, nivel) {
    var l4 = ["A", "B", "C", "D"];
    if (nivel === "macro") {
      return { ops: item.ops.map(function (t, i) { return { l: l4[i], t: t }; }), ok: l4[item.ok] };
    }
    var okT = item.ops[item.ok];
    var dist = item.ops.filter(function (_t, i) { return i !== item.ok; }).slice(0, 2);
    var seed = item.id.charCodeAt(item.id.length - 1) % 3;
    var arr = [];
    var d = 0;
    for (var i = 0; i < 3; i++) arr.push(i === seed ? okT : dist[d++]);
    var l3 = ["A", "B", "C"];
    return { ops: arr.map(function (t, j) { return { l: l3[j], t: t }; }), ok: l3[seed] };
  }

  // --------------------------------------------------------------------------
  // MENU UNIFICADO BDS v4.1 (Drawer limpio + Trazabilidad/RBAC + Resumenes + Practicas)
  // --------------------------------------------------------------------------
  function montarMenuYCentroBDS() {
    if (document.getElementById("bds-v41-launcher")) return;

    var launcher = document.createElement("button");
    launcher.id = "bds-v41-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Abrir Men\u00fa BDS, Res\u00famenes y Trazabilidad");
    launcher.style.cssText =
      "position:fixed;right:14px;bottom:78px;z-index:2147483630;display:flex;align-items:center;gap:8px;" +
      "background:#1e40af;color:#ffffff;border:2px solid #93c5fd;border-radius:999px;padding:8px 14px;" +
      "font:800 12px system-ui,sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.38);cursor:pointer";
    launcher.innerHTML = BUHO_CIRCULAR + "<span>Men\u00fa BDS</span>";
    document.body.appendChild(launcher);

    var modal = document.createElement("div");
    modal.id = "bds-v41-modal";
    modal.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483640;background:rgba(15,23,42,.72);overflow:auto;padding:16px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var ui = {
      tab: "resumenes", // resumenes | practicas | trazabilidad
      filtroTraza: "todos",
      nivel: "macro",
      pIdx: 0,
      pSel: null,
      aviso: ""
    };

    function esSuperAdminSesion() {
      return localStorage.getItem(KEY_SUPERADMIN_FLAG) === "1";
    }

    function renderModal() {
      var ingresos = leerJson(KEY_INGRESOS, []);
      var perfiles = leerJson(KEY_PERFILES, []);
      var auditoria = leerJson(KEY_AUDITORIA, []);
      var esSuper = esSuperAdminSesion();

      var conCuenta = ingresos.filter(function (x) { return x.tipo_ingreso === "con_cuenta"; }).length;
      var sinCuenta = ingresos.filter(function (x) { return x.tipo_ingreso === "sin_cuenta"; }).length;
      var activos = ingresos.filter(function (x) { return x.activo; }).length;

      var contenido = "";

      if (ui.tab === "resumenes") {
        contenido =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">' +
          RESUMENES.map(function (r) {
            return '<article style="background:#ffffff;color:#0f172a;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px">' +
              '<div style="font-size:12px;font-weight:800;color:#1e40af;text-transform:uppercase">' + r.area + '</div>' +
              '<h3 style="margin:0;font-size:17px;font-weight:900;color:#0f172a">' + r.titulo + '</h3>' +
              svgIlustracion(r.ilus, r.titulo) +
              '<ul style="margin:4px 0;padding-left:18px;font-size:13px;line-height:1.5;color:#1e293b">' +
              r.puntos.map(function (p) { return '<li style="margin-bottom:5px">' + p + '</li>'; }).join("") +
              '</ul>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:auto">' +
              '<button data-res-play="' + r.id + '" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">&#9654; Escuchar resumen</button>' +
              '<button data-go-prac="1" type="button" style="background:#1e40af;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">Ir a pr\u00e1cticas</button>' +
              '</div></article>';
          }).join("") + '</div>';
      } else if (ui.tab === "practicas") {
        var it = PRACTICAS_BANCO[ui.pIdx] || PRACTICAS_BANCO[0];
        var prep = opcionesPorNivel(it, ui.nivel);
        contenido =
          '<div style="background:#ffffff;color:#0f172a;border:1.5px solid #94a3b8;border-radius:16px;padding:14px 16px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
          '<div style="font-size:13px;font-weight:800">Modalidad: <span style="color:#1e40af">' + (ui.nivel === "macro" ? "Macroevaluaci\u00f3n (A, B, C, D)" : "Microevaluaci\u00f3n (A, B, C)") + '</span></div>' +
          '<div style="display:flex;gap:8px">' +
          '<button data-niv="macro" type="button" style="padding:7px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.nivel === "macro" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Macro (A-D)</button>' +
          '<button data-niv="micro" type="button" style="padding:7px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #4338ca;background:' + (ui.nivel === "micro" ? "#4338ca;color:#fff" : "#fff;color:#4338ca") + '">Micro (A-C)</button>' +
          '</div></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px">' +
          '<div style="background:#ffffff;color:#0f172a;border:1.5px solid #94a3b8;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px">' +
          '<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#1e40af"><span>' + it.area + '</span><span>\u00cdtem ' + (ui.pIdx + 1) + ' de ' + PRACTICAS_BANCO.length + '</span></div>' +
          '<h3 style="margin:0;font-size:18px;font-weight:900;color:#0f172a">' + it.consigna + '</h3>' +
          svgIlustracion(it.ilus, it.area) +
          '<div style="background:#f1f5f9;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px;font-size:14px;font-weight:600;color:#0f172a">' + it.contexto + '</div>' +
          '<button id="bds-v41-play-item" type="button" style="align-self:flex-start;background:#c2410c;color:#fff;border:none;border-radius:999px;padding:9px 16px;font-size:13px;font-weight:800;cursor:pointer">&#9654; Escuchar pregunta (' + it.lang + ')</button>' +
          '</div>' +
          '<div style="background:#ffffff;color:#0f172a;border:1.5px solid #94a3b8;border-radius:16px;padding:18px;display:flex;flex-direction:column;justify-content:space-between">' +
          '<div>' +
          prep.ops.map(function (o) {
            var active = ui.pSel === o.l;
            return '<button data-pop="' + o.l + '" type="button" style="width:100%;display:flex;align-items:center;gap:10px;text-align:left;padding:12px;margin-bottom:8px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;color:#0f172a;border:2px solid ' + (active ? "#1e40af;background:#dbeafe" : "#94a3b8;background:#fff") + '">' +
              '<span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;background:' + (active ? "#1e40af;color:#fff" : "#e2e8f0;color:#0f172a") + '">' + o.l + '</span><span>' + o.t + '</span></button>';
          }).join("") +
          (ui.pSel ? '<div style="margin-top:10px;padding:12px;border-radius:12px;font-size:13px;font-weight:700;background:' + (ui.pSel === prep.ok ? "#dcfce7;color:#14532d;border:1.5px solid #15803d" : "#fef3c7;color:#451a03;border:1.5px solid #b45309") + '">' +
            (ui.pSel === prep.ok ? "Correcto. " : "Sugerida: " + prep.ok + ". ") + it.exp + '</div>' : '') +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1.5px solid #e2e8f0">' +
          '<button id="bds-v41-prev" type="button" ' + (ui.pIdx === 0 ? "disabled " : "") + 'style="padding:8px 14px;border-radius:10px;border:2px solid #64748b;background:#fff;color:#0f172a;font-weight:800;cursor:pointer">Anterior</button>' +
          '<button id="bds-v41-next" type="button" ' + (ui.pIdx >= PRACTICAS_BANCO.length - 1 ? "disabled " : "") + 'style="padding:8px 14px;border-radius:10px;border:none;background:#1e40af;color:#fff;font-weight:800;cursor:pointer">Siguiente</button>' +
          '</div></div></div>';
      } else {
        // TAB TRAZABILIDAD TOTAL & RBAC
        var filtrados = ingresos.filter(function (r) {
          if (ui.filtroTraza === "con_cuenta") return r.tipo_ingreso === "con_cuenta";
          if (ui.filtroTraza === "sin_cuenta") return r.tipo_ingreso === "sin_cuenta";
          if (ui.filtroTraza === "activos") return r.activo === true;
          return true;
        });

        contenido =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px">' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#475569">TOTAL REGISTROS</div><div style="font-size:24px;font-weight:900;color:#0f172a">' + ingresos.length + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#1e40af">CON CUENTA</div><div style="font-size:24px;font-weight:900;color:#1e40af">' + conCuenta + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#b45309">SIN CUENTA (PRUEBA)</div><div style="font-size:24px;font-weight:900;color:#b45309">' + sinCuenta + '</div></div>' +
          '<div style="background:#fff;border:1.5px solid #15803d;border-radius:14px;padding:12px"><div style="font-size:11px;font-weight:800;color:#15803d">ACTIVOS EN BD AHORA</div><div style="font-size:24px;font-weight:900;color:#15803d">' + activos + '</div></div>' +
          '</div>' +

          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;margin-bottom:14px">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px">' +
          '<div><h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">Control RBAC de Roles (Regla: todos inician como Estudiante)</h3>' +
          '<p style="margin:4px 0 0;font-size:12px;color:#334155">Solo el SuperAdmin puede cambiar roles. Cada cambio genera sello SHA-256 en bit\u00e1cora.</p></div>' +
          '<button id="bds-v41-toggle-sa" type="button" style="padding:8px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid ' + (esSuper ? "#15803d;background:#dcfce7;color:#14532d" : "#1e40af;background:#1e40af;color:#fff") + '">' +
          (esSuper ? "Modo SuperAdmin ACTIVO (Clic para bloquear)" : "Activar gesti\u00f3n SuperAdmin") + '</button></div>' +
          (ui.aviso ? '<div style="margin-bottom:10px;padding:10px 12px;border-radius:10px;background:#dbeafe;color:#1e3a8a;font-size:12px;font-weight:800">' + ui.aviso + '</div>' : '') +
          '<form id="bds-v41-add-user" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
          '<input id="bds-v41-new-mail" type="email" required placeholder="Registrar usuario: usuario@est.mep.go.cr o usuario@gmail.com" style="flex:1;min-width:220px;padding:9px 12px;border:2px solid #64748b;border-radius:10px;font-size:13px;color:#0f172a;background:#fff"/>' +
          '<button type="submit" style="background:#0f172a;color:#fff;border:none;border-radius:10px;padding:9px 14px;font-size:12px;font-weight:800;cursor:pointer">+ Registrar como Estudiante</button></form>' +

          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#0f172a">' +
          '<thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left;color:#334155">' +
          '<th style="padding:8px">Correo registrado</th><th style="padding:8px">Tipo</th><th style="padding:8px">Rol actual</th><th style="padding:8px">Cambiar rol (Solo SuperAdmin)</th></tr></thead><tbody>' +
          (perfiles.length === 0
            ? '<tr><td colspan="4" style="padding:12px;color:#475569">A\u00fan no hay correos registrados en esta sesi\u00f3n local. Registra uno arriba o inicia sesi\u00f3n con Gmail/MEP.</td></tr>'
            : perfiles.map(function (p) {
                return '<tr style="border-bottom:1px solid #e2e8f0">' +
                  '<td style="padding:8px;font-weight:700">' + p.correo + '</td>' +
                  '<td style="padding:8px;text-transform:uppercase;font-weight:700;color:#475569">' + p.tipo_cuenta + '</td>' +
                  '<td style="padding:8px"><span style="background:#dbeafe;color:#1e3a8a;padding:3px 9px;border-radius:999px;font-weight:800">' + p.rol + '</span></td>' +
                  '<td style="padding:8px"><select data-role-email="' + p.correo + '" ' + (esSuper ? "" : "disabled ") + 'style="padding:6px 8px;border:1.5px solid #64748b;border-radius:8px;font-weight:700;color:#0f172a;background:#fff">' +
                  ROLES_OFICIALES.map(function (rn) { return '<option value="' + rn + '"' + (p.rol === rn ? " selected" : "") + '>' + rn + '</option>'; }).join("") +
                  '</select></td></tr>';
              }).join("")) +
          '</tbody></table></div></div>' +

          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">' +
          '<h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">Trazabilidad de Ingresos (Con cuenta, Sin cuenta y Activos)</h3>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          [
            { id: "todos", lb: "Todos (" + ingresos.length + ")" },
            { id: "con_cuenta", lb: "Con cuenta (" + conCuenta + ")" },
            { id: "sin_cuenta", lb: "Sin cuenta (" + sinCuenta + ")" },
            { id: "activos", lb: "Activos (" + activos + ")" }
          ].map(function (f) {
            return '<button data-traza-f="' + f.id + '" type="button" style="padding:6px 10px;border-radius:999px;font-size:11px;font-weight:800;cursor:pointer;border:1.5px solid #1e40af;background:' + (ui.filtroTraza === f.id ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">' + f.lb + '</button>';
          }).join("") + '</div></div>' +
          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#0f172a">' +
          '<thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left;color:#334155">' +
          '<th style="padding:8px">Estado</th><th style="padding:8px">Usuario / Sesi\u00f3n</th><th style="padding:8px">Tipo</th><th style="padding:8px">Rol</th><th style="padding:8px">Dispositivo</th><th style="padding:8px">\u00daltimo latido</th></tr></thead><tbody>' +
          filtrados.map(function (r) {
            return '<tr style="border-bottom:1px solid #e2e8f0">' +
              '<td style="padding:8px;font-weight:800;color:' + (r.activo ? "#15803d" : "#64748b") + '">' + (r.activo ? "\u25cf ACTIVO" : "\u25cb Inactivo") + '</td>' +
              '<td style="padding:8px;font-weight:700">' + r.correo + '<div style="font-size:10px;color:#64748b;font-family:monospace">' + r.sesion_id + '</div></td>' +
              '<td style="padding:8px;font-weight:700">' + (r.tipo_ingreso === "con_cuenta" ? "Con cuenta" : "Sin cuenta") + '</td>' +
              '<td style="padding:8px;font-weight:800;color:#1e40af">' + r.rol_en_sesion + '</td>' +
              '<td style="padding:8px">' + r.dispositivo + '</td>' +
              '<td style="padding:8px;font-size:11px">' + new Date(r.ultimo_latido).toLocaleTimeString("es-CR") + '</td></tr>';
          }).join("") + '</tbody></table></div>' +
          (auditoria.length > 0
            ? '<div style="margin-top:12px;padding-top:10px;border-top:1.5px solid #e2e8f0;font-size:11px;color:#334155"><strong>\u00daltimo cambio RBAC:</strong> ' +
              auditoria[0].correo_objetivo + ' (' + auditoria[0].rol_anterior + ' \u2192 ' + auditoria[0].rol_nuevo + ') \u2022 SHA-256: <code>' + auditoria[0].sha256.slice(0, 18) + '...</code></div>'
            : '') +
          '</div>';
      }

      modal.innerHTML =
        '<div style="max-width:1080px;margin:12px auto;background:#f1f5f9;color:#0f172a;border-radius:20px;border:2px solid #94a3b8;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45)">' +
        '<div style="background:#ffffff;border-bottom:2px solid #cbd5e1;padding:12px 16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
        '<div style="display:flex;align-items:center;gap:10px">' + BUHO_CIRCULAR +
        '<div><div style="font-size:15px;font-weight:900;color:#0f172a">pracTICAtecnica.com \u2022 Centro BDS v4.1</div>' +
        '<div style="font-size:11px;font-weight:700;color:#475569">Res\u00famenes Ilustrados \u2022 Pr\u00e1cticas Macro/Micro \u2022 Trazabilidad &amp; RBAC</div></div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        '<button data-mtab="resumenes" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "resumenes" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Res\u00famenes Ilustrados</button>' +
        '<button data-mtab="practicas" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "practicas" ? "#1e40af;color:#fff" : "#fff;color:#1e40af") + '">Pr\u00e1cticas (A-D / A-C)</button>' +
        '<button data-mtab="trazabilidad" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #0f172a;background:' + (ui.tab === "trazabilidad" ? "#0f172a;color:#fff" : "#fff;color:#0f172a") + '">Trazabilidad &amp; RBAC</button>' +
        '<button id="bds-v41-close" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Cerrar</button>' +
        '</div></div>' +
        '<div style="padding:16px">' + contenido + '</div></div>';

      modal.querySelectorAll("[data-mtab]").forEach(function (b) {
        b.onclick = function () { ui.tab = b.getAttribute("data-mtab"); ui.aviso = ""; renderModal(); };
      });
      document.getElementById("bds-v41-close").onclick = function () { modal.style.display = "none"; };

      if (ui.tab === "resumenes") {
        modal.querySelectorAll("[data-res-play]").forEach(function (b) {
          b.onclick = function () {
            var r = RESUMENES.find(function (x) { return x.id === b.getAttribute("data-res-play"); });
            if (r) hablar(r.audio, r.lang);
          };
        });
        modal.querySelectorAll("[data-go-prac]").forEach(function (b) {
          b.onclick = function () { ui.tab = "practicas"; renderModal(); };
        });
      } else if (ui.tab === "practicas") {
        modal.querySelectorAll("[data-niv]").forEach(function (b) {
          b.onclick = function () { ui.nivel = b.getAttribute("data-niv"); ui.pSel = null; renderModal(); };
        });
        modal.querySelectorAll("[data-pop]").forEach(function (b) {
          b.onclick = function () { ui.pSel = b.getAttribute("data-pop"); renderModal(); };
        });
        var cur = PRACTICAS_BANCO[ui.pIdx] || PRACTICAS_BANCO[0];
        document.getElementById("bds-v41-play-item").onclick = function () { hablar(cur.consigna + ". " + cur.contexto, cur.lang); };
        document.getElementById("bds-v41-prev").onclick = function () { ui.pIdx = Math.max(0, ui.pIdx - 1); ui.pSel = null; renderModal(); };
        document.getElementById("bds-v41-next").onclick = function () { ui.pIdx = Math.min(PRACTICAS_BANCO.length - 1, ui.pIdx + 1); ui.pSel = null; renderModal(); };
      } else {
        modal.querySelectorAll("[data-traza-f]").forEach(function (b) {
          b.onclick = function () { ui.filtroTraza = b.getAttribute("data-traza-f"); renderModal(); };
        });
        document.getElementById("bds-v41-toggle-sa").onclick = function () {
          localStorage.setItem(KEY_SUPERADMIN_FLAG, esSuper ? "0" : "1");
          ui.aviso = esSuper ? "Gesti\u00f3n SuperAdmin bloqueada." : "Gesti\u00f3n SuperAdmin activada para cambio de roles RBAC.";
          renderModal();
        };
        document.getElementById("bds-v41-add-user").onsubmit = function (ev) {
          ev.preventDefault();
          var m = document.getElementById("bds-v41-new-mail").value;
          if (!esCorreoValido(m)) {
            ui.aviso = "Solo se admiten correos @gmail.com, @mep.go.cr o @est.mep.go.cr.";
            renderModal();
            return;
          }
          var p = asegurarPerfilEstudiante(m);
          sincronizarSupabaseRest("perfiles_rbac", { correo: p.correo, nombre_visible: p.nombre, tipo_cuenta: p.tipo_cuenta, rol: "Estudiante" });
          ui.aviso = "Usuario " + p.correo + " registrado con rol inicial obligatorio: Estudiante.";
          renderModal();
        };
        modal.querySelectorAll("[data-role-email]").forEach(function (sel) {
          sel.onchange = async function () {
            if (!esSuperAdminSesion()) return;
            var mail = sel.getAttribute("data-role-email");
            var nuevoRol = sel.value;
            var listaP = leerJson(KEY_PERFILES, []);
            var target = listaP.find(function (x) { return x.correo === mail; });
            if (!target) return;
            var prevRol = target.rol;
            target.rol = nuevoRol;
            target.actualizado_en = new Date().toISOString();
            guardarJson(KEY_PERFILES, listaP);

            var listaI = leerJson(KEY_INGRESOS, []);
            listaI.forEach(function (ing) { if (ing.correo === mail) ing.rol_en_sesion = nuevoRol; });
            guardarJson(KEY_INGRESOS, listaI);

            var firma = await sha256Hex("SuperAdmin|" + mail + "|" + prevRol + "->" + nuevoRol + "|" + Date.now());
            var aud = leerJson(KEY_AUDITORIA, []);
            aud.unshift({ correo_objetivo: mail, rol_anterior: prevRol, rol_nuevo: nuevoRol, sha256: firma, fecha: new Date().toISOString() });
            guardarJson(KEY_AUDITORIA, aud.slice(0, 100));

            ui.aviso = "Rol actualizado por SuperAdmin: " + mail + " (" + prevRol + " \u2192 " + nuevoRol + ") \u2022 SHA-256 registrado.";
            renderModal();
          };
        });
      }
    }

    launcher.onclick = function () {
      registrarLatidoTrazabilidad("Centro BDS v4.1");
      modal.style.display = "block";
      renderModal();
    };
  }

  function arrancar() {
    registrarLatidoTrazabilidad("Inicio");
    ocultarSelectoresRolPublicos();
    montarMenuYCentroBDS();
    setInterval(function () { registrarLatidoTrazabilidad(document.title || "Activa"); }, 30000);
    var obs = new MutationObserver(ocultarSelectoresRolPublicos);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("beforeunload", function () {
      var sid = sessionStorage.getItem(KEY_SESION_ACTUAL);
      var list = leerJson(KEY_INGRESOS, []);
      list.forEach(function (r) { if (r.sesion_id === sid) r.activo = false; });
      guardarJson(KEY_INGRESOS, list);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();