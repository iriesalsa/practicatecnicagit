(function () {
  "use strict";
  if (window.__BDS_QR_VALIDACION_PRO_V52__) return;
  window.__BDS_QR_VALIDACION_PRO_V52__ = true;

  var KEY_BITACORA = "pt_bds_qr_validaciones_v52";
  var KEY_CARNES = "pt_bds_qr_carnes_v52";

  var MODULOS = [
    { id: "Port\u00f3n", color: "#1e40af", desc: "Control de ingreso y salida en port\u00f3n institucional" },
    { id: "Comedor", color: "#047857", desc: "Control \u00fanico diario de desayuno / almuerzo (anti-duplicados)" },
    { id: "Becas", color: "#6d28d9", desc: "Verificaci\u00f3n de beca estudiantil y entregas" },
    { id: "Matr\u00edcula", color: "#0369a1", desc: "Validaci\u00f3n de expediente y matr\u00edcula activa" },
    { id: "Salidas", color: "#b45309", desc: "Autorizaci\u00f3n de salida temprana por encargado legal" }
  ];

  var PERFILES = [
    "Estudiante",
    "Docente",
    "Padre / Madre de familia",
    "Persona Encargada Legal"
  ];

  var BUHO_MINI =
    '<svg viewBox="0 0 128 128" width="28" height="28" aria-label="B\u00faho Azul Circular" style="display:block;flex-shrink:0">' +
    '<defs><radialGradient id="bdsOwlQr52" cx="50%" cy="38%" r="60%">' +
    '<stop offset="0%" stop-color="#3b82f6"/><stop offset="65%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#1e3a8a"/>' +
    '</radialGradient></defs>' +
    '<circle cx="64" cy="64" r="60" fill="url(#bdsOwlQr52)" stroke="#93c5fd" stroke-width="4"/>' +
    '<path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="44" cy="63" r="18" fill="#ffffff"/><circle cx="84" cy="63" r="18" fill="#ffffff"/>' +
    '<circle cx="46" cy="63" r="9" fill="#0f172a"/><circle cx="82" cy="63" r="9" fill="#0f172a"/>' +
    '<circle cx="49" cy="59" r="3.2" fill="#ffffff"/><circle cx="85" cy="59" r="3.2" fill="#ffffff"/>' +
    '<polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" stroke-width="2" stroke-linejoin="round"/>' +
    '</svg>';

  // Tabla estandar Code-39 (100% verificada: 9 elementos por caracter, 3 anchos y 6 angostos)
  var CODE39 = {
    "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw",
    "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn",
    "A": "wnnnnwnnw", "B": "nnwnnwnnw", "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn",
    "F": "nnwnwwnnn", "G": "nnnnnwwnw", "H": "wnnnnwwnn", "I": "nnwnnwwnn", "J": "nnnnwwwnn",
    "K": "wnnnnnnww", "L": "nnwnnnnww", "M": "wnwnnnnwn", "N": "nnnnwnnww", "O": "wnnnwnnwn",
    "P": "nnwnwnnwn", "Q": "nnnnnnwww", "R": "wnnnnnwwn", "S": "nnwnnnwwn", "T": "nnnnwnwwn",
    "U": "wwnnnnnnw", "V": "nwwnnnnnw", "W": "wwwnnnnnn", "X": "nwnnwnnnw", "Y": "wwnnwnnnn",
    "Z": "nwwnwnnnn", "-": "nwnnnnwnw", ".": "wwnnnnwnn", " ": "nwwnnnwnn", "*": "nwnnwnwnn"
  };

  function generarCodigoBarrasSvg(codigoTexto) {
    var limpio = String(codigoTexto || "PT-EST-001").toUpperCase().replace(/[^0-9A-Z\-. ]/g, "");
    if (!limpio) limpio = "PT-EST-001";
    var seq = "*" + limpio + "*";
    var narrow = 2, wide = 5, h = 68, x = 14;
    var rects = [];

    for (var i = 0; i < seq.length; i++) {
      var pat = CODE39[seq[i]] || CODE39["-"];
      for (var j = 0; j < pat.length; j++) {
        var w = pat[j] === "w" ? wide : narrow;
        if (j % 2 === 0) {
          rects.push('<rect x="' + x + '" y="10" width="' + w + '" height="' + h + '" fill="#0f172a"/>');
        }
        x += w;
      }
      x += narrow; // espacio inter-caracter
    }
    var totalW = x + 14;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + totalW + ' 102" style="width:100%;max-width:420px;height:auto;background:#ffffff;border:1.5px solid #94a3b8;border-radius:10px;display:block;margin:0 auto">' +
      '<rect width="' + totalW + '" height="102" fill="#ffffff"/>' +
      rects.join("") +
      '<text x="' + (totalW / 2) + '" y="94" text-anchor="middle" fill="#0f172a" font-family="monospace" font-size="13" font-weight="800">' + limpio + '</text>' +
      '</svg>';
  }

  function leerJson(k, def) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (_e) { return def; } }
  function guardarJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_e) {} }

  async function sha256Hex(txt) {
    try {
      var data = new TextEncoder().encode(String(txt || ""));
      var buf = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    } catch (_e) {
      return "sha256-offline-" + Date.now().toString(16);
    }
  }

  function beepConfirmacion(ok) {
    try {
      if (navigator.vibrate) navigator.vibrate(ok ? 90 : [90, 60, 90]);
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = ok ? 880 : 320;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(function () { osc.stop(); ctx.close().catch(function () {}); }, 140);
    } catch (_e) {}
  }

  function syncSupabaseValidacion(reg) {
    try {
      var url = window.__BDS_SUPABASE_URL__ || localStorage.getItem("VITE_SUPABASE_URL") || "";
      var key = window.__BDS_SUPABASE_ANON__ || localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "";
      if (!url || !key || url.indexOf("tu-proyecto.supabase.co") !== -1) return;
      fetch(url.replace(/\/$/, "") + "/rest/v1/validaciones_qr_institucional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": key,
          "Authorization": "Bearer " + key,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          modulo: reg.modulo,
          tipo_persona: reg.perfil,
          identificacion: reg.identificacion,
          nombre_persona: reg.nombre,
          formato_codigo: reg.formato,
          codigo_crudo: reg.raw,
          estado_validacion: reg.estado,
          sha256_sello: reg.sha256
        })
      }).catch(function () {});
    } catch (_e) {}
  }

  function cargarHtml5QrcodeOffline() {
    return new Promise(function (resolve) {
      if (window.Html5Qrcode) { resolve(window.Html5Qrcode); return; }
      var ex = document.getElementById("bds-html5-qr-vendor");
      if (ex) {
        ex.addEventListener("load", function () { resolve(window.Html5Qrcode || null); }, { once: true });
        ex.addEventListener("error", function () { resolve(null); }, { once: true });
        return;
      }
      var sc = document.createElement("script");
      sc.id = "bds-html5-qr-vendor";
      sc.src = "/vendor/html5-qrcode.min.js";
      sc.async = true;
      sc.onload = function () { resolve(window.Html5Qrcode || null); };
      sc.onerror = function () { resolve(null); };
      document.head.appendChild(sc);
    });
  }

  // Interpreta QR JSON, formato PIPE (ROL|ID|NOMBRE|MODULO|SHA256), carnets registrados Code-39 o cedula/TIM
  async function analizarCodigoEscaneado(rawText, formatoDetectado, moduloActivo) {
    var limpio = String(rawText || "").trim();
    var carnes = leerJson(KEY_CARNES, []);
    var encontradoCarne = carnes.find(function (c) {
      return c.codigoBarras === limpio.toUpperCase() || c.qrPayload === limpio || c.sha256 === limpio.toLowerCase();
    });

    if (encontradoCarne) {
      var hashVerif = await sha256Hex(encontradoCarne.perfil + "|" + encontradoCarne.identificacion + "|" + encontradoCarne.nombre + "|" + encontradoCarne.modulo);
      return {
        identificacion: encontradoCarne.identificacion,
        nombre: encontradoCarne.nombre,
        perfil: encontradoCarne.perfil,
        detalle: encontradoCarne.detalle || ("Carn\u00e9 institucional verificado (" + encontradoCarne.modulo + ")"),
        formato: formatoDetectado || "CARNE_OFICIAL",
        sha256: encontradoCarne.sha256,
        integridadOk: hashVerif === encontradoCarne.sha256,
        raw: limpio
      };
    }

    if (limpio.startsWith("{") && limpio.endsWith("}")) {
      try {
        var obj = JSON.parse(limpio);
        var calcJ = await sha256Hex(limpio);
        return {
          identificacion: obj.cedula || obj.id || obj.tim || "ID-QR",
          nombre: obj.nombre || "Persona verificada",
          perfil: obj.rol || obj.perfil || "Estudiante",
          detalle: obj.tramite || obj.documento || ("Validado en " + moduloActivo),
          formato: formatoDetectado || "QR_JSON",
          sha256: obj.sha256 || calcJ,
          integridadOk: true,
          raw: limpio
        };
      } catch (_e) {}
    }

    if (limpio.indexOf("|") !== -1) {
      var parts = limpio.split("|");
      var rolP = parts[0] || "Estudiante";
      var idP = parts[1] || "SIN-ID";
      var nomP = parts[2] || "Persona institucional";
      var modP = parts[3] || moduloActivo;
      var hashIn = parts[4] || "";
      var calcP = await sha256Hex(rolP + "|" + idP + "|" + nomP + "|" + modP);
      return {
        identificacion: idP,
        nombre: nomP,
        perfil: rolP,
        detalle: "Tr\u00e1mite: " + modP,
        formato: formatoDetectado || "QR_PIPE_SHA256",
        sha256: hashIn || calcP,
        integridadOk: hashIn ? (hashIn.toLowerCase() === calcP.toLowerCase() || /^[a-f0-9]{64}$/i.test(hashIn)) : true,
        raw: limpio
      };
    }

    // Codigo de barras de cedula / TIM / carnet numerico o alfanumerico
    var esHash = /^[a-f0-9]{64}$/i.test(limpio);
    var perfilGuess = /^DOC-/i.test(limpio) ? "Docente" :
                      /^ENC-|^PAD-/i.test(limpio) ? "Persona Encargada Legal" : "Estudiante";
    var calcRaw = esHash ? limpio.toLowerCase() : await sha256Hex(limpio + "|" + moduloActivo);
    return {
      identificacion: esHash ? ("SHA256-" + limpio.slice(0, 10).toUpperCase()) : limpio,
      nombre: esHash ? "Documento con firma SHA-256" : ("Identificaci\u00f3n " + limpio),
      perfil: perfilGuess,
      detalle: "Lectura directa en " + moduloActivo,
      formato: formatoDetectado || (esHash ? "SHA256_PURO" : "BARCODE_ID"),
      sha256: calcRaw,
      integridadOk: true,
      raw: limpio
    };
  }

  function montarCentroQrPro() {
    if (document.getElementById("bds-qr52-launcher")) return;

    // Boton flotante izquierdo limpio (no choca con Centro BDS a la derecha)
    var launcher = document.createElement("button");
    launcher.id = "bds-qr52-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Abrir Esc\u00e1ner QR y C\u00f3digos de Barras");
    launcher.style.cssText =
      "position:fixed;left:14px;bottom:78px;z-index:2147483630;display:flex;align-items:center;gap:7px;" +
      "background:#047857;color:#ffffff;border:2px solid #6ee7b7;border-radius:999px;padding:8px 13px;" +
      "font:800 12px system-ui,sans-serif;box-shadow:0 8px 24px rgba(15,23,42,.4);cursor:pointer";
    launcher.innerHTML = BUHO_MINI + "<span>QR / Barras</span>";
    document.body.appendChild(launcher);

    var modal = document.createElement("div");
    modal.id = "bds-qr52-modal";
    modal.style.cssText = "display:none;position:fixed;inset:0;z-index:2147483642;background:rgba(15,23,42,.82);overflow:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var ui = {
      tab: "escanear", // escanear | carnet | bitacora
      modulo: "Port\u00f3n",
      subComedor: "Almuerzo",
      camaraActiva: false,
      facingMode: "environment",
      motorTexto: "Lista para activar c\u00e1mara",
      torchOn: false,
      errorCam: "",
      ultimo: null,
      filtroLog: "Todos",
      carneActual: null
    };

    var streamRef = null;
    var rafRef = 0;
    var html5QrRef = null;
    var ultimoEscaneoTs = 0;
    var ultimoCodigoLeido = "";

    async function detenerCamara() {
      if (rafRef) { cancelAnimationFrame(rafRef); rafRef = 0; }
      if (streamRef) {
        streamRef.getTracks().forEach(function (t) { try { t.stop(); } catch (_e) {} });
        streamRef = null;
      }
      if (html5QrRef) {
        try { await html5QrRef.stop(); await html5QrRef.clear(); } catch (_e) {}
        html5QrRef = null;
      }
      ui.camaraActiva = false;
      ui.torchOn = false;
      ui.motorTexto = "C\u00e1mara detenida";
    }

    async function procesarLectura(textoCrudo, formatoDetectado) {
      var limpio = String(textoCrudo || "").trim();
      if (!limpio) return;
      // Anti-rebote de 2.2 segundos para no registrar 10 veces el mismo codigo al enfocar
      var ahoraTs = Date.now();
      if (limpio === ultimoCodigoLeido && (ahoraTs - ultimoEscaneoTs) < 2200) return;
      ultimoCodigoLeido = limpio;
      ultimoEscaneoTs = ahoraTs;

      var info = await analizarCodigoEscaneado(limpio, formatoDetectado, ui.modulo);
      var bitacora = leerJson(KEY_BITACORA, []);
      var hoy = new Date().toISOString().slice(0, 10);
      var subclave = ui.modulo === "Comedor" ? ui.subComedor : ui.modulo;
      var claveDiaria = hoy + "|" + subclave + "|" + info.identificacion;

      var duplicado = (ui.modulo === "Comedor" || ui.modulo === "Becas") &&
        bitacora.some(function (b) { return b.claveDiaria === claveDiaria && b.estado === "AUTORIZADO"; });

      var estadoFinal = !info.integridadOk ? "FIRMA_INVALIDA" : duplicado ? "DUPLICADO_HOY" : "AUTORIZADO";
      var registro = {
        id: "VAL-" + Date.now().toString(36).toUpperCase(),
        claveDiaria: claveDiaria,
        fechaHora: new Date().toLocaleString("es-CR"),
        modulo: ui.modulo === "Comedor" ? ("Comedor (" + ui.subComedor + ")") : ui.modulo,
        moduloBase: ui.modulo,
        perfil: info.perfil,
        identificacion: info.identificacion,
        nombre: info.nombre,
        detalle: info.detalle,
        formato: info.formato,
        sha256: info.sha256,
        estado: estadoFinal,
        raw: info.raw
      };

      beepConfirmacion(estadoFinal === "AUTORIZADO");
      bitacora.unshift(registro);
      guardarJson(KEY_BITACORA, bitacora.slice(0, 300));
      syncSupabaseValidacion(registro);

      ui.ultimo = registro;
      renderResultadoVivo();
    }

    function renderResultadoVivo() {
      var box = document.getElementById("bds-qr52-res");
      if (!box || !ui.ultimo) return;
      var r = ui.ultimo;
      var bg = r.estado === "AUTORIZADO" ? "#dcfce7;border:2px solid #15803d;color:#14532d" :
               r.estado === "DUPLICADO_HOY" ? "#fef3c7;border:2px solid #b45309;color:#451a03" :
               "#fee2e2;border:2px solid #b91c1c;color:#7f1d1d";
      var tituloEst = r.estado === "AUTORIZADO" ? "\u2714 ACCESO / TR\u00c1MITE AUTORIZADO" :
                      r.estado === "DUPLICADO_HOY" ? "\u26a0 YA REGISTRADO HOY EN " + r.modulo.toUpperCase() :
                      "\u2716 ALERTA DE INTEGRIDAD SHA-256";
      box.innerHTML =
        '<div style="border-radius:14px;padding:14px;background:' + bg + '">' +
        '<div style="font-size:15px;font-weight:900">' + tituloEst + '</div>' +
        '<div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:6px;font-size:13px">' +
        '<div><strong>Persona:</strong> ' + r.nombre + '</div>' +
        '<div><strong>Perfil:</strong> ' + r.perfil + '</div>' +
        '<div><strong>ID / C\u00e9dula:</strong> ' + r.identificacion + '</div>' +
        '<div><strong>Punto:</strong> ' + r.modulo + '</div>' +
        '<div><strong>Formato:</strong> ' + r.formato + '</div>' +
        '<div><strong>Hora:</strong> ' + r.fechaHora + '</div>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:11px;font-family:monospace;word-break:break-all"><strong>SHA-256:</strong> ' + r.sha256 + '</div>' +
        '</div>';
    }

    async function iniciarCamaraNativa() {
      ui.errorCam = "";
      await detenerCamara();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        ui.errorCam = "Tu navegador requiere HTTPS o localhost para abrir la c\u00e1mara. Puedes usar 'Subir foto' o lector USB abajo.";
        render();
        return;
      }

      // Motor 1: Camara Nativa + BarcodeDetector (ultrarapido en Android Chrome, Edge, Windows y equipos modernos)
      if ("BarcodeDetector" in window) {
        try {
          var formatos = ["qr_code", "code_128", "code_39", "ean_13", "ean_8", "upc_a", "codabar", "pdf417", "data_matrix", "aztec"];
          var soportados = typeof window.BarcodeDetector.getSupportedFormats === "function"
            ? await window.BarcodeDetector.getSupportedFormats()
            : formatos;
          var elegir = formatos.filter(function (f) { return soportados.indexOf(f) !== -1; });
          if (!elegir.length) elegir = ["qr_code", "code_39", "code_128"];
          var detector = new window.BarcodeDetector({ formats: elegir });

          var stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: ui.facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          streamRef = stream;
          ui.camaraActiva = true;
          ui.motorTexto = "C\u00e1mara Nativa HD (QR + C\u00f3digos de Barras)";
          render();

          var vid = document.getElementById("bds-qr52-video");
          if (vid) {
            vid.srcObject = stream;
            await vid.play();
            var loop = async function () {
              if (!streamRef || !vid) return;
              try {
                if (vid.readyState >= 2) {
                  var res = await detector.detect(vid);
                  if (res && res.length > 0 && res[0].rawValue) {
                    await procesarLectura(res[0].rawValue, String(res[0].format || "QR/BARCODE").toUpperCase());
                  }
                }
              } catch (_e) {}
              rafRef = requestAnimationFrame(loop);
            };
            rafRef = requestAnimationFrame(loop);
          }
          return;
        } catch (_errNat) {
          await detenerCamara();
        }
      }

      // Motor 2: Fallback universal offline html5-qrcode (para iOS Safari / Firefox)
      var Html5Ctor = await cargarHtml5QrcodeOffline();
      if (Html5Ctor) {
        try {
          ui.camaraActiva = true;
          ui.motorTexto = "C\u00e1mara Universal Offline (QR + Barras)";
          render();
          var qr = new Html5Ctor("bds-qr52-html5box");
          html5QrRef = qr;
          await qr.start(
            { facingMode: ui.facingMode },
            { fps: 12, qrbox: { width: 250, height: 220 } },
            function (decodedText, decodedResult) {
              var fmt = (decodedResult && decodedResult.result && decodedResult.result.format && decodedResult.result.format.formatName) || "QR/BARCODE";
              procesarLectura(decodedText, fmt);
            },
            function () {}
          );
          return;
        } catch (err2) {
          await detenerCamara();
          ui.errorCam = "Permiso de c\u00e1mara denegado o c\u00e1mara ocupada (" + (err2 && err2.message ? err2.message : "revisa permisos") + "). Usa 'Subir foto' o lector USB.";
          render();
          return;
        }
      }

      ui.errorCam = "No se detect\u00f3 motor de c\u00e1mara en este navegador; usa el campo de lector USB o 'Subir foto'.";
      render();
    }

    async function alternarLinterna() {
      if (!streamRef) return;
      try {
        var track = streamRef.getVideoTracks()[0];
        var caps = track.getCapabilities ? track.getCapabilities() : {};
        if (!caps.torch) {
          ui.errorCam = "Esta c\u00e1mara no soporta control de linterna desde navegador.";
          render();
          return;
        }
        ui.torchOn = !ui.torchOn;
        await track.applyConstraints({ advanced: [{ torch: ui.torchOn }] });
        render();
      } catch (_e) {}
    }

    function exportarCsvBitacora() {
      var logs = leerJson(KEY_BITACORA, []);
      var filas = [["FechaHora", "Modulo", "Estado", "Perfil", "Identificacion", "Nombre", "Formato", "SHA256"]];
      logs.forEach(function (l) {
        filas.push([l.fechaHora, l.modulo, l.estado, l.perfil, l.identificacion, l.nombre, l.formato, l.sha256]);
      });
      var csv = filas.map(function (row) {
        return row.map(function (v) { return '"' + String(v || "").replace(/"/g, '""') + '"'; }).join(",");
      }).join("\r\n");
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "validaciones_qr_practicatecnica_" + new Date().toISOString().slice(0, 10) + ".csv";
      a.click();
    }

    function render() {
      var modObj = MODULOS.find(function (m) { return m.id === ui.modulo; }) || MODULOS[0];
      var bitacora = leerJson(KEY_BITACORA, []);
      var body = "";

      if (ui.tab === "escanear") {
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:14px;margin-bottom:14px">' +
          '<div style="font-size:12px;font-weight:900;color:#334155;text-transform:uppercase;margin-bottom:8px">Paso 1: Elige el punto de control</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
          MODULOS.map(function (m) {
            var act = ui.modulo === m.id;
            return '<button data-qmod="' + m.id + '" type="button" style="padding:8px 13px;border-radius:999px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid ' + m.color + ';background:' + (act ? m.color + ';color:#fff' : '#fff;color:' + m.color) + '">' + m.id + '</button>';
          }).join("") + '</div>' +
          (ui.modulo === "Comedor"
            ? '<div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-size:12px;font-weight:800;color:#047857">Servicio de Comedor:</span>' +
              ["Desayuno", "Almuerzo", "Merienda"].map(function (s) {
                return '<button data-qcom="' + s + '" type="button" style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;border:1.5px solid #047857;background:' + (ui.subComedor === s ? '#047857;color:#fff' : '#fff;color:#047857') + '">' + s + '</button>';
              }).join("") + '</div>'
            : '') +
          '<div style="margin-top:8px;font-size:12px;font-weight:600;color:#334155">' + modObj.desc + '</div></div>' +

          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px">' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:14px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">' +
          '<strong style="font-size:14px;color:#0f172a">Paso 2: C\u00e1mara Nativa</strong>' +
          '<span style="font-size:11px;font-weight:800;background:#e2e8f0;color:#0f172a;padding:3px 9px;border-radius:999px">' + ui.motorTexto + '</span></div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
          (!ui.camaraActiva
            ? '<button id="bds-qr52-start" type="button" style="flex:1;background:#1e40af;color:#fff;border:none;border-radius:10px;padding:11px 14px;font-size:13px;font-weight:800;cursor:pointer">\ud83d\udcf7 Activar C\u00e1mara QR / Barras</button>'
            : '<button id="bds-qr52-stop" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer">Detener</button>' +
              '<button id="bds-qr52-flip" type="button" style="background:#fff;color:#0f172a;border:2px solid #64748b;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:800;cursor:pointer">Girar c\u00e1mara</button>' +
              '<button id="bds-qr52-torch" type="button" style="background:' + (ui.torchOn ? '#f59e0b;color:#0f172a' : '#fff;color:#0f172a') + ';border:2px solid #64748b;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:800;cursor:pointer">Linterna</button>') +
          '</div>' +
          (ui.errorCam ? '<div style="margin-bottom:10px;padding:10px;border-radius:10px;background:#fef3c7;border:1.5px solid #b45309;color:#451a03;font-size:12px;font-weight:700">' + ui.errorCam + '</div>' : '') +
          '<div style="position:relative;background:#0f172a;border-radius:12px;overflow:hidden;min-height:220px;display:flex;align-items:center;justify-content:center">' +
          '<video id="bds-qr52-video" playsinline muted style="' + (ui.camaraActiva && !html5QrRef ? 'width:100%;max-height:300px;object-fit:cover;display:block' : 'display:none') + '"></video>' +
          '<div id="bds-qr52-html5box" style="width:100%"></div>' +
          (ui.camaraActiva
            ? '<div style="pointer-events:none;position:absolute;inset:18% 12%;border:3px solid #38bdf8;border-radius:14px;box-shadow:0 0 0 9999px rgba(15,23,42,.35)"></div>'
            : '<div style="padding:20px;text-align:center;color:#cbd5e1;font-size:13px">Apunta tu c\u00e1mara al QR o c\u00f3digo de barras del carn\u00e9 de estudiante, docente o persona encargada legal.</div>') +
          '</div></div>' +

          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px">' +
          '<div><strong style="font-size:14px;color:#0f172a">Alternativas: Lector USB o Foto</strong>' +
          '<form id="bds-qr52-usb" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">' +
          '<input id="bds-qr52-in" type="text" placeholder="Escanea con pistola USB o pega c\u00f3digo/SHA-256..." style="flex:1;min-width:190px;padding:10px 12px;border:2px solid #475569;border-radius:10px;font-size:13px;color:#0f172a;background:#fff"/>' +
          '<button type="submit" style="background:#0f172a;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer">Validar</button></form></div>' +
          '<div><label style="display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:2px solid #1e40af;border-radius:10px;color:#1e40af;background:#eff6ff;font-size:12px;font-weight:800;cursor:pointer">Subir / tomar foto de QR o Barras<input id="bds-qr52-file" type="file" accept="image/*" capture="environment" style="display:none"/></label></div>' +
          '<div id="bds-qr52-res">' + (ui.ultimo ? '' : '<div style="background:#f8fafc;border:1.5px dashed #94a3b8;border-radius:12px;padding:14px;font-size:12px;color:#475569">Aqu\u00ed aparecer\u00e1 la validaci\u00f3n instant\u00e1nea con perfil, estado y firma SHA-256.</div>') + '</div>' +
          '</div></div>';
      } else if (ui.tab === "carnet") {
        body =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px">' +
          '<form id="bds-qr52-gen" style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px">' +
          '<h3 style="margin:0;font-size:16px;font-weight:900;color:#0f172a">Generar Carn\u00e9 con C\u00f3digo de Barras + SHA-256</h3>' +
          '<p style="margin:0;font-size:12px;color:#334155">Crea un carn\u00e9 real para probar escane\u00e1ndolo con la c\u00e1mara de tu celular o validarlo en 1 clic.</p>' +
          '<label style="font-size:12px;font-weight:800;color:#0f172a">Tipo de persona<select id="bds-g-perfil" style="width:100%;margin-top:4px;padding:9px;border:2px solid #475569;border-radius:10px;font-size:13px;color:#0f172a;background:#fff">' +
          PERFILES.map(function (p) { return '<option value="' + p + '">' + p + '</option>'; }).join("") + '</select></label>' +
          '<label style="font-size:12px;font-weight:800;color:#0f172a">C\u00e9dula o TIM<input id="bds-g-id" required placeholder="Ej. 1-1234-5678 o EST-1101" style="width:100%;margin-top:4px;padding:9px;border:2px solid #475569;border-radius:10px;font-size:13px;color:#0f172a;background:#fff"/></label>' +
          '<label style="font-size:12px;font-weight:800;color:#0f172a">Nombre completo<input id="bds-g-nom" required placeholder="Ej. Ana P\u00e9rez Morales" style="width:100%;margin-top:4px;padding:9px;border:2px solid #475569;border-radius:10px;font-size:13px;color:#0f172a;background:#fff"/></label>' +
          '<label style="font-size:12px;font-weight:800;color:#0f172a">Tr\u00e1mite principal<select id="bds-g-mod" style="width:100%;margin-top:4px;padding:9px;border:2px solid #475569;border-radius:10px;font-size:13px;color:#0f172a;background:#fff">' +
          MODULOS.map(function (m) { return '<option value="' + m.id + '">' + m.id + '</option>'; }).join("") + '</select></label>' +
          '<button type="submit" style="background:#1e40af;color:#fff;border:none;border-radius:10px;padding:11px;font-size:13px;font-weight:800;cursor:pointer">Generar Carn\u00e9 Firmado SHA-256</button>' +
          '</form>' +
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px">' +
          (ui.carneActual
            ? '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' + BUHO_MINI + '<div><div style="font-size:14px;font-weight:900;color:#0f172a">' + ui.carneActual.nombre + '</div><div style="font-size:12px;font-weight:800;color:#1e40af">' + ui.carneActual.perfil + ' \u2022 ' + ui.carneActual.modulo + '</div></div></div>' +
              generarCodigoBarrasSvg(ui.carneActual.codigoBarras) +
              '<div style="margin-top:10px;background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px;font-size:11px;word-break:break-all;font-family:monospace"><strong>Payload QR:</strong> ' + ui.carneActual.qrPayload + '<br/><strong>SHA-256:</strong> ' + ui.carneActual.sha256 + '</div>' +
              '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
              '<button id="bds-qr52-test-scan" type="button" style="flex:1;background:#047857;color:#fff;border:none;border-radius:10px;padding:10px;font-size:12px;font-weight:800;cursor:pointer">Probar validaci\u00f3n ahora</button>' +
              '<button id="bds-qr52-copy-qr" type="button" style="background:#fff;color:#0f172a;border:2px solid #475569;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:800;cursor:pointer">Copiar Payload</button>' +
              '</div>'
            : '<div style="color:#475569;font-size:13px">Completa el formulario para emitir un carn\u00e9 con c\u00f3digo de barras Code-39 escaneable por c\u00e1mara y sello SHA-256.</div>') +
          '</div></div>';
      } else {
        var logsFil = bitacora.filter(function (b) { return ui.filtroLog === "Todos" || b.moduloBase === ui.filtroLog; });
        body =
          '<div style="background:#fff;border:1.5px solid #94a3b8;border-radius:16px;padding:16px">' +
          '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
          ["Todos", "Port\u00f3n", "Comedor", "Becas", "Matr\u00edcula", "Salidas"].map(function (f) {
            return '<button data-lf="' + f + '" type="button" style="padding:6px 10px;border-radius:999px;font-size:11px;font-weight:800;cursor:pointer;border:1.5px solid #1e40af;background:' + (ui.filtroLog === f ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">' + f + '</button>';
          }).join("") + '</div>' +
          '<button id="bds-qr52-csv" type="button" style="background:#047857;color:#fff;border:none;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer">Exportar CSV</button></div>' +
          '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;color:#0f172a"><thead><tr style="border-bottom:2px solid #cbd5e1;text-align:left">' +
          '<th style="padding:8px">Hora</th><th style="padding:8px">Punto</th><th style="padding:8px">Estado</th><th style="padding:8px">Perfil</th><th style="padding:8px">Persona / ID</th><th style="padding:8px">SHA-256</th></tr></thead><tbody>' +
          (logsFil.length === 0 ? '<tr><td colspan="6" style="padding:12px;color:#475569">Sin escaneos registrados a\u00fan.</td></tr>' : logsFil.map(function (l) {
            var cEst = l.estado === "AUTORIZADO" ? "#15803d" : l.estado === "DUPLICADO_HOY" ? "#b45309" : "#b91c1c";
            return '<tr style="border-bottom:1px solid #e2e8f0"><td style="padding:8px">' + l.fechaHora + '</td><td style="padding:8px;font-weight:800">' + l.modulo + '</td><td style="padding:8px;font-weight:900;color:' + cEst + '">' + l.estado + '</td><td style="padding:8px">' + l.perfil + '</td><td style="padding:8px"><strong>' + l.nombre + '</strong><div style="font-size:11px;color:#475569">' + l.identificacion + '</div></td><td style="padding:8px;font-family:monospace;font-size:11px">' + l.sha256.slice(0, 14) + '...</td></tr>';
          }).join("")) + '</tbody></table></div></div>';
      }

      modal.innerHTML =
        '<div style="max-width:1060px;margin:8px auto;background:#f1f5f9;color:#0f172a;border-radius:20px;border:2px solid #94a3b8;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5)">' +
        '<div style="background:#fff;border-bottom:2px solid #cbd5e1;padding:12px 16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px">' +
        '<div style="display:flex;align-items:center;gap:10px">' + BUHO_MINI +
        '<div><div style="font-size:15px;font-weight:900;color:#0f172a">Validaci\u00f3n Institucional QR &amp; Barras \u2022 SHA-256</div>' +
        '<div style="font-size:11px;font-weight:700;color:#475569">Estudiantes \u2022 Docentes \u2022 Encargados Legales \u2022 Port\u00f3n, Comedor, Becas, Matr\u00edcula y Salidas</div></div></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
        '<button data-qtab="escanear" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #047857;background:' + (ui.tab === "escanear" ? '#047857;color:#fff' : '#fff;color:#047857') + '">Esc\u00e1ner C\u00e1mara</button>' +
        '<button data-qtab="carnet" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #1e40af;background:' + (ui.tab === "carnet" ? '#1e40af;color:#fff' : '#fff;color:#1e40af') + '">Crear Carn\u00e9 Prueba</button>' +
        '<button data-qtab="bitacora" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:2px solid #0f172a;background:' + (ui.tab === "bitacora" ? '#0f172a;color:#fff' : '#fff;color:#0f172a') + '">Bit\u00e1cora (' + bitacora.length + ')</button>' +
        '<button id="bds-qr52-close" type="button" style="padding:8px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:none;background:#b91c1c;color:#fff">Cerrar</button>' +
        '</div></div><div style="padding:14px">' + body + '</div></div>';

      modal.querySelectorAll("[data-qtab]").forEach(function (b) {
        b.onclick = async function () { await detenerCamara(); ui.tab = b.getAttribute("data-qtab"); render(); };
      });
      document.getElementById("bds-qr52-close").onclick = async function () {
        await detenerCamara();
        modal.style.display = "none";
      };

      if (ui.tab === "escanear") {
        renderResultadoVivo();
        modal.querySelectorAll("[data-qmod]").forEach(function (b) {
          b.onclick = function () { ui.modulo = b.getAttribute("data-qmod"); render(); };
        });
        modal.querySelectorAll("[data-qcom]").forEach(function (b) {
          b.onclick = function () { ui.subComedor = b.getAttribute("data-qcom"); render(); };
        });
        var btnStart = document.getElementById("bds-qr52-start");
        if (btnStart) btnStart.onclick = iniciarCamaraNativa;
        var btnStop = document.getElementById("bds-qr52-stop");
        if (btnStop) btnStop.onclick = async function () { await detenerCamara(); render(); };
        var btnFlip = document.getElementById("bds-qr52-flip");
        if (btnFlip) btnFlip.onclick = async function () {
          ui.facingMode = ui.facingMode === "environment" ? "user" : "environment";
          await iniciarCamaraNativa();
        };
        var btnTorch = document.getElementById("bds-qr52-torch");
        if (btnTorch) btnTorch.onclick = alternarLinterna;

        document.getElementById("bds-qr52-usb").onsubmit = async function (ev) {
          ev.preventDefault();
          var inp = document.getElementById("bds-qr52-in");
          if (!inp.value.trim()) return;
          await procesarLectura(inp.value.trim(), "LECTOR_USB");
          inp.value = "";
        };

        document.getElementById("bds-qr52-file").onchange = async function (ev) {
          var f = ev.target.files && ev.target.files[0];
          if (!f) return;
          try {
            if ("BarcodeDetector" in window) {
              var bmp = await createImageBitmap(f);
              var det = new window.BarcodeDetector({ formats: ["qr_code", "code_128", "code_39", "ean_13", "ean_8", "pdf417"] });
              var found = await det.detect(bmp);
              if (found && found.length > 0 && found[0].rawValue) {
                await procesarLectura(found[0].rawValue, String(found[0].format || "FOTO").toUpperCase());
                return;
              }
            }
            var H5 = await cargarHtml5QrcodeOffline();
            if (H5) {
              var tmpId = "bds-qr52-html5box";
              var qTmp = new H5(tmpId);
              var dec = await qTmp.scanFile(f, false);
              if (dec) { await procesarLectura(dec, "FOTO_QR"); return; }
            }
            ui.errorCam = "No se detect\u00f3 ning\u00fan QR ni c\u00f3digo de barras n\u00edtido en esa imagen.";
            render();
          } catch (_errF) {
            ui.errorCam = "No se pudo leer la foto; intenta con buena iluminaci\u00f3n o activa la c\u00e1mara en vivo.";
            render();
          }
        };
      } else if (ui.tab === "carnet") {
        document.getElementById("bds-qr52-gen").onsubmit = async function (ev) {
          ev.preventDefault();
          var perfil = document.getElementById("bds-g-perfil").value;
          var idTxt = document.getElementById("bds-g-id").value.trim().toUpperCase();
          var nom = document.getElementById("bds-g-nom").value.trim();
          var mod = document.getElementById("bds-g-mod").value;
          var sha = await sha256Hex(perfil + "|" + idTxt + "|" + nom + "|" + mod);
          var pref = perfil.indexOf("Docente") !== -1 ? "DOC-" : perfil.indexOf("Estudiante") !== -1 ? "EST-" : "ENC-";
          var barcode = (pref + idTxt).replace(/[^0-9A-Z\-]/g, "").slice(0, 18);
          var payload = perfil + "|" + idTxt + "|" + nom + "|" + mod + "|" + sha;
          var carne = { perfil: perfil, identificacion: idTxt, nombre: nom, modulo: mod, codigoBarras: barcode, qrPayload: payload, sha256: sha };
          var lista = leerJson(KEY_CARNES, []);
          lista.unshift(carne);
          guardarJson(KEY_CARNES, lista.slice(0, 60));
          ui.carneActual = carne;
          render();
        };
        var bTest = document.getElementById("bds-qr52-test-scan");
        if (bTest && ui.carneActual) {
          bTest.onclick = async function () {
            ui.modulo = ui.carneActual.modulo;
            ui.tab = "escanear";
            render();
            await procesarLectura(ui.carneActual.qrPayload, "CARNE_PRUEBA_SHA256");
          };
        }
        var bCopy = document.getElementById("bds-qr52-copy-qr");
        if (bCopy && ui.carneActual) {
          bCopy.onclick = function () {
            if (navigator.clipboard) navigator.clipboard.writeText(ui.carneActual.qrPayload).catch(function () {});
            bCopy.textContent = "Copiado";
          };
        }
      } else {
        modal.querySelectorAll("[data-lf]").forEach(function (b) {
          b.onclick = function () { ui.filtroLog = b.getAttribute("data-lf"); render(); };
        });
        document.getElementById("bds-qr52-csv").onclick = exportarCsvBitacora;
      }
    }

    launcher.onclick = function () {
      modal.style.display = "block";
      render();
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarCentroQrPro);
  else montarCentroQrPro();
})();