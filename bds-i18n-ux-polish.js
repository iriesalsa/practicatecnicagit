(function () {
  // Diccionario extendido 4 idiomas (ES -> EN / PT / FR) cubriendo TODOS los módulos hasta v203.0
  const DICT_EXT = {
    "Inicio": { en: "Home", pt: "Início", fr: "Accueil" },
    "Trazabilidad": { en: "Traceability", pt: "Rastreabilidade", fr: "Traçabilité" },
    "Instituciones": { en: "Institutions", pt: "Instituições", fr: "Établissements" },
    "Horarios": { en: "Schedules", pt: "Horários", fr: "Horaires" },
    "Gestionar Permisos": { en: "Manage Permits", pt: "Gerenciar Permissões", fr: "Gérer les Permis" },
    "Gestionar Justificaciones": { en: "Manage Excuses", pt: "Gerenciar Justificativas", fr: "Gérer les Justificatifs" },
    "Notas MEP": { en: "Grades", pt: "Notas", fr: "Notes" },
    "Mis Notas": { en: "My Grades", pt: "Minhas Notas", fr: "Mes Notes" },
    "Conducta & SEA": { en: "Conduct & SEA", pt: "Conduta e SEA", fr: "Conduite & SEA" },
    "Planeamiento IA": { en: "AI Lesson Plans", pt: "Planejamento IA", fr: "Plans de Cours IA" },
    "Cooperativa": { en: "School Co-op", pt: "Cooperativa", fr: "Coopérative" },
    "Práctica Guía": { en: "Práctica Guide", pt: "Guia Práctica", fr: "Guide Práctica" },
    "Comedor": { en: "Cafeteria", pt: "Refeitório", fr: "Cantine" },
    "Agenda": { en: "Calendar", pt: "Agenda", fr: "Agenda" },
    "Respaldos": { en: "Backups", pt: "Backups", fr: "Sauvegardes" },
    "Seguimiento REA": { en: "Progress", pt: "Progresso", fr: "Suivi" },
    "Práctica": { en: "Practice", pt: "Prática", fr: "Pratique" },
    "Simulacro": { en: "Mock Exam", pt: "Simulado", fr: "Examen Blanc" },
    "Admisión": { en: "Admission", pt: "Admissão", fr: "Admission" },
    "Open Docs": { en: "Open Docs", pt: "Open Docs", fr: "Open Docs" },
    "Biblioteca": { en: "Library", pt: "Biblioteca", fr: "Bibliothèque" },
    "Juegos": { en: "Games", pt: "Jogos", fr: "Jeux" },
    "Hábitos": { en: "Habits", pt: "Hábitos", fr: "Habitudes" },
    "Carné QR": { en: "QR ID Card", pt: "Carteira QR", fr: "Carte QR" },
    "Dirección": { en: "Administration", pt: "Direção", fr: "Direction" },
    "Familia": { en: "Family", pt: "Família", fr: "Famille" },
    "Chats": { en: "Chats", pt: "Chats", fr: "Discussions" },
    "Salir": { en: "Sign Out", pt: "Sair", fr: "Déconnexion" },
    "Instalar": { en: "Install", pt: "Instalar", fr: "Installer" },
    "Escuchar Todo": { en: "Listen All", pt: "Ouvir Tudo", fr: "Tout Écouter" },
    "Caja Táctil POS": { en: "Touch POS", pt: "Caixa POS", fr: "Caisse POS" },
    "Libreta Digital": { en: "Digital Ledger", pt: "Caderneta Digital", fr: "Carnet Numérique" },
    "Reciclaje": { en: "Recycling", pt: "Reciclagem", fr: "Recyclage" },
    "Productos": { en: "Products", pt: "Produtos", fr: "Produits" },
    "Matrícula & Docs QR": { en: "Enrollment & QR Docs", pt: "Matrícula e Docs QR", fr: "Inscription & Docs QR" },
    "Conducta REA": { en: "Conduct", pt: "Conduta", fr: "Conduite" },
    "Organización": { en: "Organization", pt: "Organização", fr: "Organisation" },
    "Bienestar": { en: "Wellness", pt: "Bem-estar", fr: "Bien-être" },
    "Finanzas": { en: "Finances", pt: "Finanças", fr: "Finances" },
    "Motivación": { en: "Motivation", pt: "Motivação", fr: "Motivation" },
    "Recordatorio": { en: "Reminder", pt: "Lembrete", fr: "Rappel" },
    "ACCESOS RÁPIDOS": { en: "QUICK ACCESS", pt: "ACESSO RÁPIDO", fr: "ACCÈS RAPIDES" },
    "Ingresar a la Plataforma": { en: "Sign In", pt: "Entrar na Plataforma", fr: "Se Connecter" },
    "Continuar con Google": { en: "Continue with Google", pt: "Continuar com Google", fr: "Continuer avec Google" },
    "Cerrar Sesión": { en: "Sign Out", pt: "Encerrar Sessão", fr: "Déconnexion" }
  };

  // Inyectar hoja de estilos UX/UI Light Mode de alto contraste + Accesibilidad DUA/WCAG
  function injectPolishCSS() {
    if (document.getElementById("bds-ux-polish-v203")) return;
    const st = document.createElement("style");
    st.id = "bds-ux-polish-v203";
    st.innerHTML = `
      /* Accesibilidad DUA + Interacciones fluidas */
      button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible {
        outline: 2px solid #38bdf8 !important; outline-offset: 2px !important;
      }
      button { transition: transform .08s ease, filter .12s ease; }
      button:active { transform: scale(0.98); }
      table { border-radius: 8px; overflow: hidden; }

      /* Modo Claro Completo de Alto Contraste (WCAG AA) */
      body.bds-light, html[data-theme="light"] body {
        background: #f1f5f9 !important; color: #0f172a !important;
      }
      body.bds-light #bds-header, html[data-theme="light"] #bds-header,
      body.bds-light #bds-subnav, html[data-theme="light"] #bds-subnav,
      body.bds-light #bds-dock, html[data-theme="light"] #bds-dock {
        background: rgba(255,255,255,0.97) !important;
        border-color: #cbd5e1 !important;
        color: #0f172a !important;
      }
      body.bds-light .bds-card, html[data-theme="light"] .bds-card {
        background: #ffffff !important;
        border-color: #cbd5e1 !important;
        color: #0f172a !important;
        box-shadow: 0 4px 16px rgba(15,23,42,0.06) !important;
      }
      body.bds-light .bds-nav-btn, html[data-theme="light"] .bds-nav-btn {
        background: #f8fafc !important;
        border-color: #cbd5e1 !important;
        color: #0f172a !important;
      }
      body.bds-light .bds-nav-btn.active, html[data-theme="light"] .bds-nav-btn.active {
        background: #1d4ed8 !important;
        border-color: #1d4ed8 !important;
        color: #ffffff !important;
      }
      body.bds-light .bds-card h1, body.bds-light .bds-card h2, body.bds-light .bds-card h3, body.bds-light .bds-card h4,
      html[data-theme="light"] .bds-card h1, html[data-theme="light"] .bds-card h2, html[data-theme="light"] .bds-card h3 {
        color: #0f172a !important;
      }
      body.bds-light input, body.bds-light select, body.bds-light textarea,
      html[data-theme="light"] input, html[data-theme="light"] select, html[data-theme="light"] textarea {
        background: #ffffff !important;
        color: #0f172a !important;
        border-color: #94a3b8 !important;
      }
      body.bds-light table tr[style*="background:#131f33"], html[data-theme="light"] table tr[style*="background:#131f33"] {
        background: #e2e8f0 !important;
        color: #0f172a !important;
      }
      body.bds-light div[style*="background:#070d19"], body.bds-light div[style*="background:#0b1322"],
      html[data-theme="light"] div[style*="background:#070d19"], html[data-theme="light"] div[style*="background:#0b1322"] {
        background: #f8fafc !important;
        color: #0f172a !important;
        border-color: #cbd5e1 !important;
      }
      body.bds-light div[style*="color:#cbd5e1"], body.bds-light span[style*="color:#cbd5e1"],
      html[data-theme="light"] div[style*="color:#cbd5e1"] {
        color: #334155 !important;
      }
    `;
    document.head.appendChild(st);
  }

  // Motor de traducción incremental sobre nodos de texto (respeta emojis, data-no-i18n y formularios)
  function translateTree(lang) {
    if (!lang || lang === "es" || !document.body) return;
    const keys = Object.keys(DICT_EXT).sort((a, b) => b.length - a.length);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("[data-no-i18n='true']") || ["SCRIPT","STYLE","INPUT","TEXTAREA","CODE"].includes(parent.tagName)) continue;
      let txt = node.nodeValue;
      if (!txt || txt.trim().length < 3) continue;
      let changed = false;
      for (const es of keys) {
        const tr = DICT_EXT[es][lang];
        if (tr && txt.includes(es) && !txt.includes(tr)) {
          txt = txt.replace(es, tr);
          changed = true;
        }
      }
      if (changed) node.nodeValue = txt;
    }
  }

  // Precargar voces del sistema para que TTS responda al instante en ES / EN / PT / FR
  function warmVoices() {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => { try { window.speechSynthesis.getVoices(); } catch {} };
      }
    } catch {}
  }

  // Envolver BDS_UI.applyLang si existe para traducir también los módulos nuevos v198–v203
  function enhanceUI() {
    injectPolishCSS();
    warmVoices();
    if (window.BDS_UI && !window.BDS_UI.__v203Wrapped) {
      const origApply = window.BDS_UI.applyLang;
      window.BDS_UI.applyLang = function (lang) {
        if (origApply) origApply(lang);
        setTimeout(() => translateTree(lang), 60);
      };
      window.BDS_UI.__v203Wrapped = true;
    }
    let deb = null;
    const obs = new MutationObserver(() => {
      const lg = window.BDS_UI && window.BDS_UI.getLang ? window.BDS_UI.getLang() : "es";
      if (lg !== "es") {
        clearTimeout(deb);
        deb = setTimeout(() => translateTree(lg), 120);
      }
      // Inyectar botón de audio 🔊 junto a "✨ Motivación" para escuchar el saludo pracTICA en voz alta
      const motBtn = document.getElementById("pr-mot-next");
      if (motBtn && !document.getElementById("pr-mot-tts")) {
        const b = document.createElement("button");
        b.type = "button"; b.id = "pr-mot-tts";
        b.title = "Escuchar saludo y motivación en voz alta";
        b.style.cssText = "background:#1e3a8a;color:#93c5fd;border:1px solid #38bdf8;padding:4px 8px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;";
        b.innerText = "🔊 Escuchar";
        b.onclick = () => {
          const card = document.querySelector("#bds-shell .bds-card");
          const txt = card ? card.innerText.replace(/\s+/g, " ").slice(0, 320) : "Bienvenido a pracTICA";
          if (window.BDS_NATIVE) window.BDS_NATIVE.speak(txt);
        };
        motBtn.parentElement.insertBefore(b, motBtn);
      }
    });
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  }

  window.BDS_POLISH_V203 = { DICT_EXT, translateTree, warmVoices };
  window.addEventListener("DOMContentLoaded", enhanceUI);
})();