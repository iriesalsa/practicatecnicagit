(function () {
  const SESSION_KEY = "bds_auth_gate_v156_whatsapp";
  const CHAT_STORAGE_KEY = "bds_whatsapp_channels_v156";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true, icono: "🎒", color: "#0284c7" },
    { rol: "Docente MEP", requiereSeccion: true, icono: "👨‍🏫", color: "#059669" },
    { rol: "Director(a)", requiereSeccion: false, icono: "🏛️", color: "#7c3aed" },
    { rol: "Subdirector(a)", requiereSeccion: false, icono: "📊", color: "#0d9488" },
    { rol: "SuperAdmin", requiereSeccion: false, icono: "👑", color: "#f59e0b" }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="155" height="36"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="38" height="38"><rect width="80" height="80" rx="16" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><circle cx="40" cy="42" r="24" fill="#0284c7"/><path d="M22 24 L32 30 L24 36 Z" fill="#38bdf8"/><path d="M58 24 L48 30 L56 36 Z" fill="#38bdf8"/><circle cx="31" cy="38" r="8" fill="#ffffff"/><circle cx="49" cy="38" r="8" fill="#ffffff"/><circle cx="31" cy="38" r="4" fill="#020617"/><circle cx="49" cy="38" r="4" fill="#020617"/><polygon points="40,42 35,50 45,50" fill="#f59e0b"/><text x="40" y="73" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="8.5">CTPMN</text></svg>`);

  let audioCtx = null;
  function playWhatsAppTone() {
    try {
      if (!audioCtx) { const Ctx = window.AudioContext || window.webkitAudioContext; audioCtx = new Ctx(); }
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.12);
    } catch {}
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
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto();
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v156-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v156-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
      body:not(.bds-authenticated) #root { display: none !important; }
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
      .whatsapp-bubble {
        background: #005c4b; color: #e9edef; padding: 10px 14px; border-radius: 8px 0 8px 8px; max-width: 80%; word-break: break-word; font-size: 13px; box-shadow: 0 1px 2px rgba(0,0,0,0.3); position: relative;
      }
      .whatsapp-bubble-incoming {
        background: #202c33; color: #e9edef; padding: 10px 14px; border-radius: 0 8px 8px 8px; max-width: 80%; word-break: break-word; font-size: 13px; box-shadow: 0 1px 2px rgba(0,0,0,0.3); position: relative;
      }
    `;
    document.body.appendChild(st);
  }

  window.mostrarLoginEstricto = function () {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v156');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v156';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at top,#0f2942 0%,#060c17 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
        <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:10px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="42" height="42" alt="Búho"/>
          <img src="${SVG_MEP}" height="34" alt="MEP" style="border-radius:6px;"/>
        </div>
        <div style="text-align:center;margin-bottom:14px;">
          <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
          <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">WhatsApp Institucional & Jefatura • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v156" style="display:flex;flex-direction:column;gap:9px;">
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Correo Institucional / Google Auth:</label>
            <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Nombre Completo:</label>
            <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Rol:</label>
              <select id="lg-rol" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${r.rol==='SuperAdmin'?'selected':''}>${r.icono} ${r.rol}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Sección:</label>
              <select id="lg-sec" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
              </select>
            </div>
          </div>
          <button type="submit" style="margin-top:6px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
            🔐 Ingresar a WhatsApp CTPMN
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v156').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;
      const esMax = (mail === 'maxi.salsa@gmail.com');

      setSesion({
        id: esMax ? 'SUPERADMIN-MAX' : ('USER-' + Date.now()),
        nombre: nom,
        email: mail,
        rol: esMax ? 'SuperAdmin' : rolSel,
        seccion: `Sección ${secSel}`
      });

      gate.remove();
      activarPlataformaAutenticada();
    };
  };

  // ============================================================================
  // CENTRO DE CHATS ESTILO WHATSAPP (CANALES A/B Y DIRECCIÓN)
  // ============================================================================
  function renderWhatsAppInstitucional(contenedor) {
    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    const CANALES_WHATSAPP = [
      {
        id: `sec_${secBase}_A`,
        nombre: `Sección ${secBase} • Subgrupo A`,
        subtitulo: "Especialidad 1 (Desarrollo Web / Taller A)",
        unread: 2,
        mensajes: [
          { remitente: "Prof. Coordinador", hora: "07:30 AM", txt: `Bienvenidos al canal de WhatsApp del Subgrupo A de la Sección ${secBase}.` },
          { remitente: "Estudiante Asistente", hora: "08:15 AM", txt: "Profesor, ¿ya está habilitado el simulador de examen en la PWA?" }
        ]
      },
      {
        id: `sec_${secBase}_B`,
        nombre: `Sección ${secBase} • Subgrupo B`,
        subtitulo: "Especialidad 2 (Ciberseguridad / Taller B)",
        unread: 0,
        mensajes: [
          { remitente: "Prof. Laboratorio", hora: "07:35 AM", txt: "Canal Subgrupo B activo. Recuerden guardar las prácticas en el repositorio local." }
        ]
      },
      {
        id: "canal_direccion",
        nombre: "🏛️ Dirección & Jefatura CTPMN",
        subtitulo: "Circuito 04 • Avisos Oficiales",
        unread: 1,
        mensajes: [
          { remitente: "Despacho Dirección", hora: "07:00 AM", txt: "Circular urgente: Sincronización de horarios de 20 horas en propiedad completada." }
        ]
      },
      {
        id: "canal_seguridad",
        nombre: "🛡️ Seguridad & Portón Principal",
        subtitulo: "Control de Acceso y QRs",
        unread: 0,
        mensajes: [
          { remitente: "Guarda en Puerta", hora: "06:50 AM", txt: "Escáner QR institucional operando con normalidad." }
        ]
      }
    ];

    let canalActualId = CANALES_WHATSAPP[0].id;

    function pintarWhatsAppUI() {
      const canalObj = CANALES_WHATSAPP.find(c => c.id === canalActualId) || CANALES_WHATSAPP[0];
      const storageKey = `bds_wa_msgs_${canalObj.id}`;
      let msgs = [];
      try { msgs = JSON.parse(localStorage.getItem(storageKey)) || canalObj.mensajes; } catch { msgs = canalObj.mensajes; }

      contenedor.innerHTML = `
        <div style="background:#111b21;border:1.5px solid #222d34;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.85);display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));min-height:500px;">
          <!-- Barra Lateral de Chats (Estilo WhatsApp Desktop) -->
          <div style="background:#111b21;border-right:1px solid #222d34;display:flex;flex-direction:column;">
            <div style="background:#202c33;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
              <div style="font-weight:900;color:#e9edef;font-size:15px;">💬 WhatsApp CTPMN</div>
              <span style="font-size:10px;background:#005c4b;color:#e9edef;padding:3px 8px;border-radius:99px;">Conectado</span>
            </div>
            <div style="overflow-y:auto;flex:1;">
              ${CANALES_WHATSAPP.map(c => `
                <div data-wid="${c.id}" class="wa-chat-item" style="padding:12px 16px;border-bottom:1px solid #222d34;background:${c.id===canalActualId?'#2a3942':'transparent'};cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="font-weight:800;color:#e9edef;font-size:13.5px;">${c.nombre}</div>
                    <div style="font-size:11px;color:#8696a0;margin-top:2px;">${c.subtitulo}</div>
                  </div>
                  ${c.unread>0?`<span style="background:#00a884;color:#111b21;font-size:10.5px;font-weight:900;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;">${c.unread}</span>`:''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Ventana de Chat Activa -->
          <div style="background:#0b141a;display:flex;flex-direction:column;justify-content:space-between;">
            <div style="background:#202c33;padding:12px 16px;border-bottom:1px solid #222d34;display:flex;align-items:center;justify-content:between;">
              <div>
                <div style="font-weight:900;color:#e9edef;font-size:14.5px;">${canalObj.nombre}</div>
                <div style="font-size:11px;color:#8696a0;">${canalObj.subtitulo} • Cifrado de extremo a extremo MEP</div>
              </div>
            </div>

            <div id="wa-msgs-box" style="padding:16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:10px;max-height:360px;">
              ${msgs.map(m => `
                <div style="display:flex;flex-direction:column;align-items:${m.remitente===s.nombre||m.remitente===s.rol?'flex-end':'flex-start'};">
                  <div style="font-size:10.5px;color:#8696a0;margin-bottom:2px;font-weight:700;">${m.remitente}</div>
                  <div class="${(m.remitente===s.nombre||m.remitente===s.rol)?'whatsapp-bubble':'whatsapp-bubble-incoming'}">
                    ${m.txt}
                    <div style="font-size:9px;color:#8696a0;text-align:right;margin-top:4px;">${m.hora} ✓✓</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <form id="wa-send-form" style="background:#202c33;padding:12px 16px;display:flex;gap:8px;">
              <input id="wa-txt-in" type="text" placeholder="Escribe un mensaje de WhatsApp..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:10px 14px;border-radius:8px;font-size:13px;outline:none;"/>
              <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:10px 18px;border-radius:8px;font-weight:900;font-size:13px;cursor:pointer;">Enviar ➤</button>
            </form>
          </div>
        </div>
      `;

      contenedor.querySelectorAll('.wa-chat-item').forEach(el => {
        el.onclick = () => { canalActualId = el.getAttribute('data-wid'); pintarWhatsAppUI(); };
      });

      const bScroll = document.getElementById('wa-msgs-box');
      if (bScroll) bScroll.scrollTop = bScroll.scrollHeight;

      document.getElementById('wa-send-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('wa-txt-in');
        const txt = inp.value.trim();
        if (!txt) return;
        const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        msgs.push({ remitente: s.nombre, hora, txt });
        localStorage.setItem(storageKey, JSON.stringify(msgs));
        playWhatsAppTone();
        pintarWhatsAppUI();
      };
    }

    pintarWhatsAppUI();
  }

  // ============================================================================
  // ACTIVACIÓN DE LA PLATAFORMA AUTENTICADA V156.0
  // ============================================================================
  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto(); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });

    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho" style="height:32px;width:32px;cursor:pointer;" onclick="navegarVista('whatsapp')"/>
        <div>
          <div style="font-size:13.5px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com <span style="background:#00a884;color:#fff;font-size:9px;padding:2px 6px;border-radius:4px;">WHATSAPP CTPMN</span></div>
          <div style="font-size:10px;color:#38bdf8;"><b>${s.nombre}</b> • ${s.rol}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;">
        <button onclick="navegarVista('whatsapp')" style="background:#00a884;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;">💬 Abrir Chats WhatsApp</button>
        <button onclick="cerrarSesionTotal()" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    sub.innerHTML = `
      <button data-vista="whatsapp" class="bds-subnav-item active">💬 1. Chats WhatsApp (Canales A/B)</button>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    document.body.prepend(shell);
    document.body.prepend(sub);
    document.body.prepend(hdr);

    window.navegarVista = function(v) {
      if (v === 'whatsapp') renderWhatsAppInstitucional(shell);
    };

    renderWhatsAppInstitucional(shell);
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else mostrarLoginEstricto();
  });
})();