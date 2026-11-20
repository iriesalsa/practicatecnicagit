(function () {
  const INST_KEY = "bds_instituciones_crud_v191";
  const ACT_KEY = "bds_institucion_activa_v191";
  const PAY_LOG_KEY = "bds_instituciones_pagos_v203";

  // Catálogo oficial de 7 Provincias y 27 Direcciones Regionales de Educación (Costa Rica)
  const CR_PROVINCIAS_DRE = {
    "Heredia": ["Dirección Regional de Heredia", "Dirección Regional de Sarapiquí"],
    "San José": ["Dirección Regional de San José Central", "Dirección Regional de San José Norte", "Dirección Regional de San José Oeste", "Dirección Regional de Desamparados", "Dirección Regional de Puriscal", "Dirección Regional de Los Santos", "Dirección Regional de Pérez Zeledón"],
    "Alajuela": ["Dirección Regional de Alajuela", "Dirección Regional de Occidente", "Dirección Regional de San Carlos", "Dirección Regional de Zona Norte-Norte"],
    "Cartago": ["Dirección Regional de Cartago", "Dirección Regional de Turrialba"],
    "Guanacaste": ["Dirección Regional de Liberia", "Dirección Regional de Nicoya", "Dirección Regional de Santa Cruz", "Dirección Regional de Cañas"],
    "Puntarenas": ["Dirección Regional de Puntarenas", "Dirección Regional de Aguirre", "Dirección Regional de Coto", "Dirección Regional de Grande de Térraba", "Dirección Regional Peninsular"],
    "Limón": ["Dirección Regional de Limón", "Dirección Regional de Guápiles", "Dirección Regional de Sulá"]
  };

  const CIRCUITOS_CR = ["Circuito 01","Circuito 02","Circuito 03","Circuito 04","Circuito 05","Circuito 06","Circuito 07","Circuito 08","Circuito 09","Circuito 10","Circuito 11","Circuito 12"];
  const MODALIDADES_MEP = ["CTP (Técnico)", "Colegio Académico", "Escuela Primaria", "Colegio Nocturno / CINDEA / IPEC", "Liceo Rural / Telesecundaria", "Institución Privada"];

  function loadInsts() {
    try { const d = JSON.parse(localStorage.getItem(INST_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      {
        id: "INST-001",
        codigoPresup: "4210",
        nombre: "Colegio Técnico Profesional Mercedes Norte",
        corto: "CTP Mercedes Norte",
        tipo: "CTP (Técnico)",
        provincia: "Heredia",
        regional: "Dirección Regional de Heredia",
        circuito: "Circuito 02",
        jornada: "Diurna Técnica (07:00–16:20)",
        escudo: "/escudo-ctpmn-oficial.jpeg?v=205",
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
          { nombre: "Esteban Campos Mora", cedula: "4-0295-0442", email: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", pagado: true },
          { nombre: "Valeria Solís Jiménez", cedula: "4-0291-0771", email: "valeria.solis@est.mep.go.cr", seccion: "10-C", pagado: true },
          { nombre: "Mateo Rojas Chacón", cedula: "4-0299-0318", email: "mateo.rojas@est.mep.go.cr", seccion: "12-1", pagado: true }
        ]
      },
      {
        id: "INST-002",
        codigoPresup: "3108",
        nombre: "Liceo Académico de Heredia (Demo 2026)",
        corto: "Liceo Académico",
        tipo: "Colegio Académico",
        provincia: "Heredia",
        regional: "Dirección Regional de Heredia",
        circuito: "Circuito 01",
        jornada: "Diurna Académica (07:00–14:40)",
        escudo: "/escudo-ctpmn-oficial.jpeg?v=205",
        estado: "Beta 13 días",
        plan: "Beta 13d → ₡19,100/año",
        anualidadCRC: 19100,
        vence: new Date(Date.now() + 13 * 86400000).toISOString().slice(0, 10),
        tieneCoope: false,
        nombreCoope: "",
        tieneComedor: true,
        contacto: "correo@institucion.com",
        listaEstudiantes: []
      }
    ];
    localStorage.setItem(INST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveInsts(a) { localStorage.setItem(INST_KEY, JSON.stringify(a)); }

  function loadPagos() { try { const d = JSON.parse(localStorage.getItem(PAY_LOG_KEY)); return Array.isArray(d) ? d : []; } catch { return []; } }
  function savePagos(a) { localStorage.setItem(PAY_LOG_KEY, JSON.stringify(a.slice(0, 200))); }
  function fmtCRC(n) { return "₡" + Number(n || 0).toLocaleString("es-CR"); }

  function getActiva() {
    const list = loadInsts();
    const id = localStorage.getItem(ACT_KEY) || (list[0] && list[0].id);
    const found = list.find(x => x.id === id) || list[0];
    return { provincia: "Heredia", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", tipo: "CTP (Técnico)", codigoPresup: "4210", ...found };
  }

  function aplicarInstitucionActiva(inst) {
    if (!inst) return;
    localStorage.setItem(ACT_KEY, inst.id);
    if (window.BDS_BRAND) {
      const cur = window.BDS_BRAND.get();
      window.BDS_BRAND.save({
        ...cur,
        institucion: inst.nombre,
        institucionCorta: inst.corto || inst.nombre.slice(0, 22),
        provincia: inst.provincia || "Heredia",
        regional: inst.regional || "Dirección Regional de Heredia",
        circuito: inst.circuito || "Circuito 02",
        tipoInstitucion: inst.tipo || "CTP (Técnico)",
        codigoPresup: inst.codigoPresup || "4210",
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
    if (!w) return alert("Permita ventanas emergentes para imprimir el recibo.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Recibo Anualidad ${pago.id}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12.5px;max-width:600px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:14px}td{border:1px solid #cbd5e1;padding:8px}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${inst.escudo}" style="height:56px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">pracTICAtecnica.com — BDS Devs</h2><div>COMPROBANTE DE LICENCIA INSTITUCIONAL ${pago.id}</div></div><img src="/buho-oficial.png?v=205" style="height:46px;border-radius:50%"/></div><table><tr><td style="width:34%;background:#f8fafc"><b>Institución</b></td><td>${inst.nombre} (${inst.tipo})</td></tr><tr><td style="background:#f8fafc"><b>Ubicación MEP</b></td><td>${inst.provincia || "Heredia"} • ${inst.regional} • ${inst.circuito} • Cód. ${inst.codigoPresup || "—"}</td></tr><tr><td style="background:#f8fafc"><b>Referencia SINPE</b></td><td>${pago.refSinpe}</td></tr><tr><td style="background:#f8fafc"><b>Monto Pagado</b></td><td><b>${fmtCRC(pago.montoCRC)}</b></td></tr><tr><td style="background:#f8fafc"><b>Vigencia</b></td><td>Hasta ${pago.vence} (Fecha pago: ${pago.fecha})</td></tr></table><div class="qr">${generarQRSVG ? generarQRSVG("PT-LIC|" + pago.hash, 86) : ""}<div><b>Licencia Verificable QR SHA-256</b><br/><code>${pago.hash}</code><br/><small>Emitido por Ing. Max Salazar Sánchez • WhatsApp +506 6090-6359.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_CR_GEO = { PROVINCIAS_DRE: CR_PROVINCIAS_DRE, CIRCUITOS_CR, MODALIDADES_MEP };
  window.BDS_INST_API = { loadInsts, saveInsts, loadPagos, getActiva, aplicarInstitucionActiva };

  window.BDS_RENDER_INSTITUCIONES_CRUD = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx || {};
    if (!sesion || (sesion.rol !== "SuperAdmin" && sesion.rolReal !== "SuperAdmin")) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:30px;border-color:#dc2626;"><h3 style="color:#f87171;margin:0;">🚫 Acceso exclusivo SuperAdmin</h3></div>`;
      return;
    }

    let editId = null;
    let estModalInstId = null;
    let draftEscudo = "/escudo-ctpmn-oficial.jpeg?v=205";
    let draftProv = "Heredia";
    let busca = "";

    function draw() {
      const list = loadInsts();
      const pagos = loadPagos();
      const actId = localStorage.getItem(ACT_KEY) || (list[0] && list[0].id);
      const editObj = editId ? list.find(x => x.id === editId) : null;
      if (editObj && editObj.provincia) draftProv = editObj.provincia;
      const dreList = CR_PROVINCIAS_DRE[draftProv] || CR_PROVINCIAS_DRE["Heredia"];
      const filtradas = list.filter(x => !busca || (x.nombre || "").toLowerCase().includes(busca.toLowerCase()) || (x.provincia || "").toLowerCase().includes(busca.toLowerCase()) || (x.tipo || "").toLowerCase().includes(busca.toLowerCase()));

      const totalEst = list.reduce((a, i) => a + (Array.isArray(i.listaEstudiantes) ? i.listaEstudiantes.length : Number(i.estudiantes || 0)), 0);
      const totalRecaudado = pagos.reduce((a, p) => a + Number(p.montoCRC || 0), 0);
      const estInst = estModalInstId ? list.find(x => x.id === estModalInstId) : null;

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#b45309;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">7 PROVINCIAS • 27 DRE COSTA RICA • CIRCUITOS 01–12 • ANUALIDAD ₡19,100</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">🏛️ Configuración Institucional General, Provincia/DRE y Licencias</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <input id="ic-q" type="text" value="${busca}" placeholder="Buscar institución o provincia..." style="background:#070d19;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:7px;font-size:12px;min-width:180px;"/>
              <button id="ic-csv" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📥 CSV</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin-bottom:13px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10px;color:#94a3b8;">Instituciones</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">${list.length}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10px;color:#94a3b8;">Activas / Cortesía</div><div style="font-size:20px;font-weight:900;color:#34d399;">${list.filter(x => x.estado==="Activo"||x.estado==="Cortesía").length}</div></div>
            <div style="background:#070d19;border:1px solid #fbbf24;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10px;color:#94a3b8;">Estudiantes Padrón</div><div style="font-size:20px;font-weight:900;color:#fbbf24;">${totalEst}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10px;color:#94a3b8;">Recaudado SINPE</div><div style="font-size:17px;font-weight:900;color:#c084fc;margin-top:3px;">${fmtCRC(totalRecaudado)}</div></div>
          </div>

          <form id="ic-f" style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:13px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,185px),1fr));gap:8px;margin-bottom:13px;">
            <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;">
              <b style="color:#38bdf8;font-size:13.5px;">${editObj ? `✏️ Editando: ${editObj.nombre}` : "➕ Configurar / Crear Institución (Afecta Horarios, Permisos y PDFs)"}</b>
              ${editObj ? `<button type="button" id="ic-cancel" style="background:#334155;color:#fff;border:none;padding:4px 9px;border-radius:6px;font-size:11px;cursor:pointer;">Cancelar</button>` : ""}
            </div>
            <input id="ic-nom" type="text" required value="${editObj ? editObj.nombre : ""}" placeholder="Nombre oficial del centro educativo" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-cor" type="text" required value="${editObj ? editObj.corto : ""}" placeholder="Nombre corto (barra superior)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-cod" type="text" value="${editObj ? (editObj.codigoPresup || "") : ""}" placeholder="Código Presupuestario (ej. 4210)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <select id="ic-tip" style="background:#0b1322;border:1px solid #334155;color:#38bdf8;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
              ${MODALIDADES_MEP.map(t => `<option ${editObj && editObj.tipo===t?"selected":""}>${t}</option>`).join("")}
            </select>
            <select id="ic-prov" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;font-weight:700;">
              ${Object.keys(CR_PROVINCIAS_DRE).map(pr => `<option value="${pr}" ${draftProv===pr?"selected":""}>📍 Provincia: ${pr}</option>`).join("")}
            </select>
            <select id="ic-reg" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
              ${dreList.map(dr => `<option value="${dr}" ${editObj && editObj.regional===dr?"selected":""}>${dr}</option>`).join("")}
            </select>
            <select id="ic-cir" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;">
              ${CIRCUITOS_CR.map(ci => `<option value="${ci}" ${(editObj?editObj.circuito:"Circuito 02")===ci?"selected":""}>${ci}</option>`).join("")}
            </select>
            <input id="ic-con" type="email" required value="${editObj ? editObj.contacto : ""}" placeholder="correo@institucion.com" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <input id="ic-coope" type="text" value="${editObj ? (editObj.nombreCoope || "") : "Coopeconvivir R.L."}" placeholder="Cooperativa (vacío si no tiene)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:7px;font-size:12px;"/>
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${editObj ? editObj.escudo : draftEscudo}" alt="Escudo" style="height:36px;width:32px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
              <label style="background:#0f766e;color:#fff;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📤 Escudo<input id="ic-esc" type="file" accept="image/*" style="display:none;"/></label>
            </div>
            <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${editObj ? "💾 Guardar Cambios" : "✅ Crear Institución (13d Beta)"}</button>
          </form>

          ${estInst ? `
            <div style="background:#070d19;border:1.5px solid #10b981;border-radius:12px;padding:13px;margin-bottom:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;flex-wrap:wrap;gap:6px;">
                <b style="color:#34d399;font-size:13.5px;">🎒 Padrón — ${estInst.nombre} (${(estInst.listaEstudiantes||[]).length} est. • Cuota ₡1,000 = ${fmtCRC((estInst.listaEstudiantes||[]).length * 1000)})</b>
                <button id="ie-cls" style="background:#334155;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer;">Cerrar ✕</button>
              </div>
              <form id="ie-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:6px;margin-bottom:9px;">
                <input id="ie-nom" type="text" required placeholder="Nombre estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-ced" type="text" required placeholder="Cédula / TIM" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-mail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <input id="ie-sec" type="text" required value="11-1" placeholder="Sección" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:11.5px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:7px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">+ Agregar</button>
              </form>
              <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;">
                ${(estInst.listaEstudiantes || []).map((st, idx) => `<div style="background:#0b1322;padding:7px 9px;border-radius:7px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;"><span><b>${st.nombre}</b> (${st.seccion}) • ${st.email}</span><button data-idel="${idx}" class="ie-del" style="background:#7f1d1d;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🗑️</button></div>`).join("") || `<div style="color:#64748b;font-size:11.5px;">Sin estudiantes registrados aún.</div>`}
              </div>
            </div>
          ` : ""}

          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:860px;border-collapse:collapse;font-size:11.5px;">
              <tr style="background:#131f33;color:#38bdf8;">
                <th style="padding:7px;text-align:left;">Institución / Código</th>
                <th style="padding:7px;text-align:left;">Provincia • DRE • Circuito</th>
                <th style="padding:7px;">Estado</th>
                <th style="padding:7px;text-align:left;">Anualidad / Padrón</th>
                <th style="padding:7px;">Acciones CRUD</th>
              </tr>
              ${filtradas.map(inst => {
                const bCol = inst.estado === "Activo" ? "#059669" : (inst.estado.includes("Cortesía") ? "#0284c7" : (inst.estado.includes("Beta") ? "#7c3aed" : (inst.estado === "Desactivado" ? "#b45309" : "#dc2626")));
                const isAct = inst.id === actId;
                const cntEst = Array.isArray(inst.listaEstudiantes) ? inst.listaEstudiantes.length : Number(inst.estudiantes || 0);
                return `<tr>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <img src="${inst.escudo}" style="height:34px;width:30px;object-fit:contain;background:#fff;padding:2px;border-radius:6px;"/>
                      <div><b>${inst.nombre}</b> ${isAct ? `<span style="background:#1d4ed8;color:#fff;font-size:9px;padding:2px 5px;border-radius:4px;">ACTIVA</span>` : ""}<br/><span style="font-size:10px;color:#2dd4bf;">${inst.tipo} • Cód. ${inst.codigoPresup || "—"}</span></div>
                    </div>
                  </td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>📍 ${inst.provincia || "Heredia"}</b><br/><span style="font-size:10px;color:#94a3b8;">${inst.regional} • ${inst.circuito}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${bCol};color:#fff;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:700;">${inst.estado}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${inst.plan}</b><br/><span style="font-size:10px;color:#94a3b8;">Vence: ${inst.vence} • 🎒 ${cntEst} est.</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                      <button data-a="usar" data-id="${inst.id}" class="ic-btn" style="background:#1d4ed8;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;font-weight:700;cursor:pointer;">🎯 Usar</button>
                      <button data-a="pagar" data-id="${inst.id}" class="ic-btn" style="background:#059669;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;font-weight:700;cursor:pointer;">💳 ₡19,100</button>
                      <button data-a="estudiantes" data-id="${inst.id}" class="ic-btn" style="background:#0f766e;color:#fff;border:none;padding:4px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🎒</button>
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
      document.getElementById("ic-prov").onchange = (e) => { draftProv = e.target.value; draw(); };
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
          codigoPresup: document.getElementById("ic-cod").value.trim() || "0000",
          tipo: document.getElementById("ic-tip").value,
          provincia: document.getElementById("ic-prov").value,
          regional: document.getElementById("ic-reg").value,
          circuito: document.getElementById("ic-cir").value,
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
        if (act === "editar") { editId = id; draftEscudo = inst.escudo; draftProv = inst.provincia || "Heredia"; draw(); return; }
        if (act === "estudiantes") { estModalInstId = id; draw(); return; }
        if (act === "pagar") {
          const ref = prompt(`Pago de anualidad ₡19,100 para ${inst.nombre}.\nN.° comprobante SINPE:`, "SINPE-" + String(Date.now()).slice(-6));
          if (!ref) return;
          const monto = Number(prompt("Monto recibido en colones (₡):", "19100") || 19100);
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
        } else if (act === "desbloquear") inst.estado = "Activo";
        else if (act === "bloquear") inst.estado = "Bloqueado";
        else if (act === "eliminar") { if (!confirm(`¿Eliminar "${inst.nombre}"?`)) return; saveInsts(arr.filter(x => x.id !== id)); draw(); return; }
        saveInsts(arr); draw();
      });

      document.getElementById("ic-csv").onclick = () => {
        const rows = [["ID","CODIGO","INSTITUCION","MODALIDAD","PROVINCIA","DRE","CIRCUITO","ESTADO","VENCE","ESTUDIANTES"], ...loadInsts().map(i => [i.id, i.codigoPresup||"", i.nombre, i.tipo, i.provincia||"Heredia", i.regional, i.circuito, i.estado, i.vence, Array.isArray(i.listaEstudiantes)?i.listaEstudiantes.length:0])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "instituciones-cr-mep-2026.csv"; a.click();
      };
    }
    draw();
  };
})();