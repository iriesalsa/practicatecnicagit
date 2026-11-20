(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const ROLES_OPERATIVOS_NEUTROS = [
    "Auxiliar de Vigilancia (Seguridad)",
    "Conserje / Mantenimiento",
    "Docente MEP",
    "Orientador(a)",
    "Auxiliar Administrativo",
    "Secretaria / Secretario"
  ];

  function getSaludoNeutral(sesion) {
    const nombre = (sesion && sesion.nombre) ? String(sesion.nombre).trim() : "colega";
    const rol = (sesion && sesion.rol) ? String(sesion.rol).trim() : "Personal Institucional";
    return `¡Hola, ${nombre}! Bienvenido(a) a pracTICAtecnica.com • Perfil activo: ${rol}. Espacio neutral, ágil y seguro para todo el personal.`;
  }

  function esRolOperativoNeutral(rol) {
    return ROLES_OPERATIVOS_NEUTROS.includes(String(rol || "").trim());
  }

  function inyectarBarraRapidaNeutral() {
    const shell = document.getElementById("bds-shell");
    if (!shell || !document.body) return;
    const firstCard = shell.querySelector(".bds-card");
    if (!firstCard || document.getElementById("bds-neutral-bar-v227")) return;

    let sesion = null;
    try {
      sesion = JSON.parse(sessionStorage.getItem("bds_session_v184_ctpmn_c02") || localStorage.getItem("bds_session_v184_ctpmn_c02") || "null");
    } catch {}

    const bar = document.createElement("div");
    bar.id = "bds-neutral-bar-v227";
    bar.style.cssText = "background:#070d19;border:1px solid #1e3a8a;border-radius:10px;padding:9px 12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:11.5px;";
    bar.innerHTML = `
      <span style="color:#e2e8f0;font-weight:600;">🤝 ${getSaludoNeutral(sesion)}</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button type="button" id="bds-btn-qr-v227" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🔐 Validar QR / SHA-256</button>
        <button type="button" id="bds-btn-llv-v227" style="background:#b45309;color:#fff;border:none;padding:5px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🔑 Llaves Aulas/Labs</button>
        <button type="button" id="bds-btn-prm-v227" style="background:#1d4ed8;color:#fff;border:none;padding:5px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📝 Permisos y Justif.</button>
      </div>
    `;

    firstCard.insertBefore(bar, firstCard.firstChild);

    const bQr = document.getElementById("bds-btn-qr-v227");
    if (bQr) bQr.onclick = () => {
      if (window.BDS_VERIFICADOR_QR_V226 && typeof window.BDS_VERIFICADOR_QR_V226.renderVerificadorModal === "function") {
        window.BDS_VERIFICADOR_QR_V226.renderVerificadorModal();
      }
    };
    const bLlv = document.getElementById("bds-btn-llv-v227");
    if (bLlv) bLlv.onclick = () => {
      if (typeof window.bdsGo === "function") window.bdsGo("llaves_aulas");
    };
    const bPrm = document.getElementById("bds-btn-prm-v227");
    if (bPrm) bPrm.onclick = () => {
      if (typeof window.bdsGo === "function") window.bdsGo("permisos");
    };
  }

  window.BDS_NEUTRALIDAD_V227 = {
    ROLES_OPERATIVOS_NEUTROS,
    getSaludoNeutral,
    esRolOperativoNeutral,
    inyectarBarraRapidaNeutral
  };

  if (typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      inyectarBarraRapidaNeutral();
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => inyectarBarraRapidaNeutral()).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();