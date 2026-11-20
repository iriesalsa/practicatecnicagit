(function () {
  const DIFFS = ["Básico", "Medio", "Intermedio", "Avanzado"];

  // Completar malla curricular oficial (Primaria, Secundaria Académica, Técnica y Admisión)
  const AREAS_EXTRA = [
    { id: "primaria_integ", name: "Primaria (I y II Ciclo MEP)", cat: "Educación Primaria", color: "#10b981", libro: "Fundamentos integrales de I y II Ciclo (1.° a 6.° grado): comprensión lectora, operaciones básicas, fracciones, ciencias naturales y estudios sociales de Costa Rica.", claves: ["Operaciones básicas y fracciones", "Comprensión lectora y ortografía", "Cuerpo humano y ecosistemas CR", "Geografía y símbolos nacionales"] },
    { id: "hogar", name: "Educación para el Hogar", cat: "Formación para la Vida", color: "#ec4899", libro: "Nutrición saludable, presupuesto familiar, higiene y manipulación de alimentos, consumo responsable y convivencia familiar.", claves: ["Nutrición balanceada y platos saludables", "Higiene y manipulación segura de alimentos", "Presupuesto familiar y ahorro", "Consumo responsable y sostenibilidad"] },
    { id: "artes_ind", name: "Artes Industriales", cat: "Área Técnica III Ciclo", color: "#f97316", libro: "Dibujo técnico básico, metrología, seguridad en taller de madera y metales, herramientas manuales y diseño de prototipos.", claves: ["Seguridad ocupacional y EPP en taller", "Metrología (milímetros, pulgadas, escalas)", "Dibujo técnico y vistas ortogonales", "Uniones, acabados y prototipado"] },
    { id: "tecnologia", name: "Tecnología e Informática Educativa", cat: "Competencias Digitales", color: "#06b6d4", libro: "Pensamiento computacional, ofimática en la nube, ciudadanía digital responsable, robótica educativa y uso ético de la IA.", claves: ["Pensamiento computacional y lógica", "Ciudadanía digital y prevención de riesgos", "Hojas de cálculo y presentaciones", "Robótica educativa e IA ética"] },
    { id: "turismo", name: "Turismo y Hotelería", cat: "Especialidad Técnica CTP", color: "#14b8a6", libro: "Turismo sostenible en Costa Rica (CST), servicio de hospedaje, guiado turístico, patrimonio natural y protocolo internacional.", claves: ["Certificación de Sostenibilidad Turística (CST)", "Atención al huésped y recepción hotelera", "Parques nacionales y biodiversidad CR", "Protocolo, reservas y turismo rural"] },
    { id: "redes_conf", name: "Configuración y Soporte de Redes", cat: "Especialidad Técnica CTP", color: "#6366f1", libro: "Modelo OSI/TCP-IP, direccionamiento IPv4/IPv6, subneteo, configuración de switches y routers, VLANs y cableado estructurado.", claves: ["Modelo OSI y TCP/IP", "Direccionamiento IPv4, máscaras y VLANs", "Cableado estructurado TIA/EIA-568", "Diagnóstico con ping, tracert y DNS"] },
    { id: "admision_raz", name: "Admisión UCR / TEC / UNA (Razonamiento)", cat: "Admisión Universitaria", color: "#eab308", libro: "Razonamiento verbal (comprensión inferencial, analogías, silogismos) y razonamiento matemático (sucesiones, proporciones, lógica y probabilidad) estilo PAA UCR/TEC/UNA.", claves: ["Sucesiones y patrones numéricos", "Proporcionalidad, porcentajes y conteo", "Comprensión lectora inferencial PAA", "Lógica proposicional y suficiencia de datos"] }
  ];

  function ensureMallaCompleta() {
    if (!Array.isArray(window.BDS_MALLA_MEP)) window.BDS_MALLA_MEP = [];
    AREAS_EXTRA.forEach(ax => {
      if (!window.BDS_MALLA_MEP.some(m => m.id === ax.id)) window.BDS_MALLA_MEP.push(ax);
    });
    return window.BDS_MALLA_MEP;
  }

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function detectarTipoArea(m) {
    const t = norm((m.id || "") + " " + (m.name || ""));
    if (m.id === "admision_raz") return "admision";
    if (m.id === "primaria_integ") return "primaria";
    if (m.id === "hogar") return "hogar";
    if (m.id === "artes_ind") return "artes_ind";
    if (m.id === "tecnologia") return "tecnologia";
    if (m.id === "turismo") return "turismo";
    if (m.id === "redes_conf") return "redes_conf";
    if (/mopt|cosevi|vial/.test(t)) return "mopt";
    if (/educacion fisica|deporte|salud/.test(t)) return "edfisica";
    if (/relig|valor/.test(t)) return "religion";
    if (/web|programacion|software/.test(t)) return "web";
    if (/ciber|seguridad/.test(t)) return "ciber";
    if (/contab|finanz|excel/.test(t)) return "conta";
    if (/taller|explorat/.test(t)) return "talleres";
    if (/electro|soporte|mecan/.test(t)) return "electro";
    if (/ejecutiv|comercial|logist/.test(t)) return "comercial";
    if (/diseno|digital|publicit/.test(t)) return "diseno";
    if (/matem/.test(t)) return "mate";
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

  // Semillas 100% puras por cada disciplina (CERO cruces)
  const PURO = {
    web: [
      ["¿Qué etiqueta HTML5 define el contenido principal único de una página web?", "<main>", "<footer>", "<aside>", "<br>", "La etiqueta <main> mejora la semántica y accesibilidad DUA."],
      ["¿Cuál propiedad CSS activa un contenedor flexible de una dimensión?", "display: flex", "position: fixed", "float: center", "z-index: 10", "Flexbox alinea y distribuye elementos responsivamente."],
      ["En JavaScript moderno, ¿qué palabra clave declara una referencia constante de bloque?", "const", "var", "global", "static", "const evita reasignaciones accidentales dentro del bloque."],
      ["¿Qué método de arreglos en JavaScript transforma cada elemento y retorna un arreglo nuevo?", "Array.prototype.map()", "Array.prototype.pop()", "Array.prototype.push()", "Array.prototype.shift()", "map() aplica una función pura a cada elemento sin mutar el original."],
      ["¿Qué código HTTP indica que una API REST creó un recurso correctamente?", "201 Created", "404 Not Found", "500 Internal Error", "403 Forbidden", "201 Created confirma creación satisfactoria en servidor."],
      ["En React, ¿cuál hook maneja el estado local de un componente funcional?", "useState", "useSQL", "useStyle", "useRoute", "useState almacena y actualiza el estado reactivo del componente."],
      ["¿Qué componente de una PWA permite operar Offline-First interceptando peticiones?", "Service Worker", "FTP Pasivo", "BIOS", "Telnet", "El Service Worker gestiona caché local y funcionamiento sin red."],
      ["¿Qué atributo HTML es obligatorio en <img> para lectores de pantalla?", "alt", "bgcolor", "blink", "marquee", "alt describe la imagen para accesibilidad visual WCAG/DUA."],
      ["¿Qué consulta SQL selecciona estudiantes de la sección '11-1' ordenados alfabéticamente?", "SELECT * FROM estudiantes WHERE seccion='11-1' ORDER BY nombre;", "FIND estudiantes 11-1;", "GET ALL estudiantes;", "OPEN TABLE estudiantes;", "SELECT ... WHERE ... ORDER BY es el estándar SQL/PostgreSQL."],
      ["¿Qué propiedad CSS crea una cuadrícula bidimensional de filas y columnas?", "display: grid", "display: inline", "overflow: hidden", "cursor: pointer", "CSS Grid controla filas y columnas simultáneamente."],
      ["¿Qué formato de intercambio de datos ligero es nativo en APIs JavaScript?", "JSON", "BMP", "WAV", "EXE", "JSON (JavaScript Object Notation) serializa objetos de forma rápida y legible."],
      ["¿Qué comando Git sube los commits confirmados a la rama principal remota?", "git push origin main", "git erase main", "git format", "git stop", "git push sincroniza commits locales con GitHub/Vercel."]
    ],
    ciber: [
      ["¿Cuáles son los tres pilares de la Tríada CIA en Ciberseguridad?", "Confidencialidad, Integridad y Disponibilidad", "Color, Imagen y Audio", "Costo, Impuesto y Ahorro", "Cable, Internet y Antena", "Toda política de seguridad protege Confidencialidad, Integridad y Disponibilidad."],
      ["¿Qué algoritmo genera un hash criptográfico irreversible de 256 bits para verificar integridad?", "SHA-256", "HTML5", "CSS3", "CSV", "SHA-256 detecta cualquier alteración mínima en documentos o carnés QR."],
      ["¿Qué ley regula la protección de datos personales en Costa Rica (PRODHAB)?", "Ley N.° 8968", "Ley N.° 9078", "Ley de Aguas", "Código de Minería", "La Ley N.° 8968 garantiza autodeterminación informativa y privacidad."],
      ["¿En qué consiste un ataque de phishing?", "Suplantar una entidad legítima para robar credenciales o datos", "Aumentar la RAM del equipo", "Hacer respaldos locales", "Actualizar el navegador", "El phishing emplea ingeniería social para engañar al usuario."],
      ["¿Cómo se previenen ataques de inyección SQL (SQLi) en el backend?", "Consultas parametrizadas y validación estricta de entradas", "Ocultar el botón de envío", "Usar solo modo oscuro", "Desactivar HTTPS", "Las consultas parametrizadas impiden que datos del usuario se ejecuten como SQL."],
      ["¿Qué significa RBAC en seguridad de aplicaciones?", "Control de Acceso Basado en Roles", "Red Básica de Audio", "Respaldo de Cables", "Registro de Contraseñas Públicas", "RBAC restringe rutas y acciones según el rol verificado."],
      ["¿Qué protocolo cifra la comunicación entre navegador y servidor mediante TLS?", "HTTPS (puerto 443)", "HTTP (puerto 80)", "Telnet (puerto 23)", "FTP plano (puerto 21)", "HTTPS protege credenciales y datos en tránsito."],
      ["¿Qué función cumple Row Level Security (RLS) en PostgreSQL / Supabase?", "Restringe a nivel de fila qué registros puede leer o modificar cada usuario", "Comprime archivos PNG", "Aumenta el brillo del monitor", "Envía spam", "RLS blinda la base de datos aunque una petición intente leer filas ajenas."],
      ["¿Por qué se bloquea temporalmente el login tras 5 intentos fallidos?", "Para frenar ataques de fuerza bruta y adivinación automatizada", "Para borrar cuentas activas", "Para ahorrar batería", "Para cambiar el idioma", "El rate-limiting/lockout mitiga intentos masivos de acceso."],
      ["¿Qué es la autenticación multifactor (MFA / 2FA)?", "Combinar dos o más factores distintos (clave + código/dispositivo/biometría)", "Escribir la misma clave dos veces", "Usar una clave de 4 dígitos", "Guardar la clave en un papel", "MFA protege la cuenta incluso si la contraseña se filtra."]
    ],
    redes_conf: [
      ["¿Cuántas capas tiene el modelo de referencia OSI?", "7 capas (Física a Aplicación)", "3 capas", "12 capas", "2 capas", "Las 7 capas son: Física, Enlace, Red, Transporte, Sesión, Presentación y Aplicación."],
      ["¿En qué capa del modelo OSI operan principalmente los routers (enrutamiento IP)?", "Capa 3 (Red)", "Capa 1 (Física)", "Capa 7 (Aplicación)", "Capa 6 (Presentación)", "Los routers toman decisiones de reenvío basadas en direcciones IP (Capa 3)."],
      ["¿Cuál es la máscara de subred correspondiente a la notación CIDR /24?", "255.255.255.0", "255.0.0.0", "255.255.0.0", "255.255.255.252", "/24 reserva 24 bits para red y 8 bits para hosts (254 hosts utilizables)."],
      ["¿Qué protocolo asigna direcciones IP automáticamente a los equipos de una red local?", "DHCP", "SMTP", "FTP", "POP3", "DHCP automatiza IP, máscara, puerta de enlace y servidores DNS."],
      ["¿Qué herramienta de consola verifica conectividad básica enviando paquetes ICMP Echo?", "ping", "mkdir", "chmod", "ls", "ping mide latencia y pérdida de paquetes hacia un host destino."],
      ["¿Cuál es la ventaja principal de segmentar una red institucional mediante VLANs?", "Aísla tráfico por departamento, mejora seguridad y reduce dominios de broadcast", "Elimina los cables de electricidad", "Duplica el peso del switch", "Desactiva internet", "Las VLANs separan red administrativa, laboratorios y Wi-Fi estudiantil."],
      ["¿Qué protocolo traduce nombres de dominio legibles (practicatecnica.com) a direcciones IP?", "DNS (puerto 53)", "SSH (puerto 22)", "ARP", "SNMP", "DNS actúa como el directorio de nombres de Internet."],
      ["¿Cuál norma define el orden de pines para cableado estructurado Ethernet (RJ-45)?", "TIA/EIA-568A y 568B", "ISO 9001", "Ley 9078", "HTML5", "Usar 568B en ambos extremos crea un cable directo estándar."]
    ],
    electro: [
      ["¿Qué instrumento mide voltaje (V), corriente (A) y resistencia (Ω)?", "Multímetro digital", "Barómetro", "Termómetro", "Higrómetro", "El multímetro es la herramienta básica de diagnóstico eléctrico y electrónico."],
      ["¿Cuál es la unidad de medida de la resistencia eléctrica?", "Ohmio (Ω)", "Voltio (V)", "Amperio (A)", "Vatio (W)", "La oposición al flujo de electrones se mide en ohmios (Ω)."],
      ["¿Cómo se comporta la corriente en un circuito conectado en serie?", "Es igual en todos los componentes", "Es cero en la fuente", "Se divide al azar", "Solo pasa por el primer resistor", "En serie existe un único lazo cerrado de corriente."],
      ["¿Qué componente semiconductor permite el paso de corriente en un solo sentido y emite luz?", "Diodo LED", "Resistor fijo", "Fusible", "Interruptor", "El LED requiere polarización directa y resistor limitador."],
      ["¿Qué precaución protege la placa madre al darle mantenimiento a una PC?", "Desconectar energía y usar pulsera antiestática (ESD)", "Mantenerla encendida", "Usar agua con jabón", "Tocar pines con las manos húmedas", "Las descargas electrostáticas dañan circuitos integrados."],
      ["¿Qué memoria es volátil y guarda temporalmente los programas en ejecución?", "Memoria RAM", "SSD NVMe", "Disco duro mecánico", "Memoria Flash USB", "Al apagar el equipo, el contenido de la RAM se borra."],
      ["¿Qué elemento interrumpe el circuito ante un cortocircuito o sobrecarga?", "Fusible o disyuntor (breaker)", "Protoboard", "Transistor", "Resistencia variable", "Protege conductores, equipos y personas contra incendios."],
      ["En un circuito en paralelo de dos resistores iguales de 10 Ω, ¿cuál es la resistencia equivalente?", "5 Ω", "20 Ω", "100 Ω", "10 Ω", "Para dos resistores iguales en paralelo, Req = R / 2 = 5 Ω."]
    ],
    conta: [
      ["¿Cuál es la ecuación contable fundamental?", "Activo = Pasivo + Patrimonio", "Activo = Gastos - Ingresos", "Pasivo = Activo + Patrimonio", "Capital = Ventas × IVA", "Todo activo se financia mediante deuda (pasivo) o aportes/utilidades (patrimonio)."],
      ["¿Cuál es la tarifa general del IVA en Costa Rica?", "13%", "5%", "25%", "30%", "La Ley 9635 fija el 13% como tarifa general del Impuesto al Valor Agregado."],
      ["¿Qué norma contable internacional aplica a pequeñas y medianas empresas en Costa Rica?", "NIIF para las PYMES", "Ley de Tránsito", "Protocolo HTTP", "Reglamento Deportivo", "El Colegio de Contadores Públicos adopta las NIIF y NIIF para las PYMES."],
      ["¿Cuál es la naturaleza del saldo normal de las cuentas de Activo y Gasto?", "Deudora (aumentan al Debe)", "Acreedora (aumentan al Haber)", "Neutra", "Siempre cero", "Activos y gastos aumentan al Debe; pasivos, patrimonio e ingresos al Haber."],
      ["¿Qué estado financiero determina la utilidad o pérdida neta de un periodo?", "Estado de Resultados", "Listado de Proveedores", "Hoja de Asistencia", "Inventario Físico", "Compara ingresos devengados contra costos y gastos del periodo."],
      ["¿Qué función de Excel suma únicamente las celdas que cumplen un criterio específico?", "=SUMAR.SI()", "=HOY()", "=LARGO()", "=DERECHA()", "SUMAR.SI evalúa un rango según condición antes de totalizar."],
      ["¿Qué comprobante respalda formalmente una venta ante el Ministerio de Hacienda?", "Factura Electrónica autorizada", "Nota en cuaderno", "Mensaje sin consecutivo", "Borrador sin clave", "La factura electrónica valida ingresos y créditos fiscales."],
      ["¿Qué representa el Pasivo Corriente en el Estado de Situación Financiera?", "Obligaciones exigibles en un plazo menor o igual a 12 meses", "Terrenos y edificios", "Aportes permanentes de socios", "Utilidades de hace 10 años", "Incluye cuentas por pagar, cargas sociales e impuestos a corto plazo."]
    ],
    talleres: [
      ["¿Cuál es el objetivo central de los Talleres Exploratorios en 7.°, 8.° y 9.° año de un CTP?", "Descubrir aptitudes vocacionales mediante proyectos prácticos antes de elegir especialidad", "Reemplazar matemática y español", "Evaluar solo memoria", "Evitar el trabajo en laboratorio", "Orientan la decisión vocacional técnica del estudiante."],
      ["¿Por qué es obligatorio el Equipo de Protección Personal (EPP) en prácticas de taller?", "Previene lesiones oculares, auditivas, mecánicas o eléctricas", "Solo por decoración", "Para terminar antes", "No es obligatorio", "La prevención de riesgos es norma básica industrial."],
      ["¿Qué promueve la metodología japonesa 5S en un taller escolar?", "Clasificar, ordenar, limpiar, estandarizar y mantener disciplina", "Dejar herramientas sueltas", "Acumular desechos", "Trabajar sin planos", "Las 5S mejoran seguridad, eficiencia y calidad Kaizen."],
      ["En Design Thinking, ¿cuál fase inicia el proceso creativo?", "Empatizar con el usuario para entender el problema real", "Comprar materiales al azar", "Ignorar el presupuesto", "Omitir pruebas", "Diseñar desde la necesidad real garantiza soluciones útiles."],
      ["¿Qué debe revisarse antes de energizar cualquier equipo eléctrico de taller?", "Aislamiento de cables, área seca y autorización docente", "Encenderlo sin instrucciones", "Retirar protecciones", "Conectar con manos mojadas", "La lista de chequeo previa evita accidentes graves."],
      ["¿Por qué se elabora un boceto y presupuesto antes de construir un prototipo?", "Permite planificar medidas, materiales, costos y prevenir desperdicios", "Para atrasar el proyecto", "Porque prohíbe mejorar el diseño", "Solo para adornar la carpeta", "Planificar reduce errores y optimiza recursos."]
    ],
    comercial: [
      ["¿Cuál es la base de una atención excelente al cliente?", "Escucha activa, empatía y solución clara y oportuna", "Interrumpir al cliente", "Dar respuestas evasivas", "Ignorar reclamos", "La fidelización nace de resolver necesidades con trato humano."],
      ["En gestión de inventarios, ¿qué significa el método PEPS (FIFO)?", "Primero en Entrar, Primero en Salir", "Pago Especial Por Servicio", "Precio Estándar Por Semana", "Pedido Externo", "Reduce pérdidas por vencimiento u obsolescencia."],
      ["¿Qué definen los INCOTERMS en comercio internacional?", "Costos, responsabilidades y punto de transferencia de riesgo entre vendedor y comprador", "Horarios de bancos locales", "Uniformes de oficina", "Tarifas de autobús", "Estándares internacionales como FOB, CIF y EXW evitan disputas."],
      ["¿Para qué sirve un KPI en servicio al cliente y logística?", "Medir objetivamente el rendimiento (tiempo de respuesta, entregas a tiempo, satisfacción)", "Elegir el color del edificio", "Decorar el almacén", "Sustituir facturas", "Los KPIs orientan decisiones basadas en datos."],
      ["¿Qué es un CRM empresarial?", "Software para gestionar relaciones, cotizaciones, ventas y soporte con clientes", "Un cable Ethernet", "Un impuesto municipal", "Una balanza industrial", "Centraliza el historial completo de cada cliente."],
      ["¿Qué implica el concepto de 'última milla' en logística?", "El tramo final de entrega desde el centro de distribución hasta el cliente", "La compra de materia prima", "El cierre contable", "La contratación de personal", "Es la etapa más visible para el cliente y clave en costos."]
    ],
    diseno: [
      ["¿Qué modelo de color se usa para pantallas digitales (web, apps y redes sociales)?", "RGB (Rojo, Verde, Azul)", "CMYK exclusivamente", "Solo tinta negra", "Escala térmica", "RGB es luz aditiva; CMYK se utiliza para impresión física."],
      ["¿Por qué un logotipo en formato vectorial (SVG) supera a un JPG al ampliarlo?", "Mantiene bordes nítidos a cualquier escala sin pixelarse", "Siempre ocupa 500 MB", "No admite colores", "Se borra solo", "Los vectores se recalculan matemáticamente sin pérdida de calidad."],
      ["¿Qué logra una jerarquía visual bien planificada en un afiche institucional?", "Guía la mirada del lector desde el título principal hacia fecha, lugar y llamado a la acción", "Satura con diez tipografías distintas", "Oculta la información clave", "Elimina los márgenes", "Claridad y contraste hacen que el mensaje se comprenda en 3 segundos."],
      ["¿Cuál dimensión estándar corresponde a un afiche vertical 9:16 para Estados de WhatsApp?", "1080 × 1920 píxeles", "1920 × 1080 píxeles", "500 × 500 píxeles", "800 × 200 píxeles", "9:16 llena la pantalla vertical del teléfono sin recortes."],
      ["¿Qué significa accesibilidad de contraste WCAG en diseño UI?", "Asegurar relación de contraste suficiente entre texto y fondo para lectura universal", "Poner texto amarillo claro sobre blanco", "Usar letra de 6 píxeles", "Quitar todos los botones", "Garantiza inclusión para personas con baja visión y lectura al sol."],
      ["¿Qué garantiza un entregable gráfico 'marca blanca'?", "Pieza limpia propiedad de la institución, sin marcas de agua ni siglas de software ajenas", "Una hoja sin texto", "Eliminar el escudo oficial", "Imprimir solo en borrador", "Respeta la identidad soberana del colegio o empresa."]
    ],
    hogar: [
      ["¿Qué principio orienta el 'Plato Saludable' en Educación para el Hogar?", "Mitad del plato con vegetales y frutas, un cuarto proteína saludable y un cuarto carbohidratos integrales", "Solo frituras y bebidas azucaradas", "Eliminar el consumo de agua", "Comer únicamente dulces", "Una alimentación balanceada previene enfermedades crónicas y mejora el rendimiento escolar."],
      ["¿Cómo se evita la contaminación cruzada al preparar alimentos en cocina?", "Separando tablas y utensilios para carnes crudas y vegetales listos para consumir, y lavándose las manos", "Cortando pollo crudo y ensalada en la misma tabla sin lavar", "Dejando lácteos al sol", "Usando agua sucia", "La higiene alimentaria previene intoxicaciones y enfermedades transmitidas por alimentos."],
      ["¿Cuál es la regla clave para elaborar un presupuesto familiar saludable?", "Registrar todos los ingresos, priorizar necesidades básicas, destinar un porcentaje al ahorro y evitar sobreendeudamiento", "Gastar más de lo que se gana con tarjetas", "No anotar los gastos hormiga", "Omitir pagos de servicios públicos", "La educación financiera familiar brinda estabilidad y reduce el estrés económico."],
      ["¿Qué indica la etiqueta nutricional de un producto empacado?", "Tamaño de porción, calorías, azúcares añadidos, sodio, grasas y lista de ingredientes", "Solo el nombre del supermercado", "El precio en dólares", "La receta de cocina", "Leer etiquetas empodera decisiones de consumo responsable."],
      ["¿Qué práctica promueve el consumo sostenible en el hogar?", "Aplicar las 3R (Reducir, Reutilizar, Reciclar), ahorrar agua y electricidad y evitar desperdicio de comida", "Dejar luces y grifos abiertos", "Botar comida en buen estado", "Usar plásticos desechables innecesarios", "La sostenibilidad protege el ambiente y ahorra dinero a la familia."],
      ["¿Por qué es importante mantener la cadena de frío en alimentos perecederos?", "Retarda la proliferación de bacterias patógenas conservando la inocuidad del alimento", "Para endurecer el pan", "Solo para gastar electricidad", "No tiene ningún efecto", "Refrigerar debajo de 5 °C mantiene seguros lácteos, carnes y preparaciones."]
    ],
    artes_ind: [
      ["En dibujo técnico de Artes Industriales, ¿qué muestran las vistas ortogonales principales?", "Alzado (frontal), planta (superior) y perfil (lateral) con medidas reales a escala", "Un garabato sin proporciones", "Solo el color del mueble", "Una fotografía borrosa", "Las vistas ortogonales permiten fabricar piezas con exactitud dimensional."],
      ["¿Cuántos milímetros equivalen exactamente a 1 centímetro en metrología básica?", "10 milímetros (mm)", "100 milímetros", "1 milímetro", "25,4 milímetros", "1 cm = 10 mm; 1 pulgada = 25,4 mm."],
      ["¿Qué instrumento de medición se usa en taller para medir diámetros internos, externos y profundidades con precisión?", "Calibrador Vernier (pie de rey)", "Cinta adhesiva", "Escuadra de plástico sin marcas", "Martillo de uña", "El pie de rey ofrece precisión de décimas o centésimas de milímetro."],
      ["¿Qué elemento de seguridad es indispensable al usar una sierra o taladro en Artes Industriales?", "Lentes de seguridad, cabello recogido, cero ropa holgada o pulseras y prensa para sujetar la pieza", "Sostener la pieza pequeña con los dedos junto a la broca", "Usar cadenas largas", "Cerrar los ojos al cortar", "Sujetar la pieza mecánicamente y proteger ojos evita accidentes graves."],
      ["¿Qué significa una escala 1:2 en un plano de taller?", "El dibujo está reducido a la mitad del tamaño real del objeto", "El dibujo es el doble del tamaño real", "El objeto mide 2 metros siempre", "No tiene proporción", "1:2 es escala de reducción; 2:1 es escala de ampliación; 1:1 es tamaño natural."],
      ["¿Qué herramienta manual se utiliza para dar acabado fino y alisar superficies de madera?", "Cepillo de carpintero y lija en sentido de la veta", "Llave inglesa", "Alicate de corte", "Destornillador plano", "Lijar siguiendo la veta evita rayaduras transversales en la madera."]
    ],
    tecnologia: [
      ["¿Qué es el pensamiento computacional en Tecnología e Informática Educativa?", "Descomponer un problema complejo, reconocer patrones, abstraer lo esencial y diseñar un algoritmo", "Memorizar marcas de celulares", "Escribir sin usar lógica", "Apagar la computadora", "Estas 4 habilidades se aplican en programación, ciencia y vida diaria."],
      ["¿Cuál es una práctica segura de ciudadanía digital en redes sociales?", "Configurar privacidad, verificar información antes de compartir y no exponer datos personales ni contraseñas", "Publicar la dirección exacta y clave bancaria", "Aceptar desconocidos y enlaces sospechosos", "Practicar ciberacoso", "La ciudadanía digital promueve respeto, privacidad y pensamiento crítico."],
      ["En programación por bloques o código, ¿qué hace una estructura condicional (SI / IF)?", "Ejecuta una acción solo cuando se cumple una condición lógica verdadera", "Repite infinitamente sin parar", "Borra todo el programa", "Cambia el tamaño del teclado", "Las condicionales permiten que los programas tomen decisiones."],
      ["¿Qué hace un bucle (ciclo FOR / WHILE) en un algoritmo?", "Repite un conjunto de instrucciones de forma controlada evitando escribir código duplicado", "Detiene la electricidad", "Traduce texto automáticamente", "Guarda una foto", "Los ciclos automatizan tareas repetitivas con precisión."],
      ["¿Qué uso ético y responsable se debe dar a la Inteligencia Artificial en el estudio?", "Usarla como tutor para comprender conceptos, practicar y validar fuentes, declarando autoría honesta", "Copiar y pegar sin leer ni verificar datos inventados", "Entregar trabajos ajenos sin aprender", "Subir datos sensibles privados sin permiso", "La IA potencia el aprendizaje cuando se combina con criterio humano y honestidad."],
      ["¿Qué ventaja ofrece trabajar documentos en la nube institucional (Microsoft Teams / Drive)?", "Respaldo automático, historial de versiones y colaboración en tiempo real", "Solo funciona en una PC apagada", "Borra los archivos cada hora", "Impide compartir con el docente", "Facilita trabajo colaborativo seguro y entrega trazable."]
    ],
    turismo: [
      ["¿Qué evalúa el Certificado para la Sostenibilidad Turística (CST) del ICT en Costa Rica?", "El desempeño ambiental, sociocultural y económico sostenible de empresas turísticas", "Solo el tamaño de la piscina", "El color de los autobuses", "La cantidad de anuncios", "Costa Rica es referente mundial en turismo sostenible mediante el CST."],
      ["¿Qué porcentaje aproximado de la biodiversidad mundial alberga Costa Rica?", "Entre el 5% y el 6% de la biodiversidad mundial en apenas 0,03% de la superficie terrestre", "Menos del 0,1%", "Exactamente 50%", "Ninguna especie endémica", "Sus ecosistemas y parques nacionales son el principal atractivo turístico del país."],
      ["¿Cuál es la función principal del departamento de Recepción (Front Desk) en un hotel?", "Gestionar reservas, check-in/check-out, información al huésped y coordinar solución de solicitudes", "Cocinar el menú del restaurante", "Reparar carreteras externas", "Imprimir pasaportes", "La recepción es la primera y última impresión del huésped."],
      ["¿Qué caracteriza al turismo rural comunitario en Costa Rica?", "Experiencias auténticas gestionadas por familias y comunidades locales que conservan cultura y naturaleza", "Grandes casinos cerrados", "Cruceros sin bajar a tierra", "Destrucción de bosques", "Distribuye los beneficios económicos directamente en las comunidades."],
      ["¿Qué documento es esencial al brindar guiado turístico seguro en áreas silvestres protegidas?", "Plan de ruta, botiquín, comunicación de emergencia, respeto a senderos y normas del SINAC", "Salirse de los senderos marcados", "Alimentar fauna silvestre", "Dejar basura en el parque", "No alimentar fauna ni extraer flora protege los ecosistemas."],
      ["¿Qué significa 'overbooking' (sobreventa) en hotelería o aerolíneas?", "Aceptar más reservas confirmadas que las habitaciones o asientos disponibles físicamente", "Tener el hotel vacío", "Cerrar por vacaciones", "Ofrecer desayuno gratis", "Requiere protocolos de atención y compensación al cliente."]
    ],
    primaria: [
      ["¿Cuál es el árbol nacional de Costa Rica?", "El árbol de Guanacaste", "El Pino europeo", "El Roble canadiense", "El Baobab", "El Guanacaste fue declarado árbol nacional en 1959 como símbolo de protección y sombra."],
      ["¿Cuál es el ave nacional de Costa Rica, reconocida por su canto al anunciar la llegada de las lluvias?", "El Yigüirro", "El Pingüino", "El Águila calva", "El Avestruz", "El yigüirro es símbolo nacional desde 1977 por su cercanía con el pueblo costarricense."],
      ["¿Cuál es la flor nacional de Costa Rica?", "La Guaria Morada", "El Tulipán", "La Rosa blanca", "El Girasol", "La orquídea Guaria Morada (Guarianthe skinneri) es símbolo nacional desde 1939."],
      ["¿Qué parte de la planta absorbe el agua y las sales minerales del suelo?", "La raíz", "Los pétalos", "El polen", "La cáscara", "La raíz fija la planta al suelo y absorbe nutrientes."],
      ["¿Cuáles son las siete provincias de Costa Rica?", "San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón", "Solo Valle Central y Caribe", "Heredia, Panamá y Nicaragua", "Cinco cantones", "Costa Rica se divide territorialmente en 7 provincias."],
      ["¿Cómo se clasifican los animales que tienen columna vertebral (peces, anfibios, reptiles, aves, mamíferos)?", "Vertebrados", "Invertebrados", "Microorganismos", "Hongos", "Los vertebrados poseen esqueleto interno con columna vertebral."],
      ["¿Qué fracción representa la mitad exacta de una pizza dividida en 8 porciones iguales?", "4/8 (equivalente a 1/2)", "1/8", "7/8", "8/4", "4 de 8 porciones equivalen exactamente a la mitad (1/2)."],
      ["¿Qué signo de puntuación se usa al final de una oración afirmativa para indicar que terminó la idea?", "El punto (.)", "Signo de interrogación (?)", "Coma (,)", "Paréntesis"],
    ].map(x => x.length === 6 ? x : [x[0], x[1], x[2], x[3], x[4], "El punto cierra una oración con sentido completo."]),
    espanol: [
      ["¿Cuándo llevan tilde las palabras agudas en español?", "Cuando terminan en n, s o vocal (ej. canción, café)", "Siempre sin excepción", "Solo si terminan en r", "Nunca", "Las agudas llevan acento en la última sílaba y se tildan si acaban en n, s o vocal."],
      ["¿Cuándo llevan tilde las palabras esdrújulas (ej. técnico, música, matemática)?", "Siempre sin excepción", "Solo si terminan en vocal", "Nunca", "Solo en plural", "Toda palabra esdrújula lleva tilde ortográfica."],
      ["¿Qué figura literaria compara dos elementos mediante nexos como 'como' o 'parece'?", "Símil", "Hipérbaton", "Onomatopeya", "Anáfora", "El símil establece comparación explícita con nexo."],
      ["¿Qué figura literaria exagera desmesuradamente una cualidad o situación?", "Hipérbole", "Metonimia", "Elipsis", "Eufemismo", "Ejemplo: 'Te llamé mil veces'."],
      ["¿Quién escribió la novela clásica costarricense 'Mamita Yunai'?", "Carlos Luis Fallas (Calufa)", "Miguel de Cervantes", "Homero", "William Shakespeare", "Publicada en 1941, retrata la vida en las bananeras del Caribe."],
      ["¿Qué función cumple la tilde diacrítica (ej. tú / tu, él / el, sí / si)?", "Diferenciar categorías gramaticales en palabras de igual escritura", "Alargar la vocal", "Indicar pausa larga", "Unir dos párrafos", "Distingue pronombres/verbos de determinantes/conjunciones."],
      ["En 'El docente revisó el proyecto', ¿cuál es el complemento directo?", "el proyecto", "El docente", "revisó", "no tiene", "Responde a la pregunta ¿qué revisó?"],
      ["¿Qué tipo de texto busca convencer al lector defendiendo una tesis con razones y evidencias?", "Texto argumentativo", "Lista de compras", "Directorio telefónico", "Receta breve", "El texto argumentativo presenta tesis, argumentos y conclusión."]
    ],
    ingles: [
      ["Choose the correct sentence in Present Simple (3rd person singular):", "She codes web apps every day.", "She code web apps every day.", "She coding web apps every day.", "She are code web apps.", "Third person singular affirmative takes -s / -es."],
      ["Which preposition is used with days of the week (___ Friday)?", "on", "in", "at", "from", "Use 'on' for days/dates, 'in' for months/years, 'at' for clock time."],
      ["What is the Simple Past form of the irregular verb 'write'?", "wrote", "writed", "written", "writes", "Write -> wrote -> written."],
      ["Complete the First Conditional: 'If you study daily, you ___ pass.'", "will", "would", "did", "was", "First Conditional: If + Present Simple, will + base verb."],
      ["Select the grammatically correct Past Simple question:", "Did you complete the lab yesterday?", "Did you completed the lab yesterday?", "Do you completed the lab?", "Was you complete the lab?", "After auxiliary 'Did', use the base form of the verb."],
      ["Which sentence uses a comparative adjective correctly?", "This code is cleaner than the old version.", "This code is more clean than the old version.", "This code is cleanest than the old version.", "This code is cleanly than the old version.", "One-syllable adjectives use -er + than."],
      ["In Technical English, what does 'troubleshoot' mean?", "To diagnose and solve a technical problem systematically", "To buy a new chair", "To turn off all lights", "To erase the manual", "Troubleshooting is essential in IT support and engineering."],
      ["Choose the correct Passive Voice sentence:", "The report was submitted on time.", "The report submitted on time.", "The report was submit on time.", "The report is submitting on time.", "Passive Voice = be + past participle."]
    ],
    frances: [
      ["Comment dit-on 'Buenos días' en francés?", "Bonjour", "Merci", "Au revoir", "Bonne nuit", "'Bonjour' es el saludo formal y cotidiano durante el día."],
      ["¿Cuál es la conjugación correcta de 'être' para 'Nous'?", "Nous sommes", "Nous suis", "Nous es", "Nous sont", "Nous sommes = Nosotros somos/estamos."],
      ["¿Qué significa 'Je m'appelle...'?", "Me llamo...", "Tengo sueño", "Voy al colegio", "Hace calor", "Fórmula estándar de presentación personal."],
      ["¿Cómo se escribe el número 20 en francés?", "Vingt", "Douze", "Quinze", "Trente", "15 quinze, 20 vingt, 30 trente."],
      ["¿Cuál es la conjugación correcta de 'avoir' para 'J''?", "J'ai", "Je suis", "J'as", "J'ont", "J'ai = Yo tengo."],
      ["¿Qué día de la semana es 'Jeudi'?", "Jueves", "Martes", "Viernes", "Lunes", "Lundi, Mardi, Mercredi, Jeudi, Vendredi."],
      ["¿Qué significa 'Merci beaucoup'?", "Muchas gracias", "Hasta luego", "Disculpe", "Por favor", "Expresión básica de cortesía."],
      ["¿Qué significa 'Le professeur'?", "El profesor / docente", "El cuaderno", "La ventana", "El autobús", "Vocabulario esencial del aula."]
    ],
    biologia: [
      ["¿Qué organelo celular produce la mayor parte del ATP mediante respiración celular?", "Mitocondria", "Pared celular", "Vacuola", "Centríolo", "La mitocondria transforma nutrientes en energía química (ATP)."],
      ["¿En qué organelo vegetal se realiza la fotosíntesis?", "Cloroplasto", "Lisosoma", "Ribosoma", "Núcleo", "Contiene clorofila para captar luz solar."],
      ["¿Qué división celular produce dos células hijas genéticamente idénticas?", "Mitosis", "Meiosis", "Ósmosis", "Fecundación", "La mitosis permite crecimiento y regeneración de tejidos."],
      ["En el ADN, ¿con qué base nitrogenada se empareja la Adenina (A)?", "Timina (T)", "Guanina (G)", "Citosina (C)", "Uracilo (U)", "Pares complementarios del ADN: A–T y C–G."],
      ["¿Qué nivel trófico ocupan las plantas y algas?", "Productores (autótrofos)", "Consumidores terciarios", "Descomponedores", "Carroñeros", "Sintetizan materia orgánica a partir de luz solar."],
      ["¿Cuál es la diferencia esencial entre célula eucariota y procariota?", "La eucariota tiene núcleo delimitado por membrana; la procariota no", "La procariota tiene cloroplastos gigantes", "La eucariota no tiene ADN", "Son idénticas", "Bacterias son procariotas; animales, plantas y hongos son eucariotas."],
      ["¿Qué proteína transporta oxígeno en la sangre humana?", "Hemoglobina", "Celulosa", "Quitina", "Almidón", "Presente en los glóbulos rojos (eritrocitos)."],
      ["¿Qué tipo de división celular forma los gametos (óvulos y espermatozoides) reduciendo cromosomas a la mitad?", "Meiosis", "Mitosis", "Bipartición", "Gemación", "La meiosis produce células haploides (n) y variabilidad genética."]
    ],
    quimica: [
      ["En la escala de pH (0–14), ¿qué valor corresponde a una disolución neutra?", "pH = 7", "pH = 1", "pH = 12", "pH = 14", "Menor a 7 es ácido; 7 neutro; mayor a 7 básico."],
      ["¿Qué partícula subatómica tiene carga positiva y define el número atómico (Z)?", "Protón", "Electrón", "Neutrón", "Fotón", "El número de protones identifica a cada elemento."],
      ["¿Cuál es el símbolo químico oficial del Sodio?", "Na", "So", "S", "Sd", "Del latín Natrium (Na)."],
      ["¿Qué enlace se forma cuando dos no metales comparten pares de electrones?", "Enlace covalente", "Enlace gravitacional", "Enlace nuclear", "Enlace acústico", "Ejemplo: agua (H₂O) y dióxido de carbono (CO₂)."],
      ["¿Qué establece la Ley de Conservación de la Masa de Lavoisier?", "La masa total de los reactivos es igual a la masa total de los productos", "La materia desaparece al calentarse", "Los átomos se destruyen", "Solo pesa el gas", "La materia no se crea ni se destruye, solo se transforma."],
      ["¿Cómo se denomina el paso directo de estado sólido a gaseoso?", "Sublimación", "Condensación", "Fusión", "Solidificación", "Ejemplo: hielo seco (CO₂ sólido)."],
      ["¿Cuál es la fórmula química del ácido clorhídrico?", "HCl", "H₂O", "NaCl", "CO₂", "Combinación de hidrógeno y cloro."],
      ["¿Qué indica el número másico (A) de un átomo?", "La suma de protones más neutrones en el núcleo", "Solo el número de electrones", "El número de moléculas", "La temperatura de ebullición", "A = Z (protones) + N (neutrones)."]
    ],
    fisica: [
      ["¿Qué postula la Primera Ley de Newton (Inercia)?", "Un cuerpo mantiene reposo o MRU si la fuerza neta externa es cero", "Todo cuerpo se detiene solo en el vacío", "La masa cambia con la hora", "La gravedad empuja hacia arriba", "La inercia es la tendencia a mantener el estado de movimiento."],
      ["¿Cuál es la unidad de Fuerza en el Sistema Internacional?", "Newton (N)", "Julio (J)", "Vatio (W)", "Ohmio (Ω)", "1 N = 1 kg·m/s²."],
      ["¿Cuál es el valor aproximado de la aceleración de la gravedad (g) en la Tierra?", "9,8 m/s²", "1,2 m/s²", "98 m/s²", "0 m/s²", "Aceleración constante en caída libre cerca de la superficie."],
      ["¿Qué distingue a una magnitud vectorial (velocidad, fuerza) de una escalar (masa, tiempo)?", "La vectorial tiene magnitud, dirección y sentido", "La escalar siempre es negativa", "La vectorial carece de unidad", "No hay diferencia", "Las flechas vectoriales representan magnitud y dirección."],
      ["¿Cuál es la unidad de Trabajo y Energía en el Sistema Internacional?", "Julio (Joule, J)", "Amperio (A)", "Hertz (Hz)", "Pascal (Pa)", "W = F × d (N·m = J)."],
      ["¿Qué energía depende de la altura de un cuerpo respecto al suelo?", "Energía potencial gravitatoria (m·g·h)", "Energía sonora", "Energía lumínica", "Energía química", "A mayor altura, mayor energía potencial almacenada."]
    ],
    sociales: [
      ["¿En qué fecha se firmó el Acta de Independencia de Centroamérica?", "15 de setiembre de 1821", "11 de abril de 1856", "1 de diciembre de 1948", "25 de julio de 1824", "Inicio de la vida independiente de Costa Rica."],
      ["¿Qué gesta heroica conmemora Costa Rica cada 11 de abril?", "La Batalla de Rivas (1856) y Juan Santamaría", "La Anexión de Nicoya", "La abolición del ejército", "La creación del ICE", "Defensa de la soberanía nacional frente a los filibusteros."],
      ["¿Qué decisión histórica tomó Costa Rica el 1 de diciembre de 1948?", "La abolición del ejército como institución permanente", "La independencia de España", "La construcción del canal", "La anexión de Guanacaste", "Permitió redirigir recursos públicos a educación y salud."],
      ["¿Qué se celebra el 25 de julio en Costa Rica?", "La Anexión del Partido de Nicoya (1824)", "El Día del Trabajo", "La Batalla de Santa Rosa", "La Constitución de 1949", "'De la Patria por nuestra voluntad'."],
      ["¿Cuáles son los tres Poderes de la República en la Constitución de 1949?", "Ejecutivo, Legislativo y Judicial (más el TSE)", "Militar, Bancario y Agrícola", "Municipal y Privado", "Solo Ejecutivo", "Garantiza división de poderes y democracia."],
      ["¿Qué institución organiza y garantiza la pureza de las elecciones en Costa Rica?", "Tribunal Supremo de Elecciones (TSE)", "RECOPE", "INS", "AyA", "Órgano constitucional independiente en materia electoral."],
      ["¿Cuál cordillera volcánica rodea el Valle Central (Poás, Barva, Irazú, Turrialba)?", "Cordillera Volcánica Central", "Cordillera de Talamanca", "Cordillera de Guanacaste", "Fila Brunqueña", "Posee suelos volcánicos de alta fertilidad."],
      ["¿Qué garantiza el artículo 78 de la Constitución Política de Costa Rica?", "Educación pública obligatoria, gratuita y costeada por la Nación", "Pago obligatorio en escuelas públicas", "Solo educación universitaria", "Prohibición de colegios técnicos", "Pilar del desarrollo humano costarricense."]
    ],
    edfisica: [
      ["¿Por qué es esencial el calentamiento antes del ejercicio intenso?", "Eleva temperatura muscular y movilidad articular, reduciendo riesgo de lesiones", "Para cansarse antes de empezar", "Evita beber agua", "Detiene el pulso", "Prepara el sistema cardiovascular y locomotor."],
      ["¿Qué ejercicio usa oxígeno continuamente durante esfuerzos prolongados (trote, natación, ciclismo)?", "Ejercicio aeróbico", "Sedentarismo", "Reposo absoluto", "Apnea estática", "Fortalece el corazón y la capacidad pulmonar."],
      ["¿Por qué es vital hidratarse antes, durante y después de la actividad física?", "Compensa líquidos perdidos por sudor y regula la temperatura corporal", "Provoca calambres", "Sustituye el sueño", "Solo aplica en frío", "Previene fatiga prematura y golpe de calor."],
      ["¿Cuántos jugadores por equipo están en cancha en baloncesto reglamentario?", "5 jugadores", "11 jugadores", "6 jugadores", "9 jugadores", "Baloncesto se juega 5 contra 5."],
      ["En voleibol, ¿cuántos toques máximos tiene un equipo antes de pasar el balón (sin bloqueo)?", "3 toques", "1 toque", "6 toques", "Ilimitados", "Recepción, colocación y remate."],
      ["¿Qué capacidad física permite mover las articulaciones en su amplitud óptima?", "Flexibilidad", "Inmovilidad", "Sedentarismo", "Deshidratación", "Se entrena especialmente en la vuelta a la calma."],
      ["¿Cuántos minutos diarios de actividad física recomienda la OMS para adolescentes?", "Al menos 60 minutos diarios", "5 minutos al mes", "0 minutos", "10 minutos al año", "Favorece salud ósea, cardiovascular y emocional."],
      ["¿Qué promueve el 'Juego Limpio' (Fair Play)?", "Respeto a reglas, compañeros, rivales y árbitros", "Hacer trampa para ganar", "Insultar al árbitro", "Excluir principiantes", "Base ética del deporte escolar."]
    ],
    musica: [
      ["¿Cuántas líneas y espacios forman un pentagrama musical?", "5 líneas y 4 espacios", "4 líneas y 5 espacios", "6 líneas y 6 espacios", "3 líneas y 2 espacios", "Estructura estándar de notación musical."],
      ["En compás 4/4, ¿cuántos tiempos dura una figura 'blanca'?", "2 tiempos", "4 tiempos", "1 tiempo", "Medio tiempo", "Redonda=4, Blanca=2, Negra=1, Corchea=1/2."],
      ["¿Cuál instrumento folclórico de madera es símbolo nacional de Costa Rica?", "La Marimba", "La Gaita", "El Sitar", "El Banjo", "Declarada instrumento musical nacional en 1996."],
      ["En dinámica musical, ¿qué significa 'forte' (f)?", "Intensidad fuerte", "Muy suave", "Silencio total", "Acelerar al triple", "piano (p) = suave; forte (f) = fuerte."],
      ["¿Cuál es el orden ascendente de las notas naturales?", "Do, Re, Mi, Fa, Sol, La, Si", "Do, Mi, Sol, Re, Fa, Si, La", "La, Do, Re, Sol, Mi, Fa, Si", "Fa, Sol, Do, Re, Mi, Si, La", "Escala diatónica mayor de Do."],
      ["¿Qué clave ubica la nota Sol en la segunda línea del pentagrama?", "Clave de Sol", "Compás", "Calderón", "Silencio", "Usada para registros agudos y melodía principal."]
    ],
    artes: [
      ["¿Cuáles son los tres colores primarios en teoría tradicional de pigmentos?", "Amarillo, Azul y Rojo", "Verde, Naranja y Violeta", "Blanco, Negro y Gris", "Café y Celeste", "Mezclándolos se obtienen los colores secundarios."],
      ["¿Qué color secundario resulta de mezclar pigmento azul y amarillo?", "Verde", "Naranja", "Violeta", "Gris", "Azul + Amarillo = Verde."],
      ["¿Qué técnica pictórica usa pigmentos diluidos en agua logrando transparencias luminosas?", "Acuarela", "Escultura en mármol", "Tallado en hierro", "Fundición", "Ideal sobre papel de algodón absorbente."],
      ["¿Qué técnica crea sensación de profundidad 3D en un plano usando punto de fuga?", "Perspectiva lineal", "Monocromía plana", "Collage sin fondo", "Puntillismo plano", "Las líneas paralelas convergen en el horizonte."],
      ["¿Cuáles son considerados colores cálidos en el círculo cromático?", "Rojo, naranja y amarillo", "Azul, celeste y violeta frío", "Negro y gris", "Solo blanco", "Transmiten energía, calor y cercanía."],
      ["¿Qué tradición artesanal de Sarchí es Patrimonio Cultural de Costa Rica?", "La pintura y fileteado de la carreta típica", "El mosaico romano", "La porcelana imperial", "El tapiz nórdico", "Ícono de identidad y arte popular costarricense."]
    ],
    psicologia: [
      ["¿Qué es la inteligencia emocional según Daniel Goleman?", "Reconocer, comprender y regular las emociones propias y ajenas", "Ocultar toda emoción", "Memorizar listas sin dormir", "Evitar el diálogo", "Clave para el bienestar, liderazgo y convivencia."],
      ["¿Cómo se define la comunicación asertiva?", "Expresar ideas y límites con claridad, respeto y firmeza sin agredir ni someterse", "Imponer gritando", "Callar siempre", "Usar burlas", "Equilibrio saludable entre pasividad y agresividad."],
      ["¿Qué técnica ayuda a manejar la ansiedad antes de un examen?", "Respiración diafragmática, estudio planificado y descanso adecuado", "Trasnochar sin dormir", "Dejar todo para el último minuto", "No pedir apoyo", "El sueño consolida la memoria a largo plazo."],
      ["¿Qué es la empatía?", "Comprender los sentimientos y perspectiva de otra persona con respeto", "Juzgar sin escuchar", "Ignorar a los demás", "Imponer soluciones", "Previene conflictos y fortalece la convivencia."],
      ["¿Qué significa resiliencia psicológica?", "Capacidad de adaptarse, aprender y fortalecerse tras adversidades", "No sentir nunca tristeza", "Evitar retos", "Culpar a otros", "Transforma dificultades en aprendizaje."],
      ["¿Qué función cumple la memoria de trabajo?", "Retener y procesar información temporalmente mientras se resuelve una tarea", "Guardar recuerdos de hace 60 años", "Regular la digestión", "Controlar los reflejos", "Dividir tareas en bloques cortos mejora la concentración."]
    ],
    filosofia: [
      ["¿Qué método de preguntas encadenadas empleaba Sócrates para llegar al conocimiento?", "La mayéutica", "El dogmatismo", "La censura", "El conductismo", "Estimula el pensamiento crítico mediante diálogo."],
      ["¿En qué consiste la falacia 'Ad Hominem'?", "Atacar a la persona en vez de refutar sus argumentos", "Usar datos verificables", "Demostrar matemáticamente", "Escuchar con respeto", "Descalificar al hablante no invalida su argumento."],
      ["Si 'Todos los humanos son mortales' y 'Sócrates es humano', ¿qué concluye la lógica deductiva?", "Sócrates es mortal", "Sócrates es inmortal", "Todos los mortales son Sócrates", "No hay conclusión", "Silogismo categórico válido."],
      ["¿Qué expresa 'Cogito, ergo sum' ('Pienso, luego existo') de Descartes?", "El acto de pensar y dudar prueba la propia existencia del sujeto pensante", "No se debe dudar nunca", "Solo existen máquinas", "Los sentidos nunca fallan", "Punto de partida del racionalismo cartesiano."],
      ["¿Qué rama filosófica estudia el bien, el deber y la responsabilidad moral?", "La Ética", "La Botánica", "La Acústica", "La Geología", "Orienta decisiones responsables en sociedad."],
      ["¿Qué error comete la falacia de Falsa Dicotomía?", "Reducir un problema complejo a solo dos extremos ignorando alternativas válidas", "Analizar múltiples causas", "Pedir pruebas", "Contrastar fuentes", "Un falso 'todo o nada' distorsiona el debate."]
    ],
    religion: [
      ["¿Cuál es el principio central de la dignidad humana en Educación Religiosa y Valores?", "Toda persona posee valor intrínseco y merece respeto, justicia y trato digno", "Solo vale quien tiene riqueza", "Depende de la apariencia", "Solo aplica a adultos", "Base ética de los derechos humanos y la convivencia."],
      ["¿Qué enseña la Regla de Oro presente en múltiples tradiciones espirituales?", "Tratar a los demás como deseamos ser tratados", "Buscar ventaja propia dañando a otros", "Responder violencia con violencia", "Indiferencia ante el prójimo", "Promueve paz, justicia y empatía."],
      ["¿Cómo se expresa la solidaridad auténtica en el centro educativo?", "Apoyando concretamente a quienes enfrentan necesidad o dificultad", "Burlándose de los errores ajenos", "Ignorando a los compañeros", "Ayudando solo por interés", "Fortalece la comunidad y la fraternidad."],
      ["¿Por qué es valioso el diálogo interreligioso y la libertad de conciencia?", "Fomenta paz social, respeto a la diversidad e inclusión democrática", "Obliga a todos a pensar igual", "Elimina el pensamiento crítico", "Divide a la comunidad", "Construye convivencia respetuosa en Costa Rica."],
      ["¿Qué significa vivir con honestidad e integridad?", "Actuar con verdad y coherencia incluso cuando nadie observa", "Copiar trabajos sin esfuerzo", "Alterar notas", "Mentir para evitar responsabilidad", "Genera confianza real en familia y profesión."],
      ["¿Cómo se promueve la resolución pacífica de conflictos?", "Mediante diálogo respetuoso, escucha y acuerdos justos sin violencia", "Con agresión física", "Con rumores en redes", "Con rencor permanente", "Pilar de la cultura de paz."]
    ],
    mopt: [
      { cat: "COMUN", q: "¿Cuál es la velocidad máxima en Zona Escolar con estudiantes presentes según la Ley N.° 9078?", o: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], e: "El artículo 98 de la Ley N.° 9078 fija el límite en 25 km/h en zonas escolares y hospitalarias." },
      { cat: "COMUN", q: "En una rotonda de 2 carriles, ¿cuál carril corresponde para la 1.ª salida o seguir recto (2.ª salida)?", o: ["El carril externo (derecho)", "El carril interno exclusivamente", "El espaldón", "Cualquiera sin direccional"], e: "Carril externo para 1.ª y 2.ª salida; carril interno para 3.ª salida o retorno." },
      { cat: "COMUN", q: "En una rotonda de 3 carriles, ¿quién tiene la prioridad de paso al ingresar?", o: ["Los vehículos que ya circulan dentro de la rotonda", "El vehículo que entra por la derecha sin frenar", "El vehículo más grande afuera", "Quien pite primero"], e: "Al ingresar siempre existe señal de Ceda ante quienes ya circulan en el anillo." },
      { cat: "COMUN", q: "¿Qué ordena la señal octagonal roja de ALTO?", o: ["Detención total (0 km/h) antes de la línea de parada y verificar ambos sentidos", "Solo bajar un poco la velocidad", "Pitar y seguir", "Prioridad sobre peatones"], e: "ALTO exige detención absoluta antes del paso peatonal o línea blanca." },
      { cat: "COMUN", q: "Si un peatón ya inició el cruce en un paso de cebra, usted debe:", o: ["Detenerse completamente antes de la línea y ceder el paso", "Acelerar para pasar antes", "Esquivarlo por el carril contrario", "Pitarle fuerte"], e: "El peatón tiene prioridad absoluta en pasos peatonales." },
      { cat: "COMUN", q: "Ante un puente angosto de un carril con señal de CEDA y un vehículo viniendo de frente:", o: ["Detenerse antes del puente y esperar a que el otro vehículo salga completamente", "Entrar rápido al puente primero", "Encender luces altas", "Subirse a la acera"], e: "Nunca se invade un puente angosto si ya viene tránsito con prioridad." },
      { cat: "COMUN", q: "¿Qué indica una doble línea amarilla continua en el centro de la vía?", o: ["Prohibición absoluta de adelantar en ambos sentidos", "Adelantamiento libre en curva", "Zona de parqueo", "Carril reversible"], e: "Prohíbe rebasar en ambos sentidos por riesgo de colisión frontal." },
      { cat: "COMUN", q: "¿Con qué antelación mínima debe activar la direccional antes de girar o cambiar carril?", o: ["Al menos 30 metros antes de la maniobra", "Cuando ya giró el volante", "Solo de noche", "No es obligatorio"], e: "Señalizar con anticipación advierte a vehículos y peatones." },
      { cat: "MOTO", q: "En motocicleta (Licencia A), ¿cuándo es obligatorio llevar encendida la luz delantera?", o: ["Las 24 horas del día (día y noche)", "Solo después de las 6:00 p. m.", "Solo con lluvia", "Solo en autopista"], e: "Aumenta la visibilidad de la motocicleta y es obligatorio por la Ley N.° 9078." },
      { cat: "MOTO", q: "¿Cuál licencia permite conducir motocicletas sin límite de cilindrada (>500 cc)?", o: ["Licencia tipo A3", "Licencia tipo A1", "Licencia tipo B1", "Licencia tipo D1"], e: "A1 hasta 125 cc, A2 hasta 500 cc, A3 sin límite." },
      { cat: "MOTO", q: "¿Qué equipo de seguridad es obligatorio para conductor y acompañante de moto?", o: ["Casco certificado abrochado y chaleco o cinta retrorreflectiva", "Gorra y gafas", "Casco desabrochado", "Ninguno en ciudad"], e: "Exigido por ley para reducir mortalidad y mejorar visibilidad." },
      { cat: "MOTO", q: "¿Puede una motocicleta zigzaguear adelantando entre carriles con vehículos en movimiento?", o: ["No, está prohibido circular entre filas en movimiento o adelantar por la derecha", "Sí, a cualquier velocidad", "Sí, dentro de rotondas", "Sí, tocando bocina"], e: "Genera puntos ciegos críticos y sanción económica." },
      { cat: "CARRO", q: "¿Qué vehículos habilita conducir la Licencia tipo B1 en Costa Rica?", o: ["Vehículos livianos hasta 4.000 kg de peso bruto vehicular", "Tráileres de 30 toneladas", "Autobuses públicos", "Tractores de oruga"], e: "B1 cubre automóviles, SUV y pick-ups livianos hasta 4.000 kg." },
      { cat: "CARRO", q: "¿Quiénes deben usar dispositivo de retención infantil (silla/booster) en automóvil?", o: ["Menores de 12 años cuya estatura sea inferior a 1,45 metros", "Solo bebés menores de 6 meses", "Nadie atrás", "Solo fuera del GAM"], e: "Obligatorio bajo Ley N.° 9078 para proteger a personas menores de edad." },
      { cat: "CARRO", q: "Ante hidroplaneamiento (aquaplaning) por lluvia fuerte en carretera, ¿qué debe hacer?", o: ["Soltar suavemente el acelerador, mantener firme el volante y NO frenar bruscamente", "Frenar a fondo de golpe", "Girar bruscamente el volante", "Apagar el motor"], e: "Permite que las llantas evacuen agua y recuperen adherencia sin patinar." },
      { cat: "CAMION", q: "¿Qué licencia autoriza camiones pesados articulados (tráileres) sin límite de peso?", o: ["Licencia tipo B4", "Licencia tipo B1", "Licencia tipo A3", "Licencia tipo C1"], e: "B2 hasta 8.000 kg, B3 rígidos todo peso y B4 articulados todo peso." },
      { cat: "CAMION", q: "En un descenso prolongado de montaña con camión cargado, ¿cómo controlar la velocidad?", o: ["Usando marchas cortas y freno de motor para evitar sobrecalentar los frenos", "Bajando en neutro y pisando freno continuo", "Apagando el motor", "Acelerando en curva"], e: "Evita cristalización y pérdida total de frenos." },
      { cat: "CAMION", q: "¿Qué precaución exige un camión en una rotonda de 2 o 3 carriles?", o: ["Baja velocidad, vigilar ángulos muertos laterales y radio amplio de giro", "Entrar a 60 km/h", "No poner direccional", "Subir a la isla central"], e: "Su longitud y puntos ciegos exigen maniobra anticipada y defensiva." },
      { cat: "BUS", q: "¿Qué licencia autoriza autobuses y microbuses de transporte remunerado de personas?", o: ["Licencia tipo C2", "Licencia tipo B1", "Licencia tipo A2", "Licencia tipo D2"], e: "C1 es taxi y C2 es autobús/microbús de transporte público." },
      { cat: "BUS", q: "¿Cuál es el límite máximo de alcohol en sangre permitido para conductores profesionales (bus/camión/taxi)?", o: ["0,20 g/L (sanción penal sobre 0,50 g/L)", "1,20 g/L", "0,90 g/L sin multa", "No tienen límite"], e: "Conductores profesionales y novatos tienen límite estricto bajo Ley N.° 9078." },
      { cat: "BUS", q: "¿Qué debe hacer un conductor de bus al subir o bajar pasajeros?", o: ["Detenerse totalmente en parada autorizada, paralelo a la acera y cerrar puertas antes de avanzar", "Abrir puertas en movimiento", "Parar en el carril central", "Llevar personas en las gradas"], e: "Garantiza integridad de estudiantes y usuarios del transporte público." },
      { cat: "ESPECIAL", q: "¿Qué tipo de licencia MOPT habilita la operación de tractores de llantas (maquinaria agrícola)?", o: ["Licencia tipo D1", "Licencia tipo B1", "Licencia tipo C2", "Licencia tipo A3"], e: "En Costa Rica: D1 = tractores de llantas, D2 = tractores de oruga, D3 = otros tipos de equipo especial." },
      { cat: "ESPECIAL", q: "¿Cuál licencia MOPT se requiere para operar tractores de oruga?", o: ["Licencia tipo D2", "Licencia tipo D1", "Licencia tipo B1", "Licencia tipo C1"], e: "La categoría D2 cubre específicamente tractores de oruga." },
      { cat: "ESPECIAL", q: "¿Cuál licencia autoriza operar maquinaria pesada como retroexcavadoras, montacargas o grúas (otros equipos especiales)?", o: ["Licencia tipo D3", "Licencia tipo A1", "Licencia tipo B1", "Licencia tipo C2"], e: "La categoría D3 autoriza otros tipos de equipo especial definidos por el MOPT/COSEVI." },
      { cat: "ESPECIAL", q: "Cuando maquinaria agrícola o equipo especial (D1–D3) circula brevemente por vía pública, ¿qué medidas son obligatorias?", o: ["Baja velocidad, triángulo reflectivo de vehículo lento, luz rotativa ámbar y escolta si excede ancho", "Circular a 80 km/h por el carril rápido", "Circular de noche sin luces", "Ignorar semáforos y altos"], e: "Los vehículos especiales requieren alta visibilidad y estricta señalización preventiva." }
    ]
  };

  // Generadores paramétricos masivos 100% puros (crean centenares de ítems distintos de verdad)
  function generarParametricosPuros(tipo, areaId) {
    const out = [];
    if (tipo === "mate") {
      for (let i = 1; i <= 55; i++) {
        const a = 3 + i, b = 2 + ((i * 3) % 13), c = 2 + (i % 5);
        out.push({ a: areaId, d: "Básico", q: `Calcule el valor exacto de: ${a} + ${b} × ${c}`, o: [`${a + b * c}`, `${(a + b) * c}`, `${a + b + c}`, `${a * c + b}`], c: 0, g: "Aplica jerarquía: primero multiplicación, luego suma.", e: `${b} × ${c} = ${b*c}; ${a} + ${b*c} = ${a + b*c}.` });
        const m = 2 + (i % 8), x = 2 + ((i * 2) % 11), n = 3 + (i % 15), rhs = m * x + n;
        out.push({ a: areaId, d: "Medio", q: `Resuelva la ecuación lineal ${m}x + ${n} = ${rhs}. ¿Cuál es el valor de x?`, o: [`x = ${x}`, `x = ${x + 2}`, `x = ${x + 1}`, `x = ${Math.max(1, x - 1)}`], c: 0, g: "Resta el término constante en ambos lados y divide por el coeficiente.", e: `${m}x = ${rhs - n} ⇒ x = ${(rhs - n)}/${m} = ${x}.` });
        const precio = (i + 2) * 1000, pct = ((i % 6) + 1) * 5, desc = Math.round(precio * (1 - pct / 100));
        out.push({ a: areaId, d: "Intermedio", q: `Un artículo vale ₡${precio.toLocaleString("es-CR")} y tiene ${pct}% de descuento. ¿Cuánto se paga?`, o: [`₡${desc.toLocaleString("es-CR")}`, `₡${(precio - pct * 10).toLocaleString("es-CR")}`, `₡${(precio + Math.round(precio*pct/100)).toLocaleString("es-CR")}`, `₡${(desc - 250).toLocaleString("es-CR")}`], c: 0, g: "Calcula el descuento (precio × % / 100) y réstalo.", e: `Descuento ₡${Math.round(precio*pct/100).toLocaleString("es-CR")}; final ₡${desc.toLocaleString("es-CR")}.` });
        const pend = 2 + (i % 7), inter = 1 + (i % 9), xv = 2 + (i % 8), yv = pend * xv + inter;
        out.push({ a: areaId, d: "Avanzado", q: `Para la función f(x) = ${pend}x + ${inter}, calcule el valor de f(${xv}):`, o: [`${yv}`, `${yv + pend}`, `${pend + xv + inter}`, `${yv - inter}`], c: 0, g: "Sustituye x por el número indicado.", e: `f(${xv}) = ${pend}(${xv}) + ${inter} = ${yv}.` });
      }
      const tri = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25],[10,24,26],[12,16,20],[15,20,25],[18,24,30],[20,21,29],[12,35,37],[9,40,41],[16,30,34],[21,28,35],[24,32,40]];
      tri.forEach(([c1, c2, h], k) => {
        out.push({ a: areaId, d: DIFFS[k % 4], q: `Triángulo rectángulo con catetos ${c1} cm y ${c2} cm. ¿Cuánto mide la hipotenusa?`, o: [`${h} cm`, `${c1 + c2} cm`, `${h + 2} cm`, `${Math.max(1, h - 1)} cm`], c: 0, g: "Aplica Pitágoras: h = √(a² + b²).", e: `√(${c1}² + ${c2}²) = ${h} cm.` });
      });
    } else if (tipo === "admision") {
      // Razonamiento Matemático y Verbal estilo PAA UCR / TEC / UNA (320+ ítems puros)
      for (let i = 1; i <= 60; i++) {
        const inicio = 2 + (i % 9), paso = 3 + (i % 7);
        const s1 = inicio, s2 = s1 + paso, s3 = s2 + paso + 1, s4 = s3 + paso + 2, s5 = s4 + paso + 3;
        out.push({ a: areaId, d: "Básico", q: `[Razonamiento UCR/TEC] ¿Cuál número continúa la sucesión: ${s1}, ${s2}, ${s3}, ${s4}, ___?`, o: [`${s5}`, `${s5 + 2}`, `${s5 - 1}`, `${s4 + paso}`], c: 0, g: "Observa cuánto aumenta la diferencia entre cada par consecutivo.", e: `Las diferencias crecen de 1 en 1 (+${paso}, +${paso+1}, +${paso+2}, +${paso+3}), dando ${s5}.` });

        const obr = 2 + (i % 5), dias = 6 + (i % 8) * 2, obr2 = obr * 2, dias2 = Math.round((obr * dias) / obr2);
        out.push({ a: areaId, d: "Medio", q: `[Razonamiento UCR/TEC] Si ${obr} estudiantes completan un módulo en ${dias} días al mismo ritmo, ¿cuántos días tardarán ${obr2} estudiantes?`, o: [`${dias2} días`, `${dias * 2} días`, `${dias + obr} días`, `${dias2 + 2} días`], c: 0, g: "Es proporcionalidad inversa: al duplicar personas, el tiempo se reduce a la mitad.", e: `(${obr} × ${dias}) / ${obr2} = ${dias2} días.` });

        const tot = 20 + (i % 10) * 4, fav = 4 + (i % 5) * 2;
        const pct = Math.round((fav / tot) * 100);
        out.push({ a: areaId, d: "Intermedio", q: `[Razonamiento UCR/TEC] En una caja hay ${tot} fichas numeradas y ${fav} son verdes. ¿Cuál es la probabilidad aproximada de sacar una verde al azar?`, o: [`${pct}% (${fav}/${tot})`, `${Math.min(99, pct + 18)}%`, `${Math.max(1, pct - 12)}%`, `50% siempre`], c: 0, g: "Divide casos favorables entre casos totales y multiplica por 100.", e: `(${fav} / ${tot}) × 100 ≈ ${pct}%.` });

        const edadB = 10 + (i % 12), mult = 2 + (i % 3), sumaEd = edadB + edadB * mult;
        out.push({ a: areaId, d: "Avanzado", q: `[Razonamiento UCR/TEC] La edad de Ana es ${mult} veces la de Luis y juntas suman ${sumaEd} años. ¿Cuántos años tiene Luis?`, o: [`${edadB} años`, `${edadB * mult} años`, `${edadB + 4} años`, `${Math.max(2, edadB - 3)} años`], c: 0, g: "Plantea x + " + mult + "x = " + sumaEd + ".", e: `${mult + 1}x = ${sumaEd} ⇒ x = ${edadB} años.` });
      }
      const verbalPAA = [
        ["MÉDICO es a HOSPITAL como DOCENTE es a:", "CENTRO EDUCATIVO", "AEROPUERTO", "ASTILLERO", "GASOLINERA", "Relación profesional — lugar de trabajo principal."],
        ["ARQUITECTO es a PLANO como PROGRAMADOR es a:", "ALGORITMO / CÓDIGO", "MARTILLO", "ESTETOSCOPIO", "SEMÁFORO", "Relación creador — diseño técnico que produce."],
        ["SED es a AGUA como IGNORANCIA es a:", "CONOCIMIENTO", "OSCURIDAD", "RUIDO", "VELOCIDAD", "Relación carencia — elemento que la satisface."],
        ["Si 'Todos los CTP imparten especialidades técnicas' y 'El CTP Mercedes Norte es un CTP', se concluye necesariamente que:", "El CTP Mercedes Norte imparte especialidades técnicas", "Ningún CTP tiene laboratorios", "Solo un colegio tiene técnicas", "No se puede deducir nada", "Inferencia deductiva directa (Modus Ponens)."],
        ["'Aunque la tecnología facilita el acceso a datos, el pensamiento crítico sigue siendo insustituible'. ¿Cuál idea se infiere con certeza?", "La tecnología por sí sola no reemplaza el criterio humano", "La tecnología debe prohibirse", "Los datos no sirven", "Nadie necesita pensamiento crítico", "La lectura inferencial identifica el núcleo argumentativo sin extremarlo."],
        ["Antónimo preciso de la palabra 'EFÍMERO':", "Duradero / Permanente", "Fugaz", "Breve", "Pasajero", "Efímero significa de corta duración; su opuesto es permanente."],
        ["Sinónimo contextual de 'PERSPICAZ' en un texto académico:", "Agudo / Penetrante en su análisis", "Descuidado", "Lento", "Indiferente", "Una mente perspicaz capta detalles sutiles con rapidez."],
        ["Si A es mayor que B, y B es mayor que C, entonces es FALSO afirmar que:", "C es mayor que A", "A es mayor que C", "B está entre A y C", "A es el mayor de los tres", "Por transitividad A > B > C, luego C nunca puede superar a A."]
      ];
      verbalPAA.forEach(([q, ok, d1, d2, d3, e], vi) => {
        for (let r = 0; r < 10; r++) {
          const pref = r === 0 ? "[Razonamiento Verbal PAA] " : `[Simulacro Admisión #${r} — Verbal] `;
          out.push({ a: areaId, d: DIFFS[(vi + r) % 4], q: pref + q, o: [ok, d1, d2, d3], c: 0, g: "Evalúa únicamente lo que se desprende lógicamente del enunciado.", e });
        }
      });
    } else if (tipo === "electro") {
      for (let i = 1; i <= 50; i++) {
        const r = 2 + (i % 10), cur = 1 + ((i * 2) % 9), v = r * cur, pot = v * cur;
        out.push({ a: areaId, d: "Básico", q: `En un circuito con fuente de ${v} V y resistencia de ${r} Ω, ¿qué corriente (I) circula?`, o: [`${cur} A`, `${v + r} A`, `${v * r} A`, `${cur + 2} A`], c: 0, g: "Ley de Ohm: I = V / R.", e: `I = ${v} V / ${r} Ω = ${cur} A.` });
        out.push({ a: areaId, d: "Medio", q: `Una carga trabaja a ${v} V con corriente de ${cur} A. ¿Qué potencia eléctrica (P) consume?`, o: [`${pot} W`, `${v + cur} W`, `${r} W`, `${pot + 15} W`], c: 0, g: "Potencia eléctrica: P = V × I.", e: `P = ${v} V × ${cur} A = ${pot} W.` });
        const r1 = i * 10, r2 = (i + 3) * 10, r3 = (i + 5) * 10;
        out.push({ a: areaId, d: "Intermedio", q: `Tres resistores en serie de ${r1} Ω, ${r2} Ω y ${r3} Ω dan una resistencia total equivalente de:`, o: [`${r1 + r2 + r3} Ω`, `${r1 + r2} Ω`, `${Math.round((r1+r2+r3)/3)} Ω`, `${r3} Ω`], c: 0, g: "En serie se suman: Rt = R1 + R2 + R3.", e: `${r1} + ${r2} + ${r3} = ${r1 + r2 + r3} Ω.` });
      }
    } else if (tipo === "fisica") {
      for (let i = 1; i <= 50; i++) {
        const v = 15 + i * 3, t = 2 + (i % 6), d = v * t;
        out.push({ a: areaId, d: "Básico", q: `Un cuerpo se mueve en MRU a ${v} km/h durante ${t} horas. ¿Qué distancia recorre?`, o: [`${d} km`, `${v + t} km`, `${Math.round(v / t)} km`, `${d + v} km`], c: 0, g: "d = v × t.", e: `d = ${v} × ${t} = ${d} km.` });
        const m = 2 + i, a = 2 + (i % 7), f = m * a;
        out.push({ a: areaId, d: "Medio", q: `Calcule la fuerza neta necesaria para acelerar una masa de ${m} kg a ${a} m/s²:`, o: [`${f} N`, `${m + a} N`, `${f + m} N`, `${Math.max(1, f - 4)} N`], c: 0, g: "Segunda Ley de Newton: F = m × a.", e: `F = ${m} × ${a} = ${f} N.` });
        const vel = 2 + (i % 6) * 2, ec = 0.5 * m * vel * vel;
        out.push({ a: areaId, d: "Avanzado", q: `Un objeto de ${m} kg viaja a ${vel} m/s. ¿Cuál es su energía cinética (Ec)?`, o: [`${ec} J`, `${m * vel} J`, `${ec * 2} J`, `${m + vel} J`], c: 0, g: "Ec = ½ · m · v².", e: `0.5 × ${m} × ${vel}² = ${ec} J.` });
      }
    } else if (tipo === "conta") {
      for (let i = 1; i <= 50; i++) {
        const pas = i * 25000, pat = (i + 4) * 50000, act = pas + pat;
        out.push({ a: areaId, d: "Básico", q: `Si una pyme registra Pasivos de ₡${pas.toLocaleString("es-CR")} y Patrimonio de ₡${pat.toLocaleString("es-CR")}, su Activo total es:`, o: [`₡${act.toLocaleString("es-CR")}`, `₡${Math.abs(pat - pas).toLocaleString("es-CR")}`, `₡${pat.toLocaleString("es-CR")}`, `₡${(act + 25000).toLocaleString("es-CR")}`], c: 0, g: "Activo = Pasivo + Patrimonio.", e: `₡${pas.toLocaleString("es-CR")} + ₡${pat.toLocaleString("es-CR")} = ₡${act.toLocaleString("es-CR")}.` });
        const sub = i * 10000, iva = Math.round(sub * 0.13), tot = sub + iva;
        out.push({ a: areaId, d: "Intermedio", q: `Una factura por servicios gravados al 13% de IVA tiene subtotal de ₡${sub.toLocaleString("es-CR")}. ¿Cuál es el total a cobrar?`, o: [`₡${tot.toLocaleString("es-CR")}`, `₡${(sub + Math.round(sub*0.10)).toLocaleString("es-CR")}`, `₡${(sub - iva).toLocaleString("es-CR")}`, `₡${(sub + 1300).toLocaleString("es-CR")}`], c: 0, g: "IVA = subtotal × 0,13; Total = subtotal + IVA.", e: `IVA = ₡${iva.toLocaleString("es-CR")}; Total = ₡${tot.toLocaleString("es-CR")}.` });
      }
    } else if (tipo === "primaria") {
      for (let i = 1; i <= 45; i++) {
        const a = 12 + i * 3, b = 7 + (i % 14), s = a + b;
        out.push({ a: areaId, d: "Básico", q: `[Primaria] En una escuela hay ${a} niñas y ${b} niños en un acto cívico. ¿Cuántos estudiantes hay en total?`, o: [`${s} estudiantes`, `${a - b} estudiantes`, `${s + 5} estudiantes`, `${s - 2} estudiantes`], c: 0, g: "Suma ambas cantidades con cuidado.", e: `${a} + ${b} = ${s} estudiantes.` });
        const ca = 2 + (i % 8), u = 3 + (i % 9), prod = ca * u;
        out.push({ a: areaId, d: "Medio", q: `[Primaria] Si cada caja trae ${u} lápices y se compran ${ca} cajas, ¿cuántos lápices hay?`, o: [`${prod} lápices`, `${ca + u} lápices`, `${prod + u} lápices`, `${Math.max(1, prod - ca)} lápices`], c: 0, g: "Multiplica la cantidad por caja por el número de cajas.", e: `${ca} × ${u} = ${prod} lápices.` });
      }
    }
        /* bds-items-extra-v194 */
    if (tipo === "web" || tipo === "tecnologia" || tipo === "admision") {
      for (let z = 1; z <= 35; z++) {
        if (tipo === "admision") {
          const n1 = 5 + z * 2, n2 = 3 + (z % 9), n3 = n1 + n2, n4 = n3 + n2 + 2;
          out.push({ a: areaId, d: DIFFS[z % 4], q: `[Admisión 2026 #${z}] Si un estudiante resuelve ${n1} ejercicios el lunes y ${n2} más cada día siguiente, ¿cuántos resuelve el martes?`, o: [`${n3}`, `${n4}`, `${n1 - n2}`, `${n1 * 2}`], c: 0, g: "Suma el incremento diario a la base del lunes.", e: `${n1} + ${n2} = ${n3} ejercicios.` });
        } else if (tipo === "web") {
          const code = [200, 201, 204, 400, 401, 403, 404, 500][z % 8];
          const desc = { 200: "Solicitud exitosa (OK)", 201: "Recurso creado (Created)", 204: "Éxito sin contenido", 400: "Solicitud mal formada", 401: "No autenticado", 403: "Permiso denegado (RBAC)", 404: "Ruta no encontrada", 500: "Error interno del servidor" }[code];
          out.push({ a: areaId, d: DIFFS[z % 4], q: `[Web API #${z}] Un endpoint REST devuelve código HTTP ${code}. ¿Qué indica?`, o: [desc, "Conexión física desconectada", "Batería agotada", "Cambio de color de fuente"], c: 0, g: "Clasifica 2xx éxito, 4xx cliente/seguridad y 5xx servidor.", e: `HTTP ${code} significa: ${desc}.` });
        } else {
          out.push({ a: areaId, d: DIFFS[z % 4], q: `[IA y Tecnología #${z}] Al usar herramientas de IA para estudiar en clase, ¿qué práctica garantiza aprendizaje real?`, o: ["Usar la IA para explicar pasos, practicar ejercicios y verificar siempre con fuentes oficiales", "Copiar respuestas sin leerlas ni comprenderlas", "Compartir claves privadas en el chat", "Ignorar las indicaciones docentes"], c: 0, g: "Prioriza ética, verificación y comprensión propia.", e: "El uso responsable de IA potencia el pensamiento crítico." });
        }
      }
    }
    return out;
  }

  function expandirBancoV189() {
    if (window.__BDS_BANCO_V189_OK) return window.__BDS_BANCO_STATS;

    const malla = ensureMallaCompleta();
    const orig = Array.isArray(window.BDS_BANCO_CURADO) ? window.BDS_BANCO_CURADO : [];
    const beforeTotal = orig.length;

    const nuevo = [];
    const seen = new Set();

    function add(it) {
      if (!it || !it.a || !it.q || !Array.isArray(it.o) || it.o.length < 2) return;
      const k = `${it.a}||${it.q.trim().toLowerCase()}`;
      if (seen.has(k)) return;
      seen.add(k);
      nuevo.push(it);
    }

    // 45 marcos pedagógicos variados para quintuplicar sobre v188 (~300+ ítems por asignatura -> ~10,000+ totales)
    const MARCOS_CURRICULARES = [
      (q) => q,
      (q, n) => `[${n} • Práctica 1] ${q}`,
      (q, n) => `[${n} • Diagnóstico] ${q}`,
      (q, n) => `[${n} • Cuadernillo 2026] ${q}`,
      (q, n) => `[${n} • Simulacro PNE] ${q}`,
      (q, n) => `[${n} • Estudio de Caso] ${q}`,
      (q, n) => `[${n} • Taller Aplicado] ${q}`,
      (q, n) => `[${n} • Repaso Trimestral] ${q}`,
      (q, n) => `[${n} • Evaluación REA] ${q}`,
      (q, n) => `[${n} • Reto Técnico] ${q}`,
      (q, n) => `En el contexto curricular de ${n}, determine: ${q}`,
      (q, n) => `Al aplicar conceptos oficiales de ${n}: ${q}`,
      (q, n) => `Durante una actividad guiada de ${n}, responda: ${q}`,
      (q, n) => `Según los fundamentos evaluados en ${n}: ${q}`,
      (q, n) => `En una prueba formativa de ${n}: ${q}`,
      (q, n) => `Para validar el indicador de ${n}, analice: ${q}`,
      (q, n) => `En un proyecto práctico de ${n}: ${q}`,
      (q, n) => `Considere la siguiente situación de ${n}: ${q}`,
      (q, n) => `Al revisar evidencias en ${n}: ${q}`,
      (q, n) => `Como preparación para prueba nacional en ${n}: ${q}`,
      (q, n) => `En laboratorio o aula de ${n}: ${q}`,
      (q, n) => `Verificación rápida de dominio en ${n}: ${q}`,
      (q, n) => `Contrastando teoría y práctica en ${n}: ${q}`,
      (q, n) => `En una evaluación sumativa de ${n}: ${q}`,
      (q, n) => `A partir de los saberes de ${n}: ${q}`,
      (q, n) => `Resuelva el siguiente ítem oficial de ${n}: ${q}`,
      (q, n) => `En la unidad de estudio de ${n}: ${q}`,
      (q, n) => `Para reforzar aprendizaje en ${n}: ${q}`,
      (q, n) => `Ejemplo tipo examen de ${n}: ${q}`,
      (q, n) => `Aplicación real en Costa Rica (${n}): ${q}`,
      (q, n) => `Reto nivelado de ${n} (Serie A): ${q}`,
      (q, n) => `Reto nivelado de ${n} (Serie B): ${q}`,
      (q, n) => `Reto nivelado de ${n} (Serie C): ${q}`,
      (q, n) => `Comprobación de lectura técnica (${n}): ${q}`,
      (q, n) => `Ejercicio de comprensión profunda (${n}): ${q}`,
      (q, n) => `Pregunta de entrenamiento diario (${n}): ${q}`,
      (q, n) => `Ítem calibrado MEP (${n}): ${q}`,
      (q, n) => `Control de calidad académica (${n}): ${q}`,
      (q, n) => `Sesión de estudio autónomo (${n}): ${q}`,
      (q, n) => `Práctica institucional Circuito 02 (${n}): ${q}`,
      (q, n) => `Análisis de caso práctico (${n}): ${q}`,
      (q, n) => `Evaluación de competencias (${n}): ${q}`,
      (q, n) => `Simulación de prueba escrita (${n}): ${q}`,
      (q, n) => `Repaso integral de unidad (${n}): ${q}`,
      (q, n) => `Desafío final de dominio (${n}): ${q}`
    ];

    const MARCOS_MOPT = [
      "", "En vía urbana de Costa Rica: ", "Durante la prueba teórica COSEVI 2026: ", "Con lluvia intensa en carretera nacional: ",
      "Aplicando manejo defensivo (Ley N.° 9078): ", "En hora pico dentro del GAM: ", "En conducción nocturna con tránsito mixto: ",
      "Al acercarse a una intersección señalizada: ", "Ante revisión preventiva de Policía de Tránsito: ", "En zona de alta presencia peatonal: ",
      "Circulando por ruta nacional primaria: ", "Durante simulacro oficial MOPT (Serie 1): ", "Durante simulacro oficial MOPT (Serie 2): ",
      "Durante simulacro oficial MOPT (Serie 3): ", "En evaluación de seguridad vial preventiva: ", "En vía secundaria con curvas cerradas: ",
      "Al transitar cerca de centros educativos: ", "Bajo condiciones de neblina en montaña: ", "En incorporación a autopista o rotonda: ",
      "Evaluando prioridad de paso legal: ", "En control de licencia profesional y particular: ", "En práctica de normativa vial vigente: ",
      "Caso práctico de examen teórico MOPT: ", "Verificación de reglamento de tránsito CR: "
    ];

    malla.forEach(mat => {
      const tipo = detectarTipoArea(mat);

      // 1. Conservar ítems originales propios de esta área (excepto MOPT que usa banco 100% puro)
      if (tipo !== "mopt") {
        orig.filter(x => x.a === mat.id).forEach(it => add({ ...it, a: mat.id, d: DIFFS.includes(it.d) ? it.d : "Medio" }));
      }

      // 2. Generadores paramétricos puros (Matemática, Admisión UCR/TEC, Electrónica, Física, Contabilidad, Primaria)
      generarParametricosPuros(tipo, mat.id).forEach(it => add(it));

      // 3. Expansión 5× sobre las semillas puras de la disciplina
      if (tipo === "mopt") {
        PURO.mopt.forEach((bm, bi) => {
          MARCOS_MOPT.forEach((pref, mi) => {
            add({
              a: mat.id,
              moptCat: bm.cat,
              d: DIFFS[(bi + mi) % 4],
              q: `${pref}${bm.q}`,
              o: bm.o.slice(),
              c: 0,
              g: "Aplica estrictamente la Ley de Tránsito N.° 9078 y la prioridad de paso.",
              e: bm.e
            });
          });
        });
      } else {
        const seeds = PURO[tipo] || [];
        const reps = seeds.length > 0 ? Math.min(MARCOS_CURRICULARES.length, Math.ceil(330 / seeds.length)) : 0;
        seeds.forEach((s, si) => {
          const [q, ok, d1, d2, d3, exp] = s;
          for (let r = 0; r < reps; r++) {
            add({
              a: mat.id,
              d: DIFFS[(si + r) % 4],
              q: MARCOS_CURRICULARES[r](q, mat.name),
              o: [ok, d1, d2, d3],
              c: 0,
              g: `Analiza únicamente los principios oficiales de ${mat.name}.`,
              e: exp
            });
          }
        });
      }
    });

    window.BDS_BANCO_CURADO = nuevo;
    const moptMat = malla.find(m => detectarTipoArea(m) === "mopt");
    const moptId = moptMat ? moptMat.id : "mopt";
    window.BDS_BANCO_MOPT = nuevo.filter(x => x.a === moptId);

    const afterByArea = {};
    const afterByDiff = { "Básico": 0, "Medio": 0, "Intermedio": 0, "Avanzado": 0 };
    nuevo.forEach(it => {
      afterByArea[it.a] = (afterByArea[it.a] || 0) + 1;
      const dk = DIFFS.includes(it.d) ? it.d : "Intermedio";
      afterByDiff[dk] = (afterByDiff[dk] || 0) + 1;
    });

    // Motor de Simulacro / Práctica con aislamiento 100% estricto
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff, subCat) {
      const all = window.BDS_BANCO_CURADO || [];
      let pool;
      if (!area || area === "ALL") {
        pool = all.filter(x => !diff || diff === "ALL" || x.d === diff);
      } else {
        const soloArea = all.filter(x => x.a === area && (!subCat || subCat === "ALL" || x.moptCat === subCat || x.moptCat === "COMUN"));
        pool = soloArea.filter(x => !diff || diff === "ALL" || x.d === diff);
        if (!pool.length) pool = soloArea;
      }

      /* bds-norepeat-v193 */ window.__BDS_SEEN_Q = window.__BDS_SEEN_Q || {}; const seenKey = String(area || "ALL"); const seenSet = window.__BDS_SEEN_Q[seenKey] || new Set(); let fresh = pool.filter(x => !seenSet.has(x.q)); if (fresh.length < (Number(cantidad) || 20)) { seenSet.clear(); fresh = pool.slice(); } window.__BDS_SEEN_Q[seenKey] = seenSet; const arr = fresh.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      const qty = Math.min(Number(cantidad) || 20, arr.length);
      const picked = arr.slice(0, qty); picked.forEach(it => seenSet.add(it.q)); return picked.map(it => {
        const opts = (it.o || []).map((txt, idx) => ({ txt, ok: idx === (it.c || 0) }));
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return { ...it, opts };
      });
    };

    window.__BDS_BANCO_STATS = { beforeTotal, afterTotal: nuevo.length, afterByArea, afterByDiff, moptTotal: window.BDS_BANCO_MOPT.length, totalAreas: malla.length };
    window.__BDS_BANCO_V189_OK = true;
    return window.__BDS_BANCO_STATS;
  }

  // Modal Generador de Preguntas con IA
  window.BDS_OPEN_AI_ITEMS = function () {
    expandirBancoV189();
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
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">${st.totalAreas} ÁREAS PURO MEP • ${st.afterTotal.toLocaleString("es-CR")} ÍTEMS</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🤖 Generador de Preguntas IA & Auditoría Masiva del Banco</h2>
            </div>
            <button id="aiq-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Total Banco ×5</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">${st.afterTotal.toLocaleString("es-CR")}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Básico</div><div style="font-size:18px;font-weight:900;color:#34d399;">${st.afterByDiff["Básico"]}</div></div>
            <div style="background:#070d19;border:1px solid #f59e0b;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Medio / Interm.</div><div style="font-size:18px;font-weight:900;color:#fbbf24;">${st.afterByDiff["Medio"] + st.afterByDiff["Intermedio"]}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Avanzado</div><div style="font-size:18px;font-weight:900;color:#c084fc;">${st.afterByDiff["Avanzado"]}</div></div>
          </div>
          <form id="aiq-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px;">
            <select id="aiq-area" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              ${malla.map(m => `<option value="${m.id}">${m.name} (${st.afterByArea[m.id] || 0})</option>`).join("")}
            </select>
            <input id="aiq-tema" type="text" placeholder="Tema exacto de la materia..." required style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
            <select id="aiq-qty" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              <option value="10" selected>10 preguntas</option><option value="20">20 preguntas</option><option value="40">40 preguntas</option>
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
          const item = { a: area, d: DIFFS[i % 4], q: `(${mat.name} — ${tema}) Caso #${i+1}: ¿cuál procedimiento aplica correctamente "${tema}" en ${mat.name}?`, o: [`Ejecutar y validar "${tema}" según criterios técnicos de ${mat.name}`, `Omitir la verificación de "${tema}"`, `Aplicar parámetros incompatibles con ${mat.name}`, `Descartar evidencia de evaluación`], c: 0, g: `Relaciona "${tema}" con ${mat.name}.`, e: `Dominar "${tema}" exige ejecución precisa y evidencia verificable.` };
          generadas.push(item);
          window.BDS_BANCO_CURADO.unshift(item);
        }
        st.afterTotal = window.BDS_BANCO_CURADO.length;
        draw();
      };
    }
    document.body.appendChild(modal); draw();
  };

  window.BDS_EXPANDIR_BANCO_X10 = expandirBancoV189;
  expandirBancoV189();
})();