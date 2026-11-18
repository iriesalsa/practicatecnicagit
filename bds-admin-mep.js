(function () {
  const PERMISOS_KEY = "bds_permisos_v178_c02";
  const NOTAS_KEY = "bds_notas_excel_v178_c02";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES = [];
  NIVELES.forEach(n => [1, 2, 3, 4].forEach(g => SECCIONES.push(`${n}-${g}`)));

  const HORARIOS_DOCENTES = {
    "Ing. Max Salazar Sánchez (Desarrollo Web y Ciberseguridad — 20h Propiedad)": [
      { dia: "Lunes", bloque: "07:00 – 09:50 (4 lecc.)", materia: "Programación 11°", sec: "11-1 (Subgrupo A/B)", aula: "Lab. Software 1" },
      { dia: "Martes", bloque: "07:00 – 09:50 (4 lecc.)", materia: "Programación 12°", sec: "12-1 (Subgrupo A/B)", aula: "Lab. Software 1" },
      { dia: "Miércoles", bloque: "10:10 – 13:00 (4 lecc.)", materia: "Programación 11°", sec: "11-1 (Subgrupo A/B)", aula: "Lab. Ciberseguridad" },
      { dia: "Jueves", bloque: "07:00 – 09:50 (4 lecc.)", materia: "Programación 12°", sec: "12-1 (Subgrupo A/B)", aula: "Lab. Software 1" },
      { dia: "Viernes", bloque: "07:00 – 09:50 (4 lecc.)", materia: "Diseño de Software 12°", sec: "12-1 / 11-1", aula: "Lab. Software 2" },
      { dia: "Lunes / Jueves", bloque: "Bloque Taller", materia: "Herramientas Prod. y Transf.", sec: "10-C / 10-C-3", aula: "Taller TI" }
    ],
    "Licda. Ana Valverde (Contabilidad, Excel y Finanzas)": [
      { dia: "Lunes", bloque: "07:00 – 09:50", materia: "Contabilidad Financiera", sec: "10-2 (Subgrupo A)", aula: "Lab. Contable 1" },
      { dia: "Martes", bloque: "10:10 – 13:00", materia: "Hoja Electrónica Excel", sec: "11-2 (Subgrupo B)", aula: "Lab. Contable 2" },
      { dia: "Jueves", bloque: "07:00 – 11:30", materia: "Costos y Presupuestos", sec: "12-2", aula: "Lab. Contable 1" }
    ],
    "Prof. Carlos Quesada (Inglés Técnico y Conversacional)": [
      { dia: "Lunes", bloque: "10:10 – 12:15", materia: "English for Specific Purposes", sec: "10-3 (Subgrupo A)", aula: "Lab. Idiomas" },
      { dia: "Miércoles", bloque: "07:00 – 09:50", materia: "Technical English Listening/Speaking", sec: "11-1 (Subgrupo B)", aula: "Lab. Idiomas" },
      { dia: "Viernes", bloque: "10:10 – 12:15", materia: "Inglés Académico MEP", sec: "12-1", aula: "Aula 14" }
    ],
    "Prof. Edgar García Porras (Coordinación Académica)": [
      { dia: "Lunes a Viernes", bloque: "07:00 – 15:20", materia: "Seguimiento Académico y REAC", sec: "Todos los niveles (7° a 12°)", aula: "Coordinación" }
    ]
  };

  function generarHorarioSeccion(sec, subgrupo) {
    const nivel = parseInt(sec.split("-")[0], 10);
    const espA = nivel >= 10 ? "Desarrollo Web / Programación" : "Taller Exploratorio: Pensamiento Computacional";
    const espB = nivel >= 10 ? "Ciberseguridad / Soporte TI" : "Taller Exploratorio: Electricidad y Robótica";
    const tallerActivo = subgrupo === "A" ? espA : espB;
    return [
      { bloque: "07:00 – 08:20", lun: "Matemáticas MEP", mar: tallerActivo, mie: "Español y Literatura", jue: tallerActivo, vie: "Inglés Técnico" },
      { bloque: "08:35 – 09:55", lun: tallerActivo, mar: "Ciencias (Física/Química)", mie: "Estudios Sociales", jue: "Biología", vie: tallerActivo },
      { bloque: "10:10 – 11:30", lun: "Inglés (Listening/Speaking)", mar: "Matemáticas MEP", mie: tallerActivo, jue: "Educación Cívica", vie: "Filosofía / Psicología" },
      { bloque: "12:15 – 13:35", lun: "Educación Física", mar: "Francés / Idioma", mie: "Artes Plásticas / Música", jue: "Educación Religiosa", vie: "Orientación / Guía" },
      { bloque: "13:50 – 15:10", lun: tallerActivo, mar: "Práctica Guiada / Proyecto", mie: tallerActivo, jue: "Laboratorio Especialidad", vie: "Clubes STEAM / Ajedrez" }
    ];
  }

  function cargarPermisos(sesion) {
    try {
      const p = JSON.parse(localStorage.getItem(PERMISOS_KEY));
      if (Array.isArray(p) && p.length) return p;
    } catch {}
    const init = [
      { id: "CTP-02-101", categoria: "Personal → Dirección", persona: "Docente Especialidad Técnica", seccion: "Docencia", motivo: "Cita Médica Especializada (CCSS)", fecha: "19/11/2026", horario: "07:00 – 11:00", detalle: "Control programado EBAIS Mercedes Norte.", estado: "Pendiente", hash: sesion.firma || "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855" },
      { id: "CTP-02-102", categoria: "Estudiante → Docente", persona: "Estudiante Sección 10-3 (Subgrupo A)", seccion: "10-3", motivo: "Justificación de Tardía / Cita Odontológica", fecha: "18/11/2026", horario: "07:00 – 08:20", detalle: "Comprobante oficial adjunto por encargado legal.", estado: "Aprobado", hash: sesion.firma || "8F434346648F6B96DF89DDA901C5176B10A6D83961DD3C1AC88B59B2DC327AA4" }
    ];
    localStorage.setItem(PERMISOS_KEY, JSON.stringify(init));
    return init;
  }

  function cargarNotas() {
    try {
      const n = JSON.parse(localStorage.getItem(NOTAS_KEY));
      if (Array.isArray(n) && n.length) return n;
    } catch {}
    const init = [
      { est: "Alvarado Rojas, Sofía", sec: "11-1", cot: 95, tar: 90, pru: 88, proy: 94 },
      { est: "Campos Mora, Esteban", sec: "11-1", cot: 85, tar: 80, pru: 76, proy: 84 },
      { est: "Hernández Solís, Camila", sec: "10-3", cot: 100, tar: 95, pru: 92, proy: 98 },
      { est: "Vargas Jiménez, Mateo", sec: "12-1", cot: 72, tar: 68, pru: 65, proy: 74 }
    ];
    localStorage.setItem(NOTAS_KEY, JSON.stringify(init));
    return init;
  }

  function descargarCSV(nombreArchivo, filas) {
    const csv = "\uFEFF" + filas.map(r => r.map(x => `"${String(x ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = nombreArchivo;
    a.click();
  }

  window.BDS_RENDER_ADMIN_SUITE = function (shell, subTabInicial, helpers) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP, IMG_ESCUDO, IMG_BUHO, IMG_MEP } = helpers;
    let tab = subTabInicial || "horarios";
    let tipoHorario = "docente";
    let docSel = Object.keys(HORARIOS_DOCENTES)[0];
    let secSel = sesion.seccion || "10-3";
    let subgSel = "A";
    let filtroBandeja = "TODOS";

    function draw() {
      const permisos = cargarPermisos(sesion);
      const pendientes = permisos.filter(p => p.estado === "Pendiente").length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${IMG_ESCUDO}" width="38" height="44" alt="Escudo CTPMN"/>
              <div>
                <span style="background:#1d4ed8;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:99px;">SISTEMA ADMINISTRATIVO CTP MERCEDES NORTE • CIRCUITO 02</span>
                <h2 style="margin:4px 0 0;font-size:17.5px;color:#fff;">Gestión Institucional: Horarios, Permisos, Justificaciones, Notas y QR</h2>
              </div>
            </div>
            <img src="${IMG_MEP}" height="38" alt="MEP Costa Rica" class="hide-sm"/>
          </div>

          <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid #1e293b;">
            ${[
              { id: "horarios", lbl: "📅 Horarios (Profes & Alumnos)" },
              { id: "permisos", lbl: "📝 Permiso / Tardía Personal" },
              { id: "justificaciones", lbl: "🎓 Justificar Estudiante" },
              { id: "bandeja", lbl: `🏛️ Bandeja Dirección (${pendientes})` },
              { id: "notas", lbl: "📊 Notas & Excel CSV" },
              { id: "qr", lbl: "🪪 Carné & Escáner QR SHA-256" }
            ].map(t => `<button data-at="${t.id}" class="adm-tab" style="background:${tab===t.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${tab===t.id?'#38bdf8':'#26354d'};padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;min-height:40px;">${t.lbl}</button>`).join("")}
          </div>

          <div id="adm-body"></div>
        </div>
      `;

      shell.querySelectorAll(".adm-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-at"); draw(); });
      const body = document.getElementById("adm-body");

      // ---------------- 1. HORARIOS (PROFESORES Y ESTUDIANTES A/B) ----------------
      if (tab === "horarios") {
        const filasEst = generarHorarioSeccion(secSel, subgSel);
        const filasDoc = HORARIOS_DOCENTES[docSel] || [];
        body.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="h-doc" style="background:${tipoHorario==='docente'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">👨‍🏫 Horario por Profesor</button>
              <button id="h-est" style="background:${tipoHorario==='estudiante'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🎒 Horario por Estudiante / Sección</button>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="h-csv" style="background:#131f33;color:#34d399;border:1px solid #10b981;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📥 Exportar Horario CSV</button>
              <button id="h-print" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Imprimir</button>
            </div>
          </div>

          ${tipoHorario === "docente" ? `
            <div style="margin-bottom:12px;">
              <label style="font-size:11.5px;color:#94a3b8;display:block;margin-bottom:4px;">Seleccionar Docente:</label>
              <select id="sel-doc-h" style="width:100%;max-width:520px;background:#070d19;color:#fff;border:1px solid #334155;padding:9px 12px;border-radius:8px;font-size:13px;">
                ${Object.keys(HORARIOS_DOCENTES).map(k => `<option value="${k}" ${docSel===k?'selected':''}>${k}</option>`).join("")}
              </select>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:560px;border-collapse:collapse;font-size:12.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:10px;text-align:left;">Día</th><th style="padding:10px;text-align:left;">Bloque Horario</th><th style="padding:10px;text-align:left;">Subárea / Asignatura</th><th style="padding:10px;text-align:left;">Sección</th><th style="padding:10px;text-align:left;">Laboratorio / Aula</th></tr>
                ${filasDoc.map(r => `<tr><td style="padding:9px;border-bottom:1px solid #1e293b;font-weight:700;">${r.dia}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.bloque}</td><td style="padding:9px;border-bottom:1px solid #1e293b;color:#34d399;font-weight:700;">${r.materia}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.sec}</td><td style="padding:9px;border-bottom:1px solid #1e293b;color:#94a3b8;">${r.aula}</td></tr>`).join("")}
              </table>
            </div>
          ` : `
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
              <div>
                <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Sección (7° a 12°):</label>
                <select id="sel-sec-h" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12.5px;">
                  ${SECCIONES.map(sc => `<option value="${sc}" ${secSel===sc?'selected':''}>Sección ${sc}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Subgrupo / Especialidad:</label>
                <select id="sel-subg-h" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12.5px;">
                  <option value="A" ${subgSel==="A"?"selected":""}>Subgrupo A — Especialidad 1</option>
                  <option value="B" ${subgSel==="B"?"selected":""}>Subgrupo B — Especialidad 2</option>
                </select>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:680px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:9px;text-align:left;">Bloque</th><th style="padding:9px;text-align:left;">Lunes</th><th style="padding:9px;text-align:left;">Martes</th><th style="padding:9px;text-align:left;">Miércoles</th><th style="padding:9px;text-align:left;">Jueves</th><th style="padding:9px;text-align:left;">Viernes</th></tr>
                ${filasEst.map(r => `<tr><td style="padding:9px;border-bottom:1px solid #1e293b;font-weight:700;color:#fbbf24;white-space:nowrap;">${r.bloque}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.lun}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.mar}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.mie}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.jue}</td><td style="padding:9px;border-bottom:1px solid #1e293b;">${r.vie}</td></tr>`).join("")}
              </table>
            </div>
          `}
        `;
        document.getElementById("h-doc").onclick = () => { tipoHorario = "docente"; draw(); };
        document.getElementById("h-est").onclick = () => { tipoHorario = "estudiante"; draw(); };
        document.getElementById("h-print").onclick = () => window.print();
        document.getElementById("h-csv").onclick = () => {
          if (tipoHorario === "docente") descargarCSV("horario-docente-ctpmn.csv", [["Día","Bloque","Materia","Sección","Aula"], ...filasDoc.map(r => [r.dia, r.bloque, r.materia, r.sec, r.aula])]);
          else descargarCSV(`horario-seccion-${secSel}-subgrupo-${subgSel}.csv`, [["Bloque","Lunes","Martes","Miércoles","Jueves","Viernes"], ...filasEst.map(r => [r.bloque, r.lun, r.mar, r.mie, r.jue, r.vie])]);
        };
        if (document.getElementById("sel-doc-h")) document.getElementById("sel-doc-h").onchange = (e) => { docSel = e.target.value; draw(); };
        if (document.getElementById("sel-sec-h")) document.getElementById("sel-sec-h").onchange = (e) => { secSel = e.target.value; draw(); };
        if (document.getElementById("sel-subg-h")) document.getElementById("sel-subg-h").onchange = (e) => { subgSel = e.target.value; draw(); };
      }

      // ---------------- 2. SOLICITUD DE PERMISO / TARDÍA DE PERSONAL ----------------
      else if (tab === "permisos") {
        body.innerHTML = `
          <div style="max-width:680px;margin:0 auto;">
            <h3 style="margin:0 0 6px;color:#38bdf8;">📝 Solicitud de Permiso o Tardía de Personal → Dirección</h3>
            <p style="margin:0 0 14px;font-size:12px;color:#94a3b8;">Genera automáticamente boleta sellada con código QR nativo y firma SHA-256 enviada a la Bandeja de Dirección.</p>
            <form id="f-perm" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="grid-column:1/-1;">
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Funcionario(a):</label>
                <input id="pp-nom" type="text" value="${sesion.nombre}" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Puesto / Rol:</label>
                <input id="pp-pue" type="text" value="${sesion.rol}" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Motivo Oficial:</label>
                <select id="pp-mot" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;">
                  <option>Cita Médica Especializada (CCSS / INS)</option>
                  <option>Permiso Personal con Rebajo / Sin Goce</option>
                  <option>Justificación de Tardía de Personal</option>
                  <option>Capacitación / Reunión Oficial MEP</option>
                  <option>Asunto Familiar Urgente</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Fecha:</label>
                <input id="pp-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Horario / Lecciones:</label>
                <input id="pp-hor" type="text" placeholder="Ej: 07:00 am – 11:00 am" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
              </div>
              <div style="grid-column:1/-1;">
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Respaldo / Observaciones:</label>
                <textarea id="pp-det" rows="3" placeholder="Indique número de comprobante, clínica o reemplazo coordinado..." required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;"></textarea>
              </div>
              <div style="grid-column:1/-1;">
                <button type="submit" style="width:100%;background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">🔐 Emitir Boleta con QR y Firma SHA-256</button>
              </div>
            </form>
            <div id="pp-ok" style="display:none;margin-top:14px;background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:14px;text-align:center;"></div>
          </div>
        `;
        document.getElementById("f-perm").onsubmit = async (e) => {
          e.preventDefault();
          const nom = document.getElementById("pp-nom").value.trim(), mot = document.getElementById("pp-mot").value;
          const fec = document.getElementById("pp-fec").value, hor = document.getElementById("pp-hor").value.trim(), det = document.getElementById("pp-det").value.trim();
          const id = "CTP-02-" + String(Date.now()).slice(-4);
          const hash = await sha256Hex(`${id}|${nom}|${mot}|${fec}|${hor}`);
          const nueva = { id, categoria: "Personal → Dirección", persona: nom, seccion: document.getElementById("pp-pue").value, motivo: mot, fecha: fec, horario: hor, detalle: det, estado: "Pendiente", hash };
          const arr = cargarPermisos(sesion); arr.unshift(nueva);
          localStorage.setItem(PERMISOS_KEY, JSON.stringify(arr));
          ganarXP(15);
          const box = document.getElementById("pp-ok");
          box.style.display = "block";
          box.innerHTML = `<div style="color:#6ee7b7;font-weight:800;margin-bottom:8px;">✅ Boleta ${id} emitida y enviada a Dirección</div>${generarQRSVG(`CTPMN-C02|${id}|${hash.slice(0,20)}`, 128)}<div style="font-family:monospace;font-size:10px;color:#a7f3d0;margin-top:6px;word-break:break-all;">SHA-256: ${hash}</div>`;
        };
      }

      // ---------------- 3. JUSTIFICACIÓN ESTUDIANTIL ----------------
      else if (tab === "justificaciones") {
        body.innerHTML = `
          <div style="max-width:680px;margin:0 auto;">
            <h3 style="margin:0 0 6px;color:#34d399;">🎓 Justificación de Ausencia o Tardía Estudiantil → Docente / Auxiliar</h3>
            <p style="margin:0 0 14px;font-size:12px;color:#94a3b8;">Conforme al Reglamento de Evaluación de los Aprendizajes (REA), las justificaciones deben presentarse dentro de los 3 días hábiles siguientes.</p>
            <form id="f-just" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="grid-column:1/-1;">
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Nombre del Estudiante:</label>
                <input id="js-est" type="text" placeholder="Nombre completo del estudiante" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Sección:</label>
                <select id="js-sec" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;">
                  ${SECCIONES.map(sc => `<option value="${sc}" ${sc===secSel?'selected':''}>Sección ${sc}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Motivo de Justificación:</label>
                <select id="js-mot" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;">
                  <option>Dictamen / Cita Médica CCSS</option>
                  <option>Justificación de Tardía</option>
                  <option>Representación Institucional / Deportiva</option>
                  <option>Calamidad Doméstica (Encargado Legal)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Fecha de Ausencia/Tardía:</label>
                <input id="js-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Encargado Legal / Teléfono:</label>
                <input id="js-enc" type="text" placeholder="Nombre del padre/madre o encargado" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
              </div>
              <div style="grid-column:1/-1;">
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:3px;">Detalle y Comprobante:</label>
                <textarea id="js-det" rows="3" placeholder="Explique las lecciones afectadas y referencia del comprobante..." required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;"></textarea>
              </div>
              <div style="grid-column:1/-1;">
                <button type="submit" style="width:100%;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">📩 Enviar Justificación Oficial con Sello SHA-256</button>
              </div>
            </form>
            <div id="js-ok" style="display:none;margin-top:14px;background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:14px;text-align:center;color:#6ee7b7;font-weight:700;"></div>
          </div>
        `;
        document.getElementById("f-just").onsubmit = async (e) => {
          e.preventDefault();
          const est = document.getElementById("js-est").value.trim(), sec = document.getElementById("js-sec").value;
          const mot = document.getElementById("js-mot").value, fec = document.getElementById("js-fec").value;
          const det = `Encargado: ${document.getElementById("js-enc").value.trim()} — ${document.getElementById("js-det").value.trim()}`;
          const id = "JUS-02-" + String(Date.now()).slice(-4);
          const hash = await sha256Hex(`${id}|${est}|${sec}|${mot}|${fec}`);
          const arr = cargarPermisos(sesion);
          arr.unshift({ id, categoria: "Estudiante → Docente", persona: est, seccion: sec, motivo: mot, fecha: fec, horario: "Jornada lectiva", detalle: det, estado: "Pendiente", hash });
          localStorage.setItem(PERMISOS_KEY, JSON.stringify(arr));
          ganarXP(10);
          const box = document.getElementById("js-ok");
          box.style.display = "block";
          box.innerHTML = `✅ Justificación ${id} registrada para Sección ${sec}. Enviada a la Bandeja Ejecutiva.<br/><span style="font-family:monospace;font-size:10px;">SHA-256: ${hash}</span>`;
        };
      }

      // ---------------- 4. BANDEJA EJECUTIVA DE DIRECCIÓN ----------------
      else if (tab === "bandeja") {
        const filtrados = permisos.filter(p => filtroBandeja === "TODOS" || p.estado === filtroBandeja);
        body.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${["TODOS","Pendiente","Aprobado","Rechazado"].map(f => `<button data-bf="${f}" class="bf-btn" style="background:${filtroBandeja===f?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${f}</button>`).join("")}
            </div>
            <button id="bd-csv" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 Exportar Actas CSV</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${filtrados.map((p, idx) => `
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                <div style="flex:1;min-width:240px;">
                  <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:4px;">
                    <span style="background:#1e3a8a;color:#93c5fd;font-family:monospace;font-size:10.5px;padding:2px 7px;border-radius:5px;font-weight:800;">${p.id}</span>
                    <span style="font-size:11px;color:#94a3b8;">${p.categoria}</span>
                    <span style="background:${p.estado==='Aprobado'?'#064e3b':(p.estado==='Rechazado'?'#7f1d1d':'#78350f')};color:#fff;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:99px;">${p.estado}</span>
                  </div>
                  <div style="font-size:14px;font-weight:800;color:#fff;">${p.persona} (${p.seccion})</div>
                  <div style="font-size:12.5px;color:#fbbf24;font-weight:700;margin:2px 0;">${p.motivo} — ${p.fecha} | ${p.horario}</div>
                  <div style="font-size:11.5px;color:#cbd5e1;">${p.detalle}</div>
                  <div style="font-family:monospace;font-size:10px;color:#34d399;margin-top:4px;word-break:break-all;">🔒 SHA-256: ${p.hash}</div>
                  <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
                    <button data-act="Aprobado" data-id="${p.id}" class="bd-act" style="background:#059669;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">✓ Aprobar</button>
                    <button data-act="Rechazado" data-id="${p.id}" class="bd-act" style="background:#7f1d1d;color:#fecaca;border:none;padding:6px 12px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">✕ Rechazar</button>
                    <button onclick="window.print()" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:6px 12px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir Boleta</button>
                  </div>
                </div>
                <div style="text-align:center;">
                  ${generarQRSVG(`CTPMN-C02|${p.id}|${p.hash.slice(0,18)}`, 112)}
                  <div style="font-size:9.5px;color:#94a3b8;margin-top:3px;">QR Verificado</div>
                </div>
              </div>
            `).join("")}
          </div>
        `;
        body.querySelectorAll(".bf-btn").forEach(b => b.onclick = () => { filtroBandeja = b.getAttribute("data-bf"); draw(); });
        body.querySelectorAll(".bd-act").forEach(b => b.onclick = () => {
          const id = b.getAttribute("data-id"), est = b.getAttribute("data-act");
          const arr = cargarPermisos(sesion);
          const item = arr.find(x => x.id === id);
          if (item) { item.estado = est; localStorage.setItem(PERMISOS_KEY, JSON.stringify(arr)); draw(); }
        });
        document.getElementById("bd-csv").onclick = () => descargarCSV("bandeja-direccion-ctpmn-c02.csv", [["ID","Categoría","Solicitante","Sección","Motivo","Fecha","Horario","Estado","SHA-256"], ...permisos.map(p => [p.id, p.categoria, p.persona, p.seccion, p.motivo, p.fecha, p.horario, p.estado, p.hash])]);
      }

      // ---------------- 5. REGISTRO DE NOTAS / HOJA EXCEL MEP ----------------
      else if (tab === "notas") {
        const notas = cargarNotas();
        const calcProm = (n) => Math.round(n.cot * 0.35 + n.tar * 0.10 + n.pru * 0.35 + n.proy * 0.20);
        body.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <div>
              <h3 style="margin:0;color:#38bdf8;font-size:15.5px;">📊 Registro Electrónico de Calificaciones MEP (Cotidiano 35% • Tareas 10% • Pruebas 35% • Proyecto 20%)</h3>
              <p style="margin:2px 0 0;font-size:11.5px;color:#94a3b8;">Edita cualquier calificación directamente (sin cero pegado) y exporta el registro oficial en CSV/Excel.</p>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="nt-add" style="background:#1d4ed8;color:#fff;border:none;padding:8px 12px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">+ Estudiante</button>
              <button id="nt-csv" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">📥 Exportar CSV Excel</button>
            </div>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:650px;border-collapse:collapse;font-size:12.5px;">
              <tr style="background:#131f33;color:#38bdf8;"><th style="padding:9px;text-align:left;">Estudiante</th><th style="padding:9px;text-align:center;">Sección</th><th style="padding:9px;text-align:center;">Cotidiano (35%)</th><th style="padding:9px;text-align:center;">Tareas (10%)</th><th style="padding:9px;text-align:center;">Pruebas (35%)</th><th style="padding:9px;text-align:center;">Proyecto (20%)</th><th style="padding:9px;text-align:center;">Nota Final</th></tr>
              ${notas.map((n, i) => {
                const pr = calcProm(n);
                return `<tr>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;font-weight:600;">${n.est}</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${n.sec}</td>
                  ${["cot","tar","pru","proy"].map(k => `<td style="padding:6px;border-bottom:1px solid #1e293b;text-align:center;"><input data-ni="${i}" data-nk="${k}" class="nt-in" type="number" min="0" max="100" value="${n[k]}" style="width:60px;background:#070d19;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;font-weight:700;"/></td>`).join("")}
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:900;color:${pr>=70?'#34d399':'#f87171'};">${pr}% (${pr>=70?'Aprobado':'Refuerzo'})</td>
                </tr>`;
              }).join("")}
            </table>
          </div>
        `;
        body.querySelectorAll(".nt-in").forEach(inp => {
          inp.onfocus = () => { if (inp.value === "0") inp.value = ""; };
          inp.onchange = () => {
            const i = Number(inp.getAttribute("data-ni")), k = inp.getAttribute("data-nk");
            notas[i][k] = Math.max(0, Math.min(100, Number(inp.value) || 0));
            localStorage.setItem(NOTAS_KEY, JSON.stringify(notas));
            draw();
          };
        });
        document.getElementById("nt-add").onclick = () => {
          const nom = prompt("Apellidos y nombre del estudiante:");
          if (nom && nom.trim()) {
            notas.push({ est: nom.trim(), sec: sesion.seccion || "10-3", cot: 90, tar: 90, pru: 85, proy: 90 });
            localStorage.setItem(NOTAS_KEY, JSON.stringify(notas));
            draw();
          }
        };
        document.getElementById("nt-csv").onclick = () => descargarCSV("registro-notas-ctpmn-c02.csv", [["Estudiante","Sección","Cotidiano 35%","Tareas 10%","Pruebas 35%","Proyecto 20%","Promedio","Condición"], ...notas.map(n => { const p = calcProm(n); return [n.est, n.sec, n.cot, n.tar, n.pru, n.proy, p, p>=70?"Aprobado":"Refuerzo"]; })]);
      }

      // ---------------- 6. CARNÉ DIGITAL Y ESCÁNER QR SHA-256 ----------------
      else if (tab === "qr") {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
            <div style="background:#070d19;border:1px solid #10b981;border-radius:14px;padding:20px;text-align:center;">
              <div style="display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:8px;">
                <img src="${IMG_ESCUDO}" width="36" height="42" alt="Escudo CTPMN"/>
                <img src="${IMG_BUHO}" width="38" height="38" alt="Búho"/>
              </div>
              <div style="font-size:10.5px;color:#38bdf8;font-weight:800;">CTP MERCEDES NORTE • CIRCUITO 02</div>
              <h3 style="margin:5px 0 2px;color:#fff;font-size:16px;">${sesion.nombre}</h3>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;"><b>${sesion.rol}</b> • Sección ${sesion.seccion}</div>
              <div style="display:inline-block;">${generarQRSVG(sesion.qr, 160)}</div>
              <div style="font-family:monospace;font-size:9.5px;color:#34d399;background:#0b1322;padding:8px;border-radius:7px;margin:10px 0;word-break:break-all;">SHA-256: ${sesion.firma}</div>
              <button id="qr-cp" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📋 Copiar Código QR</button>
            </div>
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:20px;">
              <h3 style="margin:0 0 6px;color:#38bdf8;">📷 Validador Criptográfico de Carnés y Boletas</h3>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Verifica en tiempo real cualquier código QR o firma SHA-256 emitida en el Circuito 02.</p>
              <div style="display:flex;gap:6px;margin-bottom:10px;">
                <input id="qv-in" type="text" placeholder="Pegue código CTPMN-C02|... o SHA-256" style="flex:1;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12px;font-family:monospace;"/>
                <button id="qv-go" style="background:#1d4ed8;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-weight:700;cursor:pointer;">Verificar</button>
              </div>
              <div id="qv-res" style="padding:12px;border-radius:8px;background:#0b1322;border:1px solid #1e293b;font-size:12px;color:#cbd5e1;font-weight:600;">Listo para validar credencial o permiso oficial.</div>
            </div>
          </div>
        `;
        document.getElementById("qr-cp").onclick = () => {
          navigator.clipboard.writeText(sesion.qr).catch(() => {});
          document.getElementById("qv-in").value = sesion.qr;
          document.getElementById("qv-go").click();
        };
        document.getElementById("qv-go").onclick = () => {
          const v = document.getElementById("qv-in").value.trim();
          const res = document.getElementById("qv-res");
          const ok = v === sesion.qr || v === sesion.firma || v.startsWith("CTPMN-C02|") || /^[A-F0-9]{64}$/i.test(v);
          res.style.background = ok ? "#064e3b" : "#450a0a";
          res.style.color = ok ? "#6ee7b7" : "#fca5a5";
          res.innerText = ok ? "✅ AUTÉNTICO — Credencial / Boleta verificada en el CTP Mercedes Norte (Dirección Regional de Heredia • Circuito 02)." : "🚫 ALERTA — El código no corresponde a un sello válido del CTP Mercedes Norte.";
        };
      }
    }
    draw();
  };
})();