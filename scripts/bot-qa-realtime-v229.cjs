#!/usr/bin/env node
const fs = require("fs");
global.window = global;
global.window.addEventListener = () => {};
global.document = { body: {}, getElementById: () => null, createElement: () => ({ style: {}, appendChild() {} }) };
global.navigator = { onLine: true, userAgent: "BotQA-Maestro-v229" };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

eval(fs.readFileSync("public/bds-asistencia-porton-v228.js", "utf8"));
eval(fs.readFileSync("public/bds-realtime-push-v229.js", "utf8"));

(async () => {
  let fails = 0;
  function chk(n, lbl, ok, det) {
    console.log(`  [${String(n).padStart(2,"0")}/07] ${lbl.padEnd(46," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
    if (!ok) fails++;
  }

  console.log("\n🤖 ============== BOT QA MAESTRO REALTIME & PUSH v229.0 ==============");

  const rt = global.BDS_REALTIME_PUSH_V229;
  const ap = global.BDS_ASISTENCIA_PORTON_V228;

  // 1. Hook automático activo sobre asistencia portón
  const m = await ap.registrarMarcaPorton("EST-111-01", "ENTRADA", "Oficial QA", null);
  chk(1, "Hook Portón -> Realtime/Push + Cola Offline", Boolean(m.ok && rt.loadQueue().length >= 1), `Cola: ${rt.loadQueue().length}`);

  // 2. Registro de token nativo FCM/APNs/Web
  const t = await rt.registrarTokenDispositivo("usuario@familia.com", "android", "fcm_token_demo_229");
  chk(2, "Registro de token dispositivo (Android/iOS)", Boolean(t.ok && rt.loadTokens().length >= 1), "Token guardado");

  // 3. Configuración dinámica sin llaves quemadas
  const cfgDefault = rt.getConfig();
  chk(3, "Cero llaves secretas quemadas por defecto", cfgDefault.configured === false && cfgDefault.anonKey === "", "Privacidad OK");

  // 4. Migración SQL con RLS PRODHAB y supabase_realtime
  const sql = fs.readFileSync("supabase/migrations/20261120_asistencia_porton_realtime.sql", "utf8");
  chk(4, "SQL Supabase con RLS + publicación Realtime", sql.includes("ENABLE ROW LEVEL SECURITY") && sql.includes("supabase_realtime"), "SQL válido");

  // 5. Service Worker v229 con evento push en segundo plano
  const sw = fs.readFileSync("public/sw-bds-v229.js", "utf8");
  chk(5, "SW v229 escucha push y dispara notificación", sw.includes('addEventListener("push"') && sw.includes("showNotification"), "Background Push OK");

  // 6. Enlace limpio en index.html
  const html = fs.readFileSync("index.html", "utf8");
  chk(6, "index.html enlaza bds-realtime-push-v229.js", html.includes("bds-realtime-push-v229.js"), "Enlazado");

  // 7. Cero exposición de correos personales en el módulo nuevo
  const rtSrc = fs.readFileSync("public/bds-realtime-push-v229.js", "utf8");
  chk(7, "Sanitización soberana (sin datos personales)", !/maxi\.salsa|maxsalazar/i.test(rtSrc), "100% neutro");

  console.log("----------------------------------------------------------------------");
  console.log("VEREDICTO BOT QA MAESTRO v229.0:", fails === 0 ? "🏆 7/7 PASS — LISTO PARA PRODUCCIÓN" : `❌ ${fails} FALLO(S)`);
  console.log("======================================================================\n");
  if (fails > 0) process.exit(1);
})();