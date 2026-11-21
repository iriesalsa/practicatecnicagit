(function () {
  "use strict";
  if (window.__BDS_SEC_V97__) return;
  window.__BDS_SEC_V97__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function generarCodigo6() {
    var n = Math.floor(100000 + Math.random() * 900000);
    return String(n);
  }

  function montarSeguridadSimple() {
    if (document.getElementById("bds-v97-sec-btn")) return;

    var btn = document.createElement("button");
    btn.id = "bds-v97-sec-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Abrir ayuda sencilla de seguridad y codigo de confirmacion");
    btn.style.cssText =
      "position:fixed;right:12px;bottom:176px;z-index:2147483635;" +
      "background:#1e293b;color:#f8fafc;border:2px solid #f59e0b;border-radius:999px;" +
      "padding:7px 12px;font:800 11.5px system-ui,-apple-system,sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.45);cursor:pointer";
    btn.textContent = "\ud83d\udee1\ufe0f Candado / 6 Dig";
    document.body.appendChild(btn);

    var modal = document.createElement("div");
    modal.id = "bds-v97-sec-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(modal);

    var state = {
      abierto: false,
      codigoActual: generarCodigo6(),
      entradaCodigo: "",
      fallos: 0,
      mensaje: "Escribe el código de 6 dígitos para confirmar una acción rápida."
    };

    function render() {
      if (!state.abierto) {
        modal.style.display = "none";
        return;
      }
      modal.style.display = "block";
      var bloqueado = state.fallos >= 3;

      modal.innerHTML =
        '<div style="max-width:560px;margin:14px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #f59e0b;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Seguridad Sencilla v9.7 \u2022 C\u00f3digo de 6 D\u00edgitos</strong>' +
        '<button id="bds-s97-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:14px">' +
        '<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:9px 11px;font-size:12px;margin-bottom:10px">' +
        '<strong>C\u00f3digo activo de prueba:</strong> <span style="font-size:14px;font-weight:900;letter-spacing:2px">' + esc(state.codigoActual) + '</span>' +
        '<button id="bds-s97-new" type="button" style="margin-left:10px;padding:4px 8px;border-radius:7px;border:1px solid #d97706;background:#fff;color:#92400e;font-size:11px;font-weight:800;cursor:pointer">Nuevo c\u00f3digo</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:10px">' +
        '<input id="bds-s97-inp" type="text" maxlength="6" value="' + esc(state.entradaCodigo) + '" placeholder="Escriba los 6 d\u00edgitos..." ' + (bloqueado ? "disabled " : "") + 'style="flex:1;padding:8px 10px;border-radius:8px;border:1.5px solid #475569;font-size:13px"/>' +
        '<button id="bds-s97-ok" type="button" ' + (bloqueado ? "disabled " : "") + 'style="padding:8px 12px;border-radius:8px;border:none;background:' + (bloqueado ? "#94a3b8" : "#047857") + ';color:#fff;font-size:12px;font-weight:800;cursor:pointer">Confirmar</button>' +
        '<button id="bds-s97-reset" type="button" style="padding:8px 10px;border-radius:8px;border:none;background:#334155;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Reiniciar</button>' +
        '</div>' +
        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:9px 11px;font-size:12px">' + esc(state.mensaje) + '</div>' +
        '</div></div>';

      document.getElementById("bds-s97-close").onclick = function () { state.abierto = false; render(); };
      document.getElementById("bds-s97-new").onclick = function () {
        state.codigoActual = generarCodigo6();
        state.entradaCodigo = "";
        state.mensaje = "Se generó un código nuevo de 6 dígitos.";
        render();
      };
      document.getElementById("bds-s97-reset").onclick = function () {
        state.fallos = 0;
        state.entradaCodigo = "";
        state.codigoActual = generarCodigo6();
        state.mensaje = "Contador reiniciado y código listo.";
        render();
      };
      var okBtn = document.getElementById("bds-s97-ok");
      if (okBtn && !bloqueado) {
        okBtn.onclick = function () {
          var val = String((document.getElementById("bds-s97-inp") || {}).value || "").trim();
          state.entradaCodigo = val;
          if (val === state.codigoActual) {
            state.fallos = 0;
            state.codigoActual = generarCodigo6();
            state.entradaCodigo = "";
            state.mensaje = "Confirmado con éxito. Se preparó un código nuevo para la siguiente acción.";
          } else {
            state.fallos += 1;
            if (state.fallos >= 3) {
              state.mensaje = "Pausa de seguridad tras 3 intentos fallidos. Pulse Reiniciar para continuar.";
            } else {
              state.mensaje = "Código incorrecto (intento " + state.fallos + " de 3). Revise los 6 dígitos.";
            }
          }
          render();
        };
      }
    }

    btn.onclick = function () { state.abierto = !state.abierto; render(); };

    window.BDSSecV97 = {
      open: function () { state.abierto = true; render(); },
      close: function () { state.abierto = false; render(); },
      genCode: generarCodigo6,
      secReady: true
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarSeguridadSimple);
  else montarSeguridadSimple();
})();