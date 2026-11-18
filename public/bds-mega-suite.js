(function () {
  const BANCO = [
    { esp: "Redes (VLSM/FLSM)", niv: "11°", saber: "Subneteo IPv4 Variable y Fijo", ind: "Segmenta redes optimizando hosts sin solapamiento (REAC 1-3).", q: "Red 172.16.10.0/24: ¿Prefijo y máscara para 100 hosts en Laboratorios y 50 hosts en Wi-Fi?", opts: ["Labs: /25 (.128) y Wi-Fi: /26 (.192)", "Labs: /26 y Wi-Fi: /27", "Labs: /24 y Wi-Fi: /25"], ans: 0, exp: "100 hosts requieren 7 bits (/25 = 126 útiles); 50 hosts requieren 6 bits (/26 = 62 útiles)." },
    { esp: "Sistemas Numéricos", niv: "10°", saber: "Conversión Binario, Octal, Decimal y Hex", ind: "Transforma octetos y hextetos entre bases posicionales.", q: "¿A qué equivale el decimal 240 (máscara /28) en Binario, Octal y Hexadecimal?", opts: ["Bin: 11110000 | Oct: 360 | Hex: F0", "Bin: 11100000 | Oct: 340 | Hex: E0", "Bin: 11000000 | Oct: 300 | Hex: C0"], ans: 0, exp: "128+64+32+16 = 240 -> 11110000 en base 2, 360 en base 8 y F0 en base 16." },
    { esp: "IPv6 y Protocolos", niv: "12°", saber: "Compresión RFC 5952, ICMPv6 NDP y SLAAC", ind: "Aplica reglas de abreviación IPv6 e identifica protocolos de capa 3.", q: "¿Cuál es la compresión válida de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué reemplaza a ARP?", opts: ["2001:db8::a0:0:0:1 y el protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 y DHCPv4", "2001:0db8::a0:1 y Broadcast"], ans: 0, exp: "Los dobles dos puntos (::) solo se aplican una vez; NDP reemplaza a ARP en IPv6." },
    { esp: "Diseño de Software y Calidad", niv: "12°", saber: "Administración de la Calidad (ISO 25010) y Riesgos de Planeación", ind: "Evalúa riesgos técnicos anticipando fallos antes de codificar.", q: "¿Qué riesgo ocurre al omitir la planeación y anticipación de arquitectura en un desarrollo?", opts: ["Deuda técnica severa: corregir en producción cuesta hasta 10x más que en el diseño", "Menor consumo de CPU", "Eliminación automática de Scope Creep"], ans: 0, exp: "Anticipar riesgos y definir criterios de aceptación evita retrabajo crítico y brechas de seguridad." },
    { esp: "Excel y Word Técnico", niv: "10°-12°", saber: "Funciones Lógicas Anidadas y Documentación SRS", ind: "Automatiza hojas de cálculo e informes con estilos y secciones.", q: "¿Cuál fórmula de Excel evalúa si Nota (D2)>=70 Y Asistencia (E2)>=80% para mostrar 'APROBADO'?", opts: ["=SI(Y(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=SI(O(D2>=70; E2>=80%); \"APROBADO\"; \"PENDIENTE\")", "=BUSCARV(D2; E2; \"APROBADO\")"], ans: 0, exp: "La función Y() exige que ambas condiciones se cumplan simultáneamente." },
    { esp: "Contabilidad y Finanzas", niv: "11°", saber: "NIIF, IVA Ley 9635, Depreciación y Liquidez", ind: "Calcula razones financieras y asientos contables.", q: "Activo Corriente ₡15M, Inventario ₡5M y Pasivo Corriente ₡5M. ¿Cuál es la Prueba Ácida?", opts: ["2.0", "3.0", "1.0"], ans: 0, exp: "(15M - 5M) / 5M = 2.0 colones líquidos por cada colón de deuda a corto plazo." },
    { esp: "Electrónica Industrial", niv: "11°", saber: "Leyes de Ohm, Watt, Kirchhoff y Lógica Digital", ind: "Resuelve circuitos serie-paralelo y compuertas lógicas.", q: "Tres resistencias de 30 Ω en paralelo conectadas a 20V DC: ¿Req y corriente total?", opts: ["Req = 10 Ω y Corriente = 2 A", "Req = 90 Ω y Corriente = 0.22 A", "Req = 15 Ω y Corriente = 1.33 A"], ans: 0, exp: "Req = 30/3 = 10 Ω; Corriente I = 20V / 10 Ω = 2 A." },
    { esp: "Ejecutivo y Logística", niv: "12°", saber: "Ley 7202 de Archivos, Punto de Reorden (ROP) e Incoterms 2020", ind: "Aplica gestión documental y control de cadena de abastecimiento.", q: "Demanda diaria: 50 uds, Tiempo de entrega: 6 días, Stock seguridad: 100 uds. ¿Punto de Reorden?", opts: ["400 unidades", "300 unidades", "200 unidades"], ans: 0, exp: "ROP = (50 * 6) + 100 = 400 unidades." }
  ];

  window.abrirMegaSuiteEducativa = function () {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();
    let xp = parseInt(localStorage.getItem('bds_xp_points') || '500', 10);
    let idx = 0;

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(3,9,20,0.96);z-index:100001;overflow-y:auto;padding:16px;font-family:system-ui,sans-serif;color:#fff;';

    function pintar() {
      const it = BANCO[idx];
      wrap.innerHTML = `
        <div style="max-width:1020px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:18px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="margin:0;font-size:18px;color:#22d3ee;">🦉 Laboratorio Técnico en Vivo — CTP Mercedes Norte (REAC 2026)</h2>
              <p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">Conversor Bin/Oct/Dec/Hex • Subneteo FLSM/VLSM • IPv6 • Excel • Diseño de Software y Especialidades</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span id="xp-b" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:5px 10px;border-radius:99px;font-size:12px;font-weight:800;">⚡ ${xp} XP</span>
              <button id="close-s" style="background:#ef4444;color:#fff;border:none;padding:7px 14px;border-radius:8px;font-weight:800;cursor:pointer;">Cerrar ✕</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:16px;">
            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#34d399;margin-bottom:6px;">1. Conversor Dec ↔ Bin / Oct / Hex</div>
              <input id="s-dec" type="number" value="240" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;margin-bottom:6px;"/>
              <div id="o-dec" style="font-family:monospace;font-size:11px;">Bin: <b style="color:#22d3ee;">11110000</b> | Oct: <b style="color:#fbbf24;">360</b> | Hex: <b style="color:#34d399;">F0</b></div>
            </div>
            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#22d3ee;margin-bottom:6px;">2. Subneteo IPv4 (/24 a /30)</div>
              <input id="s-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
              <div id="o-cidr" style="font-family:monospace;font-size:11px;">Prefijo: <b>/26</b> (.192) | Salto: <b>64</b> | Hosts: <b style="color:#34d399;">62</b></div>
            </div>
            <div style="background:#071220;border:1px solid #1e293b;padding:12px;border-radius:12px;">
              <div style="font-weight:800;font-size:12px;color:#c084fc;margin-bottom:6px;">3. Compresor IPv6 (RFC 5952)</div>
              <input id="s-v6" type="text" value="2001:0db8:0000:0000:00a0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:6px;border-radius:6px;font-size:10px;font-family:monospace;margin-bottom:6px;"/>
              <div id="o-v6" style="font-family:monospace;font-size:11px;color:#e9d5ff;"><b>2001:db8::a0:0:0:1</b></div>
            </div>
          </div>

          <div style="background:#071220;border:1px solid #06b6d4;padding:16px;border-radius:14px;">
            <div style="font-size:11px;color:#67e8f9;margin-bottom:6px;"><b>${it.esp} (${it.niv})</b> • Saber: ${it.saber} • Indicador Cotidiano: ${it.ind}</div>
            <div style="font-size:15px;font-weight:800;margin-bottom:12px;">${it.q}</div>
            <div style="display:flex;flex-direction:column;gap:7px;">
              ${it.opts.map((op, i) => `<button data-i="${i}" class="opt-b" style="text-align:left;background:#112236;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:13px;cursor:pointer;"><b>${String.fromCharCode(65+i)})</b> ${op}</button>`).join('')}
            </div>
            <div id="fb-b" style="margin-top:10px;font-size:12px;"></div>
            <div style="display:flex;justify-content:space-between;margin-top:12px;">
              <button id="p-q" style="background:#1e293b;color:#fff;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;">⬅ Anterior</button>
              <button id="n-q" style="background:#06b6d4;color:#020617;border:none;padding:7px 14px;border-radius:8px;font-weight:800;cursor:pointer;">Siguiente Reto (${idx+1}/${BANCO.length}) ➡</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById('close-s').onclick = () => wrap.remove();
      document.getElementById('p-q').onclick = () => { idx = (idx - 1 + BANCO.length) % BANCO.length; pintar(); };
      document.getElementById('n-q').onclick = () => { idx = (idx + 1) % BANCO.length; pintar(); };
      document.querySelectorAll('.opt-b').forEach(b => {
        b.onclick = () => {
          const s = parseInt(b.getAttribute('data-i'), 10);
          const fb = document.getElementById('fb-b');
          if (s === it.ans) {
            xp += 25; localStorage.setItem('bds_xp_points', String(xp));
            document.getElementById('xp-b').innerText = '⚡ ' + xp + ' XP';
            fb.innerHTML = `<div style="background:#064e3b;padding:9px;border-radius:8px;color:#ecfdf5;">✅ <b>¡Correcto (+25 XP)!</b> ${it.exp}</div>`;
          } else {
            fb.innerHTML = `<div style="background:#450a0a;padding:9px;border-radius:8px;color:#fecaca;">❌ <b>Explicación:</b> ${it.exp}</div>`;
          }
        };
      });
      document.getElementById('s-dec').oninput = (e) => {
        const n = Math.max(0, Math.min(65535, parseInt(e.target.value || '0', 10)));
        document.getElementById('o-dec').innerHTML = `Bin: <b style="color:#22d3ee;">${n.toString(2).padStart(8,'0')}</b> | Oct: <b style="color:#fbbf24;">${n.toString(8)}</b> | Hex: <b style="color:#34d399;">${n.toString(16).toUpperCase()}</b>`;
      };
      document.getElementById('s-cidr').oninput = (e) => {
        const c = parseInt(e.target.value, 10);
        const h = Math.pow(2, 32 - c) - 2;
        const o = 256 - Math.pow(2, 32 - c);
        document.getElementById('o-cidr').innerHTML = `Prefijo: <b>/${c}</b> (.${o}) | Salto: <b>${256-o}</b> | Hosts: <b style="color:#34d399;">${h}</b>`;
      };
      document.getElementById('s-v6').oninput = (e) => {
        const comp = e.target.value.trim().split(':').map(x => x.replace(/^0+/, '') || '0').join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
        document.getElementById('o-v6').innerHTML = `<b>${comp}</b>`;
      };
    }
    document.body.appendChild(wrap);
    pintar();
  };
})();