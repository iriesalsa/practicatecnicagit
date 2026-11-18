(function () {
  // Algoritmo Fisher-Yates para barajar opciones y que la correcta NUNCA sea siempre la opción A (Reporte 11-1 #1)
  function barajarOpciones(listaPreguntas) {
    return listaPreguntas.map(item => {
      const pares = item.opts.map((texto, idx) => ({ texto, esCorrecta: idx === item.ans }));
      for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pares[i];
        pares[i] = pares[j];
        pares[j] = temp;
      }
      return {
        ...item,
        optsBarajadas: pares.map(p => p.texto),
        ansBarajada: pares.findIndex(p => p.esCorrecta)
      };
    });
  }

  // Bancos Estrictamente Separados por Categoría (Cero mezcla de COSEVI con Ohm o Web con UCR)
  const BANCOS_POR_MATERIA = {
    "Desarrollo Web y Software": [
      { id: "WEB-01", q: "En el desarrollo de aplicaciones React (.jsx), ¿cuál hook permite gestionar el estado local de un componente funcional?", opts: ["useState()", "useHistory()", "createTable()", "getElement()"], ans: 0, exp: "useState declara una variable de estado y su función actualizadora en React." },
      { id: "WEB-02", q: "En Diseño de Software, ¿cuál es la consecuencia directa de omitir la matriz de riesgos y la planeación arquitectónica?", opts: ["Deuda técnica alta: corregir en producción cuesta hasta 10 veces más que en la etapa de diseño", "Compilación instantánea sin errores", "Reducción del ancho de banda", "Eliminación de pruebas de usuario"], ans: 0, exp: "Anticipar riesgos en el diseño evita vulnerabilidades y retrabajo costoso en producción." },
      { id: "WEB-03", q: "¿Qué código de estado HTTP confirma que una petición GET o POST fue procesada exitosamente por el servidor?", opts: ["200 OK", "404 Not Found", "500 Internal Server Error", "403 Forbidden"], ans: 0, exp: "La serie 2xx (200 OK / 201 Created) indica éxito en el protocolo HTTP." }
    ],
    "Redes, Subneteo e IPv6": [
      { id: "NET-01", q: "Dada la red 172.16.10.0/24 (VLSM): ¿Qué prefijo y máscara corresponden a Laboratorios (100 hosts) y a Wi-Fi (50 hosts)?", opts: ["Labs: /25 (255.255.255.128) | Wi-Fi: /26 (255.255.255.192)", "Labs: /26 (.192) | Wi-Fi: /27 (.224)", "Labs: /24 (.0) | Wi-Fi: /25 (.128)", "Labs: /30 (.252) | Wi-Fi: /29 (.248)"], ans: 0, exp: "100 hosts requieren 7 bits (/25 = 126 útiles); 50 hosts requieren 6 bits (/26 = 62 útiles)." },
      { id: "NET-02", q: "¿Cuál es la equivalencia exacta del octeto decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0", "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ = 360₈ = F0₁₆." },
      { id: "NET-03", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo reemplaza a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | Protocolo ARP extendido", "2001:0db8::a0:1 | Broadcast ff02::1", "fe80::1 | Protocolo DHCPv4"], ans: 0, exp: "El doble dos puntos (::) solo se usa una vez; NDP reemplaza a ARP en IPv6." }
    ],
    "Admisión UTN / UCR / TEC (Verificado)": [
      { id: "UTN-08", q: "[Pregunta 8 UTN Corregida] En una progresión aritmética donde el primer término es 7 y la diferencia constante es 4, ¿cuál es el valor exacto del décimo término (a₁₀)?", opts: ["43", "39", "47", "40"], ans: 0, exp: "Fórmula verificada: aₙ = a₁ + (n - 1)·d -> a₁₀ = 7 + (10 - 1)·4 = 7 + 36 = 43." },
      { id: "UTN-10", q: "[Pregunta 10 UTN Corregida] Si 5 servidores procesan 200 solicitudes en 4 minutos al mismo ritmo, ¿cuántas solicitudes procesarán 8 servidores en 6 minutos?", opts: ["480 solicitudes", "320 solicitudes", "400 solicitudes", "600 solicitudes"], ans: 0, exp: "Cada servidor procesa 200 / (5 * 4) = 10 solicitudes por minuto. Por tanto, 8 servidores en 6 minutos procesan 8 * 6 * 10 = 480 solicitudes." },
      { id: "UTN-11", q: "Si el 20% de un número equivale a 45, ¿cuál es el 60% de ese mismo número?", opts: ["135", "225", "90", "150"], ans: 0, exp: "Como 60% es el triple de 20%, el resultado es 45 × 3 = 135." }
    ],
    "Educación Vial COSEVI / MOPT (Exclusivo Vial)": [
      { id: "VIAL-01", q: "Según la Ley de Tránsito de Costa Rica, al ingresar y circular dentro de una rotonda, ¿cuál es el sentido correcto de circulación y quién tiene la prioridad de paso?", opts: ["Se circula en sentido antihorario (hacia la derecha) y tiene prioridad el vehículo que ya circula dentro de la rotonda", "Se circula en sentido horario y tiene prioridad quien entra", "Se puede girar en cualquier sentido a 80 km/h", "Tiene prioridad el vehículo que toque bocina"], ans: 0, exp: "En Costa Rica se conduce por la derecha; por tanto, en las rotondas se circula en sentido antihorario a máximo 30 km/h cediendo el paso a quienes ya están dentro." },
      { id: "VIAL-02", q: "En ausencia de señalización específica, ¿cuál es el límite máximo de velocidad frente a centros educativos y hospitalarios en Costa Rica?", opts: ["25 km/h", "60 km/h", "40 km/h", "50 km/h"], ans: 0, exp: "En zona escolar o frente a centros de salud con presencia de peatones, el límite estricto es de 25 km/h." }
    ],
    "Electrónica y Circuitos (Exclusivo Ohm/Watt)": [
      { id: "ELEC-01", q: "Tres resistencias de 30 Ω conectadas en paralelo a una fuente de 20V DC presentan una resistencia equivalente (Req) y corriente total (It) de:", opts: ["Req = 10 Ω y Corriente Total = 2 A", "Req = 90 Ω y Corriente Total = 0.22 A", "Req = 15 Ω y Corriente Total = 1.33 A", "Req = 30 Ω y Corriente Total = 0.66 A"], ans: 0, exp: "Req = 30 / 3 = 10 Ω. Por Ley de Ohm: I = 20V / 10 Ω = 2 A." }
    ],
    "Excel, Word y Gestión Empresarial": [
      { id: "OFF-01", q: "¿Cuál fórmula de Excel evalúa si Nota (D2)>=70 Y Asistencia (E2)>=80% para mostrar 'APROBADO', de lo contrario 'PENDIENTE'?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")", "=SUMA.SI(D2:E2; \">=70\")"], ans: 0, exp: "La función lógica Y() exige el cumplimiento simultáneo de ambos criterios." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial) {
    let previo = document.getElementById('bds-mega-modal');
    if (previo) previo.remove();

    let tabActiva = vistaInicial || 'practicas'; // 'practicas' | 'rotonda_cr' | 'ajedrez' | 'chats' | 'tramites'
    let materiaSel = "Desarrollo Web y Software";
    let listaActual = barajarOpciones(BANCOS_POR_MATERIA[materiaSel]);
    let idx = 0;
    let aciertos = 0, totalResp = 0;

    // Temporizador MANUAL (Reporte QA 11-1: No iniciar solo)
    let timerCorriendo = false;
    let segundos = 0;
    let intervaloTimer = null;
    let animRotonda = null;

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.98);z-index:100001;overflow-y:auto;padding:12px 12px 70px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    function limpiarRecursos() {
      if (intervaloTimer) clearInterval(intervaloTimer);
      if (animRotonda) cancelAnimationFrame(animRotonda);
    }

    function formatearTiempo(s) {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    }

    function pintar() {
      if (animRotonda) cancelAnimationFrame(animRotonda);
      if (idx >= listaActual.length) idx = 0;
      const item = listaActual[idx];

      wrap.innerHTML = `
        <div style="max-width:1100px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.9);">
          <!-- Header Sticky Fijo que NUNCA desaparece al bajar en celular (Reporte QA 11-1) -->
          <div style="position:sticky;top:0;z-index:20;background:#09111e;border-bottom:1px solid #1e293b;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="margin:0;font-size:16px;font-weight:800;color:#f8fafc;">Plataforma Académica & Simuladores — CTP Mercedes Norte</h2>
              <p style="margin:2px 0 0;font-size:11px;color:#64748b;">Bancos verificados con opciones aleatorias • Módulos independientes sin cruces de materia</p>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#111c2d;border:1px solid #1e293b;padding:5px 10px;border-radius:6px;font-size:12px;color:#38bdf8;font-weight:700;">
                Aciertos: ${aciertos}/${totalResp}
              </span>
              <button id="m-close" style="background:#7f1d1d;color:#fecaca;border:1px solid #991b1b;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Navegación Sobria y Clara (5 Módulos Bien Definidos) -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;padding:12px 16px;background:#0b1322;border-bottom:1px solid #1e293b;">
            <button data-t="practicas" class="m-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tabActiva==='practicas'?'#0284c7':'#1e293b'};background:${tabActiva==='practicas'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">1. Simulacros y Redes (Opciones Aleatorias)</button>
            <button data-t="rotonda_cr" class="m-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tabActiva==='rotonda_cr'?'#0284c7':'#1e293b'};background:${tabActiva==='rotonda_cr'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">2. Simulador Vial 2D (Rotonda Costa Rica)</button>
            <button data-t="ajedrez" class="m-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tabActiva==='ajedrez'?'#0284c7':'#1e293b'};background:${tabActiva==='ajedrez'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">3. Ajedrez Lógico Estudiantil</button>
            <button data-t="chats" class="m-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tabActiva==='chats'?'#0284c7':'#1e293b'};background:${tabActiva==='chats'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">4. Canales de Chat por Sección (11-1 / 12-1)</button>
            <button data-t="tramites" class="m-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tabActiva==='tramites'?'#0284c7':'#1e293b'};background:${tabActiva==='tramites'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:600;cursor:pointer;">5. Justificar Ausencia / Permiso Personal</button>
          </div>

          <div style="padding:16px;">
            ${tabActiva === 'practicas' ? `
              <!-- MÓDULO 1: SIMULACROS CON ALEATORIEDAD REAL + TEMPORIZADOR MANUAL + CALCULADORAS -->
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;background:#09111e;padding:12px;border-radius:8px;border:1px solid #1e293b;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <label style="font-size:12px;font-weight:700;color:#94a3b8;">Materia Estricta:</label>
                  <select id="sel-materia-estricta" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:6px;font-size:12px;">
                    ${Object.keys(BANCOS_POR_MATERIA).map(m => `<option value="${m}" ${materiaSel===m?'selected':''}>${m}</option>`).join('')}
                  </select>
                  <button id="btn-rebarajar" style="background:#1e293b;border:1px solid #334155;color:#38bdf8;padding:7px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Barajar Opciones (A/B/C/D)</button>
                </div>

                <!-- Control Manual del Temporizador (No inicia solo) -->
                <div style="display:flex;align-items:center;gap:8px;">
                  <span id="lbl-timer" style="font-family:monospace;font-size:13px;color:#e2e8f0;background:#111c2d;padding:5px 10px;border-radius:6px;border:1px solid #1e293b;">
                    Tiempo: ${formatearTiempo(segundos)} ${timerCorriendo ? '(Activo)' : '(Pausado)'}
                  </span>
                  <button id="btn-toggle-timer" style="background:${timerCorriendo?'#b45309':'#059669'};color:#fff;border:none;padding:7px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                    ${timerCorriendo ? 'Pausar Reloj' : 'Iniciar Simulacro Con Tiempo'}
                  </button>
                </div>
              </div>

              <!-- Tarjeta de Pregunta con Opciones Barajadas -->
              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;font-size:11px;color:#38bdf8;margin-bottom:8px;font-weight:700;">
                  <span>Área Exclusiva: ${materiaSel} • Código [${item.id}]</span>
                  <span>Ejercicio ${idx + 1} de ${listaActual.length}</span>
                </div>
                <div style="font-size:15px;font-weight:700;color:#f8fafc;margin-bottom:14px;line-height:1.45;">${item.q}</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${item.optsBarajadas.map((op, i) => `
                    <button data-i="${i}" class="btn-opt-qa" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#f8fafc;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;transition:border 0.15s;">
                      <b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65 + i)})</b> ${op}
                    </button>
                  `).join('')}
                </div>
                <div id="qa-feedback" style="margin-top:12px;font-size:12px;"></div>
                <div style="display:flex;justify-content:space-between;margin-top:14px;">
                  <button id="qa-prev" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;cursor:pointer;">Anterior</button>
                  <button id="qa-next" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Siguiente Ejercicio</button>
                </div>
              </div>

              <!-- Herramientas de Laboratorio Rápidas (Redes / Bases / IPv6) -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
                <div style="background:#09111e;border:1px solid #1e293b;padding:12px;border-radius:8px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Conversor Decimal ↔ Bin / Oct / Hex</div>
                  <input id="calc-dec" type="number" value="240" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:12px;margin-bottom:6px;"/>
                  <div id="calc-dec-out" style="font-family:monospace;font-size:11px;color:#cbd5e1;">Bin: <b>11110000</b> | Oct: <b>360</b> | Hex: <b>0xF0</b></div>
                </div>
                <div style="background:#09111e;border:1px solid #1e293b;padding:12px;border-radius:8px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Calculadora Subneteo IPv4 (/24 a /30)</div>
                  <input id="calc-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
                  <div id="calc-cidr-out" style="font-family:monospace;font-size:11px;color:#cbd5e1;">Prefijo: <b>/26</b> (.192) | Salto: <b>64</b> | Útiles: <b>62</b></div>
                </div>
                <div style="background:#09111e;border:1px solid #1e293b;padding:12px;border-radius:8px;">
                  <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:6px;">Compresor IPv6 (RFC 5952)</div>
                  <input id="calc-v6" type="text" value="2001:0db8:0000:0000:00a0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;font-family:monospace;margin-bottom:6px;"/>
                  <div id="calc-v6-out" style="font-family:monospace;font-size:11px;color:#38bdf8;"><b>2001:db8::a0:0:0:1</b></div>
                </div>
              </div>
            ` : tabActiva === 'rotonda_cr' ? `
              <!-- MÓDULO 2: SIMULADOR VIAL 2D CORREGIDO (SENTIDO ANTIHORARIO COSTA RICA + FLECHAS) -->
              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
                <h3 style="margin:0 0 6px;font-size:15px;color:#38bdf8;">Simulador Vial 2D — Rotonda de Costa Rica (Circulación por la Derecha / Sentido Antihorario)</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#cbd5e1;background:#111c2d;display:inline-block;padding:6px 14px;border-radius:6px;border:1px solid #0284c7;">
                  Instrucciones de Control: Usa las <b>Flechas del Teclado (⬆️ ⬇️ ⬅️ ➡️)</b>, las teclas <b>W A S D</b> o los <b>botones táctiles en pantalla</b> para mover tu vehículo azul. Cede el paso a los vehículos que ya giran en sentido antihorario dentro de la rotonda.
                </p>
                <div style="display:flex;justify-content:center;margin-bottom:10px;">
                  <canvas id="canvas-rotonda-cr" width="520" height="320" style="max-width:100%;background:#0f172a;border:1px solid #334155;border-radius:10px;"></canvas>
                </div>
                <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
                  <button data-dir="up" class="btn-car-move" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">⬆️ Avanzar</button>
                  <button data-dir="left" class="btn-car-move" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">⬅️ Izquierda</button>
                  <button data-dir="right" class="btn-car-move" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">➡️ Derecha</button>
                  <button data-dir="down" class="btn-car-move" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">⬇️ Retroceder</button>
                </div>
              </div>
            ` : tabActiva === 'ajedrez' ? `
              <!-- MÓDULO 3: AJEDREZ LÓGICO ESTUDIANTIL -->
              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
                  <div>
                    <h3 style="margin:0;font-size:15px;color:#38bdf8;">Ajedrez Lógico & Pensamiento Algorítmico — CTP Mercedes Norte</h3>
                    <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">Haz clic en una pieza para seleccionarla y luego en la casilla de destino. Turno actual: <b id="chess-turn-lbl" style="color:#f8fafc;">Blancas</b></p>
                  </div>
                  <button id="chess-reset" style="background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Reiniciar Tablero</button>
                </div>
                <div id="chess-board-box" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:380px;margin:0 auto;border:2px solid #334155;border-radius:6px;overflow:hidden;"></div>
              </div>
            ` : tabActiva === 'chats' ? `
              <!-- MÓDULO 4: CANALES DE CHAT POR SECCIÓN Y ESPECIALIDAD -->
              <div style="display:grid;grid-template-columns:220px 1fr;gap:12px;background:#09111e;border:1px solid #1e293b;border-radius:10px;padding:12px;min-height:340px;">
                <div style="border-right:1px solid #1e293b;padding-right:10px;display:flex;flex-direction:column;gap:6px;">
                  <div style="font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px;">CANALES DE SECCIÓN</div>
                  <button data-ch="Sección 11-1 (Desarrollo Web)" class="ch-btn" style="text-align:left;background:#0284c7;color:#fff;border:none;padding:8px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;"># Sección 11-1 (QA / Web)</button>
                  <button data-ch="Sección 12-1 (Diseño Software)" class="ch-btn" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Sección 12-1 (Software)</button>
                  <button data-ch="Redes y Ciberseguridad" class="ch-btn" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Laboratorio Redes IPv4/v6</button>
                  <button data-ch="Consultas Profesor Guía" class="ch-btn" style="text-align:left;background:#111c2d;color:#cbd5e1;border:none;padding:8px 10px;border-radius:6px;font-size:12px;cursor:pointer;"># Avisos Profesor Guía</button>
                </div>
                <div style="display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <div id="ch-title" style="font-size:14px;font-weight:800;color:#38bdf8;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:10px;">Canal Activo: # Sección 11-1 (Desarrollo Web)</div>
                    <div id="ch-msgs" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;font-size:12px;">
                      <div style="background:#111c2d;padding:8px 12px;border-radius:8px;"><b>Profesor Max:</b> ¡Excelente trabajo con el reporte de QA de hoy a la 11-1! Ya aplicamos el algoritmo Fisher-Yates para las respuestas, el giro antihorario en la rotonda de CR y el filtro estricto de materias.</div>
                      <div style="background:#111c2d;padding:8px 12px;border-radius:8px;"><b>Coordinación Técnica:</b> Recuerden exportar su comprobante CSV al finalizar el simulacro de subneteo y Excel.</div>
                    </div>
                  </div>
                  <form id="ch-form" style="display:flex;gap:8px;margin-top:10px;">
                    <input id="ch-inp" type="text" placeholder="Escribe un mensaje académico en el canal de tu sección..." required style="flex:1;background:#111c2d;border:1px solid #334155;color:#fff;padding:9px 12px;border-radius:6px;font-size:12px;"/>
                    <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:9px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Enviar</button>
                  </form>
                </div>
              </div>
            ` : `
              <!-- MÓDULO 5: FORMULARIOS SEPARADOS Y CON CABECERA FIJA (REPORTE QA AARON Y DYLAN) -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
                <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                  <h3 style="margin:0 0 6px;font-size:14px;color:#38bdf8;position:sticky;top:0;background:#09111e;padding:4px 0;">Formulario A: Justificación Oficial de Ausencia o Tardía Estudiantil (REAC)</h3>
                  <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">Plazo reglamentario: 3 días hábiles siguientes al reintegro con comprobante médico o legal.</p>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" placeholder="Nombre del Estudiante y Sección (Ej. 11-1)" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <select style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      <option>Justificación de Ausencia a Lecciones</option>
                      <option>Justificación de Llegada Tardía</option>
                    </select>
                    <input type="date" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <textarea rows="2" placeholder="Detalle el motivo de la ausencia o tardía..." style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"></textarea>
                    <button onclick="alert('Justificación de ausencia/tardía registrada con éxito para revisión del Profesor Guía.')" style="background:#0284c7;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Enviar Justificación de Ausencia/Tardía</button>
                  </div>
                </div>

                <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                  <h3 style="margin:0 0 6px;font-size:14px;color:#10b981;position:sticky;top:0;background:#09111e;padding:4px 0;">Formulario B: Solicitud de Permiso Personal / Salida Anticipada</h3>
                  <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">Trámite independiente para retiro anticipado con autorización firmada o gestión laboral docente.</p>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" placeholder="Nombre del Solicitante" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <select style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      <option>Permiso de Salida Anticipada con Encargado Legal</option>
                      <option>Permiso Personal / Cita Oficial Programada</option>
                    </select>
                    <input type="time" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <textarea rows="2" placeholder="Observaciones de la solicitud de permiso..." style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"></textarea>
                    <button onclick="alert('Solicitud de Permiso Personal enviada a Coordinación / Dirección.')" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Registrar Solicitud de Permiso Personal</button>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      `;

      document.getElementById('m-close').onclick = () => { limpiarRecursos(); wrap.remove(); };
      document.querySelectorAll('.m-tab').forEach(b => {
        b.onclick = () => { tabActiva = b.getAttribute('data-t'); pintar(); };
      });

      // Lógica Módulo 1: Prácticas y Temporizador Manual
      if (tabActiva === 'practicas') {
        document.getElementById('sel-materia-estricta').onchange = (e) => {
          materiaSel = e.target.value;
          listaActual = barajarOpciones(BANCOS_POR_MATERIA[materiaSel]);
          idx = 0;
          pintar();
        };
        document.getElementById('btn-rebarajar').onclick = () => {
          listaActual = barajarOpciones(BANCOS_POR_MATERIA[materiaSel]);
          pintar();
        };
        document.getElementById('btn-toggle-timer').onclick = () => {
          timerCorriendo = !timerCorriendo;
          if (timerCorriendo) {
            intervaloTimer = setInterval(() => {
              segundos++;
              const lbl = document.getElementById('lbl-timer');
              if (lbl) lbl.innerText = `Tiempo: ${formatearTiempo(segundos)} (Activo)`;
            }, 1000);
          } else if (intervaloTimer) {
            clearInterval(intervaloTimer);
          }
          pintar();
        };

        document.getElementById('qa-prev').onclick = () => { idx = (idx - 1 + listaActual.length) % listaActual.length; pintar(); };
        document.getElementById('qa-next').onclick = () => { idx = (idx + 1) % listaActual.length; pintar(); };

        document.querySelectorAll('.btn-opt-qa').forEach(btn => {
          btn.onclick = () => {
            const sel = parseInt(btn.getAttribute('data-i'), 10);
            const fb = document.getElementById('qa-feedback');
            totalResp++;
            if (sel === item.ansBarajada) {
              aciertos++;
              fb.innerHTML = `<div style="background:#064e3b;border:1px solid #059669;padding:10px;border-radius:6px;color:#ecfdf5;"><b>Respuesta Correcta (${String.fromCharCode(65 + sel)}):</b> ${item.exp}</div>`;
            } else {
              const letraCorrecta = String.fromCharCode(65 + item.ansBarajada);
              fb.innerHTML = `<div style="background:#450a0a;border:1px solid #dc2626;padding:10px;border-radius:6px;color:#fecaca;"><b>Incorrecto. La opción correcta en este intento aleatorio era la ${letraCorrecta}):</b> ${item.exp}</div>`;
            }
          };
        });

        document.getElementById('calc-dec').oninput = (e) => {
          const n = Math.max(0, Math.min(65535, parseInt(e.target.value || '0', 10)));
          document.getElementById('calc-dec-out').innerHTML = `Bin: <b>${n.toString(2).padStart(8,'0')}</b> | Oct: <b>${n.toString(8)}</b> | Hex: <b>0x${n.toString(16).toUpperCase()}</b>`;
        };
        document.getElementById('calc-cidr').oninput = (e) => {
          const c = parseInt(e.target.value, 10);
          const h = Math.pow(2, 32 - c) - 2, o = 256 - Math.pow(2, 32 - c);
          document.getElementById('calc-cidr-out').innerHTML = `Prefijo: <b>/${c}</b> (.${o}) | Salto: <b>${256-o}</b> | Útiles: <b>${h}</b>`;
        };
        document.getElementById('calc-v6').oninput = (e) => {
          const comp = e.target.value.trim().split(':').map(x => x.replace(/^0+/, '') || '0').join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
          document.getElementById('calc-v6-out').innerHTML = `<b>${comp}</b>`;
        };
      }

      // Lógica Módulo 2: Rotonda de Costa Rica (Sentido Antihorario Correcto: angle -= speed)
      if (tabActiva === 'rotonda_cr') {
        const cvs = document.getElementById('canvas-rotonda-cr');
        if (cvs) {
          const ctx = cvs.getContext('2d');
          const cx = 260, cy = 160, radioRotonda = 82;
          let player = { x: 260, y: 295 };
          // En Costa Rica se entra por la derecha y se gira en sentido ANTIHORARIO (en Canvas Y hacia abajo, restar ángulo gira antihorario)
          let npcAngles = [0, 2.1, 4.2];

          const moverJugador = (dir) => {
            if (dir === 'up') player.y = Math.max(15, player.y - 12);
            if (dir === 'down') player.y = Math.min(305, player.y + 12);
            if (dir === 'left') player.x = Math.max(15, player.x - 12);
            if (dir === 'right') player.x = Math.min(505, player.x + 12);
          };

          window.onkeydown = (ev) => {
            if (tabActiva !== 'rotonda_cr') return;
            if (ev.key === 'ArrowUp' || ev.key === 'w') moverJugador('up');
            if (ev.key === 'ArrowDown' || ev.key === 's') moverJugador('down');
            if (ev.key === 'ArrowLeft' || ev.key === 'a') moverJugador('left');
            if (ev.key === 'ArrowRight' || ev.key === 'd') moverJugador('right');
          };

          document.querySelectorAll('.btn-car-move').forEach(b => {
            b.onclick = () => moverJugador(b.getAttribute('data-dir'));
          });

          function loopRotonda() {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            // Calles de acceso
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(cx - 28, 0, 56, cvs.height);
            ctx.fillRect(0, cy - 28, cvs.width, 56);

            // Anillo de la rotonda
            ctx.beginPath();
            ctx.arc(cx, cy, radioRotonda + 24, 0, Math.PI * 2);
            ctx.fillStyle = '#1e293b';
            ctx.fill();

            // Isla central verde
            ctx.beginPath();
            ctx.arc(cx, cy, radioRotonda - 22, 0, Math.PI * 2);
            ctx.fillStyle = '#065f46';
            ctx.fill();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ROTONDA CR', cx, cy - 4);
            ctx.fillText('↺ Antihorario', cx, cy + 12);

            // Vehículos dentro de la rotonda girando en sentido ANTIHORARIO (Ley de Tránsito CR)
            npcAngles = npcAngles.map(ang => ang - 0.018);
            npcAngles.forEach(ang => {
              const vx = cx + Math.cos(ang) * radioRotonda;
              const vy = cy + Math.sin(ang) * radioRotonda;
              ctx.beginPath();
              ctx.arc(vx, vy, 9, 0, Math.PI * 2);
              ctx.fillStyle = '#f59e0b';
              ctx.fill();
            });

            // Vehículo del estudiante
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#0ea5e9';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            animRotonda = requestAnimationFrame(loopRotonda);
          }
          loopRotonda();
        }
      }

      // Lógica Módulo 3: Ajedrez Lógico
      if (tabActiva === 'ajedrez') {
        const estadoInicial = [
          ['♜','♞','♝','♛','♚','♝','♞','♜'],
          ['♟','♟','♟','♟','♟','♟','♟','♟'],
          ['','','','','','','',''],
          ['','','','','','','',''],
          ['','','','','','','',''],
          ['','','','','','','',''],
          ['♙','♙','♙','♙','♙','♙','♙','♙'],
          ['♖','♘','♗','♕','♔','♗','♘','♖']
        ];
        let tablero = JSON.parse(JSON.stringify(estadoInicial));
        let sel = null;
        let turnoBlancas = true;

        function dibujarAjedrez() {
          const box = document.getElementById('chess-board-box');
          if (!box) return;
          box.innerHTML = '';
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const oscura = (r + c) % 2 === 1;
              const esSel = sel && sel.r === r && sel.c === c;
              const btn = document.createElement('button');
              btn.style.cssText = `height:44px;border:none;font-size:24px;cursor:pointer;background:${esSel ? '#0284c7' : (oscura ? '#1e293b' : '#475569')};color:#fff;display:flex;align-items:center;justify-content:center;`;
              btn.innerText = tablero[r][c];
              btn.onclick = () => {
                if (!sel) {
                  if (tablero[r][c] !== '') { sel = { r, c }; dibujarAjedrez(); }
                } else {
                  if (sel.r !== r || sel.c !== c) {
                    tablero[r][c] = tablero[sel.r][sel.c];
                    tablero[sel.r][sel.c] = '';
                    turnoBlancas = !turnoBlancas;
                    const lbl = document.getElementById('chess-turn-lbl');
                    if (lbl) lbl.innerText = turnoBlancas ? 'Blancas' : 'Negras';
                  }
                  sel = null;
                  dibujarAjedrez();
                }
              };
              box.appendChild(btn);
            }
          }
        }
        dibujarAjedrez();
        document.getElementById('chess-reset').onclick = () => {
          tablero = JSON.parse(JSON.stringify(estadoInicial));
          sel = null;
          turnoBlancas = true;
          dibujarAjedrez();
        };
      }

      // Lógica Módulo 4: Canales de Chat por Sección
      if (tabActiva === 'chats') {
        document.querySelectorAll('.ch-btn').forEach(b => {
          b.onclick = () => {
            document.querySelectorAll('.ch-btn').forEach(x => { x.style.background = '#111c2d'; x.style.color = '#cbd5e1'; });
            b.style.background = '#0284c7';
            b.style.color = '#fff';
            document.getElementById('ch-title').innerText = 'Canal Activo: # ' + b.getAttribute('data-ch');
          };
        });
        document.getElementById('ch-form').onsubmit = (e) => {
          e.preventDefault();
          const inp = document.getElementById('ch-inp');
          const txt = inp.value.trim();
          if (!txt) return;
          const div = document.createElement('div');
          div.style.cssText = 'background:#0284c7;color:#fff;padding:8px 12px;border-radius:8px;';
          div.innerHTML = `<b>Tú (${new Date().toTimeString().slice(0,5)}):</b> ${txt}`;
          const box = document.getElementById('ch-msgs');
          box.appendChild(div);
          box.scrollTop = box.scrollHeight;
          inp.value = '';
        };
      }
    }

    document.body.appendChild(wrap);
    pintar();
  };
})();