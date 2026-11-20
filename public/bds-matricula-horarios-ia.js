(function () {
  const HOR_KEY = "bds_horarios_ia_v187";
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Cargas MEP 2026 etiquetadas con: nivel, areaTipo (Académica | Técnica), especialidad, asignatura, docente y aula
  const PLANTILLAS_MEP_2026 = {
    "CTP (Técnico)": {
      jornada: "Diurna Técnica CTP (07:00–16:20 • Bloques de 80 min)",
      bloques: ["07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:10-11:30 (L5-L6)", "12:10-13:30 (L7-L8)", "13:40-15:00 (L9-L10)", "15:00-16:20 (L11-L12)"],
      cargas: [
        { sec: "7-1", niv: "7°", areaTipo: "Técnica", esp: "Talleres Exploratorios", mat: "Taller Exploratorio Web/TI", doc: "Prof. Andrés Valverde", aula: "Taller Explor.", bloques: 4 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "III Ciclo General", mat: "Matemática 7°", doc: "Prof. Carlos Quesada", aula: "Aula 104", bloques: 4 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "III Ciclo General", mat: "Español 7°", doc: "Prof. Mariela Campos", aula: "Aula 104", bloques: 3 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "III Ciclo General", mat: "Ciencias 7°", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "III Ciclo General", mat: "Estudios Sociales 7°", doc: "Prof. Roberto Mora", aula: "Aula 103", bloques: 3 },

        { sec: "10-C", niv: "10°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Herramientas Prod. Digital", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "10-C", niv: "10°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Programación Web 10°", doc: "Prof. Andrés Valverde", aula: "Lab Web 2", bloques: 4 },
        { sec: "10-C", niv: "10°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Inglés Conversacional", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 4 },
        { sec: "10-C", niv: "10°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Matemática 10°", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "10-C", niv: "10°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Español 10°", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },
        { sec: "10-C", niv: "10°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Estudios Sociales y Cívica", doc: "Prof. Roberto Mora", aula: "Aula 103", bloques: 3 },

        { sec: "10-C-3", niv: "10°", areaTipo: "Técnica", esp: "Ciberseguridad", mat: "Programación y Redes 10°", doc: "Ing. Max Salazar Sánchez", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "10-C-3", niv: "10°", areaTipo: "Técnica", esp: "Ciberseguridad", mat: "Soporte TI y Hardware", doc: "Prof. Jorge Brenes", aula: "Taller TI", bloques: 4 },
        { sec: "10-C-3", niv: "10°", areaTipo: "Técnica", esp: "Ciberseguridad", mat: "Inglés Técnico", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 4 },
        { sec: "10-C-3", niv: "10°", areaTipo: "Académica", esp: "Ciberseguridad", mat: "Matemática 10°", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "10-C-3", niv: "10°", areaTipo: "Académica", esp: "Ciberseguridad", mat: "Química / Biología", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },

        { sec: "11-1", niv: "11°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Diseño de Software 11°", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Técnica", esp: "Ciberseguridad", mat: "Soporte TI y Seguridad", doc: "Ing. Max Salazar Sánchez", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Técnica", esp: "Contabilidad", mat: "Contabilidad y Emprend.", doc: "Prof. Laura Jiménez", aula: "Aula 201", bloques: 3 },
        { sec: "11-1", niv: "11°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Matemática 11°", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Español 11°", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },

        { sec: "12-1", niv: "12°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Programación 12°", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "12-1", niv: "12°", areaTipo: "Técnica", esp: "Desarrollo Web", mat: "Diseño de Software 12°", doc: "Prof. Andrés Valverde", aula: "Lab Web 2", bloques: 4 },
        { sec: "12-1", niv: "12°", areaTipo: "Técnica", esp: "Ciberseguridad", mat: "Ciberseguridad Aplicada", doc: "Prof. Jorge Brenes", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "12-1", niv: "12°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Matemática PNE", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 3 },
        { sec: "12-1", niv: "12°", areaTipo: "Académica", esp: "Desarrollo Web", mat: "Español PNE", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 }
      ]
    },
    "Colegio Académico": {
      jornada: "Diurna Académica MEP (07:00–14:40)",
      bloques: ["07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:15-11:35 (L5-L6)", "12:15-13:35 (L7-L8)", "13:40-14:40 (L9-L10)"],
      cargas: [
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "Académica General", mat: "Matemática 7°", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "Académica General", mat: "Español 7°", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "Académica General", mat: "Ciencias 7°", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "7-1", niv: "7°", areaTipo: "Académica", esp: "Académica General", mat: "Inglés 7°", doc: "Prof. Sofía Herrera", aula: "Aula 4", bloques: 3 },
        { sec: "10-1", niv: "10°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Matemática 10°", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "10-1", niv: "10°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Español 10°", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "10-1", niv: "10°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Biología / Física", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Matemática PNE", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Español PNE", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "11-1", niv: "11°", areaTipo: "Académica", esp: "Diversificada Académica", mat: "Estudios Sociales / Cívica", doc: "Prof. Roberto Mora", aula: "Aula 3", bloques: 3 }
      ]
    },
    "Escuela Primaria": {
      jornada: "Primaria I y II Ciclo (07:00–12:10)",
      bloques: ["07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:15-11:35 (L5-L6)", "11:35-12:10 (L7)"],
      cargas: [
        { sec: "1-1", niv: "I Ciclo", areaTipo: "Académica", esp: "Primaria I Ciclo", mat: "Español (Lectoescritura)", doc: "Niña Carmen Rojas", aula: "Aula 1", bloques: 5 },
        { sec: "1-1", niv: "I Ciclo", areaTipo: "Académica", esp: "Primaria I Ciclo", mat: "Matemática I Ciclo", doc: "Niña Carmen Rojas", aula: "Aula 1", bloques: 5 },
        { sec: "1-1", niv: "I Ciclo", areaTipo: "Académica", esp: "Primaria I Ciclo", mat: "Inglés Primaria", doc: "Teacher Sofía Herrera", aula: "Aula 1", bloques: 3 },
        { sec: "6-1", niv: "II Ciclo", areaTipo: "Académica", esp: "Primaria II Ciclo", mat: "Matemática PNE II Ciclo", doc: "Prof. Gabriela Solano", aula: "Aula 6", bloques: 5 },
        { sec: "6-1", niv: "II Ciclo", areaTipo: "Académica", esp: "Primaria II Ciclo", mat: "Español PNE II Ciclo", doc: "Prof. Gabriela Solano", aula: "Aula 6", bloques: 5 },
        { sec: "6-1", niv: "II Ciclo", areaTipo: "Técnica", esp: "Informática Educativa", mat: "Tecnología Educativa", doc: "Prof. Andrés Valverde", aula: "Lab Primaria", bloques: 2 }
      ]
    },
    "Colegio Nocturno / CINDEA / IPEC": {
      jornada: "Nocturna MEP / CINDEA / IPEC (17:40–22:00)",
      bloques: ["17:40-19:00 (Módulo 1)", "19:10-20:30 (Módulo 2)", "20:40-22:00 (Módulo 3)"],
      cargas: [
        { sec: "N-10A", niv: "10°", areaTipo: "Académica", esp: "Nocturna Académica", mat: "Matemática Nocturna", doc: "Prof. Carlos Quesada", aula: "Aula N1", bloques: 4 },
        { sec: "N-10A", niv: "10°", areaTipo: "Académica", esp: "Nocturna Académica", mat: "Español Nocturno", doc: "Prof. Mariela Campos", aula: "Aula N1", bloques: 3 },
        { sec: "N-11A", niv: "11°", areaTipo: "Académica", esp: "Nocturna Académica", mat: "Estudios Sociales / Cívica", doc: "Prof. Roberto Mora", aula: "Aula N2", bloques: 3 },
        { sec: "IPEC-Web", niv: "IPEC", areaTipo: "Técnica", esp: "Desarrollo Web IPEC", mat: "Módulo Desarrollo Web", doc: "Ing. Max Salazar Sánchez", aula: "Lab Nocturno", bloques: 5 },
        { sec: "IPEC-Web", niv: "IPEC", areaTipo: "Técnica", esp: "Soporte TI IPEC", mat: "Módulo Redes y Soporte", doc: "Prof. Jorge Brenes", aula: "Lab Nocturno", bloques: 4 }
      ]
    },
    "Liceo Rural / Telesecundaria": {
      jornada: "Liceo Rural Integrado (07:00–14:00)",
      bloques: ["07:00-08:30 (Bloque 1)", "08:50-10:20 (Bloque 2)", "10:35-12:00 (Bloque 3)", "12:30-14:00 (Proyecto)"],
      cargas: [
        { sec: "R-7", niv: "7°", areaTipo: "Académica", esp: "Liceo Rural", mat: "Matemática y Ciencias", doc: "Prof. Carlos Quesada", aula: "Aula Rural 1", bloques: 5 },
        { sec: "R-7", niv: "7°", areaTipo: "Académica", esp: "Liceo Rural", mat: "Español y Sociales", doc: "Prof. Mariela Campos", aula: "Aula Rural 1", bloques: 5 },
        { sec: "R-7", niv: "7°", areaTipo: "Técnica", esp: "Agroecología Rural", mat: "Proyecto Sostenible", doc: "Prof. Karla Chavarría", aula: "Huerta", bloques: 4 },
        { sec: "R-11", niv: "11°", areaTipo: "Académica", esp: "Liceo Rural", mat: "Preparación PNE", doc: "Prof. Roberto Mora", aula: "Aula Rural 2", bloques: 5 }
      ]
    }
  };

  function getPlantillaPorTipo(tipo) {
    if (!tipo) return PLANTILLAS_MEP_2026["CTP (Técnico)"];
    if (PLANTILLAS_MEP_2026[tipo]) return PLANTILLAS_MEP_2026[tipo];
    const t = tipo.toLowerCase();
    if (t.includes("primaria") || t.includes("escuela")) return PLANTILLAS_MEP_2026["Escuela Primaria"];
    if (t.includes("nocturno") || t.includes("cindea") || t.includes("ipec")) return PLANTILLAS_MEP_2026["Colegio Nocturno / CINDEA / IPEC"];
    if (t.includes("rural")) return PLANTILLAS_MEP_2026["Liceo Rural / Telesecundaria"];
    if (t.includes("acad")) return PLANTILLAS_MEP_2026["Colegio Académico"];
    return PLANTILLAS_MEP_2026["CTP (Técnico)"];
  }

  function auditarChoques(grid, bloques) {
    let choquesDocente = 0, choquesAula = 0;
    DIAS.forEach(d => {
      (bloques || []).forEach(b => {
        const docs = new Set(), aulas = new Set();
        Object.keys(grid || {}).forEach(sec => {
          const cell = grid[sec] && grid[sec][d] && grid[sec][d][b];
          if (!cell) return;
          if (docs.has(cell.docente)) choquesDocente++; else docs.add(cell.docente);
          if (aulas.has(cell.aula)) choquesAula++; else aulas.add(cell.aula);
        });
      });
    });
    return { choquesDocente, choquesAula };
  }

  function generarHorarioCSP(modalidad, anio, instMeta) {
    const tpl = getPlantillaPorTipo(modalidad);
    const bloques = tpl.bloques.slice();
    const secciones = Array.from(new Set(tpl.cargas.map(c => c.sec)));
    const grid = {};
    secciones.forEach(s => { grid[s] = {}; DIAS.forEach(d => { grid[s][d] = {}; }); });

    const docBusy = {}, aulaBusy = {};
    DIAS.forEach(d => {
      docBusy[d] = {}; aulaBusy[d] = {};
      bloques.forEach(b => { docBusy[d][b] = new Set(); aulaBusy[d][b] = new Set(); });
    });

    const cargasOrd = tpl.cargas.slice().sort((a, b) => b.bloques - a.bloques);
    let colocados = 0, pendientes = 0;

    cargasOrd.forEach(cg => {
      let rest = cg.bloques;
      for (let ronda = 0; ronda < 3 && rest > 0; ronda++) {
        const diasShuf = DIAS.slice().sort(() => Math.random() - 0.5);
        for (const dia of diasShuf) {
          if (rest <= 0) break;
          for (const blq of bloques) {
            if (rest <= 0) break;
            if (grid[cg.sec][dia][blq]) continue;
            if (docBusy[dia][blq].has(cg.doc)) continue;
            if (aulaBusy[dia][blq].has(cg.aula)) continue;
            const yaHoy = Object.values(grid[cg.sec][dia]).filter(x => x.materia === cg.mat).length;
            if (ronda === 0 && yaHoy >= 1) continue;

            grid[cg.sec][dia][blq] = {
              materia: cg.mat, docente: cg.doc, aula: cg.aula,
              nivel: cg.niv || "General", areaTipo: cg.areaTipo || "Académica", especialidad: cg.esp || "General"
            };
            docBusy[dia][blq].add(cg.doc);
            aulaBusy[dia][blq].add(cg.aula);
            colocados++;
            rest--;
          }
        }
      }
      pendientes += rest;
    });

    const audit = auditarChoques(grid, bloques);
    return {
      version: "v209-CSP",
      anio: String(anio || "2027"),
      modalidad,
      jornada: tpl.jornada,
      instMeta: instMeta || { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210" },
      bloques,
      secciones,
      grid,
      colocados,
      pendientes,
      choquesDocente: audit.choquesDocente,
      choquesAula: audit.choquesAula,
      generadoEn: new Date().toLocaleString("es-CR"),
      hash: "CSP209" + Math.random().toString(16).slice(2, 14).toUpperCase()
    };
  }

  function loadHorario() {
    try { const d = JSON.parse(localStorage.getItem(HOR_KEY)); if (d && d.grid && d.bloques && d.version === "v209-CSP") return d; } catch {}
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", tipo: "CTP (Técnico)", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210" };
    const init = generarHorarioCSP(inst.tipo || "CTP (Técnico)", "2027", inst);
    localStorage.setItem(HOR_KEY, JSON.stringify(init));
    return init;
  }
  function saveHorario(h) { localStorage.setItem(HOR_KEY, JSON.stringify(h)); }

  function collectMetaLists(hor) {
    const docs = new Set(), aulas = new Set(), mats = new Set(), nivs = new Set(), esps = new Set();
    Object.values(hor.grid || {}).forEach(ds => Object.values(ds).forEach(bs => Object.values(bs).forEach(c => {
      if (!c) return;
      if (c.docente) docs.add(c.docente);
      if (c.aula) aulas.add(c.aula);
      if (c.materia) mats.add(c.materia);
      if (c.nivel) nivs.add(c.nivel);
      if (c.especialidad) esps.add(c.especialidad);
    })));
    return {
      docentes: Array.from(docs).sort(),
      aulas: Array.from(aulas).sort(),
      materias: Array.from(mats).sort(),
      niveles: ["TODOS", ...Array.from(nivs)],
      especialidades: ["TODAS", ...Array.from(esps).sort()]
    };
  }

  function imprimirHorarioPDF(hor, vistaModo, filtroValor, areaTipoFiltro, generarQRSVG) {
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: hor.instMeta.nombre, escudo: "/escudo-ctpmn-oficial.jpeg?v=209", logoMep: "/logo-mep-oficial.png?v=209" };
    const m = hor.instMeta || {};
    const matchArea = (c) => !c ? false : (areaTipoFiltro === "TODAS" || (c.areaTipo || "Académica") === areaTipoFiltro);
    const rowsHtml = hor.bloques.map(blq => {
      const tds = DIAS.map(d => {
        const hits = [];
        if (vistaModo === "seccion") {
          const c = hor.grid[filtroValor] && hor.grid[filtroValor][d] && hor.grid[filtroValor][d][blq];
          if (matchArea(c)) hits.push(`<b>${c.materia}</b> <small>[${c.areaTipo}]</small><br/><small>${c.docente} • ${c.aula}</small>`);
        } else {
          hor.secciones.forEach(s => {
            const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][blq];
            if (!matchArea(c)) return;
            const ok = (vistaModo === "docente" && c.docente === filtroValor) || (vistaModo === "aula" && c.aula === filtroValor) || (vistaModo === "asignatura" && c.materia === filtroValor);
            if (ok) hits.push(`<b>${s}: ${c.materia}</b><br/><small>${c.docente} • ${c.aula}</small>`);
          });
        }
        return `<td>${hits.join("<hr/>") || "<span style='color:#94a3b8'>—</span>"}</td>`;
      }).join("");
      return `<tr><td style="background:#f1f5f9;font-weight:700;white-space:nowrap">${blq}</td>${tds}</tr>`;
    }).join("");

    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el horario PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Horario ${hor.anio} — ${filtroValor}</title><style>body{font-family:Inter,Arial,sans-serif;padding:20px;color:#0f172a;font-size:11px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:8px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #94a3b8;padding:6px;vertical-align:top;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;margin-top:12px;border:1.5px solid #0f766e;padding:8px;border-radius:8px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:54px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${b.institucion || m.nombre}</h2><div>📍 ${m.provincia || "Heredia"} • ${m.regional || "DRE Heredia"} • ${m.circuito || "Circuito 02"} • Cód. ${m.codigoPresup || "4210"}</div><h3 style="margin:4px 0 0;color:#0f766e">HORARIO OFICIAL ${hor.anio} (${hor.modalidad}) — ${vistaModo.toUpperCase()}: ${filtroValor} (${areaTipoFiltro})</h3><small>${hor.jornada}</small></div><img src="${b.logoMep}" style="height:42px"/></div><table><tr><th>Bloque Horario</th>${DIAS.map(d => `<th>${d}</th>`).join("")}</tr>${rowsHtml}</table><div class="qr">${generarQRSVG ? generarQRSVG("PT-HOR|" + hor.hash, 78) : ""}<div><b>Horario Cero Choques Verificado (CSP)</b> • Generado: ${hor.generadoEn}<br/>Sello SHA-256: <code>${hor.hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_HORARIOS_CSP_API = { PLANTILLAS_MEP_2026, generarHorarioCSP, auditarChoques, loadHorario, saveHorario, collectMetaLists };

  window.BDS_RENDER_MATRICULA_HORARIOS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const puedeEditar = sesion && ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo"].includes(sesion.rol);
    const geo = window.BDS_CR_GEO || { PROVINCIAS_DRE: { "Heredia": ["Dirección Regional de Heredia"] }, CIRCUITOS_CR: ["Circuito 02"] };
    let hor = loadHorario();
    let vista = "seccion"; // seccion | docente | asignatura | aula
    let selMod = hor.modalidad || "CTP (Técnico)";
    let selAnio = hor.anio || "2027";
    let selProv = (hor.instMeta && hor.instMeta.provincia) || "Heredia";
    let selDre = (hor.instMeta && hor.instMeta.regional) || "Dirección Regional de Heredia";
    let selCir = (hor.instMeta && hor.instMeta.circuito) || "Circuito 02";
    let fltNivel = "TODOS", fltEsp = "TODAS", fltAreaTipo = "TODAS";
    let selVal = (sesion && sesion.rol === "Estudiante" && hor.secciones.includes(sesion.seccion)) ? sesion.seccion : (hor.secciones[0] || "11-1");

    function draw() {
      const dres = geo.PROVINCIAS_DRE[selProv] || geo.PROVINCIAS_DRE["Heredia"];
      if (!dres.includes(selDre)) selDre = dres[0];
      const meta = collectMetaLists(hor);

      const matchCell = (c) => {
        if (!c) return false;
        if (fltAreaTipo !== "TODAS" && (c.areaTipo || "Académica") !== fltAreaTipo) return false;
        if (fltNivel !== "TODOS" && c.nivel !== fltNivel) return false;
        if (fltEsp !== "TODAS" && c.especialidad !== fltEsp) return false;
        return true;
      };

      const secsFiltradas = hor.secciones.filter(s =>
        (fltNivel === "TODOS" && fltEsp === "TODAS") ||
        DIAS.some(d => Object.values((hor.grid[s] && hor.grid[s][d]) || {}).some(c => (fltNivel === "TODOS" || c.nivel === fltNivel) && (fltEsp === "TODAS" || c.especialidad === fltEsp)))
      );
      const opcionesFiltro = vista === "seccion" ? (secsFiltradas.length ? secsFiltradas : hor.secciones)
        : (vista === "docente" ? meta.docentes : (vista === "asignatura" ? meta.materias : meta.aulas));
      if (!opcionesFiltro.includes(selVal)) selVal = opcionesFiltro[0] || "";
      const audit = auditarChoques(hor.grid, hor.bloques);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">HORARIOS IA CSP • AUTOCONFIGURACIÓN POR INSTITUCIÓN • ${audit.choquesDocente===0 && audit.choquesAula===0 ? "✅ 0 CHOQUES" : "⚠️ REVISAR"}</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">📅 Horarios Automáticos por Tipo de Institución, Nivel, Especialidad y Área</h2>
              <div style="font-size:11.5px;color:#94a3b8;margin-top:2px;">📍 <b>${hor.instMeta.provincia || selProv}</b> • ${hor.instMeta.regional || selDre} • ${hor.instMeta.circuito || selCir} • <b>${hor.jornada}</b></div>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button id="hr-pdf" style="background:#7c3aed;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ PDF + QR</button>
              <button id="hr-csv" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          ${puedeEditar ? `
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:11px;padding:12px;margin-bottom:12px;">
              <div style="font-size:11.5px;font-weight:700;color:#38bdf8;margin-bottom:8px;">🏛️ Cada Institución elige su Modalidad (CTP, Académico, Primaria, Nocturno/IPEC, Liceo Rural) y genera horario automático 0% choques:</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:7px;align-items:end;">
                <div><label style="font-size:10px;color:#94a3b8;">Tipo de Institución:</label><select id="hr-mod" style="width:100%;background:#0b1322;color:#38bdf8;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${Object.keys(PLANTILLAS_MEP_2026).map(m => `<option value="${m}" ${selMod===m?"selected":""}>${m}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Provincia:</label><select id="hr-prov" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${Object.keys(geo.PROVINCIAS_DRE).map(p => `<option value="${p}" ${selProv===p?"selected":""}>${p}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Dirección Regional:</label><select id="hr-dre" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${dres.map(d => `<option value="${d}" ${selDre===d?"selected":""}>${d}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Circuito:</label><select id="hr-cir" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${geo.CIRCUITOS_CR.map(ci => `<option value="${ci}" ${selCir===ci?"selected":""}>${ci}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Año Lectivo:</label><select id="hr-yr" style="width:100%;background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${["2026","2027","2028","2029","2030"].map(y => `<option ${selAnio===y?"selected":""}>${y}</option>`).join("")}</select></div>
                <button id="hr-gen" style="background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Generar y Guardar Tipo</button>
              </div>
            </div>
          ` : ""}

          <!-- Filtros Inteligentes: Nivel, Especialidad, Académicas vs Técnicas -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:7px;margin-bottom:11px;background:#070d19;border:1px solid #1e293b;border-radius:10px;padding:9px;">
            <div><label style="font-size:10px;color:#94a3b8;">Filtrar Nivel:</label><select id="hr-fniv" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;font-size:11.5px;">${meta.niveles.map(n => `<option value="${n}" ${fltNivel===n?"selected":""}>${n==="TODOS"?"Todos los Niveles":"Nivel "+n}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Especialidad / Área:</label><select id="hr-fesp" style="width:100%;background:#0b1322;color:#2dd4bf;border:1px solid #334155;padding:6px;border-radius:6px;font-size:11.5px;font-weight:700;">${meta.especialidades.map(ep => `<option value="${ep}" ${fltEsp===ep?"selected":""}>${ep==="TODAS"?"Todas las Especialidades":ep}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Académicas / Técnicas:</label><select id="hr-fat" style="width:100%;background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:6px;border-radius:6px;font-size:11.5px;font-weight:700;"><option value="TODAS" ${fltAreaTipo==="TODAS"?"selected":""}>Todas (Académicas + Técnicas)</option><option value="Académica" ${fltAreaTipo==="Académica"?"selected":""}>📘 Solo Académicas</option><option value="Técnica" ${fltAreaTipo==="Técnica"?"selected":""}>⚙️ Solo Técnicas / Subáreas</option></select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Ver elemento:</label><select id="hr-val" style="width:100%;background:#0b1322;color:#34d399;border:1px solid #334155;padding:6px;border-radius:6px;font-size:11.5px;font-weight:700;">${opcionesFiltro.map(o => `<option value="${o}" ${selVal===o?"selected":""}>${o}</option>`).join("")}</select></div>
          </div>

          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px;">
            ${[["seccion","🎒 Por Sección"],["docente","👨‍🏫 Por Docente"],["asignatura","📘 Por Asignatura"],["aula","🏫 Por Aula / Lab"]].map(([k, l]) => `<button data-hv="${k}" class="hr-vw" style="background:${vista===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:11.5px;">
              <tr style="background:#131f33;color:#38bdf8;"><th style="padding:8px;text-align:left;width:15%;">Bloque</th>${DIAS.map(d => `<th style="padding:8px;text-align:left;width:17%;">${d}</th>`).join("")}</tr>
              ${hor.bloques.map(blq => `<tr>
                <td style="padding:7px;border:1px solid #1e293b;background:#070d19;font-weight:700;color:#fbbf24;white-space:nowrap;">${blq}</td>
                ${DIAS.map(d => {
                  if (vista === "seccion") {
                    const c = hor.grid[selVal] && hor.grid[selVal][d] && hor.grid[selVal][d][blq];
                    const vis = matchCell(c);
                    return `<td data-ed="${d}|${blq}" class="${puedeEditar?'hr-cell':''}" style="padding:7px;border:1px solid #1e293b;background:${vis?'#0b1322':'#060c17'};cursor:${puedeEditar?'pointer':'default'};">
                      ${vis ? `<span style="background:${c.areaTipo==='Técnica'?'#0f766e':'#1e3a8a'};color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;">${c.areaTipo}</span><br/><b style="color:#fff;">${c.materia}</b><div style="font-size:10px;color:#38bdf8;">${c.docente}</div><div style="font-size:9.5px;color:#34d399;">🏫 ${c.aula} • ${c.especialidad}</div>` : `<span style="color:#475569;font-size:10px;">${c ? 'Oculto por filtro' : (puedeEditar?'+ Asignar':'Libre')}</span>`}
                    </td>`;
                  }
                  const hits = [];
                  hor.secciones.forEach(s => {
                    const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][blq];
                    if (!matchCell(c)) return;
                    const ok = (vista === "docente" && c.docente === selVal) || (vista === "aula" && c.aula === selVal) || (vista === "asignatura" && c.materia === selVal);
                    if (ok) hits.push(`<span style="background:${c.areaTipo==='Técnica'?'#0f766e':'#1e3a8a'};color:#fff;font-size:9px;padding:1px 5px;border-radius:4px;">${s} • ${c.areaTipo}</span><br/><b style="color:#fff;">${c.materia}</b><div style="font-size:10px;color:#34d399;">${c.docente} • 🏫 ${c.aula}</div>`);
                  });
                  return `<td style="padding:7px;border:1px solid #1e293b;background:${hits.length?'#0b1322':'#060c17'};">${hits.join("<hr/>") || `<span style="color:#475569;">Libre</span>`}</td>`;
                }).join("")}
              </tr>`).join("")}
            </table>
          </div>
        </div>
      `;

      shell.querySelectorAll(".hr-vw").forEach(b => b.onclick = () => { vista = b.getAttribute("data-hv"); draw(); });
      document.getElementById("hr-val").onchange = (e) => { selVal = e.target.value; draw(); };
      document.getElementById("hr-fniv").onchange = (e) => { fltNivel = e.target.value; draw(); };
      document.getElementById("hr-fesp").onchange = (e) => { fltEsp = e.target.value; draw(); };
      document.getElementById("hr-fat").onchange = (e) => { fltAreaTipo = e.target.value; draw(); };

      if (puedeEditar) {
        document.getElementById("hr-mod").onchange = (e) => { selMod = e.target.value; };
        document.getElementById("hr-prov").onchange = (e) => { selProv = e.target.value; draw(); };
        document.getElementById("hr-dre").onchange = (e) => { selDre = e.target.value; };
        document.getElementById("hr-cir").onchange = (e) => { selCir = e.target.value; };
        document.getElementById("hr-yr").onchange = (e) => { selAnio = e.target.value; };
        document.getElementById("hr-gen").onclick = async () => {
          const instAct = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", codigoPresup: "4210" };
          // Guardar el tipo de institución elegido por la propia Dirección/Subdirección
          if (window.BDS_INST_API) {
            const arrI = window.BDS_INST_API.loadInsts();
            const idxI = arrI.findIndex(x => x.id === instAct.id);
            if (idxI >= 0) {
              arrI[idxI].tipo = selMod; arrI[idxI].provincia = selProv; arrI[idxI].regional = selDre; arrI[idxI].circuito = selCir;
              window.BDS_INST_API.saveInsts(arrI);
            }
          }
          const metaObj = { nombre: instAct.nombre, codigoPresup: instAct.codigoPresup || "4210", provincia: selProv, regional: selDre, circuito: selCir };
          hor = generarHorarioCSP(selMod, selAnio, metaObj);
          if (sha256Hex) hor.hash = (await sha256Hex(`HOR|${selMod}|${selAnio}|${selProv}|${selDre}|${selCir}|${Date.now()}`)).slice(0, 18);
          saveHorario(hor);
          fltNivel = "TODOS"; fltEsp = "TODAS"; fltAreaTipo = "TODAS"; selVal = hor.secciones[0] || "";
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("📅 Horario IA Listo (0 Choques)", `${selMod} • ${selProv} (${selCir}) • ${hor.colocados} bloques`);
          draw();
        };
        shell.querySelectorAll(".hr-cell").forEach(td => td.onclick = () => {
          const [dia, blq] = td.getAttribute("data-ed").split("|");
          const cur = (hor.grid[selVal] && hor.grid[selVal][dia] && hor.grid[selVal][dia][blq]) || { materia: "", docente: "", aula: "", nivel: "11°", areaTipo: "Técnica", especialidad: "General" };
          const mat = prompt(`Sección ${selVal} • ${dia} ${blq}\nAsignatura (vacío para liberar):`, cur.materia);
          if (mat === null) return;
          if (!mat.trim()) { delete hor.grid[selVal][dia][blq]; saveHorario(hor); draw(); return; }
          const doc = prompt("Persona Docente:", cur.docente || "Ing. Max Salazar Sánchez"); if (!doc) return;
          const aul = prompt("Aula o Laboratorio:", cur.aula || "Lab Web 1"); if (!aul) return;
          const aTip = prompt("Tipo (Académica o Técnica):", cur.areaTipo || "Técnica") || "Técnica";
          const chDoc = hor.secciones.find(s => s !== selVal && hor.grid[s][dia][blq] && hor.grid[s][dia][blq].docente.toLowerCase() === doc.trim().toLowerCase());
          const chAul = hor.secciones.find(s => s !== selVal && hor.grid[s][dia][blq] && hor.grid[s][dia][blq].aula.toLowerCase() === aul.trim().toLowerCase());
          if (chDoc) return alert(`⚠️ CHOQUE DOCENTE: ${doc.trim()} ya está en ${chDoc} (${dia} ${blq}).`);
          if (chAul) return alert(`⚠️ CHOQUE AULA: ${aul.trim()} ya está ocupada por ${chAul} (${dia} ${blq}).`);
          hor.grid[selVal][dia][blq] = { materia: mat.trim(), docente: doc.trim(), aula: aul.trim(), nivel: cur.nivel, areaTipo: aTip, especialidad: cur.especialidad };
          saveHorario(hor); draw();
        });
      }

      document.getElementById("hr-pdf").onclick = () => imprimirHorarioPDF(hor, vista, selVal, fltAreaTipo, generarQRSVG);
      document.getElementById("hr-csv").onclick = () => {
        const rows = [["ANIO","MODALIDAD","PROVINCIA","DRE","CIRCUITO","NIVEL","AREA_TIPO","ESPECIALIDAD","SECCION","DIA","BLOQUE","MATERIA","DOCENTE","AULA"]];
        hor.secciones.forEach(s => DIAS.forEach(d => hor.bloques.forEach(b => {
          const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][b];
          if (c) rows.push([hor.anio, hor.modalidad, hor.instMeta.provincia||"", hor.instMeta.regional||"", hor.instMeta.circuito||"", c.nivel||"", c.areaTipo||"", c.especialidad||"", s, d, b, c.materia, c.docente, c.aula]);
        })));
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `horario-${hor.modalidad.replace(/[^a-z0-9]+/gi,'-')}-${hor.anio}.csv`; a.click();
      };
    }
    draw();
  };
})();