(function () {
  const FAM_HIJOS_KEY = "bds_familia_hijos_v228";
  const ASIST_PORTON_KEY = "bds_asistencia_porton_v228";
  const NOTIF_FAM_KEY = "bds_notificaciones_familia_v228";

  const PLAN_FAMILIAR_UNICO = {
    precioColones: 1000,
    periodo: "Anual",
    regla: "₡1,000 anuales únicos por cuenta de padre, madre o persona encargada legal, cubriendo a TODOS los hijos, hijas o hermanos matriculados sin cobros adicionales."
  };

  function loadFamilias() {
    try { const d = JSON.parse(localStorage.getItem(FAM_HIJOS_KEY) || "[]"); if (Array.isArray(d) && d.length) return d; } catch {}
    const seed = [{
      encargadoEmail: "familia.alvarado@correo.com",
      encargadoNombre: "Persona Encargada Legal Familia Alvarado",
      planFamiliar: "Plan Familiar Único ₡1,000/año (Todos los hijos)",
      appInstalada: true,
      hijos: [
        { carnet: "EST-111-01", nombre: "Sofía Alvarado Rojas", email: "sofia.alvarado@est.mep.go.cr", seccion: "11-1", especialidad: "Desarrollo Web" },
        { carnet: "EST-082-04", nombre: "Daniel Alvarado Rojas", email: "daniel.alvarado@est.mep.go.cr", seccion: "8-2", especialidad: "III Ciclo / Talleres" }
      ]
    }];
    localStorage.setItem(FAM_HIJOS_KEY, JSON.stringify(seed));
    return seed;
  }
  function saveFamilias(arr) { localStorage.setItem(FAM_HIJOS_KEY, JSON.stringify(arr)); }

  function loadAsistenciaPorton() {
    try { const d = JSON.parse(localStorage.getItem(ASIST_PORTON_KEY) || "[]"); return Array.isArray(d) ? d : []; } catch { return []; }
  }
  function saveAsistenciaPorton(arr) { localStorage.setItem(ASIST_PORTON_KEY, JSON.stringify(arr.slice(0, 800))); }

  function loadNotifsFamilia() {
    try { const d = JSON.parse(localStorage.getItem(NOTIF_FAM_KEY) || "[]"); return Array.isArray(d) ? d : []; } catch { return []; }
  }
  function saveNotifsFamilia(arr) { localStorage.setItem(NOTIF_FAM_KEY, JSON.stringify(arr.slice(0, 400))); }

  function vincularHijoACuentaFamiliar(encargadoEmail, encargadoNombre, hijoObj) {
    const mail = String(encargadoEmail || "").trim().toLowerCase();
    if (!mail || !hijoObj || !hijoObj.nombre) return { ok: false, msg: "Complete el correo familiar y los datos del estudiante." };
    const fams = loadFamilias();
    let fam = fams.find(f => f.encargadoEmail.toLowerCase() === mail);
    if (!fam) {
      fam = {
        encargadoEmail: mail,
        encargadoNombre: String(encargadoNombre || "Persona Encargada Legal").trim(),
        planFamiliar: "Plan Familiar Único ₡1,000/año (Todos los hijos)",
        appInstalada: true,
        hijos: []
      };
      fams.unshift(fam);
    }
    const carnet = String(hijoObj.carnet || ("EST-" + String(Date.now()).slice(-5))).toUpperCase();
    if (!fam.hijos.some(h => h.carnet === carnet || (h.email && hijoObj.email && h.email.toLowerCase() === hijoObj.email.toLowerCase()))) {
      fam.hijos.push({
        carnet,
        nombre: String(hijoObj.nombre).trim(),
        email: String(hijoObj.email || "").trim().toLowerCase(),
        seccion: String(hijoObj.seccion || "10-C").trim(),
        especialidad: String(hijoObj.especialidad || "Educación General / Técnica").trim()
      });
    }
    saveFamilias(fams);
    return { ok: true, familia: fam, tarifaTotalColones: PLAN_FAMILIAR_UNICO.precioColones, totalHijos: fam.hijos.length };
  }

  function calcularTarifaFamiliar(encargadoEmail) {
    const fam = loadFamilias().find(f => f.encargadoEmail.toLowerCase() === String(encargadoEmail || "").toLowerCase());
    const hijosCount = fam ? fam.hijos.length : 1;
    return {
      totalColones: PLAN_FAMILIAR_UNICO.precioColones,
      hijosCubiertos: hijosCount,
      ahorroEstimado: Math.max(0, (hijosCount - 1) * PLAN_FAMILIAR_UNICO.precioColones),
      detalle: `₡1,000 anuales únicos por cuenta familiar (${hijosCount} estudiante(s) vinculado(s)).`
    };
  }

  async function registrarMarcaPorton(identificadorEstudiante, tipoMovimiento, oficialNombre, sha256Hex) {
    const q = String(identificadorEstudiante || "").trim().toLowerCase();
    const tipo = String(tipoMovimiento || "ENTRADA").toUpperCase() === "SALIDA" ? "SALIDA" : "ENTRADA";
    if (!q) return { ok: false, msg: "Indique o escanee el carné QR o correo del estudiante." };

    const fams = loadFamilias();
    let famMatch = null, hijoMatch = null;
    for (const f of fams) {
      const h = (f.hijos || []).find(x =>
        String(x.carnet || "").toLowerCase() === q ||
        String(x.email || "").toLowerCase() === q ||
        String(x.nombre || "").toLowerCase().includes(q)
      );
      if (h) { famMatch = f; hijoMatch = h; break; }
    }

    const fecha = new Date().toISOString().slice(0, 10);
    const hora = new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
    const nombreEst = hijoMatch ? hijoMatch.nombre : String(identificadorEstudiante).trim();
    const seccionEst = hijoMatch ? hijoMatch.seccion : "Sin sección";
    const id = "MAR-" + String(Date.now()).slice(-6);
    const hash = sha256Hex ? (await sha256Hex(`${id}|${nombreEst}|${tipo}|${fecha}|${hora}`)).slice(0, 16) : "MAR229SHA256OK";

    const logs = loadAsistenciaPorton();
    const reg = {
      id, fecha, hora, tipo,
      estudiante: nombreEst,
      carnet: hijoMatch ? hijoMatch.carnet : "QR-DIRECTO",
      seccion: seccionEst,
      encargadoEmail: famMatch ? famMatch.encargadoEmail : "",
      notificadoApp: Boolean(famMatch && famMatch.appInstalada),
      oficial: oficialNombre || "Personal de Vigilancia / Auxiliar",
      hash
    };
    logs.unshift(reg);
    saveAsistenciaPorton(logs);

    let avisoMsg = `${tipo === "ENTRADA" ? "🏫 Ingreso" : "🚪 Salida"} registrada: ${nombreEst} (${seccionEst}) a las ${hora}.`;
    if (famMatch) {
      const notifs = loadNotifsFamilia();
      notifs.unshift({
        id: "NTF-" + String(Date.now()).slice(-6),
        fecha, hora,
        encargadoEmail: famMatch.encargadoEmail,
        titulo: `${tipo === "ENTRADA" ? "✅ Llegada al colegio" : "🚪 Salida del colegio"} — ${nombreEst}`,
        mensaje: `Estimada familia, le informamos que ${nombreEst} (${seccionEst}) registró su ${tipo.toLowerCase()} el ${fecha} a las ${hora}. Sello: ${hash}.`,
        leido: false
      });
      saveNotifsFamilia(notifs);
      avisoMsg += ` Notificación enviada a ${famMatch.encargadoEmail}.`;
    }
    return { ok: true, registro: reg, msg: avisoMsg };
  }

  window.BDS_ASISTENCIA_PORTON_V228 = {
    PLAN_FAMILIAR_UNICO,
    loadFamilias,
    saveFamilias,
    loadAsistenciaPorton,
    loadNotifsFamilia,
    vincularHijoACuentaFamiliar,
    calcularTarifaFamiliar,
    registrarMarcaPorton
  };

  window.BDS_RENDER_ASISTENCIA_PORTON = function (shell, ctx) {
    const { sesion, sha256Hex } = ctx || {};
    const rol = (sesion && sesion.rol) || "";
    const puedeMarcar = ["SuperAdmin", "Admin", "Director(a)", "Subdirector(a)", "Asistente de Dirección", "Auxiliar Administrativo", "Auxiliar de Vigilancia (Seguridad)", "Orientador(a)", "Docente MEP"].includes(rol);
    let tab = rol === "Padre/Madre" ? "familia" : "porton";
    let msg = "";

    function draw() {
      const fams = loadFamilias();
      const logs = loadAsistenciaPorton();
      const notifs = loadNotifsFamilia();

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:12px;">
            <div>
              <span style="background:#059669;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">CONTROL ENTRADA/SALIDA QR • NOTIFICACIONES A PADRES • PLAN FAMILIAR ÚNICO ₡1,000 TODOS LOS HIJOS</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">🏫 Asistencia de Portón (Entrada/Salida) y Vinculación Familiar</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              ${puedeMarcar ? `<button data-ap="porton" class="ap-tab" style="background:${tab==='porton'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🚪 Registro Entrada/Salida (${logs.length})</button>` : ""}
              <button data-ap="familia" class="ap-tab" style="background:${tab==='familia'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">👨‍👩‍👧‍👦 Cuenta Familiar ₡1,000 (${fams.length})</button>
              <button data-ap="notifs" class="ap-tab" style="background:${tab==='notifs'?'#7c3aed':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">🔔 Avisos Enviados (${notifs.length})</button>
            </div>
          </div>

          ${msg ? `<div style="background:#064e3b;border:1px solid #10b981;color:#ecfdf5;padding:9px 12px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:10px;">${msg}</div>` : ""}

          ${tab === "porton" && puedeMarcar ? `
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:12px;margin-bottom:12px;">
              <div style="font-size:12.5px;font-weight:700;color:#38bdf8;margin-bottom:8px;">📷 Marcar Entrada o Salida del Centro Educativo (Notifica automáticamente a padres/encargados con la app):</div>
              <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:7px;">
                <input id="ap-q" type="text" placeholder="Carné QR, correo institucional o nombre del estudiante..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
                <button id="ap-in" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">✅ Marcar ENTRADA</button>
                <button id="ap-out" style="background:#b45309;color:#fff;border:none;padding:9px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🚪 Marcar SALIDA</button>
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:11.5px;">
                <tr style="background:#131f33;color:#38bdf8;"><th style="padding:7px;text-align:left;">Fecha / Hora</th><th style="padding:7px;">Tipo</th><th style="padding:7px;text-align:left;">Estudiante</th><th style="padding:7px;">Sección</th><th style="padding:7px;">Aviso Familiar</th><th style="padding:7px;">SHA-256</th></tr>
                ${logs.slice(0, 40).map(l => `<tr>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;">${l.fecha} <b>${l.hora}</b></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;"><span style="background:${l.tipo==='ENTRADA'?'#059669':'#b45309'};color:#fff;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:700;">${l.tipo}</span></td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;"><b>${l.estudiante}</b> (${l.carnet})</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;">${l.seccion}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;text-align:center;color:${l.notificadoApp?'#34d399':'#94a3b8'};">${l.notificadoApp ? "📲 Enviado" : "Sin vínculo"}</td>
                  <td style="padding:7px;border-bottom:1px solid #1e293b;font-family:monospace;color:#2dd4bf;text-align:center;">${l.hash}</td>
                </tr>`).join("") || `<tr><td colspan="6" style="padding:14px;text-align:center;color:#64748b;">Sin marcas de portón hoy.</td></tr>`}
              </table>
            </div>
          ` : ""}

          ${tab === "familia" ? `
            <div style="background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:11px;margin-bottom:12px;font-size:12px;color:#ecfdf5;">
              <b>💚 Tarifa Social Familiar Única: ₡1,000/año por padre, madre o persona encargada legal</b> — Cubre a <b>todos sus hijos, hijas o hermanos matriculados</b> en la misma cuenta.
            </div>
            <form id="fam-vinc-f" style="background:#070d19;border:1px solid #38bdf8;border-radius:11px;padding:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:7px;margin-bottom:12px;">
              <input id="fv-pmail" type="email" required placeholder="correo@familia.com" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="fv-pnom" type="text" required placeholder="Nombre persona encargada legal" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="fv-hnom" type="text" required placeholder="Nombre del estudiante" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="fv-hmail" type="email" required placeholder="usuario@est.mep.go.cr" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <input id="fv-hsec" type="text" required value="11-1" placeholder="Sección" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:8px;border-radius:7px;font-size:12px;"/>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:9px;border-radius:7px;font-size:12px;font-weight:800;cursor:pointer;">+ Vincular Hijo(a) (₡1,000 total)</button>
            </form>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${fams.map(f => {
                const tf = calcularTarifaFamiliar(f.encargadoEmail);
                return `<div style="background:#070d19;border:1px solid #334155;border-left:4px solid #10b981;border-radius:9px;padding:11px;font-size:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                    <b>👨‍👩‍👧‍👦 ${f.encargadoNombre} (${f.encargadoEmail})</b>
                    <span style="background:#059669;color:#fff;padding:2px 8px;border-radius:99px;font-size:10.5px;font-weight:800;">₡${tf.totalColones.toLocaleString("es-CR")}/año total • ${tf.hijosCubiertos} hijo(s)</span>
                  </div>
                  <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
                    ${(f.hijos || []).map(h => `<span style="background:#0b1322;border:1px solid #1e3a8a;padding:4px 8px;border-radius:6px;font-size:11px;color:#93c5fd;">🎒 <b>${h.nombre}</b> (${h.seccion} • ${h.carnet})</span>`).join("")}
                  </div>
                </div>`;
              }).join("")}
            </div>
          ` : ""}

          ${tab === "notifs" ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${notifs.slice(0, 30).map(n => `<div style="background:#070d19;border:1px solid #334155;border-left:4px solid #7c3aed;border-radius:9px;padding:10px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;gap:6px;"><b>${n.titulo}</b><span style="font-size:10.5px;color:#94a3b8;">${n.fecha} ${n.hora}</span></div>
                <div style="color:#cbd5e1;margin-top:3px;">${n.mensaje}</div>
                <div style="color:#2dd4bf;font-size:10.5px;margin-top:3px;">Destinatario app: ${n.encargadoEmail}</div>
              </div>`).join("") || `<div style="padding:14px;text-align:center;color:#94a3b8;">Aún no se han emitido avisos familiares.</div>`}
            </div>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".ap-tab").forEach(b => b.onclick = () => { tab = b.getAttribute("data-ap"); draw(); });
      if (tab === "porton" && puedeMarcar) {
        const execMark = async (tipo) => {
          const val = document.getElementById("ap-q").value.trim();
          const r = await window.BDS_ASISTENCIA_PORTON_V228.registrarMarcaPorton(val, tipo, sesion ? sesion.nombre : "Personal Portón", sha256Hex);
          msg = r.msg;
          draw();
        };
        document.getElementById("ap-in").onclick = () => execMark("ENTRADA");
        document.getElementById("ap-out").onclick = () => execMark("SALIDA");
      }
      if (tab === "familia") {
        document.getElementById("fam-vinc-f").onsubmit = (e) => {
          e.preventDefault();
          const res = vincularHijoACuentaFamiliar(
            document.getElementById("fv-pmail").value,
            document.getElementById("fv-pnom").value,
            {
              nombre: document.getElementById("fv-hnom").value,
              email: document.getElementById("fv-hmail").value,
              seccion: document.getElementById("fv-hsec").value
            }
          );
          msg = res.ok ? `✅ Estudiante vinculado. Tarifa familiar total se mantiene en ₡${res.tarifaTotalColones}/año cubriendo ${res.totalHijos} estudiante(s).` : res.msg;
          draw();
        };
      }
    }
    draw();
  };
})();