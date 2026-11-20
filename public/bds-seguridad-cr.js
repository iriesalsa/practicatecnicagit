(function () {
  function sanitizeText(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isSafeUrl(url) {
    const u = String(url || "").trim();
    if (!u) return false;
    if (/^(javascript|data:text\/html|vbscript):/i.test(u)) return false;
    return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u);
  }

  // Blinda todos los enlaces externos contra Reverse Tabnabbing y valida protocolos
  function hardenLinks(root) {
    const scope = root || (typeof document !== "undefined" ? document : null);
    if (!scope || !scope.querySelectorAll) return 0;
    let fixed = 0;
    scope.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href") || "";
      if (!isSafeUrl(href)) {
        a.setAttribute("href", "#");
        fixed++;
        return;
      }
      if (a.getAttribute("target") === "_blank") {
        const rel = (a.getAttribute("rel") || "").toLowerCase();
        if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
          a.setAttribute("rel", "noopener noreferrer");
          fixed++;
        }
      }
    });
    return fixed;
  }

  // Garantiza que cualquier clic en botón de chats abra el modal en móvil y desktop
  function bindGlobalChatGuards() {
    if (typeof document === "undefined") return;
    const ensureBind = () => {
      const topBtn = document.getElementById("btn-ch");
      if (topBtn && !topBtn.__bdsChatBound) {
        topBtn.__bdsChatBound = true;
        topBtn.style.display = "inline-flex";
        topBtn.style.alignItems = "center";
        topBtn.onclick = (e) => {
          if (e) e.preventDefault();
          if (typeof window.bdsOpenChats === "function") window.bdsOpenChats();
          else if (typeof window.BDS_TOGGLE_CHATS_PRO === "function") {
            let s = null;
            try { s = JSON.parse(sessionStorage.getItem("bds_session_v184_ctpmn_c02") || localStorage.getItem("bds_session_v184_ctpmn_c02") || "null"); } catch {}
            if (s) window.BDS_TOGGLE_CHATS_PRO(s);
          }
        };
      }
      hardenLinks(document);
    };
    if (typeof MutationObserver !== "undefined" && document.body) {
      new MutationObserver(() => ensureBind()).observe(document.body, { childList: true, subtree: true });
    }
    ensureBind();
  }

  const COMPLIANCE_CR = {
    prodhab: "Ley N.° 8968 — Protección de la Persona frente al Tratamiento de sus Datos Personales",
    ninez: "Ley N.° 7739 — Código de la Niñez y la Adolescencia (Protección Integral de Menores)",
    ley7600: "Ley N.° 7600 — Igualdad de Oportunidades y Accesibilidad DUA",
    reac: "REAC — Reglamento de Evaluación de los Aprendizajes y Conducta",
    hashAlgo: "SHA-256"
  };

  window.BDS_SEC_CR = { sanitizeText, isSafeUrl, hardenLinks, COMPLIANCE_CR };
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", bindGlobalChatGuards);
  }
})();