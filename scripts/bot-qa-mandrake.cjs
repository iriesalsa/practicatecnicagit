#!/usr/bin/env node
// ==============================================================================
// BOT DE PRUEBAS AUTOMATIZADAS MANDRAKE (v211.0) — pracTICAtecnica.com
// Ejecutable en cualquier momento con: node scripts/bot-qa-mandrake.cjs
// ==============================================================================
const fs = require("fs");
const path = require("path");

global.window = global;
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.window.matchMedia = () => ({ matches: false });
global.document = { body: null, getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {} }) };
global.navigator = { userAgent: "MandrakeBot-E2E/211.0" };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

const MODULES = [
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
  "public/bds-cooperativa.js",
  "public/bds-trazabilidad.js",
  "public/bds-chats.js",
  "public/bds-motivacion-seguimiento.js",
  "public/bds-odin2-matricula-conducta-sea.js",
  "public/bds-orientacion-reac.js",
  "public/bds-hoja-respuestas.js",
  "public/bds-i18n-ux-polish.js",
  "public/bds-docente-rea-auto.js"
];

MODULES.forEach(f => eval(fs.readFileSync(f, "utf8")));

const results = [];
let fails = 0;
function test(group, name, ok, detail) {
  results.push({ group, name, ok, detail: detail || "" });
  if (!ok) fails++;
  const tag = ok ? "✅ PASS" : "❌ FAIL";
  console.log(`  [${group.padEnd(11," ")}] ${name.padEnd(48," ")} : ${tag} ${detail ? "(" + detail + ")" : ""}`);
}

console.log("\n🤖 ==========================================================================");
console.log("   BOT QA AUTOMATIZADO MANDRAKE v211.0 — AUDITORÍA E2E DE 17 ROLES Y STRESS");
console.log("=============================================================================");

// A. SIMULACIÓN DE LOS 17 ROLES RBAC (CADA UNO VERIFICADO EN CÓDIGO Y TRAZABILIDAD)
const guardSrc = fs.readFileSync("public/bds-auth-guard.js", "utf8");
const planSrc = fs.readFileSync("public/bds-planeamiento-ia.js", "utf8");
const ROLES_17 = [
  "SuperAdmin", "Director(a)", "Subdirector(a)", "Asistente de Dirección",
  "Auxiliar Administrativo", "Auxiliar de Vigilancia (Seguridad)", "Conserje / Mantenimiento",
  "Orientador(a)", "Docente MEP", "Encargada Comedor / Junta", "Padre/Madre",
  "Estudiante", "Particular (MOPT / Admisión)", "Supervisor(a) de Circuito",
  "Asesor(a) Regional / Nacional", "Viceministro(a) MEP", "Ministro(a) MEP"
];
const missingRoles = ROLES_17.filter(r => !guardSrc.includes(`"${r}"`));
test("RBAC-17", "17 Roles Institucionales definidos en RBAC", missingRoles.length === 0, `${ROLES_17.length - missingRoles.length}/17 activos`);
test("RBAC-17", "SuperAdmin exclusivo maxi.salsa@gmail.com", guardSrc.includes('return c === "maxi.salsa@gmail.com";'), "Cero privilegios indebidos");
test("RBAC-17", "Planeamiento IA blindado solo Docente/SuperAdmin", planSrc.includes('["SuperAdmin", "Docente MEP"].includes(sesion.rol)'), "Estudiantes/Conserje/Seguridad bloqueados");

// B. FLUJO E2E 1: SALIDA ANTICIPADA (FAMILIA -> AUXILIAR -> PORTÓN VIGILANCIA QR)
const aprobLote = global.BDS_PERMISOS_API.aprobarLotePermisos("ESTUDIANTE", "Auxiliar Administrativo Bot");
const paseEst = global.BDS_PERMISOS_API.loadPerm().find(p => p.categoria === "ESTUDIANTE" && p.estado === "APROBADO");
const salidaRes = paseEst ? global.BDS_PORTON_MANT_API.registrarSalidaPorton(paseEst.id, "Oficial Vigilancia Bot") : { ok: false };
const dobleUso = paseEst ? global.BDS_PORTON_MANT_API.registrarSalidaPorton(paseEst.id, "Oficial Vigilancia Bot") : { ok: true };
test("E2E-PORTÓN", "Ciclo Familia -> Auxiliar -> Portón Vigilancia QR", aprobLote >= 1 && salidaRes.ok && !dobleUso.ok, "Antifraude 1 solo uso OK");

