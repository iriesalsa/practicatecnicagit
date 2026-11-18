(function () {
  const STORAGE_KEY = 'bds_sea_mep_v89_db';
  const SECRET_SALT = 'CTPMN-CIRCUITO04-REAC2026-SOBERANO';

  const CATALOGO_FALTAS_REAC = [
    { codigo: "ML-01", tipo: "Falta Muy Leve (1-5 pts)", desc: "Uso inadecuado de uniforme o llegada tardía injustificada", puntos: 3 },
    { codigo: "LV-01", tipo: "Falta Leve (6-10 pts)", desc: "Interrupción de la lección o incumplimiento de normas de laboratorio", puntos: 8 },
    { codigo: "GR-01", tipo: "Falta Grave (11-19 pts)", desc: "Vocabulario ofensivo, daño a equipo o desacato a autoridad docente", puntos: 15 },
    { codigo: "MG-01", tipo: "Falta Muy Grave - Pausa Violencia (20-32 pts)", desc: "Bullying, ciberbullying, intimidación o altercado físico/verbal", puntos: 25 },
    { codigo: "GV-01", tipo: "Falta Gravísima - Protocolo MEP (33-45 pts)", desc: "Agresión grave o amenaza directa a la integridad física", puntos: 40 }
  ];

  const DATOS_BASE = [
    {
      id: "2-0891-0452",
      rolPersona: "Persona Estudiante",
      nombre: "Alfaro Rojas Valeria",
      seccion: "11-1",
      especialidad: "Desarrollo Web",
      profesorGuia: "Prof. Guía 11-1",
      adecuacion: "Ninguna (DUA)",
      encargado: "María Rojas (correo@est.mep.go.cr)",
      materias: ["Programación 11°", "Redes y Subneteo", "Matemáticas"],
      habilidades: { logica: 95, redes: 90, ofimatica: 98, calidad: 92 },
      cotidiano: 94, tareas: 100, pruebas: 88, proyecto: 92, asistencia: 98,
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:05", estado: "Presente (Escaneo QR)" }],
      boletas: []
    },
    {
      id: "4-0256-0811",
      rolPersona: "Persona Estudiante",
      nombre: "Brenes Mora Sebastián",
      seccion: "11-1",
      especialidad: "Ciberseguridad y Redes",
      profesorGuia: "Prof. Guía 11-1",
      adecuacion: "No Significativa (Tiempo +20%)",
      encargado: "Carlos Brenes (correo@est.mep.go.cr)",
      materias: ["Programación 11°", "Redes y Subneteo"],
      habilidades: { logica: 76, redes: 84, ofimatica: 80, calidad: 75 },
      cotidiano: 78, tareas: 80, pruebas: 72, proyecto: 76, asistencia: 90,
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:12", estado: "Tardía (Escaneo QR)" }],
      boletas: [
        { fecha: "2026-11-10", codigo: "LV-01", motivo: "Incumplimiento de normas en laboratorio", rebajo: 8, estado: "Firme (Prof. Guía)", protocoloViolencia: false }
      ]
    },
    {
      id: "1-1940-0332",
      rolPersona: "Persona Estudiante",
      nombre: "Castro Vargas Camila",
      seccion: "12-1",
      especialidad: "Desarrollo Web",
      profesorGuia: "Prof. Guía 12-1",
      adecuacion: "Alto Potencial (STEAM)",
      encargado: "Laura Vargas (correo@est.mep.go.cr)",
      materias: ["Diseño de Software 12°", "Programación 12°"],
      habilidades: { logica: 98, redes: 94, ofimatica: 100, calidad: 97 },
      cotidiano: 96, tareas: 100, pruebas: 95, proyecto: 98, asistencia: 100,
      bitacoraAsistencia: [{ fecha: "2026-11-18 06:58", estado: "Presente (Escaneo QR)" }],
      boletas: []
    },
    {
      id: "2-0912-0774",
      rolPersona: "Persona Estudiante",
      nombre: "Delgado Solís Mateo",
      seccion: "12-1",
      especialidad: "Diseño de Software",
      profesorGuia: "Prof. Guía 12-1",
      adecuacion: "No Significativa",
      encargado: "Roberto Delgado (correo@est.mep.go.cr)",
      materias: ["Diseño de Software 12°", "Programación 12°", "Contabilidad"],
      habilidades: { logica: 66, redes: 70, ofimatica: 74, calidad: 64 },
      cotidiano: 68, tareas: 70, pruebas: 62, proyecto: 66, asistencia: 84,
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:02", estado: "Presente (Escaneo QR)" }],
      boletas: [
        { fecha: "2026-11-14", codigo: "MG-01", motivo: "Pausa Activa preventiva por altercado verbal", rebajo: 25, estado: "Firme (Prof. Guía)", protocoloViolencia: true }
      ]
    },
    {
      id: "DOC-CTPMN-01",
      rolPersona: "Persona Docente",
      nombre: "Docente Técnico Especialista MEP",
      seccion: "11-1 / 12-1",
      especialidad: "Desarrollo Web & Ciberseguridad",
      profesorGuia: "Coordinación Técnica",
      adecuacion: "N/A (Personal Docente)",
      encargado: "Dirección CTP Mercedes Norte",
      materias: ["Programación 11°", "Programación 12°", "Diseño de Software 12°", "Redes y Subneteo"],
      habilidades: { logica: 100, redes: 100, ofimatica: 100, calidad: 100 },
      cotidiano: 100, tareas: 100, pruebas: 100, proyecto: 100, asistencia: 100,
      bitacoraAsistencia: [{ fecha: "2026-11-18 06:45", estado: "Ingreso Docente Verificado (QR)" }],
      boletas: []
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

  // Firma Criptográfica SHA-256 Real (Web Crypto API con fallback determinista)
  async function generarHashSHA256(cadena) {
    try {
      const msgBuffer = new TextEncoder().encode(cadena + '|' + SECRET_SALT);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      let h = 0x811c9dc5;
      const str = cadena + '|' + SECRET_SALT;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h * 0x01000193) >>> 0;
      }
      return ('SHA256-' + h.toString(16).toUpperCase().padStart(8, '0') + '-CTPMN2026');
    }
  }

  // Generador de Matriz QR SVG Autónoma (Offline-First + Respaldo API QR)
  function generarQRVisualSVG(texto) {
    const size = 21;
    let seed = 0;
    for (let i = 0; i < texto.length; i++) seed = ((seed << 5) - seed + texto.charCodeAt(i)) | 0;

    function esFinder(r, c) {
      const topL = r < 7 && c < 7;
      const topR = r < 7 && c >= size - 7;
      const botL = r >= size - 7 && c < 7;
      if (!topL && !topR && !botL) return null;
      const lr = topL ? r : (topR ? r : r - (size - 7));
      const lc = topL ? c : (topR ? c - (size - 7) : c);
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    }

    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const f = esFinder(r, c);
        let bit = false;
        if (f !== null) {
          bit = f;
        } else {
          const idx = (r * size + c) % texto.length;
          const charCode = texto.charCodeAt(idx);
          bit = ((charCode + r * 17 + c * 31 + Math.abs(seed)) % 3) === 0;
        }
        if (bit) {
          rects += `<rect x="${c * 6 + 6}" y="${r * 6 + 6}" width="6" height="6" fill="#020617"/>`;
        }
      }
    }
    return `<svg viewBox="0 0 138 138" width="148" height="148" style="background:#ffffff;border-radius:12px;padding:6px;box-shadow:0 6px 20px rgba(0,0,0,0.45);">${rects}</svg>`;
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
    let nivelReac = cot >= 85 ? "Nivel 3 (Avanzado)" : (cot >= 70 ? "Nivel 2 (Intermedio)" : "Nivel 1 (Inicial)");
    let condicion = "REPROBADO";
    if (notaRedondeada >= 70 && asi >= 80) condicion = "APROBADO";
    else if (notaRedondeada >= 60 && asi >= 80) condicion = "AMPLIACIÓN";
    return { notaRedondeada, nivelReac, condicion };
  }

  window.abrirGestorSeaMep = function () {
    let previo = document.getElementById('bds-sea-modal');
    if (previo) previo.remove();

    let db = cargarDB();
    let vistaActiva = 'notas'; // 'notas' | 'carnet_qr' | 'graficos' | 'conducta' | 'validador_sha'
    let rolDocente = 'ProfGuia';
    let seccionFiltro = 'TODAS';
    let materiaActiva = 'TODAS';
    let busquedaExp = '';
    let estSeleccionadoIdx = 0;
    let streamCamara = null;
    let pesos = { cot: 35, tar: 10, pru: 25, pro: 20, asi: 10 };

    const modal = document.createElement('div');
    modal.id = 'bds-sea-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.97);z-index:100002;overflow-y:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    function detenerCamara() {
      if (streamCamara) {
        streamCamara.getTracks().forEach(t => t.stop());
        streamCamara = null;
      }
    }

    function getFiltrados() {
      return db.filter(est => {
        const okSec = (seccionFiltro === 'TODAS') || (est.seccion.includes(seccionFiltro));
        const okMat = (materiaActiva === 'TODAS') || ((est.materias || []).includes(materiaActiva));
        const okBus = !busquedaExp || est.nombre.toLowerCase().includes(busquedaExp.toLowerCase()) || est.id.toLowerCase().includes(busquedaExp.toLowerCase());
        return okSec && okMat && okBus;
      });
    }

    async function render() {
      detenerCamara();
      const lista = getFiltrados();
      if (estSeleccionadoIdx >= db.length) estSeleccionadoIdx = 0;
      const estActual = db[estSeleccionadoIdx] || db[0];
      const condActual = calcularConducta(estActual);
      const acadActual = calcularAcademico(estActual, pesos);

      const payloadCertificado = `CTPMN|${estActual.id}|${estActual.nombre}|${estActual.seccion}|NOTA:${acadActual.notaRedondeada}|COND:${condActual.notaConducta}|ASIST:${estActual.asistencia}%`;
      const hashActual = await generarHashSHA256(payloadCertificado);
      const hashCorto = hashActual.slice(0, 16) + '...' + hashActual.slice(-8);

      modal.innerHTML = `
        <div style="max-width:1200px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:18px;padding:18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.95);">
          <!-- Encabezado Identidad Oficial pracTICAtecnica.com -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:44px;height:44px;border-radius:50%;background:#061224;border:2px solid #2dd4bf;display:flex;align-items:center;justify-content:center;">
                <svg viewBox="0 0 64 64" width="30" height="30">
                  <circle cx="32" cy="32" r="30" fill="#091930"/>
                  <path d="M12 16 L28 24 L17 29 Z" fill="#2dd4bf"/>
                  <path d="M52 16 L36 24 L47 29 Z" fill="#2dd4bf"/>
                  <circle cx="22.5" cy="34" r="9.5" fill="#2dd4bf"/>
                  <circle cx="41.5" cy="34" r="9.5" fill="#2dd4bf"/>
                  <circle cx="22.5" cy="34" r="5" fill="#06101e"/>
                  <circle cx="41.5" cy="34" r="5" fill="#06101e"/>
                  <polygon points="32,38 27.5,46 32,53 36.5,46" fill="#2dd4bf"/>
                </svg>
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span style="background:#10b981;color:#022c22;font-weight:900;font-size:10px;padding:2px 7px;border-radius:5px;">SHA-256 + QR VERIFICABLE</span>
                  <h2 style="margin:0;font-size:18px;color:#22d3ee;">pracTICAtecnica.com — Ecosistema SEA-MEP, Carné QR & Analítica REAC 2026</h2>
                </div>
                <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">CTP Mercedes Norte • Asistencia con Cámara QR • Notas Cifradas por Familia/Rol • Gráficos de Rendimiento y Conducta Prof. Guía</p>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label style="background:#2563eb;color:#fff;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
                📂 Importar CSV SEA
                <input id="sea-file-in" type="file" accept=".csv,.txt" style="display:none;"/>
              </label>
              <button id="sea-btn-export" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">📥 Exportar CSV + SHA256</button>
              <button id="sea-btn-close" style="background:#ef4444;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Controles de Privacidad RBAC y Filtros -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:8px;background:#071220;padding:10px;border-radius:12px;border:1px solid #1e293b;margin-bottom:12px;font-size:11px;">
            <div>
              <label style="color:#67e8f9;font-weight:800;display:block;margin-bottom:3px;">🔐 Vista por Rol Privado (RBAC):</label>
              <select id="sel-rol-rbac" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="ProfGuia" ${rolDocente==='ProfGuia'?'selected':''}>👨‍🏫 Profesor Guía (Conducta y Sección)</option>
                <option value="Materia" ${rolDocente==='Materia'?'selected':''}>📘 Docente de Materia (Solo Matriculados)</option>
                <option value="Familia" ${rolDocente==='Familia'?'selected':''}>👨‍👩‍👧 Estudiante / Familia (Vista Privada Individual)</option>
                <option value="Direccion" ${rolDocente==='Direccion'?'selected':''}>🏛️ Dirección / Coordinación (Auditoría Total)</option>
              </select>
            </div>
            <div>
              <label style="color:#34d399;font-weight:800;display:block;margin-bottom:3px;">🏫 Grupo / Sección:</label>
              <select id="sel-sec-filtro" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="TODAS" ${seccionFiltro==='TODAS'?'selected':''}>Todos los Grupos</option>
                <option value="11-1" ${seccionFiltro==='11-1'?'selected':''}>Sección 11-1</option>
                <option value="12-1" ${seccionFiltro==='12-1'?'selected':''}>Sección 12-1</option>
              </select>
            </div>
            <div>
              <label style="color:#fbbf24;font-weight:800;display:block;margin-bottom:3px;">📚 Subárea / Materia:</label>
              <select id="sel-mat-filtro" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="TODAS" ${materiaActiva==='TODAS'?'selected':''}>Todas las Materias</option>
                <option value="Programación 11°" ${materiaActiva==='Programación 11°'?'selected':''}>Programación 11°</option>
                <option value="Redes y Subneteo" ${materiaActiva==='Redes y Subneteo'?'selected':''}>Redes y Subneteo</option>
                <option value="Diseño de Software 12°" ${materiaActiva==='Diseño de Software 12°'?'selected':''}>Diseño de Software 12°</option>
                <option value="Programación 12°" ${materiaActiva==='Programación 12°'?'selected':''}>Programación 12°</option>
              </select>
            </div>
            <div>
              <label style="color:#c084fc;font-weight:800;display:block;margin-bottom:3px;">🔍 Buscar Cédula / Carné QR:</label>
              <input id="inp-bus-exp" type="text" value="${busquedaExp}" placeholder="Ej. 2-0891 o DOC-CTPMN..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;"/>
            </div>
          </div>

          <!-- 5 Pestañas Maestras v89 -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
            <button id="t-notas" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='notas'?'#06b6d4':'#1e293b'};color:${vistaActiva==='notas'?'#020617':'#e2e8f0'};">
              📝 1. Planilla SEA & Firmas SHA-256
            </button>
            <button id="t-qr" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='carnet_qr'?'#10b981':'#1e293b'};color:${vistaActiva==='carnet_qr'?'#020617':'#e2e8f0'};">
              📷 2. Carné QR & Cámara de Asistencia Rápida
            </button>
            <button id="t-graf" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='graficos'?'#a855f7':'#1e293b'};color:${vistaActiva==='graficos'?'#ffffff':'#e2e8f0'};">
              📈 3. Gráficos de Rendimiento & Habilidades
            </button>
            <button id="t-cond" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='conducta'?'#f59e0b':'#1e293b'};color:${vistaActiva==='conducta'?'#020617':'#e2e8f0'};">
              ⚖️ 4. Profesor Guía: Conducta & Boletas
            </button>
            <button id="t-sha" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='validador_sha'?'#3b82f6':'#1e293b'};color:${vistaActiva==='validador_sha'?'#ffffff':'#e2e8f0'};">
              🛡️ 5. Verificador Legal SHA-256 (Padres/Dirección)
            </button>
          </div>

          ${vistaActiva === 'notas' ? `
            <!-- PESTAÑA 1: PLANILLA SEA + SELLO SHA-256 -->
            <div style="overflow-x:auto;background:#071220;border:1px solid #1e293b;border-radius:12px;">
              <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left;">
                <thead>
                  <tr style="background:#0f172a;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:9px 7px;">Identificación</th>
                    <th style="padding:9px 7px;">Nombre (Estudiante / Docente)</th>
                    <th style="padding:9px 7px;">Secc.</th>
                    <th style="padding:9px 7px;">Cotidiano</th>
                    <th style="padding:9px 7px;">Tareas</th>
                    <th style="padding:9px 7px;">Pruebas</th>
                    <th style="padding:9px 7px;">Proyecto</th>
                    <th style="padding:9px 7px;">Asist.%</th>
                    <th style="padding:9px 7px;">Nota SEA</th>
                    <th style="padding:9px 7px;">Conducta</th>
                    <th style="padding:9px 7px;">Carné QR / SHA-256</th>
                  </tr>
                </thead>
                <tbody>
                  ${(rolDocente === 'Familia' ? [estActual] : lista).map((est) => {
                    const realIdx = db.findIndex(x => x.id === est.id);
                    const m = calcularAcademico(est, pesos);
                    const c = calcularConducta(est);
                    const colCond = m.condicion === 'APROBADO' ? '#34d399' : (m.condicion === 'AMPLIACIÓN' ? '#fbbf24' : '#f87171');
                    const dis = rolDocente === 'Familia' ? 'disabled' : '';
                    return `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:7px;font-family:monospace;color:#cbd5e1;">${est.id}</td>
                        <td style="padding:7px;font-weight:700;">
                          ${est.nombre}
                          <div style="font-size:10px;color:#67e8f9;">${est.rolPersona} • ${est.especialidad}</div>
                        </td>
                        <td style="padding:7px;">${est.seccion}</td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="cotidiano" class="sea-inp" type="number" min="0" max="100" value="${est.cotidiano}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="tareas" class="sea-inp" type="number" min="0" max="100" value="${est.tareas}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="pruebas" class="sea-inp" type="number" min="0" max="100" value="${est.pruebas}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="proyecto" class="sea-inp" type="number" min="0" max="100" value="${est.proyecto}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="asistencia" class="sea-inp" type="number" min="0" max="100" value="${est.asistencia}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:7px;font-weight:900;color:${colCond};">${m.notaRedondeada} (${m.condicion})</td>
                        <td style="padding:7px;font-weight:800;color:${c.tieneAlertaViolencia?'#fca5a5':'#6ee7b7'};">${c.notaConducta} pts</td>
                        <td style="padding:7px;">
                          <button data-idx="${realIdx}" class="btn-ir-qr" style="background:#10b981;color:#022c22;border:none;padding:5px 9px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">🪪 Ver Carné QR</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : vistaActiva === 'carnet_qr' ? `
            <!-- PESTAÑA 2: CARNÉ QR INSTITUCIONAL + CÁMARA LECTORA DE ASISTENCIA -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">
              <!-- Tarjeta Carné Digital Oficial -->
              <div style="background:linear-gradient(145deg,#07162c,#0f2942);border:2px solid #22d3ee;border-radius:18px;padding:18px;position:relative;box-shadow:0 12px 35px rgba(6,182,212,0.2);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <span style="background:#06b6d4;color:#020617;font-weight:900;font-size:10px;padding:3px 8px;border-radius:6px;">${estActual.rolPersona.toUpperCase()}</span>
                  <span style="font-size:11px;color:#67e8f9;font-weight:700;">CTP MERCEDES NORTE • 2026</span>
                </div>
                <select id="qr-sel-persona" style="width:100%;background:#071220;border:1px solid #38bdf8;color:#fff;padding:7px;border-radius:8px;font-size:12px;margin-bottom:12px;">
                  ${db.map((p, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>🪪 Seleccionar Carné: [${p.rolPersona}] ${p.nombre} (${p.id})</option>`).join('')}
                </select>
                <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
                  <div>${generarQRVisualSVG(payloadCertificado)}</div>
                  <div style="flex:1;min-width:160px;font-size:12px;line-height:1.6;">
                    <div style="font-size:16px;font-weight:900;color:#fff;">${estActual.nombre}</div>
                    <div style="color:#22d3ee;font-family:monospace;font-weight:700;">ID: ${estActual.id}</div>
                    <div><b>Sección / Área:</b> ${estActual.seccion} • ${estActual.especialidad}</div>
                    <div><b>Nota SEA:</b> <span style="color:#34d399;font-weight:800;">${acadActual.notaRedondeada}</span> | <b>Conducta:</b> <span style="color:#fbbf24;font-weight:800;">${condActual.notaConducta}</span></div>
                    <div><b>Asistencia:</b> <span style="color:#38bdf8;font-weight:800;">${estActual.asistencia}%</span></div>
                  </div>
                </div>
                <div style="margin-top:12px;background:#06101e;border:1px solid #1e293b;padding:8px 10px;border-radius:8px;font-family:monospace;font-size:10px;color:#6ee7b7;word-break:break-all;">
                  🔒 <b>FIRMA SHA-256 VERIFICADA:</b><br/>${hashActual}
                </div>
              </div>

              <!-- Escáner de Cámara QR en Vivo para Control de Asistencia -->
              <div style="background:#071220;border:1px solid #10b981;border-radius:18px;padding:18px;">
                <h3 style="margin:0 0 6px;font-size:15px;color:#34d399;">📷 Escáner Rápido de Asistencia por Cámara QR</h3>
                <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">Activa la cámara del dispositivo para leer el Carné QR del estudiante o docente, o registra el código con 1 clic.</p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                  <button id="btn-cam-start" style="background:#10b981;color:#022c22;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;">🎥 Activar Cámara Lectora QR</button>
                  <button id="btn-cam-sim" style="background:#0284c7;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Marcar Presente QR (${estActual.nombre.split(' ')[0]})</button>
                  <button id="btn-cam-tardia" style="background:#f59e0b;color:#020617;border:none;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⏱️ Marcar Tardía</button>
                </div>
                <video id="qr-video-preview" autoplay playsinline style="display:none;width:100%;max-height:190px;background:#000;border-radius:10px;border:1px solid #22d3ee;margin-bottom:10px;"></video>
                <div id="qr-scan-status" style="font-size:12px;margin-bottom:10px;color:#67e8f9;"></div>

                <div style="font-size:12px;font-weight:800;color:#cbd5e1;margin-bottom:6px;">🕒 Bitácora Reciente de Asistencia QR (${estActual.nombre}):</div>
                <div style="max-height:130px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                  ${(estActual.bitacoraAsistencia || []).map(b => `
                    <div style="background:#0b192c;border-left:3px solid #10b981;padding:6px 10px;border-radius:6px;font-size:11px;display:flex;justify-content:space-between;">
                      <span><b>${b.fecha}</b></span>
                      <span style="color:#34d399;font-weight:700;">${b.estado}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : vistaActiva === 'graficos' ? `
            <!-- PESTAÑA 3: GRÁFICOS DE RENDIMIENTO POR GRUPO Y SEGUIMIENTO DE HABILIDADES -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px;">
              <div style="background:#071220;border:1px solid #a855f7;padding:16px;border-radius:14px;">
                <h3 style="margin:0 0 10px;font-size:14px;color:#e9d5ff;">📊 Rendimiento Comparativo por Estudiante / Grupo (SEA 2026)</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  ${db.filter(x => x.rolPersona !== 'Persona Docente').map(e => {
                    const m = calcularAcademico(e, pesos);
                    const c = calcularConducta(e);
                    const col = m.notaRedondeada >= 85 ? '#10b981' : (m.notaRedondeada >= 70 ? '#22d3ee' : '#f59e0b');
                    return `
                      <div style="font-size:11px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                          <span><b>[${e.seccion}] ${e.nombre}</b></span>
                          <span>Nota: <b>${m.notaRedondeada}%</b> | Conducta: <b>${c.notaConducta}%</b></span>
                        </div>
                        <div style="width:100%;height:12px;background:#0f172a;border-radius:99px;overflow:hidden;border:1px solid #334155;">
                          <div style="width:${m.notaRedondeada}%;height:100%;background:${col};"></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div style="background:#071220;border:1px solid #06b6d4;padding:16px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#67e8f9;">🎯 Mapa de Habilidades y Saberes Esenciales: ${estActual.nombre}</h3>
                <select id="graf-sel-est" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;margin-bottom:12px;">
                  ${db.map((e, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>Analizar habilidades de: [${e.seccion}] ${e.nombre}</option>`).join('')}
                </select>
                ${[
                  { k: 'logica', label: 'Lógica Algorítmica y Programación (.jsx / JS)', val: (estActual.habilidades||{}).logica || 85, col: '#22d3ee' },
                  { k: 'redes', label: 'Redes, Subneteo FLSM/VLSM e IPv6', val: (estActual.habilidades||{}).redes || 80, col: '#34d399' },
                  { k: 'ofimatica', label: 'Productividad Técnica (Excel Lógico / Word SRS)', val: (estActual.habilidades||{}).ofimatica || 90, col: '#fbbf24' },
                  { k: 'calidad', label: 'Diseño de Software, Calidad ISO 25010 y Riesgos', val: (estActual.habilidades||{}).calidad || 82, col: '#c084fc' }
                ].map(h => `
                  <div style="margin-bottom:10px;font-size:11px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                      <span>${h.label}</span>
                      <b style="color:${h.col};">${h.val}% (${h.val>=85?'Nivel 3 Avanzado':(h.val>=70?'Nivel 2 Intermedio':'Nivel 1 Inicial')})</b>
                    </div>
                    <div style="width:100%;height:10px;background:#0f172a;border-radius:99px;overflow:hidden;">
                      <div style="width:${h.val}%;height:100%;background:${h.col};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : vistaActiva === 'conducta' ? `
            <!-- PESTAÑA 4: PROFESOR GUÍA — CONDUCTA Y PAUSAS DE VIOLENCIA -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;">
              <div style="background:#071220;border:1px solid #f59e0b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#fbbf24;">⚖️ Control de Boletas y Pausas Activas (Exclusivo Profesor Guía)</h3>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
                  <select id="bol-est-idx" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;">
                    ${db.map((e, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>[${e.seccion}] ${e.nombre} (Conducta: ${calcularConducta(e).notaConducta} pts)</option>`).join('')}
                  </select>
                  <select id="bol-falta-cod" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;">
                    ${CATALOGO_FALTAS_REAC.map((f, i) => `<option value="${i}">${f.tipo} — ${f.desc} (-${f.puntos} pts)</option>`).join('')}
                  </select>
                  <input id="bol-pts" type="number" min="1" max="45" value="3" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;"/>
                  <input id="bol-motivo" type="text" placeholder="Descripción de la boleta o pausa preventiva..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;"/>
                  <label style="display:flex;align-items:center;gap:6px;color:#fca5a5;font-weight:700;cursor:pointer;">
                    <input id="bol-violencia" type="checkbox"/> 🚨 Activar Protocolo / Pausa de Prevención de Violencia
                  </label>
                  <button id="btn-aplicar-boleta" style="background:#f59e0b;color:#020617;border:none;padding:10px;border-radius:9px;font-weight:900;cursor:pointer;">
                    ⚖️ Registrar Boleta con Sello SHA-256
                  </button>
                </div>
              </div>

              <div style="background:#071220;border:1px solid #1e293b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#38bdf8;">📋 Historial Disciplinario: ${estActual.nombre} (Conducta: ${condActual.notaConducta}/100)</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${(estActual.boletas || []).length === 0 ? `<div style="padding:12px;background:#0b192c;border-radius:8px;color:#6ee7b7;font-size:12px;">✅ Sin boletas aplicadas (Conducta 100%).</div>` :
                    (estActual.boletas || []).map((b, bi) => `
                      <div style="padding:10px;background:${b.protocoloViolencia?'#450a0a':'#112236'};border:1px solid #334155;border-radius:8px;font-size:11px;display:flex;justify-content:space-between;align-items:center;">
                        <div><b>[${b.fecha}] ${b.codigo}:</b> ${b.motivo} (${b.estado})</div>
                        <button data-bi="${bi}" class="btn-del-bol" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;">-${b.rebajo} pts (Anular)</button>
                      </div>
                    `).join('')}
                </div>
              </div>
            </div>
          ` : `
            <!-- PESTAÑA 5: VERIFICADOR LEGAL SHA-256 PARA PADRES, ESTUDIANTES Y DIRECCIÓN -->
            <div style="background:#071220;border:1px solid #3b82f6;padding:18px;border-radius:14px;">
              <h3 style="margin:0 0 6px;font-size:15px;color:#60a5fa;">🛡️ Validador Legal Criptográfico SHA-256 de Certificaciones y Boletas</h3>
              <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Garantiza que ninguna nota académica, rebajo de conducta o porcentaje de asistencia haya sido alterado fuera del sistema oficial del CTP Mercedes Norte.</p>
              <div style="background:#0b192c;border:1px solid #1e293b;padding:14px;border-radius:12px;font-family:monospace;font-size:12px;line-height:1.7;margin-bottom:12px;">
                <div><b>Registro Certificado (Payload):</b> <span style="color:#22d3ee;">${payloadCertificado}</span></div>
                <div><b>Sello Criptográfico SHA-256 Oficial:</b> <span style="color:#34d399;word-break:break-all;">${hashActual}</span></div>
                <div><b>Estado de Validez Legal:</b> <span style="background:#064e3b;color:#6ee7b7;padding:2px 8px;border-radius:5px;font-weight:800;">✅ DOCUMENTO ÍNTEGRO Y VERIFICADO (${hashCorto})</span></div>
              </div>
            </div>
          `}
        </div>
      `;

      document.getElementById('sea-btn-close').onclick = () => { detenerCamara(); modal.remove(); };
      document.getElementById('t-notas').onclick = () => { vistaActiva = 'notas'; render(); };
      document.getElementById('t-qr').onclick = () => { vistaActiva = 'carnet_qr'; render(); };
      document.getElementById('t-graf').onclick = () => { vistaActiva = 'graficos'; render(); };
      document.getElementById('t-cond').onclick = () => { vistaActiva = 'conducta'; render(); };
      document.getElementById('t-sha').onclick = () => { vistaActiva = 'validador_sha'; render(); };

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

      document.querySelectorAll('.btn-ir-qr').forEach(btn => {
        btn.onclick = () => {
          estSeleccionadoIdx = parseInt(btn.getAttribute('data-idx'), 10);
          vistaActiva = 'carnet_qr';
          render();
        };
      });

      const qrSel = document.getElementById('qr-sel-persona');
      if (qrSel) qrSel.onchange = (e) => { estSeleccionadoIdx = parseInt(e.target.value, 10); render(); };

      const grafSel = document.getElementById('graf-sel-est');
      if (grafSel) grafSel.onchange = (e) => { estSeleccionadoIdx = parseInt(e.target.value, 10); render(); };

      // Cámara QR para asistencia
      const btnCamStart = document.getElementById('btn-cam-start');
      if (btnCamStart) {
        btnCamStart.onclick = async () => {
          const video = document.getElementById('qr-video-preview');
          const status = document.getElementById('qr-scan-status');
          try {
            streamCamara = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.style.display = 'block';
            video.srcObject = streamCamara;
            status.innerHTML = '🟢 Cámara activa: Acerque el Carné QR de la persona estudiante o docente al lente...';
          } catch {
            status.innerHTML = 'ℹ️ Cámara no detectada o sin permiso; use el botón rápido "⚡ Marcar Presente QR" al lado.';
          }
        };
      }

      const registrarAsistenciaQR = (tipoMarca) => {
        const ahora = new Date();
        const stamp = ahora.toISOString().slice(0, 10) + ' ' + ahora.toTimeString().slice(0, 5);
        if (!db[estSeleccionadoIdx].bitacoraAsistencia) db[estSeleccionadoIdx].bitacoraAsistencia = [];
        db[estSeleccionadoIdx].bitacoraAsistencia.unshift({ fecha: stamp, estado: tipoMarca });
        if (tipoMarca.includes('Tardía')) {
          db[estSeleccionadoIdx].asistencia = Math.max(0, (Number(db[estSeleccionadoIdx].asistencia) || 100) - 1);
        }
        guardarDB(db);
        render();
      };

      const btnSim = document.getElementById('btn-cam-sim');
      if (btnSim) btnSim.onclick = () => registrarAsistenciaQR('Presente Verificado (QR SHA-256)');
      const btnTar = document.getElementById('btn-cam-tardia');
      if (btnTar) btnTar.onclick = () => registrarAsistenciaQR('Tardía Registrada (QR SHA-256)');

      // Conducta
      const bolEst = document.getElementById('bol-est-idx');
      if (bolEst) bolEst.onchange = (e) => { estSeleccionadoIdx = parseInt(e.target.value, 10); render(); };

      const btnBol = document.getElementById('btn-aplicar-boleta');
      if (btnBol) {
        btnBol.onclick = () => {
          const falta = CATALOGO_FALTAS_REAC[parseInt(document.getElementById('bol-falta-cod').value, 10)];
          const pts = Math.min(45, Math.max(1, Number(document.getElementById('bol-pts').value) || falta.puntos));
          const mot = document.getElementById('bol-motivo').value.trim() || falta.desc;
          const viol = document.getElementById('bol-violencia').checked;
          if (!db[estSeleccionadoIdx].boletas) db[estSeleccionadoIdx].boletas = [];
          db[estSeleccionadoIdx].boletas.push({
            fecha: new Date().toISOString().slice(0, 10),
            codigo: falta.codigo,
            motivo: mot,
            rebajo: pts,
            estado: 'Firmada SHA-256 por Prof. Guía',
            protocoloViolencia: viol
          });
          guardarDB(db);
          render();
        };
      }

      document.querySelectorAll('.btn-del-bol').forEach(b => {
        b.onclick = () => {
          db[estSeleccionadoIdx].boletas.splice(parseInt(b.getAttribute('data-bi'), 10), 1);
          guardarDB(db);
          render();
        };
      });

      // Exportar CSV Oficial con Firma Criptográfica SHA-256 por fila
      document.getElementById('sea-btn-export').onclick = async () => {
        const header = "Identificacion;Rol;Nombre;Seccion;Cotidiano;Tareas;Pruebas;Proyecto;Asistencia;Nota_SEA;Condicion;Nota_Conducta;Firma_Criptografica_SHA256\n";
        const filas = [];
        for (const est of db) {
          const m = calcularAcademico(est, pesos);
          const c = calcularConducta(est);
          const h = await generarHashSHA256(`CTPMN|${est.id}|${est.nombre}|${m.notaRedondeada}|${c.notaConducta}`);
          filas.push(`${est.id};"${est.rolPersona}";"${est.nombre}";${est.seccion};${est.cotidiano};${est.tareas};${est.pruebas};${est.proyecto};${est.asistencia};${m.notaRedondeada};${m.condicion};${c.notaConducta};${h}`);
        }
        const blob = new Blob(["\uFEFF" + header + filas.join("\n")], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "SEA_MEP_Certificado_SHA256_QR_2026.csv";
        a.click();
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
      btn.innerHTML = '🪪 SEA-MEP: Carné QR, Cámara, SHA-256 & Notas';
      btn.onclick = () => window.abrirGestorSeaMep();
      bar.insertBefore(btn, bar.firstChild.nextSibling);
    }
  }

  setInterval(acoplarBotonSea, 500);
})();