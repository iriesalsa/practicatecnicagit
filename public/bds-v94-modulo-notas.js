(function () {
  "use strict";
  if (window.__BDS_NOTAS_V95__) return;
  window.__BDS_NOTAS_V95__ = true;

  var STORAGE_KEY = "bds_notas_registros_v95";

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function clamp100(n) {
    var v = Number(n);
    if (!isFinite(v)) return 0;
    return Math.max(0, Math.min(100, v));
  }

  function cargarLocal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_e) {
      return [];
    }
  }

  function guardarLocal(lista) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista.slice(-50)));
    } catch (_e) {}
  }

  function calcularCalificacion(rubros, pesos) {
    var cot = clamp100(rubros.cot);
    var tar = clamp100(rubros.tar);
    var pru = clamp100(rubros.pru);
    var asi = clamp100(rubros.asi);

    var wCot = Number(pesos.cot) || 0;
    var wTar = Number(pesos.tar) || 0;
    var wPru = Number(pesos.pru) || 0;
    var wAsi = Number(pesos.asi) || 0;

    var sumaPesos = Number((wCot + wTar + wPru + wAsi).toFixed(4));
    var exacta = Number(((cot * wCot) + (tar * wTar) + (pru * wPru) + (asi * wAsi)).toFixed(2));
    var redondeada = Math.round(exacta);
    var estado = redondeada >= 70 ? "Aprobado / Al dia" : "Requiere seguimiento";

    return {
      exacta: exacta,
      redondeada: redondeada,
      sumaPesos: sumaPesos,
      estado: estado
    };
  }

  async function sincronizarBd(registro) {
    var sbUrl = window.BDS_SUPABASE_URL || window.SUPABASE_URL || "";
    var sbKey = window.BDS_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || "";
    if (!sbUrl || !sbKey || typeof fetch !== "function") {
      return { synced: false, destino: "Local (sin credenciales BD en ventana)" };
    }
    try {
      var endpoint = String(sbUrl).replace(/\/+$/, "") + "/rest/v1/notas_registros";
      var resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": sbKey,
          "Authorization": "Bearer " + sbKey,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          estudiante_ref: registro.estudianteRef,
          asignatura_ref: registro.asignaturaRef,
          cot: registro.cot,
          tar: registro.tar,
          pru: registro.pru,
          asi: registro.asi,
          nota_exacta: registro.exacta,
          nota_redondeada: registro.redondeada,
          estado: registro.estado
        })
      });
      if (resp.ok) {
        return { synced: true, destino: "Sincronizado en BD (notas_registros)" };
      }
      return { synced: false, destino: "Local (BD respondio " + resp.status + ")" };
    } catch (_e) {
      return { synced: false, destino: "Local (sin red o BD no disponible)" };
    }
  }

  function montarModuloNotas() {
    if (document.getElementById("bds-v94-notas-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v94-notas-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir modulo de calificaciones con guardado y sincronizacion");
    btn.style.cssText =
      "position:fixed;left:12px;bottom:56px;z-index:2147483635;" +
      "background:#1e3a8a;color:#ffffff;border:2px solid #93c5fd;border-radius:999px;" +
      "padding:7px 12px;font:800 11.5px system-ui,-apple-system,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udcdd Notas v9.5";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v94-notas-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      abierto: false,
      estudianteRef: "Estudiante / Seccion",
      asignaturaRef: "Asignatura / Subarea",
      rubros: { cot: 95, tar: 100, pru: 88, asi: 100 },
      pesos: { cot: 0.50, tar: 0.10, pru: 0.35, asi: 0.05 },
      historial: cargarLocal(),
      syncMsg: ""
    };

    function render() {
      if (!state.abierto) {
        modal.style.display = "none";
        return;
      }
      modal.style.display = "block";
      var calc = calcularCalificacion(state.rubros, state.pesos);

      var histHtml = state.historial.length
        ? state.historial.slice(-4).reverse().map(function (h) {
            return '<div style="background:#f1f5f9;border-radius:8px;padding:6px 8px;margin-bottom:5px;font-size:11.5px">' +
              '<strong>' + esc(h.estudianteRef) + '</strong> (' + esc(h.asignaturaRef) + '): ' +
              '<strong>' + esc(h.redondeada) + '</strong> (exacta ' + esc(h.exacta) + ') \u2022 ' + esc(h.destino || "Local") + '</div>';
          }).join("")
        : '<div style="font-size:11.5px;color:#64748b">A\u00fan no hay registros guardados.</div>';

      modal.innerHTML =
        '<div style="max-width:700px;margin:10px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #1e3a8a;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">M\u00f3dulo de Calificaciones v9.5 \u2022 Guardado y Sincronizaci\u00f3n BD</strong>' +
        '<button id="bds-nt94-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px;font-size:12px">' +
        '<label>Estudiante / Grupo<input id="bds-nt94-est" type="text" value="' + esc(state.estudianteRef) + '" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Asignatura / M\u00f3dulo<input id="bds-nt94-asig" type="text" value="' + esc(state.asignaturaRef) + '" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px;font-size:12px">' +
        '<label>Cotidiano<input id="bds-nt94-r-cot" type="number" min="0" max="100" value="' + esc(state.rubros.cot) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Tareas<input id="bds-nt94-r-tar" type="number" min="0" max="100" value="' + esc(state.rubros.tar) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Pruebas<input id="bds-nt94-r-pru" type="number" min="0" max="100" value="' + esc(state.rubros.pru) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Asistencia<input id="bds-nt94-r-asi" type="number" min="0" max="100" value="' + esc(state.rubros.asi) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px;font-size:12px">' +
        '<label>Peso Cot.<input id="bds-nt94-w-cot" type="number" step="0.05" value="' + esc(state.pesos.cot) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Peso Tar.<input id="bds-nt94-w-tar" type="number" step="0.05" value="' + esc(state.pesos.tar) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Peso Pru.<input id="bds-nt94-w-pru" type="number" step="0.05" value="' + esc(state.pesos.pru) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Peso Asi.<input id="bds-nt94-w-asi" type="number" step="0.05" value="' + esc(state.pesos.asi) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '</div>' +
        '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:10px;font-size:12.5px;margin-bottom:10px">' +
        '<div><strong>Calificaci\u00f3n redondeada:</strong> ' + esc(calc.redondeada) + ' / 100 | <strong>Exacta:</strong> ' + esc(calc.exacta) + '</div>' +
        '<div style="margin-top:4px"><strong>Suma de pesos:</strong> ' + esc(calc.sumaPesos) + ' | <strong>Estado:</strong> ' + esc(calc.estado) + '</div>' +
        (state.syncMsg ? '<div style="margin-top:4px;color:#047857;font-weight:700">' + esc(state.syncMsg) + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:10px">' +
        '<button id="bds-nt94-save" type="button" style="padding:7px 12px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Guardar y Sincronizar</button>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:4px">Registros guardados:</div>' +
        histHtml +
        '</div></div>';

      document.getElementById("bds-nt94-close").onclick = function () { state.abierto = false; render(); };

      function syncInputs() {
        state.estudianteRef = document.getElementById("bds-nt94-est").value;
        state.asignaturaRef = document.getElementById("bds-nt94-asig").value;
        state.rubros.cot = clamp100(document.getElementById("bds-nt94-r-cot").value);
        state.rubros.tar = clamp100(document.getElementById("bds-nt94-r-tar").value);
        state.rubros.pru = clamp100(document.getElementById("bds-nt94-r-pru").value);
        state.rubros.asi = clamp100(document.getElementById("bds-nt94-r-asi").value);
        state.pesos.cot = Number(document.getElementById("bds-nt94-w-cot").value) || 0;
        state.pesos.tar = Number(document.getElementById("bds-nt94-w-tar").value) || 0;
        state.pesos.pru = Number(document.getElementById("bds-nt94-w-pru").value) || 0;
        state.pesos.asi = Number(document.getElementById("bds-nt94-w-asi").value) || 0;
      }

      ["bds-nt94-est", "bds-nt94-asig", "bds-nt94-r-cot", "bds-nt94-r-tar", "bds-nt94-r-pru", "bds-nt94-r-asi", "bds-nt94-w-cot", "bds-nt94-w-tar", "bds-nt94-w-pru", "bds-nt94-w-asi"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.onchange = function () { syncInputs(); render(); };
      });

      document.getElementById("bds-nt94-save").onclick = async function () {
        syncInputs();
        var r = calcularCalificacion(state.rubros, state.pesos);
        var nuevo = {
          estudianteRef: state.estudianteRef || "Registro",
          asignaturaRef: state.asignaturaRef || "Asignatura",
          cot: state.rubros.cot,
          tar: state.rubros.tar,
          pru: state.rubros.pru,
          asi: state.rubros.asi,
          exacta: r.exacta,
          redondeada: r.redondeada,
          estado: r.estado,
          destino: "Local"
        };
        var resSync = await sincronizarBd(nuevo);
        nuevo.destino = resSync.destino;
        state.syncMsg = resSync.destino;
        state.historial.push(nuevo);
        guardarLocal(state.historial);
        render();
      };
    }

    btn.onclick = function () {
      state.abierto = !state.abierto;
      render();
    };

    window.BDSNotasV95 = {
      open: function () { state.abierto = true; render(); },
      close: function () { state.abierto = false; render(); },
      calcular: function (rubros, pesos) { return calcularCalificacion(rubros || state.rubros, pesos || state.pesos); },
      syncReady: true
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarModuloNotas);
  else montarModuloNotas();
})();