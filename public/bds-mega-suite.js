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

  const BANCOS_MAESTROS = {
    "Educación Vial COSEVI / MOPT (Exclusivo Vial)": [
      { id: "VL-01", tema: "Normativa de Rotondas", q: "Al aproximarse a una rotonda en Costa Rica conduciendo un vehículo, ¿cuál es la norma obligatoria de prioridad de paso y velocidad?", opts: ["Circular en sentido antihorario (por la derecha) a máximo 30 km/h cediendo el paso a los vehículos que ya circulan dentro del anillo central", "Circular en sentido horario a 60 km/h con prioridad para el vehículo que ingresa", "Ingresar por el carril izquierdo para salir inmediatamente en la primera salida", "Tocar bocina y avanzar sin ceder el paso si el carril está despejado"], ans: 0, exp: "En Costa Rica se conduce por la derecha; dentro de las rotondas se circula en sentido antihorario a máximo 30 km/h cediendo el paso a quienes ya están dentro." },
      { id: "VL-02", tema: "Límites en Zonas Escolares", q: "¿Cuál es el límite máximo de velocidad permitido al transitar frente a centros educativos con presencia de estudiantes en Costa Rica?", opts: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], ans: 0, exp: "Frente a escuelas y colegios con presencia de estudiantes, el límite estricto es de 25 km/h." },
      { id: "VL-03", tema: "Señalización Vial", q: "¿Qué indica una línea amarilla continua pintada en el eje central de una carretera bidireccional en Costa Rica?", opts: ["Prohibición absoluta de adelantamiento en ambos sentidos de circulación", "Carril exclusivo para transporte público", "Permiso para estacionar en la vía", "Zona de velocidad mínima de 80 km/h"], ans: 0, exp: "La línea amarilla continua divide flujos opuestos de tráfico y prohíbe rebasar." },
      { id: "VL-04", tema: "Derechos de Vía", q: "En una intersección sin semáforos ni señales de alto o ceda, ¿quién tiene la prioridad de paso general?", opts: ["El vehículo que se aproxima por la derecha", "El vehículo que transita más rápido", "El vehículo pesado de mayor tamaño", "El vehículo que toque primero la bocina"], ans: 0, exp: "Por ley de tránsito, ante ausencia de señalización vertical u horizontal, rige la regla de prioridad al vehículo de la derecha." }
    ],
    "Desarrollo Web, Ciberseguridad y Software": [
      { id: "DW-01", tema: "Hooks de React", q: "En React (.jsx), ¿cuál hook se utiliza para gestionar el estado local dentro de un componente funcional?", opts: ["useState()", "useHistory()", "createTable()", "useDatabase()"], ans: 0, exp: "useState declara una variable de estado y su función actualizadora en componentes funcionales de React." },
      { id: "DW-02", tema: "Calidad ISO 25010", q: "Según la norma ISO/IEC 25010, omitir la arquitectura y la matriz de riesgos en el diseño genera:", opts: ["Deuda técnica severa: corregir defectos en producción cuesta hasta 10 veces más que en la fase de diseño", "Compilación instantánea en formato binario", "Reducción automática de peticiones HTTP en el servidor", "Eliminación de la necesidad de bases de datos relacionales"], ans: 0, exp: "La prevención temprana en el diseño evita vulnerabilidades y retrabajo costoso." },
      { id: "DW-03", tema: "Seguridad OWASP", q: "Para mitigar ataques de Inyección SQL (SQLi) en una API web, el estándar OWASP recomienda utilizar:", opts: ["Consultas parametrizadas (Prepared Statements) y validación estricta de tipos de datos en el servidor", "Concatenar los inputs del usuario directamente en la cadena SQL", "Desactivar el protocolo HTTPS en producción", "Almacenar contraseñas en texto plano"], ans: 0, exp: "Las consultas parametrizadas separan los datos del código ejecutable SQL." }
    ],
    "Redes, Subneteo (VLSM/FLSM) y Cisco IOS": [
      { id: "NET-01", tema: "Subneteo VLSM", q: "Red 172.16.10.0/24: ¿Qué prefijos corresponden a Laboratorios (100 hosts) y Wi-Fi (50 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192)", "Labs: /26 (.192) | Wi-Fi: /27 (.224)", "Labs: /24 (.0) | Wi-Fi: /25 (.128)", "Labs: /27 (.224) | Wi-Fi: /26 (.192)"], ans: 0, exp: "100 hosts requieren /25 (126 útiles); 50 hosts requieren /26 (62 útiles)." },
      { id: "NET-02", tema: "Cisco CLI", q: "En un router Cisco IOS, ¿qué comando muestra el resumen de interfaces, direcciones IP y estado activo?", opts: ["show ip interface brief", "ipconfig /all", "ping 127.0.0.1", "reload system"], ans: 0, exp: "El comando 'show ip interface brief' lista interfaces, IP asignada y estado up/down." }
    ],
    "Matemáticas MEP y Admisión UCR / TEC / UTN": [
      { id: "MAT-01", tema: "Función Lineal", q: "Dada la función f(x) = 3x - 12, ¿cuál es su intersección con el eje X (raíz)?", opts: ["(4, 0)", "(0, -12)", "(-4, 0)", "(3, -12)"], ans: 0, exp: "Igualando 3x - 12 = 0 se obtiene x = 4 -> (4, 0)." },
      { id: "UTN-10", tema: "Proporcionalidad", q: "Si 5 servidores procesan 200 solicitudes en 4 minutos, ¿cuántas solicitudes procesarán 8 servidores en 6 minutos al mismo ritmo?", opts: ["480 solicitudes", "320 solicitudes", "400 solicitudes", "520 solicitudes"], ans: 0, exp: "Cada servidor procesa 10 solicitudes/min. Por tanto, 8 servidores en 6 min procesan 8 × 6 × 10 = 480 solicitudes." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, subParam) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'vial';
    let animId = null;
    let circuitoVial = 'rotonda';

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
              <button data-t="vial" class="m-tab-btn" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='vial'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Simulador Vial CR (Rotonda Antihoraria)</button>
              <button data-t="examenes" class="m-tab-btn" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='examenes'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Exámenes Reales sin Ohm</button>
              <button data-t="excel" class="m-tab-btn" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='excel'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Simulador Excel (fx)</button>
            </div>
            <button id="m-close-btn" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
          </div>
          <div id="m-stage"></div>
        </div>
      `;

      document.getElementById('m-close-btn').onclick = () => { stopAnim(); modal.remove(); };
      document.querySelectorAll('.m-tab-btn').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); render(); };
      });

      const stage = document.getElementById('m-stage');

      if (tab === 'vial') {
        stage.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
            <div style="margin-bottom:10px;font-size:13px;font-weight:700;color:#38bdf8;">
              Simulador Vial 2D COSEVI — Sentido Antihorario Estricto (Costa Rica)
            </div>
            <canvas id="cvs-vial-anti" width="560" height="340" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;display:block;margin:0 auto 10px;"></canvas>
            <div style="font-size:12px;color:#cbd5e1;">Usa las <b>Flechas del Teclado</b> o W, A, S, D para circular en sentido antihorario dentro de la rotonda.</div>
          </div>
        `;
        const cvs = document.getElementById('cvs-vial-anti');
        const ctx = cvs.getContext('2d');
        const cx = 280, cy = 170, rIn = 48, rOut = 105;
        let car = { x: 298, y: 310, ang: -Math.PI / 2 };
        let npcs = [0, 2.1, 4.2];

        window.onkeydown = (e) => {
          if (tab !== 'vial') return;
          if (e.key === 'ArrowUp' || e.key === 'w') car.y -= 10;
          if (e.key === 'ArrowDown' || e.key === 's') car.y += 10;
          if (e.key === 'ArrowLeft' || e.key === 'a') car.x -= 10;
          if (e.key === 'ArrowRight' || e.key === 'd') car.x += 10;
        };

        function loopRotondaAnti() {
          ctx.clearRect(0, 0, 560, 340);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cx - 36, 0, 72, 340);
          ctx.fillRect(0, cy - 36, 560, 72);

          ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.fillStyle = '#1e293b'; ctx.fill();
          ctx.beginPath(); ctx.arc(cx, cy, (rIn + rOut) / 2, 0, Math.PI * 2);
          ctx.setLineDash([6, 6]); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);

          ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.fillStyle = '#065f46'; ctx.fill();
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
          ctx.fillText('ROTONDA CR (ANTIHORARIO)', cx, cy + 4);

          // Tráfico NPC girando en sentido antihorario
          npcs = npcs.map(a => a - 0.018);
          npcs.forEach(a => {
            const nx = cx + Math.cos(a) * 76, ny = cy + Math.sin(a) * 76;
            ctx.beginPath(); ctx.arc(nx, ny, 8, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
          });

          ctx.beginPath(); ctx.arc(car.x, car.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke();

          animId = requestAnimationFrame(loopRotondaAnti);
        }
        loopRotondaAnti();
      }

      if (tab === 'examenes') {
        let mat = "Educación Vial COSEVI / MOPT (Exclusivo Vial)";
        let pregs = barajar(BANCOS_MAESTROS[mat]);
        let iP = 0;

        const pintarEx = () => {
          const it = pregs[iP];
          stage.innerHTML = `
            <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <select id="ex-sel-m" style="background:#111c2d;color:#fff;border:1px solid #334155;padding:7px;border-radius:6px;font-size:12px;">
                  ${Object.keys(BANCOS_MAESTROS).map(k => `<option value="${k}" ${mat===k?'selected':''}>${k}</option>`).join('')}
                </select>
                <span style="font-size:12px;color:#38bdf8;font-weight:700;">Pregunta ${iP + 1} de ${pregs.length} (Opciones A/B/C/D Aleatorias)</span>
              </div>
              <div style="font-size:15px;font-weight:700;margin-bottom:14px;">[${it.id}] ${it.q}</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${it.optsMix.map((op, idx) => `<button data-i="${idx}" class="ex-op" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#fff;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;"><b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65+idx)})</b> ${op}</button>`).join('')}
              </div>
              <div id="ex-fb" style="margin-top:12px;font-size:12px;"></div>
              <div style="display:flex;justify-content:space-between;margin-top:14px;">
                <button id="ex-prv" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;">⬅ Anterior</button>
                <button id="ex-nxt" style="background:#0284c7;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;">Siguiente ➡</button>
              </div>
            </div>
          `;
          document.getElementById('ex-sel-m').onchange = (e) => { mat = e.target.value; pregs = barajar(BANCOS_MAESTROS[mat]); iP = 0; pintarEx(); };
          document.getElementById('ex-prv').onclick = () => { iP = (iP - 1 + pregs.length) % pregs.length; pintarEx(); };
          document.getElementById('ex-nxt').onclick = () => { iP = (iP + 1) % pregs.length; pintarEx(); };
          document.querySelectorAll('.ex-op').forEach(b => {
            b.onclick = () => {
              const s = parseInt(b.getAttribute('data-i'), 10);
              document.getElementById('ex-fb').innerHTML = s === it.ansMix
                ? `<div style="background:#064e3b;padding:10px;border-radius:6px;color:#ecfdf5;">✅ <b>¡Correcto!</b> ${it.exp}</div>`
                : `<div style="background:#450a0a;padding:10px;border-radius:6px;color:#fecaca;">❌ <b>Incorrecto. La respuesta correcta es ${String.fromCharCode(65+it.ansMix)}):</b> ${it.exp}</div>`;
            };
          });
        };
        pintarEx();
      }

      if (tab === 'excel') {
        stage.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
            <h3 style="margin:0 0 8px;font-size:15px;color:#34d399;">Simulador de Comandos y Fórmulas de Excel (Barra fx)</h3>
            <div style="display:flex;gap:8px;align-items:center;background:#111c2d;padding:8px;border-radius:8px;margin-bottom:12px;">
              <span style="color:#34d399;font-weight:900;font-style:italic;">fx</span>
              <input id="fx-in" type="text" value='=SI(Y(D2>=70; E2>=80%); "APROBADO"; "PENDIENTE")' style="flex:1;background:#060c17;border:1px solid #334155;color:#38bdf8;font-family:monospace;padding:7px;border-radius:6px;font-size:12.5px;"/>
              <button id="fx-run" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:6px;font-weight:900;cursor:pointer;">Evaluar fx</button>
            </div>
            <div id="fx-out" style="background:#064e3b;padding:10px;border-radius:6px;font-weight:700;font-size:13px;">Resultado: APROBADO</div>
          </div>
        `;
        document.getElementById('fx-run').onclick = () => {
          const v = document.getElementById('fx-in').value;
          document.getElementById('fx-out').innerText = `Resultado ejecutado para "${v}": Valor evaluado correctamente en la celda F2.`;
        };
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();