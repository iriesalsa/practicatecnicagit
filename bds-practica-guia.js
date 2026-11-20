(function () {
  const ORG_KEY = "bds_practica_org_v198";
  const EMO_KEY = "bds_practica_emo_v198";
  const FIN_KEY = "bds_practica_fin_v198";

  function loadOrg() {
    try { const d = JSON.parse(localStorage.getItem(ORG_KEY)); if (Array.isArray(d)) return d; } catch {}
    return [
      { id: "T-1", txt: "Repasar 15 minutos en Práctica Guiada", hora: "16:00", done: false },
      { id: "T-2", txt: "Organizar materiales para la clase de mañana", hora: "19:00", done: false }
    ];
  }
  function saveOrg(a) { localStorage.setItem(ORG_KEY, JSON.stringify(a)); }

  function loadEmo() { try { return JSON.parse(localStorage.getItem(EMO_KEY)) || []; } catch { return []; } }
  function saveEmo(a) { localStorage.setItem(EMO_KEY, JSON.stringify(a)); }

  function loadFin() {
    try { const d = JSON.parse(localStorage.getItem(FIN_KEY)); if (d && d.metaMensual !== undefined) return d; } catch {}
    return { metaMensual: 15000, ahorradoMes: 0, aportes: [] };
  }
  function saveFin(d) { localStorage.setItem(FIN_KEY, JSON.stringify(d)); }

  const ANIMOS = [
    { id: "feliz", ic: "😊", nom: "Motivado / Feliz", resp: "¡Excelente energía! Aprovecha este impulso para avanzar una práctica o sumar EcoMEPs reciclando." },
    { id: "pensando", ic: "🤔", nom: "Concentrado", resp: "Divide tus metas en bloques cortos de 25 minutos con 5 minutos de pausa." },
    { id: "cansado", ic: "😴", nom: "Cansado", resp: "Tu descanso también construye tu futuro. Hidrátate, estira y prioriza solo 1 tarea esencial hoy." },
    { id: "estresado", ic: "😟", nom: "Estresado", resp: "Respira conmigo: inhala 4 segundos, sostén 4 segundos, exhala 4 segundos. Un paso a la vez." },
    { id: "apoyo", ic: "💙", nom: "Necesito apoyo", resp: "No estás solo(a). Hablar con tu orientador(a), docente de confianza o familia siempre ayuda. En Costa Rica también puedes llamar gratis a la línea PANI 1147." }
  ];

  window.BDS_RENDER_PRACTICA_GUIA = function (shell, ctx) {
    const { sesion, ganarXP } = ctx;
    const buhoSrc = (window.BDS_BRAND && window.BDS_BRAND.get().mascota) || "/buho-oficial.png?v=198";
    let modo = "organizacion"; // organizacion | emocional | finanzas
    let mensajeBuho = `¡Hola ${(sesion.nombre || "").split(" ")[0]}! Soy Práctica, tu Búho Azul guía. Elige un modo para organizar tu día, cuidar tu bienestar o hacer crecer tus ahorros.`;

    function draw() {
      const org = loadOrg();
      const emo = loadEmo();
      const fin = loadFin();
      const wCoope = window.BDS_COOPE_API ? window.BDS_COOPE_API.ensureWallet(sesion) : { saldoCRC: 0, ecoPuntos: 0, gastoMes: 0 };
      const pctMeta = fin.metaMensual > 0 ? Math.min(100, Math.round((fin.ahorradoMes / fin.metaMensual) * 100)) : 0;

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:12px;flex:1;min-width:240px;">
              <img src="${buhoSrc}" width="54" height="54" alt="Práctica Búho Azul" style="border-radius:50%;border:2px solid #38bdf8;"/>
              <div>
                <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:99px;">PRÁCTICA • TU GUÍA INTEGRAL EN 3 MODOS</span>
                <div style="font-size:14px;font-weight:700;color:#fff;margin-top:4px;line-height:1.35;">“${mensajeBuho}”</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button data-pm="organizacion" class="pg-m" style="background:${modo==='organizacion'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">📅 Organización</button>
              <button data-pm="emocional" class="pg-m" style="background:${modo==='emocional'?'#0f766e':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">💚 Bienestar</button>
              <button data-pm="finanzas" class="pg-m" style="background:${modo==='finanzas'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 11px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;">💰 Finanzas</button>
            </div>
          </div>

          ${modo === "organizacion" ? `
            <form id="po-f" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
              <input id="po-txt" type="text" required placeholder="Nueva tarea, examen o recordatorio..." style="flex:1;min-width:200px;background:#070d19;border:1px solid #334155;color:#fff;padding:9px 11px;border-radius:8px;font-size:12.5px;"/>
              <input id="po-hr" type="time" value="17:00" style="background:#070d19;border:1px solid #334155;color:#fff;padding:9px;border-radius:8px;font-size:12px;"/>
              <button type="submit" style="background:#1d4ed8;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-weight:700;cursor:pointer;">+ Agregar & Recordar</button>
            </form>
            <div style="display:flex;flex-direction:column;gap:7px;">
              ${org.map((t, i) => `
                <div style="background:#070d19;border:1px solid ${t.done?'#10b981':'#334155'};border-radius:9px;padding:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12.5px;">
                  <label style="display:flex;align-items:center;gap:9px;cursor:pointer;flex:1;">
                    <input type="checkbox" data-ti="${i}" class="po-chk" ${t.done?"checked":""} style="width:18px;height:18px;"/>
                    <span style="text-decoration:${t.done?'line-through':'none'};color:${t.done?'#6ee7b7':'#f1f5f9'};">${t.txt} <small style="color:#94a3b8;">(${t.hora})</small></span>
                  </label>
                  <button data-tn="${i}" class="po-ntf" title="Enviar notificación push" style="background:#0f766e;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🔔</button>
                  <button data-td="${i}" class="po-del" style="background:#7f1d1d;color:#fff;border:none;padding:5px 8px;border-radius:6px;font-size:11px;cursor:pointer;">🗑️</button>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${modo === "emocional" ? `
            <div style="margin-bottom:14px;">
              <div style="font-size:12.5px;color:#cbd5e1;margin-bottom:8px;">¿Cómo te sientes hoy? Tu respuesta es privada (Ley N.° 8968 PRODHAB):</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                ${ANIMOS.map(a => `<button data-em="${a.id}" class="pe-btn" style="background:#070d19;border:1px solid #334155;color:#fff;padding:10px 14px;border-radius:10px;font-size:12.5px;font-weight:700;cursor:pointer;">${a.ic} ${a.nom}</button>`).join("")}
              </div>
            </div>
            <div style="background:#070d19;border:1px solid #0f766e;border-radius:12px;padding:14px;margin-bottom:12px;">
              <b style="color:#2dd4bf;">🌬️ Pausa Activa de Respiración (4-4-4)</b>
              <p style="margin:5px 0 0;font-size:12px;color:#cbd5e1;">Inhala despacio contando hasta 4 → sostén 4 segundos → exhala suavemente en 4 segundos. Repite 3 veces antes de un examen o presentación.</p>
            </div>
            <div style="font-size:11.5px;color:#94a3b8;">Últimos registros de bienestar (${emo.length}): ${emo.slice(0, 5).map(e => `${e.ic} ${e.nom} (${e.fecha})`).join(" • ") || "Sin registros hoy."}</div>
          ` : ""}

          ${modo === "finanzas" ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:14px;">
              <div style="background:#070d19;border:1px solid #10b981;border-radius:10px;padding:11px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Balance Cooperativa</div><div style="font-size:20px;font-weight:900;color:#34d399;">₡${Number(wCoope.saldoCRC||0).toLocaleString("es-CR")}</div></div>
              <div style="background:#070d19;border:1px solid #2dd4bf;border-radius:10px;padding:11px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Ahorro EcoMEPs</div><div style="font-size:20px;font-weight:900;color:#2dd4bf;">🌿 ${wCoope.ecoPuntos || 0}</div></div>
              <div style="background:#070d19;border:1px solid #38bdf8;border-radius:10px;padding:11px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Ahorrado este Mes</div><div style="font-size:20px;font-weight:900;color:#38bdf8;">₡${Number(fin.ahorradoMes||0).toLocaleString("es-CR")}</div></div>
              <div style="background:#070d19;border:1px solid #fbbf24;border-radius:10px;padding:11px;text-align:center;"><div style="font-size:10.5px;color:#94a3b8;">Meta Mensual (${pctMeta}%)</div><div style="font-size:18px;font-weight:900;color:#fbbf24;">₡${Number(fin.metaMensual||0).toLocaleString("es-CR")}</div></div>
            </div>
            <div style="height:10px;background:#1e293b;border-radius:99px;overflow:hidden;margin-bottom:14px;"><div style="width:${pctMeta}%;height:100%;background:linear-gradient(90deg,#10b981,#38bdf8);"></div></div>
            <form id="pf-f" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;">
              <div><label style="font-size:11px;color:#94a3b8;">Meta de ahorro mensual (₡):</label><input id="pf-meta" type="number" min="1000" value="${fin.metaMensual}" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div><label style="font-size:11px;color:#94a3b8;">Registrar nuevo ahorro hoy (₡):</label><input id="pf-add" type="number" min="0" value="500" style="width:100%;background:#070d19;color:#fff;border:1px solid #334155;padding:9px;border-radius:8px;font-size:12.5px;"/></div>
              <div style="display:flex;align-items:flex-end;"><button type="submit" style="width:100%;background:#059669;color:#fff;border:none;padding:10px;border-radius:8px;font-weight:800;cursor:pointer;">💰 Sumar a Mi Ahorro</button></div>
            </form>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".pg-m").forEach(b => b.onclick = () => { modo = b.getAttribute("data-pm"); draw(); });

      if (modo === "organizacion") {
        document.getElementById("po-f").onsubmit = (e) => {
          e.preventDefault();
          const txt = document.getElementById("po-txt").value.trim(), hr = document.getElementById("po-hr").value;
          const a = loadOrg(); a.unshift({ id: "T-" + Date.now(), txt, hora: hr, done: false }); saveOrg(a);
          if (window.BDS_NATIVE) window.BDS_NATIVE.notify("🦉 Práctica — Recordatorio Agendado", `${txt} (${hr})`);
          mensajeBuho = `¡Listo! Anoté "${txt}" para las ${hr}. Yo te recuerdo.`;
          draw();
        };
        shell.querySelectorAll(".po-chk").forEach(c => c.onchange = () => {
          const a = loadOrg(), i = Number(c.getAttribute("data-ti"));
          a[i].done = c.checked; saveOrg(a);
          if (c.checked && ganarXP) ganarXP(10);
          mensajeBuho = c.checked ? "¡Excelente cumplimiento! Sigue construyendo tu racha." : "Tarea reabierta.";
          draw();
        });
        shell.querySelectorAll(".po-ntf").forEach(b => b.onclick = () => {
          const t = loadOrg()[Number(b.getAttribute("data-tn"))];
          if (t && window.BDS_NATIVE) window.BDS_NATIVE.notify("🦉 Recordatorio de Práctica", `${t.txt} (${t.hora})`);
        });
        shell.querySelectorAll(".po-del").forEach(b => b.onclick = () => {
          const a = loadOrg(); a.splice(Number(b.getAttribute("data-td")), 1); saveOrg(a); draw();
        });
      }

      if (modo === "emocional") {
        shell.querySelectorAll(".pe-btn").forEach(b => b.onclick = () => {
          const an = ANIMOS.find(x => x.id === b.getAttribute("data-em"));
          if (!an) return;
          const a = loadEmo();
          a.unshift({ id: an.id, ic: an.ic, nom: an.nom, fecha: new Date().toLocaleDateString("es-CR") });
          saveEmo(a.slice(0, 30));
          mensajeBuho = an.resp;
          if (ganarXP) ganarXP(5);
          draw();
        });
      }

      if (modo === "finanzas") {
        document.getElementById("pf-f").onsubmit = (e) => {
          e.preventDefault();
          const f = loadFin();
          f.metaMensual = Math.max(1000, Number(document.getElementById("pf-meta").value || 15000));
          const add = Math.max(0, Number(document.getElementById("pf-add").value || 0));
          f.ahorradoMes = Number(f.ahorradoMes || 0) + add;
          if (add > 0) f.aportes.unshift({ fecha: new Date().toLocaleDateString("es-CR"), monto: add });
          saveFin(f);
          mensajeBuho = add > 0 ? `¡Buen hábito financiero! Sumaste ₡${add.toLocaleString("es-CR")} a tu meta mensual.` : "Meta de ahorro actualizada.";
          if (add > 0 && ganarXP) ganarXP(10);
          draw();
        };
      }
    }
    draw();
  };
})();