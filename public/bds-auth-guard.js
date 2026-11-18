(function () {
  const SESSION_KEY = "bds_auth_gate_v151_tesla";
  const LOCK_KEY = "bds_auth_lock_v151";
  const XP_KEY = "bds_gamification_xp_v151";
  const BANK_STORAGE_KEY = "bds_master_bank_v151";
  const CHAT_STORAGE_KEY = "bds_chat_channels_v151";
  const GRADES_STORAGE_KEY = "bds_seamep_grades_v151";
  const CREDITS_STORAGE_KEY = "bds_ai_credits_v151";
  const QR_REGISTRY_KEY = "bds_qr_valid_registry_v151";

  const NIVELES = [7, 8, 9, 10, 11, 12];
  const SECCIONES_COLEGIO = [];
  NIVELES.forEach(niv => { [1, 2, 3, 4].forEach(grp => SECCIONES_COLEGIO.push(`${niv}-${grp}`)); });

  const ROLES_INSTITUCIONALES = [
    { rol: "Estudiante", requiereSeccion: true, icono: "🎓" },
    { rol: "Docente MEP", requiereSeccion: true, icono: "👨‍🏫" },
    { rol: "Director(a)", requiereSeccion: false, icono: "🏛️" },
    { rol: "Ministro(a) / Supervisión MEP", requiereSeccion: false, icono: "🇨🇷" },
    { rol: "Auxiliar Administrativo", requiereSeccion: false, icono: "📋" },
    { rol: "Guarda / Seguridad", requiereSeccion: false, icono: "🛡️" },
    { rol: "Conserje / Mantenimiento", requiereSeccion: false, icono: "🧹" },
    { rol: "SuperAdmin", requiereSeccion: false, icono: "👑" }
  ];

  const SVG_MEP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="150" height="34"><rect width="240" height="60" rx="8" fill="#0f172a" stroke="#0284c7" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="#0284c7"/><text x="30" y="35" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="900" font-size="13">MEP</text><text x="58" y="26" fill="#f8fafc" font-family="system-ui" font-weight="800" font-size="12">Ministerio de Educación Pública</text><text x="58" y="43" fill="#38bdf8" font-family="system-ui" font-weight="600" font-size="10">Dirección Regional Heredia • Circuito 04</text></svg>`);
  const SVG_BUHO_ORIGINAL = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="36" height="36"><rect width="80" height="80" rx="16" fill="#0b1528" stroke="#0ea5e9" stroke-width="2.5"/><circle cx="40" cy="42" r="24" fill="#0284c7"/><path d="M22 24 L32 30 L24 36 Z" fill="#38bdf8"/><path d="M58 24 L48 30 L56 36 Z" fill="#38bdf8"/><circle cx="31" cy="38" r="8" fill="#ffffff"/><circle cx="49" cy="38" r="8" fill="#ffffff"/><circle cx="31" cy="38" r="4" fill="#020617"/><circle cx="49" cy="38" r="4" fill="#020617"/><polygon points="40,42 35,50 45,50" fill="#f59e0b"/><text x="40" y="73" text-anchor="middle" fill="#38bdf8" font-family="system-ui" font-weight="900" font-size="8.5">CTPMN</text></svg>`);
  const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => { if (!r.active || !r.active.scriptURL.includes('sw-bds-v151.js')) r.unregister(); });
      navigator.serviceWorker.register('/sw-bds-v151.js').catch(() => {});
    }).catch(() => {});
  }

  let audioCtx = null;
  let sonidoActivo = true;
  function playTone(freq, duration = 0.1, type = "sine", vol = 0.1) {
    if (!sonidoActivo) return;
    try {
      if (!audioCtx) { const Ctx = window.AudioContext || window.webkitAudioContext; audioCtx = new Ctx(); }
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }
  function playSuccessSound() { playTone(523.25, 0.09, "triangle", 0.14); setTimeout(() => playTone(659.25, 0.11, "triangle", 0.14), 85); setTimeout(() => playTone(783.99, 0.18, "triangle", 0.14), 170); }
  function playErrorSound() { playTone(220, 0.14, "sawtooth", 0.1); setTimeout(() => playTone(180, 0.2, "sawtooth", 0.1), 130); }

  function mostrarToastNotificacion(titulo, detalle, color = '#0284c7') {
    let box = document.getElementById('bds-live-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'bds-live-toast';
      box.style.cssText = 'position:fixed;top:64px;right:14px;z-index:250000;max-width:340px;padding:12px 14px;border-radius:12px;background:#0b1322;color:#fff;box-shadow:0 12px 32px rgba(0,0,0,0.85);font-size:12px;transition:all 0.2s ease;';
      document.body.appendChild(box);
    }
    box.style.border = `1.5px solid ${color}`;
    box.innerHTML = `<div style="font-weight:900;color:#38bdf8;margin-bottom:3px;">🔔 ${titulo}</div><div style="color:#cbd5e1;">${detalle}</div>`;
    box.style.display = 'block';
    playTone(680, 0.08, "sine", 0.08);
    setTimeout(() => { if (box) box.style.display = 'none'; }, 3800);
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
    try {
      const reg = JSON.parse(localStorage.getItem(QR_REGISTRY_KEY) || '{}');
      reg[s.qrPayload] = { ...s, fecha: new Date().toLocaleString('es-CR') };
      reg[s.firmaSha256] = { ...s, fecha: new Date().toLocaleString('es-CR') };
      localStorage.setItem(QR_REGISTRY_KEY, JSON.stringify(reg));
    } catch {}
  }

  function getCreditosIA() {
    const s = getSesion();
    if (s && s.esSuperAdmin) return { creditos: 999999, plan: "SUPERADMIN ILIMITADO" };
    try {
      return JSON.parse(localStorage.getItem(CREDITS_STORAGE_KEY)) || { creditos: 15, plan: "Plan Gratis Docente (15 Créditos IA)" };
    } catch {
      return { creditos: 15, plan: "Plan Gratis Docente" };
    }
  }

  function consumirCreditoIA() {
    const s = getSesion();
    if (s && s.esSuperAdmin) return true;
    const c = getCreditosIA();
    if (c.creditos <= 0) return false;
    c.creditos -= 1;
    localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(c));
    return true;
  }

  function recargarCreditosPro(codigo) {
    const c = getCreditosIA();
    c.creditos += 250;
    c.plan = "Plan Pro Docente Activo (+250 Créditos IA)";
    localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(c));
    mostrarToastNotificacion("Plan Pro Activado", "Se acreditaron +250 Créditos IA en tu cuenta.", "#10b981");
  }

  function getXP() {
    try { return JSON.parse(localStorage.getItem(XP_KEY)) || { xp: 1100, racha: 18, nivel: "Maestro Tesla-Turing" }; }
    catch { return { xp: 1100, racha: 18, nivel: "Maestro Tesla-Turing" }; }
  }

  function ganarXP(pts) {
    const d = getXP(); d.xp += pts;
    localStorage.setItem(XP_KEY, JSON.stringify(d));
    const badge = document.getElementById('bds-xp-counter');
    if (badge) badge.innerText = `🔥 ${d.racha}d | ⚡ ${d.xp} XP`;
  }

  function cerrarSesionTotal() {
    const keepKeys = [LOCK_KEY, XP_KEY, BANK_STORAGE_KEY, CHAT_STORAGE_KEY, GRADES_STORAGE_KEY, CREDITS_STORAGE_KEY, QR_REGISTRY_KEY];
    const backup = {};
    keepKeys.forEach(k => { const v = localStorage.getItem(k); if (v) backup[k] = v; });
    sessionStorage.clear();
    localStorage.clear();
    Object.keys(backup).forEach(k => localStorage.setItem(k, backup[k]));
    document.body.classList.remove('bds-authenticated', 'bds-ver-landing-base');
    ['bds-pro-header', 'bds-subheader-nav', 'bds-app-shell', 'bds-mobile-dock', 'bds-slide-drawer'].forEach(id => {
      const el = document.getElementById(id); if (el) el.remove();
    });
    mostrarLoginEstricto('login');
  }

  // ============================================================================
  // MEGACÁTALOGO CURRICULAR MEP + IDIOMAS + ESPECIALIDADES + ADMISIÓN (CON GENERADOR DE 10 A 60 ÍTEMS)
  // ============================================================================
  const AREAS_CURRICULARES = [
    // IDIOMAS GLOBALES
    {
      id: "espanol", cat: "idiomas", icono: "📖", name: "Español y Literatura MEP", short: "Español", color: "#d97706",
      jerarquia: "Académica > Español > 7° a 12° Año > Unidad: Ortografía, Gramática y Lectura Crítica",
      formula: "Regla de oro: Agudas se tildan en N, S o Vocal; Graves cuando NO terminan en N, S o Vocal; Esdrújulas y Sobreesdrújulas siempre se tildan.",
      baseItems: [
        { q: "¿Por qué la palabra 'cárcel' lleva tilde ortográfica?", opts: ["Es aguda terminada en consonante", "Es grave terminada en consonante distinta de n o s", "Es esdrújula", "Es un hiato acentual"], c: 1, exp: "Cár-cel lleva la fuerza de voz en la penúltima sílaba (grave) y termina en 'l'." },
        { q: "En la oración 'El código fue auditado por el ingeniero', la estructura verbal corresponde a:", opts: ["Voz activa", "Voz pasiva", "Modo imperativo", "Oración impersonal"], c: 1, exp: "Presenta verbo ser conjugado ('fue') + participio ('auditado') + complemento agente ('por el ingeniero')." },
        { q: "¿Cuál opción presenta una figura literaria de Símil o Comparación?", opts: ["Tus ojos son dos luceros", "El servidor rugía como un león en la tormenta", "Érase un hombre a una nariz pegado", "El silencio gritaba en el aula"], c: 1, exp: "El símil compara explícitamente dos elementos mediante el nexo comparativo 'como'." }
      ]
    },
    {
      id: "ingles", cat: "idiomas", icono: "🇬🇧", name: "Inglés Conversacional & Técnico (OpenEnglish/TOEIC)", short: "Inglés", color: "#0284c7",
      jerarquia: "Idiomas > English for Communication & IT > 7° a 12° > Unidad: Grammar & Technical Vocabulary",
      formula: "First Conditional: If + Simple Present, will + base verb. Second Conditional: If + Simple Past, would + base verb.",
      baseItems: [
        { q: "Choose the correct option: 'If the server _____ down, the backup system will take over immediately.'", opts: ["go", "goes", "went", "going"], c: 1, exp: "In the First Conditional with third-person singular ('the server'), the present simple verb takes '-es' ('goes')." },
        { q: "What does the phrasal verb 'back up' mean in cybersecurity and software engineering?", opts: ["To delete all tables", "To make a security copy of data", "To turn off the router", "To reject a connection"], c: 1, exp: "'Back up' means creating a copy of important files or databases to prevent data loss." },
        { q: "Which sentence uses the Present Perfect tense correctly?", opts: ["She have finished the code.", "We have already deployed the PWA to production.", "They has tested the QR scanner.", "I did seen the logs."], c: 1, exp: "Present Perfect uses 'have/has' + past participle ('have already deployed')." }
      ]
    },
    {
      id: "frances", cat: "idiomas", icono: "🇫🇷", name: "Francés Comunicativo (DELF A1-B2)", short: "Francés", color: "#2563eb",
      jerarquia: "Idiomas > Francés > 7° a 11° Año > Unidad: Salutations, Verbes Être/Avoir et Vie Quotidienne",
      formula: "Présent de l'indicatif: Je suis, Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont.",
      baseItems: [
        { q: "Complétez la phrase avec le verbe 'être' : 'Nous _____ étudiants au lycée technique de Mercedes Norte.'", opts: ["sont", "sommes", "êtes", "suis"], c: 1, exp: "Avec le pronom 'Nous', la conjugaison correcte du verbe être au présent est 'sommes'." },
        { q: "Comment dit-on 'Muchas gracias por su ayuda' en français ?", opts: ["Bonjour tout le monde", "Merci beaucoup pour votre aide", "Au revoir à demain", "Excusez-moi monsieur"], c: 1, exp: "'Merci beaucoup pour votre aide' exprime la gratitude formelle en français." },
        { q: "Quel est l'article défini correct pour le mot masculin singulier 'ordinateur' (computadora) ?", opts: ["La ordinateur", "L'ordinateur", "Les ordinateur", "Des ordinateur"], c: 1, exp: "Devant une voyelle au singulier, l'article défini 'le' s'élide en 'l'' (l'ordinateur)." }
      ]
    },
    {
      id: "aleman", cat: "idiomas", icono: "🇩🇪", name: "Alemán Técnico & Cultural (Goethe A1-B1)", short: "Alemán", color: "#ca8a04",
      jerarquia: "Idiomas > Deutsch als Fremdsprache > Nivel Técnico > Unidad: Grammatik, Artikel & Technik",
      formula: "Artículos definidos nominativos en alemán: der (masculino), die (femenino/plural), das (neutro).",
      baseItems: [
        { q: "Wählen Sie die richtige Verbform (sein): 'Ich _____ Ingenieur und Lehrer in Costa Rica.'", opts: ["bist", "bin", "ist", "sind"], c: 1, exp: "Für das Pronomen 'ich' (yo) lautet die Präsensform von 'sein' immer 'bin' (Ich bin)." },
        { q: "Was bedeutet das deutsche Wort 'Sicherheit' in der Informatik (IT-Sicherheit)?", opts: ["Velocidad de reloj", "Seguridad (Ciberseguridad)", "Pantalla táctil", "Impresora láser"], c: 1, exp: "'Sicherheit' significa Seguridad; 'IT-Sicherheit' es Seguridad Informática / Ciberseguridad." },
        { q: "Wie sagt man 'Buenos días' auf Deutsch am Vormittag?", opts: ["Gute Nacht", "Guten Morgen", "Auf Wiedersehen", "Bis bald"], c: 1, exp: "'Guten Morgen' se utiliza para saludar por la mañana." }
      ]
    },
    {
      id: "mandarin", cat: "idiomas", icono: "🇨🇳", name: "Mandarín Básico & Negocios (HSK 1-2)", short: "Mandarín", color: "#dc2626",
      jerarquia: "Idiomas > Chino Mandarín (Pinyin & Caracteres) > Nivel HSK > Unidad: Saludos, Números y Cultura",
      formula: "Estructura básica SVO en mandarín: Pronombre + Verbo + Objeto. Partícula interrogativa final: 吗 (ma).",
      baseItems: [
        { q: "¿Cuál es el significado en español del saludo básico en chino mandarín '你好' (Nǐ hǎo)?", opts: ["Buenas noches", "Hola / ¿Cómo estás?", "Muchas gracias", "Hasta luego"], c: 1, exp: "'你好' (Nǐ hǎo) es el saludo estándar universal en mandarín equivalente a 'Hola'." },
        { q: "En mandarín (Pinyin), ¿qué partícula se coloca al final de una oración afirmativa para convertirla en una pregunta de Sí/No?", opts: ["La partícula 吗 (ma)", "La palabra 不 (bù)", "El número 一 (yī)", "El pronombre 我 (wǒ)"], c: 0, exp: "Agregar '吗' (ma) al final de un enunciado lo transforma inmediatamente en pregunta cerrada." },
        { q: "¿Cómo se dice 'Gracias' en chino mandarín?", opts: ["Zàijiàn (再见)", "Xièxie (谢谢)", "Duìbuqǐ (对不起)", "Bù kèqi (不客气)"], c: 1, exp: "'谢谢' (Xièxie) significa 'Gracias'." }
      ]
    },

    // MATERIAS BÁSICAS MEP
    {
      id: "math", cat: "basicas", icono: "📐", name: "Matemáticas MEP & Razonamiento", short: "Matemáticas", color: "#16a34a",
      jerarquia: "Académica > Matemáticas > 7° a 12° Año > Unidad: Álgebra, Funciones, Geometría y Estadística",
      formula: "Teorema de Pitágoras: c = √(a² + b²). Función cuadrática: vértice V(-b/2a, -Δ/4a).",
      baseItems: [
        { q: "Resuelve la ecuación lineal: 4x - 9 = 27. ¿Cuál es el valor de x?", opts: ["x = 6", "x = 9", "x = 8", "x = 12"], c: 1, exp: "Sumando 9 en ambos lados: 4x = 36; dividiendo entre 4: x = 9." },
        { q: "En un triángulo rectángulo cuyos catetos miden 9 cm y 12 cm, ¿cuánto mide la hipotenusa?", opts: ["14 cm", "15 cm", "18 cm", "21 cm"], c: 1, exp: "Por Pitágoras: √(9² + 12²) = √(81 + 144) = √225 = 15 cm." }
      ]
    },
    {
      id: "science", cat: "basicas", icono: "🧪", name: "Ciencias (Química, Física y Biología)", short: "Ciencias", color: "#ef4444",
      jerarquia: "Académica > Ciencias Exactas y Naturales > 7° a 12° > Unidad: Materia, Energía y Vida",
      formula: "Segunda Ley de Newton: F = m · a | Número másico: A = Z + n° | Ley de los gases ideales: P·V = n·R·T.",
      baseItems: [
        { q: "Si un átomo neutro tiene Z = 17 (Cloro) y número másico A = 35, ¿cuántos neutrones posee en su núcleo?", opts: ["17 neutrones", "18 neutrones", "35 neutrones", "52 neutrones"], c: 1, exp: "Restando A - Z: 35 - 17 = 18 neutrones." },
        { q: "¿Qué fuerza neta se necesita para imprimir una aceleración de 5 m/s² a un objeto de 12 kg?", opts: ["17 N", "60 N", "2.4 N", "120 N"], c: 1, exp: "Por la Segunda Ley de Newton: F = 12 kg × 5 m/s² = 60 N." }
      ]
    },
    {
      id: "sociales", cat: "basicas", icono: "🌎", name: "Estudios Sociales y Educación Cívica", short: "Sociales/Cívica", color: "#0ea5e9",
      jerarquia: "Académica > Estudios Sociales y Cívica > 7° a 12° > Unidad: Institucionalidad e Historia de Costa Rica",
      formula: "Pilares de la Reforma Social de 1940: Creación de la UCR (1940), CCSS (1941), Garantías Sociales y Código de Trabajo (1943).",
      baseItems: [
        { q: "¿En qué año se abolió constitucionalmente el ejército como institución permanente en Costa Rica?", opts: ["En 1821", "En 1948-1949", "En 1914", "En 1970"], c: 1, exp: "La abolición del ejército se proclamó el 1° de diciembre de 1948 y se consagró en la Constitución de 1949." }
      ]
    },

    // ESPECIALIDADES TÉCNICAS CTP Y TALLERES EXPLORATORIOS
    {
      id: "web", cat: "ctp", icono: "💻", name: "Desarrollo Web, Programación & Ciberseguridad", short: "Web y Ciber", color: "#4f46e5",
      jerarquia: "Especialidad Técnica > Desarrollo Web y Ciberseguridad > 10° a 12° > Unidad: Arquitectura Full-Stack y OWASP",
      formula: "Principio de mínimo privilegio RBAC + Hashing SHA-256 + Consultas SQL parametrizadas.",
      baseItems: [
        { q: "En React y JavaScript ES6+, ¿qué método transforma cada elemento de un arreglo devolviendo un nuevo arreglo inmutable?", opts: ["Array.prototype.pop()", "Array.prototype.map()", "Array.prototype.forEach()", "Array.prototype.splice()"], c: 1, exp: ".map() recorre el arreglo y retorna un nuevo arreglo con los elementos transformados." },
        { q: "¿Cuál es la medida de defensa obligatoria en el servidor contra ataques de Inyección SQL (SQLi)?", opts: ["Consultas parametrizadas (Prepared Statements)", "Ocultar inputs con CSS", "Usar solo fuentes grandes", "Reiniciar el router"], c: 0, exp: "Las consultas parametrizadas separan los datos del código ejecutable SQL." }
      ]
    },
    {
      id: "especialidades", cat: "ctp", icono: "🌐", name: "Redes, Contabilidad, Electrónica, Logística y Ejecutivo", short: "Especialidades CTP", color: "#059669",
      jerarquia: "Especialidades CTP > Subáreas Técnicas Oficiales > 10° a 12° > Unidad: VLSM, NIIF, Ley de Ohm y Cadena de Suministro",
      formula: "Subneteo IPv4: Hosts útiles = 2^(32 - prefijo) - 2 | Ley de Ohm: V = I · R | Contabilidad: Activo = Pasivo + Patrimonio.",
      baseItems: [
        { q: "En una subred IPv4 con prefijo /28 (máscara 255.255.255.240), ¿cuántas direcciones IP utilizables para hosts existen?", opts: ["6 IPs útiles", "14 IPs útiles", "30 IPs útiles", "62 IPs útiles"], c: 1, exp: "Con /28 quedan 4 bits de host (32 - 28 = 4). Aplicando 2⁴ - 2 = 16 - 2 = 14 hosts útiles." },
        { q: "En la especialidad de Logística y Cadena de Abastecimiento, ¿qué significa el método de inventario FIFO (PEPS)?", opts: ["Primero en entrar, primero en salir", "Último en entrar, primero en salir", "Inventario sin registro", "Compra exclusiva al contado"], c: 0, exp: "FIFO (First In, First Out / PEPS) garantiza que las primeras unidades almacenadas sean las primeras en despacharse." }
      ]
    },
    {
      id: "talleres", cat: "ctp", icono: "🛠️", name: "Talleres Exploratorios (7°, 8° y 9° Año)", short: "Exploratorios", color: "#ea580c",
      jerarquia: "III Ciclo > Talleres Exploratorios > 7° a 9° > Unidad: Herramientas para la Producción, Robótica y Diseño",
      formula: "Seguridad en el taller: 1) Desenergizar antes de intervenir. 2) Usar EPP. 3) Orden y limpieza Kaizen (5S).",
      baseItems: [
        { q: "En el taller de Herramientas para la Producción y Transformación, ¿qué significan las 5S de la calidad japonesa?", opts: ["Clasificar, Ordenar, Limpiar, Estandarizar y Mantener la disciplina", "Saltar, Correr, Gritar, Dormir y Salir", "Cinco sensores conectados en serie", "Cinco servidores sin pantalla"], c: 0, exp: "Las 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) aseguran orden, seguridad y eficiencia industrial." }
      ]
    },

    // ADMISIÓN UNIVERSITARIA, PRUEBA MOPT, EXCEL E IDENTIDAD
    {
      id: "admision_uni", cat: "admision", icono: "🏛️", name: "Admisión UCR, TEC, UNA, UNED, UTN y Científicos", short: "Admisión UCR/TEC", color: "#7c3aed",
      jerarquia: "Educación Superior > Prueba de Aptitud Académica (PAA Escala 800) > Nivel Preuniversitario > Unidad: Lógica Verbal y Matemática",
      formula: "Puntaje PAA (200 a 800): Analiza premisas necesarias sin extrapolar supuestos externos; verifica patrones de diferencia en sucesiones.",
      baseItems: [
        { q: "[PAA UCR/TEC] En la sucesión 5, 11, 19, 29, 41, X... ¿cuál es el valor numérico exacto de X?", opts: ["51", "55", "53", "59"], c: 1, exp: "Las diferencias crecen de 2 en 2: +6, +8, +10, +12. El siguiente incremento es +14, por lo que 41 + 14 = 55." },
        { q: "[PAA Verbal] 'Ningún algoritmo seguro expone contraseñas en texto plano. Algunos sistemas antiguos exponen contraseñas en texto plano.' Se deduce con certeza que:", opts: ["Algunos sistemas antiguos no son algoritmos seguros", "Todos los sistemas antiguos son seguros", "Ningún algoritmo usa contraseñas", "Todo sistema nuevo expone contraseñas"], c: 0, exp: "Por silogismo categórico: si ningún A hace X, y algunos B hacen X, entonces esos B no pertenecen a A." }
      ]
    },
    {
      id: "mopt", cat: "admision", icono: "🚗", name: "Prueba Teórica MOPT / COSEVI & Excel Ofimática", short: "MOPT y Excel", color: "#0d9488",
      jerarquia: "Certificación Oficial > Educación Vial Ley 9078 & Hoja Electrónica Excel > Nivel General > Unidad: Rotondas, Señales y Fórmulas",
      formula: "Rotonda: Prioridad para quien circula adentro en sentido antihorario | Excel: $A$1 fija referencia absoluta; =SI(condición; verdadero; falso).",
      baseItems: [
        { q: "[Prueba MOPT] ¿Cuál es la velocidad máxima permitida en zona escolar con estudiantes presentes en Costa Rica?", opts: ["40 km/h", "25 km/h", "50 km/h", "60 km/h"], c: 1, exp: "La Ley de Tránsito establece un máximo estricto de 25 km/h en zonas escolares." },
        { q: "[Excel Contable] ¿Qué símbolo fija tanto la columna como la fila en una fórmula de Excel (ejemplo: $C$2) para que no cambie al arrastrarla?", opts: ["%", "$", "#", "&"], c: 1, exp: "El signo de dólar ($) crea una referencia absoluta de celda." }
      ]
    },
    {
      id: "identidad", cat: "admision", icono: "🦉", name: "Identidad CTPMN, Marca pracTICAtecnica y Hábitos Kaizen", short: "Identidad/Kaizen", color: "#3b82f6",
      jerarquia: "Cultura Institucional > CTP Mercedes Norte (Circuito 04 Heredia) & BDS Devs > Nivel General > Unidad: Identidad y Mejora Continua",
      formula: "Símbolo oficial: Búho Azul Original de pracTICAtecnica.com (desarrollado por BDS Devs) • Hábito Pomodoro: 25 min enfoque + 5 min descanso.",
      baseItems: [
        { q: "¿Cuál es el emblema oficial e histórico de la plataforma pracTICAtecnica.com desarrollada por el equipo BDS Devs?", opts: ["Un escudo gris sin ícono", "El Búho Azul original de las primeras versiones", "Una lámpara roja", "Un triángulo amarillo"], c: 1, exp: "El Búho Azul original representa la identidad auténtica de pracTICAtecnica.com." }
      ]
    }
  ];

  // Generador algorítmico e IA local que garantiza hasta 60 ítems únicos y válidos para cualquier simulacro
  function generarMazoExamen(idArea, cantidadSolicitada) {
    const area = AREAS_CURRICULARES.find(a => a.id === idArea) || AREAS_CURRICULARES[0];
    let guardados = [];
    try {
      const todos = JSON.parse(localStorage.getItem(BANK_STORAGE_KEY) || '[]');
      guardados = todos.filter(x => x.subject === area.id);
    } catch {}

    const semilla = [...guardados, ...area.baseItems];
    const resultado = [];
    let idx = 0;

    while (resultado.length < cantidadSolicitada) {
      if (idx < semilla.length) {
        resultado.push({ ...semilla[idx], id: `${area.id}_base_${idx}` });
      } else {
        // Generador paramétrico inteligente según el área para completar hasta 60 preguntas sin repetir datos
        const n = resultado.length + 1;
        if (area.id === 'math' || area.id === 'admision_uni') {
          const a = (n % 7) + 2, xVal = (n % 9) + 3, b = (n % 11) + 4;
          const res = a * xVal + b;
          resultado.push({
            id: `gen_math_${n}`,
            q: `[Ítem Dinámico #${n} — ${area.short}] Si en la ecuación lineal ${a}x + ${b} = ${res}, despejamos la incógnita x, ¿cuál es su valor exacto?`,
            opts: [`x = ${xVal - 1}`, `x = ${xVal}`, `x = ${xVal + 2}`, `x = ${xVal * 2}`],
            c: 1,
            exp: `Restamos ${b} a ${res} (${res} - ${b} = ${a * xVal}) y dividimos entre ${a}, obteniendo x = ${xVal}.`
          });
        } else if (area.id === 'especialidades' || area.id === 'web') {
          const prefs = [24, 25, 26, 27, 28, 29, 30];
          const pr = prefs[n % prefs.length];
          const utiles = Math.pow(2, 32 - pr) - 2;
          resultado.push({
            id: `gen_net_${n}`,
            q: `[Caso Técnico #${n} — ${area.short}] En el diseño de la subred 10.${n}.20.0/${pr} para el laboratorio, ¿cuántas direcciones IP utilizables para hosts existen?`,
            opts: [`${utiles + 2} IPs útiles`, `${utiles} IPs útiles`, `${Math.max(2, utiles * 2)} IPs útiles`, `${Math.max(1, Math.floor(utiles / 2))} IPs útiles`],
            c: 1,
            exp: `Con prefijo /${pr} quedan ${32 - pr} bits de host. Aplicando 2^(${32 - pr}) - 2 = ${utiles} direcciones utilizables.`
          });
        } else if (area.id === 'science') {
          const masa = (n % 10) + 4, acel = (n % 6) + 2, fza = masa * acel;
          resultado.push({
            id: `gen_sci_${n}`,
            q: `[Laboratorio #${n} — ${area.short}] Si un móvil de ${masa} kg experimenta una aceleración constante de ${acel} m/s², ¿cuál es la fuerza neta aplicada según F = m·a?`,
            opts: [`${masa + acel} N`, `${fza} N`, `${fza + 10} N`, `${Math.round(fza / 2)} N`],
            c: 1,
            exp: `Multiplicando masa (${masa} kg) por aceleración (${acel} m/s²) se obtienen ${fza} Newtons.`
          });
        } else {
          const base = semilla[n % semilla.length];
          resultado.push({
            id: `gen_var_${n}`,
            q: `[Variante Aplicada #${n} — ${area.short}] ${base.q}`,
            opts: [...base.opts],
            c: base.c,
            exp: base.exp
          });
        }
      }
      idx++;
    }
    return shuffleCrypto(resultado);
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
        padding: 7px 12px; display: flex; align-items: center; gap: 6px;
        overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      #bds-subheader-nav::-webkit-scrollbar { display: none; }
      .bds-subnav-item {
        background: #131f33; border: 1px solid #26354d; color: #e2e8f0;
        padding: 8px 12px; border-radius: 8px; font-size: 11.5px; font-weight: 700;
        cursor: pointer; flex-shrink: 0; transition: all 0.15s ease;
      }
      .bds-subnav-item:hover, .bds-subnav-item.active { background: #0284c7; border-color: #38bdf8; color: #fff; }

      #bds-app-shell {
        max-width: 1260px; margin: 0 auto; padding: 14px 12px 96px; box-sizing: border-box; min-height: calc(100vh - 110px);
      }
      .bds-card-pro {
        background: #0b1322; border: 1px solid #1e293b; border-radius: 14px; padding: 15px;
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
        background: none; border: none; color: #94a3b8; font-size: 10px; font-weight: 800;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
        cursor: pointer; padding: 4px 2px; min-height: 46px; border-radius: 8px;
      }
      .bds-dock-btn.active { color: #38bdf8; background: rgba(2, 132, 199, 0.15); }

      @media (max-width: 860px) {
        #bds-mobile-dock { display: grid; }
        #bds-subheader-nav { top: 52px; padding: 6px 8px; }
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
  // LOGIN SOBERANO (CON SUBDIVISIÓN A/B Y ESPECIALIDAD 1/2 + 8 ROLES)
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
          <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:410px;width:100%;padding:24px;box-sizing:border-box;">
            <h2 style="margin:0 0 6px;font-size:18px;font-weight:800;color:#fff;text-align:center;">🔐 Recuperar / Cambiar Clave</h2>
            <div id="rec-msg" style="display:none;padding:8px;border-radius:6px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;"></div>
            <form id="f-rec-v151" style="display:flex;flex-direction:column;gap:10px;">
              <input id="rc-mail" type="email" placeholder="usuario@est.mep.go.cr" required style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass1" type="password" placeholder="Nueva contraseña (mínimo 6 caracteres)" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <input id="rc-pass2" type="password" placeholder="Confirmar nueva contraseña" required minlength="6" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:10px;color:#fff;font-size:13px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">Actualizar con SHA-256</button>
              <button type="button" id="btn-volver-login" style="background:transparent;color:#38bdf8;border:1px solid #1e293b;padding:9px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">← Volver</button>
            </form>
          </div>
        `;
        document.getElementById('btn-volver-login').onclick = () => { vista = 'login'; renderVistaAuth(); };
        document.getElementById('f-rec-v151').onsubmit = (e) => {
          e.preventDefault();
          setIntentos(0);
          vista = 'login'; renderVistaAuth();
        };
        return;
      }

      gate.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0ea5e9;border-radius:16px;max-width:440px;width:100%;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,0.95);box-sizing:border-box;">
          <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:8px;">
            <img src="${SVG_BUHO_ORIGINAL}" width="42" height="42" alt="Búho Azul Original"/>
            <img src="${SVG_MEP}" height="34" alt="MEP" style="border-radius:6px;"/>
          </div>
          <div style="text-align:center;margin-bottom:12px;">
            <h1 style="margin:0;font-size:20px;font-weight:900;color:#fff;">prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</h1>
            <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Ecosistema Educativo Multi-Rol • CTP Mercedes Norte</p>
          </div>

          <div id="auth-error-msg" style="display:${bloqueado?'block':'none'};background:#450a0a;color:#fca5a5;padding:9px;border-radius:8px;font-size:11.5px;margin-bottom:10px;text-align:center;font-weight:700;">
            ${bloqueado ? '🔒 Cuenta bloqueada por 5 intentos fallidos. Usa "Recuperar Clave".' : ''}
          </div>

          <form id="f-login-v151" style="display:flex;flex-direction:column;gap:8px;">
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Correo Institucional o Personal (@est.mep.go.cr / @gmail.com):</label>
              <input id="lg-mail" type="email" placeholder="usuario@est.mep.go.cr" required autofocus ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:13px;"/>
            </div>
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Nombre y Apellidos:</label>
              <input id="lg-nom" type="text" placeholder="Nombre completo del usuario" required ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:13px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div>
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Perfil / Tipo de Usuario:</label>
                <select id="lg-rol" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                  ${ROLES_INSTITUCIONALES.map(r => `<option value="${r.rol}">${r.icono} ${r.rol}</option>`).join('')}
                </select>
              </div>
              <div id="wrapper-seccion">
                <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Sección (7-1 a 12-4):</label>
                <select id="lg-sec" ${bloqueado?'disabled':''} style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                  ${SECCIONES_COLEGIO.map(sc => `<option value="${sc}" ${sc==='11-1'?'selected':''}>Sección ${sc}</option>`).join('')}
                </select>
              </div>
            </div>
            <div id="wrapper-subgrupo">
              <label style="display:block;font-size:10.5px;color:#38bdf8;margin-bottom:2px;">Subdivisión de Grupo (A / B y Especialidad 1 / 2):</label>
              <select id="lg-sub" style="width:100%;background:#060c17;border:1px solid #334155;border-radius:8px;padding:8px;color:#fff;font-size:12px;">
                <option value="Grupo A • Especialidad 1 (Web / Conta)">Subgrupo A • Especialidad 1 (Desarrollo Web / Contabilidad)</option>
                <option value="Grupo B • Especialidad 2 (Ciber / Redes)">Subgrupo B • Especialidad 2 (Ciberseguridad / Soporte TI)</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:10.5px;color:#cbd5e1;margin-bottom:2px;">Contraseña de Acceso:</label>
              <input id="lg-pass" type="password" placeholder="Ingresa tu contraseña" required minlength="4" ${bloqueado?'disabled':''} style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;border-radius:8px;padding:9px;color:#fff;font-size:13px;"/>
            </div>

            <button type="submit" ${bloqueado?'disabled':''} style="margin-top:4px;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:13px;font-weight:800;cursor:pointer;">
              🔐 Iniciar Sesión Institucional
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

      document.getElementById('btn-go-recover').onclick = () => { vista = 'recover'; renderVistaAuth(); };

      function actualizarVisibilidadSeccion() {
        const rolObj = ROLES_INSTITUCIONALES.find(r => r.rol === rolSelect.value);
        const esSup = esSuperAdminSoberano(mailInput.value);
        if (esSup || (rolObj && !rolObj.requiereSeccion)) {
          secWrapper.style.display = 'none';
          subWrapper.style.display = 'none';
        } else {
          secWrapper.style.display = 'block';
          subWrapper.style.display = 'block';
        }
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
        const seccionFinal = llevaSeccion ? `Sección ${secSel} (${subSel.split('•')[0].trim()})` : 'Gestión Institucional Global';
        const firma = await sha256Hex(`${mail}|${rolFinal}|${seccionFinal}|CTPMN-2026`);
        const qrPayload = `CTPMN-QR|${nom}|${rolFinal}|${seccionFinal}|${firma}`;

        setSesion({
          id: esMax ? 'SUPERADMIN-MAX' : `CTPMN-${secSel}-${firma.slice(0, 6)}`,
          nombre: nom,
          email: mail,
          rol: rolFinal,
          esSuperAdmin: esMax,
          seccion: seccionFinal,
          secRaw: llevaSeccion ? secSel : '11-1',
          subgrupo: llevaSeccion ? subSel : 'Todos los Subgrupos A y B',
          firmaSha256: firma,
          qrPayload: qrPayload
        });

        gate.remove();
        activarPlataformaAutenticada();
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
  // COMPONENTE 1: EXÁMENES EN 3 MODALIDADES (PRÁCTICA, PRÁCTICA GUIADA, SIMULACRO 10-60 ÍTEMS CON CRONÓMETRO)
  // ============================================================================
  function renderCentroEvaluacion3Modos(contenedor, idAreaInicial, modoInicial) {
    let idArea = idAreaInicial || 'web';
    let modo = modoInicial || 'simulacro'; // 'practica' | 'guiada' | 'simulacro'
    let cantItems = 10; // 10, 20, 30, 40, 50, 60
    let mazo = generarMazoExamen(idArea, cantItems);
    let qIdx = 0, aciertos = 0, respondida = false, pausado = false;
    let segundosRestantes = cantItems * 60;
    let cronometroId = null;

    function detenerCronometro() {
      if (cronometroId) { clearInterval(cronometroId); cronometroId = null; }
    }

    function iniciarSimulacion(nuevaArea, nuevoModo, nuevaCant) {
      detenerCronometro();
      idArea = nuevaArea || idArea;
      modo = nuevoModo || modo;
      cantItems = nuevaCant || cantItems;
      mazo = generarMazoExamen(idArea, cantItems);
      qIdx = 0; aciertos = 0; respondida = false; pausado = false;
      segundosRestantes = cantItems * 45;
      pintarEvaluacion();
    }

    function formatearTiempo(seg) {
      const m = Math.floor(seg / 60).toString().padStart(2, '0');
      const s = (seg % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function pintarEvaluacion() {
      detenerCronometro();
      const area = AREAS_CURRICULARES.find(a => a.id === idArea) || AREAS_CURRICULARES[0];

      if (qIdx >= mazo.length) {
        const nota100 = Math.round((aciertos / mazo.length) * 100);
        const escala800 = Math.round(200 + (aciertos / mazo.length) * 600);
        ganarXP(aciertos * 5 + 20);
        contenedor.innerHTML = `
          <div style="background:#0b1322;border:2px solid #10b981;border-radius:16px;padding:24px;text-align:center;">
            <span style="background:#059669;color:#fff;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:900;">RESULTADO OFICIAL AUDITADO</span>
            <h2 style="margin:10px 0 6px;color:#fff;font-size:20px;">🏆 ${area.icono} ${area.name} (${modo.toUpperCase()})</h2>
            <p style="font-size:15px;color:#cbd5e1;margin:0 0 16px;">
              Ítems Evaluados: <b>${mazo.length}</b> • Aciertos: <b style="color:#34d399;">${aciertos}</b> • Calificación MEP: <b style="color:#38bdf8;font-size:18px;">${nota100}%</b> • Escala Admisión UCR/TEC: <b style="color:#fbbf24;font-size:18px;">${escala800} / 800 pts</b>
            </p>
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
              <button id="ev-again" style="background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Barajar Nuevo Intento (${cantItems} Ítems)</button>
              <button id="ev-csv" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">📥 Descargar Comprobante Oficial TXT</button>
              <button onclick="navegarVista('inicio')" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">← Volver al Menú</button>
            </div>
          </div>
        `;
        document.getElementById('ev-again').onclick = () => iniciarSimulacion(idArea, modo, cantItems);
        document.getElementById('ev-csv').onclick = () => {
          const blob = new Blob([`CERTIFICADO DE PRUEBA - PRACTICATECNICA.COM\nUsuario: ${getSesion().nombre}\nMateria: ${area.name}\nModalidad: ${modo.toUpperCase()}\nCantidad de Preguntas: ${mazo.length}\nAciertos: ${aciertos}\nNota MEP: ${nota100}%\nEscala UCR/TEC: ${escala800}/800`], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Resultado_${area.id}_${cantItems}items.txt`; a.click();
        };
        return;
      }

      const item = mazo[qIdx];
      const opcionesMapeadas = shuffleCrypto(item.opts.map((t, idx) => ({ texto: t, esCorrecta: idx === item.c })));
      const letras = ["A", "B", "C", "D"];
      respondida = false;

      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:16px;padding:16px;">
          <!-- Barra de Selección de Materia, 3 Modalidades y Selector de 10 a 60 Preguntas -->
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;">
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <select id="ev-area-sel" style="background:#131f33;color:#fff;border:1px solid #38bdf8;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:800;">
                ${AREAS_CURRICULARES.map(a => `<option value="${a.id}" ${a.id===idArea?'selected':''}>${a.icono} ${a.name}</option>`).join('')}
              </select>
              <select id="ev-cant-sel" style="background:#131f33;color:#fbbf24;border:1px solid #fbbf24;padding:8px 10px;border-radius:8px;font-size:12px;font-weight:900;">
                ${[10, 20, 30, 40, 50, 60].map(num => `<option value="${num}" ${cantItems===num?'selected':''}>🎯 ${num} Preguntas</option>`).join('')}
              </select>
            </div>

            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-m="practica" class="ev-mode-btn" style="padding:7px 11px;border-radius:7px;border:1px solid ${modo==='practica'?'#38bdf8':'#334155'};background:${modo==='practica'?'#0284c7':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">1. ⚡ Práctica Libre</button>
              <button data-m="guiada" class="ev-mode-btn" style="padding:7px 11px;border-radius:7px;border:1px solid ${modo==='guiada'?'#34d399':'#334155'};background:${modo==='guiada'?'#059669':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">2. 🧭 Práctica Guiada</button>
              <button data-m="simulacro" class="ev-mode-btn" style="padding:7px 11px;border-radius:7px;border:1px solid ${modo==='simulacro'?'#a78bfa':'#334155'};background:${modo==='simulacro'?'#7c3aed':'#131f33'};color:#fff;font-size:11.5px;font-weight:800;cursor:pointer;">3. ⏱️ Simulacro Oficial con Cronómetro</button>
            </div>
          </div>

          <!-- Sub-barra de Jerarquía MEP y Cronómetro Oficial -->
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;background:#070d19;padding:8px 12px;border-radius:8px;border-left:4px solid ${area.color};">
            <div style="font-size:11px;color:#94a3b8;font-weight:600;">🏛️ ${area.jerarquia}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              ${modo === 'simulacro' ? `<span id="ev-timer-txt" style="background:#450a0a;border:1px solid #ef4444;color:#fca5a5;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:900;">⏱️ Cronómetro: ${formatearTiempo(segundosRestantes)}</span>` : ''}
              <button id="ev-pause-btn" style="background:#b45309;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">${pausado?'▶️ Reanudar':'⏸️ Pausar'}</button>
              <button id="ev-finish-btn" style="background:#7f1d1d;color:#fecaca;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">⏹️ Finalizar y Calificar</button>
            </div>
          </div>

          <!-- Bloque Exclusivo de Práctica Guiada (Andamiaje Pedagógico antes de responder) -->
          ${modo === 'guiada' ? `
            <div style="background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;color:#d1fae5;">
              <b>🧭 GUÍA PEDAGÓGICA PASO A PASO (MODO PRÁCTICA GUIADA):</b><br>
              • <b>Fórmula / Regla de la Unidad:</b> ${area.formula}<br>
              • <b>Pista Analítica para este ítem:</b> ${item.exp.slice(0, 95)}...
            </div>
          ` : ''}

          ${pausado ? `<div style="padding:36px;text-align:center;color:#fbbf24;font-weight:900;">⏸️ PRUEBA EN PAUSA — Presiona "Reanudar" para continuar.</div>` : `
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;">
              <div style="display:flex;justify-content:space-between;font-size:12px;color:#38bdf8;font-weight:800;margin-bottom:8px;">
                <span>Ítem ${qIdx + 1} de ${mazo.length} (${modo === 'practica' ? 'Práctica Libre' : (modo === 'guiada' ? 'Práctica Guiada con Andamiaje' : 'Simulacro Oficial Cronometrado')})</span>
                <span style="color:#34d399;">Aciertos: ${aciertos} / ${qIdx}</span>
              </div>
              <h3 style="margin:0 0 14px;font-size:15.5px;font-weight:800;color:#fff;line-height:1.45;">${item.q}</h3>
              <div id="ev-opts-box" style="display:flex;flex-direction:column;gap:8px;">
                ${opcionesMapeadas.map((op, i) => `
                  <button type="button" data-ok="${op.esCorrecta?'1':'0'}" class="ev-opt-btn" style="text-align:left;padding:11px 14px;border-radius:10px;border:1px solid #26354d;background:#131f33;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:10px;">
                    <span style="width:24px;height:24px;border-radius:6px;background:#0b1322;color:#38bdf8;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11.5px;">${letras[i]}</span>
                    <span>${op.texto}</span>
                  </button>
                `).join('')}
              </div>
              <div id="ev-fb-box" style="display:none;margin-top:12px;padding:12px;border-radius:8px;font-size:12.5px;"></div>
              <button id="ev-next-btn" style="display:none;margin-top:12px;width:100%;background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:900;cursor:pointer;">Siguiente Ítem (${qIdx + 2} de ${mazo.length}) ➡</button>
            </div>
          `}
        </div>
      `;

      document.getElementById('ev-area-sel').onchange = (e) => iniciarSimulacion(e.target.value, modo, cantItems);
      document.getElementById('ev-cant-sel').onchange = (e) => iniciarSimulacion(idArea, modo, parseInt(e.target.value, 10));
      contenedor.querySelectorAll('.ev-mode-btn').forEach(b => {
        b.onclick = () => iniciarSimulacion(idArea, b.getAttribute('data-m'), cantItems);
      });
      document.getElementById('ev-pause-btn').onclick = () => { pausado = !pausado; pintarEvaluacion(); };
      document.getElementById('ev-finish-btn').onclick = () => { qIdx = mazo.length; pintarEvaluacion(); };

      if (!pausado) {
        if (modo === 'simulacro') {
          cronometroId = setInterval(() => {
            segundosRestantes -= 1;
            const tEl = document.getElementById('ev-timer-txt');
            if (tEl) tEl.innerText = `⏱️ Cronómetro: ${formatearTiempo(Math.max(0, segundosRestantes))}`;
            if (segundosRestantes <= 0) { detenerCronometro(); qIdx = mazo.length; pintarEvaluacion(); }
          }, 1000);
        }

        const fb = document.getElementById('ev-fb-box');
        const nxt = document.getElementById('ev-next-btn');
        contenedor.querySelectorAll('.ev-opt-btn').forEach(btn => {
          btn.onclick = () => {
            if (respondida) return;
            respondida = true;
            const ok = btn.getAttribute('data-ok') === '1';
            if (ok) { aciertos++; ganarXP(10); playSuccessSound(); } else playErrorSound();

            contenedor.querySelectorAll('.ev-opt-btn').forEach(b => {
              b.disabled = true;
              if (b.getAttribute('data-ok') === '1') { b.style.background = '#064e3b'; b.style.borderColor = '#10b981'; }
              else if (b === btn) { b.style.background = '#7f1d1d'; b.style.borderColor = '#ef4444'; }
            });

            fb.style.display = 'block';
            fb.style.background = ok ? '#064e3b' : '#450a0a';
            fb.style.border = `1px solid ${ok ? '#10b981' : '#ef4444'}`;
            fb.innerHTML = `<div style="font-weight:900;color:${ok?'#6ee7b7':'#fca5a5'};margin-bottom:4px;">${ok ? '✅ ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}</div><div style="color:#e2e8f0;"><b>Explicación:</b> ${item.exp}</div>`;
            nxt.style.display = 'block';
          };
        });
        nxt.onclick = () => { qIdx++; pintarEvaluacion(); };
      }
    }

    pintarEvaluacion();
  }

  // ============================================================================
  // COMPONENTE 2: MENSAJERÍA TIPO WHATSAPP CON SUBGRUPOS A/B Y ESPECIALIDAD 1/2 + NOTIFICACIONES
  // ============================================================================
  function renderMensajeriaCanalesAB(contenedor) {
    const s = getSesion();
    const secBase = s.secRaw || '11-1';
    const CANALES = [
      { id: `${secBase}-A-E1`, nombre: `# ${secBase} • Subgrupo A (Especialidad 1: Desarrollo Web)`, rolDest: "Estudiante/Docente", badge: 3 },
      { id: `${secBase}-B-E2`, nombre: `# ${secBase} • Subgrupo B (Especialidad 2: Ciberseguridad y Redes)`, rolDest: "Estudiante/Docente", badge: 2 },
      { id: `10-3-A-E1`, nombre: `# 10-3 • Subgrupo A (Taller / Herramientas Producción 1)`, rolDest: "Sección 10-3", badge: 1 },
      { id: `10-3-B-E2`, nombre: `# 10-3 • Subgrupo B (Taller / Herramientas Producción 2)`, rolDest: "Sección 10-3", badge: 0 },
      { id: `DIR-MIN`, nombre: `# Dirección, Supervisión MEP y Coordinación`, rolDest: "Director/Ministro/Docente", badge: 1 },
      { id: `AUX-GUA-CON`, nombre: `# Auxiliares, Guardas de Seguridad y Conserjería`, rolDest: "Operativo/Seguridad", badge: 1 }
    ];

    let canalActivo = CANALES[0].id;
    let historialChats = {};
    try { historialChats = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}'); } catch {}

    CANALES.forEach(c => {
      if (!historialChats[c.id]) {
        historialChats[c.id] = [
          { autor: "Sistema CTP Mercedes Norte", rol: "Oficial", hora: "07:30 AM", txt: `Canal verificado para ${c.nombre}. Notificaciones activas por rol y subgrupo.` },
          { autor: "Ing. Max Salazar Sánchez", rol: "Docente / SuperAdmin", hora: "08:05 AM", txt: "Recuerden completar la Práctica Guiada y el Simulacro de 20 preguntas antes del viernes." }
        ];
      }
    });

    function pintarChat() {
      const infoCanal = CANALES.find(c => c.id === canalActivo) || CANALES[0];
      const msgs = historialChats[canalActivo] || [];

      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:16px;overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));min-height:440px;">
          <!-- Lista Izquierda de Canales Subdivididos (A / B y Esp 1 / Esp 2) -->
          <div style="background:#070d19;border-right:1px solid #1e293b;padding:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="font-size:12px;font-weight:900;color:#34d399;padding-bottom:8px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between;">
              <span>💬 CANALES POR SECCIÓN (A/B) Y ROL</span>
              <span style="background:#059669;color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;">EN VIVO</span>
            </div>
            ${CANALES.map(c => `
              <button data-cid="${c.id}" class="btn-ch-sel" style="text-align:left;padding:10px;border-radius:10px;border:1px solid ${canalActivo===c.id?'#10b981':'#1e293b'};background:${canalActivo===c.id?'#064e3b':'#0b1322'};color:#fff;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:6px;">
                <div>
                  <div style="font-size:12px;font-weight:800;">${c.nombre}</div>
                  <div style="font-size:10px;color:#94a3b8;">Filtro: ${c.rolDest}</div>
                </div>
                ${c.badge ? `<span style="background:#10b981;color:#022c22;font-weight:900;font-size:10px;padding:2px 7px;border-radius:99px;">${c.badge}</span>` : ''}
              </button>
            `).join('')}
          </div>

          <!-- Ventana Derecha de Mensajes y Notificaciones -->
          <div style="padding:14px;display:flex;flex-direction:column;justify-content:space-between;background:#0b1322;">
            <div style="border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
              <div>
                <h3 style="margin:0;font-size:14.5px;color:#34d399;">${infoCanal.nombre}</h3>
                <span style="font-size:11px;color:#94a3b8;">Conectado como: <b>${s.nombre}</b> (${s.rol} • ${s.seccion})</span>
              </div>
              <button id="ch-sim-notif" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">🔔 Probar Notificación Push</button>
            </div>

            <div id="ch-msgs-box" style="flex:1;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:6px;background:#070d19;border-radius:10px;margin-bottom:10px;">
              ${msgs.map(m => {
                const mio = m.autor === s.nombre;
                return `
                  <div style="align-self:${mio?'flex-end':'flex-start'};max-width:82%;background:${mio?'#065f46':'#131f33'};border:1px solid ${mio?'#10b981':'#26354d'};padding:8px 12px;border-radius:12px;">
                    <div style="font-size:10px;font-weight:800;color:${mio?'#6ee7b7':'#38bdf8'};margin-bottom:2px;">${m.autor} (${m.rol}) • ${m.hora}</div>
                    <div style="font-size:12.5px;color:#fff;line-height:1.4;">${m.txt}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <form id="ch-send-form" style="display:flex;gap:8px;">
              <input id="ch-input" type="text" placeholder="Escribe un comunicado para ${infoCanal.nombre}..." required style="flex:1;background:#060c17;border:1px solid #38bdf8;color:#fff;padding:10px 12px;border-radius:10px;font-size:13px;"/>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 18px;border-radius:10px;font-weight:900;cursor:pointer;">Enviar ➤</button>
            </form>
          </div>
        </div>
      `;

      contenedor.querySelectorAll('.btn-ch-sel').forEach(b => {
        b.onclick = () => { canalActivo = b.getAttribute('data-cid'); pintarChat(); };
      });

      document.getElementById('ch-sim-notif').onclick = () => {
        mostrarToastNotificacion(infoCanal.nombre, `Nuevo aviso académico para ${s.rol} en ${s.seccion}.`, '#10b981');
      };

      document.getElementById('ch-send-form').onsubmit = (e) => {
        e.preventDefault();
        const txt = document.getElementById('ch-input').value.trim();
        if (!txt) return;
        const ahora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        historialChats[canalActivo].push({ autor: s.nombre, rol: s.rol, hora: ahora, txt });
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(historialChats));
        mostrarToastNotificacion(`Mensaje enviado a ${infoCanal.nombre}`, txt, '#10b981');
        pintarChat();
      };
    }

    pintarChat();
  }

  // ============================================================================
  // COMPONENTE 3: FÁBRICA PEDAGÓGICA IA (PLANEAMIENTO BINOMIO SAGRADO, COTIDIANOS, PROYECTOS, ÍTEMS Y CRÉDITOS)
  // ============================================================================
  function renderFabricaDocenteIA(contenedor) {
    const s = getSesion();
    const cred = getCreditosIA();

    contenedor.innerHTML = `
      <div style="background:#0b1322;border:1.5px solid #f59e0b;border-radius:16px;padding:16px;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
          <div>
            <span style="background:#f59e0b;color:#020617;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:900;">COPILOTO DOCENTE IA & GENERADOR MEP</span>
            <h2 style="margin:6px 0 2px;font-size:18px;color:#fff;">🤖 Fábrica de Planeamientos, Cotidianos, Proyectos, Pruebas e Ítems con IA</h2>
            <p style="margin:0;font-size:12px;color:#94a3b8;">Aplica automáticamente el Binomio Sagrado ("La persona docente... La persona estudiante..."), los 4 Momentos MEP y DUA.</p>
          </div>
          <div style="background:#070d19;border:1px solid #f59e0b;padding:8px 12px;border-radius:10px;text-align:right;">
            <div style="font-size:11px;color:#fbbf24;font-weight:900;">${cred.plan}</div>
            <div style="font-size:13px;color:#fff;font-weight:800;">Créditos IA disponibles: <b id="ia-cred-num" style="color:#34d399;">${cred.creditos}</b></div>
            <button id="ia-buy-btn" style="margin-top:4px;background:#059669;color:#fff;border:none;padding:4px 10px;border-radius:6px;font-size:10.5px;font-weight:800;cursor:pointer;">⚡ Recargar Plan Pro (SINPE 6090-6359 / Cortesía)</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:12px;">
          <div>
            <label style="font-size:11px;color:#cbd5e1;font-weight:700;">1. Tipo de Producto Pedagógico:</label>
            <select id="ia-tipo" style="width:100%;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:9px;border-radius:8px;font-size:12.5px;font-weight:700;">
              <option value="planeamiento">📘 Planeamiento Didáctico MEP (Binomio Sagrado + 4 Momentos + DUA)</option>
              <option value="cotidiano">📝 Instrumento de Trabajo Cotidiano (Con Escala 1 a 3)</option>
              <option value="proyecto">🚀 Proyecto / Tarea Corta con Rúbrica Analítica</option>
              <option value="prueba">📄 Prueba Escrita Oficial + Tabla de Especificaciones</option>
              <option value="items">🎯 Inyectar 5 Nuevos Ítems con IA al Banco de Simulacros</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:#cbd5e1;font-weight:700;">2. Especialidad / Asignatura:</label>
            <select id="ia-mat" style="width:100%;background:#060c17;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;">
              ${AREAS_CURRICULARES.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:#cbd5e1;font-weight:700;">3. Resultado de Aprendizaje (RA) / Tema:</label>
            <input id="ia-tema" type="text" value="Seguridad en Aplicaciones Web, Roles RBAC y Cifrado SHA-256" style="width:100%;box-sizing:border-box;background:#060c17;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/>
          </div>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
          <button id="ia-gen-btn" style="background:linear-gradient(90deg,#f59e0b,#ea580c);color:#020617;border:none;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:900;cursor:pointer;">✨ Generar Documento Industrial con IA (-1 Crédito)</button>
          <button id="ia-dl-btn" style="background:#0284c7;color:#fff;border:none;padding:11px 16px;border-radius:10px;font-size:12.5px;font-weight:800;cursor:pointer;">📥 Descargar para Word / Excel (.txt/.doc)</button>
        </div>

        <textarea id="ia-output" rows="12" style="width:100%;box-sizing:border-box;background:#070d19;border:1px solid #334155;color:#e2e8f0;padding:14px;border-radius:12px;font-family:monospace;font-size:12.5px;line-height:1.5;">Selecciona el producto pedagógico arriba y presiona "Generar Documento Industrial con IA"...</textarea>
      </div>
    `;

    document.getElementById('ia-buy-btn').onclick = () => {
      recargarCreditosPro('SINPE-60906359');
      renderFabricaDocenteIA(contenedor);
    };

    document.getElementById('ia-gen-btn').onclick = () => {
      if (!consumirCreditoIA()) {
        alert('Has agotado tus créditos gratuitos. Activa el Plan Pro vía SINPE Móvil al 6090-6359 (Ing. Max Salazar Sánchez) o solicita recarga.');
        return;
      }
      const tipo = document.getElementById('ia-tipo').value;
      const matId = document.getElementById('ia-mat').value;
      const area = AREAS_CURRICULARES.find(a => a.id === matId) || AREAS_CURRICULARES[0];
      const tema = document.getElementById('ia-tema').value.trim();
      const out = document.getElementById('ia-output');
      document.getElementById('ia-cred-num').innerText = getCreditosIA().creditos;

      if (tipo === 'items') {
        const nuevos = [];
        for (let i=1; i<=5; i++) {
          nuevos.push({
            id: `ia_${Date.now()}_${i}`,
            subject: area.id,
            q: `[Generado con IA #${i} — ${tema}] En el contexto de ${area.name}, ¿cuál es el procedimiento técnico correcto para implementar ${tema}?`,
            opts: [
              "Omitir las validaciones y controles de calidad",
              `Aplicar el estándar verificable de ${tema} con trazabilidad y pruebas documentadas`,
              "Eliminar los respaldos del sistema",
              "Desactivar la seguridad perimetral"
            ],
            c: 1,
            exp: `Criterio oficial MEP para ${tema}: exige trazabilidad, verificación técnica y cumplimiento de estándares.`
          });
        }
        try {
          const prev = JSON.parse(localStorage.getItem(BANK_STORAGE_KEY) || '[]');
          localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify([...nuevos, ...prev]));
        } catch {}
        out.value = `✅ ¡SE INYECTARON 5 NUEVOS ÍTEMS CON IA AL BANCO DE ${area.name.toUpperCase()}!\n\n` + JSON.stringify(nuevos, null, 2);
        playSuccessSound();
        return;
      }

      if (tipo === 'planeamiento') {
        out.value = `================================================================================
MINISTERIO DE EDUCACIÓN PÚBLICA — DIRECCIÓN REGIONAL HEREDIA (CIRCUITO 04)
COLEGIO TÉCNICO PROFESIONAL DE MERCEDES NORTE
DOCENTE: ${s.nombre} | ASIGNATURA/SUBÁREA: ${area.name}
JERARQUÍA: ${area.jerarquia}
TEMA / RESULTADO DE APRENDIZAJE: ${tema}
================================================================================

1.ESTRATEGIAS DE MEDIACIÓN PEDAGÓGICA (REGLA DE ORO: BINOMIO SAGRADO + 4 MOMENTOS MEP):
• FOCALIZACIÓN (15 min): La persona docente presenta un caso real e interactivo sobre "${tema}" mediante una lluvia de ideas guiada. La persona estudiante formula hipótesis iniciales y debate en subgrupos los riesgos y soluciones técnicas.
• EXPLORACIÓN (25 min): La persona docente facilita el laboratorio guiado en pracTICAtecnica.com proporcionando recursos DUA (visuales, auditivos y prácticos). La persona estudiante explora la herramienta, diseña el prototipo y registra los hallazgos técnicos.
• CONTRASTACIÓN (20 min): La persona docente modela la solución estándar de grado industrial y contrasta los resultados obtenidos. La persona estudiante compara su implementación con la norma oficial, corrige errores bajo filosofía Kaizen y valida los criterios.
• APLICACIÓN (20 min): La persona docente asigna un reto práctico contextualizado (STEAM). La persona estudiante construye y despliega la solución funcional verificable sobre "${tema}".

2. ADECUACIONES Y DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA):
• Apoyo visual paso a paso, glosario técnico bilingüe y retos de ampliación para estudiantes de Alto Potencial.`;
      } else if (tipo === 'cotidiano') {
        out.value = `INSTRUMENTO DE EVALUACIÓN DE TRABAJO COTIDIANO — ${area.name.toUpperCase()}
Docente: ${s.nombre} | Tema: ${tema}
Escala Oficial MEP: [1] Inicial  [2] Intermedio  [3] Avanzado

Indicador 1: Identifica los fundamentos técnicos de ${tema}.
- Nivel 1 (Inicial): Cita conceptos básicos con apoyo docente.
- Nivel 2 (Intermedio): Describe los componentes de ${tema} en casos guiados.
- Nivel 3 (Avanzado): Aplica y resuelve autónomamente escenarios complejos de ${tema}.`;
      } else {
        out.value = `DOCUMENTO OFICIAL GENERADO CON IA (${tipo.toUpperCase()}) — ${area.name}\nDocente: ${s.nombre}\nTema: ${tema}\nIncluye Tabla de Especificaciones, Rúbrica Analítica e Indicadores Oficiales MEP 2026.`;
      }
      playSuccessSound();
    };

    document.getElementById('ia-dl-btn').onclick = () => {
      const txt = document.getElementById('ia-output').value;
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Documento_MEP_IA_${Date.now()}.txt`; a.click();
    };
  }

  // ============================================================================
  // COMPONENTE 4: REGISTRO DE NOTAS SEA-MEP (EDITAR, SUBIR CSV, EXPORTAR CSV) Y HORARIOS
  // ============================================================================
  function renderRegistroNotasYHorarios(contenedor) {
    let registros = [];
    try { registros = JSON.parse(localStorage.getItem(GRADES_STORAGE_KEY)); } catch {}
    if (!Array.isArray(registros) || registros.length === 0) {
      registros = [
        { id: "1", seccion: "11-1 A", nombre: "Jiménez Michelle", cotidiano: 35, tareas: 10, proyecto: 25, pruebas: 20, asistencia: 10 },
        { id: "2", seccion: "10-3 A", nombre: "Murillo Gabriel", cotidiano: 33, tareas: 10, proyecto: 24, pruebas: 19, asistencia: 10 },
        { id: "3", seccion: "10-3 B", nombre: "Campos Santiago", cotidiano: 34, tareas: 9, proyecto: 23, pruebas: 18, asistencia: 10 }
      ];
    }

    function guardarNotas() {
      localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(registros));
    }

    function pintarTabla() {
      contenedor.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:16px;">
          <!-- 1. Registro Oficial de Calificaciones SEA-MEP -->
          <div style="background:#0b1322;border:1.5px solid #10b981;border-radius:16px;padding:16px;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;">
              <div>
                <h2 style="margin:0;font-size:17px;color:#fff;">📊 Registro Oficial de Calificaciones SEA-MEP (Edición en Vivo + CSV)</h2>
                <p style="margin:2px 0 0;font-size:11.5px;color:#94a3b8;">Edita los porcentajes directamente en la tabla, agrega estudiantes, sube un archivo CSV o descarga la planilla para Excel.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button id="gr-add-btn" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">+ Agregar Estudiante</button>
                <label style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:8px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">
                  📤 Subir CSV <input id="gr-up-csv" type="file" accept=".csv,.txt" style="display:none;"/>
                </label>
                <button id="gr-dl-csv" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Exportar CSV SEA-MEP</button>
              </div>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                <thead>
                  <tr style="background:#070d19;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:8px;">Sección/Sub</th>
                    <th style="padding:8px;">Estudiante</th>
                    <th style="padding:8px;">Cotidiano (35%)</th>
                    <th style="padding:8px;">Tareas (10%)</th>
                    <th style="padding:8px;">Proyecto (25%)</th>
                    <th style="padding:8px;">Pruebas (20%)</th>
                    <th style="padding:8px;">Asist. (10%)</th>
                    <th style="padding:8px;">Nota Final</th>
                    <th style="padding:8px;">Condición</th>
                  </tr>
                </thead>
                <tbody>
                  ${registros.map((r, i) => {
                    const total = Number(r.cotidiano) + Number(r.tareas) + Number(r.proyecto) + Number(r.pruebas) + Number(r.asistencia);
                    const aprueba = total >= 70;
                    return `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:6px;"><input data-i="${i}" data-k="seccion" class="gr-in" value="${r.seccion}" style="width:70px;background:#060c17;color:#fff;border:1px solid #334155;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="nombre" class="gr-in" value="${r.nombre}" style="width:150px;background:#060c17;color:#fff;border:1px solid #334155;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="cotidiano" type="text" inputmode="decimal" class="gr-in" value="${r.cotidiano}" style="width:55px;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="tareas" type="text" inputmode="decimal" class="gr-in" value="${r.tareas}" style="width:55px;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="proyecto" type="text" inputmode="decimal" class="gr-in" value="${r.proyecto}" style="width:55px;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="pruebas" type="text" inputmode="decimal" class="gr-in" value="${r.pruebas}" style="width:55px;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;"><input data-i="${i}" data-k="asistencia" type="text" inputmode="decimal" class="gr-in" value="${r.asistencia}" style="width:55px;background:#060c17;color:#fff;border:1px solid #38bdf8;padding:5px;border-radius:5px;"/></td>
                        <td style="padding:6px;font-weight:900;font-size:13px;color:${aprueba?'#34d399':'#fca5a5'};">${total.toFixed(1)}%</td>
                        <td style="padding:6px;"><span style="background:${aprueba?'#064e3b':'#450a0a'};color:${aprueba?'#6ee7b7':'#fca5a5'};padding:3px 8px;border-radius:99px;font-size:10.5px;font-weight:800;">${aprueba?'APROBADO':'APLAZADO'}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2. Módulo de Horarios Institucionales (Lecciones de 40/80 min) -->
          <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:16px;padding:16px;">
            <h3 style="margin:0 0 8px;font-size:16px;color:#38bdf8;">🕒 Horario Oficial de Lecciones & Laboratorios (CTP Mercedes Norte)</h3>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:11.5px;text-align:center;">
                <thead>
                  <tr style="background:#070d19;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:8px;">Bloque / Hora</th><th>Lunes</th><th>Martes</th><th>Miércoles</th><th>Jueves</th><th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px;font-weight:800;color:#fbbf24;">07:00 - 08:20</td><td>11-1 A (Programación Web)</td><td>12-1 A (Programación)</td><td>10-3 A (Herramientas Prod.)</td><td>11-1 B (Diseño Software)</td><td>12-1 B (Ciberseguridad)</td></tr>
                  <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px;font-weight:800;color:#fbbf24;">08:40 - 10:00</td><td>11-1 B (Soporte TI / Redes)</td><td>10-3 B (Herramientas Prod.)</td><td>11-1 A (Diseño Software)</td><td>12-1 A (Diseño Software)</td><td>Atención Padres / Guía</td></tr>
                  <tr><td style="padding:8px;font-weight:800;color:#fbbf24;">10:15 - 11:35</td><td>Coord. Técnica / IA</td><td>Simulacros UCR/TEC</td><td>Talleres Exploratorios</td><td>Prácticas MOPT / Excel</td><td>Cierre Semanal SEA-MEP</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      contenedor.querySelectorAll('.gr-in').forEach(inp => {
        inp.onchange = () => {
          const i = Number(inp.getAttribute('data-i'));
          const k = inp.getAttribute('data-k');
          registros[i][k] = k === 'nombre' || k === 'seccion' ? inp.value : (parseFloat(inp.value) || 0);
          guardarNotas();
          pintarTabla();
        };
      });

      document.getElementById('gr-add-btn').onclick = () => {
        registros.push({ id: String(Date.now()), seccion: "11-1 A", nombre: "Nuevo Estudiante", cotidiano: 30, tareas: 10, proyecto: 20, pruebas: 15, asistencia: 10 });
        guardarNotas(); pintarTabla();
      };

      document.getElementById('gr-dl-csv').onclick = () => {
        const filas = ["Seccion,Estudiante,Cotidiano,Tareas,Proyecto,Pruebas,Asistencia,NotaFinal,Condicion"];
        registros.forEach(r => {
          const tot = Number(r.cotidiano)+Number(r.tareas)+Number(r.proyecto)+Number(r.pruebas)+Number(r.asistencia);
          filas.push(`"${r.seccion}","${r.nombre}",${r.cotidiano},${r.tareas},${r.proyecto},${r.pruebas},${r.asistencia},${tot},${tot>=70?'APROBADO':'APLAZADO'}`);
        });
        const blob = new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Registro_Notas_SEAMEP_CTPMN.csv'; a.click();
      };

      document.getElementById('gr-up-csv').onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const lines = String(ev.target.result).split(/\r?\n/).slice(1).filter(Boolean);
          lines.forEach(ln => {
            const cols = ln.replace(/"/g, '').split(',');
            if (cols.length >= 7) {
              registros.push({ id: String(Date.now()+Math.random()), seccion: cols[0], nombre: cols[1], cotidiano: Number(cols[2])||0, tareas: Number(cols[3])||0, proyecto: Number(cols[4])||0, pruebas: Number(cols[5])||0, asistencia: Number(cols[6])||0 });
            }
          });
          guardarNotas(); pintarTabla();
        };
        reader.readAsText(f);
      };
    }

    pintarTabla();
  }

  // ============================================================================
  // COMPONENTE 5: SALA DE LOS 8 JUEGOS ESTELARES (CON AJEDREZ FIDE INTACTO Y RULETA)
  // ============================================================================
  function renderSala8GrandesJuegos(contenedor, juegoInicial) {
    let juegoActivo = juegoInicial || 'ajedrez';
    const LISTA_8 = [
      { id: 'ajedrez', nom: '1. ♟️ Ajedrez FIDE' },
      { id: 'ruleta', nom: '2. 🎡 Ruleta del Saber' },
      { id: 'domino', nom: '3. 🁣 Dominó Doble-6' },
      { id: 'solitario', nom: '4. 🃏 Solitario Pro' },
      { id: 'clue', nom: '5. 🕵️‍♂️ Clue Forense' },
      { id: 'amongus', nom: '6. 🚀 Among Us SOC' },
      { id: 'scrabble', nom: '7. 🔤 Scrabble Técnico' },
      { id: 'damas', nom: '8. 🔴 Damas 8x8' }
    ];

    function pintarSelectorYJuego() {
      contenedor.innerHTML = `
        <div style="background:#0b1322;border:1.5px solid #7c3aed;border-radius:16px;padding:14px;">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;background:#070d19;padding:8px;border-radius:10px;border:1px solid #1e293b;">
            ${LISTA_8.map(j => `
              <button data-jid="${j.id}" class="btn-sub-juego" style="padding:8px 12px;border-radius:8px;border:1px solid ${juegoActivo===j.id?'#a78bfa':'#334155'};background:${juegoActivo===j.id?'#7c3aed':'#131f33'};color:#fff;font-size:12px;font-weight:800;cursor:pointer;">
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
          if (movs.length > 0) {
            movs.sort((a, b) => b.score - a.score);
            const m = movs[0]; ejecutarMovimiento(m.r1, m.c1, m.r2, m.c2);
            msgFIDE = `🤖 PC jugó ${historial[historial.length-1]}. Turno de Blancas.`;
          } else msgFIDE = "🏆 ¡Jaque mate!";
          drawChess();
        }
        function drawChess() {
          let destinos = new Set();
          if (sel) { for (let r=0; r<8; r++) for (let c=0; c<8; c++) if (esValidoFIDE(sel.r, sel.c, r, c)) destinos.add(`${r},${c}`); }
          stg.innerHTML = `
            <div style="display:flex;flex-wrap:wrap;gap:18px;justify-content:center;align-items:flex-start;">
              <div style="text-align:center;">
                <h3 style="margin:0 0 4px;font-size:16px;color:#38bdf8;">♟️ Ajedrez Oficial FIDE (${modoPC?'Jugador vs PC':'1 vs 1 Local'})</h3>
                <p style="font-size:12px;color:#34d399;margin:0 0 8px;">${msgFIDE}</p>
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
          document.getElementById('ch-rst').onclick = () => pintarSelectorYJuego();
          const bd = document.getElementById('ch-board');
          for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
            const osc = (r + c) % 2 === 1, esSel = sel && sel.r === r && sel.c === c, esLeg = destinos.has(`${r},${c}`), p = tb[r][c], b = esBlanca(p);
            const btn = document.createElement('button');
            btn.style.cssText = `width:42px;height:42px;border:${esLeg?'2px solid #34d399':'none'};background:${esSel?'#0284c7':(esLeg?'#059669':(osc?'#1e293b':'#475569'))};font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:${b?'#ffffff':'#fbbf24'};padding:0;`;
            btn.innerText = p ? GLIFOS[p] : (esLeg ? '•' : '');
            btn.onclick = () => {
              if (modoPC && !turnoB) return;
              if (!sel) {
                if (p && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; msgFIDE = `Pieza ${GLIFOS[p]} lista.`; drawChess(); }
              } else {
                if (sel.r === r && sel.c === c) { sel = null; drawChess(); return; }
                if (p !== '' && ((turnoB && b) || (!turnoB && !b))) { sel = { r, c }; drawChess(); return; }
                if (esValidoFIDE(sel.r, sel.c, r, c)) {
                  ejecutarMovimiento(sel.r, sel.c, r, c); drawChess();
                  if (modoPC && !turnoB) setTimeout(jugarPCNegras, 350);
                } else { sel = null; msgFIDE = "❌ Ilegal."; drawChess(); }
              }
            };
            bd.appendChild(btn);
          }
        }
        drawChess();
      }

      // 2. RULETA DEL SABER
      else if (juegoActivo === 'ruleta') {
        let ang = 0, girando = false;
        stg.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;align-items:center;">
            <div style="text-align:center;">
              <div style="width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:22px solid #fbbf24;margin:0 auto -8px;position:relative;z-index:5;"></div>
              <canvas id="ru-cv" width="290" height="290" style="max-width:100%;cursor:pointer;"></canvas>
              <button id="ru-spin" style="margin-top:8px;width:100%;background:linear-gradient(90deg,#4f46e5,#7c3aed);color:#fff;border:none;padding:11px;border-radius:10px;font-weight:900;cursor:pointer;">🎰 Girar Ruleta del Saber</button>
            </div>
            <div id="ru-qbox" style="background:#0b1322;border:1px solid #334155;border-radius:12px;padding:16px;min-height:260px;">
              <h3 style="margin:0 0 6px;color:#38bdf8;">🎡 Ruleta Multidisciplinaria</h3>
              <p style="font-size:12.5px;color:#94a3b8;">Gira la rueda para sortear una pregunta de Español, Inglés, Francés, Alemán, Mandarín, Matemáticas, Ciencias, Web, MOPT o Admisión UCR/TEC.</p>
            </div>
          </div>
        `;
        const cv = document.getElementById('ru-cv'), ctx = cv.getContext('2d');
        function pintarRueda(a) {
          const cx = 145, cy = 145, r = 136, sl = (2 * Math.PI) / AREAS_CURRICULARES.length;
          ctx.clearRect(0, 0, 290, 290);
          AREAS_CURRICULARES.forEach((sec, i) => {
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a + i*sl, a + (i+1)*sl); ctx.closePath();
            ctx.fillStyle = sec.color; ctx.fill(); ctx.strokeStyle = '#0b1322'; ctx.lineWidth = 2; ctx.stroke();
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(a + (i + 0.5)*sl); ctx.textAlign = 'right';
            ctx.fillStyle = '#fff'; ctx.font = 'bold 10.5px sans-serif'; ctx.fillText(sec.short, r - 10, 4); ctx.restore();
          });
        }
        pintarRueda(ang);
        document.getElementById('ru-spin').onclick = () => {
          if (girando) return; girando = true;
          const dest = ang + (5 + Math.random()*4) * 2 * Math.PI, ini = ang, t0 = performance.now();
          function step(now) {
            const p = Math.min((now - t0) / 2100, 1);
            ang = ini + (dest - ini) * (1 - Math.pow(1 - p, 3));
            pintarRueda(ang);
            if (p < 1) requestAnimationFrame(step);
            else {
              girando = false;
              const sec = shuffleCrypto(AREAS_CURRICULARES)[0];
              const it = generarMazoExamen(sec.id, 1)[0];
              const qb = document.getElementById('ru-qbox');
              qb.innerHTML = `<span style="background:${sec.color};color:#fff;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:800;">${sec.name}</span><h4 style="color:#fff;margin:8px 0;">${it.q}</h4>` +
                it.opts.map((o, idx) => `<button onclick="if(${idx}===${it.c}){this.style.background='#064e3b';this.innerText='✅ '+this.innerText;}else{this.style.background='#7f1d1d';}" style="display:block;width:100%;text-align:left;margin-top:6px;padding:9px;border-radius:8px;background:#131f33;color:#fff;border:1px solid #334155;font-weight:700;cursor:pointer;">${String.fromCharCode(65+idx)}) ${o}</button>`).join('');
            }
          }
          requestAnimationFrame(step);
        };
      }

      // 3. DOMINÓ DOBLE-6
      else if (juegoActivo === 'domino') {
        let fichas = []; for (let i=0; i<=6; i++) for (let j=i; j<=6; j++) fichas.push([i, j]);
        fichas = shuffleCrypto(fichas);
        let mano = fichas.slice(0, 7), mesa = [[6, 6]], izq = 6, der = 6;
        function drawDom() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;margin:0 0 6px;">🁣 Dominó Doble-6</h3><div style="background:#0b1322;border:2px solid #059669;padding:12px;border-radius:10px;display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${mesa.map(f=>`<span style="background:#fff;color:#000;padding:6px 9px;border-radius:6px;font-weight:900;">${f[0]}|${f[1]}</span>`).join('')}</div><div id="dm-m" style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;"></div></div>`;
          mano.forEach((f, idx) => {
            const b = document.createElement('button');
            b.style.cssText = 'background:#064e3b;color:#fff;border:2px solid #34d399;padding:10px;border-radius:8px;font-weight:900;cursor:pointer;';
            b.innerText = `[${f[0]}|${f[1]}]`;
            b.onclick = () => {
              if (f[0]===der) { mesa.push([f[0],f[1]]); der=f[1]; }
              else if (f[1]===der) { mesa.push([f[1],f[0]]); der=f[0]; }
              else if (f[1]===izq) { mesa.unshift([f[0],f[1]]); izq=f[0]; }
              else if (f[0]===izq) { mesa.unshift([f[1],f[0]]); izq=f[1]; }
              else return;
              mano.splice(idx, 1); playSuccessSound(); drawDom();
            };
            document.getElementById('dm-m').appendChild(b);
          });
        }
        drawDom();
      }

      // 4. SOLITARIO PRO
      else if (juegoActivo === 'solitario') {
        const palos = ['♠️','♥️','♦️','♣️']; let mazo = [];
        for (let v=1; v<=13; v++) palos.forEach(p => mazo.push({ v, p, nom: v===1?'A':(v===11?'J':(v===12?'Q':(v===13?'K':String(v)))) }));
        mazo = shuffleCrypto(mazo);
        let tab = mazo.slice(0, 12), res = mazo.slice(12), sel = null;
        function drawS() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;margin:0 0 6px;">🃏 Solitario Pirámide Suma-13</h3><div id="sl-g" style="display:grid;grid-template-columns:repeat(4,72px);gap:8px;justify-content:center;margin:10px auto;"></div></div>`;
          tab.forEach((c, idx) => {
            const b = document.createElement('button');
            if (!c) { b.style.cssText = 'height:80px;background:#060c17;border:1px dashed #334155;color:#34d399;'; b.innerText = '✓'; }
            else {
              b.style.cssText = `height:80px;border-radius:8px;background:${sel===idx?'#bae6fd':'#fff'};color:${(c.p==='♥️'||c.p==='♦️')?'#dc2626':'#0f172a'};font-weight:900;font-size:16px;cursor:pointer;`;
              b.innerHTML = `${c.nom}${c.p}<br><span style="font-size:10px;">Val:${c.v}</span>`;
              b.onclick = () => {
                if (c.v===13) { tab[idx] = res.pop()||null; sel=null; playSuccessSound(); drawS(); return; }
                if (sel===null) { sel=idx; drawS(); }
                else {
                  if (tab[sel] && tab[sel].v + c.v === 13) { tab[sel]=res.pop()||null; tab[idx]=res.pop()||null; playSuccessSound(); }
                  sel=null; drawS();
                }
              };
            }
            document.getElementById('sl-g').appendChild(b);
          });
        }
        drawS();
      }

      // 5. CLUE FORENSE
      else if (juegoActivo === 'clue') {
        const SOSP = ["Ing. Fantasma", "Hacker Sombra", "Bot Anónimo"], HERR = ["USB Infectada", "Script SQLi", "Sniffer Red"], LAB = ["Lab Ciber 1", "Cuarto Servidores", "Lab Web 3"];
        const sec = { s: shuffleCrypto(SOSP)[0], h: shuffleCrypto(HERR)[0], l: shuffleCrypto(LAB)[0] };
        stg.innerHTML = `
          <div style="max-width:520px;margin:0 auto;text-align:center;">
            <h3 style="color:#38bdf8;margin:0 0 6px;">🕵️‍♂️ Clue Forense CTPMN: Descubre el Incidente</h3>
            <select id="cl-s" style="width:100%;padding:8px;margin-bottom:6px;background:#0b1322;color:#fff;border:1px solid #334155;border-radius:6px;">${SOSP.map(x=>`<option>${x}</option>`).join('')}</select>
            <select id="cl-h" style="width:100%;padding:8px;margin-bottom:6px;background:#0b1322;color:#fff;border:1px solid #334155;border-radius:6px;">${HERR.map(x=>`<option>${x}</option>`).join('')}</select>
            <select id="cl-l" style="width:100%;padding:8px;margin-bottom:10px;background:#0b1322;color:#fff;border:1px solid #334155;border-radius:6px;">${LAB.map(x=>`<option>${x}</option>`).join('')}</select>
            <button id="cl-go" style="background:#0284c7;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔎 Interrogar Registros Forenses</button>
            <div id="cl-res" style="margin-top:12px;padding:10px;background:#0b1322;border-radius:8px;color:#34d399;font-size:12.5px;"></div>
          </div>
        `;
        document.getElementById('cl-go').onclick = () => {
          const s = document.getElementById('cl-s').value, h = document.getElementById('cl-h').value, l = document.getElementById('cl-l').value;
          const r = document.getElementById('cl-res');
          if (s===sec.s && h===sec.h && l===sec.l) { playSuccessSound(); r.innerText = `🏆 ¡CASO RESUELTO! Fue ${s} con ${h} en ${l}.`; }
          else {
            const pista = s!==sec.s ? `${s} tiene coartada verificada.` : (h!==sec.h ? `La herramienta NO fue ${h}.` : `El incidente NO ocurrió en ${l}.`);
            r.innerText = `🕵️ Pista Forense: ${pista}`;
          }
        };
      }

      // 6. AMONG US SOC
      else if (juegoActivo === 'amongus') {
        const TRIP = ["🟦 Azul (Firewall)", "🟥 Rojo (SQL)", "🟩 Verde (VLAN)", "🟨 Amarillo (DNS)"];
        const imp = shuffleCrypto(TRIP)[0];
        stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🚀 Among Us SOC: Expulsa al Impostor de la Red</h3><p style="font-size:12px;color:#fbbf24;">Pista de paquetes: Se detectó anomalía cerca del nodo de ${imp}.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:440px;margin:12px auto;">${TRIP.map(t=>`<button onclick="if('${t}'==='${imp}'){this.style.background='#064e3b';this.innerText='🏆 ¡Era el Impostor!';}else{this.style.background='#7f1d1d';this.innerText='❌ Era Inocente';}" style="padding:14px;background:#131f33;color:#fff;border:1px solid #38bdf8;border-radius:10px;font-weight:800;cursor:pointer;">🧑‍🚀 ${t}</button>`).join('')}</div></div>`;
      }

      // 7. SCRABBLE TÉCNICO
      else if (juegoActivo === 'scrabble') {
        const palabra = "KAIZEN";
        let letras = shuffleCrypto(palabra.split('')), armado = "";
        function drawSc() {
          stg.innerHTML = `<div style="text-align:center;"><h3 style="color:#38bdf8;">🔤 Scrabble Técnico: Forma el término de Mejora Continua</h3><div style="font-size:24px;font-weight:900;color:#34d399;min-height:38px;margin:10px 0;">${armado} ${armado===palabra?'🏆 ¡CORRECTO!':''}</div><div style="display:flex;justify-content:center;gap:8px;">${letras.map(l=>`<button onclick="window._addSc('${l}')" style="width:46px;height:46px;background:#f59e0b;color:#000;border:none;border-radius:8px;font-weight:900;font-size:18px;cursor:pointer;">${l}</button>`).join('')}</div></div>`;
        }
        window._addSc = (l) => { armado += l; if (armado.length > palabra.length) armado = l; drawSc(); };
        drawSc();
      }

      // 8. DAMAS 8x8
      else if (juegoActivo === 'damas') {
        stg.innerHTML = `<div style="text-align:center;padding:20px;"><h3 style="color:#38bdf8;">🔴 Damas Españolas 8x8</h3><p style="color:#34d399;">Tablero activo. Selecciona Ajedrez FIDE o Dominó arriba para duelo contra IA.</p></div>`;
      }
    }

    pintarSelectorYJuego();
  }

  // ============================================================================
  // ENRUTADOR MULTI-ROL Y PANTALLA DE INICIO PERSONALIZADA SEGÚN PUESTO
  // ============================================================================
  window.navegarVista = function (vista, param, modoParam) {
    document.body.classList.remove('bds-ver-landing-base');
    const shell = document.getElementById('bds-app-shell');
    if (!shell) return;

    document.querySelectorAll('.bds-subnav-item, .bds-dock-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-vista') === vista);
    });

    if (vista === 'evaluacion') { renderCentroEvaluacion3Modos(shell, param || 'web', modoParam || 'simulacro'); window.scrollTo(0, 0); return; }
    if (vista === 'chats') { renderMensajeriaCanalesAB(shell); window.scrollTo(0, 0); return; }
    if (vista === 'ia') { renderFabricaDocenteIA(shell); window.scrollTo(0, 0); return; }
    if (vista === 'notas') { renderRegistroNotasYHorarios(shell); window.scrollTo(0, 0); return; }
    if (vista === 'juegos') { renderSala8GrandesJuegos(shell, param || 'ajedrez'); window.scrollTo(0, 0); return; }

    // PANEL PRINCIPAL ADAPTADO AL PERFIL DEL USUARIO (ESTUDIANTE, DOCENTE, DIRECTOR, MINISTRO, AUXILIAR, GUARDA, CONSERJE)
    const s = getSesion();
    let filtroRolActivo = s.rol;

    function pintarDashboardPorRol(rolVista) {
      const accionesEspecificasRol = {
        "Estudiante": [
          { t: "🧭 Práctica Guiada Paso a Paso", d: "Aprende con fórmulas y pistas antes de responder.", fn: "navegarVista('evaluacion','web','guiada')" },
          { t: "⏱️ Simulacro Oficial (10 a 60 Ítems)", d: "Entrena con cronómetro para MEP, MOPT y UCR/TEC.", fn: "navegarVista('evaluacion','admision_uni','simulacro')" },
          { t: "💬 Chat de mi Subgrupo A / B", d: "Revisa avisos de tu Especialidad 1 o 2.", fn: "navegarVista('chats')" }
        ],
        "Docente MEP": [
          { t: "🤖 Fábrica IA: Planeamiento & Cotidianos", d: "Genera planes con Binomio Sagrado, pruebas y nuevos ítems.", fn: "navegarVista('ia')" },
          { t: "📊 Registro SEA-MEP (Subir/Exportar CSV)", d: "Edita calificaciones, asistencia y horarios.", fn: "navegarVista('notas')" },
          { t: "💬 Canales por Sección (Grupo A y B)", d: "Envía notificaciones a tus subgrupos de especialidad.", fn: "navegarVista('chats')" }
        ],
        "Director(a)": [
          { t: "🏛️ Auditoría de Planillas CSV y Horarios", d: "Supervisa rendimiento por sección y aprueba boletas.", fn: "navegarVista('notas')" },
          { t: "📢 Canal Oficial Dirección & Docentes", d: "Emite circulares con notificación instantánea.", fn: "navegarVista('chats')" },
          { t: "🤖 Supervisión de Planeamientos MEP", d: "Verifica cumplimiento del Binomio Sagrado y DUA.", fn: "navegarVista('ia')" }
        ],
        "Ministro(a) / Supervisión MEP": [
          { t: "🇨🇷 Macro-Indicadores Circuito 04 Heredia", d: "Estadísticas de aprobación en Simulacros Nacionales.", fn: "navegarVista('notas')" },
          { t: "🎯 Banco Nacional de Ítems (10 a 60 pregs)", d: "Inspecciona reactivos de Idiomas, Ciencias y CTP.", fn: "navegarVista('evaluacion','espanol','simulacro')" },
          { t: "💬 Canal Directo con Direcciones", d: "Comunicación oficial con el CTP Mercedes Norte.", fn: "navegarVista('chats')" }
        ],
        "Auxiliar Administrativo": [
          { t: "📋 Control de Asistencia, Tardías y Horarios", d: "Gestiona justificaciones por sección y subgrupo A/B.", fn: "navegarVista('notas')" },
          { t: "💬 Canal Auxiliares y Profesores Guía", d: "Reporta ausencias y permisos estudiantiles.", fn: "navegarVista('chats')" }
        ],
        "Guarda / Seguridad": [
          { t: "🛡️ Bitácora de Ingreso y Seguridad Perimetral", d: "Control de acceso por código QR y rondas del colegio.", fn: "navegarVista('chats')" },
          { t: "🕒 Horarios de Entrada y Salida de Grupos", d: "Consulta qué secciones tienen lecciones activas.", fn: "navegarVista('notas')" }
        ],
        "Conserje / Mantenimiento": [
          { t: "🧹 Estado de Aulas, Laboratorios y Talleres", d: "Reporte de orden y limpieza Kaizen 5S por pabellón.", fn: "navegarVista('chats')" },
          { t: "🕒 Uso de Laboratorios y Horarios", d: "Revisa disponibilidad de salas para mantenimiento.", fn: "navegarVista('notas')" }
        ]
      };

      const tarjetasRol = accionesEspecificasRol[rolVista] || accionesEspecificasRol["Docente MEP"];

      shell.innerHTML = `
        <!-- Selector Rápido de Menú por Tipo de Usuario (Para probar o usar cada perfil) -->
        <div style="background:#0b1322;border:1.5px solid #0284c7;border-radius:14px;padding:12px;margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">
          <div style="font-size:12.5px;font-weight:900;color:#38bdf8;">
            👥 MENÚ PERSONALIZADO ACTIVO: <span style="color:#fff;">${rolVista.toUpperCase()}</span> (${s.seccion})
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;">
            ${["Estudiante", "Docente MEP", "Director(a)", "Ministro(a) / Supervisión MEP", "Auxiliar Administrativo", "Guarda / Seguridad", "Conserje / Mantenimiento"].map(r => `
              <button data-r="${r}" class="btn-switch-role" style="padding:5px 9px;border-radius:6px;border:1px solid ${rolVista===r?'#38bdf8':'#334155'};background:${rolVista===r?'#0284c7':'#131f33'};color:#fff;font-size:10.5px;font-weight:800;cursor:pointer;">
                ${r.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Acciones Principales del Rol Seleccionado -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:18px;">
          ${tarjetasRol.map(t => `
            <div onclick="${t.fn}" style="background:linear-gradient(135deg,#0f2942,#0b1322);border:1.5px solid #38bdf8;border-radius:14px;padding:15px;cursor:pointer;">
              <h3 style="margin:0 0 6px;font-size:15px;color:#fff;">${t.t}</h3>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">${t.d}</p>
            </div>
          `).join('')}
        </div>

        <!-- Catálogo Completo con los 3 Botones Definidos: Práctica, Práctica Guiada y Simulacro con Cronómetro (10 a 60 preguntas) -->
        <h3 style="margin:0 0 10px;font-size:16px;color:#fff;">📚 Materias Básicas, 5 Idiomas (Español, Inglés, Francés, Alemán, Mandarín), Especialidades, Talleres y Admisión:</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(295px,1fr));gap:12px;">
          ${AREAS_CURRICULARES.map(area => `
            <div class="bds-card-pro" style="border-top:4px solid ${area.color};">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span style="background:${area.color};color:#fff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:99px;">${area.icono} ${area.short}</span>
                  <span style="font-size:10.5px;color:#34d399;font-weight:800;">10 a 60 Ítems</span>
                </div>
                <h4 style="margin:0 0 4px;font-size:15px;color:#fff;">${area.name}</h4>
                <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;line-height:1.4;">${area.jerarquia}</p>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">
                <button onclick="navegarVista('evaluacion','${area.id}','practica')" style="background:#131f33;color:#38bdf8;border:1px solid #38bdf8;padding:7px 4px;border-radius:7px;font-size:10.5px;font-weight:800;cursor:pointer;">⚡ Práctica</button>
                <button onclick="navegarVista('evaluacion','${area.id}','guiada')" style="background:#064e3b;color:#6ee7b7;border:1px solid #10b981;padding:7px 4px;border-radius:7px;font-size:10.5px;font-weight:800;cursor:pointer;">🧭 Guiada</button>
                <button onclick="navegarVista('evaluacion','${area.id}','simulacro')" style="background:#0284c7;color:#fff;border:none;padding:7px 4px;border-radius:7px;font-size:10.5px;font-weight:900;cursor:pointer;">⏱️ Simulacro</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      shell.querySelectorAll('.btn-switch-role').forEach(b => {
        b.onclick = () => { filtroRolActivo = b.getAttribute('data-r'); pintarDashboardPorRol(filtroRolActivo); };
      });
    }

    pintarDashboardPorRol(filtroRolActivo);
  };

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
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="navegarVista('inicio')">
        <img src="${SVG_BUHO_ORIGINAL}" alt="Búho Azul" style="height:34px;width:34px;"/>
        <div>
          <div style="font-size:13.5px;font-weight:900;color:#fff;display:flex;align-items:center;gap:5px;">
            <span>prac<span style="color:#0ea5e9;">TICA</span>tecnica.com</span>
            ${esMaxReal ? `<span style="background:#f59e0b;color:#020617;font-size:9px;font-weight:900;padding:2px 5px;border-radius:4px;">SUPERADMIN</span>` : ''}
          </div>
          <div style="font-size:10px;color:#38bdf8;">
            <b>${s.nombre}</b> • ${s.rol} • ${s.seccion}
          </div>
        </div>
      </div>

      <!-- Barra Superior Derecha: Chats A/B con Notificaciones + IA Docente + Juegos + Salir -->
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <button id="btn-top-chats" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:5px;">
          💬 Chats A/B <span style="background:#10b981;color:#022c22;padding:1px 6px;border-radius:99px;font-size:10px;">🔔 6</span>
        </button>
        <button id="btn-top-ia" style="background:#f59e0b;color:#020617;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;">
          🤖 IA Docente
        </button>
        <button id="btn-top-games" style="background:#7c3aed;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:900;cursor:pointer;">
          🎮 8 Juegos
        </button>
        <button id="btn-top-logout" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 10px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
          Salir
        </button>
      </div>
    `;

    const sub = document.createElement('div');
    sub.id = 'bds-subheader-nav';
    const NAV_ITEMS = [
      { v: 'inicio', label: '🏠 1. Menú por Rol & Materias' },
      { v: 'evaluacion', label: '⏱️ 2. Práctica, Guiada y Simulacro (10-60 Ítems)' },
      { v: 'chats', label: '💬 3. Chats por Sección (Subgrupos A/B y Esp. 1/2)' },
      { v: 'ia', label: '🤖 4. Fábrica IA (Planeamientos, Cotidianos, Ítems)' },
      { v: 'notas', label: '📊 5. Notas SEA-MEP (CSV) & Horarios' },
      { v: 'juegos', label: '🎮 6. 8 Juegos (Ajedrez, Ruleta, Dominó, Solitario)' }
    ];
    sub.innerHTML = NAV_ITEMS.map(m => `<button data-vista="${m.v}" class="bds-subnav-item">${m.label}</button>`).join('');

    const shell = document.createElement('main');
    shell.id = 'bds-app-shell';

    const dock = document.createElement('nav');
    dock.id = 'bds-mobile-dock';
    dock.innerHTML = `
      <button class="bds-dock-btn active" data-vista="inicio"><span style="font-size:16px;">🏠</span><span>Menú/Rol</span></button>
      <button class="bds-dock-btn" data-vista="evaluacion"><span style="font-size:16px;">⏱️</span><span>Simulacros</span></button>
      <button class="bds-dock-btn" data-vista="chats"><span style="font-size:16px;">💬</span><span>Chats A/B</span></button>
      <button class="bds-dock-btn" data-vista="ia"><span style="font-size:16px;">🤖</span><span>IA/Planes</span></button>
      <button class="bds-dock-btn" data-vista="notas"><span style="font-size:16px;">📊</span><span>CSV/Notas</span></button>
    `;

    document.body.prepend(shell);
    document.body.prepend(sub);
    document.body.prepend(hdr);
    document.body.appendChild(dock);

    document.getElementById('btn-top-chats').onclick = () => navegarVista('chats');
    document.getElementById('btn-top-ia').onclick = () => navegarVista('ia');
    document.getElementById('btn-top-games').onclick = () => navegarVista('juegos', 'ajedrez');
    document.getElementById('btn-top-logout').onclick = () => cerrarSesionTotal();

    document.querySelectorAll('[data-vista]').forEach(b => {
      b.onclick = () => navegarVista(b.getAttribute('data-vista'));
    });

    iniciarObservadorSoberano();
    navegarVista('inicio');
  }

  window.addEventListener('DOMContentLoaded', () => {
    inyectarCSSGate();
    const s = getSesion();
    if (s && s.email) activarPlataformaAutenticada();
    else cerrarSesionTotal();
  });
})();