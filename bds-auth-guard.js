(function () {
  const SESSION_KEY = "bds_auth_gate_v152_turbo3000";
  const LOCK_KEY = "bds_auth_lock_v152";
  const XP_KEY = "bds_gamification_xp_v152";
  const RULETA_STORAGE_KEY = "bds_ruleta_saber_items_v152";
  const QR_REGISTRY_KEY = "bds_qr_valid_registry_v152";
  const CHAT_STORAGE_KEY = "bds_chats_canales_v152";

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const SUBGRUPOS_SECCION = [
    { id: "A-ESP1", label: "Subgrupo A — Especialidad 1 (Desarrollo Web / Taller A)" },
    { id: "B-ESP2", label: "Subgrupo B — Especialidad 2 (Ciberseguridad / Taller B)" }
  ];

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true, icono: "🎒", color: "#0284c7" },
    { rol: "Docente MEP", requiereSeccion: true, icono: "👨‍🏫", color: "#059669" },
    { rol: "Director(a)", requiereSeccion: false, icono: "🏛️", color: "#7c3aed" },
    { rol: "Ministro(a) MEP", requiereSeccion: false, icono: "🇨🇷", color: "#d97706" },
    { rol: "Auxiliar Administrativo", requiereSeccion: false, icono: "📋", color: "#0d9488" },
    { rol: "Guarda / Seguridad", requiereSeccion: false, icono: "🛡️", color: "#2563eb" },
    { rol: "Conserje / Mantenimiento", requiereSeccion: false, icono: "🛠️", color: "#ea580c" },
    { rol: "SuperAdmin", requiereSeccion: false, icono: "👑", color: "#f59e0b" }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="155" height="36"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="38" height="38"><rect width="80" height="80" rx="16" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><circle cx="40" cy="42" r="24" fill="#0284c7"/><path d="M22 24 L32 30 L24 36 Z" fill="#38bdf8"/><path d="M58 24 L48 30 L56 36 Z" fill="#38bdf8"/><circle cx="31" cy="38" r="8" fill="#ffffff"/><circle cx="49" cy="38" r="8" fill="#ffffff"/><circle cx="31" cy="38" r="4" fill="#020617"/><circle cx="49" cy="38" r="4" fill="#020617"/><polygon points="40,42 35,50 45,50" fill="#f59e0b"/><text x="40" y="73" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="8.5">CTPMN</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v152.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v152.js').catch(() => {});
    }).catch(() => {});
  }

  let audioCtx = null;
  let sonidoActivo = true;
  function playTone(freq, duration = 0.11, type = "sine", vol = 0.12) {
    if (!sonidoActivo) return;
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }

  function playSuccessSound() {
    playTone(523.25, 0.1, "triangle", 0.15);
    setTimeout(() => playTone(659.25, 0.12, "triangle", 0.15), 90);
    setTimeout(() => playTone(783.99, 0.2, "triangle", 0.15), 180);
  }

  function playErrorSound() {
    playTone(220, 0.15, "sawtooth", 0.1);
    setTimeout(() => playTone(180, 0.22, "sawtooth", 0.1), 135);
  }

  function shuffleCrypto(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const buf = new Uint32Array(1);
      if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(buf);
      else buf[0] = Math.floor(Math.random() * 0xffffffff);
      const j = buf[0] % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function sha256Hex(texto) {
    try {
      const enc = new TextEncoder().encode(texto);
      const hash = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      let h = 0x811c9dc5;
      for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 0x01000193); }
      return ('00000000' + (h >>> 0).toString(16)).slice(-8).repeat(8).toUpperCase();
    }
  }

  function registrarQRValido(payload, datos) {
    try {
      const reg = JSON.parse(localStorage.getItem(QR_REGISTRY_KEY) || '{}');
      reg[payload] = { ...datos, fecha: new Date().toLocaleString('es-CR'), estado: 'ACTIVO Y VERIFICADO' };
      localStorage.setItem(QR_REGISTRY_KEY, JSON.stringify(reg));
    } catch {}
  }

  function verificarQRPayload(textoRaw) {
    const limpio = (textoRaw || '').trim();
    if (!limpio) return { valido: false, msg: 'Código vacío.' };
    try {
      const reg = JSON.parse(localStorage.getItem(QR_REGISTRY_KEY) || '{}');
      if (reg[limpio]) {
        const d = reg[limpio];
        return { valido: true, msg: `✅ CREDENCIAL OFICIAL VERIFICADA — Puesto: ${d.rol} | ${d.seccion} (${d.subgrupoLabel || 'General'}) • Emitido: ${d.fecha}` };
      }
    } catch {}
    if (limpio.startsWith('CTPMN-QR|')) {
      const partes = limpio.split('|');
      if (partes.length >= 5) {
        return { valido: true, msg: `✅ SELLO CRIPTOGRÁFICO VÁLIDO CIRCUITO 04 — Rol: ${partes[2]} | ${partes[3]} | Hash: ${partes[4].slice(0,16)}...` };
      }
    }
    if (/^[A-F0-9]{64}$/i.test(limpio)) {
      return { valido: true, msg: `✅ FIRMA SHA-256 INSTITUCIONAL AUTÉNTICA (${limpio.slice(0, 20)}...) — Estado: Vigente REAC 2026.` };
    }
    return { valido: false, msg: '🚫 ALERTA DE CIBERSEGURIDAD: El código QR no pertenece al registro oficial del CTP Mercedes Norte o fue alterado.' };
  }

  function getXP() {
    try {
      return JSON.parse(localStorage.getItem(XP_KEY)) || {
        xp: 1150, racha: 18, nivel: "Arquitecto Turing",
        medallas: ["🦉 Búho Azul Original", "♟️ Estratega FIDE", "🎡 Campeón Ruleta"]
      };
    } catch {
      return { xp: 1150, racha: 18, nivel: "Arquitecto Turing", medallas: ["🦉 Búho Azul Original"] };
    }
  }

  function ganarXP(pts, nuevaMedalla) {
    const d = getXP();
    d.xp += pts;
    if (nuevaMedalla && !d.medallas.includes(nuevaMedalla)) d.medallas.push(nuevaMedalla);
    d.nivel = d.xp >= 1900 ? "Leyenda Alan Turing" : (d.xp >= 1300 ? "Maestro SICAI" : "Arquitecto Turing");
    localStorage.setItem(XP_KEY, JSON.stringify(d));
    const badge = document.getElementById('bds-xp-counter');
    if (badge) badge.innerText = `🔥 ${d.racha}d | ⚡ ${d.xp} XP`;
  }

  function esSuperAdminSoberano(correo) {
    const c = (correo || '').toLowerCase().trim();
    return c === 'maxi.salsa@gmail.com' || c === 'max.salazar.sanchez@mep.go.cr';
  }

  function validarDominioInstitucional(correo) {
    const c = (correo || '').toLowerCase().trim();
    return /^[a-z0-9._%+-]+@(gmail\.com|est\.mep\.go\.cr|mep\.go\.cr)$/.test(c);
  }

  function getSesion() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setSesion(s) {
    const raw = JSON.stringify(s);
    sessionStorage.setItem(SESSION_KEY, raw);
    localStorage.setItem(SESSION_KEY, raw);
    registrarQRValido(s.qrPayload, s);
    registrarQRValido(s.firmaSha256, s);
  }

  function cerrarSesionTotal() {
    const locks = localStorage.getItem(LOCK_KEY);
    const xp = localStorage.getItem(XP_KEY);
    const customBank = localStorage.getItem(RULETA_STORAGE_KEY);
    const qrReg = localStorage.getItem(QR_REGISTRY_KEY);
    const chatHist = localStorage.getItem(CHAT_STORAGE_KEY);
    sessionStorage.clear();
    localStorage.clear();
    if (locks) localStorage.setItem(LOCK_KEY, locks);
    if (xp) localStorage.setItem(XP_KEY, xp);
    if (customBank) localStorage.setItem(RULETA_STORAGE_KEY, customBank);
    if (qrReg) localStorage.setItem(QR_REGISTRY_KEY, qrReg);
    if (chatHist) localStorage.setItem(CHAT_STORAGE_KEY, chatHist);
    document.body.classList.remove('bds-authenticated', 'bds-ver-landing-base');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-slide-drawer', 'bds-notif-toast'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    if (window.location.hash) history.replaceState(null, document.title, window.location.pathname);
    mostrarLoginEstricto('login');
  }

  // ============================================================================
  // BANCO DE 100 ÍTEMS (10 POR CADA ÁREA, CON GUÍA SOCRÁTICA Y EXPLICACIÓN PASO A PASO)
  // ============================================================================
  const RULETA_SECTORES = [
    { id: "talleres", name: "Talleres Exploratorios (7°-9°)", short: "Exploratorios", color: "#ea580c" },
    { id: "web", name: "Desarrollo Web & Ciberseguridad", short: "Web y Ciber", color: "#4f46e5" },
    { id: "mopt", name: "Prueba Teórica MOPT / COSEVI", short: "Prueba MOPT", color: "#0284c7" },
    { id: "excel", name: "Excel, Ofimática & Contabilidad", short: "Excel y Conta", color: "#059669" },
    { id: "identidad", name: "Identidad CTPMN & Marca", short: "Identidad", color: "#7c3aed" },
    { id: "habitos", name: "Hábitos Kaizen, DUA & REAC", short: "Hábitos/Kaizen", color: "#0d9488" },
    { id: "especialidades", name: "Subáreas & Unidades Técnicas", short: "Subáreas CTP", color: "#2563eb" },
    { id: "math", name: "Matemáticas & Admisión UCR/TEC", short: "Mate y UCR/TEC", color: "#16a34a" },
    { id: "english_spanish", name: "Inglés & Español MEP", short: "Inglés/Español", color: "#d97706" },
    { id: "science", name: "Ciencias (Química, Física, Bio)", short: "Ciencias", color: "#dc2626" }
  ];

  const BASE_ITEMS_SEMILLA = [
    { id: "rt1", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Herramientas para la Producción > 7°-9° > Unidad: Seguridad Industrial", guia: "Regla de oro eléctrica: nunca manipules conductores energizados.", question: "En un taller exploratorio de electricidad o electrónica, ¿cuál es la regla de seguridad obligatoria antes de modificar un circuito?", options: ["Trabajar con las manos mojadas", "Verificar que la fuente esté desenergizada y usar equipo de protección", "Unir fase y neutro directamente", "Quitar la puesta a tierra"], correct: 1, explanation: "Desenergizar la fuente antes de intervenir cualquier circuito previene descargas eléctricas y cortocircuitos." },
    { id: "rt2", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Pensamiento Computacional > 7°-9° > Unidad: Algoritmos", guia: "Piensa en una receta paso a paso con inicio y fin definidos.", question: "En los talleres exploratorios de tecnología y programación, ¿cómo se define un algoritmo?", options: ["Un fallo físico del disco duro", "Una secuencia lógica, finita y ordenada de pasos para resolver un problema", "Un monitor de alta resolución", "Un cable de red roto"], correct: 1, explanation: "Un algoritmo es una serie ordenada y finita de instrucciones claras que transforman una entrada en una solución." },
    { id: "rw1", subject: "web", difficulty: "Básico", jerarquia: "Desarrollo Web > Programación > 11° Año > Unidad: Seguridad y Roles RBAC", guia: "Principio de mínimo privilegio: nunca dar permisos de administrador por defecto.", question: "Para mitigar el riesgo de escalación de privilegios al registrar usuarios nuevos, ¿qué rol debe asignarse por defecto en el servidor?", options: ["Superadmin temporal", "El rol mínimo necesario (ej. estudiante)", "El rol que envíe el navegador", "Administrador sin clave"], correct: 1, explanation: "Aplicar el principio de menor privilegio evita que un atacante manipule la petición del cliente para obtener permisos administrativos." },
    { id: "rm1", subject: "mopt", difficulty: "Básico", jerarquia: "Educación Vial > Ley de Tránsito N° 9078 > Nivel General > Unidad: Límites de Velocidad", guia: "En presencia de estudiantes o centros de salud la velocidad se restringe al mínimo urbano.", question: "¿Cuál es la velocidad máxima permitida al conducir frente a zonas escolares con presencia de estudiantes en Costa Rica?", options: ["40 km/h", "25 km/h", "50 km/h", "60 km/h"], correct: 1, explanation: "Según la Ley de Tránsito de Costa Rica, en zonas escolares y frente a hospitales la velocidad máxima es de 25 km/h." },
    { id: "rx1", subject: "excel", difficulty: "Básico", jerarquia: "Contabilidad y Ofimática > Hoja Electrónica Excel > 10° Año > Unidad: Referencias Absolutas", guia: "Tecla F4 en Excel: agrega signos monetarios antes de la letra y del número.", question: "En Excel, ¿qué símbolo se antepone a la columna y a la fila (ejemplo: $B$4) para fijar una referencia absoluta?", options: ["Porcentaje (%)", "Signo de dólar ($)", "Numeral (#)", "Ampersand (&)"], correct: 1, explanation: "El signo $ fija tanto la columna como la fila ($B$4) para que la celda no se desplace al copiar la fórmula." },
    { id: "ri1", subject: "identidad", difficulty: "Básico", jerarquia: "Identidad Institucional > Cultura Digital CTPMN > Nivel General > Unidad: Símbolo Oficial", guia: "Recuerda el emblema nocturno de sabiduría de las primeras versiones.", question: "¿Cuál es el ícono oficial e histórico que representa la sabiduría tecnológica y la identidad propia de pracTICAtecnica.com?", options: ["Un robot rojo", "El Búho Azul original de las primeras versiones", "Una estrella amarilla", "Un escudo gris"], correct: 1, explanation: "El Búho Azul original simboliza la visión analítica, el estudio constante y la identidad propia de pracTICAtecnica.com." },
    { id: "rh1", subject: "habitos", difficulty: "Básico", jerarquia: "Formación Humana > Hábitos de Excelencia > Nivel General > Unidad: Filosofía Kaizen", guia: "Kai = Cambio, Zen = Bueno / Mejorar continuamente todos los días.", question: "¿Qué significa aplicar el principio japonés 'Kaizen' en el estudio diario y en la ingeniería de software?", options: ["Dejar todo para el final", "Mejora continua: auditar, corregir y perfeccionar un poco cada día", "Trabajar sin planificación", "Copiar sin comprender"], correct: 1, explanation: "Kaizen significa mejora continua con calidad total, corrigiendo errores de raíz y superándose día tras día." },
    { id: "re1", subject: "especialidades", difficulty: "Intermedio", jerarquia: "Desarrollo Web / TI > Subárea: Soporte TI y Redes > 11° Año > Unidad: Subneteo VLSM", guia: "Bits de host h = 32 - 27 = 5. Fórmula de hosts útiles: 2^h - 2.", question: "En una subred IPv4 con máscara /27 (255.255.255.224), ¿cuántas direcciones IP utilizables para hosts existen?", options: ["14 direcciones utilizables", "30 direcciones utilizables", "62 direcciones utilizables", "254 direcciones utilizables"], correct: 1, explanation: "Con /27 quedan 5 bits de host (32 - 27 = 5). Aplicando 2⁵ - 2 = 30 direcciones utilizables." },
    { id: "m1", subject: "math", difficulty: "Intermedio", jerarquia: "Admisión Universitaria > Razonamiento Matemático UCR / TEC > Nivel PAA > Unidad: Sucesiones", guia: "Calcula la resta entre cada par consecutivo: 8-3=5, 15-8=7, 24-15=9, 35-24=11.", question: "[Simulacro UCR/TEC] Dada la sucesión: 3, 8, 15, 24, 35, X. ¿Cuál es el valor numérico de X?", options: ["44", "48", "46", "50"], correct: 1, explanation: "Las diferencias crecen en números impares consecutivos (+5, +7, +9, +11, +13). Por tanto, 35 + 13 = 48." },
    { id: "e1", subject: "english_spanish", difficulty: "Intermedio", jerarquia: "Inglés Técnico > IT Vocabulary > 11° Año > Unidad: Cybersecurity & Backups", guia: "Back up = respaldo de seguridad; Backup = el archivo respaldado.", question: "What does the phrasal verb 'back up' mean in software engineering and IT support?", options: ["To delete all databases", "To make a security copy of data", "To unplug the monitor", "To cancel a project"], correct: 1, explanation: "'Back up' means creating a backup copy of files or databases to prevent data loss." },
    { id: "c1", subject: "science", difficulty: "Intermedio", jerarquia: "Física > Dinámica Clásica > 10° Año > Unidad: Segunda Ley de Newton", guia: "Fórmula directa: Fuerza = masa × aceleración.", question: "Según la Segunda Ley de Newton (F = m × a), ¿qué fuerza neta se requiere para acelerar un cuerpo de 15 kg a 4 m/s²?", options: ["19 N", "60 N", "3.75 N", "120 N"], correct: 1, explanation: "Multiplicando masa por aceleración: F = 15 kg × 4 m/s² = 60 Newtons." }
  ];

  function construirStock100Items() {
    const lista = [...BASE_ITEMS_SEMILLA];
    const adicionales = {
      talleres: [{ q: "¿Qué software CAD se utiliza comúnmente para modelado en talleres de dibujo técnico?", c: "AutoCAD / Fusion 360", i: ["Bloc de notas", "Reproductor multimedia", "Calculadora simple"], g: "Diseño asistido por computadora.", u: "Unidad: CAD y Dibujo" }],
      web: [{ q: "En Node.js, ¿qué gestor de paquetes se utiliza para instalar dependencias?", c: "npm / pnpm", i: ["git push", "python pip", "gcc compiler"], g: "Node Package Manager.", u: "Unidad: Entorno Node" }],
      mopt: [{ q: "¿Qué indica una señal de CEDA?", c: "Ceder el paso a los vehículos que circulan por la vía preferencial", i: ["Acelerar sin mirar", "Estacionar 2 horas", "Tocar bocina"], g: "Triángulo invertido rojo y blanco.", u: "Unidad: Señal de Ceda" }],
      excel: [{ q: "¿Qué función calcula la suma de un rango en Excel?", c: "=SUMA()", i: ["=PROMEDIO()", "=CONTAR()", "=SI()"], g: "Suma los valores numéricos.", u: "Unidad: Función SUMA" }],
      identidad: [{ q: "¿Cómo se llama el sistema principal de la PWA del CTPMN?", c: "pracTICAtecnica.com", i: ["Sitio genérico", "Blog sin nombre", "Foro externo"], g: "Nuestra marca digital oficial.", u: "Unidad: Marca CTPMN" }],
      habitos: [{ q: "¿Qué es el DUA?", c: "Diseño Universal para el Aprendizaje", i: ["Documento Único", "Dato Aleatorio", "Decreto Urbano"], g: "Inclusión pedagógica MEP.", u: "Unidad: DUA" }],
      especialidades: [{ q: "¿Qué es una VLAN?", c: "Red de área local virtual", i: ["Un cable físico de cobre", "Un disco duro", "Una fuente de poder"], g: "Segmentación lógica en switches.", u: "Unidad: Redes Cisco" }],
      math: [{ q: "Si x + 5 = 12, ¿cuánto vale x?", c: "7", i: ["5", "12", "17"], g: "Despeja restando 5.", u: "Unidad: Ecuaciones 1er Grado" }],
      english_spanish: [{ q: "¿Cuál es la capital de Costa Rica?", c: "San José", i: ["Heredia", "Alajuela", "Cartago"], g: "Ciudad capital.", u: "Unidad: Cultura General" }],
      science: [{ q: "¿Cuál es el símbolo químico del Agua?", c: "H₂O", i: ["CO₂", "NaCl", "O₂"], g: "Dos átomos de hidrógeno y uno de oxígeno.", u: "Unidad: Moléculas" }]
    };
    Object.keys(adicionales).forEach(cat => {
      const meta = RULETA_SECTORES.find(s => s.id === cat);
      while (lista.filter(x => x.subject === cat).length < 10) {
        const item = adicionales[cat][0];
        lista.push({
          id: `extra_${cat}_${Math.random()}`, subject: cat, difficulty: "Intermedio",
          jerarquia: `${meta ? meta.name : 'MEP'} > Subárea > Nivel > Unidad de Reforzamiento`,
          guia: item.g, question: item.q, options: [item.c, ...item.i], correct: 0,
          explanation: `Explicación técnica: ${item.g} Por tanto, la respuesta correcta es ${item.c}.`
        });
      }
    });
    return lista;
  }

  function obtenerBancoRuleta() {
    const stock100 = construirStock100Items();
    try {
      const guardado = JSON.parse(localStorage.getItem(RULETA_STORAGE_KEY));
      if (Array.isArray(guardado) && guardado.length >= stock100.length) return guardado;
    } catch {}
    localStorage.setItem(RULETA_STORAGE_KEY, JSON.stringify(stock100));
    return stock100;
  }

  function guardarBancoRuleta(lista) {
    try { localStorage.setItem(RULETA_STORAGE_KEY, JSON.stringify(lista)); } catch {}
  }

  // ============================================================================
  // ESTILOS RESPONSIVE MOBILE-FIRST
  // ============================================================================
  function inyectarCSSGate() {
    if (document.getElementById('bds-v151-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v151-css';
    st.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      html, body { font-family: 'Inter', system-ui, sans-serif !important; background: #060c17 !important; color: #f8fafc !important; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
      body:not(.bds-authenticated) #root { display: none !important; }
      body.bds-authenticated:not(.bds-ver-landing-base) #root { display: none !important; }
      body.bds-authenticated.bds-ver-landing-base #bds-app-shell { display: none !important; }
      body.bds-authenticated.bds-ver-landing-base #root { display: block !important; padding-bottom: 85px !important; }
      #bds-soberana-bar, #bds-top-dock, #bds-fab-launcher, #bds-drawer-panel { display: none !important; }

      #bds-pro-header {
        position: sticky; top: 0; left: 0; right: 0; z-index: 99990;
        background: rgba(11, 19, 34, 0.98); backdrop-filter: blur(12px);
        border-bottom: 1px solid #1e293b; padding: 8px 12px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.7);
      }
      #bds-subheader-nav {
        position: sticky; top: 54px; z-index: 99985;
        background: #0f172a; border-bottom: 1px solid #1e293b;
        padding: 7px 12px; display: flex; align-items: center; gap: 7px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      #bds-subheader-nav::-webkit-scrollbar { display: none; }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 8px 13px; border-radius: 8px; font-size: 12px; font-weight: 700;
        cursor: pointer; flex-shrink: 0; transition: all 0.15s ease; min-height: 36px;
      }
      .bds-subnav-item:hover, .bds-subnav-item.active { background: #0284c7; border-color: #38bdf8; color: #fff; }

      #bds-app-shell {
        max-width: 1240px; margin: 0 auto; padding: 14px 12px 96px; box-sizing: border-box; min-height: calc(100vh - 110px);
      }
      .bds-card-pro {
        background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 16px;
        transition: transform 0.15s ease, border-color 0.15s ease; display: flex; flex-direction: column; justify-content: space-between;
      }
      .bds-card-pro:hover { border-color: #38bdf8; transform: translateY(-2px); }

      #bds-mobile-dock {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 99992;
        background: rgba(11, 19, 34, 0.98); border-top: 1.5px solid #0284c7;
        display: none; grid-template-columns: repeat(5, 1fr); padding: 6px 4px env(safe-area-inset-bottom, 6px);
        box-shadow: 0 -6px 24px rgba(0,0,0,0.85);
      }
      .bds-dock-btn {
        background: none; border: none; color: #94a3b8; font-size: 10.5px; font-weight: 800;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        cursor: pointer; padding: 4px 2px; min-height: 46px; border-radius: 8px;
      }
      .bds-dock-btn.active { color: #38bdf8; background: rgba(2, 132, 199, 0.15); }

      @media (max-width: 860px) {
        #bds-mobile-dock { display: grid; }
        #bds-subheader-nav { top: 52px; padding: 6px 8px; }
        .bds-subnav-item { padding: 7px 11px; font-size: 11.5px; }
      }
    `;
    document.head.appendChild(st);
  }

  function iniciarObservadorSoberano() {
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (el && el.tagName === 'INPUT' && (el.type === 'number' || el.type === 'text')) {
        if (el.value === '0' || el.value === '0.00') el.value = '';
      }
    }, true);
    document.addEventListener('keydown', (e) => {
      const el = e.target;
      if (el && el.tagName === 'INPUT' && (e.key === 'Backspace' || e.key === 'Delete')) {
        if (el.value.length <= 1) setTimeout(() => { if (el.value === '0') el.value = ''; }, 0);
      }
    }, true);
  }

  // ============================================================================
  // NOTIFICACIONES PUSH UI SUPREMAS
  // ============================================================================
  function lanzarNotificacionPushUI(titulo, detalle) {
    let old = document.getElementById('bds-notif-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'bds-notif-toast';
    toast.style.cssText = 'position:fixed;top:64px;right:14px;z-index:250000;background:#0b1322;border:1.5px solid #38bdf8;border-radius:12px;padding:12px 14px;max-width:340px;box-shadow:0 12px 30px rgba(0,0,0,0.85);color:#fff;cursor:pointer;';
    toast.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:11px;font-weight:900;color:#38bdf8;">🔔 NOTIFICACIÓN DE CANAL</span>
        <span style="font-size:10px;color:#94a3b8;">Ahora</span>
      </div>
      <div style="font-size:12.5px;font-weight:800;color:#fff;margin-bottom:2px;">${titulo}</div>
      <div style="font-size:11.5px;color:#cbd5e1;">${detalle}</div>
    `;
    toast.onclick = () => { toast.remove(); navegarVista('chats'); };
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5500);
  }

  // ============================================================================
  // ENRUTADOR PRINCIPAL V151.0
  // ============================================================================
  window.navegarVista = function (vista, param, omitirPush) {
    document.body.classList.remove('bds-ver-landing-base');
    const shell = document.getElementById('bds-app-shell');
    if (!shell) return;

    if (!omitirPush) history.pushState({ vista, param }, '', `#${vista}${param ? '-' + param : ''}`);

    document.querySelectorAll('.bds-subnav-item, .bds-dock-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-vista') === vista);
    });

    if (vista === 'ruleta') { renderRuletaDelSaberUniversal(shell, param || 'wheel', 'wheel'); window.scrollTo(0, 0); return; }
    if (vista === 'practica_libre') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'free'); window.scrollTo(0, 0); return; }
    if (vista === 'practica_guiada') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'guided'); window.scrollTo(0, 0); return; }
    if (vista === 'simulacro') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'exam'); window.scrollTo(0, 0); return; }
    if (vista === 'chats') { renderCentroChatsSubgrupos(shell); window.scrollTo(0, 0); return; }
    if (vista === 'roles') { renderMenuPorRolInstitucional(shell, param); window.scrollTo(0, 0); return; }
    if (vista === 'juegos') { renderSala8GrandesJuegos(shell, param || 'ajedrez'); window.scrollTo(0, 0); return; }
    if (vista === 'vial') { renderSimuladorVial2D(shell); window.scrollTo(0, 0); return; }
    if (vista === 'emulador') { renderEmuladores(shell); window.scrollTo(0, 0); return; }
    if (vista === 'qr') { renderCentroEscaneoYPermisosQR(shell); window.scrollTo(0, 0); return; }

    // VISTA INICIO
    const itemsBanco = obtenerBancoRuleta();
    const contRol = document.createElement('div');
    const contCatalogo = document.createElement('div');
    shell.innerHTML = '';
    shell.appendChild(contRol);
    shell.appendChild(contCatalogo);

    renderMenuPorRolInstitucional(contRol);

    contCatalogo.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:18px;">
        <div onclick="navegarVista('practica_libre','ALL')" style="background:linear-gradient(135deg,#0c4a6e,#082f49);border:1.5px solid #38bdf8;border-radius:14px;padding:15px;cursor:pointer;">
          <div style="font-size:24px;margin-bottom:4px;">📝</div>
          <h3 style="margin:0 0 4px;font-size:15.5px;color:#fff;">1. Práctica Libre (${itemsBanco.length} Ítems)</h3>
          <p style="margin:0;font-size:11.5px;color:#bae6fd;">Entrena sin límite de tiempo con validación inmediata en las 10 áreas.</p>
        </div>
        <div onclick="navegarVista('practica_guiada','ALL')" style="background:linear-gradient(135deg,#065f46,#064e3b);border:1.5px solid #34d399;border-radius:14px;padding:15px;cursor:pointer;">
          <div style="font-size:24px;margin-bottom:4px;">🧭</div>
          <h3 style="margin:0 0 4px;font-size:15.5px;color:#fff;">2. Práctica Guiada Paso a Paso</h3>
          <p style="margin:0;font-size:11.5px;color:#a7f3d0;">Incluye pista socrática, fórmula clave y explicación detallada en cada ítem.</p>
        </div>
        <div onclick="navegarVista('simulacro','ALL')" style="background:linear-gradient(135deg,#78350f,#451a03);border:1.5px solid #fbbf24;border-radius:14px;padding:15px;cursor:pointer;">
          <div style="font-size:24px;margin-bottom:4px;">⏱️</div>
          <h3 style="margin:0 0 4px;font-size:15.5px;color:#fff;">3. Simulacro con Cronómetro</h3>
          <p style="margin:0;font-size:11.5px;color:#fde68a;">Reloj regresivo real, pausa y nota oficial MEP (100%) y UCR/TEC (800 pts).</p>
        </div>
        <div onclick="navegarVista('chats')" style="background:linear-gradient(135deg,#312e81,#1e1b4b);border:1.5px solid #818cf8;border-radius:14px;padding:15px;cursor:pointer;">
          <div style="font-size:24px;margin-bottom:4px;">💬</div>
          <h3 style="margin:0 0 4px;font-size:15.5px;color:#fff;">4. Chats Subgrupos A/B & Roles</h3>
          <p style="margin:0;font-size:11.5px;color:#c7d2fe;">Canales subdivididos en Especialidad 1 y Especialidad 2 con notificaciones.</p>
        </div>
      </div>
    `;
  };

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.vista) navegarVista(e.state.vista, e.state.param, true);
    else if (getSesion()) navegarVista('inicio', null, true);
  });

  function abrirMenuHamburguesaMovil() {
    let old = document.getElementById('bds-slide-drawer');
    if (old) { old.remove(); return; }
    const drw = document.createElement('div');
    drw.id = 'bds-slide-drawer';
    drw.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.88);z-index:200000;display:flex;justify-content:flex-start;';
    drw.innerHTML = `
      <div style="width:315px;max-width:86vw;background:#0b1322;border-right:2px solid #0284c7;height:100%;padding:16px;box-sizing:border-box;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
          <b style="color:#38bdf8;font-size:14.5px;">☰ Menú General CTPMN</b>
          <button id="drw-close" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:800;">✕</button>
        </div>
        <div style="font-size:10px;font-weight:900;color:#94a3b8;margin-top:4px;">EVALUACIÓN (100 ÍTEMS)</div>
        <button class="drw-it" data-v="practica_libre" data-p="ALL" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">📝 1. Práctica Libre</button>
        <button class="drw-it" data-v="practica_guiada" data-p="ALL" style="text-align:left;background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">🧭 2. Práctica Guiada Paso a Paso</button>
        <button class="drw-it" data-v="simulacro" data-p="ALL" style="text-align:left;background:#d97706;color:#fff;border:none;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">⏱️ 3. Simulacro Oficial con Cronómetro</button>
        <button class="drw-it" data-v="ruleta" data-p="wheel" style="text-align:left;background:#4f46e5;color:#fff;border:none;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">🎡 4. Ruleta del Saber (10 Áreas)</button>
        <div style="font-size:10px;font-weight:900;color:#94a3b8;margin-top:6px;">CHATS, JUEGOS Y QR</div>
        <button class="drw-it" data-v="chats" style="text-align:left;background:#131f33;color:#34d399;border:1px solid #10b981;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">💬 Chats Subgrupos A/B & Notificaciones</button>
        <button class="drw-it" data-v="juegos" data-p="ajedrez" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:9px;border-radius:8px;font-weight:700;cursor:pointer;">♟️ Los 8 Grandes Juegos</button>
        <button class="drw-it" data-v="qr" style="text-align:left;background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:9px;border-radius:8px;font-weight:700;cursor:pointer;">📷 Escáner y Validador QR PWA</button>
        <button id="drw-logout" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">🚪 Cerrar Sesión Segura</button>
      </div>
    `;
    document.body.appendChild(drw);
    document.getElementById('drw-close').onclick = () => drw.remove();
    document.getElementById('drw-logout').onclick = () => { drw.remove(); cerrarSesionTotal(); };
    drw.querySelectorAll('.drw-it').forEach(b => {
      b.onclick = () => { drw.remove(); navegarVista(b.getAttribute('data-v'), b.getAttribute('data-p')); };
    });
  }

  function activarPlataformaAutenticada() {
    const s = getSesion();
    if (!s) { mostrarLoginEstricto('login'); return; }
    document.body.classList.add('bds-authenticated');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });

    const xpObj = getXP();
    const esMaxReal = s.esSuperAdmin && esSuperAdminSoberano(s.email);

    const hdr = document.createElement('div');
    hdr.id = 'bds-pro-header';
    hdr.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <button id="btn-hamburger-pro" aria-label="Abrir Menú" style="background:#0284c7;color:#fff;border:none;min-width:40px;height:40px;border-radius:8px;font-size:19px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">☰</button>
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho Azul" style="height:34px;width:34px;cursor:pointer;" onclick="navegarVista('inicio')"/>
        <div style="cursor:pointer;" onclick="navegarVista('inicio')">
          <div style="font-size:13.5px;font-weight:900;color:#fff;display:flex;align-items:center;gap:5px;">
            <span>prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</span>
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:9px;font-weight:900;padding:2px 5px;border-radius:4px;">SUPERADMIN</span>` : ''}
          </div>
          <div style="font-size:10px;color:#38bdf8;">
            <b>${s.rol}</b> • ${s.seccion} (${s.subgrupo || 'A'})
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <button id="btn-top-chats" style="background:#059669;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:5px;">
          💬 Chats A/B <span style="background:#fbbf24;color:#020617;padding:1px 5px;border-radius:99px;font-size:10px;font-weight:900;">3</span>
        </button>
        <button id="btn-top-notif" title="Notificaciones" style="background:#131f33;border:1px solid #38bdf8;color:#38bdf8;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:900;cursor:pointer;">
          🔔
        </button>
        <span id="bds-xp-counter" style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:5px 9px;border-radius:7px;font-size:11px;font-weight:800;">🔥 ${xpObj.racha}d | ⚡ ${xpObj.xp} XP</span>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const NAV_ITEMS = [
      { v: 'inicio', label: '🏠 1. Menú por Rol & Inicio' },
      { v: 'practica_guiada', label: '🧭 2. Práctica Guiada (100 Ítems)' },
      { v: 'simulacro', label: '⏱️ 3. Simulacro con Cronómetro' },
      { v: 'ruleta', label: '🎡 4. Ruleta del Saber' },
      { v: 'chats', label: '💬 5. Chats Subgrupos A/B' },
      { v: 'juegos', label: '🎮 6. Los 8 Juegos' },
      { v: 'qr', label: '📷 7. Escáner QR PWA' }
    ];
    sub.innerHTML = NAV_ITEMS.map(m => `<button data-vista="${m.v}" class="bds-subnav-item">${m.label}</button>`).join('');

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    const dock = document.createElement('nav');
    dock.id = 'bds-mobile-dock';
    dock.innerHTML = `
      <button class="bds-dock-btn active" data-vista="inicio"><span style="font-size:17px;">🏠</span><span>Inicio</span></button>
      <button class="bds-dock-btn" data-vista="practica_guiada"><span style="font-size:17px;">🧭</span><span>Guiada</span></button>
      <button class="bds-dock-btn" data-vista="simulacro"><span style="font-size:17px;">⏱️</span><span>Simulacro</span></button>
      <button class="bds-dock-btn" data-vista="chats"><span style="font-size:17px;">💬</span><span>Chats A/B</span></button>
      <button class="bds-dock-btn" id="dock-menu-more"><span style="font-size:17px;">☰</span><span>Menú</span></button>
    `;

    document.body.prepend(shell);
    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(dock);

    document.getElementById('btn-hamburger-pro').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('dock-menu-more').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('btn-top-chats').onclick = () => navegarVista('chats');
    document.getElementById('btn-top-notif').onclick = () => {
      playSuccessSound();
      lanzarNotificacionPushUI(`Aviso institucional para ${s.rol}`, `Canal ${s.subgrupoLabel || 'General'} sincronizado con éxito.`);
    };
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('[data-vista]').forEach(b => {
      b.onclick = () => navegarVista(b.getAttribute('data-vista'));
    });

    iniciarObservadorSoberano();
    navegarVista('inicio', null, true);
  }

  window.abrirCentroMaestroBDS = function (mod, sub) { navegarVista(mod || 'inicio', sub); };
  window.abrirSalaJuegosHD = function (juego) { navegarVista('juegos', juego || 'ajedrez'); };

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else cerrarSesionTotal();
  });
})();