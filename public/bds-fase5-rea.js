(function () {
  const REA_KEY = "bds_libreta_rea_v180";

  function cargarLibretaREA() {
    try { const d = JSON.parse(localStorage.getItem(REA_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const init = [
      { id: "EST-01", est: "Alvarado Rojas, Sofía", sec: "11-1", cot: 96, tar: 95, pru: 90, proy: 94, ind: 3 },
      { id: "EST-02", est: "Campos Mora, Esteban", sec: "11-1", cot: 84, tar: 80, pru: 78, proy: 86, ind: 2 },
      { id: "EST-03", est: "Hernández Solís, Camila", sec: "11-1", cot: 98, tar: 100, pru: 94, proy: 96, ind: 3 },
      { id: "EST-04", est: "Jiménez Quesada, Daniel", sec: "11-1", cot: 68, tar: 70, pru: 64, proy: 72, ind: 1 },
      { id: "EST-05", est: "Vargas Méndez, Valeria", sec: "11-1", cot: 90, tar: 92, pru: 88, proy: 91, ind: 3 }
    ];
    localStorage.setItem(REA_KEY, JSON.stringify(init));
    return init;
  }

  window.BDS_RENDER_FASE5_REA = function (shell, ctx) {
    const { sesion } = ctx;
    const soloLectura = (sesion.rol === "Director(a)" || sesion.rol === "Estudiante" || sesion.rol === "Padre/Madre");
    let modalidad = "CTP Especialidad Técnica (35/10/35/15/5)";

    const pesos = {
      "CTP Especialidad Técnica (35/10/35/15/5)": { cot: 0.35, tar: 0.10, pru: 0.35, proy: 0.15, asi: 0.05 },
      "Académica Diversificada (35/10/45/0/10)": { cot: 0.35, tar: 0.10, pru: 0.45, proy: 0.00, asi: 0.10 },
      "III Ciclo 7°–9° (45/10/35/0/10)": { cot: 0.45, tar: 0.10, pru: 0.35, proy: 0.00, asi: 0.10 }
    };

    function draw() {
      const filas = cargarLibretaREA();
      const att = window.BDS_GET_ATTENDANCE ? window.BDS_GET_ATTENDANCE() : [];
      const w = pesos[modalidad];

      const calc = (f) => {
        const aRec = att.find(a => a.nombre === f.est);
        const notaAsis = aRec && aRec.code === "AI" ? 80 : (aRec && aRec.code === "TI" ? 90 : 100);
        const final = Math.round(f.cot * w.cot + f.tar * w.tar + f.pru * w.pru + f.proy * w.proy + notaAsis * w.asi);
        return { notaAsis, final };
      };

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FASE 5 • LIBRETA REA (DECRETO N.° 45509-MEP) & EXPORTADOR SEA/CEA</span>
              <h2 style="margin:4px 0 0;font-size:17.5px;color:#fff;">Evaluación Automatizada 3-2-1 ${soloLectura ? "(Modo Solo Lectura — PRODHAB/RBAC)" : "(Edición Docente Activa)"}</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <select id="rea-mod" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                ${Object.keys(pesos).map(k => `<option ${k===modalidad?"selected":""}>${k}</option>`).join("")}
              </select>
              <button id="sea-csv" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 Exportar CSV SEA/CEA</button>
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:700px;border-collapse:collapse;font-size:12.5px;">
              <tr style="background:#131f33;color:#38bdf8;">
                <th style="padding:9px;text-align:left;">Estudiante</th>
                <th style="padding:9px;">Indicador 3-2-1</th>
                <th style="padding:9px;">Cotidiano</th>
                <th style="padding:9px;">Tareas</th>
                <th style="padding:9px;">Pruebas</th>
                <th style="padding:9px;">Proyecto</th>
                <th style="padding:9px;">Asistencia</th>
                <th style="padding:9px;">Nota REA</th>
              </tr>
              ${filas.map((f, i) => {
                const { notaAsis, final } = calc(f);
                const lblInd = f.ind === 3 ? "3 (Avanzado)" : (f.ind === 2 ? "2 (Intermedio)" : "1 (Inicial)");
                return `<tr>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;font-weight:700;">${f.est}</td>
                  <td style="padding:6px;border-bottom:1px solid #1e293b;text-align:center;">
                    ${soloLectura ? lblInd : `<select data-ri="${i}" class="rea-ind" style="background:#070d19;color:#38bdf8;border:1px solid #334155;padding:4px;border-radius:6px;font-size:11px;">
                      <option value="3" ${f.ind===3?"selected":""}>3 Avanzado</option>
                      <option value="2" ${f.ind===2?"selected":""}>2 Intermedio</option>
                      <option value="1" ${f.ind===1?"selected":""}>1 Inicial</option>
                    </select>`}
                  </td>
                  ${["cot","tar","pru","proy"].map(k => `<td style="padding:6px;border-bottom:1px solid #1e293b;text-align:center;">
                    ${soloLectura ? `<b>${f[k]}</b>` : `<input data-ri="${i}" data-rk="${k}" class="rea-n" type="number" min="0" max="100" value="${f[k]}" style="width:56px;background:#070d19;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;font-weight:700;"/>`}
                  </td>`).join("")}
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;color:#93c5fd;">${notaAsis}%</td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;font-weight:900;color:${final>=70?'#34d399':'#f87171'};">${final}%</td>
                </tr>`;
              }).join("")}
            </table>
          </div>
        </div>
      `;

      document.getElementById("rea-mod").onchange = (e) => { modalidad = e.target.value; draw(); };
      if (!soloLectura) {
        shell.querySelectorAll(".rea-n").forEach(inp => {
          inp.onfocus = () => { if (inp.value === "0") inp.value = ""; };
          inp.onchange = () => {
            const arr = cargarLibretaREA();
            arr[Number(inp.getAttribute("data-ri"))][inp.getAttribute("data-rk")] = Math.max(0, Math.min(100, Number(inp.value) || 0));
            localStorage.setItem(REA_KEY, JSON.stringify(arr));
            draw();
          };
        });
        shell.querySelectorAll(".rea-ind").forEach(sel => sel.onchange = () => {
          const arr = cargarLibretaREA();
          arr[Number(sel.getAttribute("data-ri"))].ind = Number(sel.value);
          localStorage.setItem(REA_KEY, JSON.stringify(arr));
          draw();
        });
      }
      document.getElementById("sea-csv").onclick = () => {
        const headers = ["CEDULA_ID","ESTUDIANTE","SECCION","INDICADOR_321","COTIDIANO","TAREAS","PRUEBAS","PROYECTO","ASISTENCIA","NOTA_FINAL_REA","CONDICION"];
        const rows = [headers, ...filas.map(f => {
          const { notaAsis, final } = calc(f);
          return [f.id, f.est, f.sec, f.ind, f.cot, f.tar, f.pru, f.proy, notaAsis, final, final >= 70 ? "APROBADO" : "APLAZADO"];
        })];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = "SEA_CEA_CTP_Mercedes_Norte_Circuito02.csv";
        a.click();
      };
    }
    draw();
  };

  // Analítica Local Gratuita para Director/Jefatura (Cero costo en tokens de IA) + Portal Padre Multi-Hijo
  window.BDS_RENDER_DIRECCION_Y_FAMILIA = function (shell, sesion) {
    const filas = cargarLibretaREA();
    const att = window.BDS_GET_ATTENDANCE ? window.BDS_GET_ATTENDANCE() : [];
    const prom = Math.round(filas.reduce((a, f) => a + (f.cot * 0.35 + f.tar * 0.1 + f.pru * 0.35 + f.proy * 0.2), 0) / filas.length);
    const ausentes = att.filter(a => a.code === "AI" || a.code === "TI");
    const presentes = att.filter(a => a.code === "P");

    shell.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
        <div class="bds-card">
          <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:99px;">PANEL DIRECCIÓN / JEFATURA (ANALÍTICA LOCAL SIN COSTO IA)</span>
          <h3 style="margin:8px 0 6px;color:#fff;">📊 Rendimiento Global y Asistencia por Grupo</h3>
          <div style="display:flex;gap:10px;margin:10px 0;">
            <div style="flex:1;background:#070d19;padding:12px;border-radius:10px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Promedio Global</div><div style="font-size:24px;font-weight:900;color:#34d399;">${prom}%</div></div>
            <div style="flex:1;background:#070d19;padding:12px;border-radius:10px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Asistencia Hoy</div><div style="font-size:24px;font-weight:900;color:#38bdf8;">${Math.round((presentes.length/Math.max(1,att.length))*100)}%</div></div>
          </div>
          <div style="font-size:12px;color:#cbd5e1;background:#070d19;padding:10px;border-radius:8px;margin-bottom:10px;">
            <b>🏆 Mejor Asistencia:</b> ${presentes.map(x => x.nombre).slice(0,2).join(", ") || "Sin registros"}<br/>
            <b>⚠️ Mayor Ausentismo/Tardías:</b> ${ausentes.map(x => `${x.nombre} (${x.code})`).join(", ") || "0 alertas hoy"}
          </div>
          <div style="font-size:12px;color:#a7f3d0;background:#064e3b;padding:10px;border-radius:8px;margin-bottom:10px;">
            <b>💡 Sugerencia Analítica Local:</b> Priorizar refuerzo DUA en estudiantes con indicador 1 (Inicial) y convocar a reunión de seguimiento con Orientación para casos con tardías reiteradas.
          </div>
          <button onclick="window.print()" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">🖨️ Exportar Reporte PDF Dirección</button>
        </div>

        <div class="bds-card">
          <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:99px;">PORTAL PADRE / MADRE / ENCARGADO (MULTI-HIJO)</span>
          <h3 style="margin:8px 0 6px;color:#fff;">👨‍👩‍👧‍👦 Estudiantes Vinculados (Varias Instituciones)</h3>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
            <div style="background:#070d19;border-left:4px solid #10b981;padding:10px;border-radius:8px;">
              <b>Hijo(a) 1:</b> Sofía Alvarado — <b>CTP Mercedes Norte (11-1)</b><br/>
              <span style="color:#6ee7b7;">Asistencia: Presente (P) • Indicador REA: 3 (Avanzado) • Promedio: 94%</span>
            </div>
            <div style="background:#070d19;border-left:4px solid #38bdf8;padding:10px;border-radius:8px;">
              <b>Hijo(a) 2:</b> Lucas Alvarado — <b>Liceo de Heredia (8-2)</b><br/>
              <span style="color:#93c5fd;">Asistencia: Presente (P) • Indicador REA: 2 (Intermedio) • Promedio: 86%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };
})();