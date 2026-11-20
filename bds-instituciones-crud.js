(function () {
  const INST_KEY = "bds_instituciones_crud_v191";
  const ACT_KEY = "bds_institucion_activa_v191";
  const PAY_LOG_KEY = "bds_instituciones_pagos_v203";

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
        escudo: "/escudo-ctpmn-oficial.jpeg?v=203",
        estado: "Activo",
        plan: "Institucional ₡19,100/año",
        anualidadCRC: 19100,
        vence: "2027-12-31",
        tieneCoope: true,
        nombreCoope: "Coopeconvivir R.L.",
        tieneComedor: true,
        contacto: "direccion@institucion.com",
        listaEstudiantes: [
          { nombre: "Sofía Alvarado Rojas", cedula: "4-0289-0114", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", pagado: true },
          { nombre: "Esteban Campos Mora", cedula: "4-0295-0442", email: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", pagado: true }
        ]
      }
    ];
    localStorage.setItem(INST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveInsts(a) { localStorage.setItem(INST_KEY, JSON.stringify(a)); }

  function loadPagos() { try { const d = JSON.parse(localStorage.getItem(PAY_LOG_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function savePagos(a) { localStorage.setItem(PAY_LOG_KEY, JSON.stringify(a.slice(0, 200))); }

  function fmtCRC(n) { return "₡" + Number(n || 0).toLocaleString("es-CR"); }

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
    if (window.BDS_COOPE_API) {
      const c = window.BDS_COOPE_API.loadCfg();
      window.BDS_COOPE_API.saveCfg({
        ...c,
        habilitada: inst.tieneCoope !== false,
        nombre: inst.nombreCoope || c.nombre || "Cooperativa Estudiantil"
      });
    }
  }

  function imprimirReciboAnualidad(pago, inst, generarQRSVG) {
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el recibo de anualidad.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Recibo Anualidad ${pago.id}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12.5px;max-width:600px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:14px}td{border:1px solid #cbd5e1;padding:8px}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${inst.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">pracTICAtecnica.com — BDS Devs</h2><div>COMPROBANTE DE LICENCIA INSTITUCIONAL ${pago.id}</div></div><img src="/buho-oficial.png?v=203" style="height:46px;border-radius:50%"/></div><table><tr><td style="width:34%;background:#f8fafc"><b>Institución</b></td><td>${inst.nombre} (${inst.tipo})</td></tr><tr><td style="background:#f8fafc"><b>Concepto</b></td><td>${pago.concepto}</td></tr><tr><td style="background:#f8fafc"><b>Referencia SINPE</b></td><td>${pago.refSinpe}</td></tr><tr><td style="background:#f8fafc"><b>Monto Pagado</b></td><td><b>${fmtCRC(pago.montoCRC)}</b></td></tr><tr><td style="background:#f8fafc"><b>Vigencia</b></td><td>Hasta ${pago.vence} (Fecha pago: ${pago.fecha})</td></tr></table><div class="qr">${generarQRSVG ? generarQRSVG("PT-LIC|" + pago.hash, 86) : ""}<div><b>Licencia Verificable QR SHA-256</b><br/><code>${pago.hash}</code><br/><small>Emitido por Ing. Max Salazar Sánchez • WhatsApp +506 6090-6359 • pracTICAtecnica.com.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_INST_API = { loadInsts, saveInsts, loadPagos, aplicarInstitucionActiva };

  window.BDS_RENDER_INSTITUCIONES_CRUD = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    if (!sesion || (sesion.rol !== "SuperAdmin" && sesion.rolReal !== "SuperAdmin")) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso exclusivo SuperAdmin</h3><p style="font-size:12.5px;color:#94a3b8;">Solo administración general gestiona instituciones y anualidades.</p></div>`;
      return;
    }

    let editId = null;
    let estModalInstId = null;
    let draftEscudo = "/escudo-ctpmn-oficial.jpeg?v=203";
    let busca = "";

    function draw() {
      const list = loadInsts();
      const pagos = loadPagos();
      const actId = localStorage.getItem(ACT_KEY) || (list[0] && list[0].id);
      const editObj = editId ? list.find(x => x.id === editId) : null;
      const filtradas = list.filter(x => !busca || (x.nombre || "").toLowerCase().includes(busca.toLowerCase()) || (x.tipo || "").toLowerCase().includes(busca.toLowerCase()));

      const totalEst = list.reduce((a, i) => a + (Array.isArray(i.listaEstudiantes) ? i.listaEstudiantes.length : Number(i.estudiantes || 0)), 0);
      const totalRecaudado = pagos.reduce((a, p) => a + Number(p.montoCRC || 0), 0);
      const estInst = estModalInstId ? list.find(x => x.id === estModalInstId) : null;

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">MULTI-INSTITUCIÓN COMERCIAL • ANUALIDAD ₡19,100 + ₡1,000/ESTUDIANTE</span>
              <h2 style="margin:5px 0 0;font-size:17.5px;color:#fff;">🏛️ Instituciones, Escudos Propios, Anualidades y Padrón Estudiantil</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <input id="ic-q" type="text" value="${busca}" placeholder="Buscar institución..." style="background:#070d19;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:7px;font-size:12px;min-width:180px;"/>
              <button id="ic-csv" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV Financiero</button>
            </div>
          </div>

          <!-- KPIs comerciales SuperAdmin -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:13px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:10px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Instituciones</div><div style="font-size:21px;font-weight:900;color:#38bdf8;">${list.length}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:10px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Activas / Cortesía</div><div style="font-size:21px;font-weight:900;color:#34d399;">${list.filter(x => x.estado==="Activo"||x.estado==="Cortesía").length}</div></div>
            <div style="background:#070d19;border:1px solid #fbbf24;border-radius:9px;padding:10px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Estudiantes Padrón</div><div style="font-size:21px;font-weight:900;color:#fbbf24;">${totalEst}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:10px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Pagos Registrados</div><div style="font-size:18px;font-weight:900;color:#c084fc;margin-top:3px;">${fmtCRC(totalRecaudado)}</div></div>
          </div>

          <form id="ic-f" style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:13px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,195px),1fr));gap:8px;margin-bottom:13px;">
            <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;">
              <b style="color:#38bdf8;font-size:13.5px;">${editObj ? `✏️ Editando: ${editObj.nombre}` : "➕ Crear Nueva Institución (Escuelas, Colegios, CTP, Nocturnos, IPEC)"}</b>
              ${editObj ? `<button type="button" id="ic-cancel" style="background:#334155;color:#fff;border:none;padding:4px 9px;border-radius:6px;font-size:11px;cursor:pointer;">Cancelar</button>` : ""}
            </div>
            <input id="ic-nom" type="text" required value="${editObj ? editObj.nombre : ""}" placeholder="Nombre oficial del centro educativo" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-cor" type="text" required value="${editObj ? editObj.corto : ""}" placeholder="Nombre corto (barra superior)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <select id="ic-tip" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
              ${["CTP (Técnico)","Colegio Académico","Escuela Primaria","Colegio Nocturno","CINDEA / IPEC","Institución Privada"].map(t => `<option ${editObj && editObj.tipo===t?"selected":""}>${t}</option>`).join("")}
            </select>
            <input id="ic-reg" type="text" required value="${editObj ? editObj.regional : "Dirección Regional de Heredia"}" placeholder="Dirección Regional" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-cir" type="text" required value="${editObj ? editObj.circuito : "Circuito 02"}" placeholder="Circuito Escolar" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-con" type="email" required value="${editObj ? editObj.contacto : ""}" placeholder="correo@institucion.com" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-coope" type="text" value="${editObj ? (editObj.nombreCoope || '') : 'Coopeconvivir R.L.'}" placeholder="Nombre Cooperativa (vacío si no tiene)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${editObj ? editObj.escudo : draftEscudo}" alt="Escudo" style="height:36px;width:32px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
              <label style="background:#0f766e;color:#fff;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📤 Escudo<input id="ic-esc" type="file" accept="image/*" style="display:none;"/></label>
            </div>
            <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${editObj ? "💾 Guardar Cambios" : "✅ Crear Institución (13d Beta)"}</button>
          </form>

          ${estInst ? `
            <div style="background:#070d19;border:1.5px solid #10b981;border-radius:12px;padding:13px;margin-bottom:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;flex-wrap:wrap;gap:6px;">
                <b style="color:#34d399;font-size:14px;">🎒 Padrón de Estudiantes — ${estInst.nombre} (${(estInst.listaEstudiantes||[]).length} registrados • Cuota ₡1,000/est. = ${fmtCRC((estInst.listaEstudiantes||[]).length * 1000)})</b>
                <button id="ie-cls" style="background:#334155;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer;">Cerrar padrón ✕</button>
              </div>
              <form id="ie-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px;margin-bottom:9px;">
                <input id="ie-nom" type="text" required placeholder="Nombre estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-ced" type="text" required placeholder="Cédula / TIM" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-sec" type="text" required value="11-1" placeholder="Sección" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:7px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">+ Agregar Estudiante</button>
              </form>
              <div style="max-height:190px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;">
                ${(estInst.listaEstudiantes || []).map((st, idx) => `<div style="background:#0b1322;padding:7px 9px;border-radius:7px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;"><span><b>${st.nombre}</b> (${st.seccion}) • ${st.email}</span><button data-idel="${idx}" class="ie-del" style="background:#7f1d1d;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🗑️</button></div>`).join("") || `<div style="color:#64748b;font-size:11.5px;">Sin estudiantes registrados en esta institución todavía.</div>`}
              </div>
            </div>
          ` : ""}

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:860px;border-collapse:collapse;font-size:11.5px;">
              <tr style="background:#131f33;color:#38bdf8;">
                <th style="padding:7px;text-align:left;">Institución / Escudo</th>
                <th style="padding:7px;text-align:left;">Modalidad / Cooperativa</th>
                <th style="padding:7px;">Estado</th>
                <th style="padding:7px;text-align:left;">Anualidad / Estudiantes</th>
                <th style="padding:7px;">Acciones CRUD & Pago</th>
              </tr>
              ${filtradas.map(inst => {
                const bCol = inst.estado === "Activo" ? "#059669" : (inst.estado.includes("Cortesía") ? "#0284c7" : (inst.estado.includes("Beta") ? "#7c3aed" : (inst.estado === "Desactivado" ? "#b45309" : "#dc2626")));
                const isAct = inst.id === actId;
                const cntEst = Array.isArray(inst.listaEstudiantes) ? inst.listaEstudiantes.length : Number(inst.estudiantes || 0);
                return `<tr>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <img src="${inst.escudo}" style="height:34px;width:30px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
                      <div><b>${inst.nombre}</b> ${isAct ? `<span style="background:#1d4ed8;color:#fff;font-size:9px;padding:2px 5px;border-radius:4px;">EN USO</span>` : ""}<br/><span style="font-size:10px;color:#94a3b8;">${inst.id} • ${inst.contacto}</span></div>
                    </div>
                  </td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${inst.tipo}</b><br/><span style="font-size:10px;color:#2dd4bf;">${inst.tieneCoope !== false && inst.nombreCoope ? "🏪 " + inst.nombreCoope : "Sin cooperativa"}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${bCol};color:#fff;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:700;">${inst.estado}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${inst.plan}</b><br/><span style="font-size:10px;color:#94a3b8;">Vence: ${inst.vence} • 🎒 ${cntEst} est.</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                      <button data-a="usar" data-id="${inst.id}" class="ic-btn" style="background:#1d4ed8;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;font-weight:700;cursor:pointer;">🎯 Usar</button>
                      <button data-a="pagar" data-id="${inst.id}" class="ic-btn" title="Registrar pago anualidad ₡19,100" style="background:#059669;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;font-weight:700;cursor:pointer;">💳 ₡19,100</button>
                      <button data-a="estudiantes" data-id="${inst.id}" class="ic-btn" style="background:#0f766e;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🎒 Padrón</button>
                      <button data-a="editar" data-id="${inst.id}" class="ic-btn" style="background:#334155;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">✏️</button>
                      <button data-a="cortesia" data-id="${inst.id}" class="ic-btn" style="background:#0284c7;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🎁</button>
                      <button data-a="${inst.estado==='Bloqueado'?'desbloquear':'bloquear'}" data-id="${inst.id}" class="ic-btn" style="background:${inst.estado==='Bloqueado'?'#4f46e5':'#dc2626'};color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">${inst.estado==='Bloqueado'?'🔓':'🚫'}</button>
                      ${inst.id !== "INST-001" ? `<button data-a="eliminar" data-id="${inst.id}" class="ic-btn" style="background:#7f1d1d;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🗑️</button>` : ""}
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
        r.onload = (ev) => { draftEscudo = ev.target.result; if (editObj) { editObj.escudo = draftEscudo; saveInsts(list); } draw(); };
        r.readAsDataURL(f);
      };
      document.getElementById("ic-f").onsubmit = (e) => {
        e.preventDefault();
        const arr = loadInsts();
        const coopeNom = document.getElementById("ic-coope").value.trim();
        const payload = {
          nombre: document.getElementById("ic-nom").value.trim(),
          corto: document.getElementById("ic-cor").value.trim(),
          tipo: document.getElementById("ic-tip").value,
          regional: document.getElementById("ic-reg").value.trim(),
          circuito: document.getElementById("ic-cir").value.trim(),
          contacto: document.getElementById("ic-con").value.trim().toLowerCase(),
          tieneCoope: Boolean(coopeNom),
          nombreCoope: coopeNom
        };
        if (editId) {
          const i = arr.findIndex(x => x.id === editId);
          if (i >= 0) arr[i] = { ...arr[i], ...payload, escudo: draftEscudo || arr[i].escudo };
          editId = null;
        } else {
          arr.unshift({
            id: "INST-" + String(Date.now()).slice(-4),
            ...payload,
            escudo: draftEscudo,
            estado: "Beta 13 días",
            plan: "Beta 13d → ₡19,100/año",
            anualidadCRC: 19100,
            vence: new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10),
            tieneComedor: true,
            listaEstudiantes: []
          });
        }
        saveInsts(arr); draw();
      };

      if (estInst) {
        document.getElementById("ie-cls").onclick = () => { estModalInstId = null; draw(); };
        document.getElementById("ie-f").onsubmit = (e) => {
          e.preventDefault();
          const arr = loadInsts(), target = arr.find(x => x.id === estModalInstId);
          if (!target) return;
          if (!Array.isArray(target.listaEstudiantes)) target.listaEstudiantes = [];
          target.listaEstudiantes.unshift({
            nombre: document.getElementById("ie-nom").value.trim(),
            cedula: document.getElementById("ie-ced").value.trim(),
            email: document.getElementById("ie-mail").value.trim().toLowerCase(),
            seccion: document.getElementById("ie-sec").value.trim(),
            pagado: true
          });
          saveInsts(arr); draw();
        };
        shell.querySelectorAll(".ie-del").forEach(b => b.onclick = () => {
          const arr = loadInsts(), target = arr.find(x => x.id === estModalInstId);
          if (!target || !Array.isArray(target.listaEstudiantes)) return;
          target.listaEstudiantes.splice(Number(b.getAttribute("data-idel")), 1);
          saveInsts(arr); draw();
        });
      }

      shell.querySelectorAll(".ic-btn").forEach(b => b.onclick = async () => {
        const arr = loadInsts(), id = b.getAttribute("data-id"), act = b.getAttribute("data-a");
        const inst = arr.find(x => x.id === id); if (!inst) return;
        if (act === "usar") { aplicarInstitucionActiva(inst); location.reload(); return; }
        if (act === "editar") { editId = id; draftEscudo = inst.escudo; draw(); return; }
        if (act === "estudiantes") { estModalInstId = id; draw(); return; }
        if (act === "pagar") {
          const ref = prompt(`Registrar pago de anualidad ₡19,100 para ${inst.nombre}.\nIngrese N.° comprobante SINPE Móvil:`, "SINPE-" + String(Date.now()).slice(-6));
          if (!ref) return;
          const monto = Number(prompt("Monto recibido en colones (₡19,100 base anualidad + ₡1,000/est. si aplica):", "19100") || 19100);
          const vence = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
          inst.estado = "Activo"; inst.plan = "Institucional Pagada ₡19,100/año"; inst.vence = vence;
          saveInsts(arr);
          const pLog = loadPagos(), pid = "LIC-" + String(pLog.length + 1001);
          const hash = sha256Hex ? (await sha256Hex(`${pid}|${inst.id}|${ref}|${monto}`)).slice(0, 18) : "LICSHA256VERIF";
          const pago = { id: pid, instId: inst.id, instNombre: inst.nombre, fecha: new Date().toLocaleDateString("es-CR"), concepto: `Anualidad Institucional (${inst.tipo})`, refSinpe: ref.trim(), montoCRC: monto, vence, hash };
          pLog.unshift(pago); savePagos(pLog);
          imprimirReciboAnualidad(pago, inst, generarQRSVG);
          draw(); return;
        }
        if (act === "cortesia") {
          const d = prompt("Días de cortesía (90, 365 o VITALICIA):", "365"); if (!d) return;
          inst.estado = "Cortesía";
          inst.plan = d.toUpperCase().includes("VIT") ? "Cortesía Vitalicia" : `Cortesía ${parseInt(d,10)||90} días`;
          inst.vence = d.toUpperCase().includes("VIT") ? "Permanente" : new Date(Date.now() + (parseInt(d,10)||90) * 86400000).toISOString().slice(0, 10);
        } else if (act === "desbloquear") { inst.estado = "Activo"; }
        else if (act === "bloquear") { inst.estado = "Bloqueado"; }
        else if (act === "eliminar") { if (!confirm(`¿Eliminar "${inst.nombre}"?`)) return; saveInsts(arr.filter(x => x.id !== id)); draw(); return; }
        saveInsts(arr); draw();
      });

      document.getElementById("ic-csv").onclick = () => {
        const rows = [["ID","INSTITUCION","TIPO","ESTADO","PLAN","VENCE","ESTUDIANTES","COOPERATIVA"], ...loadInsts().map(i => [i.id, i.nombre, i.tipo, i.estado, i.plan, i.vence, Array.isArray(i.listaEstudiantes)?i.listaEstudiantes.length:0, i.nombreCoope||"Sin cooperativa"])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "instituciones-anualidades-practica.csv"; a.click();
      };
    }
    draw();
  };
})();