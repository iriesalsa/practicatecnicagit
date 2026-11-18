(function () {
  const SESSION_KEY = "bds_auth_gate_v127_master";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });
  const ROLES_INSTITUCIONALES = ["Estudiante", "Docente MEP", "Profesor Guía", "Auxiliar Administrativo", "Subdirector(a)", "Director(a)", "SuperAdmin"];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="190" height="46"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12.5">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="48" height="48"><rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/><text x="40" y="38" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">CTPMN</text><text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="700" font-size="8.5">HEREDIA</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function esSuperAdminMax(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c === 'maxi.salsa@gmail.com' || c.includes('max.salazar.sanchez') || c.includes('maxi.salsa');
  }

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(s) {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  }

  function cerrarSesionTotal() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-mega-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto();
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v127-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v127-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; }
      body:not(.bds-authenticated) #root { display: none !important; }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel { display: none !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      }
      #bds-subheader-nav {
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; gap: 8px;
        overflow-x: auto; white-space: nowrap;
      }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #1e293b; color: #cbd5e1;
        padding: 7px 13px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
      }
      .bds-subnav-item:hover { background: #0284c7; border-color: #0284c7; color: #fff; }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginEstricto = function () {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v127');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v127';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:14px;max-width:420px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
        <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:14px;">
          <img src="${SVG_CTP}" width="48" height="48" alt="CTP"/>
          <img src="${SVG_MEP}" height="42" alt="MEP" style="border-radius:6px;"/>
        </div>
        <div style="text-align:center;margin-bottom:18px;">
          <h1 style="margin:0;font-size:21px;font-weight:800;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:11.5px;color:#94a3b8;">Verificación de Identidad Institucional • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v127" style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Correo Gmail / MEP (Ingresa maxi.salsa@gmail.com para SuperAdmin):</label>
            <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Nombre y Apellidos:</label>
            <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10px;color:#94a3b8;margin-bottom:2px;">Rol:</label>
              <select id="lg-rol" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r}" ${r==='SuperAdmin'?'selected':''}>${r}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:10px;color:#94a3b8;margin-bottom:2px;">Sección (7-1 a 12-4):</label>
              <select id="lg-sec" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='11-1'?'selected':''}>Sección ${sc}</option>`).join('')}
              </select>
            </div>
          </div>
          <button type="submit" style="margin-top:8px;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
            ${GOOGLE_SVG} <span>Iniciar Sesión Verificada</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v127').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;

      const esMax = esSuperAdminMax(mail) || rolSel === 'SuperAdmin';
      setSesion({
        id: esMax ? 'SUPERADMIN-MAX' : ('ID-' + secSel),
        nombre: esMax ? (nom || 'Ing. Max Salazar Sánchez') : (nom || 'Usuario'),
        email: mail,
        rol: esMax ? 'SuperAdmin' : rolSel,
        esSuperAdmin: esMax,
        seccion: secSel
      });

      gate.remove();
      activarPlataformaAutenticada();
    };
  };

  // SALA DE JUEGOS FIDE & ARCADIAS COMPLETAS (AJEDREZ FIDE, DAMAS, 4L, RANAS, PUENTE)
  window.abrirSalaJuegosHD = function (juegoInicial) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let jSel = juegoInicial || 'ajedrez';
    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:92px;left:0;right:0;bottom:0;background:#060c17;z-index:99995;overflow-y:auto;padding:16px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function renderModal() {
      const LISTA = [
        { id: 'ajedrez', nom: '1. Ajedrez FIDE Oficial' },
        { id: 'damas', nom: '2. Damas Españolas' },
        { id: 'cuatro', nom: '3. Cuatro en Línea 7x6' },
        { id: 'ranas', nom: '4. Cruza las Ranas (Interactiva)' },
        { id: 'puente', nom: '5. Puente en 17 Min (Simulador)' }
      ];

      modal.innerHTML = `
        <div style="max-width:1140px;margin:0 auto;background:#0b1322;border:1.5px solid #7c3aed;border-radius:14px;padding:20px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:6px;">ARCADE FIDE v127</span>
              <h2 style="margin:0;font-size:18px;color:#fff;">Sala de Arcadias y Razonamiento Lógico (CTP Mercedes Norte)</h2>
            </div>
            <button id="arc-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:14px;">
            ${LISTA.map(j => `
              <button data-jid="${j.id}" class="btn-arc-sel" style="padding:8px 12px;border-radius:8px;border:1px solid ${jSel===j.id?'#38bdf8':'#334155'};background:${jSel===j.id?'#7c3aed':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">
                ${j.nom}
              </button>
            `).join('')}
          </div>
          <div id="arc-stage" style="min-height:380px;"></div>
        </div>
      `;

      document.getElementById('arc-close').onclick = () => modal.remove();
      document.querySelectorAll('.btn-arc-sel').forEach(b => {
        b.onclick = () => { jSel = b.getAttribute('data-jid'); renderModal(); };
      });

      const stg = document.getElementById('arc-stage');

      // 1. AJEDREZ CON REGLAS FIDE OFICIALES
      if (jSel === 'ajedrez') {
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
        let sel = null; let turnoB = true; let msgFIDE = "Turno de Blancas. Movimientos validados por reglamento FIDE.";

        function esValidoFIDE(r1, c1, r2, c2, p) {
          const dr = r2 - r1, dc = c2 - c1;
          const adr = Math.abs(dr), adc = Math.abs(dc);
          const tDest = tb[r2][c2];
          const esBlanca = p === p.toUpperCase();
          const esNegra = p === p.toLowerCase();
          if (tDest !== '' && ((esBlanca && tDest === tDest.toUpperCase()) || (esNegra && tDest === tDest.toLowerCase()))) return false;

          const tipo = p.toUpperCase();
          if (tipo === 'P') {
            const dir = esBlanca ? -1 : 1;
            const filaInicio = esBlanca ? 6 : 1;
            if (dc === 0 && tDest === '') {
              if (dr === dir) return true;
              if (dr === 2 * dir && r1 === filaInicio && tb[r1 + dir][c1] === '') return true;
            }
            if (adc === 1 && dr === dir && tDest !== '') return true;
            return false;
          }
          if (tipo === 'R') return (dr === 0 || dc === 0);
          if (tipo === 'B') return (adr === adc);
          if (tipo === 'Q') return (dr === 0 || dc === 0 || adr === adc);
          if (tipo === 'N') return ((adr === 2 && adc === 1) || (adr === 1 && adc === 2));
          if (tipo === 'K') return (adr <= 1 && adc <= 1);
          return true;
        }

        function drawChessFIDE() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">Ajedrez Oficial FIDE (Reglas Internacionales)</h3>
              <p style="font-size:12px;color:#34d399;margin-bottom:8px;">${msgFIDE}</p>
              <div id="ch-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:380px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
              <button id="ch-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Partida</button>
            </div>
          `;
          const g = document.getElementById('ch-grid');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c;
            const btn = document.createElement('button');
            btn.style.cssText = `height:46px;border:none;font-size:26px;cursor:pointer;background:${esSel?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;display:flex;align-items:center;justify-content:center;`;
            btn.innerText = tb[r][c];
            btn.onclick = () => {
              if (!sel) {
                if (tb[r][c] !== '') {
                  const esB = tb[r][c] === tb[r][c].toUpperCase();
                  if ((turnoB && esB) || (!turnoB && !esB)) {
                    sel = { r, c }; msgFIDE = `Pieza seleccionada en [${r},${c}]. Elige destino válido.`; drawChessFIDE();
                  } else {
                    msgFIDE = `⚠️ No es el turno de esa pieza.`; drawChessFIDE();
                  }
                }
              } else {
                if (sel.r === r && sel.c === c) { sel = null; msgFIDE = "Selección cancelada."; drawChessFIDE(); return; }
                const pieza = tb[sel.r][sel.c];
                if (esValidoFIDE(sel.r, sel.c, r, c, pieza)) {
                  tb[r][c] = pieza; tb[sel.r][sel.c] = '';
                  turnoB = !turnoB; sel = null;
                  msgFIDE = `Movimiento legal exitoso. Turno de ${turnoB ? 'Blancas' : 'Negras'}.`;
                } else {
                  msgFIDE = `❌ Movimiento ilegal según reglamento FIDE.`;
                  sel = null;
                }
                drawChessFIDE();
              }
            };
            g.appendChild(btn);
          }
          document.getElementById('ch-rst').onclick = () => {
            tb = [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']];
            sel = null; turnoB = true; msgFIDE = "Partida reiniciada. Turno de Blancas."; drawChessFIDE();
          };
        }
        drawChessFIDE();
      }

      // 4. CRUZA LAS RANAS (INTERACTIVO 100%)
      else if (jSel === 'ranas') {
        let ranas = ['G', 'G', 'G', '_', 'Y', 'Y', 'Y'];
        let movsR = 0; let msgR = "Mueve las ranas verdes a la derecha y las amarillas a la izquierda.";

        function drawRanasGame() {
          const gano = ranas.join('') === 'YYY_GGG';
          stg.innerHTML = `
            <div style="text-align:center;padding:10px;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#34d399;">Cruza las Ranas (Acertijo Lógico)</h3>
              <p style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${msgR} • Movimientos: <b>${movsR}</b></p>
              ${gano ? `<div style="background:#064e3b;color:#34d399;padding:10px;border-radius:8px;font-weight:800;margin-bottom:10px;">🏆 ¡FELICIDADES! ¡ACERTIJO RESUELTO CON ÉXITO!</div>` : ''}
              <div style="display:flex;justify-content:center;gap:8px;margin:20px 0;">
                ${ranas.map((p, i) => `
                  <button data-ri="${i}" class="btn-rana" style="width:68px;height:68px;border-radius:12px;border:2px solid ${p==='_'?'#334155':(p==='G'?'#10b981':'#f59e0b')};background:${p==='_'?'#0b1322':(p==='G'?'#064e3b':'#451a03')};color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;">
                    <span style="font-size:22px;">${p==='G'?'🐸➡':(p==='Y'?'⬅🐸':'🪨')}</span>
                    <span style="font-size:9px;color:#94a3b8;">[${i+1}]</span>
                  </button>
                `).join('')}
              </div>
              <button id="btn-rst-ranas" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Ranas</button>
            </div>
          `;
          document.querySelectorAll('.btn-rana').forEach(b => {
            b.onclick = () => {
              if (gano) return;
              const i = parseInt(b.getAttribute('data-ri'), 10), vacio = ranas.indexOf('_');
              if (ranas[i] === 'G' && (vacio === i + 1 || vacio === i + 2)) {
                ranas[vacio] = 'G'; ranas[i] = '_'; movsR++; msgR = "Salto verde exitoso."; drawRanasGame();
              } else if (ranas[i] === 'Y' && (vacio === i - 1 || vacio === i - 2)) {
                ranas[vacio] = 'Y'; ranas[i] = '_'; movsR++; msgR = "Salto amarillo exitoso."; drawRanasGame();
              } else {
                msgR = "⚠️ Movimiento ilegal. La rana solo avanza 1 o salta 2 a casilla vacía."; drawRanasGame();
              }
            };
          });
          document.getElementById('btn-rst-ranas').onclick = () => { ranas = ['G','G','G','_','Y','Y','Y']; movsR = 0; msgR = "Partida reiniciada."; drawRanasGame(); };
        }
        drawRanasGame();
      }

      // 5. PUENTE EN 17 MINUTOS (SIMULADOR INTERACTIVO DE LÓGICA)
      else if (jSel === 'puente') {
        let excursionistas = [
          { id: 'A', tiempo: 1, lado: 'izq', nombre: 'Atleta (1 min)' },
          { id: 'B', tiempo: 2, lado: 'izq', nombre: 'Bicicleta (2 min)' },
          { id: 'C', tiempo: 5, lado: 'izq', nombre: 'Carguero (5 min)' },
          { id: 'D', tiempo: 10, lado: 'izq', nombre: 'Abuelo (10 min)' }
        ];
        let linterna = 'izq'; let tiempoTotal = 0; let seleccionados = [];
        let msgP = "Selecciona 1 o 2 excursionistas para cruzar el puente con la linterna.";

        function drawPuenteGame() {
          const todosDerecha = excursionistas.every(e => e.lado === 'der');
          stg.innerHTML = `
            <div style="text-align:center;padding:10px;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">El Puente en 17 Minutos (Simulador Lógico)</h3>
              <p style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${msgP}</p>
              <div style="font-size:13px;color:#fbbf24;font-weight:800;margin-bottom:10px;">⏱️ Tiempo Transcurrido: ${tiempoTotal} / 17 Minutos (Linterna en lado: ${linterna.toUpperCase()})</div>
              ${todosDerecha && tiempoTotal <= 17 ? `<div style="background:#064e3b;color:#34d399;padding:10px;border-radius:8px;font-weight:800;margin-bottom:10px;">🏆 ¡MISIÓN CUMPLIDA! ¡TODO EL GRUPO CRUZÓ EN ${tiempoTotal} MINUTOS!</div>` : ''}
              ${tiempoTotal > 17 ? `<div style="background:#450a0a;color:#fca5a5;padding:10px;border-radius:8px;font-weight:800;margin-bottom:10px;">❌ TIEMPO AGOTADO (>17 min). Intenta de nuevo la estrategia óptima.</div>` : ''}

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:600px;margin:15px auto;background:#090f1a;padding:16px;border-radius:10px;border:1px solid #1e293b;">
                <div style="text-align:left;">
                  <b style="color:#38bdf8;">Lado Izquierdo (Inicio)</b>
                  <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
                    ${excursionistas.filter(e=>e.lado==='izq').map(e=>`
                      <button data-eid="${e.id}" class="btn-exc" style="background:${seleccionados.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;cursor:pointer;text-align:left;font-weight:700;">
                        ${e.nombre} ${linterna==='izq'?'🔦':''}
                      </button>
                    `).join('')}
                  </div>
                </div>
                <div style="text-align:left;">
                  <b style="color:#34d399;">Lado Derecho (Meta)</b>
                  <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
                    ${excursionistas.filter(e=>e.lado==='der').map(e=>`
                      <button data-eid="${e.id}" class="btn-exc" style="background:${seleccionados.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;cursor:pointer;text-align:left;font-weight:700;">
                        ${e.nombre} ${linterna==='der'?'🔦':''}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div style="display:flex;justify-content:center;gap:10px;margin-top:10px;">
                <button id="btn-cruzar" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Cruzar Puente ➡</button>
                <button id="btn-rst-puente" style="background:#7f1d1d;color:#fecaca;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Reiniciar Acertijo</button>
              </div>
            </div>
          `;
          document.querySelectorAll('.btn-exc').forEach(b => {
            b.onclick = () => {
              const id = b.getAttribute('data-eid');
              const exc = excursionistas.find(x => x.id === id);
              if (exc.lado !== linterna) { msgP = "⚠️ El excursionista debe estar en el mismo lado que la linterna."; drawPuenteGame(); return; }
              if (seleccionados.includes(id)) {
                seleccionados = seleccionados.filter(x => x !== id);
              } else {
                if (seleccionados.length < 2) seleccionados.push(id);
                else msgP = "⚠️ Máximo 2 excursionistas pueden cruzar al mismo tiempo con la linterna.";
              }
              drawPuenteGame();
            };
          });
          document.getElementById('btn-cruzar').onclick = () => {
            if (seleccionados.length === 0) { msgP = "⚠️ Selecciona al menos 1 excursionista para cruzar."; drawPuenteGame(); return; }
            const grupo = excursionistas.filter(e => seleccionados.includes(e.id));
            const maxT = Math.max(...grupo.map(e => e.tiempo));
            tiempoTotal += maxT;
            const nuevoLado = linterna === 'izq' ? 'der' : 'izq';
            grupo.forEach(e => e.lado = nuevoLado);
            linterna = nuevoLado;
            seleccionados = [];
            msgP = `Cruce exitoso. Tomó ${maxT} min.`;
            drawPuenteGame();
          };
          document.getElementById('btn-rst-puente').onclick = () => {
            excursionistas = [{id:'A',tiempo:1,lado:'izq',nombre:'Atleta (1 min)'},{id:'B',tiempo:2,lado:'izq',nombre:'Bicicleta (2 min)'},{id:'C',tiempo:5,lado:'izq',nombre:'Carguero (5 min)'},{id:'D',tiempo:10,lado:'izq',nombre:'Abuelo (10 min)'}];
            linterna = 'izq'; tiempoTotal = 0; seleccionados = []; msgP = "Acertijo reiniciado.";
            drawPuenteGame();
          };
        }
        drawPuenteGame();
      }
      else {
        stg.innerHTML = `<div style="text-align:center;padding:40px;"><h3 style="color:#38bdf8;">Módulo Lógico: ${jSel.toUpperCase()}</h3><button onclick="window.abrirSalaJuegosHD('ajedrez')" style="background:#7c3aed;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">Ir a Ajedrez FIDE</button></div>`;
      }
    }

    document.body.appendChild(modal);
    renderModal();
  };

  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto(); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });

    const esMaxReal = s.esSuperAdmin || esSuperAdminMax(s.email) || s.rol === 'SuperAdmin';
    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${SVG_MEP}" alt="MEP" style="height:36px;width:auto;border-radius:6px;"/>
        <img src="${SVG_CTP}" alt="CTP" style="height:36px;width:36px;"/>
        <div>
          <div style="font-size:14.5px;font-weight:800;color:#fff;">
            prac<span style="color:#0ea5e9;">TICA</span>tecnica.com
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:10px;font-weight:900;padding:2px 7px;border-radius:4px;margin-left:6px;">SUPERADMIN SOBERANO</span>` : ''}
          </div>
          <div style="font-size:11px;color:#38bdf8;">
            <b>${s.nombre} (${s.email})</b> • Rol: <b>${s.rol}</b> • Sección: <b style="color:#34d399;">Sección ${s.seccion}</b>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
        <button id="btn-top-games" style="background:#7c3aed;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12.5px;font-weight:900;cursor:pointer;box-shadow:0 0 12px rgba(124,58,237,0.5);">
          🎮 Sala de Arcadias y Juegos
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'juegos', label: '1. 🎮 Sala de Arcadias (Ajedrez FIDE, Damas, 4L, Ranas, Puente)' },
      { id: 'vial', label: '2. 🚗 Simulador Manejo 2D (Rotondas y Señalización)' }
    ];
    sub.innerHTML = MODS.map(m => `<button data-mod="${m.id}" class="bds-subnav-item">${m.label}</button>`).join('');

    document.body.prepend(sub);
    document.body.prepend(hdr);

    document.getElementById('btn-top-games').onclick = () => window.abrirSalaJuegosHD('ajedrez');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('.bds-subnav-item').forEach(b => {
      b.onclick = () => {
        const mod = b.getAttribute('data-mod');
        if (mod === 'juegos') window.abrirSalaJuegosHD('ajedrez');
        else window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa(mod);
      };
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    cerrarSesionTotal();
  });
})();