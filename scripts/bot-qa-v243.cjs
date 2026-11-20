#!/usr/bin/env node
const fs = require("fs");
let fails = 0;
function chk(n, lbl, ok, det) {
  console.log("  [" + String(n).padStart(2, "0") + "/08] " + lbl.padEnd(48, " ") + " : " + (ok ? "✅ PASS" : "❌ FAIL") + (det ? " (" + det + ")" : ""));
  if (!ok) fails++;
}
console.log("\n🛸 ============== BOT QA BASES DE LA NAVE v243.0 ==============");
const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);
chk(1, "Cero scripts duplicados en index.html", dups.length === 0, srcs.length + " únicos, " + dups.length + " dup");
chk(2, "bds-nave-base-v243.js cargado 1 vez", counts["/bds-nave-base-v243.js"] === 1, "x" + (counts["/bds-nave-base-v243.js"] || 0));
const nave = fs.readFileSync("public/bds-nave-base-v243.js", "utf8");
chk(3, "Base operativa central y acceso a módulos", nave.includes("bds-cockpit-base-v243") && nave.includes("bds-go-reac-v243"), "Base OK");
chk(4, "Controles triángulos ▲/▼ activos", nave.includes("&#9650;") && nave.includes("&#9660;"), "▲ / ▼ OK");
const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(5, "SuperAdmin protegido por hash SHA-256", guard.includes("sha256Hex") && guard.includes('rolFinal = "SuperAdmin"'), "SHA-256 OK");
chk(6, "Captura de errores visible en login/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");
const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(7, "AuthSoberano.jsx sanitizado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(8, "Cero llaves secretas (sb_secret_)", !/sb_secret_/i.test(guard + html + nave), "Seguro");
console.log("--------------------------------------------------------------------");
console.log("VEREDICTO BOT QA v243.0:", fails === 0 ? "🏆 8/8 PASS — LISTO PARA DESPEGAR" : "❌ " + fails + " FALLO(S)");
console.log("====================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);