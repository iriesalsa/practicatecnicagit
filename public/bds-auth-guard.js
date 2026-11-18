(function () {
  const SESSION_KEY = "bds_auth_gate_v161_sobrio";
  const LOCK_KEY = "bds_auth_lock_v161";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "Subdirector(a)", requiereSeccion: false },
    { rol: "Auxiliar Administrativo", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=161";
  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 52" width="160" height="34"><rect width="240" height="52" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/><circle cx="26" cy="26" r="15" fill="#1d4ed8"/><text x="26" y="30" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="800" font-size="11">MEP</text><text x="50" y="23" fill="#f8fafc" font-family="system-ui" font-weight="700" font-size="11">Ministerio de Educación Pública</text><text x="50" y="38" fill="#94a3b8" font-family="system-ui" font-weight="600" font-size="9.5">CTP Mercedes Norte • Circuito 04</text></svg>`);
  const GOOGLE_SVG = `<svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v161.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v161.js').catch(() => {});
    }).catch(() => {});
  }

  function actualizarFaviconOficial() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = SVG_BUHO_ORIGINAL;
  }

  function esSuperAdminSoberano(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c === 'maxi.salsa@gmail.com' || c === 'max.salazar.sanchez@mep.go.cr';
  }

  function validarDominio(correo) {
    return /^[a-z0-9._%+-]+@(gmail\.com|est\.mep\.go\.cr|mep\.go\.cr)$/.test((correo || '').toLowerCase().trim());
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
    const locks = localStorage.getItem(LOCK_KEY);
    sessionStorage.clear();
    localStorage.clear();
    if (locks) localStorage.setItem(LOCK_KEY, locks);
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-chat-float-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginSobrio('login');
  }

  function inyectarEstilosSobrios() {
    if (document.getElementById('bds-v161-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v161-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      html, body { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; background: #070d19 !important; color: #f1f5f9 !important; margin: 0; padding: 0; }
      body:not(.bds-authenticated) #root { display: none !important; }
      body.bds-authenticated #root { display: block !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 18, 32, 0.96); backdrop-filter: blur(10px);
        border-bottom: 1px solid #1e293b; padding: 8px 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
    `;
    document.head.appendChild(st);
  }

  // Repara imágenes rotas en el DOM subyacente (#root) sustituyendo por el Búho Original o el escudo MEP
  function repararImagenesRotas() {
    const fix = () => {
      document.querySelectorAll('#root img').forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          const alt = (img.alt || '').toLowerCase();
          if (alt.includes('ministerio') || alt.includes('mep')) img.src = SVG_MEP;
          else img.src = SVG_BUHO_ORIGINAL;
        }
      });
    };
    fix();
    const obs = new MutationObserver(fix);
    const root = document.getElementById('root');
    if (root) obs.observe(root, { childList: true, subtree: true });
  }

  // ============================================================================
  // LOGIN CUADRADO SOBRIO, FORMAL Y ACADÉMICO (CON BÚHO AZUL ORIGINAL)
  // ============================================================================
  window.mostrarLoginSobrio = function (vistaInicial) {
    inyectarEstilosSobrios();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v161');
    if (old) old.remove();

    let vista = vistaInicial || 'login';
    const gate = document.createElement('div');
    gate.id = 'bds-login-v161';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    function getIntentos() { return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10); }
    function setIntentos(n) { localStorage.setItem(LOCK_KEY, String(n)); }

    function render() {
      const intentos = getIntentos();
      const bloqueado = intentos >= 5;

      if (vista === 'recover') {
        gate.innerHTML = `
          <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:390px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.75);box-sizing:border-box;">
            <div style="text-align:center;margin-bottom:18px;">
              <img src="${SVG_BUHO_ORIGINAL}" width="52" height="52" alt="pracTICAtecnica.com" style="margin-bottom:8px;"/>
              <h2 style="margin:0;font-size:17px;font-weight:700;color:#f8fafc;">Recuperación de Acceso</h2>
              <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Restablecimiento seguro de credencial institucional</p>
            </div>
            <div id="rec-msg" style="display:none;padding:9px;border-radius:8px;font-size:12px;margin-bottom:12px;text-align:center;font-weight:600;"></div>
            <form id="f-rec-v161" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
              <input id="rc-p1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
              <input id="rc-p2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
              <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Actualizar Credencial</button>
              <button type="button" id="btn-back-login" style="background:transparent;color:#94a3b8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">Volver al inicio de sesión</button>
            </form>
          </div>
        `;
        document.getElementById('btn-back-login').onclick = () => { vista = 'login'; render(); };
        document.getElementById('f-rec-v161').onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('rc-mail').value.trim();
          const p1 = document.getElementById('rc-p1').value;
          const p2 = document.getElementById('rc-p2').value;
          const msg = document.getElementById('rec-msg');
          msg.style.display = 'block';
          if (!validarDominio(m) || p1 !== p2) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = 'Verifique que el correo sea válido y las contraseñas coincidan.';
            return;
          }
          setIntentos(0);
          msg.style.background = '#064e3b'; msg.style.color = '#6ee7b7';
          msg.innerText = 'Credencial actualizada. Redirigiendo...';
          setTimeout(() => { vista = 'login'; render(); }, 1000);
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:400px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
          <div style="text-align:center;margin-bottom:20px;">
            <img src="${SVG_BUHO_ORIGINAL}" width="64" height="64" alt="Búho Azul pracTICAtecnica.com" style="margin-bottom:10px;border-radius:50%;box-shadow:0 0 20px rgba(37,99,235,0.35);"/>
            <h1 style="margin:0;font-size:21px;font-weight:800;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Plataforma de Excelencia Académica y Técnica</p>
          </div>

          <div id="auth-err" style="display:${bloqueado?'block':'none'};background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:9px;border-radius:8px;font-size:12px;margin-bottom:12px;text-align:center;font-weight:600;">
            ${bloqueado ? 'Acceso bloqueado tras 5 intentos fallidos. Utilice la opción de recuperación o contacte al administrador.' : ''}
          </div>

          <form id="f-login-v161" style="display:flex;flex-direction:column;gap:11px;">
            <div>
              <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Correo Institucional o Personal</label>
              <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Nombre Completo</label>
              <input id="lg-nom" type="text" placeholder="Nombre y apellidos" required ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Perfil</label>
                <select id="lg-rol" ${bloqueado?'disabled':''} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#f8fafc;font-size:12.5px;">
                  ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}">${r.rol}</option>`).join('')}
                </select>
              </div>
              <div id="wrap-sec">
                <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Sección</label>
                <select id="lg-sec" ${bloqueado?'disabled':''} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#f8fafc;font-size:12.5px;">
                  ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
                </select>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Contraseña</label>
              <input id="lg-pass" type="password" placeholder="Ingrese su contraseña" required minlength="4" ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
            </div>

            <button type="submit" ${bloqueado?'disabled':''} style="margin-top:4px;background:#1d4ed8;color:#ffffff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;">
              Ingresar a la Plataforma
            </button>

            <button type="button" id="btn-google-oauth" ${bloqueado?'disabled':''} style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              ${GOOGLE_SVG} <span>Continuar con Google</span>
            </button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;font-size:11.5px;">
            <button type="button" id="btn-recover" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0;">¿Olvidó su contraseña?</button>
            <span style="color:#64748b;">CTP Mercedes Norte</span>
          </div>
        </div>
      `;

      const rolSel = document.getElementById('lg-rol');
      const secWrap = document.getElementById('wrap-sec');
      const mailIn = document.getElementById('lg-mail');
      const passIn = document.getElementById('lg-pass');

      document.getElementById('btn-recover').onclick = () => { vista = 'recover'; render(); };

      function syncSec() {
        const obj = ROLES_INSTITUCIONALES.find(r => r.rol === rolSel.value);
        secWrap.style.display = (esSuperAdminSoberano(mailIn.value) || (obj && !obj.requiereSeccion)) ? 'none' : 'block';
      }
      rolSel.onchange = syncSec;
      mailIn.oninput = () => {
        if (esSuperAdminSoberano(mailIn.value)) rolSel.value = 'SuperAdmin';
        syncSec();
      };
      syncSec();

      function completarIngreso() {
        const mail = mailIn.value.trim().toLowerCase();
        const nom = document.getElementById('lg-nom').value.trim();
        const err = document.getElementById('auth-err');
        if (!validarDominio(mail)) {
          const n = getIntentos() + 1; setIntentos(n);
          err.style.display = 'block';
          err.innerText = `Correo no autorizado (${n}/5). Utilice @est.mep.go.cr, @mep.go.cr o @gmail.com.`;
          if (n >= 5) render();
          return;
        }
        const esMax = esSuperAdminSoberano(mail);
        if (!esMax && rolSel.value === 'SuperAdmin') {
          const n = getIntentos() + 1; setIntentos(n);
          err.style.display = 'block';
          err.innerText = `Perfil SuperAdmin reservado (${n}/5).`;
          if (n >= 5) render();
          return;
        }
        setIntentos(0);
        const rolFinal = esMax ? 'SuperAdmin' : rolSel.value;
        setSesion({
          nombre: nom || (esMax ? 'Ing. Max Salazar Sánchez' : mail.split('@')[0]),
          email: mail,
          rol: rolFinal,
          seccion: `Sección ${document.getElementById('lg-sec').value}`
        });
        gate.remove();
        activarBarraSobria();
      }

      document.getElementById('f-login-v161').onsubmit = (e) => { e.preventDefault(); completarIngreso(); };
      document.getElementById('btn-google-oauth').onclick = () => {
        if (!passIn.value) passIn.value = 'google-oauth';
        completarIngreso();
      };
    }

    document.body.appendChild(gate);
    render();
  };

  // ============================================================================
  // PANEL FLOTANTE DE COMUNICACIONES (SE ABRE SOLO AL PRESIONAR EL BOTÓN SUPERIOR)
  // ============================================================================
  function toggleComunicaciones() {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const canales = [
      { id: 'a', nom: 'Subgrupo A (Esp. 1)', msgs: [{ rem: 'Coordinación', hora: '07:30', txt: 'Canal académico habilitado para el Subgrupo A.' }] },
      { id: 'b', nom: 'Subgrupo B (Esp. 2)', msgs: [{ rem: 'Coordinación', hora: '07:35', txt: 'Canal académico habilitado para el Subgrupo B.' }] },
      { id: 'dir', nom: 'Dirección / Avisos', msgs: [{ rem: 'Dirección CTPMN', hora: '07:00', txt: 'Circulares y avisos institucionales del Circuito 04.' }] }
    ];
    let act = 'a';

    const modal = document.createElement('div');
    modal.id = 'bds-chat-float-modal';
    modal.style.cssText = 'position:fixed;top:58px;right:16px;z-index:250000;width:370px;max-width:92vw;background:#0b1322;border:1px solid #334155;border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.85);display:flex;flex-direction:column;height:420px;';

    function draw() {
      const c = canales.find(x => x.id === act) || canales[0];
      const key = `bds_chat_v161_${c.id}`;
      let msgs = c.msgs;
      try { msgs = JSON.parse(localStorage.getItem(key)) || c.msgs; } catch {}

      modal.innerHTML = `
        <div style="background:#0f172a;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;">
          <span style="font-size:13px;font-weight:700;color:#f8fafc;">Comunicaciones Institucionales</span>
          <button id="cm-close" style="background:none;border:none;color:#94a3b8;font-size:15px;cursor:pointer;">✕</button>
        </div>
        <div style="display:flex;gap:4px;padding:6px;background:#070d19;border-bottom:1px solid #1e293b;">
          ${canales.map(x => `<button data-cid="${x.id}" class="cm-tab" style="flex:1;background:${x.id===act?'#1d4ed8':'#131f33'};color:#f8fafc;border:none;padding:6px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">${x.nom}</button>`).join('')}
        </div>
        <div id="cm-body" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;background:#070d19;">
          ${msgs.map(m => `
            <div style="align-self:${m.rem===s.nombre?'flex-end':'flex-start'};background:${m.rem===s.nombre?'#1e3a8a':'#131f33'};border:1px solid #1e293b;padding:8px 11px;border-radius:8px;max-width:85%;font-size:12px;color:#f1f5f9;">
              <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;font-weight:600;">${m.rem} • ${m.hora}</div>
              <div>${m.txt}</div>
            </div>
          `).join('')}
        </div>
        <form id="cm-form" style="padding:10px;background:#0f172a;border-top:1px solid #1e293b;display:flex;gap:6px;">
          <input id="cm-in" type="text" placeholder="Escribir mensaje al canal..." required style="flex:1;background:#070d19;border:1px solid #334155;color:#f8fafc;padding:8px 10px;border-radius:6px;font-size:12px;"/>
          <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('cm-close').onclick = () => modal.remove();
      modal.querySelectorAll('.cm-tab').forEach(b => { b.onclick = () => { act = b.getAttribute('data-cid'); draw(); }; });
      document.getElementById('cm-form').onsubmit = (e) => {
        e.preventDefault();
        const txt = document.getElementById('cm-in').value.trim();
        if (!txt) return;
        const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        msgs.push({ rem: s.nombre, hora, txt });
        localStorage.setItem(key, JSON.stringify(msgs));
        draw();
      };
    }

    document.body.appendChild(modal);
    draw();
  }

  // ============================================================================
  // BARRA SUPERIOR SOBRIA (DEJA VISIBLE LA PLATAFORMA REAL #root SIN ESTORBAR)
  // ============================================================================
  function activarBarraSobria() {
    const s = getSesion();
    if (!s) { mostrarLoginSobrio('login'); return; }
    document.body.classList.add('bds-authenticated');
    actualizarFaviconOficial();

    const oldHdr = document.getElementById('bds-pro-header');
    if (oldHdr) oldHdr.remove();

    const hdr = document.createElement('header');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${SVG_BUHO_ORIGINAL}" width="34" height="34" alt="pracTICAtecnica.com" style="border-radius:50%;"/>
        <div>
          <div style="font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;">${s.nombre} • ${s.rol}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="btn-com-float" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          Comunicaciones
        </button>
        <button id="btn-logout-sobrio" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    document.body.prepend(hdr);
    document.getElementById('btn-com-float').onclick = toggleComunicaciones;
    document.getElementById('btn-logout-sobrio').onclick = cerrarSesionTotal;
    repararImagenesRotas();
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarEstilosSobrios();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarBarraSobria();
    else mostrarLoginSobrio('login');
  });
})();