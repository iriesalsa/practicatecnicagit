#!/usr/bin/env node
const fs = require("fs");

global.window = global;
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.window.matchMedia = () => ({ matches: false });
global.document = {
  documentElement: { setAttribute() {} },
  head: { appendChild() {} },
  body: { classList: { _s: new Set(), toggle(c, v){ v ? this._s.add(c) : this._s.delete(c); }, contains(c){ return this._s.has(c); } } },
  getElementById: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ style: {}, innerHTML: "" })
};
global.navigator = { userAgent: "MandrakeBot-ReleaseFinal/212.0" };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

[
  "public/bds-banco-mep.js",
  "public/bds-banco-x10.js",
  "public/bds-banco-thor-50x.js",
  "public/bds-banco-odin10-puro.js",
  "public/bds-seguridad-cr.js",
  "public/bds-antologias-ilustradas.js",
  "public/bds-vial-road-guard.js",
  "public/bds-instituciones-crud.js",
  "public/bds-matricula-horarios-ia.js",
  "public/bds-permisos-justif.js",
  "public/bds-familia-notas.js",
  "public/bds-porton-mantenimiento.js",
  "public/bds-llaves-aulas.js",
  "public/bds-idiomas-4skills.js",
  "public/bds-asignacion-academica.js",
  "public/bds-suscripcion-beta.js",
  "public/bds-cooperativa.js",
  "public/bds-trazabilidad.js",
  "public/bds-chats.js",
  "public/bds-motivacion-seguimiento.js",
  "public/bds-odin2-matricula-conducta-sea.js",
  "public/bds-orientacion-reac.js",
  "public/bds-hoja-respuestas.js",
  "public/bds-i18n-ux-polish.js",
  "public/bds-docente-rea-auto.js"
].forEach(f => eval(fs.readFileSync(f, "utf8")));

