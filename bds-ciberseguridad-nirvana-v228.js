(function () {
  const LOCK_KEY = "bds_auth_attempts_v228";
  const BITACORA_SEC_KEY = "bds_sec_bitacora_v228";
  const MAX_INTENTOS = 5;
  const VOCABULARIO_NEUTRAL_ROLES = {
    comedor: "Personal del Comedor Estudiantil", cooperativa: "Equipo de Cooperativa Estudiantil",
    direccion: "Persona Directora / Subdirectora y Equipo Directivo", auxiliares: "Auxiliares Administrativos y Secretaría",
    vigilancia: "Personal de Vigilancia y Seguridad", conserjeria: "Personal de Conserjería y Mantenimiento",
    orientacion: "Equipo de Orientación", docentes: "Personal Docente", estudiantes: "Estudiantado", familias: "Personas Encargadas Legales"
  };
  function getAttemptsMap() { try { return JSON.parse(localStorage.getItem(LOCK_KEY) || "{}"); } catch { return {}; } }
  function saveAttemptsMap(m) { localStorage.setItem(LOCK_KEY, JSON.stringify(m)); }
  function registrarBitacoraSeguridad(evento, actor, detalle) {
    let logs = []; try { logs = JSON.parse(localStorage.getItem(BITACORA_SEC_KEY) || "[]"); } catch {}
    logs.unshift({ fecha: new Date().toLocaleString("es-CR"), evento: String(evento || "EVENTO"), actor: String(actor || "sistema"), detalle: String(detalle || ""), normativa: "Ley 8968 (PRODHAB) / Ley 7739 / REAC 45509-MEP" });
    localStorage.setItem(BITACORA_SEC_KEY, JSON.stringify(logs.slice(0, 400)));
  }
  function registrarIntentoFallido(email) {
    const k = String(email || "anon").trim().toLowerCase();
    const map = getAttemptsMap();
    const cur = (map[k] && map[k].count) ? Number(map[k].count) + 1 : 1;
    const bloqueado = cur >= MAX_INTENTOS;
    map[k] = { count: cur, bloqueado, ultimoIntento: new Date().toISOString() };
    saveAttemptsMap(map);
    registrarBitacoraSeguridad("AUTH_FAIL", k, `Intento fallido ${cur}/${MAX_INTENTOS}${bloqueado ? " — CUENTA BLOQUEADA" : ""}`);
    return { count: cur, max: MAX_INTENTOS, bloqueado };
  }
  function limpiarIntentos(email) { const map = getAttemptsMap(); delete map[String(email || "anon").trim().toLowerCase()]; saveAttemptsMap(map); }
  function estaBloqueadoPorIntentos(email) { const map = getAttemptsMap(); const e = map[String(email || "anon").trim().toLowerCase()]; return Boolean(e && e.bloqueado); }
  function loadBitacoraSeguridad() { try { const d = JSON.parse(localStorage.getItem(BITACORA_SEC_KEY) || "[]"); return Array.isArray(d) ? d : []; } catch { return []; } }
  window.BDS_CIBER_NIRVANA_V228 = { MAX_INTENTOS, VOCABULARIO_NEUTRAL_ROLES, registrarIntentoFallido, limpiarIntentos, estaBloqueadoPorIntentos, registrarBitacoraSeguridad, loadBitacoraSeguridad };
})();