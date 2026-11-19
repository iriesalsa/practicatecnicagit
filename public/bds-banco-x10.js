(function () {
  const DIFFS = ["Básico", "Medio", "Intermedio", "Avanzado"];

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function detectarTipoArea(m) {
    const t = norm((m.id || "") + " " + (m.name || ""));
    if (/mopt|cosevi|vial/.test(t)) return "mopt";
    if (/educacion fisica|deporte|salud/.test(t)) return "edfisica";
    if (/relig|valor/.test(t)) return "religion";
    if (/web|programacion|software/.test(t)) return "web";
    if (/ciber|seguridad|redes/.test(t)) return "ciber";
    if (/contab|finanz|excel/.test(t)) return "conta";
    if (/taller|explorat/.test(t)) return "talleres";
    if (/electro|soporte|mecan/.test(t)) return "electro";
    if (/ejecutiv|comercial|logist/.test(t)) return "comercial";
    if (/diseno|digital|publicit/.test(t)) return "diseno";
    if (/matem|admision|ucr/.test(t)) return "mate";
    if (/espanol|lectora|literat/.test(t)) return "espanol";
    if (/ingles|english|grammar/.test(t)) return "ingles";
    if (/frances|french/.test(t)) return "frances";
    if (/biolog/.test(t)) return "biologia";
    if (/quimic/.test(t)) return "quimica";
    if (/fisica/.test(t)) return "fisica";
    if (/social|civica|historia/.test(t)) return "sociales";
    if (/music/.test(t)) return "musica";
    if (/artes|plastic/.test(t)) return "artes";
    if (/psicolog/.test(t)) return "psicologia";
    if (/filosof|logica/.test(t)) return "filosofia";
    return "general";
  }

  // Semillas 100% puras por disciplina (CERO cruces entre materias)
  const BANCO_PURO = {
    web: [
      ["¿Qué etiqueta HTML5 define el contenido principal único de una página web?", "<main>", "<footer>", "<aside>", "<br>", "La etiqueta <main> mejora la semántica y accesibilidad DUA para lectores de pantalla."],
      ["¿Cuál propiedad CSS activa un contenedor flexible de una dimensión?", "display: flex", "position: fixed", "float: center", "z-index: 10", "Flexbox (display: flex) permite alinear y distribuir elementos en fila o columna."],
      ["En JavaScript moderno, ¿qué palabra clave declara una referencia constante de bloque?", "const", "var", "global", "static", "const evita la reasignación accidental de la referencia dentro de su bloque."],
      ["¿Qué método de arreglos en JavaScript crea un nuevo arreglo transformando cada elemento?", "Array.prototype.map()", "Array.prototype.push()", "Array.prototype.pop()", "Array.prototype.splice()", "map() recorre el arreglo original y devuelve uno nuevo de igual longitud."],
      ["¿Qué código de estado HTTP indica que una API REST creó un recurso correctamente?", "201 Created", "404 Not Found", "500 Server Error", "403 Forbidden", "201 Created confirma la creación exitosa de un registro en el servidor."],
      ["En React, ¿cuál hook permite manejar estado local dentro de un componente funcional?", "useState", "useSQL", "useStyle", "useRoute", "useState devuelve el valor actual del estado y la función para actualizarlo."],
      ["¿Qué tecnología permite que una PWA funcione Offline-First cacheando recursos?", "Service Worker", "FTP Pasivo", "Telnet", "BIOS", "El Service Worker intercepta peticiones de red y sirve activos en caché sin conexión."],
      ["¿Qué atributo HTML es obligatorio en imágenes (<img>) para accesibilidad visual?", "alt", "bgcolor", "blink", "marquee", "El atributo alt describe la imagen para lectores de pantalla y cuando no carga."],
      ["¿Cuál sentencia SQL obtiene todos los registros de la tabla estudiantes ordenados por nombre?", "SELECT * FROM estudiantes ORDER BY nombre;", "GET ALL estudiantes SORT nombre;", "OPEN estudiantes BY nombre;", "FIND * IN estudiantes;", "SELECT ... FROM ... ORDER BY es la sintaxis estándar de PostgreSQL/SQL."],
      ["¿Qué comando de Git envía los commits locales confirmados hacia la rama main remota?", "git push origin main", "git delete main", "git clone local", "git format", "git push origin main publica el historial local confirmado al repositorio remoto."]
    ],
    ciber: [
      ["¿Cuáles son los tres pilares fundamentales de la Tríada CIA en Ciberseguridad?", "Confidencialidad, Integridad y Disponibilidad", "Color, Imagen y Audio", "Costo, Impuesto y Ahorro", "Cable, Internet y Antena", "Toda estrategia de seguridad protege Confidencialidad, Integridad y Disponibilidad."],
      ["¿Qué algoritmo criptográfico genera una huella digital irreversible de 256 bits para verificar integridad?", "SHA-256", "HTML5", "CSS3", "CSV", "SHA-256 es una función hash criptográfica unidireccional usada en verificación de documentos."],
      ["¿Qué ley regula la protección de datos personales de los habitantes en Costa Rica (PRODHAB)?", "Ley N.° 8968", "Ley N.° 9078", "Ley de Aguas", "Código de Minería", "La Ley N.° 8968 protege la autodeterminación informativa y crea la PRODHAB."],
      ["¿En qué consiste un ataque de phishing?", "Suplantar una entidad confiable para robar credenciales o datos bancarios", "Aumentar la memoria RAM de un servidor", "Actualizar el firmware del enrutador", "Hacer respaldos en la nube", "El phishing usa ingeniería social vía correo, SMS o sitios falsos para engañar a la víctima."],
      ["¿Qué control impide ataques de inyección SQL (SQL Injection) en aplicaciones web?", "Consultas parametrizadas (Prepared Statements) y validación de entradas", "Ocultar el botón de inicio de sesión", "Cambiar el color de fondo del formulario", "Desactivar HTTPS", "Las consultas parametrizadas separan el código SQL de los datos enviados por el usuario."],
      ["¿Qué significa RBAC en el diseño de permisos de una plataforma?", "Control de Acceso Basado en Roles", "Red Básica de Audio Central", "Respaldo Automático de Cables", "Registro de Búsqueda Rápida", "RBAC restringe cada módulo y acción exclusivamente al rol autorizado del usuario."],
      ["¿Qué protocolo cifra el tráfico entre navegador y servidor web utilizando TLS?", "HTTPS (puerto 443)", "HTTP (puerto 80)", "Telnet (puerto 23)", "FTP sin cifrar (puerto 21)", "HTTPS protege los datos en tránsito contra intercepción (Man-in-the-Middle)."],
      ["¿Por qué se bloquea una cuenta tras 5 intentos fallidos consecutivos de contraseña?", "Para mitigar ataques de fuerza bruta y relleno de credenciales", "Para ahorrar espacio en disco", "Para borrar la base de datos", "Para acelerar las animaciones CSS", "El bloqueo temporal frena intentos automatizados de adivinación de contraseñas."],
      ["¿Qué hace Row Level Security (RLS) en PostgreSQL / Supabase?", "Filtra a nivel de fila qué registros puede leer o modificar cada usuario autenticado", "Comprime imágenes PNG", "Cambia la resolución de pantalla", "Envía correos masivos", "RLS garantiza aislamiento de datos directamente en el motor de base de datos."],
      ["¿Cuál práctica describe mejor el principio de mínimo privilegio?", "Otorgar a cada usuario únicamente los permisos indispensables para su función", "Dar rol SuperAdmin a toda la institución", "Compartir una sola contraseña entre departamentos", "Dejar todas las tablas públicas", "El mínimo privilegio reduce drásticamente el impacto ante un error o cuenta comprometida."]
    ],
    electro: [
      ["¿Qué instrumento se utiliza para medir voltaje, corriente y resistencia en un circuito electrónico?", "Multímetro digital", "Termómetro clínico", "Barómetro", "Compás escolar", "El multímetro permite medir tensión (V), intensidad (A), resistencia (Ω) y continuidad."],
      ["¿Cuál es la unidad de medida internacional de la resistencia eléctrica?", "Ohmio (Ω)", "Voltio (V)", "Amperio (A)", "Vatio (W)", "La resistencia al paso de la corriente eléctrica se expresa en ohmios (Ω)."],
      ["¿Cómo se comporta la corriente eléctrica en un circuito conectado completamente en serie?", "Es la misma en todos los componentes del circuito", "Se divide en partes diferentes en cada resistor", "Es siempre cero amperios", "Cambia de voltaje a frecuencia", "En serie existe un único camino para la corriente, por lo que I total = I1 = I2."],
      ["¿Qué componente electrónico permite el paso de corriente en un solo sentido y emite luz?", "Diodo LED", "Resistor cerámico", "Fusible de vidrio", "Interruptor mecánico", "El LED (Light Emitting Diode) es un diodo polarizado con ánodo (+) y cátodo (-)."],
      ["¿Qué precaución es obligatoria antes de abrir un gabinete de computadora para mantenimiento?", "Desconectar la energía eléctrica y descargar estática con pulsera antiestática", "Encender el equipo al máximo", "Rociar agua sobre la tarjeta madre", "Retirar el disipador con el equipo encendido", "Evitar descargas electrostáticas (ESD) protege microprocesadores y módulos RAM."],
      ["¿Qué memoria almacena temporalmente los programas en ejecución y pierde datos al apagarse?", "Memoria RAM", "Disco SSD NVMe", "Memoria ROM / BIOS", "Unidad USB", "La RAM es volátil de acceso rápido; el SSD/HDD conserva datos de forma permanente."],
      ["¿Cuál componente protege un circuito eléctrico fundiéndose ante una sobrecarga o cortocircuito?", "Fusible o disyuntor (breaker)", "Capacitor electrolítico", "Transistor NPN", "Protoboard", "El fusible interrumpe físicamente el circuito antes de que se dañen equipos o haya incendio."],
      ["En un resistor de 4 bandas, ¿qué indica la cuarta banda (usualmente dorada o plateada)?", "La tolerancia porcentual del valor nominal", "La temperatura máxima del cable", "El voltaje de la batería", "El peso del componente", "Dorado indica ±5% y plateado ±10% de tolerancia en la resistencia."]
    ],
    conta: [
      ["¿Cuál es la ecuación contable fundamental?", "Activo = Pasivo + Patrimonio", "Activo = Gastos - Ingresos", "Pasivo = Activo + Patrimonio", "Utilidad = Pasivo × Impuesto", "Todo recurso controlado (Activo) es financiado por terceros (Pasivo) o propietarios (Patrimonio)."],
      ["¿Cuál es la tarifa general estándar del Impuesto al Valor Agregado (IVA) en Costa Rica?", "13%", "5%", "25%", "30%", "La Ley de Fortalecimiento de las Finanzas Públicas establece el 13% como tarifa general de IVA."],
      ["¿Qué función de Excel suma los valores de un rango solo cuando cumplen una condición?", "=SUMAR.SI()", "=CONCATENAR()", "=HOY()", "=LARGO()", "SUMAR.SI (SUMIF) evalúa un criterio lógico y totaliza únicamente las celdas que lo cumplen."],
      ["¿Cuál es la naturaleza del saldo normal de las cuentas de Activo?", "Deudora (aumentan al Debe y disminuyen al Haber)", "Acreedora (aumentan al Haber)", "Neutra sin registros", "Exclusivamente negativa", "Los activos y gastos tienen naturaleza deudora en la partida doble."],
      ["¿Qué estado financiero muestra los ingresos, costos y gastos de un periodo para determinar la utilidad?", "Estado de Resultados", "Estado de Cambios en Activos Fijos", "Planilla de Vacaciones", "Inventario de Mobiliario", "El Estado de Resultados refleja el desempeño operativo (ganancia o pérdida) en un periodo."],
      ["¿Qué documento respalda legalmente una venta de bienes o servicios ante el Ministerio de Hacienda?", "Factura Electrónica autorizada", "Una nota en papel sin consecutivo", "Un mensaje sin comprobante", "Un borrador sin fecha", "La facturación electrónica garantiza trazabilidad tributaria formal en Costa Rica."],
      ["¿Qué representa el Pasivo Corriente en el Balance General?", "Obligaciones y deudas con vencimiento menor o igual a un año", "Edificios y terrenos de la empresa", "El capital aportado por los socios", "Las ventas proyectadas a diez años", "Incluye cuentas por pagar a proveedores, salarios e impuestos de corto plazo."],
      ["En Excel, ¿cuál símbolo fija una referencia de celda absoluta al copiar fórmulas (ej. $B$2)?", "Signo de dólar ($)", "Signo de porcentaje (%)", "Asterisco (*)", "Numeral (#)", "El signo $ bloquea la columna y/o la fila al arrastrar fórmulas."]
    ],
    talleres: [
      ["¿Cuál es el propósito principal de los Talleres Exploratorios en III Ciclo (7.° a 9.°) de un CTP?", "Explorar vocaciones técnicas mediante proyectos prácticos antes de elegir especialidad en 10.°", "Sustituir las asignaturas académicas obligatorias", "Evaluar únicamente memorización de fechas", "Eliminar el trabajo en equipo", "Los talleres exploratorios permiten al estudiantado descubrir sus aptitudes técnico-profesionales."],
      ["¿Por qué es obligatorio el Equipo de Protección Personal (EPP) en un taller técnico?", "Para prevenir lesiones físicas, oculares, auditivas o eléctricas durante las prácticas", "Solo por estética del uniforme", "Porque reduce la duración de la clase", "Para evitar limpiar el taller", "La seguridad ocupacional preventiva protege la integridad de cada estudiante."],
      ["En la metodología de pensamiento de diseño (Design Thinking), ¿cuál es el primer paso?", "Empatizar y comprender la necesidad real del usuario o comunidad", "Fabricar sin planificar", "Descartar todas las ideas", "Vender sin prototipo", "Comprender el problema real permite diseñar soluciones útiles y viables."],
      ["¿Qué significa mantener orden y limpieza (metodología 5S) al finalizar una práctica de taller?", "Clasificar, ordenar, limpiar, estandarizar y sostener un espacio seguro", "Guardar herramientas rotas sin reportarlas", "Dejar cables conectados sobre el piso", "Mezclar materiales reciclables con químicos", "Las 5S previenen accidentes y fomentan cultura industrial de calidad."],
      ["¿Qué ventaja ofrece el trabajo colaborativo con roles definidos en un proyecto de taller?", "Combina fortalezas distintas, distribuye responsabilidades y mejora la calidad del producto", "Permite que solo una persona haga todo", "Elimina la necesidad de planificación", "Impide evaluar evidencias", "La co-creación con roles claros simula equipos reales del sector productivo."],
      ["Antes de encender una herramienta eléctrica o equipo de laboratorio, ¿qué debe verificar el estudiante?", "Estado de cables, superficie seca y autorización de la persona docente", "Usar la herramienta sin leer instrucciones", "Conectar múltiples regletas sobrecargadas", "Retirar las guardas de seguridad", "La inspección previa evita descargas eléctricas y fallas mecánicas."]
    ],
    comercial: [
      ["¿Cuál es el primer principio de la atención excelente al cliente?", "Escucha activa, empatía, respeto y respuesta oportuna a la necesidad", "Interrumpir al cliente antes de que explique", "Transferir la llamada sin dar seguimiento", "Responder con tecnicismos incomprensibles", "La calidad de servicio inicia comprendiendo exactamente qué necesita la persona usuaria."],
      ["En logística e inventarios, ¿qué significa el método PEPS (FIFO)?", "Primero en Entrar, Primero en Salir", "Pago Exclusivo Por Servicio", "Pedido Especial Para Sucursal", "Precio Estándar Por Semana", "PEPS evita obsolescencia y vencimiento despachando primero la mercadería más antigua."],
      ["En comercio exterior, ¿qué establecen los INCOTERMS publicados por la Cámara de Comercio Internacional?", "Responsabilidades, costos y transferencia de riesgo entre comprador y vendedor", "El salario mínimo de oficina", "El horario de los bancos locales", "El diseño del logotipo comercial", "Reglas como FOB, CIF y EXW definen claramente dónde termina la obligación del exportador."],
      ["¿Qué mide un KPI (Indicador Clave de Desempeño) en servicio al cliente o ventas?", "El grado de cumplimiento objetivo de metas medibles (ej. tiempo de respuesta o satisfacción)", "La decoración de la oficina", "La marca de los escritorios", "El color del uniforme", "Lo que se mide con KPIs objetivos se puede mejorar continuamente."],
      ["¿Qué es un CRM en la gestión comercial moderna?", "Sistema de gestión de relaciones con clientes para dar seguimiento a ventas y soporte", "Un cable de red local", "Un tipo de impresora térmica", "Un impuesto municipal", "Un CRM centraliza historial, cotizaciones y atención posventa."],
      ["En logística, ¿qué representa la 'última milla'?", "El tramo final de entrega desde el centro de distribución hasta el cliente final", "La compra de materia prima en fábrica", "El cierre contable anual", "El archivo de facturas antiguas", "Optimizar la última milla reduce costos y eleva la puntualidad percibida por el cliente."]
    ],
    diseno: [
      ["¿Cuál modelo de color se utiliza para pantallas digitales (web, aplicaciones y video)?", "RGB (Rojo, Verde, Azul)", "CMYK exclusivamente", "Pantone metálico únicamente", "Escala de grises fija", "RGB es un modelo aditivo de luz diseñado para monitores y teléfonos; CMYK se usa para impresión."],
      ["¿Cuál es la ventaja principal de un logotipo en formato vectorial (SVG) frente a un mapa de bits (JPG)?", "Escala a cualquier tamaño sin pixelarse ni perder nitidez", "Siempre pesa cientos de megabytes", "No permite transparencia", "Solo funciona en blanco y negro", "Los gráficos vectoriales se trazan con fórmulas matemáticas, manteniendo bordes limpios."],
      ["En diseño de interfaces (UI/UX), ¿por qué es esencial un alto contraste entre texto y fondo?", "Garantiza legibilidad y accesibilidad universal (estándar WCAG / DUA)", "Reduce la memoria del navegador", "Impide usar modo oscuro", "Elimina la jerarquía tipográfica", "Un contraste adecuado permite leer cómodamente en móvil, exteriores y baja visión."],
      ["¿Qué principio de diseño organiza títulos, subtítulos y cuerpo para guiar la mirada del lector?", "Jerarquía visual", "Ruido gráfico", "Saturación extrema", "Desalineación aleatoria", "La jerarquía visual comunica primero lo más importante mediante tamaño, peso y espacio."],
      ["¿Qué relación de aspecto corresponde a un afiche vertical para Estados de WhatsApp o Stories?", "9:16 (1080 × 1920 px)", "16:9 (1920 × 1080 px)", "1:1 (1080 × 1080 px)", "4:1 panorámico", "9:16 ocupa la pantalla completa vertical de los teléfonos inteligentes."],
      ["¿Qué significa entregar un diseño institucional en 'marca blanca'?", "Arte limpio propiedad de la institución, sin marcas de agua ni siglas de software ajenas", "Imprimir hojas completamente en blanco", "Usar solo color blanco en todo el afiche", "Omitir el escudo oficial del colegio", "La marca blanca respeta la soberanía visual de cada centro educativo o empresa."]
    ],
    espanol: [
      ["¿Cuándo llevan tilde las palabras agudas en español?", "Cuando terminan en n, s o vocal (ej. canción, café)", "Siempre sin excepción", "Solo cuando empiezan con vocal", "Nunca llevan tilde", "Las agudas cargan la voz en la última sílaba y se tildan si acaban en n, s o vocal."],
      ["¿Cuándo llevan tilde las palabras esdrújulas (ej. técnico, música, matemática)?", "Siempre llevan tilde sin excepción", "Solo si terminan en vocal", "Únicamente si son verbos", "Nunca llevan tilde", "Toda palabra esdrújula (acento en la antepenúltima sílaba) se tilda siempre."],
      ["¿Qué figura literaria compara dos elementos usando nexos como 'como', 'cual' o 'parece'?", "Símil", "Hipérbaton", "Onomatopeya", "Anáfora", "El símil establece comparación explícita mediante un nexo comparativo."],
      ["¿Qué figura literaria consiste en una exageración intencional (ej. 'te esperé mil años')?", "Hipérbole", "Metonimia", "Aliteración", "Antítesis", "La hipérbole amplifica o disminuye desmesuradamente una cualidad para dar énfasis."],
      ["¿Cuál novela clásica costarricense retrata la vida en las bananeras del Caribe y fue escrita por Carlos Luis Fallas?", "Mamita Yunai", "Don Quijote de la Mancha", "Cien años de soledad", "La Ilíada", "Mamita Yunai (1941) es obra cumbre de la literatura social costarricense."],
      ["En la oración 'El estudiante programó una aplicación', ¿cuál es el complemento directo?", "una aplicación", "El estudiante", "programó", "no tiene", "El complemento directo recibe directamente la acción del verbo (¿qué programó?)."],
      ["¿Qué tipo de tilde diferencia monosílabos como 'tú' (pronombre) y 'tu' (posesivo)?", "Tilde diacrítica", "Tilde prosódica", "Diéresis", "Punto y coma", "La tilde diacrítica distingue categorías gramaticales en palabras de igual escritura."],
      ["¿Qué es la idea principal de un párrafo en comprensión lectora?", "El mensaje esencial alrededor del cual giran las ideas secundarias y ejemplos", "Siempre la última palabra del texto", "Un dato numérico aislado", "El título de otro libro", "Identificar la idea principal permite resumir e inferir correctamente un texto."]
    ],
    ingles: [
      ["Choose the correct sentence in Present Simple for third person singular:", "She studies Web Development every day.", "She study Web Development every day.", "She studying Web Development every day.", "She are study Web Development.", "In Present Simple affirmative, third person singular (he/she/it) takes -s / -es / -ies."],
      ["Which preposition is correct for specific days of the week (e.g., ___ Monday)?", "on", "in", "at", "under", "Use 'on' for days and dates, 'in' for months/years, and 'at' for exact times."],
      ["What is the past tense of the irregular verb 'write'?", "wrote", "writed", "writtened", "writes", "Write -> wrote (past simple) -> written (past participle)."],
      ["Complete the First Conditional: 'If you practice daily, you ___ the exam.'", "will pass", "passed", "passing", "would passed", "First Conditional structure: If + Present Simple, will + base verb."],
      ["In Technical English, what does 'backup' mean?", "A security copy of data to prevent loss", "Turning off the monitor", "Deleting all folders permanently", "Printing a poster", "A backup protects critical files against hardware failure or cyberattacks."],
      ["Select the correct question in Past Simple:", "Did you finish the project yesterday?", "Do you finished the project yesterday?", "Did you finished the project yesterday?", "Was you finish the project?", "With auxiliary 'Did', the main verb stays in its base form ('finish')."],
      ["Which sentence uses the comparative adjective correctly?", "This server is faster than the old one.", "This server is more fast than the old one.", "This server is fastest than the old one.", "This server is fastly than the old one.", "Short one-syllable adjectives form the comparative with -er + than."],
      ["What is the meaning of 'deadline' in a workplace or school project?", "The final date and time by which a task must be submitted", "A broken internet cable", "A coffee break schedule", "A holiday celebration", "Meeting deadlines is a key professional skill in technical careers."]
    ],
    frances: [
      ["Comment dit-on 'Buenos días' de manera formal en francés?", "Bonjour", "Bonsoir", "Merci beaucoup", "Au revoir", "'Bonjour' se utiliza durante el día como saludo cordial y formal."],
      ["¿Cuál es la conjugación correcta del verbo 'être' (ser/estar) para 'Nous'?", "Nous sommes", "Nous suis", "Nous es", "Nous sont", "Je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont."],
      ["¿Qué significa la expresión 'Je m'appelle...'?", "Me llamo...", "Tengo hambre", "Vivo lejos", "Estudio música", "Es la fórmula estándar para presentar el nombre propio en francés."],
      ["¿Cómo se escribe el número 15 en francés?", "Quinze", "Cinq", "Cinquante", "Quatre", "11 onze, 12 douze, 13 treize, 14 quatorze, 15 quinze."],
      ["¿Cuál es la conjugación correcta del verbo 'avoir' (tener) para 'J''?", "J'ai", "Je suis", "J'as", "J'avons", "J'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont."],
      ["¿Qué día de la semana corresponde a 'Mercredi'?", "Miércoles", "Martes", "Viernes", "Domingo", "Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche."],
      ["¿Qué significa 'S'il vous plaît'?", "Por favor (formal)", "Hasta mañana", "De nada", "Buenas noches", "Es una expresión esencial de cortesía en francés."],
      ["¿Qué significa la palabra 'L'école'?", "La escuela / centro educativo", "El cuaderno", "La casa", "El tren", "'L'école' designa la escuela o institución de enseñanza."]
    ],
    biologia: [
      ["¿Qué organelo celular produce la mayor parte del ATP mediante la respiración celular?", "Mitocondria", "Pared celular", "Vacuola central", "Centríolo", "La mitocondria es conocida como la central energética de la célula eucariota."],
      ["¿En qué organelo vegetal ocurre la fotosíntesis utilizando luz solar, agua y CO₂?", "Cloroplasto", "Lisosoma", "Ribosoma", "Núcleo", "La clorofila dentro de los cloroplastos capta energía lumínica para producir glucosa y O₂."],
      ["¿Cuál proceso de división celular genera dos células hijas genéticamente idénticas (crecimiento y reparación)?", "Mitosis", "Meiosis", "Fecundación", "Ósmosis", "La mitosis mantiene el número cromosómico (2n), mientras la meiosis forma gametos (n)."],
      ["En la cadena de ADN, ¿con qué base nitrogenada se empareja siempre la Adenina (A)?", "Timina (T)", "Guanina (G)", "Citosina (C)", "Uracilo (U) en ADN", "En el ADN se emparejan A–T y C–G (el Uracilo aparece en el ARN)."],
      ["En una cadena trófica, ¿qué nivel ocupan las plantas y algas fotosintéticas?", "Productores primarios (autótrofos)", "Consumidores terciarios", "Descomponedores fúngicos", "Carnívoros tope", "Los productores transforman energía solar en materia orgánica disponible para el ecosistema."],
      ["¿Qué diferencia principal existe entre una célula procariota y una eucariota?", "La eucariota posee núcleo definido delimitado por membrana y la procariota no", "La procariota tiene cloroplastos gigantes", "La eucariota carece de ADN", "No existe diferencia", "Las bacterias son procariotas; animales, plantas, hongos y protistas son eucariotas."],
      ["¿Qué molécula transporta oxígeno en los glóbulos rojos de la sangre humana?", "Hemoglobina", "Insulina", "Celulosa", "Quitina", "La hemoglobina contiene hierro que enlaza el oxígeno en los pulmones."],
      ["¿Por qué Costa Rica es reconocida mundialmente en ecología?", "Por albergar cerca del 5%–6% de la biodiversidad mundial y proteger más del 25% de su territorio", "Por ser un desierto polar", "Por carecer de bosques tropicales", "Por tener una sola especie de ave", "Su ubicación puente entre continentes y microclimas generan extraordinaria biodiversidad."]
    ],
    quimica: [
      ["En la escala de pH (0 a 14), ¿qué valor corresponde a una disolución neutra como el agua pura?", "pH = 7", "pH = 1", "pH = 12", "pH = 14", "pH < 7 es ácido, pH = 7 es neutro y pH > 7 es básico o alcalino."],
      ["¿Qué partículas subatómicas tienen carga positiva y definen el número atómico (Z) de un elemento?", "Protones", "Electrones", "Neutrones", "Fotones", "El número de protones en el núcleo identifica de forma única a cada elemento químico."],
      ["¿Cuál es el símbolo químico oficial del Sodio en la tabla periódica?", "Na", "So", "S", "Sd", "Proviene del latín Natrium (Na); S corresponde al Azufre."],
      ["¿Qué tipo de enlace químico ocurre cuando dos átomos no metálicos comparten pares de electrones?", "Enlace covalente", "Enlace gravitacional", "Enlace magnético", "Enlace nuclear", "El enlace covalente comparte electrones (ej. H₂O, CO₂); el iónico los transfiere (ej. NaCl)."],
      ["¿Qué establece la Ley de Conservación de la Masa de Lavoisier en una reacción química?", "La masa total de los reactivos es igual a la masa total de los productos", "Los átomos desaparecen al calentarse", "La masa siempre se duplica", "Solo se conservan los líquidos", "La materia no se crea ni se destruye, solo se transforma."],
      ["¿Cómo se llama el cambio de estado de sólido directamente a gas sin pasar por líquido?", "Sublimación", "Condensación", "Fusión", "Solidificación", "Ejemplo clásico: el hielo seco (CO₂ sólido) pasa directo a gas."],
      ["Una disolución con pH = 2 (como el jugo de limón o ácido gástrico) se clasifica como:", "Fuertemente ácida", "Fuertemente básica", "Neutra", "Sal pura sólida", "Cuanto más cercano a 0 está el pH, mayor es la concentración de iones H⁺ (acidez)."],
      ["¿Cuál es la fórmula química del dióxido de carbono?", "CO₂", "H₂O", "NaCl", "O₂", "Contiene un átomo de carbono y dos átomos de oxígeno."]
    ],
    fisica: [
      ["¿Qué establece la Primera Ley de Newton (Ley de la Inercia)?", "Todo cuerpo mantiene su estado de reposo o MRU mientras no actúe una fuerza neta externa", "La fuerza es igual a masa por distancia", "Los cuerpos siempre frenan solos en el vacío", "La gravedad solo actúa de día", "La inercia es la resistencia de un cuerpo a cambiar su estado de movimiento."],
      ["¿Cuál es la unidad de medida de la Fuerza en el Sistema Internacional (SI)?", "Newton (N)", "Julio (J)", "Vatio (W)", "Metro (m)", "1 Newton equivale a 1 kg·m/s² según F = m · a."],
      ["¿Cuál es el valor aproximado estándar de la aceleración de la gravedad (g) en la superficie terrestre?", "9,8 m/s²", "1,2 m/s²", "98 m/s²", "0 m/s²", "Todos los cuerpos en caída libre sin rozamiento aceleran a ~9,8 m/s²."],
      ["¿Qué diferencia a una magnitud vectorial (como la velocidad) de una escalar (como la rapidez)?", "La vectorial posee magnitud, dirección y sentido; la escalar solo magnitud", "La escalar siempre es negativa", "La vectorial no tiene unidades", "No existe diferencia", "Velocidad, fuerza y aceleración son vectores; masa, tiempo y temperatura son escalares."],
      ["¿Cuál es la unidad de energía y trabajo mecánico en el Sistema Internacional?", "Julio (Joule, J)", "Amperio (A)", "Hertz (Hz)", "Kelvin (K)", "El trabajo mecánico W = F · d se mide en Julios (N·m)."],
      ["¿Qué energía posee un objeto debido a su altura respecto a un nivel de referencia?", "Energía potencial gravitatoria (Ep = m·g·h)", "Energía cinética", "Energía acústica", "Energía magnética", "La energía cinética depende de la velocidad y la potencial gravitatoria de la altura."]
    ],
    sociales: [
      ["¿En qué fecha se firmó el Acta de Independencia de Centroamérica en Guatemala (conocida en Costa Rica en octubre)?", "15 de setiembre de 1821", "11 de abril de 1856", "1 de diciembre de 1948", "25 de julio de 1824", "El 15 de setiembre de 1821 marcó el inicio de la vida independiente de Costa Rica."],
      ["¿Qué acontecimiento histórico se conmemora en Costa Rica cada 11 de abril?", "La Batalla de Rivas (1856) y la gesta heroica de Juan Santamaría", "La Anexión del Partido de Nicoya", "La abolición del ejército", "La creación del ferrocarril", "En 1856 los costarricenses defendieron la soberanía nacional frente a los filibusteros."],
      ["¿Qué hecho trascendental ocurrió en Costa Rica el 1 de diciembre de 1948?", "La abolición del ejército como institución permanente", "La fundación de Cartago", "La independencia de España", "La construcción del Teatro Nacional", "La abolición del ejército permitió invertir el presupuesto público en educación y salud."],
      ["¿Qué se celebra cada 25 de julio en Costa Rica?", "La Anexión del Partido de Nicoya a Costa Rica (1824)", "El Día del Trabajador", "La Batalla de Santa Rosa", "La Constitución de 1949", "Bajo el lema 'De la Patria por nuestra voluntad', Guanacaste enriqueció cultural y territorialmente al país."],
      ["¿Cuáles son los tres Poderes de la República de Costa Rica según la Constitución de 1949?", "Ejecutivo, Legislativo y Judicial (más el TSE con rango constitucional electoral)", "Militar, Bancario y Municipal", "Agrícola, Turístico y Comercial", "Únicamente Ejecutivo y Alcaldías", "La división de poderes garantiza pesos y contrapesos democráticos."],
      ["¿Qué institución costarricense garantiza la pureza del sufragio y organiza las elecciones nacionales?", "Tribunal Supremo de Elecciones (TSE)", "Banco Central", "ICE", "RECOPE", "El TSE goza de independencia constitucional para dirigir los procesos electorales."],
      ["¿Cuál es la cordillera volcánica que atraviesa el centro del país (Poás, Barva, Irazú, Turrialba)?", "Cordillera Volcánica Central", "Cordillera de Talamanca", "Cordillera de Guanacaste", "Fila Brunqueña", "La Cordillera Volcánica Central rodea el Valle Central y alberga suelos muy fértiles."],
      ["¿Qué garantiza el artículo 78 de la Constitución Política de Costa Rica?", "Educación preescolar, general básica y diversificada obligatoria, gratuita y costeada por la Nación", "Pago obligatorio de matrícula en escuelas públicas", "Prohibición de colegios técnicos", "Solo educación primaria", "La educación pública gratuita y obligatoria es pilar histórico del desarrollo costarricense."]
    ],
    edfisica: [
      ["¿Cuál es el objetivo principal del calentamiento previo antes de realizar ejercicio intenso?", "Aumentar temperatura muscular, flujo sanguíneo y movilidad articular para prevenir lesiones", "Agotar toda la energía antes del partido", "Evitar beber agua durante la clase", "Bajar la frecuencia cardiaca a cero", "Un calentamiento progresivo de 8–12 minutos prepara músculos, tendones y sistema cardiovascular."],
      ["¿Qué tipo de ejercicio utiliza oxígeno de forma continua durante esfuerzos prolongados (ej. trotar, nadar, ciclismo)?", "Ejercicio aeróbico", "Ejercicio puramente estático", "Levantamiento máximo de 1 segundo", "Sedentarismo", "El entrenamiento aeróbico fortalece el corazón, los pulmones y la resistencia."],
      ["¿Por qué es fundamental la hidratación con agua antes, durante y después de la actividad física?", "Reemplaza líquidos perdidos por sudor, regula la temperatura corporal y mantiene el rendimiento", "Porque sustituye el calentamiento", "Para aumentar los calambres", "Solo es necesaria en invierno", "La deshidratación disminuye la coordinación y aumenta el riesgo de golpe de calor."],
      ["En baloncesto, ¿cuántos jugadores de un mismo equipo están en cancha simultáneamente?", "5 jugadores por equipo", "11 jugadores por equipo", "6 jugadores por equipo", "9 jugadores por equipo", "El baloncesto reglamentario se juega 5 contra 5."],
      ["En voleibol, ¿cuál es el número máximo de toques permitidos por equipo antes de pasar el balón al campo rival?", "3 toques (sin contar el bloqueo)", "1 toque obligatorio", "6 toques", "Ilimitados", "La secuencia clásica de 3 toques es recepción, colocación y remate."],
      ["¿Qué capacidad física permite mover las articulaciones en su rango óptimo sin dolor?", "Flexibilidad", "Fuerza explosiva máxima", "Deshidratación", "Inmovilidad", "El estiramiento al finalizar (vuelta a la calma) mantiene y mejora la flexibilidad."],
      ["¿Qué valor fomenta el 'Juego Limpio' (Fair Play) en el deporte escolar?", "Respeto a reglas, compañeros, rivales y árbitros tanto en la victoria como en la derrota", "Ganar haciendo trampa si nadie mira", "Discutir agresivamente cada jugada", "Excluir a quienes están aprendiendo", "El deporte formativo construye salud física, disciplina y convivencia."],
      ["¿Cuántos minutos diarios de actividad física moderada a vigorosa recomienda la OMS para adolescentes?", "Al menos 60 minutos diarios", "5 minutos al mes", "0 minutos", "10 minutos al año", "Mantener al menos 60 min/día fortalece salud cardiovascular, ósea y mental."]
    ],
    musica: [
      ["¿Cuántas líneas y espacios conforman un pentagrama musical estándar?", "5 líneas y 4 espacios", "4 líneas y 5 espacios", "6 líneas y 6 espacios", "3 líneas y 2 espacios", "Sobre las 5 líneas y 4 espacios del pentagrama se escribe la altura de las notas."],
      ["En un compás de 4/4, ¿cuántos tiempos dura una figura musical 'blanca'?", "2 tiempos", "4 tiempos", "1 tiempo", "Medio tiempo", "En 4/4: redonda = 4, blanca = 2, negra = 1, corchea = 1/2."],
      ["¿Cuál instrumento de percusión de madera es símbolo nacional de la música folclórica de Costa Rica?", "La Marimba", "La Gaita escocesa", "El Sitar", "El Acordeón alpino", "La marimba fue declarada instrumento musical nacional de Costa Rica en 1996."],
      ["En el lenguaje musical (dinámica), ¿qué indica el término italiano 'forte' (f)?", "Tocar o cantar con intensidad fuerte", "Tocar muy suave", "Detener la obra completamente", "Acelerar el compás al triple", "'piano' (p) indica suave y 'forte' (f) indica fuerte."],
      ["¿Cuál es el orden ascendente de las siete notas musicales naturales?", "Do, Re, Mi, Fa, Sol, La, Si", "Do, Mi, Sol, Re, Fa, Si, La", "La, Do, Re, Sol, Mi, Fa, Si", "Fa, Sol, Do, Re, Mi, Si, La", "La escala diatónica de Do mayor sigue la secuencia Do-Re-Mi-Fa-Sol-La-Si."],
      ["¿Qué signo se coloca al inicio del pentagrama para indicar la altura de las notas agudas (voz, violín, flauta)?", "Clave de Sol", "Compás binario", "Silencio de negra", "Calderón", "La Clave de Sol ubica la nota Sol en la segunda línea del pentagrama."]
    ],
    artes: [
      ["En teoría tradicional del color (pigmentos), ¿cuáles son los tres colores primarios?", "Amarillo, Azul y Rojo", "Verde, Naranja y Violeta", "Blanco, Negro y Gris", "Café, Celeste y Rosado", "A partir de los colores primarios se obtienen los secundarios (verde, naranja, violeta)."],
      ["¿Qué color secundario se obtiene al mezclar pigmento azul con amarillo?", "Verde", "Naranja", "Violeta", "Gris oscuro", "Azul + Amarillo = Verde; Rojo + Amarillo = Naranja; Rojo + Azul = Violeta."],
      ["¿Qué técnica pictórica utiliza pigmentos diluidos en agua sobre papel absorbente generando transparencias?", "Acuarela", "Escultura en mármol", "Tallado en metal", "Grabado en piedra caliza", "La acuarela destaca por su luminosidad y superposición de capas translúcidas."],
      ["¿Qué recurso visual crea la ilusión de profundidad tridimensional en un dibujo plano usando un punto de fuga?", "Perspectiva lineal", "Collage sin fondo", "Puntillismo plano", "Monocromía plana", "Las líneas paralelas convergen visualmente hacia el punto de fuga en el horizonte."],
      ["¿Qué colores se consideran 'cálidos' en la rueda cromática?", "Rojo, naranja y amarillo", "Azul, verde azulado y violeta frío", "Negro y gris", "Solo blanco", "Los tonos cálidos evocan energía, sol y cercanía visual."],
      ["¿Qué manifestación artística tradicional de Sarchí, Costa Rica, es Patrimonio Cultural por sus diseños geométricos y florales?", "La decoración de la carreta típica costarricense", "La pintura rupestre alpina", "El mosaico romano", "La cerámica vikinga", "El fileteado y pintura de la carreta típica es ícono del arte popular costarricense."]
    ],
    psicologia: [
      ["¿Qué es la inteligencia emocional según Daniel Goleman?", "La capacidad de reconocer, comprender y regular las emociones propias y ajenas", "Memorizar fórmulas sin descansar", "Ocultar siempre cualquier sentimiento", "Evitar toda interacción social", "Incluye autoconciencia, autorregulación, motivación, empatía y habilidades sociales."],
      ["¿Qué caracteriza a la comunicación asertiva?", "Expresar ideas, límites y emociones con claridad, firmeza y respeto hacia los demás", "Imponer la opinión gritando", "Callar siempre aunque se vulneren derechos", "Usar sarcasmo constante", "La asertividad es el equilibrio sano entre la pasividad y la agresividad."],
      ["¿Cuál estrategia ayuda de forma saludable a manejar el estrés académico antes de un examen?", "Planificar bloques de estudio con pausas, respiración profunda y dormir adecuadamente", "Estudiar sin dormir la madrugada previa", "Aislarse sin pedir ayuda", "Abandonar la preparación", "El sueño consolida la memoria y la respiración diafragmática reduce la ansiedad."],
      ["¿Qué es la empatía en las relaciones interpersonales?", "La capacidad de ponerse en el lugar de la otra persona y comprender su perspectiva", "Juzgar sin escuchar", "Imponer soluciones sin preguntar", "Ignorar el dolor ajeno", "La empatía fortalece la convivencia escolar y previene el acoso."],
      ["¿Qué función cumple la memoria de trabajo durante el aprendizaje?", "Mantener y manipular información temporalmente mientras resolvemos un problema", "Guardar recuerdos de hace 50 años", "Controlar los latidos del corazón", "Regular la digestión", "Dividir tareas complejas en pasos cortos evita sobrecargar la memoria de trabajo."],
      ["¿Qué describe el concepto de resiliencia psicológica?", "La capacidad de adaptarse, aprender y salir fortalecido frente a adversidades o fracasos", "No sentir nunca tristeza", "Evitar cualquier desafío nuevo", "Culpar a otros de cada error", "La resiliencia transforma obstáculos en oportunidades de crecimiento personal."]
    ],
    filosofia: [
      ["¿Qué método filosófico utilizaba Sócrates haciendo preguntas encadenadas para que el interlocutor descubriera la verdad?", "La mayéutica", "El dogmatismo cerrado", "El empirismo estadístico", "El conductismo", "Mediante el diálogo crítico, la mayéutica ayudaba a 'dar a luz' ideas bien fundamentadas."],
      ["¿En qué consiste la falacia lógica 'Ad Hominem'?", "Atacar personalmente a quien habla en lugar de refutar su argumento con razones", "Presentar datos verificados", "Citar una demostración matemática", "Hacer un resumen objetivo", "Invalidar una idea solo por insultar o desacreditar a la persona es una falacia clásica."],
      ["¿Cuál es la conclusión válida del silogismo: 'Todos los humanos son mortales; Sócrates es humano'?", "Por lo tanto, Sócrates es mortal", "Por lo tanto, todos los mortales son Sócrates", "Por lo tanto, Sócrates es inmortal", "No se puede concluir nada", "En lógica deductiva válida, la conclusión se deriva necesariamente de las premisas."],
      ["¿Qué significa la famosa frase de René Descartes 'Cogito, ergo sum' ('Pienso, luego existo')?", "El acto mismo de dudar y pensar demuestra con certeza la propia existencia del sujeto", "Solo existen las computadoras", "No se debe cuestionar nada", "La experiencia sensorial nunca engaña", "Descartes la usó como primera verdad indudable de su método racionalista."],
      ["¿Qué rama de la filosofía reflexiona sobre los principios del bien, el deber y la conducta moral?", "La Ética", "La Acústica", "La Botánica", "La Cartografía", "La ética analiza críticamente los valores que orientan decisiones responsables."],
      ["¿Qué caracteriza a la falacia de 'Falsa Dicotomía'?", "Presentar solo dos opciones extremas cuando en realidad existen más alternativas válidas", "Analizar todas las variables posibles", "Pedir evidencia empírica", "Escuchar distintas posturas", "Reducir un tema complejo a 'todo o nada' distorsiona el razonamiento crítico."]
    ],
    religion: [
      ["¿Cuál es el fundamento ético de la dignidad humana promovido en Educación Religiosa y Valores del MEP?", "Toda persona tiene valor intrínseco inalienable y merece respeto, justicia y trato humano", "El valor de una persona depende solo de sus bienes materiales", "Solo algunos grupos merecen respeto", "La dignidad se otorga únicamente por edad", "El respeto a la dignidad humana es base de los derechos humanos y la convivencia."],
      ["¿Qué significa la 'Regla de Oro' presente en múltiples tradiciones espirituales y éticas del mundo?", "Tratar a los demás de la misma manera en que deseamos ser tratados", "Buscar siempre el beneficio propio a costa de otros", "Responder a una ofensa con mayor agresividad", "Evitar ayudar a quien lo necesita", "La reciprocidad ética promueve paz, solidaridad y justicia comunitaria."],
      ["¿Cómo se manifiesta la solidaridad auténtica en una comunidad educativa?", "Acompañando y apoyando de forma concreta a quienes atraviesan necesidad o vulnerabilidad", "Ignorando las dificultades de los compañeros", "Presumiendo logros para humillar a otros", "Participando solo si hay premio económico", "La solidaridad construye tejido social y fraternidad real."],
      ["¿Por qué es esencial el diálogo interreligioso y el respeto a la libertad de conciencia en Costa Rica?", "Porque fortalece la paz social, la inclusión y la convivencia respetuosa en la diversidad", "Para obligar a todos a pensar exactamente igual", "Para impedir el pensamiento crítico", "Porque elimina los valores cívicos", "El respeto a las creencias y convicciones ajenas enriquece una sociedad democrática."],
      ["¿Qué implica practicar la honestidad e integridad en la vida estudiantil y profesional?", "Actuar con verdad, transparencia y coherencia incluso cuando nadie está observando", "Copiar trabajos si no hay supervisión", "Alterar evidencias para obtener mejor nota", "Cumplir promesas solo cuando conviene", "La integridad genera confianza duradera en la familia, el colegio y el trabajo."],
      ["¿Qué propone el valor de la resolución pacífica de conflictos?", "Dialogar con respeto, escuchar ambas partes y buscar acuerdos justos sin violencia", "Imponer la fuerza física", "Guardar rencor indefinidamente", "Difundir rumores en redes sociales", "Construir cultura de paz es compromiso central de la formación integral MEP."]
    ],
    mopt: [
      { cat: "COMUN", q: "¿Cuál es la velocidad máxima permitida en Zona Escolar con presencia de estudiantes según la Ley N.° 9078?", o: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], e: "El artículo 98 de la Ley de Tránsito N.° 9078 fija el límite estricto en 25 km/h en zonas escolares y hospitalarias." },
      { cat: "COMUN", q: "En una rotonda de dos carriles en Costa Rica, ¿cuál carril debe usar para tomar la primera o segunda salida (seguir recto)?", o: ["El carril externo (derecho)", "El carril interno exclusivamente", "El espaldón", "Cualquiera sin direccional"], e: "El carril externo es para la 1.ª salida o seguir recto (2.ª salida); el interno es para la 3.ª salida o retorno." },
      { cat: "COMUN", q: "En una rotonda de tres carriles, ¿quién tiene la prioridad de paso al momento del ingreso?", o: ["Los vehículos que ya circulan dentro de la rotonda", "El vehículo que va entrando por la derecha", "El vehículo más grande aunque esté afuera", "Quien acelere más rápido"], e: "Al ingresar a cualquier rotonda existe señal de Ceda; tienen prioridad quienes ya circulan en el anillo." },
      { cat: "COMUN", q: "¿Qué exige la señal vertical octagonal roja de ALTO?", o: ["Detención total (0 km/h) antes de la línea de parada y verificar ambos sentidos", "Reducir un poco sin detenerse", "Pitar y continuar", "Prioridad sobre peatones"], e: "La señal de ALTO obliga a detener por completo el vehículo antes del paso peatonal o línea de parada." },
      { cat: "COMUN", q: "Cuando una persona peatona ya inició el cruce en un paso de cebra, ¿qué debe hacer el conductor?", o: ["Detenerse completamente y ceder el paso al peatón", "Acelerar para pasar antes", "Esquivarlo por el carril contrario", "Pitar para apurarlo"], e: "El peatón tiene prioridad absoluta en pasos peatonales y zonas escolares bajo la Ley N.° 9078." },
      { cat: "COMUN", q: "Al llegar a un puente angosto de un solo carril con señal de CEDA y un vehículo aproximándose de frente, usted debe:", o: ["Detenerse antes del puente y ceder el paso hasta que el otro vehículo salga", "Entrar rápido al puente primero", "Encender luces altas para intimidar", "Circular por la baranda"], e: "Nunca se debe ingresar a un puente angosto cuando otro vehículo con prioridad ya lo está cruzando." },
      { cat: "COMUN", q: "¿Qué indica una doble línea amarilla continua en el centro de la carretera?", o: ["Prohibición absoluta de adelantar en ambos sentidos", "Permitido adelantar en curva", "Zona de parqueo libre", "Carril reversible"], e: "La doble línea amarilla continua prohíbe rebasar para ambos sentidos por riesgo de colisión frontal." },
      { cat: "COMUN", q: "¿Con cuánta anticipación mínima debe poner la luz direccional antes de girar o cambiar de carril?", o: ["Al menos 30 metros antes de la maniobra", "Cuando ya terminó de girar", "Solo de noche", "No es obligatoria"], e: "Anticipar la maniobra con direccionales previene colisiones laterales y alcances." },
      { cat: "MOTO", q: "Para conductores de motocicleta (Licencia A), ¿cuándo debe ir encendida la luz delantera en Costa Rica?", o: ["Las 24 horas del día (día y noche)", "Solo después de las 6:00 p. m.", "Únicamente con neblina", "Solo en autopista"], e: "La Ley N.° 9078 exige luz delantera encendida permanentemente en motocicletas." },
      { cat: "MOTO", q: "¿Cuál licencia habilita la conducción de motocicletas sin límite de cilindrada (más de 500 cc)?", o: ["Licencia tipo A3", "Licencia tipo A1", "Licencia tipo B1", "Licencia tipo C2"], e: "A1 hasta 125 cc, A2 hasta 500 cc y A3 sin límite de cilindrada." },
      { cat: "MOTO", q: "¿Qué equipo de protección es obligatorio para conductor y acompañante de motocicleta?", o: ["Casco certificado bien abrochado y prenda o cinta retrorreflectiva", "Gorra y anteojos de sol", "Solo casco desabrochado", "Ninguno en recorridos cortos"], e: "El casco certificado y el material reflectivo salvan vidas y son exigidos por ley." },
      { cat: "MOTO", q: "¿Está permitido que una motocicleta adelante zigzagueando entre filas de vehículos en movimiento?", o: ["No, está prohibido circular entre carriles con tránsito en movimiento", "Sí, a cualquier velocidad", "Sí, en rotondas", "Sí, si toca bocina"], e: "Circular entre vehículos en movimiento o adelantar por la derecha conlleva multa y alto riesgo." },
      { cat: "CARRO", q: "¿Hasta qué peso bruto vehicular autoriza conducir la Licencia tipo B1?", o: ["Hasta 4.000 kg (automóviles y vehículos livianos)", "Hasta 25.000 kg", "Autobuses de 50 pasajeros", "Motocicletas de 1000 cc"], e: "La licencia B1 habilita automóviles, SUV y pick-ups hasta 4.000 kg de peso bruto." },
      { cat: "CARRO", q: "¿Quiénes deben viajar obligatoriamente en dispositivo de retención infantil (silla/booster) en automóvil?", o: ["Menores de 12 años con estatura inferior a 1,45 metros", "Solo bebés menores de 3 meses", "Nadie en el asiento trasero", "Solo en autopistas"], e: "La normativa costarricense exige silla o booster homologado según edad, peso y estatura (<1,45 m)." },
      { cat: "CARRO", q: "Si su automóvil sufre hidroplaneamiento (aquaplaning) por lluvia fuerte, ¿qué debe hacer?", o: ["Soltar suavemente el acelerador, sujetar firme el volante y evitar frenar de golpe", "Frenar a fondo bruscamente", "Girar el volante violentamente", "Apagar el motor"], e: "Soltar el acelerador permite que las llantas desalojen el agua y recuperen tracción." },
      { cat: "CAMION", q: "¿Qué licencia autoriza en Costa Rica la conducción de camiones articulados (tráileres) sin límite de peso?", o: ["Licencia tipo B4", "Licencia tipo B1", "Licencia tipo A2", "Licencia tipo C1"], e: "B2 hasta 8.000 kg, B3 rígidos todo peso y B4 articulados de todo peso." },
      { cat: "CAMION", q: "Al descender una pendiente prolongada con camión pesado, ¿cómo se evita el sobrecalentamiento de frenos?", o: ["Usando marchas bajas y freno de motor", "Bajando en neutro y frenando seguido", "Apagando las luces", "Acelerando en las curvas"], e: "El freno de motor controla el descenso sin cristalizar ni recalentar las fibras de freno." },
      { cat: "CAMION", q: "¿Cuál es la precaución clave de un camión en una rotonda de 2 o 3 carriles?", o: ["Reducir velocidad, vigilar ángulos muertos laterales y considerar su radio amplio de giro", "Circular a 60 km/h", "No poner direccional", "Subirse a la isla central"], e: "Los vehículos largos requieren mayor espacio de giro y control permanente de puntos ciegos." },
      { cat: "BUS", q: "¿Qué licencia habilita la conducción de autobuses de transporte remunerado de personas?", o: ["Licencia tipo C2", "Licencia tipo B1", "Licencia tipo A3", "Licencia tipo D1"], e: "C1 es para taxi y C2 para autobuses, busetas y microbuses de transporte público." },
      { cat: "BUS", q: "¿Qué límite de alcohol en sangre aplica a conductores profesionales (bus, camión pesado, taxi)?", o: ["Máximo 0,20 g/L (sanción penal sobre 0,50 g/L)", "Hasta 1,20 g/L", "Hasta 0,90 g/L libre", "No tienen límite"], e: "Los conductores profesionales tienen tolerancia mínima bajo la Ley N.° 9078." },
      { cat: "BUS", q: "¿Qué equipo de emergencia debe portar obligatoriamente todo autobús escolar o público?", o: ["Salidas de emergencia señalizadas, extintor vigente, botiquín y triángulos", "Solo radio estéreo", "Llantas lisas", "Puertas abiertas en marcha"], e: "El equipo de emergencia completo es requisito de inspección técnica y seguridad vial." }
    ]
  };

  // Generadores numéricos paramétricos 100% puros por disciplina (cambian los valores reales en cada ítem)
  function generarNumericosPorTipo(tipo, areaId) {
    const res = [];
    if (tipo === "mate") {
      // Sumas/Restas/Multiplicaciones/Álgebra/Pitágoras/Porcentajes/Pendientes (100+ ítems variados)
      for (let i = 1; i <= 16; i++) {
        const a = 3 + i, b = 4 + ((i * 3) % 11), suma = a + b;
        res.push({ a: areaId, d: "Básico", q: `Calcule el resultado exacto de la operación: ${a} + ${b} × 2`, o: [`${a + b * 2}`, `${(a + b) * 2}`, `${suma + 4}`, `${a * 2 + b}`], c: 0, g: "Resuelve primero la multiplicación y luego la suma (jerarquía de operaciones).", e: `${b} × 2 = ${b*2}; luego ${a} + ${b*2} = ${a + b*2}.` });
        const x = 2 + (i % 9), m = 2 + (i % 6), n = i * 3, rhs = m * x + n;
        res.push({ a: areaId, d: "Medio", q: `Resuelva la ecuación lineal ${m}x + ${n} = ${rhs}. ¿Cuánto vale x?`, o: [`x = ${x}`, `x = ${x + 2}`, `x = ${x + 1}`, `x = ${Math.max(1, x - 1)}`], c: 0, g: "Resta el término independiente en ambos lados y divide por el coeficiente de x.", e: `${m}x = ${rhs - n} ⇒ x = ${(rhs - n)} / ${m} = ${x}.` });
        const base = (i + 2) * 1000, pct = (i % 5 + 1) * 10, finalP = base - (base * pct / 100);
        res.push({ a: areaId, d: "Intermedio", q: `Un artículo cuesta ₡${base.toLocaleString("es-CR")} y recibe un ${pct}% de descuento. ¿Cuál es el precio a pagar?`, o: [`₡${finalP.toLocaleString("es-CR")}`, `₡${(base - pct * 10).toLocaleString("es-CR")}`, `₡${(base + base * pct / 100).toLocaleString("es-CR")}`, `₡${(finalP - 200).toLocaleString("es-CR")}`], c: 0, g: "Multiplica el precio por el porcentaje de descuento y réstalo al monto inicial.", e: `${pct}% de ₡${base.toLocaleString("es-CR")} = ₡${(base*pct/100).toLocaleString("es-CR")}; total = ₡${finalP.toLocaleString("es-CR")}.` });
        const fX = 2 + (i % 7), pend = 3 + (i % 4), inter = 1 + (i % 5), yVal = pend * fX + inter;
        res.push({ a: areaId, d: "Avanzado", q: `Dada la función lineal f(x) = ${pend}x + ${inter}, ¿cuál es el valor de f(${fX})?`, o: [`${yVal}`, `${pend + fX + inter}`, `${yVal + pend}`, `${yVal - inter}`], c: 0, g: "Sustituye x por el valor dado y evalúa la expresión.", e: `f(${fX}) = ${pend}(${fX}) + ${inter} = ${pend*fX} + ${inter} = ${yVal}.` });
      }
      [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25],[10,24,26],[12,16,20],[15,20,25],[18,24,30],[20,21,29],[12,35,37]].forEach(([c1,c2,h], idx) => {
        res.push({ a: areaId, d: DIFFS[idx % 4], q: `En un triángulo rectángulo cuyos catetos miden ${c1} cm y ${c2} cm, ¿cuánto mide la hipotenusa?`, o: [`${h} cm`, `${c1 + c2} cm`, `${h + 2} cm`, `${Math.max(1, h - 1)} cm`], c: 0, g: "Aplica Pitágoras: h = √(a² + b²).", e: `√(${c1}² + ${c2}²) = √${h*h} = ${h} cm.` });
      });
    } else if (tipo === "electro") {
      // Ley de Ohm (V, I, R), Potencia (P=V*I) y Resistencias en serie (variaciones reales)
      const pares = [[12,3],[12,4],[12,6],[24,4],[24,6],[24,8],[9,3],[15,5],[18,6],[20,4],[30,5],[36,9],[48,6],[48,8],[60,12]];
      pares.forEach(([v,r], idx) => {
        const iVal = v / r, pVal = v * iVal;
        res.push({ a: areaId, d: idx < 5 ? "Básico" : "Medio", q: `Un circuito electrónico tiene fuente de ${v} V y resistencia de ${r} Ω. ¿Qué corriente (I) circula?`, o: [`${iVal} A`, `${v * r} A`, `${v + r} A`, `${iVal + 2} A`], c: 0, g: "Aplica la Ley de Ohm: I = V / R.", e: `I = ${v} V / ${r} Ω = ${iVal} A.` });
        res.push({ a: areaId, d: idx < 5 ? "Intermedio" : "Avanzado", q: `Si una carga opera a ${v} V consumiendo ${iVal} A, ¿qué potencia eléctrica (P) disipa?`, o: [`${pVal} W`, `${v + iVal} W`, `${Math.round(v / iVal)} W`, `${pVal + 10} W`], c: 0, g: "Aplica la fórmula de potencia: P = V × I.", e: `P = ${v} V × ${iVal} A = ${pVal} W.` });
      });
      for (let k = 1; k <= 12; k++) {
        const r1 = k * 10, r2 = (k + 2) * 10, r3 = (k + 4) * 10, rt = r1 + r2 + r3;
        res.push({ a: areaId, d: DIFFS[k % 4], q: `Tres resistores de ${r1} Ω, ${r2} Ω y ${r3} Ω se conectan en serie. ¿Cuál es la resistencia equivalente total?`, o: [`${rt} Ω`, `${r1 + r2} Ω`, `${Math.round(rt / 3)} Ω`, `${r3} Ω`], c: 0, g: "En serie las resistencias se suman directamente: Rt = R1 + R2 + R3.", e: `Rt = ${r1} + ${r2} + ${r3} = ${rt} Ω.` });
      }
    } else if (tipo === "fisica") {
      // MRU, F=m*a, Energía Cinética y Potencial (variaciones reales)
      for (let k = 1; k <= 15; k++) {
        const v = 20 + k * 5, t = 2 + (k % 5), d = v * t;
        res.push({ a: areaId, d: "Básico", q: `Un móvil se desplaza en MRU a ${v} km/h durante ${t} horas. ¿Qué distancia recorre?`, o: [`${d} km`, `${v + t} km`, `${Math.round(v / t)} km`, `${d + v} km`], c: 0, g: "Usa d = v × t.", e: `d = ${v} km/h × ${t} h = ${d} km.` });
        const m = 2 + k * 2, acc = 2 + (k % 6), f = m * acc;
        res.push({ a: areaId, d: "Medio", q: `¿Qué fuerza neta se requiere para acelerar una masa de ${m} kg a razón de ${acc} m/s²?`, o: [`${f} N`, `${m + acc} N`, `${Math.round(m / acc)} N`, `${f + 5} N`], c: 0, g: "Aplica Segunda Ley de Newton: F = m × a.", e: `F = ${m} kg × ${acc} m/s² = ${f} N.` });
        const vel = 2 + (k % 6) * 2, ec = 0.5 * m * vel * vel;
        res.push({ a: areaId, d: "Avanzado", q: `Un cuerpo de ${m} kg se mueve a ${vel} m/s. ¿Cuál es su energía cinética (Ec)?`, o: [`${ec} J`, `${m * vel} J`, `${ec * 2} J`, `${m + vel * vel} J`], c: 0, g: "Usa Ec = ½ · m · v².", e: `Ec = 0.5 × ${m} × ${vel}² = ${ec} J.` });
      }
    } else if (tipo === "conta") {
      // Ecuación contable e IVA 13% Costa Rica (variaciones reales)
      for (let k = 1; k <= 15; k++) {
        const pas = k * 50000, pat = (k + 3) * 100000, act = pas + pat;
        res.push({ a: areaId, d: "Básico", q: `Una empresa posee Pasivos por ₡${pas.toLocaleString("es-CR")} y Patrimonio por ₡${pat.toLocaleString("es-CR")}. ¿A cuánto asciende su Activo total?`, o: [`₡${act.toLocaleString("es-CR")}`, `₡${Math.abs(pat - pas).toLocaleString("es-CR")}`, `₡${(act + 50000).toLocaleString("es-CR")}`, `₡${pat.toLocaleString("es-CR")}`], c: 0, g: "Aplica Activo = Pasivo + Patrimonio.", e: `₡${pas.toLocaleString("es-CR")} + ₡${pat.toLocaleString("es-CR")} = ₡${act.toLocaleString("es-CR")}.` });
        const sub = k * 10000, iva = Math.round(sub * 0.13), tot = sub + iva;
        res.push({ a: areaId, d: "Intermedio", q: `Calcule el total de una factura gravada con 13% de IVA sobre un subtotal de ₡${sub.toLocaleString("es-CR")}:`, o: [`₡${tot.toLocaleString("es-CR")} (IVA ₡${iva.toLocaleString("es-CR")})`, `₡${(sub + sub * 0.10).toLocaleString("es-CR")}`, `₡${(sub - iva).toLocaleString("es-CR")}`, `₡${(sub + 1300).toLocaleString("es-CR")}`], c: 0, g: "Multiplica el subtotal por 0,13 para obtener el IVA y súmalo al subtotal.", e: `IVA = ₡${iva.toLocaleString("es-CR")}; Total = ₡${tot.toLocaleString("es-CR")}.` });
      }
    }
    return res;
  }

  function expandirBancoEstrictoX10() {
    if (window.__BDS_BANCO_V188_OK) return window.__BDS_BANCO_STATS;

    const malla = Array.isArray(window.BDS_MALLA_MEP) ? window.BDS_MALLA_MEP : [];
    const origCurado = Array.isArray(window.BDS_BANCO_CURADO) ? window.BDS_BANCO_CURADO : [];
    const beforeTotal = origCurado.length;
    const beforeByArea = {};
    origCurado.forEach(it => { beforeByArea[it.a] = (beforeByArea[it.a] || 0) + 1; });

    const nuevoBanco = [];
    const seen = new Set();

    function addItem(it) {
      if (!it || !it.a || !it.q || !Array.isArray(it.o) || it.o.length < 2) return;
      const key = `${it.a}||${it.q.trim().toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      nuevoBanco.push(it);
    }

    const marcos = [
      (q) => q,
      (q, nom) => `[${nom} — Caso práctico] ${q}`,
      (q, nom) => `En una evaluación oficial de ${nom}, responda: ${q}`,
      (q, nom) => `Durante una práctica guiada de ${nom}: ${q}`,
      (q, nom) => `Analice el siguiente concepto clave de ${nom}: ${q}`,
      (q, nom) => `Aplicación técnica en ${nom}: ${q}`,
      (q, nom) => `Prueba diagnóstica de ${nom}: ${q}`,
      (q, nom) => `Simulacro institucional de ${nom}: ${q}`,
      (q, nom) => `Verificación de dominio en ${nom}: ${q}`,
      (q, nom) => `Reto de comprensión en ${nom}: ${q}`
    ];

    const escenariosMopt = [
      "",
      "En conducción urbana en Costa Rica: ",
      "Durante el examen teórico oficial del COSEVI: ",
      "Con lluvia moderada en carretera nacional: ",
      "Al aplicar manejo defensivo (Ley N.° 9078): ",
      "En hora pico en el Gran Área Metropolitana: ",
      "Al circular de noche con señalización vial: ",
      "En una intersección con tránsito mixto: ",
      "En una evaluación preventiva de seguridad vial: ",
      "Ante inspección de oficial de tránsito: "
    ];

    // Construir banco 100% PURO por cada una de las 22 áreas de BDS_MALLA_MEP
    malla.forEach((mat) => {
      const tipo = detectarTipoArea(mat);

      // 1. Conservar ítems originales que realmente pertenecen a esta área (excepto mopt que usa banco puro MOPT)
      if (tipo !== "mopt") {
        origCurado.filter(x => x.a === mat.id).forEach(it => addItem({ ...it, a: mat.id, d: DIFFS.includes(it.d) ? it.d : "Medio" }));
      }

      // 2. Inyectar generadores paramétricos numéricos puros (Mate, Electro, Física, Conta)
      generarNumericosPorTipo(tipo, mat.id).forEach(it => addItem(it));

      // 3. Expandir banco puro específico del área (×10 variaciones con los 4 niveles balanceados)
      if (tipo === "mopt") {
        BANCO_PURO.mopt.forEach((bm, bi) => {
          escenariosMopt.forEach((pref, ei) => {
            addItem({
              a: mat.id,
              moptCat: bm.cat,
              d: DIFFS[(bi + ei) % 4],
              q: `${pref}${bm.q}`,
              o: bm.o.slice(),
              c: 0,
              g: "Recuerda las prioridades de paso y límites vigentes de la Ley N.° 9078 (MOPT/COSEVI).",
              e: bm.e
            });
          });
        });
      } else {
        const seeds = BANCO_PURO[tipo] || [];
        seeds.forEach((s, si) => {
          const [q, ok, d1, d2, d3, exp] = s;
          for (let r = 0; r < 10; r++) {
            addItem({
              a: mat.id,
              d: DIFFS[(si + r) % 4],
              q: marcos[r](q, mat.name),
              o: [ok, d1, d2, d3],
              c: 0,
              g: `Enfócate exclusivamente en los fundamentos oficiales de ${mat.name}.`,
              e: exp
            });
          }
        });
      }
    });

    window.BDS_BANCO_CURADO = nuevoBanco;
    const moptMat = malla.find(m => detectarTipoArea(m) === "mopt");
    const moptId = moptMat ? moptMat.id : "mopt";
    window.BDS_BANCO_MOPT = nuevoBanco.filter(x => x.a === moptId);

    // Estadísticas reales para consola y UI
    const afterByArea = {};
    const afterByDiff = { "Básico": 0, "Medio": 0, "Intermedio": 0, "Avanzado": 0 };
    nuevoBanco.forEach(it => {
      afterByArea[it.a] = (afterByArea[it.a] || 0) + 1;
      const dk = DIFFS.includes(it.d) ? it.d : "Intermedio";
      afterByDiff[dk] = (afterByDiff[dk] || 0) + 1;
    });

    // GENERADOR DE SIMULACRO CON AISLAMIENTO 100% ESTRICTO (NUNCA MEZCLA MATERIAS)
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff) {
      const all = window.BDS_BANCO_CURADO || [];
      let pool;
      if (!area || area === "ALL") {
        pool = all.filter(x => !diff || diff === "ALL" || x.d === diff);
      } else {
        // BARRERA ESTRICTA: SOLO ítems cuyo campo 'a' sea EXACTAMENTE el área solicitada
        const soloArea = all.filter(x => x.a === area);
        pool = soloArea.filter(x => !diff || diff === "ALL" || x.d === diff);
        if (!pool.length) pool = soloArea; // Si esa dificultad no tiene suficientes, usa OTRA dificultad de LA MISMA área (NUNCA otra materia)
      }

      // Barajado real Fisher-Yates de preguntas y opciones
      const arr = pool.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      const qty = Math.min(Number(cantidad) || 20, arr.length);
      return arr.slice(0, qty).map(it => {
        const opts = (it.o || []).map((txt, idx) => ({ txt, ok: idx === (it.c || 0) }));
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return { ...it, opts };
      });
    };

    window.__BDS_BANCO_STATS = { beforeTotal, beforeByArea, afterTotal: nuevoBanco.length, afterByArea, afterByDiff, moptTotal: window.BDS_BANCO_MOPT.length };
    window.__BDS_BANCO_V188_OK = true;
    return window.__BDS_BANCO_STATS;
  }

  // Modal Generador de Preguntas con IA (strictly tagged to chosen specialty)
  window.BDS_OPEN_AI_ITEMS = function () {
    expandirBancoEstrictoX10();
    const old = document.getElementById("bds-ai-items-modal"); if (old) old.remove();
    const malla = window.BDS_MALLA_MEP || [];
    const st = window.__BDS_BANCO_STATS;
    let generadas = [];

    const modal = document.createElement("div");
    modal.id = "bds-ai-items-modal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.9);z-index:295000;display:flex;align-items:flex-start;justify-content:center;padding:16px 10px;overflow-y:auto;";

    function draw() {
      modal.innerHTML = `
        <div class="bds-card" style="max-width:860px;width:100%;padding:20px;border-color:#38bdf8;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">AISLAMIENTO 100% PURO • ${st.afterTotal.toLocaleString("es-CR")} ÍTEMS</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🤖 Generador de Preguntas IA & Auditoría del Banco</h2>
            </div>
            <button id="aiq-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Total Banco Puro</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">${st.afterTotal.toLocaleString("es-CR")}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Básico</div><div style="font-size:18px;font-weight:900;color:#34d399;">${st.afterByDiff["Básico"]}</div></div>
            <div style="background:#070d19;border:1px solid #f59e0b;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Medio / Interm.</div><div style="font-size:18px;font-weight:900;color:#fbbf24;">${st.afterByDiff["Medio"] + st.afterByDiff["Intermedio"]}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Avanzado</div><div style="font-size:18px;font-weight:900;color:#c084fc;">${st.afterByDiff["Avanzado"]}</div></div>
          </div>
          <form id="aiq-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px;">
            <select id="aiq-area" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              ${malla.map(m => `<option value="${m.id}">${m.name} (${st.afterByArea[m.id] || 0})</option>`).join("")}
            </select>
            <input id="aiq-tema" type="text" placeholder="Tema exacto de esa materia..." required style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
            <select id="aiq-qty" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              <option value="10" selected>10 preguntas</option>
              <option value="20">20 preguntas</option>
            </select>
            <button type="submit" style="background:#7c3aed;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">⚡ Generar con IA</button>
          </form>
          ${generadas.length ? `<div style="max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:7px;">${generadas.map((g, i) => `<div style="background:#070d19;border:1px solid #1e293b;border-radius:8px;padding:9px;font-size:12px;"><b>${i+1}. [${g.d}] ${g.q}</b><div style="color:#34d399;">✓ ${g.o[0]}</div></div>`).join("")}</div>` : ""}
        </div>
      `;
      document.getElementById("aiq-cls").onclick = () => modal.remove();
      document.getElementById("aiq-f").onsubmit = (e) => {
        e.preventDefault();
        const area = document.getElementById("aiq-area").value;
        const tema = document.getElementById("aiq-tema").value.trim();
        const qty = Number(document.getElementById("aiq-qty").value || 10);
        const mat = malla.find(m => m.id === area) || { name: "MEP" };
        generadas = [];
        for (let i = 0; i < qty; i++) {
          const item = {
            a: area, d: DIFFS[i % 4],
            q: `(${mat.name} — ${tema}) Caso #${i+1}: ¿cuál procedimiento aplica correctamente "${tema}" según los criterios de ${mat.name}?`,
            o: [`Ejecutar y verificar "${tema}" cumpliendo los estándares técnicos de ${mat.name}`, `Omitir la validación de "${tema}"`, `Aplicar parámetros ajenos a ${mat.name}`, `Descartar la documentación de evidencia`],
            c: 0, g: `Relaciona "${tema}" directamente con ${mat.name}.`, e: `Dominar "${tema}" exige aplicación precisa dentro de ${mat.name}.`
          };
          generadas.push(item);
          window.BDS_BANCO_CURADO.unshift(item);
        }
        st.afterTotal = window.BDS_BANCO_CURADO.length;
        draw();
      };
    }
    document.body.appendChild(modal); draw();
  };

  window.BDS_EXPANDIR_BANCO_X10 = expandirBancoEstrictoX10;
  expandirBancoEstrictoX10();
})();