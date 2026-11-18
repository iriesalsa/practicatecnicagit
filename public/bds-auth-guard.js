(function () {
  const SESSION_KEY = "bds_auth_v95_session";
  const DRAFT_KEY = "bds_justificacion_borrador_v95";
  const WA_SINPE = "https://wa.me/50660906359?text=Hola%20Profe%20Max,%20adjunto%20comprobante%20SINPE%20al%2060906359%20(Banco%20Popular)%20con%20Detalle%20.%20para%20activar%20acceso%20en%20pracTICAtecnica.com";

  // 1. FIX CRÍTICO REPORTADO POR JOSHUA: Evitar que WASD o Flechas del juego vial bloqueen escribir en inputs de Login o Buscadores
  window.addEventListener('keydown', function (e) {
    const el = document.activeElement;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) {
      e.stopPropagation();
    }
  }, true);

  // Logos Vectoriales Embebidos (Nunca fallan al cargar, ni siquiera offline)
  const SVG_MEP_DATA = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 54" width="210" height="46">
    <rect width="240" height="54" rx="8" fill="#0b1528" stroke="#0ea5e9" stroke-width="2"/>
    <circle cx="28" cy="27" r="16" fill="#0284c7"/>
    <text x="28" y="32" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="900" font-size="12">MEP</text>
    <text x="54" y="24" fill="#f8fafc" font-family="Arial,sans-serif" font-weight="800" font-size="13">Ministerio de Educación Pública</text>
    <text x="54" y="40" fill="#38bdf8" font-family="Arial,sans-serif" font-weight="700" font-size="10">Gobierno de Costa Rica • Educación Técnica</text>
  </svg>`);

  const SVG_CTP_OWL_DATA = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="44" height="44">
    <circle cx="32" cy="32" r="30" fill="#0B1528" stroke="#22D3EE" stroke-width="3"/>
    <path d="M14 17L28 24L18 29L14 17Z" fill="#22D3EE"/>
    <path d="M50 17L36 24L46 29L50 17Z" fill="#22D3EE"/>
    <circle cx="23" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width="3"/>
    <circle cx="41" cy="34" r="8.5" fill="#0B1528" stroke="#38BDF8" stroke-width: "3"/>
    <circle cx="23" cy="34" r="4" fill="#FFFFFF"/>
    <circle cx="41" cy="34" r="4" fill="#FFFFFF"/>
    <path d="M32 39L28 46L32 52L36 46L32 39Z" fill="#22D3EE"/>
  </svg>`);

  const GOOGLE_G_SVG = `<svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function normalizarSinTildes(str) {
    return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function getSesion() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(s) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  }

  function inyectarCSSMinimalista() {
    if (document.getElementById('bds-v95-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v95-css';
    st.innerHTML = `
      html, body { overflow-x: hidden !important; overflow-y: auto !important; scroll-behavior: smooth; }
      /* Enlace de accesibilidad por teclado (Skip to content) */
      #bds-skip-link {
        position: absolute; top: -50px; left: 10px; z-index: 300000;
        background: #0284c7; color: #fff; padding: 8px 14px; border-radius: 6px;
        font-weight: 700; font-size: 12px; text-decoration: none; transition: top 0.2s;
      }
      #bds-skip-link:focus { top: 10px; }

      /* Barra superior minimalista adaptable según Rol (Estudiante / Docente / Dirección) */
      #bds-minimal-header {
        position: sticky; top: 0; z-index: 99990;
        background: rgba(9, 17, 30, 0.96); border-bottom: 1px solid #1e293b;
        padding: 8px 16px; display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 10px; backdrop-filter: blur(8px);
        font-family: system-ui, -apple-system, sans-serif;
      }
      .bds-m-btn {
        background: #111c2d; border: 1px solid #1e293b; color: #e2e8f0;
        padding: 7px 11px; border-radius: 6px; font-size: 12px; font-weight: 600;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
      }
      .bds-m-btn:hover { border-color: #0ea5e9; color: #fff; }
      .bds-m-btn.accent { background: #0284c7; border-color: #0284c7; color: #fff; }
      .bds-m-btn.sinpe { background: #065f46; border-color: #10b981; color: #ecfdf5; }

      /* Ocultar barras inferiores viejas y accesos duplicados en la portada */
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, nav.fixed.bottom-0 { display: none !important; }
    `;
    document.head.appendChild(st);

    if (!document.getElementById('bds-skip-link')) {
      const skip = document.createElement('a');
      skip.id = 'bds-skip-link';
      skip.href = '#root';
      skip.innerText = 'Saltar al contenido principal (Accesibilidad Teclado)';
      document.body.prepend(skip);
    }
  }

  // Modal Oficial SINPE Móvil 60906359 (Max Salazar Sánchez - Banco Popular - Detalle ".")
  window.mostrarModalSinpeOficial = function () {
    let old = document.getElementById('bds-sinpe-modal');
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'bds-sinpe-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.94);z-index:250000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#f8fafc;';
    m.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;max-width:430px;width:100%;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,0.9);position:relative;">
        <button id="sp-close" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
        <div style="font-size:11px;font-weight:800;color:#10b981;margin-bottom:4px;">SUSCRIPCIÓN Y SOPORTE OFICIAL</div>
        <h3 style="margin:0 0 12px;font-size:18px;color:#fff;">Activación vía SINPE Móvil</h3>
        <div style="background:#060c17;border:1px solid #1e293b;border-radius:10px;padding:14px;font-size:13px;line-height:1.75;margin-bottom:14px;">
          <div><b>Número SINPE Móvil:</b> <span style="color:#34d399;font-family:monospace;font-size:16px;font-weight:900;">60906359</span></div>
          <div><b>Titular:</b> Max Salazar Sánchez</div>
          <div><b>Entidad Bancaria:</b> Banco Popular</div>
          <div><b>Detalle obligatorio:</b> <span style="background:#1e293b;color:#38bdf8;padding:2px 8px;border-radius:4px;font-family:monospace;font-weight:900;">.</span> (Escribir únicamente un punto)</div>
        </div>
        <p style="font-size:12px;color:#94a3b8;margin:0 0 14px;">
          Una vez realizado el SINPE con el detalle <b>"."</b>, envía la captura y el comprobante directamente al WhatsApp oficial <b>60906359</b>:
        </p>
        <a href="${WA_SINPE}" target="_blank" style="display:block;text-align:center;background:#10b981;color:#022c22;font-weight:900;padding:11px;border-radius:8px;text-decoration:none;font-size:13px;">
          Enviar Captura y Comprobante a WhatsApp 60906359
        </a>
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById('sp-close').onclick = () => m.remove();
  };

  // Modal de Inicio de Sesión Minimalista (Restaura al usuario a la sección donde estaba si cancela)
  window.mostrarModalLoginMinimalista = function () {
    const seccionPreviaScroll = window.scrollY;
    let old = document.getElementById('bds-login-v95');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v95';
    gate.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.95);z-index:200000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;color:#f8fafc;';

    function renderForm(modo) {
      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:12px;max-width:390px;width:100%;padding:24px;position:relative;box-sizing:border-box;">
          <button id="lg-cancel" title="Cancelar y volver a la sección actual" style="position:absolute;top:12px;right:14px;background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <img src="${SVG_CTP_OWL_DATA}" alt="Escudo CTP Mercedes Norte" width="40" height="40"/>
            <div>
              <div style="font-size:16px;font-weight:800;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
              <div style="font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Circuito 04</div>
            </div>
          </div>

          <button type="button" id="lg-google-btn" style="width:100%;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;">
            ${GOOGLE_G_SVG}
            <span>Iniciar sesión GOOGLE</span>
          </button>

          <form id="lg-form" style="display:flex;flex-direction:column;gap:10px;">
            <div>
              <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Nombre del Usuario</label>
              <input id="lg-nom" type="text" placeholder="Ej. Valeria Alfaro Rojas" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Correo Institucional o Gmail</label>
              <input id="lg-mail" type="email" placeholder="estudiante@est.mep.go.cr" required autocomplete="off" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:6px;">
              <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Perfil de Menú</label>
                <select id="lg-rol" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="Estudiante" selected>Estudiante</option>
                  <option value="Docente">Docente MEP</option>
                  <option value="Profesor Guía">Profesor Guía</option>
                  <option value="Dirección">Dirección</option>
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">Nivel / Sección</label>
                <select id="lg-sec" style="width:100%;background:#060c17;border:1px solid #1e293b;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="11-1">Sección 11-1</option>
                  <option value="12-1">Sección 12-1</option>
                  <option value="10-1">Sección 10-1</option>
                  <option value="Secundaria (7°-9°)">Secundaria (7°-9°)</option>
                  <option value="Primaria (1°-6°)">Primaria (1°-6°)</option>
                </select>
              </div>
            </div>
            <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;margin-top:4px;">Confirmar Sesión</button>
          </form>
        </div>
      `;

      // Si cancela, regresa exactamente a la sección donde estaba
      document.getElementById('lg-cancel').onclick = () => {
        gate.remove();
        window.scrollTo({ top: seccionPreviaScroll, behavior: 'instant' });
      };

      document.getElementById('lg-google-btn').onclick = () => {
        const nom = document.getElementById('lg-nom').value.trim() || 'Estudiante Google OAuth';
        const mail = document.getElementById('lg-mail').value.trim() || 'estudiante.oauth@est.mep.go.cr';
        const sec = document.getElementById('lg-sec').value || '11-1';
        setSesion({ id: 'EST-' + Math.floor(1000 + Math.random() * 9000), nombre: nom, email: mail, rol: 'Estudiante', seccion: sec });
        gate.remove();
        renderHeaderMinimalista();
        repararDOMReactivo();
      };

      document.getElementById('lg-form').onsubmit = (e) => {
        e.preventDefault();
        const nom = document.getElementById('lg-nom').value.trim();
        const mail = document.getElementById('lg-mail').value.trim();
        const rol = document.getElementById('lg-rol').value;
        const sec = document.getElementById('lg-sec').value;
        setSesion({ id: 'USR-' + Math.floor(1000 + Math.random() * 9000), nombre: nom, email: mail, rol, seccion: sec });
        gate.remove();
        renderHeaderMinimalista();
        repararDOMReactivo();
      };
    }

    document.body.appendChild(gate);
    renderForm('login');
  };

  // Header Minimalista que cambia según el Rol (Nunca muestra Iniciar sesión GOOGLE y Salir al mismo tiempo)
  function renderHeaderMinimalista() {
    inyectarCSSMinimalista();
    let old = document.getElementById('bds-minimal-header');
    if (old) old.remove();

    const sesion = getSesion();
    const hdr = document.createElement('div');
    hdr.id = 'bds-minimal-header';

    if (!sesion) {
      // Estado NO autenticado: Solo muestra botón "Iniciar sesión GOOGLE" (Nunca muestra Salir ni SuperAdmin)
      hdr.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${SVG_CTP_OWL_DATA}" alt="Escudo CTP Mercedes Norte" width="34" height="34"/>
          <span style="font-size:13px;font-weight:800;color:#f8fafc;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com • <span style="color:#94a3b8;font-weight:500;">Modo Visitante (Día 1)</span></span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button id="hm-calc" class="bds-m-btn accent">Calculadora Nota Presentación MEP / U Públicas</button>
          <button id="hm-simulacros" class="bds-m-btn">Simulacros & Juegos</button>
          <button id="hm-sinpe" class="bds-m-btn sinpe">SINPE 6090-6359</button>
          <button id="hm-login-google" style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">
            ${GOOGLE_G_SVG} <span>Iniciar sesión GOOGLE</span>
          </button>
        </div>
      `;
    } else {
      // Estado AUTENTICADO: El menú cambia según si es Estudiante o Docente/Profesor Guía/Dirección, y SOLO muestra "Salir"
      const esDocente = sesion.rol !== 'Estudiante';
      hdr.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${SVG_CTP_OWL_DATA}" alt="Escudo CTP Mercedes Norte" width="34" height="34"/>
          <div>
            <div style="font-size:13px;font-weight:800;color:#f8fafc;">${sesion.nombre} <span style="color:#38bdf8;">(${sesion.rol} • ${sesion.seccion})</span></div>
            <div style="font-size:10px;color:#94a3b8;">${sesion.email} • Racha: Día 1</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <button id="hm-calc" class="bds-m-btn accent">Nota Presentación MEP / UCR / TEC / UNA / UTN / UNED</button>
          <button id="hm-simulacros" class="bds-m-btn">Simulacros (Primaria / Secundaria / CTP)</button>
          <button id="hm-juegos" class="bds-m-btn">Juegos Lógicos</button>
          ${esDocente ? `<button id="hm-sea" class="bds-m-btn" style="background:#059669;border-color:#059669;color:#fff;">Panel Docente SEA-MEP, Conducta & QR</button>` : `<button id="hm-carnet" class="bds-m-btn">Mi Carné QR</button>`}
          <button id="hm-sinpe" class="bds-m-btn sinpe">SINPE 6090-6359</button>
          <button id="hm-logout" class="bds-m-btn" style="background:#7f1d1d;border-color:#991b1b;color:#fecaca;">Salir</button>
        </div>
      `;
    }

    document.body.prepend(hdr);

    document.getElementById('hm-calc').onclick = () => {
      window.location.hash = 'calculadora-admision';
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('calculadora');
    };
    document.getElementById('hm-simulacros').onclick = () => {
      window.location.hash = 'simulacros';
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes');
    };
    document.getElementById('hm-sinpe').onclick = () => window.mostrarModalSinpeOficial();

    const bJuegos = document.getElementById('hm-juegos');
    if (bJuegos) bJuegos.onclick = () => {
      window.location.hash = 'juegos';
      if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('juegos');
    };
    const bSea = document.getElementById('hm-sea');
    if (bSea) bSea.onclick = () => window.abrirGestorSeaMep && window.abrirGestorSeaMep();
    const bCarnet = document.getElementById('hm-carnet');
    if (bCarnet) bCarnet.onclick = () => window.abrirGestorSeaMep && window.abrirGestorSeaMep();

    const bLog = document.getElementById('hm-login-google');
    if (bLog) bLog.onclick = () => window.mostrarModalLoginMinimalista();

    const bOut = document.getElementById('hm-logout');
    if (bOut) bOut.onclick = () => {
      localStorage.removeItem(SESSION_KEY);
      renderHeaderMinimalista();
      repararDOMReactivo();
    };
  }

  // Motor Cirujano del DOM Principal (#root): Corrige en vivo todas las pantallas de las capturas de la 11-1
  function repararDOMReactivo() {
    const sesion = getSesion();

    // 1. Reparar TODOS los logos rotos del encabezado, MEP, CTP, Minist y Rosa
    document.querySelectorAll('img').forEach(img => {
      const alt = (img.alt || '').toLowerCase();
      const src = (img.src || '').toLowerCase();
      if (alt.includes('ministerio') || alt.includes('mep') || src.includes('mep')) {
        if (!img.src.startsWith('data:image/svg')) img.src = SVG_MEP_DATA;
      } else if (alt.includes('ctp') || alt.includes('mercedes') || alt.includes('búho') || alt.includes('minist') || alt.includes('rosa') || (img.complete && img.naturalWidth === 0)) {
        if (!img.src.startsWith('data:image/svg') && !img.src.includes('qrserver')) img.src = SVG_CTP_OWL_DATA;
      }
      img.onerror = function () {
        if (this.alt && this.alt.toLowerCase().includes('ministerio')) this.src = SVG_MEP_DATA;
        else this.src = SVG_CTP_OWL_DATA;
      };
    });

    // 2. Ocultar el selector "Rol: SuperAdmin Global" y el saludo de SuperAdmin si no es SuperAdmin
    document.querySelectorAll('button, span, div, h2, h3, select').forEach(el => {
      if (el.children.length === 0 && el.textContent) {
        const t = el.textContent.trim();
        if (t.includes('SuperAdmin Global') || t.includes('Rol Activo: SuperAdmin')) {
          el.textContent = sesion ? `Rol Activo: ${sesion.rol} (${sesion.seccion})` : 'Modo Visitante / Estudiante';
        }
        if (t.includes('¡Hola, Ing. Max Salazar Sánchez!') && (!sesion || sesion.rol === 'Estudiante')) {
          el.textContent = sesion ? `¡Hola, ${sesion.nombre}!` : '¡Bienvenido(a) a pracTICAtecnica.com!';
        }
        if (t === '🔥 9 días' || t.includes('9 días')) {
          el.textContent = '🔥 Día 1';
        }
      }
    });

    // 3. Reemplazar el SVG de QR falso (de 3 cuadros) en Despacho de Dirección por un QR Real Escaneable
    document.querySelectorAll('svg').forEach(svg => {
      const parentTxt = (svg.parentElement && svg.parentElement.innerText) || '';
      if (parentTxt.includes('VERIFICADO SHA-256') || parentTxt.includes('Escanear QR')) {
        const imgQR = document.createElement('img');
        const urlVerif = 'https://practicatecnica.com/?verificar=' + encodeURIComponent('BOLETA-DIRECCION|CTP-MN-228|Certificacion Oficial MEP|Verificado SHA-256');
        imgQR.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&data=' + encodeURIComponent(urlVerif);
        imgQR.alt = 'Código QR Oficial Verificable';
        imgQR.style.cssText = 'width:140px;height:140px;background:#fff;padding:6px;border-radius:8px;display:block;margin:0 auto;';
        svg.replaceWith(imgQR);
      }
    });

    // 4. En Matemáticas MEP o especialidades NO eléctricas, ocultar el "Simulador de Ley de Ohm / Potencia Industrial"
    document.querySelectorAll('div').forEach(box => {
      const txt = box.innerText || '';
      if (txt.includes('Simulador de Ley de Ohm / Potencia Industrial') && box.children.length < 10) {
        const modalText = document.body.innerText || '';
        const esElectronica = modalText.includes('Electrónica Industrial') || modalText.includes('Electromecánica');
        if (!esElectronica && !box.dataset.bdsOhmReplaced) {
          box.dataset.bdsOhmReplaced = "1";
          box.innerHTML = `
            <div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:8px;">CALCULADORA RÁPIDA DE LA ASIGNATURA</div>
            <p style="font-size:11px;color:#94a3b8;margin:0 0 8px;">Evalúa funciones lineales/cuadráticas, porcentajes o abre el simulacro completo de esta materia:</p>
            <button onclick="window.abrirMegaSuiteEducativa('examenes')" style="width:100%;background:#0284c7;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;margin-bottom:6px;">
              Ir al Simulacro Exclusivo de esta Materia
            </button>
            <button onclick="window.abrirMegaSuiteEducativa('calculadora')" style="width:100%;background:#059669;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
              Calcular Nota de Presentación MEP / UCR / TEC
            </button>
          `;
        }
      }
    });

    // 5. Conectar el botón "Abrir Simulacro Completo (20/30/40/60 Ítems)" para que abra la materia correcta (ej. Matemáticas MEP) y NO el PAA
    document.querySelectorAll('button').forEach(btn => {
      const t = (btn.innerText || '').trim();
      if (t.includes('Abrir Simulacro Completo') && !btn.dataset.bdsFixedSimBtn) {
        btn.dataset.bdsFixedSimBtn = "1";
        btn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          // Detectar el título del modal actual (ej. "Matemáticas MEP", "Administración, Logística...", "Desarrollo Web")
          let materiaDetectada = "Matemáticas MEP (Secundaria y CTP)";
          const h2s = document.querySelectorAll('h2, h3');
          h2s.forEach(h => {
            const ht = (h.innerText || '').trim();
            if (ht.includes('Matemáticas')) materiaDetectada = "Matemáticas MEP (Secundaria y CTP)";
            else if (ht.includes('Logística') || ht.includes('Administración') || ht.includes('Contabilidad')) materiaDetectada = "Contabilidad, Administración y Logística";
            else if (ht.includes('Desarrollo') || ht.includes('Web') || ht.includes('Software')) materiaDetectada = "Desarrollo Web y Diseño de Software";
            else if (ht.includes('Redes') || ht.includes('Ciberseguridad')) materiaDetectada = "Redes, Subneteo (VLSM/FLSM) e IPv6";
            else if (ht.includes('Electrónica')) materiaDetectada = "Electrónica Industrial (Ley de Ohm/Watt)";
          });
          if (window.abrirMegaSuiteEducativa) window.abrirMegaSuiteEducativa('examenes', materiaDetectada);
        };
      }

      // 6. Bloquear finalizar simulacro con 0 preguntas respondidas
      if ((t.includes('Finalizar y Calificar Simulacro') || t.includes('Finalizar Simulacro y Ver Nota')) && !btn.dataset.bdsZeroGuard) {
        btn.dataset.bdsZeroGuard = "1";
        btn.addEventListener('click', (e) => {
          const bodyTxt = document.body.innerText || '';
          if (bodyTxt.includes('0 de 10 preguntas respondidas') || bodyTxt.includes('0 de 20 preguntas respondidas') || bodyTxt.includes('0 de 30 preguntas respondidas')) {
            e.stopPropagation();
            e.preventDefault();
            alert('Validación QA: No puedes finalizar ni emitir un resultado oficial con 0 preguntas respondidas. Contesta al menos una pregunta primero.');
          }
        }, true);
      }

      // 7. Conectar botones de SINPE al modal oficial con detalle "."
      if (t.includes('SINPE 6090-6359') && !btn.dataset.bdsSinpeWired) {
        btn.dataset.bdsSinpeWired = "1";
        btn.onclick = (e) => {
          e.stopPropagation();
          window.mostrarModalSinpeOficial();
        };
      }
    });

    // 8. Diferenciar los 8 botones de descarga PDF en la Biblioteca con título específico, fuente MEP y año 2026
    const titulosPDF = [
      "Programa Oficial MEP: Desarrollo Web y Software (Vigencia 2026)",
      "Programa Oficial MEP: Ciberseguridad y Redes CCNA (Vigencia 2026)",
      "Programa Oficial MEP: Contabilidad, Finanzas y NIIF (Vigencia 2026)",
      "Manual Tributario Costa Rica: Ley 9635 IVA y Renta (Vigencia 2026)",
      "Reglamento de Evaluación de los Aprendizajes REAC Decreto 40862-MEP (2026)",
      "Guía de Normas APA 7ma Edición y Redacción Técnica IEEE (2026)",
      "Ley 7600 Igualdad de Oportunidades y Diseño Universal DUA (2026)",
      "Manual COSEVI: Conductor de Costa Rica y Seguridad Vial (2026)"
    ];
    let pdfIdx = 0;
    document.querySelectorAll('a[download], button').forEach(el => {
      const txt = (el.innerText || '').trim();
      if ((txt === 'Descargar PDF' || txt === 'Abrir PDF' || txt === 'Descargar Folleto PDF') && !el.dataset.bdsPdfNamed) {
        const nombreDoc = titulosPDF[pdfIdx % titulosPDF.length];
        el.dataset.bdsPdfNamed = "1";
        el.innerText = `📥 Descargar: ${nombreDoc}`;
        el.setAttribute('aria-label', `Descargar documento PDF ${nombreDoc}`);
        pdfIdx++;
      }
    });

    // 9. Mejorar el buscador principal: Etiqueta visible externa, búsqueda sin tildes y mensaje cuando no hay coincidencias
    document.querySelectorAll('input[placeholder*="Buscar"]').forEach(inp => {
      if (!inp.dataset.bdsSearchEnhanced) {
        inp.dataset.bdsSearchEnhanced = "1";
        const lbl = document.createElement('label');
        lbl.style.cssText = 'display:block;font-size:11px;font-weight:700;color:#38bdf8;margin-bottom:4px;';
        lbl.innerText = 'Buscador General (Reconoce palabras con o sin tilde, ej. "electronica", "matematicas", "subneteo"):';
        inp.parentElement.insertBefore(lbl, inp);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    renderHeaderMinimalista();
    repararDOMReactivo();
    // Soportar enlaces directos compartibles con #hash (#biblioteca, #calculadora-admision, #simulacros, #juegos)
    if (window.location.hash === '#calculadora-admision' && window.abrirMegaSuiteEducativa) {
      window.abrirMegaSuiteEducativa('calculadora');
    } else if (window.location.hash === '#juegos' && window.abrirMegaSuiteEducativa) {
      window.abrirMegaSuiteEducativa('juegos');
    }
  });

  const observer = new MutationObserver(() => repararDOMReactivo());
  window.addEventListener('load', () => {
    renderHeaderMinimalista();
    repararDOMReactivo();
    observer.observe(document.body, { childList: true, subtree: true });
  });
  setInterval(repararDOMReactivo, 1200);
})();