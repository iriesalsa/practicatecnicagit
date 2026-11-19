(function () {
  const BACKUP_HIST_KEY = "bds_respaldos_notas_anios_v191";

  function loadBackups() { try { return JSON.parse(localStorage.getItem(BACKUP_HIST_KEY)) || {}; } catch { return {}; } }
  function saveBackups(m) { localStorage.setItem(BACKUP_HIST_KEY, JSON.stringify(m)); }

  function getRosterActual() {
    try { return JSON.parse(localStorage.getItem("bds_docente_roster_v190")) || []; } catch { return []; }
  }

  window.BDS_RENDER_REPORTES_RESPALDOS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    let selAnio = "2027";
    let selSec = "TODAS";
    let selEst = "TODOS";
    const anios = ["2026","2027","2028","2029","2030"];

    function getBrand() {
      return window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", escudo: "/escudo-ctpmn-oficial.jpeg", logoMep: "/logo-mep-oficial.png" };
    }

    function draw() {
      const backups = loadBackups();
      const datosAnio = backups[selAnio] && backups[selAnio].length ? backups[selAnio] : getRosterActual();
      const secciones = ["TODAS", ...Array.from(new Set(datosAnio.map(r => r.seccion || "General")))];
      const filtrados = datosAnio.filter(r =>
        (selSec === "TODAS" || r.seccion === selSec) &&
        (selEst === "TODOS" || r.id === selEst)
      );
      const promGlobal = filtrados.length
        ? (filtrados.reduce((acc, e) => acc + ((Number(e.cotidiano||0)*0.45) + (Number(e.tareas||0)*0.10) + (Number(e.pruebas||0)*0.25) + (Number(e.proyecto||0)*0.10) + 10), 0) / filtrados.length).toFixed(1)
        : "0.0";

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">RESPALDO HISTÓRICO MULTIANUAL • PDF + CSV + JSON</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🗂️ Respaldos de Notas y Reportes por Año, Sección y Estudiante</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="rp-snap" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">💾 Guardar Respaldo ${selAnio}</button>
              <button id="rp-json" style="background:#1d4ed8;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 Exportar JSON</button>
              <label style="background:#131f33;color:#34d399;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                📂 Restaurar JSON
                <input id="rp-imp" type="file" accept=".json" style="display:none;"/>
              </label>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px;">
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Año Lectivo:</label>
              <select id="rp-yr" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;font-weight:700;">
                ${anios.map(y => `<option value="${y}" ${selAnio===y?"selected":""}>Año ${y}${backups[y]?" (Respaldado)":""}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Sección:</label>
              <select id="rp-sec" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;">
                ${secciones.map(s => `<option value="${s}" ${selSec===s?"selected":""}>${s==="TODAS"?"Todas las secciones":"Sección "+s}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Estudiante:</label>
              <select id="rp-est" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;">
                <option value="TODOS">Todos (${datosAnio.length})</option>
                ${datosAnio.map(e => `<option value="${e.id}" ${selEst===e.id?"selected":""}>${e.nombre} (${e.seccion})</option>`).join("")}
              </select>
            </div>
            <div style="display:flex;gap:6px;align-items:flex-end;">
              <button id="rp-csv" style="flex:1;background:#0284c7;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📊 CSV</button>
              <button id="rp-pdf" style="flex:1;background:#7c3aed;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🖨️ PDF QR</button>
            </div>
          </div>

          <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:10px;padding:10px;margin-bottom:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:12.5px;">
            <span>Registros filtrados (${selAnio}): <b style="color:#38bdf8;">${filtrados.length}</b></span>
            <span>Promedio del grupo: <b style="color:#34d399;">${promGlobal}%</b></span>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:680px;border-collapse:collapse;font-size:12px;">
              <tr style="background:#131f33;color:#38bdf8;"><th style="padding:8px;text-align:left;">Estudiante</th><th style="padding:8px;">Sección</th><th style="padding:8px;">Cotidiano</th><th style="padding:8px;">Tareas</th><th style="padding:8px;">Pruebas</th><th style="padding:8px;">Proyecto</th><th style="padding:8px;">Promedio Est.</th></tr>
              ${filtrados.map(e => {
                const pr = ((Number(e.cotidiano||0)*0.45) + (Number(e.tareas||0)*0.10) + (Number(e.pruebas||0)*0.25) + (Number(e.proyecto||0)*0.10) + 10).toFixed(1);
                return `<tr>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${e.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${e.materia || "General"}</span></td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${e.seccion}</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${e.cotidiano}%</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${e.tareas}%</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${e.pruebas}%</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">${e.proyecto}%</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:900;color:${Number(pr)>=70?'#34d399':'#f87171'};">${pr}%</td>
                </tr>`;
              }).join("")}
            </table>
          </div>
        </div>
      `;

      document.getElementById("rp-yr").onchange = (e) => { selAnio = e.target.value; draw(); };
      document.getElementById("rp-sec").onchange = (e) => { selSec = e.target.value; draw(); };
      document.getElementById("rp-est").onchange = (e) => { selEst = e.target.value; draw(); };

      document.getElementById("rp-snap").onclick = () => {
        const b = loadBackups();
        b[selAnio] = getRosterActual();
        saveBackups(b);
        alert(`✅ Respaldo histórico de notas guardado para el año lectivo ${selAnio}.`);
        draw();
      };
      document.getElementById("rp-json").onclick = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify({ anio: selAnio, fecha: new Date().toISOString(), registros: filtrados }, null, 2)], { type: "application/json" }));
        a.download = `respaldo-notas-${selAnio}-${selSec}.json`;
        a.click();
      };
      document.getElementById("rp-imp").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          try {
            const d = JSON.parse(ev.target.result);
            const yr = d.anio || selAnio;
            const b = loadBackups();
            b[yr] = Array.isArray(d.registros) ? d.registros : [];
            saveBackups(b);
            alert(`✅ Respaldo ${yr} restaurado (${b[yr].length} registros).`);
            draw();
          } catch { alert("Archivo JSON inválido."); }
        };
        r.readAsText(f);
      };
      document.getElementById("rp-csv").onclick = () => {
        const rows = [["ANIO","ESTUDIANTE","SECCION","MATERIA","COTIDIANO","TAREAS","PRUEBAS","PROYECTO"],
          ...filtrados.map(e => [selAnio, e.nombre, e.seccion, e.materia, e.cotidiano, e.tareas, e.pruebas, e.proyecto])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = `reporte-notas-${selAnio}-${selSec}.csv`;
        a.click();
      };
      document.getElementById("rp-pdf").onclick = async () => {
        const br = getBrand();
        const h = (await sha256Hex(`REP-NOTAS|${selAnio}|${selSec}|${filtrados.length}`)).slice(0, 18);
        const w = window.open("", "_blank");
        if (!w) return alert("Permita ventanas emergentes para imprimir el reporte PDF.");
        w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Reporte de Notas ${selAnio}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#0f2247;color:#fff}</style></head><body><div class="hdr"><img src="${br.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0">${br.institucion}</h2><div>REPORTE OFICIAL DE NOTAS • AÑO ${selAnio} • SECCIÓN: ${selSec}</div></div><img src="${br.logoMep}" style="height:44px"/></div><table><tr><th>Estudiante</th><th>Sección</th><th>Cotidiano</th><th>Tareas</th><th>Pruebas</th><th>Proyecto</th></tr>${filtrados.map(e => `<tr><td>${e.nombre}</td><td>${e.seccion}</td><td>${e.cotidiano}%</td><td>${e.tareas}%</td><td>${e.pruebas}%</td><td>${e.proyecto}%</td></tr>`).join("")}</table><div style="display:flex;align-items:center;gap:12px;margin-top:16px;border:1px solid #0f766e;padding:8px;border-radius:8px">${generarQRSVG("PT-REP|" + h, 80)}<div><b>Emitido por:</b> ${sesion.nombre}<br/><b>Sello SHA-256:</b> <code>${h}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
        w.document.close();
      };
    }
    draw();
  };
})();