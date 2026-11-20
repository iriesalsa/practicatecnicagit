(function () {
  const AULAS_KEY = "bds_llaves_aulas_v212";
  const LOG_KEY = "bds_llaves_bitacora_v212";

  function loadAulas() {
    try { const d = JSON.parse(localStorage.getItem(AULAS_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "AULA-13", nombre: "Aula 13 (Lab Desarrollo Web / Ciberseguridad)", pabellon: "Pabellón Técnico", responsable: "Ing. Max Salazar Sánchez", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "LAB-WEB1", nombre: "Laboratorio Web 1", pabellon: "Pabellón Técnico", responsable: "Coordinación TI", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "LAB-CIB1", nombre: "Laboratorio Ciberseguridad 1", pabellon: "Pabellón Técnico", responsable: "Coordinación TI", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "LAB-CIE", nombre: "Laboratorio de Ciencias", pabellon: "Pabellón Académico", responsable: "Depto. Ciencias", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "AULA-101", nombre: "Aula 101", pabellon: "Pabellón A", responsable: "Académica", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "AULA-102", nombre: "Aula 102", pabellon: "Pabellón A", responsable: "Académica", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" },
      { id: "GIMNASIO", nombre: "Gimnasio / Bodega Deportes", pabellon: "Área Deportiva", responsable: "Ed. Física", prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" }
    ];
    localStorage.setItem(AULAS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveAulas(a) { localStorage.setItem(AULAS_KEY, JSON.stringify(a)); }

  function loadLog() { try { const d = JSON.parse(localStorage.getItem(LOG_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function saveLog(a) { localStorage.setItem(LOG_KEY, JSON.stringify(a.slice(0, 400))); }

  async function registrarMovimientoLlave(aulaId, docenteNombre, docenteEmail, notaEstado, sha256Hex) {
    const aulas = loadAulas();
    const aula = aulas.find(x => x.id === aulaId);
    if (!aula) return { ok: false, msg: "Aula o laboratorio no encontrado." };
    const hoy = new Date().toISOString().slice(0, 10);
    const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
    const logs = loadLog();

    if (!aula.prestada) {
      // Retiro (Entrada a aula / toma de llave)
      aula.prestada = true;
      aula.quienTiene = docenteNombre;
      aula.emailTiene = docenteEmail || "";
      aula.horaRetiro = hora;
      const id = "LLV-" + String(Date.now()).slice(-5);
      const hash = sha256Hex ? (await sha256Hex(`${id}|${aula.id}|${docenteNombre}|${hoy}|${hora}`)).slice(0, 16) : "LLVSHA256";
      logs.unshift({
        id, fecha: hoy, aulaId: aula.id, aulaNombre: aula.nombre,
        docente: docenteNombre, email: docenteEmail || "",
        horaEntrega: hora, horaDevolucion: "", estadoAula: notaEstado || "Óptimo",
        estado: "EN_USO", hash
      });
      saveAulas(aulas); saveLog(logs);
      return { ok: true, accion: "RETIRO", msg: `🔑 Llave de ${aula.nombre} entregada a ${docenteNombre} (${hora}).` };
    } else {
      // Devolución (Salida de aula / entrega de llave)
      const activeLog = logs.find(l => l.aulaId === aula.id && !l.horaDevolucion);
      if (activeLog) {
        activeLog.horaDevolucion = hora;
        activeLog.estado = "DEVUELTA";
        if (notaEstado) activeLog.estadoAula = `${activeLog.estadoAula} → Devolución: ${notaEstado}`;
      }
      const prevDoc = aula.quienTiene;
      aula.prestada = false; aula.quienTiene = ""; aula.emailTiene = ""; aula.horaRetiro = "";
      saveAulas(aulas); saveLog(logs);
      return { ok: true, accion: "DEVOLUCION", msg: `✅ Llave de ${aula.nombre} devuelta por ${prevDoc || docenteNombre} (${hora}).` };
    }
  }

  function imprimirBitacoraLlavesPDF(logs, generarQRSVG, hash, responsable) {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", escudo: "/escudo-ctpmn-oficial.jpeg?v=212" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=212" };
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir la bitácora PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Bitácora de Llaves QR</title><style>body{font-family:Inter,Arial,sans-serif;padding:22px;color:#0f172a;font-size:11.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:8px;margin-bottom:12px}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #cbd5e1;padding:6px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;border:1.5px solid #0f766e;padding:8px;border-radius:8px}</style></head><body><div class="hdr"><img src="${inst.escudo}" style="height:54px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${inst.nombre}</h2><div>📍 ${inst.provincia} • ${inst.regional} • ${inst.circuito}</div><h3 style="margin:3px 0 0;color:#0f766e">BITÁCORA DIGITAL DE TOMA Y DEVOLUCIÓN DE LLAVES (AULAS Y LABS)</h3></div><img src="${b.logoMep}" style="height:40px"/></div><table><tr><th>Fecha</th><th>Aula / Lab</th><th>Docente / Persona</th><th>Hora Retiro</th><th>Hora Devolución</th><th>Estado / Obs.</th><th>SHA-256</th></tr>${logs.slice(0, 60).map(l => `<tr><td>${l.fecha}</td><td><b>${l.aulaNombre}</b></td><td>${l.docente}</td><td>${l.horaEntrega}</td><td>${l.horaDevolucion || "En uso"}</td><td>${l.estadoAula}</td><td><code>${l.hash}</code></td></tr>`).join("")}</table><div class="qr">${generarQRSVG ? generarQRSVG("PT-LLAVES|" + hash, 80) : ""}<div><b>Control de Llaves Verificable QR SHA-256</b><br/>Emitido por: ${responsable}<br/>Sello: <code>${hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_LLAVES_API = { loadAulas, saveAulas, loadLog, saveLog, registrarMovimientoLlave };

  window.BDS_RENDER_LLAVES_AULAS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const permitidos = ["SuperAdmin", "Admin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Auxiliar de Vigilancia (Seguridad)", "Conserje / Mantenimiento", "Docente MEP", "Orientador(a)"];
    if (!sesion || !permitidos.includes(sesion.rol)) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Control de Llaves exclusivo para personal institucional</h3></div>`;
      return;
    }

    let modoKiosko = false;
    let docenteEscaneado = { nombre: sesion.nombre, email: sesion.email };
    let msgEstado = "";
    let filtroAula = "TODAS";

    function draw() {
      const aulas = loadAulas();
      const logs = loadLog();
      const afuera = aulas.filter(a => a.prestada).length;
      const logsVis = filtroAula === "TODAS" ? logs : logs.filter(l => l.aulaId === filtroAula);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">CONTROL DIGITAL DE LLAVES QR SHA-256 • ${afuera} LLAVE(S) AFUERA</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🔑 Control de Llaves de Laboratorios y Aulas (Incl. Aula 13)</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button id="ll-kiosk" style="background:${modoKiosko?'#059669':'#1d4ed8'};color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">${modoKiosko?"✅ Modo Kiosko Activo":"📱 Modo Kiosko QR (Celular/PC Fijo)"}</button>
              <button id="ll-pdf" style="background:#7c3aed;color:#fff;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Bitácora PDF</button>
              <button id="ll-csv" style="background:#0f766e;color:#fff;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          ${msgEstado ? `<div style="background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:9px 12px;border-radius:9px;font-size:12.5px;font-weight:700;margin-bottom:11px;display:flex;justify-content:space-between;align-items:center;"><span>${msgEstado}</span><button id="ll-clr" style="background:#0f172a;color:#fff;border:none;padding:3px 8px;border-radius:5px;cursor:pointer;">✕</button></div>` : ""}

          <!-- Barra de identificación por Carné QR (Ideal para Kiosko en Dirección o Vigilancia) -->
          <div style="background:#070d19;border:1.5px solid #38bdf8;border-radius:11px;padding:12px;margin-bottom:13px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-size:11px;color:#94a3b8;">PERSONA QUE RETIRA / DEVUELVE LA LLAVE:</div>
              <div style="font-size:15px;font-weight:800;color:#38bdf8;">👤 ${docenteEscaneado.nombre} <span style="font-size:11px;color:#94a3b8;">(${docenteEscaneado.email})</span></div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="ll-scan" style="background:#059669;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📷 Escanear Carné QR Docente</button>
              <button id="ll-manual" style="background:#1e3a8a;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">✏️ Cambiar Docente</button>
            </div>
          </div>

          <!-- Tablero Táctil de Aulas y Laboratorios (Aula 13 de primera) -->
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(${modoKiosko?'230px':'205px'},1fr));gap:9px;margin-bottom:14px;">
            ${aulas.map(a => `
              <div style="background:#070d19;border:1.5px solid ${a.prestada?'#f59e0b':(a.id==='AULA-13'?'#38bdf8':'#1e293b')};border-radius:11px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                    <span style="font-size:10px;color:#2dd4bf;font-weight:700;">${a.pabellon}</span>
                    <span style="background:${a.prestada?'#b45309':'#059669'};color:#fff;font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:99px;">${a.prestada?"🔑 EN USO":"✅ EN LLAVERO"}</span>
                  </div>
                  <div style="font-size:13.5px;font-weight:800;color:#fff;margin-top:4px;">${a.nombre}</div>
                  ${a.prestada ? `<div style="font-size:11px;color:#fbbf24;margin-top:3px;">Tiene llave: <b>${a.quienTiene}</b> desde ${a.horaRetiro}</div>` : `<div style="font-size:11px;color:#94a3b8;margin-top:3px;">Disponible para retiro inmediato</div>`}
                </div>
                <button data-aid="${a.id}" class="ll-act" style="width:100%;background:${a.prestada?'#059669':'#1d4ed8'};color:#fff;border:none;padding:${modoKiosko?'12px':'9px'};border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  ${a.prestada ? "📥 Registrar Devolución" : "🔑 Retirar Llave (Firmar QR)"}
                </button>
              </div>
            `).join("")}
          </div>

          ${!modoKiosko ? `
            <!-- Agregar nueva aula/laboratorio -->
            <form id="ll-add-f" style="background:#070d19;border:1px solid #1e293b;border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:7px;margin-bottom:13px;">
              <input id="la-id" type="text" required placeholder="Código (ej. AULA-14)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
              <input id="la-nom" type="text" required placeholder="Nombre Aula o Laboratorio" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
              <input id="la-pab" type="text" required value="Pabellón Técnico" placeholder="Pabellón / Área" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
              <button type="submit" style="background:#0f766e;color:#fff;border:none;padding:8px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">+ Agregar Aula / Lab</button>
            </form>

            <!-- Bitácora filtrable (con acceso rápido a Todo lo del Aula 13) -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
              <b style="color:#38bdf8;font-size:13px;">📜 Bitácora de Entradas y Salidas de Llaves (${logsVis.length})</b>
              <select id="ll-flt" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:6px 9px;border-radius:7px;font-size:11.5px;font-weight:700;">
                <option value="TODAS" ${filtroAula==="TODAS"?"selected":""}>Todas las aulas y laboratorios</option>
                ${aulas.map(a => `<option value="${a.id}" ${filtroAula===a.id?"selected":""}>Solo ${a.nombre}</option>`).join("")}
              </select>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:650px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Fecha</th><th style="padding:7px;text-align:left;">Aula / Lab</th><th style="padding:7px;text-align:left;">Docente</th><th style="padding:7px;">Retiro</th><th style="padding:7px;">Devolución</th><th style="padding:7px;text-align:left;">Obs. / Estado</th><th style="padding:7px;">SHA-256</th></tr>
                ${logsVis.slice(0, 35).map(l => `<tr>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${l.aulaNombre}</b></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">${l.docente}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#fbbf24;font-weight:700;">${l.horaEntrega}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:${l.horaDevolucion?'#34d399':'#f87171'};font-weight:700;">${l.horaDevolucion || "En uso"}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;font-size:11px;">${l.estadoAula}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#2dd4bf;text-align:center;">${l.hash}</td>
                </tr>`).join("") || `<tr><td colspan="7" style="padding:14px;text-align:center;color:#64748b;">Aún no hay movimientos de llaves registrados.</td></tr>`}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      document.getElementById("ll-kiosk").onclick = () => { modoKiosko = !modoKiosko; draw(); };
      if (document.getElementById("ll-clr")) document.getElementById("ll-clr").onclick = () => { msgEstado = ""; draw(); };
      document.getElementById("ll-scan").onclick = () => {
        if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible en este navegador.");
        window.BDS_QR_CAMERA.openModal({
          title: "Escanear Carné QR del Docente",
          onScan: (code) => {
            const m = String(code || "").match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
            const mail = m ? m[0].toLowerCase() : "";
            const u = window.BDS_TRAZABILIDAD ? window.BDS_TRAZABILIDAD.loadUsers().find(x => (x.email || "").toLowerCase() === mail) : null;
            docenteEscaneado = { nombre: u ? u.nombre : (window.BDS_MOTIVACION ? window.BDS_MOTIVACION.formatNameFromEmail(mail || code) : code.slice(0, 28)), email: mail || "qr-verificado" };
            msgEstado = `✅ Carné QR verificado: ${docenteEscaneado.nombre}. Ahora toque el aula para retirar o devolver llave.`;
            draw();
          }
        });
      };
      document.getElementById("ll-manual").onclick = () => {
        const nom = prompt("Nombre completo de la persona docente:", docenteEscaneado.nombre);
        if (nom && nom.trim()) { docenteEscaneado = { nombre: nom.trim(), email: "registro-manual" }; draw(); }
      };
      shell.querySelectorAll(".ll-act").forEach(b => b.onclick = async () => {
        const aid = b.getAttribute("data-aid");
        const aula = loadAulas().find(x => x.id === aid);
        const nota = modoKiosko ? "Óptimo" : (prompt(`Observación rápida del ${aula ? aula.nombre : aid} (opcional):`, "Óptimo — equipo completo") || "Óptimo");
        const res = await registrarMovimientoLlave(aid, docenteEscaneado.nombre, docenteEscaneado.email, nota, sha256Hex);
        msgEstado = res.msg;
        if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🔑 Control de Llaves", res.msg);
        draw();
      });
      if (document.getElementById("ll-add-f")) document.getElementById("ll-add-f").onsubmit = (e) => {
        e.preventDefault();
        const a = loadAulas();
        a.push({ id: document.getElementById("la-id").value.trim().toUpperCase(), nombre: document.getElementById("la-nom").value.trim(), pabellon: document.getElementById("la-pab").value.trim(), responsable: sesion.nombre, prestada: false, quienTiene: "", emailTiene: "", horaRetiro: "" });
        saveAulas(a); draw();
      };
      if (document.getElementById("ll-flt")) document.getElementById("ll-flt").onchange = (e) => { filtroAula = e.target.value; draw(); };
      document.getElementById("ll-pdf").onclick = async () => {
        const h = sha256Hex ? (await sha256Hex(`LLAVES|${Date.now()}`)).slice(0, 16) : "LLVPDF";
        imprimirBitacoraLlavesPDF(logsVis, generarQRSVG, h, sesion.nombre);
      };
      document.getElementById("ll-csv").onclick = () => {
        const rows = [["FECHA","AULA_ID","AULA","DOCENTE","RETIRO","DEVOLUCION","ESTADO_AULA","SHA256"], ...logsVis.map(l => [l.fecha, l.aulaId, l.aulaNombre, l.docente, l.horaEntrega, l.horaDevolucion||"En uso", l.estadoAula, l.hash])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "control-llaves-aulas-labs.csv"; a.click();
      };
    }
    draw();
  };
})();