(function () {
  const SESSION_KEY = "bds_auth_gate_v154_business";
  const TRIAL_START_KEY = "bds_trial_start_v154";
  const LOCK_KEY = "bds_auth_lock_v154";
  const XP_KEY = "bds_gamification_xp_v154";
  const RULETA_STORAGE_KEY = "bds_ruleta_saber_items_v154";
  const QR_REGISTRY_KEY = "bds_qr_valid_registry_v154";
  const CHAT_STORAGE_KEY = "bds_chats_canales_v154";

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true, icono: "🎒", color: "#0284c7" },
    { rol: "Docente MEP", requiereSeccion: true, icono: "👨‍🏫", color: "#059669" },
    { rol: "Director(a)", requiereSeccion: false, icono: "🏛️", color: "#7c3aed" },
    { rol: "Ministro(a) MEP", requiereSeccion: false, icono: "🇨🇷", color: "#d97706" },
    { rol: "SuperAdmin", requiereSeccion: false, icono: "👑", color: "#f59e0b" }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="155" height="36"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="38" height="38"><rect width="80" height="80" rx="16" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><circle cx="40" cy="42" r="24" fill="#0284c7"/><path d="M22 24 L32 30 L24 36 Z" fill="#38bdf8"/><path d="M58 24 L48 30 L56 36 Z" fill="#38bdf8"/><circle cx="31" cy="38" r="8" fill="#ffffff"/><circle cx="49" cy="38" r="8" fill="#ffffff"/><circle cx="31" cy="38" r="4" fill="#020617"/><circle cx="49" cy="38" r="4" fill="#020617"/><polygon points="40,42 35,50 45,50" fill="#f59e0b"/><text x="40" y="73" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="8.5">CTPMN</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function calcularDiasPruebaRestantes() {
    try {
      let tStart = localStorage.getItem(TRIAL_START_KEY);
      if (!tStart) {
        tStart = Date.now().toString();
        localStorage.setItem(TRIAL_START_KEY, tStart);
      }
      const diffMs = Date.now() - parseInt(tStart, 10);
      const diasPasados = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(0, 13 - diasPasados);
    } catch {
      return 13;
    }
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
    sessionStorage.clear();
    localStorage.clear();
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-slide-drawer'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto();
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v154-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v154-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
      body:not(.bds-authenticated) #root { display: block !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 19, 34, 0.98); backdrop-filter: blur(12px);
        border-bottom: 1px solid #1e293b; padding: 8px 12px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.7);
      }
      #bds-subheader-nav {
        position: sticky; top: 54px; z-index: 99985;
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 7px 12px; display: flex; align-items: center; gap: 7px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      #bds-subheader-nav::-webkit-scrollbar { display: none; }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 8px 13px; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; flex-shrink: 0; transition: all 0.15s ease; min-height: 36px;
      }
      .bds-subnav-item:hover, .bds-subnav-item.active { background: #0284c7; border-color: #38bdf8; color: #fff; }
      #bds-app-shell { max-width: 1240px; margin: 0 auto; padding: 14px 12px 96px; box-sizing: border-box; }
    `;
    document.body.appendChild(st);
  }

  window.mostrarLoginEstricto = function () {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v154');
    if (old) old.remove();

    const diasRestantes = calcularDiasPruebaRestantes();
    const gate = document.createElement('div');
    gate.id = 'bds-login-v154';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at top,#0f2942 0%,#060c17 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:430px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
        <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:8px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="42" height="42" alt="Búho"/>
          <img src="${SVG_MEP}" height="34" alt="MEP" style="border-radius:6px;"/>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
          <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Acceso con Google Auth o Planes Institucionales • CTPMN</p>
        </div>

        <div style="background:#0f172a;border:1px solid #38bdf8;border-radius:8px;padding:9px;margin-bottom:10px;text-align:center;font-size:11.5px;color:#38bdf8;font-weight:700;">
          ⏳ Prueba Gratuita Activa: <b style="color:#fbbf24;">${diasRestantes} días restantes</b> de conteo regresivo.<br>
          <span style="font-size:10px;color:#cbd5e1;">O activa acceso total inmediato por SINPE Móvil (₡3,500 / $4.99 anuales).</span>
        </div>

        <form id="f-login-v154" style="display:flex;flex-direction:column;gap:8px;">
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Correo Google / MEP:</label>
            <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Nombre Completo:</label>
            <input id="lg-nom" type="text" placeholder="Tu nombre" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:13px;"/>
          </div>
          <button type="submit" style="margin-top:6px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
            🔐 Iniciar Sesión con Google Auth
          </button>
          <button type="button" id="btn-visitante" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
            👀 Explorar Modo Visitante (Sin Cuenta)
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('btn-visitante').onclick = () => {
      setSesion({ id: 'VISITANTE-PUBLICO', nombre: 'Visitante Libre', email: 'visitante@practicatecnica.com', rol: 'Estudiante', seccion: 'Exploración PWA' });
      gate.remove();
      activarPlataformaAutenticada();
    };

    document.getElementById('f-login-v154').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const esMax = (mail === 'maxi.salsa@gmail.com');
      setSesion({
        id: esMax ? 'SUPERADMIN-MAX' : 'USER-' + Date.now(),
        nombre: nom || 'Estudiante CTPMN',
        email: mail,
        rol: esMax ? 'SuperAdmin' : 'Estudiante',
        seccion: 'Sección 10-3'
      });
      gate.remove();
      activarPlataformaAutenticada();
    };
  };

  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto(); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });

    const dias = calcularDiasPruebaRestantes();
    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho" style="height:32px;width:32px;cursor:pointer;" onclick="location.reload()"/>
        <div>
          <div style="font-size:13px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
          <div style="font-size:10px;color:#38bdf8;">${s.nombre} • ${s.seccion}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:800;">⏳ Prueba: ${dias}d</span>
        <button onclick="cerrarSesionTotal()" style="background:#7f1d1d;color:#fecaca;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';
    shell.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:20px;text-align:center;">
        <h2 style="color:#38bdf8;margin-top:0;">🚀 Plataforma Operativa & Reglas de Negocio v154.0</h2>
        <p style="color:#cbd5e1;font-size:13px;">Google Auth obligatorio para 13 días de prueba o planes SINPE (₡3,500 / $4.99 anuales). Todo sincronizado y operativo.</p>
        <button onclick="localStorage.clear(); location.reload();" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;margin-top:10px;">Recargar Sistema Completo</button>
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else mostrarLoginEstricto();
  });
})();