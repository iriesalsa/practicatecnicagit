import React from "react";

export default function ExportadorSEA({ registros = [], modalidad = "CTP" }) {
  const exportarCSV = () => {
    const encabezados = ["ESTUDIANTE", "SECCION", "INDICADOR_321", "COTIDIANO", "TAREAS", "PRUEBAS", "PROYECTO", "NOTA_FINAL"];
    const lineas = [
      encabezados,
      ...registros.map((r) => [
        r.est || "",
        r.sec || "",
        r.ind || 3,
        r.cot || 0,
        r.tar || 0,
        r.pru || 0,
        r.proy || 0,
        Math.round((r.cot || 0) * 0.35 + (r.tar || 0) * 0.1 + (r.pru || 0) * 0.35 + (r.proy || 0) * 0.2),
      ]),
    ];
    const csv = "\uFEFF" + lineas.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    enlace.download = `SEA_CEA_${modalidad}_CTPMN.csv`;
    enlace.click();
  };

  return (
    <button onClick={exportarCSV} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold">
      Exportar CSV SEA/CEA
    </button>
  );
}