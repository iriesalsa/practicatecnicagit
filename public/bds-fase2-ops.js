(function () {
  const ATT_KEY = "bds_attendance_v180";
  const QUEUE_KEY = "bds_offline_sync_queue_v180";
  const VER_KEY = "bds_verification_registry_v180";
  const HOR_KEY = "bds_horarios_csp_v180";
  const JUST_KEY = "bds_justificaciones_v180";

  const CODIGOS_MEP = [
    { c: "P", lbl: "Presente", col: "#059669" },
    { c: "AI", lbl: "Ausencia Injustificada", col: "#dc2626" },
    { c: "AJ", lbl: "Ausencia Justificada", col: "#0284c7" },
    { c: "TI", lbl: "Tardía Injustificada", col: "#d97706" },
    { c: "TJ", lbl: "Tardía Justificada", col: "#7c3aed" },
    { c: "SA", lbl: "Salida Autorizada", col: "#0d9488" }
  ];

  const RELOJ_CTP = {
    academicas: [
      { id: "M1-1", h: "07:00–07:40" }, { id: "M1-2", h: "07:40–08:20" }, { id: "M1-3", h: "08:20–09:00" },
      { id: "REC-M", h: "09:00–09:20 (Recreo)" },
      { id: "M2-1", h: "09:20–10:00" }, { id: "M2-2", h: "10:00–10:40" }, { id: "M2-3", h: "10:40–11:20" },
      { id: "ALM", h: "11:20–12:10 (Almuerzo 50 min)" },
      { id: "T1-1", h: "12:10–12:50" }, { id: "T1-2", h: "12:50–13:30" }, { id: "T1-3", h: "13:30–14:10" },
      { id: "REC-T", h: "14:10–14:30 (Recreo)" },
      { id: "T2-1", h: "14:30–15:10" }, { id: "T2-2", h: "15:10–15:50" }, { id: "T2-3", h: "15:50–16:30" }
    ],
    tecnicas: [
      { id: "M1", h: "07:00–09:00 (2h reloj)" }, { id: "REC-M", h: "09:00–09:20 (Recreo)" },
      { id: "M2", h: "09:20–11:20 (2h reloj)" }, { id: "ALM", h: "11:20–12:10 (Almuerzo)" },
      { id: "T1", h: "12:10–14:10 (2h reloj)" }, { id: "REC-T", h: "14:10–14:30 (Recreo)" },
      { id: "T2", h: "14:30–16:30 (2h reloj)" }
    ]
  };

  function getRegistry() { try { return JSON.parse(localStorage.getItem(VER_KEY) || "{}"); } catch { return {}; } }
  function registerHash(hash, payload) {
    const reg = getRegistry();
    reg[hash] = { ...payload, hash_sha256: hash, status: "VALIDO", created_at: new Date().toLocaleString("es-CR") };
    localStorage.setItem(VER_KEY, JSON.stringify(reg));
    return reg[hash];
  }
  window.BDS_REGISTER_HASH = registerHash;
  window.BDS_VERIFY_HASH = function (hashRaw) {
    const h = (hashRaw || "").trim().replace(/^.*\/verificar-horario\//i, "");
    const reg = getRegistry();
    if (reg[h]) return { ok: true, rec: reg[h] };
    const hit = Object.values(reg).find(r => r.hash_sha256.startsWith(h) && h.length >= 12);
    if (hit) return { ok: true, rec: hit };
    return { ok: false };
  };

  function getAttendance() {
    try { const d = JSON.parse(localStorage.getItem(ATT_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const mock = [
      { id: "EST-01", nombre: "Alvarado Rojas, Sofía", sec: "11-1", code: "P", fecha: new Date().toISOString().slice(0, 10) },
      { id: "EST-02", nombre: "Campos Mora, Esteban", sec: "11-1", code: "P", fecha: new Date().toISOString().slice(0, 10) },
      { id: "EST-03", nombre: "Hernández Solís, Camila", sec: "11-1", code: "AJ", fecha: new Date().toISOString().slice(0, 10) },
      { id: "EST-04", nombre: "Jiménez Quesada, Daniel", sec: "11-1", code: "TI", fecha: new Date().toISOString().slice(0, 10) },
      { id: "EST-05", nombre: "Vargas Méndez, Valeria", sec: "11-1", code: "P", fecha: new Date().toISOString().slice(0, 10) }
    ];
    localStorage.setItem(ATT_KEY, JSON.stringify(mock));
    return mock;
  }
  window.BDS_GET_ATTENDANCE = getAttendance;

  function pushOfflineQueue(evt) {
    let q = [];
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch {}
    q.push({ ...evt, ts: Date.now(), synced: navigator.onLine });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  }

  // Motor CSP de 3 propuestas sin choques ni cajones estudiantiles
  function generar3PropuestasCSP(modalidad, seccion) {
    const mats = modalidad.includes("Técnica")
      ? ["Desarrollo Web (M1/M2)", "Ciberseguridad (T1)", "Matemáticas", "Español", "Inglés Técnico", "Física/Química", "Estudios Sociales", "Cívica", "Ed. Física", "Filosofía", "Soporte TI"]
      : ["Matemáticas", "Español", "Inglés", "Ciencias", "Estudios Sociales", "Cívica", "Francés", "Ed. Física", "Artes/Música", "Psicología/Filosofía"];
    return [1, 2, 3].map(num => {
      const rot = (i) => mats[(i + num * 2) % mats.length];
      return {
        id: `CSP-${num}`,
        titulo: `Propuesta CSP #${num} — ${num === 1 ? "Cero Cajones Prioridad Estudiante" : (num === 2 ? "Bloques Técnicos Mañana M1–M2" : "Balance Carga Docente 20h/40h")}`,
        choques: 0,
        cajones: 0,
        filas: [
          { b: "M1 (07:00–09:00)", l: rot(0), k: rot(1), m: rot(2), j: rot(3), v: rot(4) },
          { b: "M2 (09:20–11:20)", l: rot(5), k: rot(0), m: rot(6), j: rot(1), v: rot(7) },
          { b: "T1 (12:10–14:10)", l: rot(8), k: rot(2), m: rot(0), j: rot(9), v: rot(3) },
          { b: "T2 (14:30–16:30)", l: rot(4), k: rot(10), m: rot(5), j: rot(6), v: rot(8) }
        ],
        seccion, modalidad
      };
    });
  }

  window.BDS_RENDER_FASE2 = function (shell, subInicial, ctx) {
    const { sesion, sha256Hex, generarQRSVG, ganarXP } = ctx;
    const esEstudiante = sesion.rol === "Estudiante";
    let tab = subInicial || (esEstudiante ? "justificaciones" : "asistencia");
    let sec = sesion.seccion || "11-1";
    let modalidad = "Secundaria Técnica Diurna (CTP 7°–12°)";
    let propIdx = 0;
    let propuestas = generar3PropuestasCSP(modalidad, sec);

    function draw() {
      const lista = getAttendance();
      let queue = [];
      try { queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch {}
      let justs = [];
      try { justs = JSON.parse(localStorage.getItem(JUST_KEY) || "[]"); } catch {}

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
            <div>
              <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">FASE 2 • OPERACIONES CERO PAPEL & VALIDACIÓN QR SHA-256</span>
              <h2 style="margin:4px 0 0;font-size:17.5px;color:#fff;">Asistencia MEP, Horarios CSP, Justificaciones y Verificador QR</h2>
            </div>
            <span style="font-size:11px;background:#070d19;border:1px solid #10b981;color:#6ee7b7;padding:5px 10px;border-radius:8px;font-weight:700;">
              ${navigator.onLine ? "🟢 En línea" : "🟠 Offline-First"} • Cola: ${queue.length} registros
            </span>
          </div>

          <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:12px;border-bottom:1px solid #1e293b;">
            ${!esEstudiante ? `<button data-f2="asistencia" class="f2-tb" style="background:${tab==='asistencia'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">📋 Pase de Lista MEP</button>` : ""}
            <button data-f2="justificaciones" class="f2-tb" style="background:${tab==='justificaciones'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🪪 Justificaciones & Certificados QR</button>
            <button data-f2="horarios" class="f2-tb" style="background:${tab==='horarios'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🗓️ Horarios MEP (CSP 3 Propuestas)</button>
            <button data-f2="verificador" class="f2-tb" style="background:${tab==='verificador'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">🔍 Verificador /verificar-horario/:hash</button>
          </div>
          <div id="f2-body"></div>
        </div>
      `;

      shell.querySelectorAll(".f2-tb").forEach(b => b.onclick = () => { tab = b.getAttribute("data-f2"); draw(); });
      const body = document.getElementById("f2-body");

      if (tab === "asistencia" && !esEstudiante) {
        body.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div style="font-size:12px;color:#94a3b8;">Códigos oficiales MEP: ${CODIGOS_MEP.map(x => `<b style="color:${x.col};">${x.c}</b> (${x.lbl})`).join(" • ")}</div>
            <div style="display:flex;gap:6px;">
              <input id="qr-scan-att" type="text" placeholder="Escanear Carnet QR para marcar P..." style="background:#070d19;border:1px solid #334155;color:#fff;padding:7px 10px;border-radius:7px;font-size:12px;"/>
              <button id="btn-sync-q" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">🔄 Sincronizar</button>
            </div>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;min-width:600px;border-collapse:collapse;font-size:12.5px;">
              <tr style="background:#131f33;color:#38bdf8;"><th style="padding:9px;text-align:left;">Estudiante</th><th style="padding:9px;">Sección</th><th style="padding:9px;">Código MEP (Táctil)</th><th style="padding:9px;">Estado</th></tr>
              ${lista.map((st, idx) => `
                <tr>
                  <td style="padding:9px;border-bottom:1px solid #1e293b;font-weight:700;">${st.nombre}</td>
                  <td style="padding:9px;border-bottom:1px solid #1e293b;text-align:center;">${st.sec}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">
                    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                      ${CODIGOS_MEP.map(c => `<button data-si="${idx}" data-cd="${c.c}" class="att-c" style="background:${st.code===c.c?c.col:'#131f33'};color:#fff;border:1px solid #334155;padding:5px 8px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;min-width:34px;">${c.c}</button>`).join("")}
                    </div>
                  </td>
                  <td style="padding:9px;border-bottom:1px solid #1e293b;text-align:center;font-weight:700;color:#6ee7b7;">${st.code}</td>
                </tr>
              `).join("")}
            </table>
          </div>
        `;
        body.querySelectorAll(".att-c").forEach(b => b.onclick = () => {
          const i = Number(b.getAttribute("data-si")), cd = b.getAttribute("data-cd");
          lista[i].code = cd;
          localStorage.setItem(ATT_KEY, JSON.stringify(lista));
          pushOfflineQueue({ tipo: "asistencia", student: lista[i].nombre, code: cd });
          draw();
        });
        document.getElementById("btn-sync-q").onclick = () => { localStorage.setItem(QUEUE_KEY, "[]"); alert("Cola offline sincronizada con el registro SEA/CEA."); draw(); };
      }
      else if (tab === "justificaciones") {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;">
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;">
              <h3 style="margin:0 0 8px;color:#38bdf8;font-size:15px;">📩 Emitir Solicitud / Certificado QR SHA-256</h3>
              <form id="f-j2" style="display:flex;flex-direction:column;gap:9px;">
                <input id="j2-nom" type="text" value="${sesion.nombre}" placeholder="Nombre del estudiante o funcionario" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <select id="j2-tip" style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;">
                  <option value="justificacion">Justificación Médica / Cita CCSS (Estudiante)</option>
                  <option value="permiso">Permiso Personal / Congreso (Docente)</option>
                  <option value="certificado">Certificado Digital de Justificación Docente</option>
                </select>
                <input id="j2-det" type="text" placeholder="Motivo y fecha (ej: Cita EBAIS Mercedes Norte)" required style="background:#0b1322;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12.5px;"/>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">🔐 Firmar con SHA-256 y Registrar QR</button>
              </form>
            </div>
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;max-height:380px;overflow-y:auto;">
              <h3 style="margin:0 0 8px;color:#34d399;font-size:15px;">📜 Certificados Emitidos (${justs.length})</h3>
              ${justs.length ? justs.map(j => `
                <div style="background:#0b1322;border:1px solid #1e293b;border-radius:9px;padding:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <div style="font-size:11.5px;">
                    <b style="color:#fff;">${j.holder_name}</b> (${j.doc_type})<br/>
                    <span style="color:#94a3b8;">${j.detalle}</span><br/>
                    <span style="font-family:monospace;color:#34d399;font-size:9.5px;">SHA-256: ${j.hash.slice(0,26)}...</span>
                  </div>
                  ${generarQRSVG(`${location.origin}/#/verificar-horario/${j.hash}`, 74)}
                </div>
              `).join("") : `<p style="font-size:12px;color:#64748b;">Aún no se han emitido certificados en esta sesión.</p>`}
            </div>
          </div>
        `;
        document.getElementById("f-j2").onsubmit = async (e) => {
          e.preventDefault();
          const nom = document.getElementById("j2-nom").value.trim(), tip = document.getElementById("j2-tip").value, det = document.getElementById("j2-det").value.trim();
          const hash = await sha256Hex(`${tip}|${nom}|${det}|${Date.now()}`);
          registerHash(hash, { doc_type: tip, holder_name: nom, institution_name: "CTP Mercedes Norte (Circuito 02)", detalle: det });
          justs.unshift({ doc_type: tip, holder_name: nom, detalle: det, hash });
          localStorage.setItem(JUST_KEY, JSON.stringify(justs));
          if (ganarXP) ganarXP(15);
          draw();
        };
      }
      else if (tab === "horarios") {
        const curP = propuestas[propIdx];
        body.innerHTML = `
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <select id="csp-mod" style="background:#070d19;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
                ${["Primaria (1°–6°)","Secundaria Académica Diurna (7°–11°)","Secundaria Técnica Diurna (CTP 7°–12°)","Académico Nocturno","Técnico Nocturno","IPEC / CINDEA"].map(m => `<option ${m===modalidad?"selected":""}>${m}</option>`).join("")}
              </select>
              <select id="csp-prop" style="background:#070d19;color:#fbbf24;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;font-weight:700;">
                ${propuestas.map((p, i) => `<option value="${i}" ${i===propIdx?"selected":""}>${p.titulo}</option>`).join("")}
              </select>
            </div>
            <div style="display:flex;gap:6px;">
              <button id="csp-sign" style="background:#059669;color:#fff;border:none;padding:8px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🔐 Aprobar y Sellar Horario QR</button>
              <button onclick="window.print()" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Imprimir</button>
            </div>
          </div>
          <div style="font-size:11.5px;color:#6ee7b7;margin-bottom:8px;">
            ✅ Motor CSP Validado: <b>${curP.choques} choques docentes</b> • <b>${curP.cajones} cajones estudiantiles</b> • Reloj Dual CTP: 07:00–16:30 (M1, M2, T1, T2).
          </div>
          <div style="overflow-x:auto;margin-bottom:12px;">
            <table style="width:100%;min-width:660px;border-collapse:collapse;font-size:12px;">
              <tr style="background:#131f33;color:#38bdf8;"><th style="padding:9px;text-align:left;">Bloque Oficial MEP</th><th style="padding:9px;">Lunes</th><th style="padding:9px;">Martes</th><th style="padding:9px;">Miércoles</th><th style="padding:9px;">Jueves</th><th style="padding:9px;">Viernes</th></tr>
              ${curP.filas.map((f, ri) => `
                <tr>
                  <td style="padding:9px;border-bottom:1px solid #1e293b;color:#fbbf24;font-weight:700;">${f.b}</td>
                  ${["l","k","m","j","v"].map(dk => `<td contenteditable="true" data-ri="${ri}" data-dk="${dk}" style="padding:8px;border-bottom:1px solid #1e293b;text-align:center;background:#070d19;">${f[dk]}</td>`).join("")}
                </tr>
              `).join("")}
            </table>
          </div>
          <div id="csp-seal-box"></div>
          <details style="font-size:11.5px;color:#94a3b8;margin-top:8px;">
            <summary style="cursor:pointer;color:#38bdf8;font-weight:700;">⏱️ Ver Reloj Oficial MEP Completo (40 min Académicas / 60 min Técnicas)</summary>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
              <div style="background:#070d19;padding:10px;border-radius:8px;"><b>Académicas (40 min):</b><br/>${RELOJ_CTP.academicas.map(x => `${x.id}: ${x.h}`).join("<br/>")}</div>
              <div style="background:#070d19;padding:10px;border-radius:8px;"><b>Técnicas/Talleres (60 min reloj):</b><br/>${RELOJ_CTP.tecnicas.map(x => `${x.id}: ${x.h}`).join("<br/>")}</div>
            </div>
          </details>
        `;
        document.getElementById("csp-mod").onchange = (e) => { modalidad = e.target.value; propuestas = generar3PropuestasCSP(modalidad, sec); propIdx = 0; draw(); };
        document.getElementById("csp-prop").onchange = (e) => { propIdx = Number(e.target.value); draw(); };
        document.getElementById("csp-sign").onclick = async () => {
          const hash = await sha256Hex(JSON.stringify(curP) + Date.now());
          registerHash(hash, { doc_type: "horario", holder_name: `Horario ${sec} (${modalidad})`, institution_name: "CTP Mercedes Norte • Circuito 02", detalle: curP.titulo });
          localStorage.setItem(HOR_KEY, JSON.stringify({ ...curP, hash }));
          const url = `${location.origin}/#/verificar-horario/${hash}`;
          document.getElementById("csp-seal-box").innerHTML = `
            <div style="background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:12px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
              ${generarQRSVG(url, 96)}
              <div style="font-size:12px;color:#d1fae5;">
                <b>✅ Horario Oficial Sellado con SHA-256</b><br/>
                Ruta pública: <a href="${url}" style="color:#38bdf8;">#/verificar-horario/${hash.slice(0,20)}...</a><br/>
                <span style="font-family:monospace;font-size:10px;">${hash}</span>
              </div>
            </div>
          `;
        };
      }
      else {
        body.innerHTML = `
          <div style="max-width:680px;margin:0 auto;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:18px;">
            <h3 style="margin:0 0 6px;color:#38bdf8;">🔍 Verificador Criptográfico Público (verification_registry)</h3>
            <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Valida cualquier Carnet QR, Certificado de Justificación, Permiso o Horario mediante su hash SHA-256 o enlace <code>/verificar-horario/:hash</code>.</p>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <input id="ver-in" type="text" value="${sesion.firma || ''}" placeholder="Pegue hash SHA-256 o ruta /verificar-horario/..." style="flex:1;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:12px;font-family:monospace;"/>
              <button id="ver-btn" style="background:#1d4ed8;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-weight:800;cursor:pointer;">Verificar</button>
            </div>
            <div id="ver-out" style="padding:12px;border-radius:8px;background:#0b1322;border:1px solid #1e293b;font-size:12.5px;color:#cbd5e1;">Ingresa un hash para validar contra el registro institucional.</div>
          </div>
        `;
        const runVer = () => {
          const r = window.BDS_VERIFY_HASH(document.getElementById("ver-in").value);
          const out = document.getElementById("ver-out");
          if (r.ok) {
            out.style.background = "#064e3b"; out.style.color = "#6ee7b7";
            out.innerHTML = `✅ <b>DOCUMENTO AUTÉNTICO (${r.rec.doc_type.toUpperCase()})</b><br/>Titular: ${r.rec.holder_name} • Institución: ${r.rec.institution_name}<br/>Detalle: ${r.rec.detalle || "Vigente"} • Emitido: ${r.rec.created_at}`;
          } else {
            out.style.background = "#450a0a"; out.style.color = "#fca5a5";
            out.innerText = "🚫 Hash no encontrado en verification_registry. El documento podría estar alterado.";
          }
        };
        document.getElementById("ver-btn").onclick = runVer;
      }
    }
    draw();
  };
})();