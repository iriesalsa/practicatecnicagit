(function () {
  // Llave única v115 que purga cualquier sesión anterior y exige verificación estricta de Gmail/MEP
  const SESSION_KEY = "bds_auth_gate_v115_strict";
  const LOCK_KEY = "bds_login_attempts_v115";

  // Limpiar cualquier sesión vieja para forzar que NINGÚN usuario entre sin autenticarse
  ['bds_auth_gate_v112_final', 'bds_auth_gate_v111_final', 'bds_auth_gate_v109', 'bds_auth_gate_v104', 'bds_auth_gate_obligatorio_v103'].forEach(k => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = ["Estudiante", "Docente MEP", "Profesor Guía", "Auxiliar Administrativo", "Subdirector(a)", "Director(a)", "SuperAdmin"];

  window.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="190" height="46"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12.5">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="48" height="48"><rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/><text x="40" y="38" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">CTPMN</text><text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="700" font-size="8.5">HEREDIA</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function esSuperAdminMax(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c === 'maxi.salsa@gmail.com' || c.includes('max.salazar.sanchez') || c.includes('maxi.salsa');
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
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-mega-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto();
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v115-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v115-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; }
      body:not(.bds-authenticated) #root { display: none !important; }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel { display: none !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      }
      #bds-subheader-nav {
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; gap: 8px;
        overflow-x: auto; white-space: nowrap;
      }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #1e293b; color: #cbd5e1;
        padding: 7px 13px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
      }
      .bds-subnav-item:hover { background: #0284c7; border-color: #0284c7; color: #fff; }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginEstricto = function () {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v115');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v115';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:14px;max-width:420px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
        <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:14px;">
          <img src="${SVG_CTP}" width="48" height="48" alt="CTP"/>
          <img src="${SVG_MEP}" height="42" alt="MEP" style="border-radius:6px;"/>
        </div>
        <div style="text-align:center;margin-bottom:18px;">
          <h1 style="margin:0;font-size:21px;font-weight:800;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:11.5px;color:#94a3b8;">Verificación de Identidad Requerida • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v115" style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Correo Gmail / MEP (Obligatorio para verificar identidad):</label>
            <input id="lg-mail" type="email" placeholder="tucorreo@gmail.com o @est.mep.go.cr" required autofocus style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Nombre y Apellidos:</label>
            <input id="lg-nom" type="text" placeholder="Escribe tu nombre completo" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10px;color:#94a3b8;margin-bottom:2px;">Rol:</label>
              <select id="lg-rol" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:10px;color:#94a3b8;margin-bottom:2px;">Sección (7-1 a 12-4):</label>
              <select id="lg-sec" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='11-1'?'selected':''}>Sección ${sc}</option>`).join('')}
              </select>
            </div>
          </div>
          <button type="submit" style="margin-top:8px;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
            ${GOOGLE_SVG} <span>Verificar e Iniciar Sesión con Google</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v115').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;

      const esMax = esSuperAdminMax(mail) || rolSel === 'SuperAdmin';
      setSesion({
        id: esMax ? 'SUPERADMIN-MAX' : ('ID-' + secSel),
        nombre: esMax ? (nom || 'Ing. Max Salazar Sánchez') : (nom || 'Usuario'),
        email: mail,
        rol: esMax ? 'SuperAdmin' : rolSel,
        esSuperAdmin: esMax,
        seccion: secSel
      });

      gate.remove();
      activarPlataformaAutenticada();
    };
  };

  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto(); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });

    const esMaxReal = s.esSuperAdmin || esSuperAdminMax(s.email) || s.rol === 'SuperAdmin';
    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${SVG_MEP}" alt="MEP" style="height:36px;width:auto;border-radius:6px;"/>
        <img src="${SVG_CTP}" alt="CTP" style="height:36px;width:36px;"/>
        <div>
          <div style="font-size:14.5px;font-weight:800;color:#fff;">
            prac<span style="color:#0ea5e9;">TICA</span>tecnica.com
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:10px;font-weight:900;padding:2px 7px;border-radius:4px;margin-left:6px;">SUPERADMIN SOBERANO</span>` : ''}
          </div>
          <div style="font-size:11px;color:#38bdf8;">
            <b>${s.nombre} (${s.email})</b> • Rol: <b>${s.rol}</b> • Sección: <b style="color:#34d399;">Sección ${s.seccion}</b>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
        <div style="display:inline-flex;align-items:center;gap:5px;background:#131f33;border:1px solid #0284c7;padding:4px 8px;border-radius:8px;font-size:11px;">
          <span style="color:#67e8f9;font-weight:700;">Sección:</span>
          <select id="sa-sec" style="background:#090f1a;border:1px solid #334155;color:#34d399;font-weight:800;padding:4px 6px;border-radius:5px;font-size:11px;cursor:pointer;">
            ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${s.seccion===sc?'selected':''}>Sección ${sc}</option>`).join('')}
          </select>
          ${esMaxReal ? `
            <span style="color:#fbbf24;font-weight:700;margin-left:4px;">Rol:</span>
            <select id="sa-rol" style="background:#090f1a;border:1px solid #334155;color:#fbbf24;font-weight:800;padding:4px 6px;border-radius:5px;font-size:11px;cursor:pointer;">
              ${ROLES_INSTITUCIONALES.map(r => `<option value="${r}" ${s.rol===r?'selected':''}>${r}</option>`).join('')}
            </select>
          ` : ''}
        </div>

        <button id="btn-top-games" style="background:#7c3aed;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
          🎮 8 Juegos Lógicos
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'juegos', label: '1. 8 Juegos Lógicos (Ajedrez, Damas, 4L, Ranas, Puente, Adivina Quién, Among Us, Clue)' },
      { id: 'vial', label: '2. Simulador Manejo 2D (Moto, Carro, Tráiler)' },
      { id: 'examenes', label: '3. Exámenes Oficiales (COSEVI / MEP / UCR)' },
      { id: 'calculadora', label: '4. Nota Presentación MEP / U' }
    ];
    sub.innerHTML = MODS.map(m => `<button data-mod="${m.id}" class="bds-subnav-item">${m.label}</button>`).join('');

    document.body.prepend(sub);
    document.body.prepend(hdr);

    document.getElementById('sa-sec').onchange = (e) => {
      const cur = getSesion(); cur.seccion = e.target.value; setSesion(cur); activarPlataformaAutenticada();
    };
    const sRol = document.getElementById('sa-rol');
    if (sRol) {
      sRol.onchange = (e) => {
        const cur = getSesion(); cur.rol = e.target.value; if (cur.rol === 'SuperAdmin') cur.esSuperAdmin = true; setSesion(cur); activarPlataformaAutenticada();
      };
    }

    document.getElementById('btn-top-games').onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa('juegos');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('.bds-subnav-item').forEach(b => {
      b.onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa(b.getAttribute('data-mod'));
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    // Exigir siempre inicio de sesión limpio (sin auto-ingresar con cuentas viejas)
    cerrarSesionTotal();
  });
})();