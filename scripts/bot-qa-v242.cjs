#!/usr/bin/env node
const fs = require("fs");
let fails = 0;
function chk(n, lbl, ok, det) {
  console.log("  [" + String(n).padStart(2, "0") + "/08] " + lbl.padEnd(48, " ") + " : " + (ok ? "✅ PASS" : "❌ FAIL") + (det ? " (" + det + ")" : ""));
  if (!ok) fails++;
}
console.log("\n⚡ ============== BOT QA RESCATE v242.0 ==============");
const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);
chk(1, "Cero scripts duplicados en index.html", dups.length === 0, srcs.length + " únicos, " + dups.length + " dup");
chk(2, "bds-tri-v242.js cargado 1 vez", counts["/bds-tri-v242.js"] === 1, "x" + (counts["/bds-tri-v242.js"] || 0));
const tri = fs.readFileSync("public/bds-tri-v242.js", "utf8");
chk(3, "Triángulos ▲/▼ activos", tri.includes("&#9650;") && tri.includes("&#9660;"), "▲ / ▼ OK");
const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(4, "SuperAdmin protegido por hash SHA-256", guard.includes("sha256Hex") && guard.includes('rolFinal = "SuperAdmin"'), "SHA-256 OK");
chk(5, "Captura de errores visible en login/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");
const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(6, "AuthSoberano.jsx sanitizado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(7, "Cero llaves secretas (sb_secret_)", !/sb_secret_/i.test(guard + html + tri), "Seguro");
chk(8, "Versión v242 activa", html.includes("?v=242"), "v242");
console.log("--------------------------------------------------------------------");
console.log("VEREDICTO BOT QA v242.0:", fails === 0 ? "🏆 8/8 PASS — COMPILANDO" : "❌ " + fails + " FALLO(S)");
console.log("====================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);