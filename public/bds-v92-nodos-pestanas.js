(function () {
  "use strict";
  if (window.__BDS_NODOS_V92__) return;
  window.__BDS_NODOS_V92__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var NODOS_INICIALES = {
    COOPE_1: {
      titulo: "Cooperativa \u2022 Caja 1",
      rol: "COOPERATIVA",
      titular: "1-1111-0001",
      folio: "C1-2026-01",
      notaOperativa: "Atencion estudiante #1 en caja cooperativa",
      atendidos: 0
    },
    COOPE_2: {
      titulo: "Cooperativa \u2022 Caja 2",
      rol: "COOPERATIVA",
      titular: "1-1111-0002",
      folio: "C2-2026-01",
      notaOperativa: "Atencion estudiante #2 en caja cooperativa",
      atendidos: 0
    },
    COMEDOR: {
      titulo: "Comedor \u2022 Puesto Principal",
      rol: "COMEDOR",
      titular: "1-1111-0003",
      folio: "COM-2026-01",
      notaOperativa: "Control de servicio de comedor",
      atendidos: 0
    },
    DOCENTE: {
      titulo: "Docente \u2022 Seguimiento Aula",
      rol: "DOCENTE",
      titular: "1-1111-0004",
      folio: "DOC-2026-01",
      notaOperativa: "Consulta y registro docente independiente",
      atendidos: 0
    }
  };

  function montarNodos() {
    if (document.getElementById("bds-v92-nodos-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v92-nodos-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir nodos independientes en pestanas para cooperativa, comedor y docente");
    btn.style.cssText =
      "position:fixed;right:12px;bottom:96px;z-index:2147483636;" +
      "background:#312e81;color:#ffffff;border:2px solid #a5b4fc;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,-apple-system,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83e\udde9 Nodos / Pesta\u00f1as";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v92-nodos-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var nodos = JSON.parse(JSON.stringify(NODOS_INICIALES));
    var activa = "COOPE_1";
    var abierto = false;

    function render() {
      if (!abierto) {
        modal.style.display = "none";
        return;
      }
      modal.style.display = "block";
      var cur = nodos[activa] || nodos.COOPE_1;

      var tabsHtml = Object.keys(nodos).map(function (key) {
        var n = nodos[key];
        var isAct = (key === activa);
        return '<button type="button" data-nodo="' + key + '" class="bds-n92-tab" style="padding:6px 10px;border-radius:8px;border:none;background:' + (isAct ? "#4338ca" : "#e2e8f0") + ';color:' + (isAct ? "#fff" : "#0f172a") + ';font-size:11.5px;font-weight:800;cursor:pointer">' + esc(n.titulo) + '</button>';
      }).join("");

      modal.innerHTML =
        '<div style="max-width:700px;margin:10px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #4338ca;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">N\u00f3dulos Independientes por Pesta\u00f1a (Coope 1 &amp; 2 \u2022 Comedor \u2022 Docente)</strong>' +
        '<button id="bds-n92-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;border-bottom:1px solid #e2e8f0;padding-bottom:8px">' + tabsHtml + '</div>' +
        '<div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:11px;margin-bottom:10px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<strong style="font-size:13px">' + esc(cur.titulo) + '</strong>' +
        '<span style="font-size:12px;font-weight:800;color:#047857">Atendidos en esta pesta\u00f1a: ' + esc(cur.atendidos) + '</span>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:8px;font-size:12px">' +
        '<label>Titular / ID<input id="bds-n92-tit" type="text" value="' + esc(cur.titular) + '" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Folio / C\u00f3digo<input id="bds-n92-fol" type="text" value="' + esc(cur.folio) + '" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '<label>Observaci\u00f3n<input id="bds-n92-obs" type="text" value="' + esc(cur.notaOperativa) + '" style="width:100%;padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-top:3px"/></label>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        '<button id="bds-n92-reg" type="button" style="padding:7px 12px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Registrar Atenci\u00f3n en N\u00f3dulo</button>' +
        '<button id="bds-n92-qr" type="button" style="padding:7px 12px;border-radius:8px;border:none;background:#1d4ed8;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Abrir Validador QR</button>' +
        '</div></div>' +
        '<div style="font-size:11.5px;color:#475569">Cada pesta\u00f1a/n\u00f3dulo conserva su propio folio, titular y contador independiente; para bloquear doble uso entre dispositivos distintos se recomienda respaldar en base de datos compartida.</div>' +
        '</div></div>';

      document.getElementById("bds-n92-close").onclick = function () { abierto = false; render(); };

      Array.prototype.forEach.call(modal.querySelectorAll(".bds-n92-tab"), function (tb) {
        tb.onclick = function () {
          var k = tb.getAttribute("data-nodo");
          if (k && nodos[k]) { activa = k; render(); }
        };
      });

      document.getElementById("bds-n92-tit").onchange = function (ev) { cur.titular = ev.target.value; };
      document.getElementById("bds-n92-fol").onchange = function (ev) { cur.folio = ev.target.value; };
      document.getElementById("bds-n92-obs").onchange = function (ev) { cur.notaOperativa = ev.target.value; };

      document.getElementById("bds-n92-reg").onclick = function () {
        cur.titular = document.getElementById("bds-n92-tit").value;
        cur.folio = document.getElementById("bds-n92-fol").value;
        cur.notaOperativa = document.getElementById("bds-n92-obs").value;
        cur.atendidos = (Number(cur.atendidos) || 0) + 1;
        render();
      };

      document.getElementById("bds-n92-qr").onclick = function () {
        abierto = false;
        render();
        if (window.BDSQrVerifV89 && window.BDSQrVerifV89.open) window.BDSQrVerifV89.open();
      };
    }

    btn.onclick = function () {
      abierto = !abierto;
      render();
    };

    window.BDSNodosV92 = {
      open: function (k) { if (k && nodos[k]) activa = k; abierto = true; render(); },
      close: function () { abierto = false; render(); },
      getNode: function (k) { return nodos[k || activa] || null; },
      listNodes: function () { return Object.keys(nodos); }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarNodos);
  else montarNodos();
})();