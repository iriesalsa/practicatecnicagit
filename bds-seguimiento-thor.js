(function () {
  const SEG_KEY = "bds_seguimiento_thor_v196";

  function loadSeg() {
    try { const d = JSON.parse(localStorage.getItem(SEG_KEY)); if (d && d.byArea) return d; } catch {}
    return { total: 0, correct: 0, byArea: {}, byDiff: { "Básico": { t: 0, c: 0 }, "Medio": { t: 0, c: 0 }, "Intermedio": { t: 0, c: 0 }, "Avanzado": { t: 0, c: 0 } }, recent: [] };
  }
  function saveSeg(d) { localStorage.setItem(SEG_KEY, JSON.stringify(d)); }

  function calcNivelREA(pct) {
    if (pct >= 85) return { num: 3, lbl: "Nivel 3 — Avanzado", col: "#10b981", msg: "Dominio autónomo y transferencia STEAM excelente." };
    if (pct >= 65) return { num: 2, lbl: "Nivel 2 — Intermedio", col: "#38bdf8", msg: "Progreso sólido; refuerza distractores complejos." };
    return { num: 1, lbl: "Nivel 1 — Inicial", col: "#f59e0b", msg: "En proceso; practica con guía DUA y audio TTS." };
  }

  function recordAttempt(item, isCorrect) {
    if (!item || !item.a) return;
    const d = loadSeg();
    d.total++;
    if (isCorrect) d.correct++;
    if (!d.byArea[item.a]) d.byArea[item.a] = { t: 0, c: 0, lastInd: "" };
    d.byArea[item.a].t++;
    if (isCorrect) d.byArea[item.a].c++;
    d.byArea[item.a].lastInd = item.indicador || "";
    const dk = d.byDiff[item.d] ? item.d : "Intermedio";
    d.byDiff[dk].t++;
    if (isCorrect) d.byDiff[dk].c++;
    d.recent.unshift({
      fecha: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }),
      area: item.a,
      diff: dk,
      ok: Boolean(isCorrect),
      indicador: (item.indicador || "").slice(0, 90)
    });
    d.recent = d.recent.slice(0, 30);
    saveSeg(d);
  }

  function imprimirInformeSeguimiento(sesion, d, malla, generarQRSVG, hash) {
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", regional: "Heredia", circuito: "Circuito 02", escudo: "/escudo-ctpmn-oficial.jpeg", logoMep: "/logo-mep-oficial.png" };
    const pctG = d.total ? Math.round((d.correct / d.total) * 100) : 0;
    const nG = calcNivelREA(pctG);
    const rows = Object.entries(d.byArea).map(([aid, st]) => {
      const m = malla.find(x => x.id === aid) || { name: aid };
      const p = st.t ? Math.round((st.c / st.t) * 100) : 0;
      const nr = calcNivelREA(p);
      return `<tr><td><b>${m.name}</b></td><td>${st.c}/${st.t}</td><td><b>${p}%</b></td><td>${nr.lbl}</td><td>${st.lastInd || "Indicador MEP"}</td></tr>`;
    }).join("");
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el informe PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Informe de Seguimiento Pedagógico</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:8px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0">${b.institucion}</h2><div>INFORME DE SEGUIMIENTO E INDICADORES REACC (STEAM • DUA • ENFOQUE FENÓMENO REAL)</div></div><img src="${b.logoMep}" style="height:44px"/></div><p><b>Persona:</b> ${sesion.nombre} (${sesion.rol}) &nbsp;|&nbsp; <b>Desempeño Global:</b> ${pctG}% (${nG.lbl}) &nbsp;|&nbsp; <b>Ítems Evaluados:</b> ${d.total}</p><table><tr><th>Asignatura</th><th>Aciertos</th><th>Logro</th><th>Nivel REAC (1–3)</th><th>Último Indicador Evaluado</th></tr>${rows || '<tr><td colspan="5">Sin intentos registrados todavía.</td></tr>'}</table><div class="qr">${generarQRSVG("PT-SEG|" + hash, 84)}<div><b>Informe Pedagógico Verificable QR SHA-256</b><br/><code>${hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_SEGUIMIENTO_THOR = {
    load: loadSeg,
    recordAttempt,
    renderPanel(shell, ctx) {
      const { sesion, sha256Hex, generarQRSVG } = ctx;
      const d = loadSeg();
      const malla = window.BDS_MALLA_MEP || [];
      const stBank = window.__BDS_BANCO_STATS || { afterTotal: 58000, totalAreas: 29 };
      const pctG = d.total ? Math.round((d.correct / d.total) * 100) : 0;
      const nivG = calcNivelREA(pctG);

      // Identificar el área más débil para botón adaptativo (ENFOQUE FENÓMENO REAL)
      const areaEntries = Object.entries(d.byArea).map(([aid, st]) => ({
        aid,
        name: (malla.find(x => x.id === aid) || { name: aid }).name,
        t: st.t, c: st.c,
        pct: st.t ? Math.round((st.c / st.t) * 100) : 0,
        lastInd: st.lastInd
      })).sort((a, b) => a.pct - b.pct);
      const weakest = areaEntries[0] || null;

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">MOTOR THOR 50× (${stBank.afterTotal.toLocaleString("es-CR")}+ ÍTEMS) • STEAM • DUA • EXCELENCIA PEDAGÓGICA</span>
              <h2 style="margin:5px 0 0;font-size:17.5px;color:#fff;">📈 Seguimiento por Indicadores y Niveles de Desempeño (REA 1–3)</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="sg-pdf" style="background:#7c3aed;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Informe PDF + QR</button>
              <button id="sg-csv" style="background:#0f766e;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📊 Exportar CSV</button>
              <button id="sg-rst" style="background:#334155;color:#fff;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;cursor:pointer;">🔄 Reiniciar</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin-bottom:14px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Ítems Respondidos</div><div style="font-size:24px;font-weight:900;color:#38bdf8;">${d.total}</div></div>
            <div style="background:#070d19;border:1px solid ${nivG.col};border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Dominio Global</div><div style="font-size:24px;font-weight:900;color:${nivG.col};">${pctG}%</div></div>
            <div style="background:#070d19;border:1px solid ${nivG.col};border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Desempeño REAC</div><div style="font-size:14px;font-weight:800;color:${nivG.col};margin-top:6px;">${nivG.lbl}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Banco Disponible</div><div style="font-size:19px;font-weight:900;color:#c084fc;margin-top:3px;">${stBank.afterTotal.toLocaleString("es-CR")}+</div></div>
          </div>

          <div style="background:#070d19;border-left:4px solid ${nivG.col};border-radius:10px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:12.5px;color:#e2e8f0;">
              <b>🧭 Retroalimentación Formativa (ENFOQUE FENÓMENO REAL + DUA):</b> ${nivG.msg}
              ${weakest ? `<br/><span style="color:#fbbf24;">Área prioritaria sugerida para reforzar hoy: <b>${weakest.name}</b> (${weakest.pct}% de dominio).</span>` : `<br/><span style="color:#94a3b8;">Completa tu primera práctica guiada o simulacro para generar tu mapa adaptativo de indicadores.</span>`}
            </div>
            <button id="sg-adapt" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎯 ${weakest ? `Reforzar ${weakest.name.slice(0,22)}` : "Iniciar Práctica Adaptativa"}</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
              <h3 style="margin:0 0 10px;font-size:14.5px;color:#38bdf8;">📘 Avance por Asignatura e Indicadores (${areaEntries.length})</h3>
              <div style="display:flex;flex-direction:column;gap:8px;max-height:320px;overflow-y:auto;">
                ${areaEntries.map(a => {
                  const nr = calcNivelREA(a.pct);
                  return `<div style="background:#0b1322;border:1px solid #334155;border-radius:8px;padding:9px;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                      <b>${a.name}</b>
                      <span style="color:${nr.col};font-weight:800;">${a.pct}% • ${nr.lbl}</span>
                    </div>
                    <div style="height:7px;background:#1e293b;border-radius:99px;overflow:hidden;margin-bottom:5px;"><div style="width:${a.pct}%;height:100%;background:${nr.col};"></div></div>
                    <div style="font-size:10.5px;color:#94a3b8;">Aciertos: ${a.c}/${a.t} • ${a.lastInd || "Indicador curricular MEP"}</div>
                  </div>`;
                }).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Aún no hay prácticas registradas. Comienza en <b>🧭 Práctica</b> o <b>⏱️ Simulacro</b>.</p>`}
              </div>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
              <h3 style="margin:0 0 10px;font-size:14.5px;color:#34d399;">🎯 Desempeño por Nivel Cognitivo (Básico → Avanzado)</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${["Básico","Medio","Intermedio","Avanzado"].map(dk => {
                  const st = d.byDiff[dk] || { t: 0, c: 0 };
                  const p = st.t ? Math.round((st.c / st.t) * 100) : 0;
                  return `<div style="background:#0b1322;border:1px solid #334155;border-radius:8px;padding:9px;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><b>${dk}</b><span style="color:#38bdf8;font-weight:800;">${p}% (${st.c}/${st.t})</span></div>
                    <div style="height:6px;background:#1e293b;border-radius:99px;overflow:hidden;"><div style="width:${p}%;height:100%;background:#38bdf8;"></div></div>
                  </div>`;
                }).join("")}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById("sg-adapt").onclick = () => {
        if (window.bdsGo) window.bdsGo("practica", weakest ? weakest.aid : (malla[0] ? malla[0].id : "web"));
      };
      document.getElementById("sg-rst").onclick = () => {
        if (confirm("¿Reiniciar las métricas locales de seguimiento a 0?")) { localStorage.removeItem(SEG_KEY); window.BDS_SEGUIMIENTO_THOR.renderPanel(shell, ctx); }
      };
      document.getElementById("sg-pdf").onclick = async () => {
        const h = (await sha256Hex(`SEG|${sesion.email}|${d.total}|${pctG}`)).slice(0, 18);
        imprimirInformeSeguimiento(sesion, d, malla, generarQRSVG, h);
      };
      document.getElementById("sg-csv").onclick = () => {
        const rows = [["ASIGNATURA","ACIERTOS","TOTAL","DOMINIO_PCT","NIVEL_REAC","INDICADOR"],
          ...areaEntries.map(a => [a.name, a.c, a.t, a.pct + "%", calcNivelREA(a.pct).lbl, a.lastInd])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = "seguimiento-indicadores-practicatecnica.csv";
        a.click();
      };
    }
  };
})();