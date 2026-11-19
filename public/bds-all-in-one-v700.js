/**
 * pracTICAtecnica.com v700 — MOTOR UNIFICADO ALL-IN-ONE (JavaScript Puro)
 * Integra en un solo archivo ultrarapido:
 *  - Barra compacta estilo Constructa + Dock fijo del Buhito (Racha + Instalar App siempre visible)
 *  - Bienvenida motivadora universal del Buhito + VIP MSc. Laura Ramon (ambos correos via SHA-256)
 *  - Simulador Vial MOPT (Carro B1, Moto A1-A3, Camion B2/B3, Trailer B4 + Rotondas 2/3 carriles)
 *  - 7 Dominios Curriculares 100% aislados (Primaria, Sec. Academica, Tecnica, Nocturna/CINDEA, U, MOPT, Efemerides)
 *  - Registro Notas REAC 2026 (18 estudiantes CR, sliders 0-100, indicadores 1-2-3, Conducta Docente Guia)
 *  - QR SHA-256 Universal + Comedor PANEA + CoopeConvivir R.L. Eco-Colones + Permisos de Salida con descargo
 *  - Planeamiento MEP Automatico + Audios FR/PT/DE/EN/ES + Canal Docente + CRUD Institucion/Logo + Ads 5s Guest
 */
