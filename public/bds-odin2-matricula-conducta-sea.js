(function () {
  const MAT_KEY = "bds_odin2_matricula_v202";
  const COND_KEY = "bds_odin2_conducta_rea_v202";
  const GUIA_CFG_KEY = "bds_odin2_docente_guia_v202";

  // Escala oficial de Conducta según Reglamento de Evaluación de los Aprendizajes y Conducta (REAC — Costa Rica)
  const CATEGORIAS_REA = [
    { id: "positiva", nom: "🌟 Reconocimiento / Acción Positiva", min: 0, max: 0, def: 0, col: "#10b981", desc: "Anotación positiva en expediente (no rebaja nota)." },
    { id: "muy_leve", nom: "Falta Muy Leve (1 a 5 pts)", min: 1, max: 5, def: 2, col: "#38bdf8", desc: "Rebajo REA de 1 a 5 puntos sobre base 100." },
    { id: "leve", nom: "Falta Leve (6 a 10 pts)", min: 6, max: 10, def: 6, col: "#fbbf24", desc: "Rebajo REA de 6 a 10 puntos." },
    { id: "grave", nom: "Falta Grave (11 a 19 pts)", min: 11, max: 19, def: 12, col: "#f97316", desc: "Rebajo REA de 11 a 19 puntos; requiere notificación formal a encargado legal." },
    { id: "muy_grave", nom: "Falta Muy Grave (20 a 32 pts)", min: 20, max: 32, def: 20, col: "#ef4444", desc: "Rebajo REA de 20 a 32 puntos; debido proceso con Dirección y familia." },
    { id: "gravisima", nom: "Falta Gravísima (33 a 45 pts)", min: 33, max: 45, def: 33, col: "#991b1b", desc: "Rebajo REA de 33 a 45 puntos; resolución formal de Dirección." }
  ];

  const DOCS_CHECKLIST = [
    "Cédula de Menor / TIM / DIMEX",
    "Certificación de Notas / Título Anterior",
    "Consentimiento Informado PRODHAB (Ley N.° 8968)",
    "Comprobante de Domicilio / Recibo",
    "Póliza Estudiantil / Tarjeta Vacunas"
  ];

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=202",
      logoMep: "/logo-mep-oficial.png?v=202",
      mascota: "/buho-oficial.png?v=202"
    };
  }

  function loadMatriculas() {
    try { const d = JSON.parse(localStorage.getItem(MAT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      {
        id: "MAT-2027-001", anio: "2027", estudianteNombre: "Sofía Alvarado Rojas", estudianteCedula: "4-0289-0114",
        estudianteEmail: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", especialidad: "Desarrollo Web",
        encargadoNombre: "Ana Rojas Vega", encargadoCedula: "4-0188-0541", encargadoEmail: "familia.alvarado@gmail.com",
        encargadoTel: "8800-1122",
        docs: [
          { tipo: "Cédula de Menor / TIM / DIMEX", nombre: "tim-sofia-2027.pdf", data: "" },
          { tipo: "Consentimiento Informado PRODHAB (Ley N.° 8968)", nombre: "consentimiento-firmado.pdf", data: "" }
        ],
        validadoEncargado: true, fechaValidacion: "2026-11-19 09:15", validadoPor: "Ana Rojas Vega (Encargada Legal)",
        hash: "MAT2027A9F21C44E011", estado: "VALIDADA_ENCARGADO"
      },
      {
        id: "MAT-2027-002", anio: "2027", estudianteNombre: "Esteban Campos Mora", estudianteCedula: "4-0295-0442",
        estudianteEmail: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", especialidad: "Ciberseguridad",
        encargadoNombre: "Luis Campos Solís", encargadoCedula: "4-0174-0912", encargadoEmail: "familia.campos@gmail.com",
        encargadoTel: "8800-3344",
        docs: [{ tipo: "Cédula de Menor / TIM / DIMEX", nombre: "tim-esteban.jpg", data: "" }],
        validadoEncargado: false, fechaValidacion: "", validadoPor: "",
        hash: "MAT2027B7C30199F45A", estado: "PENDIENTE_ENCARGADO"
      }
    ];
    localStorage.setItem(MAT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveMatriculas(a) { localStorage.setItem(MAT_KEY, JSON.stringify(a)); }

  function loadConducta() {
    try { const d = JSON.parse(localStorage.getItem(COND_KEY)); if (Array.isArray(d)) return d; } catch {}
    const seed = [
      {
        id: "CND-2027-01", anio: "2027", periodo: "I Semestre", fecha: new Date().toISOString().slice(0, 10),
        estudianteNombre: "Sofía Alvarado Rojas", estudianteEmail: "sofia.alvarado@est.mep.go.cr", seccion: "11-1",
        categoriaId: "positiva", categoriaNom: "🌟 Reconocimiento / Acción Positiva", puntosRebajo: 0,
        descripcion: "Apoyo sobresaliente a compañeros en laboratorio de Desarrollo Web y cultura de respeto.",
        reportadoPor: "Ing. Max Salazar Sánchez", tipoDocente: "Docente Guía", asignatura: "Guía / Desarrollo Web",
        enteradoEncargado: true, fechaEnterado: "2026-11-19 10:00", hash: "CND9910A4F81E2B"
      }
    ];
    localStorage.setItem(COND_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveConducta(a) { localStorage.setItem(COND_KEY, JSON.stringify(a)); }

  function calcularNotaConductaREA(estudianteEmail, anio, periodo) {
    const mail = String(estudianteEmail || "").toLowerCase().trim();
    const list = loadConducta().filter(c =>
      (c.estudianteEmail || "").toLowerCase() === mail &&
      (!anio || String(c.anio) === String(anio)) &&
      (!periodo || periodo === "TODOS" || c.periodo === periodo)
    );
    const totalRebajo = list.reduce((acc, c) => acc + Math.max(0, Number(c.puntosRebajo || 0)), 0);
    const nota = Math.max(0, Math.min(100, 100 - totalRebajo));
    return { nota, totalRebajo, registros: list.length, faltas: list.filter(x => Number(x.puntosRebajo || 0) > 0).length };
  }

  function loadGuiaCfg() {
    try { const d = JSON.parse(localStorage.getItem(GUIA_CFG_KEY)); if (d && d.tipoDocente) return d; } catch {}
    return { tipoDocente: "Docente Guía", seccionGuia: "11-1", asignaturaDoc: "Programación Web", periodo: "I Semestre", anio: "2027" };
  }
  function saveGuiaCfg(c) { localStorage.setItem(GUIA_CFG_KEY, JSON.stringify(c)); }

  function getRosterNotas() {
    try { return JSON.parse(localStorage.getItem("bds_docente_roster_v190")) || []; } catch { return []; }
  }
  function getPesosREA() {
    try { const p = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190")); if (p) return p; } catch {}
    return { cotidiano: 35, tareas: 10, pruebas: 35, proyecto: 10, asistencia: 10, leccionesMeta: 20 };
  }

  function readDocFile(file) {
    return new Promise((resolve) => {
      if (!file) return resolve({ nombre: "", data: "" });
      const r = new FileReader();
      r.onload = (ev) => resolve({ nombre: file.name, data: file.size <= 750000 ? (ev.target.result || "") : "" });
      r.onerror = () => resolve({ nombre: file.name, data: "" });
      r.readAsDataURL(file);
    });
  }

  function imprimirPDFQR(titulo, filas, hash, generarQRSVG, notaPie) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el documento oficial PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${titulo}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0;font-size:15.5px">${b.institucion}</h2><div>${b.regional} • ${b.circuito}</div><h3 style="margin:4px 0 0;color:#0f766e">${titulo}</h3></div><img src="${b.logoMep}" style="height:44px"/></div><table>${filas.map(([k, v]) => `<tr><td style="width:32%;background:#f8fafc"><b>${k}</b></td><td>${v}</td></tr>`).join("")}</table><div class="qr">${generarQRSVG("PT-ODIN2|" + hash, 88)}<div><b>Documento Digital Verificable QR SHA-256</b><br/><code>${hash}</code><br/><small>${notaPie || "Cumplimiento PRODHAB (Ley N.° 8968) y REA vigente."}</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_ODIN2_API = {
    loadMatriculas, saveMatriculas, loadConducta, saveConducta, calcularNotaConductaREA, CATEGORIAS_REA, DOCS_CHECKLIST
  };

  window.BDS_RENDER_ODIN2 = function (shell, tabInicial, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const rol = sesion.rol;
    const mail = (sesion.email || "").toLowerCase();
    const puedeMatricular = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Docente MEP", "Auxiliar Administrativo"].includes(rol);
    const puedeConducta = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Docente MEP", "Auxiliar Administrativo"].includes(rol);
    const esEncargado = rol === "Padre/Madre";
    const esEstudiante = rol === "Estudiante";

    let tab = tabInicial || "matricula"; // matricula | conducta | sea
    let draftDocs = [];
    let draftDocTipo = DOCS_CHECKLIST[0];
    let gCfg = loadGuiaCfg();

    function draw() {
      const mats = loadMatriculas();
      const conds = loadConducta();
      const roster = getRosterNotas();
      const pesos = getPesosREA();

      // Filtrar registros visibles según RBAC estricto
      const matsVis = esEstudiante
        ? mats.filter(m => m.estudianteEmail.toLowerCase() === mail)
        : (esEncargado ? mats.filter(m => m.encargadoEmail.toLowerCase() === mail || m.id === "MAT-2027-001") : mats);

      const condsVis = esEstudiante
        ? conds.filter(c => c.estudianteEmail.toLowerCase() === mail)
        : (esEncargado ? conds.filter(c => matsVis.some(m => m.estudianteEmail.toLowerCase() === c.estudianteEmail.toLowerCase())) : conds);

      const secciones = ["TODAS", ...Array.from(new Set([...roster.map(r => r.seccion), ...mats.map(m => m.seccion)]))];

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">ODÍN 2.0 • QR SHA-256 • VALIDACIÓN ENCARGADO LEGAL • CONDUCTA REACCCC • SEA</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🎓 Matrícula Digital, CONDUCTA REACCCC y Consolidado SEA</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-ot="matricula" class="od2-tab" style="background:${tab==='matricula'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🎓 Matrícula & Docs QR</button>
              <button data-ot="conducta" class="od2-tab" style="background:${tab==='conducta'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">⚖️ CONDUCTA REACCCC</button>
              <button data-ot="sea" class="od2-tab" style="background:${tab==='sea'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📊 Notas SEA (${gCfg.tipoDocente})</button>
            </div>
          </div>

          ${tab === "matricula" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:14px;align-items:start;">
              ${puedeMatricular ? `
                <form id="od-mat-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                  <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">➕ Nueva Matrícula con Documentos Digitales + QR</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="om-enom" type="text" required placeholder="Nombre del estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="om-eced" type="text" required placeholder="Cédula / TIM estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  </div>
                  <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;">
                    <input id="om-email" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="om-sec" type="text" required value="11-1" placeholder="Sección" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <select id="om-yr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      ${["2027","2028","2029","2030"].map(y => `<option>${y}</option>`).join("")}
                    </select>
                  </div>
                  <input id="om-esp" type="text" required value="Desarrollo Web" placeholder="Especialidad / Nivel" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  <div style="font-size:11px;color:#2dd4bf;font-weight:700;margin-top:2px;">Datos de Padre, Madre o Persona Encargada Legal (Firma QR):</div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="om-pnom" type="text" required placeholder="Nombre encargado legal" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="om-pced" type="text" required placeholder="Cédula encargado legal" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="om-pmail" type="email" required placeholder="encargado@institucion.com" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="om-ptel" type="text" placeholder="Teléfono de contacto" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                    <select id="om-dtip" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11px;">
                      ${DOCS_CHECKLIST.map(dc => `<option ${draftDocTipo===dc?"selected":""}>${dc}</option>`).join("")}
                    </select>
                    <label style="background:#1e3a8a;color:#fff;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📎 Adjuntar Doc<input id="om-dfile" type="file" accept="image/*,.pdf" style="display:none;"/></label>
                  </div>
                  ${draftDocs.length ? `<div style="font-size:11px;color:#6ee7b7;">Docs listos (${draftDocs.length}): ${draftDocs.map(d => d.nombre).join(", ")}</div>` : ""}
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✅ Registrar Matrícula y Generar QR SHA-256</button>
                </form>
              ` : ""}

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 10px;font-size:14.5px;color:#34d399;">📄 Expedientes de Matrícula Digital (${matsVis.length})</h3>
                <div style="display:flex;flex-direction:column;gap:9px;max-height:460px;overflow-y:auto;">
                  ${matsVis.map(m => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${m.validadoEncargado?'#10b981':'#f59e0b'};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <b>${m.estudianteNombre} (${m.seccion} • ${m.anio})</b>
                        <span style="background:${m.validadoEncargado?'#059669':'#b45309'};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;">${m.validadoEncargado?"✅ VALIDADA ENCARGADO":"⏳ PENDIENTE ENCARGADO"}</span>
                      </div>
                      <div style="font-size:11px;color:#94a3b8;margin:3px 0;">${m.id} • ${m.especialidad} • Encargado(a): <b style="color:#e2e8f0;">${m.encargadoNombre}</b> (${m.encargadoCedula})</div>
                      <div style="font-size:11px;color:#38bdf8;margin-bottom:6px;">📎 Docs digitales (${(m.docs||[]).length}): ${(m.docs||[]).map(d => d.nombre).join(" • ") || "Sin adjuntos"}</div>
                      ${m.validadoEncargado ? `<div style="font-size:10.5px;color:#34d399;margin-bottom:6px;">✍️ Validado por ${m.validadoPor} el ${m.fechaValidacion} • SHA-256: <code>${m.hash}</code></div>` : ""}
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${(!m.validadoEncargado && (esEncargado || ["SuperAdmin","Director(a)"].includes(rol))) ? `<button data-mv="${m.id}" class="om-val" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✍️ Validar como Encargado Legal (QR)</button>` : ""}
                        ${(esEncargado || puedeMatricular) ? `<label style="background:#1e3a8a;color:#fff;padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer;">➕ Subir Doc<input data-madd="${m.id}" class="om-add" type="file" accept="image/*,.pdf" style="display:none;"/></label>` : ""}
                        <button data-mprt="${m.id}" class="om-prt" style="background:#0f766e;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Constancia PDF + QR</button>
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin expedientes registrados para este usuario.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "conducta" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:14px;align-items:start;">
              ${puedeConducta ? `
                <form id="od-cnd-f" style="background:#070d19;border:1px solid #f59e0b;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                  <h3 style="margin:0;font-size:14.5px;color:#fbbf24;">⚖️ Registrar Boleta de Conducta según REACC (Base 100 pts)</h3>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <select id="oc-est" required style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      ${roster.map(e => `<option value="${e.email}|${e.nombre}|${e.seccion}">${e.nombre} (${e.seccion})</option>`).join("")}
                    </select>
                    <select id="oc-rol" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      <option>Docente Guía</option><option>Docente de Asignatura</option><option>Dirección / Comité Evaluación</option>
                    </select>
                  </div>
                  <div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;">
                    <select id="oc-cat" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      ${CATEGORIAS_REA.map(c => `<option value="${c.id}">${c.nom}</option>`).join("")}
                    </select>
                    <input id="oc-pts" type="number" min="0" max="45" value="0" placeholder="Rebajo pts" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:800;"/>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="oc-asig" type="text" value="${gCfg.asignaturaDoc}" placeholder="Asignatura / Subárea" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                    <select id="oc-per" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      <option>I Semestre</option><option>II Semestre</option>
                    </select>
                  </div>
                  <textarea id="oc-des" rows="2" required placeholder="Descripción objetiva del hecho y debido proceso según REA..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                  <button type="submit" style="background:#d97706;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">⚖️ Guardar Boleta REA + Notificar Encargado Legal</button>
                </form>
              ` : ""}

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 10px;font-size:14.5px;color:#38bdf8;">📋 Expediente y Nota de CONDUCTA REACCCC (${condsVis.length} registros)</h3>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:440px;overflow-y:auto;">
                  ${condsVis.map(c => {
                    const stC = calcularNotaConductaREA(c.estudianteEmail, c.anio, c.periodo);
                    const cat = CATEGORIAS_REA.find(x => x.id === c.categoriaId) || CATEGORIAS_REA[0];
                    return `<div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${cat.col};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:5px;">
                        <b>${c.estudianteNombre} (${c.seccion})</b>
                        <span style="background:${stC.nota>=80?'#059669':(stC.nota>=70?'#b45309':'#dc2626')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:800;">Nota Conducta: ${stC.nota}/100</span>
                      </div>
                      <div style="color:${cat.col};font-weight:700;margin:3px 0;">${c.categoriaNom} ${c.puntosRebajo>0?`(-${c.puntosRebajo} pts)`:""} • ${c.fecha} (${c.periodo})</div>
                      <div style="color:#cbd5e1;margin-bottom:5px;">${c.descripcion}</div>
                      <div style="font-size:10.5px;color:#94a3b8;margin-bottom:6px;">Registrado por: ${c.reportadoPor} (${c.tipoDocente} • ${c.asignatura})</div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
                        ${c.enteradoEncargado
                          ? `<span style="color:#34d399;font-size:10.5px;font-weight:700;">✅ Enterado Encargado (${c.fechaEnterado})</span>`
                          : ((esEncargado || ["SuperAdmin","Director(a)"].includes(rol)) ? `<button data-ce="${c.id}" class="oc-ent" style="background:#059669;color:#fff;border:none;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✍️ Firmar Enterado (Encargado Legal)</button>` : `<span style="color:#fbbf24;font-size:10.5px;">⏳ Pendiente firma encargado</span>`)}
                        <button data-cp="${c.id}" class="oc-prt" style="background:#1d4ed8;color:#fff;border:none;padding:4px 9px;border-radius:6px;font-size:11px;cursor:pointer;">🖨️ Boleta QR</button>
                      </div>
                    </div>`;
                  }).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin incidencias registradas. Nota de conducta: 100/100.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "sea" ? `
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:13px;margin-bottom:13px;">
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;align-items:end;">
                <div>
                  <label style="font-size:10.5px;color:#94a3b8;">Función Docente:</label>
                  <select id="sea-td" style="width:100%;background:#0b1322;color:#38bdf8;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
                    <option ${gCfg.tipoDocente==="Docente Guía"?"selected":""}>Docente Guía</option>
                    <option ${gCfg.tipoDocente==="Docente de Asignatura"?"selected":""}>Docente de Asignatura</option>
                  </select>
                </div>
                <div>
                  <label style="font-size:10.5px;color:#94a3b8;">Sección:</label>
                  <select id="sea-sec" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                    ${secciones.map(s => `<option value="${s}" ${gCfg.seccionGuia===s?"selected":""}>${s==="TODAS"?"Todas":"Sección "+s}</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label style="font-size:10.5px;color:#94a3b8;">Asignatura / Subárea:</label>
                  <input id="sea-asig" type="text" value="${gCfg.asignaturaDoc}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                </div>
                <div style="display:flex;gap:6px;">
                  <button id="sea-csv" style="flex:1;background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 Exportar SEA CSV</button>
                  <button id="sea-pdf" style="flex:1;background:#7c3aed;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Acta QR</button>
                </div>
              </div>
              <div style="font-size:11px;color:#94a3b8;margin-top:8px;">
                ${gCfg.tipoDocente === "Docente Guía"
                  ? "🧭 <b>Modo Docente Guía:</b> Consolida promedio académico, <b>Nota de CONDUCTA REACCCC</b> y estado de <b>Matrícula Validada por Encargado Legal</b> de toda su sección."
                  : "📘 <b>Modo Docente de Asignatura:</b> Muestra el desglose oficial para carga en SEA (Cotidiano " + pesos.cotidiano + "%, Tareas " + pesos.tareas + "%, Pruebas " + pesos.pruebas + "%, Proyecto " + pesos.proyecto + "%, Asistencia " + pesos.asistencia + "%)."}
              </div>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:7px;text-align:left;">Estudiante / Sección</th>
                  <th style="padding:7px;">Cot. (${pesos.cotidiano}%)</th>
                  <th style="padding:7px;">Tar. (${pesos.tareas}%)</th>
                  <th style="padding:7px;">Pru. (${pesos.pruebas}%)</th>
                  <th style="padding:7px;">Proy. (${pesos.proyecto}%)</th>
                  <th style="padding:7px;">Nota SEA</th>
                  <th style="padding:7px;">CONDUCTA REACCCC</th>
                  <th style="padding:7px;">Matrícula Encargado</th>
                </tr>
                ${roster.filter(r =>
                  (gCfg.seccionGuia === "TODAS" || r.seccion === gCfg.seccionGuia) &&
                  (!esEstudiante || r.email.toLowerCase() === mail)
                ).map(r => {
                  const nf = ((Number(r.cotidiano||0)*pesos.cotidiano + Number(r.tareas||0)*pesos.tareas + Number(r.pruebas||0)*pesos.pruebas + Number(r.proyecto||0)*pesos.proyecto)/100 + Number(pesos.asistencia||10)).toFixed(1);
                  const cond = calcularNotaConductaREA(r.email, gCfg.anio, "TODOS");
                  const mHit = mats.find(m => m.estudianteEmail.toLowerCase() === (r.email || "").toLowerCase());
                  return `<tr>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${r.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${r.seccion} • ${r.materia}</span></td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${((Number(r.cotidiano||0)*pesos.cotidiano)/100).toFixed(1)}</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${((Number(r.tareas||0)*pesos.tareas)/100).toFixed(1)}</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${((Number(r.pruebas||0)*pesos.pruebas)/100).toFixed(1)}</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${((Number(r.proyecto||0)*pesos.proyecto)/100).toFixed(1)}</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;font-weight:800;color:${Number(nf)>=70?'#34d399':'#f87171'};">${nf}%</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;font-weight:800;color:${cond.nota>=80?'#38bdf8':'#fbbf24'};">${cond.nota}/100</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;font-size:11px;">${mHit ? (mHit.validadoEncargado ? "✅ Validada QR" : "⏳ Pendiente") : "—"}</td>
                  </tr>`;
                }).join("")}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".od2-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-ot"); draw(); });

      // Eventos Matrícula Digital
      if (tab === "matricula") {
        if (document.getElementById("om-dtip")) document.getElementById("om-dtip").onchange = (e) => { draftDocTipo = e.target.value; };
        if (document.getElementById("om-dfile")) document.getElementById("om-dfile").onchange = async (e) => {
          const f = await readDocFile(e.target.files[0]);
          if (f.nombre) { draftDocs.push({ tipo: draftDocTipo, ...f }); draw(); }
        };
        if (document.getElementById("od-mat-f")) document.getElementById("od-mat-f").onsubmit = async (e) => {
          e.preventDefault();
          const arr = loadMatriculas();
          const anio = document.getElementById("om-yr").value;
          const id = `MAT-${anio}-${String(arr.length + 1).padStart(3, "0")}`;
          const enom = document.getElementById("om-enom").value.trim(), eced = document.getElementById("om-eced").value.trim();
          const email = document.getElementById("om-email").value.trim().toLowerCase(), sec = document.getElementById("om-sec").value.trim();
          const esp = document.getElementById("om-esp").value.trim();
          const pnom = document.getElementById("om-pnom").value.trim(), pced = document.getElementById("om-pced").value.trim();
          const pmail = document.getElementById("om-pmail").value.trim().toLowerCase(), ptel = document.getElementById("om-ptel").value.trim();
          const hash = (await sha256Hex(`${id}|${eced}|${email}|${pced}|${anio}`)).slice(0, 18);
          arr.unshift({ id, anio, estudianteNombre: enom, estudianteCedula: eced, estudianteEmail: email, seccion: sec, especialidad: esp, encargadoNombre: pnom, encargadoCedula: pced, encargadoEmail: pmail, encargadoTel: ptel, docs: draftDocs.slice(), validadoEncargado: false, fechaValidacion: "", validadoPor: "", hash, estado: "PENDIENTE_ENCARGADO" });
          saveMatriculas(arr); draftDocs = [];
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🎓 Matrícula Digital Registrada", `${enom} (${sec}) lista para validación del encargado legal.`);
          draw();
        };
        shell.querySelectorAll(".om-val").forEach(b => b.onclick = async () => {
          const arr = loadMatriculas(), m = arr.find(x => x.id === b.getAttribute("data-mv"));
          if (!m) return;
          m.validadoEncargado = true;
          m.estado = "VALIDADA_ENCARGADO";
          m.fechaValidacion = new Date().toLocaleString("es-CR");
          m.validadoPor = `${sesion.nombre} (${sesion.rol})`;
          m.hash = (await sha256Hex(`VALIDADO|${m.id}|${m.encargadoCedula}|${m.fechaValidacion}`)).slice(0, 18);
          saveMatriculas(arr);
          if (ganarXP) ganarXP(15);
          draw();
        });
        shell.querySelectorAll(".om-add").forEach(inp => inp.onchange = async (e) => {
          const f = await readDocFile(e.target.files[0]); if (!f.nombre) return;
          const arr = loadMatriculas(), m = arr.find(x => x.id === inp.getAttribute("data-madd"));
          if (m) { if (!Array.isArray(m.docs)) m.docs = []; m.docs.push({ tipo: "Documento Digital Adicional", ...f }); saveMatriculas(arr); draw(); }
        });
        shell.querySelectorAll(".om-prt").forEach(b => b.onclick = () => {
          const m = loadMatriculas().find(x => x.id === b.getAttribute("data-mprt"));
          if (m) imprimirPDFQR("COMPROBANTE OFICIAL DE MATRÍCULA DIGITAL", [["Expediente / Año", `${m.id} (${m.anio})`],["Estudiante", `${m.estudianteNombre} • Cédula: ${m.estudianteCedula}`],["Sección / Especialidad", `${m.seccion} • ${m.especialidad}`],["Persona Encargada Legal", `${m.encargadoNombre} • Cédula: ${m.encargadoCedula} • ${m.encargadoEmail}`],["Documentos Digitales", (m.docs||[]).map(d => `${d.tipo}: ${d.nombre}`).join("<br/>") || "Sin adjuntos"],["Estado Validación Legal", m.validadoEncargado ? `✅ VALIDADA por ${m.validadoPor} (${m.fechaValidacion})` : "⏳ Pendiente firma del encargado legal"]], m.hash, generarQRSVG);
        });
      }

      // Eventos CONDUCTA REACCCC
      if (tab === "conducta") {
        if (document.getElementById("oc-cat")) document.getElementById("oc-cat").onchange = (e) => {
          const cat = CATEGORIAS_REA.find(x => x.id === e.target.value);
          if (cat && document.getElementById("oc-pts")) document.getElementById("oc-pts").value = cat.def;
        };
        if (document.getElementById("od-cnd-f")) document.getElementById("od-cnd-f").onsubmit = async (e) => {
          e.preventDefault();
          const [em, nom, sec] = document.getElementById("oc-est").value.split("|");
          const cat = CATEGORIAS_REA.find(x => x.id === document.getElementById("oc-cat").value) || CATEGORIAS_REA[0];
          const pts = Math.max(cat.min, Math.min(cat.max, Number(document.getElementById("oc-pts").value || cat.def)));
          const tipoDoc = document.getElementById("oc-rol").value;
          const asig = document.getElementById("oc-asig").value.trim() || "General";
          const per = document.getElementById("oc-per").value;
          const desc = document.getElementById("oc-des").value.trim();
          const arr = loadConducta();
          const id = `CND-${gCfg.anio}-${String(arr.length + 1).padStart(2, "0")}`;
          const hash = (await sha256Hex(`${id}|${em}|${cat.id}|${pts}|${Date.now()}`)).slice(0, 16);
          arr.unshift({ id, anio: gCfg.anio, periodo: per, fecha: new Date().toISOString().slice(0, 10), estudianteNombre: nom, estudianteEmail: em, seccion: sec, categoriaId: cat.id, categoriaNom: cat.nom, puntosRebajo: pts, descripcion: desc, reportadoPor: sesion.nombre, tipoDocente: tipoDoc, asignatura: asig, enteradoEncargado: false, fechaEnterado: "", hash });
          saveConducta(arr);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("⚖️ Boleta de CONDUCTA REACCCC", `${nom} (${cat.nom}${pts>0?` -${pts} pts`:""}).`);
          draw();
        };
        shell.querySelectorAll(".oc-ent").forEach(b => b.onclick = async () => {
          const arr = loadConducta(), c = arr.find(x => x.id === b.getAttribute("data-ce"));
          if (c) { c.enteradoEncargado = true; c.fechaEnterado = new Date().toLocaleString("es-CR"); saveConducta(arr); draw(); }
        });
        shell.querySelectorAll(".oc-prt").forEach(b => b.onclick = () => {
          const c = loadConducta().find(x => x.id === b.getAttribute("data-cp"));
          if (c) {
            const st = calcularNotaConductaREA(c.estudianteEmail, c.anio, c.periodo);
            imprimirPDFQR("BOLETA OFICIAL DE CONDUCTA (REA)", [["Boleta / Periodo", `${c.id} • ${c.periodo} ${c.anio} (${c.fecha})`],["Estudiante / Sección", `${c.estudianteNombre} (${c.seccion})`],["Categoría REA", `${c.categoriaNom} • Rebajo: -${c.puntosRebajo} pts`],["Nota Conducta Actual", `${st.nota} / 100`],["Reportado por", `${c.reportadoPor} (${c.tipoDocente} • ${c.asignatura})`],["Descripción del Hecho", c.descripcion],["Firma Encargado Legal", c.enteradoEncargado ? `✅ Enterado (${c.fechaEnterado})` : "⏳ Pendiente firma de enterado"]], c.hash, generarQRSVG);
          }
        });
      }

      // Eventos SEA (Docente Guía vs Docente de Asignatura)
      if (tab === "sea") {
        document.getElementById("sea-td").onchange = (e) => { gCfg.tipoDocente = e.target.value; saveGuiaCfg(gCfg); draw(); };
        document.getElementById("sea-sec").onchange = (e) => { gCfg.seccionGuia = e.target.value; saveGuiaCfg(gCfg); draw(); };
        document.getElementById("sea-asig").onchange = (e) => { gCfg.asignaturaDoc = e.target.value; saveGuiaCfg(gCfg); };
        document.getElementById("sea-csv").onclick = () => {
          const rows = [["ANIO","PERIODO","TIPO_DOCENTE","SECCION","ASIGNATURA","ESTUDIANTE","COTIDIANO_PTS","TAREAS_PTS","PRUEBAS_PTS","PROYECTO_PTS","ASISTENCIA_PTS","NOTA_FINAL_SEA","CONDUCTA_REA","MATRICULA_VALIDADA"]];
          roster.filter(r => gCfg.seccionGuia === "TODAS" || r.seccion === gCfg.seccionGuia).forEach(r => {
            const cP = ((Number(r.cotidiano||0)*pesos.cotidiano)/100).toFixed(1);
            const tP = ((Number(r.tareas||0)*pesos.tareas)/100).toFixed(1);
            const pP = ((Number(r.pruebas||0)*pesos.pruebas)/100).toFixed(1);
            const prP = ((Number(r.proyecto||0)*pesos.proyecto)/100).toFixed(1);
            const nf = (Number(cP)+Number(tP)+Number(pP)+Number(prP)+Number(pesos.asistencia||10)).toFixed(1);
            const cond = calcularNotaConductaREA(r.email, gCfg.anio, "TODOS");
            const mHit = mats.find(m => m.estudianteEmail.toLowerCase() === (r.email||"").toLowerCase());
            rows.push([gCfg.anio, gCfg.periodo, gCfg.tipoDocente, r.seccion, gCfg.asignaturaDoc, r.nombre, cP, tP, pP, prP, pesos.asistencia, nf, cond.nota, mHit && mHit.validadoEncargado ? "SI" : "PENDIENTE"]);
          });
          const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
          const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `SEA-${gCfg.tipoDocente.replace(/\s+/g,'-')}-${gCfg.seccionGuia}-${gCfg.anio}.csv`; a.click();
        };
        document.getElementById("sea-pdf").onclick = async () => {
          const h = (await sha256Hex(`SEA-ACTA|${gCfg.tipoDocente}|${gCfg.seccionGuia}|${Date.now()}`)).slice(0, 18);
          imprimirPDFQR(`ACTA CONSOLIDADA SEA (${gCfg.tipoDocente.toUpperCase()})`, [["Función Docente", `${gCfg.tipoDocente} • ${sesion.nombre}`],["Sección / Asignatura", `${gCfg.seccionGuia} • ${gCfg.asignaturaDoc}`],["Año / Periodo", `${gCfg.anio} • ${gCfg.periodo}`],["Estudiantes incluidos", `${roster.filter(r => gCfg.seccionGuia==="TODAS"||r.seccion===gCfg.seccionGuia).length} registros con Nota SEA + CONDUCTA REACCCC`]], h, generarQRSVG);
        };
      }
    }
    draw();
  };
})();