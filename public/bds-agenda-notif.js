(function () {
  const AG_KEY = "bds_agenda_escolar_v191";
  const NT_KEY = "bds_notificaciones_v191";

  const MOTIVACIONES = [
    "🌟 ¡Cada práctica suma! 15 minutos diarios te acercan a tu meta académica y técnica.",
    "🔥 Tu racha demuestra disciplina real. ¡Sigue avanzando hoy en pracTICAtecnica.com!",
    "🦉 Recuerda: los grandes ingenieros y profesionales se construyen un hábito a la vez.",
    "🎯 Revisa tu agenda y tus horarios 2027–2030 para mantener el control de tus entregas."
  ];

  function loadAgenda() {
    try { const d = JSON.parse(localStorage.getItem(AG_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "AG-1", anio: "2027", fecha: "2027-02-08", hora: "07:00", tipo: "Anuncio", titulo: "Inicio del Curso Lectivo 2027", detalle: "Bienvenida oficial, entrega de horarios por sección y validación de Carné QR SHA-256." },
      { id: "AG-2", anio: "2027", fecha: "2027-03-15", hora: "09:00", tipo: "Cita", titulo: "Reunión de Padres y Encargados Legales", detalle: "Revisión de promedios REA, asistencia automática y becas de comedor PANEA." },
      { id: "AG-3", anio: "2027", fecha: "2027-04-11", hora: "07:30", tipo: "Efeméride", titulo: "Acto Cívico 11 de Abril", detalle: "Conmemoración de la Batalla de Rivas y Juan Santamaría." }
    ];
    localStorage.setItem(AG_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveAgenda(a) { localStorage.setItem(AG_KEY, JSON.stringify(a)); }

  function loadNotifs() {
    try { const d = JSON.parse(localStorage.getItem(NT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "NT-1", fecha: new Date().toLocaleString("es-CR"), tipo: "Motivación", titulo: "¡Bienvenido a la nueva experiencia Mobile-First!", cuerpo: MOTIVACIONES[0], leida: false },
      { id: "NT-2", fecha: new Date().toLocaleString("es-CR"), tipo: "Promedio", titulo: "Seguimiento REA activo", cuerpo: "Tu promedio y porcentaje de asistencia se calculan automáticamente en tiempo real.", leida: false }
    ];
    localStorage.setItem(NT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveNotifs(a) { localStorage.setItem(NT_KEY, JSON.stringify(a)); }

  function pushNative(titulo, cuerpo) {
    const arr = loadNotifs();
    arr.unshift({ id: "NT-" + Date.now(), fecha: new Date().toLocaleString("es-CR"), tipo: "Alerta", titulo, cuerpo, leida: false });
    saveNotifs(arr.slice(0, 40));
    updateBellBadge();
    try {
      if (window.BDS_NATIVE && window.BDS_NATIVE.notify) { window.BDS_NATIVE.notify(titulo, cuerpo); }
    } catch {}
  }

  function updateBellBadge() {
    const unread = loadNotifs().filter(n => !n.leida).length;
    const el = document.getElementById("bds-notif-badge");
    if (el) { el.innerText = unread > 0 ? String(unread) : ""; el.style.display = unread > 0 ? "inline-flex" : "none"; }
  }

  function openNotifModal() {
    const old = document.getElementById("bds-notif-modal"); if (old) { old.remove(); return; }
    const arr = loadNotifs();
    const modal = document.createElement("div");
    modal.id = "bds-notif-modal";
    modal.style.cssText = "position:fixed;top:58px;right:12px;z-index:296000;width:380px;max-width:calc(100vw - 24px);background:#0b1322;border:1px solid #38bdf8;border-radius:14px;padding:14px;box-shadow:0 20px 50px rgba(0,0,0,0.85);color:#f1f5f9;";
    const perm = ("Notification" in window) ? Notification.permission : "unsupported";
    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:10px;">
        <b style="font-size:14px;color:#38bdf8;">🔔 Notificaciones y Motivación</b>
        <div style="display:flex;gap:5px;">
          <button id="nt-readall" style="background:#131f33;color:#6ee7b7;border:1px solid #334155;padding:4px 8px;border-radius:6px;font-size:10.5px;cursor:pointer;">Marcar leídas</button>
          <button id="nt-cls" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">✕</button>
        </div>
      </div>
      ${perm !== "granted" && perm !== "unsupported" ? `<button id="nt-perm" style="width:100%;background:#059669;color:#fff;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;margin-bottom:10px;">📲 Activar Notificaciones Push Nativas</button>` : ""}
      <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
        ${arr.map(n => `<div style="background:#070d19;border-left:3px solid ${n.leida?'#334155':'#38bdf8'};padding:9px;border-radius:8px;font-size:12px;"><div style="display:flex;justify-content:space-between;"><b style="color:#fff;">${n.titulo}</b><span style="font-size:10px;color:#94a3b8;">${n.tipo}</span></div><div style="color:#cbd5e1;margin-top:3px;">${n.cuerpo}</div><div style="font-size:9.5px;color:#64748b;margin-top:4px;">${n.fecha}</div></div>`).join("")}
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("nt-cls").onclick = () => modal.remove();
    document.getElementById("nt-readall").onclick = () => {
      const u = loadNotifs().map(x => ({ ...x, leida: true }));
      saveNotifs(u); updateBellBadge(); modal.remove();
    };
    if (document.getElementById("nt-perm")) document.getElementById("nt-perm").onclick = async () => {
      try {
        const res = await Notification.requestPermission();
        if (res === "granted") pushNative("🔔 Push Activado en pracTICAtecnica.com", "Recibirás avisos de citas, promedios, mensajes y agenda escolar.");
        modal.remove();
      } catch {}
    };
  }

  window.BDS_RENDER_AGENDA_HORARIO = function (shell, ctx) {
    const { sesion } = ctx;
    const puedeCrear = ["SuperAdmin","Director(a)","Docente MEP","Auxiliar Administrativo"].includes(sesion.rol);
    let selAnio = "2027";
    const anios = ["2026","2027","2028","2029","2030","2031"];

    function draw() {
      const agenda = loadAgenda().filter(a => a.anio === selAnio);
      const mot = MOTIVACIONES[new Date().getDate() % MOTIVACIONES.length];
      let horData = null;
      try { horData = JSON.parse(localStorage.getItem("bds_horarios_ia_v187")); } catch {}
      const miSec = sesion.seccion || "11-1";

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;background:linear-gradient(135deg,#0d192e 0%,#0b1322 100%);border-color:#10b981;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13px;color:#6ee7b7;font-weight:700;">${mot}</div>
            <button id="ag-push" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔔 Probar Notificación Push</button>
          </div>
        </div>

        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#1d4ed8;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">MATRÍCULA HISTÓRICA Y PROSPECTIVA 2026–2031</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">📆 Agenda Institucional, Citas y Mi Horario (${selAnio})</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              ${anios.map(y => `<button data-yr="${y}" class="ag-yr" style="background:${selAnio===y?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">${y}</button>`).join("")}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start;">
            <div>
              <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">📌 Eventos, Citas y Anuncios (${selAnio})</h3>
              ${puedeCrear ? `
                <form id="ag-f" style="background:#070d19;border:1px solid #334155;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                    <input id="ag-fec" type="date" value="${selAnio}-02-15" required style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                    <input id="ag-hr" type="time" value="08:00" required style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                    <select id="ag-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;">
                      <option>Anuncio</option><option>Cita</option><option>Examen</option><option>Efeméride</option>
                    </select>
                  </div>
                  <input id="ag-tit" type="text" required placeholder="Título del anuncio o cita..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12.5px;"/>
                  <input id="ag-det" type="text" required placeholder="Detalle breve (notifica a los usuarios)..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">+ Publicar en Agenda y Notificar</button>
                </form>
              ` : ""}
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${agenda.map(a => `<div style="background:#070d19;border-left:4px solid #38bdf8;border-radius:9px;padding:10px;font-size:12px;"><div style="display:flex;justify-content:space-between;"><b>${a.titulo}</b><span style="color:#fbbf24;font-weight:800;">${a.fecha} ${a.hora}</span></div><div style="color:#cbd5e1;margin-top:3px;">${a.detalle}</div></div>`).join("") || `<div style="color:#64748b;font-size:12px;">Sin eventos agendados aún para ${selAnio}.</div>`}
              </div>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">📅 Mi Horario Según Matrícula ${selAnio} (Sección ${miSec})</h3>
              ${horData && horData.grid && horData.grid[miSec] ? `
                <div style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">Horario oficial vinculado automáticamente a tu sección matriculada <b>${miSec}</b> • SHA-256: <code>${horData.hash}</code></div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  ${["Lunes","Martes","Miércoles","Jueves","Viernes"].map(d => {
                    const bloques = horData.grid[miSec][d] || {};
                    const items = Object.entries(bloques).map(([k, v]) => `<b>${k}:</b> ${v.materia} (${v.aula})`).join(" • ");
                    return `<div style="background:#0b1322;padding:8px;border-radius:7px;font-size:11.5px;"><b style="color:#38bdf8;">${d}:</b> ${items || "Horario por confirmar"}</div>`;
                  }).join("")}
                </div>
              ` : `<p style="font-size:12px;color:#94a3b8;margin:0;">Cuando Dirección genere el Horario IA en <b>🏫 Matrícula & Horarios IA</b> para la sección <b>${miSec}</b> (${selAnio}), aparecerá aquí automáticamente.</p>`}
            </div>
          </div>
        </div>
      `;

      shell.querySelectorAll(".ag-yr").forEach(b => b.onclick = () => { selAnio = b.getAttribute("data-yr"); draw(); });
      document.getElementById("ag-push").onclick = () => {
        if ("Notification" in window && Notification.permission !== "granted") {
          Notification.requestPermission().then(() => pushNative("🔔 Recordatorio pracTICAtecnica.com", mot));
        } else {
          pushNative("🔔 Recordatorio pracTICAtecnica.com", mot);
        }
      };
      if (document.getElementById("ag-f")) document.getElementById("ag-f").onsubmit = (e) => {
        e.preventDefault();
        const arr = loadAgenda();
        const tit = document.getElementById("ag-tit").value.trim();
        const det = document.getElementById("ag-det").value.trim();
        const fec = document.getElementById("ag-fec").value;
        const hr = document.getElementById("ag-hr").value;
        const tip = document.getElementById("ag-tip").value;
        arr.unshift({ id: "AG-" + Date.now(), anio: selAnio, fecha: fec, hora: hr, tipo: tip, titulo: tit, detalle: det });
        saveAgenda(arr);
        pushNative(`📆 Nuevo ${tip} (${selAnio}): ${tit}`, `${fec} ${hr} — ${det}`);
        draw();
      };
    }
    draw();
  };

  window.BDS_NOTIF = { pushNative, openNotifModal, updateBellBadge };
})();