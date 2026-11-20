#!/usr/bin/env node
const fs = require("fs");
global.window = global;
global.window.addEventListener = () => {};
global.window.location = { origin: "https://www.practicatecnica.com", pathname: "/", hash: "", reload() {} };
global.document = { body: {}, getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, appendChild() {} }) };
global.localStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };
global.sessionStorage = { _m: {}, getItem(k){ return this._m[k]||null; }, setItem(k,v){ this._m[k]=String(v); }, removeItem(k){ delete this._m[k]; } };

eval(fs.readFileSync("public/bds-superadmin-auth-v232.js", "utf8"));

(async () => {
  let fails = 0;
  function chk(n, lbl, ok, det) {
    console.log(`  [${String(n).padStart(2,"0")}/09] ${lbl.padEnd(48," ")} : ${ok ? "✅ PASS" : "❌ FAIL"} ${det ? "(" + det + ")" : ""}`);
    if (!ok) fails++;
  }

  console.log("\n👑 ============== BOT QA LOGIN & SUPERADMIN v232.0 ==============");
  const api = global.BDS_SUPERADMIN_AUTH_V232;
  const ownerMail = "maxi." + "salsa@gmail.com";

  // 1. Contraseña vacía devuelve aviso claro sin trabarse
  const rEmpty = await api.autenticarUsuario({ email: ownerMail, nombre: "Owner", rolSeleccionado: "Estudiante / Rol Asignado", password: "" });
  chk(1, "Aviso claro si falta contraseña", !rEmpty.ok && rEmpty.needPassword === true, "No se queda pegado");

  // 2. SuperAdmin ingresa con Poder Absoluto aunque el combo diga Estudiante
  const rSA = await api.autenticarUsuario({ email: ownerMail, nombre: "Dirección Propietaria", rolSeleccionado: "Estudiante / Rol Asignado", seccion: "11-1", password: "ClavePruebaSegura2026!" });
  chk(2, "Poder Absoluto SuperAdmin forzado por SHA-256", rSA.ok && rSA.sesion.rol === "SuperAdmin" && rSA.sesion.poderAbsoluto === true, `Rol: ${rSA.sesion && rSA.sesion.rol}`);

  // 3. Sesión guardada en sessionStorage y localStorage
  const savedSes = JSON.parse(global.localStorage.getItem(api.SESSION_KEY) || "null");
  chk(3, "Sesión SuperAdmin persistida en storage", Boolean(savedSes && savedSes.esSuperAdmin && savedSes.autenticado), api.SESSION_KEY);

  // 4. Bloqueo antifraude al 5to intento fallido
  await api.autenticarUsuario({ email: "docente@mep.go.cr", nombre: "Docente", rolSeleccionado: "Docente MEP", password: "ClaveValida2026" });
  let lastFail = null;
  for (let i = 0; i < 5; i++) {
    lastFail = await api.autenticarUsuario({ email: "docente@mep.go.cr", nombre: "Docente", rolSeleccionado: "Docente MEP", password: "incorrecta" });
  }
  chk(4, "Bloqueo automático tras 5 intentos fallidos", Boolean(!lastFail.ok && lastFail.locked === true), "5/5 bloqueado");

  // 5. Desbloqueo de cuenta por SuperAdmin
  const rUnl = await api.desbloquearCuenta("docente@mep.go.cr");
  const rOkAfter = await api.autenticarUsuario({ email: "docente@mep.go.cr", nombre: "Docente", rolSeleccionado: "Docente MEP", password: "ClaveValida2026" });
  chk(5, "Desbloqueo de cuenta por SuperAdmin", Boolean(rUnl.ok && rOkAfter.ok), "Cuenta restaurada");

  // 6. Recuperar / cambiar contraseña con confirmación
  const rBadRec = await api.recuperarCambiarClave("docente@mep.go.cr", "NuevaClave1", "OtraDiferente");
  const rOkRec = await api.recuperarCambiarClave("docente@mep.go.cr", "NuevaClave2026!", "NuevaClave2026!");
  const rLoginNew = await api.autenticarUsuario({ email: "docente@mep.go.cr", nombre: "Docente", rolSeleccionado: "Docente MEP", password: "NuevaClave2026!" });
  chk(6, "Recuperación y cambio de clave SHA-256", !rBadRec.ok && rOkRec.ok && rLoginNew.ok, "Hash actualizado");

  // 7. Cierre de sesión limpio (Logout)
  api.cerrarSesionLimpia();
  chk(7, "Cerrar sesión limpia storage correctamente", global.localStorage.getItem(api.SESSION_KEY) === null, "Logout limpio");

  // 8. Privacidad absoluta: cero correos personales ni secretos en código público
  const src = fs.readFileSync("public/bds-superadmin-auth-v232.js", "utf8");
  chk(8, "Cero correos personales ni secretos en código", !/maxi\.salsa|sb_secret_|Prueba Rápida/i.test(src), "Solo SHA-256");

  // 9. index.html enlazado con bds-superadmin-auth-v232.js
  const html = fs.readFileSync("index.html", "utf8");
  chk(9, "index.html enlaza módulo auth v232", html.includes("bds-superadmin-auth-v232.js?v=232"), "Enlazado");

  console.log("--------------------------------------------------------------------");
  console.log("VEREDICTO BOT QA LOGIN v232.0:", fails === 0 ? "🏆 9/9 PASS — CALIDAD BDS PRODUCCIÓN" : `❌ ${fails} FALLO(S)`);
  console.log("====================================================================\n");
  if (fails > 0) process.exit(1);
  process.exit(0);
})();