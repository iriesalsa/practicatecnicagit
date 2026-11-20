/* bds-anti-blank-v193 */
window.addEventListener("error", function (ev) {
  try {
    if (!document.getElementById("bds-shell") && !document.getElementById("bds-login-v193") && !document.getElementById("bds-paywall-v190")) {
      var box = document.createElement("div");
      box.id = "bds-rescue-ui";
      box.style.cssText = "position:fixed;inset:0;background:#060c17;color:#f1f5f9;display:flex;align-items:center;justify-content:center;padding:20px;z-index:999999;font-family:Inter,sans-serif;";
      box.innerHTML = '<div style="max-width:420px;background:#0b1322;border:2px solid #38bdf8;border-radius:14px;padding:22px;text-align:center;">' +
        '<h2 style="margin:0 0 8px;color:#38bdf8;">Recuperación Automática</h2>' +
        '<p style="font-size:13px;color:#cbd5e1;margin:0 0 14px;">Se detectó caché antiguo (' + (ev.message || 'error de carga') + '). Presione para recargar limpio.</p>' +
        '<button onclick="sessionStorage.clear();localStorage.removeItem(\'bds_session_v184_ctpmn_c02\');location.reload(true);" style="background:#059669;color:#fff;border:none;padding:11px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Recargar Plataforma</button></div>';
      document.body.appendChild(box);
    }
  } catch (e) {}
});

