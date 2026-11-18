(function () {
  const SESSION_KEY = "bds_auth_gate_v176_c02";
  const CHAT_REGISTRY_KEY = "bds_whatsapp_c02_registry_v176";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", icono: "🎒" },
    { rol: "Docente MEP", icono: "👨‍🏫" },
    { rol: "Director(a)", icono: "🏛️" },
    { rol: "SuperAdmin", icono: "👑" }
  ];

  const SVG_BUHO_ORIGINAL = "/buho-original.svg?v=176";
  const LOGO_MEP = "/logo.svg";
  const ESCUDO_CTPMN = "/escudoCTPmercedesnorte.jpeg";

  const PALABRAS_PROHIBIDAS = ["tonto", "idiota", "estupido", "imbecil", "malparido", "mierda", "puta", "cabron", "carajo", "basura"];

  function filtrarGroserias(texto) {
    let t = texto;
    PALABRAS_PROHIBIDAS.forEach(p => {
      const reg = new RegExp(p, 'gi');
      t = t.replace(reg, '*#$!*');
    });
    return t;
  }

  const AREAS_ESTUDIO = [
    { id: "talleres", name: "Talleres Exploratorios (7°-9°)", cat: "Técnico" },
    { id: "web", name: "Desarrollo Web & Ciberseguridad", cat: "Técnico" },
    { id: "mopt", name: "Prueba Teórica MOPT / COSEVI", cat: "General" },
    { id: "english", name: "Inglés Técnico (Grammar, Listening & Speaking)", cat: "Idiomas" },
    { id: "math", name: "Matemáticas & Admisión UCR/TEC", cat: "Académico" },
    { id: "science", name: "Ciencias (Química, Física, Biología)", cat: "Académico" }
  ];

  const BANCO_COMPLETO = {
    talleres: [
      { q: "En un taller exploratorio de electricidad, ¿cuál es la medida de seguridad primordial antes de intervenir un circuito?", o: ["Trabajar descalzo", "Desenergizar la fuente y verificar con multímetro", "Unir fase y neutro", "Mojar los cables"], c: 1, exp: "Desenergizar previene descargas eléctricas letales." }
    ],
    web: [
      { q: "En React y Node.js, ¿qué principio de seguridad se aplica al validar tokens JWT en las rutas de API?", o: ["Confiar en el cliente", "Verificación estricta de firma y expiración en el servidor", "Guardar contraseñas en texto plano", "Desactivar CORS"], c: 1, exp: "Validar en el backend garantiza que el token no haya sido alterado." }
    ],
    mopt: [
      { q: "Según la Ley 9078, ¿cuál es la velocidad máxima permitida frente a centros educativos con estudiantes?", o: ["40 km/h", "25 km/h", "60 km/h", "80 km/h"], c: 1, exp: "La ley establece un límite estricto de 25 km/h en zonas escolares." }
    ],
    english: [
      { q: "[Grammar] Choose the correct form: 'If I ___ a Senior Software Engineer, I would build robust systems.'", o: ["am", "were", "be", "will be"], c: 1, exp: "Second Conditional uses 'were' for all subjects in the hypothetical clause." },
      { q: "[Listening / Speaking] What is the standard professional response when greeting an IT client remotely?", o: ["What do you want?", "Hello, how can I assist you with your system today?", "Go away", "Speak fast"], c: 1, exp: "Polite and professional IT communication establishes immediate rapport." }
    ],
    math: [
      { q: "[UCR/TEC] Si log₂(x) = 5, ¿cuál es el valor numérico de x?", o: ["10", "25", "32", "64"], c: 2, exp: "Por definición de logaritmo: 2^5 = 32." }
    ],
    science: [
      { q: "¿Cuál es la partícula subatómica con carga eléctrica negativa en un átomo?", o: ["Protón", "Neutrón", "Electrón", "Positrón"], c: 2, exp: "Los electrones orbitan el núcleo y poseen carga negativa." }
    ]
  };

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
    ['bds-pro-header', 'bds-app-shell', 'bds-chat-float-modal', 'bds-juegos-modal', 'bds-practica-modal'].forEach(id => {
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
    if (document.getElementById('bds-v176-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v176-css';
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
      #bds-app-shell { max-width: 1200px; margin: 0 auto; padding: 18px 14px 80px; box-sizing: border-box; }
      .bds-card-minimal { background: #0b1322; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; transition: border-color 0.15s ease; cursor: pointer; }
      .bds-card-minimal:hover { border-color: #38bdf8; }
    `;
    document.head.appendChild(st);
  }

  window.mostrarLoginSobrio = function () {
    inyectarCSS();
    actualizarFaviconOficial();
    let old = document.getElementById('bds-login-v176');
    if (old) old.remove();

    const gate = document.createElement('div');
    gate.id = 'bds-login-v176';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f1f3d 0%,#060b16 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto;';

    gate.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:390px;width:100%;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,0.8);box-sizing:border-box;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:10px;">
            <img src="${ESCUDO_CTPMN}" width="54" height="64" alt="Escudo CTPMN" style="object-fit:contain;"/>
            <img src="${SVG_BUHO_ORIGINAL}" width="54" height="54" alt="Búho Azul Original"/>
          </div>
          <h1 style="margin:0;font-size:21px;font-weight:900;letter-spacing:-0.02em;color:#f8fafc;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
          <p style="margin:4px 0 0;font-size:11.5px;color:#94a3b8;">CTP Mercedes Norte • Dir. Reg. Heredia • Circuito 02</p>
        </div>

        <form id="f-login-v176" style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:3px;">Correo Institucional o Gmail</label>
            <input id="lg-mail" type="email" value="maxi.salsa@gmail.com" required autofocus style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px 12px;color:#f8fafc;font-size:13px;"/>
          </div>
          <div>
            <label style="display:block;font-size:11px;color:#cbd5e1;font-weight:500;margin-bottom:3px;">Nombre Completo</label>
            <input id="lg-nom" type="text" value="Ing. Max Salazar Sánchez" required style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px 12px;color:#f8fafc;font-size:13px;"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;font-weight:500;margin-bottom:3px;">Perfil</label>
              <select id="lg-rol" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:8px;color:#f8fafc;font-size:12px;">
                ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${r.rol==='SuperAdmin'?'selected':''}>${r.icono} ${r.rol}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;font-weight:500;margin-bottom:3px;">Sección</label>
              <select id="lg-sec" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:8px;color:#f8fafc;font-size:12px;">
                ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
              </select>
            </div>
          </div>
          <button type="submit" style="margin-top:4px;background:#1d4ed8;color:#ffffff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">
            Entrar al Sistema CTPMN (Circuito 02)
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(gate);

    document.getElementById('f-login-v176').onsubmit = (e) => {
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
      activarCircuito02();
    };
  };

  window.abrirMotorPractica = function(areaId, areaTitle) {
    let old = document.getElementById('bds-practica-modal');
    if (old) old.remove();

    const lista = BANCO_COMPLETO[areaId] || BANCO_COMPLETO.talleres;
    let idx = 0;

    const modal = document.createElement('div');
    modal.id = 'bds-practica-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:280000;display:flex;align-items:center;justify-content:center;padding:16px;';

    function pintar() {
      const it = lista[idx] || lista[0];
      modal.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;max-width:650px;width:100%;padding:22px;box-shadow:0 25px 60px rgba(0,0,0,0.85);box-sizing:border-box;position:relative;">
          <button id="mp-close" style="position:absolute;top:14px;right:14px;background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
          
          <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:99px;">CTPMN CIRCUIO 02 • ${areaTitle}</span>
          <h3 style="margin:10px 0 6px;font-size:16px;color:#fff;">Ítem ${idx + 1} de ${lista.length}</h3>
          <p style="font-size:13.5px;color:#f8fafc;font-weight:600;line-height:1.45;margin-bottom:14px;">${it.q}</p>

          <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
            ${it.o.map((op, i) => `
              <button data-opt="${i}" class="btn-mp-opt" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px 12px;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;">
                ${String.fromCharCode(65+i)}) ${op}
              </button>
            `).join('')}
          </div>

          <div id="mp-exp" style="display:none;padding:10px;border-radius:6px;font-size:12px;line-height:1.4;margin-bottom:12px;"></div>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <button id="mp-prev" ${idx===0?'disabled':''} style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">← Anterior</button>
            <span style="font-size:11.5px;color:#94a3b8;">Evaluación adaptativa CTPMN</span>
            <button id="mp-next" ${idx>=lista.length-1?'disabled':''} style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Siguiente →</button>
          </div>
        </div>
      `;

      document.getElementById('mp-close').onclick = () => modal.remove();
      modal.querySelectorAll('.btn-mp-opt').forEach(b => {
        b.onclick = () => {
          const sel = Number(b.getAttribute('data-opt'));
          const ok = sel === it.c;
          modal.querySelectorAll('.btn-mp-opt').forEach((btn, bIdx) => {
            btn.disabled = true;
            if (bIdx === it.c) { btn.style.background = '#064e3b'; btn.style.borderColor = '#10b981'; }
            else if (bIdx === sel) { btn.style.background = '#7f1d1d'; btn.style.borderColor = '#ef4444'; }
          });
          const box = document.getElementById('mp-exp');
          box.style.display = 'block';
          box.style.background = ok ? '#064e3b' : '#450a0a';
          box.style.color = ok ? '#6ee7b7' : '#fca5a5';
          box.innerHTML = `<b>${ok ? '✅ ¡Correcto!' : '❌ Explicación Pedagógica:'}</b> ${it.exp}`;
        };
      });

      document.getElementById('mp-prev').onclick = () => { if (idx > 0) { idx--; pintar(); } };
      document.getElementById('mp-next').onclick = () => { if (idx < lista.length - 1) { idx++; pintar(); } };
    }

    document.body.appendChild(modal);
    pintar();
  };

  window.abrirSalaJuegosHD = function () {
    let old = document.getElementById('bds-juegos-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'bds-juegos-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:280000;display:flex;align-items:center;justify-content:center;padding:16px;';

    modal.innerHTML = `
      <div style="background:#0b1322;border:1px solid #fbbf24;border-radius:14px;max-width:680px;width:100%;padding:22px;box-shadow:0 25px 60px rgba(0,0,0,0.9);box-sizing:border-box;position:relative;text-align:center;">
        <button id="jg-close" style="position:absolute;top:14px;right:14px;background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
        
        <span style="background:#d97706;color:#fff;font-size:10px;font-weight:900;padding:3px 8px;border-radius:99px;">SALA DE 8 JUEGOS CTPMN</span>
        <h2 style="margin:10px 0 4px;color:#fff;font-size:18px;">♟️ Ajedrez Funcional (Movimiento Real)</h2>
        <p style="font-size:11.5px;color:#cbd5e1;margin-bottom:12px;">Selecciona una pieza y muévela haciendo clic en la casilla de destino.</p>

        <div style="background:#070d19;border:2px solid #334155;display:inline-block;padding:8px;border-radius:10px;margin-bottom:8px;">
          <div style="display:grid;grid-template-columns:repeat(8, 42px);grid-template-rows:repeat(8, 42px);gap:1px;background:#1e293b;padding:2px;border-radius:4px;" id="chessboard-grid"></div>
        </div>
        <div id="chess-status" style="font-size:12px;color:#34d399;font-weight:800;">Turno de las Blancas</div>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('jg-close').onclick = () => modal.remove();

    let tablero = [
      ["♜","♞","♝","♛","♚","♝","♞","♜"],["♟","♟","♟","♟","♟","♟","♟","♟"],
      ["","","","","","","",""],["","","","","","","",""],
      ["","","","","","","",""],["","","","","","","",""],
      ["♙","♙","♙","♙","♙","♙","♙","♙"],["♖","♘","♗","♕","♔","♗","♘","♖"]
    ];
    let seleccion = null;

    function renderTablero() {
      const grid = document.getElementById('chessboard-grid');
      grid.innerHTML = '';
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          const sq = document.createElement('div');
          const esClara = (r + c) % 2 === 0;
          const seleccionado = seleccion && seleccion.r === r && seleccion.c === c;
          sq.style.cssText = `background:${seleccionado?'#f59e0b':(esClara?'#e2e8f0':'#475569')};display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;user-select:none;border-radius:2px;`;
          sq.innerText = tablero[r][c];
          sq.onclick = () => {
            if (!seleccion) {
              if (tablero[r][c] !== "") { seleccion = { r, c }; renderTablero(); }
            } else {
              tablero[r][c] = tablero[seleccion.r][seleccion.c];
              tablero[seleccion.r][seleccion.c] = "";
              seleccion = null;
              renderTablero();
            }
          };
          grid.appendChild(sq);
        }
      }
    }
    renderTablero();
  };

  window.abrirModalWhatsAppMinimal = function () {
    let old = document.getElementById('bds-chat-float-modal');
    if (old) { old.remove(); return; }

    const s = getSesion();
    const secBase = (s.seccion || "Sección 10-3").replace("Sección ", "");

    let canalesDefecto = [
      { id: `sec_${secBase}_A`, nombre: `Subgrupo A`, msgs: [{ rem: "Coordinación", hora: "07:30", txt: "Canal Subgrupo A activo." }] },
      { id: `sec_${secBase}_B`, nombre: `Subgrupo B`, msgs: [{ rem: "Coordinación", hora: "07:35", txt: "Canal Subgrupo B activo." }] },
      { id: "dir", nombre: "Dirección", msgs: [{ rem: "Dirección", hora: "07:00", txt: "Avisos oficiales CTPMN." }] }
    ];

    function getChan() {
      try { const g = JSON.parse(localStorage.getItem(CHAT_REGISTRY_KEY)); if (Array.isArray(g) && g.length > 0) return g; } catch {}
      return canalesDefecto;
    }
    function saveChan(arr) { try { localStorage.setItem(CHAT_REGISTRY_KEY, JSON.stringify(arr)); } catch {} }

    let chans = getChan();
    let actId = chans[0].id;

    const modal = document.createElement('div');
    modal.id = 'bds-chat-float-modal';
    modal.style.cssText = 'position:fixed;top:60px;right:16px;z-index:280000;width:380px;max-width:92vw;background:#111b21;border:1px solid #00a884;border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.85);display:flex;flex-direction:column;height:460px;';

    function pintar() {
      chans = getChan();
      const cObj = chans.find(x => x.id === actId) || chans[0];
      const sk = `bds_wa_c02_msg_${cObj.id}`;
      let msgs = cObj.msgs;
      try { msgs = JSON.parse(localStorage.getItem(sk)) || cObj.msgs; } catch {}

      modal.innerHTML = `
        <div style="background:#202c33;padding:9px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222d34;">
          <span style="font-weight:800;color:#e9edef;font-size:13px;">💬 Chats CTPMN (${cObj.nombre})</span>
          <div style="display:flex;gap:4px;">
            <button id="cm-add" style="background:#00a884;color:#111b21;border:none;padding:3px 7px;border-radius:5px;font-size:10px;font-weight:900;cursor:pointer;">+ Nuevo</button>
            <button id="cm-del" style="background:#7f1d1d;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10px;font-weight:800;cursor:pointer;">🗑️</button>
            <button id="cm-cls" style="background:#475569;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10px;font-weight:800;cursor:pointer;">✕</button>
          </div>
        </div>

        <div style="display:flex;gap:4px;padding:6px;background:#0b141a;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${chans.map(x => `<button data-cid="${x.id}" class="cm-tab" style="background:${x.id===actId?'#005c4b':'#202c33'};color:#fff;border:none;padding:5px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${x.nombre}</button>`).join('')}
        </div>

        <div id="cm-msgs" style="flex:1;padding:10px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;background:#0b141a;">
          ${msgs.map(m => `
            <div style="display:flex;flex-direction:column;align-items:${m.rem===s.nombre?'flex-end':'flex-start'};">
              <div style="font-size:9px;color:#8696a0;margin-bottom:1px;">${m.rem}</div>
              <div style="background:${m.rem===s.nombre?'#005c4b':'#202c33'};color:#e9edef;padding:7px 10px;border-radius:6px;max-width:85%;font-size:12px;">
                ${m.img ? `<img src="${m.img}" style="max-width:100%;border-radius:4px;margin-bottom:3px;display:block;"/>` : ''}
                ${m.file ? `<div style="font-size:10.5px;">📎 ${m.file}</div>` : ''}
                <div>${m.txt}</div>
                <div style="font-size:8.5px;color:#8696a0;text-align:right;margin-top:2px;">${m.hora} ✓✓</div>
              </div>
            </div>
          `).join('')}
        </div>

        <form id="cm-form" style="padding:8px;background:#202c33;display:flex;gap:5px;align-items:center;">
          <label style="cursor:pointer;background:#2a3942;color:#00a884;padding:6px 8px;border-radius:5px;font-size:13px;">
            📎 <input id="cm-file" type="file" accept="image/*,.pdf" style="display:none;"/>
          </label>
          <input id="cm-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:7px 9px;border-radius:5px;font-size:11.5px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#111b21;border:none;padding:7px 12px;border-radius:5px;font-weight:900;font-size:11.5px;cursor:pointer;">Enviar</button>
        </form>
      `;

      document.getElementById('cm-cls').onclick = () => modal.remove();
      document.getElementById('cm-add').onclick = () => {
        const nom = prompt("Nombre del canal o grupo:");
        if (nom) {
          const idNew = 'ch_' + Date.now();
          chans.push({ id: idNew, nombre: nom, msgs: [{ rem: "Sistema", hora: "00:00", txt: `Canal ${nom} creado.` }] });
          saveChan(chans); actId = idNew; pintar();
        }
      };
      document.getElementById('cm-del').onclick = () => {
        if (chans.length <= 1) { alert("Debe mantener al menos un canal."); return; }
        if (confirm(`¿Eliminar canal "${cObj.nombre}"?`)) {
          chans = chans.filter(x => x.id !== cObj.id);
          saveChan(chans); actId = chans[0].id; pintar();
        }
      };

      modal.querySelectorAll('.cm-tab').forEach(b => {
        b.onclick = () => { actId = b.getAttribute('data-cid'); pintar(); };
      });

      const bSc = document.getElementById('cm-msgs');
      if (bSc) bSc.scrollTop = bSc.scrollHeight;

      document.getElementById('cm-file').onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (evt) => {
          const hora = new Date().toLocaleTimeString('es-CR', {hour:'2-digit', minute:'2-digit'});
          const isImg = f.type.startsWith('image/');
          msgs.push({ rem: s.nombre, hora, txt: `Archivo: ${f.name}`, img: isImg?evt.target.result:null, file: !isImg?f.name:null });
          localStorage.setItem(sk, JSON.stringify(msgs)); pintar();
        };
        r.readAsDataURL(f);
      };

      document.getElementById('cm-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('cm-in'); const raw = inp.value.trim();
        if (!raw) return;
        const txt = filtrarGroserias(raw);
        const hora = new Date().toLocaleTimeString('es-CR', {hour:'2-digit', minute:'2-digit'});
        msgs.push({ rem: s.nombre, hora, txt });
        localStorage.setItem(sk, JSON.stringify(msgs)); pintar();
      };
    }

    document.body.appendChild(modal);
    pintar();
  };

  function activarCircuito02() {
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
        <img src="${ESCUDO_CTPMN}" width="32" height="36" alt="Escudo CTPMN" style="object-fit:contain;cursor:pointer;" onclick="location.reload()"/>
        <img src="${SVG_BUHO_ORIGINAL}" width="32" height="32" alt="Búho Azul Original" style="border-radius:50%;cursor:pointer;" onclick="location.reload()"/>
        <div style="cursor:pointer;" onclick="location.reload()">
          <div style="font-size:13.5px;font-weight:800;color:#f8fafc;letter-spacing:-0.01em;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:10.5px;color:#94a3b8;"><b>${s.nombre}</b> • CTP Mercedes Norte (Dir. Reg. Heredia • Circuito 02)</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button onclick="abrirSalaJuegosHD()" style="background:#131f33;color:#fbbf24;border:1px solid #334155;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">
          ♟️ Juegos
        </button>
        <button onclick="abrirModalWhatsAppMinimal()" style="background:#131f33;color:#e2e8f0;border:1px solid #334155;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;">
          💬 Chats CTPMN
        </button>
        <button onclick="cerrarSesionTotal()" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;">
          Salir
        </button>
      </div>
    `;

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';
    shell.innerHTML = `
      <div style="background:#0b1322;border:1px solid #1e293b;border-radius:14px;padding:18px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${ESCUDO_CTPMN}" width="48" height="54" alt="Escudo" style="object-fit:contain;"/>
          <div>
            <span style="background:#0284c7;color:#fff;font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:4px;">COLEGIO MODELO CTP MERCEDES NORTE • CIRCUITO 02</span>
            <h2 style="margin:4px 0 2px;font-size:17px;color:#fff;">Motor Académico, Técnico & Bilingüe</h2>
            <p style="margin:0;font-size:11.5px;color:#94a3b8;">Selecciona una materia, especialidad o idioma para iniciar el entrenamiento interactivo.</p>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;">
        ${AREAS_ESTUDIO.map(a => `
          <div class="bds-card-minimal" onclick="abrirMotorPractica('${a.id}', '${a.name}')">
            <div>
              <span style="background:#1e293b;color:#38bdf8;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:99px;">${a.cat}</span>
              <h4 style="margin:8px 0 4px;font-size:14px;color:#fff;">${a.name}</h4>
              <p style="margin:0;font-size:11px;color:#94a3b8;">Ejercicios adaptativos y simulacro oficial.</p>
            </div>
            <div style="margin-top:12px;font-size:11.5px;color:#34d399;font-weight:700;">Iniciar Práctica →</div>
          </div>
        `).join('')}
      </div>
    `;

    document.body.prepend(shell);
    document.body.prepend(hdr);
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSS();
    actualizarFaviconOficial();
    const s = getSesion();
    if (s && s.email) activarCircuito02();
    else mostrarLoginSobrio();
  });
})();