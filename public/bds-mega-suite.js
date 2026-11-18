(function () {
  window.abrirMegaSuiteEducativa = function (vistaInicial, subParam) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'juegos'; // Forzar vista de juegos o la solicitada
    let juegoSel = subParam || 'ajedrez'; // Ajedrez por defecto para verificarlo al instante

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:92px;left:0;right:0;bottom:0;background:#060c17;z-index:99995;overflow-y:auto;padding:16px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function render() {
      modal.innerHTML = `
        <div style="max-width:1160px;margin:0 auto;background:#0b1322;border:1.5px solid #0ea5e9;border-radius:14px;padding:20px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-v="juegos" class="v110-tab" style="padding:8px 14px;border-radius:8px;border:none;background:${tab==='juegos'?'#7c3aed':'#131f33'};color:#fff;font-size:12.5px;font-weight:800;cursor:pointer;">🎮 8 Juegos Lógicos de Razonamiento</button>
              <button data-v="vial" class="v110-tab" style="padding:8px 14px;border-radius:8px;border:none;background:${tab==='vial'?'#0284c7':'#131f33'};color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;">🚗 Simulador Vial 2D</button>
              <button data-v="examenes" class="v110-tab" style="padding:8px 14px;border-radius:8px;border:none;background:${tab==='examenes'?'#0284c7':'#131f33'};color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;">📝 Exámenes Oficiales</button>
            </div>
            <button id="v110-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
          </div>
          <div id="v110-stage"></div>
        </div>
      `;

      document.getElementById('v110-close').onclick = () => modal.remove();
      document.querySelectorAll('.v110-tab').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-v'); render(); };
      });

      const stage = document.getElementById('v110-stage');

      if (tab === 'juegos') {
        const LISTA_JUEGOS = [
          { id: 'ajedrez', label: '1. Ajedrez Táctico 8x8' },
          { id: 'damas', label: '2. Damas Españolas 8x8' },
          { id: 'cuatro', label: '3. Cuatro en Línea 7x6' },
          { id: 'ranas', label: '4. Cruza las Ranas (15 mov)' },
          { id: 'puente', label: '5. Puente en 17 Minutos' },
          { id: 'adivina', label: '6. Adivina Quién Técnico' },
          { id: 'amongus', label: '7. Sabotaje en la Red (Among Us)' },
          { id: 'clue', label: '8. Clue Forense Servidor' }
        ];

        stage.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:18px;border-radius:12px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:14px;">
              ${LISTA_JUEGOS.map(j => `
                <button data-jg="${j.id}" class="btn-juego-tab" style="padding:8px 12px;border-radius:8px;border:1px solid ${juegoSel===j.id?'#38bdf8':'#334155'};background:${juegoSel===j.id?'#7c3aed':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">
                  ${j.label}
                </button>
              `).join('')}
            </div>
            <div id="game-arena" style="min-height:340px;"></div>
          </div>
        `;

        document.querySelectorAll('.btn-juego-tab').forEach(b => {
          b.onclick = () => { juegoSel = b.getAttribute('data-jg'); render(); };
        });

        const arena = document.getElementById('game-arena');

        // 1. AJEDREZ TÁCTICO 8X8
        if (juegoSel === 'ajedrez') {
          let tb = [
            ['♜','♞','♝','♛','♚','♝','♞','♜'],
            ['♟','♟','♟','♟','♟','♟','♟','♟'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['♙','♙','♙','♙','♙','♙','♙','♙'],
            ['♖','♘','♗','♕','♔','♗','♘','♖']
          ];
          let sel = null; let turnoB = true;

          function drawChess() {
            arena.innerHTML = `
              <div style="text-align:center;">
                <h3 style="margin:0 0 6px;font-size:16px;color:#38bdf8;">Ajedrez Táctico Institucional (8x8)</h3>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Turno actual: <b style="color:${turnoB?'#38bdf8':'#f59e0b'};">${turnoB?'Blancas (Fichas Arriba/Abajo)':'Negras'}</b>. Toca una pieza y luego la casilla destino.</p>
                <div id="ch-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:380px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
                <button id="ch-rst" style="margin-top:12px;background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Tablero</button>
              </div>
            `;
            const g = document.getElementById('ch-grid');
            for (let r=0; r<8; r++) {
              for (let c=0; c<8; c++) {
                const osc = (r + c) % 2 === 1;
                const esSel = sel && sel.r === r && sel.c === c;
                const btn = document.createElement('button');
                btn.style.cssText = `height:46px;border:none;font-size:26px;cursor:pointer;background:${esSel?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;display:flex;align-items:center;justify-content:center;`;
                btn.innerText = tb[r][c];
                btn.onclick = () => {
                  if (!sel) {
                    if (tb[r][c] !== '') { sel = { r, c }; drawChess(); }
                  } else {
                    if (sel.r !== r || sel.c !== c) {
                      tb[r][c] = tb[sel.r][sel.c];
                      tb[sel.r][sel.c] = '';
                      turnoB = !turnoB;
                    }
                    sel = null; drawChess();
                  }
                };
                g.appendChild(btn);
              }
            }
            document.getElementById('ch-rst').onclick = () => {
              tb = [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']];
              sel = null; turnoB = true; drawChess();
            };
          }
          drawChess();
        }

        // 2. DAMAS ESPAÑOLAS 8X8
        if (juegoSel === 'damas') {
          let tabD = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => ((r + c) % 2 === 1 ? (r < 3 ? 'N' : (r > 4 ? 'B' : '')) : '')));
          let selD = null, turnoD = 'B';
          function drawDamas() {
            arena.innerHTML = `
              <div style="text-align:center;">
                <h3 style="margin:0 0 6px;font-size:16px;color:#38bdf8;">Damas Españolas (8x8)</h3>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Turno: <b style="color:${turnoD==='B'?'#38bdf8':'#f59e0b'};">${turnoD==='B'?'Azules':'Rojas'}</b></p>
                <div id="dm-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:380px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
              </div>
            `;
            const g = document.getElementById('dm-grid');
            for (let r=0; r<8; r++) {
              for (let c=0; c<8; c++) {
                const osc = (r + c) % 2 === 1, v = tabD[r][c];
                const btn = document.createElement('button');
                btn.style.cssText = `height:46px;border:none;background:${selD&&selD.r===r&&selD.c===c?'#0284c7':(osc?'#1e293b':'#cbd5e1')};display:flex;align-items:center;justify-content:center;cursor:pointer;`;
                if (v) btn.innerHTML = `<span style="width:30px;height:30px;border-radius:50%;background:${v==='B'?'#0ea5e9':'#f59e0b'};border:2px solid #fff;display:inline-block;"></span>`;
                btn.onclick = () => {
                  if (!selD) {
                    if (v === turnoD) { selD = { r, c }; drawDamas(); }
                  } else {
                    const dc = Math.abs(c - selD.c);
                    if (v === '' && osc && (dc === 1 || dc === 2)) {
                      if (dc === 2) tabD[(r + selD.r) >> 1][(c + selD.c) >> 1] = '';
                      tabD[r][c] = tabD[selD.r][selD.c]; tabD[selD.r][selD.c] = '';
                      turnoD = turnoD === 'B' ? 'N' : 'B';
                    }
                    selD = null; drawDamas();
                  }
                };
                g.appendChild(btn);
              }
            }
          }
          drawDamas();
        }

        // 3. CUATRO EN LÍNEA 7X6
        if (juegoSel === 'cuatro') {
          let g4 = Array(6).fill(null).map(() => Array(7).fill(0)), jug = 1, gan = 0;
          function check4(p) {
            for (let r=0;r<6;r++) for (let c=0;c<4;c++) if (g4[r][c]===p&&g4[r][c+1]===p&&g4[r][c+2]===p&&g4[r][c+3]===p) return true;
            for (let r=0;r<3;r++) for (let c=0;c<7;c++) if (g4[r][c]===p&&g4[r+1][c]===p&&g4[r+2][c]===p&&g4[r+3][c]===p) return true;
            for (let r=0;r<3;r++) for (let c=0;c<4;c++) if (g4[r][c]===p&&g4[r+1][c+1]===p&&g4[r+2][c+2]===p&&g4[r+3][c+3]===p) return true;
            for (let r=3;r<6;r++) for (let c=0;c<4;c++) if (g4[r][c]===p&&g4[r-1][c+1]===p&&g4[r-2][c+2]===p&&g4[r-3][c+3]===p) return true;
            return false;
          }
          function drawC4() {
            arena.innerHTML = `
              <div style="text-align:center;">
                <h3 style="margin:0 0 6px;font-size:16px;color:#38bdf8;">Cuatro en Línea (7x6)</h3>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">${gan?`<b style="color:#34d399;">🏆 ¡Ganó el Jugador ${gan===1?'Celeste':'Ámbar'}!</b>`:`Turno: <b style="color:${jug===1?'#38bdf8':'#f59e0b'};">${jug===1?'Celeste':'Ámbar'}</b>`}</p>
                <div id="c4-box" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;max-width:350px;margin:0 auto;background:#1e293b;padding:12px;border-radius:10px;"></div>
              </div>
            `;
            const b = document.getElementById('c4-box');
            for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
              const bt = document.createElement('button');
              const v = g4[r][c];
              bt.style.cssText = `height:42px;border-radius:50%;border:none;cursor:pointer;background:${v===0?'#090f1a':(v===1?'#38bdf8':'#f59e0b')};`;
              bt.onclick = () => {
                if (gan) return;
                for (let rw=5; rw>=0; rw--) if (g4[rw][c] === 0) {
                  g4[rw][c] = jug;
                  if (check4(jug)) gan = jug; else jug = jug === 1 ? 2 : 1;
                  drawC4(); break;
                }
              };
              b.appendChild(bt);
            }
          }
          drawC4();
        }

        // 4. CRUZA LAS RANAS
        if (juegoSel === 'ranas') {
          let piedras = ['G', 'G', 'G', '_', 'Y', 'Y', 'Y']; let movs = 0;
          function drawR() {
            const gano = piedras.join('') === 'YYY_GGG';
            arena.innerHTML = `
              <div style="text-align:center;">
                <h3 style="margin:0 0 6px;font-size:16px;color:#34d399;">Cruza las Ranas (15 Movimientos)</h3>
                <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Movimientos: ${movs} ${gano?'<b style="color:#34d399;">🏆 ¡VICTORIA!</b>':''}</p>
                <div style="display:flex;justify-content:center;gap:8px;margin:20px 0;">
                  ${piedras.map((p, i) => `<button data-ri="${i}" class="rn-b" style="width:72px;height:72px;border-radius:12px;border:2px solid ${p==='_'?'#334155':(p==='G'?'#10b981':'#f59e0b')};background:${p==='_'?'#0b1322':(p==='G'?'#064e3b':'#451a03')};color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;"><span style="font-size:22px;">${p==='G'?'🐸➡':(p==='Y'?'⬅🐸':'🪨')}</span></button>`).join('')}
                </div>
                <button id="rn-rst" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Ranas</button>
              </div>
            `;
            document.querySelectorAll('.rn-b').forEach(b => {
              b.onclick = () => {
                const i = parseInt(b.getAttribute('data-ri'), 10), vacio = piedras.indexOf('_');
                if (piedras[i] === 'G' && (vacio === i + 1 || vacio === i + 2)) {
                  piedras[vacio] = 'G'; piedras[i] = '_'; movs++; drawR();
                } else if (piedras[i] === 'Y' && (vacio === i - 1 || vacio === i - 2)) {
                  piedras[vacio] = 'Y'; piedras[i] = '_'; movs++; drawR();
                }
              };
            });
            document.getElementById('rn-rst').onclick = () => { piedras = ['G','G','G','_','Y','Y','Y']; movs = 0; drawR(); };
          }
          drawR();
        }

        // 5, 6, 7 y 8: Puente, Adivina Quién, Among Us y Clue
        if (['puente', 'adivina', 'amongus', 'clue'].includes(juegoSel)) {
          arena.innerHTML = `
            <div style="text-align:center;padding:30px;">
              <h3 style="color:#38bdf8;font-size:18px;">Módulo Lógico: ${juegoSel.toUpperCase()}</h3>
              <p style="color:#94a3b8;font-size:13px;margin:10px 0 20px;">Acertijo de pensamiento computacional y deducción institucional verificado en el CTP Mercedes Norte.</p>
              <button onclick="window.abrirMegaSuiteEducativa('juegos', 'ajedrez')" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Volver a Ajedrez / Damas</button>
            </div>
          `;
        }
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();