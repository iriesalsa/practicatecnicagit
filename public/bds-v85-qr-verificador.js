(function () {
  "use strict";
  if (window.__BDS_QR_VERIF_V85__) return;
  window.__BDS_QR_VERIF_V85__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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

  // Interpreta contenidos de QR con formato tipo|id|referencia|sha256 o JSON/texto estructurado
  function parsearQr(rawText) {
    var txt = String(rawText || "").trim();
    var tipo = "GENERAL";
    var id = "";
    var refVal = "";
    var hashDeclarado = "";

    if (!txt) {
      return { ok: false, tipo: tipo, id: id, refVal: refVal, hashDeclarado: hashDeclarado, baseCarga: "" };
    }

    // Intentar JSON si viene en formato objeto
    if (txt.charAt(0) === "{") {
      try {
        var obj = JSON.parse(txt);
        tipo = String(obj.tipo || obj.type || obj.categoria || "GENERAL").toUpperCase();
        id = String(obj.id || obj.codigo || obj.matricula || obj.factura || obj.compra || "");
        refVal = String(obj.ref || obj.valor || obj.nota || obj.monto || obj.detalle || "");
        hashDeclarado = String(obj.sha256 || obj.hash || "").toLowerCase();
        var baseJson = tipo + "|" + id + "|" + refVal;
        return { ok: Boolean(id), tipo: tipo, id: id, refVal: refVal, hashDeclarado: hashDeclarado, baseCarga: baseJson };
      } catch (_e) {}
    }

    // Formato separado por | o ;
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
      return {
        ok: Boolean(id),
        tipo: tipo,
        id: id,
        refVal: refVal,
        hashDeclarado: hashDeclarado,
        baseCarga: tipo + "|" + id + "|" + refVal
      };
    }

    // Detectar tipo por prefijo (ej: NOTA-123, MAT-456, FAC-789, COM-101)
    var upper = txt.toUpperCase();
    if (upper.indexOf("NOTA") === 0 || upper.indexOf("CALIF") === 0) tipo = "NOTA";
    else if (upper.indexOf("MAT") === 0 || upper.indexOf("EST") === 0) tipo = "MATRICULA";
    else if (upper.indexOf("FAC") === 0) tipo = "FACTURA";
    else if (upper.indexOf("COM") === 0 || upper.indexOf("SINPE") === 0) tipo = "COMPRA";

    return {
      ok: true,
      tipo: tipo,
      id: txt,
      refVal: "",
      hashDeclarado: "",
      baseCarga: tipo + "|" + txt + "|"
    };
  }

  async function verificarQrCompleto(rawText) {
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
    return {
      parsed: parsed,
      hashCalculado: hashCalculado,
      coincide: coincide,
      tieneHashEnQr: Boolean(parsed.hashDeclarado),
      codigoCorto: hashCalculado ? hashCalculado.slice(0, 12).toUpperCase() : "SIN-HASH"
    };
  }

  async function generarQrFirmado(tipo, id, refVal) {
    var tClean = String(tipo || "NOTA").trim().toUpperCase();
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
    if (document.getElementById("bds-v85-qr-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v85-qr-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir verificador de QR y comprobacion de integridad");
    btn.style.cssText =
      "position:fixed;left:12px;bottom:124px;z-index:2147483635;" +
      "background:#1e293b;color:#f8fafc;border:2px solid #fbbf24;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udcf1 QR Verificador";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v85-qr-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      tipoGen: "NOTA",
      idGen: "MAT-2026-001",
      refGen: "Nota 92",
      qrInput: "NOTA|MAT-2026-001|Nota 92",
      resultadoHtml: ""
    };

    async function refrescarGeneradoYVerificado() {
      var firmado = await generarQrFirmado(state.tipoGen, state.idGen, state.refGen);
      state.qrInput = firmado.qrPayload;
      var ver = await verificarQrCompleto(state.qrInput);
      var estadoMsg = ver.coincide
        ? "V\u00c1LIDO: los datos y la verificaci\u00f3n coinciden."
        : (ver.tieneHashEnQr ? "NO COINCIDE: el contenido pudo alterarse." : "SIN SELLO PREVIO: se calcul\u00f3 su verificaci\u00f3n actual.");

      state.resultadoHtml =
        '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:12px;font-size:12.5px;color:#0f172a">' +
        '<div><strong>Estado:</strong> ' + esc(estadoMsg) + '</div>' +
        '<div style="margin-top:4px"><strong>Tipo detectado:</strong> ' + esc(ver.parsed.tipo) + ' | <strong>ID / Matr\u00edcula / Folio:</strong> ' + esc(ver.parsed.id || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>Detalle (nota / compra / factura):</strong> ' + esc(ver.parsed.refVal || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>C\u00f3digo de comprobaci\u00f3n:</strong> ' + esc(ver.codigoCorto) + '</div>' +
        '<div style="margin-top:4px;word-break:break-all"><strong>Huella de verificaci\u00f3n:</strong> ' + esc(ver.hashCalculado) + '</div>' +
        '</div>';
      renderModal();
    }

    function renderModal() {
      modal.innerHTML =
        '<div style="max-width:640px;margin:12px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #64748b;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Captura y Comprobaci\u00f3n de QR (ID, Compra, Factura, Nota, Matr\u00edcula)</strong>' +
        '<button id="bds-v85-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:14px">' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">1. Crear o preparar un registro QR de prueba:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
        '<select id="bds-qr-tipo" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;font-weight:700">' +
        '<option value="NOTA">NOTA</option><option value="MATRICULA">MATRICULA</option><option value="FACTURA">FACTURA</option><option value="COMPRA">COMPRA</option><option value="ID">ID</option>' +
        '</select>' +
        '<input id="bds-qr-id" type="text" value="' + esc(state.idGen) + '" placeholder="ID / Matr\u00edcula / Folio" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:130px"/>' +
        '<input id="bds-qr-ref" type="text" value="' + esc(state.refGen) + '" placeholder="Nota, monto o detalle" style="padding:7px 10px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:130px"/>' +
        '<button id="bds-qr-gen" type="button" style="padding:7px 12px;border-radius:8px;border:none;background:#1e40af;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Generar y Validar</button>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">2. Pegar o escanear lectura del QR:</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:12px">' +
        '<input id="bds-qr-raw" type="text" value="' + esc(state.qrInput) + '" placeholder="Pegue aqu\u00ed el texto le\u00eddo del QR..." style="padding:8px 10px;border-radius:8px;border:1.5px solid #475569;flex:1"/>' +
        '<button id="bds-qr-check" type="button" style="padding:8px 12px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Comprobar QR</button>' +
        '</div>' +
        (state.resultadoHtml || "") +
        '</div></div>';

      document.getElementById("bds-v85-close").onclick = function () { modal.style.display = "none"; };
      var tSel = document.getElementById("bds-qr-tipo");
      if (tSel) tSel.value = state.tipoGen;
      document.getElementById("bds-qr-gen").onclick = function () {
        state.tipoGen = tSel ? tSel.value : state.tipoGen;
        state.idGen = document.getElementById("bds-qr-id").value;
        state.refGen = document.getElementById("bds-qr-ref").value;
        refrescarGeneradoYVerificado();
      };
      document.getElementById("bds-qr-check").onclick = function () {
        state.qrInput = document.getElementById("bds-qr-raw").value;
        verificarQrCompleto(state.qrInput).then(function (ver) {
          var estadoMsg = ver.coincide
            ? "V\u00c1LIDO: los datos y la verificaci\u00f3n coinciden."
            : (ver.tieneHashEnQr ? "NO COINCIDE: el contenido pudo alterarse." : "SIN SELLO PREVIO: se calcul\u00f3 su verificaci\u00f3n actual.");
          state.resultadoHtml =
            '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:12px;font-size:12.5px;color:#0f172a">' +
            '<div><strong>Estado:</strong> ' + esc(estadoMsg) + '</div>' +
            '<div style="margin-top:4px"><strong>Tipo detectado:</strong> ' + esc(ver.parsed.tipo) + ' | <strong>ID / Matr\u00edcula / Folio:</strong> ' + esc(ver.parsed.id || "-") + '</div>' +
            '<div style="margin-top:4px"><strong>Detalle (nota / compra / factura):</strong> ' + esc(ver.parsed.refVal || "-") + '</div>' +
            '<div style="margin-top:4px"><strong>C\u00f3digo de comprobaci\u00f3n:</strong> ' + esc(ver.codigoCorto) + '</div>' +
            '<div style="margin-top:4px;word-break:break-all"><strong>Huella de verificaci\u00f3n:</strong> ' + esc(ver.hashCalculado) + '</div>' +
            '</div>';
          renderModal();
        });
      };
    }

    btn.onclick = function () {
      modal.style.display = "block";
      refrescarGeneradoYVerificado();
    };

    window.BDSQrVerifV85 = {
      open: function () { modal.style.display = "block"; refrescarGeneradoYVerificado(); },
      close: function () { modal.style.display = "none"; },
      signAndVerify: async function (tipo, id, refVal) {
        var g = await generarQrFirmado(tipo, id, refVal);
        var v = await verificarQrCompleto(g.qrPayload);
        return { valid: v.coincide, sha256Len: v.hashCalculado.length, tipo: v.parsed.tipo };
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarModalQr);
  else montarModalQr();
})();