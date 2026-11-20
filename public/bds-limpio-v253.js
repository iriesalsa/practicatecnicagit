(function () {
  "use strict";
  if (typeof window === "undefined" || window.__BDS_LIMPIO_V253) return;
  window.__BDS_LIMPIO_V253 = true;

  function montarTriangulos() {
    if (!document || !document.body) return;
    document.querySelectorAll('input[type="range"]').forEach((rng) => {
      if (rng.getAttribute("data-tri-253") === "1") return;
      rng.setAttribute("data-tri-253", "1");
      const minV = Number(rng.min || 0);
      const maxV = Number(rng.max || 100);
      let val = Math.max(minV, Math.min(maxV, Number(rng.value || 0)));

      const box = document.createElement("span");
      box.style.cssText = "display:inline-flex;align-items:center;gap:5px;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:6px;padding:2px 6px;font-size:12px;font-weight:800;";

      const num = document.createElement("span");
      num.textContent = String(val);

      const col = document.createElement("span");
      col.style.cssText = "display:inline-flex;flex-direction:column;gap:1px;line-height:1;";

      const up = document.createElement("button");
      up.type = "button";
      up.innerHTML = "&#9650;";
      up.style.cssText = "background:#1e293b;color:#38bdf8;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;cursor:pointer;";

      const dn = document.createElement("button");
      dn.type = "button";
      dn.innerHTML = "&#9660;";
      dn.style.cssText = "background:#1e293b;color:#f87171;border:1px solid #475569;border-radius:3px;padding:0 4px;font-size:8px;cursor:pointer;";

      const setVal = (n) => {
        val = Math.max(minV, Math.min(maxV, n));
        num.textContent = String(val);
        rng.value = String(val);
        rng.dispatchEvent(new Event("input", { bubbles: true }));
        rng.dispatchEvent(new Event("change", { bubbles: true }));
      };

      up.onclick = (e) => { e.preventDefault(); e.stopPropagation(); setVal(val + 1); };
      dn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); setVal(val - 1); };

      col.appendChild(up);
      col.appendChild(dn);
      box.appendChild(num);
      box.appendChild(col);

      rng.style.display = "none";
      if (rng.parentElement) rng.parentElement.insertBefore(box, rng);
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(montarTriangulos, 300);
    if (typeof MutationObserver !== "undefined" && document.body) {
      new MutationObserver(montarTriangulos).observe(document.body, { childList: true, subtree: true });
    }
  });
})();