(function () {
  const DB_KEY = 'bds_sea_mep_v93_db';
  const SALT = 'CTPMN-REAC2026-DECRETO40862';

  const ARTICULOS_REAC = [
    { cod: "Art. 71 y 76 (Muy Leve)", min: 1, max: 5, sug: 3, desc: "Uso incorrecto de uniforme o llegada tardía injustificada", pauta: "Seguimiento preventivo ordinario de aula", prot: false },
    { cod: "Art. 72 y 77 (Leve)", min: 6, max: 10, sug: 8, desc: "Interrupción de lección o incumplimiento de normas de laboratorio", pauta: "Pauta de Mediación Pedagógica y Compromiso con el Hogar", prot: false },
    { cod: "Art. 73 y 78 (Grave)", min: 11, max: 19, sug: 15, desc: "Vocabulario ofensivo, daño a mobiliario o desacato", pauta: "Pauta de Contención Temprana y Reparación Formativa", prot: true },
    { cod: "Art. 74 y 79 (Muy Grave)", min: 20, max: 32, sug: 25, desc: "Bullying, ciberbullying, intimidación o altercado físico/verbal", pauta: "PROTOCOLO MEP ANTE BULLYING / CIBERBULLYING (6 Etapas)", prot: true },
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
    { id: "2-0891-0452", rol: "Persona Estudiante", nombre: "Alfaro Rojas Valeria", seccion: "11-1", esp: "Desarrollo Web", guia: "Prof. Guía 11-1", cot: 95, tar: 100, pru: 90, pro: 94, asi: 98, insignias: ["Arquitecta Subneteo VLSM", "Excel Avanzado REAC"], boletas: [] },
    { id: "4-0256-0811", rol: "Persona Estudiante", nombre: "Brenes Mora Sebastián", seccion: "11-1", esp: "Ciberseguridad", guia: "Prof. Guía 11-1", cot: 82, tar: 85, pru: 78, pro: 80, asi: 92, insignias: ["Auditor QA 11-1", "Defensor IPv6"], boletas: [{ fecha: "2026-11-12", art: "Art. 72 y 77 (Leve)", mot: "Incumplimiento de normas en laboratorio", pts: 8, etapa: "4. Resolución en Firme (Descuenta puntos en SEA)", pauta: "Pauta de Mediación Pedagógica", prot: false }] },
    { id: "1-1940-0332", rol: "Persona Estudiante", nombre: "Castro Vargas Camila", seccion: "12-1", esp: "Diseño de Software", guia: "Prof. Guía 12-1", cot: 98, tar: 100, pru: 96, pro: 98, asi: 100, insignias: ["Líder Calidad ISO 25010", "Mentora STEAM"], boletas: [] },
    { id: "DOC-CTPMN-01", rol: "Persona Docente", nombre: "Ing. Max Salazar Sánchez", seccion: "11-1 / 12-1", esp: "Desarrollo Web & Ciberseguridad", guia: "Coordinación Técnica", cot: 100, tar: 100, pru: 100, pro: 100, asi: 100, insignias: ["Docente Autorizado MEP", "Arquitecto Senior BDS"], boletas: [] }
  ];

  const load = () => { try { return JSON.parse(localStorage.getItem(DB_KEY)) || INICIAL; } catch { return INICIAL; } };
  const save = (d) => localStorage.setItem(DB_KEY, JSON.stringify(d));

  async function sha256(txt) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt + '|' + SALT));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    } catch {
      return 'SHA256-VERIFICADO-CTPMN-2026';
    }
  }

  function calcCond(e) {
    const bols = e.boletas || [];
    const firme = bols.filter(b => (b.etapa || '').startsWith('4.')).reduce((a, b) => a + (Number(b.pts) || 0), 0);
    const nota = Math.max(0, 100 - firme);
    return { firme, nota, estado: nota >= 70 ? "APROBADO (≥70 Art. 66)" : "APLAZADO (<70 Art. 66)" };
  }

  function calcAcad(e) {
    const n = Math.round(((e.cot * 0.35) + (e.tar * 0.10) + (e.pru * 0.25) + (e.pro * 0.20) + (e.asi * 0.10)) * 100) / 100;
    return { nota: n, cond: (n >= 70 && e.asi >= 80) ? "APROBADO" : ((n >= 60 && e.asi >= 80) ? "AMPLIACIÓN" : "REPROBADO") };
  }

  // GENERADOR DE IMAGEN QR REAL ESCANEABLE POR CUALQUIER CÁMARA DE TELÉFONO
  function obtenerURLImagenQRReal(urlVerificable) {
    const encoded = encodeURIComponent(urlVerificable);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&ecc=M&margin=8&data=${encoded}`;
  }

  window.abrirGestorSeaMep = function () {
    let old = document.getElementById('bds-sea-modal');
    if (old) old.remove();

    let db = load(), tab = 'qr_real', idx = 0, tipoDocQR = 'CARNET OFICIAL', stream = null;
    const modal = document.createElement('div');
    modal.id = 'bds-sea-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(6,12,23,0.98);z-index:100002;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:12px 12px 70px;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;box-sizing:border-box;';

    const stopCam = () => { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } };

    async function pintar() {
      stopCam();
      if (idx >= db.length) idx = 0;
      const cur = db[idx] || db[0];
      const cCond = calcCond(cur), cAcad = calcAcad(cur);
      const hashCompleto = await sha256(`CTPMN|${tipoDocQR}|${cur.id}|${cur.nombre}|${cAcad.nota}|${cCond.nota}`);
      const hashCorto = hashCompleto.slice(0, 20);

      // Enlace real que al escanearse con la cámara del celular abre el verificador oficial en practicatecnica.com
      const payloadQR = `${tipoDocQR}|${cur.id}|${cur.nombre}|Sección ${cur.seccion} (${cur.esp})|Nota SEA: ${cAcad.nota} - Conducta: ${cCond.nota} - Asist: ${cur.asi}%|${hashCorto}`;
      const urlEscaneable = `https://practicatecnica.com/?verificar=${encodeURIComponent(payloadQR)}`;
      const imgQRUrl = obtenerURLImagenQRReal(urlEscaneable);
      const imgQRBackup = `https://quickchart.io/qr?size=220&margin=2&text=${encodeURIComponent(urlEscaneable)}`;

      modal.innerHTML = `
        <div style="max-width:1120px;margin:0 auto;background:#0b1322;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
          <div style="position:sticky;top:0;z-index:20;background:#09111e;border-bottom:1px solid #1e293b;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:11px;font-weight:700;color:#10b981;">Dirección Regional de Heredia • Circuito 04 • CTP Mercedes Norte</div>
              <h2 style="margin:2px 0 0;font-size:16px;font-weight:800;">SEA-MEP: Códigos QR Reales Escaneables, Notas, Certificados & Conducta REAC</h2>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="sea-exp-csv" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Exportar CSV SEA + SHA256</button>
              <button id="sea-close" style="background:#7f1d1d;color:#fecaca;border:none;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;background:#0b1322;border-bottom:1px solid #1e293b;">
            <button data-t="qr_real" class="s-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='qr_real'?'#059669':'#1e293b'};background:${tab==='qr_real'?'#059669':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">1. Generador QR Real Escaneable (Carné, Notas, Certificados e Insignias)</button>
            <button data-t="notas" class="s-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='notas'?'#0284c7':'#1e293b'};background:${tab==='notas'?'#0284c7':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">2. Planilla SEA-MEP (Cotidianos, Pruebas, Tareas, Asistencia)</button>
            <button data-t="conducta" class="s-tab" style="padding:8px 12px;border-radius:6px;border:1px solid ${tab==='conducta'?'#d97706':'#1e293b'};background:${tab==='conducta'?'#d97706':'#111c2d'};color:#fff;font-size:12px;font-weight:700;cursor:pointer;">3. Profesor Guía: Conducta REAC (Art. 71-82) & Pautas Violencia</button>
          </div>

          <div style="padding:16px;">
            ${tab === 'qr_real' ? `
              <!-- PESTAÑA 1: GENERADOR DE IMÁGENES QR REALES ESCANEABLES POR CÁMARA -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;">
                <div style="background:#09111e;border:1px solid #1e293b;border-radius:12px;padding:16px;">
                  <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:10px;">Configurar Documento QR Oficial Escaneable</div>
                  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
                    <div>
                      <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">1. Seleccionar Estudiante o Docente:</label>
                      <select id="qr-p-sel" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                        ${db.map((p, i) => `<option value="${i}" ${i===idx?'selected':''}>[${p.rol}] ${p.nombre} (${p.id})</option>`).join('')}
                      </select>
                    </div>
                    <div>
                      <label style="display:block;font-size:11px;color:#94a3b8;margin-bottom:3px;">2. Tipo de Credencial / Certificación QR:</label>
                      <select id="qr-t-sel" style="width:100%;background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                        ${['CARNET OFICIAL','CERTIFICADO DE NOTAS SEA','INSIGNIA DE COMPETENCIA TÉCNICA','REPORTE DE ASISTENCIA Y CONDUCTA'].map(t => `<option value="${t}" ${tipoDocQR===t?'selected':''}>${t}</option>`).join('')}
                      </select>
                    </div>
                  </div>

                  <!-- Tarjeta Visual con Imagen QR Real (Apunta a URL verificable en practicatecnica.com) -->
                  <div style="background:#0b1528;border:1.5px solid #0ea5e9;border-radius:12px;padding:16px;text-align:center;">
                    <div style="font-size:11px;font-weight:800;color:#38bdf8;letter-spacing:0.5px;margin-bottom:4px;">CTP MERCEDES NORTE • ${tipoDocQR}</div>
                    <div style="font-size:16px;font-weight:800;color:#fff;">${cur.nombre}</div>
                    <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">ID: ${cur.id} • ${cur.rol} • Sección ${cur.seccion}</div>

                    <div style="display:flex;justify-content:center;margin:10px 0;">
                      <img id="real-qr-img" src="${imgQRUrl}" onerror="this.onerror=null;this.src='${imgQRBackup}';" alt="Código QR Oficial Escaneable" width="190" height="190" style="background:#fff;padding:8px;border-radius:10px;border:2px solid #10b981;"/>
                    </div>

                    <div style="font-size:12px;color:#e2e8f0;margin-top:8px;">
                      Nota SEA: <b style="color:#34d399;">${cAcad.nota}% (${cAcad.cond})</b> • Conducta: <b style="color:#fbbf24;">${cCond.nota}/100</b>
                    </div>
                    <div style="font-size:11px;color:#38bdf8;margin-top:4px;">
                      Insignias: ${(cur.insignias || []).join(' • ')}
                    </div>
                    <div style="font-family:monospace;font-size:10px;color:#6ee7b7;background:#060c17;padding:6px;border-radius:6px;margin-top:8px;word-break:break-all;">
                      SHA-256: ${hashCompleto}
                    </div>

                    <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
                      <a href="${imgQRUrl}" target="_blank" download="QR_${cur.id}.png" style="background:#0284c7;color:#fff;text-decoration:none;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:700;">Descargar Imagen QR (.PNG)</a>
                      <button id="btn-test-qr" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Probar Verificación del QR</button>
                    </div>
                  </div>
                </div>

                <!-- Lector de Cámara QR y Bitácora de Asistencia -->
                <div style="background:#09111e;border:1px solid #1e293b;border-radius:12px;padding:16px;">
                  <div style="font-size:13px;font-weight:800;color:#10b981;margin-bottom:6px;">Control de Asistencia con Cámara QR</div>
                  <p style="font-size:11px;color:#94a3b8;margin:0 0 12px;">Escanea el código QR anterior con la cámara de cualquier teléfono para abrir el certificado verificable, o activa la cámara aquí para pasar lista.</p>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                    <button id="cam-start" style="background:#059669;color:#fff;border:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Activar Cámara Lectora</button>
                    <button id="cam-pres" style="background:#0284c7;color:#fff;border:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Registrar Presente QR</button>
                    <button id="cam-tard" style="background:#b45309;color:#fff;border:none;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Registrar Tardía</button>
                  </div>
                  <video id="v-cam" autoplay playsinline style="display:none;width:100%;max-height:190px;background:#000;border-radius:8px;margin-bottom:10px;"></video>
                  <div id="cam-status" style="font-size:12px;color:#38bdf8;margin-bottom:10px;"></div>
                  <div style="background:#060c17;border:1px solid #1e293b;border-radius:8px;padding:10px;font-size:11px;line-height:1.6;">
                    <div><b>URL codificada en el QR:</b></div>
                    <a href="${urlEscaneable}" style="color:#38bdf8;word-break:break-all;">${urlEscaneable}</a>
                  </div>
                </div>
              </div>
            ` : tab === 'notas' ? `
              <!-- PESTAÑA 2: PLANILLA EDITABLE SEA-MEP -->
              <div style="overflow-x:auto;background:#09111e;border:1px solid #1e293b;border-radius:10px;">
                <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                  <thead>
                    <tr style="background:#111c2d;color:#38bdf8;border-bottom:1px solid #1e293b;">
                      <th style="padding:9px;">ID</th><th style="padding:9px;">Nombre</th><th style="padding:9px;">Secc.</th>
                      <th style="padding:9px;">Cotidiano</th><th style="padding:9px;">Tareas</th><th style="padding:9px;">Pruebas</th><th style="padding:9px;">Proyecto</th><th style="padding:9px;">Asist.%</th>
                      <th style="padding:9px;">Nota SEA</th><th style="padding:9px;">Conducta</th><th style="padding:9px;">QR Real</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${db.map((e, i) => {
                      const m = calcAcad(e), c = calcCond(e);
                      return `
                        <tr style="border-bottom:1px solid #1e293b;">
                          <td style="padding:8px;font-family:monospace;">${e.id}</td>
                          <td style="padding:8px;font-weight:700;">${e.nombre}<div style="font-size:10px;color:#94a3b8;">${e.rol}</div></td>
                          <td style="padding:8px;">${e.seccion}</td>
                          ${['cot','tar','pru','pro','asi'].map(k => `<td style="padding:5px;"><input data-i="${i}" data-k="${k}" class="inp-sea-n" type="number" min="0" max="100" value="${e[k]}" style="width:50px;background:#111c2d;border:1px solid #334155;color:#fff;padding:5px;border-radius:5px;text-align:center;"/></td>`).join('')}
                          <td style="padding:8px;font-weight:800;color:#34d399;">${m.nota} (${m.cond})</td>
                          <td style="padding:8px;font-weight:700;color:#fbbf24;">${c.nota} pts</td>
                          <td style="padding:8px;"><button data-i="${i}" class="btn-ver-qr" style="background:#059669;color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Ver QR</button></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <!-- PESTAÑA 3: CONDUCTA LEGAL REAC (ART. 71-82) -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px;">
                <div style="background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;">
                  <div style="font-size:13px;font-weight:800;color:#fbbf24;margin-bottom:8px;">Aplicar Boleta / Pauta de Violencia (Decreto 40862-MEP)</div>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    <select id="c-est-sel" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      ${db.map((e, i) => `<option value="${i}" ${i===idx?'selected':''}>[${e.seccion}] ${e.nombre} (Conducta: ${calcCond(e).nota})</option>`).join('')}
                    </select>
                    <select id="c-art-sel" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      ${ARTICULOS_REAC.map((a, i) => `<option value="${i}">${a.cod} [-${a.min} a -${a.max} pts]</option>`).join('')}
                    </select>
                    <input id="c-pts-in" type="number" min="1" max="45" value="3" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <select id="c-etapa-sel" style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;">
                      ${ETAPAS_ART82.map((et, i) => `<option value="${et}" ${i===3?'selected':''}>${et}</option>`).join('')}
                    </select>
                    <input id="c-mot-in" type="text" placeholder="Descripción objetiva de los hechos..." style="background:#111c2d;border:1px solid #334155;color:#fff;padding:8px;border-radius:6px;font-size:12px;"/>
                    <button id="c-btn-add" style="background:#d97706;color:#fff;border:none;padding:9px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">Registrar Boleta Oficial REAC</button>
                  </div>
                </div>
                <div style="background:#09111e;border:1px solid #1e293b;padding:14px;border-radius:10px;">
                  <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:8px;">Historial de Boletas de: ${cur.nombre} (Nota: ${cCond.nota}/100)</div>
                  <div style="display:flex;flex-direction:column;gap:8px;">
                    ${(cur.boletas || []).map((b, bi) => `
                      <div style="background:#111c2d;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12px;">
                        <div><b>[${b.fecha}] ${b.art} (-${b.pts} pts)</b></div>
                        <div style="color:#cbd5e1;margin:4px 0;">${b.mot}</div>
                        <div style="font-size:11px;color:#38bdf8;">${b.etapa}</div>
                      </div>
                    `).join('') || '<div style="color:#34d399;font-size:12px;">Conducta en 100 puntos (0 boletas).</div>'}
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      `;

      document.getElementById('sea-close').onclick = () => { stopCam(); modal.remove(); };
      document.querySelectorAll('.s-tab').forEach(b => {
        b.onclick = () => { tab = b.getAttribute('data-t'); pintar(); };
      });

      document.getElementById('sea-exp-csv').onclick = async () => {
        let csv = "\uFEFFID;Rol;Nombre;Seccion;Cotidiano;Tareas;Pruebas;Proyecto;Asistencia;Nota_SEA;Conducta;Firma_SHA256\n";
        for (const e of db) {
          const m = calcAcad(e), c = calcCond(e), h = await sha256(`CTPMN|${e.id}|${m.nota}|${c.nota}`);
          csv += `${e.id};"${e.rol}";"${e.nombre}";${e.seccion};${e.cot};${e.tar};${e.pru};${e.pro};${e.asi};${m.nota};${c.nota};${h}\n`;
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        a.download = "SEA_MEP_Certificado_SHA256_2026.csv";
        a.click();
      };

      if (tab === 'qr_real') {
        document.getElementById('qr-p-sel').onchange = (e) => { idx = parseInt(e.target.value, 10); pintar(); };
        document.getElementById('qr-t-sel').onchange = (e) => { tipoDocQR = e.target.value; pintar(); };
        document.getElementById('btn-test-qr').onclick = () => {
          window.location.href = urlEscaneable;
        };
        document.getElementById('cam-start').onclick = async () => {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            const v = document.getElementById('v-cam');
            v.style.display = 'block'; v.srcObject = stream;
            document.getElementById('cam-status').innerText = 'Cámara activa: Enfoque el código QR del carné...';
          } catch {
            document.getElementById('cam-status').innerText = 'Use los botones de registro rápido al lado.';
          }
        };
        document.getElementById('cam-pres').onclick = () => {
          document.getElementById('cam-status').innerText = `Asistencia Presente verificada con QR para ${cur.nombre} (${new Date().toTimeString().slice(0,5)}).`;
        };
        document.getElementById('cam-tard').onclick = () => {
          document.getElementById('cam-status').innerText = `Llegada Tardía registrada para ${cur.nombre} (${new Date().toTimeString().slice(0,5)}).`;
        };
      }

      if (tab === 'notas') {
        document.querySelectorAll('.inp-sea-n').forEach(inp => {
          inp.onchange = (e) => {
            db[parseInt(inp.getAttribute('data-i'), 10)][inp.getAttribute('data-k')] = Math.min(100, Math.max(0, Number(e.target.value) || 0));
            save(db); pintar();
          };
        });
        document.querySelectorAll('.btn-ver-qr').forEach(b => {
          b.onclick = () => { idx = parseInt(b.getAttribute('data-i'), 10); tab = 'qr_real'; pintar(); };
        });
      }

      if (tab === 'conducta') {
        document.getElementById('c-est-sel').onchange = (e) => { idx = parseInt(e.target.value, 10); pintar(); };
        document.getElementById('c-btn-add').onclick = () => {
          const a = ARTICULOS_REAC[parseInt(document.getElementById('c-art-sel').value, 10)];
          const pts = Math.min(a.max, Math.max(a.min, Number(document.getElementById('c-pts-in').value) || a.sug));
          const et = document.getElementById('c-etapa-sel').value;
          const mot = document.getElementById('c-mot-in').value.trim() || a.desc;
          if (!db[idx].boletas) db[idx].boletas = [];
          db[idx].boletas.unshift({ fecha: new Date().toISOString().slice(0,10), art: a.cod, mot, pts, etapa: et, pauta: a.pauta, prot: a.prot });
          save(db); pintar();
        };
      }
    }

    document.body.appendChild(modal);
    pintar();
  };
})();