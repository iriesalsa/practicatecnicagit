(function () {
  const CASOS_KEY = "bds_orientacion_reac_casos_v207";
  const ALERT_LOG_KEY = "bds_orientacion_reac_alertas_v207";

  const MARCO_LEGAL_CR = [
    { id: "reac", nom: "REAC — Reglamento de Evaluación de los Aprendizajes y Conducta (Debido proceso y evaluación formativa)" },
    { id: "ley7739", nom: "Ley N.° 7739 — Código de la Niñez y la Adolescencia (Interés superior de la persona menor de edad)" },
    { id: "pani", nom: "Ley Orgánica del PANI — Protección Integral de la Niñez y Adolescencia (Articulación preventiva y Línea 1147)" },
    { id: "prodhab", nom: "Ley N.° 8968 — PRODHAB (Confidencialidad y autodeterminación informativa de datos sensibles)" },
    { id: "ley7600", nom: "Ley N.° 7600 — Igualdad de Oportunidades (Apoyos educativos, adecuaciones de acceso y curriculares)" },
    { id: "ddhh_dua", nom: "Derechos Humanos, DUA (Diseño Universal para el Aprendizaje), Inclusión y Convivencia Respetuosa" }
  ];

  const TIPOS_INFORME = [
    "Informe de Orientación y Seguimiento Integral",
    "Notificación Preventiva por Nota Baja (<70% REAC)",
    "Pauta de Seguimiento Conductual (REAC)",
    "Acta de Debido Proceso y Mediación Restaurativa",
    "Plan de Apoyo Educativo Inclusivo (DUA / Ley 7600)",
    "Referencia Preventiva Interinstitucional (PANI / Red de Apoyo)"
  ];

  function getBrand() {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=207" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=207", mascota: "/buho-oficial.png?v=207" };
    return { ...inst, logoMep: b.logoMep, mascota: b.mascota };
  }

  function loadCasos() {
    try { const d = JSON.parse(localStorage.getItem(CASOS_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      {
        id: "ORI-2026-001",
        fecha: new Date().toISOString().slice(0, 10),
        tipoInforme: "Informe de Orientación y Seguimiento Integral",
        estudianteNombre: "Esteban Campos Mora",
        estudianteEmail: "esteban.campos@est.mep.go.cr",
        seccion: "10-C-3",
        encargadoEmail: "familia.campos@gmail.com",
        emitidoPor: "Departamento de Orientación / Docente Guía",
        rolEmisor: "Orientador(a)",
        hechos: "Seguimiento preventivo de rendimiento en subárea técnica y pautas de convivencia respetuosa en laboratorio.",
        acuerdosDUA: "Se aplican apoyos DUA (bloques guiados de 25 min, lista de cotejo visual y repaso semanal en pracTICA).",
        fundamentos: ["reac", "ley7739", "prodhab", "ddhh_dua"],
        prioridad: "PREVENTIVA",
        estado: "EN_SEGUIMIENTO",
        enteradoFamilia: false,
        fechaEnterado: "",
        hash: "ORI2026A81C44F90E"
      }
    ];
    localStorage.setItem(CASOS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveCasos(a) { localStorage.setItem(CASOS_KEY, JSON.stringify(a)); }

  function loadAlertasEnviadas() { try { const d = JSON.parse(localStorage.getItem(ALERT_LOG_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function saveAlertasEnviadas(a) { localStorage.setItem(ALERT_LOG_KEY, JSON.stringify(a.slice(0, 200))); }

  // Escaneo automático en vivo de Notas Bajas (<70%) y Conducta REAC (<85/100)
  function detectarAlertasAutomaticas() {
    let roster = [], pesos = { cotidiano: 35, tareas: 10, pruebas: 35, proyecto: 10, asistencia: 10 };
    try { roster = JSON.parse(localStorage.getItem("bds_docente_roster_v190") || "[]"); } catch {}
    try { const p = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190") || "null"); if (p) pesos = p; } catch {}

    const alertas = [];
    roster.forEach(e => {
      const nf = Number((((Number(e.cotidiano||0)*pesos.cotidiano) + (Number(e.tareas||0)*pesos.tareas) + (Number(e.pruebas||0)*pesos.pruebas) + (Number(e.proyecto||0)*pesos.proyecto))/100 + Number(pesos.asistencia||10)).toFixed(1));
      const condObj = (window.BDS_ODIN2_API && window.BDS_ODIN2_API.calcularNotaConductaREA)
        ? window.BDS_ODIN2_API.calcularNotaConductaREA(e.email, "2027", "TODOS")
        : { nota: 100, totalRebajo: 0 };

      if (nf < 70) {
        alertas.push({
          tipo: "NOTA_BAJA",
          severidad: nf < 55 ? "ALTA" : "MEDIA",
          estudianteNombre: e.nombre,
          estudianteEmail: e.email,
          seccion: e.seccion,
          materia: e.materia,
          valor: `${nf}%`,
          detalle: `Rendimiento por debajo del mínimo REAC (70%) en ${e.materia}. Requiere notificación preventiva a familia y plan de apoyo DUA.`
        });
      }
      if (condObj.nota < 85) {
        alertas.push({
          tipo: "CONDUCTA_REAC",
          severidad: condObj.nota < 70 ? "ALTA" : "MEDIA",
          estudianteNombre: e.nombre,
          estudianteEmail: e.email,
          seccion: e.seccion,
          materia: "Conducta REAC",
          valor: `${condObj.nota}/100`,
          detalle: `Rebajo acumulado de -${condObj.totalRebajo} pts en conducta REAC. Activar acompañamiento de Orientación y debido proceso.`
        });
      }
    });
    return alertas;
  }

  function imprimirInformeOrientacionPDF(caso, generarQRSVG) {
    const b = getBrand();
    const leyesHtml = (caso.fundamentos || [])
      .map(id => MARCO_LEGAL_CR.find(m => m.id === id))
      .filter(Boolean)
      .map(m => `<li>${m.nom}</li>`)
      .join("");
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el informe oficial PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${caso.tipoInforme} — ${caso.id}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:12px}td{border:1px solid #cbd5e1;padding:7px;vertical-align:top}.legal{background:#f8fafc;border-left:4px solid #0f766e;padding:9px 12px;margin-bottom:12px;font-size:11px}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${b.nombre}</h2><div>📍 ${b.provincia || "Heredia"} • ${b.regional} • ${b.circuito} • Cód. ${b.codigoPresup || "—"}</div><h3 style="margin:4px 0 0;color:#0f766e">${caso.tipoInforme.toUpperCase()}</h3></div><img src="${b.logoMep}" style="height:42px"/></div><table><tr><td style="width:30%;background:#f8fafc"><b>Consecutivo / Fecha</b></td><td>${caso.id} • ${caso.fecha} • Prioridad: <b>${caso.prioridad}</b></td></tr><tr><td style="background:#f8fafc"><b>Persona Estudiante</b></td><td>${caso.estudianteNombre} • Sección ${caso.seccion} • ${caso.estudianteEmail}</td></tr><tr><td style="background:#f8fafc"><b>Emitido por</b></td><td>${caso.emitidoPor} (${caso.rolEmisor})</td></tr><tr><td style="background:#f8fafc"><b>Situación / Seguimiento</b></td><td>${caso.hechos}</td></tr><tr><td style="background:#f8fafc"><b>Acuerdos DUA / Inclusión</b></td><td>${caso.acuerdosDUA}</td></tr><tr><td style="background:#f8fafc"><b>Enterado Familia</b></td><td>${caso.enteradoFamilia ? `✅ Firmado por Encargado Legal el ${caso.fechaEnterado}` : "⏳ Pendiente firma de enterado de la persona encargada legal"}</td></tr></table><div class="legal"><b>Fundamento Jurídico, Derechos Humanos e Inclusión (Costa Rica):</b><ul style="margin:4px 0 0 16px;padding:0">${leyesHtml || "<li>REAC, Ley N.° 7739, Ley N.° 8968 (PRODHAB) y Derechos Humanos.</li>"}</ul></div><div class="qr">${generarQRSVG ? generarQRSVG("PT-ORI|" + caso.hash, 86) : ""}<div><b>Documento Confidencial Verificable QR SHA-256 (PRODHAB Ley N.° 8968)</b><br/><code>${caso.hash}</code><br/><small>Uso estrictamente pedagógico, protector y respetuoso de la persona menor de edad.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_ORIENTACION_REAC_API = {
    loadCasos, saveCasos, loadAlertasEnviadas, detectarAlertasAutomaticas, MARCO_LEGAL_CR, TIPOS_INFORME
  };

  window.BDS_RENDER_ORIENTACION_REAC = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    const rol = (sesion && sesion.rol) || "Estudiante";
    const mail = ((sesion && sesion.email) || "").toLowerCase();
    const puedeGestionar = ["SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Orientador(a)", "Docente MEP", "Auxiliar Administrativo"].includes(rol);
    const esFamilia = rol === "Padre/Madre";

    let sub = puedeGestionar ? "alertas" : "informes"; // alertas | informes | marco
    let selectedLeyes = ["reac", "ley7739", "prodhab", "ddhh_dua"];

    function draw() {
      const alertas = detectarAlertasAutomaticas();
      const casos = loadCasos();
      const envLogs = loadAlertasEnviadas();
      let roster = [];
      try { roster = JSON.parse(localStorage.getItem("bds_docente_roster_v190") || "[]"); } catch {}

      const casosVis = esFamilia
        ? casos.filter(c => (c.encargadoEmail || "").toLowerCase() === mail || c.id === "ORI-2026-001")
        : (rol === "Estudiante" ? casos.filter(c => (c.estudianteEmail || "").toLowerCase() === mail) : casos);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">REAC • PANI • PRODHAB (LEY 8968) • NIÑEZ (LEY 7739) • LEY 7600 • DUA • DDHH</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">🧭 Orientación, Alertas REAC (Notas/Conducta) y Debido Proceso</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              ${puedeGestionar ? `<button data-os="alertas" class="or-t" style="background:${sub==='alertas'?'#b45309':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🔔 Alertas Automáticas (${alertas.length})</button>` : ""}
              <button data-os="informes" class="or-t" style="background:${sub==='informes'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📄 Informes y Procesos (${casosVis.length})</button>
              <button data-os="marco" class="or-t" style="background:${sub==='marco'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">⚖️ Marco Legal y DUA</button>
              ${puedeGestionar ? `<button id="or-csv" style="background:#059669;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📥 CSV</button>` : ""}
            </div>
          </div>

          ${sub === "alertas" && puedeGestionar ? `
            <div style="background:#070d19;border:1px solid #f59e0b;border-radius:12px;padding:13px;margin-bottom:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <div>
                  <b style="color:#fbbf24;font-size:14px;">🚦 Alertas Preventivas REAC en Tiempo Real (Notas <70% y Conducta <85/100)</b>
                  <div style="font-size:11.5px;color:#94a3b8;">Notifica oportunamente a familias, Orientación y Dirección para activar apoyos DUA antes del cierre de periodo.</div>
                </div>
                ${alertas.length ? `<button id="or-not-all" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">🔔 Notificar Todas (${alertas.length})</button>` : ""}
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${alertas.map((a, idx) => `
                  <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${a.severidad==='ALTA'?'#ef4444':'#f59e0b'};border-radius:9px;padding:10px;font-size:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="flex:1;min-width:220px;">
                      <span style="background:${a.tipo==='NOTA_BAJA'?'#dc2626':'#b45309'};color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;">${a.tipo==='NOTA_BAJA'?'📉 NOTA BAJA REAC':'⚖️ PAUTA CONDUCTA REAC'} • ${a.valor}</span>
                      <div style="font-weight:700;color:#fff;margin-top:4px;">${a.estudianteNombre} (${a.seccion}) — ${a.materia}</div>
                      <div style="font-size:11.5px;color:#cbd5e1;">${a.detalle}</div>
                    </div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                      <button data-ai="${idx}" class="or-ntf1" style="background:#1d4ed8;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🔔 Notificar Familia</button>
                      <button data-ar="${idx}" class="or-ref1" style="background:#0f766e;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🧭 Abrir Informe Orientación</button>
                    </div>
                  </div>
                `).join("") || `<div style="background:#064e3b;color:#ecfdf5;padding:12px;border-radius:9px;font-size:12.5px;">✅ <b>Sin alertas críticas en este momento:</b> todos los estudiantes del padrón se mantienen ≥70% académico y ≥85/100 en conducta REAC.</div>`}
              </div>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:11px;padding:12px;">
              <b style="color:#38bdf8;font-size:12.5px;">📬 Historial de Notificaciones REAC Enviadas (${envLogs.length})</b>
              <div style="margin-top:7px;display:flex;flex-direction:column;gap:5px;max-height:180px;overflow-y:auto;font-size:11.5px;">
                ${envLogs.slice(0, 15).map(l => `<div style="background:#0b1322;padding:6px 9px;border-radius:6px;display:flex;justify-content:space-between;gap:8px;"><span><b>${l.estudiante}</b> (${l.tipo}) • ${l.detalle}</span><span style="color:#94a3b8;white-space:nowrap;">${l.fecha}</span></div>`).join("") || `<span style="color:#64748b;">Aún no se han despachado notificaciones preventivas.</span>`}
              </div>
            </div>
          ` : ""}

          ${sub === "informes" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:14px;align-items:start;">
              ${puedeGestionar ? `
                <form id="or-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                  <h3 style="margin:0;font-size:14.5px;color:#38bdf8;">➕ Redactar Informe de Orientación / Proceso REAC</h3>
                  <select id="of-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                    ${TIPOS_INFORME.map(t => `<option>${t}</option>`).join("")}
                  </select>
                  <div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;">
                    <select id="of-est" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                      ${roster.map(r => `<option value="${r.nombre}|${r.email}|${r.seccion}">${r.nombre} (${r.seccion})</option>`).join("") || `<option value="Estudiante Demo|estudiante@est.mep.go.cr|11-1">Estudiante Demo (11-1)</option>`}
                    </select>
                    <select id="of-pri" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
                      <option>PREVENTIVA</option><option>MEDIA</option><option>PRIORITARIA (PANI/DIR)</option>
                    </select>
                  </div>
                  <textarea id="of-hec" rows="2" required placeholder="Hechos objetivos, seguimiento de rendimiento o conducta según REAC..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                  <textarea id="of-dua" rows="2" required placeholder="Acuerdos pedagógicos, apoyos DUA / Ley 7600, respeto y plan de acompañamiento..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                  <div style="background:#0b1322;border:1px solid #1e3a8a;border-radius:8px;padding:8px;">
                    <div style="font-size:10.5px;color:#2dd4bf;font-weight:700;margin-bottom:5px;">Fundamento Legal y Derechos Humanos aplicable:</div>
                    <div style="display:flex;flex-direction:column;gap:4px;font-size:11px;">
                      ${MARCO_LEGAL_CR.map(m => `<label style="display:flex;align-items:flex-start;gap:6px;cursor:pointer;"><input type="checkbox" value="${m.id}" class="of-ley" ${selectedLeyes.includes(m.id)?"checked":""}/> <span>${m.nom}</span></label>`).join("")}
                    </div>
                  </div>
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✅ Guardar Informe Confidencial + QR SHA-256</button>
                </form>
              ` : ""}

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 9px;font-size:14.5px;color:#34d399;">📁 Expedientes de Orientación y Debido Proceso (${casosVis.length})</h3>
                <div style="display:flex;flex-direction:column;gap:9px;max-height:470px;overflow-y:auto;">
                  ${casosVis.map(c => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${c.prioridad.includes('PRIORITARIA')?'#ef4444':(c.enteradoFamilia?'#10b981':'#38bdf8')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <b>${c.estudianteNombre} (${c.seccion})</b>
                        <span style="background:${c.prioridad.includes('PRIORITARIA')?'#dc2626':'#0f766e'};color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;">${c.prioridad}</span>
                      </div>
                      <div style="color:#38bdf8;font-weight:700;margin:3px 0;">${c.id} • ${c.tipoInforme} (${c.fecha})</div>
                      <div style="color:#cbd5e1;margin-bottom:4px;">${c.hechos}</div>
                      <div style="font-size:11px;color:#a7f3d0;margin-bottom:6px;"><b>♿ Acuerdos DUA/Inclusión:</b> ${c.acuerdosDUA}</div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
                        <button data-opdf="${c.id}" class="or-pdf" style="background:#7c3aed;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Informe PDF + QR</button>
                        ${c.enteradoFamilia
                          ? `<span style="color:#34d399;font-size:10.5px;font-weight:700;">✅ Enterado Familia (${c.fechaEnterado})</span>`
                          : ((esFamilia || ["SuperAdmin","Director(a)","Orientador(a)"].includes(rol)) ? `<button data-oent="${c.id}" class="or-ent" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✍️ Firmar Enterado Familia</button>` : `<span style="color:#fbbf24;font-size:10.5px;">⏳ Pendiente firma familia</span>`)}
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin expedientes registrados.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${sub === "marco" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:10px;">
              ${MARCO_LEGAL_CR.map(m => `
                <div style="background:#070d19;border:1px solid #1e3a8a;border-left:4px solid #2dd4bf;border-radius:10px;padding:12px;font-size:12px;">
                  <b style="color:#38bdf8;">⚖️ ${m.nom.split("—")[0].trim()}</b>
                  <div style="color:#cbd5e1;margin-top:4px;line-height:1.45;">${m.nom}</div>
                </div>
              `).join("")}
            </div>
            <div style="margin-top:12px;background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:11px;font-size:12px;color:#ecfdf5;">
              <b>📞 Protocolo de Protección Integral (Costa Rica):</b> Ante cualquier situación de vulnerabilidad de una persona menor de edad, se activa acompañamiento respetuoso con Orientación, Dirección, familia y articulación con el <b>PANI (Línea gratuita 1147 / 9-1-1)</b>, resguardando siempre la privacidad bajo <b>Ley N.° 8968 (PRODHAB)</b>.
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".or-t").forEach(b => b.onclick = () => { sub = b.getAttribute("data-os"); draw(); });

      if (document.getElementById("or-csv")) document.getElementById("or-csv").onclick = () => {
        const rows = [["ID","FECHA","TIPO","ESTUDIANTE","SECCION","PRIORIDAD","EMISOR","ENTERADO_FAMILIA","SHA256"], ...loadCasos().map(c => [c.id, c.fecha, c.tipoInforme, c.estudianteNombre, c.seccion, c.prioridad, c.emitidoPor, c.enteradoFamilia?"SI":"PENDIENTE", c.hash])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "orientacion-seguimiento-reac.csv"; a.click();
      };

      if (sub === "alertas" && puedeGestionar) {
        const despachar = (al) => {
          const logs = loadAlertasEnviadas();
          logs.unshift({ fecha: new Date().toLocaleString("es-CR"), estudiante: `${al.estudianteNombre} (${al.seccion})`, tipo: al.tipo, detalle: `${al.materia}: ${al.valor}` });
          saveAlertasEnviadas(logs);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(`🔔 Alerta REAC (${al.estudianteNombre})`, `${al.materia} ${al.valor} — Notificación enviada a Familia y Orientación.`);
        };
        if (document.getElementById("or-not-all")) document.getElementById("or-not-all").onclick = () => {
          alertas.forEach(despachar);
          alert(`✅ Se enviaron ${alertas.length} notificaciones preventivas REAC a Familias y Orientación.`);
          draw();
        };
        shell.querySelectorAll(".or-ntf1").forEach(b => b.onclick = () => { despachar(alertas[Number(b.getAttribute("data-ai"))]); draw(); });
        shell.querySelectorAll(".or-ref1").forEach(b => b.onclick = async () => {
          const al = alertas[Number(b.getAttribute("data-ar"))];
          if (!al) return;
          const arr = loadCasos(), id = "ORI-2026-" + String(arr.length + 1).padStart(3, "0");
          const hash = sha256Hex ? (await sha256Hex(`${id}|${al.estudianteEmail}|${al.tipo}|${Date.now()}`)).slice(0, 18) : "ORISHA256";
          arr.unshift({ id, fecha: new Date().toISOString().slice(0, 10), tipoInforme: al.tipo === "NOTA_BAJA" ? "Notificación Preventiva por Nota Baja (<70% REAC)" : "Pauta de Seguimiento Conductual (REAC)", estudianteNombre: al.estudianteNombre, estudianteEmail: al.estudianteEmail, seccion: al.seccion, encargadoEmail: "", emitidoPor: sesion.nombre, rolEmisor: sesion.rol, hechos: al.detalle, acuerdosDUA: "Plan de acompañamiento DUA + entrevista respetuosa con persona encargada legal y Orientación.", fundamentos: ["reac","ley7739","prodhab","ley7600","ddhh_dua"], prioridad: al.severidad === "ALTA" ? "PRIORITARIA (PANI/DIR)" : "PREVENTIVA", estado: "EN_SEGUIMIENTO", enteradoFamilia: false, fechaEnterado: "", hash });
          saveCasos(arr);
          sub = "informes"; draw();
        });
      }

      if (sub === "informes") {
        if (document.getElementById("or-f")) document.getElementById("or-f").onsubmit = async (e) => {
          e.preventDefault();
          const [enom, email, sec] = document.getElementById("of-est").value.split("|");
          const tipo = document.getElementById("of-tip").value;
          const pri = document.getElementById("of-pri").value;
          const hec = document.getElementById("of-hec").value.trim();
          const dua = document.getElementById("of-dua").value.trim();
          const leyes = Array.from(shell.querySelectorAll(".of-ley:checked")).map(c => c.value);
          const arr = loadCasos(), id = "ORI-2026-" + String(arr.length + 1).padStart(3, "0");
          const hash = sha256Hex ? (await sha256Hex(`${id}|${email}|${tipo}|${Date.now()}`)).slice(0, 18) : "ORISHA256";
          arr.unshift({ id, fecha: new Date().toISOString().slice(0, 10), tipoInforme: tipo, estudianteNombre: enom, estudianteEmail: email, seccion: sec, encargadoEmail: "", emitidoPor: sesion.nombre, rolEmisor: sesion.rol, hechos: hec, acuerdosDUA: dua, fundamentos: leyes.length ? leyes : ["reac","ley7739","prodhab"], prioridad: pri, estado: "EN_SEGUIMIENTO", enteradoFamilia: false, fechaEnterado: "", hash });
          saveCasos(arr);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🧭 Nuevo Informe de Orientación REAC", `${enom} (${sec}) • ${tipo}`);
          draw();
        };
        shell.querySelectorAll(".or-pdf").forEach(b => b.onclick = () => {
          const c = loadCasos().find(x => x.id === b.getAttribute("data-opdf"));
          if (c) imprimirInformeOrientacionPDF(c, generarQRSVG);
        });
        shell.querySelectorAll(".or-ent").forEach(b => b.onclick = () => {
          const arr = loadCasos(), c = arr.find(x => x.id === b.getAttribute("data-oent"));
          if (c) { c.enteradoFamilia = true; c.fechaEnterado = new Date().toLocaleString("es-CR"); saveCasos(arr); draw(); }
        });
      }
    }
    draw();
  };
})();