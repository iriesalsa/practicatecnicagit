(function () {
  const BANCO_PRO_MAX = [
    { id: "NET-01", esp: "Redes (Subneteo VLSM/FLSM)", niv: "11°", saber: "Subneteo Variable VLSM IPv4", ind: "Segmenta bloques IPv4 según demanda de hosts sin solapar rangos.", q: "Dada la red 172.16.10.0/24: ¿Qué prefijos y máscaras corresponden a Laboratorios (100 hosts), Wi-Fi (50 hosts) y Administración (25 hosts)?", opts: ["Labs: /25 (.128) | Wi-Fi: /26 (.192) | Admin: /27 (.224)", "Labs: /26 (.192) | Wi-Fi: /27 (.224) | Admin: /28 (.240)", "Labs: /24 (.0) | Wi-Fi: /25 (.128) | Admin: /26 (.192)"], ans: 0, exp: "100h -> 7 bits (/25 = 126 útiles); 50h -> 6 bits (/26 = 62 útiles); 25h -> 5 bits (/27 = 30 útiles)." },
    { id: "NET-02", esp: "Redes (Subneteo VLSM/FLSM)", niv: "11°", saber: "Subneteo Fijo FLSM y Enlaces WAN", ind: "Calcula saltos de bloque fijos y optimiza enlaces punto a punto.", q: "Al dividir 192.168.50.0/24 en 4 subredes iguales (FLSM), ¿cuáles son las 4 direcciones de subred y qué prefijo se usa en un enlace WAN de 2 routers?", opts: ["Subredes: .0, .64, .128 y .192 (/26) | Enlace WAN: /30 (255.255.255.252)", "Subredes: .0 y .128 (/25) | Enlace WAN: /28", "Subredes: .0, .32, .64, .96 (/27) | Enlace WAN: /29"], ans: 0, exp: "Con /26 (.192) el salto es 256-192 = 64. Para WAN de 2 routers se usa /30 (2²-2 = 2 hosts útiles)." },
    { id: "BAS-01", esp: "Sistemas Numéricos", niv: "10°", saber: "Conversión Binario, Octal, Decimal y Hexadecimal", ind: "Realiza conversiones exactas entre bases 2, 8, 10 y 16.", q: "¿Cuál es la equivalencia exacta del octeto decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Binario: 11110000 | Octal: 360 | Hexadecimal: F0", "Binario: 11100000 | Octal: 340 | Hexadecimal: E0", "Binario: 11000000 | Octal: 300 | Hexadecimal: C0"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000₂ | En tríos (011 110 000) = 360₈ | En nibbles (1111 0000) = F0₁₆." },
    { id: "BAS-02", esp: "Sistemas Numéricos", niv: "10°", saber: "Conversión de Máscaras y Direcciones Hexadecimales", ind: "Traduce octetos de red entre hexadecimal, binario y decimal.", q: "El octeto decimal 252 (máscara /30) se representa en Binario, Octal y Hexadecimal como:", opts: ["Binario: 11111100 | Octal: 374 | Hexadecimal: FC", "Binario: 11111000 | Octal: 370 | Hexadecimal: F8", "Binario: 11111110 | Octal: 376 | Hexadecimal: FE"], ans: 0, exp: "252 = 255 - 3 -> 11111100₂ | Octal: 011(3) 111(7) 100(4) = 374₈ | Hex: 1111(F) 1100(C) = FC₁₆." },
    { id: "IPV6-01", esp: "IPv6 y Protocolos", niv: "12°", saber: "Compresión RFC 5952, ICMPv6 NDP y SLAAC", ind: "Comprime direcciones IPv6 e identifica protocolos de resolución y autoconfiguración.", q: "¿Cuál es la compresión RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo reemplaza a ARP en IPv6?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (Neighbor Solicitation 135 / Advertisement 136)", "2001:db8::a0::1 | Protocolo ARP v6", "2001:0db8::a0:1 | Broadcast ff02::1"], ans: 0, exp: "Los ceros iniciales se eliminan y '::' solo se usa una vez. NDP reemplaza por completo a ARP." },
    { id: "IPV6-02", esp: "IPv6 y Protocolos", niv: "12°", saber: "Prefijos IPv6 (Link-Local, GUA, ULA y Multicast)", ind: "Distingue el alcance de prefijos IPv6 en topologías empresariales.", q: "En IPv6, ¿cuál prefijo identifica una dirección Link-Local (obligatoria en cada interfaz para NDP/SLAAC) y cuál identifica Multicast?", opts: ["Link-Local: fe80::/10 | Multicast: ff00::/8", "Link-Local: 2000::/3 | Multicast: fc00::/7", "Link-Local: ::1/128 | Multicast: fe80::/10"], ans: 0, exp: "fe80::/10 opera en el enlace local sin cruzar el router; ff00::/8 reemplaza al Broadcast en IPv6." },
    { id: "SW-01", esp: "Diseño de Software y Calidad", niv: "12°", saber: "Administración de la Calidad (ISO 25010) y Riesgos de Planeación", ind: "Analiza el impacto de omitir la anticipación de riesgos en la arquitectura de software.", q: "¿Cuál es el principal riesgo técnico y económico de iniciar la codificación sin planeación de arquitectura ni matriz de riesgos?", opts: ["Deuda técnica exponencial: corregir un defecto arquitectónico o de seguridad en producción cuesta hasta 10x más que en la fase de diseño", "El sistema se vuelve inmune al Scope Creep", "Disminuye la complejidad ciclomática del código"], ans: 0, exp: "La prevención temprana en el diseño evita retrabajo crítico, caídas en producción y vulnerabilidades de datos." },
    { id: "SW-02", esp: "Diseño de Software y Calidad", niv: "12°", saber: "Riesgos de Sobre-planeación vs Agilidad Controlada", ind: "Mitiga la parálisis por análisis y el Scope Creep mediante entregas verificables.", q: "¿Cómo se equilibra el riesgo entre la 'Parálisis por Análisis' (sobre-planeación rígida) y la improvisación en el diseño de software?", opts: ["Con planeación iterativa, arquitectura modular, matriz de riesgos viva y criterios de aceptación (Definition of Done)", "Omitiendo toda documentación y pruebas de seguridad", "Congelando el contacto con los usuarios hasta el cierre anual"], ans: 0, exp: "La ingeniería moderna combina arquitectura base sólida con ciclos iterativos validados." },
    { id: "OFF-01", esp: "Excel y Word Técnico", niv: "10°-12°", saber: "Funciones Lógicas SI/Y/O, BUSCARX y Documentación SRS", ind: "Construye fórmulas condicionales anidadas y documentos técnicos con secciones.", q: "¿Cuál fórmula de Excel evalúa en F2 si Nota (D2)>=70 Y Asistencia (E2)>=80% para mostrar 'APROBADO', y si Nota>=60 con Asistencia>=80% 'AMPLIACIÓN', si no 'REPROBADO'?", opts: ["=SI(Y(D2>=70;E2>=80%);\"APROBADO\";SI(Y(D2>=60;E2>=80%);\"AMPLIACIÓN\";\"REPROBADO\"))", "=SI(O(D2>=70;E2>=80%);\"APROBADO\";\"REPROBADO\")", "=BUSCARX(D2>=70;E2>=80%;\"APROBADO\")"], ans: 0, exp: "El SI anidado combinado con Y() evalúa ambos requisitos reglamentarios en cada nivel." },
    { id: "ESP-01", esp: "Contabilidad, Electrónica y Logística", niv: "11°-12°", saber: "Prueba Ácida, Ley de Ohm y Punto de Reorden (ROP)", ind: "Resuelve casos cuantitativos de gestión empresarial e industrial.", q: "En Electrónica: 3 resistencias de 30 Ω en paralelo a 20V DC. En Logística: Demanda 50 uds/día, entrega 6 días, seguridad 100 uds. ¿Req/Corriente y ROP?", opts: ["Electrónica: Req = 10 Ω, I = 2 A | Logística: ROP = 400 unidades", "Electrónica: Req = 90 Ω, I = 0.22 A | Logística: ROP = 300 unidades", "Electrónica: Req = 15 Ω, I = 1 A | Logística: ROP = 200 unidades"], ans: 0, exp: "Paralelo: 30/3 = 10 Ω -> I = 20V/10Ω = 2A. Logística: ROP = (50*6) + 100 = 400 uds." }
  ];

  window.abrirMegaSuiteEducativa = function () {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let xp = parseInt(localStorage.getItem('bds_xp_points') || '500', 10);
    let aciertos = parseInt(localStorage.getItem('bds_qa_aciertos') || '0', 10);
    let respondidas = parseInt(localStorage.getItem('bds_qa_total') || '0', 10);
    let filtro = 'TODAS';
    let idx = 0;

    const categorias = ['TODAS', ...new Set(BANCO_PRO_MAX.map(x => x.esp))];

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.97);z-index:100001;overflow-y:auto;padding:12px;font-family:system-ui,-apple-system,sans-serif;color:#fff;box-sizing:border-box;';

    function getItems() {
      return filtro === 'TODAS' ? BANCO_PRO_MAX : BANCO_PRO_MAX.filter(x => x.esp === filtro);
    }

    function pintar() {
      const lista = getItems();
      if (idx >= lista.length) idx = 0;
      const it = lista[idx];
      const notaActual = respondidas > 0 ? Math.round((aciertos / respondidas) * 100) : 100;

      wrap.innerHTML = `
        <div style="max-width:1080px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:18px;padding:18px;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="margin:0;font-size:18px;color:#22d3ee;">🦉 Suite BDS Pro Max — CTP Mercedes Norte (REAC 2026)</h2>
              <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Simuladores en Tiempo Real + Pruebas de Redes (VLSM/FLSM/IPv6), Bases, Diseño de Software y Excel/Word</p>
            </div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
              <span id="xp-b" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 10px;border-radius:99px;font-size:11px;font-weight:800;">⚡ ${xp} XP | Nota: ${notaActual}% (${aciertos}/${respondidas})</span>
              <button id="reset-b" style="background:#334155;color:#fff;border:none;padding:7px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">🔄 Reiniciar Nota</button>
              <button id="csv-b" style="background:#0284c7;color:#fff;border:none;padding:7px 11px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">📥 CSV MEP</button>
              <button id="close-s" style="background:#ef4444;color:#fff;border:none;padding:7px 13px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:10px;margin-bottom:14px;">
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
              <div style="font-weight:800;font-size:12px;color:#c084fc;margin-bottom:5px;">3. Compresor IPv6 (RFC 5952)</div>
              <input id="s-v6" type="text" value="2001:0db8:0000:0000:00a0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:7px;border-radius:7px;font-size:10px;font-family:monospace;margin-bottom:5px;"/>
              <div id="o-v6" style="font-family:monospace;font-size:11px;color:#e9d5ff;word-break:break-all;"><b>2001:db8::a0:0:0:1</b></div>
            </div>

            <div style="background:#071220;border:1px solid #1e293b;padding:11px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#fbbf24;margin-bottom:5px;">4. Evaluador Excel / Nota REAC</div>
              <div style="display:flex;gap:5px;margin-bottom:5px;">
                <input id="s-nota" type="number" value="85" min="0" max="100" placeholder="Nota" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:12px;"/>
                <input id="s-asis" type="number" value="92" min="0" max="100" placeholder="%Asist" style="width:50%;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:7px;font-size:12px;"/>
              </div>
              <div id="o-excel" style="font-family:monospace;font-size:11px;color:#34d399;"><b>APROBADO (Nivel 3 REAC)</b></div>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            ${categorias.map(c => `
              <button data-cat="${c}" class="cat-btn" style="padding:7px 11px;border-radius:8px;border:1px solid ${filtro===c?'#22d3ee':'#334155'};background:${filtro===c?'#06b6d4':'#0f172a'};color:${filtro===c?'#020617':'#cbd5e1'};font-size:11px;font-weight:800;cursor:pointer;">
                ${c}
              </button>
            `).join('')}
          </div>

          <div style="background:#071220;border:1px solid #06b6d4;padding:16px;border-radius:14px;">
            <div style="background:#0b192c;border-left:4px solid #06b6d4;padding:8px 10px;border-radius:6px;margin-bottom:10px;font-size:11px;color:#cbd5e1;">
              <b>${it.esp} (${it.niv})</b> • <b>Saber Esencial:</b> ${it.saber} • <b>Indicador Cotidiano REAC:</b> ${it.ind}
            </div>
            <div style="font-size:15px;font-weight:800;margin-bottom:12px;line-height:1.4;">[${it.id}] ${it.q}</div>
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

      document.getElementById('reset-b').onclick = () => {
        aciertos = 0; respondidas = 0;
        localStorage.setItem('bds_qa_aciertos', '0');
        localStorage.setItem('bds_qa_total', '0');
        pintar();
      };

      document.querySelectorAll('.cat-btn').forEach(b => {
        b.onclick = () => { filtro = b.getAttribute('data-cat'); idx = 0; pintar(); };
      });

      document.getElementById('csv-b').onclick = () => {
        const csv = "Institucion,Plataforma,Especialidad,Nota_Porcentaje,Aciertos,Total_Respondidas,XP_Acumulado\nCTP Mercedes Norte,pracTICAtecnica.com," + filtro + "," + notaActual + "%," + aciertos + "," + respondidas + "," + xp + "\n";
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "calificaciones_reac_2026.csv";
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
            fb.innerHTML = `<div style="background:#450a0a;border:1px solid #ef4444;padding:10px;border-radius:8px;color:#fecaca;">❌ <b>Fundamentación Técnica:</b> ${it.exp}</div>`;
          }
          const nuevaNota = Math.round((aciertos / respondidas) * 100);
          document.getElementById('xp-b').innerText = `⚡ ${xp} XP | Nota: ${nuevaNota}% (${aciertos}/${respondidas})`;
        };
      });

      document.getElementById('s-dec').oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 0 || val > 65535) {
          document.getElementById('o-dec').innerHTML = `<span style="color:#f87171;">⚠️ Rango válido: 0 a 65535</span>`;
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
          document.getElementById('o-v6').innerHTML = `<span style="color:#f87171;">⚠️ Formato hexadecimal IPv6 inválido</span>`;
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
          out.innerHTML = `<span style="color:#f87171;">⚠️ Rango válido: 0 a 100%</span>`;
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