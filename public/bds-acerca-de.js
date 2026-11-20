(function () {
  const WHATSAPP_NUM = "50660906359";
  const WHATSAPP_TXT = "6090-6359 (solo WhatsApp)";
  const CONTACT_EMAIL = "maxi.salsa@gmail.com";

  function openAboutModal() {
    const old = document.getElementById("bds-about-modal");
    if (old) { old.remove(); return; }

    const stBank = window.__BDS_BANCO_STATS || { afterTotal: 350000, totalAreas: 29 };
    const buhoSrc = (window.BDS_BRAND && window.BDS_BRAND.get().mascota) || "/buho-oficial.png?v=202";

    const modal = document.createElement("div");
    modal.id = "bds-about-modal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.9);z-index:299400;display:flex;align-items:flex-start;justify-content:center;padding:16px 10px;overflow-y:auto;";

    modal.innerHTML = `
      <div class="bds-card" style="max-width:680px;width:100%;padding:20px;border:1.5px solid #38bdf8;margin:auto 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${buhoSrc}" width="44" height="44" alt="Búho Azul" style="border-radius:50%;"/>
            <div>
              <h2 style="margin:0;font-size:18px;color:#fff;">Acerca de prac<span style="color:#2dd4bf;">TICA</span>tecnica.com</h2>
              <div style="font-size:11px;color:#94a3b8;">Plataforma Educativa Multiplataforma • Versión PWA v202.0 • BDS Devs</div>
            </div>
          </div>
          <button id="ab-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
        </div>

        <!-- Aviso Legal Obligatorio -->
        <div style="background:#451a03;border:1.5px solid #f59e0b;border-radius:11px;padding:12px 14px;margin-bottom:14px;">
          <div style="font-size:12px;font-weight:800;color:#fbbf24;margin-bottom:4px;">⚠️ AVISO LEGAL E INDEPENDENCIA INSTITUCIONAL</div>
          <p style="margin:0;font-size:12.5px;color:#fef3c7;line-height:1.5;">
            <b>pracTICAtecnica.com NO es una aplicación oficial del Ministerio de Educación Pública (MEP) ni del MOPT / COSEVI.</b> Es una herramienta educativa y administrativa independiente desarrollada por <b>BDS Devs</b>, diseñada para alinearse de forma práctica a los programas de estudio, evaluación formativa y normativa pública vigente en Costa Rica.
          </p>
        </div>

        <!-- Créditos y Contacto Oficial -->
        <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:14px;margin-bottom:14px;">
          <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:8px;">CRÉDITOS, DESARROLLO Y SOPORTE GENERAL</div>
          <div style="font-size:15px;font-weight:800;color:#fff;">Ing. Max Salazar Sánchez</div>
          <div style="font-size:12.5px;color:#2dd4bf;font-weight:600;margin-bottom:10px;">Desarrollador y Docente • BDS Devs (Costa Rica)</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px;">
            <a href="https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent("Hola Ing. Max Salazar, le escribo desde pracTICAtecnica.com:")}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;gap:8px;background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:10px 12px;border-radius:9px;text-decoration:none;font-size:12.5px;font-weight:700;">
              <span>💬</span>
              <div><div>WhatsApp: +506 ${WHATSAPP_TXT}</div><div style="font-size:10.5px;color:#6ee7b7;font-weight:500;">Atención únicamente por mensaje WhatsApp</div></div>
            </a>
            <a href="mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contacto / Reporte — pracTICAtecnica.com")}" style="display:flex;align-items:center;gap:8px;background:#1e3a8a;border:1px solid #38bdf8;color:#eff6ff;padding:10px 12px;border-radius:9px;text-decoration:none;font-size:12.5px;font-weight:700;">
              <span>📧</span>
              <div><div>${CONTACT_EMAIL}</div><div style="font-size:10.5px;color:#93c5fd;font-weight:500;">Contacto de la app y reportes generales</div></div>
            </a>
          </div>
        </div>

        <!-- Capacidades Técnicas -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin-bottom:14px;text-align:center;">
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:9px;"><div style="font-size:10.5px;color:#94a3b8;">Banco Procedural</div><div style="font-size:17px;font-weight:900;color:#38bdf8;">${Number(stBank.afterTotal || 350000).toLocaleString("es-CR")}+</div></div>
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:9px;"><div style="font-size:10.5px;color:#94a3b8;">Áreas Puras</div><div style="font-size:17px;font-weight:900;color:#34d399;">${stBank.totalAreas || 29}</div></div>
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:9px;"><div style="font-size:10.5px;color:#94a3b8;">Privacidad</div><div style="font-size:13px;font-weight:800;color:#fbbf24;margin-top:4px;">Ley N.° 8968</div></div>
          <div style="background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:9px;"><div style="font-size:10.5px;color:#94a3b8;">Arquitectura</div><div style="font-size:13px;font-weight:800;color:#c084fc;margin-top:4px;">Offline-First</div></div>
        </div>

        <!-- Formulario Rápido de Reporte / Sugerencia -->
        <form id="ab-rep-f" style="background:#070d19;border:1px solid #334155;border-radius:11px;padding:12px;display:flex;flex-direction:column;gap:8px;">
          <div style="font-size:12px;font-weight:700;color:#e2e8f0;">🛠️ Enviar reporte técnico, error o solicitud de institución</div>
          <input id="ab-asunto" type="text" required placeholder="Asunto (ej. Reporte de error, activar colegio, sugerencia)..." style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px 10px;border-radius:8px;font-size:12px;"/>
          <textarea id="ab-msg" rows="2" required placeholder="Describa brevemente su reporte o consulta..." style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px 10px;border-radius:8px;font-size:12px;"></textarea>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="submit" style="flex:1;background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">💬 Enviar por WhatsApp (6090-6359)</button>
            <button type="button" id="ab-mail-btn" style="flex:1;background:#1d4ed8;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📧 Enviar a ${CONTACT_EMAIL}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    document.getElementById("ab-cls").onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    document.getElementById("ab-rep-f").onsubmit = (e) => {
      e.preventDefault();
      const asu = document.getElementById("ab-asunto").value.trim();
      const msg = document.getElementById("ab-msg").value.trim();
      const txt = `Reporte pracTICAtecnica.com — ${asu}: ${msg}`;
      window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(txt)}`, "_blank");
    };
    document.getElementById("ab-mail-btn").onclick = () => {
      const asu = document.getElementById("ab-asunto").value.trim() || "Reporte general";
      const msg = document.getElementById("ab-msg").value.trim() || "Consulta desde la aplicación.";
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("pracTICAtecnica.com — " + asu)}&body=${encodeURIComponent(msg)}`;
    };
  }

  window.BDS_ACERCA = { open: openAboutModal, WHATSAPP_NUM, CONTACT_EMAIL };

  // Inyectar botón discreto "ℹ️ Acerca de" en la barra superior y en el menú lateral
  window.addEventListener("DOMContentLoaded", () => {
    const injectButtons = () => {
      const bell = document.getElementById("bds-notif-btn");
      if (bell && !document.getElementById("bds-about-btn")) {
        const b = document.createElement("button");
        b.id = "bds-about-btn";
        b.title = "Acerca de, Créditos y Contacto";
        b.style.cssText = "background:#131f33;color:#93c5fd;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;min-height:34px;";
        b.innerText = "ℹ️";
        b.onclick = openAboutModal;
        bell.parentElement.insertBefore(b, bell);
      }
      const dwOut = document.getElementById("dw-out");
      if (dwOut && !document.getElementById("dw-about")) {
        const d = document.createElement("button");
        d.id = "dw-about";
        d.style.cssText = "text-align:left;background:#131f33;color:#93c5fd;border:1px solid #334155;padding:10px;border-radius:8px;font-weight:600;cursor:pointer;";
        d.innerText = "ℹ️ Acerca de y Soporte";
        d.onclick = () => { const drw = document.getElementById("bds-drawer"); if (drw) drw.remove(); openAboutModal(); };
        dwOut.parentElement.insertBefore(d, dwOut);
      }
    };
    const obs = new MutationObserver(injectButtons);
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    injectButtons();
  });
})();