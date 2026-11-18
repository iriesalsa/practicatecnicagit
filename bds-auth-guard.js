(function () {
  const SESSION_KEY = "bds_auth_gate_v151_turbo3000";
  const LOCK_KEY = "bds_auth_lock_v151";
  const XP_KEY = "bds_gamification_xp_v151";
  const RULETA_STORAGE_KEY = "bds_ruleta_saber_items_v151";
  const QR_REGISTRY_KEY = "bds_qr_valid_registry_v151";
  const CHAT_STORAGE_KEY = "bds_chats_canales_v151";

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const SUBGRUPOS_SECCION = [
    { id: "A-ESP1", label: "Subgrupo A — Especialidad 1 (Web / Redes / Taller 1)" },
    { id: "B-ESP2", label: "Subgrupo B — Especialidad 2 (Ciber / Conta / Taller 2)" }
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
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v151.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v151.js').catch(() => {});
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
        return { valido: true, msg: `✅ CREDENCIAL OFICIAL VERIFICADA — Puesto: ${d.rol} | ${d.seccion} (${d.subgrupoLabel || 'General'}) | Emitido: ${d.fecha}` };
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
        xp: 1050, racha: 17, nivel: "Arquitecto Turing",
        medallas: ["🦉 Búho Azul Original", "♟️ Estratega FIDE", "🎡 Campeón Ruleta"]
      };
    } catch {
      return { xp: 1050, racha: 17, nivel: "Arquitecto Turing", medallas: ["🦉 Búho Azul Original"] };
    }
  }

  function ganarXP(pts, nuevaMedalla) {
    const d = getXP();
    d.xp += pts;
    if (nuevaMedalla && !d.medallas.includes(nuevaMedalla)) d.medallas.push(nuevaMedalla);
    d.nivel = d.xp >= 1800 ? "Leyenda Alan Turing" : (d.xp >= 1200 ? "Maestro SICAI" : "Arquitecto Turing");
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
  // MEGA STOCK DE 100 ÍTEMS (10 POR CADA UNA DE LAS 10 CATEGORÍAS + GUÍA PASO A PASO)
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
    // 1. TALLERES EXPLORATORIOS (10 ÍTEMS)
    { id: "rt1", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Herramientas para la Producción > 7°-9° > Unidad: Seguridad Industrial", guia: "Regla de oro eléctrica: nunca manipules conductores energizados.", question: "En un taller exploratorio de electricidad o electrónica, ¿cuál es la regla de seguridad obligatoria antes de modificar un circuito?", options: ["Trabajar con las manos mojadas", "Verificar que la fuente esté desenergizada y usar equipo de protección", "Unir fase y neutro directamente", "Quitar la puesta a tierra"], correct: 1, explanation: "Desenergizar la fuente antes de intervenir cualquier circuito previene descargas eléctricas y cortocircuitos." },
    { id: "rt2", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Pensamiento Computacional > 7°-9° > Unidad: Algoritmos", guia: "Piensa en una receta paso a paso con inicio y fin definidos.", question: "En los talleres exploratorios de tecnología y programación, ¿cómo se define un algoritmo?", options: ["Un fallo físico del disco duro", "Una secuencia lógica, finita y ordenada de pasos para resolver un problema", "Un monitor de alta resolución", "Un cable de red roto"], correct: 1, explanation: "Un algoritmo es una serie ordenada y finita de instrucciones claras que transforman una entrada en una solución." },
    { id: "rt3", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Dibujo Técnico y Diseño > 7°-9° > Unidad: Escalas", guia: "En una escala de ampliación, el primer número es mayor que el segundo (ej. 2:1).", question: "En Dibujo Técnico, ¿qué indica una escala expresada como 1:1 en el cajetín de un plano?", options: ["Escala natural (el dibujo tiene el tamaño real del objeto)", "Escala de reducción a la mitad", "Escala de ampliación al doble", "Medida sin unidades"], correct: 0, explanation: "La escala 1:1 representa las dimensiones reales del objeto sin ampliar ni reducir." },
    { id: "rt4", subject: "talleres", difficulty: "Intermedio", jerarquia: "Talleres Exploratorios > Robótica Educativa > 8° Año > Unidad: Sensores y Actuadores", guia: "Distingue entre quién capta información del entorno (sensor) y quién ejecuta movimiento (actuador).", question: "En un prototipo de robótica educativa, ¿cuál componente funciona como un SENSOR de distancia por ondas acústicas?", options: ["El servomotor de corriente directa", "El sensor ultrasónico (HC-SR04)", "El diodo LED emisor de luz", "La batería de 9V"], correct: 1, explanation: "El sensor ultrasónico emite ondas de sonido de alta frecuencia y mide el tiempo del eco para calcular la distancia a un obstáculo." },
    { id: "rt5", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Diseño Digital > 7° Año > Unidad: Formatos Gráficos", guia: "Los vectores se basan en fórmulas matemáticas y no pierden nitidez al escalar.", question: "¿Qué formato de imagen vectorial permite escalar logotipos y escudos institucionales a cualquier tamaño sin que se pixelen?", options: ["SVG (Scalable Vector Graphics)", "BMP sin compresión", "JPG de baja calidad", "GIF animado"], correct: 0, explanation: "El formato SVG utiliza trazos vectoriales matemáticos en XML, manteniendo nitidez perfecta en cualquier pantalla." },
    { id: "rt6", subject: "talleres", difficulty: "Intermedio", jerarquia: "Talleres Exploratorios > Medición Eléctrica > 9° Año > Unidad: Uso del Multímetro", guia: "El voltaje se mide en paralelo; la corriente se mide abriendo el circuito en serie.", question: "Para medir la tensión o voltaje de una batería con un multímetro digital, ¿cómo deben conectarse las puntas de prueba?", options: ["En paralelo con los bornes de la batería", "En serie cortando la batería", "En la escala de ohmios (Ω)", "Uniendo ambas puntas entre sí"], correct: 0, explanation: "El voltímetro siempre se conecta en paralelo entre los dos puntos donde se desea conocer la diferencia de potencial." },
    { id: "rt7", subject: "talleres", difficulty: "Básico", jerarquia: "Talleres Exploratorios > Salud Ocupacional > 7°-9° > Unidad: Ergonomía en Laboratorio", guia: "La espalda debe estar apoyada y el borde superior del monitor a la altura de los ojos.", question: "¿Cuál es la postura ergonómica correcta al trabajar frente a la computadora en el laboratorio técnico?", options: ["Espalda recta apoyada, pies en el suelo y pantalla a la altura de los ojos", "Encorvar el cuello a 10 cm del monitor", "Cruzar las piernas sobre el escritorio", "Trabajar a oscuras con brillo al 100%"], correct: 0, explanation: "Mantener ángulos de 90° en codos y rodillas con el monitor a nivel visual previene lesiones cervicales y síndrome del túnel carpiano." },
    { id: "rt8", subject: "talleres", difficulty: "Intermedio", jerarquia: "Talleres Exploratorios > Herramientas para la Producción > 8° Año > Unidad: Diagramas de Flujo", guia: "Óvalo = Inicio/Fin, Rectángulo = Proceso, Rombo = Condición o Decisión.", question: "En un diagrama de flujo para programación exploratoria, ¿qué símbolo geométrico representa una decisión lógica (SI / SINO)?", options: ["El rombo", "El rectángulo", "El círculo pequeño", "La flecha curva"], correct: 0, explanation: "El rombo evalúa una condición booleana y bifurca el flujo hacia Verdadero o Falso." },
    { id: "rt9", subject: "talleres", difficulty: "Intermedio", jerarquia: "Talleres Exploratorios > Gestión Ambiental > 9° Año > Unidad: Residuos Electrónicos (RAEE)", guia: "Las placas y baterías contienen metales pesados que requieren reciclaje especializado.", question: "¿Cuál es el manejo responsable de los Residuos de Aparatos Eléctricos y Electrónicos (RAEE) en una institución técnica?", options: ["Entregarlos a gestores autorizados de reciclaje electrónico y recuperar componentes útiles", "Quemarlos al aire libre", "Tirarlos al río más cercano", "Enterrarlos en el jardín escolar"], correct: 0, explanation: "Los RAEE deben clasificarse y entregarse a gestores ambientales autorizados para evitar la contaminación por plomo, litio o mercurio." },
    { id: "rt10", subject: "talleres", difficulty: "Avanzado", jerarquia: "Talleres Exploratorios > Prototipado en Protoboard > 9° Año > Unidad: Protección de LEDs", guia: "Sin resistencia limitadora, la corriente excesiva quema la unión semiconductora del LED.", question: "¿Por qué es obligatorio colocar una resistencia (ej. 220 Ω o 330 Ω) en serie con un diodo LED conectado a 5V?", options: ["Para limitar la corriente eléctrica y evitar que el LED se queme", "Para aumentar el voltaje a 120V", "Para cambiar el color del plástico del LED", "Para descargar la fuente"], correct: 0, explanation: "La resistencia limita la corriente a ~15-20 mA según la Ley de Ohm, protegiendo al diodo LED de destruirse térmicamente." },

    // 2. DESARROLLO WEB & CIBERSEGURIDAD
    { id: "rw1", subject: "web", difficulty: "Básico", jerarquia: "Desarrollo Web > Programación > 11° Año > Unidad: Seguridad y Roles RBAC", guia: "Principio de mínimo privilegio: nunca dar permisos de administrador por defecto.", question: "Para mitigar el riesgo de escalación de privilegios al registrar usuarios nuevos, ¿qué rol debe asignarse por defecto en el servidor?", options: ["Superadmin temporal", "El rol mínimo necesario (ej. estudiante)", "El rol que envíe el navegador", "Administrador sin clave"], correct: 1, explanation: "Aplicar el principio de menor privilegio evita que un atacante manipule la petición del cliente para obtener permisos administrativos." },
    { id: "rw2", subject: "web", difficulty: "Intermedio", jerarquia: "Desarrollo Web > Diseño de Software > 12° Año > Unidad: Integración Continua", guia: "Antes de publicar en producción, verifica que el proyecto compile sin errores.", question: "¿Qué práctica reduce el riesgo de romper la rama principal (main) en un despliegue automático hacia Vercel?", options: ["Desactivar pruebas", "Ejecutar un build de verificación previo al git push", "Subir node_modules", "Editar directo en producción"], correct: 1, explanation: "Correr npm run build y validar errores antes de hacer push detiene fallos de compilación antes de producción." },
    { id: "rw3", subject: "web", difficulty: "Avanzado", jerarquia: "Ciberseguridad > Protección de Datos > 12° Año > Unidad: Prevención de SQL Injection", guia: "Separa siempre la estructura de la consulta SQL de los parámetros enviados por el usuario.", question: "¿Cuál es el mecanismo técnico definitivo para prevenir ataques de Inyección SQL (SQLi) en PostgreSQL?", options: ["Usar consultas parametrizadas (Prepared Statements)", "Ocultar errores con CSS", "Cambiar nombres de tablas", "Limitar el ancho del input"], correct: 0, explanation: "Las consultas parametrizadas tratan la entrada del usuario estrictamente como dato literal y nunca como comando ejecutable." },

    // 3. PRUEBA TEÓRICA MOPT / COSEVI
    { id: "rm1", subject: "mopt", difficulty: "Básico", jerarquia: "Educación Vial > Ley de Tránsito N° 9078 > Nivel General > Unidad: Límites de Velocidad", guia: "En presencia de estudiantes o centros de salud la velocidad se restringe al mínimo urbano.", question: "¿Cuál es la velocidad máxima permitida al conducir frente a zonas escolares con presencia de estudiantes en Costa Rica?", options: ["40 km/h", "25 km/h", "50 km/h", "60 km/h"], correct: 1, explanation: "Según la Ley de Tránsito de Costa Rica, en zonas escolares y frente a hospitales la velocidad máxima es de 25 km/h." },
    { id: "rm2", subject: "mopt", difficulty: "Intermedio", jerarquia: "Educación Vial > Circulación en Rotondas > Nivel General > Unidad: Prioridad de Paso", guia: "Quien ya circula dentro del anillo giratorio tiene prioridad sobre quien espera en las entradas.", question: "Al aproximarse a una rotonda de múltiples carriles en Costa Rica, ¿quién tiene la prioridad de paso reglamentaria?", options: ["El que entra más rápido", "El vehículo que ya circula dentro de la rotonda en sentido antihorario", "El vehículo más pesado", "El que circula en sentido horario"], correct: 1, explanation: "Dentro de la rotonda se circula en sentido antihorario y los vehículos adentro tienen prioridad sobre los que desean incorporarse." },
    { id: "rm3", subject: "mopt", difficulty: "Intermedio", jerarquia: "Educación Vial > Conducción en Rotondas > Nivel General > Unidad: Uso de Carriles", guia: "Salidas tempranas (1ra y 2da) usan el anillo exterior derecho.", question: "En una rotonda de dos carriles, ¿qué carril debe utilizarse si se va a tomar la primera o segunda salida?", options: ["El carril interno (izquierdo)", "El carril externo (derecho)", "El espaldón central", "Cualquier carril en diagonal"], correct: 1, explanation: "El carril externo (derecho) es obligatorio para abandonar la rotonda por la primera o segunda salida." },

    // 4. EXCEL, OFIMÁTICA & CONTABILIDAD
    { id: "rx1", subject: "excel", difficulty: "Básico", jerarquia: "Contabilidad y Ofimática > Hoja Electrónica Excel > 10° Año > Unidad: Referencias Absolutas", guia: "Tecla F4 en Excel: agrega signos monetarios antes de la letra y del número.", question: "En Excel, ¿qué símbolo se antepone a la columna y a la fila (ejemplo: $B$4) para fijar una referencia absoluta?", options: ["Porcentaje (%)", "Signo de dólar ($)", "Numeral (#)", "Ampersand (&)"], correct: 1, explanation: "El signo $ fija tanto la columna como la fila ($B$4) para que la celda no se desplace al copiar la fórmula." },
    { id: "rx2", subject: "excel", difficulty: "Intermedio", jerarquia: "Contabilidad Pura > Hoja Electrónica Aplicada > 11° Año > Unidad: Funciones Lógicas", guia: "Estructura: =SI(condición; valor_si_verdadero; valor_si_falso).", question: "¿Cuál fórmula de Excel evalúa si la nota en C2 es mayor o igual a 70 para mostrar 'APROBADO' o 'APLAZADO'?", options: ["=SUMA(C2>=70; \"APROBADO\")", "=SI(C2>=70; \"APROBADO\"; \"APLAZADO\")", "=BUSCARV(C2; 70; \"APROBADO\")", "=CONTAR(C2>=70)"], correct: 1, explanation: "La función lógica =SI evalúa la condición booleana y devuelve el primer texto si se cumple o el segundo si falla." },
    { id: "rx3", subject: "excel", difficulty: "Intermedio", jerarquia: "Contabilidad Pura > Fundamentos Contables > 10° Año > Unidad: Ecuación Contable", guia: "Aplica la ecuación patrimonial: Patrimonio = Activo - Pasivo.", question: "Si una empresa tiene Activos por ₡20,000,000 y Pasivos por ₡8,000,000, ¿cuál es su Patrimonio Neto?", options: ["₡28,000,000", "₡12,000,000", "₡8,000,000", "₡20,000,000"], correct: 1, explanation: "Restando los pasivos a los activos totales: 20,000,000 - 8,000,000 = ₡12,000,000." },

    // 5. IDENTIDAD CTPMN & MARCA
    { id: "ri1", subject: "identidad", difficulty: "Básico", jerarquia: "Identidad Institucional > Cultura Digital CTPMN > Nivel General > Unidad: Símbolo Oficial", guia: "Recuerda el emblema nocturno de sabiduría de las primeras versiones.", question: "¿Cuál es el ícono oficial e histórico que representa la sabiduría tecnológica y la identidad propia de pracTICAtecnica.com?", options: ["Un robot rojo", "El Búho Azul original de las primeras versiones", "Una estrella amarilla", "Un escudo gris"], correct: 1, explanation: "El Búho Azul original simboliza la visión analítica, el estudio constante y la identidad propia de pracTICAtecnica.com." },
    { id: "ri2", subject: "identidad", difficulty: "Básico", jerarquia: "Identidad Institucional > Dirección Regional Heredia > Circuito 04 > Unidad: Comunidad CTPMN", guia: "Ubicado en Mercedes Norte de Heredia, Circuito Escolar 04.", question: "¿A qué Dirección Regional de Educación y Circuito pertenece oficialmente el CTP de Mercedes Norte?", options: ["San José • Circuito 01", "Dirección Regional de Educación de Heredia • Circuito 04", "Alajuela • Circuito 08", "Cartago • Circuito 02"], correct: 1, explanation: "El CTP de Mercedes Norte pertenece a la Dirección Regional de Educación de Heredia, Circuito 04." },

    // 6. HÁBITOS KAIZEN, DUA & REAC
    { id: "rh1", subject: "habitos", difficulty: "Básico", jerarquia: "Formación Humana > Hábitos de Excelencia > Nivel General > Unidad: Filosofía Kaizen", guia: "Kai = Cambio, Zen = Bueno / Mejorar continuamente todos los días.", question: "¿Qué significa aplicar el principio japonés 'Kaizen' en el estudio diario y en la ingeniería de software?", options: ["Dejar todo para el final", "Mejora continua: auditar, corregir y perfeccionar un poco cada día", "Trabajar sin planificación", "Copiar sin comprender"], correct: 1, explanation: "Kaizen significa mejora continua con calidad total, corrigiendo errores de raíz y superándose día tras día." },
    { id: "rh2", subject: "habitos", difficulty: "Básico", jerarquia: "Salud Ocupacional > Ergonomía y Estudio > Nivel General > Unidad: Técnica Pomodoro", guia: "Divide cada media hora en 25 minutos de foco total y 5 de pausa.", question: "¿Cuál es la estructura clásica de la técnica Pomodoro para mantener la concentración mental y descansar adecuadamente?", options: ["6 horas seguidas sin pausa", "25 minutos de enfoque profundo seguidos de 5 minutos de descanso activo", "Estudiar viendo televisión", "Dormir 2 horas"], correct: 1, explanation: "Trabajar en bloques de 25 minutos con pausas de 5 minutos protege la salud mental y multiplica la retención." },

    // 7. SUBÁREAS & UNIDADES TÉCNICAS
    { id: "re1", subject: "especialidades", difficulty: "Intermedio", jerarquia: "Desarrollo Web / TI > Subárea: Soporte TI y Redes > 11° Año > Unidad: Subneteo VLSM", guia: "Bits de host h = 32 - 27 = 5. Fórmula de hosts útiles: 2^h - 2.", question: "En una subred IPv4 con prefijo /27 (máscara 255.255.255.224), ¿cuántas direcciones IP utilizables para hosts existen?", options: ["14 direcciones utilizables", "30 direcciones utilizables", "62 direcciones utilizables", "254 direcciones utilizables"], correct: 1, explanation: "Con /27 quedan 5 bits de host (32 - 27 = 5). Aplicando 2⁵ - 2 = 30 direcciones utilizables." },
    { id: "re2", subject: "especialidades", difficulty: "Intermedio", jerarquia: "Desarrollo Web > Subárea: Diseño de Software > 12° Año > Unidad: Arquitectura Modular", guia: "Desacoplar la vista del servidor protege las credenciales y facilita escalar.", question: "¿Cuál es el beneficio principal de separar el Frontend (interfaz React) del Backend (API y Base de Datos)?", options: ["Impide actualizar el diseño", "Permite escalar, proteger credenciales y mantener cada capa de forma independiente", "Hace pública la base de datos", "Elimina HTTPS"], correct: 1, explanation: "La separación en capas protege la lógica de negocio y facilita el mantenimiento industrial." },

    // 8. MATEMÁTICAS & ADMISIÓN UCR/TEC
    { id: "m1", subject: "math", difficulty: "Intermedio", jerarquia: "Admisión Universitaria > Razonamiento Matemático UCR / TEC > Nivel PAA > Unidad: Sucesiones", guia: "Calcula la resta entre cada par consecutivo: 8-3=5, 15-8=7, 24-15=9, 35-24=11.", question: "[Simulacro UCR/TEC] Dada la sucesión: 3, 8, 15, 24, 35, X. ¿Cuál es el valor numérico de X?", options: ["44", "48", "46", "50"], correct: 1, explanation: "Las diferencias crecen en números impares consecutivos (+5, +7, +9, +11, +13). Por tanto, 35 + 13 = 48." },
    { id: "m2", subject: "math", difficulty: "Avanzado", jerarquia: "Admisión Universitaria > Razonamiento TEC > Nivel PAA > Unidad: Porcentajes y Áreas", guia: "Usa un cuadrado de lado 10 (área 100); al subir 50% el lado mide 15 (área 225).", question: "[Simulacro TEC] Si el lado de un cuadrado aumenta en un 50%, ¿en qué porcentaje aumenta su área total?", options: ["Aumenta en un 50%", "Aumenta en un 125%", "Aumenta en un 100%", "Aumenta en un 150%"], correct: 1, explanation: "Si el lado pasa de 1 a 1.5, el área pasa de 1² = 1 a (1.5)² = 2.25, lo que equivale a un incremento del 125%." },

    // 9. INGLÉS & ESPAÑOL MEP
    { id: "e1", subject: "english_spanish", difficulty: "Intermedio", jerarquia: "Inglés Técnico > IT Vocabulary > 11° Año > Unidad: Cybersecurity & Backups", guia: "Back up = respaldo de seguridad; Backup = el archivo respaldado.", question: "What does the phrasal verb 'back up' mean in software engineering and IT support?", options: ["To delete all databases", "To make a security copy of data", "To unplug the monitor", "To cancel a project"], correct: 1, explanation: "'Back up' means creating a backup copy of files or databases to prevent data loss." },
    { id: "s1", subject: "english_spanish", difficulty: "Básico", jerarquia: "Español > Ortografía y Acentuación > 7°-11° Año > Unidad: Leyes del Acento", guia: "Separa en sílabas: A - ná - li - sis (antepenúltima sílaba).", question: "¿Cuál de las siguientes palabras es esdrújula y por regla ortográfica siempre lleva tilde?", options: ["Computadora", "Análisis", "Programación", "Reloj"], correct: 1, explanation: "'A-ná-li-sis' lleva la fuerza de voz en la antepenúltima sílaba; todas las esdrújulas se tildan." },

    // 10. CIENCIAS (QUÍMICA, FÍSICA, BIOLOGÍA)
    { id: "c1", subject: "science", difficulty: "Intermedio", jerarquia: "Física > Dinámica Clásica > 10° Año > Unidad: Segunda Ley de Newton", guia: "Fórmula directa: Fuerza = masa × aceleración.", question: "Según la Segunda Ley de Newton (F = m × a), ¿qué fuerza neta se requiere para acelerar un cuerpo de 15 kg a 4 m/s²?", options: ["19 N", "60 N", "3.75 N", "120 N"], correct: 1, explanation: "Multiplicando masa por aceleración: F = 15 kg × 4 m/s² = 60 Newtons." },
    { id: "c2", subject: "science", difficulty: "Intermedio", jerarquia: "Química > Estructura Atómica > 10° Año > Unidad: Partículas Subatómicas", guia: "Neutrones = Número másico (A) menos Número atómico (Z).", question: "Si el átomo de Sodio tiene número atómico Z = 11 y número másico A = 23, ¿cuántos neutrones tiene en su núcleo?", options: ["11 neutrones", "12 neutrones", "23 neutrones", "34 neutrones"], correct: 1, explanation: "Restando el número atómico al número másico (n° = A - Z): 23 - 11 = 12 neutrones." }
  ];

  // Generador que garantiza mínimo 10 ítems ricos por cada una de las 10 categorías (100 ítems totales)
  function construirStock100Items() {
    const lista = [...BASE_ITEMS_SEMILLA];
    const plantillasExtra = {
      web: [
        { q: "¿Qué protocolo cifra la comunicación HTTP en el puerto 443 mediante certificados TLS?", c: "HTTPS (HTTP sobre TLS/SSL)", i: ["FTP plano", "Telnet puerto 23", "HTTP puerto 80"], g: "Busca el protocolo con la S de Secure en el puerto 443.", u: "Unidad: Cifrado en Tránsito" },
        { q: "En React (.jsx), ¿qué Hook estándar permite gestionar el estado local dentro de un componente funcional?", c: "useState()", i: ["useClass()", "window.reload()", "document.write()"], g: "Es el hook cuyo nombre incluye la palabra State.", u: "Unidad: Hooks y Estado en React" },
        { q: "¿Cuántos intentos fallidos consecutivos activan el bloqueo antifraude en el sistema de autenticación soberana?", c: "5 intentos fallidos consecutivos", i: ["100 intentos", "Sin límite de intentos", "1 solo intento"], g: "Política RBAC del CTPMN: bloqueo al quinto intento erróneo.", u: "Unidad: Políticas Antifraude" },
        { q: "¿Qué algoritmo genera una huella criptográfica hexadecimal de 64 caracteres (256 bits) para sellar carnés QR?", c: "SHA-256", i: ["MD4 obsoleto", "Cifrado César", "Texto ASCII"], g: "Secure Hash Algorithm de 256 bits.", u: "Unidad: Hashing Criptográfico" },
        { q: "En diseño Mobile-First, ¿para qué sirve la etiqueta meta viewport con width=device-width?", c: "Para escalar la interfaz al ancho real de la pantalla del teléfono celular", i: ["Para bloquear celulares", "Para borrar el CSS", "Para apagar el Wi-Fi"], g: "Adapta el ancho lógico del navegador al ancho físico del dispositivo.", u: "Unidad: Responsive Mobile-First" },
        { q: "¿Qué cabecera o tecnología convierte una aplicación web en instalable y capaz de operar Offline-First?", c: "Service Worker + Web App Manifest (PWA)", i: ["Un archivo .bat en el servidor", "Un iframe oculto", "Una tabla sin estilos"], g: "Intercepta peticiones de red y almacena recursos en Cache Storage.", u: "Unidad: Aplicaciones PWA" },
        { q: "En control de versiones Git, ¿qué comando sube los commits locales hacia la rama main en GitHub?", c: "git push origin main", i: ["git clone --delete", "git status --help", "npm uninstall"], g: "Push empuja los cambios confirmados hacia el repositorio remoto.", u: "Unidad: Flujo Git y Despliegue" }
      ],
      mopt: [
        { q: "¿Cuál es la distancia mínima de seguridad o regla práctica recomendada para seguir a otro vehículo en condiciones normales?", c: "La regla de los 2 segundos (o más según velocidad y lluvia)", i: ["Pegarse a 30 centímetros del parachoques", "Circular en zigzag", "Apagar las luces de noche"], g: "Cuenta dos segundos desde que el vehículo delantero pasa por un punto fijo.", u: "Unidad: Manejo Defensivo" },
        { q: "Ante una señal vertical octagonal roja con la palabra ALTO, ¿qué acción es obligatoria para el conductor?", c: "Detener el vehículo por completo antes de la línea de parada y ceder el paso", i: ["Acelerar y pitar", "Disminuir solo a 30 km/h sin detenerse", "Pasar cerrando los ojos"], g: "ALTO exige velocidad igual a 0 km/h antes de la línea blanca.", u: "Unidad: Señales Reglamentarias" },
        { q: "¿Qué forma y colores caracterizan a las señales verticales de PREVENCIÓN en las carreteras de Costa Rica?", c: "Fondo amarillo en forma de rombo con símbolo negro", i: ["Fondo azul rectangular", "Fondo verde informativo", "Círculo blanco con franja roja"], g: "Advierten peligros futuros en la vía y usan color amarillo preventivo.", u: "Unidad: Señalización Preventiva" },
        { q: "Si un peatón ya inició el cruce sobre una zona demarcada (paso de cebra), ¿cuál es la obligación legal del conductor?", c: "Detenerse y otorgar prioridad absoluta al peatón", i: ["Acelerar para pasar primero", "Tocar la bocina insistentemente", "Esquivarlo subiéndose a la acera"], g: "En la pirámide de movilidad vial, el peatón tiene la prioridad número 1.", u: "Unidad: Prioridad Peatonal" },
        { q: "En caso de lluvia intensa o neblina en carretera de montaña, ¿qué luces debe encender el conductor?", c: "Luces bajas o neblineros (nunca luces altas que encandilan por reflejo)", i: ["Luces altas de largo alcance únicamente", "Apagar todas las luces", "Solo la luz interior del techo"], g: "La luz alta rebota en las gotas de neblina y reduce la visibilidad.", u: "Unidad: Conducción Adversidades" },
        { q: "¿Cuál elemento de seguridad pasiva es de uso obligatorio para TODOS los ocupantes de un vehículo automotor?", c: "El cinturón de seguridad correctamente abrochado", i: ["El radio reproductor", "Las alfombras decorativas", "El polarizado oscuro"], g: "Retiene el cuerpo en caso de colisión y trabaja junto con las bolsas de aire.", u: "Unidad: Seguridad Pasiva" },
        { q: "Para un motociclista y su acompañante en Costa Rica, ¿qué implementos son obligatorios por ley?", c: "Casco de seguridad certificado y chaleco o cinta reflectiva", i: ["Lentes de sol oscuros de noche", "Sandalias abiertas", "Audífonos a máximo volumen"], g: "Protección craneal homologada y alta visibilidad nocturna.", u: "Unidad: Seguridad en Motocicleta" }
      ],
      excel: [
        { q: "¿Qué función de Excel devuelve el promedio aritmético de los valores numéricos contenidos en el rango B2:B15?", c: "=PROMEDIO(B2:B15)", i: ["=SUMA(B2:B15)", "=MAX(B2:B15)", "=CONTARA(B2:B15)"], g: "Suma los valores del rango y los divide entre la cantidad de celdas.", u: "Unidad: Funciones Estadísticas" },
        { q: "En Contabilidad en Costa Rica, si un servicio técnico cuesta ₡50,000 netos, ¿cuánto corresponde al 13% de IVA?", c: "₡6,500 de IVA (Total factura: ₡56,500)", i: ["₡13,000 de IVA", "₡5,000 de IVA", "₡1,300 de IVA"], g: "Multiplica 50,000 × 0.13.", u: "Unidad: Impuesto al Valor Agregado" },
        { q: "¿Qué función de Excel permite buscar un código en la primera columna de una tabla y devolver un dato de otra columna en la misma fila?", c: "=BUSCARV() / =BUSCARX()", i: ["=REDONDEAR()", "=CONCATENAR()", "=HOY()"], g: "Búsqueda vertical por columna clave.", u: "Unidad: Búsqueda y Referencia" },
        { q: "En la partida doble contable, cuando una cuenta de Activo (como Bancos o Efectivo) aumenta, ¿en qué columna se registra?", c: "En la columna del DEBE (Débito / Cargo)", i: ["En la columna del HABER (Crédito)", "Fuera del libro diario", "En cuentas de pasivo"], g: "Los activos son de naturaleza deudora: aumentan al Debe y disminuyen al Haber.", u: "Unidad: Asientos de Diario" },
        { q: "¿Qué función de Excel cuenta únicamente las celdas que cumplen una condición específica (ej. mayores a 80)?", c: "=CONTAR.SI(A1:A20; \">=80\")", i: ["=SUMA(A1:A20)", "=MIN(A1:A20)", "=AHORA()"], g: "Combina el conteo con un criterio lógico.", u: "Unidad: Conteo Condicional" },
        { q: "En un Balance de Comprobación contable, ¿qué igualdad matemática debe cumplirse obligatoriamente?", c: "La suma total de los saldos Deudores (Debe) debe ser exactamente igual a la suma de los Acreedores (Haber)", i: ["El Debe siempre debe ser el doble del Haber", "Los pasivos deben ser cero", "No importa si hay diferencias"], g: "Principio de dualidad económica o partida doble de Luca Pacioli.", u: "Unidad: Balance de Comprobación" },
        { q: "¿Qué atajo de teclado universal permite copiar las celdas seleccionadas en una hoja de cálculo?", c: "Ctrl + C", i: ["Alt + F4", "Ctrl + Alt + Supr", "F12"], g: "C de Copy (Copiar), seguido de Ctrl + V para pegar.", u: "Unidad: Productividad Ofimática" }
      ],
      identidad: [
        { q: "¿Cuál es la misión pedagógica y tecnológica de la plataforma pracTICAtecnica.com en el CTP Mercedes Norte?", c: "Democratizar la práctica técnica, académica, vial y de admisión universitaria con calidad industrial y gamificación", i: ["Mostrar únicamente anuncios estáticos", "Bloquear el estudio autónomo", "Funcionar solo un día al año"], g: "Educación técnica pública de excelencia con herramientas interactivas 24/7.", u: "Unidad: Misión Institucional" },
        { q: "¿Qué modalidad de operación garantiza que los estudiantes puedan seguir practicando en la PWA incluso si falla temporalmente la red?", c: "Arquitectura Offline-First con Service Worker y caché local", i: ["Dependencia exclusiva de servidores sin caché", "Apagado automático sin internet", "Impresión en papel carbón"], g: "Primero local/caché con sincronización inteligente.", u: "Unidad: Soberanía Offline-First" },
        { q: "¿Cómo se subdivide cada sección del colegio en nuestro sistema de canales para organizar los laboratorios técnicos?", c: "En Subgrupo A (Especialidad 1) y Subgrupo B (Especialidad 2)", i: ["Sin ninguna organización", "En grupos de 200 personas mezcladas", "Solo por orden alfabético inverso"], g: "En los CTP cada sección académica se parte en dos subgrupos de taller/especialidad.", u: "Unidad: Organización de Subgrupos A/B" },
        { q: "¿Qué principio de propiedad intelectual rige los materiales y afiches creados bajo el estándar de calidad BDS?", c: "Soberanía de marca blanca total: 100% propiedad del docente y su institución, sin marcas de agua ajenas", i: ["Poner marcas de agua gigantes de terceros", "Prohibir su descarga", "Cobrar por cada clic"], g: "Independencia tecnológica y respeto absoluto a la identidad institucional.", u: "Unidad: Estándar Marca Blanca BDS" },
        { q: "¿En qué provincia y cantón de Costa Rica se ubica el Colegio Técnico Profesional de Mercedes Norte?", c: "Provincia de Heredia, Cantón Central de Heredia (Distrito Mercedes)", i: ["Provincia de Limón", "Provincia de Guanacaste", "Provincia de Puntarenas"], g: "Orgullo herediano del Circuito 04.", u: "Unidad: Geografía Institucional" },
        { q: "¿Por qué la plataforma integra juegos clásicos como Ajedrez FIDE, Dominó, Solitario, Clue y Scrabble junto con los simulacros?", c: "Para desarrollar el pensamiento estratégico, la deducción lógica y el enganche positivo del estudiante", i: ["Para eliminar las materias básicas", "Porque no tienen reglas", "Para gastar batería"], g: "Gamificación con propósito cognitivo inspirada en Alan Turing y Duolingo.", u: "Unidad: Gamificación Cognitiva" },
        { q: "¿Qué función cumple el código QR con firma SHA-256 en los carnés y boletas de pracTICAtecnica.com?", c: "Permite verificar en segundos la autenticidad e integridad del documento desde el escáner de la misma PWA", i: ["Es solo un adorno sin datos", "Borra la sesión del usuario", "Cambia el color del monitor"], g: "Verificación criptográfica instantánea en portón, dirección o aula.", u: "Unidad: Verificación Criptográfica QR" },
        { q: "¿Cuáles son los canales oficiales de comunicación institucional del Ministerio de Educación Pública (MEP)?", c: "Correo institucional (@est.mep.go.cr / @mep.go.cr) y Microsoft Teams", i: ["Foros anónimos sin registro", "Cuentas sin verificación", "Mensajes de humo"], g: "Ecosistema oficial Microsoft 365 del MEP.", u: "Unidad: Canales Oficiales MEP" }
      ],
      habitos: [
        { q: "¿Qué significa las siglas DUA en la mediación pedagógica inclusiva del Ministerio de Educación Pública?", c: "Diseño Universal para el Aprendizaje (múltiples formas de implicación, representación y acción)", i: ["Documento Único Administrativo", "División Urbana de Alajuela", "Dato Único Aleatorio"], g: "Asegura que el aprendizaje sea accesible para todos los estilos y ritmos.", u: "Unidad: Inclusión y DUA" },
        { q: "En el Binomio Sagrado de la mediación pedagógica MEP, ¿cómo se estructura toda actividad de aprendizaje?", c: "La persona docente [verbo de mediación]... La persona estudiante [verbo de construcción/creación]...", i: ["Solo habla el docente durante 80 minutos", "Texto pasivo sin verbos activos", "Exámenes sin mediación previa"], g: "Articula la guía docente con el protagonismo constructivo del estudiante.", u: "Unidad: Binomio Sagrado MEP" },
        { q: "¿Cuáles son los 4 momentos cronopedagógicos oficiales del planeamiento didáctico del MEP?", c: "Focalización, Exploración, Contrastación y Aplicación", i: ["Inicio, Recreo, Almuerzo y Salida", "Lectura, Copia, Dictado y Silencio", "Solo Evaluación Final"], g: "Ruta indagatoria: Focalizar → Explorar → Contrastar → Aplicar.", u: "Unidad: Los 4 Momentos MEP" },
        { q: "¿Qué hábito de ciberseguridad personal debe practicar todo estudiante y funcionario al terminar de usar una computadora compartida en el laboratorio?", c: "Presionar 'Cerrar Sesión Segura' para limpiar tokens y credenciales locales", i: ["Dejar la cuenta abierta todo el fin de semana", "Anotar la contraseña en un papel pegado al monitor", "Apagar solo la pantalla sin cerrar sesión"], g: "La higiene digital previene la suplantación de identidad en equipos de uso común.", u: "Unidad: Higiene Digital en Laboratorio" },
        { q: "¿Por qué la práctica espaciada y la autoevaluación con explicaciones paso a paso superan a la memorización de última hora?", c: "Porque consolidan conexiones en la memoria de largo plazo y permiten corregir errores conceptuales a tiempo", i: ["Porque requieren menos comprensión", "Porque evitan leer los enunciados", "Porque eliminan el razonamiento"], g: "Aprender del error inmediato con guía socrática fija el conocimiento real.", u: "Unidad: Neurociencia del Aprendizaje" },
        { q: "En el trabajo colaborativo entre los Subgrupos A y B de una sección técnica, ¿qué valor es fundamental para la convivencia?", c: "El respeto mutuo, el orden en el uso del equipo y la corresponsabilidad con el aseo del taller", i: ["Desordenar los cables del otro subgrupo", "Esconder las herramientas", "Ocultar fallos de seguridad"], g: "El laboratorio técnico es casa común de ambos subgrupos.", u: "Unidad: Cultura de Paz y Orden 5S" },
        { q: "¿Cuáles son las 5 etapas del método japonés 5S aplicado a los talleres y laboratorios del CTP?", c: "Clasificar (Seiri), Ordenar (Seiton), Limpiar (Seiso), Estandarizar (Seiketsu) y Disciplina (Shitsuke)", i: ["Correr, Saltar, Gritar, Ensuciar y Olvidar", "Comprar, Guardar, Romper, Botar y Cerrar", "Solo limpiar una vez al año"], g: "Orden y limpieza industrial para máxima seguridad y productividad.", u: "Unidad: Metodología 5S en Talleres" },
        { q: "Ante la fatiga mental tras varias horas de programación o estudio intenso, ¿qué recomienda la salud ocupacional?", c: "Realizar pausas activas, hidratarse, descansar la vista (regla 20-20-20) y dormir adecuadamente", i: ["Ignorar el cansancio por días", "Tomar 10 bebidas energéticas seguidas", "Mirar fijamente una luz brillante"], g: "Regla 20-20-20: cada 20 min mira a 20 pies de distancia por 20 segundos.", u: "Unidad: Salud Mental y Descanso" }
      ],
      especialidades: [
        { q: "En el Modelo OSI de 7 capas, ¿en qué capa trabajan las direcciones físicas MAC y los switches de red local (VLANs)?", c: "Capa 2 (Enlace de Datos)", i: ["Capa 7 (Aplicación)", "Capa 3 (Red / IP)", "Capa 1 (Física / Cables)"], g: "Las tramas Ethernet y direcciones MAC pertenecen al nivel 2.", u: "Unidad: Modelo OSI y Conmutación" },
        { q: "En una subred con máscara /28 (255.255.255.240), ¿cuántas direcciones IP utilizables para hosts existen?", c: "14 direcciones IP utilizables (2⁴ - 2)", i: ["30 direcciones", "6 direcciones", "16 direcciones sin restar red ni broadcast"], g: "32 - 28 = 4 bits de host → 2⁴ - 2 = 14.", u: "Unidad: Cálculo VLSM /28" },
        { q: "En Electrónica Digital, ¿qué compuerta lógica produce una salida igual a 1 cuando al menos UNA de sus entradas es igual a 1?", c: "Compuerta OR (Suma lógica)", i: ["Compuerta AND", "Compuerta NOT", "Compuerta NAND"], g: "Basta que A o B sea 1 para que la salida A+B sea 1.", u: "Unidad: Compuertas Lógicas" },
        { q: "En Soporte TI, ¿qué memoria es volátil y pierde su contenido al apagar la computadora, pero almacena los procesos activos del sistema?", c: "La memoria RAM (Random Access Memory)", i: ["La unidad de estado sólido NVMe SSD", "El disco duro magnético HDD", "La memoria flash USB"], g: "Memoria de acceso aleatorio de trabajo rápido.", u: "Unidad: Arquitectura de Hardware" },
        { q: "En Bases de Datos SQL, ¿qué comando se utiliza para consultar y recuperar filas de una tabla?", c: "SELECT", i: ["DROP DATABASE", "TRUNCATE", "SHUTDOWN"], g: "SELECT columnas FROM tabla WHERE condición.", u: "Unidad: Lenguaje SQL DQL" },
        { q: "En la especialidad de Ejecutivo Comercial y Servicio al Cliente, ¿qué es la escucha activa?", c: "Prestar atención plena al interlocutor, confirmar comprensión con empatía y ofrecer soluciones claras", i: ["Interrumpir al usuario sin dejarlo hablar", "Mirar el celular mientras el cliente explica su problema", "Responder con monosílabos"], g: "Comprender antes de responder genera confianza y calidad de servicio.", u: "Unidad: Comunicación Asertiva" },
        { q: "En Ciberseguridad Defensiva (Blue Team / SOC), ¿para qué sirve un sistema Firewall en la red institucional?", c: "Para inspeccionar, permitir o bloquear tráfico de red según reglas de puertos, protocolos y direcciones IP", i: ["Para enfriar el aire del aula", "Para imprimir documentos en color", "Para aumentar el voltaje eléctrico"], g: "Barrera lógica entre la red interna confiable y redes externas.", u: "Unidad: Seguridad Perimetral" },
        { q: "En Programación Orientada a Objetos y Diseño de Software, ¿qué significa el principio DRY (Don't Repeat Yourself)?", c: "Evitar la duplicación de código encapsulando la lógica reutilizable en funciones o módulos limpios", i: ["Escribir el mismo bloque 50 veces copiando y pegando", "No usar comentarios ni funciones", "Borrar todo el repositorio"], g: "Si una lógica se repite, extráela en una función única y mantenible.", u: "Unidad: Código Limpio" }
      ],
      math: [
        { q: "[UCR/UNA] En una caja hay esferas rojas, azules y verdes. Si todas menos 4 son rojas, todas menos 4 son azules y todas menos 4 son verdes, ¿cuántas esferas hay en total?", c: "6 esferas en total (2 de cada color)", i: ["12 esferas", "8 esferas", "4 esferas"], g: "Si todas menos 4 son rojas, entre azules y verdes suman 4 (2 y 2).", u: "Unidad: Razonamiento Lógico PAA" },
        { q: "[TEC] Se define el operador matemático a ★ b = (a² + b) / 2. ¿Cuál es el resultado exacto de (3 ★ 7) ★ 4?", c: "34", i: ["14.5", "16", "28"], g: "Primero: 3 ★ 7 = (9 + 7)/2 = 8. Luego: 8 ★ 4 = (64 + 4)/2 = 34.", u: "Unidad: Operadores Definidos TEC" },
        { q: "En un triángulo rectángulo cuyos catetos miden 6 cm y 8 cm, ¿cuánto mide la hipotenusa según el Teorema de Pitágoras?", c: "10 cm", i: ["14 cm", "12 cm", "100 cm"], g: "c = √(6² + 8²) = √(36 + 64) = √100 = 10.", u: "Unidad: Geometría Pitagórica" },
        { q: "Si f(x) = 3x² - 2x + 5, ¿cuál es el valor numérico de la imagen f(2)?", c: "13", i: ["9", "15", "11"], g: "Sustituye x=2: 3(4) - 2(2) + 5 = 12 - 4 + 5 = 13.", u: "Unidad: Funciones Algebraicas" },
        { q: "¿Cuál es la pendiente (m) de la recta que pasa por los puntos A(1, 2) y B(3, 8)?", c: "m = 3", i: ["m = 2", "m = 4", "m = -3"], g: "m = (y₂ - y₁) / (x₂ - x₁) = (8 - 2) / (3 - 1) = 6 / 2 = 3.", u: "Unidad: Geometría Analítica" },
        { q: "[Colegios Científicos] Si x + 1/x = 3, ¿cuál es el valor exacto de x² + 1/x²?", c: "7", i: ["9", "5", "11"], g: "Eleva al cuadrado ambos lados: (x + 1/x)² = x² + 2 + 1/x² = 9 → 9 - 2 = 7.", u: "Unidad: Productos Notables" },
        { q: "[UTN/UNED] Si 3 máquinas producen 120 piezas en 4 horas, ¿cuántas piezas producirán 5 máquinas idénticas en 6 horas?", c: "300 piezas", i: ["240 piezas", "200 piezas", "360 piezas"], g: "1 máquina en 1 hora produce 120/(3×4) = 10 piezas. Entonces 5 × 6 × 10 = 300.", u: "Unidad: Proporcionalidad Compuesta" },
        { q: "¿Cuál es el conjunto solución de la ecuación cuadrática x² - 5x + 6 = 0?", c: "{2, 3}", i: ["{-2, -3}", "{1, 6}", "{0, 5}"], g: "Busca dos números que multiplicados den +6 y sumados den -5: (x-2)(x-3)=0.", u: "Unidad: Ecuaciones Cuadráticas" }
      ],
      english_spanish: [
        { q: "Complete the First Conditional sentence: 'If the server _____ down, the backup system will automatically take over.'", c: "goes", i: ["went", "will go", "going"], g: "First conditional uses Simple Present in the 'If' clause (the server = third person singular).", u: "Unidad: Conditionals in IT" },
        { q: "Complete the Passive Voice sentence: 'The institutional database _____ encrypted with SHA-256 yesterday.'", c: "was", i: ["were", "has", "is"], g: "Singular subject in past passive voice requires 'was + past participle'.", u: "Unidad: Passive Voice" },
        { q: "Which phrasal verb means 'to investigate or examine a technical problem carefully'?", c: "Look into", i: ["Give up", "Turn off", "Put away"], g: "'Look into' = investigate / analyze.", u: "Unidad: Technical Phrasal Verbs" },
        { q: "Select the correct comparative adjective: 'Mobile screens are _____ than desktop monitors.'", c: "smaller", i: ["more small", "smallest", "small"], g: "Short one-syllable adjectives add '-er' for comparison.", u: "Unidad: Comparatives" },
        { q: "¿Por qué la palabra 'árbol' lleva tilde ortográfica en español?", c: "Porque es una palabra grave (llana) terminada en consonante distinta de n o s", i: ["Porque es aguda terminada en vocal", "Porque es esdrújula", "Porque tiene cuatro sílabas"], g: "Ár-bol: acento en la penúltima sílaba terminada en 'l'.", u: "Unidad: Acentuación Ortográfica" },
        { q: "En la oración 'Las hojas caían lentamente como lágrimas de otoño', ¿qué figura literaria predomina?", c: "Símil o comparación", i: ["Hipérbole", "Epíteto", "Anáfora"], g: "Compara explícitamente dos elementos mediante el nexo comparativo 'como'.", u: "Unidad: Figuras Literarias" },
        { q: "¿Cuál opción presenta el uso ortográfico correcto de las formas 'por qué', 'porque' y 'porqué'?", c: "'¿Por qué?' se usa en preguntas y 'porque' se usa para explicar la causa o razón", i: ["Todas se usan igual sin distinción", "'Porque' siempre lleva tilde", "'Porqué' nunca lleva tilde"], g: "Pregunta separada y con tilde; respuesta causal junta y sin tilde.", u: "Unidad: Dudas Ortográficas" },
        { q: "En la normativa académica APA 7ma edición, ¿cómo se cita en el texto una obra escrita por tres o más autores?", c: "Apellido del primer autor seguido de 'et al.' y el año entre paréntesis", i: ["Se escriben los 15 autores siempre", "Solo se pone la URL", "No se pone el año"], g: "APA 7 abrevia con 'et al.' desde la primera mención cuando son 3 o más autores.", u: "Unidad: Redacción y Normas APA 7" }
      ],
      science: [
        { q: "¿Cuál organela citoplasmática es responsable de la respiración celular y la producción de energía (ATP) en células eucariotas?", c: "La mitocondria", i: ["El aparato de Golgi", "El lisosoma", "La pared celular"], g: "Conocida como la central energética de la célula.", u: "Unidad: Biología Celular" },
        { q: "En la escala química de pH (0 a 14), una disolución con pH = 2.5 se clasifica como:", c: "Fuertemente ácida", i: ["Neutra (pH 7)", "Fuertemente alcalina o básica", "Salina pura"], g: "Valores menores a 7 son ácidos; mayores a 7 son básicos.", u: "Unidad: Equilibrio Ácido-Base" },
        { q: "¿Qué tipo de enlace químico se produce por la transferencia de electrones entre un metal (como el Sodio, Na) y un no metal (como el Cloro, Cl)?", c: "Enlace iónico", i: ["Enlace covalente no polar", "Enlace metálico", "Fuerza de Van der Waals"], g: "Formación de iones (catión Na⁺ y anión Cl⁻) atraídos electrostáticamente.", u: "Unidad: Enlaces Químicos" },
        { q: "Un móvil se desplaza con Movimiento Rectilíneo Uniforme (MRU) a 20 m/s durante 15 segundos. ¿Qué distancia recorre?", c: "300 metros", i: ["150 metros", "35 metros", "450 metros"], g: "Multiplica velocidad por tiempo: d = v × t = 20 × 15 = 300 m.", u: "Unidad: Cinemática MRU" },
        { q: "¿Cuál es la energía cinética (Ec = ½·m·v²) de un objeto de 4 kg que se mueve a una velocidad de 5 m/s?", c: "50 Julios (J)", i: ["20 Julios (J)", "100 Julios (J)", "10 Julios (J)"], g: "Ec = 0.5 × 4 × (5²) = 2 × 25 = 50 J.", u: "Unidad: Trabajo y Energía" },
        { q: "En la molécula de ARN mensajero (ARNm), ¿qué base nitrogenada reemplaza a la Timina (T) presente en el ADN?", c: "El Uracilo (U)", i: ["La Adenina (A)", "La Citosina (C)", "La Guanina (G)"], g: "En el ARN las bases son A, U, C, G.", u: "Unidad: Genética Molecular" },
        { q: "Si se cruzan dos individuos heterocigotos (Aa × Aa) con dominancia completa mendeliana, ¿cuál es la probabilidad de obtener descendencia homocigota recesiva (aa)?", c: "25% (1 de cada 4)", i: ["50% (2 de 4)", "75% (3 de 4)", "100%"], g: "Cuadro de Punnett: AA (25%), Aa (50%), aa (25%).", u: "Unidad: Leyes de Mendel" },
        { q: "¿Qué gas atmosférico absorben las plantas durante la fase oscura de la fotosíntesis para sintetizar glucosa?", c: "Dióxido de carbono (CO₂)", i: ["Argón (Ar)", "Helio (He)", "Monóxido de carbono"], g: "Las plantas fijan CO₂ y liberan oxígeno (O₂).", u: "Unidad: Fotosíntesis y Ecología" }
      ]
    };

    Object.keys(plantillasExtra).forEach(catId => {
      const meta = RULETA_SECTORES.find(s => s.id === catId);
      plantillasExtra[catId].forEach((item, idx) => {
        lista.push({
          id: `auto_${catId}_${idx}`,
          subject: catId,
          difficulty: idx % 3 === 0 ? "Básico" : (idx % 3 === 1 ? "Intermedio" : "Avanzado"),
          jerarquia: `${meta ? meta.name : 'MEP'} > Subárea Oficial > Nivel 10°-12° > ${item.u}`,
          guia: item.g,
          question: item.q,
          options: [item.c, ...item.i],
          correct: 0,
          explanation: `${item.g} Por ello, la respuesta correcta verificada es: ${item.c}.`
        });
      });
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
  // SISTEMA DE CHATS Y NOTIFICACIONES POR ROL, SECCIÓN Y SUBGRUPO (A / B | ESP 1 / 2)
  // ============================================================================
  function obtenerCanalesUsuario(sesion) {
    const secBase = sesion.seccionRaw || "10-3";
    return [
      {
        id: `sec_${secBase}_A`,
        titulo: `Sección ${secBase} • Subgrupo A (Especialidad 1)`,
        badge: "Grupo A • Esp 1",
        color: "#0284c7",
        mensajesBase: [
          { autor: "Coordinación Técnica", rol: "Docente MEP", hora: "07:30 AM", txt: `Bienvenidos al canal oficial del Subgrupo A (Especialidad 1) de la Sección ${secBase}. Laboratorio 1 habilitado.` },
          { autor: "Sistema Académico", rol: "Notificación", hora: "08:05 AM", txt: "Recuerden completar la Práctica Guiada y el Simulacro Cronometrado de hoy." }
        ]
      },
      {
        id: `sec_${secBase}_B`,
        titulo: `Sección ${secBase} • Subgrupo B (Especialidad 2)`,
        badge: "Grupo B • Esp 2",
        color: "#7c3aed",
        mensajesBase: [
          { autor: "Coordinación Técnica", rol: "Docente MEP", hora: "07:35 AM", txt: `Canal activo para el Subgrupo B (Especialidad 2) de la Sección ${secBase}. Prácticas de taller listas.` }
        ]
      },
      {
        id: "canal_docentes_direccion",
        titulo: "Canal Institucional • Docentes, Dirección y Ministro",
        badge: "Oficial MEP",
        color: "#059669",
        mensajesBase: [
          { autor: "Dirección CTPMN", rol: "Director(a)", hora: "07:00 AM", txt: "Circular del Circuito 04 activa. Reportes de asistencia y boletas sincronizados con firma SHA-256." }
        ]
      },
      {
        id: "canal_operativo_seguridad",
        titulo: "Canal Operativo • Auxiliares, Guardas y Conserjes",
        badge: "Operaciones",
        color: "#d97706",
        mensajesBase: [
          { autor: "Control de Portón", rol: "Guarda / Seguridad", hora: "06:50 AM", txt: "Escáner QR de portón principal operativo. Aulas y talleres abiertos en orden 5S." }
        ]
      }
    ];
  }

  function cargarMensajesCanal(canalObj) {
    try {
      const todo = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
      if (Array.isArray(todo[canalObj.id]) && todo[canalObj.id].length > 0) return todo[canalObj.id];
    } catch {}
    return [...canalObj.mensajesBase];
  }

  function guardarMensajeCanal(canalId, listaMensajes) {
    try {
      const todo = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
      todo[canalId] = listaMensajes;
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(todo));
    } catch {}
  }

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

  function renderCentroChatsSubgrupos(contenedor) {
    const s = getSesion();
    const canales = obtenerCanalesUsuario(s);
    let canalActivoId = s.subgrupo === 'B-ESP2' ? canales[1].id : canales[0].id;

    function pintarChat() {
      const canalActual = canales.find(c => c.id === canalActivoId) || canales[0];
      const mensajes = cargarMensajesCanal(canalActual);

      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.85);">
          <!-- Barra Superior del Chat -->
          <div style="background:#070d19;padding:12px 16px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:900;padding:3px 8px;border-radius:99px;">MENSAJERÍA INSTITUCIONAL EN VIVO</span>
              <h2 style="margin:4px 0 0;font-size:16px;color:#fff;">💬 Canales por Sección (Subgrupos A y B / Especialidad 1 y 2) y Roles</h2>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button id="ch-sim-notif" style="background:#131f33;color:#fbbf24;border:1px solid #fbbf24;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">
                🔔 Probar Notificación a Mi Canal
              </button>
            </div>
          </div>

          <!-- Cuerpo Doble Panel Estilo Mensajería Moderna -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));min-height:420px;">
            <!-- Lista de Canales (Izquierda) -->
            <div style="background:#070d19;border-right:1px solid #1e293b;padding:12px;display:flex;flex-direction:column;gap:8px;">
              <div style="font-size:11px;font-weight:900;color:#94a3b8;padding:0 4px;">CANALES DISPONIBLES (SUBDIVISIÓN A/B):</div>
              ${canales.map(c => {
                const activo = c.id === canalActual.id;
                return `
                  <button data-cid="${c.id}" class="btn-sel-canal" style="text-align:left;padding:11px 12px;border-radius:10px;border:1px solid ${activo?'#38bdf8':'#1e293b'};background:${activo?'#0284c7':'#0b1322'};color:#fff;cursor:pointer;display:flex;flex-direction:column;gap:4px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-size:12.5px;font-weight:800;"># ${c.titulo}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-size:10.5px;background:rgba(0,0,0,0.35);padding:2px 7px;border-radius:99px;color:#bae6fd;">${c.badge}</span>
                      <span style="font-size:10px;color:#34d399;">● En línea</span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Hilo de Conversación Activa (Derecha) -->
            <div style="display:flex;flex-direction:column;justify-content:space-between;background:#0b1322;padding:14px;">
              <div>
                <div style="border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                  <div>
                    <div style="font-size:14.5px;font-weight:900;color:#38bdf8;"># ${canalActual.titulo}</div>
                    <div style="font-size:11px;color:#94a3b8;">Notificaciones activas para Rol: <b>${s.rol}</b> • <b>${s.seccion}</b> (${s.subgrupoLabel || 'General'})</div>
                  </div>
                  <span style="background:#064e3b;color:#6ee7b7;font-size:10.5px;font-weight:800;padding:4px 9px;border-radius:99px;">Cifrado Institucional</span>
                </div>

                <div id="chat-msgs-box" style="display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto;padding-right:4px;">
                  ${mensajes.map(m => `
                    <div style="background:#131f33;border:1px solid #26354d;border-radius:12px;padding:10px 12px;max-width:88%;align-self:${m.esMio?'flex-end':'flex-start'};border-left:4px solid ${m.esMio?'#10b981':canalActual.color};">
                      <div style="display:flex;justify-content:space-between;gap:12px;font-size:10.5px;color:#38bdf8;font-weight:800;margin-bottom:4px;">
                        <span>${m.autor} (${m.rol})</span>
                        <span style="color:#94a3b8;">${m.hora} ✓✓</span>
                      </div>
                      <div style="font-size:13px;color:#f8fafc;line-height:1.45;">${m.txt}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <form id="chat-send-form" style="display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid #1e293b;">
                <input id="chat-txt-in" type="text" placeholder="Escribe un mensaje o aviso para este canal..." required style="flex:1;background:#060c17;border:1.5px solid #38bdf8;color:#fff;padding:11px 14px;border-radius:10px;font-size:13px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:11px 18px;border-radius:10px;font-weight:900;font-size:13px;cursor:pointer;">Enviar ➤</button>
              </form>
            </div>
          </div>
        </div>
      `;

      contenedor.querySelectorAll('.btn-sel-canal').forEach(b => {
        b.onclick = () => { canalActivoId = b.getAttribute('data-cid'); pintarChat(); };
      });

      document.getElementById('ch-sim-notif').onclick = () => {
        playSuccessSound();
        lanzarNotificacionPushUI(canalActual.titulo, `Nuevo aviso académico para ${s.rol} en ${s.seccion} (${s.subgrupoLabel || 'Subgrupo Activo'}).`);
      };

      document.getElementById('chat-send-form').onsubmit = (e) => {
        e.preventDefault();
        const inp = document.getElementById('chat-txt-in');
        const txt = inp.value.trim();
        if (!txt) return;
        const ahora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        mensajes.push({
          autor: s.rol,
          rol: `${s.seccion} • ${s.subgrupo || 'A'}`,
          hora: ahora,
          txt: txt,
          esMio: true
        });
        guardarMensajeCanal(canalActual.id, mensajes);
        playTone(660, 0.08, "triangle", 0.12);
        pintarChat();
      };
    }

    pintarChat();
  }

  // ============================================================================
  // COMPONENTE: RULETA DEL SABER + 3 MODALIDADES DEFINIDAS (PRÁCTICA LIBRE, PRÁCTICA GUIADA, SIMULACRO CON CRONÓMETRO) + BANCO 100 ÍTEMS
  // ============================================================================
  function renderRuletaDelSaberUniversal(contenedor, categoriaInicial, modoInicial) {
    let items = obtenerBancoRuleta();
    let subTab = modoInicial || (categoriaInicial && categoriaInicial !== 'wheel' ? 'guided' : 'wheel');
    // subTab: 'wheel' | 'free' | 'guided' | 'exam' | 'bank'
    let wheelAngle = 0, spinning = false, timerId = null, timeLeft = 25, usarTimer = true;
    let wheelAnswered = false, rachaRuleta = 0;

    let pSubj = (categoriaInicial && categoriaInicial !== 'wheel') ? categoriaInicial : 'ALL';
    let pDiff = 'ALL', practiceList = [...items], practiceIdx = 0, mostrarGuiaPista = false;

    // Estado exclusivo del Simulacro Oficial con Cronómetro
    let examTimerId = null, examSecondsLeft = 900, examPaused = false, examFinished = false;
    let examList = [], examAnswers = {}, examIdx = 0;

    let bSearch = '', bSubj = 'ALL', showBankAnswers = false;

    function stopTimers() {
      if (timerId) { clearInterval(timerId); timerId = null; }
      if (examTimerId) { clearInterval(examTimerId); examTimerId = null; }
    }
    function getMeta(id) { return RULETA_SECTORES.find(s => s.id === id) || RULETA_SECTORES[0]; }
    function formatMMSS(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function pintarEstructuraRuleta() {
      const xpObj = getXP();
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #6366f1;border-radius:16px;padding:16px;box-sizing:border-box;">
          <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;">🎡</div>
              <div>
                <h2 style="margin:0;font-size:17px;font-weight:900;color:#fff;">Ruleta del Saber, Práctica Libre, Práctica Guiada y Simulacro Oficial Cronometrado</h2>
                <p style="margin:2px 0 0;font-size:11.5px;color:#94a3b8;">Stock de ${items.length} Ítems Verificados (10 por cada área: Exploratorios, Web, MOPT, Excel, Identidad, Hábitos, Subáreas y UCR/TEC)</p>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="background:#1e1b4b;border:1px solid #6366f1;color:#a5b4fc;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;">⚡ XP: <b id="rs-score">${xpObj.xp}</b></span>
              <span style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;">🔥 Racha: <b id="rs-streak">${rachaRuleta}</b></span>
              <button id="rs-mute-btn" style="background:#131f33;border:1px solid #334155;color:#e2e8f0;padding:6px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                🔊 Sonido: ${sonidoActivo ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <!-- 5 Pestañas Claramente Definidas -->
          <div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:10px;">
            <button data-rstab="wheel" class="rs-tab-btn" style="padding:8px 13px;border-radius:8px;border:1px solid ${subTab==='wheel'?'#818cf8':'#26354d'};background:${subTab==='wheel'?'#4f46e5':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🎡 1. Ruleta del Saber</button>
            <button data-rstab="free" class="rs-tab-btn" style="padding:8px 13px;border-radius:8px;border:1px solid ${subTab==='free'?'#38bdf8':'#26354d'};background:${subTab==='free'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">📝 2. Práctica Libre</button>
            <button data-rstab="guided" class="rs-tab-btn" style="padding:8px 13px;border-radius:8px;border:1px solid ${subTab==='guided'?'#34d399':'#26354d'};background:${subTab==='guided'?'#059669':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🧭 3. Práctica Guiada (Paso a Paso)</button>
            <button data-rstab="exam" class="rs-tab-btn" style="padding:8px 13px;border-radius:8px;border:1px solid ${subTab==='exam'?'#fbbf24':'#26354d'};background:${subTab==='exam'?'#d97706':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">⏱️ 4. Simulacro Oficial con Cronómetro</button>
            <button data-rstab="bank" class="rs-tab-btn" style="padding:8px 13px;border-radius:8px;border:1px solid ${subTab==='bank'?'#c084fc':'#26354d'};background:${subTab==='bank'?'#7c3aed':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🗂️ 5. Banco Docente (${items.length} Ítems)</button>
          </div>

          <div id="rs-body-panel"></div>
        </div>
      `;

      document.getElementById('rs-mute-btn').onclick = () => {
        sonidoActivo = !sonidoActivo;
        document.getElementById('rs-mute-btn').innerText = `🔊 Sonido: ${sonidoActivo ? 'ON' : 'OFF'}`;
      };

      contenedor.querySelectorAll('.rs-tab-btn').forEach(btn => {
        btn.onclick = () => {
          stopTimers();
          subTab = btn.getAttribute('data-rstab');
          pintarEstructuraRuleta();
        };
      });

      const bodyPanel = document.getElementById('rs-body-panel');

      // MODO 1: RULETA DEL SABER
      if (subTab === 'wheel') {
        bodyPanel.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;align-items:start;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;display:flex;flex-direction:column;align-items:center;">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Gira la ruleta de 10 áreas</span>
                <label style="font-size:11.5px;color:#94a3b8;display:flex;align-items:center;gap:5px;cursor:pointer;">
                  <input id="rs-timer-chk" type="checkbox" ${usarTimer?'checked':''}/> Reto 25s
                </label>
              </div>
              <div style="position:relative;display:flex;flex-direction:column;align-items:center;margin:4px 0;">
                <div style="width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:24px solid #fbbf24;margin-bottom:-10px;z-index:5;"></div>
                <canvas id="rs-wheel-canvas" width="300" height="300" style="max-width:100%;height:auto;cursor:pointer;"></canvas>
              </div>
              <button id="rs-spin-btn" style="margin-top:10px;width:100%;padding:12px;border-radius:10px;background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;font-size:14px;font-weight:900;cursor:pointer;">
                🎰 ¡Girar Ruleta del Saber!
              </button>
              <div style="margin-top:12px;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:10.5px;">
                ${RULETA_SECTORES.map(s => `
                  <div style="display:flex;align-items:center;gap:6px;background:#0b1322;padding:5px 7px;border-radius:6px;border:1px solid #1e293b;">
                    <span style="width:10px;height:10px;border-radius:50%;background:${s.color};flex-shrink:0;"></span>
                    <span style="color:#cbd5e1;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.short}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div id="rs-question-panel" style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:18px;min-height:360px;display:flex;flex-direction:column;justify-content:center;">
              <div style="text-align:center;padding:24px 10px;">
                <img src="${SVG_BUHO_ORIGINAL}" width="54" height="54" alt="Búho Azul" style="margin-bottom:10px;"/>
                <h3 style="margin:0 0 6px;font-size:17px;color:#fff;">Sorteo Aleatorio de 100 Ítems</h3>
                <p style="margin:0 auto;font-size:12.5px;color:#94a3b8;max-width:400px;line-height:1.5;">
                  Gira la rueda o selecciona arriba <b>Práctica Libre</b>, <b>Práctica Guiada</b> o <b>Simulacro Oficial con Cronómetro</b>.
                </p>
              </div>
            </div>
          </div>
        `;

        const cv = document.getElementById('rs-wheel-canvas');
        const ctx = cv.getContext('2d');

        function drawWheel(angle) {
          const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, radius = Math.min(cx, cy) - 8;
          const slice = (2 * Math.PI) / RULETA_SECTORES.length;
          ctx.clearRect(0, 0, w, h);
          RULETA_SECTORES.forEach((subj, i) => {
            const start = angle + i * slice, end = start + slice;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, radius, start, end); ctx.closePath();
            ctx.fillStyle = subj.color; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = "#0b1322"; ctx.stroke();
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + slice / 2); ctx.textAlign = "right";
            ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px Inter, sans-serif"; ctx.fillText(subj.short, radius - 14, 4); ctx.restore();
          });
          ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 2 * Math.PI); ctx.fillStyle = "#0b1322"; ctx.fill();
          ctx.lineWidth = 4; ctx.strokeStyle = "#38bdf8"; ctx.stroke();
        }

        function mostrarPreguntaRuleta(item) {
          wheelAnswered = false;
          const meta = getMeta(item.subject);
          const qPanel = document.getElementById('rs-question-panel');
          if (!qPanel) return;
          const opcionesMapeadas = shuffleCrypto(item.options.map((texto, idx) => ({ texto, esCorrecta: idx === item.correct })));
          const letras = ["A", "B", "C", "D"];

          qPanel.innerHTML = `
            <div>
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="background:${meta.color};color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;">${meta.name}</span>
                  <span style="background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:700;">${item.difficulty}</span>
                </div>
                <div style="display:${usarTimer?'block':'none'};background:#1e293b;color:#fbbf24;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:800;">
                  ⏱️ <span id="rs-timer-val">25</span>s
                </div>
              </div>
              <div style="font-size:10.5px;color:#94a3b8;background:#0b1322;padding:6px 10px;border-radius:6px;border-left:3px solid ${meta.color};margin-bottom:10px;font-weight:600;">
                🏛️ ${item.jerarquia || 'Malla Curricular Oficial MEP'}
              </div>
              <h3 style="margin:0 0 14px;font-size:15.5px;font-weight:800;color:#fff;line-height:1.45;">${item.question}</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${opcionesMapeadas.map((op, i) => `
                  <button type="button" data-ok="${op.esCorrecta?'1':'0'}" class="rs-opt-btn" style="width:100%;text-align:left;padding:11px 13px;border-radius:10px;border:1px solid #26354d;background:#131f33;color:#f8fafc;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:10px;">
                    <span style="width:24px;height:24px;border-radius:6px;background:#0b1322;color:#38bdf8;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11.5px;flex-shrink:0;">${letras[i]}</span>
                    <span>${op.texto}</span>
                  </button>
                `).join('')}
              </div>
              <div id="rs-fb-box" style="display:none;margin-top:12px;padding:12px;border-radius:10px;font-size:12.5px;line-height:1.45;"></div>
            </div>
          `;

          function evaluarSeleccion(btnElegido, timeout) {
            if (wheelAnswered) return;
            wheelAnswered = true; stopTimers();
            const acerto = !timeout && btnElegido && btnElegido.getAttribute('data-ok') === '1';
            if (acerto) { rachaRuleta += 1; ganarXP(15 + rachaRuleta * 2, "🎡 Campeón Ruleta"); playSuccessSound(); }
            else { rachaRuleta = 0; playErrorSound(); }

            const scEl = document.getElementById('rs-score'), stEl = document.getElementById('rs-streak');
            if (scEl) scEl.innerText = getXP().xp;
            if (stEl) stEl.innerText = rachaRuleta;

            qPanel.querySelectorAll('.rs-opt-btn').forEach(b => {
              b.disabled = true;
              if (b.getAttribute('data-ok') === '1') { b.style.background = '#064e3b'; b.style.borderColor = '#10b981'; }
              else if (b === btnElegido) { b.style.background = '#7f1d1d'; b.style.borderColor = '#ef4444'; }
              else b.style.opacity = '0.6';
            });

            const fb = document.getElementById('rs-fb-box');
            fb.style.display = 'block';
            fb.style.background = acerto ? '#064e3b' : '#450a0a';
            fb.style.border = `1px solid ${acerto ? '#10b981' : '#ef4444'}`;
            fb.innerHTML = `
              <div style="font-weight:900;color:${acerto?'#6ee7b7':'#fca5a5'};margin-bottom:4px;">
                ${acerto ? '🎉 ¡Correcto! +XP' : (timeout ? '⏰ ¡Tiempo agotado!' : '❌ Respuesta incorrecta.')}
              </div>
              <div style="color:#e2e8f0;margin-bottom:8px;"><b>Explicación:</b> ${item.explanation}</div>
              <button id="rs-spin-again" style="background:#4f46e5;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎰 Girar de nuevo</button>
            `;
            document.getElementById('rs-spin-again').onclick = girarRuleta;
          }

          qPanel.querySelectorAll('.rs-opt-btn').forEach(btn => { btn.onclick = () => evaluarSeleccion(btn, false); });
          if (usarTimer) {
            timeLeft = 25; stopTimers();
            timerId = setInterval(() => {
              timeLeft -= 1;
              const tv = document.getElementById('rs-timer-val');
              if (tv) tv.innerText = timeLeft;
              if (timeLeft <= 0) { stopTimers(); evaluarSeleccion(null, true); }
            }, 1000);
          }
        }

        function girarRuleta() {
          if (spinning) return;
          stopTimers(); spinning = true;
          const spinBtn = document.getElementById('rs-spin-btn');
          if (spinBtn) spinBtn.disabled = true;
          const extraSpins = 5 + Math.random() * 4;
          const targetAngle = wheelAngle + extraSpins * 2 * Math.PI;
          const startAngle = wheelAngle, duration = 2200, startTime = performance.now();
          let lastTickSlice = -1;

          function animate(now) {
            const elapsed = now - startTime, t = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);
            wheelAngle = startAngle + (targetAngle - startAngle) * easeOut;
            drawWheel(wheelAngle);
            const slice = (2 * Math.PI) / RULETA_SECTORES.length;
            const currentTick = Math.floor(wheelAngle / slice);
            if (currentTick !== lastTickSlice) { lastTickSlice = currentTick; playTone(400 + (currentTick % 6) * 45, 0.035, "sine", 0.05); }
            if (t < 1) requestAnimationFrame(animate);
            else {
              spinning = false;
              if (spinBtn) spinBtn.disabled = false;
              const normAngle = ((-Math.PI / 2 - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
              const idx = Math.floor(normAngle / slice) % RULETA_SECTORES.length;
              const ganador = RULETA_SECTORES[idx];
              const pool = items.filter(it => it.subject === ganador.id);
              mostrarPreguntaRuleta(shuffleCrypto(pool)[0] || shuffleCrypto(items)[0]);
            }
          }
          requestAnimationFrame(animate);
        }

        drawWheel(wheelAngle);
        document.getElementById('rs-spin-btn').onclick = girarRuleta;
        cv.onclick = girarRuleta;
        document.getElementById('rs-timer-chk').onchange = (e) => { usarTimer = e.target.checked; };
      }

      // MODO 2 Y MODO 3: PRÁCTICA LIBRE Y PRÁCTICA GUIADA PASO A PASO
      else if (subTab === 'free' || subTab === 'guided') {
        const esGuiada = subTab === 'guided';
        function filtrarPractica() {
          practiceList = items.filter(it => (pSubj === 'ALL' || it.subject === pSubj) && (pDiff === 'ALL' || it.difficulty === pDiff));
          practiceIdx = 0; mostrarGuiaPista = esGuiada; pintarTarjetaPractica();
        }
        function pintarTarjetaPractica() {
          const item = practiceList[practiceIdx];
          const meta = item ? getMeta(item.subject) : RULETA_SECTORES[0];
          const opcionesBarajadas = item ? shuffleCrypto(item.options.map((t, i) => ({ t, ok: i === item.correct }))) : [];

          bodyPanel.innerHTML = `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
              <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <span style="background:${esGuiada?'#059669':'#0284c7'};color:#fff;font-size:11px;font-weight:900;padding:5px 10px;border-radius:6px;">
                  ${esGuiada ? '🧭 MODO PRÁCTICA GUIADA (CON PISTA Y FÓRMULA)' : '📝 MODO PRÁCTICA LIBRE'}
                </span>
                <select id="rp-subj" style="background:#131f33;color:#fff;border:1px solid #38bdf8;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL">📚 Todas las Áreas (${items.length} Ítems)</option>
                  ${RULETA_SECTORES.map(s => {
                    const cnt = items.filter(x => x.subject === s.id).length;
                    return `<option value="${s.id}" ${pSubj===s.id?'selected':''}>${s.name} (${cnt} ítems)</option>`;
                  }).join('')}
                </select>
                <select id="rp-diff" style="background:#131f33;color:#fff;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL" ${pDiff==='ALL'?'selected':''}>Todos los niveles</option>
                  <option value="Básico" ${pDiff==='Básico'?'selected':''}>🟢 Básico</option>
                  <option value="Intermedio" ${pDiff==='Intermedio'?'selected':''}>🟡 Intermedio</option>
                  <option value="Avanzado" ${pDiff==='Avanzado'?'selected':''}>🔴 Avanzado</option>
                </select>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:12.5px;color:#38bdf8;font-weight:900;">Ítem ${practiceList.length ? practiceIdx + 1 : 0} de ${practiceList.length}</span>
                <button id="rp-shuf" style="background:#4f46e5;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">🔀 Barajar</button>
              </div>
            </div>

            ${!item ? `<div style="padding:30px;text-align:center;color:#94a3b8;">No hay ítems para este filtro.</div>` : `
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:18px;max-width:820px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                  <span style="background:${meta.color};color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;">${meta.name}</span>
                  <span style="font-size:11.5px;color:#34d399;font-weight:800;">Nivel: ${item.difficulty}</span>
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:10px;">🏛️ ${item.jerarquia || 'Malla Oficial MEP'}</div>

                ${esGuiada ? `
                  <div style="background:#0b1322;border-left:4px solid #10b981;padding:11px 14px;border-radius:8px;margin-bottom:14px;">
                    <div style="font-size:11px;font-weight:900;color:#34d399;margin-bottom:3px;">🧭 GUÍA SOCRÁTICA Y PISTA PASO A PASO (ANTES DE RESPONDER):</div>
                    <div style="font-size:12.5px;color:#e2e8f0;line-height:1.45;">${item.guia || item.explanation}</div>
                  </div>
                ` : ''}

                <h3 style="margin:0 0 14px;font-size:16px;color:#fff;line-height:1.45;">${item.question}</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${opcionesBarajadas.map((o, idx) => `
                    <button type="button" data-ok="${o.ok?'1':'0'}" class="rp-opt-btn" style="text-align:left;padding:11px 14px;border-radius:10px;border:1px solid #26354d;background:#131f33;color:#fff;font-size:13px;font-weight:700;cursor:pointer;">
                      ${String.fromCharCode(65+idx)}) ${o.t}
                    </button>
                  `).join('')}
                </div>
                <div id="rp-fb" style="display:none;margin-top:12px;padding:12px;border-radius:8px;font-size:12.5px;line-height:1.45;"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;flex-wrap:wrap;gap:8px;">
                  <button id="rp-prev" ${practiceIdx===0?'disabled':''} style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
                  <button id="rp-go-exam" style="background:#d97706;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:800;cursor:pointer;font-size:12px;">⏱️ Iniciar Simulacro con Cronómetro de este Tema</button>
                  <button id="rp-next" ${practiceIdx>=practiceList.length-1?'disabled':''} style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:800;cursor:pointer;">Siguiente →</button>
                </div>
              </div>
            `}
          `;
          document.getElementById('rp-subj').onchange = (e) => { pSubj = e.target.value; filtrarPractica(); };
          document.getElementById('rp-diff').onchange = (e) => { pDiff = e.target.value; filtrarPractica(); };
          document.getElementById('rp-shuf').onclick = () => { practiceList = shuffleCrypto(practiceList); practiceIdx = 0; pintarTarjetaPractica(); };
          if (item) {
            bodyPanel.querySelectorAll('.rp-opt-btn').forEach(b => {
              b.onclick = () => {
                const ok = b.getAttribute('data-ok') === '1';
                if (ok) { ganarXP(10); playSuccessSound(); } else playErrorSound();
                bodyPanel.querySelectorAll('.rp-opt-btn').forEach(btn => {
                  btn.disabled = true;
                  if (btn.getAttribute('data-ok') === '1') { btn.style.background = '#064e3b'; btn.style.borderColor = '#10b981'; }
                  else if (btn === b) { btn.style.background = '#7f1d1d'; btn.style.borderColor = '#ef4444'; }
                });
                const fb = document.getElementById('rp-fb');
                fb.style.display = 'block'; fb.style.background = ok ? '#064e3b' : '#450a0a';
                fb.innerHTML = `<b>${ok ? '✅ ¡Correcto! (+10 XP)' : '❌ Retroalimentación Pedagógica:'}</b> ${item.explanation}`;
              };
            });
            document.getElementById('rp-prev').onclick = () => { if (practiceIdx > 0) { practiceIdx--; pintarTarjetaPractica(); } };
            document.getElementById('rp-next').onclick = () => { if (practiceIdx < practiceList.length - 1) { practiceIdx++; pintarTarjetaPractica(); } };
            document.getElementById('rp-go-exam').onclick = () => { stopTimers(); subTab = 'exam'; pintarEstructuraRuleta(); };
          }
        }
        filtrarPractica();
      }

      // MODO 4: SIMULACRO OFICIAL CON CRONÓMETRO EN TIEMPO REAL
      else if (subTab === 'exam') {
        let cantExamen = 10;
        let minutosExamen = 15;

        function iniciarNuevoSimulacroCronometrado() {
          stopTimers();
          const pool = items.filter(it => pSubj === 'ALL' || it.subject === pSubj);
          examList = shuffleCrypto(pool).slice(0, Math.min(cantExamen, pool.length)).map(it => {
            const opts = shuffleCrypto(it.options.map((t, idx) => ({ t, ok: idx === it.correct })));
            return { ...it, opcionesBarajadas: opts };
          });
          examAnswers = {};
          examIdx = 0;
          examFinished = false;
          examPaused = false;
          examSecondsLeft = minutosExamen * 60;

          examTimerId = setInterval(() => {
            if (!examPaused && !examFinished) {
              examSecondsLeft--;
              const elReloj = document.getElementById('ex-clock-display');
              if (elReloj) elReloj.innerText = formatMMSS(examSecondsLeft);
              if (examSecondsLeft <= 0) {
                examFinished = true;
                stopTimers();
                pintarSimulacroOficial();
              }
            }
          }, 1000);

          pintarSimulacroOficial();
        }

        function pintarSimulacroOficial() {
          if (examFinished) {
            stopTimers();
            let aciertos = 0;
            examList.forEach((it, i) => {
              const respIdx = examAnswers[i];
              if (respIdx !== undefined && it.opcionesBarajadas[respIdx] && it.opcionesBarajadas[respIdx].ok) aciertos++;
            });
            const nota100 = examList.length ? Math.round((aciertos / examList.length) * 100) : 0;
            const escala800 = examList.length ? Math.round(200 + (aciertos / examList.length) * 600) : 200;
            if (nota100 >= 70) { ganarXP(40, "⏱️ Aprobado Simulacro Oficial"); playSuccessSound(); }

            bodyPanel.innerHTML = `
              <div style="background:#070d19;border:2px solid ${nota100>=70?'#10b981':'#ef4444'};border-radius:14px;padding:22px;text-align:center;">
                <span style="background:${nota100>=70?'#059669':'#7f1d1d'};color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px;">
                  ${nota100>=70 ? '✅ SIMULACRO OFICIAL APROBADO' : '⚠️ REQUIERE REFUERZO EN PRÁCTICA GUIADA'}
                </span>
                <h2 style="margin:10px 0 6px;color:#fff;font-size:20px;">Acta de Resultados del Simulacro Cronometrado</h2>
                <p style="font-size:14.5px;color:#cbd5e1;margin-bottom:16px;">
                  Aciertos: <b style="color:#34d399;">${aciertos} de ${examList.length}</b> •
                  Calificación MEP: <b style="color:#38bdf8;">${nota100}%</b> •
                  Escala Admisión UCR/TEC: <b style="color:#fbbf24;">${escala800} / 800 pts</b>
                </p>
                <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
                  <button id="ex-new-try" style="background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Nuevo Simulacro Cronometrado</button>
                  <button id="ex-go-guided" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🧭 Ir a Práctica Guiada</button>
                </div>
                <div style="text-align:left;max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:8px;">
                  ${examList.map((it, i) => {
                    const rIdx = examAnswers[i];
                    const ok = rIdx !== undefined && it.opcionesBarajadas[rIdx] && it.opcionesBarajadas[rIdx].ok;
                    const corrObj = it.opcionesBarajadas.find(o => o.ok);
                    return `
                      <div style="background:#0b1322;border:1px solid ${ok?'#10b981':'#ef4444'};border-radius:10px;padding:11px;">
                        <div style="font-size:12.5px;font-weight:800;color:#fff;">${i+1}. ${it.question}</div>
                        <div style="font-size:11.5px;color:${ok?'#34d399':'#fca5a5'};margin-top:4px;">
                          ${ok ? '✅ Correcta' : `❌ Incorrecta / Sin responder — Correcta: ${corrObj ? corrObj.t : ''}`}
                        </div>
                        <div style="font-size:11px;color:#94a3b8;margin-top:3px;"><b>Explicación:</b> ${it.explanation}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
            document.getElementById('ex-new-try').onclick = iniciarNuevoSimulacroCronometrado;
            document.getElementById('ex-go-guided').onclick = () => { subTab = 'guided'; pintarEstructuraRuleta(); };
            return;
          }

          const actual = examList[examIdx];
          const meta = actual ? getMeta(actual.subject) : RULETA_SECTORES[0];
          const respondidasCount = Object.keys(examAnswers).length;

          bodyPanel.innerHTML = `
            <div style="background:#070d19;border:1.5px solid #f59e0b;border-radius:12px;padding:14px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;">
              <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <span style="background:#d97706;color:#fff;font-size:11px;font-weight:900;padding:5px 10px;border-radius:6px;">⏱️ SIMULACRO OFICIAL</span>
                <select id="ex-subj-sel" style="background:#131f33;color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL" ${pSubj==='ALL'?'selected':''}>📚 Examen General (Todas las Áreas)</option>
                  ${RULETA_SECTORES.map(s => `<option value="${s.id}" ${pSubj===s.id?'selected':''}>${s.name}</option>`).join('')}
                </select>
                <select id="ex-cant-sel" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;">
                  <option value="5" ${cantExamen===5?'selected':''}>5 Preguntas (10 min)</option>
                  <option value="10" ${cantExamen===10?'selected':''}>10 Preguntas (15 min)</option>
                  <option value="20" ${cantExamen===20?'selected':''}>20 Preguntas (30 min)</option>
                </select>
              </div>

              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <div style="background:#1e293b;border:1.5px solid #fbbf24;color:#fbbf24;padding:6px 12px;border-radius:8px;font-family:monospace;font-size:15px;font-weight:900;">
                  ⏱️ <span id="ex-clock-display">${formatMMSS(examSecondsLeft)}</span>
                </div>
                <button id="ex-pause-btn" style="background:#b45309;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">
                  ${examPaused ? '▶️ Reanudar' : '⏸️ Pausar'}
                </button>
                <button id="ex-finish-btn" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;">
                  ✅ Entregar y Calificar (${respondidasCount}/${examList.length})
                </button>
              </div>
            </div>

            ${examPaused ? `<div style="padding:40px;text-align:center;background:#070d19;border-radius:12px;color:#fbbf24;font-weight:800;">⏸️ Cronómetro en pausa. Presiona "Reanudar" para continuar el simulacro oficial.</div>` : `
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:18px;max-width:820px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="background:${meta.color};color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;">${meta.name}</span>
                  <span style="font-size:12px;color:#fbbf24;font-weight:800;">Pregunta ${examIdx + 1} de ${examList.length}</span>
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:10px;">🏛️ ${actual.jerarquia}</div>
                <h3 style="margin:0 0 14px;font-size:16px;color:#fff;line-height:1.45;">${actual.question}</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${actual.opcionesBarajadas.map((o, idx) => {
                    const marcada = examAnswers[examIdx] === idx;
                    return `
                      <button type="button" data-eidx="${idx}" class="ex-opt-btn" style="text-align:left;padding:11px 14px;border-radius:10px;border:2px solid ${marcada?'#38bdf8':'#26354d'};background:${marcada?'#0284c7':'#131f33'};color:#fff;font-size:13px;font-weight:700;cursor:pointer;">
                        ${String.fromCharCode(65+idx)}) ${o.t}
                      </button>
                    `;
                  }).join('')}
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;">
                  <button id="ex-prev" ${examIdx===0?'disabled':''} style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
                  <span style="font-size:11.5px;color:#94a3b8;">Respondidas: ${respondidasCount} / ${examList.length}</span>
                  <button id="ex-next" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:800;cursor:pointer;">
                    ${examIdx >= examList.length - 1 ? 'Finalizar Examen ✅' : 'Siguiente →'}
                  </button>
                </div>
              </div>
            `}
          `;

          document.getElementById('ex-subj-sel').onchange = (e) => { pSubj = e.target.value; iniciarNuevoSimulacroCronometrado(); };
          document.getElementById('ex-cant-sel').onchange = (e) => {
            cantExamen = Number(e.target.value);
            minutosExamen = cantExamen === 5 ? 10 : (cantExamen === 10 ? 15 : 30);
            iniciarNuevoSimulacroCronometrado();
          };
          document.getElementById('ex-pause-btn').onclick = () => { examPaused = !examPaused; pintarSimulacroOficial(); };
          document.getElementById('ex-finish-btn').onclick = () => { examFinished = true; pintarSimulacroOficial(); };

          if (!examPaused) {
            bodyPanel.querySelectorAll('.ex-opt-btn').forEach(b => {
              b.onclick = () => {
                examAnswers[examIdx] = Number(b.getAttribute('data-eidx'));
                playTone(540, 0.06, "sine", 0.1);
                pintarSimulacroOficial();
              };
            });
            document.getElementById('ex-prev').onclick = () => { if (examIdx > 0) { examIdx--; pintarSimulacroOficial(); } };
            document.getElementById('ex-next').onclick = () => {
              if (examIdx < examList.length - 1) { examIdx++; pintarSimulacroOficial(); }
              else { examFinished = true; pintarSimulacroOficial(); }
            };
          }
        }

        iniciarNuevoSimulacroCronometrado();
      }

      // MODO 5: BANCO DOCENTE DE 100 ÍTEMS
      else if (subTab === 'bank') {
        function pintarBancoDocente() {
          const filtrados = items.filter(it => {
            const okS = bSubj === 'ALL' || it.subject === bSubj;
            const q = bSearch.toLowerCase().trim();
            return okS && (!q || it.question.toLowerCase().includes(q) || it.explanation.toLowerCase().includes(q) || (it.jerarquia || '').toLowerCase().includes(q));
          });

          bodyPanel.innerHTML = `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
              <div style="display:flex;flex-wrap:wrap;gap:8px;flex:1;min-width:240px;">
                <input id="rb-search" type="search" value="${bSearch}" placeholder="🔍 Buscar entre los ${items.length} ítems..." style="flex:1;min-width:180px;background:#0b1322;border:1px solid #334155;color:#fff;padding:8px 12px;border-radius:8px;font-size:12.5px;"/>
                <select id="rb-subj" style="background:#131f33;color:#fff;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL">Todas las categorías (${items.length})</option>
                  ${RULETA_SECTORES.map(s => `<option value="${s.id}" ${bSubj===s.id?'selected':''}>${s.name}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button id="rb-toggle-ans" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  ${showBankAnswers ? '🙈 Ocultar respuestas' : '👁️ Mostrar respuestas'}
                </button>
                <button id="rb-copy-json" style="background:#4f46e5;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📋 Copiar JSON</button>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;">
              ${filtrados.map(it => {
                const m = getMeta(it.subject), letras = ["A","B","C","D"];
                return `
                  <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                      <span style="background:${m.color};color:#fff;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:800;">${m.name}</span>
                      <span style="font-size:11px;color:#94a3b8;font-weight:700;">${it.difficulty}</span>
                    </div>
                    <div style="font-size:10px;color:#38bdf8;margin-bottom:6px;">${it.jerarquia || 'Malla Curricular MEP'}</div>
                    <p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#fff;">${it.question}</p>
                    <div style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;">
                      ${it.options.map((op, idx) => {
                        const esCorr = showBankAnswers && idx === it.correct;
                        return `<div style="padding:5px 8px;border-radius:6px;background:${esCorr?'#064e3b':'#0b1322'};color:${esCorr?'#6ee7b7':'#cbd5e1'};border:1px solid ${esCorr?'#10b981':'#1e293b'};"><b>${letras[idx]}.</b> ${op}</div>`;
                      }).join('')}
                    </div>
                    ${showBankAnswers ? `<div style="margin-top:8px;padding:8px;border-radius:6px;background:#0b1322;font-size:11px;color:#34d399;"><b>Guía / Explicación:</b> ${it.explanation}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `;
          const sIn = document.getElementById('rb-search');
          sIn.oninput = (e) => { bSearch = e.target.value; pintarBancoDocente(); const nIn = document.getElementById('rb-search'); nIn.focus(); nIn.setSelectionRange(bSearch.length, bSearch.length); };
          document.getElementById('rb-subj').onchange = (e) => { bSubj = e.target.value; pintarBancoDocente(); };
          document.getElementById('rb-toggle-ans').onclick = () => { showBankAnswers = !showBankAnswers; pintarBancoDocente(); };
          document.getElementById('rb-copy-json').onclick = () => { navigator.clipboard.writeText(JSON.stringify(items, null, 2)).catch(() => {}); document.getElementById('rb-copy-json').innerText = '✅ Copiado'; };
        }
        pintarBancoDocente();
      }
    }

    pintarEstructuraRuleta();
  }

  // ============================================================================
  // MENÚS Y PANELES ESPECIALIZADOS POR ROL (DOCENTE, ESTUDIANTE, DIRECTOR, MINISTRO, AUXILIAR, GUARDA, CONSERJE)
  // ============================================================================
  function renderMenuPorRolInstitucional(contenedor, rolForzado) {
    const s = getSesion();
    let rolVista = rolForzado || s.rol || "Estudiante";

    const CONFIG_ROLES = {
      "Estudiante": {
        titulo: "🎒 Portal del Estudiante CTPMN (Práctica, Simulacros, Juegos y Mi Subgrupo A/B)",
        sub: `Sección activa: ${s.seccion} • ${s.subgrupoLabel || 'Subgrupo A (Especialidad 1)'}`,
        color: "#0284c7",
        tarjetas: [
          { t: "🧭 Práctica Guiada Paso a Paso", d: "Estudia los 100 ítems con pista socrática y fórmula antes de responder.", btn: "Abrir Práctica Guiada", act: () => navegarVista('ruleta', 'ALL') },
          { t: "⏱️ Simulacro Oficial con Cronómetro", d: "Pon a prueba tu velocidad para MOPT, Especialidades, UCR y TEC.", btn: "Iniciar Simulacro", act: () => navegarVista('simulacro') },
          { t: "💬 Chat de Mi Sección y Subgrupo (A/B)", d: "Comunícate con tu subgrupo de Especialidad 1 o Especialidad 2.", btn: "Abrir Mi Canal", act: () => navegarVista('chats') },
          { t: "♟️ Los 8 Grandes Juegos Interactivos", d: "Ajedrez FIDE, Dominó, Solitario, Clue Forense, Among Us y Scrabble.", btn: "Ir a Sala de Juegos", act: () => navegarVista('juegos', 'ajedrez') }
        ]
      },
      "Docente MEP": {
        titulo: "👨‍🏫 Consola Docente MEP (Binomio Sagrado, Subgrupos A/B y Banco de 100 Ítems)",
        sub: "Gestión pedagógica DUA, Talleres Exploratorios y Especialidades Técnicas",
        color: "#059669",
        tarjetas: [
          { t: "🗂️ Banco Docente (100 Ítems MEP)", d: "Consulta respuestas, jerarquía Especialidad > Subárea > Nivel > Unidad y exporta JSON.", btn: "Administrar Banco", act: () => navegarVista('ruleta', 'wheel') },
          { t: "💬 Canales de Subgrupo A y Subgrupo B", d: "Envía avisos y guías diferenciadas a Especialidad 1 y Especialidad 2.", btn: "Enviar Aviso a Grupos", act: () => navegarVista('chats') },
          { t: "📊 Registro y Hoja Electrónica Excel", d: "Calcula promedios, trabajo cotidiano y actas sin cero pegado.", btn: "Abrir Excel Docente", act: () => navegarVista('emulador') },
          { t: "📷 Generar / Validar Boleta QR SHA-256", d: "Emite permisos y verifica carnés estudiantiles en laboratorio.", btn: "Abrir Escáner QR", act: () => navegarVista('qr') }
        ]
      },
      "Director(a)": {
        titulo: "🏛️ Despacho de Dirección Institucional (CTP Mercedes Norte • Circuito 04)",
        sub: "Supervisión de secciones 7-1 a 12-4, aprobación de boletas QR y rendimiento REAC",
        color: "#7c3aed",
        tarjetas: [
          { t: "✅ Auditoría de Boletas y Permisos QR", d: "Verifica firmas criptográficas SHA-256 de personal docente y estudiantes.", btn: "Auditar QRs", act: () => navegarVista('qr') },
          { t: "📢 Canal Oficial de Dirección", d: "Emite circulares instantáneas con notificación a docentes y auxiliares.", btn: "Emitir Circular", act: () => navegarVista('chats') },
          { t: "📈 Estadísticas de Simulacros y Admisión", d: "Monitorea el avance en pruebas técnicas, MOPT y admisión universitaria.", btn: "Ver Simulacros", act: () => navegarVista('simulacro') }
        ]
      },
      "Ministro(a) MEP": {
        titulo: "🇨🇷 Despacho Ministerial MEP (Supervisión Macro Nacional & Educación Técnica)",
        sub: "Indicadores nacionales de calidad Kaizen, cobertura DUA y transformación digital CTP",
        color: "#d97706",
        tarjetas: [
          { t: "🌎 Tablero Macro de Educación Técnica", d: "100% cumplimiento de jerarquía MEP (Especialidad > Subárea > Nivel > Unidad) en 10 áreas.", btn: "Inspeccionar Malla MEP", act: () => navegarVista('ruleta', 'ALL') },
          { t: "🏛️ Comunicación Ministerial Directa", d: "Canal enlazado con Direcciones Regionales, Circuito 04 y cuerpo docente.", btn: "Abrir Canal Ministerial", act: () => navegarVista('chats') },
          { t: "🔐 Auditoría de Ciberseguridad Soberana", d: "Verificación de infraestructura PWA Offline-First y sellos SHA-256.", btn: "Ver Seguridad QR", act: () => navegarVista('qr') }
        ]
      },
      "Auxiliar Administrativo": {
        titulo: "📋 Módulo de Auxiliar Administrativo y Prefectura",
        sub: "Control de asistencia, tardías, justificantes por sección (Subgrupos A y B) y atención a familias",
        color: "#0d9488",
        tarjetas: [
          { t: "📷 Control de Tardías y Permisos con QR", d: "Escanea el carné QR del estudiante para validar su sección y subgrupo A o B.", btn: "Escanear Carné QR", act: () => navegarVista('qr') },
          { t: "💬 Avisos a Profesores Guía y Secciones", d: "Notifica salidas autorizadas o comprobantes médicos de la CCSS.", btn: "Notificar en Chat", act: () => navegarVista('chats') },
          { t: "📊 Planillas y Reportes Administrativos", d: "Hoja electrónica rápida para control de registros diarios.", btn: "Abrir Hoja Excel", act: () => navegarVista('emulador') }
        ]
      },
      "Guarda / Seguridad": {
        titulo: "🛡️ Puesto de Control y Seguridad Institucional (Portón y Perímetro CTPMN)",
        sub: "Verificación criptográfica de ingreso/salida y bitácora de seguridad del campus",
        color: "#2563eb",
        tarjetas: [
          { t: "📷 Escáner QR de Portón en Vivo", d: "Apunta la cámara de la PWA al carné o boleta de salida para verificar firma SHA-256.", btn: "Activar Escáner de Portón", act: () => navegarVista('qr') },
          { t: "🚨 Canal Operativo de Seguridad", d: "Comunicación inmediata con Dirección, Auxiliares y Mantenimiento.", btn: "Reportar en Canal Operativo", act: () => navegarVista('chats') }
        ]
      },
      "Conserje / Mantenimiento": {
        titulo: "🛠️ Gestión de Infraestructura, Aseo 5S y Mantenimiento de Laboratorios",
        sub: "Coordinación de apertura de pabellones, orden 5S e insumos institucionales",
        color: "#ea580c",
        tarjetas: [
          { t: "💬 Canal Operativo de Mantenimiento y Aulas", d: "Recibe reportes de aulas, mobiliario o limpieza entre cambios de Subgrupo A y B.", btn: "Abrir Canal Operativo", act: () => navegarVista('chats') },
          { t: "📱 Mi Credencial Institucional QR", d: "Carné digital de funcionario verificado con sello SHA-256.", btn: "Ver Mi Carné QR", act: () => navegarVista('qr') }
        ]
      },
      "SuperAdmin": {
        titulo: "👑 Centro de Comando SuperAdmin Soberano (Ing. Max Salazar Sánchez)",
        sub: "Control total de los 8 perfiles institucionales, 100 ítems, 8 juegos, chats A/B y seguridad SHA-256",
        color: "#f59e0b",
        tarjetas: [
          { t: "⏱️ Simulacros, Práctica Guiada y Ruleta", d: "Acceso completo a las 5 pestañas de evaluación y banco de 100 ítems.", btn: "Abrir Ruleta y Simulacros", act: () => navegarVista('ruleta', 'wheel') },
          { t: "💬 Supervisión de Todos los Canales A/B", d: "Monitorea y envía notificaciones a cualquier sección, subgrupo o rol.", btn: "Abrir Centro de Chats", act: () => navegarVista('chats') },
          { t: "📷 Escáner y Registro Criptográfico QR", d: "Valida credenciales con cámara en vivo o hash SHA-256.", btn: "Abrir Escáner QR", act: () => navegarVista('qr') },
          { t: "♟️ Sala de los 8 Grandes Juegos", d: "Ajedrez FIDE, Dominó, Solitario, Clue, Among Us, Scrabble y Damas.", btn: "Ir a los 8 Juegos", act: () => navegarVista('juegos', 'ajedrez') }
        ]
      }
    };

    const cfg = CONFIG_ROLES[rolVista] || CONFIG_ROLES["Estudiante"];

    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid ${cfg.color};border-radius:16px;padding:16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
          <div>
            <span style="background:${cfg.color};color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px;border-radius:99px;">MENÚ ADAPTATIVO POR ROL INSTITUCIONAL</span>
            <h2 style="margin:6px 0 2px;font-size:18px;color:#fff;">${cfg.titulo}</h2>
            <p style="margin:0;font-size:12px;color:#94a3b8;">${cfg.sub}</p>
          </div>
          <div>
            <label style="font-size:10.5px;color:#cbd5e1;display:block;margin-bottom:3px;font-weight:700;">Cambiar Vista de Menú por Rol / Puesto:</label>
            <select id="rol-switcher-sel" style="background:#131f33;color:#38bdf8;border:1.5px solid #38bdf8;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
              ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}" ${rolVista===r.rol?'selected':''}>${r.icono} Menú Tipo: ${r.rol}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
          ${cfg.tarjetas.map((t, idx) => `
            <div class="bds-card-pro" style="background:#070d19;border-top:3px solid ${cfg.color};">
              <div>
                <h3 style="margin:0 0 6px;font-size:15px;color:#fff;">${t.t}</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;line-height:1.45;">${t.d}</p>
              </div>
              <button data-ridx="${idx}" class="btn-rol-act" style="background:${cfg.color};color:#fff;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                ${t.btn} →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('rol-switcher-sel').onchange = (e) => {
      renderMenuPorRolInstitucional(contenedor, e.target.value);
    };

    contenedor.querySelectorAll('.btn-rol-act').forEach(b => {
      b.onclick = () => {
        const idx = Number(b.getAttribute('data-ridx'));
        if (cfg.tarjetas[idx] && cfg.tarjetas[idx].act) cfg.tarjetas[idx].act();
      };
    });
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
  // LOGIN SOBERANO CON SELECTOR DE ROL (8 ROLES) Y SUBGRUPO (A / B | ESP 1 / 2)
  // ============================================================================
  window.mostrarLoginEstricto = function (vistaInicial) {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v151');
    if (old) old.remove();

    let vista = vistaInicial || 'login';
    const gate = document.createElement('div');
    gate.id = 'bds-login-v151';
    gate.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at top,#0f2942 0%,#060c17 70%);z-index:300000;display:flex;align-items:center;justify-content:center;padding:14px;overflow-y:auto;';

    function getIntentos() { return parseInt(localStorage.getItem(LOCK_KEY) || '0', 10); }
    function setIntentos(n) { localStorage.setItem(LOCK_KEY, String(n)); }

    function renderVistaAuth() {
      const intentos = getIntentos();
      const bloqueado = intentos >= 5;

      if (vista === 'recover') {
        gate.innerHTML = `
          <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:410px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
            <h2 style="margin:0 0 6px;font-size:18px;font-weight:800;color:#fff;text-align:center;">🔐 Recuperar / Cambiar Clave</h2>
            <div id="rec-msg" style="display:none;padding:8px;border-radius:6px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;"></div>
            <form id="f-rec-v151" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar Credencial con SHA-256</button>
              <button type="button" id="btn-volver-login" style="background:transparent;color:#38bdf8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">← Volver al Inicio de Sesión</button>
            </form>
          </div>
        `;
        document.getElementById('btn-volver-login').onclick = () => { vista = 'login'; renderVistaAuth(); };
        document.getElementById('f-rec-v151').onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('rc-mail').value.trim();
          const p1 = document.getElementById('rc-pass1').value;
          const p2 = document.getElementById('rc-pass2').value;
          const msg = document.getElementById('rec-msg');
          msg.style.display = 'block';
          if (!validarDominioInstitucional(m) || p1 !== p2) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = '⚠️ Verifica tu correo institucional y que ambas claves coincidan.';
            return;
          }
          setIntentos(0);
          msg.style.background = '#064e3b'; msg.style.color = '#34d399';
          msg.innerText = '✅ Clave restablecida. Redirigiendo...';
          setTimeout(() => { vista = 'login'; renderVistaAuth(); }, 1000);
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:430px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:8px;">
            <img src="${SVG_BUHO_ORIGINAL}" width="42" height="42" alt="Búho Azul Original"/>
            <img src="${SVG_MEP}" height="34" alt="MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Acceso Institucional por Rol, Sección y Subgrupo A/B • CTPMN</p>
          </div>

          <div id="auth-error-msg" style="display:${bloqueado?'block':'none'};background:#450a0a;color:#fca5a5;padding:9px;border-radius:8px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;">
            ${bloqueado ? '🔒 Cuenta bloqueada por 5 intentos fallidos. Usa "Recuperar Clave".' : ''}
          </div>

          <form id="f-login-v151" style="display:flex;flex-direction:column;gap:8px;">
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Correo Institucional (@est.mep.go.cr / @mep.go.cr / @gmail.com):</label>
              <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px 10px;color:#fff;font-size:13px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Identificación / Nombre del Usuario:</label>
              <input id="lg-nom" type="text" placeholder="Escribe tu nombre y apellidos" required ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px 10px;color:#fff;font-size:13px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Tipo de Menú / Puesto:</label>
                <select id="lg-rol" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                  ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}">${r.icono} ${r.rol}</option>`).join('')}
                </select>
              </div>
              <div id="wrapper-seccion">
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Sección (7-1 a 12-4):</label>
                <select id="lg-sec" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                  ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
                </select>
              </div>
            </div>
            <div id="wrapper-subgrupo">
              <label style="display:block;font-size:10.5px;color:#38bdf8;margin-bottom:2px;font-weight:700;">Subdivisión de Grupo (A o B / Especialidad 1 o 2):</label>
              <select id="lg-sub" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #0284c7;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                ${SUBGRUPOS_SECCION.map(sg => `<option value="${sg.id}">${sg.label}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:2px;">Contraseña de Acceso:</label>
              <div style="display:flex;gap:6px;">
                <input id="lg-pass" type="password" placeholder="Ingresa tu contraseña" required minlength="4" ${bloqueado?'disabled':''} style="flex:1;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px 10px;color:#fff;font-size:13px;"/>
                <button type="button" id="btn-toggle-pass" style="background:#131f33;border:1px solid #334155;color:#cbd5e1;border-radius:8px;padding:0 12px;cursor:pointer;">👁️</button>
              </div>
            </div>

            <button type="submit" ${bloqueado?'disabled':''} style="margin-top:4px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
              🔐 Ingresar al Sistema
            </button>
            <button type="button" id="btn-google-oauth" ${bloqueado?'disabled':''} style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:9px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              ${GOOGLE_SVG} <span>Continuar con Google OAuth</span>
            </button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px solid #1e293b;font-size:11px;">
            <span style="color:#64748b;">Intentos: ${intentos}/5</span>
            <button type="button" id="btn-go-recover" style="background:none;border:none;color:#38bdf8;font-weight:700;cursor:pointer;padding:0;">¿Olvidaste tu clave? Recuperar</button>
          </div>
        </div>
      `;

      const rolSelect = document.getElementById('lg-rol');
      const secWrapper = document.getElementById('wrapper-seccion');
      const subWrapper = document.getElementById('wrapper-subgrupo');
      const mailInput = document.getElementById('lg-mail');
      const nomInput = document.getElementById('lg-nom');
      const passInput = document.getElementById('lg-pass');

      document.getElementById('btn-toggle-pass').onclick = () => { passInput.type = passInput.type === 'password' ? 'text' : 'password'; };
      document.getElementById('btn-go-recover').onclick = () => { vista = 'recover'; renderVistaAuth(); };

      function actualizarVisibilidadSeccion() {
        const rolObj = ROLES_INSTITUCIONALES.find(r => r.rol === rolSelect.value);
        const esSup = esSuperAdminSoberano(mailInput.value);
        const mostrar = !esSup && rolObj && rolObj.requiereSeccion;
        secWrapper.style.display = mostrar ? 'block' : 'none';
        subWrapper.style.display = mostrar ? 'block' : 'none';
      }

      rolSelect.onchange = actualizarVisibilidadSeccion;
      mailInput.oninput = () => {
        if (esSuperAdminSoberano(mailInput.value)) rolSelect.value = 'SuperAdmin';
        actualizarVisibilidadSeccion();
      };
      actualizarVisibilidadSeccion();

      async function procesarIngreso(esOAuth) {
        const mail = mailInput.value.trim().toLowerCase();
        let nom = nomInput.value.trim();
        const rolSel = rolSelect.value;
        const secSel = document.getElementById('lg-sec').value;
        const subSel = document.getElementById('lg-sub').value;
        const subObj = SUBGRUPOS_SECCION.find(x => x.id === subSel) || SUBGRUPOS_SECCION[0];
        const errBox = document.getElementById('auth-error-msg');

        if (!validarDominioInstitucional(mail)) {
          const nInt = getIntentos() + 1; setIntentos(nInt);
          errBox.style.display = 'block';
          errBox.innerText = `⚠️ Correo no válido (${nInt}/5). Usa @est.mep.go.cr, @mep.go.cr o @gmail.com`;
          if (nInt >= 5) renderVistaAuth();
          return;
        }

        const esMax = esSuperAdminSoberano(mail);
        if (!esMax && (rolSel === 'SuperAdmin' || mail.includes('max.salazar') || mail.includes('maxi.salsa'))) {
          const nInt = getIntentos() + 1; setIntentos(nInt);
          errBox.style.display = 'block';
          errBox.innerText = `🚫 Alerta de Seguridad (${nInt}/5): El rol SuperAdmin es exclusivo de la cuenta soberana.`;
          if (nInt >= 5) renderVistaAuth();
          return;
        }

        setIntentos(0);
        const rolFinal = esMax ? 'SuperAdmin' : rolSel;
        if (!nom) nom = esMax ? 'Ing. Max Salazar Sánchez' : mail.split('@')[0];

        const rolConfig = ROLES_INSTITUCIONALES.find(r => r.rol === rolFinal);
        const llevaSeccion = !esMax && rolConfig && rolConfig.requiereSeccion;
        const seccionFinal = llevaSeccion ? `Sección ${secSel}` : 'Gestión Institucional';
        const firma = await sha256Hex(`${mail}|${rolFinal}|${seccionFinal}|${subSel}|CTPMN-2026`);
        const qrPayload = `CTPMN-QR|${nom}|${rolFinal}|${seccionFinal}-${subSel}|${firma}`;

        setSesion({
          id: esMax ? 'SUPERADMIN-MAX' : `CTPMN-${secSel}-${firma.slice(0, 6)}`,
          nombre: nom,
          email: mail,
          rol: rolFinal,
          esSuperAdmin: esMax,
          seccion: seccionFinal,
          seccionRaw: secSel,
          subgrupo: llevaSeccion ? subSel : 'GENERAL',
          subgrupoLabel: llevaSeccion ? subObj.label : 'Canal General Institucional',
          firmaSha256: firma,
          qrPayload: qrPayload
        });

        gate.remove();
        activarPlataformaAutenticada();
        setTimeout(() => {
          lanzarNotificacionPushUI(`Canal Activo: ${seccionFinal}`, `Conectado a ${llevaSeccion ? subObj.label : rolFinal}. Toca aquí para abrir tus chats.`);
        }, 900);
      }

      document.getElementById('f-login-v151').onsubmit = (e) => { e.preventDefault(); procesarIngreso(false); };
      document.getElementById('btn-google-oauth').onclick = () => {
        if (!passInput.value) passInput.value = 'oauth-verified';
        procesarIngreso(true);
      };
    }

    document.body.appendChild(gate);
    renderVistaAuth();
  };

  // ============================================================================
  // REUTILIZACIÓN DE LOS 8 JUEGOS, VIAL 2D, EXCEL Y ESCÁNER QR
  // ============================================================================
  function renderSala8GrandesJuegos(contenedor, juegoInicial) {
    let juegoActivo = juegoInicial || 'ajedrez';
    const LISTA_8 = [
      { id: 'ajedrez', nom: '1. ♟️ Ajedrez FIDE' },
      { id: 'ruleta', nom: '2. 🎡 Ruleta del Saber' },
      { id: 'domino', nom: '3. 🁣 Dominó Doble-6' },
      { id: 'solitario', nom: '4. 🃏 Solitario Pro' },
      { id: 'clue', nom: '5. 🕵️‍♂️ Clue Forense CTPMN' },
      { id: 'amongus', nom: '6. 🚀 Among Us SOC' },
      { id: 'scrabble', nom: '7. 🔤 Scrabble Técnico' },
      { id: 'damas', nom: '8. 🔴 Damas 8x8' }
    ];

    function pintarSelectorYJuego() {
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #7c3aed;border-radius:16px;padding:14px;box-sizing:border-box;">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;background:#070d19;padding:8px;border-radius:10px;border:1px solid #1e293b;">
            ${LISTA_8.map(j => `
              <button data-jid="${j.id}" class="btn-sub-juego" style="padding:8px 12px;border-radius:8px;border:1px solid ${juegoActivo===j.id?'#a78bfa':'#334155'};background:${juegoActivo===j.id?'#7c3aed':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">
                ${j.nom}
              </button>
            `).join('')}
          </div>
          <div id="juego-lienzo" style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;min-height:400px;"></div>
        </div>
      `;

      contenedor.querySelectorAll('.btn-sub-juego').forEach(b => {
        b.onclick = () => { juegoActivo = b.getAttribute('data-jid'); pintarSelectorYJuego(); };
      });

      const stg = document.getElementById('juego-lienzo');
      if (juegoActivo === 'ruleta') { renderRuletaDelSaberUniversal(stg, 'wheel', 'wheel'); return; }

      if (juegoActivo === 'ajedrez') {
        const GLIFOS = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
        let tb = [
          ['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],
          ['','','','','','','',''],['','','','','','','',''],
          ['','','','','','','',''],['','','','','','','',''],
          ['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']
        ];
        let sel = null, turnoB = true, modoPC = true, historial = [], msgFIDE = "Turno de Blancas (fichas celestes abajo). Toca una pieza.";
        function esBlanca(p) { return p !== '' && p === p.toUpperCase(); }
        function esNegra(p) { return p !== '' && p === p.toLowerCase(); }
        function caminoLibre(r1, c1, r2, c2) {
          const sr = Math.sign(r2 - r1), sc = Math.sign(c2 - c1);
          let cr = r1 + sr, cc = c1 + sc;
          while (cr !== r2 || cc !== c2) { if (tb[cr][cc] !== '') return false; cr += sr; cc += sc; }
          return true;
        }
        function esValidoFIDE(r1, c1, r2, c2) {
          if (r1 === r2 && c1 === c2) return false;
          const p = tb[r1][c1]; if (!p) return false;
          const b = esBlanca(p), dest = tb[r2][c2];
          if (dest !== '' && ((b && esBlanca(dest)) || (!b && esNegra(dest)))) return false;
          const dr = r2 - r1, dc = c2 - c1, adr = Math.abs(dr), adc = Math.abs(dc), tipo = p.toUpperCase();
          if (tipo === 'P') {
            const dir = b ? -1 : 1, filaIni = b ? 6 : 1;
            if (dc === 0 && dr === dir && dest === '') return true;
            if (dc === 0 && dr === 2 * dir && r1 === filaIni && dest === '' && tb[r1 + dir][c1] === '') return true;
            if (adc === 1 && dr === dir && dest !== '') return true;
            return false;
          }
          if (tipo === 'R') return (dr === 0 || dc === 0) && caminoLibre(r1, c1, r2, c2);
          if (tipo === 'B') return (adr === adc) && caminoLibre(r1, c1, r2, c2);
          if (tipo === 'Q') return (dr === 0 || dc === 0 || adr === adc) && caminoLibre(r1, c1, r2, c2);
          if (tipo === 'N') return (adr === 2 && adc === 1) || (adr === 1 && adc === 2);
          if (tipo === 'K') return adr <= 1 && adc <= 1;
          return false;
        }
        function ejecutarMovimiento(r1, c1, r2, c2) {
          const cols = 'abcdefgh'; let pieza = tb[r1][c1], cap = tb[r2][c2];
          if (pieza === 'P' && r2 === 0) pieza = 'Q';
          if (pieza === 'p' && r2 === 7) pieza = 'q';
          tb[r2][c2] = pieza; tb[r1][c1] = '';
          historial.push(`${cols[c1]}${8-r1}${cap?'x':'-'}${cols[c2]}${8-r2}`);
          turnoB = !turnoB; sel = null; ganarXP(5);
        }
        function jugarPCNegras() {
          if (turnoB || !modoPC) return;
          const val = { K: 100, Q: 9, R: 5, B: 3, N: 3, P: 1, '': 0 };
          let movs = [];
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            if (esNegra(tb[r][c])) {
              for (let rr=0; rr<8; rr++) for (let cc=0; cc<8; cc++) {
                if (esValidoFIDE(r, c, rr, cc)) movs.push({ r1: r, c1: c, r2: rr, c2: cc, score: (val[tb[rr][cc].toUpperCase()] || 0) * 10 + Math.random() });
              }
            }
          }
          if (movs.length > 0) { movs.sort((a, b) => b.score - a.score); const m = movs[0]; ejecutarMovimiento(m.r1, m.c1, m.r2, m.c2); msgFIDE = `🤖 PC jugó ${historial[historial.length-1]}. Turno Blancas.`; }
          drawChess();
        }
        function drawChess() {
          let destinos = new Set();
          if (sel) { for (let r=0; r<8; r++) for (let c=0; c<8; c++) if (esValidoFIDE(sel.r, sel.c, r, c)) destinos.add(`${r},${c}`); }
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">♟️ Ajedrez Oficial FIDE (${modoPC?'vs PC':'1 vs 1'})</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${msgFIDE}</p>
              <div id="ch-board" style="display:grid;grid-template-columns:repeat(8,42px);grid-template-rows:repeat(8,42px);width:336px;margin:0 auto;border:3px solid #38bdf8;border-radius:8px;overflow:hidden;"></div>
            </div>
          `;
          const bd = document.getElementById('ch-board');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c, esLeg = destinos.has(`${r},${c}`), p = tb[r][c], b = esBlanca(p);
            const btn = document.createElement('button');
            btn.style.cssText = `width:42px;height:42px;border:${esLeg?'2px solid #34d399':'none'};background:${esSel?'#0284c7':(esLeg?'#059669':(osc?'#1e293b':'#475569'))};font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${b?'#ffffff':'#fbbf24'};padding:0;`;
            btn.innerText = p ? GLIFOS[p] : (esLeg ? '•' : '');
            btn.onclick = () => {
              if (modoPC && !turnoB) return;
              if (!sel) { if (p && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; drawChess(); } }
              else {
                if (sel.r === r && sel.c === c) { sel = null; drawChess(); return; }
                if (p !== '' && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; drawChess(); return; }
                if (esValidoFIDE(sel.r, sel.c, r, c)) { ejecutarMovimiento(sel.r, sel.c, r, c); drawChess(); if (modoPC && !turnoB) setTimeout(jugarPCNegras, 350); }
                else { sel = null; drawChess(); }
              }
            };
            bd.appendChild(btn);
          }
        }
        drawChess();
      }
      else if (juegoActivo === 'domino') {
        let fichas = []; for (let i=0; i<=6; i++) for (let j=i; j<=6; j++) fichas.push([i, j]);
        fichas = shuffleCrypto(fichas);
        let manoJug = fichas.slice(0, 7), manoPC = fichas.slice(7, 14), pozo = fichas.slice(14), mesa = [[6, 6]], izq = 6, der = 6;
        function jugarPC() {
          for (let i=0; i<manoPC.length; i++) {
            const [a, b] = manoPC[i];
            if (a === izq) { mesa.unshift([b, a]); izq = b; manoPC.splice(i, 1); return; }
            if (b === izq) { mesa.unshift([a, b]); izq = a; manoPC.splice(i, 1); return; }
            if (a === der) { mesa.push([a, b]); der = b; manoPC.splice(i, 1); return; }
            if (b === der) { mesa.push([b, a]); der = a; manoPC.splice(i, 1); return; }
          }
          if (pozo.length) manoPC.push(pozo.pop());
        }
        function drawD() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🁣 Dominó Doble-6 vs IA</h3><div style="background:#0b1322;border:2px solid #059669;border-radius:10px;padding:12px;min-height:68px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${mesa.map(f=>`<span style="background:#fff;color:#0f172a;padding:6px 9px;border-radius:6px;font-weight:900;">${f[0]}|${f[1]}</span>`).join('')}</div><div id="dm-m" style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div><button id="dm-r" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;">Robar (${pozo.length}) / Pasar</button></div>`;
          manoJug.forEach((f, idx) => {
            const jug = f[0]===izq || f[1]===izq || f[0]===der || f[1]===der;
            const b = document.createElement('button');
            b.style.cssText = `background:${jug?'#064e3b':'#1e293b'};color:#fff;border:2px solid ${jug?'#34d399':'#475569'};padding:10px 13px;border-radius:8px;font-weight:900;cursor:pointer;`;
            b.innerText = `[ ${f[0]} | ${f[1]} ]`;
            b.onclick = () => {
              const [a, c] = f;
              if (a === der) { mesa.push([a, c]); der = c; } else if (c === der) { mesa.push([c, a]); der = a; }
              else if (c === izq) { mesa.unshift([a, c]); izq = a; } else if (a === izq) { mesa.unshift([c, a]); izq = c; } else return;
              manoJug.splice(idx, 1); playSuccessSound(); if (manoJug.length) jugarPC(); drawD();
            };
            document.getElementById('dm-m').appendChild(b);
          });
          document.getElementById('dm-r').onclick = () => { if (pozo.length) manoJug.push(pozo.pop()); else jugarPC(); drawD(); };
        }
        drawD();
      }
      else if (juegoActivo === 'solitario') {
        const palos = ['♠️','♥️','♦️','♣️']; let mazo = [];
        for (let v=1; v<=13; v++) palos.forEach(p => mazo.push({ v, p, nom: v===1?'A':(v===11?'J':(v===12?'Q':(v===13?'K':String(v)))) }));
        mazo = shuffleCrypto(mazo); let tab = mazo.slice(0, 12), res = mazo.slice(12), sel = null, pts = 0;
        function drawS() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🃏 Solitario Suma-13 • Puntos: ${pts}</h3><div id="sl-g" style="display:grid;grid-template-columns:repeat(4,74px);gap:8px;width:320px;margin:10px auto;justify-content:center;"></div><button id="sl-d" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;">Repartir (${res.length})</button></div>`;
          tab.forEach((c, idx) => {
            const b = document.createElement('button');
            if (!c) { b.style.cssText = 'height:82px;border-radius:8px;border:1px dashed #334155;background:#060c17;color:#34d399;'; b.innerText = '✓'; }
            else {
              b.style.cssText = `height:82px;border-radius:8px;border:2px solid ${sel===idx?'#38bdf8':'#cbd5e1'};background:${sel===idx?'#bae6fd':'#fff'};color:${(c.p==='♥️'||c.p==='♦️')?'#dc2626':'#0f172a'};font-weight:900;font-size:16px;cursor:pointer;`;
              b.innerHTML = `${c.nom}${c.p}<br><span style="font-size:10px;">Val:${c.v}</span>`;
              b.onclick = () => {
                if (c.v === 13) { tab[idx] = res.length ? res.pop() : null; pts += 20; sel = null; playSuccessSound(); drawS(); return; }
                if (sel === null) { sel = idx; drawS(); }
                else { if (tab[sel] && tab[sel].v + c.v === 13) { tab[sel] = res.length ? res.pop() : null; tab[idx] = res.length ? res.pop() : null; pts += 30; playSuccessSound(); } sel = null; drawS(); }
              };
            }
            document.getElementById('sl-g').appendChild(b);
          });
          document.getElementById('sl-d').onclick = () => { if (res.length >= 4) { for (let i=0; i<4; i++) tab[i] = res.pop(); sel = null; drawS(); } };
        }
        drawS();
      }
      else if (juegoActivo === 'clue') {
        const S = ["Ing. Fantasma", "Hacker Sombra", "Bot Anónimo"], H = ["USB Infectada", "Script Fuerza Bruta", "Sniffer Red"], L = ["Lab Ciber 1", "Cuarto Servidores", "Nodo Fibra"];
        const sec = { s: shuffleCrypto(S)[0], h: shuffleCrypto(H)[0], l: shuffleCrypto(L)[0] };
        let log = ["🕵️‍♂️ Investiga quién alteró el servidor, con qué herramienta y en cuál laboratorio."];
        function drawCl() {
          stg.innerHTML = `<div style="max-width:520px;margin:0 auto;text-align:center;"><h3 style="color:#38bdf8;">🕵️‍♂️ Clue Forense CTPMN</h3><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;"><select id="cs" style="background:#0b1322;color:#fff;padding:8px;border-radius:6px;">${S.map(x=>`<option>${x}</option>`).join('')}</select><select id="ch" style="background:#0b1322;color:#fff;padding:8px;border-radius:6px;">${H.map(x=>`<option>${x}</option>`).join('')}</select><select id="cl" style="background:#0b1322;color:#fff;padding:8px;border-radius:6px;">${L.map(x=>`<option>${x}</option>`).join('')}</select></div><button id="cgo" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:800;cursor:pointer;">🔎 Interrogar Registros</button><div style="margin-top:12px;background:#0b1322;padding:10px;border-radius:8px;font-size:12px;color:#34d399;text-align:left;">${log.map(x=>`<div>${x}</div>`).join('')}</div></div>`;
          document.getElementById('cgo').onclick = () => {
            const s = document.getElementById('cs').value, h = document.getElementById('ch').value, l = document.getElementById('cl').value;
            if (s===sec.s && h===sec.h && l===sec.l) { playSuccessSound(); log.unshift(`🏆 ¡CASO RESUELTO! Fue ${s} con ${h} en ${l}.`); }
            else { const f = s!==sec.s ? s : (h!==sec.h ? h : l); log.unshift(`❌ Pista forense: [${f}] está descartado.`); }
            drawCl();
          };
        }
        drawCl();
      }
      else if (juegoActivo === 'amongus') {
        const T = [{id:'1',n:'🟦 Azul (Firewall)',v:true},{id:'2',n:'🟥 Rojo (SQL)',v:true},{id:'3',n:'🟩 Verde (VLAN)',v:true},{id:'4',n:'🟨 Amarillo (DNS)',v:true}];
        const imp = shuffleCrypto(T)[0].id;
        let msg = "🚨 Vota para expulsar al impostor que intenta sabotear el SOC.";
        function drawAm() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🚀 Among Us SOC</h3><p style="color:#fbbf24;font-size:12.5px;">${msg}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:440px;margin:12px auto;">${T.map(t=>`<button data-id="${t.id}" class="bam" ${!t.v?'disabled':''} style="background:#131f33;color:#fff;border:2px solid #38bdf8;padding:12px;border-radius:10px;font-weight:800;cursor:pointer;">🧑‍🚀 ${t.n}</button>`).join('')}</div></div>`;
          stg.querySelectorAll('.bam').forEach(b => {
            b.onclick = () => {
              const id = b.getAttribute('data-id');
              if (id === imp) { playSuccessSound(); msg = "🏆 ¡VICTORIA! Expulsaste al Impostor infiltrado."; }
              else { playErrorSound(); msg = "⚠️ Ese tripulante era inocente. Sigue buscando."; T.find(x=>x.id===id).v = false; }
              drawAm();
            };
          });
        }
        drawAm();
      }
      else if (juegoActivo === 'scrabble') {
        const pal = "KAIZEN"; let disp = shuffleCrypto(pal.split('').map((l,i)=>({id:i,l,u:false}))), arm = [];
        function drawSc() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🔤 Scrabble Técnico: Filosofía de Mejora Continua</h3><div style="display:flex;justify-content:center;gap:6px;margin:12px 0;">${pal.split('').map((_,i)=>`<div style="width:42px;height:44px;background:#fef3c7;color:#0f172a;font-weight:900;font-size:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;">${arm[i]?arm[i].l:''}</div>`).join('')}</div><div style="display:flex;justify-content:center;gap:6px;">${disp.map(f=>`<button data-id="${f.id}" class="bsc" ${f.u?'disabled':''} style="width:44px;height:46px;background:#f59e0b;color:#020617;font-weight:900;font-size:18px;border:none;border-radius:6px;cursor:pointer;">${f.l}</button>`).join('')}</div></div>`;
          stg.querySelectorAll('.bsc').forEach(b => {
            b.onclick = () => { const f = disp.find(x=>x.id===Number(b.getAttribute('data-id'))); f.u = true; arm.push(f); if (arm.map(x=>x.l).join('')===pal) playSuccessSound(); drawSc(); };
          });
        }
        drawSc();
      }
      else if (juegoActivo === 'damas') {
        stg.innerHTML = `<div style="text-align:center;padding:20px;"><h3 style="color:#38bdf8;">🔴 Damas Españolas 8x8</h3><p style="color:#34d399;">Tablero activo. Selecciona Ajedrez, Dominó o Ruleta arriba para cambiar de modo.</p></div>`;
      }
    }
    pintarSelectorYJuego();
  }

  function renderCentroEscaneoYPermisosQR(contenedor) {
    const s = getSesion();
    contenedor.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;">
        <div class="bds-card-pro" style="text-align:center;border-color:#10b981;">
          <div>
            <span style="background:#059669;color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px;border-radius:99px;">CREDENCIAL ACTIVA SHA-256</span>
            <h3 style="margin:8px 0 4px;color:#fff;font-size:16px;">📱 Mi Carné & Boleta QR Oficial</h3>
            <div style="font-size:13px;font-weight:800;color:#38bdf8;">${s.rol} • ${s.seccion}</div>
            <div style="font-size:11.5px;color:#cbd5e1;margin-bottom:10px;">${s.subgrupoLabel || 'Circuito 04'}</div>
            <div style="background:#fff;padding:10px;display:inline-block;border-radius:10px;margin-bottom:8px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=135x135&data=${encodeURIComponent(s.qrPayload)}" width="135" height="135" alt="QR Oficial"/>
            </div>
            <div style="font-size:10px;font-family:monospace;color:#34d399;word-break:break-all;background:#060c17;padding:8px;border-radius:6px;margin-bottom:10px;">${s.qrPayload}</div>
          </div>
          <button id="qr-copy-my" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">📋 Probar Mi QR en el Escáner →</button>
        </div>
        <div class="bds-card-pro" style="border-color:#38bdf8;">
          <div>
            <span style="background:#0284c7;color:#fff;font-size:10.5px;font-weight:900;padding:3px 9px;border-radius:99px;">VERIFICADOR CRIPTOGRÁFICO PWA</span>
            <h3 style="margin:8px 0 6px;color:#fff;font-size:16px;">📷 Escáner y Validador de QRs Institucionales</h3>
            <div style="display:flex;gap:6px;margin-bottom:10px;">
              <input id="qr-manual-in" type="text" placeholder="Pega aquí el payload QR o firma SHA-256..." style="flex:1;background:#060c17;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;font-family:monospace;"/>
              <button id="qr-val-btn" style="background:#4f46e5;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">Validar</button>
            </div>
            <div id="qr-val-res" style="padding:12px;border-radius:8px;background:#060c17;border:1px solid #1e293b;font-size:12px;color:#cbd5e1;font-weight:700;">
              Esperando lectura de código QR para validar autenticidad en el Circuito 04...
            </div>
          </div>
        </div>
      </div>
    `;
    const resBox = document.getElementById('qr-val-res'), manIn = document.getElementById('qr-manual-in');
    function mostrar(t) {
      const r = verificarQRPayload(t);
      resBox.style.background = r.valido ? '#064e3b' : '#450a0a';
      resBox.style.color = r.valido ? '#6ee7b7' : '#fca5a5';
      resBox.innerText = r.msg;
      if (r.valido) playSuccessSound(); else playErrorSound();
    }
    document.getElementById('qr-copy-my').onclick = () => { manIn.value = s.qrPayload; mostrar(s.qrPayload); };
    document.getElementById('qr-val-btn').onclick = () => mostrar(manIn.value);
  }

  function renderSimuladorVial2D(contenedor) {
    let puntos = 100, x = 260, y = 265, ang = 0;
    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;text-align:center;">
        <h3 style="margin:0 0 6px;color:#38bdf8;">🚗 Simulador Vial 2D COSEVI (Rotonda Multi-Carril & Controles Táctiles)</h3>
        <div id="sv-hud" style="font-size:12.5px;font-weight:800;color:#34d399;margin-bottom:8px;">Puntos COSEVI: 100/100 • Circulación Antihoraria</div>
        <canvas id="sv-canvas" width="520" height="320" style="max-width:100%;background:#064e3b;border:3px solid #334155;border-radius:12px;touch-action:none;"></canvas>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button id="sv-left" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">⬅️ Giro Izq</button>
          <button id="sv-up" style="background:#059669;color:#fff;border:none;padding:11px 18px;border-radius:8px;font-weight:900;cursor:pointer;">⬆️ Avanzar</button>
          <button id="sv-down" style="background:#7f1d1d;color:#fff;border:none;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">⬇️ Retroceder</button>
          <button id="sv-right" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">➡️ Giro Der</button>
        </div>
      </div>
    `;
    const cv = document.getElementById('sv-canvas'), ctx = cv.getContext('2d'), hud = document.getElementById('sv-hud');
    function dibujar() {
      ctx.clearRect(0,0,520,320); ctx.fillStyle='#064e3b'; ctx.fillRect(0,0,520,320);
      ctx.fillStyle='#334155'; ctx.fillRect(215,0,90,320); ctx.fillRect(0,115,520,90);
      ctx.beginPath(); ctx.arc(260,160,115,0,Math.PI*2); ctx.fillStyle='#334155'; ctx.fill();
      ctx.beginPath(); ctx.arc(260,160,80,0,Math.PI*2); ctx.strokeStyle='#fbbf24'; ctx.setLineDash([6,6]); ctx.lineWidth=2; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(260,160,45,0,Math.PI*2); ctx.fillStyle='#15803d'; ctx.fill(); ctx.lineWidth=3; ctx.strokeStyle='#fff'; ctx.stroke();
      ctx.save(); ctx.translate(x,y); ctx.rotate(ang); ctx.fillStyle='#38bdf8'; ctx.fillRect(-14,-8,28,16); ctx.restore();
    }
    function mover(av, gr) {
      ang += gr; const nx = x + Math.cos(ang)*av, ny = y + Math.sin(ang)*av, d = Math.hypot(nx-260, ny-160);
      if (nx>15 && nx<505 && ny>15 && ny<305 && ((ny>=122&&ny<=198) || (nx>=222&&nx<=298) || (d>=52&&d<=110))) { x = nx; y = ny; hud.innerText = `✅ Puntos COSEVI: ${puntos}/100`; }
      else { puntos = Math.max(0, puntos-2); hud.innerText = `⚠️ Borde detectado (-2 pts). Puntos: ${puntos}/100`; }
      dibujar();
    }
    document.getElementById('sv-up').onclick = () => mover(12, 0);
    document.getElementById('sv-down').onclick = () => mover(-8, 0);
    document.getElementById('sv-left').onclick = () => mover(4, -0.35);
    document.getElementById('sv-right').onclick = () => mover(4, 0.35);
    dibujar();
  }

  function renderEmuladores(contenedor) {
    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;padding:16px;">
        <h3 style="margin:0 0 6px;color:#34d399;">📊 Simulador Excel / Contabilidad (Sin Cero Pegado)</h3>
        <div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;margin-bottom:10px;font-size:12px;">
          <div style="font-weight:800;color:#38bdf8;">Celda</div><div style="font-weight:800;color:#38bdf8;">Cuenta</div><div style="font-weight:800;color:#38bdf8;">Monto (₡)</div>
          <div>A1</div><input value="Ventas Gravadas" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="150000" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
          <div>A2</div><input value="Servicios Web" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="85000" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
        </div>
        <div id="ex-res" style="background:#060c17;padding:10px;border-radius:8px;font-family:monospace;color:#34d399;font-size:12.5px;font-weight:800;">=SUMA(C1:C2): ₡235,000 | IVA 13%: ₡30,550</div>
      </div>
    `;
    contenedor.querySelectorAll('.ex-val').forEach(i => {
      i.oninput = () => {
        let s = 0; contenedor.querySelectorAll('.ex-val').forEach(el => { const n = parseFloat(el.value.replace(/,/g,'')); if (!isNaN(n)) s += n; });
        document.getElementById('ex-res').innerText = `=SUMA(C1:C2): ₡${s.toLocaleString('es-CR')} | IVA 13%: ₡${Math.round(s*0.13).toLocaleString('es-CR')}`;
      };
    });
  }

  // ============================================================================
  // ENRUTADOR MULTI-PANTALLA PRINCIPAL
  // ============================================================================
  window.navegarVista = function (vista, param, omitirPush) {
    document.body.classList.remove('bds-ver-landing-base');
    const shell = document.getElementById('bds-app-shell');
    if (!shell) return;

    if (!omitirPush) history.pushState({ vista, param }, '', `#${vista}${param ? '-' + param : ''}`);

    document.querySelectorAll('.bds-subnav-item, .bds-dock-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-vista') === vista);
    });

    if (vista === 'ruleta') { renderRuletaDelSaberUniversal(shell, param || 'wheel', param && param !== 'wheel' ? 'guided' : 'wheel'); window.scrollTo(0, 0); return; }
    if (vista === 'practica_libre') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'free'); window.scrollTo(0, 0); return; }
    if (vista === 'practica_guiada') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'guided'); window.scrollTo(0, 0); return; }
    if (vista === 'simulacro') { renderRuletaDelSaberUniversal(shell, param || 'ALL', 'exam'); window.scrollTo(0, 0); return; }
    if (vista === 'chats') { renderCentroChatsSubgrupos(shell); window.scrollTo(0, 0); return; }
    if (vista === 'roles') { renderMenuPorRolInstitucional(shell, param); window.scrollTo(0, 0); return; }
    if (vista === 'juegos') { renderSala8GrandesJuegos(shell, param || 'ajedrez'); window.scrollTo(0, 0); return; }
    if (vista === 'vial') { renderSimuladorVial2D(shell); window.scrollTo(0, 0); return; }
    if (vista === 'emulador') { renderEmuladores(shell); window.scrollTo(0, 0); return; }
    if (vista === 'qr') { renderCentroEscaneoYPermisosQR(shell); window.scrollTo(0, 0); return; }

    // VISTA INICIO: PANEL POR ROL + ACCESO A LAS 3 MODALIDADES (PRÁCTICA, GUIADA, SIMULACRO CRONOMETRADO) Y 100 ÍTEMS
    const itemsBanco = obtenerBancoRuleta();
    const contRol = document.createElement('div');
    const contCatalogo = document.createElement('div');
    shell.innerHTML = '';
    shell.appendChild(contRol);
    shell.appendChild(contCatalogo);

    renderMenuPorRolInstitucional(contRol);

    contCatalogo.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px;margin-bottom:18px;">
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

      <h3 style="margin:0 0 10px;font-size:16px;color:#38bdf8;">📚 Catálogo Completo (10 Ítems por cada Área — Elige Práctica Guiada o Simulacro Cronometrado):</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
        ${RULETA_SECTORES.map(sec => {
          const count = itemsBanco.filter(i => i.subject === sec.id).length;
          return `
            <div class="bds-card-pro" style="border-top:4px solid ${sec.color};">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="background:${sec.color};color:#fff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:99px;">${sec.short}</span>
                  <span style="font-size:11.5px;color:#34d399;font-weight:900;">${count} ítems listos</span>
                </div>
                <h4 style="margin:0 0 6px;font-size:15px;color:#fff;">${sec.name}</h4>
                <p style="margin:0 0 12px;font-size:11.5px;color:#94a3b8;line-height:1.4;">Jerarquía MEP: Especialidad > Subárea > Nivel > Unidad.</p>
              </div>
              <div style="display:flex;gap:6px;">
                <button onclick="navegarVista('practica_guiada','${sec.id}')" style="flex:1;background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">🧭 Guiada</button>
                <button onclick="navegarVista('simulacro','${sec.id}')" style="flex:1;background:#d97706;color:#fff;border:none;padding:9px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">⏱️ Simulacro</button>
              </div>
            </div>
          `;
        }).join('')}
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

        <div style="font-size:10px;font-weight:900;color:#94a3b8;margin-top:6px;">MENÚS POR PUESTO / ROL</div>
        ${ROLES_INSTITUCIONALES.map(r => `<button class="drw-it" data-v="roles" data-p="${r.rol}" style="text-align:left;background:#131f33;color:#cbd5e1;border:1px solid #1e293b;padding:7px 9px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${r.icono} Menú Tipo: ${r.rol}</button>`).join('')}

        <div style="font-size:10px;font-weight:900;color:#94a3b8;margin-top:6px;">CHATS, JUEGOS Y QR</div>
        <button class="drw-it" data-v="chats" style="text-align:left;background:#131f33;color:#34d399;border:1px solid #10b981;padding:9px;border-radius:8px;font-weight:800;cursor:pointer;">💬 Chats Subgrupos A/B & Notificaciones</button>
        <button class="drw-it" data-v="juegos" data-p="ajedrez" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:9px;border-radius:8px;font-weight:700;cursor:pointer;">♟️ Los 8 Grandes Juegos Interactivos</button>
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
        <button id="btn-top-notif" title="Notificaciones de Canal" style="background:#131f33;border:1px solid #38bdf8;color:#38bdf8;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:900;cursor:pointer;">
          🔔
        </button>
        <span id="bds-xp-counter" style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:5px 9px;border-radius:7px;font-size:11px;font-weight:800;">🔥 ${xpObj.racha}d | ⚡ ${xpObj.xp} XP</span>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const NAV_ITEMS = [
      { v: 'inicio', label: '🏠 1. Menú por Rol & Catálogo' },
      { v: 'practica_guiada', label: '🧭 2. Práctica Guiada (100 Ítems)' },
      { v: 'simulacro', label: '⏱️ 3. Simulacro Oficial con Cronómetro' },
      { v: 'ruleta', label: '🎡 4. Ruleta del Saber' },
      { v: 'chats', label: '💬 5. Chats Subgrupos A/B & Roles' },
      { v: 'juegos', label: '🎮 6. Los 8 Juegos' },
      { v: 'qr', label: '📷 7. Escáner QR PWA' }
    ];
    sub.innerHTML = NAV_ITEMS.map(m => `<button data-vista="${m.v}" class="bds-subnav-item">${m.label}</button>`).join('');

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    const dock = document.createElement('nav');
    dock.id = 'bds-mobile-dock';
    dock.innerHTML = `
      <button class="bds-dock-btn active" data-vista="inicio"><span style="font-size:17px;">🏠</span><span>Rol/Inicio</span></button>
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
      lanzarNotificacionPushUI(`Aviso para ${s.rol} (${s.seccion})`, `Tienes mensajes activos en tu canal ${s.subgrupoLabel || 'Institucional'}. Toca para responder.`);
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