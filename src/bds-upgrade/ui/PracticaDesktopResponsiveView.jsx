import React, { useMemo, useState } from "react";
import { PRACTICA_ITEMS } from "../data/practicaItems";
import { ItemAudioPlayer } from "../ui/ItemAudioPlayer";
import { ItemVisual } from "../ui/ItemVisual";

export function PracticaDesktopResponsiveView({ sesion, onCerrarSesion }) {
  const areas = useMemo(() => {
    const set = new Set(PRACTICA_ITEMS.map((i) => i.area));
    return ["Todas", ...Array.from(set)];
  }, []);

  const [areaActiva, setAreaActiva] = useState("Todas");
  const filtrados = useMemo(() => {
    if (areaActiva === "Todas") return PRACTICA_ITEMS;
    return PRACTICA_ITEMS.filter((i) => i.area === areaActiva);
  }, [areaActiva]);

  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);

  const esPrueba = sesion && sesion.modo === "prueba";
  const listaDisponible = esPrueba ? filtrados.slice(0, 2) : filtrados;
  const itemActual = listaDisponible[indice] || listaDisponible[0];

  function cambiarArea(nuevaArea) {
    setAreaActiva(nuevaArea);
    setIndice(0);
    setSeleccion(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {itemActual ? itemActual.tituloExamen : "pracTICAtecnica.com"}
            </p>
            <p className="text-xs text-slate-500">
              {esPrueba ? "Modo Prueba Gratuita (Funciones limitadas)" : `Sesion: ${sesion.correo}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrarSesion}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {areas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => cambiarArea(area)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                areaActiva === area
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {esPrueba ? (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-950">
            <strong>Publicidad oficial pracTICAtecnica.com (BDS Devs):</strong> Desbloquea todas las materias, audios completos y banco extendido ingresando con tu correo <strong>@gmail.com</strong> o <strong>@mep.go.cr / @est.mep.go.cr</strong>.
          </div>
        ) : null}

        {itemActual ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6 sm:p-6">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
                <span>{itemActual.area}</span>
                <span>
                  Item {indice + 1} de {listaDisponible.length}
                </span>
              </div>

              <h1 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                {itemActual.consigna}
              </h1>

              <ItemVisual tipo={itemActual.imagenTipo} titulo={itemActual.tituloExamen} />

              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 sm:text-base">
                {itemActual.contexto}
              </p>

              <ItemAudioPlayer
                audioSrc={itemActual.audioSrc}
                textoAudio={itemActual.textoAudio}
                lang={itemActual.idiomaTts}
              />
            </section>

            <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6 sm:p-6">
              <div>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Selecciona una respuesta
                </h2>
                <div className="space-y-3">
                  {itemActual.opciones.map((op) => {
                    const elegida = seleccion === op.letra;
                    return (
                      <button
                        key={op.letra}
                        type="button"
                        onClick={() => setSeleccion(op.letra)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                          elegida
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-sm font-bold text-slate-800">
                          {op.letra}
                        </span>
                        <span className="text-sm font-medium text-slate-900 sm:text-base">
                          {op.texto}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {seleccion ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm">
                    <p className="font-bold text-slate-900">
                      {seleccion === itemActual.correcta
                        ? "Respuesta correcta."
                        : `Respuesta sugerida: ${itemActual.correcta}.`}
                    </p>
                    <p className="mt-1 text-slate-700">{itemActual.explicacion}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={indice === 0}
                  onClick={() => {
                    setIndice((prev) => Math.max(0, prev - 1));
                    setSeleccion(null);
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40 sm:text-sm"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={indice >= listaDisponible.length - 1}
                  onClick={() => {
                    setIndice((prev) => Math.min(listaDisponible.length - 1, prev + 1));
                    setSeleccion(null);
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 sm:text-sm"
                >
                  Siguiente
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
