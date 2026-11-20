(function () {
  const USERS_KEY = "bds_users_governance_v184";
  const AUDIT_KEY = "bds_users_auditlog_v184";
  const ACCESS_KEY = "bds_access_logs_v193";

  function loadUsers() {
    try { const d = JSON.parse(localStorage.getItem(USERS_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const mock = [
      { id: "USR-001", nombre: "Ing. Max Salazar Sánchez", email: "maxi.salsa@gmail.com", rol: "SuperAdmin", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Vitalicio Propietario", vence: "Permanente", intentos: 0 },
      { id: "USR-002", nombre: "Directora Laura Ramón", email: "laura.ramon@mep.go.cr", rol: "Director(a)", inst: "CTP Mercedes Norte", estado: "Activo", plan: "Institucional ₡19,100", vence: "2027-12-31", intentos: 0 },
      { id: "USR-003", nombre: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", inst: "CTP Mercedes Norte", estado: "Cortesía", plan: "Cortesía 90 días", vence: "2027-02-18", intentos: 0 },
      { id: "USR-004", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", rol: "Estudiante", inst: "CTP Mercedes Norte (11-1)", estado: "Activo", plan: "Institucional ₡1,000", vence: "2027-12-31", intentos: 0 }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(mock));
    return mock;
  }
  function saveUsers(a) { localStorage.setItem(USERS_KEY, JSON.stringify(a)); }

  function loadAudit() {
    try { const d = JSON.parse(localStorage.getItem(AUDIT_KEY)); if (Array.isArray(d)) return d; } catch {}
    return [];
  }
  function loadAccessLogs() {
    try { const d = JSON.parse(localStorage.getItem(ACCESS_KEY)); if (Array.isArray(d)) return d; } catch {}
    return [];
  }

  function logAcceso(sesion, metodo) {
    if (!sesion || !sesion.email) return;
    const logs = loadAccessLogs();
    const disp = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? "📱 Móvil" : "💻 Desktop";
    logs.unshift({
      fecha: new Date().toLocaleDateString("es-CR"),
      hora: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      nombre: sesion.nombre || sesion.email,
      email: sesion.email,
      rol: sesion.rol,
      metodo: metodo || "Acceso",
      dispositivo: disp
    });
    localStorage.setItem(ACCESS_KEY, JSON.stringify(logs.slice(0, 200)));

    // Registrar usuario en padrón si es nuevo (sin cambiar roles ya asignados)
    if (!sesion.visitante) {
      const users = loadUsers();
      if (!users.some(u => u.email.toLowerCase() === sesion.email.toLowerCase())) {
        users.unshift({
          id: "USR-" + String(Date.now()).slice(-4),
          nombre: sesion.nombre || sesion.email.split("@")[0],
          email: sesion.email.toLowerCase(),
          rol: sesion.rol,
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
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 200)));
  }

  function checkAccess(email) {
    const mail = (email || "").toLowerCase().trim();
    const u = loadUsers().find(x => x.email.toLowerCase() === mail);
    if (!u) return { ok: true, user: null };
    if (u.estado === "Bloqueado") return { ok: false, motivo: "Esta cuenta fue bloqueada por administración. Soporte: +506 6090 6359." };
    if (u.estado === "Desactivado") return { ok: false, motivo: "Esta cuenta está desactivada temporalmente. Solicite reactivación o cortesía." };
    return { ok: true, user: u };
  }

  function renderPanel(shell, ctx) {
    const { sesion, sha256Hex } = ctx;
    if (sesion.rol !== "SuperAdmin") {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso restringido a SuperAdmin</h3></div>`;
      return;
    }
    let sub = "usuarios", filtro = "TODOS", busca = "";

    function draw() {
      const users = loadUsers();
      const accLogs = loadAccessLogs();
      const audLogs = loadAudit();
      const list = users.filter(u =>
        (filtro === "TODOS" || u.estado === filtro) &&
        (!busca || u.nombre.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase()))
      );

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">SUPERTRAZABILIDAD SUPERADMIN • LOGS EN VIVO SHA-256</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🛡️ Trazabilidad, Cortesías y Bitácora de Accesos</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-st="usuarios" class="tz-st" style="background:${sub==='usuarios'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">👥 Usuarios (${users.length})</button>
              <button data-st="accesos" class="tz-st" style="background:${sub==='accesos'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🕒 Quién Entró (${accLogs.length})</button>
              <button data-st="auditoria" class="tz-st" style="background:${sub==='auditoria'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📜 Auditoría (${audLogs.length})</button>
              <button id="tz-csv" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          ${sub === "usuarios" ? `
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
              ${["TODOS","Activo","Cortesía","Desactivado","Bloqueado"].map(f => `<button data-tf="${f}" class="tz-flt" style="background:${filtro===f?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${f}</button>`).join("")}
              <button id="tz-add" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">+ Nuevo / Autorizar Rol</button>
              <input id="tz-q" type="text" value="${busca}" placeholder="Buscar usuario o correo..." style="margin-left:auto;background:#070d19;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:8px;font-size:12px;min-width:200px;"/>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:760px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:8px;text-align:left;">Usuario</th><th style="padding:8px;text-align:left;">Rol RBAC</th><th style="padding:8px;">Estado</th><th style="padding:8px;text-align:left;">Plan / Vigencia</th><th style="padding:8px;">Control</th></tr>
                ${list.map(u => {
                  const col = u.estado==="Activo"?"#059669":(u.estado==="Cortesía"?"#0284c7":(u.estado==="Desactivado"?"#b45309":"#dc2626"));
                  const prop = u.email === "maxi.salsa@gmail.com";
                  return `<tr>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${u.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${u.email}</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;">${prop ? `<b style="color:#fbbf24;">👑 SuperAdmin</b>` : `<select data-uid="${u.id}" class="tz-rol" style="background:#070d19;color:#fff;border:1px solid #334155;padding:5px;border-radius:6px;font-size:11.5px;">${["Estudiante","Docente MEP","Director(a)","Particular (MOPT / Admisión)","Padre/Madre","Auxiliar Administrativo","Encargada Comedor / Junta","Guarda / Seguridad"].map(r => `<option ${u.rol===r?"selected":""}>${r}</option>`).join("")}</select>`}</td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${col};color:#fff;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:800;">${u.estado}</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${u.plan}</b><br/><span style="font-size:10.5px;color:#94a3b8;">Vence: ${u.vence}</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${prop ? `<span style="color:#6ee7b7;font-weight:700;">Propietario</span>` : `<div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;"><button data-act="cortesia" data-uid="${u.id}" class="tz-btn" style="background:#0284c7;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🎁 Cortesía</button><button data-act="activar" data-uid="${u.id}" class="tz-btn" style="background:#059669;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Activar</button><button data-act="desactivar" data-uid="${u.id}" class="tz-btn" style="background:#b45309;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">⏸️ Pausar</button><button data-act="${u.estado==='Bloqueado'?'desbloquear':'bloquear'}" data-uid="${u.id}" class="tz-btn" style="background:${u.estado==='Bloqueado'?'#4f46e5':'#dc2626'};color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">${u.estado==='Bloqueado'?'🔓 Desbloq.':'🚫 Bloquear'}</button></div>`}</td>
                  </tr>`;
                }).join("")}
              </table>
            </div>
          ` : ""}

          ${sub === "accesos" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:8px;text-align:left;">Fecha</th><th style="padding:8px;text-align:left;">Hora Exacta</th><th style="padding:8px;text-align:left;">Usuario / Correo</th><th style="padding:8px;">Rol</th><th style="padding:8px;">Método</th><th style="padding:8px;">Dispositivo</th></tr>
                ${accLogs.map(l => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha}</td><td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#34d399;font-weight:800;">${l.hora}</td><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${l.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${l.email}</span></td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${l.rol}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#38bdf8;">${l.metodo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${l.dispositivo}</td></tr>`).join("") || `<tr><td colspan="6" style="padding:14px;text-align:center;color:#64748b;">Aún no hay accesos registrados.</td></tr>`}
              </table>
            </div>
          ` : ""}

          ${sub === "auditoria" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:7px;text-align:left;">Fecha / Hora</th><th style="padding:7px;text-align:left;">Actor</th><th style="padding:7px;text-align:left;">Usuario</th><th style="padding:7px;text-align:left;">Acción</th><th style="padding:7px;text-align:left;">Motivo</th><th style="padding:7px;text-align:left;">SHA-256</th></tr>
                ${audLogs.map(l => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.actor}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.objetivo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#38bdf8;font-weight:800;">${l.accion}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.motivo}</td><td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#34d399;">${l.hash}</td></tr>`).join("") || `<tr><td colspan="6" style="padding:14px;text-align:center;color:#64748b;">Sin cambios administrativos aún.</td></tr>`}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".tz-st").forEach(b => b.onclick = () => { sub = b.getAttribute("data-st"); draw(); });
      shell.querySelectorAll(".tz-flt").forEach(b => b.onclick = () => { filtro = b.getAttribute("data-tf"); draw(); });
      if (document.getElementById("tz-q")) document.getElementById("tz-q").oninput = (e) => { busca = e.target.value; draw(); document.getElementById("tz-q").focus(); };
      if (document.getElementById("tz-add")) document.getElementById("tz-add").onclick = async () => {
        const nom = prompt("Nombre completo:"); if (!nom) return;
        const email = prompt("Correo (@mep.go.cr, @est.mep.go.cr o @gmail.com):"); if (!email) return;
        const rol = prompt("Rol (Estudiante, Docente MEP, Director(a), Auxiliar Administrativo):", "Docente MEP") || "Docente MEP";
        const arr = loadUsers();
        arr.unshift({ id: "USR-" + String(Date.now()).slice(-4), nombre: nom.trim(), email: email.trim().toLowerCase(), rol, inst: "CTP Mercedes Norte", estado: "Cortesía", plan: "Cortesía 90 días", vence: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10), intentos: 0 });
        saveUsers(arr);
        await logEvento(sesion.nombre, email.trim().toLowerCase(), `ALTA (${rol})`, "Autorizado por SuperAdmin", sha256Hex);
        draw();
      };
      shell.querySelectorAll(".tz-rol").forEach(sel => sel.onchange = async () => {
        const arr = loadUsers(), u = arr.find(x => x.id === sel.getAttribute("data-uid"));
        if (!u) return;
        const prev = u.rol; u.rol = sel.value; saveUsers(arr);
        await logEvento(sesion.nombre, u.email, `ROL (${prev} → ${u.rol})`, "Cambio RBAC", sha256Hex);
        draw();
      });
      shell.querySelectorAll(".tz-btn").forEach(b => b.onclick = async () => {
        const arr = loadUsers(), u = arr.find(x => x.id === b.getAttribute("data-uid"));
        if (!u) return;
        const act = b.getAttribute("data-act");
        if (act === "cortesia") {
          const d = prompt("Días de cortesía (30, 90, 365 o VITALICIA):", "90"); if (!d) return;
          u.estado = "Cortesía";
          u.plan = d.toUpperCase().includes("VIT") ? "Cortesía Vitalicia" : `Cortesía ${parseInt(d,10)||30} días`;
          u.vence = d.toUpperCase().includes("VIT") ? "Permanente" : new Date(Date.now() + (parseInt(d,10)||30) * 86400000).toISOString().slice(0, 10);
          await logEvento(sesion.nombre, u.email, u.plan, "Cortesía SuperAdmin", sha256Hex);
        } else if (act === "activar" || act === "desbloquear") {
          u.estado = "Activo"; u.intentos = 0;
          await logEvento(sesion.nombre, u.email, act.toUpperCase(), "Habilitado por SuperAdmin", sha256Hex);
        } else if (act === "desactivar") {
          u.estado = "Desactivado";
          await logEvento(sesion.nombre, u.email, "DESACTIVAR", "Pausado por SuperAdmin", sha256Hex);
        } else if (act === "bloquear") {
          u.estado = "Bloqueado";
          await logEvento(sesion.nombre, u.email, "BLOQUEAR", "Bloqueo de seguridad", sha256Hex);
        }
        saveUsers(arr); draw();
      });
      document.getElementById("tz-csv").onclick = () => {
        const rows = [["FECHA","HORA","NOMBRE","EMAIL","ROL","METODO","DISPOSITIVO"], ...loadAccessLogs().map(l => [l.fecha, l.hora, l.nombre, l.email, l.rol, l.metodo, l.dispositivo])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = "bitacora-accesos-practicatecnica.csv";
        a.click();
      };
    }
    draw();
  }

  window.BDS_TRAZABILIDAD = { loadUsers, checkAccess, logAcceso, renderPanel };
})();