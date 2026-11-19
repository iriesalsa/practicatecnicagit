(function () {
  const PLAN_KEY = "bds_planes_ia_mep_v187";

  const JERARQUIA_MEP = {
    "Desarrollo Web": {
      subareas: ["Programación Web (HTML/CSS/JS/React)", "Diseño de Software y Arquitectura", "Tecnologías de Información Aplicadas", "Inglés para Desarrollo Web"],
      unidades: [
        "Unidad 1: Fundamentos de Interfaces Responsivas y Accesibilidad DUA",
        "Unidad 2: Programación en JavaScript Moderno y Consumo de APIs REST",
        "Unidad 3: Persistencia de Datos en PostgreSQL / Supabase con Seguridad RLS",
        "Unidad 4: Despliegue Continuo PWA Offline-First y Control de Calidad"
      ]
    },
    "Ciberseguridad": {
      subareas: ["Fundamentos de Seguridad de la Información", "Seguridad en Redes y Protocolos", "Hacking Ético y Auditoría OWASP", "Normativa Ley N.° 8968 (PRODHAB)"],
      unidades: [
        "Unidad 1: Tríada CIA, Gestión de Riesgos y Criptografía Aplicada (SHA-256)",
        "Unidad 2: Endurecimiento de Sistemas, RBAC y Autenticación Multifactor",
        "Unidad 3: Análisis de Vulnerabilidades Web (OWASP Top 10) y Respuesta a Incidentes"
      ]
    },
    "Soporte TI y Redes": {
      subareas: ["Arquitectura de Computadoras", "Redes Locales y Enrutamiento", "Sistemas Operativos y Virtualización"],
      unidades: [
        "Unidad 1: Diagnóstico y Mantenimiento Preventivo de Hardware",
        "Unidad 2: Direccionamiento IPv4/IPv6, Subredes y Cableado Estructurado"
      ]
    },
    "Contabilidad y Finanzas": {
      subareas: ["Contabilidad General", "Finanzas y Presupuestos", "Legislación Tributaria Costarricense"],
      unidades: [
        "Unidad 1: Ciclo Contable, Asientos de Diario y Estados Financieros",
        "Unidad 2: Control de Inventarios, Costos y Cumplimiento Tributario"
      ]
    },
    "Académica (III Ciclo y Diversificada)": {
      subareas: ["Matemática", "Español", "Inglés", "Ciencias / Biología", "Física", "Química", "Estudios Sociales", "Educación Cívica"],
      unidades: [
        "Unidad 1: Resolución de Problemas Contextualizados y Modelización",
        "Unidad 2: Pensamiento Crítico, Argumentación y Evidencia Científica"
      ]
    }
  };

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=187",
      logoMep: "/logo-mep-oficial.png?v=187"
    };
  }

  function loadPlanes() { try { return JSON.parse(localStorage.getItem(PLAN_KEY)) || []; } catch { return []; } }
  function savePlanes(a) { localStorage.setItem(PLAN_KEY, JSON.stringify(a)); }

  async function construirPlanIA(cfg, docenteNombre, sha256Hex) {
    const { especialidad, subarea, nivel, unidad, tema, bloques } = cfg;
    const minTot = Number(bloques || 2) * 40;
    const f1 = Math.round(minTot * 0.15), f2 = Math.round(minTot * 0.25), f3 = Math.round(minTot * 0.25), f4 = minTot - f1 - f2 - f3;

    const ra = `Aplicar los principios técnicos y metodológicos de "${tema}" en la subárea ${subarea} (${nivel}), integrando soluciones funcionales con rigor de calidad y ética profesional.`;
    const saberes = [
      `Conceptos fundamentales y vocabulario técnico de ${tema}.`,
      `Procedimientos estandarizados, buenas prácticas y validación de resultados en ${subarea}.`,
      `Seguridad, accesibilidad y trazabilidad vinculadas a ${tema}.`
    ];

    // 4 Momentos MEP escritos estrictamente con el Binomio Sagrado + 6 opciones STEAM
    const momentos = [
      {
        fase: `1. Focalización (${f1} min)`,
        texto: `La persona docente plantea un reto real contextualizado sobre "${tema}" mediante una demostración interactiva y preguntas detonadoras. La persona estudiante analiza el problema inicial, recupera conocimientos previos y formula hipótesis colaborativas en su bitácora digital.`
      },
      {
        fase: `2. Exploración (${f2} min)`,
        texto: `La persona docente modela paso a paso el procedimiento técnico de "${tema}" usando recursos visuales multimodales (DUA). La persona estudiante experimenta en equipos cooperativos construyendo un prototipo guiado, documentando hallazgos y verificando casos de prueba.`
      },
      {
        fase: `3. Contrastación (${f3} min)`,
        texto: `La persona docente facilita un debate técnico estructurado comparando las soluciones estudiantiles con los estándares oficiales de ${especialidad}. La persona estudiante contrasta sus resultados, corrige fallos de lógica o ejecución y fundamenta las mejoras bajo el principio Kaizen.`
      },
      {
        fase: `4. Aplicación (${f4} min)`,
        texto: `La persona docente asigna el reto integrador final con rúbrica analítica (niveles 1–3). La persona estudiante diseña, ejecuta y expone una solución funcional original sobre "${tema}", entregando evidencia verificable por los canales oficiales MEP (Microsoft Teams / correo @est.mep.go.cr).`
      }
    ];

    const opcionesSteam = [
      `Debate técnico guiado sobre casos reales de "${tema}".`,
      `Prototipado práctico / laboratorio demostrativo paso a paso.`,
      `Exposición relámpago (pitch de 3 min) defendiendo decisiones de diseño.`,
      `Resolución de fallos en parejas (debugging / estudio de caso).`,
      `Infografía o diagrama visual multimodal de arquitectura de "${tema}".`,
      `Coevaluación entre pares usando lista de cotejo oficial REA.`
    ];

    const inclusividad = {
      dua: `Representación múltiple (texto + diagrama + audio TTS), expresión flexible (oral, escrita o prototipo) y motivación mediante retos auténticos.`,
      altoPotencial: `Reto de extensión avanzada: optimización de rendimiento, seguridad adicional y mentoría entre pares sobre "${tema}".`,
      adecuaciones: `Adecuación de acceso (tiempo adicional, tipografía ampliada, instrucciones segmentadas) y adecuación significativa ajustada a objetivos esenciales cuando corresponda.`
    };

    const indicadores = [
      { ind: `Identifica los fundamentos esenciales de ${tema} en ${subarea}.`, n1: "Cita aspectos básicos con apoyo.", n2: "Explica componentes y relaciones con claridad.", n3: "Integra y justifica con precisión técnica autónoma." },
      { ind: `Ejecuta y valida una solución práctica aplicando ${tema}.`, n1: "Realiza pasos iniciales de forma guiada.", n2: "Completa el procedimiento con mínimos ajustes.", n3: "Construye, depura y optimiza el producto cumpliendo todos los criterios." }
    ];

    const evidencias = `Trabajo Cotidiano (rúbrica 1–3), Tarea corta de investigación aplicada, Avance de Proyecto STEAM y Tabla de Especificaciones para prueba escrita.`;
    const fecha = new Date().toLocaleDateString("es-CR");
    const hash = (await sha256Hex(`PLAN-MEP|${fecha}|${docenteNombre}|${especialidad}|${subarea}|${tema}`)).slice(0, 18);

    return { id: "PLN-" + Date.now().toString().slice(-5), fecha, docente: docenteNombre, especialidad, subarea, nivel, unidad, tema, bloques, minTot, ra, saberes, momentos, opcionesSteam, inclusividad, indicadores, evidencias, hash };
  }

  function imprimirPlanPDF(p, generarQRSVG) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el planeamiento oficial.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Plan Práctica Pedagógica MEP - ${p.tema}</title><style>body{font-family:Inter,Arial,sans-serif;padding:22px;color:#0f172a;font-size:11.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:12px}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #94a3b8;padding:7px;vertical-align:top;text-align:left}th{background:#0f2247;color:#fff}.meta td{background:#f8fafc}</style></head><body>
      <div class="hdr"><img src="${b.escudo}" style="height:62px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div>${b.regional} • ${b.circuito}</div><h3 style="margin:4px 0 0;color:#0f766e">PLAN DE PRÁCTICA PEDAGÓGICA MEP (AUTOMATIZADO)</h3></div><img src="${b.logoMep}" style="height:46px"/></div>
      <table class="meta"><tr><td><b>Persona Docente:</b> ${p.docente}</td><td><b>Especialidad:</b> ${p.especialidad}</td><td><b>Subárea:</b> ${p.subarea}</td></tr><tr><td><b>Nivel:</b> ${p.nivel}</td><td><b>Unidad:</b> ${p.unidad}</td><td><b>Tiempo:</b> ${p.bloques} lecciones (${p.minTot} min) • ${p.fecha}</td></tr></table>
      <table><tr><th style="width:18%">Resultado de Aprendizaje</th><th style="width:18%">Saberes</th><th style="width:34%">Estrategias de Mediación (4 Momentos MEP + Binomio Sagrado + DUA)</th><th style="width:18%">Indicadores (1–3)</th><th style="width:12%">Evidencias</th></tr>
      <tr><td>${p.ra}</td><td><ul>${p.saberes.map(s => `<li>${s}</li>`).join("")}</ul></td><td>${p.momentos.map(m => `<p style="margin:0 0 6px"><b>${m.fase}:</b> ${m.texto}</p>`).join("")}<p style="margin:6px 0 0"><b>DUA:</b> ${p.inclusividad.dua}<br/><b>Alto Potencial:</b> ${p.inclusividad.altoPotencial}<br/><b>Adecuaciones:</b> ${p.inclusividad.adecuaciones}</p></td><td>${p.indicadores.map(i => `<p style="margin:0 0 6px"><b>${i.ind}</b><br/>1: ${i.n1}<br/>2: ${i.n2}<br/>3: ${i.n3}</p>`).join("")}</td><td>${p.evidencias}</td></tr></table>
      <div style="display:flex;align-items:center;gap:14px;border:1px solid #0f766e;padding:8px;border-radius:8px">${generarQRSVG("PT-PLAN|" + p.hash, 86)}<div><b>Opciones STEAM:</b> ${p.opcionesSteam.join(" • ")}<br/><b>Sello SHA-256:</b> <code>${p.hash}</code></div></div>
      <script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_RENDER_PLANEAMIENTO_IA = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const espKeys = Object.keys(JERARQUIA_MEP);
    let selEsp = espKeys[0];
    let selSub = JERARQUIA_MEP[selEsp].subareas[0];
    let selUni = JERARQUIA_MEP[selEsp].unidades[0];
    let selNiv = "11° Año";
    let selBlo = "4";
    let temaVal = "Diseño de Interfaces Responsivas y Consumo de APIs";
    let planActual = loadPlanes()[0] || null;

    function draw() {
      const subs = JERARQUIA_MEP[selEsp].subareas;
      const unis = JERARQUIA_MEP[selEsp].unidades;
      if (!subs.includes(selSub)) selSub = subs[0];
      if (!unis.includes(selUni)) selUni = unis[0];
      const historial = loadPlanes();

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FORMATO OFICIAL MEP • BINOMIO SAGRADO • DUA + STEAM</span>
            <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🤖 Generador de Planeamientos Automáticos con IA (Móvil y Desktop)</h2>
            <p style="margin:3px 0 0;font-size:12px;color:#94a3b8;">Jerarquía estricta: <b>Especialidad → Subárea → Nivel → Unidad → Tema</b>. Incluye 4 momentos MEP, 6 estrategias STEAM, DUA, Alto Potencial, Adecuaciones y sello QR SHA-256.</p>
          </div>

          <form id="pl-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:10px;margin-bottom:14px;">
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">1. Especialidad / Área</label>
              <select id="pl-esp" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${espKeys.map(k => `<option value="${k}" ${selEsp===k?"selected":""}>${k}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">2. Subárea / Asignatura</label>
              <select id="pl-sub" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${subs.map(s => `<option value="${s}" ${selSub===s?"selected":""}>${s}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">3. Nivel</label>
              <select id="pl-niv" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${["7° Año","8° Año","9° Año","10° Año","11° Año","12° Año"].map(n => `<option value="${n}" ${selNiv===n?"selected":""}>${n}</option>`).join("")}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">4. Lecciones (40 min c/u)</label>
              <select id="pl-blo" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${[["2","2 lecciones (80 min)"],["4","4 lecciones (160 min)"],["6","6 lecciones (240 min)"],["8","8 lecciones (320 min)"]].map(([v,l]) => `<option value="${v}" ${selBlo===v?"selected":""}>${l}</option>`).join("")}
              </select>
            </div>
            <div style="grid-column:1/-1;">
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">5. Unidad de Estudio Oficial</label>
              <select id="pl-uni" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                ${unis.map(u => `<option value="${u}" ${selUni===u?"selected":""}>${u}</option>`).join("")}
              </select>
            </div>
            <div style="grid-column:1/-1;">
              <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">6. Tema / Resultado de Aprendizaje específico</label>
              <input id="pl-tema" type="text" required value="${temaVal}" placeholder="Escriba el tema específico de su clase..." style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:13px;"/>
            </div>
            <div style="grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap;">
              <button type="submit" style="background:#7c3aed;color:#fff;border:none;padding:11px 18px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;min-height:44px;">⚡ Generar Planeamiento MEP Automático (IA)</button>
              <button type="button" id="pl-aiq" style="background:#0284c7;color:#fff;border:none;padding:11px 16px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;min-height:44px;">🤖 Generar Preguntas IA de este Tema</button>
            </div>
          </form>
        </div>

        ${planActual ? `
          <div class="bds-card" style="margin-bottom:14px;border-color:#7c3aed;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              <div>
                <h3 style="margin:0;color:#fff;font-size:16px;">📘 ${planActual.tema} (${planActual.subarea} • ${planActual.nivel})</h3>
                <div style="font-size:11.5px;color:#94a3b8;">Docente: <b>${planActual.docente}</b> • ${planActual.bloques} lecciones (${planActual.minTot} min) • SHA-256: <code style="color:#34d399;">${planActual.hash}</code></div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button id="pl-prt" style="background:#059669;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🖨️ Imprimir PDF MEP + QR</button>
                <button id="pl-cpy" style="background:#1d4ed8;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📋 Copiar Texto</button>
              </div>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:740px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:8px;text-align:left;width:18%;">Resultado de Aprendizaje</th>
                  <th style="padding:8px;text-align:left;width:18%;">Saberes</th>
                  <th style="padding:8px;text-align:left;width:36%;">Mediación (4 Momentos MEP + Binomio Sagrado)</th>
                  <th style="padding:8px;text-align:left;width:18%;">Indicadores (1–3)</th>
                  <th style="padding:8px;text-align:left;width:10%;">Evidencias</th>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;">${planActual.ra}</td>
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;"><ul style="margin:0;padding-left:16px;">${planActual.saberes.map(s => `<li>${s}</li>`).join("")}</ul></td>
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
                  <td style="padding:8px;border:1px solid #1e293b;vertical-align:top;font-size:11.5px;">${planActual.evidencias}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top:10px;background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:10px;font-size:11.5px;">
              <b style="color:#fbbf24;">⚙️ 6 Opciones de Mediación STEAM integradas:</b> ${planActual.opcionesSteam.join(" • ")}
            </div>
          </div>
        ` : ""}

        ${historial.length > 1 ? `
          <div class="bds-card">
            <h4 style="margin:0 0 8px;color:#38bdf8;">📚 Historial de Planeamientos Generados (${historial.length})</h4>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${historial.slice(0, 8).map(h => `<button data-hid="${h.id}" class="pl-hist" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:11.5px;cursor:pointer;">${h.fecha} • ${h.tema.slice(0, 32)}</button>`).join("")}
            </div>
          </div>
        ` : ""}
      `;

      document.getElementById("pl-esp").onchange = (e) => { selEsp = e.target.value; draw(); };
      document.getElementById("pl-sub").onchange = (e) => { selSub = e.target.value; };
      document.getElementById("pl-niv").onchange = (e) => { selNiv = e.target.value; };
      document.getElementById("pl-blo").onchange = (e) => { selBlo = e.target.value; };
      document.getElementById("pl-uni").onchange = (e) => { selUni = e.target.value; };
      document.getElementById("pl-tema").oninput = (e) => { temaVal = e.target.value; };
      document.getElementById("pl-aiq").onclick = () => { if (window.BDS_OPEN_AI_ITEMS) window.BDS_OPEN_AI_ITEMS(); };

      document.getElementById("pl-f").onsubmit = async (e) => {
        e.preventDefault();
        const nuevo = await construirPlanIA({ especialidad: selEsp, subarea: selSub, nivel: selNiv, unidad: selUni, tema: temaVal.trim(), bloques: selBlo }, sesion.nombre, sha256Hex);
        const arr = loadPlanes();
        arr.unshift(nuevo);
        savePlanes(arr.slice(0, 20));
        planActual = nuevo;
        if (ganarXP) ganarXP(25, "🤖 Planeamiento IA MEP");
        draw();
      };

      if (document.getElementById("pl-prt")) document.getElementById("pl-prt").onclick = () => imprimirPlanPDF(planActual, generarQRSVG);
      if (document.getElementById("pl-cpy")) document.getElementById("pl-cpy").onclick = () => {
        const txt = `PLANEAMIENTO MEP — ${planActual.tema}\nEspecialidad: ${planActual.especialidad} | Subárea: ${planActual.subarea} | Nivel: ${planActual.nivel}\nRA: ${planActual.ra}\n` + planActual.momentos.map(m => `${m.fase}: ${m.texto}`).join("\n");
        navigator.clipboard && navigator.clipboard.writeText(txt).catch(() => {});
        alert("📋 Planeamiento copiado al portapapeles listo para pegar en Word o Google Docs.");
      };
      shell.querySelectorAll(".pl-hist").forEach(b => b.onclick = () => {
        planActual = loadPlanes().find(x => x.id === b.getAttribute("data-hid")) || planActual;
        draw();
      });
    }

    draw();
  };
})();