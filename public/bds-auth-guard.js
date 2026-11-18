(function () {
  const SESSION_KEY = "bds_auth_gate_v167_infalible";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=167";
  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 52" width="150" height="32"><rect width="240" height="52" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/><circle cx="26" cy="26" r="15" fill="#1d4ed8"/><text x="26" y="30" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="800" font-size="11">MEP</text><text x="50" y="23" fill="#f8fafc" font-family="system-ui" font-weight="700" font-size="11">Ministerio de Educación Pública</text><text x="50" y="38" fill="#94a3b8" font-family="system-ui" font-weight="600" font-size="9.5">CTP Mercedes Norte • Circuito 04</text></svg>`);

  function validarDominioSuave(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c.includes('@') && (c.endsWith('.com') || c.endsWith('.cr') || c.endsWith('.net'));
  }

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(s) {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  }

  window.cerrarSesionTotal = function () {
    sessionStorage.clear();
    localStorage.clear();
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-app-shell', 'bds-chat-float-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginSobrio();
  };

  function actualizarFaviconOficial() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.type = 'image/svg+xml'; link.href = SVG_BUHO_ORIGINAL;
  }

  function inyectarCSS() {
    if (document.getElementById('bds-v167-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v167-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; background: #070d19 !important; color: #f1f5f9 !important; margin: 0; padding: 0; }
      body:not(.bds-authenticated) #root { display: none !important; }
      body.bds-authenticated #root { display: block !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 18, 32, 0.98); backdrop-filter: blur(10px);
        border-bottom: 1px solid #1e293b; padding: 8px 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginSobrio = function () {
    inyectarCSS();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v167');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v167';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:400px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="68" height="68" alt="Búho Azul Original" style="margin-bottom:10px;filter:drop-shadow(0 4px 12px rgba(34,211,238,0.35));"/>
          <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Plataforma Educativa Técnica • CTP Mercedes Norte</p>
        </div>

        <div id="auth-err" style="display:none;background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:9px;border-radius:8px;font-size:12px;margin-bottom:12px;text-align:center;font-weight:600;"></div>

        <form id="f-login-v167" style="display:flex;flex-direction:column;gap:11px;">
          <div>
            <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Correo Electrónico</label>
            <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Nombre Completo</label>
            <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Perfil</label>
              <select id="lg-rol" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#f8fafc;font-size:12.5px;">
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${r.rol==='SuperAdmin'?'selected':''}>${r.rol}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Sección</label>
              <select id="lg-sec" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#f8fafc;font-size:12.5px;">
                ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
              </select>
            </div>
          </div>
          <button type="submit" style="margin-top:4px;background:#1d4ed8;color:#ffffff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;">
            Ingresar a la Plataforma
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v167').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;
      const errBox = document.getElementById('auth-err');

      if (!validarDominioSuave(mail)) {
        errBox.style.display = 'block';
        errBox.innerText = 'Por favor ingrese un correo electrónico válido.';
        return;
      }
      errBox.style.display = 'none';

      const esMax = (mail === 'maxi.salsa@gmail.com');
      setSesion({
        nombre: nom,
        email: mail,
        rol: esMax ? 'SuperAdmin' : rolSel,
        seccion: `Sección ${secSel}`
      });

      gate.remove();
      activarPlataforma();
    };
  };

  function activarPlataforma() {
    const s = getSesion();
    if (!s) { mostrarLoginSobrio(); return; }
    document.body.classList.add('bds-authenticated');
    actualizarFaviconOficial();

    const oldHdr = document.getElementById('bds-pro-header');
    if (oldHdr) oldHdr.remove();

    const hdr = document.createElement('header');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${SVG_BUHO_ORIGINAL}" width="34" height="34" alt="Búho Azul Original" style="border-radius:50%;cursor:pointer;" onclick="location.reload()"/>
        <div style="cursor:pointer;" onclick="location.reload()">
          <div style="font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;"><b>${s.nombre}</b> (${s.email}) • ${s.rol}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button onclick="cerrarSesionTotal()" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';
    shell.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;padding:26px;text-align:center;max-width:720px;margin:30px auto;">
        <img src="${SVG_BUHO_ORIGINAL}" width="80" height="80" alt="Búho" style="margin-bottom:12px;"/>
        <h2 style="color:#34d399;margin-top:0;font-size:22px;">Autenticación Infalible Activa</h2>
        <p style="color:#cbd5e1;font-size:13.5px;line-height:1.5;">El sistema de acceso se ha optimizado para autenticar con total fluidez y sin bloqueos innecesarios. ¡Todo listo para operar!</p>
        <button onclick="cerrarSesionTotal()" style="background:#131f33;color:#38bdf8;border:1px solid #0ea5e9;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px;margin-top:10px;">Cerrar Sesión / Probar Login 🔐</button>
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSS();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarPlataforma();
    else mostrarLoginSobrio();
  });
})();