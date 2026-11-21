import React, { useEffect, useRef, useState } from "react";

export async function calcularSha256Hex(texto) {
  const data = new TextEncoder().encode(String(texto || ""));
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function interpretarCodigoQr(rawText) {
  const limpio = String(rawText || "").trim();
  const esHashPuro = /^[a-fA-F0-9]{64}$/.test(limpio);

  if (limpio.startsWith("{") && limpio.endsWith("}")) {
    try {
      const obj = JSON.parse(limpio);
      return {
        valido: true,
        formato: "JSON_FIRMADO",
        rol: obj.rol || "Estudiante",
        nombre: obj.nombre || "Usuario verificado",
        documento: obj.documento || "Identificaci\u00f3n / Permiso",
        hash: obj.sha256 || obj.hash || "",
        raw: limpio
      };
    } catch (_e) {}
  }

  if (limpio.includes("|")) {
    const [rol, nombre, documento, hash] = limpio.split("|");
    return {
      valido: true,
      formato: "INSTITUCIONAL_PIPE",
      rol: rol || "Estudiante",
      nombre: nombre || "Usuario institucional",
      documento: documento || "Permiso / Horario / Nota",
      hash: hash || "",
      raw: limpio
    };
  }

  return {
    valido: limpio.length >= 6,
    formato: esHashPuro ? "SHA256_COMPLETO" : "BARCODE_O_QR",
    rol: "Identificado",
    nombre: esHashPuro ? "Firma SHA-256 detectada (64 hex)" : limpio,
    documento: "Verificaci\u00f3n autom\u00e1tica",
    hash: esHashPuro ? limpio.toLowerCase() : "",
    raw: limpio
  };
}

export function UniversalQrScanner({
  titulo = "Esc\u00e1ner QR y C\u00f3digos de Barras (SHA-256)",
  descripcion = "Lee con c\u00e1mara o lector USB los QR de estudiantes, padres de familia y docentes (permisos, justificaciones, horarios y notas).",
  onCodigoLeido
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const html5QrRef = useRef(null);
  const readerDivId = useRef("bds-qr-reader-" + Math.random().toString(36).slice(2, 8));

  const [camaraActiva, setCamaraActiva] = useState(false);
  const [modoMotor, setModoMotor] = useState("Inactivo");
  const [errorMsg, setErrorMsg] = useState("");
  const [entradaLectorUsb, setEntradaLectorUsb] = useState("");
  const [ultimoResultado, setUltimoResultado] = useState(null);

  useEffect(() => {
    return () => { detenerCamara(); };
  }, []);

  async function emitirLectura(textoCrudo) {
    const limpio = String(textoCrudo || "").trim();
    if (!limpio) return;
    const info = interpretarCodigoQr(limpio);
    if (!info.hash && window.crypto && window.crypto.subtle) {
      info.hashCalculado = await calcularSha256Hex(limpio);
    }
    setUltimoResultado(info);
    if (typeof onCodigoLeido === "function") onCodigoLeido(info);
  }

  async function detenerCamara() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        await html5QrRef.current.clear();
      } catch (_e) {}
      html5QrRef.current = null;
    }
    setCamaraActiva(false);
    setModoMotor("Inactivo");
  }

  async function iniciarCamara() {
    setErrorMsg("");
    await detenerCamara();

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg("El navegador requiere HTTPS o localhost para abrir la c\u00e1mara. Puedes usar lector USB abajo.");
      return;
    }

    try {
      const mod = await import("html5-qrcode");
      if (mod && mod.Html5Qrcode) {
        const html5Qr = new mod.Html5Qrcode(readerDivId.current);
        html5QrRef.current = html5Qr;
        setCamaraActiva(true);
        setModoMotor("C\u00e1mara HD (QR + C\u00f3digo de Barras)");
        await html5Qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => { await emitirLectura(decodedText); },
          () => {}
        );
        return;
      }
    } catch (_errHtml5) {}

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamaraActiva(true);

      if ("BarcodeDetector" in window) {
        const detector = new window.BarcodeDetector({
          formats: ["qr_code", "code_128", "code_39", "ean_13", "ean_8", "upc_a"]
        });
        setModoMotor("BarcodeDetector nativo (QR + Barras)");
        const scanLoop = async () => {
          if (!videoRef.current || !streamRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              await emitirLectura(barcodes[0].rawValue);
            }
          } catch (_e) {}
          rafRef.current = requestAnimationFrame(scanLoop);
        };
        rafRef.current = requestAnimationFrame(scanLoop);
      } else {
        setModoMotor("C\u00e1mara activa sin BarcodeDetector");
        setErrorMsg("Usa Chrome/Edge o lector USB en el campo derecho.");
      }
    } catch (err) {
      setErrorMsg("No se pudo abrir la c\u00e1mara: revisa permisos del navegador. " + err.message);
      setCamaraActiva(false);
    }
  }

  async function manejarEnvioUsb(e) {
    e.preventDefault();
    if (!entradaLectorUsb.trim()) return;
    await emitirLectura(entradaLectorUsb);
    setEntradaLectorUsb("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{titulo}</h2>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">{descripcion}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Estado: {modoMotor}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!camaraActiva ? (
          <button
            type="button"
            onClick={iniciarCamara}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 sm:text-sm"
          >
            Activar c\u00e1mara QR / Barras
          </button>
        ) : (
          <button
            type="button"
            onClick={detenerCamara}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 sm:text-sm"
          >
            Detener c\u00e1mara
          </button>
        )}
      </div>

      {errorMsg ? (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-900">
          {errorMsg}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2">
          <div id={readerDivId.current} className="w-full" />
          <video
            ref={videoRef}
            playsInline
            muted
            className={camaraActiva && !html5QrRef.current ? "h-64 w-full rounded-lg object-cover" : "hidden"}
          />
          {!camaraActiva ? (
            <div className="flex h-48 items-center justify-center px-4 text-center text-xs text-slate-400">
              Presiona "Activar c\u00e1mara QR / Barras" para escanear permisos, carnets, horarios, notas o firmas SHA-256.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <form onSubmit={manejarEnvioUsb} className="space-y-2">
            <label htmlFor="bds-usb-qr" className="block text-xs font-bold uppercase tracking-wide text-slate-600">
              Lector externo USB / Pegar hash SHA-256
            </label>
            <input
              id="bds-usb-qr"
              type="text"
              value={entradaLectorUsb}
              onChange={(e) => setEntradaLectorUsb(e.target.value)}
              placeholder="Escanea con pistola USB o pega el QR/SHA-256 aqu\u00ed..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 sm:text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Validar c\u00f3digo escaneado
            </button>
          </form>

          {ultimoResultado ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950">
              <p className="font-bold">Lectura exitosa ({ultimoResultado.formato})</p>
              <p className="mt-1"><strong>Rol:</strong> {ultimoResultado.rol}</p>
              <p><strong>Identidad:</strong> {ultimoResultado.nombre}</p>
              <p><strong>Documento:</strong> {ultimoResultado.documento}</p>
              <p className="mt-1 break-all font-mono text-[11px] text-emerald-800">
                <strong>SHA-256:</strong> {ultimoResultado.hash || ultimoResultado.hashCalculado}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Formato recomendado en QR: <code className="rounded bg-white px-1 py-0.5">ROL|NOMBRE|TRAMITE|SHA256</code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}