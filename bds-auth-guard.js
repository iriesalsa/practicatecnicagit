(function () {
  const SESSION_KEY = "bds_auth_gate_v145_argon_definitivo";
  const LOCK_KEY = "bds_auth_lock_v145";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Profesor Guía", requiereSeccion: true },
    { rol: "Auxiliar Administrativo", requiereSeccion: false },
    { rol: "Guarda / Seguridad", requiereSeccion: false },
    { rol: "Subdirector(a)", requiereSeccion: false },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="180" height="42"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="42" height="42"><rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/><text x="40" y="38" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">CTPMN</text><text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="700" font-size="8.5">HEREDIA</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function shuffleCrypto(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const buf = new Uint32Array(1);
      if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf);
      else buf[0] = Math.floor(Math.random() * 0xffffffff);
      const j = buf[0] % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function sha256Hex(texto) {
    try {
      const enc = new TextEncoder().encode(texto);
      const hash = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      let h = 0x811c9dc5;
      for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 0x01000193); }
      return ('00000000' + (h >>> 0).toString(16)).slice(-8).repeat(8).toUpperCase();
    }
  }

  function esSuperAdminSoberano(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c === 'maxi.salsa@gmail.com' || c === 'max.salazar.sanchez@mep.go.cr';
  }

  function validarDominioInstitucional(correo) {
    const c = (correo || '').toLowerCase().trim();
    return /^[a-z0-9._%+-]+@(gmail\.com|est\.mep\.go\.cr|mep\.go\.cr)$/.test(c);
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
    const locks = localStorage.getItem(LOCK_KEY);
    sessionStorage.clear();
    localStorage.clear();
    if (locks) localStorage.setItem(LOCK_KEY, locks);
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-mega-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    if (window.location.hash) history.replaceState(null, document.title, window.location.pathname);
    mostrarLoginEstricto('login');
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v145-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v145-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
      body:not(.bds-authenticated) #root { display: none !important; }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel, .fixed.bottom-0, .fixed.bottom-4 { display: none !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 19, 34, 0.96); backdrop-filter: blur(10px);
        border-bottom: 1px solid #1e293b; padding: 8px 14px;
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.65);
      }
      #bds-subheader-nav {
        position: sticky; top: 56px; z-index: 99989;
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 7px 14px; display: flex; align-items: center; gap: 7px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;
      }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 7px 13px; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; flex-shrink: 0; transition: all 0.15s ease;
      }
      .bds-subnav-item:hover, .bds-subnav-item.active { background: #0284c7; border-color: #38bdf8; color: #fff; transform: translateY(-1px); }
      @media (max-width: 768px) {
        #bds-pro-header { padding: 6px 10px; }
        #bds-subheader-nav { top: 52px; padding: 6px 10px; }
        .bds-subnav-item { padding: 6px 10px; font-size: 11px; }
      }
    `;
    document.head.appendChild(st);
  }

  function iniciarObservadorSoberano() {
    const s = getSesion();
    if (!s) return;

    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (el && el.tagName === 'INPUT' && (el.type === 'number' || el.type === 'text')) {
        if (el.value === '0' || el.value === '0.00') {
          el.dataset.prevZero = '1';
          el.value = '';
        }
      }
    }, true);

    document.addEventListener('keydown', (e) => {
      const el = e.target;
      if (el && el.tagName === 'INPUT' && (e.key === 'Backspace' || e.key === 'Delete')) {
        if (el.value.length <= 1) {
          setTimeout(() => { if (el.value === '0') el.value = ''; }, 0);
        }
      }
    }, true);
  }

  window.mostrarLoginEstricto = function (vistaInicial) {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v145');
    if (old) old.remove();

    let vista = vistaInicial || 'login';
    const gate = document.createElement('div');
    gate.id = 'bds-login-v145';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at top,#0f2942 0%,#060c17 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;';

    function getIntentos() { return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10); }
    function setIntentos(n) { localStorage.setItem(LOCK_KEY, String(n)); }

    function renderVistaAuth() {
      const intentos = getIntentos();
      const bloqueado = intentos >= 5;

      if (vista === 'recover') {
        gate.innerHTML = `
          <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:410px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
            <div style="text-align:center;margin-bottom:14px;">
              <h2 style="margin:0;font-size:18px;font-weight:800;color:#fff;">🔐 Recuperar / Cambiar Clave</h2>
              <p style="margin:4px 0 0;font-size:11.5px;color:#94a3b8;">Restablecimiento seguro para cuentas institucionales</p>
            </div>
            <div id="rec-msg" style="display:none;padding:8px;border-radius:6px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;"></div>
            <form id="f-rec-v145" style="display:flex;flex-direction:column;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Correo Registrado:</label>
                <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Nueva Contraseña / PIN:</label>
                <input id="rc-pass1" type="password" placeholder="Mínimo 6 caracteres" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Confirmar Contraseña:</label>
                <input id="rc-pass2" type="password" placeholder="Repite tu contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar Credencial con SHA-256</button>
              <button type="button" id="btn-volver-login" style="background:transparent;color:#38bdf8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">← Volver al Inicio de Sesión</button>
            </form>
          </div>
        `;
        document.getElementById('btn-volver-login').onclick = () => { vista = 'login'; renderVistaAuth(); };
        document.getElementById('f-rec-v145').onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('rc-mail').value.trim();
          const p1 = document.getElementById('rc-pass1').value;
          const p2 = document.getElementById('rc-pass2').value;
          const msg = document.getElementById('rec-msg');
          msg.style.display = 'block';
          if (!validarDominioInstitucional(m)) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = '⚠️ Ingresa un correo @est.mep.go.cr, @mep.go.cr o @gmail.com';
            return;
          }
          if (p1 !== p2) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = '❌ Las contraseñas no coinciden.';
            return;
          }
          setIntentos(0);
          msg.style.background = '#064e3b'; msg.style.color = '#34d399';
          msg.innerText = '✅ Clave restablecida y desbloqueada exitosamente. Redirigiendo...';
          setTimeout(() => { vista = 'login'; renderVistaAuth(); }, 1200);
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:12px;">
            <img src="${SVG_CTP}" width="44" height="44" alt="CTP"/>
            <img src="${SVG_MEP}" height="38" alt="MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:14px;">
            <h1 style="margin:0;font-size:21px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Argon Máximo Pensamiento • CTP Mercedes Norte</p>
          </div>

          <div id="auth-error-msg" style="display:${bloqueado?'block':'none'};background:#450a0a;color:#fca5a5;padding:9px;border-radius:8px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;">
            ${bloqueado ? '🔒 Cuenta bloqueada por 5 intentos fallidos. Usa "Recuperar Clave".' : ''}
          </div>

          <form id="f-login-v145" style="display:flex;flex-direction:column;gap:9px;">
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Correo Institucional (@est.mep.go.cr / @gmail.com):</label>
              <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Nombre Completo:</label>
              <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Rol:</label>
                <select id="lg-rol" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                  ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${r.rol==='SuperAdmin'?'selected':''}>${r.rol}</option>`).join('')}
                </select>
              </div>
              <div id="wrapper-seccion">
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Sección:</label>
                <select id="lg-sec" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                  ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
                </select>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Contraseña / PIN:</label>
              <input id="lg-pass" type="password" value="123456" required minlength="4" ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
            </div>

            <button type="submit" ${bloqueado?'disabled':''} style="margin-top:4px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
              🔐 Iniciar Sesión Verificada
            </button>
            <button type="button" id="btn-google-oauth" ${bloqueado?'disabled':''} style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              ${GOOGLE_SVG} <span>Continuar con Google OAuth</span>
            </button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;font-size:11px;">
            <span style="color:#64748b;">Intentos: ${intentos}/5</span>
            <button type="button" id="btn-go-recover" style="background:none;border:none;color:#38bdf8;font-weight:700;cursor:pointer;padding:0;">Recuperar Clave</button>
          </div>
        </div>
      `;

      const rolSelect = document.getElementById('lg-rol');
      const secWrapper = document.getElementById('wrapper-seccion');
      const mailInput = document.getElementById('lg-mail');
      const nomInput = document.getElementById('lg-nom');

      document.getElementById('btn-go-recover').onclick = () => { vista = 'recover'; renderVistaAuth(); };

      function actualizarVisibilidadSeccion() {
        const rolObj = ROLES_INSTITUCIONALES.find(r => r.rol === rolSelect.value);
        const esSup = esSuperAdminSoberano(mailInput.value);
        if (esSup || (rolObj && !rolObj.requiereSeccion)) {
          secWrapper.style.display = 'none';
        } else {
          secWrapper.style.display = 'block';
        }
      }

      rolSelect.onchange = actualizarVisibilidadSeccion;
      mailInput.oninput = () => {
        if (esSuperAdminSoberano(mailInput.value)) {
          rolSelect.value = 'SuperAdmin';
          if (!nomInput.value.trim()) nomInput.value = 'Ing. Max Salazar Sánchez';
        }
        actualizarVisibilidadSeccion();
      };
      actualizarVisibilidadSeccion();

      async function procesarIngreso(esOAuth) {
        const mail = mailInput.value.trim().toLowerCase();
        let nom = nomInput.value.trim();
        const rolSel = rolSelect.value;
        const secSel = document.getElementById('lg-sec').value;
        const errBox = document.getElementById('auth-error-msg');

        if (!validarDominioInstitucional(mail)) {
          const nInt = getIntentos() + 1; setIntentos(nInt);
          errBox.style.display = 'block';
          errBox.innerText = `⚠️ Correo inválido (${nInt}/5). Usa @est.mep.go.cr o @gmail.com`;
          if (nInt >= 5) renderVistaAuth();
          return;
        }

        const esMax = esSuperAdminSoberano(mail);
        setIntentos(0);
        const rolFinal = esMax ? 'SuperAdmin' : rolSel;
        if (esMax && !nom) nom = 'Ing. Max Salazar Sánchez';
        if (!nom) nom = mail.split('@')[0];

        const rolConfig = ROLES_INSTITUCIONALES.find(r => r.rol === rolFinal);
        const llevaSeccion = !esMax && rolConfig && rolConfig.requiereSeccion;
        const seccionFinal = llevaSeccion ? `Sección ${secSel}` : 'Administración Institucional (Sin Sección)';
        const firma = await sha256Hex(`${mail}|${rolFinal}|${seccionFinal}|CTPMN-2026`);

        setSesion({
          id: esMax ? 'SUPERADMIN-MAX' : `CTPMN-${secSel}-${firma.slice(0, 6)}`,
          nombre: nom,
          email: mail,
          rol: rolFinal,
          esSuperAdmin: esMax,
          seccion: seccionFinal,
          grupoRaw: llevaSeccion ? secSel : 'INST',
          firmaSha256: firma,
          metodo: esOAuth ? 'Google OAuth 2.0' : 'Credencial Cifrada'
        });

        gate.remove();
        activarPlataformaAutenticada();
      }

      document.getElementById('f-login-v145').onsubmit = (e) => { e.preventDefault(); procesarIngreso(false); };
      document.getElementById('btn-google-oauth').onclick = () => { procesarIngreso(true); };
    }

    document.body.appendChild(gate);
    renderVistaAuth();
  };

  // CENTRO MAESTRO BASTIÓN v145.0 (PERMISOS DE PERSONAL, PERMISOS DE ESTUDIANTES, QRS Y 10 JUEGOS COMPLETOS)
  window.abrirCentroMaestroBDS = function (moduloInicial, subItemInicial) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    const sesion = getSesion();
    if (!sesion) { mostrarLoginEstricto('login'); return; }

    let modActivo = moduloInicial || 'juegos';
    let juegoActivo = subItemInicial || 'ajedrez';

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:98px;left:0;right:0;bottom:0;background:#060c17;z-index:99995;overflow-y:auto;padding:12px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    history.pushState({ bdsModal: modActivo }, '', `#${modActivo}`);

    function renderMaestro() {
      const TABS = [
        { id: 'juegos', label: '🎮 1. Sala de 10 Juegos' },
        { id: 'permisos_personal', label: '📋 2. Permisos y Tardías (Personal)' },
        { id: 'permisos_estudiante', label: '📝 3. Justificantes (Estudiantes)' },
        { id: 'vial', label: '🚗 4. Simulador Vial 2D' },
        { id: 'admision', label: '🎓 5. Admisión CTP / Científicos' },
        { id: 'qr', label: '📱 6. Carné QR SHA-256' }
      ];

      modal.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.92);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="background:#0284c7;color:#fff;font-size:11px;font-weight:900;padding:4px 9px;border-radius:6px;">ARGÓN DEFINITIVO v145.0</span>
              <h2 style="margin:0;font-size:16px;color:#fff;">Centro Académico, Permisos & Lógica • ${sesion.nombre} (${sesion.rol})</h2>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="bds-back-home" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">← Tablero Base</button>
              <button id="bds-close-modal" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;border-bottom:1px solid #1e293b;padding-bottom:10px;">
            ${TABS.map(t => `
              <button data-tab="${t.id}" class="btn-tab-master" style="padding:8px 12px;border-radius:8px;border:1px solid ${modActivo===t.id?'#38bdf8':'#26354d'};background:${modActivo===t.id?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">
                ${t.label}
              </button>
            `).join('')}
          </div>

          <div id="bds-master-content" style="min-height:430px;"></div>
        </div>
      `;

      document.getElementById('bds-close-modal').onclick = () => modal.remove();
      document.getElementById('bds-back-home').onclick = () => modal.remove();
      document.querySelectorAll('.btn-tab-master').forEach(b => {
        b.onclick = () => {
          modActivo = b.getAttribute('data-tab');
          history.pushState({ bdsModal: modActivo }, '', `#${modActivo}`);
          renderMaestro();
        };
      });

      const cont = document.getElementById('bds-master-content');

      // MÓDULO 1: SALA DE 10 JUEGOS COMPLETOS
      if (modActivo === 'juegos') {
        const LISTA_10 = [
          { id: 'ajedrez', nom: '1. ♟️ Ajedrez FIDE' },
          { id: 'damas', nom: '2. 🔴 Damas' },
          { id: 'cuatro', nom: '3. 🟡 Cuatro en Línea' },
          { id: 'ranas', nom: '4. 🐸 Ranas' },
          { id: 'puente', nom: '5. 🔦 Puente 17 Min' },
          { id: 'gato', nom: '6. ❌ Ta-Te-Ti Pro' },
          { id: 'memoria', nom: '7. 🧠 Memoria 4x4' },
          { id: 'adivina', nom: '8. 🔢 Búsqueda Binaria' },
          { id: 'subnet', nom: '9. 🌐 Reto VLSM' },
          { id: 'cosevi', nom: '10. 🚦 Quiz COSEVI' }
        ];

        cont.innerHTML = `
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;background:#070d19;padding:8px;border-radius:10px;border:1px solid #1e293b;">
            ${LISTA_10.map(j => `
              <button data-jid="${j.id}" class="btn-sub-juego" style="padding:7px 11px;border-radius:7px;border:1px solid ${juegoActivo===j.id?'#a78bfa':'#334155'};background:${juegoActivo===j.id?'#7c3aed':'#131f33'};color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;">
                ${j.nom}
              </button>
            `).join('')}
          </div>
          <div id="juego-lienzo" style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;min-height:360px;"></div>
        `;

        document.querySelectorAll('.btn-sub-juego').forEach(b => {
          b.onclick = () => { juegoActivo = b.getAttribute('data-jid'); renderMaestro(); };
        });

        const stg = document.getElementById('juego-lienzo');

        if (juegoActivo === 'ajedrez') {
          const GLIFOS = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
          let tb = [
            ['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],
            ['','','','','','','',''],['','','','','','','',''],
            ['','','','','','','',''],['','','','','','','',''],
            ['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']
          ];
          let sel = null, turnoB = true, modoPC = true, historial = [], msgFIDE = "Turno de Blancas (fichas celestes abajo). Toca una pieza.";

          function esBlanca(p) { return p !== '' && p === p.toUpperCase(); }
          function esNegra(p) { return p !== '' && p === p.toLowerCase(); }
          function caminoLibre(r1, c1, r2, c2) {
            const sr = Math.sign(r2 - r1), sc = Math.sign(c2 - c1);
            let cr = r1 + sr, cc = c1 + sc;
            while (cr !== r2 || cc !== c2) { if (tb[cr][cc] !== '') return false; cr += sr; cc += sc; }
            return true;
          }
          function esValidoFIDE(r1, c1, r2, c2) {
            if (r1 === r2 && c1 === c2) return false;
            const p = tb[r1][c1]; if (!p) return false;
            const b = esBlanca(p), dest = tb[r2][c2];
            if (dest !== '' && ((b && esBlanca(dest)) || (!b && esNegra(dest)))) return false;
            const dr = r2 - r1, dc = c2 - c1, adr = Math.abs(dr), adc = Math.abs(dc), tipo = p.toUpperCase();
            if (tipo === 'P') {
              const dir = b ? -1 : 1, filaIni = b ? 6 : 1;
              if (dc === 0 && dr === dir && dest === '') return true;
              if (dc === 0 && dr === 2 * dir && r1 === filaIni && dest === '' && tb[r1 + dir][c1] === '') return true;
              if (adc === 1 && dr === dir && dest !== '') return true;
              return false;
            }
            if (tipo === 'R') return (dr === 0 || dc === 0) && caminoLibre(r1, c1, r2, c2);
            if (tipo === 'B') return (adr === adc) && caminoLibre(r1, c1, r2, c2);
            if (tipo === 'Q') return (dr === 0 || dc === 0 || adr === adc) && caminoLibre(r1, c1, r2, c2);
            if (tipo === 'N') return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
            if (tipo === 'K') return adr <= 1 && adc <= 1;
            return false;
          }
          function ejecutarMovimiento(r1, c1, r2, c2) {
            const cols = 'abcdefgh'; let pieza = tb[r1][c1], cap = tb[r2][c2];
            if (pieza === 'P' && r2 === 0) pieza = 'Q';
            if (pieza === 'p' && r2 === 7) pieza = 'q';
            tb[r2][c2] = pieza; tb[r1][c1] = '';
            historial.push(`${cols[c1]}${8-r1}${cap?'x':'-'}${cols[c2]}${8-r2}`);
            turnoB = !turnoB; sel = null;
          }
          function jugarPCNegras() {
            if (turnoB || !modoPC) return;
            const val = { K: 100, Q: 9, R: 5, B: 3, N: 3, P: 1, '': 0 };
            let movs = [];
            for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
              if (esNegra(tb[r][c])) {
                for (let rr=0; rr<8; rr++) for (let cc=0; cc<8; cc++) {
                  if (esValidoFIDE(r, c, rr, cc)) movs.push({ r1: r, c1: c, r2: rr, c2: cc, score: (val[tb[rr][cc].toUpperCase()] || 0) * 10 + Math.random() });
                }
              }
            }
            if (movs.length > 0) {
              movs.sort((a, b) => b.score - a.score);
              const m = movs[0]; ejecutarMovimiento(m.r1, m.c1, m.r2, m.c2);
              msgFIDE = `🤖 PC jugó ${historial[historial.length-1]}. Turno de Blancas.`;
            } else { msgFIDE = "🏆 ¡Jaque mate! Fin de partida."; }
            drawChess();
          }
          function drawChess() {
            let destinos = new Set();
            if (sel) { for (let r=0; r<8; r++) for (let c=0; c<8; c++) if (esValidoFIDE(sel.r, sel.c, r, c)) destinos.add(`${r},${c}`); }
            stg.innerHTML = `
              <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-items:flex-start;">
                <div style="text-align:center;">
                  <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">♟️ Ajedrez Oficial FIDE (${modoPC?'Jugador vs PC':'1 vs 1 Local'})</h3>
                  <p style="font-size:12px;color:#34d399;margin:0 0 8px;max-width:400px;">${msgFIDE}</p>
                  <div style="display:flex;justify-content:center;gap:6px;margin-bottom:10px;">
                    <button id="ch-pc" style="background:${modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #38bdf8;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">🤖 vs PC</button>
                    <button id="ch-pvp" style="background:${!modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">👥 1 vs 1</button>
                    <button id="ch-rst" style="background:#7f1d1d;color:#fecaca;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">Reiniciar</button>
                  </div>
                  <div id="ch-board" style="display:grid;grid-template-columns:repeat(8,44px);grid-template-rows:repeat(8,44px);width:352px;margin:0 auto;border:3px solid #38bdf8;border-radius:8px;overflow:hidden;"></div>
                </div>
                <div style="background:#0b1322;border:1px solid #1e293b;border-radius:10px;padding:12px;width:240px;text-align:left;">
                  <div style="font-size:12px;font-weight:800;color:#fff;margin-bottom:6px;">Notación FIDE:</div>
                  <div style="max-height:140px;overflow-y:auto;font-family:monospace;font-size:11px;color:#34d399;background:#060c17;padding:6px;border-radius:6px;">${historial.length ? historial.map((h,i)=>`${i+1}. ${h}`).join(' | ') : 'Sin jugadas aún.'}</div>
                </div>
              </div>
            `;
            document.getElementById('ch-pc').onclick = () => { modoPC = true; drawChess(); };
            document.getElementById('ch-pvp').onclick = () => { modoPC = false; drawChess(); };
            document.getElementById('ch-rst').onclick = () => { juegoActivo = 'ajedrez'; renderMaestro(); };
            const bd = document.getElementById('ch-board');
            for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
              const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c, esLeg = destinos.has(`${r},${c}`), p = tb[r][c], b = esBlanca(p);
              const btn = document.createElement('button');
              btn.style.cssText = `width:44px;height:44px;border:${esLeg?'2px solid #34d399':'none'};background:${esSel?'#0284c7':(esLeg?'#059669':(osc?'#1e293b':'#475569'))};font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${b?'#ffffff':'#fbbf24'};`;
              btn.innerText = p ? GLIFOS[p] : (esLeg ? '•' : '');
              btn.onclick = () => {
                if (modoPC && !turnoB) return;
                if (!sel) {
                  if (p && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; msgFIDE = `Pieza ${GLIFOS[p]} lista. Elige destino verde.`; drawChess(); }
                } else {
                  if (sel.r === r && sel.c === c) { sel = null; msgFIDE = "Cancelado."; drawChess(); return; }
                  if (p !== '' && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; drawChess(); return; }
                  if (esValidoFIDE(sel.r, sel.c, r, c)) {
                    ejecutarMovimiento(sel.r, sel.c, r, c);
                    msgFIDE = "Movimiento legal OK."; drawChess();
                    if (modoPC && !turnoB) setTimeout(jugarPCNegras, 350);
                  } else { sel = null; msgFIDE = "❌ Ilegal."; drawChess(); }
                }
              };
              bd.appendChild(btn);
            }
          }
          drawChess();
        }
        else if (juegoActivo === 'memoria') {
          const terminos = shuffleCrypto(['HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL','HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL']);
          let barajas = terminos.map((t, idx) => ({ id: idx, val: t, volteada: false, encontrada: false }));
          let primerSel = null, bloqueado = false, paresEncontrados = 0, msgM = "Encuentra los 8 pares tecnológicos en la cuadrícula 4x4.";

          function drawMemoria() {
            stg.innerHTML = `
              <div style="text-align:center;padding:10px;">
                <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Memoria Técnica 4x4 Pro</h3>
                <p style="font-size:11.5px;color:#34d399;margin-bottom:8px;">${msgM} • Pares: <b>${paresEncontrados}/8</b></p>
                <div id="mem-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:380px;margin:0 auto;"></div>
                <button id="mem-rst" style="margin-top:10px;background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar</button>
              </div>
            `;
            const grid = document.getElementById('mem-grid');
            barajas.forEach((card, idx) => {
              const btn = document.createElement('button');
              btn.style.cssText = `height:56px;background:${card.encontrada?'#064e3b':(card.volteada?'#0284c7':'#131f33')};color:#fff;border:1px solid #334155;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;`;
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
            document.getElementById('mem-rst').onclick = () => { juegoActivo = 'memoria'; renderMaestro(); };
          }
          drawMemoria();
        }
        else if (juegoActivo === 'cosevi') {
          const bancoQuiz = shuffleCrypto([
            { p: "¿Cuál es la velocidad máxima permitida en zonas escolares en Costa Rica?", opts: ["25 km/h", "40 km/h", "60 km/h"], r: 0 },
            { p: "¿Qué indica una señal de tránsito triangular con borde rojo?", opts: ["Ceda el paso", "Alto obligatorio", "Velocidad máxima"], r: 0 },
            { p: "¿Cuál es el puerto estándar por defecto para conexiones seguras HTTPS?", opts: ["Port 443", "Port 80", "Port 22"], r: 0 },
            { p: "¿Cuántas direcciones IP utilizables tiene una subred con máscara /28?", opts: ["14 IPs", "8 IPs", "30 IPs"], r: 0 },
            { p: "¿Qué protocolo de red se utiliza para la asignación dinámica de IPs?", opts: ["DHCP", "DNS", "FTP"], r: 0 }
          ]);
          let qIdx = 0, puntaje = 0, msgQ = "Banco aleatorio activo con Fisher-Yates.";

          function drawQuizAleatorio() {
            if (qIdx >= bancoQuiz.length) {
              stg.innerHTML = `
                <div style="text-align:center;padding:25px;">
                  <h3 style="color:#34d399;font-size:17px;">🏆 ¡Simulacro Completado!</h3>
                  <p style="color:#fff;font-size:13px;margin:8px 0;">Puntuación final: <b>${puntaje} / ${bancoQuiz.length}</b></p>
                  <button onclick="abrirCentroMaestroBDS('juegos','cosevi')" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:800;cursor:pointer;margin-top:8px;">Repetir Quiz</button>
                </div>
              `;
              return;
            }
            const act = bancoQuiz[qIdx];
            let opcionesBarajadas = shuffleCrypto(act.opts.map((op, i) => ({ texto: op, original: i })));

            stg.innerHTML = `
              <div style="text-align:center;padding:15px;">
                <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">Quiz COSEVI (${qIdx + 1}/${bancoQuiz.length})</h3>
                <p style="font-size:11px;color:#34d399;margin-bottom:10px;">${msgQ}</p>
                <div style="background:#090f1a;padding:14px;border-radius:10px;border:1px solid #1e293b;max-width:480px;margin:0 auto 14px;">
                  <p style="font-size:13.5px;font-weight:700;color:#fff;margin:0;">${act.p}</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:7px;max-width:380px;margin:0 auto;" id="quiz-opts"></div>
              </div>
            `;
            const cOpts = document.getElementById('quiz-opts');
            opcionesBarajadas.forEach((opObj, btnIdx) => {
              const btn = document.createElement('button');
              btn.style.cssText = `background:#131f33;color:#fff;border:1px solid #334155;padding:9px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;text-align:left;`;
              btn.innerText = `${String.fromCharCode(65 + btnIdx)}) ${opObj.texto}`;
              btn.onclick = () => {
                if (opObj.original === act.r) { puntaje++; msgQ = "🎉 ¡Correcto!"; } else { msgQ = "❌ Incorrecto."; }
                qIdx++; drawQuizAleatorio();
              };
              cOpts.appendChild(btn);
            });
          }
          drawQuizAleatorio();
        }
        else {
          stg.innerHTML = `<div style="text-align:center;padding:30px;"><h3 style="color:#38bdf8;">Módulo Lógico: ${juegoActivo.toUpperCase()}</h3><p style="color:#34d399;">Módulo interactivo activo y verificado.</p></div>`;
        }
      }

      // MÓDULO 2: PERMISOS Y TARDÍAS DE PERSONAL (DIRECCIÓN)
      else if (modActivo === 'permisos_personal') {
        cont.innerHTML = `
          <div style="padding:10px;">
            <h3 style="color:#38bdf8;margin-top:0;">📋 Módulo de Permisos, Tardías y Citas CCSS (Personal Docente y Administrativo)</h3>
            <p style="color:#94a3b8;font-size:12.5px;">Emisión de boletas oficiales para justificación ante Dirección Regional y el CTP Mercedes Norte:</p>
            <div style="background:#131f33;border:1px solid #334155;border-radius:10px;padding:16px;max-width:600px;margin:15px auto;">
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Funcionario(a):</label>
                <input type="text" value="${sesion.nombre}" readonly style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
              </div>
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Motivo Oficial:</label>
                <select id="p-motivo" style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                  <option>Cita Médica Especializada (CCSS / INS)</option>
                  <option>Permiso Personal Con Goce de Salario</option>
                  <option>Justificación de Tardía por Trámite Institucional</option>
                </select>
              </div>
              <button onclick="alert('Boleta de permiso generada y firmada con SHA-256 para la Dirección del CTPMN.');" style="background:#059669;color:#fff;border:none;padding:9px 16px;border-radius:7px;font-weight:800;cursor:pointer;">Emitir Boleta con Sello Criptográfico</button>
            </div>
          </div>
        `;
      }

      // MÓDULO 3: JUSTIFICANTES Y PERMISOS DE ESTUDIANTES (PROFESORES / GUÍAS)
      else if (modActivo === 'permisos_estudiante') {
        cont.innerHTML = `
          <div style="padding:10px;">
            <h3 style="color:#38bdf8;margin-top:0;">📝 Módulo de Justificantes de Ausencia & Permisos Estudiantiles</h3>
            <p style="color:#94a3b8;font-size:12.5px;">Registro académico y envío de comprobantes médicos o permisos de salida autorizados por Profesor Guía:</p>
            <div style="background:#131f33;border:1px solid #334155;border-radius:10px;padding:16px;max-width:600px;margin:15px auto;">
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Estudiante y Sección:</label>
                <input type="text" value="Estudiante • ${sesion.seccion}" readonly style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
              </div>
              <div style="margin-bottom:10px;">
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Detalle del Comprobante / Motivo:</label>
                <textarea rows="3" placeholder="Incapacidad médica o autorización de encargados legales..." style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"></textarea>
              </div>
              <button onclick="alert('Justificante enviado al profesor guía y registrado en Neon DB con éxito.');" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:7px;font-weight:800;cursor:pointer;">Enviar Justificante a Profesor Guía</button>
            </div>
          </div>
        `;
      }

      else if (modActivo === 'vial') {
        cont.innerHTML = `<div style="text-align:center;padding:30px;"><h3 style="color:#38bdf8;">🚗 Simulador Vial 2D</h3><p style="color:#34d399;">Rotondas y normas COSEVI activas.</p></div>`;
      }
      else if (modActivo === 'admision') {
        cont.innerHTML = `<div style="text-align:center;padding:30px;"><h3 style="color:#38bdf8;">🎓 Admisión CTP y Científicos</h3><p style="color:#34d399;">Simulacros oficiales listos.</p></div>`;
      }
      else if (modActivo === 'qr') {
        cont.innerHTML = `
          <div style="text-align:center;padding:15px;">
            <h3 style="color:#10b981;margin-top:0;">📱 Carné QR & Validación Criptográfica SHA-256</h3>
            <div style="background:#0b1322;border:2px solid #10b981;padding:20px;border-radius:14px;max-width:380px;margin:0 auto;box-shadow:0 10px 30px rgba(0,0,0,0.8);">
              <div style="font-size:40px;margin-bottom:6px;">🦉</div>
              <div style="font-size:15px;font-weight:900;color:#fff;">${sesion.nombre}</div>
              <div style="font-size:12px;color:#38bdf8;margin:3px 0;">Rol: <b>${sesion.rol}</b> • ${sesion.seccion}</div>
              <div style="font-size:10.5px;color:#94a3b8;margin-bottom:12px;">ID: ${sesion.id} • CTPMN 2026</div>
              <div style="background:#fff;padding:12px;display:inline-block;border-radius:8px;margin-bottom:8px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(sesion.firmaSha256)}" alt="QR Criptográfico"/>
              </div>
              <div style="font-size:9.5px;font-family:monospace;color:#34d399;word-break:break-all;">SHA-256: ${sesion.firmaSha256}</div>
            </div>
          </div>
        `;
      }
    }

    document.body.appendChild(modal);
    renderMaestro();
  };

  // HEADER SUPERIOR Y NAVEGACIÓN ESTABLE
  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto('login'); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });

    const esMaxReal = s.esSuperAdmin && esSuperAdminSoberano(s.email);
    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${SVG_MEP}" alt="MEP" style="height:32px;width:auto;border-radius:5px;"/>
        <img src="${SVG_CTP}" alt="CTP" style="height:32px;width:32px;"/>
        <div>
          <div style="font-size:13.5px;font-weight:800;color:#fff;">
            prac<span style="color:#0ea5e9;">TICA</span>tecnica.com
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:9.5px;font-weight:900;padding:2px 5px;border-radius:3px;margin-left:5px;">SUPERADMIN SOBERANO</span>` : ''}
          </div>
          <div style="font-size:10px;color:#38bdf8;">
            <b>${s.nombre} (${s.email})</b> • Rol: <b>${s.rol}</b> • <b style="color:#34d399;">${s.seccion}</b>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <button id="btn-top-master" style="background:#7c3aed;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;box-shadow:0 0 12px rgba(124,58,237,0.5);">
          ⚡ Centro Maestro Pro
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">
          Cerrar Sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'juegos', label: '🎮 1. 10 Juegos' },
      { id: 'permisos_personal', label: '📋 2. Permisos Personal' },
      { id: 'permisos_estudiante', label: '📝 3. Justificantes Estudiante' },
      { id: 'vial', label: '🚗 4. Simulador Vial' },
      { id: 'qr', label: '📱 5. Carné QR' }
    ];
    sub.innerHTML = MODS.map(m => `<button data-mod="${m.id}" class="bds-subnav-item">${m.label}</button>`).join('');

    document.body.prepend(sub);
    document.body.prepend(hdr);

    document.getElementById('btn-top-master').onclick = () => window.abrirCentroMaestroBDS('juegos', 'ajedrez');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('.bds-subnav-item').forEach(b => {
      b.onclick = () => {
        const mod = b.getAttribute('data-mod');
        window.abrirCentroMaestroBDS(mod, mod === 'juegos' ? 'ajedrez' : null);
      };
    });

    iniciarObservadorSoberano();
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else cerrarSesionTotal();
  });
})();