import React, { useEffect, useState } from "react";
import { AccesoRestringidoGate, esCorreoInstitucionalValido } from "./auth/AccesoRestringidoGate";
import { PracticaDesktopResponsiveView } from "./ui/PracticaDesktopResponsiveView";

const STORAGE_KEY = "practicatecnica_bds_sesion_v246";

export function BdsDefinitivoApp() {
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    try {
      const guardada = window.localStorage.getItem(STORAGE_KEY);
      if (!guardada) return;
      const parsed = JSON.parse(guardada);
      if (parsed && parsed.modo === "prueba") {
        setSesion(parsed);
      } else if (parsed && esCorreoInstitucionalValido(parsed.correo)) {
        setSesion(parsed);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (_e) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function iniciarSesion(datos) {
    setSesion(datos);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    } catch (_e) {}
  }

  function cerrarSesion() {
    setSesion(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {}
  }

  if (!sesion) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <AccesoRestringidoGate
          onAutorizado={iniciarSesion}
          onModoPrueba={iniciarSesion}
        />
      </div>
    );
  }

  return (
    <PracticaDesktopResponsiveView
      sesion={sesion}
      onCerrarSesion={cerrarSesion}
    />
  );
}

export default BdsDefinitivoApp;
