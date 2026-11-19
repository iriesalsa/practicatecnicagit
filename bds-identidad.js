(function () {
  const BRAND_KEY = "bds_brand_custom_v183";

  const DEFAULTS = {
    institucion: "Colegio Técnico Profesional Mercedes Norte",
    institucionCorta: "CTP Mercedes Norte",
    regional: "Dirección Regional de Heredia",
    circuito: "Circuito 02",
    escudo: "/escudo-ctpmn-oficial.jpeg?v=183",
    mascota: "/buho-oficial.png?v=183",
    logoMep: "/logo-mep-oficial.png?v=183"
  };

  function getBrand() {
    try {
      const saved = JSON.parse(localStorage.getItem(BRAND_KEY) || "null");
      if (saved && typeof saved === "object") {
        return {
          institucion: saved.institucion || DEFAULTS.institucion,
          institucionCorta: saved.institucionCorta || DEFAULTS.institucionCorta,
          regional: saved.regional || DEFAULTS.regional,
          circuito: saved.circuito || DEFAULTS.circuito,
          escudo: saved.escudo || DEFAULTS.escudo,
          mascota: saved.mascota || DEFAULTS.mascota,
          logoMep: saved.logoMep || DEFAULTS.logoMep
        };
      }
    } catch {}
    return { ...DEFAULTS };
  }

  function saveBrand(cfg) {
    localStorage.setItem(BRAND_KEY, JSON.stringify(cfg));
  }

  function resetBrand() {
    localStorage.removeItem(BRAND_KEY);
  }

  function leerImagenOptimizada(file, maxW) {
    return new Promise((resolve, reject) => {
      if (!file) return reject("Sin archivo");
      const reader = new FileReader();
      reader.onerror = () => reject("Error leyendo imagen");
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        if (file.type === "image/svg+xml" || file.size < 320000) {
          return resolve(dataUrl);
        }
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / Math.max(img.width, img.height, 1));
          const cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(img.width * scale));
          cv.height = Math.max(1, Math.round(img.height * scale));
          const ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
          const mime = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
          resolve(cv.toDataURL(mime, 0.9));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  function aplicarTextosPersonalizados() {
    const cfg = getBrand();
    if (cfg.institucion === DEFAULTS.institucion && cfg.circuito === DEFAULTS.circuito && cfg.regional === DEFAULTS.regional) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodos = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue && (n.nodeValue.includes("Mercedes Norte") || n.nodeValue.includes("Circuito 02") || n.nodeValue.includes("CIRCUITO 02"))) {
        nodos.push(n);
      }
    }
    nodos.forEach(node => {
      node.nodeValue = node.nodeValue
        .replace(/COLEGIO TÉCNICO PROFESIONAL MERCEDES NORTE/g, cfg.institucion.toUpperCase())
        .replace(/Colegio Técnico Profesional Mercedes Norte/g, cfg.institucion)
        .replace(/CTP Mercedes Norte/g, cfg.institucionCorta)
        .replace(/Dirección Regional de Heredia/g, cfg.regional)
        .replace(/CIRCUITO 02/g, cfg.circuito.toUpperCase())
        .replace(/Circuito 02/g, cfg.circuito);
    });
  }

  function openModal() {
    const old = document.getElementById("bds-brand-modal");
    if (old) old.remove();

    let draft = getBrand();
    const modal = document.createElement("div");
    modal.id = "bds-brand-modal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.88);z-index:295000;display:flex;align-items:flex-start;justify-content:center;padding:18px 12px;overflow-y:auto;";

    function draw() {
      modal.innerHTML = `
        <div style="background:#0b1322;border:1px solid #38bdf8;border-radius:16px;max-width:740px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.9);color:#f1f5f9;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">IDENTIDAD SOBERANA • MARCA BLANCA</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🛡️ Escudo / Estandarte, Mascota y Logo MEP Oficial</h2>
            </div>
            <button id="bm-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
          </div>

          <p style="margin:0 0 14px;font-size:12px;color:#94a3b8;line-height:1.45;">
            Los archivos oficiales reales permanecen <b>fijos por defecto</b> en todos los navegadores y computadoras. Aquí puedes subir tu propio <b>Escudo/Estandarte</b>, <b>Logo/Mascota</b> o <b>Logo oficial del MEP</b> sin inventos ni marcas de agua.
          </p>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;text-align:center;">
              <div style="font-size:11.5px;font-weight:800;color:#38bdf8;margin-bottom:8px;">1. Escudo / Estandarte</div>
              <div style="height:86px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
                <img src="${draft.escudo}" alt="Escudo" style="max-height:82px;max-width:100%;background:#fff;padding:3px;border-radius:8px;object-fit:contain;"/>
              </div>
              <label style="display:inline-block;background:#1d4ed8;color:#fff;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">
                📤 Subir Escudo
                <input id="up-esc" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;"/>
              </label>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;text-align:center;">
              <div style="font-size:11.5px;font-weight:800;color:#2dd4bf;margin-bottom:8px;">2. Logo / Mascota</div>
              <div style="height:86px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
                <img src="${draft.mascota}" alt="Mascota" style="max-height:82px;max-width:100%;border-radius:50%;object-fit:contain;"/>
              </div>
              <label style="display:inline-block;background:#0f766e;color:#fff;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">
                📤 Subir Mascota
                <input id="up-mas" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;"/>
              </label>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;text-align:center;">
              <div style="font-size:11.5px;font-weight:800;color:#fbbf24;margin-bottom:8px;">3. Logo Oficial MEP</div>
              <div style="height:86px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
                <img src="${draft.logoMep}" alt="Logo MEP" style="max-height:64px;max-width:100%;background:#fff;padding:5px 8px;border-radius:8px;object-fit:contain;"/>
              </div>
              <label style="display:inline-block;background:#b45309;color:#fff;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">
                📤 Subir Logo MEP
                <input id="up-mep" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;"/>
              </label>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:16px;">
            <div>
              <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Nombre Oficial del Centro Educativo</label>
              <input id="bm-inst" type="text" value="${draft.institucion}" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            </div>
            <div>
              <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Nombre Corto (Barra Superior)</label>
              <input id="bm-corto" type="text" value="${draft.institucionCorta}" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            </div>
            <div>
              <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Dirección Regional</label>
              <input id="bm-reg" type="text" value="${draft.regional}" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            </div>
            <div>
              <label style="font-size:11px;color:#cbd5e1;display:block;margin-bottom:3px;">Circuito Escolar</label>
              <input id="bm-cir" type="text" value="${draft.circuito}" style="width:100%;background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;border-top:1px solid #1e293b;padding-top:12px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="bm-rst" style="background:#334155;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🔄 Restaurar Oficiales</button>
              <button id="bm-exp" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📥 Exportar JSON</button>
              <label style="background:#131f33;color:#34d399;border:1px solid #334155;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                📂 Importar JSON
                <input id="bm-imp" type="file" accept=".json" style="display:none;"/>
              </label>
            </div>
            <button id="bm-save" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">💾 Guardar y Aplicar</button>
          </div>
        </div>
      `;

      document.getElementById("bm-cls").onclick = () => modal.remove();
      document.getElementById("up-esc").onchange = async (e) => {
        if (!e.target.files[0]) return;
        draft.escudo = await leerImagenOptimizada(e.target.files[0], 512);
        draw();
      };
      document.getElementById("up-mas").onchange = async (e) => {
        if (!e.target.files[0]) return;
        draft.mascota = await leerImagenOptimizada(e.target.files[0], 512);
        draw();
      };
      document.getElementById("up-mep").onchange = async (e) => {
        if (!e.target.files[0]) return;
        draft.logoMep = await leerImagenOptimizada(e.target.files[0], 800);
        draw();
      };
      document.getElementById("bm-rst").onclick = () => {
        if (confirm("¿Restaurar el Escudo oficial del CTP Mercedes Norte, Búho Azul Original y Logo oficial del MEP?")) {
          resetBrand();
          location.reload();
        }
      };
      document.getElementById("bm-exp").onclick = () => {
        draft.institucion = document.getElementById("bm-inst").value.trim() || DEFAULTS.institucion;
        draft.institucionCorta = document.getElementById("bm-corto").value.trim() || DEFAULTS.institucionCorta;
        draft.regional = document.getElementById("bm-reg").value.trim() || DEFAULTS.regional;
        draft.circuito = document.getElementById("bm-cir").value.trim() || DEFAULTS.circuito;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
        a.download = "identidad-practicatecnica.json";
        a.click();
      };
      document.getElementById("bm-imp").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          try {
            const imp = JSON.parse(ev.target.result);
            draft = { ...DEFAULTS, ...imp };
            draw();
          } catch { alert("Archivo JSON de identidad inválido."); }
        };
        r.readAsText(f);
      };
      document.getElementById("bm-save").onclick = () => {
        draft.institucion = document.getElementById("bm-inst").value.trim() || DEFAULTS.institucion;
        draft.institucionCorta = document.getElementById("bm-corto").value.trim() || DEFAULTS.institucionCorta;
        draft.regional = document.getElementById("bm-reg").value.trim() || DEFAULTS.regional;
        draft.circuito = document.getElementById("bm-cir").value.trim() || DEFAULTS.circuito;
        saveBrand(draft);
        location.reload();
      };
    }

    document.body.appendChild(modal);
    draw();
  }

  window.BDS_BRAND = { get: getBrand, save: saveBrand, reset: resetBrand, openModal, applyTexts: aplicarTextosPersonalizados, DEFAULTS };
})();