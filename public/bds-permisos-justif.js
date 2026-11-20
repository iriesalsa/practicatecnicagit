(function () {
  const PERM_KEY = "bds_permisos_edus_v193";
  const JUST_KEY = "bds_justificaciones_comp_v193";
  const DIAS_ROLES_DIR = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección"];
  const ROLES_EST_ADMIN = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Docente MEP"];

  function loadPerm() {
    try { const d = JSON.parse(localStorage.getItem(PERM_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "PRM-2026-101", categoria: "PERSONAL", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", destinatario: "Dirección / Subdirección", tipo: "Cita Médica / EDUS", fechaCita: "2026-11-24", horaSalida: "08:00", horaRegreso: "11:00", motivo: "Cita de control CCSS Heredia (screenshot EDUS adjunto).", adjuntoNombre: "screenshot-edus-cita.png", adjuntoData: "", estado: "PENDIENTE", aprobadoPor: "", hash: "PRM2026A0B18F2C9" },
      { id: "PRM-2026-102", categoria: "PERSONAL", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: "Prof. Mariela Campos", email: "mariela.campos@mep.go.cr", rol: "Docente MEP", destinatario: "Dirección / Subdirección", tipo: "Citación Judicial / Oficial", fechaCita: "2026-11-26", horaSalida: "09:00", horaRegreso: "12:00", motivo: "Citación oficial Poder Judicial (PDF adjunto).", adjuntoNombre: "citacion-judicial-2026.pdf", adjuntoData: "", estado: "APROBADO", aprobadoPor: "Directora Laura Ramón Elizondo", hash: "PRM2026C4E91D002" },
      { id: "SAL-2026-201", categoria: "ESTUDIANTE", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", rol: "Estudiante", destinatario: "Auxiliares y Dirección", tipo: "Salida Anticipada (Cita Médica)", fechaCita: "2026-11-25", horaSalida: "10:10", horaRegreso: "16:20", motivo: "Salida anticipada por cita odontológica CCSS con comprobante.", adjuntoNombre: "cita-odontologia-sofia.png", adjuntoData: "", autorizadoEncargado: true, encargadoNombre: "Ana Rojas Vega", fechaAutorizacionEnc: "2026-11-20 08:30", estado: "PENDIENTE", aprobadoPor: "", hash: "SAL2026E7B40912F" }
    ];
    localStorage.setItem(PERM_KEY, JSON.stringify(seed));
    return seed;
  }
  function savePerm(a) { localStorage.setItem(PERM_KEY, JSON.stringify(a)); }

  function loadJust() {
    try { const d = JSON.parse(localStorage.getItem(JUST_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "JST-2026-101", fechaCreacion: new Date().toLocaleDateString("es-CR"), persona: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", enviadoPor: "familia.alvarado@gmail.com", seccion: "11-1", destinatario: "Auxiliares, Docentes y Dirección", tipoJust: "Enfermedad / Incapacidad", permisoRef: "SAL-2026-201", fechaAusencia: "2026-11-19", horaInicio: "07:30", horaFin: "10:15", motivo: "Comprobante oficial de asistencia médica CCSS con hora sellada.", adjuntoNombre: "comprobante-asistencia-ccss.pdf", adjuntoData: "", autorizadoEncargado: true, estado: "PENDIENTE", revisadoPor: "", hash: "JST2026F3C90E1A4" }
    ];
    localStorage.setItem(JUST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveJust(a) { localStorage.setItem(JUST_KEY, JSON.stringify(a)); }

  function readFileUniversal(file) {
    return new Promise((resolve) => {
      if (!file) return resolve({ name: "", data: "" });
      const reader = new FileReader();
      reader.onload = (ev) => {
        const raw = ev.target.result || "";
        if (file.type.startsWith("image/") && file.size > 380000) {
          const img = new Image();
          img.onload = () => {
            const sc = Math.min(1, 980 / Math.max(img.width, img.height, 1));
            const cv = document.createElement("canvas");
            cv.width = Math.max(1, Math.round(img.width * sc));
            cv.height = Math.max(1, Math.round(img.height * sc));
            cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
            resolve({ name: file.name || `screenshot-${Date.now()}.jpg`, data: cv.toDataURL("image/jpeg", 0.8) });
          };
          img.onerror = () => resolve({ name: file.name || "captura.png", data: raw.slice(0, 750000) });
          img.src = raw;
        } else {
          resolve({ name: file.name || `comprobante-${Date.now()}`, data: file.size <= 950000 ? raw : "" });
        }
      };
      reader.onerror = () => resolve({ name: file.name || "", data: "" });
      reader.readAsDataURL(file);
    });
  }

  function verAdjuntoModal(nombre, dataUrl) {
    const old = document.getElementById("bds-att-modal"); if (old) old.remove();
    const m = document.createElement("div");
    m.id = "bds-att-modal";
    m.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:299200;display:flex;align-items:center;justify-content:center;padding:14px;";
    const esImg = dataUrl && dataUrl.startsWith("data:image/");
    const esPdf = dataUrl && dataUrl.startsWith("data:application/pdf");
    m.innerHTML = `
      <div class="bds-card" style="max-width:700px;width:100%;max-height:90vh;overflow-y:auto;padding:16px;border-color:#38bdf8;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;">
          <b style="color:#38bdf8;font-size:13.5px;">📎 Comprobante: ${nombre || "Archivo"}</b>
          <button id="att-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;">✕</button>
        </div>
        ${esImg ? `<img src="${dataUrl}" style="max-width:100%;border-radius:8px;display:block;margin:0 auto 10px;"/>` : ""}
        ${esPdf ? `<iframe src="${dataUrl}" style="width:100%;height:430px;border:1px solid #334155;border-radius:8px;margin-bottom:10px;"></iframe>` : ""}
        ${dataUrl ? `<a href="${dataUrl}" download="${nombre || 'comprobante'}" style="display:inline-block;background:#059669;color:#fff;padding:8px 14px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;">📥 Descargar ${nombre}</a>` : `<p style="color:#94a3b8;font-size:12.5px;">Archivo registrado: <b>${nombre}</b> (use <b>🔄 Cambiar</b> para cargar o pegar con Ctrl+V).</p>`}
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById("att-x").onclick = () => m.remove();
  }

  function imprimirBoletaQR(titulo, filas, hash, generarQRSVG) {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=206" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=206" };
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el comprobante QR.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${titulo}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse}td{border:1px solid #cbd5e1;padding:7px}.qr{margin-top:16px;display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${inst.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0;font-size:15.5px">${inst.nombre}</h2><div>📍 ${inst.provincia || "Heredia"} • ${inst.regional} • ${inst.circuito} • Cód. ${inst.codigoPresup || "—"}</div><h3 style="margin:4px 0 0;color:#0f766e">${titulo}</h3></div><img src="${b.logoMep}" style="height:42px"/></div><table>${filas.map(([k, v]) => `<tr><td style="width:32%;background:#f8fafc"><b>${k}</b></td><td>${v}</td></tr>`).join("")}</table><div class="qr">${generarQRSVG ? generarQRSVG("PT-TRAMITE|" + hash, 90) : ""}<div><b>Documento Oficial Verificable QR SHA-256</b><br/><code>${hash}</code><br/><small>Validación institucional • Dirección: Laura Ramón Elizondo.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  // Aprobación rápida en lote para reducir tiempos administrativos (solo los que cumplen comprobante / visto bueno)
  function aprobarLotePermisos(categoria, aprobadorNombre) {
    const arr = loadPerm();
    let count = 0;
    arr.forEach(p => {
      const cat = p.categoria || (p.rol === "Estudiante" ? "ESTUDIANTE" : "PERSONAL");
      if (p.estado === "PENDIENTE" && cat === categoria && Boolean(p.adjuntoNombre)) {
        if (cat === "ESTUDIANTE" && !p.autorizadoEncargado) return;
        p.estado = "APROBADO";
        p.aprobadoPor = aprobadorNombre + " (Lote Rápido)";
        count++;
      }
    });
    if (count > 0) savePerm(arr);
    return count;
  }

  window.BDS_PERMISOS_API = { loadPerm, savePerm, loadJust, saveJust, readFileUniversal, verAdjuntoModal, imprimirBoletaQR, aprobarLotePermisos };

  window.BDS_RENDER_PERMISOS_JUSTIF = function (shell, tabInicial, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const esDireccion = DIAS_ROLES_DIR.includes(sesion.rol);
    const esAuxOEstAdmin = ROLES_EST_ADMIN.includes(sesion.rol);
    let tab = tabInicial || "permisos";
    let bandeja = esDireccion ? "PERSONAL" : "ESTUDIANTE"; // PERSONAL (Dirección) | ESTUDIANTE (Auxiliares/Dirección)
    let estadoFiltro = "TODOS";
    let permAdj = { name: "", data: "" };
    let justAdj = { name: "", data: "" };

    if (window.__BDS_PASTE_LISTENER) window.removeEventListener("paste", window.__BDS_PASTE_LISTENER);
    window.__BDS_PASTE_LISTENER = async (ev) => {
      if (!document.body.contains(shell)) return;
      const items = (ev.clipboardData && ev.clipboardData.items) || [];
      for (const it of items) {
        if (it.type && it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) {
            const loaded = await readFileUniversal(f);
            loaded.name = `screenshot-${new Date().toTimeString().slice(0, 8).replace(/:/g, "")}.png`;
            if (tab === "permisos") permAdj = loaded;
            else if (tab === "justificaciones") justAdj = loaded;
            if (window.BDS_NATIVE) window.BDS_NATIVE.showInAppToast("📋 Screenshot pegado", `${loaded.name} listo para enviar.`);
            draw();
            break;
          }
        }
      }
    };
    window.addEventListener("paste", window.__BDS_PASTE_LISTENER);

    function getBrand() {
      return window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", escudo: "/escudo-ctpmn-oficial.jpeg?v=206", mascota: "/buho-oficial.png?v=206" };
    }

    function draw() {
      const perms = loadPerm();
      const justs = loadJust();
      const b = getBrand();
      const mail = (sesion.email || "").toLowerCase();

      const catOf = (p) => p.categoria || (p.rol === "Estudiante" ? "ESTUDIANTE" : "PERSONAL");
      const resueltosHoy = perms.filter(p => p.estado !== "PENDIENTE").length + justs.filter(j => j.estado !== "PENDIENTE").length;
      const minutosAhorrados = resueltosHoy * 8;

      const permsVis = perms.filter(p => {
        const c = catOf(p);
        if (esDireccion) return c === bandeja && (estadoFiltro === "TODOS" || p.estado === estadoFiltro);
        if (sesion.rol === "Auxiliar Administrativo") return c === "ESTUDIANTE" && (estadoFiltro === "TODOS" || p.estado === estadoFiltro);
        return (p.email || "").toLowerCase() === mail && (estadoFiltro === "TODOS" || p.estado === estadoFiltro);
      });

      const justsVis = (esAuxOEstAdmin ? justs : justs.filter(j => (j.email || "").toLowerCase() === mail || (j.enviadoPor || "").toLowerCase() === mail))
        .filter(j => estadoFiltro === "TODOS" || j.estado === estadoFiltro);

      const pendPer = perms.filter(p => p.estado === "PENDIENTE" && catOf(p) === "PERSONAL").length;
      const pendEst = perms.filter(p => p.estado === "PENDIENTE" && catOf(p) === "ESTUDIANTE").length;
      const pendJ = justs.filter(j => j.estado === "PENDIENTE").length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">FLUJO ÁGIL DIRECCIÓN / AUXILIARES • ~${minutosAhorrados} MIN AHORRADOS • QR SHA-256</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">📋 Gestión Ágil de Permisos, Salidas Anticipadas y Justificaciones</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-pj="permisos" class="pj-tab" style="background:${tab==='permisos'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📝 Gestionar Permisos${(pendPer+pendEst) ? ` (${pendPer+pendEst})` : ""}</button>
              <button data-pj="justificaciones" class="pj-tab" style="background:${tab==='justificaciones'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🎓 Gestionar Justificaciones${pendJ ? ` (${pendJ})` : ""}</button>
              <button data-pj="qr" class="pj-tab" style="background:${tab==='qr'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🪪 Carné QR</button>
              ${(esDireccion || sesion.rol === "Auxiliar Administrativo") && tab !== "qr" ? `<button id="pj-csv" style="background:#059669;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📥 CSV</button>` : ""}
            </div>
          </div>

          ${tab === "permisos" && (esDireccion || sesion.rol === "Auxiliar Administrativo") ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;background:#070d19;border:1px solid #1e3a8a;border-radius:10px;padding:9px 11px;margin-bottom:11px;">
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${esDireccion ? `<button data-bd="PERSONAL" class="pj-bd" style="background:${bandeja==='PERSONAL'?'#b45309':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🏛️ Permisos de Personal — Dirección (${pendPer})</button>` : ""}
                <button data-bd="ESTUDIANTE" class="pj-bd" style="background:${bandeja==='ESTUDIANTE'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🎒 Salidas y Permisos Estudiantes — Auxiliares (${pendEst})</button>
              </div>
              <button id="pj-lote" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">⚡ Aprobar en Lote (Con Comprobante)</button>
            </div>
          ` : ""}

          ${tab !== "qr" ? `
            <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-bottom:11px;">
              <span style="font-size:11px;color:#94a3b8;">Estado:</span>
              ${(tab === "permisos" ? ["TODOS","PENDIENTE","APROBADO","RECHAZADO"] : ["TODOS","PENDIENTE","VALIDADA","RECHAZADA"]).map(ef => `<button data-ef="${ef}" class="pj-ef" style="background:${estadoFiltro===ef?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:4px 9px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;">${ef}</button>`).join("")}
            </div>
          ` : ""}

          ${tab === "permisos" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="pr-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">📝 Nueva Solicitud (${sesion.rol === "Estudiante" ? "Salida Anticipada / Enfermedad" : "Permiso de Personal / Cita"})</h3>
                <p style="margin:0;font-size:11px;color:#94a3b8;">Soporta <b>foto, PDF o pegar screenshot con Ctrl+V</b> (EDUS, judicial, enfermedad o comprobante oficial).</p>
                <select id="pr-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                  ${sesion.rol === "Estudiante"
                    ? "<option>Salida Anticipada (Cita Médica)</option><option>Salida Anticipada (Enfermedad)</option><option>Salida Anticipada (Asunto Familiar)</option><option>Permiso Representación / Gira</option>"
                    : "<option>Cita Médica / EDUS</option><option>Citación Judicial / Oficial</option><option>Permiso Personal con Goce / Sin Goce</option><option>Capacitación / Gira MEP</option><option>Otro Comprobante Oficial</option>"}
                </select>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                  <div><label style="font-size:10px;color:#94a3b8;">Fecha:</label><input id="pr-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                  <div><label style="font-size:10px;color:#94a3b8;">De (Hora):</label><input id="pr-h1" type="time" required value="08:00" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                  <div><label style="font-size:10px;color:#94a3b8;">Hasta:</label><input id="pr-h2" type="time" required value="11:00" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                </div>
                <textarea id="pr-mot" rows="2" required placeholder="Detalle del permiso, cita o salida anticipada..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                <div style="display:flex;gap:6px;align-items:center;">
                  <label style="flex:1;background:#131f33;border:1px dashed #38bdf8;color:#93c5fd;padding:9px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;">
                    📎 ${permAdj.name ? `Listo: ${permAdj.name}` : "Subir Foto / PDF o Pegar Screenshot (Ctrl+V)"}
                    <input id="pr-file" type="file" accept="image/*,.pdf" style="display:none;"/>
                  </label>
                  ${permAdj.name ? `<button type="button" id="pr-clr" style="background:#7f1d1d;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-size:11px;cursor:pointer;">🗑️</button>` : ""}
                </div>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📤 Enviar Solicitud con QR SHA-256</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 9px;font-size:14.5px;color:#fbbf24;">${bandeja==='PERSONAL' && esDireccion ? "🏛️ Bandeja Dirección — Permisos de Personal" : "🎒 Bandeja Salidas y Permisos Estudiantiles"} (${permsVis.length})</h3>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:430px;overflow-y:auto;">
                  ${permsVis.map(p => {
                    const esEst = catOf(p) === "ESTUDIANTE";
                    const puedeResolver = (esEst && (esDireccion || sesion.rol === "Auxiliar Administrativo")) || (!esEst && esDireccion);
                    return `<div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${p.estado==='APROBADO'?'#10b981':(p.estado==='RECHAZADO'?'#ef4444':'#f59e0b')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:5px;flex-wrap:wrap;">
                        <b>${p.solicitante} (${p.seccion || p.rol})</b>
                        <span style="background:${p.estado==='APROBADO'?'#059669':(p.estado==='RECHAZADO'?'#dc2626':'#b45309')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">${p.estado}</span>
                      </div>
                      <div style="color:#38bdf8;font-weight:600;margin:3px 0;">${p.tipo} • ${p.fechaCita} (${p.horaSalida} a ${p.horaRegreso})</div>
                      ${esEst ? `<div style="font-size:11px;margin-bottom:4px;color:${p.autorizadoEncargado?'#34d399':'#fbbf24'};">${p.autorizadoEncargado ? `✅ Autorizado por Encargado Legal: ${p.encargadoNombre || "Familia"} (${p.fechaAutorizacionEnc || ""})` : "⏳ Pendiente visto bueno de Padre / Madre / Encargado Legal"}</div>` : ""}
                      <div style="color:#cbd5e1;margin-bottom:6px;">${p.motivo}</div>
                      <div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;">
                        ${p.adjuntoNombre ? `<button data-pvn="${p.id}" class="pr-ver" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">👁️ Ver (${p.adjuntoNombre.slice(0,16)})</button>` : `<span style="font-size:11px;color:#64748b;">Sin adjunto</span>`}
                        <label style="background:#1e3a8a;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🔄 ${p.adjuntoNombre?"Cambiar":"Subir"}<input data-prep="${p.id}" class="pr-rep" type="file" accept="image/*,.pdf" style="display:none;"/></label>
                        <button data-pqr="${p.id}" class="pr-qr" style="background:#0f766e;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🖨️ ${esEst?"Pase Portón QR":"Boleta QR"}</button>
                        ${puedeResolver ? `<button data-pa="${p.id}" class="pr-ok" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Aprobar 1-Clic</button><button data-pr="${p.id}" class="pr-no" style="background:#dc2626;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">✕</button>` : ""}
                      </div>
                    </div>`;
                  }).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin solicitudes en esta bandeja.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "justificaciones" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="ju-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#34d399;">🎓 Justificar Ausencia / Tardía / Enfermedad</h3>
                <p style="margin:0;font-size:11px;color:#94a3b8;">Indique <b>de qué hora a qué hora</b> comprobó asistencia y adjunte <b>foto, PDF o screenshot (Ctrl+V)</b>.</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <input id="ju-per" type="text" required value="${sesion.nombre}" placeholder="Nombre estudiante / persona" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  <input id="ju-sec" type="text" required value="${sesion.seccion || sesion.rol}" placeholder="Sección o puesto" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                </div>
                <select id="ju-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                  <option>Comprobante de Asistencia / Cita</option><option>Enfermedad / Incapacidad</option><option>Justificación de Tardía</option><option>Comprobante Judicial / Oficial</option>
                </select>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                  <div><label style="font-size:10px;color:#94a3b8;">Fecha:</label><input id="ju-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                  <div><label style="font-size:10px;color:#94a3b8;">De (Hora):</label><input id="ju-h1" type="time" required value="08:00" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                  <div><label style="font-size:10px;color:#94a3b8;">Hasta:</label><input id="ju-h2" type="time" required value="10:30" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/></div>
                </div>
                <textarea id="ju-mot" rows="2" required placeholder="Detalle del comprobante de asistencia o tardía..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                <div style="display:flex;gap:6px;align-items:center;">
                  <label style="flex:1;background:#131f33;border:1px dashed #10b981;color:#6ee7b7;padding:9px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;">
                    📎 ${justAdj.name ? `Comprobante: ${justAdj.name}` : "Subir Foto / PDF o Pegar Screenshot (Ctrl+V)"}
                    <input id="ju-file" type="file" accept="image/*,.pdf" style="display:none;"/>
                  </label>
                  ${justAdj.name ? `<button type="button" id="ju-clr" style="background:#7f1d1d;color:#fff;border:none;padding:9px 10px;border-radius:8px;font-size:11px;cursor:pointer;">🗑️</button>` : ""}
                </div>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✅ Enviar Justificación con QR SHA-256</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 9px;font-size:14.5px;color:#34d399;">📄 Justificaciones y Comprobantes (${justsVis.length})</h3>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:430px;overflow-y:auto;">
                  ${justsVis.map(j => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${j.estado==='VALIDADA'?'#10b981':(j.estado==='RECHAZADA'?'#ef4444':'#f59e0b')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:5px;flex-wrap:wrap;">
                        <b>${j.persona} (${j.seccion})</b>
                        <span style="background:${j.estado==='VALIDADA'?'#059669':(j.estado==='RECHAZADA'?'#dc2626':'#b45309')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">${j.estado}</span>
                      </div>
                      <div style="color:#34d399;font-weight:600;margin:3px 0;">${j.tipoJust || "Justificación"} • ${j.fechaAusencia} (${j.horaInicio} a ${j.horaFin})</div>
                      <div style="color:#cbd5e1;margin-bottom:6px;">${j.motivo}</div>
                      <div style="display:flex;flex-wrap:wrap;gap:5px;align-items:center;">
                        ${j.adjuntoNombre ? `<button data-jvn="${j.id}" class="ju-ver" style="background:#131f33;color:#34d399;border:1px solid #334155;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">👁️ Ver (${j.adjuntoNombre.slice(0,16)})</button>` : `<span style="font-size:11px;color:#f87171;">Sin archivo</span>`}
                        <label style="background:#1e3a8a;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🔄 ${j.adjuntoNombre?"Cambiar":"Subir"}<input data-jrep="${j.id}" class="ju-rep" type="file" accept="image/*,.pdf" style="display:none;"/></label>
                        <button data-jqr="${j.id}" class="ju-qr" style="background:#0f766e;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🖨️ QR</button>
                        ${esAuxOEstAdmin ? `<button data-ja="${j.id}" class="ju-ok" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Validar 1-Clic</button><button data-jr="${j.id}" class="ju-no" style="background:#dc2626;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">✕</button>` : ""}
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin justificaciones en este filtro.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "qr" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px;align-items:start;">
              <div style="background:linear-gradient(135deg,#0f2247 0%,#0b1322 100%);border:2px solid #38bdf8;border-radius:16px;padding:18px;text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <img src="${b.escudo}" style="height:42px;background:#fff;padding:2px;border-radius:7px;"/>
                  <img src="${b.mascota}" style="height:42px;width:42px;border-radius:50%;object-fit:contain;"/>
                </div>
                <div style="font-size:10.5px;color:#38bdf8;font-weight:700;">${b.institucion.toUpperCase()}</div>
                <h3 style="margin:4px 0 2px;color:#fff;font-size:16px;">${sesion.nombre}</h3>
                <div style="font-size:11.5px;color:#93c5fd;margin-bottom:10px;">${sesion.rol} • ID: ${sesion.userId || "PT-ID"} • ${sesion.seccion || "Institucional"}</div>
                <div style="display:inline-block;margin-bottom:8px;">${generarQRSVG(sesion.qr || ("PT-QR|" + sesion.email), 174)}</div>
                <div style="font-size:10px;font-family:monospace;color:#6ee7b7;background:#070d19;padding:5px 8px;border-radius:6px;word-break:break-all;">${sesion.qr || sesion.firma}</div>
              </div>
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">📷 Verificador Oficial QR SHA-256</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Escanea Carnés, Pases de Portón de Salida Anticipada, Horarios y Boletas.</p>
                <button id="pj-scan" style="width:100%;background:#059669;color:#fff;border:none;padding:11px;border-radius:9px;font-size:12.5px;font-weight:700;cursor:pointer;margin-bottom:10px;">📷 Abrir Cámara Nativa QR</button>
                <div id="pj-scan-res" style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:12px;font-size:12px;color:#cbd5e1;">Listo para escanear códigos QR SHA-256.</div>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".pj-tab").forEach(bt => bt.onclick = () => { tab = bt.getAttribute("data-pj"); estadoFiltro = "TODOS"; draw(); });
      shell.querySelectorAll(".pj-ef").forEach(bt => bt.onclick = () => { estadoFiltro = bt.getAttribute("data-ef"); draw(); });
      shell.querySelectorAll(".pj-bd").forEach(bt => bt.onclick = () => { bandeja = bt.getAttribute("data-bd"); draw(); });

      if (document.getElementById("pj-lote")) document.getElementById("pj-lote").onclick = () => {
        const n = aprobarLotePermisos(bandeja, sesion.nombre);
        alert(n > 0 ? `⚡ ¡Listo! Se aprobaron ${n} solicitud(es) de ${bandeja} con comprobante válido (ahorro estimado: ~${n * 8} minutos).` : "No hay solicitudes pendientes listas para aprobación en lote (requieren comprobante y, si es estudiante, visto bueno del encargado legal).");
        draw();
      };

      if (document.getElementById("pj-csv")) document.getElementById("pj-csv").onclick = () => {
        const rows = tab === "permisos"
          ? [["ID","BANDEJA","FECHA","SOLICITANTE","ROL","TIPO","HORARIO","ADJUNTO","AUTORIZADO_FAMILIA","ESTADO","SHA256"], ...permsVis.map(p => [p.id, catOf(p), p.fechaCita, p.solicitante, p.rol, p.tipo, `${p.horaSalida}-${p.horaRegreso}`, p.adjuntoNombre||"", p.autorizadoEncargado?"SI":"NO", p.estado, p.hash])]
          : [["ID","FECHA","PERSONA","SECCION","TIPO","HORARIO","ADJUNTO","ESTADO","SHA256"], ...justsVis.map(j => [j.id, j.fechaAusencia, j.persona, j.seccion, j.tipoJust||"", `${j.horaInicio}-${j.horaFin}`, j.adjuntoNombre||"", j.estado, j.hash])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `gestion-${tab}-2026.csv`; a.click();
      };

      if (tab === "permisos") {
        document.getElementById("pr-file").onchange = async (e) => { permAdj = await readFileUniversal(e.target.files[0]); draw(); };
        if (document.getElementById("pr-clr")) document.getElementById("pr-clr").onclick = () => { permAdj = { name: "", data: "" }; draw(); };
        document.getElementById("pr-f").onsubmit = async (e) => {
          e.preventDefault();
          const esEst = sesion.rol === "Estudiante";
          const tipo = document.getElementById("pr-tip").value;
          const fec = document.getElementById("pr-fec").value, h1 = document.getElementById("pr-h1").value, h2 = document.getElementById("pr-h2").value;
          const mot = document.getElementById("pr-mot").value.trim();
          const arr = loadPerm(), id = (esEst ? "SAL-2026-" : "PRM-2026-") + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${sesion.email}|${fec}|${h1}|${h2}`)).slice(0, 16);
          arr.unshift({ id, categoria: esEst ? "ESTUDIANTE" : "PERSONAL", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: sesion.nombre, email: sesion.email, seccion: sesion.seccion || "", rol: sesion.rol, destinatario: esEst ? "Auxiliares y Dirección" : "Dirección / Subdirección", tipo, fechaCita: fec, horaSalida: h1, horaRegreso: h2, motivo: mot, adjuntoNombre: permAdj.name, adjuntoData: permAdj.data, autorizadoEncargado: false, estado: "PENDIENTE", aprobadoPor: "", hash });
          savePerm(arr); permAdj = { name: "", data: "" };
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(esEst ? "🎒 Solicitud de Salida Anticipada" : "📝 Nuevo Permiso de Personal", `${sesion.nombre} (${tipo} • ${fec}).`);
          draw();
        };
        shell.querySelectorAll(".pr-ver").forEach(bt => bt.onclick = () => { const p = loadPerm().find(x => x.id === bt.getAttribute("data-pvn")); if (p) verAdjuntoModal(p.adjuntoNombre, p.adjuntoData); });
        shell.querySelectorAll(".pr-rep").forEach(inp => inp.onchange = async (e) => {
          const f = await readFileUniversal(e.target.files[0]); if (!f.name) return;
          const arr = loadPerm(), p = arr.find(x => x.id === inp.getAttribute("data-prep"));
          if (p) { p.adjuntoNombre = f.name; p.adjuntoData = f.data; savePerm(arr); draw(); }
        });
        shell.querySelectorAll(".pr-qr").forEach(bt => bt.onclick = () => {
          const p = loadPerm().find(x => x.id === bt.getAttribute("data-pqr"));
          if (p) imprimirBoletaQR(catOf(p) === "ESTUDIANTE" ? "PASE OFICIAL DE SALIDA ANTICIPADA (PORTÓN)" : "RESOLUCIÓN DE PERMISO DE PERSONAL", [["Consecutivo", p.id],["Persona", `${p.solicitante} (${p.seccion || p.rol})`],["Tipo", p.tipo],["Fecha y Horario", `${p.fechaCita} (${p.horaSalida} a ${p.horaRegreso})`],["Visto Bueno Familia", catOf(p) === "ESTUDIANTE" ? (p.autorizadoEncargado ? `✅ ${p.encargadoNombre || "Encargado Legal"}` : "⏳ Pendiente") : "N/A (Personal)"],["Estado Administrativo", `${p.estado}${p.aprobadoPor ? " por " + p.aprobadoPor : ""}`],["Comprobante", p.adjuntoNombre || "Ninguno"],["Motivo", p.motivo]], p.hash, generarQRSVG);
        });
        shell.querySelectorAll(".pr-ok").forEach(bt => bt.onclick = () => { const arr = loadPerm(), p = arr.find(x => x.id === bt.getAttribute("data-pa")); if (p) { p.estado = "APROBADO"; p.aprobadoPor = `${sesion.nombre} (${sesion.rol})`; savePerm(arr); draw(); } });
        shell.querySelectorAll(".pr-no").forEach(bt => bt.onclick = () => { const arr = loadPerm(), p = arr.find(x => x.id === bt.getAttribute("data-pr")); if (p) { p.estado = "RECHAZADO"; p.aprobadoPor = `${sesion.nombre} (${sesion.rol})`; savePerm(arr); draw(); } });
      }

      if (tab === "justificaciones") {
        document.getElementById("ju-file").onchange = async (e) => { justAdj = await readFileUniversal(e.target.files[0]); draw(); };
        if (document.getElementById("ju-clr")) document.getElementById("ju-clr").onclick = () => { justAdj = { name: "", data: "" }; draw(); };
        document.getElementById("ju-f").onsubmit = async (e) => {
          e.preventDefault();
          const per = document.getElementById("ju-per").value.trim(), sec = document.getElementById("ju-sec").value.trim();
          const tipoJust = document.getElementById("ju-tip").value;
          const fec = document.getElementById("ju-fec").value, h1 = document.getElementById("ju-h1").value, h2 = document.getElementById("ju-h2").value;
          const mot = document.getElementById("ju-mot").value.trim();
          const arr = loadJust(), id = "JST-2026-" + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${per}|${fec}|${h1}|${h2}|${justAdj.name}`)).slice(0, 16);
          arr.unshift({ id, fechaCreacion: new Date().toLocaleDateString("es-CR"), persona: per, email: sesion.email, enviadoPor: sesion.email, seccion: sec, destinatario: "Auxiliares, Docentes y Dirección", tipoJust, permisoRef: "Directo", fechaAusencia: fec, horaInicio: h1, horaFin: h2, motivo: mot, adjuntoNombre: justAdj.name, adjuntoData: justAdj.data, estado: "PENDIENTE", revisadoPor: "", hash });
          saveJust(arr); justAdj = { name: "", data: "" };
          draw();
        };
        shell.querySelectorAll(".ju-ver").forEach(bt => bt.onclick = () => { const j = loadJust().find(x => x.id === bt.getAttribute("data-jvn")); if (j) verAdjuntoModal(j.adjuntoNombre, j.adjuntoData); });
        shell.querySelectorAll(".ju-rep").forEach(inp => inp.onchange = async (e) => {
          const f = await readFileUniversal(e.target.files[0]); if (!f.name) return;
          const arr = loadJust(), j = arr.find(x => x.id === inp.getAttribute("data-jrep"));
          if (j) { j.adjuntoNombre = f.name; j.adjuntoData = f.data; saveJust(arr); draw(); }
        });
        shell.querySelectorAll(".ju-qr").forEach(bt => bt.onclick = () => {
          const j = loadJust().find(x => x.id === bt.getAttribute("data-jqr"));
          if (j) imprimirBoletaQR("JUSTIFICACIÓN OFICIAL CON COMPROBANTE", [["Consecutivo", j.id],["Persona / Estudiante", `${j.persona} (${j.seccion})`],["Tipo", j.tipoJust],["Fecha y Horario Comprobado", `${j.fechaAusencia} (${j.horaInicio} a ${j.horaFin})`],["Estado", j.estado],["Comprobante", j.adjuntoNombre || "Ninguno"],["Detalle", j.motivo]], j.hash, generarQRSVG);
        });
        shell.querySelectorAll(".ju-ok").forEach(bt => bt.onclick = () => { const arr = loadJust(), j = arr.find(x => x.id === bt.getAttribute("data-ja")); if (j) { j.estado = "VALIDADA"; j.revisadoPor = `${sesion.nombre} (${sesion.rol})`; saveJust(arr); draw(); } });
        shell.querySelectorAll(".ju-no").forEach(bt => bt.onclick = () => { const arr = loadJust(), j = arr.find(x => x.id === bt.getAttribute("data-jr")); if (j) { j.estado = "RECHAZADA"; j.revisadoPor = `${sesion.nombre} (${sesion.rol})`; saveJust(arr); draw(); } });
      }

      if (tab === "qr") {
        document.getElementById("pj-scan").onclick = () => {
          if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible.");
          window.BDS_QR_CAMERA.openModal({
            title: "Verificador Oficial QR SHA-256",
            onScan: (code) => {
              const out = document.getElementById("pj-scan-res");
              if (out) out.innerHTML = `<b style="color:#34d399;">✅ Código QR Verificado:</b><div style="font-family:monospace;margin-top:4px;word-break:break-all;color:#fff;">${code}</div>`;
            }
          });
        };
      }
    }
    draw();
  };
})();