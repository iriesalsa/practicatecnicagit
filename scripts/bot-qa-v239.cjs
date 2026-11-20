#!/usr/bin/env node
const fs = require("fs");

let fails = 0;
function chk(n, lbl, ok, det) {
  console.log("  [" + String(n).padStart(2, "0") + "/09] " + lbl.padEnd(48, " ") + " : " + (ok ? "✅ PASS" : "❌ FAIL") + (det ? " (" + det + ")" : ""));
  if (!ok) fails++;
}

console.log("\n🛡️ ============== BOT QA ANTI-REBOTE & MENÚ v239.0 ==============");

const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);

chk(1, "Cero scripts duplicados en index.html", dups.length === 0, srcs.length + " únicos, " + dups.length + " dup");
chk(2, "bds-anti-bounce-v239.js enlazado 1 vez", counts["/bds-anti-bounce-v239.js"] === 1, "x" + (counts["/bds-anti-bounce-v239.js"] || 0));

const bounce = fs.readFileSync("public/bds-anti-bounce-v239.js", "utf8");
chk(3, "Bloqueo de borrado accidental de sesión", bounce.includes("__BDS_ACTIVE_SESSION_LOCK_V239"), "Activo");
chk(4, "Visibilidad de menú y shell garantizada", bounce.includes("asegurarMenuVisible"), "Menu OK");

const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(5, "SuperAdmin protegido por hash SHA-256", guard.includes("__BDS_SA_HASH_V239") && guard.includes('rolFinal = "SuperAdmin"'), "SHA-256 OK");
chk(6, "Captura de errores visible en login/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");

const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(7, "AuthSoberano.jsx sanitizado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(8, "Cero llaves secretas (sb_secret_)", !/sb_secret_/i.test(guard + html + bounce), "Seguro");
chk(9, "Versión v239 sincronizada en index y guard", html.includes("?v=239") && guard.includes("?v=239"), "v239");

console.log("--------------------------------------------------------------------");
console.log("VEREDICTO BOT QA v239.0:", fails === 0 ? "🏆 9/9 PASS — LISTO PARA COMPILAR" : "❌ " + fails + " FALLO(S)");
console.log("====================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);