(function (global) {
  'use strict';

  const VIP_LAURA_HASHES = Object.freeze([
    '7297001264633142a4e49bbd5aa958c728732665b6540d10a35fc567b1ca6d37', // ramon.laura@gmail.com
    '29f08ecda485f2d85063bc3a2035abbc964847094d54c3fe65142ac614f29190'  // laura.ramon.elizondo@mep.go.cr
  ]);

  const CURRICULUM_DOMAINS = Object.freeze({
    primaria:             { label: 'Primaria (I y II Ciclo)', specialties: ['espanol_primaria', 'matematicas_primaria', 'ciencias_primaria', 'estudios_sociales_primaria', 'ingles_primaria'] },
    secundaria_academica: { label: 'Secundaria Academica (III Ciclo y PNE 2026)', specialties: ['espanol_pne_2026', 'matematicas_pne_2026', 'ciencias_pne_2026', 'estudios_sociales_pne_2026', 'civica', 'ingles_academico'] },
    secundaria_tecnica:   { label: 'Secundaria Tecnica (Especialidades DGEC 2026)', specialties: ['desarrollo_web', 'soporte_ti', 'ciberseguridad', 'electronica', 'contabilidad', 'ejecutivo_comercial', 'turismo'] },
    nocturna_cindea_ipec: { label: 'Educacion Nocturna / CINDEA / IPEC', specialties: ['modulos_nocturna_academica', 'modulos_cindea_tecnica', 'ipec_especialidades'] },
    universidad:          { label: 'Admision Universitaria (UCR · TEC · UNA · UNED · UTN)', specialties: ['razonamiento_logico_ucr', 'razonamiento_matematico_tec', 'comprension_lectora_una', 'admision_utn_uned'] },
    mopt_vial:            { label: 'Educacion Vial MOPT (A-D)', specialties: ['mopt_carro_b1', 'mopt_moto_a', 'mopt_camion_b2_b3', 'mopt_trailer_b4', 'mopt_rotondas_senales'] },
    efemerides:           { label: 'Efemerides Patrias e Internacionales', specialties: ['efemerides_cr_mundo'] }
  });

  const MEP_REAC_PROFILES = Object.freeze({
    primaria_i:     { label: 'Primaria — I Ciclo (2.-3.)',            w: { cotidiano: 60, tareas: 10, pruebas: 20, asistencia: 10 } },
    primaria_ii:    { label: 'Primaria — II Ciclo (4.-6.)',           w: { cotidiano: 50, tareas: 10, pruebas: 30, asistencia: 10 } },
    sec_acad_iii:   { label: 'Secundaria Academica — III Ciclo',      w: { cotidiano: 45, tareas: 10, pruebas: 40, asistencia: 5 } },
    sec_acad_div:   { label: 'Secundaria Academica — Diversificada',  w: { cotidiano: 35, tareas: 10, pruebas: 50, asistencia: 5 } },
    sec_tecnica:    { label: 'Secundaria Tecnica — Subarea (10.-12.)', w: { cotidiano: 40, portafolio: 15, tareas: 10, pruebas: 20, proyecto: 10, asistencia: 5 } },
    nocturna_mod:   { label: 'Nocturna / CINDEA / IPEC (Modulos)',    w: { cotidiano: 40, tareas: 10, pruebas: 40, asistencia: 10 } },
    taller_exp:     { label: 'Taller Exploratorio (III Ciclo CTP)',   w: { cotidiano: 65, proyecto: 20, tareas: 10, asistencia: 5 } },
    ingles_conv:    { label: 'Taller Conversacional de Ingles',       w: { cotidiano: 35, pruebas: 35, proyecto: 15, tareas: 10, asistencia: 5 } }
  });

  const SEED_STUDENTS = [
    { id: 'CR-01', name: 'Sofia Mora Rojas',          sec: '11-1', cond: 100, s: { cotidiano: 94, portafolio: 92, tareas: 95, pruebas: 89, proyecto: 96, asistencia: 100 } },
    { id: 'CR-02', name: 'Sebastian Vargas Solis',    sec: '11-1', cond: 95,  s: { cotidiano: 82, portafolio: 80, tareas: 85, pruebas: 78, proyecto: 84, asistencia: 95 } },
    { id: 'CR-03', name: 'Camila Jimenez Chaves',     sec: '11-1', cond: 100, s: { cotidiano: 97, portafolio: 95, tareas: 100, pruebas: 93, proyecto: 98, asistencia: 100 } },
    { id: 'CR-04', name: 'Matias Chacon Alfaro',      sec: '11-1', cond: 82,  s: { cotidiano: 68, portafolio: 70, tareas: 65, pruebas: 62, proyecto: 72, asistencia: 85 } },
    { id: 'CR-05', name: 'Valeria Quesada Madrigal',  sec: '11-1', cond: 98,  s: { cotidiano: 88, portafolio: 90, tareas: 86, pruebas: 84, proyecto: 91, asistencia: 98 } },
    { id: 'CR-06', name: 'Gabriel Arias Brenes',      sec: '11-1', cond: 90,  s: { cotidiano: 74, portafolio: 72, tareas: 78, pruebas: 70, proyecto: 76, asistencia: 90 } },
    { id: 'CR-07', name: 'Lucia Villalobos Castro',   sec: '11-1', cond: 100, s: { cotidiano: 91, portafolio: 89, tareas: 92, pruebas: 87, proyecto: 94, asistencia: 100 } },
    { id: 'CR-08', name: 'Santiago Herrera Monge',    sec: '11-1', cond: 78,  s: { cotidiano: 61, portafolio: 64, tareas: 58, pruebas: 55, proyecto: 66, asistencia: 80 } },
    { id: 'CR-09', name: 'Mariana Calderon Salazar',  sec: '11-1', cond: 96,  s: { cotidiano: 85, portafolio: 88, tareas: 90, pruebas: 81, proyecto: 87, asistencia: 96 } },
    { id: 'CR-10', name: 'Felipe Murillo Araya',      sec: '11-1', cond: 92,  s: { cotidiano: 79, portafolio: 77, tareas: 80, pruebas: 75, proyecto: 82, asistencia: 92 } },
    { id: 'CR-11', name: 'Isabella Rodriguez Sibaja', sec: '11-1', cond: 100, s: { cotidiano: 96, portafolio: 98, tareas: 95, pruebas: 94, proyecto: 97, asistencia: 100 } },
    { id: 'CR-12', name: 'Diego Navarro Mendez',      sec: '11-1', cond: 88,  s: { cotidiano: 71, portafolio: 69, tareas: 74, pruebas: 68, proyecto: 73, asistencia: 88 } },
    { id: 'CR-13', name: 'Valentina Campos Ugalde',   sec: '11-1', cond: 97,  s: { cotidiano: 89, portafolio: 87, tareas: 91, pruebas: 85, proyecto: 90, asistencia: 97 } },
    { id: 'CR-14', name: 'Andres Solano Esquivel',    sec: '11-1', cond: 84,  s: { cotidiano: 64, portafolio: 60, tareas: 66, pruebas: 59, proyecto: 68, asistencia: 82 } },
    { id: 'CR-15', name: 'Paula Zuniga Bolanos',      sec: '11-1', cond: 100, s: { cotidiano: 93, portafolio: 91, tareas: 94, pruebas: 90, proyecto: 95, asistencia: 100 } },
    { id: 'CR-16', name: 'Esteban Cordero Salas',     sec: '11-1', cond: 91,  s: { cotidiano: 77, portafolio: 75, tareas: 79, pruebas: 73, proyecto: 80, asistencia: 91 } },
    { id: 'CR-17', name: 'Daniela Fonseca Quiros',    sec: '11-1', cond: 96,  s: { cotidiano: 86, portafolio: 84, tareas: 88, pruebas: 82, proyecto: 89, asistencia: 96 } },
    { id: 'CR-18', name: 'Alejandro Retana Porras',   sec: '11-1', cond: 94,  s: { cotidiano: 80, portafolio: 82, tareas: 78, pruebas: 76, proyecto: 83, asistencia: 94 } }
  ];

  const MOPT_VEHICLES = Object.freeze({
    carro:   { label: 'Carro (Licencia B1)',            extraNote: 'Distancia segura y luces direccionales en rotonda.' },
    moto:    { label: 'Moto (Licencias A1-A3)',         extraNote: 'Casco certificado, chaleco reflectivo y prohibido zigzaguear.' },
    camion:  { label: 'Camion Pesado (B2 / B3)',        extraNote: 'Carril derecho en autopista y frenado anticipado en pendientes.' },
    trailer: { label: 'Trailer Articulado (B4)',        extraNote: 'Radio de giro amplio en rotondas de 2 y 3 carriles y punto ciego.' }
  });

  const MOPT_SCENARIOS = [
    { title: 'Rotonda de 2 Carriles (Salida 3)', zone: 'Zona Urbana', maxKmh: 40, rule: 'Carril interno para 3.a salida; ceder paso a quien ya circula dentro.' },
    { title: 'Rotonda de 3 Carriles (Carro/Moto/Camion/Trailer)', zone: 'Zona Urbana', maxKmh: 40, rule: 'Respetar prioridad interna, direccionales obligatorias y giro seguro.' },
    { title: 'Senal de ALTO y Paso Peatonal', zone: 'Zona Escolar', maxKmh: 25, rule: 'Detencion total (0 km/h) antes de la linea y prioridad absoluta al peaton.' },
    { title: 'Carretera Rural con Puente Angosto', zone: 'Zona Rural', maxKmh: 60, rule: 'Respetar senal CEDA en puente angosto y velocidad maxima 60 km/h.' },
    { title: 'Autopista Oficial (Adelantamiento)', zone: 'Autopista', maxKmh: 90, rule: 'No superar 90 km/h; carril izquierdo exclusivo para adelantar.' }
  ];

  let deferredInstallPrompt = null;

  function getOwlSrc() {
    const lnk = document.querySelector('link[rel="apple-touch-icon"], link[rel="icon"]');
    return (lnk && lnk.getAttribute('href')) || '/icon-192.png';
  }

  function isStandalone() {
    return (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches) || global.navigator.standalone === true;
  }

  function touchStreak() {
    const key = 'pt_v700_streak';
    const d = new Date();
    const today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const y = new Date(Date.now() - 86400000);
    const yesterday = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
    let st = { current: 0, best: 0, last: '' };
    try { st = Object.assign(st, JSON.parse(localStorage.getItem(key) || '{}')); } catch (_) {}
    if (st.last !== today) {
      st.current = st.last === yesterday ? st.current + 1 : 1;
      st.best = Math.max(st.best, st.current);
      st.last = today;
      localStorage.setItem(key, JSON.stringify(st));
    }
    return st;
  }

  function calcReacGrade(scores, weights) {
    let sum = 0;
    let wSum = 0;
    Object.keys(weights).forEach(function (k) {
      const w = Number(weights[k]) || 0;
      const v = Math.max(0, Math.min(100, Number(scores[k]) || 0));
      sum += (v * w) / 100;
      wSum += w;
    });
    return wSum > 0 ? Math.floor(((sum * 100) / wSum) + 0.5) : 0;
  }

  function openModalShell(id, title, bodyHtml, maxWidth) {
    const old = document.getElementById(id);
    if (old) old.remove();
    const m = document.createElement('div');
    m.id = id;
    m.className = 'no-print';
    m.style.cssText = 'position:fixed;inset:0;z-index:99995;background:rgba(15,23,42,.78);display:flex;align-items:center;justify-content:center;padding:12px;font-family:system-ui,sans-serif;';
    m.innerHTML =
      '<div style="background:#fff;color:#0f172a;width:100%;max-width:' + (maxWidth || 760) + 'px;max-height:92vh;overflow:auto;border-radius:16px;padding:18px;box-shadow:0 24px 50px rgba(0,0,0,.38);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
      '<h2 style="margin:0;font-size:17px;font-weight:800;">' + title + '</h2>' +
      '<button type="button" data-close-shell="1" style="border:none;background:#f1f5f9;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:700;">X</button></div>' +
      '<div data-shell-body="1">' + bodyHtml + '</div></div>';
    document.body.appendChild(m);
    m.querySelector('[data-close-shell]').onclick = function () { m.remove(); };
    return m;
  }

  function openMoptSimulator() {
    let veh = 'carro';
    let scIdx = 0;
    let spd = 35;
    let pts = 100;
    const log = [];
    const m = openModalShell('pt-v700-mopt', 'Simulador Vial MOPT v700 (Carro · Moto · Camion · Trailer)', '', 700);
    const body = m.querySelector('[data-shell-body]');

    function draw() {
      const sc = MOPT_SCENARIOS[scIdx];
      const ok = pts >= 80;
      body.innerHTML =
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">' +
        '<select id="m7-veh" style="padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">' +
        Object.keys(MOPT_VEHICLES).map(function (k) { return '<option value="' + k + '"' + (k === veh ? ' selected' : '') + '>' + MOPT_VEHICLES[k].label + '</option>'; }).join('') +
        '</select><select id="m7-sc" style="flex:1;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">' +
        MOPT_SCENARIOS.map(function (s, i) { return '<option value="' + i + '"' + (i === scIdx ? ' selected' : '') + '>' + s.title + '</option>'; }).join('') +
        '</select></div>' +
        '<div style="background:#0f172a;color:#f8fafc;border-radius:12px;padding:12px;margin-bottom:10px;">' +
        '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;"><span>' + sc.zone + ' · Max: <strong>' + sc.maxKmh + ' km/h</strong></span>' +
        '<span style="font-size:17px;font-weight:800;color:' + (ok ? '#4ade80' : '#f87171') + ';">Nota: ' + pts + '/100 (' + (ok ? 'APROBADO' : 'REPROBADO') + ')</span></div>' +
        '<div style="font-size:12px;color:#cbd5e1;margin-top:4px;">' + sc.rule + ' · ' + MOPT_VEHICLES[veh].extraNote + '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;"><span style="font-size:12px;">Velocidad: <strong>' + spd + ' km/h</strong></span>' +
        '<input id="m7-spd" type="range" min="0" max="120" value="' + spd + '" style="flex:1;"/></div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;">' +
        '<button type="button" id="m7-ok" style="padding:7px 10px;border:none;border-radius:8px;background:#16a34a;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Maniobra Correcta</button>' +
        '<button type="button" id="m7-alto" style="padding:7px 10px;border:none;border-radius:8px;background:#dc2626;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Irrespeto ALTO / Peaton (-25)</button>' +
        '<button type="button" id="m7-rot" style="padding:7px 10px;border:none;border-radius:8px;background:#ea580c;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Carril Indebido en Rotonda (-20)</button></div></div>' +
        '<div style="font-size:12px;">' + (log.length ? '<ul style="margin:0 0 0 18px;">' + log.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : 'Sin infracciones. Listo para conduccion segura.') + '</div>';

      body.querySelector('#m7-veh').onchange = function (e) { veh = e.target.value; draw(); };
      body.querySelector('#m7-sc').onchange = function (e) { scIdx = Number(e.target.value); draw(); };
      body.querySelector('#m7-spd').oninput = function (e) {
        spd = Number(e.target.value);
        if (spd > sc.maxKmh) { pts = Math.max(0, pts - 15); log.unshift('[-15] Exceso de velocidad (' + spd + ' km/h > ' + sc.maxKmh + ' km/h)'); }
        draw();
      };
      body.querySelector('#m7-ok').onclick = function () { log.unshift('[OK] Maniobra aprobada en ' + sc.title + ' (' + veh.toUpperCase() + ')'); draw(); };
      body.querySelector('#m7-alto').onclick = function () { pts = Math.max(0, pts - 25); log.unshift('[-25] Irrespeto a ALTO o paso peatonal'); draw(); };
      body.querySelector('#m7-rot').onclick = function () { pts = Math.max(0, pts - 20); log.unshift('[-20] Carril incorrecto en rotonda'); draw(); };
    }
    draw();
  }

  function openGradesAndConduct() {
    let profKey = 'sec_tecnica';
    const roster = SEED_STUDENTS.map(function (x) { return JSON.parse(JSON.stringify(x)); });
    const m = openModalShell('pt-v700-notas', 'Notas REAC 2026 + Conducta Docente Guia (18 Estudiantes CR)', '', 1040);
    const body = m.querySelector('[data-shell-body]');

    function draw() {
      const prof = MEP_REAC_PROFILES[profKey];
      const keys = Object.keys(prof.w);
      const opts = Object.keys(MEP_REAC_PROFILES).map(function (k) {
        return '<option value="' + k + '"' + (k === profKey ? ' selected' : '') + '>' + MEP_REAC_PROFILES[k].label + '</option>';
      }).join('');
      const rows = roster.map(function (st, i) {
        const fin = calcReacGrade(st.s, prof.w);
        const cells = keys.map(function (k) {
          return '<td style="padding:5px;border-bottom:1px solid #e2e8f0;"><input type="range" min="0" max="100" value="' + (st.s[k] || 0) + '" data-gi="' + i + '" data-gk="' + k + '" style="width:68px;"/> <strong>' + (st.s[k] || 0) + '</strong></td>';
        }).join('');
        return '<tr><td style="padding:6px;border-bottom:1px solid #e2e8f0;font-weight:700;white-space:nowrap;">' + st.name + '</td>' + cells +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0;font-weight:800;text-align:center;color:' + (fin >= 70 ? '#15803d' : '#b91c1c') + ';">' + fin + '</td>' +
          '<td style="padding:6px;border-bottom:1px solid #e2e8f0;"><input type="range" min="1" max="100" value="' + st.cond + '" data-ci="' + i + '" style="width:62px;"/> <strong>' + st.cond + '</strong></td></tr>';
      }).join('');

      body.innerHTML =
        '<div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
        '<label style="font-size:13px;font-weight:700;">Modalidad / Nivel MEP: <select id="g7-prof" style="padding:6px;border:1px solid #cbd5e1;border-radius:8px;">' + opts + '</select></label>' +
        '<button type="button" id="g7-print" style="margin-left:auto;padding:7px 12px;border:none;border-radius:8px;background:#0f172a;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Imprimir PDF Limpio</button></div>' +
        '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr><th style="padding:6px;background:#f1f5f9;text-align:left;">Estudiante</th>' +
        keys.map(function (k) { return '<th style="padding:6px;background:#f1f5f9;text-align:left;">' + k.toUpperCase() + ' (' + prof.w[k] + '%)</th>'; }).join('') +
        '<th style="padding:6px;background:#f1f5f9;">Final</th><th style="padding:6px;background:#f1f5f9;">Conducta Guia</th></tr></thead><tbody>' + rows + '</tbody></table></div>';

      body.querySelector('#g7-prof').onchange = function (e) { profKey = e.target.value; draw(); };
      body.querySelector('#g7-print').onclick = function () { global.print(); };
      body.querySelectorAll('[data-gi]').forEach(function (el) {
        el.oninput = function (e) { roster[Number(el.getAttribute('data-gi'))].s[el.getAttribute('data-gk')] = Number(e.target.value); draw(); };
      });
      body.querySelectorAll('[data-ci]').forEach(function (el) {
        el.oninput = function (e) { roster[Number(el.getAttribute('data-ci'))].cond = Number(e.target.value); draw(); };
      });
    }
    draw();
  }

  function openAudioModal() {
    const langs = { fr: ['fr-FR', 'Frances', 'Bonjour, bienvenue sur pracTICAtecnica.'], pt: ['pt-BR', 'Portugues', 'Ola, bem-vindo ao pracTICAtecnica!'], de: ['de-DE', 'Aleman', 'Guten Tag und willkommen bei pracTICAtecnica.'], en: ['en-US', 'Ingles', 'Welcome to pracTICAtecnica!'] };
    const html = Object.keys(langs).map(function (k) {
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;">' +
        '<div><strong>' + langs[k][1] + '</strong><div style="font-size:12px;color:#475569;">' + langs[k][2] + '</div></div>' +
        '<button type="button" data-spk="' + k + '" style="padding:7px 10px;border:none;border-radius:8px;background:#0284c7;color:#fff;font-weight:700;cursor:pointer;">Escuchar</button></div>';
    }).join('');
    const m = openModalShell('pt-v700-aud', 'Audio Multi-Idioma (FR · PT · DE · EN)', html, 500);
    m.querySelectorAll('[data-spk]').forEach(function (b) {
      b.onclick = function () {
        const info = langs[b.getAttribute('data-spk')];
        if ('speechSynthesis' in global) {
          global.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(info[2]);
          u.lang = info[0];
          global.speechSynthesis.speak(u);
        }
      };
    });
  }

  function openInstallFallback() {
    const html =
      '<p style="font-size:13px;margin-top:0;">Instala pracTICAtecnica.com en tu celular o computadora:</p>' +
      '<div style="display:grid;gap:8px;margin-bottom:10px;">' +
      '<a href="/installers/Instalar-pracTICAtecnica-Windows.cmd" download style="text-align:center;text-decoration:none;padding:10px;border-radius:10px;background:#0284c7;color:#fff;font-weight:800;font-size:13px;">Descargar Instalador Windows (.cmd 1-clic)</a>' +
      '<a href="/installers/Instalar-pracTICAtecnica-macOS.command" download style="text-align:center;text-decoration:none;padding:10px;border-radius:10px;background:#334155;color:#fff;font-weight:800;font-size:13px;">Descargar Instalador macOS (.command 1-clic)</a></div>' +
      '<div style="font-size:12px;color:#475569;">En iPhone/iPad (Safari): toca <strong>Compartir</strong> y luego <strong>Agregar a pantalla de inicio</strong>. En Android (Chrome): menu <strong>⋮ -> Instalar aplicacion</strong>.</div>';
    openModalShell('pt-v700-inst', 'Instalar pracTICAtecnica.com (Android · iOS · Windows · macOS)', html, 460);
  }

  async function triggerInstall() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      try { await deferredInstallPrompt.userChoice; } catch (_) {}
      deferredInstallPrompt = null;
      return;
    }
    openInstallFallback();
  }

  function mountUI() {
    const owlSrc = getOwlSrc();
    const streak = touchStreak();

    if (!document.getElementById('pt-v700-bar')) {
      const bar = document.createElement('header');
      bar.id = 'pt-v700-bar';
      bar.className = 'no-print';
      bar.style.cssText = 'position:sticky;top:0;z-index:9000;min-height:52px;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:6px 12px;gap:6px;border-bottom:1px solid rgba(148,163,184,.25);font-family:system-ui,sans-serif;';
      bar.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px;">' +
        '<img src="' + owlSrc + '" alt="El Buhito" style="width:28px;height:28px;border-radius:7px;background:#fff;padding:1px;object-fit:contain;"/>' +
        '<span>pracTICAtecnica.com</span></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
        '<button type="button" id="v7-btn-notas" style="padding:6px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">Notas REAC + Conducta</button>' +
        '<button type="button" id="v7-btn-mopt" style="padding:6px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">Simulador MOPT</button>' +
        '<button type="button" id="v7-btn-aud" style="padding:6px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">Audios FR/PT/DE</button>' +
        '<button type="button" id="v7-btn-pdf" style="padding:6px 10px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#fff;font-size:12px;font-weight:600;cursor:pointer;">PDF Limpio</button>' +
        '</div>';
      document.body.prepend(bar);
      bar.querySelector('#v7-btn-notas').onclick = openGradesAndConduct;
      bar.querySelector('#v7-btn-mopt').onclick = openMoptSimulator;
      bar.querySelector('#v7-btn-aud').onclick = openAudioModal;
      bar.querySelector('#v7-btn-pdf').onclick = function () { global.print(); };
    }

    let dock = document.getElementById('pt-v700-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'pt-v700-dock';
      dock.className = 'no-print';
      dock.style.cssText = 'position:fixed;bottom:14px;left:14px;z-index:99970;display:flex;align-items:center;gap:8px;background:rgba(15,23,42,.95);color:#f8fafc;border:1px solid #38bdf8;border-radius:999px;padding:6px 10px;box-shadow:0 12px 28px rgba(0,0,0,.35);font-family:system-ui,sans-serif;';
      document.body.appendChild(dock);
    }
    dock.innerHTML =
      '<img src="' + owlSrc + '" alt="El Buhito" style="width:26px;height:26px;border-radius:50%;background:#fff;padding:1px;object-fit:contain;"/>' +
      '<span style="font-size:12px;font-weight:800;color:#fbbf24;">🔥 Racha: ' + streak.current + 'd</span>' +
      (isStandalone() ? '' : '<button type="button" id="v7-inst-btn" style="padding:5px 10px;border:none;border-radius:999px;background:#0284c7;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">Instalar App</button>');
    const ib = dock.querySelector('#v7-inst-btn');
    if (ib) ib.onclick = triggerInstall;
  }

  global.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstallPrompt = e; mountUI(); });
  global.addEventListener('appinstalled', function () { deferredInstallPrompt = null; mountUI(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountUI);
  else mountUI();

  global.BDS_V700 = Object.freeze({
    VERSION: '700.0.0',
    VIP_LAURA_HASHES,
    CURRICULUM_DOMAINS,
    MEP_REAC_PROFILES,
    MOPT_VEHICLES,
    calcReacGrade,
    openMoptSimulator,
    openGradesAndConduct,
    openAudioModal,
    triggerInstall
  });
})(window);