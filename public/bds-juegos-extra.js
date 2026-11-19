(function () {
  const ORIG_RENDER = window.BDS_RENDER_SALA_JUEGOS;
  if (!ORIG_RENDER) return;

  const PERSONAJES_AQ = [
    { nom: "Juan Santamaría", ic: "🔥", cr: true, ciencia: false, tech: false, mujer: false, pista: "Héroe nacional de la Batalla de Rivas (11 de abril de 1856)." },
    { nom: "Clodomiro Picado", ic: "🧬", cr: true, ciencia: true, tech: false, mujer: false, pista: "Científico costarricense pionero en sueros antiofídicos y precursores de penicilina." },
    { nom: "Franklin Chang-Díaz", ic: "🚀", cr: true, ciencia: true, tech: true, mujer: false, pista: "Físico y astronauta costarricense, récord de 7 vuelos espaciales y motor de plasma." },
    { nom: "Carmen Lyra", ic: "📖", cr: true, ciencia: false, tech: false, mujer: true, pista: "Escritora y educadora costarricense, autora de Cuentos de mi Tía Panchita." },
    { nom: "Alan Turing", ic: "💻", cr: false, ciencia: true, tech: true, mujer: false, pista: "Padre de la computación moderna y la inteligencia artificial." },
    { nom: "Ada Lovelace", ic: "⚙️", cr: false, ciencia: true, tech: true, mujer: true, pista: "Primera programadora de la historia, escribió el primer algoritmo para máquina." },
    { nom: "Marie Curie", ic: "⚛️", cr: false, ciencia: true, tech: false, mujer: true, pista: "Única persona en ganar Premios Nobel en dos ciencias distintas (Física y Química)." },
    { nom: "Isaac Newton", ic: "🍎", cr: false, ciencia: true, tech: false, mujer: false, pista: "Formuló las tres leyes del movimiento y la gravitación universal." },
    { nom: "Grace Hopper", ic: "🖥️", cr: false, ciencia: false, tech: true, mujer: true, pista: "Pionera de compiladores de programación y del lenguaje COBOL." },
    { nom: "Sócrates", ic: "🏛️", cr: false, ciencia: false, tech: false, mujer: false, pista: "Filósofo griego creador del método de preguntas llamado mayéutica." },
    { nom: "Yolanda Oreamuno", ic: "✍️", cr: true, ciencia: false, tech: false, mujer: true, pista: "Destacada novelista costarricense, autora de La ruta de su evasión." },
    { nom: "Nikola Tesla", ic: "⚡", cr: false, ciencia: true, tech: true, mujer: false, pista: "Inventor e ingeniero clave en la corriente alterna (CA) y el electromagnetismo." }
  ];

  const RONDAS_IMPOSTOR = [
    {
      tema: "Educación Vial MOPT (Ley N.° 9078)",
      tripulantes: [
        { txt: "La velocidad máxima en Zona Escolar con estudiantes es 25 km/h.", imp: false },
        { txt: "Las motocicletas deben llevar la luz delantera encendida las 24 horas.", imp: false },
        { txt: "En una rotonda de 2 o 3 carriles tienen prioridad quienes ya circulan adentro.", imp: false },
        { txt: "Una doble línea amarilla continua permite adelantar libremente en curvas.", imp: true, raz: "FALSO: La doble línea amarilla continua prohíbe absolutamente adelantar en ambos sentidos." }
      ]
    },
    {
      tema: "Desarrollo Web & Ciberseguridad",
      tripulantes: [
        { txt: "SHA-256 genera una huella criptográfica para verificar integridad de documentos.", imp: false },
        { txt: "HTTPS cifra la comunicación web a través del puerto estándar 443.", imp: false },
        { txt: "La Ley N.° 8968 (PRODHAB) protege los datos personales en Costa Rica.", imp: false },
        { txt: "Guardar contraseñas en texto plano en el código HTML es una buena práctica.", imp: true, raz: "FALSO: Nunca se deben exponer credenciales ni datos sensibles en el frontend." }
      ]
    },
    {
      tema: "Ciencias y Electrónica MEP",
      tripulantes: [
        { txt: "Según la Ley de Ohm, la corriente eléctrica se calcula como I = V / R.", imp: false },
        { txt: "En la escala de pH, un valor de 7 corresponde a una disolución neutra.", imp: false },
        { txt: "La mitocondria produce la mayor parte de la energía ATP en la célula.", imp: false },
        { txt: "La unidad de medida de la fuerza en el Sistema Internacional es el Ohmio.", imp: true, raz: "FALSO: La fuerza se mide en Newtons (N); el Ohmio (Ω) mide resistencia eléctrica." }
      ]
    },
    {
      tema: "Historia y Cívica de Costa Rica",
      tripulantes: [
        { txt: "Costa Rica abolió el ejército como institución permanente el 1 de diciembre de 1948.", imp: false },
        { txt: "Cada 25 de julio se celebra la Anexión del Partido de Nicoya (1824).", imp: false },
        { txt: "El Tribunal Supremo de Elecciones (TSE) garantiza la pureza del sufragio.", imp: false },
        { txt: "La Batalla de Rivas se conmemora el 15 de setiembre de 1949.", imp: true, raz: "FALSO: La Batalla de Rivas fue el 11 de abril de 1856; el 15 de setiembre es la Independencia (1821)." }
      ]
    },
    {
      tema: "Contabilidad y Normas CR",
      tripulantes: [
        { txt: "La ecuación contable fundamental es Activo = Pasivo + Patrimonio.", imp: false },
        { txt: "La tarifa general estándar del IVA en Costa Rica es del 13%.", imp: false },
        { txt: "El Estado de Resultados muestra ingresos, costos y gastos de un periodo.", imp: false },
        { txt: "En contabilidad, los gastos siempre disminuyen el pasivo a cero.", imp: true, raz: "FALSO: Los gastos tienen naturaleza deudora y reducen la utilidad/patrimonio." }
      ]
    }
  ];

  function renderAdivinaQuien(stage, ganarXP) {
    let secreto = PERSONAJES_AQ[Math.floor(Math.random() * PERSONAJES_AQ.length)];
    let descartados = new Set(), preguntasHechas = [], fin = false, msg = "Haz preguntas de Sí/No para descartar sospechosos y luego haz clic en el personaje correcto.";

    function preguntar(lbl, prop) {
      if (fin) return;
      const ans = Boolean(secreto[prop]);
      preguntasHechas.push(`${lbl} → ${ans ? "SÍ ✅" : "NO ❌"}`);
      PERSONAJES_AQ.forEach((p, idx) => { if (Boolean(p[prop]) !== ans) descartados.add(idx); });
      drawAQ();
    }

    function drawAQ() {
      stage.innerHTML = `
        <div style="max-width:740px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <b style="color:#38bdf8;">🕵️ Adivina Quién Educativo (12 Personajes Clave)</b>
            <button id="aq-new" style="background:#1d4ed8;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Nueva Partida</button>
          </div>
          <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:10px;font-size:12.5px;color:#e2e8f0;margin-bottom:10px;">${msg}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
            <button data-p="cr" class="aq-q" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">🇨🇷 ¿Es de Costa Rica?</button>
            <button data-p="ciencia" class="aq-q" style="background:#0284c7;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">🔬 ¿Es de Ciencia?</button>
            <button data-p="tech" class="aq-q" style="background:#7c3aed;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">💻 ¿Es de Tecnología/Ing.?</button>
            <button data-p="mujer" class="aq-q" style="background:#db2777;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">👩 ¿Es mujer?</button>
            <button id="aq-hint" style="background:#b45309;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">💡 Pedir Pista</button>
          </div>
          ${preguntasHechas.length ? `<div style="font-size:11.5px;color:#34d399;margin-bottom:10px;">${preguntasHechas.join(" • ")}</div>` : ""}
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px;">
            ${PERSONAJES_AQ.map((p, i) => {
              const out = descartados.has(i);
              return `<button data-i="${i}" class="aq-card" ${out||fin?"disabled":""} style="background:${out?'#0f172a':'#131f33'};opacity:${out?0.35:1};border:2px solid ${out?'#1e293b':'#334155'};color:#fff;padding:12px 8px;border-radius:10px;cursor:pointer;text-align:center;">
                <div style="font-size:28px;">${p.ic}</div>
                <div style="font-size:12px;font-weight:800;margin-top:4px;">${p.nom}</div>
              </button>`;
            }).join("")}
          </div>
        </div>
      `;
      document.getElementById("aq-new").onclick = () => { secreto = PERSONAJES_AQ[Math.floor(Math.random() * PERSONAJES_AQ.length)]; descartados = new Set(); preguntasHechas = []; fin = false; msg = "Nueva partida lista. ¡Descubre al personaje secreto!"; drawAQ(); };
      document.getElementById("aq-hint").onclick = () => { msg = `💡 Pista secreta: ${secreto.pista}`; drawAQ(); };
      stage.querySelectorAll(".aq-q").forEach(b => b.onclick = () => preguntar(b.innerText, b.getAttribute("data-p")));
      stage.querySelectorAll(".aq-card").forEach(b => b.onclick = () => {
        const idx = Number(b.getAttribute("data-i"));
        const chosen = PERSONAJES_AQ[idx];
        if (chosen.nom === secreto.nom) {
          fin = true; msg = `🎉 ¡ADIVINASTE! Era ${secreto.nom} (${secreto.pista}) (+30 XP)`;
          if (ganarXP) ganarXP(30, "🕵️ Adivina Quién");
        } else {
          descartados.add(idx); msg = `❌ No es ${chosen.nom}. Sigue deduciendo.`;
        }
        drawAQ();
      });
    }
    drawAQ();
  }

  function renderImpostor(stage, ganarXP) {
    let rIdx = 0, pts = 0, feedback = "", locked = false;
    const COLS = ["#dc2626", "#2563eb", "#059669", "#d97706"];
    let curOrder = [];

    function prepRound() {
      const r = RONDAS_IMPOSTOR[rIdx % RONDAS_IMPOSTOR.length];
      curOrder = r.tripulantes.slice().sort(() => Math.random() - 0.5);
      feedback = ""; locked = false;
    }

    function drawImp() {
      const ronda = RONDAS_IMPOSTOR[rIdx % RONDAS_IMPOSTOR.length];
      const terminado = rIdx >= RONDAS_IMPOSTOR.length;
      if (terminado) {
        if (pts >= 3 && ganarXP) ganarXP(35, "🚀 Detector de Impostores");
        stage.innerHTML = `<div style="text-align:center;padding:24px;"><h2 style="margin:0 0 8px;color:#34d399;">🚀 ¡Misión Completada!</h2><p style="font-size:16px;">Impostores expulsados: <b>${pts} / ${RONDAS_IMPOSTOR.length}</b></p><button id="imp-again" style="background:#7c3aed;color:#fff;border:none;padding:11px 22px;border-radius:9px;font-weight:800;cursor:pointer;">🔄 Jugar de Nuevo</button></div>`;
        document.getElementById("imp-again").onclick = () => { rIdx = 0; pts = 0; prepRound(); drawImp(); };
        return;
      }
      stage.innerHTML = `
        <div style="max-width:720px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <b style="color:#f87171;">🚀 Impostor Educativo (Estilo Among Us) — Ronda ${rIdx + 1}/${RONDAS_IMPOSTOR.length}</b>
            <span style="font-weight:800;color:#fbbf24;">Aciertos: ${pts} • Tema: ${ronda.tema}</span>
          </div>
          <div style="background:#070d19;border:1px solid #ef4444;border-radius:10px;padding:10px;font-size:12.5px;color:#fecaca;margin-bottom:12px;">
            Hay <b>3 Tripulantes verdaderos</b> y <b>1 IMPOSTOR (afirmación falsa)</b>. ¡Vota para expulsar al Impostor!
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-bottom:12px;">
            ${curOrder.map((t, i) => `
              <button data-ii="${i}" class="imp-card" ${locked?"disabled":""} style="text-align:left;background:#070d19;border:2px solid ${locked?(t.imp?'#10b981':'#334155'):COLS[i%4]};border-left:8px solid ${COLS[i%4]};color:#fff;padding:14px;border-radius:10px;cursor:pointer;">
                <div style="font-size:11px;font-weight:900;color:#93c5fd;margin-bottom:4px;">👨‍🚀 TRIPULANTE #${i + 1}</div>
                <div style="font-size:13px;font-weight:600;line-height:1.4;">${t.txt}</div>
              </button>
            `).join("")}
          </div>
          ${feedback ? `<div style="background:#0b1322;border:1px solid #38bdf8;border-radius:10px;padding:12px;margin-bottom:10px;font-size:12.5px;color:#e2e8f0;">${feedback}</div><button id="imp-next" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Siguiente Ronda →</button>` : ""}
        </div>
      `;
      stage.querySelectorAll(".imp-card").forEach(b => b.onclick = () => {
        if (locked) return;
        locked = true;
        const chosen = curOrder[Number(b.getAttribute("data-ii"))];
        const realImp = curOrder.find(x => x.imp);
        if (chosen.imp) {
          pts++;
          feedback = `✅ <b>¡IMPOSTOR EXPULSADO!</b> ${chosen.raz}`;
        } else {
          feedback = `❌ <b>Era un tripulante inocente.</b> El Impostor era: "${realImp.txt}" — ${realImp.raz}`;
        }
        drawImp();
      });
      if (document.getElementById("imp-next")) document.getElementById("imp-next").onclick = () => { rIdx++; if (rIdx < RONDAS_IMPOSTOR.length) prepRound(); drawImp(); };
    }
    prepRound(); drawImp();
  }

  // Envolver BDS_RENDER_SALA_JUEGOS para sumar los 2 juegos virales (total 10 juegos)
  window.BDS_RENDER_SALA_JUEGOS = function (shell, ganarXP) {
    ORIG_RENDER(shell, ganarXP);
    const injectButtons = () => {
      const firstTab = shell.querySelector(".gm-tab");
      if (!firstTab || shell.querySelector("[data-gm='adivina']")) return;
      const bar = firstTab.parentElement;
      const mk = (id, lbl) => {
        const b = document.createElement("button");
        b.setAttribute("data-gm", id);
        b.className = "gm-tab";
        b.style.cssText = "background:#131f33;color:#fff;border:1px solid #334155;padding:8px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;min-height:38px;";
        b.innerText = lbl;
        b.onclick = () => {
          shell.querySelectorAll(".gm-tab").forEach(x => { x.style.background = "#131f33"; x.style.borderColor = "#334155"; });
          b.style.background = "#1d4ed8"; b.style.borderColor = "#38bdf8";
          const stage = document.getElementById("gm-stage");
          if (id === "adivina") renderAdivinaQuien(stage, ganarXP);
          else renderImpostor(stage, ganarXP);
        };
        return b;
      };
      bar.appendChild(mk("adivina", "🕵️ Adivina Quién"));
      bar.appendChild(mk("impostor", "🚀 Impostor (Among Us)"));
      const h2 = shell.querySelector("h2");
      if (h2 && h2.innerText.includes("8 Juegos")) h2.innerText = "🎮 Sala de 10 Juegos Interactivos Más Jugados";
    };
    injectButtons();
    const obs = new MutationObserver(() => injectButtons());
    obs.observe(shell, { childList: true });
  };
})();