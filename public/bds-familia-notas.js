(function () {
  const FAM_KEY = "bds_familia_links_v194";
  const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  function loadFamLinks() {
    try { const d = JSON.parse(localStorage.getItem(FAM_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { parentEmail: "familia.alvarado@gmail.com", parentId: "PAD-2026-01", parentName: "Ana Rojas Vega", childEmail: "sofia.alvarado@est.mep.go.cr" },
      { parentEmail: "familia.campos@gmail.com", parentId: "PAD-2026-02", parentName: "Luis Campos Solís", childEmail: "esteban.campos@est.mep.go.cr" }
    ];
    localStorage.setItem(FAM_KEY, JSON.stringify(seed));
    return seed;
  }

  function getRoster() { try { return JSON.parse(localStorage.getItem("bds_docente_roster_v190")) || []; } catch { return []; } }
  function getPesos() { try { const p = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190")); if (p) return p; } catch {} return { cotidiano: 35, tareas: 10, pruebas: 35, proyecto: 10, asistencia: 10 }; }
  function getHorarioHijo(seccion) {
    try {
      const h = JSON.parse(localStorage.getItem("bds_horarios_ia_v187") || "null");
      if (h && h.grid && h.grid[seccion]) return { bloques: h.bloques || [], diasGrid: h.grid[seccion], jornada: h.jornada || "", anio: h.anio || "2027" };
    } catch {}
    return null;
  }

  function imprimirBoletinEstudianteQR(est, pesos, generarQRSVG, hash) {
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", regional: "Heredia", circuito: "Circuito 02", escudo: "/escudo-ctpmn-oficial.jpeg?v=206", logoMep: "/logo-mep-oficial.png?v=206" };
    const cPts = (Number(est.cotidiano || 0) * pesos.cotidiano / 100).toFixed(1);
    const tPts = (Number(est.tareas || 0) * pesos.tareas / 100).toFixed(1);
    const pPts = (Number(est.pruebas || 0) * pesos.pruebas / 100).toFixed(1);
    const prPts = (Number(est.proyecto || 0) * pesos.proyecto / 100).toFixed(1);
    const aPts = Number(pesos.asistencia || 10).toFixed(1);
    const tot = (Number(cPts) + Number(tPts) + Number(pPts) + Number(prPts) + Number(aPts)).toFixed(1);
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el boletín oficial.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Boletín Oficial - ${est.nombre}</title><style>body{font-family:Inter,Arial,sans-serif;padding:26px;color:#0f172a;font-size:12.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:16px}table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:14px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:58px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div>${b.regional} • ${b.circuito}</div><h3 style="margin:4px 0 0;color:#0f766e">CONSTANCIA DE NOTAS (SOLO CONSULTA • QR SHA-256)</h3></div><img src="${b.logoMep}" style="height:44px"/></div><p><b>Estudiante:</b> ${est.nombre} &nbsp;|&nbsp; <b>Sección:</b> ${est.seccion} &nbsp;|&nbsp; <b>Asignatura:</b> ${est.materia}</p><table><tr><th>Componente REACC</th><th>Valor %</th><th>Nota %</th><th>Puntos</th></tr><tr><td>Cotidiano</td><td>${pesos.cotidiano}%</td><td>${est.cotidiano}%</td><td><b>${cPts}/${pesos.cotidiano}</b></td></tr><tr><td>Tareas</td><td>${pesos.tareas}%</td><td>${est.tareas}%</td><td><b>${tPts}/${pesos.tareas}</b></td></tr><tr><td>Pruebas</td><td>${pesos.pruebas}%</td><td>${est.pruebas}%</td><td><b>${pPts}/${pesos.pruebas}</b></td></tr><tr><td>Proyecto</td><td>${pesos.proyecto}%</td><td>${est.proyecto}%</td><td><b>${prPts}/${pesos.proyecto}</b></td></tr><tr><td>Asistencia</td><td>${pesos.asistencia}%</td><td>100%</td><td><b>${aPts}/${pesos.asistencia}</b></td></tr><tr style="background:#f1f5f9"><td colspan="3"><b>PROMEDIO FINAL</b></td><td><b style="font-size:15px">${tot}%</b></td></tr></table><div class="qr">${generarQRSVG("PT-NOTA|" + hash, 94)}<div><b>Boletín Verificable QR SHA-256</b><br/><code>${hash}</code></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  window.BDS_RENDER_MIS_NOTAS_ESTUDIANTE = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const roster = getRoster(), pesos = getPesos(), mail = (sesion.email || "").toLowerCase();
    let mios = roster.filter(r => (r.email || "").toLowerCase() === mail);
    if (!mios.length) mios = [{ id: "EST-PROPIO", nombre: sesion.nombre, email: mail, seccion: sesion.seccion || "11-1", materia: "Promedio General", cotidiano: 0, tareas: 0, pruebas: 0, proyecto: 0 }];

    shell.innerHTML = `
      <div class="bds-card">
        <div style="border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
          <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">SOLO CONSULTA • IMPRIMIBLE CON QR SHA-256</span>
          <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">📊 Mis Notas Oficiales — ${sesion.nombre}</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${mios.map((e, i) => {
            const cPts = (Number(e.cotidiano||0)*pesos.cotidiano/100).toFixed(1), tPts = (Number(e.tareas||0)*pesos.tareas/100).toFixed(1);
            const pPts = (Number(e.pruebas||0)*pesos.pruebas/100).toFixed(1), prPts = (Number(e.proyecto||0)*pesos.proyecto/100).toFixed(1);
            const tot = (Number(cPts)+Number(tPts)+Number(pPts)+Number(prPts)+Number(pesos.asistencia||10)).toFixed(1);
            return `<div style="background:#070d19;border:1px solid #334155;border-radius:12px;padding:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                <div><b style="color:#fff;font-size:14px;">${e.materia}</b> <span style="color:#94a3b8;font-size:11.5px;">(Sección ${e.seccion})</span></div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <span style="background:${Number(tot)>=70?'#059669':'#dc2626'};color:#fff;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700;">Nota: ${tot}%</span>
                  <button data-mi="${i}" class="mn-prt" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir QR</button>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:7px;font-size:11.5px;">
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Cotidiano: <b style="color:#38bdf8;">${cPts}/${pesos.cotidiano}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Tareas: <b style="color:#38bdf8;">${tPts}/${pesos.tareas}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Pruebas: <b style="color:#38bdf8;">${pPts}/${pesos.pruebas}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Proyecto: <b style="color:#38bdf8;">${prPts}/${pesos.proyecto}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Asistencia: <b style="color:#34d399;">${pesos.asistencia}/${pesos.asistencia}</b></div>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
    `;
    shell.querySelectorAll(".mn-prt").forEach(bt => bt.onclick = async () => {
      const est = mios[Number(bt.getAttribute("data-mi"))];
      const h = (await sha256Hex(`BOLETIN|${est.email}|${est.materia}|${Date.now()}`)).slice(0, 18);
      imprimirBoletinEstudianteQR(est, pesos, generarQRSVG, h);
    });
  };

  window.BDS_FAMILIA_API = { loadFamLinks, getHorarioHijo };

  window.BDS_RENDER_PORTAL_FAMILIA = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const links = loadFamLinks(), roster = getRoster(), pesos = getPesos();
    const mail = (sesion.email || "").toLowerCase();
    let misLinks = links.filter(l => l.parentEmail.toLowerCase() === mail);
    let hijos = roster.filter(e => misLinks.some(l => l.childEmail.toLowerCase() === (e.email || "").toLowerCase()));
    if (!hijos.length && roster.length) hijos = [roster[0]];
    const parentId = (misLinks[0] && misLinks[0].parentId) || ("PAD-" + String(Date.now()).slice(-4));
    const qrPadre = `PT-PADRE|v206|${parentId}|${mail}|${(sesion.firma || "SHA256").slice(0, 14)}`;

    let famTab = "resumen"; // resumen | horario | salidas
    let hijoSelIdx = 0;
    let famAdj = { name: "", data: "" };

    function drawF() {
      const hijoSel = hijos[hijoSelIdx] || hijos[0];
      const horHijo = hijoSel ? getHorarioHijo(hijoSel.seccion) : null;
      const hijosMails = hijos.map(h => (h.email || "").toLowerCase());
      const salidasHijos = window.BDS_PERMISOS_API
        ? window.BDS_PERMISOS_API.loadPerm().filter(p => (p.categoria === "ESTUDIANTE" || p.rol === "Estudiante") && (hijosMails.includes((p.email || "").toLowerCase()) || hijos.some(h => (p.solicitante || "").includes(h.nombre))))
        : [];

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:13px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">PORTAL FAMILIA • HORARIO EN VIVO • SALIDAS ANTICIPADAS QR • PRODHAB</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">👨‍👩‍👧‍👦 Encargado(a) Legal: ${sesion.nombre} (${parentId})</h2>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button data-ft="resumen" class="fm-t" style="background:${famTab==='resumen'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🎒 Hijos y Notas</button>
                <button data-ft="horario" class="fm-t" style="background:${famTab==='horario'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📅 Horario de Mis Hijos</button>
                <button data-ft="salidas" class="fm-t" style="background:${famTab==='salidas'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚪 Salidas y Enfermedad (${salidasHijos.length})</button>
              </div>
              <div style="text-align:center;">${generarQRSVG(qrPadre, 64)}</div>
            </div>
          </div>

          ${famTab === "resumen" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:10px;">
              ${hijos.map((h, i) => {
                const tot = ((Number(h.cotidiano||0)*pesos.cotidiano + Number(h.tareas||0)*pesos.tareas + Number(h.pruebas||0)*pesos.pruebas + Number(h.proyecto||0)*pesos.proyecto)/100 + Number(pesos.asistencia||10)).toFixed(1);
                const pMap = (() => { try { return JSON.parse(localStorage.getItem("bds_parental_ctrl_v198")) || {}; } catch { return {}; } })();
                const pr = pMap[(h.email || "").toLowerCase()] || { allowChat: true, allowCoope: true, dailyLimitCRC: 0 };
                const wC = window.BDS_COOPE_API ? window.BDS_COOPE_API.findWalletByQR(h.email) : null;
                return `<div style="background:#070d19;border:1px solid #334155;border-left:4px solid #38bdf8;border-radius:11px;padding:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;"><b>${h.nombre}</b><span style="background:#059669;color:#fff;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;">${tot}%</span></div>
                  <div style="font-size:11.5px;color:#94a3b8;margin:4px 0;">Sección ${h.seccion} • ${h.materia}</div>
                  ${wC ? `<div style="font-size:11px;color:#2dd4bf;margin-bottom:6px;">🏪 Cooperativa: <b>₡${Number(wC.saldoCRC||0).toLocaleString("es-CR")}</b> • 🌿 <b>${wC.ecoPuntos||0} EcoMEPs</b></div>` : ""}
                  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                    <button data-hi="${i}" class="fam-prt" style="background:#1d4ed8;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">🖨️ Notas QR</button>
                    <button data-vh="${i}" class="fam-vh" style="background:#0f766e;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">📅 Ver Horario</button>
                  </div>
                  <div style="padding-top:7px;border-top:1px solid #1e293b;font-size:11px;">
                    <div style="color:#fbbf24;font-weight:700;margin-bottom:4px;">🛡️ Control Parental (Ley 8968 / Ley 7739):</div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                      <label style="cursor:pointer;"><input type="checkbox" data-pmail="${h.email}" data-pk="allowChat" class="pc-tg" ${pr.allowChat!==false?"checked":""}/> Chats</label>
                      <label style="cursor:pointer;"><input type="checkbox" data-pmail="${h.email}" data-pk="allowCoope" class="pc-tg" ${pr.allowCoope!==false?"checked":""}/> Cooperativa</label>
                      <input type="number" min="0" step="500" data-pmail="${h.email}" class="pc-lim" value="${pr.dailyLimitCRC||0}" title="Límite diario ₡" placeholder="Límite ₡/día" style="width:90px;background:#0b1322;color:#fff;border:1px solid #334155;padding:3px 6px;border-radius:5px;font-size:11px;"/>
                    </div>
                  </div>
                </div>`;
              }).join("")}
            </div>
          ` : ""}

          ${famTab === "horario" ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <div>
                <b style="color:#38bdf8;font-size:14px;">📅 Horario Semanal Oficial de ${hijoSel ? `${hijoSel.nombre} (Sección ${hijoSel.seccion})` : "su hijo(a)"}</b>
                <div style="font-size:11px;color:#94a3b8;">Revise las lecciones y horarios de salida antes de autorizar una salida anticipada.</div>
              </div>
              <select id="fm-hsel" style="background:#070d19;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:12px;">
                ${hijos.map((h, i) => `<option value="${i}" ${hijoSelIdx===i?"selected":""}>${h.nombre} (${h.seccion})</option>`).join("")}
              </select>
            </div>
            ${horHijo ? `
              <div style="overflow-x:auto;">
                <table style="width:100%;min-width:680px;border-collapse:collapse;font-size:11.5px;">
                  <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Bloque</th>${DIAS.map(d => `<th style="padding:7px;text-align:left;">${d}</th>`).join("")}</tr>
                  ${horHijo.bloques.map(blq => `<tr><td style="padding:7px;border:1px solid #1e293b;background:#070d19;color:#fbbf24;font-weight:700;white-space:nowrap;">${blq}</td>${DIAS.map(d => { const c = horHijo.diasGrid[d] && horHijo.diasGrid[d][blq]; return `<td style="padding:7px;border:1px solid #1e293b;background:#0b1322;">${c ? `<b>${c.materia}</b><div style="font-size:10px;color:#94a3b8;">${c.docente} • ${c.aula}</div>` : `<span style="color:#475569;">Libre</span>`}</td>`; }).join("")}</tr>`).join("")}
                </table>
              </div>
            ` : `<div style="background:#070d19;border:1px solid #334155;border-radius:10px;padding:14px;font-size:12px;color:#94a3b8;">El horario oficial de la sección <b>${hijoSel ? hijoSel.seccion : ""}</b> se mostrará aquí automáticamente en cuanto Dirección publique el horario.</div>`}
          ` : ""}

          ${famTab === "salidas" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start;">
              <form id="fam-sal-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:13px;display:flex;flex-direction:column;gap:8px;">
                <h3 style="margin:0;font-size:14.5px;color:#34d399;">🚪 Solicitar y Autorizar Salida Anticipada / Enfermedad (QR)</h3>
                <select id="ft-hij" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                  ${hijos.map(h => `<option value="${h.nombre}|${h.seccion}|${h.email}">${h.nombre} (${h.seccion})</option>`).join("")}
                </select>
                <select id="ft-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;">
                  <option>Salida Anticipada (Cita Médica / EDUS)</option>
                  <option>Salida Anticipada por Enfermedad</option>
                  <option>Justificación por Enfermedad con Comprobante</option>
                  <option>Justificación de Tardía (Docentes / Auxiliares)</option>
                </select>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
                  <input id="ft-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
                  <input id="ft-h1" type="time" value="10:00" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
                  <input id="ft-h2" type="time" value="16:20" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
                </div>
                <input id="ft-mot" type="text" required placeholder="Motivo y persona autorizada que retira al estudiante..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <label style="background:#131f33;border:1px dashed #10b981;color:#6ee7b7;padding:9px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;">
                  📎 ${famAdj.name ? `Comprobante: ${famAdj.name}` : "Subir Comprobante (Foto, PDF o Screenshot EDUS/Médico)"}
                  <input id="ft-file" type="file" accept="image/*,.pdf" style="display:none;"/>
                </label>
                <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">✍️ Autorizar como Encargado Legal y Enviar a Auxiliares</button>
              </form>

              <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:13px;">
                <h3 style="margin:0 0 9px;font-size:14.5px;color:#fbbf24;">✅ Revisar y Aprobar Salidas de Mis Hijos (${salidasHijos.length})</h3>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:390px;overflow-y:auto;">
                  ${salidasHijos.map(s => `
                    <div style="background:#0b1322;border:1px solid #334155;border-left:4px solid ${s.autorizadoEncargado?'#10b981':'#f59e0b'};border-radius:9px;padding:10px;font-size:12px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:5px;">
                        <b>${s.solicitante} (${s.seccion || ""})</b>
                        <span style="background:${s.estado==='APROBADO'?'#059669':'#b45309'};color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;">${s.estado}</span>
                      </div>
                      <div style="color:#38bdf8;font-weight:600;margin:3px 0;">${s.tipo} • ${s.fechaCita} (${s.horaSalida} a ${s.horaRegreso})</div>
                      <div style="color:#cbd5e1;margin-bottom:6px;">${s.motivo}</div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
                        ${s.autorizadoEncargado
                          ? `<span style="color:#34d399;font-size:11px;font-weight:700;">✅ Autorizado por Familia (${s.fechaAutorizacionEnc || ""})</span>`
                          : `<button data-fsok="${s.id}" class="fm-ok" style="background:#059669;color:#fff;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">✍️ Aprobar Salida Anticipada (QR)</button>`}
                        ${s.adjuntoNombre ? `<button data-fsv="${s.id}" class="fm-ver" style="background:#131f33;color:#38bdf8;border:1px solid #334155;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;">👁️ Comprobante</button>` : ""}
                      </div>
                    </div>
                  `).join("") || `<p style="font-size:12px;color:#64748b;margin:0;">Sin solicitudes de salida anticipada registradas.</p>`}
                </div>
              </div>
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".fm-t").forEach(b => b.onclick = () => { famTab = b.getAttribute("data-ft"); drawF(); });

      if (famTab === "resumen") {
        const savePR = (em, patch) => { let m = {}; try { m = JSON.parse(localStorage.getItem("bds_parental_ctrl_v198")) || {}; } catch {} const k = (em||"").toLowerCase(); m[k] = { allowChat: true, allowCoope: true, dailyLimitCRC: 0, ...(m[k]||{}), ...patch }; localStorage.setItem("bds_parental_ctrl_v198", JSON.stringify(m)); };
        shell.querySelectorAll(".pc-tg").forEach(el => el.onchange = () => savePR(el.getAttribute("data-pmail"), { [el.getAttribute("data-pk")]: el.checked }));
        shell.querySelectorAll(".pc-lim").forEach(el => el.onchange = () => savePR(el.getAttribute("data-pmail"), { dailyLimitCRC: Math.max(0, Number(el.value||0)) }));
        shell.querySelectorAll(".fam-vh").forEach(b => b.onclick = () => { hijoSelIdx = Number(b.getAttribute("data-vh")); famTab = "horario"; drawF(); });
        shell.querySelectorAll(".fam-prt").forEach(bt => bt.onclick = async () => {
          const est = hijos[Number(bt.getAttribute("data-hi"))];
          const h = (await sha256Hex(`FAM-NOTA|${parentId}|${est.email}|${Date.now()}`)).slice(0, 18);
          imprimirBoletinEstudianteQR(est, pesos, generarQRSVG, h);
        });
      }

      if (famTab === "horario" && document.getElementById("fm-hsel")) {
        document.getElementById("fm-hsel").onchange = (e) => { hijoSelIdx = Number(e.target.value); drawF(); };
      }

      if (famTab === "salidas") {
        document.getElementById("ft-file").onchange = async (e) => {
          if (window.BDS_PERMISOS_API) famAdj = await window.BDS_PERMISOS_API.readFileUniversal(e.target.files[0]);
          drawF();
        };
        document.getElementById("fam-sal-f").onsubmit = async (e) => {
          e.preventDefault();
          if (!window.BDS_PERMISOS_API) return;
          const [hNom, hSec, hMail] = document.getElementById("ft-hij").value.split("|");
          const tip = document.getElementById("ft-tip").value;
          const fec = document.getElementById("ft-fec").value, h1 = document.getElementById("ft-h1").value, h2 = document.getElementById("ft-h2").value;
          const mot = document.getElementById("ft-mot").value.trim();
          const perms = window.BDS_PERMISOS_API.loadPerm();
          const id = "SAL-2026-" + String(perms.length + 201);
          const hash = (await sha256Hex(`${id}|${parentId}|${hMail}|${fec}|${h1}`)).slice(0, 16);
          perms.unshift({ id, categoria: "ESTUDIANTE", fechaCreacion: new Date().toLocaleDateString("es-CR"), solicitante: hNom, email: hMail, seccion: hSec, rol: "Estudiante", destinatario: "Auxiliares y Dirección", tipo: tip, fechaCita: fec, horaSalida: h1, horaRegreso: h2, motivo: mot, adjuntoNombre: famAdj.name, adjuntoData: famAdj.data, autorizadoEncargado: true, encargadoNombre: `${sesion.nombre} (${parentId})`, fechaAutorizacionEnc: new Date().toLocaleString("es-CR"), estado: "PENDIENTE", aprobadoPor: "", hash });
          window.BDS_PERMISOS_API.savePerm(perms);
          famAdj = { name: "", data: "" };
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🚪 Salida Autorizada por Familia", `${hNom} (${hSec}) • Enviada a Auxiliares y Dirección.`);
          drawF();
        };
        shell.querySelectorAll(".fm-ok").forEach(b => b.onclick = async () => {
          const arr = window.BDS_PERMISOS_API.loadPerm(), p = arr.find(x => x.id === b.getAttribute("data-fsok"));
          if (p) {
            p.autorizadoEncargado = true;
            p.encargadoNombre = `${sesion.nombre} (${parentId})`;
            p.fechaAutorizacionEnc = new Date().toLocaleString("es-CR");
            window.BDS_PERMISOS_API.savePerm(arr);
            drawF();
          }
        });
        shell.querySelectorAll(".fm-ver").forEach(b => b.onclick = () => {
          const p = window.BDS_PERMISOS_API.loadPerm().find(x => x.id === b.getAttribute("data-fsv"));
          if (p) window.BDS_PERMISOS_API.verAdjuntoModal(p.adjuntoNombre, p.adjuntoData);
        });
      }
    }
    drawF();
  };
})();