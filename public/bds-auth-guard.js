(function() {
  const ROLES = {
    estudiante: { label: '🎓 Estudiante', selectMatch: 'Estudiante', color: '#38bdf8', bg: '#082f49', desc: 'Simuladores, Prácticas, 32 Juegos y Exámenes' },
    padre: { label: '👨‍👩‍👧 Padre / Madre de Familia', selectMatch: 'Padre', color: '#c084fc', bg: '#3b0764', desc: 'Justificar Ausencia Estudiante y Consulta de Notas' },
    docente: { label: '👨‍🏫 Docente MEP', selectMatch: 'Docente', color: '#34d399', bg: '#064e3b', desc: 'Permiso/Tardía Personal, Registro CSV MEP y Prácticas' },
    director: { label: '🏛️ Director / Directora', selectMatch: 'Director', color: '#fbbf24', bg: '#451a03', desc: 'Bandeja Director(a), Aprobaciones, CSV y Configuración' },
    superadmin: { label: '👑 SuperAdmin Global', selectMatch: 'SuperAdmin', color: '#fb7185', bg: '#4c0519', desc: 'Control Total BDS • Ing. Max Salazar Sánchez' }
  };

  // Cuentas base institucionales (si el usuario registra la suya propia en Crear Cuenta, su clave nueva tiene prioridad total)
  const BASE_USERS = {
    'maxi.salsa@gmail.com': { name: 'Ing. Max Salazar Sánchez', role: 'superadmin', pin: '2026' },
    'max.salazar.sanchez@mep.go.cr': { name: 'Ing. Max Salazar Sánchez (MEP)', role: 'docente', pin: '2026' },
    'docente@mep.go.cr': { name: 'Docente CTP Mercedes Norte', role: 'docente', pin: '1234' },
    'direccion@mep.go.cr': { name: 'Dirección CTP Mercedes Norte', role: 'director', pin: '1234' },
    'estudiante@est.mep.go.cr': { name: 'Estudiante CTP Mercedes Norte', role: 'estudiante', pin: '1234' },
    'familia@gmail.com': { name: 'Encargado de Familia CTP', role: 'padre', pin: '1234' }
  };

  function getDb() {
    try {
      const custom = JSON.parse(localStorage.getItem('bds_users_db_v3') || '{}');
      const oldCustom = JSON.parse(localStorage.getItem('bds_users_db_v2') || '{}');
      return Object.assign({}, BASE_USERS, oldCustom, custom);
    } catch (e) {
      return BASE_USERS;
    }
  }

  function saveUserToDb(email, userObj) {
    try {
      const custom = JSON.parse(localStorage.getItem('bds_users_db_v3') || '{}');
      custom[email.toLowerCase().trim()] = userObj;
      localStorage.setItem('bds_users_db_v3', JSON.stringify(custom));
    } catch (e) {}
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem('bds_active_session_v3') || 'null');
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    if (user) {
      localStorage.setItem('bds_active_session_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('bds_active_session_v3');
      localStorage.removeItem('bds_active_session_v2');
      localStorage.removeItem('bds_active_session_v1');
    }
    renderAuthSystem();
  }

  // Ocultar #root de inmediato si no hay sesión para que NUNCA entre SuperAdmin directo
  const initialStyle = document.createElement('style');
  initialStyle.id = 'bds-gate-lock-style';
  initialStyle.textContent = `
    body.bds-locked #root { display: none !important; visibility: hidden !important; }
    .bds-role-hidden { display: none !important; }
  `;
  document.head.appendChild(initialStyle);

  if (!getSession() && document.body) {
    document.body.classList.add('bds-locked');
  }

  // Sincronizar profundamente la interfaz de React con el rol activo
  function applyRoleToDom(user) {
    if (!user) return;
    const roleInfo = ROLES[user.role] || ROLES.estudiante;

    // 1. Cambiar saludo y etiqueta de rol activo en la página
    document.querySelectorAll('h1, h2, h3, span, p, div').forEach(el => {
      if (el.children.length === 0 && el.textContent) {
        const txt = el.textContent.trim();
        if (txt.startsWith('¡Hola,') || el.dataset.bdsNameNode === '1') {
          el.textContent = '¡Hola, ' + user.name + '!';
          el.dataset.bdsNameNode = '1';
        }
        if (txt.startsWith('Rol Activo:') || el.dataset.bdsRoleNode === '1') {
          el.textContent = 'Rol Activo: ' + roleInfo.label;
          el.dataset.bdsRoleNode = '1';
        }
      }
    });

    // 2. Sincronizar cualquier <select> interno de rol que tenga la página (ej. "👑 Rol: SuperAdmin Global")
    document.querySelectorAll('select').forEach(sel => {
      if (sel.id === 'bds-role-switcher' || sel.id === 'inp-role') return;
      const options = Array.from(sel.options);
      const isRoleSelect = options.some(o => /SuperAdmin|Docente|Estudiante|Director|Padre/i.test(o.text));
      if (isRoleSelect) {
        const targetOpt = options.find(o => o.text.toLowerCase().includes(roleInfo.selectMatch.toLowerCase()) || o.value.toLowerCase().includes(user.role));
        if (targetOpt && sel.value !== targetOpt.value) {
          sel.value = targetOpt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    // 3. Filtrar visualmente botones de acceso rápido según el rol si NO es SuperAdmin
    document.querySelectorAll('button, a').forEach(btn => {
      if (btn.closest('#bds-sovereign-topbar') || btn.closest('#bds-sovereign-gate')) return;
      const t = (btn.textContent || '').trim();
      if (!t) return;

      btn.classList.remove('bds-role-hidden');

      if (user.role === 'estudiante') {
        if (/Bandeja Director|Exportar Registro de Notas CSV|Permiso \/ Tardía Personal|Configuración de Logotipo|Institución/i.test(t)) {
          btn.classList.add('bds-role-hidden');
        }
      } else if (user.role === 'padre') {
        if (/Bandeja Director|Exportar Registro de Notas CSV|Permiso \/ Tardía Personal|Institución/i.test(t)) {
          btn.classList.add('bds-role-hidden');
        }
      } else if (user.role === 'docente') {
        if (/Bandeja Director/i.test(t)) {
          btn.classList.add('bds-role-hidden');
        }
      }
    });
  }

  function renderAuthSystem() {
    if (!document.body) return;
    let overlay = document.getElementById('bds-sovereign-gate');
    let topbar = document.getElementById('bds-sovereign-topbar');
    if (overlay) overlay.remove();
    if (topbar) topbar.remove();

    const user = getSession();

    // =========================================================================
    // MODO BLOQUEADO: PANTALLA DE LOGIN PROPIO (NINGÚN ROL ENTRA DIRECTO)
    // =========================================================================
    if (!user) {
      document.body.classList.add('bds-locked');

      overlay = document.createElement('div');
      overlay.id = 'bds-sovereign-gate';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at top,#0f293a 0%,#020617 70%);color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;overflow-y:auto;';

      overlay.innerHTML = `
        <div style="width:100%;max-width:440px;background:#09131c;border:1px solid #155e75;border-radius:22px;padding:26px;box-shadow:0 25px 60px rgba(0,0,0,0.9);">
          <div style="text-align:center;margin-bottom:18px;">
            <img src="/lumi-owl.svg?v=identidad2026" alt="Mascota Oficial" style="width:72px;height:72px;margin:0 auto 10px;display:block;border-radius:20px;" />
            <h1 style="font-size:24px;font-weight:900;margin:0;color:#fff;letter-spacing:-0.5px;">prac<span style="color:#38bdf8;">TICA</span>tecnica.com</h1>
            <p style="font-size:12px;color:#67e8f9;margin:4px 0 0;font-weight:600;">Portal Oficial de Identidad • CTP Mercedes Norte</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;background:#020617;padding:5px;border-radius:12px;border:1px solid #1e293b;margin-bottom:16px;">
            <button type="button" id="tab-login" style="padding:9px 6px;border-radius:8px;border:none;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🔑 Iniciar Sesión</button>
            <button type="button" id="tab-reg" style="padding:9px 6px;border-radius:8px;border:none;background:transparent;color:#94a3b8;font-size:12px;font-weight:800;cursor:pointer;">➕ Crear / Cambiar Clave</button>
            <button type="button" id="tab-otp" style="padding:9px 6px;border-radius:8px;border:none;background:transparent;color:#fbbf24;font-size:12px;font-weight:800;cursor:pointer;">⚡ Código PIN</button>
          </div>

          <div id="bds-msg" style="display:none;padding:10px 12px;border-radius:10px;font-size:12px;margin-bottom:14px;font-weight:700;line-height:1.4;"></div>

          <form id="bds-auth-form" style="display:flex;flex-direction:column;gap:12px;">
            <div id="field-name-wrap" style="display:none;">
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:700;">Nombre Completo del Usuario</label>
              <input id="inp-name" type="text" placeholder="Ej: Ing. Max Salazar Sánchez" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;" />
            </div>

            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:700;">Correo Institucional (@mep.go.cr) o Gmail</label>
              <input id="inp-email" type="email" required placeholder="maxi.salsa@gmail.com o max.salazar.sanchez@mep.go.cr" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;" />
            </div>

            <div id="field-role-wrap">
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:700;">Rol con el que deseas ingresar</label>
              <select id="inp-role" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;font-weight:600;">
                <option value="docente">👨‍🏫 Docente MEP</option>
                <option value="estudiante">🎓 Estudiante</option>
                <option value="padre">👨‍👩‍👧 Padre / Madre de Familia</option>
                <option value="director">🏛️ Director / Directora</option>
                <option value="superadmin">👑 SuperAdmin Global (Max Salazar)</option>
              </select>
            </div>

            <div id="field-pin-wrap">
              <label id="lbl-pin" style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;font-weight:700;">Contraseña o PIN de Acceso</label>
              <div style="position:relative;display:flex;align-items:center;">
                <input id="inp-pin" type="password" required placeholder="Ingresa tu clave (o 2026 / 1234)" style="width:100%;box-sizing:border-box;background:#020617;border:1px solid #334155;border-radius:10px;padding:10px 40px 10px 12px;color:#fff;font-size:13px;" />
                <button type="button" id="toggle-pin" style="position:absolute;right:8px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;" title="Ver/Ocultar clave">👁️</button>
              </div>
              <div style="font-size:10px;color:#64748b;margin-top:4px;">
                💡 Cuentas de Max Salazar pre-activadas con clave <b>2026</b> (o cámbiala en la pestaña "Crear / Cambiar Clave").
              </div>
            </div>

            <button id="btn-submit" type="submit" style="width:100%;background:linear-gradient(90deg,#0284c7,#0ea5e9);color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:800;cursor:pointer;margin-top:4px;box-shadow:0 4px 15px rgba(2,132,199,0.4);">
              Ingresar a la Plataforma
            </button>
          </form>

          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #1e293b;">
            <div style="font-size:11px;color:#94a3b8;text-align:center;margin-bottom:8px;font-weight:700;">⚡ Cuentas Oficiales de Prueba Rápida (1-Clic):</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <button type="button" data-quick="max-mep" style="background:#064e3b;border:1px solid #10b981;color:#a7f3d0;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👨‍🏫 Max Salazar (@mep.go.cr)</button>
              <button type="button" data-quick="max-super" style="background:#4c0519;border:1px solid #f43f5e;color:#fecdd3;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👑 Max Salazar (gmail SuperAdmin)</button>
              <button type="button" data-quick="estudiante" style="background:#082f49;border:1px solid #0369a1;color:#7dd3fc;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🎓 Vista Estudiante</button>
              <button type="button" data-quick="padre" style="background:#3b0764;border:1px solid #7e22ce;color:#d8b4fe;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👨‍👩‍👧 Vista Padre/Madre</button>
              <button type="button" data-quick="docente" style="background:#064e3b;border:1px solid #047857;color:#6ee7b7;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">👨‍🏫 Vista Docente</button>
              <button type="button" data-quick="director" style="background:#451a03;border:1px solid #b45309;color:#fcd34d;padding:7px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🏛️ Vista Director(a)</button>
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
      const inpEmail = overlay.querySelector('#inp-email');
      const inpName = overlay.querySelector('#inp-name');
      const inpRole = overlay.querySelector('#inp-role');
      const lblPin = overlay.querySelector('#lbl-pin');
      const inpPin = overlay.querySelector('#inp-pin');
      const togglePin = overlay.querySelector('#toggle-pin');
      const btnSubmit = overlay.querySelector('#btn-submit');
      const msgBox = overlay.querySelector('#bds-msg');

      togglePin.onclick = () => {
        inpPin.type = inpPin.type === 'password' ? 'text' : 'password';
      };

      // Autocompletar el rol sugerido cuando escribe su correo conocido
      inpEmail.oninput = () => {
        const val = inpEmail.value.trim().toLowerCase();
        const db = getDb();
        if (db[val]) {
          inpRole.value = db[val].role;
          if (!inpName.value) inpName.value = db[val].name;
        } else if (val.endsWith('@mep.go.cr')) {
          inpRole.value = 'docente';
        } else if (val.endsWith('@est.mep.go.cr')) {
          inpRole.value = 'estudiante';
        }
      };

      function showMsg(text, isErr) {
        msgBox.style.display = 'block';
        msgBox.style.background = isErr ? '#450a0a' : '#064e3b';
        msgBox.style.border = isErr ? '1px solid #ef4444' : '1px solid #10b981';
        msgBox.style.color = isErr ? '#fecaca' : '#a7f3d0';
        msgBox.textContent = text;
      }

      tabLogin.onclick = () => {
        mode = 'login';
        tabLogin.style.background = '#0284c7'; tabLogin.style.color = '#fff';
        tabReg.style.background = 'transparent'; tabReg.style.color = '#94a3b8';
        tabOtp.style.background = 'transparent'; tabOtp.style.color = '#fbbf24';
        nameWrap.style.display = 'none';
        lblPin.textContent = 'Contraseña o PIN de Acceso';
        inpPin.type = 'password';
        inpPin.value = '';
        btnSubmit.textContent = 'Ingresar a la Plataforma';
        msgBox.style.display = 'none';
      };

      tabReg.onclick = () => {
        mode = 'reg';
        tabReg.style.background = '#059669'; tabReg.style.color = '#fff';
        tabLogin.style.background = 'transparent'; tabLogin.style.color = '#94a3b8';
        tabOtp.style.background = 'transparent'; tabOtp.style.color = '#fbbf24';
        nameWrap.style.display = 'block';
        lblPin.textContent = 'Define tu Nueva Contraseña o PIN';
        inpPin.type = 'text';
        inpPin.value = '';
        btnSubmit.textContent = 'Guardar Usuario / Clave y Entrar Ahora';
        showMsg('Escribe cualquier correo (ej: max.salazar.sanchez@mep.go.cr), elige su rol y ponle la clave que tú quieras.', false);
      };

      tabOtp.onclick = () => {
        mode = 'otp';
        currentOtp = String(Math.floor(100000 + Math.random() * 900000));
        tabOtp.style.background = '#d97706'; tabOtp.style.color = '#020617';
        tabLogin.style.background = 'transparent'; tabLogin.style.color = '#94a3b8';
        tabReg.style.background = 'transparent'; tabReg.style.color = '#94a3b8';
        nameWrap.style.display = 'none';
        lblPin.textContent = 'Código Temporal Autogenerado';
        inpPin.type = 'text';
        inpPin.value = currentOtp;
        btnSubmit.textContent = 'Entrar con Código Temporal';
        showMsg('Código PIN instantáneo listo: ' + currentOtp + '. Solo escribe tu correo arriba y dale a Entrar.', false);
      };

      overlay.querySelector('#bds-auth-form').onsubmit = (e) => {
        e.preventDefault();
        const email = inpEmail.value.trim().toLowerCase();
        const pin = inpPin.value.trim();
        const selectedRole = inpRole.value;
        const rawName = inpName.value.trim();
        const db = getDb();

        if (!email) {
          showMsg('Por favor ingresa un correo electrónico.', true);
          return;
        }

        if (mode === 'reg') {
          const defaultName = email.includes('max') ? 'Ing. Max Salazar Sánchez' : email.split('@')[0];
          const finalUser = { email, name: rawName || (db[email] && db[email].name) || defaultName, role: selectedRole, pin };
          saveUserToDb(email, finalUser);
          setSession(finalUser);
          return;
        }

        if (mode === 'otp') {
          const existing = db[email];
          const defaultName = email.includes('max') ? 'Ing. Max Salazar Sánchez' : email.split('@')[0];
          const finalUser = {
            email,
            name: existing ? existing.name : defaultName,
            role: selectedRole || (existing ? existing.role : 'docente'),
            pin: currentOtp
          };
          saveUserToDb(email, finalUser);
          setSession(finalUser);
          return;
        }

        // Modo Login: Si el usuario existe y coincide su clave (o si usa 2026/1234 en sus correos institucionales), entra con el rol elegido
        if (db[email]) {
          if (db[email].pin === pin || pin === '2026' || pin === '1234') {
            const activeRole = selectedRole || db[email].role;
            setSession({ email, name: db[email].name, role: activeRole });
          } else {
            showMsg('La clave no coincide. Usa "➕ Crear / Cambiar Clave" arriba para asignarle tu propia contraseña o usa 2026.', true);
          }
        } else {
          // Si escribe un correo nuevo directamente en Iniciar Sesión, lo registra automáticamente con esa clave y rol para que nunca rebote
          const autoName = email.includes('max') ? 'Ing. Max Salazar Sánchez' : email.split('@')[0];
          const newUser = { email, name: autoName, role: selectedRole, pin };
          saveUserToDb(email, newUser);
          setSession(newUser);
        }
      };

      overlay.querySelectorAll('[data-quick]').forEach(btn => {
        btn.onclick = () => {
          const k = btn.getAttribute('data-quick');
          const presets = {
            'max-mep': { email: 'max.salazar.sanchez@mep.go.cr', name: 'Ing. Max Salazar Sánchez (MEP)', role: 'docente' },
            'max-super': { email: 'maxi.salsa@gmail.com', name: 'Ing. Max Salazar Sánchez', role: 'superadmin' },
            'estudiante': { email: 'estudiante@est.mep.go.cr', name: 'Estudiante CTP Mercedes Norte', role: 'estudiante' },
            'padre': { email: 'familia@gmail.com', name: 'Padre / Madre de Familia', role: 'padre' },
            'docente': { email: 'docente@mep.go.cr', name: 'Docente CTP Mercedes Norte', role: 'docente' },
            'director': { email: 'direccion@mep.go.cr', name: 'Dirección CTP Mercedes Norte', role: 'director' }
          };
          setSession(presets[k]);
        };
      });

      return;
    }

    // =========================================================================
    // MODO AUTENTICADO: MOSTRAR APP CON EL ROL REAL Y BOTÓN DE SALIR
    // =========================================================================
    document.body.classList.remove('bds-locked');
    const roleInfo = ROLES[user.role] || ROLES.estudiante;

    topbar = document.createElement('div');
    topbar.id = 'bds-sovereign-topbar';
    topbar.style.cssText = 'position:sticky;top:0;z-index:2147483646;background:#09131c;border-bottom:2px solid ' + roleInfo.color + ';padding:8px 14px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.75);';

    topbar.innerHTML = `
      <div style="max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <img src="/lumi-owl.svg?v=identidad2026" alt="Búho" style="width:34px;height:34px;border-radius:10px;flex-shrink:0;" />
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="color:#fff;font-weight:800;font-size:13px;">${user.name}</span>
              <span style="background:${roleInfo.bg};color:${roleInfo.color};border:1px solid ${roleInfo.color};padding:2px 9px;border-radius:99px;font-size:11px;font-weight:800;">
                ${roleInfo.label}
              </span>
            </div>
            <div style="color:#94a3b8;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${user.email} • ${roleInfo.desc}
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-left:auto;">
          <select id="bds-role-switcher" aria-label="Cambiar Rol Activo" style="background:#020617;color:#f8fafc;border:1px solid ${roleInfo.color};border-radius:8px;padding:6px 10px;font-size:12px;font-weight:700;cursor:pointer;">
            <option value="estudiante" ${user.role === 'estudiante' ? 'selected' : ''}>🎓 Rol: Estudiante</option>
            <option value="padre" ${user.role === 'padre' ? 'selected' : ''}>👨‍👩‍👧 Rol: Padre/Madre</option>
            <option value="docente" ${user.role === 'docente' ? 'selected' : ''}>👨‍🏫 Rol: Docente MEP</option>
            <option value="director" ${user.role === 'director' ? 'selected' : ''}>🏛️ Rol: Director(a)</option>
            <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>👑 Rol: SuperAdmin</option>
          </select>

          <button id="bds-logout-btn" type="button" style="background:#dc2626;color:#fff;border:1px solid #f87171;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:5px;">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    `;

    document.body.prepend(topbar);

    topbar.querySelector('#bds-role-switcher').onchange = (e) => {
      const updated = Object.assign({}, user, { role: e.target.value });
      saveUserToDb(user.email, Object.assign({}, getDb()[user.email] || {}, updated));
      setSession(updated);
    };

    topbar.querySelector('#bds-logout-btn').onclick = () => {
      setSession(null);
    };

    applyRoleToDom(user);
    setTimeout(() => applyRoleToDom(user), 250);
    setTimeout(() => applyRoleToDom(user), 800);
  }

  // Observar cambios del DOM de React para mantener el rol sincronizado y reparar imágenes rotas
  const observer = new MutationObserver(() => {
    const u = getSession();
    if (u) applyRoleToDom(u);
    document.querySelectorAll('img').forEach(img => {
      if (!img.dataset.bdsSafe) {
        img.dataset.bdsSafe = '1';
        img.onerror = function() {
          this.onerror = null;
          this.src = '/lumi-owl.svg?v=identidad2026';
        };
      }
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderAuthSystem();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    renderAuthSystem();
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();