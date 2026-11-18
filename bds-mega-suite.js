(function () {
  function barajarOpciones(lista) {
    const vistos = new Set();
    const unicas = [];
    for (const p of lista) {
      if (!vistos.has(p.id)) { vistos.add(p.id); unicas.push(p); }
    }
    return unicas.map(item => {
      const pares = item.opts.map((texto, idx) => ({ texto, ok: idx === item.ans }));
      for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pares[i]; pares[i] = pares[j]; pares[j] = t;
      }
      return { ...item, optsMix: pares.map(p => p.texto), ansMix: pares.findIndex(p => p.ok) };
    });
  }

  // Bancos Completos por Nivel y Especialidad (Primaria, Secundaria, CTP y Admisión Universitaria)
  const BANCOS_MULTIVERSO = {
    "Matemáticas MEP (Secundaria y CTP)": [
      { id: "MAT-01", q: "Sea la función lineal f(x) = 3x - 6. ¿Cuál es el punto de intersección de la gráfica con el eje X (raíz de la función)?", opts: ["(2, 0)", "(0, -6)", "(-2, 0)", "(3, -6)"], ans: 0, exp: "La intersección con el eje X ocurre cuando f(x) = 0 -> 3x - 6 = 0 -> 3x = 6 -> x = 2. Por tanto, el par ordenado es (2, 0)." },
      { id: "MAT-02", q: "La ecuación de una circunferencia con centro en C(-3, 4) y radio r = 5 corresponde a:", opts: ["(x + 3)² + (y - 4)² = 25", "(x - 3)² + (y + 4)² = 25", "(x + 3)² + (y - 4)² = 5", "(x - 3)² + (y - 4)² = 10"], ans: 0, exp: "Por la ecuación canónica (x - h)² + (y - k)² = r², al sustituir h = -3, k = 4 y r = 5 se obtiene (x + 3)² + (y - 4)² = 25." },
      { id: "MAT-03", q: "Si en una caja hay 4 bolas azules, 3 rojas y 3 verdes, ¿cuál es la probabilidad de extraer al azar una bola que NO sea roja?", opts: ["7/10 (70%)", "3/10 (30%)", "4/10 (40%)", "1/3 (33.3%)"], ans: 0, exp: "Hay 10 bolas en total y 7 que no son rojas (4 azules + 3 verdes). La probabilidad favorable es 7/10 = 0.70 (70%)." },
      { id: "MAT-04", q: "El vértice de la función cuadrática f(x) = x² - 4x + 7 se localiza en el punto:", opts: ["(2, 3)", "(-2, 19)", "(4, 7)", "(2, -3)"], ans: 0, exp: "El eje de simetría es x = -b/(2a) = -(-4)/(2·1) = 2. Evaluando f(2) = 2² - 4(2) + 7 = 3. Vértice: (2, 3)." },
      { id: "MAT-05", q: "En un triángulo rectángulo cuyos catetos miden 6 cm y 8 cm, ¿cuál es la longitud exacta de la hipotenusa?", opts: ["10 cm", "14 cm", "12 cm", "48 cm"], ans: 0, exp: "Por el Teorema de Pitágoras: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm." }
    ],
    "Desarrollo Web y Diseño de Software": [
      { id: "SW-01", q: "En React (.jsx), ¿cuál hook permite ejecutar efectos secundarios (como peticiones fetch o suscripciones) después del renderizado?", opts: ["useEffect()", "useState()", "useContext()", "useMemo()"], ans: 0, exp: "useEffect gestiona el ciclo de vida y efectos secundarios en componentes funcionales." },
      { id: "SW-02", q: "Según la norma ISO/IEC 25010, omitir la matriz de riesgos y la planeación de arquitectura antes de programar ocasiona:", opts: ["Deuda técnica severa: corregir un error en producción cuesta hasta 10 veces más que prevenirlo en el diseño", "Menor tiempo total de pruebas de integración", "Compilación automática sin errores de sintaxis", "Reducción del uso de memoria RAM en el cliente"], ans: 0, exp: "Anticipar riesgos en el diseño evita fallos estructurales y brechas de seguridad costosas." },
      { id: "SW-03", q: "¿Cuál forma normal exige que la tabla esté en 2FN y que ningún atributo no-clave dependa transitivamente de la llave primaria?", opts: ["Tercera Forma Normal (3FN)", "Primera Forma Normal (1FN)", "Segunda Forma Normal (2FN)", "Clave candidata simple"], ans: 0, exp: "La 3FN elimina las dependencias transitivas entre columnas no clave." },
      { id: "SW-04", q: "¿Qué código de estado HTTP indica que el cliente no tiene permisos de autorización para acceder al recurso solicitado?", opts: ["403 Forbidden", "200 OK", "502 Bad Gateway", "301 Moved Permanently"], ans: 0, exp: "El código 403 Forbidden indica que el servidor entendió la solicitud pero rechaza autorizarla por permisos RBAC." }
    ],
    "Redes, Subneteo (VLSM/FLSM) e IPv6": [
      { id: "NET-01", q: "Red 172.16.10.0/24 (VLSM): ¿Cuáles prefijos corresponden a Laboratorios (100 hosts), Wi-Fi (50 hosts) y Enlace WAN (2 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192) | WAN: /30 (.252)", "Labs: /26 (.192) | Wi-Fi: /27 (.224) | WAN: /28 (.240)", "Labs: /24 (.0) | Wi-Fi: /25 (.128) | WAN: /29 (.248)", "Labs: /27 (.224) | Wi-Fi: /26 (.192) | WAN: /30 (.252)"], ans: 0, exp: "100h -> /25 (126 útiles); 50h -> /26 (62 útiles); 2h -> /30 (2 útiles)." },
      { id: "NET-02", q: "¿Cuál es la equivalencia del valor decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0", "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ = 360₈ = F0₁₆." },
      { id: "NET-03", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo sustituye a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | Protocolo ARP v6", "2001:0db8::a0:1 | Broadcast ff02::1", "fe80::a0:1 | Protocolo DHCPv4"], ans: 0, exp: "El operador '::' se usa una sola vez; ICMPv6 NDP reemplaza a ARP." }
    ],
    "Contabilidad, Administración y Logística": [
      { id: "LOG-01", q: "En Comercio Internacional (Incoterms 2020), ¿cuál término obliga al vendedor a cubrir costos, flete principal y seguro marítimo hasta el puerto de destino convenido?", opts: ["CIF (Cost, Insurance and Freight)", "EXW (Ex Works - En Fábrica)", "FCA (Free Carrier)", "FAS (Free Alongside Ship)"], ans: 0, exp: "En CIF el exportador contrata y paga el transporte marítimo principal y la póliza de seguro hasta el puerto de destino." },
      { id: "LOG-02", q: "Si una empresa tiene Activo Corriente de ₡15,000,000, Inventarios de ₡5,000,000 y Pasivo Corriente de ₡5,000,000, ¿cuál es su Prueba Ácida?", opts: ["2.0", "3.0", "1.0", "0.5"], ans: 0, exp: "Prueba Ácida = (Activo Corriente - Inventarios) / Pasivo Corriente = (15M - 5M) / 5M = 2.0." },
      { id: "LOG-03", q: "Un almacén consume 50 unidades por día, el proveedor tarda 6 días en entregar y el stock de seguridad es de 100 unidades. ¿Cuál es el Punto de Reorden (ROP)?", opts: ["400 unidades", "300 unidades", "200 unidades", "156 unidades"], ans: 0, exp: "ROP = (50 × 6) + 100 = 400 unidades." }
    ],
    "Admisión UCR / TEC / UNA / UTN / UNED": [
      { id: "ADM-01", q: "[UTN #8] En una progresión aritmética con primer término a₁ = 7 y diferencia constante d = 4, ¿cuál es el décimo término (a₁₀)?", opts: ["43", "39", "47", "41"], ans: 0, exp: "a₁₀ = 7 + (10 - 1) × 4 = 7 + 36 = 43." },
      { id: "ADM-02", q: "[UTN #10] Si 5 servidores procesan 200 solicitudes en 4 minutos al mismo ritmo, ¿cuántas solicitudes procesarán 8 servidores en 6 minutos?", opts: ["480 solicitudes", "320 solicitudes", "400 solicitudes", "520 solicitudes"], ans: 0, exp: "Cada servidor procesa 10 solicitudes/min. Por tanto, 8 servidores en 6 min procesan 8 × 6 × 10 = 480 solicitudes." },
      { id: "ADM-03", q: "«Quien investiga sin cuestionar sus propias premisas corre el riesgo de convertir el método científico en un simple ritual de confirmación.» Del texto se deduce que el progreso genuino en la investigación exige:", opts: ["Someter a examen crítico incluso los supuestos iniciales del investigador", "Prescindir del método científico para evitar rituales", "Confirmar únicamente hipótesis con consenso previo", "Reemplazar la evidencia empírica por intuición"], ans: 0, exp: "El texto subraya la necesidad de cuestionar las propias premisas para no caer en un sesgo de confirmación." }
    ],
    "Primaria y Tercer Ciclo MEP (Ciencias, Español, Estudios Sociales)": [
      { id: "PRI-01", q: "En Ciencias MEP: ¿Cuál organela celular es responsable de realizar la fotosíntesis en las células vegetales?", opts: ["Cloroplasto", "Mitocondria", "Ribosoma", "Lisosoma"], ans: 0, exp: "Los cloroplastos contienen clorofila y transforman la energía lumínica en energía química." },
      { id: "PRI-02", q: "En Español MEP: ¿Cuál de las siguientes palabras es esdrújula y por regla general lleva tilde siempre?", opts: ["Matemáticas", "Computador", "Carpeta", "Reloj"], ans: 0, exp: "Ma-te-má-ti-cas tiene el acento prosódico en la antepenúltima sílaba; todas las esdrújulas se tildan." }
    ],
    "Electrónica Industrial (Ley de Ohm/Watt)": [
      { id: "EL-01", q: "Tres resistencias de 30 Ω conectadas en paralelo a una fuente de 20V DC presentan una resistencia equivalente (Req) y corriente total (It) de:", opts: ["Req = 10 Ω y Corriente Total = 2 A", "Req = 90 Ω y Corriente Total = 0.22 A", "Req = 15 Ω y Corriente Total = 1.33 A", "Req = 30 Ω y Corriente Total = 0.66 A"], ans: 0, exp: "Req = 30 / 3 = 10 Ω. Por Ley de Ohm: I = 20V / 10 Ω = 2 A." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, materiaInicial) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'calculadora'; // 'calculadora' | 'examenes' | 'juegos' | 'rotonda'
    let materia = (materiaInicial && BANCOS_MULTIVERSO[materiaInicial]) ? materiaInicial : "Matemáticas MEP (Secundaria y CTP)";
    let preguntas = barajarOpciones(BANCOS_MULTIVERSO[materia]);
    let idx = 0;
    // Registro de respuestas bloqueadas (solo permite responder una vez por pregunta)
    let contestadas = {};
    let segundosRestantes = 1800; // 30 minutos
    let relojActivo = false;
    let timerInterval = null;
    let animRotonda = null;

    // Estado de la Calculadora de Nota de Presentación MEP y Admisión UCR/TEC/UNA/UTN/UNED
    let calcState = {
      modalidadMep: 'CTP_TECNICO', // 'CTP_TECNICO' (10°, 11°, 12°) | 'ACADEMICO' (10°, 11°)
      n10: 88, n11: 90, n12: 92,
      notaPruebaMep: 85,
      pesoNP_Mep: 50, // 50% Nota Presentación + 50% Prueba Estandarizada (ajustable según decreto anual)
      puntajeExamenPAA_UCR_UNA: 620, // Escala 200-800 o 0-100 convertible
      puntajeExamenTEC: 650,
      nivelacionUTN: 88
    };

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:52px;left:0;right:0;bottom:0;background:#060c17;z-index:99985;overflow-y:auto;padding:14px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function limpiarTimers() {
      if (timerInterval) clearInterval(timerInterval);
      if (animRotonda) cancelAnimationFrame(animRotonda);
    }

    function clampNota(val, min, max) {
      const n = parseFloat(val);
      if (isNaN(n)) return min;
      return Math.min(max, Math.max(min, n));
    }

    function render() {
      if (animRotonda) cancelAnimationFrame(animRotonda);
      if (idx >= preguntas.length) idx = 0;
      const item = preguntas[idx];
      const totalRespondidas = Object.keys(contestadas).length;
      const totalAciertos = Object.values(contestadas).filter(x => x.correcta).length;

      modal.innerHTML = `
        <div style="max-width:1120px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;padding:18px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-t="calculadora" class="ms-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='calculadora'?'#0284c7':'#1e293b'};background:${tab==='calculadora'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Nota Presentación MEP & Admisión UCR / TEC / UNA / UTN / UNED</button>
              <button data-t="examenes" class="ms-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='examenes'?'#0284c7':'#1e293b'};background:${tab==='examenes'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Simulacros Oficiales (Primaria, Secundaria, CTP y U)</button>
              <button data-t="juegos" class="ms-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='juegos'?'#0284c7':'#1e293b'};background:${tab==='juegos'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Juegos Lógicos (Puente, Clue, Among Us, Damas, Ajedrez)</button>
              <button data-t="rotonda" class="ms-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='rotonda'?'#0284c7':'#1e293b'};background:${tab==='rotonda'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Simulador Vial CR (Rotonda Estricta)</button>
            </div>
            <button id="ms-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar Vista ✕</button>
          </div>

          ${tab === 'calculadora' ? (() => {
            const np = calcState.modalidadMep === 'CTP_TECNICO'
              ? ((calcState.n10 + calcState.n11 + calcState.n12) / 3)
              : ((calcState.n10 + calcState.n11) / 2);
            const npRedondeada = Math.round(np * 100) / 100;

            // 1. Cálculo MEP Pruebas Nacionales Estandarizadas (Académicas y Técnicas)
            const pesoExamMep = 100 - calcState.pesoNP_Mep;
            const notaFinalMep = Math.round(((npRedondeada * (calcState.pesoNP_Mep / 100)) + (calcState.notaPruebaMep * (pesoExamMep / 100))) * 100) / 100;
            const apruebaMep = notaFinalMep >= 70;

            // 2. Cálculo UCR y UNA (Escala 200 a 800 pts: 50% Nota Presentación + 50% PAA)
            // En escala 200-800, la base es 200 y los 600 puntos restantes se reparten: 300 pts máximo por Nota de Presentación (NP * 3) + 300 pts máximo por PAA
            const aporteNP_UCR = (npRedondeada / 100) * 300;
            const porcPAA = ((calcState.puntajeExamenPAA_UCR_UNA - 200) / 600);
            const aportePAA_UCR = Math.max(0, porcPAA * 300);
            const promedioUCR_UNA = Math.round((200 + aporteNP_UCR + aportePAA_UCR) * 100) / 100;

            // 3. Cálculo TEC (Escala 200 a 800 pts: 40% Nota Presentación + 60% Examen TEC)
            const aporteNP_TEC = (npRedondeada / 100) * 240; // 40% de 600 = 240 pts
            const porcTEC = ((calcState.puntajeExamenTEC - 200) / 600);
            const aporteExam_TEC = Math.max(0, porcTEC * 360); // 60% de 600 = 360 pts
            const promedioTEC = Math.round((200 + aporteNP_TEC + aporteExam_TEC) * 100) / 100;

            // 4. Cálculo UTN y UNED (Escala 0 a 100: Promedio de Presentación Colegios Técnicos/Académicos + Nivelación)
            const indiceUTN = Math.round(((npRedondeada * 0.60) + (calcState.nivelacionUTN * 0.40)) * 100) / 100;

            return `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">
                <!-- Panel Izquierdo: Ingreso de Notas con Validación Estricta (0 a 100) -->
                <div style="background:#09111e;border:1px solid #1e293b;border-radius:10px;padding:16px;">
                  <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:4px;">INGRESO DE CALIFICACIONES DEL ESTUDIANTE (LÍMITE 0 A 100)</div>
                  <h3 style="margin:0 0 12px;font-size:15px;">1. Cálculo de Nota de Presentación (Educación Diversificada)</h3>

                  <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;">
                    <div>
                      <label style="display:block;color:#94a3b8;margin-bottom:3px;">Modalidad Educativa MEP:</label>
                      <select id="c-mod-mep" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;">
                        <option value="CTP_TECNICO" ${calcState.modalidadMep==='CTP_TECNICO'?'selected':''}>Educación Técnica CTP (10°, 11° y 12° Año)</option>
                        <option value="ACADEMICO" ${calcState.modalidadMep==='ACADEMICO'?'selected':''}>Educación Académica (10° y 11° Año)</option>
                      </select>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(${calcState.modalidadMep==='CTP_TECNICO'?3:2},1fr);gap:8px;">
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Promedio 10° (0-100):</label>
                        <input id="c-n10" type="number" min="0" max="100" value="${calcState.n10}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                      </div>
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Promedio 11° (0-100):</label>
                        <input id="c-n11" type="number" min="0" max="100" value="${calcState.n11}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                      </div>
                      ${calcState.modalidadMep === 'CTP_TECNICO' ? `
                        <div>
                          <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Promedio 12° (0-100):</label>
                          <input id="c-n12" type="number" min="0" max="100" value="${calcState.n12}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                        </div>
                      ` : ''}
                    </div>

                    <div style="background:#060c17;border:1px solid #0284c7;border-radius:8px;padding:10px;display:flex;justify-content:space-between;align-items:center;">
                      <span><b>Nota de Presentación Oficial (NP):</b></span>
                      <span style="font-size:18px;font-weight:900;color:#38bdf8;">${npRedondeada} / 100</span>
                    </div>

                    <hr style="border:none;border-top:1px solid #1e293b;margin:4px 0;"/>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Nota Prueba Estandarizada MEP (0-100):</label>
                        <input id="c-pru-mep" type="number" min="0" max="100" value="${calcState.notaPruebaMep}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                      </div>
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">% Peso Nota Presentación MEP:</label>
                        <select id="c-peso-np" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;">
                          <option value="50" ${calcState.pesoNP_Mep===50?'selected':''}>50% NP + 50% Prueba Estandarizada</option>
                          <option value="60" ${calcState.pesoNP_Mep===60?'selected':''}>60% NP + 40% Prueba Estandarizada</option>
                          <option value="70" ${calcState.pesoNP_Mep===70?'selected':''}>70% NP + 30% Prueba Estandarizada</option>
                        </select>
                      </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Puntaje PAA (UCR / UNA: 200-800):</label>
                        <input id="c-paa" type="number" min="200" max="800" value="${calcState.puntajeExamenPAA_UCR_UNA}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                      </div>
                      <div>
                        <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:3px;">Puntaje Examen TEC (200-800):</label>
                        <input id="c-tec" type="number" min="200" max="800" value="${calcState.puntajeExamenTEC}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;"/>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Panel Derecho: Resultados Reglamentarios por Institución (MEP, UCR, TEC, UNA, UTN, UNED) -->
                <div style="background:#09111e;border:1px solid #1e293b;border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:10px;">
                  <div style="font-size:11px;font-weight:800;color:#10b981;">RESULTADOS PONDERADOS SEGÚN REGLAMENTO DE CADA INSTITUCIÓN</div>

                  <div style="background:#0b1528;border-left:4px solid ${apruebaMep?'#10b981':'#ef4444'};padding:12px;border-radius:8px;">
                    <div style="font-size:12px;font-weight:800;color:#f8fafc;">1. MEP — Pruebas Nacionales Estandarizadas (${calcState.modalidadMep==='CTP_TECNICO'?'Técnicas CTP':'Académicas'})</div>
                    <div style="font-size:11px;color:#94a3b8;">Fórmula: (${npRedondeada} × ${calcState.pesoNP_Mep}%) + (${calcState.notaPruebaMep} × ${pesoExamMep}%)</div>
                    <div style="font-size:16px;font-weight:900;color:${apruebaMep?'#34d399':'#f87171'};margin-top:4px;">
                      Nota Final MEP: ${notaFinalMep} / 100 — ${apruebaMep ? 'APROBADO (≥70)' : 'PENDIENTE (<70)'}
                    </div>
                  </div>

                  <div style="background:#0b1528;border-left:4px solid #0ea5e9;padding:12px;border-radius:8px;">
                    <div style="font-size:12px;font-weight:800;color:#f8fafc;">2. UCR y UNA — Promedio de Admisión (Escala 200 a 800 pts)</div>
                    <div style="font-size:11px;color:#94a3b8;">Reglamento UCR/UNA: 50% Nota de Presentación (${Math.round(aporteNP_UCR)} pts) + 50% Examen PAA (${Math.round(aportePAA_UCR)} pts) + Base 200</div>
                    <div style="font-size:16px;font-weight:900;color:#38bdf8;margin-top:4px;">Nota de Admisión UCR / UNA: ${promedioUCR_UNA} / 800 pts</div>
                  </div>

                  <div style="background:#0b1528;border-left:4px solid #f59e0b;padding:12px;border-radius:8px;">
                    <div style="font-size:12px;font-weight:800;color:#f8fafc;">3. TEC (Tecnológico de Costa Rica) — Escala 200 a 800 pts</div>
                    <div style="font-size:11px;color:#94a3b8;">Reglamento TEC: 40% Nota de Presentación (${Math.round(aporteNP_TEC)} pts) + 60% Examen de Admisión (${Math.round(aporteExam_TEC)} pts) + Base 200</div>
                    <div style="font-size:16px;font-weight:900;color:#fbbf24;margin-top:4px;">Puntaje de Admisión TEC: ${promedioTEC} / 800 pts</div>
                  </div>

                  <div style="background:#0b1528;border-left:4px solid #a855f7;padding:12px;border-radius:8px;">
                    <div style="font-size:12px;font-weight:800;color:#f8fafc;">4. UTN y UNED — Admisión y Articulación Educación Técnica (0 a 100 pts)</div>
                    <div style="font-size:11px;color:#94a3b8;">UTN Pondera Nota de Presentación de Colegios Técnicos/Académicos (60%) + Nivelación/Competencias (40%) | UNED: Ingreso directo con Bachillerato/Título Medio</div>
                    <div style="font-size:15px;font-weight:900;color:#e9d5ff;margin-top:4px;">Índice UTN: ${indiceUTN} / 100 pts • UNED: Elegible (${npRedondeada}%)</div>
                  </div>
                </div>
              </div>
            `;
          })() : tab === 'examenes' ? `
            <!-- PESTAÑA 2: SIMULACROS CON HOJA DE RESPUESTAS DE 3 ESTADOS, CRONÓMETRO PAUSABLE REAL Y RESPUESTA ÚNICA -->
            <div style="display:grid;grid-template-columns:1fr 270px;gap:14px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;background:#09111e;padding:10px 12px;border-radius:8px;border:1px solid #1e293b;margin-bottom:12px;">
                  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                    <label style="font-size:11px;font-weight:700;color:#94a3b8;">Materia / Nivel:</label>
                    <select id="sim-mat-sel" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;font-size:12px;">
                      ${Object.keys(BANCOS_MULTIVERSO).map(k => `<option value="${k}" ${materia===k?'selected':''}>${k}</option>`).join('')}
                    </select>
                  </div>
                  <div style="display:flex;gap:8px;align-items:center;">
                    <span id="sim-timer-lbl" style="font-family:monospace;font-size:13px;background:#111c2d;padding:5px 10px;border-radius:6px;color:#38bdf8;">
                      ⏱️ ${Math.floor(segundosRestantes/60).toString().padStart(2,'0')}:${(segundosRestantes%60).toString().padStart(2,'0')}
                    </span>
                    <button id="sim-timer-btn" style="background:${relojActivo?'#b45309':'#059669'};color:#fff;border:none;padding:6px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                      ${relojActivo ? 'Pausar Cronómetro' : 'Iniciar / Reanudar'}
                    </button>
                  </div>
                </div>

                <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:#38bdf8;font-weight:700;margin-bottom:8px;">
                    <span>${materia} • Ítem [${item.id}]</span>
                    <span>Pregunta ${idx + 1} de ${preguntas.length}</span>
                  </div>
                  <div style="font-size:15px;font-weight:700;margin-bottom:14px;line-height:1.45;">${item.q}</div>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    ${item.optsMix.map((op, i) => {
                      const ya = contestadas[item.id];
                      let bg = '#111c2d', brd = '#1e293b';
                      if (ya !== undefined) {
                        if (i === item.ansMix) { bg = '#064e3b'; brd = '#10b981'; }
                        else if (i === ya.seleccion) { bg = '#450a0a'; brd = '#ef4444'; }
                      }
                      return `
                        <button data-i="${i}" class="sim-opt-btn" ${ya!==undefined?'disabled':''} style="text-align:left;background:${bg};border:1.5px solid ${brd};color:#f8fafc;padding:11px 14px;border-radius:8px;font-size:13px;cursor:${ya!==undefined?'not-allowed':'pointer'};">
                          <b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65 + i)})</b> ${op}
                        </button>
                      `;
                    }).join('')}
                  </div>

                  ${contestadas[item.id] !== undefined ? `
                    <div style="margin-top:12px;padding:10px;border-radius:8px;font-size:12px;background:${contestadas[item.id].correcta?'#064e3b':'#450a0a'};border:1px solid ${contestadas[item.id].correcta?'#10b981':'#ef4444'};">
                      ${contestadas[item.id].correcta
                        ? `<b>¡Respuesta Correcta!</b> ${item.exp}`
                        : `<b>Por qué tu elección (${String.fromCharCode(65 + contestadas[item.id].seleccion)}) es incorrecta:</b> La opción marcada no satisface la condición técnica del enunciado. <b>La respuesta correcta es ${String.fromCharCode(65 + item.ansMix)}):</b> ${item.exp}`}
                    </div>
                  ` : ''}

                  <div style="display:flex;justify-content:space-between;margin-top:14px;">
                    <button id="sim-prev" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;cursor:pointer;">⬅ Anterior</button>
                    <button id="sim-next" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">
                      ${idx === preguntas.length - 1 ? 'Fin de Categoría (Volver al Ítem #1) ↺' : 'Siguiente Pregunta ➡'}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Hoja de Respuestas con 3 Estados Claros: Contestada (Verde), Actual (Borde Celeste), Pendiente (Gris) -->
              <div style="background:#09111e;border:1px solid #1e293b;border-radius:10px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Hoja de Respuestas</div>
                  <div style="display:flex;gap:8px;font-size:10px;color:#94a3b8;margin-bottom:10px;flex-wrap:wrap;">
                    <span>🟢 Contestada (${totalRespondidas})</span>
                    <span>⚪ Pendiente (${preguntas.length - totalRespondidas})</span>
                    <span>🔵 Viendo (#${idx + 1})</span>
                  </div>
                  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:14px;">
                    ${preguntas.map((p, pi) => {
                      const resp = contestadas[p.id];
                      const esActual = pi === idx;
                      const bg = resp ? (resp.correcta ? '#065f46' : '#7f1d1d') : '#111c2d';
                      const brd = esActual ? '2px solid #38bdf8' : '1px solid #334155';
                      return `<button data-pi="${pi}" class="hoja-num" style="padding:8px 4px;border-radius:6px;background:${bg};border:${brd};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">#${pi + 1}<br/>${resp ? String.fromCharCode(65 + resp.seleccion) : '-'}</button>`;
                    }).join('')}
                  </div>
                </div>

                <div>
                  <button id="sim-finish-btn" style="width:100%;background:#10b981;color:#022c22;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;">
                    Finalizar y Calificar Simulacro
                  </button>
                  <div id="sim-final-box" style="margin-top:8px;font-size:12px;"></div>
                </div>
              </div>
            </div>
          ` : tab === 'juegos' ? `
            <!-- PESTAÑA 3: JUEGOS LÓGICOS CON EXPLICACIÓN CLARA -->
            <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">Acertijo del Cruce del Puente en 17 Minutos & Deducción Lógica</h3>
              <p style="font-size:12px;color:#cbd5e1;margin:0 0 12px;">4 integrantes (1 min, 2 min, 5 min y 10 min) deben cruzar el puente de noche con 1 sola linterna. Máximo 2 personas cruzan a la vez al ritmo del más lento. ¿Cuál secuencia logra cruzarlos a todos en exactamente 17 minutos?</p>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <button onclick="this.nextElementSibling.nextElementSibling.innerHTML='<div style=\\'background:#064e3b;padding:10px;border-radius:6px;margin-top:8px;\\'>✅ ¡Exacto! (2 min) + (1 min regreso) + (10 min cruzan 5 y 10) + (2 min regresa el de 2) + (2 min cruzan 1 y 2) = 17 minutos.</div>'" style="text-align:left;background:#111c2d;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;cursor:pointer;">A) Cruzan (1 y 2) [2m] -> Regresa (1) [1m] -> Cruzan (5 y 10) [10m] -> Regresa (2) [2m] -> Cruzan (1 y 2) [2m] = 17 min</button>
                <button onclick="this.nextElementSibling.innerHTML='<div style=\\'background:#450a0a;padding:10px;border-radius:6px;margin-top:8px;\\'>❌ Incorrecto: Si el de 1 min acompaña a todos uno por uno, suma 10 + 1 + 5 + 1 + 2 = 19 minutos (supera los 17 min).</div>'" style="text-align:left;background:#111c2d;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;cursor:pointer;">B) El de 1 minuto cruza con cada uno y regresa siempre con la linterna (19 min)</button>
                <div></div>
              </div>
            </div>
          ` : `
            <!-- PESTAÑA 4: SIMULADOR VIAL 2D ESTRICTO (PIERDE NOTA Y REPRUEBA SI SE SALE DE LA CALLE) -->
            <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
              <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Simulador Vial 2D COSEVI — Rotonda de Costa Rica (Carril Derecho y Penalización al Salir de la Calle)</h3>
              <div id="vial-score-bar" style="display:inline-block;background:#111c2d;border:1px solid #0ea5e9;padding:6px 14px;border-radius:6px;font-size:13px;font-weight:800;color:#34d399;margin-bottom:10px;">
                Nota Actual: 100 / 100 pts — Usa Flechas o W, A, S, D (Si sales del asfalto pierdes los puntos)
              </div>
              <div>
                <canvas id="cvs-vial-v95" width="500" height="310" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;"></canvas>
              </div>
              <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
                <button data-d="u" class="v95-mv" style="background:#1e293b;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">⬆️ Avanzar (W)</button>
                <button data-d="l" class="v95-mv" style="background:#1e293b;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">⬅️ Izquierda (A)</button>
                <button data-d="r" class="v95-mv" style="background:#1e293b;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">➡️ Derecha (D)</button>
                <button data-d="d" class="v95-mv" style="background:#1e293b;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">⬇️ Reversa (S)</button>
                <button id="v95-reset" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;">↺ Reiniciar (100 pts)</button>
              </div>
            </div>
          `}
        </div>
      `;

      document.getElementById('ms-close').onclick = () => { limpiarTimers(); modal.remove(); };
      document.querySelectorAll('.ms-tab').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); render(); };
      });

      // Eventos Pestaña 1: Calculadora MEP y Universidades Públicas
      if (tab === 'calculadora') {
        document.getElementById('c-mod-mep').onchange = (e) => { calcState.modalidadMep = e.target.value; render(); };
        document.getElementById('c-peso-np').onchange = (e) => { calcState.pesoNP_Mep = Number(e.target.value); render(); };
        ['n10','n11','n12'].forEach(k => {
          const el = document.getElementById('c-' + k);
          if (el) el.onchange = (e) => { calcState[k] = clampNota(e.target.value, 0, 100); render(); };
        });
        document.getElementById('c-pru-mep').onchange = (e) => { calcState.notaPruebaMep = clampNota(e.target.value, 0, 100); render(); };
        document.getElementById('c-paa').onchange = (e) => { calcState.puntajeExamenPAA_UCR_UNA = clampNota(e.target.value, 200, 800); render(); };
        document.getElementById('c-tec').onchange = (e) => { calcState.puntajeExamenTEC = clampNota(e.target.value, 200, 800); render(); };
      }

      // Eventos Pestaña 2: Simulacros con Aviso al cambiar de examen, Cronómetro que reanuda y Bloqueo de 0 respuestas
      if (tab === 'examenes') {
        document.getElementById('sim-mat-sel').onchange = (e) => {
          if (Object.keys(contestadas).length > 0) {
            const confirmar = confirm('Tienes preguntas respondidas en este simulacro. ¿Deseas cambiar de materia y reiniciar tus respuestas actuales?');
            if (!confirmar) { e.target.value = materia; return; }
          }
          materia = e.target.value;
          preguntas = barajarOpciones(BANCOS_MULTIVERSO[materia]);
          idx = 0; contestadas = {};
          render();
        };

        document.getElementById('sim-timer-btn').onclick = () => {
          relojActivo = !relojActivo;
          if (relojActivo) {
            timerInterval = setInterval(() => {
              if (segundosRestantes > 0) segundosRestantes--;
              const lbl = document.getElementById('sim-timer-lbl');
              if (lbl) lbl.innerText = `⏱️ ${Math.floor(segundosRestantes/60).toString().padStart(2,'0')}:${(segundosRestantes%60).toString().padStart(2,'0')}`;
            }, 1000);
          } else if (timerInterval) {
            clearInterval(timerInterval);
          }
          render();
        };

        document.querySelectorAll('.sim-opt-btn').forEach(btn => {
          btn.onclick = () => {
            if (contestadas[item.id] !== undefined) return; // Solo permite responder una vez
            const sel = parseInt(btn.getAttribute('data-i'), 10);
            contestadas[item.id] = { seleccion: sel, correcta: sel === item.ansMix };
            render();
          };
        });

        document.querySelectorAll('.hoja-num').forEach(b => {
          b.onclick = () => { idx = parseInt(b.getAttribute('data-pi'), 10); render(); };
        });

        document.getElementById('sim-prev').onclick = () => { idx = (idx - 1 + preguntas.length) % preguntas.length; render(); };
        document.getElementById('sim-next').onclick = () => { idx = (idx + 1) % preguntas.length; render(); };

        document.getElementById('sim-finish-btn').onclick = () => {
          const box = document.getElementById('sim-final-box');
          if (totalRespondidas === 0) {
            box.innerHTML = `<div style="background:#450a0a;border:1px solid #ef4444;padding:10px;border-radius:6px;color:#fecaca;">⚠️ Debes responder al menos 1 pregunta antes de finalizar el simulacro.</div>`;
            return;
          }
          const nota = Math.round((totalAciertos / preguntas.length) * 100);
          box.innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:10px;border-radius:6px;color:#ecfdf5;"><b>Calificación Oficial del Simulacro: ${nota}%</b> (${totalAciertos} correctas de ${preguntas.length}).</div>`;
        };
      }

      // Eventos Pestaña 4: Rotonda con pérdida de nota al salir de la calle y WASD funcional
      if (tab === 'rotonda') {
        const cvs = document.getElementById('cvs-vial-v95');
        const bar = document.getElementById('vial-score-bar');
        const ctx = cvs.getContext('2d');
        const cx = 250, cy = 155, rIn = 45, rOut = 102;
        let car = { x: 266, y: 292 }, notaVial = 100, estado = 'activo', npcs = [0, 2.1, 4.2];

        function enCalle(x, y) {
          const d = Math.hypot(x - cx, y - cy);
          return (d >= rIn && d <= rOut) || (x >= cx - 32 && x <= cx + 32) || (y >= cy - 32 && y <= cy + 32);
        }

        function moverCarro(d) {
          if (estado !== 'activo') return;
          if (d === 'u') car.y -= 9;
          if (d === 'd') car.y += 9;
          if (d === 'l') car.x -= 9;
          if (d === 'r') car.x += 9;

          if (!enCalle(car.x, car.y)) {
            notaVial = 0;
            estado = 'reprobado';
            bar.style.color = '#f87171';
            bar.innerText = 'Nota Actual: 0 / 100 pts — REPROBADO: Te saliste de la vía asfaltada.';
          } else if (car.y <= 20 && car.x >= cx - 30 && car.x <= cx + 30) {
            estado = 'aprobado';
            bar.style.color = '#34d399';
            bar.innerText = 'Nota Actual: 100 / 100 pts — ¡PRUEBA SUPERADA EN EL CARRIL CORRECTO!';
          }
        }

        document.querySelectorAll('.v95-mv').forEach(b => b.onclick = () => moverCarro(b.getAttribute('data-d')));
        document.getElementById('v95-reset').onclick = () => {
          car = { x: 266, y: 292 }; notaVial = 100; estado = 'activo';
          bar.style.color = '#34d399';
          bar.innerText = 'Nota Actual: 100 / 100 pts — Usa Flechas o W, A, S, D';
        };

        function loopVial() {
          ctx.clearRect(0, 0, 500, 310);
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - 32, 0, 64, 310);
          ctx.fillRect(0, cy - 32, 500, 64);
          ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.fill();
          // Línea divisoria de carril
          ctx.beginPath(); ctx.arc(cx, cy, (rIn + rOut) / 2, 0, Math.PI * 2);
          ctx.setLineDash([6, 6]); ctx.strokeStyle = '#fbbf24'; ctx.stroke(); ctx.setLineDash([]);
          // Isla central
          ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.fillStyle = '#065f46'; ctx.fill();

          // Vehículos NPC circulando por el carril derecho externo en sentido antihorario
          npcs = npcs.map(a => a - 0.015);
          npcs.forEach(a => {
            const nx = cx + Math.cos(a) * 84, ny = cy + Math.sin(a) * 84;
            ctx.beginPath(); ctx.arc(nx, ny, 8, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
            if (estado === 'activo' && Math.hypot(car.x - nx, car.y - ny) < 16) {
              notaVial = 0; estado = 'reprobado';
              bar.style.color = '#f87171';
              bar.innerText = 'Nota Actual: 0 / 100 pts — REPROBADO POR COLISIÓN EN ROTONDA.';
            }
          });

          ctx.beginPath(); ctx.arc(car.x, car.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = estado === 'reprobado' ? '#ef4444' : '#38bdf8';
          ctx.fill();
          animRotonda = requestAnimationFrame(loopVial);
        }
        loopVial();
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();