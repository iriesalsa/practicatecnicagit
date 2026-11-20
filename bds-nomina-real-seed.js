(function () {
  const ROSTER_KEY = "bds_docente_roster_v190";
  const REAL_BATCH = [
    {
        "id":  "EST-213-01",
        "nombre":  "Sofía Alvarado Rojas",
        "email":  "sofia.alvarado@est.mep.go.cr",
        "seccion":  "11-1",
        "materia":  "Diseño de Software",
        "cotidiano":  92,
        "tareas":  90,
        "pruebas":  88,
        "proyecto":  95
    },
    {
        "id":  "EST-213-02",
        "nombre":  "Esteban Campos Mora",
        "email":  "esteban.campos@est.mep.go.cr",
        "seccion":  "10-C-3",
        "materia":  "Programación y Ciberseguridad",
        "cotidiano":  66,
        "tareas":  70,
        "pruebas":  64,
        "proyecto":  72
    },
    {
        "id":  "EST-213-03",
        "nombre":  "Valeria Solís Jiménez",
        "email":  "valeria.solis@est.mep.go.cr",
        "seccion":  "10-C",
        "materia":  "Herramientas para la Producción Digital",
        "cotidiano":  84,
        "tareas":  85,
        "pruebas":  80,
        "proyecto":  88
    },
    {
        "id":  "EST-213-04",
        "nombre":  "Mateo Rojas Chacón",
        "email":  "mateo.rojas@est.mep.go.cr",
        "seccion":  "12-1",
        "materia":  "Programación 12°",
        "cotidiano":  95,
        "tareas":  94,
        "pruebas":  91,
        "proyecto":  96
    }
];
  try {
    const cur = JSON.parse(localStorage.getItem(ROSTER_KEY) || "[]");
    if (!Array.isArray(cur) || cur.length === 0) {
      localStorage.setItem(ROSTER_KEY, JSON.stringify(REAL_BATCH));
    } else {
      const seen = new Set(cur.map(x => String((x.email || "") + "|" + (x.materia || "")).toLowerCase()));
      REAL_BATCH.forEach(item => {
        const k = String((item.email || "") + "|" + (item.materia || "")).toLowerCase();
        if (!seen.has(k)) { cur.push(item); seen.add(k); }
      });
      localStorage.setItem(ROSTER_KEY, JSON.stringify(cur));
    }
  } catch {}
  window.BDS_NOMINA_REAL_V213 = REAL_BATCH;
})();