(function () {
  const NIVELES_OPT = ["I Ciclo (1°–3°)", "II Ciclo (4°–6°)", "7° Año", "8° Año", "9° Año", "10° Año", "11° Año", "12° Año", "Nocturno / IPEC / CINDEA", "Admisión Universitaria / MOPT"];
  const FORMATOS_DOC = [
    { id: "antologia", nom: "📘 Antología Curricular Completa (4 Unidades + Ilustraciones + Práctica)" },
    { id: "crestomatia", nom: "📜 Crestomatía Comentada (Lecturas, Casos, Glosario y Análisis)" },
    { id: "libro", nom: "📖 Libro de Repaso Ilustrado (Teoría Profunda + Ejemplos Paso a Paso)" },
    { id: "cuaderno", nom: "📝 Cuaderno de Prácticas + Hoja de Respuestas OMR + Clave Docente" }
  ];

  // Generador de diagramas vectoriales SVG nítidos y livianos según el área temática
  function buildIlustracionSVG(tipo, titulo) {
    const t = String(tipo || "general");
    const safeTit = String(titulo || "Diagrama Conceptual").slice(0, 46);
    if (t === "mate" || t === "admision" || t === "primaria") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 190" style="width:100%;max-width:560px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;display:block;margin:10px auto;">
        <rect width="560" height="190" fill="#f8fafc" rx="10"/>
        <text x="20" y="24" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">📐 Diagrama Geométrico y Plano Cartesiano — ${safeTit}</text>
        <line x1="40" y1="155" x2="220" y2="155" stroke="#0f2247" stroke-width="2"/>
        <line x1="65" y1="45" x2="65" y2="170" stroke="#0f2247" stroke-width="2"/>
        <line x1="65" y1="145" x2="205" y2="60" stroke="#0284c7" stroke-width="3"/>
        <circle cx="100" cy="124" r="4" fill="#dc2626"/><circle cx="170" cy="81" r="4" fill="#059669"/>
        <text x="115" y="138" font-family="Inter,Arial" font-size="10" fill="#334155">f(x) = mx + b</text>
        <polygon points="310,155 470,155 310,60" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
        <rect x="310" y="140" width="15" height="15" fill="none" stroke="#0f2247" stroke-width="1.5"/>
        <text x="285" y="112" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">a</text>
        <text x="385" y="172" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">b</text>
        <text x="400" y="98" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#dc2626">c = √(a² + b²)</text>
      </svg>`;
    }
    if (t === "web" || t === "ciber" || t === "redes_conf" || t === "tecnologia") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180" style="width:100%;max-width:560px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;display:block;margin:10px auto;">
        <rect width="560" height="180" fill="#f8fafc" rx="10"/>
        <text x="20" y="24" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">💻 Arquitectura Web, Seguridad RBAC y Redes — ${safeTit}</text>
        <rect x="28" y="55" width="130" height="82" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
        <text x="93" y="88" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#0f2247">Cliente PWA</text>
        <text x="93" y="106" text-anchor="middle" font-family="Inter,Arial" font-size="9.5" fill="#334155">HTML5 • CSS3 • React</text>
        <text x="93" y="122" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#0f766e">Accesibilidad DUA</text>
        <line x1="158" y1="96" x2="215" y2="96" stroke="#059669" stroke-width="2.5"/>
        <polygon points="215,96 207,91 207,101" fill="#059669"/>
        <text x="186" y="86" text-anchor="middle" font-family="Inter,Arial" font-size="9" font-weight="700" fill="#059669">HTTPS / TLS</text>
        <rect x="216" y="55" width="136" height="82" rx="10" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
        <text x="284" y="88" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#065f46">API + RBAC</text>
        <text x="284" y="106" text-anchor="middle" font-family="Inter,Arial" font-size="9.5" fill="#334155">Auth • SHA-256 • MFA</text>
        <text x="284" y="122" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#0f766e">Ley N.° 8968 PRODHAB</text>
        <line x1="352" y1="96" x2="405" y2="96" stroke="#1d4ed8" stroke-width="2.5"/>
        <polygon points="405,96 397,91 397,101" fill="#1d4ed8"/>
        <rect x="406" y="55" width="128" height="82" rx="10" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
        <text x="470" y="88" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#4c1d95">Base de Datos</text>
        <text x="470" y="106" text-anchor="middle" font-family="Inter,Arial" font-size="9.5" fill="#334155">SQL + RLS Estricto</text>
        <text x="470" y="122" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#6d28d9">Offline-First Sync</text>
      </svg>`;
    }
    if (t === "mopt") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180" style="width:100%;max-width:560px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;display:block;margin:10px auto;">
        <rect width="560" height="180" fill="#f8fafc" rx="10"/>
        <text x="20" y="24" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">🚗 Señalamiento Vial y Manejo Defensivo — Ley N.° 9078</text>
        <polygon points="62,48 92,48 112,68 112,98 92,118 62,118 42,98 42,68" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
        <text x="77" y="88" text-anchor="middle" font-family="Inter,Arial" font-size="14" font-weight="900" fill="#ffffff">ALTO</text>
        <text x="77" y="138" text-anchor="middle" font-family="Inter,Arial" font-size="9.5" fill="#334155">Reglamentación</text>
        <polygon points="210,48 250,88 210,128 170,88" fill="#f59e0b" stroke="#0f172a" stroke-width="2.5"/>
        <text x="210" y="92" text-anchor="middle" font-family="Inter,Arial" font-size="10.5" font-weight="800" fill="#0f172a">ESCUELA</text>
        <text x="210" y="144" text-anchor="middle" font-family="Inter,Arial" font-size="9.5" fill="#334155">Máx. 25 km/h (Art. 98)</text>
        <rect x="295" y="55" width="235" height="86" rx="8" fill="#1e293b"/>
        <line x1="305" y1="98" x2="520" y2="98" stroke="#fbbf24" stroke-width="3" stroke-dasharray="12 8"/>
        <rect x="320" y="66" width="46" height="22" rx="5" fill="#38bdf8"/>
        <rect x="446" y="66" width="46" height="22" rx="5" fill="#10b981"/>
        <line x1="370" y1="77" x2="440" y2="77" stroke="#f8fafc" stroke-width="1.5"/>
        <text x="405" y="128" text-anchor="middle" font-family="Inter,Arial" font-size="10" font-weight="700" fill="#fde68a">Regla de 2–3 segundos • Calzada Segura</text>
      </svg>`;
    }
    if (t === "electro" || t === "fisica") {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180" style="width:100%;max-width:560px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;display:block;margin:10px auto;">
        <rect width="560" height="180" fill="#f8fafc" rx="10"/>
        <text x="20" y="24" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">⚡ Circuito Eléctrico y Leyes Físicas — ${safeTit}</text>
        <rect x="60" y="55" width="210" height="90" fill="none" stroke="#0f2247" stroke-width="2.5"/>
        <circle cx="60" cy="100" r="18" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
        <text x="60" y="104" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#92400e">V</text>
        <rect x="135" y="44" width="60" height="22" rx="4" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
        <text x="165" y="59" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#1e3a8a">R (Ω)</text>
        <text x="165" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="700" fill="#059669">I = V / R  •  P = V × I</text>
        <polygon points="415,48 485,148 345,148" fill="#ecfdf5" stroke="#059669" stroke-width="2.5"/>
        <line x1="380" y1="98" x2="450" y2="98" stroke="#059669" stroke-width="2"/>
        <line x1="415" y1="98" x2="415" y2="148" stroke="#059669" stroke-width="2"/>
        <text x="415" y="84" text-anchor="middle" font-family="Inter,Arial" font-size="14" font-weight="900" fill="#0f2247">V</text>
        <text x="385" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="14" font-weight="900" fill="#0f2247">I</text>
        <text x="445" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="14" font-weight="900" fill="#0f2247">R</text>
      </svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 175" style="width:100%;max-width:560px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;display:block;margin:10px auto;">
      <rect width="560" height="175" fill="#f8fafc" rx="10"/>
      <text x="20" y="24" font-family="Inter,Arial" font-size="12" font-weight="700" fill="#0f2247">🧭 Mapa Conceptual STEAM + DUA — ${safeTit}</text>
      <rect x="200" y="42" width="160" height="40" rx="8" fill="#0f2247"/>
      <text x="280" y="66" text-anchor="middle" font-family="Inter,Arial" font-size="11" font-weight="800" fill="#ffffff">SABER ESENCIAL</text>
      <line x1="230" y1="82" x2="105" y2="112" stroke="#0284c7" stroke-width="2"/>
      <line x1="280" y1="82" x2="280" y2="112" stroke="#059669" stroke-width="2"/>
      <line x1="330" y1="82" x2="455" y2="112" stroke="#7c3aed" stroke-width="2"/>
      <rect x="25" y="112" width="160" height="44" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
      <text x="105" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="10.5" font-weight="700" fill="#0f2247">1. Comprensión</text>
      <text x="105" y="146" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#334155">Conceptos y ejemplos</text>
      <rect x="200" y="112" width="160" height="44" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
      <text x="280" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="10.5" font-weight="700" fill="#065f46">2. Aplicación Real</text>
      <text x="280" y="146" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#334155">Casos paso a paso</text>
      <rect x="375" y="112" width="160" height="44" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
      <text x="455" y="132" text-anchor="middle" font-family="Inter,Arial" font-size="10.5" font-weight="700" fill="#4c1d95">3. Evaluación REAC</text>
      <text x="455" y="146" text-anchor="middle" font-family="Inter,Arial" font-size="9" fill="#334155">Niveles 1–3 + DUA</text>
    </svg>`;
  }

  // Genera la estructura editorial completa de la Antología / Libro / Crestomatía (sin mezclar materias)
  function buildLibroData(areaId, nivel, modalidad, formatoId, cantItems) {
    const malla = window.BDS_MALLA_MEP || [];
    const mat = malla.find(m => m.id === areaId) || malla[0] || { id: "espanol", name: "Español", cat: "Académica" };
    const tipo = window.BDS_ODIN10_DETECTAR_TIPO ? window.BDS_ODIN10_DETECTAR_TIPO(mat) : "general";
    const qty = Math.max(12, Math.min(40, Number(cantItems) || 20));
    const items = window.BDS_GENERAR_SIMULACRO ? window.BDS_GENERAR_SIMULACRO(mat.id, qty, "ALL") : [];

    // Agrupar ítems puros por Unidad de Estudio para construir capítulos reales
    const capMap = {};
    items.forEach(it => {
      const u = it.unidadEstudio || `Unidad Principal — ${mat.name}`;
      if (!capMap[u]) capMap[u] = { titulo: u, subarea: it.subarea || mat.name, saberes: new Set(), indicadores: new Set(), items: [] };
      if (it.saberEsencial) capMap[u].saberes.add(it.saberEsencial);
      if (it.indicador) capMap[u].indicadores.add(it.indicador);
      capMap[u].items.push(it);
    });
    const capitulos = Object.values(capMap).map((c, idx) => ({
      num: idx + 1,
      titulo: c.titulo,
      subarea: c.subarea,
      saberes: Array.from(c.saberes),
      indicadores: Array.from(c.indicadores),
      items: c.items
    }));

    const fmt = FORMATOS_DOC.find(f => f.id === formatoId) || FORMATOS_DOC[0];
    return {
      areaId: mat.id,
      materia: mat.name,
      categoria: mat.cat || "Curricular",
      tipo,
      nivel,
      modalidad,
      formato: fmt,
      ilustracionSVG: buildIlustracionSVG(tipo, mat.name),
      capitulos,
      totalItems: items.length,
      items
    };
  }

  async function imprimirAntologiaPDF(libro, sesion, generarQRSVG, sha256Hex) {
    const inst = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "Colegio Técnico Profesional Mercedes Norte", provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", codigoPresup: "4210", escudo: "/escudo-ctpmn-oficial.jpeg?v=209" };
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { logoMep: "/logo-mep-oficial.png?v=209", mascota: "/buho-oficial.png?v=209" };
    const hash = sha256Hex ? (await sha256Hex(`ANTOLOGIA|${libro.areaId}|${libro.nivel}|${libro.modalidad}|${Date.now()}`)).slice(0, 20) : "ANT209SHA256VERIF";
    const letras = ["A", "B", "C", "D"];

    const capsHtml = libro.capitulos.map(cap => `
      <section class="cap">
        <div class="cap-tag">CAPÍTULO ${cap.num} • SUBÁREA: ${cap.subarea.toUpperCase()}</div>
        <h2>${cap.titulo}</h2>
        <div class="box-saber">
          <b>🔑 Saberes Esenciales de la Unidad:</b>
          <ul>${cap.saberes.map(s => `<li>${s}</li>`).join("")}</ul>
          <b>🎯 Indicadores de Evaluación REAC:</b>
          <ul>${cap.indicadores.map(ind => `<li>${ind}</li>`).join("")}</ul>
        </div>
        ${cap.num === 1 ? libro.ilustracionSVG : ""}
        <h3>📘 Desarrollo Conceptual, Ejemplos Comentados y Casos de Aplicación</h3>
        ${cap.items.map((it, idx) => {
          const okOpt = (it.opts || []).find(o => o.ok);
          return `<div class="case">
            <div class="case-h"><b>Caso ${cap.num}.${idx + 1} (${it.nivelDesempeno || it.d}):</b> ${it.q}</div>
            <div class="case-g"><b>🧭 Orientación de Estudio:</b> ${it.g}</div>
            <div class="case-a"><b>✅ Solución Fundamentada:</b> ${okOpt ? okOpt.txt : ""} — <i>${it.e}</i></div>
            <div class="case-d"><b>♿ Apoyo Inclusivo DUA:</b> ${it.dua || "Lee paso a paso y valida la regla esencial."}</div>
          </div>`;
        }).join("")}
      </section>
    `).join("");

    const omrHtml = libro.items.map((_, i) => `<div class="omr-r"><b>${String(i+1).padStart(2,"0")}.</b> ${letras.map(l => `<span class="bub">${l}</span>`).join("")}</div>`).join("");
    const claveHtml = libro.items.map((it, i) => {
      const idxOk = (it.opts || []).findIndex(o => o.ok);
      return `<tr><td>${i+1}</td><td style="text-align:center;font-weight:900;color:#0f766e">${letras[Math.max(0,idxOk)]}</td><td>${it.unidadEstudio}</td><td>${it.saberEsencial}</td></tr>`;
    }).join("");

    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para descargar/imprimir el Libro PDF Ilustrado.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${libro.formato.nom} — ${libro.materia}</title><style>
      body{font-family:Inter,Arial,sans-serif;color:#0f172a;padding:24px;line-height:1.5;font-size:12px}
      .cover{min-height:92vh;display:flex;flex-direction:column;justify-content:space-between;border:3px solid #0f2247;border-radius:14px;padding:28px;page-break-after:always;background:linear-gradient(180deg,#f8fafc 0%,#eff6ff 100%)}
      .c-top{display:flex;justify-content:space-between;align-items:center}
      .cap{page-break-before:always}
      .cap-tag{font-size:10px;font-weight:800;color:#0f766e;letter-spacing:.04em}
      h1{font-size:28px;color:#0f2247;margin:10px 0}
      h2{font-size:18px;color:#0f2247;border-bottom:2px solid #0284c7;padding-bottom:4px;margin:4px 0 10px}
      h3{font-size:13.5px;color:#1e3a8a;margin:12px 0 6px}
      .box-saber{background:#f1f5f9;border-left:4px solid #0284c7;padding:10px 14px;border-radius:8px;margin-bottom:10px}
      .box-saber ul{margin:4px 0 8px 18px;padding:0}
      .case{background:#ffffff;border:1px solid #cbd5e1;border-left:4px solid #0f766e;border-radius:8px;padding:9px 11px;margin-bottom:9px;page-break-inside:avoid}
      .case-h{margin-bottom:4px}
      .case-g{font-size:11px;color:#0369a1;margin-bottom:3px}
      .case-a{font-size:11.5px;color:#065f46;margin-bottom:3px}
      .case-d{font-size:10.5px;color:#92400e}
      .omr-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 16px;margin:12px 0}
      .omr-r{display:flex;align-items:center;gap:6px;border:1px solid #cbd5e1;padding:4px 7px;border-radius:6px}
      .bub{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border:1.5px solid #0f172a;border-radius:50%;font-size:10px;font-weight:700}
      table{width:100%;border-collapse:collapse;font-size:10.5px}
      th,td{border:1px solid #cbd5e1;padding:5px;text-align:left}
      th{background:#0f2247;color:#fff}
      .qrbox{display:flex;align-items:center;gap:14px;border:2px solid #0f766e;border-radius:10px;padding:10px;background:#ffffff}
    </style></head><body>
      <!-- PORTADA MARCA BLANCA -->
      <div class="cover">
        <div class="c-top">
          <img src="${inst.escudo}" style="height:66px"/>
          <div style="text-align:center">
            <div style="font-weight:800;font-size:14px;color:#0f2247">${inst.nombre}</div>
            <div style="font-size:11.5px;color:#334155">📍 ${inst.provincia || "Heredia"} • ${inst.regional} • ${inst.circuito} • Cód. ${inst.codigoPresup || "—"}</div>
          </div>
          <img src="${b.logoMep}" style="height:50px"/>
        </div>
        <div style="text-align:center;margin:20px 0">
          <span style="background:#0f766e;color:#fff;padding:5px 14px;border-radius:99px;font-size:11px;font-weight:800">${libro.modalidad.toUpperCase()} • ${libro.nivel.toUpperCase()}</span>
          <h1>${libro.materia}</h1>
          <div style="font-size:16px;font-weight:700;color:#0284c7;margin-bottom:14px">${libro.formato.nom}</div>
          ${libro.ilustracionSVG}
          <p style="font-size:12px;color:#475569;max-width:520px;margin:12px auto 0">Material didáctico ilustrado alineado a saberes esenciales, enfoque DUA inclusivo y evaluación formativa REAC. Contiene ${libro.capitulos.length} capítulos, ${libro.totalItems} casos comentados, hoja de respuestas OMR y clave docente.</p>
        </div>
        <div class="qrbox">
          ${generarQRSVG ? generarQRSVG("PT-LIBRO|" + hash, 86) : ""}
          <div style="font-size:11px">
            <b>Edición Digital Verificable QR SHA-256</b><br/>
            Código: <code>${hash}</code><br/>
            Preparado para: <b>${(sesion && sesion.nombre) || "Comunidad Educativa"}</b> • Año 2026–2027<br/>
            <small>Recurso educativo de apoyo independiente • Uso institucional marca blanca.</small>
          </div>
        </div>
      </div>

      <!-- TABLA DE CONTENIDOS -->
      <section>
        <h2>📑 Tabla de Contenidos y Estructura Curricular</h2>
        <table>
          <tr><th>Cap.</th><th>Unidad de Estudio</th><th>Subárea</th><th>Casos y Prácticas</th></tr>
          ${libro.capitulos.map(c => `<tr><td><b>${c.num}</b></td><td>${c.titulo}</td><td>${c.subarea}</td><td>${c.items.length} ejercicios comentados</td></tr>`).join("")}
        </table>
      </section>

      ${capsHtml}

      <!-- HOJA OMR + CLAVE -->
      <section class="cap">
        <h2>📝 Hoja de Respuestas (OMR) y Clave de Autoevaluación</h2>
        <div class="omr-g">${omrHtml}</div>
        <h3>🔑 Clave de Verificación por Unidad y Saber Esencial</h3>
        <table><tr><th>#</th><th>Clave</th><th>Unidad de Estudio</th><th>Saber Esencial</th></tr>${claveHtml}</table>
      </section>
      <script>window.onload=()=>window.print();</script>
    </body></html>`);
    w.document.close();
  }

  window.BDS_ANTOLOGIAS_API = { NIVELES_OPT, FORMATOS_DOC, buildIlustracionSVG, buildLibroData, imprimirAntologiaPDF };

  window.BDS_RENDER_ANTOLOGIAS_LIBROS = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx || {};
    const malla = window.BDS_MALLA_MEP || [];
    const instAct = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { tipo: "CTP (Técnico)" };
    const mods = (window.BDS_CR_GEO && window.BDS_CR_GEO.MODALIDADES_MEP) || ["CTP (Técnico)", "Colegio Académico", "Escuela Primaria", "Colegio Nocturno / CINDEA / IPEC", "Liceo Rural / Telesecundaria"];

    let areaId = malla[0] ? malla[0].id : "espanol";
    let nivel = "11° Año";
    let modalidad = instAct.tipo || "CTP (Técnico)";
    let formatoId = "antologia";
    let cant = 20;
    let libro = buildLibroData(areaId, nivel, modalidad, formatoId, cant);

    function draw() {
      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">ANTOLOGÍAS • CRESTOMATÍAS • LIBROS ILUSTRADOS SVG • PDF + QR SHA-256</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">📖 Libros, Antologías y Crestomatías Ilustradas (29 Áreas Puras)</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="an-pdf" style="background:#059669;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📥 Descargar / Imprimir Libro PDF + QR</button>
            </div>
          </div>

          <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:11px;padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,175px),1fr));gap:8px;margin-bottom:14px;align-items:end;">
            <div><label style="font-size:10px;color:#94a3b8;">Asignatura / Especialidad:</label><select id="an-area" style="width:100%;background:#0b1322;color:#38bdf8;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${malla.map(m => `<option value="${m.id}" ${areaId===m.id?"selected":""}>${m.name}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Modalidad Institucional:</label><select id="an-mod" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${mods.map(mo => `<option ${modalidad===mo?"selected":""}>${mo}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Nivel / Ciclo:</label><select id="an-niv" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">${NIVELES_OPT.map(nv => `<option ${nivel===nv?"selected":""}>${nv}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Tipo de Publicación:</label><select id="an-fmt" style="width:100%;background:#0b1322;color:#2dd4bf;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${FORMATOS_DOC.map(f => `<option value="${f.id}" ${formatoId===f.id?"selected":""}>${f.nom.split("(")[0].trim()}</option>`).join("")}</select></div>
            <div><label style="font-size:10px;color:#94a3b8;">Extensión (Casos):</label><select id="an-cnt" style="width:100%;background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;">${[12, 20, 30, 40].map(n => `<option value="${n}" ${cant===n?"selected":""}>${n} casos ilustrados</option>`).join("")}</select></div>
            <button id="an-gen" style="background:#1d4ed8;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">⚡ Generar Libro</button>
          </div>

          <!-- Vista previa ilustrada en vivo -->
          <div style="background:#070d19;border:1px solid #334155;border-radius:12px;padding:14px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
              <b style="color:#38bdf8;font-size:14.5px;">${libro.formato.nom.split("(")[0].trim()} — ${libro.materia} (${libro.nivel} • ${libro.modalidad})</b>
              <span style="font-size:11px;color:#34d399;font-weight:700;">${libro.capitulos.length} Capítulos • ${libro.totalItems} Casos Puros (0% mezcla)</span>
            </div>
            ${libro.ilustracionSVG}
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:9px;margin-top:12px;">
              ${libro.capitulos.map(c => `
                <div style="background:#0b1322;border:1px solid #1e293b;border-left:4px solid #0f766e;border-radius:9px;padding:10px;font-size:12px;">
                  <div style="font-size:10px;color:#2dd4bf;font-weight:700;">CAPÍTULO ${c.num} • ${c.subarea}</div>
                  <b style="color:#fff;">${c.titulo}</b>
                  <div style="font-size:11px;color:#94a3b8;margin-top:4px;">🔑 ${c.saberes.slice(0,2).join(" • ")}</div>
                  <div style="font-size:10.5px;color:#38bdf8;margin-top:4px;">${c.items.length} ejemplos desarrollados + DUA + OMR</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;

      document.getElementById("an-area").onchange = (e) => { areaId = e.target.value; };
      document.getElementById("an-mod").onchange = (e) => { modalidad = e.target.value; };
      document.getElementById("an-niv").onchange = (e) => { nivel = e.target.value; };
      document.getElementById("an-fmt").onchange = (e) => { formatoId = e.target.value; };
      document.getElementById("an-cnt").onchange = (e) => { cant = Number(e.target.value); };
      document.getElementById("an-gen").onclick = () => {
        libro = buildLibroData(areaId, nivel, modalidad, formatoId, cant);
        if (ganarXP) ganarXP(10);
        draw();
      };
      document.getElementById("an-pdf").onclick = () => imprimirAntologiaPDF(libro, sesion, generarQRSVG, sha256Hex);
    }
    draw();
  };
})();