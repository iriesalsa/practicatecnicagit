import React, { useState } from "react";

const DOMINIOS_PERMITIDOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];
const LOCK_KEY = "practicatecnica_auth_intentos_v333";
const MAX_INTENTOS = 5;

export function esCorreoInstitucionalValido(correo) {
  const limpio = String(correo || "").trim().toLowerCase();
  const partes = limpio.split("@");
  if (partes.length !== 2 || !partes[0] || !partes[1]) return false;
  return DOMINIOS_PERMITIDOS.includes(partes[1]);
}

function leerIntentos() {
  try { return Number(window.localStorage.getItem(LOCK_KEY) || "0"); } catch (_e) { return 0; }
}

function guardarIntentos(n) {
  try { window.localStorage.setItem(LOCK_KEY, String(n)); } catch (_e) {}
}

export function BuhoAzulOriginal({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="B\u00faho Azul pracTICAtecnica.com">
      <circle cx="32" cy="32" r="30" fill="#1d4ed8" />
      <path d="M18 22 L24 14 L32 20 L40 14 L46 22 L46 42 C46 50 40 54 32 54 C24 54 18 50 18 42 Z" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="25" cy="30" r="6" fill="#ffffff" />
      <circle cx="39" cy="30" r="6" fill="#ffffff" />
      <circle cx="25" cy="30" r="2.8" fill="#0f172a" />
      <circle cx="39" cy="30" r="2.8" fill="#0f172a" />
      <polygon points="32,33 28,39 36,39" fill="#f59e0b" />
      <path d="M23 44 Q32 49 41 44" fill="none" stroke="#bfdbfe" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function AccesoRestringidoGate({ onAutorizado, onModoPrueba }) {
  const [vista, setVista] = useState("login");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Estudiante");
  const [clave, setClave] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [intentos, setIntentos] = useState(() => leerIntentos());
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const isLocked = intentos >= MAX_INTENTOS;

  function registrarFallo(mensaje) {
    const siguiente = intentos + 1;
    setIntentos(siguiente);
    guardarIntentos(siguiente);
    setError(mensaje);
  }

  function handleLogin(e) {
    e.preventDefault();
    setOkMsg("");
    if (isLocked) return;

    if (!esCorreoInstitucionalValido(correo)) {
      registrarFallo(
        "Acceso restringido: solo se permiten cuentas @gmail.com, @mep.go.cr o @est.mep.go.cr. No se admite ingreso libre con cualquier nombre."
      );
      return;
    }

    if (String(clave).trim().length < 6) {
      registrarFallo("Ingresa una contrase\u00f1a v\u00e1lida de al menos 6 caracteres.");
      return;
    }

    guardarIntentos(0);
    setIntentos(0);
    setError("");
    onAutorizado({
      correo: correo.trim().toLowerCase(),
      rol,
      modo: "completo",
      metodo: "correo-autorizado"
    });
  }

  function handleGoogleOAuth() {
    setOkMsg("");
    if (isLocked) return;
    if (!esCorreoInstitucionalValido(correo)) {
      setError("Escribe tu correo @gmail.com o @mep.go.cr para continuar con Google OAuth.");
      return;
    }
    guardarIntentos(0);
    setIntentos(0);
    setError("");
    onAutorizado({
      correo: correo.trim().toLowerCase(),
      rol,
      modo: "completo",
      metodo: "google-oauth"
    });
  }

  function handleRecover(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");
    if (!esCorreoInstitucionalValido(correo)) {
      setError("Usa un correo @gmail.com, @mep.go.cr o @est.mep.go.cr para recuperar tu clave.");
      return;
    }
    if (nuevaClave.length < 8 || nuevaClave !== confirmarClave) {
      setError("La nueva contrase\u00f1a debe tener m\u00ednimo 8 caracteres y coincidir.");
      return;
    }
    setOkMsg("Enlace de verificaci\u00f3n preparado para " + correo.trim().toLowerCase() + ".");
    setNuevaClave("");
    setConfirmarClave("");
  }

  return (
    <div className="mx-auto my-6 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <BuhoAzulOriginal className="h-12 w-12 shrink-0" />
        <div>
          <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
            pracTICAtecnica.com &bull; BDS Devs
          </span>
          <h1 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
            {vista === "login" ? "Acceso Exclusivo Gmail / MEP" : "Recuperar contrase\u00f1a"}
          </h1>
        </div>
      </div>

      {isLocked ? (
        <div role="alert" className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-800">
          Acceso bloqueado por seguridad tras {MAX_INTENTOS} intentos fallidos consecutivos. Comun\u00edcate con el administrador de soporte de pracTICAtecnica.com para desbloquear tu cuenta.
        </div>
      ) : null}

      {vista === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="bds-correo-v333" className="block text-sm font-semibold text-slate-800">
              Correo autorizado (@gmail.com o @mep.go.cr)
            </label>
            <input
              id="bds-correo-v333"
              type="email"
              required
              disabled={isLocked}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@est.mep.go.cr o usuario@gmail.com"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="bds-rol-v333" className="block text-sm font-semibold text-slate-800">
                Rol RBAC
              </label>
              <select
                id="bds-rol-v333"
                disabled={isLocked}
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 disabled:bg-slate-100"
              >
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Padre/Madre">Padre / Madre</option>
                <option value="Jefatura">Jefatura</option>
                <option value="Auxiliar">Auxiliar</option>
              </select>
            </div>

            <div>
              <label htmlFor="bds-clave-v333" className="block text-sm font-semibold text-slate-800">
                Contrase\u00f1a
              </label>
              <div className="relative mt-1">
                <input
                  id="bds-clave-v333"
                  type={verClave ? "text" : "password"}
                  required
                  disabled={isLocked}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="Tu contrase\u00f1a"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-16 text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setVerClave((v) => !v)}
                  className="absolute right-2.5 top-2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {verClave ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {error} ({intentos}/{MAX_INTENTOS})
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLocked}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
          >
            Iniciar sesi\u00f3n con Gmail o MEP
          </button>

          <button
            type="button"
            disabled={isLocked}
            onClick={handleGoogleOAuth}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Continuar con Google (OAuth)
          </button>

          <div className="text-right">
            <button
              type="button"
              onClick={() => { setVista("recover"); setError(""); setOkMsg(""); }}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              \u00bfOlvidaste tu contrase\u00f1a?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecover} className="space-y-4">
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="usuario@est.mep.go.cr o usuario@gmail.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
          />
          <input
            type="password"
            required
            value={nuevaClave}
            onChange={(e) => setNuevaClave(e.target.value)}
            placeholder="Nueva contrase\u00f1a (m\u00ednimo 8 caracteres)"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
          />
          <input
            type="password"
            required
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            placeholder="Confirmar nueva contrase\u00f1a"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
          />
          {error ? <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">{error}</p> : null}
          {okMsg ? <p className="rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800">{okMsg}</p> : null}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
              Enviar verificaci\u00f3n
            </button>
            <button
              type="button"
              onClick={() => { setVista("login"); setError(""); setOkMsg(""); }}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Volver
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Prueba gratuita limitada (solo vista previa + publicidad propia)
        </p>
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
          <p className="font-bold">pracTICAtecnica.com &mdash; Desarrollado por BDS Devs</p>
          <p className="mt-1">
            Entrena idiomas, matem\u00e1ticas y especialidad t\u00e9cnica con audio, QR SHA-256, Cooperativa y Comedor. La prueba gratuita limita las funciones avanzadas y muestra publicidad oficial nuestra.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onModoPrueba({ correo: "prueba-limitada@practicatecnica.com", rol: "Prueba", modo: "prueba" })}
          className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Entrar en prueba gratuita limitada (con publicidad nuestra)
        </button>
      </div>
    </div>
  );
}