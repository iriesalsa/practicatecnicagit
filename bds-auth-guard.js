(function () {
  const SESSION_KEY = "bds_auth_gate_v169_sovereign";
  const CHAT_REGISTRY_KEY = "bds_whatsapp_sovereign_registry_v169";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=169";
  const RULETA_SECTORES = [
    { id: "talleres", name: "Talleres Exploratorios (7°-9°)", short: "Exploratorios", color: "#ea580c" },
    { id: "web", name: "Desarrollo Web & Ciberseguridad", short: "Web y Ciber", color: "#4f46e5" },
    { id: "mopt", name: "Prueba Teórica MOPT / COSEVI", short: "Prueba MOPT", color: "#0284c7" },
    { id: "excel", name: "Excel, Ofimática & Contabilidad", short: "Excel y Conta", color: "#059669" },
    { id: "identidad", name: "Identidad CTPMN & Marca", short: "Identidad", color: "#7c3aed" },
    { id: "habitos", name: "Hábitos Kaizen, DUA & REAC", short: "Hábitos/Kaizen", color: "#0d9488" },
    { id: "especialidades", name: "Subáreas & Unidades Técnicas", short: "Subáreas CTP", color: "#2563eb" },
    { id: "math", name: "Matemáticas & Admisión UCR/TEC", short: "Mate y UCR/TEC", color: "#16a34a" },
    { id: "english_spanish", name: "Inglés & Español MEP", short: "Inglés/Español", color: "#d97706" },
    { id: "science", name: "Ciencias (Química, Física, Bio)", short: "Ciencias", color: "#dc2626" }
  ];

  function validarCorreoEstricto(correo) {
    const c = (correo || '').toLowerCase().trim();
    // Exigir dominios reales institucionales o Gmail legítimos
    const regex = /^[a-z0-9._%+-]+@(est\.mep\.go\.cr|mep\.go\.cr|gmail\.com)$/;
    if (!regex.test(c)) return false;
    // Bloquear correos con caracteres aleatorios o nombres de prueba obvios
    if (c.includes('asfsd') || c.includes('asdasd') || c.includes('qwerty') || c.includes('testtest')) return false;
    return true;
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
    ['bds-pro-header', 'bds-app-shell', 'bds-chat-float-modal'].forEach(id => {
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
    if (document.getElementById('bds-v169-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v169-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; background: #070d19 !important; color: #f1f5f9 !important; margin: 0; padding: 0; }
      body:not(.bds-authenticated) #root { display: none !important; }
      body.bds-authenticated #root { display: block !important; }
      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 18, 32, 0.98); backdrop-filter: blur(10px);
        border-bottom: 1px solid #1e293b; padding: 8px 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      #bds-app-shell { max-width: 1240px; margin: 0 auto; padding: 14px 12px 96px; box-sizing: border-box; }
      .bds-card-pro { background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginSobrio = function () {
    inyectarCSS();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v169');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v169';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:400px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="68" height="68" alt="Búho Azul Original" style="margin-bottom:10px;filter:drop-shadow(0 4px 12px rgba(34,211,238,0.35));"/>
          <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Plataforma Educativa Técnica • CTP Mercedes Norte</p>
        </div>

        <div id="auth-err" style="display:none;background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:9px;border-radius:8px;font-size:12px;margin-bottom:12px;text-align:center;font-weight:600;"></div>

        <form id="f-login-v169" style="display:flex;flex-direction:column;gap:11px;">
          <div>
            <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Correo Institucional (@est.mep.go.cr) o Gmail</label>
            <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11.5px;color:#cbd5e1;font-weight:500;margin-bottom:4px;">Nombre Completo</label>
            <input id="lg-nom" type="text" placeholder="Nombre y apellidos" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#f8fafc;font-size:13px;"/>
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
            Autenticar con Google Auth
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v169').onsubmit = (e) => {
      e.preventDefault();
      const mail = document.getElementById('lg-mail').value.trim();
      const nom = document.getElementById('lg-nom').value.trim();
      const rolSel = document.getElementById('lg-rol').value;
      const secSel = document.getElementById('lg-sec').value;
      const errBox = document.getElementById('auth-err');

      if (!validarCorreoEstricto(mail)) {
        errBox.style.display = 'block';
        errBox.innerText = '❌ Acceso denegado: Debe utilizar un correo real y válido (@est.mep.go.cr, @mep.go.cr o @gmail.com). No se permiten correos inventados.';
        return;
      }
      errBox.style.display = 'none';

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
  };

  function abrirModalChatsDinamicamente() {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    let canalesDefecto = [];
    SECCIONES_COLEGIO.forEach(sc => {
      canalesDefecto.push({ id: `sec_${sc}_A`, nombre: `Sección ${sc} • Subgrupo A`, msgs: [{ rem: "Coordinación", hora: "07:30", txt: `Canal oficial Subgrupo A de la sección ${sc}.` }] });
      canalesDefecto.push({ id: `sec_${sc}_B`, nombre: `Sección ${sc} • Subgrupo B`, msgs: [{ rem: "Coordinación", hora: "07:35", txt: `Canal oficial Subgrupo B de la sección ${sc}.` }] });
    });
    canalesDefecto.push({ id: "dir", nombre: "🏛️ Dirección & Jefatura CTPMN", msgs: [{ rem: "Dirección", hora: "07:00", txt: "Avisos oficiales del Circuito 04." }] });

    function obtenerCanales() {
      try {
        const guardado = JSON.parse(localStorage.getItem(CHAT_REGISTRY_KEY));
        if (Array.isArray(guardado) && guardado.length > 0) return guardado;
      } catch {}
      return canalesDefecto;
    }

    let canales = obtenerCanales();
    let actId = canales.find(c => c.id === `sec_${secBase}_A`) ? `sec_${secBase}_A` : canales[0].id;

    const modal = document.createElement('div');
    modal.id = 'bds-chat-float-modal';
    modal.style.cssText = 'position:fixed;top:60px;right:16px;z-index:250000;width:400px;max-width:92vw;background:#111b21;border:1px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.9);display:flex;flex-direction:column;height:480px;';

    function pintarModal() {
      canales = obtenerCanales();
      const cObj = canales.find(x => x.id === actId) || canales[0];
      const storageKey = `bds_wa_sov_msg_${cObj.id}`;
      let msgs = cObj.msgs;
      try { msgs = JSON.parse(localStorage.getItem(storageKey)) || cObj.msgs; } catch {}

      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
          <div>
            <div style="font-weight:900;color:#e9edef;font-size:14px;">💬 Chats CTPMN (Todos los Niveles y Subgrupos)</div>
            <div style="font-size:10.5px;color:#8696a0;">Canal: ${cObj.nombre}</div>
          </div>
          <button id="cm-close" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
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
          <input id="cm-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:8px 10px;border-radius:6px;font-size:12px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:8px 14px;border-radius:6px;font-weight:900;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('cm-close').onclick = () => modal.remove();
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
        pintarModal();
      };
    }

    document.body.appendChild(modal);
    pintarModal();
  }

  // ============================================================================
  // PANTALLA PRINCIPAL: CENTRO DE COMANDO PWA SOBERANO
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
        <img src="${SVG_BUHO_ORIGINAL}" width="34" height="34" alt="Búho Azul Original" style="border-radius:50%;cursor:pointer;" onclick="location.reload()"/>
        <div style="cursor:pointer;" onclick="location.reload()">
          <div style="font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:11px;color:#94a3b8;"><b>${s.nombre}</b> • ${s.rol} (${s.seccion})</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
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
            <span style="background:#10b981;color:#022c22;font-size:10px;font-weight:900;padding:3px 8px;border-radius:5px;">SISTEMA PWA SOBERANO ACTIVO</span>
            <h2 style="margin:4px 0 2px;font-size:19px;color:#fff;">Centro de Comando Institucional pracTICAtecnica.com</h2>
            <p style="margin:0;font-size:12px;color:#cbd5e1;">Acceso directo al banco de 100 ítems, simulacros cronometrados y canales de chat en vivo.</p>
          </div>
        </div>
      </div>

      <h3 style="margin:0 0 10px;font-size:16px;color:#38bdf8;">📚 Áreas Académicas, Técnicas y de Admisión:</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
        ${RULETA_SECTORES.map(sec => `
          <div class="bds-card-pro" style="border-top:4px solid ${sec.color};">
            <div>
              <span style="background:${sec.color};color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">${sec.short}</span>
              <h4 style="margin:8px 0 6px;font-size:15px;color:#fff;">${sec.name}</h4>
              <p style="margin:0 0 12px;font-size:11.5px;color:#94a3b8;line-height:1.4;">Jerarquía MEP: Especialidad > Subárea > Nivel > Unidad.</p>
            </div>
            <button onclick="alert('Cargando banco de práctica para ${sec.name}...');" style="width:100%;background:#0284c7;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">🎯 Abrir Módulo de Práctica</button>
          </div>
        `).join('')}
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);
    document.getElementById('btn-com-float').onclick = abrirModalChatsDinamicamente;
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSS();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarPlataforma();
    else mostrarLoginSobrio();
  });
})();