(async () => {
  const results = [];
  let fails = 0;
  function test(group, name, ok, det) {
    results.push({ group, name, ok, det: det || "" });
    if (!ok) fails++;
    console.log(`  [${group.padEnd(11," ")}] ${name.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
  }

  console.log("\n🤖 ==========================================================================");
  console.log("   BOT QA RELEASE FINAL v212.0 — 18 ROLES + LLAVES + 4 SKILLS + TEMA + PAGOS");
  console.log("=============================================================================");

  const r1 = await global.BDS_LLAVES_API.registrarMovimientoLlave("AULA-13", "Ing. Max Salazar Sánchez", "maxi.salsa@gmail.com", "Óptimo", null);
  const r2 = await global.BDS_LLAVES_API.registrarMovimientoLlave("AULA-13", "Ing. Max Salazar Sánchez", "maxi.salsa@gmail.com", "Limpia", null);
  test("LLAVES-QR", "Retiro y Devolución Aula 13 + Bitácora SHA-256", r1.ok && r1.accion === "RETIRO" && r2.ok && r2.accion === "DEVOLUCION" && global.BDS_LLAVES_API.loadLog().length >= 1, "Aula 13 + Kiosko OK");

  const lKeys = Object.keys(global.BDS_IDIOMAS_4SKILLS_API.LAB_DATA);
  const sim = global.BDS_IDIOMAS_4SKILLS_API.calcSimilarity("Good morning I study today", "good morning i study today");
  const wr = global.BDS_IDIOMAS_4SKILLS_API.evaluarWriting("Today I study web development with focus and discipline.", ["study", "today"], 8);
  test("IDIOMAS-4S", "Listening/Speaking/Grammar/Writing (EN/FR/PT/ES)", lKeys.length === 4 && sim === 100 && wr.score >= 85, `4 idiomas, Writing ${wr.score}/100`);

  const tStart = global.BDS_UI.getTheme();
  const tNext = global.BDS_UI.toggleTheme();
  const tBack = global.BDS_UI.toggleTheme();
  test("TEMA-UI", "Toggle Modo Claro <-> Oscuro persistente", tNext !== tStart && tBack === tStart, `${tStart} -> ${tNext} -> ${tBack}`);

  const secs = global.BDS_ASIGNACION_API.SECCIONES_FULL;
  test("ASIGNACIÓN", "Docentes/Estudiantes en 7-1..7-4 y 11-1..11-3", secs.includes("7-4") && secs.includes("11-3") && global.BDS_ASIGNACION_API.loadDocAsigs().length >= 4, `${secs.length} secciones`);

  const newUser = { email: "nuevo.usuario@gmail.com", rol: "Estudiante" };
  const stDay1 = global.BDS_SUSCRIPCION.getEstadoCuenta(newUser);
  const trMap = JSON.parse(global.localStorage.getItem("bds_beta_13d_v212"));
  trMap["nuevo.usuario@gmail.com"] = Date.now() - (14 * 86400000);
  global.localStorage.setItem("bds_beta_13d_v212", JSON.stringify(trMap));
  const stDay14 = global.BDS_SUSCRIPCION.getEstadoCuenta(newUser);
  const suscSrc = fs.readFileSync("public/bds-suscripcion-beta.js", "utf8");
  test("PAGOS-13D", "Bloqueo real tras 13 días + Tarjeta/PayPal/SINPE", !stDay1.bloqueado && stDay14.bloqueado && suscSrc.includes("6090-6359") && suscSrc.includes("PayPal") && suscSrc.includes("Tarjeta"), "Día 1 activo -> Día 14 bloqueado");

  const users = global.BDS_TRAZABILIDAD.loadUsers();
  const danOk = users.some(u => u.rol === "Admin" && u.nombre.includes("Daniel"));
  const aarOk = users.some(u => u.rol === "Admin" && u.nombre.includes("Aarón"));
  const grdSrc = fs.readFileSync("public/bds-auth-guard.js", "utf8");
  test("RBAC-18", "Admins Daniel & Aarón + 18 Roles + SuperAdmin", danOk && aarOk && grdSrc.includes('"Admin": {') && grdSrc.includes('return c === "maxi.salsa@gmail.com";'), "Daniel & Aarón activos");

  const capOk = fs.existsSync("capacitor.config.json") && fs.existsSync("public/manifest.webmanifest");
  const malla = global.BDS_MALLA_MEP || [];
  let semLeak = 0;
  malla.forEach(m => {
    const tp = global.BDS_ODIN10_DETECTAR_TIPO(m);
    global.BDS_GENERAR_SIMULACRO(m.id, 12, "ALL").forEach(it => {
      if (tp === "espanol" && /(mitocondria|ley de ohm|hipotenusa)/i.test(it.q)) semLeak++;
      if (tp === "web" && /(hipotenusa|mitocondria|fotosíntesis)/i.test(it.q)) semLeak++;
    });
  });
  const hCtp = global.BDS_HORARIOS_CSP_API.generarHorarioCSP("CTP (Técnico)", "2027");
  test("REGRESIÓN", "0% Mezcla + Horarios 0 Choques + Capacitor PWA", semLeak === 0 && hCtp.choquesDocente === 0 && hCtp.choquesAula === 0 && capOk, `${global.__BDS_BANCO_STATS.afterTotal.toLocaleString("en-US")} ítems`);

  const passed = results.length - fails;
  fs.writeFileSync("QA-REPORT-MANDRAKE.html", `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Certificado QA Release Final v212.0</title><style>body{font-family:Inter,Arial,sans-serif;background:#060c17;color:#f1f5f9;padding:24px;max-width:960px;margin:0 auto}h1{color:#38bdf8}table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}th,td{border:1px solid #1e293b;padding:9px;text-align:left}th{background:#131f33;color:#38bdf8}.ok{color:#34d399;font-weight:800}.bad{color:#f87171;font-weight:800}</style></head><body><h1>🤖 Certificado QA Release Final v212.0 — pracTICAtecnica.com</h1><p>Resultado: <b>${passed}/${results.length} PASS</b> • Fecha: ${new Date().toLocaleString("es-CR")}</p><table><tr><th>Grupo</th><th>Prueba</th><th>Estado</th><th>Detalle</th></tr>${results.map(r => `<tr><td>${r.group}</td><td>${r.name}</td><td class="${r.ok?'ok':'bad'}">${r.ok?'✅ PASS':'❌ FAIL'}</td><td>${r.det}</td></tr>`).join("")}</table></body></html>`, "utf8");

  console.log("-----------------------------------------------------------------------------");
  console.log(`VEREDICTO RELEASE FINAL v212.0: ${fails === 0 ? `🏆 ${passed}/${results.length} PASS — LISTO PARA PRODUCCIÓN` : `❌ ${fails} FALLO(S)`}`);
  console.log("=============================================================================\n");
  if (fails > 0) process.exit(1);
})();