(function () {
  "use strict";
  if (window.__BDS_DUA_BIBLIOTECA_V74__) return;
  window.__BDS_DUA_BIBLIOTECA_V74__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Audio Latino Neutral prioritario (es-419 / es-CR / es-MX / es-US) + EN/FR/DE/PT
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

  function elegirVozNeutral(lang) {
    cargarVoces();
    if (!voces.length) return null;
    var target = String(lang || "es-419").toLowerCase();
    if (target.indexOf("es") === 0) {
      var ordenLat = ["es-419", "es-cr", "es-mx", "es-us", "es-co", "es-cl", "es-ar", "es-pe", "es-es"];
      for (var i = 0; i < ordenLat.length; i++) {
        var found = voces.find(function (v) { return v.lang && v.lang.toLowerCase() === ordenLat[i]; });
        if (found) return found;
      }
      return voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf("es") === 0; }) || voces[0];
    }
    var pref = target.split("-")[0];
    return voces.find(function (v) { return v.lang && v.lang.toLowerCase() === target; }) ||
           voces.find(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; }) ||
           voces[0];
  }

  function hablarNeutral(texto, lang, rate) {
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
        u.pitch = 1.0;
        var v = elegirVozNeutral(u.lang);
        if (v) u.voice = v;
        try { window.speechSynthesis.resume(); } catch (_e) {}
        window.speechSynthesis.speak(u);
      }, 65);
    } catch (_e) {}
  }

  function detenerAudio() {
    try {
      if (speakTimer) { clearTimeout(speakTimer); speakTimer = 0; }
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch (_e) {}
  }

  window.BDSDuaAudioV74 = { speak: hablarNeutral, stop: detenerAudio };

  // Motivaciones DUA inclusivas, respetuosas y neutrales (en 5 idiomas)
  var MOTIVACIONES_DUA = [
    {
      id: "enfoque",
      titulo: "Paso a paso, a tu ritmo",
      es: "Cada persona aprende a su propio ritmo. Un paso claro hoy construye dominio real ma\u00f1ana. T\u00f3mate tu tiempo, respira y avanza con seguridad.",
      en: "Every person learns at their own pace. One clear step today builds real mastery tomorrow. Take your time and move forward with confidence.",
      fr: "Chaque personne apprend \u00e0 son propre rythme. Un pas clair aujourd'hui construit la ma\u00eetrise de demain.",
      de: "Jeder Mensch lernt im eigenen Tempo. Ein klarer Schritt heute schafft echtes K\u00f6nnen f\u00fcr morgen.",
      pt: "Cada pessoa aprende no seu pr\u00f3prio ritmo. Um passo claro hoje constr\u00f3i dom\u00ednio real amanh\u00e3."
    },
    {
      id: "error",
      titulo: "El error es informaci\u00f3n \u00fatil",
      es: "Equivocarse en una pr\u00e1ctica no define tu capacidad: es una pista valiosa para fortalecer lo que est\u00e1s aprendiendo. Vuelve a intentarlo con calma.",
      en: "Making a mistake in practice does not define your ability; it is a useful clue to strengthen what you are learning. Try again calmly.",
      fr: "Faire une erreur en pratique est un indice pr\u00e9cieux pour progresser. Essaie encore calmement.",
      de: "Ein Fehler beim \u00dcben ist ein wertvoller Hinweis zum Lernen. Versuch es ruhig noch einmal.",
      pt: "Errar na pr\u00e1tica \u00e9 uma pista valiosa para fortalecer seu aprendizado. Tente novamente com calma."
    },
    {
      id: "constancia",
      titulo: "Constancia inclusiva y accesible",
      es: "Quince minutos de pr\u00e1ctica consciente con audio, lectura o ejercicios visuales valen m\u00e1s que horas de cansancio. Celebra tu avance de hoy.",
      en: "Fifteen minutes of focused practice with audio, reading, or visuals is worth more than hours of fatigue. Celebrate your progress today.",
      fr: "Quinze minutes de pratique attentive valent mieux que des heures de fatigue. C\u00e9l\u00e8bre ton progr\u00e8s.",
      de: "F\u00fcnfzehn Minuten konzentriertes \u00dcben sind wertvoller als stundenlange M\u00fcdigkeit.",
      pt: "Quinze minutos de pr\u00e1tica consciente valem mais do que horas de cansa\u00e7o. Celebre seu avan\u00e7o."
    }
  ];

  // Micro-practicas inspiradas en Duolingo + Open English (Trivia, Listening, Speaking + DUA)
  var MICRO_PRACTICAS = [
    {
      id: "mp-1", tipo: "Listening & Trivia (Ingl\u00e9s B1)", lang: "en-US",
      audioText: "We completed the safety checklist. After that, we deployed the web application.",
      pregunta: "Seg\u00fan el audio, \u00bfqu\u00e9 conector reemplaza con exactitud a 'After that'?",
      pistaDUA: "Pista DUA: 'After that' indica secuencia en el tiempo (lo que ocurri\u00f3 despu\u00e9s).",
      ops: ["However", "Subsequently", "Although", "Otherwise"],
      ok: 1,
      feedback: "Excelente. 'Subsequently' expresa secuencia temporal, igual que 'After that'."
    },
    {
      id: "mp-2", tipo: "Listening & Trivia (Franc\u00e9s A2)", lang: "fr-FR",
      audioText: "Nous arrivons \u00e0 la gare ce matin. Ensuite, nous prenons le bus pour le coll\u00e8ge.",
      pregunta: "\u00bfQu\u00e9 significa 'Ensuite' en la oraci\u00f3n escuchada?",
      pistaDUA: "Pista DUA: Conecta la llegada a la estaci\u00f3n con la siguiente acci\u00f3n.",
      ops: ["Despu\u00e9s / A continuaci\u00f3n", "Sin embargo", "Nunca", "Antes"],
      ok: 0,
      feedback: "Muy bien. 'Ensuite' equivale a 'despu\u00e9s' o 'a continuaci\u00f3n'."
    },
    {
      id: "mp-3", tipo: "Speaking Guiado (Ingl\u00e9s T\u00e9cnico)", lang: "en-US",
      audioText: "Good morning, I am practicing technical English today.",
      pregunta: "Escucha la frase modelo y presiona 'Practicar Speaking' para repetirla en voz alta:",
      pistaDUA: "Pista DUA: Habla despacio y con claridad. Tambi\u00e9n puedes practicar escuchando y repitiendo sin micr\u00f3fono.",
      ops: ["Good morning, I am practicing technical English today.", "I practice yesterday morning.", "Good night technical.", "English morning practice."],
      ok: 0,
      feedback: "Correcto. La estructura 'I am practicing...' expresa una acci\u00f3n en progreso."
    },
    {
      id: "mp-4", tipo: "REA 2026 & Ciberseguridad (Espa\u00f1ol)", lang: "es-419",
      audioText: "Por principio de m\u00ednimo privilegio, toda cuenta nueva inicia con rol Estudiante hasta que una administraci\u00f3n autorizada modifique sus permisos.",
      pregunta: "\u00bfPor qu\u00e9 toda cuenta nueva debe iniciar con el rol base Estudiante?",
      pistaDUA: "Pista DUA: Piensa en la regla de seguridad que limita accesos innecesarios desde el inicio.",
      ops: ["Para evitar escalada de privilegios (m\u00ednimo privilegio)", "Para borrar datos antiguos", "Para desactivar HTTPS", "Para quitar el modo oscuro"],
      ok: 0,
      feedback: "Exacto. El principio de m\u00ednimo privilegio protege los datos institucionales y estudiantiles."
    }
  ];

  function svgDiagramaManual(tipo) {
    if (tipo === "ingenieria") {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 180" style="width:100%;height:auto;border-radius:12px;display:block;margin:10px 0">' +
        '<rect width="600" height="180" fill="#0f172a"/>' +
        '<rect x="18" y="34" width="122" height="84" rx="10" fill="#1e40af" stroke="#93c5fd" stroke-width="2"/><text x="79" y="68" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">FRONTEND PWA</text><text x="79" y="88" text-anchor="middle" fill="#bfdbfe" font-size="10" font-family="system-ui">React + Vite + pnpm</text><text x="79" y="103" text-anchor="middle" fill="#bfdbfe" font-size="10" font-family="system-ui">Tailwind Local CSS</text>' +
        '<rect x="166" y="34" width="122" height="84" rx="10" fill="#047857" stroke="#6ee7b7" stroke-width="2"/><text x="227" y="68" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">SEGURIDAD</text><text x="227" y="88" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="system-ui">CSP + HSTS + COOP</text><text x="227" y="103" text-anchor="middle" fill="#a7f3d0" font-size="10" font-family="system-ui">Anti-XSS + 5 Intentos</text>' +
        '<rect x="314" y="34" width="122" height="84" rx="10" fill="#4338ca" stroke="#c4b5fd" stroke-width="2"/><text x="375" y="68" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">SUPABASE BD</text><text x="375" y="88" text-anchor="middle" fill="#ddd6fe" font-size="10" font-family="system-ui">PostgreSQL + RLS</text><text x="375" y="103" text-anchor="middle" fill="#ddd6fe" font-size="10" font-family="system-ui">RBAC + SHA-256</text>' +
        '<rect x="462" y="34" width="120" height="84" rx="10" fill="#b45309" stroke="#fde68a" stroke-width="2"/><text x="522" y="68" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">CI/CD &amp; QA</text><text x="522" y="88" text-anchor="middle" fill="#fef3c7" font-size="10" font-family="system-ui">Puerta Chrome CDP</text><text x="522" y="103" text-anchor="middle" fill="#fef3c7" font-size="10" font-family="system-ui">Vercel + Odin ZIP</text>' +
        '<path d="M140 76 L166 76 M288 76 L314 76 M436 76 L462 76" stroke="#f59e0b" stroke-width="3.5"/>' +
        '<text x="300" y="158" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Arquitectura de Grado Industrial \u2022 pracTICAtecnica.com (BDS Devs)</text></svg>';
    }
    if (tipo === "pagos") {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160" style="width:100%;height:auto;border-radius:12px;display:block;margin:10px 0">' +
        '<rect width="600" height="160" fill="#0f172a"/>' +
        '<rect x="24" y="30" width="160" height="78" rx="10" fill="#0369a1"/><text x="104" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">1. ELECCI\u00d3N DE PLAN</text><text x="104" y="84" text-anchor="middle" fill="#e0f2fe" font-size="10" font-family="system-ui">Individual o Institucional</text>' +
        '<rect x="220" y="30" width="160" height="78" rx="10" fill="#047857"/><text x="300" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">2. SINPE M\u00d3VIL</text><text x="300" y="84" text-anchor="middle" fill="#d1fae5" font-size="10" font-family="system-ui">Transferencia verificable CR</text>' +
        '<rect x="416" y="30" width="160" height="78" rx="10" fill="#4338ca"/><text x="496" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">3. ACTIVACI\u00d3N RBAC</text><text x="496" y="84" text-anchor="middle" fill="#e0e7ff" font-size="10" font-family="system-ui">Comprobante + Acceso total</text>' +
        '<path d="M184 69 L220 69 M380 69 L416 69" stroke="#f59e0b" stroke-width="3.5"/>' +
        '<text x="300" y="140" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Flujo Transparente de Pagos y Suscripciones \u2022 pracTICAtecnica.com</text></svg>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160" style="width:100%;height:auto;border-radius:12px;display:block;margin:10px 0">' +
      '<rect width="600" height="160" fill="#0f172a"/>' +
      '<rect x="24" y="30" width="160" height="78" rx="10" fill="#1d4ed8"/><text x="104" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">REPRESENTACI\u00d3N</text><text x="104" y="84" text-anchor="middle" fill="#dbeafe" font-size="10" font-family="system-ui">Audio + Visual + Texto claro</text>' +
      '<rect x="220" y="30" width="160" height="78" rx="10" fill="#047857"/><text x="300" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">ACCI\u00d3N Y EXPRESI\u00d3N</text><text x="300" y="84" text-anchor="middle" fill="#d1fae5" font-size="10" font-family="system-ui">Pr\u00e1ctica, Speaking, Simuladores</text>' +
      '<rect x="416" y="30" width="160" height="78" rx="10" fill="#6d28d9"/><text x="496" y="64" text-anchor="middle" fill="#fff" font-size="12" font-weight="800" font-family="system-ui">COMPROMISO DUA</text><text x="496" y="84" text-anchor="middle" fill="#ede9fe" font-size="10" font-family="system-ui">Ritmo propio y respeto total</text>' +
      '<path d="M184 69 L220 69 M380 69 L416 69" stroke="#f59e0b" stroke-width="3.5"/>' +
      '<text x="300" y="140" text-anchor="middle" fill="#cbd5e1" font-size="11" font-family="system-ui">Dise\u00f1o Universal para el Aprendizaje (DUA) \u2022 pracTICAtecnica.com</text></svg>';
  }

  // 5 Manuales Oficiales Ilustrados y Descargables (PDF / HTML offline)
  var MANUALES = [
    {
      id: "manual-director",
      archivo: "Manual-Direccion-Jefatura-pracTICAtecnica.html",
      titulo: "Manual de Direcci\u00f3n y Jefatura",
      sub: "Gesti\u00f3n institucional, REA 2026, RBAC y Trazabilidad",
      diag: "dua",
      resumenAudio: "Manual de Direccion y Jefatura de pracTICAtecnica punto com. Explica como supervisar el seguimiento REA dos mil veintiseis, validar trazabilidad institucional, gestionar roles bajo principio de minimo privilegio y cumplir la Ley numero ocho mil novecientos sesenta y ocho de PRODHAB.",
      secciones: [
        { h: "1. Panel Directivo y Supervisi\u00f3n REA 2026", p: "Desde la barra superior acceda a Seguimiento REA 2026, Orientaci\u00f3n, Secretar\u00eda y Cruce, Asignaci\u00f3n de Grupos y Llaves y Aulas." },
        { h: "2. Control de Roles (RBAC) y Seguridad", p: "Toda cuenta nueva inicia autom\u00e1ticamente con rol Estudiante. La promoci\u00f3n a Docente, Auxiliar o Jefatura se realiza exclusivamente por administraci\u00f3n autorizada con registro de auditor\u00eda SHA-256." },
        { h: "3. Cumplimiento Legal PRODHAB (Ley N.\u00b0 8968)", p: "La plataforma opera con consentimiento informado, derechos ARCO y cero exposici\u00f3n de datos sensibles estudiantiles." }
      ]
    },
    {
      id: "manual-docente",
      archivo: "Manual-Docente-pracTICAtecnica.html",
      titulo: "Manual de Usuario Docente",
      sub: "Mediaci\u00f3n DUA, Pr\u00e1cticas Macro/Micro, Idiomas y Evaluaci\u00f3n",
      diag: "dua",
      resumenAudio: "Manual de Usuario Docente. Detalla el uso de practicas diferenciadas en Macroevaluacion de cuatro opciones y Microevaluacion de tres opciones, herramientas DUA de audio latino neutral, simuladores tecnicos y seguimiento de notas.",
      secciones: [
        { h: "1. Estrategias DUA e Inclusi\u00f3n en el Aula", p: "Combine texto claro, audio en espa\u00f1ol latino neutral o idiomas (EN, FR, DE, PT), velocidad pausada (0.85x) y contraste AAA en modo claro/oscuro para atender la diversidad del estudiantado." },
        { h: "2. Evaluaci\u00f3n Diferenciada (REA 2026)", p: "Aplique \u00edtems en modalidad Macroevaluaci\u00f3n (opciones A, B, C, D) y Microevaluaci\u00f3n (opciones A, B, C) con retroalimentaci\u00f3n formativa inmediata." },
        { h: "3. Simuladores y Planeamiento", p: "Utilice los accesos r\u00e1pidos de Notas MEP, Planeamiento IA, Simuladores t\u00e9cnicos, Comedor y MOPT desde computadora o celular." }
      ]
    },
    {
      id: "manual-estudiante",
      archivo: "Manual-Estudiante-pracTICAtecnica.html",
      titulo: "Manual de Usuario Estudiantil",
      sub: "Gu\u00eda amigable para practicar a tu ritmo con DUA y juegos",
      diag: "dua",
      resumenAudio: "Manual de Usuario Estudiantil. Aprende como activar el modo claro u oscuro, elegir tu idioma, usar el boton Escuchar con voz neutral, practicar Listening y Speaking y mantener tu racha diaria sin presion.",
      secciones: [
        { h: "1. Personaliza tu espacio (DUA)", p: "Puedes alternar entre Modo Claro (alto contraste) y Modo Oscuro cuando lo necesites, y cambiar el idioma en la barra superior cuantas veces quieras." },
        { h: "2. Practica con Audio, Listening y Speaking", p: "Presiona Escuchar en cualquier pregunta o motivaci\u00f3n. Si necesitas escuchar m\u00e1s despacio, activa la velocidad 0.85x." },
        { h: "3. Aprende jugando y sin miedo al error", p: "Explora los 32 juegos educativos, simuladores y pr\u00e1cticas. Cada intento te da una pista respetuosa para mejorar." }
      ]
    },
    {
      id: "manual-pagos",
      archivo: "Manual-Pagos-Suscripciones-pracTICAtecnica.html",
      titulo: "Manual de Pagos y Suscripciones",
      sub: "SINPE M\u00f3vil Costa Rica, comprobantes y soporte oficial",
      diag: "pagos",
      resumenAudio: "Manual de Pagos y Suscripciones de pracTICAtecnica punto com. Describe el proceso transparente mediante SINPE Movil en Costa Rica, validacion de comprobantes y activacion de planes individuales o institucionales.",
      secciones: [
        { h: "1. Acceso Gratuito y Planes Institucionales", p: "La plataforma ofrece pr\u00e1cticas abiertas y planes de acompa\u00f1amiento para docentes, familias e instituciones educativas en Costa Rica." },
        { h: "2. M\u00e9todo de Pago Oficial (SINPE M\u00f3vil)", p: "Realice la transferencia \u00fanicamente mediante los canales oficiales publicados dentro del panel de suscripci\u00f3n y conserve el n\u00famero de comprobante." },
        { h: "3. Verificaci\u00f3n y Activaci\u00f3n", p: "Una vez confirmado el comprobante en el canal oficial de soporte, se habilita el perfil correspondiente con respaldo auditable y factura/constancia." }
      ]
    },
    {
      id: "manual-ingenieria",
      archivo: "Manual-Ingenieria-Arquitectura-BDS-Devs.html",
      titulo: "Manual de Ingenier\u00eda (BDS Devs)",
      sub: "Requerimientos, Procesos, Decisiones (ADR) y Stack T\u00e9cnico",
      diag: "ingenieria",
      resumenAudio: "Manual de Ingenieria de BDS Devs para pracTICAtecnica punto com. Documenta los requerimientos funcionales y de seguridad, el stack con React, Vite, pnpm, Tailwind CSS estatico, Supabase con RLS y Vercel, asi como el pipeline automatizado con Puerta Chrome y respaldos Odin SHA doscientos cincuenta y seis.",
      secciones: [
        { h: "1. Stack Tecnol\u00f3gico Oficial", p: "Frontend PWA en React + Vite (.jsx) empaquetado con pnpm; estilos con Tailwind CSS v3 compilado est\u00e1ticamente (public/tailwind-prod.css, cero CDN); Backend en Supabase (PostgreSQL + Auth + RLS); despliegue continuo en GitHub + Vercel." },
        { h: "2. Decisiones de Arquitectura (ADR)", p: "ADR-01: Cero CDN de Tailwind en producci\u00f3n para lograr consola 0 warnings. ADR-02: RBAC con rol inicial obligatorio Estudiante y cambio exclusivo por SuperAdmin con bit\u00e1cora SHA-256. ADR-03: Cabeceras HSTS, CSP, COOP, XFO DENY y Permissions-Policy (c\u00e1mara y micr\u00f3fono propios)." },
        { h: "3. Proceso de Calidad Kaizen y CI/CD", p: "Cada cambio pasa obligatoriamente por: (a) verificaci\u00f3n de sintaxis node --check, (b) compilaci\u00f3n pnpm run build, (c) Puerta Chrome Headless CDP en Desktop 1366px y M\u00f3vil 390px exigiendo 0 errores, 0 warnings y 0px desborde, (d) sellado de Punto Od\u00edn ZIP + SHA-256, y (e) auditor\u00eda HTTPS/Chrome en vivo." },
        { h: "4. Cumplimiento Legal y Privacidad", p: "Dise\u00f1ado bajo Ley N.\u00b0 8968 (PRODHAB Costa Rica), principio de m\u00ednimo privilegio, sanitizaci\u00f3n anti-XSS, bloqueo antifraude tras 5 intentos fallidos y cero credenciales privadas en el repositorio." }
      ]
    }
  ];

  function construirHtmlManual(m) {
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>' +
      '<title>' + esc(m.titulo) + ' - pracTICAtecnica.com</title>' +
      '<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:820px;margin:24px auto;padding:0 18px;color:#0f172a;line-height:1.6;background:#fff}' +
      '.hdr{border-bottom:3px solid #1e40af;padding-bottom:12px;margin-bottom:18px}.badge{display:inline-block;background:#dbeafe;color:#1e3a8a;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:800}' +
      'h1{margin:8px 0 4px;font-size:24px}h2{color:#1e3a8a;font-size:17px;margin-top:18px}.card{background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:14px;margin:12px 0}' +
      '.foot{margin-top:26px;padding-top:12px;border-top:1px solid #cbd5e1;font-size:12px;color:#475569}@media print{.no-print{display:none}}</style></head><body>' +
      '<div class="hdr"><span class="badge">pracTICAtecnica.com \u2022 Documento Oficial Ilustrado</span><h1>' + esc(m.titulo) + '</h1><div style="color:#475569;font-weight:600">' + esc(m.sub) + '</div></div>' +
      svgDiagramaManual(m.diag) +
      m.secciones.map(function (s) { return '<div class="card"><h2>' + esc(s.h) + '</h2><p>' + esc(s.p) + '</p></div>'; }).join("") +
      '<div class="foot">Generado con est\u00e1ndar DUA inclusivo y marca blanca \u2022 pracTICAtecnica.com (BDS Devs) \u2022 Costa Rica</div>' +
      '</body></html>';
  }

  function descargarManual(m) {
    var html = construirHtmlManual(m);
    var blob = new Blob([html], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = m.archivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
  }

  function imprimirManualPdf(m) {
    var w = window.open("", "_blank", "width=900,height=720");
    if (!w) { descargarManual(m); return; }
    w.document.open();
    w.document.write(construirHtmlManual(m));
    w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (_e) {} }, 250);
  }

  function montarBibliotecaDUA() {
    if (document.getElementById("bds-v74-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v74-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir Biblioteca de Manuales, DUA y Pr\u00e1ctica de Idiomas");
    btn.style.cssText =
      "position:fixed;right:12px;bottom:76px;z-index:2147483630;display:flex;align-items:center;gap:6px;" +
      "background:#1e40af;color:#ffffff;border:2px solid #93c5fd;border-radius:999px;padding:8px 13px;" +
      "font:800 12px system-ui,sans-serif;box-shadow:0 8px 22px rgba(15,23,42,.42);cursor:pointer";
    btn.textContent = "\ud83d\udcda Manuales & DUA";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v74-modal";
    modal.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483645;background:rgba(15,23,42,.82);overflow:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var ui = { tab: "manuales", lang: "es", rate: 0.96, pIdx: 0, pSel: null, xp: 0, speakTxt: "", manualSel: "manual-director" };

    function render() {
      var body = "";
      if (ui.tab === "manuales") {
        var mAct = MANUALES.find(function (x) { return x.id === ui.manualSel; }) || MANUALES[0];
        body =
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">' +
          MANUALES.map(function (m) {
            var a = m.id === mAct.id;
            return '<button data-msel="' + esc(m.id) + '" type="button" style="padding:7px 11px;border-radius:999px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (a ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">' + esc(m.titulo.replace("Manual de ", "")) + '</button>';
          }).join("") + '</div>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px">' +
          '<div><h3 style="margin:0;font-size:18px;font-weight:900;color:#0f172a">' + esc(mAct.titulo) + '</h3><div style="font-size:12px;color:#475569;font-weight:700">' + esc(mAct.sub) + '</div></div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          '<button id="bds-m-listen" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer">\ud83d\udd0a Escuchar (Latino Neutral)</button>' +
          '<button id="bds-m-pdf" type="button" style="background:#1e40af;color:#fff;border:none;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer">\ud83d\udda8\ufe0f Imprimir / PDF</button>' +
          '<button id="bds-m-dl" type="button" style="background:#047857;color:#fff;border:none;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer">\u2b07\ufe0f Descargar Manual</button>' +
          '</div></div>' +
          svgDiagramaManual(mAct.diag) +
          mAct.secciones.map(function (s) {
            return '<div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px;margin-top:10px"><div style="font-weight:900;font-size:14px;color:#1e3a8a;margin-bottom:4px">' + esc(s.h) + '</div><div style="font-size:13px;color:#1e293b;line-height:1.5">' + esc(s.p) + '</div></div>';
          }).join("") + '</div>';
      } else if (ui.tab === "dua") {
        var bcp = { es: "es-419", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-BR" }[ui.lang] || "es-419";
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:12px;margin-bottom:12px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><strong style="font-size:12px">Idioma audio:</strong>' +
          ["es", "en", "fr", "de", "pt"].map(function (l) {
            return '<button data-dlang="' + l + '" type="button" style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.lang === l ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">' + l.toUpperCase() + '</button>';
          }).join("") + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center"><strong style="font-size:12px">Velocidad DUA:</strong>' +
          '<button data-drate="0.82" type="button" style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:1.5px solid #047857;background:' + (ui.rate < 0.9 ? '#047857;color:#fff' : '#fff;color:#047857') + '">0.82x Pausada</button>' +
          '<button data-drate="0.96" type="button" style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:1.5px solid #047857;background:' + (ui.rate >= 0.9 ? '#047857;color:#fff' : '#fff;color:#047857') + '">1.0x Normal</button>' +
          '<button id="bds-d-stop" type="button" style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Detener</button></div></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px">' +
          MOTIVACIONES_DUA.map(function (m) {
            var txt = m[ui.lang] || m.es;
            return '<article style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px">' +
              '<div style="font-weight:900;font-size:15px;color:#1e3a8a">' + esc(m.titulo) + '</div>' +
              '<p style="margin:0;font-size:13px;line-height:1.5;color:#1e293b">' + esc(txt) + '</p>' +
              '<button data-mplay="' + esc(m.id) + '" type="button" style="margin-top:auto;align-self:flex-start;background:#c2410c;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">\ud83d\udd0a Escuchar (' + esc(bcp) + ')</button></article>';
          }).join("") + '</div>';
      } else {
        var it = MICRO_PRACTICAS[ui.pIdx] || MICRO_PRACTICAS[0];
        var pct = Math.round(((ui.pIdx + 1) / MICRO_PRACTICAS.length) * 100);
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:14px;padding:14px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;color:#1e40af;margin-bottom:6px"><span>' + esc(it.tipo) + '</span><span>XP Sesi\u00f3n: +' + ui.xp + '</span></div>' +
          '<div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-bottom:12px"><div style="height:100%;width:' + pct + '%;background:#047857"></div></div>' +
          '<h3 style="margin:0 0 8px;font-size:16px;font-weight:900;color:#0f172a">' + esc(it.pregunta) + '</h3>' +
          '<div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:10px;padding:10px;font-size:12px;color:#1e3a8a;margin-bottom:10px">' + esc(it.pistaDUA) + '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
          '<button id="bds-p-listen" type="button" style="background:#c2410c;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">\ud83d\udd0a Escuchar Audio (' + esc(it.lang) + ')</button>' +
          '<button id="bds-p-speak" type="button" style="background:#4338ca;color:#fff;border:none;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer">\ud83c\udf99\ufe0f Practicar Speaking</button></div>' +
          (ui.speakTxt ? '<div style="margin-bottom:10px;padding:8px 10px;border-radius:8px;background:#f1f5f9;font-size:12px;color:#0f172a"><strong>Voz detectada:</strong> ' + esc(ui.speakTxt) + '</div>' : '') +
          it.ops.map(function (o, idx) {
            var sel = ui.pSel === idx;
            return '<button data-pop="' + idx + '" type="button" style="width:100%;text-align:left;padding:11px 12px;margin-bottom:7px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;color:#0f172a;border:2px solid ' + (sel ? '#1e40af;background:#dbeafe' : '#94a3b8;background:#fff') + '">' + String.fromCharCode(65 + idx) + '. ' + esc(o) + '</button>';
          }).join("") +
          (ui.pSel !== null ? '<div style="margin-top:8px;padding:10px;border-radius:10px;font-size:13px;font-weight:700;background:' + (ui.pSel === it.ok ? '#dcfce7;color:#14532d;border:1.5px solid #15803d' : '#fef3c7;color:#451a03;border:1.5px solid #b45309') + '">' + esc(ui.pSel === it.ok ? it.feedback : ("Sigue intentando: " + it.feedback)) + '</div>' : '') +
          '<div style="display:flex;justify-content:space-between;margin-top:12px"><button id="bds-p-prev" type="button" style="padding:8px 14px;border-radius:8px;border:2px solid #475569;background:#fff;font-weight:800;cursor:pointer">Anterior</button><button id="bds-p-next" type="button" style="padding:8px 14px;border-radius:8px;border:none;background:#1e40af;color:#fff;font-weight:800;cursor:pointer">Siguiente</button></div></div>';
      }

      modal.innerHTML =
        '<div style="max-width:1020px;margin:8px auto;background:#f1f5f9;color:#0f172a;border-radius:18px;border:2px solid #94a3b8;overflow:hidden">' +
        '<div style="background:#fff;border-bottom:2px solid #cbd5e1;padding:10px 14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px">' +
        '<strong style="font-size:14px;color:#0f172a">pracTICAtecnica.com \u2022 Biblioteca Ilustrada &amp; DUA</strong>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        '<button data-vtab="manuales" type="button" style="padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "manuales" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Manuales PDF</button>' +
        '<button data-vtab="dua" type="button" style="padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #047857;background:' + (ui.tab === "dua" ? '#047857;color:#fff' : '#fff;color:#047857') + '">Motivaci\u00f3n DUA</button>' +
        '<button data-vtab="practica" type="button" style="padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #4338ca;background:' + (ui.tab === "practica" ? '#4338ca;color:#fff' : '#fff;color:#4338ca') + '">Idiomas &amp; Trivia</button>' +
        '<button id="bds-v74-close" type="button" style="padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Cerrar</button>' +
        '</div></div><div style="padding:14px">' + body + '</div></div>';

      document.getElementById("bds-v74-close").onclick = function () { detenerAudio(); modal.style.display = "none"; };
      modal.querySelectorAll("[data-vtab]").forEach(function (b) { b.onclick = function () { detenerAudio(); ui.tab = b.getAttribute("data-vtab"); render(); }; });

      if (ui.tab === "manuales") {
        var mAct2 = MANUALES.find(function (x) { return x.id === ui.manualSel; }) || MANUALES[0];
        modal.querySelectorAll("[data-msel]").forEach(function (b) { b.onclick = function () { detenerAudio(); ui.manualSel = b.getAttribute("data-msel"); render(); }; });
        document.getElementById("bds-m-listen").onclick = function () { hablarNeutral(mAct2.resumenAudio, "es-419", ui.rate); };
        document.getElementById("bds-m-pdf").onclick = function () { imprimirManualPdf(mAct2); };
        document.getElementById("bds-m-dl").onclick = function () { descargarManual(mAct2); };
      } else if (ui.tab === "dua") {
        modal.querySelectorAll("[data-dlang]").forEach(function (b) { b.onclick = function () { ui.lang = b.getAttribute("data-dlang"); render(); }; });
        modal.querySelectorAll("[data-drate]").forEach(function (b) { b.onclick = function () { ui.rate = Number(b.getAttribute("data-drate")); render(); }; });
        document.getElementById("bds-d-stop").onclick = detenerAudio;
        var bcp2 = { es: "es-419", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-BR" }[ui.lang] || "es-419";
        modal.querySelectorAll("[data-mplay]").forEach(function (b) {
          b.onclick = function () {
            var m = MOTIVACIONES_DUA.find(function (x) { return x.id === b.getAttribute("data-mplay"); });
            if (m) hablarNeutral(m[ui.lang] || m.es, bcp2, ui.rate);
          };
        });
      } else {
        var cur = MICRO_PRACTICAS[ui.pIdx] || MICRO_PRACTICAS[0];
        document.getElementById("bds-p-listen").onclick = function () { hablarNeutral(cur.audioText, cur.lang, ui.rate); };
        document.getElementById("bds-p-speak").onclick = function () {
          var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!Rec) { ui.speakTxt = "Tu navegador no soporta reconocimiento de voz; usa el bot\u00f3n Escuchar y repite en voz alta."; render(); return; }
          try {
            var rec = new Rec(); rec.lang = cur.lang; rec.interimResults = false;
            ui.speakTxt = "Escuchando... habla ahora."; render();
            rec.onresult = function (e) { ui.speakTxt = (e.results[0] && e.results[0][0] ? e.results[0][0].transcript : "Listo"); ui.xp += 10; render(); };
            rec.onerror = function () { ui.speakTxt = "Permite el micr\u00f3fono en tu navegador para practicar Speaking."; render(); };
            rec.start();
          } catch (_e) {}
        };
        modal.querySelectorAll("[data-pop]").forEach(function (b) {
          b.onclick = function () {
            var idx = Number(b.getAttribute("data-pop"));
            if (ui.pSel === null && idx === cur.ok) ui.xp += 15;
            ui.pSel = idx; render();
          };
        });
        document.getElementById("bds-p-prev").onclick = function () { detenerAudio(); ui.pIdx = Math.max(0, ui.pIdx - 1); ui.pSel = null; ui.speakTxt = ""; render(); };
        document.getElementById("bds-p-next").onclick = function () { detenerAudio(); ui.pIdx = Math.min(MICRO_PRACTICAS.length - 1, ui.pIdx + 1); ui.pSel = null; ui.speakTxt = ""; render(); };
      }
    }

    btn.onclick = function () { modal.style.display = "block"; render(); };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarBibliotecaDUA);
  else montarBibliotecaDUA();
})();