import React, { useState } from "react";

const DOMINIOS_PERMITIDOS = ["gmail.com", "mep.go.cr", "est.mep.go.cr"];

export function esCorreoInstitucionalValido(correo) {
  const limpio = String(correo || "").trim().toLowerCase();
  const partes = limpio.split("@");
  if (partes.length !== 2) return false;
  const dominio = partes[1];
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

export function AccesoRestringidoGate({ onAutorizado, onModoPrueba }) {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!esCorreoInstitucionalValido(correo)) {
      setError(
        "Acceso restringido: solo se permiten correos @gmail.com o institucionales @mep.go.cr / @est.mep.go.cr. No se admite ingreso libre con cualquier nombre."
      );
      return;
    }
    setError("");
    onAutorizado({
      correo: correo.trim().toLowerCase(),
      modo: "completo"
    });
  }

  return (
    <div className="mx-auto my-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
      <div className="mb-5">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          pracTICAtecnica.com — BDS Devs
        </span>
        <h2 className="mt-3 text-2xl font-bold text-slate-900">
          Ingreso exclusivo con correo Gmail o MEP
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Ingresa con tu cuenta <strong>@gmail.com</strong> o <strong>@mep.go.cr / @est.mep.go.cr</strong> para acceder al banco completo de ejercicios, audios y practica.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bds-correo-acceso" className="block text-sm font-semibold text-slate-800">
            Correo electronico autorizado
          </label>
          <input
            id="bds-correo-acceso"
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="usuario@gmail.com o usuario@est.mep.go.cr"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        {error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Ingresar con correo Gmail o MEP
        </button>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Prueba gratuita limitada (solo vista previa y anuncios de pracTICAtecnica.com)
        </p>
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
          <p className="font-bold">pracTICAtecnica.com — Entrena para tus pruebas tecnicas y academicas</p>
          <p className="mt-1">
            Practica idiomas, matematica y especialidad con el respaldo de <strong>BDS Devs</strong>. La prueba gratuita limita funciones avanzadas e incluye promocion propia de la plataforma.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onModoPrueba({ correo: "prueba-limitada@practicatecnica.com", modo: "prueba" })}
          className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Continuar en prueba gratuita limitada (con publicidad propia)
        </button>
      </div>
    </div>
  );
}
