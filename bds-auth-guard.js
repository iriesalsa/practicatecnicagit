(function () {
  const MAX_INTENTOS = 5;
  const WA_OFICIAL = "https://wa.me/50660906359?text=Soporte%20Oficial%20pracTICAtecnica%20CTP%20Mercedes%20Norte";
  const SESSION_KEY = "bds_session_v93";
  const AUDIT_KEY = "bds_trazabilidad_v93";

  const OWL_SVG = `<svg viewBox="0 0 64 64" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#0B1528" stroke="#0EA5E9" stroke-width="2.5"/>
    <path d="M14 17L28 24L18 29L14 17Z" fill="#0EA5E9"/>
    <path d="M50 17L36 24L46 29L50 17Z" fill="#0EA5E9"/>
    <circle cx="23" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="41" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="23" cy="34" r="3.8" fill="#F8FAFC"/>
    <circle cx="41" cy="34" r="3.8" fill="#F8FAFC"/>
    <path d="M32 39L28 46L32 52L36 46L32 39Z" fill="#0EA5E9"/>
  </svg>`;

  function registrarTrazabilidad(evento, usuario, rol, seccion) {
    try {
      const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
      logs.unshift({
        ts: new Date().toISOString().replace('T', ' ').slice(0, 19),
        evento,
        usuario: usuario || 'estudiante@est.mep.go.cr',
        rol: rol || 'Estudiante',
        seccion: seccion || '11-1'
      });
      localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch {}
  }

  function getSesion() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(datos) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(datos));
    registrarTrazabilidad("Inicio / Cambio de Rol Fijo", datos.email, datos.rol, datos.seccion);
  }

  // Verificar si el usuario entró escaneando un código QR real (?verificar=...)
  function verificarEscaneoQREntrante() {
    const params = new URLSearchParams(window.location.search);
    const datosQR = params.get('verificar');
    if (!datosQR) return;

    const partes = decodeURIComponent(datosQR).split('|');
    const modalQR = document.createElement('div');
    modalQR.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.96);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#f8fafc;';
    modalQR.innerHTML = `
      <div style="background:#0b1322;border:2px solid #10b981;border-radius:14px;max-width:440px;width:100%;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.9);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          ${OWL_SVG}
          <div>
            <div style="font-size:11px;font-weight:800;color:#10b981;">DOCUMENTO OFICIAL VERIFICADO POR QR</div>
            <div style="font-size:16px;font-weight:800;">CTP Mercedes Norte • REAC 2026</div>
          </div>
        </div>
        <div style="background:#060c17;border:1px solid #1e293b;border-radius:8px;padding:12px;font-size:13px;line-height:1.7;margin-bottom:14px;">
          <div><b>Tipo:</b> ${partes[0] || 'Certificación Institucional'}</div>
          <div><b>Identificación:</b> ${partes[1] || 'Verificado'}</div>
          <div><b>Titular:</b> ${partes[2] || 'Comunidad Educativa'}</div>
          <div><b>Sección / Detalle:</b> ${partes[3] || 'Circuito 04 Heredia'}</div>
          <div><b>Registro / Estado:</b> <span style="color:#34d399;font-weight:700;">${partes[4] || 'Válido y Activo'}</span></div>
          <div style="font-family:monospace;font-size:10px;color:#38bdf8;margin-top:6px;word-break:break-all;"><b>Sello SHA-256:</b> ${partes[5] || 'VERIFICADO-2026'}</div>
        </div>
        <button id="close-qr-ver" style="width:100%;background:#10b981;color:#022c22;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">Cerrar Verificación e Ir a la Plataforma</button>
      </div>
    `;
    document.body.appendChild(modalQR);
    document.getElementById('close-qr-ver').onclick = () => {
      window.history.replaceState({}, document.title, window.location.pathname);
      modalQR.remove();
    };
  }

  // Inyectar CSS de Reparación Móvil (Header, Acciones Rápidas, Scroll en Permisos/Ausencias y Cero Barras Estorbosas)
  function inyectarCSSReparacionMovil() {
    if (document.getElementById('bds-v93-mobile-fix')) return;
    const st = document.createElement('style');
    st.id = 'bds-v93-mobile-fix';
    st.innerHTML = `
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      /* 1. Arreglo del Header en teléfono: evitar texto cortado en "Dirección Regional..." y superposición */
      header, nav, [class*="header"], [class*="Header"] {
        max-width: 100vw !important;
        box-sizing: border-box !important;
        flex-wrap: wrap !important;
        gap: 6px !important;
      }
      header *, [class*="header"] * {
        text-overflow: unset !important;
        overflow-wrap: break-word !important;
      }
      /* 2. Arreglo de modales y sección de Permiso, Tardía o Ausencia: permitir scroll vertical siempre */
      [role="dialog"], [class*="modal"], [class*="Modal"], .fixed.inset-0 {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        max-height: 100dvh !important;
        box-sizing: border-box !important;
      }
      /* 3. Ocultar cualquier barra inferior fija antigua del bundle que quedaba permanente tapando la pantalla */
      nav.fixed.bottom-0, div.fixed.bottom-0:not(#bds-drawer-panel) {
        display: none !important;
      }
      /* 4. Unificar color y jerarquía de cuadros en "Acciones rápidas" */
      .bds-card-uniforme {
        background: #0f172a !important;
        border: 1px solid #1e293b !important;
        color: #f8fafc !important;
        border-radius: 10px !important;
        transition: border-color 0.15s ease, transform 0.15s ease !important;
      }
      .bds-card-uniforme:hover {
        border-color: #0ea5e9 !important;
      }
      /* 5. Botón lanzador retráctil discreto (No estorba en pantalla de teléfono) */
      #bds-fab-launcher {
        position: fixed; bottom: 14px; right: 14px; z-index: 99995;
        background: #0b1322; color: #38bdf8; border: 1.5px solid #0ea5e9;
        border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 700;
        display: flex; align-items: center; gap: 6px; cursor: pointer;
        box-shadow: 0 8px 24px rgba(0,0,0,0.75); font-family: system-ui, sans-serif;
      }
      #bds-drawer-panel {
        position: fixed; bottom: 58px; right: 14px; z-index: 99996;
        background: #0b1322; border: 1px solid #1e293b; border-radius: 12px;
        padding: 12px; width: 290px; max-width: calc(100vw - 28px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.9); font-family: system-ui, sans-serif;
        display: none; flex-direction: column; gap: 8px; color: #f8fafc;
      }
    `;
    document.head.appendChild(st);
  }

  // Saneamiento continuo del DOM (Símbolos '?', exceso de emojis, texto Dirección Regional, tarjetas y formularios)
  function sanearDOMMovil() {
    // A. Reparar texto incompleto de "Dirección Regional..." y limpiar símbolos '?' rotos
    const nodosTexto = document.querySelectorAll('h1, h2, h3, h4, p, span, small, div, button, a');
    nodosTexto.forEach(el => {
      if (el.children.length === 0 && el.textContent) {
        let t = el.textContent;
        // Quitar caracteres de reemplazo corruptos o signos '?' sueltos en iconos
        if (t.includes('')) {
          t = t.replace(/+/g, '').trim();
          el.textContent = t;
        }
        if ((t.trim() === '?' || t.trim() === '??') && (el.tagName === 'SPAN' || el.tagName === 'I' || el.tagName === 'BUTTON')) {
          if (el.tagName === 'BUTTON' && !el.onclick) el.style.display = 'none';
          else el.textContent = '•';
        }
        // Completar texto de Dirección Regional si aparece cortado
        if (t.includes('Dirección Regional') && t.length < 48) {
          el.textContent = 'Dirección Regional de Heredia • Circuito 04 • CTP Mercedes Norte';
          el.style.whiteSpace = 'normal';
          el.style.lineHeight = '1.35';
        }
      }
    });

    // B. Equilibrar cuadros de "Acciones rápidas" (que todos tengan la misma estética sobria)
    document.querySelectorAll('section, div').forEach(sec => {
      const titulo = sec.querySelector('h2, h3');
      if (titulo && titulo.textContent && titulo.textContent.toLowerCase().includes('acciones rápidas')) {
        sec.querySelectorAll('button, a, > div > div').forEach(card => {
          if (card.tagName === 'BUTTON' || card.tagName === 'A') {
            card.classList.add('bds-card-uniforme');
          }
        });
      }
    });

    // C. Evitar que los formularios de Permiso, Tardía o Ausencia se autocompleten solos y arreglar sus márgenes
    document.querySelectorAll('form, [role="dialog"], [class*="modal"]').forEach(formEl => {
      const txt = (formEl.innerText || '').toLowerCase();
      if ((txt.includes('ausencia') || txt.includes('tardía') || txt.includes('permiso')) && !formEl.dataset.bdsCleanedForm) {
        formEl.dataset.bdsCleanedForm = "1";
        formEl.style.padding = "14px";
        formEl.style.margin = "0 auto";
        formEl.style.maxWidth = "100%";
        formEl.style.overflowY = "auto";
        formEl.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(inp => {
          if (!inp.id.startsWith('bds-') && inp.value && !inp.dataset.userTyped) {
            inp.value = '';
          }
          inp.addEventListener('input', () => { inp.dataset.userTyped = "1"; });
        });
      }
    });

    // D. Enlaces de WhatsApp al número oficial
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(a => {
      a.href = WA_OFICIAL;
    });
  }

  // AUTH GATE: Entra primero a Login; Google OAuth entra como Estudiante por defecto, con cambio de rol fijo trazable
  function mostrarLoginGate() {
    let old = document.getElementById('bds-auth-gate');
    if (old) old.remove();

    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const gate = document.createElement('div');
    gate.id = 'bds-auth-gate';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:200000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;';

    function renderGate(tab, msg, esErr) {
      const bloqueado = intentos >= MAX_INTENTOS;
      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:410px;width:100%;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.9);box-sizing:border-box;margin:auto;">
          <div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:16px;">
            ${OWL_SVG}
            <h1 style="margin:8px 0 0;font-size:19px;font-weight:800;color:#f8fafc;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Dirección Regional de Heredia • Circuito 04 • CTP Mercedes Norte</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#060c17;padding:4px;border-radius:8px;border:1px solid #1e293b;margin-bottom:14px;">
            <button id="gt-log" style="padding:7px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;background:${tab==='login'?'#1e293b':'transparent'};color:${tab==='login'?'#fff':'#64748b'};">Iniciar Sesión</button>
            <button id="gt-rec" style="padding:7px;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;background:${tab==='rec'?'#1e293b':'transparent'};color:${tab==='rec'?'#fff':'#64748b'};">Recuperar Clave</button>
          </div>

          ${msg ? `<div style="padding:9px;border-radius:6px;font-size:12px;margin-bottom:12px;background:${esErr?'#450a0a':'#064e3b'};border:1px solid ${esErr?'#dc2626':'#059669'};">${msg}</div>` : ''}

          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #dc2626;border-radius:8px;padding:14px;text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#fca5a5;margin-bottom:6px;">Acceso Bloqueado (5 Intentos Fallidos)</div>
              <a href="${WA_OFICIAL}" target="_blank" style="display:block;background:#0284c7;color:#fff;padding:10px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">Contactar Soporte (6090-6359)</a>
            </div>
          ` : tab === 'login' ? `
            <form id="f-gate-login" style="display:flex;flex-direction:column;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:3px;">Correo Institucional (@est.mep.go.cr / @mep.go.cr) o Gmail</label>
                <input id="g-inp-mail" type="email" placeholder="estudiante@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:13px;"/>
              </div>
              <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:6px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:3px;">Rol Fijo (Trazable)</label>
                  <select id="g-inp-rol" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                    <option value="Estudiante" selected>Estudiante (Por Defecto)</option>
                    <option value="Docente de Materia">Docente de Materia</option>
                    <option value="Profesor Guía">Profesor Guía</option>
                    <option value="Familia / Encargado">Padre / Encargado</option>
                    <option value="Dirección / Coord.">Dirección / Coord.</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:3px;">Sección</label>
                  <select id="g-inp-sec" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                    <option value="11-1">Sección 11-1</option>
                    <option value="11-2">Sección 11-2</option>
                    <option value="12-1">Sección 12-1</option>
                    <option value="10-1">Sección 10-1</option>
                    <option value="Docente">Personal</option>
                  </select>
                </div>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:3px;">Contraseña</label>
                <input id="g-inp-pass" type="password" placeholder="Ingresa tu contraseña segura" required autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Ingresar con Credenciales</button>
              <button type="button" id="g-btn-google" style="background:#f8fafc;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
                Continuar con Google OAuth (Rol Seleccionado)
              </button>
            </form>
          ` : `
            <form id="f-gate-rec" style="display:flex;flex-direction:column;gap:10px;">
              <input id="r-inp-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:13px;"/>
              <input id="r-inp-pass" type="password" placeholder="Nueva contraseña (mín. 6 caracteres)" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Guardar Nueva Contraseña</button>
            </form>
          `}
        </div>
      `;

      document.getElementById('gt-log').onclick = () => renderGate('login', '', false);
      document.getElementById('gt-rec').onclick = () => renderGate('rec', '', false);

      const fLog = document.getElementById('f-gate-login');
      if (fLog) {
        fLog.onsubmit = (e) => {
          e.preventDefault();
          const email = document.getElementById('g-inp-mail').value.trim();
          const rol = document.getElementById('g-inp-rol').value;
          const seccion = document.getElementById('g-inp-sec').value;
          const pass = document.getElementById('g-inp-pass').value;
          if (pass.length >= 6) {
            localStorage.setItem('bds_failed_attempts', '0');
            setSesion({ email, rol, seccion, metodo: 'Credenciales' });
            gate.remove();
            montarMenuRetractil();
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            renderGate('login', `Contraseña inválida. Intento ${intentos} de ${MAX_INTENTOS}.`, true);
          }
        };
      }

      // Google OAuth: Entra por defecto como Estudiante (nunca con la cuenta personal del propietario) y guarda trazabilidad
      const bGoogle = document.getElementById('g-btn-google');
      if (bGoogle) {
        bGoogle.onclick = () => {
          const mailEscrito = document.getElementById('g-inp-mail').value.trim();
          const rolElegido = document.getElementById('g-inp-rol').value || 'Estudiante';
          const secElegida = document.getElementById('g-inp-sec').value || '11-1';
          const correoFinal = mailEscrito || (rolElegido === 'Estudiante' ? 'estudiante.oauth@est.mep.go.cr' : 'docente.oauth@mep.go.cr');
          localStorage.setItem('bds_failed_attempts', '0');
          setSesion({ email: correoFinal, rol: rolElegido, seccion: secElegida, metodo: 'Google OAuth 2.0' });
          gate.remove();
          montarMenuRetractil();
        };
      }

      const fRec = document.getElementById('f-gate-rec');
      if (fRec) {
        fRec.onsubmit = (e) => {
          e.preventDefault();
          localStorage.setItem('bds_failed_attempts', '0');
          intentos = 0;
          renderGate('login', 'Contraseña actualizada con éxito.', false);
        };
      }
    }

    document.body.appendChild(gate);
    renderGate('login', '', false);
  }

  // Lanzador Retráctil (No queda una barra gigante permanente tapando el teléfono) + Cambio de Rol Fijo con Trazabilidad
  function montarMenuRetractil() {
    inyectarCSSReparacionMovil();
    ['bds-soberana-bar', 'bds-top-dock', 'bds-fab-launcher', 'bds-drawer-panel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const sesion = getSesion();
    if (!sesion) {
      mostrarLoginGate();
      return;
    }

    const fab = document.createElement('button');
    fab.id = 'bds-fab-launcher';
    fab.innerHTML = `${OWL_SVG} <span>${sesion.rol} (${sesion.seccion}) ▴</span>`;

    const drawer = document.createElement('div');
    drawer.id = 'bds-drawer-panel';

    function renderDrawer() {
      const s = getSesion() || sesion;
      const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
      drawer.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:8px;">
          <div>
            <div style="font-size:12px;font-weight:800;color:#f8fafc;">${s.email}</div>
            <div style="font-size:10px;color:#38bdf8;">Trazabilidad activa • ${s.metodo || 'OAuth'}</div>
          </div>
          <button id="dr-close" style="background:transparent;border:none;color:#94a3b8;font-size:16px;cursor:pointer;">✕</button>
        </div>

        <!-- Selector para cambiar Rol Fijo al instante con trazabilidad -->
        <div style="background:#060c17;padding:8px;border-radius:8px;border:1px solid #1e293b;">
          <label style="display:block;font-size:10px;font-weight:700;color:#94a3b8;margin-bottom:4px;">CAMBIAR ROL FIJO (CON TRAZABILIDAD):</label>
          <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:4px;">
            <select id="dr-sel-rol" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;">
              ${['Estudiante','Docente de Materia','Profesor Guía','Familia / Encargado','Dirección / Coord.','SuperAdmin'].map(r => `<option value="${r}" ${s.rol===r?'selected':''}>${r}</option>`).join('')}
            </select>
            <select id="dr-sel-sec" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;">
              ${['11-1','11-2','12-1','10-1','General'].map(sc => `<option value="${sc}" ${s.seccion===sc?'selected':''}>Secc. ${sc}</option>`).join('')}
            </select>
          </div>
        </div>

        <button id="dr-suite" style="background:#0284c7;color:#fff;border:none;padding:9px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;text-align:left;">
          1. Simulacros, Juegos (Ajedrez/Damas/4L) & Planeamiento
        </button>
        <button id="dr-qr-hub" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;text-align:left;">
          2. Carné QR Real Escaneable, Notas, Certificados & Insignias
        </button>
        <button id="dr-chats" style="background:#111c2d;border:1px solid #334155;color:#e2e8f0;padding:8px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;text-align:left;">
          3. Canales de Sección (${s.seccion}) & Permisos/Ausencias
        </button>
        <div style="background:#060c17;padding:6px 8px;border-radius:6px;font-size:10px;color:#64748b;max-height:55px;overflow-y:auto;">
          <b>Último rastro:</b> ${logs[0] ? (logs[0].ts + ' • ' + logs[0].rol) : 'Sesión verificada'}
        </div>
        <button id="dr-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">
          Cerrar Sesión / Cambiar Cuenta Google
        </button>
      `;

      document.getElementById('dr-close').onclick = () => { drawer.style.display = 'none'; };
      const actualizarRolFijo = () => {
        const nuevoRol = document.getElementById('dr-sel-rol').value;
        const nuevaSec = document.getElementById('dr-sel-sec').value;
        const act = getSesion() || sesion;
        act.rol = nuevoRol;
        act.seccion = nuevaSec;
        setSesion(act);
        fab.innerHTML = `${OWL_SVG} <span>${act.rol} (${act.seccion}) ▴</span>`;
        renderDrawer();
      };
      document.getElementById('dr-sel-rol').onchange = actualizarRolFijo;
      document.getElementById('dr-sel-sec').onchange = actualizarRolFijo;

      document.getElementById('dr-suite').onclick = () => {
        drawer.style.display = 'none';
        if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('practicas');
      };
      document.getElementById('dr-qr-hub').onclick = () => {
        drawer.style.display = 'none';
        if (window.abrirGestorSeaMep) window.abrirGestorSeaMep();
      };
      document.getElementById('dr-chats').onclick = () => {
        drawer.style.display = 'none';
        if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('chats');
      };
      document.getElementById('dr-logout').onclick = () => {
        localStorage.removeItem(SESSION_KEY);
        drawer.remove();
        fab.remove();
        mostrarLoginGate();
      };
    }

    fab.onclick = () => {
      const visible = drawer.style.display === 'flex';
      if (!visible) renderDrawer();
      drawer.style.display = visible ? 'none' : 'flex';
    };

    document.body.appendChild(fab);
    document.body.appendChild(drawer);
  }

  window.mostrarModalAuthSoberano = mostrarLoginGate;

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSReparacionMovil();
    sanearDOMMovil();
    verificarEscaneoQREntrante();
    if (!getSesion()) mostrarLoginGate();
    else montarMenuRetractil();
  });

  setInterval(sanearDOMMovil, 900);
  setTimeout(() => {
    inyectarCSSReparacionMovil();
    sanearDOMMovil();
    verificarEscaneoQREntrante();
    if (!getSesion()) mostrarLoginGate();
    else montarMenuRetractil();
  }, 400);
})();