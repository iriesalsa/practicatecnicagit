(function () {
  const ROSTER_KEY = "bds_docente_roster_v190";
  const ASIST_KEY = "bds_docente_asistencia_log_v190";
  const PESOS_KEY = "bds_docente_pesos_rea_v190";

  // Escala oficial de Asistencia según Reglamento de Evaluación de los Aprendizajes (REA — Decreto 45509-MEP)
  function calcularAsistenciaREA(leccionesEfectivas, faltasInjustificadas, pesoAsistencia) {
    const ef = Math.max(1, Number(leccionesEfectivas || 1));
    const faltas = Math.max(0, Number(faltasInjustificadas || 0));
    const pct = Math.max(0, Math.min(100, ((ef - faltas) / ef) * 100));
    let escala10 = 0;
    if (pct >= 90) escala10 = 10;
    else if (pct >= 80) escala10 = 9;
    else if (pct >= 70) escala10 = 8;
    else if (pct >= 60) escala10 = 7;
    else if (pct >= 50) escala10 = 6;
    else if (pct >= 40) escala10 = 5;
    else if (pct >= 30) escala10 = 4;
    else if (pct >= 20) escala10 = 3;
    else if (pct >= 10) escala10 = 2;
    else if (pct >= 1) escala10 = 1;
    else escala10 = 0;
    const peso = Number(pesoAsistencia || 10);
    const notaPonderada = Number(((escala10 / 10) * peso).toFixed(2));
    return { pct: Number(pct.toFixed(1)), escala10, notaPonderada };
  }

  function loadRoster() {
    try { const d = JSON.parse(localStorage.getItem(ROSTER_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "EST-01", nombre: "Sofía Alvarado Rojas", cedula: "4-0289-0114", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", materia: "Diseño de Software", cotidiano: 95, tareas: 100, pruebas: 90, proyecto: 96, hash: "A9F21C44E0118B7D" },
      { id: "EST-02", nombre: "Esteban Campos Mora", cedula: "4-0295-0442", email: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", materia: "Programación Web", cotidiano: 86, tareas: 80, pruebas: 78, proyecto: 88, hash: "B7C30199F45A2D1E" },
      { id: "EST-03", nombre: "Valeria Solís Jiménez", cedula: "4-0291-0771", email: "valeria.solis@est.mep.go.cr", seccion: "11-1", materia: "Diseño de Software", cotidiano: 92, tareas: 95, pruebas: 85, proyecto: 90, hash: "C1E88421A90B33F0" },
      { id: "EST-04", nombre: "Mateo Rojas Chacón", cedula: "4-0299-0318", email: "mateo.rojas@est.mep.go.cr", seccion: "10-C", materia: "Herramientas Prod.", cotidiano: 74, tareas: 70, pruebas: 68, proyecto: 75, hash: "D2F44910A8E2110C" }
    ];
    localStorage.setItem(ROSTER_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveRoster(a) { localStorage.setItem(ROSTER_KEY, JSON.stringify(a)); }

  function loadAsist() { try { return JSON.parse(localStorage.getItem(ASIST_KEY)) || []; } catch { return []; } }
  function saveAsist(a) { localStorage.setItem(ASIST_KEY, JSON.stringify(a)); }

  function loadPesos() {
    try { const p = JSON.parse(localStorage.getItem(PESOS_KEY)); if (p && p.cotidiano !== undefined) return p; } catch {}
    const def = { cotidiano: 45, tareas: 10, pruebas: 25, proyecto: 10, asistencia: 10, leccionesMeta: 20 };
    localStorage.setItem(PESOS_KEY, JSON.stringify(def));
    return def;
  }
  function savePesos(p) { localStorage.setItem(PESOS_KEY, JSON.stringify(p)); }

  // Resumen automático de asistencia por estudiante (lecciones efectivas, AI, TI, AJ, TJ)
  function getResumenAsistencia(estId, pesos) {
    const logs = loadAsist().filter(l => l.estId === estId);
    const efectivasRegistradas = logs.reduce((acc, l) => acc + Number(l.lecciones || 1), 0);
    const leccionesEfectivas = Math.max(efectivasRegistradas, Number(pesos.leccionesMeta || 1));
    let ai = 0, ti = 0, aj = 0, p = 0;
    logs.forEach(l => {
      const lec = Number(l.lecciones || 1);
      if (l.codigo === "AI") ai += lec;
      else if (l.codigo === "TI") ti += lec;
      else if (l.codigo === "AJ") aj += lec;
      else if (l.codigo === "P") p += lec;
    });
    // Reglamento MEP: cada AI resta 1 lección, cada TI resta 0.5 lección (2 tardías injustificadas = 1 ausencia)
    const faltasInjust = ai + (ti * 0.5);
    const calc = calcularAsistenciaREA(leccionesEfectivas, faltasInjust, pesos.asistencia);
    return { leccionesEfectivas, efectivasRegistradas, ai, ti, aj, p, faltasInjust, ...calc };
  }

  window.BDS_CALC_ASISTENCIA_REA = calcularAsistenciaREA;

  window.BDS_RENDER_DOCENTE_REA_AUTO = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const soloLectura = sesion.rol === "Director(a)" || sesion.rol === "Ministro(a) MEP";
    const puedeEditar = ["SuperAdmin", "Docente MEP"].includes(sesion.rol);

    let tab = puedeEditar ? "asistencia" : "libreta";
    let selSec = "TODAS";
    let bloqueLecciones = 2;
    let fechaHoy = new Date().toISOString().slice(0, 10);

    function draw() {
      const roster = loadRoster();
      const pesos = loadPesos();
      const secciones = ["TODAS", ...Array.from(new Set(roster.map(r => r.seccion)))];
      const filtrados = roster.filter(r => selSec === "TODAS" || r.seccion === selSec);
      const sumaPesos = Number(pesos.cotidiano) + Number(pesos.tareas) + Number(pesos.pruebas) + Number(pesos.proyecto) + Number(pesos.asistencia);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">DECRETO N.° 45509-MEP (REA) • CÁLCULO AUTOMÁTICO POR LECCIONES EFECTIVAS</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">📊 Libreta REA, Asistencia Automática y Matrícula Docente ${soloLectura ? "(Solo Lectura)" : ""}</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${puedeEditar ? `<button data-rt="asistencia" class="rea-tab" style="background:${tab==='asistencia'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📋 Pase de Lista Automático</button>` : ""}
              <button data-rt="libreta" class="rea-tab" style="background:${tab==='libreta'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🧮 Libreta REA & Notas</button>
              ${puedeEditar ? `<button data-rt="matricular" class="rea-tab" style="background:${tab==='matricular'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎓 Matricular Estudiante (${roster.length})</button>` : ""}
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">
            <label style="font-size:11.5px;color:#94a3b8;font-weight:700;">Sección:</label>
            <select id="rea-sec" style="background:#070d19;color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:700;">
              ${secciones.map(s => `<option value="${s}" ${selSec===s?"selected":""}>${s==="TODAS"?"Todas las secciones":"Sección "+s}</option>`).join("")}
            </select>
            ${tab === "asistencia" && puedeEditar ? `
              <label style="font-size:11.5px;color:#94a3b8;font-weight:700;">Fecha:</label>
              <input id="rea-fec" type="date" value="${fechaHoy}" style="background:#070d19;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:12px;"/>
              <label style="font-size:11.5px;color:#94a3b8;font-weight:700;">Lecciones del bloque:</label>
              <select id="rea-lec" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:800;">
                ${[1,2,3,4,6].map(n => `<option value="${n}" ${bloqueLecciones===n?"selected":""}>${n} lección${n>1?"es":""}</option>`).join("")}
              </select>
              <button id="rea-qr" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📷 Pasar Lista con Cámara QR</button>
            ` : ""}
            <button id="rea-csv" style="margin-left:auto;background:#0f766e;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 Exportar Excel CSV (SEA/CEA)</button>
          </div>

          ${tab === "asistencia" && puedeEditar ? `
            <div style="background:#070d19;border-left:4px solid #38bdf8;padding:9px 12px;border-radius:8px;font-size:12px;color:#cbd5e1;margin-bottom:12px;">
              <b>Regla automática MEP (REA):</b> Cada <b>AI</b> rebaja 1 lección, cada <b>TI</b> rebaja 0.5 lección (2 tardías injustificadas = 1 ausencia), y <b>P / AJ / TJ</b> no rebajan. El % y la nota de asistencia (0–${pesos.asistencia}%) se recalculan al instante sobre las <b>lecciones efectivas</b>.
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:8px;text-align:left;">Estudiante / Sección</th>
                  <th style="padding:8px;text-align:center;">Marcar Bloque (${bloqueLecciones} lec.)</th>
                  <th style="padding:8px;text-align:center;">Faltas Injust.</th>
                  <th style="padding:8px;text-align:center;">% Asistencia</th>
                  <th style="padding:8px;text-align:center;">Nota REA (${pesos.asistencia}%)</th>
                </tr>
                ${filtrados.map(e => {
                  const rs = getResumenAsistencia(e.id, pesos);
                  return `<tr>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${e.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${e.seccion} • ${e.materia} • Lec. efectivas: ${rs.leccionesEfectivas}</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">
                      <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                        ${[["P","#059669","Presente"],["AI","#dc2626","Aus. Injust."],["AJ","#0284c7","Aus. Just."],["TI","#b45309","Tard. Injust."],["TJ","#4f46e5","Tard. Just."]].map(([cod, col, tip]) => `<button data-eid="${e.id}" data-cod="${cod}" title="${tip}" class="as-mark" style="background:${col};color:#fff;border:none;padding:6px 9px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">${cod}</button>`).join("")}
                      </div>
                    </td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;color:${rs.faltasInjust>0?'#fca5a5':'#6ee7b7'};font-weight:800;">${rs.faltasInjust} <span style="font-size:10px;color:#94a3b8;">(AI:${rs.ai} TI:${rs.ti})</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:900;color:${rs.pct>=80?'#34d399':'#fbbf24'};">${rs.pct}%</td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:900;color:#38bdf8;font-size:13.5px;">${rs.notaPonderada} / ${pesos.asistencia}</td>
                  </tr>`;
                }).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "libreta" ? `
            <div style="background:#070d19;border:1px solid ${sumaPesos===100?'#10b981':'#ef4444'};border-radius:10px;padding:10px;margin-bottom:12px;">
              <div style="font-size:11.5px;font-weight:800;color:${sumaPesos===100?'#34d399':'#fca5a5'};margin-bottom:8px;">⚙️ Ponderación REA (Suma actual: ${sumaPesos}% ${sumaPesos===100?'✓':'— Debe sumar 100%'}) • Lecciones efectivas base: ${pesos.leccionesMeta}</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(115px,1fr));gap:8px;font-size:11.5px;">
                ${[["cotidiano","Cotidiano %"],["tareas","Tareas %"],["pruebas","Pruebas %"],["proyecto","Proyecto %"],["asistencia","Asistencia %"],["leccionesMeta","Lec. Efectivas"]].map(([k, lbl]) => `
                  <div><label style="color:#94a3b8;display:block;font-size:10.5px;">${lbl}</label><input type="number" min="0" max="300" data-pk="${k}" class="rea-peso" value="${pesos[k]}" ${soloLectura?"disabled":""} style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;font-weight:800;"/></div>
                `).join("")}
              </div>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:780px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:8px;text-align:left;">Estudiante</th>
                  <th style="padding:8px;text-align:center;">Cotidiano (${pesos.cotidiano}%)</th>
                  <th style="padding:8px;text-align:center;">Tareas (${pesos.tareas}%)</th>
                  <th style="padding:8px;text-align:center;">Pruebas (${pesos.pruebas}%)</th>
                  <th style="padding:8px;text-align:center;">Proyecto (${pesos.proyecto}%)</th>
                  <th style="padding:8px;text-align:center;">Asist. Auto (${pesos.asistencia}%)</th>
                  <th style="padding:8px;text-align:center;">Nota Final</th>
                </tr>
                ${filtrados.map(e => {
                  const rs = getResumenAsistencia(e.id, pesos);
                  const notaFinal = Number((
                    (Number(e.cotidiano || 0) * pesos.cotidiano / 100) +
                    (Number(e.tareas || 0) * pesos.tareas / 100) +
                    (Number(e.pruebas || 0) * pesos.pruebas / 100) +
                    (Number(e.proyecto || 0) * pesos.proyecto / 100) +
                    rs.notaPonderada
                  ).toFixed(1));
                  const ok = notaFinal >= 70;
                  return `<tr>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${e.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${e.seccion} • ${e.materia}</span></td>
                    ${["cotidiano","tareas","pruebas","proyecto"].map(k => `
                      <td style="padding:6px;border-bottom:1px solid #1e293b;text-align:center;">
                        <input type="number" min="0" max="100" data-eid="${e.id}" data-gk="${k}" class="rea-grade" value="${e[k] || 0}" ${soloLectura?"disabled":""} style="width:66px;background:#070d19;color:#fff;border:1px solid #334155;padding:6px;border-radius:6px;text-align:center;font-weight:700;"/>
                      </td>
                    `).join("")}
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:800;color:#38bdf8;">${rs.notaPonderada} <span style="font-size:10px;color:#94a3b8;">(${rs.pct}%)</span></td>
                    <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">
                      <span style="background:${ok?'#059669':'#dc2626'};color:#fff;padding:4px 10px;border-radius:99px;font-weight:900;font-size:12.5px;">${notaFinal}%</span>
                    </td>
                  </tr>`;
                }).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "matricular" && puedeEditar ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;align-items:start;">
              <form id="doc-mat-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0 0 4px;font-size:15px;color:#34d399;">🎓 Matricular Estudiante en Mi Sección (Con QR SHA-256)</h3>
                <input id="dm-nom" type="text" required placeholder="Nombre completo del estudiante" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="dm-ced" type="text" required placeholder="Cédula / DIMEX" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="dm-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <input id="dm-sec" type="text" required value="11-1" placeholder="Sección (ej. 10-C-3, 11-1)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="dm-mat" type="text" required value="Programación Web" placeholder="Subárea / Asignatura" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">✅ Matricular y Vincular a Lista + Libreta REA</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">👥 Mis Estudiantes Matriculados (${roster.length})</h3>
                <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:7px;">
                  ${roster.map(r => `<div style="background:#0b1322;border:1px solid #334155;border-radius:8px;padding:9px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:6px;"><div><b>${r.nombre}</b> (${r.seccion})<br/><span style="font-size:10.5px;color:#94a3b8;">${r.email} • ${r.materia}</span></div><code style="font-size:10px;color:#34d399;">${(r.hash||"").slice(0,10)}</code></div>`).join("")}
                </div>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".rea-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-rt"); draw(); });
      document.getElementById("rea-sec").onchange = (e) => { selSec = e.target.value; draw(); };

      if (document.getElementById("rea-fec")) document.getElementById("rea-fec").onchange = (e) => { fechaHoy = e.target.value; };
      if (document.getElementById("rea-lec")) document.getElementById("rea-lec").onchange = (e) => { bloqueLecciones = Number(e.target.value); draw(); };

      if (document.getElementById("rea-qr")) document.getElementById("rea-qr").onclick = () => {
        if (!window.BDS_QR_CAMERA) return alert("Escáner QR no disponible.");
        window.BDS_QR_CAMERA.openModal({
          title: `Pase de Lista QR (${bloqueLecciones} lecciones)`,
          closeOnScan: false,
          onScan: (code) => {
            const q = code.toLowerCase();
            const est = loadRoster().find(x => q.includes(x.email.toLowerCase()) || q.includes((x.hash || "").toLowerCase()));
            if (est) {
              const logs = loadAsist();
              logs.unshift({ id: "AS-" + Date.now(), estId: est.id, fecha: fechaHoy, codigo: "P", lecciones: bloqueLecciones, docente: sesion.nombre });
              saveAsist(logs);
              if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
              draw();
            } else {
              if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
            }
          }
        });
      };

      shell.querySelectorAll(".as-mark").forEach(b => b.onclick = () => {
        const estId = b.getAttribute("data-eid");
        const codigo = b.getAttribute("data-cod");
        const logs = loadAsist();
        logs.unshift({ id: "AS-" + Date.now(), estId, fecha: fechaHoy, codigo, lecciones: bloqueLecciones, docente: sesion.nombre });
        saveAsist(logs);
        if (ganarXP) ganarXP(3);
        draw();
      });

      shell.querySelectorAll(".rea-peso").forEach(inp => inp.onchange = () => {
        const p = loadPesos();
        p[inp.getAttribute("data-pk")] = Math.max(0, Number(inp.value || 0));
        savePesos(p);
        draw();
      });

      shell.querySelectorAll(".rea-grade").forEach(inp => inp.onchange = () => {
        const arr = loadRoster();
        const e = arr.find(x => x.id === inp.getAttribute("data-eid"));
        if (!e) return;
        e[inp.getAttribute("data-gk")] = Math.max(0, Math.min(100, Number(inp.value || 0)));
        saveRoster(arr);
        draw();
      });

      if (document.getElementById("doc-mat-f")) document.getElementById("doc-mat-f").onsubmit = async (e) => {
        e.preventDefault();
        const nom = document.getElementById("dm-nom").value.trim();
        const ced = document.getElementById("dm-ced").value.trim();
        const mail = document.getElementById("dm-mail").value.trim().toLowerCase();
        const sec = document.getElementById("dm-sec").value.trim();
        const mat = document.getElementById("dm-mat").value.trim();
        const arr = loadRoster();
        const h = (await sha256Hex(`EST|${ced}|${mail}|${sec}`)).slice(0, 16);
        arr.unshift({ id: "EST-" + String(Date.now()).slice(-4), nombre: nom, cedula: ced, email: mail, seccion: sec, materia: mat, cotidiano: 100, tareas: 100, pruebas: 0, proyecto: 100, hash: h });
        saveRoster(arr);
        alert(`✅ ${nom} matriculado en sección ${sec} con QR SHA-256 (${h}). Ya aparece en Lista Automática y Libreta REA.`);
        draw();
      };

      document.getElementById("rea-csv").onclick = () => {
        const p = loadPesos();
        const rows = [["ID","ESTUDIANTE","SECCION","MATERIA","COTIDIANO","TAREAS","PRUEBAS","PROYECTO","LECCIONES_EFECTIVAS","FALTAS_INJUST","PCT_ASISTENCIA","NOTA_ASISTENCIA_REA","NOTA_FINAL"]];
        filtrados.forEach(e => {
          const rs = getResumenAsistencia(e.id, p);
          const nf = ((e.cotidiano * p.cotidiano + e.tareas * p.tareas + e.pruebas * p.pruebas + e.proyecto * p.proyecto) / 100 + rs.notaPonderada).toFixed(1);
          rows.push([e.id, e.nombre, e.seccion, e.materia, e.cotidiano, e.tareas, e.pruebas, e.proyecto, rs.leccionesEfectivas, rs.faltasInjust, rs.pct + "%", rs.notaPonderada, nf]);
        });
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = `libreta-rea-asistencia-auto-${fechaHoy}.csv`;
        a.click();
      };
    }

    draw();
  };
})();