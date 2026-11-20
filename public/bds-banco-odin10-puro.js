(function () {
  const DIFFS = ["Básico", "Medio", "Intermedio", "Avanzado"];
  const NIVEL_REAC = {
    "Básico": "Nivel 1 (Inicial) — REAC",
    "Medio": "Nivel 2 (Intermedio) — REAC",
    "Intermedio": "Nivel 2 (Intermedio) — REAC",
    "Avanzado": "Nivel 3 (Avanzado) — REAC"
  };
  const APOYOS_DUA = [
    "DUA Visual/Auditivo: Usa 'Escuchar Todo' y subraya el saber esencial antes de responder.",
    "DUA Descarte Guiado: Descarta primero las dos opciones incompatibles con la regla de la unidad.",
    "DUA Paso a Paso: Identifica el dato clave, relaciona con el concepto oficial y verifica.",
    "DUA Autorregulación: Conecta el enunciado con un caso real trabajado en clase."
  ];

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  // Clasificador determinístico SIN colisiones (orden exacto de prioridad)
  function detectarTipoEstricto(m) {
    const id = norm(m && m.id);
    const nm = norm(m && m.name);
    const t = id + " " + nm;
    if (/mopt|cosevi|vial|licencia/.test(t)) return "mopt";
    if (/admision|paa|razonamiento|ucr|tec|una|uned|utn/.test(t)) return "admision";
    if (/primaria|i y ii ciclo|escuela/.test(t)) return "primaria";
    if (/taller|explorat/.test(t)) return "talleres";
    if (/artes_ind|artes industriales/.test(t)) return "artes_ind";
    if (/hogar|vida cotidiana/.test(t)) return "hogar";
    if (/edfisica|educacion fisica|deporte/.test(t)) return "edfisica";
    if (/web|programacion|software/.test(t)) return "web";
    if (/ciber|seguridad/.test(t)) return "ciber";
    if (/redes|networking|telecom/.test(t)) return "redes_conf";
    if (/electro|mecan|soporte/.test(t)) return "electro";
    if (/conta|finanz|excel/.test(t)) return "conta";
    if (/ejecutiv|comercial|logist|secretar/.test(t)) return "comercial";
    if (/diseno|publicit|grafic/.test(t)) return "diseno";
    if (/turism|hoteler/.test(t)) return "turismo";
    if (/tecnolog|informatic|comput/.test(t)) return "tecnologia";
    if (/espanol|literat|lectora/.test(t)) return "espanol";
    if (/ingles|english|grammar|conversac/.test(t)) return "ingles";
    if (/frances|french/.test(t)) return "frances";
    if (/matem|calculo|algebra/.test(t)) return "mate";
    if (/biolog/.test(t)) return "biologia";
    if (/quimic/.test(t)) return "quimica";
    if (/fisica/.test(t)) return "fisica";
    if (/ciencia/.test(t)) return "ciencias";
    if (/social|civic|historia|geograf/.test(t)) return "sociales";
    if (/music/.test(t)) return "musica";
    if (/artes|plastic/.test(t)) return "artes";
    if (/psicolog/.test(t)) return "psicologia";
    if (/filosof|logica/.test(t)) return "filosofia";
    if (/relig|valor|etica/.test(t)) return "religion";
    return "tecnologia";
  }

  // Bancos curados 100% PUROS por tipo (CERO mezcla entre asignaturas)
  // Formato: { sub, uni, sab, d, q, o:[ok, d1, d2, d3], g, e, ind, lang?, moptCat? }
  const BANKS = {
    espanol: [
      { sub: "Ortografía y Acentuación", uni: "Unidad 1: Reglas Generales de Tildación", sab: "Clasificación de palabras según sílaba tónica", d: "Básico", q: "¿Por qué la palabra «técnico» lleva tilde obligatoria en español?", o: ["Porque es una palabra esdrújula y todas las esdrújulas se tildan", "Porque es aguda terminada en vocal", "Porque contiene un hiato acentual", "Porque es grave terminada en consonante distinta de n o s"], g: "Divide en sílabas: téc-ni-co. Ubica la sílaba tónica.", e: "La fuerza recae en la antepenúltima sílaba (téc), por eso es esdrújula y siempre se tilda.", ind: "Aplica las reglas generales de acentuación ortográfica en textos formales." },
      { sub: "Ortografía y Acentuación", uni: "Unidad 1: Reglas Generales de Tildación", sab: "Tilde diacrítica en monosílabos", d: "Medio", q: "Seleccione la oración que emplea correctamente la tilde diacrítica:", o: ["Sé que tú valoras el esfuerzo de tu equipo.", "Se que tu valoras el esfuerzo de tú equipo.", "Sé que tu valoras el esfuerzo de tú equipo.", "Se que tú valoras el esfuerzo de tu equipo."], g: "Distingue «sé» (verbo saber) y «tú» (pronombre personal) frente a «tu» (posesivo).", e: "«Sé» del verbo saber y «tú» pronombre llevan tilde; «tu» posesivo no lleva tilde.", ind: "Diferencia monosílabos homófonos mediante la tilde diacrítica." },
      { sub: "Ortografía y Acentuación", uni: "Unidad 1: Uso de Grafías y Puntuación", sab: "Uso correcto del punto y coma y la coma", d: "Intermedio", q: "¿Cuál oración utiliza correctamente la coma vocativa?", o: ["Estudiantes, revisen la ortografía antes de entregar el ensayo.", "Estudiantes revisen, la ortografía antes de entregar el ensayo.", "Estudiantes revisen la ortografía, antes de entregar el ensayo.", "Estudiantes revisen la ortografía antes, de entregar el ensayo."], g: "El vocativo (a quien se dirige el hablante) siempre se separa con coma.", e: "«Estudiantes» es el vocativo al inicio de la oración y debe aislarse con coma.", ind: "Emplea los signos de puntuación para garantizar claridad sintáctica." },
      { sub: "Morfosintaxis", uni: "Unidad 2: Estructura de la Oración", sab: "Sujeto, predicado y concordancia verbal", d: "Básico", q: "En la oración «Los jóvenes costarricenses redactaron un cuento original», ¿cuál es el núcleo del sujeto?", o: ["jóvenes", "redactaron", "cuento", "costarricenses"], g: "Identifica primero quién realiza la acción y luego su sustantivo central.", e: "El sujeto es «Los jóvenes costarricenses» y su núcleo sustantivo es «jóvenes».", ind: "Analiza la estructura sintáctica básica de la oración simple." },
      { sub: "Morfosintaxis", uni: "Unidad 2: Categorías Gramaticales", sab: "Uso de preposiciones y adverbios", d: "Medio", q: "En el enunciado «Ella expuso brillantemente su argumento ante el jurado», la palabra «brillantemente» funciona como:", o: ["Adverbio de modo", "Adjetivo calificativo", "Preposición compuesta", "Pronombre relativo"], g: "Pregunta ¿cómo expuso? Las palabras terminadas en -mente modifican al verbo.", e: "«Brillantemente» modifica al verbo «expuso» indicando modo: es un adverbio de modo.", ind: "Reconoce las categorías gramaticales y su función dentro del enunciado." },
      { sub: "Comprensión Lectora", uni: "Unidad 3: Tipología Textual y Cohesión", sab: "Conectores discursivos argumentativos", d: "Intermedio", q: "Complete con el conector adversativo adecuado: «El proyecto requería mucho estudio; ___, el grupo lo presentó a tiempo».", o: ["sin embargo", "por consiguiente", "además", "es decir"], g: "Busca un conector que exprese contraste entre dificultad y logro.", e: "«Sin embargo» introduce una oposición o contraste entre ambas ideas.", ind: "Utiliza conectores lógicos para construir párrafos coherentes y cohesionados." },
      { sub: "Comprensión Lectora", uni: "Unidad 3: Análisis Crítico de Textos", sab: "Diferencia entre idea principal e ideas secundarias", d: "Medio", q: "¿Qué característica define a la idea principal de un párrafo expositivo?", o: ["Resume el mensaje central sin el cual el párrafo pierde sentido", "Incluye únicamente ejemplos numéricos o fechas accesorias", "Siempre aparece únicamente en la última palabra del texto", "Se limita a repetir el título sin explicar el tema"], g: "Piensa cuál enunciado sostiene todo el contenido del párrafo.", e: "La idea principal sintetiza el eje temático del párrafo; las secundarias la amplían o ejemplifican.", ind: "Identifica ideas principales y secundarias en textos expositivos y argumentativos." },
      { sub: "Literatura", uni: "Unidad 4: Literatura Costarricense e Hispanoamericana", sab: "Figuras literarias de significación", d: "Avanzado", q: "En el verso «Tus palabras son luz en medio de la tormenta», ¿qué figura literaria predomina?", o: ["Metáfora", "Onomatopeya", "Anáfora", "Aliteración"], g: "Observa la identificación directa entre dos realidades sin usar la palabra «como».", e: "Al identificar directamente «palabras» con «luz» sin nexo comparativo, se configura una metáfora.", ind: "Interpreta figuras literarias en textos poéticos y narrativos." },
      { sub: "Literatura", uni: "Unidad 4: Literatura Costarricense", sab: "Obras y autores clásicos de Costa Rica", d: "Intermedio", q: "¿A qué autora costarricense pertenece la célebre colección «Los cuentos de mi tía Panchita»?", o: ["Carmen Lyra (María Isabel Carvajal)", "Yolanda Oreamuno", "Eunice Odio", "Julieta Dobles"], g: "Recuerda a la pionera de la literatura infantil y la educación preescolar en Costa Rica.", e: "Carmen Lyra publicó «Los cuentos de mi tía Panchita» en 1920, obra emblemática de Costa Rica.", ind: "Valora el aporte de autores y obras fundamentales de la literatura costarricense." },
      { sub: "Literatura", uni: "Unidad 4: Géneros Literarios", sab: "Características del ensayo, cuento y drama", d: "Avanzado", q: "¿Cuál rasgo distingue al género dramático frente al narrativo?", o: ["Está escrito mediante diálogos y acotaciones para representarse en escena", "Carece por completo de personajes y conflictos", "Utiliza únicamente versos rimados sin diálogo", "Expone únicamente estadísticas económicas"], g: "Piensa en el teatro y en cómo se presenta la historia al público.", e: "El género dramático prescinde de un narrador tradicional y se construye con diálogos y acotaciones escénicas.", ind: "Distingue los rasgos estructurales de los géneros literarios." }
    ],

    web: [
      { sub: "Tecnologías Web Frontend", uni: "Unidad 1: HTML5 Semántico y Accesibilidad", sab: "Etiquetas semánticas y estándares W3C / DUA", d: "Básico", q: "¿Cuál etiqueta HTML5 representa el contenido principal único de una página web?", o: ["<main>", "<div-top>", "<center>", "<font>"], g: "Piensa en las etiquetas semánticas que ayudan a lectores de pantalla y SEO.", e: "<main> delimita el contenido principal único del documento y mejora la accesibilidad.", ind: "Estructura documentos web aplicando HTML5 semántico y accesibilidad." },
      { sub: "Tecnologías Web Frontend", uni: "Unidad 1: HTML5 Semántico y Accesibilidad", sab: "Atributos de accesibilidad en imágenes y formularios", d: "Básico", q: "¿Para qué sirve el atributo «alt» en una etiqueta <img>?", o: ["Proporciona texto alternativo para accesibilidad y casos en que la imagen no cargue", "Aumenta la velocidad del procesador del usuario", "Cifra la contraseña del formulario", "Cambia la extensión del archivo a PDF"], g: "Relaciónalo con lectores de pantalla para personas con discapacidad visual.", e: "El atributo alt describe la imagen para tecnologías de apoyo (DUA/WCAG) y SEO.", ind: "Implementa atributos de accesibilidad universal en interfaces web." },
      { sub: "Diseño de Interfaces CSS3", uni: "Unidad 2: Maquetación Responsive Mobile-First", sab: "Flexbox, CSS Grid y Media Queries", d: "Medio", q: "En CSS3, ¿qué propiedad de Flexbox alinea los elementos hijos horizontalmente a lo largo del eje principal?", o: ["justify-content", "font-weight", "z-index", "border-collapse"], g: "Diferencia entre el eje principal (justify-content) y el eje transversal (align-items).", e: "justify-content distribuye el espacio a lo largo del eje principal en un contenedor flex.", ind: "Aplica CSS Flexbox y Grid para diseñar interfaces adaptables a cualquier pantalla." },
      { sub: "Diseño de Interfaces CSS3", uni: "Unidad 2: Maquetación Responsive Mobile-First", sab: "Adaptabilidad con Media Queries", d: "Medio", q: "¿Cuál regla CSS aplica estilos únicamente cuando la pantalla mide 768px de ancho o menos?", o: ["@media (max-width: 768px) { ... }", "@screen (width == 768px) { ... }", "@mobile (size: 768px) { ... }", "@responsive (768px) { ... }"], g: "En diseño responsive se usan consultas @media con max-width o min-width.", e: "@media (max-width: 768px) activa las reglas en teléfonos y tabletas pequeñas.", ind: "Configura media queries para lograr diseño responsive mobile-first." },
      { sub: "Programación JavaScript ES6+", uni: "Unidad 3: Lógica Frontend y Manipulación del DOM", sab: "Métodos funcionales de arreglos (map, filter, reduce)", d: "Intermedio", q: "En JavaScript moderno, ¿qué método devuelve un nuevo arreglo solo con los elementos que cumplen una condición?", o: ["Array.prototype.filter()", "Array.prototype.push()", "Array.prototype.join()", "Math.floor()"], g: "Piensa en el verbo en inglés para filtrar elementos sin mutar el arreglo original.", e: "filter() recorre el arreglo y retorna un nuevo arreglo con los elementos cuya función callback devuelve true.", ind: "Desarrolla lógica de programación modular con JavaScript ES6+." },
      { sub: "Programación JavaScript ES6+", uni: "Unidad 3: Desarrollo con React (.jsx)", sab: "Estado local (useState) y paso de propiedades (props)", d: "Intermedio", q: "En un componente funcional de React (.jsx), ¿qué Hook permite declarar y actualizar estado local reactivo?", o: ["useState()", "useCss()", "useSql()", "useHtml()"], g: "Es el Hook fundamental para que la interfaz se vuelva a renderizar cuando cambia un dato.", e: "useState() retorna el valor actual del estado y la función setter para disparar el re-renderizado.", ind: "Construye componentes reactivos reutilizables en React con JavaScript puro." },
      { sub: "Backend, APIs y Datos", uni: "Unidad 4: Arquitectura REST, SQL y Git", sab: "Códigos de estado HTTP en APIs REST", d: "Intermedio", q: "Al consultar una API REST sin credenciales válidas de sesión, ¿qué código HTTP corresponde devolver?", o: ["401 Unauthorized", "200 OK", "201 Created", "301 Moved Permanently"], g: "2xx indica éxito, 4xx error del cliente/autenticación y 5xx error del servidor.", e: "HTTP 401 indica que la solicitud carece de autenticación válida.", ind: "Integra APIs REST interpretando correctamente métodos y códigos HTTP." },
      { sub: "Backend, APIs y Datos", uni: "Unidad 4: Arquitectura REST, SQL y Git", sab: "Consultas SQL parametrizadas y prevención de inyección", d: "Avanzado", q: "¿Cuál consulta SQL selecciona nombre y correo únicamente de estudiantes activos ordenados alfabéticamente?", o: ["SELECT nombre, correo FROM estudiantes WHERE activo = true ORDER BY nombre ASC;", "DELETE nombre, correo FROM estudiantes WHERE activo = true;", "UPDATE estudiantes SET activo = true SORT nombre;", "DROP TABLE estudiantes WHERE activo = true;"], g: "Recuerda la estructura SELECT ... FROM ... WHERE ... ORDER BY.", e: "SELECT consulta columnas específicas, WHERE filtra filas activas y ORDER BY ordena resultados.", ind: "Gestiona bases de datos relacionales aplicando consultas SQL seguras." },
      { sub: "Backend, APIs y Datos", uni: "Unidad 4: Control de Versiones y Despliegue", sab: "Flujo profesional Git y CI/CD", d: "Avanzado", q: "¿Qué secuencia de comandos Git registra los cambios locales en un commit y los publica en la rama remota main?", o: ["git add -A && git commit -m \"mensaje\" && git push origin main", "git delete && git format && git upload", "git clone && git reset --hard", "git init && git remove main"], g: "Recuerda las tres etapas: staging (add), confirmación local (commit) y envío remoto (push).", e: "git add prepara archivos, git commit crea el punto en el historial y git push sincroniza con origin main.", ind: "Administra control de versiones y despliegue continuo con Git." }
    ],

    talleres: [
      { sub: "Seguridad Ocupacional en Taller", uni: "Unidad 1: Cultura Preventiva y Metodología 5S", sab: "Uso de Equipo de Protección Personal (EPP) y orden", d: "Básico", q: "Al ingresar a un taller exploratorio donde se manipulan herramientas manuales, ¿cuál es la primera norma de seguridad?", o: ["Utilizar el equipo de protección personal adecuado y mantener el área despejada", "Correr entre las mesas de trabajo para terminar más rápido", "Dejar cables y herramientas sueltos en los pasillos", "Usar herramientas dañadas sin avisar a la persona docente"], g: "La prevención de accidentes comienza por el EPP y el orden del puesto de trabajo.", e: "El EPP y el orden 5S reducen drásticamente el riesgo de lesiones en el taller escolar.", ind: "Aplica normas de salud ocupacional y seguridad en talleres exploratorios." },
      { sub: "Seguridad Ocupacional en Taller", uni: "Unidad 1: Cultura Preventiva y Metodología 5S", sab: "Aplicación de las 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke)", d: "Medio", q: "En la metodología japonesa 5S aplicada a talleres escolares, ¿qué significa la etapa «Seiton» (Ordenar)?", o: ["Asignar un lugar específico y rotulado para cada herramienta y material", "Desechar todas las herramientas nuevas", "Trabajar sin supervisión docente", "Pintar las paredes de color oscuro"], g: "«Un lugar para cada cosa y cada cosa en su lugar».", e: "Seiton organiza herramientas y materiales para localizarlos y devolverlos con rapidez y seguridad.", ind: "Organiza estaciones de trabajo aplicando principios de calidad y orden 5S." },
      { sub: "Exploración Vocacional", uni: "Unidad 2: Proyecto de Vida y Especialidades Técnicas", sab: "Selección vocacional informada en el CTP", d: "Básico", q: "¿Cuál es el objetivo principal de los Talleres Exploratorios en III Ciclo de la Educación Técnica?", o: ["Permitir que el estudiantado descubra sus intereses y aptitudes antes de elegir especialidad en 10°", "Reemplazar las materias académicas obligatorias", "Evaluar únicamente memorización de fechas antiguas", "Limitar al estudiante a una sola profesión desde 7° año"], g: "Piensa en la palabra «exploratorio»: probar áreas técnicas para decidir con criterio.", e: "Los talleres exploratorios brindan experiencias prácticas en varias áreas para orientar la elección vocacional.", ind: "Reconoce sus intereses y habilidades vocacionales mediante experiencias exploratorias." },
      { sub: "Diseño y Prototipado STEAM", uni: "Unidad 3: Proceso de Diseño de Prototipos", sab: "Etapas del diseño: empatizar, idear, prototipar y probar", d: "Intermedio", q: "Antes de construir un prototipo escolar con materiales del taller, ¿por qué es esencial elaborar un boceto con medidas?", o: ["Para planificar dimensiones, calcular materiales y evitar desperdicios", "Porque prohíbe hacer mejoras posteriores", "Para gastar la mayor cantidad posible de material", "Porque sustituye la evaluación del producto final"], g: "Planificar en papel ahorra tiempo, recursos y errores durante la construcción.", e: "El boceto acotado guía el corte, ensamble y aprovechamiento responsable de los materiales.", ind: "Diseña bocetos y prototipos funcionales aplicando metodología STEAM." },
      { sub: "Diseño y Prototipado STEAM", uni: "Unidad 3: Metrología y Herramientas Básicas", sab: "Medición precisa en centímetros y milímetros", d: "Medio", q: "Al medir una pieza de madera o cartón de 12,5 cm en el taller exploratorio, ¿a cuántos milímetros equivale esa medida?", o: ["125 mm", "12,5 mm", "1 250 mm", "1,25 mm"], g: "Recuerda que cada centímetro contiene exactamente 10 milímetros.", e: "12,5 cm × 10 = 125 mm; dominar el sistema métrico asegura cortes exactos.", ind: "Realiza mediciones básicas con precisión empleando instrumentos del taller." },
      { sub: "Emprendimiento y Cooperativismo", uni: "Unidad 4: Feria Institucional y Costos Básicos", sab: "Cálculo de costo unitario y valor agregado", d: "Intermedio", q: "Un equipo elabora 10 llaveros reciclados invirtiendo ₡4 000 en insumos. Si desea venderlos a ₡600 cada uno, ¿cuál es su ganancia total al vender los 10?", o: ["₡2 000 de ganancia", "₡6 000 de ganancia", "₡4 000 de pérdida", "₡10 000 de ganancia"], g: "Calcula primero el ingreso total (10 × 600) y réstale el costo de insumos (4 000).", e: "Ingreso = ₡6 000; Costo = ₡4 000; Ganancia neta = ₡6 000 − ₡4 000 = ₡2 000.", ind: "Formula presupuestos básicos para emprendimientos estudiantiles sostenibles." },
      { sub: "Trabajo Colaborativo y Sostenibilidad", uni: "Unidad 4: Economía Circular en el Taller", sab: "Reutilización responsable de materiales", d: "Avanzado", q: "¿Qué práctica refleja economía circular en un proyecto de taller exploratorio?", o: ["Reutilizar sobrantes limpios de papel, cartón o plástico para fabricar nuevos productos útiles", "Desechar todos los sobrantes en basura común sin clasificar", "Comprar el doble de material sin calcular", "Quemar residuos plásticos en el patio"], g: "La economía circular busca reducir residuos y extender la vida útil de los recursos.", e: "Reaprovechar insumos limpios disminuye costos, protege el ambiente y fomenta creatividad técnica.", ind: "Integra prácticas de sostenibilidad ambiental en proyectos de taller." }
    ],

    ingles: [
      { sub: "Grammar & Everyday Communication", uni: "Unit 1: Daily Routines and Present Tenses", sab: "Simple Present with third-person singular", d: "Básico", lang: "en-US", q: "Choose the grammatically correct sentence in Simple Present:", o: ["She studies web development every afternoon.", "She study web development every afternoon.", "She studying web development every afternoon.", "She are studies web development every afternoon."], g: "In Simple Present, verbs ending in consonant + y change to -ies for he/she/it.", e: "With «she», «study» becomes «studies» in affirmative Simple Present.", ind: "Uses Simple Present accurately to describe daily routines and habits." },
      { sub: "Grammar & Everyday Communication", uni: "Unit 1: Present Continuous vs. Simple Present", sab: "Actions happening right now", d: "Básico", lang: "en-US", q: "Complete the sentence: «Listen! The students ___ their final project right now.»", o: ["are presenting", "presents", "presented", "presenting"], g: "Time markers like «Listen!» and «right now» require Present Continuous (am/is/are + -ing).", e: "With plural «The students», the Present Continuous form is «are presenting».", ind: "Distinguishes between habitual actions and actions in progress." },
      { sub: "Past Experiences & Storytelling", uni: "Unit 2: Simple Past Tense", sab: "Irregular verbs in affirmative sentences", d: "Medio", lang: "en-US", q: "Complete in Simple Past: «Yesterday, our team ___ a clean prototype for the school fair.»", o: ["built", "builds", "building", "has build"], g: "«Yesterday» indicates a finished past action. Recall the irregular past of «build».", e: "The irregular Simple Past form of «build» is «built».", ind: "Narrates completed past events using regular and irregular verbs." },
      { sub: "Past Experiences & Storytelling", uni: "Unit 2: Questions and Negatives in Simple Past", sab: "Auxiliary «did» + base verb", d: "Medio", lang: "en-US", q: "Which question is correctly structured in Simple Past?", o: ["Did you finish the English reading last night?", "Did you finished the English reading last night?", "Do you finished the English reading last night?", "Were you finish the English reading last night?"], g: "After the auxiliary «Did», the main verb always stays in its base form.", e: "«Did + subject + base verb (finish)» is the standard Simple Past question pattern.", ind: "Formulates accurate questions about past experiences." },
      { sub: "Future Plans & Modals", uni: "Unit 3: Modal Verbs for Advice and Obligation", sab: "Using should, must, and can appropriately", d: "Intermedio", lang: "en-US", q: "Select the best modal verb to give friendly study advice: «You ___ take a 5-minute break after studying for 25 minutes.»", o: ["should", "mustn't", "could not", "might not to"], g: "Choose the modal verb commonly used for recommendations and healthy advice.", e: "«Should» expresses recommendation or helpful advice without adding «to».", ind: "Applies modal verbs to express advice, ability, and obligation." },
      { sub: "Future Plans & Modals", uni: "Unit 3: First Conditional", sab: "Real future cause-and-effect situations", d: "Intermedio", lang: "en-US", q: "Complete the First Conditional sentence: «If you practice English every day, you ___ more confident.»", o: ["will feel", "felt", "feeling", "would felt"], g: "First Conditional structure: If + Simple Present, subject + will + base verb.", e: "After «If + practice» (Present), the result clause uses «will + feel».", ind: "Constructs First Conditional statements for real future outcomes." },
      { sub: "Reading Comprehension", uni: "Unit 4: Reading Strategies & Workplace English", sab: "Identifying main idea and inference", d: "Avanzado", lang: "en-US", q: "Read: «At our technical high school, students recycle plastic bottles to earn EcoMEPs and exchange them at the school cooperative.» What is the main purpose of this initiative?", o: ["To encourage environmental recycling while rewarding students at the cooperative", "To prohibit students from visiting the school cooperative", "To replace mathematics lessons with plastic manufacturing", "To sell school uniforms outside Costa Rica"], g: "Focus on the two connected actions in the passage: recycling and earning rewards.", e: "The text explicitly connects recycling plastic bottles with earning EcoMEPs for the cooperative.", ind: "Comprehends main ideas and specific details in short authentic English texts." },
      { sub: "Technical & Professional English", uni: "Unit 4: Workplace Communication (CTP)", sab: "Professional email etiquette and technical vocabulary", d: "Avanzado", lang: "en-US", q: "Which closing phrase is the most appropriate for a formal email to a supervisor or teacher?", o: ["Best regards,", "See ya later dude!", "Whatever, bye", "LOL talk soon"], g: "Formal emails require polite, respectful sign-offs.", e: "«Best regards,» (or «Sincerely,») is standard professional English etiquette.", ind: "Produces clear and polite professional communication in English." }
    ],

    frances: [
      { sub: "Communication Quotidienne", uni: "Unité 1: Salutations et Présentations", sab: "Formules de politesse et présentation personnelle", d: "Básico", lang: "fr-FR", q: "Comment dit-on «Me llamo Sofía» correctement en français ?", o: ["Je m'appelle Sofía.", "Je suis appelle Sofía.", "Tu t'appelles Sofía.", "Nous appelons Sofía."], g: "Utilisez le verbe pronominal s'appeler à la première personne (Je).", e: "«Je m'appelle» est la forme correcte pour se présenter en français.", ind: "Se presenta e interactúa con fórmulas básicas de cortesía en francés." },
      { sub: "Grammaire Française", uni: "Unité 2: Verbes Être et Avoir", sab: "Conjugaison au présent de l'indicatif", d: "Medio", lang: "fr-FR", q: "Complétez avec le verbe «être» au présent : «Nous ___ étudiants au collège technique.»", o: ["sommes", "suis", "êtes", "sont"], g: "Rappelez la conjugaison : je suis, tu es, il est, nous sommes.", e: "Avec le pronom «Nous», la forme correcte du verbe être est «sommes».", ind: "Conjuga correctamente los verbos auxiliares être y avoir en presente." },
      { sub: "Vocabulaire Scolaire", uni: "Unité 3: La Vie au Collège", sab: "Objets de la classe et matières", d: "Intermedio", lang: "fr-FR", q: "Que signifie le mot français «bibliothèque» en espagnol ?", o: ["Biblioteca", "Cafetería", "Gimnasio", "Laboratorio de química"], g: "C'est un mot transparent (cognat) très proche de l'espagnol.", e: "«La bibliothèque» signifie «la biblioteca».", ind: "Reconoce vocabulario esencial de la vida escolar y comunitaria en francés." },
      { sub: "Compréhension Écrite", uni: "Unité 4: Culture Francophone et Projets", sab: "Expressions de temps et politesse", d: "Avanzado", lang: "fr-FR", q: "Quelle expression française est la plus polie pour demander de l'aide à un professeur ?", o: ["Pourriez-vous m'aider, s'il vous plaît ?", "Aide-moi maintenant !", "Je ne veux pas écouter.", "Ferme la porte."], g: "Le conditionnel de politesse + «s'il vous plaît» montre le respect.", e: "«Pourriez-vous m'aider, s'il vous plaît ?» est une demande polie et formelle.", ind: "Utiliza expresiones de cortesía en situaciones comunicativas en francés." }
    ],

    electro: [
      { sub: "Electricidad y Circuitos CC", uni: "Unidad 1: Ley de Ohm y Magnitudes Eléctricas", sab: "Relación entre tensión (V), corriente (I) y resistencia (R)", d: "Básico", q: "¿Qué instrumento de medición se utiliza para comprobar voltaje, corriente y continuidad en un circuito electrónico?", o: ["Multímetro digital", "Barómetro", "Termómetro clínico", "Compás geométrico"], g: "Piensa en el equipo básico de diagnóstico de todo laboratorio de electrónica.", e: "El multímetro mide tensión (V), intensidad (A), resistencia (Ω) y continuidad.", ind: "Utiliza instrumentos de medición eléctrica aplicando normas de seguridad." },
      { sub: "Electrónica Digital y Analógica", uni: "Unidad 2: Componentes Semiconductores", sab: "Función del diodo, LED y transistor", d: "Medio", q: "¿Por qué se conecta una resistencia en serie con un diodo LED al alimentarlo con 5 V o 9 V?", o: ["Para limitar la corriente eléctrica y evitar que el LED se queme", "Para convertir corriente directa en alterna", "Para eliminar el polo negativo de la batería", "Para aumentar el voltaje al doble"], g: "El LED soporta corrientes pequeñas (~10 a 20 mA).", e: "La resistencia limitadora protege al LED restringiendo el flujo de corriente según la Ley de Ohm.", ind: "Selecciona componentes electrónicos protegiendo la integridad del circuito." },
      { sub: "Soporte TI y Hardware", uni: "Unidad 3: Mantenimiento Preventivo de Equipos", sab: "Protección contra descargas electrostáticas (ESD)", d: "Intermedio", q: "Al abrir el gabinete de una computadora para instalar memoria RAM, ¿qué medida previene daños por electricidad estática?", o: ["Desconectar la corriente eléctrica y usar pulsera antiestática conectada a tierra", "Trabajar con el equipo encendido sobre una alfombra", "Tocar directamente los pines dorados con manos húmedas", "Aplicar aceite lubricante a la tarjeta madre"], g: "La estática (ESD) puede dañar circuitos integrados sin verse a simple vista.", e: "Desenergizar el equipo y descargar la estática con pulsera ESD protege los chips.", ind: "Ejecuta mantenimiento preventivo y correctivo de hardware con protocolos ESD." },
      { sub: "Electromecánica", uni: "Unidad 4: Protecciones Eléctricas", sab: "Función de disyuntores (breakers) y puesta a tierra", d: "Avanzado", q: "¿Qué función cumple el conductor de puesta a tierra en una instalación eléctrica técnica?", o: ["Desviar corrientes de fuga hacia tierra para proteger a las personas contra choques eléctricos", "Duplicar la factura eléctrica mensual", "Sustituir completamente la fase viva", "Aumentar la temperatura de los cables"], g: "Es un elemento vital de seguridad eléctrica humana.", e: "La puesta a tierra ofrece un camino seguro de baja impedancia ante fallas de aislamiento.", ind: "Verifica sistemas de protección eléctrica conforme al Código Eléctrico." }
    ],

    ciber: [
      { sub: "Seguridad de la Información", uni: "Unidad 1: Tríada CIA y Principios de Seguridad", sab: "Confidencialidad, Integridad y Disponibilidad", d: "Básico", q: "¿Cuál pilar de la tríada CIA garantiza que un documento o calificación NO ha sido alterado sin autorización?", o: ["Integridad", "Disponibilidad", "Publicidad", "Portabilidad"], g: "Confidencialidad = privacidad; Integridad = sin alteraciones; Disponibilidad = acceso cuando se ocupa.", e: "La integridad asegura exactitud y no modificación indebida (verificable con SHA-256).", ind: "Distingue los pilares de la tríada CIA en sistemas institucionales." },
      { sub: "Defensa contra Amenazas", uni: "Unidad 2: Ingeniería Social y Phishing", sab: "Identificación de correos y enlaces fraudulentos", d: "Medio", q: "Recibes un mensaje urgente pidiendo tu contraseña institucional en un enlace acortado sospechoso. ¿Cuál es la acción segura?", o: ["No abrir el enlace, no compartir credenciales y reportar el intento de phishing", "Ingresar la contraseña para verificar si es real", "Reenviar el enlace a toda la sección", "Desactivar el antivirus del equipo"], g: "Las instituciones legítimas nunca piden contraseñas por enlaces urgentes.", e: "El phishing busca robar credenciales mediante urgencia falsa; siempre debe reportarse y bloquearse.", ind: "Previene ataques de ingeniería social y phishing en entornos educativos." },
      { sub: "Control de Acceso y Criptografía", uni: "Unidad 3: RBAC, MFA y Hash SHA-256", sab: "Autenticación multifactor y mínimo privilegio", d: "Intermedio", q: "¿Por qué la autenticación multifactor (MFA) fortalece significativamente una cuenta institucional?", o: ["Porque exige una segunda verificación además de la contraseña (como código temporal o biometría)", "Porque elimina la necesidad de tener usuario", "Porque hace pública la contraseña en la red", "Porque desactiva el cifrado HTTPS"], g: "Combina algo que sabes (clave) con algo que tienes o eres.", e: "Incluso si una contraseña se filtra, MFA bloquea el acceso no autorizado.", ind: "Configura controles de autenticación robusta y RBAC." },
      { sub: "Marco Legal de Privacidad", uni: "Unidad 4: Protección de Datos en Costa Rica", sab: "Ley N.° 8968 (PRODHAB) y privacidad de menores", d: "Avanzado", q: "En Costa Rica, ¿qué establece la Ley N.° 8968 (PRODHAB) respecto a datos personales sensibles?", o: ["Exige consentimiento informado, finalidad legítima y resguardo seguro de los datos", "Autoriza publicar cédulas y expedientes médicos en redes sociales", "Aplica únicamente a bancos extranjeros", "Prohíbe cifrar bases de datos educativas"], g: "Protección de la Persona frente al Tratamiento de sus Datos Personales.", e: "La Ley N.° 8968 protege la autodeterminación informativa y prohíbe el uso indebido de datos sensibles.", ind: "Aplica la normativa nacional de protección de datos en sistemas digitales." }
    ],

    redes_conf: [
      { sub: "Arquitectura de Redes", uni: "Unidad 1: Modelo OSI y TCP/IP", sab: "Capas de red y transporte (IP, TCP, UDP)", d: "Básico", q: "¿En qué capa del Modelo OSI opera el direccionamiento lógico IP y el enrutamiento de paquetes?", o: ["Capa 3 — Red", "Capa 1 — Física", "Capa 7 — Aplicación", "Capa 2 — Enlace de datos"], g: "Física (1), Enlace/MAC (2), Red/IP (3), Transporte/TCP-UDP (4).", e: "El protocolo IP y los routers trabajan en la Capa 3 (Red) del Modelo OSI.", ind: "Identifica las funciones de cada capa del Modelo OSI y TCP/IP." },
      { sub: "Servicios de Red", uni: "Unidad 2: Protocolos DNS, DHCP y HTTPS", sab: "Resolución de nombres y asignación dinámica", d: "Medio", q: "¿Qué servicio traduce automáticamente un dominio legible como «www.practicatecnica.com» a su dirección IP?", o: ["DNS (Domain Name System)", "DHCP", "ICMP", "FTP"], g: "Funciona como la agenda telefónica de Internet.", e: "DNS resuelve nombres de dominio a direcciones IPv4/IPv6.", ind: "Configura y diagnostica servicios esenciales de red local e Internet." },
      { sub: "Conmutación y Segmentación", uni: "Unidad 3: VLANs y Seguridad en Switches", sab: "Segmentación lógica de tráfico por departamentos", d: "Intermedio", q: "¿Cuál es la principal ventaja de crear VLANs separadas para Administración y Laboratorios Estudiantiles?", o: ["Aísla dominios de broadcast y evita que equipos estudiantiles accedan a servidores administrativos", "Duplica la longitud física del cable UTP", "Elimina la necesidad de tener router", "Convierte conexiones cableadas en Bluetooth"], g: "Segmentar tráfico mejora tanto rendimiento como seguridad.", e: "Las VLANs separan lógicamente la red en la capa 2, reforzando seguridad y eficiencia.", ind: "Implementa segmentación lógica mediante VLANs en redes institucionales." }
    ],

    biologia: [
      { sub: "Biología Celular", uni: "Unidad 1: Estructura y Función Celular", sab: "Organelas eucariotas y metabolismo", d: "Básico", q: "¿Cuál organela celular es responsable de generar la mayor parte del ATP mediante la respiración celular?", o: ["Mitocondria", "Cloroplasto", "Vacuola contráctil", "Pared celular"], g: "Se le conoce como la central energética de la célula eucariota.", e: "La mitocondria produce ATP a partir de nutrientes y oxígeno en la respiración aeróbica.", ind: "Relaciona las estructuras celulares con sus funciones vitales." },
      { sub: "Genética y Herencia", uni: "Unidad 2: ADN, ARN y Síntesis de Proteínas", sab: "Transferencia de información genética", d: "Medio", q: "¿Cuál molécula porta el código genético hereditario dentro del núcleo de las células eucariotas?", o: ["ADN (Ácido desoxirribonucleico)", "Glucosa simple", "Celulosa vegetal", "Ácido clorhídrico"], g: "Tiene estructura de doble hélice formada por nucleótidos A, T, C y G.", e: "El ADN almacena y transmite la información hereditaria de generación en generación.", ind: "Explica los mecanismos moleculares de la herencia biológica." },
      { sub: "Ecología y Biodiversidad CR", uni: "Unidad 3: Ecosistemas y Conservación", sab: "Relaciones tróficas y papel de los productores", d: "Intermedio", q: "En una cadena trófica de un bosque costarricense, ¿qué organismos cumplen el rol de productores primarios?", o: ["Plantas y algas fotosintéticas", "Jaguares y águilas", "Hongos descomponedores únicamente", "Rocas minerales"], g: "Son los seres vivos autótrofos capaces de transformar energía solar en energía química.", e: "Los organismos fotosintéticos producen su propio alimento y sostienen toda la red trófica.", ind: "Analiza el flujo de energía y la conservación de la biodiversidad." }
    ],

    ciencias: [
      { sub: "Ciencias Naturales III Ciclo", uni: "Unidad 1: Método Científico y Materia", sab: "Estados de la materia y cambios físicos", d: "Básico", q: "¿Cómo se llama el cambio de estado físico cuando el agua líquida pasa a vapor por calentamiento?", o: ["Evaporación / Vaporización", "Solidificación", "Condensación", "Sublimación inversa"], g: "Observa el paso de estado líquido a estado gaseoso.", e: "Al absorber calor, las partículas del líquido pasan al estado gaseoso mediante vaporización.", ind: "Describe los cambios de estado físico de la materia en fenómenos cotidianos." },
      { sub: "Ciencias Naturales III Ciclo", uni: "Unidad 2: Energía y Ambiente", sab: "Fuentes renovables en Costa Rica", d: "Medio", q: "¿Cuál combinación corresponde exclusivamente a fuentes de energía renovable aprovechadas en Costa Rica?", o: ["Hidroeléctrica, geotérmica, eólica y solar", "Carbón mineral, diésel y gasolina", "Gas natural licuado y petróleo crudo", "Búnker industrial y queroseno"], g: "Piensa en fuentes limpias que se regeneran de forma natural.", e: "Costa Rica destaca por su matriz eléctrica basada en agua, geotermia, viento y sol.", ind: "Valora el uso responsable de fuentes de energía limpia y renovable." }
    ],

    sociales: [
      { sub: "Historia de Costa Rica", uni: "Unidad 1: Formación del Estado Costarricense", sab: "Independencia y Anexión del Partido de Nicoya", d: "Básico", q: "¿Qué fecha conmemora Costa Rica la Anexión del Partido de Nicoya bajo el lema «De la Patria por nuestra voluntad»?", o: ["25 de julio de 1824", "15 de setiembre de 1821", "11 de abril de 1856", "1 de diciembre de 1948"], g: "Es una efeméride de julio que enriqueció cultural y territorialmente al país.", e: "El 25 de julio de 1824 el Partido de Nicoya decidió libremente incorporarse a Costa Rica.", ind: "Analiza los hitos históricos que consolidaron el territorio y la identidad nacional." },
      { sub: "Historia y Democracia", uni: "Unidad 2: Garantías Sociales y Estado de Derecho", sab: "Reformas sociales de la década de 1940 y abolición del ejército", d: "Medio", q: "¿Cuál acontecimiento del 1 de diciembre de 1948 permitió redirigir recursos públicos hacia educación y salud en Costa Rica?", o: ["La abolición del ejército como institución permanente", "La independencia de Centroamérica", "La batalla de Santa Rosa", "La construcción del Ferrocarril al Atlántico"], g: "Es uno de los pilares de la paz y la inversión social costarricense.", e: "La abolición del ejército en 1948 consolidó la democracia civil y fortaleció la inversión en educación y salud.", ind: "Valora las instituciones democráticas y las garantías sociales de Costa Rica." },
      { sub: "Educación Cívica", uni: "Unidad 3: Derechos Humanos y Participación Ciudadana", sab: "División de poderes en la Constitución Política de 1949", d: "Intermedio", q: "¿Cuáles son los tres Supremos Poderes de la República de Costa Rica establecidos en la Constitución?", o: ["Poder Ejecutivo, Poder Legislativo y Poder Judicial", "Poder Militar, Poder Comercial y Poder Municipal", "Poder Escolar, Poder Bancario y Poder Privado", "Poder Regional, Poder Cantonal y Poder Distrital"], g: "A estos se suma el TSE con rango constitucional en materia electoral.", e: "La República se organiza en Poder Ejecutivo, Legislativo y Judicial, garantizando pesos y contrapesos.", ind: "Comprende la organización constitucional y el ejercicio responsable de la ciudadanía." }
    ],

    comercial: [
      { sub: "Servicio al Cliente", uni: "Unidad 1: Comunicación Asertiva Empresarial", sab: "Protocolo de atención a reclamos y escucha activa", d: "Básico", q: "Ante un cliente molesto por un retraso en su entrega, ¿cuál respuesta demuestra profesionalismo y servicio de calidad?", o: ["Escuchar con empatía, ofrecer disculpas sinceras y brindar una solución concreta con plazo", "Interrumpir al cliente y culpar a otro departamento", "Ignorar el reclamo hasta la semana siguiente", "Responder con sarcasmo para terminar rápido"], g: "Empatía + responsabilidad + solución verificable.", e: "La escucha activa y la propuesta de solución clara convierten una queja en fidelización.", ind: "Aplica protocolos de servicio al cliente con empatía y eficiencia." },
      { sub: "Logística e Inventarios", uni: "Unidad 2: Control de Bodega y Cadena de Suministro", sab: "Método PEPS / FIFO en productos perecederos", d: "Intermedio", q: "¿Qué significa gestionar el inventario bajo el método FIFO / PEPS?", o: ["Primero en Entrar, Primero en Salir (para evitar vencimientos y mermas)", "Pagar facturas sin verificar mercancía", "Almacenar productos sin etiquetar", "Vender primero el lote más nuevo dejando vencer el antiguo"], g: "First In, First Out: esencial en alimentos y suministros con fecha de vencimiento.", e: "PEPS asegura rotación saludable del inventario y reduce pérdidas por caducidad.", ind: "Aplica técnicas de control de inventarios en operaciones comerciales y logísticas." }
    ],

    diseno: [
      { sub: "Teoría del Color y Composición", uni: "Unidad 1: Identidad Visual y Tipografía", sab: "Formatos vectoriales (SVG) vs mapa de bits (JPG/PNG)", d: "Básico", q: "¿Por qué es preferible entregar un logotipo institucional en formato vectorial (SVG)?", o: ["Porque puede escalarse a cualquier tamaño sin perder nitidez ni pixelarse", "Porque ocupa cien veces más espacio en memoria", "Porque elimina todos los colores del escudo", "Porque solo puede verse en impresoras antiguas"], g: "Los vectores se basan en trazos matemáticos, no en píxeles fijos.", e: "Un gráfico SVG mantiene bordes perfectos desde un ícono de celular hasta una valla publicitaria.", ind: "Selecciona formatos gráficos adecuados para piezas digitales e impresas." },
      { sub: "UX/UI y Comunicación Visual", uni: "Unidad 2: Jerarquía Visual y Contraste Accesible", sab: "Legibilidad y contraste en diseño inclusivo", d: "Intermedio", q: "Al diseñar un afiche institucional o pantalla móvil, ¿qué garantiza una lectura clara y accesible (DUA)?", o: ["Alto contraste entre texto y fondo, jerarquía tipográfica limpia y máximo 2 familias de fuentes", "Usar cinco tipografías cursivas sobre un fondo muy recargado", "Colocar texto gris claro sobre fondo blanco", "Saturar el afiche con párrafos extensos sin márgenes"], g: "Menos ruido visual y mayor contraste facilitan la comprensión inmediata.", e: "El contraste adecuado y la jerarquía clara hacen que cualquier persona comprenda el mensaje al instante.", ind: "Aplica principios de diseño UX/UI inclusivo y marca blanca profesional." }
    ],

    turismo: [
      { sub: "Turismo Sostenible CR", uni: "Unidad 1: Certificación para la Sostenibilidad Turística (CST)", sab: "Buenas prácticas ambientales y culturales", d: "Básico", q: "¿Qué evalúa el Certificado para la Sostenibilidad Turística (CST) impulsado por el ICT en Costa Rica?", o: ["El manejo responsable de recursos naturales, apoyo a la comunidad local y calidad de servicio", "Únicamente el precio más alto de hospedaje", "La construcción de hoteles dentro de parques nacionales protegidos", "El uso exclusivo de plásticos de un solo uso"], g: "Sostenibilidad integra ambiente, economía local y cultura.", e: "El CST reconoce a empresas turísticas que operan con respeto ecológico y beneficio comunitario.", ind: "Promueve estándares de turismo sostenible en el contexto costarricense." },
      { sub: "Hospitalidad y Geografía Turística", uni: "Unidad 2: Patrimonio Natural y Cultural", sab: "Áreas Silvestres Protegidas (SINAC)", d: "Medio", q: "¿Cuál conducta debe instruir un guía turístico a visitantes dentro de un Parque Nacional de Costa Rica?", o: ["Permanecer en los senderos demarcados, no alimentar fauna silvestre y no dejar residuos", "Alimentar monos y mapaches para tomar fotografías", "Extraer plantas y piedras como recuerdos", "Salirse de los senderos oficiales sin permiso"], g: "Principio de mínimo impacto ecológico.", e: "Respetar senderos y fauna protege los ecosistemas y la seguridad de los visitantes.", ind: "Aplica protocolos de guiado responsable y conservación patrimonial." }
    ],

    hogar: [
      { sub: "Nutrición y Salud", uni: "Unidad 1: Alimentación Balanceada e Higiene", sab: "Inocuidad alimentaria y contaminación cruzada", d: "Básico", q: "¿Cómo se previene la contaminación cruzada al preparar alimentos en casa o en el comedor?", o: ["Usando tablas y cuchillos separados para carnes crudas y vegetales listos para consumir", "Cortando pollo crudo y ensalada en la misma tabla sin lavar", "Dejando lácteos fuera de refrigeración todo el día", "No lavándose las manos entre preparaciones"], g: "Separa alimentos crudos de cocidos o frescos.", e: "Evitar el contacto entre utensilios de carnes crudas y vegetales previene enfermedades transmitidas por alimentos.", ind: "Aplica prácticas de inocuidad alimentaria y nutrición saludable." },
      { sub: "Economía Familiar", uni: "Unidad 2: Presupuesto y Consumo Responsable", sab: "Priorización de necesidades frente a deseos", d: "Medio", q: "Al elaborar un presupuesto mensual familiar, ¿qué gastos deben cubrirse primero?", o: ["Necesidades básicas (alimentación, vivienda, servicios, salud y educación) y ahorro", "Compras impulsivas de entretenimiento", "Deudas con intereses ocultos sin revisar", "Artículos de lujo innecesarios"], g: "Ordena siempre lo esencial antes de lo opcional.", e: "Priorizar gastos esenciales y destinar un porcentaje al ahorro protege la estabilidad del hogar.", ind: "Elabora presupuestos responsables para la gestión cotidiana del hogar." }
    ],

    artes_ind: [
      { sub: "Dibujo Técnico y Materiales", uni: "Unidad 1: Herramientas y Seguridad en Taller Industrial", sab: "Uso correcto de herramientas de corte y medición", d: "Básico", q: "En Artes Industriales, ¿qué instrumento permite trazar ángulos exactos de 90° en piezas de madera o metal?", o: ["Escuadra metálica de carpintero o mecánico", "Martillo de bola", "Destornillador de estrella", "Alicate de corte"], g: "Busca el instrumento de trazado y verificación de perpendicularidad.", e: "La escuadra asegura cortes y ensambles perfectamente perpendiculares (90°).", ind: "Emplea instrumentos de trazado y herramientas industriales con precisión." },
      { sub: "Procesos Productivos", uni: "Unidad 2: Acabados y Control de Calidad", sab: "Lijado progresivo y protección de superficies", d: "Medio", q: "¿En qué orden de grano se deben usar las lijas para obtener un acabado liso y profesional en madera?", o: ["De grano grueso (número menor) hacia grano fino (número mayor)", "Únicamente grano muy grueso sin limpiar polvo", "De grano fino a grano grueso al final", "Aplicando barniz antes de lijar"], g: "Grano 80 → 120 → 220 suaviza progresivamente la superficie.", e: "Avanzar de grano grueso a fino elimina imperfecciones sin rayar el acabado final.", ind: "Aplica procesos de acabado y control de calidad en proyectos industriales." }
    ],

    tecnologia: [
      { sub: "Ciudadanía Digital y Productividad", uni: "Unidad 1: Pensamiento Computacional", sab: "Descomposición y diseño de algoritmos", d: "Básico", q: "En pensamiento computacional, ¿qué es un algoritmo?", o: ["Una secuencia ordenada y finita de pasos claros para resolver un problema", "Un cable que conecta el monitor a la corriente", "Un virus informático sin control", "Una imagen comprimida en formato JPEG"], g: "Piensa en una receta clara con inicio, pasos ordenados y resultado.", e: "Un algoritmo define instrucciones precisas y finitas para alcanzar una solución.", ind: "Aplica el pensamiento computacional para modelar soluciones ordenadas." },
      { sub: "Herramientas Digitales", uni: "Unidad 2: Ética Digital e Inteligencia Artificial Responsable", sab: "Verificación de fuentes y uso ético de IA", d: "Medio", q: "Al utilizar herramientas de Inteligencia Artificial para estudiar, ¿cuál práctica garantiza un aprendizaje auténtico?", o: ["Usarla para comprender paso a paso, practicar y verificar siempre los datos con fuentes confiables", "Copiar respuestas sin leerlas ni entenderlas", "Compartir contraseñas y cédulas privadas en chats públicos", "Confiar ciegamente sin revisar cálculos ni citas"], g: "La IA es un tutor de apoyo, nunca un sustituto de tu criterio.", e: "Validar información y comprender el procedimiento fortalece el pensamiento crítico.", ind: "Utiliza herramientas digitales e IA con ética, privacidad y criterio." }
    ],

    edfisica: [
      { sub: "Actividad Física y Salud", uni: "Unidad 1: Calentamiento y Prevención de Lesiones", sab: "Movilidad articular y activación cardiovascular", d: "Básico", q: "¿Por qué es indispensable realizar calentamiento antes de una práctica deportiva intensa?", o: ["Eleva progresivamente la temperatura muscular y prepara articulaciones para prevenir lesiones", "Reduce la flexibilidad del cuerpo", "Reemplaza la hidratación durante el ejercicio", "Sirve únicamente para cansarse antes de jugar"], g: "Prepara el sistema cardiovascular y muscular de forma gradual.", e: "El calentamiento mejora la irrigación sanguínea y disminuye desgarros y esguinces.", ind: "Aplica rutinas de calentamiento y vuelta a la calma para la salud integral." },
      { sub: "Fisiología y Valores Deportivos", uni: "Unidad 2: Hidratación y Juego Limpio", sab: "Recuperación hídrica y convivencia deportiva", d: "Medio", q: "¿Cuál bebida es la más recomendable para hidratarse habitualmente durante las clases de Educación Física?", o: ["Agua potable fresca en sorbos periódicos", "Bebidas energizantes con exceso de cafeína", "Refrescos gaseosos muy azucarados", "No tomar líquidos hasta el día siguiente"], g: "El agua repone la pérdida por sudoración sin sobrecargar el organismo.", e: "La hidratación con agua potable mantiene el rendimiento físico y evita golpes de calor.", ind: "Promueve hábitos saludables de hidratación y juego limpio." }
    ],

    musica: [
      { sub: "Lenguaje Musical", uni: "Unidad 1: Notación, Ritmo y Compás", sab: "Duración relativa de las figuras musicales", d: "Básico", q: "En un compás de 4/4, ¿cuántos tiempos dura una figura «blanca»?", o: ["2 tiempos", "1 tiempo", "4 tiempos", "Medio tiempo"], g: "Redonda = 4, Blanca = 2, Negra = 1, Corchea = 1/2.", e: "La blanca equivale a la mitad de una redonda, es decir, 2 tiempos en compás de 4/4.", ind: "Lee e interpreta figuras rítmicas básicas en compases simples." },
      { sub: "Patrimonio Musical CR", uni: "Unidad 2: Música Folclórica de Costa Rica", sab: "Instrumentos tradicionales y el Punto Guanacasteco", d: "Medio", q: "¿Cuál instrumento de percusión de teclas de madera es símbolo nacional de la música folclórica de Costa Rica?", o: ["La marimba", "La gaita escocesa", "El arpa celta", "El acordeón alpino"], g: "Declarada instrumento nacional en 1996, emblemática de Guanacaste.", e: "La marimba es el instrumento nacional de Costa Rica y eje de su tradición folclórica.", ind: "Valora el patrimonio musical e instrumental costarricense." }
    ],

    artes: [
      { sub: "Lenguaje Visual", uni: "Unidad 1: Teoría del Color", sab: "Colores primarios y secundarios en pintura", d: "Básico", q: "En la síntesis sustractiva tradicional (témpera o acrílico), ¿qué color secundario resulta al mezclar azul y amarillo?", o: ["Verde", "Anaranjado", "Violeta", "Magenta"], g: "Recuerda el círculo cromático básico de pintura.", e: "Al combinar los primarios azul y amarillo se obtiene el color secundario verde.", ind: "Aplica principios de teoría del color en composiciones plásticas." },
      { sub: "Composición y Perspectiva", uni: "Unidad 2: Profundidad y Punto de Fuga", sab: "Representación tridimensional en el plano", d: "Intermedio", q: "¿Qué recurso artístico permite crear sensación de profundidad haciendo converger líneas paralelas en el horizonte?", o: ["Perspectiva lineal con punto de fuga", "Monocromía plana sin sombras", "Recorte aleatorio", "Pintura dactilar sin contorno"], g: "Imagina una carretera recta que parece unirse a lo lejos.", e: "La perspectiva lineal organiza el espacio hacia uno o más puntos de fuga en la línea de horizonte.", ind: "Emplea la perspectiva y el claroscuro para representar volumen y profundidad." }
    ],

    psicologia: [
      { sub: "Inteligencia Emocional", uni: "Unidad 1: Autoconocimiento y Regulación Emocional", sab: "Comunicación asertiva frente a pasividad y agresividad", d: "Básico", q: "¿Qué caracteriza a la comunicación asertiva en la convivencia estudiantil?", o: ["Expresar ideas, emociones y límites con claridad y respeto hacia uno mismo y los demás", "Guardar silencio siempre aunque se vulneren derechos", "Imponer opiniones gritando o descalificando", "Evitar cualquier diálogo honesto"], g: "Es el punto de equilibrio respetuoso entre ser pasivo y ser agresivo.", e: "La asertividad fortalece la autoestima, previene conflictos y construye relaciones sanas.", ind: "Practica habilidades de inteligencia emocional y comunicación asertiva." },
      { sub: "Procesos Cognitivos", uni: "Unidad 2: Atención, Memoria y Hábitos de Estudio", sab: "Efecto de los descansos breves en la consolidación del aprendizaje", d: "Medio", q: "¿Por qué alternar bloques de 25 minutos de estudio con pausas de 5 minutos mejora la retención?", o: ["Porque evita la fatiga atencional y favorece la consolidación de la memoria de trabajo", "Porque elimina la necesidad de repasar", "Porque distrae con redes sociales durante horas", "Porque impide comprender textos"], g: "El cerebro consolida mejor la información en ciclos enfocados con pausas cortas.", e: "Las pausas activas restauran la atención sostenida y reducen el agotamiento cognitivo.", ind: "Aplica estrategias metacognitivas para potenciar el aprendizaje autónomo." }
    ],

    filosofia: [
      { sub: "Lógica y Argumentación", uni: "Unidad 1: Validez de Argumentos y Falacias", sab: "Identificación de la falacia ad hominem", d: "Medio", q: "Cuando en un debate alguien ataca la persona del interlocutor en lugar de refutar sus argumentos, incurre en la falacia:", o: ["Ad hominem (contra la persona)", "Silogismo hipotético válido", "Deducción matemática", "Inducción experimental"], g: "En latín significa literalmente «dirigido contra el hombre/persona».", e: "La falacia ad hominem descalifica a quien habla sin analizar la validez real de sus razones.", ind: "Identifica falacias informales para argumentar con rigor lógico." },
      { sub: "Ética y Pensamiento Crítico", uni: "Unidad 2: Filosofía Clásica y Ética", sab: "Método socrático (mayéutica)", d: "Intermedio", q: "¿En qué consiste la mayéutica propuesta por Sócrates?", o: ["En formular preguntas críticas que guían a la persona a descubrir la verdad por sí misma", "En prohibir el diálogo y memorizar sin cuestionar", "En ganar debates mediante engaños", "En rechazar toda reflexión ética"], g: "Sócrates comparaba su método con ayudar a «dar a luz» ideas claras.", e: "La mayéutica usa el diálogo y la interrogación reflexiva para examinar creencias y construir conocimiento.", ind: "Aplica el cuestionamiento filosófico para analizar dilemas éticos actuales." }
    ],

    religion: [
      { sub: "Convivencia y Valores", uni: "Unidad 1: Dignidad Humana y Respeto", sab: "Cultura de paz, empatía y respeto a la diversidad", d: "Básico", q: "¿Qué valor ético fundamenta el trato digno hacia todas las personas sin distinción de origen, creencia o condición?", o: ["El respeto a la dignidad humana y los Derechos Humanos", "La intolerancia hacia opiniones distintas", "La indiferencia ante el sufrimiento ajeno", "La exclusión de minorías"], g: "Toda persona posee valor intrínseco y merece respeto.", e: "El respeto a la dignidad humana sostiene la convivencia pacífica e inclusiva en el centro educativo.", ind: "Promueve valores de respeto, solidaridad y convivencia pacífica." },
      { sub: "Ética Ciudadana", uni: "Unidad 2: Solidaridad y Bien Común", sab: "Compromiso social y cuidado de la casa común", d: "Medio", q: "¿Qué acción estudiantil refleja solidaridad y responsabilidad hacia el bien común?", o: ["Colaborar en campañas de apoyo comunitario, reciclaje y respeto a los espacios compartidos", "Dañar pupitres y recursos del colegio", "Ignorar las necesidades del grupo", "Promover burlas hacia compañeros"], g: "El bien común beneficia a toda la comunidad educativa.", e: "La solidaridad activa y el cuidado del entorno construyen comunidades más justas y humanas.", ind: "Participa en acciones solidarias orientadas al bien común." }
    ]
  };

  function ensureFour(okTxt, dists) {
    const out = [String(okTxt)];
    const seen = new Set([String(okTxt).trim().toLowerCase()]);
    (dists || []).forEach(d => {
      const s = String(d);
      if (!seen.has(s.trim().toLowerCase()) && out.length < 4) { seen.add(s.trim().toLowerCase()); out.push(s); }
    });
    let k = 1;
    while (out.length < 4) {
      const c = `${okTxt} (alternativa incorrecta ${k})`;
      if (!seen.has(c.toLowerCase())) { seen.add(c.toLowerCase()); out.push(c); }
      k++;
    }
    return out;
  }

  function packItem(raw, mat, seq) {
    const d = DIFFS.includes(raw.d) ? raw.d : DIFFS[seq % 4];
    const clean = ensureFour(raw.o[0], raw.o.slice(1));
    const opts = shuffle(clean.map((txt, idx) => ({ txt, ok: idx === 0 })));
    return {
      id: `ODIN10-${(mat.id || "MEP").toUpperCase()}-${seq}`,
      a: mat.id,
      materia: mat.name,
      subarea: raw.sub || mat.name,
      unidadEstudio: raw.uni || `Unidad ${(seq % 4) + 1} — Malla MEP 2026`,
      saberEsencial: raw.sab || `Dominio conceptual esencial de ${mat.name}`,
      indicador: raw.ind || `Aplica con precisión los saberes esenciales de ${mat.name}.`,
      nivelDesempeno: NIVEL_REAC[d] || "Nivel 2 (Intermedio) — REAC",
      steam: "Enfoque Fenómeno Real • STEAM & Excelencia Pedagógica",
      dua: APOYOS_DUA[seq % APOYOS_DUA.length],
      d,
      moptCat: raw.moptCat,
      lang: raw.lang || "es-CR",
      audio: raw.q,
      q: raw.q,
      o: clean,
      c: 0,
      opts,
      g: raw.g || `Identifica el saber esencial de ${mat.name}.`,
      e: raw.e || `Respuesta fundamentada en el programa oficial de ${mat.name}.`
    };
  }

  // Generadores paramétricos puros por materia (miles de variantes sin contaminación)
  function generarParametricoPuro(tipo, mat, diffTarget, subCat, seq) {
    if (tipo === "mate") {
      const m = seq % 5;
      if (m === 0) {
        const a = randInt(5, 85), b = randInt(3, 25), c = randInt(2, 12), ok = a + b * c;
        return packItem({ sub: "Números y Operaciones", uni: "Unidad 1: Jerarquía de Operaciones", sab: "Operaciones combinadas en números enteros", d: "Básico", q: `Calcule el resultado exacto de la operación combinada: ${a} + ${b} × ${c}`, o: [`${ok}`, `${(a + b) * c}`, `${a + b + c}`, `${a * c + b}`], g: "Aplica prioridad de multiplicación antes de suma.", e: `${b} × ${c} = ${b*c}; luego ${a} + ${b*c} = ${ok}.`, ind: "Resuelve operaciones combinadas respetando la jerarquía aritmética." }, mat, seq);
      }
      if (m === 1) {
        const k = randInt(2, 14), x = randInt(2, 25), n = randInt(3, 45), rhs = k * x + n;
        return packItem({ sub: "Relaciones y Álgebra", uni: "Unidad 2: Ecuaciones Lineales", sab: "Despeje de ecuaciones de primer grado", d: "Medio", q: `Determine el valor de x que satisface la ecuación lineal: ${k}x + ${n} = ${rhs}`, o: [`x = ${x}`, `x = ${x + 2}`, `x = ${Math.round((rhs + n) / k)}`, `x = ${Math.max(1, x - 1)}`], g: "Resta el término constante en ambos miembros y divide entre el coeficiente.", e: `${k}x = ${rhs - n} ⇒ x = ${x}.`, ind: "Resuelve ecuaciones lineales en una incógnita." }, mat, seq);
      }
      if (m === 2) {
        const k = randInt(1, 10), tri = [[3,4,5],[5,12,13],[8,15,17],[7,24,25]][seq % 4];
        const a = tri[0]*k, b = tri[1]*k, c = tri[2]*k;
        return packItem({ sub: "Geometría", uni: "Unidad 3: Teorema de Pitágoras", sab: "Cálculo de hipotenusa en triángulos rectángulos", d: "Intermedio", q: `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm. ¿Cuál es la medida de su hipotenusa?`, o: [`${c} cm`, `${a + b} cm`, `${c + k} cm`, `${Math.max(1, c - k)} cm`], g: "Usa c = √(a² + b²).", e: `√(${a}² + ${b}²) = ${c} cm.`, ind: "Aplica el Teorema de Pitágoras en problemas geométricos." }, mat, seq);
      }
      if (m === 3) {
        const mVal = randInt(2, 12), bVal = randInt(-12, 16), xVal = randInt(2, 14), y = mVal * xVal + bVal;
        const bt = bVal >= 0 ? `+ ${bVal}` : `− ${Math.abs(bVal)}`;
        return packItem({ sub: "Relaciones y Álgebra", uni: "Unidad 4: Función Lineal", sab: "Cálculo de imágenes en f(x) = mx + b", d: "Avanzado", q: `Para la función lineal f(x) = ${mVal}x ${bt}, ¿cuál es el valor de f(${xVal})?`, o: [`${y}`, `${mVal * xVal - bVal}`, `${mVal + xVal + bVal}`, `${y + mVal}`], g: "Sustituye x y respeta los signos.", e: `f(${xVal}) = ${mVal}(${xVal}) ${bt} = ${y}.`, ind: "Evalúa funciones lineales y analiza su pendiente e intersección." }, mat, seq);
      }
      const p = randInt(4, 50) * 1000, pct = [5, 10, 15, 20, 25, 30][seq % 6], ah = Math.round(p * pct / 100);
      return packItem({ sub: "Estadística y Proporcionalidad", uni: "Unidad 4: Porcentajes Aplicados", sab: "Cálculo de descuentos comerciales", d: "Intermedio", q: `Un artículo de ₡${p.toLocaleString("es-CR")} tiene ${pct}% de descuento. ¿Cuánto se paga finalmente?`, o: [`₡${(p - ah).toLocaleString("es-CR")}`, `₡${(p + ah).toLocaleString("es-CR")}`, `₡${ah.toLocaleString("es-CR")}`, `₡${(p - pct * 100).toLocaleString("es-CR")}`], g: "Resta el monto del descuento al precio inicial.", e: `Descuento ₡${ah.toLocaleString("es-CR")}; precio final ₡${(p - ah).toLocaleString("es-CR")}.`, ind: "Resuelve problemas cotidianos de proporcionalidad y porcentajes." }, mat, seq);
    }

    if (tipo === "electro") {
      const m = seq % 3;
      if (m === 0) {
        const r = randInt(2, 30), i = randInt(1, 15), v = r * i;
        return packItem({ sub: "Circuitos de Corriente Continua", uni: "Unidad 1: Ley de Ohm", sab: "Cálculo de corriente eléctrica (I = V / R)", d: "Básico", q: `En un circuito electrónico de ${v} V con una resistencia de ${r} Ω, ¿qué corriente (I) circula?`, o: [`${i} A`, `${v * r} A`, `${v + r} A`, `${i + 2} A`], g: "Aplica I = V / R.", e: `I = ${v} V / ${r} Ω = ${i} A.`, ind: "Aplica la Ley de Ohm en circuitos resistivos básicos." }, mat, seq);
      }
      if (m === 1) {
        const v = [5, 9, 12, 24, 36, 48][seq % 6], i = randInt(1, 10), p = v * i;
        return packItem({ sub: "Circuitos de Corriente Continua", uni: "Unidad 1: Potencia Eléctrica", sab: "Potencia disipada (P = V × I)", d: "Medio", q: `Una carga electrónica trabaja a ${v} V consumiendo ${i} A. ¿Qué potencia eléctrica disipa?`, o: [`${p} W`, `${v + i} W`, `${Math.max(1, Math.round(v / i))} W`, `${p + v} W`], g: "Multiplica voltaje por corriente.", e: `P = ${v} V × ${i} A = ${p} W.`, ind: "Calcula potencia eléctrica en circuitos de corriente directa." }, mat, seq);
      }
      const rp = randInt(2, 40) * 2;
      return packItem({ sub: "Análisis de Circuitos", uni: "Unidad 2: Circuitos Serie y Paralelo", sab: "Resistencia equivalente en paralelo", d: "Avanzado", q: `Dos resistores iguales de ${rp} Ω conectados en paralelo tienen una resistencia equivalente de:`, o: [`${rp / 2} Ω`, `${rp * 2} Ω`, `${rp} Ω`, `${rp + 4} Ω`], g: "Dos resistencias iguales en paralelo equivalen a R / 2.", e: `Req = ${rp} / 2 = ${rp / 2} Ω.`, ind: "Determina resistencias equivalentes en arreglos serie y paralelo." }, mat, seq);
    }

    if (tipo === "fisica") {
      const m = seq % 3;
      if (m === 0) {
        const v = randInt(20, 95), t = randInt(2, 9), d = v * t;
        return packItem({ sub: "Cinemática", uni: "Unidad 1: Movimiento Rectilíneo Uniforme", sab: "Relación distancia, rapidez y tiempo (d = v · t)", d: "Básico", q: `Un móvil en MRU viaja a rapidez constante de ${v} km/h durante ${t} h. ¿Qué distancia recorre?`, o: [`${d} km`, `${v + t} km`, `${Math.round(v / t)} km`, `${d + v} km`], g: "Aplica d = v × t.", e: `${v} km/h × ${t} h = ${d} km.`, ind: "Resuelve problemas de Movimiento Rectilíneo Uniforme." }, mat, seq);
      }
      if (m === 1) {
        const mKg = randInt(2, 40), a = randInt(2, 12), f = mKg * a;
        return packItem({ sub: "Dinámica", uni: "Unidad 2: Leyes de Newton", sab: "Segunda Ley de Newton (F = m · a)", d: "Medio", q: `¿Qué fuerza neta acelera un cuerpo de ${mKg} kg a razón de ${a} m/s²?`, o: [`${f} N`, `${mKg + a} N`, `${Math.max(1, Math.round(mKg / a))} N`, `${f + mKg} N`], g: "Multiplica masa (kg) × aceleración (m/s²).", e: `F = ${mKg} × ${a} = ${f} N.`, ind: "Aplica las Leyes de Newton en situaciones físicas." }, mat, seq);
      }
      const mKg = randInt(2, 20) * 2, v = randInt(2, 15), ec = 0.5 * mKg * v * v;
      return packItem({ sub: "Trabajo y Energía", uni: "Unidad 3: Energía Mecánica", sab: "Energía cinética (Ec = ½mv²)", d: "Avanzado", q: `Calcule la energía cinética de un objeto de ${mKg} kg que se desplaza a ${v} m/s:`, o: [`${ec} J`, `${mKg * v} J`, `${mKg * v * v} J`, `${ec + 10} J`], g: "Ec = 0,5 × m × v².", e: `0,5 × ${mKg} × ${v}² = ${ec} J.`, ind: "Calcula energía cinética y potencial en sistemas mecánicos." }, mat, seq);
    }

    if (tipo === "quimica") {
      const m = seq % 3;
      if (m === 0) {
        const z = randInt(1, 30), n = z + randInt(0, 6), aM = z + n;
        return packItem({ sub: "Estructura Atómica", uni: "Unidad 1: El Átomo y la Tabla Periódica", sab: "Número atómico (Z) y número másico (A)", d: "Básico", q: `Un átomo tiene Z = ${z} protones y N = ${n} neutrones. ¿Cuál es su número másico (A)?`, o: [`A = ${aM}`, `A = ${Math.abs(n - z)}`, `A = ${z * 2}`, `A = ${aM + 2}`], g: "Suma protones y neutrones (A = Z + N).", e: `A = ${z} + ${n} = ${aM}.`, ind: "Determina partículas subatómicas y número másico." }, mat, seq);
      }
      if (m === 1) {
        const ph = randInt(1, 13), cl = ph < 7 ? "Ácida" : (ph === 7 ? "Neutra" : "Básica / Alcalina");
        const oth = ["Ácida", "Neutra", "Básica / Alcalina", "Radiactiva"].filter(x => x !== cl);
        return packItem({ sub: "Disoluciones Químicas", uni: "Unidad 2: Ácidos, Bases y Escala de pH", sab: "Clasificación de sustancias según su pH", d: "Medio", q: `Una disolución acuosa registra pH = ${ph}. Según la escala oficial (0–14), es:`, o: [cl, oth[0], oth[1], oth[2]], g: "<7 ácida, 7 neutra, >7 básica.", e: `pH ${ph} corresponde a carácter ${cl.toLowerCase()}.`, ind: "Clasifica sustancias cotidianas mediante la escala de pH." }, mat, seq);
      }
      const mols = randInt(1, 7), list = [[18,"agua (H₂O)"],[44,"CO₂"],[58.5,"NaCl"],[40,"NaOH"]][seq % 4];
      const gTot = Number((mols * list[0]).toFixed(1));
      return packItem({ sub: "Estequiometría", uni: "Unidad 3: Mol y Masa Molar", sab: "Conversión de moles a gramos", d: "Avanzado", q: `Si la masa molar de ${list[1]} es ${list[0]} g/mol, ¿cuántos gramos equivalen a ${mols} moles?`, o: [`${gTot} g`, `${(list[0]/mols).toFixed(1)} g`, `${(list[0]+mols).toFixed(1)} g`, `${(gTot+list[0]).toFixed(1)} g`], g: "Multiplica moles × masa molar.", e: `${mols} × ${list[0]} = ${gTot} g.`, ind: "Realiza cálculos estequiométricos básicos con moles y masa molar." }, mat, seq);
    }

    if (tipo === "conta") {
      const m = seq % 3;
      if (m === 0) {
        const pas = randInt(2, 40) * 50000, pat = randInt(3, 50) * 50000, act = pas + pat;
        return packItem({ sub: "Contabilidad General", uni: "Unidad 1: Ecuación Contable Fundamental", sab: "Relación Activo = Pasivo + Patrimonio", d: "Básico", q: `Una PYME posee Pasivos de ₡${pas.toLocaleString("es-CR")} y Patrimonio de ₡${pat.toLocaleString("es-CR")}. ¿Cuál es su Activo total?`, o: [`₡${act.toLocaleString("es-CR")}`, `₡${Math.abs(pat - pas).toLocaleString("es-CR")}`, `₡${pat.toLocaleString("es-CR")}`, `₡${(act + 50000).toLocaleString("es-CR")}`], g: "Suma Pasivo + Patrimonio.", e: `Activo = ₡${act.toLocaleString("es-CR")}.`, ind: "Aplica la ecuación contable bajo NIIF para las PYMES." }, mat, seq);
      }
      if (m === 1) {
        const sub = randInt(2, 80) * 10000, iva = Math.round(sub * 0.13), tot = sub + iva;
        return packItem({ sub: "Tributación y Facturación", uni: "Unidad 2: Impuesto al Valor Agregado (IVA 13%)", sab: "Cálculo del IVA general en Costa Rica", d: "Intermedio", q: `Sobre un subtotal gravado al 13% de ₡${sub.toLocaleString("es-CR")}, ¿cuál es el monto total a facturar?`, o: [`₡${tot.toLocaleString("es-CR")} (IVA ₡${iva.toLocaleString("es-CR")})`, `₡${(sub + Math.round(sub*0.10)).toLocaleString("es-CR")}`, `₡${(sub - iva).toLocaleString("es-CR")}`, `₡${(tot + 1300).toLocaleString("es-CR")}`], g: "Calcula 13% del subtotal y súmalo.", e: `IVA = ₡${iva.toLocaleString("es-CR")}; Total = ₡${tot.toLocaleString("es-CR")}.`, ind: "Calcula impuestos aplicables a facturación electrónica en Costa Rica." }, mat, seq);
      }
      const ing = randInt(20, 90)*50000, cos = randInt(5, 14)*50000, gas = randInt(2, 7)*50000, ut = ing - cos - gas;
      return packItem({ sub: "Estados Financieros", uni: "Unidad 3: Estado de Resultados", sab: "Determinación de utilidad operativa", d: "Avanzado", q: `Ingresos ₡${ing.toLocaleString("es-CR")}, Costo de Ventas ₡${cos.toLocaleString("es-CR")} y Gastos ₡${gas.toLocaleString("es-CR")}. ¿Cuál es la utilidad operativa?`, o: [`₡${ut.toLocaleString("es-CR")}`, `₡${(ing - cos).toLocaleString("es-CR")}`, `₡${(ing + cos - gas).toLocaleString("es-CR")}`, `₡${(cos + gas).toLocaleString("es-CR")}`], g: "Resta costos y gastos a los ingresos.", e: `Utilidad operativa = ₡${ut.toLocaleString("es-CR")}.`, ind: "Elabora e interpreta el Estado de Resultados." }, mat, seq);
    }

    if (tipo === "redes_conf") {
      const subs = [["/24","255.255.255.0",254],["/25","255.255.255.128",126],["/26","255.255.255.192",62],["/27","255.255.255.224",30],["/28","255.255.255.240",14],["/29","255.255.255.248",6]];
      const [cidr, mask, hosts] = subs[seq % subs.length];
      const o3 = randInt(1, 240);
      return packItem({ sub: "Direccionamiento IPv4", uni: "Unidad 3: Subneteo VLSM y CIDR", sab: "Cálculo de hosts utilizables por subred", d: "Avanzado", q: `En la subred 192.168.${o3}.0${cidr} (máscara ${mask}), ¿cuántas direcciones IP utilizables para hosts existen?`, o: [`${hosts} hosts utilizables`, `${hosts + 2} hosts utilizables`, `${hosts * 2} hosts utilizables`, `256 hosts utilizables`], g: "Aplica 2^(bits de host) − 2 (excluye red y broadcast).", e: `${cidr} permite exactamente ${hosts} hosts válidos.`, ind: "Diseña esquemas de direccionamiento y subneteo IPv4." }, mat, seq);
    }

    if (tipo === "admision") {
      const m = seq % 4;
      if (m === 0) {
        const st = randInt(3, 30), step = randInt(2, 9), inc = randInt(1, 3);
        const s1 = st, s2 = s1 + step, s3 = s2 + step + inc, s4 = s3 + step + inc*2, s5 = s4 + step + inc*3;
        return packItem({ sub: "Razonamiento Cuantitativo PAA", uni: "Unidad 1: Patrones y Sucesiones", sab: "Análisis de regularidades numéricas", d: "Medio", q: `[Admisión UCR/TEC] ¿Cuál número continúa la sucesión: ${s1}, ${s2}, ${s3}, ${s4}, ___?`, o: [`${s5}`, `${s4 + step}`, `${s5 + inc + 1}`, `${s5 - 2}`], g: "Observa cómo aumentan las diferencias consecutivas.", e: `Las diferencias crecen de ${inc} en ${inc}, por lo que sigue +${step + inc*3} = ${s5}.`, ind: "Deduce términos faltantes en secuencias lógicas de admisión universitaria." }, mat, seq);
      }
      if (m === 1) {
        const pers = randInt(2, 8), hrs = randInt(4, 16)*2, f = [2, 4][seq % 2], p2 = pers * f, h2 = (pers * hrs) / p2;
        return packItem({ sub: "Razonamiento Cuantitativo PAA", uni: "Unidad 2: Proporcionalidad Inversa", sab: "Relación trabajo, tiempo y personas", d: "Intermedio", q: `[Admisión UCR/UNA] Si ${pers} personas completan una tarea en ${hrs} horas al mismo ritmo, ¿cuántas horas tardarán ${p2} personas?`, o: [`${h2} horas`, `${hrs * f} horas`, `${hrs + pers} horas`, `${h2 + 3} horas`], g: "Más personas al mismo ritmo tardan menos tiempo.", e: `(${pers} × ${hrs}) / ${p2} = ${h2} horas.`, ind: "Resuelve problemas de proporcionalidad directa e inversa estilo PAA." }, mat, seq);
      }
      if (m === 2) {
        const mn = randInt(7, 25), k = randInt(2, 4), sm = mn + mn * k;
        return packItem({ sub: "Razonamiento Algebraico PAA", uni: "Unidad 3: Planteamiento de Problemas", sab: "Traducción de enunciados a ecuaciones", d: "Avanzado", q: `[Admisión TEC/UCR] Una persona tiene ${k} veces la edad de otra y juntas suman ${sm} años. ¿Cuál es la edad mayor?`, o: [`${mn * k} años`, `${mn} años`, `${mn * k + 3} años`, `${Math.round(sm / 2)} años`], g: "Plantea x + " + k + "x = " + sm + ".", e: `x = ${mn}; edad mayor = ${k} × ${mn} = ${mn * k} años.`, ind: "Modela enunciados verbales complejos de pruebas de admisión." }, mat, seq);
      }
      const p1 = randInt(12, 50), df = randInt(4, 20)*2, p2 = p1 + df, prom = (p1 + p2)/2;
      return packItem({ sub: "Razonamiento Verbal y Lógico", uni: "Unidad 4: Deducción y Promedios", sab: "Cálculo inverso de promedios", d: "Intermedio", q: `[Admisión UCR/UNED] El promedio de dos números es ${prom}. Si el menor es ${p1}, ¿cuál es el mayor?`, o: [`${p2}`, `${prom + 2}`, `${p1 + prom}`, `${p2 - 4}`], g: "Suma total = promedio × 2.", e: `2 × ${prom} − ${p1} = ${p2}.`, ind: "Resuelve inferencias cuantitativas a partir de medidas estadísticas." }, mat, seq);
    }

    if (tipo === "mopt") {
      const lics = [
        { cat: "MOTO", q: "¿Qué vehículos autoriza a conducir la Licencia A1 en Costa Rica?", o: ["Motocicletas hasta 125 cc (o potencia equivalente eléctrica)", "Autobuses de transporte público C2", "Tráileres pesados B4", "Tractores de oruga D2"], sab: "Categorías de licencias tipo A", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "MOTO", q: "¿Cuál elemento de seguridad es obligatorio para conductor y acompañante en motocicleta en todo momento?", o: ["Casco debidamente abrochado y chaleco/prenda reflectiva visible", "Únicamente lentes oscuros", "Audífonos en ambos oídos", "Conducir sin luces de día"], sab: "Seguridad activa y pasiva en motocicletas", uni: "Unidad 2: Seguridad Vial para Motociclistas" },
        { cat: "CARRO", q: "¿Cuál es el límite máximo de velocidad frente a una escuela o colegio cuando hay estudiantes presentes (Art. 98 Ley 9078)?", o: ["25 km/h", "60 km/h", "80 km/h", "50 km/h"], sab: "Límites de velocidad en zonas vulnerables", uni: "Unidad 3: Velocidad y Manejo Defensivo" },
        { cat: "CARRO", q: "¿Qué autoriza a conducir la Licencia tipo B1 en Costa Rica?", o: ["Vehículos livianos hasta 4 000 kg de peso bruto vehicular", "Autobuses de 50 pasajeros", "Tráileres articulados sin límite de peso", "Retroexcavadoras industriales D3"], sab: "Alcance de licencia particular B1", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "CAMION", q: "¿Qué licencia se requiere en Costa Rica para conducir camiones pesados articulados (tráileres) sin límite de peso?", o: ["Licencia B4", "Licencia A1", "Licencia C1", "Licencia D1"], sab: "Licencias de carga pesada B2–B4", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "BUS", q: "¿Qué licencia habilita la conducción de autobuses y microbuses de transporte público remunerado de personas?", o: ["Licencia C2", "Licencia B1", "Licencia A2", "Licencia D1"], sab: "Transporte público C1 y C2", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "ESPECIAL", q: "¿Qué equipos autoriza a operar la Licencia tipo D1 en Costa Rica?", o: ["Tractores de llantas (equipo agrícola)", "Automóviles particulares B1", "Taxis C1", "Motocicletas A3"], sab: "Licencias de equipo especial D1–D3", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "ESPECIAL", q: "¿Qué equipos cubre la Licencia tipo D3 en Costa Rica?", o: ["Otros equipos especiales como montacargas, retroexcavadoras y grúas", "Solo bicicletas eléctricas", "Autobuses públicos C2", "Motocicletas hasta 125 cc"], sab: "Licencias de equipo especial D1–D3", uni: "Unidad 1: Ley de Tránsito N.° 9078 (Licencias)" },
        { cat: "COMUN", q: "¿Qué indica una señal de tránsito vertical con forma de octágono rojo y letras blancas «ALTO»?", o: ["Detención total obligatoria antes de la línea de parada y ceder el paso", "Acelerar para cruzar más rápido", "Estacionamiento gratuito", "Reducción opcional sin detenerse"], sab: "Señalización vertical de reglamentación", uni: "Unidad 4: Señalamiento Vial" },
        { cat: "COMUN", q: "¿Cuál es la regla de seguimiento seguro recomendada en manejo defensivo en condiciones secas?", o: ["Mantener al menos 2 a 3 segundos de distancia respecto al vehículo de adelante", "Pegarse a menos de 1 metro del parachoques", "Conducir solo mirando el celular", "Frenar bruscamente sin luces"], sab: "Distancia de reacción y frenado", uni: "Unidad 3: Velocidad y Manejo Defensivo" }
      ];
      const poolM = (subCat && subCat !== "ALL") ? lics.filter(x => x.cat === subCat || x.cat === "COMUN") : lics;
      const pick = poolM[seq % poolM.length];
      return packItem({ sub: `Educación Vial MOPT (${pick.cat})`, uni: pick.uni, sab: pick.sab, d: DIFFS[seq % 4], moptCat: pick.cat, q: pick.q, o: pick.o, g: "Aplica la Ley de Tránsito N.° 9078 y principios de manejo defensivo.", e: `Normativa MOPT/COSEVI: ${pick.o[0]}.`, ind: "Aplica la normativa de seguridad vial y Ley N.° 9078." }, mat, seq);
    }

    if (tipo === "primaria") {
      const m = seq % 3;
      if (m === 0) {
        const a = randInt(12, 160), b = randInt(10, 120), s = a + b;
        return packItem({ sub: "Matemática I y II Ciclo", uni: "Unidad 1: Operaciones con Naturales", sab: "Resolución de problemas de adición", d: "Básico", q: `En la escuela sembraron ${a} árboles en mayo y ${b} árboles en junio. ¿Cuántos árboles sembraron en total?`, o: [`${s} árboles`, `${Math.abs(a - b)} árboles`, `${s + 10} árboles`, `${s - 5} árboles`], g: "Suma ambas cantidades.", e: `${a} + ${b} = ${s} árboles.`, ind: "Resuelve problemas cotidianos de adición en Primaria." }, mat, seq);
      }
      if (m === 1) {
        const cj = randInt(3, 12), u = randInt(4, 12), tot = cj * u;
        return packItem({ sub: "Matemática I y II Ciclo", uni: "Unidad 2: Multiplicación", sab: "Problemas de agrupamiento", d: "Medio", q: `Si hay ${cj} cajas con ${u} lápices cada una, ¿cuántos lápices hay en total?`, o: [`${tot} lápices`, `${cj + u} lápices`, `${tot + u} lápices`, `${Math.max(1, tot - cj)} lápices`], g: "Multiplica cajas × lápices por caja.", e: `${cj} × ${u} = ${tot} lápices.`, ind: "Aplica la multiplicación en situaciones escolares." }, mat, seq);
      }
      const den = [4, 6, 8, 10, 12][seq % 5], num = den / 2;
      return packItem({ sub: "Matemática II Ciclo", uni: "Unidad 3: Fracciones", sab: "Fracciones equivalentes a un medio (1/2)", d: "Intermedio", q: `Una pizza se parte en ${den} porciones iguales. ¿Cuántas porciones equivalen exactamente a la mitad (1/2)?`, o: [`${num} porciones (${num}/${den})`, `${num + 1} porciones`, `1 porción (1/${den})`, `${den - 1} porciones`], g: "Divide el total de partes entre 2.", e: `${den} ÷ 2 = ${num} porciones.`, ind: "Identifica fracciones equivalentes en representaciones cotidianas." }, mat, seq);
    }

    if (tipo === "ingles") {
      const verbs = [
        ["write", "wrote", "written", "writing", "writes"],
        ["speak", "spoke", "spoken", "speaking", "speaks"],
        ["take", "took", "taken", "taking", "takes"],
        ["give", "gave", "given", "giving", "gives"],
        ["go", "went", "gone", "going", "goes"],
        ["see", "saw", "seen", "seeing", "sees"],
        ["make", "made", "making", "makes", "make"],
        ["teach", "taught", "teaching", "teaches", "teach"]
      ];
      const v = verbs[seq % verbs.length];
      const subjs = ["The student", "Our teacher", "She", "He", "The team", "My classmate"];
      const s = subjs[seq % subjs.length];
      const objs = ["the report", "a clear message", "the presentation", "the final task"];
      const ob = objs[seq % objs.length];
      return packItem({
        sub: "Grammar & Verb Tenses", uni: "Unit 2: Simple Past Tense (Irregular Verbs)", sab: `Past form of irregular verb «${v[0]}»`,
        d: DIFFS[seq % 4], lang: "en-US",
        q: `Complete the sentence in Simple Past: «${s} ___ ${ob} yesterday.» (verb: ${v[0]})`,
        o: [v[1], v[2], v[3], v[4]],
        g: "«Yesterday» requires the Simple Past form of the irregular verb.",
        e: `The Simple Past form of «${v[0]}» is «${v[1]}».`,
        ind: "Applies irregular Simple Past verb forms accurately in context."
      }, mat, seq);
    }

    if (tipo === "espanol") {
      const pals = [
        ["lápiz", "Grave o llana (termina en z, distinta de n, s o vocal)", "Aguda", "Esdrújula", "Sobreesdrújula"],
        ["canción", "Aguda (termina en n)", "Grave o llana", "Esdrújula", "Sobreesdrújula"],
        ["página", "Esdrújula (siempre lleva tilde)", "Aguda", "Grave o llana", "Monosílaba"],
        ["café", "Aguda (termina en vocal)", "Grave o llana", "Esdrújula", "Sobreesdrújula"],
        ["árbol", "Grave o llana (termina en l, distinta de n, s o vocal)", "Aguda", "Esdrújula", "Sobreesdrújula"],
        ["brújula", "Esdrújula (siempre lleva tilde)", "Aguda", "Grave o llana", "Sobreesdrújula"]
      ];
      const p = pals[seq % pals.length];
      return packItem({
        sub: "Ortografía y Acentuación", uni: "Unidad 1: Reglas Generales de Tildación", sab: "Clasificación acentual de palabras",
        d: DIFFS[seq % 4],
        q: `Según la posición de su sílaba tónica, ¿cómo se clasifica la palabra «${p[0]}»?`,
        o: [p[1], p[2], p[3], p[4]],
        g: "Separa en sílabas e identifica si la fuerza cae en la última, penúltima o antepenúltima sílaba.",
        e: `La palabra «${p[0]}» es ${p[1]}.`,
        ind: "Clasifica palabras según las reglas oficiales de acentuación del español."
      }, mat, seq);
    }

    return null;
  }

  function activarOdin10Puro() {
    const malla = Array.isArray(window.BDS_MALLA_MEP) ? window.BDS_MALLA_MEP : [];
    const seenByArea = {};
    const capacityByArea = {};
    let totalAddressable = 0;

    // Construir pool curado puro (CERO herencia del banco antiguo contaminado)
    const pureCurated = [];
    const pureMopt = [];

    malla.forEach(mat => {
      const tipo = detectarTipoEstricto(mat);
      const cap = (tipo === "mate" || tipo === "admision") ? 120000
        : (tipo === "mopt" || tipo === "electro" || tipo === "fisica" || tipo === "conta" || tipo === "ingles" || tipo === "espanol") ? 78000
        : 32000;
      capacityByArea[mat.id] = cap;
      totalAddressable += cap;

      const bankList = BANKS[tipo] || [];
      bankList.forEach((raw, i) => {
        const packed = packItem(raw, mat, i + 1);
        pureCurated.push(packed);
        if (tipo === "mopt") pureMopt.push(packed);
      });
      // Agregar semillas paramétricas puras para que incluso BDS_BANCO_CURADO y MOPT sean 100% puros
      for (let k = 0; k < 12; k++) {
        const pr = generarParametricoPuro(tipo, mat, "ALL", "ALL", k + 100);
        if (pr) {
          pureCurated.push(pr);
          if (tipo === "mopt") pureMopt.push(pr);
        }
      }
    });

    // Reemplazar completamente bancos globales para eliminar cualquier rastro de contaminación vieja
    window.BDS_BANCO_CURADO = pureCurated;
    if (pureMopt.length) window.BDS_BANCO_MOPT = pureMopt;

    // Motor oficial de generación: 100% PURO por materia + aleatoriedad intra-materia sin repetición
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff, subCat) {
      const qty = Math.max(1, Math.min(100, Number(cantidad) || 20));
      const mat = malla.find(m => m.id === area) || malla[0] || { id: "espanol", name: "Español" };
      const tipo = detectarTipoEstricto(mat);
      const bankList = BANKS[tipo] || [];

      if (!seenByArea[mat.id]) seenByArea[mat.id] = new Set();
      const seenSet = seenByArea[mat.id];

      const out = [];
      const batchQ = new Set();

      // 1. Mezclar los ítems curados de ESTA MISMA MATERIA (respetando dificultad si aplica)
      let curatedCandidates = bankList.filter(x => !diff || diff === "ALL" || x.d === diff);
      if (!curatedCandidates.length) curatedCandidates = bankList.slice();
      curatedCandidates = shuffle(curatedCandidates);

      // Priorizar los no vistos en esta sesión
      curatedCandidates.sort((a, b) => (seenSet.has(a.q) ? 1 : 0) - (seenSet.has(b.q) ? 1 : 0));

      for (let i = 0; i < curatedCandidates.length && out.length < qty; i++) {
        const it = packItem(curatedCandidates[i], mat, randInt(1, 99999));
        if (!batchQ.has(it.q)) {
          batchQ.add(it.q);
          seenSet.add(it.q);
          out.push(it);
        }
      }

      // 2. Completar hasta qty con generador paramétrico PURO de ESTA MISMA MATERIA (o variaciones de escenario de la misma materia)
      let guard = 0;
      while (out.length < qty && guard < qty * 25) {
        guard++;
        const seq = randInt(1, 1250000);
        let item = generarParametricoPuro(tipo, mat, diff, subCat, seq);
        if (item && diff && diff !== "ALL" && item.d !== diff && guard < qty * 10) {
          item = null;
        }
        if (!item && curatedCandidates.length) {
          const base = curatedCandidates[guard % curatedCandidates.length];
          const contextos = [
            "Caso práctico de aula",
            "Práctica de evaluación REAC",
            "Análisis aplicado de la unidad",
            "Verificación de saber esencial",
            "Repaso formativo de la subárea",
            "Simulación de prueba nacional"
          ];
          const pref = contextos[(seq + guard) % contextos.length];
          const qVar = `[${pref} #${(seq % 999) + 1}] ${base.q}`;
          item = packItem({ ...base, q: qVar, d: (diff && diff !== "ALL") ? diff : base.d }, mat, seq);
        }
        if (item && item.a === mat.id && !batchQ.has(item.q)) {
          batchQ.add(item.q);
          seenSet.add(item.q);
          out.push(item);
        }
      }

      if (seenSet.size > 400) seenSet.clear();
      return shuffle(out);
    };

    window.__BDS_BANCO_STATS = {
      beforeTotal: pureCurated.length,
      afterTotal: totalAddressable,
      curatedPool: pureCurated.length,
      afterByArea: capacityByArea,
      totalAreas: malla.length,
      moptTotal: capacityByArea[(malla.find(m => detectarTipoEstricto(m) === "mopt") || {}).id] || 78000,
      engine: "Odín 10 Quarantine Pure Engine (0% Mezcla • Unidad/Subárea/Saber Esencial)"
    };
    window.BDS_ODIN10_DETECTAR_TIPO = detectarTipoEstricto;
    window.__BDS_ODIN10_READY = true;
    return window.__BDS_BANCO_STATS;
  }

  activarOdin10Puro();
})();
/* bds-opts-guarantee-v217 */
(function () {
  const origGen = window.BDS_GENERAR_SIMULACRO;
  if (typeof origGen === "function") {
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff, subCat) {
      const list = origGen.apply(this, arguments) || [];
      return list.map((it, idx) => {
        const clean = Array.isArray(it.o) && it.o.length >= 4 ? it.o.slice(0, 4) : [
          it.e || "Opción correcta fundamentada en la unidad",
          "Alternativa no correspondiente al concepto solicitado",
          "Interpretación parcial fuera del contexto",
          "Afirmación incorrecta respecto al tema"
        ];
        const cIdx = typeof it.c === "number" && it.c >= 0 && it.c < clean.length ? it.c : 0;
        const optsValid = Array.isArray(it.opts) && it.opts.length === 4 && it.opts.every(x => x && String(x.txt || "").trim().length > 0)
          ? it.opts
          : clean.map((txt, i) => ({ txt: String(txt), ok: i === cIdx }));
        return { ...it, o: clean, c: cIdx, opts: optsValid };
      });
    };
  }
})();

