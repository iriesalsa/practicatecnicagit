(function () {
  const SESSION_KEY = "bds_session_v180_ctpmn_c02";
  const LOCK_KEY = "bds_lock_attempts_v180";
  const TRIAL_KEY = "bds_trial_start_v180";
  const XP_KEY = "bds_xp_profile_v180";
  const CHAT_KEY = "bds_chats_v180_c02";

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES = [];
  NIVELES.forEach(n => [1, 2, 3, 4].forEach(g => SECCIONES.push(`${n}-${g}`)));

  const ROLES = [
    { rol: "Estudiante", sec: true, ic: "🎒", desc: "Prácticas guiadas, simulacros (10–60), tu horario A/B, justificaciones y juegos." },
    { rol: "Docente MEP", sec: true, ic: "👨‍🏫", desc: "Horario de 20h propiedad, registro de notas Excel CSV, permisos y canales A/B." },
    { rol: "Director(a)", sec: false, ic: "🏛️", desc: "Bandeja ejecutiva de aprobación 1-clic, horarios globales, actas CSV y auditoría QR." },
    { rol: "Ministro(a) MEP", sec: false, ic: "🇨🇷", desc: "Supervisión macro de educación técnica, malla de 22 áreas y estándares DUA/Kaizen." },
    { rol: "Auxiliar Administrativo", sec: false, ic: "📋", desc: "Control de justificaciones estudiantiles, tardías, horarios por sección y carnés QR." },
    { rol: "Guarda / Seguridad", sec: false, ic: "🛡️", desc: "Escáner y validador criptográfico QR SHA-256 de portón y canal operativo de seguridad." },
    { rol: "Conserje / Mantenimiento", sec: false, ic: "🛠️", desc: "Horarios de laboratorios/aulas por bloque, canal operativo 5S y credencial digital." },
    { rol: "SuperAdmin", sec: false, ic: "👑", desc: "Control integral de la PWA, los 8 perfiles, seguridad RBAC, malla MEP y comunicaciones." }
  ];

  const IMG_BUHO = "/buho-original.svg?v=178";
  const IMG_ESCUDO = "/=182";
  const IMG_MEP = "/logo-mep-oficial.png?v=182";
  const GOOGLE_SVG = `<svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  const GROSERIAS = ["tonto","idiota","estupido","imbecil","malparido","mierda","puta","cabron","carajo","basura","pendejo","hijueputa","carepicha","playo","zorra"];
  const filtrarObscenidades = (txt) => GROSERIAS.reduce((acc, w) => acc.replace(new RegExp(`\\b${w}\\b`, "gi"), "****"), txt);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes("sw-bds-v182.js")) r.unregister(); });
      navigator.serviceWorker.register("/sw-bds-v182.js").catch(() => {});
    }).catch(() => {});
  }

  async function sha256Hex(texto) {
    try {
      const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    } catch { return "CTPMN2026SHA256VERIFICADO00000000000000000000000000000000000000"; }
  }

  function generarQRSVG(payload, sz = 148) {
    let h = 2166136261;
    for (let i = 0; i < payload.length; i++) { h ^= payload.charCodeAt(i); h = Math.imul(h, 16777619); }
    let seed = Math.abs(h) || 12345;
    const n = 21, cell = sz / n;
    let rects = "";
    const finder = (ox, oy) => {
      for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
          rects += `<rect x="${(ox + c) * cell}" y="${(oy + r) * cell}" width="${cell + 0.3}" height="${cell + 0.3}" fill="#0f172a"/>`;
      }
    };
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const skip = (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8) || (r >= 7 && r <= 13 && c >= 7 && c <= 13);
      if (!skip) {
        seed = (seed * 9301 + 49297) % 233280;
        if (seed / 233280 > 0.47) rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell + 0.25}" height="${cell + 0.25}" fill="#0f172a"/>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" style="background:#fff;border-radius:10px;padding:6px;box-sizing:border-box;"><rect width="${sz}" height="${sz}" fill="#fff" rx="8"/>${rects}<image href="${IMG_BUHO}" x="${sz*0.35}" y="${sz*0.35}" width="${sz*0.30}" height="${sz*0.30}"/></svg>`;
  }

  function esSuperAdmin(correo) {
    const c = (correo || "").toLowerCase().trim();
    return c === "maxi.salsa@gmail.com" || c === "max.salazar.sanchez@mep.go.cr";
  }

  function validarCorreo(correo) {
    const c = (correo || "").toLowerCase().trim();
    if (!/^[a-z0-9._%+-]+@(est\.mep\.go\.cr|mep\.go\.cr|gmail\.com)$/.test(c)) return false;
    const local = c.split("@")[0];
    if (local.length < 3 || /(asdasd|qwerty|asfsd|testtest|xxxx)/i.test(local)) return false;
    return true;
  }

  function diasPrueba() {
    let t = localStorage.getItem(TRIAL_KEY);
    if (!t) { t = String(Date.now()); localStorage.setItem(TRIAL_KEY, t); }
    return Math.max(0, 13 - Math.floor((Date.now() - Number(t)) / 86400000));
  }

  function getXP() {
    const hoy = new Date().toDateString();
    let d;
    try { d = JSON.parse(localStorage.getItem(XP_KEY)); } catch {}
    if (!d) d = { xp: 100, racha: 1, ultimoDia: hoy, medallas: ["🦉 Búho Azul Original"] };
    if (d.ultimoDia !== hoy) { d.racha += 1; d.ultimoDia = hoy; localStorage.setItem(XP_KEY, JSON.stringify(d)); }
    d.nivel = d.xp >= 2000 ? "Leyenda Turing" : (d.xp >= 1200 ? "Arquitecto Senior" : (d.xp >= 600 ? "Especialista MEP" : (d.xp >= 250 ? "Técnico Avanzado" : "Aprendiz CTPMN")));
    return d;
  }

  function ganarXP(pts, medalla) {
    const d = getXP();
    d.xp += pts;
    if (medalla && !d.medallas.includes(medalla)) d.medallas.push(medalla);
    localStorage.setItem(XP_KEY, JSON.stringify(d));
    const el = document.getElementById("bds-xp-pill");
    if (el) el.innerText = `🔥 ${d.racha}d • ⚡ ${d.xp} XP`;
  }

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function setSesion(s) {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
  }

  function cerrarSesion() {
    const keep = [LOCK_KEY, XP_KEY, CHAT_KEY, TRIAL_KEY, "bds_permisos_v180_c02", "bds_notas_excel_v180_c02"].map(k => [k, localStorage.getItem(k)]);
    sessionStorage.clear(); localStorage.clear();
    keep.forEach(([k, v]) => { if (v !== null) localStorage.setItem(k, v); });
    document.body.classList.remove("bds-authenticated");
    ["bds-header","bds-subnav","bds-shell","bds-dock","bds-drawer","bds-chat-modal"].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
    mostrarLogin("login");
  }

  function setFavicon() {
    let l = document.querySelector("link[rel~='icon']");
    if (!l) { l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); }
    l.type = "image/svg+xml"; l.href = IMG_BUHO;
  }

  function inyectarEstilos() {
    if (document.getElementById("bds-v180-css")) return;
    const st = document.createElement("style");
    st.id = "bds-v180-css";
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        background: #060c17 !important; color: #f1f5f9 !important; margin: 0; padding: 0;
        overflow-x: hidden; -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
      }
      #root { display: none !important; }
      /* bds-logos-oficiales-css */
      img[src*="logo-mep-oficial"] {
        background: #ffffff !important;
        padding: 5px 11px !important;
        border-radius: 9px !important;
        object-fit: contain !important;
        max-width: 100% !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.38) !important;
      }
      img[src*="escudo-ctpmn-oficial"] {
        background: #ffffff !important;
        padding: 2px !important;
        border-radius: 8px !important;
        object-fit: contain !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;
      }
      img[src*="logo-mep-oficial"] {
        background: #ffffff !important;
        padding: 5px 11px !important;
        border-radius: 9px !important;
        object-fit: contain !important;
        max-width: 100% !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.38) !important;
      }
      img[src*="escudo-ctpmn-oficial"] {
        background: #ffffff !important;
        padding: 2px !important;
        border-radius: 8px !important;
        object-fit: contain !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;
      }
      #bds-header {
        position: sticky; top: 0; z-index: 99990;
        background: rgba(11,18,32,0.97); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid #1e293b;
        padding: max(8px, env(safe-area-inset-top)) 14px 8px;
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
      }
      #bds-subnav {
        position: sticky; top: 53px; z-index: 99985;
        background: #0b1322; border-bottom: 1px solid #1e293b;
        padding: 7px 14px; display: flex; gap: 7px; overflow-x: auto; white-space: nowrap;
        -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      #bds-subnav::-webkit-scrollbar { display: none; }
      .bds-nav-btn {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 8px 13px; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; flex-shrink: 0; min-height: 38px; transition: all .15s;
      }
      .bds-nav-btn.active, .bds-nav-btn:hover { background: #1d4ed8; border-color: #38bdf8; color: #fff; }
      #bds-shell { max-width: 1240px; margin: 0 auto; padding: 14px 12px calc(92px + env(safe-area-inset-bottom)); }
      .bds-card { background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 16px; transition: border-color .15s, transform .15s; }
      .bds-card:hover { border-color: #38bdf8; }
      .bds-quick-btn {
        border: none; border-radius: 9px; padding: 10px 13px; font-size: 12px; font-weight: 800;
        color: #fff; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; min-height: 42px;
        transition: filter .15s, transform .15s;
      }
      .bds-quick-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
      #bds-dock {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 99992;
        background: rgba(11,18,32,0.98); backdrop-filter: blur(12px);
        border-top: 1px solid #1e293b; display: none; grid-template-columns: repeat(5, 1fr);
        padding: 6px 4px max(6px, env(safe-area-inset-bottom));
      }
      .bds-dock-b {
        background: none; border: none; color: #94a3b8; font-size: 10.5px; font-weight: 700;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        cursor: pointer; padding: 5px 2px; min-height: 46px; border-radius: 8px;
      }
      .bds-dock-b.active { color: #38bdf8; background: rgba(29,78,216,0.22); }
      @media (max-width: 820px) {
        #bds-dock { display: grid; }
        .hide-sm { display: none !important; }
        #bds-shell { padding: 12px 10px calc(94px + env(safe-area-inset-bottom)); }
      }
      @media print {
        #bds-header, #bds-subnav, #bds-dock, #bds-chat-modal { display: none !important; }
        body, .bds-card { background: #fff !important; color: #000 !important; border-color: #ccc !important; }
      }
    `;
    document.head.appendChild(st);
  }

  // ==================== LOGIN SOBERANO ESTÉTICO ====================
  function mostrarLogin(vista = "login") {
    inyectarEstilos(); setFavicon();
    const old = document.getElementById("bds-login-v180"); if (old) old.remove();
    const gate = document.createElement("div");
    gate.id = "bds-login-v180";
    gate.style.cssText = "position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#0f2247 0%,#060c17 72%);z-index:300000;display:flex;align-items:flex-start;justify-content:center;padding:16px 14px;overflow-y:auto;min-height:100dvh;";

    const getInt = () => parseInt(localStorage.getItem(LOCK_KEY) || "0", 10);
    const setInt = (n) => localStorage.setItem(LOCK_KEY, String(n));

    function draw() {
      const intentos = getInt(), locked = intentos >= 5;

      if (vista === "recover") {
        gate.innerHTML = `
          <div style="background:#0b1322;border:1px solid #1e293b;border-radius:16px;max-width:400px;width:100%;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
            <div style="text-align:center;margin-bottom:16px;">
              <img src="${IMG_BUHO}" width="54" height="54" alt="Búho Azul Original"/>
              <h2 style="margin:8px 0 2px;font-size:17px;color:#fff;">Recuperación de Acceso</h2>
              <p style="margin:0;font-size:11.5px;color:#94a3b8;">Restablecimiento seguro de credencial institucional</p>
            </div>
            <div id="rc-msg" style="display:none;padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;text-align:center;font-weight:600;"></div>
            <form id="rc-f" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-m" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:11px;color:#fff;font-size:13px;"/>
              <input id="rc-p1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:11px;color:#fff;font-size:13px;"/>
              <input id="rc-p2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:11px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:700;cursor:pointer;min-height:44px;">Actualizar Credencial</button>
              <button type="button" id="rc-bk" style="background:transparent;color:#94a3b8;border:1px solid #1e293b;padding:10px;border-radius:8px;font-weight:600;cursor:pointer;min-height:42px;">Volver al inicio</button>
            </form>
          </div>
        `;
        document.getElementById("rc-bk").onclick = () => { vista = "login"; draw(); };
        document.getElementById("rc-f").onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById("rc-m").value.trim(), p1 = document.getElementById("rc-p1").value, p2 = document.getElementById("rc-p2").value;
          const msg = document.getElementById("rc-msg"); msg.style.display = "block";
          if (!validarCorreo(m) || p1 !== p2) { msg.style.background = "#450a0a"; msg.style.color = "#fca5a5"; msg.innerText = "Verifique que el correo sea válido y las contraseñas coincidan."; return; }
          setInt(0); msg.style.background = "#064e3b"; msg.style.color = "#6ee7b7"; msg.innerText = "Credencial restablecida. Redirigiendo...";
          setTimeout(() => { vista = "login"; draw(); }, 900);
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1px solid #1e293b;border-radius:16px;max-width:420px;width:100%;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,0.85);">
          <div style="display:flex;justify-content:center;align-items:center;gap:14px;margin-bottom:10px;">
            <img src="${IMG_ESCUDO}" width="48" height="56" alt="Escudo CTP Mercedes Norte"/>
            <img src="${IMG_BUHO}" width="56" height="56" alt="Búho Azul Original"/>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <h1 style="margin:0;font-size:22px;font-weight:900;letter-spacing:-0.02em;color:#fff;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h1>
            <p style="margin:3px 0 0;font-size:11.5px;color:#cbd5e1;font-weight:600;">Colegio Técnico Profesional Mercedes Norte</p>
            <p style="margin:1px 0 0;font-size:10.5px;color:#38bdf8;font-weight:700;">Dirección Regional de Heredia • Circuito 02</p>
          </div>

          <div style="display:flex;justify-content:center;margin-bottom:12px;">
            <img src="${IMG_MEP}" style="height:40px;max-width:100%;object-fit:contain;" alt="Ministerio de Educación Pública de Costa Rica"/>
          </div>

          <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:9px;padding:8px 10px;margin-bottom:12px;font-size:11px;color:#93c5fd;text-align:center;line-height:1.45;">
            🎁 <b>13 días de prueba gratuita</b> con Google / MEP • Plan anual: <b>SINPE ₡3,500</b> (+506 6090 6359) o <b>$4.99</b>.
          </div>

          <div id="lg-err" style="display:${locked ? 'block' : 'none'};background:#450a0a;border:1px solid #7f1d1d;color:#fca5a5;padding:9px;border-radius:8px;font-size:12px;margin-bottom:10px;text-align:center;font-weight:600;">
            ${locked ? "Cuenta bloqueada tras 5 intentos fallidos. Comuníquese con soporte o use Recuperar contraseña." : ""}
          </div>

          <form id="lg-f" style="display:flex;flex-direction:column;gap:9px;">
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Correo Institucional o Gmail</label>
              <input id="lg-m" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${locked ? "disabled" : ""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#fff;font-size:13px;min-height:42px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Nombre Completo</label>
              <input id="lg-n" type="text" placeholder="Nombre y apellidos" required ${locked ? "disabled" : ""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 12px;color:#fff;font-size:13px;min-height:42px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Perfil</label>
                <select id="lg-r" ${locked ? "disabled" : ""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;min-height:42px;">
                  ${ROLES.map(r => `<option value="${r.rol}">${r.ic} ${r.rol}</option>`).join("")}
                </select>
              </div>
              <div id="lg-swrap">
                <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Sección</label>
                <select id="lg-s" ${locked ? "disabled" : ""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;min-height:42px;">
                  ${SECCIONES.map(sc => `<option value="${sc}" ${sc==="10-3"?"selected":""}>Sección ${sc}</option>`).join("")}
                </select>
              </div>
            </div>
            <div style="position:relative;">
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Contraseña</label>
              <input id="lg-p" type="password" placeholder="Ingrese su contraseña" required minlength="4" ${locked ? "disabled" : ""} style="width:100%;background:#070d19;border:1px solid #334155;border-radius:8px;padding:10px 40px 10px 12px;color:#fff;font-size:13px;min-height:42px;"/>
              <button type="button" id="lg-eye" aria-label="Mostrar contraseña" style="position:absolute;right:8px;top:27px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:15px;">👁️</button>
            </div>

            <button type="submit" ${locked ? "disabled" : ""} style="background:#1d4ed8;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:700;cursor:pointer;min-height:44px;margin-top:2px;">Ingresar a la Plataforma</button>
            <button type="button" id="lg-google" ${locked ? "disabled" : ""} style="background:#fff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;">${GOOGLE_SVG} <span>Continuar con Google</span></button>
            <button type="button" id="lg-guest" style="background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;min-height:42px;">Practicar gratis sin cuenta (Exploración Básica)</button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;font-size:11.5px;">
            <button type="button" id="lg-rec" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0;">¿Olvidó su contraseña?</button>
            <span style="color:#64748b;font-weight:600;">PWA Multi-SO • v182.0</span>
          </div>
        </div>
      `;

      const mIn = document.getElementById("lg-m"), pIn = document.getElementById("lg-p"), rSel = document.getElementById("lg-r"), sWrap = document.getElementById("lg-swrap");
      document.getElementById("lg-eye").onclick = () => { pIn.type = pIn.type === "password" ? "text" : "password"; };
      document.getElementById("lg-rec").onclick = () => { vista = "recover"; draw(); };

      function syncSec() {
        const obj = ROLES.find(x => x.rol === rSel.value);
        sWrap.style.display = (esSuperAdmin(mIn.value) || (obj && !obj.sec)) ? "none" : "block";
      }
      rSel.onchange = syncSec;
      mIn.oninput = () => { if (esSuperAdmin(mIn.value)) rSel.value = "SuperAdmin"; syncSec(); };
      syncSec();

      async function procesarAcceso(esGoogle) {
        const mail = mIn.value.trim().toLowerCase();
        const nom = document.getElementById("lg-n").value.trim();
        const err = document.getElementById("lg-err");
        if (!validarCorreo(mail)) {
          const n = getInt() + 1; setInt(n);
          err.style.display = "block";
          err.innerText = `Correo inválido (${n}/5). Use una cuenta real @est.mep.go.cr, @mep.go.cr o @gmail.com.`;
          if (n >= 5) draw();
          return;
        }
        const isMax = esSuperAdmin(mail);
        if (!isMax && rSel.value === "SuperAdmin") {
          const n = getInt() + 1; setInt(n);
          err.style.display = "block";
          err.innerText = `El perfil SuperAdmin es exclusivo de administración (${n}/5).`;
          if (n >= 5) draw();
          return;
        }
        if (!esGoogle && pIn.value.length < 4) { err.style.display = "block"; err.innerText = "Ingrese una contraseña válida."; return; }
        setInt(0);
        const rolFinal = isMax ? "SuperAdmin" : rSel.value;
        const secVal = document.getElementById("lg-s").value;
        const firma = await sha256Hex(`${mail}|${rolFinal}|${secVal}|CTPMN-C02`);
        setSesion({ nombre: nom || mail.split("@")[0], email: mail, rol: rolFinal, seccion: secVal, visitante: false, firma, qr: `CTPMN-C02|${rolFinal}|${secVal}|${firma.slice(0, 24)}` });
        gate.remove();
        iniciarApp("inicio");
      }

      document.getElementById("lg-f").onsubmit = (e) => { e.preventDefault(); procesarAcceso(false); };
      document.getElementById("lg-google").onclick = () => procesarAcceso(true);
      document.getElementById("lg-guest").onclick = async () => {
        const firma = await sha256Hex("VISITANTE|CTPMN-C02");
        setSesion({ nombre: "Visitante (Repaso Gratuito)", email: "visitante@practicatecnica.com", rol: "Estudiante", seccion: "10-3", visitante: true, firma, qr: `CTPMN-C02|VISITANTE|10-3|${firma.slice(0, 24)}` });
        gate.remove();
        iniciarApp("practica");
      };
    }

    document.body.appendChild(gate);
    draw();
  }

  // ==================== CHATS FLOTANTES PRO ====================
  function toggleChats() {
    const old = document.getElementById("bds-chat-modal"); if (old) { old.remove(); return; }
    const s = getSesion(), baseSec = s.seccion || "10-3";
    const defCanales = [
      { id: `c_${baseSec}_A`, nom: `Sección ${baseSec} • Subgrupo A (Esp. 1)`, msgs: [{ r: "Coordinación CTPMN", h: "07:30", t: `Bienvenidos al canal del Subgrupo A — Sección ${baseSec}.` }] },
      { id: `c_${baseSec}_B`, nom: `Sección ${baseSec} • Subgrupo B (Esp. 2)`, msgs: [{ r: "Coordinación CTPMN", h: "07:35", t: `Canal activo para Subgrupo B — Sección ${baseSec}.` }] },
      { id: "c_dir", nom: "🏛️ Dirección • Circuito 02", msgs: [{ r: "Dirección CTPMN", h: "07:00", t: "Avisos oficiales del CTP Mercedes Norte (Circuito 02)." }] },
      { id: "c_adm", nom: "📋 Docentes, Auxiliares y Seguridad", msgs: [{ r: "Prefectura", h: "06:45", t: "Control de portón, tardías y bitácoras activas." }] }
    ];
    const getChans = () => { try { const g = JSON.parse(localStorage.getItem(CHAT_KEY)); if (Array.isArray(g) && g.length) return g; } catch {} return defCanales; };
    const saveChans = (a) => localStorage.setItem(CHAT_KEY, JSON.stringify(a));

    let chans = getChans(), actId = chans[0].id;
    const modal = document.createElement("div");
    modal.id = "bds-chat-modal";
    modal.style.cssText = "position:fixed;top:58px;right:12px;z-index:260000;width:420px;max-width:calc(100vw - 24px);height:min(520px,calc(100vh - 120px));background:#0b141a;border:1px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.9);display:flex;flex-direction:column;";

    function draw() {
      chans = getChans();
      const cur = chans.find(x => x.id === actId) || chans[0]; actId = cur.id;
      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:6px;border-bottom:1px solid #2a3942;">
          <div style="min-width:0;">
            <div style="font-size:13px;font-weight:800;color:#e9edef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">💬 ${cur.nom}</div>
            <div style="font-size:10px;color:#8696a0;">Filtro parental activo • ${s.rol}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="ch-new" style="background:#00a884;color:#052e16;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">+ Nuevo</button>
            <button id="ch-del" title="Eliminar canal" style="background:#7f1d1d;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🗑️</button>
            <button id="ch-cls" style="background:#334155;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✕</button>
          </div>
        </div>
        <div style="display:flex;gap:5px;padding:7px;background:#111b21;border-bottom:1px solid #222d34;overflow-x:auto;">
          ${chans.map(c => `<button data-cid="${c.id}" class="ch-tab" style="background:${c.id===actId?'#005c4b':'#202c33'};color:#e9edef;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;">${c.nom}</button>`).join("")}
        </div>
        <div id="ch-list" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          ${cur.msgs.map(m => `
            <div style="align-self:${m.r===s.nombre?'flex-end':'flex-start'};max-width:85%;background:${m.r===s.nombre?'#005c4b':'#202c33'};color:#e9edef;padding:8px 11px;border-radius:9px;font-size:12.5px;">
              <div style="font-size:9.5px;color:#38bdf8;font-weight:700;margin-bottom:2px;">${m.r}</div>
              ${m.img ? `<img src="${m.img}" style="max-width:100%;border-radius:6px;margin-bottom:4px;display:block;"/>` : ""}
              ${m.file ? `<div style="background:rgba(0,0,0,0.25);padding:5px 7px;border-radius:5px;font-size:11px;margin-bottom:4px;">📎 ${m.file}</div>` : ""}
              <div>${m.t}</div>
              <div style="font-size:9px;color:#94a3b8;text-align:right;margin-top:3px;">${m.h} ✓✓</div>
            </div>
          `).join("")}
        </div>
        <form id="ch-f" style="padding:9px;background:#202c33;display:flex;gap:6px;align-items:center;">
          <label title="Adjuntar imagen o archivo" style="cursor:pointer;background:#2a3942;color:#00a884;padding:8px 10px;border-radius:7px;font-size:14px;">📎<input id="ch-file" type="file" accept="image/*,.pdf,.docx,.xlsx" style="display:none;"/></label>
          <input id="ch-in" type="text" placeholder="Escribe un mensaje..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:9px 10px;border-radius:7px;font-size:12.5px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#052e16;border:none;padding:9px 13px;border-radius:7px;font-weight:800;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;
      const list = document.getElementById("ch-list"); if (list) list.scrollTop = list.scrollHeight;
      document.getElementById("ch-cls").onclick = () => modal.remove();
      modal.querySelectorAll(".ch-tab").forEach(b => b.onclick = () => { actId = b.getAttribute("data-cid"); draw(); });
      document.getElementById("ch-new").onclick = () => {
        const nom = prompt("Nombre del nuevo canal (ej: Sección 11-1 • Subgrupo A):");
        if (nom && nom.trim()) {
          const nc = { id: "c_" + Date.now(), nom: nom.trim(), msgs: [{ r: "Sistema", h: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), t: `Canal "${nom.trim()}" habilitado.` }] };
          chans.push(nc); saveChans(chans); actId = nc.id; draw();
        }
      };
      document.getElementById("ch-del").onclick = () => {
        if (chans.length <= 1) { alert("Debe permanecer al menos un canal activo."); return; }
        if (confirm(`¿Eliminar el canal "${cur.nom}"?`)) { chans = chans.filter(x => x.id !== cur.id); saveChans(chans); actId = chans[0].id; draw(); }
      };
      document.getElementById("ch-file").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          cur.msgs.push({ r: s.nombre, h, t: `Adjuntó ${f.name}`, img: f.type.startsWith("image/") ? ev.target.result : null, file: f.type.startsWith("image/") ? null : f.name });
          saveChans(chans); draw();
        };
        r.readAsDataURL(f);
      };
      document.getElementById("ch-f").onsubmit = (e) => {
        e.preventDefault();
        const raw = document.getElementById("ch-in").value.trim(); if (!raw) return;
        const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
        cur.msgs.push({ r: s.nombre, h, t: filtrarObscenidades(raw) });
        saveChans(chans); draw();
      };
    }
    document.body.appendChild(modal); draw();
  }

  // ==================== MOTOR DE EVALUACIÓN (10–60 PREGUNTAS + CRONÓMETRO + IDIOMAS) ====================
  let simTimer = null;
  function renderEvaluacion(shell, modoInicial, areaInicial) {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    const malla = window.BDS_MALLA_MEP || [];
    let modo = modoInicial || "guiada", area = areaInicial || "ALL", cantidad = 10, diff = "ALL";
    let items = [], idx = 0, answers = {}, secLeft = 900, paused = false, finished = false;

    function iniciarPrueba() {
      if (simTimer) { clearInterval(simTimer); simTimer = null; }
      items = window.BDS_GENERAR_SIMULACRO(area, cantidad, diff);
      idx = 0; answers = {}; paused = false; finished = false; secLeft = cantidad * 90;
      if (modo === "simulacro") {
        simTimer = setInterval(() => {
          if (!paused && !finished) {
            secLeft--;
            const ck = document.getElementById("sim-clk");
            if (ck) ck.innerText = `${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}`;
            if (secLeft <= 0) { finished = true; clearInterval(simTimer); draw(); }
          }
        }, 1000);
      }
      draw();
    }

    function hablarTexto(txt, lang) {
      try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = lang || "en-US"; u.rate = 0.92; window.speechSynthesis.speak(u); } catch {}
    }

    function practicarSpeaking() {
      const Rec = window.SpeechRecognition || window.webkitSpeechRecognition, box = document.getElementById("spk-fb");
      if (!Rec) { if (box) box.innerText = "🎙️ Tu navegador no soporta micrófono directo; lee la frase en voz alta."; return; }
      const r = new Rec(); r.lang = "en-US";
      if (box) box.innerText = "🎙️ Escuchando... pronuncia ahora.";
      r.onresult = (e) => { if (box) box.innerHTML = `✅ Detectado: <b>"${e.results[0][0].transcript}"</b> (+10 XP)`; ganarXP(10, "🎙️ Speaking Activo"); };
      r.onerror = () => { if (box) box.innerText = "⚠️ Verifica permisos de micrófono."; };
      r.start();
    }

    function draw() {
      const areaMeta = malla.find(m => m.id === area), cur = items[idx];
      if (finished) {
        if (simTimer) { clearInterval(simTimer); simTimer = null; }
        let okCnt = 0;
        items.forEach((it, i) => { if (answers[i] !== undefined && it.opts[answers[i]] && it.opts[answers[i]].ok) okCnt++; });
        const pct = Math.round((okCnt / items.length) * 100), ucr = Math.round(200 + (okCnt / items.length) * 600);
        if (pct >= 70) ganarXP(cantidad * 3, "⏱️ Simulacro Aprobado");

        shell.innerHTML = `
          <div class="bds-card" style="max-width:860px;margin:0 auto;text-align:center;border-color:${pct>=70?'#10b981':'#f59e0b'};">
            <span style="background:${pct>=70?'#059669':'#b45309'};color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;">${pct>=70 ? "✅ APROBADO" : "⚠️ REFUERZO RECOMENDADO"}</span>
            <h2 style="margin:10px 0 6px;color:#fff;">Acta Oficial — ${areaMeta ? areaMeta.name : "Toda la Malla MEP"}</h2>
            <p style="font-size:15px;color:#cbd5e1;">Aciertos: <b style="color:#34d399;">${okCnt}/${items.length}</b> • Nota MEP: <b style="color:#38bdf8;">${pct}%</b> • Escala UCR/TEC: <b style="color:#fbbf24;">${ucr}/800 pts</b></p>
            <div style="display:flex;justify-content:center;gap:10px;margin:14px 0;flex-wrap:wrap;">
              <button id="sim-again" style="background:#1d4ed8;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Nuevo Simulacro</button>
              <button id="sim-rev" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;">📖 Revisar Explicaciones</button>
            </div>
            <div id="rev-list" style="display:none;text-align:left;margin-top:14px;flex-direction:column;gap:8px;max-height:360px;overflow-y:auto;">
              ${items.map((it, i) => {
                const chosen = answers[i], corr = it.opts.find(o => o.ok), bien = chosen !== undefined && it.opts[chosen] && it.opts[chosen].ok;
                return `<div style="background:#070d19;border-left:4px solid ${bien?'#10b981':'#ef4444'};padding:10px;border-radius:8px;font-size:12px;"><b>${i+1}. ${it.q}</b><br/><span style="color:#34d399;">Correcta: ${corr.txt}</span> — <span style="color:#94a3b8;">${it.e}</span></div>`;
              }).join("")}
            </div>
          </div>
        `;
        document.getElementById("sim-again").onclick = iniciarPrueba;
        document.getElementById("sim-rev").onclick = () => { const rl = document.getElementById("rev-list"); rl.style.display = rl.style.display === "none" ? "flex" : "none"; };
        return;
      }

      const mCur = cur ? (malla.find(m => m.id === cur.a) || { name: "MEP", color: "#0284c7" }) : { name: "MEP", color: "#0284c7" };
      const resp = answers[idx];
      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${[["libre","📝 Práctica Libre"],["guiada","🧭 Práctica Guiada"],["simulacro","⏱️ Simulacro Oficial"]].map(([k, l]) => `<button data-m="${k}" class="m-sw" style="background:${modo===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${modo===k?'#38bdf8':'#26354d'};padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${l}</button>`).join("")}
            </div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;">
              <select id="ev-area" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:600;max-width:240px;">
                <option value="ALL" ${area==="ALL"?"selected":""}>🌎 Toda la Malla MEP (22 Áreas)</option>
                ${malla.map(m => `<option value="${m.id}" ${area===m.id?"selected":""}>${m.name} (${m.cat})</option>`).join("")}
              </select>
              <select id="ev-cant" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:800;">
                ${[10, 20, 30, 40, 50, 60].map(c => `<option value="${c}" ${cantidad===c?"selected":""}>${c} preguntas</option>`).join("")}
              </select>
              <select id="ev-diff" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;">
                <option value="ALL" ${diff==="ALL"?"selected":""}>Todas las dificultades</option>
                <option value="Básico" ${diff==="Básico"?"selected":""}>🟢 Básico</option>
                <option value="Intermedio" ${diff==="Intermedio"?"selected":""}>🟡 Intermedio</option>
                <option value="Avanzado" ${diff==="Avanzado"?"selected":""}>🔴 Avanzado</option>
              </select>
              <button id="ev-go" style="background:#059669;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔀 Generar</button>
            </div>
          </div>
          ${modo === "simulacro" ? `
            <div style="margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div style="font-size:13px;font-weight:800;color:#fbbf24;">⏱️ Cronómetro: <span id="sim-clk" style="font-family:monospace;font-size:16px;">${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}</span></div>
              <div style="display:flex;gap:6px;">
                <button id="sim-pause" style="background:#b45309;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${paused ? "▶️ Reanudar" : "⏸️ Pausar"}</button>
                <button id="sim-end" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">✅ Entregar y Calificar</button>
              </div>
            </div>
          ` : ""}
        </div>

        ${paused ? `<div class="bds-card" style="text-align:center;padding:42px;color:#fbbf24;font-weight:800;">⏸️ Simulacro en pausa. Presiona Reanudar para continuar.</div>` : `
          <div class="bds-card" style="max-width:860px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
              <span style="background:${mCur.color};color:#fff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:99px;">CTP Mercedes Norte • Circuito 02 • ${mCur.name}</span>
              <span style="font-size:12px;font-weight:800;color:#38bdf8;">Ítem ${idx + 1} de ${items.length} • Nivel ${cur.d}</span>
            </div>
            ${modo === "guiada" ? `<div style="background:#070d19;border-left:4px solid #10b981;padding:10px 13px;border-radius:8px;margin-bottom:12px;font-size:12.5px;color:#a7f3d0;"><b>🧭 Guía Socrática:</b> ${cur.g}</div>` : ""}
            ${cur.audio ? `<div style="background:#0f172a;border:1px solid #2563eb;padding:10px 12px;border-radius:9px;margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><button id="btn-listen" style="background:#2563eb;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">🔊 Escuchar Audio</button>${cur.speak ? `<button id="btn-speak" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">🎙️ Practicar Speaking</button><span id="spk-fb" style="font-size:11.5px;color:#93c5fd;">"${cur.speak}"</span>` : ""}</div>` : ""}
            <h3 style="margin:0 0 14px;font-size:16px;color:#fff;line-height:1.45;">${cur.q}</h3>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${cur.opts.map((o, i) => {
                let bg = "#131f33", bd = "#26354d";
                if (modo === "simulacro" && resp === i) { bg = "#1d4ed8"; bd = "#38bdf8"; }
                else if (modo !== "simulacro" && resp !== undefined) {
                  if (o.ok) { bg = "#064e3b"; bd = "#10b981"; }
                  else if (resp === i) { bg = "#7f1d1d"; bd = "#ef4444"; }
                }
                return `<button data-oi="${i}" class="ev-opt" style="text-align:left;background:${bg};border:1.5px solid ${bd};color:#fff;padding:12px 14px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;min-height:44px;">${String.fromCharCode(65 + i)}) ${o.txt}</button>`;
              }).join("")}
            </div>
            ${modo !== "simulacro" && resp !== undefined ? `<div style="margin-top:12px;padding:11px;border-radius:8px;background:${cur.opts[resp].ok ? '#064e3b' : '#450a0a'};color:${cur.opts[resp].ok ? '#6ee7b7' : '#fca5a5'};font-size:12.5px;"><b>${cur.opts[resp].ok ? "✅ ¡Correcto! (+10 XP)" : "❌ Retroalimentación:"}</b> ${cur.e}</div>` : ""}
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;">
              <button id="ev-prev" ${idx===0?"disabled":""} style="background:#1e293b;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
              <span style="font-size:11.5px;color:#94a3b8;">Respondidas: ${Object.keys(answers).length}/${items.length}</span>
              <button id="ev-next" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">${idx>=items.length-1 ? "Finalizar" : "Siguiente →"}</button>
            </div>
          </div>
        `}
      `;
      shell.querySelectorAll(".m-sw").forEach(b => b.onclick = () => { modo = b.getAttribute("data-m"); iniciarPrueba(); });
      document.getElementById("ev-area").onchange = (e) => { area = e.target.value; iniciarPrueba(); };
      document.getElementById("ev-cant").onchange = (e) => { cantidad = Number(e.target.value); iniciarPrueba(); };
      document.getElementById("ev-diff").onchange = (e) => { diff = e.target.value; iniciarPrueba(); };
      document.getElementById("ev-go").onclick = iniciarPrueba;
      if (document.getElementById("sim-pause")) document.getElementById("sim-pause").onclick = () => { paused = !paused; draw(); };
      if (document.getElementById("sim-end")) document.getElementById("sim-end").onclick = () => { finished = true; draw(); };
      if (document.getElementById("btn-listen")) document.getElementById("btn-listen").onclick = () => hablarTexto(cur.audio, cur.lang || "en-US");
      if (document.getElementById("btn-speak")) document.getElementById("btn-speak").onclick = practicarSpeaking;
      if (!paused) {
        shell.querySelectorAll(".ev-opt").forEach(b => b.onclick = () => {
          const chosen = Number(b.getAttribute("data-oi"));
          if (modo !== "simulacro" && answers[idx] !== undefined) return;
          answers[idx] = chosen;
          if (modo !== "simulacro" && cur.opts[chosen].ok) ganarXP(10);
          draw();
        });
        document.getElementById("ev-prev").onclick = () => { if (idx > 0) { idx--; draw(); } };
        document.getElementById("ev-next").onclick = () => { if (idx < items.length - 1) { idx++; draw(); } else { finished = true; draw(); } };
      }
    }
    iniciarPrueba();
  }

  // ==================== BIBLIOTECA + ESTUDIO DE AFICHES MARCA BLANCA ====================
  function renderBiblioteca(shell) {
    const malla = window.BDS_MALLA_MEP || [];
    let sub = "libros";
    let afiche = { titulo: "Feria Técnica y Científica 2026", sub: "Colegio Técnico Profesional Mercedes Norte • Circuito 02", cuerpo: "Invitamos a toda la comunidad educativa a participar en la exposición de proyectos STEAM, Desarrollo Web y Ciberseguridad.", formato: "1080x1080", tema: "#0f2247" };

    function exportarPosterPNG() {
      const [w, h] = afiche.formato.split("x").map(Number);
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      const gr = ctx.createLinearGradient(0, 0, w, h); gr.addColorStop(0, afiche.tema); gr.addColorStop(1, "#060c17");
      ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 10; ctx.strokeRect(28, 28, w - 56, h - 56);
      ctx.fillStyle = "#38bdf8"; ctx.font = `800 ${Math.round(w*0.024)}px Inter, sans-serif`; ctx.textAlign = "center";
      ctx.fillText("COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE • HEREDIA • CIRCUITO 02", w / 2, h * 0.14);
      ctx.fillStyle = "#ffffff"; ctx.font = `900 ${Math.round(w*0.05)}px Inter, sans-serif`;
      ctx.fillText(afiche.titulo, w / 2, h * 0.42, w * 0.84);
      ctx.fillStyle = "#2dd4bf"; ctx.font = `700 ${Math.round(w*0.028)}px Inter, sans-serif`;
      ctx.fillText(afiche.sub, w / 2, h * 0.54, w * 0.84);
      ctx.fillStyle = "#e2e8f0"; ctx.font = `500 ${Math.round(w*0.024)}px Inter, sans-serif`;
      ctx.fillText(afiche.cuerpo, w / 2, h * 0.68, w * 0.82);
      const a = document.createElement("a"); a.download = `afiche-ctpmn-${afiche.formato}.png`; a.href = cv.toDataURL("image/png"); a.click();
      ganarXP(20, "🎨 Marca Blanca");
    }

    function draw() {
      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">BIBLIOTECA MEP & ESTUDIO EDITORIAL MARCA BLANCA</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">Libros Resúmenes y Afiches Institucionales (Cero Marcas de Agua)</h2>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="tb-lib" style="background:${sub==='libros'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📚 Libros (22 Materias)</button>
              <button id="tb-cam" style="background:${sub==='campana'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🎨 Afiches Marca Blanca</button>
            </div>
          </div>
          ${sub === "libros" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
              ${malla.map(m => `
                <div style="background:#070d19;border:1px solid #1e293b;border-top:3px solid ${m.color};border-radius:11px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <span style="font-size:10px;font-weight:800;color:${m.color};">${m.cat.toUpperCase()}</span>
                    <h4 style="margin:5px 0 6px;color:#fff;font-size:14.5px;">📖 ${m.name}</h4>
                    <p style="margin:0 0 10px;font-size:12px;color:#cbd5e1;line-height:1.45;">${m.libro}</p>
                    <ul style="margin:0 0 12px;padding-left:16px;font-size:11.5px;color:#94a3b8;">${m.claves.map(k => `<li>${k}</li>`).join("")}</ul>
                  </div>
                  <button data-pa="${m.id}" class="lib-prac" style="background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:8px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">Practicar ${m.name} →</button>
                </div>
              `).join("")}
            </div>
          ` : `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
              <div style="display:flex;flex-direction:column;gap:10px;">
                <input id="af-t" type="text" value="${afiche.titulo}" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
                <input id="af-s" type="text" value="${afiche.sub}" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
                <textarea id="af-c" rows="3" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;">${afiche.cuerpo}</textarea>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <select id="af-fmt" style="background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    <option value="1080x1080" ${afiche.formato==="1080x1080"?"selected":""}>Instagram 1:1</option>
                    <option value="1080x1920" ${afiche.formato==="1080x1920"?"selected":""}>WhatsApp Estado 9:16</option>
                    <option value="1280x720" ${afiche.formato==="1280x720"?"selected":""}>WhatsApp / Web 16:9</option>
                    <option value="1080x1350" ${afiche.formato==="1080x1350"?"selected":""}>Facebook / Mural 4:5</option>
                  </select>
                  <select id="af-bg" style="background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;">
                    <option value="#0f2247" ${afiche.tema==="#0f2247"?"selected":""}>Azul Institucional</option>
                    <option value="#064e3b" ${afiche.tema==="#064e3b"?"selected":""}>Esmeralda Técnico</option>
                    <option value="#7f1d1d" ${afiche.tema==="#7f1d1d"?"selected":""}>Vino CTP Mercedes Norte</option>
                  </select>
                </div>
                <button id="af-dl" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">📥 Exportar PNG Marca Blanca</button>
              </div>
              <div style="background:linear-gradient(135deg,${afiche.tema},#060c17);border:2px solid #38bdf8;border-radius:14px;padding:20px;text-align:center;display:flex;flex-direction:column;justify-content:center;gap:10px;min-height:280px;">
                <div style="display:flex;justify-content:center;gap:12px;align-items:center;"><img src="${IMG_ESCUDO}" height="44"/><img src="${IMG_MEP}" height="34"/></div>
                <div style="font-size:10px;color:#38bdf8;font-weight:800;">COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE • CIRCUITO 02</div>
                <h3 style="margin:0;color:#fff;font-size:19px;">${afiche.titulo}</h3>
                <div style="font-size:13px;color:#2dd4bf;font-weight:700;">${afiche.sub}</div>
                <p style="margin:0;font-size:12.5px;color:#e2e8f0;line-height:1.45;">${afiche.cuerpo}</p>
              </div>
            </div>
          `}
        </div>
      `;
      document.getElementById("tb-lib").onclick = () => { sub = "libros"; draw(); };
      document.getElementById("tb-cam").onclick = () => { sub = "campana"; draw(); };
      shell.querySelectorAll(".lib-prac").forEach(b => b.onclick = () => renderEvaluacion(shell, "guiada", b.getAttribute("data-pa")));
      if (sub === "campana") {
        document.getElementById("af-t").oninput = (e) => { afiche.titulo = e.target.value; draw(); document.getElementById("af-t").focus(); };
        document.getElementById("af-s").oninput = (e) => { afiche.sub = e.target.value; draw(); document.getElementById("af-s").focus(); };
        document.getElementById("af-c").oninput = (e) => { afiche.cuerpo = e.target.value; draw(); document.getElementById("af-c").focus(); };
        document.getElementById("af-fmt").onchange = (e) => { afiche.formato = e.target.value; };
        document.getElementById("af-bg").onchange = (e) => { afiche.tema = e.target.value; draw(); };
        document.getElementById("af-dl").onclick = exportarPosterPNG;
      }
    }
    draw();
  }

  // ==================== INICIO CON ACCESOS ADMINISTRATIVOS 1-CLIC + 8 ROLES ====================
  function renderInicio(shell, rolVista) {
    const s = getSesion(), xp = getXP(), malla = window.BDS_MALLA_MEP || [];
    const rol = rolVista || s.rol;
    const rMeta = ROLES.find(r => r.rol === rol) || ROLES[0];
    const rachaTxt = `${xp.racha} ${xp.racha === 1 ? "día" : "días"}`;

    shell.innerHTML = `
      <!-- Encabezado Institucional Sobrio con Logo MEP Estético -->
      <div class="bds-card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
        <div style="display:flex;align-items:center;gap:12px;min-width:240px;flex:1;">
          <img src="${IMG_ESCUDO}" width="48" height="56" alt="Escudo CTP Mercedes Norte"/>
          <div>
            <span style="background:#1d4ed8;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;">COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE • HEREDIA • CIRCUITO 02</span>
            <h2 style="margin:5px 0 2px;font-size:18px;color:#fff;">Panel ${rol} — ${s.nombre}</h2>
            <p style="margin:0;font-size:12px;color:#94a3b8;">${rMeta.desc}</p>
            <p style="margin:3px 0 0;font-size:11.5px;color:#cbd5e1;">Nivel: <b style="color:#fbbf24;">${xp.nivel}</b> • Racha: <b>${rachaTxt}</b> • ${s.visitante ? "Modo Exploración" : `Prueba activa: ${diasPrueba()} días restantes`}</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <img src="${IMG_MEP}" style="height:44px;max-width:240px;object-fit:contain;" alt="MEP Costa Rica"/>
          <select id="rol-sw" style="background:#070d19;color:#38bdf8;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:12px;font-weight:700;min-height:38px;">
            ${ROLES.map(r => `<option value="${r.rol}" ${rol===r.rol?"selected":""}>${r.ic} Cambiar Vista: ${r.rol}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- BARRA DE ACCESOS RÁPIDOS ADMINISTRATIVOS 1-CLIC (SIEMPRE VISIBLE EN PORTADA) -->
      <div class="bds-card" style="margin-bottom:14px;background:linear-gradient(135deg,#0d192e 0%,#0b1322 100%);border-color:#1e3a8a;">
        <div style="font-size:11px;font-weight:800;color:#38bdf8;letter-spacing:0.04em;margin-bottom:10px;">⚡ GESTIÓN ADMINISTRATIVA Y ACADÉMICA EN 1 CLIC (SUPERIOR A SICAI / SEA / PIAD):</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button onclick="window.bdsGo('admin','horarios')" class="bds-quick-btn" style="background:#0284c7;">📅 Horarios (Profes & Estudiantes)</button>
          <button onclick="window.bdsGo('admin','permisos')" class="bds-quick-btn" style="background:#059669;">📝 Solicitar Permiso / Tardía Personal</button>
          <button onclick="window.bdsGo('admin','justificaciones')" class="bds-quick-btn" style="background:#0d9488;">🎓 Justificar Estudiante → Docente</button>
          <button onclick="window.bdsGo('admin','bandeja')" class="bds-quick-btn" style="background:#6d28d9;">🏛️ Bandeja Dirección (Aprobar 1-Clic)</button>
          <button onclick="window.bdsGo('admin','notas')" class="bds-quick-btn" style="background:#b45309;">📊 Registro Notas & Excel CSV</button>
          <button onclick="window.bdsGo('direccion')" class="bds-quick-btn" style="background:#4f46e5;">📈 Panel Dirección & Familia</button><button onclick="window.bdsGo('fase3')" class="bds-quick-btn" style="background:#7c3aed;">🏭 50 Especialidades & Planes</button><button onclick="window.bdsGo('admin','qr')" class="bds-quick-btn" style="background:#1e40af;">🪪 Carné & Escáner QR SHA-256</button>
        </div>
      </div>

            <!-- BLOQUE ADMISIÓN UNIVERSITARIA UCR • TEC • UNA • UNED • UTN -->
      <div class="bds-card" style="margin-bottom:14px;background:linear-gradient(135deg,#0c1d3d 0%,#0b1322 100%);border-color:#0284c7;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <div style="font-size:11.5px;font-weight:800;color:#38bdf8;letter-spacing:0.03em;">🎓 ADMISIÓN UNIVERSITARIA Y PRUEBAS NACIONALES (SIMULACROS 10–60 + CALCULADORA DE NOTA):</div>
          <button onclick="window.bdsGo('admision','ucr')" style="background:#0284c7;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">Abrir Centro de Admisión →</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button onclick="window.bdsGo('admision','ucr')" class="bds-quick-btn" style="background:#0284c7;">🏛️ UCR (PAA 200–800)</button>
          <button onclick="window.bdsGo('admision','tec')" class="bds-quick-btn" style="background:#1d4ed8;">⚙️ TEC (Aptitud 200–800)</button>
          <button onclick="window.bdsGo('admision','una')" class="bds-quick-btn" style="background:#dc2626;">🎓 UNA (PAA 0–900)</button>
          <button onclick="window.bdsGo('admision','uned')" class="bds-quick-btn" style="background:#059669;">🌐 UNED (Diagnóstico)</button>
          <button onclick="window.bdsGo('admision','utn')" class="bds-quick-btn" style="background:#ea580c;">🔧 UTN (Articulación CTP)</button>
          <button onclick="window.bdsGo('admision','pne')" class="bds-quick-btn" style="background:#7c3aed;">🇨🇷 Pruebas Nacionales MEP</button>
        </div>
      </div>

      <!-- 4 MÓDULOS PEDAGÓGICOS Y LÚDICOS -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin-bottom:16px;">
        <div class="bds-card" style="cursor:pointer;border-top:3px solid #10b981;" onclick="window.bdsGo('practica')">
          <h4 style="margin:0 0 4px;color:#fff;">🧭 Práctica Guiada & Libre</h4>
          <p style="margin:0;font-size:11.5px;color:#94a3b8;">22 áreas MEP con pista socrática, audio Listening y Speaking.</p>
        </div>
        <div class="bds-card" style="cursor:pointer;border-top:3px solid #f59e0b;" onclick="window.bdsGo('simulacro')">
          <h4 style="margin:0 0 4px;color:#fff;">⏱️ Simulacro 10–60 Preguntas</h4>
          <p style="margin:0;font-size:11.5px;color:#94a3b8;">Cronómetro oficial, nota MEP (100%) y escala UCR/TEC (800).</p>
        </div>
        <div class="bds-card" style="cursor:pointer;border-top:3px solid #38bdf8;" onclick="window.bdsGo('biblioteca')">
          <h4 style="margin:0 0 4px;color:#fff;">📚 Libros & Afiches Marca Blanca</h4>
          <p style="margin:0;font-size:11.5px;color:#94a3b8;">Resúmenes curriculares y exportación PNG sin marcas de agua.</p>
        </div>
        <div class="bds-card" style="cursor:pointer;border-top:3px solid #a855f7;" onclick="window.bdsGo('juegos')">
          <h4 style="margin:0 0 4px;color:#fff;">♟️ Ajedrez FIDE & 6 Juegos</h4>
          <p style="margin:0;font-size:11.5px;color:#94a3b8;">Ajedrez legal vs IA, Damas, Memoria, Cálculo, Scrabble y MOPT.</p>
        </div>
      </div>

      <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">📘 Malla Curricular Completa MEP (22 Materias y Especialidades)</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:10px;margin-bottom:16px;">
        ${malla.map(m => `
          <div class="bds-card" style="cursor:pointer;border-left:4px solid ${m.color};padding:12px;" data-area="${m.id}">
            <span style="font-size:9.5px;font-weight:800;color:${m.color};">${m.cat.toUpperCase()}</span>
            <div style="font-size:13.5px;font-weight:700;color:#fff;margin-top:3px;">${m.name}</div>
          </div>
        `).join("")}
      </div>

      <div class="bds-card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;">
        <div>
          <h4 style="margin:0 0 6px;color:#fbbf24;">🏆 Reglas de XP, Racha y Medallas</h4>
          <ul style="margin:0;padding-left:16px;font-size:12px;color:#cbd5e1;line-height:1.6;">
            <li>+10 XP por ítem correcto, práctica oral o captura en ajedrez.</li>
            <li>+30 a +180 XP por aprobar simulacros oficiales (≥70%).</li>
            <li>Medallas desbloqueadas: <b>${xp.medallas.join(" • ")}</b></li>
          </ul>
        </div>
        <div>
          <h4 style="margin:0 0 6px;color:#34d399;">💳 Planes Oficiales Unificados</h4>
          <p style="margin:0;font-size:12px;color:#cbd5e1;line-height:1.55;">
            <b>Prueba gratuita:</b> 13 días con cuenta Google / MEP.<br/>
            <b>Plan Anual Nacional:</b> <b>₡3,500</b> vía SINPE Móvil al <b>+506 6090 6359</b> (Banco Popular, Max Salazar Sánchez — Detalle: correo del usuario).<br/>
            <b>Plan Internacional:</b> <b>$4.99 USD / año</b> vía PayPal.
          </p>
        </div>
      </div>
    `;

    document.getElementById("rol-sw").onchange = (e) => renderInicio(shell, e.target.value);
    shell.querySelectorAll("[data-area]").forEach(el => {
      el.onclick = () => { setNavActive("practica"); renderEvaluacion(shell, "guiada", el.getAttribute("data-area")); };
    });
  }

  function setNavActive(v) {
    document.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("active", b.getAttribute("data-v") === v));
  }

  function abrirHamburguesa() {
    const old = document.getElementById("bds-drawer"); if (old) { old.remove(); return; }
    const drw = document.createElement("div");
    drw.id = "bds-drawer";
    drw.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.85);z-index:290000;display:flex;";
    drw.innerHTML = `
      <div style="width:295px;max-width:85vw;background:#0b1322;border-right:1px solid #1e293b;padding:16px;display:flex;flex-direction:column;gap:7px;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;"><img src="${IMG_BUHO}" width="30" height="30"/><b style="color:#fff;">Menú CTPMN • C02</b></div>
          <button id="dw-x" style="background:#7f1d1d;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">✕</button>
        </div>
        ${[
          ["inicio", null, "🏠 Inicio & 8 Roles"],
          ["admin", "horarios", "📅 Horarios (Profes y Estudiantes)"],
          ["admin", "permisos", "📝 Solicitar Permiso Personal"],
          ["admin", "justificaciones", "🎓 Justificar Estudiante"],
          ["admin", "bandeja", "🏛️ Bandeja Dirección (1-Clic)"],
          ["admin", "notas", "📊 Registro de Notas Excel"],
          ["admin", "qr", "🪪 Carné & Escáner QR SHA-256"],
          ["practica", null, "🧭 Práctica Libre y Guiada"],
          ["simulacro", null, "⏱️ Simulacro (10–60 Ítems)"],["admision", null, "🎓 Admisión UCR/TEC/UNA/UNED/UTN"],
          ["biblioteca", null, "📚 Libros & Afiches Marca Blanca"],
          ["juegos", null, "♟️ Ajedrez FIDE & 6 Juegos"]
        ].map(([k, p, l]) => `<button data-dw="${k}" data-dp="${p||''}" style="text-align:left;background:#131f33;color:#f1f5f9;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;min-height:42px;">${l}</button>`).join("")}
        <button id="dw-chat" style="text-align:left;background:#064e3b;color:#6ee7b7;border:1px solid #10b981;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;min-height:42px;">💬 Chats Subgrupos A/B</button>
        <button id="dw-out" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;min-height:42px;">🚪 Cerrar Sesión</button>
      </div>
    `;
    document.body.appendChild(drw);
    document.getElementById("dw-x").onclick = () => drw.remove();
    document.getElementById("dw-chat").onclick = () => { drw.remove(); toggleChats(); };
    document.getElementById("dw-out").onclick = () => { drw.remove(); cerrarSesion(); };
    drw.querySelectorAll("[data-dw]").forEach(b => b.onclick = () => { drw.remove(); window.bdsGo(b.getAttribute("data-dw"), b.getAttribute("data-dp") || null); });
  }

  function iniciarApp(vistaInicial = "inicio") {
    const s = getSesion(); if (!s) { mostrarLogin("login"); return; }
    document.body.classList.add("bds-authenticated");
    inyectarEstilos(); setFavicon();
    ["bds-header","bds-subnav","bds-shell","bds-dock"].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
    const xp = getXP();

    const hdr = document.createElement("header");
    hdr.id = "bds-header";
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;min-width:0;">
        <button id="btn-hm" aria-label="Menú" style="background:#131f33;color:#fff;border:1px solid #334155;width:38px;height:38px;border-radius:8px;font-size:18px;cursor:pointer;flex-shrink:0;">☰</button>
        <img src="${IMG_ESCUDO}" width="26" height="30" alt="Escudo CTPMN" class="hide-sm"/>
        <img src="${IMG_BUHO}" width="32" height="32" alt="Búho Azul" style="cursor:pointer;" onclick="window.bdsGo('inicio')"/>
        <div style="min-width:0;cursor:pointer;" onclick="window.bdsGo('inicio')">
          <div style="font-size:14px;font-weight:900;color:#fff;white-space:nowrap;">prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</div>
          <div style="font-size:10px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">CTP Mercedes Norte • Circuito 02 • ${s.rol}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <span id="bds-xp-pill" class="hide-sm" style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:5px 9px;border-radius:7px;font-size:11px;font-weight:800;">🔥 ${xp.racha}d • ⚡ ${xp.xp} XP</span>
        <button id="btn-ch" style="background:#064e3b;color:#6ee7b7;border:1px solid #10b981;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;min-height:36px;">💬 Chats</button>
        <button id="btn-out" style="background:transparent;color:#fca5a5;border:1px solid #7f1d1d;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;min-height:36px;">Salir</button>
      </div>
    `;

    const sub = document.createElement("nav");
    sub.id = "bds-subnav";
    sub.innerHTML = [
      ["inicio","🏠 Inicio & 8 Roles"],
      ["admin","📅 Horarios, Permisos & Dirección"],
      ["practica","🧭 Práctica Guiada"],
      ["simulacro","⏱️ Simulacro (10–60)"],["admision","🎓 Admisión UCR/TEC/UNA/UNED"],
      ["biblioteca","📚 Libros & Afiches"],
      ["fase2","📋 Asistencia & CSP"],["fase3","📘 Planes & 50 Esp."],["fase4","🚦 MOPT, 6 Idiomas & Lab"],["fase5","📊 Libreta REA/SEA"],["juegos","♟️ Juegos & Ajedrez"]
    ].map(([k, l]) => `<button data-v="${k}" class="bds-nav-btn">${l}</button>`).join("");

    const shell = document.createElement("main");
    shell.id = "bds-shell";

    const dock = document.createElement("nav");
    dock.id = "bds-dock";
    dock.innerHTML = `
      <button class="bds-dock-b" data-v="inicio"><span>🏠</span><span>Inicio</span></button>
      <button class="bds-dock-b" data-v="admin"><span>📅</span><span>Gestión</span></button>
      <button class="bds-dock-b" data-v="simulacro"><span>⏱️</span><span>Simulacro</span></button>
      <button class="bds-dock-b" data-v="juegos"><span>♟️</span><span>Juegos</span></button>
      <button class="bds-dock-b" id="dk-ch"><span>💬</span><span>Chats</span></button>
    `;

    document.body.prepend(shell); document.body.prepend(sub); document.body.prepend(hdr); document.body.appendChild(dock);

    window.bdsGo = function (v, subParam) {
      if (simTimer) { clearInterval(simTimer); simTimer = null; }
      setNavActive(v);
      if (v === "admin") {
        if (window.BDS_RENDER_ADMIN_SUITE) window.BDS_RENDER_ADMIN_SUITE(shell, subParam || "horarios", { sesion: getSesion(), sha256Hex, generarQRSVG, ganarXP, IMG_ESCUDO, IMG_BUHO, IMG_MEP });
      }
      else if (v === "practica") renderEvaluacion(shell, "guiada", subParam || "ALL");
      else if (v === "simulacro") renderEvaluacion(shell, "simulacro", subParam || "ALL");
      else if (v === "admision") { if (window.BDS_RENDER_ADMISION) window.BDS_RENDER_ADMISION(shell, subParam || "ucr", ganarXP); } else if (v === "biblioteca") { if (window.BDS_RENDER_BIBLIOTECA_ILUSTRADA) window.BDS_RENDER_BIBLIOTECA_ILUSTRADA(shell, { malla: window.BDS_MALLA_MEP || [], ganarXP, abrirPractica: (m, a) => { setNavActive(m === "simulacro" ? "simulacro" : "practica"); renderEvaluacion(shell, m, a); }, IMG_ESCUDO, IMG_MEP }); else renderBiblioteca(shell); }
            else if (v === "fase2") { if (window.BDS_RENDER_FASE2) window.BDS_RENDER_FASE2(shell, subParam, { sesion: getSesion(), sha256Hex, generarQRSVG, ganarXP }); }
      else if (v === "fase3") { if (window.BDS_RENDER_FASE3) window.BDS_RENDER_FASE3(shell); }
      else if (v === "fase4") { if (window.BDS_RENDER_FASE4) window.BDS_RENDER_FASE4(shell, subParam, ganarXP); }
      else if (v === "fase5") { if (window.BDS_RENDER_FASE5_REA) window.BDS_RENDER_FASE5_REA(shell, { sesion: getSesion() }); }
      else if (v === "direccion") { if (window.BDS_RENDER_DIRECCION_Y_FAMILIA) window.BDS_RENDER_DIRECCION_Y_FAMILIA(shell, getSesion()); }
      else if (v === "juegos") window.BDS_RENDER_SALA_JUEGOS(shell, ganarXP);
      else renderInicio(shell);
      window.scrollTo(0, 0);
    };

    document.getElementById("btn-hm").onclick = abrirHamburguesa;
    if (s.visitante) { ["btn-ch","dk-ch"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; }); } else { document.getElementById("btn-ch").onclick = toggleChats; } /* bds-visitante-lock */
    document.getElementById("btn-out").onclick = cerrarSesion;
    document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => window.bdsGo(b.getAttribute("data-v")));
    window.bdsGo(vistaInicial);
  }

  window.addEventListener("DOMContentLoaded", () => {
    inyectarEstilos(); setFavicon();
    if (location.hash.includes("verificar-horario/")) { const h = location.hash.split("verificar-horario/")[1]; const res = window.BDS_VERIFY_HASH ? window.BDS_VERIFY_HASH(h) : { ok: false }; alert(res.ok ? ("✅ Verificado CTPMN: " + res.rec.holder_name + " (" + res.rec.doc_type + ")") : "Hash no encontrado en verification_registry."); } const s = getSesion(); if (s && s.email) iniciarApp("inicio");
    else mostrarLogin("login");
  });
})();