(function () {
  window.BDS_RENDER_SALA_JUEGOS = function (container, onGanarXP) {
    let tab = "ajedrez";

    function drawShell() {
      container.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#d97706;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:99px;">SALA DE JUEGOS EDUCATIVOS • CTP MERCEDES NORTE</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#f8fafc;">Entrenamiento Cognitivo, Estrategia FIDE y Lógica</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${[
                { id: "ajedrez", lbl: "♟️ Ajedrez FIDE" },
                { id: "damas", lbl: "⚫ Damas" },
                { id: "memoria", lbl: "🧠 Memoria Técnica" },
                { id: "calculo", lbl: "⚡ Cálculo 60s" },
                { id: "anagrama", lbl: "🔤 Scrabble Técnico" },
                { id: "vial", lbl: "🚦 Reto Vial MOPT" }
              ].map(t => `<button data-gtab="${t.id}" class="g-tab-btn" style="background:${tab===t.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${tab===t.id?'#38bdf8':'#26354d'};padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${t.lbl}</button>`).join("")}
            </div>
          </div>
          <div id="bds-game-stage"></div>
        </div>
      `;
      container.querySelectorAll(".g-tab-btn").forEach(b => {
        b.onclick = () => { tab = b.getAttribute("data-gtab"); drawShell(); };
      });
      const stage = document.getElementById("bds-game-stage");
      if (tab === "ajedrez") renderAjedrezReal(stage, onGanarXP);
      else if (tab === "damas") renderDamas(stage, onGanarXP);
      else if (tab === "memoria") renderMemoria(stage, onGanarXP);
      else if (tab === "calculo") renderCalculo(stage, onGanarXP);
      else if (tab === "anagrama") renderAnagrama(stage, onGanarXP);
      else renderRetoVial(stage, onGanarXP);
    }
    drawShell();
  };

  // ==================== 1. AJEDREZ FIDE REAL (REGLAS LEGALES + IA CPU) ====================
  function renderAjedrezReal(stage, onGanarXP) {
    const GLYPH = { wp:"♙", wr:"♖", wn:"♘", wb:"♗", wq:"♕", wk:"♔", bp:"♟", br:"♜", bn:"♞", bb:"♝", bq:"♛", bk:"♚" };
    const VAL = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
    let vsCPU = true;
    let turn = "w";
    let sel = null;
    let legal = [];
    let history = [];
    let moveLog = [];
    let gameOver = false;

    function initBoard() {
      return [
        ["br","bn","bb","bq","bk","bb","bn","br"],
        ["bp","bp","bp","bp","bp","bp","bp","bp"],
        ["","","","","","","",""],["","","","","","","",""],
        ["","","","","","","",""],["","","","","","","",""],
        ["wp","wp","wp","wp","wp","wp","wp","wp"],
        ["wr","wn","wb","wq","wk","wb","wn","wr"]
      ];
    }
    let board = initBoard();

    function inB(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
    function colorOf(p) { return p ? p[0] : null; }

    function pseudoMoves(b, r, c) {
      const p = b[r][c]; if (!p) return [];
      const col = p[0], t = p[1], opp = col === "w" ? "b" : "w", ms = [];
      const addSlide = (dirs) => {
        dirs.forEach(([dr, dc]) => {
          let nr = r + dr, nc = c + dc;
          while (inB(nr, nc)) {
            if (!b[nr][nc]) ms.push([nr, nc]);
            else { if (colorOf(b[nr][nc]) === opp) ms.push([nr, nc]); break; }
            nr += dr; nc += dc;
          }
        });
      };
      if (t === "p") {
        const dir = col === "w" ? -1 : 1, start = col === "w" ? 6 : 1;
        if (inB(r + dir, c) && !b[r + dir][c]) {
          ms.push([r + dir, c]);
          if (r === start && !b[r + 2 * dir][c]) ms.push([r + 2 * dir, c]);
        }
        [-1, 1].forEach(dc => {
          if (inB(r + dir, c + dc) && colorOf(b[r + dir][c + dc]) === opp) ms.push([r + dir, c + dc]);
        });
      } else if (t === "r") addSlide([[1,0],[-1,0],[0,1],[0,-1]]);
      else if (t === "b") addSlide([[1,1],[1,-1],[-1,1],[-1,-1]]);
      else if (t === "q") addSlide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
      else if (t === "n") {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (inB(nr, nc) && colorOf(b[nr][nc]) !== col) ms.push([nr, nc]);
        });
      } else if (t === "k") {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr, nc = c + dc;
          if (inB(nr, nc) && colorOf(b[nr][nc]) !== col) ms.push([nr, nc]);
        }
      }
      return ms;
    }

    function isKingInCheck(b, col) {
      let kr = -1, kc = -1;
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (b[r][c] === col + "k") { kr = r; kc = c; }
      if (kr === -1) return true;
      const opp = col === "w" ? "b" : "w";
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        if (colorOf(b[r][c]) === opp) {
          if (pseudoMoves(b, r, c).some(([mr, mc]) => mr === kr && mc === kc)) return true;
        }
      }
      return false;
    }

    function legalMoves(b, r, c) {
      const p = b[r][c]; if (!p) return [];
      const col = p[0];
      return pseudoMoves(b, r, c).filter(([nr, nc]) => {
        const cp = b.map(row => [...row]);
        cp[nr][nc] = cp[r][c]; cp[r][c] = "";
        return !isKingInCheck(cp, col);
      });
    }

    function allLegalMoves(b, col) {
      const res = [];
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        if (colorOf(b[r][c]) === col) {
          legalMoves(b, r, c).forEach(([nr, nc]) => res.push({ fr: r, fc: c, tr: nr, tc: nc }));
        }
      }
      return res;
    }

    function applyMove(fr, fc, tr, tc) {
      history.push(board.map(r => [...r]));
      const piece = board[fr][fc];
      const captured = board[tr][tc];
      board[tr][tc] = piece;
      board[fr][fc] = "";
      if (piece === "wp" && tr === 0) board[tr][tc] = "wq";
      if (piece === "bp" && tr === 7) board[tr][tc] = "bq";
      const note = `${GLYPH[piece]} ${String.fromCharCode(97 + fc)}${8 - fr}${captured ? "×" : "→"}${String.fromCharCode(97 + tc)}${8 - tr}`;
      moveLog.push(note);
      if (captured && piece[0] === "w" && onGanarXP) onGanarXP(10);
      turn = turn === "w" ? "b" : "w";
      sel = null; legal = [];
      const nextMoves = allLegalMoves(board, turn);
      if (nextMoves.length === 0) {
        gameOver = true;
        if (turn === "b" && onGanarXP) onGanarXP(50, "♟️ Victoria FIDE");
      }
      paint();
      if (!gameOver && vsCPU && turn === "b") setTimeout(cpuMove, 320);
    }

    function cpuMove() {
      const moves = allLegalMoves(board, "b");
      if (!moves.length) return;
      let bestScore = -99999, best = moves[0];
      moves.forEach(m => {
        const cap = board[m.tr][m.tc];
        let score = cap ? VAL[cap[1]] * 10 : 0;
        if (m.tr >= 3 && m.tr <= 4 && m.tc >= 2 && m.tc <= 5) score += 6;
        score += Math.random() * 4;
        if (score > bestScore) { bestScore = score; best = m; }
      });
      applyMove(best.fr, best.fc, best.tr, best.tc);
    }

    function paint() {
      const inChk = isKingInCheck(board, turn);
      const statusTxt = gameOver
        ? (inChk ? `🏆 ¡Jaque Mate! Ganaron las ${turn === "w" ? "Negras" : "Blancas"}` : "🤝 Tablas por ahogado")
        : `Turno: ${turn === "w" ? "⬜ Blancas" : "⬛ Negras"}${inChk ? " — ⚠️ ¡JAQUE!" : ""}`;

      stage.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start;">
          <div style="text-align:center;">
            <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
              <button id="ch-mode" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">Modo: ${vsCPU ? "🤖 vs IA CPU" : "👥 2 Jugadores"}</button>
              <button id="ch-undo" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">↩️ Deshacer</button>
              <button id="ch-reset" style="background:#1d4ed8;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🔄 Reiniciar</button>
            </div>
            <div style="font-size:13px;font-weight:800;color:${inChk ? '#f87171' : '#34d399'};margin-bottom:8px;">${statusTxt}</div>
            <div id="ch-board" style="display:grid;grid-template-columns:repeat(8,minmax(36px,48px));justify-content:center;border:3px solid #334155;border-radius:8px;overflow:hidden;width:fit-content;margin:0 auto;"></div>
          </div>
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
            <h4 style="margin:0 0 8px;color:#38bdf8;font-size:13.5px;">📜 Registro de Jugadas (${moveLog.length})</h4>
            <div style="max-height:290px;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:12px;color:#cbd5e1;">
              ${moveLog.length ? moveLog.map((m, i) => `<div style="background:#0b1322;padding:5px 8px;border-radius:6px;border:1px solid #1e293b;"><b>${i + 1}.</b> ${m}</div>`).join("") : `<div style="grid-column:1/-1;color:#64748b;">Selecciona una pieza blanca para iniciar la partida. Las casillas legales se iluminan en verde.</div>`}
            </div>
          </div>
        </div>
      `;

      const bEl = document.getElementById("ch-board");
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = document.createElement("div");
          const isLight = (r + c) % 2 === 0;
          const isSel = sel && sel.r === r && sel.c === c;
          const isLeg = legal.some(([lr, lc]) => lr === r && lc === c);
          const bg = isSel ? "#d97706" : (isLeg ? "#059669" : (isLight ? "#cbd5e1" : "#334155"));
          const p = board[r][c];
          const pColor = p && p[0] === "w" ? "#ffffff" : "#020617";
          const shadow = p && p[0] === "w" ? "0 1px 3px #000" : "0 1px 1px rgba(255,255,255,0.4)";
          sq.style.cssText = `aspect-ratio:1/1;background:${bg};display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;user-select:none;color:${pColor};text-shadow:${shadow};position:relative;`;
          sq.innerText = p ? GLYPH[p] : (isLeg ? "•" : "");
          sq.onclick = () => {
            if (gameOver || (vsCPU && turn === "b")) return;
            if (isLeg && sel) { applyMove(sel.r, sel.c, r, c); return; }
            if (p && colorOf(p) === turn) { sel = { r, c }; legal = legalMoves(board, r, c); paint(); }
            else { sel = null; legal = []; paint(); }
          };
          bEl.appendChild(sq);
        }
      }

      document.getElementById("ch-mode").onclick = () => { vsCPU = !vsCPU; board = initBoard(); turn = "w"; sel = null; legal = []; history = []; moveLog = []; gameOver = false; paint(); };
      document.getElementById("ch-reset").onclick = () => { board = initBoard(); turn = "w"; sel = null; legal = []; history = []; moveLog = []; gameOver = false; paint(); };
      document.getElementById("ch-undo").onclick = () => {
        if (!history.length) return;
        board = history.pop(); moveLog.pop();
        if (vsCPU && history.length && turn === "w") { board = history.pop(); moveLog.pop(); }
        else turn = turn === "w" ? "b" : "w";
        gameOver = false; sel = null; legal = []; paint();
      };
    }
    paint();
  }

  // ==================== 2. DAMAS (CHECKERS) ====================
  function renderDamas(stage, onGanarXP) {
    let b = Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 1 ? (r < 3 ? "b" : (r > 4 ? "w" : "")) : "")));
    let turn = "w", sel = null, msg = "Turno de Fichas Azules (Abajo)";

    function paint() {
      stage.innerHTML = `
        <div style="text-align:center;">
          <div style="margin-bottom:8px;font-size:13px;font-weight:800;color:#38bdf8;">${msg}</div>
          <div id="dm-grid" style="display:grid;grid-template-columns:repeat(8,minmax(36px,46px));justify-content:center;border:3px solid #334155;border-radius:8px;overflow:hidden;width:fit-content;margin:0 auto;"></div>
          <button id="dm-rst" style="margin-top:10px;background:#1d4ed8;color:#fff;border:none;padding:7px 14px;border-radius:7px;font-weight:700;cursor:pointer;">🔄 Reiniciar Damas</button>
        </div>
      `;
      const g = document.getElementById("dm-grid");
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
        const sq = document.createElement("div");
        const dark = (r + c) % 2 === 1;
        const isSel = sel && sel.r === r && sel.c === c;
        sq.style.cssText = `aspect-ratio:1/1;background:${isSel ? '#d97706' : (dark ? '#1e293b' : '#cbd5e1')};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;`;
        const p = b[r][c];
        if (p) sq.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${p[0]==='w'?'#0284c7':'#dc2626'};border:2px solid #fff;font-size:13px;color:#fff;">${p.length>1?'👑':''}</span>`;
        sq.onclick = () => {
          if (p && p[0] === turn) { sel = { r, c }; paint(); return; }
          if (sel && dark && !p) {
            const dr = r - sel.r, dc = c - sel.c, sp = b[sel.r][sel.c];
            const dirOk = sp.length > 1 || (turn === "w" ? dr < 0 : dr > 0);
            if (Math.abs(dr) === 1 && Math.abs(dc) === 1 && dirOk) {
              b[r][c] = (r === 0 && turn === "w") || (r === 7 && turn === "b") ? turn + "K" : sp;
              b[sel.r][sel.c] = ""; sel = null; turn = turn === "w" ? "b" : "w";
              msg = `Turno de Fichas ${turn === "w" ? "Azules" : "Rojas"}`; paint();
            } else if (Math.abs(dr) === 2 && Math.abs(dc) === 2 && dirOk) {
              const mr = sel.r + dr / 2, mc = sel.c + dc / 2;
              if (b[mr][mc] && b[mr][mc][0] !== turn) {
                b[mr][mc] = "";
                b[r][c] = (r === 0 && turn === "w") || (r === 7 && turn === "b") ? turn + "K" : sp;
                b[sel.r][sel.c] = ""; sel = null; turn = turn === "w" ? "b" : "w";
                if (onGanarXP) onGanarXP(15);
                msg = `¡Captura (+15 XP)! Turno de Fichas ${turn === "w" ? "Azules" : "Rojas"}`; paint();
              }
            }
          }
        };
        g.appendChild(sq);
      }
      document.getElementById("dm-rst").onclick = () => renderDamas(stage, onGanarXP);
    }
    paint();
  }

  // ==================== 3. MEMORIA TÉCNICA ====================
  function renderMemoria(stage, onGanarXP) {
    const pares = ["HTML5", "SHA-256", "React", "IVA 13%", "Ley Ohm", "SQL", "VLAN", "Kaizen"];
    let deck = [...pares, ...pares].sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, v, open: false, done: false }));
    let pick = [], moves = 0;

    function paint() {
      const win = deck.every(c => c.done);
      stage.innerHTML = `
        <div style="text-align:center;">
          <div style="font-size:13px;font-weight:700;color:${win?'#34d399':'#38bdf8'};margin-bottom:10px;">
            ${win ? `🏆 ¡Completado en ${moves} intentos! (+30 XP)` : `Encuentra las 8 parejas técnicas • Intentos: ${moves}`}
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,minmax(70px,115px));gap:8px;justify-content:center;">
            ${deck.map(c => `
              <button data-mid="${c.id}" class="mem-card" style="height:68px;border-radius:10px;border:1px solid ${c.done?'#10b981':'#334155'};background:${c.open||c.done?'#1d4ed8':'#131f33'};color:#fff;font-weight:800;font-size:12px;cursor:pointer;">
                ${c.open || c.done ? c.v : "🦉"}
              </button>
            `).join("")}
          </div>
          <button id="mem-rst" style="margin-top:12px;background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 14px;border-radius:7px;font-weight:700;cursor:pointer;">🔄 Barajar de Nuevo</button>
        </div>
      `;
      stage.querySelectorAll(".mem-card").forEach(btn => {
        btn.onclick = () => {
          const card = deck.find(x => x.id === Number(btn.getAttribute("data-mid")));
          if (!card || card.open || card.done || pick.length === 2) return;
          card.open = true; pick.push(card); paint();
          if (pick.length === 2) {
            moves++;
            if (pick[0].v === pick[1].v) {
              pick[0].done = pick[1].done = true; pick = [];
              if (deck.every(c => c.done) && onGanarXP) onGanarXP(30, "🧠 Memoria Kaizen");
              paint();
            } else {
              setTimeout(() => { pick[0].open = pick[1].open = false; pick = []; paint(); }, 650);
            }
          }
        };
      });
      document.getElementById("mem-rst").onclick = () => renderMemoria(stage, onGanarXP);
    }
    paint();
  }

  // ==================== 4. CÁLCULO MENTAL 60s ====================
  function renderCalculo(stage, onGanarXP) {
    let pts = 0, sec = 60, tid = null, ans = 0, expr = "";
    function nextQ() {
      const a = 3 + Math.floor(Math.random() * 18), b = 2 + Math.floor(Math.random() * 12), op = Math.floor(Math.random() * 3);
      if (op === 0) { expr = `${a} + ${b}`; ans = a + b; }
      else if (op === 1) { expr = `${a + b} - ${b}`; ans = a; }
      else { const x = 2 + Math.floor(Math.random() * 11); expr = `${x} × ${b}`; ans = x * b; }
    }
    nextQ();
    function paint() {
      stage.innerHTML = `
        <div style="max-width:440px;margin:0 auto;text-align:center;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:20px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;margin-bottom:12px;">
            <span style="color:#fbbf24;">⏱️ ${sec}s</span>
            <span style="color:#34d399;">Puntos: ${pts}</span>
          </div>
          ${sec <= 0 ? `<h3 style="color:#34d399;">🏁 ¡Tiempo agotado! Lograste ${pts} aciertos.</h3><button id="cal-rst" style="background:#1d4ed8;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:700;cursor:pointer;">Jugar otra vez</button>` : `
            <div style="font-size:32px;font-weight:900;color:#fff;margin:14px 0;">${expr} = ?</div>
            <form id="cal-f" style="display:flex;gap:8px;justify-content:center;">
              <input id="cal-in" type="number" autofocus required style="width:120px;background:#0b1322;border:1.5px solid #38bdf8;color:#fff;padding:10px;border-radius:8px;font-size:18px;text-align:center;"/>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Responder</button>
            </form>
          `}
        </div>
      `;
      if (sec <= 0) { document.getElementById("cal-rst").onclick = () => renderCalculo(stage, onGanarXP); return; }
      const inp = document.getElementById("cal-in"); if (inp) inp.focus();
      document.getElementById("cal-f").onsubmit = (e) => {
        e.preventDefault();
        if (Number(inp.value) === ans) { pts++; if (onGanarXP) onGanarXP(5); }
        nextQ(); paint();
      };
    }
    tid = setInterval(() => {
      if (!document.getElementById("bds-game-stage")) { clearInterval(tid); return; }
      sec--; if (sec <= 0) clearInterval(tid);
      const tEl = stage.querySelector("span"); if (tEl && sec > 0) tEl.innerText = `⏱️ ${sec}s`; else if (sec <= 0) paint();
    }, 1000);
    paint();
  }

  // ==================== 5. ANAGRAMA / SCRABBLE TÉCNICO ====================
  function renderAnagrama(stage, onGanarXP) {
    const words = [
      { w: "ALGORITMO", h: "Secuencia ordenada de pasos lógicos" },
      { w: "CONTABILIDAD", h: "Registro financiero de activos y pasivos" },
      { w: "SEGURIDAD", h: "Protección de sistemas y datos" },
      { w: "FILOSOFIA", h: "Amor a la sabiduría y pensamiento crítico" },
      { w: "MARIMBA", h: "Instrumento musical símbolo nacional" },
      { w: "FOTOSINTESIS", h: "Proceso energético de las plantas" }
    ];
    let idx = 0, msg = "";
    function scram(w) { return w.split("").sort(() => Math.random() - 0.5).join(" "); }
    function paint() {
      const cur = words[idx % words.length];
      stage.innerHTML = `
        <div style="max-width:480px;margin:0 auto;text-align:center;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:20px;">
          <div style="font-size:11.5px;color:#94a3b8;margin-bottom:6px;">Pista: <b style="color:#38bdf8;">${cur.h}</b></div>
          <div style="font-size:24px;font-weight:900;letter-spacing:4px;color:#fbbf24;margin:12px 0;">${scram(cur.w)}</div>
          <form id="an-f" style="display:flex;gap:8px;justify-content:center;">
            <input id="an-in" type="text" placeholder="Escribe la palabra ordenada" required style="flex:1;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:14px;text-transform:uppercase;"/>
            <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-weight:800;cursor:pointer;">Verificar</button>
          </form>
          ${msg ? `<div style="margin-top:10px;font-size:12.5px;font-weight:700;color:#34d399;">${msg}</div>` : ""}
        </div>
      `;
      document.getElementById("an-f").onsubmit = (e) => {
        e.preventDefault();
        const v = document.getElementById("an-in").value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (v === cur.w) { msg = `✅ ¡Correcto: ${cur.w}! (+15 XP)`; if (onGanarXP) onGanarXP(15); idx++; }
        else msg = "❌ Intenta nuevamente revisando la pista.";
        paint();
      };
    }
    paint();
  }

  // ==================== 6. RETO VIAL MOPT ====================
  function renderRetoVial(stage, onGanarXP) {
    const casos = [
      { ic: "🛑", t: "Señal octagonal roja en intersección", opts: ["Detención total obligatoria antes de la línea", "Bajar a 20 km/h sin parar", "Acelerar si no viene nadie"], c: 0 },
      { ic: "🏫", t: "Zona escolar con estudiantes presentes", opts: ["Máximo 50 km/h", "Máximo 25 km/h", "Máximo 40 km/h"], c: 1 },
      { ic: "🔄", t: "Ingreso a rotonda en Costa Rica", opts: ["Prioridad para quien ya circula dentro", "Prioridad para quien ingresa", "Prioridad al vehículo más grande"], c: 0 }
    ];
    let i = 0, fb = "";
    function paint() {
      const cur = casos[i % casos.length];
      stage.innerHTML = `
        <div style="max-width:520px;margin:0 auto;text-align:center;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:20px;">
          <div style="font-size:44px;margin-bottom:8px;">${cur.ic}</div>
          <h4 style="margin:0 0 12px;color:#fff;">${cur.t}</h4>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${cur.opts.map((o, idx) => `<button data-vi="${idx}" class="v-opt" style="background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">${o}</button>`).join("")}
          </div>
          ${fb ? `<div style="margin-top:10px;font-size:12.5px;font-weight:700;color:#34d399;">${fb}</div>` : ""}
        </div>
      `;
      stage.querySelectorAll(".v-opt").forEach(b => {
        b.onclick = () => {
          const ok = Number(b.getAttribute("data-vi")) === cur.c;
          fb = ok ? "✅ ¡Decisión segura según Ley N° 9078! (+10 XP)" : "❌ Repasa la Ley de Tránsito N° 9078.";
          if (ok && onGanarXP) onGanarXP(10);
          i++; paint();
        };
      });
    }
    paint();
  }
})();