(function () {
  "use strict";
  if (window.__BDS_CHAT_STATS_V91__) return;
  window.__BDS_CHAT_STATS_V91__ = true;

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var CANALES = {
    GENERAL: [
      { autor: "Coordinacion", hora: "08:10", msg: "Recordatorio de coordinacion academica y revision de avances." },
      { autor: "Docente", hora: "08:25", msg: "Rubricas y guias listas para el grupo." }
    ],
    DOCENTES: [
      { autor: "Docente", hora: "09:05", msg: "Actualizamos seguimiento de entregas y asistencia del periodo." },
      { autor: "Jefatura / Guia", hora: "09:18", msg: "Revisar casos con alerta temprana para apoyo oportuno." }
    ],
    ESTUDIANTES: [
      { autor: "Docente", hora: "10:00", msg: "Suban sus practicas y revisen retroalimentacion en clase." },
      { autor: "Estudiante", hora: "10:04", msg: "Listo profe, ya revisamos las indicaciones." }
    ],
    ENCARGADOS: [
      { autor: "Docente / Guia", hora: "10:30", msg: "Canal directo para familias y encargados legales sobre progreso y asistencia." },
      { autor: "Encargado", hora: "10:42", msg: "Muchas gracias por el reporte y el acompanamiento." }
    ]
  };

  var REGISTROS_CRUZADOS = [
    {
      estudiante: "Alvarado Campos Mateo",
      nivel: "Primaria (Seccion A-A)",
      asignatura: "Espanol / Matematicas",
      promedio: 0.65,
      asistenciaPct: 95,
      docente: "Docente Titular",
      encargado: "Encargado Registrado",
      estadoCruce: "Seguimiento activo"
    },
    {
      estudiante: "Mesen Salas Nahiara Sofia",
      nivel: "Primaria (Seccion A-A)",
      asignatura: "Ciencias / Estudios Sociales",
      promedio: 0.99,
      asistenciaPct: 100,
      docente: "Docente Titular",
      encargado: "Encargado Registrado",
      estadoCruce: "Al dia / Destacado"
    },
    {
      estudiante: "Estudiante Seccion 11-1",
      nivel: "Secundaria / Tecnica (11-1)",
      asignatura: "Programacion / Diseno Software",
      promedio: 0.88,
      asistenciaPct: 96,
      docente: "Ing. Max Salazar Sanchez",
      encargado: "Encargado Registrado",
      estadoCruce: "Verificado en control cruzado"
    },
    {
      estudiante: "Estudiante Seccion 10-C-3",
      nivel: "Secundaria / Tecnica (10-C-3)",
      asignatura: "Herramientas Prod. / Soporte TI",
      promedio: 0.84,
      asistenciaPct: 94,
      docente: "Ing. Max Salazar Sanchez",
      encargado: "Encargado Registrado",
      estadoCruce: "Verificado en control cruzado"
    }
  ];

  function calcularResumen(filtroNivel, filtroEstudiante) {
    var lista = REGISTROS_CRUZADOS.filter(function (r) {
      var okN = (filtroNivel === "TODOS") || (r.nivel === filtroNivel);
      var okE = (filtroEstudiante === "TODOS") || (r.estudiante === filtroEstudiante);
      return okN && okE;
    });
    if (!lista.length) lista = REGISTROS_CRUZADOS;

    var sumaProm = lista.reduce(function (acc, item) { return acc + item.promedio; }, 0);
    var sumaAsis = lista.reduce(function (acc, item) { return acc + item.asistenciaPct; }, 0);
    var promMedio = Number((sumaProm / lista.length).toFixed(2));
    var asisMedia = Number((sumaAsis / lista.length).toFixed(1));

    return {
      totalRegistros: lista.length,
      promedio: promMedio,
      porcentaje100: Number((promMedio * 100).toFixed(1)),
      asistenciaMedia: asisMedia,
      filas: lista
    };
  }

  function construirGraficoSvg(filas) {
    var maxW = 520;
    var barH = 22;
    var gap = 10;
    var h = Math.max(95, filas.length * (barH + gap) + 24);
    var barras = filas.map(function (f, i) {
      var y = 12 + i * (barH + gap);
      var pct = Math.max(0, Math.min(100, Math.round(f.promedio * 100)));
      var w = Math.round((pct / 100) * 260);
      var color = pct >= 85 ? "#047857" : (pct >= 70 ? "#1d4ed8" : "#b45309");
      return (
        '<text x="4" y="' + (y + 15) + '" font-size="11" font-weight="700" fill="#0f172a">' + esc(f.estudiante.slice(0, 22)) + '</text>' +
        '<rect x="175" y="' + y + '" width="260" height="' + barH + '" rx="6" fill="#e2e8f0"/>' +
        '<rect x="175" y="' + y + '" width="' + w + '" height="' + barH + '" rx="6" fill="' + color + '"/>' +
        '<text x="444" y="' + (y + 15) + '" font-size="11" font-weight="800" fill="#0f172a">' + pct + '% (' + f.asistenciaPct + '%)</text>'
      );
    }).join("");

    return '<svg viewBox="0 0 ' + maxW + ' ' + h + '" width="100%" height="' + h + '" role="img" aria-label="Grafico de rendimiento y asistencia por estudiante" style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px">' + barras + '</svg>';
  }

  function montarInterfaz() {
    if (document.getElementById("bds-v91-chat-pill")) return;

    // Boton discreto de Chat Flotante (esquina inferior izquierda, sin tapar navegacion principal)
    var chatPill = document.createElement("button");
    chatPill.id = "bds-v91-chat-pill";
    chatPill.type = "button";
    chatPill.setAttribute("aria-label", "Abrir chats flotantes por canal");
    chatPill.style.cssText =
      "position:fixed;left:12px;bottom:16px;z-index:2147483636;" +
      "background:#0f172a;color:#f8fafc;border:2px solid #38bdf8;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,-apple-system,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    chatPill.textContent = "\ud83d\udcac Chats Canales";
    document.body.appendChild(chatPill);

    // Ventana flotante compacta de chats por canal
    var chatWin = document.createElement("div");
    chatWin.id = "bds-v91-chat-win";
    chatWin.style.cssText =
      "display:none;position:fixed;left:12px;bottom:58px;width:min(360px,calc(100vw - 24px));" +
      "z-index:2147483645;background:#ffffff;color:#0f172a;border:2px solid #0284c7;" +
      "border-radius:14px;box-shadow:0 14px 34px rgba(0,0,0,.45);overflow:hidden;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(chatWin);

    // Boton de Resumen, Graficos y Control Cruzado (arriba junto a la pill de nave o superior discreto)
    var statsPill = document.createElement("button");
    statsPill.id = "bds-v91-stats-pill";
    statsPill.type = "button";
    statsPill.setAttribute("aria-label", "Abrir graficos, resumen estadistico y control cruzado");
    statsPill.style.cssText =
      "position:fixed;right:12px;bottom:56px;z-index:2147483636;" +
      "background:#047857;color:#ffffff;border:2px solid #6ee7b7;border-radius:999px;" +
      "padding:8px 13px;font:800 12px system-ui,-apple-system,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer";
    statsPill.textContent = "\ud83d\udcca Resumen & Cruce";
    document.body.appendChild(statsPill);

    var statsModal = document.createElement("div");
    statsModal.id = "bds-v91-stats-modal";
    statsModal.style.cssText =
      "display:none;position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.86);" +
      "overflow:hidden;padding:12px;font-family:system-ui,-apple-system,sans-serif";
    document.body.appendChild(statsModal);

    var stChat = {
      open: false,
      minimized: false,
      canal: "GENERAL",
      draft: ""
    };

    var stStats = {
      open: false,
      filtroNivel: "TODOS",
      filtroEstudiante: "TODOS"
    };

    function renderChat() {
      if (!stChat.open) {
        chatWin.style.display = "none";
        return;
      }
      chatWin.style.display = "block";

      if (stChat.minimized) {
        chatWin.innerHTML =
          '<div style="background:#0f172a;color:#fff;padding:9px 12px;display:flex;justify-content:space-between;align-items:center">' +
          '<strong style="font-size:12px">Chat \u2022 ' + esc(stChat.canal) + ' (Minimizado)</strong>' +
          '<div style="display:flex;gap:6px">' +
          '<button id="bds-c91-max" type="button" style="background:#0284c7;color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;cursor:pointer">Abrir</button>' +
          '<button id="bds-c91-x" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;cursor:pointer">X</button>' +
          '</div></div>';
        document.getElementById("bds-c91-max").onclick = function () { stChat.minimized = false; renderChat(); };
        document.getElementById("bds-c91-x").onclick = function () { stChat.open = false; renderChat(); };
        return;
      }

      var msgs = CANALES[stChat.canal] || [];
      var msgsHtml = msgs.map(function (m) {
        return '<div style="background:#f1f5f9;border-radius:8px;padding:6px 8px;margin-bottom:6px;font-size:11.5px">' +
          '<div style="font-weight:800;color:#0f172a">' + esc(m.autor) + ' <span style="font-weight:500;color:#64748b">(' + esc(m.hora) + ')</span></div>' +
          '<div style="color:#1e293b;margin-top:2px">' + esc(m.msg) + '</div></div>';
      }).join("");

      var canalesKeys = ["GENERAL", "DOCENTES", "ESTUDIANTES", "ENCARGADOS"];
      var tabsHtml = canalesKeys.map(function (k) {
        var act = (stChat.canal === k);
        return '<button type="button" data-ch="' + k + '" class="bds-c91-ch" style="padding:4px 7px;border-radius:7px;border:none;background:' + (act ? "#0284c7" : "#e2e8f0") + ';color:' + (act ? "#fff" : "#0f172a") + ';font-size:10.5px;font-weight:800;cursor:pointer">' + esc(k.slice(0, 7)) + '</button>';
      }).join("");

      chatWin.innerHTML =
        '<div style="background:#0f172a;color:#fff;padding:9px 12px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:12.5px">Canal: ' + esc(stChat.canal) + '</strong>' +
        '<div style="display:flex;gap:6px">' +
        '<button id="bds-c91-min" type="button" style="background:#334155;color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;cursor:pointer">_</button>' +
        '<button id="bds-c91-x" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;cursor:pointer">X</button>' +
        '</div></div>' +
        '<div style="padding:9px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">' + tabsHtml + '</div>' +
        '<div style="max-height:150px;overflow:auto;margin-bottom:8px">' + msgsHtml + '</div>' +
        '<div style="display:flex;gap:6px">' +
        '<input id="bds-c91-inp" type="text" value="' + esc(stChat.draft) + '" placeholder="Escribir en ' + esc(stChat.canal) + '..." style="flex:1;padding:6px 8px;border-radius:8px;border:1px solid #64748b;font-size:12px"/>' +
        '<button id="bds-c91-send" type="button" style="padding:6px 10px;border-radius:8px;border:none;background:#047857;color:#fff;font-size:12px;font-weight:800;cursor:pointer">Enviar</button>' +
        '</div></div>';

      document.getElementById("bds-c91-min").onclick = function () { stChat.minimized = true; renderChat(); };
      document.getElementById("bds-c91-x").onclick = function () { stChat.open = false; renderChat(); };

      Array.prototype.forEach.call(chatWin.querySelectorAll(".bds-c91-ch"), function (b) {
        b.onclick = function () { stChat.canal = b.getAttribute("data-ch") || "GENERAL"; stChat.draft = ""; renderChat(); };
      });

      function enviarMensaje() {
        var inp = document.getElementById("bds-c91-inp");
        var txt = inp ? String(inp.value || "").trim() : "";
        if (!txt) return;
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
        CANALES[stChat.canal].push({ autor: "Yo", hora: hh, msg: txt });
        stChat.draft = "";
        renderChat();
      }

      document.getElementById("bds-c91-send").onclick = enviarMensaje;
      var inpEl = document.getElementById("bds-c91-inp");
      if (inpEl) {
        inpEl.onkeydown = function (ev) { if (ev.key === "Enter") { ev.preventDefault(); enviarMensaje(); } };
      }
    }

    function renderStats() {
      if (!stStats.open) {
        statsModal.style.display = "none";
        return;
      }
      statsModal.style.display = "block";
      var res = calcularResumen(stStats.filtroNivel, stStats.filtroEstudiante);

      var filasHtml = res.filas.map(function (f) {
        return '<tr>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0;font-weight:700">' + esc(f.estudiante) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0">' + esc(f.nivel) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0">' + esc(f.asignatura) + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0">' + esc((f.promedio * 100).toFixed(0)) + '%</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0">' + esc(f.asistenciaPct) + '%</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0">' + esc(f.docente) + ' / ' + esc(f.encargado) + '</td>' +
          '</tr>';
      }).join("");

      statsModal.innerHTML =
        '<div style="max-width:760px;margin:8px auto;background:#ffffff;color:#0f172a;border-radius:16px;border:2px solid #047857;overflow:hidden">' +
        '<div style="background:#0f172a;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">' +
        '<strong style="font-size:14px">Resumen, Gr\u00e1ficos y Control Cruzado (Docente \u2022 Estudiante \u2022 Encargado)</strong>' +
        '<button id="bds-s91-close" type="button" style="background:#b91c1c;color:#fff;border:none;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">Cerrar</button>' +
        '</div>' +
        '<div style="padding:13px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;font-size:12px">' +
        '<label>Nivel / Grupo<select id="bds-s91-niv" style="padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-left:6px">' +
        '<option value="TODOS">Todos los niveles</option>' +
        '<option value="Primaria (Seccion A-A)">Primaria (Seccion A-A)</option>' +
        '<option value="Secundaria / Tecnica (11-1)">Secundaria / Tecnica (11-1)</option>' +
        '<option value="Secundaria / Tecnica (10-C-3)">Secundaria / Tecnica (10-C-3)</option>' +
        '</select></label>' +
        '<label>Estudiante<select id="bds-s91-est" style="padding:6px 8px;border-radius:8px;border:1px solid #64748b;margin-left:6px">' +
        '<option value="TODOS">Todos</option>' +
        '<option value="Alvarado Campos Mateo">Alvarado Campos Mateo</option>' +
        '<option value="Mesen Salas Nahiara Sofia">Mesen Salas Nahiara Sofia</option>' +
        '<option value="Estudiante Seccion 11-1">Estudiante Seccion 11-1</option>' +
        '<option value="Estudiante Seccion 10-C-3">Estudiante Seccion 10-C-3</option>' +
        '</select></label>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;font-size:12px">' +
        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:8px"><strong>Registros:</strong> ' + esc(res.totalRegistros) + '</div>' +
        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:8px"><strong>Promedio:</strong> ' + esc(res.porcentaje100) + '% (' + esc(res.promedio) + ')</div>' +
        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:8px"><strong>Asistencia media:</strong> ' + esc(res.asistenciaMedia) + '%</div>' +
        '</div>' +
        '<div style="margin-bottom:10px">' + construirGraficoSvg(res.filas) + '</div>' +
        '<div style="max-height:150px;overflow:auto;border:1px solid #e2e8f0;border-radius:10px">' +
        '<table style="width:100%;border-collapse:collapse;font-size:11.5px;text-align:left">' +
        '<thead><tr style="background:#f1f5f9"><th style="padding:6px">Estudiante</th><th style="padding:6px">Nivel</th><th style="padding:6px">Asignatura</th><th style="padding:6px">Nota</th><th style="padding:6px">Asist.</th><th style="padding:6px">Cruce Docente/Encargado</th></tr></thead>' +
        '<tbody>' + filasHtml + '</tbody></table></div>' +
        '</div></div>';

      document.getElementById("bds-s91-close").onclick = function () { stStats.open = false; renderStats(); };
      var nivEl = document.getElementById("bds-s91-niv");
      var estEl = document.getElementById("bds-s91-est");
      if (nivEl) {
        nivEl.value = stStats.filtroNivel;
        nivEl.onchange = function () { stStats.filtroNivel = nivEl.value; renderStats(); };
      }
      if (estEl) {
        estEl.value = stStats.filtroEstudiante;
        estEl.onchange = function () { stStats.filtroEstudiante = estEl.value; renderStats(); };
      }
    }

    chatPill.onclick = function () {
      stChat.open = !stChat.open;
      stChat.minimized = false;
      renderChat();
    };

    statsPill.onclick = function () {
      stStats.open = !stStats.open;
      renderStats();
    };

    window.BDSChatStatsV91 = {
      openChat: function (ch) { if (ch && CANALES[ch]) stChat.canal = ch; stChat.open = true; stChat.minimized = false; renderChat(); },
      openStats: function () { stStats.open = true; renderStats(); },
      getSummary: function () { return calcularResumen(stStats.filtroNivel, stStats.filtroEstudiante); }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montarInterfaz);
  else montarInterfaz();
})();