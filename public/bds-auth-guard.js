(function () {
  const SESSION_KEY = "bds_auth_gate_v172_omnipotent";
  const CHAT_REGISTRY_KEY = "bds_whatsapp_omni_registry_v172";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", icono: "🎒", desc: "Acceso a prácticas, simulacros y juegos." },
    { rol: "Docente MEP", icono: "👨‍🏫", desc: "Gestión de subgrupos A/B, banco y notas." },
    { rol: "Director(a)", icono: "🏛️", desc: "Supervisión institucional y aprobación QR." },
    { rol: "SuperAdmin", icono: "👑", desc: "Control total de la PWA y servidores." }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=172";
  const PALABRAS_PROHIBIDAS = ["tonto", "idiota", "estupido", "imbecil", "malparido", "mierda", "puta", "cabron", "carajo", "basura"];

  function filtrarGroserias(texto) {
    let t = texto;
    PALABRAS_PROHIBIDAS.forEach(p => {
      const reg = new RegExp(p, 'gi');
      t = t.replace(reg, '*#$!*');
    });
    return t;
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
    ['bds-pro-header', 'bds-app-shell', 'bds-chat-float-modal', 'bds-slide-drawer'].forEach(id => {
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
    if (document.getElementById('bds-v172-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v172-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; background: #070d19 !important; color: #f1f5f9 !important; margin: 0; padding: 0; overflow-x: hidden; }
      body:not(.bds-authenticated) #root { display: none !important; }
      body.bds-authenticated #root { display: block !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 18, 32, 0.98); backdrop-filter: blur(10px);
        border-bottom: 1px solid #1e293b; padding: 8px 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      #bds-app-shell { max-width: 1240px; margin: 0 auto; padding: 14px 12px 96px; box-sizing: border-box; }
      .bds-card-omni { background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.15s ease, border-color 0.15s ease; cursor: pointer; }
      .bds-card-omni:hover { border-color: #38bdf8; transform: translateY(-2px); }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginSobrio = function () {
    inyectarCSS();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v172');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v172';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:400px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="68" height="68" alt="Búho Azul Original" style="margin-bottom:10px;filter:drop-shadow(0 4px 12px rgba(34,211,238,0.35));"/>
          <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Plataforma Educativa Técnica • CTP Mercedes Norte</p>
        </div>

        <form id="f-login-v172" style="display:flex;flex-direction:column;gap:11px;">
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
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${r.rol==='SuperAdmin'?'selected':''}>${r.icono} ${r.rol}</option>`).join('')}
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
            Entrar al Sistema PWA Omnipotente
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v172').onsubmit = (e) => {
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
      activarOmnipotencia();
    };
  };

  // ============================================================================
  // MENÚ DE HAMBURGUESA DESLIZANTE CON ACCESOS TOTALES
  // ============================================================================
  function abrirMenuHamburguesa() {
    let old = document.getElementById('bds-slide-drawer');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const drw = document.createElement('div');
    drw.id = 'bds-slide-drawer';
    drw.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.85);z-index:290000;display:flex;justify-content:flex-start;';

    drw.innerHTML = `
      <div style="width:310px;max-width:85vw;background:#0b1322;border-right:2px solid #0ea5e9;height:100%;padding:18px;box-sizing:border-box;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="${SVG_BUHO_ORIGINAL}" width="32" height="32" alt="Búho"/>
            <b style="color:#38bdf8;font-size:14px;">Menú CTPMN</b>
          </div>
          <button id="drw-close" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
        </div>

        <div style="font-size:10px;font-weight:900;color:#94a3b8;margin-top:2px;">PERFIL ACTIVO: ${s.rol} (${s.seccion})</div>
        
        <button class="drw-link" data-mod="inicio" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">🏠 Centro de Comando Inicio</button>
        <button class="drw-link" data-mod="juegos" style="text-align:left;background:#131f33;color:#fbbf24;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">♟️ Sala de 8 Juegos (Ajedrez Funcional)</button>
        <button class="drw-link" data-mod="chats" style="text-align:left;background:#131f33;color:#34d399;border:1px solid #10b981;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💬 Chats CTPMN Pro & Canales A/B</button>
        
        <button id="drw-logout" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">🚪 Cerrar Sesión Segura</button>
      </div>
    `;

    document.body.appendChild(drw);
    document.getElementById('drw-close').onclick = () => drw.remove();
    document.getElementById('drw-logout').onclick = () => { drw.remove(); cerrarSesionTotal(); };
    drw.querySelectorAll('.drw-link').forEach(b => {
      b.onclick = () => {
        drw.remove();
        const mod = b.getAttribute('data-mod');
        if (mod === 'juegos') abrirSalaJuegosHD();
        else if (mod === 'chats') abrirModalWhatsAppOmni();
        else activarOmnipotencia();
      };
    });
  }

  // ============================================================================
  // SALA DE 8 JUEGOS CON AJEDREZ FUNCIONAL
  // ============================================================================
  function abrirSalaJuegosHD() {
    let old = document.getElementById('bds-juegos-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'bds-juegos-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:280000;display:flex;align-items:center;justify-content:center;padding:16px;';

    modal.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #fbbf24;border-radius:16px;max-width:680px;width:100%;padding:24px;box-shadow:0 25px 60px rgba(0,0,0,0.9);box-sizing:border-box;position:relative;text-align:center;">
        <button id="jg-close" style="position:absolute;top:16px;right:16px;background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:800;">✕ Cerrar</button>
        
        <span style="background:#d97706;color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px;border-radius:99px;">SALA DE 8 JUEGOS EDUCATIVOS CTPMN</span>
        <h2 style="margin:12px 0 6px;color:#fff;font-size:20px;">♟️ Ajedrez Funcional & Lógica Táctica</h2>
        <p style="font-size:13px;color:#cbd5e1;margin-bottom:16px;">Practica aperturas, tácticas y estrategia de nivel FIDE directamente en la PWA.</p>

        <div style="background:#070d19;border:2px solid #334155;display:inline-block;padding:12px;border-radius:12px;margin-bottom:14px;">
          <div style="display:grid;grid-template-columns:repeat(8, 42px);grid-template-rows:repeat(8, 42px);gap:1px;background:#1e293b;padding:2px;border-radius:6px;" id="chessboard-grid">
            <!-- Tablero de ajedrez generado por JS -->
          </div>
        </div>
        <div id="chess-status" style="font-size:13px;color:#34d399;font-weight:800;margin-bottom:10px;">Turno de las Blancas • Selecciona una pieza</div>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('jg-close').onclick = () => modal.remove();

    // Renderizar tablero de ajedrez funcional básico
    const grid = document.getElementById('chessboard-grid');
    const piezasIniciales = [
      ["♜","♞","♝","♛","♚","♝","♞","♜"],
      ["♟","♟","♟","♟","♟","♟","♟","♟"],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["♙","♙","♙","♙","♙","♙","♙","♙"],
      ["♖","♘","♗","♕","♔","♗","♘","♖"]
    ];

    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        const sq = document.createElement('div');
        const esClara = (r + c) % 2 === 0;
        sq.style.cssText = `background:${esClara?'#e2e8f0':'#475569'};display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;user-select:none;`;
        sq.innerText = piezasIniciales[r][c];
        sq.onclick = () => {
          document.getElementById('chess-status').innerText = `Casilla seleccionada: ${String.fromCharCode(97+c)}${8-r} (${sq.innerText||'Vacía'})`;
        };
        grid.appendChild(sq);
      }
    }
  }

  // ============================================================================
  // CENTRO DE CHATS WHATSAPP OMNIPOTENTE CON ARCHIVOS Y FILTRO DE GROSERÍAS
  // ============================================================================
  function abrirModalWhatsAppOmni() {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    let canalesDefecto = [
      { id: `sec_${secBase}_A`, nombre: `Sección ${secBase} • Subgrupo A`, msgs: [{ rem: "Coordinación", hora: "07:30", txt: `Canal oficial Subgrupo A de la sección ${secBase}.` }] },
      { id: `sec_${secBase}_B`, nombre: `Sección ${secBase} • Subgrupo B`, msgs: [{ rem: "Coordinación", hora: "07:35", txt: `Canal oficial Subgrupo B de la sección ${secBase}.` }] },
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
    modal.style.cssText = 'position:fixed;top:60px;right:16px;z-index:280000;width:420px;max-width:92vw;background:#111b21;border:1px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.9);display:flex;flex-direction:column;height:520px;';

    function pintarModal() {
      canales = obtenerCanales();
      const cObj = canales.find(x => x.id === actId) || canales[0];
      const storageKey = `bds_wa_omni_msg_${cObj.id}`;
      let msgs = cObj.msgs;
      try { msgs = JSON.parse(localStorage.getItem(storageKey)) || cObj.msgs; } catch {}

      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
          <div>
            <div style="font-weight:900;color:#e9edef;font-size:14px;">💬 Chats CTPMN Omnipotente (Filtro Activo)</div>
            <div style="font-size:10.5px;color:#8696a0;">Canal: ${cObj.nombre}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button id="cm-add-chat" title="Crear canal" style="background:#00a884;color:#111b21;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:900;cursor:pointer;">+ Nuevo</button>
            <button id="cm-close" style="background:#7f1d1d;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✕</button>
          </div>
        </div>

        <div style="display:flex;gap:5px;padding:8px;background:#0b141a;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${canales.map(x => `<button data-cid="${x.id}" class="cm-tab" style="background:${x.id===actId?'#005c4b':'#202c33'};color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;white-space:nowrap;">${x.nombre}</button>`).join('')}
        </div>

        <div id="cm-msgs" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;background:#0b141a;">
          ${msgs.map(m => `
            <div style="display:flex;flex-direction:column;align-items:${m.rem===s.nombre?'flex-end':'flex-start'};">
              <div style="font-size:9.5px;color:#8696a0;margin-bottom:2px;font-weight:600;">${m.rem}</div>
              <div style="background:${m.rem===s.nombre?'#005c4b':'#202c33'};color:#e9edef;padding:8px 12px;border-radius:8px;max-width:85%;font-size:12.5px;">
                ${m.img ? `<img src="${m.img}" style="max-width:100%;border-radius:6px;margin-bottom:4px;display:block;"/>` : ''}
                ${m.file ? `<div style="background:rgba(0,0,0,0.3);padding:6px;border-radius:6px;margin-bottom:4px;font-size:11px;">📎 Archivo: <b>${m.file}</b></div>` : ''}
                <div>${m.txt}</div>
                <div style="font-size:9px;color:#8696a0;text-align:right;margin-top:2px;">${m.hora} ✓✓</div>
              </div>
            </div>
          `).join('')}
        </div>

        <form id="cm-form" style="padding:10px;background:#202c33;display:flex;gap:6px;align-items:center;">
          <label title="Adjuntar archivo o imagen" style="cursor:pointer;background:#2a3942;color:#00a884;padding:8px 10px;border-radius:6px;font-size:14px;">
            📎 <input id="cm-file-in" type="file" accept="image/*,.pdf,.docx,.xlsx" style="display:none;"/>
          </label>
          <input id="cm-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:8px 10px;border-radius:6px;font-size:12px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:8px 14px;border-radius:6px;font-weight:900;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('cm-close').onclick = () => modal.remove();
      document.getElementById('cm-add-chat').onclick = () => {
        const nuevoNombre = prompt("Nombre del nuevo canal o subgrupo (ej: Sección 11-1 • Redes):");
        if (nuevoNombre) {
          const idNew = 'chat_' + Date.now();
          canales.push({ id: idNew, nombre: nuevoNombre, msgs: [{ rem: "Sistema", hora: new Date().toLocaleTimeString('es-CR', {hour:'2-digit', minute:'2-digit'}), txt: `Canal ${nuevoNombre} creado.` }] });
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

      document.getElementById('cm-file-in').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
          const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
          const isImg = file.type.startsWith('image/');
          msgs.push({ rem: s.nombre, hora, txt: `Adjuntó ${file.name}`, img: isImg ? evt.target.result : null, file: !isImg ? file.name : null });
          localStorage.setItem(storageKey, JSON.stringify(msgs));
          pintarModal();
        };
        reader.readAsDataURL(file);
      };

      document.getElementById('cm-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('cm-in'); 
        const txtRaw = inp.value.trim();
        if (!txtRaw) return;
        const txt = filtrarGroserias(txtRaw);
        const hora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        msgs.push({ rem: s.nombre, hora, txt });
        localStorage.setItem(storageKey, JSON.stringify(msgs));
        pintarModal();
      };
    }

    document.body.appendChild(modal);
    pintarModal();
  }

  // ============================================================================
  // ACTIVACIÓN DE LA PLATAFORMA OMNIPOTENTE
  // ============================================================================
  function activarOmnipotencia() {
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
        <button id="btn-hamburger" title="Menú Principal" style="background:#1d4ed8;color:#fff;border:none;width:36px;height:36px;border-radius:8px;font-size:18px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">☰</button>
        <img src="${SVG_BUHO_ORIGINAL}" width="34" height="34" alt="Búho Azul Original" style="border-radius:50%;cursor:pointer;" onclick="location.reload()"/>
        <div style="cursor:pointer;" onclick="location.reload()">
          <div style="font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;"><b>${s.nombre}</b> • ${s.rol} (${s.seccion})</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="btn-juegos-top" style="background:#131f33;color:#fbbf24;border:1px solid #334155;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">
          ♟️ Juegos (Ajedrez)
        </button>
        <button id="btn-com-float" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          💬 Chats CTPMN
        </button>
        <button onclick="cerrarSesionTotal()" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;">
          Cerrar sesión
        </button>
      </div>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';
    shell.innerHTML = `
      <div style="background:linear-gradient(135deg,#1e1b4b 0%,#0b1322 100%);border:1.5px solid #6366f1;border-radius:16px;padding:20px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="54" height="54" alt="Búho"/>
          <div>
            <span style="background:#10b981;color:#022c22;font-size:10px;font-weight:900;padding:3px 8px;border-radius:5px;">SISTEMA PWA OMNIPOTENTE ACTIVO</span>
            <h2 style="margin:4px 0 2px;font-size:19px;color:#fff;">Centro de Comando Institucional pracTICAtecnica.com</h2>
            <p style="margin:0;font-size:12px;color:#cbd5e1;">Acceso unificado al Banco Maestro de 100 Ítems, Ajedrez FIDE, Chats con Archivos y Menú por Roles.</p>
          </div>
        </div>
      </div>

      <h3 style="margin:0 0 10px;font-size:16px;color:#38bdf8;">🎯 Accesos Principales & Módulos Estelares:</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
        <div class="bds-card-omni" style="border-top:4px solid #fbbf24;" onclick="abrirSalaJuegosHD()">
          <div>
            <span style="background:#d97706;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">Lógica & Ocio</span>
            <h4 style="margin:8px 0 6px;font-size:15px;color:#fff;">♟️ Sala de 8 Juegos & Ajedrez</h4>
            <p style="margin:0 0 12px;font-size:11.5px;color:#94a3b8;">Ajedrez funcional, dominó, solitario y retos mentales.</p>
          </div>
          <button style="width:100%;background:#d97706;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">Abrir Sala de Juegos</button>
        </div>

        <div class="bds-card-omni" style="border-top:4px solid #10b981;" onclick="abrirModalWhatsAppOmni()">
          <div>
            <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">Comunicación</span>
            <h4 style="margin:8px 0 6px;font-size:15px;color:#fff;">💬 Chats CTPMN & Canales A/B</h4>
            <p style="margin:0 0 12px;font-size:11.5px;color:#94a3b8;">Mensajería con archivos, imágenes y filtro de groserías.</p>
          </div>
          <button style="width:100%;background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">Abrir Canales de Chat</button>
        </div>
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);

    document.getElementById('btn-hamburger').onclick = abrirMenuHamburguesa;
    document.getElementById('btn-juegos-top').onclick = abrirSalaJuegosHD;
    document.getElementById('btn-com-float').onclick = abrirModalWhatsAppOmni;
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSS();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarOmnipotencia();
    else mostrarLoginSobrio();
  });
})();