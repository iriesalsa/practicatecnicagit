(function () {
  const REC_KEY = "bds_juegos_records_v188";

  function getRec() {
    try { return JSON.parse(localStorage.getItem(REC_KEY)) || { wordle: 0, kahoot: 0, g2048: 0, sprint: 0, memoria: 0, ahorcado: 0, conecta4: 0, ajedrez: 0 }; }
    catch { return { wordle: 0, kahoot: 0, g2048: 0, sprint: 0, memoria: 0, ahorcado: 0, conecta4: 0, ajedrez: 0 }; }
  }
  function saveRec(k, val) {
    const r = getRec();
    if (val > (r[k] || 0)) { r[k] = val; localStorage.setItem(REC_KEY, JSON.stringify(r)); }
  }

  const WORDLE_POOL = [
    { w: "NUBES", c: "Tecnología", p: "Almacenamiento en servidores remotos (Cloud)" },
    { w: "DATOS", c: "Ciberseguridad", p: "Información protegida por la Ley N.° 8968" },
    { w: "CLAVE", c: "Ciberseguridad", p: "Credencial secreta de acceso seguro" },
    { w: "REDES", c: "Soporte TI", p: "Interconexión de computadoras y servidores" },
    { w: "OHMIO", c: "Electrónica", p: "Unidad de medida de la resistencia eléctrica" },
    { w: "FLUJO", c: "Programación", p: "Secuencia lógica de pasos en un algoritmo" },
    { w: "VALOR", c: "Valores", p: "Principio ético que guía el comportamiento" },
    { w: "SALUD", c: "Ed. Física", p: "Bienestar físico, mental y social integral" },
    { w: "RITMO", c: "Música", p: "Organización de pulsos y duraciones musicales" },
    { w: "COLOR", c: "Artes", p: "Percepción visual en modelos RGB y CMYK" },
    { w: "ATOMO", c: "Química", p: "Unidad básica de la materia con protones" },
    { w: "GENES", c: "Biología", p: "Fragmentos de ADN que transmiten herencia" },
    { w: "LUCES", c: "Vial MOPT", p: "Obligatorias 24 horas en motocicletas" },
    { w: "CEBRA", c: "Vial MOPT", p: "Paso peatonal con prioridad absoluta" },
    { w: "COSTO", c: "Contabilidad", p: "Desembolso necesario para producir un bien" },
    { w: "SUMAQ", c: "Lógica", p: "Broma: usa RANGO en Excel", skip: true },
    { w: "RANGO", c: "Excel", p: "Conjunto de celdas seleccionadas en una hoja" },
    { w: "LOGIN", c: "Web", p: "Pantalla de inicio de sesión autenticado" },
    { w: "BUILD", c: "Inglés Tech", p: "Compilación de proyecto lista para producción" },
    { w: "BRAIN", c: "English", p: "Organ of thought and memory" }
  ].filter(x => !x.skip);

  const HANGMAN_POOL = [
    { w: "ALGORITMO", c: "Desarrollo Web", p: "Secuencia ordenada de pasos para resolver un problema" },
    { w: "CRIPTOGRAFIA", c: "Ciberseguridad", p: "Técnica para cifrar y proteger información con SHA-256" },
    { w: "MULTIMETRO", c: "Electrónica", p: "Instrumento para medir voltaje, corriente y ohmios" },
    { w: "FOTOSINTESIS", c: "Biología", p: "Proceso vegetal que convierte luz solar en glucosa y oxígeno" },
    { w: "ROTONDA", c: "Educación Vial", p: "Intersección circular de 2 o 3 carriles con prioridad interna" },
    { w: "PATRIMONIO", c: "Contabilidad", p: "Diferencia entre el Activo y el Pasivo de una empresa" },
    { w: "RESILIENCIA", c: "Psicología", p: "Capacidad de adaptarse y fortalecerse ante la adversidad" },
    { w: "MARIMBA", c: "Música CR", p: "Instrumento musical nacional de Costa Rica" },
    { w: "HIPOTENUSA", c: "Matemática", p: "Lado más largo de un triángulo rectángulo" },
    { w: "SOLIDARIDAD", c: "Valores", p: "Apoyo mutuo y fraterno ante la necesidad de otros" }
  ];

  const MEM_DECKS = {
    mopt: [["🛑 ALTO", "Parada 0 km/h"], ["25 km/h", "Zona Escolar"], ["🔄 Rotonda", "Prioridad interna"], ["🏍️ Moto", "Luz 24 horas"], ["🌉 Puente", "Ceder paso"], ["🚶 Cebra", "Prioridad peatón"]],
    web: [["HTML5", "Estructura"], ["CSS3", "Diseño UI"], ["JavaScript", "Lógica"], ["SQL", "Base de Datos"], ["HTTPS", "Puerto 443"], ["SHA-256", "Integridad"]],
    ciencia: [["V = I × R", "Ley de Ohm"], ["F = m × a", "2.ª Ley Newton"], ["pH = 7", "Neutro"], ["Mitocondria", "Energía ATP"], ["c² = a²+b²", "Pitágoras"], ["Na", "Sodio"]],
    ingles: [["Deadline", "Fecha límite"], ["Backup", "Respaldo"], ["Streak", "Racha diaria"], ["Password", "Contraseña"], ["Schedule", "Horario"], ["Score", "Puntaje"]]
  };

  window.BDS_RENDER_SALA_JUEGOS = function (shell, ganarXP) {
    let juego = "wordle";
    let activeCleanup = null;

    function clean() {
      if (typeof activeCleanup === "function") { try { activeCleanup(); } catch {} activeCleanup = null; }
    }

    const GAMES = [
      { id: "wordle", nom: "🟩 Wordle Educativo" },
      { id: "kahoot", nom: "⚡ Trivia Kahoot" },
      { id: "g2048",  nom: "🔢 2048 Binario" },
      { id: "sprint", nom: "🚀 Cálculo 60s" },
      { id: "memoria", nom: "🧩 Memoria" },
      { id: "ahorcado", nom: "🔤 Ahorcado" },
      { id: "conecta4", nom: "🔴 4 en Línea IA" },
      { id: "ajedrez", nom: "♟️ Ajedrez IA" }
    ];

    function renderFrame() {
      clean();
      const rec = getRec();
      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">GAMIFICACIÓN EDUCATIVA • AVANZA TU RACHA Y XP</span>
              <h2 style="margin:4px 0 0;font-size:18px;color:#fff;">🎮 Sala de 8 Juegos Interactivos Más Jugados</h2>
            </div>
            <div style="font-size:11.5px;color:#fbbf24;font-weight:800;">🏆 Récords — Kahoot: ${rec.kahoot} | 2048: ${rec.g2048} | Sprint: ${rec.sprint} | Wordle: ${rec.wordle}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${GAMES.map(g => `<button data-gm="${g.id}" class="gm-tab" style="background:${juego===g.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${juego===g.id?'#38bdf8':'#334155'};padding:8px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;min-height:38px;">${g.nom}</button>`).join("")}
          </div>
        </div>
        <div id="gm-stage" class="bds-card"></div>
      `;
      shell.querySelectorAll(".gm-tab").forEach(b => b.onclick = () => { juego = b.getAttribute("data-gm"); renderFrame(); });
      const st = document.getElementById("gm-stage");
      if (juego === "wordle") mountWordle(st);
      else if (juego === "kahoot") mountKahoot(st);
      else if (juego === "g2048") mount2048(st);
      else if (juego === "sprint") mountSprint(st);
      else if (juego === "memoria") mountMemoria(st);
      else if (juego === "ahorcado") mountAhorcado(st);
      else if (juego === "conecta4") mountConecta4(st);
      else if (juego === "ajedrez") mountAjedrez(st);
    }

    // ==================== 1. WORDLE EDUCATIVO ====================
    function mountWordle(box) {
      let pick = WORDLE_POOL[Math.floor(Math.random() * WORDLE_POOL.length)];
      let rows = [], cur = "", done = false, msg = `Pista (${pick.c}): ${pick.p}`;

      function submit() {
        if (done || cur.length !== 5) return;
        rows.push(cur);
        if (cur === pick.w) {
          done = true; msg = `🎉 ¡CORRECTO! Palabra: ${pick.w} (+25 XP)`;
          const r = getRec(); saveRec("wordle", (r.wordle || 0) + 1);
          if (ganarXP) ganarXP(25, "🟩 Maestro Wordle");
        } else if (rows.length >= 6) {
          done = true; msg = `Fin de intentos. La palabra era: ${pick.w}`;
        }
        cur = ""; drawW();
      }
      function press(k) {
        if (done) return;
        if (k === "ENTER") submit();
        else if (k === "DEL") { cur = cur.slice(0, -1); drawW(); }
        else if (/^[A-Z]$/.test(k) && cur.length < 5) { cur += k; drawW(); }
      }
      const onKey = (e) => {
        if (!document.body.contains(box)) return;
        if (e.key === "Enter") press("ENTER");
        else if (e.key === "Backspace") press("DEL");
        else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
      };
      window.addEventListener("keydown", onKey);
      activeCleanup = () => window.removeEventListener("keydown", onKey);

      function drawW() {
        const kbRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        let gridHtml = "";
        for (let r = 0; r < 6; r++) {
          const word = r < rows.length ? rows[r] : (r === rows.length ? cur : "");
          gridHtml += `<div style="display:flex;gap:6px;justify-content:center;margin-bottom:6px;">`;
          for (let c = 0; c < 5; c++) {
            const ch = word[c] || "";
            let bg = "#070d19", bd = ch ? "#38bdf8" : "#334155";
            if (r < rows.length) {
              if (ch === pick.w[c]) { bg = "#16a34a"; bd = "#22c55e"; }
              else if (pick.w.includes(ch)) { bg = "#ca8a04"; bd = "#facc15"; }
              else { bg = "#334155"; bd = "#475569"; }
            }
            gridHtml += `<div style="width:48px;height:48px;background:${bg};border:2px solid ${bd};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;">${ch}</div>`;
          }
          gridHtml += `</div>`;
        }
        box.innerHTML = `
          <div style="text-align:center;max-width:480px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <b style="color:#34d399;">🟩 Wordle Educativo (5 letras)</b>
              <button id="wd-new" style="background:#1d4ed8;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Nueva Palabra</button>
            </div>
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:9px;padding:8px;font-size:12.5px;color:#93c5fd;margin-bottom:12px;">${msg}</div>
            ${gridHtml}
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:5px;align-items:center;">
              ${kbRows.map((row, ri) => `<div style="display:flex;gap:4px;flex-wrap:nowrap;">${ri===2?`<button data-wk="ENTER" class="wk-b" style="background:#059669;color:#fff;border:none;padding:10px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">ENTER</button>`:""}${row.split("").map(l => `<button data-wk="${l}" class="wk-b" style="background:#1e293b;color:#fff;border:1px solid #334155;min-width:30px;padding:10px 6px;border-radius:6px;font-size:12.5px;font-weight:800;cursor:pointer;">${l}</button>`).join("")}${ri===2?`<button data-wk="DEL" class="wk-b" style="background:#dc2626;color:#fff;border:none;padding:10px 9px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">⌫</button>`:""}</div>`).join("")}
            </div>
          </div>
        `;
        box.querySelectorAll(".wk-b").forEach(b => b.onclick = () => press(b.getAttribute("data-wk")));
        document.getElementById("wd-new").onclick = () => { pick = WORDLE_POOL[Math.floor(Math.random() * WORDLE_POOL.length)]; rows = []; cur = ""; done = false; msg = `Pista (${pick.c}): ${pick.p}`; drawW(); };
      }
      drawW();
    }

    // ==================== 2. TRIVIA RELÁMPAGO ESTILO KAHOOT (CERO MEZCLA) ====================
    function mountKahoot(box) {
      const malla = window.BDS_MALLA_MEP || [];
      let area = malla[0] ? malla[0].id : "web";
      let items = [], idx = 0, score = 0, streak = 0, lives = 3, sec = 15, playing = false, tmr = null;
      const COLS = ["#dc2626", "#2563eb", "#d97706", "#059669"];
      const SHAPES = ["▲", "◆", "●", "■"];

      function stopT() { if (tmr) { clearInterval(tmr); tmr = null; } }
      activeCleanup = stopT;

      function startGame() {
        stopT();
        items = window.BDS_GENERAR_SIMULACRO ? window.BDS_GENERAR_SIMULACRO(area, 15, "ALL") : [];
        idx = 0; score = 0; streak = 0; lives = 3; sec = 15; playing = true;
        tmr = setInterval(() => {
          if (!playing || !document.body.contains(box)) { stopT(); return; }
          sec--;
          const bar = document.getElementById("kh-tm");
          if (bar) bar.innerText = `⏱️ ${sec}s`;
          if (sec <= 0) responder(-1);
        }, 1000);
        drawK();
      }

      function responder(optIdx) {
        const cur = items[idx];
        const ok = optIdx >= 0 && cur && cur.opts[optIdx] && cur.opts[optIdx].ok;
        if (ok) {
          streak++;
          const mult = streak >= 5 ? 5 : (streak >= 3 ? 3 : (streak >= 2 ? 2 : 1));
          score += (100 + sec * 10) * mult;
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
        } else {
          streak = 0; lives--;
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
        }
        idx++; sec = 15;
        if (lives <= 0 || idx >= items.length) {
          playing = false; stopT();
          saveRec("kahoot", score);
          if (score > 0 && ganarXP) ganarXP(Math.min(80, Math.round(score / 40)), "⚡ Trivia Relámpago");
        }
        drawK();
      }

      function drawK() {
        const cur = items[idx];
        const mult = streak >= 5 ? 5 : (streak >= 3 ? 3 : (streak >= 2 ? 2 : 1));
        if (!playing) {
          box.innerHTML = `
            <div style="text-align:center;max-width:540px;margin:0 auto;padding:10px;">
              <h3 style="margin:0 0 8px;color:#fbbf24;">⚡ Trivia Relámpago estilo Kahoot (100% Materia Exacta)</h3>
              ${score > 0 ? `<div style="background:#064e3b;border:2px solid #10b981;border-radius:12px;padding:14px;margin-bottom:12px;color:#fff;"><b>¡Partida terminada!</b><div style="font-size:26px;font-weight:900;color:#fbbf24;">${score.toLocaleString("es-CR")} pts</div></div>` : ""}
              <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;">Elige la asignatura exacta (cero mezcla):</label>
              <select id="kh-area" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:10px;border-radius:9px;font-size:13px;margin-bottom:12px;">
                ${malla.map(m => `<option value="${m.id}" ${area===m.id?"selected":""}>${m.name}</option>`).join("")}
              </select>
              <button id="kh-go" style="background:#7c3aed;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:900;cursor:pointer;">🚀 ¡Jugar Trivia Relámpago!</button>
            </div>
          `;
          document.getElementById("kh-area").onchange = (e) => { area = e.target.value; };
          document.getElementById("kh-go").onclick = startGame;
          return;
        }
        box.innerHTML = `
          <div style="max-width:720px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;background:#070d19;padding:10px 14px;border-radius:10px;">
              <span style="font-weight:900;color:#fbbf24;">🏆 ${score} pts</span>
              <span style="font-weight:800;color:#34d399;">🔥 Racha: ${streak} (×${mult})</span>
              <span style="font-weight:800;color:#f87171;">${"❤️".repeat(lives)}</span>
              <span id="kh-tm" style="font-family:monospace;font-size:16px;font-weight:900;color:#38bdf8;">⏱️ ${sec}s</span>
            </div>
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:16px;margin-bottom:12px;text-align:center;">
              <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">Pregunta ${idx + 1} / ${items.length} • ${cur.d}</div>
              <h3 style="margin:0;font-size:16.5px;line-height:1.4;">${cur.q}</h3>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
              ${cur.opts.map((o, i) => `<button data-ko="${i}" class="kh-opt" style="background:${COLS[i%4]};color:#fff;border:none;padding:15px 14px;border-radius:10px;font-size:13.5px;font-weight:800;cursor:pointer;text-align:left;min-height:60px;">${SHAPES[i%4]} &nbsp;${o.txt}</button>`).join("")}
            </div>
          </div>
        `;
        box.querySelectorAll(".kh-opt").forEach(b => b.onclick = () => responder(Number(b.getAttribute("data-ko"))));
      }
      drawK();
    }

    // ==================== 3. 2048 BINARIO (POTENCIAS DE 2) ====================
    function mount2048(box) {
      let g = Array.from({ length: 4 }, () => [0, 0, 0, 0]), pts = 0;
      const TILE_COL = { 0: "#1e293b", 2: "#0284c7", 4: "#0369a1", 8: "#0d9488", 16: "#059669", 32: "#65a30d", 64: "#ca8a04", 128: "#d97706", 256: "#ea580c", 512: "#dc2626", 1024: "#9333ea", 2048: "#db2777" };
      function spawn() {
        const emp = [];
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) emp.push([r, c]);
        if (!emp.length) return;
        const [r, c] = emp[Math.floor(Math.random() * emp.length)];
        g[r][c] = Math.random() < 0.9 ? 2 : 4;
      }
      function slideLine(line) {
        let arr = line.filter(v => v !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) { arr[i] *= 2; pts += arr[i]; arr.splice(i + 1, 1); }
        }
        while (arr.length < 4) arr.push(0);
        return arr;
      }
      function move(dir) {
        const before = JSON.stringify(g);
        if (dir === "L") g = g.map(slideLine);
        if (dir === "R") g = g.map(r => slideLine(r.slice().reverse()).reverse());
        if (dir === "U" || dir === "D") {
          for (let c = 0; c < 4; c++) {
            let col = [g[0][c], g[1][c], g[2][c], g[3][c]];
            if (dir === "D") col.reverse();
            col = slideLine(col);
            if (dir === "D") col.reverse();
            for (let r = 0; r < 4; r++) g[r][c] = col[r];
          }
        }
        if (JSON.stringify(g) !== before) {
          spawn();
          saveRec("g2048", pts);
          if (pts >= 256 && ganarXP) ganarXP(15, "🔢 2048 Binario");
        }
        draw2048();
      }
      const onK = (e) => {
        if (!document.body.contains(box)) return;
        const map = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" };
        if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
      };
      window.addEventListener("keydown", onK);
      activeCleanup = () => window.removeEventListener("keydown", onK);

      function draw2048() {
        box.innerHTML = `
          <div style="text-align:center;max-width:360px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <b style="color:#38bdf8;">🔢 2048 Binario • Pts: ${pts}</b>
              <button id="g2-rst" style="background:#1d4ed8;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Reiniciar</button>
            </div>
            <div id="g2-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:#070d19;padding:10px;border-radius:12px;border:2px solid #334155;touch-action:none;">
              ${g.flat().map(v => `<div style="aspect-ratio:1;background:${TILE_COL[v]||'#7c3aed'};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:${v>=1024?18:22}px;font-weight:900;color:#fff;">${v||""}</div>`).join("")}
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,64px);gap:6px;justify-content:center;margin-top:12px;">
              <div></div><button data-mv="U" class="g2-btn" style="background:#1e3a8a;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:900;cursor:pointer;">▲</button><div></div>
              <button data-mv="L" class="g2-btn" style="background:#1e3a8a;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:900;cursor:pointer;">◀</button>
              <button data-mv="D" class="g2-btn" style="background:#1e3a8a;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:900;cursor:pointer;">▼</button>
              <button data-mv="R" class="g2-btn" style="background:#1e3a8a;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:900;cursor:pointer;">▶</button>
            </div>
          </div>
        `;
        box.querySelectorAll(".g2-btn").forEach(b => b.onclick = () => move(b.getAttribute("data-mv")));
        document.getElementById("g2-rst").onclick = () => { g = Array.from({ length: 4 }, () => [0,0,0,0]); pts = 0; spawn(); spawn(); draw2048(); };
        let sx = 0, sy = 0;
        const brd = document.getElementById("g2-board");
        brd.ontouchstart = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
        brd.ontouchend = (e) => {
          const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return;
          move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : (dy > 0 ? "D" : "U"));
        };
      }
      spawn(); spawn(); draw2048();
    }

    // ==================== 4. CÁLCULO MENTAL RELÁMPAGO (60s) ====================
    function mountSprint(box) {
      let running = false, sec = 60, pts = 0, racha = 0, q = null, tmr = null;
      function stopT() { if (tmr) { clearInterval(tmr); tmr = null; } }
      activeCleanup = stopT;

      function nextQ() {
        const ops = racha < 5 ? ["+", "-"] : ["+", "-", "×"];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const a = Math.floor(Math.random() * (op === "×" ? 12 : 25)) + 3;
        const b = Math.floor(Math.random() * (op === "×" ? 11 : 20)) + 2;
        const ans = op === "+" ? a + b : (op === "-" ? a - b : a * b);
        const set = new Set([ans]);
        while (set.size < 4) set.add(ans + (Math.floor(Math.random() * 11) - 5));
        const opts = Array.from(set).sort(() => Math.random() - 0.5);
        q = { txt: `${a} ${op} ${b} = ?`, ans, opts };
      }
      function start() {
        stopT(); running = true; sec = 60; pts = 0; racha = 0; nextQ();
        tmr = setInterval(() => {
          if (!running || !document.body.contains(box)) { stopT(); return; }
          sec--;
          const el = document.getElementById("sp-tm"); if (el) el.innerText = `⏱️ ${sec}s`;
          if (sec <= 0) { running = false; stopT(); saveRec("sprint", pts); if (pts > 0 && ganarXP) ganarXP(Math.min(60, pts * 2), "🚀 Cálculo Relámpago"); drawS(); }
        }, 1000);
        drawS();
      }
      function drawS() {
        if (!running) {
          box.innerHTML = `<div style="text-align:center;padding:18px;"><h3 style="margin:0 0 8px;color:#38bdf8;">🚀 Cálculo Mental Relámpago (60 segundos)</h3>${pts > 0 ? `<p style="font-size:20px;font-weight:900;color:#34d399;">Puntaje final: ${pts} aciertos</p>` : `<p style="font-size:13px;color:#94a3b8;">Operaciones aleatorias dinámicas (5+7, 9×8...). ¡Sube tu racha!</p>`}<button id="sp-go" style="background:#059669;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:900;cursor:pointer;">▶ Iniciar Sprint 60s</button></div>`;
          document.getElementById("sp-go").onclick = start;
          return;
        }
        box.innerHTML = `
          <div style="text-align:center;max-width:440px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;background:#070d19;padding:10px 14px;border-radius:10px;margin-bottom:14px;font-weight:900;">
              <span style="color:#34d399;">✅ ${pts}</span><span style="color:#fbbf24;">🔥 Racha ${racha}</span><span id="sp-tm" style="color:#38bdf8;">⏱️ ${sec}s</span>
            </div>
            <div style="font-size:38px;font-weight:900;margin:16px 0;color:#fff;">${q.txt}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              ${q.opts.map(v => `<button data-sv="${v}" class="sp-o" style="background:#1d4ed8;color:#fff;border:none;padding:16px;border-radius:10px;font-size:22px;font-weight:900;cursor:pointer;">${v}</button>`).join("")}
            </div>
          </div>
        `;
        box.querySelectorAll(".sp-o").forEach(b => b.onclick = () => {
          if (Number(b.getAttribute("data-sv")) === q.ans) { pts++; racha++; } else { racha = 0; }
          nextQ(); drawS();
        });
      }
      drawS();
    }

    // ==================== 5. MEMORIA DE PARES ====================
    function mountMemoria(box) {
      let deckKey = "mopt", cards = [], open = [], matched = new Set(), moves = 0, lock = false;
      function init() {
        const pairs = MEM_DECKS[deckKey];
        cards = [];
        pairs.forEach(([a, b], i) => { cards.push({ pid: i, txt: a }, { pid: i, txt: b }); });
        cards.sort(() => Math.random() - 0.5);
        open = []; matched = new Set(); moves = 0; lock = false;
        drawM();
      }
      function drawM() {
        box.innerHTML = `
          <div style="max-width:560px;margin:0 auto;text-align:center;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                ${[["mopt","🚦 MOPT"],["web","💻 Web"],["ciencia","🔬 Ciencia"],["ingles","🇺🇸 Inglés"]].map(([k,l]) => `<button data-dk="${k}" class="mm-dk" style="background:${deckKey===k?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
              </div>
              <span style="font-size:12px;font-weight:800;color:#fbbf24;">Movimientos: ${moves} | Pares: ${matched.size}/6</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
              ${cards.map((c, i) => {
                const show = open.includes(i) || matched.has(c.pid);
                return `<button data-ci="${i}" class="mm-c" style="min-height:76px;background:${matched.has(c.pid)?'#064e3b':(show?'#1d4ed8':'#131f33')};border:2px solid ${show?'#38bdf8':'#334155'};color:#fff;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;padding:6px;">${show ? c.txt : "🦉"}</button>`;
              }).join("")}
            </div>
            ${matched.size === 6 ? `<div style="margin-top:12px;color:#34d399;font-weight:900;">🎉 ¡Tablero completado en ${moves} movimientos! (+25 XP)</div>` : ""}
          </div>
        `;
        box.querySelectorAll(".mm-dk").forEach(b => b.onclick = () => { deckKey = b.getAttribute("data-dk"); init(); });
        box.querySelectorAll(".mm-c").forEach(b => b.onclick = () => {
          const i = Number(b.getAttribute("data-ci"));
          if (lock || open.includes(i) || matched.has(cards[i].pid)) return;
          open.push(i); drawM();
          if (open.length === 2) {
            moves++; lock = true;
            const [a, b2] = open;
            if (cards[a].pid === cards[b2].pid) {
              matched.add(cards[a].pid); open = []; lock = false;
              if (matched.size === 6) { saveRec("memoria", Math.max(1, 30 - moves)); if (ganarXP) ganarXP(25, "🧩 Memoria"); }
              drawM();
            } else {
              setTimeout(() => { open = []; lock = false; drawM(); }, 700);
            }
          }
        });
      }
      init();
    }

    // ==================== 6. AHORCADO ACADÉMICO ====================
    function mountAhorcado(box) {
      let pick = HANGMAN_POOL[Math.floor(Math.random() * HANGMAN_POOL.length)], used = new Set(), errs = 0;
      function drawH() {
        const masked = pick.w.split("").map(ch => used.has(ch) ? ch : "_").join(" ");
        const won = !masked.includes("_"), lost = errs >= 6;
        if (won && ganarXP) { saveRec("ahorcado", (getRec().ahorcado || 0) + 1); ganarXP(20, "🔤 Ahorcado"); }
        box.innerHTML = `
          <div style="text-align:center;max-width:520px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <b style="color:#38bdf8;">🔤 Ahorcado (${pick.c}) • Vidas: ${"❤️".repeat(Math.max(0, 6 - errs))}</b>
              <button id="ah-new" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Otra Palabra</button>
            </div>
            <div style="background:#070d19;border:1px solid #334155;padding:9px;border-radius:9px;font-size:12.5px;color:#93c5fd;margin-bottom:14px;">💡 Pista: ${pick.p}</div>
            <div style="font-family:monospace;font-size:28px;font-weight:900;letter-spacing:4px;margin-bottom:14px;color:${won?'#34d399':(lost?'#f87171':'#fff')};">${lost ? pick.w : masked}</div>
            ${won ? `<div style="color:#34d399;font-weight:800;margin-bottom:10px;">🎉 ¡Adivinaste! (+20 XP)</div>` : (lost ? `<div style="color:#f87171;font-weight:800;margin-bottom:10px;">Intenta con una nueva palabra.</div>` : "")}
            <div style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;">
              ${"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("").map(l => `<button data-hl="${l}" class="ah-l" ${used.has(l)||won||lost?"disabled":""} style="min-width:34px;padding:9px 6px;border-radius:7px;border:none;background:${used.has(l)?(pick.w.includes(l)?'#059669':'#7f1d1d'):'#1e293b'};color:#fff;font-weight:800;cursor:pointer;">${l}</button>`).join("")}
            </div>
          </div>
        `;
        document.getElementById("ah-new").onclick = () => { pick = HANGMAN_POOL[Math.floor(Math.random() * HANGMAN_POOL.length)]; used = new Set(); errs = 0; drawH(); };
        box.querySelectorAll(".ah-l").forEach(b => b.onclick = () => {
          const l = b.getAttribute("data-hl"); used.add(l); if (!pick.w.includes(l)) errs++; drawH();
        });
      }
      drawH();
    }

    // ==================== 7. CUATRO EN LÍNEA vs IA ====================
    function mountConecta4(box) {
      let bd = Array.from({ length: 6 }, () => Array(7).fill(0)), win = 0;
      function checkWin(p) {
        for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
          if (c <= 3 && [0,1,2,3].every(k => bd[r][c+k] === p)) return true;
          if (r <= 2 && [0,1,2,3].every(k => bd[r+k][c] === p)) return true;
          if (r <= 2 && c <= 3 && [0,1,2,3].every(k => bd[r+k][c+k] === p)) return true;
          if (r >= 3 && c <= 3 && [0,1,2,3].every(k => bd[r-k][c+k] === p)) return true;
        }
        return false;
      }
      function drop(col, p) {
        for (let r = 5; r >= 0; r--) if (bd[r][col] === 0) { bd[r][col] = p; return r; }
        return -1;
      }
      function aiMove() {
        const valid = [0,1,2,3,4,5,6].filter(c => bd[0][c] === 0);
        if (!valid.length) return;
        for (const p of [2, 1]) {
          for (const c of valid) {
            const r = drop(c, p);
            const w = checkWin(p);
            bd[r][c] = 0;
            if (w) { drop(c, 2); return; }
          }
        }
        drop(valid.includes(3) ? 3 : valid[Math.floor(Math.random() * valid.length)], 2);
      }
      function drawC4() {
        box.innerHTML = `
          <div style="text-align:center;max-width:390px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <b style="color:#fbbf24;">🔴 Cuatro en Línea vs IA ${win===1?"(¡GANASTE! +35 XP)":(win===2?"(Ganó la IA)":"")}</b>
              <button id="c4-r" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Nuevo</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;background:#1e3a8a;padding:9px;border-radius:12px;">
              ${bd.map((row, r) => row.map((v, c) => `<button data-cc="${c}" class="c4-b" style="aspect-ratio:1;border-radius:50%;border:none;background:${v===1?'#ef4444':(v===2?'#facc15':'#0b1322')};cursor:pointer;"></button>`).join("")).join("")}
            </div>
          </div>
        `;
        document.getElementById("c4-r").onclick = () => { bd = Array.from({ length: 6 }, () => Array(7).fill(0)); win = 0; drawC4(); };
        box.querySelectorAll(".c4-b").forEach(b => b.onclick = () => {
          if (win) return;
          if (drop(Number(b.getAttribute("data-cc")), 1) < 0) return;
          if (checkWin(1)) { win = 1; saveRec("conecta4", (getRec().conecta4 || 0) + 1); if (ganarXP) ganarXP(35, "🔴 4 en Línea"); drawC4(); return; }
          aiMove();
          if (checkWin(2)) win = 2;
          drawC4();
        });
      }
      drawC4();
    }

    // ==================== 8. AJEDREZ RÁPIDO vs IA ====================
    function mountAjedrez(box) {
      const INIT = [
        ["r","n","b","q","k","b","n","r"],
        ["p","p","p","p","p","p","p","p"],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["P","P","P","P","P","P","P","P"],
        ["R","N","B","Q","K","B","N","R"]
      ];
      const SYM = { r:"♜", n:"♞", b:"♝", q:"♛", k:"♚", p:"♟", R:"♖", N:"♘", B:"♗", Q:"♕", K:"♔", P:"♙" };
      const VAL = { p:1, n:3, b:3, r:5, q:9, k:99 };
      let bd = INIT.map(r => r.slice()), sel = null, status = "Tu turno (Blancas)";

      const isW = (p) => p && p === p.toUpperCase();
      const isB = (p) => p && p === p.toLowerCase();

      function movesFor(r, c) {
        const p = bd[r][c]; if (!p) return [];
        const white = isW(p), t = p.toLowerCase(), out = [];
        const okT = (nr, nc) => nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!bd[nr][nc] || (white ? isB(bd[nr][nc]) : isW(bd[nr][nc])));
        if (t === "p") {
          const d = white ? -1 : 1;
          if (r + d >= 0 && r + d < 8 && !bd[r + d][c]) {
            out.push([r + d, c]);
            if ((white && r === 6) || (!white && r === 1)) if (!bd[r + 2 * d][c]) out.push([r + 2 * d, c]);
          }
          [-1, 1].forEach(dc => {
            const nr = r + d, nc = c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && bd[nr][nc] && (white ? isB(bd[nr][nc]) : isW(bd[nr][nc]))) out.push([nr, nc]);
          });
        } else if (t === "n") {
          [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => { if (okT(r+dr, c+dc)) out.push([r+dr, c+dc]); });
        } else if (t === "k") {
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && okT(r+dr, c+dc)) out.push([r+dr, c+dc]);
        } else {
          const dirs = t === "r" ? [[-1,0],[1,0],[0,-1],[0,1]] : (t === "b" ? [[-1,-1],[-1,1],[1,-1],[1,1]] : [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]);
          dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              if (!bd[nr][nc]) out.push([nr, nc]);
              else { if (white ? isB(bd[nr][nc]) : isW(bd[nr][nc])) out.push([nr, nc]); break; }
              nr += dr; nc += dc;
            }
          });
        }
        return out;
      }

      function aiTurn() {
        const all = [];
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (isB(bd[r][c])) {
          movesFor(r, c).forEach(([nr, nc]) => {
            const cap = bd[nr][nc] ? (VAL[bd[nr][nc].toLowerCase()] || 1) * 10 : 0;
            all.push({ r, c, nr, nc, sc: cap + Math.random() });
          });
        }
        if (!all.length) { status = "🎉 ¡Ganaste! (+40 XP)"; if (ganarXP) ganarXP(40, "♟️ Ajedrez FIDE"); return; }
        all.sort((a, b) => b.sc - a.sc);
        const mv = all[0];
        const eaten = bd[mv.nr][mv.nc];
        bd[mv.nr][mv.nc] = (bd[mv.r][mv.c] === "p" && mv.nr === 7) ? "q" : bd[mv.r][mv.c];
        bd[mv.r][mv.c] = "";
        status = eaten === "K" ? "Jaque Mate de la IA. Intenta de nuevo." : "Tu turno (Blancas)";
      }

      function drawCh() {
        const legal = sel ? movesFor(sel[0], sel[1]).map(([r, c]) => `${r},${c}`) : [];
        box.innerHTML = `
          <div style="text-align:center;max-width:400px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <b style="color:#38bdf8;">♟️ Ajedrez Rápido vs IA — ${status}</b>
              <button id="ch-r" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Reiniciar</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(8,1fr);border:2px solid #334155;border-radius:8px;overflow:hidden;">
              ${bd.map((row, r) => row.map((p, c) => {
                const dark = (r + c) % 2 === 1;
                const isSel = sel && sel[0] === r && sel[1] === c;
                const isLeg = legal.includes(`${r},${c}`);
                const bg = isSel ? "#2563eb" : (isLeg ? "#059669" : (dark ? "#334155" : "#cbd5e1"));
                return `<button data-rc="${r},${c}" class="ch-sq" style="aspect-ratio:1;border:none;background:${bg};font-size:24px;line-height:1;cursor:pointer;color:${isW(p)?'#ffffff':'#0f172a'};text-shadow:${isW(p)?'0 1px 3px #000':'none'};">${SYM[p]||""}</button>`;
              }).join("")).join("")}
            </div>
          </div>
        `;
        document.getElementById("ch-r").onclick = () => { bd = INIT.map(r => r.slice()); sel = null; status = "Tu turno (Blancas)"; drawCh(); };
        box.querySelectorAll(".ch-sq").forEach(b => b.onclick = () => {
          const [r, c] = b.getAttribute("data-rc").split(",").map(Number);
          if (sel && legal.includes(`${r},${c}`)) {
            const eaten = bd[r][c];
            bd[r][c] = (bd[sel[0]][sel[1]] === "P" && r === 0) ? "Q" : bd[sel[0]][sel[1]];
            bd[sel[0]][sel[1]] = "";
            sel = null;
            if (eaten === "k") { status = "🎉 ¡JAQUE MATE! (+40 XP)"; saveRec("ajedrez", (getRec().ajedrez || 0) + 1); if (ganarXP) ganarXP(40, "♟️ Ajedrez FIDE"); }
            else aiTurn();
            drawCh();
          } else if (isW(bd[r][c])) {
            sel = [r, c]; drawCh();
          } else { sel = null; drawCh(); }
        });
      }
      drawCh();
    }

    renderFrame();
  };
})();