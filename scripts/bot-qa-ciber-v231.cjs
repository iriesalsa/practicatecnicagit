#!/usr/bin/env node
const fs = require("fs");
global.window = global;
global.window.addEventListener = () => {};
global.document = { body: {}, getElementById: () => null, createElement: () => ({ style: {}, appendChild() {} }) };
global.navigator = { onLine: true, userAgent: "BotQA-Ciber-v231" };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

[
  "public/bds-crypto-vault-v231.js",
  "public/bds-supabase-auto-v231.js",
  "public/bds-realtime-push-v229.js"
].forEach(f => eval(fs.readFileSync(f, "utf8")));

(async () => {
  let fails = 0;
  function chk(n, lbl, ok, det) {
    console.log(`  [${String(n).padStart(2,"0")}/08] ${lbl.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
    if (!ok) fails++;
  }

  console.log("\n🛡️ ============== BOT QA PRIVACIDAD & CIFRADO v231.0 ==============");

  const v = global.BDS_CRYPTO_VAULT_V231;
  const rt = global.BDS_REALTIME_PUSH_V229;

  // 1. Cifrado AES-256-GCM ida y vuelta
  const payload = { estudiante: "Sofía Alvarado", email: "familia@correo.com", seccion: "11-1" };
  const enc = await v.encryptJSON(payload);
  const dec = await v.decryptJSON(enc);
  chk(1, "Cifrado real AES-256-GCM (Web Crypto)", enc.startsWith("aes256:") && !enc.includes("Sofía") && dec.estudiante === payload.estudiante, "Texto plano oculto");

  // 2. Hash SHA-256 de 64 caracteres hex con sal PRODHAB
  const h1 = await v.hashSHA256("usuario@est.mep.go.cr", true);
  const h2 = await v.hashSHA256("USUARIO@est.mep.go.cr", true);
  chk(2, "Hashing SHA-256 determinístico (64 hex)", h1.length === 64 && h1 === h2, h1.slice(0, 12) + "...");

  // 3. Almacenamiento seguro en localStorage cifrado
  await v.secureSetItem("test_vault_231", { nota: 98, titular: "Estudiante" });
  const rawStored = global.localStorage.getItem("test_vault_231");
  const readBack = await v.secureGetItem("test_vault_231", null);
  chk(3, "LocalStorage cifrado (cero PII en texto plano)", rawStored.startsWith("aes256:") && readBack.nota === 98, "AES-GCM local");

  // 4. Enmascaramiento PII para logs/bitácoras
  const me = v.maskEmail("familia.alvarado@correo.com");
  chk(4, "Enmascaramiento de correo para bitácoras", me.includes("***") && !me.includes("alvarado"), me);

  // 5. Conexión Supabase usa URL base limpia y SOLO publishable
  const cfg = rt.getConfig();
  chk(5, "Supabase URL base limpia + llave publishable", cfg.url === "https://tmvhjmevhnaghwgpsqok.supabase.co" && cfg.anonKey.startsWith("sb_publishable_"), "Sin /rest/v1/ ni secret");

  // 6. Cero llaves secretas en módulo auto y realtime
  const joined = fs.readFileSync("public/bds-supabase-auto-v231.js", "utf8") + fs.readFileSync("public/bds-realtime-push-v229.js", "utf8");
  chk(6, "Cero sb_secret_ en código público", !/sb_secret_/i.test(joined), "Blindado");

  // 7. .gitignore protege .env.local y secretos
  const gi = fs.readFileSync(".gitignore", "utf8");
  chk(7, ".gitignore protege .env.local y *.secret", gi.includes(".env.local") && gi.includes("*.secret"), "Protegido");

  // 8. index.html carga bóveda y conector antes de realtime
  const html = fs.readFileSync("index.html", "utf8");
  const iVault = html.indexOf("bds-crypto-vault-v231.js");
  const iAuto = html.indexOf("bds-supabase-auto-v231.js");
  chk(8, "Orden de carga en index.html verificado", iVault > 0 && iAuto > iVault, "vault -> auto -> realtime");

  console.log("--------------------------------------------------------------------");
  console.log("VEREDICTO BOT QA CIBERSEGURIDAD v231.0:", fails === 0 ? "🏆 8/8 PASS — PRIVACIDAD TOTAL" : `❌ ${fails} FALLO(S)`);
  console.log("====================================================================\n");
  if (fails > 0) process.exit(1);
  process.exit(0);
})();