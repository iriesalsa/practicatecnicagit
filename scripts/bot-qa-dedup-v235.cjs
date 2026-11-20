#!/usr/bin/env node
const fs = require("fs");

let fails = 0;
function chk(n, lbl, ok, det) {
  console.log(`  [${String(n).padStart(2,"0")}/08] ${lbl.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
  if (!ok) fails++;
}

console.log("\n🤖 ============== BOT QA DEDUP & LOGIN v235.1 ==============");

const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);

chk(1, "Cero scripts duplicados en index.html", dups.length === 0, `${srcs.length} únicos, ${dups.length} dup`);
chk(2, "bds-auth-guard.js cargado exactamente 1 vez", counts["/bds-auth-guard.js"] === 1, `x${counts["/bds-auth-guard.js"] || 0}`);

const openSc = (html.match(/<script\b/gi) || []).length;
const closeSc = (html.match(/<\/script>/gi) || []).length;
chk(3, "Etiquetas <script> y </script> balanceadas", openSc === closeSc, `${openSc}/${closeSc}`);

const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(4, "Guardia anti-doble-carga en bds-auth-guard.js", guard.includes("__BDS_AUTH_GUARD_LOADED_V235"), "Bloque seguro activo");
chk(5, "Captura de errores visible en submit/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");
chk(6, "Lógica SuperAdmin intacta en bds-auth-guard.js", guard.includes('rolFinal = "SuperAdmin"'), "SuperAdmin OK");

const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(7, "AuthSoberano.jsx sanitizado (cero correo personal)", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(8, "Cero llaves secretas (sb_secret_) en guard/html", !/sb_secret_/i.test(guard + html), "Seguro");

console.log("----------------------------------------------------------------");
console.log("VEREDICTO BOT QA v235.1:", fails === 0 ? "🏆 8/8 PASS — LISTO PARA COMPILAR" : `❌ ${fails} FALLO(S)`);
console.log("================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);