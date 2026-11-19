(function () {
  const TRIAL_MAP_KEY = "bds_beta13_users_v190";
  const SUB_PAY_KEY = "bds_sub_payments_v190";
  const HABIT_KEY = "bds_habitos_estudio_v190";
  const SINPE_NUM = "60906359";
  const SINPE_FMT = "+506 6090 6359";
  const SINPE_TITULAR = "Max Salazar Sánchez (Banco Popular)";

  const PLANES = [
    { id: "part_anual", nombre: "Particular Anual", precio: "₡2,500 / año", color: "#0284c7", detalle: "MOPT (A–D), Admisión UCR/TEC/UNA/UNED/UTN, 29 áreas de práctica, simulacros, hábitos, racha y XP. Sin administración educativa." },
    { id: "part_vida", nombre: "Particular Vitalicio (De por vida)", precio: "₡3,500 pago único", color: "#059669", detalle: "Acceso permanente a todas las prácticas, simulacros MOPT y Admisión Universitaria sin renovaciones." },
    { id: "est_inst", nombre: "Estudiante en Institución Activa", precio: "₡1,000 / año", color: "#0f766e", detalle: "Para colegios/escuelas con licencia institucional (el centro define su cuota de ₡3,000–₡4,000 y conserva la diferencia)." },
    { id: "doc_inst", nombre: "Docente en Institución Activa", precio: "₡2,000 / año", color: "#7c3aed", detalle: "Matrícula de estudiantes, libreta REA, asistencia automática por lecciones efectivas y planeamiento IA." },
    { id: "doc_indep", nombre: "Docente Independiente", precio: "₡3,500 / año", color: "#6d28d9", detalle: "Acceso total a herramientas docentes, planeamiento inverso IA, asistencia automática REA y banco de 9,400+ ítems." },
    { id: "inst_anual", nombre: "Institución Educativa (Competencia SICAI)", precio: "₡19,100 / año", color: "#b45309", detalle: "Administración educativa total: matrícula QR SHA-256, horarios IA sin choques, comedor QR, marca blanca y estadísticas." }
  ];

  function loadTrialMap() { try { return JSON.parse(localStorage.getItem(TRIAL_MAP_KEY)) || {}; } catch { return {}; } }
  function saveTrialMap(m) { localStorage.setItem(TRIAL_MAP_KEY, JSON.stringify(m)); }
  function loadPay() { try { return JSON.parse(localStorage.getItem(SUB_PAY_KEY)) || []; } catch { return []; } }
  function savePay(a) { localStorage.setItem(SUB_PAY_KEY, JSON.stringify(a)); }

  function getEstadoCuenta(sesion) {
    if (!sesion || sesion.visitante) return { tipo: "visitante", diasRestantes: 0, bloqueado: false, etiqueta: "Exploración Básica (Sin cuenta)" };
    const mail = (sesion.email || "").toLowerCase().trim();
    if (sesion.rolReal === "SuperAdmin" || mail === "maxi.salsa@gmail.com" || mail === "max.salazar.sanchez@mep.go.cr") {
      return { tipo: "vitalicio", diasRestantes: 9999, bloqueado: false, etiqueta: "👑 SuperAdmin Vitalicio" };
    }

    // Verificar si tiene plan Activo o Cortesía en Trazabilidad
    if (window.BDS_TRAZABILIDAD && window.BDS_TRAZABILIDAD.loadUsers) {
      const u = window.BDS_TRAZABILIDAD.loadUsers().find(x => (x.email || "").toLowerCase() === mail);
      if (u && (u.estado === "Activo" || u.estado === "Cortesía")) {
        if (u.vence === "Permanente" || !u.vence || u.vence === "—") {
          return { tipo: "activo", diasRestantes: 365, bloqueado: false, etiqueta: `✅ ${u.plan || u.estado}` };
        }
        const diffVence = Math.ceil((new Date(u.vence).getTime() - Date.now()) / 86400000);
        if (diffVence > 0) return { tipo: "activo", diasRestantes: diffVence, bloqueado: false, etiqueta: `✅ ${u.plan} (${diffVence}d)` };
      }
    }

    // Beta de 13 días SOLO para cuentas logueadas
    const map = loadTrialMap();
    if (!map[mail]) {
      map[mail] = { startedAt: Date.now() };
      saveTrialMap(map);
    }
    const elapsedDays = Math.floor((Date.now() - Number(map[mail].startedAt)) / 86400000);
    const left = Math.max(0, 13 - elapsedDays);
    return {
      tipo: "beta",
      diasRestantes: left,
      bloqueado: left <= 0,
      etiqueta: left > 0 ? `🎁 Beta gratis: ${left} día${left === 1 ? "" : "s"}` : "🔒 Beta 13 días finalizada"
    };
  }

  function isLocked(sesion) {
    return getEstadoCuenta(sesion).bloqueado;
  }

  function openPlanesModal(sesion, onGoLogin) {
    const old = document.getElementById("bds-planes-modal"); if (old) old.remove();
    const modal = document.createElement("div");
    modal.id = "bds-planes-modal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.92);z-index:298000;display:flex;align-items:flex-start;justify-content:center;padding:16px 10px;overflow-y:auto;";
    modal.innerHTML = `
      <div class="bds-card" style="max-width:920px;width:100%;padding:20px;border-color:#38bdf8;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;">
          <div>
            <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">ECOSISTEMA ACCESIBLE PARA COSTA RICA • 13 DÍAS BETA GRATIS AL REGISTRARSE</span>
            <h2 style="margin:5px 0 0;font-size:19px;color:#fff;">💎 Planes Oficiales pracTICAtecnica.com (SINPE ${SINPE_FMT})</h2>
          </div>
          <button id="pm-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-bottom:14px;">
          ${PLANES.map(p => `
            <div style="background:#070d19;border:1px solid #334155;border-top:4px solid ${p.color};border-radius:12px;padding:13px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
              <div>
                <div style="font-size:12px;font-weight:800;color:#93c5fd;">${p.nombre}</div>
                <div style="font-size:20px;font-weight:900;color:#fff;margin:4px 0;">${p.precio}</div>
                <p style="margin:0;font-size:12px;color:#cbd5e1;line-height:1.45;">${p.detalle}</p>
              </div>
              <a href="https://wa.me/506${SINPE_NUM}?text=${encodeURIComponent(`Hola, deseo activar el plan ${p.nombre} (${p.precio}) en pracTICAtecnica.com. Correo: ${(sesion && sesion.email) || ""}`)}" target="_blank" rel="noopener" style="display:block;text-align:center;background:${p.color};color:#fff;padding:8px;border-radius:8px;font-size:12px;font-weight:800;text-decoration:none;">📲 Activar por SINPE / WhatsApp</a>
            </div>
          `).join("")}
        </div>

        <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div style="font-size:12px;color:#e2e8f0;">
            <b>SINPE Móvil Oficial:</b> <span style="color:#34d399;font-weight:900;font-size:14px;">${SINPE_FMT}</span> • <b>${SINPE_TITULAR}</b><br/>
            <span style="color:#94a3b8;">Incluye Carné Estudiantil QR SHA-256, Comedor QR, Asistencia Automática REA, Libreta y Horarios IA en modalidad institucional.</span>
          </div>
          ${onGoLogin ? `<button id="pm-reg" style="background:#1d4ed8;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-weight:800;cursor:pointer;">🚀 Crear cuenta (13 días Beta gratis)</button>` : ""}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("pm-cls").onclick = () => modal.remove();
    if (document.getElementById("pm-reg")) document.getElementById("pm-reg").onclick = () => { modal.remove(); onGoLogin(); };
  }

  // Pantalla de bloqueo automático al vencer los 13 días de Beta
  function renderPaywall(sesion, onLogout) {
    const old = document.getElementById("bds-paywall-v190"); if (old) old.remove();
    const wrap = document.createElement("div");
    wrap.id = "bds-paywall-v190";
    wrap.style.cssText = "position:fixed;inset:0;background:radial-gradient(circle at 50% 0%,#1e1b4b 0%,#060c17 75%);z-index:299500;display:flex;align-items:flex-start;justify-content:center;padding:18px 12px;overflow-y:auto;";
    wrap.innerHTML = `
      <div class="bds-card" style="max-width:860px;width:100%;padding:22px;border:2px solid #f59e0b;margin:auto 0;">
        <div style="text-align:center;margin-bottom:14px;">
          <span style="background:#b45309;color:#fff;font-size:11px;font-weight:800;padding:4px 12px;border-radius:99px;">🔒 PERIODO BETA DE 13 DÍAS FINALIZADO</span>
          <h2 style="margin:8px 0 4px;font-size:21px;color:#fff;">Activa tu acceso permanente en pracTICAtecnica.com</h2>
          <p style="margin:0;font-size:13px;color:#cbd5e1;">Cuenta: <b>${sesion.email}</b> (${sesion.rol}). Selecciona tu plan y envía el comprobante SINPE Móvil a <b style="color:#34d399;">${SINPE_FMT}</b> (${SINPE_TITULAR}).</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin-bottom:14px;">
          ${PLANES.map(p => `
            <div style="background:#070d19;border:1px solid #334155;border-top:4px solid ${p.color};border-radius:10px;padding:12px;">
              <div style="font-size:11.5px;font-weight:800;color:#93c5fd;">${p.nombre}</div>
              <div style="font-size:18px;font-weight:900;color:#fff;margin:3px 0;">${p.precio}</div>
              <div style="font-size:11.5px;color:#94a3b8;">${p.detalle}</div>
            </div>
          `).join("")}
        </div>

        <form id="pw-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;align-items:end;margin-bottom:12px;">
          <div>
            <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">Plan a activar:</label>
            <select id="pw-pl" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              ${PLANES.map(p => `<option value="${p.id}">${p.nombre} (${p.precio})</option>`).join("")}
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:#94a3b8;display:block;margin-bottom:3px;">N.° Comprobante SINPE Móvil:</label>
            <input id="pw-ref" type="text" required placeholder="Ej: 20261118009876" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
          </div>
          <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-weight:800;cursor:pointer;">📤 Registrar Comprobante y Abrir WhatsApp</button>
        </form>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <span style="font-size:11.5px;color:#94a3b8;">¿Tu institución ya está activa o tienes código de cortesía? Escríbenos por WhatsApp al ${SINPE_FMT}.</span>
          <button id="pw-out" style="background:#7f1d1d;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">🚪 Cerrar Sesión</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    document.getElementById("pw-out").onclick = () => { wrap.remove(); if (onLogout) onLogout(); };
    document.getElementById("pw-f").onsubmit = (e) => {
      e.preventDefault();
      const plId = document.getElementById("pw-pl").value;
      const ref = document.getElementById("pw-ref").value.trim();
      const pl = PLANES.find(x => x.id === plId) || PLANES[0];
      const arr = loadPay();
      arr.unshift({ fecha: new Date().toLocaleString("es-CR"), email: sesion.email, rol: sesion.rol, plan: pl.nombre, ref, estado: "PENDIENTE" });
      savePay(arr);
      window.open(`https://wa.me/506${SINPE_NUM}?text=${encodeURIComponent(`Hola Max, adjunto comprobante SINPE #${ref} para activar ${pl.nombre} (${pl.precio}) en la cuenta ${sesion.email}.`)}`, "_blank");
      alert("✅ Comprobante registrado. En cuanto administración confirme el SINPE tu cuenta quedará activa de inmediato.");
    };
  }

  // Vitrina comercial exclusiva para modo Visitante (sin cuenta)
  function prependGuestPromo(shell, onGoLogin) {
    if (!shell || document.getElementById("bds-guest-promo")) return;
    const promo = document.createElement("div");
    promo.id = "bds-guest-promo";
    promo.className = "bds-card";
    promo.style.cssText = "margin-bottom:14px;background:linear-gradient(135deg,#0f2247 0%,#0b1322 100%);border:1.5px solid #38bdf8;";
    promo.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
        <div>
          <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">MODO EXPLORACIÓN SIN CUENTA • PRUEBA 13 DÍAS BETA AL REGISTRARTE</span>
          <h3 style="margin:5px 0 2px;font-size:16.5px;color:#fff;">🚀 Desbloquea todo el Ecosistema Educativo y Particular</h3>
          <p style="margin:0;font-size:12px;color:#cbd5e1;">Actualmente navegas gratis en ejercicios básicos y los <b>10 juegos</b> (Ajedrez, Parejas, Adivina Quién, Impostor Among Us y más). Crea tu cuenta para activar <b>13 días Beta gratis</b>.</p>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button id="gp-reg" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎁 Activar 13 Días Beta Gratis</button>
          <button id="gp-pl" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">💎 Ver Planes (Desde ₡1,000)</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:8px;font-size:11.5px;">
        <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:9px;padding:9px;"><b style="color:#38bdf8;">🪪 Carné QR SHA-256</b><div style="color:#94a3b8;">Identificación digital verificable para portón y trámites.</div></div>
        <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:9px;"><b style="color:#34d399;">🍽️ Comedor Escolar QR</b><div style="color:#94a3b8;">Becas PANEA, saldo en colones y pago SINPE a la Junta.</div></div>
        <div style="background:#070d19;border:1px solid #f59e0b;border-radius:9px;padding:9px;"><b style="color:#fbbf24;">📊 Notas y Asistencia Auto</b><div style="color:#94a3b8;">Cálculo automático REA por lecciones efectivas y CSV SEA.</div></div>
        <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:9px;"><b style="color:#c084fc;">🚗 MOPT & Admisión UCR</b><div style="color:#94a3b8;">Particulares ₡2,500/año o ₡3,500 vitalicio • Colegios ₡19,100/año.</div></div>
      </div>
    `;
    shell.prepend(promo);
    document.getElementById("gp-reg").onclick = () => { if (onGoLogin) onGoLogin(); };
    document.getElementById("gp-pl").onclick = () => openPlanesModal(null, onGoLogin);
  }

  // Panel de Hábitos, Consejos, Seguimiento y Racha (Particular & Estudiante)
  function renderHabitos(shell, sesion, xp) {
    const hoy = new Date().toISOString().slice(0, 10);
    let data;
    try { data = JSON.parse(localStorage.getItem(HABIT_KEY)); } catch {}
    if (!data || data.fecha !== hoy) {
      data = {
        fecha: hoy,
        metas: [
          { id: "h1", txt: "Completar 1 práctica guiada de 10 preguntas (sin distracciones)", ok: false },
          { id: "h2", txt: "Hacer 1 simulacro cronometrado (MOPT, Admisión o Especialidad)", ok: false },
          { id: "h3", txt: "Repasar las explicaciones de al menos 3 errores cometidos", ok: false },
          { id: "h4", txt: "Jugar 1 partida educativa (Wordle, Trivia Kahoot o Impostor) para mantener racha", ok: false },
          { id: "h5", txt: "Dormir 7–8 horas e hidratarse bien para consolidar memoria", ok: false }
        ]
      };
      localStorage.setItem(HABIT_KEY, JSON.stringify(data));
    }

    const consejos = [
      "⏱️ Técnica Pomodoro 25/5: estudia 25 minutos enfocado en una sola materia y descansa 5 minutos sin celular.",
      "🧠 Recuperación activa: responde primero sin mirar el manual y luego lee la justificación; retienes 3 veces más.",
      "🚦 Para el examen MOPT: practica en bloques de 40 preguntas (igual que COSEVI) hasta superar 85% tres veces seguidas.",
      "🎓 Para Admisión UCR/TEC/UNA: lee primero la pregunta antes del texto y descarta extremos absolutos ('siempre', 'nunca').",
      "🔥 Protege tu racha diaria: 10 minutos todos los días superan a 4 horas de madrugada antes del examen."
    ];

    function drawH() {
      const done = data.metas.filter(m => m.ok).length;
      const pct = Math.round((done / data.metas.length) * 100);
      const est = getEstadoCuenta(sesion);
      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">SEGUIMIENTO PERSONAL • ${est.etiqueta.toUpperCase()}</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🔥 Hábitos de Estudio, Consejos, Racha y Experiencia</h2>
            </div>
            <button id="hb-pl" style="background:#1d4ed8;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">💎 Ver Mi Plan</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin-bottom:14px;">
            <div style="background:#070d19;border:1px solid #fbbf24;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Racha Activa</div><div style="font-size:24px;font-weight:900;color:#fbbf24;">🔥 ${xp.racha}d</div></div>
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Experiencia Total</div><div style="font-size:24px;font-weight:900;color:#38bdf8;">⚡ ${xp.xp} XP</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Rango Actual</div><div style="font-size:15px;font-weight:900;color:#c084fc;margin-top:6px;">${xp.nivel}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Metas de Hoy</div><div style="font-size:24px;font-weight:900;color:#34d399;">${pct}%</div></div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <h3 style="margin:0 0 10px;font-size:15px;color:#34d399;">✅ Lista Diaria de Hábitos (${done}/${data.metas.length})</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${data.metas.map((m, i) => `
                  <label style="display:flex;align-items:center;gap:9px;background:#0b1322;border:1px solid ${m.ok?'#10b981':'#334155'};padding:9px 11px;border-radius:8px;font-size:12.5px;cursor:pointer;">
                    <input type="checkbox" data-hi="${i}" class="hb-chk" ${m.ok?"checked":""} style="width:18px;height:18px;"/>
                    <span style="text-decoration:${m.ok?'line-through':'none'};color:${m.ok?'#6ee7b7':'#f1f5f9'};">${m.txt}</span>
                  </label>
                `).join("")}
              </div>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">💡 Consejos de Alto Rendimiento</h3>
              <div style="display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:#cbd5e1;">
                ${consejos.map(c => `<div style="background:#0b1322;border-left:3px solid #38bdf8;padding:9px 10px;border-radius:7px;">${c}</div>`).join("")}
              </div>
              <div style="margin-top:10px;font-size:11.5px;color:#fbbf24;"><b>Medallas obtenidas:</b> ${(xp.medallas || []).join(" • ")}</div>
            </div>
          </div>
        </div>
      `;
      document.getElementById("hb-pl").onclick = () => openPlanesModal(sesion, null);
      shell.querySelectorAll(".hb-chk").forEach(ch => ch.onchange = () => {
        data.metas[Number(ch.getAttribute("data-hi"))].ok = ch.checked;
        localStorage.setItem(HABIT_KEY, JSON.stringify(data));
        drawH();
      });
    }
    drawH();
  }

  // Utilidad para SuperAdmin: simular vencimiento de beta en una cuenta para pruebas
  function setTrialDaysForTest(email, daysAgo) {
    const map = loadTrialMap();
    map[(email || "").toLowerCase().trim()] = { startedAt: Date.now() - daysAgo * 86400000 };
    saveTrialMap(map);
  }

  window.BDS_SUSCRIPCION = { PLANES, getEstadoCuenta, isLocked, openPlanesModal, renderPaywall, prependGuestPromo, renderHabitos, setTrialDaysForTest };
})();