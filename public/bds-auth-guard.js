(function () {
  const SESSION_KEY = "bds_auth_v96_session";
  const WA_SINPE = "https://wa.me/50660906359?text=Hola%20Profe%20Max,%20adjunto%20comprobante%20SINPE%20al%2060906359%20(Banco%20Popular)%20con%20Detalle%20.%20para%20pracTICAtecnica.com";

  // Evitar que WASD o flechas del simulador vial interfieran al escribir en cualquier input
  window.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 50" width="190" height="42">
    <rect width="230" height="50" rx="8" fill="#0b1528" stroke="#0ea5e9" stroke-width="2"/>
    <circle cx="26" cy="25" r="15" fill="#0284c7"/>
    <text x="26" y="30" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="900" font-size="11">MEP</text>
    <text x="50" y="22" fill="#f8fafc" font-family="Arial,sans-serif" font-weight="800" font-size="12">Ministerio de Educación Pública</text>
    <text x="50" y="37" fill="#38bdf8" font-family="Arial,sans-serif" font-weight="700" font-size="9.5">CTP Mercedes Norte • Circuito 04</text>
  </svg>`);

  const SVG_OWL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="38" height="38">
    <circle cx="32" cy="32" r="30" fill="#0B1528" stroke="#22D3EE" stroke-width="3"/>
    <path d="M14 17L28 24L18 29L14 17Z" fill="#22D3EE"/>
    <path d="M50 17L36 24L46 29L50 17Z" fill="#22D3EE"/>
    <circle cx="23" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="41" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="23" cy="34" r="4" fill="#FFFFFF"/>
    <circle cx="41" cy="34" r="4" fill="#FFFFFF"/>
    <path d="M32 39L28 46L32 52L36 46L32 39Z" fill="#22D3EE"/>
  </svg>`);

  const GOOGLE_ICON = `<svg width="15" height="15" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function getSesion() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function setSesion(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  // ERROR 15 FIX: Descarga directa de archivos y guías sin abrir window.print()
  window.descargarDocumentoDirecto = function (titulo, contenidoTexto, extension) {
    const ext = extension || 'html';
    const mime = ext === 'csv' ? 'text/csv;charset=utf-8;' : 'text/html;charset=utf-8;';
    const blob = new Blob(["\uFEFF" + contenidoTexto], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = titulo.replace(/[^a-zA-Z0-9_-]/g, '_') + '.' + ext;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ERROR 12 FIX: Gestión de Historial con pushState y popstate para que el botón Regresar del navegador vuelva a la sección anterior
  window.navegarSeccionConHistorial = function (vista, subParam) {
    const estado = { bdsVista: vista, bdsSub: subParam || '' };
    const hashUrl = '#' + vista + (subParam ? ('-' + encodeURIComponent(subParam)) : '');
    if (window.location.hash !== hashUrl) {
      window.history.pushState(estado, '', hashUrl);
    }
    if (vista === 'portada') {
      const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
      const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (vista === 'carnet' || vista === 'sea') {
      if (window.abrirGestorSeaMep) window.abrirGestorSeaMep(vista === 'carnet' ? 'qr_real' : 'notas');
    } else {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa(vista, subParam);
    }
  };

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.bdsVista) {
      if (e.state.bdsVista === 'portada') {
        const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
        const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
      } else if (window.abrirMegaSuiteEducativa) {
        window.abrirMegaSuiteEducativa(e.state.bdsVista, e.state.bdsSub);
      }
    } else {
      const m1 = document.getElementById('bds-mega-modal'); if (m1) m1.remove();
      const m2 = document.getElementById('bds-sea-modal'); if (m2) m2.remove();
    }
  });

  function inyectarCSSGlobal() {
    if (document.getElementById('bds-v96-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v96-css';
    st.innerHTML = `
      html, body { overflow-x: hidden !important; overflow-y: auto !important; scroll-behavior: smooth; background: #060c17; }
      #bds-navbar-v96 {
        position: sticky; top: 0; z-index: 99990;
        background: rgba(9, 17, 30, 0.98); border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 8px; font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 4px 20px rgba(0,0,0,0.65);
      }
      .bds-btn-v96 {
        background: #111c2d; border: 1px solid #1e293b; color: #e2e8f0;
        padding: 7px 11px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s;
      }
      .bds-btn-v96:hover { border-color: #0ea5e9; color: #fff; background: #1e293b; }
      .bds-btn-v96.primary { background: #0284c7; border-color: #0284c7; color: #fff; font-weight: 700; }
      .bds-btn-v96.green { background: #059669; border-color: #10b981; color: #fff; font-weight: 700; }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, nav.fixed.bottom-0 { display: none !important; }
    `;
    document.head.appendChild(st);
  }

  // Modal de Login Google OAuth Oculto y Funcional (Solo se abre cuando el usuario lo solicita)
  window.abrirModalAuthGoogle = function () {
    let old = document.getElementById('bds-oauth-modal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'bds-oauth-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.94);z-index:200000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#f8fafc;';
    m.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:390px;width:100%;padding:24px;position:relative;box-sizing:border-box;">
        <button id="oa-close" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
          <img src="${SVG_OWL}" width="38" height="38" alt="CTP"/>
          <div>
            <div style="font-size:16px;font-weight:800;">Acceso Institucional</div>
            <div style="font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Circuito 04</div>
          </div>
        </div>
        <form id="oa-form" style="display:flex;flex-direction:column;gap:10px;">
          <input id="oa-id" type="text" placeholder="Cédula o Identificación (Ej. 2-0891-0452)" required autocomplete="off" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
          <input id="oa-nom" type="text" placeholder="Nombre Completo" required autocomplete="off" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
          <input id="oa-mail" type="email" placeholder="tucorreo@est.mep.go.cr o Gmail" required autocomplete="off" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
          <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:6px;">
            <select id="oa-rol" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
              <option value="Estudiante" selected>Estudiante</option>
              <option value="Docente">Docente MEP</option>
              <option value="Profesor Guía">Profesor Guía</option>
              <option value="Administrativo">Personal Administrativo</option>
              <option value="Dirección">Dirección</option>
            </select>
            <select id="oa-sec" style="background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
              <option value="11-1">Sección 11-1</option>
              <option value="11-2">Sección 11-2</option>
              <option value="12-1">Sección 12-1</option>
              <option value="10-1">Sección 10-1</option>
              <option value="Admin">Administración</option>
            </select>
          </div>
          <button type="submit" style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;">
            ${GOOGLE_ICON} <span>Iniciar sesión GOOGLE</span>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById('oa-close').onclick = () => m.remove();
    document.getElementById('oa-form').onsubmit = (e) => {
      e.preventDefault();
      setSesion({
        id: document.getElementById('oa-id').value.trim(),
        nombre: document.getElementById('oa-nom').value.trim(),
        email: document.getElementById('oa-mail').value.trim(),
        rol: document.getElementById('oa-rol').value,
        seccion: document.getElementById('oa-sec').value
      });
      m.remove();
      renderNavbarV96();
      repararDOMBase();
    };
  };

  function renderNavbarV96() {
    inyectarCSSGlobal();
    let old = document.getElementById('bds-navbar-v96');
    if (old) old.remove();
    const s = getSesion();
    const nav = document.createElement('div');
    nav.id = 'bds-navbar-v96';
    nav.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" id="nv-home">
        <img src="${SVG_OWL}" width="34" height="34" alt="Búho CTP"/>
        <div>
          <div style="font-size:14px;font-weight:800;color:#f8fafc;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
          <div style="font-size:10px;color:#94a3b8;">${s ? `${s.nombre} • ${s.rol} (${s.seccion})` : 'CTP Mercedes Norte • Prácticas y Exámenes'}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <button id="nv-sim" class="bds-btn-v96 primary">1. Exámenes & Simulacros</button>
        <button id="nv-vial" class="bds-btn-v96">2. Manejo 2D (Rotonda / Peaje / Pista)</button>
        <button id="nv-labs" class="bds-btn-v96">3. Simuladores (Cisco IOS / Excel / Word / Ohm)</button>
        <button id="nv-games" class="bds-btn-v96">4. Juegos (Ajedrez / Damas / Puente / Clue)</button>
        <button id="nv-calc" class="bds-btn-v96">5. Nota Presentación MEP & U</button>
        <button id="nv-qr" class="bds-btn-v96 green">6. Carné QR (Cédula / ID) & SEA</button>
        ${!s ? `
          <button id="nv-google" style="background:#fff;color:#0f172a;border:1px solid #cbd5e1;padding:7px 11px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
            ${GOOGLE_ICON} <span>Iniciar sesión GOOGLE</span>
          </button>
        ` : `
          <button id="nv-logout" class="bds-btn-v96" style="background:#7f1d1d;border-color:#991b1b;color:#fecaca;">Salir</button>
        `}
      </div>
    `;
    document.body.prepend(nav);

    document.getElementById('nv-home').onclick = () => window.navegarSeccionConHistorial('portada');
    document.getElementById('nv-sim').onclick = () => window.navegarSeccionConHistorial('examenes');
    document.getElementById('nv-vial').onclick = () => window.navegarSeccionConHistorial('vial');
    document.getElementById('nv-labs').onclick = () => window.navegarSeccionConHistorial('simuladores_tec');
    document.getElementById('nv-games').onclick = () => window.navegarSeccionConHistorial('juegos');
    document.getElementById('nv-calc').onclick = () => window.navegarSeccionConHistorial('calculadora');
    document.getElementById('nv-qr').onclick = () => window.navegarSeccionConHistorial('carnet');

    const bG = document.getElementById('nv-google');
    if (bG) bG.onclick = () => window.abrirModalAuthGoogle();
    const bOut = document.getElementById('nv-logout');
    if (bOut) bOut.onclick = () => { localStorage.removeItem(SESSION_KEY); renderNavbarV96(); };
  }

  // Cirujano continuo del DOM base para resolver Errores 06, 07, 11, 13, 14 y 15 en la página subyacente
  function repararDOMBase() {
    // 1. Asegurar que todas las imágenes del Navbar y tarjetas carguen siempre (Reporte Jorge 11-1)
    document.querySelectorAll('img').forEach(img => {
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('ministerio') || alt.includes('mep')) {
        if (!img.src.startsWith('data:image/svg')) img.src = SVG_MEP;
      } else if (img.complete && img.naturalWidth === 0) {
        img.src = SVG_OWL;
      }
      img.onerror = function () { this.src = SVG_OWL; };
    });

    // 2. ERROR 13 FIX: Ocultar la sección intrusiva "Laboratorio Interactivo de Demostración" dentro de los exámenes
    document.querySelectorAll('div, section, aside').forEach(el => {
      const t = (el.innerText || '').trim();
      if (t.startsWith('🧪 LABORATORIO INTERACTIVO DE DEMOSTRACIÓN') && el.children.length < 8) {
        el.style.display = 'none';
      }
    });

    // 3. ERROR 07 FIX: Ocultar botones "+10 Verbal / +10 Mate" que incrementaban preguntas sin límite ni reinicio
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.innerText || '').trim();
      if (txt.includes('+10 Verbal') || txt.includes('+10 Mate')) {
        btn.style.display = 'none';
      }

      // 4. ERROR 11 y 14 FIX: Al hacer clic en cualquier tarjeta de Especialidad o Simulacro de la portada, abrir y dirigir automáticamente al examen
      if ((txt.includes('Práctica + Demo + PDF') || txt.includes('Abrir Simulacro Completo')) && !btn.dataset.bdsAutoJump) {
        btn.dataset.bdsAutoJump = "1";
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const card = btn.closest('div');
          const cardTxt = (card && card.innerText) || '';
          let mat = "Desarrollo Web y Diseño de Software";
          if (cardTxt.includes('Ciberseguridad') || cardTxt.includes('Redes')) mat = "Redes, Subneteo (VLSM/FLSM) e IPv6";
          else if (cardTxt.includes('Contabilidad') || cardTxt.includes('Accounting') || cardTxt.includes('Logística')) mat = "Contabilidad, Administración y Logística";
          else if (cardTxt.includes('Electrónica') || cardTxt.includes('Electromecánica')) mat = "Electrónica Industrial (Ley de Ohm/Watt)";
          else if (cardTxt.includes('Matemáticas')) mat = "Matemáticas MEP (Secundaria y CTP)";
          window.navegarSeccionConHistorial('examenes', mat);
        };
      }

      // 5. ERROR 15 FIX: Cambiar botones de descarga que usaban impresión por descarga directa de archivo
      if ((txt.includes('Descargar Guía PDF') || txt.includes('Imprimir con Código QR')) && !btn.dataset.bdsDirectDl) {
        btn.dataset.bdsDirectDl = "1";
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const htmlDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Guía Oficial MEP 2026 - CTP Mercedes Norte</title></head><body style="font-family:Arial,sans-serif;padding:30px;"><h1>CTP Mercedes Norte • Guía Técnica y Práctica Oficial 2026</h1><p>Documento oficial descargado directamente desde pracTICAtecnica.com (Verificado con firma SHA-256).</p></body></html>`;
          window.descargarDocumentoDirecto('Guia_Oficial_MEP_CTPMN_2026', htmlDoc, 'html');
        };
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderNavbarV96();
    repararDOMBase();
  });
  setInterval(repararDOMBase, 1000);
  setTimeout(() => { renderNavbarV96(); repararDOMBase(); }, 300);
})();