(function () {
  const VIS_KEY = "bds_porton_visitantes_v211";
  const SAL_LOG_KEY = "bds_porton_salidas_log_v211";
  const MANT_KEY = "bds_conserjeria_tickets_v211";
  const CHK_KEY = "bds_conserjeria_check_v211";

  const AREAS_ASEO_DEF = [
    { id: "aulas", nom: "Pabellones y Aulas Académicas", turno: "Mañana / Tarde", listo: false, hora: "" },
    { id: "labs", nom: "Laboratorios de Cómputo y Talleres Técnicos", turno: "Mañana / Tarde", listo: false, hora: "" },
    { id: "sanitarios", nom: "Servicios Sanitarios Estudiantiles y Personal", turno: "Rotativo cada 2h", listo: false, hora: "" },
    { id: "comedor", nom: "Comedor Escolar y Pasillos de Acceso", turno: "Pre y Post Almuerzo", listo: false, hora: "" },
    { id: "zonas", nom: "Gimnasio, Portón Principal y Zonas Verdes", turno: "Diario", listo: false, hora: "" }
  ];

  function getInstMeta() {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=211" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=211" };
    return { ...inst, logoMep: b.logoMep };
  }

  function loadVisitantes() {
    try { const d = JSON.parse(localStorage.getItem(VIS_KEY)); if (Array.isArray(d)) return d; } catch {}
    const seed = [
      { id: "VIS-101", fecha: new Date().toISOString().slice(0, 10), nombre: "Ana Rojas Vega", cedula: "4-0188-0541", placa: "BJK-412", destino: "Dirección / Retiro Estudiante", horaEntrada: "09:45", horaSalida: "", registradoPor: "Auxiliar de Vigilancia", hash: "VIS211A8F901C2" }
    ];
    localStorage.setItem(VIS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveVisitantes(a) { localStorage.setItem(VIS_KEY, JSON.stringify(a.slice(0, 300))); }

  function loadSalidasLog() { try { const d = JSON.parse(localStorage.getItem(SAL_LOG_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function saveSalidasLog(a) { localStorage.setItem(SAL_LOG_KEY, JSON.stringify(a.slice(0, 300))); }

  function loadTickets() {
    try { const d = JSON.parse(localStorage.getItem(MANT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "MNT-101", fecha: new Date().toISOString().slice(0, 10), ubicacion: "Pabellón B — Lab Web 1", categoria: "Eléctrico / Iluminación", prioridad: "MEDIA", descripcion: "Lámpara LED parpadeando sobre estación 4; requiere reemplazo.", estado: "PENDIENTE", reportadoPor: "Conserjería / Mantenimiento", resueltoPor: "", horaCierre: "", hash: "MNT211C4E9011A" }
    ];
    localStorage.setItem(MANT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveTickets(a) { localStorage.setItem(MANT_KEY, JSON.stringify(a.slice(0, 250))); }

  function loadChecklist() {
    const hoy = new Date().toISOString().slice(0, 10);
    try {
      const d = JSON.parse(localStorage.getItem(CHK_KEY));
      if (d && d.fecha === hoy && Array.isArray(d.items)) return d;
    } catch {}
    const init = { fecha: hoy, items: AREAS_ASEO_DEF.map(x => ({ ...x })) };
    localStorage.setItem(CHK_KEY, JSON.stringify(init));
    return init;
  }
  function saveChecklist(d) { localStorage.setItem(CHK_KEY, JSON.stringify(d)); }

  // Valida y registra la salida física en portón de un Pase de Salida Anticipada
  function registrarSalidaPorton(permisoId, oficialNombre) {
    if (!window.BDS_PERMISOS_API) return { ok: false, msg: "Módulo de permisos no disponible." };
    const perms = window.BDS_PERMISOS_API.loadPerm();
    const p = perms.find(x => x.id === permisoId || (x.hash && String(permisoId).includes(x.hash)));
    if (!p) return { ok: false, msg: "No se encontró ningún pase con ese código." };
    if (p.estado !== "APROBADO") return { ok: false, msg: `Pase ${p.id} aún no está APROBADO por Dirección/Auxiliar (Estado: ${p.estado}).` };
    if ((p.categoria === "ESTUDIANTE" || p.rol === "Estudiante") && !p.autorizadoEncargado) {
      return { ok: false, msg: `Pase ${p.id} no cuenta con autorización del Encargado Legal.` };
    }
    const logs = loadSalidasLog();
    if (logs.some(l => l.permisoId === p.id)) return { ok: false, msg: `El pase ${p.id} ya fue utilizado en portón anteriormente.` };

    const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
    const entry = {
      id: "PRT-" + String(Date.now()).slice(-5),
      permisoId: p.id,
      fecha: new Date().toISOString().slice(0, 10),
      horaSalidaReal: hora,
      persona: p.solicitante,
      seccion: p.seccion || p.rol,
      encargado: p.encargadoNombre || "Autorizado",
      oficial: oficialNombre || "Auxiliar de Vigilancia",
      hash: p.hash || "SHA256"
    };
    logs.unshift(entry);
    saveSalidasLog(logs);
    return { ok: true, entry, msg: `✅ Salida validada en portón: ${p.solicitante} (${hora}).` };
  }

  function imprimirReportePDF(titulo, encabezados, filas, hash, generarQRSVG, responsable) {
    const m = getInstMeta();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el reporte PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${titulo}</title><style>body{font-family:Inter,Arial,sans-serif;padding:22px;color:#0f172a;font-size:11.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:8px;margin-bottom:12px}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #cbd5e1;padding:6px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;border:1.5px solid #0f766e;padding:8px;border-radius:8px}</style></head><body><div class="hdr"><img src="${m.escudo}" style="height:54px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${m.nombre}</h2><div>📍 ${m.provincia} • ${m.regional} • ${m.circuito} • Cód. ${m.codigoPresup}</div><h3 style="margin:3px 0 0;color:#0f766e">${titulo}</h3></div><img src="${m.logoMep}" style="height:40px"/></div><table><tr>${encabezados.map(h => `<th>${h}</th>`).join("")}</tr>${filas.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table><div class="qr">${generarQRSVG ? generarQRSVG("PT-OPS|" + hash, 80) : ""}<div><b>Bitácora Oficial Verificable QR SHA-256</b><br/>Emitido por: ${responsable}<br/>Sello: <code>${hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_PORTON_MANT_API = {
    loadVisitantes, saveVisitantes, loadSalidasLog, loadTickets, saveTickets, loadChecklist, saveChecklist, registrarSalidaPorton
  };

  // ==================== VISTA 1: CONTROL DE PORTÓN Y VIGILANCIA (SEGURIDAD) ====================
  window.BDS_RENDER_PORTON_SEGURIDAD = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const permitidos = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Auxiliar de Vigilancia (Seguridad)"];
    if (!sesion || !permitidos.includes(sesion.rol)) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso exclusivo a Vigilancia / Seguridad y Administración</h3></div>`;
      return;
    }

    let sub = "pases"; // pases | visitantes | historial
    let scanMsg = "";

    function draw() {
      const vis = loadVisitantes();
      const sLog = loadSalidasLog();
      const pasesListos = window.BDS_PERMISOS_API
        ? window.BDS_PERMISOS_API.loadPerm().filter(p => p.estado === "APROBADO" && !sLog.some(l => l.permisoId === p.id))
        : [];
      const adentro = vis.filter(v => !v.horaSalida).length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#1e3a8a;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">AUXILIAR DE VIGILANCIA • CONTROL DE PORTÓN QR SHA-256 • LEY 7739 / PRODHAB</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🛡️ Control de Portón, Pases de Salida y Visitantes</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-ps="pases" class="ps-t" style="background:${sub==='pases'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚪 Pases Aprobados (${pasesListos.length})</button>
              <button data-ps="visitantes" class="ps-t" style="background:${sub==='visitantes'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🪪 Visitantes (${adentro} dentro)</button>
              <button data-ps="historial" class="ps-t" style="background:${sub==='historial'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📜 Salidas Portón (${sLog.length})</button>
              <button id="ps-alert" style="background:#dc2626;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">🚨 Alerta Dirección</button>
            </div>
          </div>

          ${scanMsg ? `<div style="background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:9px 12px;border-radius:8px;font-size:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;"><span>${scanMsg}</span><button id="ps-clr" style="background:#0f172a;color:#fff;border:none;padding:3px 8px;border-radius:5px;cursor:pointer;">✕</button></div>` : ""}

          ${sub === "pases" ? `
            <div style="background:#070d19;border:1px solid #10b981;border-radius:11px;padding:12px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <b style="color:#34d399;font-size:13.5px;">📷 Escáner de Portón (Valida Carné o Pase de Salida Anticipada QR SHA-256)</b>
                <div style="font-size:11.5px;color:#94a3b8;">Solo permite salida a estudiantes con autorización de Encargado Legal + Aprobación de Dirección/Auxiliar.</div>
              </div>
              <button id="ps-scan" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📷 Escanear Pase QR</button>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${pasesListos.map(p => `
                <div style="background:#070d19;border:1px solid #334155;border-left:4px solid #10b981;border-radius:10px;padding:11px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px;">
                  <div>
                    <span style="background:#059669;color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;">${p.id} • APROBADO</span>
                    <div style="font-weight:800;color:#fff;margin-top:4px;">${p.solicitante} (${p.seccion || p.rol})</div>
                    <div style="color:#38bdf8;font-size:11.5px;">${p.tipo} • ${p.fechaCita} (${p.horaSalida} a ${p.horaRegreso})</div>
                    <div style="color:#94a3b8;font-size:11px;">Autorizado por: ${p.encargadoNombre || "Dirección"} • Resuelto por: ${p.aprobadoPor || "Administración"}</div>
                  </div>
                  <button data-pid="${p.id}" class="ps-out" style="background:#059669;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🚪 Registrar Salida en Portón</button>
                </div>
              `).join("") || `<div style="background:#070d19;padding:16px;border-radius:10px;color:#94a3b8;text-align:center;font-size:12.5px;">No hay pases de salida aprobados pendientes de paso por portón.</div>`}
            </div>
          ` : ""}

          ${sub === "visitantes" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="ps-vf" style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">➕ Registrar Ingreso de Visitante / Vehículo</h3>
                <input id="pv-nom" type="text" required placeholder="Nombre completo del visitante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <input id="pv-ced" type="text" required placeholder="Cédula / DIMEX" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  <input id="pv-plc" type="text" placeholder="Placa vehículo (opcional)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                </div>
                <input id="pv-des" type="text" required placeholder="Destino / Motivo (ej. Dirección, Comedor, Entrega Junta)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✅ Registrar Ingreso + Sello SHA-256</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:11px;padding:13px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
                  <b style="color:#fbbf24;font-size:13.5px;">📋 Bitácora de Visitantes (${vis.length})</b>
                  <button id="ps-vpdf" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ PDF QR</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:7px;max-height:380px;overflow-y:auto;">
                  ${vis.map(v => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${v.horaSalida?'#64748b':'#10b981'};border-radius:8px;padding:9px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                      <div>
                        <b>${v.nombre}</b> (${v.cedula}) ${v.placa ? `• 🚗 ${v.placa}` : ""}
                        <div style="font-size:11px;color:#38bdf8;">${v.destino} • Entrada: ${v.horaEntrada} ${v.horaSalida ? `• Salida: ${v.horaSalida}` : "• EN INSTALACIONES"}</div>
                      </div>
                      ${!v.horaSalida ? `<button data-vid="${v.id}" class="ps-vout" style="background:#b45309;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🚪 Marcar Salida</button>` : `<span style="color:#94a3b8;font-size:10.5px;">✓ Cerrado</span>`}
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${sub === "historial" ? `
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:620px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Fecha / Hora</th><th style="padding:7px;text-align:left;">Pase / Persona</th><th style="padding:7px;text-align:left;">Autorización</th><th style="padding:7px;text-align:left;">Oficial Portón</th><th style="padding:7px;">SHA-256</th></tr>
                ${sLog.map(l => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha} <b>${l.horaSalidaReal}</b></td><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${l.persona}</b> (${l.seccion}) • ${l.permisoId}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.encargado}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${l.oficial}</td><td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#34d399;text-align:center;">${l.hash}</td></tr>`).join("") || `<tr><td colspan="5" style="padding:14px;text-align:center;color:#64748b;">Aún no se han registrado salidas por portón.</td></tr>`}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".ps-t").forEach(b => b.onclick = () => { sub = b.getAttribute("data-ps"); draw(); });
      if (document.getElementById("ps-clr")) document.getElementById("ps-clr").onclick = () => { scanMsg = ""; draw(); };
      document.getElementById("ps-alert").onclick = () => {
        const inc = prompt("Describa la alerta de seguridad para Dirección y Subdirección:", "Ingreso o incidente reportado desde portón principal");
        if (inc && window.BDS_NATIVE) window.BDS_NATIVE.notify("🚨 Alerta de Seguridad (Portón)", `${sesion.nombre}: ${inc}`);
      };

      if (sub === "pases") {
        document.getElementById("ps-scan").onclick = () => {
          if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible.");
          window.BDS_QR_CAMERA.openModal({
            title: "Validar Pase de Salida QR SHA-256",
            onScan: (code) => {
              const res = registrarSalidaPorton(code, sesion.nombre);
              scanMsg = res.msg;
              draw();
            }
          });
        };
        shell.querySelectorAll(".ps-out").forEach(b => b.onclick = () => {
          const res = registrarSalidaPorton(b.getAttribute("data-pid"), sesion.nombre);
          scanMsg = res.msg;
          draw();
        });
      }

      if (sub === "visitantes") {
        document.getElementById("ps-vf").onsubmit = async (e) => {
          e.preventDefault();
          const arr = loadVisitantes();
          const nom = document.getElementById("pv-nom").value.trim(), ced = document.getElementById("pv-ced").value.trim();
          const plc = document.getElementById("pv-plc").value.trim().toUpperCase(), des = document.getElementById("pv-des").value.trim();
          const id = "VIS-" + String(arr.length + 101);
          const hash = sha256Hex ? (await sha256Hex(`${id}|${ced}|${Date.now()}`)).slice(0, 14) : "VISSHA256";
          arr.unshift({ id, fecha: new Date().toISOString().slice(0, 10), nombre: nom, cedula: ced, placa: plc, destino: des, horaEntrada: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), horaSalida: "", registradoPor: sesion.nombre, hash });
          saveVisitantes(arr); draw();
        };
        shell.querySelectorAll(".ps-vout").forEach(b => b.onclick = () => {
          const arr = loadVisitantes(), v = arr.find(x => x.id === b.getAttribute("data-vid"));
          if (v) { v.horaSalida = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }); saveVisitantes(arr); draw(); }
        });
        document.getElementById("ps-vpdf").onclick = async () => {
          const h = sha256Hex ? (await sha256Hex(`BIT-VIS|${Date.now()}`)).slice(0, 16) : "VISPDF";
          imprimirReportePDF("BITÁCORA OFICIAL DE VISITANTES (PORTÓN)", ["ID","Fecha","Visitante","Cédula","Placa","Destino","Entrada","Salida"], loadVisitantes().map(v => [v.id, v.fecha, v.nombre, v.cedula, v.placa||"—", v.destino, v.horaEntrada, v.horaSalida||"Dentro"]), h, generarQRSVG, sesion.nombre);
        };
      }
    }
    draw();
  };

  // ==================== VISTA 2: CONSERJERÍA, ASEO Y MANTENIMIENTO ====================
  window.BDS_RENDER_CONSERJERIA_MANT = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const permitidos = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Conserje / Mantenimiento"];
    if (!sesion || !permitidos.includes(sesion.rol)) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso exclusivo a Conserjería / Mantenimiento y Administración</h3></div>`;
      return;
    }

    let sub = "tickets"; // tickets | checklist

    function draw() {
      const tks = loadTickets();
      const chk = loadChecklist();
      const pend = tks.filter(t => t.estado !== "RESUELTO").length;
      const doneChk = chk.items.filter(x => x.listo).length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">CONSERJERÍA Y MANTENIMIENTO • CONTROL DE INFRAESTRUCTURA Y ASEO • QR SHA-256</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🧹 Gestión de Conserjería, Mantenimiento y Solicitud de Insumos</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-cs="tickets" class="cs-t" style="background:${sub==='tickets'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🛠️ Averías e Insumos (${pend} pend.)</button>
              <button data-cs="checklist" class="cs-t" style="background:${sub==='checklist'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">✅ Aseo Diario (${doneChk}/${chk.items.length})</button>
              <button id="cs-pdf" style="background:#7c3aed;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Informe Junta PDF</button>
            </div>
          </div>

          ${sub === "tickets" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="cs-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">➕ Reportar Avería, Mantenimiento o Insumo de Limpieza</h3>
                <input id="cm-ubi" type="text" required placeholder="Ubicación exacta (ej. Pabellón A, Comedor, Lab 2)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <select id="cm-cat" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                    <option>Eléctrico / Iluminación</option><option>Fontanería / Agua</option><option>Mobiliario / Pupitres</option><option>Solicitud Insumos Aseo</option><option>Seguridad / Portones / Cerraduras</option>
                  </select>
                  <select id="cm-pri" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
                    <option>NORMAL</option><option>MEDIA</option><option>URGENTE</option>
                  </select>
                </div>
                <textarea id="cm-des" rows="2" required placeholder="Detalle del daño, reparación necesaria o insumos requeridos..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📤 Registrar Reporte para Dirección y Junta</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:11px;padding:13px;">
                <h3 style="margin:0 0 9px;font-size:14.5px;color:#34d399;">📋 Reportes de Infraestructura e Insumos (${tks.length})</h3>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;">
                  ${tks.map(t => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${t.estado==='RESUELTO'?'#10b981':(t.prioridad==='URGENTE'?'#ef4444':'#f59e0b')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:5px;flex-wrap:wrap;">
                        <b>${t.id} • ${t.ubicacion}</b>
                        <span style="background:${t.estado==='RESUELTO'?'#059669':(t.estado==='EN_PROCESO'?'#0284c7':'#b45309')};color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;">${t.estado}</span>
                      </div>
                      <div style="color:#38bdf8;font-size:11px;margin:2px 0;">${t.categoria} • Prioridad: <b>${t.prioridad}</b> • ${t.fecha}</div>
                      <div style="color:#cbd5e1;margin-bottom:6px;">${t.descripcion}</div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${t.estado !== "EN_PROCESO" && t.estado !== "RESUELTO" ? `<button data-ts="EN_PROCESO" data-tid="${t.id}" class="cm-st" style="background:#0284c7;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🔧 En Proceso</button>` : ""}
                        ${t.estado !== "RESUELTO" ? `<button data-ts="RESUELTO" data-tid="${t.id}" class="cm-st" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Marcar Resuelto</button>` : `<span style="color:#34d399;font-size:10.5px;">✓ Resuelto por ${t.resueltoPor} (${t.horaCierre})</span>`}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${sub === "checklist" ? `
            <div style="background:#070d19;border:1px solid #10b981;border-radius:11px;padding:13px;">
              <div style="font-size:13px;font-weight:700;color:#34d399;margin-bottom:10px;">✅ Control Diario de Áreas Limpias y Desinfectadas (${chk.fecha})</div>
              <div style="display:flex;flex-direction:column;gap:7px;">
                ${chk.items.map((it, idx) => `
                  <label style="background:#0b1322;border:1px solid ${it.listo?'#10b981':'#334155'};border-radius:9px;padding:10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:12.5px;">
                    <span style="display:flex;align-items:center;gap:9px;"><input type="checkbox" data-ci="${idx}" class="cs-chk" ${it.listo?"checked":""} style="width:18px;height:18px;"/> <b>${it.nom}</b> <small style="color:#94a3b8;">(${it.turno})</small></span>
                    <span style="font-size:11px;color:${it.listo?'#34d399':'#64748b'};">${it.listo ? `✓ Listo ${it.hora}` : "Pendiente"}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".cs-t").forEach(b => b.onclick = () => { sub = b.getAttribute("data-cs"); draw(); });
      document.getElementById("cs-pdf").onclick = async () => {
        const h = sha256Hex ? (await sha256Hex(`MANT|${Date.now()}`)).slice(0, 16) : "MNTSHA256";
        imprimirReportePDF("INFORME DE CONSERJERÍA Y MANTENIMIENTO (JUNTA / DIRECCIÓN)", ["ID","Fecha","Ubicación","Categoría","Prioridad","Descripción","Estado"], loadTickets().map(t => [t.id, t.fecha, t.ubicacion, t.categoria, t.prioridad, t.descripcion, t.estado]), h, generarQRSVG, sesion.nombre);
      };

      if (sub === "tickets") {
        document.getElementById("cs-f").onsubmit = async (e) => {
          e.preventDefault();
          const arr = loadTickets(), id = "MNT-" + String(arr.length + 101);
          const ubi = document.getElementById("cm-ubi").value.trim(), cat = document.getElementById("cm-cat").value;
          const pri = document.getElementById("cm-pri").value, des = document.getElementById("cm-des").value.trim();
          const hash = sha256Hex ? (await sha256Hex(`${id}|${ubi}|${Date.now()}`)).slice(0, 14) : "MNTSHA";
          arr.unshift({ id, fecha: new Date().toISOString().slice(0, 10), ubicacion: ubi, categoria: cat, prioridad: pri, descripcion: des, estado: "PENDIENTE", reportadoPor: sesion.nombre, resueltoPor: "", horaCierre: "", hash });
          saveTickets(arr);
          if (pri === "URGENTE" && window.BDS_NATIVE) window.BDS_NATIVE.notify("🛠️ Reporte Urgente de Mantenimiento", `${ubi}: ${des}`);
          draw();
        };
        shell.querySelectorAll(".cm-st").forEach(b => b.onclick = () => {
          const arr = loadTickets(), t = arr.find(x => x.id === b.getAttribute("data-tid"));
          if (t) {
            t.estado = b.getAttribute("data-ts");
            if (t.estado === "RESUELTO") { t.resueltoPor = sesion.nombre; t.horaCierre = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }); }
            saveTickets(arr); draw();
          }
        });
      }

      if (sub === "checklist") {
        shell.querySelectorAll(".cs-chk").forEach(c => c.onchange = () => {
          const ch = loadChecklist(), i = Number(c.getAttribute("data-ci"));
          ch.items[i].listo = c.checked;
          ch.items[i].hora = c.checked ? new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }) : "";
          saveChecklist(ch); draw();
        });
      }
    }
    draw();
  };
})();