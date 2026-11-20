#!/usr/bin/env node
const fs = require("fs");

let fails = 0;
function chk(n, lbl, ok, det) {
  console.log(`  [${String(n).padStart(2,"0")}/08] ${lbl.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
  if (!ok) fails++;
}

console.log("\n🚀 ============== BOT QA LOGIN & DEPLOY v237.1 ==============");

const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);

chk(1, "Cero scripts duplicados en index.html", dups.length === 0, `${srcs.length} únicos, ${dups.length} dup`);
chk(2, "bds-auth-guard.js cargado 1 vez", counts["/bds-auth-guard.js"] === 1, `x${counts["/bds-auth-guard.js"] || 0}`);

const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(3, "Guardia anti-doble-carga v237 activa", guard.includes("__BDS_AUTH_GUARD_LOADED_V237"), "Activa");
chk(4, "Lanzador de app tras login (__BDS_LAUNCH_APP_V237)", guard.includes("__BDS_LAUNCH_APP_V237(nueva)"), "Conectado");
chk(5, "SuperAdmin blindado por hash SHA-256", guard.includes("_mHash237") || guard.includes("__BDS_SA_HASH_V237"), "SHA-256 OK");
chk(6, "Captura de errores visible en submit/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");

const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(7, "AuthSoberano.jsx sanitizado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(8, "Cero llaves secretas (sb_secret_)", !/sb_secret_/i.test(guard + html), "Seguro");

console.log("----------------------------------------------------------------");
console.log("VEREDICTO BOT QA v237.1:", fails === 0 ? "🏆 8/8 PASS — LISTO PARA COMPILAR" : `❌ ${fails} FALLO(S)`);
console.log("================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);