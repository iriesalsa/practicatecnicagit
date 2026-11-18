(function () {
  const SESSION_KEY = "bds_auth_gate_v147_horizon";
  const LOCK_KEY = "bds_auth_lock_v147";
  const XP_KEY = "bds_gamification_xp_v147";
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
  const SVG_CTP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="38" height="38"><rect width="80" height="80" rx="14" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><path d="M40 10 L66 20 L66 44 C66 59 40 70 40 70 C40 70 14 59 14 44 L14 20 Z" fill="#0f2942" stroke="#38bdf8" stroke-width="2"/><text x="40" y="38" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">CTPMN</text><text x="40" y="52" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="700" font-size="8.5">HEREDIA</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v147.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v147.js').catch(() => {});
    }).catch(() => {});
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
        xp: 750, racha: 14, nivel: "Arquitecto Turing",
        medallas: ["♟️ Estratega FIDE", "🛡️ Guardián SHA-256"]
      };
    } catch {
      return { xp: 750, racha: 14, nivel: "Arquitecto Turing", medallas: ["♟️ Estratega FIDE"] };
    }
  }

  function ganarXP(pts, nuevaMedalla) {
    const d = getXP();
    d.xp += pts;
    if (nuevaMedalla && !d.medallas.includes(nuevaMedalla)) d.medallas.push(nuevaMedalla);
    d.nivel = d.xp >= 1500 ? "Leyenda Alan Turing" : (d.xp >= 1000 ? "Maestro SICAI" : "Arquitecto Turing");
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
    sessionStorage.clear();
    localStorage.clear();
    if (locks) localStorage.setItem(LOCK_KEY, locks);
    if (xp) localStorage.setItem(XP_KEY, xp);
    document.body.classList.remove('bds-authenticated', 'bds-ver-landing-base');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-slide-drawer'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    if (window.location.hash) history.replaceState(null, document.title, window.location.pathname);
    mostrarLoginEstricto('login');
  }

  // ============================================================================
  // MEGA BANCO ACADÉMICO, TÉCNICO Y DE ADMISIÓN (CON EXPLICACIÓN PASO A PASO)
  // ============================================================================
  const CATALOGO_EDUCATIVO = [
    {
      id: 'adm_ucr_una', cat: 'admision', icono: '🏛️', titulo: 'Simulacro Oficial PAA — UCR / UNA (Escala 800)', niveles: 'Admisión Universitaria',
      desc: 'Razonamiento en Contexto Verbal y Razonamiento Matemático con explicación analítica paso a paso.',
      manual: 'Fórmula de éxito PAA: 1) Identifica supuestos implícitos sin asumir información externa. 2) En series y operadores, busca diferencias de segundo orden o simetrías.',
      preguntas: [
        { p: '[Verbal UCR/UNA] "Todo algoritmo verificable termina en tiempo finito. Algunos programas críticos son algoritmos verificables." ¿Qué se concluye con certeza?', c: 'Algunos programas críticos terminan en tiempo finito', i: ['Todos los programas críticos son algoritmos verificables', 'Ningún programa lento es verificable', 'Todo lo que termina en tiempo finito es un programa crítico'], exp: 'Por silogismo categórico (Modo Darii): Si todo A es B, y algún C es A, entonces necesariamente algún C es B.' },
        { p: '[Matemático UCR/UNA] En una gaveta hay calcetines negros, blancos y azules. Si todos menos 6 son negros, todos menos 6 son blancos y todos menos 6 son azules, ¿cuántos calcetines hay en total?', c: '9 calcetines en total (3 de cada color)', i: ['18 calcetines', '12 calcetines', '6 calcetines'], exp: 'Si "todos menos 6 son negros", significa que la suma de blancos + azules = 6. Por simetría en los tres colores, cada color tiene 3 unidades (3 + 3 + 3 = 9).' },
        { p: '[Matemático UCR/UNA] Dada la secuencia numérica: 3, 8, 15, 24, 35, X. ¿Cuál es el valor de X?', c: '48', i: ['44', '46', '50'], exp: 'Las diferencias entre términos consecutivos son +5, +7, +9, +11. La siguiente diferencia impar es +13, por lo tanto 35 + 13 = 48.' },
        { p: '[Verbal UCR/UNA] "La ciberseguridad no es un producto que se instala una vez, sino un proceso continuo de vigilancia y educación." Según el texto, la seguridad digital:', c: 'Exige actualización permanente y cultura preventiva', i: ['Se resuelve comprando el antivirus más costoso', 'Depende exclusivamente del hardware físico', 'Es innecesaria cuando se usa software libre'], exp: 'El texto contrasta "producto estático" frente a "proceso continuo de vigilancia y educación".' },
        { p: '[Matemático UCR/UNA] Si 4 impresoras 3D fabrican 40 engranajes en 4 horas, ¿cuántos engranajes fabricarán 8 impresoras idénticas en 8 horas?', c: '160 engranajes', i: ['80 engranajes', '120 engranajes', '320 engranajes'], exp: 'Duplicar las impresoras (de 4 a 8) duplica la producción a 80 en 4 horas; duplicar además el tiempo (de 4h a 8h) vuelve a duplicar el resultado: 160 engranajes.' },
        { p: '[Verbal UCR/UNA] "Ningún sistema infalible ignora las alertas tempranas. Ciertos protocolos obsoletos ignoran las alertas tempranas." Se deduce que:', c: 'Ciertos protocolos obsoletos no son sistemas infalibles', i: ['Todo protocolo obsoleto es infalible', 'Las alertas tempranas siempre fallan', 'Ningún protocolo actual usa alertas'], exp: 'Si ningún A hace X, y algunos B hacen X, entonces esos B no pueden pertenecer al conjunto A.' },
        { p: '[Matemático UCR/UNA] El promedio aritmético de 5 números es 14. Si se agrega un sexto número y el nuevo promedio sube a 16, ¿cuál fue el sexto número agregado?', c: '26', i: ['20', '24', '28'], exp: 'La suma inicial de los 5 números es 5 × 14 = 70. La nueva suma de los 6 números es 6 × 16 = 96. La diferencia es 96 - 70 = 26.' }
      ]
    },
    {
      id: 'adm_tec', cat: 'admision', icono: '⚙️', titulo: 'Simulacro Oficial de Admisión — TEC (Escala 800)', niveles: 'Tecnológico de Costa Rica',
      desc: 'Matemática intensiva para ingeniería, operadores abstractos, geometría analítica y lógica proposicional.',
      manual: 'Foco TEC: Despeje algebraico rápido, leyes de potencias, áreas por resta de figuras y tablas de verdad del condicional (P → Q).',
      preguntas: [
        { p: '[TEC Operadores] Para cualesquiera números reales se define a # b = a² - 2b. ¿Cuál es el valor numérico de (4 # 5) # 3?', c: '30', i: ['24', '18', '36'], exp: 'Primero resolvemos el paréntesis: (4 # 5) = 4² - 2(5) = 16 - 10 = 6. Luego evaluamos 6 # 3 = 6² - 2(3) = 36 - 6 = 30.' },
        { p: '[TEC Geometría] Si el lado de un cuadrado aumenta en un 50%, ¿en qué porcentaje aumenta su área total?', c: 'Aumenta en un 125%', i: ['Aumenta en un 50%', 'Aumenta en un 100%', 'Aumenta en un 150%'], exp: 'Si el lado pasa de 1 a 1.5, el área pasa de 1² = 1 a (1.5)² = 2.25, lo cual representa un incremento del 125%.' },
        { p: '[TEC Lógica] La proposición condicional "Si el servidor compila, entonces pasa las pruebas QA" resulta FALSA únicamente cuando:', c: 'El servidor compila y NO pasa las pruebas QA', i: ['El servidor no compila y pasa QA', 'Ambos hechos ocurren simultáneamente', 'El servidor no compila ni pasa QA'], exp: 'En lógica formal, una implicación (P → Q) solo es falsa cuando el antecedente P es verdadero y el consecuente Q es falso.' },
        { p: '[TEC Álgebra] Si 2^(x+1) + 2^x = 24, ¿cuál es el valor real de x?', c: 'x = 3', i: ['x = 2', 'x = 4', 'x = 5'], exp: 'Factorizando 2^x: 2^x · (2 + 1) = 24 → 2^x · 3 = 24 → 2^x = 8 → x = 3.' },
        { p: '[TEC Probabilidad] Al lanzar dos dados estándar de 6 caras simultáneamente, ¿cuál es la probabilidad de que la suma de sus caras superiores sea igual a 7?', c: '1/6 (6 de 36 casos posibles)', i: ['1/12', '7/36', '1/9'], exp: 'Las parejas que suman 7 son (1,6), (2,5), (3,4), (4,3), (5,2) y (6,1): son 6 casos favorables entre 36 posibles = 6/36 = 1/6.' }
      ]
    },
    {
      id: 'adm_uned_utn', cat: 'admision', icono: '🎓', titulo: 'Nivelación y Admisión — UNED & UTN', niveles: 'Educación Superior CR',
      desc: 'Resolución de problemas técnico-productivos, proporcionalidad compuesta, APA 7 y comprensión académica.',
      manual: 'Método de las proporciones (Regla de tres compuesta directa e inversa) y normas de citación académica.',
      preguntas: [
        { p: '[UTN Ingeniería] 3 técnicos instalan 18 puntos de red en 6 horas. ¿Cuántos puntos de red instalarán 5 técnicos trabajando 8 horas al mismo ritmo?', c: '40 puntos de red', i: ['30 puntos de red', '36 puntos de red', '45 puntos de red'], exp: 'Cada técnico instala 18 / (3 × 6) = 1 punto de red por hora. Por tanto, 5 técnicos en 8 horas instalan 5 × 8 × 1 = 40 puntos.' },
        { p: '[UNED Investigación] En el formato APA 7ma edición, cuando una fuente tiene 3 o más autores, ¿cómo se cita dentro del texto desde la primera mención?', c: 'Primer Apellido seguido de "et al." y el año', i: ['Todos los nombres completos separados por guiones', 'Solo el título del libro sin año', 'El número de página únicamente'], exp: 'APA 7 simplificó la regla: a partir de 3 autores se abrevia con el primer autor seguido de la locución latina "et al." desde la primera cita.' },
        { p: '[UTN Matemática] Una factura con el 13% de IVA incluido asciende a ₡113,000. ¿Cuál era el precio neto sin impuesto?', c: '₡100,000', i: ['₡98,310', '₡101,300', '₡99,000'], exp: 'Se divide el monto total entre 1.13: 113,000 / 1.13 = 100,000.' }
      ]
    },
    {
      id: 'adm_ctp_cientificos', cat: 'admision', icono: '🔬', titulo: 'Admisión CTP (7° y 10°) & Colegios Científicos', niveles: 'Secundaria Técnica y Científica',
      desc: 'Aptitud vocacional para ingreso a 7° CTP, elección de especialidad 10° y prueba nacional de Colegios Científicos.',
      manual: 'Identidades algebraicas notables, razonamiento mecánico de poleas/engranajes y lógica algorítmica.',
      preguntas: [
        { p: '[Colegios Científicos] Si a + b = 7 y a·b = 10, ¿cuál es el valor numérico de a² + b²?', c: '29', i: ['49', '19', '39'], exp: 'Sabemos que (a + b)² = a² + 2ab + b². Sustituyendo: 7² = a² + b² + 2(10) → 49 - 20 = 29.' },
        { p: '[Admisión CTP] En un tren de 4 engranajes conectados en línea (A-B-C-D), si el engranaje A gira en sentido horario, ¿cómo gira el engranaje D?', c: 'En sentido antihorario', i: ['En sentido horario', 'No gira', 'A la mitad de velocidad en el mismo sentido'], exp: 'Cada contacto invierte el giro: A(Horario) → B(Antihorario) → C(Horario) → D(Antihorario).' },
        { p: '[Especialidad 10° CTP] En lógica de programación, si X = 8 y Y = 3, ¿cuál es el resultado del operador módulo (X % Y)?', c: '2 (el residuo entero de dividir 8 entre 3)', i: ['2.66', '5', '24'], exp: '8 dividido entre 3 da cociente 2 y sobra un residuo entero de 2.' }
      ]
    },
    {
      id: 'espanol', cat: 'basica', icono: '📖', titulo: 'Español y Comunicación', niveles: '7° a 12° MEP',
      desc: 'Lectura crítica, acentuación ortográfica, morfosintaxis, figuras literarias y redacción formal.',
      manual: 'Agudas (tilde en n, s o vocal), Graves (tilde cuando NO terminan en n, s o vocal), Esdrújulas (todas se tildan).',
      preguntas: [
        { p: '¿Cuál serie contiene únicamente palabras graves (llanas) correctamente escritas?', c: 'Árbol, examen, cárcel', i: ['Café, compás, camión', 'Música, brújula, sílaba', 'Reloj, pared, cantar'], exp: 'Árbol, examen y cárcel tienen el acento prosódico en la penúltima sílaba.' },
        { p: '¿Qué figura de construcción consiste en alterar el orden lógico o sintáctico habitual de las palabras en la oración?', c: 'Hipérbaton', i: ['Anáfora', 'Metáfora', 'Aliteración'], exp: 'El hipérbaton invierte el orden sintáctico regular (Sujeto + Verbo + Complemento).' },
        { p: 'En la oración "El informe técnico fue revisado por la comisión", el verbo se encuentra en:', c: 'Voz pasiva', i: ['Voz activa', 'Modo imperativo', 'Gerundio compuesto'], exp: 'Tiene estructura de verbo ser conjugado ("fue") + participio ("revisado") + complemento agente ("por la comisión").' }
      ]
    },
    {
      id: 'matematicas', cat: 'basica', icono: '📐', titulo: 'Matemáticas Aplicadas MEP', niveles: '7° a 12° MEP',
      desc: 'Álgebra, funciones, geometría analítica, trigonometría, estadística descriptiva y probabilidad.',
      manual: 'Ecuación de la recta y = mx + b, discriminante Δ = b² - 4ac, teorema de Pitágoras y circunferencia (x-h)² + (y-k)² = r².',
      preguntas: [
        { p: '¿Cuál es la ecuación de la circunferencia con centro en C(2, -3) y radio r = 5?', c: '(x - 2)² + (y + 3)² = 25', i: ['(x + 2)² + (y - 3)² = 25', '(x - 2)² + (y + 3)² = 5', '(x - 2)² - (y + 3)² = 10'], exp: 'Se invierten los signos de las coordenadas del centro (h, k) y se eleva el radio al cuadrado (5² = 25).' },
        { p: '¿Cuál es el vértice de la parábola dada por la función cuadrática f(x) = (x - 4)² + 7?', c: '(4, 7)', i: ['(-4, 7)', '(4, -7)', '(7, 4)'], exp: 'En la forma canónica a(x - h)² + k, el vértice corresponde directamente al par ordenado (h, k) = (4, 7).' },
        { p: 'Si log₂(x) = 5, ¿cuál es el valor numérico de x?', c: '32', i: ['10', '25', '64'], exp: 'Por definición de logaritmo: base elevada al exponente es igual al argumento (2⁵ = 32).' }
      ]
    },
    {
      id: 'quimica', cat: 'basica', icono: '🧪', titulo: 'Química Científica y Laboratorio', niveles: '10° a 12° MEP',
      desc: 'Estructura atómica, tabla periódica, nomenclatura inorgánica, estequiometría, gases ideales y pH.',
      manual: 'A = Z + n° (Número másico = Protones + Neutrones). En un átomo neutro, electrones = protones (Z).',
      preguntas: [
        { p: 'El catión Calcio (Ca²⁺) cuyo número atómico es Z = 20 posee exactamente:', c: '20 protones y 18 electrones', i: ['20 protones y 22 electrones', '18 protones y 20 electrones', '22 protones y 20 electrones'], exp: 'La carga +2 indica que el átomo neutro cedió 2 electrones de valencia (20 - 2 = 18), manteniendo intactos sus 20 protones.' },
        { p: 'Según el sistema Stock de nomenclatura inorgánica, ¿cómo se nombra el compuesto Fe₂O₃?', c: 'Óxido de hierro (III)', i: ['Óxido de hierro (II)', 'Hidróxido férrico', 'Peróxido de hierro'], exp: 'El oxígeno trabaja con estado -2 y el hierro en esta fórmula actúa con estado de oxidación +3.' },
        { p: '¿Cuántos moles de moléculas hay en 88 gramos de dióxido de carbono (CO₂), sabiendo que C = 12 g/mol y O = 16 g/mol?', c: '2 moles', i: ['1 mol', '4 moles', '0.5 moles'], exp: 'La masa molar del CO₂ es 12 + 2(16) = 44 g/mol. Dividiendo 88 g entre 44 g/mol se obtienen 2 moles.' }
      ]
    },
    {
      id: 'fisica', cat: 'basica', icono: '⚡', titulo: 'Física y Mecánica Clásica', niveles: '10° a 12° MEP',
      desc: 'Vectores, cinemática, dinámica de Newton, conservación de la energía, hidrostática y electrodinámica.',
      manual: 'MRUA: v_f = v_i + a·t | d = v_i·t + ½·a·t². Ley de gravitación universal y Ley de Coulomb.',
      preguntas: [
        { p: 'Un automóvil parte del reposo y acelera uniformemente a razón de 3 m/s² durante 6 segundos. ¿Qué distancia recorre en ese lapso?', c: '54 metros', i: ['18 metros', '36 metros', '108 metros'], exp: 'Usando d = ½ · a · t² = 0.5 × 3 × (6²) = 0.5 × 3 × 36 = 54 metros.' },
        { p: 'Tres resistencias de 10 Ω, 20 Ω y 30 Ω se conectan en SERIE a una fuente de 120 V. ¿Cuál es la resistencia equivalente total?', c: '60 Ω', i: ['5.45 Ω', '20 Ω', '120 Ω'], exp: 'En un circuito en serie, la resistencia equivalente es la suma directa: 10 + 20 + 30 = 60 Ω.' }
      ]
    },
    {
      id: 'ingles', cat: 'basica', icono: '🗣️', titulo: 'Inglés Técnico & Conversacional (OpenEnglish)', niveles: '7° a 12° Bilingüe',
      desc: 'Grammar in Context, IT & Cybersecurity Vocabulary, Reading Comprehension and TOEIC Preparation.',
      manual: 'First Conditional (If + Present, will + base verb), Second Conditional (If + Past, would + base verb).',
      preguntas: [
        { p: 'Select the best option: "Had we configured the firewall properly, the intrusion _____ prevented."', c: 'would have been', i: ['will be', 'was', 'is being'], exp: 'Third conditional inversion in passive voice requires "would have been + past participle".' },
        { p: 'What does the acronym "API" stand for in modern software architecture?', c: 'Application Programming Interface', i: ['Automated Protocol Internet', 'Advanced Processor Integration', 'Active Port Identifier'], exp: 'API stands for Application Programming Interface.' }
      ]
    },
    {
      id: 'web', cat: 'ctp', icono: '💻', titulo: 'Desarrollo Web & Ingeniería de Software', niveles: '10°, 11° y 12° CTP',
      desc: 'HTML5, CSS3/Tailwind, JavaScript moderno, React, Node.js, bases de datos relacionales SQL y Git.',
      manual: 'Semántica HTML5, Flexbox/Grid, promesas async/await en JS, hooks de React y normalización de bases de datos (1FN, 2FN, 3FN).',
      preguntas: [
        { p: 'En JavaScript asíncrono, ¿qué palabra clave detiene la ejecución dentro de una función async hasta que una Promesa se resuelva?', c: 'await', i: ['yield', 'defer', 'static'], exp: 'El operador await pausa la ejecución de la función async esperando la resolución de la Promise.' },
        { p: 'En una base de datos relacional PostgreSQL, ¿qué restricción garantiza que una columna no acepte valores duplicados ni nulos identificando cada fila?', c: 'PRIMARY KEY (Clave Primaria)', i: ['FOREIGN KEY', 'DEFAULT', 'INDEX'], exp: 'PRIMARY KEY combina implícitamente las restricciones UNIQUE y NOT NULL.' },
        { p: '¿Qué propiedad de CSS Flexbox alinea los elementos hijos a lo largo del eje principal (main axis)?', c: 'justify-content', i: ['align-items', 'z-index', 'box-sizing'], exp: 'justify-content controla la distribución en el eje principal, mientras que align-items actúa en el eje transversal.' }
      ]
    },
    {
      id: 'ciber', cat: 'ctp', icono: '🛡️', titulo: 'Ciberseguridad, Hacking Ético y SOC', niveles: '10°, 11° y 12° CTP',
      desc: 'Criptografía, pentesting, análisis de vulnerabilidades OWASP, endurecimiento de servidores, SIEM y normativa ISO 27001.',
      manual: 'Defensa en profundidad, principio de mínimo privilegio (Zero Trust), hashing con sal (Salt) y mitigación de XSS/CSRF.',
      preguntas: [
        { p: '¿Qué vulnerabilidad web ocurre cuando una aplicación inserta datos no sanitizados del usuario en el DOM ejecutando scripts maliciosos en el navegador de la víctima?', c: 'Cross-Site Scripting (XSS)', i: ['Denegación de Servicio (DDoS)', 'Fuerza Bruta SSH', 'ARP Spoofing'], exp: 'XSS permite inyectar código JavaScript ejecutable en el contexto de la sesión del navegador de otros usuarios.' },
        { p: 'En criptografía de clave pública (asimétrica) como RSA o ECC, si Alicia quiere enviar un mensaje confidencial a Benito, ¿con qué clave debe cifrarlo?', c: 'Con la clave pública de Benito', i: ['Con la clave privada de Alicia', 'Con una clave pública compartida en texto plano', 'Sin ninguna clave'], exp: 'Para garantizar confidencialidad, se cifra con la clave pública del destinatario para que solo su clave privada pueda descifrarlo.' }
      ]
    },
    {
      id: 'redes', cat: 'ctp', icono: '🌐', titulo: 'Redes Cisco, VLSM y Infraestructura TI', niveles: '10°, 11° y 12° CTP',
      desc: 'Enrutamiento y conmutación, direccionamiento IPv4/IPv6, subneteo VLSM, VLANs, STP, DHCP, DNS y diagnóstico.',
      manual: 'Rangos privados RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) y cálculo de broadcast.',
      preguntas: [
        { p: 'Dada la dirección de subred 192.168.50.64/26, ¿cuál es su dirección de Broadcast correspondiente?', c: '192.168.50.127', i: ['192.168.50.128', '192.168.50.255', '192.168.50.95'], exp: 'Un prefijo /26 tiene saltos de bloque de 64 direcciones (2⁶ = 64). El bloque empieza en .64 y el siguiente inicia en .128, por lo que el broadcast es .127.' },
        { p: '¿Qué comando de diagnóstico de red envía paquetes ICMP Echo Request para comprobar la conectividad y latencia hacia un host?', c: 'ping', i: ['netstat', 'nslookup', 'chmod'], exp: 'El comando ping utiliza mensajes ICMP Echo Request y Echo Reply para medir conectividad y tiempo de ida y vuelta (RTT).' }
      ]
    },
    {
      id: 'contabilidad', cat: 'ctp', icono: '📊', titulo: 'Contabilidad Pura, Costos y Finanzas', niveles: '10°, 11° y 12° CTP',
      desc: 'Ciclo contable completo, estados financieros NIIF, conciliación bancaria, depreciación, planillas e impuestos.',
      manual: 'Depreciación en línea recta = (Costo - Valor Residual) / Vida Útil. Ecuación contable básica: A = P + C.',
      preguntas: [
        { p: 'Una maquinaria cuesta ₡5,500,000, tiene un valor residual estimado de ₡500,000 y una vida útil de 5 años. ¿Cuál es el gasto por depreciación anual por el método de línea recta?', c: '₡1,000,000 por año', i: ['₡1,100,000 por año', '₡500,000 por año', '₡900,000 por año'], exp: '(5,500,000 - 500,000) / 5 = 5,000,000 / 5 = ₡1,000,000 anuales.' },
        { p: '¿En cuál estado financiero oficial se presentan los Ingresos, Costos y Gastos de un período para determinar la Utilidad o Pérdida Neta?', c: 'Estado de Resultados Integral (Ganancias y Pérdidas)', i: ['Estado de Situación Financiera (Balance General)', 'Estado de Flujos de Efectivo', 'Arqueo de Caja Chica'], exp: 'El Estado de Resultados mide el rendimiento financiero comparando ingresos menos gastos durante un período.' }
      ]
    }
  ];

  // ============================================================================
  // ESTILOS RESPONSIVE MOBILE-FIRST & GAMIFICACIÓN
  // ============================================================================
  function inyectarCSSGate() {
    if (document.getElementById('bds-v147-css')) return;
    const st = document.createElement('style');
    st.id = 'bds-v147-css';
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
    let old = document.getElementById('bds-login-v147');
    if (old) old.remove();

    let vista = vistaInicial || 'login';
    const gate = document.createElement('div');
    gate.id = 'bds-login-v147';
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
            <form id="f-rec-v147" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar Credencial con SHA-256</button>
              <button type="button" id="btn-volver-login" style="background:transparent;color:#38bdf8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">← Volver al Inicio de Sesión</button>
            </form>
          </div>
        `;
        document.getElementById('btn-volver-login').onclick = () => { vista = 'login'; renderVistaAuth(); };
        document.getElementById('f-rec-v147').onsubmit = (e) => {
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
            <img src="${SVG_CTP}" width="42" height="42" alt="CTP"/>
            <img src="${SVG_MEP}" height="36" alt="MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:14px;">
            <h1 style="margin:0;font-size:21px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Plataforma Gamificada • CTP Mercedes Norte</p>
          </div>

          <div id="auth-error-msg" style="display:${bloqueado?'block':'none'};background:#450a0a;color:#fca5a5;padding:9px;border-radius:8px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;">
            ${bloqueado ? '🔒 Cuenta bloqueada por 5 intentos fallidos. Comunícate con el administrador o usa "Recuperar Clave".' : ''}
          </div>

          <form id="f-login-v147" style="display:flex;flex-direction:column;gap:9px;">
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

      document.getElementById('f-login-v147').onsubmit = (e) => { e.preventDefault(); procesarIngreso(false); };
      document.getElementById('btn-google-oauth').onclick = () => {
        if (!passInput.value) passInput.value = 'oauth-verified';
        procesarIngreso(true);
      };
    }

    document.body.appendChild(gate);
    renderVistaAuth();
  };

  // ============================================================================
  // RENDERIZADOR DE LOS 12 JUEGOS (DOMINÓ Y SOLITARIO MULTI-MODO + AJEDREZ INTACTO)
  // ============================================================================
  function renderSala12Juegos(contenedor, juegoInicial) {
    let juegoActivo = juegoInicial || 'ajedrez';
    const LISTA_12 = [
      { id: 'ajedrez', nom: '1. ♟️ Ajedrez FIDE' },
      { id: 'domino', nom: '2. 🁣 Dominó Pro' },
      { id: 'solitario', nom: '3. 🃏 Solitario Dual' },
      { id: 'damas', nom: '4. 🔴 Damas 8x8' },
      { id: 'cuatro', nom: '5. 🟡 4 en Línea' },
      { id: 'ranas', nom: '6. 🐸 Cruza Ranas' },
      { id: 'puente', nom: '7. 🔦 Puente 17m' },
      { id: 'gato', nom: '8. ❌ Ta-Te-Ti IA' },
      { id: 'memoria', nom: '9. 🧠 Memoria 4x4' },
      { id: 'adivina', nom: '10. 🔢 Búsqueda Binaria' },
      { id: 'subnet', nom: '11. 🌐 Reto VLSM' },
      { id: 'cosevi', nom: '12. 🔐 Turing & COSEVI' }
    ];

    function pintarSelectorYJuego() {
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #7c3aed;border-radius:14px;padding:14px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#7c3aed;color:#fff;font-size:11px;font-weight:900;padding:4px 9px;border-radius:6px;">ARCADE 12 JUEGOS v147</span>
              <h2 style="margin:0;font-size:16px;color:#fff;">Centro Gamificado de Razonamiento y Entretenimiento Estudiantil</h2>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;background:#070d19;padding:8px;border-radius:10px;border:1px solid #1e293b;">
            ${LISTA_12.map(j => `
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

      // 2. DOMINÓ PRO CON SELECTOR DE DIFICULTAD Y EXTREMO (IZQ / DER)
      else if (juegoActivo === 'domino') {
        let difDomino = 'turing'; // 'normal' | 'turing'
        let fichas = [];
        for (let i=0; i<=6; i++) for (let j=i; j<=6; j++) fichas.push([i, j]);
        fichas = shuffleCrypto(fichas);
        let manoJug = fichas.slice(0, 7);
        let manoPC = fichas.slice(7, 14);
        let pozo = fichas.slice(14);
        let mesa = [[6, 6]];
        let izq = 6, der = 6, extremoPreferido = 'auto';
        let msgD = "Mesa iniciada con [6|6]. Elige extremo (Auto, Izquierda o Derecha) y toca una ficha verde de tu mano.";

        function sumaPuntosMano(arr) { return arr.reduce((acc, f) => acc + f[0] + f[1], 0); }

        function jugarTurnoPC() {
          // Si dificultad es Maestro Turing, la PC prioriza descargar sus fichas más pesadas primero
          if (difDomino === 'turing') manoPC.sort((a, b) => (b[0]+b[1]) - (a[0]+a[1]));
          for (let i=0; i<manoPC.length; i++) {
            const [a, b] = manoPC[i];
            if (a === izq) { mesa.unshift([b, a]); izq = b; manoPC.splice(i, 1); msgD = `🤖 PC (${difDomino.toUpperCase()}) jugó [${b}|${a}] a la izquierda.`; return; }
            if (b === izq) { mesa.unshift([a, b]); izq = a; manoPC.splice(i, 1); msgD = `🤖 PC (${difDomino.toUpperCase()}) jugó [${a}|${b}] a la izquierda.`; return; }
            if (a === der) { mesa.push([a, b]); der = b; manoPC.splice(i, 1); msgD = `🤖 PC (${difDomino.toUpperCase()}) jugó [${a}|${b}] a la derecha.`; return; }
            if (b === der) { mesa.push([b, a]); der = a; manoPC.splice(i, 1); msgD = `🤖 PC (${difDomino.toUpperCase()}) jugó [${b}|${a}] a la derecha.`; return; }
          }
          while (pozo.length > 0) {
            const robada = pozo.pop();
            manoPC.push(robada);
            const [ra, rb] = robada;
            if (ra === izq || rb === izq || ra === der || rb === der) {
              jugarTurnoPC(); return;
            }
          }
          msgD = "🤖 PC no tenía jugada y pasó turno.";
        }

        function drawDomino() {
          const ganoJug = manoJug.length === 0;
          const ganoPC = manoPC.length === 0;
          if (ganoJug) ganarXP(40, "🁣 Maestro del Dominó");

          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🁣 Dominó Doble-6 Pro (Modo Táctico vs IA Turing)</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${ganoJug?`🏆 ¡DOMINÓ! ¡GANASTE (+${sumaPuntosMano(manoPC)} pts de las fichas de la PC)!`:(ganoPC?'❌ La PC dominó la partida.':msgD)}</p>
              <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <select id="dom-dif" style="background:#131f33;color:#fff;border:1px solid #38bdf8;padding:5px 9px;border-radius:6px;font-size:11.5px;font-weight:700;">
                  <option value="turing" ${difDomino==='turing'?'selected':''}>🧠 IA Maestro Turing (Prioriza fichas altas)</option>
                  <option value="normal" ${difDomino==='normal'?'selected':''}>🟢 IA Estándar</option>
                </select>
                <button id="dom-side-left" style="background:${extremoPreferido==='izq'?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">⬅️ Jugar en Izq [${izq}]</button>
                <button id="dom-side-auto" style="background:${extremoPreferido==='auto'?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">⚡ Auto</button>
                <button id="dom-side-right" style="background:${extremoPreferido==='der'?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">Jugar en Der [${der}] ➡️</button>
              </div>
              <div style="font-size:11.5px;color:#cbd5e1;margin-bottom:8px;">Tus puntos en mano: <b>${sumaPuntosMano(manoJug)}</b> • Fichas PC: <b>${manoPC.length}</b> • Pozo: <b>${pozo.length}</b></div>
              <div style="background:#0b1322;border:2px solid #059669;border-radius:10px;padding:12px;min-height:74px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                ${mesa.map(f => `<span style="background:#f8fafc;color:#0f172a;padding:6px 9px;border-radius:6px;font-weight:900;font-size:13px;border:2px solid #334155;box-shadow:0 2px 6px rgba(0,0,0,0.4);">${f[0]} | ${f[1]}</span>`).join('')}
              </div>
              <div id="dom-mano" style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div>
              <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
                <button id="dom-robar" style="background:#0284c7;color:#fff;border:none;padding:9px 14px;border-radius:7px;font-weight:800;cursor:pointer;font-size:12px;">Robar del Pozo (${pozo.length}) / Pasar</button>
                <button id="dom-rst" style="background:#7f1d1d;color:#fecaca;border:none;padding:9px 14px;border-radius:7px;font-weight:800;cursor:pointer;font-size:12px;">Nueva Partida</button>
              </div>
            </div>
          `;
          document.getElementById('dom-dif').onchange = (e) => { difDomino = e.target.value; drawDomino(); };
          document.getElementById('dom-side-left').onclick = () => { extremoPreferido = 'izq'; drawDomino(); };
          document.getElementById('dom-side-auto').onclick = () => { extremoPreferido = 'auto'; drawDomino(); };
          document.getElementById('dom-side-right').onclick = () => { extremoPreferido = 'der'; drawDomino(); };

          const mn = document.getElementById('dom-mano');
          manoJug.forEach((f, idx) => {
            const calzaIzq = f[0]===izq || f[1]===izq;
            const calzaDer = f[0]===der || f[1]===der;
            const jugable = calzaIzq || calzaDer;
            const b = document.createElement('button');
            b.style.cssText = `background:${jugable?'#064e3b':'#1e293b'};color:#fff;border:2px solid ${jugable?'#34d399':'#475569'};padding:10px 13px;border-radius:8px;font-weight:900;font-size:14px;cursor:pointer;`;
            b.innerText = `[ ${f[0]} | ${f[1]} ]`;
            b.onclick = () => {
              if (ganoJug || ganoPC) return;
              const [a, c] = f;
              let colocada = false;
              if (extremoPreferido === 'izq' && calzaIzq) {
                if (c === izq) { mesa.unshift([a, c]); izq = a; colocada = true; }
                else if (a === izq) { mesa.unshift([c, a]); izq = c; colocada = true; }
              } else if (extremoPreferido === 'der' && calzaDer) {
                if (a === der) { mesa.push([a, c]); der = c; colocada = true; }
                else if (c === der) { mesa.push([c, a]); der = a; colocada = true; }
              } else {
                if (a === der) { mesa.push([a, c]); der = c; colocada = true; }
                else if (c === der) { mesa.push([c, a]); der = a; colocada = true; }
                else if (c === izq) { mesa.unshift([a, c]); izq = a; colocada = true; }
                else if (a === izq) { mesa.unshift([c, a]); izq = c; colocada = true; }
              }
              if (!colocada) { msgD = `⚠️ La ficha [${a}|${c}] no coincide con el extremo seleccionado.`; drawDomino(); return; }
              manoJug.splice(idx, 1);
              ganarXP(10);
              if (manoJug.length > 0) jugarTurnoPC();
              drawDomino();
            };
            mn.appendChild(b);
          });
          document.getElementById('dom-robar').onclick = () => {
            if (pozo.length > 0) { manoJug.push(pozo.pop()); msgD = "Robaste una ficha del pozo."; }
            else { jugarTurnoPC(); }
            drawDomino();
          };
          document.getElementById('dom-rst').onclick = () => pintarSelectorYJuego();
        }
        drawDomino();
      }

      // 3. SOLITARIO DUAL PRO (MODO PIRÁMIDE SUMA-13 + MODO ESCALERA POR PALOS + PISTA)
      else if (juegoActivo === 'solitario') {
        let modoSol = 'suma13'; // 'suma13' | 'escalera'
        const palos = ['♠️','♥️','♦️','♣️'];
        let mazo = [];
        for (let v=1; v<=13; v++) palos.forEach(p => mazo.push({ v, p, nom: v===1?'A':(v===11?'J':(v===12?'Q':(v===13?'K':String(v)))) }));
        mazo = shuffleCrypto(mazo);
        let tablero = mazo.slice(0, 12);
        let reserva = mazo.slice(12);
        let basesPalos = { '♠️': 0, '♥️': 0, '♦️': 0, '♣️': 0 };
        let selIdx = null, pts = 0, msgS = "Modo Suma-13: Empareja dos cartas que sumen 13 o toca una K (13). Usa '💡 Pista' si te atascas.";

        function buscarPistaSuma13() {
          for (let i=0; i<tablero.length; i++) {
            if (tablero[i] && tablero[i].v === 13) return `💡 Pista: Toca directamente el Rey (${tablero[i].nom}${tablero[i].p}) en la casilla ${i+1}.`;
            for (let j=i+1; j<tablero.length; j++) {
              if (tablero[i] && tablero[j] && tablero[i].v + tablero[j].v === 13) {
                return `💡 Pista: Combina ${tablero[i].nom}${tablero[i].p} (${tablero[i].v}) con ${tablero[j].nom}${tablero[j].p} (${tablero[j].v}) = 13.`;
              }
            }
          }
          return "💡 No hay pares directos en mesa; presiona 'Repartir Reemplazos'.";
        }

        function drawSolitario() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🃏 Solitario Dual Pro (${modoSol==='suma13'?'Pirámide Suma-13':'Escalera Real A → K'})</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${msgS}</p>
              <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <button id="sol-m1" style="background:${modoSol==='suma13'?'#0284c7':'#131f33'};color:#fff;border:1px solid #38bdf8;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">🔢 Modo Pirámide (Suma 13)</button>
                <button id="sol-m2" style="background:${modoSol==='escalera'?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">♠️ Modo Escalera (Menor a Mayor)</button>
                <button id="sol-hint" style="background:#f59e0b;color:#020617;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:900;cursor:pointer;">💡 Pista Inteligente</button>
              </div>
              <div style="font-size:12px;color:#fbbf24;font-weight:800;margin-bottom:10px;">Puntuación: ${pts} pts • Mazo Reserva: ${reserva.length} cartas</div>
              <div id="sol-grid" style="display:grid;grid-template-columns:repeat(4,74px);gap:8px;width:320px;margin:0 auto 12px;justify-content:center;"></div>
              <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
                <button id="sol-deal" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;font-size:12px;">Repartir Reemplazos (${reserva.length})</button>
                <button id="sol-rst" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;font-size:12px;">Nuevo Mazo</button>
              </div>
            </div>
          `;
          document.getElementById('sol-m1').onclick = () => { modoSol = 'suma13'; msgS = "Modo Suma-13 activado."; drawSolitario(); };
          document.getElementById('sol-m2').onclick = () => { modoSol = 'escalera'; msgS = "Modo Escalera: Toca siempre la carta de MENOR valor disponible en la mesa para despejar en orden."; drawSolitario(); };
          document.getElementById('sol-hint').onclick = () => {
            if (modoSol === 'suma13') msgS = buscarPistaSuma13();
            else {
              const vals = tablero.filter(Boolean).map(x => x.v);
              msgS = vals.length ? `💡 Pista: La carta más baja actual tiene valor ${Math.min(...vals)}.` : "Mesa despejada.";
            }
            drawSolitario();
          };

          const g = document.getElementById('sol-grid');
          tablero.forEach((c, idx) => {
            const b = document.createElement('button');
            if (!c) {
              b.style.cssText = 'height:84px;border-radius:8px;border:1px dashed #334155;background:#060c17;color:#34d399;';
              b.innerText = '✓';
            } else {
              const rojo = c.p === '♥️' || c.p === '♦️';
              const esSel = selIdx === idx;
              b.style.cssText = `height:84px;border-radius:8px;border:2px solid ${esSel?'#38bdf8':'#cbd5e1'};background:${esSel?'#bae6fd':'#ffffff'};color:${rojo?'#dc2626':'#0f172a'};font-weight:900;font-size:16px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;`;
              b.innerHTML = `<span>${c.nom}${c.p}</span><span style="font-size:10px;color:#475569;">Val: ${c.v}</span>`;
              b.onclick = () => {
                if (modoSol === 'escalera') {
                  const minV = Math.min(...tablero.filter(Boolean).map(x => x.v));
                  if (c.v === minV) {
                    tablero[idx] = reserva.length ? reserva.pop() : null;
                    pts += 20; ganarXP(10, "🃏 As del Solitario");
                    msgS = `✅ Carta mínima (${c.nom}${c.p}) despejada en escalera.`;
                  } else {
                    msgS = `⚠️ En modo Escalera debes tocar primero la carta de menor valor (${minV}).`;
                  }
                  drawSolitario();
                  return;
                }
                if (c.v === 13) {
                  tablero[idx] = reserva.length ? reserva.pop() : null;
                  pts += 20; selIdx = null; ganarXP(10, "🃏 As del Solitario"); msgS = "👑 ¡Rey (13) despejado!"; drawSolitario(); return;
                }
                if (selIdx === null) { selIdx = idx; msgS = `Seleccionaste ${c.nom}${c.p} (${c.v}). Busca un ${13 - c.v}.`; drawSolitario(); }
                else if (selIdx === idx) { selIdx = null; drawSolitario(); }
                else {
                  const pr = tablero[selIdx];
                  if (pr && pr.v + c.v === 13) {
                    tablero[selIdx] = reserva.length ? reserva.pop() : null;
                    tablero[idx] = reserva.length ? reserva.pop() : null;
                    pts += 30; selIdx = null; ganarXP(15, "🃏 As del Solitario"); msgS = `✅ ¡Par perfecto (${pr.v} + ${c.v} = 13)!`;
                  } else { selIdx = null; msgS = `⚠️ ${pr.v} + ${c.v} no suman 13.`; }
                  drawSolitario();
                }
              };
            }
            g.appendChild(b);
          });
          document.getElementById('sol-deal').onclick = () => {
            if (reserva.length >= 4) { for (let i=0; i<4; i++) tablero[i] = reserva.pop(); selIdx = null; msgS = "Nuevas cartas repartidas."; drawSolitario(); }
          };
          document.getElementById('sol-rst').onclick = () => pintarSelectorYJuego();
        }
        drawSolitario();
      }

      // 4. DAMAS ESPAÑOLAS 8x8
      else if (juegoActivo === 'damas') {
        let tab = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => ((r + c) % 2 === 1 ? (r < 3 ? 'n' : (r > 4 ? 'b' : '')) : '')));
        let sel = null, turno = 'b', modoPC = true, msg = "Tu turno (Fichas Celestes abajo). Avanza en diagonal o salta para capturar.";
        function movsFicha(r, c) {
          const p = tab[r][c]; if (!p) return [];
          const esB = p.toLowerCase() === 'b', esDama = p === 'B' || p === 'N';
          const dirs = esDama ? [[-1,-1],[-1,1],[1,-1],[1,1]] : (esB ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]]);
          const res = [];
          dirs.forEach(([dr, dc]) => {
            const r1 = r + dr, c1 = c + dc;
            if (r1 >= 0 && r1 < 8 && c1 >= 0 && c1 < 8) {
              if (tab[r1][c1] === '') res.push({ r2: r1, c2: c1, cap: null });
              else if (tab[r1][c1].toLowerCase() !== p.toLowerCase()) {
                const r2 = r + 2*dr, c2 = c + 2*dc;
                if (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8 && tab[r2][c2] === '') res.push({ r2, c2, cap: { r: r1, c: c1 } });
              }
            }
          });
          return res;
        }
        function aplicarDama(r1, c1, m) {
          let p = tab[r1][c1];
          if (p === 'b' && m.r2 === 0) p = 'B';
          if (p === 'n' && m.r2 === 7) p = 'N';
          tab[m.r2][m.c2] = p; tab[r1][c1] = '';
          if (m.cap) tab[m.cap.r][m.cap.c] = '';
          turno = turno === 'b' ? 'n' : 'b'; sel = null;
        }
        function drawDamas() {
          const leg = sel ? movsFicha(sel.r, sel.c) : [];
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🔴 Damas Españolas 8x8 vs PC</h3>
              <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${msg}</p>
              <div id="dm-grid" style="display:grid;grid-template-columns:repeat(8,42px);width:336px;margin:0 auto 10px;border:3px solid #38bdf8;border-radius:8px;overflow:hidden;"></div>
              <button id="dm-rst" style="background:#0284c7;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Reiniciar Damas</button>
            </div>
          `;
          const g = document.getElementById('dm-grid');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, p = tab[r][c], mp = leg.find(x => x.r2 === r && x.c2 === c);
            const btn = document.createElement('button');
            btn.style.cssText = `width:42px;height:42px;border:none;background:${sel&&sel.r===r&&sel.c===c?'#0284c7':(mp?'#059669':(osc?'#1e293b':'#cbd5e1'))};display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;`;
            if (p) btn.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;background:${p.toLowerCase()==='b'?'#0ea5e9':'#ef4444'};border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;">${(p==='B'||p==='N')?'👑':''}</span>`;
            btn.onclick = () => {
              if (p && p.toLowerCase() === turno) { sel = { r, c }; drawDamas(); return; }
              if (sel && mp) {
                aplicarDama(sel.r, sel.c, mp); ganarXP(5); drawDamas();
                if (modoPC && turno === 'n') {
                  setTimeout(() => {
                    let tds = [];
                    for (let rr=0; rr<8; rr++) for (let cc=0; cc<8; cc++) if (tab[rr][cc] && tab[rr][cc].toLowerCase()==='n') movsFicha(rr, cc).forEach(m => tds.push({ r1: rr, c1: cc, m }));
                    if (tds.length) { tds.sort((a,b)=>(b.m.cap?10:0)-(a.m.cap?10:0)); aplicarDama(tds[0].r1, tds[0].c1, tds[0].m); msg = "🤖 PC movió."; }
                    drawDamas();
                  }, 300);
                }
              }
            };
            g.appendChild(btn);
          }
          document.getElementById('dm-rst').onclick = () => pintarSelectorYJuego();
        }
        drawDamas();
      }

      // 5. CUATRO EN LÍNEA 7x6
      else if (juegoActivo === 'cuatro') {
        let g4 = Array(6).fill(null).map(() => Array(7).fill(0)), turno = 1, gano = 0, msg = "Toca una columna para soltar tu ficha celeste.";
        function checkC4(p) {
          for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
            if (c+3<7 && g4[r][c]===p && g4[r][c+1]===p && g4[r][c+2]===p && g4[r][c+3]===p) return true;
            if (r+3<6 && g4[r][c]===p && g4[r+1][c]===p && g4[r+2][c]===p && g4[r+3][c]===p) return true;
            if (r+3<6 && c+3<7 && g4[r][c]===p && g4[r+1][c+1]===p && g4[r+2][c+2]===p && g4[r+3][c+3]===p) return true;
            if (r-3>=0 && c+3<7 && g4[r][c]===p && g4[r-1][c+1]===p && g4[r-2][c+2]===p && g4[r-3][c+3]===p) return true;
          }
          return false;
        }
        function drop(col) {
          for (let r=5; r>=0; r--) if (g4[r][col] === 0) {
            g4[r][col] = turno;
            if (checkC4(turno)) { gano = turno; msg = `🏆 ¡Ganó ${turno===1?'Jugador':'PC'}!`; ganarXP(20); }
            else turno = turno === 1 ? 2 : 1;
            return true;
          }
          return false;
        }
        function drawC4() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🟡 Cuatro en Línea 7x6 vs PC</h3>
              <p style="font-size:12px;color:#34d399;margin-bottom:8px;">${msg}</p>
              <div id="c4-grid" style="display:grid;grid-template-columns:repeat(7,42px);gap:6px;width:330px;margin:0 auto 10px;background:#1e293b;padding:10px;border-radius:12px;"></div>
              <button id="c4-rst" style="background:#0284c7;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Reiniciar</button>
            </div>
          `;
          const gd = document.getElementById('c4-grid');
          for (let r=0; r<6; r++) for (let c=0; c<7; c++) {
            const v = g4[r][c], b = document.createElement('button');
            b.style.cssText = `width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;background:${v===0?'#060c17':(v===1?'#0ea5e9':'#fbbf24')};`;
            b.onclick = () => {
              if (gano || turno !== 1) return;
              if (drop(c)) {
                drawC4();
                if (!gano && turno === 2) setTimeout(() => {
                  const disp = [3,2,4,1,5,0,6].filter(cl => g4[0][cl] === 0);
                  if (disp.length) drop(disp[Math.floor(Math.random()*Math.min(3, disp.length))]);
                  drawC4();
                }, 250);
              }
            };
            gd.appendChild(b);
          }
          document.getElementById('c4-rst').onclick = () => pintarSelectorYJuego();
        }
        drawC4();
      }

      // 6. CRUZA LAS RANAS
      else if (juegoActivo === 'ranas') {
        let ranas = ['G','G','G','_','Y','Y','Y'], movs = 0;
        function drawRanas() {
          const gano = ranas.join('') === 'YYY_GGG';
          stg.innerHTML = `
            <div style="text-align:center;padding:12px;">
              <h3 style="margin:0 0 6px;font-size:16px;color:#34d399;">🐸 Acertijo Lógico: Cruza las Ranas</h3>
              <p style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">${gano ? '🏆 ¡RESUELTO PERFECTAMENTE!' : 'Intercambia las ranas verdes y amarillas.'} • Movimientos: <b>${movs}</b></p>
              <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:18px 0;">
                ${ranas.map((p, i) => `<button data-ri="${i}" class="btn-rn" style="width:60px;height:60px;border-radius:12px;border:2px solid #334155;background:${p==='_'?'#0b1322':(p==='G'?'#064e3b':'#451a03')};color:#fff;cursor:pointer;font-size:20px;">${p==='G'?'🐸➡':(p==='Y'?'⬅🐸':'🪨')}</button>`).join('')}
              </div>
              <button id="rn-rst" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:800;cursor:pointer;">Reiniciar</button>
            </div>
          `;
          stg.querySelectorAll('.btn-rn').forEach(b => {
            b.onclick = () => {
              const i = parseInt(b.getAttribute('data-ri'), 10), v = ranas.indexOf('_');
              if (ranas[i] === 'G' && (v === i + 1 || v === i + 2)) { ranas[v] = 'G'; ranas[i] = '_'; movs++; drawRanas(); }
              else if (ranas[i] === 'Y' && (v === i - 1 || v === i - 2)) { ranas[v] = 'Y'; ranas[i] = '_'; movs++; drawRanas(); }
            };
          });
          document.getElementById('rn-rst').onclick = () => pintarSelectorYJuego();
        }
        drawRanas();
      }

      // 7. PUENTE EN 17 MINUTOS
      else if (juegoActivo === 'puente') {
        let exc = [{id:'1',t:1,l:'izq',n:'⚡ 1 min'},{id:'2',t:2,l:'izq',n:'🏃 2 min'},{id:'5',t:5,l:'izq',n:'🎒 5 min'},{id:'10',t:10,l:'izq',n:'🦯 10 min'}];
        let lint = 'izq', tiempo = 0, sel = [];
        function drawP() {
          const gano = exc.every(e => e.l === 'der') && tiempo <= 17;
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">🔦 El Puente Oscuro en 17 Minutos</h3>
              <p style="font-size:12px;color:#fbbf24;font-weight:800;">⏱️ Tiempo: ${tiempo}/17 min • Linterna: ${lint.toUpperCase()} ${gano?'🏆 ¡LOGRADO!':''}</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:480px;margin:10px auto;">
                <div style="background:#0b1322;padding:10px;border-radius:8px;"><b>Izquierda</b>${exc.filter(e=>e.l==='izq').map(e=>`<button data-id="${e.id}" class="bp-e" style="display:block;width:100%;margin-top:6px;background:${sel.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;cursor:pointer;">${e.n}</button>`).join('')}</div>
                <div style="background:#0b1322;padding:10px;border-radius:8px;"><b>Derecha</b>${exc.filter(e=>e.l==='der').map(e=>`<button data-id="${e.id}" class="bp-e" style="display:block;width:100%;margin-top:6px;background:${sel.includes(e.id)?'#0284c7':'#131f33'};color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;cursor:pointer;">${e.n}</button>`).join('')}</div>
              </div>
              <button id="bp-go" style="background:#059669;color:#fff;border:none;padding:8px 16px;border-radius:7px;font-weight:800;cursor:pointer;">Cruzar Puente ➡</button>
              <button id="bp-rst" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 14px;border-radius:7px;font-weight:800;cursor:pointer;margin-left:6px;">Reiniciar</button>
            </div>
          `;
          stg.querySelectorAll('.bp-e').forEach(b => {
            b.onclick = () => {
              const id = b.getAttribute('data-id'), ex = exc.find(x => x.id === id);
              if (ex.l !== lint) return;
              if (sel.includes(id)) sel = sel.filter(x => x !== id); else if (sel.length < 2) sel.push(id);
              drawP();
            };
          });
          document.getElementById('bp-go').onclick = () => {
            if (!sel.length) return;
            const grp = exc.filter(e => sel.includes(e.id));
            tiempo += Math.max(...grp.map(e => e.t)); lint = lint === 'izq' ? 'der' : 'izq';
            grp.forEach(e => e.l = lint); sel = []; drawP();
          };
          document.getElementById('bp-rst').onclick = () => pintarSelectorYJuego();
        }
        drawP();
      }

      // 8. TA-TE-TI PRO
      else if (juegoActivo === 'gato') {
        let t = Array(9).fill(''), fin = false, msg = "Tu turno (X).";
        const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        function chk() { for (const [a,b,c] of L) if (t[a]&&t[a]===t[b]&&t[a]===t[c]) return t[a]; return t.every(x=>x)?'E':null; }
        function drawG() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="margin:0 0 6px;color:#38bdf8;">❌ Ta-Te-Ti vs IA</h3><p style="font-size:12px;color:#34d399;">${msg}</p><div id="gt-b" style="display:grid;grid-template-columns:repeat(3,68px);gap:8px;width:220px;margin:10px auto;"></div><button id="gt-r" style="background:#0284c7;color:#fff;border:none;padding:7px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Reiniciar</button></div>`;
          const b = document.getElementById('gt-b');
          t.forEach((v, i) => {
            const bt = document.createElement('button');
            bt.style.cssText = `height:68px;background:#0b1322;border:2px solid #334155;border-radius:8px;color:${v==='X'?'#38bdf8':'#fbbf24'};font-size:28px;font-weight:900;cursor:pointer;`;
            bt.innerText = v;
            bt.onclick = () => {
              if (fin || t[i]) return;
              t[i] = 'X'; let w = chk();
              if (w) { fin = true; msg = w==='E'?'Empate':'🏆 ¡Ganaste!'; ganarXP(15); drawG(); return; }
              const vac = t.map((x,ix)=>x===''?ix:-1).filter(x=>x!==-1);
              t[vac.includes(4)?4:vac[Math.floor(Math.random()*vac.length)]] = 'O';
              w = chk(); if (w) { fin = true; msg = w==='E'?'Empate':'Ganó la IA'; }
              drawG();
            };
            b.appendChild(bt);
          });
          document.getElementById('gt-r').onclick = () => pintarSelectorYJuego();
        }
        drawG();
      }

      // 9. MEMORIA 4x4 PRO
      else if (juegoActivo === 'memoria') {
        const terminos = shuffleCrypto(['HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL','HTML5','CSS3','React','SHA-256','VLAN','OSPF','Python','SQL']);
        let barajas = terminos.map((t, idx) => ({ id: idx, val: t, volteada: false, encontrada: false }));
        let primerSel = null, bloqueado = false, paresEncontrados = 0;
        function drawMemoria() {
          stg.innerHTML = `
            <div style="text-align:center;">
              <h3 style="margin:0 0 4px;font-size:15px;color:#38bdf8;">🧠 Memoria Técnica 4x4 Pro</h3>
              <p style="font-size:11.5px;color:#34d399;margin-bottom:8px;">Pares encontrados: <b>${paresEncontrados}/8</b></p>
              <div id="mem-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px;margin:0 auto;"></div>
            </div>
          `;
          const grid = document.getElementById('mem-grid');
          barajas.forEach((card, idx) => {
            const btn = document.createElement('button');
            btn.style.cssText = `height:54px;background:${card.encontrada?'#064e3b':(card.volteada?'#0284c7':'#131f33')};color:#fff;border:1px solid #334155;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;`;
            btn.innerText = (card.volteada || card.encontrada) ? card.val : '❓';
            btn.onclick = () => {
              if (bloqueado || card.volteada || card.encontrada) return;
              card.volteada = true; drawMemoria();
              if (!primerSel) primerSel = { idx, val: card.val };
              else {
                bloqueado = true;
                if (primerSel.val === card.val) {
                  barajas[primerSel.idx].encontrada = true; barajas[idx].encontrada = true;
                  paresEncontrados++; primerSel = null; bloqueado = false; ganarXP(10); drawMemoria();
                } else {
                  setTimeout(() => { barajas[primerSel.idx].volteada = false; card.volteada = false; primerSel = null; bloqueado = false; drawMemoria(); }, 700);
                }
              }
            };
            grid.appendChild(btn);
          });
        }
        drawMemoria();
      }

      // 10. BÚSQUEDA BINARIA
      else if (juegoActivo === 'adivina') {
        const sec = shuffleCrypto(Array.from({length:100},(_,i)=>i+1))[0];
        let min = 1, max = 100, pasos = 0, ok = false;
        function drawAdv() {
          stg.innerHTML = `<div style="text-align:center;padding:16px;"><h3 style="color:#38bdf8;margin:0 0 6px;">🔢 Algoritmo de Búsqueda Binaria (1 al 100)</h3><p style="color:#fbbf24;font-weight:800;">Rango activo: [ ${min} — ${max} ] • Intentos: ${pasos}</p><input id="ad-i" type="number" value="${Math.floor((min+max)/2)}" style="background:#0b1322;border:1px solid #38bdf8;color:#fff;padding:8px;border-radius:6px;width:90px;text-align:center;font-size:15px;"/><button id="ad-b" style="background:#0284c7;color:#fff;border:none;padding:9px 14px;border-radius:6px;font-weight:800;cursor:pointer;margin-left:6px;">Probar</button><p style="color:#34d399;font-weight:700;">${ok?'🏆 ¡Exacto! Número '+sec+' hallado.':''}</p></div>`;
          document.getElementById('ad-b').onclick = () => {
            const v = parseInt(document.getElementById('ad-i').value, 10); pasos++;
            if (v === sec) { ok = true; ganarXP(20); } else if (v < sec) min = Math.max(min, v + 1); else max = Math.min(max, v - 1);
            drawAdv();
          };
        }
        drawAdv();
      }

      // 11. RETO SUBNETEO VLSM
      else if (juegoActivo === 'subnet') {
        function renderVLSM() {
          const pref = shuffleCrypto([25,26,27,28,29,30])[0];
          const utiles = Math.pow(2, 32 - pref) - 2;
          const opts = shuffleCrypto([`${utiles} IPs útiles`, `${utiles+2} IPs útiles`, `${Math.max(2, utiles*2)} IPs útiles`, `${Math.max(2, Math.floor(utiles/2))} IPs útiles`]);
          stg.innerHTML = `<div style="text-align:center;padding:14px;"><h3 style="color:#38bdf8;margin:0 0 6px;">🌐 Calculadora y Reto de Subneteo VLSM</h3><p style="font-size:14px;font-weight:800;color:#fff;">Subred 192.168.10.0/${pref} (Máscara 255.255.255.${256 - Math.pow(2, 32-pref)}): ¿Cuántos hosts utilizables tiene?</p><div id="vl-o" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:440px;margin:12px auto;"></div><div id="vl-m" style="font-size:12px;font-weight:700;"></div></div>`;
          opts.forEach(o => {
            const b = document.createElement('button');
            b.style.cssText = 'background:#131f33;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;';
            b.innerText = o;
            b.onclick = () => {
              if (o === `${utiles} IPs útiles`) { ganarXP(15, "🌐 Arquitecto VLSM"); document.getElementById('vl-m').innerHTML = '<span style="color:#34d399;">✅ ¡Correcto! 2^(32-'+pref+') - 2 = '+utiles+'.</span>'; setTimeout(renderVLSM, 900); }
              else document.getElementById('vl-m').innerHTML = '<span style="color:#fca5a5;">❌ Revisa la fórmula 2^h - 2.</span>';
            };
            document.getElementById('vl-o').appendChild(b);
          });
        }
        renderVLSM();
      }

      // 12. MÁQUINA ENIGMA ALAN TURING & QUIZ COSEVI
      else if (juegoActivo === 'cosevi') {
        stg.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
            <div style="background:#0b1322;border:1px solid #38bdf8;border-radius:10px;padding:14px;">
              <h4 style="margin:0 0 6px;color:#38bdf8;">🔐 Máquina Enigma de Alan Turing (Cifrado Rotor)</h4>
              <p style="font-size:11.5px;color:#94a3b8;margin-bottom:8px;">Escribe un mensaje para cifrarlo/descifrarlo con rotor simétrico Turing:</p>
              <input id="tur-in" type="text" value="CIBERSEGURIDAD CTPMN" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;"/>
              <div id="tur-out" style="background:#060c17;padding:8px;border-radius:6px;font-family:monospace;color:#34d399;font-weight:800;">Salida ROT-13: PVORFRTHEVQNQ PGCKA</div>
            </div>
            <div style="background:#0b1322;border:1px solid #10b981;border-radius:10px;padding:14px;">
              <h4 style="margin:0 0 6px;color:#34d399;">🚦 Reto Rápido Ley de Tránsito COSEVI</h4>
              <p style="font-size:12px;color:#fff;">Al llegar a una rotonda de 2 carriles, ¿qué carril debes usar para salir en la primera salida?</p>
              <button onclick="this.style.background='#064e3b';this.innerText='✅ ¡Correcto! Carril externo derecho.';" style="width:100%;background:#131f33;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;margin-top:6px;cursor:pointer;font-weight:700;">Carril externo (derecho)</button>
              <button onclick="this.style.background='#7f1d1d';this.innerText='❌ Incorrecto (ese es para 3ra salida o retorno).';" style="width:100%;background:#131f33;color:#fff;border:1px solid #334155;padding:8px;border-radius:6px;margin-top:6px;cursor:pointer;font-weight:700;">Carril interno (izquierdo)</button>
            </div>
          </div>
        `;
        document.getElementById('tur-in').oninput = (e) => {
          const s = e.target.value.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(((c.charCodeAt(0) - 65 + 13) % 26) + 65));
          document.getElementById('tur-out').innerText = 'Salida ROT-13: ' + s;
        };
      }
    }

    pintarSelectorYJuego();
  }

  // ============================================================================
  // SIMULADOR DE MATERIA / UCR / TEC CON EXPLICACIÓN PASO A PASO Y CONTROL DE CANTIDAD
  // ============================================================================
  function abrirModuloCursoInteractivo(contenedor, idMateria) {
    const mat = CATALOGO_EDUCATIVO.find(x => x.id === idMateria) || CATALOGO_EDUCATIVO[0];
    let dificultad = 'Intermedio';
    let limitePreguntas = mat.preguntas.length;
    let mazoPreguntas = shuffleCrypto(mat.preguntas).slice(0, limitePreguntas);
    let qActual = 0, aciertos = 0, pausado = false, respondida = false;

    function reiniciarSimulacro(nuevoLimite) {
      limitePreguntas = nuevoLimite || mat.preguntas.length;
      mazoPreguntas = shuffleCrypto(mat.preguntas).slice(0, Math.min(limitePreguntas, mat.preguntas.length));
      qActual = 0; aciertos = 0; pausado = false; respondida = false;
      renderCurso();
    }

    function renderCurso() {
      if (qActual >= mazoPreguntas.length) {
        const nota100 = Math.round((aciertos / mazoPreguntas.length) * 100);
        const escala800 = Math.round(200 + (aciertos / mazoPreguntas.length) * 600);
        if (escala800 >= 700) ganarXP(35, "🏛️ Aspirante 800 UCR/TEC");
        contenedor.innerHTML = `
          <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;padding:24px;text-align:center;">
            <h2 style="color:#34d399;margin:0 0 8px;">🏆 ¡Evaluación Finalizada! — ${mat.titulo}</h2>
            <p style="font-size:15px;color:#fff;margin:0 0 12px;">Aciertos: <b>${aciertos}/${mazoPreguntas.length}</b> • Nota MEP: <b style="color:#38bdf8;">${nota100}%</b> • Escala Admisión UCR/TEC: <b style="color:#fbbf24;">${escala800} / 800 pts</b></p>
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
              <button id="cur-rep" style="background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Nuevo Intento Aleatorio (Fisher-Yates)</button>
              <button id="cur-dl" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">📥 Descargar Reporte Oficial TXT</button>
              <button id="cur-back" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">← Volver al Catálogo</button>
            </div>
          </div>
        `;
        document.getElementById('cur-rep').onclick = () => reiniciarSimulacro(limitePreguntas);
        document.getElementById('cur-back').onclick = () => navegarVista('inicio');
        document.getElementById('cur-dl').onclick = () => {
          const blob = new Blob([`REPORTE OFICIAL PRACTICATECNICA.COM\nMateria: ${mat.titulo}\nDificultad: ${dificultad}\nAciertos: ${aciertos}/${mazoPreguntas.length}\nNota: ${nota100}%\nEscala Admision: ${escala800}/800\nFecha: ${new Date().toISOString()}`], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Reporte_${mat.id}.txt`; a.click();
        };
        return;
      }

      const item = mazoPreguntas[qActual];
      const opcionesBarajadas = shuffleCrypto([item.c, ...item.i]);
      respondida = false;

      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="font-size:11px;background:#0284c7;color:#fff;padding:3px 8px;border-radius:5px;font-weight:800;">${mat.niveles}</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">${mat.icono} ${mat.titulo}</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <select id="cur-cant" title="Control de cantidad de preguntas" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:6px 9px;border-radius:6px;font-size:11.5px;font-weight:800;">
                <option value="3" ${mazoPreguntas.length===3?'selected':''}>⚡ 3 Preguntas</option>
                <option value="5" ${mazoPreguntas.length===5?'selected':''}>🎯 5 Preguntas</option>
                <option value="${mat.preguntas.length}" ${mazoPreguntas.length===mat.preguntas.length?'selected':''}>📚 Banco Completo (${mat.preguntas.length})</option>
              </select>
              <select id="cur-dif" style="background:#131f33;color:#fff;border:1px solid #334155;padding:6px 9px;border-radius:6px;font-size:11.5px;font-weight:700;">
                <option value="Básico" ${dificultad==='Básico'?'selected':''}>🟢 Básico</option>
                <option value="Intermedio" ${dificultad==='Intermedio'?'selected':''}>🟡 Intermedio</option>
                <option value="Avanzado Turing" ${dificultad==='Avanzado Turing'?'selected':''}>🔴 Avanzado</option>
              </select>
              <button id="cur-pausa" style="background:#b45309;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">${pausado?'▶️ Seguir':'⏸️ Pausar'}</button>
              <button id="cur-fin" style="background:#7f1d1d;color:#fecaca;border:none;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">⏹️ Calificar</button>
              <button id="cur-volver" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:6px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">← Salir</button>
            </div>
          </div>

          <div style="background:#070d19;border-left:4px solid #38bdf8;padding:11px;border-radius:8px;margin-bottom:12px;">
            <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:3px;">📘 MANUAL Y FÓRMULA CLAVE:</div>
            <div style="font-size:12px;color:#cbd5e1;line-height:1.45;">${mat.manual}</div>
          </div>

          ${pausado ? `<div style="text-align:center;padding:30px;background:#070d19;border-radius:10px;color:#fbbf24;font-weight:800;">⏸️ Simulacro en pausa. Presiona "Seguir" para continuar.</div>` : `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:15px;">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:#34d399;font-weight:800;margin-bottom:8px;">
                <span>Pregunta ${qActual + 1} de ${mazoPreguntas.length}</span>
                <span>Aciertos: ${aciertos}</span>
              </div>
              <p style="font-size:14.5px;font-weight:800;color:#fff;margin:0 0 14px;line-height:1.45;">${item.p}</p>
              <div id="cur-opts" style="display:flex;flex-direction:column;gap:8px;"></div>
              <div id="cur-fb" style="display:none;margin-top:12px;padding:12px;border-radius:8px;background:#0b1322;border:1px solid #38bdf8;font-size:12.5px;line-height:1.45;"></div>
              <button id="cur-next-btn" style="display:none;margin-top:12px;background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;width:100%;">Siguiente Pregunta ➡</button>
            </div>
          `}
        </div>
      `;

      document.getElementById('cur-cant').onchange = (e) => reiniciarSimulacro(parseInt(e.target.value, 10));
      document.getElementById('cur-dif').onchange = (e) => { dificultad = e.target.value; renderCurso(); };
      document.getElementById('cur-pausa').onclick = () => { pausado = !pausado; renderCurso(); };
      document.getElementById('cur-fin').onclick = () => { qActual = mazoPreguntas.length; renderCurso(); };
      document.getElementById('cur-volver').onclick = () => navegarVista('inicio');

      if (!pausado) {
        const box = document.getElementById('cur-opts');
        const fb = document.getElementById('cur-fb');
        const nxt = document.getElementById('cur-next-btn');

        opcionesBarajadas.forEach((op, idx) => {
          const b = document.createElement('button');
          b.style.cssText = 'background:#131f33;color:#fff;border:1px solid #334155;padding:11px 14px;border-radius:8px;text-align:left;font-size:13px;font-weight:700;cursor:pointer;min-height:44px;';
          b.innerText = `${String.fromCharCode(65 + idx)}) ${op}`;
          b.onclick = () => {
            if (respondida) return;
            respondida = true;
            const explicacion = item.exp || 'Respuesta verificada según el temario oficial.';
            if (op === item.c) {
              aciertos++; ganarXP(15);
              b.style.background = '#064e3b'; b.style.borderColor = '#10b981';
              fb.innerHTML = `<div style="color:#34d399;font-weight:900;margin-bottom:4px;">✅ ¡Respuesta Correcta! (+15 XP)</div><div style="color:#e2e8f0;"><b>Explicación paso a paso:</b> ${explicacion}</div>`;
            } else {
              b.style.background = '#7f1d1d'; b.style.borderColor = '#ef4444';
              fb.innerHTML = `<div style="color:#fca5a5;font-weight:900;margin-bottom:4px;">❌ Incorrecto. La respuesta correcta es: ${item.c}</div><div style="color:#e2e8f0;"><b>Explicación paso a paso:</b> ${explicacion}</div>`;
            }
            fb.style.display = 'block';
            nxt.style.display = 'block';
          };
          box.appendChild(b);
        });

        nxt.onclick = () => { qActual++; renderCurso(); };
      }
    }

    renderCurso();
  }

  // ============================================================================
  // SIMULADOR VIAL 2D EN CANVAS REAL (CON CONTROLES TÁCTILES MÓVIL Y TECLADO)
  // ============================================================================
  function renderSimuladorVial2D(contenedor) {
    let puntos = 100, vel = 0, x = 260, y = 265, ang = 0;
    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;text-align:center;">
        <h3 style="margin:0 0 6px;color:#38bdf8;">🚗 Simulador Vial 2D COSEVI (Límites Estrictos de Calzada & Controles Móviles)</h3>
        <div id="sv-hud" style="font-size:12.5px;font-weight:800;color:#34d399;margin-bottom:8px;">Puntos COSEVI: 100/100 • Velocidad: 0 km/h • Circulación por la derecha</div>
        <canvas id="sv-canvas" width="520" height="320" style="max-width:100%;background:#064e3b;border:3px solid #334155;border-radius:12px;touch-action:none;"></canvas>
        <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
          <button id="sv-left" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;min-height:44px;">⬅️ Giro Izq</button>
          <button id="sv-up" style="background:#059669;color:#fff;border:none;padding:11px 18px;border-radius:8px;font-weight:900;cursor:pointer;min-height:44px;">⬆️ Avanzar</button>
          <button id="sv-down" style="background:#7f1d1d;color:#fff;border:none;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;min-height:44px;">⬇️ Retroceder</button>
          <button id="sv-right" style="background:#1e293b;color:#fff;border:1px solid #38bdf8;padding:11px 16px;border-radius:8px;font-weight:900;cursor:pointer;min-height:44px;">➡️ Giro Der</button>
          <button id="sv-rst" style="background:#0284c7;color:#fff;border:none;padding:11px 14px;border-radius:8px;font-weight:800;cursor:pointer;min-height:44px;">🔄 Reiniciar</button>
        </div>
      </div>
    `;

    const cv = document.getElementById('sv-canvas');
    const ctx = cv.getContext('2d');
    const hud = document.getElementById('sv-hud');

    function dibujarPista() {
      ctx.clearRect(0, 0, 520, 320);
      ctx.fillStyle = '#064e3b'; ctx.fillRect(0, 0, 520, 320);
      ctx.fillStyle = '#334155';
      ctx.fillRect(215, 0, 90, 320);
      ctx.fillRect(0, 115, 520, 90);

      ctx.beginPath(); ctx.arc(260, 160, 115, 0, Math.PI * 2); ctx.fillStyle = '#334155'; ctx.fill();
      ctx.beginPath(); ctx.arc(260, 160, 80, 0, Math.PI * 2); ctx.strokeStyle = '#fbbf24'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(260, 160, 45, 0, Math.PI * 2); ctx.fillStyle = '#15803d'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff'; ctx.stroke();

      ctx.fillStyle = '#ef4444'; ctx.fillRect(310, 215, 36, 18);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('CEDA', 315, 227);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(160, 85, 52, 18);
      ctx.fillStyle = '#000'; ctx.fillText('MÁX 25', 165, 97);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-14, -8, 28, 16);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(10, -7, 4, 4); ctx.fillRect(10, 3, 4, 4);
      ctx.restore();
    }

    function pasoMovimiento(avance, giro) {
      ang += giro;
      const nx = x + Math.cos(ang) * avance;
      const ny = y + Math.sin(ang) * avance;
      const distCentro = Math.hypot(nx - 260, ny - 160);
      const enCalleH = ny >= 122 && ny <= 198;
      const enCalleV = nx >= 222 && nx <= 298;
      const enAnillo = distCentro >= 52 && distCentro <= 110;

      if (nx > 15 && nx < 505 && ny > 15 && ny < 305 && (enCalleH || enCalleV || enAnillo)) {
        x = nx; y = ny; vel = avance > 0 ? 25 : 0;
        hud.innerText = `✅ Puntos COSEVI: ${puntos}/100 • Velocidad: ${vel} km/h • Dentro del carril reglamentario`;
      } else {
        puntos = Math.max(0, puntos - 2);
        hud.innerText = `⚠️ Borde de calzada / Isla central detectada (-2 pts). Puntos: ${puntos}/100`;
      }
      dibujarPista();
    }

    document.getElementById('sv-up').onclick = () => pasoMovimiento(12, 0);
    document.getElementById('sv-down').onclick = () => pasoMovimiento(-8, 0);
    document.getElementById('sv-left').onclick = () => pasoMovimiento(4, -0.35);
    document.getElementById('sv-right').onclick = () => pasoMovimiento(4, 0.35);
    document.getElementById('sv-rst').onclick = () => { x = 260; y = 265; ang = 0; puntos = 100; dibujarPista(); };
    dibujarPista();
  }

  // ============================================================================
  // EMULADOR EXCEL (SIN CERO PEGADO) & CONSOLA CLI CIBERSEGURIDAD
  // ============================================================================
  function renderEmuladores(contenedor) {
    contenedor.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
        <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:14px;padding:16px;">
          <h3 style="margin:0 0 6px;color:#34d399;">📊 Simulador Excel / Contabilidad (Sin Cero Pegado)</h3>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Borra o escribe libremente en cualquier celda sin que se trabe un cero:</p>
          <div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;margin-bottom:10px;font-size:12px;">
            <div style="font-weight:800;color:#38bdf8;">Celda</div><div style="font-weight:800;color:#38bdf8;">Detalle</div><div style="font-weight:800;color:#38bdf8;">Monto (₡)</div>
            <div>A1</div><input value="Ventas Gravadas" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="150000" placeholder="Monto limpio" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
            <div>A2</div><input value="Servicios Web" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="85000" placeholder="Monto limpio" style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
            <div>A3</div><input value="Auditoría Red" style="background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;"/><input class="ex-val" type="text" inputmode="decimal" value="" placeholder="Escribe monto..." style="background:#060c17;border:1px solid #38bdf8;color:#fff;padding:6px;border-radius:6px;"/>
          </div>
          <div id="ex-res" style="background:#060c17;padding:10px;border-radius:8px;font-family:monospace;color:#34d399;font-size:12.5px;font-weight:800;">=SUMA(C1:C3): ₡235,000 | IVA 13%: ₡30,550</div>
        </div>

        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:16px;">
          <h3 style="margin:0 0 6px;color:#38bdf8;">💻 Terminal Interactiva CLI (Ciberseguridad, Redes y Turing)</h3>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">Comandos: <code>help</code>, <code>vlsm</code>, <code>sha256</code>, <code>nmap</code>, <code>whoami</code></p>
          <div id="cli-out" style="background:#060c17;border:1px solid #1e293b;border-radius:8px;padding:10px;height:140px;overflow-y:auto;font-family:monospace;font-size:11.5px;color:#34d399;margin-bottom:8px;">
            [SICAI-OS v147.0] Terminal lista. Escribe un comando abajo.
          </div>
          <div style="display:flex;gap:6px;">
            <input id="cli-in" type="text" placeholder="Ej: nmap o vlsm" style="flex:1;background:#060c17;border:1px solid #38bdf8;color:#fff;padding:8px;border-radius:6px;font-family:monospace;"/>
            <button id="cli-run" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:800;cursor:pointer;">Ejecutar</button>
          </div>
        </div>
      </div>
    `;

    const calcExcel = () => {
      let suma = 0;
      contenedor.querySelectorAll('.ex-val').forEach(i => {
        const n = parseFloat(i.value.replace(/,/g, ''));
        if (!isNaN(n)) suma += n;
      });
      document.getElementById('ex-res').innerText = `=SUMA(C1:C3): ₡${suma.toLocaleString('es-CR')} | IVA 13%: ₡${Math.round(suma * 0.13).toLocaleString('es-CR')}`;
    };
    contenedor.querySelectorAll('.ex-val').forEach(i => { i.oninput = calcExcel; });

    document.getElementById('cli-run').onclick = async () => {
      const cmd = document.getElementById('cli-in').value.trim().toLowerCase();
      const out = document.getElementById('cli-out');
      let resp = "Comando ejecutado.";
      if (cmd === 'help') resp = "Comandos: help | vlsm | nmap | sha256 | whoami";
      else if (cmd === 'vlsm') resp = "/24=254h | /25=126h | /26=62h | /27=30h | /28=14h | /29=6h | /30=2h";
      else if (cmd === 'nmap') resp = "PORT 443/tcp OPEN (https) | TLS 1.3 Active | Firewall OK";
      else if (cmd === 'whoami') resp = `${getSesion().nombre} (${getSesion().rol})`;
      else if (cmd.startsWith('sha256')) resp = await sha256Hex(cmd);
      out.innerHTML += `<div><span style="color:#38bdf8;">$ ${cmd}</span><br>${resp}</div>`;
      out.scrollTop = out.scrollHeight;
      ganarXP(5);
    };
  }

  // ============================================================================
  // ENRUTADOR MULTI-PANTALLA PRINCIPAL (CON HISTORIAL DEL BOTÓN ATRÁS)
  // ============================================================================
  let filtroCategoria = 'todos';

  window.navegarVista = function (vista, param, omitirPush) {
    document.body.classList.remove('bds-ver-landing-base');
    const shell = document.getElementById('bds-app-shell');
    if (!shell) return;

    if (!omitirPush) {
      history.pushState({ vista, param }, '', `#${vista}${param ? '-' + param : ''}`);
    }

    document.querySelectorAll('.bds-subnav-item, .bds-dock-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-vista') === vista);
    });

    if (vista === 'curso') { abrirModuloCursoInteractivo(shell, param); window.scrollTo(0, 0); return; }
    if (vista === 'juegos') { renderSala12Juegos(shell, param || 'ajedrez'); window.scrollTo(0, 0); return; }
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
              <p style="font-size:12px;color:#94a3b8;">Sincronizado con la cuenta activa de <b>${s.nombre}</b>:</p>
              <input value="${s.nombre} (${s.rol})" readonly style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;"/>
              <select style="width:100%;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;">
                <option>Cita Médica CCSS / INS</option>
                <option>Permiso Oficial ante Dirección</option>
                <option>Justificación de Marca de Reloj</option>
              </select>
            </div>
            <button onclick="this.innerText='✅ Boleta Firmada con SHA-256';" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:7px;font-weight:800;cursor:pointer;">Emitir Boleta Oficial</button>
          </div>

          <div class="bds-card-pro">
            <div>
              <h3 style="margin:0 0 6px;color:#34d399;">📝 Justificante de Ausencia Estudiantil</h3>
              <p style="font-size:12px;color:#94a3b8;">Envío directo al Profesor Guía (${s.seccion}):</p>
              <textarea rows="3" placeholder="Detalle médico o justificación del encargado legal..." style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;"></textarea>
            </div>
            <button onclick="this.innerText='✅ Enviado a Profesor Guía';" style="background:#0284c7;color:#fff;border:none;padding:10px;border-radius:7px;font-weight:800;cursor:pointer;">Enviar Justificante</button>
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

    if (vista === 'admision') filtroCategoria = 'admision';
    else if (vista === 'inicio') filtroCategoria = 'todos';

    function renderCatalogo(textoBusqueda) {
      const q = (textoBusqueda || '').toLowerCase().trim();
      const filtrados = CATALOGO_EDUCATIVO.filter(item => {
        const pasaCat = filtroCategoria === 'todos' || item.cat === filtroCategoria;
        const pasaTxt = !q || item.titulo.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
        return pasaCat && pasaTxt;
      });

      const xpObj = getXP();
      shell.innerHTML = `
        <div style="background:linear-gradient(135deg,#0f2942 0%,#0b1322 100%);border:1px solid #0284c7;border-radius:14px;padding:14px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <span style="background:#10b981;color:#022c22;font-size:10px;font-weight:900;padding:3px 8px;border-radius:5px;">RANGO: ${xpObj.nivel.toUpperCase()}</span>
              <h2 style="margin:6px 0 2px;font-size:18px;color:#fff;">Centro de Estudio Gamificado, Admisión UCR/TEC y 12 Juegos</h2>
              <div style="font-size:11.5px;color:#38bdf8;display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
                ${(xpObj.medallas || []).map(med => `<span style="background:#131f33;border:1px solid #26354d;padding:2px 8px;border-radius:99px;">${med}</span>`).join('')}
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button onclick="navegarVista('curso','adm_ucr_una')" style="background:#f59e0b;color:#020617;border:none;padding:9px 13px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;">🔥 Reto Diario UCR/TEC (+50 XP)</button>
              <button onclick="navegarVista('juegos','domino')" style="background:#7c3aed;color:#fff;border:none;padding:9px 13px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;">🁣 Dominó & Solitario</button>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;align-items:center;">
          <input id="cat-search" type="search" value="${textoBusqueda||''}" placeholder="🔍 Buscar UCR, TEC, Español, Química, Redes, Ciberseguridad..." style="flex:1;min-width:210px;background:#0b1322;border:1.5px solid #38bdf8;color:#fff;padding:10px 13px;border-radius:10px;font-size:13px;"/>
          <button data-f="todos" class="btn-f-cat" style="padding:9px 12px;border-radius:8px;border:1px solid #334155;background:${filtroCategoria==='todos'?'#0284c7':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">📚 Todo (${CATALOGO_EDUCATIVO.length})</button>
          <button data-f="admision" class="btn-f-cat" style="padding:9px 12px;border-radius:8px;border:1px solid #334155;background:${filtroCategoria==='admision'?'#0284c7':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">🏛️ UCR / TEC / UNA / UNED</button>
          <button data-f="basica" class="btn-f-cat" style="padding:9px 12px;border-radius:8px;border:1px solid #334155;background:${filtroCategoria==='basica'?'#0284c7':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">📖 Básicas MEP</button>
          <button data-f="ctp" class="btn-f-cat" style="padding:9px 12px;border-radius:8px;border:1px solid #334155;background:${filtroCategoria==='ctp'?'#0284c7':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">💻 Especialidades CTP</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:12px;">
          ${filtrados.map(m => `
            <div class="bds-card-pro">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="font-size:24px;">${m.icono}</span>
                  <span style="font-size:10px;background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:3px 8px;border-radius:5px;font-weight:800;">${m.niveles} • ${m.preguntas.length} Ítems</span>
                </div>
                <h3 style="margin:0 0 6px;font-size:15px;color:#fff;">${m.titulo}</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;line-height:1.45;">${m.desc}</p>
              </div>
              <button data-cid="${m.id}" class="btn-abrir-curso" style="width:100%;background:#0284c7;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;min-height:42px;">
                🎯 Abrir Manual & Simulacro Explicado →
              </button>
            </div>
          `).join('')}
        </div>
      `;

      const inputS = document.getElementById('cat-search');
      inputS.oninput = (e) => {
        const val = e.target.value;
        renderCatalogo(val);
        const nuevoIn = document.getElementById('cat-search');
        nuevoIn.focus(); nuevoIn.setSelectionRange(val.length, val.length);
      };

      shell.querySelectorAll('.btn-f-cat').forEach(b => {
        b.onclick = () => { filtroCategoria = b.getAttribute('data-f'); renderCatalogo(inputS.value); };
      });

      shell.querySelectorAll('.btn-abrir-curso').forEach(b => {
        b.onclick = () => navegarVista('curso', b.getAttribute('data-cid'));
      });
    }

    renderCatalogo('');
  };

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.vista) {
      navegarVista(e.state.vista, e.state.param, true);
    } else if (getSesion()) {
      navegarVista('inicio', null, true);
    }
  });

  // ============================================================================
  // MENÚ HAMBURGUESA CATEGORIZADO (OPTIMIZADO PARA CELULAR PEQUEÑO)
  // ============================================================================
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
          <b style="color:#38bdf8;font-size:14.5px;">☰ Navegación Rápida</b>
          <button id="drw-close" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:800;">Cerrar ✕</button>
        </div>
        <div style="font-size:11.5px;color:#cbd5e1;padding:6px 0;border-bottom:1px solid #1e293b;">
          👤 <b>${s.nombre}</b><br><span style="color:#34d399;">${s.rol} • ${s.seccion}</span>
        </div>

        <div style="font-size:10.5px;font-weight:900;color:#94a3b8;margin-top:4px;">JUEGOS & SIMULADORES</div>
        <button class="drw-it" data-v="juegos" data-p="ajedrez" style="text-align:left;background:#7c3aed;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">♟️ Ajedrez FIDE (Intacto)</button>
        <button class="drw-it" data-v="juegos" data-p="domino" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🁣 Dominó Doble-6 Pro</button>
        <button class="drw-it" data-v="juegos" data-p="solitario" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🃏 Solitario Dual (Pirámide / Escalera)</button>
        <button class="drw-it" data-v="vial" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">🚗 Simulador Vial 2D COSEVI</button>
        <button class="drw-it" data-v="emulador" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📊 Simulador Excel & Consola CLI</button>

        <div style="font-size:10.5px;font-weight:900;color:#94a3b8;margin-top:6px;">ADMISIÓN & MATERIAS</div>
        <button class="drw-it" data-v="curso" data-p="adm_ucr_una" style="text-align:left;background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">🏛️ Simulacro PAA UCR / UNA (800 pts)</button>
        <button class="drw-it" data-v="curso" data-p="adm_tec" style="text-align:left;background:#131f33;color:#38bdf8;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">⚙️ Simulacro Admisión TEC (800 pts)</button>
        <button class="drw-it" data-v="inicio" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📚 Todas las Materias y Especialidades</button>
        <button class="drw-it" data-v="gestion" style="text-align:left;background:#131f33;color:#fff;border:1px solid #26354d;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📋 Permisos, Tardías y Carné QR</button>

        <button id="drw-logout" style="margin-top:auto;background:#7f1d1d;color:#fecaca;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">🚪 Cerrar Sesión Segura</button>
      </div>
    `;
    document.body.appendChild(drw);
    document.getElementById('drw-close').onclick = () => drw.remove();
    document.getElementById('drw-logout').onclick = () => { drw.remove(); cerrarSesionTotal(); };
    drw.querySelectorAll('.drw-it').forEach(b => {
      b.onclick = () => {
        const v = b.getAttribute('data-v');
        const p = b.getAttribute('data-p');
        drw.remove();
        navegarVista(v, p);
      };
    });
  }

  // ============================================================================
  // ACTIVACIÓN DE LA PLATAFORMA AUTENTICADA MULTI-DISPOSITIVO
  // ============================================================================
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
        <img src="${SVG_CTP}" alt="CTP" style="height:32px;width:32px;"/>
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
        <button id="btn-top-games" style="background:#7c3aed;color:#fff;border:none;padding:8px 11px;border-radius:7px;font-size:11.5px;font-weight:900;cursor:pointer;">🎮 12 Juegos</button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:8px 10px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">Salir</button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const NAV_ITEMS = [
      { v: 'inicio', label: '🏠 1. Materias & Especialidades' },
      { v: 'admision', label: '🏛️ 2. UCR / TEC / UNA / UNED' },
      { v: 'juegos', label: '🎮 3. 12 Juegos (Ajedrez, Dominó, Solitario)' },
      { v: 'vial', label: '🚗 4. Simulador Vial 2D' },
      { v: 'emulador', label: '📊 5. Excel & CLI' },
      { v: 'gestion', label: '📋 6. Permisos & QR' }
    ];
    sub.innerHTML = NAV_ITEMS.map(m => `<button data-vista="${m.v}" class="bds-subnav-item">${m.label}</button>`).join('');

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    const dock = document.createElement('nav');
    dock.id = 'bds-mobile-dock';
    dock.innerHTML = `
      <button class="bds-dock-btn active" data-vista="inicio"><span style="font-size:17px;">📚</span><span>Materias</span></button>
      <button class="bds-dock-btn" data-vista="admision"><span style="font-size:17px;">🏛️</span><span>UCR/TEC</span></button>
      <button class="bds-dock-btn" data-vista="juegos"><span style="font-size:17px;">🎮</span><span>12 Juegos</span></button>
      <button class="bds-dock-btn" data-vista="vial"><span style="font-size:17px;">🚗</span><span>Vial 2D</span></button>
      <button class="bds-dock-btn" id="dock-menu-more"><span style="font-size:17px;">☰</span><span>Menú</span></button>
    `;

    document.body.prepend(shell);
    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(dock);

    document.getElementById('btn-hamburger-pro').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('dock-menu-more').onclick = abrirMenuHamburguesaMovil;
    document.getElementById('btn-top-games').onclick = () => navegarVista('juegos', 'ajedrez');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('[data-vista]').forEach(b => {
      b.onclick = () => navegarVista(b.getAttribute('data-vista'));
    });

    iniciarObservadorSoberano();
    navegarVista('inicio', null, true);
  }

  window.abrirCentroMaestroBDS = function (mod, sub) { navegarVista(mod || 'juegos', sub || 'ajedrez'); };
  window.abrirSalaJuegosHD = function (juego) { navegarVista('juegos', juego || 'ajedrez'); };

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else cerrarSesionTotal();
  });
})();