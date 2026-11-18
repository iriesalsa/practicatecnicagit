(function () {
  const SESSION_KEY = "bds_auth_gate_v148_ruleta";
  const LOCK_KEY = "bds_auth_lock_v148";
  const XP_KEY = "bds_gamification_xp_v148";
  const RULETA_STORAGE_KEY = "bds_ruleta_saber_items_v148";
  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true },
    { rol: "Docente MEP", requiereSeccion: true },
    { rol: "Profesor Guía", requiereSeccion: true },
    { rol: "Auxiliar Administrativo", requiereSeccion: false },
    { rol: "Guarda / Seguridad", requiereSeccion: false },
    { rol: "Subdirector(a)", requiereSeccion: false },
    { rol: "Director(a)", requiereSeccion: false },
    { rol: "SuperAdmin", requiereSeccion: false }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="160" height="38"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="38" height="38"><rect width="80" height="80" rx="16" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><circle cx="40" cy="42" r="24" fill="#0284c7"/><path d="M22 24 L32 30 L24 36 Z" fill="#38bdf8"/><path d="M58 24 L48 30 L56 36 Z" fill="#38bdf8"/><circle cx="31" cy="38" r="8" fill="#ffffff"/><circle cx="49" cy="38" r="8" fill="#ffffff"/><circle cx="31" cy="38" r="4" fill="#020617"/><circle cx="49" cy="38" r="4" fill="#020617"/><polygon points="40,42 35,50 45,50" fill="#f59e0b"/><text x="40" y="73" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="8.5">CTPMN</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v148.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v148.js').catch(() => {});
    }).catch(() => {});
  }

  // Sintetizador Web Audio API para la Ruleta del Saber y Juegos
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

  function getXP() {
    try {
      return JSON.parse(localStorage.getItem(XP_KEY)) || {
        xp: 850, racha: 15, nivel: "Arquitecto Turing",
        medallas: ["🦉 Búho Azul Original", "♟️ Estratega FIDE", "🎡 Campeón Ruleta"]
      };
    } catch {
      return { xp: 850, racha: 15, nivel: "Arquitecto Turing", medallas: ["🦉 Búho Azul Original"] };
    }
  }

  function ganarXP(pts, nuevaMedalla) {
    const d = getXP();
    d.xp += pts;
    if (nuevaMedalla && !d.medallas.includes(nuevaMedalla)) d.medallas.push(nuevaMedalla);
    d.nivel = d.xp >= 1600 ? "Leyenda Alan Turing" : (d.xp >= 1100 ? "Maestro SICAI" : "Arquitecto Turing");
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
  }

  function cerrarSesionTotal() {
    const locks = localStorage.getItem(LOCK_KEY);
    const xp = localStorage.getItem(XP_KEY);
    const customBank = localStorage.getItem(RULETA_STORAGE_KEY);
    sessionStorage.clear();
    localStorage.clear();
    if (locks) localStorage.setItem(LOCK_KEY, locks);
    if (xp) localStorage.setItem(XP_KEY, xp);
    if (customBank) localStorage.setItem(RULETA_STORAGE_KEY, customBank);
    document.body.classList.remove('bds-authenticated', 'bds-ver-landing-base');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-slide-drawer'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    if (window.location.hash) history.replaceState(null, document.title, window.location.pathname);
    mostrarLoginEstricto('login');
  }

  // ============================================================================
  // SECTORES Y BANCO MAESTRO DE LA RULETA DEL SABER (JERARQUÍA MEP + IDENTIDAD + MOPT + EXCEL)
  // ============================================================================
  const RULETA_SECTORES = [
    { id: "web", name: "Desarrollo Web & Ciberseguridad", short: "Web y Ciber", color: "#4f46e5" },
    { id: "mopt", name: "Prueba Teórica MOPT / COSEVI", short: "Prueba MOPT", color: "#0284c7" },
    { id: "excel", name: "Excel, Ofimática & Contabilidad", short: "Excel y Conta", color: "#059669" },
    { id: "identidad", name: "Identidad CTPMN & Marca", short: "Identidad", color: "#7c3aed" },
    { id: "habitos", name: "Hábitos Kaizen, DUA & REAC", short: "Hábitos/Kaizen", color: "#0d9488" },
    { id: "talleres", name: "Talleres Exploratorios (7°-9°)", short: "Exploratorios", color: "#ea580c" },
    { id: "especialidades", name: "Subáreas & Unidades Técnicas", short: "Subáreas CTP", color: "#2563eb" },
    { id: "math", name: "Matemáticas & Admisión UCR/TEC", short: "Mate y UCR/TEC", color: "#16a34a" },
    { id: "english_spanish", name: "Inglés & Español MEP", short: "Inglés/Español", color: "#d97706" },
    { id: "science", name: "Ciencias (Química, Física, Bio)", short: "Ciencias", color: "#dc2626" }
  ];

  const INITIAL_RULETA_ITEMS = [
    // 1. DESARROLLO WEB & CIBERSEGURIDAD (Especialidad > Subárea > Nivel > Unidad)
    {
      id: "rw1", subject: "web", difficulty: "Básico",
      jerarquia: "Desarrollo Web > Programación > 11° Año > Unidad: Seguridad y Roles RBAC",
      question: "Para mitigar el riesgo de escalación de privilegios al registrar usuarios nuevos, ¿qué rol debe asignarse por defecto en el servidor?",
      options: ["Superadmin temporal", "El rol mínimo necesario (ej. estudiante)", "El rol que envíe el formulario del navegador", "Administrador sin contraseña"],
      correct: 1,
      explanation: "Aplicar el principio de menor privilegio evita que un atacante manipule la petición del cliente para obtener permisos administrativos."
    },
    {
      id: "rw2", subject: "web", difficulty: "Intermedio",
      jerarquia: "Desarrollo Web > Diseño de Software > 12° Año > Unidad: Integración Continua y Despliegue",
      question: "¿Qué práctica reduce el riesgo de romper la rama principal (main) en un despliegue automático hacia Vercel?",
      options: ["Desactivar las pruebas para subir más rápido", "Ejecutar un build de verificación previo al git push", "Subir los archivos node_modules al repositorio", "Editar el código directamente en producción"],
      correct: 1,
      explanation: "Correr npm run build y validar errores antes de hacer push detiene fallos de compilación antes de que lleguen a producción."
    },
    {
      id: "rw3", subject: "web", difficulty: "Básico",
      jerarquia: "Desarrollo Web > Programación > 11° Año > Unidad: Diseño Web Responsivo Mobile-First",
      question: "En diseño web responsivo, ¿qué unidad CSS se adapta mejor al ancho disponible de celulares y tabletas sin generar desbordamiento horizontal?",
      options: ["Anchos fijos de 1200px", "Porcentajes fluidos y max-width: 100%", "Píxeles negativos", "Tablas HTML sin estilos"],
      correct: 1,
      explanation: "Usar contenedores fluidos y max-width: 100% garantiza que los elementos se ajusten a pantallas pequeñas sin cortar botones."
    },
    {
      id: "rw4", subject: "web", difficulty: "Intermedio",
      jerarquia: "Ciberseguridad > Seguridad de Aplicaciones > 12° Año > Unidad: Trazabilidad y Auditoría",
      question: "¿Qué datos son indispensables en una bitácora de trazabilidad cuando un administrador otorga un permiso o bloquea a un usuario?",
      options: ["Solo el nuevo estado del usuario", "Actor, acción, usuario objetivo y fecha/hora exacta (ISO)", "Únicamente el color del tema visual", "La contraseña en texto plano del usuario"],
      correct: 1,
      explanation: "Una auditoría efectiva requiere saber quién hizo el cambio, qué hizo, sobre quién y en qué momento exacto."
    },
    {
      id: "rw5", subject: "web", difficulty: "Avanzado",
      jerarquia: "Ciberseguridad > Hacking Ético > 12° Año > Unidad: Control de Acceso en Backend",
      question: "¿Por qué ocultar un botón de administración en React (UI) NO es suficiente como medida de seguridad?",
      options: ["Porque React no soporta condicionales", "Porque cualquier usuario puede llamar al endpoint de la API directamente si no hay validación en el servidor", "Porque CSS borra las bases de datos", "Porque los navegadores ignoran el JavaScript"],
      correct: 1,
      explanation: "La seguridad real siempre debe validarse en el backend o reglas de seguridad de la base de datos; ocultar botones solo mejora la UX."
    },

    // 2. PRUEBA TEÓRICA MOPT / COSEVI
    {
      id: "rm1", subject: "mopt", difficulty: "Básico",
      jerarquia: "Educación Vial > Ley de Tránsito N° 9078 > Nivel General > Unidad: Límites de Velocidad",
      question: "¿Cuál es la velocidad máxima permitida al conducir frente a zonas escolares con presencia de estudiantes en Costa Rica?",
      options: ["40 km/h", "25 km/h", "50 km/h", "60 km/h"],
      correct: 1,
      explanation: "Según la Ley de Tránsito de Costa Rica, en zonas escolares y frente a hospitales o clínicas la velocidad máxima es de 25 km/h."
    },
    {
      id: "rm2", subject: "mopt", difficulty: "Intermedio",
      jerarquia: "Educación Vial > Circulación en Rotondas > Nivel General > Unidad: Prioridad de Paso",
      question: "Al aproximarse a una rotonda de dos carriles en Costa Rica, ¿quién tiene la prioridad de paso reglamentaria?",
      options: ["El vehículo que intenta ingresar a mayor velocidad", "El vehículo que ya circula dentro de la rotonda en sentido antihorario", "El vehículo más pesado siempre", "El que circula en sentido horario"],
      correct: 1,
      explanation: "Dentro de la rotonda se circula en sentido antihorario (por la derecha) y los vehículos que ya van adentro tienen prioridad sobre los que desean entrar."
    },
    {
      id: "rm3", subject: "mopt", difficulty: "Intermedio",
      jerarquia: "Educación Vial > Señalización Vial > Nivel General > Unidad: Demarcación Horizontal",
      question: "¿Qué indica la doble línea amarilla continua pintada en el eje central de una carretera?",
      options: ["Permitido adelantar en ambos sentidos", "Prohibido adelantar en ambos sentidos de circulación", "Carril exclusivo para autobuses", "Zona de estacionamiento libre"],
      correct: 1,
      explanation: "El color amarillo separa flujos en sentidos opuestos y la línea continua doble prohíbe estrictamente el adelantamiento."
    },
    {
      id: "rm4", subject: "mopt", difficulty: "Básico",
      jerarquia: "Educación Vial > Conducción en Rotondas > Nivel General > Unidad: Uso de Carriles",
      question: "En una rotonda de dos carriles, ¿qué carril debe elegir el conductor si va a abandonar la rotonda en la primera o segunda salida?",
      options: ["El carril interno (izquierdo)", "El carril externo (derecho)", "El espaldón verde central", "Cualquier carril cruzando en diagonal"],
      correct: 1,
      explanation: "El carril externo (derecho) es obligatorio para tomar la primera o segunda salida; el interno se reserva para la tercera salida o retorno."
    },

    // 3. EXCEL, OFIMÁTICA & CONTABILIDAD PURA
    {
      id: "rx1", subject: "excel", difficulty: "Básico",
      jerarquia: "Contabilidad y Ofimática > Hoja Electrónica Excel > 10° Año > Unidad: Fórmulas y Referencias",
      question: "En Microsoft Excel, ¿qué símbolo se antepone a la columna y a la fila (ejemplo: $B$4) para fijar una referencia absoluta al copiar una fórmula?",
      options: ["El símbolo de porcentaje (%)", "El signo de dólar ($)", "El símbolo de numeral (#)", "El ampersand (&)"],
      correct: 1,
      explanation: "El signo $ fija tanto la columna como la fila ($B$4) para que la celda de referencia (como la tasa del 13% de IVA) no se desplace al arrastrar."
    },
    {
      id: "rx2", subject: "excel", difficulty: "Intermedio",
      jerarquia: "Contabilidad Pura > Hoja Electrónica Aplicada > 11° Año > Unidad: Funciones Lógicas",
      question: "¿Cuál fórmula de Excel evalúa correctamente si la nota en la celda C2 es mayor o igual a 70 para mostrar 'APROBADO' o 'APLAZADO'?",
      options: ["=SUMA(C2>=70; \"APROBADO\")", "=SI(C2>=70; \"APROBADO\"; \"APLAZADO\")", "=BUSCARV(C2; 70; \"APROBADO\")", "=CONTAR(C2>=70)"],
      correct: 1,
      explanation: "La función lógica =SI(prueba_lógica; valor_si_verdadero; valor_si_falso) evalúa la condición y devuelve el texto correspondiente."
    },
    {
      id: "rx3", subject: "excel", difficulty: "Intermedio",
      jerarquia: "Contabilidad Pura > Principios Contables > 10° Año > Unidad: Ecuación Patrimonial",
      question: "Si una empresa reporta Activos Totales por ₡18,000,000 y Pasivos Totales por ₡7,000,000, ¿a cuánto asciende su Patrimonio o Capital Contable?",
      options: ["₡25,000,000", "₡11,000,000", "₡7,000,000", "₡18,000,000"],
      correct: 1,
      explanation: "Por la ecuación contable fundamental (Patrimonio = Activo - Pasivo): 18,000,000 - 7,000,000 = ₡11,000,000."
    },

    // 4. IDENTIDAD DE MARCA (pracTICAtecnica.com, BDS Devs, CTP Mercedes Norte)
    {
      id: "ri1", subject: "identidad", difficulty: "Básico",
      jerarquia: "Identidad Institucional > Cultura Digital CTPMN > Nivel General > Unidad: Símbolos y Marca",
      question: "¿Cuál es el ícono oficial e histórico que representa la sabiduría tecnológica y la identidad propia de la plataforma pracTICAtecnica.com?",
      options: ["Un robot rojo genérico", "El Búho Azul original de las primeras versiones", "Una estrella amarilla", "Un escudo sin colores"],
      correct: 1,
      explanation: "El Búho Azul original simboliza la visión nocturna, el pensamiento analítico y la identidad auténtica de pracTICAtecnica.com."
    },
    {
      id: "ri2", subject: "identidad", difficulty: "Básico",
      jerarquia: "Identidad Institucional > Dirección Regional Heredia > Circuito 04 > Unidad: Comunidad CTPMN",
      question: "¿A qué Dirección Regional de Educación y Circuito pertenece oficialmente el Colegio Técnico Profesional (CTP) de Mercedes Norte?",
      options: ["Dirección Regional San José Norte • Circuito 01", "Dirección Regional de Educación de Heredia • Circuito 04", "Dirección Regional de Alajuela • Circuito 08", "Dirección Regional de Cartago • Circuito 02"],
      correct: 1,
      explanation: "El CTP de Mercedes Norte forma parte de la Dirección Regional de Educación de Heredia, Circuito Escolar 04."
    },
    {
      id: "ri3", subject: "identidad", difficulty: "Intermedio",
      jerarquia: "Identidad de Marca > Ingeniería de Software > BDS Devs > Unidad: Soberanía Tecnológica",
      question: "¿Qué equipo de arquitectura y desarrollo de software impulsa la plataforma educativa pracTICAtecnica.com bajo estándares de calidad Kaizen?",
      options: ["BDS Devs (liderado por el Ing. Max Salazar Sánchez y su equipo)", "Una franquicia extranjera cerrada", "Un sistema sin soporte local", "Una plantilla estática sin base de datos"],
      correct: 0,
      explanation: "BDS Devs desarrolla y mantiene pracTICAtecnica.com como una plataforma costarricense soberana y de grado industrial."
    },

    // 5. HÁBITOS DE ESTUDIO, FILOSOFÍA KAIZEN, DUA & REAC
    {
      id: "rh1", subject: "habitos", difficulty: "Básico",
      jerarquia: "Formación Humana > Hábitos de Excelencia > Nivel General > Unidad: Filosofía Kaizen",
      question: "¿Qué significa aplicar el principio japonés 'Kaizen' en el aprendizaje técnico y en el desarrollo de software diario?",
      options: ["Dejar todo para el último día antes del examen", "Mejora continua: aprender, auditar, corregir y perfeccionar un poco cada día", "Trabajar sin descanso ni planificación", "Copiar código sin comprender cómo funciona"],
      correct: 1,
      explanation: "Kaizen significa 'cambio para mejorar' de forma continua, acumulando mejoras constantes en disciplina, código y estudio."
    },
    {
      id: "rh2", subject: "habitos", difficulty: "Básico",
      jerarquia: "Orientación y Salud Ocupacional > Técnicas de Estudio > Nivel General > Unidad: Gestión del Tiempo",
      question: "¿En qué consiste la técnica Pomodoro para estudiar materias técnicas o programar sin agotamiento mental?",
      options: ["Estudiar 6 horas seguidas sin tomar agua", "Bloques de 25 minutos de enfoque profundo seguidos de 5 minutos de descanso activo", "Estudiar con tres pantallas de videojuegos abiertas", "Dormir solo 2 horas antes de una prueba"],
      correct: 1,
      explanation: "Alternar 25 minutos de concentración total con 5 minutos de pausa mejora la retención neuronal y previene la fatiga visual."
    },
    {
      id: "rh3", subject: "habitos", difficulty: "Intermedio",
      jerarquia: "Normativa MEP > Reglamento de Evaluación (REAC) > Nivel General > Unidad: Convivencia y Responsabilidad",
      question: "Cuando un estudiante se ausenta por una cita médica de la CCSS o situación justificada, ¿cuál es el hábito correcto según el reglamento MEP?",
      options: ["No avisar nunca al profesor guía", "Presentar el comprobante y gestionar la justificación formal en el plazo reglamentario", "Inventar una excusa un mes después", "Abandonar la materia"],
      correct: 1,
      explanation: "La comunicación oportuna y la presentación de comprobantes ante el Profesor Guía garantizan el derecho a reprogramar evaluaciones."
    },

    // 6. TALLERES EXPLORATORIOS (7°, 8° Y 9° AÑO CTP)
    {
      id: "rt1", subject: "talleres", difficulty: "Básico",
      jerarquia: "Talleres Exploratorios > Herramientas para la Producción y Transformación > 7°-9° > Unidad: Seguridad Industrial",
      question: "En un taller exploratorio de electricidad, electrónica o mantenimiento, ¿cuál es la primera regla de oro antes de intervenir un circuito?",
      options: ["Tocar los cables con las manos húmedas", "Verificar que la fuente esté desenergizada y usar equipo de protección", "Cortar todos los cables al azar", "Anular el fusible de protección con papel aluminio"],
      correct: 1,
      explanation: "En salud ocupacional y talleres técnicos, desenergizar el circuito antes de manipularlo previene descargas eléctricas y cortocircuitos."
    },
    {
      id: "rt2", subject: "talleres", difficulty: "Básico",
      jerarquia: "Talleres Exploratorios > Pensamiento Computacional y Robótica > 7°-9° > Unidad: Algoritmos",
      question: "En los talleres exploratorios de programación y robótica, ¿qué es un 'algoritmo'?",
      options: ["Un virus informático que daña el monitor", "Una secuencia lógica, ordenada y finita de pasos para resolver un problema", "El cable de corriente de la computadora", "Una marca de teclados mecánicos"],
      correct: 1,
      explanation: "Todo programa o rutina robótica parte de un algoritmo: pasos ordenados y precisos que transforman una entrada en una solución."
    },

    // 7. ESPECIALIDADES TÉCNICAS, SUBÁREAS Y UNIDADES MEP
    {
      id: "re1", subject: "especialidades", difficulty: "Intermedio",
      jerarquia: "Desarrollo Web / TI > Subárea: Soporte TI y Redes > 11° Año > Unidad: Subneteo VLSM",
      question: "En una subred empresarial con máscara /27 (255.255.255.224), ¿cuántas direcciones IP utilizables para computadoras (hosts) quedan disponibles?",
      options: ["14 direcciones utilizables", "30 direcciones utilizables", "62 direcciones utilizables", "254 direcciones utilizables"],
      correct: 1,
      explanation: "Con /27 quedan 5 bits para host (32 - 27 = 5). Aplicando 2⁵ - 2 (red y broadcast) = 32 - 2 = 30 hosts útiles."
    },
    {
      id: "re2", subject: "especialidades", difficulty: "Intermedio",
      jerarquia: "Desarrollo Web > Subárea: Diseño de Software > 12° Año > Unidad: Arquitectura y Patrones",
      question: "En la subárea de Diseño de Software, ¿qué ventaja ofrece separar el Frontend (React/UI) del Backend (API/Base de Datos)?",
      options: ["Hace que la página sea imposible de actualizar", "Permite escalar, mantener y asegurar la lógica de negocio de forma modular e independiente", "Obliga a escribir todo en un solo archivo de texto", "Elimina la necesidad de usar contraseñas"],
      correct: 1,
      explanation: "El desacoplamiento modular facilita el mantenimiento Kaizen, las pruebas unitarias y la protección de las credenciales de base de datos."
    },
    {
      id: "re3", subject: "especialidades", difficulty: "Básico",
      jerarquia: "Electrónica Industrial > Subárea: Fundamentos de Electricidad > 10° Año > Unidad: Ley de Ohm",
      question: "Si por una resistencia de 100 Ω circula una corriente de 0.12 A, ¿cuál es el voltaje aplicado según la Ley de Ohm (V = I × R)?",
      options: ["1.2 V", "12 V", "120 V", "0.0012 V"],
      correct: 1,
      explanation: "Multiplicando corriente por resistencia: V = 0.12 A × 100 Ω = 12 Voltios."
    },

    // 8. MATEMÁTICAS & ADMISIÓN UCR / TEC
    {
      id: "m1", subject: "math", difficulty: "Básico",
      jerarquia: "Matemáticas > Estadística y Porcentajes > 10° Año > Unidad: Proporcionalidad",
      question: "Si una plataforma educativa tiene 240 estudiantes y el 25% cuenta con beca o cortesía, ¿cuántos estudiantes tienen cortesía?",
      options: ["48 estudiantes", "60 estudiantes", "75 estudiantes", "80 estudiantes"],
      correct: 1,
      explanation: "El 25% equivale a dividir entre 4: 240 / 4 = 60 estudiantes."
    },
    {
      id: "m2", subject: "math", difficulty: "Intermedio",
      jerarquia: "Matemáticas > Álgebra > 9° Año > Unidad: Ecuaciones de Primer Grado",
      question: "Resuelve la ecuación lineal: 3x - 7 = 14",
      options: ["x = 5", "x = 7", "x = 21", "x = 3"],
      correct: 1,
      explanation: "Sumando 7 a ambos lados queda 3x = 21; al dividir entre 3 se obtiene x = 7."
    },
    {
      id: "m3", subject: "math", difficulty: "Avanzado",
      jerarquia: "Admisión Universitaria > Razonamiento Matemático UCR / TEC > Nivel PAA > Unidad: Sucesiones",
      question: "[Simulacro UCR/TEC] En la sucesión 2, 6, 12, 20, 30, X... ¿cuál es el valor numérico de X?",
      options: ["38", "42", "40", "44"],
      correct: 1,
      explanation: "Las diferencias entre términos van aumentando de 2 en 2: +4, +6, +8, +10. El siguiente salto es +12, por lo que 30 + 12 = 42."
    },

    // 9. INGLÉS & ESPAÑOL MEP
    {
      id: "e1", subject: "english_spanish", difficulty: "Básico",
      jerarquia: "Inglés > Conversational & Technical English > 10° Año > Unidad: Simple Present",
      question: "Choose the correct form to complete the sentence: 'She _____ to the computer lab every morning.'",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
      explanation: "En presente simple con tercera persona singular (she), el verbo 'go' lleva '-es': 'goes'."
    },
    {
      id: "e3", subject: "english_spanish", difficulty: "Intermedio",
      jerarquia: "Inglés Técnico > IT Vocabulary > 11° Año > Unidad: Cybersecurity & Backups",
      question: "What does the phrasal verb 'back up' mean in software development?",
      options: ["To delete all files", "To make a copy of data for safety", "To shut down the server", "To walk backwards"],
      correct: 1,
      explanation: "'Back up' significa realizar una copia de respaldo para proteger la información."
    },
    {
      id: "s1", subject: "english_spanish", difficulty: "Básico",
      jerarquia: "Español > Ortografía y Acentuación > 7°-11° Año > Unidad: Leyes del Acento",
      question: "¿Por qué la palabra 'árbol' lleva tilde ortográfica?",
      options: ["Es aguda terminada en vocal", "Es grave (llana) terminada en consonante distinta de n o s", "Es esdrújula", "Es sobreesdrújula"],
      correct: 1,
      explanation: "'Ár-bol' lleva la fuerza de voz en la penúltima sílaba (grave) y termina en 'l', por lo que debe tildarse."
    },

    // 10. CIENCIAS (QUÍMICA, FÍSICA, BIOLOGÍA)
    {
      id: "c1", subject: "science", difficulty: "Básico",
      jerarquia: "Ciencias / Biología > Citología > 10° Año > Unidad: La Célula",
      question: "¿Cuál es la unidad estructural, funcional y genética básica de todos los seres vivos?",
      options: ["El átomo", "La célula", "El tejido", "La molécula de agua"],
      correct: 1,
      explanation: "Según la teoría celular, todo organismo vivo está constituido por una o más células."
    },
    {
      id: "c2", subject: "science", difficulty: "Intermedio",
      jerarquia: "Física > Dinámica Clásica > 10° Año > Unidad: Leyes de Newton",
      question: "Según la segunda ley de Newton (F = m × a), si se duplica la fuerza neta sobre un objeto manteniendo su masa constante, ¿qué ocurre con su aceleración?",
      options: ["Se reduce a la mitad", "Se duplica", "Permanece igual", "Se vuelve cero"],
      correct: 1,
      explanation: "La aceleración es directamente proporcional a la fuerza neta aplicada cuando la masa permanece constante."
    },
    {
      id: "c4", subject: "science", difficulty: "Intermedio",
      jerarquia: "Química > Equilibrio Ácido-Base > 11° Año > Unidad: Escala de pH",
      question: "En la escala química de pH (0 a 14), una sustancia acuosa con pH = 3 se clasifica como:",
      options: ["Neutra", "Ácida", "Básica o alcalina", "Inerte"],
      correct: 1,
      explanation: "Valores inferiores a 7 corresponden a disoluciones ácidas, 7 es neutro y superiores a 7 son básicas o alcalinas."
    }
  ];

  function obtenerBancoRuleta() {
    try {
      const guardado = JSON.parse(localStorage.getItem(RULETA_STORAGE_KEY));
      if (Array.isArray(guardado) && guardado.length >= INITIAL_RULETA_ITEMS.length) return guardado;
    } catch {}
    return [...INITIAL_RULETA_ITEMS];
  }

  function guardarBancoRuleta(lista) {
    try { localStorage.setItem(RULETA_STORAGE_KEY, JSON.stringify(lista)); } catch {}
  }

  // ============================================================================
  // COMPONENTE COMPLETO: RULETA DEL SABER + PRÁCTICA + BANCO DOCENTE DE ÍTEMS
  // ============================================================================
  function renderRuletaDelSaberUniversal(contenedor) {
    let items = obtenerBancoRuleta();
    let subTab = 'wheel'; // 'wheel' | 'practice' | 'bank'
    let wheelAngle = 0;
    let spinning = false;
    let timerId = null;
    let timeLeft = 25;
    let usarTimer = true;
    let currentWheelItem = null;
    let wheelAnswered = false;
    let rachaRuleta = 0;

    // Estado de práctica y banco
    let pSubj = 'ALL', pDiff = 'ALL', practiceList = [...items], practiceIdx = 0, practiceAnswered = false;
    let bSearch = '', bSubj = 'ALL', showBankAnswers = false;

    function stopTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; }
    }

    function getMeta(id) {
      return RULETA_SECTORES.find(s => s.id === id) || RULETA_SECTORES[0];
    }

    function pintarEstructuraRuleta() {
      const xpObj = getXP();
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #6366f1;border-radius:16px;padding:16px;box-sizing:border-box;box-shadow:0 20px 50px rgba(0,0,0,0.85);">
          <!-- Encabezado de la Ruleta del Saber -->
          <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;box-shadow:0 4px 12px rgba(79,70,229,0.4);">🎡</div>
              <div>
                <h2 style="margin:0;font-size:17px;font-weight:900;color:#fff;">Ruleta del Saber & Banco de Ítems MEP</h2>
                <p style="margin:2px 0 0;font-size:11.5px;color:#94a3b8;">Todas las Materias, Prueba MOPT, Excel, Identidad CTPMN, Hábitos Kaizen, Exploratorios y Especialidades</p>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span style="background:#1e1b4b;border:1px solid #6366f1;color:#a5b4fc;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;">⚡ XP Total: <b id="rs-score">${xpObj.xp}</b></span>
              <span style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 10px;border-radius:8px;font-size:12px;font-weight:800;">🔥 Racha Giro: <b id="rs-streak">${rachaRuleta}</b></span>
              <button id="rs-mute-btn" style="background:#131f33;border:1px solid #334155;color:#e2e8f0;padding:6px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">
                🔊 Sonido: ${sonidoActivo ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <!-- Pestañas de la Ruleta -->
          <div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:16px;border-bottom:1px solid #1e293b;padding-bottom:10px;">
            <button data-rstab="wheel" class="rs-tab-btn" style="padding:8px 14px;border-radius:8px;border:1px solid ${subTab==='wheel'?'#818cf8':'#26354d'};background:${subTab==='wheel'?'#4f46e5':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🎡 1. Girar Ruleta del Saber</button>
            <button data-rstab="practice" class="rs-tab-btn" style="padding:8px 14px;border-radius:8px;border:1px solid ${subTab==='practice'?'#818cf8':'#26354d'};background:${subTab==='practice'?'#4f46e5':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🎯 2. Práctica por Materia / Subárea</button>
            <button data-rstab="bank" class="rs-tab-btn" style="padding:8px 14px;border-radius:8px;border:1px solid ${subTab==='bank'?'#818cf8':'#26354d'};background:${subTab==='bank'?'#4f46e5':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">🗂️ 3. Banco Docente de Ítems (${items.length})</button>
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
          stopTimer();
          subTab = btn.getAttribute('data-rstab');
          pintarEstructuraRuleta();
        };
      });

      const bodyPanel = document.getElementById('rs-body-panel');

      // SUB-VISTA 1: LA RULETA EN CANVAS + TARJETA DE RETO
      if (subTab === 'wheel') {
        bodyPanel.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px;align-items:start;">
            <!-- Columna Izquierda: Rueda Canvas -->
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;display:flex;flex-direction:column;align-items:center;">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:13px;font-weight:800;color:#e2e8f0;">Gira la ruleta de 10 áreas</span>
                <label style="font-size:11.5px;color:#94a3b8;display:flex;align-items:center;gap:5px;cursor:pointer;">
                  <input id="rs-timer-chk" type="checkbox" ${usarTimer?'checked':''}/> Reto con tiempo (25s)
                </label>
              </div>

              <div style="position:relative;display:flex;flex-direction:column;align-items:center;margin:4px 0;">
                <div style="width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:24px solid #fbbf24;margin-bottom:-10px;z-index:5;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));"></div>
                <canvas id="rs-wheel-canvas" width="310" height="310" style="max-width:100%;height:auto;cursor:pointer;"></canvas>
              </div>

              <button id="rs-spin-btn" style="margin-top:10px;width:100%;padding:12px;border-radius:10px;background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(79,70,229,0.5);">
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

            <!-- Columna Derecha: Pregunta Sorteada -->
            <div id="rs-question-panel" style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:18px;min-height:380px;display:flex;flex-direction:column;justify-content:center;">
              <div style="text-align:center;padding:24px 10px;">
                <div style="width:58px;height:58px;border-radius:16px;background:#1e1b4b;color:#818cf8;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;margin:0 auto 12px;">🦉</div>
                <h3 style="margin:0 0 6px;font-size:17px;color:#fff;">Listo para sortear tu reto</h3>
                <p style="margin:0 auto;font-size:12.5px;color:#94a3b8;max-width:400px;line-height:1.5;">
                  Presiona <b>¡Girar Ruleta del Saber!</b> o toca la rueda para sortear una pregunta de <b>Prueba MOPT, Excel, Desarrollo Web, Identidad CTPMN, Hábitos Kaizen, Talleres Exploratorios, Especialidades o Materias Básicas</b>.
                </p>
              </div>
            </div>
          </div>
        `;

        const cv = document.getElementById('rs-wheel-canvas');
        const ctx = cv.getContext('2d');

        function drawWheel(angle) {
          const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2;
          const radius = Math.min(cx, cy) - 8;
          const slice = (2 * Math.PI) / RULETA_SECTORES.length;
          ctx.clearRect(0, 0, w, h);

          RULETA_SECTORES.forEach((subj, i) => {
            const start = angle + i * slice;
            const end = start + slice;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, start, end);
            ctx.closePath();
            ctx.fillStyle = subj.color;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#0b1322";
            ctx.stroke();

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(start + slice / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11.5px Inter, system-ui, sans-serif";
            ctx.fillText(subj.short, radius - 14, 4);
            ctx.restore();
          });

          ctx.beginPath();
          ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
          ctx.fillStyle = "#0b1322";
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#38bdf8";
          ctx.stroke();
        }

        function mostrarPreguntaRuleta(item) {
          currentWheelItem = item;
          wheelAnswered = false;
          const meta = getMeta(item.subject);
          const qPanel = document.getElementById('rs-question-panel');
          if (!qPanel) return;

          // Barajar opciones manteniendo rastreo de cuál es la correcta (evita que todas sean A o B)
          const opcionesMapeadas = shuffleCrypto(item.options.map((texto, idx) => ({ texto, esCorrecta: idx === item.correct })));
          const letras = ["A", "B", "C", "D"];

          qPanel.innerHTML = `
            <div>
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="background:${meta.color};color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;">${meta.name}</span>
                  <span style="background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:700;">${item.difficulty}</span>
                </div>
                <div id="rs-timer-pill" style="display:${usarTimer?'block':'none'};background:#1e293b;color:#fbbf24;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:800;">
                  ⏱️ Tiempo: <span id="rs-timer-val">25</span>s
                </div>
              </div>

              <div style="font-size:10.5px;color:#94a3b8;background:#0b1322;padding:6px 10px;border-radius:6px;border-left:3px solid ${meta.color};margin-bottom:10px;font-weight:600;">
                🏛️ ${item.jerarquia || 'Malla Curricular Oficial MEP • CTP Mercedes Norte'}
              </div>

              <h3 style="margin:0 0 14px;font-size:15.5px;font-weight:800;color:#fff;line-height:1.45;">${item.question}</h3>

              <div id="rs-opts-box" style="display:flex;flex-direction:column;gap:8px;">
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
            wheelAnswered = true;
            stopTimer();
            const acerto = !timeout && btnElegido && btnElegido.getAttribute('data-ok') === '1';

            if (acerto) {
              rachaRuleta += 1;
              ganarXP(15 + rachaRuleta * 2, "🎡 Campeón Ruleta");
              playSuccessSound();
            } else {
              rachaRuleta = 0;
              playErrorSound();
            }

            const scEl = document.getElementById('rs-score');
            const stEl = document.getElementById('rs-streak');
            if (scEl) scEl.innerText = getXP().xp;
            if (stEl) stEl.innerText = rachaRuleta;

            qPanel.querySelectorAll('.rs-opt-btn').forEach(b => {
              b.disabled = true;
              if (b.getAttribute('data-ok') === '1') {
                b.style.background = '#064e3b';
                b.style.borderColor = '#10b981';
              } else if (b === btnElegido) {
                b.style.background = '#7f1d1d';
                b.style.borderColor = '#ef4444';
              } else {
                b.style.opacity = '0.6';
              }
            });

            const fb = document.getElementById('rs-fb-box');
            fb.style.display = 'block';
            fb.style.background = acerto ? '#064e3b' : '#450a0a';
            fb.style.border = `1px solid ${acerto ? '#10b981' : '#ef4444'}`;
            fb.innerHTML = `
              <div style="font-weight:900;color:${acerto?'#6ee7b7':'#fca5a5'};margin-bottom:4px;">
                ${acerto ? '🎉 ¡Correcto! Has ganado XP y aumentado tu racha.' : (timeout ? '⏰ ¡Se agotó el tiempo de 25s!' : '❌ Respuesta incorrecta.')}
              </div>
              <div style="color:#e2e8f0;margin-bottom:8px;"><b>Explicación pedagógica:</b> ${item.explanation}</div>
              <button id="rs-spin-again" style="background:#4f46e5;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎰 Girar de nuevo</button>
            `;
            document.getElementById('rs-spin-again').onclick = girarRuleta;
          }

          qPanel.querySelectorAll('.rs-opt-btn').forEach(btn => {
            btn.onclick = () => evaluarSeleccion(btn, false);
          });

          if (usarTimer) {
            timeLeft = 25;
            stopTimer();
            timerId = setInterval(() => {
              timeLeft -= 1;
              const tv = document.getElementById('rs-timer-val');
              if (tv) tv.innerText = timeLeft;
              if (timeLeft <= 0) {
                stopTimer();
                evaluarSeleccion(null, true);
              }
            }, 1000);
          }
        }

        function girarRuleta() {
          if (spinning) return;
          stopTimer();
          spinning = true;
          const spinBtn = document.getElementById('rs-spin-btn');
          if (spinBtn) spinBtn.disabled = true;

          const extraSpins = 5 + Math.random() * 4;
          const targetAngle = wheelAngle + extraSpins * 2 * Math.PI;
          const startAngle = wheelAngle;
          const duration = 2400;
          const startTime = performance.now();
          let lastTickSlice = -1;

          function animate(now) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - t, 3);
            wheelAngle = startAngle + (targetAngle - startAngle) * easeOut;
            drawWheel(wheelAngle);

            const slice = (2 * Math.PI) / RULETA_SECTORES.length;
            const currentTick = Math.floor(wheelAngle / slice);
            if (currentTick !== lastTickSlice) {
              lastTickSlice = currentTick;
              playTone(400 + (currentTick % 6) * 45, 0.035, "sine", 0.05);
            }

            if (t < 1) {
              requestAnimationFrame(animate);
            } else {
              spinning = false;
              if (spinBtn) spinBtn.disabled = false;
              const normAngle = ((-Math.PI / 2 - wheelAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
              const idx = Math.floor(normAngle / slice) % RULETA_SECTORES.length;
              const ganador = RULETA_SECTORES[idx];
              const pool = items.filter(it => it.subject === ganador.id);
              const elegido = shuffleCrypto(pool)[0] || shuffleCrypto(items)[0];
              mostrarPreguntaRuleta(elegido);
            }
          }
          requestAnimationFrame(animate);
        }

        drawWheel(wheelAngle);
        document.getElementById('rs-spin-btn').onclick = girarRuleta;
        cv.onclick = girarRuleta;
        document.getElementById('rs-timer-chk').onchange = (e) => { usarTimer = e.target.checked; };
      }

      // SUB-VISTA 2: PRÁCTICA POR MATERIA / SUBÁREA
      else if (subTab === 'practice') {
        function filtrarPractica() {
          practiceList = items.filter(it => {
            const okS = pSubj === 'ALL' || it.subject === pSubj;
            const okD = pDiff === 'ALL' || it.difficulty === pDiff;
            return okS && okD;
          });
          practiceIdx = 0;
          pintarTarjetaPractica();
        }

        function pintarTarjetaPractica() {
          const item = practiceList[practiceIdx];
          const meta = item ? getMeta(item.subject) : RULETA_SECTORES[0];
          const opcionesBarajadas = item ? shuffleCrypto(item.options.map((t, i) => ({ t, ok: i === item.correct }))) : [];

          bodyPanel.innerHTML = `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
              <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <select id="rp-subj" style="background:#131f33;color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL">📚 Todas las Áreas y Especialidades (${items.length})</option>
                  ${RULETA_SECTORES.map(s => `<option value="${s.id}" ${pSubj===s.id?'selected':''}>${s.name}</option>`).join('')}
                </select>
                <select id="rp-diff" style="background:#131f33;color:#fff;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL" ${pDiff==='ALL'?'selected':''}>Todos los niveles</option>
                  <option value="Básico" ${pDiff==='Básico'?'selected':''}>🟢 Básico</option>
                  <option value="Intermedio" ${pDiff==='Intermedio'?'selected':''}>🟡 Intermedio</option>
                  <option value="Avanzado" ${pDiff==='Avanzado'?'selected':''}>🔴 Avanzado</option>
                </select>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:12px;color:#38bdf8;font-weight:800;">Ítem ${practiceList.length ? practiceIdx + 1 : 0} de ${practiceList.length}</span>
                <button id="rp-shuf" style="background:#4f46e5;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">🔀 Mezclar</button>
              </div>
            </div>

            ${!item ? `<div style="padding:30px;text-align:center;color:#94a3b8;">No hay ítems para este filtro.</div>` : `
              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:18px;max-width:780px;margin:0 auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="background:${meta.color};color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:800;">${meta.name}</span>
                  <span style="font-size:11.5px;color:#34d399;font-weight:700;">${item.difficulty}</span>
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-bottom:10px;">🏛️ ${item.jerarquia || 'Malla Oficial MEP'}</div>
                <h3 style="margin:0 0 14px;font-size:16px;color:#fff;line-height:1.45;">${item.question}</h3>
                <div id="rp-opts" style="display:flex;flex-direction:column;gap:8px;">
                  ${opcionesBarajadas.map((o, idx) => `
                    <button type="button" data-ok="${o.ok?'1':'0'}" class="rp-opt-btn" style="text-align:left;padding:11px 14px;border-radius:10px;border:1px solid #26354d;background:#131f33;color:#fff;font-size:13px;font-weight:700;cursor:pointer;">
                      ${String.fromCharCode(65+idx)}) ${o.t}
                    </button>
                  `).join('')}
                </div>
                <div id="rp-fb" style="display:none;margin-top:12px;padding:12px;border-radius:8px;font-size:12.5px;"></div>
                <div style="display:flex;justify-content:space-between;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;">
                  <button id="rp-prev" ${practiceIdx===0?'disabled':''} style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
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
                if (ok) { ganarXP(10); playSuccessSound(); } else { playErrorSound(); }
                bodyPanel.querySelectorAll('.rp-opt-btn').forEach(btn => {
                  btn.disabled = true;
                  if (btn.getAttribute('data-ok') === '1') { btn.style.background = '#064e3b'; btn.style.borderColor = '#10b981'; }
                  else if (btn === b) { btn.style.background = '#7f1d1d'; btn.style.borderColor = '#ef4444'; }
                });
                const fb = document.getElementById('rp-fb');
                fb.style.display = 'block';
                fb.style.background = ok ? '#064e3b' : '#450a0a';
                fb.innerHTML = `<b>${ok ? '✅ ¡Correcto! (+10 XP)' : '❌ Revisa la explicación:'}</b> ${item.explanation}`;
              };
            });
            document.getElementById('rp-prev').onclick = () => { if (practiceIdx > 0) { practiceIdx--; pintarTarjetaPractica(); } };
            document.getElementById('rp-next').onclick = () => { if (practiceIdx < practiceList.length - 1) { practiceIdx++; pintarTarjetaPractica(); } };
          }
        }
        pintarTarjetaPractica();
      }

      // SUB-VISTA 3: BANCO DOCENTE DE ÍTEMS (+ NUEVO ÍTEM, MOSTRAR RESPUESTAS Y COPIAR JSON)
      else if (subTab === 'bank') {
        function pintarBancoDocente() {
          const filtrados = items.filter(it => {
            const okS = bSubj === 'ALL' || it.subject === bSubj;
            const q = bSearch.toLowerCase().trim();
            const okQ = !q || it.question.toLowerCase().includes(q) || it.explanation.toLowerCase().includes(q) || (it.jerarquia || '').toLowerCase().includes(q);
            return okS && okQ;
          });

          bodyPanel.innerHTML = `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:12px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
              <div style="display:flex;flex-wrap:wrap;gap:8px;flex:1;min-width:240px;">
                <input id="rb-search" type="search" value="${bSearch}" placeholder="🔍 Buscar por pregunta, unidad, subárea o palabra clave..." style="flex:1;min-width:180px;background:#0b1322;border:1px solid #334155;color:#fff;padding:8px 12px;border-radius:8px;font-size:12.5px;"/>
                <select id="rb-subj" style="background:#131f33;color:#fff;border:1px solid #334155;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:700;">
                  <option value="ALL">Todas las categorías</option>
                  ${RULETA_SECTORES.map(s => `<option value="${s.id}" ${bSubj===s.id?'selected':''}>${s.name}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button id="rb-toggle-ans" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  ${showBankAnswers ? '🙈 Ocultar respuestas' : '👁️ Mostrar respuestas'}
                </button>
                <button id="rb-new-btn" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  + Nuevo ítem MEP
                </button>
                <button id="rb-copy-json" style="background:#4f46e5;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  📋 Copiar JSON
                </button>
              </div>
            </div>

            <!-- Formulario colapsable para agregar nuevo ítem al banco -->
            <div id="rb-form-wrap" style="display:none;background:#070d19;border:1.5px solid #10b981;border-radius:12px;padding:16px;margin-bottom:16px;">
              <h4 style="margin:0 0 10px;color:#34d399;font-size:14px;">➕ Agregar Nuevo Ítem al Banco de la Ruleta (Persistencia Local)</h4>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-bottom:8px;">
                <select id="nf-subj" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;">
                  ${RULETA_SECTORES.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
                <select id="nf-diff" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;">
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
                <input id="nf-jer" type="text" placeholder="Especialidad > Subárea > Nivel > Unidad" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
              </div>
              <input id="nf-q" type="text" placeholder="Escribe el enunciado de la pregunta..." style="width:100%;box-sizing:border-box;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12.5px;margin-bottom:8px;"/>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <input id="nf-o0" type="text" placeholder="Opción A" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
                <input id="nf-o1" type="text" placeholder="Opción B" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
                <input id="nf-o2" type="text" placeholder="Opción C" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
                <input id="nf-o3" type="text" placeholder="Opción D" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
              </div>
              <div style="display:grid;grid-template-columns:160px 1fr auto;gap:8px;align-items:center;">
                <select id="nf-cor" style="background:#0b1322;color:#34d399;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;font-weight:700;">
                  <option value="0">Correcta: Opción A</option>
                  <option value="1">Correcta: Opción B</option>
                  <option value="2">Correcta: Opción C</option>
                  <option value="3">Correcta: Opción D</option>
                </select>
                <input id="nf-exp" type="text" placeholder="Explicación pedagógica de la respuesta..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;font-size:12px;"/>
                <button id="nf-save" style="background:#059669;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-weight:800;cursor:pointer;">Guardar</button>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:12px;">
              ${filtrados.map(it => {
                const m = getMeta(it.subject);
                const letras = ["A","B","C","D"];
                return `
                  <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="background:${m.color};color:#fff;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:800;">${m.name}</span>
                        <span style="font-size:11px;color:#94a3b8;font-weight:700;">${it.difficulty}</span>
                      </div>
                      <div style="font-size:10px;color:#38bdf8;margin-bottom:6px;">${it.jerarquia || 'Malla Curricular MEP'}</div>
                      <p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#fff;line-height:1.4;">${it.question}</p>
                      <div style="display:flex;flex-direction:column;gap:4px;font-size:11.5px;">
                        ${it.options.map((op, idx) => {
                          const esCorr = showBankAnswers && idx === it.correct;
                          return `<div style="padding:5px 8px;border-radius:6px;background:${esCorr?'#064e3b':'#0b1322'};color:${esCorr?'#6ee7b7':'#cbd5e1'};border:1px solid ${esCorr?'#10b981':'#1e293b'};"><b>${letras[idx]}.</b> ${op}</div>`;
                        }).join('')}
                      </div>
                    </div>
                    ${showBankAnswers ? `<div style="margin-top:8px;padding:8px;border-radius:6px;background:#0b1322;border:1px solid #334155;font-size:11px;color:#34d399;"><b>Explicación:</b> ${it.explanation}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `;

          const sIn = document.getElementById('rb-search');
          sIn.oninput = (e) => {
            bSearch = e.target.value;
            pintarBancoDocente();
            const nIn = document.getElementById('rb-search');
            nIn.focus(); nIn.setSelectionRange(bSearch.length, bSearch.length);
          };
          document.getElementById('rb-subj').onchange = (e) => { bSubj = e.target.value; pintarBancoDocente(); };
          document.getElementById('rb-toggle-ans').onclick = () => { showBankAnswers = !showBankAnswers; pintarBancoDocente(); };
          document.getElementById('rb-new-btn').onclick = () => {
            const fw = document.getElementById('rb-form-wrap');
            fw.style.display = fw.style.display === 'none' ? 'block' : 'none';
          };
          document.getElementById('rb-copy-json').onclick = () => {
            navigator.clipboard.writeText(JSON.stringify(items, null, 2)).catch(() => {});
            document.getElementById('rb-copy-json').innerText = '✅ JSON Copiado';
          };
          document.getElementById('nf-save').onclick = () => {
            const q = document.getElementById('nf-q').value.trim();
            const o0 = document.getElementById('nf-o0').value.trim();
            const o1 = document.getElementById('nf-o1').value.trim();
            const o2 = document.getElementById('nf-o2').value.trim();
            const o3 = document.getElementById('nf-o3').value.trim();
            if (!q || !o0 || !o1) return;
            items.unshift({
              id: 'custom_' + Date.now(),
              subject: document.getElementById('nf-subj').value,
              difficulty: document.getElementById('nf-diff').value,
              jerarquia: document.getElementById('nf-jer').value.trim() || 'CTP Mercedes Norte > Unidad Personalizada',
              question: q,
              options: [o0, o1, o2 || 'N/A', o3 || 'N/A'],
              correct: Number(document.getElementById('nf-cor').value),
              explanation: document.getElementById('nf-exp').value.trim() || 'Respuesta verificada por el docente.'
            });
            guardarBancoRuleta(items);
            pintarEstructuraRuleta();
          };
        }
        pintarBancoDocente();
      }
    }

    pintarEstructuraRuleta();
  }

  // ============================================================================
  // ESTILOS RESPONSIVE MOBILE-FIRST & GAMIFICACIÓN
  // ============================================================================
  function inyectarCSSGate() {
    if (document.getElementById('bds-v148-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v148-css';
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
  // PANTALLA DE LOGIN SOBERANA (PLACEHOLDERS NEUTROS + OAUTH + 5 INTENTOS)
  // ============================================================================
  window.mostrarLoginEstricto = function (vistaInicial) {
    inyectarCSSGate();
    let old = document.getElementById('bds-login-v148');
    if (old) old.remove();

    let vista = vistaInicial || 'login';
    const gate = document.createElement('div');
    gate.id = 'bds-login-v148';
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
            <p style="margin:0 0 14px;font-size:11.5px;color:#94a3b8;text-align:center;">Restablecimiento seguro para cuentas institucionales</p>
            <div id="rec-msg" style="display:none;padding:8px;border-radius:6px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;"></div>
            <form id="f-rec-v148" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar Credencial con SHA-256</button>
              <button type="button" id="btn-volver-login" style="background:transparent;color:#38bdf8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">← Volver al Inicio de Sesión</button>
            </form>
          </div>
        `;
        document.getElementById('btn-volver-login').onclick = () => { vista = 'login'; renderVistaAuth(); };
        document.getElementById('f-rec-v148').onsubmit = (e) => {
          e.preventDefault();
          const m = document.getElementById('rc-mail').value.trim();
          const p1 = document.getElementById('rc-pass1').value;
          const p2 = document.getElementById('rc-pass2').value;
          const msg = document.getElementById('rec-msg');
          msg.style.display = 'block';
          if (!validarDominioInstitucional(m)) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = '⚠️ Ingresa un correo @est.mep.go.cr, @mep.go.cr o @gmail.com';
            return;
          }
          if (p1 !== p2) {
            msg.style.background = '#450a0a'; msg.style.color = '#fca5a5';
            msg.innerText = '❌ Las contraseñas no coinciden.';
            return;
          }
          setIntentos(0);
          msg.style.background = '#064e3b'; msg.style.color = '#34d399';
          msg.innerText = '✅ Clave restablecida y desbloqueada. Redirigiendo...';
          setTimeout(() => { vista = 'login'; renderVistaAuth(); }, 1100);
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:10px;">
            <img src="${SVG_BUHO_ORIGINAL}" width="44" height="44" alt="Búho Azul Original"/>
            <img src="${SVG_MEP}" height="36" alt="MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:14px;">
            <h1 style="margin:0;font-size:21px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Ruleta del Saber & Simuladores • CTP Mercedes Norte</p>
          </div>

          <div id="auth-error-msg" style="display:${bloqueado?'block':'none'};background:#450a0a;color:#fca5a5;padding:9px;border-radius:8px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;">
            ${bloqueado ? '🔒 Cuenta bloqueada por 5 intentos fallidos. Comunícate con el administrador o usa "Recuperar Clave".' : ''}
          </div>

          <form id="f-login-v148" style="display:flex;flex-direction:column;gap:9px;">
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Correo Institucional o Personal (@est.mep.go.cr / @gmail.com):</label>
              <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Nombre y Apellidos:</label>
              <input id="lg-nom" type="text" placeholder="Nombre completo del usuario" required ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Rol Institucional:</label>
                <select id="lg-rol" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                  ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}">${r.rol}</option>`).join('')}
                </select>
              </div>
              <div id="wrapper-seccion">
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Sección (7-1 a 12-4):</label>
                <select id="lg-sec" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:12px;">
                  ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='10-3'?'selected':''}>Sección ${sc}</option>`).join('')}
                </select>
              </div>
            </div>
            <div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:3px;">Contraseña de Acceso:</label>
              <div style="display:flex;gap:6px;">
                <input id="lg-pass" type="password" placeholder="Ingresa tu contraseña" required minlength="4" ${bloqueado?'disabled':''} style="flex:1;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
                <button type="button" id="btn-toggle-pass" style="background:#131f33;border:1px solid #334155;color:#cbd5e1;border-radius:8px;padding:0 12px;cursor:pointer;">👁️</button>
              </div>
            </div>

            <button type="submit" ${bloqueado?'disabled':''} style="margin-top:4px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13.5px;font-weight:800;cursor:pointer;">
              🔐 Iniciar Sesión Institucional
            </button>
            <button type="button" id="btn-google-oauth" ${bloqueado?'disabled':''} style="background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;padding:10px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
              ${GOOGLE_SVG} <span>Continuar con Google OAuth</span>
            </button>
          </form>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #1e293b;font-size:11px;">
            <span style="color:#64748b;">Intentos: ${intentos}/5</span>
            <button type="button" id="btn-go-recover" style="background:none;border:none;color:#38bdf8;font-weight:700;cursor:pointer;padding:0;">¿Olvidaste tu clave? Recuperar</button>
          </div>
        </div>
      `;

      const rolSelect = document.getElementById('lg-rol');
      const secWrapper = document.getElementById('wrapper-seccion');
      const mailInput = document.getElementById('lg-mail');
      const nomInput = document.getElementById('lg-nom');
      const passInput = document.getElementById('lg-pass');

      document.getElementById('btn-toggle-pass').onclick = () => {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
      };
      document.getElementById('btn-go-recover').onclick = () => { vista = 'recover'; renderVistaAuth(); };

      function actualizarVisibilidadSeccion() {
        const rolObj = ROLES_INSTITUCIONALES.find(r => r.rol === rolSelect.value);
        const esSup = esSuperAdminSoberano(mailInput.value);
        if (esSup || (rolObj && !rolObj.requiereSeccion)) secWrapper.style.display = 'none';
        else secWrapper.style.display = 'block';
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
          errBox.innerText = `🚫 Alerta de Seguridad (${nInt}/5): El rol SuperAdmin requiere la cuenta soberana verificada.`;
          if (nInt >= 5) renderVistaAuth();
          return;
        }

        setIntentos(0);
        const rolFinal = esMax ? 'SuperAdmin' : rolSel;
        if (!nom) nom = esMax ? 'Ing. Max Salazar Sánchez' : mail.split('@')[0];

        const rolConfig = ROLES_INSTITUCIONALES.find(r => r.rol === rolFinal);
        const llevaSeccion = !esMax && rolConfig && rolConfig.requiereSeccion;
        const seccionFinal = llevaSeccion ? `Sección ${secSel}` : 'Gestión Institucional (Sin Sección)';
        const firma = await sha256Hex(`${mail}|${rolFinal}|${seccionFinal}|CTPMN-2026`);

        setSesion({
          id: esMax ? 'SUPERADMIN-MAX' : `CTPMN-${secSel}-${firma.slice(0, 6)}`,
          nombre: nom,
          email: mail,
          rol: rolFinal,
          esSuperAdmin: esMax,
          seccion: seccionFinal,
          firmaSha256: firma
        });

        gate.remove();
        activarPlataformaAutenticada();
      }

      document.getElementById('f-login-v148').onsubmit = (e) => { e.preventDefault(); procesarIngreso(false); };
      document.getElementById('btn-google-oauth').onclick = () => {
        if (!passInput.value) passInput.value = 'oauth-verified';
        procesarIngreso(true);
      };
    }

    document.body.appendChild(gate);
    renderVistaAuth();
  };

  // ============================================================================
  // SALA DE 13 JUEGOS INTERACTIVOS (AJEDREZ FIDE INTACTO + RULETA + DOMINÓ + SOLITARIO)
  // ============================================================================
  function renderSala13Juegos(contenedor, juegoInicial) {
    let juegoActivo = juegoInicial || 'ajedrez';
    const LISTA_13 = [
      { id: 'ajedrez', nom: '1. ♟️ Ajedrez FIDE' },
      { id: 'ruleta', nom: '2. 🎡 Ruleta del Saber' },
      { id: 'domino', nom: '3. 🁣 Dominó Pro' },
      { id: 'solitario', nom: '4. 🃏 Solitario Dual' },
      { id: 'damas', nom: '5. 🔴 Damas 8x8' },
      { id: 'cuatro', nom: '6. 🟡 4 en Línea' },
      { id: 'ranas', nom: '7. 🐸 Cruza Ranas' },
      { id: 'puente', nom: '8. 🔦 Puente 17m' },
      { id: 'gato', nom: '9. ❌ Ta-Te-Ti IA' },
      { id: 'memoria', nom: '10. 🧠 Memoria 4x4' },
      { id: 'adivina', nom: '11. 🔢 Búsqueda Binaria' },
      { id: 'subnet', nom: '12. 🌐 Reto VLSM' },
      { id: 'cosevi', nom: '13. 🔐 Turing & COSEVI' }
    ];

    function pintarSelectorYJuego() {
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #7c3aed;border-radius:14px;padding:14px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:900;padding:4px 9px;border-radius:6px;">ARCADE 13 JUEGOS v148</span>
              <h2 style="margin:0;font-size:16px;color:#fff;">Centro Gamificado de Razonamiento, Ruleta y Entretenimiento Estudiantil</h2>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;background:#070d19;padding:8px;border-radius:10px;border:1px solid #1e293b;">
            ${LISTA_13.map(j => `
              <button data-jid="${j.id}" class="btn-sub-juego" style="padding:8px 11px;border-radius:7px;border:1px solid ${juegoActivo===j.id?'#a78bfa':'#334155'};background:${juegoActivo===j.id?'#7c3aed':'#131f33'};color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;">
                ${j.nom}
              </button>
            `).join('')}
          </div>
          <div id="juego-lienzo" style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;min-height:390px;"></div>
        </div>
      `;

      contenedor.querySelectorAll('.btn-sub-juego').forEach(b => {
        b.onclick = () => { juegoActivo = b.getAttribute('data-jid'); pintarSelectorYJuego(); };
      });

      const stg = document.getElementById('juego-lienzo');

      // Si selecciona Ruleta dentro del Arcade, renderizar el motor completo de Ruleta del Saber
      if (juegoActivo === 'ruleta') {
        renderRuletaDelSaberUniversal(stg);
        return;
      }

      // 1. AJEDREZ FIDE (EXACTO E INTOCABLE)
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
          turnoB = !turnoB; sel = null;
          ganarXP(5, "♟️ Estratega FIDE");
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
          if (movs.length > 0) {
            movs.sort((a, b) => b.score - a.score);
            const m = movs[0]; ejecutarMovimiento(m.r1, m.c1, m.r2, m.c2);
            msgFIDE = `🤖 PC jugó ${historial[historial.length-1]}. Turno de Blancas.`;
          } else { msgFIDE = "🏆 ¡Jaque mate! Fin de partida."; }
          drawChess();
        }
        function drawChess() {
          let destinos = new Set();
          if (sel) { for (let r=0; r<8; r++) for (let c=0; c<8; c++) if (esValidoFIDE(sel.r, sel.c, r, c)) destinos.add(`${r},${c}`); }
          stg.innerHTML = `
            <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-items:flex-start;">
              <div style="text-align:center;">
                <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">♟️ Ajedrez Oficial FIDE (${modoPC?'Jugador vs PC':'1 vs 1 Local'})</h3>
                <p style="font-size:12px;color:#34d399;margin:0 0 8px;max-width:400px;">${msgFIDE}</p>
                <div style="display:flex;justify-content:center;gap:6px;margin-bottom:10px;">
                  <button id="ch-pc" style="background:${modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #38bdf8;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">🤖 vs PC</button>
                  <button id="ch-pvp" style="background:${!modoPC?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">👥 1 vs 1</button>
                  <button id="ch-rst" style="background:#7f1d1d;color:#fecaca;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">Reiniciar</button>
                </div>
                <div id="ch-board" style="display:grid;grid-template-columns:repeat(8,42px);grid-template-rows:repeat(8,42px);width:336px;margin:0 auto;border:3px solid #38bdf8;border-radius:8px;overflow:hidden;"></div>
              </div>
              <div style="background:#0b1322;border:1px solid #1e293b;border-radius:10px;padding:12px;width:240px;text-align:left;">
                <div style="font-size:12px;font-weight:800;color:#fff;margin-bottom:6px;">Notación FIDE:</div>
                <div style="max-height:140px;overflow-y:auto;font-family:monospace;font-size:11px;color:#34d399;background:#060c17;padding:6px;border-radius:6px;">${historial.length ? historial.map((h,i)=>`${i+1}. ${h}`).join(' | ') : 'Sin jugadas aún.'}</div>
              </div>
            </div>
          `;
          document.getElementById('ch-pc').onclick = () => { modoPC = true; drawChess(); };
          document.getElementById('ch-pvp').onclick = () => { modoPC = false; drawChess(); };
          document.getElementById('ch-rst').onclick = () => { pintarSelectorYJuego(); };
          const bd = document.getElementById('ch-board');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c, esLeg = destinos.has(`${r},${c}`), p = tb[r][c], b = esBlanca(p);
            const btn = document.createElement('button');
            btn.style.cssText = `width:42px;height:42px;border:${esLeg?'2px solid #34d399':'none'};background:${esSel?'#0284c7':(esLeg?'#059669':(osc?'#1e293b':'#475569'))};font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${b?'#ffffff':'#fbbf24'};padding:0;`;
            btn.innerText = p ? GLIFOS[p] : (esLeg ? '•' : '');
            btn.onclick = () => {
              if (modoPC && !turnoB) return;
              if (!sel) {
                if (p && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; msgFIDE = `Pieza ${GLIFOS[p]} lista. Elige destino verde.`; drawChess(); }
              } else {
                if (sel.r === r && sel.c === c) { sel = null; msgFIDE = "Cancelado."; drawChess(); return; }
                if (p !== '' && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; drawChess(); return; }
                if (esValidoFIDE(sel.r, sel.c, r, c)) {
                  ejecutarMovimiento(sel.r, sel.c, r, c);
                  msgFIDE = "Movimiento legal OK."; drawChess();
                  if (modoPC && !turnoB) setTimeout(jugarPCNegras, 350);
                } else { sel = null; msgFIDE = "❌ Ilegal."; drawChess(); }
              }
            };
            bd.appendChild(btn);
          }
        }
        drawChess();
      }

      // 3. DOMINÓ PRO
      else if (juegoActivo === 'domino') {
        let fichas = [];
        for (let i=0; i<=6; i++) for (let j=i; j<=6; j++) fichas.push([i, j]);
        fichas = shuffleCrypto(fichas);
        let manoJug = fichas.slice(0, 7), manoPC = fichas.slice(7, 14), pozo = fichas.slice(14);
        let mesa = [[6, 6]], izq = 6, der = 6, msgD = "Mesa iniciada con [6|6]. Toca una ficha verde de tu mano.";

        function jugarTurnoPC() {
          manoPC.sort((a, b) => (b[0]+b[1]) - (a[0]+a[1]));
          for (let i=0; i<manoPC.length; i++) {
            const [a, b] = manoPC[i];
            if (a === izq) { mesa.unshift([b, a]); izq = b; manoPC.splice(i, 1); msgD = `🤖 PC jugó [${b}|${a}].`; return; }
            if (b === izq) { mesa.unshift([a, b]); izq = a; manoPC.splice(i, 1); msgD = `🤖 PC jugó [${a}|${b}].`; return; }
            if (a === der) { mesa.push([a, b]); der = b; manoPC.splice(i, 1); msgD = `🤖 PC jugó [${a}|${b}].`; return; }
            if (b === der) { mesa.push([b, a]); der = a; manoPC.splice(i, 1); msgD = `🤖 PC jugó [${b}|${a}].`; return; }
          }
          if (pozo.length > 0) { manoPC.push(pozo.pop()); msgD = "🤖 PC robó del pozo."; }
        }

        function drawDomino() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🁣 Dominó Doble-6 Pro vs IA Turing</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${manoJug.length===0?'🏆 ¡DOMINÓ! ¡GANASTE!':msgD}</p>
              <div style="background:#0b1322;border:2px solid #059669;border-radius:10px;padding:12px;min-height:70px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                ${mesa.map(f => `<span style="background:#f8fafc;color:#0f172a;padding:6px 9px;border-radius:6px;font-weight:900;font-size:13px;">${f[0]} | ${f[1]}</span>`).join('')}
              </div>
              <div id="dom-mano" style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div>
              <button id="dom-robar" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;">Robar del Pozo (${pozo.length}) / Pasar</button>
            </div>
          `;
          const mn = document.getElementById('dom-mano');
          manoJug.forEach((f, idx) => {
            const jugable = f[0]===izq || f[1]===izq || f[0]===der || f[1]===der;
            const b = document.createElement('button');
            b.style.cssText = `background:${jugable?'#064e3b':'#1e293b'};color:#fff;border:2px solid ${jugable?'#34d399':'#475569'};padding:10px 13px;border-radius:8px;font-weight:900;cursor:pointer;`;
            b.innerText = `[ ${f[0]} | ${f[1]} ]`;
            b.onclick = () => {
              const [a, c] = f;
              if (a === der) { mesa.push([a, c]); der = c; }
              else if (c === der) { mesa.push([c, a]); der = a; }
              else if (c === izq) { mesa.unshift([a, c]); izq = a; }
              else if (a === izq) { mesa.unshift([c, a]); izq = c; }
              else return;
              manoJug.splice(idx, 1); ganarXP(10); playSuccessSound();
              if (manoJug.length > 0) jugarTurnoPC();
              drawDomino();
            };
            mn.appendChild(b);
          });
          document.getElementById('dom-robar').onclick = () => {
            if (pozo.length > 0) manoJug.push(pozo.pop()); else jugarTurnoPC();
            drawDomino();
          };
        }
        drawDomino();
      }

      // 4. SOLITARIO DUAL
      else if (juegoActivo === 'solitario') {
        const palos = ['♠️','♥️','♦️','♣️'];
        let mazo = [];
        for (let v=1; v<=13; v++) palos.forEach(p => mazo.push({ v, p, nom: v===1?'A':(v===11?'J':(v===12?'Q':(v===13?'K':String(v)))) }));
        mazo = shuffleCrypto(mazo);
        let tablero = mazo.slice(0, 12), reserva = mazo.slice(12), selIdx = null, pts = 0, msgS = "Combina dos cartas que sumen 13 o toca una K (13).";
        function drawSol() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🃏 Solitario Matemático Suma-13</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${msgS} • Puntos: <b>${pts}</b></p>
              <div id="sol-grid" style="display:grid;grid-template-columns:repeat(4,74px);gap:8px;width:320px;margin:0 auto 12px;justify-content:center;"></div>
              <button id="sol-deal" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;">Repartir Reemplazos (${reserva.length})</button>
            </div>
          `;
          const g = document.getElementById('sol-grid');
          tablero.forEach((c, idx) => {
            const b = document.createElement('button');
            if (!c) { b.style.cssText = 'height:82px;border-radius:8px;border:1px dashed #334155;background:#060c17;color:#34d399;'; b.innerText = '✓'; }
            else {
              const rojo = c.p === '♥️' || c.p === '♦️';
              b.style.cssText = `height:82px;border-radius:8px;border:2px solid ${selIdx===idx?'#38bdf8':'#cbd5e1'};background:${selIdx===idx?'#bae6fd':'#ffffff'};color:${rojo?'#dc2626':'#0f172a'};font-weight:900;font-size:16px;cursor:pointer;`;
              b.innerHTML = `${c.nom}${c.p}<br><span style="font-size:10px;color:#475569;">Val: ${c.v}</span>`;
              b.onclick = () => {
                if (c.v === 13) { tablero[idx] = reserva.length ? reserva.pop() : null; pts += 20; selIdx = null; playSuccessSound(); drawSol(); return; }
                if (selIdx === null) { selIdx = idx; drawSol(); }
                else if (selIdx === idx) { selIdx = null; drawSol(); }
                else {
                  const pr = tablero[selIdx];
                  if (pr && pr.v + c.v === 13) {
                    tablero[selIdx] = reserva.length ? reserva.pop() : null;
                    tablero[idx] = reserva.length ? reserva.pop() : null;
                    pts += 30; selIdx = null; playSuccessSound();
                  } else { selIdx = null; playErrorSound(); }
                  drawSol();
                }
              };
            }
            g.appendChild(b);
          });
          document.getElementById('sol-deal').onclick = () => {
            if (reserva.length >= 4) { for (let i=0; i<4; i++) tablero[i] = reserva.pop(); selIdx = null; drawSol(); }
          };
        }
        drawSol();
      }

      // 5-13: RESTO DE JUEGOS COMPLETOS (DAMAS, 4 EN LÍNEA, RANAS, PUENTE, GATO, MEMORIA, BINARIA, VLSM, TURING)
      else if (juegoActivo === 'damas') {
        let tab = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => ((r + c) % 2 === 1 ? (r < 3 ? 'n' : (r > 4 ? 'b' : '')) : '')));
        let sel = null, turno = 'b';
        function movs(r, c) {
          const p = tab[r][c]; if (!p) return [];
          const dirs = (p==='B'||p==='N') ? [[-1,-1],[-1,1],[1,-1],[1,1]] : (p==='b' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]]);
          const res = [];
          dirs.forEach(([dr, dc]) => {
            const r1 = r+dr, c1 = c+dc;
            if (r1>=0 && r1<8 && c1>=0 && c1<8) {
              if (tab[r1][c1]==='') res.push({r2:r1,c2:c1,cap:null});
              else if (tab[r1][c1].toLowerCase()!==p.toLowerCase()) {
                const r2 = r+2*dr, c2 = c+2*dc;
                if (r2>=0 && r2<8 && c2>=0 && c2<8 && tab[r2][c2]==='') res.push({r2,c2,cap:{r:r1,c:c1}});
              }
            }
          });
          return res;
        }
        function drawD() {
          const leg = sel ? movs(sel.r, sel.c) : [];
          stg.innerHTML = `<div style="text-align:center;"><h3 style="margin:0 0 6px;color:#38bdf8;">🔴 Damas Españolas 8x8</h3><div id="dm-g" style="display:grid;grid-template-columns:repeat(8,42px);width:336px;margin:0 auto;border:3px solid #38bdf8;border-radius:8px;overflow:hidden;"></div></div>`;
          const g = document.getElementById('dm-g');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r+c)%2===1, p = tab[r][c], mp = leg.find(x=>x.r2===r && x.c2===c);
            const b = document.createElement('button');
            b.style.cssText = `width:42px;height:42px;border:none;background:${mp?'#059669':(osc?'#1e293b':'#cbd5e1')};display:flex;align-items:center;justify-content:center;cursor:pointer;`;
            if (p) b.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;background:${p.toLowerCase()==='b'?'#0ea5e9':'#ef4444'};border:2px solid #fff;"></span>`;
            b.onclick = () => {
              if (p && p.toLowerCase()===turno) { sel = {r,c}; drawD(); return; }
              if (sel && mp) {
                tab[mp.r2][mp.c2] = tab[sel.r][sel.c]; tab[sel.r][sel.c] = '';
                if (mp.cap) tab[mp.cap.r][mp.cap.c] = '';
                sel = null; drawD();
                setTimeout(() => {
                  let tds = [];
                  for (let rr=0; rr<8; rr++) for (let cc=0; cc<8; cc++) if (tab[rr][cc]==='n') movs(rr,cc).forEach(m=>tds.push({r1:rr,c1:cc,m}));
                  if (tds.length) { const x = tds[0]; tab[x.m.r2][x.m.c2]='n'; tab[x.r1][x.c1]=''; if (x.m.cap) tab[x.m.cap.r][x.m.cap.c]=''; }
                  drawD();
                }, 250);
              }
            };
            g.appendChild(b);
          }
        }
        drawD();
      }
      else if (juegoActivo === 'cuatro') {
        let g4 = Array(6).fill(null).map(() => Array(7).fill(0));
        function drawC4() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="margin:0 0 6px;color:#38bdf8;">🟡 Cuatro en Línea 7x6</h3><div id="c4-g" style="display:grid;grid-template-columns:repeat(7,42px);gap:6px;width:330px;margin:0 auto;background:#1e293b;padding:10px;border-radius:12px;"></div></div>`;
          const gd = document.getElementById('c4-g');
          for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
            const v = g4[r][c], b = document.createElement('button');
            b.style.cssText = `width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;background:${v===0?'#060c17':(v===1?'#0ea5e9':'#fbbf24')};`;
            b.onclick = () => {
              for (let rr=5; rr>=0; rr--) if (g4[rr][c]===0) { g4[rr][c]=1; break; }
              const disp = [3,2,4,1,5,0,6].filter(cl => g4[0][cl]===0);
              if (disp.length) { const pcCol = disp[Math.floor(Math.random()*disp.length)]; for (let rr=5; rr>=0; rr--) if (g4[rr][pcCol]===0) { g4[rr][pcCol]=2; break; } }
              drawC4();
            };
            gd.appendChild(b);
          }
        }
        drawC4();
      }
      else if (juegoActivo === 'ranas') {
        let ranas = ['G','G','G','_','Y','Y','Y'];
        function drawR() {
          stg.innerHTML = `<div style="text-align:center;padding:12px;"><h3 style="color:#34d399;">🐸 Cruza las Ranas</h3><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:18px 0;">${ranas.map((p,i)=>`<button data-i="${i}" class="brn" style="width:58px;height:58px;border-radius:10px;background:#131f33;color:#fff;font-size:20px;border:1px solid #38bdf8;cursor:pointer;">${p==='G'?'🐸➡':(p==='Y'?'⬅🐸':'🪨')}</button>`).join('')}</div></div>`;
          stg.querySelectorAll('.brn').forEach(b => {
            b.onclick = () => {
              const i = Number(b.getAttribute('data-i')), v = ranas.indexOf('_');
              if (ranas[i]==='G' && (v===i+1||v===i+2)) { ranas[v]='G'; ranas[i]='_'; drawR(); }
              else if (ranas[i]==='Y' && (v===i-1||v===i-2)) { ranas[v]='Y'; ranas[i]='_'; drawR(); }
            };
          });
        }
        drawR();
      }
      else if (juegoActivo === 'puente') {
        let exc = [{id:'1',t:1,l:'izq',n:'⚡ 1m'},{id:'2',t:2,l:'izq',n:'🏃 2m'},{id:'5',t:5,l:'izq',n:'🎒 5m'},{id:'10',t:10,l:'izq',n:'🦯 10m'}], lint='izq', t=0, sel=[];
        function drawP() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🔦 Puente en 17 Minutos (Tiempo: ${t}/17m)</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:420px;margin:10px auto;"><div><b>Izquierda</b>${exc.filter(e=>e.l==='izq').map(e=>`<button data-id="${e.id}" class="bpe" style="display:block;width:100%;margin-top:5px;padding:7px;background:${sel.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;border-radius:6px;">${e.n}</button>`).join('')}</div><div><b>Derecha</b>${exc.filter(e=>e.l==='der').map(e=>`<button data-id="${e.id}" class="bpe" style="display:block;width:100%;margin-top:5px;padding:7px;background:${sel.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;border-radius:6px;">${e.n}</button>`).join('')}</div></div><button id="bpgo" style="background:#059669;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:800;cursor:pointer;">Cruzar ➡</button></div>`;
          stg.querySelectorAll('.bpe').forEach(b => { b.onclick = () => { const id = b.getAttribute('data-id'); if (sel.includes(id)) sel=sel.filter(x=>x!==id); else if (sel.length<2) sel.push(id); drawP(); }; });
          document.getElementById('bpgo').onclick = () => { if (!sel.length) return; const g = exc.filter(e=>sel.includes(e.id)); t += Math.max(...g.map(x=>x.t)); lint = lint==='izq'?'der':'izq'; g.forEach(x=>x.l=lint); sel=[]; drawP(); };
        }
        drawP();
      }
      else if (juegoActivo === 'gato') {
        let t = Array(9).fill('');
        function drawG() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">❌ Ta-Te-Ti vs IA</h3><div id="gt-b" style="display:grid;grid-template-columns:repeat(3,68px);gap:8px;width:220px;margin:10px auto;"></div></div>`;
          const b = document.getElementById('gt-b');
          t.forEach((v, i) => {
            const bt = document.createElement('button');
            bt.style.cssText = 'height:68px;background:#0b1322;border:2px solid #334155;border-radius:8px;color:#38bdf8;font-size:26px;font-weight:900;cursor:pointer;';
            bt.innerText = v;
            bt.onclick = () => {
              if (t[i]) return; t[i] = 'X';
              const vac = t.map((x,ix)=>x===''?ix:-1).filter(x=>x!==-1);
              if (vac.length) t[vac[Math.floor(Math.random()*vac.length)]] = 'O';
              drawG();
            };
            b.appendChild(bt);
          });
        }
        drawG();
      }
      else if (juegoActivo === 'memoria') {
        const terminos = shuffleCrypto(['HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL','HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL']);
        let barajas = terminos.map((t, idx) => ({ id: idx, val: t, volteada: false, encontrada: false })), primerSel = null, lock = false;
        function drawM() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🧠 Memoria Técnica 4x4</h3><div id="mm-g" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:340px;margin:10px auto;"></div></div>`;
          const g = document.getElementById('mm-g');
          barajas.forEach((c, idx) => {
            const b = document.createElement('button');
            b.style.cssText = `height:52px;background:${c.encontrada?'#064e3b':(c.volteada?'#0284c7':'#131f33')};color:#fff;border:1px solid #334155;border-radius:8px;font-weight:800;cursor:pointer;`;
            b.innerText = (c.volteada||c.encontrada) ? c.val : '❓';
            b.onclick = () => {
              if (lock||c.volteada||c.encontrada) return;
              c.volteada = true; drawM();
              if (!primerSel) primerSel = {idx, val: c.val};
              else {
                lock = true;
                if (primerSel.val === c.val) { barajas[primerSel.idx].encontrada=true; c.encontrada=true; primerSel=null; lock=false; playSuccessSound(); drawM(); }
                else setTimeout(()=>{ barajas[primerSel.idx].volteada=false; c.volteada=false; primerSel=null; lock=false; drawM(); }, 650);
              }
            };
            g.appendChild(b);
          });
        }
        drawM();
      }
      else if (juegoActivo === 'adivina') {
        const sec = shuffleCrypto(Array.from({length:100},(_,i)=>i+1))[0];
        let min = 1, max = 100;
        function drawA() {
          stg.innerHTML = `<div style="text-align:center;padding:16px;"><h3 style="color:#38bdf8;">🔢 Búsqueda Binaria [ ${min} — ${max} ]</h3><input id="adi" type="number" value="${Math.floor((min+max)/2)}" style="background:#0b1322;color:#fff;border:1px solid #38bdf8;padding:8px;border-radius:6px;width:90px;text-align:center;"/><button id="adb" style="background:#0284c7;color:#fff;border:none;padding:9px 14px;border-radius:6px;margin-left:6px;font-weight:800;cursor:pointer;">Probar</button></div>`;
          document.getElementById('adb').onclick = () => {
            const v = Number(document.getElementById('adi').value);
            if (v === sec) { playSuccessSound(); alert('🎯 ¡Exacto! El número era ' + sec); }
            else if (v < sec) min = v + 1; else max = v - 1;
            drawA();
          };
        }
        drawA();
      }
      else if (juegoActivo === 'subnet') {
        const pref = shuffleCrypto([25,26,27,28,29,30])[0], utiles = Math.pow(2, 32-pref) - 2;
        const opts = shuffleCrypto([utiles, utiles+2, utiles*2, Math.floor(utiles/2)]);
        stg.innerHTML = `<div style="text-align:center;padding:14px;"><h3 style="color:#38bdf8;">🌐 Reto VLSM: Red 192.168.1.0/${pref}</h3><p>¿Cuántas IPs utilizables para hosts tiene?</p><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">${opts.map(o=>`<button onclick="if(${o}===${utiles}){this.style.background='#064e3b';this.innerText='✅ '+${o};}else{this.style.background='#7f1d1d';}" style="background:#131f33;color:#fff;border:1px solid #334155;padding:10px 16px;border-radius:8px;font-weight:800;cursor:pointer;">${o} IPs</button>`).join('')}</div></div>`;
      }
      else if (juegoActivo === 'cosevi') {
        stg.innerHTML = `<div style="text-align:center;padding:16px;"><h3 style="color:#38bdf8;">🔐 Rotor Enigma de Alan Turing</h3><input id="ti" value="PRACTICATECNICA" style="background:#0b1322;color:#fff;border:1px solid #38bdf8;padding:8px;border-radius:6px;"/><div id="to" style="margin-top:10px;color:#34d399;font-family:monospace;font-weight:800;">CENPGVPNGRPUAVPN</div></div>`;
        document.getElementById('ti').oninput = (e) => {
          document.getElementById('to').innerText = e.target.value.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(((c.charCodeAt(0)-65+13)%26)+65));
        };
      }
    }

    pintarSelectorYJuego();
  }

  // ============================================================================
  // SIMULADOR VIAL 2D EN CANVAS REAL
  // ============================================================================
  function renderSimuladorVial2D(contenedor) {
    let puntos = 100, vel = 0, x = 260, y = 265, ang = 0;
    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;text-align:center;">
        <h3 style="margin:0 0 6px;color:#38bdf8;">🚗 Simulador Vial 2D COSEVI (Rotonda Multi-Carril & Controles Táctiles)</h3>
        <div id="sv-hud" style="font-size:12.5px;font-weight:800;color:#34d399;margin-bottom:8px;">Puntos COSEVI: 100/100 • Velocidad: 0 km/h • Circulación Antihoraria</div>
        <canvas id="sv-canvas" width="520" height="320" style="max-width:100%;background:#064e3b;border:3px solid #334155;border-radius:12px;touch-action:none;"></canvas>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button id="sv-left" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">⬅️ Giro Izq</button>
          <button id="sv-up" style="background:#059669;color:#fff;border:none;padding:11px 18px;border-radius:8px;font-weight:900;cursor:pointer;">⬆️ Avanzar</button>
          <button id="sv-down" style="background:#7f1d1d;color:#fff;border:none;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">⬇️ Retroceder</button>
          <button id="sv-right" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;">➡️ Giro Der</button>
          <button id="sv-rst" style="background:#0284c7;color:#fff;border:none;padding:11px 14px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Reiniciar</button>
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
      if (nx>15 && nx<505 && ny>15 && ny<305 && ((ny>=122&&ny<=198) || (nx>=222&&nx<=298) || (d>=52&&d<=110))) {
        x = nx; y = ny; hud.innerText = `✅ Puntos COSEVI: ${puntos}/100 • En carril reglamentario`;
      } else { puntos = Math.max(0, puntos-2); hud.innerText = `⚠️ Borde de calzada detectado (-2 pts). Puntos: ${puntos}/100`; }
      dibujar();
    }
    document.getElementById('sv-up').onclick = () => mover(12, 0);
    document.getElementById('sv-down').onclick = () => mover(-8, 0);
    document.getElementById('sv-left').onclick = () => mover(4, -0.35);
    document.getElementById('sv-right').onclick = () => mover(4, 0.35);
    document.getElementById('sv-rst').onclick = () => { x=260; y=265; ang=0; puntos=100; dibujar(); };
    dibujar();
  }

  // ============================================================================
  // EMULADOR EXCEL (SIN CERO PEGADO) & CONSOLA CLI
  // ============================================================================
  function renderEmuladores(contenedor) {
    contenedor.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
        <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;padding:16px;">
          <h3 style="margin:0 0 6px;color:#34d399;">📊 Simulador Excel / Contabilidad (Sin Cero Pegado)</h3>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Borra o edita cualquier celda libremente sin que se trabe el número cero:</p>
          <div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;margin-bottom:10px;font-size:12px;">
            <div style="font-weight:800;color:#38bdf8;">Celda</div><div style="font-weight:800;color:#38bdf8;">Cuenta</div><div style="font-weight:800;color:#38bdf8;">Monto (₡)</div>
            <div>A1</div><input value="Ventas Gravadas" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="150000" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
            <div>A2</div><input value="Servicios Web" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="85000" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
            <div>A3</div><input value="Soporte Redes" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="" placeholder="Escribe monto..." style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
          </div>
          <div id="ex-res" style="background:#060c17;padding:10px;border-radius:8px;font-family:monospace;color:#34d399;font-size:12.5px;font-weight:800;">=SUMA(C1:C3): ₡235,000 | IVA 13%: ₡30,550</div>
        </div>
        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;">
          <h3 style="margin:0 0 6px;color:#38bdf8;">💻 Consola CLI Ciberseguridad & Redes</h3>
          <div id="cli-out" style="background:#060c17;border:1px solid #1e293b;border-radius:8px;padding:10px;height:140px;overflow-y:auto;font-family:monospace;font-size:11.5px;color:#34d399;margin-bottom:8px;">[SICAI-OS v148.0] Escribe: help, vlsm, nmap o sha256</div>
          <div style="display:flex;gap:6px;">
            <input id="cli-in" type="text" placeholder="Comando..." style="flex:1;background:#060c17;border:1px solid #38bdf8;color:#fff;padding:8px;border-radius:6px;font-family:monospace;"/>
            <button id="cli-run" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Ejecutar</button>
          </div>
        </div>
      </div>
    `;
    contenedor.querySelectorAll('.ex-val').forEach(i => {
      i.oninput = () => {
        let s = 0; contenedor.querySelectorAll('.ex-val').forEach(el => { const n = parseFloat(el.value.replace(/,/g,'')); if (!isNaN(n)) s += n; });
        document.getElementById('ex-res').innerText = `=SUMA(C1:C3): ₡${s.toLocaleString('es-CR')} | IVA 13%: ₡${Math.round(s*0.13).toLocaleString('es-CR')}`;
      };
    });
    document.getElementById('cli-run').onclick = async () => {
      const cmd = document.getElementById('cli-in').value.trim().toLowerCase();
      const out = document.getElementById('cli-out');
      let r = "OK";
      if (cmd === 'vlsm') r = "/24=254h | /25=126h | /26=62h | /27=30h | /28=14h | /29=6h | /30=2h";
      else if (cmd === 'nmap') r = "PORT 443/tcp OPEN (TLS 1.3)";
      else r = await sha256Hex(cmd);
      out.innerHTML += `<div><span style="color:#38bdf8;">$ ${cmd}</span><br>${r}</div>`;
    };
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

    if (vista === 'ruleta') { renderRuletaDelSaberUniversal(shell); window.scrollTo(0, 0); return; }
    if (vista === 'juegos') { renderSala13Juegos(shell, param || 'ajedrez'); window.scrollTo(0, 0); return; }
    if (vista === 'vial') { renderSimuladorVial2D(shell); window.scrollTo(0, 0); return; }
    if (vista === 'emulador') { renderEmuladores(shell); window.scrollTo(0, 0); return; }
    if (vista === 'landing_base') { document.body.classList.add('bds-ver-landing-base'); return; }

    if (vista === 'gestion') {
      const s = getSesion();
      shell.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;">
          <div class="bds-card-pro">
            <div>
              <h3 style="margin:0 0 6px;color:#38bdf8;">📋 Permisos y Tardías (Personal)</h3>
              <input value="${s.nombre} (${s.rol})" readonly style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;"/>
              <select style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;">
                <option>Cita Médica CCSS / INS</option>
                <option>Permiso Oficial ante Dirección</option>
              </select>
            </div>
            <button onclick="this.innerText='✅ Boleta Firmada con SHA-256';" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:7px;font-weight:800;cursor:pointer;">Emitir Boleta Oficial</button>
          </div>
          <div class="bds-card-pro" style="text-align:center;">
            <h3 style="margin:0 0 6px;color:#fbbf24;">📱 Carné Institucional QR SHA-256</h3>
            <div style="font-size:13px;font-weight:800;color:#fff;">${s.nombre}</div>
            <div style="font-size:11px;color:#38bdf8;margin-bottom:8px;">${s.rol} • ${s.seccion}</div>
            <div style="background:#fff;padding:8px;display:inline-block;border-radius:8px;margin:0 auto 6px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(s.firmaSha256)}" width="110" height="110" alt="QR"/>
            </div>
            <div style="font-size:9px;font-family:monospace;color:#34d399;word-break:break-all;">SHA-256: ${s.firmaSha256.slice(0,32)}...</div>
          </div>
        </div>
      `;
      return;
    }

    // VISTA DE INICIO: PANEL PRINCIPAL CON ACCESO DIRECTO A LA RULETA DEL SABER Y TODOS LOS BLOQUES
    const itemsBanco = obtenerBancoRuleta();
    const xpObj = getXP();
    shell.innerHTML = `
      <div style="background:linear-gradient(135deg,#1e1b4b 0%,#0b1322 100%);border:1.5px solid #6366f1;border-radius:16px;padding:16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${SVG_BUHO_ORIGINAL}" width="48" height="48" alt="Búho Azul Original"/>
          <div>
            <span style="background:#10b981;color:#022c22;font-size:10px;font-weight:900;padding:3px 8px;border-radius:5px;">RANGO: ${xpObj.nivel.toUpperCase()}</span>
            <h2 style="margin:4px 0 2px;font-size:18px;color:#fff;">¡Bienvenido a pracTICAtecnica.com — Ecosistema CTP Mercedes Norte!</h2>
            <p style="margin:0;font-size:12px;color:#cbd5e1;">Gira la <b>Ruleta del Saber</b> en todas las materias, entrena para la <b>Prueba MOPT</b>, domina <b>Excel</b> o juega <b>Ajedrez FIDE, Dominó y Solitario</b>.</p>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button onclick="navegarVista('ruleta')" style="background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;padding:10px 16px;border-radius:10px;font-size:12.5px;font-weight:900;cursor:pointer;box-shadow:0 4px 14px rgba(79,70,229,0.5);">🎡 Abrir Ruleta del Saber (${itemsBanco.length} Ítems)</button>
          <button onclick="navegarVista('juegos','ajedrez')" style="background:#0284c7;color:#fff;border:none;padding:10px 14px;border-radius:10px;font-size:12.5px;font-weight:900;cursor:pointer;">♟️ Ajedrez & 13 Juegos</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:12px;">
        ${RULETA_SECTORES.map(sec => {
          const count = itemsBanco.filter(i => i.subject === sec.id).length;
          return `
            <div class="bds-card-pro" style="border-top:4px solid ${sec.color};">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="background:${sec.color};color:#fff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:99px;">${sec.short}</span>
                  <span style="font-size:11px;color:#38bdf8;font-weight:800;">${count} preguntas</span>
                </div>
                <h3 style="margin:0 0 6px;font-size:15.5px;color:#fff;">${sec.name}</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;line-height:1.45;">Incluye jerarquía MEP (Especialidad > Subárea > Nivel > Unidad), modo ruleta con tiempo y explicación paso a paso.</p>
              </div>
              <button onclick="navegarVista('ruleta')" style="width:100%;background:#131f33;color:#fff;border:1px solid ${sec.color};padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                🎡 Jugar en la Ruleta del Saber →
              </button>
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
    const s = getSesion();
    const drw = document.createElement('div');
    drw.id = 'bds-slide-drawer';
    drw.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,0.88);z-index:200000;display:flex;justify-content:flex-start;';
    drw.innerHTML = `
      <div style="width:310px;max-width:86vw;background:#0b1322;border-right:2px solid #0284c7;height:100%;padding:16px;box-sizing:border-box;overflow-y:auto;display:flex;flex-direction:column;gap:7px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;">
          <b style="color:#38bdf8;font-size:14.5px;">☰ Menú pracTICAtecnica</b>
          <button id="drw-close" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:800;">Cerrar ✕</button>
        </div>
        <button class="drw-it" data-v="ruleta" style="text-align:left;background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;padding:11px;border-radius:8px;font-weight:900;cursor:pointer;">🎡 Ruleta del Saber & Banco MEP</button>
        <button class="drw-it" data-v="inicio" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🏠 Panel de 10 Áreas y Especialidades</button>
        <button class="drw-it" data-v="juegos" data-p="ajedrez" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">♟️ Ajedrez FIDE (Intacto)</button>
        <button class="drw-it" data-v="juegos" data-p="domino" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🁣 Dominó Doble-6 Pro</button>
        <button class="drw-it" data-v="juegos" data-p="solitario" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🃏 Solitario Matemático</button>
        <button class="drw-it" data-v="vial" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🚗 Simulador Vial 2D COSEVI</button>
        <button class="drw-it" data-v="emulador" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📊 Simulador Excel & Consola CLI</button>
        <button class="drw-it" data-v="gestion" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📋 Permisos y Carné QR SHA-256</button>
        <button id="drw-logout" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">🚪 Cerrar Sesión Segura</button>
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
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho Azul" style="height:34px;width:34px;"/>
        <div>
          <div style="font-size:13.5px;font-weight:900;color:#fff;display:flex;align-items:center;gap:5px;">
            <span>prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</span>
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:9px;font-weight:900;padding:2px 5px;border-radius:4px;">SUPERADMIN</span>` : ''}
          </div>
          <div style="font-size:10px;color:#38bdf8;">
            <b>${s.nombre}</b> • ${s.rol}
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span id="bds-xp-counter" style="background:#131f33;border:1px solid #fbbf24;color:#fbbf24;padding:5px 9px;border-radius:7px;font-size:11px;font-weight:800;">🔥 ${xpObj.racha}d | ⚡ ${xpObj.xp} XP</span>
        <button id="btn-top-ruleta" style="background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;padding:8px 11px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;">🎡 Ruleta del Saber</button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 10px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const NAV_ITEMS = [
      { v: 'ruleta', label: '🎡 1. Ruleta del Saber & Banco MEP' },
      { v: 'inicio', label: '🏠 2. Todas las Materias y Especialidades' },
      { v: 'juegos', label: '🎮 3. 13 Juegos (Ajedrez, Dominó, Solitario)' },
      { v: 'vial', label: '🚗 4. Simulador Vial 2D' },
      { v: 'emulador', label: '📊 5. Simulador Excel & CLI' },
      { v: 'gestion', label: '📋 6. Permisos & Carné QR' }
    ];
    sub.innerHTML = NAV_ITEMS.map(m => `<button data-vista="${m.v}" class="bds-subnav-item">${m.label}</button>`).join('');

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    const dock = document.createElement('nav');
    dock.id = 'bds-mobile-dock';
    dock.innerHTML = `
      <button class="bds-dock-btn active" data-vista="ruleta"><span style="font-size:17px;">🎡</span><span>Ruleta</span></button>
      <button class="bds-dock-btn" data-vista="inicio"><span style="font-size:17px;">📚</span><span>Materias</span></button>
      <button class="bds-dock-btn" data-vista="juegos"><span style="font-size:17px;">🎮</span><span>13 Juegos</span></button>
      <button class="bds-dock-btn" data-vista="vial"><span style="font-size:17px;">🚗</span><span>Vial 2D</span></button>
      <button class="bds-dock-btn" id="dock-menu-more"><span style="font-size:17px;">☰</span><span>Menú</span></button>
    `;

    document.body.prepend(shell);
    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(dock);

    document.getElementById('btn-hamburger-pro').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('dock-menu-more').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('btn-top-ruleta').onclick = () => navegarVista('ruleta');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('[data-vista]').forEach(b => {
      b.onclick = () => navegarVista(b.getAttribute('data-vista'));
    });

    iniciarObservadorSoberano();
    navegarVista('ruleta', null, true);
  }

  window.abrirCentroMaestroBDS = function (mod, sub) { navegarVista(mod || 'ruleta', sub); };
  window.abrirSalaJuegosHD = function (juego) { navegarVista('juegos', juego || 'ajedrez'); };

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else cerrarSesionTotal();
  });
})();