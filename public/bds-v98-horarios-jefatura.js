(function () {
  "use strict";
  if (window.__BDS_HORARIOS_V98__) return;
  window.__BDS_HORARIOS_V98__ = true;

  var MATERIAS_HASTA_11 = ["ORIENTACION", "EDUCACION FISICA", "RELIGION"];

  var EJEMPLOS_TRIPLE = [
    {
      nombre: "Ejemplo 1: Especialidad Tecnica + Guia",
      dia: "Lunes",
      franja: "07:00-09:10",
      modalidad: "Tecnica 2h + Recreo",
      recreo: "09:10-09:30",
      docente: "Docente Especialidad A",
      especialidad: "Desarrollo Web / TI",
      seccion: "11-1",
      subgrupo: "Subgrupo A",
      asignatura: "Programacion",
      profesorGuia: "Docente Guia 11-1",
      diaBloqueadoOtroColegio: "Viernes",
      cajonLibre: false
    },
    {
      nombre: "Ejemplo 2: 3 Lecciones Academicas (11.o)",
      dia: "Martes",
      franja: "09:30-11:30",
      modalidad: "3 Lecciones Academicas",
      recreo: "09:10-09:30",
      docente: "Docente Orientacion / Guia",
      especialidad: "Formacion Integral",
      seccion: "11-1",
      subgrupo: "Grupo Completo",
      asignatura: "Orientacion",
      profesorGuia: "Docente Guia 11-1",
      diaBloqueadoOtroColegio: "Jueves",
      cajonLibre: false
    },
    {
      nombre: "Ejemplo 3: Comedor y Cooperativa (Turno)",
      dia: "Miercoles",
      franja: "11:30-12:50",
      modalidad: "Tecnica 3 Lecciones + Recreo",
      recreo: "10:50-11:10",
      docente: "Coordinacion Comedor / Coop",
      especialidad: "Operacion Institucional",
      seccion: "10-C-3",
      subgrupo: "Subgrupo B",
      asignatura: "Comedor / Cooperativa",
      profesorGuia: "Docente Guia 10-C-3",
      diaBloqueadoOtroColegio: "Martes",
      cajonLibre: false
    }
  ];

  // Escenarios de prueba / distractores para comprobar validaciones de jefatura
  var DISTRACTORES_TRIPLE = [
    {
      etiqueta: "Distractor 1: Choque mismo dia y franja",
      patch: { dia: "Lunes", franja: "07:00-09:10", docente: "Docente Especialidad A", seccion: "11-1", cajonLibre: false }
    },
    {
      etiqueta: "Distractor 2: Dia bloqueado por otro colegio",
      patch: { dia: "Viernes", franja: "07:00-09:10", diaBloqueadoOtroColegio: "Viernes", cajonLibre: false }
    },
    {
      etiqueta: "Distractor 3: Cajon libre sin carga",
      patch: { dia: "Jueves", franja: "13:00-14:20", cajonLibre: true }
    }
  ];

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function esGrado12(seccionStr) {
    var s = String(seccionStr || "").trim();
    return /^12\b/.test(s) || s.toUpperCase().indexOf("12MO") === 0 || s.toUpperCase().indexOf("DUODECIMO") >= 0;
  }

  function auditarBloques(bloques) {
    var alertas = [];
    for (var i = 0; i < bloques.length; i++) {
      var b = bloques[i];
      if (b.cajonLibre) {
        alertas.push("CAJON LIBRE: " + b.dia + " " + b.franja + " (" + b.seccion + " / " + b.subgrupo + ") sin actividad asignada.");
      }
      if (b.diaBloqueadoOtroColegio && String(b.diaBloqueadoOtroColegio).toLowerCase() === String(b.dia).toLowerCase()) {
        alertas.push("OTRO COLEGIO: " + b.docente + " tiene restriccion en " + b.dia + " por otro centro.");
      }
      var asigUpper = String(b.asignatura || "").toUpperCase();
      var esRestringida11 = MATERIAS_HASTA_11.some(function (m) { return asigUpper.indexOf(m) >= 0; });
      if (esRestringida11 && esGrado12(b.seccion)) {
        alertas.push("NIVEL 11.O MAXIMO: " + b.asignatura + " aplica solo hasta 11.o grado (detectado en " + b.seccion + ").");
      }
      for (var j = i + 1; j < bloques.length; j++) {
        var o = bloques[j];
        var mismaFranja = (String(b.dia) === String(o.dia)) && (String(b.franja) === String(o.franja));
        if (mismaFranja && String(b.docente).toLowerCase() === String(o.docente).toLowerCase()) {
          alertas.push("CHOQUE DOCENTE: " + b.docente + " en " + b.dia + " " + b.franja + " (" + b.seccion + " vs " + o.seccion + ").");
        }
        if (mismaFranja && String(b.seccion).toLowerCase() === String(o.seccion).toLowerCase() && String(b.subgrupo).toLowerCase() === String(o.subgrupo).toLowerCase()) {
          alertas.push("CHOQUE SECCION/SUBGRUPO: " + b.seccion + " (" + b.subgrupo + ") en " + b.dia + " " + b.franja + ".");
        }
      }
    }
    return alertas;
  }

  function montarModuloHorarios() {
    if (document.getElementById("bds-v98-sched-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v98-sched-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir modulo de horarios de jefatura, controles y trazabilidad");
    btn.style.cssText =
      "position:fixed;left:12px;bottom:88px;z-index:2147483635;" +
      "background:#0f766e;color:#ffffff;border:2px solid #99f6e4;border-radius:999px;" +
      "padding:7px 12px;font:800 11.5px system-ui,-apple-system,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\uddd3\ufe0f Horarios v9.8";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v98-sched-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      abierto: false,
      subvista: "EDITOR",
      bloques: [
        Object.assign({ id: "B1" }, EJEMPLOS_TRIPLE[0]),
        Object.assign({ id: "B2" }, EJEMPLOS_TRIPLE[1]),
        Object.assign({ id: "B3" }, EJEMPLOS_TRIPLE[2])
      ],
      idxEdicion: 0,
      trazabilidad: [
        { hora: "07:00", actor: "Jefatura", detalle: "Carga inicial sincronizada de bloques academicos, tecnicos, recreos y puestos." }
      ]
    };

    function registrarTraza(actor, detalle) {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      state.trazabilidad.push({ hora: hh, actor: actor || "Jefatura", detalle: detalle });
      if (state.trazabilidad.length > 25) state.trazabilidad = state.trazabilidad.slice(-25);
    }

    function render() {
      if (!state.abierto) {
        modal.style.display = "none";
        return;
      }
      modal.style.display = "block";
      var cur = state.bloques[state.idxEdicion] || state.bloques[0];
      var alertas = auditarBloques(state.bloques);

      var tabsHtml =
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:8px">' +
        '<button type="button" data-sv="EDITOR" class="bds-h98-sv" style="padding:5px 10px;border-radius:8px;border:none;background:' + (state.subvista === "EDITOR" ? "#0f766e" : "#e2e8f0") + ';color:' + (state.subvista === "EDITOR" ? "#fff" : "#0f172a") + ';font-size:11.5px;font-weight:800;cursor:pointer">Editor Jefatura</button>' +
        '<button type="button" data-sv="CONTROLES" class="bds-h98-sv" style="padding:5px 10px;border-radius:8px;border:none;background:' + (state.subvista === "CONTROLES" ? "#0f766e" : "#e2e8f0") + ';color:' + (state.subvista === "CONTROLES" ? "#fff" : "#0f172a") + ';font-size:11.5px;font-weight:800;cursor:pointer">3 Controles y Pruebas (' + alertas.length + ')</button>' +
        '<button type="button" data-sv="TRAZA" class="bds-h98-sv" style="padding:5px 10px;border-radius:8px;border:none;background:' + (state.subvista === "TRAZA" ? "#0f766e" : "#e2e8f0") + ';color:' + (state.subvista === "TRAZA" ? "#fff" : "#0f172a") + ';font-size:11.5px;font-weight:800;cursor:pointer">Trazabilidad (' + state.trazabilidad.length + ')</button>' +
        '</div>';

      var bodyHtml = "";
      if (state.subvista === "EDITOR") {
        var ejBtns = EJEMPLOS_TRIPLE.map(function (ej, idx) {
          return '<button type="button" data-ej="' + idx + '" class="bds-h98-ej" style="padding:4px 8px;border-radius:7px;border:1px solid #0f766e;background:#f0fdfa;color:#115e59;font-size:11px;font-weight:800;cursor:pointer">' + esc(ej.nombre) + '</button>';
        }).join("");

        var listBloques = state.bloques.map(function (b, idx) {
          var sel = idx === state.idxEdicion;
          return '<button type="button" data-sel="' + idx + '" class="bds-h98-sel" style="padding:4px 8px;border-radius:7px;border:1.5px solid ' + (sel ? "#0f766e" : "#cbd5e1") + ';background:' + (sel ? "#ccfbf1" : "#fff") + ';color:#0f172a;font-size:11px;font-weight:800;cursor:pointer">' + esc(b.id + " " + b.dia + " " + b.seccion) + '</button>';
        }).join("");

        bodyHtml =
          '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">' + ejBtns + '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px">' + listBloques + '<button id="bds-h98-add" type="button" style="padding:4px 8px;border-radius:7px;border:none;background:#1e3a8a;color:#fff;font-size:11px;font-weight:800;cursor:pointer">+ Nuevo Bloque</button></div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:7px;font-size:11.5px;margin-bottom:8px">' +
          '<label>Dia<select id="bds-h98-dia" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"><option>Lunes</option><option>Martes</option><option>Miercoles</option><option>Jueves</option><option>Viernes</option></select></label>' +
          '<label>Franja<input id="bds-h98-fra" type="text" value="' + esc(cur.franja) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Modalidad<select id="bds-h98-mod" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"><option>Tecnica 2h + Recreo</option><option>Tecnica 3 Lecciones + Recreo</option><option>3 Lecciones Academicas</option><option>2 Horas Academicas</option></select></label>' +
          '<label>Recreo<input id="bds-h98-rec" type="text" value="' + esc(cur.recreo) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Docente<input id="bds-h98-doc" type="text" value="' + esc(cur.docente) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Especialidad<input id="bds-h98-esp" type="text" value="' + esc(cur.especialidad) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Seccion<input id="bds-h98-sec" type="text" value="' + esc(cur.seccion) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Subgrupo<input id="bds-h98-sub" type="text" value="' + esc(cur.subgrupo) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Asignatura / Puesto<input id="bds-h98-asi" type="text" value="' + esc(cur.asignatura) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Profesor Guia<input id="bds-h98-gui" type="text" value="' + esc(cur.profesorGuia) + '" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"/></label>' +
          '<label>Dia Restringido Otro Col.<select id="bds-h98-otr" style="width:100%;padding:5px;border-radius:7px;border:1px solid #64748b"><option value="">Ninguno</option><option>Lunes</option><option>Martes</option><option>Miercoles</option><option>Jueves</option><option>Viernes</option></select></label>' +
          '<label style="display:flex;align-items:center;gap:5px;padding-top:14px"><input id="bds-h98-caj" type="checkbox" ' + (cur.cajonLibre ? "checked " : "") + '/>Cajon libre</label>' +
          '</div>' +
          '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:8px;font-size:11.5px">' +
          '<strong>Alertas detectadas:</strong> ' + (alertas.length ? esc(alertas.join(" | ")) : "Sin choques, sin cajones libres y dentro de reglas (hasta 11.o en Orientacion/Ed. Fisica/Religion).") +
          '</div>';
      } else if (state.subvista === "CONTROLES") {
        var distHtml = DISTRACTORES_TRIPLE.map(function (d, idx) {
          return '<button type="button" data-dist="' + idx + '" class="bds-h98-dist" style="padding:5px 9px;border-radius:7px;border:1px solid #b45309;background:#fffbeb;color:#92400e;font-size:11px;font-weight:800;cursor:pointer">' + esc(d.etiqueta) + '</button>';
        }).join("");

        var alItems = alertas.length
          ? alertas.map(function (a) { return '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:6px 8px;margin-bottom:5px;font-size:11.5px;color:#991b1b">' + esc(a) + '</div>'; }).join("")
          : '<div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:8px;font-size:12px;color:#065f46">3 controles verificados: choques, dias de otro colegio/cajones libres y materias hasta 11.o grado sin incidencias.</div>';

        bodyHtml =
          '<div style="font-size:12px;font-weight:800;margin-bottom:6px">3 Escenarios de prueba / distractores (aplica al bloque activo):</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:9px">' + distHtml + '</div>' +
          alItems;
      } else {
        bodyHtml = state.trazabilidad.slice().reverse().map(function (t) {
          return '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:6px 8px;margin-bottom:5px;font-size:11.5px">' +
            '<strong>' + esc(t.hora) + '</strong> \u2022 <strong>' + esc(t.actor) + '</strong>: ' + esc(t.detalle) + '</div>';
        }).join("");
      }

      modal.innerHTML =
        '<div style="max-width:740px;margin:8px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #0f766e;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Horarios Jefatura v9.8 \u2022 Bloques, Recreos, Gu\u00eda, Hasta 11.\u00ba y Trazabilidad</strong>' +
        '<button id="bds-h98-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:12px">' + tabsHtml + bodyHtml + '</div></div>';

      document.getElementById("bds-h98-close").onclick = function () { state.abierto = false; render(); };

      Array.prototype.forEach.call(modal.querySelectorAll(".bds-h98-sv"), function (tb) {
        tb.onclick = function () { state.subvista = tb.getAttribute("data-sv") || "EDITOR"; render(); };
      });

      if (state.subvista === "EDITOR") {
        Array.prototype.forEach.call(modal.querySelectorAll(".bds-h98-ej"), function (eb) {
          eb.onclick = function () {
            var i = Number(eb.getAttribute("data-ej")) || 0;
            var src = EJEMPLOS_TRIPLE[i] || EJEMPLOS_TRIPLE[0];
            state.bloques[state.idxEdicion] = Object.assign({ id: cur.id || ("B" + (state.idxEdicion + 1)) }, src);
            registrarTraza("Jefatura", "Cargo " + src.nombre + " en " + src.seccion);
            render();
          };
        });

        Array.prototype.forEach.call(modal.querySelectorAll(".bds-h98-sel"), function (sb) {
          sb.onclick = function () { state.idxEdicion = Number(sb.getAttribute("data-sel")) || 0; render(); };
        });

        document.getElementById("bds-h98-add").onclick = function () {
          var nextIdx = state.bloques.length + 1;
          state.bloques.push(Object.assign({ id: "B" + nextIdx }, EJEMPLOS_TRIPLE[nextIdx % EJEMPLOS_TRIPLE.length], { cajonLibre: false }));
          state.idxEdicion = state.bloques.length - 1;
          registrarTraza("Jefatura", "Agrego bloque B" + nextIdx);
          render();
        };

        var dSel = document.getElementById("bds-h98-dia");
        var mSel = document.getElementById("bds-h98-mod");
        var oSel = document.getElementById("bds-h98-otr");
        if (dSel) dSel.value = cur.dia;
        if (mSel) mSel.value = cur.modalidad;
        if (oSel) oSel.value = cur.diaBloqueadoOtroColegio || "";

        function saveField(fn) {
          fn(cur);
          registrarTraza("Jefatura", "Edito bloque " + cur.id + " (" + cur.seccion + " / " + cur.asignatura + ")");
          render();
        }

        if (dSel) dSel.onchange = function () { saveField(function (x) { x.dia = dSel.value; }); };
        if (mSel) mSel.onchange = function () { saveField(function (x) { x.modalidad = mSel.value; }); };
        if (oSel) oSel.onchange = function () { saveField(function (x) { x.diaBloqueadoOtroColegio = oSel.value; }); };

        var mapInp = {
          "bds-h98-fra": "franja",
          "bds-h98-rec": "recreo",
          "bds-h98-doc": "docente",
          "bds-h98-esp": "especialidad",
          "bds-h98-sec": "seccion",
          "bds-h98-sub": "subgrupo",
          "bds-h98-asi": "asignatura",
          "bds-h98-gui": "profesorGuia"
        };
        Object.keys(mapInp).forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.onchange = function () { saveField(function (x) { x[mapInp[id]] = el.value; }); };
        });

        var cBox = document.getElementById("bds-h98-caj");
        if (cBox) cBox.onchange = function () { saveField(function (x) { x.cajonLibre = Boolean(cBox.checked); }); };
      } else if (state.subvista === "CONTROLES") {
        Array.prototype.forEach.call(modal.querySelectorAll(".bds-h98-dist"), function (db) {
          db.onclick = function () {
            var idx = Number(db.getAttribute("data-dist")) || 0;
            var dist = DISTRACTORES_TRIPLE[idx] || DISTRACTORES_TRIPLE[0];
            Object.assign(cur, dist.patch);
            registrarTraza("Control", "Aplico " + dist.etiqueta + " en " + cur.id);
            render();
          };
        });
      }
    }

    btn.onclick = function () { state.abierto = !state.abierto; render(); };

    window.BDSHorariosV98 = {
      open: function () { state.abierto = true; render(); },
      close: function () { state.abierto = false; render(); },
      audit: function (list) { return auditarBloques(list || state.bloques); },
      checkGrade12Blocked: function (subj, sec) {
        var u = String(subj || "").toUpperCase();
        var restricted = MATERIAS_HASTA_11.some(function (m) { return u.indexOf(m) >= 0; });
        return restricted && esGrado12(sec);
      },
      schedReady: true
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarModuloHorarios);
  else montarModuloHorarios();
})();