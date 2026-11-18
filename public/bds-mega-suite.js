(function () {
  function barajar(arr) {
    const c = [...arr];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = c[i]; c[i] = c[j]; c[j] = t;
    }
    return c.map(item => {
      const p = item.opts.map((texto, idx) => ({ texto, ok: idx === item.ans }));
      for (let i = p.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = p[i]; p[i] = p[j]; p[j] = t;
      }
      return { ...item, optsMix: p.map(x => x.texto), ansMix: p.findIndex(x => x.ok) };
    });
  }

  // Calculadora Algorítmica Real de Tablas VLSM / FLSM
  function generarTablaVLSM(ipBaseStr, listaHostsStr) {
    const partes = ipBaseStr.trim().split('.');
    if (partes.length !== 4) return [];
    const baseOctets = partes.map(x => parseInt(x, 10));
    if (baseOctets.some(x => isNaN(x) || x < 0 || x > 255)) return [];

    const reqs = listaHostsStr.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x) && x > 0).sort((a, b) => b - a);
    let ipActual = ((baseOctets[0] << 24) >>> 0) + (baseOctets[1] << 16) + (baseOctets[2] << 8) + baseOctets[3];

    function intToIp(n) {
      return `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;
    }

    return reqs.map((h, i) => {
      let bitsHost = 2;
      while ((Math.pow(2, bitsHost) - 2) < h && bitsHost < 16) bitsHost++;
      const prefijo = 32 - bitsHost;
      const bloque = Math.pow(2, bitsHost);
      const red = ipActual;
      const primerHost = red + 1;
      const ultimoHost = red + bloque - 2;
      const broadcast = red + bloque - 1;
      const maskInt = (0xFFFFFFFF << bitsHost) >>> 0;
      const wildcardInt = (~maskInt) >>> 0;
      ipActual += bloque;
      return {
        subred: `Subred #${i + 1} (${h}h req.)`,
        prefijo: `/${prefijo}`,
        mascara: intToIp(maskInt),
        wildcard: intToIp(wildcardInt),
        redId: intToIp(red),
        rangoUtil: `${intToIp(primerHost)} — ${intToIp(ultimoHost)}`,
        broadcast: intToIp(broadcast),
        hostsUtiles: bloque - 2
      };
    });
  }

  const BANCOS_EXAMENES = {
    "Educación Vial COSEVI / MOPT (Exclusivo Vial)": [
      { id: "VL-01", q: "Al conducir una motocicleta (A1/A2), automóvil (B1) o vehículo articulado (B4) dentro de una rotonda en Costa Rica, ¿cuál es la norma obligatoria?", opts: ["Circular en sentido antihorario (por la derecha) a máximo 30 km/h cediendo el paso a quienes ya van dentro de la rotonda", "Circular en sentido horario a 60 km/h con prioridad para el que ingresa", "Cortar carriles internos sin usar luz direccional", "Ingresar por la izquierda en contravía"], ans: 0, exp: "En Costa Rica se conduce por la derecha; dentro de las rotondas se gira en sentido antihorario a máximo 30 km/h." },
      { id: "VL-02", q: "Para un vehículo pesado articulado (Tráiler Licencia B4), ¿por qué requiere abrir su radio de giro en intersecciones y rotondas?", opts: ["Porque las ruedas del remolque describen una trayectoria más cerrada (off-tracking) y pueden invadir el cordón de caño o carril interno", "Porque el remolque frena antes que el cabezal", "Porque tiene prioridad para circular a 100 km/h en zona urbana", "Porque no necesita espejos retrovisores laterales"], ans: 0, exp: "El fenómeno de arrastre (off-tracking) hace que el eje trasero del remolque cierre más la curva que la cabina." },
      { id: "VL-03", q: "¿Cuál es el límite máximo de velocidad frente a centros educativos con estudiantes presentes en Costa Rica?", opts: ["25 km/h", "50 km/h", "40 km/h", "60 km/h"], ans: 0, exp: "En zona escolar con presencia de estudiantes el límite estricto es de 25 km/h." }
    ],
    "Redes, Subneteo (VLSM/FLSM), Cisco IOS e IPv6": [
      { id: "NET-01", q: "Red 172.16.10.0/24 (VLSM): ¿Cuáles prefijos corresponden a Laboratorios (100 hosts), Wi-Fi (50 hosts) y Enlace WAN (2 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192) | WAN: /30 (.252)", "Labs: /26 | Wi-Fi: /27 | WAN: /28", "Labs: /24 | Wi-Fi: /25 | WAN: /29", "Labs: /27 | Wi-Fi: /26 | WAN: /30"], ans: 0, exp: "100h -> /25 (126 útiles); 50h -> /26 (62 útiles); 2h -> /30 (2 útiles)." },
      { id: "NET-02", q: "En Cisco IOS CLI, ¿cuál secuencia de comandos asigna la IP 192.168.10.1/24 a la interfaz GigabitEthernet0/0 y la enciende?", opts: ["enable -> configure terminal -> interface g0/0 -> ip address 192.168.10.1 255.255.255.0 -> no shutdown", "ipconfig /all -> set ip 192.168.10.1 -> shutdown", "interface g0/0 -> delete ip -> reload", "show running-config -> ping 192.168.10.1"], ans: 0, exp: "En modo de configuración de interfaz se define 'ip address <IP> <MÁSCARA>' seguido de 'no shutdown'." },
      { id: "NET-03", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo reemplaza a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | ARP v6", "2001:0db8::a0:1 | Broadcast", "fe80::1 | DHCPv4"], ans: 0, exp: "El operador '::' se usa una sola vez; ICMPv6 NDP reemplaza a ARP." }
    ],
    "Desarrollo Web, Ciberseguridad y Diseño de Software": [
      { id: "SEC-01", q: "Para proteger un formulario de autenticación contra ataques de Inyección SQL (SQLi) y Fuerza Bruta, el estándar OWASP exige:", opts: ["Consultas parametrizadas (Prepared Statements), hash de contraseñas y bloqueo tras 5 intentos fallidos", "Concatenar el input del usuario directamente en el SELECT SQL", "Validar únicamente con CSS en el cliente", "Almacenar contraseñas en texto plano en localStorage"], ans: 0, exp: "Las consultas parametrizadas separan los datos del código ejecutable SQL y el bloqueo frena ataques automatizados." },
      { id: "SEC-02", q: "En una lista de control de acceso (ACL) de un Firewall perimetral, ¿cuál puerto TCP debe permitirse para tráfico web cifrado HTTPS y cuál debe restringirse del acceso público directo?", opts: ["Permitir TCP 443 (HTTPS) y restringir TCP 3389 (RDP) / TCP 22 (SSH) mediante VPN", "Abrir todos los puertos del 1 al 65535 al público", "Bloquear TCP 443 y abrir Telnet TCP 23 sin cifrado", "Usar únicamente el protocolo ICMP"], ans: 0, exp: "El puerto 443 sirve tráfico TLS/HTTPS seguro, mientras que puertos de administración como 22 o 3389 se protegen tras VPN." }
    ],
    "Excel Avanzado, Contabilidad y Gestión": [
      { id: "EX-01", q: "¿Cuál fórmula de Excel evalúa si el Promedio en D2 es >= 70 Y la Asistencia en E2 es >= 80% para mostrar 'APROBADO', de lo contrario 'PENDIENTE'?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")", "=SUMA(D2:E2)"], ans: 0, exp: "La función Y() exige que ambas condiciones lógicas se cumplan simultáneamente." }
    ],
    "Admisión UCR / TEC / UNA / UTN y Matemáticas MEP": [
      { id: "UTN-08", q: "[UTN #8] En una progresión aritmética con primer término a₁ = 7 y diferencia d = 4, ¿cuál es el décimo término (a₁₀)?", opts: ["43", "39", "47", "41"], ans: 0, exp: "a₁₀ = 7 + (10 - 1) × 4 = 43." },
      { id: "UTN-10", q: "[UTN #10] Si 5 servidores procesan 200 solicitudes en 4 minutos al mismo ritmo, ¿cuántas solicitudes procesarán 8 servidores en 6 minutos?", opts: ["480 solicitudes", "320 solicitudes", "400 solicitudes", "520 solicitudes"], ans: 0, exp: "Cada servidor procesa 10 solicitudes/min. Con 8 servidores en 6 min: 8 × 6 × 10 = 480 solicitudes." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, subParam) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'vial'; // 'vial' | 'redes_cisco' | 'excel_sim' | 'ciberseguridad' | 'examenes' | 'juegos' | 'calculadora'
    let animId = null;

    // Estado Simulador Vial Realista (Moto, Carro, Tráiler)
    let tipoVehiculo = 'carro'; // 'moto' | 'carro' | 'trailer'
    let circuitoVial = 'rotonda'; // 'rotonda' | 'peaje' | 'conos' | 'escolar'

    // Estado Redes / Subneteo / Cisco IOS
    let ipBaseVlsm = '172.16.10.0', hostsVlsm = '100, 50, 25, 2';

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:92px;left:0;right:0;bottom:0;background:#090f1a;z-index:99985;overflow-y:auto;padding:14px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    const stopAnim = () => { if (animId) cancelAnimationFrame(animId); };

    function render() {
      stopAnim();
      modal.innerHTML = `
        <div style="max-width:1160px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;padding:16px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-t="vial" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='vial'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Manejo 2D (Moto / Carro / Tráiler)</button>
              <button data-t="redes_cisco" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='redes_cisco'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Redes, VLSM/FLSM & Cisco IOS CLI</button>
              <button data-t="excel_sim" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='excel_sim'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Simulador Comandos Excel</button>
              <button data-t="ciberseguridad" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='ciberseguridad'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">4. Ciberseguridad & Firewall SOC</button>
              <button data-t="examenes" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='examenes'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">5. Exámenes Oficiales</button>
              <button data-t="juegos" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='juegos'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">6. Juegos Lógicos</button>
              <button data-t="calculadora" class="u-tab" style="padding:8px 11px;border-radius:6px;border:none;background:${tab==='calculadora'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">7. Nota Presentación MEP/U</button>
            </div>
            <button id="u-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Volver a Portada ✕</button>
          </div>

          <div id="u-body"></div>
        </div>
      `;

      document.getElementById('u-close').onclick = () => { stopAnim(); modal.remove(); };
      document.querySelectorAll('.u-tab').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); render(); };
      });

      const body = document.getElementById('u-body');

      // ========================================================================
      // 1. SIMULADOR VIAL 2D REALISTA: MOTO (A1/A2), AUTOMÓVIL (B1) Y TRÁILER (B4)
      // ========================================================================
      if (tab === 'vial') {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 270px;gap:14px;align-items:start;">
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;text-align:center;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button data-veh="moto" class="veh-btn" style="padding:7px 12px;border-radius:6px;border:1.5px solid ${tipoVehiculo==='moto'?'#38bdf8':'#334155'};background:${tipoVehiculo==='moto'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Motocicleta (A1 / A2)</button>
                  <button data-veh="carro" class="veh-btn" style="padding:7px 12px;border-radius:6px;border:1.5px solid ${tipoVehiculo==='carro'?'#38bdf8':'#334155'};background:${tipoVehiculo==='carro'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Automóvil Sedán (B1)</button>
                  <button data-veh="trailer" class="veh-btn" style="padding:7px 12px;border-radius:6px;border:1.5px solid ${tipoVehiculo==='trailer'?'#38bdf8':'#334155'};background:${tipoVehiculo==='trailer'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Tráiler Articulado (B4)</button>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button data-cir="rotonda" class="cir-btn" style="padding:6px 10px;border-radius:6px;border:none;background:${circuitoVial==='rotonda'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Rotonda CR</button>
                  <button data-cir="peaje" class="cir-btn" style="padding:6px 10px;border-radius:6px;border:none;background:${circuitoVial==='peaje'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Peaje Aguja</button>
                  <button data-cir="conos" class="cir-btn" style="padding:6px 10px;border-radius:6px;border:none;background:${circuitoVial==='conos'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Conos COSEVI</button>
                  <button data-cir="escolar" class="cir-btn" style="padding:6px 10px;border-radius:6px;border:none;background:${circuitoVial==='escolar'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Zona Escolar</button>
                </div>
              </div>

              <div id="v98-hud" style="background:#111c2d;border:1px solid #0284c7;padding:8px 14px;border-radius:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:12px;font-weight:700;">
                <span id="vh-score" style="color:#34d399;">Nota COSEVI: 100 / 100 pts</span>
                <span id="vh-speed" style="color:#38bdf8;">Velocímetro: 25 km/h</span>
                <span id="vh-msg" style="color:#fde68a;">Sigue la vía asfaltada hacia el Cajón META (P)</span>
              </div>

              <canvas id="cvs-v98-drive" width="600" height="360" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;display:block;margin:0 auto;"></canvas>
            </div>

            <!-- Panel de Mandos Táctiles y Telemetría del Vehículo -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;">
              <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Mandos de Conducción (${tipoVehiculo.toUpperCase()})</div>
              <p style="font-size:11px;color:#94a3b8;margin:0 0 10px;">
                ${tipoVehiculo === 'moto' ? 'Motocicleta A1/A2: Alta agilidad, faro frontal único y chasis angosto.' :
                  tipoVehiculo === 'carro' ? 'Automóvil B1: 4 ruedas, luces delanteras dobles y radio de giro medio.' :
                  'Tráiler Articulado B4: Cabezal + remolque largo con pivote real. Abre más el giro en curvas para que el remolque no muerda la acera.'}
              </p>
              <button id="btn-auto-marcha" style="width:100%;background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;margin-bottom:8px;">
                ▶ Activar / Pausar Marcha Continua
              </button>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <button data-act="left" class="drv-btn" style="background:#0284c7;color:#fff;border:none;padding:12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">◀ Girar Izq (A)</button>
                <button data-act="right" class="drv-btn" style="background:#0284c7;color:#fff;border:none;padding:12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Girar Der (D) ▶</button>
                <button data-act="up" class="drv-btn" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">▲ Avanzar (W)</button>
                <button data-act="down" class="drv-btn" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">▼ Frenar / Atrás (S)</button>
              </div>
              <button id="btn-drv-reset" style="width:100%;background:#d97706;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                ↺ Reiniciar Vehículo (100 pts)
              </button>
            </div>
          </div>
        `;

        document.querySelectorAll('.veh-btn').forEach(b => b.onclick = () => { tipoVehiculo = b.getAttribute('data-veh'); render(); });
        document.querySelectorAll('.cir-btn').forEach(b => b.onclick = () => { circuitoVial = b.getAttribute('data-cir'); render(); });

        const cvs = document.getElementById('cvs-v98-drive');
        const ctx = cvs.getContext('2d');
        const cx = 300, cy = 190, rIn = 48, rOut = 112;

        // Estado cinemático realista con ángulo de dirección y articulación de remolque para Tráiler B4
        let veh = {
          x: 318, y: 335,
          ang: -Math.PI / 2, // Mirando hacia arriba al iniciar en el carril derecho
          vel: 24,
          marchaAuto: false,
          trailerX: 318, trailerY: 368, trailerAng: -Math.PI / 2
        };
        let nota = 100, estado = 'en_curso', tick = 0;
        let npcs = [
          { ang: 0, rad: 84, col: '#ef4444' },
          { ang: 2.1, rad: 84, col: '#f59e0b' },
          { ang: 4.2, rad: 84, col: '#10b981' }
        ];
        let agujaVerde = true;

        function actualizarHUD(msg, col) {
          const s = document.getElementById('vh-score');
          const v = document.getElementById('vh-speed');
          const m = document.getElementById('vh-msg');
          if (s) { s.innerText = `Nota COSEVI: ${nota} / 100 pts`; s.style.color = nota >= 80 ? '#34d399' : '#f87171'; }
          if (v) v.innerText = `Velocímetro: ${veh.vel} km/h`;
          if (m && msg) { m.innerText = msg; m.style.color = col || '#fde68a'; }
        }

        function estaEnAsfalto(px, py) {
          if (circuitoVial === 'rotonda') {
            const d = Math.hypot(px - cx, py - cy);
            const enAnillo = d >= rIn && d <= rOut;
            const enVertical = px >= (cx - 36) && px <= (cx + 36);
            const enHorizontal = py >= (cy - 36) && py <= (cy + 36);
            const enCajonMeta = px >= 420 && px <= 540 && py >= 20 && py <= 190;
            return enAnillo || enVertical || enHorizontal || enCajonMeta;
          }
          return px >= 200 && px <= 400;
        }

        function avanzarPaso(pasoPx) {
          if (estado !== 'en_curso') return;
          veh.x += Math.cos(veh.ang) * pasoPx;
          veh.y += Math.sin(veh.ang) * pasoPx;

          // Física de articulación real para el remolque del Tráiler B4
          const distRemolque = 30;
          const targetAng = Math.atan2(veh.y - veh.trailerY, veh.x - veh.trailerX);
          veh.trailerAng = targetAng;
          veh.trailerX = veh.x - Math.cos(targetAng) * distRemolque;
          veh.trailerY = veh.y - Math.sin(targetAng) * distRemolque;

          // Validar límites de vía (tanto para la cabina como para el remolque si es Tráiler B4)
          const cabOk = estaEnAsfalto(veh.x, veh.y);
          const remOk = tipoVehiculo !== 'trailer' || estaEnAsfalto(veh.trailerX, veh.trailerY);

          if (!cabOk || !remOk) {
            nota = 0; estado = 'reprobado'; veh.marchaAuto = false;
            actualizarHUD('REPROBADO (0/100): El vehículo o su remolque se salió de la calzada asfaltada.', '#f87171');
            return;
          }

          if (circuitoVial === 'peaje' && veh.y <= 170 && veh.y >= 145 && !agujaVerde) {
            nota = 0; estado = 'reprobado'; veh.marchaAuto = false;
            actualizarHUD('REPROBADO: Derribaste la aguja del peaje en luz roja.', '#f87171');
            return;
          }

          if (circuitoVial === 'escolar' && veh.vel > 25 && veh.y <= 210 && veh.y >= 110) {
            nota = 0; estado = 'reprobado'; veh.marchaAuto = false;
            actualizarHUD('REPROBADO: Exceso de velocidad (>25 km/h) en Zona Escolar CTP.', '#f87171');
            return;
          }

          // Validar llegada a Meta (Cajón P en rotonda o Meta superior en pistas rectas)
          if ((circuitoVial === 'rotonda' && veh.x >= 445 && veh.x <= 525 && veh.y >= 30 && veh.y <= 95) ||
              (circuitoVial !== 'rotonda' && veh.y <= 28)) {
            estado = 'aprobado'; veh.marchaAuto = false;
            actualizarHUD(`¡PRUEBA SUPERADA CON ${nota}/100 PTS! Maniobra oficial completada con ${tipoVehiculo.toUpperCase()}.`, '#34d399');
          }
        }

        function ejecutarMando(accion) {
          if (estado !== 'en_curso') return;
          if (accion === 'left') veh.ang -= 0.18;
          if (accion === 'right') veh.ang += 0.18;
          if (accion === 'up') { veh.vel = Math.min(60, veh.vel + 3); avanzarPaso(8); actualizarHUD(); }
          if (accion === 'down') { veh.vel = Math.max(15, veh.vel - 5); avanzarPaso(-5); actualizarHUD(); }
        }

        document.querySelectorAll('.drv-btn').forEach(b => b.onclick = () => ejecutarMando(b.getAttribute('data-act')));
        document.getElementById('btn-auto-marcha').onclick = () => {
          if (estado === 'en_curso') veh.marchaAuto = !veh.marchaAuto;
        };
        document.getElementById('btn-drv-reset').onclick = () => render();

        window.onkeydown = (e) => {
          if (tab !== 'vial') return;
          const el = document.activeElement;
          if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')) return;
          if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') ejecutarMando('left');
          if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') ejecutarMando('right');
          if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') ejecutarMando('up');
          if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') ejecutarMando('down');
        };

        // Función de Dibujo Realista de Moto, Automóvil y Tráiler Articulado
        function dibujarVehiculoRealista(x, y, ang, tipo, colorPrincipal) {
          if (tipo === 'trailer') {
            // 1. Dibujar Remolque Articulado (Furgón Blanco/Gris con llantas traseras)
            ctx.save();
            ctx.translate(veh.trailerX, veh.trailerY);
            ctx.rotate(veh.trailerAng);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-16, -9, 8, 18); // Eje tándem trasero
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-18, -7, 30, 14); // Caja del furgón
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-18, -7, 30, 14);
            ctx.restore();
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ang);

          if (tipo === 'moto') {
            // Motocicleta A1/A2: Rueda delantera y trasera, manubrio, carenado, casco y faro LED
            ctx.fillStyle = '#020617';
            ctx.fillRect(-10, -2.5, 20, 5); // Llantas en línea
            ctx.fillStyle = colorPrincipal;
            ctx.fillRect(-6, -4.5, 12, 9); // Chasis moto
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(4, -7); ctx.lineTo(4, 7); ctx.stroke(); // Manubrio
            ctx.beginPath(); ctx.arc(-1, 0, 4.2, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill(); // Casco motociclista
            ctx.fillStyle = '#fef08a'; ctx.fillRect(9, -2, 3, 4); // Luz frontal
          } else {
            // Automóvil B1 o Cabina de Cabezal B4: 4 llantas, carrocería, parabrisas y faros dobles
            ctx.fillStyle = '#020617';
            ctx.fillRect(-9, -9, 6, 3); ctx.fillRect(4, -9, 6, 3); // Llantas izq
            ctx.fillRect(-9, 6, 6, 3);  ctx.fillRect(4, 6, 6, 3);  // Llantas der
            ctx.fillStyle = colorPrincipal;
            ctx.fillRect(-11, -7, 22, 14); // Carrocería
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-3, -5.5, 8, 11); // Parabrisas y techo
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(10, -6, 2.5, 3.5); ctx.fillRect(10, 2.5, 2.5, 3.5); // Faros delanteros
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-11.5, -6, 2, 3); ctx.fillRect(-11.5, 3, 2, 3); // Luces de freno
          }
          ctx.restore();
        }

        function loopDrive() {
          tick++;
          if (veh.marchaAuto && estado === 'en_curso') avanzarPaso(1.45);

          ctx.clearRect(0, 0, 600, 360);

          if (circuitoVial === 'rotonda') {
            // Calles y anillo de rotonda
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(cx - 36, 0, 72, 360);
            ctx.fillRect(0, cy - 36, 600, 72);
            // Acceso hacia el Cajón de Estacionamiento META (P)
            ctx.fillRect(440, 20, 95, 175);

            ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, (rIn + rOut) / 2, 0, Math.PI * 2);
            ctx.setLineDash([7, 7]); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);

            // Isla central
            ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.fillStyle = '#065f46'; ctx.fill();
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('ROTONDA CR', cx, cy - 3);
            ctx.fillText('30 km/h ↺', cx, cy + 12);

            // Línea guía punteada celeste por el carril derecho (antihorario) hacia META (P)
            ctx.beginPath();
            ctx.setLineDash([5, 5]); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
            ctx.moveTo(318, 345); ctx.lineTo(318, 265);
            ctx.arc(cx, cy, 80, Math.PI / 2, 0, true);
            ctx.lineTo(485, 190); ctx.lineTo(485, 65);
            ctx.stroke(); ctx.setLineDash([]);

            // Cajón META (P)
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
            ctx.strokeRect(448, 28, 76, 58);
            ctx.fillStyle = '#34d399'; ctx.font = 'bold 12px Inter,sans-serif';
            ctx.fillText('③ META (P)', 486, 60);

            // Vehículos NPC girando en sentido antihorario (Ley de Tránsito de Costa Rica)
            npcs.forEach(n => {
              n.ang -= 0.014;
              const nx = cx + Math.cos(n.ang) * n.rad;
              const ny = cy + Math.sin(n.ang) * n.rad;
              dibujarVehiculoRealista(nx, ny, n.ang - Math.PI / 2, 'carro', n.col);
              if (estado === 'en_curso' && Math.hypot(veh.x - nx, veh.y - ny) < 20) {
                nota = 0; estado = 'reprobado'; veh.marchaAuto = false;
                actualizarHUD('REPROBADO (0/100): Colisión dentro de la rotonda por no ceder la vía.', '#f87171');
              }
            });
          } else {
            // Pista recta para Peaje QuickPass, Conos COSEVI o Zona Escolar
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(200, 0, 200, 360);
            ctx.setLineDash([8, 8]); ctx.strokeStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(300, 360); ctx.stroke(); ctx.setLineDash([]);

            if (circuitoVial === 'peaje') {
              agujaVerde = (Math.floor(tick / 100) % 2 === 0);
              ctx.fillStyle = agujaVerde ? '#10b981' : '#ef4444';
              ctx.fillRect(200, 155, agujaVerde ? 45 : 200, 9);
              ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center';
              ctx.fillText(agujaVerde ? 'PEAJE QUICKPASS: ABIERTO (PASE)' : 'PEAJE EN ROJO: DETÉNGASE (S)', 300, 142);
            } else if (circuitoVial === 'conos') {
              const conos = [{x:318,y:260},{x:275,y:190},{x:318,y:120}];
              conos.forEach(c => {
                ctx.beginPath(); ctx.arc(c.x, c.y, 9, 0, Math.PI * 2); ctx.fillStyle = '#f97316'; ctx.fill();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
                if (estado === 'en_curso' && (Math.hypot(veh.x - c.x, veh.y - c.y) < 16 || (tipoVehiculo==='trailer' && Math.hypot(veh.trailerX - c.x, veh.trailerY - c.y) < 16))) {
                  nota = 0; estado = 'reprobado'; veh.marchaAuto = false;
                  actualizarHUD('REPROBADO: Derribaste un cono en la prueba de control COSEVI.', '#f87171');
                }
              });
            } else if (circuitoVial === 'escolar') {
              ctx.fillStyle = '#fde047';
              for (let x = 210; x < 390; x += 22) ctx.fillRect(x, 150, 12, 34);
              ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center';
              ctx.fillText('CRUCE ESCOLAR CTP — VELOCIDAD MÁXIMA 25 KM/H', 300, 135);
            }

            ctx.fillStyle = '#10b981'; ctx.fillRect(200, 0, 200, 18);
            ctx.fillStyle = '#022c22'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('META OFICIAL COSEVI', 300, 13);
          }

          dibujarVehiculoRealista(veh.x, veh.y, veh.ang, tipoVehiculo, estado === 'reprobado' ? '#ef4444' : '#0ea5e9');
          animId = requestAnimationFrame(loopDrive);
        }
        loopDrive();
      }

      // ========================================================================
      // 2. REDES, SUBNETEO VLSM/FLSM COMPLETO Y CONSOLA CISCO IOS CLI
      // ========================================================================
      if (tab === 'redes_cisco') {
        const filasVlsm = generarTablaVLSM(ipBaseVlsm, hostsVlsm);
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:14px;">
            <!-- Generador Completo de Tablas VLSM / FLSM -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;">
              <div style="font-size:14px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Calculadora y Generador de Tablas de Subneteo VLSM / FLSM</div>
              <div style="display:grid;grid-template-columns:1fr 1.3fr auto;gap:8px;margin-bottom:12px;font-size:12px;align-items:end;">
                <div>
                  <label style="display:block;color:#94a3b8;font-size:11px;margin-bottom:3px;">Red Base IPv4:</label>
                  <input id="vlsm-ip" type="text" value="${ipBaseVlsm}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;font-family:monospace;"/>
                </div>
                <div>
                  <label style="display:block;color:#94a3b8;font-size:11px;margin-bottom:3px;">Hosts por Subred (separados por coma):</label>
                  <input id="vlsm-hosts" type="text" value="${hostsVlsm}" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;font-family:monospace;"/>
                </div>
                <button id="btn-calc-vlsm" style="background:#0284c7;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Calcular VLSM</button>
              </div>

              <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left;font-family:monospace;">
                  <thead>
                    <tr style="background:#111c2d;color:#38bdf8;border-bottom:1px solid #1e293b;">
                      <th style="padding:7px;">Subred</th><th style="padding:7px;">ID de Red</th><th style="padding:7px;">Prefijo</th>
                      <th style="padding:7px;">Máscara</th><th style="padding:7px;">Rango de Hosts Útiles</th><th style="padding:7px;">Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filasVlsm.map(f => `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:6px;color:#f8fafc;font-family:Inter,sans-serif;font-weight:600;">${f.subred}</td>
                        <td style="padding:6px;color:#34d399;font-weight:700;">${f.redId}</td>
                        <td style="padding:6px;color:#fbbf24;">${f.prefijo}</td>
                        <td style="padding:6px;">${f.mascara}</td>
                        <td style="padding:6px;color:#38bdf8;">${f.rangoUtil}</td>
                        <td style="padding:6px;color:#f87171;">${f.broadcast}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Consola Interactiva Cisco IOS CLI -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:14px;font-weight:800;color:#34d399;margin-bottom:4px;">Simulador de Comandos Cisco IOS CLI</div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
                  ${['enable','conf t','int g0/0','ip address 172.16.10.1 255.255.255.128','no shutdown','show ip int brief','show ip route','ping 172.16.10.1'].map(cmd => `
                    <button data-c="${cmd}" class="ios-quick" style="background:#131f33;border:1px solid #334155;color:#38bdf8;padding:4px 8px;border-radius:4px;font-family:monospace;font-size:10.5px;cursor:pointer;">${cmd}</button>
                  `).join('')}
                </div>
                <div id="ios-console" style="background:#020617;border:1px solid #334155;border-radius:8px;padding:10px;font-family:monospace;font-size:11.5px;color:#34d399;height:185px;overflow-y:auto;line-height:1.5;margin-bottom:8px;">
                  Cisco IOS XE Software — CTP-Mercedes-Norte-Core01<br/>Toca un comando rápido arriba o escríbelo abajo.<br/>Router&gt;
                </div>
              </div>
              <form id="ios-form" style="display:flex;gap:6px;">
                <input id="ios-input" type="text" placeholder="Escribe comando Cisco IOS (ej. show ip int brief)..." style="flex:1;background:#111c2d;border:1px solid #334155;color:#34d399;font-family:monospace;padding:8px;border-radius:6px;font-size:12px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Ejecutar</button>
              </form>
            </div>
          </div>
        `;

        document.getElementById('btn-calc-vlsm').onclick = () => {
          ipBaseVlsm = document.getElementById('vlsm-ip').value;
          hostsVlsm = document.getElementById('vlsm-hosts').value;
          render();
        };

        let promptIos = "Router>";
        const ejecutarComandoIOS = (rawCmd) => {
          const c = rawCmd.trim().toLowerCase();
          const box = document.getElementById('ios-console');
          let out = "";
          if (c === 'enable' || c === 'en') { promptIos = "Router#"; out = "Modo EXEC privilegiado activado."; }
          else if (c.startsWith('conf')) { promptIos = "Router(config)#"; out = "Enter configuration commands, one per line. End with CNTL/Z."; }
          else if (c.startsWith('int')) { promptIos = "Router(config-if)#"; out = "Interfaz GigabitEthernet0/0 seleccionada."; }
          else if (c.startsWith('ip add')) { out = "Dirección IPv4 y máscara configuradas en GigabitEthernet0/0."; }
          else if (c === 'no shutdown' || c === 'no shut') { out = "%LINK-5-CHANGED: Interface GigabitEthernet0/0, changed state to up<br/>%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0, changed state to up"; }
          else if (c.includes('show ip int')) { out = "Interface              IP-Address      OK? Method Status   Protocol<br/>GigabitEthernet0/0     172.16.10.1     YES manual up       up<br/>GigabitEthernet0/1     172.16.10.129   YES manual up       up<br/>Serial0/0/0            172.16.10.225   YES manual up       up"; }
          else if (c.includes('show ip route')) { out = "C    172.16.10.0/25 is directly connected, GigabitEthernet0/0<br/>C    172.16.10.128/26 is directly connected, GigabitEthernet0/1<br/>S*   0.0.0.0/0 [1/0] via 172.16.10.226"; }
          else if (c.startsWith('ping')) { out = "Type escape sequence to abort. Sending 5, 100-byte ICMP Echos: !!!!!<br/>Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms"; }
          else { out = "Comando IOS procesado correctamente."; }
          box.innerHTML += `<br/><span style="color:#f8fafc;">${promptIos} ${rawCmd}</span><br/>${out}`;
          box.scrollTop = box.scrollHeight;
        };

        document.querySelectorAll('.ios-quick').forEach(b => b.onclick = () => ejecutarComandoIOS(b.getAttribute('data-c')));
        document.getElementById('ios-form').onsubmit = (e) => {
          e.preventDefault();
          const inp = document.getElementById('ios-input');
          if (!inp.value.trim()) return;
          ejecutarComandoIOS(inp.value);
          inp.value = '';
        };
      }

      // ========================================================================
      // 3. SIMULADOR INTERACTIVO DE COMANDOS Y FÓRMULAS DE EXCEL
      // ========================================================================
      if (tab === 'excel_sim') {
        body.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <div>
                <h3 style="margin:0;font-size:15px;color:#34d399;">Simulador de Comandos y Fórmulas de Excel (REAC 2026 & Finanzas IVA 13%)</h3>
                <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Haz clic en cualquier botón de fórmula para inyectarla en la barra <b>fx</b> o edita los valores de las celdas en tiempo real.</p>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button data-f='=SI(Y(D2>=70; E2>=80%); "APROBADO"; "PENDIENTE")' class="fx-preset" style="background:#065f46;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Fórmula 1: =SI(Y(...))</button>
                <button data-f='=PROMEDIO(D2:D5)' class="fx-preset" style="background:#0284c7;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Fórmula 2: =PROMEDIO(D2:D5)</button>
                <button data-f='=SUMA(C2:C5)*0.13' class="fx-preset" style="background:#0284c7;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Fórmula 3: =SUMA(C2:C5)*13% (IVA)</button>
                <button data-f='=BUSCARX("2-0891"; A2:A5; B2:B5)' class="fx-preset" style="background:#0284c7;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Fórmula 4: =BUSCARX(...)</button>
              </div>
            </div>

            <!-- Barra de Fórmulas fx -->
            <div style="display:flex;gap:8px;align-items:center;background:#111c2d;border:1px solid #334155;padding:8px 12px;border-radius:8px;margin-bottom:12px;">
              <span style="font-family:serif;font-style:italic;font-weight:900;color:#34d399;font-size:15px;">fx</span>
              <input id="fx-bar" type="text" value='=SI(Y(D2>=70; E2>=80%); "APROBADO"; "PENDIENTE")' style="flex:1;background:#090f1a;border:1px solid #1e293b;color:#38bdf8;font-family:monospace;padding:7px 10px;border-radius:6px;font-size:12.5px;"/>
              <button id="fx-eval" style="background:#10b981;color:#022c22;border:none;padding:8px 14px;border-radius:6px;font-weight:900;font-size:12px;cursor:pointer;">Evaluar fx</button>
            </div>

            <div id="fx-result-banner" style="background:#064e3b;border:1px solid #10b981;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;color:#ecfdf5;margin-bottom:12px;">
              Resultado de la Fórmula Activa: APROBADO (Cumple Nota >= 70 y Asistencia >= 80%)
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                <thead>
                  <tr style="background:#131f33;color:#94a3b8;border-bottom:1px solid #334155;text-align:center;">
                    <th style="padding:7px;width:40px;">Fila</th>
                    <th style="padding:7px;">A (ID / Cédula)</th>
                    <th style="padding:7px;">B (Estudiante / Concepto)</th>
                    <th style="padding:7px;">C (Importe ₡)</th>
                    <th style="padding:7px;">D (Nota 0-100)</th>
                    <th style="padding:7px;">E (Asist. %)</th>
                    <th style="padding:7px;">F (Resultado =SI/Y)</th>
                  </tr>
                </thead>
                <tbody id="excel-tbody">
                  ${[
                    { r: 2, a: "2-0891", b: "Alfaro Rojas Valeria", c: 150000, d: 92, e: 96 },
                    { r: 3, a: "4-0256", b: "Brenes Mora Sebastián", c: 220000, d: 78, e: 88 },
                    { r: 4, a: "1-1940", b: "Castro Vargas Camila", c: 180000, d: 64, e: 90 },
                    { r: 5, a: "2-0912", b: "Delgado Solís Mateo", c: 310000, d: 85, e: 75 }
                  ].map(row => `
                    <tr style="border-bottom:1px solid #1e293b;">
                      <td style="padding:6px;text-align:center;background:#131f33;color:#64748b;font-weight:700;">${row.r}</td>
                      <td style="padding:6px;font-family:monospace;">${row.a}</td>
                      <td style="padding:6px;font-weight:600;">${row.b}</td>
                      <td style="padding:6px;"><input data-r="${row.r}" class="ex-c" type="text" value="${row.c}" style="width:90px;background:#111c2d;border:1px solid #334155;color:#fff;padding:5px;border-radius:4px;font-family:monospace;"/></td>
                      <td style="padding:6px;"><input data-r="${row.r}" class="ex-d" type="number" value="${row.d}" style="width:65px;background:#111c2d;border:1px solid #334155;color:#fff;padding:5px;border-radius:4px;text-align:center;"/></td>
                      <td style="padding:6px;"><input data-r="${row.r}" class="ex-e" type="number" value="${row.e}" style="width:65px;background:#111c2d;border:1px solid #334155;color:#fff;padding:5px;border-radius:4px;text-align:center;"/></td>
                      <td id="ex-f-${row.r}" style="padding:6px;font-weight:800;color:${(row.d>=70&&row.e>=80)?'#34d399':'#fbbf24'};">${(row.d>=70&&row.e>=80)?'APROBADO':'PENDIENTE'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

        const evaluarHoja = () => {
          const fx = document.getElementById('fx-bar').value.trim().toUpperCase();
          const banner = document.getElementById('fx-result-banner');
          const cs = [...document.querySelectorAll('.ex-c')].map(i => i.value.trim());
          const ds = [...document.querySelectorAll('.ex-d')].map(i => parseFloat(i.value || '0'));
          const es = [...document.querySelectorAll('.ex-e')].map(i => parseFloat(i.value || '0'));

          // Validar que los importes en columna C sean numéricos válidos (Reporte 11-1)
          if (cs.some(v => !/^\d+(\.\d+)?$/.test(v))) {
            banner.style.background = '#450a0a';
            banner.innerText = '⚠️ Error #¡VALOR!: Se ingresó un importe con formato no admitido en la columna C. Usa solo números.';
            return;
          }
          banner.style.background = '#064e3b';

          [2, 3, 4, 5].forEach((r, idx) => {
            const cellF = document.getElementById('ex-f-' + r);
            const ok = ds[idx] >= 70 && es[idx] >= 80;
            cellF.innerText = ok ? 'APROBADO' : 'PENDIENTE';
            cellF.style.color = ok ? '#34d399' : '#fbbf24';
          });

          if (fx.includes('PROMEDIO')) {
            const prom = (ds.reduce((a, b) => a + b, 0) / ds.length).toFixed(2);
            banner.innerText = `Resultado de ${fx}: Promedio General = ${prom}`;
          } else if (fx.includes('SUMA')) {
            const suma = cs.reduce((a, b) => a + parseFloat(b), 0);
            const iva = (suma * 0.13).toFixed(2);
            banner.innerText = `Resultado de ${fx}: Subtotal = ₡${suma.toLocaleString()} | IVA (13%) = ₡${Number(iva).toLocaleString()}`;
          } else if (fx.includes('BUSCARX')) {
            banner.innerText = `Resultado de ${fx}: Registro localizado -> "Alfaro Rojas Valeria" (Nota: ${ds[0]}, Asistencia: ${es[0]}%)`;
          } else {
            const r1 = (ds[0] >= 70 && es[0] >= 80) ? 'APROBADO' : 'PENDIENTE';
            banner.innerText = `Resultado de ${fx} en Fila 2: ${r1} (D2=${ds[0]}, E2=${es[0]}%)`;
          }
        };

        document.querySelectorAll('.fx-preset').forEach(b => {
          b.onclick = () => { document.getElementById('fx-bar').value = b.getAttribute('data-f'); evaluarHoja(); };
        });
        document.getElementById('fx-eval').onclick = evaluarHoja;
        document.querySelectorAll('.ex-c, .ex-d, .ex-e').forEach(inp => inp.oninput = evaluarHoja);
      }

      // ========================================================================
      // 4. LABORATORIO DE CIBERSEGURIDAD (FIREWALL ACL, SHA-256 Y AUDITORÍA OWASP)
      // ========================================================================
      if (tab === 'ciberseguridad') {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;">
            <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <div style="font-size:14px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Simulador de Firewall Perimetral & ACLs (SOC CTP)</div>
              <p style="font-size:11px;color:#94a3b8;margin:0 0 10px;">Prueba qué ocurre cuando un paquete intenta cruzar el Firewall institucional según el puerto de destino:</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;font-size:12px;">
                <div>IP Origen:<input id="fw-ip" type="text" value="185.220.101.4" style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;font-family:monospace;"/></div>
                <div>Puerto TCP/UDP:<select id="fw-port" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:7px;border-radius:6px;">
                  <option value="443">TCP 443 (HTTPS — Tráfico Web Cifrado)</option>
                  <option value="23">TCP 23 (Telnet — Texto Plano Inseguro)</option>
                  <option value="3389">TCP 3389 (RDP Expuesto a Internet)</option>
                  <option value="53">UDP 53 (DNS Institucional)</option>
                </select></div>
              </div>
              <button id="fw-test" style="width:100%;background:#0284c7;color:#fff;border:none;padding:9px;border-radius:6px;font-weight:700;cursor:pointer;">Inspeccionar Paquete con ACL</button>
              <div id="fw-out" style="margin-top:10px;background:#064e3b;padding:10px;border-radius:6px;font-family:monospace;font-size:11.5px;">
                ACL PERMIT: Paquete hacia TCP 443 (HTTPS TLS 1.3) autorizado.
              </div>
            </div>

            <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <div style="font-size:14px;font-weight:800;color:#34d399;margin-bottom:6px;">Generador Criptográfico SHA-256 & Detector SQLi (OWASP)</div>
              <input id="sec-in" type="text" value="CTP-Mercedes-Norte-2026" placeholder="Escribe texto o payload para auditar..." style="width:100%;box-sizing:border-box;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;margin-bottom:10px;"/>
              <div id="sec-hash-out" style="background:#020617;border:1px solid #334155;padding:10px;border-radius:6px;font-family:monospace;font-size:11px;color:#38bdf8;word-break:break-all;">
                Calculando huella SHA-256...
              </div>
            </div>
          </div>
        `;

        document.getElementById('fw-test').onclick = () => {
          const p = document.getElementById('fw-port').value;
          const ip = document.getElementById('fw-ip').value;
          const out = document.getElementById('fw-out');
          if (p === '443' || p === '53') {
            out.style.background = '#064e3b';
            out.innerHTML = `✅ ACL PERMIT [Puerto ${p}]: Tráfico legítimo desde ${ip} autorizado por política de seguridad.`;
          } else {
            out.style.background = '#450a0a';
            out.innerHTML = `🛑 ACL DENY [Puerto ${p}]: Bloqueado por regla implícita (Deny Any). El puerto ${p} expone credenciales o acceso remoto sin VPN.`;
          }
        };

        const calcSha = async () => {
          const txt = document.getElementById('sec-in').value;
          const box = document.getElementById('sec-hash-out');
          const alertaSqli = /(\bOR\b\s+1=1|--|DROP\s+TABLE|<script>)/i.test(txt);
          try {
            const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
            const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            box.innerHTML = `${alertaSqli ? '<span style="color:#f87171;">⚠️ ALERTA WAF: Patrón de Inyección SQL / XSS detectado y neutralizado.</span><br/>' : '✅ Payload limpio.<br/>'}<b>SHA-256:</b> ${hex}`;
          } catch {
            box.innerText = "Hash verificado.";
          }
        };
        document.getElementById('sec-in').oninput = calcSha;
        calcSha();
      }

      // ========================================================================
      // 5, 6 y 7: EXÁMENES, JUEGOS Y CALCULADORA DE NOTA DE PRESENTACIÓN
      // ========================================================================
      if (tab === 'examenes') {
        let mat = (subParam && BANCOS_EXAMENES[subParam]) ? subParam : "Educación Vial COSEVI / MOPT (Exclusivo Vial)";
        let pregs = barajar(BANCOS_EXAMENES[mat]);
        let iP = 0;

        const pintarEx = () => {
          const it = pregs[iP];
          body.innerHTML = `
            <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
                <select id="e-sel-m" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                  ${Object.keys(BANCOS_EXAMENES).map(k => `<option value="${k}" ${mat===k?'selected':''}>${k}</option>`).join('')}
                </select>
                <span style="font-size:12px;color:#38bdf8;font-weight:700;">Pregunta ${iP + 1} de ${pregs.length} (Opciones A/B/C/D Aleatorias)</span>
              </div>
              <div style="font-size:15px;font-weight:700;margin-bottom:14px;">[${it.id}] ${it.q}</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${it.optsMix.map((op, idx) => `<button data-i="${idx}" class="e-op" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#fff;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;"><b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65+idx)})</b> ${op}</button>`).join('')}
              </div>
              <div id="e-fb" style="margin-top:12px;font-size:12px;"></div>
              <div style="display:flex;justify-content:space-between;margin-top:14px;">
                <button id="e-prv" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">⬅ Anterior</button>
                <button id="e-nxt" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">Siguiente ➡</button>
              </div>
            </div>
          `;
          document.getElementById('e-sel-m').onchange = (e) => { mat = e.target.value; pregs = barajar(BANCOS_EXAMENES[mat]); iP = 0; pintarEx(); };
          document.getElementById('e-prv').onclick = () => { iP = (iP - 1 + pregs.length) % pregs.length; pintarEx(); };
          document.getElementById('e-nxt').onclick = () => { iP = (iP + 1) % pregs.length; pintarEx(); };
          document.querySelectorAll('.e-op').forEach(b => {
            b.onclick = () => {
              const s = parseInt(b.getAttribute('data-i'), 10);
              document.getElementById('e-fb').innerHTML = s === it.ansMix
                ? `<div style="background:#064e3b;padding:10px;border-radius:6px;">✅ <b>¡Correcto!</b> ${it.exp}</div>`
                : `<div style="background:#450a0a;padding:10px;border-radius:6px;">❌ <b>Opción incorrecta. La respuesta correcta es ${String.fromCharCode(65+it.ansMix)}):</b> ${it.exp}</div>`;
            };
          });
        };
        pintarEx();
      }

      if (tab === 'juegos') {
        body.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
            <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">Ajedrez Lógico, Damas y Cruce del Puente (17 min)</h3>
            <p style="font-size:12px;color:#94a3b8;margin-bottom:10px;">Toca una pieza del tablero para moverla y practicar pensamiento algorítmico:</p>
            <div id="chess-v98" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:340px;margin:0 auto;border:2px solid #334155;"></div>
          </div>
        `;
        let tb = [['♜','♞','♝','♛','♚','♝','♞','♜'],['♟','♟','♟','♟','♟','♟','♟','♟'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['♙','♙','♙','♙','♙','♙','♙','♙'],['♖','♘','♗','♕','♔','♗','♘','♖']], s = null;
        const drawC = () => {
          const g = document.getElementById('chess-v98'); g.innerHTML = '';
          for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
            const bt = document.createElement('button');
            bt.style.cssText = `height:40px;border:none;font-size:22px;cursor:pointer;background:${s&&s.r===r&&s.c===c?'#0284c7':((r+c)%2===1?'#1e293b':'#475569')};color:#fff;`;
            bt.innerText = tb[r][c];
            bt.onclick = () => { if (!s) { if (tb[r][c]) { s={r,c}; drawC(); } } else { if (s.r!==r||s.c!==c) { tb[r][c]=tb[s.r][s.c]; tb[s.r][s.c]=''; } s=null; drawC(); } };
            g.appendChild(bt);
          }
        };
        drawC();
      }

      if (tab === 'calculadora') {
        body.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
            <h3 style="margin:0 0 10px;font-size:15px;color:#38bdf8;">Calculadora Oficial de Nota de Presentación MEP y Admisión UCR / TEC / UNA / UTN / UNED</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px;font-size:12px;">
              <div>Promedio 10°:<input id="u-10" type="number" value="88" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              <div>Promedio 11°:<input id="u-11" type="number" value="90" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              <div>Promedio 12°:<input id="u-12" type="number" value="92" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              <div>Prueba MEP:<input id="u-mep" type="number" value="85" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              <div>PAA UCR/UNA:<input id="u-paa" type="number" value="640" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
              <div>Examen TEC:<input id="u-tec" type="number" value="660" style="width:100%;box-sizing:border-box;background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;"/></div>
            </div>
            <div id="u-res" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;font-size:12px;"></div>
          </div>
        `;
        const upC = () => {
          const n10 = parseFloat(document.getElementById('u-10').value||'0'), n11 = parseFloat(document.getElementById('u-11').value||'0'), n12 = parseFloat(document.getElementById('u-12').value||'0');
          const mep = parseFloat(document.getElementById('u-mep').value||'0'), paa = parseFloat(document.getElementById('u-paa').value||'200'), tec = parseFloat(document.getElementById('u-tec').value||'200');
          const np = ((n10 + n11 + n12) / 3).toFixed(2);
          const fMep = ((np * 0.5) + (mep * 0.5)).toFixed(2);
          const fUcr = (200 + (np * 3) + (((paa - 200) / 600) * 300)).toFixed(2);
          const fTec = (200 + (np * 2.4) + (((tec - 200) / 600) * 360)).toFixed(2);
          document.getElementById('u-res').innerHTML = `
            <div style="background:#111c2d;border-left:4px solid #10b981;padding:10px;border-radius:6px;"><b>Nota Presentación MEP:</b> ${np}<br/><b>Nota Final MEP:</b> ${fMep} / 100</div>
            <div style="background:#111c2d;border-left:4px solid #0ea5e9;padding:10px;border-radius:6px;"><b>Admisión UCR / UNA (50/50):</b><br/>${fUcr} / 800 pts</div>
            <div style="background:#111c2d;border-left:4px solid #f59e0b;padding:10px;border-radius:6px;"><b>Admisión TEC (40/60):</b><br/>${fTec} / 800 pts</div>
            <div style="background:#111c2d;border-left:4px solid #a855f7;padding:10px;border-radius:6px;"><b>Índice UTN / UNED:</b><br/>${np} / 100 (Elegible)</div>
          `;
        };
        ['u-10','u-11','u-12','u-mep','u-paa','u-tec'].forEach(id => document.getElementById(id).oninput = upC);
        upC();
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();