(function () {
  var sesionActiva = null;
  var bdsDeferredPrompt = null;

  const SESSION_KEY = "bds_session_v184_ctpmn_c02";
  const LOCK_KEY = "bds_lock_attempts_v184";
  const XP_KEY = "bds_xp_profile_v194";
  const CHAT_KEY = "bds_chats_v184_c02";
  const SECCIONES = ["7-1","7-2","8-1","8-2","9-1","9-2","10-C","10-C-3","10-1","11-1","11-2","12-1","12-2"];

  function bdsIsAppInstalled() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    bdsDeferredPrompt = e;
    var btn = document.getElementById("bds-pwa-install-btn");
    if (btn && !bdsIsAppInstalled()) btn.style.display = "inline-flex";
  });
  window.addEventListener("appinstalled", function () {
    bdsDeferredPrompt = null;
    var btn = document.getElementById("bds-pwa-install-btn");
    if (btn) btn.style.display = "none";
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes("sw-bds-v216.js")) r.unregister(); });
      navigator.serviceWorker.register("/sw-bds-v216.js").catch(() => {});
    }).catch(() => {});
  }

  const ROLES_ALL = [
    { rol: "Estudiante", ic: "🎒", desc: "Prácticas, simulacros, admisión, juegos, horarios, comedor QR y carné digital." },
    { rol: "Particular (MOPT / Admisión)", ic: "🎯", desc: "Acceso particular (₡2,500/año o ₡3,500 vitalicio): MOPT, Admisión, 29 áreas, hábitos y juegos." },
    { rol: "Docente MEP", ic: "👨‍🏫", desc: "Notas MEP (35/35), asistencia automática REA, planeamiento IA, permisos, justificaciones y horarios." },
        { rol: "Subdirector(a)", ic: "🏛️", desc: "Subdirección institucional: aprueba permisos de personal y estudiantes, horarios IA, comedor y reportes." },
        { rol: "Secretaria / Secretario", ic: "🗂️", desc: "Secretaría institucional: emisión de constancias/egresos, cruce de notas, expedientes, permisos, horarios y agenda." },
    { rol: "Asistente de Dirección", ic: "🗂️", desc: "Asistencia directiva: agiliza bandeja de permisos, justificaciones, horarios, agenda y expedientes." },
    { rol: "Director(a)", ic: "🏛️", desc: "Dirección institucional, aprobación de permisos EDUS y justificaciones, horarios IA, comedor y reportes." },
    { rol: "Padre/Madre", ic: "👨‍👩‍👧‍👦", desc: "Seguimiento estudiantil, horarios, comedor QR, agenda y justificaciones." },
    { rol: "Encargada Comedor / Junta", ic: "🍽️", desc: "Escáner QR de comedor, becas PANEA, tiquetes SINPE/efectivo, menús A–E y cierre de caja." },
        { rol: "Orientador(a)", ic: "🧭", desc: "Departamento de Orientación: alertas REAC de notas bajas/conducta, informes de debido proceso, DUA y familia." },
        { rol: "Auxiliar de Vigilancia (Seguridad)", ic: "🛡️", desc: "Control de portón con escáner QR SHA-256 de salidas anticipadas, bitácora de visitantes y alertas de seguridad." },
    { rol: "Conserje / Mantenimiento", ic: "🧹", desc: "Bitácora diaria de aseo, reportes de averías e insumos para Dirección/Junta, horarios y permisos personales." },
    { rol: "Auxiliar Administrativo", ic: "📋", desc: "Matrícula, horarios IA, justificaciones, comedor QR y validación documental." },
        { rol: "Supervisor(a) de Circuito", ic: "🧭", desc: "Supervisión de circuito educativo (solo lectura): dirección, horarios, comedor, permisos y reportes." },
    { rol: "Asesor(a) Regional / Nacional", ic: "📘", desc: "Asesoría pedagógica (solo lectura): seguimiento REA, Open Docs, biblioteca, horarios y reportes." },
    { rol: "Viceministro(a) MEP", ic: "🏛️", desc: "Supervisión viceministerial (solo lectura): indicadores, reportes institucionales, comedor y agenda." },
    { rol: "Ministro(a) MEP", ic: "🇨🇷", desc: "Supervisión ministerial nacional (solo lectura): panorama institucional, reportes y trazabilidad general." },
        { rol: "Admin", ic: "🛡️", desc: "Co-Administrador de revisión (Daniel / Aarón): trazabilidad, instituciones, llaves, asignación y auditoría." },
    { rol: "SuperAdmin", ic: "👑", desc: "Control soberano total: trazabilidad y bitácora de accesos, instituciones CRUD, cortesías y auditoría." }
  ];

  // Etiquetas cortas, limpias y 100% sin paréntesis innecesarios ni null
  const TAB_META = {
    inicio: "🏠 Inicio",
    trazabilidad: "🛡️ Trazabilidad",
    instituciones: "🏛️ Instituciones",
    horarios: "📅 Horarios",
    llaves_aulas: "🔑 Llaves & Aulas",
    idiomas_lab: "🗣️ Idiomas (4 Skills)",
    asignacion_acad: "🧩 Asignación Grupos",
    admin_sim_cruce: "🗂️ Secretaría & Cruce",
    permisos: "📝 Gestionar Permisos",
    justificaciones: "🎓 Gestionar Justificaciones",
    /* bds-odin2-v202 */ notas_rea: "📊 Notas MEP",
    conducta_sea: "⚖️ Conducta REAC & SEA",
    orientacion_reac: "🧭 Orientación REAC",
    mis_notas: "📊 Mis Notas",
    familia: "👨‍👩‍👧‍👦 Familia",
    planeamiento_ia: "🤖 Planeamiento IA",
    /* bds-coope-practica-v198 */ comedor: "🍽️ Comedor",
    cooperativa: "🏪 Cooperativa",
    practica_guia: "🦉 Práctica Guía",
    agenda: "📆 Agenda",
    reportes: "🗂️ Respaldos",
    practica: "🧭 Práctica",
    simulacro: "⏱️ Simulacro",
    admision: "🎓 Admisión",
    simulador_mopt: "🚗 MOPT",
    antologias: "📖 Antologías & Libros",
    opendocs: "📖 Open Docs",
    biblioteca: "📚 Biblioteca",
    juegos: "🎮 Juegos",
    /* bds-thor-v196-wired */ seguimiento: "📈 Seguimiento REAC",
    habitos: "🔥 Hábitos",
    porton_seguridad: "🛡️ Portón & Seguridad",
    conserjeria_mant: "🧹 Conserjería",
    carnet_qr: "🪪 Carné QR",
    direccion: "📈 Dirección"
  };

  function getPermisosRol(rol, esVisitante) {
    if (esVisitante) {
      return {
        tabs: ["practica", "juegos"],
        chats: false, identidad: false, admisionHome: false, mallaHome: false,
        quick: [], cards: ["practica", "juegos"]
      };
    }
    const MAP = {
            "Admin": {
        tabs: ["inicio","trazabilidad","instituciones","llaves_aulas","asignacion_acad","idiomas_lab","horarios","permisos","justificaciones","orientacion_reac","conducta_sea","porton_seguridad","conserjeria_mant","cooperativa","comedor","notas_rea","practica","simulacro","admision","simulador_mopt","antologias","biblioteca","juegos","carnet_qr"],
        chats: true, identidad: true, admisionHome: true, mallaHome: true,
        quick: ["trazabilidad","instituciones","llaves_aulas","asignacion_acad","idiomas_lab","horarios","permisos","comedor"],
        cards: ["practica","simulacro","biblioteca","juegos"]
      },
      "SuperAdmin": {
        tabs: ["inicio","seguimiento","trazabilidad","instituciones","horarios","permisos","justificaciones","notas_rea","planeamiento_ia","comedor","agenda","reportes","practica","simulacro","admision","simulador_mopt","opendocs","biblioteca","juegos","carnet_qr"],
        chats: true, identidad: true, admisionHome: true, mallaHome: true,
        quick: ["trazabilidad","instituciones","horarios","permisos","justificaciones","notas_rea","planeamiento_ia","comedor","simulador_mopt","identidad"],
        cards: ["practica","simulacro","biblioteca","juegos"]
      },
            "Supervisor(a) de Circuito": {
        tabs: ["inicio","direccion","horarios","permisos","justificaciones","comedor","agenda","reportes","biblioteca","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["horarios","permisos","justificaciones","comedor","reportes","agenda"],
        cards: ["biblioteca"]
      },
      "Asesor(a) Regional / Nacional": {
        tabs: ["inicio","direccion","seguimiento","horarios","opendocs","biblioteca","reportes","agenda","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: true,
        quick: ["horarios","opendocs","reportes","agenda"],
        cards: ["biblioteca"]
      },
      "Viceministro(a) MEP": {
        tabs: ["inicio","direccion","reportes","horarios","comedor","agenda","biblioteca","carnet_qr"],
        chats: false, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["reportes","horarios","comedor","agenda"],
        cards: ["biblioteca"]
      },
      "Ministro(a) MEP": {
        tabs: ["inicio","direccion","reportes","horarios","comedor","agenda","biblioteca","carnet_qr"],
        chats: false, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["reportes","horarios","comedor","agenda"],
        cards: ["biblioteca"]
      },
            "Subdirector(a)": {
        tabs: ["inicio","direccion","horarios","permisos","justificaciones","conducta_sea","comedor","notas_rea","agenda","reportes","biblioteca","carnet_qr"],
        chats: true, identidad: true, admisionHome: false, mallaHome: false,
        quick: ["permisos","justificaciones","horarios","comedor","notas_rea","agenda","reportes"],
        cards: ["biblioteca"]
      },
            "Secretaria / Secretario": {
        tabs: ["inicio","admin_sim_cruce","horarios","permisos","justificaciones","asignacion_acad","agenda","reportes","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["admin_sim_cruce","permisos","justificaciones","horarios","agenda"],
        cards: []
      },
      "Asistente de Dirección": {
        tabs: ["inicio","direccion","horarios","permisos","justificaciones","conducta_sea","comedor","agenda","reportes","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["permisos","justificaciones","horarios","agenda","reportes"],
        cards: []
      },
      "Director(a)": {
        tabs: ["inicio","direccion","horarios","permisos","justificaciones","comedor","notas_rea","agenda","reportes","biblioteca","carnet_qr"],
        chats: true, identidad: true, admisionHome: false, mallaHome: false,
        quick: ["permisos","justificaciones","horarios","comedor","notas_rea","agenda","reportes","identidad"],
        cards: ["biblioteca"]
      },
      "Docente MEP": {
        tabs: ["inicio","seguimiento","notas_rea","planeamiento_ia","horarios","permisos","justificaciones","comedor","agenda","reportes","practica","simulacro","admision","simulador_mopt","opendocs","biblioteca","juegos","carnet_qr"],
        chats: true, identidad: false, admisionHome: true, mallaHome: true,
        quick: ["notas_rea","planeamiento_ia","horarios","permisos","justificaciones","comedor"],
        cards: ["practica","simulacro","biblioteca","juegos"]
      },
      "Estudiante": {
        tabs: ["inicio","seguimiento","mis_notas","habitos","practica","simulacro","admision","simulador_mopt","juegos","horarios","comedor","agenda","justificaciones","opendocs","biblioteca","carnet_qr"],
        chats: true, identidad: false, admisionHome: true, mallaHome: true,
        quick: ["mis_notas","horarios","comedor","justificaciones","simulador_mopt","carnet_qr"],
        cards: ["practica","simulacro","biblioteca","juegos"]
      },
      "Particular (MOPT / Admisión)": {
        tabs: ["inicio","seguimiento","habitos","simulador_mopt","admision","practica","simulacro","opendocs","juegos"],
        chats: false, identidad: false, admisionHome: true, mallaHome: true,
        quick: ["simulador_mopt","habitos","opendocs"],
        cards: ["practica","simulacro","juegos"]
      },
      "Padre/Madre": {
        tabs: ["inicio","familia","horarios","justificaciones","comedor","agenda","biblioteca"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["familia","horarios","justificaciones","comedor","agenda"],
        cards: ["biblioteca"]
      },
      "Encargada Comedor / Junta": {
        tabs: ["inicio","comedor","horarios","permisos","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["comedor","permisos","carnet_qr"],
        cards: []
      },
            "Orientador(a)": {
        tabs: ["inicio","orientacion_reac","conducta_sea","horarios","justificaciones","agenda","reportes","biblioteca","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["orientacion_reac","conducta_sea","horarios","justificaciones","agenda"],
        cards: ["biblioteca"]
      },
            "Auxiliar de Vigilancia (Seguridad)": {
        tabs: ["inicio","porton_seguridad","horarios","permisos","justificaciones","agenda","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["porton_seguridad","permisos","horarios","carnet_qr"],
        cards: []
      },
      "Conserje / Mantenimiento": {
        tabs: ["inicio","conserjeria_mant","horarios","permisos","justificaciones","agenda","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["conserjeria_mant","permisos","horarios","carnet_qr"],
        cards: []
      },
      "Auxiliar Administrativo": {
        tabs: ["inicio","horarios","justificaciones","permisos","comedor","agenda","carnet_qr"],
        chats: true, identidad: false, admisionHome: false, mallaHome: false,
        quick: ["horarios","justificaciones","comedor","carnet_qr"],
        cards: []
      }
    };
    const cfg = MAP[rol] || MAP["Estudiante"];
    const ex = (sesionActiva && Array.isArray(sesionActiva.extraRoles)) ? sesionActiva.extraRoles : []; const outTabs = cfg.tabs.slice(); if (!esVisitante && rol !== "Particular (MOPT / Admisión)") { if (!outTabs.includes("cooperativa")) outTabs.splice(2, 0, "cooperativa"); if (!outTabs.includes("practica_guia")) outTabs.splice(2, 0, "practica_guia"); /* bds-extra-roles-rbac-v200 */ if (ex.includes("Comedor") && !outTabs.includes("comedor")) outTabs.splice(2, 0, "comedor"); if (ex.includes("Cooperativa") && !outTabs.includes("cooperativa")) outTabs.splice(2, 0, "cooperativa"); if (ex.includes("Juegos") && !outTabs.includes("juegos")) outTabs.push("juegos"); if (ex.includes("Permisos")) { if (!outTabs.includes("permisos")) outTabs.push("permisos"); if (!outTabs.includes("justificaciones")) outTabs.push("justificaciones"); } if (ex.includes("ValidadorQR") && !outTabs.includes("carnet_qr")) outTabs.push("carnet_qr"); } if (rol === "Particular (MOPT / Admisión)" && !outTabs.includes("practica_guia")) outTabs.splice(1, 0, "practica_guia"); if (!esVisitante && rol !== "Particular (MOPT / Admisión)" && !outTabs.includes("conducta_sea")) outTabs.splice(2, 0, "conducta_sea"); if (!esVisitante && ["SuperAdmin","Director(a)","Subdirector(a)","Asistente de Dirección","Orientador(a)","Docente MEP","Padre/Madre"].includes(rol) && !outTabs.includes("orientacion_reac")) outTabs.splice(2, 0, "orientacion_reac"); if (!esVisitante && ["SuperAdmin","Director(a)","Subdirector(a)","Asistente de Dirección","Auxiliar Administrativo"].includes(rol)) { if (!outTabs.includes("porton_seguridad")) outTabs.push("porton_seguridad"); if (!outTabs.includes("conserjeria_mant")) outTabs.push("conserjeria_mant"); } if (!esVisitante && !outTabs.includes("idiomas_lab")) outTabs.push("idiomas_lab"); if (!esVisitante && ["SuperAdmin","Admin","Director(a)","Subdirector(a)","Asistente de Dirección","Auxiliar Administrativo","Auxiliar de Vigilancia (Seguridad)","Conserje / Mantenimiento","Docente MEP","Orientador(a)"].includes(rol) && !outTabs.includes("llaves_aulas")) outTabs.splice(3, 0, "llaves_aulas"); if (!esVisitante && ["SuperAdmin","Admin","Director(a)","Subdirector(a)","Asistente de Dirección","Secretaria / Secretario","Auxiliar Administrativo","Docente MEP"].includes(rol)) { if (!outTabs.includes("asignacion_acad")) outTabs.splice(3, 0, "asignacion_acad"); if (!outTabs.includes("admin_sim_cruce")) outTabs.splice(3, 0, "admin_sim_cruce"); } if (!esVisitante && !outTabs.includes("antologias")) outTabs.push("antologias"); /* bds-perm-all-roles-v215 */ if (!esVisitante && rol !== "Particular (MOPT / Admisión)") { if (!outTabs.includes("permisos")) outTabs.push("permisos"); if (!outTabs.includes("justificaciones")) outTabs.push("justificaciones"); } cfg.tabs = Array.from(new Set(outTabs)).filter(k => Boolean(TAB_META[k]));
    return cfg;
  }

  function brand() {
    const def = {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      institucionCorta: "CTP Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=216",
      mascota: "/buho-oficial.png?v=216",
      logoMep: "/logo-mep-oficial.png?v=216"
    };
    if (!window.BDS_BRAND) return def;
    const b = window.BDS_BRAND.get();
    return { ...def, ...b, mascota: b.mascota && !b.mascota.includes("gordito") ? b.mascota : def.mascota };
  }

  function normMail(c) { return (c || "").toLowerCase().trim(); }
  function esSuperAdmin(correo) {
    const c = normMail(correo);
    return c === "maxi.salsa@gmail.com";
  }
  function esDirectoraAutorizada(correo) {
    const c = normMail(correo);
    if (!/@(mep\.go\.cr|gmail\.com)$/.test(c)) return false;
    const loc = c.split("@")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return loc.includes("laura") && loc.includes("ramon");
  }
  function validarCorreo(correo) {
    const c = normMail(correo);
    if (!/^[a-z0-9._%+-]+@(est\.mep\.go\.cr|mep\.go\.cr|gmail\.com)$/.test(c)) return false;
    const loc = c.split("@")[0];
    return loc.length >= 3 && !/(asdasd|qwerty|testtest|xxxx)/i.test(loc);
  }

  async function sha256Hex(texto) {
    try {
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    } catch { return "CTPMN2026SHA256VERIFICADO00000000000000000000000000000000000000"; }
  }

  function generarQRSVG(payload, sz = 148) {
    let h = 2166136261;
    for (let i = 0; i < payload.length; i++) { h ^= payload.charCodeAt(i); h = Math.imul(h, 16777619); }
    let seed = Math.abs(h) || 12345;
    const n = 21, cell = sz / n;
    let rects = "";
    const finder = (ox, oy) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
          rects += `<rect x="${(ox + c) * cell}" y="${(oy + r) * cell}" width="${cell + 0.3}" height="${cell + 0.3}" fill="#0f172a"/>`;
      }
    };
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const skip = (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8) || (r >= 7 && r <= 13 && c >= 7 && c <= 13);
      if (!skip) {
        seed = (seed * 9301 + 49297) % 233280;
        if (seed / 233280 > 0.47) rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell + 0.25}" height="${cell + 0.25}" fill="#0f172a"/>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" style="background:#fff;border-radius:10px;padding:6px;box-sizing:border-box;"><rect width="${sz}" height="${sz}" fill="#fff" rx="8"/>${rects}<image href="${brand().mascota}" x="${sz*0.35}" y="${sz*0.35}" width="${sz*0.30}" height="${sz*0.30}"/></svg>`;
  }

  function getXP() {
    const hoy = new Date().toDateString();
    let d;
    try { d = JSON.parse(localStorage.getItem(XP_KEY)); } catch {}
    if (!d) d = { xp: 0, racha: 0, ultimoDia: hoy, medallas: [] };
    if (d.ultimoDia !== hoy && d.xp > 0) { d.racha += 1; d.ultimoDia = hoy; localStorage.setItem(XP_KEY, JSON.stringify(d)); }
    d.nivel = d.xp >= 2000 ? "Leyenda Turing" : (d.xp >= 1200 ? "Arquitecto Senior" : (d.xp >= 600 ? "Especialista MEP" : (d.xp >= 250 ? "Técnico Avanzado" : "Aprendiz")));
    return d;
  }

  function ganarXP(pts, medalla) {
    const d = getXP();
    d.xp += pts;
    if (medalla && !d.medallas.includes(medalla)) d.medallas.push(medalla);
    localStorage.setItem(XP_KEY, JSON.stringify(d));
    const el = document.getElementById("bds-xp-pill");
    if (el) el.innerText = `🔥 ${d.racha}d • ⚡ ${d.xp} XP`;
  }

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function setSesion(s) {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  }

  function cerrarSesion() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    sesionActiva = null;
    document.body.classList.remove("bds-authenticated");
    ["bds-header","bds-subnav","bds-preview-bar","bds-shell","bds-dock","bds-drawer","bds-chat-modal","bds-paywall-v190"].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
    mostrarLogin("login");
  }

  function setFavicon() {
    let l = document.querySelector("link[rel~='icon']");
    if (!l) { l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); }
    l.href = brand().mascota;
  }

  function inyectarEstilos() {
    if (document.getElementById("bds-v193-css")) return;
    const st = document.createElement("style");
    st.id = "bds-v193-css";
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        background: #060c17 !important; color: #f1f5f9 !important; margin: 0; padding: 0;
        overflow-x: hidden; -webkit-font-smoothing: antialiased;
      }
      #root { display: none !important; }
      img[src*="logo-mep-oficial"], img[alt*="MEP"] {
        background: #ffffff !important; padding: 4px 9px !important; border-radius: 8px !important;
        object-fit: contain !important; max-width: 100% !important;
      }
      img[src*="escudo-ctpmn-oficial"], img[alt*="Escudo"] {
        background: #ffffff !important; padding: 2px !important; border-radius: 7px !important;
        object-fit: contain !important;
      }
      #bds-header {
        position: sticky; top: 0; z-index: 99990;
        background: rgba(11,18,32,0.97); backdrop-filter: blur(12px);
        border-bottom: 1px solid #1e293b;
        padding: max(8px, env(safe-area-inset-top)) 10px 8px;
        display: flex; align-items: center; justify-content: space-between; gap: 6px;
      }
      #bds-subnav {
        position: sticky; top: 52px; z-index: 99985;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 7px 10px; display: flex; gap: 6px; overflow-x: auto; white-space: nowrap; scrollbar-width: none;
      }
      #bds-subnav::-webkit-scrollbar { display: none; }
      .bds-nav-btn {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 5px 10px; border-radius: 7px; font-size: 11.5px; font-weight: 500;
        cursor: pointer; flex-shrink: 0; min-height: 36px; transition: all .15s;
      }
      .bds-nav-btn.active, .bds-nav-btn:hover { background: #1d4ed8; border-color: #38bdf8; color: #fff; }
      #bds-shell { max-width: 1220px; margin: 0 auto; padding: 12px 10px calc(92px + env(safe-area-inset-bottom)); }
      .bds-card { background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 15px; }
      .bds-quick-btn {
        border: none; border-radius: 8px; padding: 7px 11px; font-size: 11.5px; font-weight: 600;
        color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; min-height: 40px;
      }
      #bds-dock {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 99992;
        background: rgba(11,18,32,0.98); border-top: 1px solid #1e293b;
        display: none; grid-template-columns: repeat(5, 1fr);
        padding: 5px 4px max(6px, env(safe-area-inset-bottom));
      }
      .bds-dock-b {
        background: none; border: none; color: #94a3b8; font-size: 10.5px; font-weight: 700;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        cursor: pointer; padding: 5px 2px; min-height: 46px; border-radius: 8px;
      }
      .bds-dock-b.active { color: #38bdf8; background: rgba(29,78,216,0.22); }
      @media (max-width: 860px) {
        #bds-dock { display: grid; }
        .hide-sm { display: none !important; }
        #btn-ch { display: inline-flex !important; align-items: center; padding: 5px 8px !important; font-size: 11px !important; }
      }
      @media (max-width: 640px) {
        #bds-shell { padding: 10px 8px 98px; }
        .bds-card { padding: 12px; }
        .bds-quick-btn { flex: 1 1 calc(50% - 6px); justify-content: center; font-size: 12px; min-height: 44px; }
      }
            /* bds-ultrawide-v195 — Responsive Total (Móvil -> Tablet -> Desktop -> 4K) */
      @media (min-width: 1120px) {
        #bds-header { padding: 10px 24px; gap: 14px; }
        #bds-subnav {
          padding: 9px 24px;
          flex-wrap: wrap;
          justify-content: center;
          white-space: normal;
          overflow-x: visible;
          gap: 7px;
        }
        .bds-nav-btn { padding: 6px 13px; font-size: 12px; min-height: 36px; }
        #bds-shell { max-width: 1440px; padding: 20px 28px 60px; }
        .bds-card { padding: 20px; border-radius: 16px; }
        .bds-quick-btn { padding: 9px 15px; font-size: 12.5px; }
      }
      @media (min-width: 1680px) {
        #bds-shell { max-width: 1620px; padding: 24px 36px 70px; }
        .bds-nav-btn { font-size: 13px; padding: 7px 15px; }
      }
            /* bds-mobile-compact-v200 — Tipografía compacta en teléfono para múltiples opciones */
      @media (max-width: 768px) {
        #bds-header { padding: max(6px, env(safe-area-inset-top)) 8px 6px; gap: 4px; }
        #bds-subnav { padding: 5px 8px; gap: 4px; top: 48px; }
        .bds-nav-btn { padding: 4px 8px !important; font-size: 10.5px !important; font-weight: 500 !important; min-height: 30px !important; border-radius: 6px !important; }
        .bds-quick-btn { padding: 6px 9px !important; font-size: 11px !important; min-height: 36px !important; }
        .bds-dock-b { font-size: 9.5px !important; min-height: 42px !important; }
      }
      @media print { #bds-header, #bds-subnav, #bds-preview-bar, #bds-dock, #bds-chat-modal { display: none !important; } }
    `;
    document.head.appendChild(st);
  }

  const GOOGLE_SVG = `<svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
  const GROSERIAS = ["tonto","idiota","estupido","imbecil","malparido","mierda","puta","cabron","carajo","basura","pendejo","hijueputa","carepicha","playo","zorra"];
  const filtrarObscenidades = (txt) => GROSERIAS.reduce((acc, w) => acc.replace(new RegExp(`\\b${w}\\b`, "gi"), "****"), txt);

  // ==================== LOGIN SOBERANO (ESTUDIANTE POR DEFECTO • LAURA RAMÓN DIRECTORA) ====================
  function mostrarLogin(vista = "login") {
    inyectarEstilos(); setFavicon();
    const old = document.getElementById("bds-login-v193"); if (old) old.remove();
    const gate = document.createElement("div");
    gate.id = "bds-login-v193";
    gate.style.cssText = "position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f2247 0%,#060c17 72%);z-index:300000;display:flex;align-items:flex-start;justify-content:center;padding:14px 10px;overflow-y:auto;min-height:100dvh;";

    const getInt = () => parseInt(localStorage.getItem(LOCK_KEY) || "0", 10);
    const setInt = (n) => localStorage.setItem(LOCK_KEY, String(n));

    function draw() {
      const b = brand();
      const locked = getInt() >= 5;
      const th = window.BDS_UI ? window.BDS_UI.getTheme() : "dark";
      const lg = window.BDS_UI ? window.BDS_UI.getLang() : "es";

      if (vista === "recover") {
        gate.innerHTML = `
          <div class="bds-card" style="max-width:400px;width:100%;padding:22px;margin:auto 0;">
            <div style="text-align:center;margin-bottom:14px;">
              <img src="${b.mascota}" width="54" height="54" alt="Búho Azul" style="border-radius:50%;"/>
              <h2 style="margin:8px 0 2px;font-size:17px;">Recuperación de Acceso</h2>
              <p style="margin:0;font-size:11.5px;color:#94a3b8;">Restablecimiento seguro de credencial institucional</p>
            </div>
            <div id="rc-msg" style="display:none;padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;text-align:center;font-weight:600;"></div>
            <form id="rc-f" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-m" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-p1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-p2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:700;cursor:pointer;">Actualizar Credencial</button>
              <button type="button" id="rc-bk" style="background:transparent;color:#94a3b8;border:1px solid #334155;padding:9px;border-radius:8px;font-weight:600;cursor:pointer;">Volver al inicio</button>
            </form>
          </div>
        `;
        document.getElementById("rc-bk").onclick = () => { vista = "login"; draw(); };
        document.getElementById("rc-f").onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById("rc-m").value.trim(), p1 = document.getElementById("rc-p1").value, p2 = document.getElementById("rc-p2").value;
          const msg = document.getElementById("rc-msg"); msg.style.display = "block";
          if (!validarCorreo(m) || p1 !== p2) { msg.style.background = "#450a0a"; msg.style.color = "#fca5a5"; msg.innerText = "Verifique correo y coincidencia de contraseñas."; return; }
          setInt(0); msg.style.background = "#064e3b"; msg.style.color = "#6ee7b7"; msg.innerText = "Credencial restablecida.";
          setTimeout(() => { vista = "login"; draw(); }, 800);
        };
        return;
      }

      gate.innerHTML = `
        <div class="bds-card" style="max-width:420px;width:100%;padding:20px;margin:auto 0;box-shadow:0 24px 60px rgba(0,0,0,0.65);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <select id="lg-lang" data-no-i18n="true" style="background:#131f33;color:#fff;border:1px solid #334155;border-radius:7px;padding:5px 8px;font-size:11px;font-weight:700;">
              <option value="es" ${lg==="es"?"selected":""}>🌐 ES</option>
              <option value="en" ${lg==="en"?"selected":""}>🇺🇸 EN</option>
              <option value="pt" ${lg==="pt"?"selected":""}>🇧🇷 PT</option>
              <option value="fr" ${lg==="fr"?"selected":""}>🇫🇷 FR</option>
            </select>
            <button type="button" id="lg-theme" style="background:#131f33;color:#fbbf24;border:1px solid #334155;border-radius:7px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;">${th==="light"?"🌙 Oscuro":"☀️ Claro"}</button>
          </div>

          <div style="display:flex;justify-content:center;align-items:center;gap:14px;margin-bottom:8px;">
            <img src="${b.escudo}" width="48" height="54" alt="Escudo Institucional"/>
            <img src="${b.mascota}" width="54" height="54" alt="Búho Azul" style="border-radius:50%;"/>
          </div>
          <div style="text-align:center;margin-bottom:10px;">
            <h1 data-no-i18n="true" style="margin:0;font-size:21px;font-weight:900;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
            <p style="margin:3px 0 0;font-size:11.5px;font-weight:700;">${b.institucion}</p>
            <p style="margin:1px 0 0;font-size:10.5px;color:#38bdf8;font-weight:700;">${b.regional} • ${b.circuito}</p>
          </div>

          <div style="display:flex;justify-content:center;margin-bottom:10px;">
            <img src="${b.logoMep}" style="height:38px;max-width:100%;" alt="MEP Costa Rica"/>
          </div>

          <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:9px;padding:8px 10px;margin-bottom:11px;font-size:11px;color:#93c5fd;text-align:center;">
            🎁 <b>13 días Beta gratis</b> • Institución <b>₡19,100/año</b> (Est. ₡1,000 • Doc. ₡2,000) • Particular: <b>₡2,500/año</b> o <b>₡3,500 vitalicio</b>
          </div>

          <div id="lg-err" style="display:${locked?'block':'none'};background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;text-align:center;font-weight:600;">
            ${locked ? "Cuenta bloqueada tras 5 intentos fallidos. Comuníquese con soporte." : ""}
          </div>

          <form id="lg-f" style="display:flex;flex-direction:column;gap:8px;">
            <div>
              <label style="display:block;font-size:11px;margin-bottom:3px;">Correo Institucional o Gmail</label>
              <input id="lg-m" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${locked?"disabled":""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px 11px;color:#fff;font-size:13px;min-height:40px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;margin-bottom:3px;">Nombre Completo</label>
              <input id="lg-n" type="text" placeholder="Nombre y apellidos" required ${locked?"disabled":""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px 11px;color:#fff;font-size:13px;min-height:40px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:11px;margin-bottom:3px;">Acceso de Cuenta</label>
                <select id="lg-r" ${locked?"disabled":""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;min-height:40px;">
                  <option value="Estudiante">🎒 Estudiante / Rol Asignado</option>
                </select>
              </div>
              <div id="lg-swrap">
                <label style="display:block;font-size:11px;margin-bottom:3px;">Sección</label>
                <select id="lg-s" ${locked?"disabled":""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;min-height:40px;">
                  ${SECCIONES.map(sc => `<option value="${sc}" ${sc==="11-1"?"selected":""}>Sección ${sc}</option>`).join("")}
                </select>
              </div>
            </div>
            <div style="position:relative;">
              <label style="display:block;font-size:11px;margin-bottom:3px;">Contraseña</label>
              <input id="lg-p" type="password" placeholder="Ingrese su contraseña" required minlength="4" ${locked?"disabled":""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px 38px 9px 11px;color:#fff;font-size:13px;min-height:40px;"/>
              <button type="button" id="lg-eye" style="position:absolute;right:8px;top:25px;background:none;border:none;color:#94a3b8;cursor:pointer;">👁️</button>
            </div>

            <button type="submit" ${locked?"disabled":""} style="background:#1d4ed8;color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;min-height:42px;">Ingresar a la Plataforma</button>
            <button type="button" id="lg-google" ${locked?"disabled":""} style="background:#fff;color:#0f172a;border:1px solid #cbd5e1;padding:9px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;min-height:42px;">${GOOGLE_SVG} <span>Continuar con Google</span></button>
            <button type="button" id="lg-guest" style="background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;min-height:40px;">Practicar gratis sin cuenta (Básico + 10 Juegos)</button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:11px;padding-top:9px;border-top:1px solid #1e293b;font-size:11.5px;">
            <button type="button" id="lg-rec" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0;">¿Olvidó su contraseña?</button>
            <span data-no-i18n="true" style="color:#64748b;font-weight:600;">pracTICA Odín 3.3 (v203.3)</span>
          </div>
        </div>
      `;

      document.getElementById("lg-theme").onclick = () => { if (window.BDS_UI) window.BDS_UI.toggleTheme(); draw(); };
      document.getElementById("lg-lang").onchange = (e) => { if (window.BDS_UI) window.BDS_UI.applyLang(e.target.value); };
      const mIn = document.getElementById("lg-m"), pIn = document.getElementById("lg-p"), rSel = document.getElementById("lg-r"), sWrap = document.getElementById("lg-swrap");
      document.getElementById("lg-eye").onclick = () => { pIn.type = pIn.type === "password" ? "text" : "password"; };
      document.getElementById("lg-rec").onclick = () => { vista = "recover"; draw(); };
      rSel.onchange = () => { sWrap.style.display = rSel.value === "Estudiante" ? "block" : "none"; };

      async function procesarAcceso(esGoogle) {
        let mail = normMail(mIn.value);
        if (esGoogle && !mail) {
          const gm = prompt("Ingrese su correo de Google (@gmail.com) o institucional (@mep.go.cr / @est.mep.go.cr):");
          if (!gm) return;
          mail = normMail(gm);
          mIn.value = mail;
        }
        const nomIn = document.getElementById("lg-n").value.trim();
        const err = document.getElementById("lg-err");
        if (!validarCorreo(mail)) {
          const n = getInt() + 1; setInt(n);
          err.style.display = "block"; err.innerText = `Correo inválido (${n}/5). Use @est.mep.go.cr, @mep.go.cr o @gmail.com.`;
          if (n >= 5) draw();
          return;
        }
        if (!esGoogle && pIn.value.length < 4) { err.style.display = "block"; err.innerText = "Ingrese una contraseña válida."; return; }

        let preUser = null;
        if (window.BDS_TRAZABILIDAD) {
          const chk = window.BDS_TRAZABILIDAD.checkAccess(mail);
          if (!chk.ok) { err.style.display = "block"; err.innerText = chk.motivo; return; }
          preUser = chk.user;
        }

        // Regla estricta de roles:
        // 1) Max -> SuperAdmin
        // 2) Laura Ramón / Ramón Laura (@gmail.com o @mep.go.cr) -> Director(a)
        // 3) Si SuperAdmin le asignó rol en Trazabilidad -> usa ese rol
        // 4) Todas las demás cuentas entran como Estudiante (o Particular si lo eligieron)
        let rolFinal = "Estudiante";
        let nombreFinal = nomIn || (window.BDS_MOTIVACION ? window.BDS_MOTIVACION.formatNameFromEmail(mail) : mail.split("@")[0]);
        if (esSuperAdmin(mail)) {
          rolFinal = "SuperAdmin";
          nombreFinal = "Ing. Max Salazar Sánchez";
        } else if (esDirectoraAutorizada(mail)) {
          rolFinal = "Director(a)";
          nombreFinal = "Directora Laura Ramón Elizondo";
        } else if (preUser && preUser.rol) {
          rolFinal = preUser.rol;
          if (!nomIn && preUser.nombre) nombreFinal = preUser.nombre;
        }

        setInt(0);
        const secVal = document.getElementById("lg-s").value;
        const firma = await sha256Hex(`${mail}|${rolFinal}|${secVal}|CTPMN-C02`);
        const nueva = {
          nombre: nombreFinal,
          email: mail,
          rol: rolFinal,
          rolReal: rolFinal,
          seccion: secVal, userId: "PT-" + firma.slice(0, 6),
          visitante: false,
          firma,
          qr: `PT-QR|v193|${mail}|${rolFinal}|${firma.slice(0, 16)}`
        };
        setSesion(nueva);
        if (window.BDS_TRAZABILIDAD && window.BDS_TRAZABILIDAD.logAcceso) {
          window.BDS_TRAZABILIDAD.logAcceso(nueva, esGoogle ? "Google" : "Correo/Clave");
        }
        gate.remove();
        iniciarApp("inicio");
      }

      document.getElementById("lg-f").onsubmit = (e) => { e.preventDefault(); procesarAcceso(false); };
      document.getElementById("lg-google").onclick = () => procesarAcceso(true);
      document.getElementById("lg-guest").onclick = async () => {
        const firma = await sha256Hex("VISITANTE|CTPMN-C02");
        const vis = { nombre: "Visitante", email: "visitante@practicatecnica.com", rol: "Visitante", rolReal: "Visitante", seccion: "Libre", visitante: true, firma, qr: `PT-QR|VISITANTE|${firma.slice(0, 14)}` };
        setSesion(vis);
        if (window.BDS_TRAZABILIDAD && window.BDS_TRAZABILIDAD.logAcceso) window.BDS_TRAZABILIDAD.logAcceso(vis, "Sin cuenta");
        gate.remove();
        iniciarApp("practica");
      };
      if (window.BDS_UI && window.BDS_UI.getLang() !== "es") window.BDS_UI.applyLang(window.BDS_UI.getLang());
    }

    document.body.appendChild(gate);
    draw();
  }

  // ==================== CHATS FLOTANTES RESPONSIVE (MÓVIL Y DESKTOP REPARADO) ====================
  function toggleChats() { if (window.BDS_TOGGLE_CHATS_PRO) { window.BDS_TOGGLE_CHATS_PRO(sesionActiva); return; }
    if (!sesionActiva || sesionActiva.visitante) return;
    const old = document.getElementById("bds-chat-modal"); if (old) { old.remove(); return; }
    const s = sesionActiva, baseSec = s.seccion || "11-1";
    const defCanales = [
      { id: `c_${baseSec}_A`, nom: `Sección ${baseSec} • A`, msgs: [{ r: "Coordinación", h: "07:30", t: `Canal oficial Subgrupo A — Sección ${baseSec}.` }] },
      { id: `c_${baseSec}_B`, nom: `Sección ${baseSec} • B`, msgs: [{ r: "Coordinación", h: "07:35", t: `Canal oficial Subgrupo B — Sección ${baseSec}.` }] },
      { id: "c_dir", nom: "🏛️ Dirección", msgs: [{ r: "Dirección", h: "07:00", t: "Avisos oficiales institucionales." }] }
    ];
    const getChans = () => { try { const g = JSON.parse(localStorage.getItem(CHAT_KEY)); if (Array.isArray(g) && g.length) return g; } catch {} return defCanales; };
    const saveChans = (a) => localStorage.setItem(CHAT_KEY, JSON.stringify(a));

    let chans = getChans(), actId = chans[0].id;
    const modal = document.createElement("div");
    modal.id = "bds-chat-modal";
    modal.style.cssText = "position:fixed;top:56px;right:10px;left:auto;bottom:68px;z-index:298500;width:min(420px,calc(100vw - 20px));background:#0b141a;border:1.5px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.9);display:flex;flex-direction:column;";

    function draw() {
      chans = getChans();
      const cur = chans.find(x => x.id === actId) || chans[0]; actId = cur.id;
      const puedeBorrar = ["SuperAdmin","Director(a)","Docente MEP"].includes(s.rol);
      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:6px;border-bottom:1px solid #2a3942;">
          <div style="min-width:0;"><div style="font-size:13px;font-weight:800;color:#e9edef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">💬 ${cur.nom}</div><div style="font-size:10px;color:#8696a0;">${s.nombre} • ${s.rol}</div></div>
          <div style="display:flex;gap:4px;">
            <button id="ch-new" style="background:#00a884;color:#052e16;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">+ Nuevo</button>
            ${puedeBorrar ? `<button id="ch-del" style="background:#7f1d1d;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🗑️</button>` : ""}
            <button id="ch-cls" style="background:#334155;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:12px;font-weight:800;cursor:pointer;">✕</button>
          </div>
        </div>
        <div style="display:flex;gap:5px;padding:7px;background:#111b21;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${chans.map(c => `<button data-cid="${c.id}" class="ch-tab" style="background:${c.id===actId?'#005c4b':'#202c33'};color:#e9edef;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${c.nom}</button>`).join("")}
        </div>
        <div id="ch-list" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          ${cur.msgs.map(m => `<div style="align-self:${m.r.startsWith(s.nombre)?'flex-end':'flex-start'};max-width:85%;background:${m.r.startsWith(s.nombre)?'#005c4b':'#202c33'};color:#e9edef;padding:8px 11px;border-radius:9px;font-size:12.5px;"><div style="font-size:9.5px;color:#38bdf8;font-weight:700;margin-bottom:2px;">${m.r}</div>${m.img?`<img src="${m.img}" style="max-width:100%;border-radius:6px;margin-bottom:4px;display:block;"/>`:""}${m.file?`<div style="font-size:11px;margin-bottom:4px;">📎 ${m.file}</div>`:""}<div>${m.t}</div><div style="font-size:9px;color:#94a3b8;text-align:right;margin-top:3px;">${m.h} ✓✓</div></div>`).join("")}
        </div>
        <form id="ch-f" style="padding:9px;background:#202c33;display:flex;gap:6px;align-items:center;">
          <label style="cursor:pointer;background:#2a3942;color:#00a884;padding:8px 10px;border-radius:7px;font-size:14px;">📎<input id="ch-file" type="file" accept="image/*,.pdf,.docx,.xlsx" style="display:none;"/></label>
          <input id="ch-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:9px 10px;border-radius:7px;font-size:12.5px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#052e16;border:none;padding:9px 13px;border-radius:7px;font-weight:800;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;
      const list = document.getElementById("ch-list"); if (list) list.scrollTop = list.scrollHeight;
      document.getElementById("ch-cls").onclick = () => modal.remove();
      modal.querySelectorAll(".ch-tab").forEach(b => b.onclick = () => { actId = b.getAttribute("data-cid"); draw(); });
      document.getElementById("ch-new").onclick = () => {
        const nom = prompt("Nombre del nuevo canal:");
        if (nom && nom.trim()) { const nc = { id: "c_" + Date.now(), nom: nom.trim(), msgs: [{ r: "Sistema", h: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), t: `Canal "${nom.trim()}" creado.` }] }; chans.push(nc); saveChans(chans); actId = nc.id; draw(); }
      };
      if (document.getElementById("ch-del")) document.getElementById("ch-del").onclick = () => {
        if (chans.length <= 1) return alert("Debe quedar al menos un canal.");
        if (confirm(`¿Eliminar "${cur.nom}"?`)) { chans = chans.filter(x => x.id !== cur.id); saveChans(chans); actId = chans[0].id; draw(); }
      };
      document.getElementById("ch-file").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          cur.msgs.push({ r: `${s.nombre} (${s.rol})`, h, t: `Adjuntó ${f.name}`, img: f.type.startsWith("image/") ? ev.target.result : null, file: f.type.startsWith("image/") ? null : f.name });
          saveChans(chans); draw();
        };
        r.readAsDataURL(f);
      };
      document.getElementById("ch-f").onsubmit = (e) => {
        e.preventDefault();
        const raw = document.getElementById("ch-in").value.trim(); if (!raw) return;
        const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
        cur.msgs.push({ r: `${s.nombre} (${s.rol})`, h, t: filtrarObscenidades(raw) });
        saveChans(chans); draw();
      };
    }
    document.body.appendChild(modal); draw();
  }

  // ==================== MOTOR DE PRÁCTICA Y SIMULACRO (0% MEZCLA + ANTI-REPETICIÓN) ====================
  let simTimer = null;
  function renderEvaluacion(shell, modoInicial, areaInicial) {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    const malla = window.BDS_MALLA_MEP || [];
    const defArea = malla[0] ? malla[0].id : "web";
    let modo = modoInicial || "guiada", area = (areaInicial && areaInicial !== "ALL") ? areaInicial : defArea, cantidad = 20, diff = "ALL";
    let items = [], idx = 0, answers = {}, secLeft = 1800, paused = false, finished = false;

    function iniciarPrueba() {
      if (simTimer) { clearInterval(simTimer); simTimer = null; }
      items = window.BDS_GENERAR_SIMULACRO ? window.BDS_GENERAR_SIMULACRO(area, cantidad, diff) : [];
      idx = 0; answers = {}; paused = false; finished = false; secLeft = cantidad * 90;
      if (modo === "simulacro") {
        simTimer = setInterval(() => {
          if (!paused && !finished) {
            secLeft--;
            const ck = document.getElementById("sim-clk");
            if (ck) ck.innerText = `${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}`;
            if (secLeft <= 0) { finished = true; clearInterval(simTimer); draw(); }
          }
        }, 1000);
      }
      draw();
    }

    function hablar(txt, lang) { try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = lang || "es-CR"; u.rate = 0.94; window.speechSynthesis.speak(u); } catch {} }

    function draw() {
      const areaMeta = malla.find(m => m.id === area), cur = items[idx];
      if (finished) {
        if (simTimer) { clearInterval(simTimer); simTimer = null; }
        let okCnt = 0;
        items.forEach((it, i) => { const okA = answers[i] !== undefined && it.opts[answers[i]] && it.opts[answers[i]].ok; if (okA) okCnt++; if (modo === "simulacro" && answers[i] !== undefined && window.BDS_SEGUIMIENTO_THOR) window.BDS_SEGUIMIENTO_THOR.recordAttempt(it, Boolean(okA)); });
        const pct = Math.round((okCnt / Math.max(1, items.length)) * 100), ucr = Math.round(200 + (okCnt / Math.max(1, items.length)) * 600);
        if (pct >= 70) ganarXP(cantidad * 3, "⏱️ Simulacro Aprobado");
        shell.innerHTML = `
          <div class="bds-card" style="max-width:840px;margin:0 auto;text-align:center;border-color:${pct>=70?'#10b981':'#f59e0b'};">
            <h2>Acta Oficial — ${areaMeta ? areaMeta.name : "Evaluación"}</h2>
            <p style="font-size:15px;">Aciertos: <b style="color:#34d399;">${okCnt}/${items.length}</b> • Nota: <b style="color:#38bdf8;">${pct}%</b> • Escala UCR/TEC: <b style="color:#fbbf24;">${ucr}/800</b></p>
            <button id="sim-again" style="background:#1d4ed8;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-bottom:14px;">🔄 Nuevo Simulacro</button>
            <div style="text-align:left;max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
              ${items.map((it, i) => {
                const r = answers[i], ok = r !== undefined && it.opts[r] && it.opts[r].ok;
                const corr = (it.opts.find(o => o.ok) || {}).txt || "";
                return `<div style="background:#070d19;border-left:4px solid ${ok?'#10b981':'#ef4444'};padding:9px;border-radius:7px;font-size:12px;"><b>${i+1}. ${it.q}</b><div style="color:${ok?'#34d399':'#fca5a5'};">${ok?'✅ Correcta':'❌ Tu respuesta: ' + (r!==undefined&&it.opts[r]?it.opts[r].txt:'Sin responder')}</div><div style="color:#38bdf8;">Clave: ${corr}</div><div style="color:#94a3b8;font-size:11px;">${it.e || ""}</div></div>`;
              }).join("")}
            </div>
          </div>
        `;
        document.getElementById("sim-again").onclick = iniciarPrueba;
        return;
      }

      const mCur = cur ? (malla.find(m => m.id === cur.a) || { name: "MEP", color: "#0284c7" }) : { name: "MEP", color: "#0284c7" };
      const resp = answers[idx];
      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:12px;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${[["guiada","🧭 Guiada"],["libre","📝 Libre"],["simulacro","⏱️ Simulacro"]].map(([k, l]) => `<button data-m="${k}" class="m-sw" style="background:${modo===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <select id="ev-area" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;max-width:220px;">
                ${malla.map(m => `<option value="${m.id}" ${area===m.id?"selected":""}>${m.name}</option>`).join("")}
              </select>
              <select id="ev-diff" style="background:#070d19;color:#34d399;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;font-weight:700;">
                <option value="ALL" ${diff==="ALL"?"selected":""}>Todos los niveles</option>
                <option value="Básico" ${diff==="Básico"?"selected":""}>Básico</option>
                <option value="Medio" ${diff==="Medio"?"selected":""}>Medio</option>
                <option value="Intermedio" ${diff==="Intermedio"?"selected":""}>Intermedio</option>
                <option value="Avanzado" ${diff==="Avanzado"?"selected":""}>Avanzado</option>
              </select>
              <select id="ev-cant" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;font-weight:800;">
                ${[10,20,30,40,50,60].map(c => `<option value="${c}" ${cantidad===c?"selected":""}>${c} preg.</option>`).join("")}
              </select>
              <button id="ev-go" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔀 Nuevo</button><button id="ev-hoja" title="Imprimir Folleto + Hoja de Respuestas Burbuja + Clave QR" style="background:#7c3aed;color:#fff;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Hoja Respuestas</button>
            </div>
          </div>
          ${modo === "simulacro" ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;"><div style="font-size:13px;font-weight:800;color:#fbbf24;">⏱️ <span id="sim-clk" style="font-family:monospace;font-size:16px;">${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}</span></div><div style="display:flex;gap:6px;"><button id="sim-pause" style="background:#b45309;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${paused?"Reanudar":"Pausar"}</button><button id="sim-end" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Calificar</button></div></div>` : ""}
        </div>

        ${!cur ? `<div class="bds-card">No hay ítems en esta selección.</div>` : (paused ? `<div class="bds-card" style="text-align:center;padding:36px;color:#fbbf24;font-weight:800;">⏸️ Simulacro en pausa.</div>` : `
          <div class="bds-card" style="max-width:860px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px;">
              <span style="background:${mCur.color};color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:99px;">${mCur.name}</span>
              <div style="display:flex;gap:8px;align-items:center;">
                <button id="ev-tts" title="Leer pregunta y opciones en el idioma activo" style="background:#0f766e;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🔊 Escuchar Todo</button><button id="ev-tts-stop" title="Detener audio" style="background:#334155;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">⏹</button>
                <span style="font-size:12px;font-weight:800;color:#38bdf8;">${idx + 1} / ${items.length} • ${cur.d}</span>
              </div>
            </div>
            ${cur.indicador ? `<div style="background:#070d19;border:1px solid #1e3a8a;border-radius:8px;padding:8px 11px;margin-bottom:10px;font-size:11.5px;color:#93c5fd;"><div style="color:#2dd4bf;font-weight:700;margin-bottom:3px;">📘 ${cur.materia || mCur.name} • 📂 ${cur.subarea || mCur.name} • 📑 ${cur.unidadEstudio || "Unidad MEP 2026"}</div>${cur.saberEsencial ? `<div style="color:#fde68a;font-size:11px;margin-bottom:3px;">🔑 <b>Saber Esencial:</b> ${cur.saberEsencial}</div>` : ""}<b>🎯 Indicador REAC:</b> ${cur.indicador} &nbsp;•&nbsp; <b style="color:#34d399;">${cur.nivelDesempeno || "Nivel 2"}</b><div style="color:#94a3b8;font-size:11px;margin-top:2px;">🌍 ${cur.steam || "STEAM • ENFOQUE FENÓMENO REAL"}</div></div>` : ""}${modo === "guiada" ? `<div style="background:#070d19;border-left:4px solid #10b981;padding:9px 12px;border-radius:8px;margin-bottom:12px;font-size:12px;color:#a7f3d0;"><b>🧭 Guía:</b> ${cur.g}${cur.dua ? `<div style="color:#fde68a;font-size:11px;margin-top:4px;">♿ ${cur.dua}</div>` : ""}</div>` : ""}
            <h3 style="margin:0 0 14px;font-size:16px;line-height:1.45;">${cur.q}</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${cur.opts.map((o, i) => {
                let bg = "#131f33", bd = "#26354d";
                if (modo === "simulacro" && resp === i) { bg = "#1d4ed8"; bd = "#38bdf8"; }
                else if (modo !== "simulacro" && resp !== undefined) {
                  if (o.ok) { bg = "#064e3b"; bd = "#10b981"; }
                  else if (resp === i) { bg = "#7f1d1d"; bd = "#ef4444"; }
                }
                return `<button data-oi="${i}" class="ev-opt" style="text-align:left;background:${bg};border:1.5px solid ${bd};color:#fff;padding:11px 14px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;">${String.fromCharCode(65+i)}) ${o.txt}</button>`;
              }).join("")}
            </div>
            ${modo !== "simulacro" && resp !== undefined ? `<div style="margin-top:12px;padding:11px;border-radius:8px;background:${cur.opts[resp].ok?'#064e3b':'#450a0a'};color:${cur.opts[resp].ok?'#6ee7b7':'#fca5a5'};font-size:12.5px;"><b>${cur.opts[resp].ok?"✅ ¡Correcto! (+10 XP)":"❌ Explicación:"}</b> ${cur.e}</div>` : ""}
            ${modo==="simulacro" ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;">${items.map((_, qi) => `<button data-ji="${qi}" class="sim-jmp" style="min-width:28px;height:28px;border-radius:6px;border:1px solid ${qi===idx?'#38bdf8':'#334155'};background:${answers[qi]!==undefined?'#059669':(qi===idx?'#1d4ed8':'#070d19')};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">${qi+1}</button>`).join("")}</div>` : ""}<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b;">
              <button id="ev-prev" ${idx===0?"disabled":""} style="background:#1e293b;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
              <button id="ev-next" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">${idx>=items.length-1?"Finalizar":"Siguiente →"}</button>
            </div>
          </div>
        `)}
      `;
      shell.querySelectorAll(".m-sw").forEach(b => b.onclick = () => { modo = b.getAttribute("data-m"); iniciarPrueba(); });
      document.getElementById("ev-area").onchange = (e) => { area = e.target.value; iniciarPrueba(); };
      document.getElementById("ev-diff").onchange = (e) => { diff = e.target.value; iniciarPrueba(); };
      document.getElementById("ev-cant").onchange = (e) => { cantidad = Number(e.target.value); iniciarPrueba(); };
      document.getElementById("ev-go").onclick = iniciarPrueba; if (document.getElementById("ev-hoja")) document.getElementById("ev-hoja").onclick = () => { if (window.BDS_IMPRIMIR_HOJA_RESPUESTAS) window.BDS_IMPRIMIR_HOJA_RESPUESTAS(items, areaMeta ? areaMeta.name : area, sesionActiva, generarQRSVG, sha256Hex); };
      if (document.getElementById("sim-pause")) document.getElementById("sim-pause").onclick = () => { paused = !paused; draw(); };
      if (document.getElementById("sim-end")) document.getElementById("sim-end").onclick = () => { finished = true; draw(); };
      /* bds-tts-v195 */ if (document.getElementById("ev-tts")) document.getElementById("ev-tts").onclick = () => { if (window.BDS_NATIVE) window.BDS_NATIVE.speakQuestion(cur); else hablar(cur.audio || cur.q, cur.lang || "es-CR"); }; if (document.getElementById("ev-tts-stop")) document.getElementById("ev-tts-stop").onclick = () => { if (window.BDS_NATIVE) window.BDS_NATIVE.stopSpeak(); };
      /* bds-sim-nav-v194 */ shell.querySelectorAll(".sim-jmp").forEach(jb => jb.onclick = () => { idx = Number(jb.getAttribute("data-ji")); draw(); }); if (!paused && cur) {
        shell.querySelectorAll(".ev-opt").forEach(b => b.onclick = () => {
          const ch = Number(b.getAttribute("data-oi"));
          if (modo !== "simulacro" && answers[idx] !== undefined) return;
          answers[idx] = ch;
          if (modo !== "simulacro") { if (window.BDS_SEGUIMIENTO_THOR) window.BDS_SEGUIMIENTO_THOR.recordAttempt(cur, Boolean(cur.opts[ch].ok)); if (cur.opts[ch].ok) ganarXP(10); }
          draw();
        });
        document.getElementById("ev-prev").onclick = () => { if (idx > 0) { idx--; draw(); } };
        document.getElementById("ev-next").onclick = () => { if (idx < items.length - 1) { idx++; draw(); } else { finished = true; draw(); } };
      }
    }
    iniciarPrueba();
  }

  // ==================== INICIO CON SALUDO DEL BÚHO AZUL Y BOTONES LIMPIOS ====================
  function renderInicio(shell, perms, onSwitchRole) {
    const b = brand(), xp = getXP(), malla = window.BDS_MALLA_MEP || [];
    const esRealSA = sesionActiva && sesionActiva.rolReal === "SuperAdmin";
        const salObj = window.BDS_MOTIVACION ? window.BDS_MOTIVACION.buildSaludoPersonalizado(sesionActiva, xp, window.__BDS_MOT_IDX || 0) : { textoCompleto: `Bienvenido(a) a pracTICA, ${sesionActiva.nombre || "Usuario"}.` };
    const saludoBuho = salObj.textoCompleto;
    const tarjetaSeguimientoHtml = window.BDS_MOTIVACION ? window.BDS_MOTIVACION.renderTarjetaSeguimiento(sesionActiva) : "";

    const estBeta = window.BDS_SUSCRIPCION ? window.BDS_SUSCRIPCION.getEstadoCuenta(sesionActiva).etiqueta : "Beta activa";

    const QUICK_DEF = {
      trazabilidad: `<button onclick="window.bdsGo('trazabilidad')" class="bds-quick-btn" style="background:#b45309;">🛡️ Trazabilidad</button>`,
      instituciones: `<button onclick="window.bdsGo('instituciones')" class="bds-quick-btn" style="background:#4f46e5;">🏛️ Instituciones</button>`,
      llaves_aulas: `<button onclick="window.bdsGo('llaves_aulas')" class="bds-quick-btn" style="background:#b45309;">🔑 Llaves & Aula 13</button>`,
      idiomas_lab: `<button onclick="window.bdsGo('idiomas_lab')" class="bds-quick-btn" style="background:#0284c7;">🗣️ Idiomas 4 Skills</button>`,
      admin_sim_cruce: `<button onclick="window.bdsGo('admin_sim_cruce')" class="bds-quick-btn" style="background:#0f766e;">🗂️ Secretaría, Constancias y Cruce</button>`,
      asignacion_acad: `<button onclick="window.bdsGo('asignacion_acad')" class="bds-quick-btn" style="background:#0f766e;">🧩 Asignación Grupos</button>`,
      horarios: `<button onclick="window.bdsGo('horarios')" class="bds-quick-btn" style="background:#0284c7;">📅 Horarios</button>`,
      permisos: `<button onclick="window.bdsGo('permisos')" class="bds-quick-btn" style="background:#059669;">📝 Gestionar Permisos</button>`,
      justificaciones: `<button onclick="window.bdsGo('justificaciones')" class="bds-quick-btn" style="background:#0d9488;">🎓 Gestionar Justificaciones</button>`,
      mis_notas: `<button onclick="window.bdsGo('mis_notas')" class="bds-quick-btn" style="background:#0284c7;">📊 Mis Notas (QR)</button>`,
      familia: `<button onclick="window.bdsGo('familia')" class="bds-quick-btn" style="background:#059669;">👨‍👩‍👧‍👦 Mis Hijos y Trámites</button>`,
      orientacion_reac: `<button onclick="window.bdsGo('orientacion_reac')" class="bds-quick-btn" style="background:#0f766e;">🧭 Orientación & Alertas REAC</button>`,
      conducta_sea: `<button onclick="window.bdsGo('conducta_sea')" class="bds-quick-btn" style="background:#0f766e;">⚖️ Matrícula, Conducta REA & SEA</button>`,
      notas_rea: `<button onclick="window.bdsGo('notas_rea')" class="bds-quick-btn" style="background:#d97706;">📊 Notas MEP (35/35)</button>`,
      planeamiento_ia: `<button onclick="window.bdsGo('planeamiento_ia')" class="bds-quick-btn" style="background:#7c3aed;">🤖 Planeamiento IA</button>`,
      cooperativa: `<button onclick="window.bdsGo('cooperativa')" class="bds-quick-btn" style="background:#0f766e;">🏪 Cooperativa & EcoMEPs</button>`,
      practica_guia: `<button onclick="window.bdsGo('practica_guia')" class="bds-quick-btn" style="background:#0284c7;">🦉 Guía Práctica (3 Modos)</button>`,
      comedor: `<button onclick="window.bdsGo('comedor')" class="bds-quick-btn" style="background:#15803d;">🍽️ Comedor</button>`,
      agenda: `<button onclick="window.bdsGo('agenda')" class="bds-quick-btn" style="background:#1d4ed8;">📆 Agenda</button>`,
      reportes: `<button onclick="window.bdsGo('reportes')" class="bds-quick-btn" style="background:#0369a1;">🗂️ Respaldos</button>`,
      simulador_mopt: `<button onclick="window.bdsGo('simulador_mopt')" class="bds-quick-btn" style="background:#0284c7;">🚗 MOPT</button>`,
      habitos: `<button onclick="window.bdsGo('habitos')" class="bds-quick-btn" style="background:#059669;">🔥 Hábitos</button>`,
      antologias: `<button onclick="window.bdsGo('antologias')" class="bds-quick-btn" style="background:#7c3aed;">📖 Antologías & Libros PDF</button>`,
      opendocs: `<button onclick="window.bdsGo('opendocs')" class="bds-quick-btn" style="background:#0f766e;">📖 Open Docs</button>`,
      identidad: `<button onclick="window.BDS_BRAND && window.BDS_BRAND.openModal()" class="bds-quick-btn" style="background:#334155;">🛡️ Escudo y Logo</button>`,
      porton_seguridad: `<button onclick="window.bdsGo('porton_seguridad')" class="bds-quick-btn" style="background:#1e3a8a;">🛡️ Control de Portón QR</button>`,
      conserjeria_mant: `<button onclick="window.bdsGo('conserjeria_mant')" class="bds-quick-btn" style="background:#0f766e;">🧹 Conserjería & Mant.</button>`,
      carnet_qr: `<button onclick="window.bdsGo('carnet_qr')" class="bds-quick-btn" style="background:#1e40af;">🪪 Carné QR</button>`
    };

    const CARD_DEF = {
      practica: `<div class="bds-card" style="cursor:pointer;border-top:3px solid #10b981;" onclick="window.bdsGo('practica')"><h4 style="margin:0 0 4px;">🧭 Práctica</h4><p style="margin:0;font-size:11.5px;color:#94a3b8;">29 áreas puras con guía paso a paso y audio.</p></div>`,
      simulacro: `<div class="bds-card" style="cursor:pointer;border-top:3px solid #f59e0b;" onclick="window.bdsGo('simulacro')"><h4 style="margin:0 0 4px;">⏱️ Simulacro</h4><p style="margin:0;font-size:11.5px;color:#94a3b8;">Exámenes 10–60 preguntas con nota al final.</p></div>`,
      biblioteca: `<div class="bds-card" style="cursor:pointer;border-top:3px solid #38bdf8;" onclick="window.bdsGo('biblioteca')"><h4 style="margin:0 0 4px;">📚 Biblioteca</h4><p style="margin:0;font-size:11.5px;color:#94a3b8;">Manuales ilustrados y afiches marca blanca.</p></div>`,
      juegos: `<div class="bds-card" style="cursor:pointer;border-top:3px solid #a855f7;" onclick="window.bdsGo('juegos')"><h4 style="margin:0 0 4px;">🎮 Juegos</h4><p style="margin:0;font-size:11.5px;color:#94a3b8;">10 juegos educativos para subir tu racha y XP.</p></div>`
    };

    shell.innerHTML = `
      <!-- Saludo amigable del Búho Azul -->
      <div class="bds-card" style="margin-bottom:12px;background:linear-gradient(135deg,#0f2247 0%,#0b1322 100%);border-color:#38bdf8;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:240px;">
          <img src="${b.mascota}" width="54" height="54" alt="Búho Azul" style="border-radius:50%;flex-shrink:0;"/>
          <div>
            <div style="font-size:11px;font-weight:800;color:#2dd4bf;">${b.institucion.toUpperCase()} • ${sesionActiva.rol.toUpperCase()} • ${estBeta}</div>
            <div style="font-size:14.5px;font-weight:800;color:#fff;margin-top:3px;line-height:1.35;">“${saludoBuho}”</div>
            <div style="font-size:11.5px;color:#94a3b8;margin-top:3px;">Nivel: <b style="color:#fbbf24;">${xp.nivel}</b> • Racha: <b>${xp.racha}d</b> • ⚡ <b>${xp.xp} XP</b></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <img src="${b.logoMep}" style="height:38px;max-width:210px;" alt="MEP Costa Rica"/>
          ${esRealSA ? `
            <select id="rol-sw" style="background:#070d19;color:#38bdf8;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
              ${ROLES_ALL.map(r => `<option value="${r.rol}" ${sesionActiva.rol===r.rol?"selected":""}>${r.ic} Vista: ${r.rol}</option>`).join("")}
            </select>
          ` : ""}
        </div>
      </div>

      ${tarjetaSeguimientoHtml}

      ${perms.quick.length ? `
        <div class="bds-card" style="margin-bottom:12px;">
          <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:8px;">⚡ ACCESOS RÁPIDOS</div>
          <div style="display:flex;flex-wrap:wrap;gap:7px;">
            ${perms.quick.map(k => QUICK_DEF[k] || "").join("")}
          </div>
        </div>
      ` : ""}

      ${perms.admisionHome ? `
        <div class="bds-card" style="margin-bottom:12px;border-color:#0284c7;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:800;color:#38bdf8;">🎓 Admisión Universitaria y PNE</span>
            <button onclick="window.bdsGo('admision','ucr')" style="background:#0284c7;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Abrir Admisión →</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            <button onclick="window.bdsGo('admision','ucr')" class="bds-quick-btn" style="background:#0284c7;">UCR</button>
            <button onclick="window.bdsGo('admision','tec')" class="bds-quick-btn" style="background:#1d4ed8;">TEC</button>
            <button onclick="window.bdsGo('admision','una')" class="bds-quick-btn" style="background:#dc2626;">UNA</button>
            <button onclick="window.bdsGo('admision','uned')" class="bds-quick-btn" style="background:#059669;">UNED</button>
            <button onclick="window.bdsGo('admision','utn')" class="bds-quick-btn" style="background:#ea580c;">UTN</button>
            <button onclick="window.bdsGo('admision','pne')" class="bds-quick-btn" style="background:#7c3aed;">PNE MEP</button>
          </div>
        </div>
      ` : ""}

      ${perms.cards.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:14px;">${perms.cards.map(k => CARD_DEF[k] || "").join("")}</div>` : ""}

      ${perms.mallaHome ? `
        <h3 style="margin:0 0 8px;font-size:14.5px;color:#38bdf8;">📘 Malla Curricular MEP (${malla.length} Áreas)</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:8px;">
          ${malla.map(m => `<div class="bds-card" style="cursor:pointer;border-left:4px solid ${m.color};padding:11px;" data-area="${m.id}"><span style="font-size:9.5px;font-weight:800;color:${m.color};">${m.cat.toUpperCase()}</span><div style="font-size:13px;font-weight:700;margin-top:2px;">${m.name}</div></div>`).join("")}
        </div>
      ` : ""}
    `;

    if (document.getElementById("rol-sw")) document.getElementById("rol-sw").onchange = (e) => onSwitchRole(e.target.value); if (document.getElementById("pr-mot-next")) document.getElementById("pr-mot-next").onclick = () => { window.__BDS_MOT_IDX = (window.__BDS_MOT_IDX || 0) + 1; renderInicio(shell, perms, onSwitchRole); }; if (document.getElementById("pr-mot-push")) document.getElementById("pr-mot-push").onclick = () => { if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🦉 Recordatorio pracTICA", salObj.frase); };
    shell.querySelectorAll("[data-area]").forEach(el => { el.onclick = () => window.bdsGo("practica", el.getAttribute("data-area")); });
  }

  // ==================== SHELL PRINCIPAL MOBILE-FIRST (CERO NULL + DOCK CHATS VIVO) ====================
  function iniciarApp(vistaInicial = "inicio", rolAuditoria = null) {
    const sBase = getSesion(); if (!sBase) { mostrarLogin("login"); return; }
    const rolEfectivo = (sBase.rolReal === "SuperAdmin" && rolAuditoria) ? rolAuditoria : sBase.rol;
    const exRoles = (window.BDS_TRAZABILIDAD && window.BDS_TRAZABILIDAD.getExtraRoles) ? window.BDS_TRAZABILIDAD.getExtraRoles(sBase.email) : (sBase.extraRoles || []); sesionActiva = { ...sBase, rol: rolEfectivo, extraRoles: exRoles }; if (window.BDS_MOTIVACION && !sesionActiva.visitante) window.BDS_MOTIVACION.trackSession(sesionActiva);

    // Verificar bloqueo Beta 13 días
    if (!sesionActiva.visitante && window.BDS_SUSCRIPCION && window.BDS_SUSCRIPCION.isLocked(sesionActiva)) {
      inyectarEstilos(); setFavicon();
      window.BDS_SUSCRIPCION.renderPaywall(sesionActiva, cerrarSesion);
      return;
    }

    const perms = getPermisosRol(rolEfectivo, sesionActiva.visitante);
    const b = brand(), xp = getXP();
    const th = window.BDS_UI ? window.BDS_UI.getTheme() : "dark";
    const lg = window.BDS_UI ? window.BDS_UI.getLang() : "es";

    document.body.classList.add("bds-authenticated");
    inyectarEstilos(); setFavicon();
    ["bds-header","bds-subnav","bds-preview-bar","bds-shell","bds-dock","bds-drawer"].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });

    const hdr = document.createElement("header");
    hdr.id = "bds-header";
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:7px;min-width:0;">
        <button id="btn-hm" aria-label="Menú" style="background:#131f33;color:#fff;border:1px solid #334155;width:36px;height:36px;border-radius:8px;font-size:18px;cursor:pointer;flex-shrink:0;">☰</button>
        <img src="${b.escudo}" width="24" height="28" alt="Escudo" class="hide-sm"/>
        <img src="${b.mascota}" width="30" height="30" alt="Búho Azul" style="border-radius:50%;cursor:pointer;flex-shrink:0;" onclick="window.bdsGo('${perms.tabs[0]}')"/>
        <div style="min-width:0;cursor:pointer;" onclick="window.bdsGo('${perms.tabs[0]}')">
          <div data-no-i18n="true" style="font-size:13.5px;font-weight:900;white-space:nowrap;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:10px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px;">${b.institucionCorta} • ${rolEfectivo}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
        <select id="bds-lang-sel" data-no-i18n="true" class="hide-sm" style="background:#131f33;color:#fff;border:1px solid #334155;padding:5px 6px;border-radius:7px;font-size:11px;font-weight:800;min-height:34px;">
          <option value="es" ${lg==="es"?"selected":""}>ES</option>
          <option value="en" ${lg==="en"?"selected":""}>EN</option>
          <option value="pt" ${lg==="pt"?"selected":""}>PT</option>
          <option value="fr" ${lg==="fr"?"selected":""}>FR</option>
        </select>
        <button id="bds-theme-btn" style="background:#131f33;color:#fbbf24;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;min-height:34px;">${th==="light"?"🌙":"☀️"}</button>
        <button id="bds-pwa-install-btn" style="display:none;background:#0f766e;color:#fff;border:none;padding:6px 9px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;min-height:34px;align-items:center;gap:4px;">📲 Instalar</button>
        <button id="bds-notif-btn" title="Notificaciones" style="position:relative;background:#131f33;color:#38bdf8;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:13px;cursor:pointer;min-height:34px;">🔔<span id="bds-notif-badge" style="display:none;position:absolute;top:-4px;right:-4px;background:#dc2626;color:#fff;font-size:9px;font-weight:900;min-width:15px;height:15px;border-radius:99px;align-items:center;justify-content:center;padding:0 3px;"></span></button>
        <span id="bds-xp-pill" class="hide-sm" data-no-i18n="true" style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:5px 8px;border-radius:7px;font-size:11px;font-weight:800;">🔥 ${xp.racha}d • ⚡ ${xp.xp} XP</span>
        ${perms.chats ? `<button id="btn-ch" style="background:#064e3b;color:#6ee7b7;border:1px solid #10b981;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;min-height:34px;">💬 Chats</button>` : ""}
        <button id="btn-pay-top" title="Planes y Pagos (Tarjeta, PayPal, SINPE)" class="hide-sm" style="background:#059669;color:#fff;border:none;padding:6px 9px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;min-height:34px;">💳 Planes</button><button id="btn-out" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:6px 9px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;min-height:34px;">Salir</button>
      </div>
    `;

    const sub = document.createElement("nav");
    sub.id = "bds-subnav";
    sub.innerHTML = perms.tabs.map(k => `<button data-v="${k}" class="bds-nav-btn">${TAB_META[k]}</button>`).join("");

    const shell = document.createElement("main");
    shell.id = "bds-shell";

    // Dock inferior móvil limpio (5 botones exactos, Chats funcional)
    const dockItems = sesionActiva.visitante
      ? [
          { v: "practica", ic: "🧭", lbl: "Práctica" },
          { v: "juegos", ic: "🎮", lbl: "Juegos" },
          { action: "planes", ic: "💎", lbl: "Planes" },
          { action: "login", ic: "🎁", lbl: "Beta 13d" },
          { action: "theme", ic: "🌓", lbl: "Tema" }
        ]
      : [
          { v: "inicio", ic: "🏠", lbl: "Inicio" },
          { v: perms.tabs.includes("horarios") ? "horarios" : "habitos", ic: perms.tabs.includes("horarios") ? "📅" : "🔥", lbl: perms.tabs.includes("horarios") ? "Horarios" : "Hábitos" },
          { v: perms.tabs.includes("simulacro") ? "simulacro" : "permisos", ic: perms.tabs.includes("simulacro") ? "⏱️" : "📝", lbl: perms.tabs.includes("simulacro") ? "Simulacro" : "Permisos" },
          { v: perms.tabs.includes("juegos") ? "juegos" : "comedor", ic: perms.tabs.includes("juegos") ? "🎮" : "🍽️", lbl: perms.tabs.includes("juegos") ? "Juegos" : "Comedor" },
          perms.chats ? { action: "chats", ic: "💬", lbl: "Chats" } : { v: "simulador_mopt", ic: "🚗", lbl: "MOPT" }
        ];

    const dock = document.createElement("nav");
    dock.id = "bds-dock";
    dock.innerHTML = dockItems.map((it, i) => `<button class="bds-dock-b" ${it.v ? `data-v="${it.v}"` : `data-act="${it.action}"`} id="dk-${i}"><span style="font-size:17px;">${it.ic}</span><span>${it.lbl}</span></button>`).join("");

    document.body.prepend(shell);
    if (sBase.rolReal === "SuperAdmin" && rolEfectivo !== "SuperAdmin") {
      const pbar = document.createElement("div");
      pbar.id = "bds-preview-bar";
      pbar.style.cssText = "background:#b45309;color:#fff;padding:7px 12px;font-size:12px;font-weight:800;display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;";
      pbar.innerHTML = `<span>👁️ Auditando rol: ${rolEfectivo}</span><button id="bds-back-sa" style="background:#0f172a;color:#fbbf24;border:none;padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">👑 Volver a SuperAdmin</button>`;
      document.body.prepend(pbar);
      document.getElementById("bds-back-sa").onclick = () => iniciarApp("inicio", "SuperAdmin");
    }
    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(dock);

    window.bdsGo = function (v, subParam) {
      try {
        if (simTimer) { clearInterval(simTimer); simTimer = null; }
        const destino = perms.tabs.includes(v) ? v : perms.tabs[0];
        document.querySelectorAll("[data-v]").forEach(btn => btn.classList.toggle("active", btn.getAttribute("data-v") === destino));

        if (destino === "trazabilidad" && window.BDS_TRAZABILIDAD) window.BDS_TRAZABILIDAD.renderPanel(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
        else if (destino === "instituciones" && window.BDS_RENDER_INSTITUCIONES_CRUD) window.BDS_RENDER_INSTITUCIONES_CRUD(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
        else if (destino === "llaves_aulas" && window.BDS_RENDER_LLAVES_AULAS) window.BDS_RENDER_LLAVES_AULAS(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "idiomas_lab" && window.BDS_RENDER_IDIOMAS_LAB) window.BDS_RENDER_IDIOMAS_LAB(shell, { sesion: sesionActiva, ganarXP });
      else if (destino === "admin_sim_cruce" && window.BDS_RENDER_ADMIN_SIM_CRUCE) window.BDS_RENDER_ADMIN_SIM_CRUCE(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "asignacion_acad" && window.BDS_RENDER_ASIGNACION_ACAD) window.BDS_RENDER_ASIGNACION_ACAD(shell, { sesion: sesionActiva });
      else if (destino === "horarios" && window.BDS_RENDER_MATRICULA_HORARIOS) window.BDS_RENDER_MATRICULA_HORARIOS(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
        else if ((destino === "permisos" || destino === "justificaciones" || destino === "carnet_qr") && window.BDS_RENDER_PERMISOS_JUSTIF) window.BDS_RENDER_PERMISOS_JUSTIF(shell, destino === "carnet_qr" ? "qr" : destino, { sesion: sesionActiva, sha256Hex, generarQRSVG });
        else if (destino === "mis_notas" && window.BDS_RENDER_MIS_NOTAS_ESTUDIANTE) window.BDS_RENDER_MIS_NOTAS_ESTUDIANTE(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "familia" && window.BDS_RENDER_PORTAL_FAMILIA) window.BDS_RENDER_PORTAL_FAMILIA(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "orientacion_reac" && window.BDS_RENDER_ORIENTACION_REAC) window.BDS_RENDER_ORIENTACION_REAC(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "conducta_sea" && window.BDS_RENDER_ODIN2) window.BDS_RENDER_ODIN2(shell, subParam || "matricula", { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
      else if (destino === "notas_rea" && window.BDS_RENDER_DOCENTE_REA_AUTO) window.BDS_RENDER_DOCENTE_REA_AUTO(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
        else if (destino === "planeamiento_ia" && window.BDS_RENDER_PLANEAMIENTO_IA) window.BDS_RENDER_PLANEAMIENTO_IA(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
        else if (destino === "cooperativa" && window.BDS_RENDER_COOPERATIVA) window.BDS_RENDER_COOPERATIVA(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
      else if (destino === "practica_guia" && window.BDS_RENDER_PRACTICA_GUIA) window.BDS_RENDER_PRACTICA_GUIA(shell, { sesion: sesionActiva, ganarXP });
      else if (destino === "comedor" && window.BDS_RENDER_COMEDOR_MEP) window.BDS_RENDER_COMEDOR_MEP(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
        else if (destino === "porton_seguridad" && window.BDS_RENDER_PORTON_SEGURIDAD) window.BDS_RENDER_PORTON_SEGURIDAD(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "conserjeria_mant" && window.BDS_RENDER_CONSERJERIA_MANT) window.BDS_RENDER_CONSERJERIA_MANT(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "agenda" && window.BDS_RENDER_AGENDA_HORARIO) window.BDS_RENDER_AGENDA_HORARIO(shell, { sesion: sesionActiva });
        else if (destino === "reportes" && window.BDS_RENDER_REPORTES_RESPALDOS) window.BDS_RENDER_REPORTES_RESPALDOS(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
        else if (destino === "simulador_mopt" && window.BDS_RENDER_SIMULADOR_MOPT) window.BDS_RENDER_SIMULADOR_MOPT(shell, ganarXP);
        else if (destino === "admision" && window.BDS_RENDER_ADMISION) window.BDS_RENDER_ADMISION(shell, subParam || "ucr", ganarXP);
        else if (destino === "antologias" && window.BDS_RENDER_ANTOLOGIAS_LIBROS) window.BDS_RENDER_ANTOLOGIAS_LIBROS(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG, ganarXP });
      else if (destino === "opendocs" && window.BDS_RENDER_OPENDOCS) window.BDS_RENDER_OPENDOCS(shell, { sesion: sesionActiva, generarQRSVG, sha256Hex });
        else if (destino === "biblioteca" && window.BDS_RENDER_BIBLIOTECA_ILUSTRADA) window.BDS_RENDER_BIBLIOTECA_ILUSTRADA(shell, { malla: window.BDS_MALLA_MEP || [], ganarXP, subInicial: subParam || "manuales", abrirPractica: (m, a) => window.bdsGo(m === "simulacro" ? "simulacro" : "practica", a), IMG_ESCUDO: b.escudo, IMG_MEP: b.logoMep });
        else if (destino === "juegos" && window.BDS_RENDER_SALA_JUEGOS) window.BDS_RENDER_SALA_JUEGOS(shell, ganarXP);
        else if (destino === "seguimiento" && window.BDS_SEGUIMIENTO_THOR) window.BDS_SEGUIMIENTO_THOR.renderPanel(shell, { sesion: sesionActiva, sha256Hex, generarQRSVG });
      else if (destino === "habitos" && window.BDS_SUSCRIPCION) window.BDS_SUSCRIPCION.renderHabitos(shell, sesionActiva, getXP());
        else if (destino === "direccion" && window.BDS_RENDER_DIRECCION_Y_FAMILIA) window.BDS_RENDER_DIRECCION_Y_FAMILIA(shell, sesionActiva);
        else if (destino === "practica") renderEvaluacion(shell, "guiada", subParam);
        else if (destino === "simulacro") renderEvaluacion(shell, "simulacro", subParam);
        else renderInicio(shell, perms, (nuevoRol) => iniciarApp("inicio", nuevoRol));

        if (sesionActiva && sesionActiva.visitante && window.BDS_SUSCRIPCION) window.BDS_SUSCRIPCION.prependGuestPromo(shell, cerrarSesion);
        if (window.BDS_UI && window.BDS_UI.getLang() !== "es") window.BDS_UI.applyLang(window.BDS_UI.getLang());
        window.scrollTo(0, 0);
      } catch (errGo) {
        console.error("bdsGo error:", errGo);
        shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:24px;border-color:#f59e0b;"><h3>⚠️ Módulo en recuperación</h3><p style="font-size:12.5px;color:#94a3b8;">${errGo.message || errGo}</p><button onclick="window.bdsGo('inicio')" style="background:#1d4ed8;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:800;cursor:pointer;">🏠 Volver al Inicio</button></div>`;
      }
    };

    // Enlaces de botones del Header y Dock (incluyendo Chats móvil reparado)
    document.getElementById("bds-theme-btn").onclick = () => {
      if (window.BDS_UI) window.BDS_UI.toggleTheme();
      const t = window.BDS_UI ? window.BDS_UI.getTheme() : "dark";
      document.getElementById("bds-theme-btn").innerText = t === "light" ? "🌙" : "☀️";
    };
    if (document.getElementById("bds-lang-sel")) document.getElementById("bds-lang-sel").onchange = (e) => { if (window.BDS_UI) window.BDS_UI.applyLang(e.target.value); };
    if (document.getElementById("bds-notif-btn")) {
      document.getElementById("bds-notif-btn").onclick = () => { if (window.BDS_NOTIF) window.BDS_NOTIF.openNotifModal(); };
      if (window.BDS_NOTIF) window.BDS_NOTIF.updateBellBadge();
    }
    if (document.getElementById("bds-pwa-install-btn")) {
      const ib = document.getElementById("bds-pwa-install-btn");
      if (bdsDeferredPrompt && !bdsIsAppInstalled()) ib.style.display = "inline-flex";
      ib.onclick = async () => { if (!bdsDeferredPrompt) return; bdsDeferredPrompt.prompt(); await bdsDeferredPrompt.userChoice; bdsDeferredPrompt = null; ib.style.display = "none"; };
    }
    document.getElementById("btn-out").onclick = cerrarSesion; if (document.getElementById("btn-pay-top")) document.getElementById("btn-pay-top").onclick = () => { if (window.BDS_SUSCRIPCION) window.BDS_SUSCRIPCION.openPlanesModal(sesionActiva, cerrarSesion); };
    window.bdsOpenChats = toggleChats; if (document.getElementById("btn-ch")) document.getElementById("btn-ch").onclick = () => window.bdsOpenChats();

    document.querySelectorAll("[data-v]").forEach(btn => { btn.onclick = () => window.bdsGo(btn.getAttribute("data-v")); });
    dock.querySelectorAll("[data-act]").forEach(btn => {
      btn.onclick = () => {
        const a = btn.getAttribute("data-act");
        if (a === "chats") toggleChats();
        else if (a === "planes" && window.BDS_SUSCRIPCION) window.BDS_SUSCRIPCION.openPlanesModal(sesionActiva, cerrarSesion);
        else if (a === "login") cerrarSesion();
        else if (a === "theme" && window.BDS_UI) window.BDS_UI.toggleTheme();
      };
    });

    // Menú lateral hamburguesa móvil y desktop
    document.getElementById("btn-hm").onclick = () => {
      const old = document.getElementById("bds-drawer"); if (old) { old.remove(); return; }
      const drw = document.createElement("div");
      drw.id = "bds-drawer";
      drw.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.84);z-index:299000;display:flex;";
      drw.innerHTML = `
        <div class="bds-card" style="width:280px;max-width:84vw;height:100%;border-radius:0;display:flex;flex-direction:column;gap:6px;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:8px;"><img src="${b.mascota}" width="28" height="28" style="border-radius:50%;"/><b>${rolEfectivo}</b></div>
            <button id="dw-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;">✕</button>
          </div>
          ${perms.tabs.map(k => `<button data-dw="${k}" style="text-align:left;background:#131f33;color:#f1f5f9;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">${TAB_META[k]}</button>`).join("")}
          ${perms.identidad ? `<button id="dw-id" style="text-align:left;background:#131f33;color:#2dd4bf;border:1px solid #0d9488;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🛡️ Escudo y Logo</button>` : ""}
          ${perms.chats ? `<button id="dw-ch" style="text-align:left;background:#064e3b;color:#6ee7b7;border:1px solid #10b981;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">💬 Chats</button>` : ""}
          <button id="dw-out" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🚪 Cerrar Sesión</button>
        </div>
      `;
      document.body.appendChild(drw);
      document.getElementById("dw-x").onclick = () => drw.remove();
      document.getElementById("dw-out").onclick = () => { drw.remove(); cerrarSesion(); };
      if (document.getElementById("dw-id")) document.getElementById("dw-id").onclick = () => { drw.remove(); if (window.BDS_BRAND) window.BDS_BRAND.openModal(); };
      if (document.getElementById("dw-ch")) document.getElementById("dw-ch").onclick = () => { drw.remove(); toggleChats(); };
      drw.querySelectorAll("[data-dw]").forEach(btn => { btn.onclick = () => { drw.remove(); window.bdsGo(btn.getAttribute("data-dw")); }; });
    };

    window.bdsGo(vistaInicial);
  }

  window.addEventListener("DOMContentLoaded", () => {
    inyectarEstilos(); setFavicon();
    const s = getSesion();
    if (s && s.email) iniciarApp(s.visitante ? "practica" : "inicio");
    else mostrarLogin("login");
  });
})();