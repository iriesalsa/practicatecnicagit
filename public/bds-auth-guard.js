(function() {
  const ROLES = {
    estudiante: { label: '🎓 Estudiante', color: '#38bdf8', bg: '#082f49', desc: 'Simuladores, Prácticas, 32 Juegos y Mis Notas' },
    padre: { label: '👨‍👩‍👧 Padre / Madre / Encargado', color: '#c084fc', bg: '#3b0764', desc: 'Justificar Ausencias, Tardías y Consulta de Notas' },
    docente: { label: '👨‍🏫 Docente MEP', color: '#34d399', bg: '#064e3b', desc: 'Registro CSV MEP, Justificaciones y Planeamiento' },
    director: { label: '🏛️ Director / Directora', color: '#fbbf24', bg: '#451a03', desc: 'Bandeja Dirección, Permisos, Tardías y Configuración' },
    superadmin: { label: '👑 SuperAdmin Global', color: '#fb7185', bg: '#4c0519', desc: 'Control Total BDS • Ing. Max Salazar Sánchez' }
  };

  const DEFAULT_USERS = {
    'maxi.salsa@gmail.com': { name: 'Ing. Max Salazar Sánchez', role: 'superadmin', pin: '2026' },
    'docente@mep.go.cr': { name: 'Docente CTP Mercedes Norte', role: 'docente', pin: '1234' },
    'direccion@mep.go.cr': { name: 'Dirección CTP Mercedes Norte', role: 'director', pin: '1234' },
    'estudiante@est.mep.go.cr': { name: 'Estudiante CTP', role: 'estudiante', pin: '1234' },
    'familia@gmail.com': { name: 'Encargado de Familia', role: 'padre', pin: '1234' }
  };

  function getDb() {
    try {
      return Object.assign({}, DEFAULT_USERS, JSON.parse(localStorage.getItem('bds_users_db_v2') || '{}'));
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem('bds_active_session_v2') || 'null');
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    if (user) {
      localStorage.setItem('bds_active_session_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('bds_active_session_v2');
    }
    renderAuthSystem();
  }

  function syncPageWithRole(user) {
    if (!user) return;
    const roleInfo = ROLES[user.role] || ROLES.estudiante;
    document.querySelectorAll('h1, h2, h3, span, div').forEach(el => {
      if (el.children.length === 0 && el.textContent.includes('¡Hola, Ing. Max Salazar Sánchez!')) {
        el.textContent = '¡Hola, ' + user.name + '!';
        el.dataset.bdsDynamicName = 'true';
      } else if (el.dataset && el.dataset.bdsDynamicName === 'true') {
        el.textContent = '¡Hola, ' + user.name + '!';
      }
      if (el.children.length === 0 && (el.textContent.trim() === 'Rol Activo: SuperAdmin' || el.dataset.bdsDynamicRole === 'true')) {
        el.textContent = 'Rol Activo: ' + roleInfo.label;
        el.dataset.bdsDynamicRole = 'true';
      }
    });
  }

  function renderAuthSystem() {
    let overlay = document.getElementById('bds-sovereign-gate');
    let topbar = document.getElementById('bds-sovereign-topbar');
    if (overlay) overlay.remove();
    if (topbar) topbar.remove();

    const user = getSession();
    const root = document.getElementById('root') || document.body;

    // SI NO HAY SESIÓN: BLOQUEAR Y MOSTRAR PANTALLA DE LOGIN PROPIO
    if (!user) {
      if (document.getElementById('root')) document.getElementById('root').style.display = 'none';

      overlay = document.createElement('div');
      overlay.id = 'bds-sovereign-gate';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#020617;color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;overflow-y:auto;';

      overlay.innerHTML = `
        <div style="width:100%;max-width:430px;background:#0f172a;border:1px solid #1e293b;border-radius:20px;padding:28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
          <div style="text-align:center;margin-bottom:20px;">
            <img src="/lumi-owl.svg" alt="Búho" style="width:68px;height:68px;margin:0 auto 10px;display:block;" />
            <h1 style="font-size:24px;font-weight:900;margin:0;color:#fff;">prac<span style="color:#38bdf8;">TICA</span>tecnica.com</h1>
            <p style="font-size:12px;color:#94a3b8;margin:4px 0 0;">Acceso Institucional Protegido • CTP Mercedes Norte</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;background:#020617;padding:5px;border-radius:12px;border:1px solid #1e293b;margin-bottom:16px;">
            <button id="tab-login" style="padding:8px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Ingresar</button>
            <button id="tab-reg" style="padding:8px;border-radius:8px;border:none;background:transparent;color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;">Crear Cuenta</button>
            <button id="tab-otp" style="padding:8px;border-radius:8px;border:none;background:transparent;color:#fbbf24;font-size:12px;font-weight:700;cursor:pointer;">Código Pin</button>
          </div>

          <div id="bds-msg" style="display:none;padding:10px 12px;border-radius:10px;font-size:12px;margin-bottom:14px;font-weight:600;"></div>

          <form id="bds-auth-form" style="display:flex;flex-direction:column;gap:12px;">
            <div id="field-name-wrap" style="display:none;">
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">Nombre Completo</label>
              <input id="inp-name" type="text" placeholder="Ej: Ana María Rojas" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;" />
            </div>

            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">Correo Electrónico (MEP o Personal)</label>
              <input id="inp-email" type="email" required placeholder="usuario@est.mep.go.cr" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;" />
            </div>

            <div id="field-role-wrap" style="display:none;">
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">Selecciona tu Rol Institucional</label>
              <select id="inp-role" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;">
                <option value="estudiante">🎓 Estudiante</option>
                <option value="padre">👨‍👩‍👧 Padre / Madre de Familia</option>
                <option value="docente">👨‍🏫 Docente MEP</option>
                <option value="director">🏛️ Director / Directora</option>
              </select>
            </div>

            <div id="field-pin-wrap">
              <label id="lbl-pin" style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:600;">PIN o Contraseña</label>
              <input id="inp-pin" type="password" required placeholder="••••" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;" />
            </div>

            <button id="btn-submit" type="submit" style="width:100%;background:#0284c7;color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;margin-top:4px;">
              Iniciar Sesión Segura
            </button>
          </form>

          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #1e293b;">
            <div style="font-size:11px;color:#94a3b8;text-align:center;margin-bottom:10px;font-weight:600;">⚡ Ingreso Directo 1-Clic por Rol (Pruebas y Demostración):</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <button data-quick="estudiante" style="background:#082f49;border:1px solid #0369a1;color:#7dd3fc;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🎓 Estudiante</button>
              <button data-quick="padre" style="background:#3b0764;border:1px solid #7e22ce;color:#d8b4fe;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👨‍👩‍👧 Padre / Madre</button>
              <button data-quick="docente" style="background:#064e3b;border:1px solid #047857;color:#6ee7b7;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👨‍🏫 Docente MEP</button>
              <button data-quick="director" style="background:#451a03;border:1px solid #b45309;color:#fcd34d;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🏛️ Director(a)</button>
              <button data-quick="superadmin" style="grid-column:span 2;background:#4c0519;border:1px solid #be123c;color:#fda4af;padding:8px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">👑 SuperAdmin (Ing. Max Salazar Sánchez)</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      let mode = 'login';
      let currentOtp = '';
      const tabLogin = overlay.querySelector('#tab-login');
      const tabReg = overlay.querySelector('#tab-reg');
      const tabOtp = overlay.querySelector('#tab-otp');
      const nameWrap = overlay.querySelector('#field-name-wrap');
      const roleWrap = overlay.querySelector('#field-role-wrap');
      const lblPin = overlay.querySelector('#lbl-pin');
      const inpPin = overlay.querySelector('#inp-pin');
      const btnSubmit = overlay.querySelector('#btn-submit');
      const msgBox = overlay.querySelector('#bds-msg');

      function showMsg(text, isErr) {
        msgBox.style.display = 'block';
        msgBox.style.background = isErr ? '#450a0a' : '#064e3b';
        msgBox.style.border = isErr ? '1px solid #dc2626' : '1px solid #10b981';
        msgBox.style.color = isErr ? '#fecaca' : '#a7f3d0';
        msgBox.textContent = text;
      }

      tabLogin.onclick = () => {
        mode = 'login';
        tabLogin.style.background = '#0284c7'; tabLogin.style.color = '#fff';
        tabReg.style.background = 'transparent'; tabReg.style.color = '#94a3b8';
        tabOtp.style.background = 'transparent'; tabOtp.style.color = '#fbbf24';
        nameWrap.style.display = 'none';
        roleWrap.style.display = 'none';
        lblPin.textContent = 'PIN o Contraseña';
        inpPin.type = 'password';
        inpPin.placeholder = '•••• (Ej: 2026 o 1234)';
        btnSubmit.textContent = 'Iniciar Sesión Segura';
        msgBox.style.display = 'none';
      };

      tabReg.onclick = () => {
        mode = 'reg';
        tabReg.style.background = '#059669'; tabReg.style.color = '#fff';
        tabLogin.style.background = 'transparent'; tabLogin.style.color = '#94a3b8';
        tabOtp.style.background = 'transparent'; tabOtp.style.color = '#fbbf24';
        nameWrap.style.display = 'block';
        roleWrap.style.display = 'block';
        lblPin.textContent = 'Crear PIN o Contraseña';
        inpPin.type = 'password';
        inpPin.placeholder = 'Mínimo 4 dígitos';
        btnSubmit.textContent = 'Registrar Mi Cuenta y Entrar';
        msgBox.style.display = 'none';
      };

      tabOtp.onclick = () => {
        mode = 'otp';
        currentOtp = String(Math.floor(100000 + Math.random() * 900000));
        tabOtp.style.background = '#d97706'; tabOtp.style.color = '#020617';
        tabLogin.style.background = 'transparent'; tabLogin.style.color = '#94a3b8';
        tabReg.style.background = 'transparent'; tabReg.style.color = '#94a3b8';
        nameWrap.style.display = 'none';
        roleWrap.style.display = 'block';
        lblPin.textContent = 'Ingresa este Código Temporal Verificado';
        inpPin.type = 'text';
        inpPin.value = currentOtp;
        btnSubmit.textContent = 'Verificar Código y Entrar';
        showMsg('Código Temporal Instantáneo generado: ' + currentOtp, false);
      };

      overlay.querySelector('#bds-auth-form').onsubmit = (e) => {
        e.preventDefault();
        const email = overlay.querySelector('#inp-email').value.trim().toLowerCase();
        const pin = inpPin.value.trim();
        const role = overlay.querySelector('#inp-role').value;
        const name = overlay.querySelector('#inp-name').value.trim();
        const db = getDb();

        if (mode === 'login') {
          if (db[email] && db[email].pin === pin) {
            setSession({ email, name: db[email].name, role: db[email].role });
          } else {
            showMsg('Usuario o PIN incorrecto. Puedes usar "Crear Cuenta" o "Código Pin".', true);
          }
        } else if (mode === 'reg') {
          const custom = JSON.parse(localStorage.getItem('bds_users_db_v2') || '{}');
          const finalName = name || email.split('@')[0];
          custom[email] = { name: finalName, role, pin };
          localStorage.setItem('bds_users_db_v2', JSON.stringify(custom));
          setSession({ email, name: finalName, role });
        } else if (mode === 'otp') {
          if (pin === currentOtp) {
            const existing = db[email];
            setSession({
              email,
              name: existing ? existing.name : email.split('@')[0],
              role: existing ? existing.role : role
            });
          } else {
            showMsg('Código temporal incorrecto.', true);
          }
        }
      };

      overlay.querySelectorAll('[data-quick]').forEach(btn => {
        btn.onclick = () => {
          const r = btn.getAttribute('data-quick');
          const map = {
            estudiante: { email: 'estudiante@est.mep.go.cr', name: 'Estudiante CTP Mercedes Norte', role: 'estudiante' },
            padre: { email: 'familia@gmail.com', name: 'Padre / Madre de Familia', role: 'padre' },
            docente: { email: 'docente@mep.go.cr', name: 'Docente CTP Mercedes Norte', role: 'docente' },
            director: { email: 'direccion@mep.go.cr', name: 'Dirección CTP Mercedes Norte', role: 'director' },
            superadmin: { email: 'maxi.salsa@gmail.com', name: 'Ing. Max Salazar Sánchez', role: 'superadmin' }
          };
          setSession(map[r]);
        };
      });

      return;
    }

    // SI SÍ HAY SESIÓN: MOSTRAR APP Y BARRA SUPERIOR CON BOTÓN CERRAR SESIÓN Y CAMBIO DE ROL
    if (document.getElementById('root')) document.getElementById('root').style.display = '';
    const roleInfo = ROLES[user.role] || ROLES.estudiante;

    topbar = document.createElement('div');
    topbar.id = 'bds-sovereign-topbar';
    topbar.style.cssText = 'position:sticky;top:0;z-index:99999;background:#090d16;border-bottom:2px solid #0284c7;padding:8px 14px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.6);';

    topbar.innerHTML = `
      <div style="max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <img src="/lumi-owl.svg" alt="Búho" style="width:30px;height:30px;border-radius:8px;flex-shrink:0;" />
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="color:#fff;font-weight:800;font-size:13px;">${user.name}</span>
              <span style="background:${roleInfo.bg};color:${roleInfo.color};border:1px solid ${roleInfo.color};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;">
                ${roleInfo.label}
              </span>
            </div>
            <div style="color:#94a3b8;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${user.email} • ${roleInfo.desc}
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-left:auto;">
          <select id="bds-role-switcher" aria-label="Cambiar Rol" style="background:#020617;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:700;cursor:pointer;">
            <option value="estudiante" ${user.role === 'estudiante' ? 'selected' : ''}>🎓 Vista: Estudiante</option>
            <option value="padre" ${user.role === 'padre' ? 'selected' : ''}>👨‍👩‍👧 Vista: Padre/Madre</option>
            <option value="docente" ${user.role === 'docente' ? 'selected' : ''}>👨‍🏫 Vista: Docente</option>
            <option value="director" ${user.role === 'director' ? 'selected' : ''}>🏛️ Vista: Director(a)</option>
            <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>👑 Vista: SuperAdmin</option>
          </select>

          <button id="bds-logout-btn" type="button" style="background:#dc2626;color:#fff;border:1px solid #f87171;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:5px;box-shadow:0 2px 8px rgba(220,38,38,0.4);">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    `;

    document.body.prepend(topbar);

    topbar.querySelector('#bds-role-switcher').onchange = (e) => {
      const updated = Object.assign({}, user, { role: e.target.value });
      setSession(updated);
    };

    topbar.querySelector('#bds-logout-btn').onclick = () => {
      setSession(null);
    };

    syncPageWithRole(user);
    setTimeout(() => syncPageWithRole(user), 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAuthSystem);
  } else {
    renderAuthSystem();
  }
})();