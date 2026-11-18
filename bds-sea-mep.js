(function () {
  const STORAGE_KEY = 'bds_sea_mep_planilla_2026';

  const DATOS_INICIALES = [
    { id: "2-0891-0452", nombre: "Alfaro Rojas Valeria", seccion: "11-1", cotidiano: 92, tareas: 100, pruebas: 84, proyecto: 90, asistencia: 98 },
    { id: "4-0256-0811", nombre: "Brenes Mora Sebastián", seccion: "11-1", cotidiano: 78, tareas: 80, pruebas: 68, proyecto: 75, asistencia: 92 },
    { id: "1-1940-0332", nombre: "Castro Vargas Camila", seccion: "12-1", cotidiano: 65, tareas: 70, pruebas: 58, proyecto: 64, asistencia: 86 },
    { id: "2-0912-0774", nombre: "Delgado Solís Mateo", seccion: "12-1", cotidiano: 96, tareas: 100, pruebas: 94, proyecto: 98, asistencia: 100 }
  ];

  function cargarPlanilla() {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : DATOS_INICIALES;
    } catch {
      return DATOS_INICIALES;
    }
  }

  function guardarPlanilla(datos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  }

  function calcularMetricas(est, pesos) {
    const cot = Math.min(100, Math.max(0, Number(est.cotidiano) || 0));
    const tar = Math.min(100, Math.max(0, Number(est.tareas) || 0));
    const pru = Math.min(100, Math.max(0, Number(est.pruebas) || 0));
    const pro = Math.min(100, Math.max(0, Number(est.proyecto) || 0));
    const asi = Math.min(100, Math.max(0, Number(est.asistencia) || 0));

    const notaFinal = (
      (cot * (pesos.cot / 100)) +
      (tar * (pesos.tar / 100)) +
      (pru * (pesos.pru / 100)) +
      (pro * (pesos.pro / 100)) +
      (asi * (pesos.asi / 100))
    );

    const notaRedondeada = Math.round(notaFinal * 100) / 100;
    let nivelReac = "Nivel 1 (Inicial)";
    if (cot >= 85) nivelReac = "Nivel 3 (Avanzado)";
    else if (cot >= 70) nivelReac = "Nivel 2 (Intermedio)";

    let condicion = "REPROBADO";
    if (notaRedondeada >= 70 && asi >= 80) condicion = "APROBADO";
    else if (notaRedondeada >= 60 && asi >= 80) condicion = "AMPLIACIÓN";

    return { notaRedondeada, nivelReac, condicion };
  }

  window.abrirGestorSeaMep = function () {
    let previo = document.getElementById('bds-sea-modal');
    if (previo) previo.remove();

    let lista = cargarPlanilla();
    // Pesos estándar Educación Técnica / Diversificada MEP (ajustables en vivo)
    let pesos = { cot: 35, tar: 10, pru: 25, pro: 20, asi: 10 };

    const modal = document.createElement('div');
    modal.id = 'bds-sea-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.97);z-index:100002;overflow-y:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    function render() {
      modal.innerHTML = `
        <div style="max-width:1140px;margin:0 auto;background:#0b192c;border:1px solid #10b981;border-radius:18px;padding:18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.9);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="background:#10b981;color:#022c22;font-weight:900;font-size:11px;padding:3px 8px;border-radius:6px;">COMPATIBLE SEA / REGISTRO MEP</span>
                <h2 style="margin:0;font-size:18px;color:#34d399;">📊 Registro Oficial REAC 2026: Cotidianos, Pruebas, Tareas y Asistencia</h2>
              </div>
              <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">Importa y exporta archivos CSV compatibles con Excel y el Sistema de Evaluación de los Aprendizajes (SEA) para Docentes, Directores, Estudiantes y Familias</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label style="background:#2563eb;color:#fff;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
                📂 Importar CSV (SEA/Excel)
                <input id="sea-file-in" type="file" accept=".csv,.txt" style="display:none;"/>
              </label>
              <button id="sea-btn-export" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">📥 Exportar CSV Oficial MEP</button>
              <button id="sea-btn-plantilla" style="background:#0f172a;border:1px solid #38bdf8;color:#38bdf8;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">📄 Bajar Plantilla CSV</button>
              <button id="sea-btn-close" style="background:#ef4444;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Configuración rápida de porcentajes REAC y Agregar Estudiante -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin-bottom:14px;">
            <div style="background:#071220;border:1px solid #1e293b;padding:10px 12px;border-radius:12px;font-size:11px;">
              <div style="font-weight:800;color:#22d3ee;margin-bottom:6px;">⚙️ Ponderación Oficial de Componentes (%)</div>
              <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;text-align:center;">
                <div>Cotidiano<input id="p-cot" type="number" value="${pesos.cot}" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;font-size:11px;"/></div>
                <div>Tareas<input id="p-tar" type="number" value="${pesos.tar}" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;font-size:11px;"/></div>
                <div>Pruebas<input id="p-pru" type="number" value="${pesos.pru}" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;font-size:11px;"/></div>
                <div>Proyecto<input id="p-pro" type="number" value="${pesos.pro}" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;font-size:11px;"/></div>
                <div>Asist.<input id="p-asi" type="number" value="${pesos.asi}" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;font-size:11px;"/></div>
              </div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:10px 12px;border-radius:12px;font-size:11px;">
              <div style="font-weight:800;color:#34d399;margin-bottom:6px;">➕ Agregar Estudiante / Simulación Rápida</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <input id="new-id" type="text" placeholder="Cédula (Ej. 2-0888-0111)" style="flex:1;min-width:110px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;"/>
                <input id="new-nom" type="text" placeholder="Apellidos y Nombre" style="flex:2;min-width:140px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;"/>
                <input id="new-sec" type="text" placeholder="Sección" value="11-1" style="width:60px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;"/>
                <button id="btn-add-est" style="background:#06b6d4;color:#020617;border:none;padding:6px 12px;border-radius:6px;font-weight:800;cursor:pointer;">Añadir</button>
              </div>
            </div>
          </div>

          <div id="sea-msg" style="margin-bottom:10px;font-size:12px;"></div>

          <!-- Tabla Editable Responsive compatible SEA -->
          <div style="overflow-x:auto;background:#071220;border:1px solid #1e293b;border-radius:12px;">
            <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
              <thead>
                <tr style="background:#0f172a;color:#38bdf8;border-bottom:1px solid #1e293b;">
                  <th style="padding:10px 8px;">Identificación</th>
                  <th style="padding:10px 8px;">Estudiante</th>
                  <th style="padding:10px 8px;">Sección</th>
                  <th style="padding:10px 8px;">Cotidiano (0-100)</th>
                  <th style="padding:10px 8px;">Tareas (0-100)</th>
                  <th style="padding:10px 8px;">Pruebas (0-100)</th>
                  <th style="padding:10px 8px;">Proyecto (0-100)</th>
                  <th style="padding:10px 8px;">Asist. %</th>
                  <th style="padding:10px 8px;">Nivel Cotidiano</th>
                  <th style="padding:10px 8px;">Nota SEA</th>
                  <th style="padding:10px 8px;">Condición</th>
                </tr>
              </thead>
              <tbody>
                ${lista.map((est, i) => {
                  const m = calcularMetricas(est, pesos);
                  const colCond = m.condicion === 'APROBADO' ? '#34d399' : (m.condicion === 'AMPLIACIÓN' ? '#fbbf24' : '#f87171');
                  return `
                    <tr style="border-bottom:1px solid #1e293b;">
                      <td style="padding:8px;font-family:monospace;color:#cbd5e1;">${est.id}</td>
                      <td style="padding:8px;font-weight:700;">${est.nombre}</td>
                      <td style="padding:8px;color:#94a3b8;">${est.seccion}</td>
                      <td style="padding:6px;"><input data-idx="${i}" data-f="cotidiano" class="sea-inp" type="number" min="0" max="100" value="${est.cotidiano}" style="width:58px;background:#112236;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;"/></td>
                      <td style="padding:6px;"><input data-idx="${i}" data-f="tareas" class="sea-inp" type="number" min="0" max="100" value="${est.tareas}" style="width:58px;background:#112236;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;"/></td>
                      <td style="padding:6px;"><input data-idx="${i}" data-f="pruebas" class="sea-inp" type="number" min="0" max="100" value="${est.pruebas}" style="width:58px;background:#112236;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;"/></td>
                      <td style="padding:6px;"><input data-idx="${i}" data-f="proyecto" class="sea-inp" type="number" min="0" max="100" value="${est.proyecto}" style="width:58px;background:#112236;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;"/></td>
                      <td style="padding:6px;"><input data-idx="${i}" data-f="asistencia" class="sea-inp" type="number" min="0" max="100" value="${est.asistencia}" style="width:58px;background:#112236;border:1px solid #334155;color:#fff;padding:5px;border-radius:6px;text-align:center;"/></td>
                      <td style="padding:8px;font-size:11px;color:#a5b4fc;">${m.nivelReac}</td>
                      <td style="padding:8px;font-weight:900;font-size:13px;color:#38bdf8;">${m.notaRedondeada}</td>
                      <td style="padding:8px;font-weight:800;color:${colCond};">${m.condicion}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      document.getElementById('sea-btn-close').onclick = () => modal.remove();

      ['cot','tar','pru','pro','asi'].forEach(k => {
        document.getElementById('p-' + k).onchange = (e) => {
          pesos[k] = Number(e.target.value) || 0;
          render();
        };
      });

      document.querySelectorAll('.sea-inp').forEach(inp => {
        inp.onchange = (e) => {
          const idx = parseInt(inp.getAttribute('data-idx'), 10);
          const field = inp.getAttribute('data-f');
          lista[idx][field] = Math.min(100, Math.max(0, Number(e.target.value) || 0));
          guardarPlanilla(lista);
          render();
        };
      });

      document.getElementById('btn-add-est').onclick = () => {
        const id = document.getElementById('new-id').value.trim() || ('EST-' + (lista.length + 1));
        const nombre = document.getElementById('new-nom').value.trim();
        const seccion = document.getElementById('new-sec').value.trim() || '11-1';
        if (!nombre) return;
        lista.push({ id, nombre, seccion, cotidiano: 85, tareas: 90, pruebas: 80, proyecto: 85, asistencia: 100 });
        guardarPlanilla(lista);
        render();
      };

      // Exportar CSV con BOM UTF-8 y separador ';' para Excel en español / SEA MEP
      document.getElementById('sea-btn-export').onclick = () => {
        const encabezados = "Identificacion;Estudiante;Seccion;Trabajo_Cotidiano;Tareas;Pruebas;Proyecto;Asistencia_Porcentaje;Nivel_REAC;Nota_Final_SEA;Condicion\n";
        const filas = lista.map(est => {
          const m = calcularMetricas(est, pesos);
          return `${est.id};"${est.nombre}";${est.seccion};${est.cotidiano};${est.tareas};${est.pruebas};${est.proyecto};${est.asistencia};"${m.nivelReac}";${m.notaRedondeada};${m.condicion}`;
        }).join("\n");
        const contenido = "\uFEFF" + encabezados + filas;
        const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "SEA_MEP_Registro_Calificaciones_2026.csv";
        a.click();
      };

      // Descargar plantilla limpia para llenar en Excel e importar
      document.getElementById('sea-btn-plantilla').onclick = () => {
        const plantilla = "\uFEFFIdentificacion;Estudiante;Seccion;Trabajo_Cotidiano;Tareas;Pruebas;Proyecto;Asistencia_Porcentaje\n2-0111-0222;Apellido1 Apellido2 Nombre;11-1;90;100;85;90;95\n";
        const blob = new Blob([plantilla], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "Plantilla_Oficial_SEA_MEP_2026.csv";
        a.click();
      };

      // Importar archivo CSV (soporta ',' o ';')
      document.getElementById('sea-file-in').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
          if (lines.length < 2) return;
          const sep = lines[0].includes(';') ? ';' : ',';
          const nuevos = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(sep).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 2) {
              nuevos.push({
                id: cols[0] || ('ID-' + i),
                nombre: cols[1] || ('Estudiante ' + i),
                seccion: cols[2] || '11-1',
                cotidiano: Number(cols[3]) || 80,
                tareas: Number(cols[4]) || 80,
                pruebas: Number(cols[5]) || 80,
                proyecto: Number(cols[6]) || 80,
                asistencia: Number(cols[7]) || 95
              });
            }
          }
          if (nuevos.length > 0) {
            lista = nuevos;
            guardarPlanilla(lista);
            render();
            const msgBox = document.getElementById('sea-msg');
            if (msgBox) msgBox.innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:8px 12px;border-radius:8px;color:#ecfdf5;">✅ Se importaron <b>${nuevos.length} estudiantes</b> correctamente desde el archivo CSV.</div>`;
          }
        };
        reader.readAsText(file, 'UTF-8');
      };
    }

    document.body.appendChild(modal);
    render();
  };

  // Agregar botón directo "📊 CSV SEA-MEP" en la barra flotante inferior
  function acoplarBotonSea() {
    const bar = document.getElementById('bds-soberana-bar');
    if (bar && !document.getElementById('bds-btn-sea')) {
      const btn = document.createElement('button');
      btn.id = 'bds-btn-sea';
      btn.style.cssText = 'background:#059669;color:#ffffff;border:none;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;';
      btn.innerHTML = '📊 Registro SEA-MEP (Importar/Exportar CSV)';
      btn.onclick = () => window.abrirGestorSeaMep();
      bar.insertBefore(btn, bar.firstChild.nextSibling);
    }
  }

  setInterval(acoplarBotonSea, 600);
})();