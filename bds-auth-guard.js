(function () {
  const SESSION_KEY = "bds_auth_gate_v132_randomquiz";
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
    if (document.getElementById('bds-v132-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v132-css';
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
    let old = document.getElementById('bds-login-v132');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v132';
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

        <form id="f-login-v132" style="display:flex;flex-direction:column;gap:10px;">
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

    document.getElementById('f-login-v132').onsubmit = (e) => {
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

  // SALA DE ARCADIAS 10 JUEGOS CON QUIZ ALEATORIO INFINITO (FISHER-YATES)
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
        { id: 'memoria', nom: '7. Memoria 4x4 Pro' },
        { id: 'adivina', nom: '8. Adivina el Número' },
        { id: 'subnet', nom: '9. Reto Subneteo VLSM' },
        { id: 'cosevi', nom: '10. Quiz Aleatorio COSEVI' }
      ];

      modal.innerHTML = `
        <div style="max-width:1160px;margin:0 auto;background:#0b1322;border:1.5px solid #7c3aed;border-radius:14px;padding:20px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:6px;">ARCADE SUPREMO v132</span>
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
        let sel = null; let turnoB = true; let modoPC = false;
        let msgFIDE = "Turno de Blancas. Reglas FIDE exactas.";

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

        function moverPC() {
          if (!turnoB && modoPC) {
            let movs = [];
            for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
              if (esNegra(tb[r][c])) {
                for (let rr=0; rr<8; rr++) for (let cc=0; cc<8; cc++) {
                  if (esValidoFIDE(r, c, rr, cc, tb[r][c])) movs.push({r1:r, c1:c, r2:rr, c2:cc});
                }
              }
            }
            if (movs.length > 0) {
              const m = movs[Math.floor(Math.random() * movs.length)];
              tb[m.r2][m.c2] = tb[m.r1][m.c1]; tb[m.r1][m.c1] = '';
              turnoB = true; msgFIDE = "La PC (Negras) movió. Turno Blancas.";
            } else { msgFIDE = "Jaque mate o tablas."; }
            drawC();
          }
        }

        function drawC() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Ajedrez Oficial FIDE (${modoPC ? 'vs PC' : '1 vs 1'})</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:6px;">${msgFIDE} • Turno: <b style="color:${turnoB?'#38bdf8':'#f59e0b'};">${turnoB?'Blancas':'Negras'}</b></p>
              <div style="margin-bottom:8px;">
                <button id="btn-pvp" style="background:${!modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;">1 vs 1</button>
                <button id="btn-pc" style="background:${modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;">vs PC</button>
              </div>
              <div id="ch-box" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:350px;margin:0 auto;border:3px solid #334155;border-radius:8px;overflow:hidden;"></div>
              <button id="ch-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar</button>
            </div>
          `;
          document.getElementById('btn-pvp').onclick = () => { modoPC = false; msgFIDE = "Modo 1 vs 1."; drawC(); };
          document.getElementById('btn-pc').onclick = () => { modoPC = true; msgFIDE = "Modo vs PC."; drawC(); };
          const g = document.getElementById('ch-box');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c;
            const btn = document.createElement('button');
            btn.style.cssText = `height:43px;border:none;font-size:24px;cursor:pointer;background:${esSel?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;display:flex;align-items:center;justify-content:center;`;
            btn.innerText = tb[r][c];
            btn.onclick = () => {
              if (modoPC && !turnoB) return;
              if (!sel) {
                if (tb[r][c] !== '') {
                  const b = esBlanca(tb[r][c]);
                  if ((turnoB && b) || (!turnoB && !b)) { sel = { r, c }; msgFIDE = "Pieza seleccionada."; drawC(); }
                  else { msgFIDE = "⚠️ No es tu turno."; drawC(); }
                }
              } else {
                if (sel.r === r && sel.c === c) { sel = null; msgFIDE = "Cancelado."; drawC(); return; }
                const pieza = tb[sel.r][sel.c];
                if (esValidoFIDE(sel.r, sel.c, r, c, pieza)) {
                  tb[r][c] = pieza; tb[sel.r][sel.c] = '';
                  turnoB = !turnoB; sel = null; msgFIDE = "Movimiento OK.";
                  drawC();
                  if (modoPC && !turnoB) setTimeout(moverPC, 600);
                } else { msgFIDE = "❌ Ilegal."; sel = null; drawC(); }
              }
            };
            g.appendChild(btn);
          }
          document.getElementById('ch-rst').onclick = () => {
            tb = [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']];
            sel = null; turnoB = true; msgFIDE = "Reiniciado."; drawC();
          };
        }
        drawC();
      }

      // 7. MEMORIA TÉCNICA 4X4 PRO (ALEATORIEDAD REAL)
      else if (jSel === 'memoria') {
        const terminos = ['HTML','CSS','JS','React','IP','TCP','VLAN','Subnet','HTML','CSS','JS','React','IP','TCP','VLAN','Subnet'].sort(() => Math.random() - 0.5);
        let barajas = terminos.map((t, idx) => ({ id: idx, val: t, volteada: false, encontrada: false }));
        let primerSel = null, bloqueado = false, paresEncontrados = 0, msgM = "Encuentra los 8 pares tecnológicos.";

        function drawMemoria() {
          stg.innerHTML = `
            <div style="text-align:center;padding:10px;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Memoria Técnica CTPMN (Cuadrícula 4x4 Pro)</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:8px;">${msgM} • Pares: <b>${paresEncontrados}/8</b></p>
              <div id="mem-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:380px;margin:0 auto;"></div>
              <button id="mem-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar</button>
            </div>
          `;
          const grid = document.getElementById('mem-grid');
          barajas.forEach((card, idx) => {
            const btn = document.createElement('button');
            btn.style.cssText = `height:60px;background:${card.encontrada?'#064e3b':(card.volteada?'#0284c7':'#131f33')};color:#fff;border:1px solid #334155;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;`;
            btn.innerText = (card.volteada || card.encontrada) ? card.val : '❓';
            btn.onclick = () => {
              if (bloqueado || card.volteada || card.encontrada) return;
              card.volteada = true; drawMemoria();
              if (!primerSel) {
                primerSel = { idx, val: card.val };
              } else {
                bloqueado = true;
                if (primerSel.val === card.val) {
                  barajas[primerSel.idx].encontrada = true; barajas[idx].encontrada = true;
                  paresEncontrados++; primerSel = null; bloqueado = false;
                  msgM = paresEncontrados === 8 ? "🏆 ¡EXCELENTE!" : "¡Par correcto!";
                  drawMemoria();
                } else {
                  msgM = "No coinciden.";
                  setTimeout(() => {
                    barajas[primerSel.idx].volteada = false; card.volteada = false;
                    primerSel = null; bloqueado = false; msgM = "Sigue buscando..."; drawMemoria();
                  }, 800);
                }
              }
            };
            grid.appendChild(btn);
          });
          document.getElementById('mem-rst').onclick = () => abrirSalaJuegosHD('memoria');
        }
        drawMemoria();
      }

      // 10. QUIZ ALEATORIO INFINITO COSEVI & TÉCNICO (FISHER-YATES)
      else if (jSel === 'cosevi') {
        const bancoQuiz = [
          { p: "¿Cuál es la velocidad máxima permitida en zonas escolares en Costa Rica?", opts: ["25 km/h", "40 km/h", "60 km/h"], r: 0 },
          { p: "¿Qué indica una señal de tránsito triangular con borde rojo?", opts: ["Ceda el paso", "Alto obligatorio", "Velocidad máxima"], r: 0 },
          { p: "¿Cuál es el puerto estándar por defecto para conexiones seguras HTTPS?", opts: ["Port 443", "Port 80", "Port 22"], r: 0 },
          { p: "¿Cuántas direcciones IP utilizables tiene una subred con máscara /28?", opts: ["14 IPs", "8 IPs", "30 IPs"], r: 0 },
          { p: "¿Qué protocolo de red se utiliza para la asignación dinámica de IPs?", opts: ["DHCP", "DNS", "FTP"], r: 0 }
        ].sort(() => Math.random() - 0.5);

        let qIdx = 0, puntaje = 0, msgQ = "Banco aleatorio activo con Fisher-Yates.";

        function drawQuizAleatorio() {
          if (qIdx >= bancoQuiz.length) {
            stg.innerHTML = `
              <div style="text-align:center;padding:30px;">
                <h3 style="color:#34d399;font-size:18px;">🏆 ¡Simulacro Completado con Éxito!</h3>
                <p style="color:#fff;font-size:14px;margin:10px 0;">Puntuación final: <b>${puntaje} / ${bancoQuiz.length}</b></p>
                <button onclick="abrirSalaJuegosHD('cosevi')" style="background:#0284c7;color:#fff;border:none;padding:9px 18px;border-radius:8px;font-weight:800;cursor:pointer;margin-top:10px;">Repetir Quiz Aleatorio</button>
              </div>
            `;
            return;
          }

          const act = bancoQuiz[qIdx];
          // Barajar opciones con Fisher-Yates
          let opcionesBarajadas = act.opts.map((op, i) => ({ texto: op, original: i }));
          opcionesBarajadas.sort(() => Math.random() - 0.5);

          stg.innerHTML = `
            <div style="text-align:center;padding:20px;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Quiz Aleatorio Dinámico CTPMN (${qIdx + 1}/${bancoQuiz.length})</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:12px;">${msgQ}</p>
              <div style="background:#090f1a;padding:16px;border-radius:10px;border:1px solid #1e293b;max-width:500px;margin:0 auto 16px;">
                <p style="font-size:14px;font-weight:700;color:#fff;margin:0;">${act.p}</p>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;max-width:400px;margin:0 auto;" id="quiz-opts"></div>
            </div>
          `;

          const cOpts = document.getElementById('quiz-opts');
          opcionesBarajadas.forEach((opObj, btnIdx) => {
            const btn = document.createElement('button');
            btn.style.cssText = `background:#131f33;color:#fff;border:1px solid #334155;padding:10px 14px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;text-align:left;`;
            btn.innerText = `${String.fromCharCode(65 + btnIdx)}) ${opObj.texto}`;
            btn.onclick = () => {
              if (opObj.original === act.r) {
                puntaje++; msgQ = "🎉 ¡Respuesta Correcta!";
              } else {
                msgQ = "❌ Respuesta Incorrecta.";
              }
              qIdx++;
              drawQuizAleatorio();
            };
            cOpts.appendChild(btn);
          });
        }
        drawQuizAleatorio();
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
          🎮 Sala de 10 Juegos Pro
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'juegos', label: '1. 🎮 Sala de 10 Juegos Supremos (Memoria 4x4, Ajedrez con vs PC, Quiz Aleatorio)' },
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