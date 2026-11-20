(function () {
  const TRIAL_KEY = "bds_beta_13d_v212";
  const HAB_KEY = "bds_habitos_v190";
  const SINPE_NUM = "6090-6359";
  const WA_LINK = "https://wa.me/50660906359";
  const PAYPAL_URL = "https://www.paypal.com/ncp/payment/PRACTICATECNICA";

  function loadTrials() { try { return JSON.parse(localStorage.getItem(TRIAL_KEY)) || {}; } catch { return {}; } }
  function saveTrials(m) { localStorage.setItem(TRIAL_KEY, JSON.stringify(m)); }

  function getEstadoCuenta(sesion) {
    if (!sesion || sesion.visitante) return { tipo: "visitante", diasRestantes: 0, bloqueado: false, etiqueta: "Modo Visitante Gratis" };
    const mail = (sesion.email || "").toLowerCase().trim();

    // Propietario, Admins (Daniel y Aarón) y Directora siempre tienen acceso garantizado
    if (mail === "maxi.salsa@gmail.com" || sesion.rol === "SuperAdmin" || sesion.rolReal === "SuperAdmin") {
      return { tipo: "propietario", diasRestantes: 9999, bloqueado: false, etiqueta: "👑 Propietario Vitalicio" };
    }
    if (sesion.rol === "Admin" || (mail.includes("laura") && mail.includes("ramon"))) {
      return { tipo: "admin", diasRestantes: 9999, bloqueado: false, etiqueta: "🛡️ Acceso Administrativo Activo" };
    }

    // Revisar si tiene licencia pagada o cortesía vigente en Trazabilidad
    if (window.BDS_TRAZABILIDAD && window.BDS_TRAZABILIDAD.loadUsers) {
      const u = window.BDS_TRAZABILIDAD.loadUsers().find(x => (x.email || "").toLowerCase() === mail);
      if (u) {
        if (u.estado === "Bloqueado" || u.estado === "Desactivado") {
          return { tipo: "bloqueado", diasRestantes: 0, bloqueado: true, etiqueta: "🚫 Cuenta Suspendida" };
        }
        const pl = String(u.plan || "").toLowerCase();
        if (u.estado === "Cortesía" || pl.includes("pagad") || pl.includes("vitalicio") || pl.includes("anualidad")) {
          if (!u.vence || u.vence === "Permanente" || new Date(u.vence).getTime() >= Date.now()) {
            return { tipo: "licencia", diasRestantes: 365, bloqueado: false, etiqueta: "✅ Licencia Activa" };
          }
        }
      }
    }

    // Control real de 13 días gratis Beta por correo (Google o MEP)
    const map = loadTrials();
    if (!map[mail]) {
      map[mail] = Date.now();
      saveTrials(map);
    }
    const elapsedDays = (Date.now() - Number(map[mail])) / 86400000;
    const left = Math.max(0, Math.ceil(13 - elapsedDays));
    if (elapsedDays >= 13) {
      return { tipo: "expirado", diasRestantes: 0, bloqueado: true, etiqueta: "🔒 Prueba de 13 días finalizada" };
    }
    return { tipo: "beta", diasRestantes: left, bloqueado: false, etiqueta: `🎁 Beta Gratis (${left} día${left === 1 ? "" : "s"} restantes)` };
  }

  function isLocked(sesion) {
    return getEstadoCuenta(sesion).bloqueado === true;
  }

  function paymentOptionsHtml(sesion) {
    const mail = (sesion && sesion.email) || "mi cuenta";
    const waMsg = encodeURIComponent(`Hola Ing. Max Salazar Sánchez, adjunto comprobante para activar mi licencia en pracTICAtecnica.com (${mail}).`);
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:9px;margin:12px 0;text-align:left;">
        <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:11px;">
          <b style="color:#34d399;font-size:13px;">📲 SINPE Móvil (CR)</b>
          <div style="font-size:11.5px;color:#cbd5e1;margin:4px 0;">Número: <b>+506 ${SINPE_NUM}</b><br/>Banco Popular • Ing. Max Salazar Sánchez</div>
          <a href="${WA_LINK}?text=${waMsg}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;background:#059669;color:#fff;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;text-decoration:none;margin-top:6px;">💬 Enviar Comprobante</a>
        </div>
        <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:11px;">
          <b style="color:#38bdf8;font-size:13px;">💳 Tarjeta (Visa / MC)</b>
          <div style="font-size:11.5px;color:#cbd5e1;margin:4px 0;">Pago internacional seguro con tarjeta de débito o crédito.</div>
          <a href="${PAYPAL_URL}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;background:#1d4ed8;color:#fff;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;text-decoration:none;margin-top:6px;">💳 Pagar con Tarjeta</a>
        </div>
        <div style="background:#070d19;border:1px solid #fbbf24;border-radius:10px;padding:11px;">
          <b style="color:#fbbf24;font-size:13px;">🅿️ PayPal Directo</b>
          <div style="font-size:11.5px;color:#cbd5e1;margin:4px 0;">Paga en segundos con tu cuenta PayPal y recibe activación inmediata.</div>
          <a href="${PAYPAL_URL}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;background:#b45309;color:#fff;padding:7px;border-radius:7px;font-size:11.5px;font-weight:700;text-decoration:none;margin-top:6px;">🅿️ Pagar con PayPal</a>
        </div>
      </div>
      <div style="background:#0b1322;border:1px solid #1e3a8a;border-radius:9px;padding:9px;font-size:11.5px;color:#93c5fd;">
        <b>Planes Oficiales pracTICAtecnica.com:</b><br/>
        • <b>Institución Educativa:</b> ₡19,100/año (Estudiantes ₡1,000/año • Docentes ₡2,000/año)<br/>
        • <b>Particular (MOPT / Admisión / 29 áreas):</b> ₡2,500/año o ₡3,500 vitalicio
      </div>
    `;
  }

  function renderPaywall(sesion, onLogout) {
    const old = document.getElementById("bds-paywall-v190"); if (old) old.remove();
    const box = document.createElement("div");
    box.id = "bds-paywall-v190";
    box.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.96);z-index:300500;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;";
    box.innerHTML = `
      <div class="bds-card" style="max-width:650px;width:100%;padding:22px;border:2px solid #f59e0b;text-align:center;margin:auto 0;">
        <img src="/buho-oficial.png?v=212" width="58" height="58" alt="Búho Azul" style="border-radius:50%;margin-bottom:6px;"/>
        <h2 style="margin:0 0 6px;color:#fbbf24;">🔒 Tu prueba gratuita de 13 días ha finalizado</h2>
        <p style="margin:0 0 10px;font-size:13px;color:#cbd5e1;">Cuenta: <b>${sesion.email}</b>. Activa tu licencia institucional o particular con <b>Tarjeta, PayPal o SINPE Móvil</b> para recuperar el acceso completo al instante.</p>
        ${paymentOptionsHtml(sesion)}
        <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button id="pw-out" style="background:#334155;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:700;cursor:pointer;">🚪 Cambiar de Cuenta / Cerrar Sesión</button>
        </div>
      </div>
    `;
    document.body.appendChild(box);
    document.getElementById("pw-out").onclick = () => { box.remove(); if (onLogout) onLogout(); };
  }

  function openPlanesModal(sesion, onLogout) {
    const old = document.getElementById("bds-planes-modal"); if (old) old.remove();
    const m = document.createElement("div");
    m.id = "bds-planes-modal";
    m.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:299700;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;";
    m.innerHTML = `
      <div class="bds-card" style="max-width:650px;width:100%;padding:20px;border:2px solid #38bdf8;text-align:center;margin:auto 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <b style="color:#38bdf8;font-size:15px;">💎 Planes y Métodos de Pago — pracTICAtecnica.com</b>
          <button id="pl-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;">✕</button>
        </div>
        <p style="font-size:12.5px;color:#cbd5e1;margin:0 0 8px;">13 días gratis con Google o correo MEP. Luego eliges tu plan mediante <b>SINPE Móvil, Tarjeta o PayPal</b>.</p>
        ${paymentOptionsHtml(sesion)}
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById("pl-x").onclick = () => m.remove();
  }

  function prependGuestPromo(shell, onLogin) {
    if (!shell || shell.querySelector("#bds-guest-promo")) return;
    const d = document.createElement("div");
    d.id = "bds-guest-promo";
    d.style.cssText = "background:#0f2247;border:1px solid #38bdf8;border-radius:10px;padding:9px 12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px;";
    d.innerHTML = `<span>🎁 Estás en modo visitante. Inicia sesión con Google o correo MEP para <b>13 días gratis completos</b>.</span><div style="display:flex;gap:6px;"><button id="gp-pl" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;">💳 Ver Pagos</button><button id="gp-lg" style="background:#1d4ed8;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;">Entrar</button></div>`;
    shell.prepend(d);
    document.getElementById("gp-pl").onclick = () => openPlanesModal({ email: "visitante" }, onLogin);
    document.getElementById("gp-lg").onclick = () => { if (onLogin) onLogin(); };
  }

  function renderHabitos(shell, sesion, xp) {
    let habs = [];
    try { habs = JSON.parse(localStorage.getItem(HAB_KEY)) || []; } catch {}
    if (!habs.length) habs = [{ txt: "Practicar 15 minutos en pracTICA", done: false }, { txt: "Tomar 5 min de descanso cada 25 min", done: false }, { txt: "Completar 1 ejercicio de idiomas", done: false }];
    function drawH() {
      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <h2 style="margin:0;font-size:17px;">🔥 Mis Hábitos Diarios y Licencia</h2>
            <button id="hb-pay" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">💳 Planes (Tarjeta / PayPal / SINPE)</button>
          </div>
          <form id="hb-f" style="display:flex;gap:6px;margin-bottom:10px;">
            <input id="hb-in" type="text" required placeholder="Nuevo hábito diario..." style="flex:1;background:#070d19;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12.5px;"/>
            <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:8px 13px;border-radius:7px;font-weight:700;cursor:pointer;">+ Agregar</button>
          </form>
          <div style="display:flex;flex-direction:column;gap:7px;">
            ${habs.map((h, i) => `<label style="background:#070d19;border:1px solid ${h.done?'#10b981':'#334155'};border-radius:8px;padding:10px;display:flex;align-items:center;gap:9px;cursor:pointer;font-size:12.5px;"><input type="checkbox" data-hi="${i}" class="hb-c" ${h.done?"checked":""} style="width:18px;height:18px;"/> <span style="text-decoration:${h.done?'line-through':'none'};">${h.txt}</span></label>`).join("")}
          </div>
        </div>
      `;
      document.getElementById("hb-pay").onclick = () => openPlanesModal(sesion);
      document.getElementById("hb-f").onsubmit = (e) => { e.preventDefault(); habs.unshift({ txt: document.getElementById("hb-in").value.trim(), done: false }); localStorage.setItem(HAB_KEY, JSON.stringify(habs)); drawH(); };
      shell.querySelectorAll(".hb-c").forEach(c => c.onchange = () => { habs[Number(c.getAttribute("data-hi"))].done = c.checked; localStorage.setItem(HAB_KEY, JSON.stringify(habs)); drawH(); });
    }
    drawH();
  }

  window.BDS_SUSCRIPCION = { getEstadoCuenta, isLocked, renderPaywall, openPlanesModal, prependGuestPromo, renderHabitos, PAYPAL_URL, SINPE_NUM };
})();