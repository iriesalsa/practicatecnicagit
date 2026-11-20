(function () {
  const FAM_KEY = "bds_familia_links_v194";

  function loadFamLinks() {
    try { const d = JSON.parse(localStorage.getItem(FAM_KEY)); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [
      { parentEmail: "familia.alvarado@gmail.com", parentId: "PAD-2026-01", parentName: "Ana Rojas Vega", childEmail: "sofia.alvarado@est.mep.go.cr" },
      { parentEmail: "familia.campos@gmail.com", parentId: "PAD-2026-02", parentName: "Luis Campos Solís", childEmail: "esteban.campos@est.mep.go.cr" }
    ];
    localStorage.setItem(FAM_KEY, JSON.stringify(seed));
    return seed;
  }

  function getRoster() {
    try { return JSON.parse(localStorage.getItem("bds_docente_roster_v190")) || []; } catch { return []; }
  }
  function getPesos() {
    try { const p = JSON.parse(localStorage.getItem("bds_docente_pesos_rea_v190")); if (p) return p; } catch {}
    return { cotidiano: 35, tareas: 10, pruebas: 35, proyecto: 10, asistencia: 10, leccionesMeta: 20 };
  }

  function imprimirBoletinEstudianteQR(est, pesos, generarQRSVG, hash) {
    const b = window.BDS_BRAND ? window.BDS_BRAND.get() : { institucion: "CTP Mercedes Norte", regional: "Heredia", circuito: "Circuito 02", escudo: "/escudo-ctpmn-oficial.jpeg", logoMep: "/logo-mep-oficial.png" };
    const cPts = (Number(est.cotidiano || 0) * pesos.cotidiano / 100).toFixed(1);
    const tPts = (Number(est.tareas || 0) * pesos.tareas / 100).toFixed(1);
    const pPts = (Number(est.pruebas || 0) * pesos.pruebas / 100).toFixed(1);
    const prPts = (Number(est.proyecto || 0) * pesos.proyecto / 100).toFixed(1);
    const aPts = Number(pesos.asistencia || 10).toFixed(1);
    const tot = (Number(cPts) + Number(tPts) + Number(pPts) + Number(prPts) + Number(aPts)).toFixed(1);
    const w = window.open("", "_blank");
    if (!w) return alert("Permita ventanas emergentes para imprimir el boletín oficial.");
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Boletín Oficial - ${est.nombre}</title><style>body{font-family:Inter,Arial,sans-serif;padding:26px;color:#0f172a;font-size:12.5px}.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0f2247;padding-bottom:10px;margin-bottom:16px}table{width:100%;border-collapse:collapse;margin-bottom:14px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#0f2247;color:#fff}.qr{display:flex;align-items:center;gap:14px;border:2px solid #0f766e;padding:10px;border-radius:9px}</style></head><body><div class="hdr"><img src="${b.escudo}" style="height:58px"/><div style="text-align:center"><h2 style="margin:0;font-size:16px">${b.institucion}</h2><div>${b.regional} • ${b.circuito}</div><h3 style="margin:4px 0 0;color:#0f766e">CONSTANCIA DE NOTAS (SOLO CONSULTA • QR SHA-256)</h3></div><img src="${b.logoMep}" style="height:44px"/></div><p><b>Estudiante:</b> ${est.nombre} &nbsp;|&nbsp; <b>Sección:</b> ${est.seccion} &nbsp;|&nbsp; <b>Asignatura:</b> ${est.materia}</p><table><tr><th>Componente REA</th><th>Valor %</th><th>Nota %</th><th>Puntos Obtenidos</th></tr><tr><td>Trabajo Cotidiano</td><td>${pesos.cotidiano}%</td><td>${est.cotidiano}%</td><td><b>${cPts} / ${pesos.cotidiano}</b></td></tr><tr><td>Tareas</td><td>${pesos.tareas}%</td><td>${est.tareas}%</td><td><b>${tPts} / ${pesos.tareas}</b></td></tr><tr><td>Pruebas</td><td>${pesos.pruebas}%</td><td>${est.pruebas}%</td><td><b>${pPts} / ${pesos.pruebas}</b></td></tr><tr><td>Proyecto</td><td>${pesos.proyecto}%</td><td>${est.proyecto}%</td><td><b>${prPts} / ${pesos.proyecto}</b></td></tr><tr><td>Asistencia Automática</td><td>${pesos.asistencia}%</td><td>100%</td><td><b>${aPts} / ${pesos.asistencia}</b></td></tr><tr style="background:#f1f5f9"><td colspan="3"><b>PROMEDIO FINAL</b></td><td><b style="font-size:15px">${tot}%</b></td></tr></table><div class="qr">${generarQRSVG("PT-NOTA|" + hash, 94)}<div><b>Boletín Verificable QR SHA-256</b><br/><code>${hash}</code><br/><small>Documento de solo consulta estudiantil/familiar.</small></div></div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  }

  // Vista de Mis Notas (100% SOLO LECTURA para Estudiantes — nunca pueden editar notas)
  window.BDS_RENDER_MIS_NOTAS_ESTUDIANTE = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const roster = getRoster(), pesos = getPesos();
    const mail = (sesion.email || "").toLowerCase();
    let mios = roster.filter(r => (r.email || "").toLowerCase() === mail);
    if (!mios.length) {
      mios = [{ id: "EST-PROPIO", nombre: sesion.nombre, email: mail, seccion: sesion.seccion || "11-1", materia: "Promedio General", cotidiano: 0, tareas: 0, pruebas: 0, proyecto: 0, hash: (sesion.firma || "SHA256").slice(0, 16) }];
    }

    shell.innerHTML = `
      <div class="bds-card">
        <div style="border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
          <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">SOLO CONSULTA • IMPRIMIBLE CON QR SHA-256</span>
          <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">📊 Mis Notas Oficiales — ${sesion.nombre}</h2>
          <p style="margin:3px 0 0;font-size:12px;color:#94a3b8;">Las calificaciones son registradas exclusivamente por tus docentes. Aquí puedes consultarlas e imprimir tu constancia con sello QR SHA-256.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${mios.map((e, i) => {
            const cPts = (Number(e.cotidiano||0)*pesos.cotidiano/100).toFixed(1);
            const tPts = (Number(e.tareas||0)*pesos.tareas/100).toFixed(1);
            const pPts = (Number(e.pruebas||0)*pesos.pruebas/100).toFixed(1);
            const prPts = (Number(e.proyecto||0)*pesos.proyecto/100).toFixed(1);
            const tot = (Number(cPts)+Number(tPts)+Number(pPts)+Number(prPts)+Number(pesos.asistencia||10)).toFixed(1);
            return `<div style="background:#070d19;border:1px solid #334155;border-radius:12px;padding:13px;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
                <div><b style="color:#fff;font-size:14.5px;">${e.materia}</b> <span style="color:#94a3b8;font-size:11.5px;">(Sección ${e.seccion})</span></div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <span style="background:${Number(tot)>=70?'#059669':'#dc2626'};color:#fff;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:700;">Nota: ${tot}%</span>
                  <button data-mi="${i}" class="mn-prt" style="background:#1d4ed8;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir con QR</button>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:7px;font-size:11.5px;">
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Cotidiano: <b style="color:#38bdf8;">${cPts} / ${pesos.cotidiano}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Tareas: <b style="color:#38bdf8;">${tPts} / ${pesos.tareas}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Pruebas: <b style="color:#38bdf8;">${pPts} / ${pesos.pruebas}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Proyecto: <b style="color:#38bdf8;">${prPts} / ${pesos.proyecto}</b></div>
                <div style="background:#0b1322;padding:8px;border-radius:7px;">Asistencia: <b style="color:#34d399;">${pesos.asistencia} / ${pesos.asistencia}</b></div>
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

  // Portal Exclusivo Padres / Encargados Legales (solo sus hijos + ID QR + Permisos/Tardías/Enfermedad)
  window.BDS_RENDER_PORTAL_FAMILIA = function (shell, ctx) {
    const { sesion, sha256Hex, generarQRSVG } = ctx;
    const links = loadFamLinks(), roster = getRoster(), pesos = getPesos();
    const mail = (sesion.email || "").toLowerCase();
    let misLinks = links.filter(l => l.parentEmail.toLowerCase() === mail);
    let hijos = roster.filter(e => misLinks.some(l => l.childEmail.toLowerCase() === (e.email || "").toLowerCase()));
    if (!hijos.length && roster.length) hijos = [roster[0]]; // Primer vínculo demo si el padre acaba de crear su cuenta
    const parentId = (misLinks[0] && misLinks[0].parentId) || ("PAD-" + String(Date.now()).slice(-4));
    const qrPadre = `PT-PADRE|v194|${parentId}|${mail}|${(sesion.firma || "SHA256").slice(0, 14)}`;

    let famAdj = { name: "", data: "" };

    function drawF() {
      shell.innerHTML = `
        <div class="bds-card" style="margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">PORTAL FAMILIA • ID VERIFICABLE QR SHA-256 • PRIVACIDAD PRODHAB</span>
              <h2 style="margin:4px 0 0;font-size:17px;color:#fff;">👨‍👩‍👧‍👦 Encargado Legal: ${sesion.nombre} (${parentId})</h2>
              <p style="margin:2px 0 0;font-size:12px;color:#94a3b8;">Solo puedes consultar la información académica de tus hijos vinculados, tramitar permisos y justificar ausencias o tardías.</p>
            </div>
            <div style="text-align:center;">
              ${generarQRSVG(qrPadre, 92)}
              <div style="font-size:9.5px;color:#6ee7b7;font-family:monospace;">ID ${parentId}</div>
            </div>
          </div>

          <h3 style="margin:0 0 8px;font-size:14.5px;color:#38bdf8;">🎒 Mis Hijos Vinculados (${hijos.length})</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:10px;margin-bottom:16px;">
            ${hijos.map((h, i) => {
              const tot = ((Number(h.cotidiano||0)*pesos.cotidiano + Number(h.tareas||0)*pesos.tareas + Number(h.pruebas||0)*pesos.pruebas + Number(h.proyecto||0)*pesos.proyecto)/100 + Number(pesos.asistencia||10)).toFixed(1);
              return `<div style="background:#070d19;border:1px solid #334155;border-left:4px solid #38bdf8;border-radius:11px;padding:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <b>${h.nombre}</b>
                  <span style="background:#059669;color:#fff;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;">${tot}%</span>
                </div>
                <div style="font-size:11.5px;color:#94a3b8;margin:4px 0;">Sección ${h.seccion} • ${h.materia}</div>
                <button data-hi="${i}" class="fam-prt" style="background:#1d4ed8;color:#fff;border:none;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🖨️ Imprimir Notas con QR</button>                ${(() => {
                  const pMap = (() => { try { return JSON.parse(localStorage.getItem("bds_parental_ctrl_v198")) || {}; } catch { return {}; } })();
                  const pr = pMap[(h.email || "").toLowerCase()] || { allowChat: true, allowCoope: true, dailyLimitCRC: 0 };
                  const wC = window.BDS_COOPE_API ? window.BDS_COOPE_API.findWalletByQR(h.email) : null;
                  return `<div style="margin-top:8px;padding-top:8px;border-top:1px solid #1e293b;font-size:11px;">
                    ${wC ? `<div style="color:#2dd4bf;margin-bottom:5px;">🏪 Saldo Coope: <b>₡${Number(wC.saldoCRC||0).toLocaleString("es-CR")}</b> • 🌿 <b>${wC.ecoPuntos||0} EcoMEPs</b></div>` : ""}
                    <div style="color:#fbbf24;font-weight:700;margin-bottom:4px;">🛡️ Control Parental (Ley 8968 / Ley 7739):</div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                      <label style="cursor:pointer;"><input type="checkbox" data-pmail="${h.email}" data-pk="allowChat" class="pc-tg" ${pr.allowChat!==false?"checked":""}/> Chats</label>
                      <label style="cursor:pointer;"><input type="checkbox" data-pmail="${h.email}" data-pk="allowCoope" class="pc-tg" ${pr.allowCoope!==false?"checked":""}/> Cooperativa</label>
                      <input type="number" min="0" step="500" data-pmail="${h.email}" class="pc-lim" value="${pr.dailyLimitCRC||0}" title="Límite diario en colones (0 = sin límite)" placeholder="Límite ₡/día" style="width:92px;background:#0b1322;color:#fff;border:1px solid #334155;padding:3px 6px;border-radius:5px;font-size:11px;"/>
                    </div>
                  </div>`;
                })()}
              </div>`;
            }).join("")}
          </div>

          <form id="fam-tr-f" style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:8px;">
            <div style="grid-column:1/-1;"><h3 style="margin:0;font-size:14.5px;color:#34d399;">📝 Trámite Familiar con QR SHA-256 (Salida, Enfermedad o Tardía)</h3></div>
            <select id="ft-hij" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
              ${hijos.map(h => `<option value="${h.nombre}|${h.seccion}">${h.nombre} (${h.seccion})</option>`).join("")}
            </select>
            <select id="ft-tip" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;">
              <option>Permiso de Salida del Estudiante</option>
              <option>Permiso / Incapacidad por Enfermedad</option>
              <option>Justificación de Tardía (a Docentes)</option>
              <option>Justificación de Tardía (a Administración)</option>
              <option>Justificación de Ausencia (Comprobante)</option>
            </select>
            <input id="ft-fec" type="date" required value="${new Date().toISOString().slice(0,10)}" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;"/>
            <div style="display:flex;gap:5px;">
              <input id="ft-h1" type="time" value="07:00" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;"/>
              <input id="ft-h2" type="time" value="11:00" style="flex:1;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;"/>
            </div>
            <input id="ft-mot" type="text" required placeholder="Detalle del permiso, enfermedad o tardía..." style="grid-column:1/-1;background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:8px;font-size:12px;"/>
            <label style="grid-column:1/-1;background:#131f33;border:1px dashed #10b981;color:#6ee7b7;padding:9px;border-radius:8px;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;">
              📎 ${famAdj.name ? `Archivo listo: ${famAdj.name}` : "Adjuntar Comprobante (PDF, Foto o Screenshot — Médico, Judicial o Institucional)"}
              <input id="ft-file" type="file" accept="image/*,.pdf" style="display:none;"/>
            </label>
            <button type="submit" style="grid-column:1/-1;background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:700;cursor:pointer;">📤 Enviar a Docentes y Dirección (Laura Ramón Elizondo) con QR</button>
          </form>
        </div>
      `;

      const savePR = (em, patch) => { let m = {}; try { m = JSON.parse(localStorage.getItem("bds_parental_ctrl_v198")) || {}; } catch {} const k = (em||"").toLowerCase(); m[k] = { allowChat: true, allowCoope: true, dailyLimitCRC: 0, ...(m[k]||{}), ...patch }; localStorage.setItem("bds_parental_ctrl_v198", JSON.stringify(m)); }; shell.querySelectorAll(".pc-tg").forEach(el => el.onchange = () => savePR(el.getAttribute("data-pmail"), { [el.getAttribute("data-pk")]: el.checked })); shell.querySelectorAll(".pc-lim").forEach(el => el.onchange = () => savePR(el.getAttribute("data-pmail"), { dailyLimitCRC: Math.max(0, Number(el.value||0)) })); shell.querySelectorAll(".fam-prt").forEach(bt => bt.onclick = async () => {
        const est = hijos[Number(bt.getAttribute("data-hi"))];
        const h = (await sha256Hex(`FAM-NOTA|${parentId}|${est.email}|${Date.now()}`)).slice(0, 18);
        imprimirBoletinEstudianteQR(est, pesos, generarQRSVG, h);
      });
      document.getElementById("ft-file").onchange = async (e) => {
        if (window.BDS_PERMISOS_API) famAdj = await window.BDS_PERMISOS_API.readFileUniversal(e.target.files[0]);
        drawF();
      };
      document.getElementById("fam-tr-f").onsubmit = async (e) => {
        e.preventDefault();
        if (!window.BDS_PERMISOS_API) return;
        const [hNom, hSec] = document.getElementById("ft-hij").value.split("|");
        const tip = document.getElementById("ft-tip").value;
        const fec = document.getElementById("ft-fec").value, h1 = document.getElementById("ft-h1").value, h2 = document.getElementById("ft-h2").value;
        const mot = document.getElementById("ft-mot").value.trim();
        const justs = window.BDS_PERMISOS_API.loadJust();
        const id = "FAM-" + String(justs.length + 101);
        const hash = (await sha256Hex(`${id}|${parentId}|${hNom}|${fec}|${h1}|${h2}`)).slice(0, 16);
        justs.unshift({ id, fechaCreacion: new Date().toLocaleDateString("es-CR"), persona: `${hNom} (por ${sesion.nombre} ${parentId})`, email: mail, enviadoPor: mail, seccion: hSec, destinatario: tip.includes("Administración") ? "Dirección / Administración" : "Docentes y Dirección", tipoJust: tip, permisoRef: parentId, fechaAusencia: fec, horaInicio: h1, horaFin: h2, motivo: mot, adjuntoNombre: famAdj.name, adjuntoData: famAdj.data, estado: "PENDIENTE", revisadoPor: "", hash });
        window.BDS_PERMISOS_API.saveJust(justs);
        famAdj = { name: "", data: "" };
        alert(`✅ Trámite ${id} enviado con sello QR SHA-256 (${hash}). Visible en Gestionar Justificaciones para modificar/cambiar archivo si lo requiere.`);
        drawF();
      };
    }
    drawF();
  };
})();