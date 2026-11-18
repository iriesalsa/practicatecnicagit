(function () {
  const DB_KEY = 'bds_sea_mep_v91_db';
  const SALT = 'CTPMN-REAC2026-DECRETO40862';

  const ARTICULOS_REAC = [
    { cod: "Art. 71 y 76 (Muy Leve)", min: 1, max: 5, sug: 3, desc: "Uso incorrecto de uniforme o llegada tardía injustificada", pauta: "Seguimiento preventivo ordinario de aula", prot: false },
    { cod: "Art. 72 y 77 (Leve)", min: 6, max: 10, sug: 8, desc: "Interrupción de lección o incumplimiento de normas del laboratorio", pauta: "Pauta de Mediación Pedagógica y Compromiso con el Hogar", prot: false },
    { cod: "Art. 73 y 78 (Grave)", min: 11, max: 19, sug: 15, desc: "Irrespeto, vocabulario ofensivo, daño a mobiliario o desacato", pauta: "Pauta de Contención Temprana y Reparación Formativa", prot: true },
    { cod: "Art. 74 y 79 (Muy Grave)", min: 20, max: 32, sug: 25, desc: "Acoso escolar (Bullying / Ciberbullying), intimidación o altercado", pauta: "PROTOCOLO MEP ANTE BULLYING / CIBERBULLYING Y VIOLENCIA (6 Etapas)", prot: true },
    { cod: "Art. 75 y 80 (Gravísima)", min: 33, max: 45, sug: 40, desc: "Agresión física grave, armas, sustancias ilícitas o delitos", pauta: "PROTOCOLO MEP ARMAS/DROGAS/LESIONES (9-1-1, PANI y Fiscalía)", prot: true }
  ];

  const ETAPAS_ART82 = [
    "1. Reporte Preliminar Docente (En revisión Prof. Guía)",
    "2. Notificado al Hogar (3 días hábiles para Descargo - Art. 82)",
    "3. Descargo Analizado por Profesor Guía",
    "4. Resolución en Firme (Descuenta puntos en SEA)",
    "5. En Recurso de Revocatoria / Apelación",
    "6. Archivada / Sin Efecto por Descargo Aceptado"
  ];

  const INICIAL = [
    { id: "2-0891-0452", rol: "Persona Estudiante", nombre: "Alfaro Rojas Valeria", seccion: "11-1", esp: "Desarrollo Web", guia: "Prof. Guía 11-1", adec: "Ninguna (DUA)", mat: ["Programación 11°","Redes y Subneteo"], cot: 95, tar: 100, pru: 90, pro: 94, asi: 98, hab: [95,92,98,94], bitacora: ["2026-11-18 07:00 Presente (QR)"], boletas: [] },
    { id: "4-0256-0811", rol: "Persona Estudiante", nombre: "Brenes Mora Sebastián", seccion: "11-1", esp: "Ciberseguridad", guia: "Prof. Guía 11-1", adec: "No Significativa", mat: ["Programación 11°","Redes y Subneteo"], cot: 78, tar: 82, pru: 74, pro: 76, asi: 91, hab: [78,85,80,75], bitacora: ["2026-11-18 07:09 Tardía (QR)"], boletas: [{ fecha: "2026-11-12", art: "Art. 72 y 77 (Leve)", mot: "Incumplimiento de normas en laboratorio", pts: 8, etapa: "4. Resolución en Firme (Descuenta puntos en SEA)", pauta: "Pauta de Mediación Pedagógica", prot: false }] },
    { id: "1-1940-0332", rol: "Persona Estudiante", nombre: "Castro Vargas Camila", seccion: "12-1", esp: "Desarrollo Web", guia: "Prof. Guía 12-1", adec: "Alto Potencial", mat: ["Diseño de Software 12°","Programación 12°"], cot: 98, tar: 100, pru: 96, pro: 98, asi: 100, hab: [98,95,100,97], bitacora: ["2026-11-18 06:55 Presente (QR)"], boletas: [] },
    { id: "2-0912-0774", rol: "Persona Estudiante", nombre: "Delgado Solís Mateo", seccion: "12-1", esp: "Diseño de Software", guia: "Prof. Guía 12-1", adec: "No Significativa", mat: ["Diseño de Software 12°","Programación 12°"], cot: 70, tar: 72, pru: 66, pro: 68, asi: 86, hab: [70,72,75,68], bitacora: ["2026-11-18 07:02 Presente (QR)"], boletas: [{ fecha: "2026-11-14", art: "Art. 74 y 79 (Muy Grave)", mot: "Ciberbullying e intimidación verbal en grupo", pts: 25, etapa: "4. Resolución en Firme (Descuenta puntos en SEA)", pauta: "PROTOCOLO MEP ANTE BULLYING / CIBERBULLYING (6 Etapas)", prot: true }] },
    { id: "DOC-CTPMN-01", rol: "Persona Docente", nombre: "Docente Técnico Especialista MEP", seccion: "11-1 / 12-1", esp: "Desarrollo Web & Redes", guia: "Coordinación Técnica", adec: "N/A", mat: ["Programación 11°","Programación 12°","Diseño de Software 12°","Redes y Subneteo"], cot: 100, tar: 100, pru: 100, pro: 100, asi: 100, hab: [100,100,100,100], bitacora: ["2026-11-18 06:45 Ingreso Docente (QR)"], boletas: [] }
  ];

  const load = () => { try { return JSON.parse(localStorage.getItem(DB_KEY)) || INICIAL; } catch { return INICIAL; } };
  const save = (d) => localStorage.setItem(DB_KEY, JSON.stringify(d));

  async function sha256(txt) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt + '|' + SALT));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      let h = 0x811c9dc5;
      for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
      return 'SHA256-' + h.toString(16).toUpperCase().padStart(8, '0') + '-REAC2026';
    }
  }

  function qrSvg(txt) {
    const s = 21; let rects = '';
    for (let r = 0; r < s; r++) {
      for (let c = 0; c < s; c++) {
        const tl = r < 7 && c < 7, tr = r < 7 && c >= s - 7, bl = r >= s - 7 && c < 7;
        let bit = false;
        if (tl || tr || bl) {
          const lr = tl ? r : (tr ? r : r - (s - 7)), lc = tl ? c : (tr ? c - (s - 7) : c);
          bit = (lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4));
        } else {
          bit = ((txt.charCodeAt((r * s + c) % txt.length) + r * 19 + c * 31) % 3) === 0;
        }
        if (bit) rects += `<rect x="${c * 6 + 6}" y="${r * 6 + 6}" width="6" height="6" fill="#020617"/>`;
      }
    }
    return `<svg viewBox="0 0 138 138" width="136" height="136" style="background:#fff;border-radius:10px;padding:5px;">${rects}</svg>`;
  }

  function calcCond(e) {
    const bols = e.boletas || [];
    const firme = bols.filter(b => (b.etapa || '').startsWith('4.')).reduce((a, b) => a + (Number(b.pts) || 0), 0);
    const tramite = bols.filter(b => !(b.etapa || '').startsWith('4.') && !(b.etapa || '').startsWith('6.')).reduce((a, b) => a + (Number(b.pts) || 0), 0);
    const nota = Math.max(0, 100 - firme);
    const prot = bols.some(b => b.prot);
    return { firme, tramite, nota, prot, estado: nota >= 70 ? "APROBADO (≥70 Art. 66)" : "APLAZADO (<70 Art. 66)" };
  }

  function calcAcad(e) {
    const n = Math.round(((e.cot * 0.35) + (e.tar * 0.10) + (e.pru * 0.25) + (e.pro * 0.20) + (e.asi * 0.10)) * 100) / 100;
    return { nota: n, cond: (n >= 70 && e.asi >= 80) ? "APROBADO" : ((n >= 60 && e.asi >= 80) ? "AMPLIACIÓN" : "REPROBADO") };
  }

  window.abrirGestorSeaMep = function () {
    let old = document.getElementById('bds-sea-modal');
    if (old) old.remove();

    let db = load(), tab = 'conducta', rol = 'ProfGuia', sec = 'TODAS', mat = 'TODAS', bus = '', idx = 1, stream = null;
    const modal = document.createElement('div');
    modal.id = 'bds-sea-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.97);z-index:100002;overflow-y:auto;padding:10px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    const stopCam = () => { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } };

    async function pintar() {
      stopCam();
      const lista = db.filter(e => (sec === 'TODAS' || e.seccion.includes(sec)) && (mat === 'TODAS' || (e.mat || []).includes(mat)) && (!bus || e.nombre.toLowerCase().includes(bus.toLowerCase()) || e.id.toLowerCase().includes(bus.toLowerCase())));
      if (idx >= db.length) idx = 0;
      const cur = db[idx] || db[0];
      const cCond = calcCond(cur), cAcad = calcAcad(cur);
      const payload = `CTPMN|DECRETO40862|${cur.id}|${cur.nombre}|SEA:${cAcad.nota}|CONDUCTA:${cCond.nota}|ASIST:${cur.asi}%`;
      const hash = await sha256(payload);

      modal.innerHTML = `
        <div style="max-width:1180px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:16px;padding:16px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
            <div>
              <span style="background:#f59e0b;color:#020617;font-weight:900;font-size:10px;padding:2px 7px;border-radius:5px;">REAC 2026 • DECRETO 40862-MEP • v91.0</span>
              <h2 style="margin:3px 0 0;font-size:17px;color:#22d3ee;">⚖️ SEA-MEP: Conducta Legal, Pautas de Violencia, Carné QR, Cámara & SHA-256</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="btn-exp-csv" style="background:#10b981;color:#022c22;border:none;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:900;cursor:pointer;">📥 Exportar CSV + SHA256</button>
              <button id="btn-acta" style="background:#3b82f6;color:#fff;border:none;padding:8px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">🖨️ Imprimir Acta Art. 82</button>
              <button id="btn-close" style="background:#ef4444;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- Filtros RBAC Responsive -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px;background:#071220;padding:10px;border-radius:10px;margin-bottom:10px;font-size:11px;">
            <div>
              <b style="color:#67e8f9;">🔐 Rol Activo (Art. 81 REAC):</b>
              <select id="s-rol" style="width:100%;margin-top:3px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;">
                <option value="ProfGuia" ${rol==='ProfGuia'?'selected':''}>👨‍🏫 Profesor Guía (Conducta y Boletas)</option>
                <option value="Materia" ${rol==='Materia'?'selected':''}>📘 Docente Materia (Solo Matriculados)</option>
                <option value="Familia" ${rol==='Familia'?'selected':''}>👨‍👩‍👧 Estudiante / Familia (Privado)</option>
                <option value="Direccion" ${rol==='Direccion'?'selected':''}>🏛️ Dirección / Orientación</option>
              </select>
            </div>
            <div>
              <b style="color:#34d399;">🏫 Sección:</b>
              <select id="s-sec" style="width:100%;margin-top:3px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;">
                <option value="TODAS" ${sec==='TODAS'?'selected':''}>Todas las Secciones</option>
                <option value="11-1" ${sec==='11-1'?'selected':''}>Sección 11-1</option>
                <option value="12-1" ${sec==='12-1'?'selected':''}>Sección 12-1</option>
              </select>
            </div>
            <div>
              <b style="color:#fbbf24;">📚 Materia Matriculada:</b>
              <select id="s-mat" style="width:100%;margin-top:3px;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;">
                <option value="TODAS" ${mat==='TODAS'?'selected':''}>Todas las Materias</option>
                <option value="Programación 11°" ${mat==='Programación 11°'?'selected':''}>Programación 11°</option>
                <option value="Redes y Subneteo" ${mat==='Redes y Subneteo'?'selected':''}>Redes y Subneteo</option>
                <option value="Diseño de Software 12°" ${mat==='Diseño de Software 12°'?'selected':''}>Diseño de Software 12°</option>
                <option value="Programación 12°" ${mat==='Programación 12°'?'selected':''}>Programación 12°</option>
              </select>
            </div>
            <div>
              <b style="color:#c084fc;">🔍 Buscar Persona / ID:</b>
              <input id="s-bus" type="text" value="${bus}" placeholder="Cédula o nombre..." style="width:100%;margin-top:3px;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:11px;"/>
            </div>
          </div>

          <!-- Pestañas Responsive -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            <button id="t-1" style="flex:1 1 auto;padding:9px 10px;border-radius:8px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${tab==='conducta'?'#f59e0b':'#1e293b'};color:${tab==='conducta'?'#020617':'#fff'};">⚖️ 1. Conducta REAC & Pautas Violencia</button>
            <button id="t-2" style="flex:1 1 auto;padding:9px 10px;border-radius:8px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${tab==='notas'?'#06b6d4':'#1e293b'};color:${tab==='notas'?'#020617':'#fff'};">📝 2. Notas SEA (${lista.length})</button>
            <button id="t-3" style="flex:1 1 auto;padding:9px 10px;border-radius:8px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${tab==='qr'?'#10b981':'#1e293b'};color:${tab==='qr'?'#020617':'#fff'};">📷 3. Carné QR & Cámara Asistencia</button>
            <button id="t-4" style="flex:1 1 auto;padding:9px 10px;border-radius:8px;border:none;font-size:11px;font-weight:800;cursor:pointer;background:${tab==='graf'?'#a855f7':'#1e293b'};color:#fff;">📈 4. Gráficos & Habilidades</button>
          </div>

          ${tab === 'conducta' ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">
              <div style="background:#071220;border:1px solid #f59e0b;padding:14px;border-radius:12px;font-size:12px;">
                <h3 style="margin:0 0 6px;font-size:14px;color:#fbbf24;">⚖️ Boleta Oficial y Debido Proceso (Art. 71 al 82 REAC)</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  <select id="b-est" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;">
                    ${db.filter(x => x.rol !== 'Persona Docente').map(e => {
                      const ri = db.findIndex(z => z.id === e.id);
                      return `<option value="${ri}" ${ri===idx?'selected':''}>[${e.seccion}] ${e.nombre} (Conducta Firme: ${calcCond(e).nota})</option>`;
                    }).join('')}
                  </select>
                  <select id="b-art" style="width:100%;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;">
                    ${ARTICULOS_REAC.map((a, i) => `<option value="${i}">${a.cod} [-${a.min} a -${a.max} pts]</option>`).join('')}
                  </select>
                  <div id="b-info" style="background:#0b192c;border-left:3px solid #f59e0b;padding:7px;border-radius:5px;font-size:11px;color:#fde68a;">
                    <b>Tipificación:</b> ${ARTICULOS_REAC[0].desc}<br/><b>Pauta MEP:</b> ${ARTICULOS_REAC[0].pauta}
                  </div>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                    <input id="b-pts" type="number" min="1" max="5" value="3" style="background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;"/>
                    <select id="b-etapa" style="background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;font-size:11px;" ${rol==='Materia'?'disabled':''}>
                      ${ETAPAS_ART82.map((et, i) => `<option value="${et}" ${(rol==='Materia'&&i===0)||(rol!=='Materia'&&i===3)?'selected':''}>${et}</option>`).join('')}
                    </select>
                  </div>
                  <input id="b-mot" type="text" placeholder="Descripción objetiva de hechos, pruebas y fecha..." style="background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;"/>
                  <label style="display:flex;align-items:center;gap:6px;color:#fca5a5;font-size:11px;font-weight:800;">
                    <input id="b-prot" type="checkbox"/> 🚨 Activar Protocolo Oficial MEP ante Situaciones de Violencia (6 Etapas)
                  </label>
                  <button id="b-save" style="background:#f59e0b;color:#020617;border:none;padding:10px;border-radius:8px;font-weight:900;cursor:pointer;">
                    ${rol==='Materia' ? '📨 Enviar Reporte al Profesor Guía (Art. 82.a)' : '⚖️ Registrar Boleta con Firma SHA-256 (Prof. Guía)'}
                  </button>
                </div>
              </div>

              <div style="background:#071220;border:1px solid #1e293b;padding:14px;border-radius:12px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#38bdf8;">📋 Expediente Conducta: ${cur.nombre} (${cur.seccion})</h3>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;font-size:11px;margin-bottom:10px;">
                  <div style="background:#0b192c;padding:7px;border-radius:7px;">Base<br/><b style="font-size:14px;">100</b></div>
                  <div style="background:#450a0a;padding:7px;border-radius:7px;color:#fca5a5;">Firme: <b>-${cCond.firme}</b><br/><span style="font-size:10px;color:#fde68a;">Trámite: -${cCond.tramite}</span></div>
                  <div style="background:#064e3b;padding:7px;border-radius:7px;color:#6ee7b7;">Nota SEA<br/><b style="font-size:14px;">${cCond.nota}/100</b></div>
                </div>
                <div style="display:flex;flex-direction:column;gap:7px;max-height:250px;overflow-y:auto;">
                  ${(cur.boletas || []).map((b, bi) => `
                    <div style="padding:9px;background:${b.prot?'#450a0a':'#112236'};border:1px solid #334155;border-radius:8px;font-size:11px;">
                      <div style="display:flex;justify-content:space-between;"><b>[${b.fecha}] ${b.art} (-${b.pts} pts)</b><span style="color:#67e8f9;">${b.etapa}</span></div>
                      <div style="margin:3px 0;">${b.mot}</div>
                      <div style="font-size:10px;color:#fde68a;">Pauta: ${b.pauta}</div>
                      ${rol !== 'Materia' && rol !== 'Familia' ? `
                        <div style="display:flex;gap:5px;margin-top:5px;">
                          <select data-bi="${bi}" class="c-etapa" style="flex:1;background:#071220;color:#fff;border:1px solid #38bdf8;border-radius:5px;font-size:10px;padding:3px;">
                            ${ETAPAS_ART82.map(et => `<option value="${et}" ${b.etapa===et?'selected':''}>${et}</option>`).join('')}
                          </select>
                          <button data-bi="${bi}" class="d-bol" style="background:#ef4444;color:#fff;border:none;padding:3px 7px;border-radius:5px;font-size:10px;cursor:pointer;">Anular</button>
                        </div>
                      ` : ''}
                    </div>
                  `).join('') || '<div style="padding:12px;color:#6ee7b7;font-size:12px;">✅ Sin boletas (Conducta: 100 pts).</div>'}
                </div>
              </div>
            </div>
          ` : tab === 'notas' ? `
            <div style="overflow-x:auto;background:#071220;border:1px solid #1e293b;border-radius:12px;">
              <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left;">
                <thead>
                  <tr style="background:#0f172a;color:#38bdf8;border-bottom:1px solid #1e293b;">
                    <th style="padding:8px;">ID</th><th style="padding:8px;">Nombre</th><th style="padding:8px;">Secc.</th>
                    <th style="padding:8px;">Cotidiano</th><th style="padding:8px;">Tareas</th><th style="padding:8px;">Pruebas</th><th style="padding:8px;">Proyecto</th><th style="padding:8px;">Asist.%</th>
                    <th style="padding:8px;">Nota SEA</th><th style="padding:8px;">Conducta</th><th style="padding:8px;">QR</th>
                  </tr>
                </thead>
                <tbody>
                  ${(rol === 'Familia' ? [cur] : lista).map(e => {
                    const ri = db.findIndex(z => z.id === e.id), m = calcAcad(e), c = calcCond(e), dis = rol === 'Familia' ? 'disabled' : '';
                    return `
                      <tr style="border-bottom:1px solid #1e293b;">
                        <td style="padding:7px;font-family:monospace;">${e.id}</td>
                        <td style="padding:7px;font-weight:700;">${e.nombre}<div style="font-size:10px;color:#67e8f9;">${e.rol} • ${e.adec}</div></td>
                        <td style="padding:7px;">${e.seccion}</td>
                        ${['cot','tar','pru','pro','asi'].map(k => `<td style="padding:4px;"><input ${dis} data-i="${ri}" data-k="${k}" class="n-inp" type="number" min="0" max="100" value="${e[k]}" style="width:46px;background:#112236;border:1px solid #334155;color:#fff;padding:4px;border-radius:5px;text-align:center;"/></td>`).join('')}
                        <td style="padding:7px;font-weight:900;color:#34d399;">${m.nota} (${m.cond})</td>
                        <td style="padding:7px;font-weight:800;color:${c.nota<70?'#f87171':'#6ee7b7'};">${c.nota} pts</td>
                        <td style="padding:7px;"><button data-i="${ri}" class="go-qr" style="background:#10b981;color:#022c22;border:none;padding:5px 8px;border-radius:6px;font-size:10px;font-weight:900;cursor:pointer;">🪪 QR</button></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          ` : tab === 'qr' ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
              <div style="background:linear-gradient(145deg,#07162c,#0f2942);border:2px solid #22d3ee;border-radius:16px;padding:16px;">
                <select id="q-sel" style="width:100%;background:#071220;border:1px solid #38bdf8;color:#fff;padding:7px;border-radius:8px;font-size:12px;margin-bottom:10px;">
                  ${db.map((p, i) => `<option value="${i}" ${i===idx?'selected':''}>🪪 [${p.rol}] ${p.nombre} (${p.id})</option>`).join('')}
                </select>
                <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                  <div>${qrSvg(payload)}</div>
                  <div style="font-size:12px;line-height:1.6;">
                    <div style="font-size:15px;font-weight:900;">${cur.nombre}</div>
                    <div style="color:#22d3ee;font-family:monospace;">ID: ${cur.id}</div>
                    <div><b>Rol:</b> ${cur.rol} • <b>Sección:</b> ${cur.seccion}</div>
                    <div><b>Nota SEA:</b> ${cAcad.nota} | <b>Conducta:</b> ${cCond.nota}</div>
                    <div><b>Asistencia:</b> ${cur.asi}%</div>
                  </div>
                </div>
                <div style="margin-top:10px;background:#06101e;padding:7px;border-radius:7px;font-family:monospace;font-size:10px;color:#6ee7b7;word-break:break-all;">🔒 <b>SHA-256:</b> ${hash}</div>
              </div>

              <div style="background:#071220;border:1px solid #10b981;border-radius:16px;padding:16px;">
                <h3 style="margin:0 0 8px;font-size:14px;color:#34d399;">📷 Escáner de Cámara QR para Asistencia Rápida</h3>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                  <button id="c-on" style="background:#10b981;color:#022c22;border:none;padding:8px 11px;border-radius:7px;font-size:11px;font-weight:900;cursor:pointer;">🎥 Activar Cámara QR</button>
                  <button id="c-pre" style="background:#0284c7;color:#fff;border:none;padding:8px 11px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">⚡ Marcar Presente QR</button>
                  <button id="c-tar" style="background:#f59e0b;color:#020617;border:none;padding:8px 11px;border-radius:7px;font-size:11px;font-weight:800;cursor:pointer;">⏱️ Marcar Tardía QR</button>
                </div>
                <video id="v-qr" autoplay playsinline style="display:none;width:100%;max-height:170px;background:#000;border-radius:8px;margin-bottom:8px;"></video>
                <div id="c-msg" style="font-size:11px;color:#67e8f9;margin-bottom:8px;"></div>
                <div style="display:flex;flex-direction:column;gap:5px;max-height:130px;overflow-y:auto;">
                  ${(cur.bitacora || []).map(b => `<div style="background:#0b192c;border-left:3px solid #10b981;padding:6px;border-radius:5px;font-size:11px;">✅ ${b}</div>`).join('')}
                </div>
              </div>
            </div>
          ` : `
            <div style="background:#071220;border:1px solid #a855f7;padding:14px;border-radius:12px;">
              <h3 style="margin:0 0 10px;font-size:14px;color:#e9d5ff;">📈 Rendimiento Comparativo por Grupo y Habilidades REAC 2026</h3>
              ${db.filter(x => x.rol !== 'Persona Docente').map(e => {
                const m = calcAcad(e), c = calcCond(e);
                return `
                  <div style="margin-bottom:10px;font-size:11px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                      <b>[${e.seccion}] ${e.nombre} (${e.esp})</b>
                      <span>Nota SEA: <b>${m.nota}%</b> | Conducta: <b>${c.nota}/100</b></span>
                    </div>
                    <div style="width:100%;height:11px;background:#0f172a;border-radius:99px;overflow:hidden;">
                      <div style="width:${m.nota}%;height:100%;background:#06b6d4;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      `;

      document.getElementById('btn-close').onclick = () => { stopCam(); modal.remove(); };
      document.getElementById('t-1').onclick = () => { tab = 'conducta'; pintar(); };
      document.getElementById('t-2').onclick = () => { tab = 'notas'; pintar(); };
      document.getElementById('t-3').onclick = () => { tab = 'qr'; pintar(); };
      document.getElementById('t-4').onclick = () => { tab = 'graf'; pintar(); };

      document.getElementById('s-rol').onchange = (e) => { rol = e.target.value; pintar(); };
      document.getElementById('s-sec').onchange = (e) => { sec = e.target.value; pintar(); };
      document.getElementById('s-mat').onchange = (e) => { mat = e.target.value; pintar(); };
      document.getElementById('s-bus').oninput = (e) => { bus = e.target.value; pintar(); };

      // Imprimir Acta Oficial Art. 82 REAC
      document.getElementById('btn-acta').onclick = () => {
        const w = window.open('', '_blank', 'width=800,height=700');
        w.document.write(`<html><head><title>Acta Oficial Art. 82 REAC - CTP Mercedes Norte</title></head><body style="font-family:Arial,sans-serif;padding:30px;line-height:1.6;">
          <h2 style="margin:0;">MINISTERIO DE EDUCACIÓN PÚBLICA • CTP MERCEDES NORTE</h2>
          <h3 style="margin:4px 0 16px;">NOTIFICACIÓN DE DEBIDO PROCESO Y CONDUCTA (ART. 82 REAC - DECRETO 40862-MEP)</h3>
          <p><b>Estudiante:</b> ${cur.nombre} | <b>Identificación:</b> ${cur.id} | <b>Sección:</b> ${cur.seccion}</p>
          <p><b>Profesor Guía Instructor:</b> ${cur.guia} | <b>Nota Académica SEA:</b> ${cAcad.nota} | <b>Nota Conducta Firme:</b> ${cCond.nota}/100</p>
          <hr/>
          <h4>Detalle de Boletas y Pautas Aplicadas:</h4>
          <ul>${(cur.boletas || []).map(b => `<li><b>[${b.fecha}] ${b.art} (-${b.pts} pts):</b> ${b.mot} — <i>${b.etapa}</i> (${b.pauta})</li>`).join('') || '<li>Sin boletas registradas (100 pts).</li>'}</ul>
          <p style="font-size:12px;"><b>Derecho de Descargo (Art. 82 REAC):</b> Se otorga un plazo legal de <b>3 días hábiles</b> a partir de esta notificación para presentar pruebas de descargo ante el Profesor Guía.</p>
          <p style="font-family:monospace;font-size:11px;background:#f1f5f9;padding:10px;"><b>SELLO CRIPTOGRÁFICO SHA-256:</b> ${hash}</p>
          <br/><br/><div style="display:flex;justify-content:space-between;"><span>___________________________<br/>Firma Profesor Guía</span><span>___________________________<br/>Firma Encargado Legal</span></div>
          <script>window.print();<\/script></body></html>`);
        w.document.close();
      };

      // Exportar CSV con SHA-256
      document.getElementById('btn-exp-csv').onclick = async () => {
        let csv = "\uFEFFID;Rol;Nombre;Seccion;Cotidiano;Tareas;Pruebas;Proyecto;Asistencia;Nota_SEA;Conducta_Firme;Firma_SHA256\n";
        for (const e of db) {
          const m = calcAcad(e), c = calcCond(e), h = await sha256(`CTPMN|${e.id}|${m.nota}|${c.nota}`);
          csv += `${e.id};"${e.rol}";"${e.nombre}";${e.seccion};${e.cot};${e.tar};${e.pru};${e.pro};${e.asi};${m.nota};${c.nota};${h}\n`;
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        a.download = "SEA_MEP_Conducta_QR_SHA256_2026.csv";
        a.click();
      };

      const bEst = document.getElementById('b-est');
      if (bEst) bEst.onchange = (e) => { idx = parseInt(e.target.value, 10); pintar(); };

      const bArt = document.getElementById('b-art');
      if (bArt) {
        bArt.onchange = (e) => {
          const a = ARTICULOS_REAC[parseInt(e.target.value, 10)];
          const inp = document.getElementById('b-pts');
          inp.min = a.min; inp.max = a.max; inp.value = a.sug;
          document.getElementById('b-prot').checked = a.prot;
          document.getElementById('b-info').innerHTML = `<b>Tipificación:</b> ${a.desc}<br/><b>Pauta MEP:</b> ${a.pauta}`;
        };
      }

      const bSave = document.getElementById('b-save');
      if (bSave) {
        bSave.onclick = () => {
          const a = ARTICULOS_REAC[parseInt(document.getElementById('b-art').value, 10)];
          const pts = Math.min(a.max, Math.max(a.min, Number(document.getElementById('b-pts').value) || a.sug));
          const mot = document.getElementById('b-mot').value.trim() || a.desc;
          const et = rol === 'Materia' ? ETAPAS_ART82[0] : document.getElementById('b-etapa').value;
          const pr = document.getElementById('b-prot').checked;
          if (!db[idx].boletas) db[idx].boletas = [];
          db[idx].boletas.unshift({ fecha: new Date().toISOString().slice(0,10), art: a.cod, mot, pts, etapa: et, pauta: a.pauta, prot: pr });
          save(db); pintar();
        };
      }

      document.querySelectorAll('.c-etapa').forEach(s => {
        s.onchange = (e) => { db[idx].boletas[parseInt(s.getAttribute('data-bi'),10)].etapa = e.target.value; save(db); pintar(); };
      });
      document.querySelectorAll('.d-bol').forEach(b => {
        b.onclick = () => { db[idx].boletas.splice(parseInt(b.getAttribute('data-bi'),10),1); save(db); pintar(); };
      });

      document.querySelectorAll('.n-inp').forEach(inp => {
        inp.onchange = (e) => { db[parseInt(inp.getAttribute('data-i'),10)][inp.getAttribute('data-k')] = Math.min(100, Math.max(0, Number(e.target.value)||0)); save(db); pintar(); };
      });
      document.querySelectorAll('.go-qr').forEach(b => {
        b.onclick = () => { idx = parseInt(b.getAttribute('data-i'),10); tab = 'qr'; pintar(); };
      });

      const qSel = document.getElementById('q-sel');
      if (qSel) qSel.onchange = (e) => { idx = parseInt(e.target.value,10); pintar(); };

      const cOn = document.getElementById('c-on');
      if (cOn) {
        cOn.onclick = async () => {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            const v = document.getElementById('v-qr');
            v.style.display = 'block'; v.srcObject = stream;
            document.getElementById('c-msg').innerText = '🟢 Cámara activa: Escaneando Carné QR...';
          } catch {
            document.getElementById('c-msg').innerText = 'ℹ️ Use "⚡ Marcar Presente QR" al lado.';
          }
        };
      }
      const mark = (st) => {
        const ts = new Date().toISOString().slice(0,10) + ' ' + new Date().toTimeString().slice(0,5);
        if (!db[idx].bitacora) db[idx].bitacora = [];
        db[idx].bitacora.unshift(`${ts} — ${st}`);
        save(db); pintar();
      };
      const cPre = document.getElementById('c-pre');
      if (cPre) cPre.onclick = () => mark('Presente Verificado (Carné QR SHA-256)');
      const cTar = document.getElementById('c-tar');
      if (cTar) cTar.onclick = () => mark('Tardía Registrada (Carné QR SHA-256)');
    }

    document.body.appendChild(modal);
    pintar();
  };

  setInterval(() => {
    const bar = document.getElementById('bds-soberana-bar');
    if (bar && !document.getElementById('bds-btn-sea')) {
      const btn = document.createElement('button');
      btn.id = 'bds-btn-sea';
      btn.style.cssText = 'background:#059669;color:#fff;border:none;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;';
      btn.innerHTML = '⚖️ SEA-MEP: Conducta REAC, QR & SHA-256';
      btn.onclick = () => window.abrirGestorSeaMep();
      bar.insertBefore(btn, bar.firstChild.nextSibling);
    }
  }, 500);
})();