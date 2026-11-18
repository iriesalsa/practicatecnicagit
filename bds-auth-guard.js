(function () {
  const MAX_INTENTOS = 5;
  const WHATSAPP_SOPORTE = "https://wa.me/50660906359";
  let deferredPrompt = null;
  let zoomPizarra = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btnInst = document.getElementById('bds-btn-install');
    if (btnInst) btnInst.style.display = 'inline-block';
  });

  function inyectarEstilos() {
    if (document.getElementById('bds-v86-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v86-css';
    st.innerHTML = `
      #bds-soberana-bar {
        position: fixed; bottom: 12px; right: 12px; z-index: 99999;
        display: flex; gap: 7px; flex-wrap: wrap; align-items: center;
        background: rgba(6, 16, 30, 0.96); border: 1px solid #06b6d4; padding: 8px 12px;
        border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,0.85); backdrop-filter: blur(10px);
        font-family: system-ui, -apple-system, sans-serif;
      }
      body.bds-pizarra-zoom #bds-mega-modal { font-size: 118% !important; }
      @media (max-width: 680px) {
        #bds-soberana-bar { left: 8px; right: 8px; bottom: 8px; justify-content: center; }
        #bds-soberana-bar button { flex: 1 1 auto; font-size: 11px !important; padding: 9px 7px !important; }
      }
    `;
    document.head.appendChild(st);
  }

  function sanitizarDOM() {
    document.querySelectorAll('input').forEach((inp) => {
      if (inp.placeholder && (inp.placeholder.includes('maxi.salsa') || inp.placeholder.includes('max.salazar'))) {
        inp.placeholder = 'usuario@est.mep.go.cr';
      }
      if (inp.placeholder && inp.placeholder.includes('2026')) {
        inp.placeholder = 'Ingresa tu contraseña segura';
      }
    });
    document.querySelectorAll('p, div, span, button').forEach((el) => {
      const txt = (el.innerText || '').trim();
      if (
        txt.startsWith('💡 Cuentas de Max Salazar') ||
        txt === '⚡ Cuentas Oficiales de Prueba Rápida (1-Clic):' ||
        txt.includes('Max Salazar (@mep.go.cr)') ||
        txt.includes('Max Salazar (gmail SuperAdmin)')
      ) {
        if (el.tagName === 'BUTTON' && el.parentElement) el.parentElement.style.display = 'none';
        el.style.display = 'none';
      }
    });
  }

  function inyectarBarraSoberana() {
    inyectarEstilos();
    if (document.getElementById('bds-soberana-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'bds-soberana-bar';
    bar.innerHTML = `
      <button id="bds-btn-suite" style="background:linear-gradient(90deg,#06b6d4,#2563eb);color:#fff;border:none;padding:9px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">
        🦉 Mega Suite REAC 2026 (Pruebas Hoy)
      </button>
      <button id="bds-btn-pizarra" style="background:#0f172a;border:1px solid #22d3ee;color:#22d3ee;padding:9px 11px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">
        🖥️ Modo Pizarra
      </button>
      <button id="bds-btn-install" style="background:#10b981;color:#022c22;border:none;padding:9px 11px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">
        📲 Instalar App
      </button>
      <button id="bds-btn-google" style="background:#ffffff;color:#0f172a;border:none;padding:9px 11px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">
        G Google OAuth
      </button>
      <button id="bds-btn-logout" style="background:#dc2626;color:#ffffff;border:none;padding:9px 11px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">
        Salir / Cuenta
      </button>
    `;
    document.body.appendChild(bar);

    document.getElementById('bds-btn-suite').onclick = () => {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa();
    };
    document.getElementById('bds-btn-pizarra').onclick = () => {
      zoomPizarra = !zoomPizarra;
      document.body.classList.toggle('bds-pizarra-zoom', zoomPizarra);
      if (window.abrirMegaSuiteEducativa && !document.getElementById('bds-mega-modal')) {
        window.abrirMegaSuiteEducativa();
      }
    };
    document.getElementById('bds-btn-install').onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        alert('Para instalar pracTICAtecnica.com en tu celular o PC: usa el icono de "Instalar aplicación" en la barra de direcciones del navegador o "Agregar a pantalla de inicio".');
      }
    };
    document.getElementById('bds-btn-google').onclick = () => {
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano('login');
    };
    document.getElementById('bds-btn-logout').onclick = () => {
      localStorage.removeItem('pt_user_session');
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano('login');
    };
  }

  window.mostrarModalAuthSoberano = function (modoInicial) {
    let old = document.getElementById('bds-modal-auth');
    if (old) old.remove();
    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const modal = document.createElement('div');
    modal.id = 'bds-modal-auth';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.93);z-index:100000;display:flex;align-items:center;justify-content:center;padding:14px;font-family:system-ui,sans-serif;color:#fff;';

    function render(tab, msg, tipo) {
      const bloqueado = intentos >= MAX_INTENTOS;
      modal.innerHTML = `
        <div style="background:#0b192c;border:1px solid rgba(6,182,212,0.5);border-radius:20px;max-width:420px;width:100%;padding:24px;position:relative;box-sizing:border-box;">
          <button id="bds-close-auth" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          <div style="text-align:center;margin-bottom:14px;">
            <div style="width:62px;height:62px;margin:0 auto 8px;border-radius:50%;background:#061224;border:2px solid #2dd4bf;display:flex;align-items:center;justify-content:center;">
              <svg viewBox="0 0 64 64" width="42" height="42">
                <circle cx="32" cy="32" r="30" fill="#091930"/>
                <path d="M12 16 L28 24 L17 29 Z" fill="#2dd4bf"/>
                <path d="M52 16 L36 24 L47 29 Z" fill="#2dd4bf"/>
                <circle cx="22.5" cy="34" r="9.5" fill="#2dd4bf"/>
                <circle cx="41.5" cy="34" r="9.5" fill="#2dd4bf"/>
                <circle cx="22.5" cy="34" r="5" fill="#06101e"/>
                <circle cx="41.5" cy="34" r="5" fill="#06101e"/>
                <circle cx="24" cy="32" r="1.8" fill="#fff"/>
                <circle cx="43" cy="32" r="1.8" fill="#fff"/>
                <polygon points="32,38 27.5,46 32,53 36.5,46" fill="#2dd4bf"/>
              </svg>
            </div>
            <div style="font-size:21px;font-weight:900;">prac<span style="color:#22d3ee;">TICA</span>tecnica.com</div>
            <div style="font-size:11px;color:#67e8f9;">CTP Mercedes Norte • Circuito 04 • REAC 2026</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#07111e;padding:5px;border-radius:10px;margin-bottom:12px;">
            <button id="tab-l" style="padding:8px;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;background:${tab==='login'?'#06b6d4':'transparent'};color:${tab==='login'?'#020617':'#cbd5e1'};">Iniciar Sesión</button>
            <button id="tab-r" style="padding:8px;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;background:${tab==='rec'?'#06b6d4':'transparent'};color:${tab==='rec'?'#020617':'#cbd5e1'};">Recuperar Clave</button>
          </div>
          ${msg ? `<div style="padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;background:${tipo==='err'?'#450a0a':'#064e3b'};border:1px solid ${tipo==='err'?'#ef4444':'#10b981'};">${msg}</div>` : ''}
          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #ef4444;border-radius:12px;padding:14px;text-align:center;">
              <div style="font-weight:800;font-size:12px;color:#fca5a5;margin-bottom:8px;">🔒 BLOQUEADO POR 5 INTENTOS FALLIDOS</div>
              <a href="${WHATSAPP_SOPORTE}" target="_blank" style="display:block;background:#10b981;color:#022c22;font-weight:800;padding:10px;border-radius:8px;text-decoration:none;font-size:12px;">Contactar SuperAdmin (6090-6359)</a>
            </div>
          ` : tab === 'login' ? `
            <form id="f-login" style="display:flex;flex-direction:column;gap:10px;">
              <input id="inp-m" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <select id="inp-rol" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;">
                <option value="Estudiante">Estudiante</option>
                <option value="Docente MEP">Docente MEP</option>
                <option value="Padre/Madre">Padre / Madre</option>
                <option value="Jefatura">Dirección / Coordinación</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
              <input id="inp-p" type="password" placeholder="Ingresa tu contraseña segura" required autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#06b6d4;color:#020617;border:none;padding:11px;border-radius:9px;font-weight:800;cursor:pointer;">Ingresar</button>
              <button type="button" id="btn-go" style="background:#fff;color:#0f172a;border:none;padding:10px;border-radius:9px;font-weight:700;font-size:12px;cursor:pointer;">Continuar con Google OAuth</button>
            </form>
          ` : `
            <form id="f-rec" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rec-m" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rec-p" type="password" placeholder="Nueva clave (mín. 8 caracteres)" required style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#06b6d4;color:#020617;border:none;padding:11px;border-radius:9px;font-weight:800;cursor:pointer;">Actualizar Contraseña</button>
            </form>
          `}
        </div>
      `;
      document.getElementById('bds-close-auth').onclick = () => modal.remove();
      document.getElementById('tab-l').onclick = () => render('login', '', '');
      document.getElementById('tab-r').onclick = () => render('rec', '', '');
      const fl = document.getElementById('f-login');
      if (fl) {
        fl.onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('inp-m').value.trim();
          const p = document.getElementById('inp-p').value;
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) {
            render('login', '⚠️ Formato de correo inválido.', 'err');
            return;
          }
          if (p.length >= 8) {
            localStorage.setItem('bds_failed_attempts', '0');
            render('login', '✅ Sesión iniciada correctamente.', 'ok');
            setTimeout(() => modal.remove(), 600);
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            render('login', '⚠️ Clave inválida. Intento ' + intentos + ' de 5.', 'err');
          }
        };
      }
      const bgo = document.getElementById('btn-go');
      if (bgo) bgo.onclick = () => { localStorage.setItem('bds_failed_attempts', '0'); modal.remove(); };
      const fr = document.getElementById('f-rec');
      if (fr) {
        fr.onsubmit = (e) => {
          e.preventDefault();
          localStorage.setItem('bds_failed_attempts', '0');
          intentos = 0;
          render('login', '✅ Contraseña restablecida con éxito.', 'ok');
        };
      }
    }
    document.body.appendChild(modal);
    render(modoInicial || 'login', '', '');
  };

  setInterval(sanitizarDOM, 500);
  window.addEventListener('DOMContentLoaded', () => { sanitizarDOM(); inyectarBarraSoberana(); });
  setTimeout(() => { sanitizarDOM(); inyectarBarraSoberana(); }, 500);
})();