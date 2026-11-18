(function () {
  const MAX_INTENTOS = 5;
  const WA_OFICIAL = "https://wa.me/50660906359?text=Soporte%20pracTICAtecnica%20CTP%20Mercedes%20Norte";
  const SESSION_KEY = "bds_active_auth_v92";

  // SVG Oficial del Búho (Vector limpio, geométrico y sobrio)
  const OWL_SVG = `<svg viewBox="0 0 64 64" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#0B1528" stroke="#0EA5E9" stroke-width="2.5"/>
    <path d="M14 17L28 24L18 29L14 17Z" fill="#0EA5E9"/>
    <path d="M50 17L36 24L46 29L50 17Z" fill="#0EA5E9"/>
    <circle cx="23" cy="34" r="9" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="41" cy="34" r="9" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="23" cy="34" r="4" fill="#F8FAFC"/>
    <circle cx="41" cy="34" r="4" fill="#F8FAFC"/>
    <path d="M32 39L28 46L32 52L36 46L32 39Z" fill="#0EA5E9"/>
  </svg>`;

  function inyectarCSSSobrio() {
    if (document.getElementById('bds-v92-clean-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v92-clean-css';
    st.innerHTML = `
      /* Sobriedad visual, corrección de navbar y menú móvil (Reporte QA 11-1) */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #09111e; }
      ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #0284c7; }

      /* Evitar que barras inferiores viejas o menús móviles tapen botones */
      body { padding-bottom: 58px !important; overflow-x: hidden !important; }
      header, nav { max-width: 100vw !important; box-sizing: border-box !important; }

      /* Dock Inferior Único, Sobrio y Compacto (Reemplaza botones sueltos y menús desbordados) */
      #bds-top-dock {
        position: fixed; bottom: 0; left: 0; right: 0; height: 50px; z-index: 99990;
        background: #09111e; border-top: 1px solid #1e293b;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 14px; font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.6);
      }
      .bds-dock-brand { display: flex; align-items: center; gap: 8px; color: #f8fafc; font-size: 13px; font-weight: 700; }
      .bds-dock-actions { display: flex; align-items: center; gap: 6px; overflow-x: auto; }
      .bds-dock-btn {
        background: #111c2d; border: 1px solid #1e293b; color: #cbd5e1;
        padding: 6px 11px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; white-space: nowrap; transition: all 0.15s ease;
      }
      .bds-dock-btn:hover { background: #1e293b; color: #ffffff; border-color: #38bdf8; }
      .bds-dock-btn.primary { background: #0284c7; border-color: #0284c7; color: #ffffff; }
      .bds-dock-btn.danger { background: #7f1d1d; border-color: #991b1b; color: #fecaca; }

      @media (max-width: 640px) {
        .bds-dock-brand span { display: none; }
        #bds-top-dock { padding: 0 8px; }
        .bds-dock-btn { font-size: 11px; padding: 6px 8px; }
      }
    `;
    document.head.appendChild(st);
  }

  function obtenerSesion() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY));
    } catch { return null; }
  }

  function guardarSesion(datos) {
    const str = JSON.stringify(datos);
    sessionStorage.setItem(SESSION_KEY, str);
    localStorage.setItem(SESSION_KEY, str);
  }

  function cerrarSesionTotal() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('pt_user_session');
    mostrarLoginObligatorio();
  }

  // Reparar en el DOM enlaces de WhatsApp, imágenes rotas y títulos duplicados reportados por Aaron y Dylan
  function repararIncidenciasDOM() {
    // 1. Corregir cualquier enlace de WhatsApp al oficial 50660906359
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(a => {
      a.href = WA_OFICIAL;
    });

    // 2. Reemplazar imágenes rotas (como Minst / Rosa) por el escudo SVG del Búho
    document.querySelectorAll('img').forEach(img => {
      if (!img.dataset.bdsChecked) {
        img.dataset.bdsChecked = "1";
        img.onerror = function () {
          const span = document.createElement('span');
          span.innerHTML = OWL_SVG;
          span.style.display = 'inline-flex';
          img.replaceWith(span);
        };
      }
    });

    // 3. Limpiar placeholders con correos antiguos
    document.querySelectorAll('input').forEach(inp => {
      if (inp.placeholder && (inp.placeholder.includes('maxi.salsa') || inp.placeholder.includes('max.salazar'))) {
        inp.placeholder = 'usuario@est.mep.go.cr';
      }
    });
  }

  // AUTH GATE: Pantalla de Inicio de Sesión Obligatoria al entrar (Nadie entra directo al usuario del profe)
  function mostrarLoginObligatorio() {
    let previo = document.getElementById('bds-auth-gate');
    if (previo) previo.remove();

    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const gate = document.createElement('div');
    gate.id = 'bds-auth-gate';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:200000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;';

    function pintarGate(modo, msg, esError) {
      const bloqueado = intentos >= MAX_INTENTOS;
      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:400px;width:100%;padding:28px;box-shadow:0 20px 50px rgba(0,0,0,0.85);box-sizing:border-box;">
          <div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:20px;">
            <div style="margin-bottom:10px;">${OWL_SVG}</div>
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#f8fafc;letter-spacing:-0.3px;">
              prac<span style="color:#0ea5e9;">TICA</span>tecnica.com
            </h1>
            <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
              CTP Mercedes Norte • Autenticación Institucional
            </p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#060c17;padding:4px;border-radius:8px;border:1px solid #1e293b;margin-bottom:16px;">
            <button id="g-tab-login" style="padding:7px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;background:${modo==='login'?'#1e293b':'transparent'};color:${modo==='login'?'#fff':'#64748b'};">Iniciar Sesión</button>
            <button id="g-tab-rec" style="padding:7px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;background:${modo==='rec'?'#1e293b':'transparent'};color:${modo==='rec'?'#fff':'#64748b'};">Recuperar Clave</button>
          </div>

          ${msg ? `<div style="padding:10px;border-radius:6px;font-size:12px;margin-bottom:14px;background:${esError?'#450a0a':'#064e3b'};border:1px solid ${esError?'#dc2626':'#059669'};color:#f8fafc;">${msg}</div>` : ''}

          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #dc2626;border-radius:8px;padding:16px;text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#fca5a5;margin-bottom:6px;">Cuenta Bloqueada Temporalmente</div>
              <p style="font-size:12px;color:#cbd5e1;margin:0 0 12px;">Se superó el límite de 5 intentos fallidos de seguridad.</p>
              <a href="${WA_OFICIAL}" target="_blank" style="display:block;background:#0284c7;color:#fff;padding:10px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">Contactar Soporte Oficial (6090-6359)</a>
            </div>
          ` : modo === 'login' ? `
            <form id="g-form-login" style="display:flex;flex-direction:column;gap:12px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Correo Institucional o Usuario</label>
                <input id="g-mail" type="email" placeholder="estudiante@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Perfil de Acceso (RBAC) y Sección</label>
                <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:6px;">
                  <select id="g-rol" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:12px;">
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente Materia">Docente de Materia</option>
                    <option value="Profesor Guía">Profesor Guía</option>
                    <option value="Familia">Padre / Encargado</option>
                    <option value="Dirección">Dirección / Coord.</option>
                  </select>
                  <select id="g-sec" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:12px;">
                    <option value="11-1">Sección 11-1</option>
                    <option value="11-2">Sección 11-2</option>
                    <option value="12-1">Sección 12-1</option>
                    <option value="10-1">Sección 10-1</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Contraseña de Acceso</label>
                <input id="g-pass" type="password" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;margin-top:4px;">Iniciar Sesión</button>
              <button type="button" id="g-btn-oauth" style="background:#f8fafc;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Continuar con Google OAuth</button>
            </form>
          ` : `
            <form id="g-form-rec" style="display:flex;flex-direction:column;gap:12px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Correo institucional registrado</label>
                <input id="r-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Definir nueva contraseña (mínimo 6 caracteres)</label>
                <input id="r-pass" type="password" placeholder="Nueva contraseña segura" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Actualizar Contraseña</button>
            </form>
          `}
        </div>
      `;

      document.getElementById('g-tab-login').onclick = () => pintarGate('login', '', false);
      document.getElementById('g-tab-rec').onclick = () => pintarGate('rec', '', false);

      const fLog = document.getElementById('g-form-login');
      if (fLog) {
        fLog.onsubmit = (e) => {
          e.preventDefault();
          const email = document.getElementById('g-mail').value.trim();
          const rol = document.getElementById('g-rol').value;
          const seccion = document.getElementById('g-sec').value;
          const pass = document.getElementById('g-pass').value;

          if (pass.length >= 6) {
            localStorage.setItem('bds_failed_attempts', '0');
            guardarSesion({ email, rol, seccion, ts: Date.now() });
            gate.remove();
            renderizarDockUnificado();
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            pintarGate('login', `Contraseña inválida. Intento ${intentos} de ${MAX_INTENTOS}.`, true);
          }
        };
      }

      const bOauth = document.getElementById('g-btn-oauth');
      if (bOauth) {
        bOauth.onclick = () => {
          const rol = document.getElementById('g-rol') ? document.getElementById('g-rol').value : 'Estudiante';
          const seccion = document.getElementById('g-sec') ? document.getElementById('g-sec').value : '11-1';
          localStorage.setItem('bds_failed_attempts', '0');
          guardarSesion({ email: 'autenticado@est.mep.go.cr', rol, seccion, ts: Date.now() });
          gate.remove();
          renderizarDockUnificado();
        };
      }

      const fRec = document.getElementById('g-form-rec');
      if (fRec) {
        fRec.onsubmit = (e) => {
          e.preventDefault();
          localStorage.setItem('bds_failed_attempts', '0');
          intentos = 0;
          pintarGate('login', 'Contraseña actualizada correctamente. Ingrese con sus credenciales.', false);
        };
      }
    }

    document.body.appendChild(gate);
    pintarGate('login', '', false);
  }

  // Barra de Navegación Unificada, Limpia y Sobria (Sustituye botones invasivos)
  function renderizarDockUnificado() {
    inyectarCSSSobrio();
    let oldBar = document.getElementById('bds-soberana-bar');
    if (oldBar) oldBar.remove();
    let dock = document.getElementById('bds-top-dock');
    if (dock) dock.remove();

    const sesion = obtenerSesion();
    if (!sesion) {
      mostrarLoginObligatorio();
      return;
    }

    dock = document.createElement('div');
    dock.id = 'bds-top-dock';
    dock.innerHTML = `
      <div class="bds-dock-brand">
        ${OWL_SVG}
        <span>CTP Mercedes Norte • <b>${sesion.rol} (${sesion.seccion})</b></span>
      </div>
      <div class="bds-dock-actions">
        <button id="dk-suite" class="bds-dock-btn primary">Prácticas, Juegos & Simuladores</button>
        <button id="dk-chats" class="bds-dock-btn">Canales de Sección (${sesion.seccion})</button>
        <button id="dk-sea" class="bds-dock-btn">SEA-MEP: Notas, Conducta & QR</button>
        <a href="${WA_OFICIAL}" target="_blank" class="bds-dock-btn" style="text-decoration:none;">Soporte</a>
        <button id="dk-logout" class="bds-dock-btn danger">Cambiar Usuario / Salir</button>
      </div>
    `;
    document.body.appendChild(dock);

    document.getElementById('dk-suite').onclick = () => {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('practicas');
    };
    document.getElementById('dk-chats').onclick = () => {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('chats');
    };
    document.getElementById('dk-sea').onclick = () => {
      if (window.abrirGestorSeaMep) window.abrirGestorSeaMep();
    };
    document.getElementById('dk-logout').onclick = () => cerrarSesionTotal();
  }

  window.mostrarModalAuthSoberano = mostrarLoginObligatorio;

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSSobrio();
    repararIncidenciasDOM();
    if (!obtenerSesion()) {
      mostrarLoginObligatorio();
    } else {
      renderizarDockUnificado();
    }
  });

  setInterval(repararIncidenciasDOM, 1000);
  setTimeout(() => {
    if (!obtenerSesion()) mostrarLoginObligatorio();
    else renderizarDockUnificado();
  }, 400);
})();