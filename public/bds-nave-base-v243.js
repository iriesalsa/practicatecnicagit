(function () {
  if (typeof window === "undefined" || window.__BDS_NAVE_BASE_V243) return;
  window.__BDS_NAVE_BASE_V243 = true;

  const SES_KEY = "bds_session_v184_ctpmn_c02";

  function leerSesion() {
    try {
      const raw = sessionStorage.getItem(SES_KEY) || localStorage.getItem(SES_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      return (p && p.email) ? p : null;
    } catch {
      return null;
    }
  }

  function cerrarSesionLimpia() {
    try { sessionStorage.removeItem(SES_KEY); } catch {}
    try { localStorage.removeItem(SES_KEY); } catch {}
    try { sessionStorage.removeItem("bds_purged_v236"); } catch {}
    window.__BDS_SESSION = null;
    window.location.href = window.location.origin + "/?v=243&out=" + Date.now();
  }

  function clickBotonPorTexto(patron) {
    const btns = Array.from(document.querySelectorAll("button"));
    const target = btns.find((b) => {
      if (b.closest("#bds-cockpit-base-v243")) return false;
      return patron.test((b.textContent || "").trim());
    });
    if (target) {
      target.click();
      return true;
    }
    return false;
  }

  function aplicarTriangulosEnVista() {
    try {
      document.querySelectorAll('input[type="range"]').forEach((rng) => {
        if (rng.getAttribute("data-tri-243") === "1") return;
        rng.setAttribute("data-tri-243", "1");
        const minV = Number(rng.min || 0);
        const maxV = Number(rng.max || 100);
        let val = Math.max(minV, Math.min(maxV, Number(rng.value || 0)));

        const nextEl = rng.nextElementSibling;
        if (nextEl && /^\d{1,3}$/.test((nextEl.textContent || "").trim())) {
          nextEl.style.display = "none";
        }

        const box = document.createElement("span");
        box.style.cssText = "display:inline-flex;align-items:center;gap:5px;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:6px;padding:2px 6px;font-size:12px;font-weight:800;";

        const txt = document.createElement("span");
        txt.textContent = String(val);

        const col = document.createElement("span");
        col.style.cssText = "display:inline-flex;flex-direction:column;gap:1px;";

        const up = document.createElement("button");
        up.type = "button";
        up.innerHTML = "&#9650;";
        up.style.cssText = "background:#1e293b;color:#38bdf8;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.1;cursor:pointer;";

        const dn = document.createElement("button");
        dn.type = "button";
        dn.innerHTML = "&#9660;";
        dn.style.cssText = "background:#1e293b;color:#f87171;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.1;cursor:pointer;";

        const setVal = (n) => {
          val = Math.max(minV, Math.min(maxV, n));
          txt.textContent = String(val);
          rng.value = String(val);
          rng.dispatchEvent(new Event("input", { bubbles: true }));
          rng.dispatchEvent(new Event("change", { bubbles: true }));
        };

        up.onclick = (e) => { e.preventDefault(); e.stopPropagation(); setVal(val + 1); };
        dn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); setVal(val - 1); };

        col.appendChild(up);
        col.appendChild(dn);
        box.appendChild(txt);
        box.appendChild(col);

        rng.style.display = "none";
        if (rng.parentElement) rng.parentElement.insertBefore(box, rng);
      });
    } catch {}
  }

  function repararBaseCentral() {
    try {
      if (!document || !document.body) return;
      aplicarTriangulosEnVista();

      const ses = leerSesion();
      if (!ses) return;

      // Garantizar botón Cerrar Sesión arriba
      if (!document.getElementById("bds-header-exit-v243")) {
        const refBtn = Array.from(document.querySelectorAll("button")).find((b) => /pdf limpio|simulador mopt|notas reac/i.test(b.textContent || ""));
        const bar = refBtn ? refBtn.parentElement : null;
        if (bar) {
          const outBtn = document.createElement("button");
          outBtn.id = "bds-header-exit-v243";
          outBtn.type = "button";
          outBtn.textContent = "Cerrar Sesión";
          outBtn.style.cssText = "background:#b91c1c;color:#fff;border:1px solid #ef4444;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer;";
          outBtn.onclick = cerrarSesionLimpia;
          bar.appendChild(outBtn);
        }
      }

      // Detectar si el centro de la página está vacío/oscuro sin panel visible
      const visibleContent = Array.from(document.body.querySelectorAll("section, main, article, table, form")).filter((el) => {
        if (el.id === "bds-cockpit-base-v243") return false;
        const r = el.getBoundingClientRect();
        return r.width > 200 && r.height > 140;
      });

      if (visibleContent.length === 0 && !document.getElementById("bds-cockpit-base-v243")) {
        const box = document.createElement("section");
        box.id = "bds-cockpit-base-v243";
        box.style.cssText = "max-width:1060px;margin:24px auto;padding:22px;border-radius:16px;background:#0b1322;border:1px solid #1e293b;color:#f8fafc;font-family:Inter,Arial,sans-serif;";
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:18px;">
            <div>
              <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#38bdf8;text-transform:uppercase;">pracTICAtecnica.com • Base Operativa</div>
              <h2 style="margin:4px 0 0;font-size:20px;font-weight:800;">Sesión Activa — Rol: ${String(ses.rol || "SuperAdmin")}</h2>
            </div>
            <button id="bds-cockpit-logout-v243" type="button" style="background:#dc2626;color:#fff;border:none;padding:9px 14px;border-radius:9px;font-weight:800;font-size:12px;cursor:pointer;">Cerrar Sesión</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;">
            <button type="button" id="bds-go-reac-v243" style="background:#111c33;border:1px solid #2563eb;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#60a5fa;">Notas REAC + Conducta</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Evaluación y conducta con controles ▲ / ▼.</div>
            </button>
            <button type="button" id="bds-go-mopt-v243" style="background:#111c33;border:1px solid #059669;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#34d399;">Simulador MOPT</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Práctica vial y simulador de prueba.</div>
            </button>
            <button type="button" id="bds-go-audio-v243" style="background:#111c33;border:1px solid #7c3aed;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#a78bfa;">Audios FR/PT/DE</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Práctica de escucha multi-idioma.</div>
            </button>
            <button type="button" id="bds-go-pdf-v243" style="background:#111c33;border:1px solid #d97706;color:#e2e8f0;padding:15px;border-radius:12px;text-align:left;cursor:pointer;">
              <div style="font-size:15px;font-weight:800;color:#fbbf24;">PDF Limpio</div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Exportación limpia sin marcas externas.</div>
            </button>
          </div>
        `;
        const dock = document.getElementById("bds-dock");
        if (dock && dock.parentElement) dock.parentElement.insertBefore(box, dock);
        else document.body.appendChild(box);

        document.getElementById("bds-cockpit-logout-v243").onclick = cerrarSesionLimpia;
        document.getElementById("bds-go-reac-v243").onclick = () => {
          if (clickBotonPorTexto(/notas reac/i)) {
            box.style.display = "none";
            setTimeout(aplicarTriangulosEnVista, 250);
          }
        };
        document.getElementById("bds-go-mopt-v243").onclick = () => {
          if (clickBotonPorTexto(/simulador mopt/i)) box.style.display = "none";
        };
        document.getElementById("bds-go-audio-v243").onclick = () => {
          if (clickBotonPorTexto(/audios/i)) box.style.display = "none";
        };
        document.getElementById("bds-go-pdf-v243").onclick = () => {
          if (clickBotonPorTexto(/pdf limpio/i)) box.style.display = "none";
        };
      }
    } catch {}
  }

  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(repararBaseCentral, 500);
    setTimeout(repararBaseCentral, 1400);
    if (typeof MutationObserver !== "undefined" && document.body) {
      new MutationObserver(() => {
        aplicarTriangulosEnVista();
      }).observe(document.body, { childList: true, subtree: true });
    }
  });
  window.addEventListener("load", () => {
    setTimeout(repararBaseCentral, 700);
    setTimeout(repararBaseCentral, 1600);
  });
})();