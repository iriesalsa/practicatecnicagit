(function () {
  function svgIlustracion(id) {
    if (id === "web" || id === "ciber") {
      return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #1e3a8a;">
        <rect x="18" y="38" width="90" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="63" y="68" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">FRONTEND</text>
        <text x="63" y="86" text-anchor="middle" fill="#cbd5e1" font-size="9">React / PWA</text>
        <line x1="108" y1="73" x2="150" y2="73" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5,4"/>
        <rect x="150" y="38" width="84" height="70" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <text x="192" y="68" text-anchor="middle" fill="#6ee7b7" font-size="11" font-weight="800">TLS 1.3</text>
        <text x="192" y="86" text-anchor="middle" fill="#a7f3d0" font-size="9">RBAC + SHA256</text>
        <line x1="234" y1="73" x2="266" y2="73" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5,4"/>
        <rect x="266" y="38" width="76" height="70" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
        <text x="304" y="68" text-anchor="middle" fill="#a5b4fc" font-size="11" font-weight="800">SQL DB</text>
        <text x="304" y="86" text-anchor="middle" fill="#cbd5e1" font-size="9">PostgreSQL</text>
      </svg>`;
    }
    if (id === "electro" || id === "talleres" || id === "fisica") {
      return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #0284c7;">
        <rect x="35" y="28" width="165" height="94" rx="10" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <rect x="22" y="54" width="26" height="42" rx="4" fill="#d97706"/>
        <text x="35" y="79" text-anchor="middle" fill="#fff" font-size="11" font-weight="900">12V</text>
        <polyline points="90,28 100,18 110,38 120,18 130,38 140,28" fill="none" stroke="#10b981" stroke-width="3"/>
        <text x="115" y="52" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="800">R = 4 Ω</text>
        <polygon points="280,26 230,118 330,118" fill="#131f33" stroke="#fbbf24" stroke-width="2.5"/>
        <line x1="255" y1="74" x2="305" y2="74" stroke="#fbbf24" stroke-width="2"/>
        <line x1="280" y1="74" x2="280" y2="118" stroke="#fbbf24" stroke-width="2"/>
        <text x="280" y="64" text-anchor="middle" fill="#fff" font-size="16" font-weight="900">V</text>
        <text x="262" y="102" text-anchor="middle" fill="#38bdf8" font-size="15" font-weight="900">I</text>
        <text x="298" y="102" text-anchor="middle" fill="#34d399" font-size="15" font-weight="900">R</text>
      </svg>`;
    }
    if (id === "mate") {
      return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #16a34a;">
        <polygon points="60,122 180,122 60,36" fill="rgba(22,163,74,0.22)" stroke="#34d399" stroke-width="3"/>
        <rect x="60" y="108" width="14" height="14" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <text x="42" y="84" fill="#fff" font-size="13" font-weight="800">a = 6</text>
        <text x="118" y="138" fill="#fff" font-size="13" font-weight="800">b = 8</text>
        <text x="135" y="70" fill="#fbbf24" font-size="13" font-weight="900">c = 10</text>
        <text x="275" y="64" text-anchor="middle" fill="#38bdf8" font-size="16" font-weight="900">c² = a² + b²</text>
        <text x="275" y="92" text-anchor="middle" fill="#cbd5e1" font-size="12">√(36 + 64) = 10</text>
      </svg>`;
    }
    if (id === "biologia" || id === "quimica") {
      return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #9333ea;">
        <ellipse cx="110" cy="75" rx="76" ry="50" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2.5"/>
        <circle cx="96" cy="75" r="22" fill="#4f46e5" stroke="#a5b4fc" stroke-width="2"/>
        <text x="96" y="79" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">ADN</text>
        <ellipse cx="148" cy="60" rx="14" ry="8" fill="#f59e0b"/>
        <text x="110" y="138" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="700">Célula Eucariota • Mitocondria</text>
        <rect x="210" y="54" width="130" height="22" rx="6" fill="url(#phg)"/>
        <defs><linearGradient id="phg"><stop offset="0%" stop-color="#ef4444"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs>
        <text x="275" y="42" text-anchor="middle" fill="#fff" font-size="12" font-weight="800">Escala pH (0–14)</text>
        <text x="220" y="94" fill="#fca5a5" font-size="10">Ácido</text>
        <text x="262" y="94" fill="#86efac" font-size="10">7</text>
        <text x="308" y="94" fill="#93c5fd" font-size="10">Base</text>
      </svg>`;
    }
    if (id === "mopt") {
      return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #0284c7;">
        <polygon points="75,30 115,30 140,55 140,95 115,120 75,120 50,95 50,55" fill="#dc2626" stroke="#fff" stroke-width="4"/>
        <text x="95" y="82" text-anchor="middle" fill="#fff" font-size="22" font-weight="900">ALTO</text>
        <circle cx="250" cy="75" r="42" fill="#fff" stroke="#dc2626" stroke-width="8"/>
        <text x="250" y="83" text-anchor="middle" fill="#0f172a" font-size="24" font-weight="900">25</text>
        <text x="250" y="135" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="700">Zona Escolar — Ley N° 9078</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 360 150" style="width:100%;height:145px;background:#071124;border-radius:10px;border:1px solid #334155;">
      <rect x="30" y="26" width="135" height="98" rx="8" fill="#131f33" stroke="#38bdf8" stroke-width="2"/>
      <rect x="195" y="26" width="135" height="98" rx="8" fill="#131f33" stroke="#2dd4bf" stroke-width="2"/>
      <text x="97" y="64" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="800">TEORÍA MEP</text>
      <text x="97" y="86" text-anchor="middle" fill="#cbd5e1" font-size="10">Conceptos Clave</text>
      <text x="262" y="64" text-anchor="middle" fill="#2dd4bf" font-size="12" font-weight="800">PRÁCTICA LIVE</text>
      <text x="262" y="86" text-anchor="middle" fill="#cbd5e1" font-size="10">Ejemplos Resueltos</text>
      <line x1="165" y1="75" x2="195" y2="75" stroke="#fbbf24" stroke-width="3"/>
    </svg>`;
  }

  window.BDS_RENDER_BIBLIOTECA_ILUSTRADA = function (shell, helpers) {
    const { malla, ganarXP, abrirPractica, IMG_ESCUDO, IMG_MEP } = helpers;
    let sub = "manuales";
    let selAreaId = malla[0] ? malla[0].id : "web";
    let afiche = { titulo: "Feria Técnica y Admisión 2026", sub: "Colegio Técnico Profesional Mercedes Norte • Circuito 02", cuerpo: "Invitamos a estudiantes y familias a los talleres de preparación UCR, TEC, UNA, UNED, UTN y especialidades técnicas.", formato: "1080x1080", tema: "#0f2247" };

    function exportarPosterPNG() {
      const [w, h] = afiche.formato.split("x").map(Number);
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      const gr = ctx.createLinearGradient(0, 0, w, h); gr.addColorStop(0, afiche.tema); gr.addColorStop(1, "#060c17");
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 10; ctx.strokeRect(28, 28, w - 56, h - 56);
      ctx.fillStyle = "#38bdf8"; ctx.font = `800 ${Math.round(w*0.023)}px Inter, sans-serif`; ctx.textAlign = "center";
      ctx.fillText("COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE • HEREDIA • CIRCUITO 02", w / 2, h * 0.14);
      ctx.fillStyle = "#ffffff"; ctx.font = `900 ${Math.round(w*0.048)}px Inter, sans-serif`;
      ctx.fillText(afiche.titulo, w / 2, h * 0.42, w * 0.84);
      ctx.fillStyle = "#2dd4bf"; ctx.font = `700 ${Math.round(w*0.028)}px Inter, sans-serif`;
      ctx.fillText(afiche.sub, w / 2, h * 0.54, w * 0.84);
      ctx.fillStyle = "#e2e8f0"; ctx.font = `500 ${Math.round(w*0.024)}px Inter, sans-serif`;
      ctx.fillText(afiche.cuerpo, w / 2, h * 0.68, w * 0.82);
      const a = document.createElement("a"); a.download = `afiche-ctpmn-${afiche.formato}.png`; a.href = cv.toDataURL("image/png"); a.click();
      if (ganarXP) ganarXP(20, "🎨 Marca Blanca");
    }

    function draw() {
      const mat = malla.find(m => m.id === selAreaId) || malla[0];
      const ejemploItem = (window.BDS_BANCO_CURADO || []).find(x => x.a === mat.id);

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">BIBLIOTECA ILUSTRADA LIVE ACTION • MANUALES & MARCA BLANCA</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">Libros Resúmenes, Diagramas Educativos y Afiches Institucionales</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="bl-man" style="background:${sub==='manuales'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📖 Manuales Ilustrados (22)</button>
              <button id="bl-cam" style="background:${sub==='campana'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🎨 Afiches Marca Blanca</button>
            </div>
          </div>

          ${sub === "manuales" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start;">
              <!-- Índice lateral de los 22 libros -->
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:10px;max-height:540px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;">
                <div style="font-size:11px;font-weight:800;color:#94a3b8;padding:4px 6px;">SELECCIONA UN LIBRO / MANUAL:</div>
                ${malla.map(m => `
                  <button data-mid="${m.id}" class="m-idx" style="text-align:left;background:${m.id===selAreaId?'#1d4ed8':'#0b1322'};color:#fff;border:1px solid ${m.id===selAreaId?'#38bdf8':'#1e293b'};border-left:4px solid ${m.color};padding:9px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                    ${m.name} <span style="display:block;font-size:10px;color:#94a3b8;font-weight:500;">${m.cat}</span>
                  </button>
                `).join("")}
              </div>

              <!-- Visor Live Action del Manual Seleccionado -->
              <div style="background:#070d19;border:1px solid #1e293b;border-top:4px solid ${mat.color};border-radius:12px;padding:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                  <div>
                    <span style="font-size:10px;font-weight:800;color:${mat.color};">${mat.cat.toUpperCase()} • CTP MERCEDES NORTE</span>
                    <h3 style="margin:3px 0 0;color:#fff;font-size:18px;">📘 Manual Ilustrado: ${mat.name}</h3>
                  </div>
                  <button onclick="window.print()" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir Guía PDF</button>
                </div>

                <!-- Ilustración SVG Educativa -->
                <div style="margin-bottom:14px;">${svgIlustracion(mat.id)}</div>

                <h4 style="margin:0 0 5px;color:#38bdf8;font-size:13.5px;">1. Resumen Curricular Oficial MEP</h4>
                <p style="margin:0 0 12px;font-size:13px;color:#e2e8f0;line-height:1.55;">${mat.libro}</p>

                <h4 style="margin:0 0 6px;color:#34d399;font-size:13.5px;">2. Conceptos, Fórmulas y Reglas Clave</h4>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:7px;margin-bottom:14px;">
                  ${mat.claves.map(k => `<div style="background:#0b1322;border:1px solid #1e293b;padding:8px 10px;border-radius:8px;font-size:12px;color:#cbd5e1;">✓ ${k}</div>`).join("")}
                </div>

                ${ejemploItem ? `
                  <div style="background:#0b1322;border-left:4px solid #fbbf24;padding:12px;border-radius:8px;margin-bottom:14px;">
                    <div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:4px;">3. EJEMPLO RESUELTO PASO A PASO (LIVE ACTION)</div>
                    <div style="font-size:12.5px;color:#fff;font-weight:700;margin-bottom:4px;">${ejemploItem.q}</div>
                    <div style="font-size:12px;color:#6ee7b7;margin-bottom:3px;"><b>Respuesta correcta:</b> ${ejemploItem.o[ejemploItem.c]}</div>
                    <div style="font-size:11.5px;color:#94a3b8;"><b>Explicación:</b> ${ejemploItem.e}</div>
                  </div>
                ` : ""}

                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button id="man-prac" style="background:#059669;color:#fff;border:none;padding:9px 15px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">🧭 Práctica Guiada de ${mat.name}</button>
                  <button id="man-sim" style="background:#d97706;color:#fff;border:none;padding:9px 15px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">⏱️ Simulacro Cronometrado</button>
                </div>
              </div>
            </div>
          ` : `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
              <div style="display:flex;flex-direction:column;gap:10px;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Arte 100% propiedad institucional: <b>cero marcas de agua ni siglas de software ajenas</b>.</p>
                <input id="af-t" type="text" value="${afiche.titulo}" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
                <input id="af-s" type="text" value="${afiche.sub}" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
                <textarea id="af-c" rows="3" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;">${afiche.cuerpo}</textarea>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <select id="af-fmt" style="background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    <option value="1080x1080" ${afiche.formato==="1080x1080"?"selected":""}>Instagram 1:1</option>
                    <option value="1080x1920" ${afiche.formato==="1080x1920"?"selected":""}>WhatsApp Estado 9:16</option>
                    <option value="1280x720" ${afiche.formato==="1280x720"?"selected":""}>WhatsApp / Web 16:9</option>
                    <option value="1080x1350" ${afiche.formato==="1080x1350"?"selected":""}>Facebook / Mural 4:5</option>
                  </select>
                  <select id="af-bg" style="background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    <option value="#0f2247" ${afiche.tema==="#0f2247"?"selected":""}>Azul Institucional</option>
                    <option value="#064e3b" ${afiche.tema==="#064e3b"?"selected":""}>Esmeralda Técnico</option>
                    <option value="#7f1d1d" ${afiche.tema==="#7f1d1d"?"selected":""}>Vino CTP Mercedes Norte</option>
                  </select>
                </div>
                <button id="af-dl" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">📥 Exportar Afiche PNG Marca Blanca</button>
              </div>
              <div style="background:linear-gradient(135deg,${afiche.tema},#060c17);border:2px solid #38bdf8;border-radius:14px;padding:20px;text-align:center;display:flex;flex-direction:column;justify-content:center;gap:10px;min-height:280px;">
                <div style="display:flex;justify-content:center;gap:12px;align-items:center;"><img src="${IMG_ESCUDO}" height="44"/><img src="${IMG_MEP}" height="36"/></div>
                <div style="font-size:10px;color:#38bdf8;font-weight:800;">COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE • CIRCUITO 02</div>
                <h3 style="margin:0;color:#fff;font-size:19px;">${afiche.titulo}</h3>
                <div style="font-size:13px;color:#2dd4bf;font-weight:700;">${afiche.sub}</div>
                <p style="margin:0;font-size:12.5px;color:#e2e8f0;line-height:1.45;">${afiche.cuerpo}</p>
              </div>
            </div>
          `}
        </div>
      `;

      document.getElementById("bl-man").onclick = () => { sub = "manuales"; draw(); };
      document.getElementById("bl-cam").onclick = () => { sub = "campana"; draw(); };
      if (sub === "manuales") {
        shell.querySelectorAll(".m-idx").forEach(b => b.onclick = () => { selAreaId = b.getAttribute("data-mid"); draw(); });
        document.getElementById("man-prac").onclick = () => abrirPractica("guiada", mat.id);
        document.getElementById("man-sim").onclick = () => abrirPractica("simulacro", mat.id);
      } else {
        document.getElementById("af-t").oninput = (e) => { afiche.titulo = e.target.value; draw(); document.getElementById("af-t").focus(); };
        document.getElementById("af-s").oninput = (e) => { afiche.sub = e.target.value; draw(); document.getElementById("af-s").focus(); };
        document.getElementById("af-c").oninput = (e) => { afiche.cuerpo = e.target.value; draw(); document.getElementById("af-c").focus(); };
        document.getElementById("af-fmt").onchange = (e) => { afiche.formato = e.target.value; };
        document.getElementById("af-bg").onchange = (e) => { afiche.tema = e.target.value; draw(); };
        document.getElementById("af-dl").onclick = exportarPosterPNG;
      }
    }
    draw();
  };
})();