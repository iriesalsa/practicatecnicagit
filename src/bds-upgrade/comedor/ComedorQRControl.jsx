import React, { useState } from "react";
import { UniversalQrScanner } from "../qr/UniversalQrScanner";

export function ComedorQRControl() {
  const [registros, setRegistros] = useState([]);
  const [aviso, setAviso] = useState("");
  const [tiempoComida, setTiempoComida] = useState("Almuerzo");

  function registrarPasoQr(info) {
    const hoy = new Date().toISOString().slice(0, 10);
    const claveUnica = `${hoy}|${tiempoComida}|${info.hash || info.raw}`;
    if (registros.some((r) => r.claveUnica === claveUnica)) {
      setAviso(`Atenci\u00f3n: ${info.nombre} ya registr\u00f3 ${tiempoComida} hoy (${hoy}).`);
      return;
    }
    const nuevo = {
      claveUnica,
      hora: new Date().toLocaleTimeString("es-CR"),
      tiempoComida,
      rol: info.rol,
      nombre: info.nombre,
      hash: info.hash || info.hashCalculado || info.raw
    };
    setRegistros((prev) => [nuevo, ...prev]);
    setAviso(`Acceso de comedor aprobado para ${info.nombre} (${tiempoComida}).`);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Comedor Institucional &mdash; Control por QR</h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              1) Selecciona Desayuno, Almuerzo o Merienda. 2) Activa la c\u00e1mara o lector USB. 3) Escanea el QR para registrar paso \u00fanico diario con SHA-256.
            </p>
          </div>
          <select
            value={tiempoComida}
            onChange={(e) => setTiempoComida(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 sm:text-sm"
          >
            <option value="Desayuno">Desayuno</option>
            <option value="Almuerzo">Almuerzo</option>
            <option value="Merienda">Merienda</option>
          </select>
        </div>

        {aviso ? (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-900">
            {aviso}
          </div>
        ) : null}
      </div>

      <UniversalQrScanner
        titulo={`Escaneo de ${tiempoComida} \u2014 Comedor`}
        descripcion="Lee el QR del carnet institucional (c\u00e1mara o lector USB) para registrar asistencia al comedor."
        onCodigoLeido={registrarPasoQr}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">
          Registro de hoy ({registros.length})
        </h3>
        {registros.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">A\u00fan no hay escaneos registrados en esta sesi\u00f3n.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Hora</th>
                  <th className="py-2 pr-3">Servicio</th>
                  <th className="py-2 pr-3">Rol</th>
                  <th className="py-2 pr-3">Nombre</th>
                  <th className="py-2">Hash SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registros.map((r) => (
                  <tr key={r.claveUnica}>
                    <td className="py-2 pr-3 font-medium">{r.hora}</td>
                    <td className="py-2 pr-3">{r.tiempoComida}</td>
                    <td className="py-2 pr-3">{r.rol}</td>
                    <td className="py-2 pr-3 font-semibold text-slate-900">{r.nombre}</td>
                    <td className="py-2 font-mono text-[11px] text-slate-600">{r.hash.slice(0, 20)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}