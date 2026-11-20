#!/usr/bin/env node
const fs = require("fs");
global.window = global;
global.window.addEventListener = () => {};
global.document = { body: {}, getElementById: () => null, createElement: () => ({ style: {}, appendChild() {} }) };
global.navigator = { onLine: true, userAgent: "BotQA-Consolidado-v229.1" };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

[
  "public/bds-asistencia-porton-v228.js",
  "public/bds-sea-bibliotecas-v228.js",
  "public/bds-ciberseguridad-nirvana-v228.js",
  "public/bds-realtime-push-v229.js"
].forEach(f => eval(fs.readFileSync(f, "utf8")));

(async () => {
  let fails = 0;
  function chk(n, lbl, ok, det) {
    console.log(`  [${String(n).padStart(2,"0")}/10] ${lbl.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
    if (!ok) fails++;
  }

  console.log("\n🤖 ============== BOT QA CONSOLIDADO BDS v229.1 ==============");

  const ap = global.BDS_ASISTENCIA_PORTON_V228;
  const sea = global.BDS_SEA_BIBLIOTECAS_V228;
  const cib = global.BDS_CIBER_NIRVANA_V228;
  const rt = global.BDS_REALTIME_PUSH_V229;

  // 1. Plan familiar único ₡1,000 cubre todos los hermanos
  ap.vincularHijoACuentaFamiliar("familia.alvarado@correo.com", "Familia Alvarado", { carnet: "EST-071-09", nombre: "Lucía Alvarado Rojas", email: "lucia.alvarado@est.mep.go.cr", seccion: "7-1" });
  const tar = ap.calcularTarifaFamiliar("familia.alvarado@correo.com");
  chk(1, "Plan Familiar ₡1,000 cubre todos los hermanos", tar.totalColones === 1000 && tar.hijosCubiertos >= 3, `₡${tar.totalColones} / ${tar.hijosCubiertos} hijos`);

  // 2. Marca de Portón + Hook automático Realtime/Cola Offline
  const mIn = await ap.registrarMarcaPorton("EST-111-01", "ENTRADA", "Oficial QA", null);
  const mOut = await ap.registrarMarcaPorton("EST-111-01", "SALIDA", "Oficial QA", null);
  chk(2, "Portón Entrada/Salida -> Cola Realtime/Push", Boolean(mIn.ok && mOut.ok && rt.loadQueue().length >= 2), `Cola: ${rt.loadQueue().length}`);

  // 3. Registro de token Push Nativo
  const tok = await rt.registrarTokenDispositivo("usuario@familia.com", "android", "fcm_token_2291");
  chk(3, "Registro de token Push (Android/iOS/Web)", Boolean(tok.ok && rt.loadTokens().length >= 1), "Token guardado");

  // 4. SEA / REAC 45509-MEP protege período cerrado
  const g1 = sea.guardarRegistroSEA("2026", "I Período", "11-1", "Programación", [{ est: "Sofía", nota: 95 }]);
  sea.cerrarPeriodoPorJefatura(g1.key, "Dirección");
  const gBlock = sea.guardarRegistroSEA("2026", "I Período", "11-1", "Programación", [{ est: "Sofía", nota: 60 }]);
  chk(4, "Regla SEA / REAC 2026 (0 sobreescritura)", g1.ok && !gBlock.ok, "Período I protegido");

  // 5. 9 Bibliotecas Libres Abiertas
  chk(5, "Bibliotecas Abiertas (MEP, OpenStax, MDN, OER)", sea.BIBLIOTECAS_ABIERTAS.length >= 9, `${sea.BIBLIOTECAS_ABIERTAS.length} fuentes`);

  // 6. Bloqueo antifraude 5 intentos + Bitácora PRODHAB
  let l = null; for (let i = 0; i < 5; i++) l = cib.registrarIntentoFallido("prueba@institucion.com");
  const blk = cib.estaBloqueadoPorIntentos("prueba@institucion.com");
  cib.limpiarIntentos("prueba@institucion.com");
  chk(6, "Ciberseguridad: Bloqueo 5 intentos + Bitácora", l.bloqueado && blk && cib.loadBitacoraSeguridad().length >= 5, "5/5 bloqueado");

  // 7. SQL Supabase válido con pgcrypto + RLS + Realtime
  const sql = fs.readFileSync("supabase/migrations/20261120_asistencia_porton_realtime.sql", "utf8");
  chk(7, "SQL Supabase (pgcrypto + RLS + Realtime)", sql.includes("pgcrypto") && sql.includes("ENABLE ROW LEVEL SECURITY") && sql.includes("supabase_realtime"), "Listo para SQL Editor");

  // 8. SW v229 con evento push en segundo plano
  const sw = fs.readFileSync("public/sw-bds-v229.js", "utf8");
  chk(8, "SW v229 escucha push en segundo plano", sw.includes('addEventListener("push"') && sw.includes("showNotification"), "Background Push OK");

  // 9. Orden de carga en index.html (v228 antes de v229)
  const html = fs.readFileSync("index.html", "utf8");
  const i228 = html.indexOf("bds-asistencia-porton-v228.js");
  const i229 = html.indexOf("bds-realtime-push-v229.js");
  chk(9, "Orden limpio de scripts en index.html", i228 > 0 && i229 > i228, "v228 -> v229 -> guard");

  // 10. Privacidad soberana: cero credenciales/correos personales expuestos
  const joined = [
    fs.readFileSync("public/bds-asistencia-porton-v228.js", "utf8"),
    fs.readFileSync("public/bds-realtime-push-v229.js", "utf8")
  ].join("\n");
  chk(10, "Sanitización soberana (cero datos personales)", !/maxi\.salsa|maxsalazar/i.test(joined) && rt.getConfig().anonKey === "", "100% limpio");

  console.log("----------------------------------------------------------------");
  console.log("VEREDICTO BOT QA CONSOLIDADO v229.1:", fails === 0 ? "🏆 10/10 PASS — CALIDAD BDS PRODUCCIÓN" : `❌ ${fails} FALLO(S)`);
  console.log("================================================================\n");
  if (fails > 0) process.exit(1);
})();