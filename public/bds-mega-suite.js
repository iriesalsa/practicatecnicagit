(function () {
  function barajarOpciones(lista) {
    return lista.map(item => {
      const pares = item.opts.map((texto, idx) => ({ texto, ok: idx === item.ans }));
      for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = pares[i]; pares[i] = pares[j]; pares[j] = tmp;
      }
      return { ...item, optsMix: pares.map(p => p.texto), ansMix: pares.findIndex(p => p.ok) };
    });
  }

  const BANCOS_EXPERTOS = {
    "Desarrollo Web y Diseño de Software": [
      { id: "SW-01", q: "Durante la fase de arquitectura de un sistema web, el equipo decide omitir la matriz de riesgos y codificar sin definir roles RBAC. ¿Cuál es el impacto directo según la ingeniería de calidad (ISO/IEC 25010)?", opts: ["Incremento exponencial de la deuda técnica: corregir vulnerabilidades en producción cuesta hasta 10 veces más que prevenirlas en el diseño", "Reducción del tiempo de respuesta de las consultas SQL en el servidor", "Eliminación automática del fenómeno de Scope Creep durante el sprint", "Compilación directa de componentes JSX sin necesidad de empaquetador"], ans: 0, exp: "La prevención temprana en la etapa de diseño evita brechas de seguridad y retrabajo arquitectónico costoso." },
      { id: "SW-02", q: "En React (.jsx), ¿por qué nunca se debe mutar directamente una variable de estado (ej. estado.push(x)) en lugar de usar la función actualizadora de useState?", opts: ["Porque React no detecta el cambio de referencia en memoria y no vuelve a renderizar la interfaz", "Porque el navegador bloquea automáticamente el puerto 443", "Porque convierte los archivos JSX a TypeScript forzosamente", "Porque vacía la base de datos relacional en Supabase"], ans: 0, exp: "React compara referencias inmutables del estado para disparar el reconciliador del Virtual DOM." },
      { id: "SW-03", q: "Para evitar el riesgo de 'Parálisis por Análisis' (sobre-planeación rígida) sin caer en la improvisación, la práctica recomendada en ingeniería de software es:", opts: ["Aplicar planeación iterativa con arquitectura modular base y criterios de aceptación verificables (Definition of Done)", "Documentar durante 12 meses sin escribir una sola línea de código", "Permitir cambios ilimitados de alcance sin control de versiones", "Deshabilitar las pruebas de regresión antes del despliegue"], ans: 0, exp: "El enfoque iterativo combina estructura técnica sólida con entregas incrementales validadas." }
    ],
    "Redes, Subneteo (VLSM/FLSM), Bases e IPv6": [
      { id: "NET-01", q: "Dada la red 172.16.10.0/24 (VLSM): se requiere asignar subredes para Laboratorios (100 hosts), Wi-Fi Estudiantil (50 hosts) y Enlace WAN (2 hosts). ¿Cuáles prefijos optimizan el direccionamiento?", opts: ["Laboratorios: /25 (.128) | Wi-Fi: /26 (.192) | Enlace WAN: /30 (.252)", "Laboratorios: /26 (.192) | Wi-Fi: /27 (.224) | Enlace WAN: /28 (.240)", "Laboratorios: /24 (.0) | Wi-Fi: /25 (.128) | Enlace WAN: /29 (.248)", "Laboratorios: /27 (.224) | Wi-Fi: /26 (.192) | Enlace WAN: /30 (.252)"], ans: 0, exp: "Ordenando de mayor a menor: 100h -> /25 (126 útiles), 50h -> /26 (62 útiles), 2h -> /30 (2 útiles)." },
      { id: "NET-02", q: "¿A qué equivale el valor decimal 224 (último octeto de la máscara /27) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0", "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"], ans: 0, exp: "128+64+32 = 224 -> 11100000₂ | En tríos: 011 100 000 = 340₈ | En nibbles: 1110 0000 = E0₁₆." },
      { id: "NET-03", q: "¿Cuál es la representación comprimida RFC 5952 de 2001:0db8:0000:0000:00f0:0000:0000:0001 y qué protocolo sustituye a ARP en IPv6?", opts: ["2001:db8::f0:0:0:1 | Lo sustituye ICMPv6 NDP (Neighbor Discovery Protocol)", "2001:db8::f0::1 | Lo sustituye RARP", "2001:0db8:0:f0::1 | Lo sustituye Broadcast ff02::1", "fe80::f0:1 | Lo sustituye NAT64"], ans: 0, exp: "El operador '::' solo puede usarse una vez por dirección IPv6; NDP (mensajes NS 135 y NA 136) reemplaza a ARP." }
    ],
    "Productividad: Excel, Word y Gestión": [
      { id: "OFF-01", q: "En Excel, se necesita evaluar si Promedio (D2)>=70 Y Asistencia (E2)>=80% para devolver 'APROBADO', de lo contrario 'PENDIENTE'. ¿Cuál fórmula es exacta?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")", "=CONTAR.SI.CONJUNTO(D2; \">=70\"; E2; \"APROBADO\")"], ans: 0, exp: "La función lógica Y() obliga a que todas las condiciones se cumplan simultáneamente." },
      { id: "OFF-02", q: "Para orientar una sola página en Horizontal (diagrama arquitectónico) dentro de un documento de Word Vertical sin alterar las demás hojas, se debe:", opts: ["Insertar Saltos de Sección (Página siguiente) antes y después de la hoja del diagrama", "Insertar saltos de línea manuales con Enter", "Modificar la sangría francesa de todo el documento", "Desactivar el encabezado de página en la primera hoja"], ans: 0, exp: "Los saltos de sección dividen el documento en contenedores con configuración de página independiente." }
    ],
    "Admisión UTN / UCR / TEC (Verificado)": [
      { id: "UTN-08", q: "[Pregunta 8 UTN] En una sucesión aritmética con primer término a₁ = 7 y diferencia constante d = 4, ¿cuál es el décimo término (a₁₀)?", opts: ["43", "39", "47", "41"], ans: 0, exp: "a₁₀ = 7 + (10 - 1) × 4 = 7 + 36 = 43." },
      { id: "UTN-10", q: "[Pregunta 10 UTN] Si 5 servidores procesan 200 tareas en 4 minutos al mismo ritmo, ¿cuántas tareas procesarán 8 servidores en 6 minutos?", opts: ["480 tareas", "320 tareas", "420 tareas", "540 tareas"], ans: 0, exp: "Tasa unitaria: 200 / (5 × 4) = 10 tareas/min por servidor. Con 8 servidores en 6 min: 8 × 6 × 10 = 480 tareas." }
    ],
    "Educación Vial COSEVI / MOPT": [
      { id: "VIAL-01", q: "Al conducir en una rotonda en Costa Rica, ¿cuál es el sentido obligatorio de giro y la regla de prioridad?", opts: ["Sentido antihorario (circulación por la derecha) cediendo el paso a los vehículos que ya van dentro de la rotonda", "Sentido horario con prioridad para el vehículo que ingresa", "Sentido libre según el carril externo a 60 km/h", "Prioridad exclusiva para quien circule por el carril derecho a alta velocidad"], ans: 0, exp: "En Costa Rica se conduce por la derecha, por lo que el giro en rotondas es antihorario a máximo 30 km/h." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'practicas'; // 'practicas' | 'juegos' | 'planeamiento' | 'chats'
    let subJuego = 'damas'; // 'damas' | 'cuatro' | 'ajedrez' | 'rotonda'
    let materia = "Desarrollo Web y Diseño de Software";
    let lista = barajarOpciones(BANCOS_EXPERTOS[materia]);
    let idx = 0, aciertos = 0, total = 0;
    let timerOn = false, segs = 0, timerId = null, animId = null;

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.98);z-index:100001;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:10px 10px 70px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    const stopAll = () => {
      if (timerId) clearInterval(timerId);
      if (animId) cancelAnimationFrame(animId);
    };

    function pintar() {
      if (animId) cancelAnimationFrame(animId);
      if (idx >= lista.length) idx = 0;
      const item = lista[idx];

      wrap.innerHTML = `
        <div style="max-width:1100px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
          <div style="position:sticky;top:0;z-index:30;background:#09111e;border-bottom:1px solid #1e293b;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:11px;font-weight:700;color:#0ea5e9;">Dirección Regional de Heredia • Circuito 04 • CTP Mercedes Norte</div>
              <h2 style="margin:2px 0 0;font-size:16px;font-weight:800;color:#f8fafc;">Centro Académico, Juegos Lógicos & Planeamiento MEP</h2>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span style="background:#111c2d;border:1px solid #1e293b;padding:5px 10px;border-radius:6px;font-size:12px;color:#38bdf8;font-weight:700;">Puntaje: ${aciertos}/${total}</span>
              <button id="s-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;background:#0b1322;border-bottom:1px solid #1e293b;">
            <button data-t="practicas" class="t-nav" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='practicas'?'#0284c7':'#1e293b'};background:${tab==='practicas'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">1. Simulacros (Opciones A/B/C/D Aleatorias)</button>
            <button data-t="juegos" class="t-nav" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='juegos'?'#0284c7':'#1e293b'};background:${tab==='juegos'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">2. Juegos: Damas, 4 en Línea, Ajedrez & Rotonda CR</button>
            <button data-t="planeamiento" class="t-nav" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='planeamiento'?'#0284c7':'#1e293b'};background:${tab==='planeamiento'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">3. Planeamiento Pedagógico MEP</button>
            <button data-t="chats" class="t-nav" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='chats'?'#0284c7':'#1e293b'};background:${tab==='chats'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">4. Canales de Sección & Justificaciones/Permisos</button>
          </div>

          <div style="padding:16px;">
            ${tab === 'practicas' ? `
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;background:#09111e;padding:10px 12px;border-radius:8px;border:1px solid #1e293b;">
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                  <label style="font-size:12px;font-weight:700;color:#94a3b8;">Área:</label>
                  <select id="sel-area" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:6px;font-size:12px;">
                    ${Object.keys(BANCOS_EXPERTOS).map(k => `<option value="${k}" ${materia===k?'selected':''}>${k}</option>`).join('')}
                  </select>
                  <button id="btn-mix" style="background:#1e293b;border:1px solid #334155;color:#38bdf8;padding:7px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Barajar Opciones A/B/C/D</button>
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <span id="t-clock" style="font-family:monospace;font-size:12px;background:#111c2d;padding:5px 10px;border-radius:6px;">
                    ${Math.floor(segs/60).toString().padStart(2,'0')}:${(segs%60).toString().padStart(2,'0')}
                  </span>
                  <button id="btn-clock" style="background:${timerOn?'#b45309':'#059669'};color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                    ${timerOn ? 'Pausar Reloj' : 'Iniciar Tiempo'}
                  </button>
                </div>
              </div>

              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;font-size:11px;color:#38bdf8;font-weight:700;margin-bottom:8px;">
                  <span>${materia} • Ítem [${item.id}]</span>
                  <span>Pregunta ${idx + 1} de ${lista.length}</span>
                </div>
                <div style="font-size:15px;font-weight:700;margin-bottom:14px;line-height:1.45;">${item.q}</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${item.optsMix.map((op, i) => `
                    <button data-i="${i}" class="opt-ans" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#f8fafc;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;">
                      <b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65 + i)})</b> ${op}
                    </button>
                  `).join('')}
                </div>
                <div id="ans-fb" style="margin-top:12px;font-size:12px;"></div>
                <div style="display:flex;justify-content:space-between;margin-top:14px;">
                  <button id="q-prev" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;cursor:pointer;">Anterior</button>
                  <button id="q-next" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Siguiente Pregunta</button>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
                <div class="bds-card-uniforme" style="padding:12px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Conversor Decimal ↔ Bin / Oct / Hex</div>
                  <input id="c-dec" type="number" value="224" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:12px;margin-bottom:6px;"/>
                  <div id="c-dec-o" style="font-family:monospace;font-size:11px;">Bin: <b>11100000</b> | Oct: <b>340</b> | Hex: <b>0xE0</b></div>
                </div>
                <div class="bds-card-uniforme" style="padding:12px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Calculadora Subneteo IPv4 (/24 a /30)</div>
                  <input id="c-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
                  <div id="c-cidr-o" style="font-family:monospace;font-size:11px;">Prefijo: <b>/26</b> (.192) | Salto: <b>64</b> | Hosts: <b>62</b></div>
                </div>
                <div class="bds-card-uniforme" style="padding:12px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Compresor IPv6 (RFC 5952)</div>
                  <input id="c-v6" type="text" value="2001:0db8:0000:0000:00f0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#060c17;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;font-family:monospace;margin-bottom:6px;"/>
                  <div id="c-v6-o" style="font-family:monospace;font-size:11px;color:#38bdf8;"><b>2001:db8::f0:0:0:1</b></div>
                </div>
              </div>
            ` : tab === 'juegos' ? `
              <!-- MÓDULO 2: JUEGOS LÓGICOS (DAMAS, 4 EN LÍNEA, AJEDREZ Y ROTONDA CR) -->
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
                <button data-g="damas" class="g-sub" style="padding:7px 12px;border-radius:6px;border:1px solid #334155;background:${subJuego==='damas'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Damas (Checkers 8x8)</button>
                <button data-g="cuatro" class="g-sub" style="padding:7px 12px;border-radius:6px;border:1px solid #334155;background:${subJuego==='cuatro'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Cuatro en Línea (Connect 4)</button>
                <button data-g="ajedrez" class="g-sub" style="padding:7px 12px;border-radius:6px;border:1px solid #334155;background:${subJuego==='ajedrez'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Ajedrez Táctico (8x8)</button>
                <button data-g="rotonda" class="g-sub" style="padding:7px 12px;border-radius:6px;border:1px solid #334155;background:${subJuego==='rotonda'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Simulador Vial 2D (Rotonda CR)</button>
              </div>
              <div id="game-stage" style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;"></div>
            ` : tab === 'planeamiento' ? `
              <!-- MÓDULO 3: PLANEAMIENTO PEDAGÓGICO MEP (COLUMNAS OFICIALES Y 4 MOMENTOS) -->
              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
                  <div>
                    <h3 style="margin:0;font-size:15px;color:#38bdf8;">Generador de Práctica Pedagógica y Planeamiento Oficial MEP — CTP Mercedes Norte</h3>
                    <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Jerarquía: Especialidad > Subárea > Nivel > Unidad • 4 Momentos: Focalización, Exploración, Contrastación y Aplicación (DUA)</p>
                  </div>
                  <button id="btn-csv-plan" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Exportar Planeamiento CSV</button>
                </div>
                <div style="overflow-x:auto;">
                  <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                    <thead>
                      <tr style="background:#111c2d;color:#38bdf8;border-bottom:1px solid #1e293b;">
                        <th style="padding:10px;">Resultado de Aprendizaje / Saberes</th>
                        <th style="padding:10px;">Estrategias de Mediación (4 Momentos + DUA)</th>
                        <th style="padding:10px;">Indicadores de Evaluación (Niveles 1-3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:10px;vertical-align:top;width:28%;">
                          <b>Subárea:</b> Programación y Redes (11° / 12°)<br/><br/>
                          <b>Saberes Esenciales:</b> Direccionamiento IPv4 (FLSM/VLSM), IPv6 (RFC 5952), Sistemas Numéricos y Calidad de Software (ISO 25010).
                        </td>
                        <td style="padding:10px;vertical-align:top;line-height:1.55;">
                          <b>1. Focalización (15 min):</b> La persona docente plantea un reto real de segmentación de red del laboratorio y análisis de riesgos de un sistema de login. La persona estudiante identifica los requerimientos de hosts y vulnerabilidades previas.<br/>
                          <b>2. Exploración (25 min):</b> La persona docente facilita los simuladores interactivos de bases numéricas y CIDR. La persona estudiante experimenta en parejas convirtiendo octetos y calculando prefijos /25 a /30.<br/>
                          <b>3. Contrastación (20 min):</b> La persona docente guía la verificación técnica con las normas RFC 5952 e ISO/IEC 25010. La persona estudiante contrasta sus cálculos de subred y matrices de riesgo corrigiendo solapamientos.<br/>
                          <b>4. Aplicación (20 min):</b> La persona docente asigna un caso integral de topología institucional y hoja condicional en Excel. La persona estudiante construye y documenta la tabla VLSM/IPv6 y el prototipo funcional.<br/>
                          <span style="color:#38bdf8;font-size:11px;"><b>Ajustes DUA / Alto Potencial:</b> Apoyo visual interactivo paso a paso y reto adicional de automatización de subredes en código para estudiantes de alto potencial.</span>
                        </td>
                        <td style="padding:10px;vertical-align:top;width:25%;">
                          <b>Indicador Cotidiano REAC:</b><br/>
                          Segmenta bloques de red IPv4/IPv6 y aplica controles de calidad de software.<br/><br/>
                          • <b>Nivel 1 (Inicial):</b> Identifica prefijos básicos.<br/>
                          • <b>Nivel 2 (Intermedio):</b> Calcula subredes FLSM.<br/>
                          • <b>Nivel 3 (Avanzado):</b> Diseña esquemas VLSM/IPv6 sin solapamiento y valida riesgos.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ` : `
              <!-- MÓDULO 4: CANALES DE SECCIÓN Y FORMULARIOS DE AUSENCIA / TARDÍA / PERMISO CORREGIDOS -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;">
                <div style="background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;">
                  <h3 style="margin:0 0 8px;font-size:14px;color:#38bdf8;">Canales de Comunicación por Sección</h3>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                    <button data-c="11-1" class="c-sec-btn" style="background:#0284c7;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;"># Sección 11-1</button>
                    <button data-c="12-1" class="c-sec-btn" style="background:#111c2d;color:#cbd5e1;border:1px solid #334155;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer;"># Sección 12-1</button>
                    <button data-c="Guía" class="c-sec-btn" style="background:#111c2d;color:#cbd5e1;border:1px solid #334155;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer;"># Profesor Guía</button>
                  </div>
                  <div id="chat-log-box" style="background:#060c17;border:1px solid #1e293b;border-radius:8px;padding:10px;height:170px;overflow-y:auto;font-size:12px;display:flex;flex-direction:column;gap:6px;margin-bottom:8px;">
                    <div><b style="color:#38bdf8;">Profe Max:</b> Bienvenidos al canal oficial de la sección. Todas las observaciones de QA móvil de la 11-1 ya están aplicadas.</div>
                  </div>
                  <form id="chat-send-f" style="display:flex;gap:6px;">
                    <input id="chat-txt-in" type="text" placeholder="Escribe un mensaje en el canal..." required style="flex:1;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Enviar</button>
                  </form>
                </div>

                <!-- Formulario Limpio de Justificación de Ausencia, Tardía o Permiso (Sin autocompletado forzado y con scroll libre) -->
                <div style="background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;">
                  <h3 style="margin:0 0 6px;font-size:14px;color:#10b981;">Trámite Oficial: Justificación de Ausencia, Tardía o Permiso Personal</h3>
                  <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">Campos limpios (sin autocompletado automático) y desplazamiento vertical habilitado para teléfonos.</p>
                  <form id="f-justificar-clean" style="display:flex;flex-direction:column;gap:8px;">
                    <select id="j-tipo" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      <option value="Justificación de Ausencia">1. Justificación de Ausencia (Plazo 3 días hábiles REAC)</option>
                      <option value="Justificación de Tardía">2. Justificación de Llegada Tardía</option>
                      <option value="Solicitud de Permiso Personal / Salida">3. Solicitud de Permiso Personal / Salida Anticipada</option>
                    </select>
                    <input id="j-nombre" type="text" value="" placeholder="Escribe apellidos y nombre completo..." autocomplete="off" required style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                      <input id="j-id" type="text" value="" placeholder="Cédula / Carné" autocomplete="off" required style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                      <input id="j-fecha" type="date" required style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    </div>
                    <textarea id="j-motivo" rows="2" placeholder="Describe el motivo de forma manual..." required style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"></textarea>
                    <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Registrar Trámite con Comprobante QR</button>
                  </form>
                  <div id="j-confirm" style="margin-top:8px;font-size:12px;"></div>
                </div>
              </div>
            `}
          </div>
        </div>
      `;

      document.getElementById('s-close').onclick = () => { stopAll(); wrap.remove(); };
      document.querySelectorAll('.t-nav').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); pintar(); };
      });

      if (tab === 'practicas') {
        document.getElementById('sel-area').onchange = (e) => {
          materia = e.target.value;
          lista = barajarOpciones(BANCOS_EXPERTOS[materia]);
          idx = 0;
          pintar();
        };
        document.getElementById('btn-mix').onclick = () => {
          lista = barajarOpciones(BANCOS_EXPERTOS[materia]);
          pintar();
        };
        document.getElementById('btn-clock').onclick = () => {
          timerOn = !timerOn;
          if (timerOn) {
            timerId = setInterval(() => {
              segs++;
              const el = document.getElementById('t-clock');
              if (el) el.innerText = `${Math.floor(segs/60).toString().padStart(2,'0')}:${(segs%60).toString().padStart(2,'0')}`;
            }, 1000);
          } else if (timerId) clearInterval(timerId);
          pintar();
        };
        document.getElementById('q-prev').onclick = () => { idx = (idx - 1 + lista.length) % lista.length; pintar(); };
        document.getElementById('q-next').onclick = () => { idx = (idx + 1) % lista.length; pintar(); };

        document.querySelectorAll('.opt-ans').forEach(btn => {
          btn.onclick = () => {
            const sel = parseInt(btn.getAttribute('data-i'), 10);
            const fb = document.getElementById('ans-fb');
            total++;
            if (sel === item.ansMix) {
              aciertos++;
              fb.innerHTML = `<div style="background:#064e3b;border:1px solid #059669;padding:10px;border-radius:6px;color:#ecfdf5;"><b>Correcto (Opción ${String.fromCharCode(65 + sel)}):</b> ${item.exp}</div>`;
            } else {
              fb.innerHTML = `<div style="background:#450a0a;border:1px solid #dc2626;padding:10px;border-radius:6px;color:#fecaca;"><b>Respuesta incorrecta (La opción correcta en este turno aleatorio era ${String.fromCharCode(65 + item.ansMix)}):</b> ${item.exp}</div>`;
            }
          };
        });

        document.getElementById('c-dec').oninput = (e) => {
          const n = Math.max(0, Math.min(65535, parseInt(e.target.value || '0', 10)));
          document.getElementById('c-dec-o').innerHTML = `Bin: <b>${n.toString(2).padStart(8,'0')}</b> | Oct: <b>${n.toString(8)}</b> | Hex: <b>0x${n.toString(16).toUpperCase()}</b>`;
        };
        document.getElementById('c-cidr').oninput = (e) => {
          const c = parseInt(e.target.value, 10);
          const h = Math.pow(2, 32 - c) - 2, o = 256 - Math.pow(2, 32 - c);
          document.getElementById('c-cidr-o').innerHTML = `Prefijo: <b>/${c}</b> (.${o}) | Salto: <b>${256-o}</b> | Hosts: <b>${h}</b>`;
        };
        document.getElementById('c-v6').oninput = (e) => {
          const comp = e.target.value.trim().split(':').map(x => x.replace(/^0+/, '') || '0').join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
          document.getElementById('c-v6-o').innerHTML = `<b>${comp}</b>`;
        };
      }

      if (tab === 'juegos') {
        document.querySelectorAll('.g-sub').forEach(b => {
          b.onclick = () => { subJuego = b.getAttribute('data-g'); pintar(); };
        });
        const stage = document.getElementById('game-stage');

        // JUEGO A: DAMAS ESPAÑOLAS (CHECKERS 8x8)
        if (subJuego === 'damas') {
          let bDamas = Array(8).fill(null).map((_, r) => Array(8).fill(null).map((__, c) => {
            if ((r + c) % 2 === 1) {
              if (r < 3) return 'N'; // Fichas Negras/Rojas arriba
              if (r > 4) return 'B'; // Fichas Blancas/Celestes abajo
            }
            return '';
          }));
          let selD = null;
          let turnoD = 'B';

          function renderDamas() {
            stage.innerHTML = `
              <div style="margin-bottom:10px;font-size:13px;"><b>Damas Lógicas (8x8)</b> — Selecciona tu ficha y toca la diagonal libre o salta sobre el oponente. Turno: <b style="color:#38bdf8;">${turnoD==='B'?'Celestes':'Ámbar'}</b></div>
              <div id="damas-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:350px;margin:0 auto;border:2px solid #334155;border-radius:6px;overflow:hidden;"></div>
            `;
            const g = document.getElementById('damas-grid');
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                const osc = (r + c) % 2 === 1;
                const cell = document.createElement('button');
                const isSel = selD && selD.r === r && selD.c === c;
                cell.style.cssText = `height:42px;border:none;background:${isSel?'#0284c7':(osc?'#1e293b':'#cbd5e1')};display:flex;align-items:center;justify-content:center;cursor:pointer;`;
                const val = bDamas[r][c];
                if (val) {
                  cell.innerHTML = `<span style="width:28px;height:28px;border-radius:50%;background:${val==='B'?'#38bdf8':'#f59e0b'};border:2px solid #fff;display:inline-block;"></span>`;
                }
                cell.onclick = () => {
                  if (!selD) {
                    if (val === turnoD) { selD = { r, c }; renderDamas(); }
                  } else {
                    const dr = r - selD.r, dc = Math.abs(c - selD.c);
                    if (val === '' && osc && (dc === 1 || dc === 2)) {
                      if (dc === 2) {
                        bDamas[(r + selD.r) >> 1][(c + selD.c) >> 1] = '';
                      }
                      bDamas[r][c] = bDamas[selD.r][selD.c];
                      bDamas[selD.r][selD.c] = '';
                      turnoD = turnoD === 'B' ? 'N' : 'B';
                    }
                    selD = null;
                    renderDamas();
                  }
                };
                g.appendChild(cell);
              }
            }
          }
          renderDamas();
        }

        // JUEGO B: CUATRO EN LÍNEA (CONNECT 4 - 7x6)
        if (subJuego === 'cuatro') {
          let grid4 = Array(6).fill(null).map(() => Array(7).fill(0));
          let jugador = 1, ganador = 0;

          function checkWin(p) {
            for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) if (grid4[r][c]===p && grid4[r][c+1]===p && grid4[r][c+2]===p && grid4[r][c+3]===p) return true;
            for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) if (grid4[r][c]===p && grid4[r+1][c]===p && grid4[r+2][c]===p && grid4[r+3][c]===p) return true;
            for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (grid4[r][c]===p && grid4[r+1][c+1]===p && grid4[r+2][c+2]===p && grid4[r+3][c+3]===p) return true;
            for (let r = 3; r < 6; r++) for (let c = 0; c < 4; c++) if (grid4[r][c]===p && grid4[r-1][c+1]===p && grid4[r-2][c+2]===p && grid4[r-3][c+3]===p) return true;
            return false;
          }

          function render4() {
            stage.innerHTML = `
              <div style="margin-bottom:10px;font-size:13px;"><b>Cuatro en Línea (7x6)</b> — ${ganador ? `<span style="color:#34d399;font-weight:800;">¡Ganó el Jugador ${ganador === 1 ? 'Celeste' : 'Ámbar'}!</span>` : `Toca cualquier columna para soltar ficha (${jugador === 1 ? 'Turno Celeste' : 'Turno Ámbar'})`}</div>
              <div id="c4-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;max-width:340px;margin:0 auto;background:#1e293b;padding:10px;border-radius:10px;"></div>
            `;
            const box = document.getElementById('c4-grid');
            for (let r = 0; r < 6; r++) {
              for (let c = 0; c < 7; c++) {
                const btn = document.createElement('button');
                const v = grid4[r][c];
                btn.style.cssText = `height:40px;border-radius:50%;border:none;cursor:pointer;background:${v===0?'#09111e':(v===1?'#38bdf8':'#f59e0b')};`;
                btn.onclick = () => {
                  if (ganador) return;
                  for (let row = 5; row >= 0; row--) {
                    if (grid4[row][c] === 0) {
                      grid4[row][c] = jugador;
                      if (checkWin(jugador)) ganador = jugador;
                      else jugador = jugador === 1 ? 2 : 1;
                      render4();
                      break;
                    }
                  }
                };
                box.appendChild(btn);
              }
            }
          }
          render4();
        }

        // JUEGO C: AJEDREZ TÁCTICO
        if (subJuego === 'ajedrez') {
          let tabA = [
            ['♜','♞','♝','♛','♚','♝','♞','♜'],
            ['♟','♟','♟','♟','♟','♟','♟','♟'],
            ['','','','','','','',''],['','','','','','','',''],
            ['','','','','','','',''],['','','','','','','',''],
            ['♙','♙','♙','♙','♙','♙','♙','♙'],
            ['♖','♘','♗','♕','♔','♗','♘','♖']
          ];
          let sA = null;
          function renderAj() {
            stage.innerHTML = `
              <div style="margin-bottom:10px;font-size:13px;"><b>Ajedrez Táctico (8x8)</b> — Selecciona pieza de origen y casilla de destino.</div>
              <div id="aj-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:350px;margin:0 auto;border:2px solid #334155;"></div>
            `;
            const g = document.getElementById('aj-grid');
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                const osc = (r + c) % 2 === 1;
                const b = document.createElement('button');
                b.style.cssText = `height:42px;border:none;font-size:23px;cursor:pointer;background:${sA&&sA.r===r&&sA.c===c?'#0284c7':(osc?'#1e293b':'#475569')};color:#fff;`;
                b.innerText = tabA[r][c];
                b.onclick = () => {
                  if (!sA) { if (tabA[r][c]) { sA = { r, c }; renderAj(); } }
                  else {
                    if (sA.r !== r || sA.c !== c) { tabA[r][c] = tabA[sA.r][sA.c]; tabA[sA.r][sA.c] = ''; }
                    sA = null; renderAj();
                  }
                };
                g.appendChild(b);
              }
            }
          }
          renderAj();
        }

        // JUEGO D: ROTONDA DE COSTA RICA (GIRO ANTIHORARIO CORRECTO)
        if (subJuego === 'rotonda') {
          stage.innerHTML = `
            <div style="margin-bottom:8px;font-size:12px;color:#cbd5e1;"><b>Simulador Vial Costa Rica:</b> Usa las flechas del teclado o los botones inferiores. Los vehículos dentro de la rotonda giran en <b>sentido antihorario (por la derecha)</b>.</div>
            <canvas id="cvs-rot" width="480" height="280" style="max-width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;"></canvas>
            <div style="display:flex;justify-content:center;gap:8px;margin-top:8px;">
              <button data-d="u" class="m-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">Arriba</button>
              <button data-d="l" class="m-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">Izquierda</button>
              <button data-d="r" class="m-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">Derecha</button>
              <button data-d="d" class="m-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">Abajo</button>
            </div>
          `;
          const cvs = document.getElementById('cvs-rot');
          const ctx = cvs.getContext('2d');
          let p = { x: 240, y: 260 }, angs = [0, 2.1, 4.2];
          const mv = (d) => {
            if (d==='u') p.y = Math.max(12, p.y - 12);
            if (d==='d') p.y = Math.min(268, p.y + 12);
            if (d==='l') p.x = Math.max(12, p.x - 12);
            if (d==='r') p.x = Math.min(468, p.x + 12);
          };
          document.querySelectorAll('.m-car').forEach(b => b.onclick = () => mv(b.getAttribute('data-d')));
          window.onkeydown = (e) => {
            if (e.key==='ArrowUp') mv('u'); if (e.key==='ArrowDown') mv('d');
            if (e.key==='ArrowLeft') mv('l'); if (e.key==='ArrowRight') mv('r');
          };
          function tick() {
            ctx.clearRect(0,0,480,280);
            ctx.fillStyle = '#1e293b'; ctx.fillRect(215,0,50,280); ctx.fillRect(0,115,480,50);
            ctx.beginPath(); ctx.arc(240,140,95,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(240,140,52,0,Math.PI*2); ctx.fillStyle = '#065f46'; ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('ROTONDA CR (Antihorario)', 240, 144);
            angs = angs.map(a => a - 0.02);
            angs.forEach(a => {
              ctx.beginPath(); ctx.arc(240 + Math.cos(a)*74, 140 + Math.sin(a)*74, 8, 0, Math.PI*2);
              ctx.fillStyle = '#f59e0b'; ctx.fill();
            });
            ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI*2); ctx.fillStyle = '#38bdf8'; ctx.fill();
            animId = requestAnimationFrame(tick);
          }
          tick();
        }
      }

      if (tab === 'planeamiento') {
        document.getElementById('btn-csv-plan').onclick = () => {
          const csv = "\uFEFFInstitucion;Subarea;Nivel;Momentos_MEP;DUA\nCTP Mercedes Norte;Programacion y Redes;11 y 12;Focalizacion, Exploracion, Contrastacion y Aplicacion;Integrado\n";
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
          a.download = "Planeamiento_MEP_2026.csv";
          a.click();
        };
      }

      if (tab === 'chats') {
        document.getElementById('chat-send-f').onsubmit = (e) => {
          e.preventDefault();
          const inp = document.getElementById('chat-txt-in');
          const d = document.createElement('div');
          d.innerHTML = `<b style="color:#10b981;">Tú:</b> ${inp.value}`;
          document.getElementById('chat-log-box').appendChild(d);
          inp.value = '';
        };
        document.getElementById('f-justificar-clean').onsubmit = (e) => {
          e.preventDefault();
          const t = document.getElementById('j-tipo').value;
          const n = document.getElementById('j-nombre').value;
          document.getElementById('j-confirm').innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:8px;border-radius:6px;color:#ecfdf5;">Trámite registrado: <b>${t}</b> para <b>${n}</b>.</div>`;
        };
      }
    }

    document.body.appendChild(wrap);
    pintar();
  };
})();