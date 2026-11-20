(function () {
  "use strict";
  if (typeof window === "undefined" || window.__BDS_ESTABILIDAD_V245) return;
  window.__BDS_ESTABILIDAD_V245 = true;

  const SESSION_KEY = "bds_session_v184_ctpmn_c02";
  const SA_HASH = "72e4fb070f33d3ce2a74b70cb4c9553ab283a5aa839170ea297ce15ea5bf654b";

  function getActiveSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (parsed && parsed.email) ? parsed : null;
    } catch {
      return null;
    }
  }

  function clearSessionAndReload() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    try { sessionStorage.removeItem("bds_purged_v236"); } catch {}
    window.__BDS_SESSION = null;
    window.location.href = `${window.location.origin}/?v=245&reset=${Date.now()}`;
  }

  function clickTabButton(matcher) {
    const btns = Array.from(document.querySelectorAll("button"));
    const target = btns.find((b) => {
      if (b.closest("#bds-panel-estable-v245")) return false;
      return matcher.test((b.textContent || "").trim());
    });
    if (target) {
      target.click();
      return true;
    }
    return false;
  }

  function renderTriangleSteppers() {
    if (!document || !document.body) return;
    const rangeEls = Array.from(document.querySelectorAll('input[type="range"]'));
    for (const rng of rangeEls) {
      if (rng.getAttribute("data-tri-v245") === "1") continue;
      rng.setAttribute("data-tri-v245", "1");

      const minV = Number(rng.min || 0);
      const maxV = Number(rng.max || 100);
      let val = Math.max(minV, Math.min(maxV, Number(rng.value || 0)));

      const nextSibling = rng.nextElementSibling;
      if (nextSibling && /^\d{1,3}$/.test((nextSibling.textContent || "").trim())) {
        nextSibling.style.display = "none";
      }

      const container = document.createElement("span");
      container.className = "bds-tri-v245";
      container.style.cssText = "display:inline-flex;align-items:center;gap:6px;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:7px;padding:2px 7px;font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:800;user-select:none;";

      const numDisplay = document.createElement("span");
      numDisplay.textContent = String(val);
      numDisplay.style.cssText = "min-width:24px;text-align:center;color:#e2e8f0;";

      const btnGroup = document.createElement("span");
      btnGroup.style.cssText = "display:inline-flex;flex-direction:column;gap:1px;line-height:1;";

      const btnUp = document.createElement("button");
      btnUp.type = "button";
      btnUp.setAttribute("aria-label", "Subir");
      btnUp.innerHTML = "&#9650;";
      btnUp.style.cssText = "background:#1e293b;color:#38bdf8;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const btnDown = document.createElement("button");
      btnDown.type = "button";
      btnDown.setAttribute("aria-label", "Bajar");
      btnDown.innerHTML = "&#9660;";
      btnDown.style.cssText = "background:#1e293b;color:#f87171;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const applyValue = (nextVal) => {
        val = Math.max(minV, Math.min(maxV, nextVal));
        numDisplay.textContent = String(val);
        rng.value = String(val);
        rng.dispatchEvent(new Event("input", { bubbles: true }));
        rng.dispatchEvent(new Event("change", { bubbles: true }));
      };

      btnUp.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyValue(val + 1);
      });
      btnDown.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyValue(val - 1);
      });

      btnGroup.appendChild(btnUp);
      btnGroup.appendChild(btnDown);
      container.appendChild(numDisplay);
      container.appendChild(btnGroup);

      rng.style.display = "none";
      if (rng.parentElement) {
        rng.parentElement.insertBefore(container, rng);
      }
    }
  }

  function stabilizeWorkspace() {
    if (!document || !document.body) return;
    renderTriangleSteppers();

    const session = getActiveSession();
    if (!session) return;

    if (!document.getElementById("bds-exit-top-v245")) {
      const anchorBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        /pdf limpio|simulador mopt|notas reac|audios/i.test(b.textContent || "")
      );
      const topBar = anchorBtn ? anchorBtn.parentElement : null;
      if (topBar) {
        const exitBtn = document.createElement("button");
        exitBtn.id = "bds-exit-top-v245";
        exitBtn.type = "button";
        exitBtn.textContent = "Cerrar Sesión";
        exitBtn.style.cssText = "background:#b91c1c;color:#fff;border:1px solid #ef4444;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer;";
        exitBtn.addEventListener("click", clearSessionAndReload);
        topBar.appendChild(exitBtn);
      }
    }

    const activeContainers = Array.from(document.body.querySelectorAll("section, main, article, table, form")).filter((el) => {
      if (el.id === "bds-panel-estable-v245") return false;
      const box = el.getBoundingClientRect();
      return box.width > 200 && box.height > 140;
    });

    if (activeContainers.length === 0 && !document.getElementById("bds-panel-estable-v245")) {
      const roleLabel = session.rol || "SuperAdmin";
      const panel = document.createElement("section");
      panel.id = "bds-panel-estable-v245";
      panel.style.cssText = "max-width:1060px;margin:24px auto;padding:22px;border-radius:16px;background:#0b1322;border:1px solid #1e293b;color:#f8fafc;font-family:Inter,Arial,sans-serif;";
      panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:18px;">
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#38bdf8;text-transform:uppercase;">pracTICAtecnica.com • Espacio Operativo</div>
            <h2 style="margin:4px 0 0;font-size:20px;font-weight:800;">Sesión Activa — Rol: ${roleLabel}</h2>
          </div>
          <button id="bds-exit-panel-v245" type="button" style="background:#dc2626;color:#fff;border:none;padding:9px 14px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer;">Cerrar Sesión</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;">
          <button type="button" id="bds-tab-reac-v245" style="background:#111c33;border:1px solid #2563eb;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#60a5fa;">Notas REAC + Conducta</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Controles ▲ / ▼ y evaluación.</div>
          </button>
          <button type="button" id="bds-tab-mopt-v245" style="background:#111c33;border:1px solid #059669;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#34d399;">Simulador MOPT</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Práctica vial y simulador teórico.</div>
          </button>
          <button type="button" id="bds-tab-audio-v245" style="background:#111c33;border:1px solid #7c3aed;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#a78bfa;">Audios FR/PT/DE</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Comprensión auditiva multi-idioma.</div>
          </button>
          <button type="button" id="bds-tab-pdf-v245" style="background:#111c33;border:1px solid #d97706;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
            <div style="font-size:15px;font-weight:800;color:#fbbf24;">PDF Limpio</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Exportación limpia sin marcas externas.</div>
          </button>
        </div>
      `;

      const dock = document.getElementById("bds-dock");
      if (dock && dock.parentElement) {
        dock.parentElement.insertBefore(panel, dock);
      } else {
        document.body.appendChild(panel);
      }

      document.getElementById("bds-exit-panel-v245").addEventListener("click", clearSessionAndReload);
      document.getElementById("bds-tab-reac-v245").addEventListener("click", () => {
        if (clickTabButton(/notas reac/i)) {
          panel.style.display = "none";
          setTimeout(renderTriangleSteppers, 250);
        }
      });
      document.getElementById("bds-tab-mopt-v245").addEventListener("click", () => {
        if (clickTabButton(/simulador mopt/i)) panel.style.display = "none";
      });
      document.getElementById("bds-tab-audio-v245").addEventListener("click", () => {
        if (clickTabButton(/audios/i)) panel.style.display = "none";
      });
      document.getElementById("bds-tab-pdf-v245").addEventListener("click", () => {
        if (clickTabButton(/pdf limpio/i)) panel.style.display = "none";
      });
    }
  }

  window.BDS_ESTABILIDAD_V245 = {
    saHash: SA_HASH,
    getActiveSession,
    clearSessionAndReload,
    renderTriangleSteppers,
    stabilizeWorkspace
  };

  const runSync = () => {
    setTimeout(stabilizeWorkspace, 400);
    setTimeout(stabilizeWorkspace, 1200);
  };

  window.addEventListener("DOMContentLoaded", () => {
    runSync();
    if (typeof MutationObserver !== "undefined" && document.body) {
      new MutationObserver(() => renderTriangleSteppers()).observe(document.body, { childList: true, subtree: true });
    }
  });
  window.addEventListener("load", runSync);
})();