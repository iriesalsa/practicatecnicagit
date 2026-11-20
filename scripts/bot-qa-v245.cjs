#!/usr/bin/env node
const fs = require("fs");

let fails = 0;
function chk(n, lbl, ok, det) {
  console.log("  [" + String(n).padStart(2, "0") + "/09] " + lbl.padEnd(48, " ") + " : " + (ok ? "✅ PASS" : "❌ FAIL") + (det ? " (" + det + ")" : ""));
  if (!ok) fails++;
}

console.log("\n🛡️ ============== BOT QA ESTABILIDAD v245.0 ==============");

const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
for (const s of srcs) counts[s] = (counts[s] || 0) + 1;
const dups = Object.entries(counts).filter(([, c]) => c > 1);

chk(1, "Cero scripts duplicados en index.html", dups.length === 0, srcs.length + " únicos, " + dups.length + " dup");
chk(2, "bds-estabilidad-v245.js enlazado 1 vez", counts["/bds-estabilidad-v245.js"] === 1, "x" + (counts["/bds-estabilidad-v245.js"] || 0));

const est = fs.readFileSync("public/bds-estabilidad-v245.js", "utf8");
chk(3, "Espacio operativo y botón salir listos", est.includes("bds-panel-estable-v245") && est.includes("bds-exit-top-v245"), "Panel + Salir OK");
chk(4, "Controles triángulos ▲/▼ activos", est.includes("&#9650;") && est.includes("&#9660;"), "▲ / ▼ OK");

const guard = fs.existsSync("public/bds-auth-guard.js") ? fs.readFileSync("public/bds-auth-guard.js", "utf8") : "";
chk(5, "Lógica SuperAdmin intacta en guard", guard.includes('rolFinal = "SuperAdmin"'), "SuperAdmin OK");
chk(6, "Captura de errores visible en login/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");

const authFile = "src/components/auth/AuthSoberano.jsx";
const authSrc = fs.existsSync(authFile) ? fs.readFileSync(authFile, "utf8") : "";
chk(7, "AuthSoberano.jsx sanitizado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(8, "Cero llaves secretas (sb_secret_)", !/sb_secret_/i.test(guard + html + est), "Seguro");
chk(9, "PWA v245 y versión sincronizada", fs.existsSync("public/sw-bds-v245.js") && html.includes("?v=245"), "PWA v245 OK");

console.log("--------------------------------------------------------------------");
console.log("VEREDICTO BOT QA v245.0:", fails === 0 ? "🏆 9/9 PASS — LISTO PARA COMPILAR" : "❌ " + fails + " FALLO(S)");
console.log("====================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);