(function () {
  const PERM_KEY = "bds_permisos_edus_v193";
  const JUST_KEY = "bds_justificaciones_comp_v193";

  function loadPerm() {
    try { const d = JSON.parse(localStorage.getItem(PERM_KEY)); if (Array.isArray(d)) return d; } catch {}
    const seed = [
      { id: "PRM-101", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: "Prof. Carlos Quesada Mora", email: "carlos.quesada@mep.go.cr", rol: "Docente MEP", tipo: "Cita Médica CCSS / EDUS", fechaCita: "2026-11-24", horaSalida: "08:00", horaRegreso: "11:00", motivo: "Cita odontológica CCSS Heredia (pantallazo EDUS adjunto).", adjuntoNombre: "captura-cita-edus.png", adjuntoData: "", estado: "PENDIENTE", aprobadoPor: "", hash: "PRM99214A0B18F2C" }
    ];
    localStorage.setItem(PERM_KEY, JSON.stringify(seed));
    return seed;
  }
  function savePerm(a) { localStorage.setItem(PERM_KEY, JSON.stringify(a)); }

  function loadJust() {
    try { const d = JSON.parse(localStorage.getItem(JUST_KEY)); if (Array.isArray(d)) return d; } catch {}
    const seed = [
      { id: "JST-101", fechaCreacion: new Date().toLocaleDateString("es-CR"), persona: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", permisoRef: "PRM-100", fechaAusencia: "2026-11-19", horaInicio: "07:30", horaFin: "10:15", motivo: "Asistencia comprobada a cita médica CCSS (comprobante sellado adjunto).", adjuntoNombre: "comprobante-asistencia-ccss.pdf", adjuntoData: "", estado: "PENDIENTE", revisadoPor: "", hash: "JST81402F3C90E1A" }
    ];
    localStorage.setItem(JUST_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveJust(a) { localStorage.setItem(JUST_KEY, JSON.stringify(a)); }

  function readFileSmall(file) {
    return new Promise((resolve) => {
      if (!file) return resolve({ name: "", data: "" });
      const reader = new FileReader();
      reader.onload = (ev) => {
        const raw = ev.target.result || "";
        // Si es imagen grande, comprimir ligeramente para no llenar localStorage
        if (file.type.startsWith("image/") && file.size > 350000) {
          const img = new Image();
          img.onload = () => {
            const sc = Math.min(1, 900 / Math.max(img.width, img.height, 1));
            const cv = document.createElement("canvas");
            cv.width = Math.max(1, Math.round(img.width * sc));
            cv.height = Math.max(1, Math.round(img.height * sc));
            cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
            resolve({ name: file.name, data: cv.toDataURL("image/jpeg", 0.78) });
          };
          img.onerror = () => resolve({ name: file.name, data: raw.slice(0, 600000) });
          img.src = raw;
        } else {
          resolve({ name: file.name, data: file.size <= 700000 ? raw : "" });
        }
      };
      reader.onerror = () => resolve({ name: file.name, data: "" });
      reader.readAsDataURL(file);
    });
  }

  function verAdjuntoModal(nombre, dataUrl) {
    const old = document.getElementById("bds-att-modal"); if (old) old.remove();
    const m = document.createElement("div");
    m.id = "bds-att-modal";
    m.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.9);z-index:299000;display:flex;align-items:center;justify-content:center;padding:16px;";
    const esImg = dataUrl && dataUrl.startsWith("data:image/");
    m.innerHTML = `
      <div class="bds-card" style="max-width:640px;width:100%;max-height:90vh;overflow-y:auto;padding:18px;border-color:#38bdf8;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <b style="color:#38bdf8;">📎 Comprobante Adjunto: ${nombre || "Archivo"}</b>
          <button id="att-x" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;">✕</button>
        </div>
        ${esImg ? `<img src="${dataUrl}" style="max-width:100%;border-radius:8px;display:block;margin:0 auto;"/>` : (dataUrl ? `<a href="${dataUrl}" download="${nombre || 'comprobante'}" style="display:inline-block;background:#059669;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:800;">📥 Descargar ${nombre}</a>` : `<p style="color:#94a3b8;font-size:13px;">Archivo registrado: <b>${nombre}</b> (vista previa disponible para comprobantes cargados desde este dispositivo o sincronizados en nube).</p>`)}
      </div>
    `;
    document.body.appendChild(m);
    document.getElementById("att-x").onclick = () => m.remove();
  }

  window.BDS_RENDER_PERMISOS_JUSTIF = function (shell, tabInicial, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const puedeAprobarDir = ["SuperAdmin", "Director(a)", "Ministro(a) MEP"].includes(sesion.rol);
    const puedeValidarJust = ["SuperAdmin", "Director(a)", "Docente MEP", "Auxiliar Administrativo"].includes(sesion.rol);
    let tab = tabInicial || "permisos";
    let permAdj = { name: "", data: "" };
    let justAdj = { name: "", data: "" };

    function getBrand() {
      return window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", regional: "Dirección Regional de Heredia", circuito: "Circuito 02", escudo: "/escudo-ctpmn-oficial.jpeg", mascota: "/buho-oficial.png", logoMep: "/logo-mep-oficial.png" };
    }

    function draw() {
      const perms = loadPerm();
      const justs = loadJust();
      const b = getBrand();
      const misPerms = puedeAprobarDir ? perms : perms.filter(p => p.email.toLowerCase() === (sesion.email || "").toLowerCase());
      const misJusts = puedeValidarJust ? justs : justs.filter(j => j.email.toLowerCase() === (sesion.email || "").toLowerCase());
      const pendP = perms.filter(p => p.estado === "PENDIENTE").length;
      const pendJ = justs.filter(j => j.estado === "PENDIENTE").length;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#0f766e;color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">CONTROL DOCUMENTAL MEP • EDUS + COMPROBANTE HORARIO • QR SHA-256</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">📋 Gestión de Permisos, Justificaciones y Carné QR</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-pj="permisos" class="pj-tab" style="background:${tab==='permisos'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">📝 Gestionar Permisos${puedeAprobarDir && pendP ? ` (${pendP})` : ""}</button>
              <button data-pj="justificaciones" class="pj-tab" style="background:${tab==='justificaciones'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🎓 Gestionar Justificaciones${puedeValidarJust && pendJ ? ` (${pendJ})` : ""}</button>
              <button data-pj="qr" class="pj-tab" style="background:${tab==='qr'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🪪 Carné QR</button>
            </div>
          </div>

          ${tab === "permisos" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="pr-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:9px;">
                <h3 style="margin:0;font-size:15px;color:#38bdf8;">📝 Solicitar Permiso / Cita Previa</h3>
                <p style="margin:0;font-size:11.5px;color:#94a3b8;">Si corresponde a una cita médica o trámite oficial, adjunte el <b>pantallazo del EDUS</b> o boleta de citación.</p>
                <select id="pr-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;">
                  <option>Cita Médica CCSS / EDUS</option>
                  <option>Cita Médica Privada / Odontología</option>
                  <option>Asunto Personal / Familiar</option>
                  <option>Gira / Capacitación MEP</option>
                  <option>Citación Judicial / Oficial</option>
                </select>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                  <div><label style="font-size:10.5px;color:#94a3b8;">Fecha:</label><input id="pr-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                  <div><label style="font-size:10.5px;color:#94a3b8;">De (Hora):</label><input id="pr-h1" type="time" required value="08:00" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                  <div><label style="font-size:10.5px;color:#94a3b8;">Hasta:</label><input id="pr-h2" type="time" required value="11:00" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                </div>
                <textarea id="pr-mot" rows="2" required placeholder="Detalle del permiso o cita..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"></textarea>
                <label style="background:#131f33;border:1px dashed #38bdf8;color:#93c5fd;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;text-align:center;">
                  📎 ${permAdj.name ? `Adjunto listo: ${permAdj.name}` : "Adjuntar pantallazo EDUS o comprobante de cita (JPG/PNG/PDF)"}
                  <input id="pr-file" type="file" accept="image/*,.pdf" style="display:none;"/>
                </label>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">📤 Enviar Solicitud a Dirección</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#fbbf24;">🏛️ ${puedeAprobarDir ? "Bandeja de Dirección — Permisos" : "Mis Solicitudes de Permiso"} (${misPerms.length})</h3>
                <div style="display:flex;flex-direction:column;gap:9px;max-height:430px;overflow-y:auto;">
                  ${misPerms.map(p => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${p.estado==='APROBADO'?'#10b981':(p.estado==='RECHAZADO'?'#ef4444':'#f59e0b')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <b>${p.solicitante} (${p.rol})</b>
                        <span style="background:${p.estado==='APROBADO'?'#059669':(p.estado==='RECHAZADO'?'#dc2626':'#b45309')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;">${p.estado}</span>
                      </div>
                      <div style="color:#38bdf8;font-weight:700;margin:3px 0;">${p.tipo} • ${p.fechaCita} (${p.horaSalida} a ${p.horaRegreso})</div>
                      <div style="color:#cbd5e1;margin-bottom:6px;">${p.motivo}</div>
                      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                        ${p.adjuntoNombre ? `<button data-pvn="${p.id}" class="pr-ver" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">📎 Ver ${p.adjuntoNombre.slice(0,22)}</button>` : `<span style="font-size:11px;color:#64748b;">Sin adjunto</span>`}
                        ${puedeAprobarDir ? `<div style="display:flex;gap:5px;"><button data-pa="${p.id}" class="pr-ok" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✅ Aprobar</button><button data-pr="${p.id}" class="pr-no" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✕ Rechazar</button></div>` : `<code style="font-size:10px;color:#34d399;">SHA-256: ${p.hash}</code>`}
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin solicitudes registradas.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "justificaciones" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="ju-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:9px;">
                <h3 style="margin:0;font-size:15px;color:#34d399;">🎓 Presentar Justificación con Comprobante de Asistencia</h3>
                <p style="margin:0;font-size:11.5px;color:#94a3b8;">Obligatorio indicar el <b>rango horario exacto (de tal hora a tal hora)</b> y adjuntar el <b>comprobante de asistencia real</b> recibido tras la cita.</p>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <input id="ju-per" type="text" required value="${sesion.nombre}" placeholder="Nombre persona / estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
                  <input id="ju-sec" type="text" required value="${sesion.seccion || sesion.rol}" placeholder="Sección o puesto" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;"/>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                  <div><label style="font-size:10.5px;color:#94a3b8;">Fecha Ausencia:</label><input id="ju-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                  <div><label style="font-size:10.5px;color:#94a3b8;">Asistió De:</label><input id="ju-h1" type="time" required value="08:15" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                  <div><label style="font-size:10.5px;color:#94a3b8;">Hasta las:</label><input id="ju-h2" type="time" required value="10:30" style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/></div>
                </div>
                <select id="ju-ref" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12px;">
                  <option value="Sin permiso previo">Vincular a permiso previo (opcional)</option>
                  ${misPerms.map(p => `<option value="${p.id}">${p.id} — ${p.tipo} (${p.fechaCita})</option>`).join("")}
                </select>
                <textarea id="ju-mot" rows="2" required placeholder="Detalle del comprobante de asistencia (centro médico, firma/sello)..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"></textarea>
                <label style="background:#131f33;border:1px dashed #10b981;color:#6ee7b7;padding:10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;text-align:center;">
                  📎 ${justAdj.name ? `Comprobante cargado: ${justAdj.name}` : "OBLIGATORIO: Adjuntar Comprobante de Asistencia (foto/PDF)"}
                  <input id="ju-file" type="file" accept="image/*,.pdf" style="display:none;"/>
                </label>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:11px;border-radius:8px;font-weight:800;cursor:pointer;">✅ Enviar Justificación Oficial</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:14px;">
                <h3 style="margin:0 0 10px;font-size:15px;color:#34d399;">📄 Justificaciones con Comprobante Horario (${misJusts.length})</h3>
                <div style="display:flex;flex-direction:column;gap:9px;max-height:430px;overflow-y:auto;">
                  ${misJusts.map(j => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${j.estado==='VALIDADA'?'#10b981':(j.estado==='RECHAZADA'?'#ef4444':'#f59e0b')};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                        <b>${j.persona} (${j.seccion})</b>
                        <span style="background:${j.estado==='VALIDADA'?'#059669':(j.estado==='RECHAZADA'?'#dc2626':'#b45309')};color:#fff;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;">${j.estado}</span>
                      </div>
                      <div style="color:#34d399;font-weight:800;margin:3px 0;">📅 ${j.fechaAusencia} • Comprobado de ${j.horaInicio} a ${j.horaFin}</div>
                      <div style="color:#cbd5e1;margin-bottom:6px;">${j.motivo} <span style="font-size:10.5px;color:#94a3b8;">(${j.permisoRef})</span></div>
                      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                        ${j.adjuntoNombre ? `<button data-jvn="${j.id}" class="ju-ver" style="background:#131f33;color:#34d399;border:1px solid #334155;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">📎 Ver Comprobante</button>` : `<span style="font-size:11px;color:#f87171;">Sin comprobante</span>`}
                        ${puedeValidarJust ? `<div style="display:flex;gap:5px;"><button data-ja="${j.id}" class="ju-ok" style="background:#059669;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;">✅ Validar</button><button data-jr="${j.id}" class="ju-no" style="background:#7f1d1d;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✕ Rechazar</button></div>` : `<code style="font-size:10px;color:#34d399;">SHA-256: ${j.hash}</code>`}
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin justificaciones registradas.</p>`}
                </div>
              </div>
            </div>
          ` : ""}

          ${tab === "qr" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:16px;align-items:start;">
              <div style="background:linear-gradient(135deg,#0f2247 0%,#0b1322 100%);border:2px solid #38bdf8;border-radius:16px;padding:18px;text-align:center;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <img src="${b.escudo}" style="height:44px;background:#fff;padding:2px;border-radius:7px;"/>
                  <img src="${b.mascota}" style="height:44px;width:44px;border-radius:50%;object-fit:contain;"/>
                </div>
                <div style="font-size:10.5px;color:#38bdf8;font-weight:800;">${b.institucion.toUpperCase()}</div>
                <h3 style="margin:4px 0 2px;color:#fff;font-size:17px;">${sesion.nombre}</h3>
                <div style="font-size:12px;color:#93c5fd;margin-bottom:10px;">${sesion.rol} • ${sesion.seccion || "Institucional"}</div>
                <div style="display:inline-block;margin-bottom:8px;">${generarQRSVG(sesion.qr || ("PT-QR|" + sesion.email), 174)}</div>
                <div style="font-size:10px;font-family:monospace;color:#6ee7b7;background:#070d19;padding:5px 8px;border-radius:6px;word-break:break-all;">${sesion.qr || sesion.firma}</div>
              </div>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:14px;padding:16px;">
                <h3 style="margin:0 0 8px;font-size:15px;color:#38bdf8;">📷 Verificador Oficial de QR SHA-256</h3>
                <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">Escanea cualquier Carné Estudiantil, Carné Docente, Horario o Comprobante de Matrícula usando la cámara del dispositivo.</p>
                <button id="pj-scan" style="width:100%;background:#059669;color:#fff;border:none;padding:12px;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:10px;">📷 Abrir Cámara Nativa QR</button>
                <div id="pj-scan-res" style="background:#0b1322;border:1px solid #334155;border-radius:9px;padding:12px;font-size:12px;color:#cbd5e1;">Listo para escanear códigos QR SHA-256.</div>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".pj-tab").forEach(bt => bt.onclick = () => { tab = bt.getAttribute("data-pj"); draw(); });

      if (tab === "permisos") {
        document.getElementById("pr-file").onchange = async (e) => {
          permAdj = await readFileSmall(e.target.files[0]);
          draw();
        };
        document.getElementById("pr-f").onsubmit = async (e) => {
          e.preventDefault();
          const tipo = document.getElementById("pr-tip").value;
          const fec = document.getElementById("pr-fec").value;
          const h1 = document.getElementById("pr-h1").value;
          const h2 = document.getElementById("pr-h2").value;
          const mot = document.getElementById("pr-mot").value.trim();
          if (tipo.includes("EDUS") && !permAdj.name) {
            if (!confirm("No adjuntó pantallazo del EDUS o cita. ¿Desea enviarlo igualmente?")) return;
          }
          const arr = loadPerm();
          const id = "PRM-" + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${sesion.email}|${fec}|${h1}|${h2}`)).slice(0, 16);
          arr.unshift({ id, fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: sesion.nombre, email: sesion.email, rol: sesion.rol, tipo, fechaCita: fec, horaSalida: h1, horaRegreso: h2, motivo: mot, adjuntoNombre: permAdj.name, adjuntoData: permAdj.data, estado: "PENDIENTE", aprobadoPor: "", hash });
          savePerm(arr);
          permAdj = { name: "", data: "" };
          if (window.BDS_NOTIF) window.BDS_NOTIF.pushNative("📝 Nuevo Permiso Solicitado", `${sesion.nombre} solicitó ${tipo} (${fec} ${h1}-${h2}).`);
          draw();
        };
        shell.querySelectorAll(".pr-ver").forEach(bt => bt.onclick = () => {
          const p = loadPerm().find(x => x.id === bt.getAttribute("data-pvn"));
          if (p) verAdjuntoModal(p.adjuntoNombre, p.adjuntoData);
        });
        shell.querySelectorAll(".pr-ok").forEach(bt => bt.onclick = () => {
          const arr = loadPerm(), p = arr.find(x => x.id === bt.getAttribute("data-pa"));
          if (p) { p.estado = "APROBADO"; p.aprobadoPor = sesion.nombre; savePerm(arr); draw(); }
        });
        shell.querySelectorAll(".pr-no").forEach(bt => bt.onclick = () => {
          const arr = loadPerm(), p = arr.find(x => x.id === bt.getAttribute("data-pr"));
          if (p) { p.estado = "RECHAZADO"; p.aprobadoPor = sesion.nombre; savePerm(arr); draw(); }
        });
      }

      if (tab === "justificaciones") {
        document.getElementById("ju-file").onchange = async (e) => {
          justAdj = await readFileSmall(e.target.files[0]);
          draw();
        };
        document.getElementById("ju-f").onsubmit = async (e) => {
          e.preventDefault();
          if (!justAdj.name) {
            alert("⚠️ Debe adjuntar el comprobante de asistencia real (foto o PDF) indicando de qué hora a qué hora asistió.");
            return;
          }
          const per = document.getElementById("ju-per").value.trim();
          const sec = document.getElementById("ju-sec").value.trim();
          const fec = document.getElementById("ju-fec").value;
          const h1 = document.getElementById("ju-h1").value;
          const h2 = document.getElementById("ju-h2").value;
          const ref = document.getElementById("ju-ref").value;
          const mot = document.getElementById("ju-mot").value.trim();
          const arr = loadJust();
          const id = "JST-" + String(arr.length + 101);
          const hash = (await sha256Hex(`${id}|${per}|${fec}|${h1}|${h2}|${justAdj.name}`)).slice(0, 16);
          arr.unshift({ id, fechaCreacion: new Date().toLocaleDateString("es-CR"), persona: per, email: sesion.email, seccion: sec, permisoRef: ref, fechaAusencia: fec, horaInicio: h1, horaFin: h2, motivo: mot, adjuntoNombre: justAdj.name, adjuntoData: justAdj.data, estado: "PENDIENTE", revisadoPor: "", hash });
          saveJust(arr);
          justAdj = { name: "", data: "" };
          if (window.BDS_NOTIF) window.BDS_NOTIF.pushNative("🎓 Justificación con Comprobante", `${per} comprobó asistencia de ${h1} a ${h2} (${fec}).`);
          draw();
        };
        shell.querySelectorAll(".ju-ver").forEach(bt => bt.onclick = () => {
          const j = loadJust().find(x => x.id === bt.getAttribute("data-jvn"));
          if (j) verAdjuntoModal(j.adjuntoNombre, j.adjuntoData);
        });
        shell.querySelectorAll(".ju-ok").forEach(bt => bt.onclick = () => {
          const arr = loadJust(), j = arr.find(x => x.id === bt.getAttribute("data-ja"));
          if (j) { j.estado = "VALIDADA"; j.revisadoPor = sesion.nombre; saveJust(arr); draw(); }
        });
        shell.querySelectorAll(".ju-no").forEach(bt => bt.onclick = () => {
          const arr = loadJust(), j = arr.find(x => x.id === bt.getAttribute("data-jr"));
          if (j) { j.estado = "RECHAZADA"; j.revisadoPor = sesion.nombre; saveJust(arr); draw(); }
        });
      }

      if (tab === "qr") {
        document.getElementById("pj-scan").onclick = () => {
          if (!window.BDS_QR_CAMERA) return alert("Cámara QR no cargada.");
          window.BDS_QR_CAMERA.openModal({
            title: "Verificador Oficial QR SHA-256",
            onScan: (code) => {
              const out = document.getElementById("pj-scan-res");
              if (out) out.innerHTML = `<b style="color:#34d399;">✅ Código QR Verificado:</b><div style="font-family:monospace;margin-top:4px;word-break:break-all;color:#fff;">${code}</div>`;
            }
          });
        };
      }
    }
    draw();
  };
})();