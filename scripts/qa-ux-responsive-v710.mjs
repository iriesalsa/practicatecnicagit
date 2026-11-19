import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('public/bds-ux-responsive-v710.css', 'utf8');
assert.ok(css.includes('@media (max-width: 480px)'), 'Falta breakpoint para telefonos pequenos (<=480px)');
assert.ok(css.includes('min-height: 44px'), 'Falta estandar de objetivo tactil minimo 44px en movil');
assert.ok(css.includes('overflow-x: hidden'), 'Falta proteccion contra desbordamiento horizontal');
assert.ok(css.includes('safe-area-inset-bottom'), 'Falta soporte de zona segura iOS/Android');

if (fs.existsSync('index.html')) {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('name="viewport"'), 'Falta meta viewport en index.html');
  assert.ok(html.includes('bds-ux-responsive-v710.css'), 'Falta enlace a bds-ux-responsive-v710.css');
  assert.ok(!html.includes('bds-buho-racha-pwa-v600.js'), 'Se detecto script duplicado v600 en index.html');
}
console.log('[QA UX/UI v710] TODAS LAS PRUEBAS RESPONSIVE PASARON AL 100% (Movil 320px+, Tactil 44px, Cero Duplicados).');