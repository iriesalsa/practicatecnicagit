(function () {
  let jsQrPromise = null;

  function loadJsQR() {
    if (window.jsQR) return Promise.resolve(window.jsQR);
    if (jsQrPromise) return jsQrPromise;
    jsQrPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      s.async = true;
      s.onload = () => resolve(window.jsQR || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    return jsQrPromise;
  }

  function playTone(type) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const beep = (freq, start, dur, wave) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = wave || "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + start);
        g.gain.setValueAtTime(0.18, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + start);
        o.stop(ctx.currentTime + start + dur);
      };
      if (type === "green") { beep(980, 0, 0.14, "sine"); beep(1320, 0.13, 0.18, "sine"); }
      else if (type === "blue") { beep(780, 0, 0.12, "triangle"); beep(1040, 0.13, 0.16, "triangle"); }
      else if (type === "yellow") { beep(520, 0, 0.16, "triangle"); beep(520, 0.2, 0.16, "triangle"); }
      else if (type === "red") { beep(240, 0, 0.28, "sawtooth"); beep(180, 0.28, 0.28, "sawtooth"); }
      else { beep(880, 0, 0.1, "sine"); }
      setTimeout(() => ctx.close().catch(() => {}), 800);
    } catch {}
  }

  function mount(container, opts) {
    const cfg = Object.assign({
      onScan: () => {},
      placeholder: "Escanear con lector USB o escribir correo / código QR y presionar Enter...",
      autoStart: false,
      cooldownMs: 3000
    }, opts || {});

    const uid = "qrc_" + Math.random().toString(36).slice(2, 8);
    let stream = null, timer = null, devices = [], devIdx = 0, torchOn = false;
    let lastCode = "", lastTs = 0, detector = null, active = false;

    container.innerHTML = `
      <div style="background:#070d19;border:1px solid #1e3a8a;border-radius:12px;padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
          <span id="${uid}-st" style="font-size:11.5px;font-weight:800;color:#38bdf8;">📷 Escáner QR Nativo listo (Cámara + Lector USB)</span>
          <div style="display:flex;gap:5px;flex-wrap:wrap;">
            <button type="button" id="${uid}-start" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">▶ Activar Cámara</button>
            <button type="button" id="${uid}-stop" style="display:none;background:#dc2626;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">⏹ Detener</button>
            <button type="button" id="${uid}-flip" style="display:none;background:#1d4ed8;color:#fff;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🔄 Cambiar</button>
            <button type="button" id="${uid}-torch" style="display:none;background:#b45309;color:#fff;border:none;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🔦 Luz</button>
          </div>
        </div>

        <div id="${uid}-vp" style="display:none;position:relative;width:100%;max-width:440px;margin:0 auto 10px;border-radius:12px;overflow:hidden;background:#000;border:2px solid #38bdf8;aspect-ratio:4/3;">
          <video id="${uid}-vid" playsinline muted autoplay style="width:100%;height:100%;object-fit:cover;display:block;"></video>
          <div style="position:absolute;inset:16%;border:3px solid #10b981;border-radius:14px;box-shadow:0 0 0 9999px rgba(2,6,23,0.42);pointer-events:none;"></div>
          <div id="${uid}-eng" style="position:absolute;bottom:6px;left:8px;background:rgba(2,6,23,0.78);color:#6ee7b7;font-size:10px;font-weight:700;padding:3px 7px;border-radius:6px;">Motor híbrido</div>
        </div>
        <canvas id="${uid}-cv" style="display:none;"></canvas>

        <form id="${uid}-f" style="display:flex;gap:6px;flex-wrap:wrap;">
          <input id="${uid}-in" type="text" autocomplete="off" placeholder="${cfg.placeholder}" style="flex:1;min-width:210px;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px 12px;border-radius:8px;font-size:12.5px;"/>
          <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔍 Consultar / Leer</button>
        </form>
      </div>
    `;

    const stEl = document.getElementById(`${uid}-st`);
    const vpEl = document.getElementById(`${uid}-vp`);
    const vidEl = document.getElementById(`${uid}-vid`);
    const cvEl = document.getElementById(`${uid}-cv`);
    const engEl = document.getElementById(`${uid}-eng`);
    const btnStart = document.getElementById(`${uid}-start`);
    const btnStop = document.getElementById(`${uid}-stop`);
    const btnFlip = document.getElementById(`${uid}-flip`);
    const btnTorch = document.getElementById(`${uid}-torch`);
    const inEl = document.getElementById(`${uid}-in`);

    function emitScan(raw, source) {
      const code = String(raw || "").trim();
      if (!code) return;
      const now = Date.now();
      if (source === "camera" && code === lastCode && (now - lastTs) < cfg.cooldownMs) return;
      lastCode = code;
      lastTs = now;
      stEl.innerText = `✅ Lectura registrada (${source === "camera" ? "Cámara" : "Manual/USB"}) • Antirrebote 3s`;
      cfg.onScan(code, source);
    }

    function stop() {
      active = false;
      if (timer) { clearInterval(timer); timer = null; }
      if (stream) {
        stream.getTracks().forEach(t => { try { t.stop(); } catch {} });
        stream = null;
      }
      if (vidEl) vidEl.srcObject = null;
      if (vpEl) vpEl.style.display = "none";
      if (btnStart) btnStart.style.display = "inline-block";
      if (btnStop) btnStop.style.display = "none";
      if (btnFlip) btnFlip.style.display = "none";
      if (btnTorch) btnTorch.style.display = "none";
      torchOn = false;
    }

    async function start(deviceId) {
      stop();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        stEl.innerText = "⚠️ Navegador sin acceso a cámara (use HTTPS o lector USB/manual).";
        return;
      }
      stEl.innerText = "⏳ Iniciando cámara trasera...";
      try {
        const videoConstraints = deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } };
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        vidEl.srcObject = stream;
        await vidEl.play();
        active = true;
        vpEl.style.display = "block";
        btnStart.style.display = "none";
        btnStop.style.display = "inline-block";

        try {
          const allDevs = await navigator.mediaDevices.enumerateDevices();
          devices = allDevs.filter(d => d.kind === "videoinput");
          if (devices.length > 1) btnFlip.style.display = "inline-block";
        } catch {}

        const track = stream.getVideoTracks()[0];
        if (track && track.getCapabilities && track.getCapabilities().torch) {
          btnTorch.style.display = "inline-block";
        }

        // Configurar motor híbrido: BarcodeDetector nativo o respaldo jsQR
        detector = null;
        if ("BarcodeDetector" in window) {
          try {
            const fmts = await window.BarcodeDetector.getSupportedFormats();
            if (fmts.includes("qr_code")) detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          } catch {}
        }
        let jsQR = null;
        if (!detector) {
          engEl.innerText = "Cargando decodificador universal (iOS/Firefox)...";
          jsQR = await loadJsQR();
          engEl.innerText = jsQR ? "Motor: jsQR Universal (150ms)" : "Modo manual/USB (sin red para jsQR)";
        } else {
          engEl.innerText = "Motor: BarcodeDetector Nativo HD";
        }

        stEl.innerText = "🟢 Cámara activa — Apunte al Carné QR (lectura rápida <1s)";
        const ctx = cvEl.getContext("2d", { willReadFrequently: true });

        timer = setInterval(async () => {
          if (!active) return;
          if (!document.body.contains(vidEl)) { stop(); return; }
          if (vidEl.readyState < 2 || !vidEl.videoWidth) return;

          if (detector) {
            try {
              const hits = await detector.detect(vidEl);
              if (hits && hits.length && hits[0].rawValue) emitScan(hits[0].rawValue, "camera");
            } catch {}
          } else if (jsQR) {
            try {
              const w = Math.min(480, vidEl.videoWidth);
              const h = Math.round((vidEl.videoHeight / vidEl.videoWidth) * w);
              cvEl.width = w; cvEl.height = h;
              ctx.drawImage(vidEl, 0, 0, w, h);
              const imgData = ctx.getImageData(0, 0, w, h);
              const res = jsQR(imgData.data, w, h, { inversionAttempts: "dontInvert" });
              if (res && res.data) emitScan(res.data, "camera");
            } catch {}
          }
        }, 150);
      } catch (err) {
        stEl.innerText = "⚠️ Permiso de cámara denegado o cámara ocupada. Habilite permisos en el navegador o use lector USB.";
        stop();
      }
    }

    btnStart.onclick = () => start();
    btnStop.onclick = stop;
    btnFlip.onclick = () => {
      if (devices.length < 2) return;
      devIdx = (devIdx + 1) % devices.length;
      start(devices[devIdx].deviceId);
    };
    btnTorch.onclick = async () => {
      try {
        const track = stream && stream.getVideoTracks()[0];
        if (!track) return;
        torchOn = !torchOn;
        await track.applyConstraints({ advanced: [{ torch: torchOn }] });
        btnTorch.innerText = torchOn ? "🔦 Apagar" : "🔦 Luz";
      } catch {}
    };
    document.getElementById(`${uid}-f`).onsubmit = (e) => {
      e.preventDefault();
      emitScan(inEl.value, "manual");
      inEl.value = "";
      inEl.focus();
    };

    if (cfg.autoStart) start();
    return { start, stop, focusInput: () => inEl.focus() };
  }

  function openModal(opts) {
    const cfg = opts || {};
    const old = document.getElementById("bds-qrcam-modal");
    if (old) old.remove();
    const wrap = document.createElement("div");
    wrap.id = "bds-qrcam-modal";
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.88);z-index:296000;display:flex;align-items:center;justify-content:center;padding:16px;";
    wrap.innerHTML = `
      <div class="bds-card" style="max-width:520px;width:100%;padding:18px;border-color:#38bdf8;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="margin:0;font-size:16px;color:#fff;">📷 ${cfg.title || "Escáner Nativo de Código QR"}</h3>
          <button id="qrc-mcls" style="background:#7f1d1d;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-weight:800;cursor:pointer;">✕</button>
        </div>
        <div id="qrc-mbody"></div>
      </div>
    `;
    document.body.appendChild(wrap);
    let ctrl = null;
    const close = () => { if (ctrl) ctrl.stop(); wrap.remove(); };
    document.getElementById("qrc-mcls").onclick = close;
    ctrl = mount(document.getElementById("qrc-mbody"), {
      autoStart: true,
      onScan: (code, src) => {
        playTone("green");
        if (cfg.closeOnScan !== false) close();
        if (cfg.onScan) cfg.onScan(code, src);
      }
    });
  }

  window.BDS_QR_CAMERA = { mount, openModal, playTone };
})();