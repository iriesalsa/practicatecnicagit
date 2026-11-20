(function () {
  const ENG_KEY = "bds_motivacion_users_v201";
  const TOAST_DAY_KEY = "bds_motiv_toast_day_v201";

  const FRASES_ROL = {
    "SuperAdmin": [
      "Su visión e ingeniería en pracTICA impulsan la educación técnica de excelencia en Costa Rica.",
      "Cada actualización en pracTICAtecnica.com multiplica oportunidades reales para estudiantes y docentes.",
      "Liderazgo técnico, disciplina Kaizen y calidad al servicio de toda la comunidad educativa."
    ],
    "Director(a)": [
      "Su liderazgo institucional fortalece la calidad académica, la disciplina REA y el bienestar estudiantil.",
      "Con trazabilidad clara y evidencias QR SHA-256, su gestión en pracTICA avanza con paso firme."
    ],
    "Docente MEP": [
      "Su vocación docente transforma vidas cada lección. pracTICA le acompaña con herramientas ágiles y seguras.",
      "Enseñar con propósito, claridad y tecnología construye el futuro de cada joven."
    ],
    "Estudiante": [
      "¡Cada práctica hoy en pracTICA te acerca más a tus metas académicas y técnicas!",
      "15 minutos diarios de enfoque construyen disciplina real. ¡Sigue adelante hoy!"
    ],
    "Padre/Madre": [
      "Su acompañamiento como persona encargada legal es el pilar más fuerte para el éxito de sus hijos.",
      "Gracias por validar matrícula, dar seguimiento a conducta REA y apoyar los hábitos desde pracTICA."
    ],
    "DEFAULT": [
      "Bienvenido(a) a pracTICA (pracTICAtecnica.com): disciplina diaria, orden y resultados verificables.",
      "Hoy es un excelente día para avanzar con enfoque y calidad."
    ]
  };

  function loadEngMap() { try { const d = JSON.parse(localStorage.getItem(ENG_KEY)); return (d && typeof d === "object") ? d : {}; } catch { return {}; } }
  function saveEngMap(m) { localStorage.setItem(ENG_KEY, JSON.stringify(m)); }

  function formatNameFromEmail(email) {
    const mail = String(email || "").trim().toLowerCase();
    if (!mail || !mail.includes("@")) return "Usuario";
    if (mail === "maxi.salsa@gmail.com") return "Ing. Max Salazar Sánchez";
    const local = mail.split("@")[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (local.includes("laura") && local.includes("ramon")) return "Directora Laura Ramón Elizondo";
    const parts = local.replace(/\d+$/g, "").split(/[._-]+/).filter(p => p.length >= 2).slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return parts.length ? parts.join(" ") : (local.charAt(0).toUpperCase() + local.slice(1));
  }

  function getTramoHorario() {
    const h = new Date().getHours();
    return h < 12 ? "Buenos días" : (h < 18 ? "Buenas tardes" : "Buenas noches");
  }

  function getCanalAcceso() {
    const st = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
    return st ? "App PWA pracTICA" : "pracTICAtecnica.com";
  }

  function trackSession(sesion) {
    if (!sesion || sesion.visitante || !sesion.email) return null;
    const mail = sesion.email.toLowerCase().trim();
    const map = loadEngMap();
    const hoy = new Date().toISOString().slice(0, 10);
    const ahora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
    let rec = map[mail];
    if (!rec) {
      rec = { email: mail, nombre: sesion.nombre || formatNameFromEmail(mail), rol: sesion.rol || "Estudiante", primeraVisita: hoy, ultimoDia: hoy, ultimaHora: ahora, diasConsecutivos: 1, sesionesTotales: 1, diasSinEntrar: 0, canal: getCanalAcceso(), mensajesRecibidos: [] };
    } else {
      rec.nombre = sesion.nombre || rec.nombre || formatNameFromEmail(mail);
      rec.rol = sesion.rol || rec.rol;
      rec.canal = getCanalAcceso();
      rec.ultimaHora = ahora;
      if (rec.ultimoDia !== hoy) {
        const diffDays = Math.max(1, Math.round((new Date(hoy).getTime() - new Date(rec.ultimoDia).getTime()) / 86400000));
        rec.diasSinEntrar = diffDays > 1 ? diffDays : 0;
        rec.diasConsecutivos = diffDays === 1 ? (Number(rec.diasConsecutivos || 0) + 1) : 1;
        rec.ultimoDia = hoy;
        rec.sesionesTotales = Number(rec.sesionesTotales || 0) + 1;
      }
    }
    map[mail] = rec; saveEngMap(map);

    const tk = `${mail}|${hoy}`;
    if (sessionStorage.getItem(TOAST_DAY_KEY) !== tk) {
      sessionStorage.setItem(TOAST_DAY_KEY, tk);
      const sal = buildSaludoPersonalizado(sesion, { xp: 0, racha: rec.diasConsecutivos });
      if (window.BDS_NATIVE && window.BDS_NATIVE.showInAppToast) {
        setTimeout(() => window.BDS_NATIVE.showInAppToast(`🦉 pracTICA — ${sal.encabezado}`, sal.frase), 650);
      }
    }
    return rec;
  }

  function getUserStats(email) { return loadEngMap()[String(email || "").toLowerCase().trim()] || null; }

  function buildSaludoPersonalizado(sesion, xp, offsetIdx) {
    const mail = String((sesion && sesion.email) || "").toLowerCase().trim();
    const rol = (sesion && sesion.rol) || "Estudiante";
    const nombre = (sesion && sesion.nombre && sesion.nombre.trim()) ? sesion.nombre.trim() : formatNameFromEmail(mail);
    const saludoHora = getTramoHorario();
    const stats = getUserStats(mail);
    const pool = FRASES_ROL[rol] || FRASES_ROL.DEFAULT;
    const frase = pool[(new Date().getDate() + (Number(offsetIdx) || 0)) % pool.length];

    let encabezado = `${saludoHora}, ${nombre}`;
    if (mail === "maxi.salsa@gmail.com") encabezado = `${saludoHora}, estimado Ing. Max Salazar Sánchez`;
    else if (rol === "Director(a)" || (mail.includes("laura") && mail.includes("ramon"))) encabezado = `${saludoHora}, estimada ${nombre}`;
    else if (["Docente MEP","Supervisor(a) de Circuito","Asesor(a) Regional / Nacional","Viceministro(a) MEP","Ministro(a) MEP"].includes(rol)) encabezado = `${saludoHora}, estimado(a) ${nombre}`;

    let seg = "Bienvenido(a) a pracTICA.";
    if (stats) {
      if (stats.sesionesTotales <= 1) seg = `Qué alegría recibirle en pracTICA (${stats.canal}).`;
      else if (stats.diasConsecutivos >= 2) seg = `Lleva ${stats.diasConsecutivos} días consecutivos en pracTICA. ¡Excelente constancia!`;
      else seg = `Qué gusto verle nuevamente en pracTICA (${stats.sesionesTotales} sesiones).`;
    }
    return { encabezado, nombre, frase, textoCompleto: `${encabezado}. ${seg} ${frase}`, stats };
  }

  function enviarMotivacionAUsuario(emailDestino, autorNombre, mensajeCustom) {
    const mail = String(emailDestino || "").toLowerCase().trim();
    if (!mail) return false;
    const map = loadEngMap();
    if (!map[mail]) map[mail] = { email: mail, nombre: formatNameFromEmail(mail), rol: "Estudiante", primeraVisita: new Date().toISOString().slice(0,10), ultimoDia: "—", ultimaHora: "—", diasConsecutivos: 0, sesionesTotales: 0, canal: "pracTICAtecnica.com", mensajesRecibidos: [] };
    const txt = mensajeCustom || "¡Excelente avance en pracTICA! Sigue construyendo tu meta día a día.";
    if (!Array.isArray(map[mail].mensajesRecibidos)) map[mail].mensajesRecibidos = [];
    map[mail].mensajesRecibidos.unshift({ fecha: new Date().toLocaleString("es-CR"), de: autorNombre || "Dirección pracTICA", texto: txt });
    saveEngMap(map);
    if (window.BDS_NOTIF && window.BDS_NOTIF.pushNative) window.BDS_NOTIF.pushNative("🌟 Seguimiento pracTICA", `Para ${map[mail].nombre}: ${txt}`);
    return true;
  }

  function renderTarjetaSeguimiento(sesion) {
    if (!sesion || sesion.visitante) return "";
    const st = getUserStats(sesion.email) || { diasConsecutivos: 1, sesionesTotales: 1, canal: getCanalAcceso(), mensajesRecibidos: [] };
    const seg = (window.BDS_SEGUIMIENTO_THOR && window.BDS_SEGUIMIENTO_THOR.load) ? window.BDS_SEGUIMIENTO_THOR.load() : { total: 0 };
    const prog = Math.min(10, Number(seg.total || 0) % 11);
    const pct = Math.round((prog / 10) * 100);
    const uMsg = (st.mensajesRecibidos && st.mensajesRecibidos[0]) || null;
    return `
      <div class="bds-card" style="margin-bottom:12px;border-color:#0f766e;background:linear-gradient(135deg,#081526 0%,#0b1322 100%);padding:11px 13px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:7px;">
          <div style="font-size:11.5px;color:#cbd5e1;">
            <span style="background:#0f766e;color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;margin-right:6px;">pracTICA • ${st.canal}</span>
            <b style="color:#38bdf8;">${sesion.email}</b> • Sesiones: <b style="color:#34d399;">${st.sesionesTotales}</b> • Constancia: <b style="color:#fbbf24;">${st.diasConsecutivos}d</b>
          </div>
          <div style="display:flex;gap:5px;">
            <button type="button" id="pr-mot-next" style="background:#131f33;color:#2dd4bf;border:1px solid #0f766e;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;">✨ Motivación</button>
            <button type="button" id="pr-mot-push" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;">🔔 Recordatorio</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="flex:1;height:7px;background:#1e293b;border-radius:99px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#10b981,#2dd4bf,#38bdf8);"></div></div>
          <span style="font-size:10.5px;font-weight:700;color:#6ee7b7;">Meta hoy: ${prog}/10</span>
        </div>
        ${uMsg ? `<div style="margin-top:7px;background:#070d19;border-left:3px solid #fbbf24;padding:6px 9px;border-radius:6px;font-size:11px;color:#fde68a;"><b>🌟 ${uMsg.de}:</b> ${uMsg.texto}</div>` : ""}
      </div>
    `;
  }

  window.BDS_MOTIVACION = { formatNameFromEmail, trackSession, getUserStats, loadEngMap, buildSaludoPersonalizado, enviarMotivacionAUsuario, renderTarjetaSeguimiento };
})();