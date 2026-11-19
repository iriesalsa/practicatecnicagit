(function () {
  const INST_KEY = "bds_instituciones_crud_v191";
  const ACT_KEY = "bds_institucion_activa_v191";

  function loadInsts() {
    try { const d = JSON.parse(localStorage.getItem(INST_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      {
        id: "INST-001",
        nombre: "Colegio Técnico Profesional Mercedes Norte",
        corto: "CTP Mercedes Norte",
        tipo: "CTP (Técnico)",
        regional: "Dirección Regional de Heredia",
        circuito: "Circuito 02",
        escudo: "/escudo-ctpmn-oficial.jpeg?v=191",
        estado: "Activo",
        plan: "Institucional ₡19,100/año",
        vence: "2027-12-31",
        estudiantes: 850,
        contacto: "direccion.ctpmn@mep.go.cr"
      },
      {
        id: "INST-002",
        nombre: "Liceo Académico de Heredia (Demo)",
        corto: "Liceo de Heredia",
        tipo: "Colegio Académico",
        regional: "Dirección Regional de Heredia",
        circuito: "Circuito 01",
        escudo: "/escudo-ctpmn-oficial.jpeg?v=191",
        estado: "Beta 13 días",
        plan: "Beta Gratis 13 días → ₡19,100/año",
        vence: new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10),
        estudiantes: 420,
        contacto: "direccion.liceo@mep.go.cr"
      }
    ];
    localStorage.setItem(INST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveInsts(a) { localStorage.setItem(INST_KEY, JSON.stringify(a)); }

  function aplicarInstitucionActiva(inst) {
    if (!inst) return;
    localStorage.setItem(ACT_KEY, inst.id);
    if (window.BDS_BRAND) {
      const cur = window.BDS_BRAND.get();
      window.BDS_BRAND.save({
        ...cur,
        institucion: inst.nombre,
        institucionCorta: inst.corto || inst.nombre.slice(0, 22),
        regional: inst.regional,
        circuito: inst.circuito,
        escudo: inst.escudo || cur.escudo
      });
    }
  }

  window.BDS_RENDER_INSTITUCIONES_CRUD = function (shell, ctx) {
    const { sesion } = ctx;
    if (sesion.rol !== "SuperAdmin") {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso exclusivo SuperAdmin</h3><p style="font-size:13px;color:#94a3b8;">La gestión multi-institución (CRUD) está reservada para administración general.</p></div>`;
      return;
    }

    let editId = null;
    let draftEscudo = "/escudo-ctpmn-oficial.jpeg?v=191";
    let busca = "";

    function draw() {
      const list = loadInsts();
      const actId = localStorage.getItem(ACT_KEY) || (list[0] && list[0].id);
      const editObj = editId ? list.find(x => x.id === editId) : null;
      const filtradas = list.filter(x => !busca || x.nombre.toLowerCase().includes(busca.toLowerCase()) || x.tipo.toLowerCase().includes(busca.toLowerCase()));

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">SUPERADMIN CRUD • BETA 13 DÍAS → ₡19,100/AÑO POR INSTITUCIÓN</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🏛️ Gestión Multi-Institución, Escudos Propios y Licencias</h2>
            </div>
            <input id="ic-q" type="text" value="${busca}" placeholder="Buscar escuela, colegio o CTP..." style="background:#070d19;border:1px solid #334155;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;min-width:220px;"/>
          </div>

          <form id="ic-f" style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:10px;margin-bottom:14px;">
            <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;">
              <b style="color:#38bdf8;font-size:14px;">${editObj ? `✏️ Editando: ${editObj.nombre}` : "➕ Crear Nueva Institución Educativa"}</b>
              ${editObj ? `<button type="button" id="ic-cancel" style="background:#334155;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer;">Cancelar edición</button>` : ""}
            </div>
            <input id="ic-nom" type="text" required value="${editObj ? editObj.nombre : ""}" placeholder="Nombre oficial (ej. Escuela Central de Heredia)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            <input id="ic-cor" type="text" required value="${editObj ? editObj.corto : ""}" placeholder="Nombre corto barra superior" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            <select id="ic-tip" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;">
              ${["CTP (Técnico)","Colegio Académico","Escuela Primaria","Liceo Rural / CINDEA / IPEC","Institución Privada"].map(t => `<option ${editObj && editObj.tipo===t?"selected":""}>${t}</option>`).join("")}
            </select>
            <input id="ic-reg" type="text" required value="${editObj ? editObj.regional : "Dirección Regional de Heredia"}" placeholder="Dirección Regional" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            <input id="ic-cir" type="text" required value="${editObj ? editObj.circuito : "Circuito 02"}" placeholder="Circuito Escolar" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            <input id="ic-con" type="email" required value="${editObj ? editObj.contacto : ""}" placeholder="Correo oficial dirección@mep.go.cr" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${editObj ? editObj.escudo : draftEscudo}" alt="Escudo" style="height:40px;width:36px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
              <label style="background:#0f766e;color:#fff;padding:8px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">
                📤 Escudo Propio
                <input id="ic-esc" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="display:none;"/>
              </label>
            </div>
            <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-weight:800;cursor:pointer;">${editObj ? "💾 Guardar Cambios" : "✅ Crear Institución (13d Beta)"}</button>
          </form>

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:820px;border-collapse:collapse;font-size:12px;">
              <tr style="background:#131f33;color:#38bdf8;">
                <th style="padding:8px;text-align:left;">Institución / Escudo</th>
                <th style="padding:8px;text-align:left;">Modalidad / Circuito</th>
                <th style="padding:8px;text-align:center;">Estado</th>
                <th style="padding:8px;text-align:left;">Plan / Vigencia</th>
                <th style="padding:8px;text-align:center;">Acciones CRUD</th>
              </tr>
              ${filtradas.map(inst => {
                const bCol = inst.estado === "Activo" ? "#059669" : (inst.estado.includes("Cortesía") ? "#0284c7" : (inst.estado.includes("Beta") ? "#7c3aed" : (inst.estado === "Desactivado" ? "#b45309" : "#dc2626")));
                const isAct = inst.id === actId;
                return `<tr>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <img src="${inst.escudo}" style="height:36px;width:32px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
                      <div><b>${inst.nombre}</b> ${isAct ? `<span style="background:#1d4ed8;color:#fff;font-size:9.5px;padding:2px 6px;border-radius:4px;">EN USO</span>` : ""}<br/><span style="font-size:10.5px;color:#94a3b8;">${inst.id} • ${inst.contacto}</span></div>
                    </div>
                  </td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${inst.tipo}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${inst.regional} • ${inst.circuito}</span></td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${bCol};color:#fff;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:800;">${inst.estado}</span></td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;"><b>${inst.plan}</b><br/><span style="font-size:10.5px;color:#94a3b8;">Vence: ${inst.vence}</span></td>
                  <td style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;">
                    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                      <button data-a="usar" data-id="${inst.id}" class="ic-btn" style="background:#1d4ed8;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🎯 Usar</button>
                      <button data-a="editar" data-id="${inst.id}" class="ic-btn" style="background:#334155;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✏️ Editar</button>
                      <button data-a="cortesia" data-id="${inst.id}" class="ic-btn" style="background:#0284c7;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🎁 Cortesía</button>
                      <button data-a="activar" data-id="${inst.id}" class="ic-btn" style="background:#059669;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✅ Activar</button>
                      <button data-a="desactivar" data-id="${inst.id}" class="ic-btn" style="background:#b45309;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">⏸️ Pausar</button>
                      <button data-a="${inst.estado==='Bloqueado'?'desbloquear':'bloquear'}" data-id="${inst.id}" class="ic-btn" style="background:${inst.estado==='Bloqueado'?'#4f46e5':'#dc2626'};color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">${inst.estado==='Bloqueado'?'🔓 Desbloq.':'🚫 Bloquear'}</button>
                      ${inst.id !== "INST-001" ? `<button data-a="eliminar" data-id="${inst.id}" class="ic-btn" style="background:#7f1d1d;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">🗑️</button>` : ""}
                    </div>
                  </td>
                </tr>`;
              }).join("")}
            </table>
          </div>
        </div>
      `;

      document.getElementById("ic-q").oninput = (e) => { busca = e.target.value; draw(); document.getElementById("ic-q").focus(); };
      if (document.getElementById("ic-cancel")) document.getElementById("ic-cancel").onclick = () => { editId = null; draw(); };
      document.getElementById("ic-esc").onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => {
          draftEscudo = ev.target.result;
          if (editObj) { editObj.escudo = draftEscudo; saveInsts(list); }
          draw();
        };
        r.readAsDataURL(f);
      };
      document.getElementById("ic-f").onsubmit = (e) => {
        e.preventDefault();
        const arr = loadInsts();
        const payload = {
          nombre: document.getElementById("ic-nom").value.trim(),
          corto: document.getElementById("ic-cor").value.trim(),
          tipo: document.getElementById("ic-tip").value,
          regional: document.getElementById("ic-reg").value.trim(),
          circuito: document.getElementById("ic-cir").value.trim(),
          contacto: document.getElementById("ic-con").value.trim().toLowerCase()
        };
        if (editId) {
          const idx = arr.findIndex(x => x.id === editId);
          if (idx >= 0) arr[idx] = { ...arr[idx], ...payload, escudo: draftEscudo || arr[idx].escudo };
          editId = null;
        } else {
          arr.unshift({
            id: "INST-" + String(Date.now()).slice(-4),
            ...payload,
            escudo: draftEscudo,
            estado: "Beta 13 días",
            plan: "Beta Gratis 13 días → ₡19,100/año",
            vence: new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10),
            estudiantes: 0
          });
        }
        saveInsts(arr);
        draw();
      };

      shell.querySelectorAll(".ic-btn").forEach(b => b.onclick = () => {
        const arr = loadInsts();
        const id = b.getAttribute("data-id");
        const act = b.getAttribute("data-a");
        const inst = arr.find(x => x.id === id);
        if (!inst) return;
        if (act === "usar") { aplicarInstitucionActiva(inst); location.reload(); return; }
        if (act === "editar") { editId = id; draftEscudo = inst.escudo; draw(); return; }
        if (act === "cortesia") {
          const d = prompt("Días de cortesía para esta institución (ej. 90, 365 o VITALICIA):", "365");
          if (!d) return;
          inst.estado = "Cortesía";
          inst.plan = d.toUpperCase().includes("VIT") ? "Cortesía Vitalicia" : `Cortesía ${parseInt(d,10)||90} días`;
          inst.vence = d.toUpperCase().includes("VIT") ? "Permanente" : new Date(Date.now() + (parseInt(d,10)||90) * 86400000).toISOString().slice(0, 10);
        } else if (act === "activar" || act === "desbloquear") {
          inst.estado = "Activo";
          inst.plan = "Institucional ₡19,100/año";
          inst.vence = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
        } else if (act === "desactivar") {
          inst.estado = "Desactivado";
        } else if (act === "bloquear") {
          inst.estado = "Bloqueado";
        } else if (act === "eliminar") {
          if (!confirm(`¿Eliminar definitivamente "${inst.nombre}"?`)) return;
          saveInsts(arr.filter(x => x.id !== id)); draw(); return;
        }
        saveInsts(arr); draw();
      });
    }
    draw();
  };
})();