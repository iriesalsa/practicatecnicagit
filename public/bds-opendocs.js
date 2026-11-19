(function () {
  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=189",
      logoMep: "/logo-mep-oficial.png?v=189"
    };
  }

  const NORMATIVA_CR = [
    { id: "rea2026", titulo: "Reglamento de Evaluación de los Aprendizajes (REA) — Decreto Ejecutivo N.° 45509-MEP", tipo: "Dominio Público MEP", url: "https://www.mep.go.cr", resumen: "Regula la evaluación formativa y sumativa en Costa Rica: Trabajo Cotidiano, Tareas, Pruebas, Proyecto, Asistencia, Niveles de Desempeño (1–3), Adecuaciones Curriculares, Pruebas Nacionales Estandarizadas (PNE) y promoción estudiantil.", puntos: ["Escala de desempeño en 3 niveles (Inicial 1, Intermedio 2, Avanzado 3).", "Componentes obligatorios en modalidad técnica CTP y académica.", "Derecho a adecuaciones de acceso, no significativas y significativas.", "Aplicación y ponderación oficial de la Prueba Nacional Estandarizada (DGEC)."] },
    { id: "panea", titulo: "Reglamento PANEA Comedores Escolares — Decreto Ejecutivo N.° 44940-MEP y Circular DVM-A-01-2018", tipo: "Dominio Público MEP", url: "https://www.mep.go.cr", resumen: "Norma el Programa de Alimentación y Nutrición del Escolar y del Adolescente (PANEA), menús rotativos, prohibición de bebidas azucaradas, becas comedor y administración de recursos por Juntas Administrativas y Juntas de Educación.", puntos: ["Aporte calórico oficial por tiempo de comida (Desayuno 25%, Complementos 20%, Almuerzo 30%, Cena 30%).", "Agua fresca a libre demanda y fruta diaria de temporada.", "Control transparente de becas PANEA y tiquetes administrados por la Junta."] },
    { id: "ley9078", titulo: "Ley de Tránsito por Vías Públicas Terrestres y Seguridad Vial — Ley N.° 9078", tipo: "Dominio Público SINALEVI", url: "https://www.pgrweb.go.cr/scij/", resumen: "Marco jurídico oficial de conducción en Costa Rica evaluado en las pruebas teóricas y prácticas del MOPT/COSEVI: velocidades, licencias A/B/C/D, alcoholemia, prioridades de paso y dispositivos infantiles.", puntos: ["Velocidad máxima 25 km/h en zona escolar y hospitalaria (Art. 98).", "Licencias: A1–A3 Moto, B1–B4 Automóvil/Camión, C1–C2 Público, D1–D3 Equipo Especial.", "Prioridad absoluta a peatones en paso de cebra y a vehículos dentro de rotonda.", "Luz delantera 24h en motocicletas y silla/booster para menores de 12 años (<1,45 m)."] },
    { id: "ley8968", titulo: "Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales — Ley N.° 8968 (PRODHAB)", tipo: "Dominio Público SINALEVI", url: "https://www.pgrweb.go.cr/scij/", resumen: "Establece el derecho a la autodeterminación informativa, consentimiento informado, protección de datos sensibles de estudiantes y familias, y medidas técnicas de seguridad (RBAC, cifrado y RLS).", puntos: ["Principio de consentimiento informado y finalidad legítima.", "Protección estricta de datos de personas menores de edad.", "Derecho de acceso, rectificación y supresión de datos."] }
  ];

  const OPEN_BOOKS = [
    { area: "Contabilidad y NIIF", titulo: "Principles of Accounting (OpenStax) & Resumen Normas NIIF PYMES", lic: "CC BY 4.0 (Libre)", url: "https://openstax.org/subjects/business", desc: "Ciclo contable completo, ecuación patrimonial, estados financieros, inventarios PEPS, costos y fundamentos de NIIF para las PYMES en Costa Rica." },
    { area: "Desarrollo Web e Informática", titulo: "MDN Web Docs & Eloquent JavaScript (Edición Abierta)", lic: "CC BY-SA / Libre", url: "https://developer.mozilla.org/es/", desc: "Documentación abierta de HTML5, CSS3, Flexbox, Grid, JavaScript moderno, DOM, APIs REST y Progressive Web Apps." },
    { area: "Ciberseguridad", titulo: "OWASP Top 10 & Cheat Sheet Series (Guías Abiertas)", lic: "CC BY-SA 4.0", url: "https://owasp.org/www-project-top-ten/", desc: "Estándar mundial abierto sobre prevención de SQL Injection, XSS, autenticación segura, control RBAC y criptografía aplicada." },
    { area: "Electrónica y Circuitos", titulo: "Lessons In Electric Circuits (LibreTexts Engineering)", lic: "CC BY / GFDL", url: "https://eng.libretexts.org/", desc: "Manual abierto de circuitos CC y CA, Ley de Ohm, semiconductores, diodos LED, transistores y mediciones con multímetro." },
    { area: "Matemática y Admisión", titulo: "Álgebra, Precálculo y Estadística (OpenStax) + Folleto PAA UCR", lic: "CC BY 4.0 / Público", url: "https://openstax.org/subjects/math", desc: "Ecuaciones lineales, funciones, geometría, Pitágoras, probabilidad y prácticas públicas oficiales de razonamiento UCR/TEC." },
    { area: "Ciencias (Física, Química, Biología)", titulo: "Física Universitaria, Química 2e y Biología 2e (OpenStax)", lic: "CC BY 4.0", url: "https://openstax.org/subjects/science", desc: "Textos universitarios y de secundaria gratuitos, descargables en PDF sin restricciones legales, revisados por pares." },
    { area: "Ejecutivo Comercial y Logística", titulo: "Introduction to Business & Principles of Management (OpenStax)", lic: "CC BY 4.0", url: "https://openstax.org/subjects/business", desc: "Servicio al cliente, administración, cadena de suministro, KPIs, comercio internacional e introducción a finanzas." },
    { area: "Psicología y Filosofía", titulo: "Psychology 2e & Introduction to Philosophy (OpenStax)", lic: "CC BY 4.0", url: "https://openstax.org/subjects/humanities", desc: "Inteligencia emocional, memoria, ética, lógica deductiva, falacias argumentativas y pensamiento crítico." }
  ];

  function imprimirNormativaPDF(doc, generarQRSVG, hash) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para generar el PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>${doc.titulo}</title><style>body{font-family:Inter,Arial,sans-serif;padding:28px;color:#0f172a;line-height:1.55}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:12px;margin-bottom:18px}.box{background:#f8fafc;border-left:4px solid #0f766e;padding:12px;margin:12px 0}</style></head><body>
      <div class="hdr"><img src="${b.escudo}" style="height:60px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div style="font-size:12px">Compendio de Estudio Open Docs • ${doc.tipo}</div></div><img src="${b.logoMep}" style="height:46px"/></div>
      <h2 style="color:#0f2247">${doc.titulo}</h2>
      <div class="box">${doc.resumen}</div>
      <h3>Puntos Clave Oficiales</h3>
      <ul>${doc.puntos.map(p => `<li>${p}</li>`).join("")}</ul>
      <p style="font-size:12px;color:#475569"><b>Fuente oficial verificable:</b> ${doc.url}</p>
      <div style="display:flex;align-items:center;gap:12px;border:1px solid #cbd5e1;padding:10px;border-radius:8px;margin-top:20px">${generarQRSVG("PT-DOC|" + hash, 84)}<div><b>Documento de Dominio Público / Uso Educativo Libre</b><br/>SHA-256: <code>${hash}</code></div></div>
      <script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  function imprimirCuadernillo2026(areaId, areaName, qty, diff, generarQRSVG, hash) {
    const b = getBrand();
    const items = window.BDS_GENERAR_SIMULACRO ? window.BDS_GENERAR_SIMULACRO(areaId, qty, diff) : [];
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para descargar el cuadernillo PDF.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Cuadernillo 2026 - ${areaName}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12px;line-height:1.45}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}.q{margin-bottom:12px;page-break-inside:avoid}.clave{page-break-before:always}</style></head><body>
      <div class="hdr"><img src="${b.escudo}" style="height:58px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div>CUADERNILLO DE PRÁCTICA 2026 — ${areaName.toUpperCase()}</div><small>${items.length} ítems calibrados • Nivel: ${diff === "ALL" ? "Balanceado (4 niveles)" : diff}</small></div><img src="${b.logoMep}" style="height:44px"/></div>
      <p><b>Estudiante:</b> ______________________________________ &nbsp; <b>Sección:</b> _________ &nbsp; <b>Fecha:</b> ____________</p>
      ${items.map((it, i) => `<div class="q"><b>${i + 1}. [${it.d}]</b> ${it.q}<br/>${it.opts.map((o, oi) => `<div style="margin-left:14px">${String.fromCharCode(65 + oi)}) ${o.txt}</div>`).join("")}</div>`).join("")}
      <div class="clave">
        <h3>Clave Oficial de Respuestas Comentadas — ${areaName}</h3>
        ${items.map((it, i) => {
          const idxOk = it.opts.findIndex(o => o.ok);
          return `<div style="margin-bottom:6px"><b>${i + 1}. ${String.fromCharCode(65 + Math.max(0, idxOk))})</b> ${it.opts[idxOk] ? it.opts[idxOk].txt : ""} — <i>${it.e || ""}</i></div>`;
        }).join("")}
        <div style="display:flex;align-items:center;gap:12px;border:1px solid #0f766e;padding:8px;border-radius:8px;margin-top:14px">${generarQRSVG("PT-CUAD|" + hash, 80)}<div><b>Cuadernillo Educativo Libre (Marca Blanca)</b><br/>Sello SHA-256: <code>${hash}</code></div></div>
      </div>
      <script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_RENDER_OPENDOCS = function (shell, ctx) {
    const { generarQRSVG, sha256Hex } = ctx;
    const malla = window.BDS_MALLA_MEP || [];
    let sub = "cuadernillos";
    let selArea = malla[0] ? malla[0].id : "web";
    let selQty = 20;
    let selDiff = "ALL";

    function draw() {
      const st = window.__BDS_BANCO_STATS || { afterByArea: {} };
      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">OPEN DOCS (CC-BY) • DOMINIO PÚBLICO CR • PDF IMPRIMIBLE</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">📖 Biblioteca Open Docs, Normativa REA 2026 y Cuadernillos PDF</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-od="cuadernillos" class="od-tab" style="background:${sub==='cuadernillos'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📝 Cuadernillos 2026 PDF</button>
              <button data-od="normativa" class="od-tab" style="background:${sub==='normativa'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⚖️ REA 2026 y Leyes CR</button>
              <button data-od="libros" class="od-tab" style="background:${sub==='libros'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📚 Libros Open Docs (CC-BY)</button>
            </div>
          </div>

          ${sub === "cuadernillos" ? `
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:16px;margin-bottom:14px;">
              <h3 style="margin:0 0 8px;color:#38bdf8;font-size:16px;">📥 Generador de Cuadernillos de Examen 2026 en PDF (con Clave Comentada y QR)</h3>
              <p style="margin:0 0 12px;font-size:12.5px;color:#94a3b8;">Crea cuadernillos listos para imprimir o guardar como PDF desde cualquiera de las <b>${malla.length} áreas puras</b> (PNE MEP, Admisión UCR/TEC/UNA, MOPT o Especialidades Técnicas) con 0% mezcla.</p>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;align-items:end;">
                <div>
                  <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Asignatura / Prueba Oficial</label>
                  <select id="od-area" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;">
                    ${malla.map(m => `<option value="${m.id}" ${selArea===m.id?"selected":""}>${m.name} (${st.afterByArea[m.id] || 0} ítems)</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Cantidad de Ítems</label>
                  <select id="od-qty" style="width:100%;background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;font-weight:800;">
                    ${[10, 20, 40, 60].map(q => `<option value="${q}" ${selQty===q?"selected":""}>${q} preguntas</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Nivel de Dificultad</label>
                  <select id="od-diff" style="width:100%;background:#0b1322;color:#34d399;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;font-weight:700;">
                    <option value="ALL" ${selDiff==="ALL"?"selected":""}>Balanceado (4 niveles)</option>
                    <option value="Básico" ${selDiff==="Básico"?"selected":""}>Básico</option>
                    <option value="Medio" ${selDiff==="Medio"?"selected":""}>Medio</option>
                    <option value="Intermedio" ${selDiff==="Intermedio"?"selected":""}>Intermedio</option>
                    <option value="Avanzado" ${selDiff==="Avanzado"?"selected":""}>Avanzado</option>
                  </select>
                </div>
                <button id="od-pdf" style="background:#059669;color:#fff;border:none;padding:11px 16px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;min-height:42px;">🖨️ Generar Cuadernillo PDF</button>
              </div>
            </div>
          ` : ""}

          ${sub === "normativa" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">
              ${NORMATIVA_CR.map(d => `
                <div style="background:#070d19;border:1px solid #334155;border-top:3px solid #38bdf8;border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
                  <div>
                    <span style="font-size:10px;font-weight:800;color:#34d399;">${d.tipo.toUpperCase()}</span>
                    <h3 style="margin:4px 0 6px;font-size:15px;color:#fff;">${d.titulo}</h3>
                    <p style="margin:0 0 8px;font-size:12px;color:#cbd5e1;">${d.resumen}</p>
                    <ul style="margin:0;padding-left:16px;font-size:11.5px;color:#94a3b8;">${d.puntos.map(p => `<li>${p}</li>`).join("")}</ul>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button data-nd="${d.id}" class="od-nprt" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">🖨️ Descargar Compendio PDF</button>
                    <a href="${d.url}" target="_blank" rel="noopener" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:8px 12px;border-radius:7px;font-size:11.5px;font-weight:700;text-decoration:none;">🔗 Portal Oficial</a>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${sub === "libros" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
              ${OPEN_BOOKS.map(b => `
                <div style="background:#070d19;border:1px solid #334155;border-left:4px solid #10b981;border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                  <div>
                    <span style="background:#064e3b;color:#6ee7b7;font-size:10px;font-weight:800;padding:2px 8px;border-radius:99px;">${b.lic}</span>
                    <div style="font-size:11px;color:#38bdf8;font-weight:700;margin-top:6px;">${b.area}</div>
                    <h4 style="margin:2px 0 6px;font-size:14.5px;color:#fff;">${b.titulo}</h4>
                    <p style="margin:0;font-size:12px;color:#cbd5e1;">${b.desc}</p>
                  </div>
                  <a href="${b.url}" target="_blank" rel="noopener" style="display:inline-block;text-align:center;background:#1d4ed8;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;text-decoration:none;">📥 Abrir / Descargar Open Doc Oficial ↗</a>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".od-tab").forEach(b => b.onclick = () => { sub = b.getAttribute("data-od"); draw(); });
      if (sub === "cuadernillos") {
        document.getElementById("od-area").onchange = (e) => { selArea = e.target.value; };
        document.getElementById("od-qty").onchange = (e) => { selQty = Number(e.target.value); };
        document.getElementById("od-diff").onchange = (e) => { selDiff = e.target.value; };
        document.getElementById("od-pdf").onclick = async () => {
          const mat = malla.find(m => m.id === selArea) || { name: "MEP" };
          const h = (await sha256Hex(`CUAD2026|${selArea}|${selQty}|${Date.now()}`)).slice(0, 16);
          imprimirCuadernillo2026(selArea, mat.name, selQty, selDiff, generarQRSVG, h);
        };
      }
      if (sub === "normativa") {
        shell.querySelectorAll(".od-nprt").forEach(b => b.onclick = async () => {
          const doc = NORMATIVA_CR.find(x => x.id === b.getAttribute("data-nd"));
          if (!doc) return;
          const h = (await sha256Hex(`NORM|${doc.id}|2026`)).slice(0, 16);
          imprimirNormativaPDF(doc, generarQRSVG, h);
        });
      }
    }
    draw();
  };
})();