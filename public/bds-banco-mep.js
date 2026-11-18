(function () {
  const MALLA_MEP = [
    { id: "web", name: "Desarrollo Web", cat: "Especialidad CTP", color: "#4f46e5", libro: "Arquitectura Frontend/Backend: HTML5 semántico, CSS Grid/Flexbox, JavaScript ES6+, React, APIs REST, SQL/PostgreSQL y despliegue continuo.", claves: ["DOM y eventos", "Estados y componentes React", "Verbos HTTP (GET, POST, PUT, DELETE)", "Consultas SQL parametrizadas"] },
    { id: "ciber", name: "Ciberseguridad & Redes", cat: "Especialidad CTP", color: "#0284c7", libro: "Defensa en profundidad: Tríada CIA (Confidencialidad, Integridad, Disponibilidad), criptografía SHA-256, OWASP Top 10, control RBAC, subneteo IPv4 y VLANs.", claves: ["Principio de menor privilegio", "TLS 1.3 y cifrado extremo a extremo", "Máscaras CIDR y VLSM", "Prevención de SQLi y XSS"] },
    { id: "conta", name: "Contabilidad, Excel & Finanzas", cat: "Especialidad CTP", color: "#059669", libro: "Ciclo contable y hoja electrónica: Ecuación patrimonial (Activo = Pasivo + Patrimonio), IVA 13% Costa Rica, planillas CCSS, conciliación bancaria y funciones avanzadas de Excel.", claves: ["Referencias absolutas ($A$1)", "BUSCARX / SI / SUMAR.SI", "Asientos de diario y mayorización", "Cargas sociales y aguinaldo"] },
    { id: "talleres", name: "Talleres Exploratorios (7°-9°)", cat: "Tercer Ciclo CTP", color: "#ea580c", libro: "Exploración vocacional técnica: Seguridad industrial y EPP, electricidad básica, pensamiento computacional, dibujo técnico CAD y cultura emprendedora.", claves: ["Desenergización y bloqueo", "Algoritmos y diagramas de flujo", "Escalas y vistas ortogonales", "Metodología 5S"] },
    { id: "electro", name: "Electrónica, Electromecánica & Soporte TI", cat: "Especialidad CTP", color: "#0891b2", libro: "Fundamentos eléctricos y soporte técnico: Ley de Ohm (V = I × R), potencia eléctrica (P = V × I), circuitos serie/paralelo, mantenimiento preventivo y diagnóstico de hardware.", claves: ["Uso correcto del multímetro", "Código de colores de resistencias", "Arquitectura BIOS/UEFI y SSD", "Mantenimiento preventivo y correctivo"] },
    { id: "logistica", name: "Ejecutivo Comercial & Logística", cat: "Especialidad CTP", color: "#7c3aed", libro: "Gestión empresarial y cadena de suministro: Servicio al cliente, gestión de inventarios (PEPS/UEPS), Incoterms, trazabilidad aduanera y ética corporativa.", claves: ["Reglas Incoterms FOB y CIF", "Rotación de inventarios", "Comunicación asertiva comercial", "Control de calidad Kaizen"] },
    { id: "diseno", name: "Diseño y Desarrollo Digital", cat: "Especialidad CTP", color: "#db2777", libro: "Comunicación visual y UX/UI: Jerarquía tipográfica, contraste WCAG, prototipado responsivo, gráficos vectoriales SVG vs mapa de bits y marca blanca editorial.", claves: ["Regla de los tercios", "RGB (pantalla) vs CMYK (impresión)", "Accesibilidad DUA", "Grillas responsivas"] },
    { id: "mate", name: "Matemáticas & Admisión UCR/TEC", cat: "Académica MEP", color: "#16a34a", libro: "Razonamiento cuantitativo y currículo MEP: Ecuaciones lineales/cuadráticas, funciones exponenciales y logarítmicas, geometría analítica, trigonometría, estadística y probabilidad.", claves: ["Teorema de Pitágoras", "Propiedades de logaritmos", "Pendiente e intersección lineal", "Sucesiones y combinatoria PAA"] },
    { id: "espanol", name: "Español & Comprensión Lectora", cat: "Académica MEP", color: "#b45309", libro: "Lengua y literatura costarricense: Acentuación (agudas, graves, esdrújulas), morfosintaxis, figuras literarias, análisis crítico de textos y narrativa nacional.", claves: ["Reglas generales de tilde", "Sujeto, predicado y complementos", "Metáfora, símil y prosopopeya", "Estructura argumentativa"] },
    { id: "ingles", name: "Inglés (Grammar, Listening & Speaking)", cat: "Idiomas MEP", color: "#2563eb", libro: "Competencia comunicativa bilingüe (MCER B1–B2): Tiempos verbales, condicionales, phrasal verbs de TI, comprensión auditiva y expresión oral técnica.", claves: ["Present Perfect vs Past Simple", "Conditionals (Zero, 1st, 2nd, 3rd)", "Technical IT Vocabulary", "Pronunciación y entonación"] },
    { id: "frances", name: "Francés MEP", cat: "Idiomas MEP", color: "#4338ca", libro: "Francés comunicativo (A1–A2): Presentaciones personales, verbos auxiliares être y avoir, artículos definidos/indefinidos, passé composé y cultura francófona.", claves: ["Conjugación être y avoir", "Artículos le / la / les", "Expresiones de cortesía", "Números y fechas"] },
    { id: "biologia", name: "Biología", cat: "Ciencias MEP", color: "#15803d", libro: "Ciencias de la vida: Célula eucariota y procariota, fotosíntesis y respiración celular, genética mendeliana, ADN/ARN, ecosistemas de Costa Rica y homeostasis.", claves: ["Mitosis vs Meiosis", "Leyes de Mendel", "Cadenas tróficas", "Biodiversidad costarricense"] },
    { id: "quimica", name: "Química", cat: "Ciencias MEP", color: "#9333ea", libro: "Estructura de la materia: Tabla periódica, número atómico y masa, enlaces iónicos y covalentes, balanceo de ecuaciones, estequiometría y escala de pH.", claves: ["Protones, neutrones y electrones", "Ácidos (pH < 7) y Bases (pH > 7)", "Concepto de mol", "Ley de conservación de la masa"] },
    { id: "fisica", name: "Física", cat: "Ciencias MEP", color: "#dc2626", libro: "Mecánica y energía: Cinemática (MRU y MRUA), Leyes de Newton, trabajo y energía cinética/potencial, gravitación y ondas electromagnéticas.", claves: ["v = d / t", "F = m × a", "Ec = ½ m v²", "Sistema Internacional (SI)"] },
    { id: "sociales", name: "Estudios Sociales & Cívica", cat: "Humanidades MEP", color: "#0d9488", libro: "Historia, geografía y ciudadanía: Independencia de 1821, Campaña Nacional de 1856, Garantías Sociales de 1943, abolición del ejército (1948), Constitución de 1949 y división de poderes.", claves: ["Poder Ejecutivo, Legislativo y Judicial", "TSE como cuarto poder", "Derechos humanos y sufragio", "Relieve y vertientes de Costa Rica"] },
    { id: "edfisica", name: "Educación Física & Salud", cat: "Complementaria MEP", color: "#e11d48", libro: "Actividad física y bienestar: Calentamiento y vuelta a la calma, frecuencia cardíaca máxima (220 - edad), capacidades físicas básicas, hidratación y juego limpio.", claves: ["Resistencia aeróbica y anaeróbica", "Prevención de lesiones", "IMC y nutrición equilibrada", "Reglamento deportivo básico"] },
    { id: "musica", name: "Educación Musical", cat: "Artes MEP", color: "#c026d3", libro: "Lenguaje y apreciación musical: Pentagrama, clave de Sol, valores rítmicos (redonda, blanca, negra, corchea), escalas mayores/menores y folclor costarricense (marimba, punto guanacasteco).", claves: ["Compás 4/4 y 3/4", "Cualidades del sonido", "Instrumentos de viento, cuerda y percusión", "Patrimonio musical de Costa Rica"] },
    { id: "artes", name: "Artes Plásticas", cat: "Artes MEP", color: "#f97316", libro: "Expresión visual y plástica: Colores primarios, secundarios y complementarios, perspectiva cónica, claro-oscuro, escultura y arte precolombino (esferas de piedra del Diquís).", claves: ["Círculo cromático", "Punto de fuga", "Textura visual y táctil", "Patrimonio artístico nacional"] },
    { id: "psicologia", name: "Psicología", cat: "Humanidades MEP", color: "#8b5cf6", libro: "Procesos mentales y desarrollo humano: Percepción, atención, memoria, inteligencia emocional (Goleman), manejo del estrés, proyecto de vida y relaciones saludables.", claves: ["Memoria a corto y largo plazo", "Empatía y autorregulación", "Etapas del desarrollo cognitivo", "Salud mental juvenil"] },
    { id: "filosofia", name: "Filosofía & Lógica", cat: "Humanidades MEP", color: "#6366f1", libro: "Pensamiento crítico: Filosofía antigua (Sócrates, Platón, Aristóteles), epistemología, lógica proposicional, detección de falacias argumentativas y ética.", claves: ["Mayéutica socrática", "Falacia ad hominem y hombre de paja", "Silogismo deductivo", "Ética de la virtud y deontología"] },
    { id: "religion", name: "Educación Religiosa & Valores", cat: "Formación Humana", color: "#ca8a04", libro: "Dignidad humana y convivencia: Cultura de paz, solidaridad, respeto a la diversidad, responsabilidad social, cuidado de la casa común y ética ciudadana.", claves: ["Dignidad de la persona", "Diálogo interreligioso y tolerancia", "Justicia social y bien común", "Resolución pacífica de conflictos"] },
    { id: "mopt", name: "Educación Vial MOPT / COSEVI", cat: "Licencia CR", color: "#0369a1", libro: "Ley de Tránsito N° 9078: Límites de velocidad, señales verticales (reglamentarias, preventivas, informativas), demarcación horizontal, alcohol cero/límites, rotondas y seguridad pasiva.", claves: ["25 km/h en zona escolar", "Prioridad en rotondas", "Línea amarilla continua", "Uso obligatorio de cinturón y casco"] }
  ];

  const BANCO_CURADO = [
    // DESARROLLO WEB
    { a: "web", d: "Básico", g: "Etiqueta semántica para contenido principal único de la página.", q: "En HTML5, ¿qué etiqueta semántica define el contenido principal único de un documento web?", o: ["<div>", "<main>", "<span>", "<br>"], c: 1, e: "<main> mejora la accesibilidad (lectores de pantalla) y el SEO identificando el núcleo del documento." },
    { a: "web", d: "Intermedio", g: "Diferencia entre crear un recurso nuevo y solo leer información.", q: "En una API REST estándar, ¿qué método HTTP se utiliza convencionalmente para crear un nuevo recurso en el servidor?", o: ["GET", "POST", "HEAD", "OPTIONS"], c: 1, e: "POST envía datos al servidor para crear un nuevo registro; GET solo consulta sin modificar estado." },
    { a: "web", d: "Intermedio", g: "Hook de React para ejecutar efectos secundarios tras el renderizado.", q: "En React (JavaScript puro), ¿qué hook se utiliza para sincronizar un componente con una petición fetch o suscripción externa?", o: ["useColor", "useEffect", "useStyle", "useStatic"], c: 1, e: "useEffect ejecuta efectos secundarios después del renderizado y permite limpiar suscripciones." },
    { a: "web", d: "Avanzado", g: "Código de estado HTTP cuando las credenciales no son válidas o faltan.", q: "¿Qué código de estado HTTP indica que una petición requiere autenticación válida del usuario?", o: ["200 OK", "401 Unauthorized", "404 Not Found", "502 Bad Gateway"], c: 1, e: "401 Unauthorized señala ausencia o invalidez de credenciales; 403 indica permiso insuficiente." },
    { a: "web", d: "Básico", g: "Propiedad CSS que organiza elementos en filas y columnas bidimensionales.", q: "¿Qué sistema de diseño en CSS permite controlar simultáneamente filas y columnas en una cuadrícula bidimensional?", o: ["CSS Grid", "float: left", "text-align", "z-index"], c: 0, e: "CSS Grid está diseñado específicamente para layouts bidimensionales (filas y columnas)." },
    // CIBERSEGURIDAD
    { a: "ciber", d: "Básico", g: "Tres pilares fundamentales de la seguridad de la información.", q: "¿Cuáles son los tres pilares clásicos de la Tríada CIA en ciberseguridad?", o: ["Compilación, Internet y Antivirus", "Confidencialidad, Integridad y Disponibilidad", "Cifrado, IP y Acceso", "Control, Identidad y Auditoría"], c: 1, e: "CIA corresponde a Confidencialidad, Integridad y Disponibilidad de la información." },
    { a: "ciber", d: "Intermedio", g: "Evitar que un atacante inyecte código SQL en un formulario de login.", q: "¿Cuál es la defensa más efectiva contra ataques de Inyección SQL (SQLi) en un backend con PostgreSQL?", o: ["Ocultar el botón de envío", "Usar consultas parametrizadas (prepared statements)", "Cambiar el color del formulario", "Desactivar HTTPS"], c: 1, e: "Las consultas parametrizadas separan la lógica SQL de los datos del usuario, neutralizando la inyección." },
    { a: "ciber", d: "Intermedio", g: "Función hash unidireccional usada para verificar que un archivo o boleta no fue alterado.", q: "¿Cuál es una propiedad esencial del algoritmo criptográfico SHA-256?", o: ["Permite descifrar el texto original fácilmente", "Es una función hash determinista y unidireccional de 256 bits", "Solo sirve para comprimir videos", "Requiere llave pública RSA"], c: 1, e: "SHA-256 genera una huella digital única de 64 caracteres hexadecimales; cualquier cambio mínimo altera todo el hash." },
    { a: "ciber", d: "Básico", g: "Principio RBAC al asignar permisos a un usuario nuevo.", q: "Según el principio de menor privilegio (RBAC), ¿qué permisos debe recibir una cuenta recién registrada?", o: ["Acceso de SuperAdmin", "Solo los permisos mínimos estrictamente necesarios para su rol", "Acceso a todos los servidores", "Sin contraseña"], c: 1, e: "Limitar privilegios reduce drásticamente el impacto de una cuenta comprometida." },
    { a: "ciber", d: "Avanzado", g: "Ataque que inyecta scripts maliciosos en el navegador de otros usuarios.", q: "¿Qué vulnerabilidad OWASP permite ejecutar JavaScript malicioso en el navegador de una víctima al mostrar datos sin sanitizar?", o: ["Cross-Site Scripting (XSS)", "ARP Spoofing", "Ping of Death", "Buffer Underflow"], c: 0, e: "XSS ocurre cuando la aplicación inserta entradas no validadas ni escapadas dentro del HTML/DOM." },
    // CONTABILIDAD & EXCEL
    { a: "conta", d: "Básico", g: "Relación fundamental del Balance de Situación.", q: "¿Cuál es la ecuación contable fundamental?", o: ["Activo = Pasivo - Patrimonio", "Activo = Pasivo + Patrimonio", "Patrimonio = Activo + Pasivo", "Ingreso = Activo × Pasivo"], c: 1, e: "Todos los recursos de la empresa (Activos) se financian con deudas (Pasivos) o aportes propios (Patrimonio)." },
    { a: "conta", d: "Básico", g: "Símbolo que bloquea fila y columna al arrastrar una fórmula en Excel.", q: "En Excel, ¿cómo se escribe una referencia absoluta fija para la celda C5?", o: ["#C#5", "$C$5", "%C%5", "@C@5"], c: 1, e: "El signo de dólar ($) delante de la columna y fila ($C$5) impide que cambie al copiar la fórmula." },
    { a: "conta", d: "Intermedio", g: "Tarifa general vigente del Impuesto al Valor Agregado en Costa Rica.", q: "¿Cuál es la tarifa general del Impuesto al Valor Agregado (IVA) en Costa Rica según la Ley N° 9635?", o: ["5%", "10%", "13%", "15%"], c: 2, e: "La tarifa general del IVA en Costa Rica es del 13% sobre bienes y servicios gravados." },
    { a: "conta", d: "Intermedio", g: "Función de Excel que suma solo las celdas que cumplen una condición.", q: "¿Qué función de Excel permite sumar los montos de una columna únicamente cuando la categoría sea 'Materiales'?", o: ["=SUMA()", "=SUMAR.SI()", "=CONTARA()", "=MAX()"], c: 1, e: "=SUMAR.SI(rango; criterio; rango_suma) filtra y acumula valores según un criterio específico." },
    // TALLERES EXPLORATORIOS
    { a: "talleres", d: "Básico", g: "Regla de oro antes de tocar cables o bornes en el taller.", q: "Antes de modificar una conexión en un circuito de taller eléctrico, ¿qué procedimiento es obligatorio?", o: ["Trabajar con las manos húmedas", "Desenergizar la fuente y verificar ausencia de tensión", "Retirar el cable a tierra", "Aumentar el voltaje"], c: 1, e: "Verificar ausencia de tensión tras desenergizar evita electrocuciones y cortocircuitos." },
    { a: "talleres", d: "Básico", g: "Secuencia finita y ordenada de pasos para resolver una tarea.", q: "En talleres de pensamiento computacional, ¿cómo se define un algoritmo?", o: ["Una pieza metálica", "Una secuencia lógica, finita y ordenada de instrucciones para resolver un problema", "Un monitor LED", "Un cable coaxial"], c: 1, e: "Todo algoritmo tiene entrada, proceso ordenado finito y salida clara." },
    { a: "talleres", d: "Básico", g: "Metodología japonesa de orden y limpieza en talleres.", q: "¿Cuál es el objetivo principal de aplicar la metodología 5S en un laboratorio o taller técnico?", o: ["Acumular herramientas dañadas", "Mantener orden, limpieza, seguridad y eficiencia estandarizada", "Trabajar sin normas", "Ocultar los equipos de emergencia"], c: 1, e: "Las 5S (Clasificar, Ordenar, Limpiar, Estandarizar y Sostener) reducen accidentes y tiempos muertos." },
    // ELECTRÓNICA & SOPORTE TI
    { a: "electro", d: "Básico", g: "Ley de Ohm relaciona voltaje (V), corriente (I) y resistencia (R).", q: "Si un circuito de 12 V tiene una resistencia de 4 Ω, ¿qué corriente eléctrica circula según la Ley de Ohm (I = V / R)?", o: ["48 A", "3 A", "8 A", "0.33 A"], c: 1, e: "Dividiendo voltaje entre resistencia: I = 12 V / 4 Ω = 3 Amperios." },
    { a: "electro", d: "Intermedio", g: "Puerto TCP estándar utilizado por el protocolo seguro HTTPS.", q: "¿Qué número de puerto TCP utiliza por defecto el protocolo HTTPS?", o: ["21", "25", "80", "443"], c: 3, e: "HTTP usa el puerto 80, mientras que HTTPS cifrado utiliza el puerto 443." },
    { a: "electro", d: "Intermedio", g: "Segmentación lógica en switches administrables.", q: "¿Para qué se implementa una VLAN en una red institucional de laboratorio?", o: ["Para acelerar el ventilador del CPU", "Para segmentar lógicamente dominios de broadcast y mejorar la seguridad", "Para aumentar el voltaje de red", "Para reemplazar la memoria RAM"], c: 1, e: "Las VLAN aíslan tráfico entre departamentos o laboratorios sin requerir switches físicos separados." },
    // LOGÍSTICA Y EJECUTIVO
    { a: "logistica", d: "Intermedio", g: "Método de valuación de inventarios donde lo primero que entra es lo primero que sale.", q: "¿Qué significan las siglas PEPS (FIFO) en administración de inventarios?", o: ["Primero en Entrar, Primero en Salir", "Pago Estimado Por Servicio", "Plan Estratégico Para Sucursales", "Precio Estándar Por Stock"], c: 0, e: "PEPS evita vencimiento u obsolescencia despachando primero la mercancía más antigua." },
    { a: "logistica", d: "Básico", g: "Normas internacionales que definen responsabilidades entre comprador y vendedor.", q: "¿Qué regulan los Incoterms publicados por la Cámara de Comercio Internacional?", o: ["Las notas escolares", "Las obligaciones de entrega, costos y riesgos en el comercio internacional", "Los horarios de oficina", "Las contraseñas bancarias"], c: 1, e: "Los Incoterms (como FOB, CIF, EXW) aclaran hasta qué punto asume costos y riesgos cada parte." },
    // DISEÑO DIGITAL
    { a: "diseno", d: "Básico", g: "Formato que escala a cualquier tamaño sin perder nitidez.", q: "¿Por qué se prefiere el formato SVG para logotipos y escudos institucionales en web?", o: ["Porque se pixela al ampliarlo", "Porque es vectorial y mantiene nitidez perfecta en cualquier resolución", "Porque pesa más de 50 MB", "Porque solo funciona en blanco y negro"], c: 1, e: "Los gráficos vectoriales SVG se describen matemáticamente y escalan sin pérdida de calidad." },
    { a: "diseno", d: "Básico", g: "Modelo de color aditivo usado en monitores y celulares.", q: "¿Qué modelo de color se utiliza para el diseño de interfaces digitales en pantalla?", o: ["CMYK", "RGB", "Pantone metálico", "Escala de grises"], c: 1, e: "Las pantallas emiten luz combinando Rojo, Verde y Azul (RGB); CMYK se usa para impresión física." },
    // MATEMÁTICAS & UCR/TEC
    { a: "mate", d: "Intermedio", g: "Calcula las diferencias entre términos consecutivos.", q: "[Admisión UCR/TEC] En la sucesión 3, 8, 15, 24, 35, X, ¿cuál es el valor de X?", o: ["44", "46", "48", "50"], c: 2, e: "Las diferencias crecen de dos en dos (+5, +7, +9, +11, +13). Así, 35 + 13 = 48." },
    { a: "mate", d: "Intermedio", g: "Definición de logaritmo: base elevada al resultado igual al argumento.", q: "Si log₂(x) = 5, ¿cuál es el valor de x?", o: ["10", "25", "32", "64"], c: 2, e: "Por definición de logaritmo, 2⁵ = 32." },
    { a: "mate", d: "Básico", g: "Suma de ángulos internos de cualquier triángulo plano.", q: "¿Cuánto suman siempre los tres ángulos internos de un triángulo en geometría euclidiana?", o: ["90°", "180°", "270°", "360°"], c: 1, e: "En el plano euclidiano la suma de los ángulos internos de todo triángulo es exactamente 180°." },
    { a: "mate", d: "Avanzado", g: "Teorema de Pitágoras: c² = a² + b².", q: "Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuánto mide su hipotenusa?", o: ["10 cm", "12 cm", "14 cm", "100 cm"], c: 0, e: "√(6² + 8²) = √(36 + 64) = √100 = 10 cm." },
    // ESPAÑOL
    { a: "espanol", d: "Básico", g: "Palabra con sílaba tónica en la antepenúltima sílaba.", q: "Según las reglas de acentuación del español, ¿cuándo llevan tilde las palabras esdrújulas?", o: ["Solo si terminan en vocal", "Nunca llevan tilde", "Siempre llevan tilde", "Solo si terminan en n o s"], c: 2, e: "Todas las palabras esdrújulas y sobresdrújulas se tildan siempre (ej. técnica, práctica, rápido)." },
    { a: "espanol", d: "Intermedio", g: "Figura literaria que atribuye cualidades humanas a seres inanimados.", q: "En el verso 'El viento susurraba secretos entre los cipreses', ¿qué figura literaria predomina?", o: ["Hipérbaton", "Prosopopeya (personificación)", "Anáfora", "Onomatopeya"], c: 1, e: "La prosopopeya atribuye acciones propias del ser humano (susurrar secretos) al viento." },
    { a: "espanol", d: "Intermedio", g: "Obra cumbre del realismo social costarricense de Carlos Luis Fallas.", q: "¿Quién escribió la novela costarricense 'Mamita Yunai', denuncia social sobre las bananeras?", o: ["Joaquín García Monge", "Carlos Luis Fallas (Calufa)", "Carmen Lyra", "Fabián Dobles"], c: 1, e: "Carlos Luis Fallas publicó 'Mamita Yunai' en 1941, obra emblemática de la literatura nacional." },
    // INGLÉS (GRAMMAR, LISTENING & SPEAKING)
    { a: "ingles", d: "Intermedio", g: "Second Conditional: If + Past Simple (were), would + base verb.", audio: "If I were a senior developer, I would automate all security tests.", q: "[Grammar] Choose the correct verb form: 'If I ___ a senior developer, I would automate all security tests.'", o: ["am", "were", "will be", "has been"], c: 1, e: "In formal English Second Conditional, 'were' is used for all subjects in hypothetical clauses." },
    { a: "ingles", d: "Básico", g: "Phrasal verb fundamental en soporte técnico y respaldo de datos.", audio: "Remember to back up the PostgreSQL database before deploying to production.", q: "[Listening & Vocabulary] What does the phrasal verb 'back up' mean in IT?", o: ["Delete all records", "Create a security copy of data", "Turn off the router", "Format the disk"], c: 1, e: "'Back up' means making a copy of files or databases to protect against data loss." },
    { a: "ingles", d: "Intermedio", g: "Escucha la frase y selecciona el propósito comunicativo correcto.", audio: "Good morning. Could you please verify your institutional email address before we reset your password?", speak: "Good morning, I would like to verify my institutional email address.", q: "[Listening & Speaking] What is the technician asking the user to do?", o: ["Buy a new computer", "Confirm their institutional email before resetting the password", "Close the browser immediately", "Share their credit card"], c: 1, e: "The technician politely requests email verification prior to performing a password reset." },
    { a: "ingles", d: "Avanzado", g: "Present Perfect expresa una acción que comenzó en el pasado y continúa.", audio: "Our technical high school has offered Cybersecurity courses since 2020.", speak: "Our technical high school has offered Cybersecurity courses since 2020.", q: "[Grammar] Complete: 'Our technical high school ___ Cybersecurity courses since 2020.'", o: ["offer", "has offered", "offering", "is offer"], c: 1, e: "With 'since + year', Present Perfect ('has offered') is required." },
    // FRANCÉS
    { a: "frances", d: "Básico", g: "Verbo 'être' en primera persona del singular (Je).", audio: "Bonjour, je suis étudiant au lycée technique.", lang: "fr-FR", q: "[Francés] Complétez correctement: 'Bonjour, je ___ étudiant au lycée technique.'", o: ["es", "suis", "est", "sommes"], c: 1, e: "La conjugación correcta de 'être' para 'je' es 'je suis' (yo soy)." },
    { a: "frances", d: "Básico", g: "Saludo formal por la tarde/noche en francés.", audio: "Bonsoir, comment allez-vous aujourd'hui?", lang: "fr-FR", q: "[Francés] ¿Qué expresión se utiliza para saludar formalmente por la noche?", o: ["Bonjour", "Bonsoir", "Merci beaucoup", "Au revoir"], c: 1, e: "'Bonsoir' significa buenas tardes/noches al saludar." },
    // BIOLOGÍA
    { a: "biologia", d: "Básico", g: "Organela encargada de la respiración celular y producción de ATP.", q: "¿Qué organela celular es conocida como la central energética por producir la mayor parte del ATP?", o: ["Ribosoma", "Mitocondria", "Lisosoma", "Vacuola"], c: 1, e: "La mitocondria realiza la respiración celular aeróbica generando ATP." },
    { a: "biologia", d: "Intermedio", g: "Proceso mediante el cual las plantas transforman energía lumínica en química.", q: "¿Qué gas absorben principalmente las plantas durante la fotosíntesis para sintetizar glucosa?", o: ["Nitrógeno (N₂)", "Dióxido de carbono (CO₂)", "Helio (He)", "Metano (CH₄)"], c: 1, e: "En la fotosíntesis se usa CO₂, agua y luz solar para producir glucosa y liberar oxígeno (O₂)." },
    // QUÍMICA
    { a: "quimica", d: "Básico", g: "El número atómico (Z) identifica únicamente a cada elemento.", q: "¿Qué partícula subatómica determina el número atómico (Z) de un elemento químico?", o: ["Neutrones", "Protones en el núcleo", "Electrones de valencia únicamente", "Fotones"], c: 1, e: "El número de protones define la identidad química del elemento en la tabla periódica." },
    { a: "quimica", d: "Intermedio", g: "Escala de pH: 7 es neutro, menor es ácido, mayor es básico.", q: "Una disolución acuosa tiene un pH de 3. ¿Cómo se clasifica químicamente?", o: ["Básica o alcalina", "Neutra", "Ácida", "Salina pura"], c: 2, e: "Todo pH menor a 7 indica carácter ácido por mayor concentración de iones H⁺." },
    // FÍSICA
    { a: "fisica", d: "Básico", g: "Segunda Ley de Newton: F = m × a.", q: "¿Qué fuerza neta se necesita para acelerar una masa de 12 kg a 5 m/s²?", o: ["17 N", "60 N", "2.4 N", "120 N"], c: 1, e: "F = 12 kg × 5 m/s² = 60 Newtons." },
    { a: "fisica", d: "Intermedio", g: "Movimiento Rectilíneo Uniforme: d = v × t.", q: "Un vehículo se desplaza con velocidad constante de 20 m/s durante 15 segundos. ¿Qué distancia recorre?", o: ["35 m", "150 m", "300 m", "400 m"], c: 2, e: "Aplicando d = v × t = 20 m/s × 15 s = 300 metros." },
    // ESTUDIOS SOCIALES Y CÍVICA
    { a: "sociales", d: "Básico", g: "Hecho histórico del 1° de diciembre de 1948 en Costa Rica.", q: "¿Qué acontecimiento histórico trascendental ocurrió en Costa Rica el 1° de diciembre de 1948?", o: ["La anexión de Nicoya", "La abolición del ejército como institución permanente", "La fundación de la UCR", "La Batalla de Santa Rosa"], c: 1, e: "José Figueres Ferrer abolió el ejército, redirigiendo esos recursos a educación y salud." },
    { a: "sociales", d: "Intermedio", g: "Constitución Política de 1949: tres poderes clásicos más el órgano electoral.", q: "¿Qué institución costarricense tiene rango e independencia de Poder del Estado para organizar elecciones?", o: ["Ministerio de Hacienda", "Tribunal Supremo de Elecciones (TSE)", "Banco Central", "INS"], c: 1, e: "El TSE garantiza el sufragio libre, secreto y transparente en Costa Rica." },
    { a: "sociales", d: "Básico", g: "Héroe nacional de la Batalla de Rivas (11 de abril de 1856).", q: "¿Qué acontecimiento de la Campaña Nacional se conmemora cada 11 de abril en Costa Rica?", o: ["La firma del Acta de Independencia", "La Batalla de Rivas y la gesta de Juan Santamaría", "La creación de la CCSS", "El día de las culturas"], c: 1, e: "El 11 de abril de 1856 se libró la Batalla de Rivas contra los filibusteros de William Walker." },
    // EDUCACIÓN FÍSICA
    { a: "edfisica", d: "Básico", g: "Fase preparatoria antes de realizar ejercicio intenso.", q: "¿Cuál es la función principal del calentamiento antes de una actividad física intensa?", o: ["Agotar el glucógeno", "Elevar progresivamente la temperatura muscular y prevenir lesiones", "Deshidratar el organismo", "Reducir la circulación sanguínea"], c: 1, e: "El calentamiento prepara articulaciones, músculos y sistema cardiovascular reduciendo desgarros." },
    { a: "edfisica", d: "Intermedio", g: "Fórmula clásica de Tanaka/Karvonen básica: 220 menos la edad.", q: "Según la fórmula general estimada (220 - edad), ¿cuál es la frecuencia cardíaca máxima aproximada de una persona de 20 años?", o: ["160 lpm", "180 lpm", "200 lpm", "220 lpm"], c: 2, e: "220 - 20 = 200 latidos por minuto como referencia máxima teórica." },
    // MÚSICA
    { a: "musica", d: "Básico", g: "En compás de 4/4, la negra vale 1 tiempo y la blanca 2 tiempos.", q: "En un compás de 4/4, ¿cuántos tiempos dura una figura musical 'redonda'?", o: ["1 tiempo", "2 tiempos", "3 tiempos", "4 tiempos"], c: 3, e: "En compás 4/4 la redonda equivale a 4 pulsos completos (un compás entero)." },
    { a: "musica", d: "Básico", g: "Instrumento declarado símbolo nacional de cultura y tradición en Costa Rica.", q: "¿Qué instrumento de percusión melódica fue declarado Símbolo Nacional de Costa Rica?", o: ["El violín", "La marimba", "El saxofón", "La trompeta"], c: 1, e: "La marimba costarricense fue declarada Símbolo Nacional en 1996 por su arraigo folclórico." },
    // ARTES PLÁSTICAS
    { a: "artes", d: "Básico", g: "Colores puros que no se obtienen mezclando otros pigmentos.", q: "En la teoría tradicional del color pigmento, ¿cuáles son los tres colores primarios?", o: ["Verde, naranja y violeta", "Rojo, azul y amarillo", "Blanco, negro y gris", "Celeste, café y rosado"], c: 1, e: "En síntesis sustractiva tradicional (pigmentos), rojo, azul y amarillo son la base de los secundarios." },
    { a: "artes", d: "Intermedio", g: "Elemento geométrico donde convergen las líneas paralelas en perspectiva.", q: "En dibujo artístico en perspectiva cónica, ¿cómo se llama el punto en la línea del horizonte donde convergen las rectas?", o: ["Punto de fuga", "Eje de simetría", "Textura táctil", "Escala cromática"], c: 0, e: "El punto de fuga crea la ilusión óptica de profundidad tridimensional en una superficie plana." },
    // PSICOLOGÍA
    { a: "psicologia", d: "Básico", g: "Concepto popularizado por Daniel Goleman.", q: "¿Qué comprende principalmente la 'inteligencia emocional' en el desarrollo adolescente y profesional?", o: ["Memorizar solo fechas", "Reconocer, comprender y regular las emociones propias y ajenas con empatía", "Evitar todo contacto social", "Reprimir cualquier sentimiento"], c: 1, e: "La inteligencia emocional integra autoconciencia, autorregulación, motivación, empatía y habilidades sociales." },
    { a: "psicologia", d: "Intermedio", g: "Estrategia de aprendizaje activo superior a la simple relectura.", q: "Según la psicología cognitiva, ¿qué técnica fortalece más la consolidación de la memoria a largo plazo?", o: ["Estudiar todo la noche anterior sin dormir", "La práctica espaciada y la recuperación activa (autoevaluación)", "Leer pasivamente sin resumir", "Multitarea con notificaciones constantes"], c: 1, e: "La práctica espaciada y el recuerdo activo (testing effect) consolidan rutas neuronales duraderas." },
    // FILOSOFÍA
    { a: "filosofia", d: "Básico", g: "Método de Sócrates basado en preguntas sucesivas para descubrir la verdad.", q: "¿Cómo se denomina el método filosófico socrático que guía al interlocutor mediante preguntas?", o: ["Dogmatismo", "Mayéutica", "Positivismo", "Nihilismo"], c: 1, e: "La mayéutica busca que el estudiante 'dé a luz' el conocimiento mediante el diálogo crítico." },
    { a: "filosofia", d: "Intermedio", g: "Error lógico que ataca a la persona en lugar de refutar su argumento.", q: "¿Qué falacia lógica se comete al descalificar una idea atacando el carácter personal de quien la propone?", o: ["Ad hominem", "Silogismo válido", "Inducción científica", "Axioma"], c: 0, e: "La falacia 'ad hominem' evade la evidencia y ataca a la persona que emite el argumento." },
    // EDUCACIÓN RELIGIOSA Y VALORES
    { a: "religion", d: "Básico", g: "Principio ético universal de respeto a toda persona sin discriminación.", q: "¿Cuál es el fundamento ético de la convivencia pacífica y los derechos humanos en un centro educativo?", o: ["La competencia desleal", "El reconocimiento de la dignidad inherente de toda persona", "La indiferencia", "La exclusión de minorías"], c: 1, e: "La dignidad humana sustenta el respeto mutuo, la inclusión y la construcción de la cultura de paz." },
    { a: "religion", d: "Básico", g: "Valor que impulsa el apoyo mutuo hacia quienes enfrentan dificultades.", q: "¿Qué valor ético y ciudadano consiste en colaborar desinteresadamente por el bien común y apoyar a quien lo necesita?", o: ["Individualismo", "Solidaridad", "Apatía", "Intolerancia"], c: 1, e: "La solidaridad fortalece el tejido comunitario y la empatía institucional." },
    // MOPT / COSEVI
    { a: "mopt", d: "Básico", g: "Límite estricto en zonas escolares y frente a hospitales.", q: "Según la Ley de Tránsito N° 9078 de Costa Rica, ¿cuál es la velocidad máxima permitida frente a zonas escolares con estudiantes?", o: ["40 km/h", "25 km/h", "50 km/h", "60 km/h"], c: 1, e: "La ley establece 25 km/h frente a centros educativos con presencia de estudiantes y hospitales." },
    { a: "mopt", d: "Básico", g: "Forma geométrica exclusiva de la señal de ALTO.", q: "¿Qué forma geométrica distingue universalmente a la señal reglamentaria de ALTO?", o: ["Triángulo invertido", "Círculo azul", "Octágono rojo", "Rombo amarillo"], c: 2, e: "El octágono rojo es único para el ALTO para ser reconocido incluso de espaldas o con poca luz." },
    { a: "mopt", d: "Intermedio", g: "Regla de prioridad de paso en intersecciones circulares.", q: "Al aproximarse a una rotonda en Costa Rica, ¿quién tiene la prioridad de paso?", o: ["El vehículo que va ingresando", "El vehículo que ya circula dentro de la rotonda", "El vehículo de mayor tamaño", "El que toque bocina primero"], c: 1, e: "Quien ya circula dentro de la rotonda tiene prioridad; quien ingresa debe respetar el CEDA." }
  ];

  // Generadores paramétricos 100% válidos y verificables matemáticamente
  function randInt(min, max) {
    const b = new Uint32Array(1);
    crypto.getRandomValues(b);
    return min + (b[0] % (max - min + 1));
  }

  function generarItemsParametricos(areaId, cantidad) {
    const out = [];
    for (let i = 0; i < cantidad; i++) {
      const tipo = areaId === "ALL" ? ["mate", "fisica", "conta", "electro", "ciber", "quimica"][i % 6] : areaId;
      if (tipo === "mate") {
        const a = randInt(2, 9), x = randInt(2, 15), b = randInt(3, 25), res = a * x + b;
        out.push({
          a: "mate", d: "Intermedio", g: `Despeja x restando ${b} y dividiendo entre ${a}.`,
          q: `[Álgebra MEP] Resuelva la ecuación lineal: ${a}x + ${b} = ${res}. ¿Cuál es el valor de x?`,
          o: [String(x), String(x + 2), String(Math.max(1, x - 1)), String(x + 4)], c: 0,
          e: `Restando ${b}: ${a}x = ${res - b}. Dividiendo entre ${a}: x = ${x}.`
        });
      } else if (tipo === "fisica") {
        const m = randInt(3, 25), acc = randInt(2, 10), f = m * acc;
        out.push({
          a: "fisica", d: "Básico", g: "Aplica la Segunda Ley de Newton: F = m × a.",
          q: `[Dinámica] Un objeto de ${m} kg experimenta una aceleración de ${acc} m/s². ¿Cuál es la fuerza neta aplicada?`,
          o: [`${f} N`, `${m + acc} N`, `${f + m} N`, `${Math.max(1, f - acc)} N`], c: 0,
          e: `Multiplicando masa por aceleración: F = ${m} kg × ${acc} m/s² = ${f} N.`
        });
      } else if (tipo === "conta") {
        const base = randInt(2, 30) * 1000, iva = Math.round(base * 0.13);
        out.push({
          a: "conta", d: "Intermedio", g: "Multiplica el subtotal por 0,13 (tarifa general del IVA en Costa Rica).",
          q: `[Contabilidad CR] Una factura gravada tiene un subtotal de ₡${base.toLocaleString("es-CR")}. ¿Cuánto corresponde al 13% de IVA?`,
          o: [`₡${iva.toLocaleString("es-CR")}`, `₡${Math.round(base * 0.10).toLocaleString("es-CR")}`, `₡${Math.round(base * 0.15).toLocaleString("es-CR")}`, `₡${Math.round(base * 0.05).toLocaleString("es-CR")}`], c: 0,
          e: `El 13% de ₡${base.toLocaleString("es-CR")} es ₡${iva.toLocaleString("es-CR")}.`
        });
      } else if (tipo === "electro") {
        const iAmp = randInt(2, 12), rOhm = randInt(2, 15), vVolt = iAmp * rOhm;
        out.push({
          a: "electro", d: "Básico", g: "Usa la Ley de Ohm: V = I × R.",
          q: `[Ley de Ohm] Por una resistencia de ${rOhm} Ω circula una corriente de ${iAmp} A. ¿Cuál es el voltaje aplicado?`,
          o: [`${vVolt} V`, `${iAmp + rOhm} V`, `${vVolt + 5} V`, `${Math.max(1, rOhm - iAmp)} V`], c: 0,
          e: `Por Ley de Ohm: V = ${iAmp} A × ${rOhm} Ω = ${vVolt} V.`
        });
      } else if (tipo === "ciber") {
        const pref = [24, 25, 26, 27, 28, 29][randInt(0, 5)];
        const hostBits = 32 - pref;
        const utiles = Math.pow(2, hostBits) - 2;
        out.push({
          a: "ciber", d: "Avanzado", g: `Calcula bits de host (32 - ${pref} = ${hostBits}) y aplica 2^h - 2.`,
          q: `[Subneteo IPv4] En una subred con prefijo CIDR /${pref}, ¿cuántas direcciones IP utilizables para hosts existen?`,
          o: [`${utiles} hosts`, `${utiles + 2} hosts`, `${Math.max(2, Math.floor(utiles / 2))} hosts`, `${utiles * 2} hosts`], c: 0,
          e: `Con /${pref} quedan ${hostBits} bits de host: 2^${hostBits} - 2 = ${utiles} direcciones utilizables.`
        });
      } else if (tipo === "quimica") {
        const ph = randInt(1, 13);
        const cls = ph < 7 ? "Ácida" : (ph === 7 ? "Neutra" : "Básica (alcalina)");
        out.push({
          a: "quimica", d: "Básico", g: "pH < 7 es ácido; pH = 7 es neutro; pH > 7 es básico.",
          q: `[Escala de pH] Una muestra de laboratorio registra un valor de pH = ${ph}. ¿Cómo se clasifica?`,
          o: [cls, cls === "Ácida" ? "Básica (alcalina)" : "Ácida", cls === "Neutra" ? "Ácida fuerte" : "Neutra", "Radiactiva"], c: 0,
          e: `Un pH de ${ph} corresponde a una disolución ${cls.toLowerCase()}.`
        });
      }
    }
    return out;
  }

  function shuffleCrypto(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const b = new Uint32Array(1);
      crypto.getRandomValues(b);
      const j = b[0] % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function prepararOpciones(item) {
    const opts = shuffleCrypto(item.o.map((txt, idx) => ({ txt, ok: idx === item.c })));
    return { ...item, opts };
  }

  window.BDS_MALLA_MEP = MALLA_MEP;
  window.BDS_BANCO_CURADO = BANCO_CURADO;
  window.BDS_GENERAR_SIMULACRO = function (areaId, cantidad, dificultad) {
    const cant = Number(cantidad) || 10;
    let pool = BANCO_CURADO.filter(x => (areaId === "ALL" || x.a === areaId) && (!dificultad || dificultad === "ALL" || x.d === dificultad));
    if (pool.length < cant) {
      const extraParam = generarItemsParametricos(areaId, Math.max(12, cant - pool.length + 6));
      pool = pool.concat(extraParam);
    }
    if (pool.length < cant) {
      const complemento = shuffleCrypto(BANCO_CURADO.filter(x => !pool.includes(x)));
      pool = pool.concat(complemento);
    }
    if (pool.length < cant) {
      pool = pool.concat(generarItemsParametricos("ALL", cant - pool.length + 5));
    }
    return shuffleCrypto(pool).slice(0, cant).map(prepararOpciones);
  };
})();