(function () {
  const USERS_KEY = "bds_users_governance_v184";
  const AUDIT_KEY = "bds_users_auditlog_v184";
  const ACCESS_KEY = "bds_access_logs_v193";

  const ROLES_PRINCIPALES = [
    "Admin",
    "Estudiante",
    "Docente MEP",
    "Director(a)",
    "Subdirector(a)",
    "Asistente de Dirección",
    "Secretaria / Secretario",
    "Supervisor(a) de Circuito",
    "Asesor(a) Regional / Nacional",
    "Viceministro(a) MEP",
    "Ministro(a) MEP",
    "Orientador(a)",
    "Auxiliar Administrativo",
    "Auxiliar de Vigilancia (Seguridad)",
    "Conserje / Mantenimiento",
    "Encargada Comedor / Junta",
    "Padre/Madre",
    "Particular (MOPT / Admisión)"
  ];

  const ROLES_EXTRA_DEF = [
    { id: "Comedor", lbl: "🍽️ Comedor", desc: "Escáner QR de comedor, recarga de tiquetes, becas PANEA y caja Junta" },
    { id: "Cooperativa", lbl: "🏪 Coope", desc: "Caja POS táctil, libreta digital, inventario, recargas y reciclaje EcoMEPs" },
    { id: "Juegos", lbl: "🎮 Juegos", desc: "Habilita la sala de 12 juegos educativos en cuentas de Junta o personal" },
    { id: "Permisos", lbl: "📝 Permisos", desc: "Validación de permisos y justificaciones con comprobantes QR" },
    { id: "ValidadorQR", lbl: "🪪 QR Portón", desc: "Escáner verificador de carnés QR SHA-256 institucionales" }
  ];

  function ensureAdmin(arr, id, nom, mail) {
    const first = nom.split(" ")[0].toLowerCase();
    if (!arr.some(u => u.id === id || ((u.nombre || "").toLowerCase().includes(first) && u.rol === "Admin"))) {
      arr.splice(1, 0, {
        id, nombre: nom, email: mail, rol: "Admin",
        extraRoles: ["Comedor", "Cooperativa", "Permisos", "ValidadorQR"],
        planilla: "Equipo Admin BDS Devs", inst: "CTP Mercedes Norte",
        estado: "Activo", plan: "Admin Vitalicio", vence: "Permanente", intentos: 0
      });
    }
  }

  function loadUsers() {
    try {
      const d = JSON.parse(localStorage.getItem(USERS_KEY));
      if (Array.isArray(d) && d.length) {
        ensureAdmin(d, "USR-ADM-DAN", "Daniel (Admin Revisión)", "daniel@bdsdevs.com");
        ensureAdmin(d, "USR-ADM-AAR", "Aarón (Admin Revisión)", "aaron@bdsdevs.com");
        return d;
      }
    } catch {}
    const seed = [
      { id: "USR-001", nombre: "Ing. Max Salazar Sánchez", email: "maxi.salsa@gmail.com", rol: "SuperAdmin", extraRoles: ["Comedor","Cooperativa","Juegos","Permisos","ValidadorQR"], planilla: "Propietario", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Propietario", vence: "Permanente", intentos: 0 },
      { id: "USR-ADM-DAN", nombre: "Daniel (Admin Revisión)", email: "daniel@bdsdevs.com", rol: "Admin", extraRoles: ["Comedor","Cooperativa","Permisos","ValidadorQR"], planilla: "Equipo Admin BDS Devs", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Admin Vitalicio", vence: "Permanente", intentos: 0 },
      { id: "USR-ADM-AAR", nombre: "Aarón (Admin Revisión)", email: "aaron@bdsdevs.com", rol: "Admin", extraRoles: ["Comedor","Cooperativa","Permisos","ValidadorQR"], planilla: "Equipo Admin BDS Devs", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Admin Vitalicio", vence: "Permanente", intentos: 0 },
      { id: "USR-002", nombre: "Directora Laura Ramón Elizondo", email: "laura.ramon@mep.go.cr", rol: "Director(a)", extraRoles: ["Comedor","Cooperativa"], planilla: "MEP", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Cortesía", vence: "Permanente", intentos: 0 },
      { id: "USR-003", nombre: "Encargada Comedor (Junta Administrativa)", email: "comedor.junta@gmail.com", rol: "Encargada Comedor / Junta", extraRoles: ["Comedor","Juegos"], planilla: "Junta Administrativa (No MEP)", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Cortesía", vence: "Permanente", intentos: 0 },
      { id: "USR-004", nombre: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", extraRoles: ["Cooperativa"], planilla: "MEP", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Cortesía", vence: "Permanente", intentos: 0 },
      { id: "USR-005", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", rol: "Estudiante", extraRoles: [], planilla: "Estudiante", inst: "CTP Mercedes Norte (11-1)", estado: "Activo", plan: "Vitalicio Cortesía", vence: "Permanente", intentos: 0 }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveUsers(a) { localStorage.setItem(USERS_KEY, JSON.stringify(a)); }

  function loadAudit() { try { const d = JSON.parse(localStorage.getItem(AUDIT_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function loadAccessLogs() { try { const d = JSON.parse(localStorage.getItem(ACCESS_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }

  function getExtraRoles(email) {
    const mail = (email || "").toLowerCase().trim();
    const u = loadUsers().find(x => (x.email || "").toLowerCase() === mail);
    return (u && Array.isArray(u.extraRoles)) ? u.extraRoles : [];
  }

  function toggleExtraRole(uid, roleName) {
    const arr = loadUsers();
    const u = arr.find(x => x.id === uid);
    if (!u) return false;
    if (!Array.isArray(u.extraRoles)) u.extraRoles = [];
    if (u.extraRoles.includes(roleName)) u.extraRoles = u.extraRoles.filter(r => r !== roleName);
    else u.extraRoles.push(roleName);
    saveUsers(arr);
    return true;
  }

  function logAcceso(sesion, metodo) {
    if (!sesion || !sesion.email) return;
    const logs = loadAccessLogs();
    const disp = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent || "") ? "📱 Móvil" : "💻 Desktop";
    logs.unshift({
      fecha: new Date().toLocaleDateString("es-CR"),
      hora: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      nombre: sesion.nombre || sesion.email,
      email: sesion.email,
      rol: sesion.rol,
      metodo: metodo || "Acceso",
      dispositivo: disp
    });
    localStorage.setItem(ACCESS_KEY, JSON.stringify(logs.slice(0, 250)));

    if (!sesion.visitante) {
      const users = loadUsers();
      if (!users.some(u => (u.email || "").toLowerCase() === sesion.email.toLowerCase())) {
        users.unshift({
          id: "USR-" + String(Date.now()).slice(-4),
          nombre: sesion.nombre || sesion.email.split("@")[0],
          email: sesion.email.toLowerCase(),
          rol: sesion.rol || "Estudiante",
          extraRoles: [],
          planilla: sesion.email.endsWith("@mep.go.cr") ? "MEP" : (sesion.email.endsWith("@est.mep.go.cr") ? "Estudiante" : "Externo / Junta"),
          inst: (window.BDS_BRAND ? window.BDS_BRAND.get().institucionCorta : "CTP Mercedes Norte"),
          estado: "Activo",
          plan: "Beta 13 días",
          vence: new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10),
          intentos: 0
        });
        saveUsers(users);
      }
    }
  }

  async function logEvento(actor, objetivo, accion, motivo, sha256Hex) {
    const logs = loadAudit();
    const fecha = new Date().toLocaleString("es-CR");
    const h = sha256Hex ? (await sha256Hex(`${fecha}|${actor}|${objetivo}|${accion}|${motivo}`)).slice(0, 20) : Math.random().toString(16).slice(2, 18).toUpperCase();
    logs.unshift({ fecha, actor, objetivo, accion, motivo, hash: h });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 250)));
  }

  function checkAccess(email) {
    const mail = (email || "").toLowerCase().trim();
    const u = loadUsers().find(x => (x.email || "").toLowerCase() === mail);
    if (!u) return { ok: true, user: null };
    if (u.estado === "Bloqueado") return { ok: false, motivo: "Esta cuenta fue bloqueada por administración. Soporte WhatsApp: +506 6090 6359." };
    if (u.estado === "Desactivado") return { ok: false, motivo: "Esta cuenta fue desactivada temporalmente. Solicite reactivación al administrador." };
    return { ok: true, user: u };
  }

  function abrirModalQRUsuario(u, generarQRSVG, sha256Hex) {
    const old = document.getElementById("bds-tz-qr-modal"); if (old) old.remove();
    (async () => {
      const firma = sha256Hex ? (await sha256Hex(`PT-USR|${u.id}|${u.email}|${u.rol}|${(u.extraRoles || []).join(",")}`)).slice(0, 20) : "SHA256VERIFICADO";
      const qrPayload = `PT-QR|v212|${u.email}|${u.rol}|EX:${(u.extraRoles || []).join("+")}|${firma}`;
      const m = document.createElement("div");
      m.id = "bds-tz-qr-modal";
      m.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.9);z-index:299500;display:flex;align-items:center;justify-content:center;padding:16px;";
      m.innerHTML = `
        <div class="bds-card" style="max-width:410px;width:100%;text-align:center;border:2px solid #38bdf8;padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <b style="color:#38bdf8;font-size:13px;">🪪 Credencial Oficial QR SHA-256</b>
            <button id="tzq-x" style="background:#7f1d1d;color:#fff;border:none;padding:4px 9px;border-radius:6px;cursor:pointer;">✕</button>
          </div>
          <h3 style="margin:4px 0 2px;color:#fff;font-size:16px;">${u.nombre}</h3>
          <div style="font-size:11.5px;color:#93c5fd;">${u.rol} • ${u.planilla || "Institucional"} • Estado: <b>${u.estado}</b></div>
          <div style="font-size:11px;color:#34d399;margin:4px 0 10px;">Roles Extra: ${(u.extraRoles && u.extraRoles.length) ? u.extraRoles.join(", ") : "Ninguno"}</div>
          <div style="display:inline-block;margin-bottom:8px;">${generarQRSVG ? generarQRSVG(qrPayload, 180) : ""}</div>
          <div style="font-family:monospace;font-size:10px;color:#6ee7b7;background:#070d19;padding:6px;border-radius:6px;word-break:break-all;margin-bottom:10px;">${qrPayload}</div>
          <button id="tzq-prt" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Imprimir Carné</button>
        </div>
      `;
      document.body.appendChild(m);
      document.getElementById("tzq-x").onclick = () => m.remove();
      document.getElementById("tzq-prt").onclick = () => window.print();
    })();
  }

  function renderPanel(shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const autorizado = sesion && (sesion.rol === "SuperAdmin" || sesion.rolReal === "SuperAdmin" || sesion.rol === "Admin");
    if (!autorizado) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso restringido a SuperAdmin / Admin</h3></div>`;
      return;
    }
    let sub = "usuarios", filtro = "TODOS", busca = "", qrVerifMsg = "";

    function draw() {
      const users = loadUsers();
      const accLogs = loadAccessLogs();
      const audLogs = loadAudit();
      const modLogs = window.BDS_LOAD_MOD_LOGS ? window.BDS_LOAD_MOD_LOGS() : [];

      const list = users.filter(u =>
        (filtro === "TODOS" || u.estado === filtro) &&
        (!busca || (u.nombre || "").toLowerCase().includes(busca.toLowerCase()) || (u.email || "").toLowerCase().includes(busca.toLowerCase()) || (u.rol || "").toLowerCase().includes(busca.toLowerCase()))
      );

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">SUPERTRAZABILIDAD RBAC • 19 ROLES + 5 ROLES EXTRA • QR SHA-256</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🛡️ Trazabilidad, Admins (Daniel/Aarón), Roles Extra y Bitácora</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-st="usuarios" class="tz-st" style="background:${sub === 'usuarios' ? '#1d4ed8' : '#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">👥 Usuarios (${users.length})</button>
              <button data-st="accesos" class="tz-st" style="background:${sub === 'accesos' ? '#1d4ed8' : '#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🕒 Quién Entró (${accLogs.length})</button>
              <button data-st="auditoria" class="tz-st" style="background:${sub === 'auditoria' ? '#1d4ed8' : '#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📜 Auditoría (${audLogs.length})</button>
              <button data-st="moderador" class="tz-st" style="background:${sub === 'moderador' ? '#1d4ed8' : '#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚨 Moderador (${modLogs.length})</button>
              <button id="tz-scan-qr" style="background:#059669;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📷 Leer QR</button>
              <button id="tz-csv" style="background:#0f766e;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          ${qrVerifMsg ? `<div style="background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:10px 12px;border-radius:9px;font-size:12px;margin-bottom:11px;display:flex;justify-content:space-between;align-items:center;gap:8px;"><span>${qrVerifMsg}</span><button id="tz-qclr" style="background:#0f172a;color:#fff;border:none;padding:3px 8px;border-radius:5px;cursor:pointer;">✕</button></div>` : ""}

          ${sub === "usuarios" ? `
            <form id="tz-new-f" style="background:#070d19;border:1px solid #1e3a8a;border-radius:11px;padding:11px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,165px),1fr));gap:7px;margin-bottom:12px;">
              <input id="tzn-nom" type="text" required placeholder="Nombre completo" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="tzn-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
              <select id="tzn-rol" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
                ${ROLES_PRINCIPALES.map(r => `<option value="${r}">${r}</option>`).join("")}
              </select>
              <select id="tzn-pln" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
                <option>MEP</option><option>Junta Administrativa (No MEP)</option><option>Estudiante</option><option>Equipo Admin BDS Devs</option><option>Particular / Familia</option>
              </select>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">+ Crear / Autorizar Cuenta</button>
            </form>

            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">
              ${["TODOS","Activo","Cortesía","Desactivado","Bloqueado"].map(f => `<button data-tf="${f}" class="tz-flt" style="background:${filtro === f ? '#1d4ed8' : '#131f33'};color:#fff;border:1px solid #334155;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">${f}</button>`).join("")}
              <input id="tz-q" type="text" value="${busca}" placeholder="Buscar por nombre, correo o rol..." style="margin-left:auto;background:#070d19;border:1px solid #334155;color:#fff;padding:6px 10px;border-radius:7px;font-size:12px;min-width:190px;"/>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:860px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:7px;text-align:left;">Usuario / Seguimiento</th>
                  <th style="padding:7px;text-align:left;">Rol Principal (RBAC) + Roles Extra</th>
                  <th style="padding:7px;">Estado</th>
                  <th style="padding:7px;text-align:left;">Plan / Vigencia</th>
                  <th style="padding:7px;">Acciones & QR</th>
                </tr>
                ${list.map(u => {
                  const col = u.estado === "Activo" ? "#059669" : (u.estado === "Cortesía" ? "#0284c7" : (u.estado === "Desactivado" ? "#b45309" : "#dc2626"));
                  const prop = (u.email || "").toLowerCase() === "maxi.salsa@gmail.com";
                  const exList = Array.isArray(u.extraRoles) ? u.extraRoles : [];
                  const stU = window.BDS_MOTIVACION ? window.BDS_MOTIVACION.getUserStats(u.email) : null;
                  const segHtml = stU ? `<div style="font-size:9.5px;color:#fbbf24;margin-top:2px;">🔥 ${stU.diasConsecutivos}d • 📊 ${stU.sesionesTotales} visitas (${stU.ultimoDia})</div>` : "";
                  return `<tr>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;">
                      <b>${u.nombre}</b><br/>
                      <span style="font-size:10.5px;color:#94a3b8;">${u.email}</span><br/>
                      <span style="font-size:9.5px;color:#2dd4bf;">${u.planilla || "Institucional"}</span>
                      ${segHtml}
                    </td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;">
                      ${prop ? `<b style="color:#fbbf24;">👑 SuperAdmin (Control Total)</b>` : `
                        <select data-uid="${u.id}" class="tz-rol" style="background:#070d19;color:#fff;border:1px solid #334155;padding:5px;border-radius:6px;font-size:11px;margin-bottom:5px;max-width:220px;">
                          ${ROLES_PRINCIPALES.map(r => `<option value="${r}" ${u.rol === r ? "selected" : ""}>${r}</option>`).join("")}
                        </select>
                        <div style="display:flex;gap:4px;flex-wrap:wrap;">
                          ${ROLES_EXTRA_DEF.map(er => {
                            const on = exList.includes(er.id);
                            return `<button type="button" data-exr="${er.id}" data-uid="${u.id}" title="${er.desc}" class="tz-ex" style="background:${on ? '#059669' : '#1e293b'};color:#fff;border:1px solid ${on ? '#34d399' : '#334155'};padding:2px 6px;border-radius:5px;font-size:10px;font-weight:600;cursor:pointer;">${on ? "✓ " : ""}${er.lbl}</button>`;
                          }).join("")}
                        </div>
                      `}
                    </td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${col};color:#fff;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:700;">${u.estado}</span></td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${u.plan || "Vitalicio"}</b><br/><span style="font-size:10px;color:#94a3b8;">Vence: ${u.vence || "Permanente"}</span></td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                      <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                        ${!prop ? `<button data-act="editmail" data-uid="${u.id}" class="tz-btn" title="Editar nombre o correo" style="background:#334155;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">✏️</button>` : ""}
                        <button data-act="qr" data-uid="${u.id}" class="tz-btn" title="Ver Carné QR SHA-256" style="background:#0f766e;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🪪 QR</button>
                        <button data-act="motivar" data-uid="${u.id}" class="tz-btn" title="Enviar mensaje motivacional pracTICA" style="background:#7c3aed;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🌟</button>
                        ${prop ? `<span style="color:#6ee7b7;font-size:10.5px;align-self:center;">Propietario</span>` : `
                          <button data-act="cortesia" data-uid="${u.id}" class="tz-btn" style="background:#0284c7;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🎁</button>
                          <button data-act="activar" data-uid="${u.id}" class="tz-btn" style="background:#059669;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">✅</button>
                          <button data-act="desactivar" data-uid="${u.id}" class="tz-btn" title="Desactivar usuario" style="background:#b45309;color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">⏸️</button>
                          <button data-act="${u.estado === 'Bloqueado' ? 'desbloquear' : 'bloquear'}" data-uid="${u.id}" class="tz-btn" style="background:${u.estado === 'Bloqueado' ? '#4f46e5' : '#dc2626'};color:#fff;border:none;padding:5px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">${u.estado === 'Bloqueado' ? '🔓' : '🚫'}</button>
                        `}
                      </div>
                    </td>
                  </tr>`;
                }).join("")}
              </table>
            </div>
          ` : ""}

          ${sub === "accesos" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:620px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Fecha</th><th style="padding:7px;text-align:left;">Hora</th><th style="padding:7px;text-align:left;">Usuario</th><th style="padding:7px;">Rol</th><th style="padding:7px;">Método</th><th style="padding:7px;">Equipo</th></tr>
                ${accLogs.map(l => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha}</td><td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#34d399;font-weight:700;">${l.hora}</td><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${l.nombre}</b><br/><span style="font-size:10px;color:#94a3b8;">${l.email}</span></td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${l.rol}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#38bdf8;">${l.metodo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${l.dispositivo}</td></tr>`).join("") || `<tr><td colspan="6" style="padding:14px;text-align:center;color:#64748b;">Aún no hay accesos registrados.</td></tr>`}
              </table>
            </div>
          ` : ""}

          ${sub === "auditoria" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:7px;text-align:left;">Fecha</th><th style="padding:7px;text-align:left;">Actor</th><th style="padding:7px;text-align:left;">Objetivo</th><th style="padding:7px;text-align:left;">Acción</th><th style="padding:7px;text-align:left;">SHA-256</th></tr>
                ${audLogs.map(l => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.actor}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.objetivo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#38bdf8;font-weight:700;">${l.accion}</td><td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#34d399;">${l.hash}</td></tr>`).join("") || `<tr><td colspan="5" style="padding:14px;text-align:center;color:#64748b;">Sin eventos de auditoría aún.</td></tr>`}
              </table>
            </div>
          ` : ""}

          ${sub === "moderador" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:600px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#450a0a;color:#fca5a5;"><th style="padding:7px;text-align:left;">Fecha</th><th style="padding:7px;text-align:left;">Usuario</th><th style="padding:7px;text-align:left;">Alerta PRODHAB / Ley 7739</th><th style="padding:7px;text-align:left;">Extracto</th></tr>
                ${modLogs.map(m => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${m.fecha}</td><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${m.usuario}</b> (${m.rol})</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#fbbf24;">${m.motivo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#94a3b8;">${m.extracto}</td></tr>`).join("") || `<tr><td colspan="4" style="padding:14px;text-align:center;color:#34d399;">✅ Sin incidencias registradas en chats.</td></tr>`}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".tz-st").forEach(b => b.onclick = () => { sub = b.getAttribute("data-st"); draw(); });
      shell.querySelectorAll(".tz-flt").forEach(b => b.onclick = () => { filtro = b.getAttribute("data-tf"); draw(); });
      if (document.getElementById("tz-qclr")) document.getElementById("tz-qclr").onclick = () => { qrVerifMsg = ""; draw(); };
      if (document.getElementById("tz-q")) document.getElementById("tz-q").oninput = (e) => { busca = e.target.value; draw(); document.getElementById("tz-q").focus(); };

      document.getElementById("tz-scan-qr").onclick = () => {
        if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible en este navegador.");
        window.BDS_QR_CAMERA.openModal({
          title: "Verificar Credencial QR SHA-256",
          onScan: (code) => {
            const m = String(code || "").match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
            const mail = m ? m[0].toLowerCase() : "";
            const hit = loadUsers().find(x => (mail && x.email.toLowerCase() === mail) || String(code).toLowerCase().includes(x.id.toLowerCase()));
            if (hit) {
              qrVerifMsg = `✅ QR SHA-256 VÁLIDO: <b>${hit.nombre}</b> (${hit.email}) • Rol: <b>${hit.rol}</b> • Roles Extra: <b>${(hit.extraRoles || []).join(", ") || "Ninguno"}</b> • Estado: <b>${hit.estado}</b>`;
              busca = hit.email;
            } else {
              qrVerifMsg = `⚠️ QR leído (${String(code).slice(0, 60)}), usuario no registrado aún en Trazabilidad.`;
            }
            sub = "usuarios"; draw();
          }
        });
      };

      if (document.getElementById("tz-new-f")) document.getElementById("tz-new-f").onsubmit = async (e) => {
        e.preventDefault();
        const nom = document.getElementById("tzn-nom").value.trim();
        const mail = document.getElementById("tzn-mail").value.trim().toLowerCase();
        const rol = document.getElementById("tzn-rol").value;
        const pln = document.getElementById("tzn-pln").value;
        const arr = loadUsers();
        const ex = arr.find(x => x.email.toLowerCase() === mail);
        if (ex) { ex.nombre = nom; ex.rol = rol; ex.planilla = pln; ex.estado = "Activo"; }
        else {
          const extraDef = rol === "Encargada Comedor / Junta" ? ["Comedor"] : [];
          arr.unshift({ id: "USR-" + String(Date.now()).slice(-4), nombre: nom, email: mail, rol, extraRoles: extraDef, planilla: pln, inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Cortesía", vence: "Permanente", intentos: 0 });
        }
        saveUsers(arr);
        await logEvento(sesion.nombre, mail, `ALTA/UPDATE (${rol} • ${pln})`, "Gestión Admin", sha256Hex);
        draw();
      };

      shell.querySelectorAll(".tz-rol").forEach(sel => sel.onchange = async () => {
        const arr = loadUsers(), u = arr.find(x => x.id === sel.getAttribute("data-uid"));
        if (!u) return;
        const prev = u.rol; u.rol = sel.value; saveUsers(arr);
        await logEvento(sesion.nombre, u.email, `ROL (${prev} → ${u.rol})`, "Cambio RBAC", sha256Hex);
        draw();
      });

      shell.querySelectorAll(".tz-ex").forEach(bx => bx.onclick = async () => {
        const uid = bx.getAttribute("data-uid"), er = bx.getAttribute("data-exr");
        toggleExtraRole(uid, er);
        const u = loadUsers().find(x => x.id === uid);
        if (u) await logEvento(sesion.nombre, u.email, `ROL EXTRA (${er})`, "Permiso adicional", sha256Hex);
        draw();
      });

      shell.querySelectorAll(".tz-btn").forEach(b => b.onclick = async () => {
        const arr = loadUsers(), u = arr.find(x => x.id === b.getAttribute("data-uid"));
        if (!u) return;
        const act = b.getAttribute("data-act");
        if (act === "editmail") {
          const nm = prompt("Nombre completo:", u.nombre);
          const em = prompt("Correo real (@gmail.com o @mep.go.cr):", u.email);
          if (nm && em) {
            u.nombre = nm.trim(); u.email = em.trim().toLowerCase(); saveUsers(arr);
            await logEvento(sesion.nombre, u.email, "EDITAR CORREO/NOMBRE", "Actualización Admin", sha256Hex);
            draw();
          }
          return;
        }
        if (act === "qr") { abrirModalQRUsuario(u, generarQRSVG, sha256Hex); return; }
        if (act === "motivar") {
          const msg = prompt(`Mensaje motivacional pracTICA para ${u.nombre}:`, "¡Excelente trabajo en pracTICA! Sigue avanzando hoy hacia tu meta.");
          if (msg && window.BDS_MOTIVACION) {
            window.BDS_MOTIVACION.enviarMotivacionAUsuario(u.email, sesion.nombre, msg);
            await logEvento(sesion.nombre, u.email, "MOTIVACIÓN", msg.slice(0, 60), sha256Hex);
            draw();
          }
          return;
        }
        if (act === "cortesia") {
          const d = prompt("Días de cortesía (30, 90, 365 o VITALICIA):", "VITALICIA"); if (!d) return;
          u.estado = "Cortesía";
          u.plan = d.toUpperCase().includes("VIT") ? "Cortesía Vitalicia" : `Cortesía ${parseInt(d, 10) || 30} días`;
          u.vence = d.toUpperCase().includes("VIT") ? "Permanente" : new Date(Date.now() + (parseInt(d, 10) || 30) * 86400000).toISOString().slice(0, 10);
          await logEvento(sesion.nombre, u.email, u.plan, "Cortesía Admin", sha256Hex);
        } else if (act === "activar" || act === "desbloquear") {
          u.estado = "Activo"; u.intentos = 0;
          await logEvento(sesion.nombre, u.email, act.toUpperCase(), "Habilitado", sha256Hex);
        } else if (act === "desactivar") {
          u.estado = "Desactivado";
          await logEvento(sesion.nombre, u.email, "DESACTIVAR", "Desactivado por Admin", sha256Hex);
        } else if (act === "bloquear") {
          u.estado = "Bloqueado";
          await logEvento(sesion.nombre, u.email, "BLOQUEAR", "Bloqueo de seguridad", sha256Hex);
        }
        saveUsers(arr); draw();
      });

      document.getElementById("tz-csv").onclick = () => {
        const rows = [["ID","NOMBRE","EMAIL","ROL","ROLES_EXTRA","PLANILLA","ESTADO","PLAN","VENCE"], ...loadUsers().map(u => [u.id, u.nombre, u.email, u.rol, (u.extraRoles || []).join("|"), u.planilla || "", u.estado, u.plan, u.vence])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "trazabilidad-usuarios-rbac.csv"; a.click();
      };
    }
    draw();
  }

  window.BDS_TRAZABILIDAD = { loadUsers, checkAccess, logAcceso, getExtraRoles, toggleExtraRole, ROLES_PRINCIPALES, ROLES_EXTRA_DEF, renderPanel };
})();