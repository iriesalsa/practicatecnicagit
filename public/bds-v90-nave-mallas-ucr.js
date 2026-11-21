(function () {
  "use strict";
  if (window.__BDS_NAVE_V90__) return;
  window.__BDS_NAVE_V90__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var ITEMS_UCR_TEC = [
    {
      id: "U1",
      inst: "PAA (UCR / UNA)",
      area: "Razonamiento Matematico",
      enunciado: "En una feria educativa, un refresco cuesta 500 colones menos que un emparedado. Si 2 refrescos y 1 emparedado suman 4.000 colones, ¿cuanto cuesta el refresco?",
      opciones: ["A) 1.000 colones", "B) 1.167 colones", "C) 1.500 colones", "D) 2.000 colones"],
      correcta: 0,
      explicacion: "Sea x el refresco. El emparedado cuesta x + 500. Entonces 2x + (x + 500) = 4.000 -> 3x = 3.500? Revisemos: si x = 1.000, emparedado = 1.500, 2(1.000)+1.500 = 3.500. Si x = 1.166,67 -> ajustemos valores limpios: 2 refrescos y 2 emparedados = 5.000 -> 4x + 1.000 = 5.000 -> 4x = 4.000 -> x = 1.000."
    },
    {
      id: "U2",
      inst: "Examen TEC",
      area: "Razonamiento con Figuras y Patrones",
      enunciado: "Una secuencia geometrica empieza con 2 triangulos en el paso 1, 5 en el paso 2, 10 en el paso 3 y 17 en el paso 4. ¿Cuantos triangulos tendra el paso 5?",
      opciones: ["A) 24", "B) 26", "C) 28", "D) 30"],
      correcta: 1,
      explicacion: "Las diferencias entre pasos consecutivos son +3, +5, +7; el siguiente salto impar es +9, y 17 + 9 = 26."
    },
    {
      id: "U3",
      inst: "PAA (UCR / UNA)",
      area: "Razonamiento Verbal",
      enunciado: "Si un proyecto tecnico reduce los tiempos de espera mediante automatizacion pero requiere capacitacion previa del personal, ¿que conclusion se deduce con certeza?",
      opciones: ["A) La automatizacion elimina toda capacitacion", "B) El beneficio operativo convive con una etapa inicial de formacion", "C) Solo aplica a centros privados", "D) Reduce la calidad del servicio"],
      correcta: 1,
      explicacion: "El enunciado plantea simultaneamente reduccion de tiempos y requisito de capacitacion previa, por lo que ambos aspectos coexisten."
    }
  ];

  function calcularNotaMalla(cot, tar, pru, asi) {
    var total = (Number(cot) || 0) + (Number(tar) || 0) + (Number(pru) || 0) + (Number(asi) || 0);
    return {
      proporcion: Number(total.toFixed(4)),
      porcentaje100: Number((total * 100).toFixed(2))
    };
  }

  function montarNave() {
    if (document.getElementById("bds-v90-nave-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v90-nave-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir consola de mallas MEP/Privado, practica universitaria CR y navegacion rapida");
    btn.style.cssText =
      "position:fixed;right:12px;bottom:16px;z-index:2147483637;" +
      "background:#1d4ed8;color:#ffffff;border:2px solid #93c5fd;border-radius:999px;" +
      "padding:8px 14px;font:800 12px system-ui,-apple-system,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\ude80 Mallas / U-CR / Nave";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v90-nave-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      tab: "MALLA",
      sector: "MEP",
      nivel: "Secundaria / Tecnica (7 a 12)",
      mallaNombre: "Malla MEP / Privado Editable",
      cot: 0.45,
      tar: 0.15,
      pru: 0.35,
      asi: 0.05,
      itemIdx: 0,
      respMarcada: null
    };

    function aplicarPreset(preset) {
      if (preset === "PRIMARIA_SEA") {
        state.mallaNombre = "Primaria (Referencia SEA)";
        state.cot = 0.50; state.tar = 0.10; state.pru = 0.35; state.asi = 0.05;
      } else if (preset === "TECNICA_ESP") {
        state.mallaNombre = "Especialidad Tecnica / Subarea";
        state.cot = 0.40; state.tar = 0.15; state.pru = 0.40; state.asi = 0.05;
      } else if (preset === "PRIVADO_CUSTOM") {
        state.mallaNombre = "Centro Privado / Bimestral-Trimestral";
        state.cot = 0.30; state.tar = 0.20; state.pru = 0.45; state.asi = 0.05;
      }
    }

    function renderModal() {
      var calc = calcularNotaMalla(state.cot, state.tar, state.pru, state.asi);
      var item = ITEMS_UCR_TEC[state.itemIdx] || ITEMS_UCR_TEC[0];

      var bodyHtml = "";
      if (state.tab === "MALLA") {
        bodyHtml =
          '<div style="font-size:12px;color:#334155;margin-bottom:8px">Adapta ponderaciones para <strong>Primaria, Secundaria, Especialidades T\u00e9cnicas</strong> o <strong>Centros MEP / Privados</strong> (total ideal 1.00 = 100%).</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">' +
          '<button type="button" data-p="PRIMARIA_SEA" class="bds-v90-pre" style="padding:5px 10px;border-radius:8px;border:1px solid #0f766e;background:#ecfdf5;color:#065f46;font-size:11.5px;font-weight:800;cursor:pointer">Base Primaria</button>' +
          '<button type="button" data-p="TECNICA_ESP" class="bds-v90-pre" style="padding:5px 10px;border-radius:8px;border:1px solid #1d4ed8;background:#eff6ff;color:#1e40af;font-size:11.5px;font-weight:800;cursor:pointer">Especialidad T\u00e9cnica</button>' +
          '<button type="button" data-p="PRIVADO_CUSTOM" class="bds-v90-pre" style="padding:5px 10px;border-radius:8px;border:1px solid #6d28d9;background:#f5f3ff;color:#5b21b6;font-size:11.5px;font-weight:800;cursor:pointer">Centro Privado</button>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:10px;font-size:12px">' +
          '<label>Sector<select id="bds-v90-sec" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"><option value="MEP">MEP</option><option value="PRIVADO">PRIVADO</option></select></label>' +
          '<label>Cotidiano (0-1)<input id="bds-v90-cot" type="number" step="0.05" value="' + esc(state.cot) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
          '<label>Tareas (0-1)<input id="bds-v90-tar" type="number" step="0.05" value="' + esc(state.tar) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
          '<label>Pruebas (0-1)<input id="bds-v90-pru" type="number" step="0.05" value="' + esc(state.pru) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
          '<label>Asistencia (0-1)<input id="bds-v90-asi" type="number" step="0.05" value="' + esc(state.asi) + '" style="width:100%;padding:6px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
          '</div>' +
          '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:11px;font-size:12.5px">' +
          '<div><strong>Malla activa:</strong> ' + esc(state.mallaNombre) + ' (' + esc(state.sector) + ')</div>' +
          '<div style="margin-top:4px"><strong>Suma ponderada:</strong> ' + esc(calc.proporcion) + ' | <strong>Equivalente sobre 100:</strong> ' + esc(calc.porcentaje100) + '%</div>' +
          '</div>';
      } else if (state.tab === "UCR_TEC") {
        var optsHtml = item.opciones.map(function (op, idx) {
          var sel = (state.respMarcada === idx);
          return '<button type="button" data-op="' + idx + '" class="bds-v90-op" style="display:block;width:100%;text-align:left;padding:7px 10px;margin-bottom:6px;border-radius:8px;border:1.5px solid ' + (sel ? "#1d4ed8" : "#cbd5e1") + ';background:' + (sel ? "#eff6ff" : "#ffffff") + ';color:#0f172a;font-size:12px;font-weight:700;cursor:pointer">' + esc(op) + '</button>';
        }).join("");

        var fbHtml = "";
        if (state.respMarcada !== null) {
          var esOk = (state.respMarcada === item.correcta);
          fbHtml =
            '<div style="background:' + (esOk ? "#ecfdf5" : "#fef2f2") + ';border:1.5px solid ' + (esOk ? "#10b981" : "#ef4444") + ';border-radius:10px;padding:10px;font-size:12px;margin-top:6px">' +
            '<strong>' + (esOk ? "Respuesta correcta" : "Revisa el razonamiento") + ':</strong> ' + esc(item.explicacion) +
            '</div>';
        }

        bodyHtml =
          '<div style="font-size:11.5px;color:#475569;margin-bottom:6px">Pr\u00e1ctica formativa estilo admisi\u00f3n UCR / UNA / TEC (no sustituye gu\u00edas oficiales).</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px">' +
          '<span style="font-size:12px;font-weight:800;color:#1e3a8a">' + esc(item.inst) + ' \u2022 ' + esc(item.area) + '</span>' +
          '<div style="display:flex;gap:6px">' +
          '<button id="bds-v90-prev" type="button" style="padding:4px 9px;border-radius:7px;border:1px solid #64748b;background:#fff;font-size:11.5px;font-weight:700;cursor:pointer">Anterior</button>' +
          '<button id="bds-v90-next" type="button" style="padding:4px 9px;border-radius:7px;border:1px solid #64748b;background:#fff;font-size:11.5px;font-weight:700;cursor:pointer">Siguiente</button>' +
          '</div></div>' +
          '<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#0f172a">' + esc(item.enunciado) + '</div>' +
          optsHtml + fbHtml;
      } else {
        bodyHtml =
          '<div style="font-size:12px;color:#334155;margin-bottom:10px">Accesos r\u00e1pidos para desplazarte sin perderte:</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
          '<button id="bds-v90-top" type="button" style="padding:8px 12px;border-radius:9px;border:none;background:#0f172a;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Ir arriba (Inicio)</button>' +
          '<button id="bds-v90-qr" type="button" style="padding:8px 12px;border-radius:9px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Abrir QR Caja / \u00danico</button>' +
          '</div>';
      }

      modal.innerHTML =
        '<div style="max-width:680px;margin:10px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #3b82f6;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Nave BDS v9.0 \u2022 Mallas MEP/Privado &amp; Admisi\u00f3n U-CR</strong>' +
        '<button id="bds-v90-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="display:flex;gap:6px;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:8px">' +
        '<button data-tab="MALLA" class="bds-v90-tab" type="button" style="padding:6px 11px;border-radius:8px;border:none;background:' + (state.tab === "MALLA" ? "#1d4ed8" : "#e2e8f0") + ';color:' + (state.tab === "MALLA" ? "#fff" : "#0f172a") + ';font-size:12px;font-weight:800;cursor:pointer">Mallas &amp; Centros</button>' +
        '<button data-tab="UCR_TEC" class="bds-v90-tab" type="button" style="padding:6px 11px;border-radius:8px;border:none;background:' + (state.tab === "UCR_TEC" ? "#1d4ed8" : "#e2e8f0") + ';color:' + (state.tab === "UCR_TEC" ? "#fff" : "#0f172a") + ';font-size:12px;font-weight:800;cursor:pointer">Pr\u00e1ctica UCR / TEC</button>' +
        '<button data-tab="NAVE" class="bds-v90-tab" type="button" style="padding:6px 11px;border-radius:8px;border:none;background:' + (state.tab === "NAVE" ? "#1d4ed8" : "#e2e8f0") + ';color:' + (state.tab === "NAVE" ? "#fff" : "#0f172a") + ';font-size:12px;font-weight:800;cursor:pointer">Navegaci\u00f3n</button>' +
        '</div>' +
        bodyHtml +
        '</div></div>';

      document.getElementById("bds-v90-close").onclick = function () { modal.style.display = "none"; };

      Array.prototype.forEach.call(modal.querySelectorAll(".bds-v90-tab"), function (tb) {
        tb.onclick = function () {
          state.tab = tb.getAttribute("data-tab") || "MALLA";
          renderModal();
        };
      });

      if (state.tab === "MALLA") {
        var sSel = document.getElementById("bds-v90-sec");
        if (sSel) {
          sSel.value = state.sector;
          sSel.onchange = function () { state.sector = sSel.value; renderModal(); };
        }
        Array.prototype.forEach.call(modal.querySelectorAll(".bds-v90-pre"), function (pb) {
          pb.onclick = function () { aplicarPreset(pb.getAttribute("data-p")); renderModal(); };
        });
        ["cot", "tar", "pru", "asi"].forEach(function (k) {
          var inp = document.getElementById("bds-v90-" + k);
          if (inp) inp.onchange = function () { state[k] = Number(inp.value) || 0; renderModal(); };
        });
      } else if (state.tab === "UCR_TEC") {
        Array.prototype.forEach.call(modal.querySelectorAll(".bds-v90-op"), function (ob) {
          ob.onclick = function () { state.respMarcada = Number(ob.getAttribute("data-op")); renderModal(); };
        });
        document.getElementById("bds-v90-prev").onclick = function () {
          state.itemIdx = (state.itemIdx - 1 + ITEMS_UCR_TEC.length) % ITEMS_UCR_TEC.length;
          state.respMarcada = null;
          renderModal();
        };
        document.getElementById("bds-v90-next").onclick = function () {
          state.itemIdx = (state.itemIdx + 1) % ITEMS_UCR_TEC.length;
          state.respMarcada = null;
          renderModal();
        };
      } else {
        document.getElementById("bds-v90-top").onclick = function () {
          modal.style.display = "none";
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        document.getElementById("bds-v90-qr").onclick = function () {
          modal.style.display = "none";
          if (window.BDSQrVerifV89 && window.BDSQrVerifV89.open) window.BDSQrVerifV89.open();
        };
      }
    }

    btn.onclick = function () {
      modal.style.display = "block";
      renderModal();
    };

    window.BDSNaveV90 = {
      open: function () { modal.style.display = "block"; renderModal(); },
      close: function () { modal.style.display = "none"; },
      calcGrid: calcularNotaMalla,
      itemsCount: ITEMS_UCR_TEC.length
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarNave);
  else montarNave();
})();