(function () {
  const PLAN_KEY = "bds_planes_inversos_v189";

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=189",
      logoMep: "/logo-mep-oficial.png?v=189"
    };
  }

  function loadPlanes() { try { return JSON.parse(localStorage.getItem(PLAN_KEY)) || []; } catch { return []; } }
  function savePlanes(a) { localStorage.setItem(PLAN_KEY, JSON.stringify(a)); }

  // DISEÑO INVERSO (Backward Design): lee los ítems reales del banco y construye todo el planeamiento MEP
  async function construirPlanDesdeItems(cfg, docenteNombre, sha256Hex) {
    const { areaId, areaName, areaCat, nivel, bloques, diff, numItems, unidad } = cfg;
    const minTot = Number(bloques || 4) * 40;
    const f1 = Math.round(minTot * 0.15), f2 = Math.round(minTot * 0.25), f3 = Math.round(minTot * 0.25), f4 = minTot - f1 - f2 - f3;

    // Tomar ítems reales y puros de esta asignatura desde window.BDS_BANCO_CURADO
    const muestra = window.BDS_GENERAR_SIMULACRO
      ? window.BDS_GENERAR_SIMULACRO(areaId, Number(numItems || 6), diff || "ALL")
      : [];

    const conceptosClave = muestra.slice(0, 5).map(it => {
      const okOpt = (it.opts || []).find(o => o.ok);
      return {
        pregunta: it.q.replace(/^\[[^\]]+\]\s*/, ""),
        respuesta: okOpt ? okOpt.txt : (it.o ? it.o[0] : ""),
        errorComun: ((it.opts || []).find(o => !o.ok) || {}).txt || "Confusión conceptual frecuente",
        explicacion: it.e || "",
        nivel: it.d || "Intermedio"
      };
    });

    const saberes = conceptosClave.map(c => `${c.respuesta} — ${c.explicacion}`);
    const ra = `Demostrar dominio práctico y conceptual en ${areaName} (${nivel}, ${unidad}), resolviendo con precisión y criterio técnico los ítems y situaciones evaluativas clave de la disciplina.`;

    const reto1 = conceptosClave[0] ? conceptosClave[0].pregunta : `Reto diagnóstico de ${areaName}`;
    const err1 = conceptosClave[0] ? conceptosClave[0].errorComun : "conceptos erróneos comunes";
    const resp2 = conceptosClave[1] ? conceptosClave[1].respuesta : `aplicación técnica de ${areaName}`;
    const reto3 = conceptosClave[2] ? conceptosClave[2].pregunta : `contraste de evidencias en ${areaName}`;

    // 4 Momentos MEP con Binomio Sagrado construidos INVERSAMENTE desde las preguntas reales
    const momentos = [
      {
        fase: `1. Focalización (${f1} min) — Diagnóstico basado en ítems`,
        texto: `La persona docente presenta como reto detonador la pregunta real del banco: "${reto1}", explorando hipótesis previas sin revelar la respuesta. La persona estudiante analiza el enunciado, discute en parejas posibles soluciones y registra su hipótesis inicial en su cuaderno o entorno digital.`
      },
      {
        fase: `2. Exploración (${f2} min) — Construcción de saberes evaluados`,
        texto: `La persona docente modela paso a paso los conceptos esenciales detectados en los ${muestra.length} ítems seleccionados (enfatizando "${resp2}") con recursos multimodales DUA. La persona estudiante experimenta y resuelve una guía práctica colaborativa aplicando cada concepto en casos reales de ${areaName}.`
      },
      {
        fase: `3. Contrastación (${f3} min) — Análisis de errores frecuentes (distractores)`,
        texto: `La persona docente promueve un debate técnico analizando por qué el distractor frecuente "${err1}" es incorrecto frente a la pregunta "${reto3}". La persona estudiante contrasta sus respuestas con las justificaciones oficiales, corrige vacíos conceptuales y redacta reglas prácticas de verificación.`
      },
      {
        fase: `4. Aplicación (${f4} min) — Demostración y minisimulacro REA`,
        texto: `La persona docente aplica el minisimulacro de verificación con los ${muestra.length} ítems calibrados y evalúa mediante rúbrica analítica (niveles 1–3). La persona estudiante resuelve autónomamente la evidencia final y entrega su producto por canales oficiales MEP (Microsoft Teams / @est.mep.go.cr).`
      }
    ];

    const opcionesSteam = [
      `Debate crítico sobre los distractores reales de ${areaName}.`,
      `Estación práctica / laboratorio guiado resolviendo casos del banco.`,
      `Exposición relámpago de 3 min explicando una pregunta clave.`,
      `Resolución colaborativa en parejas con coevaluación REA.`,
      `Mapa conceptual visual (DUA) conectando los ${muestra.length} saberes.`,
      `Trivia relámpago gamificada en pracTICAtecnica.com para cerrar la lección.`
    ];

    const inclusividad = {
      dua: `Múltiples formas de representación (audio TTS integrado en ítems, esquemas visuales y lectura guiada), acción y compromiso.`,
      altoPotencial: `Reto avanzado: diseñar 3 ítems originales con sus distractores fundamentados y justificación técnica sobre ${areaName}.`,
      adecuaciones: `Adecuación de acceso (tiempo adicional, tipografía ampliada, apoyo visual) y adecuación significativa priorizando aprendizajes esenciales.`
    };

    const indicadores = conceptosClave.slice(0, 3).map((c, idx) => ({
      ind: `Ind. ${idx + 1}: Aplica y justifica "${c.respuesta.slice(0, 58)}" en situaciones de ${areaName}.`,
      n1: "Reconoce el concepto básico con apoyo docente.",
      n2: "Resuelve correctamente ejercicios guiados con mínimos errores.",
      n3: "Resuelve, argumenta y descarta distractores con autonomía total."
    }));

    const tablaEspec = {
      basico: muestra.filter(x => x.d === "Básico").length,
      medio: muestra.filter(x => x.d === "Medio").length,
      intermedio: muestra.filter(x => x.d === "Intermedio").length,
      avanzado: muestra.filter(x => x.d === "Avanzado").length
    };

    const fecha = new Date().toLocaleDateString("es-CR");
    const hash = (await sha256Hex(`PLAN-INV|${fecha}|${docenteNombre}|${areaId}|${muestra.length}`)).slice(0, 18);

    return { id: "PLI-" + Date.now().toString().slice(-5), fecha, docente: docenteNombre, areaId, areaName, areaCat, nivel, unidad, bloques, minTot, ra, saberes, momentos, opcionesSteam, inclusividad, indicadores, tablaEspec, itemsUsados: conceptosClave, totalItems: muestra.length, hash };
  }

  function imprimirPlanInversoPDF(p, generarQRSVG) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Planeamiento Inverso MEP - ${p.areaName}</title><style>body{font-family:Inter,Arial,sans-serif;padding:22px;color:#0f172a;font-size:11.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:12px}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #94a3b8;padding:7px;vertical-align:top;text-align:left}th{background:#0f2247;color:#fff}.meta td{background:#f8fafc}</style></head><body>
      <div class="hdr"><img src="${b.escudo}" style="height:60px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div>${b.regional} • ${b.circuito}</div><h3 style="margin:4px 0 0;color:#0f766e">PLANEAMIENTO INVERSO MEP (GENERADO DESDE BANCO DE ÍTEMS)</h3></div><img src="${b.logoMep}" style="height:46px"/></div>
      <table class="meta"><tr><td><b>Persona Docente:</b> ${p.docente}</td><td><b>Asignatura / Especialidad:</b> ${p.areaName}</td><td><b>Área:</b> ${p.areaCat}</td></tr><tr><td><b>Nivel:</b> ${p.nivel}</td><td><b>Unidad:</b> ${p.unidad}</td><td><b>Tiempo:</b> ${p.bloques} lecciones (${p.minTot} min) • ${p.fecha}</td></tr></table>
      <table><tr><th style="width:18%">Resultado de Aprendizaje</th><th style="width:20%">Saberes (del Banco de Ítems)</th><th style="width:36%">Mediación (4 Momentos MEP + Binomio Sagrado + DUA)</th><th style="width:26%">Indicadores REA (1–3) & Tabla Especificaciones</th></tr>
      <tr><td>${p.ra}</td><td><ul>${p.saberes.map(s => `<li>${s}</li>`).join("")}</ul></td><td>${p.momentos.map(m => `<p style="margin:0 0 6px"><b>${m.fase}:</b> ${m.texto}</p>`).join("")}<p style="margin:6px 0 0"><b>DUA:</b> ${p.inclusividad.dua}<br/><b>Alto Potencial:</b> ${p.inclusividad.altoPotencial}<br/><b>Adecuaciones:</b> ${p.inclusividad.adecuaciones}</p></td><td>${p.indicadores.map(i => `<p style="margin:0 0 6px"><b>${i.ind}</b><br/>1: ${i.n1}<br/>2: ${i.n2}<br/>3: ${i.n3}</p>`).join("")}<hr/><b>Tabla Especificaciones (${p.totalItems} ítems):</b> Básico: ${p.tablaEspec.basico} • Medio: ${p.tablaEspec.medio} • Interm: ${p.tablaEspec.intermedio} • Avanz: ${p.tablaEspec.avanzado}</td></tr></table>
      <h4 style="margin:8px 0 4px">Anexo: Ítems Base del Aula (Evaluación Diagnóstica / Formativa)</h4>
      <ol>${p.itemsUsados.map(it => `<li style="margin-bottom:5px"><b>[${it.nivel}]</b> ${it.pregunta}<br/><i>Clave:</i> ${it.respuesta} — ${it.explicacion}</li>`).join("")}</ol>
      <div style="display:flex;align-items:center;gap:12px;border:1px solid #0f766e;padding:8px;border-radius:8px;margin-top:10px">${generarQRSVG("PT-PLAN|" + p.hash, 82)}<div><b>Opciones STEAM:</b> ${p.opcionesSteam.join(" • ")}<br/><b>Sello SHA-256:</b> <code>${p.hash}</code></div></div>
      <script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_RENDER_PLANEAMIENTO_IA = function (shell, ctx) {
    /* bds-planes-solo-docentes-v195 */ const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx; if (!sesion || !["SuperAdmin", "Docente MEP"].includes(sesion.rol)) { shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0 0 6px;">🚫 Módulo Exclusivo para Docentes MEP</h3><p style="font-size:12.5px;color:#94a3b8;margin:0;">El Generador de Planeamientos con IA está habilitado únicamente para el perfil <b>Docente MEP</b> y <b>SuperAdmin</b>.</p></div>`; return; }
    const malla = window.BDS_MALLA_MEP || [];
    let areaId = malla[0] ? malla[0].id : "web";
    let nivel = "11° Año";
    let bloques = "4";
    let diff = "ALL";
    let numItems = "6";
    let unidad = "Unidad 1 — Aplicación y Evaluación por Competencias";
    let planActual = loadPlanes()[0] || null;

    function draw() {
      const mat = malla.find(m => m.id === areaId) || malla[0] || { id: "web", name: "Desarrollo Web", cat: "Técnica" };
      const st = window.__BDS_BANCO_STATS || { afterByArea: {} };
      const historial = loadPlanes();

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">DISEÑO INVERSO IA • BINOMIO SAGRADO • 29 ÁREAS MEP</span>
            <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🤖 Planeamiento Inverso Automático con IA (Basado en el Banco de Ítems)</h2>
            <p style="margin:3px 0 0;font-size:12px;color:#94a3b8;">El sistema analiza preguntas reales y distractores del banco de tu asignatura para generar automáticamente los <b>4 Momentos MEP</b>, <b>DUA</b>, <b>Rúbricas 1–3</b>, <b>Tabla de Especificaciones</b> y <b>Diagnóstico de Aula</b>.</p>
          </div>

          <form id="pl-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:10px;">
            <div style="grid-column:span 2;">
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">1. Especialidad / Asignatura (todas las 29 áreas)</label>
              <select id="pl-area" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${malla.map(m => `<option value="${m.id}" ${areaId===m.id?"selected":""}>${m.name} (${st.afterByArea[m.id] || 0} ítems)</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">2. Nivel Educativo</label>
              <select id="pl-niv" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${["Primaria (1°-6°)","7° Año","8° Año","9° Año","10° Año","11° Año","12° Año"].map(n => `<option value="${n}" ${nivel===n?"selected":""}>${n}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">3. Lecciones (40 min c/u)</label>
              <select id="pl-blo" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${[["2","2 lecciones (80 min)"],["4","4 lecciones (160 min)"],["6","6 lecciones (240 min)"],["8","8 lecciones (320 min)"]].map(([v,l]) => `<option value="${v}" ${bloques===v?"selected":""}>${l}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">4. Dificultad de Ítems Base</label>
              <select id="pl-diff" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                <option value="ALL" ${diff==="ALL"?"selected":""}>Balanceado (4 niveles)</option>
                <option value="Básico" ${diff==="Básico"?"selected":""}>Básico</option>
                <option value="Medio" ${diff==="Medio"?"selected":""}>Medio</option>
                <option value="Intermedio" ${diff==="Intermedio"?"selected":""}>Intermedio</option>
                <option value="Avanzado" ${diff==="Avanzado"?"selected":""}>Avanzado</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">5. Ítems del Banco a Analizar</label>
              <select id="pl-num" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                <option value="5" ${numItems==="5"?"selected":""}>5 ítems calibrados</option>
                <option value="6" ${numItems==="6"?"selected":""}>6 ítems calibrados</option>
                <option value="10" ${numItems==="10"?"selected":""}>10 ítems calibrados</option>
                <option value="15" ${numItems==="15"?"selected":""}>15 ítems calibrados</option>
              </select>
            </div>
            <div style="grid-column:1/-1;">
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">6. Nombre de la Unidad / Semestre</label>
              <input id="pl-uni" type="text" value="${unidad}" required style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:13px;"/>
            </div>
            <div style="grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap;">
              <button type="submit" style="background:#7c3aed;color:#fff;border:none;padding:11px 18px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;min-height:44px;">⚡ Generar Planeamiento Inverso desde Ítems</button>
              <button type="button" id="pl-aiq" style="background:#0284c7;color:#fff;border:none;padding:11px 16px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;min-height:44px;">🤖 Crear Más Preguntas IA</button>
            </div>
          </form>
        </div>

        ${planActual ? `
          <div class="bds-card" style="margin-bottom:14px;border-color:#7c3aed;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              <div>
                <h3 style="margin:0;color:#fff;font-size:16px;">📘 ${planActual.areaName} — ${planActual.nivel} (${planActual.totalItems} ítems base)</h3>
                <div style="font-size:11.5px;color:#94a3b8;">Docente: <b>${planActual.docente}</b> • ${planActual.bloques} lecciones (${planActual.minTot} min) • SHA-256: <code style="color:#34d399;">${planActual.hash}</code></div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button id="pl-prt" style="background:#059669;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🖨️ Imprimir PDF MEP + Cuadernillo</button>
                <button id="pl-cpy" style="background:#1d4ed8;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📋 Copiar Texto</button>
              </div>
            </div>

            <div style="overflow-x:auto;margin-bottom:12px;">
              <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:8px;text-align:left;width:18%;">Resultado de Aprendizaje</th>
                  <th style="padding:8px;text-align:left;width:20%;">Saberes Extraídos del Banco</th>
                  <th style="padding:8px;text-align:left;width:38%;">Mediación (4 Momentos MEP + Binomio Sagrado)</th>
                  <th style="padding:8px;text-align:left;width:24%;">Indicadores REA (1–3)</th>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;">${planActual.ra}</td>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;"><ul style="margin:0;padding-left:16px;">${planActual.saberes.map(s => `<li style="margin-bottom:5px;">${s}</li>`).join("")}</ul></td>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;">
                    ${planActual.momentos.map(m => `<div style="margin-bottom:8px;"><b style="color:#38bdf8;">${m.fase}:</b> ${m.texto}</div>`).join("")}
                    <div style="background:#070d19;padding:8px;border-radius:7px;font-size:11.5px;margin-top:6px;">
                      <div><b style="color:#34d399;">DUA:</b> ${planActual.inclusividad.dua}</div>
                      <div><b style="color:#fbbf24;">Alto Potencial:</b> ${planActual.inclusividad.altoPotencial}</div>
                      <div><b style="color:#c084fc;">Adecuaciones:</b> ${planActual.inclusividad.adecuaciones}</div>
                    </div>
                  </td>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;">
                    ${planActual.indicadores.map(i => `<div style="margin-bottom:8px;"><b>${i.ind}</b><div style="font-size:11px;color:#94a3b8;">1: ${i.n1}<br/>2: ${i.n2}<br/>3: ${i.n3}</div></div>`).join("")}
                  </td>
                </tr>
              </table>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:10px;padding:12px;">
              <b style="color:#fbbf24;font-size:12.5px;">🎯 Ítems Reales del Banco usados como base de esta clase (con error común detectado):</b>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;margin-top:8px;">
                ${planActual.itemsUsados.map((it, i) => `<div style="background:#0b1322;border:1px solid #334155;border-radius:8px;padding:9px;font-size:11.5px;"><b style="color:#fff;">${i+1}. [${it.nivel}] ${it.pregunta}</b><div style="color:#34d399;margin-top:3px;">✓ Clave: ${it.respuesta}</div><div style="color:#fca5a5;">⚠ Distractor común: ${it.errorComun}</div></div>`).join("")}
              </div>
            </div>
          </div>
        ` : ""}

        ${historial.length > 1 ? `
          <div class="bds-card">
            <h4 style="margin:0 0 8px;color:#38bdf8;">📚 Historial de Planeamientos Inversos (${historial.length})</h4>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${historial.slice(0, 8).map(h => `<button data-hid="${h.id}" class="pl-hist" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:11.5px;cursor:pointer;">${h.fecha} • ${h.areaName}</button>`).join("")}
            </div>
          </div>
        ` : ""}
      `;

      document.getElementById("pl-area").onchange = (e) => { areaId = e.target.value; };
      document.getElementById("pl-niv").onchange = (e) => { nivel = e.target.value; };
      document.getElementById("pl-blo").onchange = (e) => { bloques = e.target.value; };
      document.getElementById("pl-diff").onchange = (e) => { diff = e.target.value; };
      document.getElementById("pl-num").onchange = (e) => { numItems = e.target.value; };
      document.getElementById("pl-uni").oninput = (e) => { unidad = e.target.value; };
      document.getElementById("pl-aiq").onclick = () => { if (window.BDS_OPEN_AI_ITEMS) window.BDS_OPEN_AI_ITEMS(); };

      document.getElementById("pl-f").onsubmit = async (e) => {
        e.preventDefault();
        const mSel = malla.find(m => m.id === areaId) || mat;
        const nuevo = await construirPlanDesdeItems({ areaId: mSel.id, areaName: mSel.name, areaCat: mSel.cat, nivel, bloques, diff, numItems, unidad: unidad.trim() }, sesion.nombre, sha256Hex);
        const arr = loadPlanes();
        arr.unshift(nuevo);
        savePlanes(arr.slice(0, 20));
        planActual = nuevo;
        if (ganarXP) ganarXP(30, "🤖 Planeamiento Inverso IA");
        draw();
      };
      if (document.getElementById("pl-prt")) document.getElementById("pl-prt").onclick = () => imprimirPlanInversoPDF(planActual, generarQRSVG);
      if (document.getElementById("pl-cpy")) document.getElementById("pl-cpy").onclick = () => {
        const txt = `PLANEAMIENTO INVERSO MEP — ${planActual.areaName} (${planActual.nivel})\nRA: ${planActual.ra}\n` + planActual.momentos.map(m => `${m.fase}: ${m.texto}`).join("\n");
        navigator.clipboard && navigator.clipboard.writeText(txt).catch(() => {});
        alert("📋 Planeamiento copiado al portapapeles.");
      };
      shell.querySelectorAll(".pl-hist").forEach(b => b.onclick = () => {
        planActual = loadPlanes().find(x => x.id === b.getAttribute("data-hid")) || planActual;
        draw();
      });
    }
    draw();
  };
})();