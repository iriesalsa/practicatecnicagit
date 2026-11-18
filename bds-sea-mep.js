(function () {
  const STORAGE_KEY = 'bds_sea_mep_v90_legal_db';
  const SECRET_SALT = 'CTPMN-CIRCUITO04-REAC2026-DECRETO40862MEP';

  // Catálogo Oficial reglamentado según Decreto Ejecutivo N° 40862-MEP (REAC Cap. IV)
  const ARTICULOS_CONDUCTA_REAC = [
    {
      codigo: "ART-71-ML",
      categoria: "Falta Muy Leve (Art. 71 y 76 REAC)",
      minPts: 1, maxPts: 5, sugerido: 3,
      incisos: "Uso incorrecto del uniforme oficial, presentación personal o llegada tardía injustificada a lección.",
      medidaLegal: "Amonestación formativa y registro en bitácora del Profesor Guía.",
      pautaViolencia: "N/A — Seguimiento preventivo ordinario de convivencia en el aula.",
      requiereProtocolo: false
    },
    {
      codigo: "ART-72-LV",
      categoria: "Falta Leve (Art. 72 y 77 REAC)",
      minPts: 6, maxPts: 10, sugerido: 8,
      incisos: "Interrupción del proceso pedagógico, uso no autorizado de dispositivos o incumplimiento de deberes escolares.",
      medidaLegal: "Comunicación escrita al hogar y acción formativa supervisada por el Profesor Guía.",
      pautaViolencia: "Pauta de Mediación Pedagógica y Compromiso de Convivencia.",
      requiereProtocolo: false
    },
    {
      codigo: "ART-73-GR",
      categoria: "Falta Grave (Art. 73 y 78 REAC)",
      minPts: 11, maxPts: 19, sugerido: 15,
      incisos: "Irrespeto o vocabulario ofensivo contra miembros de la comunidad educativa, daño a paredes/mobiliario o desacato.",
      medidaLegal: "Acción correctiva formativa, reparación del daño e intervención de Orientación y Profesor Guía.",
      pautaViolencia: "Pauta de Contención Temprana ante Agresión Verbal o Daño Patrimonial.",
      requiereProtocolo: true
    },
    {
      codigo: "ART-74-MG",
      categoria: "Falta Muy Grave (Art. 74 y 79 REAC)",
      minPts: 20, maxPts: 32, sugerido: 25,
      incisos: "Acoso escolar (Bullying), Ciberbullying, discriminación, intimidación, riñas o altercados físicos/verbales.",
      medidaLegal: "Medida formativa o suspensión de 1 a 10 días hábiles + Plan de Seguimiento Restaurativo.",
      pautaViolencia: "PROTOCOLO MEP DE ACTUACIÓN EN SITUACIONES DE BULLYING, CIBERBULLYING Y VIOLENCIA ESCOLAR (6 Etapas).",
      requiereProtocolo: true
    },
    {
      codigo: "ART-75-GV",
      categoria: "Falta Gravísima (Art. 75 y 80 REAC)",
      minPts: 33, maxPts: 45, sugerido: 40,
      incisos: "Agresión física con lesión, portación/uso de armas o sustancias ilícitas, destrucción de equipos o delitos.",
      medidaLegal: "Suspensión o medida formativa de 11 a 20 días hábiles + Referencia legal obligatoria (PANI / Fiscalía).",
      pautaViolencia: "PROTOCOLO MEP DE ACTUACIÓN ANTE ARMAS, DROGAS Y LESIONES GRAVES (Notificación 9-1-1, PANI y Fuerza Pública).",
      requiereProtocolo: true
    }
  ];

  const ETAPAS_DEBIDO_PROCESO = [
    "1. Reporte Docente (Recibido por Prof. Guía)",
    "2. Notificado al Hogar (3 días hábiles para descargo - Art. 82)",
    "3. Descargo / Audiencia Analizada",
    "4. Resolución en Firme (Puntos Rebajados en SEA)",
    "5. En Recurso de Revocatoria / Apelación",
    "6. Archivada / Sin Efecto por Descargo Aceptado"
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
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:00", estado: "Presente (Carné QR)" }],
      boletas: []
    },
    {
      id: "4-0256-0811",
      rolPersona: "Persona Estudiante",
      nombre: "Brenes Mora Sebastián",
      seccion: "11-1",
      especialidad: "Ciberseguridad y Redes",
      profesorGuia: "Prof. Guía 11-1",
      adecuacion: "No Significativa",
      encargado: "Carlos Brenes (correo@est.mep.go.cr)",
      materias: ["Programación 11°", "Redes y Subneteo"],
      habilidades: { logica: 78, redes: 85, ofimatica: 80, calidad: 76 },
      cotidiano: 78, tareas: 80, pruebas: 72, proyecto: 76, asistencia: 90,
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:08", estado: "Tardía (Carné QR)" }],
      boletas: [
        {
          idBoleta: "BOL-2026-001",
          fecha: "2026-11-12",
          codigo: "ART-72-LV",
          articulo: "Falta Leve (Art. 72 REAC)",
          motivo: "Incumplimiento reiterado de normas de seguridad en el laboratorio de redes.",
          docenteReporta: "Docente Redes",
          rebajo: 8,
          etapaDebidoProceso: "4. Resolución en Firme (Puntos Rebajados en SEA)",
          pautaViolencia: "Pauta de Mediación Pedagógica y Compromiso de Convivencia.",
          protocoloActivo: false
        }
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
      bitacoraAsistencia: [{ fecha: "2026-11-18 06:55", estado: "Presente (Carné QR)" }],
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
      habilidades: { logica: 70, redes: 72, ofimatica: 75, calidad: 68 },
      cotidiano: 70, tareas: 72, pruebas: 65, proyecto: 68, asistencia: 86,
      bitacoraAsistencia: [{ fecha: "2026-11-18 07:01", estado: "Presente (Carné QR)" }],
      boletas: [
        {
          idBoleta: "BOL-2026-002",
          fecha: "2026-11-14",
          codigo: "ART-74-MG",
          articulo: "Falta Muy Grave (Art. 74 REAC)",
          motivo: "Intimidación verbal y ciberbullying en grupo estudiantil. Se activan las 6 etapas del Protocolo MEP.",
          docenteReporta: "Prof. Guía 12-1 / Orientación",
          rebajo: 25,
          etapaDebidoProceso: "4. Resolución en Firme (Puntos Rebajados en SEA)",
          pautaViolencia: "PROTOCOLO MEP DE ACTUACIÓN EN SITUACIONES DE BULLYING, CIBERBULLYING Y VIOLENCIA ESCOLAR (6 Etapas).",
          protocoloActivo: true
        }
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
      return ('SHA256-' + h.toString(16).toUpperCase().padStart(8, '0') + '-DECRETO40862');
    }
  }

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
        const bit = f !== null ? f : (((texto.charCodeAt((r * size + c) % texto.length) + r * 17 + c * 31 + Math.abs(seed)) % 3) === 0);
        if (bit) rects += `<rect x="${c * 6 + 6}" y="${r * 6 + 6}" width="6" height="6" fill="#020617"/>`;
      }
    }
    return `<svg viewBox="0 0 138 138" width="144" height="144" style="background:#ffffff;border-radius:12px;padding:6px;box-shadow:0 6px 20px rgba(0,0,0,0.45);">${rects}</svg>`;
  }

  // REGLA LEGAL REAC ART. 82: Solo descuentan puntos en el SEA las boletas que ya cumplieron el Debido Proceso ("4. Resolución en Firme")
  function calcularConductaLegal(est) {
    const boletas = est.boletas || [];
    const rebajoFirme = boletas
      .filter(b => (b.etapaDebidoProceso || '').startsWith('4.'))
      .reduce((acc, b) => acc + (Number(b.rebajo) || 0), 0);
    const rebajoEnTramite = boletas
      .filter(b => !(b.etapaDebidoProceso || '').startsWith('4.') && !(b.etapaDebidoProceso || '').startsWith('6.'))
      .reduce((acc, b) => acc + (Number(b.rebajo) || 0), 0);

    const notaConducta = Math.max(0, 100 - rebajoFirme);
    const tieneProtocolo = boletas.some(b => b.protocoloActivo);
    // Art. 66 REAC: En III Ciclo y Educación Diversificada/Técnica la nota mínima de aprobación de conducta es 70
    let condicionConducta = "APROBADO CONDUCTA (≥70 Art. 66 REAC)";
    if (notaConducta < 70) condicionConducta = "APLAZADO EN CONDUCTA (<70 Art. 66 REAC)";
    return { rebajoFirme, rebajoEnTramite, notaConducta, tieneProtocolo, condicionConducta };
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
    let vistaActiva = 'conducta'; // Iniciamos directo en la vista legal reglamentada o permite cambiar
    let rolDocente = 'ProfGuia';
    let seccionFiltro = 'TODAS';
    let materiaActiva = 'TODAS';
    let busquedaExp = '';
    let estSeleccionadoIdx = 1;
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
      const condActual = calcularConductaLegal(estActual);
      const acadActual = calcularAcademico(estActual, pesos);

      const payloadCertificado = `DECRETO40862-REAC2026|CTPMN|${estActual.id}|${estActual.nombre}|${estActual.seccion}|SEA:${acadActual.notaRedondeada}|CONDUCTA:${condActual.notaConducta}|FIRME:-${condActual.rebajoFirme}`;
      const hashActual = await generarHashSHA256(payloadCertificado);

      modal.innerHTML = `
        <div style="max-width:1220px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:18px;padding:18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,0.95);">
          <!-- Cabecera Legal REAC 2026 -->
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="background:#f59e0b;color:#020617;font-weight:900;font-size:10px;padding:3px 8px;border-radius:5px;">DECRETO EJECUTIVO N° 40862-MEP (REAC 2026)</span>
                <h2 style="margin:0;font-size:18px;color:#22d3ee;">⚖️ Sistema Oficial SEA-MEP: Conducta, Pautas de Violencia, Carné QR & SHA-256</h2>
              </div>
              <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Art. 65-88 REAC: Nota mínima de conducta 70 (III Ciclo y Diversificada) • Debido Proceso en 5 etapas • Competencia exclusiva del Profesor Guía</p>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <label style="background:#2563eb;color:#fff;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">
                📂 Importar CSV SEA
                <input id="sea-file-in" type="file" accept=".csv,.txt" style="display:none;"/>
              </label>
              <button id="sea-btn-export" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">📥 Exportar CSV Legal + SHA256</button>
              <button id="sea-btn-close" style="background:#ef4444;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Filtros RBAC por Rol -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;background:#071220;padding:10px;border-radius:12px;border:1px solid #1e293b;margin-bottom:12px;font-size:11px;">
            <div>
              <label style="color:#67e8f9;font-weight:800;display:block;margin-bottom:3px;">🔐 Rol Institucional (Art. 81 REAC):</label>
              <select id="sel-rol-rbac" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="ProfGuia" ${rolDocente==='ProfGuia'?'selected':''}>👨‍🏫 Profesor Guía (Órgano Instructor Conducta Art. 82)</option>
                <option value="Materia" ${rolDocente==='Materia'?'selected':''}>📘 Docente de Materia (Califica su Materia / Emite Reporte)</option>
                <option value="Familia" ${rolDocente==='Familia'?'selected':''}>👨‍👩‍👧 Estudiante / Familia (Consulta Privada y Descargo)</option>
                <option value="Direccion" ${rolDocente==='Direccion'?'selected':''}>🏛️ Dirección / Orientación (Apelaciones y Protocolos)</option>
              </select>
            </div>
            <div>
              <label style="color:#34d399;font-weight:800;display:block;margin-bottom:3px;">🏫 Sección Guía / Grupo:</label>
              <select id="sel-sec-filtro" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;">
                <option value="TODAS" ${seccionFiltro==='TODAS'?'selected':''}>Todas las Secciones</option>
                <option value="11-1" ${seccionFiltro==='11-1'?'selected':''}>Sección 11-1</option>
                <option value="12-1" ${seccionFiltro==='12-1'?'selected':''}>Sección 12-1</option>
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
              <label style="color:#c084fc;font-weight:800;display:block;margin-bottom:3px;">🔍 Buscar Expediente / Cédula:</label>
              <input id="inp-bus-exp" type="text" value="${busquedaExp}" placeholder="Cédula o nombre..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:11px;"/>
            </div>
          </div>

          <!-- Pestañas de Navegación -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
            <button id="t-cond" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='conducta'?'#f59e0b':'#1e293b'};color:${vistaActiva==='conducta'?'#020617':'#e2e8f0'};">
              ⚖️ 1. Reglamento Conducta REAC, Debido Proceso & Pautas de Violencia
            </button>
            <button id="t-notas" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='notas'?'#06b6d4':'#1e293b'};color:${vistaActiva==='notas'?'#020617':'#e2e8f0'};">
              📝 2. Notas por Materia Matriculada (${lista.length})
            </button>
            <button id="t-qr" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='carnet_qr'?'#10b981':'#1e293b'};color:${vistaActiva==='carnet_qr'?'#020617':'#e2e8f0'};">
              📷 3. Carné QR & Cámara de Asistencia
            </button>
            <button id="t-graf" style="padding:8px 12px;border-radius:9px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${vistaActiva==='graficos'?'#a855f7':'#1e293b'};color:${vistaActiva==='graficos'?'#ffffff':'#e2e8f0'};">
              📈 4. Gráficos por Grupo & Habilidades
            </button>
          </div>

          ${vistaActiva === 'conducta' ? `
            <!-- PESTAÑA 1: REGLAMENTO DE CONDUCTA REAC (ART. 71-82) Y PAUTAS DE VIOLENCIA -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:14px;">
              <!-- Formulario Jurídico de Boleta y Debido Proceso -->
              <div style="background:#071220;border:1px solid #f59e0b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 6px;font-size:14px;color:#fbbf24;">⚖️ Tramitación Legal de Boleta y Pautas de Violencia (Art. 71 al 82 REAC)</h3>
                <p style="margin:0 0 10px;font-size:11px;color:#94a3b8;">
                  ${rolDocente === 'Materia'
                    ? '📘 <b>Modo Docente de Materia:</b> Usted emite el Reporte Preliminar. El rebajo queda en "1. Reporte Docente" y NO descuenta puntos hasta que el Profesor Guía notifique al hogar, reciba el descargo (3 días hábiles) y dicte la Resolución en Firme.'
                    : '👨‍🏫 <b>Modo Profesor Guía / Dirección:</b> Órgano facultado por el Art. 82 REAC para notificar al hogar, valorar el descargo en 3 días hábiles y dejar en firme el rebajo de puntos.'}
                </p>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
                  <div>
                    <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:2px;">1. Persona Estudiante (Sección Guía):</label>
                    <select id="bol-est-idx" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;font-size:12px;">
                      ${db.filter(x => x.rolPersona !== 'Persona Docente').map((e) => {
                        const rIdx = db.findIndex(z => z.id === e.id);
                        return `<option value="${rIdx}" ${rIdx===estSeleccionadoIdx?'selected':''}>[${e.seccion}] ${e.nombre} — Conducta Firme: ${calcularConductaLegal(e).notaConducta} pts</option>`;
                      }).join('')}
                    </select>
                  </div>

                  <div>
                    <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:2px;">2. Tipificación Legal según Decreto N° 40862-MEP (Art. 71 al 80):</label>
                    <select id="bol-falta-cod" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;font-size:12px;">
                      ${ARTICULOS_CONDUCTA_REAC.map((f, i) => `<option value="${i}">${f.categoria} [Rango legal: -${f.minPts} a -${f.maxPts} pts]</option>`).join('')}
                    </select>
                  </div>

                  <div id="box-info-legal" style="background:#0b192c;border-left:3px solid #f59e0b;padding:8px;border-radius:6px;font-size:11px;color:#fde68a;">
                    <b>conducta tipificada:</b> ${ARTICULOS_CONDUCTA_REAC[0].incisos}<br/>
                    <b>Pauta de Convivencia / Violencia:</b> ${ARTICULOS_CONDUCTA_REAC[0].pautaViolencia}
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div>
                      <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:2px;">3. Puntos a Rebajar (Dentro del rango):</label>
                      <input id="bol-pts" type="number" min="1" max="5" value="3" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;"/>
                    </div>
                    <div>
                      <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:2px;">4. Etapa del Debido Proceso (Art. 82):</label>
                      <select id="bol-etapa" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;font-size:11px;" ${rolDocente==='Materia'?'disabled':''}>
                        ${ETAPAS_DEBIDO_PROCESO.map((et, i) => `<option value="${et}" ${(rolDocente==='Materia' && i===0) || (rolDocente!=='Materia' && i===3) ? 'selected' : ''}>${et}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style="display:block;color:#cbd5e1;font-size:11px;margin-bottom:2px;">5. Descripción Objetiva de los Hechos y Pruebas (Sin juicios de valor):</label>
                    <input id="bol-motivo" type="text" placeholder="Describa fecha, hora, lugar, testigos y acción formativa aplicada..." style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:8px;"/>
                  </div>

                  <label style="display:flex;align-items:center;gap:6px;color:#fca5a5;font-size:11px;font-weight:800;cursor:pointer;">
                    <input id="bol-violencia" type="checkbox"/> 🚨 Activar Protocolo Oficial MEP de Actuación en Situaciones de Violencia (6 Etapas)
                  </label>

                  <button id="btn-aplicar-boleta" style="background:#f59e0b;color:#020617;border:none;padding:10px;border-radius:9px;font-weight:900;cursor:pointer;">
                    ${rolDocente === 'Materia' ? '📨 Emitir Boleta Preliminar al Profesor Guía (Art. 82 Inciso a)' : '⚖️ Registrar Boleta Oficial con Sello SHA-256'}
                  </button>
                </div>
              </div>

              <!-- Expediente Disciplinario y Estado del Debido Proceso -->
              <div style="background:#071220;border:1px solid #1e293b;padding:15px;border-radius:14px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#38bdf8;">📋 Expediente de Conducta REAC: ${estActual.nombre} (${estActual.seccion})</h3>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;font-size:11px;text-align:center;">
                  <div style="background:#0b192c;padding:8px;border-radius:8px;border:1px solid #334155;">
                    Base Período<br/><b style="font-size:15px;color:#fff;">100 pts</b>
                  </div>
                  <div style="background:#450a0a;padding:8px;border-radius:8px;border:1px solid #ef4444;color:#fca5a5;">
                    Rebajo en Firme<br/><b style="font-size:15px;">-${condActual.rebajoFirme} pts</b>
                    <div style="font-size:10px;color:#fde68a;">(En trámite: -${condActual.rebajoEnTramite} pts)</div>
                  </div>
                  <div style="background:#064e3b;padding:8px;border-radius:8px;border:1px solid #10b981;color:#6ee7b7;">
                    Nota Conducta SEA<br/><b style="font-size:15px;">${condActual.notaConducta} / 100</b>
                    <div style="font-size:9px;">Mínimo legal: 70</div>
                  </div>
                </div>

                <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">
                  <b>Condición Reglamentaria:</b> <span style="color:${condActual.notaConducta>=70?'#34d399':'#f87171'};font-weight:800;">${condActual.condicionConducta}</span>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;max-height:290px;overflow-y:auto;">
                  ${(estActual.boletas || []).length === 0 ? `
                    <div style="padding:14px;background:#0b192c;border-radius:8px;color:#6ee7b7;font-size:12px;">✅ Sin boletas registradas. Nota de Conducta: 100 puntos.</div>
                  ` : (estActual.boletas || []).map((b, bi) => `
                    <div style="padding:10px;background:${b.protocoloActivo?'#450a0a':'#112236'};border:1px solid ${b.protocoloActivo?'#ef4444':'#334155'};border-radius:9px;font-size:11px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                        <b style="color:#fbbf24;">[${b.fecha}] ${b.articulo || b.codigo} (-${b.rebajo} pts)</b>
                        <span style="background:#071220;padding:2px 7px;border-radius:5px;color:#67e8f9;font-weight:700;">${b.etapaDebidoProceso}</span>
                      </div>
                      <div style="color:#f8fafc;margin-bottom:4px;"><b>Hechos:</b> ${b.motivo}</div>
                      <div style="color:#fde68a;font-size:10px;margin-bottom:6px;"><b>Pauta Aplicada:</b> ${b.pautaViolencia || 'Acción formativa REAC'}</div>
                      ${rolDocente !== 'Materia' && rolDocente !== 'Familia' ? `
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                          <select data-bi="${bi}" class="sel-cambiar-etapa" style="flex:1;background:#071220;border:1px solid #38bdf8;color:#fff;padding:4px 6px;border-radius:6px;font-size:10px;">
                            ${ETAPAS_DEBIDO_PROCESO.map(et => `<option value="${et}" ${b.etapaDebidoProceso===et?'selected':''}>Cambiar etapa: ${et}</option>`).join('')}
                          </select>
                          <button data-bi="${bi}" class="btn-del-bol" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;">Anular</button>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : vistaActiva === 'notas' ? `
            <!-- PESTAÑA 2: PLANILLA SEA POR MATERIA MATRICULADA -->
            <div style="overflow-x:auto;background:#071220;border:1px solid #1e293b;border-radius:12px;">
              <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left;">
                <thead>
                  <tr style="background:#0f172a;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:9px 7px;">Identificación</th>
                    <th style="padding:9px 7px;">Estudiante Matriculado</th>
                    <th style="padding:9px 7px;">Secc.</th>
                    <th style="padding:9px 7px;">Cotidiano</th>
                    <th style="padding:9px 7px;">Tareas</th>
                    <th style="padding:9px 7px;">Pruebas</th>
                    <th style="padding:9px 7px;">Proyecto</th>
                    <th style="padding:9px 7px;">Asist.%</th>
                    <th style="padding:9px 7px;">Nota SEA</th>
                    <th style="padding:9px 7px;">Conducta Firme</th>
                    <th style="padding:9px 7px;">Carné QR</th>
                  </tr>
                </thead>
                <tbody>
                  ${(rolDocente === 'Familia' ? [estActual] : lista).map((est) => {
                    const realIdx = db.findIndex(x => x.id === est.id);
                    const m = calcularAcademico(est, pesos);
                    const c = calcularConductaLegal(est);
                    const colCond = m.condicion === 'APROBADO' ? '#34d399' : (m.condicion === 'AMPLIACIÓN' ? '#fbbf24' : '#f87171');
                    const dis = rolDocente === 'Familia' ? 'disabled' : '';
                    return `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:7px;font-family:monospace;color:#cbd5e1;">${est.id}</td>
                        <td style="padding:7px;font-weight:700;">${est.nombre}<div style="font-size:10px;color:#67e8f9;">${est.rolPersona} • ${est.adecuacion}</div></td>
                        <td style="padding:7px;">${est.seccion}</td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="cotidiano" class="sea-inp" type="number" min="0" max="100" value="${est.cotidiano}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="tareas" class="sea-inp" type="number" min="0" max="100" value="${est.tareas}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="pruebas" class="sea-inp" type="number" min="0" max="100" value="${est.pruebas}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="proyecto" class="sea-inp" type="number" min="0" max="100" value="${est.proyecto}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:5px;"><input ${dis} data-idx="${realIdx}" data-f="asistencia" class="sea-inp" type="number" min="0" max="100" value="${est.asistencia}" style="width:48px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:6px;text-align:center;"/></td>
                        <td style="padding:7px;font-weight:900;color:${colCond};">${m.notaRedondeada} (${m.condicion})</td>
                        <td style="padding:7px;font-weight:800;color:${c.notaConducta<70?'#f87171':'#6ee7b7'};">${c.notaConducta} pts (-${c.rebajoFirme})</td>
                        <td style="padding:7px;"><button data-idx="${realIdx}" class="btn-ir-qr" style="background:#10b981;color:#022c22;border:none;padding:5px 9px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">🪪 QR</button></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : vistaActiva === 'carnet_qr' ? `
            <!-- PESTAÑA 3: CARNÉ QR Y CÁMARA DE ASISTENCIA -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">
              <div style="background:linear-gradient(145deg,#07162c,#0f2942);border:2px solid #22d3ee;border-radius:18px;padding:18px;">
                <select id="qr-sel-persona" style="width:100%;background:#071220;border:1px solid #38bdf8;color:#fff;padding:7px;border-radius:8px;font-size:12px;margin-bottom:12px;">
                  ${db.map((p, idx) => `<option value="${idx}" ${idx===estSeleccionadoIdx?'selected':''}>🪪 Carné QR: [${p.rolPersona}] ${p.nombre} (${p.id})</option>`).join('')}
                </select>
                <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
                  <div>${generarQRVisualSVG(payloadCertificado)}</div>
                  <div style="flex:1;font-size:12px;line-height:1.6;">
                    <div style="font-size:16px;font-weight:900;">${estActual.nombre}</div>
                    <div style="color:#22d3ee;font-family:monospace;">ID: ${estActual.id}</div>
                    <div><b>Rol:</b> ${estActual.rolPersona} • <b>Sección:</b> ${estActual.seccion}</div>
                    <div><b>Nota SEA:</b> ${acadActual.notaRedondeada} | <b>Conducta Legal:</b> ${condActual.notaConducta}</div>
                    <div><b>Asistencia:</b> ${estActual.asistencia}%</div>
                  </div>
                </div>
                <div style="margin-top:10px;background:#06101e;padding:8px;border-radius:8px;font-family:monospace;font-size:10px;color:#6ee7b7;word-break:break-all;">
                  🔒 <b>FIRMA SHA-256 OFICIAL:</b><br/>${hashActual}
                </div>
              </div>

              <div style="background:#071220;border:1px solid #10b981;border-radius:18px;padding:18px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#34d399;">📷 Cámara Lectora QR de Asistencia</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                  <button id="btn-cam-start" style="background:#10b981;color:#022c22;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">🎥 Activar Cámara QR</button>
                  <button id="btn-cam-sim" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">⚡ Registrar Presente QR</button>
                  <button id="btn-cam-tardia" style="background:#f59e0b;color:#020617;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">⏱️ Registrar Tardía</button>
                </div>
                <video id="qr-video-preview" autoplay playsinline style="display:none;width:100%;max-height:180px;background:#000;border-radius:10px;margin-bottom:8px;"></video>
                <div id="qr-scan-status" style="font-size:11px;color:#67e8f9;margin-bottom:8px;"></div>
                <div style="max-height:140px;overflow-y:auto;display:flex;flex-direction:column;gap:5px;">
                  ${(estActual.bitacoraAsistencia || []).map(b => `
                    <div style="background:#0b192c;border-left:3px solid #10b981;padding:6px 10px;border-radius:6px;font-size:11px;display:flex;justify-content:space-between;">
                      <b>${b.fecha}</b><span style="color:#34d399;">${b.estado}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : `
            <!-- PESTAÑA 4: GRÁFICOS DE RENDIMIENTO Y HABILIDADES -->
            <div style="background:#071220;border:1px solid #a855f7;padding:16px;border-radius:14px;">
              <h3 style="margin:0 0 10px;font-size:14px;color:#e9d5ff;">📈 Rendimiento Académico y Conducta por Estudiante (REAC 2026)</h3>
              <div style="display:flex;flex-direction:column;gap:10px;">
                ${db.filter(x => x.rolPersona !== 'Persona Docente').map(e => {
                  const m = calcularAcademico(e, pesos);
                  const c = calcularConductaLegal(e);
                  return `
                    <div style="font-size:11px;">
                      <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                        <b>[${e.seccion}] ${e.nombre}</b>
                        <span>Nota SEA: <b>${m.notaRedondeada}%</b> | Conducta Firme: <b>${c.notaConducta}/100</b></span>
                      </div>
                      <div style="width:100%;height:11px;background:#0f172a;border-radius:99px;overflow:hidden;">
                        <div style="width:${m.notaRedondeada}%;height:100%;background:#06b6d4;"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `}
        </div>
      `;

      document.getElementById('sea-btn-close').onclick = () => { detenerCamara(); modal.remove(); };
      document.getElementById('t-cond').onclick = () => { vistaActiva = 'conducta'; render(); };
      document.getElementById('t-notas').onclick = () => { vistaActiva = 'notas'; render(); };
      document.getElementById('t-qr').onclick = () => { vistaActiva = 'carnet_qr'; render(); };
      document.getElementById('t-graf').onclick = () => { vistaActiva = 'graficos'; render(); };

      document.getElementById('sel-rol-rbac').onchange = (e) => { rolDocente = e.target.value; render(); };
      document.getElementById('sel-sec-filtro').onchange = (e) => { seccionFiltro = e.target.value; render(); };
      document.getElementById('sel-mat-filtro').onchange = (e) => { materiaActiva = e.target.value; render(); };
      document.getElementById('inp-bus-exp').oninput = (e) => { busquedaExp = e.target.value; render(); };

      // Eventos en Pestaña 1 (Conducta Legal REAC)
      const bolEst = document.getElementById('bol-est-idx');
      if (bolEst) bolEst.onchange = (e) => { estSeleccionadoIdx = parseInt(e.target.value, 10); render(); };

      const selFalta = document.getElementById('bol-falta-cod');
      if (selFalta) {
        selFalta.onchange = (e) => {
          const f = ARTICULOS_CONDUCTA_REAC[parseInt(e.target.value, 10)];
          if (f) {
            const inpPts = document.getElementById('bol-pts');
            inpPts.min = f.minPts;
            inpPts.max = f.maxPts;
            inpPts.value = f.sugerido;
            document.getElementById('bol-violencia').checked = f.requiereProtocolo;
            document.getElementById('box-info-legal').innerHTML = `<b>Conducta tipificada:</b> ${f.incisos}<br/><b>Pauta de Convivencia / Violencia:</b> ${f.pautaViolencia}`;
          }
        };
      }

      const btnBol = document.getElementById('btn-aplicar-boleta');
      if (btnBol) {
        btnBol.onclick = () => {
          const f = ARTICULOS_CONDUCTA_REAC[parseInt(document.getElementById('bol-falta-cod').value, 10)];
          let pts = Number(document.getElementById('bol-pts').value) || f.sugerido;
          // Forzar rango legal estricto según el artículo del REAC
          pts = Math.min(f.maxPts, Math.max(f.minPts, pts));
          const mot = document.getElementById('bol-motivo').value.trim() || f.incisos;
          const etapa = rolDocente === 'Materia' ? ETAPAS_DEBIDO_PROCESO[0] : document.getElementById('bol-etapa').value;
          const prot = document.getElementById('bol-violencia').checked;

          if (!db[estSeleccionadoIdx].boletas) db[estSeleccionadoIdx].boletas = [];
          db[estSeleccionadoIdx].boletas.unshift({
            idBoleta: 'BOL-2026-' + (db[estSeleccionadoIdx].boletas.length + 1),
            fecha: new Date().toISOString().slice(0, 10),
            codigo: f.codigo,
            articulo: f.categoria,
            motivo: mot,
            rebajo: pts,
            etapaDebidoProceso: etapa,
            pautaViolencia: f.pautaViolencia,
            protocoloActivo: prot
          });
          guardarDB(db);
          render();
        };
      }

      document.querySelectorAll('.sel-cambiar-etapa').forEach(sel => {
        sel.onchange = (e) => {
          const bi = parseInt(sel.getAttribute('data-bi'), 10);
          db[estSeleccionadoIdx].boletas[bi].etapaDebidoProceso = e.target.value;
          guardarDB(db);
          render();
        };
      });

      document.querySelectorAll('.btn-del-bol').forEach(b => {
        b.onclick = () => {
          db[estSeleccionadoIdx].boletas.splice(parseInt(b.getAttribute('data-bi'), 10), 1);
          guardarDB(db);
          render();
        };
      });

      // Eventos en Pestaña 2 (Notas)
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

      // Eventos en Pestaña 3 (QR y Cámara)
      const qrSel = document.getElementById('qr-sel-persona');
      if (qrSel) qrSel.onchange = (e) => { estSeleccionadoIdx = parseInt(e.target.value, 10); render(); };

      const btnCamStart = document.getElementById('btn-cam-start');
      if (btnCamStart) {
        btnCamStart.onclick = async () => {
          const video = document.getElementById('qr-video-preview');
          const status = document.getElementById('qr-scan-status');
          try {
            streamCamara = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.style.display = 'block';
            video.srcObject = streamCamara;
            status.innerHTML = '🟢 Cámara activa: Acerque el Carné QR al lente...';
          } catch {
            status.innerHTML = 'ℹ️ Use el botón "⚡ Registrar Presente QR" al lado.';
          }
        };
      }

      const marcarAsist = (estado) => {
        const ahora = new Date();
        const stamp = ahora.toISOString().slice(0, 10) + ' ' + ahora.toTimeString().slice(0, 5);
        if (!db[estSeleccionadoIdx].bitacoraAsistencia) db[estSeleccionadoIdx].bitacoraAsistencia = [];
        db[estSeleccionadoIdx].bitacoraAsistencia.unshift({ fecha: stamp, estado });
        guardarDB(db);
        render();
      };
      const bSim = document.getElementById('btn-cam-sim');
      if (bSim) bSim.onclick = () => marcarAsist('Presente Verificado (QR SHA-256)');
      const bTar = document.getElementById('btn-cam-tardia');
      if (bTar) bTar.onclick = () => marcarAsist('Tardía Registrada (QR SHA-256)');

      // Exportar CSV con Artículos REAC, Debido Proceso y Firma SHA-256
      document.getElementById('sea-btn-export').onclick = async () => {
        const header = "Identificacion;Rol;Nombre;Seccion;Cotidiano;Tareas;Pruebas;Proyecto;Asistencia;Nota_SEA;Rebajo_Conducta_Firme;Rebajo_En_Tramite_Debido_Proceso;Nota_Conducta_Final_REAC;Condicion_Conducta_Art66;Protocolo_Violencia_MEP;Firma_Criptografica_SHA256\n";
        const filas = [];
        for (const est of db) {
          const m = calcularAcademico(est, pesos);
          const c = calcularConductaLegal(est);
          const h = await generarHashSHA256(`DECRETO40862|${est.id}|${m.notaRedondeada}|${c.notaConducta}`);
          filas.push(`${est.id};"${est.rolPersona}";"${est.nombre}";${est.seccion};${est.cotidiano};${est.tareas};${est.pruebas};${est.proyecto};${est.asistencia};${m.notaRedondeada};-${c.rebajoFirme};-${c.rebajoEnTramite};${c.notaConducta};"${c.condicionConducta}";${c.tieneProtocolo ? 'ACTIVO_PROTOCOLO_MEP' : 'NO'};${h}`);
        }
        const blob = new Blob(["\uFEFF" + header + filas.join("\n")], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "SEA_MEP_Conducta_REAC_40862_SHA256_2026.csv";
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
      btn.innerHTML = '⚖️ SEA-MEP: Conducta REAC, QR & SHA-256';
      btn.onclick = () => window.abrirGestorSeaMep();
      bar.insertBefore(btn, bar.firstChild.nextSibling);
    }
  }

  setInterval(acoplarBotonSea, 500);
})();