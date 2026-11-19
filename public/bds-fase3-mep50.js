(function () {
  const PLAN_KEY = "bds_planes_mep_v180";

  // Catálogo oficial completo de las 50 Especialidades Técnicas DGEC 2026
  const ESPECIALIDADES_50 = [
    // 5 Agropecuaria
    { cod: "1001", nom: "Agroecología", area: "Agropecuaria" },
    { cod: "1003", nom: "Agroindustria Alimentaria", area: "Agropecuaria" },
    { cod: "1004", nom: "Producción Agrícola y Pecuaria", area: "Agropecuaria" },
    { cod: "1009", nom: "Riego y Drenaje", area: "Agropecuaria" },
    { cod: "1010", nom: "Agrojardinería y Paisajismo", area: "Agropecuaria" },
    // 17 Industrial
    { cod: "2003", nom: "Construcción Civil", area: "Industrial" },
    { cod: "2005", nom: "Dibujo Arquitectónico", area: "Industrial" },
    { cod: "2006", nom: "Dibujo Técnico", area: "Industrial" },
    { cod: "2007", nom: "Diseño y Construcción de Muebles", area: "Industrial" },
    { cod: "2008", nom: "Diseño Publicitario", area: "Industrial" },
    { cod: "2009", nom: "Electromecánica", area: "Industrial" },
    { cod: "2011", nom: "Electrotecnia", area: "Industrial" },
    { cod: "2012", nom: "Impresión Offset y Digital", area: "Industrial" },
    { cod: "2015", nom: "Mecánica Automotriz", area: "Industrial" },
    { cod: "2017", nom: "Electrónica Industrial", area: "Industrial", prio: true },
    { cod: "2019", nom: "Mecánica de Precisión", area: "Industrial" },
    { cod: "2020", nom: "Mecánica General", area: "Industrial" },
    { cod: "2023", nom: "Refrigeración y Aire Acondicionado", area: "Industrial" },
    { cod: "2025", nom: "Salud Ocupacional", area: "Industrial" },
    { cod: "2026", nom: "Diseño y Desarrollo Digital", area: "Industrial" },
    { cod: "2030", nom: "Energías Renovables", area: "Industrial" },
    { cod: "2031", nom: "Manufactura Avanzada / CNC", area: "Industrial" },
    // 28 Comercial y Servicios
    { cod: "3001", nom: "Accounting (Contabilidad Bilingüe)", area: "Comercial y Servicios" },
    { cod: "3002", nom: "Administración, Logística y Distribución", area: "Comercial y Servicios", prio: true },
    { cod: "3003", nom: "Administración y Operación Aduanera", area: "Comercial y Servicios" },
    { cod: "3004", nom: "Banca y Finanzas", area: "Comercial y Servicios" },
    { cod: "3005", nom: "Calidad y Productividad", area: "Comercial y Servicios" },
    { cod: "3006", nom: "Ciberseguridad", area: "Comercial y Servicios", prio: true },
    { cod: "3009", nom: "Configuración y Soporte a Redes (Soporte TI)", area: "Comercial y Servicios" },
    { cod: "3010", nom: "Contabilidad", area: "Comercial y Servicios", prio: true },
    { cod: "3012", nom: "Contabilidad y Finanzas", area: "Comercial y Servicios" },
    { cod: "3013", nom: "Desarrollo de Aplicaciones de Software", area: "Comercial y Servicios" },
    { cod: "3014", nom: "Inteligencia Artificial Aplicada", area: "Comercial y Servicios" },
    { cod: "3015", nom: "Diseño Gráfico", area: "Comercial y Servicios" },
    { cod: "3016", nom: "Desarrollo Web", area: "Comercial y Servicios", prio: true },
    { cod: "3017", nom: "Ejecutivo para Centros de Servicio", area: "Comercial y Servicios" },
    { cod: "3018", nom: "Ejecutivo Comercial Bilingüe", area: "Comercial y Servicios" },
    { cod: "3019", nom: "Ejecutivo Comercial y Servicio al Cliente", area: "Comercial y Servicios", prio: true },
    { cod: "3021", nom: "Gestión de la Producción", area: "Comercial y Servicios" },
    { cod: "3022", nom: "Informática Empresarial", area: "Comercial y Servicios" },
    { cod: "3023", nom: "Mercadeo Digital", area: "Comercial y Servicios" },
    { cod: "3024", nom: "Productividad y Calidad", area: "Comercial y Servicios" },
    { cod: "3030", nom: "Secretariado Ejecutivo", area: "Comercial y Servicios" },
    { cod: "3031", nom: "Seguros", area: "Comercial y Servicios" },
    { cod: "3032", nom: "Turismo Ecológico", area: "Comercial y Servicios" },
    { cod: "3033", nom: "Turismo en Alimentos y Bebidas", area: "Comercial y Servicios" },
    { cod: "3034", nom: "Turismo en Hotelería y Eventos", area: "Comercial y Servicios" },
    { cod: "3037", nom: "Turismo Rural y Sostenible", area: "Comercial y Servicios" },
    { cod: "3039", nom: "Gestión de Talento Humano", area: "Comercial y Servicios" },
    { cod: "3044", nom: "Agroturismo y Emprendimiento", area: "Comercial y Servicios" }
  ];

  const MODALIDADES_MEP = [
    "Primaria (I y II Ciclos)",
    "Secundaria Académica (III Ciclo y Diversificada)",
    "Secundaria Técnica / CTP (10° a 12°, Talleres y Tecnologías)",
    "Colegios Nocturnos",
    "CINDEA",
    "IPEC",
    "Educación Abierta"
  ];

  window.BDS_ESPECIALIDADES_50 = ESPECIALIDADES_50;

  function loadPlanes() {
    try { const d = JSON.parse(localStorage.getItem(PLAN_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const init = [
      {
        id: "PL-3016-11",
        modalidad: "Secundaria Técnica / CTP (10° a 12°, Talleres y Tecnologías)",
        especialidad: "3016 — Desarrollo Web",
        subarea: "Programación Web Frontend y APIs",
        nivel: "11° (Sección 11-1)",
        semana: "Semana 14 de 40",
        lecciones: 8,
        unidad: "Unidad 2: Arquitectura de Componentes React y Seguridad RBAC",
        ra: "Implementar interfaces reactivas modulares con validación de sesiones y consumo seguro de APIs REST.",
        saberes: "Hooks (useState, useEffect), Fetch API, JWT/RLS, diseño responsivo DUA.",
        indicador: "Desarrolla componentes funcionales en JavaScript puro aplicando controles de acceso por rol (Escala 3-2-1).",
        etapas: {
          focalizacion: "La persona docente presenta un caso real de fallo de control de acceso; la persona estudiante diagnostica riesgos mediante lluvia de ideas guiada.",
          exploracion: "La persona docente facilita un repositorio base limpio; la persona estudiante inspecciona la estructura de componentes y reglas RLS en equipo.",
          contrastacion: "La persona docente modera un debate técnico sobre buenas prácticas OWASP; la persona estudiante contrasta su solución con estándares internacionales.",
          aplicacion: "La persona docente evalúa mediante rúbrica 3-2-1 y apoyos DUA; la persona estudiante construye y despliega el módulo funcional con evidencia verificable."
        },
        avancePct: 68
      }
    ];
    localStorage.setItem(PLAN_KEY, JSON.stringify(init));
    return init;
  }

  window.BDS_RENDER_FASE3 = function (shell) {
    let tab = "planeador";
    let filtroArea = "TODAS";
    let busca = "";

    function draw() {
      const planes = loadPlanes();
      const espFiltradas = ESPECIALIDADES_50.filter(e =>
        (filtroArea === "TODAS" || (filtroArea === "PRIORIDAD" ? e.prio : e.area === filtroArea)) &&
        (!busca || e.nom.toLowerCase().includes(busca.toLowerCase()) || e.cod.includes(busca))
      );

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FASE 3 • PLANEAMIENTO PEDAGÓGICO MEP & 50 ESPECIALIDADES DGEC 2026</span>
              <h2 style="margin:4px 0 0;font-size:17.5px;color:#fff;">Plan Anual (40 Semanas), 4 Etapas MEP y Catálogo Nacional 2026</h2>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="f3-p" style="background:${tab==='planeador'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📘 Planeador & Avance RA</button>
              <button id="f3-c" style="background:${tab==='catalogo'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🏭 50 Especialidades DGEC 2026</button>
            </div>
          </div>

          ${tab === "planeador" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;">
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:15px;">
                <h3 style="margin:0 0 8px;color:#38bdf8;font-size:14.5px;">➕ Crear / Agregar Planeamiento (Jerarquía Estricta MEP)</h3>
                <form id="f3-form" style="display:flex;flex-direction:column;gap:8px;">
                  <select id="p-mod" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
                    ${MODALIDADES_MEP.map(m => `<option>${m}</option>`).join("")}
                  </select>
                  <select id="p-esp" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
                    ${ESPECIALIDADES_50.map(e => `<option>${e.cod} — ${e.nom}</option>`).join("")}
                  </select>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="p-sub" type="text" placeholder="Subárea / Asignatura" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="p-niv" type="text" placeholder="Nivel / Sección (ej: 11-1)" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="p-sem" type="text" value="Semana 15 de 40" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
                    <input id="p-lec" type="number" value="8" min="1" max="24" placeholder="Lecciones" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
                  </div>
                  <input id="p-uni" type="text" placeholder="Unidad de Estudio" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
                  <textarea id="p-ra" rows="2" placeholder="Resultado de Aprendizaje (RA) y Saberes Esenciales" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"></textarea>
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💾 Guardar con 4 Etapas MEP + Binomio Sagrado + DUA</button>
                </form>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                ${planes.map((pl, idx) => `
                  <div style="background:#070d19;border:1px solid #1e293b;border-left:4px solid #38bdf8;border-radius:11px;padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                      <span style="font-size:10px;background:#1e3a8a;color:#93c5fd;padding:2px 7px;border-radius:5px;font-weight:800;">${pl.especialidad}</span>
                      <span style="font-size:11px;color:#fbbf24;font-weight:700;">${pl.semana} • ${pl.lecciones} lecc.</span>
                    </div>
                    <h4 style="margin:6px 0 3px;color:#fff;font-size:14px;">${pl.subarea} — ${pl.nivel}</h4>
                    <div style="font-size:12px;color:#cbd5e1;margin-bottom:6px;"><b>${pl.unidad}</b> • RA: ${pl.ra}</div>
                    <div style="font-size:11px;color:#94a3b8;line-height:1.45;background:#0b1322;padding:9px;border-radius:8px;margin-bottom:8px;">
                      <div><b>1. Focalización:</b> ${pl.etapas.focalizacion}</div>
                      <div><b>2. Exploración:</b> ${pl.etapas.exploracion}</div>
                      <div><b>3. Contrastación:</b> ${pl.etapas.contrastacion}</div>
                      <div><b>4. Aplicación/Evaluación:</b> ${pl.etapas.aplicacion}</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span style="font-size:11px;color:#6ee7b7;font-weight:700;">Avance RA: ${pl.avancePct}%</span>
                      <input type="range" min="0" max="100" value="${pl.avancePct}" data-pi="${idx}" class="pl-rng" style="flex:1;"/>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : `
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
              ${[["TODAS","Todas (50)"],["PRIORIDAD","⭐ 6 Prioridad CTPMN"],["Agropecuaria","Agropecuaria (5)"],["Industrial","Industrial (17)"],["Comercial y Servicios","Comercial y Servicios (28)"]].map(([k, l]) => `<button data-fa="${k}" class="f3-fa" style="background:${filtroArea===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
              <input id="f3-q" type="text" value="${busca}" placeholder="Buscar código o especialidad..." style="margin-left:auto;background:#070d19;border:1px solid #334155;color:#fff;padding:7px 11px;border-radius:7px;font-size:12px;min-width:210px;"/>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:9px;max-height:460px;overflow-y:auto;">
              ${espFiltradas.map(e => `
                <div style="background:#070d19;border:1px solid ${e.prio?'#fbbf24':'#1e293b'};border-radius:10px;padding:11px;">
                  <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:800;">
                    <span style="color:#38bdf8;">CÓD. ${e.cod}</span>
                    <span style="color:${e.prio?'#fbbf24':'#94a3b8'};">${e.prio ? "⭐ CTPMN" : e.area}</span>
                  </div>
                  <div style="font-size:13px;font-weight:700;color:#fff;margin-top:4px;">${e.nom}</div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;

      document.getElementById("f3-p").onclick = () => { tab = "planeador"; draw(); };
      document.getElementById("f3-c").onclick = () => { tab = "catalogo"; draw(); };
      if (tab === "planeador") {
        document.getElementById("f3-form").onsubmit = (e) => {
          e.preventDefault();
          const arr = loadPlanes();
          arr.unshift({
            id: "PL-" + Date.now(),
            modalidad: document.getElementById("p-mod").value,
            especialidad: document.getElementById("p-esp").value,
            subarea: document.getElementById("p-sub").value.trim(),
            nivel: document.getElementById("p-niv").value.trim(),
            semana: document.getElementById("p-sem").value.trim(),
            lecciones: Number(document.getElementById("p-lec").value) || 4,
            unidad: document.getElementById("p-uni").value.trim(),
            ra: document.getElementById("p-ra").value.trim(),
            etapas: {
              focalizacion: "La persona docente contextualiza el reto técnico del entorno real; la persona estudiante activa conocimientos previos con apoyos visuales DUA.",
              exploracion: "La persona docente guía la investigación práctica con instrumentos; la persona estudiante analiza variables y formula hipótesis.",
              contrastacion: "La persona docente facilita la validación normativa; la persona estudiante compara resultados técnicos con el referente oficial MEP.",
              aplicacion: "La persona docente aplica evaluación formativa/sumativa escala 3-2-1; la persona estudiante crea el entregable técnico verificable."
            },
            avancePct: 25
          });
          localStorage.setItem(PLAN_KEY, JSON.stringify(arr));
          draw();
        };
        shell.querySelectorAll(".pl-rng").forEach(r => r.onchange = () => {
          const arr = loadPlanes();
          arr[Number(r.getAttribute("data-pi"))].avancePct = Number(r.value);
          localStorage.setItem(PLAN_KEY, JSON.stringify(arr));
          draw();
        });
      } else {
        shell.querySelectorAll(".f3-fa").forEach(b => b.onclick = () => { filtroArea = b.getAttribute("data-fa"); draw(); });
        const qi = document.getElementById("f3-q");
        qi.oninput = () => { busca = qi.value; draw(); document.getElementById("f3-q").focus(); };
      }
    }
    draw();
  };
})();