(function () {
  const SESSION_KEY = "bds_auth_v94_session";
  const SAVED_EXAMS_KEY = "bds_saved_exams_v94";

  function getUsuarioActivo() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || { id: "EST-1101", nombre: "Estudiante Activo", email: "estudiante@est.mep.go.cr", rol: "Estudiante", seccion: "11-1" };
    } catch {
      return { id: "EST-1101", nombre: "Estudiante Activo", email: "estudiante@est.mep.go.cr", rol: "Estudiante", seccion: "11-1" };
    }
  }

  // Algoritmo de deduplicación + Fisher-Yates (Cero preguntas repetidas y la respuesta nunca es siempre la A)
  function prepararExamenUnico(preguntasBase) {
    const vistos = new Set();
    const unicas = [];
    for (const p of preguntasBase) {
      if (!vistos.has(p.id) && !vistos.has(p.q)) {
        vistos.add(p.id);
        vistos.add(p.q);
        unicas.push(p);
      }
    }
    return unicas.map(item => {
      const pares = item.opts.map((texto, idx) => ({ texto, ok: idx === item.ans }));
      for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = pares[i]; pares[i] = pares[j]; pares[j] = tmp;
      }
      return { ...item, optsMix: pares.map(p => p.texto), ansMix: pares.findIndex(p => p.ok) };
    });
  }

  // Bancos de Especialidad 100% Aislados (Cero preguntas de voltaje en Manejo o en Desarrollo Web)
  const BANCOS_ESPECIALIDAD = {
    "Desarrollo Web y Diseño de Software": [
      { id: "DW-01", q: "En React (.jsx), ¿cuál hook se utiliza para sincronizar un componente con un sistema externo o ejecutar efectos secundarios tras el renderizado?", opts: ["useEffect()", "useReducer()", "useRef()", "useMemo()"], ans: 0, exp: "useEffect ejecuta efectos secundarios después de que React actualiza el DOM." },
      { id: "DW-02", q: "En Diseño de Software bajo la norma ISO/IEC 25010, omitir la planeación de arquitectura y la matriz de riesgos produce directamente:", opts: ["Deuda técnica exponencial: corregir un defecto en producción cuesta hasta 10 veces más que en la fase de diseño", "Reducción automática de la complejidad ciclomática", "Eliminación de pruebas de aceptación del usuario", "Menor consumo de memoria en el navegador"], ans: 0, exp: "Anticipar riesgos en el diseño previene fallos estructurales y brechas de seguridad." },
      { id: "DW-03", q: "¿Cuál principio de bases de datos relacionales exige que ningún atributo no-clave dependa transitivamente de la llave primaria?", opts: ["Tercera Forma Normal (3FN)", "Primera Forma Normal (1FN)", "Desnormalización física", "Producto cartesiano"], ans: 0, exp: "La 3FN elimina dependencias transitivas para garantizar integridad referencial." },
      { id: "DW-04", q: "¿Cuál método HTTP es idempotente y se emplea estándarmente para reemplazar por completo un recurso existente en una API REST?", opts: ["PUT", "POST", "PATCH", "CONNECT"], ans: 0, exp: "PUT reemplaza la representación completa del recurso de forma idempotente." }
    ],
    "Redes, Subneteo (VLSM/FLSM) e IPv6": [
      { id: "RD-01", q: "Dada la red 172.16.10.0/24 (VLSM): ¿Cuáles prefijos corresponden a Laboratorios (100 hosts), Wi-Fi (50 hosts) y Enlace WAN (2 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192) | WAN: /30 (.252)", "Labs: /26 (.192) | Wi-Fi: /27 (.224) | WAN: /28 (.240)", "Labs: /24 (.0) | Wi-Fi: /25 (.128) | WAN: /29 (.248)", "Labs: /27 (.224) | Wi-Fi: /25 (.128) | WAN: /30 (.252)"], ans: 0, exp: "100h -> /25 (126 útiles); 50h -> /26 (62 útiles); 2h -> /30 (2 útiles)." },
      { id: "RD-02", q: "¿Cuál es la equivalencia del valor decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0", "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ = 360₈ = F0₁₆." },
      { id: "RD-03", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo sustituye a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | Protocolo ARP v6", "2001:0db8::a0:1 | Broadcast ff02::1", "fe80::a0:1 | Protocolo DHCPv4"], ans: 0, exp: "El operador '::' se usa una única vez; NDP reemplaza a ARP en IPv6." }
    ],
    "Educación Vial COSEVI / MOPT": [
      { id: "VL-01", q: "Según la normativa vial de Costa Rica, al ingresar a una rotonda, ¿cuál es el sentido obligatorio de circulación y quién tiene prioridad?", opts: ["Sentido antihorario (circulación por la derecha) y tiene prioridad el vehículo que ya circula dentro de la rotonda", "Sentido horario y tiene prioridad el vehículo que ingresa más rápido", "Sentido horario por el carril externo a 60 km/h", "Cualquier sentido siempre que se activen las luces intermitentes"], ans: 0, exp: "En Costa Rica se conduce por la derecha, girando en sentido antihorario dentro de la rotonda a máximo 30 km/h." },
      { id: "VL-02", q: "¿Cuál es el límite máximo de velocidad permitido al circular frente a escuelas y colegios con presencia de estudiantes en Costa Rica?", opts: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], ans: 0, exp: "En zona escolar con presencia de estudiantes el límite máximo legal es de 25 km/h." },
      { id: "VL-03", q: "¿Qué indica una línea amarilla continua pintada en el centro de una carretera de dos sentidos en Costa Rica?", opts: ["Prohibición absoluta de adelantamiento para ambos sentidos de circulación", "Carril exclusivo para motocicletas", "Permiso para adelantar en curva", "Zona de estacionamiento permitido"], ans: 0, exp: "La línea continua amarilla divide flujos opuestos y prohíbe rebasar." }
    ],
    "Admisión Universitaria UTN / UCR / TEC": [
      { id: "UTN-08", q: "[Pregunta 8 UTN] En una progresión aritmética con primer término a₁ = 7 y diferencia d = 4, ¿cuál es el décimo término (a₁₀)?", opts: ["43", "39", "47", "41"], ans: 0, exp: "a₁₀ = 7 + (10 - 1) × 4 = 7 + 36 = 43." },
      { id: "UTN-10", q: "[Pregunta 10 UTN] Si 5 servidores procesan 200 solicitudes en 4 minutos al mismo ritmo, ¿cuántas solicitudes procesarán 8 servidores en 6 minutos?", opts: ["480 solicitudes", "320 solicitudes", "400 solicitudes", "520 solicitudes"], ans: 0, exp: "Cada servidor procesa 10 solicitudes/min. Con 8 servidores en 6 min: 8 × 6 × 10 = 480 solicitudes." }
    ],
    "Productividad: Excel y Word Técnico": [
      { id: "EX-01", q: "¿Cuál fórmula de Excel evalúa en F2 si Nota (D2)>=70 Y Asistencia (E2)>=80% para mostrar 'APROBADO', de lo contrario 'PENDIENTE'?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")", "=CONTAR.SI(D2:E2; \">=70\")"], ans: 0, exp: "La función lógica Y() exige que ambas condiciones se cumplan simultáneamente." }
    ],
    "Electrónica Industrial (Ley de Ohm/Watt)": [
      { id: "EL-01", q: "Tres resistencias de 30 Ω conectadas en paralelo a una fuente de 20V DC presentan una resistencia equivalente (Req) y corriente total (It) de:", opts: ["Req = 10 Ω y Corriente Total = 2 A", "Req = 90 Ω y Corriente Total = 0.22 A", "Req = 15 Ω y Corriente Total = 1.33 A", "Req = 30 Ω y Corriente Total = 0.66 A"], ans: 0, exp: "Req = 30 / 3 = 10 Ω. Por Ley de Ohm: I = 20V / 10 Ω = 2 A." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, especialidadInicial) {
    let previo = document.getElementById('bds-mega-modal');
    if (previo) previo.remove();

    const usr = getUsuarioActivo();
    let vista = vistaInicial || 'examenes'; // 'examenes' | 'juegos' | 'rotonda' | 'chats' | 'carnet'
    let espActual = especialidadInicial || "Desarrollo Web y Diseño de Software";
    let preguntas = prepararExamenUnico(BANCOS_ESPECIALIDAD[espActual]);
    let idx = 0, aciertos = 0, respondidas = 0;
    let modoFeedback = 'instante'; // 'instante' | 'final'
    let respuestasUsuario = {};
    let msgGuardado = '';

    // Estado de Juegos de Razonamiento
    let juegoActivo = 'puente'; // 'puente' | 'clue' | 'amongus' | 'damas' | 'cuatro' | 'ajedrez'
    let animRotonda = null;

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:52px;left:0;right:0;bottom:0;background:#060c17;z-index:99980;overflow-y:auto;padding:16px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function limpiarAnim() {
      if (animRotonda) cancelAnimationFrame(animRotonda);
    }

    function render() {
      limpiarAnim();
      if (idx >= preguntas.length) idx = 0;
      const item = preguntas[idx];

      modal.innerHTML = `
        <div style="max-width:1060px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;padding:18px;box-sizing:border-box;">
          <!-- Navegación Interna Sobria (Una sola vista a la vez, nunca todo amontonado) -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-v="examenes" class="v-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${vista==='examenes'?'#0284c7':'#1e293b'};background:${vista==='examenes'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Exámenes por Especialidad</button>
              <button data-v="juegos" class="v-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${vista==='juegos'?'#0284c7':'#1e293b'};background:${vista==='juegos'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Juegos de Razonamiento (Puente, Clue, Among Us)</button>
              <button data-v="rotonda" class="v-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${vista==='rotonda'?'#0284c7':'#1e293b'};background:${vista==='rotonda'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Simulador Vial CR (Rotonda Estricta)</button>
              <button data-v="chats" class="v-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${vista==='chats'?'#0284c7':'#1e293b'};background:${vista==='chats'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Canales de Sección (${usr.seccion})</button>
              <button data-v="carnet" class="v-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${vista==='carnet'?'#0284c7':'#1e293b'};background:${vista==='carnet'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">5. Mi Carné QR Real</button>
            </div>
            <button id="close-view" style="background:#1e293b;color:#cbd5e1;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Minimizar Vista</button>
          </div>

          ${vista === 'examenes' ? `
            <!-- VISTA 1: EXÁMENES DE ESPECIALIDAD (SIN PREGUNTAS REPETIDAS, BOTÓN GUARDAR FUNCIONAL, SIN CALCULADORA DE VOLTAJE AJENA) -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;background:#09111e;padding:12px;border-radius:8px;border:1px solid #1e293b;margin-bottom:14px;">
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <label style="font-size:12px;font-weight:700;color:#94a3b8;">Especialidad:</label>
                <select id="ex-esp-sel" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:6px;font-size:12px;">
                  ${Object.keys(BANCOS_ESPECIALIDAD).map(k => `<option value="${k}" ${espActual===k?'selected':''}>${k}</option>`).join('')}
                </select>
                <select id="ex-modo-fb" style="background:#111c2d;border:1px solid #334155;color:#38bdf8;padding:7px 10px;border-radius:6px;font-size:12px;">
                  <option value="instante" ${modoFeedback==='instante'?'selected':''}>Modo Práctica: Retroalimentación al instante</option>
                  <option value="final" ${modoFeedback==='final'?'selected':''}>Modo Examen: Ver nota al finalizar</option>
                </select>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <span style="font-size:12px;font-weight:700;color:#34d399;">Aciertos: ${aciertos}/${respondidas}</span>
                <button id="ex-btn-save" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Guardar Intento</button>
              </div>
            </div>

            ${msgGuardado ? `<div style="background:#064e3b;border:1px solid #10b981;padding:9px 12px;border-radius:6px;font-size:12px;color:#ecfdf5;margin-bottom:12px;">${msgGuardado}</div>` : ''}

            <div style="background:#09111e;border:1px solid #1e293b;padding:18px;border-radius:10px;margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;font-size:11px;color:#38bdf8;font-weight:700;margin-bottom:8px;">
                <span>${espActual} • Código Único [${item.id}] (Cero Repetidas)</span>
                <span>Pregunta ${idx + 1} de ${preguntas.length}</span>
              </div>
              <div style="font-size:15px;font-weight:700;margin-bottom:14px;line-height:1.45;">${item.q}</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${item.optsMix.map((op, i) => `
                  <button data-i="${i}" class="ex-opt" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#f8fafc;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;">
                    <b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65 + i)})</b> ${op}
                  </button>
                `).join('')}
              </div>
              <div id="ex-fb-box" style="margin-top:12px;font-size:12px;"></div>
              <div style="display:flex;justify-content:space-between;margin-top:14px;">
                <button id="ex-prev" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;cursor:pointer;">Anterior</button>
                <button id="ex-next" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Siguiente Pregunta</button>
              </div>
            </div>

            <!-- Herramienta auxiliar contextual: SOLO muestra calculadora de redes en Redes, y SOLO Ley de Ohm en Electrónica -->
            ${espActual === "Redes, Subneteo (VLSM/FLSM) e IPv6" ? `
              <div style="background:#09111e;border:1px solid #1e293b;padding:12px;border-radius:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;font-size:12px;">
                <div><b>Conversor Bin/Oct/Hex:</b> <input id="aux-dec" type="number" value="240" style="width:70px;background:#111c2d;color:#fff;border:1px solid #334155;padding:4px;border-radius:4px;"/> <span id="aux-dec-o">Bin: 11110000 | Hex: F0</span></div>
                <div><b>Prefijo IPv4:</b> <input id="aux-cidr" type="number" min="24" max="30" value="26" style="width:55px;background:#111c2d;color:#fff;border:1px solid #334155;padding:4px;border-radius:4px;"/> <span id="aux-cidr-o">Máscara .192 (62 hosts)</span></div>
              </div>
            ` : espActual === "Electrónica Industrial (Ley de Ohm/Watt)" ? `
              <div style="background:#09111e;border:1px solid #1e293b;padding:12px;border-radius:8px;font-size:12px;">
                <b>Calculadora Exclusiva de Electrónica (Ley de Ohm V = I × R):</b> Voltaje (V): <input id="ohm-v" type="number" value="20" style="width:60px;background:#111c2d;color:#fff;border:1px solid #334155;padding:4px;"/> / Resistencia (Ω): <input id="ohm-r" type="number" value="10" style="width:60px;background:#111c2d;color:#fff;border:1px solid #334155;padding:4px;"/> = <b id="ohm-out" style="color:#34d399;">Corriente: 2.00 A</b>
              </div>
            ` : ''}
          ` : vista === 'juegos' ? `
            <!-- VISTA 2: JUEGOS DE RAZONAMIENTO LÓGICO (CRUCE DEL PUENTE, CLUE, AMONG US, DAMAS, 4 EN LÍNEA, AJEDREZ) -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
              <button data-jg="puente" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='puente'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Cruce del Puente (17 min)</button>
              <button data-jg="clue" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='clue'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Clue: Misterio en el Servidor</button>
              <button data-jg="amongus" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='amongus'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Sabotaje en la Red (Among Us Lógico)</button>
              <button data-jg="damas" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='damas'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Damas 8x8</button>
              <button data-jg="cuatro" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='cuatro'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">5. Cuatro en Línea</button>
              <button data-jg="ajedrez" class="jg-btn" style="padding:8px 12px;border-radius:6px;border:1px solid #334155;background:${juegoActivo==='ajedrez'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">6. Ajedrez</button>
            </div>
            <div id="logic-game-box" style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;"></div>
          ` : vista === 'rotonda' ? `
            <!-- VISTA 3: SIMULADOR VIAL 2D COSTA RICA (ROTONDA ANTIHORARIA CON REPROBACIÓN SI SE SALE DE LA VÍA O CHOCA) -->
            <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
              <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Simulador Vial COSEVI — Rotonda de Costa Rica (Con Validación de Carril y Colisión)</h3>
              <p style="margin:0 0 10px;font-size:12px;color:#cbd5e1;">
                Usa las <b>Flechas del Teclado</b> o los botones inferiores para ingresar por la derecha, girar en <b>sentido antihorario</b> y salir por el acceso superior hacia la meta verde. <b>Si te sales del asfalto o chocas contra otro vehículo, repruebas automáticamente la prueba.</b>
              </p>
              <div id="rot-status-banner" style="margin-bottom:10px;padding:8px;border-radius:6px;background:#111c2d;color:#38bdf8;font-size:13px;font-weight:700;">
                Estado de la Prueba: En curso — Mantente dentro de la calzada gris y llega a la Meta Superior.
              </div>
              <canvas id="cvs-rotonda-strict" width="500" height="320" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;"></canvas>
              <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
                <button data-m="u" class="r-mv" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Arriba</button>
                <button data-m="l" class="r-mv" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Izquierda</button>
                <button data-m="r" class="r-mv" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Derecha</button>
                <button data-m="d" class="r-mv" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Abajo</button>
                <button id="r-reset" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Reiniciar Prueba Vial</button>
              </div>
            </div>
          ` : vista === 'chats' ? `
            <!-- VISTA 4: CANALES DE CHAT POR SECCIÓN -->
            <div style="display:grid;grid-template-columns:210px 1fr;gap:12px;background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;min-height:320px;">
              <div style="border-right:1px solid #1e293b;padding-right:10px;display:flex;flex-direction:column;gap:6px;">
                <div style="font-size:11px;font-weight:700;color:#64748b;">CANALES INSTITUCIONALES</div>
                <button data-ch="Sección ${usr.seccion}" class="ch-sel" style="text-align:left;background:#0284c7;color:#fff;border:none;padding:8px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;"># Sección ${usr.seccion}</button>
                <button data-ch="Sección 11-1" class="ch-sel" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Sección 11-1</button>
                <button data-ch="Sección 12-1" class="ch-sel" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Sección 12-1</button>
                <button data-ch="Soporte Profesor Guía" class="ch-sel" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Profesor Guía</button>
              </div>
              <div style="display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div id="ch-header" style="font-size:14px;font-weight:800;color:#38bdf8;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:10px;">Canal Activo: # Sección ${usr.seccion}</div>
                  <div id="ch-feed" style="display:flex;flex-direction:column;gap:8px;max-height:210px;overflow-y:auto;font-size:12px;">
                    <div style="background:#111c2d;padding:8px 12px;border-radius:8px;"><b>Sistema CTP Mercedes Norte:</b> Canal académico habilitado para <b>${usr.nombre} (${usr.seccion})</b>.</div>
                  </div>
                </div>
                <form id="ch-form-send" style="display:flex;gap:8px;margin-top:10px;">
                  <input id="ch-msg-in" type="text" placeholder="Escribe un mensaje como ${usr.nombre}..." required style="flex:1;background:#111c2d;border:1px solid #334155;color:#fff;padding:9px 12px;border-radius:6px;font-size:12px;"/>
                  <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Enviar</button>
                </form>
              </div>
            </div>
          ` : `
            <!-- VISTA 5: CARNÉ QR REAL ESCANEABLE DE LA SESIÓN DEL ESTUDIANTE ACTIVO -->
            <div style="max-width:460px;margin:0 auto;background:#09111e;border:1.5px solid #0ea5e9;border-radius:12px;padding:20px;text-align:center;">
              <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:4px;">CTP MERCEDES NORTE • CREDENCIAL OFICIAL</div>
              <div style="font-size:18px;font-weight:800;color:#fff;">${usr.nombre}</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">${usr.rol} • Sección ${usr.seccion} • ${usr.email}</div>
              <div style="display:flex;justify-content:center;margin-bottom:12px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent('https://practicatecnica.com/?verificar=' + encodeURIComponent('CARNET|' + usr.id + '|' + usr.nombre + '|Sección ' + usr.seccion + '|Verificado OAuth|SHA256-OK'))}" alt="QR Oficial Escaneable" width="190" height="190" style="background:#fff;padding:6px;border-radius:8px;border:2px solid #10b981;"/>
              </div>
              <div style="font-size:11px;color:#cbd5e1;">Escanea este código QR con la cámara de cualquier teléfono para validar tu identidad y asistencia.</div>
            </div>
          `}
        </div>
      `;

      document.getElementById('close-view').onclick = () => { limpiarAnim(); modal.remove(); };
      document.querySelectorAll('.v-tab').forEach(b => {
        b.onclick = () => { vista = b.getAttribute('data-v'); render(); };
      });

      // Eventos Vista 1: Exámenes
      if (vista === 'examenes') {
        document.getElementById('ex-esp-sel').onchange = (e) => {
          espActual = e.target.value;
          preguntas = prepararExamenUnico(BANCOS_ESPECIALIDAD[espActual]);
          idx = 0; aciertos = 0; respondidas = 0; respuestasUsuario = {}; msgGuardado = '';
          render();
        };
        document.getElementById('ex-modo-fb').onchange = (e) => {
          modoFeedback = e.target.value;
          render();
        };
        document.getElementById('ex-btn-save').onclick = () => {
          const hist = JSON.parse(localStorage.getItem(SAVED_EXAMS_KEY) || "[]");
          hist.unshift({ usuario: usr.nombre, seccion: usr.seccion, especialidad: espActual, aciertos, respondidas, fecha: new Date().toLocaleTimeString() });
          localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(hist.slice(0, 30)));
          msgGuardado = `Progreso guardado correctamente para ${usr.nombre} (${aciertos}/${respondidas} aciertos en ${espActual}).`;
          render();
        };
        document.getElementById('ex-prev').onclick = () => { idx = (idx - 1 + preguntas.length) % preguntas.length; render(); };
        document.getElementById('ex-next').onclick = () => { idx = (idx + 1) % preguntas.length; render(); };

        document.querySelectorAll('.ex-opt').forEach(btn => {
          btn.onclick = () => {
            const sel = parseInt(btn.getAttribute('data-i'), 10);
            const fb = document.getElementById('ex-fb-box');
            if (respuestasUsuario[item.id] === undefined) {
              respondidas++;
              if (sel === item.ansMix) aciertos++;
            }
            respuestasUsuario[item.id] = sel;

            if (modoFeedback === 'instante') {
              if (sel === item.ansMix) {
                fb.innerHTML = `<div style="background:#064e3b;border:1px solid #059669;padding:10px;border-radius:6px;color:#ecfdf5;"><b>Correcto (${String.fromCharCode(65 + sel)}):</b> ${item.exp}</div>`;
              } else {
                fb.innerHTML = `<div style="background:#450a0a;border:1px solid #dc2626;padding:10px;border-radius:6px;color:#fecaca;"><b>Incorrecto. La respuesta correcta es ${String.fromCharCode(65 + item.ansMix)}):</b> ${item.exp}</div>`;
              }
            } else {
              fb.innerHTML = `<div style="background:#111c2d;border:1px solid #0284c7;padding:10px;border-radius:6px;color:#38bdf8;">Respuesta ${String.fromCharCode(65 + sel)}) registrada en Modo Examen.</div>`;
            }
          };
        });

        const auxDec = document.getElementById('aux-dec');
        if (auxDec) auxDec.oninput = (e) => {
          const n = Math.max(0, Math.min(65535, parseInt(e.target.value||'0',10)));
          document.getElementById('aux-dec-o').innerText = `Bin: ${n.toString(2).padStart(8,'0')} | Hex: ${n.toString(16).toUpperCase()}`;
        };
        const auxCidr = document.getElementById('aux-cidr');
        if (auxCidr) auxCidr.oninput = (e) => {
          const c = Math.max(24, Math.min(30, parseInt(e.target.value||'26',10)));
          document.getElementById('aux-cidr-o').innerText = `Máscara .${256 - Math.pow(2,32-c)} (${Math.pow(2,32-c)-2} hosts)`;
        };
        const ohmV = document.getElementById('ohm-v'), ohmR = document.getElementById('ohm-r');
        if (ohmV && ohmR) {
          const calcOhm = () => {
            const v = parseFloat(ohmV.value||'0'), r = Math.max(0.1, parseFloat(ohmR.value||'1'));
            document.getElementById('ohm-out').innerText = `Corriente: ${(v/r).toFixed(2)} A`;
          };
          ohmV.oninput = calcOhm; ohmR.oninput = calcOhm;
        }
      }

      // Eventos Vista 2: Juegos de Razonamiento (Cruce del Puente, Clue, Among Us, Damas, 4 en Línea, Ajedrez)
      if (vista === 'juegos') {
        document.querySelectorAll('.jg-btn').forEach(b => {
          b.onclick = () => { juegoActivo = b.getAttribute('data-jg'); render(); };
        });
        const box = document.getElementById('logic-game-box');

        // 1. CRUCE DEL PUENTE Y LA ANTORCHA (17 MINUTOS)
        if (juegoActivo === 'puente') {
          let personas = [
            { id: 'A', nombre: 'Estudiante A (1 min)', t: 1, lado: 'izq', sel: false },
            { id: 'B', nombre: 'Estudiante B (2 min)', t: 2, lado: 'izq', sel: false },
            { id: 'C', nombre: 'Docente C (5 min)', t: 5, lado: 'izq', sel: false },
            { id: 'D', nombre: 'Coordinador D (10 min)', t: 10, lado: 'izq', sel: false }
          ];
          let linterna = 'izq', tiempoUsado = 0, estadoPuente = '';

          function pintarPuente() {
            const enDer = personas.filter(p => p.lado === 'der').length;
            if (enDer === 4 && tiempoUsado <= 17) {
              estadoPuente = `¡VICTORIA LÓGICA! Cruzaron los 4 en exactamente ${tiempoUsado} minutos (Límite: 17 min).`;
            } else if (tiempoUsado > 17) {
              estadoPuente = `Tiempo agotado (${tiempoUsado} min > 17 min). Reinicia y optimiza: lleva primero a 1 y 2, regresa 1, cruzan 5 y 10, regresa 2, y cruzan 1 y 2.`;
            }

            box.innerHTML = `
              <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Acertijo Algorítmico: El Cruce del Puente en 17 Minutos</h3>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Reglas: Máximo 2 personas cruzan a la vez con la linterna al ritmo del más lento. Todos deben llegar al Lado Derecho en <b>17 minutos o menos</b>.</p>
              <div style="display:flex;justify-content:space-between;align-items:center;background:#111c2d;padding:10px 14px;border-radius:8px;margin-bottom:12px;font-size:13px;">
                <span>Linterna en: <b style="color:#fbbf24;">${linterna==='izq'?'Orilla Izquierda':'Orilla Derecha'}</b></span>
                <span>Tiempo Transcurrido: <b style="color:${tiempoUsado<=17?'#34d399':'#f87171'};">${tiempoUsado} / 17 min</b></span>
                <button id="p-reset" style="background:#1e293b;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer;">Reiniciar Acertijo</button>
              </div>
              ${estadoPuente ? `<div style="padding:10px;border-radius:6px;margin-bottom:12px;background:${tiempoUsado<=17?'#064e3b':'#450a0a'};font-size:12px;font-weight:700;">${estadoPuente}</div>` : ''}
              <div style="display:grid;grid-template-columns:1fr 140px 1fr;gap:12px;align-items:center;">
                <div style="background:#060c17;border:1px solid #1e293b;padding:12px;border-radius:8px;min-height:150px;">
                  <div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:8px;">ORILLA IZQUIERDA (INICIO)</div>
                  ${personas.filter(p => p.lado === 'izq').map(p => `
                    <button data-id="${p.id}" class="p-toggle" style="display:block;width:100%;margin-bottom:6px;padding:8px;border-radius:6px;border:1px solid ${p.sel?'#38bdf8':'#334155'};background:${p.sel?'#0284c7':'#111c2d'};color:#fff;font-size:12px;cursor:pointer;">
                      ${p.nombre} ${p.sel ? '✓' : ''}
                    </button>
                  `).join('')}
                </div>
                <button id="p-cruzar" style="background:#059669;color:#fff;border:none;padding:12px 8px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  Cruzar Puente ${linterna==='izq'?'➡':'⬅'}
                </button>
                <div style="background:#060c17;border:1px solid #1e293b;padding:12px;border-radius:8px;min-height:150px;">
                  <div style="font-size:11px;font-weight:700;color:#34d399;margin-bottom:8px;">ORILLA DERECHA (META)</div>
                  ${personas.filter(p => p.lado === 'der').map(p => `
                    <button data-id="${p.id}" class="p-toggle" style="display:block;width:100%;margin-bottom:6px;padding:8px;border-radius:6px;border:1px solid ${p.sel?'#38bdf8':'#334155'};background:${p.sel?'#0284c7':'#111c2d'};color:#fff;font-size:12px;cursor:pointer;">
                      ${p.nombre} ${p.sel ? '✓' : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            `;

            document.querySelectorAll('.p-toggle').forEach(b => {
              b.onclick = () => {
                const p = personas.find(x => x.id === b.getAttribute('data-id'));
                if (p.lado !== linterna) return;
                const seleccionados = personas.filter(x => x.sel).length;
                if (!p.sel && seleccionados >= 2) return;
                p.sel = !p.sel;
                pintarPuente();
              };
            });

            document.getElementById('p-cruzar').onclick = () => {
              const viajantes = personas.filter(x => x.sel && x.lado === linterna);
              if (viajantes.length === 0 || viajantes.length > 2) return;
              const maxT = Math.max(...viajantes.map(x => x.t));
              tiempoUsado += maxT;
              const nuevoLado = linterna === 'izq' ? 'der' : 'izq';
              viajantes.forEach(x => { x.lado = nuevoLado; x.sel = false; });
              linterna = nuevoLado;
              pintarPuente();
            };

            document.getElementById('p-reset').onclick = () => {
              personas.forEach(x => { x.lado = 'izq'; x.sel = false; });
              linterna = 'izq'; tiempoUsado = 0; estadoPuente = '';
              pintarPuente();
            };
          }
          pintarPuente();
        }

        // 2. CLUE: MISTERIO DEDUCTIVO EN EL SERVIDOR
        if (juegoActivo === 'clue') {
          const sospechosos = ["Analista Alfa", "Técnico Beta", "Operador Gamma"];
          const lugares = ["Laboratorio 1 (Redes)", "Cuarto de Servidores", "Laboratorio 3 (Web)"];
          const herramientas = ["Cable Consola Serial", "Script PowerShell", "Llave USB Boot"];
          // Solución lógica deducible por las pistas
          const sol = { s: "Técnico Beta", l: "Cuarto de Servidores", h: "Script PowerShell" };

          box.innerHTML = `
            <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Clue Lógico: Auditoría Forense en el CTP</h3>
            <p style="margin:0 0 12px;font-size:12px;color:#cbd5e1;">Analiza las 3 proposiciones lógicas verdaderas y deduce quién reinició el servicio, en qué recinto y con qué herramienta:</p>
            <div style="background:#111c2d;padding:12px;border-radius:8px;font-size:12px;line-height:1.6;margin-bottom:12px;border-left:3px solid #38bdf8;">
              1. <b>Pista 1:</b> El <i>Analista Alfa</i> estuvo toda la mañana en el <i>Laboratorio 1 (Redes)</i> usando un <i>Cable Consola Serial</i>, donde no ocurrió el incidente.<br/>
              2. <b>Pista 2:</b> Quien ingresó al <i>Cuarto de Servidores</i> NO utilizó una <i>Llave USB Boot</i>.<br/>
              3. <b>Pista 3:</b> El <i>Operador Gamma</i> solo tenía acceso al <i>Laboratorio 3 (Web)</i>.
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin-bottom:12px;">
              <select id="cl-s" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">${sospechosos.map(x=>`<option>${x}</option>`).join('')}</select>
              <select id="cl-l" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">${lugares.map(x=>`<option>${x}</option>`).join('')}</select>
              <select id="cl-h" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">${herramientas.map(x=>`<option>${x}</option>`).join('')}</select>
            </div>
            <button id="cl-check" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Resolver Caso Forense</button>
            <div id="cl-res" style="margin-top:10px;font-size:12px;"></div>
          `;
          document.getElementById('cl-check').onclick = () => {
            const s = document.getElementById('cl-s').value, l = document.getElementById('cl-l').value, h = document.getElementById('cl-h').value;
            const out = document.getElementById('cl-res');
            if (s === sol.s && l === sol.l && h === sol.h) {
              out.innerHTML = `<div style="background:#064e3b;padding:10px;border-radius:6px;color:#ecfdf5;"><b>¡Deducción Exacta!</b> Por descarte lógico, el ${sol.s} en el ${sol.l} ejecutó el ${sol.h}.</div>`;
            } else {
              out.innerHTML = `<div style="background:#450a0a;padding:10px;border-radius:6px;color:#fecaca;">Revisa las 3 pistas por eliminación lógica e inténtalo de nuevo.</div>`;
            }
          };
        }

        // 3. SABOTAJE EN LA RED (ESTILO AMONG US LÓGICO)
        if (juegoActivo === 'amongus') {
          const nodos = [
            { nombre: "Tripulante Azul (Nodo 01)", log: "Ping 172.16.10.1/25 -> Respuesta OK (TTL=64)", impostor: false },
            { nombre: "Tripulante Verde (Nodo 02)", log: "Compresión IPv6: 2001:db8::a0:0:0:1 (RFC 5952 OK)", impostor: false },
            { nombre: "Tripulante Rojo (Nodo 03)", log: "Asignando IP 192.168.10.300/24 y máscara 255.255.255.999", impostor: true },
            { nombre: "Tripulante Ámbar (Nodo 04)", log: "Fórmula Excel: =SI(Y(D2>=70;E2>=80%);'APROBADO';'PENDIENTE')", impostor: false }
          ];
          box.innerHTML = `
            <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Sabotaje en la Red (Detección del Impostor Técnico)</h3>
            <p style="margin:0 0 12px;font-size:12px;color:#cbd5e1;">Uno de los 4 tripulantes está inyectando un paquete técnicamente falso para sabotear el laboratorio. Inspecciona las bitácoras y expulsa al impostor:</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;">
              ${nodos.map((n, i) => `
                <div style="background:#111c2d;border:1px solid #334155;padding:12px;border-radius:8px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                  <div>
                    <div style="font-weight:800;font-size:13px;color:#fff;">${n.nombre}</div>
                    <div style="font-family:monospace;font-size:11px;color:#94a3b8;margin-top:4px;">Bitácora: "${n.log}"</div>
                  </div>
                  <button data-imp="${n.impostor}" class="btn-eject" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Expulsar como Impostor</button>
                </div>
              `).join('')}
            </div>
            <div id="am-res" style="margin-top:12px;font-size:12px;"></div>
          `;
          document.querySelectorAll('.btn-eject').forEach(b => {
            b.onclick = () => {
              const es = b.getAttribute('data-imp') === 'true';
              document.getElementById('am-res').innerHTML = es
                ? `<div style="background:#064e3b;padding:10px;border-radius:6px;color:#ecfdf5;"><b>¡Sabotaje Neutralizado!</b> El Tripulante Rojo era el impostor: ningún octeto IPv4 puede superar el valor 255 (.300 y .999 son ilegales).</div>`
                : `<div style="background:#450a0a;padding:10px;border-radius:6px;color:#fecaca;">Ese tripulante tenía una bitácora 100% válida. Busca cuál registro viola las reglas de direccionamiento IPv4.</div>`;
            };
          });
        }

        // 4, 5 y 6: Damas, Cuatro en Línea y Ajedrez
        if (juegoActivo === 'damas' || juegoActivo === 'ajedrez') {
          const inicial = juegoActivo === 'ajedrez'
            ? [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']]
            : Array(8).fill(null).map((_,r)=>Array(8).fill(null).map((__,c)=>((r+c)%2===1?(r<3?'●':(r>4?'○':'')):'')));
          let tabG = JSON.parse(JSON.stringify(inicial)), selG = null;
          function pintarTablero() {
            box.innerHTML = `<div style="margin-bottom:8px;font-size:12px;">Toca una pieza y luego la casilla de destino:</div><div id="grid-8x8" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:340px;margin:0 auto;border:2px solid #334155;"></div>`;
            const g = document.getElementById('grid-8x8');
            for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
              const osc = (r + c) % 2 === 1;
              const bt = document.createElement('button');
              bt.style.cssText = `height:40px;border:none;font-size:22px;cursor:pointer;background:${selG&&selG.r===r&&selG.c===c?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;`;
              bt.innerText = tabG[r][c];
              bt.onclick = () => {
                if (!selG) { if (tabG[r][c]) { selG = { r, c }; pintarTablero(); } }
                else {
                  if (selG.r !== r || selG.c !== c) { tabG[r][c] = tabG[selG.r][selG.c]; tabG[selG.r][selG.c] = ''; }
                  selG = null; pintarTablero();
                }
              };
              g.appendChild(bt);
            }
          }
          pintarTablero();
        }

        if (juegoActivo === 'cuatro') {
          let g4 = Array(6).fill(null).map(()=>Array(7).fill(0)), turn = 1;
          function pintar4() {
            box.innerHTML = `<div style="margin-bottom:8px;font-size:12px;">Toca una columna para soltar ficha:</div><div id="g4-b" style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;max-width:320px;margin:0 auto;background:#1e293b;padding:8px;border-radius:8px;"></div>`;
            const b = document.getElementById('g4-b');
            for (let r=0;r<6;r++) for (let c=0;c<7;c++) {
              const bt = document.createElement('button');
              bt.style.cssText = `height:38px;border-radius:50%;border:none;cursor:pointer;background:${g4[r][c]===0?'#09111e':(g4[r][c]===1?'#38bdf8':'#f59e0b')};`;
              bt.onclick = () => {
                for (let rw=5;rw>=0;rw--) if (g4[rw][c]===0) { g4[rw][c]=turn; turn=turn===1?2:1; pintar4(); break; }
              };
              b.appendChild(bt);
            }
          }
          pintar4();
        }
      }

      // Eventos Vista 3: Rotonda de Costa Rica con Reprobación Estricta si se sale de la calzada o choca
      if (vista === 'rotonda') {
        const cvs = document.getElementById('cvs-rotonda-strict');
        const banner = document.getElementById('rot-status-banner');
        const ctx = cvs.getContext('2d');
        const cx = 250, cy = 160, rIn = 46, rOut = 104;
        let car = { x: 266, y: 300 }, estado = 'jugando', npcs = [0, 2.1, 4.2];

        function esDentroDeVia(x, y) {
          const dist = Math.hypot(x - cx, y - cy);
          const enAnillo = dist >= rIn && dist <= rOut;
          const enCalleVertical = x >= (cx - 32) && x <= (cx + 32);
          const enCalleHorizontal = y >= (cy - 32) && y <= (cy + 32);
          return enAnillo || enCalleVertical || enCalleHorizontal;
        }

        function mover(d) {
          if (estado !== 'jugando') return;
          if (d === 'u') car.y -= 10;
          if (d === 'd') car.y += 10;
          if (d === 'l') car.x -= 10;
          if (d === 'r') car.x += 10;

          if (!esDentroDeVia(car.x, car.y)) {
            estado = 'reprobado';
            banner.style.background = '#450a0a';
            banner.style.color = '#fca5a5';
            banner.innerText = 'PRUEBA REPROBADA: Te saliste de la calzada / invadiste la isla central. Presiona "Reiniciar Prueba Vial".';
          } else if (car.y <= 22 && car.x >= (cx - 30) && car.x <= (cx + 30)) {
            estado = 'aprobado';
            banner.style.background = '#064e3b';
            banner.style.color = '#6ee7b7';
            banner.innerText = '¡PRUEBA VIAL APROBADA! Circulaste en sentido antihorario sin salirte del carril.';
          }
        }

        document.querySelectorAll('.r-mv').forEach(b => b.onclick = () => mover(b.getAttribute('data-m')));
        document.getElementById('r-reset').onclick = () => {
          car = { x: 266, y: 300 }; estado = 'jugando';
          banner.style.background = '#111c2d'; banner.style.color = '#38bdf8';
          banner.innerText = 'Estado de la Prueba: En curso — Mantente dentro de la calzada gris y llega a la Meta Superior.';
        };
        window.onkeydown = (e) => {
          if (vista !== 'rotonda') return;
          if (e.key === 'ArrowUp') mover('u'); if (e.key === 'ArrowDown') mover('d');
          if (e.key === 'ArrowLeft') mover('l'); if (e.key === 'ArrowRight') mover('r');
        };

        function loop() {
          ctx.clearRect(0, 0, 500, 320);
          // Calles asfaltadas
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - 32, 0, 64, 320);
          ctx.fillRect(0, cy - 32, 500, 64);

          // Anillo de rotonda
          ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.fillStyle = '#334155'; ctx.fill();
          // Isla central prohibida
          ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.fillStyle = '#065f46'; ctx.fill();
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();

          // Meta superior
          ctx.fillStyle = '#10b981';
          ctx.fillRect(cx - 30, 0, 60, 14);
          ctx.fillStyle = '#022c22'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('META CR', cx, 11);

          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
          ctx.fillText('↺ Antihorario', cx, cy + 4);

          // Giro antihorario de vehículos en la rotonda (Costa Rica)
          npcs = npcs.map(a => a - 0.018);
          npcs.forEach(a => {
            const nx = cx + Math.cos(a) * 75, ny = cy + Math.sin(a) * 75;
            ctx.beginPath(); ctx.arc(nx, ny, 9, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
            if (estado === 'jugando' && Math.hypot(car.x - nx, car.y - ny) < 17) {
              estado = 'reprobado';
              banner.style.background = '#450a0a'; banner.style.color = '#fca5a5';
              banner.innerText = 'PRUEBA REPROBADA: Colisión por no ceder el paso dentro de la rotonda.';
            }
          });

          ctx.beginPath(); ctx.arc(car.x, car.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = estado === 'reprobado' ? '#ef4444' : '#38bdf8';
          ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke();

          animRotonda = requestAnimationFrame(loop);
        }
        loop();
      }

      // Eventos Vista 4: Chats de Sección
      if (vista === 'chats') {
        document.querySelectorAll('.ch-sel').forEach(b => {
          b.onclick = () => {
            document.querySelectorAll('.ch-sel').forEach(x => { x.style.background = '#111c2d'; x.style.color = '#cbd5e1'; });
            b.style.background = '#0284c7'; b.style.color = '#fff';
            document.getElementById('ch-header').innerText = 'Canal Activo: # ' + b.getAttribute('data-ch');
          };
        });
        document.getElementById('ch-form-send').onsubmit = (e) => {
          e.preventDefault();
          const inp = document.getElementById('ch-msg-in');
          const d = document.createElement('div');
          d.style.cssText = 'background:#111c2d;border-left:3px solid #0ea5e9;padding:8px 12px;border-radius:6px;';
          d.innerHTML = `<b>${usr.nombre} (${usr.seccion}):</b> ${inp.value}`;
          document.getElementById('ch-feed').appendChild(d);
          inp.value = '';
        };
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();