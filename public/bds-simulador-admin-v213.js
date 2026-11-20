(function () {
  const EXP_KEY = "bds_expedientes_cert_v213";
  const CRUCE_KEY = "bds_cruce_notas_jefatura_v213";

  const ESPECIALIDADES_CR = [
    "Desarrollo Web",
    "Ciberseguridad",
    "Soporte TI",
    "Contabilidad y Finanzas",
    "Ejecutivo Comercial",
    "Diseño Gráfico y Publicidad",
    "Turismo y Hotelería",
    "Educación Académica / General"
  ];

  function getInstMeta() {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=213" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=213" };
    return { ...inst, logoMep: b.logoMep };
  }

  function loadExpedientes() {
    try { const d = JSON.parse(localStorage.getItem(EXP_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "EXP-2026-001", condicion: "Estudiante Activo", nombre: "Sofía Alvarado Rojas", cedula: "4-0289-0114", seccion: "11-1", especialidad: "Desarrollo Web", anio: "2026", tipoDoc: "Constancia de Estudiante Regular", promedio: "88.5", estadoJefatura: "APROBADO", aprobadoPor: "Dirección / Jefatura", hash: "EXP213A91F0021" },
      { id: "EXP-2026-002", condicion: "Egresado(a)", nombre: "Diego Valverde Solís", cedula: "4-0244-0819", seccion: "12-2", especialidad: "Ciberseguridad", anio: "2025", tipoDoc: "Certificado de Egreso de Especialidad", promedio: "91.0", estadoJefatura: "PENDIENTE", aprobadoPor: "", hash: "EXP213B44C8812" }
    ];
    localStorage.setItem(EXP_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveExpedientes(a) { localStorage.setItem(EXP_KEY, JSON.stringify(a)); }

  function loadCruceNotas() {
    try { const d = JSON.parse(localStorage.getItem(CRUCE_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    return [];
  }
  function saveCruceNotas(a) { localStorage.setItem(CRUCE_KEY, JSON.stringify(a)); }

  // Simulador automático sin testers: genera horarios, permisos, justificaciones, expedientes y cruce de notas
  function ejecutarSimulacionSinTesters(modalidad, anio, especialidad) {
    const mod = modalidad || "CTP (Técnico)";
    const yr = String(anio || "2027");
    const esp = especialidad || "Desarrollo Web";

    if (window.BDS_HORARIOS_CSP_API && window.BDS_HORARIOS_CSP_API.generarHorarioCSP) {
      const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210" };
      const h = window.BDS_HORARIOS_CSP_API.generarHorarioCSP(mod, yr, inst);
      window.BDS_HORARIOS_CSP_API.saveHorario(h);
    }

    if (window.BDS_PERMISOS_API) {
      const perms = window.BDS_PERMISOS_API.loadPerm();
      const simId = "SIM-PRM-" + String(Date.now()).slice(-4);
      if (!perms.some(p => p.id === simId)) {
        perms.unshift({
          id: simId, categoria: "PERSONAL", fechaCreacion: new Date().toLocaleDateString("es-CR"),
          solicitante: "Docente Simulado (QA)", email: "docente.sim@mep.go.cr", rol: "Docente MEP",
          destinatario: "Dirección / Subdirección", tipo: "Cita Médica / EDUS",
          fechaCita: new Date().toISOString().slice(0, 10), horaSalida: "08:00", horaRegreso: "10:00",
          motivo: "Simulación de permiso con comprobante para revisión de jefatura.",
          adjuntoNombre: "comprobante-simulado.pdf", adjuntoData: "",
          estado: "PENDIENTE", aprobadoPor: "", hash: "SIMPRM213001"
        });
        window.BDS_PERMISOS_API.savePerm(perms);
      }

      const justs = window.BDS_PERMISOS_API.loadJust();
      const simJId = "SIM-JST-" + String(Date.now()).slice(-4);
      justs.unshift({
        id: simJId, fechaCreacion: new Date().toLocaleDateString("es-CR"),
        persona: "Estudiante Simulado (QA)", email: "est.sim@est.mep.go.cr",
        enviadoPor: "familia.sim@gmail.com", seccion: "11-1",
        destinatario: "Auxiliares, Docentes y Dirección", tipoJust: "Comprobante de Asistencia / Cita",
        permisoRef: "Directo", fechaAusencia: new Date().toISOString().slice(0, 10),
        horaInicio: "08:00", horaFin: "10:30",
        motivo: "Justificación simulada para validar flujo administrativo.",
        adjuntoNombre: "asistencia-simulada.png", adjuntoData: "",
        estado: "PENDIENTE", revisadoPor: "", hash: "SIMJST213002"
      });
      window.BDS_PERMISOS_API.saveJust(justs);
    }

    const exps = loadExpedientes();
    const expId = "EXP-" + yr + "-" + String(Date.now()).slice(-3);
    exps.unshift({
      id: expId, condicion: "Egresado(a)", nombre: "Valeria Solís Jiménez (Sim.)",
      cedula: "4-0251-0633", seccion: "12-1", especialidad: esp, anio: yr,
      tipoDoc: "Certificado de Egreso de Especialidad", promedio: "89.0",
      estadoJefatura: "PENDIENTE", aprobadoPor: "", hash: "SIMEXP213003"
    });
    saveExpedientes(exps);

    const cruce = construirCruceNotas(esp, yr);
    saveCruceNotas(cruce);
    return { expedientesCount: exps.length, cruceCount: cruce.length };
  }

  function construirCruceNotas(especialidad, anio) {
    let roster = [], pesos = { cotidiano: 35, tareas: 10, pruebas: 35, proyecto: 10, asistencia: 10 };
    try { roster = JSON.parse(localStorage.getItem("bds_docente_roster_v190") || "[]"); } catch {}
    try { const p = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190") || "null"); if (p) pesos = p; } catch {}

    const baseList = roster.length ? roster : [
      { id: "S1", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", materia: "Diseño de Software", cotidiano: 90, tareas: 88, pruebas: 85, proyecto: 92 },
      { id: "S2", nombre: "Esteban Campos Mora", email: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", materia: "Programación / Ciberseguridad", cotidiano: 65, tareas: 70, pruebas: 62, proyecto: 75 }
    ];

    const prev = loadCruceNotas();
    return baseList.map(st => {
      const prom = Number((((Number(st.cotidiano||0)*pesos.cotidiano) + (Number(st.tareas||0)*pesos.tareas) + (Number(st.pruebas||0)*pesos.pruebas) + (Number(st.proyecto||0)*pesos.proyecto))/100 + Number(pesos.asistencia||10)).toFixed(1));
      const old = prev.find(x => x.email === st.email && x.materia === st.materia);
      return {
        id: old ? old.id : `CRU-${st.email}-${st.materia}`,
        anio: String(anio || "2027"),
        especialidad: especialidad || "Desarrollo Web",
        nombre: st.nombre,
        email: st.email,
        seccion: st.seccion,
        materia: st.materia,
        promedio: prom,
        condicionREAC: prom >= 70 ? "APROBADO" : "REVISIÓN / AMPLIACIÓN",
        aprobadoJefatura: old ? Boolean(old.aprobadoJefatura) : false,
        aprobadoPor: old ? (old.aprobadoPor || "") : "",
        fechaAprobacion: old ? (old.fechaAprobacion || "") : ""
      };
    });
  }

  function imprimirConstanciaPDF(item, generarQRSVG) {
    const m = getInstMeta();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir la constancia o certificado.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${item.tipoDoc} — ${item.nombre}</title><style>body{font-family:Inter,Arial,sans-serif;padding:28px;color:#0f172a;font-size:12.5px;line-height:1.55}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:18px}.box{border:1px solid #cbd5e1;border-radius:10px;padding:16px;background:#f8fafc;margin-bottom:16px}.qr{display:flex;align-items:center;gap:14px;border:2px solid #0f766e;padding:10px;border-radius:10px}</style></head><body><div class="hdr"><img src="${m.escudo}" style="height:60px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${m.nombre}</h2><div>📍 ${m.provincia} • ${m.regional} • ${m.circuito} • Cód. ${m.codigoPresup}</div><h3 style="margin:5px 0 0;color:#0f766e">${item.tipoDoc.toUpperCase()}</h3></div><img src="${m.logoMep}" style="height:44px"/></div><div class="box"><p>La administración y secretaría institucional hacen constar que la persona <b>${item.nombre}</b>, cédula/TIM <b>${item.cedula}</b>, en condición de <b>${item.condicion}</b>, pertenece a la especialidad/área de <b>${item.especialidad}</b> (Sección <b>${item.seccion}</b>), promoción/año lectivo <b>${item.anio}</b>, con promedio consolidado de <b>${item.promedio}%</b>.</p><p><b>Estado de validación por Jefatura:</b> ${item.estadoJefatura}${item.aprobadoPor ? ` (${item.aprobadoPor})` : ""}</p></div><div class="qr">${generarQRSVG ? generarQRSVG("PT-CERT|" + item.hash, 86) : ""}<div><b>Documento Verificable QR SHA-256</b> • Folio: ${item.id}<br/>Código de integridad: <code>${item.hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_ADMIN_SIM_API = {
    ESPECIALIDADES_CR, loadExpedientes, saveExpedientes, loadCruceNotas, saveCruceNotas,
    construirCruceNotas, ejecutarSimulacionSinTesters, imprimirConstanciaPDF
  };

  window.BDS_RENDER_ADMIN_SIM_CRUCE = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const rol = (sesion && sesion.rol) || "";
    const puedeOperar = ["SuperAdmin", "Admin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Secretaria / Secretario", "Auxiliar Administrativo", "Docente MEP"].includes(rol);
    const puedeAprobarJefatura = ["SuperAdmin", "Admin", "Director(a)", "Subdirector(a)"].includes(rol);

    if (!puedeOperar) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso restringido a Secretaría, Jefatura y Administración</h3></div>`;
      return;
    }

    let tab = "constancias"; // constancias | cruce | simulador
    let espSel = "Desarrollo Web";
    let anioSel = "2027";
    let modSel = (window.BDS_INST_API && window.BDS_INST_API.getActiva().tipo) || "CTP (Técnico)";
    let simMsg = "";

    function draw() {
      const exps = loadExpedientes();
      const cruce = construirCruceNotas(espSel, anioSel);
      const pendJefExp = exps.filter(x => x.estadoJefatura !== "APROBADO").length;
      const pendJefCru = cruce.filter(x => !x.aprobadoJefatura).length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">SECRETARÍA • CONSTANCIAS Y EGRESOS • CRUCE DE NOTAS • APROBACIÓN JEFATURA</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🗂️ Expedientes, Constancias/Egresos, Cruce de Notas y Simulador</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-st="constancias" class="ad-t" style="background:${tab==='constancias'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📜 Constancias / Egresos (${exps.length})</button>
              <button data-st="cruce" class="ad-t" style="background:${tab==='cruce'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📊 Cruce de Notas (${pendJefCru} pend.)</button>
              <button data-st="simulador" class="ad-t" style="background:${tab==='simulador'?'#7c3aed':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🧪 Simulador Sin Testers</button>
            </div>
          </div>

          ${simMsg ? `<div style="background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:11px;">${simMsg}</div>` : ""}

          ${tab === "constancias" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="ex-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">➕ Emitir Constancia o Certificado de Egreso</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <select id="ex-cond" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                    <option>Estudiante Activo</option><option>Egresado(a)</option>
                  </select>
                  <select id="ex-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                    <option>Constancia de Estudiante Regular</option><option>Certificado de Egreso de Especialidad</option><option>Constancia de Notas y Conducta</option>
                  </select>
                </div>
                <input id="ex-nom" type="text" required placeholder="Nombre completo de la persona" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <input id="ex-ced" type="text" required placeholder="Cédula o TIM" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  <input id="ex-sec" type="text" required value="12-1" placeholder="Sección / Grupo" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                </div>
                <div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;">
                  <select id="ex-esp" style="background:#0b1322;color:#2dd4bf;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
                    ${ESPECIALIDADES_CR.map(e => `<option ${espSel===e?"selected":""}>${e}</option>`).join("")}
                  </select>
                  <input id="ex-yr" type="text" required value="${anioSel}" placeholder="Año" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:700;"/>
                </div>
                <input id="ex-prm" type="text" required value="88.0" placeholder="Promedio o nota de referencia (%)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✅ Registrar Documento + QR SHA-256</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:11px;padding:13px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
                  <b style="color:#fbbf24;font-size:13.5px;">📁 Expedientes y Constancias (${pendJefExp} pendientes de jefatura)</b>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:420px;overflow-y:auto;">
                  ${exps.map(x => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${x.estadoJefatura==='APROBADO'?'#10b981':'#f59e0b'};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <b>${x.nombre} (${x.condicion})</b>
                        <span style="background:${x.estadoJefatura==='APROBADO'?'#059669':'#b45309'};color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;">${x.estadoJefatura}</span>
                      </div>
                      <div style="color:#38bdf8;font-size:11.5px;margin:3px 0;">${x.tipoDoc} • <b>${x.especialidad}</b> • Año ${x.anio} • Prom: <b>${x.promedio}%</b></div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;">
                        <button data-epdf="${x.id}" class="ex-pdf" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Imprimir PDF + QR</button>
                        ${puedeAprobarJefatura && x.estadoJefatura !== "APROBADO" ? `<button data-eap="${x.id}" class="ex-ap" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Aprobar Jefatura</button>` : ""}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "cruce" ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                <select id="cr-esp" style="background:#070d19;color:#2dd4bf;border:1px solid #334155;padding:6px 9px;border-radius:7px;font-size:11.5px;font-weight:700;">${ESPECIALIDADES_CR.map(e => `<option ${espSel===e?"selected":""}>${e}</option>`).join("")}</select>
                <input id="cr-yr" type="text" value="${anioSel}" style="width:76px;background:#070d19;color:#fbbf24;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:11.5px;font-weight:700;"/>
              </div>
              ${puedeAprobarJefatura ? `<button id="cr-ap-all" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">✅ Aprobar Cruce en Lote (Jefatura)</button>` : ""}
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:650px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Estudiante</th><th style="padding:7px;">Sección</th><th style="padding:7px;text-align:left;">Asignatura / Subárea</th><th style="padding:7px;">Promedio</th><th style="padding:7px;">Condición REAC</th><th style="padding:7px;">Jefatura</th></tr>
                ${cruce.map((c, idx) => `<tr>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${c.nombre}</b><br/><span style="font-size:10px;color:#94a3b8;">${c.email}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${c.seccion}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">${c.materia}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;font-weight:800;color:${c.promedio>=70?'#34d399':'#f87171'};">${c.promedio}%</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${c.condicionREAC}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                    ${c.aprobadoJefatura ? `<span style="color:#34d399;font-weight:700;">✓ Aprobado</span>` : (puedeAprobarJefatura ? `<button data-ci="${idx}" class="cr-ap1" style="background:#059669;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10.5px;font-weight:700;cursor:pointer;">Aprobar</button>` : `<span style="color:#fbbf24;">Pendiente</span>`)}
                  </td>
                </tr>`).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "simulador" ? `
            <div style="background:#070d19;border:1px solid #7c3aed;border-radius:12px;padding:14px;">
              <h3 style="margin:0 0 6px;font-size:14.5px;color:#c084fc;">🧪 Simulador Administrativo Sin Testers</h3>
              <p style="margin:0 0 12px;font-size:12px;color:#cbd5e1;">Puebla de inmediato <b>horarios, permisos, justificaciones, certificados de egreso y cruce de notas</b> para probar el sistema sin depender de personas tester.</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:12px;">
                <select id="sm-mod" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">${["CTP (Técnico)","Colegio Académico","Escuela Primaria","Colegio Nocturno / CINDEA / IPEC","Liceo Rural / Telesecundaria"].map(m => `<option ${modSel===m?"selected":""}>${m}</option>`).join("")}</select>
                <select id="sm-esp" style="background:#0b1322;color:#2dd4bf;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">${ESPECIALIDADES_CR.map(e => `<option ${espSel===e?"selected":""}>${e}</option>`).join("")}</select>
                <input id="sm-yr" type="text" value="${anioSel}" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <button id="sm-run" style="background:#7c3aed;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Generar Lote de Prueba</button>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".ad-t").forEach(b => b.onclick = () => { tab = b.getAttribute("data-st"); draw(); });

      if (tab === "constancias") {
        document.getElementById("ex-f").onsubmit = async (e) => {
          e.preventDefault();
          const arr = loadExpedientes(), id = "EXP-" + document.getElementById("ex-yr").value.trim() + "-" + String(Date.now()).slice(-3);
          const nom = document.getElementById("ex-nom").value.trim();
          const hash = sha256Hex ? (await sha256Hex(`${id}|${nom}|${Date.now()}`)).slice(0, 16) : "EXPSHA256";
          arr.unshift({
            id, condicion: document.getElementById("ex-cond").value, tipoDoc: document.getElementById("ex-tip").value,
            nombre: nom, cedula: document.getElementById("ex-ced").value.trim(), seccion: document.getElementById("ex-sec").value.trim(),
            especialidad: document.getElementById("ex-esp").value, anio: document.getElementById("ex-yr").value.trim(),
            promedio: document.getElementById("ex-prm").value.trim(), estadoJefatura: "PENDIENTE", aprobadoPor: "", hash
          });
          saveExpedientes(arr); draw();
        };
        shell.querySelectorAll(".ex-pdf").forEach(b => b.onclick = () => {
          const item = loadExpedientes().find(x => x.id === b.getAttribute("data-epdf"));
          if (item) imprimirConstanciaPDF(item, generarQRSVG);
        });
        shell.querySelectorAll(".ex-ap").forEach(b => b.onclick = () => {
          const arr = loadExpedientes(), item = arr.find(x => x.id === b.getAttribute("data-eap"));
          if (item) { item.estadoJefatura = "APROBADO"; item.aprobadoPor = `${sesion.nombre} (${sesion.rol})`; saveExpedientes(arr); draw(); }
        });
      }

      if (tab === "cruce") {
        document.getElementById("cr-esp").onchange = (e) => { espSel = e.target.value; draw(); };
        document.getElementById("cr-yr").onchange = (e) => { anioSel = e.target.value.trim() || "2027"; draw(); };
        shell.querySelectorAll(".cr-ap1").forEach(b => b.onclick = () => {
          const i = Number(b.getAttribute("data-ci"));
          cruce[i].aprobadoJefatura = true; cruce[i].aprobadoPor = sesion.nombre; cruce[i].fechaAprobacion = new Date().toLocaleDateString("es-CR");
          saveCruceNotas(cruce); draw();
        });
        if (document.getElementById("cr-ap-all")) document.getElementById("cr-ap-all").onclick = () => {
          cruce.forEach(r => { r.aprobadoJefatura = true; r.aprobadoPor = sesion.nombre; r.fechaAprobacion = new Date().toLocaleDateString("es-CR"); });
          saveCruceNotas(cruce); draw();
        };
      }

      if (tab === "simulador") {
        document.getElementById("sm-run").onclick = () => {
          modSel = document.getElementById("sm-mod").value;
          espSel = document.getElementById("sm-esp").value;
          anioSel = document.getElementById("sm-yr").value.trim() || "2027";
          const res = ejecutarSimulacionSinTesters(modSel, anioSel, espSel);
          simMsg = `✅ Simulación ejecutada (${modSel} • ${espSel} • ${anioSel}): horarios, permisos, justificaciones, ${res.expedientesCount} expedientes y ${res.cruceCount} registros en cruce de notas listos.`;
          tab = "cruce"; draw();
        };
      }
    }
    draw();
  };
})();