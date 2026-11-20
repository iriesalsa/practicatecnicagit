(function () {
  const DOC_ASIG_KEY = "bds_asignacion_docentes_v212";
  const EST_ASIG_KEY = "bds_asignacion_estudiantes_v212";

  const SECCIONES_FULL = [
    "7-1","7-2","7-3","7-4","8-1","8-2","8-3","9-1","9-2","9-3",
    "10-C","10-C-3","10-1","10-2","11-1","11-2","11-3","12-1","12-2","12-3"
  ];

  function loadDocAsigs() {
    try { const d = JSON.parse(localStorage.getItem(DOC_ASIG_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "DA-01", institucion: "CTP Mercedes Norte", docenteNombre: "Ing. Max Salazar Sánchez", docenteEmail: "maxi.salsa@gmail.com", seccion: "11-1", subarea: "Diseño de Software / Soporte TI" },
      { id: "DA-02", institucion: "CTP Mercedes Norte", docenteNombre: "Ing. Max Salazar Sánchez", docenteEmail: "maxi.salsa@gmail.com", seccion: "10-C", subarea: "Herramientas para la Producción Digital" },
      { id: "DA-03", institucion: "CTP Mercedes Norte", docenteNombre: "Ing. Max Salazar Sánchez", docenteEmail: "maxi.salsa@gmail.com", seccion: "10-C-3", subarea: "Programación / Ciberseguridad" },
      { id: "DA-04", institucion: "CTP Mercedes Norte", docenteNombre: "Prof. Carlos Quesada Mora", docenteEmail: "carlos.quesada@mep.go.cr", seccion: "7-1", subarea: "Matemática" }
    ];
    localStorage.setItem(DOC_ASIG_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveDocAsigs(a) { localStorage.setItem(DOC_ASIG_KEY, JSON.stringify(a)); }

  function loadEstAsigs() {
    try { const d = JSON.parse(localStorage.getItem(EST_ASIG_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "EA-01", institucion: "CTP Mercedes Norte", estudianteNombre: "Sofía Alvarado Rojas", estudianteEmail: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", subarea: "Diseño de Software", docenteNombre: "Ing. Max Salazar Sánchez" },
      { id: "EA-02", institucion: "CTP Mercedes Norte", estudianteNombre: "Esteban Campos Mora", estudianteEmail: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", subarea: "Programación / Ciberseguridad", docenteNombre: "Ing. Max Salazar Sánchez" }
    ];
    localStorage.setItem(EST_ASIG_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveEstAsigs(a) { localStorage.setItem(EST_ASIG_KEY, JSON.stringify(a)); }

  // Sincronizar estudiante asignado automáticamente con el roster de Libreta REAC / Notas SEA
  function syncToRoster(estObj) {
    try {
      const r = JSON.parse(localStorage.getItem("bds_docente_roster_v190") || "[]");
      if (!r.some(x => (x.email || "").toLowerCase() === estObj.estudianteEmail.toLowerCase() && x.materia === estObj.subarea)) {
        r.push({ id: "EST-" + String(Date.now()).slice(-4), nombre: estObj.estudianteNombre, email: estObj.estudianteEmail, seccion: estObj.seccion, materia: estObj.subarea, cotidiano: 85, tareas: 90, pruebas: 80, proyecto: 90 });
        localStorage.setItem("bds_docente_roster_v190", JSON.stringify(r));
      }
    } catch {}
  }

  window.BDS_ASIGNACION_API = { SECCIONES_FULL, loadDocAsigs, saveDocAsigs, loadEstAsigs, saveEstAsigs, syncToRoster };

  window.BDS_RENDER_ASIGNACION_ACAD = function (shell, ctx) {
    const { sesion } = ctx || {};
    const permitidos = ["SuperAdmin", "Admin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Docente MEP"];
    if (!sesion || !permitidos.includes(sesion.rol)) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso restringido a Administración y Docentes</h3></div>`;
      return;
    }

    let tab = "docentes", fltSec = "TODAS";

    function draw() {
      const instAct = window.BDS_INST_API ? window.BDS_INST_API.getActiva() : { nombre: "CTP Mercedes Norte" };
      const docs = loadDocAsigs();
      const ests = loadEstAsigs();
      const malla = window.BDS_MALLA_MEP || [];
      const docsVis = fltSec === "TODAS" ? docs : docs.filter(d => d.seccion === fltSec);
      const estsVis = fltSec === "TODAS" ? ests : ests.filter(e => e.seccion === fltSec);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">ESTRUCTURA ACADÉMICA • ${instAct.nombre.toUpperCase()} • SINCRONIZADO CON LIBRETA REAC</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">🧩 Asignación de Docentes, Estudiantes, Secciones (7-1…12-3) y Subáreas</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              <button data-at="docentes" class="as-t" style="background:${tab==='docentes'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">👨‍🏫 Docentes a Institución (${docs.length})</button>
              <button data-at="estudiantes" class="as-t" style="background:${tab==='estudiantes'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🎒 Estudiantes a Grupo/Docente (${ests.length})</button>
              <select id="as-fsec" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:11.5px;font-weight:700;">
                <option value="TODAS">Todas las secciones</option>
                ${SECCIONES_FULL.map(sc => `<option value="${sc}" ${fltSec===sc?"selected":""}>Sección ${sc}</option>`).join("")}
              </select>
            </div>
          </div>

          ${tab === "docentes" ? `
            <form id="as-df" style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:7px;margin-bottom:13px;">
              <input id="ad-nom" type="text" required placeholder="Nombre Persona Docente" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="ad-mail" type="email" required placeholder="usuario@mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <select id="ad-sec" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">${SECCIONES_FULL.map(s => `<option value="${s}">Sección ${s}</option>`).join("")}</select>
              <input id="ad-sub" list="malla-subs" required placeholder="Asignatura o Subárea" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <datalist id="malla-subs">${malla.map(m => `<option value="${m.name}"></option>`).join("")}</datalist>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">+ Asignar Docente</button>
            </form>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Institución</th><th style="padding:7px;text-align:left;">Docente</th><th style="padding:7px;">Sección</th><th style="padding:7px;text-align:left;">Asignatura / Subárea</th><th style="padding:7px;">Quitar</th></tr>
                ${docsVis.map(d => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;">${d.institucion}</td><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${d.docenteNombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${d.docenteEmail}</span></td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#fbbf24;font-weight:800;">${d.seccion}</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#34d399;font-weight:700;">${d.subarea}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><button data-dd="${d.id}" class="as-dd" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:5px;cursor:pointer;">🗑️</button></td></tr>`).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "estudiantes" ? `
            <form id="as-ef" style="background:#070d19;border:1px solid #10b981;border-radius:11px;padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,165px),1fr));gap:7px;margin-bottom:13px;">
              <input id="ae-nom" type="text" required placeholder="Nombre Estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="ae-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <select id="ae-sec" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">${SECCIONES_FULL.map(s => `<option value="${s}">Sección ${s}</option>`).join("")}</select>
              <input id="ae-sub" list="malla-subs2" required placeholder="Subárea / Materia" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <datalist id="malla-subs2">${malla.map(m => `<option value="${m.name}"></option>`).join("")}</datalist>
              <input id="ae-doc" type="text" required value="${sesion.nombre}" placeholder="Docente asignado" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">+ Asignar Estudiante</button>
            </form>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Estudiante</th><th style="padding:7px;">Sección</th><th style="padding:7px;text-align:left;">Subárea / Asignatura</th><th style="padding:7px;text-align:left;">Docente</th><th style="padding:7px;">Quitar</th></tr>
                ${estsVis.map(e => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${e.estudianteNombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${e.estudianteEmail}</span></td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#fbbf24;font-weight:800;">${e.seccion}</td><td style="padding:7px;border-bottom:1px solid #1e293b;color:#34d399;font-weight:700;">${e.subarea}</td><td style="padding:7px;border-bottom:1px solid #1e293b;">${e.docenteNombre}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><button data-ed="${e.id}" class="as-ed" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:5px;cursor:pointer;">🗑️</button></td></tr>`).join("")}
              </table>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".as-t").forEach(b => b.onclick = () => { tab = b.getAttribute("data-at"); draw(); });
      document.getElementById("as-fsec").onchange = (e) => { fltSec = e.target.value; draw(); };

      if (tab === "docentes") {
        document.getElementById("as-df").onsubmit = (e) => {
          e.preventDefault();
          const arr = loadDocAsigs();
          arr.unshift({ id: "DA-" + String(Date.now()).slice(-4), institucion: instAct.nombre, docenteNombre: document.getElementById("ad-nom").value.trim(), docenteEmail: document.getElementById("ad-mail").value.trim().toLowerCase(), seccion: document.getElementById("ad-sec").value, subarea: document.getElementById("ad-sub").value.trim() });
          saveDocAsigs(arr); draw();
        };
        shell.querySelectorAll(".as-dd").forEach(b => b.onclick = () => { saveDocAsigs(loadDocAsigs().filter(x => x.id !== b.getAttribute("data-dd"))); draw(); });
      }
      if (tab === "estudiantes") {
        document.getElementById("as-ef").onsubmit = (e) => {
          e.preventDefault();
          const obj = { id: "EA-" + String(Date.now()).slice(-4), institucion: instAct.nombre, estudianteNombre: document.getElementById("ae-nom").value.trim(), estudianteEmail: document.getElementById("ae-mail").value.trim().toLowerCase(), seccion: document.getElementById("ae-sec").value, subarea: document.getElementById("ae-sub").value.trim(), docenteNombre: document.getElementById("ae-doc").value.trim() };
          const arr = loadEstAsigs(); arr.unshift(obj); saveEstAsigs(arr);
          syncToRoster(obj);
          draw();
        };
        shell.querySelectorAll(".as-ed").forEach(b => b.onclick = () => { saveEstAsigs(loadEstAsigs().filter(x => x.id !== b.getAttribute("data-ed"))); draw(); });
      }
    }
    draw();
  };
})();