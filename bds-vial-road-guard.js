(function () {
  // Física estricta de calzada: impide que el carro o la moto salgan de la calle
  function clampToRoad(x, roadLeft, roadRight, halfWidth) {
    const minX = roadLeft + halfWidth;
    const maxX = roadRight - halfWidth;
    const clamped = Math.max(minX, Math.min(maxX, x));
    return { x: clamped, hitBorder: (x < minX || x > maxX) };
  }

  function openPistaVialModal(vehiculoInicial) {
    const old = document.getElementById("bds-pista-vial-v209");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "bds-pista-vial-v209";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.94);z-index:299600;display:flex;align-items:center;justify-content:center;padding:12px;";
    modal.innerHTML = `
      <div class="bds-card" style="max-width:520px;width:100%;padding:14px;border:2px solid #38bdf8;text-align:center;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px;">
          <b style="color:#38bdf8;font-size:13.5px;">🚗🏍️ Pista Vial MOPT (Con Límites Reales de Calzada)</b>
          <button id="pv-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;">✕</button>
        </div>
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:8px;">
          <button id="pv-car" style="background:#1d4ed8;color:#fff;border:none;padding:6px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚗 Carro (B1)</button>
          <button id="pv-mot" style="background:#131f33;color:#fff;border:1px solid #334155;padding:6px 12px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🏍️ Moto (A1–A3)</button>
        </div>
        <div id="pv-hud" style="font-size:12px;color:#34d399;font-weight:700;margin-bottom:6px;">Mantén el vehículo dentro de la calzada y respeta los carriles.</div>
        <canvas id="pv-cv" width="440" height="320" style="width:100%;max-width:440px;height:auto;border-radius:10px;border:2px solid #334155;background:#14532d;display:block;margin:0 auto;"></canvas>
        <div style="display:flex;justify-content:center;gap:14px;margin-top:10px;">
          <button id="pv-l" style="background:#1e3a8a;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:16px;font-weight:900;cursor:pointer;">⬅️ Izq.</button>
          <button id="pv-r" style="background:#1e3a8a;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:16px;font-weight:900;cursor:pointer;">Der. ➡️</button>
        </div>
        <div style="font-size:10.5px;color:#94a3b8;margin-top:6px;">Controles: flechas ⬅️ ➡️ o botones táctiles • Barreras físicas activas en ambos bordes de la calle.</div>
      </div>
    `;
    document.body.appendChild(modal);

    const cv = document.getElementById("pv-cv"), ctx = cv.getContext("2d");
    const ROAD_L = 95, ROAD_R = 345, HALF_CAR = 20;
    let mode = vehiculoInicial === "moto" ? "moto" : "carro";
    let vx = 220, speed = 3.2, dashY = 0, pts = 0, alive = true, warnFrames = 0;
    const keys = { l: false, r: false };
    const obs = [{ x: 160, y: -60 }, { x: 280, y: -220 }];

    const setBtnStyles = () => {
      document.getElementById("pv-car").style.background = mode === "carro" ? "#1d4ed8" : "#131f33";
      document.getElementById("pv-mot").style.background = mode === "moto" ? "#1d4ed8" : "#131f33";
    };
    document.getElementById("pv-car").onclick = () => { mode = "carro"; setBtnStyles(); };
    document.getElementById("pv-mot").onclick = () => { mode = "moto"; setBtnStyles(); };

    const onKD = (e) => { if (e.key === "ArrowLeft" || e.key === "a") keys.l = true; if (e.key === "ArrowRight" || e.key === "d") keys.r = true; };
    const onKU = (e) => { if (e.key === "ArrowLeft" || e.key === "a") keys.l = false; if (e.key === "ArrowRight" || e.key === "d") keys.r = false; };
    window.addEventListener("keydown", onKD);
    window.addEventListener("keyup", onKU);

    const bL = document.getElementById("pv-l"), bR = document.getElementById("pv-r");
    bL.onpointerdown = () => { keys.l = true; }; bL.onpointerup = bL.onpointerleave = () => { keys.l = false; };
    bR.onpointerdown = () => { keys.r = true; }; bR.onpointerup = bR.onpointerleave = () => { keys.r = false; };

    function closeModal() {
      alive = false;
      window.removeEventListener("keydown", onKD);
      window.removeEventListener("keyup", onKU);
      modal.remove();
    }
    document.getElementById("pv-x").onclick = closeModal;

    function loop() {
      if (!alive || !document.body.contains(modal)) return;
      const halfW = mode === "moto" ? 13 : HALF_CAR;
      let nextX = vx + (keys.r ? 4.5 : 0) - (keys.l ? 4.5 : 0);
      const cl = clampToRoad(nextX, ROAD_L + 4, ROAD_R - 4, halfW);
      vx = cl.x;
      if (cl.hitBorder) {
        warnFrames = 24;
        speed = Math.max(1.8, speed - 0.15);
      } else {
        speed = Math.min(4.2, speed + 0.03);
      }

      dashY = (dashY + speed) % 36;
      pts += 0.2;

      // Dibujar aceras, cordones de caño y calzada estricta
      ctx.fillStyle = "#166534"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#cbd5e1"; ctx.fillRect(ROAD_L - 10, 0, 10, cv.height); ctx.fillRect(ROAD_R, 0, 10, cv.height);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(ROAD_L, 0, ROAD_R - ROAD_L, cv.height);
      // Líneas amarillas de borde (prohibido cruzar)
      ctx.fillStyle = "#f59e0b"; ctx.fillRect(ROAD_L + 2, 0, 3, cv.height); ctx.fillRect(ROAD_R - 5, 0, 3, cv.height);
      // Línea central discontinua
      ctx.fillStyle = "#f8fafc";
      for (let y = -36; y < cv.height; y += 36) ctx.fillRect(218, y + dashY, 4, 20);

      // Obstáculos viales dentro de los carriles
      obs.forEach(o => {
        o.y += speed;
        if (o.y > cv.height + 30) {
          o.y = -40;
          o.x = [140, 220, 300][Math.floor(Math.random() * 3)];
        }
        ctx.fillStyle = "#ef4444"; ctx.fillRect(o.x - 16, o.y - 24, 32, 48);
        ctx.fillStyle = "#fef08a"; ctx.fillRect(o.x - 11, o.y + 16, 8, 5); ctx.fillRect(o.x + 3, o.y + 16, 8, 5);
        if (Math.abs(o.x - vx) < (halfW + 14) && Math.abs(o.y - 255) < 42) {
          warnFrames = 30;
          o.y = -60;
          pts = Math.max(0, pts - 15);
        }
      });

      // Dibujar Carro o Moto (siempre dentro de ROAD_L..ROAD_R)
      if (mode === "carro") {
        ctx.fillStyle = warnFrames > 0 ? "#f59e0b" : "#38bdf8";
        ctx.fillRect(vx - 18, 232, 36, 52);
        ctx.fillStyle = "#0f172a"; ctx.fillRect(vx - 13, 244, 26, 14);
      } else {
        ctx.fillStyle = warnFrames > 0 ? "#f59e0b" : "#10b981";
        ctx.fillRect(vx - 8, 236, 16, 44);
        ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.arc(vx, 256, 7, 0, Math.PI * 2); ctx.fill();
      }

      const hud = document.getElementById("pv-hud");
      if (warnFrames > 0) {
        warnFrames--;
        if (hud) { hud.style.color = "#fbbf24"; hud.innerText = "⚠️ Borde de calzada / Precaución — Vehículo contenido en la calle"; }
      } else if (hud) {
        hud.style.color = "#34d399";
        hud.innerText = `✅ Conducción segura (${mode.toUpperCase()}) • Puntos: ${Math.floor(pts)} • Dentro de la calzada`;
      }
      requestAnimationFrame(loop);
    }
    setBtnStyles();
    requestAnimationFrame(loop);
  }

  // Inyectar botón directo en MOPT para abrir la pista con límites reales de calzada
  function attachPistaBtn() {
    if (typeof document === "undefined") return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-open-pista-v209")) return;
    const h2 = shell.querySelector("h2");
    if (h2 && /mopt|vial|licencia/i.test(h2.innerText)) {
      const bt = document.createElement("button");
      bt.id = "bds-open-pista-v209";
      bt.style.cssText = "background:#0284c7;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;margin:6px 0 10px;";
      bt.innerText = "🚗🏍️ Pista Práctica Carro/Moto (Con Límites Reales de Calle)";
      bt.onclick = () => openPistaVialModal("carro");
      h2.parentElement.appendChild(bt);
    }
  }

  window.BDS_VIAL_GUARD = { clampToRoad, openPistaVialModal };
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => attachPistaBtn()).observe(document.body, { childList: true, subtree: true });
      }
      setTimeout(attachPistaBtn, 500);
    });
  }
})();