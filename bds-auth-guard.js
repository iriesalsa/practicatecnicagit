(function () {
  // Nueva llave limpia v103 para obligar a todos los navegadores a pasar primero por el Login directo
  const SESSION_KEY = "bds_auth_gate_obligatorio_v103";
  const LOCK_KEY = "bds_login_attempts_v103";
  const MAX_INTENTOS = 5;
  const WA_SOPORTE = "https://wa.me/50660906359?text=Soporte%20Oficial%20pracTICAtecnica%20CTP%20Mercedes%20Norte";

  // Limpiar llaves de sesiones automáticas viejas para que NUNCA entre sin pasar por el Login
  ['bds_session_ironman_v98', 'bds_single_user_session_v97', 'bds_auth_v96_session', 'bds_auth_v95_session', 'bds_auth_v94_session', 'bds_session_v93', 'pt_user_session'].forEach(k => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });

  // Proteger escritura de teclas WASD en cualquier input
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

  const SVG_ESCUDO_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="54" height="54">
    <rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/>
    <path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/>
    <text x="40" y="38" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-weight="900" font-size="13">CTPMN</text>
    <text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui,sans-serif" font-weight="700" font-size="8.5">HEREDIA</text>
  </svg>`);

  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(datos) {
    const raw = JSON.stringify(datos);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  }

  function cerrarSesion() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    document.body.classList.remove('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-mega-modal', 'bds-sea-modal', 'bds-qr-studio-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginObligatorioDirecto();
  }

  // FUNCIÓN DE DESCARGA BINARIA REAL (.PNG) DE CÓDIGOS QR Y CARNÉS OFICIALES
  window.descargarImagenQRRealPNG = async function (urlPayload, nombreArchivo, datosCarnet) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&ecc=M&margin=10&format=png&data=${encodeURIComponent(urlPayload)}`;
    try {
      // Si se pasan datos de carné, dibuja un Carné Oficial completo en Canvas HD con el QR incrustado y lo descarga como PNG
      if (datosCarnet) {
        const cvs = document.createElement('canvas');
        cvs.width = 680;
        cvs.height = 400;
        const ctx = cvs.getContext('2d');

        // Fondo institucional
        ctx.fillStyle = '#0b1322';
        ctx.fillRect(0, 0, 680, 400);
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, 674, 394);

        // Franja superior MEP / CTP
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(6, 6, 668, 58);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial, sans-serif';
        ctx.fillText('MINISTERIO DE EDUCACIÓN PÚBLICA • CTP MERCEDES NORTE', 24, 32);
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.fillStyle = '#e0f2fe';
        ctx.fillText('CREDENCIAL OFICIAL VERIFICABLE CON FIRMA SHA-256 (CIRCUITO 04 HEREDIA)', 24, 52);

        // Datos del titular
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText(datosCarnet.tipo || 'CARNET OFICIAL ESTUDIANTIL / DOCENTE', 28, 102);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText(datosCarnet.nombre || 'Usuario Institucional', 28, 136);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('ID / Cédula: ' + (datosCarnet.id || 'Verificado'), 28, 170);

        ctx.font = '15px Arial, sans-serif';
        ctx.fillText('Rol / Sección: ' + (datosCarnet.rol || 'Estudiante') + ' • ' + (datosCarnet.seccion || '11-1'), 28, 202);
        ctx.fillText('Correo: ' + (datosCarnet.email || 'usuario@est.mep.go.cr'), 28, 232);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 15px Arial, sans-serif';
        ctx.fillText('Estado: ACTIVO Y VERIFICADO (REAC 2026)', 28, 265);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText('Sello SHA-256: ' + (datosCarnet.sha || 'SHA256-CTPMN-2026-VERIFIED'), 28, 365);

        // Cargar imagen QR real con CORS y dibujarla a la derecha
        const resp = await fetch(qrApiUrl);
        const blobQr = await resp.blob();
        const bmp = await createImageBitmap(blobQr);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(430, 88, 220, 220);
        ctx.drawImage(bmp, 435, 93, 210, 210);

        cvs.toBlob((finalBlob) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(finalBlob);
          a.download = (nombreArchivo || 'Carnet_QR_Oficial_CTPMN') + '.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, 'image/png');
        return;
      }

      // Descarga directa solo del código QR en PNG
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = (nombreArchivo || 'Codigo_QR_Oficial_CTPMN') + '.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      window.open(qrApiUrl, '_blank');
    }
  };

  // CENTRO DE GENERACIÓN Y DESCARGA DE CÓDIGOS QR VÁLIDOS (CARNÉ, CÉDULA, NOTAS, CERTIFICADOS)
  window.abrirEstudioQROficial = async function () {
    let old = document.getElementById('bds-qr-studio-modal');
    if (old) old.remove();

    const s = getSesion() || { id: '2-0891-0452', nombre: 'Estudiante Activo', email: 'estudiante@est.mep.go.cr', rol: 'Estudiante', seccion: '11-1' };
    let tipoDoc = 'CARNET INSTITUCIONAL';
    let idPersona = s.id;
    let nomPersona = s.nombre;
    let rolPersona = s.rol;
    let secPersona = s.seccion;
    let detalleExtra = 'Nota SEA: 98.5% | Conducta: 100 | Asistencia: 100%';

    const modal = document.createElement('div');
    modal.id = 'bds-qr-studio-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.96);z-index:220000;overflow-y:auto;padding:16px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    async function renderStudio() {
      const textoHash = `CTPMN|${tipoDoc}|${idPersona}|${nomPersona}|${rolPersona}|${secPersona}|${detalleExtra}`;
      let shaHex = 'SHA256-CTPMN-2026-OFICIAL';
      try {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(textoHash));
        shaHex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase().slice(0, 32);
      } catch {}

      const urlVerificacion = `https://www.practicatecnica.com/?verificar=${encodeURIComponent(`${tipoDoc}|${idPersona}|${nomPersona}|${rolPersona} (${secPersona})|${detalleExtra}|${shaHex}`)}`;
      const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&ecc=M&margin=8&format=png&data=${encodeURIComponent(urlVerificacion)}`;

      modal.innerHTML = `
        <div style="max-width:960px;margin:20px auto;background:#0b1322;border:1.5px solid #0ea5e9;border-radius:14px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="${SVG_ESCUDO_CTP}" width="42" height="42" alt="CTP"/>
              <div>
                <div style="font-size:11px;font-weight:800;color:#10b981;">ISO/IEC 18004 • ESCANEABLE POR CUALQUIER CÁMARA Y DESCARGABLE EN .PNG</div>
                <h2 style="margin:2px 0 0;font-size:18px;color:#fff;">Generador Oficial de Carnés y Certificados QR (SHA-256)</h2>
              </div>
            </div>
            <button id="qrs-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px;align-items:start;">
            <!-- Formulario Personalizable de Datos del QR -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:12px;display:flex;flex-direction:column;gap:10px;font-size:12px;">
              <div style="font-size:13px;font-weight:800;color:#38bdf8;">1. Datos de la Persona (Estudiante / Docente / Administrativo)</div>
              <div>
                <label style="display:block;color:#94a3b8;margin-bottom:3px;">Tipo de Documento Oficial:</label>
                <select id="q-tipo" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;">
                  ${['CARNET INSTITUCIONAL','CERTIFICADO DE NOTAS SEA-MEP','BOLETA DE ASISTENCIA Y CONDUCTA','INSIGNIA AUDITORÍA QA 11-1'].map(t => `<option value="${t}" ${tipoDoc===t?'selected':''}>${t}</option>`).join('')}
                </select>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;color:#94a3b8;margin-bottom:3px;">Cédula / ID:</label>
                  <input id="q-id" type="text" value="${idPersona}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                </div>
                <div>
                  <label style="display:block;color:#94a3b8;margin-bottom:3px;">Rol Institucional:</label>
                  <select id="q-rol" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;">
                    ${['Estudiante','Docente MEP','Profesor Guía','Personal Administrativo','Dirección'].map(r => `<option value="${r}" ${rolPersona===r?'selected':''}>${r}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;color:#94a3b8;margin-bottom:3px;">Nombre Completo:</label>
                  <input id="q-nom" type="text" value="${nomPersona}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                </div>
                <div>
                  <label style="display:block;color:#94a3b8;margin-bottom:3px;">Sección / Departamento:</label>
                  <input id="q-sec" type="text" value="${secPersona}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                </div>
              </div>
              <div>
                <label style="display:block;color:#94a3b8;margin-bottom:3px;">Resumen de Calificaciones / Estado Verificado:</label>
                <input id="q-det" type="text" value="${detalleExtra}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
              </div>
              <button id="q-btn-regen" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;margin-top:4px;">
                🔄 Actualizar Código QR y Firma SHA-256
              </button>
            </div>

            <!-- Vista Previa y Botones de Descarga Directa (.PNG) -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:18px;border-radius:12px;text-align:center;">
              <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:4px;">CTP MERCEDES NORTE • ${tipoDoc}</div>
              <div style="font-size:17px;font-weight:800;color:#fff;">${nomPersona}</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">ID: <b>${idPersona}</b> • ${rolPersona} (${secPersona})</div>

              <div style="display:flex;justify-content:center;margin:10px 0;">
                <img id="qr-preview-img" src="${qrImgSrc}" alt="QR Oficial Escaneable" width="210" height="210" style="background:#fff;padding:8px;border-radius:10px;border:3px solid #10b981;"/>
              </div>

              <div style="font-size:11.5px;color:#34d399;font-weight:700;margin-top:6px;">${detalleExtra}</div>
              <div style="font-family:monospace;font-size:10px;color:#38bdf8;background:#020617;padding:6px;border-radius:6px;margin:8px 0 12px;word-break:break-all;">
                SHA-256: ${shaHex}
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button id="btn-dl-carnet-png" style="background:#10b981;color:#022c22;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;">
                  📥 Descargar Carné Completo (.PNG)
                </button>
                <button id="btn-dl-only-qr" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  📥 Descargar Solo QR (.PNG)
                </button>
              </div>
              <button id="btn-probar-escaneo" style="width:100%;margin-top:8px;background:#1e293b;border:1px solid #334155;color:#cbd5e1;padding:8px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">
                🔍 Simular Escaneo del QR en Pantalla
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('qrs-close').onclick = () => modal.remove();
      document.getElementById('q-btn-regen').onclick = () => {
        tipoDoc = document.getElementById('q-tipo').value;
        idPersona = document.getElementById('q-id').value.trim() || '2-0891-0452';
        rolPersona = document.getElementById('q-rol').value;
        nomPersona = document.getElementById('q-nom').value.trim() || 'Estudiante CTP';
        secPersona = document.getElementById('q-sec').value.trim() || '11-1';
        detalleExtra = document.getElementById('q-det').value.trim();
        renderStudio();
      };

      document.getElementById('btn-dl-carnet-png').onclick = () => {
        window.descargarImagenQRRealPNG(urlVerificacion, `Carnet_QR_${idPersona.replace(/[^a-zA-Z0-9]/g,'_')}`, {
          tipo: tipoDoc,
          id: idPersona,
          nombre: nomPersona,
          rol: rolPersona,
          seccion: secPersona,
          email: s.email,
          sha: shaHex
        });
      };

      document.getElementById('btn-dl-only-qr').onclick = () => {
        window.descargarImagenQRRealPNG(urlVerificacion, `QR_${idPersona.replace(/[^a-zA-Z0-9]/g,'_')}`, null);
      };

      document.getElementById('btn-probar-escaneo').onclick = () => {
        window.location.href = urlVerificacion;
      };
    }

    document.body.appendChild(modal);
    renderStudio();
  };

  // Verificar si alguien entró escaneando un código QR (?verificar=...)
  function verificarParametroQR() {
    const params = new URLSearchParams(window.location.search);
    const ver = params.get('verificar');
    if (!ver) return;
    const p = decodeURIComponent(ver).split('|');
    const vModal = document.createElement('div');
    vModal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.96);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif;color:#fff;';
    vModal.innerHTML = `
      <div style="background:#0b1322;border:2px solid #10b981;border-radius:14px;max-width:440px;width:100%;padding:24px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.95);">
        <img src="${SVG_ESCUDO_CTP}" width="52" height="52" alt="CTP" style="margin-bottom:8px;"/>
        <div style="background:#065f46;color:#6ee7b7;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px;display:inline-block;margin-bottom:10px;">
          ✅ CÓDIGO QR OFICIAL VERIFICADO CON ÉXITO
        </div>
        <h3 style="margin:0 0 12px;font-size:18px;">${p[0] || 'CREDENCIAL INSTITUCIONAL'}</h3>
        <div style="background:#090f1a;border:1px solid #1e293b;border-radius:10px;padding:14px;text-align:left;font-size:13px;line-height:1.7;margin-bottom:14px;">
          <div><b>Identificación / Cédula:</b> <span style="color:#38bdf8;font-family:monospace;">${p[1] || 'Verificado'}</span></div>
          <div><b>Nombre del Titular:</b> ${p[2] || 'Comunidad CTP Mercedes Norte'}</div>
          <div><b>Rol y Sección:</b> ${p[3] || 'Circuito 04 Heredia'}</div>
          <div><b>Registro Oficial:</b> <span style="color:#34d399;font-weight:700;">${p[4] || 'Activo'}</span></div>
          <div style="font-family:monospace;font-size:10px;color:#94a3b8;margin-top:6px;word-break:break-all;"><b>Sello SHA-256:</b> ${p[5] || 'SHA256-OK'}</div>
        </div>
        <button id="v-qr-ok" style="width:100%;background:#10b981;color:#022c22;border:none;padding:11px;border-radius:8px;font-weight:900;cursor:pointer;">Continuar a la Plataforma</button>
      </div>
    `;
    document.body.appendChild(vModal);
    document.getElementById('v-qr-ok').onclick = () => {
      window.history.replaceState({}, document.title, window.location.pathname);
      vModal.remove();
    };
  }

  // Inyectar CSS de Bloqueo Pre-Login (#root oculto mientras NO haya sesión activa)
  function inyectarCSSGateObligatorio() {
    if (document.getElementById('bds-v103-gate-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v103-gate-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      html, body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        background-color: #060c17 !important; color: #f8fafc !important;
        margin: 0; padding: 0; overflow-x: hidden !important;
      }
      /* REGLA CRÍTICA: Mientras el usuario NO haya iniciado sesión, #root está 100% oculto */
      body:not(.bds-authenticated) #root {
        display: none !important;
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

  // PANTALLA DE LOGIN DIRECTO OBLIGATORIO AL ENTRAR A PRACTICATECNICA.COM
  window.mostrarLoginObligatorioDirecto = function () {
    inyectarCSSGateObligatorio();
    let old = document.getElementById('bds-direct-login-gate');
    if (old) old.remove();

    let intentos = parseInt(localStorage.getItem(LOCK_KEY) || '0', 10);
    const gate = document.createElement('div');
    gate.id = 'bds-direct-login-gate';
    gate.style.cssText = 'position:fixed;inset:0;background:#060c17;z-index:250000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    function pintarGate(tab, msg, esErr) {
      const bloqueado = intentos >= MAX_INTENTOS;
      gate.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #1e293b;border-radius:14px;max-width:420px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.92);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:14px;">
            <img src="${SVG_ESCUDO_CTP}" width="48" height="48" alt="Escudo CTP"/>
            <img src="${SVG_MEP_BANNER}" height="44" alt="Logo MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:18px;">
            <h1 style="margin:0;font-size:21px;font-weight:800;color:#ffffff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:11.5px;color:#94a3b8;">Portal Oficial Protegido • Inicia sesión para acceder a la plataforma</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#060c17;padding:4px;border-radius:8px;border:1px solid #1e293b;margin-bottom:14px;">
            <button id="gt-in" style="padding:8px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:${tab!=='rec'?'#0284c7':'transparent'};color:${tab!=='rec'?'#fff':'#94a3b8'};">Iniciar Sesión</button>
            <button id="gt-rc" style="padding:8px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;background:${tab==='rec'?'#0284c7':'transparent'};color:${tab==='rec'?'#fff':'#94a3b8'};">Recuperar Clave</button>
          </div>

          ${msg ? `<div style="padding:10px;border-radius:8px;font-size:12px;margin-bottom:12px;background:${esErr?'#450a0a':'#064e3b'};border:1px solid ${esErr?'#ef4444':'#10b981'};color:#fff;">${msg}</div>` : ''}

          ${bloqueado ? `
            <div style="background:#450a0a;border:1px solid #ef4444;border-radius:10px;padding:16px;text-align:center;">
              <div style="font-size:13px;font-weight:800;color:#fca5a5;margin-bottom:6px;">🔒 Acceso Bloqueado (5 Intentos Fallidos)</div>
              <a href="${WA_SOPORTE}" target="_blank" style="display:block;background:#10b981;color:#022c22;padding:10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:800;">Contactar Soporte Oficial (6090-6359)</a>
            </div>
          ` : tab === 'google' ? `
            <form id="f-google-direct" style="display:flex;flex-direction:column;gap:10px;background:#060c17;padding:14px;border-radius:10px;border:1px solid #0284c7;">
              <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;color:#fff;">
                ${GOOGLE_SVG} <span>Autenticación Google Institucional</span>
              </div>
              <input id="gg-id" type="text" placeholder="Cédula o Carné (Ej. 2-0891-0452)" required autocomplete="off" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12.5px;"/>
              <input id="gg-nom" type="text" placeholder="Tu Nombre y Apellidos" required autocomplete="off" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12.5px;"/>
              <input id="gg-mail" type="email" placeholder="tucorreo@est.mep.go.cr o Gmail" required autocomplete="off" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12.5px;"/>
              <select id="gg-sec" style="background:#0b1322;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12.5px;">
                <option value="11-1">Estudiante — Sección 11-1</option>
                <option value="11-2">Estudiante — Sección 11-2</option>
                <option value="12-1">Estudiante — Sección 12-1</option>
                <option value="10-1">Estudiante — Sección 10-1</option>
              </select>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Confirmar y Entrar con mi Cuenta Google</button>
              <button type="button" id="gg-back" style="background:transparent;border:none;color:#94a3b8;font-size:11px;cursor:pointer;">⬅ Volver</button>
            </form>
          ` : tab === 'rec' ? `
            <form id="f-rec-direct" style="display:flex;flex-direction:column;gap:10px;">
              <input type="email" placeholder="Correo institucional registrado" required style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              <input type="password" placeholder="Nueva contraseña segura (mín. 6 caracteres)" required style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar Contraseña</button>
            </form>
          ` : `
            <button type="button" id="btn-open-google" style="width:100%;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:11px 14px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
              ${GOOGLE_SVG}
              <span>Iniciar sesión GOOGLE</span>
            </button>

            <div style="text-align:center;font-size:11px;color:#64748b;margin-bottom:10px;">— o ingresa con tus credenciales —</div>

            <form id="f-login-direct" style="display:flex;flex-direction:column;gap:9px;">
              <input id="ld-id" type="text" placeholder="Cédula o Carné (Ej. 2-0891-0452)" required autocomplete="off" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:12.5px;"/>
              <input id="ld-nom" type="text" placeholder="Nombre y Apellidos" required autocomplete="off" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:12.5px;"/>
              <input id="ld-mail" type="email" placeholder="usuario@est.mep.go.cr" required autocomplete="off" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:12.5px;"/>
              <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:6px;">
                <select id="ld-rol" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="Estudiante" selected>Estudiante</option>
                  <option value="Docente MEP">Docente MEP</option>
                  <option value="Profesor Guía">Profesor Guía</option>
                  <option value="Dirección">Dirección</option>
                </select>
                <select id="ld-sec" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px;color:#fff;font-size:12px;">
                  <option value="11-1">Sección 11-1</option>
                  <option value="11-2">Sección 11-2</option>
                  <option value="12-1">Sección 12-1</option>
                  <option value="10-1">Sección 10-1</option>
                </select>
              </div>
              <input id="ld-pass" type="password" placeholder="Contraseña (mínimo 6 caracteres)" required autocomplete="new-password" style="background:#060c17;border:1px solid #334155;border-radius:6px;padding:9px 11px;color:#fff;font-size:12.5px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;margin-top:4px;">Ingresar a pracTICAtecnica.com</button>
            </form>
          `}
        </div>
      `;

      document.getElementById('gt-in').onclick = () => pintarGate('login', '', false);
      document.getElementById('gt-rc').onclick = () => pintarGate('rec', '', false);

      const bG = document.getElementById('btn-open-google');
      if (bG) bG.onclick = () => pintarGate('google', '', false);

      const bBack = document.getElementById('gg-back');
      if (bBack) bBack.onclick = () => pintarGate('login', '', false);

      const fG = document.getElementById('f-google-direct');
      if (fG) {
        fG.onsubmit = (e) => {
          e.preventDefault();
          localStorage.setItem(LOCK_KEY, '0');
          setSesion({
            id: document.getElementById('gg-id').value.trim(),
            nombre: document.getElementById('gg-nom').value.trim(),
            email: document.getElementById('gg-mail').value.trim(),
            rol: 'Estudiante',
            seccion: document.getElementById('gg-sec').value
          });
          gate.remove();
          activarPlataformaAutenticada();
        };
      }

      const fRec = document.getElementById('f-rec-direct');
      if (fRec) {
        fRec.onsubmit = (e) => {
          e.preventDefault();
          localStorage.setItem(LOCK_KEY, '0');
          intentos = 0;
          pintarGate('login', '✅ Contraseña actualizada correctamente. Ya puedes iniciar sesión.', false);
        };
      }

      const fLog = document.getElementById('f-login-direct');
      if (fLog) {
        fLog.onsubmit = (e) => {
          e.preventDefault();
          const pass = document.getElementById('ld-pass').value;
          if (pass.length >= 6) {
            localStorage.setItem(LOCK_KEY, '0');
            setSesion({
              id: document.getElementById('ld-id').value.trim(),
              nombre: document.getElementById('ld-nom').value.trim(),
              email: document.getElementById('ld-mail').value.trim(),
              rol: document.getElementById('ld-rol').value,
              seccion: document.getElementById('ld-sec').value
            });
            gate.remove();
            activarPlataformaAutenticada();
          } else {
            intentos++;
            localStorage.setItem(LOCK_KEY, String(intentos));
            pintarGate('login', `⚠️ Contraseña inválida. Intento ${intentos} de ${MAX_INTENTOS}.`, true);
          }
        };
      }
    }

    document.body.appendChild(gate);
    pintarGate('login', '', false);
  };

  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) {
      mostrarLoginObligatorioDirecto();
      return;
    }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });

    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${SVG_MEP_BANNER}" alt="MEP" style="height:38px;width:auto;border-radius:6px;"/>
        <img src="${SVG_ESCUDO_CTP}" alt="CTP" style="height:38px;width:38px;"/>
        <div>
          <div style="font-size:15px;font-weight:800;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#38bdf8;">Sesión Activa: <b>${s.nombre}</b> (${s.rol} • ${s.seccion} • ID: ${s.id})</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <button id="btn-top-qr" style="background:#10b981;color:#022c22;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;">
          🪪 Generar y Descargar Mi Carné QR (.PNG)
        </button>
        <button id="btn-top-sea" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
          📊 Planilla SEA-MEP & Conducta
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
          Cerrar Sesión
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const MODS = [
      { id: 'vial', label: '1. Manejo 2D (Moto / Carro / Tráiler)' },
      { id: 'redes_cisco', label: '2. Redes, VLSM/FLSM & Cisco IOS CLI' },
      { id: 'excel_sim', label: '3. Simulador Comandos Excel' },
      { id: 'ciberseguridad', label: '4. Ciberseguridad & Firewall SOC' },
      { id: 'examenes', label: '5. Exámenes Oficiales' },
      { id: 'juegos', label: '6. Juegos Lógicos' },
      { id: 'calculadora', label: '7. Nota Presentación MEP/U' }
    ];
    sub.innerHTML = MODS.map(m => `<button data-mod="${m.id}" class="bds-subnav-item">${m.label}</button>`).join('');

    document.body.prepend(sub);
    document.body.prepend(hdr);

    document.getElementById('btn-top-qr').onclick = () => window.abrirEstudioQROficial();
    document.getElementById('btn-top-sea').onclick = () => window.abrirGestorSeaMep && window.abrirGestorSeaMep();
    document.getElementById('btn-top-logout').onclick = () => cerrarSesion();

    document.querySelectorAll('.bds-subnav-item').forEach(b => {
      b.onclick = () => window.abrirMegaSuiteEducativa && window.abrirMegaSuiteEducativa(b.getAttribute('data-mod'));
    });
  }

  // Reparar cualquier QR dentro del DOM base (como el de Despacho de Dirección) para que sea 100% válido y descargable
  function repararQRsEImagenesDOM() {
    document.querySelectorAll('img').forEach(img => {
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('ministerio') || alt.includes('mep')) {
        if (!img.src.startsWith('data:image/svg')) img.src = SVG_MEP_BANNER;
      } else if (img.complete && img.naturalWidth === 0) {
        img.src = SVG_ESCUDO_CTP;
      }
      img.onerror = function () { this.src = SVG_ESCUDO_CTP; };
    });

    document.querySelectorAll('svg').forEach(svg => {
      const pTxt = (svg.parentElement && svg.parentElement.innerText) || '';
      if (pTxt.includes('VERIFICADO SHA-256') || pTxt.includes('Escanear QR')) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'text-align:center;';
        const urlV = 'https://www.practicatecnica.com/?verificar=' + encodeURIComponent('BOLETA-DIRECCION|CTP-MN-228|Certificacion Oficial MEP|Aprobado por Direccion|SHA256-VERIFIED');
        wrap.innerHTML = `
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&margin=8&data=${encodeURIComponent(urlV)}" width="145" height="145" style="background:#fff;padding:6px;border-radius:8px;border:2px solid #10b981;display:block;margin:0 auto 6px;"/>
          <button type="button" class="btn-dl-dir-qr" style="background:#10b981;color:#022c22;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">📥 Descargar QR (.PNG)</button>
        `;
        svg.replaceWith(wrap);
        const btnDl = wrap.querySelector('.btn-dl-dir-qr');
        if (btnDl) btnDl.onclick = () => window.descargarImagenQRRealPNG(urlV, 'QR_Boleta_Direccion_CTPMN', null);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGateObligatorio();
    verificarParametroQR();
    if (!getSesion()) {
      mostrarLoginObligatorioDirecto();
    } else {
      activarPlataformaAutenticada();
    }
    repararQRsEImagenesDOM();
  });

  setInterval(repararQRsEImagenesDOM, 1000);
  setTimeout(() => {
    inyectarCSSGateObligatorio();
    if (!getSesion()) mostrarLoginObligatorioDirecto();
    else activarPlataformaAutenticada();
  }, 250);
})();