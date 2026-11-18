(function () {
  const SESSION_KEY = "bds_auth_gate_v162_perfect";
  const CHAT_REGISTRY_KEY = "bds_whatsapp_dynamic_registry_v162";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=162";
  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 52" width="150" height="32"><rect width="240" height="52" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/><circle cx="26" cy="26" r="15" fill="#1d4ed8"/><text x="26" y="30" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="800" font-size="11">MEP</text><text x="50" y="23" fill="#f8fafc" font-family="system-ui" font-weight="700" font-size="11">Ministerio de Educación Pública</text><text x="50" y="38" fill="#94a3b8" font-family="system-ui" font-weight="600" font-size="9.5">CTP Mercedes Norte • Circuito 04</text></svg>`);
  const GOOGLE_SVG = `<svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

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
    ['bds-pro-header', 'bds-chat-float-modal'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginSobrio();
  }

  function actualizarFaviconOficial() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.type = 'image/svg+xml'; link.href = SVG_BUHO_ORIGINAL;
  }

  function inyectarCSS() {
    if (document.getElementById('bds-v162-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v162-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
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

  // ============================================================================
  // PANTALLA DE LOGIN CLÁSICA (CON EL BÚHO AZUL ORIGINAL EXACTO)
  // ============================================================================
  window.mostrarLoginSobrio = function () {
    inyectarCSS();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v162');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v162';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:400px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="68" height="68" alt="Búho Azul Original" style="margin-bottom:10px;filter:drop-shadow(0 4px 12px rgba(34,211,238,0.35));"/>
          <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Plataforma Educativa Técnica • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v162" style="display:flex;flex-direction:column;gap:11px;">
          <div>
            <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Correo Institucional o Gmail</label>
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
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}">${r.rol}</option>`).join('')}
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
          <button type="button" id="btn-google-auth" style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
            ${GOOGLE_SVG} <span>Continuar con Google</span>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v162').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;
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

    document.getElementById('btn-google-auth').onclick = () => {
      document.getElementById('f-login-v162').requestSubmit();
    };
  };

  // ============================================================================
  // CENTRO DE CHATS FLOTANTE CON CREACIÓN DINÁMICA DE CANALES Y SUBGRUPOS
  // ============================================================================
  function abrirModalChatsDinamicamente() {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    let canalesDefecto = [
      { id: `sec_${secBase}_A`, nombre: `Sección ${secBase} • Subgrupo A (Especialidad 1)`, msgs: [{ rem: "Coordinación", hora: "07:30", txt: "Canal oficial Subgrupo A activo." }] },
      { id: `sec_${secBase}_B`, nombre: `Sección ${secBase} • Subgrupo B (Especialidad 2)`, msgs: [{ rem: "Coordinación", hora: "07:35", txt: "Canal oficial Subgrupo B activo." }] },
      { id: "dir", nombre: "🏛️ Dirección & Jefatura CTPMN", msgs: [{ rem: "Dirección", hora: "07:00", txt: "Avisos oficiales y circulares del Circuito 04." }] }
    ];

    function obtenerCanales() {
      try {
        const guardado = JSON.parse(localStorage.getItem(CHAT_REGISTRY_KEY));
        if (Array.isArray(guardado) && guardado.length > 0) return guardado;
      } catch {}
      return canalesDefecto;
    }

    function guardarCanales(arr) {
      try { localStorage.setItem(CHAT_REGISTRY_KEY, JSON.stringify(arr)); } catch {}
    }

    let canales = obtenerCanales();
    let actId = canales[0].id;

    const modal = document.createElement('div');
    modal.id = 'bds-chat-float-modal';
    modal.style.cssText = 'position:fixed;top:60px;right:16px;z-index:250000;width:400px;max-width:92vw;background:#111b21;border:1px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.9);display:flex;flex-direction:column;height:480px;';

    function pintarModal() {
      canales = obtenerCanales();
      const cObj = canales.find(x => x.id === actId) || canales[0];
      const storageKey = `bds_wa_dyn_msg_${cObj.id}`;
      let msgs = cObj.msgs;
      try { msgs = JSON.parse(localStorage.getItem(storageKey)) || cObj.msgs; } catch {}

      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
          <div>
            <div style="font-weight:900;color:#e9edef;font-size:14px;">💬 Chats CTPMN & Canales Dinámicos</div>
            <div style="font-size:10.5px;color:#8696a0;">Canal activo: ${cObj.nombre}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button id="cm-add-chat" title="Crear nuevo canal o subgrupo" style="background:#00a884;color:#111b21;border:none;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:900;cursor:pointer;">+ Nuevo</button>
            <button id="cm-close" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✕</button>
          </div>
        </div>

        <div style="display:flex;gap:4px;padding:6px;background:#0b141a;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${canales.map(x => `<button data-cid="${x.id}" class="cm-tab" style="background:${x.id===actId?'#005c4b':'#202c33'};color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${x.nombre}</button>`).join('')}
        </div>

        <div id="cm-msgs" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;background:#0b141a;">
          ${msgs.map(m => `
            <div style="display:flex;flex-direction:column;align-items:${m.rem===s.nombre?'flex-end':'flex-start'};">
              <div style="font-size:9.5px;color:#8696a0;margin-bottom:2px;font-weight:600;">${m.rem}</div>
              <div style="background:${m.rem===s.nombre?'#005c4b':'#202c33'};color:#e9edef;padding:8px 12px;border-radius:8px;max-width:85%;font-size:12.5px;">
                ${m.txt}
                <div style="font-size:9px;color:#8696a0;text-align:right;margin-top:2px;">${m.hora} ✓✓</div>
              </div>
            </div>
          `).join('')}
        </div>

        <form id="cm-form" style="padding:10px;background:#202c33;display:flex;gap:6px;">
          <input id="cm-in" type="text" placeholder="Escribe un mensaje al canal..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:8px 10px;border-radius:6px;font-size:12px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:8px 14px;border-radius:6px;font-weight:900;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('cm-close').onclick = () => modal.remove();
      document.getElementById('cm-add-chat').onclick = () => {
        const nuevoNombre = prompt("Nombre del nuevo canal o subgrupo (ej: Sección 11-2 • Especialidad Redes):");
        if (nuevoNombre) {
          const idNew = 'chat_' + Date.now();
          canales.push({ id: idNew, nombre: nuevoNombre, msgs: [{ rem: "Sistema", hora: new Date().toLocaleTimeString('es-CR', {hour:'2-digit', minute:'2-digit'}), txt: `Canal ${nuevoNombre} creado con éxito.` }] });
          guardarCanales(canales);
          actId = idNew;
          pintarModal();
        }
      };

      modal.querySelectorAll('.cm-tab').forEach(b => {
        b.onclick = () => { actId = b.getAttribute('data-cid'); pintarModal(); };
      });

      const bSc = document.getElementById('cm-msgs');
      if (bSc) bSc.scrollTop = bSc.scrollHeight;

      document.getElementById('cm-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('cm-in'); const txt = inp.value.trim();
        if (!txt) return;
        const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        msgs.push({ rem: s.nombre, hora, txt });
        localStorage.setItem(storageKey, JSON.stringify(msgs));
        playTone();
        pintarModal();
      };
    }

    document.body.appendChild(modal);
    pintarModal();
  }

  // ============================================================================
  // BARRA SUPERIOR SOBERANA Y FORMAL
  // ============================================================================
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
        <img src="${SVG_BUHO_ORIGINAL}" width="34" height="34" alt="pracTICAtecnica.com" style="border-radius:50%;cursor:pointer;" onclick="location.reload()"/>
        <div style="cursor:pointer;" onclick="location.reload()">
          <div style="font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;"><b>${s.nombre}</b> • ${s.rol} (${s.seccion})</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="btn-com-float" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          💬 Chats CTPMN
        </button>
        <button id="btn-logout-sobrio" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    document.body.prepend(hdr);
    document.getElementById('btn-com-float').onclick = abrirModalChatsDinamicamente;
    document.getElementById('btn-logout-sobrio').onclick = cerrarSesionTotal;
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarEstilos();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarPlataforma();
    else mostrarLoginSobrio();
  });
})();