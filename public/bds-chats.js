(function () {
  const CHAT_KEY = "bds_chats_v184_c02";
  const GROSERIAS = ["tonto","idiota","estupido","imbecil","malparido","mierda","puta","cabron","carajo","basura","pendejo","hijueputa","carepicha","playo","zorra"];

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function filtrarTexto(txt) {
    return GROSERIAS.reduce((acc, w) => acc.replace(new RegExp(`\\b${w}\\b`, "gi"), "****"), String(txt || ""));
  }

  // Convierte automáticamente URLs (https://, http://, www.) en enlaces clickeables seguros
  function linkifySafe(raw) {
    const clean = escapeHtml(filtrarTexto(raw));
    return clean.replace(/(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi, (m) => {
      const href = m.toLowerCase().startsWith("http") ? m : "https://" + m;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline;word-break:break-all;">${m} ↗</a>`;
    });
  }

  window.BDS_TOGGLE_CHATS_PRO = function (sesionActiva) {
    if (!sesionActiva || sesionActiva.visitante || sesionActiva.rol === "Particular (MOPT / Admisión)") return;
    const old = document.getElementById("bds-chat-modal");
    if (old) { old.remove(); return; }

    const s = sesionActiva, baseSec = s.seccion || "11-1";
    const defCanales = [
      { id: `c_${baseSec}_A`, nom: `Sección ${baseSec} • A`, msgs: [{ r: "Coordinación", h: "07:30", t: `Canal oficial Subgrupo A — Sección ${baseSec}. Enlace oficial: https://www.practicatecnica.com` }] },
      { id: `c_${baseSec}_B`, nom: `Sección ${baseSec} • B`, msgs: [{ r: "Coordinación", h: "07:35", t: `Canal oficial Subgrupo B — Sección ${baseSec}.` }] },
      { id: "c_doc", nom: "👨‍🏫 Docentes & Teams", msgs: [{ r: "Dirección", h: "07:15", t: "Coordinación docente institucional y enlaces de Microsoft Teams." }] },
      { id: "c_dir", nom: "🏛️ Dirección", msgs: [{ r: "Directora Laura Ramón Elizondo", h: "07:00", t: "Avisos oficiales y circulares institucionales." }] }
    ];

    const getChans = () => {
      try { const g = JSON.parse(localStorage.getItem(CHAT_KEY)); if (Array.isArray(g) && g.length) return g; } catch {}
      localStorage.setItem(CHAT_KEY, JSON.stringify(defCanales));
      return defCanales;
    };
    const saveChans = (a) => localStorage.setItem(CHAT_KEY, JSON.stringify(a));

    const esPersonal = ["SuperAdmin", "Director(a)", "Docente MEP", "Auxiliar Administrativo"].includes(s.rol);
    let chans = getChans();
    // Filtrar canal exclusivo de Docentes si el usuario es Estudiante o Padre
    const visibleChans = () => getChans().filter(c => c.id !== "c_doc" || esPersonal);
    let actId = (visibleChans()[0] || chans[0]).id;
    let busca = "";

    const modal = document.createElement("div");
    modal.id = "bds-chat-modal";
    modal.style.cssText = "position:fixed;top:56px;right:10px;bottom:68px;z-index:299100;width:min(460px,calc(100vw - 20px));background:#0b141a;border:1.5px solid #00a884;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.9);display:flex;flex-direction:column;";

    function draw() {
      const listVis = visibleChans();
      chans = getChans();
      const cur = listVis.find(x => x.id === actId) || listVis[0];
      actId = cur.id;
      const puedeBorrar = ["SuperAdmin", "Director(a)", "Docente MEP"].includes(s.rol);
      const msgs = (cur.msgs || []).filter(m => !busca || (m.t || "").toLowerCase().includes(busca.toLowerCase()) || (m.r || "").toLowerCase().includes(busca.toLowerCase()));

      modal.innerHTML = `
        <div style="background:#202c33;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:6px;border-bottom:1px solid #2a3942;">
          <div style="min-width:0;">
            <div style="font-size:13px;font-weight:700;color:#e9edef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">💬 ${escapeHtml(cur.nom)}</div>
            <div style="font-size:10px;color:#8696a0;">${escapeHtml(s.nombre)} • ${escapeHtml(s.rol)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="ch-shr" title="Compartir enlace de la plataforma" style="background:#1e3a8a;color:#93c5fd;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🔗</button>
            <button id="ch-new" style="background:#00a884;color:#052e16;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">+ Canal</button>
            ${puedeBorrar ? `<button id="ch-del" title="Eliminar canal" style="background:#7f1d1d;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🗑️</button>` : ""}
            <button id="ch-cls" style="background:#334155;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:12px;font-weight:800;cursor:pointer;">✕</button>
          </div>
        </div>

        <div style="display:flex;gap:5px;padding:7px;background:#111b21;border-bottom:1px solid #222d34;overflow-x:auto;scrollbar-width:none;">
          ${listVis.map(c => `<button data-cid="${c.id}" class="ch-tab" style="background:${c.id===actId?'#005c4b':'#202c33'};color:#e9edef;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">${escapeHtml(c.nom)}</button>`).join("")}
        </div>

        <div style="padding:6px 10px;background:#111b21;border-bottom:1px solid #1e293b;">
          <input id="ch-q" type="text" value="${escapeHtml(busca)}" placeholder="🔍 Buscar mensajes o enlaces..." style="width:100%;background:#202c33;border:none;color:#e9edef;padding:6px 10px;border-radius:7px;font-size:11.5px;outline:none;"/>
        </div>

        <div id="ch-list" style="flex:1;padding:12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
          ${msgs.map(m => {
            const mine = (m.r || "").startsWith(s.nombre);
            return `<div style="align-self:${mine?'flex-end':'flex-start'};max-width:86%;background:${mine?'#005c4b':'#202c33'};color:#e9edef;padding:8px 11px;border-radius:10px;font-size:12.5px;">
              <div style="font-size:9.5px;color:#38bdf8;font-weight:700;margin-bottom:2px;">${escapeHtml(m.r)}</div>
              ${m.img ? `<a href="${m.img}" target="_blank" rel="noopener"><img src="${m.img}" style="max-width:100%;border-radius:6px;margin-bottom:5px;display:block;"/></a>` : ""}
              ${m.file && m.data ? `<a href="${m.data}" download="${escapeHtml(m.file)}" style="display:inline-block;background:#0f172a;color:#34d399;padding:5px 9px;border-radius:6px;font-size:11px;text-decoration:none;margin-bottom:4px;">📎 Descargar ${escapeHtml(m.file)}</a>` : (m.file ? `<div style="font-size:11px;color:#fbbf24;margin-bottom:4px;">📎 ${escapeHtml(m.file)}</div>` : "")}
              <div style="line-height:1.4;">${linkifySafe(m.t)}</div>
              <div style="font-size:9px;color:#94a3b8;text-align:right;margin-top:3px;">${escapeHtml(m.h)} ✓✓</div>
            </div>`;
          }).join("") || `<div style="text-align:center;color:#64748b;font-size:12px;padding:16px;">No hay mensajes que coincidan.</div>`}
        </div>

        <form id="ch-f" style="padding:9px;background:#202c33;display:flex;gap:6px;align-items:center;">
          <label title="Adjuntar imagen o PDF" style="cursor:pointer;background:#2a3942;color:#00a884;padding:8px 10px;border-radius:7px;font-size:14px;">📎<input id="ch-file" type="file" accept="image/*,.pdf,.docx,.xlsx,.csv" style="display:none;"/></label>
          <input id="ch-in" type="text" placeholder="Escribe un mensaje o pega un enlace..." required style="flex:1;background:#2a3942;border:none;color:#e9edef;padding:9px 10px;border-radius:7px;font-size:12.5px;outline:none;"/>
          <button type="submit" style="background:#00a884;color:#052e16;border:none;padding:9px 13px;border-radius:7px;font-weight:800;font-size:12px;cursor:pointer;">Enviar</button>
        </form>
      `;

      const listEl = document.getElementById("ch-list"); if (listEl) listEl.scrollTop = listEl.scrollHeight;
      document.getElementById("ch-cls").onclick = () => modal.remove();
      document.getElementById("ch-shr").onclick = () => {
        if (window.BDS_NATIVE) window.BDS_NATIVE.share("pracTICAtecnica.com", `Únete al canal ${cur.nom} en pracTICAtecnica.com`, "https://www.practicatecnica.com");
      };
      document.getElementById("ch-q").oninput = (e) => { busca = e.target.value; draw(); document.getElementById("ch-q").focus(); };
      modal.querySelectorAll(".ch-tab").forEach(b => b.onclick = () => { actId = b.getAttribute("data-cid"); draw(); });
      document.getElementById("ch-new").onclick = () => {
        const nom = prompt("Nombre del nuevo canal:");
        if (nom && nom.trim()) {
          const nc = { id: "c_" + Date.now(), nom: nom.trim(), msgs: [{ r: "Sistema", h: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), t: `Canal "${nom.trim()}" creado por ${s.nombre}.` }] };
          chans.push(nc); saveChans(chans); actId = nc.id; draw();
        }
      };
      if (document.getElementById("ch-del")) document.getElementById("ch-del").onclick = () => {
        if (listVis.length <= 1) return alert("Debe quedar al menos un canal.");
        if (confirm(`¿Eliminar "${cur.nom}"?`)) { chans = chans.filter(x => x.id !== cur.id); saveChans(chans); actId = (visibleChans()[0] || chans[0]).id; draw(); }
      };
      document.getElementById("ch-file").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          const target = chans.find(x => x.id === cur.id);
          if (target) {
            target.msgs.push({ r: `${s.nombre} (${s.rol})`, h, t: `Adjuntó ${f.name}`, img: f.type.startsWith("image/") ? ev.target.result : null, file: f.type.startsWith("image/") ? null : f.name, data: f.size <= 700000 ? ev.target.result : "" });
            saveChans(chans); draw();
          }
        };
        r.readAsDataURL(f);
      };
      document.getElementById("ch-f").onsubmit = (e) => {
        e.preventDefault();
        const raw = document.getElementById("ch-in").value.trim(); if (!raw) return;
        const h = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
        const target = chans.find(x => x.id === cur.id);
        if (target) {
          target.msgs.push({ r: `${s.nombre} (${s.rol})`, h, t: raw });
          saveChans(chans);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(`💬 ${cur.nom}`, `${s.nombre}: ${raw.slice(0, 70)}`);
          draw();
        }
      };
    }

    document.body.appendChild(modal);
    draw();
  };

  window.BDS_CHAT_LINKIFY = linkifySafe;
})();