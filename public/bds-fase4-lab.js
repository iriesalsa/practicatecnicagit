(function () {
  const IDIOMAS_6 = [
    { cod: "es-CR", nom: "Español", frase: "La excelencia técnica se construye con disciplina diaria.", tr: "Technical excellence is built with daily discipline." },
    { cod: "en-US", nom: "Inglés", frase: "Always validate user permissions on the server side.", tr: "Valide siempre los permisos de usuario en el servidor." },
    { cod: "fr-FR", nom: "Francés", frase: "Bonjour, je prépare mon projet de technologie.", tr: "Buenos días, preparo mi proyecto de tecnología." },
    { cod: "pt-BR", nom: "Portugués", frase: "A segurança digital protege toda a comunidade escolar.", tr: "La seguridad digital protege a toda la comunidad escolar." },
    { cod: "de-DE", nom: "Alemán", frase: "Qualität und Präzision sind im Ingenieurwesen entscheidend.", tr: "La calidad y la precisión son decisivas en ingeniería." },
    { cod: "zh-CN", nom: "Mandarín", frase: "技术教育为未来创造机会。", tr: "La educación técnica crea oportunidades para el futuro." }
  ];

  const ESCENARIOS_MOPT = [
    { id: "rotonda", nom: "1. Rotondas (2 y 3 carriles)", reto: "Te aproximas en carril derecho a una rotonda de 2 carriles para tomar la primera salida. Un vehículo ya circula adentro.", ok: "Ceder el paso al vehículo dentro de la rotonda, poner direccional derecha y salir por el carril externo.", mal: "Ingresar rápido sin ceder el paso cortando hacia el carril interno." },
    { id: "autopista", nom: "2. Autopistas y Velocidad", reto: "Conduces en autopista con límite de 80 km/h y lluvia moderada. Deseas adelantar un camión.", ok: "Mantener distancia segura, señalizar izquierda, adelantar por carril izquierdo sin exceder límite y regresar a la derecha.", mal: "Adelantar por el espaldón derecho acelerando a 110 km/h." },
    { id: "escolar", nom: "3. Zona Escolar / Paso Peatonal", reto: "Pasas frente al CTP Mercedes Norte a las 07:00 am con estudiantes cruzando.", ok: "Reducir velocidad a máximo 25 km/h y detenerte completamente ante el paso peatonal.", mal: "Continuar a 50 km/h tocando la bocina." },
    { id: "interseccion", nom: "4. Intersecciones y Alto/Ceda", reto: "Llegas a una esquina con señal octagonal roja de ALTO y línea amarilla continua.", ok: "Detención total antes de la línea de parada, verificar ambos sentidos y avanzar solo con vía libre.", mal: "Bajar ligeramente la velocidad sin detener las ruedas." },
    { id: "nocturna", nom: "5. Conducción Nocturna / Clima Adverso", reto: "Conduces de noche con neblina intensa y viene un vehículo en sentido contrario.", ok: "Usar luz corta (baja) para no encandilar y reducir velocidad guiándote por las líneas amarillas.", mal: "Mantener luces altas encendidas para ver más lejos." },
    { id: "emergencia", nom: "6. Estacionamiento y Emergencia", reto: "Falla un neumático en carretera nacional de doble sentido.", ok: "Orillarte fuera de la calzada, activar luces intermitentes, colocar triángulos reflectivos y usar chaleco.", mal: "Detenerte en medio del carril sin señalización." }
  ];

  function hablar(txt, lang) {
    try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = lang || "es-CR"; u.rate = 0.94; window.speechSynthesis.speak(u); } catch {}
  }

  window.BDS_RENDER_FASE4 = function (shell, subInicial, ganarXP) {
    let tab = subInicial || "mopt";
    let vehiculo = "🚗 Automóvil";
    let escIdx = 0;
    let moptFb = "";
    let langIdx = 1;
    let binVal = 192;
    let vlsmCidr = 26;
    let c4Board = Array.from({ length: 6 }, () => Array(7).fill(0));
    let c4Turn = 1;

    function draw() {
      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FASE 4 • SIMULADOR MOPT, 6 IDIOMAS TTS, LAB W3SCHOOLS & JUEGOS</span>
              <h2 style="margin:4px 0 0;font-size:17.5px;color:#fff;">Laboratorio Técnico Interactivo, Seguridad Vial e Inclusión TTS</h2>
            </div>
          </div>
          <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:12px;border-bottom:1px solid #1e293b;">
            ${[
              ["mopt","🚦 Simulador MOPT (3×6)"],
              ["idiomas","🌍 6 Idiomas + TTS Accesible"],
              ["w3","💻 Emulador HTML/CSS/JS"],
              ["calc","🧮 Calc Binario/Hex/IPv6/VLSM"],
              ["c4","🔴 Cuatro en Línea + Ruleta"]
            ].map(([k, l]) => `<button data-f4="${k}" class="f4-tb" style="background:${tab===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">${l}</button>`).join("")}
          </div>
          <div id="f4-body"></div>
        </div>
      `;
      shell.querySelectorAll(".f4-tb").forEach(b => b.onclick = () => { tab = b.getAttribute("data-f4"); draw(); });
      const body = document.getElementById("f4-body");

      if (tab === "mopt") {
        const esc = ESCENARIOS_MOPT[escIdx];
        body.innerHTML = `
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            ${["🚗 Automóvil","🏍️ Motocicleta","🚛 Transporte / Carga"].map(v => `<button data-vh="${v}" class="vh-b" style="background:${vehiculo===v?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${v}</button>`).join("")}
            <select id="mopt-es" style="margin-left:auto;background:#070d19;color:#fbbf24;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
              ${ESCENARIOS_MOPT.map((e, i) => `<option value="${i}" ${i===escIdx?"selected":""}>${e.nom}</option>`).join("")}
            </select>
          </div>
          <div style="background:#070d19;border:2px solid #f59e0b;border-radius:12px;padding:18px;">
            <svg viewBox="0 0 600 110" style="width:100%;height:105px;background:#1e293b;border-radius:8px;margin-bottom:12px;">
              <rect x="0" y="10" width="600" height="90" fill="#1e293b"/>
              <line x1="0" y1="55" x2="600" y2="55" stroke="#facc15" stroke-width="4" stroke-dasharray="22,12"/>
              <line x1="0" y1="14" x2="600" y2="14" stroke="#f8fafc" stroke-width="2"/>
              <line x1="0" y1="96" x2="600" y2="96" stroke="#f8fafc" stroke-width="2"/>
              <text x="60" y="83" font-size="24">${vehiculo.split(" ")[0]}</text>
              <text x="480" y="42" fill="#facc15" font-size="12" font-weight="800">LEY 9078 CR</text>
              <text x="300" y="84" fill="#38bdf8" font-size="11" font-weight="700">Carril Derecho Obligatorio →</text>
            </svg>
            <h3 style="margin:0 0 6px;color:#fff;font-size:15.5px;">${vehiculo} — ${esc.nom}</h3>
            <p style="margin:0 0 12px;font-size:13px;color:#cbd5e1;">${esc.reto}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
              <button id="mp-ok" style="text-align:left;background:#131f33;color:#fff;border:1px solid #334155;padding:11px;border-radius:9px;font-size:12.5px;cursor:pointer;">A) ${esc.ok}</button>
              <button id="mp-bad" style="text-align:left;background:#131f33;color:#fff;border:1px solid #334155;padding:11px;border-radius:9px;font-size:12.5px;cursor:pointer;">B) ${esc.mal}</button>
            </div>
            ${moptFb ? `<div style="margin-top:12px;padding:10px;border-radius:8px;background:#0b1322;border:1px solid #38bdf8;font-size:12.5px;color:#6ee7b7;font-weight:700;">${moptFb}</div>` : ""}
          </div>
        `;
        body.querySelectorAll(".vh-b").forEach(b => b.onclick = () => { vehiculo = b.getAttribute("data-vh"); moptFb = ""; draw(); });
        document.getElementById("mopt-es").onchange = (e) => { escIdx = Number(e.target.value); moptFb = ""; draw(); };
        document.getElementById("mp-ok").onclick = () => { moptFb = "✅ ¡Maniobra legal aprobada según Ley N° 9078! (+15 XP)"; if (ganarXP) ganarXP(15, "🚦 Conductor Seguro"); draw(); };
        document.getElementById("mp-bad").onclick = () => { moptFb = "🚫 Infracción vial detectada. Repasa los límites y señales de la Ley N° 9078."; draw(); };
      }
      else if (tab === "idiomas") {
        const lg = IDIOMAS_6[langIdx];
        body.innerHTML = `
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            ${IDIOMAS_6.map((l, i) => `<button data-li="${i}" class="lg-b" style="background:${i===langIdx?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${l.nom}</button>`).join("")}
          </div>
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:18px;">
            <span style="font-size:10.5px;color:#38bdf8;font-weight:800;">TTS ACCESIBLE PARA PERSONAS NO VIDENTES • ${lg.nom.toUpperCase()} (${lg.cod})</span>
            <h3 style="margin:8px 0 6px;color:#fff;font-size:19px;">"${lg.frase}"</h3>
            <p style="margin:0 0 14px;color:#94a3b8;font-size:13px;">Traducción gramatical: <b>${lg.tr}</b></p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button id="tts-play" style="background:#0284c7;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">🔊 Escuchar Pronunciación (Listening)</button>
              <button id="tts-spk" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">🎙️ Practicar Speaking</button>
            </div>
            <div id="tts-out" style="margin-top:10px;font-size:12px;color:#6ee7b7;"></div>
          </div>
        `;
        body.querySelectorAll(".lg-b").forEach(b => b.onclick = () => { langIdx = Number(b.getAttribute("data-li")); draw(); });
        document.getElementById("tts-play").onclick = () => hablar(lg.frase, lg.cod);
        document.getElementById("tts-spk").onclick = () => {
          const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
          const out = document.getElementById("tts-out");
          if (!Rec) { out.innerText = "Reconocimiento de voz no disponible en este navegador."; return; }
          const r = new Rec(); r.lang = lg.cod; out.innerText = "🎙️ Escuchando...";
          r.onresult = (e) => { out.innerText = `✅ Detectado: "${e.results[0][0].transcript}" (+10 XP)`; if (ganarXP) ganarXP(10); };
          r.start();
        };
      }
      else if (tab === "w3") {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:12px;">
            <div>
              <label style="font-size:11.5px;color:#38bdf8;font-weight:700;display:block;margin-bottom:4px;">Editor HTML / CSS / JS en Vivo (Estilo W3Schools):</label>
              <textarea id="w3-code" rows="11" style="width:100%;background:#070d19;border:1px solid #334155;color:#6ee7b7;padding:10px;border-radius:9px;font-family:monospace;font-size:12px;"><style>body{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:24px;}button{background:#10b981;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:bold;cursor:pointer;}</style>\n<h2>Hola CTP Mercedes Norte 🦉</h2>\n<button onclick="document.getElementById('r').innerText='¡Código JS ejecutado!'">Probar JS</button>\n<p id="r"></p></textarea>
              <button id="w3-run" style="margin-top:8px;background:#059669;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:800;cursor:pointer;">▶️ Ejecutar Código</button>
            </div>
            <div>
              <label style="font-size:11.5px;color:#fbbf24;font-weight:700;display:block;margin-bottom:4px;">Vista Previa Segura (Sandbox):</label>
              <iframe id="w3-out" sandbox="allow-scripts" style="width:100%;height:260px;background:#0f172a;border:1px solid #334155;border-radius:9px;"></iframe>
            </div>
          </div>
        `;
        const run = () => { document.getElementById("w3-out").srcdoc = document.getElementById("w3-code").value; };
        document.getElementById("w3-run").onclick = run;
        run();
      }
      else if (tab === "calc") {
        const hosts = Math.pow(2, 32 - vlsmCidr) - 2;
        const binStr = (binVal >>> 0).toString(2).padStart(8, "0");
        const hexStr = "0x" + (binVal >>> 0).toString(16).toUpperCase();
        const ipv6Full = `2001:0db8:0000:0000:0000:0000:0000:${(binVal >>> 0).toString(16).padStart(4, "0")}`;
        const ipv6Short = `2001:db8::${(binVal >>> 0).toString(16)}`;
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:15px;">
              <h3 style="margin:0 0 8px;color:#38bdf8;font-size:14.5px;">🔢 Conversor Decimal / Binario / Hex / IPv6</h3>
              <input id="c-dec" type="number" min="0" max="65535" value="${binVal}" style="width:100%;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:15px;font-weight:800;margin-bottom:10px;"/>
              <div style="font-family:monospace;font-size:12.5px;line-height:1.8;color:#cbd5e1;">
                <div><b>Binario:</b> <span style="color:#34d399;">${binStr}</span></div>
                <div><b>Hexadecimal:</b> <span style="color:#fbbf24;">${hexStr}</span></div>
                <div><b>IPv6 Expandida:</b> <span style="color:#93c5fd;">${ipv6Full}</span></div>
                <div><b>IPv6 Comprimida:</b> <span style="color:#38bdf8;">${ipv6Short}</span></div>
              </div>
            </div>
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:15px;">
              <h3 style="margin:0 0 8px;color:#34d399;font-size:14.5px;">🌐 Calculadora VLSM / CIDR IPv4</h3>
              <label style="font-size:12px;color:#94a3b8;">Prefijo CIDR (/24 a /30):</label>
              <input id="c-cidr" type="range" min="24" max="30" value="${vlsmCidr}" style="width:100%;margin:8px 0;"/>
              <div style="font-family:monospace;font-size:13px;line-height:1.8;color:#e2e8f0;">
                <div>Prefijo: <b style="color:#fbbf24;">/${vlsmCidr}</b></div>
                <div>Bits de host: <b>${32 - vlsmCidr}</b></div>
                <div>Direcciones utilizables (2^h - 2): <b style="color:#34d399;">${hosts} hosts</b></div>
                <div>Salto de subred: <b>${Math.pow(2, 32 - vlsmCidr)}</b></div>
              </div>
            </div>
          </div>
        `;
        document.getElementById("c-dec").oninput = (e) => { binVal = Math.max(0, Number(e.target.value) || 0); draw(); document.getElementById("c-dec").focus(); };
        document.getElementById("c-cidr").oninput = (e) => { vlsmCidr = Number(e.target.value); draw(); };
      }
      else {
        body.innerHTML = `
          <div style="text-align:center;">
            <h3 style="margin:0 0 8px;color:#fbbf24;">🔴 Cuatro en Línea — Turno: ${c4Turn===1 ? "🔴 Jugador 1" : "🟡 Jugador 2"}</h3>
            <div style="display:grid;grid-template-columns:repeat(7,42px);gap:5px;justify-content:center;background:#1e3a8a;padding:10px;border-radius:12px;width:fit-content;margin:0 auto;">
              ${c4Board.map((row, r) => row.map((v, c) => `<button data-c4="${c}" class="c4-b" style="width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;background:${v===1?'#ef4444':(v===2?'#facc15':'#0b1322')};"></button>`).join("")).join("")}
            </div>
            <button id="c4-rst" style="margin-top:10px;background:#1d4ed8;color:#fff;border:none;padding:7px 14px;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Reiniciar Tablero</button>
          </div>
        `;
        body.querySelectorAll(".c4-b").forEach(b => b.onclick = () => {
          const col = Number(b.getAttribute("data-c4"));
          for (let r = 5; r >= 0; r--) {
            if (c4Board[r][col] === 0) { c4Board[r][col] = c4Turn; c4Turn = c4Turn === 1 ? 2 : 1; draw(); return; }
          }
        });
        document.getElementById("c4-rst").onclick = () => { c4Board = Array.from({ length: 6 }, () => Array(7).fill(0)); c4Turn = 1; draw(); };
      }
    }
    draw();
  };
})();