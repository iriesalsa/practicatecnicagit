(function () {
  const CFG_KEY = "bds_coope_cfg_v198";
  const PROD_KEY = "bds_coope_prods_v198";
  const WLT_KEY = "bds_coope_wallets_v198";
  const SALE_KEY = "bds_coope_sales_v198";
  const REC_KEY = "bds_coope_recycle_v198";
  const PARENTAL_KEY = "bds_parental_ctrl_v198";

  const MATERIALES_RECICLAJE = [
    { id: "pet", nom: "Botella Plástica PET (unidad)", eco: 5, ic: "🧴" },
    { id: "papel", nom: "Papel / Hojas Blancas (kg)", eco: 15, ic: "📄" },
    { id: "carton", nom: "Cartón limpio (kg)", eco: 10, ic: "📦" },
    { id: "aluminio", nom: "Lata de Aluminio (unidad)", eco: 8, ic: "🥫" },
    { id: "tapas", nom: "Tapitas plásticas (10 uds)", eco: 4, ic: "♻️" }
  ];

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=198",
      logoMep: "/logo-mep-oficial.png?v=198",
      mascota: "/buho-oficial.png?v=198"
    };
  }

  function loadCfg() {
    try { const d = JSON.parse(localStorage.getItem(CFG_KEY)); if (d && d.nombre) return d; } catch {}
    const def = {
      habilitada: true,
      nombre: "Coopeconvivir R.L.",
      monedaEco: "EcoMEPs",
      simboloEco: "🌿",
      valorEcoCRC: 10,
      sinpeCoope: "8888-0000"
    };
    localStorage.setItem(CFG_KEY, JSON.stringify(def));
    return def;
  }
  function saveCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify(c)); }

  function loadProds() {
    try { const d = JSON.parse(localStorage.getItem(PROD_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "P-001", sku: "SKU-CUA01", nombre: "Cuaderno Cosido 100 Hojas", cat: "Librería", precioCRC: 1200, precioEco: 120, stock: 45 },
      { id: "P-002", sku: "SKU-LAP02", nombre: "Lapicero Azul / Negro", cat: "Librería", precioCRC: 350, precioEco: 35, stock: 120 },
      { id: "P-003", sku: "SKU-IMP03", nombre: "Impresión / Fotocopia (hoja)", cat: "Servicios", precioCRC: 50, precioEco: 5, stock: 999 },
      { id: "P-004", sku: "SKU-JNS04", nombre: "Tiquete Jeans Day / Actividad", cat: "Actividades", precioCRC: 1000, precioEco: 100, stock: 300 },
      { id: "P-005", sku: "SKU-MER05", nombre: "Merienda Saludable / Fruta", cat: "Soda / Cooperativa", precioCRC: 850, precioEco: 85, stock: 40 },
      { id: "P-006", sku: "SKU-CAM06", nombre: "Camiseta Institucional CTP", cat: "Uniformes", precioCRC: 7500, precioEco: 750, stock: 25 }
    ];
    localStorage.setItem(PROD_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveProds(a) { localStorage.setItem(PROD_KEY, JSON.stringify(a)); }

  function loadWallets() {
    try { const d = JSON.parse(localStorage.getItem(WLT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "CW-101", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", saldoCRC: 12500, ecoPuntos: 85, gastoMes: 2250, activo: true },
      { id: "CW-102", nombre: "Esteban Campos Mora", email: "esteban.campos@est.mep.go.cr", seccion: "10-C-3", saldoCRC: 4500, ecoPuntos: 40, gastoMes: 1000, activo: true },
      { id: "CW-103", nombre: "Valeria Solís Jiménez", email: "valeria.solis@est.mep.go.cr", seccion: "11-1", saldoCRC: 1500, ecoPuntos: 120, gastoMes: 850, activo: true }
    ];
    localStorage.setItem(WLT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveWallets(a) { localStorage.setItem(WLT_KEY, JSON.stringify(a)); }

  function loadSales() { try { return JSON.parse(localStorage.getItem(SALE_KEY)) || []; } catch { return []; } }
  function saveSales(a) { localStorage.setItem(SALE_KEY, JSON.stringify(a)); }

  function loadRecycles() { try { return JSON.parse(localStorage.getItem(REC_KEY)) || []; } catch { return []; } }
  function saveRecycles(a) { localStorage.setItem(REC_KEY, JSON.stringify(a)); }

  function getParentalRule(email) {
    try {
      const m = JSON.parse(localStorage.getItem(PARENTAL_KEY)) || {};
      return m[(email || "").toLowerCase()] || { allowChat: true, allowCoope: true, dailyLimitCRC: 0 };
    } catch { return { allowChat: true, allowCoope: true, dailyLimitCRC: 0 }; }
  }

  function ensureWallet(sesion) {
    const ws = loadWallets();
    const mail = (sesion.email || "").toLowerCase();
    let w = ws.find(x => x.email.toLowerCase() === mail);
    if (!w) {
      w = { id: "CW-" + String(Date.now()).slice(-4), nombre: sesion.nombre || mail.split("@")[0], email: mail, seccion: sesion.seccion || sesion.rol, saldoCRC: 0, ecoPuntos: 0, gastoMes: 0, activo: true };
      ws.push(w);
      saveWallets(ws);
    }
    return w;
  }

  function findWalletByQR(raw) {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return null;
    const ws = loadWallets();
    const m = q.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
    const mail = m ? m[0] : "";
    return ws.find(w =>
      (mail && w.email.toLowerCase() === mail) ||
      w.email.toLowerCase() === q ||
      w.id.toLowerCase() === q ||
      (q.length >= 3 && w.nombre.toLowerCase().includes(q))
    ) || null;
  }

  function fmtCRC(n) { return "₡" + Number(n || 0).toLocaleString("es-CR"); }

  function checkSpentToday(email) {
    const hoy = new Date().toISOString().slice(0, 10);
    return loadSales()
      .filter(s => s.fecha === hoy && s.email.toLowerCase() === (email || "").toLowerCase() && s.tipo === "VENTA")
      .reduce((acc, s) => acc + Number(s.totalCRC || 0), 0);
  }

  function imprimirFacturaCoope(venta, cfg, generarQRSVG) {
    const b = getBrand();
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir la factura.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Factura ${venta.id} — ${cfg.nombre}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a;font-size:12.5px;max-width:580px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f766e;padding-bottom:10px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin-bottom:12px}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:12px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:54px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${cfg.nombre}</h2><div style="font-size:11.5px">${b.institucion}</div><div style="color:#0f766e;font-weight:700">COMPROBANTE / FACTURA ${venta.id}</div></div><img src="${b.mascota}" style="height:46px;border-radius:50%"/></div><p><b>Cliente:</b> ${venta.cliente} (${venta.email})<br/><b>Fecha/Hora:</b> ${venta.fecha} ${venta.hora} • <b>Método:</b> ${venta.metodo}</p><table><tr><th>Producto / Concepto</th><th>Cant.</th><th>Subtotal</th></tr>${(venta.items || []).map(it => `<tr><td>${it.nombre}</td><td>${it.qty}</td><td>${venta.metodo.includes(cfg.monedaEco)?`${it.precioEco*it.qty} ${cfg.simboloEco}`:fmtCRC(it.precioCRC*it.qty)}</td></tr>`).join("")}<tr style="background:#f1f5f9"><td colspan="2"><b>TOTAL PAGADO</b></td><td><b>${venta.metodo.includes(cfg.monedaEco)?`${venta.totalEco} ${cfg.simboloEco} ${cfg.monedaEco}`:fmtCRC(venta.totalCRC)}</b></td></tr></table><div class="qr">${generarQRSVG("PT-COOPE|" + venta.hash, 86)}<div><b>Factura Verificable QR SHA-256</b><br/><code>${venta.hash}</code><br/><small>Atendido por: ${venta.cajero} • ${cfg.nombre}.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  // API pública para QA y otros módulos (Práctica Finanzas y Portal Familia)
  window.BDS_COOPE_API = {
    loadCfg, saveCfg, loadProds, saveProds, loadWallets, saveWallets, loadSales, loadRecycles,
    ensureWallet, findWalletByQR, getParentalRule, checkSpentToday, MATERIALES_RECICLAJE
  };

  window.BDS_RENDER_COOPERATIVA = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const cfg = loadCfg();
    const extras = Array.isArray(sesion.extraRoles) ? sesion.extraRoles : [];
    const esOperador = ["SuperAdmin", "Director(a)"].includes(sesion.rol) || extras.includes("Cooperativa");

    if (!cfg.habilitada && !esOperador) {
      shell.innerHTML = `<div class="bds-card" style="text-align:center;padding:32px;"><h3 style="margin:0 0 6px;color:#38bdf8;">🏪 Módulo Cooperativa desactivado</h3><p style="font-size:13px;color:#94a3b8;margin:0;">Esta institución no tiene habilitada una cooperativa estudiantil en este momento.</p></div>`;
      return;
    }

    let tab = esOperador ? "pos" : "billetera";
    let clienteActual = null;
    let carrito = [];
    let metodoPago = "SALDO_QR";
    let editProdId = null;

    function addToCart(prod) {
      const hit = carrito.find(x => x.id === prod.id);
      if (hit) hit.qty++;
      else carrito.push({ ...prod, qty: 1 });
      draw();
    }

    function draw() {
      const c = loadCfg();
      const prods = loadProds();
      const wallets = loadWallets();
      const sales = loadSales();
      const recycles = loadRecycles();
      const miW = ensureWallet(sesion);
      const misMovs = [
        ...sales.filter(s => s.email.toLowerCase() === miW.email.toLowerCase()).map(s => ({ f: s.fecha + " " + s.hora, tit: `${s.tipo === "RECARGA" ? "Recarga" : c.nombre} (${s.metodo})`, det: (s.items || []).map(x => `${x.qty}× ${x.nombre}`).join(", ") || s.nota, val: s.tipo === "RECARGA" ? `+${fmtCRC(s.totalCRC)}` : (s.metodo.includes(c.monedaEco) ? `-${s.totalEco} ${c.simboloEco}` : `-${fmtCRC(s.totalCRC)}`), pos: s.tipo === "RECARGA" })),
        ...recycles.filter(r => r.email.toLowerCase() === miW.email.toLowerCase()).map(r => ({ f: r.fecha + " " + r.hora, tit: `Reciclaje ${c.monedaEco}`, det: `${r.qty}× ${r.material}`, val: `+${r.ecoGanados} ${c.simboloEco}`, pos: true }))
      ].sort((a, b) => b.f.localeCompare(a.f));

      const totalCRC = carrito.reduce((a, x) => a + x.precioCRC * x.qty, 0);
      const totalEco = carrito.reduce((a, x) => a + x.precioEco * x.qty, 0);
      const editProd = editProdId ? prods.find(x => x.id === editProdId) : null;

      const tabs = [
        ...(esOperador ? [{ id: "pos", lbl: "🛒 Caja POS & QR" }] : []),
        { id: "billetera", lbl: `💳 Mi Billetera & ${c.simboloEco} ${c.monedaEco}` },
        { id: "reciclaje", lbl: `♻️ Reciclaje (${c.monedaEco})` },
        ...(esOperador ? [{ id: "productos", lbl: "📦 Productos CRUD" }, { id: "config", lbl: "⚙️ Config. Cooperativa" }] : [])
      ];

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">COOPERATIVA ESTUDIANTIL QR SHA-256 • ${c.simboloEco} ${c.monedaEco.toUpperCase()} (${c.habilitada?"ACTIVA":"PAUSADA"})</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🏪 ${c.nombre} — Pagos QR y Reciclaje Sostenible</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${tabs.map(t => `<button data-ct="${t.id}" class="cp-tab" style="background:${tab===t.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;">${t.lbl}</button>`).join("")}
            </div>
          </div>

          ${tab === "billetera" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:14px;align-items:start;">
              <div style="background:linear-gradient(135deg,#0f2247 0%,#0b1322 100%);border:2px solid #38bdf8;border-radius:14px;padding:16px;text-align:center;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                  <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:10px;"><div style="font-size:10.5px;color:#94a3b8;">SALDO COOPERATIVA</div><div style="font-size:21px;font-weight:900;color:#34d399;">${fmtCRC(miW.saldoCRC)}</div></div>
                  <div style="background:#070d19;border:1px solid #2dd4bf;border-radius:10px;padding:10px;"><div style="font-size:10.5px;color:#94a3b8;">${c.simboloEco} ${c.monedaEco.toUpperCase()}</div><div style="font-size:21px;font-weight:900;color:#2dd4bf;">${miW.ecoPuntos}</div><div style="font-size:10px;color:#94a3b8;">≈ ${fmtCRC(miW.ecoPuntos * c.valorEcoCRC)}</div></div>
                </div>
                <div style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">Gastos del mes: <b style="color:#fbbf24;">${fmtCRC(miW.gastoMes)}</b> • Estado: <b style="color:#34d399;">Activo</b></div>
                <div style="display:inline-block;margin-bottom:8px;">${generarQRSVG(sesion.qr || ("PT-QR|" + miW.email), 170)}</div>
                <div style="font-size:11px;color:#93c5fd;">Usa este QR en <b>${c.nombre}</b>, comedor, actividades y estaciones de reciclaje.</div>
              </div>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">📜 Movimientos Recientes (${misMovs.length})</h3>
                <div style="display:flex;flex-direction:column;gap:7px;max-height:360px;overflow-y:auto;">
                  ${misMovs.slice(0, 20).map(m => `
                    <div style="background:#0b1322;border:1px solid #1e293b;border-radius:8px;padding:9px;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12px;">
                      <div><b>${m.tit}</b><div style="font-size:11px;color:#94a3b8;">${m.det} • ${m.f}</div></div>
                      <b style="color:${m.pos?'#34d399':'#f87171'};white-space:nowrap;">${m.val}</b>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Aún no registra compras ni canjes en ${c.nombre}.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "pos" && esOperador ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:14px;align-items:start;">
              <!-- Lector Cliente QR + Catálogo Productos -->
              <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                    <b style="color:#38bdf8;font-size:13px;">1. Identificar Estudiante / Cliente (QR SHA-256)</b>
                    <button id="pos-cam-cli" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📷 Escanear QR Cliente</button>
                  </div>
                  <div style="display:flex;gap:6px;margin-bottom:8px;">
                    <select id="pos-sel-cli" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
                      <option value="">-- Seleccione o escanee estudiante --</option>
                      ${wallets.map(w => `<option value="${w.id}" ${clienteActual && clienteActual.id===w.id?"selected":""}>${w.nombre} (${w.seccion}) — ${fmtCRC(w.saldoCRC)} | ${w.ecoPuntos} ${c.simboloEco}</option>`).join("")}
                    </select>
                  </div>
                  ${clienteActual ? (() => {
                    const pr = getParentalRule(clienteActual.email);
                    const hoyG = checkSpentToday(clienteActual.email);
                    return `<div style="background:#0b1322;border-left:4px solid #10b981;padding:9px;border-radius:8px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                        <span><b>${clienteActual.nombre}</b> • Saldo: <b style="color:#34d399;">${fmtCRC(clienteActual.saldoCRC)}</b> • ${c.simboloEco} <b style="color:#2dd4bf;">${clienteActual.ecoPuntos} ${c.monedaEco}</b></span>
                        <button id="pos-rec" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">💵 + Recargar Efectivo</button>
                      </div>
                      ${pr.dailyLimitCRC > 0 ? `<div style="font-size:11px;color:#fbbf24;margin-top:4px;">🛡️ Control Parental: Límite diario ${fmtCRC(pr.dailyLimitCRC)} (Gastado hoy: ${fmtCRC(hoyG)})</div>` : ""}
                      ${!pr.allowCoope ? `<div style="font-size:11px;color:#f87171;margin-top:4px;">🚫 Compras en cooperativa bloqueadas por Control Parental.</div>` : ""}
                    </div>`;
                  })() : `<div style="font-size:11.5px;color:#94a3b8;">Escanea un Carné QR o elige un estudiante arriba para cobrar o recargar saldo.</div>`}
                </div>

                <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                    <b style="color:#fbbf24;font-size:13px;">2. Productos (${prods.length})</b>
                    <button id="pos-cam-prd" style="background:#1d4ed8;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📷 Escanear Código Producto</button>
                  </div>
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:7px;">
                    ${prods.map(p => `
                      <button data-pid="${p.id}" class="pos-add" style="text-align:left;background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:9px;cursor:pointer;">
                        <div style="font-size:10px;color:#38bdf8;">${p.cat} • ${p.sku}</div>
                        <div style="font-size:12px;font-weight:700;margin:2px 0;">${p.nombre}</div>
                        <div style="font-size:11.5px;color:#34d399;font-weight:800;">${fmtCRC(p.precioCRC)} <span style="color:#2dd4bf;">| ${p.precioEco}${c.simboloEco}</span></div>
                      </button>
                    `).join("")}
                  </div>
                </div>
              </div>

              <!-- Carrito, Cobro y Facturación QR SHA-256 -->
              <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#34d399;">🧾 Caja y Factura ${c.nombre}</h3>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;min-height:90px;">
                  ${carrito.map((it, idx) => `
                    <div style="background:#0b1322;padding:8px;border-radius:7px;display:flex;justify-content:space-between;align-items:center;font-size:12px;">
                      <div><b>${it.qty}× ${it.nombre}</b><div style="font-size:10.5px;color:#94a3b8;">${fmtCRC(it.precioCRC * it.qty)} | ${it.precioEco * it.qty} ${c.simboloEco}</div></div>
                      <button data-rm="${idx}" class="pos-rm" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">✕</button>
                    </div>
                  `).join("") || `<div style="color:#64748b;font-size:12px;text-align:center;padding:18px;">Agrega productos para facturar.</div>`}
                </div>

                <div style="border-top:1px solid #1e293b;padding-top:10px;margin-bottom:10px;">
                  <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;margin-bottom:6px;">
                    <span>Total Colones:</span><span style="color:#34d399;">${fmtCRC(totalCRC)}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;margin-bottom:10px;color:#2dd4bf;">
                    <span>Canje ${c.monedaEco}:</span><span>${totalEco} ${c.simboloEco}</span>
                  </div>
                  <select id="pos-met" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;margin-bottom:10px;">
                    <option value="SALDO_QR" ${metodoPago==="SALDO_QR"?"selected":""}>💳 Cobrar con Saldo QR (${fmtCRC(totalCRC)})</option>
                    <option value="ECOMEPS" ${metodoPago==="ECOMEPS"?"selected":""}>${c.simboloEco} Canjear con ${c.monedaEco} (${totalEco} ${c.simboloEco})</option>
                    <option value="EFECTIVO" ${metodoPago==="EFECTIVO"?"selected":""}>💵 Pago en Efectivo (${fmtCRC(totalCRC)})</option>
                    <option value="SINPE" ${metodoPago==="SINPE"?"selected":""}>📲 Pago SINPE Móvil (${c.sinpeCoope})</option>
                  </select>
                  <button id="pos-pay" ${!carrito.length?"disabled":""} style="width:100%;background:#059669;color:#fff;border:none;padding:11px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;">✅ Cobrar y Emitir Factura QR SHA-256</button>
                </div>

                <div style="border-top:1px solid #1e293b;padding-top:10px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <b style="font-size:11.5px;color:#94a3b8;">Últimas facturas (${sales.length})</b>
                    <button id="pos-csv" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">📥 CSV Ventas</button>
                  </div>
                  ${sales.slice(0, 4).map(s => `<div style="font-size:11px;padding:4px 0;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;"><span>${s.id} • ${s.cliente} (${s.metodo})</span><button data-fac="${s.id}" class="pos-fac" style="background:#1d4ed8;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10.5px;cursor:pointer;">🖨️</button></div>`).join("")}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "reciclaje" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">♻️ Programa de Reciclaje ${c.simboloEco} ${c.monedaEco}</h3>
                <p style="margin:0 0 10px;font-size:12px;color:#cbd5e1;">Cada material reciclado suma <b>${c.monedaEco}</b> directamente al Carné QR estudiantil (<b>1 ${c.simboloEco} = ${fmtCRC(c.valorEcoCRC)}</b> canjeables en ${c.nombre}).</p>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
                  ${MATERIALES_RECICLAJE.map(m => `<div style="background:#0b1322;padding:8px 10px;border-radius:8px;display:flex;justify-content:space-between;font-size:12px;"><span>${m.ic} ${m.nom}</span><b style="color:#2dd4bf;">+${m.eco} ${c.simboloEco}</b></div>`).join("")}
                </div>
                ${esOperador ? `
                  <form id="rec-f" style="display:flex;flex-direction:column;gap:8px;border-top:1px solid #1e293b;padding-top:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;"><b style="font-size:12.5px;color:#38bdf8;">Registrar Entrega de Reciclaje</b><button type="button" id="rec-qr" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer;">📷 QR Estudiante</button></div>
                    <select id="rc-est" required style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
                      ${wallets.map(w => `<option value="${w.id}">${w.nombre} (${w.seccion} • ${w.ecoPuntos} ${c.simboloEco})</option>`).join("")}
                    </select>
                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;">
                      <select id="rc-mat" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
                        ${MATERIALES_RECICLAJE.map(m => `<option value="${m.id}">${m.ic} ${m.nom} (+${m.eco})</option>`).join("")}
                      </select>
                      <input id="rc-qty" type="number" min="1" max="100" value="1" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;"/>
                    </div>
                    <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">🌿 Acreditar ${c.monedaEco} al Carné QR</button>
                  </form>
                ` : `<div style="background:#064e3b;color:#6ee7b7;padding:10px;border-radius:8px;font-size:12px;">Lleva tus botellas, papel o latas al puesto de <b>${c.nombre}</b> y muestra tu QR para sumar <b>${c.monedaEco}</b>.</div>`}
              </div>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#2dd4bf;">🏆 Historial de Reciclaje (${recycles.length})</h3>
                <div style="display:flex;flex-direction:column;gap:7px;max-height:360px;overflow-y:auto;">
                  ${recycles.slice(0, 20).map(r => `<div style="background:#0b1322;padding:9px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;font-size:12px;"><div><b>${r.nombre}</b><div style="font-size:11px;color:#94a3b8;">${r.qty}× ${r.material} • ${r.fecha}</div></div><b style="color:#34d399;">+${r.ecoGanados} ${c.simboloEco}</b></div>`).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin entregas registradas todavía.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "productos" && esOperador ? `
            <form id="pr-crud-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:13px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px;">
              <input id="pc-sku" type="text" required value="${editProd?editProd.sku:''}" placeholder="Código / SKU" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="pc-nom" type="text" required value="${editProd?editProd.nombre:''}" placeholder="Nombre producto" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="pc-cat" type="text" required value="${editProd?editProd.cat:'Librería'}" placeholder="Categoría" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="pc-crc" type="number" min="0" required value="${editProd?editProd.precioCRC:500}" placeholder="Precio ₡" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="pc-eco" type="number" min="0" required value="${editProd?editProd.precioEco:50}" placeholder="Precio ${c.monedaEco}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="pc-stk" type="number" min="0" required value="${editProd?editProd.stock:50}" placeholder="Stock" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-weight:700;cursor:pointer;">${editProd?"💾 Actualizar":"+ Guardar Producto"}</button>
            </form>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:620px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">SKU / Producto</th><th style="padding:7px;">Categoría</th><th style="padding:7px;">Precio ₡</th><th style="padding:7px;">${c.monedaEco}</th><th style="padding:7px;">Stock</th><th style="padding:7px;">Acciones</th></tr>
                ${prods.map(p => `<tr><td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${p.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${p.sku}</span></td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${p.cat}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#34d399;font-weight:700;">${fmtCRC(p.precioCRC)}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:#2dd4bf;">${p.precioEco} ${c.simboloEco}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${p.stock}</td><td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><button data-pe="${p.id}" class="pc-ed" style="background:#1d4ed8;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:11px;cursor:pointer;">✏️</button> <button data-pd="${p.id}" class="pc-dl" style="background:#7f1d1d;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:11px;cursor:pointer;">🗑️</button></td></tr>`).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "config" && esOperador ? `
            <form id="co-cfg-f" style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
              <label style="grid-column:1/-1;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;cursor:pointer;">
                <input id="cc-on" type="checkbox" ${c.habilitada?"checked":""} style="width:18px;height:18px;"/>
                Habilitar Cooperativa Estudiantil en esta institución (desmarque si este centro no tiene cooperativa)
              </label>
              <div><label style="font-size:11px;color:#94a3b8;">Nombre de la Cooperativa:</label><input id="cc-nom" type="text" value="${c.nombre}" required style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div><label style="font-size:11px;color:#94a3b8;">Nombre Moneda Reciclaje:</label><input id="cc-eco" type="text" value="${c.monedaEco}" required style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div><label style="font-size:11px;color:#94a3b8;">Equivalencia (₡ por 1 unidad Eco):</label><input id="cc-val" type="number" min="1" value="${c.valorEcoCRC}" required style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div><label style="font-size:11px;color:#94a3b8;">SINPE Móvil de la Cooperativa:</label><input id="cc-sp" type="text" value="${c.sinpeCoope}" required style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div style="grid-column:1/-1;"><button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">💾 Guardar Configuración Cooperativa</button></div>
            </form>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".cp-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-ct"); draw(); });

      if (tab === "pos" && esOperador) {
        document.getElementById("pos-sel-cli").onchange = (e) => { clienteActual = wallets.find(w => w.id === e.target.value) || null; draw(); };
        document.getElementById("pos-cam-cli").onclick = () => {
          if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible.");
          window.BDS_QR_CAMERA.openModal({
            title: "Escanear Carné QR del Estudiante",
            onScan: (code) => {
              const hit = findWalletByQR(code);
              if (hit) { clienteActual = hit; draw(); }
              else alert("Estudiante no encontrado en padrón de cooperativa: " + code);
            }
          });
        };
        document.getElementById("pos-cam-prd").onclick = () => {
          if (!window.BDS_QR_CAMERA) return alert("Cámara QR no disponible.");
          window.BDS_QR_CAMERA.openModal({
            title: "Escanear Código de Producto",
            onScan: (code) => {
              const p = loadProds().find(x => x.sku.toLowerCase() === code.trim().toLowerCase() || x.id.toLowerCase() === code.trim().toLowerCase());
              if (p) addToCart(p);
              else alert("Producto no encontrado para código: " + code);
            }
          });
        };
        if (document.getElementById("pos-rec")) document.getElementById("pos-rec").onclick = async () => {
          const m = prompt(`Monto a recargar en EFECTIVO para ${clienteActual.nombre} (en colones):`, "2000");
          const val = Math.max(0, Number(m || 0));
          if (!val) return;
          const ws = loadWallets(), w = ws.find(x => x.id === clienteActual.id);
          if (!w) return;
          w.saldoCRC += val; saveWallets(ws); clienteActual = w;
          const ss = loadSales(), id = "REC-" + String(ss.length + 1001);
          const hash = (await sha256Hex(`${id}|${w.email}|${val}`)).slice(0, 16);
          ss.unshift({ id, tipo: "RECARGA", fecha: new Date().toISOString().slice(0, 10), hora: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), cliente: w.nombre, email: w.email, metodo: "EFECTIVO", totalCRC: val, totalEco: 0, items: [{ nombre: "Recarga Saldo Cooperativa", qty: 1, precioCRC: val, precioEco: 0 }], cajero: sesion.nombre, hash });
          saveSales(ss);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(`💵 Recarga ${c.nombre}`, `Se acreditaron ${fmtCRC(val)} a ${w.nombre}.`);
          draw();
        };
        shell.querySelectorAll(".pos-add").forEach(b => b.onclick = () => { const p = prods.find(x => x.id === b.getAttribute("data-pid")); if (p) addToCart(p); });
        shell.querySelectorAll(".pos-rm").forEach(b => b.onclick = () => { carrito.splice(Number(b.getAttribute("data-rm")), 1); draw(); });
        document.getElementById("pos-met").onchange = (e) => { metodoPago = e.target.value; };
        document.getElementById("pos-pay").onclick = async () => {
          if (!carrito.length) return;
          const ws = loadWallets();
          const w = clienteActual ? ws.find(x => x.id === clienteActual.id) : null;
          if ((metodoPago === "SALDO_QR" || metodoPago === "ECOMEPS") && !w) {
            return alert("Escanea o selecciona primero al estudiante para pagar con Saldo QR o EcoMEPs.");
          }
          if (w) {
            const pr = getParentalRule(w.email);
            if (!pr.allowCoope) return alert("🚫 Control Parental activo: las compras en cooperativa están bloqueadas para este estudiante.");
            if (pr.dailyLimitCRC > 0 && metodoPago !== "ECOMEPS" && (checkSpentToday(w.email) + totalCRC) > pr.dailyLimitCRC) {
              return alert(`🛡️ Control Parental: esta compra supera el límite diario autorizado de ${fmtCRC(pr.dailyLimitCRC)}.`);
            }
            if (metodoPago === "SALDO_QR") {
              if (w.saldoCRC < totalCRC) return alert(`Saldo insuficiente (${fmtCRC(w.saldoCRC)}). Recargue en efectivo o use otro método.`);
              w.saldoCRC -= totalCRC;
              w.gastoMes = Number(w.gastoMes || 0) + totalCRC;
            } else if (metodoPago === "ECOMEPS") {
              if (w.ecoPuntos < totalEco) return alert(`${c.monedaEco} insuficientes (${w.ecoPuntos} ${c.simboloEco}).`);
              w.ecoPuntos -= totalEco;
            }
            saveWallets(ws); clienteActual = w;
          }
          // Descontar inventario
          const ps = loadProds();
          carrito.forEach(it => { const pr = ps.find(x => x.id === it.id); if (pr && pr.stock > 0) pr.stock = Math.max(0, pr.stock - it.qty); });
          saveProds(ps);

          const ss = loadSales(), id = "FAC-" + String(ss.length + 1001);
          const fecha = new Date().toISOString().slice(0, 10), hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          const metLbl = metodoPago === "ECOMEPS" ? `Canje ${c.monedaEco}` : metodoPago;
          const hash = (await sha256Hex(`${id}|${fecha}|${totalCRC}|${w ? w.email : "CONTADO"}`)).slice(0, 16);
          const venta = { id, tipo: "VENTA", fecha, hora, cliente: w ? w.nombre : "Cliente de Contado", email: w ? w.email : "contado@coope", metodo: metLbl, totalCRC, totalEco, items: carrito.slice(), cajero: sesion.nombre, hash };
          ss.unshift(venta); saveSales(ss);
          carrito = [];
          if (ganarXP) ganarXP(10);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(`🧾 Factura ${id} — ${c.nombre}`, `Cobro completado (${metLbl}).`);
          imprimirFacturaCoope(venta, c, generarQRSVG);
          draw();
        };
        shell.querySelectorAll(".pos-fac").forEach(b => b.onclick = () => {
          const v = loadSales().find(x => x.id === b.getAttribute("data-fac"));
          if (v) imprimirFacturaCoope(v, c, generarQRSVG);
        });
        document.getElementById("pos-csv").onclick = () => {
          const rows = [["FACTURA","TIPO","FECHA","HORA","CLIENTE","METODO","TOTAL_CRC","TOTAL_ECO","SHA256"], ...loadSales().map(s => [s.id, s.tipo, s.fecha, s.hora, s.cliente, s.metodo, s.totalCRC, s.totalEco, s.hash])];
          const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
          const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = "ventas-cooperativa.csv"; a.click();
        };
      }

      if (tab === "reciclaje" && esOperador) {
        if (document.getElementById("rec-qr")) document.getElementById("rec-qr").onclick = () => {
          if (!window.BDS_QR_CAMERA) return;
          window.BDS_QR_CAMERA.openModal({
            title: "Escanear QR para Reciclaje",
            onScan: (code) => {
              const hit = findWalletByQR(code);
              if (hit && document.getElementById("rc-est")) document.getElementById("rc-est").value = hit.id;
            }
          });
        };
        if (document.getElementById("rec-f")) document.getElementById("rec-f").onsubmit = async (e) => {
          e.preventDefault();
          const wid = document.getElementById("rc-est").value;
          const mid = document.getElementById("rc-mat").value;
          const qty = Math.max(1, Number(document.getElementById("rc-qty").value || 1));
          const mat = MATERIALES_RECICLAJE.find(m => m.id === mid) || MATERIALES_RECICLAJE[0];
          const ws = loadWallets(), w = ws.find(x => x.id === wid);
          if (!w) return;
          const ganados = mat.eco * qty;
          w.ecoPuntos = Number(w.ecoPuntos || 0) + ganados;
          saveWallets(ws);
          const rs = loadRecycles();
          rs.unshift({ id: "REC-" + Date.now(), fecha: new Date().toISOString().slice(0, 10), hora: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }), nombre: w.nombre, email: w.email, material: mat.nom, qty, ecoGanados: ganados });
          saveRecycles(rs);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify(`♻️ +${ganados} ${c.monedaEco}`, `${w.nombre} recicló ${qty}× ${mat.nom}.`);
          draw();
        };
      }

      if (tab === "productos" && esOperador) {
        document.getElementById("pr-crud-f").onsubmit = (e) => {
          e.preventDefault();
          const ps = loadProds();
          const obj = {
            sku: document.getElementById("pc-sku").value.trim(),
            nombre: document.getElementById("pc-nom").value.trim(),
            cat: document.getElementById("pc-cat").value.trim(),
            precioCRC: Number(document.getElementById("pc-crc").value || 0),
            precioEco: Number(document.getElementById("pc-eco").value || 0),
            stock: Number(document.getElementById("pc-stk").value || 0)
          };
          if (editProdId) {
            const idx = ps.findIndex(x => x.id === editProdId);
            if (idx >= 0) ps[idx] = { ...ps[idx], ...obj };
            editProdId = null;
          } else {
            ps.unshift({ id: "P-" + String(Date.now()).slice(-4), ...obj });
          }
          saveProds(ps); draw();
        };
        shell.querySelectorAll(".pc-ed").forEach(b => b.onclick = () => { editProdId = b.getAttribute("data-pe"); draw(); });
        shell.querySelectorAll(".pc-dl").forEach(b => b.onclick = () => {
          if (confirm("¿Eliminar este producto?")) { saveProds(loadProds().filter(x => x.id !== b.getAttribute("data-pd"))); draw(); }
        });
      }

      if (tab === "config" && esOperador) {
        document.getElementById("co-cfg-f").onsubmit = (e) => {
          e.preventDefault();
          saveCfg({
            habilitada: document.getElementById("cc-on").checked,
            nombre: document.getElementById("cc-nom").value.trim() || "Coopeconvivir R.L.",
            monedaEco: document.getElementById("cc-eco").value.trim() || "EcoMEPs",
            simboloEco: "🌿",
            valorEcoCRC: Math.max(1, Number(document.getElementById("cc-val").value || 10)),
            sinpeCoope: document.getElementById("cc-sp").value.trim() || "8888-0000"
          });
          alert("✅ Configuración de cooperativa guardada.");
          draw();
        };
      }
    }
    draw();
  };
})();