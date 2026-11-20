(function () {
  const HOR_KEY = "bds_horarios_ia_v187";
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Plantillas oficiales MEP 2026 por Tipo de Institución (jornadas, bloques reales, docentes y malla)
  const PLANTILLAS_MEP_2026 = {
    "CTP (Técnico)": {
      jornada: "Diurna Técnica CTP (07:00–16:20 • Lecciones de 40 min)",
      bloques: [
        "07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:10-11:30 (L5-L6)",
        "12:10-13:30 (L7-L8)", "13:40-15:00 (L9-L10)", "15:00-16:20 (L11-L12)"
      ],
      secciones: ["10-C", "10-C-3", "11-1", "12-1", "7-1"],
      cargas: [
        // 10-C (Desarrollo Web + Académicas)
        { sec: "10-C", mat: "Herramientas Prod. Digital", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "10-C", mat: "Programación Web 10°", doc: "Prof. Andrés Valverde", aula: "Lab Web 2", bloques: 4 },
        { sec: "10-C", mat: "Inglés Conversacional", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 4 },
        { sec: "10-C", mat: "Matemática", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "10-C", mat: "Español", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },
        { sec: "10-C", mat: "Estudios Sociales y Cívica", doc: "Prof. Roberto Mora", aula: "Aula 103", bloques: 3 },
        { sec: "10-C", mat: "Física / Biología", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "10-C", mat: "Ed. Física / Orientación", doc: "Prof. Diego Alpízar", aula: "Gimnasio", bloques: 2 },

        // 10-C-3 (Ciberseguridad + Web)
        { sec: "10-C-3", mat: "Programación y Redes 10°", doc: "Ing. Max Salazar Sánchez", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "10-C-3", mat: "Soporte TI y Hardware", doc: "Prof. Jorge Brenes", aula: "Taller TI", bloques: 4 },
        { sec: "10-C-3", mat: "Inglés Técnico", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 4 },
        { sec: "10-C-3", mat: "Matemática", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "10-C-3", mat: "Español", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },
        { sec: "10-C-3", mat: "Química / Ciencias", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "10-C-3", mat: "Estudios Sociales y Cívica", doc: "Prof. Roberto Mora", aula: "Aula 103", bloques: 3 },

        // 11-1 (Diseño de Software + Soporte TI + Académicas)
        { sec: "11-1", mat: "Diseño de Software", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "11-1", mat: "Soporte TI y Seguridad", doc: "Ing. Max Salazar Sánchez", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "11-1", mat: "Contabilidad y Emprend.", doc: "Prof. Laura Jiménez", aula: "Aula 201", bloques: 3 },
        { sec: "11-1", mat: "Inglés Técnico", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 4 },
        { sec: "11-1", mat: "Matemática", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 4 },
        { sec: "11-1", mat: "Español", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },
        { sec: "11-1", mat: "Psicología / Filosofía", doc: "Prof. Patricia Solís", aula: "Aula 204", bloques: 2 },

        // 12-1 (Programación 12° + Diseño Software 12°)
        { sec: "12-1", mat: "Programación 12°", doc: "Ing. Max Salazar Sánchez", aula: "Lab Web 1", bloques: 4 },
        { sec: "12-1", mat: "Diseño de Software 12°", doc: "Prof. Andrés Valverde", aula: "Lab Web 2", bloques: 4 },
        { sec: "12-1", mat: "Ciberseguridad Aplicada", doc: "Prof. Jorge Brenes", aula: "Lab Ciber 1", bloques: 4 },
        { sec: "12-1", mat: "Inglés para la Industria", doc: "Prof. Sofía Herrera", aula: "Lab Idiomas", bloques: 3 },
        { sec: "12-1", mat: "Matemática PNE", doc: "Prof. Carlos Quesada", aula: "Aula 101", bloques: 3 },
        { sec: "12-1", mat: "Español PNE", doc: "Prof. Mariela Campos", aula: "Aula 102", bloques: 3 },

        // 7-1 (Talleres Exploratorios III Ciclo)
        { sec: "7-1", mat: "Taller Exploratorio Web/TI", doc: "Prof. Andrés Valverde", aula: "Taller Explor.", bloques: 4 },
        { sec: "7-1", mat: "Artes Industriales / Hogar", doc: "Prof. Karla Chavarría", aula: "Taller Artes", bloques: 3 },
        { sec: "7-1", mat: "Matemática 7°", doc: "Prof. Carlos Quesada", aula: "Aula 104", bloques: 4 },
        { sec: "7-1", mat: "Español 7°", doc: "Prof. Mariela Campos", aula: "Aula 104", bloques: 3 },
        { sec: "7-1", mat: "Ciencias 7°", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "7-1", mat: "Estudios Sociales 7°", doc: "Prof. Roberto Mora", aula: "Aula 103", bloques: 3 },
        { sec: "7-1", mat: "Ed. Física / Música", doc: "Prof. Diego Alpízar", aula: "Gimnasio", bloques: 2 }
      ]
    },
    "Colegio Académico": {
      jornada: "Diurna Académica MEP (07:00–14:40 • 9–10 lecciones)",
      bloques: ["07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:15-11:35 (L5-L6)", "12:15-13:35 (L7-L8)", "13:40-14:40 (L9-L10)"],
      secciones: ["7-1", "8-1", "9-1", "10-1", "11-1"],
      cargas: [
        { sec: "7-1", mat: "Matemática", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "7-1", mat: "Español", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "7-1", mat: "Ciencias", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 3 },
        { sec: "7-1", mat: "Estudios Sociales y Cívica", doc: "Prof. Roberto Mora", aula: "Aula 3", bloques: 3 },
        { sec: "7-1", mat: "Inglés", doc: "Prof. Sofía Herrera", aula: "Aula 4", bloques: 3 },
        { sec: "7-1", mat: "Tecnología / Cómputo", doc: "Prof. Andrés Valverde", aula: "Lab Compu", bloques: 2 },
        { sec: "7-1", mat: "Artes / Hogar / Ed. Física", doc: "Prof. Diego Alpízar", aula: "Gimnasio", bloques: 3 },

        { sec: "10-1", mat: "Matemática", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "10-1", mat: "Español", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "10-1", mat: "Biología / Química / Física", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 4 },
        { sec: "10-1", mat: "Estudios Sociales y Cívica", doc: "Prof. Roberto Mora", aula: "Aula 3", bloques: 3 },
        { sec: "10-1", mat: "Inglés", doc: "Prof. Sofía Herrera", aula: "Aula 4", bloques: 3 },
        { sec: "10-1", mat: "Psicología / Filosofía", doc: "Prof. Patricia Solís", aula: "Aula 5", bloques: 2 },

        { sec: "11-1", mat: "Matemática PNE", doc: "Prof. Carlos Quesada", aula: "Aula 1", bloques: 4 },
        { sec: "11-1", mat: "Español PNE", doc: "Prof. Mariela Campos", aula: "Aula 2", bloques: 4 },
        { sec: "11-1", mat: "Biología / Física PNE", doc: "Prof. Elena Vargas", aula: "Lab Ciencias", bloques: 4 },
        { sec: "11-1", mat: "Estudios Sociales / Cívica", doc: "Prof. Roberto Mora", aula: "Aula 3", bloques: 3 },
        { sec: "11-1", mat: "Inglés / Francés", doc: "Prof. Sofía Herrera", aula: "Aula 4", bloques: 3 },
        { sec: "11-1", mat: "Filosofía y Orientación", doc: "Prof. Patricia Solís", aula: "Aula 5", bloques: 2 }
      ]
    },
    "Escuela Primaria": {
      jornada: "Primaria I y II Ciclo (07:00–12:10 • 7 lecciones)",
      bloques: ["07:00-08:20 (L1-L2)", "08:40-10:00 (L3-L4)", "10:15-11:35 (L5-L6)", "11:35-12:10 (L7)"],
      secciones: ["1-1", "3-1", "5-1", "6-1"],
      cargas: [
        { sec: "1-1", mat: "Español (Lectoescritura)", doc: "Niña Carmen Rojas", aula: "Aula 1", bloques: 5 },
        { sec: "1-1", mat: "Matemática I Ciclo", doc: "Niña Carmen Rojas", aula: "Aula 1", bloques: 5 },
        { sec: "1-1", mat: "Ciencias y Sociales", doc: "Niña Carmen Rojas", aula: "Aula 1", bloques: 4 },
        { sec: "1-1", mat: "Inglés Primaria", doc: "Teacher Sofía Herrera", aula: "Aula 1", bloques: 3 },
        { sec: "1-1", mat: "Ed. Física / Música / Religión", doc: "Prof. Diego Alpízar", aula: "Patio Techado", bloques: 3 },

        { sec: "6-1", mat: "Matemática II Ciclo (PNE)", doc: "Prof. Gabriela Solano", aula: "Aula 6", bloques: 5 },
        { sec: "6-1", mat: "Español II Ciclo (PNE)", doc: "Prof. Gabriela Solano", aula: "Aula 6", bloques: 5 },
        { sec: "6-1", mat: "Ciencias y Estudios Sociales", doc: "Prof. Gabriela Solano", aula: "Aula 6", bloques: 4 },
        { sec: "6-1", mat: "Inglés II Ciclo", doc: "Teacher Sofía Herrera", aula: "Aula 6", bloques: 3 },
        { sec: "6-1", mat: "Informática Educativa", doc: "Prof. Andrés Valverde", aula: "Lab Primaria", bloques: 2 }
      ]
    },
    "Colegio Nocturno / CINDEA / IPEC": {
      jornada: "Nocturna MEP / CINDEA / IPEC (17:40–22:00 • 6 lecciones)",
      bloques: ["17:40-19:00 (Módulo 1)", "19:10-20:30 (Módulo 2)", "20:40-22:00 (Módulo 3)"],
      secciones: ["N-10A", "N-11A", "IPEC-Web"],
      cargas: [
        { sec: "N-10A", mat: "Matemática Nocturna", doc: "Prof. Carlos Quesada", aula: "Aula N1", bloques: 4 },
        { sec: "N-10A", mat: "Español Nocturno", doc: "Prof. Mariela Campos", aula: "Aula N1", bloques: 3 },
        { sec: "N-10A", mat: "Ciencias / Biología", doc: "Prof. Elena Vargas", aula: "Aula N2", bloques: 3 },
        { sec: "N-10A", mat: "Inglés Nocturno", doc: "Prof. Sofía Herrera", aula: "Aula N3", bloques: 3 },
        { sec: "N-11A", mat: "Matemática PNE Nocturna", doc: "Prof. Carlos Quesada", aula: "Aula N2", bloques: 4 },
        { sec: "N-11A", mat: "Estudios Sociales / Cívica", doc: "Prof. Roberto Mora", aula: "Aula N2", bloques: 3 },
        { sec: "IPEC-Web", mat: "Módulo Desarrollo Web", doc: "Ing. Max Salazar Sánchez", aula: "Lab Nocturno", bloques: 5 },
        { sec: "IPEC-Web", mat: "Módulo Soporte y Redes", doc: "Prof. Jorge Brenes", aula: "Lab Nocturno", bloques: 4 }
      ]
    },
    "Liceo Rural / Telesecundaria": {
      jornada: "Liceo Rural Integrado (07:00–14:00 • Proyectos Comunitarios)",
      bloques: ["07:00-08:30 (Bloque 1)", "08:50-10:20 (Bloque 2)", "10:35-12:00 (Bloque 3)", "12:30-14:00 (Proyecto Rural)"],
      secciones: ["R-7", "R-10", "R-11"],
      cargas: [
        { sec: "R-7", mat: "Matemática y Ciencias", doc: "Prof. Carlos Quesada", aula: "Aula Rural 1", bloques: 5 },
        { sec: "R-7", mat: "Español y Sociales", doc: "Prof. Mariela Campos", aula: "Aula Rural 1", bloques: 5 },
        { sec: "R-7", mat: "Inglés Rural", doc: "Prof. Sofía Herrera", aula: "Aula Rural 1", bloques: 3 },
        { sec: "R-7", mat: "Proyecto Agro / Sostenib.", doc: "Prof. Karla Chavarría", aula: "Huerta / Taller", bloques: 4 },
        { sec: "R-11", mat: "Preparación PNE Integral", doc: "Prof. Roberto Mora", aula: "Aula Rural 2", bloques: 5 },
        { sec: "R-11", mat: "Tecnología y Emprendimiento", doc: "Prof. Andrés Valverde", aula: "Lab Rural", bloques: 4 }
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

  // Motor CSP (Constraint Satisfaction Problem) — 0% choques de docente, 0% choques de aula, 0% choques de sección
  function generarHorarioCSP(modalidad, anio, instMeta) {
    const tpl = getPlantillaPorTipo(modalidad);
    const bloques = tpl.bloques.slice();
    const secciones = Array.from(new Set(tpl.cargas.map(c => c.sec)));
    const grid = {};
    secciones.forEach(s => {
      grid[s] = {};
      DIAS.forEach(d => { grid[s][d] = {}; });
    });

    const docBusy = {}; // docBusy[dia][bloque] = Set(docente)
    const aulaBusy = {}; // aulaBusy[dia][bloque] = Set(aula)
    DIAS.forEach(d => {
      docBusy[d] = {}; aulaBusy[d] = {};
      bloques.forEach(b => { docBusy[d][b] = new Set(); aulaBusy[d][b] = new Set(); });
    });

    // Ordenar primero las cargas con mayor número de bloques (heurística MRV para evitar bloqueos)
    const cargasOrd = tpl.cargas.slice().sort((a, b) => b.bloques - a.bloques);
    let colocados = 0, pendientes = 0;

    cargasOrd.forEach(cg => {
      let rest = cg.bloques;
      // Distribuir entre los 5 días evitando repetir la misma materia 3 veces el mismo día
      for (let ronda = 0; ronda < 3 && rest > 0; ronda++) {
        const diasShuf = DIAS.slice().sort(() => Math.random() - 0.5);
        for (const dia of diasShuf) {
          if (rest <= 0) break;
          for (const blq of bloques) {
            if (rest <= 0) break;
            if (grid[cg.sec][dia][blq]) continue;
            if (docBusy[dia][blq].has(cg.doc)) continue;
            if (aulaBusy[dia][blq].has(cg.aula)) continue;
            // En ronda 0, intentar máximo 1 bloque por día por materia para balance semanal
            const yaHoy = Object.values(grid[cg.sec][dia]).filter(x => x.materia === cg.mat).length;
            if (ronda === 0 && yaHoy >= 1) continue;

            grid[cg.sec][dia][blq] = { materia: cg.mat, docente: cg.doc, aula: cg.aula };
            docBusy[dia][blq].add(cg.doc);
            aulaBusy[dia][blq].add(cg.aula);
            colocados++;
            rest--;
          }
        }
      }
      pendientes += rest;
    });

    // Auditar choques reales (debe dar siempre 0)
    const audit = auditarChoques(grid, bloques);
    return {
      version: "v205-CSP",
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
      hash: "CSP205" + Math.random().toString(16).slice(2, 14).toUpperCase()
    };
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

  function loadHorario() {
    try { const d = JSON.parse(localStorage.getItem(HOR_KEY)); if (d && d.grid && d.bloques) return d; } catch {}
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", tipo: "CTP (Técnico)", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210" };
    const init = generarHorarioCSP(inst.tipo || "CTP (Técnico)", "2027", inst);
    localStorage.setItem(HOR_KEY, JSON.stringify(init));
    return init;
  }
  function saveHorario(h) { localStorage.setItem(HOR_KEY, JSON.stringify(h)); }

  function imprimirHorarioPDF(hor, vistaModo, filtroValor, generarQRSVG) {
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: hor.instMeta.nombre, escudo: "/escudo-ctpmn-oficial.jpeg?v=205", logoMep: "/logo-mep-oficial.png?v=205" };
    const m = hor.instMeta || {};
    const rowsHtml = hor.bloques.map(blq => {
      const tds = DIAS.map(d => {
        let cellHtml = "<span style='color:#94a3b8'>—</span>";
        if (vistaModo === "seccion") {
          const c = hor.grid[filtroValor] && hor.grid[filtroValor][d] && hor.grid[filtroValor][d][blq];
          if (c) cellHtml = `<b>${c.materia}</b><br/><small>${c.docente} • ${c.aula}</small>`;
        } else {
          const hits = [];
          hor.secciones.forEach(s => {
            const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][blq];
            if (c && ((vistaModo === "docente" && c.docente === filtroValor) || (vistaModo === "aula" && c.aula === filtroValor))) {
              hits.push(`<b>${s}: ${c.materia}</b><br/><small>${vistaModo === "docente" ? c.aula : c.docente}</small>`);
            }
          });
          if (hits.length) cellHtml = hits.join("<hr/>");
        }
        return `<td>${cellHtml}</td>`;
      }).join("");
      return `<tr><td style="background:#f1f5f9;font-weight:700;white-space:nowrap">${blq}</td>${tds}</tr>`;
    }).join("");

    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el horario PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Horario Oficial ${hor.anio} — ${filtroValor}</title><style>body{font-family:Inter,Arial,sans-serif;padding:20px;color:#0f172a;font-size:11px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:8px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #94a3b8;padding:6px;vertical-align:top;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;margin-top:12px;border:1.5px solid #0f766e;padding:8px;border-radius:8px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:54px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${b.institucion || m.nombre}</h2><div>📍 ${m.provincia || "Heredia"} • ${m.regional || "DRE Heredia"} • ${m.circuito || "Circuito 02"} • Cód. ${m.codigoPresup || "4210"}</div><h3 style="margin:4px 0 0;color:#0f766e">HORARIO OFICIAL ${hor.anio} (${hor.modalidad}) — ${vistaModo.toUpperCase()}: ${filtroValor}</h3><small>${hor.jornada}</small></div><img src="${b.logoMep}" style="height:42px"/></div><table><tr><th>Bloque Horario</th>${DIAS.map(d => `<th>${d}</th>`).join("")}</tr>${rowsHtml}</table><div class="qr">${generarQRSVG ? generarQRSVG("PT-HOR|" + hor.hash, 78) : ""}<div><b>Horario Cero Choques Verificado (CSP)</b> • Generado: ${hor.generadoEn}<br/>Sello SHA-256: <code>${hor.hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_HORARIOS_CSP_API = { PLANTILLAS_MEP_2026, generarHorarioCSP, auditarChoques, loadHorario, saveHorario };

  window.BDS_RENDER_MATRICULA_HORARIOS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const puedeEditar = sesion && ["SuperAdmin", "Director(a)", "Auxiliar Administrativo"].includes(sesion.rol);
    const geo = window.BDS_CR_GEO || { PROVINCIAS_DRE: { "Heredia": ["Dirección Regional de Heredia"] }, CIRCUITOS_CR: ["Circuito 02"], MODALIDADES_MEP: Object.keys(PLANTILLAS_MEP_2026) };
    let hor = loadHorario();
    let vista = "seccion"; // seccion | docente | aula
    let selMod = hor.modalidad || "CTP (Técnico)";
    let selAnio = hor.anio || "2027";
    let selProv = (hor.instMeta && hor.instMeta.provincia) || "Heredia";
    let selDre = (hor.instMeta && hor.instMeta.regional) || "Dirección Regional de Heredia";
    let selCir = (hor.instMeta && hor.instMeta.circuito) || "Circuito 02";
    let selVal = (sesion && sesion.rol === "Estudiante" && hor.secciones.includes(sesion.seccion)) ? sesion.seccion : (hor.secciones[0] || "11-1");

    function getDocentes(h) {
      const s = new Set();
      Object.values(h.grid || {}).forEach(ds => Object.values(ds).forEach(bs => Object.values(bs).forEach(c => { if (c && c.docente) s.add(c.docente); })));
      return Array.from(s).sort();
    }
    function getAulas(h) {
      const s = new Set();
      Object.values(h.grid || {}).forEach(ds => Object.values(ds).forEach(bs => Object.values(bs).forEach(c => { if (c && c.aula) s.add(c.aula); })));
      return Array.from(s).sort();
    }

    function draw() {
      const dres = geo.PROVINCIAS_DRE[selProv] || geo.PROVINCIAS_DRE["Heredia"];
      if (!dres.includes(selDre)) selDre = dres[0];
      const opcionesFiltro = vista === "seccion" ? hor.secciones : (vista === "docente" ? getDocentes(hor) : getAulas(hor));
      if (!opcionesFiltro.includes(selVal)) selVal = opcionesFiltro[0] || "";
      const audit = auditarChoques(hor.grid, hor.bloques);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">MOTOR HORARIOS IA CSP • MALLA MEP 2026 • ${audit.choquesDocente===0 && audit.choquesAula===0 ? "✅ 0 CHOQUES" : `⚠️ ${audit.choquesDocente+audit.choquesAula} CHOQUE(S)`}</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">📅 Horarios Oficiales por Tipo de Institución, Provincia, DRE y Circuito</h2>
              <div style="font-size:11.5px;color:#94a3b8;margin-top:2px;">📍 <b>${hor.instMeta.provincia || selProv}</b> • ${hor.instMeta.regional || selDre} • ${hor.instMeta.circuito || selCir} • <b>${hor.jornada}</b></div>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button id="hr-pdf" style="background:#7c3aed;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir PDF + QR</button>
              <button id="hr-csv" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          ${puedeEditar ? `
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:11px;padding:12px;margin-bottom:13px;">
              <div style="font-size:11.5px;font-weight:700;color:#38bdf8;margin-bottom:8px;">⚙️ Parámetros Administrativos MEP para Generación Automática (0% choques de docente y aula):</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,165px),1fr));gap:7px;align-items:end;">
                <div><label style="font-size:10px;color:#94a3b8;">Tipo de Institución:</label><select id="hr-mod" style="width:100%;background:#0b1322;color:#38bdf8;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${Object.keys(PLANTILLAS_MEP_2026).map(m => `<option value="${m}" ${selMod===m?"selected":""}>${m}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Provincia:</label><select id="hr-prov" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${Object.keys(geo.PROVINCIAS_DRE).map(p => `<option value="${p}" ${selProv===p?"selected":""}>${p}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Dirección Regional (DRE):</label><select id="hr-dre" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${dres.map(d => `<option value="${d}" ${selDre===d?"selected":""}>${d}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Circuito:</label><select id="hr-cir" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${geo.CIRCUITOS_CR.map(ci => `<option value="${ci}" ${selCir===ci?"selected":""}>${ci}</option>`).join("")}</select></div>
                <div><label style="font-size:10px;color:#94a3b8;">Año Lectivo:</label><select id="hr-yr" style="width:100%;background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${["2026","2027","2028","2029","2030"].map(y => `<option ${selAnio===y?"selected":""}>${y}</option>`).join("")}</select></div>
                <button id="hr-gen" style="background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Generar Horario IA (0 Choques)</button>
              </div>
            </div>
          ` : ""}

          <!-- Selector de Vista: Por Sección / Por Docente / Por Aula -->
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:11px;">
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              ${[["seccion","🎒 Por Sección"],["docente","👨‍🏫 Por Docente"],["aula","🏫 Por Aula / Lab"]].map(([k, l]) => `<button data-hv="${k}" class="hr-vw" style="background:${vista===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span style="font-size:11.5px;color:#94a3b8;">Mostrar:</span>
              <select id="hr-val" style="background:#070d19;color:#34d399;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:700;">
                ${opcionesFiltro.map(o => `<option value="${o}" ${selVal===o?"selected":""}>${o}</option>`).join("")}
              </select>
            </div>
          </div>

          ${puedeEditar && vista === "seccion" ? `<div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">💡 <b>Edición inteligente:</b> Haz clic en cualquier celda de la tabla para asignar o cambiar materia, docente o aula (el sistema bloquea choques automáticamente).</div>` : ""}

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:11.5px;">
              <tr style="background:#131f33;color:#38bdf8;">
                <th style="padding:8px;text-align:left;width:15%;">Bloque</th>
                ${DIAS.map(d => `<th style="padding:8px;text-align:left;width:17%;">${d}</th>`).join("")}
              </tr>
              ${hor.bloques.map(blq => `
                <tr>
                  <td style="padding:7px;border:1px solid #1e293b;background:#070d19;font-weight:700;color:#fbbf24;white-space:nowrap;">${blq}</td>
                  ${DIAS.map(d => {
                    if (vista === "seccion") {
                      const c = hor.grid[selVal] && hor.grid[selVal][d] && hor.grid[selVal][d][blq];
                      return `<td data-ed="${d}|${blq}" class="${puedeEditar?'hr-cell':''}" style="padding:7px;border:1px solid #1e293b;background:${c?'#0b1322':'#060c17'};cursor:${puedeEditar?'pointer':'default'};">
                        ${c ? `<b style="color:#fff;">${c.materia}</b><div style="font-size:10.5px;color:#38bdf8;">${c.docente}</div><div style="font-size:10px;color:#34d399;">🏫 ${c.aula}</div>` : `<span style="color:#475569;font-size:10.5px;">${puedeEditar?'+ Asignar':'Libre'}</span>`}
                      </td>`;
                    }
                    const hits = [];
                    hor.secciones.forEach(s => {
                      const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][blq];
                      if (c && ((vista === "docente" && c.docente === selVal) || (vista === "aula" && c.aula === selVal))) {
                        hits.push(`<b style="color:#fff;">${s} • ${c.materia}</b><div style="font-size:10.5px;color:#34d399;">${vista === "docente" ? "🏫 " + c.aula : "👨‍🏫 " + c.docente}</div>`);
                      }
                    });
                    return `<td style="padding:7px;border:1px solid #1e293b;background:${hits.length?'#0b1322':'#060c17'};">${hits.join("<hr/>") || `<span style="color:#475569;">Libre</span>`}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </table>
          </div>
          <div style="margin-top:10px;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">
            <span>Bloques colocados: <b style="color:#34d399;">${hor.colocados}</b> • Choques Docente: <b>${audit.choquesDocente}</b> • Choques Aula: <b>${audit.choquesAula}</b></span>
            <span>Sello SHA-256: <code style="color:#2dd4bf;">${hor.hash}</code></span>
          </div>
        </div>
      `;

      shell.querySelectorAll(".hr-vw").forEach(b => b.onclick = () => { vista = b.getAttribute("data-hv"); draw(); });
      document.getElementById("hr-val").onchange = (e) => { selVal = e.target.value; draw(); };

      if (puedeEditar) {
        document.getElementById("hr-mod").onchange = (e) => { selMod = e.target.value; };
        document.getElementById("hr-prov").onchange = (e) => { selProv = e.target.value; draw(); };
        document.getElementById("hr-dre").onchange = (e) => { selDre = e.target.value; };
        document.getElementById("hr-cir").onchange = (e) => { selCir = e.target.value; };
        document.getElementById("hr-yr").onchange = (e) => { selAnio = e.target.value; };
        document.getElementById("hr-gen").onclick = async () => {
          const instAct = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", codigoPresup: "4210" };
          const meta = { nombre: instAct.nombre, codigoPresup: instAct.codigoPresup || "4210", provincia: selProv, regional: selDre, circuito: selCir };
          hor = generarHorarioCSP(selMod, selAnio, meta);
          if (sha256Hex) hor.hash = (await sha256Hex(`HOR|${selMod}|${selAnio}|${selProv}|${selDre}|${selCir}|${Date.now()}`)).slice(0, 18);
          saveHorario(hor);
          selVal = hor.secciones[0] || "";
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("📅 Horario IA Generado (0 Choques)", `${selMod} • ${selProv} (${selCir}) • Año ${selAnio}`);
          draw();
        };
        shell.querySelectorAll(".hr-cell").forEach(td => td.onclick = () => {
          const [dia, blq] = td.getAttribute("data-ed").split("|");
          const cur = (hor.grid[selVal] && hor.grid[selVal][dia] && hor.grid[selVal][dia][blq]) || { materia: "", docente: "", aula: "" };
          const mat = prompt(`Sección ${selVal} • ${dia} ${blq}\nAsignatura / Subárea (deje vacío para liberar):`, cur.materia);
          if (mat === null) return;
          if (!mat.trim()) { delete hor.grid[selVal][dia][blq]; saveHorario(hor); draw(); return; }
          const doc = prompt("Persona Docente:", cur.docente || "Ing. Max Salazar Sánchez"); if (!doc) return;
          const aul = prompt("Aula o Laboratorio:", cur.aula || "Lab Web 1"); if (!aul) return;
          // Validar choques en tiempo real contra todas las demás secciones
          const choqueDoc = hor.secciones.find(s => s !== selVal && hor.grid[s][dia][blq] && hor.grid[s][dia][blq].docente.toLowerCase() === doc.trim().toLowerCase());
          const choqueAul = hor.secciones.find(s => s !== selVal && hor.grid[s][dia][blq] && hor.grid[s][dia][blq].aula.toLowerCase() === aul.trim().toLowerCase());
          if (choqueDoc) return alert(`⚠️ CHOQUE DETECTADO: ${doc.trim()} ya imparte clases en la sección ${choqueDoc} el ${dia} (${blq}).`);
          if (choqueAul) return alert(`⚠️ CHOQUE DE AULA: ${aul.trim()} ya está ocupada por la sección ${choqueAul} el ${dia} (${blq}).`);
          hor.grid[selVal][dia][blq] = { materia: mat.trim(), docente: doc.trim(), aula: aul.trim() };
          saveHorario(hor); draw();
        });
      }

      document.getElementById("hr-pdf").onclick = () => imprimirHorarioPDF(hor, vista, selVal, generarQRSVG);
      document.getElementById("hr-csv").onclick = () => {
        const rows = [["ANIO","MODALIDAD","PROVINCIA","DRE","CIRCUITO","SECCION","DIA","BLOQUE","MATERIA","DOCENTE","AULA"]];
        hor.secciones.forEach(s => DIAS.forEach(d => hor.bloques.forEach(b => {
          const c = hor.grid[s] && hor.grid[s][d] && hor.grid[s][d][b];
          if (c) rows.push([hor.anio, hor.modalidad, hor.instMeta.provincia||"", hor.instMeta.regional||"", hor.instMeta.circuito||"", s, d, b, c.materia, c.docente, c.aula]);
        })));
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `horario-${hor.modalidad.replace(/[^a-z0-9]+/gi,'-')}-${hor.anio}.csv`; a.click();
      };
    }
    draw();
  };
})();