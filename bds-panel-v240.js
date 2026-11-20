(function () {
  if (typeof window === "undefined") return;
  if (window.__BDS_PANEL_V240) return;
  window.__BDS_PANEL_V240 = true;

  const SES_KEY = "bds_session_v184_ctpmn_c02";

  function getSes() {
    try {
      const raw = sessionStorage.getItem(SES_KEY) || localStorage.getItem(SES_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      return (p && p.email) ? p : null;
    } catch {
      return null;
    }
  }

  function logoutClean() {
    try { sessionStorage.removeItem(SES_KEY); } catch {}
    try { localStorage.removeItem(SES_KEY); } catch {}
    try { sessionStorage.removeItem("bds_purged_v236"); } catch {}
    window.__BDS_SESSION = null;
    window.location.href = window.location.origin + "/?logout=" + Date.now();
  }

  function ensureLogoutAndMainPanel() {
    try {
      if (typeof document === "undefined" || !document.body) return;
      const ses = getSes();
      if (!ses) return;

      // Ocultar login si quedara visible
      const loginBox = document.getElementById("bds-login-v193");
      if (loginBox) loginBox.style.display = "none";

      // Inyectar botón Salir en barra superior si no existe
      if (!document.getElementById("bds-top-logout-v240")) {
        const topAction = Array.from(document.querySelectorAll("button")).find((b) => /pdf limpio|simulador mopt|notas reac/i.test(b.textContent || ""));
        const bar = topAction ? topAction.parentElement : null;
        if (bar) {
          const btnOut = document.createElement("button");
          btnOut.id = "bds-top-logout-v240";
          btnOut.type = "button";
          btnOut.textContent = "🚪 Cerrar Sesión";
          btnOut.style.cssText = "background:#b91c1c;color:#fff;border:1px solid #ef4444;border-radius:10px;padding:8px 13px;font-size:12px;font-weight:800;cursor:pointer;";
          btnOut.onclick = logoutClean;
          bar.appendChild(btnOut);
        }
      }

      // Verificar si el área central está vacía o muy corta tras un breve margen
      const root = document.getElementById("root") || document.getElementById("bds-shell") || document.body;
      const bodyTextLen = (document.body.innerText || "").replace(/\s+/g, "").length;
      if (bodyTextLen < 120 && !document.getElementById("bds-main-dashboard-v240")) {
        const panel = document.createElement("section");
        panel.id = "bds-main-dashboard-v240";
        panel.style.cssText = "max-width:1080px;margin:20px auto;padding:20px;border-radius:16px;background:#0b1322;border:1px solid #1e293b;color:#f8fafc;font-family:Inter,Arial,sans-serif;";
        panel.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:16px;">
            <div>
              <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#38bdf8;text-transform:uppercase;">pracTICAtecnica.com • Panel Activo</div>
              <h2 style="margin:4px 0 0;font-size:20px;font-weight:800;">Bienvenido(a) — Rol: ${String(ses.rol || "Usuario")}</h2>
            </div>
            <button id="bds-panel-logout-v240" type="button" style="background:#dc2626;color:#fff;border:none;padding:9px 14px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer;">🚪 Cerrar Sesión</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;">
            <button type="button" data-trigger-tab="REAC" style="background:#111c33;border:1px solid #2563eb;color:#e2e8f0;padding:14px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#60a5fa;">📋 Notas REAC + Conducta</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Abrir módulo académico y evaluación.</div>
            </button>
            <button type="button" data-trigger-tab="MOPT" style="background:#111c33;border:1px solid #059669;color:#e2e8f0;padding:14px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#34d399;">🚦 Simulador MOPT</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Práctica vial y pruebas teóricas.</div>
            </button>
            <button type="button" data-trigger-tab="Audios" style="background:#111c33;border:1px solid #7c3aed;color:#e2e8f0;padding:14px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#a78bfa;">🎧 Audios FR/PT/DE</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Comprensión auditiva multi-idioma.</div>
            </button>
            <button type="button" data-trigger-tab="PDF" style="background:#111c33;border:1px solid #d97706;color:#e2e8f0;padding:14px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#fbbf24;">📄 PDF Limpio</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Guías y material imprimible sin marcas.</div>
            </button>
          </div>
        `;
        const dock = document.getElementById("bds-dock");
        if (dock && dock.parentElement) dock.parentElement.insertBefore(panel, dock);
        else root.appendChild(panel);

        document.getElementById("bds-panel-logout-v240").onclick = logoutClean;
        panel.querySelectorAll("[data-trigger-tab]").forEach((card) => {
          card.onclick = () => {
            const kw = card.getAttribute("data-trigger-tab");
            const matchBtn = Array.from(document.querySelectorAll("button")).find((b) => b !== card && (b.textContent || "").toLowerCase().includes(kw.toLowerCase()));
            if (matchBtn) matchBtn.click();
          };
        });
      }
    } catch {}
  }

  window.BDS_PANEL_V240 = { ensureLogoutAndMainPanel, logoutClean };

  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(ensureLogoutAndMainPanel, 600);
      setTimeout(ensureLogoutAndMainPanel, 1600);
    });
    window.addEventListener("load", () => {
      setTimeout(ensureLogoutAndMainPanel, 800);
      setTimeout(ensureLogoutAndMainPanel, 1800);
    });
  }
})();