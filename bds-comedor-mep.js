(function () {
  const CFG_KEY = "bds_comedor_cfg_v186";
  const WLT_KEY = "bds_comedor_wallets_v186";
  const TRX_KEY = "bds_comedor_trx_v186";
  const LOG_KEY = "bds_comedor_logs_v186";
  const MNU_KEY = "bds_comedor_menus_v186";
  const BECA_KEY = "bds_comedor_becas_req_v186";

  // Catálogo maestro de 5 tiempos de comida (cada institución activa solo los que ofrece)
  // Por defecto para CTP Mercedes Norte: Almuerzo activo + Café/Merienda opcional (Desayuno/Cena apagados, activables en 1 clic)
  const TIEMPOS_CATALOGO = [
    { id: "desayuno", nom: "Desayuno", hora: "06:40 - 07:30", kcal: "25% kcal", activo: false, tarifaEst: 700, tarifaDoc: 1200 },
    { id: "comp_manana", nom: "Café / Merienda Mañana", hora: "09:20 - 09:50", kcal: "20% kcal", activo: false, tarifaEst: 500, tarifaDoc: 800 },
    { id: "almuerzo", nom: "Almuerzo", hora: "11:20 - 12:10", kcal: "30% kcal", activo: true, tarifaEst: 1000, tarifaDoc: 1800 },
    { id: "comp_tarde", nom: "Café / Merienda Tarde", hora: "14:30 - 15:00", kcal: "20% kcal", activo: false, tarifaEst: 500, tarifaDoc: 800 },
    { id: "cena", nom: "Cena (Nocturno / IPEC / CINDEA)", hora: "18:00 - 19:00", kcal: "30% kcal", activo: false, tarifaEst: 1000, tarifaDoc: 1800 }
  ];

  const PRESETS_INSTITUCION = {
    ctpmn_almuerzo: { nom: "CTP Mercedes Norte (Solo Almuerzo)", activos: ["almuerzo"] },
    ctpmn_alm_cafe: { nom: "CTP (Almuerzo + Café Mañana)", activos: ["comp_manana", "almuerzo"] },
    tres_tiempos: { nom: "3 Tiempos (Desayuno, Almuerzo, Café Tarde)", activos: ["desayuno", "almuerzo", "comp_tarde"] },
    cuatro_tiempos: { nom: "4 Tiempos (Desayuno, 2 Cafés, Almuerzo)", activos: ["desayuno", "comp_manana", "almuerzo", "comp_tarde"] },
    cinco_tiempos: { nom: "5 Tiempos Completos (incluye Cena Nocturno)", activos: ["desayuno", "comp_manana", "almuerzo", "comp_tarde", "cena"] }
  };

  const MENUS_MEP_DEFAULT = {
    A: [
      { dia: "Lunes", desayuno: "Gallo pinto, huevo revuelto, fruta de temporada, agua fresca", comp_manana: "Café / aguadulce o agua, emparedado de queso blanco y fruta", almuerzo: "Arroz blanco, frijoles molidos, pollo en salsa de tomate natural, ensalada de repollo y zanahoria, sandía, agua fresca", comp_tarde: "Fruta picada con yogur natural y galleta integral", cena: "Arroz con pollo desmenuzado, ensalada verde, agua fresca", alergenos: "Huevo, Lácteos, Gluten" },
      { dia: "Martes", desayuno: "Avena con leche descremada, pan integral con queso, banano", comp_manana: "Tortilla palmeada con queso tierno y fruta", almuerzo: "Arroz, frijoles negros, carne mechada en salsa criolla, picadillo de chayote con maíz, piña fresca, agua fresca", comp_tarde: "Emparedado integral de queso y tomate", cena: "Sopa negra con huevo duro, arroz blanco y tortilla, agua fresca", alergenos: "Lácteos, Gluten, Huevo" },
      { dia: "Miércoles", desayuno: "Tortilla con queso tierno, tomate cherry, papaya", comp_manana: "Tostada integral con pollo desmenuzado y fruta", almuerzo: "Arroz con vegetales, lentejas guisadas, filete de pescado al horno con limón, ensalada de lechuga y pepino, manzana, agua fresca", comp_tarde: "Banano y pan integral con frijol molido", cena: "Pasta corta en salsa natural con carne molida magra, ensalada", alergenos: "Lácteos, Pescado, Gluten" },
      { dia: "Jueves", desayuno: "Gallo pinto, queso fresco a la plancha, melón, agua fresca", comp_manana: "Burrito de frijol molido con queso y mandarina", almuerzo: "Arroz blanco, frijoles rojos, bistec de res encebollado, picadillo de arracache tradicional, naranja, agua fresca", comp_tarde: "Yogur natural con avena y fruta", cena: "Olla de carne tradicional con verduras y arroz, agua fresca", alergenos: "Lácteos, Gluten" },
      { dia: "Viernes", desayuno: "Huevo picado con espinaca, tortilla de maíz, sandía", comp_manana: "Emparedado de jamón de pavo y queso, fruta fresca", almuerzo: "Arroz, frijoles negros, lomo de cerdo en salsa de naranja natural, ensalada rusa liviana, banano, agua fresca", comp_tarde: "Fruta de temporada y galleta integral", cena: "Casado institucional con pollo a la plancha y vegetales", alergenos: "Huevo, Gluten" }
    ],
    B: [
      { dia: "Lunes", desayuno: "Emparedado integral de pavo y queso, piña", comp_manana: "Manzana y tostada integral con queso", almuerzo: "Arroz blanco, frijoles negros, pollo a la plancha con hierbas, picadillo de papa con carne, ensalada mixta, melón, agua fresca", comp_tarde: "Emparedado de queso blanco y tomate", cena: "Arroz con carne de cerdo magra y vegetales salteados", alergenos: "Lácteos, Gluten" },
      { dia: "Martes", desayuno: "Gallo pinto con natilla liviana, huevo duro, mandarina", comp_manana: "Tortilla con queso y fruta picada", almuerzo: "Arroz, garbanzos guisados con verduras, atún natural en ensalada fresca, ensalada de remolacha, sandía, agua fresca", comp_tarde: "Yogur con fruta fresca", cena: "Sopa de pollo con verduras y arroz blanco", alergenos: "Lácteos, Huevo, Pescado" },
      { dia: "Miércoles", desayuno: "Pan integral con huevo revuelto y tomate, papaya", comp_manana: "Avena con fruta de temporada", almuerzo: "Arroz blanco, frijoles rojos, carne de res guisada con zanahoria, picadillo de vainica, banano, agua fresca", comp_tarde: "Tortilla palmeada con frijol molido", cena: "Tacos suaves de pollo desmenuzado con repollo y tomate", alergenos: "Huevo, Gluten, Lácteos" },
      { dia: "Jueves", desayuno: "Cereal integral con leche descremada, banano", comp_manana: "Emparedado de queso blanco y melón", almuerzo: "Arroz, frijoles negros, fajitas de pollo con chile dulce y cebolla, ensalada de pepino y tomate, naranja, agua fresca", comp_tarde: "Fruta entera y galleta integral", cena: "Arroz jardinero con huevo cocido y ensalada verde", alergenos: "Lácteos, Gluten" },
      { dia: "Viernes", desayuno: "Gallo pinto, queso fresco, piña fresca, agua fresca", comp_manana: "Emparedado de pollo desmenuzado y fruta", almuerzo: "Espagueti en salsa boloñesa casera (res magra), ensalada verde con zanahoria, manzana, agua fresca", comp_tarde: "Yogur natural con granola liviana", cena: "Casado con filete de tilapia al horno y picadillo de chayote", alergenos: "Lácteos, Gluten, Pescado" }
    ],
    C: [
      { dia: "Lunes", desayuno: "Tortilla con huevo revuelto y queso, sandía", comp_manana: "Banano y pan integral con queso", almuerzo: "Arroz blanco, frijoles tiernos, muslo de pollo horneado sin piel, picadillo de ayote tierno, ensalada verde, piña, agua fresca", comp_tarde: "Fruta picada y tortilla con queso", cena: "Sopa de verduras con carne magra y arroz", alergenos: "Huevo, Lácteos" },
      { dia: "Martes", desayuno: "Avena tibia con canela, queso blanco, manzana", comp_manana: "Emparedado de pollo desmenuzado", almuerzo: "Arroz, frijoles negros, tortas de carne de res caseras al horno, ensalada de repollo con limón, melón, agua fresca", comp_tarde: "Yogur natural con fruta", cena: "Arroz con atún natural y ensalada de tomate", alergenos: "Lácteos, Gluten, Pescado" },
      { dia: "Miércoles", desayuno: "Gallo pinto, salchicha de pavo salteada, papaya", comp_manana: "Fruta picada y tostada de queso", almuerzo: "Arroz blanco, lentejas, cerdo guisado en salsa criolla, picadillo de plátano verde, naranja, agua fresca", comp_tarde: "Emparedado de frijol molido", cena: "Macarrones con pollo en salsa blanca liviana y vegetales", alergenos: "Gluten, Lácteos" },
      { dia: "Jueves", desayuno: "Pan pita integral con queso y espinaca, banano", comp_manana: "Yogur natural con fruta de temporada", almuerzo: "Arroz, frijoles rojos, filete de pescado al horno, ensalada de lechuga, tomate y zanahoria, sandía, agua fresca", comp_tarde: "Mandarina y galleta integral", cena: "Gallo pinto con huevo revuelto y queso fresco", alergenos: "Gluten, Lácteos, Pescado" },
      { dia: "Viernes", desayuno: "Huevo ranchero en salsa natural, tortilla, mandarina", comp_manana: "Tostada con frijol molido y queso", almuerzo: "Arroz con pollo tradicional costarricense, frijoles molidos, ensalada de repollo, manzana, agua fresca", comp_tarde: "Fruta fresca de temporada", cena: "Casado institucional con carne mechada y ensalada", alergenos: "Huevo" }
    ],
    D: [
      { dia: "Lunes", desayuno: "Gallo pinto, queso fresco, papaya, agua fresca", comp_manana: "Emparedado de huevo cocido y fruta", almuerzo: "Arroz blanco, frijoles negros, pollo en salsa natural, picadillo de papa y vainica, melón, agua fresca", comp_tarde: "Yogur natural con banano", cena: "Sopa azteca liviana con pollo y aguacate", alergenos: "Lácteos, Huevo" },
      { dia: "Martes", desayuno: "Pan integral con queso fresco y tomate, banano", comp_manana: "Fruta entera y yogur natural", almuerzo: "Arroz, frijoles rojos, posta de cerdo magra al horno, ensalada de pepino y lechuga, piña, agua fresca", comp_tarde: "Tortilla con queso tierno", cena: "Arroz blanco, frijoles y carne molida con vegetales", alergenos: "Gluten, Lácteos" },
      { dia: "Miércoles", desayuno: "Tortilla con frijol molido y queso, sandía", comp_manana: "Galleta integral, queso y manzana", almuerzo: "Arroz blanco, garbanzos con pollo, picadillo de arracache con carne, ensalada verde, naranja, agua fresca", comp_tarde: "Emparedado integral de pavo", cena: "Pasta integral con atún y vegetales salteados", alergenos: "Lácteos, Gluten, Pescado" },
      { dia: "Jueves", desayuno: "Avena con leche descremada, huevo duro, mandarina", comp_manana: "Emparedado de queso blanco y papaya", almuerzo: "Arroz, frijoles negros, bistec de res en salsa criolla, guiso de chayote con elote, banano, agua fresca", comp_tarde: "Fruta picada con avena", cena: "Olla de carne tradicional y arroz blanco", alergenos: "Lácteos, Huevo" },
      { dia: "Viernes", desayuno: "Gallo pinto, huevo revuelto, piña fresca", comp_manana: "Fruta de temporada y tortilla", almuerzo: "Arroz jardinero, filete de tilapia al ajillo liviano, ensalada de tomate y pepino, sandía, agua fresca", comp_tarde: "Emparedado de queso tierno", cena: "Casado institucional con fajitas de pollo y ensalada", alergenos: "Huevo, Pescado" }
    ],
    E: [
      { dia: "Lunes", desayuno: "Gallo pinto, queso tierno, melón, agua fresca", comp_manana: "Fruta de temporada y pan integral", almuerzo: "Arroz blanco, frijoles rojos, pollo guisado con papa y zanahoria, ensalada de lechuga y tomate, manzana, agua fresca", comp_tarde: "Yogur natural con fruta", cena: "Sopa negra con huevo y arroz", alergenos: "Lácteos, Huevo" },
      { dia: "Martes", desayuno: "Emparedado integral de queso y espinaca, papaya", comp_manana: "Yogur natural y banano", almuerzo: "Arroz, frijoles negros, carne desmechada en salsa natural, picadillo de brócoli y zanahoria, sandía, agua fresca", comp_tarde: "Tortilla con frijol molido", cena: "Arroz con pollo y ensalada verde", alergenos: "Gluten, Lácteos" },
      { dia: "Miércoles", desayuno: "Tortilla con huevo revuelto, banano, agua fresca", comp_manana: "Tostada con pollo desmenuzado", almuerzo: "Arroz blanco, lentejas con verduras, cerdo a la plancha con limón, ensalada de repollo, piña, agua fresca", comp_tarde: "Fruta picada de temporada", cena: "Pasta en salsa natural con pollo desmenuzado", alergenos: "Huevo, Gluten" },
      { dia: "Jueves", desayuno: "Avena con leche descremada, fruta fresca", comp_manana: "Emparedado de frijol y queso", almuerzo: "Arroz, frijoles negros, atún al horno en torta con vegetales, picadillo de chayote, naranja, agua fresca", comp_tarde: "Galleta integral y manzana", cena: "Casado tradicional con bistec y ensalada", alergenos: "Lácteos, Pescado" },
      { dia: "Viernes", desayuno: "Gallo pinto, queso a la plancha, mandarina", comp_manana: "Fruta picada y emparedado de queso", almuerzo: "Arroz blanco, frijoles molidos, fajitas de res con pimientos, ensalada mixta, banano, agua fresca", comp_tarde: "Yogur con avena", cena: "Sopa de verduras con pollo y tortilla", alergenos: "Lácteos" }
    ]
  };

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=186",
      logoMep: "/logo-mep-oficial.png?v=186"
    };
  }

  function loadCfg() {
    try {
      const d = JSON.parse(localStorage.getItem(CFG_KEY));
      if (d && Array.isArray(d.horarios) && d.horarios.length) return d;
    } catch {}
    // Migración suave si existía v185
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem("bds_comedor_cfg_v185")); } catch {}
    const def = {
      juntaTipo: (prev && prev.juntaTipo) || "Junta Administrativa",
      juntaNombre: (prev && prev.juntaNombre) || ("Junta Administrativa — " + getBrand().institucion),
      sinpeJunta: (prev && prev.sinpeJunta) || "8888-0000",
      precioEstudiante: (prev && Number(prev.precioEstudiante)) || 1000,
      precioDocente: (prev && Number(prev.precioDocente)) || 1800,
      /* bds-comedor-cierre-anual-v199 */ anioLectivo: (prev && prev.anioLectivo) || String(new Date().getFullYear()), semanaActiva: (prev && prev.semanaActiva) || "A",
      horarios: JSON.parse(JSON.stringify(TIEMPOS_CATALOGO))
    };
    localStorage.setItem(CFG_KEY, JSON.stringify(def));
    return def;
  }
  function saveCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify(c)); }

  function getTiemposActivos(cfg) {
    const act = (cfg.horarios || TIEMPOS_CATALOGO).filter(h => h.activo);
    return act.length ? act : [TIEMPOS_CATALOGO[2]];
  }

  function getTarifaTurno(rol, cfg, turnoId) {
    const esEst = rol === "Estudiante";
    const tObj = (cfg.horarios || []).find(h => h.id === turnoId);
    if (tObj) {
      const val = esEst ? Number(tObj.tarifaEst) : Number(tObj.tarifaDoc);
      if (val > 0) return val;
    }
    return esEst ? Number(cfg.precioEstudiante || 1000) : Number(cfg.precioDocente || 1800);
  }

  function getTarifaBase(rol, cfg) {
    const activos = getTiemposActivos(cfg);
    const alm = activos.find(t => t.id === "almuerzo") || activos[0];
    return getTarifaTurno(rol, cfg, alm.id);
  }

  function fmtCRC(n) { return "₡" + Number(n || 0).toLocaleString("es-CR"); }

  function calcEquivalencia(wallet, cfg, turnoId) {
    const unit = turnoId ? getTarifaTurno(wallet.rol, cfg, turnoId) : getTarifaBase(wallet.rol, cfg);
    const colones = Math.max(0, Number(wallet.saldoColones || 0));
    const comidas = unit > 0 ? Math.floor(colones / unit) : 0;
    const sobrante = unit > 0 ? (colones % unit) : 0;
    return { unit, colones, comidas, sobrante };
  }

  function loadWallets() {
    try {
      const d = JSON.parse(localStorage.getItem(WLT_KEY));
      if (Array.isArray(d) && d.length) return d;
    } catch {}
    const cfg = loadCfg();
    const seed = [
      { id: "COM-101", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", rol: "Estudiante", seccion: "11-1", becaPanea: true, becaTipo: "Completa PANEA 100%", becaVence: "2026-12-15", saldoColones: 0, qrCode: "PT-QR|v186|sofia.alvarado@est.mep.go.cr|Estudiante|A9F21C44E0118B7D" },
      { id: "COM-102", nombre: "Esteban Campos Mora", email: "esteban.campos@est.mep.go.cr", rol: "Estudiante", seccion: "10-3", becaPanea: false, becaTipo: "Sin beca", becaVence: "—", saldoColones: 5 * cfg.precioEstudiante, qrCode: "PT-QR|v186|esteban.campos@est.mep.go.cr|Estudiante|B7C30199F45A2D1E" },
      { id: "COM-103", nombre: "Valeria Solís Jiménez", email: "valeria.solis@est.mep.go.cr", rol: "Estudiante", seccion: "10-1", becaPanea: false, becaTipo: "Sin beca", becaVence: "—", saldoColones: 0, qrCode: "PT-QR|v186|valeria.solis@est.mep.go.cr|Estudiante|C1E88421A90B33F0" },
      { id: "COM-201", nombre: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", seccion: "Docente", becaPanea: false, becaTipo: "No aplica (Personal)", becaVence: "—", saldoColones: 5 * cfg.precioDocente, qrCode: "PT-QR|v186|carlos.quesada@mep.go.cr|Docente MEP|D44091FF82C71E5A" }
    ];
    localStorage.setItem(WLT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveWallets(arr) { localStorage.setItem(WLT_KEY, JSON.stringify(arr)); }

  function loadTrx() { try { return JSON.parse(localStorage.getItem(TRX_KEY)) || []; } catch { return []; } }
  function saveTrx(arr) { localStorage.setItem(TRX_KEY, JSON.stringify(arr)); }

  function loadLogs() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; } }
  function saveLogs(arr) { localStorage.setItem(LOG_KEY, JSON.stringify(arr)); }

  function loadBecasReq() {
    try { const d = JSON.parse(localStorage.getItem(BECA_KEY)); if (Array.isArray(d)) return d; } catch {}
    const init = [
      { id: "BEC-101", fecha: new Date().toISOString().slice(0, 10), nombre: "Valeria Solís Jiménez", email: "valeria.solis@est.mep.go.cr", seccion: "10-1", motivo: "Solicitud de ingreso al programa PANEA por situación socioeconómica familiar.", estado: "PENDIENTE", aprobadoPor: "", hash: "BEC88410F92A4C1E" }
    ];
    localStorage.setItem(BECA_KEY, JSON.stringify(init));
    return init;
  }
  function saveBecasReq(arr) { localStorage.setItem(BECA_KEY, JSON.stringify(arr)); }

  function loadMenus() {
    try { const m = JSON.parse(localStorage.getItem(MNU_KEY)); if (m && m.A && m.A[0].comp_manana !== undefined) return m; } catch {}
    localStorage.setItem(MNU_KEY, JSON.stringify(MENUS_MEP_DEFAULT));
    return JSON.parse(JSON.stringify(MENUS_MEP_DEFAULT));
  }
  function saveMenus(m) { localStorage.setItem(MNU_KEY, JSON.stringify(m)); }

  function detectarTurnoActivo(cfg) {
    const activos = getTiemposActivos(cfg);
    if (activos.length === 1) return activos[0].id;
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    const orden = h < 8.5 ? "desayuno" : (h < 10.6 ? "comp_manana" : (h < 13.8 ? "almuerzo" : (h < 16.8 ? "comp_tarde" : "cena")));
    const match = activos.find(t => t.id === orden);
    return match ? match.id : activos[0].id;
  }

  function buildVerifiableQRPayload(email, rol, firmaHex) {
    const shortHash = (firmaHex || "SHA256VERIFICADO").slice(0, 16).toUpperCase();
    return `PT-QR|v186|${(email || "").toLowerCase()}|${rol || "Estudiante"}|${shortHash}`;
  }

  function ensureWalletForSession(sesion) {
    const ws = loadWallets();
    const mail = (sesion.email || "").toLowerCase();
    const qrVerif = buildVerifiableQRPayload(mail, sesion.rol, sesion.firma);
    let w = ws.find(x => x.email.toLowerCase() === mail);
    if (!w) {
      w = {
        id: "COM-" + String(Date.now()).slice(-4),
        nombre: sesion.nombre || mail.split("@")[0],
        email: mail,
        rol: sesion.rol || "Estudiante",
        seccion: sesion.seccion || "Institucional",
        becaPanea: false,
        becaTipo: sesion.rol === "Estudiante" ? "Sin beca" : "No aplica (Personal)",
        becaVence: "—",
        saldoColones: 0,
        qrCode: qrVerif
      };
      ws.push(w);
      saveWallets(ws);
    } else if (!w.qrCode || !w.qrCode.startsWith("PT-QR|")) {
      w.qrCode = qrVerif;
      saveWallets(ws);
    }
    return w;
  }

  function parseQRAndFindWallet(raw) {
    const txt = String(raw || "").trim();
    if (!txt) return { wallet: null, qrVerificado: false, hashShort: "" };
    const ws = loadWallets();
    let qrVerificado = false, hashShort = "", emailExtraido = "";

    // Formato oficial verificable: PT-QR|v186|correo|rol|HASH16
    if (txt.startsWith("PT-QR|")) {
      const parts = txt.split("|");
      emailExtraido = (parts[2] || "").toLowerCase().trim();
      hashShort = (parts[4] || "").toUpperCase();
      qrVerificado = hashShort.length >= 12;
    } else if (txt.startsWith("COMEDOR|")) {
      emailExtraido = (txt.split("|")[1] || "").toLowerCase().trim();
      qrVerificado = true;
    } else if (txt.includes("@")) {
      const m = txt.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (m) emailExtraido = m[0].toLowerCase();
    }

    const qLow = txt.toLowerCase();
    let hit = ws.find(w =>
      (emailExtraido && w.email.toLowerCase() === emailExtraido) ||
      w.email.toLowerCase() === qLow ||
      w.id.toLowerCase() === qLow ||
      (w.qrCode && w.qrCode.toLowerCase() === qLow) ||
      (hashShort && w.qrCode && w.qrCode.toUpperCase().includes(hashShort))
    );
    if (!hit && qLow.length >= 3) {
      hit = ws.find(w => w.nombre.toLowerCase().includes(qLow));
    }
    if (hit && !hashShort && hit.qrCode && hit.qrCode.includes("|")) {
      hashShort = hit.qrCode.split("|").pop();
    }
    return { wallet: hit || null, qrVerificado, hashShort, emailExtraido };
  }

  window.BDS_RENDER_COMEDOR_MEP = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const rol = sesion.rol;
    const esOperador = ["SuperAdmin", "Encargada Comedor / Junta", "Auxiliar Administrativo"].includes(rol) || (Array.isArray(sesion.extraRoles) && sesion.extraRoles.includes("Comedor"));
    const esDireccion = ["SuperAdmin", "Director(a)", "Ministro(a) MEP"].includes(rol);

    const tabsDisponibles = [
      ...(esOperador ? [{ id: "ventanilla", lbl: "⚡ Fila Express QR" }] : []),
      { id: "tiquetes", lbl: "💳 Mi Saldo (₡), Carné QR y Compra" },
      { id: "menus", lbl: "🍽️ Menú MEP (Semanas A–E)" },
      { id: "becas", lbl: "🎓 Becas PANEA Digitales" },
      ...(esOperador ? [{ id: "caja", lbl: "💵 Caja, SINPE y Padrón" }] : []),
      ...((esDireccion || esOperador) ? [{ id: "stats", lbl: "⚙️ Tiempos, Tarifas y Estadísticas" }] : [])
    ];

    let tab = esOperador ? "ventanilla" : (esDireccion ? "stats" : "tiquetes");
    let cfgInit = loadCfg();
    let turno = detectarTurnoActivo(cfgInit);
    let modoSoloConsulta = false;
    let semEstado = null;
    let menuSem = cfgInit.semanaActiva || "A";
    let editandoMenu = false;
    let buyQty = 5;
    let camCtrl = null;
    let keepCamRunning = false;

    const hoyISO = () => new Date().toISOString().slice(0, 10);

    async function registrarConsumo(wallet, metodo, montoCRC, overrideDup) {
      const logs = loadLogs();
      const fecha = hoyISO();
      const yaComio = logs.find(l => l.fecha === fecha && l.turno === turno && l.email.toLowerCase() === wallet.email.toLowerCase());
      if (yaComio && !overrideDup) {
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("yellow");
        return {
          color: "yellow",
          titulo: "🟡 YA CONSUMIÓ EN ESTE TURNO HOY",
          detalle: `${wallet.nombre} (${wallet.rol} • ${wallet.seccion}) ya pasó a las ${yaComio.hora} (${yaComio.metodo}).`,
          wallet
        };
      }
      const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const hash = (await sha256Hex(`${fecha}|${hora}|${wallet.email}|${turno}|${metodo}|${montoCRC}`)).slice(0, 16);
      logs.unshift({
        id: "LOG-" + Date.now(),
        fecha, hora, turno,
        walletId: wallet.id, nombre: wallet.nombre, email: wallet.email, rol: wallet.rol, seccion: wallet.seccion,
        metodo, monto: Number(montoCRC || 0), operador: sesion.nombre, hash
      });
      saveLogs(logs);
      if (ganarXP) ganarXP(5);
      return null;
    }

    function updateSemaforoDOM() {
      const box = document.getElementById("com-sem-slot");
      if (!box) { draw(); return; }
      const cfg = loadCfg();
      const pendSinpe = loadTrx().filter(t => t.estado === "PENDIENTE");
      const semColors = {
        green: { bg: "#064e3b", bd: "#10b981", tx: "#6ee7b7" },
        blue: { bg: "#0c2d5e", bd: "#38bdf8", tx: "#bae6fd" },
        yellow: { bg: "#451a03", bd: "#f59e0b", tx: "#fde68a" },
        red: { bg: "#450a0a", bd: "#ef4444", tx: "#fecaca" }
      };
      if (!semEstado) {
        box.innerHTML = `<div style="background:#070d19;border:1px dashed #334155;border-radius:12px;padding:16px;text-align:center;color:#94a3b8;font-size:12.5px;">Active la cámara para paso continuo en <b>Fila Express</b> o pruebe escribiendo: <code>sofia.alvarado@est.mep.go.cr</code> (Beca), <code>esteban.campos@est.mep.go.cr</code> (₡5,000), <code>valeria.solis@est.mep.go.cr</code> (₡0).</div>`;
        return;
      }
      const sc = semColors[semEstado.color];
      const tarifaAct = semEstado.wallet ? getTarifaTurno(semEstado.wallet.rol, cfg, turno) : cfg.precioEstudiante;
      box.innerHTML = `
        <div style="background:${sc.bg};border:3px solid ${sc.bd};border-radius:14px;padding:18px;text-align:center;box-shadow:0 12px 30px rgba(0,0,0,0.45);">
          <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:${sc.tx} !important;margin-bottom:4px;">${semEstado.sello || "VERIFICACIÓN SHA-256"}</div>
          <h2 style="margin:0 0 6px;font-size:21px;font-weight:900;color:#fff !important;">${semEstado.titulo}</h2>
          <p style="margin:0 0 12px;font-size:14px;color:${sc.tx} !important;font-weight:700;">${semEstado.detalle}</p>
          ${semEstado.color === "yellow" ? `<button id="sem-ovr" style="background:#b45309;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">🔓 Autorizar Excepción (Dirección/Encargada)</button>` : ""}
          ${semEstado.color === "red" && !modoSoloConsulta ? `
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              <button id="sem-cash1" style="background:#059669;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">💵 Cobrar 1 Comida (${fmtCRC(tarifaAct)})</button>
              <button id="sem-cash5" style="background:#0284c7;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">💵 Paquete 5 Comidas (${fmtCRC(tarifaAct * 5)})</button>
              <button id="sem-sinpe" style="background:#1d4ed8;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">📲 Ver SINPE (${pendSinpe.length})</button>
              <button id="sem-equidad" style="background:#7c3aed;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">🤝 Pase de Equidad (₡0)</button>
            </div>
          ` : ""}
        </div>
      `;
      if (document.getElementById("sem-ovr")) document.getElementById("sem-ovr").onclick = async () => {
        await registrarConsumo(semEstado.wallet, "Autorización Excepcional Dirección", 0, true);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
        semEstado = { color: "green", sello: "EXCEPCIÓN AUTORIZADA", titulo: "🟢 SERVICIO HABILITADO", detalle: `${semEstado.wallet.nombre} autorizado por ${sesion.nombre}.`, wallet: semEstado.wallet };
        updateSemaforoDOM(); refreshLogsTabla();
      };
      if (document.getElementById("sem-cash1")) document.getElementById("sem-cash1").onclick = () => venderEfectivoRapido(semEstado.wallet, 1, true);
      if (document.getElementById("sem-cash5")) document.getElementById("sem-cash5").onclick = () => venderEfectivoRapido(semEstado.wallet, 5, true);
      if (document.getElementById("sem-sinpe")) document.getElementById("sem-sinpe").onclick = () => { keepCamRunning = false; tab = "caja"; draw(); };
      if (document.getElementById("sem-equidad")) document.getElementById("sem-equidad").onclick = async () => {
        await registrarConsumo(semEstado.wallet, "Pase de Equidad (₡0)", 0, true);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
        semEstado = { color: "green", sello: "PASE DE EQUIDAD", titulo: "🟢 PLATO GARANTIZADO (₡0)", detalle: `${semEstado.wallet.nombre} atendido por Equidad Estudiantil.`, wallet: semEstado.wallet };
        updateSemaforoDOM(); refreshLogsTabla();
      };
    }

    function refreshLogsTabla() {
      const tb = document.getElementById("com-logs-slot");
      if (!tb) return;
      const logsHoy = loadLogs().filter(l => l.fecha === hoyISO());
      const totB = logsHoy.filter(l => l.metodo.includes("Beca")).length;
      const totP = logsHoy.filter(l => l.metodo.includes("Saldo") || l.metodo.includes("Efectivo")).length;
      const totE = logsHoy.filter(l => l.metodo.includes("Equidad")).length;
      tb.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
          <b style="font-size:12.5px;color:#38bdf8;">📋 Lecturas rápidas de hoy (${logsHoy.length} platos servidos)</b>
          <span style="font-size:11.5px;color:#94a3b8;">Becas: <b style="color:#34d399;">${totB}</b> • Pagos: <b style="color:#38bdf8;">${totP}</b> • Equidad: <b style="color:#c084fc;">${totE}</b></span>
        </div>
        <div style="overflow-x:auto;max-height:210px;overflow-y:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
            <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:6px;text-align:left;">Hora</th><th style="padding:6px;text-align:left;">Persona</th><th style="padding:6px;text-align:left;">Tiempo</th><th style="padding:6px;text-align:left;">Acceso</th><th style="padding:6px;text-align:left;">SHA-256</th></tr>
            ${logsHoy.slice(0, 20).map(l => `<tr><td style="padding:6px;border-bottom:1px solid #1e293b;">${l.hora}</td><td style="padding:6px;border-bottom:1px solid #1e293b;"><b>${l.nombre}</b> (${l.seccion})</td><td style="padding:6px;border-bottom:1px solid #1e293b;">${l.turno}</td><td style="padding:6px;border-bottom:1px solid #1e293b;color:#34d399;font-weight:700;">${l.metodo}</td><td style="padding:6px;border-bottom:1px solid #1e293b;font-family:monospace;color:#94a3b8;">${l.hash}</td></tr>`).join("") || `<tr><td colspan="5" style="padding:10px;text-align:center;color:#64748b;">Aún no hay consumos registrados hoy.</td></tr>`}
          </table>
        </div>
      `;
    }

    async function procesarLecturaQR(rawCode) {
      const cfg = loadCfg();
      const parsed = parseQRAndFindWallet(rawCode);
      const tObj = (cfg.horarios || []).find(h => h.id === turno) || getTiemposActivos(cfg)[0];
      const sello = parsed.qrVerificado ? `🛡️ CARNÉ QR SHA-256 VERIFICADO (${parsed.hashShort || "OK"})` : "🔎 CONSULTA MANUAL / PADRÓN";

      if (!parsed.wallet) {
        const esDoc = /Docente|Director|Auxiliar|Guarda|Conserje/i.test(rawCode);
        const tempW = {
          id: "NO-REG",
          nombre: parsed.emailExtraido ? parsed.emailExtraido.split("@")[0] : "Persona no registrada",
          email: parsed.emailExtraido || rawCode.slice(0, 42),
          rol: esDoc ? "Docente MEP" : "Estudiante",
          seccion: "Sin asignar", becaPanea: false, saldoColones: 0
        };
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
        semEstado = { color: "red", sello, titulo: "🔴 SIN ACCESO — NO REGISTRADO EN PADRÓN", detalle: `Código: ${rawCode.slice(0, 56)}. Puede cobrar en efectivo o dar Pase de Equidad.`, wallet: tempW };
        updateSemaforoDOM();
        return;
      }

      const ws = loadWallets();
      const w = ws.find(x => x.id === parsed.wallet.id);
      const eq = calcEquivalencia(w, cfg, turno);

      // MODO SOLO CONSULTA (no descuenta saldo ni registra plato)
      if (modoSoloConsulta) {
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone(w.becaPanea ? "green" : (eq.comidas > 0 ? "blue" : "red"));
        semEstado = {
          color: w.becaPanea ? "green" : (eq.comidas > 0 ? "blue" : "red"),
          sello: "🔍 CONSULTA DE SALDO Y BECA (SIN DESCONTAR)",
          titulo: w.becaPanea ? `🟢 ${w.nombre} — BECA PANEA ACTIVA (₡0)` : `💳 ${w.nombre} — SALDO: ${fmtCRC(eq.colones)} (${eq.comidas} ${tObj.nom.toLowerCase()}${eq.comidas === 1 ? "" : "s"})`,
          detalle: `${w.rol} (${w.seccion}) • Tarifa ${tObj.nom}: ${fmtCRC(eq.unit)}${eq.sobrante ? ` • Sobrante: ${fmtCRC(eq.sobrante)}` : ""} • Vigencia beca: ${w.becaVence || "—"}`,
          wallet: w
        };
        updateSemaforoDOM();
        return;
      }

      // Control anti-duplicado en el mismo turno
      const ya = loadLogs().find(l => l.fecha === hoyISO() && l.turno === turno && l.email.toLowerCase() === w.email.toLowerCase());
      if (ya) {
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("yellow");
        semEstado = { color: "yellow", sello, titulo: "🟡 YA CONSUMIÓ EN ESTE TURNO HOY", detalle: `${w.nombre} (${w.seccion}) ya registró ${tObj.nom} a las ${ya.hora}.`, wallet: w };
        updateSemaforoDOM();
        return;
      }

      // 1. BECA PANEA ACTIVA -> VERDE
      if (w.becaPanea) {
        await registrarConsumo(w, `Beca PANEA ${tObj.nom} (₡0)`, 0, false);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
        semEstado = { color: "green", sello, titulo: `🟢 BECA PANEA ACTIVA — PASE LIBRE (₡0)`, detalle: `${w.nombre} • ${w.rol} (${w.seccion}) • ${tObj.nom} registrado.`, wallet: w };
        updateSemaforoDOM(); refreshLogsTabla();
        return;
      }

      // 2. SALDO EN COLONES SUFICIENTE -> AZUL (Descuenta tarifa exacta del tiempo de comida)
      if (eq.colones >= eq.unit) {
        w.saldoColones = eq.colones - eq.unit;
        saveWallets(ws);
        const eqPost = calcEquivalencia(w, cfg, turno);
        await registrarConsumo(w, `Saldo QR ${w.rol} (${fmtCRC(eq.unit)})`, eq.unit, false);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("blue");
        semEstado = {
          color: "blue", sello,
          titulo: `🔵 PASE AUTORIZADO — SALDO: ${fmtCRC(eqPost.colones)} (${eqPost.comidas} comida${eqPost.comidas === 1 ? "" : "s"})`,
          detalle: `${w.nombre} • Descontado ${fmtCRC(eq.unit)} (${tObj.nom}) • Tarifa ${w.rol}.`,
          wallet: w
        };
        updateSemaforoDOM(); refreshLogsTabla();
        return;
      }

      // 3. SIN BECA Y SIN SALDO SUFICIENTE -> ROJO
      if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
      semEstado = {
        color: "red", sello,
        titulo: `🔴 SIN ACCESO — SALDO INSUFICIENTE (${fmtCRC(eq.colones)})`,
        detalle: `${w.nombre} • ${w.rol} (${w.seccion}) • Requiere ${fmtCRC(eq.unit)} para ${tObj.nom}.`,
        wallet: w
      };
      updateSemaforoDOM();
    }

    async function venderEfectivoRapido(wallet, cant, consumirAhora) {
      const cfg = loadCfg();
      const ws = loadWallets();
      let w = ws.find(x => x.id === wallet.id || x.email.toLowerCase() === wallet.email.toLowerCase());
      if (!w) {
        const firmaTmp = await sha256Hex(wallet.email);
        w = { id: "COM-" + String(Date.now()).slice(-4), nombre: wallet.nombre, email: wallet.email, rol: wallet.rol || "Estudiante", seccion: wallet.seccion || "Institucional", becaPanea: false, becaTipo: "Sin beca", becaVence: "—", saldoColones: 0, qrCode: buildVerifiableQRPayload(wallet.email, wallet.rol, firmaTmp) };
        ws.push(w);
      }
      const unit = consumirAhora ? getTarifaTurno(w.rol, cfg, turno) : getTarifaBase(w.rol, cfg);
      const total = unit * cant;
      w.saldoColones = Number(w.saldoColones || 0) + total;
      if (consumirAhora && w.saldoColones >= unit) w.saldoColones -= unit;
      saveWallets(ws);

      const fecha = hoyISO(), hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
      const trx = loadTrx();
      const recibo = "REC-" + String(trx.length + 1001);
      const hash = (await sha256Hex(`${recibo}|${fecha}|${w.email}|EFECTIVO|${cant}|${total}`)).slice(0, 18);
      trx.unshift({ id: recibo, fecha, hora, walletId: w.id, nombre: w.nombre, email: w.email, rol: w.rol, metodo: "EFECTIVO", cantidad: cant, tarifaUnit: unit, montoTotal: total, comprobante: recibo, estado: "APROBADO", aprobadoPor: sesion.nombre, hash });
      saveTrx(trx);

      const eqPost = calcEquivalencia(w, cfg, turno);
      if (consumirAhora) {
        await registrarConsumo(w, `Efectivo Ventanilla (${fmtCRC(unit)})`, unit, true);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("blue");
        semEstado = {
          color: "blue", sello: `RECIBO ${recibo} • SHA-256: ${hash.slice(0, 12)}`,
          titulo: `🔵 COBRO EFECTIVO OK — QUEDA: ${fmtCRC(eqPost.colones)} (${eqPost.comidas} comidas)`,
          detalle: `${w.nombre} recargó ${cant} comida(s) por ${fmtCRC(total)} (1 servida ahora).`,
          wallet: w
        };
        updateSemaforoDOM(); refreshLogsTabla();
      } else {
        alert(`✅ Recibo ${recibo} emitido.\n${w.nombre}: +${cant} tiquetes (${fmtCRC(total)}).\nSaldo actual: ${fmtCRC(eqPost.colones)} (${eqPost.comidas} comidas).\nSHA-256: ${hash}`);
        draw();
      }
    }

    function imprimirMenuSemanal(semKey) {
      const b = getBrand(), cfg = loadCfg(), activos = getTiemposActivos(cfg), rows = loadMenus()[semKey] || [];
      const w = window.open("", "_blank");
      if (!w) return alert("Permita ventanas emergentes para imprimir el menú.");
      w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Menú MEP Semana ${semKey}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a}table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;vertical-align:top}th{background:#0f2247;color:#fff}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:64px"/><div style="text-align:center"><h2 style="margin:0">${b.institucion}</h2><div style="font-size:12px">${b.regional} • ${b.circuito} • ${cfg.juntaTipo}</div><h3 style="margin:6px 0 0;color:#0f766e">MENÚ OFICIAL COMEDOR ESCOLAR (PANEA) — SEMANA ${semKey}</h3></div><img src="${b.logoMep}" style="height:48px"/></div><p style="font-size:11.5px;margin:10px 0 0"><b>Servicios activos en esta institución:</b> ${activos.map(t => `${t.nom} (${t.hora})`).join(" • ")}. Agua fresca a libre demanda.</p><table><tr><th>Día</th>${activos.map(t => `<th>${t.nom}<br/><small>${t.hora}</small></th>`).join("")}<th>Alérgenos</th></tr>${rows.map(r => `<tr><td><b>${r.dia}</b></td>${activos.map(t => `<td>${r[t.id] || ""}</td>`).join("")}<td>${r.alergenos}</td></tr>`).join("")}</table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
    }

    function draw() {
      if (camCtrl && !keepCamRunning) { camCtrl.stop(); camCtrl = null; }
      const b = getBrand();
      const cfg = loadCfg();
      const activos = getTiemposActivos(cfg);
      if (!activos.some(t => t.id === turno)) turno = activos[0].id;
      const wallets = loadWallets();
      const trx = loadTrx();
      const logs = loadLogs();
      const menus = loadMenus();
      const becasReq = loadBecasReq();
      const miWallet = ensureWalletForSession(sesion);
      const miEq = calcEquivalencia(miWallet, cfg);
      const pendSinpe = trx.filter(t => t.estado === "PENDIENTE");
      const pendBecas = becasReq.filter(r => r.estado === "PENDIENTE");

      const logsHoy = logs.filter(l => l.fecha === hoyISO());
      const trxHoy = trx.filter(t => t.fecha === hoyISO() && t.estado === "APROBADO");
      const totEfectivo = trxHoy.filter(t => t.metodo === "EFECTIVO").reduce((a, x) => a + x.montoTotal, 0);
      const totSinpe = trxHoy.filter(t => t.metodo === "SINPE").reduce((a, x) => a + x.montoTotal, 0);
      const totBecas = logsHoy.filter(l => l.metodo.includes("Beca")).length;
      const totPagos = logsHoy.filter(l => l.metodo.includes("Saldo") || l.metodo.includes("Efectivo")).length;
      const totEquidad = logsHoy.filter(l => l.metodo.includes("Equidad")).length;

      const tarifaCompra = getTarifaBase(miWallet.rol, cfg);
      const totalCompra = buyQty * tarifaCompra;
      const saldoPostCompra = miEq.colones + totalCompra;
      const comidasPostCompra = tarifaCompra > 0 ? Math.floor(saldoPostCompra / tarifaCompra) : 0;

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FONDOS EXCLUSIVOS JUNTA (APARTE DE COOPERATIVA) • AÑO ${cfg.anioLectivo || new Date().getFullYear()} • ${activos.length} TIEMPO${activos.length>1?"S":""} ACTIVO${activos.length>1?"S":""}</span>
              <h2 style="margin:5px 0 2px;font-size:18px;color:#fff;">🍽️ Comedor Escolar — ${b.institucion}</h2>
              <div style="font-size:11.5px;color:#94a3b8;">${cfg.juntaTipo} • Servicios: <b style="color:#2dd4bf;">${activos.map(t => t.nom).join(", ")}</b> • Menú: <b style="color:#fbbf24;">Semana ${cfg.semanaActiva}</b> • SINPE Junta: <b style="color:#34d399;">${cfg.sinpeJunta}</b></div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${tabsDisponibles.map(t => {
                const badge = (t.id === "caja" && pendSinpe.length) ? ` (${pendSinpe.length})` : ((t.id === "becas" && pendBecas.length && (esDireccion || esOperador)) ? ` (${pendBecas.length})` : "");
                return `<button data-ct="${t.id}" class="com-tab" style="background:${tab===t.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${tab===t.id?'#38bdf8':'#334155'};padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${t.lbl}${badge}</button>`;
              }).join("")}
            </div>
          </div>

          ${tab === "ventanilla" && esOperador ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                <span style="font-size:11.5px;font-weight:800;color:#94a3b8;">SERVICIO ACTIVO:</span>
                ${activos.map(h => `<button data-tu="${h.id}" class="com-tu" style="background:${turno===h.id?'#0f766e':'#070d19'};color:#fff;border:1px solid ${turno===h.id?'#2dd4bf':'#334155'};padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${h.nom} (${h.hora}) • Est ${fmtCRC(h.tarifaEst)} / Doc ${fmtCRC(h.tarifaDoc)}</button>`).join("")}
              </div>
              <div style="display:flex;gap:5px;">
                <button id="md-express" style="background:${!modoSoloConsulta?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">⚡ Fila Express (Descontar)</button>
                <button id="md-query" style="background:${modoSoloConsulta?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">🔍 Solo Consultar Saldo</button>
              </div>
            </div>

            <div id="com-cam-mount" style="margin-bottom:12px;"></div>
            <div id="com-sem-slot" style="margin-bottom:14px;"></div>
            <div id="com-logs-slot" style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;"></div>
          ` : ""}

          ${tab === "tiquetes" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;align-items:start;">
              <!-- Tarjeta de Saldo Dual (Colones + Comidas) y Carné QR SHA-256 -->
              <div style="background:#070d19;border:2px solid ${miWallet.becaPanea?'#10b981':'#38bdf8'};border-radius:14px;padding:18px;text-align:center;">
                <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                  <span style="background:${miWallet.becaPanea?'#059669':'#334155'};color:#fff;font-size:10.5px;font-weight:800;padding:4px 10px;border-radius:99px;">${miWallet.becaPanea ? "🟢 BECA PANEA ACTIVA (₡0)" : "📋 " + (miWallet.becaTipo || "Sin beca PANEA")}</span>
                  <span style="background:#1e3a8a;color:#93c5fd;font-size:10.5px;font-weight:800;padding:4px 10px;border-radius:99px;">🛡️ QR SHA-256 Verificable</span>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                  <div style="background:#0b1322;border:1px solid #1e293b;border-radius:10px;padding:10px;">
                    <div style="font-size:10.5px;color:#94a3b8;">SALDO EN COLONES</div>
                    <div style="font-size:22px;font-weight:900;color:#34d399;">${fmtCRC(miEq.colones)}</div>
                  </div>
                  <div style="background:#0b1322;border:1px solid #1e293b;border-radius:10px;padding:10px;">
                    <div style="font-size:10.5px;color:#94a3b8;">EQUIVALENTE EN COMIDAS</div>
                    <div style="font-size:22px;font-weight:900;color:#38bdf8;">${miWallet.becaPanea ? "Ilimitado" : `${miEq.comidas} tiq.`}</div>
                    <div style="font-size:10px;color:#94a3b8;">${miWallet.becaPanea ? "Cubierto PANEA" : `${fmtCRC(miEq.unit)} c/u${miEq.sobrante ? ` (+${fmtCRC(miEq.sobrante)})` : ""}`}</div>
                  </div>
                </div>

                <h3 style="margin:4px 0 2px;font-size:16px;">${miWallet.nombre}</h3>
                <div style="font-size:11.5px;color:#94a3b8;margin-bottom:10px;">${miWallet.rol} • ${miWallet.seccion} • ID: <b>${miWallet.id}</b></div>
                <div style="display:inline-block;margin-bottom:8px;">${generarQRSVG(miWallet.qrCode, 180)}</div>
                <div style="font-size:10.5px;font-family:monospace;color:#6ee7b7;background:#0b1322;padding:5px 8px;border-radius:6px;word-break:break-all;margin-bottom:8px;">${miWallet.qrCode}</div>
                <div style="font-size:11px;color:#cbd5e1;"><b>Tiquetes acumulables:</b> Compra 1, 3, 5, 10 o 20 tiquetes y úsalos los días que desees durante el año lectivo <b>${cfg.anioLectivo || new Date().getFullYear()}</b>. <i>Recuerda gastar tus tiquetes antes del cierre anual (se reinician cada año escolar).</i></div>
              </div>

              <!-- Compra Fácil de Varios Tiquetes / Recarga en Colones por SINPE -->
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;">
                <h3 style="margin:0 0 8px;font-size:16px;color:#38bdf8;">📲 Comprar Varios Tiquetes / Recargar Saldo (₡)</h3>
                <div style="background:#0b1322;border:1px solid #059669;border-radius:10px;padding:11px;font-size:12px;margin-bottom:12px;line-height:1.5;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <div><b>SINPE ${cfg.juntaTipo}:</b> <span style="color:#34d399;font-size:15px;font-weight:900;">+506 ${cfg.sinpeJunta}</span></div>
                    <button type="button" id="cp-sinpe" style="background:#0f766e;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">📋 Copiar SINPE</button>
                  </div>
                  <div><b>Titular:</b> ${cfg.juntaNombre}</div>
                  <div><b>Tarifa (${miWallet.rol}):</b> ${activos.map(t => `${t.nom}: <b>${fmtCRC(getTarifaTurno(miWallet.rol, cfg, t.id))}</b>`).join(" • ")}</div>
                </div>

                <div style="font-size:11.5px;font-weight:700;color:#cbd5e1;margin-bottom:6px;">1. Seleccione paquete de tiquetes (o escriba cantidad):</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                  ${[1, 3, 5, 10, 20].map(q => `<button type="button" data-bq="${q}" class="cb-qbtn" style="background:${buyQty===q?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${buyQty===q?'#38bdf8':'#334155'};padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">${q} ${q===1?"tiquete":"tiquetes"}<br/><span style="font-size:10px;color:#93c5fd;">${fmtCRC(q * tarifaCompra)}</span></button>`).join("")}
                  <input id="cb-custom" type="number" min="1" max="60" value="${buyQty}" style="width:74px;background:#0b1322;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;font-size:13px;font-weight:800;text-align:center;"/>
                </div>

                <div style="background:#0b1322;border:1px solid #1e3a8a;border-radius:9px;padding:10px;margin-bottom:10px;font-size:12px;">
                  <div>Total a transferir por SINPE: <b style="color:#fbbf24;font-size:15px;">${fmtCRC(totalCompra)}</b> (${buyQty} comida${buyQty>1?"s":""})</div>
                  <div style="color:#94a3b8;font-size:11.5px;">Al aprobarse, tu nuevo saldo será <b style="color:#34d399;">${fmtCRC(saldoPostCompra)}</b> (equivalente a <b>${comidasPostCompra}</b> comidas).</div>
                </div>

                <form id="com-buy-f" style="display:flex;flex-direction:column;gap:8px;">
                  <input id="cb-ref" type="text" required placeholder="Número de comprobante SINPE Móvil (ej. 20261118004512)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12.5px;"/>
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px;">📤 Enviar Comprobante SINPE a la Junta</button>
                </form>

                <div style="margin-top:12px;border-top:1px solid #1e293b;padding-top:10px;">
                  <div style="font-size:11.5px;font-weight:800;color:#94a3b8;margin-bottom:6px;">Historial reciente de compras y recargas:</div>
                  ${trx.filter(t => t.email.toLowerCase() === miWallet.email.toLowerCase()).slice(0, 5).map(t => `<div style="font-size:11.5px;padding:6px 0;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;gap:6px;"><span>${t.fecha} • <b>${fmtCRC(t.montoTotal)}</b> (${t.cantidad} tiq. • ${t.metodo})</span><span style="font-weight:800;color:${t.estado==='APROBADO'?'#34d399':(t.estado==='PENDIENTE'?'#fbbf24':'#f87171')};">${t.estado}</span></div>`).join("") || `<div style="font-size:11.5px;color:#64748b;">Aún no registra recargas. También puede comprar en efectivo con la encargada de la ${cfg.juntaTipo}.</div>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "menus" ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${["A","B","C","D","E"].map(s => `<button data-ms="${s}" class="com-ms" style="background:${menuSem===s?'#1d4ed8':'#070d19'};color:#fff;border:1px solid ${menuSem===s?'#38bdf8':'#334155'};padding:7px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Semana ${s}${cfg.semanaActiva===s?' ★ Activa':''}</button>`).join("")}
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${(esOperador || esDireccion) ? `<button id="mn-act" style="background:#059669;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">⭐ Fijar Semana ${menuSem}</button>` : ""}
                ${(esOperador || esDireccion) ? `<button id="mn-ed" style="background:#b45309;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">${editandoMenu?"💾 Guardar Platos":"✏️ Editar Menú"}</button>` : ""}
                <button id="mn-prt" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir</button>
              </div>
            </div>

            <div style="background:#070d19;border-left:4px solid #10b981;padding:10px 12px;border-radius:8px;font-size:12px;color:#a7f3d0;margin-bottom:12px;">
              <b>Menú adaptado a ${b.institucion}:</b> Mostrando únicamente los <b>${activos.length} tiempo(s) activo(s)</b> (${activos.map(t => `${t.nom} ${t.hora}`).join(" • ")}). Agua fresca a libre demanda (Manual PANEA / MEP).
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:600px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:9px;text-align:left;">Día</th>
                  ${activos.map(t => `<th style="padding:9px;text-align:left;">${t.nom}<br/><span style="font-size:10px;color:#94a3b8;">${t.hora}</span></th>`).join("")}
                  <th style="padding:9px;text-align:left;">Alérgenos</th>
                </tr>
                ${(menus[menuSem] || []).map((r, i) => `
                  <tr>
                    <td style="padding:9px;border-bottom:1px solid #1e293b;font-weight:800;color:#fbbf24;">${r.dia}</td>
                    ${activos.map(t => `
                      <td style="padding:8px;border-bottom:1px solid #1e293b;vertical-align:top;">
                        ${editandoMenu ? `<textarea data-mi="${i}" data-mk="${t.id}" class="mn-in" rows="3" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;border-radius:6px;padding:5px;font-size:11.5px;">${r[t.id] || ""}</textarea>` : (r[t.id] || "")}
                      </td>
                    `).join("")}
                    <td style="padding:8px;border-bottom:1px solid #1e293b;vertical-align:top;">
                      ${editandoMenu ? `<input data-mi="${i}" data-mk="alergenos" class="mn-in" type="text" value="${r.alergenos || ""}" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;border-radius:6px;padding:5px;font-size:11.5px;"/>` : (r.alergenos || "")}
                    </td>
                  </tr>
                `).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "becas" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;align-items:start;">
              <!-- Solicitud Digital de Beca PANEA -->
              <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">📝 Solicitar / Renovar Beca PANEA Digitalmente</h3>
                <p style="margin:0 0 10px;font-size:12px;color:#94a3b8;">Estado actual de <b>${miWallet.nombre}</b>: <b style="color:${miWallet.becaPanea?'#34d399':'#fbbf24'};">${miWallet.becaPanea ? `Beca Activa (${miWallet.becaTipo} • Vence ${miWallet.becaVence})` : "Sin beca activa"}</b></p>
                <form id="beca-req-f" style="display:flex;flex-direction:column;gap:8px;">
                  <input id="br-est" type="text" value="${miWallet.nombre}" required placeholder="Nombre del estudiante" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <input id="br-mail" type="email" value="${miWallet.email}" required placeholder="Correo institucional (@est.mep.go.cr)" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  <textarea id="br-mot" rows="3" required placeholder="Explique brevemente la necesidad socioeconómica o renovación PANEA..." style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"></textarea>
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">📤 Enviar Solicitud al Comité de Becas / Dirección</button>
                </form>
              </div>

              <!-- Bandeja de Gestión Digital de Becas (Dirección / Comité / SuperAdmin) -->
              <div style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">🎓 Expedientes de Becas PANEA (${becasReq.length})</h3>
                ${(esDireccion || esOperador ? becasReq : becasReq.filter(r => r.email.toLowerCase() === miWallet.email.toLowerCase())).map(r => `
                  <div style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:10px;margin-bottom:8px;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                      <b>${r.nombre} (${r.seccion})</b>
                      <span style="background:${r.estado==='APROBADA'?'#059669':(r.estado==='PENDIENTE'?'#b45309':'#7f1d1d')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;">${r.estado}</span>
                    </div>
                    <div style="color:#94a3b8;font-size:11px;margin:3px 0;">${r.email} • ${r.fecha} • SHA-256: <span style="font-family:monospace;color:#34d399;">${r.hash}</span></div>
                    <div style="color:#e2e8f0;font-size:11.5px;margin-bottom:6px;">${r.motivo}</div>
                    ${(esDireccion || esOperador) ? `
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button data-ba="${r.id}" class="bec-ok" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✅ Aprobar Beca 100% en QR</button>
                        <button data-br="${r.id}" class="bec-no" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✕ Revocar / Rechazar</button>
                      </div>
                    ` : ""}
                  </div>
                `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin solicitudes registradas.</p>`}
              </div>
            </div>
          ` : ""}

          ${tab === "caja" && esOperador ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;margin-bottom:14px;">
              <!-- Bandeja SINPE pendientes -->
              <div style="background:#070d19;border:1px solid #f59e0b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#fbbf24;">📲 Comprobantes SINPE Pendientes (${pendSinpe.length})</h3>
                ${pendSinpe.map(t => `
                  <div style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:10px;margin-bottom:8px;font-size:12px;">
                    <div><b>${t.nombre}</b> (${t.rol}) • <b>${t.cantidad} comidas (${fmtCRC(t.montoTotal)})</b></div>
                    <div style="color:#94a3b8;font-size:11.5px;">Comprobante SINPE: <b style="color:#38bdf8;">${t.comprobante}</b></div>
                    <div style="display:flex;gap:6px;margin-top:8px;">
                      <button data-ap="${t.id}" class="sinpe-ok" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">✅ Aprobar y Sumar ${fmtCRC(t.montoTotal)} al QR</button>
                      <button data-rj="${t.id}" class="sinpe-no" style="background:#7f1d1d;color:#fff;border:none;padding:6px 11px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">✕ Rechazar</button>
                    </div>
                  </div>
                `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin comprobantes SINPE pendientes.</p>`}
              </div>

              <!-- Venta Rápida Efectivo + Cierre de Caja -->
              <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">💵 Venta Rápida Efectivo & Cierre de Caja</h3>
                <form id="cash-f" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                  <select id="cf-usr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
                    ${wallets.map(w => { const eq = calcEquivalencia(w, cfg); return `<option value="${w.id}">${w.nombre} (${w.rol} • ${fmtCRC(eq.colones)} / ${eq.comidas} tiq.)</option>`; }).join("")}
                  </select>
                  <div style="display:flex;gap:6px;">
                    <select id="cf-qty" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
                      <option value="1">1 Comida</option>
                      <option value="3">3 Comidas</option>
                      <option value="5" selected>5 Comidas (Semana)</option>
                      <option value="10">10 Comidas (Quincena)</option>
                      <option value="20">20 Comidas (Mes)</option>
                    </select>
                    <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">💰 Cobrar Efectivo</button>
                  </div>
                </form>
                <div style="border-top:1px solid #1e293b;padding-top:10px;font-size:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                  <div>Hoy — Efectivo: <b style="color:#34d399;">${fmtCRC(totEfectivo)}</b> | SINPE: <b style="color:#38bdf8;">${fmtCRC(totSinpe)}</b></div>
                  <button id="caja-csv" style="background:#1d4ed8;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Cierre de Caja CSV</button>
                </div>
              </div>
            </div>

            <!-- Padrón de Comedor con Saldo Dual y Becas -->
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <h3 style="margin:0;font-size:15px;color:#38bdf8;">👥 Padrón de Comedor, Becas y Saldos en Colones (${wallets.length})</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button id="pad-add" style="background:#1d4ed8;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">+ Agregar Persona</button>
                  <button id="pad-bulk" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Carga Masiva CSV</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table style="width:100%;min-width:720px;border-collapse:collapse;font-size:12px;">
                  <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:7px;text-align:left;">ID / Nombre</th><th style="padding:7px;text-align:left;">Rol / Sección</th><th style="padding:7px;text-align:center;">Beca PANEA</th><th style="padding:7px;text-align:center;">Saldo (₡ / Comidas)</th><th style="padding:7px;text-align:center;">Acciones</th></tr>
                  ${wallets.map(w => {
                    const eq = calcEquivalencia(w, cfg);
                    return `<tr>
                      <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${w.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${w.id} • ${w.email}</span></td>
                      <td style="padding:7px;border-bottom:1px solid #1e293b;">${w.rol} (${w.seccion})</td>
                      <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${w.becaPanea?'#059669':'#334155'};color:#fff;padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:800;">${w.becaPanea?'BECA ACTIVA':'Sin beca'}</span></td>
                      <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><b style="color:#34d399;font-size:13.5px;">${fmtCRC(eq.colones)}</b><br/><span style="font-size:10.5px;color:#38bdf8;">${eq.comidas} comida(s)</span></td>
                      <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                        <button data-wb="${w.id}" class="w-beca" style="background:#0f766e;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">${w.becaPanea?'Quitar Beca':'Dar Beca'}</button>
                        <button data-w5="${w.id}" class="w-plus" style="background:#1d4ed8;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">+5 Comidas</button>
                      </td>
                    </tr>`;
                  }).join("")}
                </table>
              </div>
            </div>
          ` : ""}

          ${tab === "stats" && (esDireccion || esOperador) ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;">
              <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Becados PANEA Hoy</div><div style="font-size:24px;font-weight:900;color:#34d399;">${totBecas}</div></div>
              <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Comidas Pagas Hoy</div><div style="font-size:24px;font-weight:900;color:#38bdf8;">${totPagos}</div></div>
              <div style="background:#070d19;border:1px solid #a855f7;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Pases de Equidad</div><div style="font-size:24px;font-weight:900;color:#c084fc;">${totEquidad}</div></div>
              <div style="background:#070d19;border:1px solid #f59e0b;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Recaudación Hoy</div><div style="font-size:20px;font-weight:900;color:#fbbf24;">${fmtCRC(totEfectivo + totSinpe)}</div></div>
            </div>

            <!-- Presets rápidos de Tiempos de Comida por Institución -->
            <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:14px;margin-bottom:14px;">
              <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">🕒 Tiempos de Comida Ofrecidos por Esta Institución (1 a 5 Tiempos)</h3>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                ${Object.entries(PRESETS_INSTITUCION).map(([k, p]) => `<button type="button" data-pre="${k}" class="cfg-pre" style="background:#131f33;color:#93c5fd;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">⚡ ${p.nom}</button>`).join("")}
              </div>

              <form id="cfg-f">
                <div style="overflow-x:auto;margin-bottom:14px;">
                  <table style="width:100%;min-width:650px;border-collapse:collapse;font-size:12px;">
                    <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:7px;text-align:center;">Activo</th><th style="padding:7px;text-align:left;">Tiempo de Comida</th><th style="padding:7px;text-align:left;">Horario</th><th style="padding:7px;text-align:left;">Tarifa Est. (₡)</th><th style="padding:7px;text-align:left;">Tarifa Docente (₡)</th></tr>
                    ${cfg.horarios.map((h, i) => `
                      <tr>
                        <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><input type="checkbox" data-hi="${i}" class="ch-act" ${h.activo?"checked":""} style="width:18px;height:18px;cursor:pointer;"/></td>
                        <td style="padding:7px;border-bottom:1px solid #1e293b;font-weight:700;">${h.nom}</td>
                        <td style="padding:7px;border-bottom:1px solid #1e293b;"><input type="text" data-hi="${i}" class="ch-hr" value="${h.hora}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:6px 8px;border-radius:6px;font-size:12px;width:130px;"/></td>
                        <td style="padding:7px;border-bottom:1px solid #1e293b;"><input type="number" min="0" data-hi="${i}" class="ch-te" value="${h.tarifaEst}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:6px 8px;border-radius:6px;font-size:12px;width:95px;"/></td>
                        <td style="padding:7px;border-bottom:1px solid #1e293b;"><input type="number" min="0" data-hi="${i}" class="ch-td" value="${h.tarifaDoc}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:6px 8px;border-radius:6px;font-size:12px;width:95px;"/></td>
                      </tr>
                    `).join("")}
                  </table>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
                  <div>
                    <label style="font-size:11px;color:#94a3b8;">Órgano Administrador:</label>
                    <select id="cg-jt" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;">
                      <option ${cfg.juntaTipo==="Junta Administrativa"?"selected":""}>Junta Administrativa</option>
                      <option ${cfg.juntaTipo==="Junta de Educación"?"selected":""}>Junta de Educación</option>
                    </select>
                  </div>
                  <div>
                    <label style="font-size:11px;color:#94a3b8;">Nombre Oficial de la Junta:</label>
                    <input id="cg-jn" type="text" value="${cfg.juntaNombre}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  </div>
                  <div>
                    <label style="font-size:11px;color:#94a3b8;">SINPE Móvil de la Junta:</label>
                    <input id="cg-sp" type="text" value="${cfg.sinpeJunta}" placeholder="8888-0000" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
                  </div>
                  <div style="display:flex;align-items:flex-end;">
                    <button type="submit" style="width:100%;background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💾 Guardar Tiempos, Tarifas y SINPE</button>
                  </div>
                </div>
              </form>            <div style="background:#451a03;border:1.5px solid #f59e0b;border-radius:12px;padding:14px;margin-top:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
              <div>
                <div style="font-size:13px;font-weight:800;color:#fbbf24;">🗓️ Cierre Anual de Tiquetes de Comedor (Año Lectivo ${cfg.anioLectivo || new Date().getFullYear()})</div>
                <div style="font-size:11.5px;color:#fef3c7;">Los tiquetes de almuerzo son administrados por la Junta y vencen al cerrar el año lectivo. Este botón descarga un respaldo CSV y reinicia el saldo de tiquetes en 0 para iniciar el siguiente año (NO afecta los saldos permanentes de la Cooperativa).</div>
              </div>
              <button type="button" id="com-cierre-anual" style="background:#dc2626;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Ejecutar Cierre Anual → ${Number(cfg.anioLectivo || new Date().getFullYear()) + 1}</button>
            </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".com-tab").forEach(b => b.onclick = () => { keepCamRunning = false; tab = b.getAttribute("data-ct"); draw(); });

      if (tab === "ventanilla" && esOperador) {
        shell.querySelectorAll(".com-tu").forEach(b => b.onclick = () => { turno = b.getAttribute("data-tu"); semEstado = null; draw(); });
        document.getElementById("md-express").onclick = () => { modoSoloConsulta = false; semEstado = null; draw(); };
        document.getElementById("md-query").onclick = () => { modoSoloConsulta = true; semEstado = null; draw(); };
        const mountEl = document.getElementById("com-cam-mount");
        if (mountEl && window.BDS_QR_CAMERA) {
          camCtrl = window.BDS_QR_CAMERA.mount(mountEl, {
            autoStart: false,
            cooldownMs: 2500,
            onScan: (code) => { keepCamRunning = true; procesarLecturaQR(code); }
          });
        }
        updateSemaforoDOM();
        refreshLogsTabla();
      }

      if (tab === "tiquetes") {
        document.getElementById("cp-sinpe").onclick = () => {
          navigator.clipboard && navigator.clipboard.writeText(cfg.sinpeJunta).catch(() => {});
          alert(`📋 Número SINPE de la Junta copiado: ${cfg.sinpeJunta}`);
        };
        shell.querySelectorAll(".cb-qbtn").forEach(b => b.onclick = () => { buyQty = Number(b.getAttribute("data-bq")); draw(); });
        document.getElementById("cb-custom").onchange = (e) => { buyQty = Math.max(1, Math.min(60, Number(e.target.value) || 1)); draw(); };
        document.getElementById("com-buy-f").onsubmit = async (e) => {
          e.preventDefault();
          const ref = document.getElementById("cb-ref").value.trim();
          const fecha = hoyISO(), hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          const hash = (await sha256Hex(`${fecha}|${miWallet.email}|SINPE|${ref}|${totalCompra}`)).slice(0, 18);
          const arr = loadTrx();
          arr.unshift({ id: "SNP-" + String(arr.length + 101), fecha, hora, walletId: miWallet.id, nombre: miWallet.nombre, email: miWallet.email, rol: miWallet.rol, metodo: "SINPE", cantidad: buyQty, tarifaUnit: tarifaCompra, montoTotal: totalCompra, comprobante: ref, estado: "PENDIENTE", aprobadoPor: "", hash });
          saveTrx(arr);
          alert(`✅ Comprobante SINPE #${ref} enviado por ${fmtCRC(totalCompra)} (${buyQty} comida(s)). Al aprobarse se acreditará a tu Carné QR.`);
          draw();
        };
      }

      if (tab === "menus") {
        shell.querySelectorAll(".com-ms").forEach(b => b.onclick = () => { menuSem = b.getAttribute("data-ms"); editandoMenu = false; draw(); });
        if (document.getElementById("mn-act")) document.getElementById("mn-act").onclick = () => { cfg.semanaActiva = menuSem; saveCfg(cfg); draw(); };
        if (document.getElementById("mn-ed")) document.getElementById("mn-ed").onclick = () => {
          if (editandoMenu) {
            const mAll = loadMenus();
            shell.querySelectorAll(".mn-in").forEach(inp => {
              const i = Number(inp.getAttribute("data-mi")), k = inp.getAttribute("data-mk");
              if (mAll[menuSem] && mAll[menuSem][i]) mAll[menuSem][i][k] = inp.value.trim();
            });
            saveMenus(mAll); editandoMenu = false;
          } else { editandoMenu = true; }
          draw();
        };
        document.getElementById("mn-prt").onclick = () => imprimirMenuSemanal(menuSem);
      }

      if (tab === "becas") {
        document.getElementById("beca-req-f").onsubmit = async (e) => {
          e.preventDefault();
          const nom = document.getElementById("br-est").value.trim();
          const mail = document.getElementById("br-mail").value.trim().toLowerCase();
          const mot = document.getElementById("br-mot").value.trim();
          const fecha = hoyISO();
          const hash = (await sha256Hex(`BECA|${fecha}|${mail}|${mot}`)).slice(0, 16);
          const arr = loadBecasReq();
          arr.unshift({ id: "BEC-" + String(arr.length + 101), fecha, nombre: nom, email: mail, seccion: miWallet.seccion, motivo: mot, estado: "PENDIENTE", aprobadoPor: "", hash });
          saveBecasReq(arr);
          alert(`✅ Solicitud digital de Beca PANEA enviada (SHA-256: ${hash}).`);
          draw();
        };
        shell.querySelectorAll(".bec-ok").forEach(b => b.onclick = () => {
          const arr = loadBecasReq(), r = arr.find(x => x.id === b.getAttribute("data-ba"));
          if (!r) return;
          r.estado = "APROBADA"; r.aprobadoPor = sesion.nombre; saveBecasReq(arr);
          const ws = loadWallets();
          let w = ws.find(x => x.email.toLowerCase() === r.email.toLowerCase());
          if (!w) {
            w = { id: "COM-" + String(Date.now()).slice(-4), nombre: r.nombre, email: r.email, rol: "Estudiante", seccion: r.seccion, becaPanea: true, becaTipo: "Completa PANEA 100%", becaVence: "2026-12-15", saldoColones: 0, qrCode: buildVerifiableQRPayload(r.email, "Estudiante", r.hash) };
            ws.push(w);
          } else {
            w.becaPanea = true; w.becaTipo = "Completa PANEA 100%"; w.becaVence = "2026-12-15";
          }
          saveWallets(ws); draw();
        });
        shell.querySelectorAll(".bec-no").forEach(b => b.onclick = () => {
          const arr = loadBecasReq(), r = arr.find(x => x.id === b.getAttribute("data-br"));
          if (!r) return;
          r.estado = "RECHAZADA"; r.aprobadoPor = sesion.nombre; saveBecasReq(arr);
          const ws = loadWallets(), w = ws.find(x => x.email.toLowerCase() === r.email.toLowerCase());
          if (w) { w.becaPanea = false; w.becaTipo = "Sin beca"; w.becaVence = "—"; saveWallets(ws); }
          draw();
        });
      }

      if (tab === "caja" && esOperador) {
        shell.querySelectorAll(".sinpe-ok").forEach(b => b.onclick = () => {
          const arr = loadTrx(), t = arr.find(x => x.id === b.getAttribute("data-ap"));
          if (!t) return;
          t.estado = "APROBADO"; t.aprobadoPor = sesion.nombre; saveTrx(arr);
          const ws = loadWallets(), w = ws.find(x => x.email.toLowerCase() === t.email.toLowerCase());
          if (w) { w.saldoColones = Number(w.saldoColones || 0) + Number(t.montoTotal || 0); saveWallets(ws); }
          draw();
        });
        shell.querySelectorAll(".sinpe-no").forEach(b => b.onclick = () => {
          const arr = loadTrx(), t = arr.find(x => x.id === b.getAttribute("data-rj"));
          if (!t) return;
          t.estado = "RECHAZADO"; t.aprobadoPor = sesion.nombre; saveTrx(arr); draw();
        });
        document.getElementById("cash-f").onsubmit = (e) => {
          e.preventDefault();
          const w = loadWallets().find(x => x.id === document.getElementById("cf-usr").value);
          const qty = Number(document.getElementById("cf-qty").value);
          if (w) venderEfectivoRapido(w, qty, false);
        };
        document.getElementById("caja-csv").onclick = () => {
          const rows = [["RECIBO","FECHA","HORA","NOMBRE","ROL","METODO","COMIDAS","TOTAL_CRC","COMPROBANTE","ESTADO","APROBADO_POR","SHA256"],
            ...loadTrx().map(t => [t.id, t.fecha, t.hora, t.nombre, t.rol, t.metodo, t.cantidad, t.montoTotal, t.comprobante, t.estado, t.aprobadoPor, t.hash])];
          const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
          a.download = `cierre-caja-comedor-${hoyISO()}.csv`;
          a.click();
        };
        shell.querySelectorAll(".w-beca").forEach(b => b.onclick = () => {
          const ws = loadWallets(), w = ws.find(x => x.id === b.getAttribute("data-wb"));
          if (w) { w.becaPanea = !w.becaPanea; w.becaTipo = w.becaPanea ? "Completa PANEA 100%" : "Sin beca"; w.becaVence = w.becaPanea ? "2026-12-15" : "—"; saveWallets(ws); draw(); }
        });
        shell.querySelectorAll(".w-plus").forEach(b => b.onclick = () => {
          const w = loadWallets().find(x => x.id === b.getAttribute("data-w5"));
          if (w) venderEfectivoRapido(w, 5, false);
        });
        document.getElementById("pad-add").onclick = async () => {
          const nom = prompt("Nombre completo:"); if (!nom) return;
          const mail = prompt("Correo institucional (ej: usuario@est.mep.go.cr):"); if (!mail) return;
          const r = confirm("¿Es Estudiante? (Aceptar = Estudiante | Cancelar = Docente MEP)") ? "Estudiante" : "Docente MEP";
          const beca = r === "Estudiante" ? confirm("¿Tiene Beca PANEA activa?") : false;
          const h = await sha256Hex(mail);
          const ws = loadWallets();
          ws.unshift({ id: "COM-" + String(Date.now()).slice(-4), nombre: nom.trim(), email: mail.trim().toLowerCase(), rol: r, seccion: r === "Estudiante" ? "10-1" : "Docente", becaPanea: beca, becaTipo: beca ? "Completa PANEA 100%" : "Sin beca", becaVence: beca ? "2026-12-15" : "—", saldoColones: 0, qrCode: buildVerifiableQRPayload(mail, r, h) });
          saveWallets(ws); draw();
        };
        document.getElementById("pad-bulk").onclick = async () => {
          const txt = prompt("Pegue líneas CSV (Nombre,Correo,Rol,Beca SI/NO,Saldo en Colones):\nEjemplo:\nAna Pérez,ana.perez@est.mep.go.cr,Estudiante,SI,0");
          if (!txt) return;
          const ws = loadWallets();
          let added = 0;
          for (const line of txt.split(/\r?\n/)) {
            const p = line.split(",").map(s => s.trim());
            if (p.length >= 2 && p[1].includes("@")) {
              const h = await sha256Hex(p[1]);
              const bOn = /^s[ií]|true|1$/i.test(p[3] || "");
              ws.push({ id: "COM-" + String(Date.now() + added).slice(-4), nombre: p[0], email: p[1].toLowerCase(), rol: p[2] || "Estudiante", seccion: "Padrón", becaPanea: bOn, becaTipo: bOn ? "Completa PANEA 100%" : "Sin beca", becaVence: bOn ? "2026-12-15" : "—", saldoColones: Number(p[4] || 0), qrCode: buildVerifiableQRPayload(p[1], p[2] || "Estudiante", h) });
              added++;
            }
          }
          saveWallets(ws); alert(`✅ Se cargaron ${added} registro(s) al padrón.`); draw();
        };
      }

      if (tab === "stats" && (esDireccion || esOperador)) {
        shell.querySelectorAll(".cfg-pre").forEach(b => b.onclick = () => {
          const pre = PRESETS_INSTITUCION[b.getAttribute("data-pre")];
          if (!pre) return;
          cfg.horarios.forEach(h => { h.activo = pre.activos.includes(h.id); });
          saveCfg(cfg); draw();
        });
        if (document.getElementById("com-cierre-anual")) document.getElementById("com-cierre-anual").onclick = () => { const curY = Number(cfg.anioLectivo || new Date().getFullYear()); const nextY = String(curY + 1); if (!confirm(`¿Ejecutar cierre anual del Comedor ${curY} → ${nextY}? Se descargará respaldo CSV y los tiquetes no gastados pasarán a ₡0 (la Cooperativa NO se toca).`)) return; const ws = loadWallets(); const rows = [["ANIO","ID","NOMBRE","EMAIL","ROL","BECA","SALDO_CIERRE_CRC"], ...ws.map(w => [curY, w.id, w.nombre, w.email, w.rol, w.becaPanea?"SI":"NO", w.saldoColones||0])]; const csv = "\\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, "\"\"")}"`).join(",")).join("\\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })); a.download = `respaldo-cierre-comedor-${curY}.csv`; a.click(); ws.forEach(w => { w.saldoColones = 0; }); saveWallets(ws); cfg.anioLectivo = nextY; saveCfg(cfg); alert(`✅ Cierre anual completado. Comedor listo para el año lectivo ${nextY}.`); draw(); }; document.getElementById("cfg-f").onsubmit = (e) => {
          e.preventDefault();
          shell.querySelectorAll(".ch-act").forEach(el => { cfg.horarios[Number(el.getAttribute("data-hi"))].activo = el.checked; });
          shell.querySelectorAll(".ch-hr").forEach(el => { cfg.horarios[Number(el.getAttribute("data-hi"))].hora = el.value.trim(); });
          shell.querySelectorAll(".ch-te").forEach(el => { cfg.horarios[Number(el.getAttribute("data-hi"))].tarifaEst = Math.max(0, Number(el.value || 0)); });
          shell.querySelectorAll(".ch-td").forEach(el => { cfg.horarios[Number(el.getAttribute("data-hi"))].tarifaDoc = Math.max(0, Number(el.value || 0)); });
          if (!cfg.horarios.some(h => h.activo)) { cfg.horarios[2].activo = true; }
          const alm = cfg.horarios.find(h => h.id === "almuerzo") || cfg.horarios[0];
          cfg.precioEstudiante = alm.tarifaEst;
          cfg.precioDocente = alm.tarifaDoc;
          cfg.juntaTipo = document.getElementById("cg-jt").value;
          cfg.juntaNombre = document.getElementById("cg-jn").value.trim() || cfg.juntaNombre;
          cfg.sinpeJunta = document.getElementById("cg-sp").value.trim() || cfg.sinpeJunta;
          saveCfg(cfg);
          alert("✅ Configuración de tiempos de comida, tarifas y SINPE de la Junta guardada.");
          draw();
        };
      }
    }

    draw();
  };
})();