(function () {
  const SESSION_KEY = "bds_session_ironman_v98";
  const WA_SINPE = "https://wa.me/50660906359?text=Hola%20Profe%20Max,%20adjunto%20comprobante%20SINPE%20al%2060906359%20(Banco%20Popular)%20con%20Detalle%20.%20para%20pracTICAtecnica.com";

  // Proteger inputs de cualquier captura de teclado de los simuladores
  window.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  const SVG_MEP_BANNER = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="195" height="48">
    <rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
    <circle cx="30" cy="30" r="18" fill="#0284c7"/>
    <text x="30" y="35" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-weight="900" font-size="13">MEP</text>
    <text x="58" y="26" fill="#f8fafc" font-family="system-ui,sans-serif" font-weight="800" font-size="12.5">Ministerio de Educación Pública</text>
    <text x="58" y="43" fill="#38bdf8" font-family="system-ui,sans-serif" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text>
  </svg>`);

  const SVG_ESCUDO_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="50" height="50">
    <rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/>
    <path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/>
    <text x="40" y="38" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-weight="900" font-size="13">CTPMN</text>
    <text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui,sans-serif" font-weight="700" font-size="8.5">HEREDIA</text>
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

  window.navegarModulo = function (vista, sub) {
    const hash = '#' + vista + (sub ? ('-' + encodeURIComponent(sub)) : '');
    if (window.location.hash !== hash) {
      window.history.pushState({ vista, sub: sub || '' }, '', hash);
    }
    if (vista === 'portada') {
      const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
      const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (vista === 'carnet') {
      if (window.abrirGestorSeaMep) window.abrirGestorSeaMep();
    } else if (window.abrirMegaSuiteEducativa) {
      window.abrirMegaSuiteEducativa(vista, sub);
    }
  };

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.vista) {
      if (e.state.vista === 'portada') {
        const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
        const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
      } else if (window.abrirMegaSuiteEducativa) {
        window.abrirMegaSuiteEducativa(e.state.vista, e.state.sub);
      }
    } else {
      const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
      const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
    }
  });

  function inyectarCSSUltra() {
    if (document.getElementById('bds-v98-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v98-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      html, body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        background-color: #090f1a !important; color: #f1f5f9 !important;
        overflow-x: hidden !important; overflow-y: auto !important;
      }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel { display: none !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.5);
      }
      #bds-subheader-nav {
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; gap: 8px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;
      }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #1e293b; color: #cbd5e1;
        padding: 7px 13px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; transition: all 0.15s;
      }
      .bds-subnav-item:hover { background: #0284c7; border-color: #0284c7; color: #fff; }
      #bds-left-drawer-backdrop {
        position: fixed; inset: 0; background: rgba(3, 7, 18, 0.75); z-index: 199990; display: none;
      }
      #bds-left-drawer {
        position: fixed; top: 0; left: 0; bottom: 0; width: 295px; max-width: 84vw;
        background: #0b1322; border-right: 1px solid #1e293b; z-index: 199995;
        transform: translateX(-100%); transition: transform 0.22s ease;
        display: flex; flex-direction: column; padding: 18px; box-sizing: border-box; overflow-y: auto;
      }
      #bds-left-drawer.open { transform: translateX(0); }
    `;
    document.head.appendChild(st);
  }

  window.mostrarModalLoginUnico = function () {
    if (getSesion()) return;
    let old = document.getElementById('bds-single-login');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'bds-single-login';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.92);z-index:250000;display:flex;align-items:center;justify-content:center;padding:16px;';
    m.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:390px;width:100%;padding:24px;position:relative;box-sizing:border-box;">
        <button id="sl-close" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <img src="${SVG_ESCUDO_CTP}" width="42" height="42" alt="CTP"/>
          <div>
            <div style="font-size:16px;font-weight:800;color:#f8fafc;">Iniciar sesión</div>
            <div style="font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Sesión Personal</div>
          </div>
        </div>
        <form id="sl-form" style="display:flex;flex-direction:column;gap:10px;">
          <input id="sl-id" type="text" placeholder="Cédula o Identificación (Ej. 2-0891-0452)" required autocomplete="off" style="background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          <input id="sl-nom" type="text" placeholder="Nombre y Apellidos" required autocomplete="off" style="background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          <input id="sl-mail" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;"/>
          <select id="sl-sec" style="background:#090f1a;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:13px;">
            <option value="11-1">Estudiante — Sección 11-1</option>
            <option value="11-2">Estudiante — Sección 11-2</option>
            <option value="12-1">Estudiante — Sección 12-1</option>
            <option value="10-1">Estudiante — Sección 10-1</option>
            <option value="Docente MEP">Docente / Profesor Guía</option>
          </select>
          <button type="submit" style="margin-top:6px;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;">
            ${GOOGLE_SVG} <span>Iniciar sesión con Google</span>
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
      montarHeaderUltra();
    };
  };

  function montarHeaderUltra() {
    inyectarCSSUltra();
    ['bds-pro-header', 'bds-subheader-nav', 'bds-left-drawer', 'bds-left-drawer-backdrop'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    const sesion = getSesion();
    const ITEMS = [
      { id: 'vial', label: '1. Simulador Manejo 2D (Moto / Carro / Tráiler)' },
      { id: 'redes_cisco', label: '2. Redes, Subneteo VLSM/FLSM & Cisco IOS CLI' },
      { id: 'excel_sim', label: '3. Simulador de Comandos y Fórmulas Excel' },
      { id: 'ciberseguridad', label: '4. Ciberseguridad (Firewall ACL / SHA-256 / SOC)' },
      { id: 'examenes', label: '5. Exámenes y Simulacros (MEP / UCR / TEC / UTN)' },
      { id: 'juegos', label: '6. Juegos Lógicos (Ajedrez, Damas, Puente, Clue)' },
      { id: 'calculadora', label: '7. Nota de Presentación MEP y Admisión U' },
      { id: 'carnet', label: '8. Carné QR Escaneable y Planilla SEA-MEP' }
    ];

    const backdrop = document.createElement('div');
    backdrop.id = 'bds-left-drawer-backdrop';
    const drawer = document.createElement('div');
    drawer.id = 'bds-left-drawer';
    drawer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${SVG_ESCUDO_CTP}" width="34" height="34" alt="CTP"/>
          <span style="font-size:14px;font-weight:800;color:#fff;">Navegación Principal</span>
        </div>
        <button id="dw-x" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button data-go="portada" class="nav-go" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#38bdf8;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">Inicio / Portada Principal</button>
        ${ITEMS.map(it => `<button data-go="${it.id}" class="nav-go" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#e2e8f0;padding:10px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">${it.label}</button>`).join('')}
      </div>
    `;

    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <button id="btn-ham" aria-label="Menú Lateral" style="background:#131f33;border:1.5px solid #334155;color:#fff;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <img src="${SVG_MEP_BANNER}" alt="MEP" style="height:38px;width:auto;border-radius:6px;"/>
        <img src="${SVG_ESCUDO_CTP}" alt="CTP" style="height:38px;width:38px;"/>
        <div>
          <div style="font-size:15px;font-weight:800;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
          <div style="font-size:10.5px;color:#94a3b8;">CTP Mercedes Norte • Heredia, Circuito 04</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <a href="${WA_SINPE}" target="_blank" style="background:#065f46;border:1px solid #10b981;color:#ecfdf5;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">SINPE 6090-6359</a>
        ${!sesion ? `
          <button id="hdr-login" style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:7px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">
            ${GOOGLE_SVG} <span>Iniciar sesión con Google</span>
          </button>
        ` : `
          <div style="display:inline-flex;align-items:center;gap:8px;background:#111c2d;border:1px solid #1e293b;padding:5px 10px;border-radius:8px;">
            <span style="font-size:12px;font-weight:700;color:#38bdf8;">${sesion.nombre} (${sesion.seccion})</span>
            <button id="hdr-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Cerrar sesión</button>
          </div>
        `}
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    sub.innerHTML = ITEMS.map(it => `<button data-go="${it.id}" class="bds-subnav-item">${it.label}</button>`).join('');

    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    const setOpen = (o) => { drawer.classList.toggle('open', o); backdrop.style.display = o ? 'block' : 'none'; };
    document.getElementById('btn-ham').onclick = () => setOpen(true);
    document.getElementById('dw-x').onclick = () => setOpen(false);
    backdrop.onclick = () => setOpen(false);

    document.querySelectorAll('.nav-go, .bds-subnav-item').forEach(b => {
      b.onclick = () => { setOpen(false); window.navegarModulo(b.getAttribute('data-go')); };
    });

    const bIn = document.getElementById('hdr-login');
    if (bIn) bIn.onclick = () => window.mostrarModalLoginUnico();
    const bOut = document.getElementById('hdr-logout');
    if (bOut) bOut.onclick = () => { localStorage.removeItem(SESSION_KEY); montarHeaderUltra(); };
  }

  function repararDOMContinuo() {
    document.querySelectorAll('img').forEach(img => {
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('ministerio') || alt.includes('mep')) {
        if (!img.src.startsWith('data:image/svg')) img.src = SVG_MEP_BANNER;
      } else if (img.complete && img.naturalWidth === 0) {
        img.src = SVG_ESCUDO_CTP;
      }
      img.onerror = function () { this.src = SVG_ESCUDO_CTP; };
    });

    // Conectar tarjetas de la portada directamente a los nuevos simuladores
    document.querySelectorAll('button').forEach(btn => {
      const t = (btn.innerText || '').trim();
      if ((t.includes('Teórica MOPT') || t.includes('Simulador Vial 2D')) && !btn.dataset.bdsV98Vial) {
        btn.dataset.bdsV98Vial = "1";
        btn.onclick = (e) => { e.stopPropagation(); window.navegarModulo('vial'); };
      } else if ((t.includes('Simuladores de Excel') || t.includes('Especialidades CTP')) && !btn.dataset.bdsV98Ex) {
        btn.dataset.bdsV98Ex = "1";
        btn.onclick = (e) => { e.stopPropagation(); window.navegarModulo('excel_sim'); };
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => { montarHeaderUltra(); repararDOMContinuo(); });
  setInterval(repararDOMContinuo, 1000);
  setTimeout(() => { montarHeaderUltra(); repararDOMContinuo(); }, 300);
})();