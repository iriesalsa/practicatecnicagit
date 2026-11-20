(function () {
  const TTS_RATE_KEY = "bds_tts_rate_v195";

  function isCapacitor() {
    return Boolean(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());
  }

  function getPlatform() {
    if (isCapacitor() && window.Capacitor.getPlatform) return window.Capacitor.getPlatform();
    const ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "android-web";
    if (/iPhone|iPad|iPod/i.test(ua)) return "ios-web";
    if (/Mac OS X/i.test(ua)) return "macos-web";
    if (/Windows/i.test(ua)) return "windows-web";
    return "web";
  }

  // Sonido suave de notificación (funciona en todos los navegadores)
  function playChime() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1174, ctx.currentTime + 0.14);
      g.gain.setValueAtTime(0.14, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.29);
      setTimeout(() => ctx.close().catch(() => {}), 500);
    } catch {}
  }

  // Vibración nativa (Capacitor Haptics o navigator.vibrate)
  function haptic(ms) {
    try {
      const capH = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (capH && capH.vibrate) { capH.vibrate({ duration: ms || 80 }); return; }
      if (navigator.vibrate) navigator.vibrate(ms || [80, 40, 80]);
    } catch {}
  }

  // Banner Push flotante In-App (SIEMPRE visible incluso si el OS bloquea popups)
  function showInAppToast(titulo, cuerpo) {
    let host = document.getElementById("bds-toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "bds-toast-host";
      host.style.cssText = "position:fixed;top:64px;right:14px;z-index:350000;display:flex;flex-direction:column;gap:8px;max-width:min(360px,calc(100vw - 24px));pointer-events:none;";
      document.body.appendChild(host);
    }
    const card = document.createElement("div");
    card.style.cssText = "pointer-events:auto;background:#0f172a;border:1.5px solid #38bdf8;border-left:5px solid #10b981;color:#f8fafc;border-radius:12px;padding:11px 13px;box-shadow:0 14px 36px rgba(0,0,0,0.65);display:flex;gap:10px;align-items:flex-start;animation:fadeIn .2s ease;";
    card.innerHTML = `
      <div style="font-size:18px;line-height:1;">🔔</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12.5px;font-weight:800;color:#38bdf8;">${titulo}</div>
        <div style="font-size:12px;color:#e2e8f0;margin-top:2px;line-height:1.35;">${cuerpo}</div>
      </div>
      <button style="background:none;border:none;color:#94a3b8;font-size:14px;cursor:pointer;padding:0 4px;">✕</button>
    `;
    card.querySelector("button").onclick = () => card.remove();
    host.prepend(card);
    setTimeout(() => { if (card.parentElement) card.remove(); }, 6500);
  }

  // Notificación Push REAL (Capacitor LocalNotifications -> SW showNotification -> Window Notification -> In-App Toast)
  async function notify(titulo, cuerpo) {
    playChime();
    haptic(90);
    showInAppToast(titulo, cuerpo);

    // 1. Si corre dentro de Capacitor nativo (Android/iOS)
    try {
      const capLN = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (capLN) {
        await capLN.requestPermissions();
        await capLN.schedule({
          notifications: [{ id: Math.floor(Date.now() % 2147483000), title: titulo, body: cuerpo, schedule: { at: new Date(Date.now() + 200) } }]
        });
        return true;
      }
    } catch {}

    // 2. Web / PWA (Android Chrome, Windows, macOS, Safari iOS 16.4+)
    try {
      if ("Notification" in window) {
        let perm = Notification.permission;
        if (perm === "default") perm = await Notification.requestPermission();
        if (perm === "granted") {
          if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.ready;
            if (reg && reg.showNotification) {
              await reg.showNotification(titulo, {
                body: cuerpo,
                icon: "/buho-oficial.png",
                badge: "/buho-oficial.png",
                vibrate: [100, 50, 100],
                tag: "practicatecnica-" + Date.now(),
                renotify: true,
                data: { url: "/" }
              });
              return true;
            }
          }
          new Notification(titulo, { body: cuerpo, icon: "/buho-oficial.png" });
          return true;
        }
      }
    } catch {}
    return false;
  }

  // Compartir nativo (Capacitor Share -> Web Share API -> Clipboard)
  async function share(title, text, url) {
    const shareUrl = url || window.location.href;
    try {
      const capS = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share;
      if (capS && capS.share) { await capS.share({ title, text, url: shareUrl }); return true; }
      if (navigator.share) { await navigator.share({ title, text, url: shareUrl }); return true; }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${title} — ${text} ${shareUrl}`);
        showInAppToast("📋 Enlace copiado", "Listo para pegar en WhatsApp, Teams o correo.");
        return true;
      }
    } catch {}
    return false;
  }

  // Lector de voz inclusivo multilingüe (ES / EN / PT / FR) con velocidad configurable
  function getSpeechLang(hintLang, text) {
    if (hintLang) return hintLang;
    const uiLang = (window.BDS_UI && window.BDS_UI.getLang) ? window.BDS_UI.getLang() : "es";
    const t = String(text || "");
    if (/\b(Choose|Which|Complete|Select|What does|Simple Past|Present Simple)\b/i.test(t)) return "en-US";
    if (/\b(Comment dit-on|Je m'appelle|Nous sommes|Merci beaucoup|S'il vous)\b/i.test(t)) return "fr-FR";
    const map = { es: "es-CR", en: "en-US", pt: "pt-BR", fr: "fr-FR" };
    return map[uiLang] || "es-CR";
  }

  function getTtsRate() {
    const r = parseFloat(localStorage.getItem(TTS_RATE_KEY) || "0.96");
    return isNaN(r) ? 0.96 : r;
  }

  function setTtsRate(r) {
    localStorage.setItem(TTS_RATE_KEY, String(r));
  }

  function stopSpeak() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch {}
  }

  function speak(text, hintLang) {
    if (!text) return;
    const langCode = getSpeechLang(hintLang, text);
    stopSpeak();
    try {
      if (!("speechSynthesis" in window)) {
        showInAppToast("🔊 Audio", "Este dispositivo no soporta síntesis de voz.");
        return;
      }
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = langCode;
      u.rate = getTtsRate();
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const prefix = langCode.slice(0, 2).toLowerCase();
      const match = voices.find(v => (v.lang || "").toLowerCase().startsWith(langCode.toLowerCase()))
        || voices.find(v => (v.lang || "").toLowerCase().startsWith(prefix));
      if (match) u.voice = match;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function speakQuestion(item) {
    if (!item) return;
    const lang = getSpeechLang(item.lang, item.q);
    const prefMap = {
      es: ["Pregunta:", "Opción A:", "Opción B:", "Opción C:", "Opción D:"],
      en: ["Question:", "Option A:", "Option B:", "Option C:", "Option D:"],
      pt: ["Pergunta:", "Opção A:", "Opção B:", "Opção C:", "Opção D:"],
      fr: ["Question :", "Option A :", "Option B :", "Option C :", "Option D :"]
    };
    const p = prefMap[lang.slice(0, 2).toLowerCase()] || prefMap.es;
    const optsTxt = (item.opts || []).map((o, i) => `${p[i + 1] || ""} ${o.txt}`).join(". ");
    speak(`${p[0]} ${item.q}. ${optsTxt}`, lang);
  }

  window.BDS_NATIVE = { isCapacitor, getPlatform, notify, showInAppToast, playChime, haptic, share, speak, speakQuestion, stopSpeak, getTtsRate, setTtsRate };
})();

/* bds-tts-latam-enus-v217 */
(function () {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const LATAM_LANGS = ["es-419", "es-CR", "es-MX", "es-US", "es-CO", "es-AR", "es-CL", "es-PE"];

  function pickBestVoice(langCode) {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const target = String(langCode || "es-419").toLowerCase();

    if (target.startsWith("en")) {
      return (
        voices.find(v => /en-us/i.test(v.lang) && /natural|neural|google|microsoft|samantha|ava|aria|guy/i.test(v.name)) ||
        voices.find(v => /en-us/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang)) ||
        null
      );
    }

    // Prioridad estricta a Español Latinoamérica / Neutral (evitando es-ES cuando exista opción LATAM)
    for (const code of LATAM_LANGS) {
      const hit = voices.find(v => String(v.lang || "").toLowerCase() === code.toLowerCase());
      if (hit) return hit;
    }
    const latamName = voices.find(v => /^es/i.test(v.lang) && !/es-es|españa|spain|jorge|monica|jordi|helena|paloma/i.test(`${v.lang} ${v.name}`));
    if (latamName) return latamName;
    const anyEs = voices.find(v => /^es/i.test(v.lang));
    return anyEs || null;
  }

  const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
  window.speechSynthesis.speak = function (utterance) {
    try {
      if (utterance) {
        const rawLang = String(utterance.lang || "");
        const desiredLang = rawLang.toLowerCase().startsWith("en")
          ? "en-US"
          : (rawLang.toLowerCase().startsWith("fr") ? "fr-FR" : (rawLang.toLowerCase().startsWith("pt") ? "pt-BR" : "es-419"));
        const chosen = pickBestVoice(desiredLang);
        if (chosen) {
          utterance.voice = chosen;
          utterance.lang = chosen.lang || desiredLang;
        } else if (!desiredLang.startsWith("en")) {
          utterance.lang = "es-419";
        }
      }
    } catch {}
    return origSpeak(utterance);
  };
})();