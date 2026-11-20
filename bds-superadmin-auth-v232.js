(function () {
  if (typeof window === "undefined") return;

  const SESSION_KEY = "bds_session_v184_ctpmn_c02";
  const SUPERADMIN_EMAIL_HASH = "72e4fb070f33d3ce2a74b70cb4c9553ab283a5aa839170ea297ce15ea5bf654b";
  const CRED_HASH_KEY = "bds_cred_hashes_v232";
  const ATTEMPTS_KEY = "bds_auth_attempts_v232";
  const BITACORA_KEY = "bds_sec_bitacora_v228";
  const RELOAD_GUARD_KEY = "bds_login_reload_v232";
  const MAX_ATTEMPTS = 5;
  const SUPABASE_URL = "https://tmvhjmevhnaghwgpsqok.supabase.co";

  const ALL_ADMIN_ROLES = [
    "SuperAdmin",
    "Director(a)",
    "Subdirector(a)",
    "Docente MEP",
    "Orientador(a)",
    "Auxiliar Administrativo",
    "Auxiliar de Vigilancia (Seguridad)",
    "Conserje / Mantenimiento",
    "Estudiante",
    "Padre/Madre"
  ];

  async function sha256Hex(text) {
    const raw = String(text || "");
    const cryptoObj = (typeof globalThis !== "undefined" && globalThis.crypto) ? globalThis.crypto : null;
    if (cryptoObj && cryptoObj.subtle && typeof TextEncoder !== "undefined") {
      const buf = await cryptoObj.subtle.digest("SHA-256", new TextEncoder().encode(raw));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
  }

  function maskEmail(email) {
    const s = String(email || "").trim();
    const idx = s.indexOf("@");
    if (idx <= 1) return "***@***";
    return `${s[0]}***${s[idx - 1]}${s.slice(idx)}`;
  }

  function readJson(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function logSeguridad(evento, email, detalle) {
    try {
      const logs = readJson(BITACORA_KEY, []);
      logs.unshift({
        fecha: new Date().toLocaleString("es-CR"),
        evento: String(evento || "AUTH"),
        actor: maskEmail(email || "sistema@institucion.com"),
        detalle: String(detalle || ""),
        normativa: "Ley 8968 (PRODHAB) • RBAC Soberano v232"
      });
      localStorage.setItem(BITACORA_KEY, JSON.stringify(logs.slice(0, 400)));
    } catch {}
  }

  function getAttempts(emailHash) {
    const map = readJson(ATTEMPTS_KEY, {});
    return map[emailHash] || { count: 0, locked: false };
  }

  function setAttempts(emailHash, rec) {
    const map = readJson(ATTEMPTS_KEY, {});
    if (!rec) delete map[emailHash];
    else map[emailHash] = rec;
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(map));
  }

  async function desbloquearCuenta(email) {
    const norm = String(email || "").trim().toLowerCase();
    if (!norm) return { ok: false, msg: "Indique el correo a desbloquear." };
    const eh = await sha256Hex(norm);
    setAttempts(eh, null);
    try {
      const oldMap = readJson("bds_auth_attempts_v228", {});
      delete oldMap[norm];
      localStorage.setItem("bds_auth_attempts_v228", JSON.stringify(oldMap));
    } catch {}
    logSeguridad("ADMIN_UNLOCK", norm, "Cuenta desbloqueada por SuperAdmin.");
    return { ok: true, msg: `Cuenta desbloqueada correctamente.` };
  }

  async function recuperarCambiarClave(email, nuevaClave, confirmarClave) {
    const norm = String(email || "").trim().toLowerCase();
    const p1 = String(nuevaClave || "");
    const p2 = String(confirmarClave || "");
    if (!norm || !norm.includes("@")) return { ok: false, msg: "Ingrese un correo institucional o personal válido." };
    if (p1.length < 6) return { ok: false, msg: "La nueva contraseña debe tener al menos 6 caracteres." };
    if (p1 !== p2) return { ok: false, msg: "La contraseña y su confirmación no coinciden." };

    const eh = await sha256Hex(norm);
    const ph = await sha256Hex(`bds-v232|${eh}|${p1}`);
    const creds = readJson(CRED_HASH_KEY, {});
    creds[eh] = { hash: ph, updatedAt: new Date().toISOString() };
    localStorage.setItem(CRED_HASH_KEY, JSON.stringify(creds));
    setAttempts(eh, null);
    logSeguridad("AUTH_PASSWORD_RESET", norm, "Contraseña actualizada con hash SHA-256.");
    return { ok: true, msg: "✅ Contraseña actualizada. Ya puede ingresar a la plataforma." };
  }

  async function autenticarUsuario({ email, nombre, rolSeleccionado, seccion, password, esOAuth }) {
    const norm = String(email || "").trim().toLowerCase();
    if (!norm || !norm.includes("@")) {
      return { ok: false, msg: "⚠️ Ingrese un correo electrónico válido (ej. usuario@est.mep.go.cr)." };
    }

    const emailHash = await sha256Hex(norm);
    const esSuperAdmin = (emailHash === SUPERADMIN_EMAIL_HASH);

    // Verificar bloqueo por 5 intentos fallidos
    const att = getAttempts(emailHash);
    if (att.locked && !esOAuth) {
      return {
        ok: false,
        locked: true,
        msg: "🔒 Cuenta bloqueada tras 5 intentos fallidos consecutivos. Comuníquese con soporte o use Recuperar contraseña."
      };
    }

    if (!esOAuth) {
      const pass = String(password || "");
      if (!pass) {
        return { ok: false, needPassword: true, msg: "⚠️ Ingrese su contraseña para continuar (o use «Recuperar / Crear clave»)." };
      }
      if (pass.length < 4) {
        return { ok: false, needPassword: true, msg: "⚠️ La contraseña debe tener al menos 4 caracteres." };
      }

      const passHash = await sha256Hex(`bds-v232|${emailHash}|${pass}`);
      const creds = readJson(CRED_HASH_KEY, {});
      if (creds[emailHash] && creds[emailHash].hash) {
        if (creds[emailHash].hash !== passHash) {
          const nextCount = Number(att.count || 0) + 1;
          const locked = nextCount >= MAX_ATTEMPTS;
          setAttempts(emailHash, { count: nextCount, locked, lastTry: new Date().toISOString() });
          logSeguridad("AUTH_FAIL", norm, `Clave incorrecta (${nextCount}/${MAX_ATTEMPTS})`);
          return {
            ok: false,
            locked,
            attempts: nextCount,
            msg: locked
              ? "🔒 Cuenta bloqueada tras 5 intentos fallidos. Comuníquese con el administrador de soporte."
              : `⚠️ Contraseña incorrecta (intento ${nextCount}/${MAX_ATTEMPTS}). Si la olvidó, pulse «Recuperar / Cambiar clave».`
          };
        }
      } else {
        // Primer ingreso en este dispositivo tras limpieza de caché: registra hash SHA-256 seguro
        creds[emailHash] = { hash: passHash, updatedAt: new Date().toISOString() };
        localStorage.setItem(CRED_HASH_KEY, JSON.stringify(creds));
        logSeguridad("AUTH_REGISTER_HASH", norm, "Credencial cifrada con SHA-256 inicializada.");
      }
    }

    // Limpiar intentos fallidos al autenticar correctamente
    setAttempts(emailHash, null);

    let rolFinal = String(rolSeleccionado || "Estudiante").trim();
    if (/estudiante\s*\/\s*rol/i.test(rolFinal)) rolFinal = "Estudiante";
    if (esSuperAdmin) {
      rolFinal = "SuperAdmin";
    }

    const sessionToken = (await sha256Hex(`${emailHash}|${Date.now()}|${rolFinal}`)).slice(0, 32);
    const sesion = {
      email: norm,
      nombre: String(nombre || (esSuperAdmin ? "Dirección SuperAdmin" : "Usuario Institucional")).trim(),
      rol: rolFinal,
      role: esSuperAdmin ? "SUPER_ADMIN" : rolFinal,
      esSuperAdmin,
      poderAbsoluto: esSuperAdmin,
      permisos: esSuperAdmin ? ["*", "superadmin", "porton", "notas", "horarios", "permisos", "ciberseguridad", "supabase", "qa"] : ["standard"],
      seccion: String(seccion || "11-1").trim(),
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      autenticado: true,
      betaOk: true,
      planActivo: true,
      oauth: Boolean(esOAuth),
      token: sessionToken,
      ts: Date.now()
    };

    const jsonSes = JSON.stringify(sesion);
    try { sessionStorage.setItem(SESSION_KEY, jsonSes); } catch {}
    try { localStorage.setItem(SESSION_KEY, jsonSes); } catch {}
    if (SESSION_KEY !== "bds_session_v184_ctpmn_c02") {
      try { sessionStorage.setItem("bds_session_v184_ctpmn_c02", jsonSes); } catch {}
      try { localStorage.setItem("bds_session_v184_ctpmn_c02", jsonSes); } catch {}
    }
    window.__BDS_SESSION = sesion;
    logSeguridad("AUTH_LOGIN_OK", norm, `Ingreso exitoso como ${rolFinal}${esSuperAdmin ? " (PODER ABSOLUTO)" : ""}`);

    return { ok: true, sesion };
  }

  function cerrarSesionLimpia() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    try { sessionStorage.removeItem("bds_session_v184_ctpmn_c02"); } catch {}
    try { localStorage.removeItem("bds_session_v184_ctpmn_c02"); } catch {}
    try { sessionStorage.removeItem(RELOAD_GUARD_KEY); } catch {}
    window.__BDS_SESSION = null;
    if (typeof window.location !== "undefined" && typeof window.location.reload === "function") {
      window.location.reload();
    }
  }

  function iniciarGoogleOAuth() {
    const redirectTo = encodeURIComponent(window.location.origin + "/");
    const oauthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
    window.location.href = oauthUrl;
  }

  // Capturar retorno de Google OAuth desde Supabase (#access_token=...)
  async function procesarRetornoOAuth() {
    try {
      const hash = String(window.location.hash || "");
      if (!hash.includes("access_token=")) return;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const token = params.get("access_token");
      if (!token) return;
      const parts = token.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const email = payload && payload.email;
      const nombre = (payload && payload.user_metadata && (payload.user_metadata.full_name || payload.user_metadata.name)) || "Usuario Google";
      if (email) {
        const res = await autenticarUsuario({ email, nombre, rolSeleccionado: "Docente MEP", seccion: "11-1", esOAuth: true });
        if (res.ok) {
          history.replaceState(null, "", window.location.pathname);
          window.location.reload();
        }
      }
    } catch {}
  }

  function mostrarBannerErrorLogin(btnSubmit, msg, esOk) {
    if (!btnSubmit || !btnSubmit.parentElement) return;
    let box = document.getElementById("bds-login-alert-v232");
    if (!box) {
      box = document.createElement("div");
      box.id = "bds-login-alert-v232";
      box.style.cssText = "margin:8px 0;padding:10px 12px;border-radius:8px;font-size:12px;font-weight:700;line-height:1.4;";
      btnSubmit.parentElement.insertBefore(box, btnSubmit);
    }
    box.style.background = esOk ? "#064e3b" : "#7f1d1d";
    box.style.border = esOk ? "1px solid #10b981" : "1px solid #f87171";
    box.style.color = "#fff";
    box.textContent = msg;
    try { box.scrollIntoView({ behavior: "smooth", block: "center" }); } catch {}
  }

  function abrirModalRecuperar(defaultEmail) {
    const old = document.getElementById("bds-recover-modal-v232");
    if (old) old.remove();
    const modal = document.createElement("div");
    modal.id = "bds-recover-modal-v232";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:300500;display:flex;align-items:center;justify-content:center;padding:14px;";
    modal.innerHTML = `
      <div style="background:#0b1322;border:2px solid #38bdf8;border-radius:14px;max-width:420px;width:100%;padding:18px;color:#f8fafc;font-family:Inter,Arial,sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <b style="color:#38bdf8;font-size:14px;">🔑 Recuperar o Cambiar Contraseña</b>
          <button type="button" id="bds-rec-close" style="background:#7f1d1d;color:#fff;border:none;padding:4px 9px;border-radius:6px;cursor:pointer;font-weight:700;">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <input id="bds-rec-mail" type="email" value="${String(defaultEmail || "").replace(/"/g, "")}" placeholder="usuario@est.mep.go.cr" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
          <input id="bds-rec-p1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
          <input id="bds-rec-p2" type="password" placeholder="Confirmar nueva contraseña" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
          <div id="bds-rec-msg" style="font-size:12px;color:#cbd5e1;"></div>
          <button type="button" id="bds-rec-save" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Guardar Nueva Contraseña</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("bds-rec-close").onclick = () => modal.remove();
    document.getElementById("bds-rec-save").onclick = async () => {
      const r = await recuperarCambiarClave(
        document.getElementById("bds-rec-mail").value,
        document.getElementById("bds-rec-p1").value,
        document.getElementById("bds-rec-p2").value
      );
      const msgEl = document.getElementById("bds-rec-msg");
      msgEl.style.color = r.ok ? "#34d399" : "#f87171";
      msgEl.textContent = r.msg;
      if (r.ok) setTimeout(() => modal.remove(), 1100);
    };
  }

  function mejorarFormularioLogin() {
    if (typeof document === "undefined" || !document.body) return;
    const buttons = Array.from(document.querySelectorAll("button"));
    const loginBtn = buttons.find((b) => /ingresar a la plataforma/i.test(b.textContent || ""));
    if (!loginBtn || loginBtn.getAttribute("data-bds-v232-wired") === "1") return;

    const form = loginBtn.closest("form") || loginBtn.parentElement;
    if (!form) return;
    loginBtn.setAttribute("data-bds-v232-wired", "1");

    // Asegurar que exista la opción SuperAdmin en el selector de rol
    const selects = Array.from(form.querySelectorAll("select"));
    const roleSelect = selects.find((s) => Array.from(s.options).some((o) => /estudiante|docente|rol|admin/i.test(o.textContent || "")));
    if (roleSelect && !Array.from(roleSelect.options).some((o) => o.value === "SuperAdmin" || /superadmin/i.test(o.textContent || ""))) {
      const opt = document.createElement("option");
      opt.value = "SuperAdmin";
      opt.textContent = "👑 SuperAdmin (Poder Absoluto)";
      roleSelect.insertBefore(opt, roleSelect.firstChild);
    }

    // Agregar botones de Google OAuth y Recuperar Clave si no existen
    if (!document.getElementById("bds-auth-extras-v232")) {
      const extras = document.createElement("div");
      extras.id = "bds-auth-extras-v232";
      extras.style.cssText = "margin-top:10px;display:flex;flex-direction:column;gap:8px;";
      extras.innerHTML = `
        <button type="button" id="bds-google-oauth-v232" style="width:100%;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:9px 12px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">🔵 Continuar con Google (OAuth)</button>
        <button type="button" id="bds-recover-btn-v232" style="width:100%;background:transparent;color:#38bdf8;border:1px dashed #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🔑 ¿Olvidó o desea cambiar su contraseña?</button>
      `;
      loginBtn.parentElement.insertBefore(extras, loginBtn.nextSibling);
      document.getElementById("bds-google-oauth-v232").onclick = () => iniciarGoogleOAuth();
      document.getElementById("bds-recover-btn-v232").onclick = () => {
        const emailIn = form.querySelector('input[type="email"], input[placeholder*="correo" i], input[placeholder*="gmail" i]');
        abrirModalRecuperar(emailIn ? emailIn.value : "");
      };
    }

    async function handleAuthAttempt(ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();

      const inputs = Array.from(form.querySelectorAll("input"));
      const emailIn = inputs.find((i) => i.type === "email" || /correo|gmail|email/i.test((i.placeholder || "") + (i.id || "") + (i.name || ""))) || inputs[0];
      const passIn = inputs.find((i) => i.type === "password" || /contrase|pass|clave/i.test((i.placeholder || "") + (i.id || "") + (i.name || "")));
      const nameIn = inputs.find((i) => i !== emailIn && i !== passIn && i.type !== "hidden" && i.type !== "checkbox");
      const secSelect = selects.find((s) => s !== roleSelect);

      const res = await autenticarUsuario({
        email: emailIn ? emailIn.value : "",
        nombre: nameIn ? nameIn.value : "",
        rolSeleccionado: roleSelect ? roleSelect.value : "Estudiante",
        seccion: secSelect ? secSelect.value : "11-1",
        password: passIn ? passIn.value : "",
        esOAuth: false
      });

      if (!res.ok) {
        mostrarBannerErrorLogin(loginBtn, res.msg, false);
        if (res.needPassword && passIn) {
          passIn.style.borderColor = "#f87171";
          passIn.focus();
        }
        if (res.locked) {
          loginBtn.disabled = true;
          loginBtn.style.opacity = "0.55";
        }
        return;
      }

      mostrarBannerErrorLogin(loginBtn, `✅ Bienvenido(a) como ${res.sesion.rol}. Ingresando a pracTICAtecnica.com...`, true);

      // Evitar bucle de recarga y montar la plataforma en vivo
      setTimeout(() => {
        try {
          if (typeof window.bdsRenderApp === "function") {
            window.bdsRenderApp();
            return;
          }
        } catch {}
        window.location.reload();
      }, 260);
    }

    if (form.tagName === "FORM") {
      form.addEventListener("submit", handleAuthAttempt, true);
    }
    loginBtn.addEventListener("click", handleAuthAttempt, true);
  }

  function inyectarBarraSuperAdminYLogout() {
    if (typeof document === "undefined" || !document.body) return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-superadmin-crown-v232")) return;

    let ses = null;
    try {
      ses = JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || "null");
    } catch {}
    if (!ses || !ses.email) return;

    const bar = document.createElement("div");
    bar.id = "bds-superadmin-crown-v232";
    bar.style.cssText = "background:#0b1322;border:1px solid #2563eb;border-radius:10px;padding:8px 12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11.5px;color:#f8fafc;";
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span style="background:${ses.esSuperAdmin ? '#d97706' : '#1d4ed8'};color:#fff;padding:3px 9px;border-radius:99px;font-weight:800;font-size:10.5px;">
          ${ses.esSuperAdmin ? "👑 SUPERADMIN • PODER ABSOLUTO ACTIVO" : "🔐 " + ses.rol}
        </span>
        <span style="color:#cbd5e1;">${ses.nombre} (${maskEmail(ses.email)})</span>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${ses.esSuperAdmin ? `<button type="button" id="bds-sa-unlock-v232" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🔓 Desbloquear Usuario</button>` : ""}
        <button type="button" id="bds-logout-v232" style="background:#dc2626;color:#fff;border:none;padding:5px 10px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">🚪 Cerrar Sesión</button>
      </div>
    `;
    shell.insertBefore(bar, shell.firstChild);

    const btnOut = document.getElementById("bds-logout-v232");
    if (btnOut) btnOut.onclick = () => cerrarSesionLimpia();

    const btnUnlock = document.getElementById("bds-sa-unlock-v232");
    if (btnUnlock) {
      btnUnlock.onclick = async () => {
        const targetMail = window.prompt("Ingrese el correo de la cuenta que desea desbloquear:");
        if (targetMail) {
          const r = await desbloquearCuenta(targetMail);
          window.alert(r.msg);
        }
      };
    }
  }

  // Asegurar que en bds-auth-guard.js el rol SuperAdmin siempre tenga prioridad si coincide el hash
  async function reforzarSesionExistente() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const ses = JSON.parse(raw);
      if (!ses || !ses.email) return;
      const eh = await sha256Hex(String(ses.email).trim().toLowerCase());
      if (eh === SUPERADMIN_EMAIL_HASH && ses.rol !== "SuperAdmin") {
        ses.rol = "SuperAdmin";
        ses.role = "SUPER_ADMIN";
        ses.esSuperAdmin = true;
        ses.poderAbsoluto = true;
        ses.permisos = ["*"];
        const s = JSON.stringify(ses);
        sessionStorage.setItem(SESSION_KEY, s);
        localStorage.setItem(SESSION_KEY, s);
      }
    } catch {}
  }

  window.BDS_SUPERADMIN_AUTH_V232 = {
    SESSION_KEY,
    SUPERADMIN_EMAIL_HASH,
    MAX_ATTEMPTS,
    ALL_ADMIN_ROLES,
    sha256Hex,
    autenticarUsuario,
    recuperarCambiarClave,
    desbloquearCuenta,
    cerrarSesionLimpia,
    iniciarGoogleOAuth
  };

  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      procesarRetornoOAuth();
      reforzarSesionExistente();
      mejorarFormularioLogin();
      inyectarBarraSuperAdminYLogout();
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => {
          mejorarFormularioLogin();
          inyectarBarraSuperAdminYLogout();
        }).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();