(function () {
  const SESSION_KEY = "bds_auth_gate_v157_buhoreal";
  const CHAT_STORAGE_KEY = "bds_whatsapp_channels_v157";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true, icono: "🎒", color: "#0284c7" },
    { rol: "Docente MEP", requiereSeccion: true, icono: "👨‍🏫", color: "#059669" },
    { rol: "Director(a)", requiereSeccion: false, icono: "🏛️", color: "#7c3aed" },
    { rol: "SuperAdmin", requiereSeccion: false, icono: "👑", color: "#f59e0b" }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="155" height="36"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  
  // BÚHO AZUL VERDADERO VECTORIZADO (EXACTO A LA REFERENCIA OFICIAL)
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0b1528"/></linearGradient><linearGradient id="ears" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#bg)" stroke="#38bdf8" stroke-width="3"/><polygon points="20,28 35,42 22,50" fill="url(#ears)"/><polygon points="80,28 65,42 78,50" fill="url(#ears)"/><path d="M26 44 C26 30 38 24 50 24 C62 24 74 30 74 44 C74 62 62 76 50 76 C38 76 26 62 26 44 Z" fill="#050b14"/><circle cx="37" cy="46" r="13" fill="#ffffff" stroke="#10b981" stroke-width="3"/><circle cx="63" cy="46" r="13" fill="#ffffff" stroke="#10b981" stroke-width="3"/><circle cx="37" cy="46" r="5" fill="#020617"/><circle cx="63" cy="46" r="5" fill="#020617"/><polygon points="50,50 43,62 57,62" fill="#10b981"/><text x="50" y="88" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="9.5">CTPMN</text></svg>`);

  let audioCtx = null;
  function playTone() {
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
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-chat-float-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto();
  }

  function inyectarCSSGate() {
    if (document.getElementById('bds-v157-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v157-css';
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
    `;
    document.body.appendChild(st);
  }

  window.mostrarLoginEstricto = function () {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v157');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v157';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at top,#0f2942 0%,#060c17 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
        <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:10px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="54" height="54" alt="Búho Azul Original"/>
          <img src="${SVG_MEP}" height="34" alt="MEP" style="border-radius:6px;"/>
        </div>
        <div style="text-align:center;margin-bottom:14px;">
          <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
          <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Identidad Original & Chats Flotantes • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v157" style="display:flex;flex-direction:column;gap:9px;">
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Correo Institucional / Google Auth:</label>
            <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Nombre Completo:</label>
            <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
          </div>
          <button type="submit" style="margin-top:6px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
            🔐 Ingresar a la Plataforma
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v157').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const esMax = (mail === 'maxi.salsa@gmail.com');

      setSesion({
        id: esMax ? 'SUPERADMIN-MAX' : ('USER-' + Date.now()),
        nombre: nom,
        email: mail,
        rol: esMax ? 'SuperAdmin' : 'Estudiante',
        seccion: 'Sección 10-3'
      });

      gate.remove();
      activarPlataformaAutenticada();
    };
  };

  // ============================================================================
  // MODAL FLOTANTE DE CHATS WHATSAPP INSTITUCIONAL (BOTÓN SUPERIOR)
  // ============================================================================
  function abrirModalChatsFlotantes() {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    const CANALES = [
      { id: 'a', nombre: `Sección ${secBase} • Subgrupo A`, sub: "Especialidad 1 (Desarrollo Web)", unread: 2, msgs: [{ rem: "Prof. Coordinador", hora: "07:30 AM", txt: "Bienvenidos al canal del Subgrupo A." }] },
      { id: 'b', nombre: `Sección ${secBase} • Subgrupo B`, sub: "Especialidad 2 (Ciberseguridad)", unread: 0, msgs: [{ rem: "Prof. Laboratorio", hora: "07:35 AM", txt: "Canal Subgrupo B activo." }] },
      { id: 'dir', nombre: "🏛️ Dirección & Jefatura CTPMN", sub: "Avisos Oficiales Circuito 04", unread: 1, msgs: [{ rem: "Dirección", hora: "07:00 AM", txt: "Circular institucional sincronizada." }] }
    ];
    let activoId = 'a';

    const modal = document.createElement('div');
    modal.id = 'bds-chat-float-modal';
    modal.style.cssText = 'position:fixed;top:62px;right:14px;z-index:250000;width:400px;max-width:92vw;background:#111b21;border:1.5px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.9);display:flex;flex-direction:column;height:460px;';

    function pintarModalChat() {
      const cObj = CANALES.find(x => x.id === activoId) || CANALES[0];
      const storageKey = `bds_wa_float_${cObj.id}`;
      let msgs = [];
      try { msgs = JSON.parse(localStorage.getItem(storageKey)) || cObj.msgs; } catch { msgs = cObj.msgs; }

      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
          <div>
            <div style="font-weight:900;color:#e9edef;font-size:14px;">💬 Chats Institucionales CTPMN</div>
            <div style="font-size:10.5px;color:#8696a0;">Canal: ${cObj.nombre}</div>
          </div>
          <button id="fc-close" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
        </div>
        <div style="display:flex;gap:4px;background:#0b141a;padding:6px;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${CANALES.map(c => `<button data-fid="${c.id}" class="btn-fc-tab" style="background:${c.id===activoId?'#005c4b':'#202c33'};color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${c.nombre}</button>`).join('')}
        </div>
        <div id="fc-msgs" style="background:#0b141a;padding:12px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          ${msgs.map(m => `
            <div style="display:flex;flex-direction:column;align-items:${m.remitente===s.nombre?'flex-end':'flex-start'};">
              <div style="font-size:9.5px;color:#8696a0;margin-bottom:2px;">${m.remitente}</div>
              <div style="background:${m.remitente===s.nombre?'#005c4b':'#202c33'};color:#e9edef;padding:8px 12px;border-radius:8px;max-width:85%;font-size:12.5px;">
                ${m.txt}
                <div style="font-size:9px;color:#8696a0;text-align:right;margin-top:2px;">${m.hora} ✓✓</div>
              </div>
            </div>
          `).join('')}
        </div>
        <form id="fc-form" style="background:#202c33;padding:10px;display:flex;gap:6px;">
          <input id="fc-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:8px 12px;border-radius:6px;font-size:12px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:8px 14px;border-radius:6px;font-weight:900;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('fc-close').onclick = () => modal.remove();
      modal.querySelectorAll('.btn-fc-tab').forEach(b => {
        b.onclick = () => { activoId = b.getAttribute('data-fid'); pintarModalChat(); };
      });
      const bSc = document.getElementById('fc-msgs');
      if (bSc) bSc.scrollTop = bSc.scrollHeight;

      document.getElementById('fc-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('fc-in'); const txt = inp.value.trim();
        if (!txt) return;
        const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        msgs.push({ remitente: s.nombre, hora, txt });
        localStorage.setItem(storageKey, JSON.stringify(msgs));
        playTone();
        pintarModalChat();
      };
    }

    document.body.appendChild(modal);
    pintarModalChat();
  }

  // ============================================================================
  // ACTIVACIÓN DE LA PLATAFORMA V157.0 (CON BÚHO AZUL ORIGINAL Y BOTÓN DE CHAT FLOTANTE)
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
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho Azul Original" style="height:36px;width:36px;cursor:pointer;" onclick="location.reload()"/>
        <div>
          <div style="font-size:13.5px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com <span style="background:#00a884;color:#fff;font-size:9px;padding:2px 6px;border-radius:4px;">BÚHO ORIGINAL</span></div>
          <div style="font-size:10px;color:#38bdf8;"><b>${s.nombre}</b> • ${s.rol}</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;">
        <button id="btn-float-chat" style="background:#00a884;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:5px;">
          💬 Chats CTPMN
        </button>
        <button onclick="cerrarSesionTotal()" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';
    shell.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:22px;text-align:center;max-width:720px;margin:30px auto;">
        <img src="${SVG_BUHO_ORIGINAL}" width="72" height="72" alt="Búho" style="margin-bottom:12px;"/>
        <h2 style="color:#38bdf8;margin-top:0;font-size:22px;">Identidad de Marca Soberana & Búho Azul Original</h2>
        <p style="color:#cbd5e1;font-size:13.5px;line-height:1.5;">La landing pública y las herramientas interactivas están limpias y ordenadas. Haz clic en el botón superior <b>💬 Chats CTPMN</b> para abrir los canales de comunicación flotantes en cualquier momento sin perder tu pantalla de estudio.</p>
        <button onclick="abrirModalChatsFlotantes()" style="background:#00a884;color:#fff;border:none;padding:11px 20px;border-radius:10px;font-weight:900;cursor:pointer;font-size:13.5px;margin-top:10px;">Abrir Chats Institucionales Ahora 💬</button>
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);

    document.getElementById('btn-float-chat').onclick = abrirModalChatsFlotantes;
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else mostrarLoginEstricto();
  });
})();