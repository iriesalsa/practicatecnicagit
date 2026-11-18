(function () {
  const RETOS_GAMIFICADOS = [
    { esp: "Redes (VLSM)", q: "Red 172.16.10.0/24: ¿Qué prefijo y máscara se requiere para una subred de 100 hosts en Laboratorios?", opts: ["/25 (255.255.255.128) - 126 hosts", "/26 (255.255.255.192) - 62 hosts", "/27 (255.255.255.224) - 30 hosts"], ans: 0, exp: "Con 7 bits de host (2^7 - 2 = 126) se cubren los 100 hosts usando /25." },
    { esp: "Redes (FLSM)", q: "Si divides 192.168.50.0/24 en 4 subredes fijas iguales, ¿cuál es el salto de bloque y prefijo?", opts: ["Prefijo /26 con salto de 64 (.0, .64, .128, .192)", "Prefijo /25 con salto de 128", "Prefijo /27 con salto de 32"], ans: 0, exp: "2 bits prestados (2^2 = 4 subredes) convierten /24 en /26 (.192), salto 256-192 = 64." },
    { esp: "IPv6 y Protocolos", q: "¿Cuál es la forma comprimida RFC 5952 de 2001:0db8:0000:0000:00a0:0000:0000:0001 y qué protocolo reemplaza a ARP?", opts: ["2001:db8::a0:0:0:1 | Protocolo ICMPv6 NDP (NS/NA)", "2001:db8::a0::1 | Protocolo DHCPv4", "2001:0db8::a0::1 | Protocolo NAT"], ans: 0, exp: "El doble dos puntos (::) solo se usa una vez; NDP con Neighbor Solicitation/Advertisement reemplaza a ARP." },
    { esp: "Sistemas Numéricos", q: "¿A qué equivale el octeto decimal 224 en Binario, Octal y Hexadecimal?", opts: ["Bin: 11100000 | Oct: 340 | Hex: E0", "Bin: 11000000 | Oct: 300 | Hex: C0", "Bin: 11110000 | Oct: 360 | Hex: F0"], ans: 0, exp: "128+64+32 = 224 -> 11100000 en binario, 340 en octal y E0 en hexadecimal." },
    { esp: "Diseño de Software y Riesgos", q: "¿Qué ocurre cuando un equipo omite la matriz de riesgos y salta la planeación de arquitectura?", opts: ["Deuda técnica severa: corregir en producción cuesta hasta 10x más que en el diseño", "El software compila más rápido sin errores", "Se elimina el riesgo de Scope Creep"], ans: 0, exp: "Anticipar riesgos en el diseño previene fallos estructurales y brechas de seguridad costosas." },
    { esp: "Excel y Word Técnico", q: "¿Cuál fórmula evalúa si la nota en E2 es >=70 para 'APROBADO', >=60 para 'AMPLIACIÓN' y si no 'REPROBADO'?", opts: ["=SI(E2>=70; \"APROBADO\"; SI(E2>=60; \"AMPLIACIÓN\"; \"REPROBADO\"))", "=BUSCARV(E2; 70; \"APROBADO\")", "=SUMAR.SI(E2>=70; \"APROBADO\")"], ans: 0, exp: "El SI anidado evalúa en orden jerárquico cada umbral de calificación." },
    { esp: "Contabilidad y Finanzas", q: "Activos Corrientes: ₡15M, Inventarios: ₡5M, Pasivos Corrientes: ₡5M. ¿Cuál es la Prueba Ácida?", opts: ["2.0 (₡2 líquidos por cada ₡1 de deuda a corto plazo)", "3.0", "1.0"], ans: 0, exp: "(15,000,000 - 5,000,000) / 5,000,000 = 2.0." },
    { esp: "Electrónica Industrial", q: "Tres resistencias de 30 Ω en paralelo conectadas a 20V DC: ¿Resistencia equivalente y corriente total?", opts: ["Req = 10 Ω | Corriente = 2 A", "Req = 90 Ω | Corriente = 0.22 A", "Req = 30 Ω | Corriente = 1 A"], ans: 0, exp: "Req = 30/3 = 10 Ω. Por Ley de Ohm: I = 20V / 10 Ω = 2 A." },
    { esp: "Secretariado Ejecutivo", q: "Según la Ley 7202 de Costa Rica, ¿quién autoriza la eliminación de documentos públicos?", opts: ["La Comisión Nacional de Selección y Eliminación de Documentos (CNSED)", "Cualquier funcionario sin acta", "El archivo de gestión"], ans: 0, exp: "La CNSED regula las tablas de plazos y conservación documental." },
    { esp: "Administración y Logística", q: "Demanda diaria: 50 uds, Tiempo de entrega: 6 días, Stock de seguridad: 100 uds. ¿Punto de Reorden (ROP)?", opts: ["400 unidades", "300 unidades", "156 unidades"], ans: 0, exp: "ROP = (50 * 6) + 100 = 400 unidades." }
  ];

  window.abrirMegaSuiteEducativa = function () {
    let old = document.getElementById('bds-mega-modal');
    if (old) old.remove();

    let xp = parseInt(localStorage.getItem('bds_xp_points') || '450', 10);
    let idx = 0;

    const wrap = document.createElement('div');
    wrap.id = 'bds-mega-modal';
    wrap.style.cssText = 'position:fixed;inset:0;background:rgba(4,10,22,0.95);z-index:100001;overflow-y:auto;padding:20px;font-family:system-ui,sans-serif;color:#fff;';

    function pintar() {
      const item = RETOS_GAMIFICADOS[idx];
      wrap.innerHTML = `
        <div style="max-width:960px;margin:0 auto;background:#0b192c;border:1px solid #06b6d4;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.85);">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:14px;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
            <div>
              <h2 style="margin:0;font-size:20px;color:#22d3ee;">🦉 Mega Suite Interactiva — CTP Mercedes Norte</h2>
              <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Simulador de Redes (FLSM/VLSM/IPv6/Bases) + Retos Gamificados Multi-Especialidad</p>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
              <span id="bds-xp-badge" style="background:#064e3b;border:1px solid #10b981;color:#6ee7b7;padding:6px 12px;border-radius:99px;font-size:12px;font-weight:800;">⚡ ${xp} XP</span>
              <button id="bds-close-suite" style="background:#ef4444;color:#fff;border:none;padding:7px 14px;border-radius:10px;font-weight:800;cursor:pointer;">Cerrar</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:20px;">
            <!-- Conversor Binario/Octal/Decimal/Hex -->
            <div style="background:#071220;border:1px solid #1e293b;padding:14px;border-radius:14px;">
              <div style="font-weight:800;font-size:13px;color:#34d399;margin-bottom:8px;">1. Conversor Decimal ↔ Binario / Octal / Hex</div>
              <input id="sim-dec" type="number" value="192" min="0" max="65535" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;margin-bottom:8px;"/>
              <div id="sim-bases-out" style="font-family:monospace;font-size:12px;line-height:1.7;color:#e2e8f0;">
                Binario: <b style="color:#22d3ee;">11000000</b><br/>
                Octal: <b style="color:#fbbf24;">300</b> | Hex: <b style="color:#34d399;">0xC0</b>
              </div>
            </div>

            <!-- Calculadora Subneteo FLSM / VLSM -->
            <div style="background:#071220;border:1px solid #1e293b;padding:14px;border-radius:14px;">
              <div style="font-weight:800;font-size:13px;color:#22d3ee;margin-bottom:8px;">2. Calculadora Subneteo IPv4 (/24 a /30)</div>
              <input id="sim-cidr" type="range" min="24" max="30" value="26" style="width:100%;"/>
              <div id="sim-cidr-out" style="font-family:monospace;font-size:12px;line-height:1.7;color:#e2e8f0;">
                Prefijo: <b>/26</b> (255.255.255.192)<br/>
                Salto: <b>64</b> | Hosts Útiles: <b style="color:#34d399;">62 hosts</b>
              </div>
            </div>

            <!-- Compresor IPv6 -->
            <div style="background:#071220;border:1px solid #1e293b;padding:14px;border-radius:14px;">
              <div style="font-weight:800;font-size:13px;color:#c084fc;margin-bottom:8px;">3. Compresor IPv6 (RFC 5952)</div>
              <input id="sim-ipv6" type="text" value="2001:0db8:0000:0000:00a0:0000:0000:0001" style="width:100%;box-sizing:border-box;background:#0f172a;border:1px solid #334155;color:#fff;padding:8px;border-radius:8px;font-size:11px;font-family:monospace;margin-bottom:8px;"/>
              <div id="sim-ipv6-out" style="font-family:monospace;font-size:12px;color:#e9d5ff;word-break:break-all;">
                Comprimida: <b>2001:db8::a0:0:0:1</b>
              </div>
            </div>
          </div>

          <!-- Reto Interactivo Gamificado -->
          <div style="background:#071220;border:1px solid #06b6d4;padding:18px;border-radius:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span style="background:#083344;color:#22d3ee;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:800;">Especialidad: ${item.esp}</span>
              <span style="font-size:12px;color:#94a3b8;">Reto ${idx + 1} de ${RETOS_GAMIFICADOS.length}</span>
            </div>
            <div style="font-size:15px;font-weight:700;margin-bottom:14px;color:#f8fafc;">${item.q}</div>
            <div id="bds-opts-box" style="display:flex;flex-direction:column;gap:8px;">
              ${item.opts.map((op, i) => `
                <button data-i="${i}" class="bds-opt-btn" style="text-align:left;background:#112236;border:1px solid #334155;color:#fff;padding:11px 14px;border-radius:10px;font-size:13px;cursor:pointer;">
                  ${String.fromCharCode(65 + i)}) ${op}
                </button>
              `).join('')}
            </div>
            <div id="bds-feedback-box" style="margin-top:12px;font-size:12px;"></div>
            <div style="display:flex;justify-content:space-between;margin-top:14px;">
              <button id="bds-prev-q" style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-size:12px;cursor:pointer;">⬅ Anterior</button>
              <button id="bds-next-q" style="background:#06b6d4;color:#020617;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">Siguiente Reto ➡</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('bds-close-suite').onclick = () => wrap.remove();
      document.getElementById('bds-prev-q').onclick = () => { idx = (idx - 1 + RETOS_GAMIFICADOS.length) % RETOS_GAMIFICADOS.length; pintar(); };
      document.getElementById('bds-next-q').onclick = () => { idx = (idx + 1) % RETOS_GAMIFICADOS.length; pintar(); };

      document.querySelectorAll('.bds-opt-btn').forEach((btn) => {
        btn.onclick = () => {
          const sel = parseInt(btn.getAttribute('data-i'), 10);
          const fb = document.getElementById('bds-feedback-box');
          if (sel === item.ans) {
            xp += 25;
            localStorage.setItem('bds_xp_points', String(xp));
            document.getElementById('bds-xp-badge').innerText = '⚡ ' + xp + ' XP';
            fb.innerHTML = `<div style="background:#064e3b;border:1px solid #10b981;padding:10px;border-radius:10px;color:#ecfdf5;">✅ <b>¡Correcto (+25 XP)!</b> ${item.exp}</div>`;
          } else {
            fb.innerHTML = `<div style="background:#450a0a;border:1px solid #ef4444;padding:10px;border-radius:10px;color:#fecaca;">❌ <b>Revisa la fundamentación:</b> ${item.exp}</div>`;
          }
        };
      });

      const inpDec = document.getElementById('sim-dec');
      inpDec.oninput = () => {
        const n = Math.max(0, Math.min(65535, parseInt(inpDec.value || '0', 10)));
        document.getElementById('sim-bases-out').innerHTML = `Binario: <b style="color:#22d3ee;">${n.toString(2).padStart(8, '0')}</b><br/>Octal: <b style="color:#fbbf24;">${n.toString(8)}</b> | Hex: <b style="color:#34d399;">0x${n.toString(16).toUpperCase()}</b>`;
      };

      const inpCidr = document.getElementById('sim-cidr');
      inpCidr.oninput = () => {
        const c = parseInt(inpCidr.value, 10);
        const hosts = Math.pow(2, 32 - c) - 2;
        const oct = 256 - Math.pow(2, 32 - c);
        const salto = 256 - oct;
        document.getElementById('sim-cidr-out').innerHTML = `Prefijo: <b>/${c}</b> (255.255.255.${oct})<br/>Salto: <b>${salto}</b> | Hosts Útiles: <b style="color:#34d399;">${hosts} hosts</b>`;
      };

      const inpV6 = document.getElementById('sim-ipv6');
      inpV6.oninput = () => {
        const parts = inpV6.value.trim().split(':').map(x => x.replace(/^0+/, '') || '0');
        const comp = parts.join(':').replace(/(?:^|:)0(?::0)+(?::|$)/, '::');
        document.getElementById('sim-ipv6-out').innerHTML = `Comprimida: <b>${comp}</b>`;
      };
    }

    document.body.appendChild(wrap);
    pintar();
  };
})();