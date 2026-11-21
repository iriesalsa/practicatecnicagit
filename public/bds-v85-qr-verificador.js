(function () {
  "use strict";
  if (window.__BDS_QR_VERIF_V88__) return;
  window.__BDS_QR_VERIF_V88__ = true;

  var STORAGE_KEY = "bds_qr_canjeados_v88";
  var streamActual = null;
  var scanTimer = null;

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

  // Formato recomendado: ROL|TITULAR_ID|PASE_ID|DETALLE|SHA256
  function parsearQr(rawText) {
    var txt = String(rawText || "").trim();
    var rol = "ESTUDIANTE";
    var titularId = "";
    var paseId = "";
    var detalle = "";
    var hashDeclarado = "";

    if (!txt) {
      return { ok: false, rol: rol, titularId: titularId, paseId: paseId, detalle: detalle, hashDeclarado: hashDeclarado, baseCarga: "" };
    }

    if (txt.charAt(0) === "{") {
      try {
        var obj = JSON.parse(txt);
        rol = String(obj.rol || obj.role || obj.tipo || "ESTUDIANTE").toUpperCase();
        titularId = String(obj.titularId || obj.titular || obj.cedula || obj.carne || "");
        paseId = String(obj.paseId || obj.id || obj.codigo || obj.matricula || obj.factura || obj.compra || "");
        detalle = String(obj.detalle || obj.ref || obj.nota || obj.monto || "");
        hashDeclarado = String(obj.sha256 || obj.hash || "").toLowerCase();
        return {
          ok: Boolean(titularId && paseId),
          rol: rol,
          titularId: titularId,
          paseId: paseId,
          detalle: detalle,
          hashDeclarado: hashDeclarado,
          baseCarga: rol + "|" + titularId + "|" + paseId + "|" + detalle
        };
      } catch (_e) {}
    }

    var partes = txt.split(/[|;]/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (partes.length >= 3) {
      rol = partes[0].toUpperCase();
      titularId = partes[1];
      paseId = partes[2];
      if (partes.length >= 4 && /^[0-9a-f]{16,64}$/i.test(partes[partes.length - 1])) {
        hashDeclarado = partes[partes.length - 1].toLowerCase();
        detalle = partes.slice(3, partes.length - 1).join(" | ");
      } else if (partes.length >= 4) {
        detalle = partes.slice(3).join(" | ");
      }
      return {
        ok: Boolean(titularId && paseId),
        rol: rol,
        titularId: titularId,
        paseId: paseId,
        detalle: detalle,
        hashDeclarado: hashDeclarado,
        baseCarga: rol + "|" + titularId + "|" + paseId + "|" + detalle
      };
    }

    return {
      ok: false,
      rol: rol,
      titularId: titularId,
      paseId: txt,
      detalle: "",
      hashDeclarado: "",
      baseCarga: rol + "||" + txt + "|"
    };
  }

  async function verificarQrCompleto(rawText, titularPresente, consumirUso) {
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

    var titularIngresado = String(titularPresente || "").trim();
    var titularCoincide = !titularIngresado || (titularIngresado.toLowerCase() === String(parsed.titularId || "").toLowerCase());

    var tokenUso = (parsed.rol + "::" + parsed.titularId + "::" + parsed.paseId + "::" + (hashCalculado || rawText)).toLowerCase();
    var usados = leerUsados();
    var yaUsado = Boolean(usados[tokenUso]);

    var estadoTexto = "INCOMPLETO O SIN SELLO: revise rol, titular ID y pase ID.";
    if (!parsed.titularId || !parsed.paseId) {
      estadoTexto = "DATOS INCOMPLETOS: un QR intransferible requiere Titular ID y Pase ID.";
    } else if (parsed.hashDeclarado && !coincide) {
      estadoTexto = "NO COINCIDE LA VERIFICACI\u00d3N: el QR fue alterado o no corresponde.";
    } else if (!titularCoincide) {
      estadoTexto = "TRANSFERENCIA BLOQUEADA: este QR pertenece a otro titular (" + parsed.titularId + ").";
    } else if (yaUsado) {
      estadoTexto = "YA CANJEADO / USADO: este QR \u00fanico ya fue utilizado.";
    } else if (coincide) {
      if (consumirUso) {
        marcarUsado(tokenUso);
        estadoTexto = "APROBADO Y CANJEADO: QR \u00fanico verificado para " + parsed.titularId + ".";
      } else {
        estadoTexto = "V\u00c1LIDO E INTRANSFERIBLE: listo para validar/canjear.";
      }
    } else {
      estadoTexto = "SIN SELLO PREVIO: se calcul\u00f3 su huella de verificaci\u00f3n actual.";
    }

    return {
      parsed: parsed,
      hashCalculado: hashCalculado,
      coincide: coincide,
      titularCoincide: titularCoincide,
      yaUsado: yaUsado,
      estadoTexto: estadoTexto,
      codigoCorto: hashCalculado ? hashCalculado.slice(0, 12).toUpperCase() : "SIN-HASH"
    };
  }

  async function generarQrUnico(rol, titularId, paseId, detalle) {
    var rClean = String(rol || "ESTUDIANTE").trim().toUpperCase();
    var tClean = String(titularId || "").trim();
    var pClean = String(paseId || "").trim();
    var dClean = String(detalle || "").trim();
    var base = rClean + "|" + tClean + "|" + pClean + "|" + dClean;
    var h = await sha256Hex(base);
    return {
      qrPayload: base + "|" + h,
      hash: h,
      codigoCorto: h ? h.slice(0, 12).toUpperCase() : ""
    };
  }

  function detenerCamara() {
    if (scanTimer) { clearInterval(scanTimer); scanTimer = null; }
    if (streamActual) {
      try { streamActual.getTracks().forEach(function (t) { t.stop(); }); } catch (_e) {}
      streamActual = null;
    }
    var vid = document.getElementById("bds-qr88-video");
    if (vid) { vid.style.display = "none"; vid.srcObject = null; }
  }

  function montarModalQr() {
    if (document.getElementById("bds-v88-qr-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v88-qr-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir validador de QR unicos e intransferibles");
    btn.style.cssText =
      "position:fixed;left:12px;bottom:124px;z-index:2147483635;" +
      "background:#1e293b;color:#f8fafc;border:2px solid #fbbf24;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udcf1 QR \u00danico";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v88-qr-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      rol: "ESTUDIANTE",
      titularId: "1-1234-5678",
      paseId: "PASE-2026-001",
      detalle: "Beneficio / Acceso / Nota",
      titularCheck: "",
      qrInput: "",
      camMsg: "",
      resultadoHtml: ""
    };

    function pintarResultado(ver) {
      state.resultadoHtml =
        '<div style="background:#f8fafc;border:1.5px solid #94a3b8;border-radius:12px;padding:11px;font-size:12.5px;color:#0f172a">' +
        '<div><strong>Estado:</strong> ' + esc(ver.estadoTexto) + '</div>' +
        '<div style="margin-top:4px"><strong>Rol:</strong> ' + esc(ver.parsed.rol) + ' | <strong>Titular ID:</strong> ' + esc(ver.parsed.titularId || "-") + ' | <strong>Pase/ID:</strong> ' + esc(ver.parsed.paseId || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>Detalle:</strong> ' + esc(ver.parsed.detalle || "-") + '</div>' +
        '<div style="margin-top:4px"><strong>C\u00f3digo:</strong> ' + esc(ver.codigoCorto) + '</div>' +
        '<div style="margin-top:4px;word-break:break-all"><strong>Verificaci\u00f3n:</strong> ' + esc(ver.hashCalculado) + '</div>' +
        '</div>';
    }

    async function refrescarNuevoQr() {
      var firmado = await generarQrUnico(state.rol, state.titularId, state.paseId, state.detalle);
      state.qrInput = firmado.qrPayload;
      var ver = await verificarQrCompleto(state.qrInput, state.titularCheck, false);
      pintarResultado(ver);
      renderModal();
    }

    async function iniciarCamaraNativa() {
      state.camMsg = "";
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        state.camMsg = "C\u00e1mara no disponible en este navegador; use foto o pegue el c\u00f3digo.";
        renderModal();
        return;
      }
      try {
        detenerCamara();
        streamActual = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        renderModal();
        var vid = document.getElementById("bds-qr88-video");
        if (vid) {
          vid.style.display = "block";
          vid.srcObject = streamActual;
          await vid.play();
        }
        if ("BarcodeDetector" in window) {
          var det = new window.BarcodeDetector({ formats: ["qr_code"] });
          scanTimer = setInterval(async function () {
            if (!vid || vid.readyState < 2) return;
            try {
              var codes = await det.detect(vid);
              if (codes && codes.length > 0 && codes[0].rawValue) {
                state.qrInput = String(codes[0].rawValue);
                detenerCamara();
                var ver = await verificarQrCompleto(state.qrInput, state.titularCheck, false);
                pintarResultado(ver);
                renderModal();
              }
            } catch (_e) {}
          }, 450);
        } else {
          state.camMsg = "C\u00e1mara activa; si el navegador no lee QR en vivo, tome foto o pegue el texto.";
          renderModal();
        }
      } catch (_err) {
        state.camMsg = "Permiso de c\u00e1mara no concedido; puede usar foto o texto directo.";
        renderModal();
      }
    }

    function renderModal() {
      modal.innerHTML =
        '<div style="max-width:670px;margin:10px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #64748b;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">QR \u00danicos e Intransferibles + C\u00e1mara Nativa</strong>' +
        '<button id="bds-v88-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">1. Emitir QR \u00fanico por rol y titular:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px">' +
        '<select id="bds-qr88-rol" style="padding:7px 9px;border-radius:8px;border:1.5px solid #475569;font-weight:700">' +
        '<option value="ESTUDIANTE">ESTUDIANTE</option><option value="DOCENTE">DOCENTE</option><option value="ENCARGADO">ENCARGADO</option><option value="PERSONAL">PERSONAL</option><option value="BENEFICIO">BENEFICIO</option><option value="COMPRA">COMPRA</option><option value="FACTURA">FACTURA</option><option value="NOTA">NOTA</option><option value="MATRICULA">MATRICULA</option>' +
        '</select>' +
        '<input id="bds-qr88-titular" type="text" value="' + esc(state.titularId) + '" placeholder="Titular ID (c\u00e9dula/carn\u00e9)" style="padding:7px 9px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:120px"/>' +
        '<input id="bds-qr88-pase" type="text" value="' + esc(state.paseId) + '" placeholder="ID Pase / Folio" style="padding:7px 9px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:120px"/>' +
        '<input id="bds-qr88-det" type="text" value="' + esc(state.detalle) + '" placeholder="Detalle" style="padding:7px 9px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:120px"/>' +
        '<button id="bds-qr88-gen" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#1e40af;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Generar QR</button>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:800;color:#334155;margin-bottom:6px">2. Escanear con c\u00e1mara, foto o texto y validar titular:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:8px">' +
        '<button id="bds-qr88-cam" type="button" style="padding:7px 11px;border-radius:8px;border:none;background:#0f766e;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Abrir C\u00e1mara</button>' +
        '<label style="padding:7px 11px;border-radius:8px;background:#334155;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Foto/C\u00e1mara Archivo<input id="bds-qr88-file" type="file" accept="image/*" capture="environment" style="display:none"/></label>' +
        '<input id="bds-qr88-check-tit" type="text" value="' + esc(state.titularCheck) + '" placeholder="Confirmar Titular ID (opcional)" style="padding:7px 9px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:150px"/>' +
        '</div>' +
        '<video id="bds-qr88-video" playsinline muted style="display:none;width:100%;max-height:190px;border-radius:10px;background:#000;margin-bottom:8px"></video>' +
        (state.camMsg ? '<div style="font-size:12px;color:#b45309;margin-bottom:8px">' + esc(state.camMsg) + '</div>' : '') +
        '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px">' +
        '<input id="bds-qr88-raw" type="text" value="' + esc(state.qrInput) + '" placeholder="Contenido QR..." style="padding:8px 9px;border-radius:8px;border:1.5px solid #475569;flex:1;min-width:180px"/>' +
        '<button id="bds-qr88-val" type="button" style="padding:8px 11px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Validar</button>' +
        '<button id="bds-qr88-canj" type="button" style="padding:8px 11px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Validar y Canjear</button>' +
        '</div>' +
        (state.resultadoHtml || "") +
        '</div></div>';

      document.getElementById("bds-v88-close").onclick = function () { detenerCamara(); modal.style.display = "none"; };
      var rSel = document.getElementById("bds-qr88-rol");
      if (rSel) rSel.value = state.rol;

      document.getElementById("bds-qr88-gen").onclick = function () {
        state.rol = rSel ? rSel.value : state.rol;
        state.titularId = document.getElementById("bds-qr88-titular").value;
        state.paseId = document.getElementById("bds-qr88-pase").value;
        state.detalle = document.getElementById("bds-qr88-det").value;
        refrescarNuevoQr();
      };

      document.getElementById("bds-qr88-cam").onclick = function () { iniciarCamaraNativa(); };

      var fInp = document.getElementById("bds-qr88-file");
      if (fInp) {
        fInp.onchange = async function () {
          var file = fInp.files && fInp.files[0];
          if (!file) return;
          if ("BarcodeDetector" in window && typeof createImageBitmap === "function") {
            try {
              var bmp = await createImageBitmap(file);
              var det = new window.BarcodeDetector({ formats: ["qr_code"] });
              var codes = await det.detect(bmp);
              if (codes && codes.length > 0 && codes[0].rawValue) {
                state.qrInput = String(codes[0].rawValue);
                var ver = await verificarQrCompleto(state.qrInput, state.titularCheck, false);
                pintarResultado(ver);
                renderModal();
                return;
              }
            } catch (_e) {}
          }
          state.camMsg = "Imagen cargada; si no ley\u00f3 QR autom\u00e1tico, pegue el texto del QR o pruebe en Chrome/Android actualizado.";
          renderModal();
        };
      }

      document.getElementById("bds-qr88-val").onclick = function () {
        state.qrInput = document.getElementById("bds-qr88-raw").value;
        state.titularCheck = document.getElementById("bds-qr88-check-tit").value;
        verificarQrCompleto(state.qrInput, state.titularCheck, false).then(function (ver) {
          pintarResultado(ver);
          renderModal();
        });
      };

      document.getElementById("bds-qr88-canj").onclick = function () {
        state.qrInput = document.getElementById("bds-qr88-raw").value;
        state.titularCheck = document.getElementById("bds-qr88-check-tit").value;
        verificarQrCompleto(state.qrInput, state.titularCheck, true).then(function (ver) {
          pintarResultado(ver);
          renderModal();
        });
      };
    }

    btn.onclick = function () {
      modal.style.display = "block";
      refrescarNuevoQr();
    };

    window.BDSQrVerifV88 = {
      open: function () { modal.style.display = "block"; refrescarNuevoQr(); },
      close: function () { detenerCamara(); modal.style.display = "none"; },
      signAndVerify: async function (rol, titularId, paseId, detalle) {
        var g = await generarQrUnico(rol, titularId, paseId, detalle);
        var v = await verificarQrCompleto(g.qrPayload, titularId, false);
        return { valid: v.coincide && v.titularCoincide, sha256Len: v.hashCalculado.length, rol: v.parsed.rol };
      }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarModalQr);
  else montarModalQr();
})();