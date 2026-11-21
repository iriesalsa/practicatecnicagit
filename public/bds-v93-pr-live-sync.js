(function () {
  "use strict";
  if (window.__BDS_PR_LIVE_V93__) return;
  window.__BDS_PR_LIVE_V93__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function montarPanelLive() {
    if (document.getElementById("bds-v93-pr-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v93-pr-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir estado de actualizacion en vivo y accesos directos");
    btn.style.cssText =
      "position:fixed;right:12px;bottom:136px;z-index:2147483635;" +
      "background:#0f172a;color:#f8fafc;border:2px solid #34d399;border-radius:999px;" +
      "padding:7px 12px;font:800 11.5px system-ui,-apple-system,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udd04 Live / PR v9.3";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v93-pr-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var abierto = false;

    function render() {
      if (!abierto) {
        modal.style.display = "none";
        return;
      }
      modal.style.display = "block";
      modal.innerHTML =
        '<div style="max-width:620px;margin:12px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #059669;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Actualizaci\u00f3n en Vivo v9.3 \u2022 Accesos R\u00e1pidos</strong>' +
        '<button id="bds-p93-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px;font-size:12px;margin-bottom:10px">' +
        '<div><strong>Sitio en l\u00ednea:</strong> https://www.practicatecnica.com</div>' +
        '<div style="margin-top:4px"><strong>Compilaci\u00f3n / Flujo:</strong> Rama de mejora, Pull Request, verificaci\u00f3n y despliegue en vivo.</div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        '<button id="bds-p93-nodos" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#4338ca;color:#fff;font-size:12px;font-weight:800;cursor:pointer">N\u00f3dulos / Pesta\u00f1as</button>' +
        '<button id="bds-p93-qr" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">QR Caja / \u00danico</button>' +
        '<button id="bds-p93-chat" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Chats Canales</button>' +
        '<button id="bds-p93-stats" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#1e293b;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Resumen &amp; Cruce</button>' +
        '</div>' +
        '</div></div>';

      document.getElementById("bds-p93-close").onclick = function () { abierto = false; render(); };
      document.getElementById("bds-p93-nodos").onclick = function () { abierto = false; render(); if (window.BDSNodosV92) window.BDSNodosV92.open(); };
      document.getElementById("bds-p93-qr").onclick = function () { abierto = false; render(); if (window.BDSQrVerifV89) window.BDSQrVerifV89.open(); };
      document.getElementById("bds-p93-chat").onclick = function () { abierto = false; render(); if (window.BDSChatStatsV91) window.BDSChatStatsV91.openChat("GENERAL"); };
      document.getElementById("bds-p93-stats").onclick = function () { abierto = false; render(); if (window.BDSChatStatsV91) window.BDSChatStatsV91.openStats(); };
    }

    btn.onclick = function () { abierto = !abierto; render(); };

    window.BDSPrLiveV93 = {
      open: function () { abierto = true; render(); },
      close: function () { abierto = false; render(); },
      version: "v9.3"
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarPanelLive);
  else montarPanelLive();
})();