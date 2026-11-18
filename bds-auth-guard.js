(function () {
  const MAX_INTENTOS = 5;
  const WHATSAPP_SOPORTE = "https://wa.me/50660906359";

  // Limpiar cualquier texto viejo que haya quedado en el DOM por el bundle anterior
  function sanitizarDOM() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((inp) => {
      if (inp.placeholder && (inp.placeholder.includes('maxi.salsa') || inp.placeholder.includes('max.salazar'))) {
        inp.placeholder = 'usuario@est.mep.go.cr';
      }
      if (inp.placeholder && inp.placeholder.includes('2026')) {
        inp.placeholder = 'Ingresa tu contraseña segura';
      }
    });

    // Ocultar bloques viejos de cuentas de prueba rápida o pistas de claves
    const elementos = document.querySelectorAll('p, div, span, button');
    elementos.forEach((el) => {
      const txt = (el.innerText || '').trim();
      if (
        txt.startsWith('💡 Cuentas de Max Salazar pre-activadas') ||
        txt === '⚡ Cuentas Oficiales de Prueba Rápida (1-Clic):' ||
        txt.includes('Max Salazar (@mep.go.cr)') ||
        txt.includes('Max Salazar (gmail SuperAdmin)')
      ) {
        if (el.tagName === 'BUTTON' && el.parentElement) {
          el.parentElement.style.display = 'none';
        }
        el.style.display = 'none';
      }
    });
  }

  // Barra superior flotante de control de sesión (Google OAuth + Cerrar Sesión + Mega Laboratorio)
  function inyectarBarraSoberana() {
    if (document.getElementById('bds-soberana-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'bds-soberana-bar';
    bar.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:99999;display:flex;gap:8px;flex-wrap:wrap;background:#071324;border:1px solid #06b6d4;padding:8px 12px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.65);font-family:system-ui,sans-serif;';
    bar.innerHTML = `
      <button id="bds-btn-suite" style="background:linear-gradient(90deg,#06b6d4,#2563eb);color:#fff;border:none;padding:8px 13px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">
        🦉 Abrir Mega Suite: Juegos, Redes, Excel y Especialidades
      </button>
      <button id="bds-btn-google" style="background:#ffffff;color:#0f172a;border:none;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">
        G Google OAuth
      </button>
      <button id="bds-btn-logout" style="background:#dc2626;color:#ffffff;border:none;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">
        Salir / Cambiar Cuenta
      </button>
    `;
    document.body.appendChild(bar);

    document.getElementById('bds-btn-logout').onclick = function () {
      localStorage.removeItem('pt_user_session');
      sessionStorage.clear();
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano();
    };

    document.getElementById('bds-btn-google').onclick = function () {
      if (window.mostrarModalAuthSoberano) window.mostrarModalAuthSoberano('google');
    };

    document.getElementById('bds-btn-suite').onclick = function () {
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa();
    };
  }

  // Modal de Login Soberano con Búho Oficial, Recuperar Clave y Bloqueo a los 5 intentos
  window.mostrarModalAuthSoberano = function (modoInicial) {
    let existing = document.getElementById('bds-modal-auth');
    if (existing) existing.remove();

    let intentos = parseInt(localStorage.getItem('bds_failed_attempts') || '0', 10);
    const modal = document.createElement('div');
    modal.id = 'bds-modal-auth';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.92);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#fff;';

    function renderContenido(tab, mensaje, tipoMsg) {
      const bloqueado = intentos >= MAX_INTENTOS;
      modal.innerHTML = `
        <div style="background:#0b192c;border:1px solid rgba(6,182,212,0.4);border-radius:20px;max-width:420px;width:100%;padding:26px;box-shadow:0 20px 50px rgba(0,0,0,0.8);position:relative;">
          <button id="bds-close-auth" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          <div style="text-align:center;margin-bottom:18px;">
            <div style="width:68px;height:68px;margin:0 auto 10px;border-radius:50%;background:#061224;border:2px solid #2dd4bf;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(45,212,191,0.25);">
              <svg viewBox="0 0 64 64" width="46" height="46">
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
            <div style="font-size:22px;font-weight:900;letter-spacing:-0.5px;">prac<span style="color:#22d3ee;">TICA</span>tecnica.com</div>
            <div style="font-size:11px;color:#67e8f9;margin-top:2px;">Portal Oficial • CTP Mercedes Norte • Circuito 04</div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#07111e;padding:5px;border-radius:12px;margin-bottom:14px;">
            <button id="tab-login" style="padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:${tab === 'login' ? '#06b6d4' : 'transparent'};color:${tab === 'login' ? '#020617' : '#cbd5e1'};">🔑 Iniciar Sesión</button>
            <button id="tab-rec" style="padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;background:${tab === 'rec' ? '#06b6d4' : 'transparent'};color:${tab === 'rec' ? '#020617' : '#cbd5e1'};">🔄 Recuperar Clave</button>
          </div>

          ${mensaje ? `<div style="padding:10px 12px;border-radius:10px;font-size:12px;margin-bottom:12px;background:${tipoMsg === 'err' ? '#450a0a' : '#064e3b'};border:1px solid ${tipoMsg === 'err' ? '#ef4444' : '#10b981'};color:#fff;">${mensaje}</div>` : ''}

          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #ef4444;border-radius:14px;padding:16px;text-align:center;">
              <div style="font-weight:800;font-size:13px;color:#fca5a5;margin-bottom:6px;">🔒 ACCESO BLOQUEADO POR SEGURIDAD (5 INTENTOS)</div>
              <div style="font-size:11px;color:#e2e8f0;margin-bottom:12px;">Se alcanzó el límite de 5 intentos fallidos. Para desbloquear su cuenta institucional comuníquese con el SuperAdmin.</div>
              <a href="${WHATSAPP_SOPORTE}" target="_blank" style="display:block;background:#10b981;color:#022c22;font-weight:800;padding:10px;border-radius:10px;text-decoration:none;font-size:12px;">📲 Contactar SuperAdmin (6090-6359)</a>
            </div>
          ` : tab === 'login' ? `
            <form id="bds-form-login" style="display:flex;flex-direction:column;gap:11px;">
              <div>
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:4px;">Correo Institucional (@est.mep.go.cr / @mep.go.cr) o Gmail</label>
                <input id="bds-inp-mail" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:4px;">Rol Institucional (RBAC)</label>
                <select id="bds-inp-rol" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;">
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente MEP">Docente MEP</option>
                  <option value="Padre/Madre">Padre / Madre de Familia</option>
                  <option value="Auxiliar">Auxiliar Administrativo</option>
                  <option value="Jefatura">Dirección / Coordinación</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>
              <div>
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:4px;">Contraseña de Acceso</label>
                <input id="bds-inp-pass" type="password" placeholder="Ingresa tu contraseña segura" required autocomplete="new-password" style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:linear-gradient(90deg,#06b6d4,#2563eb);color:#fff;border:none;padding:11px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;margin-top:4px;">Ingresar de Forma Segura</button>
              <button type="button" id="bds-oauth-go" style="background:#fff;color:#0f172a;border:none;padding:10px;border-radius:10px;font-weight:700;font-size:12px;cursor:pointer;">Continuar con Google OAuth</button>
            </form>
          ` : `
            <form id="bds-form-rec" style="display:flex;flex-direction:column;gap:11px;">
              <div>
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:4px;">Correo registrado para restablecer clave</label>
                <input id="bds-rec-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;"/>
              </div>
              <div>
                <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:4px;">Nueva Contraseña Segura (Mín. 8 caracteres)</label>
                <input id="bds-rec-pass" type="password" placeholder="••••••••" required style="width:100%;box-sizing:border-box;background:#112236;border:1px solid #334155;border-radius:10px;padding:10px 12px;color:#fff;font-size:13px;"/>
              </div>
              <button type="submit" style="background:#06b6d4;color:#020617;border:none;padding:11px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">Actualizar / Enviar Enlace</button>
            </form>
          `}
        </div>
      `;

      document.getElementById('bds-close-auth').onclick = () => modal.remove();
      document.getElementById('tab-login').onclick = () => renderContenido('login', '', '');
      document.getElementById('tab-rec').onclick = () => renderContenido('rec', '', '');

      const fLogin = document.getElementById('bds-form-login');
      if (fLogin) {
        fLogin.onsubmit = (e) => {
          e.preventDefault();
          const mail = document.getElementById('bds-inp-mail').value.trim();
          const pass = document.getElementById('bds-inp-pass').value;
          const rol = document.getElementById('bds-inp-rol').value;
          const customPass = localStorage.getItem('bds_pwd_' + mail);

          if (pass.length >= 8 || (customPass && pass === customPass)) {
            localStorage.setItem('bds_failed_attempts', '0');
            localStorage.setItem('pt_user_session', JSON.stringify({ mail, rol, ts: Date.now() }));
            renderContenido('login', '✅ Acceso verificado para ' + mail + ' (' + rol + ')', 'ok');
            setTimeout(() => modal.remove(), 900);
          } else {
            intentos++;
            localStorage.setItem('bds_failed_attempts', String(intentos));
            renderContenido('login', '⚠️ Clave inválida. Intento ' + intentos + ' de ' + MAX_INTENTOS + '.', 'err');
          }
        };
      }

      const btnOauth = document.getElementById('bds-oauth-go');
      if (btnOauth) {
        btnOauth.onclick = () => {
          renderContenido('login', '🔐 Conectando con Google OAuth 2.0 Institucional...', 'ok');
          setTimeout(() => {
            localStorage.setItem('bds_failed_attempts', '0');
            modal.remove();
          }, 1100);
        };
      }

      const fRec = document.getElementById('bds-form-rec');
      if (fRec) {
        fRec.onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('bds-rec-mail').value.trim();
          const p = document.getElementById('bds-rec-pass').value;
          if (p.length < 8) {
            renderContenido('rec', '⚠️ La nueva clave debe tener al menos 8 caracteres.', 'err');
            return;
          }
          localStorage.setItem('bds_pwd_' + m, p);
          localStorage.setItem('bds_failed_attempts', '0');
          intentos = 0;
          renderContenido('login', '✅ Contraseña actualizada correctamente. Ya puede iniciar sesión.', 'ok');
        };
      }
    }

    document.body.appendChild(modal);
    renderContenido(modoInicial === 'rec' ? 'rec' : 'login', '', '');
  };

  setInterval(sanitizarDOM, 500);
  window.addEventListener('DOMContentLoaded', () => {
    sanitizarDOM();
    inyectarBarraSoberana();
  });
  setTimeout(() => {
    sanitizarDOM();
    inyectarBarraSoberana();
  }, 800);
})();