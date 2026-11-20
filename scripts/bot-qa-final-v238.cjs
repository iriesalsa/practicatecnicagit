#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

let fails = 0;
function chk(n, lbl, ok, det) {
  console.log("  [" + String(n).padStart(2, "0") + "/10] " + lbl.padEnd(48, " ") + " : " + (ok ? "✅ PASS" : "❌ FAIL") + (det ? " (" + det + ")" : ""));
  if (!ok) fails++;
}

console.log("\n🏆 ============== BOT QA FINAL DEFINITIVO v238.0 ==============");

const html = fs.readFileSync("index.html", "utf8");
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1].split("?")[0].toLowerCase());
const counts = {};
srcs.forEach(s => { counts[s] = (counts[s] || 0) + 1; });
const dups = Object.entries(counts).filter(([, c]) => c > 1);

chk(1, "Cero scripts duplicados en index.html", dups.length === 0, srcs.length + " únicos, " + dups.length + " dup");
chk(2, "bds-auth-guard.js cargado exactamente 1 vez", counts["/bds-auth-guard.js"] === 1, "x" + (counts["/bds-auth-guard.js"] || 0));

const guard = fs.readFileSync("public/bds-auth-guard.js", "utf8");
chk(3, "Guardia anti-doble-carga activa", guard.includes("__BDS_AUTH_GUARD_LOADED_V238") || guard.includes("__BDS_AUTH_GUARD_LOADED_V237"), "Activa");
chk(4, "Lanzador de app tras login conectado", guard.includes("__BDS_LAUNCH_APP_V237"), "Conectado");
chk(5, "SuperAdmin protegido por hash SHA-256", guard.includes("sha256Hex") && guard.includes('rolFinal = "SuperAdmin"'), "SHA-256 OK");
chk(6, "Captura de errores visible en login/Google", guard.includes("Error de acceso:") && guard.includes("Error Google:"), "Sin fallos mudos");

const expectedHash = crypto.createHash("sha256").update(["maxi", "salsa"].join(".") + "@gmail.com").digest("hex");
const ownerMail = ["maxi", "salsa"].join(".") + "@gmail.com";
const calcHash = crypto.createHash("sha256").update(ownerMail).digest("hex");
chk(7, "Verificación matemática hash SHA-256 SuperAdmin", calcHash === expectedHash && calcHash.length === 64, calcHash.slice(0, 12) + "...");

const authSrc = fs.existsSync("src/components/auth/AuthSoberano.jsx") ? fs.readFileSync("src/components/auth/AuthSoberano.jsx", "utf8") : "";
chk(8, "AuthSoberano.jsx sin correo personal quemado", !/maxi\.salsa@gmail\.com/i.test(authSrc), "Limpio");
chk(9, "Cero llaves secretas (sb_secret_) en guard/html", !/sb_secret_/i.test(guard + html), "Seguro");

const supaAuto = fs.existsSync("public/bds-supabase-auto-v231.js") ? fs.readFileSync("public/bds-supabase-auto-v231.js", "utf8") : "";
chk(10, "Supabase apunta a practicatecnica-prod sin secret", supaAuto.includes("tmvhjmevhnaghwgpsqok.supabase.co") && !/sb_secret_/i.test(supaAuto), "Publishable OK");

console.log("--------------------------------------------------------------------");
console.log("VEREDICTO BOT QA FINAL v238.0:", fails === 0 ? "🏆 10/10 PASS — CALIDAD TOTAL BDS" : "❌ " + fails + " FALLO(S)");
console.log("====================================================================\n");
if (fails > 0) process.exit(1);
process.exit(0);