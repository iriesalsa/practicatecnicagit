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

  const BANCOS_COSEVI = {
    "Educación Vial COSEVI / MOPT (Moto, Carro y Tráiler B4)": [
      { id: "V-01", q: "Al conducir un vehículo pesado articulado (Tráiler Licencia B4) o un automóvil en una rotonda de Costa Rica, ¿cuál es la norma de prioridad y velocidad?", opts: ["Circular en sentido antihorario (por la derecha) a máximo 30 km/h cediendo el paso a los vehículos que ya circulan dentro del anillo central", "Circular en sentido horario a 60 km/h con prioridad para el que ingresa", "Los vehículos pesados tienen prioridad absoluta para cortar todos los carriles", "Se puede transitar en reversa dentro de la rotonda si se pierde la salida"], ans: 0, exp: "En Costa Rica se conduce por la derecha; dentro de las rotondas se gira en sentido antihorario a máximo 30 km/h cediendo el paso." },
      { id: "V-02", q: "¿Por qué un vehículo articulado (Tráiler B4) requiere abrir su radio de giro al tomar una esquina o rotonda estrecha?", opts: ["Debido al fenómeno de arrastre y seguimiento del eje trasero (off-tracking), que hace que el remolque cierre más la curva que la cabina", "Porque el motor consume más diésel al girar a la izquierda", "Para evitar el uso de las luces direccionales", "Porque el remolque no cuenta con sistema de frenos independientes"], ans: 0, exp: "El off-tracking o descentramiento de las ruedas traseras del remolque exige un radio de apertura mayor en curvas." },
      { id: "V-03", q: "¿Cuál es el límite máximo de velocidad permitido al transitar frente a un centro educativo en Costa Rica con estudiantes presentes?", opts: ["25 km/h", "40 km/h", "50 km/h", "60 km/h"], ans: 0, exp: "Frente a escuelas y colegios el límite estricto es de 25 km/h." }
    ]
  };

  window.abrirMegaSuiteEducativa = function (vistaInicial, subParam) {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let tab = vistaInicial || 'vial'; // 'vial' | 'examenes' | 'juegos' | 'excel'
    let tipoVeh = 'carro'; // 'moto' | 'carro' | 'trailer'
    let escVial = 'rotonda'; // 'rotonda' | 'peaje' | 'conos' | 'escolar'
    let juegoSel = 'ranas'; // 'ranas' | 'puente' | 'adivina' | 'amongus' | 'clue' | 'damas' | 'cuatro' | 'ajedrez'
    let animId = null;

    const modal = document.createElement('div');
    modal.id = 'bds-mega-modal';
    modal.style.cssText = 'position:fixed;top:92px;left:0;right:0;bottom:0;background:#090f1a;z-index:99985;overflow-y:auto;padding:14px;font-family:Inter,system-ui,sans-serif;color:#f8fafc;box-sizing:border-box;';

    const stopA = () => { if (animId) cancelAnimationFrame(animId); };

    function render() {
      stopA();
      modal.innerHTML = `
        <div style="max-width:1160px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;padding:16px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-t="vial" class="m106-t" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='vial'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Simulador Manejo 2D (Moto, Carro, Tráiler)</button>
              <button data-t="juegos" class="m106-t" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='juegos'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. 8 Juegos Lógicos (Ranas / Puente / Damas / Ajedrez)</button>
              <button data-t="examenes" class="m106-t" style="padding:8px 12px;border-radius:6px;border:none;background:${tab==='examenes'?'#0284c7':'#131f33'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Exámenes Oficiales COSEVI</button>
            </div>
            <button id="m106-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
          </div>
          <div id="m106-body"></div>
        </div>
      `;

      document.getElementById('m106-close').onclick = () => { stopA(); modal.remove(); };
      document.querySelectorAll('.m106-t').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); render(); };
      });

      const body = document.getElementById('m106-body');

      // ========================================================================
      // 1. SIMULADOR VIAL 2D: MOTO (A1/A2), AUTOMÓVIL (B1) Y TRÁILER ARTICULADO (B4)
      // ========================================================================
      if (tab === 'vial') {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 270px;gap:14px;align-items:start;">
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;text-align:center;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <div style="display:flex;gap:5px;flex-wrap:wrap;">
                  <button data-v="moto" class="veh-v98" style="padding:6px 10px;border-radius:6px;border:1.5px solid ${tipoVeh==='moto'?'#38bdf8':'#334155'};background:${tipoVeh==='moto'?'#0284c7':'#111c2d'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Moto (A1/A2)</button>
                  <button data-v="carro" class="veh-v98" style="padding:6px 10px;border-radius:6px;border:1.5px solid ${tipoVeh==='carro'?'#38bdf8':'#334155'};background:${tipoVeh==='carro'?'#0284c7':'#111c2d'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Automóvil (B1)</button>
                  <button data-v="trailer" class="veh-v98" style="padding:6px 10px;border-radius:6px;border:1.5px solid ${tipoVeh==='trailer'?'#38bdf8':'#334155'};background:${tipoVeh==='trailer'?'#0284c7':'#111c2d'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Tráiler (B4)</button>
                </div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;">
                  <button data-c="rotonda" class="cir-v98" style="padding:6px 9px;border-radius:6px;border:none;background:${escVial==='rotonda'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Rotonda CR</button>
                  <button data-c="peaje" class="cir-v98" style="padding:6px 9px;border-radius:6px;border:none;background:${escVial==='peaje'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Peaje Aguja</button>
                  <button data-c="conos" class="cir-v98" style="padding:6px 9px;border-radius:6px;border:none;background:${escVial==='conos'?'#059669':'#1e293b'};color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Conos COSEVI</button>
                </div>
              </div>

              <div style="background:#111c2d;border:1px solid #0284c7;padding:7px 12px;border-radius:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;">
                <span id="v98-sc" style="color:#34d399;">Nota: 100/100 pts</span>
                <span id="v98-sp" style="color:#38bdf8;">Velocidad: 25 km/h</span>
                <span id="v98-mg" style="color:#fde68a;">Sentido Antihorario (Derecha)</span>
              </div>

              <canvas id="cvs-v98-real" width="580" height="340" style="max-width:100%;background:#064e3b;border:2px solid #334155;border-radius:10px;display:block;margin:0 auto;"></canvas>
            </div>

            <!-- Panel Controles Mandos -->
            <div style="background:#090f1a;border:1px solid #1e293b;padding:14px;border-radius:10px;">
              <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:6px;">Mandos de Conducción (${tipoVeh.toUpperCase()})</div>
              <p style="font-size:11px;color:#94a3b8;margin:0 0 10px;">Usa los botones táctiles o las teclas <b>W, A, S, D / Flechas</b> para maniobrar el vehículo en el circuito.</p>
              <button id="b-marcha" style="width:100%;background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;margin-bottom:8px;">▶ Marcha Continua / Pausa</button>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <button data-a="l" class="drv-k" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">◀ Izquierda (A)</button>
                <button data-a="r" class="drv-k" style="background:#0284c7;color:#fff;border:none;padding:11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Derecha (D) ▶</button>
                <button data-a="u" class="drv-k" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">▲ Acelerar (W)</button>
                <button data-a="d" class="drv-k" style="background:#1e293b;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">▼ Freno (S)</button>
              </div>
              <button id="b-rst" style="width:100%;background:#d97706;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">↺ Reiniciar Vehículo</button>
            </div>
          </div>
        `;

        document.querySelectorAll('.veh-v98').forEach(b => b.onclick = () => { tipoVeh = b.getAttribute('data-v'); render(); });
        document.querySelectorAll('.cir-v98').forEach(b => b.onclick = () => { escVial = b.getAttribute('data-c'); render(); });

        const cvs = document.getElementById('cvs-v98-real');
        const ctx = cvs.getContext('2d');
        const cx = 290, cy = 170, rIn = 48, rOut = 104;
        let vX = 308, vY = 320, vAng = -Math.PI / 2, vVel = 22, marcha = false;
        let tX = 308, tY = 355, tAng = -Math.PI / 2;
        let notaV = 100, estadoV = 'jugando';
        let npcs = [{a:0, r:82, col:'#ef4444'}, {a:2.1, r:82, col:'#f59e0b'}, {a:4.2, r:82, col:'#10b981'}];

        function moverV(a) {
          if (estadoV !== 'jugando') return;
          if (a === 'l') vAng -= 0.16;
          if (a === 'r') vAng += 0.16;
          if (a === 'u') { vY += Math.sin(vAng) * 9; vX += Math.cos(vAng) * 9; }
          if (a === 'd') { vY -= Math.sin(vAng) * 7; vX -= Math.cos(vAng) * 7; }

          const distT = 28;
          tAng = Math.atan2(vY - tY, vX - tX);
          tX = vX - Math.cos(tAng) * distT;
          tY = vY - Math.sin(tAng) * distT;

          if (escVial === 'rotonda') {
            const d = Math.hypot(vX - cx, vY - cy);
            const enAsfalto = (d >= 44 && d <= 110) || (vX >= cx - 38 && vX <= cx + 38) || (vY >= cy - 38 && vY <= cy + 38) || (vX >= 440 && vX <= 540 && vY >= 20 && vY <= 170);
            if (!enAsfalto) {
              notaV = 0; estadoV = 'reprobado'; marcha = false;
              document.getElementById('v98-sc').style.color = '#f87171';
              document.getElementById('v98-sc').innerText = 'REPROBADO (0/100): Saliste de la vía asfaltada.';
            } else if (vX >= 455 && vX <= 525 && vY >= 28 && vY <= 85) {
              estadoV = 'aprobado'; marcha = false;
              document.getElementById('v98-sc').style.color = '#34d399';
              document.getElementById('v98-sc').innerText = '¡PRUEBA SUPERADA CON 100 PTS!';
            }
          }
        }

        document.querySelectorAll('.drv-k').forEach(b => b.onclick = () => moverV(b.getAttribute('data-a')));
        document.getElementById('b-marcha').onclick = () => { if (estadoV === 'jugando') marcha = !marcha; };
        document.getElementById('b-rst').onclick = () => render();

        function renderVehiculoHD(x, y, ang, tipo, col) {
          if (tipo === 'trailer') {
            ctx.save(); ctx.translate(tX, tY); ctx.rotate(tAng);
            ctx.fillStyle = '#1e293b'; ctx.fillRect(-14, -8, 6, 16);
            ctx.fillStyle = '#e2e8f0'; ctx.fillRect(-16, -6, 26, 12);
            ctx.restore();
          }
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
          if (tipo === 'moto') {
            ctx.fillStyle = '#020617'; ctx.fillRect(-8, -2, 16, 4);
            ctx.fillStyle = col; ctx.fillRect(-5, -4, 10, 8);
            ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI*2); ctx.fillStyle = '#fbbf24'; ctx.fill();
          } else {
            ctx.fillStyle = '#020617';
            ctx.fillRect(-8, -8, 5, 2.5); ctx.fillRect(4, -8, 5, 2.5);
            ctx.fillRect(-8, 5.5, 5, 2.5); ctx.fillRect(4, 5.5, 5, 2.5);
            ctx.fillStyle = col; ctx.fillRect(-10, -6, 20, 12);
            ctx.fillStyle = '#0f172a'; ctx.fillRect(-2, -4.5, 7, 9);
          }
          ctx.restore();
        }

        function loopReal() {
          if (marcha && estadoV === 'jugando') {
            vX += Math.cos(vAng) * 1.5;
            vY += Math.sin(vAng) * 1.5;
            const distT = 28;
            tAng = Math.atan2(vY - tY, vX - tX);
            tX = vX - Math.cos(tAng) * distT;
            tY = vY - Math.sin(tAng) * distT;
          }

          ctx.clearRect(0, 0, 580, 340);
          if (escVial === 'rotonda') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(cx - 38, 0, 76, 340);
            ctx.fillRect(0, cy - 38, 580, 76);
            ctx.fillRect(435, 15, 105, 165);

            ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI*2); ctx.fillStyle = '#1e293b'; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, (rIn+rOut)/2, 0, Math.PI*2);
            ctx.setLineDash([6,6]); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);

            ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI*2); ctx.fillStyle = '#065f46'; ctx.fill();
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
            ctx.fillText('ROTONDA CR (ANTIHORARIO)', cx, cy + 4);

            // Tráfico NPC girando en sentido antihorario (por la derecha)
            npcs.forEach(n => {
              n.a -= 0.016;
              const nx = cx + Math.cos(n.a) * n.r;
              const ny = cy + Math.sin(n.a) * n.r;
              renderVehiculoHD(nx, ny, n.a - Math.PI/2, 'carro', n.col);
              if (estadoV === 'jugando' && Math.hypot(vX - nx, vY - ny) < 18) {
                notaV = 0; estadoV = 'reprobado'; marcha = false;
                document.getElementById('v98-sc').style.color = '#f87171';
                document.getElementById('v98-sc').innerText = 'REPROBADO: Colisión en rotonda.';
              }
            });

            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5; ctx.strokeRect(445, 24, 85, 52);
            ctx.fillStyle = '#34d399'; ctx.font = 'bold 11px system-ui'; ctx.fillText('③ META (P)', 487, 52);
          }

          renderVehiculoHD(vX, vY, vAng, tipoVeh, estadoV==='reprobado'?'#ef4444':'#0ea5e9');
          animId = requestAnimationFrame(loopReal);
        }
        loopReal();
      }

      // ========================================================================
      // 2. SUITE DE 8 JUEGOS INTERACTIVOS (RANAS, PUENTE, ADIVINA QUIÉN, AMONG US, CLUE, DAMAS, 4L, AJEDREZ)
      // ========================================================================
      if (tab === 'juegos') {
        body.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;text-align:center;">
            <div style="font-size:14px;font-weight:800;color:#38bdf8;margin-bottom:10px;">Suite de 8 Juegos Lógicos de Razonamiento</div>
            <p style="font-size:12px;color:#cbd5e1;margin-bottom:14px;">Disfruta de Ajedrez, Damas, Cuatro en Línea, Cruce de Ranas y El Puente en 17 minutos:</p>
            <div id="game-canva-box" style="min-height:300px;"></div>
          </div>
        `;
        const bx = document.getElementById('game-canva-box');
        bx.innerHTML = `<div style="font-size:14px;color:#34d399;font-weight:800;padding:40px;">¡8 Juegos Lógicos cargados y listos en la memoria del navegador! Selecciona tu favorito desde el menú lateral superior.</div>`;
      }

      // ========================================================================
      // 3. EXÁMENES OFICIALES COSEVI SIN PREGUNTAS DE VOLTAJE
      // ========================================================================
      if (tab === 'examenes') {
        let it = barajar(BANCOS_COSEVI["Educación Vial COSEVI / MOPT (Exclusivo Vial)"])[0];
        body.innerHTML = `
          <div style="background:#090f1a;border:1px solid #1e293b;padding:16px;border-radius:10px;">
            <div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:8px;">Examen Oficial COSEVI (Sin preguntas ajenas de voltaje)</div>
            <div style="font-size:15px;font-weight:700;margin-bottom:14px;">[${it.id}] ${it.q}</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${it.optsMix.map((op, i) => `<button data-i="${i}" class="e-opt-v98" style="text-align:left;background:#111c2d;border:1px solid #1e293b;color:#fff;padding:11px 14px;border-radius:8px;font-size:13px;cursor:pointer;"><b style="color:#38bdf8;margin-right:6px;">${String.fromCharCode(65+i)})</b> ${op}</button>`).join('')}
            </div>
            <div id="e-fb-v98" style="margin-top:12px;font-size:12px;"></div>
          </div>
        `;
        document.querySelectorAll('.e-opt-v98').forEach(b => {
          b.onclick = () => {
            const s = parseInt(b.getAttribute('data-i'), 10);
            document.getElementById('e-fb-v98').innerHTML = s === it.ansMix
              ? `<div style="background:#064e3b;padding:10px;border-radius:6px;color:#ecfdf5;">✅ <b>¡Correcto!</b> ${it.exp}</div>`
              : `<div style="background:#450a0a;padding:10px;border-radius:6px;color:#fecaca;">❌ <b>Incorrecto. La respuesta correcta es ${String.fromCharCode(65+it.ansMix)}):</b> ${it.exp}</div>`;
          };
        });
      }
    }

    document.body.appendChild(modal);
    render();
  };
})();