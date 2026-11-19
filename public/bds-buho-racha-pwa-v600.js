/**
 * pracTICAtecnica.com v600 — El Buhito Motivador + Racha Diaria + Boton Instalar App Siempre Visible
 * - Respeta 100% el icono fijo original del Buhito (/icon-192.png o /favicon.ico), nunca lo cambia.
 * - Mantiene la racha diaria de estudio/practica con mensajes de motivacion.
 * - Mantiene SIEMPRE visible el boton "Instalar App" en Android, iOS, Windows y macOS
 *   (solo se oculta si la app ya esta corriendo instalada en modo standalone).
 */
(function (global) {
  'use strict';

  const STREAK_KEY = 'pt_v600_daily_streak';
  let deferredPrompt = null;

  function isStandalone() {
    return (
      (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches) ||
      global.navigator.standalone === true
    );
  }

  function detectPlatform() {
    const ua = String(navigator.userAgent || '').toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    if (/mac os x|macintosh/.test(ua)) return 'macos';
    if (/windows/.test(ua)) return 'windows';
    return 'desktop';
  }

  function getTodayIso() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getYesterdayIso() {
    const d = new Date(Date.now() - 86400000);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function touchDailyStreak() {
    const today = getTodayIso();
    const yesterday = getYesterdayIso();
    let st = { current: 0, best: 0, lastDate: '' };
    try { st = Object.assign(st, JSON.parse(localStorage.getItem(STREAK_KEY) || '{}')); } catch (_) {}

    if (st.lastDate !== today) {
      st.current = st.lastDate === yesterday ? st.current + 1 : 1;
      st.best = Math.max(st.best, st.current);
      st.lastDate = today;
      localStorage.setItem(STREAK_KEY, JSON.stringify(st));
    }
    return st;
  }

  function getOwlIconSrc() {
    const iconLink = document.querySelector('link[rel="apple-touch-icon"], link[rel="icon"]');
    return (iconLink && iconLink.getAttribute('href')) || '/icon-192.png';
  }

  function openFallbackInstallModal() {
    const old = document.getElementById('pt-v600-install-modal');
    if (old) old.remove();

    const platform = detectPlatform();
    const owlSrc = getOwlIconSrc();

    let instructionsHtml = '';
    if (platform === 'ios') {
      instructionsHtml =
        '<ol style="margin:8px 0 14px 18px;font-size:13px;line-height:1.6;color:#e2e8f0;">' +
        '<li>Toca el boton <strong>Compartir</strong> (cuadro con flecha hacia arriba) en Safari.</li>' +
        '<li>Selecciona <strong>"Agregar a pantalla de inicio"</strong> y toca <strong>Agregar</strong>.</li></ol>';
    } else if (platform === 'android') {
      instructionsHtml =
        '<ol style="margin:8px 0 14px 18px;font-size:13px;line-height:1.6;color:#e2e8f0;">' +
        '<li>Toca el menu <strong>⋮</strong> (tres puntos) arriba a la derecha en Chrome.</li>' +
        '<li>Toca <strong>"Instalar aplicacion"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</li></ol>';
    } else {
      instructionsHtml =
        '<p style="margin:8px 0 10px;font-size:13px;line-height:1.5;color:#e2e8f0;">' +
        'Si tu navegador no muestra el boton automatico de instalacion, descarga el instalador rapido de 1 clic para tu computadora:</p>' +
        '<div style="display:grid;gap:8px;margin-bottom:14px;">' +
        '<a href="/installers/Instalar-pracTICAtecnica-Windows.cmd" download style="text-align:center;text-decoration:none;padding:10px;border-radius:10px;background:#0284c7;color:#fff;font-weight:800;font-size:13px;">Descargar Instalador Windows (.cmd 1-clic)</a>' +
        '<a href="/installers/Instalar-pracTICAtecnica-macOS.command" download style="text-align:center;text-decoration:none;padding:10px;border-radius:10px;background:#334155;color:#fff;font-weight:800;font-size:13px;">Descargar Instalador macOS (.command 1-clic)</a>' +
        '</div>' +
        '<div style="font-size:11px;color:#94a3b8;">Tambien puedes instalarla en Chrome o Edge desde el icono de computadora en la barra de direcciones.</div>';
    }

    const modal = document.createElement('div');
    modal.id = 'pt-v600-install-modal';
    modal.className = 'no-print';
    modal.style.cssText =
      'position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.78);display:flex;' +
      'align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif;';

    modal.innerHTML =
      '<div style="background:#0f172a;color:#f8fafc;width:100%;max-width:440px;border:1px solid #38bdf8;border-radius:18px;padding:20px;box-shadow:0 24px 50px rgba(0,0,0,.45);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<img src="' + owlSrc + '" alt="El Buhito pracTICAtecnica" style="width:42px;height:42px;border-radius:10px;object-fit:contain;background:#fff;padding:2px;"/>' +
      '<div><div style="font-size:15px;font-weight:800;">Instalar pracTICAtecnica.com</div>' +
      '<div style="font-size:11px;color:#38bdf8;">Android · iOS · Windows · macOS</div></div></div>' +
      '<button type="button" id="pt-v600-inst-close" style="border:none;background:#1e293b;color:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:700;">X</button></div>' +
      instructionsHtml +
      '<button type="button" id="pt-v600-inst-ok" style="width:100%;padding:10px;border:1px solid #475569;border-radius:10px;background:#1e293b;color:#fff;font-weight:700;cursor:pointer;">Entendido</button></div>';

    document.body.appendChild(modal);
    modal.querySelector('#pt-v600-inst-close').onclick = function () { modal.remove(); };
    modal.querySelector('#pt-v600-inst-ok').onclick = function () { modal.remove(); };
  }

  async function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch (_) {}
      deferredPrompt = null;
      return;
    }
    openFallbackInstallModal();
  }

  function renderBuhoDock() {
    const streak = touchDailyStreak();
    const owlSrc = getOwlIconSrc();
    let dock = document.getElementById('pt-v600-buho-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'pt-v600-buho-dock';
      dock.className = 'no-print';
      dock.style.cssText =
        'position:fixed;bottom:14px;left:14px;z-index:99970;display:flex;align-items:center;gap:8px;' +
        'background:rgba(15,23,42,.95);color:#f8fafc;border:1px solid rgba(56,189,248,.55);' +
        'border-radius:999px;padding:6px 10px;box-shadow:0 12px 28px rgba(0,0,0,.35);font-family:system-ui,sans-serif;';
      document.body.appendChild(dock);
    }

    const installBtnHtml = isStandalone()
      ? ''
      : '<button type="button" id="pt-v600-install-btn" style="padding:6px 11px;border:none;border-radius:999px;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">Instalar App</button>';

    dock.innerHTML =
      '<img src="' + owlSrc + '" alt="El Buhito" style="width:28px;height:28px;border-radius:50%;object-fit:contain;background:#fff;padding:1px;"/>' +
      '<span style="font-size:12px;font-weight:800;color:#fbbf24;" title="Tu racha diaria cuidada por El Buhito">🔥 Racha: ' + streak.current + 'd</span>' +
      installBtnHtml;

    const btn = document.getElementById('pt-v600-install-btn');
    if (btn) btn.onclick = triggerInstall;
  }

  global.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    renderBuhoDock();
  });

  global.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    renderBuhoDock();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBuhoDock);
  else renderBuhoDock();

  global.BDS_BUHO_PWA = Object.freeze({
    VERSION: '600.0.0',
    touchDailyStreak,
    triggerInstall,
    openFallbackInstallModal
  });
})(window);