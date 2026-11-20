(function () {
  const CFG_KEY = "bds_supabase_live_cfg_v192";
  const DEFAULT_URL = "https://tmvhjmevhnaghwgpsqok.supabase.co";
  const DEFAULT_KEY = "";

  // Claves institucionales sincronizadas en vivo entre PC, celular y otros navegadores
  const SYNC_KEYS = [
    "bds_brand_custom_v183",
    "bds_instituciones_crud_v191",
    "bds_institucion_activa_v191",
    "bds_users_governance_v184",
    "bds_users_auditlog_v184",
    "bds_comedor_cfg_v186",
    "bds_comedor_wallets_v186",
    "bds_comedor_trx_v186",
    "bds_comedor_logs_v186",
    "bds_comedor_menus_v186",
    "bds_comedor_becas_req_v186",
    "bds_matricula_est_v187",
    "bds_matricula_doc_v187",
    "bds_horarios_ia_v187",
    "bds_planes_inversos_v189",
    "bds_docente_roster_v190",
    "bds_docente_asistencia_log_v190",
    "bds_docente_pesos_rea_v190",
    "bds_agenda_escolar_v191",
    "bds_respaldos_notas_anios_v191",
    "bds_chats_v184_c02", "bds_permisos_edus_v193", "bds_justificaciones_comp_v193", "bds_access_logs_v193", "bds_familia_links_v194", "bds_seguimiento_thor_v196", "bds_coope_cfg_v198", "bds_coope_prods_v198", "bds_coope_wallets_v198", "bds_coope_sales_v198", "bds_coope_recycle_v198", "bds_parental_ctrl_v198", "bds_moderation_logs_v198", "bds_practica_org_v198", "bds_practica_emo_v198", "bds_practica_fin_v198", "bds_motivacion_users_v201", "bds_odin2_matricula_v202", "bds_odin2_conducta_rea_v202", "bds_odin2_docente_guia_v202"
  ];

  function getCfg() {
    try {
      const saved = JSON.parse(localStorage.getItem(CFG_KEY) || "null");
      if (saved && saved.url && saved.key) return saved;
    } catch {}
    return { url: DEFAULT_URL, key: DEFAULT_KEY };
  }

  function saveCfg(url, key) {
    localStorage.setItem(CFG_KEY, JSON.stringify({ url: url.trim().replace(/\/$/, ""), key: key.trim() }));
  }

  function getInstId() {
    return localStorage.getItem("bds_institucion_activa_v191") || "INST-001";
  }

  function setStatus(state, tip) {
    const el = document.getElementById("bds-cloud-pill");
    if (!el) return;
    if (state === "ok") { el.innerText = "🟢 Nube"; el.style.borderColor = "#10b981"; el.style.color = "#6ee7b7"; }
    else if (state === "sync") { el.innerText = "🔄 Sync..."; el.style.borderColor = "#38bdf8"; el.style.color = "#38bdf8"; }
    else if (state === "setup") { el.innerText = "⚙️ Conectar DB"; el.style.borderColor = "#f59e0b"; el.style.color = "#fbbf24"; }
    else { el.innerText = "🟡 Offline"; el.style.borderColor = "#f59e0b"; el.style.color = "#fbbf24"; }
    if (tip) el.title = tip;
  }

  const rawSetItem = Storage.prototype.setItem;
  let pulling = false;
  const timers = {};

  async function pushKey(key, rawValue) {
    const cfg = getCfg();
    if (!cfg.url || !cfg.key) { setStatus("setup", "Haz clic para pegar tu Supabase Anon Key"); return false; }
    if (!navigator.onLine) { setStatus("offline", "Modo Offline-First activo"); return false; }
    setStatus("sync", "Guardando en Supabase...");
    try {
      let parsed = rawValue;
      try { parsed = JSON.parse(rawValue); } catch {}
      const res = await fetch(`${cfg.url}/rest/v1/pt_cloud_sync`, {
        method: "POST",
        headers: {
          "apikey": cfg.key,
          "Authorization": `Bearer ${cfg.key}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          sync_key: key,
          institution_id: getInstId(),
          payload: { value: parsed },
          updated_at: new Date().toISOString()
        })
      });
      if (res.ok) { setStatus("ok", "Sincronizado en vivo con practicatecnica-prod"); return true; }
      setStatus("offline", "Error HTTP " + res.status + " (ejecuta schema_sync_master_v192.sql)");
      return false;
    } catch {
      setStatus("offline", "Sin conexión: guardado localmente");
      return false;
    }
  }

  async function pullAll(reloadIfChanged) {
    const cfg = getCfg();
    if (!cfg.url || !cfg.key) { setStatus("setup", "Haz clic para configurar Supabase Anon Key"); return 0; }
    if (!navigator.onLine) { setStatus("offline", "Modo Offline-First"); return 0; }
    setStatus("sync", "Descargando últimos datos de Supabase...");
    try {
      const res = await fetch(`${cfg.url}/rest/v1/pt_cloud_sync?select=sync_key,payload,updated_at`, {
        headers: { "apikey": cfg.key, "Authorization": `Bearer ${cfg.key}` }
      });
      if (!res.ok) { setStatus("offline", "Tabla pt_cloud_sync pendiente de crear en SQL Editor"); return 0; }
      const rows = await res.json();
      let changed = 0;
      pulling = true;
      (rows || []).forEach(r => {
        if (!SYNC_KEYS.includes(r.sync_key) || !r.payload || r.payload.value === undefined) return;
        const nextStr = typeof r.payload.value === "string" ? r.payload.value : JSON.stringify(r.payload.value);
        if (localStorage.getItem(r.sync_key) !== nextStr) {
          rawSetItem.call(localStorage, r.sync_key, nextStr);
          changed++;
        }
      });
      pulling = false;
      setStatus("ok", `Conectado a Supabase (${rows.length} módulos en nube)`);
      if (reloadIfChanged && changed > 0) location.reload();
      return rows.length;
    } catch {
      pulling = false;
      setStatus("offline", "Sin conexión con Supabase");
      return 0;
    }
  }

  async function pushAllNow() {
    let ok = 0;
    for (const k of SYNC_KEYS) {
      const v = localStorage.getItem(k);
      if (v !== null) {
        const r = await pushKey(k, v);
        if (r) ok++;
      }
    }
    return ok;
  }

  // Interceptar escrituras a claves sincronizadas con debounce de 600ms
  Storage.prototype.setItem = function (key, value) {
    rawSetItem.call(this, key, value);
    if (this === localStorage && !pulling && SYNC_KEYS.includes(key)) {
      clearTimeout(timers[key]);
      timers[key] = setTimeout(() => pushKey(key, value), 600);
    }
  };

  function openSyncModal() {
    const old = document.getElementById("bds-sync-modal"); if (old) { old.remove(); return; }
    const cfg = getCfg();
    const m = document.createElement("div");
    m.id = "bds-sync-modal";
    m.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.88);z-index:297000;display:flex;align-items:center;justify-content:center;padding:16px;";
    m.innerHTML = `
      <div class="bds-card" style="max-width:480px;width:100%;padding:20px;border-color:#10b981;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:16px;color:#fff;">☁️ Conexión en Vivo — Supabase (practicatecnica-prod)</h3>
          <button id="sy-cls" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;">✕</button>
        </div>
        <form id="sy-f" style="display:flex;flex-direction:column;gap:9px;margin-bottom:12px;">
          <label style="font-size:11px;color:#94a3b8;">Project URL:</label>
          <input id="sy-url" type="url" required value="${cfg.url}" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
          <label style="font-size:11px;color:#94a3b8;">Supabase Anon Public Key (Project Settings → API):</label>
          <input id="sy-key" type="password" required value="${cfg.key}" placeholder="eyJhbGciOi..." style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
          <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💾 Guardar y Probar Conexión</button>
        </form>
        <div style="display:flex;gap:8px;">
          <button id="sy-up" style="flex:1;background:#1d4ed8;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⬆️ Subir Todo a Nube</button>
          <button id="sy-dn" style="flex:1;background:#0f766e;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⬇️ Descargar de Nube</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById("sy-cls").onclick = () => m.remove();
    document.getElementById("sy-f").onsubmit = async (e) => {
      e.preventDefault();
      saveCfg(document.getElementById("sy-url").value, document.getElementById("sy-key").value);
      const n = await pullAll(false);
      alert(`✅ Conexión guardada. Módulos leídos desde Supabase: ${n}.`);
      m.remove();
    };
    document.getElementById("sy-up").onclick = async () => {
      const cnt = await pushAllNow();
      alert(`⬆️ Se sincronizaron ${cnt} módulo(s) hacia Supabase.`);
    };
    document.getElementById("sy-dn").onclick = async () => {
      await pullAll(true);
    };
  }

  window.BDS_CLOUD_SYNC = { pullAll, pushAllNow, openSyncModal, setStatus };

  // Inyectar botón de estado en el header automáticamente y hacer pull inicial
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => pullAll(false), 900);
    const obs = new MutationObserver(() => {
      const xp = document.getElementById("bds-xp-pill");
      if (xp && !document.getElementById("bds-cloud-pill")) {
        const btn = document.createElement("button");
        btn.id = "bds-cloud-pill";
        btn.style.cssText = "background:#131f33;border:1px solid #10b981;color:#6ee7b7;padding:5px 9px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;min-height:34px;";
        btn.innerText = getCfg().key ? "🟢 Nube" : "⚙️ Conectar DB";
        btn.onclick = openSyncModal;
        xp.parentElement.insertBefore(btn, xp);
      }
    });
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  });
})();