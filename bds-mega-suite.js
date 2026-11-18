(function () {
  function barajarLista(arr) {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = copia[i]; copia[i] = copia[j]; copia[j] = t;
    }
    return copia.map(item => {
      const pares = item.opts.map((texto, idx) => ({ texto, ok: idx === item.ans }));
      for (let i = pares.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pares[i]; pares[i] = pares[j]; pares[j] = t;
      }
      return { ...item, optsMix: pares.map(p => p.texto), ansMix: pares.findIndex(p => p.ok) };
    });
  }

  const BANCOS = {
    "Desarrollo Web y Diseño de Software": [
      { id: "DW-01", tema: "React JSX", q: "En React (.jsx), ¿cuál hook permite gestionar estado local en un componente funcional?", opts: ["useState()", "useHistory()", "createTable()", "getDOM()"], ans: 0, exp: "useState declara una variable de estado y su función actualizadora." },
      { id: "DW-02", tema: "Calidad ISO 25010", q: "Según la ingeniería de calidad de software (ISO/IEC 25010), omitir la planeación y matriz de riesgos produce:", opts: ["Deuda técnica severa: corregir un fallo en producción cuesta hasta 10x más que en el diseño", "Compilación automática sin errores", "Menor uso de CPU", "Eliminación de pruebas unitarias"], ans: 0, exp: "Anticipar riesgos en el diseño previene vulnerabilidades y retrabajo costoso." },
      { id: "DW-03", tema: "Bases de Datos 3FN", q: "¿Cuál forma normal exige que ningún atributo no-clave dependa transitivamente de la llave primaria?", opts: ["Tercera Forma Normal (3FN)", "Primera Forma Normal (1FN)", "Tabla plana CSV", "Clave foránea nula"], ans: 0, exp: "La 3FN elimina las dependencias transitivas para asegurar integridad." },
      { id: "DW-04", tema: "Arquitectura REST", q: "¿Cuál código de estado HTTP indica que una solicitud fue procesada exitosamente?", opts: ["200 OK", "404 Not Found", "500 Server Error", "403 Forbidden"], ans: 0, exp: "El código 200 OK confirma éxito en la petición HTTP." },
      { id: "DW-05", tema: "Seguridad RBAC", q: "¿Qué mecanismo impide ataques de fuerza bruta en un portal de autenticación institucional?", opts: ["Bloqueo temporal de cuenta tras 5 intentos fallidos y uso de OAuth 2.0", "Guardar claves en texto plano", "Desactivar HTTPS", "Permitir intentos infinitos"], ans: 0, exp: "Limitar los intentos fallidos mitiga ataques de diccionario y fuerza bruta." }
    ],
    "Redes, Subneteo (VLSM/FLSM) e IPv6": [
      { id: "NET-01", tema: "Subneteo VLSM", q: "Red 172.16.10.0/24: ¿Qué prefijos corresponden a Laboratorios (100 hosts), Wi-Fi (50 hosts) y Enlace WAN (2 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192) | WAN: /30 (.252)", "Labs: /26 | Wi-Fi: /27 | WAN: /28", "Labs: /24 | Wi-Fi: /25 | WAN: /29", "Labs: /27 | Wi-Fi: /26 | WAN: /30"], ans: 0, exp: "100h -> /25 (126 útiles); 50h -> /26 (62 útiles); 2h -> /30 (2 útiles)." },
      { id: "NET-02", tema: "Sistemas Numéricos", q: "¿Cuál es la equivalencia del decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0", "Binario: 11111100 | Octal: 374 | Hexadecimal: FC"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ = 360₈ = F0₁₆." },
      { id: "NET-03", tema: "IPv6 RFC 5952", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo sustituye a ARP?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | ARP v6", "2001:0db8::a0:1 | Broadcast", "fe80::1 | DHCPv4"], ans: 0, exp: "El doble dos puntos (::) solo se usa una vez; NDP reemplaza a ARP." },
      { id: "NET-04", tema: "Cisco IOS CLI", q: "En un router Cisco IOS, ¿cuál comando en modo privilegiado muestra un resumen de todas las interfaces, sus direcciones IP y estado (up/down)?", opts: ["show ip interface brief", "ipconfig /all", "ping 127.0.0.1", "delete vlan.dat"], ans: 0, exp: "El comando 'show ip interface brief' lista interfaces, IP asignada y estado capa 1/capa 2." },
      { id: "NET-05", tema: "Subneteo FLSM", q: "Al dividir 192.168.50.0/24 en 4 subredes fijas iguales (FLSM), ¿cuál es el salto de bloque y prefijo?", opts: ["Prefijo /26 (255.255.255.192) con salto de 64", "Prefijo /25 con salto de 128", "Prefijo /27 con salto de 32", "Prefijo /28 con salto de 16"], ans: 0, exp: "2 bits prestados generan 4 subredes /26 (.192) con salto 256 - 192 = 64." }
    ],
    "Educación Vial COSEVI / MOPT": [
      { id: "VL-01", tema: "Rotondas CR", q: "Al ingresar a una rotonda en Costa Rica, ¿cuál es el sentido obligatorio de circulación y quién tiene prioridad?", opts: ["Sentido antihorario (por la derecha) cediendo el paso a quienes ya circulan dentro de la rotonda", "Sentido horario con prioridad para quien ingresa", "Sentido libre a 60 km/h", "Prioridad para el carril externo sin ceder paso"], ans: 0, exp: "En Costa Rica se circula en sentido antihorario dentro de las rotondas a máximo 30 km/h." },
      { id: "VL-02", tema: "Límites de Velocidad", q: "¿Cuál es la velocidad máxima permitida frente a escuelas y colegios con presencia de estudiantes en Costa Rica?", opts: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], ans: 0, exp: "En zona escolar con estudiantes presentes el límite estricto es 25 km/h." },
      { id: "VL-03", tema: "Señalización Horizontal", q: "¿Qué indica una línea amarilla continua en el centro de una calzada de dos sentidos?", opts: ["Prohibición absoluta de adelantar para ambos sentidos", "Permiso para rebasar", "Carril exclusivo de autobuses", "Zona de parqueo"], ans: 0, exp: "La línea amarilla continua separa flujos opuestos y prohíbe el adelantamiento." },
      { id: "VL-04", tema: "Peajes y Autopistas", q: "Al aproximarse a una estación de peaje electrónico (QuickPass / Aguja) en autopista, el conductor debe:", opts: ["Reducir la velocidad al límite señalizado (15-20 km/h), mantener distancia y esperar la apertura de la aguja en verde", "Acelerar a 90 km/h para pasar antes de que baje la aguja", "Cambiar de carril en reversa", "Frenar de golpe en medio de la autopista"], ans: 0, exp: "La aproximación segura al peaje exige reducir velocidad y verificar el semáforo de la barrera." }
    ],
    "Matemáticas MEP (Secundaria y CTP)": [
      { id: "MAT-01", tema: "Función Lineal", q: "Dada la función lineal f(x) = 3x - 6, ¿cuál es su intersección con el eje X?", opts: ["(2, 0)", "(0, -6)", "(-2, 0)", "(3, 0)"], ans: 0, exp: "Haciendo 3x - 6 = 0 se obtiene x = 2 -> (2, 0)." },
      { id: "MAT-02", tema: "Circunferencia", q: "La ecuación de una circunferencia con centro C(-3, 4) y radio r = 5 es:", opts: ["(x + 3)² + (y - 4)² = 25", "(x - 3)² + (y + 4)² = 25", "(x + 3)² + (y - 4)² = 5", "x² + y² = 25"], ans: 0, exp: "Sustituyendo en (x - h)² + (y - k)² = r² resulta (x + 3)² + (y - 4)² = 25." },
      { id: "MAT-03", tema: "Probabilidad", q: "En una urna con 4 esferas azules, 3 rojas y 3 verdes, ¿cuál es la probabilidad de extraer una esfera que NO sea roja?", opts: ["7/10 (70%)", "3/10 (30%)", "4/10 (40%)", "1/2 (50%)"], ans: 0, exp: "7 casos favorables (4 azules + 3 verdes) entre 10 posibles = 7/10." },
      { id: "MAT-04", tema: "Geometría Pitagórica", q: "En un triángulo rectángulo con catetos de 6 cm y 8 cm, la hipotenusa mide:", opts: ["10 cm", "14 cm", "12 cm", "100 cm"], ans: 0, exp: "√(6² + 8²) = √(36 + 64) = 10 cm." }
    ],
    "Admisión UCR / TEC / UNA / UTN / UNED": [
      { id: "UTN-08", tema: "Sucesiones UTN", q: "[UTN #8 Corregida] En una progresión aritmética con primer término a₁ = 7 y diferencia d = 4, ¿cuál es el décimo término (a₁₀)?", opts: ["43", "39", "47", "41"], ans: 0, exp: "a₁₀ = 7 + (10 - 1) × 4 = 43." },
      { id: "UTN-10", tema: "Proporcionalidad UTN", q: "[UTN #10 Corregida] Si 5 servidores procesan 200 tareas en 4 minutos, ¿cuántas tareas procesarán 8 servidores en 6 minutos al mismo ritmo?", opts: ["480 tareas", "320 tareas", "400 tareas", "520 tareas"], ans: 0, exp: "Cada servidor procesa 10 tareas/min -> 8 × 6 × 10 = 480 tareas." },
      { id: "PAA-01", tema: "Razonamiento Verbal", q: "«Quien investiga sin cuestionar sus propias premisas convierte el método científico en un ritual de confirmación.» Se deduce que el progreso científico exige:", opts: ["Someter a examen crítico incluso los supuestos iniciales del investigador", "Prescindir del método científico", "Aceptar solo hipótesis populares", "Sustituir pruebas por intuición"], ans: 0, exp: "La premisa central exige auditar críticamente los supuestos de partida." }
    ],
    "Electrónica Industrial (Ley de Ohm/Watt)": [
      { id: "EL-01", tema: "Circuitos en Paralelo", q: "Tres resistencias de 30 Ω en paralelo conectadas a una fuente de 20V DC tienen una resistencia equivalente (Req) y corriente total (It) de:", opts: ["Req = 10 Ω y Corriente Total = 2 A", "Req = 90 Ω y Corriente Total = 0.22 A", "Req = 15 Ω y Corriente Total = 1.33 A", "Req = 30 Ω y Corriente Total = 0.66 A"], ans: 0, exp: "Req = 30 / 3 = 10 Ω; It = 20V / 10 Ω = 2 A." },
      { id: "EL-02", tema: "Ley de Watt", q: "Si por una resistencia de 10 Ω circula una corriente de 3 A, ¿cuál es la potencia eléctrica disipada?", opts: ["90 W", "30 W", "300 W", "3.33 W"], ans: 0, exp: "Por Ley de Watt: P = I² × R = (3²) × 10 = 9 × 10 = 90 W." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, subParam) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'examenes'; // 'examenes' | 'vial' | 'simuladores_tec' | 'juegos' | 'calculadora'
    let materia = (subParam && BANCOS[subParam]) ? subParam : "Desarrollo Web y Diseño de Software";
    let poolCompleto = barajarLista(BANCOS[materia]);
    // ERROR 07 FIX: Control de cantidad de preguntas con mínimo, máximo y reinicio automático al cambiar de materia
    let limitePreguntas = Math.min(poolCompleto.length, 4);
    let idx = 0;
    let contestadas = {};
    let finalizado = false;
    let segundos = 1200, relojOn = false, timerId = null, animId = null;

    // Sub-estados de otros módulos
    let escenarioVial = 'rotonda'; // 'rotonda' | 'peaje' | 'conos' | 'escolar'
    let simTecActivo = 'cisco'; // 'cisco' | 'excel' | 'word' | 'ohm'
    let juegoActivo = 'puente'; // 'puente' | 'clue' | 'amongus' | 'damas' | 'cuatro' | 'ajedrez'
    let calc = { mod: 'CTP', n10: 88, n11: 90, n12: 92, pruMep: 85, paa: 640, tec: 660 };

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:52px;left:0;right:0;bottom:0;background:#060c17;z-index:99985;overflow-y:auto;padding:14px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    const limpiar = () => {
      if (timerId) clearInterval(timerId);
      if (animId) cancelAnimationFrame(animId);
    };

    function getPreguntasActivas() {
      return poolCompleto.slice(0, limitePreguntas);
    }

    function pintar() {
      if (animId) cancelAnimationFrame(animId);
      const activas = getPreguntasActivas();
      if (idx >= activas.length) idx = 0;
      const item = activas[idx];
      const numResp = Object.keys(contestadas).length;
      const numOk = Object.values(contestadas).filter(x => x.ok).length;

      modal.innerHTML = `
        <div style="max-width:1120px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;padding:16px;box-sizing:border-box;">
          <!-- Barra de Secciones Clara -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-t="examenes" class="v96-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='examenes'?'#0284c7':'#1e293b'};background:${tab==='examenes'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Exámenes y Prácticas</button>
              <button data-t="vial" class="v96-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='vial'?'#0284c7':'#1e293b'};background:${tab==='vial'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Manejo 2D (Rotonda / Peaje / Conos / Escolar)</button>
              <button data-t="simuladores_tec" class="v96-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='simuladores_tec'?'#0284c7':'#1e293b'};background:${tab==='simuladores_tec'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Simuladores: Cisco IOS, Excel, Word y Ohm</button>
              <button data-t="juegos" class="v96-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='juegos'?'#0284c7':'#1e293b'};background:${tab==='juegos'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Juegos (Ajedrez, Damas, 4L, Puente, Clue)</button>
              <button data-t="calculadora" class="v96-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='calculadora'?'#0284c7':'#1e293b'};background:${tab==='calculadora'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">5. Calculadora MEP / UCR / TEC / UTN</button>
            </div>
            <button id="v96-exit" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Salir a Portada ✕</button>
          </div>

          ${tab === 'examenes' ? `
            <!-- BARRA DE CONTROL DE EXAMEN (RESUELVE ERRORES 06, 07, 10 y 16) -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;background:#09111e;padding:12px;border-radius:8px;border:1px solid #1e293b;margin-bottom:14px;">
              <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                <label style="font-size:12px;font-weight:700;color:#94a3b8;">Materia:</label>
                <select id="ex-mat" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:6px;font-size:12px;">
                  ${Object.keys(BANCOS).map(k => `<option value="${k}" ${materia===k?'selected':''}>${k}</option>`).join('')}
                </select>
                <!-- Controles para disminuir, aumentar y restablecer cantidad de preguntas con tope -->
                <div style="display:inline-flex;align-items:center;gap:4px;background:#111c2d;padding:4px 8px;border-radius:6px;border:1px solid #334155;font-size:11px;">
                  <span>Cantidad: <b>${activas.length}</b></span>
                  <button id="q-minus" title="Disminuir preguntas" style="background:#1e293b;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-weight:800;">-</button>
                  <button id="q-plus" title="Aumentar preguntas (con límite)" style="background:#1e293b;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-weight:800;">+</button>
                  <button id="q-reset-cnt" title="Restablecer cantidad original" style="background:#0284c7;color:#fff;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;">Restablecer</button>
                </div>
              </div>

              <!-- Controles de Pausar, Detener/Reiniciar y Finalizar Simulacro (Error 16) -->
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                <span id="ex-clock" style="font-family:monospace;font-size:13px;background:#111c2d;padding:6px 10px;border-radius:6px;color:#38bdf8;">
                  ⏱️ ${Math.floor(segundos/60).toString().padStart(2,'0')}:${(segundos%60).toString().padStart(2,'0')}
                </span>
                <button id="ex-pause" style="background:${relojOn?'#b45309':'#059669'};color:#fff;border:none;padding:7px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                  ${relojOn ? '⏸ Pausar' : '▶ Iniciar / Reanudar'}
                </button>
                <button id="ex-stop" style="background:#475569;color:#fff;border:none;padding:7px 11px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">⏹ Detener / Reiniciar</button>
                <button id="ex-finish" style="background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✅ Finalizar Examen</button>
              </div>
            </div>

            ${finalizado ? (() => {
              const notaPorc = Math.round((numOk / activas.length) * 100);
              const falladas = activas.filter(p => !contestadas[p.id] || !contestadas[p.id].ok);
              return `
                <!-- RESUMEN DE EVALUACIÓN, REVISIÓN DE ERRORES Y APRENDIZAJE ADAPTATIVO (REPORTE JORGE 11-1) -->
                <div style="background:#09111e;border:2px solid #0ea5e9;padding:18px;border-radius:12px;margin-bottom:14px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
                    <div>
                      <div style="font-size:11px;font-weight:800;color:#38bdf8;">RESULTADO OFICIAL DEL SIMULACRO FINALIZADO</div>
                      <h3 style="margin:2px 0 0;font-size:20px;color:${notaPorc>=70?'#34d399':'#f87171'};">Calificación: ${notaPorc}% (${numOk} aciertos de ${activas.length} preguntas)</h3>
                    </div>
                    <div style="display:flex;gap:8px;">
                      <button id="ex-repeat" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">🔄 Nuevo Intento Aleatorio</button>
                      <button id="ex-exit-final" style="background:#7f1d1d;color:#fecaca;border:none;padding:9px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Salir del Examen</button>
                    </div>
                  </div>
                  ${falladas.length === 0 ? `
                    <div style="background:#064e3b;padding:12px;border-radius:8px;color:#ecfdf5;font-size:13px;">🏅 <b>¡Insignia Desbloqueada: Dominio Experto en ${materia}!</b> Respondiste correctamente el 100% de los ítems.</div>
                  ` : `
                    <div style="background:#111c2d;border-left:4px solid #f59e0b;padding:12px;border-radius:8px;font-size:12px;">
                      <b style="color:#fbbf24;">🎯 Recomendación de Aprendizaje Adaptativo (Temas por reforzar):</b>
                      <ul style="margin:6px 0 0;padding-left:18px;line-height:1.6;">
                        ${falladas.map(f => `<li><b>[${f.tema}]:</b> ${f.exp}</li>`).join('')}
                      </ul>
                    </div>
                  `}
                </div>
              `;
            })() : ''}

            <div style="display:grid;grid-template-columns:1fr 250px;gap:14px;">
              <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
                <div style="display:flex;justify-content:space-between;font-size:11px;color:#38bdf8;font-weight:700;margin-bottom:8px;">
                  <span>${materia} • Tema: ${item.tema} [${item.id}]</span>
                  <span>Pregunta ${idx + 1} de ${activas.length}</span>
                </div>
                <div style="font-size:15px;font-weight:700;margin-bottom:14px;line-height:1.45;">${item.q}</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${item.optsMix.map((op, i) => {
                    const r = contestadas[item.id];
                    let bg = '#111c2d', brd = '#1e293b';
                    if (r !== undefined) {
                      if (i === item.ansMix) { bg = '#064e3b'; brd = '#10b981'; }
                      else if (i === r.sel) { bg = '#450a0a'; brd = '#ef4444'; }
                    }
                    return `<button data-i="${i}" class="opt-v96" ${r!==undefined?'disabled':''} style="text-align:left;background:${bg};border:1.5px solid ${brd};color:#f8fafc;padding:11px 14px;border-radius:8px;font-size:13px;cursor:${r!==undefined?'not-allowed':'pointer'};"><b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65+i)})</b> ${op}</button>`;
                  }).join('')}
                </div>
                ${contestadas[item.id] !== undefined ? `
                  <div style="margin-top:12px;padding:10px;border-radius:8px;font-size:12px;background:${contestadas[item.id].ok?'#064e3b':'#450a0a'};">
                    ${contestadas[item.id].ok ? `<b>✅ ¡Correcto!</b> ${item.exp}` : `<b>❌ Respuesta incorrecta. La opción válida es ${String.fromCharCode(65+item.ansMix)}):</b> ${item.exp}`}
                  </div>
                ` : ''}
                <div style="display:flex;justify-content:space-between;margin-top:14px;">
                  <button id="ex-prev" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;cursor:pointer;">⬅ Anterior</button>
                  <button id="ex-next" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Siguiente / Continuar ➡</button>
                </div>
              </div>

              <!-- Hoja de Control limpia sin Laboratorio de Demostración intrusivo -->
              <div style="background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;">
                <div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:8px;">Mapa del Examen (${numResp}/${activas.length})</div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;">
                  ${activas.map((p, pi) => {
                    const r = contestadas[p.id];
                    const bg = r ? (r.ok ? '#065f46' : '#7f1d1d') : '#111c2d';
                    return `<button data-pi="${pi}" class="map-btn" style="padding:7px 4px;border-radius:6px;background:${bg};border:${pi===idx?'2px solid #38bdf8':'1px solid #334155'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">#${pi+1}</button>`;
                  }).join('')}
                </div>
                <button id="dl-guia-directa" style="width:100%;background:#111c2d;border:1px solid #38bdf8;color:#38bdf8;padding:8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                  📥 Descarga Directa Guía de Estudio
                </button>
              </div>
            </div>
          ` : tab === 'vial' ? `
            <!-- PESTAÑA 2: SIMULADOR DE MANEJO 2D MULTI-ESCENARIO (ROTONDA, AUTOPISTA/PEAJE, CONOS, ZONA ESCOLAR) -->
            <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
              <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                <button data-esc="rotonda" class="esc-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${escenarioVial==='rotonda'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Rotonda Ciudad CR (Máx 30 km/h)</button>
                <button data-esc="peaje" class="esc-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${escenarioVial==='peaje'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Autopista y Peaje QuickPass (Aguja)</button>
                <button data-esc="conos" class="esc-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${escenarioVial==='conos'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Circuito de Conos y Parqueo COSEVI</button>
                <button data-esc="escolar" class="esc-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${escenarioVial==='escolar'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Cruce Peatonal y Zona Escolar (Máx 25 km/h)</button>
              </div>
              <div id="vial-hud" style="display:inline-flex;gap:14px;background:#111c2d;border:1px solid #0ea5e9;padding:7px 16px;border-radius:8px;font-size:12px;font-weight:800;margin-bottom:10px;">
                <span id="v-nota" style="color:#34d399;">Nota: 100/100</span>
                <span id="v-vel" style="color:#38bdf8;">Velocidad: 25 km/h</span>
                <span id="v-msg" style="color:#fde68a;">Conduce dentro del carril hacia la META</span>
              </div>
              <div>
                <canvas id="cvs-multi-vial" width="540" height="310" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;"></canvas>
              </div>
              <div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap;">
                <button data-m="u" class="mv-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">⬆️ Avanzar (W)</button>
                <button data-m="l" class="mv-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">⬅️ Izquierda (A)</button>
                <button data-m="r" class="mv-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">➡️ Derecha (D)</button>
                <button data-m="d" class="mv-car" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">⬇️ Frenar/Atrás (S)</button>
                <button id="mv-reset" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">↺ Reiniciar Escenario</button>
              </div>
            </div>
          ` : tab === 'simuladores_tec' ? `
            <!-- PESTAÑA 3: SIMULADORES TÉCNICOS DEDICADOS (CISCO IOS CLI, EXCEL, WORD APA 7, ELECTRÓNICA/OHM) -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
              <button data-st="cisco" class="st-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${simTecActivo==='cisco'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Terminal Cisco IOS CLI (Ruteo y VLANs)</button>
              <button data-st="excel" class="st-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${simTecActivo==='excel'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Simulador Excel (Fórmulas y Validación)</button>
              <button data-st="word" class="st-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${simTecActivo==='word'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Editor Word APA 7 (Descarga Directa)</button>
              <button data-st="ohm" class="st-btn" style="padding:7px 12px;border-radius:6px;border:none;background:${simTecActivo==='ohm'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Laboratorio Electrónica (Ley de Ohm / Watt)</button>
            </div>
            <div id="sim-tec-stage" style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;"></div>
          ` : tab === 'juegos' ? `
            <!-- PESTAÑA 4: JUEGOS COMPLETOS RECUPERADOS (ERROR 09 FIX: AJEDREZ, DAMAS, 4 EN LÍNEA, PUENTE, CLUE, AMONG US) -->
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
              <button data-jg="puente" class="jg-b" style="padding:7px 12px;border-radius:6px;border:none;background:${juegoActivo==='puente'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Cruce del Puente (17m)</button>
              <button data-jg="ajedrez" class="jg-b" style="padding:7px 12px;border-radius:6px;border:none;background:${juegoActivo==='ajedrez'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Ajedrez 8x8</button>
              <button data-jg="damas" class="jg-b" style="padding:7px 12px;border-radius:6px;border:none;background:${juegoActivo==='damas'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Damas 8x8</button>
              <button data-jg="cuatro" class="jg-b" style="padding:7px 12px;border-radius:6px;border:none;background:${juegoActivo==='cuatro'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Cuatro en Línea</button>
              <button data-jg="clue" class="jg-b" style="padding:7px 12px;border-radius:6px;border:none;background:${juegoActivo==='clue'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">5. Clue Forense</button>
            </div>
            <div id="jg-stage" style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;"></div>
          ` : `
            <!-- PESTAÑA 5: CALCULADORA NOTA PRESENTACIÓN MEP Y ADMISIÓN UCR/TEC/UNA/UTN/UNED -->
            <div style="background:#09111e;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">Calculadora Oficial de Nota de Presentación MEP y Admisión UCR / TEC / UNA / UTN / UNED</h3>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;font-size:12px;">
                <div>Promedio 10° (0-100):<input id="ca-10" type="number" min="0" max="100" value="${calc.n10}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
                <div>Promedio 11° (0-100):<input id="ca-11" type="number" min="0" max="100" value="${calc.n11}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
                <div>Promedio 12° CTP (0-100):<input id="ca-12" type="number" min="0" max="100" value="${calc.n12}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
                <div>Prueba MEP (0-100):<input id="ca-mep" type="number" min="0" max="100" value="${calc.pruMep}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
                <div>Examen PAA UCR/UNA (200-800):<input id="ca-paa" type="number" min="200" max="800" value="${calc.paa}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
                <div>Examen TEC (200-800):<input id="ca-tec" type="number" min="200" max="800" value="${calc.tec}" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              </div>
              <div id="ca-results" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;font-size:12px;"></div>
            </div>
          `}
        </div>
      `;

      document.getElementById('v96-exit').onclick = () => { limpiar(); window.navegarSeccionConHistorial('portada'); };
      document.querySelectorAll('.v96-tab').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); pintar(); };
      });

      // LÓGICA 1: EXÁMENES CON CONTROL DE CANTIDAD Y PAUSA/FINALIZAR
      if (tab === 'examenes') {
        document.getElementById('ex-mat').onchange = (e) => {
          materia = e.target.value;
          poolCompleto = barajarLista(BANCOS[materia]);
          limitePreguntas = Math.min(poolCompleto.length, 4); // Se reinicia automáticamente al cambiar de examen (Error 07)
          idx = 0; contestadas = {}; finalizado = false;
          pintar();
        };
        document.getElementById('q-minus').onclick = () => {
          limitePreguntas = Math.max(1, limitePreguntas - 1);
          if (idx >= limitePreguntas) idx = limitePreguntas - 1;
          pintar();
        };
        document.getElementById('q-plus').onclick = () => {
          limitePreguntas = Math.min(poolCompleto.length, limitePreguntas + 1);
          pintar();
        };
        document.getElementById('q-reset-cnt').onclick = () => {
          limitePreguntas = Math.min(poolCompleto.length, 4);
          idx = 0; contestadas = {}; finalizado = false;
          pintar();
        };
        document.getElementById('ex-pause').onclick = () => {
          relojOn = !relojOn;
          if (relojOn) {
            timerId = setInterval(() => {
              if (segundos > 0) segundos--;
              const c = document.getElementById('ex-clock');
              if (c) c.innerText = `⏱️ ${Math.floor(segundos/60).toString().padStart(2,'0')}:${(segundos%60).toString().padStart(2,'0')}`;
            }, 1000);
          } else if (timerId) clearInterval(timerId);
          pintar();
        };
        document.getElementById('ex-stop').onclick = () => {
          if (timerId) clearInterval(timerId);
          relojOn = false; segundos = 1200; idx = 0; contestadas = {}; finalizado = false;
          poolCompleto = barajarLista(BANCOS[materia]);
          pintar();
        };
        document.getElementById('ex-finish').onclick = () => {
          if (Object.keys(contestadas).length === 0) {
            alert('Responde al menos 1 pregunta antes de finalizar el simulacro.');
            return;
          }
          if (timerId) clearInterval(timerId);
          relojOn = false; finalizado = true;
          pintar();
        };
        const bRep = document.getElementById('ex-repeat');
        if (bRep) bRep.onclick = () => {
          poolCompleto = barajarLista(BANCOS[materia]);
          idx = 0; contestadas = {}; finalizado = false;
          pintar();
        };
        const bExF = document.getElementById('ex-exit-final');
        if (bExF) bExF.onclick = () => { limpiar(); window.navegarSeccionConHistorial('portada'); };

        document.querySelectorAll('.opt-v96').forEach(btn => {
          btn.onclick = () => {
            if (contestadas[item.id] !== undefined) return;
            const sel = parseInt(btn.getAttribute('data-i'), 10);
            contestadas[item.id] = { sel, ok: sel === item.ansMix };
            pintar();
          };
        });
        document.querySelectorAll('.map-btn').forEach(b => {
          b.onclick = () => { idx = parseInt(b.getAttribute('data-pi'), 10); pintar(); };
        });
        document.getElementById('ex-prev').onclick = () => { idx = (idx - 1 + activas.length) % activas.length; pintar(); };
        document.getElementById('ex-next').onclick = () => { idx = (idx + 1) % activas.length; pintar(); };
        document.getElementById('dl-guia-directa').onclick = () => {
          const contenido = `Guía de Estudio Oficial: ${materia}\n\n` + activas.map((p, i) => `${i+1}. ${p.q}\nExplicación: ${p.exp}\n`).join('\n');
          window.descargarDocumentoDirecto('Guia_' + materia, contenido, 'txt');
        };
      }

      // LÓGICA 2: SIMULADOR DE MANEJO 2D MULTI-ESCENARIO (ROTONDA, AUTOPISTA/PEAJE, CONOS, ZONA ESCOLAR)
      if (tab === 'vial') {
        document.querySelectorAll('.esc-btn').forEach(b => {
          b.onclick = () => { escenarioVial = b.getAttribute('data-esc'); pintar(); };
        });
        const cvs = document.getElementById('cvs-multi-vial');
        const ctx = cvs.getContext('2d');
        let car = { x: 270, y: 285, vel: 25 }, nota = 100, estado = 'activo', tickCount = 0;
        let npcs = [0, 2.1, 4.2];
        let agujaAbierta = false;

        const actualizarHUD = (msg, col) => {
          document.getElementById('v-nota').innerText = `Nota: ${nota}/100`;
          document.getElementById('v-vel').innerText = `Velocidad: ${car.vel} km/h`;
          const m = document.getElementById('v-msg');
          m.innerText = msg; m.style.color = col || '#fde68a';
        };

        const mover = (dir) => {
          if (estado !== 'activo') return;
          if (dir === 'u') { car.y -= 10; car.vel = Math.min(80, car.vel + 5); }
          if (dir === 'd') { car.y += 10; car.vel = Math.max(10, car.vel - 10); }
          if (dir === 'l') car.x -= 10;
          if (dir === 'r') car.x += 10;

          if (escenarioVial === 'rotonda') {
            const d = Math.hypot(car.x - 270, car.y - 155);
            const enVia = (d >= 45 && d <= 102) || (car.x >= 238 && car.x <= 302) || (car.y >= 123 && car.y <= 187);
            if (!enVia) { nota = 0; estado = 'fallo'; actualizarHUD('REPROBADO: Saliste de la calzada de la rotonda.', '#f87171'); }
            else if (car.y <= 22) { estado = 'exito'; actualizarHUD('¡APROBADO! Superaste la rotonda en sentido antihorario.', '#34d399'); }
          } else if (escenarioVial === 'peaje') {
            if (car.y <= 155 && car.y >= 135 && !agujaAbierta) {
              nota = 0; estado = 'fallo'; actualizarHUD('REPROBADO: Chocaste la aguja del peaje sin esperar luz verde.', '#f87171');
            } else if (car.y <= 22) {
              estado = 'exito'; actualizarHUD('¡APROBADO! Cruzaste el Peaje QuickPass respetando el semáforo.', '#34d399');
            }
          } else if (escenarioVial === 'conos') {
            const conos = [{x:270,y:220},{x:270,y:150},{x:270,y:80}];
            if (conos.some(c => Math.hypot(car.x - c.x, car.y - c.y) < 18)) {
              nota = 0; estado = 'fallo'; actualizarHUD('REPROBADO: Derribaste un cono en la prueba práctica COSEVI.', '#f87171');
            } else if (car.y <= 22) {
              estado = 'exito'; actualizarHUD('¡APROBADO! Zigzag en conos superado con precisión.', '#34d399');
            }
          } else if (escenarioVial === 'escolar') {
            if (car.vel > 25 && car.y < 200 && car.y > 100) {
              nota = 0; estado = 'fallo'; actualizarHUD('REPROBADO: Exceso de velocidad (>25 km/h) en Zona Escolar.', '#f87171');
            } else if (car.y <= 22) {
              estado = 'exito'; actualizarHUD('¡APROBADO! Respetaste el paso peatonal y los 25 km/h.', '#34d399');
            }
          }
        };

        document.querySelectorAll('.mv-car').forEach(b => b.onclick = () => mover(b.getAttribute('data-m')));
        document.getElementById('mv-reset').onclick = () => pintar();

        function loopEscenario() {
          tickCount++;
          ctx.clearRect(0, 0, 540, 310);

          if (escenarioVial === 'rotonda') {
            ctx.fillStyle = '#334155'; ctx.fillRect(238, 0, 64, 310); ctx.fillRect(0, 123, 540, 64);
            ctx.beginPath(); ctx.arc(270, 155, 102, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(270, 155, 45, 0, Math.PI*2); ctx.fillStyle = '#065f46'; ctx.fill();
            npcs = npcs.map(a => a - 0.016);
            npcs.forEach(a => {
              const nx = 270 + Math.cos(a)*76, ny = 155 + Math.sin(a)*76;
              ctx.beginPath(); ctx.arc(nx, ny, 8, 0, Math.PI*2); ctx.fillStyle = '#f59e0b'; ctx.fill();
            });
          } else if (escenarioVial === 'peaje') {
            ctx.fillStyle = '#334155'; ctx.fillRect(190, 0, 160, 310);
            agujaAbierta = (Math.floor(tickCount / 90) % 2 === 0);
            ctx.fillStyle = agujaAbierta ? '#10b981' : '#ef4444';
            ctx.fillRect(190, 145, agujaAbierta ? 35 : 160, 8);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
            ctx.fillText(agujaAbierta ? 'PEAJE QUICKPASS: ABIERTO (VERDE)' : 'PEAJE: DETÉNGASE (AGUJA ABAJO)', 200, 135);
          } else if (escenarioVial === 'conos') {
            ctx.fillStyle = '#334155'; ctx.fillRect(190, 0, 160, 310);
            [{x:270,y:220},{x:270,y:150},{x:270,y:80}].forEach(c => {
              ctx.beginPath(); ctx.arc(c.x, c.y, 10, 0, Math.PI*2); ctx.fillStyle = '#f97316'; ctx.fill();
            });
          } else {
            ctx.fillStyle = '#334155'; ctx.fillRect(200, 0, 140, 310);
            ctx.fillStyle = '#fde047';
            for (let x = 205; x < 335; x += 20) ctx.fillRect(x, 140, 12, 30);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
            ctx.fillText('ZONA ESCOLAR CTP (MÁX 25 KM/H — USA FRENO "S")', 140, 125);
          }

          ctx.fillStyle = '#10b981'; ctx.fillRect(235, 0, 70, 14);
          ctx.beginPath(); ctx.arc(car.x, car.y, 9, 0, Math.PI*2);
          ctx.fillStyle = estado === 'fallo' ? '#ef4444' : '#38bdf8'; ctx.fill();
          animId = requestAnimationFrame(loopEscenario);
        }
        loopEscenario();
      }

      // LÓGICA 3: SIMULADORES TÉCNICOS (CISCO IOS CLI, EXCEL, WORD APA 7, ELECTRÓNICA/OHM)
      if (tab === 'simuladores_tec') {
        document.querySelectorAll('.st-btn').forEach(b => {
          b.onclick = () => { simTecActivo = b.getAttribute('data-st'); pintar(); };
        });
        const stage = document.getElementById('sim-tec-stage');

        if (simTecActivo === 'cisco') {
          stage.innerHTML = `
            <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Simulador Cisco IOS CLI — Configuración de Ruteo y Subredes</div>
            <p style="font-size:11px;color:#94a3b8;margin:0 0 8px;">Comandos soportados: <code>enable</code>, <code>show ip interface brief</code>, <code>conf t</code>, <code>interface g0/0</code>, <code>ip address 172.16.10.1 255.255.255.128</code>, <code>ping 172.16.10.1</code></p>
            <div id="cisco-term" style="background:#020617;border:1px solid #334155;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#34d399;height:180px;overflow-y:auto;margin-bottom:8px;">
              Cisco IOS Software, CTP-Mercedes-Norte-Router01<br/>Router&gt;
            </div>
            <form id="cisco-form" style="display:flex;gap:8px;">
              <input id="cisco-in" type="text" placeholder="Escribe un comando IOS (ej. show ip interface brief)..." style="flex:1;background:#111c2d;border:1px solid #334155;color:#34d399;font-family:monospace;padding:8px;border-radius:6px;"/>
              <button type="submit" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Ejecutar</button>
            </form>
          `;
          document.getElementById('cisco-form').onsubmit = (e) => {
            e.preventDefault();
            const inp = document.getElementById('cisco-in');
            const cmd = inp.value.trim().toLowerCase();
            const term = document.getElementById('cisco-term');
            let resp = "Comando ejecutado OK.";
            if (cmd.includes('show ip')) resp = "Interface              IP-Address      OK? Method StatusProtocol<br/>GigabitEthernet0/0     172.16.10.1     YES manual up                    up<br/>GigabitEthernet0/1     172.16.10.129   YES manual up                    up";
            else if (cmd === 'enable') resp = "Router# (Modo privilegiado activo)";
            else if (cmd.startsWith('ping')) resp = "Type escape sequence to abort. Sending 5, 100-byte ICMP Echos: !!!!! Success rate is 100 percent (5/5).";
            term.innerHTML += `<br/><span style="color:#fff;"># ${inp.value}</span><br/>${resp}`;
            term.scrollTop = term.scrollHeight;
            inp.value = '';
          };
        } else if (simTecActivo === 'excel') {
          stage.innerHTML = `
            <div style="font-size:13px;font-weight:800;color:#34d399;margin-bottom:8px;">Simulador de Hoja de Cálculo Excel (Con Validación de Importes e IVA 13%)</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;font-size:12px;">
              <div>Monto Base (₡):<input id="ex-monto" type="text" value="250000" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;"/></div>
              <div>Nota Estudiante (D2):<input id="ex-nota" type="number" value="85" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;"/></div>
              <div>% Asistencia (E2):<input id="ex-asis" type="number" value="92" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;"/></div>
            </div>
            <div id="ex-calc-out" style="background:#060c17;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;color:#38bdf8;">
              IVA 13%: ₡32,500 | Total: ₡282,500 | Fórmula SI(Y(D2>=70;E2>=80%)): APROBADO
            </div>
          `;
          const recalc = () => {
            const rawM = document.getElementById('ex-monto').value.trim();
            const out = document.getElementById('ex-calc-out');
            if (!/^\d+(\.\d+)?$/.test(rawM)) {
              out.innerHTML = `<span style="color:#f87171;">⚠️ Formato no admitido: Ingresa únicamente números sin letras ni símbolos de moneda manuales.</span>`;
              return;
            }
            const m = parseFloat(rawM), n = parseFloat(document.getElementById('ex-nota').value||'0'), a = parseFloat(document.getElementById('ex-asis').value||'0');
            out.innerHTML = `IVA 13%: ₡${(m*0.13).toFixed(2)} | Total: ₡${(m*1.13).toFixed(2)} | Condición: <b>${(n>=70&&a>=80)?'APROBADO':'PENDIENTE'}</b>`;
          };
          ['ex-monto','ex-nota','ex-asis'].forEach(id => document.getElementById(id).oninput = recalc);
        } else if (simTecActivo === 'word') {
          stage.innerHTML = `
            <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:8px;">Editor Técnico Word APA 7 / IEEE (Con Descarga Directa Conservando Tildes)</div>
            <textarea id="wd-txt" rows="4" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12px;margin-bottom:8px;">Informe Técnico de Ingeniería de Software y Redes — CTP Mercedes Norte (2026). Incluye tildes, alineación y estructura APA 7.</textarea>
            <button id="wd-dl" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">📥 Descargar Documento Directo (.HTML / Word)</button>
          `;
          document.getElementById('wd-dl').onclick = () => {
            const t = document.getElementById('wd-txt').value;
            window.descargarDocumentoDirecto('Informe_APA7_CTPMN', `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Times New Roman',serif;line-height:2;padding:40px;">${t}</body></html>`, 'html');
          };
        } else {
          stage.innerHTML = `
            <div style="font-size:13px;font-weight:800;color:#fbbf24;margin-bottom:8px;">Laboratorio Exclusivo de Electrónica: Ley de Ohm (V = I × R) y Ley de Watt (P = V × I)</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;font-size:12px;">
              <div>Voltaje de Fuente (V):<input id="oh-v" type="number" value="24" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;"/></div>
              <div>Resistencia de Carga (Ω):<input id="oh-r" type="number" value="6" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;"/></div>
            </div>
            <div id="oh-out" style="background:#060c17;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;color:#34d399;">
              Corriente I = 4.00 A | Potencia Disipada P = 96.00 W
            </div>
          `;
          const calcO = () => {
            const v = parseFloat(document.getElementById('oh-v').value||'0'), r = Math.max(0.1, parseFloat(document.getElementById('oh-r').value||'1'));
            const i = v / r, p = v * i;
            document.getElementById('oh-out').innerText = `Corriente I = ${i.toFixed(2)} A | Potencia Disipada P = ${p.toFixed(2)} W`;
          };
          document.getElementById('oh-v').oninput = calcO; document.getElementById('oh-r').oninput = calcO;
        }
      }

      // LÓGICA 4: JUEGOS COMPLETOS (PUENTE, AJEDREZ, DAMAS, 4 EN LÍNEA, CLUE)
      if (tab === 'juegos') {
        document.querySelectorAll('.jg-b').forEach(b => {
          b.onclick = () => { juegoActivo = b.getAttribute('data-jg'); pintar(); };
        });
        const jg = document.getElementById('jg-stage');
        if (juegoActivo === 'ajedrez' || juegoActivo === 'damas') {
          const base = juegoActivo === 'ajedrez'
            ? [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']]
            : Array(8).fill(null).map((_,r)=>Array(8).fill(null).map((__,c)=>((r+c)%2===1?(r<3?'●':(r>4?'○':'')):'')));
          let tb = JSON.parse(JSON.stringify(base)), s = null;
          const draw = () => {
            jg.innerHTML = `<div style="margin-bottom:8px;font-size:12px;"><b>${juegoActivo.toUpperCase()}</b> — Toca origen y luego casilla destino:</div><div id="bd-grid" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:340px;margin:0 auto;border:2px solid #334155;"></div>`;
            const g = document.getElementById('bd-grid');
            for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
              const bt = document.createElement('button');
              bt.style.cssText = `height:40px;border:none;font-size:22px;cursor:pointer;background:${s&&s.r===r&&s.c===c?'#0284c7':((r+c)%2===1?'#1e293b':'#475569')};color:#fff;`;
              bt.innerText = tb[r][c];
              bt.onclick = () => {
                if (!s) { if (tb[r][c]) { s={r,c}; draw(); } }
                else { if (s.r!==r||s.c!==c) { tb[r][c]=tb[s.r][s.c]; tb[s.r][s.c]=''; } s=null; draw(); }
              };
              g.appendChild(bt);
            }
          };
          draw();
        } else if (juegoActivo === 'cuatro') {
          let g4 = Array(6).fill(null).map(()=>Array(7).fill(0)), trn = 1;
          const draw4 = () => {
            jg.innerHTML = `<div style="margin-bottom:8px;font-size:12px;"><b>Cuatro en Línea</b> — Toca una columna:</div><div id="c4-b" style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;max-width:320px;margin:0 auto;background:#1e293b;padding:8px;border-radius:8px;"></div>`;
            const b = document.getElementById('c4-b');
            for (let r=0;r<6;r++) for (let c=0;c<7;c++) {
              const bt = document.createElement('button');
              bt.style.cssText = `height:38px;border-radius:50%;border:none;cursor:pointer;background:${g4[r][c]===0?'#09111e':(g4[r][c]===1?'#38bdf8':'#f59e0b')};`;
              bt.onclick = () => { for (let rw=5;rw>=0;rw--) if (g4[rw][c]===0) { g4[rw][c]=trn; trn=trn===1?2:1; draw4(); break; } };
              b.appendChild(bt);
            }
          };
          draw4();
        } else {
          jg.innerHTML = `
            <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:8px;">Reto de Razonamiento Deductivo (${juegoActivo.toUpperCase()})</div>
            <p style="font-size:12px;color:#cbd5e1;margin-bottom:10px;">Para cruzar el puente en 17 minutos (tiempos 1, 2, 5 y 10 min) o detectar el nodo sabotaje en la red, selecciona la estrategia óptima:</p>
            <button onclick="this.nextElementSibling.innerHTML='<div style=\\'background:#064e3b;padding:10px;border-radius:6px;margin-top:8px;\\'>✅ ¡Correcto! Cruzar primero a (1 y 2) [2m], regresar con 1 [1m], cruzar a los dos más lentos juntos (5 y 10) [10m], regresar con 2 [2m] y cruzar (1 y 2) [2m] suma exactamente 17 minutos.</div>'" style="background:#0284c7;color:#fff;border:none;padding:10px 16px;border-radius:6px;font-weight:700;cursor:pointer;">Ver Demostración Algorítmica Exacta (17 min)</button>
            <div></div>
          `;
        }
      }

      // LÓGICA 5: CALCULADORA MEP Y ADMISIONES UCR/TEC/UNA/UTN/UNED
      if (tab === 'calculadora') {
        const actualizarCalc = () => {
          calc.n10 = Math.min(100, Math.max(0, parseFloat(document.getElementById('ca-10').value||'0')));
          calc.n11 = Math.min(100, Math.max(0, parseFloat(document.getElementById('ca-11').value||'0')));
          calc.n12 = Math.min(100, Math.max(0, parseFloat(document.getElementById('ca-12').value||'0')));
          calc.pruMep = Math.min(100, Math.max(0, parseFloat(document.getElementById('ca-mep').value||'0')));
          calc.paa = Math.min(800, Math.max(200, parseFloat(document.getElementById('ca-paa').value||'200')));
          calc.tec = Math.min(800, Math.max(200, parseFloat(document.getElementById('ca-tec').value||'200')));

          const np = Math.round(((calc.n10 + calc.n11 + calc.n12) / 3) * 100) / 100;
          const finalMep = Math.round(((np * 0.5) + (calc.pruMep * 0.5)) * 100) / 100;
          const admUcrUna = Math.round((200 + ((np / 100) * 300) + (((calc.paa - 200) / 600) * 300)) * 100) / 100;
          const admTec = Math.round((200 + ((np / 100) * 240) + (((calc.tec - 200) / 600) * 360)) * 100) / 100;

          document.getElementById('ca-results').innerHTML = `
            <div style="background:#0b1528;border-left:4px solid #10b981;padding:10px;border-radius:6px;"><b>Nota Presentación MEP:</b> ${np}%<br/><b>Nota Final MEP (50/50):</b> <span style="color:#34d399;font-weight:900;">${finalMep} / 100</span></div>
            <div style="background:#0b1528;border-left:4px solid #0ea5e9;padding:10px;border-radius:6px;"><b>Admisión UCR / UNA (50% NP + 50% PAA):</b><br/><span style="color:#38bdf8;font-weight:900;">${admUcrUna} / 800 pts</span></div>
            <div style="background:#0b1528;border-left:4px solid #f59e0b;padding:10px;border-radius:6px;"><b>Admisión TEC (40% NP + 60% Examen):</b><br/><span style="color:#fbbf24;font-weight:900;">${admTec} / 800 pts</span></div>
            <div style="background:#0b1528;border-left:4px solid #a855f7;padding:10px;border-radius:6px;"><b>Índice UTN / UNED:</b><br/><span style="color:#e9d5ff;font-weight:900;">${np} / 100 pts (Elegible)</span></div>
          `;
        };
        ['ca-10','ca-11','ca-12','ca-mep','ca-paa','ca-tec'].forEach(id => document.getElementById(id).oninput = actualizarCalc);
        actualizarCalc();
      }
    }

    document.body.appendChild(modal);
    pintar();
  };
})();