(function () {
  const STORAGE_KEY = 'bds_sea_mep_v88_db';

  const CATALOGO_FALTAS_REAC = [
    { codigo: "ML-01", tipo: "Falta Muy Leve (1 a 5 pts)", desc: "Uso inadecuado de uniforme o llegada tardía injustificada", puntos: 3 },
    { codigo: "LV-01", tipo: "Falta Leve (6 a 10 pts)", desc: "Interrupción reiterada de la lección o irrespeto a normas del laboratorio", puntos: 8 },
    { codigo: "GR-01", tipo: "Falta Grave (11 a 19 pts)", desc: "Vocabulario ofensivo, daño intencional a mobiliario o desacato a autoridad docente", puntos: 15 },
    { codigo: "MG-01", tipo: "Falta Muy Grave - Pausa de Violencia (20 a 32 pts)", desc: "Acoso escolar (Bullying / Ciberbullying), intimidación o altercado físico/verbal", puntos: 25 },
    { codigo: "GV-01", tipo: "Falta Gravísima - Protocolo Violencia MEP (33 a 45 pts)", desc: "Agresión física grave, portación de objetos peligrosos o amenaza a la integridad", puntos: 40 }
  ];

  const DATOS_BASE = [
    {
      id: "2-0891-0452",
      nombre: "Alfaro Rojas Valeria",
      seccion: "11-1",
      profesorGuia: "Prof. Guía 11-1",
      adecuacion: "Ninguna (DUA)",
      encargado: "María Rojas (8811-2233)",
      materias: ["Programación 11°", "Redes y Subneteo", "Matemáticas"],
      cotidiano: 94, tareas: 100, pruebas: 88, proyecto: 92, asistencia: 98,
      conductaBase: 100,
      boletas: []
    },
    {
      id: "4-0256-0811",
      nombre: "Brenes Mora Sebastián",
      seccion: "11-1",
      profesorGuia: "Prof. Guía 11-1",
      adecuacion: "No Significativa (Tiempo +20%)",
      encargado: "Carlos Brenes (8722-4455)",
      materias: ["Programación 11°", "Redes y Subneteo"],
      cotidiano: 78, tareas: 80, pruebas: 72, proyecto: 76, asistencia: 90,
      conductaBase: 100,
      boletas: [
        { fecha: "2026-11-10", codigo: "LV-01", motivo: "Interrupción en laboratorio de cómputo", rebajo: 8, estado: "Aplicada por Prof. Guía", protocoloViolencia: false }
      ]
    },
    {
      id: "1-1940-0332",
      nombre: "Castro Vargas Camila",
      seccion: "12-1",
      profesorGuia: "Prof. Guía 12-1",
      adecuacion: "Alto Potencial (Reto STEAM)",
      encargado: "Laura Vargas (8933-6677)",
      materias: ["Diseño de Software 12°", "Programación 12°"],
      cotidiano: 96, tareas: 100, pruebas: 95, proyecto: 98, asistencia: 100,
      conductaBase: 100,
      boletas: []
    },
    {
      id: "2-0912-0774",
      nombre: "Delgado Solís Mateo",
      seccion: "12-1",
      profesorGuia: "Prof. Guía 12-1",
      adecuacion: "No Significativa",
      encargado: "Roberto Delgado (8644-8899)",
      materias: ["Diseño de Software 12°", "Programación 12°", "Contabilidad"],
      cotidiano: 68, tareas: 70, pruebas: 62, proyecto: 66, asistencia: 84,
      conductaBase: 100,
      boletas: [
        { fecha: "2026-11-14", codigo: "MG-01", motivo: "Pausa Activa por altercado verbal en pasillo (Protocolo Convivencia)", rebajo: 25, estado: "Firme - Debido Proceso", protocoloViolencia: true }
      ]
    }
  ];

  function cargarDB() {
    try {
      const g = localStorage.getItem(STORAGE_KEY);
      return g ? JSON.parse(g) : DATOS_BASE;
    } catch {
      return DATOS_BASE;
    }
  }

  function guardarDB(datos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  }

  function calcularConducta(est) {
    const totalRebajo = (est.boletas || []).reduce((acc, b) => acc + (Number(b.rebajo) || 0), 0);
    const notaConducta = Math.max(0, 100 - totalRebajo);
    const tieneAlertaViolencia = (est.boletas || []).some(b => b.protocoloViolencia || b.rebajo >= 20);
    let estadoConducta = "EXCELENTE";
    if (notaConducta < 65) estadoConducta = "REPROBADO CONDUCTA (<65)";
    else if (notaConducta < 80) estadoConducta = "ALERTA CONVIVENCIA";
    return { totalRebajo, notaConducta, tieneAlertaViolencia, estadoConducta };
  }

  function calcularAcademico(est, pesos) {
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
    let condicion = "REPROBADO";
    if (notaRedondeada >= 70 && asi >= 80) condicion = "APROBADO";
    else if (notaRedondeada >= 60 && asi >= 80) condicion = "AMPLIACIÓN";
    return { notaRedondeada, condicion };
  }

  window.abrirGestorSeaMep = function () {
    let previo = document.getElementById('bds-sea-modal');
    if (previo) previo.remove();

    let db = cargarDB();
    let vistaActiva = 'notas'; // 'notas' | 'conducta' | 'expediente'
    let rolDocente = 'ProfGuia'; // 'Materia' | 'ProfGuia' | 'Direccion'
    let seccionFiltro = 'TODAS';
    let materiaActiva = 'TODAS';
    let busquedaExp = '';
    let estSeleccionadoIdx = 0;
    let pesos = { cot: 35, tar: 10, pru: 25, pro: 20, asi: 10 };

    const modal = document.createElement('div');
    modal.id = 'bds-sea-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.97);z-index:100002;overflow-y:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    function getFiltrados() {
      return db.filter(est => {
        const okSec = (seccionFiltro === 'TODAS') || (est.seccion === seccionFiltro);
        const okMat = (materiaActiva === 'TODAS') || ((est.materias || []).includes(materiaActiva));
        const okBus = !busquedaExp || est.nombre.toLowerCase().includes(busquedaExp.toLowerCase()) || est.id.includes(busquedaExp);
        return okSec && okMat && okBus;
      });
    }

    function render() {
      const lista = getFiltrados();
      if (estSeleccionadoIdx >= db.length) estSeleccionadoIdx = 0;
      const estActual = db[estSeleccionadoIdx] || db[0];
      const condActual = calcularConducta(estActual);
      const acadActual = calcularAcademico(estActual, pesos);

      modal.innerHTML = `
        <div style="max-width:1180px;margin:0 auto;background:#0b192c;border:1px solid #10b981;border-radius:18px;padding:18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.92);">
          <!-- Cabecera Principal -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="background:#10b981;color:#022c22;font-weight:900;font-size:11px;padding:3px 8px;border-radius:6px;">SEA-MEP OFICIAL v88.0</span>
                <h2 style="margin:0;font-size:18px;color:#34d399;">🛡️ Gestión de Notas por Materia, Profesor Guía (Conducta/Boletas) y Expedientes</h2>
              </div>
              <p style="margin:3px 0 0;font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Cada docente administra sus estudiantes matriculados • El Profesor Guía gestiona Conducta, Boletas y Pausas contra la Violencia</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label style="background:#2563eb;color:#fff;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
                📂 Importar CSV SEA
                <input id="sea-file-in" type="file" accept=".csv,.txt" style="display:none;"/>
              </label>
              <button id="sea-btn-export" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">📥 Exportar CSV Completo</button>
              <button id="sea-btn-close" style="background:#ef4444;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Barra de Rol RBAC, Filtro de Sección, Materia y Buscador -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;background:#071220;padding:10px;border-radius:12px;border:1px solid #1e293b;margin-bottom:12px;font-size:11px;">
            <div>
              <label style="color:#67e8f9;font-weight:800;display:block;margin-bottom:3px;">👤 Perfil Activo (RBAC):</label>
              <select id="sel-rol-rbac" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="ProfGuia" ${rolDocente==='ProfGuia'?'selected':''}>👨‍🏫 Profesor Guía (Control de Conducta y Boletas)</option>
                <option value="Materia" ${rolDocente==='Materia'?'selected':''}>📘 Docente de Materia (Solo sus Matriculados)</option>
                <option value="Direccion" ${rolDocente==='Direccion'?'selected':''}>🏛️ Dirección / Orientación / SuperAdmin</option>
              </select>
            </div>
            <div>
              <label style="color:#34d399;font-weight:800;display:block;margin-bottom:3px;">🏫 Sección Asignada:</label>
              <select id="sel-sec-filtro" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="TODAS" ${seccionFiltro==='TODAS'?'selected':''}>Todas las Secciones</option>
                <option value="11-1" ${seccionFiltro==='11-1'?'selected':''}>Sección 11-1 (Guía / Técnica)</option>
                <option value="12-1" ${seccionFiltro==='12-1'?'selected':''}>Sección 12-1 (Guía / Técnica)</option>
              </select>
            </div>
            <div>
              <label style="color:#fbbf24;font-weight:800;display:block;margin-bottom:3px;">📚 Subárea / Materia Matriculada:</label>
              <select id="sel-mat-filtro" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="TODAS" ${materiaActiva==='TODAS'?'selected':''}>Todas las Materias</option>
                <option value="Programación 11°" ${materiaActiva==='Programación 11°'?'selected':''}>Programación 11°</option>
                <option value="Redes y Subneteo" ${materiaActiva==='Redes y Subneteo'?'selected':''}>Redes y Subneteo</option>
                <option value="Diseño de Software 12°" ${materiaActiva==='Diseño de Software 12°'?'selected':''}>Diseño de Software 12°</option>
                <option value="Programación 12°" ${materiaActiva==='Programación 12°'?'selected':''}>Programación 12°</option>
              </select>
            </div>
            <div>
              <label style="color:#c084fc;font-weight:800;display:block;margin-bottom:3px;">🔍 Buscar por Cédula o Estudiante:</label>
              <input id="inp-bus-exp" type="text" value="${busquedaExp}" placeholder="Ej. 2-0891 o apellido..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;"/>
            </div>
          </div>

          <!-- Pestañas de Módulos -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
            <button id="tab-v-notas" style="padding:9px 14px;border-radius:10px;border:none;font-size:12px;font-weight:800;cursor:pointer;background:${vistaActiva==='notas'?'#06b6d4':'#1e293b'};color:${vistaActiva==='notas'?'#020617':'#e2e8f0'};">
              📝 1. Notas por Materia Matriculada (${lista.length})
            </button>
            <button id="tab-v-conducta" style="padding:9px 14px;border-radius:10px;border:none;font-size:12px;font-weight:800;cursor:pointer;background:${vistaActiva==='conducta'?'#f59e0b':'#1e293b'};color:${vistaActiva==='conducta'?'#020617':'#e2e8f0'};">
              ⚖️ 2. Profesor Guía: Conducta, Boletas y Pausas de Violencia
            </button>
            <button id="tab-v-exp" style="padding:9px 14px;border-radius:10px;border:none;font-size:12px;font-weight:800;cursor:pointer;background:${vistaActiva==='expediente'?'#10b981':'#1e293b'};color:${vistaActiva==='expediente'?'#020617':'#e2e8f0'};">
              📁 3. Consulta de Expediente Integral 360°
            </button>
          </div>

          ${vistaActiva === 'notas' ? `
            <!-- VISTA 1: NOTAS POR MATERIA MATRICULADA -->
            <div style="overflow-x:auto;background:#071220;border:1px solid #1e293b;border-radius:12px;">
              <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                <thead>
                  <tr style="background:#0f172a;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:9px 8px;">Cédula</th>
                    <th style="padding:9px 8px;">Estudiante Matriculado</th>
                    <th style="padding:9px 8px;">Secc.</th>
                    <th style="padding:9px 8px;">Cotidiano</th>
                    <th style="padding:9px 8px;">Tareas</th>
                    <th style="padding:9px 8px;">Pruebas</th>
                    <th style="padding:9px 8px;">Proyecto</th>
                    <th style="padding:9px 8px;">Asist.%</th>
                    <th style="padding:9px 8px;">Nota Materia</th>
                    <th style="padding:9px 8px;">Conducta (Prof. Guía)</th>
                    <th style="padding:9px 8px;">Expediente</th>
                  </tr>
                </thead>
                <tbody>
                  ${lista.map((est) => {
                    const realIdx = db.findIndex(x => x.id === est.id);
                    const m = calcularAcademico(est, pesos);
                    const c = calcularConducta(est);
                    const colCond = m.condicion === 'APROBADO' ? '#34d399' : (m.condicion === 'AMPLIACIÓN' ? '#fbbf24' : '#f87171');
                    return `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:8px;font-family:monospace;color:#cbd5e1;">${est.id}</td>
                        <td style="padding:8px;font-weight:700;">
                          ${est.nombre}
                          <div style="font-size:10px;color:#94a3b8;">Adecuación: ${est.adecuacion}</div>
                        </td>
                        <td style="padding:8px;">${est.seccion}</td>
                        <td style="padding:5px;"><input data-idx="${realIdx}" data-f="cotidiano" class="sea-inp" type="number" min="0" max="100" value="${est.cotidiano}" style="width:52px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input data-idx="${realIdx}" data-f="tareas" class="sea-inp" type="number" min="0" max="100" value="${est.tareas}" style="width:52px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input data-idx="${realIdx}" data-f="pruebas" class="sea-inp" type="number" min="0" max="100" value="${est.pruebas}" style="width:52px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input data-idx="${realIdx}" data-f="proyecto" class="sea-inp" type="number" min="0" max="100" value="${est.proyecto}" style="width:52px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input data-idx="${realIdx}" data-f="asistencia" class="sea-inp" type="number" min="0" max="100" value="${est.asistencia}" style="width:52px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:8px;font-weight:900;color:${colCond};">${m.notaRedondeada} (${m.condicion})</td>
                        <td style="padding:8px;">
                          <span style="padding:3px 7px;border-radius:6px;font-weight:800;font-size:11px;background:${c.tieneAlertaViolencia?'#450a0a':'#064e3b'};color:${c.tieneAlertaViolencia?'#fca5a5':'#6ee7b7'};">
                            ${c.notaConducta} pts (-${c.totalRebajo})
                          </span>
                        </td>
                        <td style="padding:8px;">
                          <button data-idx="${realIdx}" class="btn-ver-exp" style="background:#0284c7;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Ver Ficha</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : vistaActiva === 'conducta' ? `
            <!-- VISTA 2: PROFESOR GUÍA — CONTROL DE CONDUCTA, BOLETAS Y PAUSAS DE VIOLENCIA -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;">
              <div style="background:#071220;border:1px solid #f59e0b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#fbbf24;">⚖️ Aplicar Boleta / Pausa Activa contra Violencia (Exclusivo Prof. Guía / Dirección)</h3>
                ${rolDocente === 'Materia' ? `
                  <div style="background:#451a03;border:1px solid #f59e0b;padding:10px;border-radius:8px;font-size:11px;color:#fde68a;margin-bottom:10px;">
                    ⚠️ <b>Control RBAC Activo:</b> Como Docente de Materia puedes redactar el reporte de boleta preventiva, pero <b>solo el Profesor Guía asignado a la sección</b> puede aplicar el rebajo en firme en el SEA. Cambia el selector superior a "Profesor Guía" para rebajar puntos en firme.
                  </div>
                ` : ''}
                <div style="display:flex;flex-direction:column;gap:9px;font-size:12px;">
                  <div>
                    <label style="display:block;color:#cbd5e1;margin-bottom:3px;">1. Seleccionar Estudiante de la Sección Guía:</label>
                    <select id="bol-est-idx" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;">
                      ${db.map((e, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>[${e.seccion}] ${e.nombre} (Conducta actual: ${calcularConducta(e).notaConducta} pts)</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label style="display:block;color:#cbd5e1;margin-bottom:3px;">2. Tipificación Reglamentaria REAC / Protocolo Violencia:</label>
                    <select id="bol-falta-cod" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;">
                      ${CATALOGO_FALTAS_REAC.map((f, i) => `<option value="${i}">${f.tipo} — ${f.desc} (-${f.puntos} pts)</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label style="display:block;color:#cbd5e1;margin-bottom:3px;">3. Puntos a Rebajar (Ajustable según debido proceso):</label>
                    <input id="bol-pts" type="number" min="1" max="45" value="3" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;"/>
                  </div>
                  <div>
                    <label style="display:block;color:#cbd5e1;margin-bottom:3px;">4. Descripción de Hechos / Acción de Pausa contra la Violencia:</label>
                    <input id="bol-motivo" type="text" placeholder="Ej. Boleta por desacato o activación de pausa preventiva de convivencia..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;"/>
                  </div>
                  <label style="display:flex;align-items:center;gap:6px;color:#fca5a5;font-weight:700;cursor:pointer;">
                    <input id="bol-violencia" type="checkbox"/> 🚨 Activar Alerta de Pausa / Protocolo de Prevención de Violencia MEP
                  </label>
                  <button id="btn-aplicar-boleta" style="background:${rolDocente==='Materia'?'#64748b':'#f59e0b'};color:#020617;border:none;padding:10px;border-radius:9px;font-weight:900;cursor:pointer;">
                    ${rolDocente==='Materia' ? '📨 Enviar Reporte al Profesor Guía' : '⚖️ Registrar Boleta y Rebajar Puntos (Prof. Guía)'}
                  </button>
                </div>
              </div>

              <!-- Historial de Boletas de la Sección -->
              <div style="background:#071220;border:1px solid #1e293b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#38bdf8;">📋 Bitácora de Boletas y Conducta de： ${estActual.nombre} (${estActual.seccion})</h3>
                <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;font-size:12px;">
                  <div style="background:#0b192c;padding:8px 12px;border-radius:8px;border:1px solid #334155;">Nota Base: <b>100 pts</b></div>
                  <div style="background:#450a0a;padding:8px 12px;border-radius:8px;border:1px solid #ef4444;color:#fca5a5;">Total Rebajado: <b>-${condActual.totalRebajo} pts</b></div>
                  <div style="background:#064e3b;padding:8px 12px;border-radius:8px;border:1px solid #10b981;color:#6ee7b7;">Conducta Final: <b>${condActual.notaConducta} pts (${condActual.estadoConducta})</b></div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${(estActual.boletas || []).length === 0 ? `
                    <div style="padding:14px;background:#0b192c;border-radius:8px;color:#6ee7b7;font-size:12px;">✅ Estudiante con conducta impecable (100 puntos, 0 boletas registradas).</div>
                  ` : (estActual.boletas || []).map((b, bi) => `
                    <div style="padding:10px;background:${b.protocoloViolencia?'#450a0a':'#112236'};border:1px solid ${b.protocoloViolencia?'#ef4444':'#334155'};border-radius:8px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                      <div>
                        <b>[${b.fecha}] Código ${b.codigo}:</b> ${b.motivo}
                        <div style="font-size:11px;color:#cbd5e1;">Estado: ${b.estado} ${b.protocoloViolencia ? '• 🚨 PROTOCOLO PAUSA DE VIOLENCIA ACTIVO' : ''}</div>
                      </div>
                      <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-weight:900;color:#fca5a5;">-${b.rebajo} pts</span>
                        ${rolDocente !== 'Materia' ? `<button data-bi="${bi}" class="btn-del-bol" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;">Anular</button>` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : `
            <!-- VISTA 3: CONSULTA DE EXPEDIENTE INTEGRAL 360° -->
            <div style="background:#071220;border:1px solid #10b981;padding:16px;border-radius:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                <div>
                  <h3 style="margin:0;font-size:16px;color:#34d399;">📁 Expediente Estudiantil Oficial: ${estActual.nombre}</h3>
                  <div style="font-size:12px;color:#94a3b8;">Cédula: <b>${estActual.id}</b> • Sección: <b>${estActual.seccion}</b> • Profesor Guía: <b>${estActual.profesorGuia}</b></div>
                </div>
                <select id="exp-sel-est" style="background:#0f172a;border:1px solid #38bdf8;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;">
                  ${db.map((e, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>Cambiar expediente: [${e.seccion}] ${e.nombre}</option>`).join('')}
                </select>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;font-size:12px;">
                <div style="background:#0b192c;padding:12px;border-radius:10px;border:1px solid #1e293b;">
                  <div style="color:#22d3ee;font-weight:800;margin-bottom:6px;">📌 Datos Administrativos y Familia</div>
                  <div><b>Encargado Legal:</b> ${estActual.encargado}</div>
                  <div><b>Apoyo / Adecuación:</b> ${estActual.adecuacion}</div>
                  <div><b>Materias Matriculadas:</b> ${(estActual.materias || []).join(', ')}</div>
                </div>
                <div style="background:#0b192c;padding:12px;border-radius:10px;border:1px solid #1e293b;">
                  <div style="color:#34d399;font-weight:800;margin-bottom:6px;">📊 Rendimiento Académico SEA</div>
                  <div><b>Cotidiano:</b> ${estActual.cotidiano} | <b>Tareas:</b> ${estActual.tareas}</div>
                  <div><b>Pruebas:</b> ${estActual.pruebas} | <b>Proyecto:</b> ${estActual.proyecto}</div>
                  <div><b>Promedio Ponderado:</b> <span style="color:#38bdf8;font-weight:900;">${acadActual.notaRedondeada} (${acadActual.condicion})</span></div>
                </div>
                <div style="background:#0b192c;padding:12px;border-radius:10px;border:1px solid #1e293b;">
                  <div style="color:#fbbf24;font-weight:800;margin-bottom:6px;">🛡️ Convivencia y Conducta (Prof. Guía)</div>
                  <div><b>Nota de Conducta:</b> <span style="font-weight:900;color:#6ee7b7;">${condActual.notaConducta} / 100</span></div>
                  <div><b>Puntos Rebajados:</b> -${condActual.totalRebajo} pts (${(estActual.boletas||[]).length} boletas)</div>
                  <div><b>Estado Convivencia:</b> ${condActual.estadoConducta}</div>
                </div>
              </div>
            </div>
          `}
        </div>
      `;

      document.getElementById('sea-btn-close').onclick = () => modal.remove();
      document.getElementById('tab-v-notas').onclick = () => { vistaActiva = 'notas'; render(); };
      document.getElementById('tab-v-conducta').onclick = () => { vistaActiva = 'conducta'; render(); };
      document.getElementById('tab-v-exp').onclick = () => { vistaActiva = 'expediente'; render(); };

      document.getElementById('sel-rol-rbac').onchange = (e) => { rolDocente = e.target.value; render(); };
      document.getElementById('sel-sec-filtro').onchange = (e) => { seccionFiltro = e.target.value; render(); };
      document.getElementById('sel-mat-filtro').onchange = (e) => { materiaActiva = e.target.value; render(); };
      document.getElementById('inp-bus-exp').oninput = (e) => { busquedaExp = e.target.value; render(); };

      document.querySelectorAll('.sea-inp').forEach(inp => {
        inp.onchange = (e) => {
          const idx = parseInt(inp.getAttribute('data-idx'), 10);
          const f = inp.getAttribute('data-f');
          db[idx][f] = Math.min(100, Math.max(0, Number(e.target.value) || 0));
          guardarDB(db);
          render();
        };
      });

      document.querySelectorAll('.btn-ver-exp').forEach(btn => {
        btn.onclick = () => {
          estSeleccionadoIdx = parseInt(btn.getAttribute('data-idx'), 10);
          vistaActiva = 'expediente';
          render();
        };
      });

      const selBolEst = document.getElementById('bol-est-idx');
      if (selBolEst) {
        selBolEst.onchange = (e) => {
          estSeleccionadoIdx = parseInt(e.target.value, 10);
          render();
        };
      }

      const selFaltaCod = document.getElementById('bol-falta-cod');
      if (selFaltaCod) {
        selFaltaCod.onchange = (e) => {
          const falta = CATALOGO_FALTAS_REAC[parseInt(e.target.value, 10)];
          if (falta) {
            document.getElementById('bol-pts').value = falta.puntos;
            document.getElementById('bol-violencia').checked = falta.puntos >= 20;
          }
        };
      }

      const btnAplicar = document.getElementById('btn-aplicar-boleta');
      if (btnAplicar) {
        btnAplicar.onclick = () => {
          const falta = CATALOGO_FALTAS_REAC[parseInt(document.getElementById('bol-falta-cod').value, 10)];
          const pts = Math.min(45, Math.max(1, Number(document.getElementById('bol-pts').value) || falta.puntos));
          const mot = document.getElementById('bol-motivo').value.trim() || falta.desc;
          const esViolencia = document.getElementById('bol-violencia').checked;

          if (!db[estSeleccionadoIdx].boletas) db[estSeleccionadoIdx].boletas = [];
          db[estSeleccionadoIdx].boletas.push({
            fecha: new Date().toISOString().slice(0, 10),
            codigo: falta.codigo,
            motivo: mot,
            rebajo: rolDocente === 'Materia' ? 0 : pts,
            estado: rolDocente === 'Materia' ? ('Pendiente aval Prof. Guía (-' + pts + ' pts sugeridos)') : 'Aplicada en firme por Profesor Guía',
            protocoloViolencia: esViolencia
          });
          guardarDB(db);
          render();
        };
      }

      document.querySelectorAll('.btn-del-bol').forEach(btn => {
        btn.onclick = () => {
          const bi = parseInt(btn.getAttribute('data-bi'), 10);
          db[estSeleccionadoIdx].boletas.splice(bi, 1);
          guardarDB(db);
          render();
        };
      });

      const expSel = document.getElementById('exp-sel-est');
      if (expSel) {
        expSel.onchange = (e) => {
          estSeleccionadoIdx = parseInt(e.target.value, 10);
          render();
        };
      }

      // Exportar CSV Oficial SEA-MEP incluyendo Conducta, Boletas y Profesor Guía
      document.getElementById('sea-btn-export').onclick = () => {
        const header = "Identificacion;Estudiante;Seccion;Profesor_Guia;Adecuacion;Cotidiano;Tareas;Pruebas;Proyecto;Asistencia;Nota_Academica_SEA;Condicion_Academica;Puntos_Rebajados_Boletas;Nota_Conducta_Final;Alerta_Protocolo_Violencia\n";
        const rows = db.map(est => {
          const m = calcularAcademico(est, pesos);
          const c = calcularConducta(est);
          return `${est.id};"${est.nombre}";${est.seccion};"${est.profesorGuia}";"${est.adecuacion}";${est.cotidiano};${est.tareas};${est.pruebas};${est.proyecto};${est.asistencia};${m.notaRedondeada};${m.condicion};-${c.totalRebajo};${c.notaConducta};${c.tieneAlertaViolencia ? 'SI_PAUSA_ACTIVA' : 'NO'}`;
        }).join("\n");
        const blob = new Blob(["\uFEFF" + header + rows], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "SEA_MEP_Notas_Conducta_Boletas_2026.csv";
        a.click();
      };

      // Importar CSV
      document.getElementById('sea-file-in').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const lines = ev.target.result.split(/\r?\n/).filter(l => l.trim().length > 0);
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
                profesorGuia: 'Prof. Guía ' + (cols[2] || '11-1'),
                adecuacion: 'Ninguna (DUA)',
                encargado: 'Registrado en Expediente',
                materias: ['Programación 11°', 'Redes y Subneteo', 'Diseño de Software 12°'],
                cotidiano: Number(cols[3]) || 85,
                tareas: Number(cols[4]) || 90,
                pruebas: Number(cols[5]) || 80,
                proyecto: Number(cols[6]) || 85,
                asistencia: Number(cols[7]) || 95,
                conductaBase: 100,
                boletas: []
              });
            }
          }
          if (nuevos.length > 0) {
            db = nuevos;
            guardarDB(db);
            render();
          }
        };
        reader.readAsText(file, 'UTF-8');
      };
    }

    document.body.appendChild(modal);
    render();
  };

  function acoplarBotonSea() {
    const bar = document.getElementById('bds-soberana-bar');
    if (bar && !document.getElementById('bds-btn-sea')) {
      const btn = document.createElement('button');
      btn.id = 'bds-btn-sea';
      btn.style.cssText = 'background:#059669;color:#ffffff;border:none;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;';
      btn.innerHTML = '⚖️ SEA-MEP: Notas, Conducta & Expedientes';
      btn.onclick = () => window.abrirGestorSeaMep();
      bar.insertBefore(btn, bar.firstChild.nextSibling);
    }
  }

  setInterval(acoplarBotonSea, 500);
})();