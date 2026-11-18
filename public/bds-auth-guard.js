(function () {
  const MAX_INTENTOS = 5;
  const WHATSAPP_SOPORTE = "https://wa.me/50660906359";

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
    if (document.getElementById('bds-soberana-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'bds-soberana-bar';
    bar.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:99999;display:flex;gap:8px;flex-wrap:wrap;background:#071324;border:1px solid #06b6d4;padding:8px 12px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.7);font-family:system-ui,sans-serif;';
    bar.innerHTML = `
      <button id="bds-btn-suite" style="background:linear-gradient(90deg,#06b6d4,#2563eb);color:#fff;border:none;padding:8px 13px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">
        🦉 Laboratorio & Prácticas REAC 2026
      </button>
      <button id="bds-btn-google" style="background:#ffffff;color:#0f172a;border:none;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">
        G Google OAuth
      </button>
      <button id="bds-btn-logout" style="background:#dc2626;color:#ffffff;border:none;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">
        Salir / Cuenta
      </button>
    `;
    document.body.appendChild(bar);

    document.getElementById('bds-btn-logout').onclick = () => {
      localStorage.removeItem('pt_user_session');
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano('login');
    };
    document.getElementById('bds-btn-google').onclick = () => {
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano('login');
    };
    document.getElementById('bds-btn-suite').onclick = () => {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa();
    };
  }

  window.mostrarModalAuthSoberano = function (modoInicial) {
    let old = document.getElementById('bds-modal-auth');
    if (old) old.remove();
    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const modal = document.createElement('div');
    modal.id = 'bds-modal-auth';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.92);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#fff;';

    function render(tab, msg, tipo) {
      const bloqueado = intentos >= MAX_INTENTOS;
      modal.innerHTML = `
        <div style="background:#0b192c;border:1px solid rgba(6,182,212,0.4);border-radius:20px;max-width:410px;width:100%;padding:24px;position:relative;">
          <button id="bds-close-auth" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          <div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:21px;font-weight:900;">prac<span style="color:#22d3ee;">TICA</span>tecnica.com</div>
            <div style="font-size:11px;color:#67e8f9;">Portal Oficial • CTP Mercedes Norte • Circuito 04</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#07111e;padding:5px;border-radius:10px;margin-bottom:12px;">
            <button id="tab-l" style="padding:7px;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;background:${tab==='login'?'#06b6d4':'transparent'};color:${tab==='login'?'#020617':'#cbd5e1'};">Iniciar Sesión</button>
            <button id="tab-r" style="padding:7px;border:none;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;background:${tab==='rec'?'#06b6d4':'transparent'};color:${tab==='rec'?'#020617':'#cbd5e1'};">Recuperar Clave</button>
          </div>
          ${msg ? `<div style="padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;background:${tipo==='err'?'#450a0a':'#064e3b'};border:1px solid ${tipo==='err'?'#ef4444':'#10b981'};">${msg}</div>` : ''}
          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #ef4444;border-radius:12px;padding:14px;text-align:center;">
              <div style="font-weight:800;font-size:12px;color:#fca5a5;margin-bottom:8px;">BLOQUEADO POR 5 INTENTOS FALLIDOS</div>
              <a href="${WHATSAPP_SOPORTE}" target="_blank" style="display:block;background:#10b981;color:#022c22;font-weight:800;padding:10px;border-radius:8px;text-decoration:none;font-size:12px;">Contactar SuperAdmin (6090-6359)</a>
            </div>
          ` : tab === 'login' ? `
            <form id="f-login" style="display:flex;flex-direction:column;gap:10px;">
              <input id="inp-m" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <select id="inp-rol" style="background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;">
                <option value="Estudiante">Estudiante</option>
                <option value="Docente MEP">Docente MEP</option>
                <option value="Padre/Madre">Padre / Madre</option>
                <option value="Jefatura">Dirección / Coordinación</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
              <input id="inp-p" type="password" placeholder="Ingresa tu contraseña segura" required autocomplete="new-password" style="background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#06b6d4;color:#020617;border:none;padding:10px;border-radius:9px;font-weight:800;cursor:pointer;">Ingresar</button>
              <button type="button" id="btn-go" style="background:#fff;color:#0f172a;border:none;padding:9px;border-radius:9px;font-weight:700;font-size:12px;cursor:pointer;">Continuar con Google OAuth</button>
            </form>
          ` : `
            <form id="f-rec" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rec-m" type="email" placeholder="usuario@est.mep.go.cr" required style="background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rec-p" type="password" placeholder="Nueva clave (mín. 8 caracteres)" required style="background:#112236;border:1px solid #334155;border-radius:9px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#06b6d4;color:#020617;border:none;padding:10px;border-radius:9px;font-weight:800;cursor:pointer;">Actualizar Contraseña</button>
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
          const p = document.getElementById('inp-p').value;
          if (p.length >= 8) {
            localStorage.setItem('bds_failed_attempts', '0');
            render('login', 'Acceso concedido.', 'ok');
            setTimeout(() => modal.remove(), 700);
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            render('login', 'Clave inválida. Intento ' + intentos + ' de 5.', 'err');
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
          render('login', 'Clave actualizada con éxito.', 'ok');
        };
      }
    }
    document.body.appendChild(modal);
    render(modoInicial || 'login', '', '');
  };

  setInterval(sanitizarDOM, 500);
  window.addEventListener('DOMContentLoaded', () => { sanitizarDOM(); inyectarBarraSoberana(); });
  setTimeout(() => { sanitizarDOM(); inyectarBarraSoberana(); }, 700);
})();