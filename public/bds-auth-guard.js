(function () {
  const SESSION_KEY = "bds_single_user_session_v97";
  const WA_SINPE = "https://wa.me/50660906359?text=Hola%20Profe%20Max,%20adjunto%20comprobante%20SINPE%20al%2060906359%20(Banco%20Popular)%20con%20Detalle%20.%20para%20pracTICAtecnica.com";

  // Evitar que WASD o flechas bloqueen inputs
  window.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  // Activos Gráficos Vectoriales Oficiales (Nunca se rompen)
  const SVG_MEP_BANNER = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="200" height="50">
    <rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
    <circle cx="30" cy="30" r="18" fill="#0284c7"/>
    <text x="30" y="35" text-anchor="middle" fill="#ffffff" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="13">MEP</text>
    <text x="58" y="26" fill="#f8fafc" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="12.5">Ministerio de Educación Pública</text>
    <text x="58" y="43" fill="#38bdf8" font-family="Inter,system-ui,sans-serif" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text>
  </svg>`);

  const SVG_ESCUDO_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="56" height="56">
    <rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/>
    <path d="M40 12 L64 22 L64 44 C64 58 40 68 40 68 C40 68 16 58 16 44 L16 22 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/>
    <text x="40" y="39" text-anchor="middle" fill="#ffffff" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="13">CTPMN</text>
    <text x="40" y="53" text-anchor="middle" fill="#38bdf8" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="8.5">HEREDIA</text>
  </svg>`);

  const GOOGLE_SVG = `<svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function getSesion() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function setSesion(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  function sinTildes(s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  // Inyectar CSS Profesional (Tipografía limpia, Menú Lateral Izquierdo, Fix Guanacaste/Puntarenas, Cero Barra Inferior)
  function inyectarCSSProfesional() {
    if (document.getElementById('bds-v97-pro-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v97-pro-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      html, body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        background-color: #090f1a !important;
        color: #f1f5f9 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
      }

      /* 1. ELIMINAR COMPLETAMENTE LA BARRA INFERIOR FLOTANTE QUE ESTORBABA EN PANTALLA */
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel,
      div[style*="bottom: 14px"], div[style*="bottom:14px"], div[style*="bottom: 12px"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        pointer-events: none !important;
      }

      /* 2. HEADER SUPERIOR PROFESIONAL Y MENÚ HAMBURGUESA LATERAL IZQUIERDO */
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;
        gap: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.45);
      }
      #bds-left-drawer-backdrop {
        position: fixed; inset: 0; background: rgba(3, 7, 18, 0.75); z-index: 199990;
        display: none; backdrop-filter: blur(3px);
      }
      #bds-left-drawer {
        position: fixed; top: 0; left: 0; bottom: 0; width: 290px; max-width: 82vw;
        background: #0b1322; border-right: 1px solid #1e293b; z-index: 199995;
        transform: translateX(-100%); transition: transform 0.22s ease-in-out;
        display: flex; flex-direction: column; padding: 18px; box-sizing: border-box;
        overflow-y: auto; box-shadow: 10px 0 30px rgba(0,0,0,0.8);
      }
      #bds-left-drawer.open { transform: translateX(0); }

      /* 3. SUB-HEADER VISIBLE Y DESLIZABLE EN RESPONSIVE */
      #bds-subheader-nav {
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; gap: 8px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;
      }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #1e293b; color: #cbd5e1;
        padding: 7px 13px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
        transition: background 0.15s, border-color 0.15s;
      }
      .bds-subnav-item:hover, .bds-subnav-item.active {
        background: #0284c7; border-color: #0284c7; color: #ffffff;
      }

      /* 4. FIX TABLA DE PROVINCIAS (GUANACASTE Y PUNTARENAS COMPLETOS EN RESPONSIVE) Y FLECHAS SIN HOVER FALSO */
      button, td, th, option, span {
        text-overflow: unset !important;
      }
      [role="dialog"] button, .modal button {
        min-width: fit-content !important;
        white-space: normal !important;
        line-height: 1.35 !important;
      }
      /* Evitar que la flecha derecha se ilumine sola al pasar el cursor sin hacer clic */
      button:hover > span:last-child, div:hover > span.arrow {
        background: transparent !important;
        box-shadow: none !important;
      }

      /* 5. BUSCADOR GRANDE Y PROFESIONAL CON RESULTADOS EN VIVO */
      input[placeholder*="Buscar"] {
        font-size: 14px !important;
        padding: 12px 16px !important;
        border-radius: 8px !important;
        border: 1.5px solid #334155 !important;
        background: #0f172a !important;
        color: #f8fafc !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      input[placeholder*="Buscar"]:focus {
        border-color: #0ea5e9 !important;
        outline: none !important;
      }

      /* 6. BOTONES DE CANTIDAD DE PREGUNTAS GRANDES Y ATRACTIVOS */
      .bds-qty-pill {
        padding: 10px 18px !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        border-radius: 8px !important;
      }
    `;
    document.head.appendChild(st);
  }

  // Limpiador de Emojis Genéricos por Texto Profesional Limpio (Reporte Pablo Mejía 11-1 y Notas)
  const MAPA_EMOJIS = [
    [/🏠\s*/g, ''], [/🏛️\s*/g, ''], [/🎮\s*/g, ''], [/🔬\s*/g, ''],
    [/🧪\s*/g, ''], [/🎓\s*/g, ''], [/🕹️\s*/g, ''], [/📚\s*/g, ''],
    [/🤖\s*/g, ''], [/⚡\s*/g, ''], [/🔥\s*/g, ''], [/🎯\s*/g, ''],
    [/📌\s*/g, ''], [/🏆\s*/g, ''], [/💡\s*/g, ''], [/🧭\s*/g, ''],
    [/🗂️\s*/g, ''], [/📲\s*/g, ''], [/🖥️\s*/g, ''], [/🦉\s*/g, '']
  ];

  function limpiarEmojisEnNodo(el) {
    if (!el || el.children.length > 0) return;
    let txt = el.textContent || '';
    let mod = txt;
    for (const [rgx, rep] of MAPA_EMOJIS) {
      mod = mod.replace(rgx, rep);
    }
    if (mod !== txt) el.textContent = mod.trim();
  }

  // Modal de Inicio de Sesión de Usuario Único (No permite cambiar de usuario sin cerrar sesión)
  window.mostrarModalLoginUnico = function () {
    if (getSesion()) return; // Si ya hay sesión activa, no se puede cambiar de usuario sin antes cerrar sesión
    let old = document.getElementById('bds-single-login');
    if (old) old.remove();

    const m = document.createElement('div');
    m.id = 'bds-single-login';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.92);z-index:250000;display:flex;align-items:center;justify-content:center;padding:16px;';
    m.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:390px;width:100%;padding:24px;position:relative;box-sizing:border-box;box-shadow:0 20px 50px rgba(0,0,0,0.85);">
        <button id="sl-close" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <img src="${SVG_ESCUDO_CTP}" width="44" height="44" alt="Escudo CTP"/>
          <div>
            <div style="font-size:16px;font-weight:800;color:#f8fafc;">Iniciar sesión</div>
            <div style="font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Sesión Personal Única</div>
          </div>
        </div>
        <form id="sl-form" style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Identificación o Cédula</label>
            <input id="sl-id" type="text" placeholder="Ej. 2-0891-0452" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Nombre Completo</label>
            <input id="sl-nom" type="text" placeholder="Nombre y Apellidos" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Correo Institucional o Gmail</label>
            <input id="sl-mail" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;">Sección</label>
            <select id="sl-sec" style="width:100%;background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;">
              <option value="11-1">Sección 11-1</option>
              <option value="11-2">Sección 11-2</option>
              <option value="12-1">Sección 12-1</option>
              <option value="10-1">Sección 10-1</option>
              <option value="Docente / Administrativo">Docente / Administrativo</option>
            </select>
          </div>
          <button type="submit" style="margin-top:6px;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;">
            ${GOOGLE_SVG}
            <span>Iniciar sesión con Google</span>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById('sl-close').onclick = () => m.remove();
    document.getElementById('sl-form').onsubmit = (e) => {
      e.preventDefault();
      setSesion({
        id: document.getElementById('sl-id').value.trim(),
        nombre: document.getElementById('sl-nom').value.trim(),
        email: document.getElementById('sl-mail').value.trim(),
        seccion: document.getElementById('sl-sec').value
      });
      m.remove();
      montarHeaderYMenuLateral();
      sanearInterfazCompleta();
    };
  };

  // Montar Header Profesional + Menú Hamburguesa Lateral Izquierdo + Sub-Header Responsive
  function montarHeaderYMenuLateral() {
    inyectarCSSProfesional();
    ['bds-pro-header', 'bds-subheader-nav', 'bds-left-drawer', 'bds-left-drawer-backdrop', 'bds-navbar-v96', 'bds-minimal-header'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const sesion = getSesion();

    const SECCIONES_MENU = [
      { id: 'portada', label: 'Inicio y Acciones Rápidas' },
      { id: 'examenes', label: 'Exámenes y Simulacros (MEP / UCR / TEC / UTN)' },
      { id: 'vial', label: 'Simulador Vial 2D (Rotonda CR / Peaje / Conos)' },
      { id: 'simuladores_tec', label: 'Simuladores: Excel, Word APA 7, Circuitos y Cisco' },
      { id: 'juegos', label: 'Juegos de Razonamiento (Ajedrez, Damas, Puente, Clue)' },
      { id: 'calculadora', label: 'Calculadora Nota de Presentación y Admisión' },
      { id: 'carnet', label: 'Dirección, Calificaciones SEA y Carné QR' }
    ];

    // 1. Cajón Lateral Izquierdo (Left Drawer para el Menú Hamburguesa)
    const backdrop = document.createElement('div');
    backdrop.id = 'bds-left-drawer-backdrop';
    const drawer = document.createElement('div');
    drawer.id = 'bds-left-drawer';
    drawer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${SVG_ESCUDO_CTP}" width="36" height="36" alt="CTP"/>
          <div>
            <div style="font-size:14px;font-weight:800;color:#fff;">Menú Principal</div>
            <div style="font-size:11px;color:#38bdf8;">CTP Mercedes Norte</div>
          </div>
        </div>
        <button id="dw-close" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;flex:1;">
        ${SECCIONES_MENU.map(s => `
          <button data-sec="${s.id}" class="dw-nav-btn" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#e2e8f0;padding:10px 12px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;">
            ${s.label}
          </button>
        `).join('')}
      </div>
      <div style="border-top:1px solid #1e293b;padding-top:12px;margin-top:12px;font-size:11px;color:#64748b;">
        Dirección Regional de Heredia • Circuito 04
      </div>
    `;

    // 2. Header Principal con Botón Hamburguesa a la Izquierda, Logos Reales, Configuración grande y Sesión Única
    const header = document.createElement('div');
    header.id = 'bds-pro-header';
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <button id="btn-open-drawer" aria-label="Abrir menú lateral izquierdo" style="background:#131f33;border:1.5px solid #334155;color:#f8fafc;width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <img src="${SVG_MEP_BANNER}" alt="Ministerio de Educación Pública" style="height:40px;width:auto;border-radius:6px;"/>
        <img src="${SVG_ESCUDO_CTP}" alt="Escudo CTP Mercedes Norte" style="height:40px;width:40px;"/>
        <div>
          <div style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Heredia, Circuito 04</div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <button id="btn-config-inst" style="background:#131f33;border:1.5px solid #0284c7;color:#38bdf8;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span>Configuración / SINPE</span>
        </button>

        ${!sesion ? `
          <button id="btn-header-login" style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:8px 14px;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">
            ${GOOGLE_SVG}
            <span>Iniciar sesión con Google</span>
          </button>
        ` : `
          <div style="display:inline-flex;align-items:center;gap:8px;background:#111c2d;border:1px solid #1e293b;padding:5px 10px;border-radius:8px;">
            <span style="font-size:12px;font-weight:700;color:#f8fafc;">${sesion.nombre} (${sesion.seccion})</span>
            <button id="btn-header-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Cerrar sesión</button>
          </div>
        `}
      </div>
    `;

    // 3. Sub-header Horizontal Visible en Computadora y Móvil
    const subnav = document.createElement('div');
    subnav.id = 'bds-subheader-nav';
    subnav.innerHTML = SECCIONES_MENU.map(s => `
      <button data-sec="${s.id}" class="bds-subnav-item">${s.label}</button>
    `).join('');

    document.body.prepend(subnav);
    document.body.prepend(header);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    const toggleDrawer = (open) => {
      drawer.classList.toggle('open', open);
      backdrop.style.display = open ? 'block' : 'none';
    };

    document.getElementById('btn-open-drawer').onclick = () => toggleDrawer(true);
    document.getElementById('dw-close').onclick = () => toggleDrawer(false);
    backdrop.onclick = () => toggleDrawer(false);

    const irASeccion = (secId) => {
      toggleDrawer(false);
      if (secId === 'portada') {
        const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
        const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (secId === 'carnet') {
        if (window.abrirGestorSeaMep) window.abrirGestorSeaMep();
      } else {
        if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa(secId);
      }
    };

    document.querySelectorAll('.dw-nav-btn, .bds-subnav-item').forEach(btn => {
      btn.onclick = () => irASeccion(btn.getAttribute('data-sec'));
    });

    document.getElementById('btn-config-inst').onclick = () => {
      alert('CTP Mercedes Norte — Circuito 04 Heredia.\nSuscripción y Soporte Oficial SINPE Móvil: 60906359 (Max Salazar Sánchez - Banco Popular, Detalle: ".").');
    };

    const bLog = document.getElementById('btn-header-login');
    if (bLog) bLog.onclick = () => window.mostrarModalLoginUnico();

    const bOut = document.getElementById('btn-header-logout');
    if (bOut) bOut.onclick = () => {
      localStorage.removeItem(SESSION_KEY);
      montarHeaderYMenuLateral();
      sanearInterfazCompleta();
    };
  }

  // Sanitizador y Reparador Integral de todas las observaciones de la 11-1 en la página subyacente
  function sanearInterfazCompleta() {
    // A. Eliminar cualquier rastro de #bds-soberana-bar u otros cuadros flotantes inferiores
    ['bds-soberana-bar', 'bds-top-dock', 'bds-fab-launcher', 'bds-drawer-panel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // B. Reparar TODAS las imágenes (incluyendo "1. Logotipo Oficial MEP" y "3. Estandarte / Escudo" en Subida de Activos Gráficos)
    document.querySelectorAll('img').forEach(img => {
      const cardTxt = (img.parentElement && img.parentElement.parentElement && img.parentElement.parentElement.innerText) || '';
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('ministerio') || alt.includes('mep') || cardTxt.includes('Logotipo Oficial MEP')) {
        if (!img.src.startsWith('data:image/svg')) {
          img.src = SVG_MEP_BANNER;
          img.style.objectFit = 'contain';
          img.style.background = '#0f172a';
        }
      } else if (cardTxt.includes('Estandarte') || cardTxt.includes('Escudo') || alt.includes('ctp') || (img.complete && img.naturalWidth === 0)) {
        if (!img.src.startsWith('data:image/svg') && !img.src.includes('qrserver')) {
          img.src = SVG_ESCUDO_CTP;
          img.style.objectFit = 'contain';
        }
      }
      img.onerror = function () { this.src = SVG_ESCUDO_CTP; };
    });

    // C. Eliminar el recuadro repetido "¡Hola, Ing. Max Salazar...!" que duplicaba los dos botones de Permiso Personal y Justificar Estudiante antes de "Acciones Rápidas"
    document.querySelectorAll('div, section').forEach(box => {
      const txt = (box.innerText || '').trim();
      if (txt.startsWith('¡Hola, Ing. Max Salazar') && txt.includes('Permiso Personal') && box.children.length <= 6) {
        box.style.display = 'none';
      }
      // Diferenciar visualmente el título "ACCESOS RÁPIDOS 1-CLIC:" y ocultar el selector público de cambio de rol
      if (txt.startsWith('ACCESOS RÁPIDOS 1-CLIC:') || txt.startsWith('⚡ ACCESOS RÁPIDOS 1-CLIC:')) {
        box.querySelectorAll('select').forEach(sel => {
          if ((sel.innerText || '').includes('SuperAdmin') || (sel.innerText || '').includes('Asesor')) {
            sel.style.display = 'none';
          }
        });
      }
    });

    // D. Hacer 100% funcional el Buscador de permisos, tardías, materias y simulacros
    document.querySelectorAll('input[placeholder*="Buscar"]').forEach(inp => {
      if (!inp.dataset.bdsSearchBound) {
        inp.dataset.bdsSearchBound = "1";
        const boxRes = document.createElement('div');
        boxRes.style.cssText = 'display:none;background:#0b1322;border:1px solid #0284c7;border-radius:8px;padding:10px;margin-top:6px;gap:6px;flex-wrap:wrap;';
        inp.parentElement.appendChild(boxRes);

        const CATALOGO_BUSQUEDA = [
          { k: 'permiso tardia ausencia justificar', label: 'Trámite: Justificar Ausencia / Tardía o Permiso Personal', fn: () => window.abrirGestorSeaMep && window.abrirGestorSeaMep('notas') },
          { k: 'manejo cosevi mopt rotonda vial carro moto', label: 'Simulador Vial 2D y Examen Teórico COSEVI', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('vial') },
          { k: 'matematicas funciones geometria', label: 'Simulacro Oficial: Matemáticas MEP', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('examenes', 'Matemáticas MEP (Secundaria y CTP)') },
          { k: 'desarrollo web software programacion react', label: 'Especialidad: Desarrollo Web y Diseño de Software', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('examenes', 'Desarrollo Web y Diseño de Software') },
          { k: 'redes subneteo ipv4 ipv6 cisco ciberseguridad', label: 'Especialidad: Redes, Subneteo e IPv6 + Cisco CLI', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('examenes', 'Redes, Subneteo (VLSM/FLSM) e IPv6') },
          { k: 'electronica circuitos ohm voltaje', label: 'Especialidad: Electrónica Industrial y Circuitos', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('simuladores_tec') },
          { k: 'excel word apa contabilidad', label: 'Simuladores de Excel, Word APA 7 y Contabilidad', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('simuladores_tec') },
          { k: 'ucr tec una utn uned admision nota presentacion', label: 'Calculadora Nota de Presentación MEP y Admisión U Públicas', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('calculadora') },
          { k: 'juegos ajedrez damas puente clue', label: 'Juegos de Razonamiento: Ajedrez, Damas, Puente y Clue', fn: () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('juegos') }
        ];

        inp.addEventListener('input', () => {
          const q = sinTildes(inp.value);
          if (!q) { boxRes.style.display = 'none'; return; }
          const matches = CATALOGO_BUSQUEDA.filter(item => item.k.includes(q) || sinTildes(item.label).includes(q));
          boxRes.style.display = 'flex';
          if (matches.length === 0) {
            boxRes.innerHTML = `<span style="font-size:12px;color:#fca5a5;">No se encontraron coincidencias para "${inp.value}".</span> <button id="clr-s" style="background:#1e293b;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;">Limpiar búsqueda</button>`;
            const bc = boxRes.querySelector('#clr-s');
            if (bc) bc.onclick = () => { inp.value = ''; boxRes.style.display = 'none'; };
          } else {
            boxRes.innerHTML = matches.map((m, idx) => `<button data-mi="${idx}" class="s-hit-btn" style="background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Ir a: ${m.label}</button>`).join('');
            boxRes.querySelectorAll('.s-hit-btn').forEach(b => {
              b.onclick = () => { matches[parseInt(b.getAttribute('data-mi'), 10)].fn(); boxRes.style.display = 'none'; };
            });
          }
        });
      }
    });

    // E. Ocultar el examen de Razonamiento Verbal y la Hoja Oficial en la página base hasta que el usuario le dé a "Empezar Simulacro" (Reporte Pablo Mejía 11-1)
    document.querySelectorAll('div').forEach(div => {
      const txt = (div.innerText || '').trim();
      if (txt.startsWith('Avance del Simulacro: 0 de') && !div.dataset.bdsStartGate) {
        div.dataset.bdsStartGate = "1";
        const parentSection = div.parentElement;
        if (parentSection) {
          const btnEmpezar = document.createElement('button');
          btnEmpezar.style.cssText = 'display:block;width:100%;max-width:420px;margin:14px auto;background:#059669;color:#fff;border:none;padding:14px 20px;border-radius:10px;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px rgba(5,150,105,0.4);';
          btnEmpezar.innerText = 'Empezar Simulacro Seleccionado Ahora';
          btnEmpezar.onclick = () => {
            if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes');
          };
          div.replaceWith(btnEmpezar);
        }
      }
    });

    // F. Limpiar emojis genéricos en botones y títulos visibles
    document.querySelectorAll('h1, h2, h3, button, a, span').forEach(limpiarEmojisEnNodo);
  }

  window.addEventListener('DOMContentLoaded', () => {
    montarHeaderYMenuLateral();
    sanearInterfazCompleta();
  });
  setInterval(sanearInterfazCompleta, 900);
  setTimeout(() => { montarHeaderYMenuLateral(); sanearInterfazCompleta(); }, 300);
})();