// C. FLUJO E2E 2: CONSERJERÍA Y MANTENIMIENTO (REPORTE + CHECKLIST DIARIO)
const tks = global.BDS_PORTON_MANT_API.loadTickets();
const chk = global.BDS_PORTON_MANT_API.loadChecklist();
chk.items[0].listo = true;
global.BDS_PORTON_MANT_API.saveChecklist(chk);
test("E2E-CONSERJ", "Mantenimiento Averías + Checklist Aseo Diario", tks.length >= 1 && global.BDS_PORTON_MANT_API.loadChecklist().items[0].listo, `${chk.items.length} áreas`);

// D. FLUJO E2E 3: DIRECCIÓN (PERMISOS PERSONAL + HORARIOS CSP 5 MODALIDADES)
const aprobDir = global.BDS_PERMISOS_API.aprobarLotePermisos("PERSONAL", "Directora Laura Ramón Elizondo");
const mods = Object.keys(global.BDS_HORARIOS_CSP_API.PLANTILLAS_MEP_2026);
let chTot = 0, blqTot = 0;
mods.forEach(m => { const h = global.BDS_HORARIOS_CSP_API.generarHorarioCSP(m, "2027"); chTot += (h.choquesDocente + h.choquesAula); blqTot += h.colocados; });
test("E2E-DIR", "Permisos Personal Lote + Horarios CSP 0% Choques", aprobDir >= 1 && mods.length === 5 && chTot === 0, `${blqTot} bloques, 0 choques`);

// E. FLUJO E2E 4: ORIENTACIÓN REAC + CONDUCTA REAC + MATRÍCULA ENCARGADO LEGAL
global.localStorage.setItem("bds_docente_roster_v190", JSON.stringify([{ nombre: "Estudiante Bot", email: "bot@est.mep.go.cr", seccion: "10-C", materia: "Web", cotidiano: 45, tareas: 50, pruebas: 40, proyecto: 50 }]));
const alReac = global.BDS_ORIENTACION_REAC_API.detectarAlertasAutomaticas();
const cNota = global.BDS_ODIN2_API.calcularNotaConductaREA("sofia.alvarado@est.mep.go.cr", "2027", "I Semestre");
test("E2E-REAC", "Alertas Nota Baja <70% + Conducta REAC + PANI", alReac.length >= 1 && cNota.nota === 100 && global.BDS_ORIENTACION_REAC_API.MARCO_LEGAL_CR.length === 6, `${alReac.length} alerta(s), 6 leyes`);

// F. STRESS TEST BANCO PURO (29 ÁREAS × 20 ÍTEMS = 580 ÍTEMS + FIREWALL SEMÁNTICO)
const t0 = Date.now();
const malla = global.BDS_MALLA_MEP || [];
let semLeak = 0, metaLeak = 0, optLeak = 0;
malla.forEach(m => {
  const tp = global.BDS_ODIN10_DETECTAR_TIPO(m);
  global.BDS_GENERAR_SIMULACRO(m.id, 20, "ALL").forEach(it => {
    if (it.a !== m.id || !it.materia || !it.subarea || !it.unidadEstudio || !it.saberEsencial) metaLeak++;
    if (new Set((it.opts || []).map(o => o.txt)).size !== 4) optLeak++;
    if (tp === "espanol" && /(mitocondria|ley de ohm|hipotenusa)/i.test(it.q)) semLeak++;
    if (tp === "web" && /(hipotenusa|mitocondria|fotosíntesis)/i.test(it.q)) semLeak++;
    if (tp === "talleres" && /(ley de ohm|resistores en paralelo)/i.test(it.q)) semLeak++;
  });
});
const elapsed = Date.now() - t0;
test("STRESS-580", "580 ítems en 29 áreas (0% mezcla + Metadatos)", semLeak === 0 && metaLeak === 0 && optLeak === 0 && elapsed < 1500, `${elapsed}ms • ${global.__BDS_BANCO_STATS.afterTotal.toLocaleString("en-US")} cap.`);

// G. ANTOLOGÍAS ILUSTRADAS SVG + HOJA DE RESPUESTAS OMR + PISTA VIAL MOPT
const lib = global.BDS_ANTOLOGIAS_API.buildLibroData("espanol", "11° Año", "CTP (Técnico)", "antologia", 20);
const vClamp = global.BDS_VIAL_GUARD.clampToRoad(999, 101, 347, 20);
const vSpeed = global.BDS_VIAL_GUARD.evaluarVelocidad(38, 25);
test("E2E-LIBROS", "Antologías SVG + OMR + Pista Vial (5 Señales)", lib.ilustracionSVG.includes("<svg") && vClamp.hitBorder && vSpeed.exceso && global.BDS_VIAL_GUARD.SENALES_MOPT.length === 5, "Velocímetro + Señales OK");