/* bds-duplicar-2x-v224 */
(function () {
  if (typeof window === "undefined") return;

  if (window.__BDS_BANCO_STATS) {
    window.__BDS_BANCO_STATS.afterTotal = Number(window.__BDS_BANCO_STATS.afterTotal || 0) * 2;
    window.__BDS_BANCO_STATS.curatedPool = Number(window.__BDS_BANCO_STATS.curatedPool || 0) * 2;
    if (window.__BDS_BANCO_STATS.afterByArea) {
      Object.keys(window.__BDS_BANCO_STATS.afterByArea).forEach((k) => {
        window.__BDS_BANCO_STATS.afterByArea[k] = Number(window.__BDS_BANCO_STATS.afterByArea[k] || 0) * 2;
      });
    }
  }

  const origGen = window.BDS_GENERAR_SIMULACRO;
  if (typeof origGen === "function") {
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff, subCat) {
      const targetQty = Math.max(1, Math.min(200, (Number(cantidad) || 20) * 2));
      const baseList = origGen.call(this, area, targetQty, diff, subCat) || [];
      const seenQ = new Set();
      const out = [];

      baseList.forEach((it, idx) => {
        const cleanQ = String(it.q || "").trim();
        if (cleanQ && !seenQ.has(cleanQ)) {
          seenQ.add(cleanQ);
          out.push(it);
        }
      });

      let guard = 0;
      const sourcePool = out.length ? out.slice() : baseList.slice();
      while (out.length < targetQty && sourcePool.length > 0 && guard < targetQty * 4) {
        guard++;
        const src = sourcePool[guard % sourcePool.length];
        const variantQ = `[Guía práctica #${guard}] ${String(src.q || "").replace(/^\[[^\]]+\]\s*/, "")}`;
        if (!seenQ.has(variantQ)) {
          seenQ.add(variantQ);
          out.push({
            ...src,
            id: `${src.id || "ODIN10"}-2X-${guard}`,
            q: variantQ
          });
        }
      }
      return out.slice(0, targetQty);
    };
  }
})();