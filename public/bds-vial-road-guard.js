(function () {
  const SENALES_MOPT = [
    { id: "ESCUELA_25", titulo: "Zona Escolar (Máx. 25 km/h)", tipo: "preventiva", limite: 25, color: "#f59e0b", ley: "Art. 98 Ley N.° 9078" },
    { id: "ALTO", titulo: "ALTO Obligatorio", tipo: "reglamentaria", limite: 5, color: "#dc2626", ley: "Detención total antes de línea" },
    { id: "LIMITE_40", titulo: "Límite Urbano 40 km/h", tipo: "reglamentaria", limite: 40, color: "#ef4444", ley: "Zona urbana secundaria" },
    { id: "LIMITE_60", titulo: "Carretera 60 km/h", tipo: "reglamentaria", limite: 60, color: "#ef4444", ley: "Vía primaria demarcada" },
    { id: "SEMAFORO", titulo: "Semáforo en Cruce", tipo: "semaforo", limite: 5, color: "#10b981", ley: "Respetar luz roja y amarilla" }
  ];

  // Física estricta de calzada: impide que carro o moto salgan de la calle
  function clampToRoad(x, roadLeft, roadRight, halfWidth) {
    const minX = roadLeft + halfWidth;
    const maxX = roadRight - halfWidth;
    const clamped = Math.max(minX, Math.min(maxX, x));
    return { x: clamped, hitBorder: (x < minX || x > maxX) };
  }

  function evaluarVelocidad(kmh, limiteKmh) {
    const exceso = Number(kmh) > (Number(limiteKmh) + 3);
    return { exceso, margen: Math.round(Number(kmh) - Number(limiteKmh)) };
  }

  function openPistaVialModal(vehiculoInicial) {
    const old = document.getElementById("bds-pista-vial-v209");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "bds-pista-vial-v209";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.94);z-index:299600;display:flex;align-items:center;justify-content:center;padding:10px;overflow-y:auto;";
    modal.innerHTML = `
      <div class="bds-card" style="max-width:560px;width:100%;padding:14px;border:2px solid #38bdf8;text-align:center;margin:auto 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px;">
          <b style="color:#38bdf8;font-size:13.5px;">🚗🏍️ Pista Vial MOPT — Velocidad y Señales CR</b>
          <button id="pv-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;">✕</button>
        </div>

        <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;align-items:center;">
          <button id="pv-car" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚗 Carro (B1)</button>
          <button id="pv-mot" style="background:#131f33;color:#fff;border:1px solid #334155;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🏍️ Moto (A1–A3)</button>
          <select id="pv-vel-preset" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:6px 8px;border-radius:7px;font-size:11.5px;font-weight:700;">
            <option value="0.75">🐢 Ritmo Tranquilo</option>
            <option value="1.0" selected>🚘 Ritmo Normal</option>
            <option value="1.3">⚡ Ritmo Reto</option>
          </select>
        </div>

        <!-- Tablero de Velocímetro, Límite Vigente, Puntos e Infracciones -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;font-size:11px;">
          <div style="background:#070d19;border:1px solid #38bdf8;border-radius:8px;padding:5px;"><div style="color:#94a3b8;font-size:9.5px;">VELOCIDAD</div><b id="pv-kmh" style="color:#38bdf8;font-size:14px;">35 km/h</b></div>
          <div style="background:#070d19;border:1px solid #fbbf24;border-radius:8px;padding:5px;"><div style="color:#94a3b8;font-size:9.5px;">LÍMITE ACTIVO</div><b id="pv-lim" style="color:#fbbf24;font-size:14px;">40 km/h</b></div>
          <div style="background:#070d19;border:1px solid #10b981;border-radius:8px;padding:5px;"><div style="color:#94a3b8;font-size:9.5px;">PUNTOS</div><b id="pv-pts" style="color:#34d399;font-size:14px;">0</b></div>
          <div style="background:#070d19;border:1px solid #ef4444;border-radius:8px;padding:5px;"><div style="color:#94a3b8;font-size:9.5px;">FALTAS</div><b id="pv-inf" style="color:#f87171;font-size:14px;">0</b></div>
        </div>

        <div id="pv-hud" style="font-size:11.5px;color:#34d399;font-weight:700;margin-bottom:7px;min-height:18px;">Respeta las señales de tránsito MOPT y mantente en tu carril.</div>

        <canvas id="pv-cv" width="460" height="330" style="width:100%;max-width:460px;height:auto;border-radius:10px;border:2px solid #334155;background:#14532d;display:block;margin:0 auto;"></canvas>

        <!-- Controles Táctiles: Dirección + Acelerador y Freno -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:7px;margin-top:10px;">
          <button id="pv-l" style="background:#1e3a8a;color:#fff;border:none;padding:12px 6px;border-radius:9px;font-size:14px;font-weight:800;cursor:pointer;">⬅️ Izq.</button>
          <button id="pv-r" style="background:#1e3a8a;color:#fff;border:none;padding:12px 6px;border-radius:9px;font-size:14px;font-weight:800;cursor:pointer;">Der. ➡️</button>
          <button id="pv-up" style="background:#059669;color:#fff;border:none;padding:12px 6px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;">⬆️ Acel.</button>
          <button id="pv-dn" style="background:#dc2626;color:#fff;border:none;padding:12px 6px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;">⬇️ Frenar</button>
        </div>
        <div style="font-size:10.5px;color:#94a3b8;margin-top:6px;">Teclado: Flechas o WASD • <b>Espacio</b> = Freno rápido • Señales: ALTO, Zona Escolar 25, Semáforo y Límites 40/60.</div>
      </div>
    `;
    document.body.appendChild(modal);

    const cv = document.getElementById("pv-cv"), ctx = cv.getContext("2d");
    const ROAD_L = 96, ROAD_R = 352;
    let mode = vehiculoInicial === "moto" ? "moto" : "carro";
    let speedMult = 1.0;
    let vx = 224, kmh = 34, limiteActivo = 40, dashY = 0;
    let pts = 0, faltas = 0, alive = true, warnFrames = 0, warnMsg = "", okFrames = 0, okMsg = "";
    let frameCount = 0;
    const keys = { l: false, r: false, up: false, dn: false, brake: false };

    const obs = [{ x: 162, y: -70 }, { x: 286, y: -250 }];

    // Generador de señales viales en el borde derecho de la calzada
    let senalIdx = 0;
    function crearSenal(yInit) {
      const base = SENALES_MOPT[senalIdx % SENALES_MOPT.length];
      senalIdx++;
      return {
        ...base,
        y: yInit,
        evaluada: false,
        luz: base.id === "SEMAFORO" ? (senalIdx % 2 === 0 ? "ROJO" : "VERDE") : null,
        luzTimer: 0
      };
    }
    let senal = crearSenal(-90);

    const setBtnStyles = () => {
      document.getElementById("pv-car").style.background = mode === "carro" ? "#1d4ed8" : "#131f33";
      document.getElementById("pv-mot").style.background = mode === "moto" ? "#1d4ed8" : "#131f33";
    };
    document.getElementById("pv-car").onclick = () => { mode = "carro"; setBtnStyles(); };
    document.getElementById("pv-mot").onclick = () => { mode = "moto"; setBtnStyles(); };
    document.getElementById("pv-vel-preset").onchange = (e) => { speedMult = Number(e.target.value || 1); };

    const onKD = (e) => {
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.l = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.r = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.dn = true;
      if (e.key === " ") keys.brake = true;
    };
    const onKU = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.l = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.r = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.dn = false;
      if (e.key === " ") keys.brake = false;
    };
    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup", onKU);

    function bindHold(id, prop) {
      const el = document.getElementById(id);
      if (!el) return;
      el.onpointerdown = (e) => { e.preventDefault(); keys[prop] = true; };
      el.onpointerup = el.onpointerleave = el.onpointercancel = () => { keys[prop] = false; };
    }
    bindHold("pv-l", "l"); bindHold("pv-r", "r"); bindHold("pv-up", "up"); bindHold("pv-dn", "dn");

    function triggerWarn(msg, pen) {
      warnMsg = msg; warnFrames = 55;
      if (pen) { faltas++; pts = Math.max(0, pts - pen); }
    }
    function triggerOk(msg, bonus) {
      okMsg = msg; okFrames = 55;
      if (bonus) pts += bonus;
    }

    function drawSenal(s) {
      const sx = ROAD_R + 48, sy = s.y;
      // Línea transversal en calzada para ALTO y SEMÁFORO
      if (s.id === "ALTO" || s.id === "SEMAFORO") {
        ctx.fillStyle = s.id === "ALTO" ? "#ffffff" : (s.luz === "ROJO" ? "#ef4444" : "#fbbf24");
        ctx.fillRect(ROAD_L + 6, sy + 18, (ROAD_R - ROAD_L) - 12, 6);
        if (s.id === "ALTO") {
          ctx.fillStyle = "#ffffff"; ctx.font = "bold 11px Inter,Arial"; ctx.textAlign = "center";
          ctx.fillText("LÍNEA DE PARADA", (ROAD_L + ROAD_R) / 2, sy + 12);
        }
      }
      if (s.id === "ESCUELA_25") {
        ctx.fillStyle = "rgba(245,158,11,0.22)";
        ctx.fillRect(ROAD_L + 6, sy - 10, (ROAD_R - ROAD_L) - 12, 34);
        ctx.fillStyle = "#fde68a"; ctx.font = "bold 11px Inter,Arial"; ctx.textAlign = "center";
        ctx.fillText("ZONA ESCOLAR • 25 KM/H", (ROAD_L + ROAD_R) / 2, sy + 11);
      }

      // Poste metálico
      ctx.fillStyle = "#cbd5e1"; ctx.fillRect(sx - 2, sy, 4, 34);

      if (s.id === "ALTO") {
        // Octágono rojo ALTO
        ctx.fillStyle = "#dc2626"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const ang = (Math.PI / 8) + i * (Math.PI / 4);
          const px = sx + Math.cos(ang) * 20, py = sy - 8 + Math.sin(ang) * 20;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 10px Inter,Arial"; ctx.textAlign = "center";
        ctx.fillText("ALTO", sx, sy - 5);
      } else if (s.id === "ESCUELA_25") {
        // Rombo amarillo Zona Escolar
        ctx.fillStyle = "#f59e0b"; ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 30); ctx.lineTo(sx + 22, sy - 8); ctx.lineTo(sx, sy + 14); ctx.lineTo(sx - 22, sy - 8);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0f172a"; ctx.font = "bold 9.5px Inter,Arial"; ctx.textAlign = "center";
        ctx.fillText("25", sx, sy - 9); ctx.font = "bold 7px Inter,Arial"; ctx.fillText("ESC", sx, sy);
      } else if (s.id === "LIMITE_40" || s.id === "LIMITE_60") {
        // Círculo blanco con borde rojo
        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(sx, sy - 8, 19, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0f172a"; ctx.font = "bold 13px Inter,Arial"; ctx.textAlign = "center";
        ctx.fillText(String(s.limite), sx, sy - 4);
      } else if (s.id === "SEMAFORO") {
        ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
        ctx.fillRect(sx - 12, sy - 36, 24, 52); ctx.strokeRect(sx - 12, sy - 36, 24, 52);
        const lights = [
          { y: sy - 26, on: s.luz === "ROJO", c: "#ef4444" },
          { y: sy - 10, on: s.luz === "AMARILLO", c: "#fbbf24" },
          { y: sy + 6, on: s.luz === "VERDE", c: "#10b981" }
        ];
        lights.forEach(l => {
          ctx.fillStyle = l.on ? l.c : "#334155";
          ctx.beginPath(); ctx.arc(sx, l.y, 6, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.textAlign = "left";
    }

    function closeModal() {
      alive = false;
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup", onKU);
      modal.remove();
    }
    document.getElementById("pv-x").onclick = closeModal;

    function loop() {
      if (!alive || !document.body.contains(modal)) return;
      frameCount++;

      // Aceleración y frenado suaves en km/h
      if (keys.brake) kmh = Math.max(0, kmh - 3.2);
      else if (keys.dn) kmh = Math.max(0, kmh - 1.6);
      else if (keys.up) kmh = Math.min(90, kmh + 1.1);
      else if (kmh > 0 && kmh < 2) kmh = 0;

      const pxSpeed = (kmh / 11.5) * speedMult;
      const halfW = mode === "moto" ? 13 : 20;
      const steer = kmh > 1 ? 4.4 : 1.2;
      const nextX = vx + (keys.r ? steer : 0) - (keys.l ? steer : 0);
      const cl = clampToRoad(nextX, ROAD_L + 5, ROAD_R - 5, halfW);
      vx = cl.x;
      if (cl.hitBorder && kmh > 5) {
        kmh = Math.max(8, kmh - 1.5);
        triggerWarn("⚠️ Borde de calzada — Vehículo contenido dentro de la calle", 0);
      }

      dashY = (dashY + pxSpeed) % 36;
      if (kmh >= 8 && kmh <= limiteActivo + 3 && frameCount % 20 === 0) pts += 1;

      // Ciclo automático de semáforo
      if (senal.id === "SEMAFORO") {
        senal.luzTimer++;
        if (senal.luzTimer % 160 === 0) {
          senal.luz = senal.luz === "ROJO" ? "VERDE" : (senal.luz === "VERDE" ? "AMARILLO" : "ROJO");
        }
      }

      // Movimiento y evaluación de la señal vial
      senal.y += pxSpeed;
      if (!senal.evaluada && senal.y >= 220 && senal.y <= 275) {
        if (senal.id === "ALTO") {
          if (kmh <= 5) { senal.evaluada = true; triggerOk("✅ ¡ALTO respetado correctamente! (+25 pts)", 25); }
        } else if (senal.id === "SEMAFORO") {
          if (senal.luz === "VERDE") { senal.evaluada = true; triggerOk("✅ Cruce seguro con semáforo en verde (+15 pts)", 15); }
          else if (senal.luz === "ROJO" && kmh <= 5) { okMsg = "🛑 Esperando luz verde..."; okFrames = 15; }
        } else if (senal.id === "ESCUELA_25") {
          limiteActivo = 25;
          senal.evaluada = true;
          if (evaluarVelocidad(kmh, 25).exceso) triggerWarn("🚨 Exceso en Zona Escolar (>25 km/h • Art. 98 Ley 9078)", 20);
          else triggerOk("✅ Zona Escolar respetada ≤25 km/h (+20 pts)", 20);
        } else if (senal.id === "LIMITE_40" || senal.id === "LIMITE_60") {
          limiteActivo = senal.limite;
          senal.evaluada = true;
          triggerOk(`ℹ️ Nuevo límite vial vigente: ${limiteActivo} km/h`, 5);
        }
      }
      if (!senal.evaluada && senal.y > 278) {
        senal.evaluada = true;
        if (senal.id === "ALTO") triggerWarn("🚨 Irrespeto de señal ALTO sin detenerse (-25 pts)", 25);
        else if (senal.id === "SEMAFORO" && senal.luz === "ROJO") triggerWarn("🚨 Irrespeto de semáforo en ROJO (-30 pts)", 30);
      }
      if (senal.y > cv.height + 55) senal = crearSenal(-90);

      // Chequeo continuo de exceso de velocidad en zona activa
      if (frameCount % 90 === 0 && evaluarVelocidad(kmh, limiteActivo).exceso) {
        triggerWarn(`🚨 Exceso de velocidad (${Math.round(kmh)} km/h en zona de ${limiteActivo} km/h)`, 10);
      }

      // Render escenario: zonas verdes, aceras, calzada y señalización horizontal
      ctx.fillStyle = "#166534"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#cbd5e1"; ctx.fillRect(ROAD_L - 10, 0, 10, cv.height); ctx.fillRect(ROAD_R, 0, 10, cv.height);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, cv.height);
      ctx.fillStyle = "#f59e0b"; ctx.fillRect(ROAD_L + 2, 0, 3, cv.height); ctx.fillRect(ROAD_R - 5, 0, 3, cv.height);
      ctx.fillStyle = "#f8fafc";
      for (let y = -36; y < cv.height; y += 36) ctx.fillRect((ROAD_L + ROAD_R) / 2 - 2, y + dashY, 4, 20);

      // Dibujar señal activa
      drawSenal(senal);

      // Otros vehículos circulando en carriles
      obs.forEach(o => {
        const relSp = Math.max(0.6, pxSpeed * 0.72);
        o.y += kmh < 2 ? 0.5 : relSp;
        if (o.y > cv.height + 40) {
          o.y = -60;
          o.x = [148, 224, 300][Math.floor(Math.random() * 3)];
        }
        ctx.fillStyle = "#ef4444"; ctx.fillRect(o.x - 16, o.y - 24, 32, 48);
        ctx.fillStyle = "#fef08a"; ctx.fillRect(o.x - 11, o.y + 16, 8, 5); ctx.fillRect(o.x + 3, o.y + 16, 8, 5);
        if (Math.abs(o.x - vx) < (halfW + 14) && Math.abs(o.y - 256) < 42) {
          o.y = -80;
          kmh = Math.max(10, kmh - 20);
          triggerWarn("💥 Colisión por distancia insegura (-20 pts)", 20);
        }
      });

      // Vehículo del usuario (100% dentro de calzada)
      if (mode === "carro") {
        ctx.fillStyle = warnFrames > 0 ? "#f59e0b" : "#38bdf8";
        ctx.fillRect(vx - 18, 232, 36, 52);
        ctx.fillStyle = "#0f172a"; ctx.fillRect(vx - 13, 244, 26, 14);
        if (keys.dn || keys.brake) { ctx.fillStyle = "#ef4444"; ctx.fillRect(vx - 15, 281, 10, 4); ctx.fillRect(vx + 5, 281, 10, 4); }
      } else {
        ctx.fillStyle = warnFrames > 0 ? "#f59e0b" : "#10b981";
        ctx.fillRect(vx - 8, 236, 16, 44);
        ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.arc(vx, 256, 7, 0, Math.PI * 2); ctx.fill();
        if (keys.dn || keys.brake) { ctx.fillStyle = "#ef4444"; ctx.fillRect(vx - 5, 278, 10, 4); }
      }

      // Actualizar tablero HUD
      const kEl = document.getElementById("pv-kmh"), lEl = document.getElementById("pv-lim"), pEl = document.getElementById("pv-pts"), iEl = document.getElementById("pv-inf"), hud = document.getElementById("pv-hud");
      if (kEl) { kEl.innerText = `${Math.round(kmh)} km/h`; kEl.style.color = evaluarVelocidad(kmh, limiteActivo).exceso ? "#f87171" : "#38bdf8"; }
      if (lEl) lEl.innerText = `${limiteActivo} km/h`;
      if (pEl) pEl.innerText = String(Math.floor(pts));
      if (iEl) iEl.innerText = String(faltas);

      if (hud) {
        if (warnFrames > 0) { warnFrames--; hud.style.color = "#fbbf24"; hud.innerText = warnMsg; }
        else if (okFrames > 0) { okFrames--; hud.style.color = "#34d399"; hud.innerText = okMsg; }
        else { hud.style.color = "#93c5fd"; hud.innerText = `🚦 Próxima señal: ${senal.titulo} (${senal.ley})`; }
      }

      requestAnimationFrame(loop);
    }
    setBtnStyles();
    requestAnimationFrame(loop);
  }

  function attachPistaBtn() {
    if (typeof document === "undefined") return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-open-pista-v209")) return;
    const h2 = shell.querySelector("h2");
    if (h2 && /mopt|vial|licencia/i.test(h2.innerText)) {
      const bt = document.createElement("button");
      bt.id = "bds-open-pista-v209";
      bt.style.cssText = "background:#0284c7;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;margin:6px 0 10px;";
      bt.innerText = "🚗🏍️ Abrir Pista Vial (Velocímetro + Señales MOPT)";
      bt.onclick = () => openPistaVialModal("carro");
      h2.parentElement.appendChild(bt);
    }
  }

  window.BDS_VIAL_GUARD = { SENALES_MOPT, clampToRoad, evaluarVelocidad, openPistaVialModal };
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => attachPistaBtn()).observe(document.body, { childList: true, subtree: true });
      }
      setTimeout(attachPistaBtn, 500);
    });
  }
})();