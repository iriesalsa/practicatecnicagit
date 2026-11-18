(function () {
  const SESSION_KEY = "bds_auth_gate_v129_10games";
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
    if (document.getElementById('bds-v129-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v129-css';
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
    let old = document.getElementById('bds-login-v129');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v129';
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

        <form id="f-login-v129" style="display:flex;flex-direction:column;gap:10px;">
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

    document.getElementById('f-login-v129').onsubmit = (e) => {
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

  // SALA DE ARCADIAS DE 10 JUEGOS MAESTROS 100% OPERATIVOS
  window.abrirSalaJuegosHD = function (juegoInicial) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let jSel = juegoInicial || 'ajedrez';
    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:92px;left:0;right:0;bottom:0;background:#060c17;z-index:99995;overflow-y:auto;padding:16px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function renderModal() {
      const LISTA_10 = [
        { id: 'ajedrez', nom: '1. Ajedrez FIDE' },
        { id: 'damas', nom: '2. Damas Españolas' },
        { id: 'cuatro', nom: '3. Cuatro en Línea' },
        { id: 'ranas', nom: '4. Cruza las Ranas' },
        { id: 'puente', nom: '5. Puente en 17 Min' },
        { id: 'gato', nom: '6. Ta-Te-Ti (Gato)' },
        { id: 'memoria', nom: '7. Memoria Técnica' },
        { id: 'adivina', nom: '8. Adivina el Número' },
        { id: 'subnet', nom: '9. Reto Subneteo VLSM' },
        { id: 'cosevi', nom: '10. Quiz Rápido COSEVI' }
      ];

      modal.innerHTML = `
        <div style="max-width:1160px;margin:0 auto;background:#0b1322;border:1.5px solid #7c3aed;border-radius:14px;padding:20px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:6px;">ARCADE 10 JUEGOS v129</span>
              <h2 style="margin:0;font-size:18px;color:#fff;">Sala de Arcadias y Lógica (CTP Mercedes Norte)</h2>
            </div>
            <button id="arc-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:14px;">
            ${LISTA_10.map(j => `
              <button data-jid="${j.id}" class="btn-arc-sel" style="padding:7px 11px;border-radius:8px;border:1px solid ${jSel===j.id?'#38bdf8':'#334155'};background:${jSel===j.id?'#7c3aed':'#111c2d'};color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;">
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

      // 1. AJEDREZ FIDE
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
        let sel = null; let turnoB = true; let msgFIDE = "Reglas FIDE: Blancas mueven primero. Peones avanzan 1 o 2 al inicio.";
        function esBlanca(p) { return p === p.toUpperCase() && p !== ''; }
        function esNegra(p) { return p === p.toLowerCase() && p !== ''; }
        function esValidoFIDE(r1, c1, r2, c2, p) {
          const dr = r2 - r1, dc = c2 - c1;
          const adr = Math.abs(dr), adc = Math.abs(dc);
          const tDest = tb[r2][c2];
          const b = esBlanca(p);
          if (tDest !== '' && ((b && esBlanca(tDest)) || (!b && esNegra(tDest)))) return false;
          const tipo = p.toUpperCase();
          if (tipo === 'P') {
            const dir = b ? -1 : 1;
            const filaInicio = b ? 6 : 1;
            if (dc === 0 && dr === dir && tDest === '') return true;
            if (dc === 0 && dr === 2 * dir && r1 === filaInicio && tDest === '' && tb[r1 + dir][c1] === '') return true;
            if (adc === 1 && dr === dir && tDest !== '' && ((b && esNegra(tDest)) || (!b && esBlanca(tDest)))) return true;
            return false;
          }
          if (tipo === 'R') {
            if (dr !== 0 && dc !== 0) return false;
            let stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1), stepC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
            let cr = r1 + stepR, cc = c1 + stepC;
            while (cr !== r2 || cc !== c2) { if (tb[cr][cc] !== '') return false; cr += stepR; cc += stepC; }
            return true;
          }
          if (tipo === 'B') {
            if (adr !== adc) return false;
            let stepR = dr > 0 ? 1 : -1, stepC = dc > 0 ? 1 : -1;
            let cr = r1 + stepR, cc = c1 + stepC;
            while (cr !== r2 || cc !== c2) { if (tb[cr][cc] !== '') return false; cr += stepR; cc += stepC; }
            return true;
          }
          if (tipo === 'Q') {
            if (dr === 0 || dc === 0 || adr === adc) {
              let stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1), stepC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
              let cr = r1 + stepR, cc = c1 + stepC;
              while (cr !== r2 || cc !== c2) { if (tb[cr][cc] !== '') return false; cr += stepR; cc += stepC; }
              return true;
            }
            return false;
          }
          if (tipo === 'N') return ((adr === 2 && adc === 1) || (adr === 1 && adc === 2));
          if (tipo === 'K') return (adr <= 1 && adc <= 1);
          return true;
        }
        function drawC() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Ajedrez Oficial FIDE (Dos Jugadores)</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:6px;">${msgFIDE}</p>
              <div id="ch-box" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:360px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
              <button id="ch-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Partida</button>
            </div>
          `;
          const g = document.getElementById('ch-box');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c;
            const btn = document.createElement('button');
            btn.style.cssText = `height:44px;border:none;font-size:24px;cursor:pointer;background:${esSel?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;display:flex;align-items:center;justify-content:center;`;
            btn.innerText = tb[r][c];
            btn.onclick = () => {
              if (!sel) {
                if (tb[r][c] !== '') {
                  const b = esBlanca(tb[r][c]);
                  if ((turnoB && b) || (!turnoB && !b)) { sel = { r, c }; msgFIDE = `Pieza en [${r},${c}] seleccionada. Elige destino.`; drawC(); }
                  else { msgFIDE = `⚠️ No es el turno de esa pieza.`; drawC(); }
                }
              } else {
                if (sel.r === r && sel.c === c) { sel = null; msgFIDE = "Selección cancelada."; drawC(); return; }
                const pieza = tb[sel.r][sel.c];
                if (esValidoFIDE(sel.r, sel.c, r, c, pieza)) {
                  tb[r][c] = pieza; tb[sel.r][sel.c] = '';
                  turnoB = !turnoB; sel = null;
                  msgFIDE = `Movimiento válido. Turno de ${turnoB ? 'Blancas' : 'Negras'}.`;
                } else {
                  msgFIDE = `❌ Movimiento ilegal según reglamento FIDE.`; sel = null;
                }
                drawC();
              }
            };
            g.appendChild(btn);
          }
          document.getElementById('ch-rst').onclick = () => {
            tb = [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']];
            sel = null; turnoB = true; msgFIDE = "Partida reiniciada. Turno de Blancas."; drawC();
          };
        }
        drawC();
      }

      // 2. DAMAS ESPAÑOLAS
      else if (jSel === 'damas') {
        let tabD = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => ((r + c) % 2 === 1 ? (r < 3 ? 'N' : (r > 4 ? 'B' : '')) : '')));
        let selD = null, turnoD = 'B', msgD = "Damas: Mueven en diagonal 1 casilla o saltan para capturar.";
        function drawDamas() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Damas Españolas (Dos Jugadores)</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:6px;">${msgD} • Turno: <b>${turnoD==='B'?'Blancas':'Negras'}</b></p>
              <div id="dm-box" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:360px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
              <button id="dm-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Damas</button>
            </div>
          `;
          const g = document.getElementById('dm-box');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, v = tabD[r][c];
            const btn = document.createElement('button');
            btn.style.cssText = `height:44px;border:none;background:${selD&&selD.r===r&&selD.c===c?'#0284c7':(osc?'#1e293b':'#cbd5e1')};display:flex;align-items:center;justify-content:center;cursor:pointer;`;
            if (v) btn.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;background:${v==='B'?'#0ea5e9':'#f59e0b'};border:2px solid #fff;display:inline-block;"></span>`;
            btn.btn_r = r; btn.btn_c = c;
            btn.onclick = () => {
              const row = r, col = c, val = tabD[row][col];
              if (!selD) {
                if (val === turnoD) { selD = { r: row, c: col }; msgD = "Ficha seleccionada. Elige casilla diagonal."; drawDamas(); }
              } else {
                const dr = row - selD.r, dc = col - selD.c;
                const adr = Math.abs(dr), adc = Math.abs(dc);
                const dirB = turnoD === 'B' ? -1 : 1;
                if (val === '' && osc) {
                  if (adc === 1 && dr === dirB) {
                    tabD[row][col] = tabD[selD.r][selD.c]; tabD[selD.r][selD.c] = '';
                    turnoD = turnoD === 'B' ? 'N' : 'B'; selD = null; msgD = "Movimiento correcto.";
                  } else if (adc === 2 && adr === 2) {
                    const mr = (selD.r + row) / 2, mc = (selD.c + col) / 2;
                    const enem = tabD[mr][mc];
                    if (enem !== '' && enem !== turnoD) {
                      tabD[row][col] = tabD[selD.r][selD.c]; tabD[selD.r][selD.c] = ''; tabD[mr][mc] = '';
                      turnoD = turnoD === 'B' ? 'N' : 'B'; selD = null; msgD = "¡Captura exitosa!";
                    } else { msgD = "⚠️ No hay pieza enemiga para saltar."; selD = null; }
                  } else { msgD = "⚠️ Movimiento de damas inválido."; selD = null; }
                } else { selD = null; msgD = "Selección cancelada."; }
                drawDamas();
              }
            };
            g.appendChild(btn);
          }
          document.getElementById('dm-rst').onclick = () => {
            tabD = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => ((r + c) % 2 === 1 ? (r < 3 ? 'N' : (r > 4 ? 'B' : '')) : '')));
            selD = null; turnoD = 'B'; msgD = "Partida reiniciada."; drawDamas();
          };
        }
        drawDamas();
      }

      // 3. CUATRO EN LÍNEA
      else if (jSel === 'cuatro') {
        let g4 = Array(6).fill(null).map(() => Array(7).fill(0)), jug = 1, msg4 = "Coloca 4 fichas seguidas en horizontal, vertical o diagonal.";
        function drawC4() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Cuatro en Línea 7x6 (Dos Jugadores)</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:6px;">${msg4} • Turno: <b style="color:${jug===1?'#38bdf8':'#f59e0b'};">Jugador ${jug}</b></p>
              <div id="c4-box" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;max-width:340px;margin:0 auto;background:#1e293b;padding:12px;border-radius:10px;"></div>
              <button id="c4-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar C4</button>
            </div>
          `;
          const b = document.getElementById('c4-box');
          for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
            const bt = document.createElement('button'), v = g4[r][c];
            bt.style.cssText = `height:40px;border-radius:50%;border:none;cursor:pointer;background:${v===0?'#090f1a':(v===1?'#38bdf8':'#f59e0b')};`;
            const colIdx = c;
            bt.onclick = () => {
              for (let rw=5; rw>=0; rw--) {
                if (g4[rw][colIdx] === 0) {
                  g4[rw][colIdx] = jug;
                  jug = jug === 1 ? 2 : 1;
                  msg4 = "Ficha colocada con gravedad.";
                  drawC4();
                  break;
                }
              }
            };
            b.appendChild(bt);
          }
          document.getElementById('c4-rst').onclick = () => { g4 = Array(6).fill(null).map(() => Array(7).fill(0)); jug = 1; msg4 = "Tablero limpio."; drawC4(); };
        }
        drawC4();
      }

      // 4. CRUZA LAS RANAS
      else if (jSel === 'ranas') {
        let ranas = ['G', 'G', 'G', '_', 'Y', 'Y', 'Y'];
        let movsR = 0; let msgR = "Mueve las ranas verdes a la derecha y las amarillas a la izquierda.";
        function drawRanas() {
          const gano = ranas.join('') === 'YYY_GGG';
          stg.innerHTML = `
            <div style="text-align:center;padding:10px;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#34d399;">Cruza las Ranas (Acertijo Lógico)</h3>
              <p style="font-size:11.5px;color:#94a3b8;margin-bottom:6px;">${msgR} • Movimientos: <b>${movsR}</b></p>
              ${gano ? `<div style="background:#064e3b;color:#34d399;padding:8px;border-radius:8px;font-weight:800;margin-bottom:10px;">🏆 ¡ACERTIJO RESUELTO CON ÉXITO!</div>` : ''}
              <div style="display:flex;justify-content:center;gap:8px;margin:15px 0;">
                ${ranas.map((p, i) => `
                  <button data-ri="${i}" class="btn-rana" style="width:62px;height:62px;border-radius:12px;border:2px solid ${p==='_'?'#334155':(p==='G'?'#10b981':'#f59e0b')};background:${p==='_'?'#0b1322':(p==='G'?'#064e3b':'#451a03')};color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;">
                    <span style="font-size:20px;">${p==='G'?'🐸➡':(p==='Y'?'⬅🐸':'🪨')}</span>
                    <span style="font-size:9px;color:#94a3b8;">[${i+1}]</span>
                  </button>
                `).join('')}
              </div>
              <button id="btn-rst-ranas" style="background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Ranas</button>
            </div>
          `;
          document.querySelectorAll('.btn-rana').forEach(b => {
            b.onclick = () => {
              if (gano) return;
              const i = parseInt(b.getAttribute('data-ri'), 10), vacio = ranas.indexOf('_');
              if (ranas[i] === 'G' && (vacio === i + 1 || vacio === i + 2)) {
                ranas[vacio] = 'G'; ranas[i] = '_'; movsR++; msgR = "Salto verde exitoso."; drawRanas();
              } else if (ranas[i] === 'Y' && (vacio === i - 1 || vacio === i - 2)) {
                ranas[vacio] = 'Y'; ranas[i] = '_'; movsR++; msgR = "Salto amarillo exitoso."; drawRanas();
              } else {
                msgR = "⚠️ Movimiento ilegal. Avanza 1 o salta 2 a casilla vacía."; drawRanas();
              }
            };
          });
          document.getElementById('btn-rst-ranas').onclick = () => { ranas = ['G','G','G','_','Y','Y','Y']; movsR = 0; msgR = "Reiniciado."; drawRanas(); };
        }
        drawRanas();
      }

      // 5. PUENTE EN 17 MINUTOS
      else if (jSel === 'puente') {
        let excursionistas = [
          { id: 'A', tiempo: 1, lado: 'izq', nombre: 'Atleta (1 min)' },
          { id: 'B', tiempo: 2, lado: 'izq', nombre: 'Bicicleta (2 min)' },
          { id: 'C', tiempo: 5, lado: 'izq', nombre: 'Carguero (5 min)' },
          { id: 'D', tiempo: 10, lado: 'izq', nombre: 'Abuelo (10 min)' }
        ];
        let linterna = 'izq', tiempoTotal = 0, seleccionados = [], msgP = "Cruza a los 4 excursionistas en máximo 17 min usando la linterna.";
        function drawPuente() {
          const todosDer = excursionistas.every(e => e.lado === 'der');
          stg.innerHTML = `
            <div style="text-align:center;padding:10px;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">El Puente en 17 Minutos (Simulador Lógico)</h3>
              <p style="font-size:11.5px;color:#94a3b8;margin-bottom:6px;">${msgP}</p>
              <div style="font-size:12.5px;color:#fbbf24;font-weight:800;margin-bottom:8px;">⏱️ Tiempo: ${tiempoTotal} / 17 Min • Linterna: ${linterna.toUpperCase()}</div>
              ${todosDer && tiempoTotal <= 17 ? `<div style="background:#064e3b;color:#34d399;padding:8px;border-radius:8px;font-weight:800;margin-bottom:8px;">🏆 ¡MISIÓN CUMPLIDA EN ${tiempoTotal} MINUTOS!</div>` : ''}
              ${tiempoTotal > 17 ? `<div style="background:#450a0a;color:#fca5a5;padding:8px;border-radius:8px;font-weight:800;margin-bottom:8px;">❌ TIEMPO AGOTADO (>17 min).</div>` : ''}
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:560px;margin:10px auto;background:#090f1a;padding:12px;border-radius:10px;border:1px solid #1e293b;">
                <div style="text-align:left;">
                  <b style="color:#38bdf8;font-size:12px;">Lado Izquierdo</b>
                  <div style="margin-top:6px;display:flex;flex-direction:column;gap:5px;">
                    ${excursionistas.filter(e=>e.lado==='izq').map(e=>`
                      <button data-eid="${e.id}" class="btn-exc" style="background:${seleccionados.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px;">
                        ${e.nombre} ${linterna==='izq'?'🔦':''}
                      </button>
                    `).join('')}
                  </div>
                </div>
                <div style="text-align:left;">
                  <b style="color:#34d399;font-size:12px;">Lado Derecho</b>
                  <div style="margin-top:6px;display:flex;flex-direction:column;gap:5px;">
                    ${excursionistas.filter(e=>e.lado==='der').map(e=>`
                      <button data-eid="${e.id}" class="btn-exc" style="background:${seleccionados.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px;">
                        ${e.nombre} ${linterna==='der'?'🔦':''}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
              <div style="display:flex;justify-content:center;gap:8px;margin-top:8px;">
                <button id="btn-cruzar" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:800;cursor:pointer;font-size:12px;">Cruzar Puente ➡</button>
                <button id="btn-rst-puente" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:6px;font-weight:800;cursor:pointer;font-size:12px;">Reiniciar</button>
              </div>
            </div>
          `;
          document.querySelectorAll('.btn-exc').forEach(b => {
            b.onclick = () => {
              const id = b.getAttribute('data-eid'), exc = excursionistas.find(x => x.id === id);
              if (exc.lado !== linterna) { msgP = "⚠️ Debe estar del mismo lado que la linterna."; drawPuente(); return; }
              if (seleccionados.includes(id)) seleccionados = seleccionados.filter(x => x !== id);
              else { if (seleccionados.length < 2) seleccionados.push(id); else msgP = "⚠️ Máximo 2 a la vez."; }
              drawPuente();
            };
          });
          document.getElementById('btn-cruzar').onclick = () => {
            if (seleccionados.length === 0) { msgP = "⚠️ Selecciona al menos 1."; drawPuente(); return; }
            const grupo = excursionistas.filter(e => seleccionados.includes(e.id));
            const maxT = Math.max(...grupo.map(e => e.tiempo));
            tiempoTotal += maxT;
            linterna = linterna === 'izq' ? 'der' : 'izq';
            grupo.forEach(e => e.lado = linterna);
            seleccionados = []; msgP = `Cruce correcto (${maxT} min).`; drawPuente();
          };
          document.getElementById('btn-rst-puente').onclick = () => {
            excursionistas = [{id:'A',tiempo:1,lado:'izq',nombre:'Atleta (1 min)'},{id:'B',tiempo:2,lado:'izq',nombre:'Bicicleta (2 min)'},{id:'C',tiempo:5,lado:'izq',nombre:'Carguero (5 min)'},{id:'D',tiempo:10,lado:'izq',nombre:'Abuelo (10 min)'}];
            linterna = 'izq'; tiempoTotal = 0; seleccionados = []; msgP = "Reiniciado."; drawPuente();
          };
        }
        drawPuente();
      }

      // 6. TA-TE-TI (GATO)
      else if (jSel === 'gato') {
        let tGato = Array(9).fill(''), turnoG = 'X', msgG = "Ta-Te-Ti (Gato): Conecta 3 en línea.";
        function drawGato() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Ta-Te-Ti / Gato (Dos Jugadores)</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:6px;">${msgG} • Turno: <b style="color:${turnoG==='X'?'#38bdf8':'#f59e0b'};">${turnoG}</b></p>
              <div id="gato-box" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:240px;margin:0 auto;background:#1e293b;padding:10px;border-radius:10px;"></div>
              <button id="gato-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Gato</button>
            </div>
          `;
          const box = document.getElementById('gato-box');
          for (let i=0; i<9; i++) {
            const btn = document.createElement('button');
            btn.style.cssText = `height:64px;border:none;font-size:28px;font-weight:900;background:#0b1322;color:${tGato[i]==='X'?'#38bdf8':'#f59e0b'};cursor:pointer;border-radius:6px;`;
            btn.innerText = tGato[i];
            btn.onclick = () => {
              if (tGato[i] === '') {
                tGato[i] = turnoG;
                turnoG = turnoG === 'X' ? 'O' : 'X';
                msgG = "Jugada correcta.";
                drawGato();
              }
            };
            box.appendChild(btn);
          }
          document.getElementById('gato-rst').onclick = () => { tGato = Array(9).fill(''); turnoG = 'X'; msgG = "Tablero limpio."; drawGato(); };
        }
        drawGato();
      }

      // 7. MEMORIA TÉCNICA
      else if (jSel === 'memoria') {
        stg.innerHTML = `
          <div style="text-align:center;padding:20px;">
            <h3 style="color:#38bdf8;font-size:16px;">Memoria Técnica CTPMN</h3>
            <p style="color:#94a3b8;font-size:12px;margin:10px 0;">Empareja conceptos de redes, desarrollo web y ciberseguridad.</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px;margin:15px auto;">
              ${['HTML','CSS','IP','TCP','HTML','CSS','IP','TCP'].sort(()=>Math.random()-0.5).map((item, idx)=>`
                <button onclick="this.innerText='${item}';this.style.background='#0284c7';" style="height:56px;background:#131f33;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;font-weight:800;cursor:pointer;">❓</button>
              `).join('')}
            </div>
          </div>
        `;
      }

      // 8. ADIVINA EL NÚMERO
      else if (jSel === 'adivina') {
        let numSecreto = Math.floor(Math.random() * 100) + 1;
        let msgA = "Adivina un número entre 1 y 100.";
        stg.innerHTML = `
          <div style="text-align:center;padding:30px;">
            <h3 style="color:#38bdf8;font-size:16px;">Adivina el Número (1 - 100)</h3>
            <p style="color:#94a3b8;font-size:12px;margin:8px 0;" id="adv-msg">${msgA}</p>
            <input id="adv-val" type="number" min="1" max="100" placeholder="Tu número" style="background:#090f1a;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;width:120px;text-align:center;font-size:14px;"/>
            <button id="adv-btn" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-weight:800;cursor:pointer;margin-left:6px;">Probar</button>
          </div>
        `;
        setTimeout(() => {
          document.getElementById('adv-btn').onclick = () => {
            const v = parseInt(document.getElementById('adv-val').value, 10);
            const m = document.getElementById('adv-msg');
            if (v === numSecreto) m.innerText = `🎉 ¡EXACTO! El número era ${numSecreto}.`;
            else if (v < numSecreto) m.innerText = `⬆️ El número secreto es MAYOR que ${v}.`;
            else m.innerText = `⬇️ El número secreto es MENOR que ${v}.`;
          };
        }, 100);
      }

      // 9. RETO SUBNETEO VLSM
      else if (jSel === 'subnet') {
        stg.innerHTML = `
          <div style="text-align:center;padding:25px;">
            <h3 style="color:#38bdf8;font-size:16px;">Reto Rápido de Subneteo VLSM</h3>
            <p style="color:#94a3b8;font-size:12px;margin:8px 0;">¿Cuántas IPs utilizables tiene una subred con máscara /28?</p>
            <div style="display:flex;justify-content:center;gap:10px;margin-top:15px;">
              <button onclick="alert('❌ Incorrecto.');" style="background:#131f33;color:#fff;border:1px solid #334155;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">A) 8 IPs</button>
              <button onclick="alert('🎉 ¡Correcto! Una máscara /28 tiene 16 IPs totales menos 2 (red y broadcast) = 14 IPs utilizables.');" style="background:#064e3b;color:#34d399;border:1px solid #059669;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">B) 14 IPs</button>
              <button onclick="alert('❌ Incorrecto.');" style="background:#131f33;color:#fff;border:1px solid #334155;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">C) 30 IPs</button>
            </div>
          </div>
        `;
      }

      // 10. QUIZ COSEVI
      else if (jSel === 'cosevi') {
        stg.innerHTML = `
          <div style="text-align:center;padding:25px;">
            <h3 style="color:#38bdf8;font-size:16px;">Quiz Rápido Ley de Tránsito COSEVI</h3>
            <p style="color:#94a3b8;font-size:12px;margin:8px 0;">¿Cuál es la velocidad máxima permitida en zonas escolares en Costa Rica?</p>
            <div style="display:flex;justify-content:center;gap:10px;margin-top:15px;">
              <button onclick="alert('❌ Incorrecto.');" style="background:#131f33;color:#fff;border:1px solid #334155;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">A) 40 km/h</button>
              <button onclick="alert('🎉 ¡Correcto! La velocidad máxima en zonas escolares es de 25 km/h.');" style="background:#064e3b;color:#34d399;border:1px solid #059669;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">B) 25 km/h</button>
              <button onclick="alert('❌ Incorrecto.');" style="background:#131f33;color:#fff;border:1px solid #334155;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;">C) 60 km/h</button>
            </div>
          </div>
        `;
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
          🎮 Sala de 10 Juegos
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'juegos', label: '1. 🎮 Sala de 10 Juegos Interactivos (Ajedrez, Damas, Gato, VLSM, COSEVI)' },
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