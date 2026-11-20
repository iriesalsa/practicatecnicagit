(function () {
  function imprimirHojaRespuestasOMR(items, areaNombre, sesion, generarQRSVG, sha256Hex) {
    if (!Array.isArray(items) || !items.length) {
      alert("Primero genere una práctica o simulacro para imprimir el folleto y la hoja de respuestas.");
      return;
    }
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=207" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=207" };

    (async () => {
      const hash = sha256Hex ? (await sha256Hex(`OMR|${areaNombre}|${items.length}|${Date.now()}`)).slice(0, 18) : "OMR207SHA256";
      const letras = ["A", "B", "C", "D"];

      const preguntasHtml = items.map((it, i) => `
        <div class="qbox">
          <div class="qmeta">${i + 1}. [${it.d || "Intermedio"} • ${it.unidadEstudio || "Unidad MEP 2026"}]</div>
          <div class="qtxt">${it.q}</div>
          <div class="qopts">${(it.opts || []).map((o, oi) => `<div><b>${letras[oi]})</b> ${o.txt}</div>`).join("")}</div>
        </div>
      `).join("");

      const burbujasHtml = items.map((_, i) => `
        <div class="omr-row">
          <span class="omr-num">${String(i + 1).padStart(2, "0")}.</span>
          ${letras.map(l => `<span class="bub">${l}</span>`).join("")}
        </div>
      `).join("");

      const claveHtml = items.map((it, i) => {
        const idxOk = (it.opts || []).findIndex(o => o.ok);
        const lOk = idxOk >= 0 ? letras[idxOk] : "A";
        const tOk = idxOk >= 0 ? it.opts[idxOk].txt : "";
        return `<tr><td><b>${i + 1}</b></td><td style="text-align:center;font-weight:900;color:#0f766e">${lOk}</td><td>${tOk}</td><td>${it.unidadEstudio || "Unidad 2026"} • ${it.indicador || "Indicador REAC"}</td></tr>`;
      }).join("");

      const w = window.open("", "_blank");
      if (!w) return alert("Permita ventanas emergentes para imprimir el folleto y la hoja de respuestas.");
      w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Folleto y Hoja de Respuestas — ${areaNombre}</title><style>
        body{font-family:Inter,Arial,sans-serif;padding:20px;color:#0f172a;font-size:11.5px;line-height:1.4}
        .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:8px;margin-bottom:12px}
        .meta{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;border:1px solid #94a3b8;padding:8px;border-radius:6px;margin-bottom:14px;font-size:11px}
        .qbox{margin-bottom:10px;padding-bottom:8px;border-bottom:1px dashed #cbd5e1;page-break-inside:avoid}
        .qmeta{font-size:9.5px;color:#0f766e;font-weight:700}
        .qtxt{font-weight:700;margin:2px 0 4px}
        .qopts{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;font-size:11px}
        .pb{page-break-before:always}
        .omr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 18px;margin:14px 0}
        .omr-row{display:flex;align-items:center;gap:6px;padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px}
        .omr-num{font-weight:800;width:24px}
        .bub{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border:1.5px solid #0f172a;border-radius:50%;font-size:10.5px;font-weight:700}
        table{width:100%;border-collapse:collapse;font-size:10.5px}
        th,td{border:1px solid #cbd5e1;padding:5px;text-align:left}
        th{background:#0f2247;color:#fff}
        .qr{display:flex;align-items:center;gap:12px;margin-top:14px;border:1.5px solid #0f766e;padding:8px;border-radius:8px}
      </style></head><body>
        <div class="hdr"><img src="${inst.escudo}" style="height:52px"/><div style="text-align:center"><h2 style="margin:0;font-size:15px">${inst.nombre}</h2><div>📍 ${inst.provincia || "Heredia"} • ${inst.regional} • ${inst.circuito}</div><h3 style="margin:3px 0 0;color:#0f766e">FOLLETO DE PRÁCTICA / PRUEBA — ${areaNombre.toUpperCase()} (${items.length} ÍTEMS)</h3></div><img src="${b.logoMep}" style="height:40px"/></div>
        <div class="meta"><div><b>Estudiante:</b> _______________________________________</div><div><b>Sección:</b> _________</div><div><b>Fecha:</b> ____/____/2026</div></div>
        ${preguntasHtml}

        <div class="pb"></div>
        <div class="hdr"><img src="${inst.escudo}" style="height:46px"/><div style="text-align:center"><h2 style="margin:0;font-size:14.5px">HOJA DE RESPUESTAS OFICIAL (TIPO BURBUJA)</h2><div>${areaNombre} • Rellene completamente el círculo de su respuesta (A, B, C o D)</div></div><img src="${b.logoMep}" style="height:36px"/></div>
        <div class="meta"><div><b>Nombre Completo:</b> __________________________________</div><div><b>Cédula/TIM:</b> ___________</div><div><b>Nota:</b> _____ / 100</div></div>
        <div class="omr-grid">${burbujasHtml}</div>
        <div class="qr">${generarQRSVG ? generarQRSVG("PT-OMR|" + hash, 82) : ""}<div><b>Hoja de Respuestas Verificable QR SHA-256</b><br/><code>${hash}</code><br/><small>Generado en pracTICAtecnica.com (Herramienta independiente; no oficial MEP) por ${(sesion && sesion.nombre) || "Usuario"}.</small></div></div>

        <div class="pb"></div>
        <div class="hdr"><img src="${inst.escudo}" style="height:44px"/><div style="text-align:center"><h2 style="margin:0;font-size:14px">CLAVE DE RESPUESTAS E INDICADORES REAC (USO DOCENTE / AUTOEVALUACIÓN)</h2><div>${areaNombre} • Código de Verificación: ${hash}</div></div><img src="${b.logoMep}" style="height:36px"/></div>
        <table><tr><th>#</th><th>Clave</th><th>Respuesta Correcta</th><th>Unidad de Estudio e Indicador REAC</th></tr>${claveHtml}</table>
        <script>window.onload=()=>window.print();</script>
      </body></html>`);
      w.document.close();
    })();
  }

  window.BDS_IMPRIMIR_HOJA_RESPUESTAS = imprimirHojaRespuestasOMR;
})();