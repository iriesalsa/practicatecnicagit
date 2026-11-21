import React, { useMemo, useState } from "react";
import { UniversalQrScanner, calcularSha256Hex } from "../qr/UniversalQrScanner";

const COLON = "\u20A1";

const CATALOGO_COOPERATIVA = [
  { id: "coop-te-frio", nombre: "T\u00e9 Fr\u00edo (500 ml)", categoria: "Bebidas", precio: 700, stock: 45 },
  { id: "coop-tropical", nombre: "Tropical (surtido)", categoria: "Bebidas", precio: 800, stock: 40 },
  { id: "coop-proteina-vainilla", nombre: "Prote\u00edna con sabor (Vainilla / Chocolate)", categoria: "Nutrici\u00f3n", precio: 1500, stock: 25 },
  { id: "coop-proteina-fresa", nombre: "Prote\u00edna con sabor (Fresa)", categoria: "Nutrici\u00f3n", precio: 1500, stock: 20 },
  { id: "coop-agua", nombre: "Agua embotellada", categoria: "Bebidas", precio: 600, stock: 60 },
  { id: "coop-empanada", nombre: "Empanada arreglada", categoria: "Comida", precio: 1000, stock: 30 },
  { id: "coop-sandwich", nombre: "S\u00e1ndwich jam\u00f3n y queso", categoria: "Comida", precio: 1200, stock: 25 },
  { id: "coop-cafe", nombre: "Caf\u00e9 negro / con leche", categoria: "Bebidas", precio: 700, stock: 50 }
];

export function CooperativaPOS() {
  const [catalogo, setCatalogo] = useState(CATALOGO_COOPERATIVA);
  const [carrito, setCarrito] = useState([]);
  const [compradorQr, setCompradorQr] = useState(null);
  const [metodoPago, setMetodoPago] = useState("SINPE M\u00f3vil");
  const [facturaEmitida, setFacturaEmitida] = useState(null);
  const [mostrarEscaner, setMostrarEscaner] = useState(false);

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  function agregarArticulo(prod) {
    if (prod.stock <= 0) return;
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === prod.id);
      if (existe) {
        return prev.map((i) =>
          i.id === prod.id ? { ...i, cantidad: Math.min(prod.stock, i.cantidad + 1) } : i
        );
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  }

  function quitarArticulo(id) {
    setCarrito((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i)).filter((i) => i.cantidad > 0)
    );
  }

  async function emitirFactura() {
    if (carrito.length === 0) return;
    const consecutivo = "COOP-" + Date.now().toString().slice(-6);
    const fecha = new Date().toLocaleString("es-CR");
    const comprador = compradorQr ? compradorQr.nombre : "Venta mostrador";
    const resumen = `${consecutivo}|${fecha}|${comprador}|${metodoPago}|${total}|${carrito.map((c) => `${c.id}x${c.cantidad}`).join(",")}`;
    const sha256 = await calcularSha256Hex(resumen);

    setCatalogo((prev) =>
      prev.map((p) => {
        const comprado = carrito.find((c) => c.id === p.id);
        return comprado ? { ...p, stock: Math.max(0, p.stock - comprado.cantidad) } : p;
      })
    );

    setFacturaEmitida({ consecutivo, fecha, comprador, metodoPago, items: carrito, total, sha256 });
    setCarrito([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cooperativa Estudiantil &mdash; Ventas y Facturaci\u00f3n</h2>
          <p className="text-xs text-slate-600 sm:text-sm">
            Cat\u00e1logo verificado (T\u00e9 Fr\u00edo, Tropical, Prote\u00edna con sabor y m\u00e1s) con factura firmada SHA-256.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarEscaner((v) => !v)}
          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          {mostrarEscaner ? "Ocultar esc\u00e1ner QR" : "Identificar cliente con QR"}
        </button>
      </div>

      {mostrarEscaner ? (
        <UniversalQrScanner
          titulo="Identificar comprador en Cooperativa (QR / Carnet)"
          descripcion="Escanea el QR del estudiante o docente para ligar la factura a su cuenta."
          onCodigoLeido={(info) => {
            setCompradorQr(info);
            setMostrarEscaner(false);
          }}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
          {catalogo.map((prod) => (
            <div key={prod.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {prod.categoria}
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900">{prod.nombre}</h3>
                <p className="mt-1 text-base font-extrabold text-blue-700">
                  {COLON}{prod.precio.toLocaleString("es-CR")}
                </p>
                <p className="text-xs text-slate-500">Disponible: {prod.stock} uds</p>
              </div>
              <button
                type="button"
                disabled={prod.stock <= 0}
                onClick={() => agregarArticulo(prod)}
                className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
              >
                Agregar a factura
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
          <h3 className="text-base font-bold text-slate-900">Factura actual</h3>
          <p className="text-xs text-slate-600">
            Cliente: <strong>{compradorQr ? compradorQr.nombre : "Venta mostrador"}</strong>
          </p>

          {carrito.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              Agrega art\u00edculos del cat\u00e1logo para generar la venta.
            </p>
          ) : (
            <div className="space-y-2">
              {carrito.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{item.nombre}</p>
                    <p className="text-slate-500">{item.cantidad} x {COLON}{item.precio.toLocaleString("es-CR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {COLON}{(item.cantidad * item.precio).toLocaleString("es-CR")}
                    </span>
                    <button
                      type="button"
                      onClick={() => quitarArticulo(item.id)}
                      className="rounded-lg border border-slate-300 px-2 py-0.5 font-bold text-slate-700"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 pt-3">
            <label htmlFor="bds-coop-pago" className="block text-xs font-semibold text-slate-700">M\u00e9todo de pago</label>
            <select
              id="bds-coop-pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
            >
              <option value={"SINPE M\u00f3vil"}>SINPE M\u00f3vil</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta / Cuenta estudiantil">Tarjeta / Cuenta estudiantil</option>
            </select>

            <div className="mt-4 flex items-center justify-between text-base font-extrabold text-slate-900">
              <span>Total:</span>
              <span>{COLON}{total.toLocaleString("es-CR")}</span>
            </div>

            <button
              type="button"
              disabled={carrito.length === 0}
              onClick={emitirFactura}
              className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              Emitir factura con sello SHA-256
            </button>
          </div>

          {facturaEmitida ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
              <p className="font-bold">Factura emitida: {facturaEmitida.consecutivo}</p>
              <p>Fecha: {facturaEmitida.fecha}</p>
              <p>Cliente: {facturaEmitida.comprador}</p>
              <p>Pago: {facturaEmitida.metodoPago} &mdash; Total: {COLON}{facturaEmitida.total.toLocaleString("es-CR")}</p>
              <p className="mt-2 break-all font-mono text-[11px] text-emerald-800">SHA-256: {facturaEmitida.sha256}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}