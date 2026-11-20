(function () {
  const ENG_KEY = "bds_motivacion_users_v201";
  const TOAST_DAY_KEY = "bds_motiv_toast_day_v201";
  const EMO_DAY_KEY = "bds_checkin_emocional_v206";

  const FRASES_ROL = {
    "SuperAdmin": [
      "Su visión e ingeniería en pracTICA impulsan la educación técnica de excelencia en Costa Rica.",
      "Cada mejora en pracTICAtecnica.com ahorra horas valiosas a direcciones, docentes y familias.",
      "Disciplina Kaizen, arquitectura limpia y propósito humano al más alto nivel."
    ],
    "Director(a)": [
      "Su liderazgo institucional organiza y protege el tiempo de todo el personal y estudiantado.",
      "Con aprobaciones ágiles y trazabilidad QR SHA-256, su gestión directiva marca la diferencia hoy."
    ],
    "Subdirector(a)": [
      "Su coordinación académica y administrativa mantiene al centro educativo en armonía y eficiencia.",
      "Gracias por agilizar procesos de permisos, horarios y acompañamiento diario en pracTICA."
    ],
    "Asistente de Dirección": [
      "Su orden y rapidez en trámites directivos hacen que la institución funcione como un reloj.",
      "Las bandejas rápidas y boletas QR SHA-256 están listas para ahorrar tiempo hoy."
    ],
    "Auxiliar Administrativo": [
      "Su atención oportuna a estudiantes y familias garantiza seguridad y trazabilidad en cada trámite.",
      "Gracias por mantener al día salidas anticipadas, justificaciones y respaldo documental."
    ],
    "Docente MEP": [
      "Su vocación docente transforma vidas cada lección. Recuerde tomar breves pausas de hidratación entre bloques.",
      "Enseñar con claridad, empatía y tecnología construye oportunidades reales para cada joven."
    ],
    "Estudiante": [
      "¡Felicidades por sumar otro día en pracTICA! Estudia en bloques de 25 minutos y descansa 5 para retener mejor.",
      "Tu constancia diaria en prácticas, MOPT y simulacros construye tu futuro. ¡Sigue adelante!"
    ],
    "Padre/Madre": [
      "Su acompañamiento familiar revisando horarios, notas y salidas cuida y motiva a sus hijos cada día.",
      "Gracias por participar activamente en la formación y seguridad estudiantil desde pracTICA."
    ],
    "DEFAULT": [
      "¡Felicidades por tu constancia en pracTICA! Alterna estudio enfocado con pausas saludables.",
      "Cada sesión suma experiencia, hábito y dominio verificable en pracTICAtecnica.com."
    ]
  };

  const ESTADOS_EMOCIONALES = [
    { id: "excelente", ic: "😊", nom: "Con energía", msg: "¡Excelente ánimo! Aprovecha para completar 10 ítems o un simulacro y luego haz una pausa de 5 min." },
    { id: "enfocado", ic: "🎯", nom: "Enfocado", msg: "Gran concentración. Activa el bloque de 25 min y recuerda estirar hombros y vista al terminar." },
    { id: "cansado", ic: "😴", nom: "Cansado", msg: "Escucha a tu cuerpo: toma agua, descansa 5 minutos lejos de la pantalla y haz solo una meta corta hoy." },
    { id: "estresado", ic: "😟", nom: "Con estrés", msg: "Respira 4-4-4 (inhala 4s, sostén 4s, exhala 4s). Un paso a la vez; lo estás haciendo muy bien." },
    { id: "apoyo", ic: "💙", nom: "Necesito apoyo", msg: "No estás solo(a). Conversa con tu docente guía, orientación o familia. Línea gratuita PANI: 1147." }
  ];

  let breakTimer = null;
  let breakSec = 0;
  let breakMode = ""; // "estudio" (25m) | "descanso" (5m)

  function loadEngMap() { try { const d = JSON.parse(localStorage.getItem(ENG_KEY)); return (d && typeof d === "object") ? d : {}; } catch { return {}; } }
  function saveEngMap(m) { localStorage.setItem(ENG_KEY, JSON.stringify(m)); }

  function loadEmoMap() { try { const d = JSON.parse(localStorage.getItem(EMO_DAY_KEY)); return (d && typeof d === "object") ? d : {}; } catch { return {}; } }
  function saveEmoMap(m) { localStorage.setItem(EMO_DAY_KEY, JSON.stringify(m)); }

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
        setTimeout(() => window.BDS_NATIVE.showInAppToast(`🦉 pracTICA — ${sal.encabezado}`, sal.felicitacion + " " + sal.frase), 650);
      }
    }
    return rec;
  }

  function getUserStats(email) { return loadEngMap()[String(email || "").toLowerCase().trim()] || null; }

  function getPromedioUsuario(email) {
    try {
      const roster = JSON.parse(localStorage.getItem("bds_docente_roster_v190") || "[]");
      const pesos = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190") || '{"cotidiano":35,"tareas":10,"pruebas":35,"proyecto":10,"asistencia":10}');
      const m = roster.find(r => (r.email || "").toLowerCase() === String(email || "").toLowerCase());
      if (!m) return null;
      return ((Number(m.cotidiano||0)*pesos.cotidiano + Number(m.tareas||0)*pesos.tareas + Number(m.pruebas||0)*pesos.pruebas + Number(m.proyecto||0)*pesos.proyecto)/100 + Number(pesos.asistencia||10)).toFixed(1);
    } catch { return null; }
  }

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
    else if (["Director(a)","Subdirector(a)"].includes(rol) || (mail.includes("laura") && mail.includes("ramon"))) encabezado = `${saludoHora}, estimado(a) ${nombre}`;
    else if (["Docente MEP","Asistente de Dirección","Supervisor(a) de Circuito","Asesor(a) Regional / Nacional","Viceministro(a) MEP","Ministro(a) MEP"].includes(rol)) encabezado = `${saludoHora}, estimado(a) ${nombre}`;

    let felicitacion = "¡Excelente inicio en pracTICA!";
    if (stats) {
      if (stats.diasConsecutivos >= 7) felicitacion = `🏆 ¡Felicitaciones por ${stats.diasConsecutivos} días seguidos activos! Recuerda equilibrar con pausas de descanso.`;
      else if (stats.diasConsecutivos >= 2) felicitacion = `🔥 ¡Felicidades! Llevas ${stats.diasConsecutivos} días consecutivos en pracTICA.`;
      else if (stats.sesionesTotales > 1) felicitacion = `👏 ¡Qué gusto verle de nuevo en pracTICA (${stats.sesionesTotales} sesiones)!`;
    }
    return { encabezado, nombre, felicitacion, frase, textoCompleto: `${encabezado}. ${felicitacion} ${frase}`, stats };
  }

  function registrarEmocion(email, emoId) {
    const em = ESTADOS_EMOCIONALES.find(x => x.id === emoId);
    if (!em) return;
    const mail = String(email || "").toLowerCase().trim();
    const map = loadEmoMap();
    map[mail] = { id: em.id, ic: em.ic, nom: em.nom, msg: em.msg, fecha: new Date().toISOString().slice(0, 10) };
    saveEmoMap(map);
    const out = document.getElementById("pr-emo-out");
    if (out) { out.style.display = "block"; out.innerHTML = `<b>${em.ic} ${em.nom}:</b> ${em.msg}`; }
    if (window.BDS_NATIVE) window.BDS_NATIVE.showInAppToast(`🦉 pracTICA Bienestar (${em.nom})`, em.msg);
  }

  function iniciarPausaEstudio(modo) {
    if (breakTimer) { clearInterval(breakTimer); breakTimer = null; }
    if (modo === "stop") {
      breakMode = ""; breakSec = 0;
      const el = document.getElementById("pr-pom-clk");
      if (el) el.innerText = "⏱️ Pomodoro listo (25m estudio / 5m descanso)";
      return;
    }
    breakMode = modo;
    breakSec = modo === "descanso" ? 300 : 1500;
    const upd = () => {
      const el = document.getElementById("pr-pom-clk");
      if (!el) return;
      const mm = String(Math.floor(breakSec / 60)).padStart(2, "0");
      const ss = String(breakSec % 60).padStart(2, "0");
      el.innerText = breakMode === "descanso" ? `☕ Descanso saludable: ${mm}:${ss}` : `📚 Bloque de enfoque: ${mm}:${ss}`;
    };
    upd();
    breakTimer = setInterval(() => {
      breakSec--;
      upd();
      if (breakSec <= 0) {
        clearInterval(breakTimer); breakTimer = null;
        const msg = breakMode === "estudio"
          ? "¡Excelente bloque de 25 minutos! Toma 5 minutos de descanso, hidrátate y relaja la vista."
          : "¡Descanso completado! Mente fresca y lista para continuar en pracTICA.";
        if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🦉 Pausa Inteligente pracTICA", msg);
        const el = document.getElementById("pr-pom-clk");
        if (el) el.innerText = breakMode === "estudio" ? "☕ ¡Hora de descansar 5 min!" : "✅ ¡Listo para nuevo bloque!";
      }
    }, 1000);
  }

  function enviarMotivacionAUsuario(emailDestino, autorNombre, mensajeCustom) {
    const mail = String(emailDestino || "").toLowerCase().trim();
    if (!mail) return false;
    const map = loadEngMap();
    if (!map[mail]) map[mail] = { email: mail, nombre: formatNameFromEmail(mail), rol: "Estudiante", primeraVisita: new Date().toISOString().slice(0,10), ultimoDia: "—", ultimaHora: "—", diasConsecutivos: 0, sesionesTotales: 0, canal: "pracTICAtecnica.com", mensajesRecibidos: [] };
    const txt = mensajeCustom || "¡Felicidades por tu avance en pracTICA! Sigue practicando con pausas saludables.";
    if (!Array.isArray(map[mail].mensajesRecibidos)) map[mail].mensajesRecibidos = [];
    map[mail].mensajesRecibidos.unshift({ fecha: new Date().toLocaleString("es-CR"), de: autorNombre || "Dirección pracTICA", texto: txt });
    saveEngMap(map);
    if (window.BDS_NOTIF && window.BDS_NOTIF.pushNative) window.BDS_NOTIF.pushNative("🌟 Felicitación pracTICA", `Para ${map[mail].nombre}: ${txt}`);
    return true;
  }

  function renderTarjetaSeguimiento(sesion, xp) {
    if (!sesion || sesion.visitante) return "";
    const mail = (sesion.email || "").toLowerCase();
    const st = getUserStats(mail) || { diasConsecutivos: 1, sesionesTotales: 1, canal: getCanalAcceso(), mensajesRecibidos: [] };
    const seg = (window.BDS_SEGUIMIENTO_THOR && window.BDS_SEGUIMIENTO_THOR.load) ? window.BDS_SEGUIMIENTO_THOR.load() : { total: 0, correct: 0 };
    const emoHoy = loadEmoMap()[mail] || null;
    const prom = getPromedioUsuario(mail);
    const prog = Math.min(10, Number(seg.total || 0) % 11);
    const pct = Math.round((prog / 10) * 100);
    const uMsg = (st.mensajesRecibidos && st.mensajesRecibidos[0]) || null;

    return `
      <div class="bds-card" style="margin-bottom:12px;border-color:#0f766e;background:linear-gradient(135deg,#081526 0%,#0b1322 100%);padding:12px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div style="font-size:11.5px;color:#cbd5e1;">
            <span style="background:#0f766e;color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;margin-right:6px;">pracTICA • ${st.canal}</span>
            🔥 Racha: <b style="color:#fbbf24;">${st.diasConsecutivos}d</b> • ⚡ <b style="color:#38bdf8;">${(xp && xp.xp) || 0} XP</b> • 🎯 Prácticas: <b style="color:#34d399;">${seg.total || 0}</b>${prom ? ` • 📊 Nota: <b style="color:#a7f3d0;">${prom}%</b>` : ""}
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;">
            <button type="button" id="pr-mot-next" style="background:#131f33;color:#2dd4bf;border:1px solid #0f766e;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;">✨ Motivación</button>
            <button type="button" id="pr-mot-push" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;">🔔 Recordatorio</button>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">
          <div style="flex:1;height:7px;background:#1e293b;border-radius:99px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#10b981,#2dd4bf,#38bdf8);"></div></div>
          <span style="font-size:10.5px;font-weight:700;color:#6ee7b7;">Meta diaria: ${prog}/10</span>
        </div>

        <!-- Seguimiento Emocional + Descansos Saludables de Estudio -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid #1e293b;">
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
            <span style="font-size:10.5px;color:#94a3b8;margin-right:2px;">¿Cómo te sientes?</span>
            ${ESTADOS_EMOCIONALES.map(e => `<button type="button" title="${e.nom}" onclick="window.BDS_MOTIVACION && window.BDS_MOTIVACION.registrarEmocion('${mail}','${e.id}')" style="background:${emoHoy && emoHoy.id===e.id?'#0f766e':'#131f33'};border:1px solid #334155;color:#fff;padding:3px 7px;border-radius:6px;font-size:12px;cursor:pointer;">${e.ic}</button>`).join("")}
          </div>
          <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
            <span id="pr-pom-clk" style="font-size:10.5px;color:#fbbf24;font-weight:700;">⏱️ Estudio 25m / Descanso 5m</span>
            <button type="button" onclick="window.BDS_MOTIVACION && window.BDS_MOTIVACION.iniciarPausaEstudio('estudio')" style="background:#1d4ed8;color:#fff;border:none;padding:4px 7px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">📚 25m</button>
            <button type="button" onclick="window.BDS_MOTIVACION && window.BDS_MOTIVACION.iniciarPausaEstudio('descanso')" style="background:#059669;color:#fff;border:none;padding:4px 7px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">☕ 5m</button>
            <button type="button" onclick="window.BDS_MOTIVACION && window.BDS_MOTIVACION.iniciarPausaEstudio('stop')" style="background:#334155;color:#fff;border:none;padding:4px 6px;border-radius:6px;font-size:10px;cursor:pointer;">⏹</button>
          </div>
        </div>

        <div id="pr-emo-out" style="display:${emoHoy?'block':'none'};margin-top:7px;background:#070d19;border-left:3px solid #2dd4bf;padding:6px 9px;border-radius:6px;font-size:11px;color:#ccfbf1;">${emoHoy ? `<b>${emoHoy.ic} ${emoHoy.nom}:</b> ${emoHoy.msg}` : ""}</div>
        ${uMsg ? `<div style="margin-top:6px;background:#070d19;border-left:3px solid #fbbf24;padding:6px 9px;border-radius:6px;font-size:11px;color:#fde68a;"><b>🌟 ${uMsg.de}:</b> ${uMsg.texto}</div>` : ""}
      </div>
    `;
  }

  window.BDS_MOTIVACION = {
    formatNameFromEmail, trackSession, getUserStats, loadEngMap, buildSaludoPersonalizado,
    enviarMotivacionAUsuario, renderTarjetaSeguimiento, registrarEmocion, iniciarPausaEstudio, ESTADOS_EMOCIONALES
  };
})();