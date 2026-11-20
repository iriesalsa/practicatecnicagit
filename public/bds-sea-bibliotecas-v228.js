(function () {
  const SEA_PERIODOS_KEY = "bds_sea_reac_periodos_v228";
  const MARCO_MEP_2026 = {
    reglamento: "Decreto Ejecutivo N.° 45509-MEP — Reglamento de Evaluación de los Aprendizajes y Conducta (REAC 2026)",
    sistemaEvaluacion: "SEA — Sistema de Evaluación Ágil / Compatibilidad PIAD-SABER",
    reglaOroSEA: "Cada calificación se aísla por Curso Lectivo + Período (I, II o Ampliación) para nunca sobrescribir el Período I al registrar el Período II.",
    especialidadesETP: [
      "Desarrollo de Aplicaciones de Software / Desarrollo Web", "Ciberseguridad", "Inteligencia Artificial",
      "Gestión de Datos, Análisis y Visualización", "Configuración y Soporte a Redes y Sistemas Operativos",
      "Electrónica Industrial", "Electrotecnia", "Electromecánica", "Contabilidad y Finanzas",
      "Ejecutivo Comercial y de Servicio al Cliente", "Diseño Gráfico Multimedia y Publicitario",
      "Ecoturismo y Operaciones de Alojamiento", "Logística y Distribución", "Mecánica de Precisión"
    ]
  };
  const BIBLIOTECAS_ABIERTAS = [
    { id: "mep-caja", nombre: "Caja de Herramientas MEP (Costa Rica)", area: "Programas, planeamiento y recursos oficiales", url: "https://www.mep.go.cr/educatico/caja-herramientas-docentes", licencia: "Pública MEP" },
    { id: "mep-etp", nombre: "Programas de Estudio ETP — MEP", area: "Especialidades técnicas oficiales 10°–12°", url: "https://www.mep.go.cr/programas-estudio-educacion-tecnica", licencia: "Pública MEP" },
    { id: "openstax", nombre: "OpenStax (Rice University)", area: "Libros abiertos de Mate, Física, Química, Biología y Economía", url: "https://openstax.org/subjects", licencia: "CC BY 4.0" },
    { id: "libretexts", nombre: "LibreTexts Open Libraries", area: "Ingeniería, Electrónica, Ciencias y Estadística", url: "https://libretexts.org/", licencia: "OER" },
    { id: "mdn", nombre: "MDN Web Docs (Mozilla)", area: "HTML5, CSS3, JavaScript, Accesibilidad y Seguridad Web", url: "https://developer.mozilla.org/es/", licencia: "CC BY-SA" },
    { id: "gutenberg", nombre: "Proyecto Gutenberg", area: "+70,000 libros clásicos en dominio público (ES/EN/FR)", url: "https://www.gutenberg.org/", licencia: "Dominio Público" },
    { id: "cervantes", nombre: "Biblioteca Virtual Miguel de Cervantes", area: "Literatura hispanoamericana, gramática y antologías", url: "https://www.cervantesvirtual.com/", licencia: "Acceso Abierto" },
    { id: "khan", nombre: "Khan Academy en Español", area: "Práctica gratuita de Matemática, Ciencias y Programación", url: "https://es.khanacademy.org/", licencia: "Gratuita" },
    { id: "oer", nombre: "OER Commons (UNESCO / ISKME)", area: "Recursos Educativos Abiertos globales con enfoque DUA", url: "https://oercommons.org/", licencia: "Creative Commons" }
  ];
  function loadPeriodosSEA() { try { const d = JSON.parse(localStorage.getItem(SEA_PERIODOS_KEY) || "{}"); return d && typeof d === "object" ? d : {}; } catch { return {}; } }
  function guardarRegistroSEA(cursoLectivo, periodo, seccion, asignatura, registros) {
    const key = `${cursoLectivo || "2026"}|${periodo || "I Período"}|${seccion || "11-1"}|${asignatura || "General"}`;
    const db = loadPeriodosSEA();
    if (db[key] && db[key].cerradoPorJefatura) return { ok: false, msg: `Período ${key} cerrado por Jefatura (Regla SEA).` };
    db[key] = { key, cursoLectivo: String(cursoLectivo || "2026"), periodo: String(periodo || "I Período"), seccion: String(seccion || "11-1"), asignatura: String(asignatura || "General"), registros: Array.isArray(registros) ? registros : [], cerradoPorJefatura: false, actualizadoEn: new Date().toLocaleString("es-CR") };
    localStorage.setItem(SEA_PERIODOS_KEY, JSON.stringify(db));
    return { ok: true, key, total: db[key].registros.length };
  }
  function cerrarPeriodoPorJefatura(key, actor) {
    const db = loadPeriodosSEA();
    if (!db[key]) return { ok: false, msg: "Período no encontrado." };
    db[key].cerradoPorJefatura = true;
    db[key].aprobadoPor = actor || "Dirección / Jefatura";
    localStorage.setItem(SEA_PERIODOS_KEY, JSON.stringify(db));
    return { ok: true, key };
  }
  window.BDS_SEA_BIBLIOTECAS_V228 = { MARCO_MEP_2026, BIBLIOTECAS_ABIERTAS, loadPeriodosSEA, guardarRegistroSEA, cerrarPeriodoPorJefatura };
  function injectOpenLibrariesPanel() {
    if (typeof document === "undefined" || !document.body) return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-open-libs-v228")) return;
    if (!/antologías|biblioteca|libros ilustrados/i.test(shell.innerText || "")) return;
    const card = document.createElement("div");
    card.id = "bds-open-libs-v228"; card.className = "bds-card"; card.style.marginTop = "12px";
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px;"><b style="color:#38bdf8;font-size:14px;">🌍 Bibliotecas Libres y Repositorios Abiertos (MEP & Internacionales)</b><span style="font-size:10.5px;color:#34d399;font-weight:700;">100% Gratuitos</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:8px;">${BIBLIOTECAS_ABIERTAS.map(b => `<a href="${b.url}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;background:#070d19;border:1px solid #334155;border-left:4px solid #0284c7;border-radius:9px;padding:10px;color:#f8fafc;"><div style="font-weight:800;font-size:12.5px;color:#38bdf8;">📚 ${b.nombre}</div><div style="font-size:11px;color:#cbd5e1;margin:3px 0;">${b.area}</div><span style="font-size:10px;color:#34d399;font-weight:700;">${b.licencia} ↗</span></a>`).join("")}</div>`;
    shell.appendChild(card);
  }
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      injectOpenLibrariesPanel();
      if (typeof MutationObserver !== "undefined" && document.body) new MutationObserver(() => injectOpenLibrariesPanel()).observe(document.body, { childList: true, subtree: true });
    });
  }
})();