(function () {
  const CFG_KEY = "bds_comedor_cfg_v185";
  const WLT_KEY = "bds_comedor_wallets_v185";
  const TRX_KEY = "bds_comedor_trx_v185";
  const LOG_KEY = "bds_comedor_logs_v185";
  const MNU_KEY = "bds_comedor_menus_v185";

  const TIEMPOS_DEFAULT = [
    { id: "desayuno", nom: "Desayuno", hora: "06:40 - 07:30", kcal: "25% kcal" },
    { id: "comp_manana", nom: "Complemento Mañana", hora: "09:20 - 09:50", kcal: "20% kcal" },
    { id: "almuerzo", nom: "Almuerzo", hora: "11:20 - 12:10", kcal: "30% kcal" },
    { id: "comp_tarde", nom: "Complemento Tarde", hora: "14:30 - 15:00", kcal: "20% kcal" },
    { id: "cena", nom: "Cena (Nocturno/IPEC/CINDEA)", hora: "18:00 - 19:00", kcal: "30% kcal" }
  ];

  // Menús reales alineados al Manual de Menú de Secundaria MEP / PANEA (Semanas A, B, C, D y E)
  const MENUS_MEP_DEFAULT = {
    A: [
      { dia: "Lunes", desayuno: "Gallo pinto, huevo revuelto, fruta de temporada, agua fresca", comp: "Emparedado de queso blanco y tomate, fruta", almuerzo: "Arroz blanco, frijoles molidos, pollo en salsa de tomate natural, ensalada de repollo y zanahoria, sandía, agua fresca", cena: "Arroz con pollo desmenuzado, ensalada verde, agua fresca", alergenos: "Huevo, Lácteos, Gluten" },
      { dia: "Martes", desayuno: "Avena con leche descremada, pan integral con queso, banano", comp: "Yogur natural con fruta picada", almuerzo: "Arroz, frijoles negros, carne mechada en salsa criolla, picadillo de chayote con maíz, piña fresca, agua fresca", cena: "Sopa negra con huevo duro, arroz blanco y tortilla, agua fresca", alergenos: "Lácteos, Gluten, Huevo" },
      { dia: "Miércoles", desayuno: "Tortilla palmeada con queso tierno, tomate cherry, papaya", comp: "Tostada integral con pollo desmenuzado", almuerzo: "Arroz con vegetales, lentejas guisadas, filete de pescado al horno con limón, ensalada de lechuga y pepino, manzana, agua fresca", cena: "Pasta corta en salsa natural con carne molida magra, ensalada", alergenos: "Lácteos, Pescado, Gluten" },
      { dia: "Jueves", desayuno: "Gallo pinto, queso fresco a la plancha, melón, agua fresca", comp: "Burrito de frijol molido y queso", almuerzo: "Arroz blanco, frijoles rojos, bistec de res encebollado, picadillo de arracache tradicional, naranja, agua fresca", cena: "Olla de carne tradicional con verduras y arroz, agua fresca", alergenos: "Lácteos, Gluten" },
      { dia: "Viernes", desayuno: "Huevo picado con espinaca, tortilla de maíz, sandía", comp: "Fruta de temporada y galleta integral", almuerzo: "Arroz, frijoles negros, lomo de cerdo en salsa de naranja natural, ensalada rusa liviana, banano, agua fresca", cena: "Casado institucional con pollo a la plancha y vegetales", alergenos: "Huevo, Gluten" }
    ],
    B: [
      { dia: "Lunes", desayuno: "Emparedado integral de jamón de pavo y queso, piña", comp: "Manzana y semillas mixtas", almuerzo: "Arroz blanco, frijoles negros, pollo a la plancha con hierbas, picadillo de papa con carne, ensalada mixta, melón, agua fresca", cena: "Arroz con carne de cerdo magra y vegetales salteados", alergenos: "Lácteos, Gluten" },
      { dia: "Martes", desayuno: "Gallo pinto con natilla liviana, huevo duro, mandarina", comp: "Tortilla con queso y tomate", almuerzo: "Arroz, garbanzos guisados con verduras, atún natural en ensalada fresca, ensalada de remolacha, sandía, agua fresca", cena: "Sopa de pollo con verduras y arroz blanco", alergenos: "Lácteos, Huevo, Pescado" },
      { dia: "Miércoles", desayuno: "Pan integral con huevo revuelto y tomate, papaya", comp: "Yogur con avena", almuerzo: "Arroz blanco, frijoles rojos, carne de res guisada con zanahoria, picadillo de vainica, banano, agua fresca", cena: "Tacos suaves de pollo desmenuzado con repollo y tomate", alergenos: "Huevo, Gluten, Lácteos" },
      { dia: "Jueves", desayuno: "Cereal integral con leche descremada, banano", comp: "Emparedado de queso blanco", almuerzo: "Arroz, frijoles negros, fajitas de pollo con chile dulce y cebolla, ensalada de pepino y tomate, naranja, agua fresca", cena: "Arroz jardinero con huevo cocido y ensalada verde", alergenos: "Lácteos, Gluten" },
      { dia: "Viernes", desayuno: "Gallo pinto, queso fresco, piña fresca, agua fresca", comp: "Fruta de temporada y tortilla", almuerzo: "Espagueti en salsa boloñesa casera (res magra), ensalada verde con zanahoria, manzana, agua fresca", cena: "Casado con filete de tilapia al horno y picadillo de chayote", alergenos: "Lácteos, Gluten, Pescado" }
    ],
    C: [
      { dia: "Lunes", desayuno: "Tortilla con huevo revuelto y queso, sandía", comp: "Banano y pan integral", almuerzo: "Arroz blanco, frijoles tiernos, muslo de pollo horneado sin piel, picadillo de ayote tierno, ensalada verde, piña, agua fresca", cena: "Sopa de verduras con carne magra y arroz", alergenos: "Huevo, Lácteos" },
      { dia: "Martes", desayuno: "Avena tibia con canela, queso blanco, manzana", comp: "Emparedado de pollo desmenuzado", almuerzo: "Arroz, frijoles negros, tortas de carne de res caseras al horno, ensalada de repollo con limón, melón, agua fresca", cena: "Arroz con atún natural y ensalada de tomate", alergenos: "Lácteos, Gluten, Pescado" },
      { dia: "Miércoles", desayuno: "Gallo pinto, salchicha de pavo salteada, papaya", comp: "Fruta picada de temporada", almuerzo: "Arroz blanco, lentejas, cerdo guisado en salsa criolla, picadillo de plátano verde, naranja, agua fresca", cena: "Macarrones con pollo en salsa blanca liviana y vegetales", alergenos: "Gluten, Lácteos" },
      { dia: "Jueves", desayuno: "Pan pita integral con queso y espinaca, banano", comp: "Yogur natural con fruta", almuerzo: "Arroz, frijoles rojos, filete de pescado empanizado al horno, ensalada de lechuga, tomate y zanahoria, sandía, agua fresca", cena: "Gallo pinto con huevo revuelto y queso fresco", alergenos: "Gluten, Lácteos, Pescado" },
      { dia: "Viernes", desayuno: "Huevo ranchero en salsa natural, tortilla, mandarina", comp: "Tostada con frijol molido", almuerzo: "Arroz con pollo tradicional costarricense, frijoles molidos, ensalada de repollo, manzana, agua fresca", cena: "Casado institucional con carne mechada y ensalada", alergenos: "Huevo" }
    ],
    D: [
      { dia: "Lunes", desayuno: "Gallo pinto, queso fresco, papaya, agua fresca", comp: "Emparedado de huevo cocido", almuerzo: "Arroz blanco, frijoles negros, pollo en salsa de hongos o tomate natural, picadillo de papa y vainica, melón, agua fresca", cena: "Sopa azteca liviana con pollo y aguacate", alergenos: "Lácteos, Huevo" },
      { dia: "Martes", desayuno: "Pan integral con queso fresco y tomate, banano", comp: "Fruta entera y yogur", almuerzo: "Arroz, frijoles rojos, costilla o posta de cerdo magra al horno, ensalada de pepino y lechuga, piña, agua fresca", cena: "Arroz blanco, frijoles y carne molida con vegetales", alergenos: "Gluten, Lácteos" },
      { dia: "Miércoles", desayuno: "Tortilla con frijol molido y queso, sandía", comp: "Galleta integral y manzana", almuerzo: "Arroz blanco, garbanzos con pollo, picadillo de arracache con carne, ensalada verde, naranja, agua fresca", cena: "Pasta integral con atún y vegetales salteados", alergenos: "Lácteos, Gluten, Pescado" },
      { dia: "Jueves", desayuno: "Avena con leche descremada, huevo duro, mandarina", comp: "Emparedado de queso blanco", almuerzo: "Arroz, frijoles negros, bistec de res en salsa criolla, guiso de chayote con elote, banano, agua fresca", cena: "Olla de carne tradicional y arroz blanco", alergenos: "Lácteos, Huevo" },
      { dia: "Viernes", desayuno: "Gallo pinto, huevo revuelto, piña fresca", comp: "Fruta de temporada", almuerzo: "Arroz jardinero, filete de tilapia al ajillo liviano, ensalada de tomate y pepino, sandía, agua fresca", cena: "Casado institucional con fajitas de pollo y ensalada", alergenos: "Huevo, Pescado" }
    ],
    E: [
      { dia: "Lunes", desayuno: "Gallo pinto, queso tierno, melón, agua fresca", comp: "Fruta de temporada y pan integral", almuerzo: "Arroz blanco, frijoles rojos, pollo guisado con papa y zanahoria, ensalada de lechuga y tomate, manzana, agua fresca", cena: "Sopa negra con huevo y arroz", alergenos: "Lácteos, Huevo" },
      { dia: "Martes", desayuno: "Emparedado integral de queso y espinaca, papaya", comp: "Yogur natural", almuerzo: "Arroz, frijoles negros, carne desmechada en salsa natural, picadillo de brócoli y zanahoria, sandía, agua fresca", cena: "Arroz con pollo y ensalada verde", alergenos: "Gluten, Lácteos" },
      { dia: "Miércoles", desayuno: "Tortilla con huevo revuelto, banano, agua fresca", comp: "Tostada con pollo", almuerzo: "Arroz blanco, lentejas con verduras, cerdo a la plancha con limón, ensalada de repollo, piña, agua fresca", cena: "Pasta en salsa natural con pollo desmenuzado", alergenos: "Huevo, Gluten" },
      { dia: "Jueves", desayuno: "Avena con leche descremada, fruta fresca", comp: "Emparedado de frijol y queso", almuerzo: "Arroz, frijoles negros, atún al horno en torta con vegetales, picadillo de chayote, naranja, agua fresca", cena: "Casado tradicional con bistec y ensalada", alergenos: "Lácteos, Pescado" },
      { dia: "Viernes", desayuno: "Gallo pinto, queso a la plancha, mandarina", comp: "Fruta picada de temporada", almuerzo: "Arroz blanco, frijoles molidos, fajitas de res con pimientos, ensalada mixta, banano, agua fresca", cena: "Sopa de verduras con pollo y tortilla", alergenos: "Lácteos" }
    ]
  };

  function getBrand() {
    return window.BDS_BRAND ? window.BDS_BRAND.get() : {
      institucion: "Colegio Técnico Profesional Mercedes Norte",
      regional: "Dirección Regional de Heredia",
      circuito: "Circuito 02",
      escudo: "/escudo-ctpmn-oficial.jpeg?v=185",
      logoMep: "/logo-mep-oficial.png?v=185"
    };
  }

  function loadCfg() {
    try { const d = JSON.parse(localStorage.getItem(CFG_KEY)); if (d && d.juntaTipo) return d; } catch {}
    const def = {
      juntaTipo: "Junta Administrativa",
      juntaNombre: "Junta Administrativa — " + getBrand().institucion,
      sinpeJunta: "8888-0000",
      sinpeTitular: "Junta Administrativa Institucional",
      precioEstudiante: 1000,
      precioDocente: 1800,
      semanaActiva: "A",
      horarios: TIEMPOS_DEFAULT
    };
    localStorage.setItem(CFG_KEY, JSON.stringify(def));
    return def;
  }
  function saveCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify(c)); }

  function loadWallets() {
    try { const d = JSON.parse(localStorage.getItem(WLT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { id: "COM-101", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", rol: "Estudiante", seccion: "11-1", becaPanea: true, saldo: 0, qrCode: "COMEDOR|sofia.alvarado@est.mep.go.cr" },
      { id: "COM-102", nombre: "Esteban Campos Mora", email: "esteban.campos@est.mep.go.cr", rol: "Estudiante", seccion: "10-3", becaPanea: false, saldo: 5, qrCode: "COMEDOR|esteban.campos@est.mep.go.cr" },
      { id: "COM-103", nombre: "Valeria Solís Jiménez", email: "valeria.solis@est.mep.go.cr", rol: "Estudiante", seccion: "10-1", becaPanea: false, saldo: 0, qrCode: "COMEDOR|valeria.solis@est.mep.go.cr" },
      { id: "COM-201", nombre: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", seccion: "Docente", becaPanea: false, saldo: 8, qrCode: "COMEDOR|carlos.quesada@mep.go.cr" }
    ];
    localStorage.setItem(WLT_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveWallets(arr) { localStorage.setItem(WLT_KEY, JSON.stringify(arr)); }

  function loadTrx() { try { return JSON.parse(localStorage.getItem(TRX_KEY)) || []; } catch { return []; } }
  function saveTrx(arr) { localStorage.setItem(TRX_KEY, JSON.stringify(arr)); }

  function loadLogs() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; } }
  function saveLogs(arr) { localStorage.setItem(LOG_KEY, JSON.stringify(arr)); }

  function loadMenus() {
    try { const m = JSON.parse(localStorage.getItem(MNU_KEY)); if (m && m.A) return m; } catch {}
    localStorage.setItem(MNU_KEY, JSON.stringify(MENUS_MEP_DEFAULT));
    return JSON.parse(JSON.stringify(MENUS_MEP_DEFAULT));
  }
  function saveMenus(m) { localStorage.setItem(MNU_KEY, JSON.stringify(m)); }

  function getTarifaUsuario(rol, cfg) {
    return rol === "Estudiante" ? Number(cfg.precioEstudiante || 1000) : Number(cfg.precioDocente || 1800);
  }

  function detectarTurnoActual() {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    if (h < 8.5) return "desayuno";
    if (h < 10.6) return "comp_manana";
    if (h < 13.8) return "almuerzo";
    if (h < 16.8) return "comp_tarde";
    return "cena";
  }

  function ensureWalletForSession(sesion) {
    const ws = loadWallets();
    const mail = (sesion.email || "").toLowerCase();
    let w = ws.find(x => x.email.toLowerCase() === mail);
    if (!w) {
      w = {
        id: "COM-" + String(Date.now()).slice(-4),
        nombre: sesion.nombre || mail.split("@")[0],
        email: mail,
        rol: sesion.rol || "Estudiante",
        seccion: sesion.seccion || "Institucional",
        becaPanea: false,
        saldo: 0,
        qrCode: `COMEDOR|${mail}|${sesion.qr || ""}`
      };
      ws.push(w);
      saveWallets(ws);
    }
    return w;
  }

  function findWalletByQuery(raw) {
    const q = String(raw || "").trim().toLowerCase();
    if (!q) return null;
    const ws = loadWallets();
    // 1. Coincidencia exacta por QR, email o ID
    let hit = ws.find(w =>
      w.email.toLowerCase() === q ||
      w.id.toLowerCase() === q ||
      (w.qrCode && w.qrCode.toLowerCase() === q) ||
      q.includes(w.email.toLowerCase()) ||
      q.includes(w.id.toLowerCase())
    );
    if (hit) return hit;
    // 2. Coincidencia por nombre parcial (búsqueda manual de respaldo)
    if (q.length >= 3) {
      hit = ws.find(w => w.nombre.toLowerCase().includes(q));
    }
    return hit || null;
  }

  window.BDS_RENDER_COMEDOR_MEP = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const rol = sesion.rol;
    const esOperador = ["SuperAdmin", "Encargada Comedor / Junta", "Auxiliar Administrativo"].includes(rol);
    const esDireccion = ["SuperAdmin", "Director(a)", "Ministro(a) MEP"].includes(rol);

    const tabsDisponibles = [
      ...(esOperador ? [{ id: "ventanilla", lbl: "📷 Ventanilla QR (Semáforo)" }] : []),
      { id: "tiquetes", lbl: "🎫 Mis Tiquetes & Compra SINPE" },
      { id: "menus", lbl: "🍽️ Menú MEP (Semanas A–E)" },
      ...(esOperador ? [{ id: "caja", lbl: "💵 Caja, SINPE y Padrón" }] : []),
      ...((esDireccion || esOperador) ? [{ id: "stats", lbl: "📊 Estadísticas y Config." }] : [])
    ];

    let tab = esOperador ? "ventanilla" : (esDireccion ? "stats" : "tiquetes");
    let turno = detectarTurnoActual();
    let semEstado = null; // { color, titulo, detalle, wallet, rawCode }
    let menuSem = loadCfg().semanaActiva || "A";
    let editandoMenu = false;
    let camCtrl = null;

    const hoyISO = () => new Date().toISOString().slice(0, 10);

    async function registrarConsumo(wallet, metodo, monto, overrideDup) {
      const logs = loadLogs();
      const fecha = hoyISO();
      const yaComio = logs.find(l => l.fecha === fecha && l.turno === turno && l.email.toLowerCase() === wallet.email.toLowerCase());
      if (yaComio && !overrideDup) {
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("yellow");
        return {
          color: "yellow",
          titulo: "🟡 YA CONSUMIÓ EN ESTE TURNO HOY",
          detalle: `${wallet.nombre} (${wallet.rol} • ${wallet.seccion}) ya registró "${turno.toUpperCase()}" a las ${yaComio.hora} (${yaComio.metodo}).`,
          wallet
        };
      }

      const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const hash = (await sha256Hex(`${fecha}|${hora}|${wallet.email}|${turno}|${metodo}`)).slice(0, 16);
      logs.unshift({
        id: "LOG-" + Date.now(),
        fecha, hora, turno,
        walletId: wallet.id,
        nombre: wallet.nombre,
        email: wallet.email,
        rol: wallet.rol,
        seccion: wallet.seccion,
        metodo, monto: Number(monto || 0),
        operador: sesion.nombre,
        hash
      });
      saveLogs(logs);
      if (ganarXP) ganarXP(5);
      return null;
    }

    async function procesarLecturaQR(rawCode) {
      const cfg = loadCfg();
      let wallet = findWalletByQuery(rawCode);

      if (!wallet) {
        // Si es un QR institucional válido no registrado aún en padrón
        const esDocenteQR = /Docente|Director|Auxiliar|Guarda|Conserje/i.test(rawCode);
        const tempWallet = {
          id: "NO-REG",
          nombre: rawCode.includes("@") ? rawCode.split("@")[0] : "Persona no registrada en padrón",
          email: rawCode.includes("@") ? rawCode.trim().toLowerCase() : rawCode.slice(0, 42),
          rol: esDocenteQR ? "Docente MEP" : "Estudiante",
          seccion: "Sin asignar",
          becaPanea: false,
          saldo: 0,
          noRegistrado: true
        };
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
        semEstado = {
          color: "red",
          titulo: "🔴 SIN ACCESO — USUARIO NO REGISTRADO / SALDO 0",
          detalle: `Código leído: ${rawCode.slice(0, 64)}. Puede vender tiquete en efectivo, registrar en padrón o emitir Pase de Equidad.`,
          wallet: tempWallet,
          rawCode
        };
        draw();
        return;
      }

      const ws = loadWallets();
      const idx = ws.findIndex(x => x.id === wallet.id);
      const w = ws[idx];

      // 1. Verificar duplicado en el turno actual
      const dup = await (async () => {
        const logs = loadLogs();
        const ya = logs.find(l => l.fecha === hoyISO() && l.turno === turno && l.email.toLowerCase() === w.email.toLowerCase());
        if (ya) {
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("yellow");
          return {
            color: "yellow",
            titulo: "🟡 YA CONSUMIÓ EN ESTE TURNO HOY",
            detalle: `${w.nombre} (${w.rol} • ${w.seccion}) ya recibió servicio en "${turno}" a las ${ya.hora}.`,
            wallet: w,
            rawCode
          };
        }
        return null;
      })();

      if (dup) { semEstado = dup; draw(); return; }

      // 2. Beca PANEA Activa -> VERDE
      if (w.becaPanea) {
        await registrarConsumo(w, "Beca PANEA (₡0)", 0, false);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
        semEstado = {
          color: "green",
          titulo: "🟢 BECA PANEA ACTIVA — ACCESO AUTORIZADO (₡0)",
          detalle: `${w.nombre} • ${w.rol} (${w.seccion}) • Consumo registrado en ${turno.toUpperCase()}.`,
          wallet: w,
          rawCode
        };
        draw();
        return;
      }

      // 3. Tiquetes prepagados disponibles -> AZUL
      if (w.saldo > 0) {
        w.saldo -= 1;
        saveWallets(ws);
        const tarifa = getTarifaUsuario(w.rol, cfg);
        await registrarConsumo(w, `Tiquete ${w.rol} (₡${tarifa})`, tarifa, false);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("blue");
        semEstado = {
          color: "blue",
          titulo: `🔵 TIQUETE DESCONTADO — QUEDAN ${w.saldo} TIQUETE${w.saldo === 1 ? "" : "S"}`,
          detalle: `${w.nombre} • Tarifa ${w.rol} (₡${tarifa.toLocaleString("es-CR")}) • Saldo restante: ${w.saldo}.`,
          wallet: w,
          rawCode
        };
        draw();
        return;
      }

      // 4. Sin beca y sin saldo -> ROJO
      if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
      semEstado = {
        color: "red",
        titulo: "🔴 SIN BECA NI TIQUETES DISPONIBLES (SALDO: 0)",
        detalle: `${w.nombre} • ${w.rol} (${w.seccion}) • Tarifa aplicable: ₡${getTarifaUsuario(w.rol, cfg).toLocaleString("es-CR")}.`,
        wallet: w,
        rawCode
      };
      draw();
    }

    async function venderEfectivoRapido(wallet, cant, consumirAhora) {
      const cfg = loadCfg();
      const ws = loadWallets();
      let w = ws.find(x => x.id === wallet.id || x.email.toLowerCase() === wallet.email.toLowerCase());
      if (!w) {
        w = {
          id: "COM-" + String(Date.now()).slice(-4),
          nombre: wallet.nombre,
          email: wallet.email,
          rol: wallet.rol || "Estudiante",
          seccion: wallet.seccion || "Institucional",
          becaPanea: false,
          saldo: 0,
          qrCode: `COMEDOR|${wallet.email}`
        };
        ws.push(w);
      }
      const unit = getTarifaUsuario(w.rol, cfg);
      const total = unit * cant;
      w.saldo += cant;
      if (consumirAhora && w.saldo > 0) w.saldo -= 1;
      saveWallets(ws);

      const fecha = hoyISO();
      const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
      const trx = loadTrx();
      const reciboNum = "REC-" + String(trx.length + 1001);
      const hash = (await sha256Hex(`${reciboNum}|${fecha}|${w.email}|EFECTIVO|${cant}|${total}`)).slice(0, 18);
      trx.unshift({
        id: reciboNum, fecha, hora,
        walletId: w.id, nombre: w.nombre, email: w.email, rol: w.rol,
        metodo: "EFECTIVO", cantidad: cant, tarifaUnit: unit, montoTotal: total,
        comprobante: reciboNum, estado: "APROBADO", aprobadoPor: sesion.nombre, hash
      });
      saveTrx(trx);

      if (consumirAhora) {
        await registrarConsumo(w, `Efectivo Ventanilla (₡${unit})`, unit, true);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("blue");
        semEstado = {
          color: "blue",
          titulo: `🔵 PAGO EN EFECTIVO ACREDITADO (${reciboNum}) — QUEDAN ${w.saldo}`,
          detalle: `${w.nombre} compró ${cant} tiquete(s) por ₡${total.toLocaleString("es-CR")} (1 consumido hoy). Sello SHA-256: ${hash}`,
          wallet: w
        };
      } else {
        alert(`✅ Recibo ${reciboNum} emitido.\n${w.nombre}: +${cant} tiquete(s) por ₡${total.toLocaleString("es-CR")}.\nSaldo actual: ${w.saldo}\nSHA-256: ${hash}`);
      }
      draw();
    }

    function imprimirMenuSemanal(semKey) {
      const b = getBrand();
      const cfg = loadCfg();
      const rows = loadMenus()[semKey] || [];
      const w = window.open("", "_blank");
      if (!w) return alert("Permita ventanas emergentes para imprimir el menú.");
      w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Menú Oficial MEP Semana ${semKey}</title><style>body{font-family:Inter,Arial,sans-serif;padding:24px;color:#0f172a}table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;vertical-align:top}th{background:#0f2247;color:#fff}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:64px"/><div style="text-align:center"><h2 style="margin:0">${b.institucion}</h2><div style="font-size:12px">${b.regional} • ${b.circuito} • ${cfg.juntaTipo}</div><h3 style="margin:6px 0 0;color:#0f766e">MENÚ OFICIAL COMEDOR ESCOLAR (PANEA) — SEMANA ${semKey}</h3></div><img src="${b.logoMep}" style="height:48px"/></div><p style="font-size:11.5px;margin:10px 0 0"><b>Fundamento:</b> Decreto Ejecutivo N.° 44940-MEP (PANEA), Circular DVM-A-01-2018 y Manual de Menú de Secundaria del MEP. Todos los tiempos incluyen agua fresca a libre demanda (cero frescos azucarados).</p><table><tr><th>Día</th><th>Desayuno</th><th>Complemento</th><th>Almuerzo</th><th>Cena (Nocturno/IPEC)</th><th>Alérgenos</th></tr>${rows.map(r => `<tr><td><b>${r.dia}</b></td><td>${r.desayuno}</td><td>${r.comp}</td><td>${r.almuerzo}</td><td>${r.cena}</td><td>${r.alergenos}</td></tr>`).join("")}</table><script>window.onload=()=>window.print();</script></body></html>`);
      w.document.close();
    }

    function draw() {
      if (camCtrl) { camCtrl.stop(); camCtrl = null; }
      const b = getBrand();
      const cfg = loadCfg();
      const wallets = loadWallets();
      const trx = loadTrx();
      const logs = loadLogs();
      const menus = loadMenus();
      const miWallet = ensureWalletForSession(sesion);
      const pendSinpe = trx.filter(t => t.estado === "PENDIENTE");

      const logsHoy = logs.filter(l => l.fecha === hoyISO());
      const trxHoy = trx.filter(t => t.fecha === hoyISO() && t.estado === "APROBADO");
      const totEfectivo = trxHoy.filter(t => t.metodo === "EFECTIVO").reduce((a, x) => a + x.montoTotal, 0);
      const totSinpe = trxHoy.filter(t => t.metodo === "SINPE").reduce((a, x) => a + x.montoTotal, 0);
      const totBecas = logsHoy.filter(l => l.metodo.includes("Beca")).length;
      const totPagos = logsHoy.filter(l => l.metodo.includes("Tiquete") || l.metodo.includes("Efectivo")).length;
      const totEquidad = logsHoy.filter(l => l.metodo.includes("Equidad")).length;

      const semColors = {
        green: { bg: "#064e3b", bd: "#10b981", tx: "#6ee7b7" },
        blue: { bg: "#0c2d5e", bd: "#38bdf8", tx: "#bae6fd" },
        yellow: { bg: "#451a03", bd: "#f59e0b", tx: "#fde68a" },
        red: { bg: "#450a0a", bd: "#ef4444", tx: "#fecaca" }
      };

      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">DECRETO N.° 44940-MEP (PANEA) • CIRCULAR DVM-A-01-2018</span>
              <h2 style="margin:5px 0 2px;font-size:18px;color:#fff;">🍽️ Comedor Escolar MEP — ${b.institucion}</h2>
              <div style="font-size:11.5px;color:#94a3b8;">${cfg.juntaTipo} • Semana Menú Activa: <b style="color:#fbbf24;">Semana ${cfg.semanaActiva}</b> • Estudiante: <b>₡${cfg.precioEstudiante}</b> • Docente: <b>₡${cfg.precioDocente}</b> • SINPE Junta: <b style="color:#34d399;">${cfg.sinpeJunta}</b></div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${tabsDisponibles.map(t => `<button data-ct="${t.id}" class="com-tab" style="background:${tab===t.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${tab===t.id?'#38bdf8':'#334155'};padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${t.lbl}${t.id==="caja" && pendSinpe.length ? ` (${pendSinpe.length})` : ""}</button>`).join("")}
            </div>
          </div>

          ${tab === "ventanilla" && esOperador ? `
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">
              <span style="font-size:11.5px;font-weight:800;color:#94a3b8;">TIEMPO DE COMIDA ACTUAL:</span>
              ${cfg.horarios.map(h => `<button data-tu="${h.id}" class="com-tu" style="background:${turno===h.id?'#0f766e':'#070d19'};color:#fff;border:1px solid ${turno===h.id?'#2dd4bf':'#334155'};padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${h.nom} (${h.hora})</button>`).join("")}
            </div>

            <div id="com-cam-mount" style="margin-bottom:12px;"></div>

            ${semEstado ? `
              <div style="background:${semColors[semEstado.color].bg};border:3px solid ${semColors[semEstado.color].bd};border-radius:14px;padding:18px;margin-bottom:14px;text-align:center;">
                <h2 style="margin:0 0 6px;font-size:20px;color:#fff !important;">${semEstado.titulo}</h2>
                <p style="margin:0 0 12px;font-size:13.5px;color:${semColors[semEstado.color].tx} !important;font-weight:600;">${semEstado.detalle}</p>
                ${semEstado.color === "yellow" ? `
                  <button id="sem-ovr" style="background:#b45309;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">🔓 Autorizar Excepción (Dirección/Encargada)</button>
                ` : ""}
                ${semEstado.color === "red" ? `
                  <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                    <button id="sem-cash1" style="background:#059669;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">💵 Venta Efectivo 1 Tiquete (₡${getTarifaUsuario(semEstado.wallet.rol, cfg)})</button>
                    <button id="sem-cash5" style="background:#0284c7;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">💵 Paquete 5 Tiquetes (₡${getTarifaUsuario(semEstado.wallet.rol, cfg) * 5})</button>
                    <button id="sem-sinpe" style="background:#1d4ed8;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">📲 Ver SINPE Pendientes (${pendSinpe.length})</button>
                    <button id="sem-equidad" style="background:#7c3aed;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-weight:800;cursor:pointer;">🤝 Pase de Equidad (Autorizado)</button>
                  </div>
                ` : ""}
              </div>
            ` : `<div style="background:#070d19;border:1px dashed #334155;border-radius:12px;padding:16px;text-align:center;color:#94a3b8;font-size:12.5px;margin-bottom:14px;">Presione <b>▶ Activar Cámara</b> para escanear carnés QR en fila, o escriba nombre/correo/código (pruebas rápidas: <code>sofia.alvarado@est.mep.go.cr</code> [Beca], <code>esteban.campos@est.mep.go.cr</code> [Saldo], <code>valeria.solis@est.mep.go.cr</code> [Sin saldo]).</div>`}

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <b style="font-size:12.5px;color:#38bdf8;">📋 Últimas lecturas de hoy (${logsHoy.length} platos servidos)</b>
                <span style="font-size:11.5px;color:#94a3b8;">Becas: <b style="color:#34d399;">${totBecas}</b> • Tiquetes: <b style="color:#38bdf8;">${totPagos}</b> • Equidad: <b style="color:#c084fc;">${totEquidad}</b></span>
              </div>
              <div style="overflow-x:auto;max-height:220px;overflow-y:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:11.5px;">
                  <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:6px;text-align:left;">Hora</th><th style="padding:6px;text-align:left;">Persona</th><th style="padding:6px;text-align:left;">Turno</th><th style="padding:6px;text-align:left;">Acceso</th><th style="padding:6px;text-align:left;">SHA-256</th></tr>
                  ${logsHoy.slice(0, 20).map(l => `<tr><td style="padding:6px;border-bottom:1px solid #1e293b;">${l.hora}</td><td style="padding:6px;border-bottom:1px solid #1e293b;"><b>${l.nombre}</b> (${l.seccion})</td><td style="padding:6px;border-bottom:1px solid #1e293b;">${l.turno}</td><td style="padding:6px;border-bottom:1px solid #1e293b;color:#34d399;font-weight:700;">${l.metodo}</td><td style="padding:6px;border-bottom:1px solid #1e293b;font-family:monospace;color:#94a3b8;">${l.hash}</td></tr>`).join("") || `<tr><td colspan="5" style="padding:10px;text-align:center;color:#64748b;">Aún no hay consumos registrados hoy.</td></tr>`}
                </table>
              </div>
            </div>
          ` : ""}

          ${tab === "tiquetes" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start;">
              <!-- Carné QR de Comedor listo para escanear -->
              <div style="background:#070d19;border:2px solid ${miWallet.becaPanea?'#10b981':'#38bdf8'};border-radius:14px;padding:18px;text-align:center;">
                <span style="background:${miWallet.becaPanea?'#059669':'#0284c7'};color:#fff;font-size:10.5px;font-weight:800;padding:3px 10px;border-radius:99px;">${miWallet.becaPanea ? "🟢 BECA PANEA ACTIVA (₡0)" : `🔵 SALDO ACTUAL: ${miWallet.saldo} TIQUETE(S)`}</span>
                <h3 style="margin:8px 0 2px;font-size:17px;">${miWallet.nombre}</h3>
                <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">${miWallet.rol} • ${miWallet.seccion} • ID: <b>${miWallet.id}</b></div>
                <div style="display:inline-block;margin-bottom:10px;">${generarQRSVG(miWallet.qrCode || ("COMEDOR|" + miWallet.email), 176)}</div>
                <div style="font-size:11px;color:#cbd5e1;">Presente este código QR en la ventanilla del comedor para lectura instantánea con cámara.</div>
              </div>

              <!-- Compra múltiple de tiquetes por SINPE Móvil a la Junta -->
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;">
                <h3 style="margin:0 0 8px;font-size:16px;color:#38bdf8;">📲 Comprar Paquete de Tiquetes por SINPE Móvil</h3>
                <div style="background:#0b1322;border:1px solid #059669;border-radius:10px;padding:10px;font-size:12px;margin-bottom:12px;line-height:1.5;">
                  <div><b>Beneficiario oficial:</b> ${cfg.juntaNombre}</div>
                  <div><b>SINPE Móvil de la Junta:</b> <span style="color:#34d399;font-size:14px;font-weight:900;">+506 ${cfg.sinpeJunta}</span></div>
                  <div><b>Tarifa aplicada (${miWallet.rol}):</b> <b>₡${getTarifaUsuario(miWallet.rol, cfg).toLocaleString("es-CR")}</b> por tiempo de comida</div>
                  <div style="font-size:11px;color:#94a3b8;margin-top:4px;">También puede comprar tiquetes en efectivo directamente con la encargada de la ${cfg.juntaTipo}.</div>
                </div>

                <form id="com-buy-f" style="display:flex;flex-direction:column;gap:9px;">
                  <label style="font-size:11.5px;color:#cbd5e1;">Cantidad de tiquetes:</label>
                  <select id="cb-qty" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;font-weight:700;">
                    ${[1, 5, 10, 20].map(q => `<option value="${q}">${q} Tiquete${q>1?"s":""} — Total ₡${(q * getTarifaUsuario(miWallet.rol, cfg)).toLocaleString("es-CR")}</option>`).join("")}
                  </select>
                  <label style="font-size:11.5px;color:#cbd5e1;">Número de comprobante SINPE Móvil:</label>
                  <input id="cb-ref" type="text" required placeholder="Ej: 202611180045123" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;"/>
                  <button type="submit" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;font-size:13px;">📤 Enviar Comprobante SINPE a la Junta</button>
                </form>

                <div style="margin-top:14px;border-top:1px solid #1e293b;padding-top:10px;">
                  <div style="font-size:11.5px;font-weight:800;color:#94a3b8;margin-bottom:6px;">Mis solicitudes y recargas recientes:</div>
                  ${trx.filter(t => t.email.toLowerCase() === miWallet.email.toLowerCase()).slice(0, 5).map(t => `<div style="font-size:11.5px;padding:6px 0;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;gap:6px;"><span>${t.fecha} • <b>${t.cantidad} tiq.</b> (₡${t.montoTotal.toLocaleString("es-CR")}) • ${t.metodo}</span><span style="font-weight:800;color:${t.estado==='APROBADO'?'#34d399':(t.estado==='PENDIENTE'?'#fbbf24':'#f87171')};">${t.estado}</span></div>`).join("") || `<div style="font-size:11.5px;color:#64748b;">Aún no registra compras.</div>`}
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
                ${(esOperador || esDireccion) ? `<button id="mn-act" style="background:#059669;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">⭐ Fijar Semana ${menuSem} Activa</button>` : ""}
                ${(esOperador || esDireccion) ? `<button id="mn-ed" style="background:#b45309;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">${editandoMenu?"💾 Guardar Cambios":"✏️ Editar Platos"}</button>` : ""}
                <button id="mn-prt" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir Menú</button>
              </div>
            </div>

            <div style="background:#070d19;border-left:4px solid #10b981;padding:10px 12px;border-radius:8px;font-size:12px;color:#a7f3d0;margin-bottom:12px;">
              <b>Manual de Menú Oficial MEP (PANEA):</b> Proteína animal diaria, vegetales/picadillos tradicionales, fruta fresca de temporada y <b>agua fresca a libre demanda</b> (sin frescos azucarados). Horarios vigentes: ${cfg.horarios.map(h => `<b>${h.nom}:</b> ${h.hora}`).join(" • ")}.
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:760px;border-collapse:collapse;font-size:12px;">
                <tr style="background:#131f33;color:#38bdf8;">
                  <th style="padding:9px;text-align:left;">Día</th>
                  <th style="padding:9px;text-align:left;">Desayuno (25%)</th>
                  <th style="padding:9px;text-align:left;">Complemento (20%)</th>
                  <th style="padding:9px;text-align:left;">Almuerzo (30%)</th>
                  <th style="padding:9px;text-align:left;">Cena / Nocturno (30%)</th>
                  <th style="padding:9px;text-align:left;">Alérgenos</th>
                </tr>
                ${(menus[menuSem] || []).map((r, i) => `
                  <tr>
                    <td style="padding:9px;border-bottom:1px solid #1e293b;font-weight:800;color:#fbbf24;">${r.dia}</td>
                    ${["desayuno","comp","almuerzo","cena","alergenos"].map(k => `
                      <td style="padding:8px;border-bottom:1px solid #1e293b;vertical-align:top;">
                        ${editandoMenu ? `<textarea data-mi="${i}" data-mk="${k}" class="mn-in" rows="3" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;border-radius:6px;padding:5px;font-size:11.5px;">${r[k] || ""}</textarea>` : (r[k] || "")}
                      </td>
                    `).join("")}
                  </tr>
                `).join("")}
              </table>
            </div>
          ` : ""}

          ${tab === "caja" && esOperador ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;margin-bottom:14px;">
              <!-- Bandeja SINPE pendientes -->
              <div style="background:#070d19;border:1px solid #f59e0b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#fbbf24;">📲 Comprobantes SINPE Pendientes (${pendSinpe.length})</h3>
                ${pendSinpe.map(t => `
                  <div style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:10px;margin-bottom:8px;font-size:12px;">
                    <div><b>${t.nombre}</b> (${t.rol}) • <b>${t.cantidad} tiquetes</b></div>
                    <div style="color:#94a3b8;font-size:11.5px;">Monto: <b style="color:#34d399;">₡${t.montoTotal.toLocaleString("es-CR")}</b> • Comprobante: <b>${t.comprobante}</b></div>
                    <div style="display:flex;gap:6px;margin-top:8px;">
                      <button data-ap="${t.id}" class="sinpe-ok" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;">✅ Aprobar y Acreditar QR</button>
                      <button data-rj="${t.id}" class="sinpe-no" style="background:#7f1d1d;color:#fff;border:none;padding:6px 11px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">✕ Rechazar</button>
                    </div>
                  </div>
                `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">No hay comprobantes SINPE pendientes de revisión.</p>`}
              </div>

              <!-- Venta Directa Efectivo + Cierre de Caja -->
              <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">💵 Venta Directa en Efectivo & Cierre de Caja</h3>
                <form id="cash-f" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
                  <select id="cf-usr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
                    ${wallets.map(w => `<option value="${w.id}">${w.nombre} (${w.rol} • Saldo: ${w.saldo})</option>`).join("")}
                  </select>
                  <div style="display:flex;gap:6px;">
                    <select id="cf-qty" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
                      <option value="1">1 Tiquete</option>
                      <option value="5" selected>5 Tiquetes (Semana)</option>
                      <option value="10">10 Tiquetes (Quincena)</option>
                      <option value="20">20 Tiquetes (Mes)</option>
                    </select>
                    <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">💰 Cobrar Efectivo</button>
                  </div>
                </form>
                <div style="border-top:1px solid #1e293b;padding-top:10px;font-size:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                  <div>Hoy — Efectivo: <b style="color:#34d399;">₡${totEfectivo.toLocaleString("es-CR")}</b> | SINPE: <b style="color:#38bdf8;">₡${totSinpe.toLocaleString("es-CR")}</b></div>
                  <button id="caja-csv" style="background:#1d4ed8;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Cierre de Caja CSV</button>
                </div>
              </div>
            </div>

            <!-- Padrón de Becas PANEA, Saldos y Carga Masiva -->
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <h3 style="margin:0;font-size:15px;color:#38bdf8;">👥 Padrón de Comedor, Becas PANEA y Saldos (${wallets.length})</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button id="pad-add" style="background:#1d4ed8;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">+ Agregar Persona</button>
                  <button id="pad-bulk" style="background:#0f766e;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Carga Masiva CSV</button>
                </div>
              </div>
              <div style="overflow-x:auto;">
                <table style="width:100%;min-width:680px;border-collapse:collapse;font-size:12px;">
                  <tr style="background:#131f33;color:#cbd5e1;"><th style="padding:7px;text-align:left;">ID / Nombre</th><th style="padding:7px;text-align:left;">Rol / Sección</th><th style="padding:7px;text-align:center;">Beca PANEA</th><th style="padding:7px;text-align:center;">Tiquetes</th><th style="padding:7px;text-align:center;">Acciones</th></tr>
                  ${wallets.map(w => `<tr>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${w.nombre}</b><br/><span style="font-size:10.5px;color:#94a3b8;">${w.id} • ${w.email}</span></td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;">${w.rol} (${w.seccion})</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${w.becaPanea?'#059669':'#334155'};color:#fff;padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:800;">${w.becaPanea?'BECA ACTIVA':'Sin beca'}</span></td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;font-size:14px;font-weight:900;color:#38bdf8;">${w.saldo}</td>
                    <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                      <button data-wb="${w.id}" class="w-beca" style="background:#0f766e;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">${w.becaPanea?'Quitar Beca':'Activar Beca'}</button>
                      <button data-w1="${w.id}" class="w-plus" style="background:#1d4ed8;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">+5 Tiq.</button>
                    </td>
                  </tr>`).join("")}
                </table>
              </div>
            </div>
          ` : ""}

          ${tab === "stats" && (esDireccion || esOperador) ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;">
              <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Becados PANEA Hoy</div><div style="font-size:24px;font-weight:900;color:#34d399;">${totBecas}</div></div>
              <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Tiquetes Pagos Hoy</div><div style="font-size:24px;font-weight:900;color:#38bdf8;">${totPagos}</div></div>
              <div style="background:#070d19;border:1px solid #a855f7;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Pases de Equidad</div><div style="font-size:24px;font-weight:900;color:#c084fc;">${totEquidad}</div></div>
              <div style="background:#070d19;border:1px solid #f59e0b;border-radius:10px;padding:12px;text-align:center;"><div style="font-size:11px;color:#94a3b8;">Recaudación Hoy (Junta)</div><div style="font-size:20px;font-weight:900;color:#fbbf24;">₡${(totEfectivo + totSinpe).toLocaleString("es-CR")}</div></div>
            </div>

            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
              <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">⚙️ Configuración Multi-Institución (Junta, SINPE y Tarifas)</h3>
              <form id="cfg-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
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
                <div>
                  <label style="font-size:11px;color:#94a3b8;">Tarifa Estudiante sin beca (₡):</label>
                  <input id="cg-pe" type="number" min="0" value="${cfg.precioEstudiante}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div>
                  <label style="font-size:11px;color:#94a3b8;">Tarifa Docente / Personal (₡):</label>
                  <input id="cg-pd" type="number" min="0" value="${cfg.precioDocente}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
                </div>
                <div style="display:flex;align-items:flex-end;">
                  <button type="submit" style="width:100%;background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💾 Guardar Configuración</button>
                </div>
              </form>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".com-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-ct"); draw(); });

      if (tab === "ventanilla" && esOperador) {
        shell.querySelectorAll(".com-tu").forEach(b => b.onclick = () => { turno = b.getAttribute("data-tu"); semEstado = null; draw(); });
        const mountEl = document.getElementById("com-cam-mount");
        if (mountEl && window.BDS_QR_CAMERA) {
          camCtrl = window.BDS_QR_CAMERA.mount(mountEl, {
            autoStart: false,
            onScan: (code) => procesarLecturaQR(code)
          });
        }
        if (document.getElementById("sem-ovr")) document.getElementById("sem-ovr").onclick = async () => {
          await registrarConsumo(semEstado.wallet, "Autorización Excepcional Dirección", 0, true);
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
          semEstado = { color: "green", titulo: "🟢 EXCEPCIÓN AUTORIZADA — SERVICIO HABILITADO", detalle: `${semEstado.wallet.nombre} autorizado por ${sesion.nombre}.`, wallet: semEstado.wallet };
          draw();
        };
        if (document.getElementById("sem-cash1")) document.getElementById("sem-cash1").onclick = () => venderEfectivoRapido(semEstado.wallet, 1, true);
        if (document.getElementById("sem-cash5")) document.getElementById("sem-cash5").onclick = () => venderEfectivoRapido(semEstado.wallet, 5, true);
        if (document.getElementById("sem-sinpe")) document.getElementById("sem-sinpe").onclick = () => { tab = "caja"; draw(); };
        if (document.getElementById("sem-equidad")) document.getElementById("sem-equidad").onclick = async () => {
          await registrarConsumo(semEstado.wallet, "Pase de Equidad / Dirección (₡0)", 0, true);
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("green");
          semEstado = { color: "green", titulo: "🟢 PASE DE EQUIDAD REGISTRADO — PLATO GARANTIZADO", detalle: `${semEstado.wallet.nombre} atendido bajo principio de equidad estudiantil. Notificado a Dirección.`, wallet: semEstado.wallet };
          draw();
        };
      }

      if (tab === "tiquetes") {
        document.getElementById("com-buy-f").onsubmit = async (e) => {
          e.preventDefault();
          const qty = Number(document.getElementById("cb-qty").value);
          const ref = document.getElementById("cb-ref").value.trim();
          const unit = getTarifaUsuario(miWallet.rol, cfg);
          const total = qty * unit;
          const fecha = hoyISO(), hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
          const hash = (await sha256Hex(`${fecha}|${miWallet.email}|SINPE|${ref}|${total}`)).slice(0, 18);
          const arr = loadTrx();
          arr.unshift({ id: "SNP-" + String(arr.length + 101), fecha, hora, walletId: miWallet.id, nombre: miWallet.nombre, email: miWallet.email, rol: miWallet.rol, metodo: "SINPE", cantidad: qty, tarifaUnit: unit, montoTotal: total, comprobante: ref, estado: "PENDIENTE", aprobadoPor: "", hash });
          saveTrx(arr);
          alert(`✅ Comprobante SINPE #${ref} enviado a ${cfg.juntaTipo} por ${qty} tiquete(s) (₡${total.toLocaleString("es-CR")}). Al aprobarse se acreditarán automáticamente a tu Carné QR.`);
          draw();
        };
      }

      if (tab === "menus") {
        shell.querySelectorAll(".com-ms").forEach(b => b.onclick = () => { menuSem = b.getAttribute("data-ms"); editandoMenu = false; draw(); });
        if (document.getElementById("mn-act")) document.getElementById("mn-act").onclick = () => {
          cfg.semanaActiva = menuSem; saveCfg(cfg); draw();
        };
        if (document.getElementById("mn-ed")) document.getElementById("mn-ed").onclick = () => {
          if (editandoMenu) {
            const mAll = loadMenus();
            shell.querySelectorAll(".mn-in").forEach(ta => {
              const i = Number(ta.getAttribute("data-mi")), k = ta.getAttribute("data-mk");
              if (mAll[menuSem] && mAll[menuSem][i]) mAll[menuSem][i][k] = ta.value.trim();
            });
            saveMenus(mAll);
            editandoMenu = false;
          } else { editandoMenu = true; }
          draw();
        };
        document.getElementById("mn-prt").onclick = () => imprimirMenuSemanal(menuSem);
      }

      if (tab === "caja" && esOperador) {
        shell.querySelectorAll(".sinpe-ok").forEach(b => b.onclick = () => {
          const arr = loadTrx(), t = arr.find(x => x.id === b.getAttribute("data-ap"));
          if (!t) return;
          t.estado = "APROBADO"; t.aprobadoPor = sesion.nombre;
          saveTrx(arr);
          const ws = loadWallets(), w = ws.find(x => x.email.toLowerCase() === t.email.toLowerCase());
          if (w) { w.saldo += Number(t.cantidad || 0); saveWallets(ws); }
          draw();
        });
        shell.querySelectorAll(".sinpe-no").forEach(b => b.onclick = () => {
          const arr = loadTrx(), t = arr.find(x => x.id === b.getAttribute("data-rj"));
          if (!t) return;
          t.estado = "RECHAZADO"; t.aprobadoPor = sesion.nombre;
          saveTrx(arr); draw();
        });
        document.getElementById("cash-f").onsubmit = (e) => {
          e.preventDefault();
          const w = loadWallets().find(x => x.id === document.getElementById("cf-usr").value);
          const qty = Number(document.getElementById("cf-qty").value);
          if (w) venderEfectivoRapido(w, qty, false);
        };
        document.getElementById("caja-csv").onclick = () => {
          const rows = [["RECIBO","FECHA","HORA","NOMBRE","ROL","METODO","TIQUETES","TOTAL_CRC","COMPROBANTE","ESTADO","APROBADO_POR","SHA256"],
            ...loadTrx().map(t => [t.id, t.fecha, t.hora, t.nombre, t.rol, t.metodo, t.cantidad, t.montoTotal, t.comprobante, t.estado, t.aprobadoPor, t.hash])];
          const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
          a.download = `cierre-caja-comedor-${hoyISO()}.csv`;
          a.click();
        };
        shell.querySelectorAll(".w-beca").forEach(b => b.onclick = () => {
          const ws = loadWallets(), w = ws.find(x => x.id === b.getAttribute("data-wb"));
          if (w) { w.becaPanea = !w.becaPanea; saveWallets(ws); draw(); }
        });
        shell.querySelectorAll(".w-plus").forEach(b => b.onclick = () => {
          const w = loadWallets().find(x => x.id === b.getAttribute("data-w1"));
          if (w) venderEfectivoRapido(w, 5, false);
        });
        document.getElementById("pad-add").onclick = () => {
          const nom = prompt("Nombre completo:"); if (!nom) return;
          const mail = prompt("Correo institucional (ej: usuario@est.mep.go.cr):"); if (!mail) return;
          const r = confirm("¿Es Estudiante? (Aceptar = Estudiante | Cancelar = Docente MEP)") ? "Estudiante" : "Docente MEP";
          const beca = r === "Estudiante" ? confirm("¿Tiene Beca PANEA activa?") : false;
          const ws = loadWallets();
          ws.unshift({ id: "COM-" + String(Date.now()).slice(-4), nombre: nom.trim(), email: mail.trim().toLowerCase(), rol: r, seccion: r === "Estudiante" ? "10-1" : "Docente", becaPanea: beca, saldo: 0, qrCode: `COMEDOR|${mail.trim().toLowerCase()}` });
          saveWallets(ws); draw();
        };
        document.getElementById("pad-bulk").onclick = () => {
          const txt = prompt("Pegue líneas CSV (Nombre,Correo,Rol,Beca SI/NO,Saldo):\nEjemplo:\nAna Pérez,ana.perez@est.mep.go.cr,Estudiante,SI,0");
          if (!txt) return;
          const ws = loadWallets();
          let added = 0;
          txt.split(/\r?\n/).forEach(line => {
            const p = line.split(",").map(s => s.trim());
            if (p.length >= 2 && p[1].includes("@")) {
              ws.push({ id: "COM-" + String(Date.now() + added).slice(-4), nombre: p[0], email: p[1].toLowerCase(), rol: p[2] || "Estudiante", seccion: "Padrón", becaPanea: /^s[ií]|true|1$/i.test(p[3] || ""), saldo: Number(p[4] || 0), qrCode: `COMEDOR|${p[1].toLowerCase()}` });
              added++;
            }
          });
          saveWallets(ws);
          alert(`✅ Se cargaron ${added} registro(s) al padrón del comedor.`);
          draw();
        };
      }

      if (tab === "stats" && (esDireccion || esOperador)) {
        document.getElementById("cfg-f").onsubmit = (e) => {
          e.preventDefault();
          cfg.juntaTipo = document.getElementById("cg-jt").value;
          cfg.juntaNombre = document.getElementById("cg-jn").value.trim() || cfg.juntaNombre;
          cfg.sinpeJunta = document.getElementById("cg-sp").value.trim() || cfg.sinpeJunta;
          cfg.precioEstudiante = Math.max(0, Number(document.getElementById("cg-pe").value || 0));
          cfg.precioDocente = Math.max(0, Number(document.getElementById("cg-pd").value || 0));
          saveCfg(cfg);
          alert("✅ Configuración institucional de comedor actualizada.");
          draw();
        };
      }
    }

    draw();
  };
})();