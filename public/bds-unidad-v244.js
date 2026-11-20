(function () {
  "use strict";
  if (typeof window === "undefined" || window.__BDS_UNIDAD_V244) return;
  window.__BDS_UNIDAD_V244 = true;

  const SESSION_KEY = "bds_session_v184_ctpmn_c02";
  const SA_HASH = "72e4fb070f33d3ce2a74b70cb4c9553ab283a5aa839170ea297ce15ea5bf654b";

  function readSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return (data && data.email) ? data : null;
    } catch {
      return null;
    }
  }

  function signOutClean() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    try { sessionStorage.removeItem("bds_purged_v236"); } catch {}
    window.__BDS_SESSION = null;
    window.location.href = `${window.location.origin}/?v=244&logout=${Date.now()}`;
  }

  function triggerTabByLabel(regexLabel) {
    const buttons = Array.from(document.querySelectorAll("button"));
    const match = buttons.find((btn) => {
      if (btn.closest("#bds-cockpit-v244")) return false;
      return regexLabel.test((btn.textContent || "").trim());
    });
    if (match) {
      match.click();
      return true;
    }
    return false;
  }

  function applyTrianglesToRangeInputs() {
    if (!document || !document.body) return;
    const inputs = Array.from(document.querySelectorAll('input[type="range"]'));
    for (const rng of inputs) {
      if (rng.getAttribute("data-tri-v244") === "1") continue;
      rng.setAttribute("data-tri-v244", "1");

      const minVal = Number(rng.min || 0);
      const maxVal = Number(rng.max || 100);
      let currentVal = Math.max(minVal, Math.min(maxVal, Number(rng.value || 0)));

      const sibling = rng.nextElementSibling;
      if (sibling && /^\d{1,3}$/.test((sibling.textContent || "").trim())) {
        sibling.style.display = "none";
      }

      const wrapper = document.createElement("span");
      wrapper.className = "bds-triangle-control-v244";
      wrapper.style.cssText = "display:inline-flex;align-items:center;gap:6px;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:7px;padding:2px 7px;font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:800;user-select:none;";

      const valueLabel = document.createElement("span");
      valueLabel.textContent = String(currentVal);
      valueLabel.style.cssText = "min-width:24px;text-align:center;color:#e2e8f0;";

      const arrowStack = document.createElement("span");
      arrowStack.style.cssText = "display:inline-flex;flex-direction:column;gap:1px;line-height:1;";

      const btnUp = document.createElement("button");
      btnUp.type = "button";
      btnUp.title = "Incrementar valor";
      btnUp.setAttribute("aria-label", "Incrementar");
      btnUp.innerHTML = "&#9650;";
      btnUp.style.cssText = "background:#1e293b;color:#38bdf8;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const btnDown = document.createElement("button");
      btnDown.type = "button";
      btnDown.title = "Decrementar valor";
      btnDown.setAttribute("aria-label", "Decrementar");
      btnDown.innerHTML = "&#9660;";
      btnDown.style.cssText = "background:#1e293b;color:#f87171;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const updateValue = (nextVal) => {
        currentVal = Math.max(minVal, Math.min(maxVal, nextVal));
        valueLabel.textContent = String(currentVal);
        rng.value = String(currentVal);
        rng.dispatchEvent(new Event("input", { bubbles: true }));
        rng.dispatchEvent(new Event("change", { bubbles: true }));
      };

      btnUp.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        updateValue(currentVal + 1);
      });
      btnDown.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        updateValue(currentVal - 1);
      });

      arrowStack.appendChild(btnUp);
      arrowStack.appendChild(btnDown);
      wrapper.appendChild(valueLabel);
      wrapper.appendChild(arrowStack);

      rng.style.display = "none";
      if (rng.parentElement) {
        rng.parentElement.insertBefore(wrapper, rng);
      }
    }
  }

  function ensureCockpitAndHeaderActions() {
    if (!document || !document.body) return;
    applyTrianglesToRangeInputs();

    const session = readSession();
    if (!session) return;

    if (!document.getElementById("bds-top-logout-v244")) {
      const refBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        /pdf limpio|simulador mopt|notas reac|audios/i.test(b.textContent || "")
      );
      const headerGroup = refBtn ? refBtn.parentElement : null;
      if (headerGroup) {
        const logoutBtn = document.createElement("button");
        logoutBtn.id = "bds-top-logout-v244";
        logoutBtn.type = "button";
        logoutBtn.textContent = "Cerrar Sesión";
        logoutBtn.style.cssText = "background:#b91c1c;color:#fff;border:1px solid #ef4444;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer;";
        logoutBtn.addEventListener("click", signOutClean);
        headerGroup.appendChild(logoutBtn);
      }
    }

    const visibleSections = Array.from(document.body.querySelectorAll("section, main, article, table, form")).filter((el) => {
      if (el.id === "bds-cockpit-v244") return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 200 && rect.height > 140;
    });

    if (visibleSections.length === 0 && !document.getElementById("bds-cockpit-v244")) {
      const roleDisplay = session.rol || "SuperAdmin";
      const cockpit = document.createElement("section");
      cockpit.id = "bds-cockpit-v244";
      cockpit.style.cssText = "max-width:1060px;margin:24px auto;padding:22px;border-radius:16px;background:#0b1322;border:1px solid #1e293b;color:#f8fafc;font-family:Inter,Arial,sans-serif;";
      cockpit.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:18px;">
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#38bdf8;text-transform:uppercase;">pracTICAtecnica.com • Panel Operativo</div>
            <h2 style="margin:4px 0 0;font-size:20px;font-weight:800;">Acceso Activo — Rol: ${roleDisplay}</h2>
          </div>
          <button id="bds-cockpit-logout-v244" type="button" style="background:#dc2626;color:#fff;border:none;padding:9px 14px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer;">Cerrar Sesión</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;">
          <button type="button" id="bds-open-reac-v244" style="background:#111c33;border:1px solid #2563eb;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#60a5fa;">Notas REAC + Conducta</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Evaluación con controles ▲ / ▼.</div>
          </button>
          <button type="button" id="bds-open-mopt-v244" style="background:#111c33;border:1px solid #059669;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#34d399;">Simulador MOPT</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Práctica vial y simulador teórico.</div>
          </button>
          <button type="button" id="bds-open-audio-v244" style="background:#111c33;border:1px solid #7c3aed;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#a78bfa;">Audios FR/PT/DE</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Comprensión auditiva multi-idioma.</div>
          </button>
          <button type="button" id="bds-open-pdf-v244" style="background:#111c33;border:1px solid #d97706;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#fbbf24;">PDF Limpio</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Exportación limpia sin marcas externas.</div>
          </button>
        </div>
      `;

      const dock = document.getElementById("bds-dock");
      if (dock && dock.parentElement) {
        dock.parentElement.insertBefore(cockpit, dock);
      } else {
        document.body.appendChild(cockpit);
      }

      document.getElementById("bds-cockpit-logout-v244").addEventListener("click", signOutClean);
      document.getElementById("bds-open-reac-v244").addEventListener("click", () => {
        if (triggerTabByLabel(/notas reac/i)) {
          cockpit.style.display = "none";
          setTimeout(applyTrianglesToRangeInputs, 250);
        }
      });
      document.getElementById("bds-open-mopt-v244").addEventListener("click", () => {
        if (triggerTabByLabel(/simulador mopt/i)) cockpit.style.display = "none";
      });
      document.getElementById("bds-open-audio-v244").addEventListener("click", () => {
        if (triggerTabByLabel(/audios/i)) cockpit.style.display = "none";
      });
      document.getElementById("bds-open-pdf-v244").addEventListener("click", () => {
        if (triggerTabByLabel(/pdf limpio/i)) cockpit.style.display = "none";
      });
    }
  }

  window.BDS_UNIDAD_V244 = {
    saHash: SA_HASH,
    readSession,
    signOutClean,
    applyTrianglesToRangeInputs,
    ensureCockpitAndHeaderActions
  };

  const scheduleSync = () => {
    setTimeout(ensureCockpitAndHeaderActions, 400);
    setTimeout(ensureCockpitAndHeaderActions, 1200);
  };

  window.addEventListener("DOMContentLoaded", () => {
    scheduleSync();
    if (typeof MutationObserver !== "undefined" && document.body) {
      const observer = new MutationObserver(() => {
        applyTrianglesToRangeInputs();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
  window.addEventListener("load", scheduleSync);
})();