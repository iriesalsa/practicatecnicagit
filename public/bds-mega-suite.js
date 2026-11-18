(function () {
  const BANCO_QA = [
    { id: "NET-01", esp: "Redes y Subneteo", niv: "11°", saber: "Subneteo VLSM IPv4", ind: "Segmenta bloques IPv4 sin solapamiento (REAC Nivel 3).", q: "Dada la red 172.16.10.0/24: ¿Qué prefijo y máscara corresponden a Laboratorios (100 hosts) y a Wi-Fi (50 hosts)?", opts: ["Labs: /25 (255.255.255.128) | Wi-Fi: /26 (255.255.255.192)", "Labs: /26 (.192) | Wi-Fi: /27 (.224)", "Labs: /24 (.0) | Wi-Fi: /25 (.128)"], ans: 0, exp: "100 hosts necesitan 7 bits (2^7 - 2 = 126 -> /25). 50 hosts necesitan 6 bits (2^6 - 2 = 62 -> /26)." },
    { id: "NET-02", esp: "Redes y Subneteo", niv: "11°", saber: "Subneteo Fijo FLSM y Enlaces WAN", ind: "Optimiza direccionamiento en enlaces seriales e internos.", q: "Al dividir 192.168.50.0/24 en 4 subredes fijas iguales (FLSM), ¿cuál es el salto de bloque y qué prefijo se usa en un enlace WAN de 2 routers?", opts: ["Salto de 64 (/26) para FLSM y prefijo /30 (255.255.255.252) para el enlace WAN", "Salto de 128 (/25) y prefijo /28 para WAN", "Salto de 32 (/27) y prefijo /29 para WAN"], ans: 0, exp: "2 bits prestados generan 4 subredes /26 con salto 64. Un enlace punto a punto usa /30 (2 hosts útiles)." },
    { id: "BAS-01", esp: "Sistemas Numéricos", niv: "10°", saber: "Conversión Binario, Octal, Decimal y Hexadecimal", ind: "Convierte octetos y nibbles sin errores de base.", q: "¿Cuál es la equivalencia exacta del octeto decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ | Tríos: 011 110 000 = 360₈ | Nibbles: 1111 0000 = F0₁₆." },
    { id: "BAS-02", esp: "Sistemas Numéricos", niv: "10°", saber: "Conversión Hexadecimal a Binario y Decimal", ind: "Traduce direcciones MAC e IPv6 a binario y decimal.", q: "El valor hexadecimal 0xC0 (primer octeto de 192.168.x.x) equivale en Decimal, Binario y Octal a:", opts: ["Decimal: 192 | Binario: 11000000 | Octal: 300", "Decimal: 128 | Binario: 10000000 | Octal: 200", "Decimal: 224 | Binario: 11100000 | Octal: 340"], ans: 0, exp: "C (12) = 1100 y 0 = 0000 -> 11000000₂ = 192₁₀ = 300₈." },
    { id: "IPV6-01", esp: "IPv6 y Protocolos", niv: "12°", saber: "Compresión RFC 5952, ICMPv6 NDP y SLAAC", ind: "Aplica reglas de compresión IPv6 y diagnostica protocolos de capa 3.", q: "¿Cuál es la forma comprimida de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo reemplaza a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo NDP (Neighbor Discovery Protocol) sobre ICMPv6", "2001:db8::a0::1 | Protocolo ARP extendido", "2001:0db8::a0:1 | Protocolo Broadcast ff02::1"], ans: 0, exp: "El operador '::' solo puede usarse una única vez. NDP (mensajes NS 135 y NA 136) sustituye a ARP." },
    { id: "SW-01", esp: "Diseño de Software y Calidad", niv: "12°", saber: "Riesgos de Planeación, Anticipación y Calidad ISO/IEC 25010", ind: "Evalúa matriz de riesgos y previene deuda técnica antes de codificar.", q: "¿Qué riesgo crítico enfrenta un proyecto de software cuando se omite la planeación de arquitectura y la anticipación de riesgos?", opts: ["Deuda técnica exponencial: corregir un fallo en producción cuesta hasta 10 veces más que prevenirlo en el diseño", "Reducción automática del tiempo de compilación", "Eliminación de pruebas unitarias y de aceptación"], ans: 0, exp: "La ingeniería de calidad (SQA) exige anticipar riesgos de seguridad, concurrencia y alcance (Scope Creep) en el diseño." },
    { id: "SW-02", esp: "Diseño de Software y Calidad", niv: "12°", saber: "Sobre-planeación vs Agilidad y Control de Alcance", ind: "Equilibra planeación adaptativa y criterios de aceptación (DoD).", q: "¿Cómo se controla el riesgo de 'Parálisis por Análisis' (sobre-planeación rígida) y el 'Scope Creep' en el desarrollo?", opts: ["Mediante entregas iterativas, criterios de aceptación verificables (Definition of Done) y control de versiones", "Codificando sin ningún levantamiento de requerimientos", "Prohibiendo las pruebas de usuario hasta el próximo año"], ans: 0, exp: "El diseño iterativo valida avances reales con criterios de calidad medibles en cada entrega." },
    { id: "OFF-01", esp: "Excel y Word Técnico", niv: "10°-12°", saber: "Funciones Lógicas SI/Y/O, BUSCARX y Documentación IEEE", ind: "Automatiza planillas de evaluación e informes técnicos con saltos de sección.", q: "¿Cuál fórmula de Excel evalúa en F2 si Nota (D2)>=70 Y Asistencia (E2)>=80% para mostrar 'APROBADO', y si no 'PENDIENTE'?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARX(D2>=70; E2>=80%; \"APROBADO\")"], ans: 0, exp: "La función Y() verifica que ambas condiciones lógicas se cumplan al mismo tiempo." },
    { id: "OFF-02", esp: "Excel y Word Técnico", niv: "10°-12°", saber: "Procesamiento de Textos Técnicos y Secciones en Word", ind: "Estructura informes SRS con tablas de contenido automáticas y páginas mixtas.", q: "En Word, para colocar únicamente la página del diagrama de red en orientación Horizontal sin cambiar el resto del informe Vertical, se debe usar:", opts: ["Saltos de sección (Página siguiente) antes y después de la página horizontal", "Espacios en blanco con la tecla Tabulador", "Saltos de línea simples con Enter"], ans: 0, exp: "Los saltos de sección permiten independizar orientación, márgenes y encabezados dentro del mismo documento." },
    { id: "ESP-01", esp: "Contabilidad, Electrónica y Logística", niv: "11°-12°", saber: "Prueba Ácida, Ley de Ohm y Punto de Reorden (ROP)", ind: "Resuelve indicadores financieros, eléctricos y de abastecimiento.", q: "Si un almacén consume 50 unidades/día, el proveedor tarda 6 días (Lead Time) y el stock de seguridad es de 100 unidades, ¿cuál es el Punto de Reorden (ROP)?", opts: ["400 unidades", "300 unidades", "156 unidades"], ans: 0, exp: "ROP = (Demanda diaria * Tiempo de entrega) + Stock de seguridad = (50 * 6) + 100 = 400 unidades." }
  ];

  window.abrirMegaSuiteEducativa = function () {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let xp = parseInt(localStorage.getItem('bds_xp_points') || '500', 10);
    let aciertos = parseInt(localStorage.getItem('bds_qa_aciertos') || '0', 10);
    let respondidas = parseInt(localStorage.getItem('bds_qa_total') || '0', 10);
    let filtro = 'TODAS';
    let idx = 0;

    const categorias = ['TODAS', ...new Set(BANCO_QA.map(x => x.esp))];

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.96);z-index:100001;overflow-y:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    function getItems() {
      return filtro === 'TODAS' ? BANCO_QA : BANCO_QA.filter(x => x.esp === filtro);
    }

    function pintar() {
      const lista = getItems();
      if (idx >= lista.length) idx = 0;
      const it = lista[idx];
      const notaActual = respondidas > 0 ? Math.round((aciertos / respondidas) * 100) : 100;

      wrap.innerHTML = `
        <div class="bds-modal-card" style="max-width:1060px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:18px;padding:18px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="margin:0;font-size:17px;color:#22d3ee;">🦉 Laboratorio & Evaluación REAC 2026 — CTP Mercedes Norte</h2>
              <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">100% Responsive Móvil/PC • Validaciones QA en Vivo • Subneteo FLSM/VLSM • IPv6 • Bases • Excel • Diseño de Software</p>
            </div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
              <span id="xp-b" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 10px;border-radius:99px;font-size:11px;font-weight:800;">⚡ ${xp} XP | Nota: ${notaActual}% (${aciertos}/${respondidas})</span>
              <button id="csv-b" style="background:#0284c7;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">📥 Exportar CSV</button>
              <button id="close-s" style="background:#ef4444;color:#fff;border:none;padding:7px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <!-- 4 Simuladores con Validación QA -->
          <div class="bds-sim-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:14px;">
            <div style="background:#071220;border:1px solid #1e293b;padding:11px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#34d399;margin-bottom:5px;">1. Conversor Dec ↔ Bin / Oct / Hex</div>
              <input id="s-dec" type="number" value="240" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;margin-bottom:5px;font-size:12px;"/>
              <div id="o-dec" style="font-family:monospace;font-size:11px;line-height:1.5;">Bin: <b style="color:#22d3ee;">11110000</b><br/>Oct: <b style="color:#fbbf24;">360</b> | Hex: <b style="color:#34d399;">0xF0</b></div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:11px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#22d3ee;margin-bottom:5px;">2. Subneteo IPv4 (/24 a /30)</div>
              <input id="s-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
              <div id="o-cidr" style="font-family:monospace;font-size:11px;line-height:1.5;">Prefijo: <b>/26</b> (.192)<br/>Salto: <b>64</b> | Hosts Útiles: <b style="color:#34d399;">62</b></div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:11px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#c084fc;margin-bottom:5px;">3. Compresor IPv6 (Validación RFC)</div>
              <input id="s-v6" type="text" value="2001:0db8:0000:0000:00a0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;font-size:10px;font-family:monospace;margin-bottom:5px;"/>
              <div id="o-v6" style="font-family:monospace;font-size:11px;color:#e9d5ff;word-break:break-all;"><b>2001:db8::a0:0:0:1</b></div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:11px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#fbbf24;margin-bottom:5px;">4. Validador Excel / Nota REAC</div>
              <div style="display:flex;gap:5px;margin-bottom:5px;">
                <input id="s-nota" type="number" value="85" min="0" max="100" placeholder="Nota" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:12px;"/>
                <input id="s-asis" type="number" value="92" min="0" max="100" placeholder="%Asist" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:12px;"/>
              </div>
              <div id="o-excel" style="font-family:monospace;font-size:11px;color:#34d399;"><b>APROBADO (Nivel 3 REAC)</b></div>
            </div>
          </div>

          <!-- Filtros de Especialidad -->
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            ${categorias.map(c => `
              <button data-cat="${c}" class="cat-btn" style="padding:7px 11px;border-radius:8px;border:1px solid ${filtro===c?'#22d3ee':'#334155'};background:${filtro===c?'#06b6d4':'#0f172a'};color:${filtro===c?'#020617':'#cbd5e1'};font-size:11px;font-weight:800;cursor:pointer;">
                ${c}
              </button>
            `).join('')}
          </div>

          <!-- Pregunta y Ficha Curricular -->
          <div style="background:#071220;border:1px solid #06b6d4;padding:15px;border-radius:14px;">
            <div style="background:#0b192c;border-left:4px solid #06b6d4;padding:8px 10px;border-radius:6px;margin-bottom:10px;font-size:11px;color:#cbd5e1;">
              <b>${it.esp} (${it.niv})</b> • <b>Saber:</b> ${it.saber} • <b>Indicador Cotidiano:</b> ${it.ind}
            </div>
            <div style="font-size:14px;font-weight:800;margin-bottom:12px;line-height:1.4;">[${it.id}] ${it.q}</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${it.opts.map((op, i) => `<button data-i="${i}" class="opt-b" style="min-height:44px;text-align:left;background:#112236;border:1px solid #334155;color:#fff;padding:10px 12px;border-radius:9px;font-size:13px;cursor:pointer;"><b>${String.fromCharCode(65+i)})</b> ${op}</button>`).join('')}
            </div>
            <div id="fb-b" style="margin-top:10px;font-size:12px;"></div>
            <div style="display:flex;justify-content:space-between;margin-top:12px;gap:8px;">
              <button id="p-q" style="background:#1e293b;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">⬅ Anterior</button>
              <button id="n-q" style="background:#06b6d4;color:#020617;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Siguiente (${idx+1}/${lista.length}) ➡</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('close-s').onclick = () => wrap.remove();
      document.getElementById('p-q').onclick = () => { idx = (idx - 1 + lista.length) % lista.length; pintar(); };
      document.getElementById('n-q').onclick = () => { idx = (idx + 1) % lista.length; pintar(); };

      document.querySelectorAll('.cat-btn').forEach(b => {
        b.onclick = () => { filtro = b.getAttribute('data-cat'); idx = 0; pintar(); };
      });

      document.getElementById('csv-b').onclick = () => {
        const csv = "Institucion,Plataforma,Nota_Porcentaje,Aciertos,Total_Respondidas,XP_Acumulado\nCTP Mercedes Norte,pracTICAtecnica.com," + notaActual + "%," + aciertos + "," + respondidas + "," + xp + "\n";
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "reporte_practica_reac_2026.csv";
        a.click();
      };

      document.querySelectorAll('.opt-b').forEach(b => {
        b.onclick = () => {
          const s = parseInt(b.getAttribute('data-i'), 10);
          const fb = document.getElementById('fb-b');
          respondidas++;
          localStorage.setItem('bds_qa_total', String(respondidas));
          if (s === it.ans) {
            aciertos++;
            xp += 25;
            localStorage.setItem('bds_qa_aciertos', String(aciertos));
            localStorage.setItem('bds_xp_points', String(xp));
            fb.innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:10px;border-radius:8px;color:#ecfdf5;">✅ <b>¡Correcto (+25 XP • Nivel 3 Avanzado)!</b> ${it.exp}</div>`;
          } else {
            fb.innerHTML = `<div style="background:#450a0a;border:1px solid #ef4444;padding:10px;border-radius:8px;color:#fecaca;">❌ <b>Retroalimentación QA:</b> ${it.exp}</div>`;
          }
          const nuevaNota = Math.round((aciertos / respondidas) * 100);
          document.getElementById('xp-b').innerText = `⚡ ${xp} XP | Nota: ${nuevaNota}% (${aciertos}/${respondidas})`;
        };
      });

      // Validaciones QA en Simuladores
      document.getElementById('s-dec').oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 0 || val > 65535) {
          document.getElementById('o-dec').innerHTML = `<span style="color:#f87171;">⚠️ QA: Ingrese un entero entre 0 y 65535</span>`;
          return;
        }
        document.getElementById('o-dec').innerHTML = `Bin: <b style="color:#22d3ee;">${val.toString(2).padStart(8,'0')}</b><br/>Oct: <b style="color:#fbbf24;">${val.toString(8)}</b> | Hex: <b style="color:#34d399;">0x${val.toString(16).toUpperCase()}</b>`;
      };

      document.getElementById('s-cidr').oninput = (e) => {
        const c = parseInt(e.target.value, 10);
        const h = Math.pow(2, 32 - c) - 2;
        const o = 256 - Math.pow(2, 32 - c);
        document.getElementById('o-cidr').innerHTML = `Prefijo: <b>/${c}</b> (.${o})<br/>Salto: <b>${256-o}</b> | Hosts Útiles: <b style="color:#34d399;">${h}</b>`;
      };

      document.getElementById('s-v6').oninput = (e) => {
        const raw = e.target.value.trim();
        const grupos = raw.split(':');
        if (grupos.length < 3 || grupos.length > 8 || !/^[0-9a-fA-F:]+$/.test(raw)) {
          document.getElementById('o-v6').innerHTML = `<span style="color:#f87171;">⚠️ QA: Hextetos hexadecimales inválidos</span>`;
          return;
        }
        const comp = grupos.map(x => x.replace(/^0+/, '') || '0').join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
        document.getElementById('o-v6').innerHTML = `<b>${comp}</b>`;
      };

      const validarExcel = () => {
        const n = parseFloat(document.getElementById('s-nota').value);
        const a = parseFloat(document.getElementById('s-asis').value);
        const out = document.getElementById('o-excel');
        if (isNaN(n) || isNaN(a) || n < 0 || n > 100 || a < 0 || a > 100) {
          out.innerHTML = `<span style="color:#f87171;">⚠️ QA: Rango válido 0 a 100%</span>`;
          return;
        }
        if (n >= 70 && a >= 80) out.innerHTML = `<b style="color:#34d399;">APROBADO (Nivel 3 REAC)</b>`;
        else if (n >= 60 && a >= 80) out.innerHTML = `<b style="color:#fbbf24;">AMPLIACIÓN (Nivel 2 REAC)</b>`;
        else out.innerHTML = `<b style="color:#f87171;">REPROBADO / PENDIENTE</b>`;
      };
      document.getElementById('s-nota').oninput = validarExcel;
      document.getElementById('s-asis').oninput = validarExcel;
    }

    document.body.appendChild(wrap);
    pintar();
  };
})();