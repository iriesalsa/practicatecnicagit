(function () {
  if (typeof window === "undefined") return;
  if (window.__BDS_REAC_TRIANGULOS_V241) return;
  window.__BDS_REAC_TRIANGULOS_V241 = true;

  function recalcularFila(tr) {
    if (!tr) return;
    const nums = Array.from(tr.querySelectorAll("[data-reac-val]")).map((el) => Number(el.getAttribute("data-reac-val") || 0));
    // Pesos: Cotidiano 40%, Portafolio 15%, Tareas 10%, Pruebas 20%, Proyecto 10%, Asistencia 5%
    const pesos = [0.40, 0.15, 0.10, 0.20, 0.10, 0.05];
    if (nums.length >= 6) {
      let suma = 0;
      for (let i = 0; i < 6; i++) suma += (nums[i] || 0) * pesos[i];
      const finalRedondeado = Math.max(0, Math.min(100, Math.round(suma)));
      const cells = Array.from(tr.children);
      // Penúltima celda numérica antes de Conducta Guía corresponde a Final
      for (let c = cells.length - 1; c >= 0; c--) {
        const txt = (cells[c].textContent || "").trim();
        if (/^\d{1,3}$/.test(txt)) {
          const prevTxt = c > 0 ? (cells[c - 1].textContent || "").trim() : "";
          if (/^\d{1,3}$/.test(prevTxt)) {
            cells[c - 1].textContent = String(finalRedondeado);
            cells[c - 1].style.color = finalRedondeado >= 70 ? "#15803d" : "#dc2626";
            cells[c - 1].style.fontWeight = "800";
          }
          break;
        }
      }
    }
  }

  function convertirSlidersATriangulos() {
    if (typeof document === "undefined" || !document.body) return;

    // Estilizar selects con flecha triangular
    document.querySelectorAll("select").forEach((sel) => {
      if (sel.getAttribute("data-tri-sel-v241") === "1") return;
      sel.setAttribute("data-tri-sel-v241", "1");
      sel.style.appearance = "menulist";
      sel.style.webkitAppearance = "menulist";
      sel.style.cursor = "pointer";
    });

    // Reemplazar cada <input type="range"> en tablas/modales REAC por control numérico con triángulos ▲ y ▼
    const ranges = Array.from(document.querySelectorAll('input[type="range"]'));
    ranges.forEach((rng) => {
      if (rng.getAttribute("data-tri-done-v241") === "1") return;
      rng.setAttribute("data-tri-done-v241", "1");

      const minV = Number(rng.min || 0);
      const maxV = Number(rng.max || 100);
      let curVal = Math.max(minV, Math.min(maxV, Number(rng.value || 0)));

      // Buscar el número vecino si existe al lado del slider y ocultarlo para no duplicar valor
      const nextEl = rng.nextElementSibling;
      if (nextEl && /^\d{1,3}$/.test((nextEl.textContent || "").trim())) {
        nextEl.style.display = "none";
      }

      const wrap = document.createElement("span");
      wrap.className = "bds-tri-ctrl-v241";
      wrap.setAttribute("data-reac-val", String(curVal));
      wrap.style.cssText = "display:inline-flex;align-items:center;gap:4px;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:7px;padding:2px 6px;font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:800;user-select:none;";

      const valSpan = document.createElement("span");
      valSpan.textContent = String(curVal);
      valSpan.style.cssText = "min-width:24px;text-align:center;color:#e2e8f0;";

      const btnCol = document.createElement("span");
      btnCol.style.cssText = "display:inline-flex;flex-direction:column;line-height:1;gap:1px;";

      const btnUp = document.createElement("button");
      btnUp.type = "button";
      btnUp.title = "Subir valor";
      btnUp.setAttribute("aria-label", "Subir");
      btnUp.innerHTML = "&#9650;";
      btnUp.style.cssText = "background:#1e293b;color:#38bdf8;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const btnDown = document.createElement("button");
      btnDown.type = "button";
      btnDown.title = "Bajar valor";
      btnDown.setAttribute("aria-label", "Bajar");
      btnDown.innerHTML = "&#9660;";
      btnDown.style.cssText = "background:#1e293b;color:#f87171;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;line-height:1.15;cursor:pointer;";

      const actualizar = (nuevo) => {
        curVal = Math.max(minV, Math.min(maxV, nuevo));
        valSpan.textContent = String(curVal);
        wrap.setAttribute("data-reac-val", String(curVal));
        rng.value = String(curVal);
        rng.dispatchEvent(new Event("input", { bubbles: true }));
        rng.dispatchEvent(new Event("change", { bubbles: true }));
        recalcularFila(wrap.closest("tr"));
      };

      btnUp.onclick = (e) => { e.preventDefault(); e.stopPropagation(); actualizar(curVal + 1); };
      btnDown.onclick = (e) => { e.preventDefault(); e.stopPropagation(); actualizar(curVal - 1); };

      btnCol.appendChild(btnUp);
      btnCol.appendChild(btnDown);
      wrap.appendChild(valSpan);
      wrap.appendChild(btnCol);

      rng.style.display = "none";
      if (rng.parentElement) {
        rng.parentElement.insertBefore(wrap, rng);
      }
    });
  }

  window.BDS_REAC_TRIANGULOS_V241 = { convertirSlidersATriangulos };

  if (typeof window.addEventListener === "function") {
    const runPass = () => {
      convertirSlidersATriangulos();
      setTimeout(convertirSlidersATriangulos, 250);
      setTimeout(convertirSlidersATriangulos, 800);
    };
    window.addEventListener("DOMContentLoaded", () => {
      runPass();
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => convertirSlidersATriangulos()).observe(document.body, { childList: true, subtree: true });
      }
    });
    window.addEventListener("load", runPass);
  }
})();