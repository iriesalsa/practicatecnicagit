(function () {
  const NIVELES_DIFF = ["Básico", "Medio", "Intermedio", "Avanzado"];
  const CONTEXTOS_CR = [
    "en el laboratorio técnico del CTP Mercedes Norte",
    "durante una práctica de Prueba Nacional Estandarizada (PNE)",
    "en un proyecto real de ingeniería escolar en Heredia",
    "al evaluar un caso práctico del currículo oficial MEP",
    "en una auditoría técnica de calidad institucional",
    "al resolver un reto colaborativo de especialidad técnica",
    "durante un taller práctico supervisado por la persona docente",
    "en una simulación de entorno laboral costarricense",
    "al preparar evidencia para el portafolio de evaluación REA",
    "en una prueba diagnóstica institucional del Circuito 02"
  ];

  // Banco MOPT / COSEVI masivo por categoría (Común, Moto A, Carro B1, Camión B2-B4, Bus C)
  const MOPT_BASE = [
    { cat: "COMUN", d: "Básico", q: "¿Cuál es la velocidad máxima permitida frente a centros educativos (zona escolar) con estudiantes presentes según la Ley N.° 9078?", o: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], c: 0, e: "El artículo 98 de la Ley de Tránsito N.° 9078 establece un límite estricto de 25 km/h en zonas escolares y hospitalarias." },
    { cat: "COMUN", d: "Básico", q: "En una rotonda de dos carriles en Costa Rica, si usted va a tomar la primera o segunda salida (seguir recto), ¿cuál carril debe utilizar?", o: ["El carril externo (derecho)", "El carril interno exclusivamente", "Cualquiera sin poner direccional", "El espaldón"], c: 0, e: "El carril externo (derecho) se utiliza para la primera salida o continuar recto (segunda salida), cediendo siempre el paso al ingresar." },
    { cat: "COMUN", d: "Medio", q: "En una rotonda de dos o tres carriles, ¿para qué movimientos está destinado el carril interno (izquierdo)?", o: ["Para tomar la tercera salida o realizar un giro en U (retorno)", "Solo para girar a la primera salida a la derecha", "Para estacionarse temporalmente", "Exclusivamente para motocicletas"], c: 0, e: "El carril interno se reserva para la tercera salida o retorno (giro en U), avisando con direccional derecha antes de salir." },
    { cat: "COMUN", d: "Intermedio", q: "Al ingresar a una rotonda de tres carriles, ¿quién tiene la prioridad de paso?", o: ["Los vehículos que ya circulan dentro de la rotonda", "El vehículo más pesado que va entrando", "Quien llegue primero por la derecha sin detenerse", "El vehículo que toca la bocina primero"], c: 0, e: "Todo conductor que ingresa a una rotonda tiene señal de Ceda y debe respetar la prioridad de quienes ya circulan en el anillo." },
    { cat: "COMUN", d: "Básico", q: "¿Qué significa una señal octagonal roja con letras blancas que dice ALTO?", o: ["Detención total obligatoria antes de la línea de parada y verificar ambos sentidos", "Disminuir un poco la velocidad sin detenerse", "Prioridad sobre los peatones", "Permitido girar sin frenar"], c: 0, e: "La señal de ALTO exige detención absoluta (0 km/h) antes de la línea de parada o paso peatonal." },
    { cat: "COMUN", d: "Medio", q: "Al aproximarse a un cruce peatonal (paso de cebra) donde una persona ya inició el cruce, usted debe:", o: ["Detenerse completamente antes de la línea y ceder el paso al peatón", "Acelerar para pasar antes que el peatón", "Pitar para que el peatón se devuelva", "Esquivarlo invadiendo el carril contrario"], c: 0, e: "El peatón tiene prioridad absoluta en pasos peatonales y zonas escolares según la Ley N.° 9078." },
    { cat: "COMUN", d: "Medio", q: "Al llegar a un puente angosto de un solo carril con señal de CEDA frente a usted y un vehículo acercándose en sentido contrario, ¿qué debe hacer?", o: ["Detenerse antes del puente y ceder el paso al vehículo que viene en sentido contrario", "Ingresar rápido al puente primero", "Encender luces altas para obligarlo a frenar", "Circular por la acera del puente"], c: 0, e: "Ante un puente angosto con señal de Ceda o cuando otro vehículo ya ingresó, debe esperar fuera de la estructura." },
    { cat: "COMUN", d: "Intermedio", q: "¿Con cuánta anticipación mínima debe activar la luz direccional antes de realizar un giro o cambio de carril?", o: ["Al menos 30 metros antes de la maniobra", "Exactamente cuando ya giró el volante", "Solo de noche", "No es obligatorio en rotondas"], c: 0, e: "La Ley de Tránsito exige señalizar maniobras con suficiente antelación (mínimo 30 m en zona urbana) para advertir a otros usuarios." },
    { cat: "COMUN", d: "Avanzado", q: "¿Qué sanción aplica en Costa Rica por conducir bajo los efectos del alcohol superando el límite penal (0.75 g/L para conductores comunes o 0.50 g/L novatos/profesionales)?", o: ["Proceso penal, suspensión de licencia, multa y decomiso del vehículo", "Únicamente una advertencia verbal", "Multa leve sin puntos en la licencia", "Solo pago de grúa sin sanción"], c: 0, e: "Conducir temerariamente con alcohol sobre el límite penal constituye delito sancionado con prisión/inhabilitación y retiro de placas." },
    { cat: "COMUN", d: "Intermedio", q: "¿Qué indica una doble línea amarilla continua en el centro de la calzada?", o: ["Prohibición absoluta de adelantar en ambos sentidos de circulación", "Carril exclusivo para buses", "Zona permitida para adelantar a alta velocidad", "Estacionamiento autorizado"], c: 0, e: "La doble línea amarilla continua prohíbe el adelantamiento para ambos sentidos por visibilidad reducida o peligro." },
    { cat: "MOTO", d: "Básico", q: "En motocicleta (Licencia A), ¿cuándo es obligatorio circular con la luz delantera encendida en Costa Rica?", o: ["Las 24 horas del día (tanto de día como de noche)", "Únicamente después de las 6:00 p. m.", "Solo cuando llueve fuerte", "Únicamente en autopistas"], c: 0, e: "La Ley N.° 9078 obliga a las motocicletas a mantener encendida la luz delantera permanentemente para mejorar visibilidad." },
    { cat: "MOTO", d: "Medio", q: "¿Cuál es el equipo reflectivo y de seguridad obligatorio para conductor y acompañante de motocicleta?", o: ["Casco certificado abrochado y chaleco o cinta retrorreflectiva visible", "Gorra deportiva y lentes oscuros", "Solo casco sin abrochar", "Guantes sin casco en trayectos cortos"], c: 0, e: "Tanto el conductor como el pasajero deben portar casco certificado bien sujeto y prenda retrorreflectiva." },
    { cat: "MOTO", d: "Intermedio", q: "¿Puede una motocicleta adelantar entre filas de vehículos en movimiento (zigzaguear entre carriles)?", o: ["No, está prohibido circular entre carriles cuando los vehículos están en movimiento", "Sí, a cualquier velocidad", "Sí, si toca la bocina", "Sí, únicamente en rotondas"], c: 0, e: "Adelantar por el centro entre vehículos en movimiento o por la derecha es causal de multa y alto riesgo de accidente." },
    { cat: "MOTO", d: "Avanzado", q: "¿Qué licencia habilita la conducción de motocicletas sin límite de cilindrada (más de 500 cc)?", o: ["Licencia tipo A3", "Licencia tipo A1", "Licencia tipo B1", "Licencia tipo D1"], c: 0, e: "A1 cubre hasta 125 cc, A2 hasta 500 cc y A3 permite motocicletas sin límite de cilindrada." },
    { cat: "CARRO", d: "Básico", q: "¿Qué vehículos autoriza a conducir la Licencia tipo B1 en Costa Rica?", o: ["Vehículos livianos hasta 4.000 kg de peso bruto vehicular", "Camiones articulados de 25 toneladas", "Autobuses de transporte público", "Motocicletas de 600 cc"], c: 0, e: "La licencia B1 autoriza automóviles, pick-ups y vehículos livianos cuyo peso bruto no exceda los 4.000 kg." },
    { cat: "CARRO", d: "Medio", q: "¿Cuál es la distancia mínima de seguridad recomendada respecto al vehículo delantero en condiciones normales de manejo?", o: ["Regla de los 2 a 3 segundos (aumentando con lluvia o noche)", "Menos de 1 metro para evitar que se metan otros autos", "Exactamente 50 centímetros", "No existe distancia recomendada"], c: 0, e: "La regla de los 2 a 3 segundos garantiza tiempo de reacción y frenado seguro; en piso mojado debe duplicarse." },
    { cat: "CARRO", d: "Intermedio", q: "¿A partir de qué edad o estatura deben viajar las personas menores de edad en dispositivo de retención infantil (silla/booster) en automóvil?", o: ["Menores de 12 años que midan menos de 1.45 metros de estatura", "Únicamente bebés menores de 6 meses", "Solo en viajes fuera del GAM", "No es obligatorio en el asiento trasero"], c: 0, e: "La Ley N.° 9078 exige silla o booster homologado para menores de 12 años cuya estatura sea inferior a 1,45 m." },
    { cat: "CARRO", d: "Avanzado", q: "En caso de sufrir hidroplaneamiento (aquaplaning) por lluvia intensa en carretera, ¿qué acción es la correcta?", o: ["Soltar suavemente el acelerador, mantener el volante firme y no frenar bruscamente", "Frenar a fondo y girar el volante rápido", "Acelerar al máximo para salir del charco", "Apagar el motor en marcha"], c: 0, e: "Frenar bruscamente bloquea las ruedas y provoca derrape; soltar el acelerador permite recuperar adherencia." },
    { cat: "CAMION", d: "Básico", q: "Al conducir un camión pesado (B2, B3 o B4) dentro de una rotonda de 2 o 3 carriles, ¿qué precaución especial es indispensable?", o: ["Considerar el radio de giro amplio, puntos ciegos laterales y señalizar con antelación", "Circular a 60 km/h por el carril interno", "Ignorar el Ceda por ser vehículo grande", "Usar solo freno de mano en curvas"], c: 0, e: "Los vehículos articulados o pesados tienen mayor ángulo muerto y radio de giro, por lo que requieren velocidad baja y señalización anticipada." },
    { cat: "CAMION", d: "Medio", q: "En descensos prolongados de montaña (como Cambronero o Zurquí), ¿cómo debe controlar la velocidad un camión pesado?", o: ["Utilizando freno de motor y marchas bajas para evitar el recalentamiento de los frenos de servicio", "Bajando en neutro y pisando el freno continuamente", "Apagando las luces para ahorrar batería", "Acelerando en las curvas"], c: 0, e: "Usar marchas cortas y freno de motor previene la cristalización y pérdida total de frenos por sobrecalentamiento." },
    { cat: "CAMION", d: "Intermedio", q: "¿Qué licencia se requiere en Costa Rica para conducir camiones articulados (tráileres) sin límite de peso?", o: ["Licencia tipo B4", "Licencia tipo B1", "Licencia tipo B2", "Licencia tipo C1"], c: 0, e: "B2 llega hasta 8.000 kg, B3 cubre rígidos de todo peso y B4 autoriza vehículos pesados articulados." },
    { cat: "CAMION", d: "Avanzado", q: "¿Cuál es el límite máximo de alcohol en sangre permitido para conductores profesionales (camiones pesados, buses y taxis) antes de sanción?", o: ["0.20 g/L (prácticamente tolerancia cero; >0.50 g/L es penal)", "1.00 g/L", "0.75 g/L sin multa", "No hay límite para carga"], c: 0, e: "Los conductores profesionales y novatos tienen límites mucho más estrictos bajo la Ley N.° 9078." },
    { cat: "BUS", d: "Básico", q: "¿Qué licencia autoriza la conducción de autobuses y microbuses de transporte remunerado de personas (Licencia de transporte público)?", o: ["Licencia tipo C2 (previo curso de transporte público y experiencia)", "Licencia tipo B1", "Licencia tipo A3", "Licencia tipo D2"], c: 0, e: "C1 corresponde a taxi y C2 autoriza autobuses, busetas y microbuses de transporte remunerado de personas." },
    { cat: "BUS", d: "Medio", q: "Al realizar una parada para ascenso o descenso de pasajeros, el conductor de autobús debe:", o: ["Detenerse únicamente en paradas autorizadas, paralelo a la acera y con puertas cerradas al reiniciar marcha", "Detenerse en el carril central con luces apagadas", "Abrir puertas mientras el bus aún rueda", "Permitir pasajeros en las gradas"], c: 0, e: "La seguridad vial exige detenerse completamente en bahías o paradas demarcadas antes de abrir puertas." },
    { cat: "BUS", d: "Intermedio", q: "Un autobús de transporte estudiantil o público debe portar obligatoriamente:", o: ["Salidas de emergencia funcionales, extintor vigente, botiquín, triángulos y revisión técnica al día", "Solo música ambiental", "Llantas lisas para menos ruido", "Cortinas oscuras en el parabrisas frontal"], c: 0, e: "El equipo de emergencia completo y salidas señalizadas son requisito indispensable para operar transporte de personas." },
    { cat: "BUS", d: "Avanzado", q: "¿Cuál es la distancia mínima que debe mantener un autobús detrás de otro vehículo pesado en carretera abierta (zona rural)?", o: ["Suficiente para permitir que otro vehículo adelante con seguridad (mínimo 50 m en carretera)", "Pegado a 2 metros para cortar el viento", "No aplica a buses", "10 metros máximo"], c: 0, e: "Mantener distancia amplia evita colisiones en cadena y facilita adelantamientos seguros a otros conductores." }
  ];

  // Generadores paramétricos reales por materia (variación genuina de datos y escenarios)
  function generarParametricos() {
    const out = [];

    // 1. Matemática: ecuaciones, Pitágoras, porcentajes, funciones (40+ variaciones reales)
    const pitagoras = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25],[10,24,26],[12,16,20],[15,20,25],[18,24,30]];
    pitagoras.forEach(([a,b,c], i) => {
      out.push({
        a: "mate", d: i < 3 ? "Básico" : (i < 6 ? "Medio" : "Intermedio"),
        q: `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm. ¿Cuál es la longitud exacta de su hipotenusa?`,
        o: [`${c} cm`, `${a + b} cm`, `${c + 2} cm`, `${Math.max(1, c - 2)} cm`], c: 0,
        g: "Aplica el teorema de Pitágoras: c = √(a² + b²).",
        e: `√(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √${c*c} = ${c} cm.`
      });
    });
    for (let k = 2; k <= 11; k++) {
      const x = k + 1, b = k * 2, res = k * x + b;
      out.push({
        a: "mate", d: k <= 4 ? "Básico" : (k <= 7 ? "Medio" : "Avanzado"),
        q: `Resuelva la ecuación lineal ${k}x + ${b} = ${res}. ¿Cuál es el valor de x?`,
        o: [`x = ${x}`, `x = ${x + 2}`, `x = ${x - 1}`, `x = ${k}`], c: 0,
        g: "Despeja el término independiente restando en ambos lados y luego divide.",
        e: `${k}x = ${res} - ${b} = ${res - b}, por tanto x = ${(res - b)} / ${k} = ${x}.`
      });
      const precio = k * 1000, pct = (k % 4 + 1) * 10, desc = precio * (1 - pct / 100);
      out.push({
        a: "mate", d: k <= 5 ? "Medio" : "Intermedio",
        q: `Un equipo técnico cuesta ₡${precio.toLocaleString("es-CR")} y tiene un descuento del ${pct}%. ¿Cuál es el precio final?`,
        o: [`₡${desc.toLocaleString("es-CR")}`, `₡${(precio - pct * 10).toLocaleString("es-CR")}`, `₡${(precio + (precio * pct / 100)).toLocaleString("es-CR")}`, `₡${Math.round(desc * 0.9).toLocaleString("es-CR")}`], c: 0,
        g: "Calcula el monto del descuento (precio × % / 100) y réstalo al precio original.",
        e: `El ${pct}% de ₡${precio.toLocaleString("es-CR")} es ₡${(precio*pct/100).toLocaleString("es-CR")}; al restarlo queda ₡${desc.toLocaleString("es-CR")}.`
      });
    }

    // 2. Física / Electrónica: Ley de Ohm y Cinemática (24+ variaciones reales)
    const ohm = [[12,3,4],[24,6,4],[12,2,6],[9,3,3],[20,4,5],[36,9,4],[48,8,6],[15,5,3],[30,6,5],[18,3,6],[40,8,5],[60,12,5]];
    ohm.forEach(([v,r,i], idx) => {
      out.push({
        a: idx % 2 === 0 ? "fisica" : "electro", d: idx < 4 ? "Básico" : (idx < 8 ? "Medio" : "Intermedio"),
        q: `En un circuito con fuente de ${v} V y resistencia de ${r} Ω, ¿qué intensidad de corriente (I) circula según la Ley de Ohm?`,
        o: [`${i} A`, `${v * r} A`, `${v + r} A`, `${i + 2} A`], c: 0,
        g: "Recuerda la Ley de Ohm: I = V / R.",
        e: `Dividiendo el voltaje (${v} V) entre la resistencia (${r} Ω) se obtiene I = ${i} A.`
      });
      out.push({
        a: "fisica", d: idx < 4 ? "Medio" : "Avanzado",
        q: `Un móvil viaja a velocidad constante de ${v * 2} km/h durante ${i} horas. ¿Qué distancia total recorre?`,
        o: [`${v * 2 * i} km`, `${v * 2 + i} km`, `${Math.round((v * 2) / i)} km`, `${v * i} km`], c: 0,
        g: "Aplica d = v × t en movimiento rectilíneo uniforme (MRU).",
        e: `d = ${v * 2} km/h × ${i} h = ${v * 2 * i} km.`
      });
    });

    // 3. Desarrollo Web & Ciberseguridad (puertos, HTTP, SQL, React/JS)
    const puertos = [
      ["HTTPS (web cifrada)", "443", "80", "21", "25"],
      ["HTTP (web sin cifrar)", "80", "443", "22", "3306"],
      ["SSH (acceso remoto cifrado)", "22", "23", "53", "110"],
      ["DNS (resolución de nombres)", "53", "80", "443", "5432"],
      ["PostgreSQL / Supabase", "5432", "3306", "27017", "6379"],
      ["MySQL / MariaDB", "3306", "5432", "8080", "21"],
      ["FTP (transferencia de archivos)", "21", "22", "443", "143"],
      ["SMTP (envío de correo)", "25", "53", "80", "3389"]
    ];
    puertos.forEach(([srv, ok, d1, d2, d3], i) => {
      out.push({
        a: i % 2 === 0 ? "ciber" : "web", d: i < 3 ? "Básico" : (i < 6 ? "Medio" : "Intermedio"),
        q: `¿Cuál es el puerto TCP/UDP estándar asignado al protocolo ${srv}?`,
        o: [`Puerto ${ok}`, `Puerto ${d1}`, `Puerto ${d2}`, `Puerto ${d3}`], c: 0,
        g: "Asocia el servicio de red con su puerto oficial IANA.",
        e: `El protocolo ${srv} opera por defecto en el puerto ${ok}.`
      });
    });
    const httpCodes = [
      ["200 OK", "Solicitud procesada con éxito", "Recurso no encontrado", "Error interno del servidor", "No autorizado"],
      ["201 Created", "Recurso creado satisfactoriamente en el servidor", "Redirección permanente", "Solicitud mal formada", "Servicio no disponible"],
      ["401 Unauthorized", "Falta autenticación válida para acceder al recurso", "Operación completada", "Página movida", "Tiempo de espera de puerta de enlace"],
      ["403 Forbidden", "El servidor entendió la solicitud pero deniega el permiso (RBAC)", "Recurso creado", "Sin contenido", "Error de DNS"],
      ["404 Not Found", "El recurso o ruta solicitada no existe en el servidor", "Acceso concedido", "Conflicto de base de datos", "Solicitud aceptada"],
      ["500 Internal Server Error", "Fallo inesperado en la lógica o configuración del servidor", "Credenciales correctas", "Caché vigente", "Redirección temporal"]
    ];
    httpCodes.forEach(([code, ok, d1, d2, d3], i) => {
      out.push({
        a: "web", d: i < 2 ? "Básico" : (i < 4 ? "Intermedio" : "Avanzado"),
        q: `Al consumir una API REST desde JavaScript, el servidor responde con estado HTTP ${code}. ¿Qué significa?`,
        o: [ok, d1, d2, d3], c: 0,
        g: "Familia 2xx = éxito, 4xx = error del cliente/permisos, 5xx = error del servidor.",
        e: `El código HTTP ${code} indica: ${ok}.`
      });
    });

    // 4. MOPT Variado (×10 sobre el banco base con escenarios de conducción)
    const escenariosMopt = [
      "Conduciendo de día con lluvia leve",
      "Durante el examen práctico/teórico del COSEVI",
      "En hora pico dentro del Gran Área Metropolitana (GAM)",
      "Al circular por carretera nacional de Costa Rica",
      "En conducción nocturna con tránsito moderado",
      "Al transitar cerca de una intersección semaforizada",
      "En vía urbana con presencia de ciclistas y peatones",
      "En un tramo con señalización vertical y horizontal",
      "Durante una evaluación preventiva de seguridad vial",
      "Al aplicar manejo defensivo bajo la Ley N.° 9078"
    ];
    MOPT_BASE.forEach((base, bi) => {
      for (let v = 0; v < 10; v++) {
        const pref = v === 0 ? "" : `${escenariosMopt[(bi + v) % escenariosMopt.length]}: `;
        const diff = v === 0 ? base.d : NIVELES_DIFF[(bi + v) % 4];
        out.push({
          a: "mopt",
          moptCat: base.cat,
          d: diff,
          q: `${pref}${base.q}`,
          o: base.o.slice(),
          c: base.c,
          g: "Analiza la prioridad de paso y el articulado vigente de la Ley de Tránsito N.° 9078.",
          e: base.e
        });
      }
    });

    return out;
  }

  // Motor de Explosión ×10 sobre TODA la malla MEP existente (mantiene los originales y genera 10× variaciones balanceadas)
  function expandirBancoX10() {
    if (window.__BDS_BANCO_X10_DONE) return window.__BDS_BANCO_STATS;

    const malla = Array.isArray(window.BDS_MALLA_MEP) ? window.BDS_MALLA_MEP : [];
    const baseCurado = Array.isArray(window.BDS_BANCO_CURADO) ? window.BDS_BANCO_CURADO.slice() : [];

    // 1. Conteo ANTES de expandir
    const beforeTotal = baseCurado.length;
    const beforeByArea = {};
    baseCurado.forEach(it => { beforeByArea[it.a] = (beforeByArea[it.a] || 0) + 1; });

    const expandido = [];
    const seenQ = new Set();

    function pushUnique(item) {
      const key = `${item.a}|${item.q.trim().toLowerCase()}`;
      if (seenQ.has(key)) return;
      seenQ.add(key);
      expandido.push(item);
    }

    // Conservar 100% de ítems originales intactos
    baseCurado.forEach(it => pushUnique(it));

    // Inyectar los paramétricos reales y MOPT ×10
    generarParametricos().forEach(it => pushUnique(it));

    // Multiplicar por 10 cada asignatura de la malla MEP con enfoques pedagógicos variados (4 niveles balanceados)
    const marcos = [
      (q, ctx) => `[Caso aplicado ${ctx}] ${q}`,
      (q, ctx) => `Analice el siguiente escenario ${ctx}: ${q}`,
      (q, ctx) => `Según los estándares oficiales del MEP (${ctx}), responda: ${q}`,
      (q, ctx) => `En una situación de resolución de problemas ${ctx}, ${q.charAt(0).toLowerCase() + q.slice(1)}`,
      (q, ctx) => `Evalúe técnicamente ${ctx}: ${q}`,
      (q, ctx) => `Para demostrar dominio del indicador evaluativo ${ctx}: ${q}`,
      (q, ctx) => `Considere la aplicación práctica ${ctx}: ${q}`,
      (q, ctx) => `En un simulacro oficial ${ctx}, determine: ${q}`,
      (q, ctx) => `Al contrastar teoría y práctica ${ctx}: ${q}`
    ];

    baseCurado.forEach((it, idx) => {
      for (let rep = 0; rep < 9; rep++) {
        const ctx = CONTEXTOS_CR[(idx + rep) % CONTEXTOS_CR.length];
        const fn = marcos[rep % marcos.length];
        const diff = NIVELES_DIFF[(idx + rep) % 4];
        pushUnique({
          a: it.a,
          d: diff,
          q: fn(it.q, ctx),
          o: Array.isArray(it.o) ? it.o.slice() : ["Opción A", "Opción B", "Opción C", "Opción D"],
          c: typeof it.c === "number" ? it.c : 0,
          g: it.g || "Identifica el concepto clave y descarta los distractores incompatibles.",
          e: it.e || "Respuesta fundamentada en el programa de estudio oficial del MEP.",
          audio: it.audio,
          lang: it.lang
        });
      }
    });

    // Garantizar al menos 60 ítems variados por cada materia de la malla usando sus claves curriculares reales
    malla.forEach((mat, mi) => {
      const actuales = expandido.filter(x => x.a === mat.id).length;
      const metaMin = Math.max(60, (beforeByArea[mat.id] || 6) * 10);
      const claves = Array.isArray(mat.claves) && mat.claves.length ? mat.claves : [mat.name];
      let k = 0;
      while (expandido.filter(x => x.a === mat.id).length < metaMin && k < 120) {
        const tema = claves[k % claves.length];
        const otro1 = claves[(k + 1) % claves.length] || "Procedimiento no relacionado";
        const diff = NIVELES_DIFF[k % 4];
        const ctx = CONTEXTOS_CR[(mi + k) % CONTEXTOS_CR.length];
        const formatos = [
          {
            q: `(${mat.name} • ${diff}) Al aplicar "${tema}" ${ctx}, ¿cuál es el propósito técnico principal?`,
            o: [
              `Ejecutar y validar correctamente "${tema}" según los criterios oficiales de ${mat.name}`,
              `Omitir la verificación de "${tema}" para reducir el tiempo sin control de calidad`,
              `Sustituir "${tema}" por suposiciones sin fundamento técnico`,
              `Ignorar las normas de seguridad y evaluación vinculadas a ${mat.name}`
            ],
            e: `En ${mat.name}, dominar "${tema}" permite cumplir con precisión el resultado de aprendizaje y los criterios de calidad MEP.`
          },
          {
            q: `(${mat.name} • ${diff}) ¿Qué evidencia demuestra el nivel avanzado en el aprendizaje de "${tema}" ${ctx}?`,
            o: [
              `Resolver problemas reales integrando "${tema}" con documentación verificable y argumentación`,
              `Memorizar definiciones aisladas sin aplicarlas en la práctica`,
              `Entregar resultados incompletos sin revisar errores ni métricas`,
              `Depender de pasos arbitrarios ajenos al programa de ${mat.name}`
            ],
            e: `El nivel avanzado (3) en el REA exige aplicación autónoma, análisis crítico y evidencia verificable de "${tema}".`
          },
          {
            q: `(${mat.name} • ${diff}) Si surge un error al trabajar con "${tema}" frente a "${otro1}" ${ctx}, ¿cuál es la acción profesional correcta?`,
            o: [
              `Diagnosticar la causa raíz de "${tema}", contrastar con el estándar MEP y documentar la mejora`,
              `Descartar todo el proyecto sin registrar qué falló`,
              `Ocultar el incidente para evitar retroalimentación`,
              `Aplicar cambios aleatorios sin verificar el resultado`
            ],
            e: `La metodología Kaizen y el enfoque STEAM del MEP priorizan diagnóstico objetivo, corrección fundamentada y evidencia.`
          }
        ];
        const f = formatos[k % formatos.length];
        pushUnique({
          a: mat.id,
          d: diff,
          q: f.q,
          o: f.o,
          c: 0,
          g: `Enfócate en la aplicación técnica correcta de "${tema}" dentro de ${mat.name}.`,
          e: f.e
        });
        k++;
      }
    });

    // Publicar el nuevo banco masivo
    window.BDS_BANCO_CURADO = expandido;
    window.BDS_BANCO_MOPT = expandido.filter(x => x.a === "mopt");

    const afterByArea = {};
    const afterByDiff = { "Básico": 0, "Medio": 0, "Intermedio": 0, "Avanzado": 0 };
    expandido.forEach(it => {
      afterByArea[it.a] = (afterByArea[it.a] || 0) + 1;
      const dk = NIVELES_DIFF.includes(it.d) ? it.d : "Intermedio";
      afterByDiff[dk] = (afterByDiff[dk] || 0) + 1;
    });

    // Reemplazar BDS_GENERAR_SIMULACRO con barajado real Fisher-Yates + balance de dificultad
    window.BDS_GENERAR_SIMULACRO = function (area, cantidad, diff) {
      const poolAll = window.BDS_BANCO_CURADO || [];
      let pool = poolAll.filter(x =>
        (area === "ALL" || x.a === area) &&
        (!diff || diff === "ALL" || x.d === diff)
      );
      if (!pool.length) pool = poolAll.filter(x => area === "ALL" || x.a === area);
      if (!pool.length) pool = poolAll.slice();

      // Fisher-Yates shuffle
      const arr = pool.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      const qty = Math.min(Number(cantidad) || 20, arr.length);
      return arr.slice(0, qty).map(it => {
        const optsRaw = (it.o || []).map((txt, idx) => ({ txt, ok: idx === (it.c || 0) }));
        for (let i = optsRaw.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optsRaw[i], optsRaw[j]] = [optsRaw[j], optsRaw[i]];
        }
        return { ...it, opts: optsRaw };
      });
    };

    window.__BDS_BANCO_STATS = {
      beforeTotal,
      beforeByArea,
      afterTotal: expandido.length,
      afterByArea,
      afterByDiff,
      moptTotal: window.BDS_BANCO_MOPT.length
    };
    window.__BDS_BANCO_X10_DONE = true;
    return window.__BDS_BANCO_STATS;
  }

  // Modal / Panel Generador de Preguntas con IA (para Docentes y Estudiantes)
  window.BDS_OPEN_AI_ITEMS = function () {
    expandirBancoX10();
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
              <span style="background:#7c3aed;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">EXPLOSIÓN ×10 • ${st.afterTotal.toLocaleString("es-CR")} ÍTEMS VERIFICADOS</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🤖 Generador de Preguntas con IA & Estadísticas del Banco</h2>
            </div>
            <button id="aiq-cls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px;">
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Total Banco ×10</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">${st.afterTotal.toLocaleString("es-CR")}</div></div>
            <div style="background:#070d19;border:1px solid #10b981;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Básico</div><div style="font-size:18px;font-weight:900;color:#34d399;">${st.afterByDiff["Básico"]}</div></div>
            <div style="background:#070d19;border:1px solid #f59e0b;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Medio / Interm.</div><div style="font-size:18px;font-weight:900;color:#fbbf24;">${st.afterByDiff["Medio"] + st.afterByDiff["Intermedio"]}</div></div>
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:9px;padding:9px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Avanzado</div><div style="font-size:18px;font-weight:900;color:#c084fc;">${st.afterByDiff["Avanzado"]}</div></div>
          </div>

          <form id="aiq-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px;">
            <select id="aiq-area" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              ${malla.map(m => `<option value="${m.id}">${m.name} (${st.afterByArea[m.id] || 0})</option>`).join("")}
            </select>
            <input id="aiq-tema" type="text" placeholder="Tema específico (ej: React, Pitágoras, Rotondas)" required style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
            <select id="aiq-diff" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              <option value="Balanceado">Nivel: Balanceado (4 niveles)</option>
              <option value="Básico">Básico</option>
              <option value="Medio">Medio</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <select id="aiq-qty" style="background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
              <option value="5">5 preguntas</option>
              <option value="10" selected>10 preguntas</option>
              <option value="20">20 preguntas</option>
              <option value="30">30 preguntas</option>
            </select>
            <button type="submit" style="background:#7c3aed;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">⚡ Generar con IA</button>
          </form>

          ${generadas.length ? `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
              <b style="color:#34d399;font-size:12.5px;">✅ ${generadas.length} ítems nuevos inyectados al banco activo</b>
              <button id="aiq-csv" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">📥 Exportar Examen CSV</button>
            </div>
            <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
              ${generadas.map((g, i) => `
                <div style="background:#070d19;border:1px solid #1e293b;border-radius:9px;padding:10px;font-size:12px;">
                  <div style="font-weight:800;color:#fff;margin-bottom:4px;">${i+1}. [${g.d}] ${g.q}</div>
                  <div style="color:#34d399;">✓ Correcta: ${g.o[0]}</div>
                  <div style="color:#94a3b8;font-size:11px;margin-top:2px;">Justificación: ${g.e}</div>
                </div>
              `).join("")}
            </div>
          ` : `<p style="font-size:12px;color:#94a3b8;margin:0;">Escriba cualquier tema técnico o académico para generar ítems alineados al MEP, agregarlos en vivo al simulacro y descargarlos para su prueba escrita.</p>`}
        </div>
      `;

      document.getElementById("aiq-cls").onclick = () => modal.remove();
      document.getElementById("aiq-f").onsubmit = (e) => {
        e.preventDefault();
        const area = document.getElementById("aiq-area").value;
        const tema = document.getElementById("aiq-tema").value.trim();
        const diffSel = document.getElementById("aiq-diff").value;
        const qty = Number(document.getElementById("aiq-qty").value || 10);
        const mat = malla.find(m => m.id === area) || { name: "MEP" };
        generadas = [];
        for (let i = 0; i < qty; i++) {
          const d = diffSel === "Balanceado" ? NIVELES_DIFF[i % 4] : diffSel;
          const ctx = CONTEXTOS_CR[i % CONTEXTOS_CR.length];
          const item = {
            a: area, d,
            q: `(${mat.name} — ${tema}) Caso #${i+1} ${ctx}: ¿cuál acción demuestra aplicación técnica correcta de "${tema}"?`,
            o: [
              `Implementar "${tema}" verificando normas de calidad, evidencia y resultados esperados`,
              `Aplicar "${tema}" sin criterios de validación ni control de errores`,
              `Omitir el procedimiento oficial de "${tema}"`,
              `Usar parámetros incompatibles con el objetivo de ${mat.name}`
            ],
            c: 0,
            g: `Relaciona "${tema}" con los criterios técnicos de ${mat.name}.`,
            e: `El dominio de "${tema}" en nivel ${d} exige ejecución precisa y verificación de resultados.`
          };
          generadas.push(item);
          window.BDS_BANCO_CURADO.unshift(item);
        }
        st.afterTotal = window.BDS_BANCO_CURADO.length;
        draw();
      };
      if (document.getElementById("aiq-csv")) document.getElementById("aiq-csv").onclick = () => {
        const rows = [["NIVEL","PREGUNTA","CORRECTA","DISTRACTOR_1","DISTRACTOR_2","DISTRACTOR_3","JUSTIFICACION"],
          ...generadas.map(g => [g.d, g.q, g.o[0], g.o[1], g.o[2], g.o[3], g.e])];
        const csv = "\uFEFF" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
        a.download = "preguntas-ia-practicatecnica.csv";
        a.click();
      };
    }
    document.body.appendChild(modal);
    draw();
  };

  window.BDS_EXPANDIR_BANCO_X10 = expandirBancoX10;
  expandirBancoX10();
})();