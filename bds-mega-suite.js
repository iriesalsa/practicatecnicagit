(function () {
  const BANCO_REAC_2026 = [
    // --- DESARROLLO DE SOFTWARE Y PROGRAMACIÓN (10°, 11°, 12°) ---
    {
      id: "SW-11-01",
      especialidad: "Desarrollo Web y Software",
      subarea: "Programación y Estructuras de Datos",
      nivel: "11° Nivel",
      unidad: "Unidad II: Lógica Algorítmica, Arreglos y Estructuras de Control",
      saber: "Complejidad algorítmica, búsqueda binaria, manejo de estados y estructuras iterativas.",
      indicadorCotidiano: "Implementa algoritmos de búsqueda y validación de datos optimizando el tiempo de respuesta (Niveles: 1-Identifica, 2-Estructura, 3-Optimiza sin errores).",
      pregunta: "En un arreglo ordenado de 1,024 expedientes estudiantiles, ¿cuántas comparaciones como máximo requiere el algoritmo de Búsqueda Binaria (O(log₂ n)) para localizar un registro?",
      opts: [
        "Máximo 10 comparaciones (log₂(1024) = 10)",
        "Máximo 512 comparaciones",
        "Exactamente 1,024 comparaciones",
        "100 comparaciones fijas"
      ],
      ans: 0,
      exp: "La búsqueda binaria divide el espacio a la mitad en cada paso: 2¹⁰ = 1,024; por tanto, resuelve la consulta en máximo 10 iteraciones."
    },
    {
      id: "SW-12-01",
      especialidad: "Desarrollo Web y Software",
      subarea: "Diseño de Software y Administración de la Calidad (SQA)",
      nivel: "12° Nivel",
      unidad: "Unidad I: Ingeniería de Requerimientos, Gestión de Riesgos y Calidad ISO/IEC 25010",
      saber: "Matriz de riesgos de planeación, prevención de deuda técnica, Scope Creep y atributos de calidad.",
      indicadorCotidiano: "Evalúa los riesgos de diseño anticipando fallos de seguridad, concurrencia y escalabilidad antes de la codificación.",
      pregunta: "¿Cuál es el impacto técnico y financiero directo de omitir la planeación de arquitectura y la matriz de riesgos al iniciar el desarrollo de un sistema?",
      opts: [
        "Genera deuda técnica severa: corregir un defecto arquitectónico o de seguridad en producción cuesta hasta 10 veces más que en la fase de diseño",
        "Elimina la necesidad de aplicar pruebas de integración y aceptación",
        "Reduce automáticamente la latencia de la base de datos relacional",
        "Evita que ocurra el fenómeno de Scope Creep (corrupción del alcance)"
      ],
      ans: 0,
      exp: "Según la ingeniería de software (Boehm / ISO 25010), la detección temprana en el diseño previene vulnerabilidades estructurales y costos exponenciales en producción."
    },
    {
      id: "SW-12-02",
      especialidad: "Desarrollo Web y Software",
      subarea: "Diseño de Software y Bases de Datos",
      nivel: "12° Nivel",
      unidad: "Unidad III: Arquitectura Segura, RBAC y Persistencia Relacional",
      saber: "Control de acceso basado en roles (RBAC), prevención de inyección SQL y normalización (1FN, 2FN, 3FN).",
      indicadorCotidiano: "Diseña esquemas relacionales en 3FN y políticas de control de sesión resistentes a ataques de fuerza bruta.",
      pregunta: "Para cumplir la Tercera Forma Normal (3FN) en una base de datos institucional y proteger el acceso, se requiere que:",
      opts: [
        "Esté en 2FN y ningún atributo no-clave dependa transitivamente de la llave primaria, integrando control RBAC por rol",
        "Todas las tablas se unan en un solo archivo plano sin llaves foráneas",
        "Se repitan los nombres del departamento en cada fila de calificaciones",
        "Las contraseñas se guarden en texto plano dentro del frontend"
      ],
      ans: 0,
      exp: "La 3FN elimina las dependencias transitivas para evitar anomalías de actualización, inserción y borrado."
    },

    // --- CIBERSEGURIDAD Y REDES (10°, 11°, 12°) ---
    {
      id: "NET-11-01",
      especialidad: "Ciberseguridad y Redes",
      subarea: "Enrutamiento y Conmutación (Subneteo VLSM)",
      nivel: "11° Nivel",
      unidad: "Unidad II: Direccionamiento IPv4 con Máscara de Longitud Variable (VLSM)",
      saber: "Cálculo de prefijos CIDR, máscaras decimales, rangos útiles y broadcast según demanda de hosts.",
      indicadorCotidiano: "Segmenta bloques de red IPv4 aplicando VLSM de mayor a menor demanda sin solapamiento de subredes.",
      pregunta: "Dada la red 172.16.10.0/24, se requiere crear primero la subred para Laboratorios (100 hosts) y enseguida la subred para Wi-Fi Estudiantil (50 hosts). ¿Cuáles son los prefijos y direcciones de red exactos?",
      opts: [
        "Labs: 172.16.10.0/25 (Máscara .128) | Wi-Fi: 172.16.10.128/26 (Máscara .192)",
        "Labs: 172.16.10.0/26 | Wi-Fi: 172.16.10.64/26",
        "Labs: 172.16.10.0/24 | Wi-Fi: 172.16.10.128/27",
        "Labs: 172.16.10.0/27 | Wi-Fi: 172.16.10.32/25"
      ],
      ans: 0,
      exp: "100 hosts requieren 7 bits (2⁷-2=126 -> /25, de .0 a .127). El siguiente bloque libre inicia en 172.16.10.128 y para 50 hosts usa 6 bits (2⁶-2=62 -> /26)."
    },
    {
      id: "NET-11-02",
      especialidad: "Ciberseguridad y Redes",
      subarea: "Subneteo de Longitud Fija (FLSM) y Sistemas Numéricos",
      nivel: "10° Nivel",
      unidad: "Unidad I: Conversión Binario, Octal, Decimal y Hexadecimal aplicado a Redes",
      saber: "Conversión posicional entre bases 2, 8, 10 y 16; división simétrica de redes FLSM.",
      indicadorCotidiano: "Convierte octetos y hextetos entre sistemas numéricos para diagnosticar máscaras y direcciones físicas MAC/IPv6.",
      pregunta: "¿Cuál es la representación exacta del valor decimal 240 (octeto de una máscara /28) en Binario, Octal y Hexadecimal?",
      opts: [
        "Binario: 11110000 | Octal: 360 | Hexadecimal: F0",
        "Binario: 11100000 | Octal: 340 | Hexadecimal: E0",
        "Binario: 11000000 | Octal: 300 | Hexadecimal: C0",
        "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"
      ],
      ans: 0,
      exp: "128+64+32+16 = 240 -> 11110000₂. En tríos (011 110 000) es 360₈, y en nibbles (1111 0000) es F0₁₆."
    },
    {
      id: "NET-12-01",
      especialidad: "Ciberseguridad y Redes",
      subarea: "Arquitectura IPv6, Protocolos y Seguridad Perimetral",
      nivel: "12° Nivel",
      unidad: "Unidad III: Implementación de IPv6 (RFC 5952), ICMPv6 NDP y SLAAC",
      saber: "Compresión de hextetos IPv6, prefijos Link-Local (fe80::/10), GUA (2000::/3) y descubrimiento de vecinos.",
      indicadorCotidiano: "Configura direccionamiento IPv6 aplicando las reglas de compresión RFC 5952 y verifica mensajes RS/RA/NS/NA.",
      pregunta: "En una red IPv6, ¿cuál es la dirección comprimida correcta de 2001:0db8:0000:0000:00f0:0000:0000:0001 y qué protocolo sustituye al ARP de IPv4?",
      opts: [
        "2001:db8::f0:0:0:1 | Lo sustituye NDP (Neighbor Discovery Protocol) sobre ICMPv6 (mensajes NS 135 y NA 136)",
        "2001:db8::f0::1 | Lo sustituye RARP sobre UDP",
        "2001:0db8:0:f0::1 | Lo sustituye Broadcast ff02::1",
        "2001:db8:0:0:f::1 | Lo sustituye NAT64 estático"
      ],
      ans: 0,
      exp: "Se eliminan ceros iniciales (0db8->db8, 00f0->f0, 0001->1) y se aplica '::' una sola vez. En IPv6 no existe ARP ni Broadcast; se usa ICMPv6 NDP."
    },

    // --- PRODUCTIVIDAD: EXCEL Y WORD TÉCNICO (10°, 11°, 12°) ---
    {
      id: "OFF-10-01",
      especialidad: "Tecnologías de Información y Ofimática",
      subarea: "Hojas de Cálculo Avanzadas (Excel) y Procesamiento Técnico (Word)",
      nivel: "10° Nivel",
      unidad: "Unidad II: Funciones Lógicas Anidadas, Búsqueda Matricial y Documentación IEEE",
      saber: "Funciones SI, Y, O, BUSCARX, CONTAR.SI.CONJUNTO, saltos de sección y tablas de contenido automáticas.",
      indicadorCotidiano: "Automatiza planillas de control e informes técnicos aplicando funciones lógicas y estilos jerárquicos.",
      pregunta: "En Excel, se requiere evaluar en la celda F2 si el estudiante tiene Promedio (D2) >= 70 Y Asistencia (E2) >= 80% para mostrar 'APROBADO', de lo contrario 'PENDIENTE'. ¿Cuál es la sintaxis exacta?",
      opts: [
        "=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")",
        "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")",
        "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")",
        "=CONTAR.SI(D2:E2; \">=70\"; \"APROBADO\")"
      ],
      ans: 0,
      exp: "La función lógica Y() exige que TODAS las condiciones internas se cumplan simultáneamente para devolver VERDADERO al SI principal."
    },

    // --- CONTABILIDAD Y FINANZAS (10°, 11°, 12°) ---
    {
      id: "CONT-11-01",
      especialidad: "Contabilidad y Finanzas",
      subarea: "Contabilidad Financiera, Tributaria y Costos (NIIF)",
      nivel: "11° Nivel",
      unidad: "Unidad I: Ciclo Contable, IVA Ley 9635, Depreciación y Razones Financieras",
      saber: "Asientos de diario por partida doble, crédito fiscal IVA, depreciación y liquidez (Prueba Ácida).",
      indicadorCotidiano: "Registra transacciones comerciales con IVA y calcula indicadores de liquidez y depreciación de activos.",
      pregunta: "Se adquiere maquinaria industrial por ₡5,000,000 + 13% IVA al contado, con valor residual de ₡500,000 y vida útil de 5 años. ¿Cuál es el IVA soportado y la depreciación anual por línea recta?",
      opts: [
        "IVA Soportado: ₡650,000 | Depreciación anual: ₡900,000 (₡75,000/mes)",
        "IVA Soportado: ₡500,000 | Depreciación anual: ₡1,000,000",
        "IVA Soportado: ₡650,000 | Depreciación anual: ₡1,100,000",
        "IVA Soportado: ₡325,000 | Depreciación anual: ₡450,000"
      ],
      ans: 0,
      exp: "IVA = 5,000,000 * 0.13 = ₡650,000. Depreciación anual = (5,000,000 - 500,000) / 5 = ₡900,000."
    },

    // --- ELECTRÓNICA INDUSTRIAL Y TELECOMUNICACIONES (10°, 11°, 12°) ---
    {
      id: "ELEC-11-01",
      especialidad: "Electrónica Industrial",
      subarea: "Análisis de Circuitos DC/AC y Sistemas Digitales",
      nivel: "11° Nivel",
      unidad: "Unidad II: Leyes de Ohm, Watt, Kirchhoff y Compuertas Lógicas",
      saber: "Cálculo de circuitos mixtos serie-paralelo, disipación de potencia y álgebra de Boole.",
      indicadorCotidiano: "Calcula magnitudes eléctricas (V, I, R, P) y verifica tablas de verdad en sistemas combinacionales.",
      pregunta: "Dos resistencias en paralelo de 20 Ω cada una están conectadas en serie con otra resistencia de 10 Ω a una fuente de 40V DC. ¿Cuál es la resistencia total (Req) y la corriente total (It)?",
      opts: [
        "Req = 20 Ω | Corriente Total = 2 A | Potencia Total = 80 W",
        "Req = 50 Ω | Corriente Total = 0.8 A | Potencia Total = 32 W",
        "Req = 10 Ω | Corriente Total = 4 A | Potencia Total = 160 W",
        "Req = 30 Ω | Corriente Total = 1.33 A | Potencia Total = 53 W"
      ],
      ans: 0,
      exp: "El paralelo de 20 Ω || 20 Ω equivale a 10 Ω. Sumado en serie con la de 10 Ω da Req = 20 Ω. It = 40V / 20 Ω = 2 A; P = 40V * 2A = 80 W."
    },

    // --- SECRETARIADO EJECUTIVO Y CENTROS DE SERVICIO (10°, 11°, 12°) ---
    {
      id: "EJEC-12-01",
      especialidad: "Secretariado Ejecutivo",
      subarea: "Gestión Documental, Archivística y Comunicación Corporativa",
      nivel: "12° Nivel",
      unidad: "Unidad I: Ley 7202 del Sistema Nacional de Archivos, Oficios y Métricas SLA",
      saber: "Tablas de plazos de conservación, ciclo vital del documento y resolución en el primer contacto (FCR).",
      indicadorCotidiano: "Elabora comunicaciones oficiales y clasifica fondos documentales respetando el principio de procedencia.",
      pregunta: "En archivística institucional bajo la Ley 7202, el principio fundamental que establece que los documentos producidos por una institución u oficina no deben mezclarse con los de otras se denomina:",
      opts: [
        "Principio de Procedencia y Orden Original",
        "Descarte discrecional administrativo",
        "Indexación alfabética simple",
        "Foliado inverso temporal"
      ],
      ans: 0,
      exp: "El Principio de Procedencia garantiza la integridad orgánica y el valor probatorio del fondo documental."
    },

    // --- ADMINISTRACIÓN, LOGÍSTICA Y ADUANAS (10°, 11°, 12°) ---
    {
      id: "LOG-12-01",
      especialidad: "Administración y Logística",
      subarea: "Cadena de Abastecimiento, Inventarios e Incoterms 2020",
      nivel: "12° Nivel",
      unidad: "Unidad II: Modelos EOQ, Punto de Reorden (ROP), Pareto ABC y Comercio Internacional",
      saber: "Cálculo de lote económico, stock de seguridad, rotación FEFO/PEPS y responsabilidades Incoterms.",
      indicadorCotidiano: "Determina el punto de reorden y selecciona el Incoterm óptimo según el modo de transporte y transferencia de riesgo.",
      pregunta: "¿En cuál Incoterm 2020 el vendedor asume TODOS los costos, transporte, seguro y trámites aduaneros de importación hasta dejar la mercancía lista para descargar en el destino final del comprador?",
      opts: [
        "DDP (Delivered Duty Paid / Entregada Derechos Pagados)",
        "EXW (Ex Works / En Fábrica)",
        "FOB (Free On Board / Libre a Bordo)",
        "FCA (Free Carrier / Franco Porteador)"
      ],
      ans: 0,
      exp: "DDP representa la máxima obligación para el vendedor, incluyendo impuestos y aduana de importación en el país de destino."
    },

    // --- ACADÉMICAS Y TERCER CICLO / DIVERSIFICADA (7° a 12°) ---
    {
      id: "ACAD-09-01",
      especialidad: "Académicas y Pruebas Nacionales (7° a 12°)",
      subarea: "Matemáticas, Ciencias, Español, Cívica e Inglés Técnico",
      nivel: "7° a 12° Nivel",
      unidad: "Unidad REAC 2026: Razonamiento Lógico-Matemático, Comprensión Lectora y Ciudadanía",
      saber: "Resolución de funciones, probabilidad, inferencia textual y derechos constitucionales.",
      indicadorCotidiano: "Resuelve problemas contextualizados aplicando modelos algebraicos y análisis crítico de textos.",
      pregunta: "El costo mensual C(x) en colones de mantener un servidor en la nube está dado por la función lineal C(x) = 150x + 12,000, donde 'x' es la cantidad de gigabytes transferidos. Si la factura del mes fue de ₡42,000, ¿cuántos gigabytes se transfirieron?",
      opts: [
        "200 GB",
        "280 GB",
        "150 GB",
        "360 GB"
      ],
      ans: 0,
      exp: "42,000 = 150x + 12,000 -> 30,000 = 150x -> x = 30,000 / 150 = 200 GB."
    }
  ];

  window.abrirMegaSuiteEducativa = function () {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let xp = parseInt(localStorage.getItem('bds_xp_points') || '500', 10);
    let filtroEsp = 'TODAS';
    let idx = 0;

    const especialidadesUnicas = ['TODAS', ...new Set(BANCO_REAC_2026.map(x => x.especialidad))];

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.96);z-index:100001;overflow-y:auto;padding:18px;font-family:system-ui,sans-serif;color:#fff;';

    function getListaFiltrada() {
      if (filtroEsp === 'TODAS') return BANCO_REAC_2026;
      return BANCO_REAC_2026.filter(x => x.especialidad === filtroEsp);
    }

    function pintar() {
      const lista = getListaFiltrada();
      if (idx >= lista.length) idx = 0;
      const item = lista[idx];

      wrap.innerHTML = `
        <div style="max-width:1080px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:20px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <!-- Encabezado REAC 2026 -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="background:#06b6d4;color:#020617;font-weight:900;font-size:11px;padding:3px 8px;border-radius:6px;">REAC 2026 OFICIAL</span>
                <h2 style="margin:0;font-size:19px;color:#22d3ee;">🦉 Ecosistema Curricular MEP — CTP Mercedes Norte</h2>
              </div>
              <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Saberes Esenciales • Indicadores de Trabajo Cotidiano (Rúbrica 1-3) • Simuladores Técnicos • Pruebas por Nivel (7° a 12°)</p>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
              <span id="bds-xp-badge" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:800;">⚡ ${xp} XP</span>
              <button id="bds-close-suite" style="background:#ef4444;color:#fff;border:none;padding:8px 15px;border-radius:10px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- 4 Simuladores de Laboratorio en Vivo -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px;margin-bottom:18px;">
            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#34d399;margin-bottom:6px;">🔢 1. Conversor Dec / Bin / Oct / Hex</div>
              <input id="sim-dec" type="number" value="224" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;margin-bottom:6px;font-size:12px;"/>
              <div id="sim-bases-out" style="font-family:monospace;font-size:11px;line-height:1.6;color:#e2e8f0;">
                Bin: <b style="color:#22d3ee;">11100000</b><br/>Oct: <b style="color:#fbbf24;">340</b> | Hex: <b style="color:#34d399;">0xE0</b>
              </div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#22d3ee;margin-bottom:6px;">🌐 2. Subneteo IPv4 FLSM/VLSM</div>
              <input id="sim-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
              <div id="sim-cidr-out" style="font-family:monospace;font-size:11px;line-height:1.6;color:#e2e8f0;">
                Prefijo: <b>/26</b> (.192)<br/>Salto: <b>64</b> | Útiles: <b style="color:#34d399;">62 hosts</b>
              </div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#c084fc;margin-bottom:6px;">🚀 3. Compresor IPv6 (RFC 5952)</div>
              <input id="sim-ipv6" type="text" value="2001:0db8:0000:0000:00f0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;font-size:11px;font-family:monospace;margin-bottom:6px;"/>
              <div id="sim-ipv6-out" style="font-family:monospace;font-size:11px;color:#e9d5ff;word-break:break-all;">
                RFC 5952: <b>2001:db8::f0:0:0:1</b>
              </div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#fbbf24;margin-bottom:6px;">📊 4. Simulador Nota REAC / Excel</div>
              <div style="display:flex;gap:6px;margin-bottom:6px;">
                <input id="sim-nota" type="number" value="82" min="0" max="100" placeholder="Nota" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:8px;font-size:12px;"/>
                <input id="sim-asis" type="number" value="90" min="0" max="100" placeholder="% Asist" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:8px;font-size:12px;"/>
              </div>
              <div id="sim-excel-out" style="font-family:monospace;font-size:11px;color:#fde68a;">
                Estado: <b style="color:#34d399;">APROBADO (Nivel 3 Avanzado)</b>
              </div>
            </div>
          </div>

          <!-- Selector de Especialidad / Materia -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
            ${especialidadesUnicas.map(esp => `
              <button data-esp="${esp}" class="bds-esp-tab" style="padding:7px 12px;border-radius:10px;border:1px solid ${filtroEsp === esp ? '#22d3ee' : '#334155'};background:${filtroEsp === esp ? '#06b6d4' : '#0f172a'};color:${filtroEsp === esp ? '#020617' : '#cbd5e1'};font-size:11px;font-weight:800;cursor:pointer;">
                ${esp}
              </button>
            `).join('')}
          </div>

          <!-- Tarjeta Curricular REAC 2026 + Pregunta Interactiva -->
          <div style="background:#071220;border:1px solid #06b6d4;padding:18px;border-radius:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <span style="background:#083344;color:#22d3ee;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:800;">${item.especialidad}</span>
                <span style="background:#1e1b4b;color:#a5b4fc;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:800;">${item.nivel}</span>
                <span style="background:#064e3b;color:#6ee7b7;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;">${item.subarea}</span>
              </div>
              <span style="font-size:12px;color:#94a3b8;font-weight:700;">Ítem ${idx + 1} de ${lista.length}</span>
            </div>

            <!-- Desglose Oficial MEP: Unidad, Saber Esencial e Indicador de Trabajo Cotidiano -->
            <div style="background:#0b192c;border-left:4px solid #06b6d4;padding:10px 12px;border-radius:8px;margin-bottom:14px;font-size:12px;line-height:1.5;color:#cbd5e1;">
              <div><b style="color:#22d3ee;">📚 ${item.unidad}</b></div>
              <div><b style="color:#fbbf24;">🎯 Saber Esencial:</b> ${item.saber}</div>
              <div><b style="color:#34d399;">📋 Indicador Trabajo Cotidiano (REAC 2026):</b> ${item.indicadorCotidiano}</div>
            </div>

            <div style="font-size:15px;font-weight:800;margin-bottom:14px;color:#f8fafc;">${item.pregunta}</div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${item.opts.map((op, i) => `
                <button data-i="${i}" class="bds-opt-btn" style="text-align:left;background:#112236;border:1px solid #334155;color:#fff;padding:11px 14px;border-radius:10px;font-size:13px;cursor:pointer;">
                  <b>${String.fromCharCode(65 + i)})</b> ${op}
                </button>
              `).join('')}
            </div>

            <div id="bds-feedback-box" style="margin-top:12px;font-size:12px;"></div>

            <div style="display:flex;justify-content:space-between;margin-top:14px;">
              <button id="bds-prev-q" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">⬅ Ítem Anterior</button>
              <button id="bds-next-q" style="background:#06b6d4;color:#020617;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Siguiente Ítem REAC ➡</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('bds-close-suite').onclick = () => wrap.remove();
      document.getElementById('bds-prev-q').onclick = () => { idx = (idx - 1 + lista.length) % lista.length; pintar(); };
      document.getElementById('bds-next-q').onclick = () => { idx = (idx + 1) % lista.length; pintar(); };

      document.querySelectorAll('.bds-esp-tab').forEach(tab => {
        tab.onclick = () => {
          filtroEsp = tab.getAttribute('data-esp');
          idx = 0;
          pintar();
        };
      });

      document.querySelectorAll('.bds-opt-btn').forEach(btn => {
        btn.onclick = () => {
          const sel = parseInt(btn.getAttribute('data-i'), 10);
          const fb = document.getElementById('bds-feedback-box');
          if (sel === item.ans) {
            xp += 30;
            localStorage.setItem('bds_xp_points', String(xp));
            document.getElementById('bds-xp-badge').innerText = '⚡ ' + xp + ' XP';
            fb.innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:11px;border-radius:10px;color:#ecfdf5;">✅ <b>¡Dominio Avanzado (Nivel 3 REAC • +30 XP)!</b> ${item.exp}</div>`;
          } else {
            fb.innerHTML = `<div style="background:#450a0a;border:1px solid #ef4444;padding:11px;border-radius:10px;color:#fecaca;">❌ <b>Retroalimentación Formativa (Nivel 1 Inicial):</b> ${item.exp}</div>`;
          }
        };
      });

      const inpDec = document.getElementById('sim-dec');
      inpDec.oninput = () => {
        const n = Math.max(0, Math.min(65535, parseInt(inpDec.value || '0', 10)));
        document.getElementById('sim-bases-out').innerHTML = `Bin: <b style="color:#22d3ee;">${n.toString(2).padStart(8, '0')}</b><br/>Oct: <b style="color:#fbbf24;">${n.toString(8)}</b> | Hex: <b style="color:#34d399;">0x${n.toString(16).toUpperCase()}</b>`;
      };

      const inpCidr = document.getElementById('sim-cidr');
      inpCidr.oninput = () => {
        const c = parseInt(inpCidr.value, 10);
        const hosts = Math.pow(2, 32 - c) - 2;
        const oct = 256 - Math.pow(2, 32 - c);
        const salto = 256 - oct;
        document.getElementById('sim-cidr-out').innerHTML = `Prefijo: <b>/${c}</b> (.${oct})<br/>Salto: <b>${salto}</b> | Útiles: <b style="color:#34d399;">${hosts} hosts</b>`;
      };

      const inpV6 = document.getElementById('sim-ipv6');
      inpV6.oninput = () => {
        const parts = inpV6.value.trim().split(':').map(x => x.replace(/^0+/, '') || '0');
        const comp = parts.join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
        document.getElementById('sim-ipv6-out').innerHTML = `RFC 5952: <b>${comp}</b>`;
      };

      const evalExcel = () => {
        const nota = parseFloat(document.getElementById('sim-nota').value || '0');
        const asis = parseFloat(document.getElementById('sim-asis').value || '0');
        let res = 'REPROBADO (Nivel 1)';
        let col = '#f87171';
        if (nota >= 70 && asis >= 80) { res = 'APROBADO (Nivel 3 Avanzado)'; col = '#34d399'; }
        else if (nota >= 60 && asis >= 80) { res = 'AMPLIACIÓN (Nivel 2 Intermedio)'; col = '#fbbf24'; }
        document.getElementById('sim-excel-out').innerHTML = `Estado: <b style="color:${col};">${res}</b>`;
      };
      document.getElementById('sim-nota').oninput = evalExcel;
      document.getElementById('sim-asis').oninput = evalExcel;
    }

    document.body.appendChild(wrap);
    pintar();
  };
})();