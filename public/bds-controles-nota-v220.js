(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  function clampStep(val, min, max, step, fallback) {
    const num = Number(val);
    const base = Number.isFinite(num) ? num : Number(fallback || min);
    const clamped = Math.max(min, Math.min(max, base));
    const dec = String(step).includes(".") ? String(step).split(".")[1].length : 0;
    return Number(clamped.toFixed(dec));
  }

  function stepValue(current, delta, min, max, step) {
    const st = Number(step) || 1;
    const next = Number(current || min) + (delta * st);
    return clampStep(next, min, max, st, min);
  }

  function injectSpinnerStyles() {
    if (!document.head || document.getElementById("bds-triangulos-nota-css-v220")) return;
    const style = document.createElement("style");
    style.id = "bds-triangulos-nota-css-v220";
    style.innerHTML = `
      .bds-stepper-box {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #0b1322;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 3px 5px;
      }
      body.bds-light .bds-stepper-box {
        background: #ffffff !important;
        border-color: #94a3b8 !important;
      }
      .bds-stepper-input {
        width: 58px;
        text-align: center;
        font-weight: 700;
        font-size: 12.5px;
        border: 1px solid #475569;
        border-radius: 6px;
        padding: 4px 4px;
        background: #070d19;
        color: #f8fafc;
        -moz-appearance: textfield;
      }
      .bds-stepper-input::-webkit-inner-spin-button,
      .bds-stepper-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      body.bds-light .bds-stepper-input {
        background: #f8fafc !important;
        color: #0f172a !important;
        border-color: #94a3b8 !important;
      }
      .bds-tri-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .bds-tri-btn {
        background: #1e3a8a;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-size: 9px;
        line-height: 1;
        padding: 2px 6px;
        cursor: pointer;
        font-weight: 800;
      }
      .bds-tri-btn:hover {
        filter: brightness(1.15);
      }
      .bds-stepper-meta {
        font-size: 10px;
        color: #94a3b8;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function crearControlEditable(opts) {
    const cfg = {
      id: opts && opts.id ? opts.id : ("bds-num-" + Math.random().toString(36).slice(2, 7)),
      modo: (opts && opts.modo) || "nota100", // "indicador13" | "asistencia15" | "pruebas45" | "nota35" | "nota100"
      min: opts && typeof opts.min === "number" ? opts.min : 0,
      max: opts && typeof opts.max === "number" ? opts.max : 100,
      step: opts && typeof opts.step === "number" ? opts.step : 1,
      value: opts && typeof opts.value === "number" ? opts.value : 0,
      etiqueta: (opts && opts.etiqueta) || "",
      onChange: opts && typeof opts.onChange === "function" ? opts.onChange : null
    };

    if (cfg.modo === "indicador13") {
      cfg.min = 1; cfg.max = 3; cfg.step = 1;
      cfg.etiqueta = cfg.etiqueta || "Ind. 1–3";
    } else if (cfg.modo === "asistencia15") {
      cfg.min = 1; cfg.max = 5; cfg.step = 1;
      cfg.etiqueta = cfg.etiqueta || "Asist. 1–5 (5%)";
    } else if (cfg.modo === "pruebas45") {
      cfg.min = 0; cfg.max = 45; cfg.step = 0.5;
      cfg.etiqueta = cfg.etiqueta || "Máx. 45";
    } else if (cfg.modo === "nota35") {
      cfg.min = 0; cfg.max = 35; cfg.step = 0.5;
      cfg.etiqueta = cfg.etiqueta || "Máx. 35";
    } else {
      cfg.min = typeof (opts && opts.min) === "number" ? opts.min : 0;
      cfg.max = typeof (opts && opts.max) === "number" ? opts.max : 100;
      cfg.step = typeof (opts && opts.step) === "number" ? opts.step : 0.5;
      cfg.etiqueta = cfg.etiqueta || `0–${cfg.max}`;
    }

    let current = clampStep(cfg.value, cfg.min, cfg.max, cfg.step, cfg.min);

    const wrap = document.createElement("div");
    wrap.className = "bds-stepper-box";
    wrap.setAttribute("data-modo", cfg.modo);

    const input = document.createElement("input");
    input.type = "number";
    input.id = cfg.id;
    input.className = "bds-stepper-input";
    input.min = String(cfg.min);
    input.max = String(cfg.max);
    input.step = String(cfg.step);
    input.value = String(current);

    const triCol = document.createElement("div");
    triCol.className = "bds-tri-col";

    const btnUp = document.createElement("button");
    btnUp.type = "button";
    btnUp.className = "bds-tri-btn";
    btnUp.title = "Subir valor";
    btnUp.innerText = "▲";

    const btnDn = document.createElement("button");
    btnDn.type = "button";
    btnDn.className = "bds-tri-btn";
    btnDn.title = "Bajar valor";
    btnDn.innerText = "▼";

    const meta = document.createElement("span");
    meta.className = "bds-stepper-meta";
    meta.innerText = cfg.etiqueta;

    function commit(valNum) {
      current = clampStep(valNum, cfg.min, cfg.max, cfg.step, cfg.min);
      input.value = String(current);
      if (cfg.onChange) cfg.onChange(current);
    }

    btnUp.onclick = (e) => {
      if (e) e.preventDefault();
      commit(stepValue(current, 1, cfg.min, cfg.max, cfg.step));
    };

    btnDn.onclick = (e) => {
      if (e) e.preventDefault();
      commit(stepValue(current, -1, cfg.min, cfg.max, cfg.step));
    };

    input.onchange = () => commit(input.value);
    input.onblur = () => commit(input.value);

    triCol.appendChild(btnUp);
    triCol.appendChild(btnDn);
    wrap.appendChild(input);
    wrap.appendChild(triCol);
    if (cfg.etiqueta) wrap.appendChild(meta);

    return wrap;
  }

  function reemplazarRangosPorTriangulos() {
    injectSpinnerStyles();
    const shell = document.getElementById("bds-shell");
    if (!shell) return;

    const sliders = Array.from(shell.querySelectorAll('input[type="range"]'));
    sliders.forEach((sl) => {
      if (sl.getAttribute("data-bds-upgraded") === "1") return;
      sl.setAttribute("data-bds-upgraded", "1");

      const min = Number(sl.min || 0);
      const max = Number(sl.max || 100);
      const step = Number(sl.step || 1);
      const val = Number(sl.value || min);
      const lblTxt = (sl.parentElement && sl.parentElement.innerText) || "";

      let modo = "nota100";
      if (/indicador|desempeño|desempeno/i.test(lblTxt) || (max === 3 && min <= 1)) {
        modo = "indicador13";
      } else if (/asistencia/i.test(lblTxt) || (max === 5 && min <= 1)) {
        modo = "asistencia15";
      } else if (/prueba|técnic|tecnic/i.test(lblTxt) && max === 45) {
        modo = "pruebas45";
      } else if (max === 35) {
        modo = "nota35";
      }

      const ctrl = crearControlEditable({
        id: sl.id ? (sl.id + "-tri") : undefined,
        modo,
        min,
        max,
        step,
        value: val,
        onChange: (nuevoVal) => {
          sl.value = String(nuevoVal);
          sl.dispatchEvent(new Event("input", { bubbles: true }));
          sl.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });

      sl.style.display = "none";
      if (sl.parentElement) {
        sl.parentElement.insertBefore(ctrl, sl.nextSibling);
      }
    });
  }

  window.BDS_CONTROLES_NOTA_V220 = {
    clampStep,
    stepValue,
    crearControlEditable,
    reemplazarRangosPorTriangulos
  };

  injectSpinnerStyles();
  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      reemplazarRangosPorTriangulos();
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => reemplazarRangosPorTriangulos()).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();

/* bds-no-wheel-on-inputs-v222 */
(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  function bloquearWheelEnControles() {
    const inputs = document.querySelectorAll('input[type="number"], .bds-stepper-input, .bds-stepper-box');
    inputs.forEach((el) => {
      if (el.getAttribute("data-bds-no-wheel") === "1") return;
      el.setAttribute("data-bds-no-wheel", "1");
      el.addEventListener("wheel", (e) => {
        e.preventDefault();
        const targetInput = el.tagName === "INPUT" ? el : el.querySelector("input");
        if (targetInput && document.activeElement === targetInput) {
          targetInput.blur();
        }
        if (typeof window.scrollBy === "function") {
          window.scrollBy({ top: e.deltaY || 0, left: e.deltaX || 0, behavior: "auto" });
        }
      }, { passive: false });
    });
  }

  if (window.BDS_CONTROLES_NOTA_V220 && typeof window.BDS_CONTROLES_NOTA_V220.crearControlEditable === "function") {
    const origCrear = window.BDS_CONTROLES_NOTA_V220.crearControlEditable;
    window.BDS_CONTROLES_NOTA_V220.crearControlEditable = function (opts) {
      const box = origCrear.apply(this, arguments);
      setTimeout(bloquearWheelEnControles, 0);
      return box;
    };
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      bloquearWheelEnControles();
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => bloquearWheelEnControles()).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();