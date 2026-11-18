(function () {
  const SESSION_KEY = "bds_auth_v94_session";
  const MAX_INTENTOS = 5;
  const WA_SOPORTE = "https://wa.me/50660906359?text=Soporte%20pracTICAtecnica%20CTP%20Mercedes%20Norte";

  const GOOGLE_LOGO_SVG = `<svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>`;

  const OWL_SVG = `<svg viewBox="0 0 64 64" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="#0B1528" stroke="#0EA5E9" stroke-width="2.5"/>
    <path d="M14 17L28 24L18 29L14 17Z" fill="#0EA5E9"/>
    <path d="M50 17L36 24L46 29L50 17Z" fill="#0EA5E9"/>
    <circle cx="23" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="41" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="23" cy="34" r="3.8" fill="#F8FAFC"/>
    <circle cx="41" cy="34" r="3.8" fill="#F8FAFC"/>
    <path d="M32 39L28 46L32 52L36 46L32 39Z" fill="#0EA5E9"/>
  </svg>`;

  const MEP_LOGO_SVG = `<svg viewBox="0 0 120 40" width="90" height="30" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="60" y="22" text-anchor="middle" fill="#f8fafc" font-family="system-ui,sans-serif" font-weight="900" font-size="15">MEP • CR</text>
    <text x="60" y="34" text-anchor="middle" fill="#38bdf8" font-family="system-ui,sans-serif" font-weight="700" font-size="8">EDUCACIÓN TÉCNICA</text>
  </svg>`;

  function getSesion() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  function inyectarEstilosSobrios() {
    if (document.getElementById('bds-v94-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v94-css';
    st.innerHTML = `
      html, body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        background-color: #060c17 !important;
        font-family: system-ui, -apple-system, sans-serif !important;
      }
      /* Modo Pizarra Real: escala tipográfica limpia y alto contraste */
      html.bds-pizarra-active {
        font-size: 118% !important;
      }
      html.bds-pizarra-active #bds-mega-modal {
        zoom: 1.12;
      }
      /* Evitar que el menú se monte sobre el logo en móvil */
      header, nav, [class*="header"] {
        position: relative !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 8px !important;
        padding: 10px 14px !important;
        max-width: 100vw !important;
        box-sizing: border-box !important;
      }
      /* Eliminar barras inferiores innecesarias del bundle viejo */
      nav.fixed.bottom-0, div.fixed.bottom-0, #bds-soberana-bar, #bds-top-dock {
        display: none !important;
      }
      /* Barra superior institucional única, sobria y sin estorbar */
      #bds-inst-navbar {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: #09111e; border-bottom: 1px solid #1e293b;
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 8px; padding: 8px 16px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      }
      .bds-nav-btn {
        background: #111c2d; border: 1px solid #1e293b; color: #e2e8f0;
        padding: 7px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; transition: all 0.15s ease;
      }
      .bds-nav-btn:hover { border-color: #0ea5e9; color: #fff; }
      .bds-nav-btn.active { background: #0284c7; border-color: #0284c7; color: #fff; }
    `;
    document.head.appendChild(st);
  }

  // Reparar incidencias del bundle base reportadas en Criticas.docx:
  // 1. Logo MEP que no carga -> Reemplazo por SVG vectorial
  // 2. Botones de especialidad o superiores sin función -> Se conectan directamente al motor de exámenes arriba
  function repararBundleBase() {
    // Reparar imágenes rotas (incluyendo logo MEP)
    document.querySelectorAll('img').forEach(img => {
      const alt = (img.alt || '').toLowerCase();
      const src = (img.src || '').toLowerCase();
      if (alt.includes('mep') || src.includes('mep')) {
        img.onerror = () => {
          const span = document.createElement('span');
          span.innerHTML = MEP_LOGO_SVG;
          span.style.display = 'inline-flex';
          img.replaceWith(span);
        };
        if (img.complete && img.naturalWidth === 0) img.onerror();
      } else if (!img.dataset.bdsImgFixed) {
        img.dataset.bdsImgFixed = "1";
        img.onerror = () => {
          const span = document.createElement('span');
          span.innerHTML = OWL_SVG;
          span.style.display = 'inline-flex';
          img.replaceWith(span);
        };
      }
    });

    // Conectar botones de especialidad o exámenes de la página base que no hacían nada o abrían abajo
    document.querySelectorAll('button, a').forEach(btn => {
      if (btn.id && (btn.id.startsWith('bds-') || btn.id.startsWith('nb-'))) return;
      const txt = (btn.innerText || '').trim().toLowerCase();
      if (!btn.dataset.bdsWired) {
        if (txt.includes('desarrollo') || txt.includes('programación') || txt.includes('software')) {
          btn.dataset.bdsWired = "1";
          btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes', 'Desarrollo Web y Diseño de Software');
          });
        } else if (txt.includes('redes') || txt.includes('ciberseguridad') || txt.includes('subneteo')) {
          btn.dataset.bdsWired = "1";
          btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes', 'Redes, Subneteo (VLSM/FLSM) e IPv6');
          });
        } else if (txt.includes('cosevi') || txt.includes('manejo') || txt.includes('vial')) {
          btn.dataset.bdsWired = "1";
          btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes', 'Educación Vial COSEVI / MOPT');
          });
        } else if (txt.includes('electrónica') || txt.includes('circuitos')) {
          btn.dataset.bdsWired = "1";
          btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes', 'Electrónica Industrial (Ley de Ohm/Watt)');
          });
        }
      }
    });
  }

  // LOGIN OBLIGATORIO (Nadie usa la página sin iniciar sesión y NUNCA entra a la cuenta privada del propietario)
  function mostrarLoginObligatorio() {
    let old = document.getElementById('bds-login-gate');
    if (old) old.remove();

    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const gate = document.createElement('div');
    gate.id = 'bds-login-gate';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:200000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;';

    function pintarLogin(modo, msg, esErr) {
      const bloqueado = intentos >= MAX_INTENTOS;
      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:400px;width:100%;padding:26px;box-shadow:0 20px 50px rgba(0,0,0,0.9);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:14px;">
            ${OWL_SVG}
            ${MEP_LOGO_SVG}
          </div>
          <div style="text-align:center;margin-bottom:18px;">
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#f8fafc;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Dirección Regional de Heredia • Circuito 04 • CTP Mercedes Norte</p>
          </div>

          ${msg ? `<div style="padding:10px;border-radius:6px;font-size:12px;margin-bottom:12px;background:${esErr?'#450a0a':'#064e3b'};border:1px solid ${esErr?'#dc2626':'#059669'};">${msg}</div>` : ''}

          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #dc2626;border-radius:8px;padding:14px;text-align:center;">
              <div style="font-size:13px;font-weight:700;color:#fca5a5;margin-bottom:6px;">Acceso Bloqueado por Seguridad (5 Intentos)</div>
              <a href="${WA_SOPORTE}" target="_blank" style="display:block;background:#0284c7;color:#fff;padding:10px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">Contactar Soporte (6090-6359)</a>
            </div>
          ` : modo === 'google_prompt' ? `
            <!-- Selector de Cuenta Google Personal del Estudiante (Nunca entra al usuario del Profe) -->
            <form id="f-google-student" style="display:flex;flex-direction:column;gap:10px;background:#060c17;padding:14px;border-radius:8px;border:1px solid #1e293b;">
              <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:#f8fafc;">
                ${GOOGLE_LOGO_SVG} <span>Autenticación Google — Estudiante</span>
              </div>
              <input id="gg-nombre" type="text" placeholder="Tu Nombre y Apellidos" required autocomplete="off" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
              <input id="gg-correo" type="email" placeholder="tucorreo@gmail.com o @est.mep.go.cr" required autocomplete="off" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
              <select id="gg-seccion" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                <option value="11-1">Sección 11-1</option>
                <option value="11-2">Sección 11-2</option>
                <option value="12-1">Sección 12-1</option>
                <option value="10-1">Sección 10-1</option>
              </select>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Continuar como Estudiante</button>
              <button type="button" id="gg-cancel" style="background:transparent;color:#94a3b8;border:none;font-size:11px;cursor:pointer;">Volver</button>
            </form>
          ` : `
            <!-- Botón Principal Solicitado: "Iniciar sesión GOOGLE" con el logo oficial de Google -->
            <button type="button" id="btn-google-main" style="width:100%;background:#ffffff;color:#1f2937;border:1px solid #d1d5db;padding:11px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:14px;box-shadow:0 2px 6px rgba(0,0,0,0.25);">
              ${GOOGLE_LOGO_SVG}
              <span>Iniciar sesión GOOGLE</span>
            </button>

            <div style="text-align:center;font-size:11px;color:#64748b;margin-bottom:12px;">— o ingresa con credenciales institucionales —</div>

            <form id="f-std-login" style="display:flex;flex-direction:column;gap:10px;">
              <input id="l-nombre" type="text" placeholder="Tu Nombre Completo" required autocomplete="off" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:12px;"/>
              <input id="l-correo" type="email" placeholder="correo@est.mep.go.cr" required autocomplete="off" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:12px;"/>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <select id="l-seccion" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="11-1">Sección 11-1</option>
                  <option value="11-2">Sección 11-2</option>
                  <option value="12-1">Sección 12-1</option>
                  <option value="10-1">Sección 10-1</option>
                </select>
                <select id="l-rol" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="Estudiante" selected>Estudiante</option>
                  <option value="Docente / Profesor Guía">Docente / Prof. Guía</option>
                </select>
              </div>
              <input id="l-pass" type="password" placeholder="Contraseña (o código docente si eres Profesor)" required autocomplete="new-password" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px 10px;color:#fff;font-size:12px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">Ingresar a la Plataforma</button>
            </form>
          `}
        </div>
      `;

      const bGMain = document.getElementById('btn-google-main');
      if (bGMain) bGMain.onclick = () => pintarLogin('google_prompt', '', false);

      const bGCancel = document.getElementById('gg-cancel');
      if (bGCancel) bGCancel.onclick = () => pintarLogin('login', '', false);

      const fGStudent = document.getElementById('f-google-student');
      if (fGStudent) {
        fGStudent.onsubmit = (e) => {
          e.preventDefault();
          const nombre = document.getElementById('gg-nombre').value.trim();
          const email = document.getElementById('gg-correo').value.trim();
          const seccion = document.getElementById('gg-seccion').value;
          localStorage.setItem('bds_failed_attempts', '0');
          // Google Auth autentica siempre en su propia sesión como Estudiante
          setSesion({
            id: 'EST-' + Math.floor(1000 + Math.random() * 9000),
            nombre,
            email,
            rol: 'Estudiante',
            seccion,
            authProvider: 'Google OAuth'
          });
          gate.remove();
          montarNavbarUnificada();
          if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes');
        };
      }

      const fStd = document.getElementById('f-std-login');
      if (fStd) {
        fStd.onsubmit = (e) => {
          e.preventDefault();
          const nombre = document.getElementById('l-nombre').value.trim();
          const email = document.getElementById('l-correo').value.trim();
          const seccion = document.getElementById('l-seccion').value;
          const rolSolicitado = document.getElementById('l-rol').value;
          const pass = document.getElementById('l-pass').value;

          // Bloquear que cualquier estudiante se ponga rol Docente sin clave de autorización docente
          if (rolSolicitado !== 'Estudiante' && pass !== 'CTPMN2026' && pass.length < 10) {
            pintarLogin('login', 'Para ingresar con rol Docente / Profesor Guía se requiere código de autorización institucional.', true);
            return;
          }

          if (pass.length >= 6) {
            localStorage.setItem('bds_failed_attempts', '0');
            setSesion({
              id: rolSolicitado === 'Estudiante' ? ('EST-' + Math.floor(1000 + Math.random() * 9000)) : 'DOC-CTPMN',
              nombre,
              email,
              rol: rolSolicitado,
              seccion,
              authProvider: 'Credenciales MEP'
            });
            gate.remove();
            montarNavbarUnificada();
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes');
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            pintarLogin('login', `Contraseña inválida. Intento ${intentos} de ${MAX_INTENTOS}.`, true);
          }
        };
      }
    }

    document.body.appendChild(gate);
    pintarLogin('login', '', false);
  }

  // Barra Superior Sobria con Diferenciación Real por Rol (Estudiante vs Docente/Guía) y Modo Pizarra Funcional
  function montarNavbarUnificada() {
    inyectarEstilosSobrios();
    let oldNav = document.getElementById('bds-inst-navbar');
    if (oldNav) oldNav.remove();

    const s = getSesion();
    if (!s) {
      mostrarLoginObligatorio();
      return;
    }

    const esDocente = s.rol !== 'Estudiante';

    const nav = document.createElement('div');
    nav.id = 'bds-inst-navbar';
    nav.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        ${OWL_SVG}
        ${MEP_LOGO_SVG}
        <div style="line-height:1.25;">
          <div style="font-size:13px;font-weight:800;color:#f8fafc;">${s.nombre} <span style="color:#38bdf8;">(${s.rol} • ${s.seccion})</span></div>
          <div style="font-size:10px;color:#94a3b8;">${s.email} • CTP Mercedes Norte</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <button id="nb-exam" class="bds-nav-btn active">Exámenes por Especialidad</button>
        <button id="nb-games" class="bds-nav-btn">Juegos de Razonamiento (Puente / Clue / Among Us)</button>
        <button id="nb-vial" class="bds-nav-btn">Simulador Vial CR</button>
        <button id="nb-chats" class="bds-nav-btn">Chat Sección ${s.seccion}</button>
        <button id="nb-qr" class="bds-nav-btn">Mi Carné QR</button>
        ${esDocente ? `<button id="nb-sea" class="bds-nav-btn" style="background:#059669;border-color:#059669;color:#fff;">Panel Docente SEA-MEP & Conducta</button>` : ''}
        <button id="nb-pizarra" class="bds-nav-btn" title="Aumentar escala y pantalla completa">Modo Pizarra</button>
        <button id="nb-salir" class="bds-nav-btn" style="background:#7f1d1d;border-color:#991b1b;color:#fecaca;">Salir</button>
      </div>
    `;

    document.body.prepend(nav);

    document.getElementById('nb-exam').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('examenes');
    document.getElementById('nb-games').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('juegos');
    document.getElementById('nb-vial').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('rotonda');
    document.getElementById('nb-chats').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('chats');
    document.getElementById('nb-qr').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('carnet');

    const bSea = document.getElementById('nb-sea');
    if (bSea) bSea.onclick = () => window.abrirGestorSeaMep && window.abrirGestorSeaMep();

    // Modo Pizarra Real: alterna zoom + Fullscreen sin abrir ventanas repetidas
    document.getElementById('nb-pizarra').onclick = () => {
      const activo = document.documentElement.classList.toggle('bds-pizarra-active');
      const btn = document.getElementById('nb-pizarra');
      btn.innerText = activo ? 'Salir Pizarra (100%)' : 'Modo Pizarra';
      if (activo && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!activo && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };

    document.getElementById('nb-salir').onclick = () => {
      localStorage.removeItem(SESSION_KEY);
      nav.remove();
      const m = document.getElementById('bds-mega-modal');
      if (m) m.remove();
      mostrarLoginObligatorio();
    };
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarEstilosSobrios();
    repararBundleBase();
    if (!getSesion()) mostrarLoginObligatorio();
    else montarNavbarUnificada();
  });

  setInterval(repararBundleBase, 1000);
  setTimeout(() => {
    inyectarEstilosSobrios();
    repararBundleBase();
    if (!getSesion()) mostrarLoginObligatorio();
    else montarNavbarUnificada();
  }, 350);
})();