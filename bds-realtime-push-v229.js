(function () {
  if (typeof window === "undefined") return;
  const CFG_KEY = "bds_supabase_rt_cfg_v229";
  const QUEUE_KEY = "bds_porton_sync_queue_v229";
  const TOKENS_KEY = "bds_push_tokens_local_v229";
  const CHANNEL_NAME = "bds_porton_live_v229";
  const BUHO_ICON = "/buho-oficial.png?v=229";
  let bc = null, realtimeTimer = null;

  function getConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(CFG_KEY) || "{}");
      const url = String(saved.url || window.__BDS_SUPABASE_URL || "").trim().replace(/\/+$/, "");
      const anonKey = String(saved.anonKey || window.__BDS_SUPABASE_ANON_KEY || "").trim();
      return { url, anonKey, configured: Boolean(url.startsWith("https://") && anonKey.length > 20) };
    } catch { return { url: "", anonKey: "", configured: false }; }
  }
  function saveConfig(url, anonKey) {
    localStorage.setItem(CFG_KEY, JSON.stringify({ url: String(url || "").trim().replace(/\/+$/, ""), anonKey: String(anonKey || "").trim() }));
    return getConfig();
  }
  function loadQueue() { try { const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); return Array.isArray(q) ? q : []; } catch { return []; } }
  function saveQueue(q) { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(0, 300))); }
  function loadTokens() { try { const t = JSON.parse(localStorage.getItem(TOKENS_KEY) || "[]"); return Array.isArray(t) ? t : []; } catch { return []; } }

  function sonarTimbreSuave() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  async function mostrarAlertaEnDispositivo(reg) {
    if (!reg) return;
    const esEntrada = String(reg.tipo || "ENTRADA").toUpperCase() === "ENTRADA";
    const titulo = esEntrada ? `✅ Ingreso al colegio — ${reg.estudiante}` : `🚪 Salida del colegio — ${reg.estudiante}`;
    const cuerpo = `${reg.estudiante} (${reg.seccion || "Sección"}) registró su ${esEntrada ? "entrada" : "salida"} a las ${reg.hora}. Sello SHA-256: ${reg.hash || reg.hash_sha256 || "OK"}.`;
    sonarTimbreSuave();
    try {
      const capLocal = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
      if (capLocal && typeof capLocal.schedule === "function") {
        await capLocal.schedule({ notifications: [{ id: Math.floor(Date.now() % 2147483640), title: titulo, body: cuerpo, schedule: { at: new Date(Date.now() + 250) } }] });
      }
    } catch {}
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          const swReg = await navigator.serviceWorker.ready;
          if (swReg && typeof swReg.showNotification === "function") await swReg.showNotification(titulo, { body: cuerpo, icon: BUHO_ICON, badge: BUHO_ICON, vibrate: [180, 90, 180], tag: `porton-${reg.id || Date.now()}`, data: { url: "/" } });
        } else new Notification(titulo, { body: cuerpo, icon: BUHO_ICON });
      }
    } catch {}
    try { if (window.BDS_NATIVE && typeof window.BDS_NATIVE.showInAppToast === "function") window.BDS_NATIVE.showInAppToast(titulo, cuerpo); } catch {}
  }

  async function registrarTokenDispositivo(encargadoEmail, plataforma, tokenPush) {
    const email = String(encargadoEmail || "").trim().toLowerCase();
    const plat = ["android", "ios", "web"].includes(plataforma) ? plataforma : "web";
    const tok = String(tokenPush || "").trim();
    if (!email || !tok) return { ok: false, msg: "Falta correo o token del dispositivo." };
    const list = loadTokens().filter(x => !(x.encargado_email === email && x.token_push === tok));
    const entry = { encargado_email: email, plataforma: plat, token_push: tok, actualizado_en: new Date().toISOString() };
    list.unshift(entry); localStorage.setItem(TOKENS_KEY, JSON.stringify(list.slice(0, 50)));
    const cfg = getConfig();
    if (cfg.configured && typeof fetch === "function") {
      try { await fetch(`${cfg.url}/rest/v1/bds_push_tokens`, { method: "POST", headers: { "Content-Type": "application/json", apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}`, Prefer: "resolution=merge-duplicates" }, body: JSON.stringify(entry) }); } catch {}
    }
    return { ok: true, entry };
  }

  async function activarNotificacionesEnTelefono(encargadoEmail) {
    const email = String(encargadoEmail || "").trim().toLowerCase() || "usuario@familia.com";
    try {
      const capPush = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications;
      if (capPush) {
        const perm = await capPush.requestPermissions();
        if (perm && perm.receive === "granted") {
          await capPush.register();
          capPush.addListener("registration", (t) => { if (t && t.value) registrarTokenDispositivo(email, (window.Capacitor.getPlatform && window.Capacitor.getPlatform()) || "android", t.value); });
          return { ok: true, canal: "Capacitor Nativo (FCM/APNs)", msg: "✅ Push nativo activado en este teléfono." };
        }
      }
    } catch {}
    if (typeof Notification !== "undefined" && typeof Notification.requestPermission === "function") {
      const p = await Notification.requestPermission();
      if (p === "granted") { await registrarTokenDispositivo(email, "web", `web-pwa-${Date.now().toString(36)}`); return { ok: true, canal: "Web Push / PWA", msg: "✅ Notificaciones PWA activadas en este dispositivo." }; }
      return { ok: false, canal: "Bloqueado", msg: "⚠️ Permiso de notificaciones denegado en el navegador." };
    }
    return { ok: true, canal: "In-App Realtime", msg: "✅ Canal en vivo activado." };
  }

  async function sincronizarColaConSupabase() {
    const cfg = getConfig(); const queue = loadQueue();
    if (!cfg.configured || !queue.length || typeof fetch !== "function") return { synced: 0, pending: queue.length, mode: cfg.configured ? "online-idle" : "offline-first" };
    const remaining = []; let synced = 0;
    for (const item of queue) {
      try {
        const res = await fetch(`${cfg.url}/rest/v1/bds_asistencia_porton`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}`, Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({ id: item.id, fecha: item.fecha, hora: item.hora, tipo: item.tipo, estudiante: item.estudiante, carnet: item.carnet || "QR", seccion: item.seccion || "General", encargado_email: item.encargadoEmail || "sin-vinculo@institucion.com", oficial: item.oficial || "Vigilancia / Auxiliar", hash_sha256: item.hash || "SHA256" })
        });
        if (res && (res.ok || res.status === 409)) synced++; else remaining.push(item);
      } catch { remaining.push(item); }
    }
    saveQueue(remaining);
    return { synced, pending: remaining.length, mode: "supabase-sync" };
  }

  async function publicarEventoPorton(reg) {
    if (!reg) return { ok: false };
    const q = loadQueue();
    if (!q.some(x => x.id === reg.id)) { q.unshift(reg); saveQueue(q); }
    try { if (typeof BroadcastChannel !== "undefined") { if (!bc) bc = new BroadcastChannel(CHANNEL_NAME); bc.postMessage({ type: "PORTON_EVENT", registro: reg }); } } catch {}
    mostrarAlertaEnDispositivo(reg);
    const syncRes = await sincronizarColaConSupabase();
    return { ok: true, sync: syncRes };
  }

  function iniciarEscuchaRealtime(encargadoEmail) {
    try { if (typeof BroadcastChannel !== "undefined") { if (!bc) bc = new BroadcastChannel(CHANNEL_NAME); bc.onmessage = (ev) => { if (ev && ev.data && ev.data.type === "PORTON_EVENT" && ev.data.registro) mostrarAlertaEnDispositivo(ev.data.registro); }; } } catch {}
    try {
      if (window.supabase && typeof window.supabase.channel === "function" && encargadoEmail) {
        window.supabase.channel("bds-porton-realtime-v229").on("postgres_changes", { event: "INSERT", schema: "public", table: "bds_asistencia_porton" }, (payload) => {
          const row = payload && payload.new;
          if (row && String(row.encargado_email || "").toLowerCase() === String(encargadoEmail).toLowerCase()) mostrarAlertaEnDispositivo(row);
        }).subscribe();
      }
    } catch {}
    if (realtimeTimer) clearInterval(realtimeTimer);
    realtimeTimer = setInterval(() => { if (typeof navigator !== "undefined" && navigator.onLine !== false) sincronizarColaConSupabase(); }, 30000);
  }

  function hookPortonV228() {
    const api = window.BDS_ASISTENCIA_PORTON_V228;
    if (!api || typeof api.registrarMarcaPorton !== "function" || api.__hookedRealtimeV229) return;
    api.__hookedRealtimeV229 = true;
    const origRegistrar = api.registrarMarcaPorton;
    api.registrarMarcaPorton = async function () {
      const res = await origRegistrar.apply(this, arguments);
      if (res && res.ok && res.registro) await publicarEventoPorton(res.registro);
      return res;
    };
  }

  function injectRealtimeBanner() {
    if (typeof document === "undefined" || !document.body) return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-rt-push-box-v229")) return;
    if (!/asistencia de portón|vinculación familiar/i.test(shell.innerText || "")) return;
    const firstCard = shell.querySelector(".bds-card");
    if (!firstCard) return;
    let sesion = null;
    try { sesion = JSON.parse(sessionStorage.getItem("bds_session_v184_ctpmn_c02") || localStorage.getItem("bds_session_v184_ctpmn_c02") || "null"); } catch {}
    const esAdmin = sesion && ["SuperAdmin", "Admin", "Director(a)"].includes(sesion.rol);
    const cfg = getConfig(); const pending = loadQueue().length;
    const box = document.createElement("div");
    box.id = "bds-rt-push-box-v229";
    box.style.cssText = "background:#070d19;border:1px solid #0ea5e9;border-radius:10px;padding:10px 12px;margin-bottom:11px;font-size:11.5px;";
    box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;"><div><b style="color:#38bdf8;">📡 Canal en Vivo Supabase Realtime + Push Nativo (Android/iOS/PWA)</b><div id="bds-rt-st-v229" style="color:#94a3b8;font-size:11px;margin-top:2px;">Estado: ${cfg.configured ? "🟢 Supabase Conectado" : "🟡 Modo Offline-First Local"} • Pendientes en cola: ${pending}</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;"><button type="button" id="bds-btn-push-on-v229" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">🔔 Activar Alertas en este Teléfono</button>${esAdmin ? `<button type="button" id="bds-btn-rt-cfg-v229" style="background:#1e3a8a;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">⚙️ Configurar Supabase</button>` : ""}</div></div>${esAdmin ? `<div id="bds-rt-cfg-panel-v229" style="display:none;margin-top:9px;padding-top:9px;border-top:1px solid #1e293b;gap:6px;grid-template-columns:1fr 1fr auto;"><input id="bds-sb-url-v229" type="url" value="${cfg.url}" placeholder="https://tu-proyecto.supabase.co" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/><input id="bds-sb-key-v229" type="password" value="${cfg.anonKey}" placeholder="Supabase Anon Public Key" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/><button type="button" id="bds-sb-save-v229" style="background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">Guardar & Sincronizar</button></div>` : ""}`;
    firstCard.insertBefore(box, firstCard.children[1] || null);
    document.getElementById("bds-btn-push-on-v229").onclick = async () => { const r = await activarNotificacionesEnTelefono(sesion ? sesion.email : "usuario@familia.com"); const st = document.getElementById("bds-rt-st-v229"); if (st) st.innerText = r.msg; };
    if (esAdmin) {
      const btnCfg = document.getElementById("bds-btn-rt-cfg-v229"), pnl = document.getElementById("bds-rt-cfg-panel-v229");
      if (btnCfg && pnl) btnCfg.onclick = () => { pnl.style.display = pnl.style.display === "none" ? "grid" : "none"; };
      const btnSave = document.getElementById("bds-sb-save-v229");
      if (btnSave) btnSave.onclick = async () => { saveConfig(document.getElementById("bds-sb-url-v229").value, document.getElementById("bds-sb-key-v229").value); const s = await sincronizarColaConSupabase(); const st = document.getElementById("bds-rt-st-v229"); if (st) st.innerText = `🟢 Configuración guardada. Sincronizados: ${s.synced} • Pendientes: ${s.pending}`; };
    }
  }

  window.BDS_REALTIME_PUSH_V229 = { getConfig, saveConfig, loadQueue, loadTokens, registrarTokenDispositivo, activarNotificacionesEnTelefono, publicarEventoPorton, sincronizarColaConSupabase, iniciarEscuchaRealtime, mostrarAlertaEnDispositivo, hookPortonV228 };
  hookPortonV228();
  if (typeof window.addEventListener === "function") {
    window.addEventListener("online", () => sincronizarColaConSupabase());
    window.addEventListener("DOMContentLoaded", () => {
      hookPortonV228(); iniciarEscuchaRealtime(); injectRealtimeBanner();
      if (typeof MutationObserver !== "undefined" && document.body) new MutationObserver(() => { hookPortonV228(); injectRealtimeBanner(); }).observe(document.body, { childList: true, subtree: true });
    });
  }
})();