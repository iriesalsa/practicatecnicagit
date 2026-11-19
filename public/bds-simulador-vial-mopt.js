(function () {
  const VEHICULOS = {
    moto:   { id: "moto",   nom: "🏍️ Motocicleta (A)",   w: 14, h: 28, maxV: 4.2, acc: 0.14, turn: 0.062, color: "#f97316" },
    carro:  { id: "carro",  nom: "🚗 Automóvil (B1)",    w: 22, h: 42, maxV: 3.8, acc: 0.11, turn: 0.052, color: "#38bdf8" },
    camion: { id: "camion", nom: "🚚 Camión (B2–B4)",    w: 28, h: 66, maxV: 2.9, acc: 0.075, turn: 0.036, color: "#eab308" },
    bus:    { id: "bus",    nom: "🚌 Autobús (C2)",      w: 28, h: 70, maxV: 2.8, acc: 0.072, turn: 0.034, color: "#10b981" },
    especial: { id: "especial", nom: "🚜 Equipo Especial (D1–D3)", w: 30, h: 58, maxV: 2.3, acc: 0.065, turn: 0.038, color: "#f59e0b" }
  };

  const CIRCUITOS = [
    { id: "rotonda2", nom: "🔄 Rotonda 2 Carriles", desc: "Cede el paso al ingresar. Usa carril externo (1ª/2ª salida) o interno (3ª salida/retorno) activando direccional.", meta: "Ingresa respetando prioridad, da la vuelta y llega a la zona verde de salida." },
    { id: "rotonda3", nom: "🌀 Rotonda 3 Carriles", desc: "Rotonda de 3 carriles con tránsito real. Señaliza cada cambio de carril con ⬅️ o ➡️.", meta: "Circula sin invadir carriles ni colisionar y alcanza la salida norte/este." },
    { id: "puente",   nom: "🌉 Puente Angosto (Ceda)", desc: "Puente de un solo carril sobre río. Cede el paso al vehículo que cruza en sentido contrario.", meta: "Espera que el vehículo contrario salga del puente y cruza de forma segura." },
    { id: "peatonal", nom: "🚶 Cruce Peatonal (25 km/h)", desc: "Zona Escolar (límite 25 km/h) con peatones animados cruzando el paso de cebra.", meta: "Detente antes de la línea blanca cuando haya peatones y mantén ≤ 25 km/h." },
    { id: "conos",    nom: "🚧 Obstáculos & Conos COSEVI", desc: "Circuito de precisión: zigzag entre conos, ALTO obligatorio y estacionamiento en caja verde.", meta: "Esquiva todos los conos sin derribarlos y detente dentro de la zona de meta." }
  ];

  window.BDS_RENDER_SIMULADOR_MOPT = function (shell, ganarXP) {
    let sub = "simulador"; // "simulador" | "teorica"
    let vehId = "carro";
    let cirId = "rotonda2";
    let rafId = null;

    // Estado prueba teórica MOPT
    let moptCat = "ALL", moptQty = 20, mItems = [], mIdx = 0, mAns = {}, mDone = false, mSec = 1800, mTimer = null;

    function stopLoop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      if (mTimer) { clearInterval(mTimer); mTimer = null; }
    }

    function iniciarTeorica() {
      if (mTimer) { clearInterval(mTimer); mTimer = null; }
      const banco = (window.BDS_BANCO_MOPT && window.BDS_BANCO_MOPT.length)
        ? window.BDS_BANCO_MOPT
        : (window.BDS_BANCO_CURADO || []).filter(x => x.a === "mopt");
      let pool = banco.filter(x => moptCat === "ALL" || x.moptCat === moptCat || x.moptCat === "COMUN");
      if (!pool.length) pool = banco.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      mItems = pool.slice(0, Math.min(moptQty, pool.length)).map(it => {
        const opts = (it.o || []).map((txt, idx) => ({ txt, ok: idx === (it.c || 0) }));
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        return { ...it, opts };
      });
      mIdx = 0; mAns = {}; mDone = false; mSec = moptQty * 75;
      mTimer = setInterval(() => {
        if (!mDone && sub === "teorica") {
          mSec--;
          const el = document.getElementById("mopt-clk");
          if (el) el.innerText = `${String(Math.floor(mSec / 60)).padStart(2, "0")}:${String(mSec % 60).padStart(2, "0")}`;
          if (mSec <= 0) { mDone = true; clearInterval(mTimer); draw(); }
        }
      }, 1000);
      draw();
    }

    function iniciarSimuladorCanvas() {
      stopLoop();
      const cv = document.getElementById("mopt-cv");
      if (!cv) return;
      const ctx = cv.getContext("2d");
      const W = cv.width, H = cv.height;
      const vSpec = VEHICULOS[vehId];

      // Estado del jugador según circuito
      const player = {
        x: cirId === "puente" ? 75 : (cirId === "peatonal" ? 75 : (cirId === "conos" ? 70 : W / 2 + 24)),
        y: cirId === "puente" ? H / 2 + 22 : (cirId === "peatonal" ? H / 2 + 26 : (cirId === "conos" ? H / 2 : H - 55)),
        ang: (cirId === "puente" || cirId === "peatonal" || cirId === "conos") ? 0 : -Math.PI / 2,
        vel: 0,
        sigL: false,
        sigR: false
      };

      const keys = { up: false, down: false, left: false, right: false };
      let puntos = 100, infracciones = [], lastWarn = 0, completado = false, frame = 0;

      // Entidades IA según circuito
      const aiCars = [];
      const peatones = [];
      const conos = [];
      let metaRect = { x: W / 2 - 40, y: 12, w: 80, h: 42 };

      if (cirId === "rotonda2" || cirId === "rotonda3") {
        const lanes = cirId === "rotonda3" ? [72, 104, 136] : [80, 118];
        lanes.forEach((rad, i) => {
          aiCars.push({ ang: i * 2.1, rad, spd: 0.015 + i * 0.002, col: i % 2 === 0 ? "#ef4444" : "#a855f7", big: i === 0 });
        });
        metaRect = { x: W / 2 - 38, y: 10, w: 76, h: 40 };
      } else if (cirId === "puente") {
        aiCars.push({ x: W - 90, y: H / 2, vx: -1.85, col: "#ef4444", w: 46, h: 24 });
        metaRect = { x: W - 82, y: H / 2 - 36, w: 68, h: 72 };
      } else if (cirId === "peatonal") {
        peatones.push({ x: 310, y: 90, vy: 1.05, r: 9 }, { x: 345, y: 310, vy: -0.95, r: 9 });
        metaRect = { x: W - 82, y: H / 2 - 42, w: 68, h: 84 };
      } else if (cirId === "conos") {
        [180, 260, 340, 420, 500].forEach((cx, i) => {
          conos.push({ x: cx, y: i % 2 === 0 ? H / 2 - 44 : H / 2 + 44, hit: false });
        });
        metaRect = { x: W - 96, y: H / 2 - 40, w: 82, h: 80 };
      }

      function addFalta(msg, pen) {
        const now = Date.now();
        if (now - lastWarn < 1800) return;
        lastWarn = now;
        puntos = Math.max(0, puntos - pen);
        infracciones.unshift(`-${pen} pts: ${msg}`);
        infracciones = infracciones.slice(0, 4);
        if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone("red");
      }

      const onKD = (e) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
        if (e.key === "q" || e.key === "Q") { player.sigL = !player.sigL; if (player.sigL) player.sigR = false; }
        if (e.key === "e" || e.key === "E") { player.sigR = !player.sigR; if (player.sigR) player.sigL = false; }
      };
      const onKU = (e) => {
        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
      };
      window.addEventListener("keydown", onKD);
      window.addEventListener("keyup", onKU);

      // Enlazar controles táctiles (móvil y mouse)
      const bindHold = (id, prop) => {
        const el = document.getElementById(id);
        if (!el) return;
        const on = (e) => { e.preventDefault(); keys[prop] = true; };
        const off = (e) => { e.preventDefault(); keys[prop] = false; };
        el.onpointerdown = on; el.onpointerup = off; el.onpointerleave = off; el.onpointercancel = off;
      };
      bindHold("tc-up", "up"); bindHold("tc-dn", "down"); bindHold("tc-lf", "left"); bindHold("tc-rt", "right");
      if (document.getElementById("tc-sl")) document.getElementById("tc-sl").onclick = () => { player.sigL = !player.sigL; if (player.sigL) player.sigR = false; };
      if (document.getElementById("tc-sr")) document.getElementById("tc-sr").onclick = () => { player.sigR = !player.sigR; if (player.sigR) player.sigL = false; };

      function drawVehicle(x, y, ang, spec, sL, sR) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang + Math.PI / 2);
        ctx.fillStyle = spec.color;
        ctx.fillRect(-spec.w / 2, -spec.h / 2, spec.w, spec.h);
        ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2;
        ctx.strokeRect(-spec.w / 2, -spec.h / 2, spec.w, spec.h);
        // Parabrisas / cabina
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(-spec.w * 0.36, -spec.h * 0.36, spec.w * 0.72, spec.h * 0.22);
        // Luces delanteras
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(-spec.w * 0.4, -spec.h / 2 - 2, 5, 3);
        ctx.fillRect(spec.w * 0.4 - 5, -spec.h / 2 - 2, 5, 3);
        // Direccionales parpadeantes
        if (Math.floor(frame / 15) % 2 === 0) {
          ctx.fillStyle = "#f97316";
          if (sL) { ctx.beginPath(); ctx.arc(-spec.w / 2 - 3, -spec.h / 2 + 4, 4, 0, Math.PI * 2); ctx.fill(); }
          if (sR) { ctx.beginPath(); ctx.arc(spec.w / 2 + 3, -spec.h / 2 + 4, 4, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.restore();
      }

      function step() {
        if (!document.body.contains(cv)) {
          window.removeEventListener("keydown", onKD);
          window.removeEventListener("keyup", onKU);
          stopLoop();
          return;
        }
        frame++;

        // Física del jugador
        if (!completado) {
          if (keys.up) player.vel = Math.min(vSpec.maxV, player.vel + vSpec.acc);
          else if (keys.down) player.vel = Math.max(-vSpec.maxV * 0.45, player.vel - vSpec.acc * 1.2);
          else player.vel *= 0.94;

          if (Math.abs(player.vel) > 0.12) {
            const dir = player.vel >= 0 ? 1 : -1;
            if (keys.left) player.ang -= vSpec.turn * dir;
            if (keys.right) player.ang += vSpec.turn * dir;
          }
          player.x = Math.max(22, Math.min(W - 22, player.x + Math.cos(player.ang) * player.vel));
          player.y = Math.max(22, Math.min(H - 22, player.y + Math.sin(player.ang) * player.vel));
        }

        const kmh = Math.round(Math.abs(player.vel) * 14);

        // Dibujar fondo y escenario
        ctx.fillStyle = "#14532d";
        ctx.fillRect(0, 0, W, H);

        if (cirId === "rotonda2" || cirId === "rotonda3") {
          const cx = W / 2, cy = H / 2;
          const rOut = cirId === "rotonda3" ? 156 : 138;
          const rIn = cirId === "rotonda3" ? 54 : 60;
          // Accesos N, S, E, O
          ctx.fillStyle = "#334155";
          ctx.fillRect(cx - 58, 0, 116, H);
          ctx.fillRect(0, cy - 58, W, 116);
          // Anillo de rotonda
          ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.fillStyle = "#334155"; ctx.fill();
          // Líneas discontinuas de carriles
          ctx.setLineDash([10, 10]); ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 2;
          const rings = cirId === "rotonda3" ? [88, 122] : [99];
          rings.forEach(rr => { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke(); });
          ctx.setLineDash([]);
          // Isla central
          ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.fillStyle = "#16a34a"; ctx.fill();
          ctx.strokeStyle = "#facc15"; ctx.lineWidth = 4; ctx.stroke();
          ctx.fillStyle = "#fff"; ctx.font = "bold 12px Inter,sans-serif"; ctx.textAlign = "center";
          ctx.fillText(cirId === "rotonda3" ? "3 CARRILES" : "2 CARRILES", cx, cy + 4);

          // Colisión con isla central
          const dCent = Math.hypot(player.x - cx, player.y - cy);
          if (dCent < rIn + 14) { addFalta("Subió a la isla central de la rotonda", 15); player.vel *= -0.5; }

          // Mover y dibujar vehículos IA girando en sentido antihorario (Costa Rica)
          aiCars.forEach(ac => {
            ac.ang -= ac.spd;
            const ax = cx + Math.cos(ac.ang) * ac.rad;
            const ay = cy + Math.sin(ac.ang) * ac.rad;
            drawVehicle(ax, ay, ac.ang - Math.PI / 2, { w: ac.big ? 24 : 20, h: ac.big ? 48 : 36, color: ac.col }, false, false);
            if (Math.hypot(player.x - ax, player.y - ay) < 30) {
              addFalta("Irrespetó prioridad en rotonda / Colisión con vehículo", 25);
              player.vel = 0;
            }
          });
        } else if (cirId === "puente") {
          // Río vertical
          ctx.fillStyle = "#0369a1"; ctx.fillRect(W * 0.34, 0, W * 0.32, H);
          // Carretera aproximación
          ctx.fillStyle = "#334155";
          ctx.fillRect(0, H / 2 - 48, W * 0.34, 96);
          ctx.fillRect(W * 0.66, H / 2 - 48, W * 0.34, 96);
          // Puente angosto de 1 solo carril
          ctx.fillStyle = "#475569"; ctx.fillRect(W * 0.34, H / 2 - 26, W * 0.32, 52);
          ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 4; ctx.strokeRect(W * 0.34, H / 2 - 26, W * 0.32, 52);
          // Señal CEDA
          ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(W * 0.28, H / 2 + 54); ctx.lineTo(W * 0.32, H / 2 + 54); ctx.lineTo(W * 0.30, H / 2 + 80); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("CEDA PUENTE", W * 0.30, H / 2 + 94);

          // Carro en sentido contrario cruzando el puente
          const ac = aiCars[0];
          ac.x += ac.vx;
          if (ac.x < -40) ac.x = W + 60;
          drawVehicle(ac.x, ac.y, Math.PI, { w: 22, h: 42, color: ac.col }, false, false);
          if (Math.hypot(player.x - ac.x, player.y - ac.y) < 34) {
            addFalta("No cedió el paso en puente angosto (colisión frontal)", 30);
            player.vel = 0;
          }
          if (player.x > W * 0.34 && player.x < W * 0.66 && (player.y < H / 2 - 22 || player.y > H / 2 + 22)) {
            addFalta("Golpeó la baranda del puente", 15);
            player.y = H / 2;
          }
        } else if (cirId === "peatonal") {
          ctx.fillStyle = "#334155"; ctx.fillRect(0, H / 2 - 58, W, 116);
          // Paso peatonal cebra
          ctx.fillStyle = "#f8fafc";
          for (let py = H / 2 - 50; py < H / 2 + 48; py += 18) ctx.fillRect(295, py, 64, 10);
          // Línea de parada
          ctx.fillRect(268, H / 2, 6, 56);
          // Señal 25 km/h Zona Escolar
          ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(210, H / 2 + 82, 20, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 4; ctx.stroke();
          ctx.fillStyle = "#0f172a"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("25", 210, H / 2 + 87);

          if (kmh > 25) addFalta(`Exceso de velocidad en Zona Escolar (${kmh} km/h > 25 km/h)`, 10);

          peatones.forEach(p => {
            p.y += p.vy;
            if (p.y < 75 || p.y > H - 75) p.vy *= -1;
            ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.stroke();
            if (Math.hypot(player.x - p.x, player.y - p.y) < 30) {
              addFalta("Irrespetó paso peatonal (peligro a peatón)", 35);
              player.vel = 0;
            }
          });
        } else if (cirId === "conos") {
          ctx.fillStyle = "#334155"; ctx.fillRect(20, H / 2 - 84, W - 40, 168);
          ctx.strokeStyle = "#facc15"; ctx.lineWidth = 3; ctx.strokeRect(20, H / 2 - 84, W - 40, 168);
          // Conos naranja
          conos.forEach(c => {
            ctx.fillStyle = c.hit ? "#ef4444" : "#f97316";
            ctx.beginPath(); ctx.arc(c.x, c.y, 11, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(c.x, c.y, 4, 0, Math.PI * 2); ctx.fill();
            if (!c.hit && Math.hypot(player.x - c.x, player.y - c.y) < 26) {
              c.hit = true;
              addFalta("Derribó un cono en prueba de precisión COSEVI", 20);
            }
          });
        }

        // Zona de meta verde
        ctx.fillStyle = "rgba(16,185,129,0.35)";
        ctx.fillRect(metaRect.x, metaRect.y, metaRect.w, metaRect.h);
        ctx.strokeStyle = "#10b981"; ctx.lineWidth = 3;
        ctx.strokeRect(metaRect.x, metaRect.y, metaRect.w, metaRect.h);
        ctx.fillStyle = "#fff"; ctx.font = "bold 11px Inter,sans-serif"; ctx.textAlign = "center";
        ctx.fillText("META", metaRect.x + metaRect.w / 2, metaRect.y + metaRect.h / 2 + 4);

        // Dibujar vehículo del jugador
        drawVehicle(player.x, player.y, player.ang, vSpec, player.sigL, player.sigR);

        // Verificar llegada a meta
        if (!completado && player.x >= metaRect.x && player.x <= metaRect.x + metaRect.w && player.y >= metaRect.y && player.y <= metaRect.y + metaRect.h) {
          completado = true;
          if (puntos >= 70 && ganarXP) ganarXP(30, "🚦 Circuito MOPT Superado");
          if (window.BDS_QR_CAMERA) window.BDS_QR_CAMERA.playTone(puntos >= 70 ? "green" : "red");
        }

        // HUD en canvas
        ctx.fillStyle = "rgba(2,6,23,0.82)";
        ctx.fillRect(8, 8, 220, 48);
        ctx.fillStyle = "#38bdf8"; ctx.font = "bold 12px monospace"; ctx.textAlign = "left";
        ctx.fillText(`VEL: ${kmh} km/h | PTS: ${puntos}/100`, 16, 28);
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(`DIR: ${player.sigL?"⬅️ IZQ":(player.sigR?"➡️ DER":"OFF")} | ${vSpec.id.toUpperCase()}`, 16, 46);

        if (completado) {
          ctx.fillStyle = "rgba(2,6,23,0.86)"; ctx.fillRect(W / 2 - 175, H / 2 - 54, 350, 108);
          ctx.strokeStyle = puntos >= 70 ? "#10b981" : "#ef4444"; ctx.lineWidth = 3;
          ctx.strokeRect(W / 2 - 175, H / 2 - 54, 350, 108);
          ctx.fillStyle = "#fff"; ctx.font = "bold 18px Inter,sans-serif"; ctx.textAlign = "center";
          ctx.fillText(puntos >= 70 ? `✅ ESTACIÓN APROBADA (${puntos}/100)` : `❌ ESTACIÓN REPROBADA (${puntos}/100)`, W / 2, H / 2 - 10);
          ctx.font = "13px Inter,sans-serif"; ctx.fillStyle = "#cbd5e1";
          ctx.fillText("Presiona 🔄 Reiniciar o elige otra estación arriba.", W / 2, H / 2 + 22);
        }

        const logEl = document.getElementById("mopt-log");
        if (logEl) logEl.innerHTML = infracciones.length ? infracciones.map(x => `<div style="color:#fca5a5;">⚠️ ${x}</div>`).join("") : `<div style="color:#6ee7b7;">✅ Conducción limpia sin infracciones (Ley N.° 9078).</div>`;

        rafId = requestAnimationFrame(step);
      }

      rafId = requestAnimationFrame(step);
    }

    function draw() {
      stopLoop();
      const cirMeta = CIRCUITOS.find(c => c.id === cirId) || CIRCUITOS[0];
      const moptCount = (window.BDS_BANCO_MOPT || []).length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">LEY DE TRÁNSITO N.° 9078 • COSEVI / MOPT COSTA RICA</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🚗 Simulador Vial 2D (Rotondas, Puente, Peatones) & Prueba Teórica MOPT</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="ms-sim" style="background:${sub==='simulador'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎮 Simulador Práctico 2D</button>
              <button id="ms-teo" style="background:${sub==='teorica'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📝 Prueba Teórica MOPT (${moptCount} ítems)</button>
            </div>
          </div>

          ${sub === "simulador" ? `
            <div style="margin-bottom:10px;">
              <div style="font-size:11px;font-weight:800;color:#38bdf8;margin-bottom:5px;">1. ELIGE TU VEHÍCULO:</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                ${Object.values(VEHICULOS).map(v => `<button data-vh="${v.id}" class="m-veh" style="background:${vehId===v.id?'#0f766e':'#131f33'};color:#fff;border:1px solid ${vehId===v.id?'#2dd4bf':'#334155'};padding:7px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${v.nom}</button>`).join("")}
              </div>
              <div style="font-size:11px;font-weight:800;color:#fbbf24;margin-bottom:5px;">2. ELIGE LA ESTACIÓN / CIRCUITO:</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${CIRCUITOS.map(c => `<button data-cr="${c.id}" class="m-cir" style="background:${cirId===c.id?'#1d4ed8':'#131f33'};color:#fff;border:1px solid ${cirId===c.id?'#38bdf8':'#334155'};padding:7px 11px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${c.nom}</button>`).join("")}
                <button id="m-rst" style="background:#b45309;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔄 Reiniciar</button>
              </div>
            </div>

            <div style="background:#070d19;border-left:4px solid #38bdf8;padding:9px 12px;border-radius:8px;font-size:12px;margin-bottom:10px;">
              <b>${cirMeta.nom}:</b> ${cirMeta.desc} <span style="color:#34d399;"><b>Meta:</b> ${cirMeta.meta}</span>
            </div>

            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
              <canvas id="mopt-cv" width="660" height="400" style="width:100%;max-width:660px;height:auto;border-radius:12px;border:2px solid #38bdf8;background:#0f172a;touch-action:none;"></canvas>

              <!-- Controles táctiles para celular + guía teclado -->
              <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;width:100%;max-width:660px;">
                <button id="tc-sl" style="background:#b45309;color:#fff;border:none;padding:10px 14px;border-radius:9px;font-weight:800;cursor:pointer;min-height:44px;">⬅️ Dir. Izq (Q)</button>
                <button id="tc-lf" style="background:#1e3a8a;color:#fff;border:none;padding:10px 18px;border-radius:9px;font-weight:900;cursor:pointer;min-height:44px;">↺ Girar Izq</button>
                <button id="tc-up" style="background:#059669;color:#fff;border:none;padding:10px 20px;border-radius:9px;font-weight:900;cursor:pointer;min-height:44px;">▲ Acelerar</button>
                <button id="tc-dn" style="background:#dc2626;color:#fff;border:none;padding:10px 18px;border-radius:9px;font-weight:900;cursor:pointer;min-height:44px;">▼ Freno / Rev</button>
                <button id="tc-rt" style="background:#1e3a8a;color:#fff;border:none;padding:10px 18px;border-radius:9px;font-weight:900;cursor:pointer;min-height:44px;">↻ Girar Der</button>
                <button id="tc-sr" style="background:#b45309;color:#fff;border:none;padding:10px 14px;border-radius:9px;font-weight:800;cursor:pointer;min-height:44px;">Dir. Der (E) ➡️</button>
              </div>

              <div id="mopt-log" style="width:100%;max-width:660px;background:#070d19;border:1px solid #1e293b;border-radius:10px;padding:10px;font-size:12px;"></div>
            </div>
          ` : `
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;background:#070d19;padding:10px;border-radius:10px;">
              <select id="mt-cat" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;font-weight:700;">
                <option value="ALL" ${moptCat==="ALL"?"selected":""}>🌎 Todas las Licencias (A, B, C, D)</option>
                <option value="MOTO" ${moptCat==="MOTO"?"selected":""}>🏍️ Motocicleta (A1–A3)</option>
                <option value="CARRO" ${moptCat==="CARRO"?"selected":""}>🚗 Automóvil (B1)</option>
                <option value="CAMION" ${moptCat==="CAMION"?"selected":""}>🚚 Camión Pesado (B2–B4)</option>
                <option value="BUS" ${moptCat==="BUS"?"selected":""}>🚌 Autobús / Público (C1–C2)</option><option value="ESPECIAL" ${moptCat==="ESPECIAL"?"selected":""}>🚜 Equipo Especial / Tractor (D1–D3)</option>
              </select>
              <select id="mt-qty" style="background:#0b1322;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;font-weight:800;">
                ${[10, 20, 40, 60].map(q => `<option value="${q}" ${moptQty===q?"selected":""}>${q} preguntas${q===40?" (Oficial COSEVI)":""}</option>`).join("")}
              </select>
              <button id="mt-go" style="background:#059669;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔀 Nuevo Examen MOPT</button>
              <span style="margin-left:auto;font-family:monospace;font-size:15px;font-weight:900;color:#fbbf24;">⏱️ <span id="mopt-clk">${String(Math.floor(mSec/60)).padStart(2,"0")}:${String(mSec%60).padStart(2,"0")}</span></span>
            </div>

            ${mDone ? (() => {
              let ok = 0; mItems.forEach((it, i) => { if (mAns[i] !== undefined && it.opts[mAns[i]] && it.opts[mAns[i]].ok) ok++; });
              const pct = Math.round((ok / Math.max(1, mItems.length)) * 100);
              if (pct >= 70 && ganarXP) ganarXP(40, "🪪 Teórica MOPT Aprobada");
              return `<div style="background:#070d19;border:2px solid ${pct>=70?'#10b981':'#ef4444'};border-radius:12px;padding:24px;text-align:center;">
                <h2 style="margin:0 0 8px;">${pct >= 70 ? "✅ ¡PRUEBA TEÓRICA MOPT APROBADA!" : "❌ NO ALCANZÓ EL MÍNIMO (70%)"}</h2>
                <p style="font-size:15px;">Aciertos: <b>${ok}/${mItems.length}</b> • Nota: <b style="color:#38bdf8;">${pct}%</b></p>
                <button id="mt-again" style="background:#1d4ed8;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:800;cursor:pointer;">🔄 Practicar Otro Examen Aleatorio</button>
              </div>`;
            })() : (() => {
              const cur = mItems[mIdx];
              if (!cur) return "";
              const r = mAns[mIdx];
              return `<div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;color:#38bdf8;font-weight:800;">
                  <span>Licencia: ${cur.moptCat || "COMÚN"} • Nivel: ${cur.d}</span>
                  <span>Pregunta ${mIdx + 1} / ${mItems.length}</span>
                </div>
                <h3 style="margin:0 0 12px;font-size:15.5px;line-height:1.45;">${cur.q}</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${cur.opts.map((o, i) => {
                    let bg = "#131f33", bd = "#334155";
                    if (r !== undefined) {
                      if (o.ok) { bg = "#064e3b"; bd = "#10b981"; }
                      else if (r === i) { bg = "#7f1d1d"; bd = "#ef4444"; }
                    }
                    return `<button data-mo="${i}" class="mt-opt" style="text-align:left;background:${bg};border:1.5px solid ${bd};color:#fff;padding:11px 13px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;">${String.fromCharCode(65+i)}) ${o.txt}</button>`;
                  }).join("")}
                </div>
                ${r !== undefined ? `<div style="margin-top:10px;padding:10px;border-radius:8px;background:${cur.opts[r].ok?'#064e3b':'#450a0a'};color:${cur.opts[r].ok?'#6ee7b7':'#fca5a5'};font-size:12.5px;"><b>${cur.opts[r].ok?"✅ Correcto":"❌ Fundamento Legal"}:</b> ${cur.e}</div>` : ""}
                <div style="display:flex;justify-content:space-between;margin-top:14px;">
                  <button id="mt-prev" ${mIdx===0?"disabled":""} style="background:#1e293b;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
                  <button id="mt-next" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:800;cursor:pointer;">${mIdx >= mItems.length - 1 ? "Calificar Examen" : "Siguiente →"}</button>
                </div>
              </div>`;
            })()}
          `}
        </div>
      `;

      document.getElementById("ms-sim").onclick = () => { sub = "simulador"; draw(); };
      document.getElementById("ms-teo").onclick = () => { sub = "teorica"; if (!mItems.length) iniciarTeorica(); else draw(); };

      if (sub === "simulador") {
        shell.querySelectorAll(".m-veh").forEach(b => b.onclick = () => { vehId = b.getAttribute("data-vh"); draw(); });
        shell.querySelectorAll(".m-cir").forEach(b => b.onclick = () => { cirId = b.getAttribute("data-cr"); draw(); });
        document.getElementById("m-rst").onclick = () => draw();
        iniciarSimuladorCanvas();
      } else {
        document.getElementById("mt-cat").onchange = (e) => { moptCat = e.target.value; iniciarTeorica(); };
        document.getElementById("mt-qty").onchange = (e) => { moptQty = Number(e.target.value); iniciarTeorica(); };
        document.getElementById("mt-go").onclick = iniciarTeorica;
        if (document.getElementById("mt-again")) document.getElementById("mt-again").onclick = iniciarTeorica;
        shell.querySelectorAll(".mt-opt").forEach(b => b.onclick = () => {
          if (mAns[mIdx] !== undefined) return;
          mAns[mIdx] = Number(b.getAttribute("data-mo"));
          draw();
        });
        if (document.getElementById("mt-prev")) document.getElementById("mt-prev").onclick = () => { if (mIdx > 0) { mIdx--; draw(); } };
        if (document.getElementById("mt-next")) document.getElementById("mt-next").onclick = () => { if (mIdx < mItems.length - 1) { mIdx++; draw(); } else { mDone = true; draw(); } };
      }
    }

    draw();
  };
})();