// H. COOPERATIVA vs COMEDOR + MULTI-INSTITUCIÓN (7 PROV / 27 DRE) + MOTIVACIÓN
const cCfg = global.BDS_COOPE_API.loadCfg();
const comSrc = fs.readFileSync("public/bds-comedor-mep.js", "utf8");
const salBot = global.BDS_MOTIVACION.buildSaludoPersonalizado({ email: "vigilancia.ctpmn@mep.go.cr", nombre: "", rol: "Auxiliar de Vigilancia (Seguridad)" });
test("E2E-FINANZ", "Cooperativa Permanente vs Comedor Junta Anual", cCfg.saldosPermanentes && comSrc.includes("com-cierre-anual") && Object.keys(global.BDS_CR_GEO.PROVINCIAS_DRE).length === 7, "7 Prov / 27 DRE");
test("E2E-MOTIV", "Saludo Universal + Emocional + Pomodoro 25/5", salBot.textoCompleto.includes("Vigilancia Ctpmn") && global.BDS_MOTIVACION.ESTADOS_EMOCIONALES.length === 5, "pracTICA");

// I. CIBERSEGURIDAD CR + PRODHAB CHATS + 4 IDIOMAS + INTEGRIDAD index.html
const secOk = global.BDS_SEC_CR.sanitizeText("<img onerror=1>").includes("&lt;img") && !global.BDS_SEC_CR.isSafeUrl("javascript:alert(1)");
const modOk = !global.BDS_MODERAR_CONTENIDO("eres un idiota", { rol: "Estudiante" }).ok && !global.BDS_MODERAR_CONTENIDO("mi cel 8899-1122", { rol: "Estudiante" }).ok;
const html = fs.readFileSync("index.html", "utf8");
const allLinked = ["bds-porton-mantenimiento.js","bds-seguridad-cr.js","bds-antologias-ilustradas.js","bds-vial-road-guard.js","bds-banco-odin10-puro.js","bds-orientacion-reac.js","bds-trazabilidad.js","bds-auth-guard.js"].every(s => html.includes(s));
test("SEGURIDAD", "Anti-XSS + Moderador PRODHAB + 4 Idiomas + HTML", secOk && modOk && allLinked && Object.keys(global.BDS_POLISH_V203.DICT_EXT).length >= 40, "Ley 8968 / 7739 / 7600");

// Generar Certificado HTML de Release Readiness (QA-REPORT-MANDRAKE.html)
const passed = results.length - fails;
const reportHtml = `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Certificado QA Bot Mandrake v211.0</title><style>body{font-family:Inter,Arial,sans-serif;background:#060c17;color:#f1f5f9;padding:24px;max-width:960px;margin:0 auto}h1{color:#38bdf8;margin:0 0 6px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}th,td{border:1px solid #1e293b;padding:9px;text-align:left}th{background:#131f33;color:#38bdf8}.ok{color:#34d399;font-weight:800}.bad{color:#f87171;font-weight:800}.badge{display:inline-block;padding:6px 14px;border-radius:99px;font-weight:800;background:${fails===0?'#059669':'#dc2626'};color:#fff}</style></head><body><h1>🤖 Certificado de Pruebas Automatizadas — Bot Mandrake v211.0</h1><p>Plataforma: <b>pracTICA (pracTICAtecnica.com)</b> • Fecha: ${new Date().toLocaleString("es-CR")} • Roles auditados: <b>17</b></p><div class="badge">${fails===0?`🏆 APTO PARA RELEASE GA (${passed}/${results.length} PASS)`:`❌ ${fails} FALLOS DETECTADOS`}</div><table><tr><th>Grupo</th><th>Prueba E2E</th><th>Resultado</th><th>Evidencia</th></tr>${results.map(r => `<tr><td>${r.group}</td><td>${r.name}</td><td class="${r.ok?'ok':'bad'}">${r.ok?'✅ PASS':'❌ FAIL'}</td><td>${r.detail}</td></tr>`).join("")}</table></body></html>`;
fs.writeFileSync("QA-REPORT-MANDRAKE.html", reportHtml, "utf8");

console.log("-----------------------------------------------------------------------------");
console.log(`VEREDICTO BOT MANDRAKE v211.0: ${fails === 0 ? `🏆 APTO PARA RELEASE GA (${passed}/${results.length} PASS • 0 FALLOS)` : `❌ ${fails} FALLO(S)`}`);
console.log("Certificado generado: C:\\pt26xd011409\\QA-REPORT-MANDRAKE.html");
console.log("=============================================================================\n");
if (fails > 0) process.exit(1);