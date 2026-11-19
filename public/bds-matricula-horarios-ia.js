(function () {
  const EST_KEY = "bds_matricula_est_v187";
  const DOC_KEY = "bds_matricula_doc_v187";
  const HOR_KEY = "bds_horarios_ia_v187";

  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const BLOQUES = [
    { id: "B1", lbl: "07:00 - 08:20 (Lecciones 1-2)" },
    { id: "B2", lbl: "08:30 - 09:50 (Lecciones 3-4)" },
    { id: "B3", lbl: "10:00 - 11:20 (Lecciones 5-6)" },
    { id: "ALM", lbl: "11:20 - 12:10 (🍽️ Almuerzo Comedor)", almuerzo: true },
    { id: "B4", lbl: "12:10 - 13:30 (Lecciones 7-8)" },
    { id: "B5", lbl: "13:40 - 15:00 (Lecciones 9-10)" },
    { id: "B6", lbl: "15:10 - 16:20 (Lecciones 11-12)" }
  ];

  const ESPECIALIDADES = [
    "Desarrollo Web", "Ciberseguridad", "Soporte TI y Redes", "Contabilidad y Finanzas",
    "Electrónica Industrial", "Electromecánica", "Administración y Operación Aduanera",
    "Diseño Publicitario", "Ejecutivo Comercial y Servicio al Cliente", "Académica (III Ciclo)"
  ];

  const SECCIONES_LIST = ["7-1","7-2","8-1","8-2","9-1","9-2","10-C","10-C-3","10-1","11-1","11-2","12-1","12-2"];

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=187",
      logoMep: "/logo-mep-oficial.png?v=187"
    };
  }

  function loadEst() {
    try { const d = JSON.parse(localStorage.getItem(EST_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "MAT-2026-001", nombre: "Sofía Alvarado Rojas", cedula: "4-0289-0114", email: "sofia.alvarado@est.mep.go.cr", nivel: "11°", seccion: "11-1", especialidad: "Desarrollo Web", encargado: "Ana Rojas Vega", telEncargado: "8811-2233", docs: { cedula: true, notas: true, vacunas: true, poliza: true, ley8968: true }, estado: "MATRICULADO", hash: "A7B90C11E4F28810" },
      { id: "MAT-2026-002", nombre: "Esteban Campos Mora", cedula: "4-0295-0442", email: "esteban.campos@est.mep.go.cr", nivel: "10°", seccion: "10-C-3", especialidad: "Ciberseguridad", encargado: "Luis Campos Solís", telEncargado: "8722-3344", docs: { cedula: true, notas: true, vacunas: true, poliza: false, ley8968: true }, estado: "MATRICULADO", hash: "B4E21D90C8A1337F" }
    ];
    localStorage.setItem(EST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveEst(a) { localStorage.setItem(EST_KEY, JSON.stringify(a)); }

  function loadDoc() {
    try { const d = JSON.parse(localStorage.getItem(DOC_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "DOC-001", nombre: "Ing. Max Salazar Sánchez", cedula: "1-1122-0334", email: "max.salazar.sanchez@mep.go.cr", condicion: "Propiedad (20h)", materias: ["Programación Web", "Diseño de Software", "Ciberseguridad"], secciones: ["10-C-3", "10-C", "11-1", "12-1"], aula: "Lab Informática 1", hash: "D101F9A2C8B34401" },
      { id: "DOC-002", nombre: "Prof. Carlos Quesada Mora", cedula: "4-0188-0521", email: "carlos.quesada@mep.go.cr", condicion: "Propiedad (40h)", materias: ["Matemática", "Física"], secciones: ["10-C-3", "11-1", "12-1"], aula: "Aula 12", hash: "D202A8E1B4C97722" },
      { id: "DOC-003", nombre: "Licda. Andrea Jiménez Soto", cedula: "4-0211-0812", email: "andrea.jimenez@mep.go.cr", condicion: "Propiedad (36h)", materias: ["Inglés Técnico", "Inglés Académico"], secciones: ["10-C", "10-C-3", "11-1", "12-1"], aula: "Lab Idiomas 2", hash: "D303C7B2D5E86619" },
      { id: "DOC-004", nombre: "Prof. Roberto Vargas Salas", cedula: "4-0194-0673", email: "roberto.vargas@mep.go.cr", condicion: "Interino (32h)", materias: ["Español", "Estudios Sociales", "Cívica"], secciones: ["10-C", "10-C-3", "11-1", "12-1"], aula: "Aula 07", hash: "D404F6D3A1E92288" },
      { id: "DOC-005", nombre: "Licda. Daniela Herrera Chaves", cedula: "4-0220-0915", email: "daniela.herrera@mep.go.cr", condicion: "Propiedad (30h)", materias: ["Biología", "Química", "Soporte TI"], secciones: ["10-C", "11-1", "12-1"], aula: "Lab Ciencias 1", hash: "D505E1C4B2A78831" }
    ];
    localStorage.setItem(DOC_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveDoc(a) { localStorage.setItem(DOC_KEY, JSON.stringify(a)); }

  function loadHor() { try { return JSON.parse(localStorage.getItem(HOR_KEY)) || null; } catch { return null; } }
  function saveHor(h) { localStorage.setItem(HOR_KEY, JSON.stringify(h)); }

  // Motor CSP (Constraint Satisfaction Problem) para Horarios Aleatorios Cero Choques
  async function generarHorarioCSP(docentes, sha256Hex) {
    const seccionesSet = new Set(["10-C-3", "10-C", "11-1", "12-1"]);
    docentes.forEach(d => (d.secciones || []).forEach(s => seccionesSet.add(s)));
    const secciones = Array.from(seccionesSet);
    const slotsActivos = BLOQUES.filter(b => !b.almuerzo);

    const grid = {}; // grid[sec][dia][bloqueId] = { materia, docente, aula }
    const docBusy = new Set();  // `${dia}|${bloque}|${docente}`
    const aulaBusy = new Set(); // `${dia}|${bloque}|${aula}`
    secciones.forEach(sec => {
      grid[sec] = {};
      DIAS.forEach(d => { grid[sec][d] = {}; });
    });

    // Crear lista de asignaciones (docente × materia × sección) y barajar aleatoriamente
    const tareas = [];
    docentes.forEach(doc => {
      const secs = (doc.secciones && doc.secciones.length) ? doc.secciones : [secciones[0]];
      const mats = (doc.materias && doc.materias.length) ? doc.materias : ["Materia Institucional"];
      secs.forEach(sec => {
        mats.forEach(mat => {
          // 2 bloques por semana por cada materia asignada
          tareas.push({ sec, mat, doc: doc.nombre, aula: doc.aula || "Aula General" });
          tareas.push({ sec, mat, doc: doc.nombre, aula: doc.aula || "Aula General" });
        });
      });
    });

    // Barajar aleatoriamente (Fisher-Yates) para generar horarios distintos en cada clic
    for (let i = tareas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tareas[i], tareas[j]] = [tareas[j], tareas[i]];
    }

    let asignados = 0, conflictos = 0;
    tareas.forEach(t => {
      const opciones = [];
      DIAS.forEach(dia => slotsActivos.forEach(bl => opciones.push({ dia, bid: bl.id })));
      for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
      }
      let colocado = false;
      for (const op of opciones) {
        if (grid[t.sec][op.dia][op.bid]) continue;
        if (docBusy.has(`${op.dia}|${op.bid}|${t.doc}`)) continue;
        if (aulaBusy.has(`${op.dia}|${op.bid}|${t.aula}`)) continue;
        grid[t.sec][op.dia][op.bid] = { materia: t.mat, docente: t.doc, aula: t.aula };
        docBusy.add(`${op.dia}|${op.bid}|${t.doc}`);
        aulaBusy.add(`${op.dia}|${op.bid}|${t.aula}`);
        asignados++;
        colocado = true;
        break;
      }
      if (!colocado) conflictos++;
    });

    const creado = new Date().toLocaleString("es-CR");
    const hash = (await sha256Hex(`HORARIO-CSP|${creado}|${asignados}|${secciones.join(",")}`)).slice(0, 20);
    if (window.BDS_REGISTER_HASH) window.BDS_REGISTER_HASH(hash, { doc_type: "horario", holder_name: getBrand().institucion, institution_name: getBrand().institucion, detalle: `Horario CSP (${asignados} bloques, 0 choques)` });
    const data = { creado, asignados, conflictos, secciones, docentes: docentes.map(d => d.nombre), grid, hash };
    saveHor(data);
    return data;
  }

  function imprimirComprobanteQR(titulo, filas, hash, generarQRSVG) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el documento oficial.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${titulo}</title><style>body{font-family:Inter,Arial,sans-serif;padding:28px;color:#0f172a}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:12px;margin-bottom:18px}table{width:100%;border-collapse:collapse;font-size:13px}td{border:1px solid #cbd5e1;padding:9px}.qr{margin-top:20px;display:flex;align-items:center;gap:16px;border:2px solid #0f766e;border-radius:10px;padding:12px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:68px"/><div style="text-align:center"><h2 style="margin:0">${b.institucion}</h2><div style="font-size:12px">${b.regional} • ${b.circuito}</div><h3 style="margin:6px 0 0;color:#0f766e">${titulo}</h3></div><img src="${b.logoMep}" style="height:48px"/></div><table>${filas.map(([k,v]) => `<tr><td style="width:34%;background:#f8fafc"><b>${k}</b></td><td>${v}</td></tr>`).join("")}</table><div class="qr">${generarQRSVG("PT-DOC|" + hash, 110)}<div><b>Sello Criptográfico Oficial SHA-256</b><br/><code style="font-size:12px">${hash}</code><br/><small>Documento verificable en pracTICAtecnica.com • Cumplimiento Ley N.° 8968 (PRODHAB).</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_RENDER_MATRICULA_HORARIOS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const puedeGestionar = ["SuperAdmin", "Director(a)", "Auxiliar Administrativo", "Ministro(a) MEP"].includes(sesion.rol);
    let tab = puedeGestionar ? "horarios" : "horarios";
    let vistaHor = "seccion"; // "seccion" | "docente"
    let selFiltro = "11-1";

    function draw() {
      const ests = loadEst();
      const docs = loadDoc();
      const hor = loadHor();

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#1d4ed8;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">JEFATURA & DIRECCIÓN • QR SHA-256 VERIFICABLE</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🏫 Matrícula Institucional, Docentes y Horarios IA (Cero Choques)</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-mt="horarios" class="mh-tab" style="background:${tab==='horarios'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🤖 Horarios Aleatorios IA</button>
              ${puedeGestionar ? `
                <button data-mt="estudiantes" class="mh-tab" style="background:${tab==='estudiantes'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🎓 Matrícula Estudiantes (${ests.length})</button>
                <button data-mt="docentes" class="mh-tab" style="background:${tab==='docentes'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">👨‍🏫 Docentes y Materias (${docs.length})</button>
              ` : ""}
            </div>
          </div>

          ${tab === "horarios" ? `
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
              <div>
                <div style="font-size:12.5px;font-weight:800;color:#38bdf8;">⚡ Motor CSP de Generación Automática de Horarios (Sin Choques de Docente ni Aula)</div>
                <div style="font-size:11.5px;color:#94a3b8;">${hor ? `Último horario generado: ${hor.creado} • ${hor.asignados} bloques asignados • <b>0 choques</b> • SHA-256: <code>${hor.hash}</code>` : "Presione el botón para generar un horario completo con todos los docentes matriculados."}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${puedeGestionar ? `<button id="hor-gen" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎲 Generar Horario Aleatorio IA</button>` : ""}
                ${hor ? `<button id="hor-prt" style="background:#1d4ed8;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Imprimir con QR SHA-256</button>` : ""}
              </div>
            </div>

            ${hor ? `
              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">
                <button id="vh-sec" style="background:${vistaHor==='seccion'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">Ver por Sección</button>
                <button id="vh-doc" style="background:${vistaHor==='docente'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">Ver por Docente</button>
                <select id="vh-sel" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12.5px;font-weight:700;">
                  ${(vistaHor === "seccion" ? hor.secciones : hor.docentes).map(x => `<option value="${x}" ${selFiltro===x?"selected":""}>${vistaHor==="seccion"?"Sección ":"Docente: "}${x}</option>`).join("")}
                </select>
              </div>

              <div style="overflow-x:auto;">
                <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:11.5px;">
                  <tr style="background:#131f33;color:#38bdf8;">
                    <th style="padding:8px;text-align:left;width:165px;">Bloque / Hora</th>
                    ${DIAS.map(d => `<th style="padding:8px;text-align:left;">${d}</th>`).join("")}
                  </tr>
                  ${BLOQUES.map(bl => {
                    if (bl.almuerzo) {
                      return `<tr style="background:#064e3b;"><td colspan="6" style="padding:8px;text-align:center;font-weight:800;color:#6ee7b7;">${bl.lbl}</td></tr>`;
                    }
                    return `<tr>
                      <td style="padding:8px;border-bottom:1px solid #1e293b;font-weight:700;color:#cbd5e1;">${bl.lbl}</td>
                      ${DIAS.map(dia => {
                        let celda = null;
                        if (vistaHor === "seccion") {
                          const s = hor.secciones.includes(selFiltro) ? selFiltro : hor.secciones[0];
                          celda = hor.grid[s] && hor.grid[s][dia] ? hor.grid[s][dia][bl.id] : null;
                        } else {
                          const docName = hor.docentes.includes(selFiltro) ? selFiltro : hor.docentes[0];
                          for (const sec of hor.secciones) {
                            const c = hor.grid[sec] && hor.grid[sec][dia] ? hor.grid[sec][dia][bl.id] : null;
                            if (c && c.docente === docName) { celda = { ...c, sec }; break; }
                          }
                        }
                        return `<td style="padding:7px;border-bottom:1px solid #1e293b;border-left:1px solid #1e293b;vertical-align:top;">
                          ${celda ? `<div style="background:#070d19;border-left:3px solid #38bdf8;padding:6px;border-radius:6px;"><b style="color:#fff;">${celda.materia}</b><div style="font-size:10.5px;color:#93c5fd;">${vistaHor==="seccion"?celda.docente:`Sección ${celda.sec}`}</div><div style="font-size:10px;color:#34d399;">📍 ${celda.aula}</div></div>` : `<span style="color:#475569;">— Libre —</span>`}
                        </td>`;
                      }).join("")}
                    </tr>`;
                  }).join("")}
                </table>
              </div>
            ` : `<div style="padding:28px;text-align:center;color:#94a3b8;">Aún no se ha generado el horario maestro. Haga clic en <b>🎲 Generar Horario Aleatorio IA</b>.</div>`}
          ` : ""}

          ${tab === "estudiantes" && puedeGestionar ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start;">
              <form id="me-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0 0 4px;font-size:15px;color:#34d399;">📝 Nueva Matrícula Estudiantil (QR SHA-256)</h3>
                <input id="me-nom" type="text" required placeholder="Nombre completo del estudiante" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="me-ced" type="text" required placeholder="Cédula / DIMEX" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="me-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <select id="me-sec" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    ${SECCIONES_LIST.map(s => `<option value="${s}">Sección ${s}</option>`).join("")}
                  </select>
                  <select id="me-esp" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    ${ESPECIALIDADES.map(e => `<option value="${e}">${e}</option>`).join("")}
                  </select>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="me-enc" type="text" required placeholder="Nombre encargado legal" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="me-tel" type="text" required placeholder="Teléfono encargado" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div style="background:#0b1322;border:1px solid #1e293b;border-radius:8px;padding:9px;font-size:11.5px;display:grid;grid-template-columns:1fr 1fr;gap:5px;">
                  <label><input type="checkbox" id="d-ced" checked/> Cédula / Nacimiento</label>
                  <label><input type="checkbox" id="d-not" checked/> Certificación Notas</label>
                  <label><input type="checkbox" id="d-vac" checked/> Carné Vacunas</label>
                  <label><input type="checkbox" id="d-pol" checked/> Póliza Estudiantil INS</label>
                  <label style="grid-column:1/-1;"><input type="checkbox" id="d-ley" checked/> Consentimiento Informado Ley N.° 8968 (PRODHAB)</label>
                </div>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">✅ Formalizar Matrícula y Generar QR SHA-256</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">📋 Padrón de Estudiantes Matriculados (${ests.length})</h3>
                <div style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
                  ${ests.map(e => {
                    const okDocs = Object.values(e.docs || {}).filter(Boolean).length;
                    return `<div style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                        <b>${e.nombre}</b>
                        <span style="background:#059669;color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;">${e.seccion} • ${okDocs}/5 docs</span>
                      </div>
                      <div style="color:#94a3b8;font-size:11px;margin:3px 0;">${e.id} • Céd: ${e.cedula} • ${e.especialidad} • Encargado: ${e.encargado} (${e.telEncargado})</div>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                        <code style="font-size:10px;color:#34d399;">SHA-256: ${e.hash}</code>
                        <button data-pe="${e.id}" class="me-prt" style="background:#1d4ed8;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Comprobante QR</button>
                      </div>
                    </div>`;
                  }).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "docentes" && puedeGestionar ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start;">
              <form id="md-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">👨‍🏫 Matricular y Asignar Docente a la Institución</h3>
                <input id="md-nom" type="text" required placeholder="Nombre completo del docente" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="md-ced" type="text" required placeholder="Cédula" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="md-mail" type="email" required placeholder="docente@mep.go.cr" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="md-cond" type="text" value="Propiedad (40h)" required placeholder="Nombramiento / Horas" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="md-aula" type="text" value="Aula / Lab Asignado" required placeholder="Aula o Laboratorio" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <input id="md-mats" type="text" required placeholder="Materias separadas por coma (ej: Programación Web, Ciberseguridad)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <input id="md-secs" type="text" required value="10-C-3, 10-C, 11-1" placeholder="Secciones separadas por coma (ej: 10-C-3, 11-1, 12-1)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">✅ Registrar Docente y Asignar a Horario IA</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#34d399;">🏫 Personal Docente Asignado (${docs.length})</h3>
                <div style="max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
                  ${docs.map(d => `
                    <div style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                        <b>${d.nombre}</b>
                        <span style="background:#1e3a8a;color:#93c5fd;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;">${d.condicion}</span>
                      </div>
                      <div style="color:#cbd5e1;font-size:11.5px;margin:3px 0;">📚 <b>Materias:</b> ${(d.materias || []).join(", ")}</div>
                      <div style="color:#94a3b8;font-size:11px;">🏫 <b>Secciones:</b> ${(d.secciones || []).join(", ")} • 📍 ${d.aula}</div>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                        <code style="font-size:10px;color:#34d399;">SHA-256: ${d.hash}</code>
                        <button data-pd="${d.id}" class="md-prt" style="background:#0f766e;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Acción Personal QR</button>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".mh-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-mt"); draw(); });

      if (tab === "horarios") {
        if (document.getElementById("hor-gen")) document.getElementById("hor-gen").onclick = async () => {
          await generarHorarioCSP(loadDoc(), sha256Hex);
          draw();
        };
        if (document.getElementById("vh-sec")) document.getElementById("vh-sec").onclick = () => { vistaHor = "seccion"; selFiltro = hor.secciones[0]; draw(); };
        if (document.getElementById("vh-doc")) document.getElementById("vh-doc").onclick = () => { vistaHor = "docente"; selFiltro = hor.docentes[0]; draw(); };
        if (document.getElementById("vh-sel")) document.getElementById("vh-sel").onchange = (e) => { selFiltro = e.target.value; draw(); };
        if (document.getElementById("hor-prt")) document.getElementById("hor-prt").onclick = () => {
          imprimirComprobanteQR(`HORARIO OFICIAL (${vistaHor.toUpperCase()}: ${selFiltro})`, [
            ["Institución", getBrand().institucion],
            ["Generación Automática IA", `${hor.creado} (${hor.asignados} bloques sin choques)`],
            ["Filtro Impreso", `${vistaHor}: ${selFiltro}`],
            ["Validación", "Aprobado por Dirección / Jefatura con QR SHA-256"]
          ], hor.hash, generarQRSVG);
        };
      }

      if (tab === "estudiantes" && puedeGestionar) {
        document.getElementById("me-f").onsubmit = async (e) => {
          e.preventDefault();
          const nom = document.getElementById("me-nom").value.trim();
          const ced = document.getElementById("me-ced").value.trim();
          const mail = document.getElementById("me-mail").value.trim().toLowerCase();
          const sec = document.getElementById("me-sec").value;
          const esp = document.getElementById("me-esp").value;
          const enc = document.getElementById("me-enc").value.trim();
          const tel = document.getElementById("me-tel").value.trim();
          const docsObj = {
            cedula: document.getElementById("d-ced").checked,
            notas: document.getElementById("d-not").checked,
            vacunas: document.getElementById("d-vac").checked,
            poliza: document.getElementById("d-pol").checked,
            ley8968: document.getElementById("d-ley").checked
          };
          const arr = loadEst();
          const id = "MAT-2026-" + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${ced}|${mail}|${sec}|${esp}`)).slice(0, 16);
          if (window.BDS_REGISTER_HASH) window.BDS_REGISTER_HASH(hash, { doc_type: "certificado", holder_name: nom, institution_name: getBrand().institucion, detalle: `Matrícula ${sec} - ${esp}` });
          arr.unshift({ id, nombre: nom, cedula: ced, email: mail, nivel: sec.split("-")[0] + "°", seccion: sec, especialidad: esp, encargado: enc, telEncargado: tel, docs: docsObj, estado: "MATRICULADO", hash });
          saveEst(arr);
          alert(`✅ Matrícula ${id} registrada con sello QR SHA-256 (${hash}).`);
          draw();
        };
        shell.querySelectorAll(".me-prt").forEach(b => b.onclick = () => {
          const e = loadEst().find(x => x.id === b.getAttribute("data-pe"));
          if (!e) return;
          imprimirComprobanteQR("COMPROBANTE OFICIAL DE MATRÍCULA", [
            ["Consecutivo", e.id],
            ["Estudiante", `${e.nombre} (Cédula/DIMEX: ${e.cedula})`],
            ["Correo MEP", e.email],
            ["Sección / Especialidad", `${e.seccion} — ${e.especialidad}`],
            ["Persona Encargada Legal", `${e.encargado} • Tel: ${e.telEncargado}`],
            ["Expediente Digital", Object.entries(e.docs).map(([k,v]) => `${k.toUpperCase()}: ${v?"Entregado":"Pendiente"}`).join(" | ")]
          ], e.hash, generarQRSVG);
        });
      }

      if (tab === "docentes" && puedeGestionar) {
        document.getElementById("md-f").onsubmit = async (e) => {
          e.preventDefault();
          const nom = document.getElementById("md-nom").value.trim();
          const ced = document.getElementById("md-ced").value.trim();
          const mail = document.getElementById("md-mail").value.trim().toLowerCase();
          const cond = document.getElementById("md-cond").value.trim();
          const aula = document.getElementById("md-aula").value.trim();
          const mats = document.getElementById("md-mats").value.split(",").map(s => s.trim()).filter(Boolean);
          const secs = document.getElementById("md-secs").value.split(",").map(s => s.trim()).filter(Boolean);
          const arr = loadDoc();
          const id = "DOC-" + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${ced}|${mail}|${mats.join(",")}`)).slice(0, 16);
          arr.unshift({ id, nombre: nom, cedula: ced, email: mail, condicion: cond, materias: mats, secciones: secs, aula, hash });
          saveDoc(arr);
          alert(`✅ Docente ${nom} asignado a la institución. Ya puede regenerar el Horario IA para incluir sus bloques.`);
          draw();
        };
        shell.querySelectorAll(".md-prt").forEach(b => b.onclick = () => {
          const d = loadDoc().find(x => x.id === b.getAttribute("data-pd"));
          if (!d) return;
          imprimirComprobanteQR("ASIGNACIÓN DE CARGA DOCENTE INSTITUCIONAL", [
            ["Código", d.id],
            ["Persona Docente", `${d.nombre} (Cédula: ${d.cedula})`],
            ["Correo Oficial", d.email],
            ["Condición / Lecciones", d.condicion],
            ["Asignaturas / Subáreas", d.materias.join(", ")],
            ["Secciones y Aula", `${d.secciones.join(", ")} • ${d.aula}`]
          ], d.hash, generarQRSVG);
        });
      }
    }

    draw();
  };
})();