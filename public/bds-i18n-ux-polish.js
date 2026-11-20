(function () {
  const THEME_KEY = "bds_theme_mode_v212";
  const LANG_KEY = "bds_lang_v187";

  const DICT_EXT = {
    "Inicio": { en: "Home", pt: "Início", fr: "Accueil" },
    "Trazabilidad": { en: "Traceability", pt: "Rastreabilidade", fr: "Traçabilité" },
    "Instituciones": { en: "Institutions", pt: "Instituições", fr: "Établissements" },
    "Horarios": { en: "Schedules", pt: "Horários", fr: "Horaires" },
    "Gestionar Permisos": { en: "Manage Permits", pt: "Gerenciar Permissões", fr: "Gérer les Permis" },
    "Gestionar Justificaciones": { en: "Manage Excuses", pt: "Gerenciar Justificativas", fr: "Gérer les Justificatifs" },
    "Notas MEP": { en: "Grades", pt: "Notas", fr: "Notes" },
    "Mis Notas": { en: "My Grades", pt: "Minhas Notas", fr: "Mes Notes" },
    "Conducta REAC & SEA": { en: "Conduct & SEA", pt: "Conduta e SEA", fr: "Conduite & SEA" },
    "Orientación REAC": { en: "Counseling", pt: "Orientação", fr: "Orientation" },
    "Llaves & Aulas": { en: "Room Keys QR", pt: "Chaves e Salas", fr: "Clés des Salles" },
    "Idiomas (4 Skills)": { en: "Language Lab", pt: "Lab. Idiomas", fr: "Lab. Langues" },
    "Asignación Grupos": { en: "Assignments", pt: "Atribuições", fr: "Affectations" },
    "Portón & Seguridad": { en: "Gate Security", pt: "Portaria QR", fr: "Sécurité Portail" },
    "Conserjería": { en: "Maintenance", pt: "Manutenção", fr: "Entretien" },
    "Antologías & Libros": { en: "Books & Anthologies", pt: "Livros e Antologias", fr: "Livres & Anthologies" },
    "Secretaría & Cruce": { en: "Records & Cross-Check", pt: "Secretaria e Cruzamento", fr: "Secrétariat & Croisement" },
    "Planeamiento IA": { en: "AI Lesson Plans", pt: "Planejamento IA", fr: "Plans de Cours IA" },
    "Cooperativa": { en: "School Co-op", pt: "Cooperativa", fr: "Coopérative" },
    "Práctica Guía": { en: "Práctica Guide", pt: "Guia Práctica", fr: "Guide Práctica" },
    "Comedor": { en: "Cafeteria", pt: "Refeitório", fr: "Cantine" },
    "Agenda": { en: "Calendar", pt: "Agenda", fr: "Agenda" },
    "Respaldos": { en: "Backups", pt: "Backups", fr: "Sauvegardes" },
    "Seguimiento REAC": { en: "Progress", pt: "Progresso", fr: "Suivi" },
    "Práctica": { en: "Practice", pt: "Prática", fr: "Pratique" },
    "Simulacro": { en: "Mock Exam", pt: "Simulado", fr: "Examen Blanc" },
    "Admisión": { en: "Admission", pt: "Admissão", fr: "Admission" },
    "Biblioteca": { en: "Library", pt: "Biblioteca", fr: "Bibliothèque" },
    "Juegos": { en: "Games", pt: "Jogos", fr: "Jeux" },
    "Hábitos": { en: "Habits", pt: "Hábitos", fr: "Habitudes" },
    "Carné QR": { en: "QR ID Card", pt: "Carteira QR", fr: "Carte QR" },
    "Dirección": { en: "Administration", pt: "Direção", fr: "Direction" },
    "Familia": { en: "Family", pt: "Família", fr: "Famille" },
    "Chats": { en: "Chats", pt: "Chats", fr: "Discussions" },
    "Planes": { en: "Plans", pt: "Planos", fr: "Forfaits" },
    "Salir": { en: "Sign Out", pt: "Sair", fr: "Déconnexion" },
    "Instalar": { en: "Install", pt: "Instalar", fr: "Installer" },
    "Escuchar Todo": { en: "Listen All", pt: "Ouvir Tudo", fr: "Tout Écouter" },
    "Caja Táctil POS": { en: "Touch POS", pt: "Caixa POS", fr: "Caisse POS" },
    "Libreta Digital": { en: "Digital Ledger", pt: "Caderneta Digital", fr: "Carnet Numérique" },
    "Reciclaje": { en: "Recycling", pt: "Reciclagem", fr: "Recyclage" },
    "Productos": { en: "Products", pt: "Produtos", fr: "Produits" },
    "ACCESOS RÁPIDOS": { en: "QUICK ACCESS", pt: "ACESSO RÁPIDO", fr: "ACCÈS RAPIDES" },
    "Ingresar a la Plataforma": { en: "Sign In", pt: "Entrar na Plataforma", fr: "Se Connecter" },
    "Continuar con Google": { en: "Continue with Google", pt: "Continuar com Google", fr: "Continuer avec Google" },
    "Enviar Solicitud con QR SHA-256": { en: "Submit Request with QR SHA-256", pt: "Enviar Solicitação com QR SHA-256", fr: "Envoyer la Demande avec QR SHA-256" },
    "Enviar Justificación con QR SHA-256": { en: "Submit Justification with QR SHA-256", pt: "Enviar Justificativa com QR SHA-256", fr: "Envoyer le Justificatif avec QR SHA-256" }
  };

  function getLang() {
    const l = localStorage.getItem(LANG_KEY) || "es";
    return ["es", "en", "pt", "fr"].includes(l) ? l : "es";
  }

  function getTheme() {
    const v = localStorage.getItem(THEME_KEY) || localStorage.getItem("bds_theme_v187") || "dark";
    return v === "light" ? "light" : "dark";
  }

  function applyTheme(mode) {
    const t = mode === "light" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, t);
    localStorage.setItem("bds_theme_v187", t);
    if (typeof document !== "undefined") {
      if (document.documentElement) document.documentElement.setAttribute("data-theme", t);
      if (document.body) {
        document.body.classList.toggle("bds-light", t === "light");
        document.body.classList.toggle("bds-dark", t === "dark");
      }
      const bTop = document.getElementById("bds-theme-btn");
      if (bTop) bTop.innerText = t === "light" ? "🌙" : "☀️";
      const bLg = document.getElementById("lg-theme");
      if (bLg) bLg.innerText = t === "light" ? "🌙 Oscuro" : "☀️ Claro";
    }
    return t;
  }

  function toggleTheme() {
    return applyTheme(getTheme() === "light" ? "dark" : "light");
  }

  function injectLightDarkCSS() {
    if (typeof document === "undefined" || !document.head || document.getElementById("bds-ux-polish-v212")) return;
    const st = document.createElement("style");
    st.id = "bds-ux-polish-v212";
    st.innerHTML = `
      button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid #38bdf8 !important; outline-offset: 2px !important; }
      button { transition: transform .08s ease, filter .12s ease; }
      button:active { transform: scale(0.98); }

      html[data-theme="light"], html[data-theme="light"] body, body.bds-light {
        background: #eef2f6 !important; color: #0f172a !important;
      }
      body.bds-light #bds-login-v193 {
        background: radial-gradient(circle at 50% 0%, #dbeafe 0%, #f1f5f9 75%) !important;
      }
      body.bds-light #bds-header, body.bds-light #bds-subnav, body.bds-light #bds-dock {
        background: rgba(255,255,255,0.98) !important; border-color: #cbd5e1 !important; color: #0f172a !important;
      }
      body.bds-light .bds-card {
        background: #ffffff !important; border-color: #cbd5e1 !important; color: #0f172a !important;
        box-shadow: 0 4px 18px rgba(15,23,42,0.08) !important;
      }
      body.bds-light .bds-nav-btn {
        background: #f1f5f9 !important; border-color: #cbd5e1 !important; color: #0f172a !important;
      }
      body.bds-light .bds-nav-btn.active {
        background: #1d4ed8 !important; border-color: #1d4ed8 !important; color: #ffffff !important;
      }
      body.bds-light #bds-shell h1, body.bds-light #bds-shell h2, body.bds-light #bds-shell h3, body.bds-light #bds-shell h4,
      body.bds-light #bds-shell b, body.bds-light #bds-login-v193 h1, body.bds-light #bds-login-v193 h2, body.bds-light #bds-login-v193 p, body.bds-light #bds-login-v193 label {
        color: #0f172a !important;
      }
      body.bds-light #bds-shell div[style*="background:#070d19"],
      body.bds-light #bds-shell div[style*="background:#0b1322"],
      body.bds-light #bds-shell form[style*="background:#070d19"],
      body.bds-light #bds-shell div[style*="linear-gradient"] {
        background: #f8fafc !important; color: #0f172a !important; border-color: #cbd5e1 !important;
      }
      body.bds-light #bds-shell td[style*="background:#0b1322"],
      body.bds-light #bds-shell td[style*="background:#070d19"],
      body.bds-light #bds-shell td[style*="background:#060c17"] {
        background: #ffffff !important; color: #0f172a !important; border-color: #cbd5e1 !important;
      }
      body.bds-light #bds-shell tr[style*="background:#131f33"] {
        background: #e2e8f0 !important; color: #0f172a !important;
      }
      body.bds-light input, body.bds-light select, body.bds-light textarea {
        background: #ffffff !important; color: #0f172a !important; border-color: #94a3b8 !important;
      }
      body.bds-light #bds-shell [style*="color:#fff"], body.bds-light #bds-shell [style*="color:#cbd5e1"], body.bds-light #bds-shell [style*="color:#e2e8f0"] {
        color: #1e293b !important;
      }
      body.bds-light #bds-shell button[style*="background:#1d4ed8"],
      body.bds-light #bds-shell button[style*="background:#059669"],
      body.bds-light #bds-shell button[style*="background:#0f766e"],
      body.bds-light #bds-shell button[style*="background:#7c3aed"],
      body.bds-light #bds-shell button[style*="background:#dc2626"],
      body.bds-light #bds-shell button[style*="background:#b45309"],
      body.bds-light #bds-shell button[style*="background:#0284c7"],
      body.bds-light #bds-shell button[style*="background:#1e3a8a"],
      body.bds-light #bds-shell button.bds-quick-btn {
        color: #ffffff !important;
      }
      body.bds-light #bds-header [style*="color:#fff"], body.bds-light #bds-header [style*="color:#94a3b8"] {
        color: #0f172a !important;
      }
    `;
    document.head.appendChild(st);
  }

  function translateTree(lang) {
    const activeLang = lang || getLang();
    if (!activeLang || activeLang === "es" || typeof document === "undefined" || !document.body || typeof document.createTreeWalker !== "function" || typeof NodeFilter === "undefined") return;
    const keys = Object.keys(DICT_EXT).sort((a, b) => b.length - a.length);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const p = node.parentElement;
      if (!p || p.closest("[data-no-i18n='true']") || ["SCRIPT","STYLE","INPUT","TEXTAREA","CODE"].includes(p.tagName)) continue;
      let txt = node.nodeValue;
      if (!txt || txt.trim().length < 2) continue;
      let changed = false;
      for (const es of keys) {
        const tr = DICT_EXT[es][activeLang];
        if (tr && txt.includes(es) && !txt.includes(tr)) { txt = txt.replace(es, tr); changed = true; }
      }
      if (changed) node.nodeValue = txt;
    }
  }

  function warmVoices() {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => { try { window.speechSynthesis.getVoices(); } catch {} };
      }
    } catch {}
  }

  function installUnifiedUI() {
    injectLightDarkCSS();
    warmVoices();
    const prev = window.BDS_UI || {};
    const origApplyLang = prev.applyLang;
    window.BDS_UI = {
      ...prev,
      getTheme,
      applyTheme,
      toggleTheme,
      getLang,
      applyLang: function (lg) {
        const chosen = ["es", "en", "pt", "fr"].includes(lg) ? lg : "es";
        localStorage.setItem(LANG_KEY, chosen);
        if (origApplyLang) origApplyLang(chosen);
        translateTree(chosen);
        setTimeout(() => translateTree(chosen), 80);
      }
    };
    applyTheme(getTheme());
    if (getLang() !== "es") translateTree(getLang());

    if (typeof MutationObserver !== "undefined" && document.body) {
      let deb = null;
      new MutationObserver(() => {
        const curT = getTheme();
        if (document.body.classList.contains("bds-light") !== (curT === "light")) applyTheme(curT);
        const lg = getLang();
        if (lg !== "es") { clearTimeout(deb); deb = setTimeout(() => translateTree(lg), 90); }
        const motBtn = document.getElementById("pr-mot-next");
        if (motBtn && !document.getElementById("pr-mot-tts")) {
          const b = document.createElement("button");
          b.type = "button"; b.id = "pr-mot-tts";
          b.style.cssText = "background:#1e3a8a;color:#93c5fd;border:1px solid #38bdf8;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;";
          b.innerText = "🔊 Escuchar";
          b.onclick = () => {
            const card = document.querySelector("#bds-shell .bds-card");
            const txt = card ? card.innerText.replace(/\s+/g, " ").slice(0, 320) : "Bienvenido a pracTICA";
            if (window.BDS_NATIVE) window.BDS_NATIVE.speak(txt);
          };
          motBtn.parentElement.insertBefore(b, motBtn);
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.BDS_POLISH_V203 = { DICT_EXT, translateTree, warmVoices, getTheme, applyTheme, toggleTheme, getLang };
  if (typeof window !== "undefined") {
    installUnifiedUI();
    if (typeof window.addEventListener === "function") window.addEventListener("DOMContentLoaded", installUnifiedUI);
  }
})();