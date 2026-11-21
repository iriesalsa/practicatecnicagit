(function () {
  "use strict";
  if (window.__BDS_QR_VERIF_V87__) return;
  window.__BDS_QR_VERIF_V87__ = true;

  var STORAGE_KEY = "bds_qr_canjeados_v87";

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function leerUsados() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return (obj && typeof obj === "object") ? obj : {};
    } catch (_e) {
      return {};
    }
  }

  function marcarUsado(token) {
    if (!token) return;
    try {
      var map = leerUsados();
      map[token] = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (_e) {}
  }

  async function sha256Hex(texto) {
    try {
      if (window.crypto && window.crypto.subtle && window.TextEncoder) {
        var bytes = new TextEncoder().encode(String(texto || ""));
        var buf = await window.crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      }
    } catch (_e) {}
    return "";
  }

  function parsearQr(rawText) {
    var txt = String(rawText || "").trim();
    var tipo = "BENEFICIO";
    var id = "";
    var refVal = "";
    var hashDeclarado = "";

    if (!txt) {
      return { ok: false, tipo: tipo, id: id, refVal: refVal, hashDeclarado: hashDeclarado, baseCarga: "" };
    }

    if (txt.charAt(0) === "{") {
      try {
        var obj = JSON.parse(txt);
        tipo = String(obj.tipo || obj.type || obj.categoria || "BENEFICIO").toUpperCase();
        id = String(obj.id || obj.codigo || obj.matricula || obj.factura || obj.compra || "");
        refVal = String(obj.ref || obj.valor || obj.nota || obj.monto || obj.detalle || "");
        hashDeclarado = String(obj.sha256 || obj.hash || "").toLowerCase();
        return { ok: Boolean(id), tipo: tipo, id: id, refVal: refVal, hashDeclarado: hashDeclarado, baseCarga: tipo + "|" + id + "|" + refVal };
      } catch (_e) {}
    }

    var partes = txt.split(/[|;]/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (partes.length >= 2) {
      tipo = partes[0].toUpperCase();
      id = partes[1];
      if (partes.length >= 4 && /^[0-9a-f]{16,64}$/i.test(partes[partes.length - 1])) {
        hashDeclarado = partes[partes.length - 1].toLowerCase();
        refVal = partes.slice(2, partes.length - 1).join(" | ");
      } else if (partes.length >= 3) {
        if (/^[0-9a-f]{16,64}$/i.test(partes[2])) {
          hashDeclarado = partes[2].toLowerCase();
        } else {
          refVal = partes.slice(2).join(" | ");
        }
      }
      return { ok: Boolean(id), tipo: tipo, id: id, refVal: refVal, hashDeclarado: hashDeclarado, baseCarga: tipo + "|" + id + "|" + refVal };
    }

    var upper = txt.toUpperCase();
    if (upper.indexOf("BEN") === 0 || upper.indexOf("CUP") === 0 || upper.indexOf("PASE") === 0) tipo = "BENEFICIO";
    else if (upper.indexOf("NOTA") === 0 || upper.indexOf("CALIF") === 0) tipo = "NOTA";
    else if (upper.indexOf("MAT") === 0 || upper.indexOf("EST") === 0) tipo = "MATRICULA";
    else if (upper.indexOf("FAC") === 0) tipo = "FACTURA";
    else if (upper.indexOf("COM") === 0 || upper.indexOf("SINPE") === 0) tipo = "COMPRA";

    return { ok: true, tipo: tipo, id: txt, refVal: "", hashDeclarado: "", baseCarga: tipo + "|" + txt + "|" };
  }

  async function verificarQrCompleto(rawText, consumirUso) {
    var parsed = parsearQr(rawText);
    var hashCalculado = await sha256Hex(parsed.baseCarga || rawText);
    var coincide = false;
    if (parsed.hashDeclarado) {
      if (parsed.hashDeclarado.length === 64) {
        coincide = (parsed.hashDeclarado === hashCalculado);
      } else {
        coincide = (hashCalculado.indexOf(parsed.hashDeclarado) === 0);
      }
    }

    var tokenUso = (parsed.tipo + "::" + parsed.id + "::" + (hashCalculado || rawText)).toLowerCase();
    var usados = leerUsados();
    var yaUsado = Boolean(usados[tokenUso]);

    var estadoTexto = "SIN SELLO PREVIO: se calcul\u00f3 su verificaci\u00f3n actual.";
    if (parsed.hashDeclarado && !coincide) {
      estadoTexto = "NO COINCIDE: el contenido pudo alterarse.";
    } else if (yaUsado) {
      estadoTexto = "YA CANJEADO / USADO: este QR ya fue validado anteriormente.";
    } else if (coincide || parsed.ok) {
      if (consumirUso && coincide) {
        marcarUsado(tokenUso);
        estadoTexto = "VALIDADO Y MARCADO COMO USADO: registro aut\u00e9ntico y canjeado.";
      } else {
        estadoTexto = coincide ? "V\u00c1LIDO Y DISPONIBLE: listo para canjear o aplicar." : estadoTexto;
      }
    }

    return {
      parsed: parsed,
      hashCalculado: hashCalculado,
      coincide: coincide,
      yaUsado: yaUsado,
      estadoTexto: estadoTexto,
      codigoCorto: hashCalculado ? hashCalculado.slice(0, 12).toUpperCase() : "SIN-HASH"
    };
  }

  async function generarQrFirmado(tipo, id, refVal) {
    var tClean = String(tipo || "BENEFICIO").trim().toUpperCase();
    var idClean = String(id || "").trim();
    var rClean = String(refVal || "").trim();
    var base = tClean + "|" + idClean + "|" + rClean;
    var h = await sha256Hex(base);
    return {
      qrPayload: base + "|" + h,
      hash: h,
      codigoCorto: h ? h.slice(0, 12).toUpperCase() : ""
    };
  }

  function montarModalQr() {
    if (document.getElementById("bds-v87-qr-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v87-qr-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir validador de QR tipo pase, beneficio o registro");
    btn.style.cssText =
      "position:fixed;left:12px;bottom:124px;z-index:2147483635;" +
      "background:#1e293b;color:#f8fafc;border:2px solid #fbbf24;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udcf1 QR Pases & Validaci\u00f3n";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v87-qr-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      tipoGen: "BENEFICIO",
      idGen: "PASE-2026-01",
      refGen: "Beneficio estudiantil / Laboratorio",
      qrInput: "",
      resultadoHtml: ""
    };

    function pintarResultado(ver) {
      state.resultadoHtml =
        '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:12px;font-size:12.5px;color:#0f172a">' +
        '<div><strong>Estado:</strong> ' + esc(ver.estadoTexto) + '</div>' +
        '<div style="margin-top:4px"><strong>Tipo:</strong> ' + esc(ver.parsed.tipo) + ' | <strong>ID / Matr\u00edcula / Folio:</strong> ' + esc(ver.parsed.id || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>Detalle:</strong> ' + esc(ver.parsed.refVal || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>C\u00f3digo de comprobaci\u00f3n:</strong> ' + esc(ver.codigoCorto) + '</div>' +
        '<div style="margin-top:4px;word-break:break-all"><strong>Huella de verificaci\u00f3n:</strong> ' + esc(ver.hashCalculado) + '</div>' +
        '</div>';
    }

    async function refrescarNuevoPase() {
      var firmado = await generarQrFirmado(state.tipoGen, state.idGen, state.refGen);
      state.qrInput = firmado.qrPayload;
      var ver = await verificarQrCompleto(state.qrInput, false);
      pintarResultado(ver);
      renderModal();
    }

    function renderModal() {
      modal.innerHTML =
        '<div style="max-width:650px;margin:12px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #64748b;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Validador de QR (Beneficio, Compra, Factura, Nota, Matr\u00edcula)</strong>' +
        '<button id="bds-v87-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:14px">' +
        '<div style="font-size:12px;color:#475569;margin-bottom:10px">Uso interno educativo/comunitario: verifica integridad y evita doble canje de pases o beneficios.</div>' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">1. Crear pase o registro QR de prueba:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
        '<select id="bds-qr87-tipo" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;font-weight:700">' +
        '<option value="BENEFICIO">BENEFICIO</option><option value="COMPRA">COMPRA</option><option value="FACTURA">FACTURA</option><option value="NOTA">NOTA</option><option value="MATRICULA">MATRICULA</option>' +
        '</select>' +
        '<input id="bds-qr87-id" type="text" value="' + esc(state.idGen) + '" placeholder="ID / Matr\u00edcula / Folio" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:130px"/>' +
        '<input id="bds-qr87-ref" type="text" value="' + esc(state.refGen) + '" placeholder="Beneficio, monto o nota" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:130px"/>' +
        '<button id="bds-qr87-gen" type="button" style="padding:7px 12px;border-radius:8px;border:none;background:#1e40af;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Crear QR</button>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">2. Pegar o escanear lectura del QR y validar/canjear:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">' +
        '<input id="bds-qr87-raw" type="text" value="' + esc(state.qrInput) + '" placeholder="Pegue aqu\u00ed el texto le\u00eddo del QR..." style="padding:8px 10px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:180px"/>' +
        '<button id="bds-qr87-check" type="button" style="padding:8px 12px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Solo Validar</button>' +
        '<button id="bds-qr87-redeem" type="button" style="padding:8px 12px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Validar y Canjear</button>' +
        '</div>' +
        (state.resultadoHtml || "") +
        '</div></div>';

      document.getElementById("bds-v87-close").onclick = function () { modal.style.display = "none"; };
      var tSel = document.getElementById("bds-qr87-tipo");
      if (tSel) tSel.value = state.tipoGen;

      document.getElementById("bds-qr87-gen").onclick = function () {
        state.tipoGen = tSel ? tSel.value : state.tipoGen;
        state.idGen = document.getElementById("bds-qr87-id").value;
        state.refGen = document.getElementById("bds-qr87-ref").value;
        refrescarNuevoPase();
      };

      document.getElementById("bds-qr87-check").onclick = function () {
        state.qrInput = document.getElementById("bds-qr87-raw").value;
        verificarQrCompleto(state.qrInput, false).then(function (ver) {
          pintarResultado(ver);
          renderModal();
        });
      };

      document.getElementById("bds-qr87-redeem").onclick = function () {
        state.qrInput = document.getElementById("bds-qr87-raw").value;
        verificarQrCompleto(state.qrInput, true).then(function (ver) {
          pintarResultado(ver);
          renderModal();
        });
      };
    }

    btn.onclick = function () {
      modal.style.display = "block";
      refrescarNuevoPase();
    };

    window.BDSQrVerifV87 = {
      open: function () { modal.style.display = "block"; refrescarNuevoPase(); },
      close: function () { modal.style.display = "none"; },
      signAndVerify: async function (tipo, id, refVal) {
        var g = await generarQrFirmado(tipo, id, refVal);
        var v = await verificarQrCompleto(g.qrPayload, false);
        return { valid: v.coincide, sha256Len: v.hashCalculado.length, tipo: v.parsed.tipo };
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarModalQr);
  else montarModalQr();
})();