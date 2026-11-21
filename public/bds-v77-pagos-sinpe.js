(function () {
  "use strict";
  if (window.__BDS_PAGOS_SINPE_V77__) return;
  window.__BDS_PAGOS_SINPE_V77__ = true;

  var SINPE_NUM = "60906359";
  var SINPE_WA  = "50660906359";
  var TITULAR   = "Max Salazar S\u00e1nchez";
  var BANCO     = "Banco Popular";

  function montarModalPagos() {
    if (document.getElementById("bds-v77-pagos-modal")) return;

    var modal = document.createElement("div");
    modal.id = "bds-v77-pagos-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "bds-v77-pagos-title");
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483646;background:rgba(15,23,42,.78);" +
      "backdrop-filter:blur(3px);align-items:center;justify-content:center;padding:14px;" +
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif";

    modal.innerHTML =
      '<div style="width:100%;max-width:540px;background:#ffffff;color:#0f172a;border-radius:18px;' +
      'border:2px solid #94a3b8;box-shadow:0 24px 60px rgba(15,23,42,.45);overflow:hidden">' +
      '<div style="background:#0f172a;color:#f8fafc;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #047857">' +
      '<div><div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#6ee7b7;text-transform:uppercase">pracTICAtecnica.com \u2022 Pagos, Suscripciones y Contacto</div>' +
      '<h2 id="bds-v77-pagos-title" style="margin:2px 0 0;font-size:17px;font-weight:900;color:#ffffff">Suscripciones y SINPE M\u00f3vil (No es Planeamiento Docente)</h2></div>' +
      '<button id="bds-v77-pagos-x" type="button" aria-label="Cerrar ventana" style="background:rgba(255,255,255,.14);color:#fff;border:none;border-radius:8px;width:30px;height:30px;font-size:16px;font-weight:800;cursor:pointer">&times;</button>' +
      '</div>' +
      '<div style="padding:18px;font-size:13.5px;line-height:1.55;color:#1e293b">' +
      '<p style="margin:0 0 12px">Este espacio corresponde exclusivamente a <strong>pagos, suscripciones y soporte</strong> de <strong>pracTICAtecnica.com</strong>. Para planear clases o lecciones utilice <strong>Planeamiento IA</strong>.</p>' +
      '<div style="background:#f0fdf4;border:1.5px solid #15803d;border-radius:14px;padding:14px;margin-bottom:12px">' +
      '<div style="font-size:12px;font-weight:900;color:#14532d;text-transform:uppercase;margin-bottom:6px">M\u00e9todo de Pago Principal \u2022 SINPE M\u00f3vil (Costa Rica)</div>' +
      '<div style="font-size:14px;color:#0f172a"><strong>N\u00famero SINPE M\u00f3vil:</strong> <span id="bds-sinpe-num" style="font-weight:900;color:#047857">' + SINPE_NUM + '</span></div>' +
      '<div style="font-size:13.5px;color:#0f172a;margin-top:4px"><strong>A nombre de:</strong> ' + TITULAR + '</div>' +
      '<div style="font-size:13.5px;color:#0f172a;margin-top:4px"><strong>Entidad:</strong> ' + BANCO + '</div>' +
      '<div style="font-size:13.5px;color:#0f172a;margin-top:4px"><strong>Soporte y comprobantes (WhatsApp):</strong> +' + SINPE_WA + '</div>' +
      '</div>' +
      '<div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:12px;font-size:12.5px;color:#334155">' +
      '<div style="font-weight:800;color:#0f172a;margin-bottom:4px">\u00bfC\u00f3mo activar o renovar su suscripci\u00f3n?</div>' +
      '<div style="margin-bottom:4px">1. Realice el pago por <strong>SINPE M\u00f3vil</strong> al <strong>' + SINPE_NUM + '</strong> (' + BANCO + ', a nombre de ' + TITULAR + ').</div>' +
      '<div style="margin-bottom:4px">2. Envie el comprobante y el correo de su cuenta por WhatsApp al <strong>+' + SINPE_WA + '</strong>.</div>' +
      '<div>3. Una vez verificado el movimiento, su acceso o plan queda activado de forma clara y trazable.</div>' +
      '</div>' +
      '<div id="bds-v77-copiado-msg" style="display:none;margin-top:10px;padding:8px 12px;border-radius:8px;background:#dcfce7;color:#14532d;font-size:12.5px;font-weight:800">N\u00famero SINPE M\u00f3vil (' + SINPE_NUM + ') copiado al portapapeles.</div>' +
      '</div>' +
      '<div style="padding:0 18px 18px;display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end">' +
      '<button id="bds-v77-copy-sinpe" type="button" style="flex:1;min-width:160px;padding:11px 14px;border-radius:10px;border:2px solid #047857;background:#ffffff;color:#047857;font-size:13px;font-weight:800;cursor:pointer">Copiar SINPE (' + SINPE_NUM + ')</button>' +
      '<a id="bds-v77-wa-link" href="https://wa.me/' + SINPE_WA + '?text=Hola%2C%20deseo%20consultar%20sobre%20suscripciones%20y%20SINPE%20M%C3%B3vil%20en%20pracTICAtecnica.com" target="_blank" rel="noopener noreferrer" style="flex:1;min-width:170px;text-align:center;text-decoration:none;padding:11px 14px;border-radius:10px;background:#047857;color:#ffffff;font-size:13px;font-weight:800">Contactar WhatsApp</a>' +
      '</div></div>';

    document.body.appendChild(modal);

    function abrirModalPagos() { modal.style.display = "flex"; }
    function cerrarModalPagos() {
      modal.style.display = "none";
      var cp = document.getElementById("bds-v77-copiado-msg");
      if (cp) cp.style.display = "none";
    }

    document.getElementById("bds-v77-pagos-x").onclick = cerrarModalPagos;
    modal.addEventListener("click", function (ev) { if (ev.target === modal) cerrarModalPagos(); });

    document.getElementById("bds-v77-copy-sinpe").onclick = function () {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(SINPE_NUM).catch(function () {});
        }
      } catch (_e) {}
      var cp = document.getElementById("bds-v77-copiado-msg");
      if (cp) cp.style.display = "block";
    };

    window.BDSPagosModalV77 = { open: abrirModalPagos, close: cerrarModalPagos, sinpe: SINPE_NUM };
  }

  // Renombra botones/etiquetas que digan unicamente "Planes" (no "Planeamiento...")
  // para que quede claro que son Pagos / Suscripciones / SINPE
  function aclararEtiquetasPlanes() {
    try {
      var elems = document.querySelectorAll("button, a, [role='button'], span, div");
      for (var i = 0; i < elems.length; i++) {
        var el = elems[i];
        if (el.closest("#bds-v77-pagos-modal")) continue;
        if (el.children && el.children.length > 0) continue;
        var raw = (el.textContent || "").trim();
        if (/^(💳|💎|🧾|💰|⭐|📌)?\s*Planes$/i.test(raw)) {
          el.textContent = raw.replace(/\bPlanes\b/i, "Suscripciones & SINPE");
          el.setAttribute("data-bds-pagos-btn", "1");
        }
      }
    } catch (_e) {}
  }

  // Intercepta clics en botones de Suscripciones / SINPE / Pagos para abrir el modal claro
  document.addEventListener("click", function (ev) {
    try {
      var btn = ev.target && ev.target.closest ? ev.target.closest("button, a, [role='button']") : null;
      if (!btn || btn.closest("#bds-v77-pagos-modal")) return;
      var txt = (btn.textContent || "").trim().toLowerCase();
      if (btn.getAttribute("data-bds-pagos-btn") === "1" || txt === "suscripciones & sinpe" || txt === "planes") {
        ev.preventDefault();
        ev.stopPropagation();
        if (window.BDSPagosModalV77) window.BDSPagosModalV77.open();
      }
    } catch (_e) {}
  }, true);

  function init() {
    montarModalPagos();
    aclararEtiquetasPlanes();
    var t = 0;
    var obs = new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = 0; aclararEtiquetasPlanes(); }, 200);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();