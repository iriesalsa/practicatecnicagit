(function () {
  const UNIVERSIDADES = [
    {
      id: "ucr", sigla: "UCR", nombre: "Universidad de Costa Rica (PAA)",
      color: "#0284c7", escalaMax: 800, escalaMin: 200, pesoColegio: 0.50, pesoExamen: 0.50,
      enfoque: "Razonamiento Verbal (comprensión de lectura, inferencia lógica) y Razonamiento Matemático.",
      cortes: [
        { carrera: "Ingeniería en Computación e Informática", corte: 675 },
        { carrera: "Medicina y Cirugía", corte: 720 },
        { carrera: "Contaduría Pública / Administración", corte: 635 },
        { carrera: "Ingeniería Eléctrica / Industrial", corte: 660 }
      ]
    },
    {
      id: "tec", sigla: "TEC", nombre: "Tecnológico de Costa Rica (Examen TEC)",
      color: "#1d4ed8", escalaMax: 800, escalaMin: 200, pesoColegio: 0.40, pesoExamen: 0.60,
      enfoque: "Alto rigor en Razonamiento Matemático (álgebra, geometría, sucesiones, combinatoria) y Verbal.",
      cortes: [
        { carrera: "Ingeniería en Computación", corte: 685 },
        { carrera: "Ingeniería Mecatrónica", corte: 705 },
        { carrera: "Ingeniería en Electrónica", corte: 655 },
        { carrera: "Administración de Empresas", corte: 615 }
      ]
    },
    {
      id: "una", sigla: "UNA", nombre: "Universidad Nacional (PAA UNA)",
      color: "#dc2626", escalaMax: 900, escalaMin: 0, pesoColegio: 0.40, pesoExamen: 0.60,
      enfoque: "Comprensión lectora crítica, silogismos, argumentación y razonamiento lógico-matemático.",
      cortes: [
        { carrera: "Ingeniería en Sistemas de Información", corte: 660 },
        { carrera: "Administración / Comercio Internacional", corte: 610 },
        { carrera: "Enseñanza del Inglés", corte: 590 },
        { carrera: "Medicina Veterinaria", corte: 710 }
      ]
    },
    {
      id: "uned", sigla: "UNED", nombre: "Universidad Estatal a Distancia (Diagnóstico y Ubicación)",
      color: "#059669", escalaMax: 100, escalaMin: 0, pesoColegio: 0.00, pesoExamen: 1.00,
      enfoque: "Ingreso abierto con pruebas de diagnóstico en Comprensión Lectora, Matemática Básica, Inglés y Autorregulación.",
      cortes: [
        { carrera: "Ingeniería Informática (Diplomado / Bach.)", corte: 70 },
        { carrera: "Administración de Empresas", corte: 70 },
        { carrera: "Enseñanza de las Ciencias / Matemática", corte: 70 },
        { carrera: "Ubicación de Inglés (Nivel B1)", corte: 75 }
      ]
    },
    {
      id: "utn", sigla: "UTN", nombre: "Universidad Técnica Nacional (Articulación CTP)",
      color: "#ea580c", escalaMax: 100, escalaMin: 0, pesoColegio: 0.60, pesoExamen: 0.40,
      enfoque: "Razonamiento técnico, matemáticas aplicadas y articulación directa para egresados de Colegios Técnicos Profesionales.",
      cortes: [
        { carrera: "Ingeniería del Software (TI)", corte: 82 },
        { carrera: "Contabilidad y Finanzas", corte: 78 },
        { carrera: "Ingeniería Eléctrica / Electromecánica", corte: 80 },
        { carrera: "Administración Aduanera y Logística", corte: 76 }
      ]
    },
    {
      id: "pne", sigla: "PNE MEP", nombre: "Pruebas Nacionales Estandarizadas MEP (11° y 12°)",
      color: "#7c3aed", escalaMax: 100, escalaMin: 0, pesoColegio: 0.60, pesoExamen: 0.40,
      enfoque: "Evaluación diagnóstica y sumativa oficial MEP: Matemáticas, Español, Ciencias, Estudios Sociales y Cívica.",
      cortes: [
        { carrera: "Nivel Avanzado MEP (Destacado)", corte: 85 },
        { carrera: "Nivel Intermedio MEP (Aprobado)", corte: 70 },
        { carrera: "Nota Mínima Promoción Diversificada", corte: 70 }
      ]
    }
  ];

  const BANCO_ADMISION = [
    // RAZONAMIENTO VERBAL (UCR / UNA / TEC / UNED)
    { u: ["ucr","una","tec","uned","pne"], tipo: "Razonamiento Verbal", d: "Intermedio", g: "Busca la conclusión que se deduce estrictamente del texto sin asumir información externa.", q: "Texto: 'Todo algoritmo eficiente reduce el tiempo de ejecución. Ningún proceso manual sin planificación es un algoritmo eficiente.' ¿Qué se concluye con certeza?", o: ["Todo proceso planificado es un algoritmo", "Ningún proceso manual sin planificación reduce el tiempo de ejecución", "Algunos algoritmos eficientes son procesos manuales sin planificación", "Ningún proceso manual sin planificación pertenece al conjunto de algoritmos eficientes"], c: 3, e: "De las premisas solo se deduce con validez lógica que ambos conjuntos son disjuntos (opción D). No se puede concluir que un proceso manual nunca reduzca tiempo por otros medios." },
    { u: ["ucr","una","uned","pne"], tipo: "Razonamiento Verbal", d: "Intermedio", g: "Identifica la relación analógica exacta (instrumento : función o causa : efecto).", q: "Complete la analogía verbal: 'COMPILADOR es a CÓDIGO FUENTE como TRADUCTOR es a ___.'", o: ["Diccionario", "Idioma extranjero", "Impresora", "Teclado"], c: 1, e: "El compilador transforma código fuente a un lenguaje comprensible por la máquina, tal como el traductor convierte un idioma extranjero." },
    { u: ["ucr","una","tec","uned"], tipo: "Comprensión Lectora", d: "Avanzado", g: "Distingue entre idea principal y detalle secundario.", q: "'La automatización no elimina la necesidad de criterio humano; más bien desplaza el esfuerzo desde tareas repetitivas hacia la auditoría ética y el diseño creativo.' ¿Cuál es la tesis central?", o: ["La automatización destruye todo empleo", "El criterio humano sigue siendo indispensable, pero enfocado en diseño y auditoría", "Las tareas repetitivas son las más creativas", "La ética impide automatizar procesos"], c: 1, e: "El autor sostiene que el rol humano evoluciona hacia tareas de mayor valor: diseño creativo y supervisión ética." },
    { u: ["ucr","una","uned","utn"], tipo: "Razonamiento Verbal", d: "Básico", g: "El prefijo 'in-' o contexto de oposición define el antónimo preciso.", q: "En el enunciado 'La explicación del docente fue sumamente lúcida', ¿cuál es el antónimo más preciso de 'lúcida'?", o: ["Brillante", "Confusa", "Breve", "Formal"], c: 1, e: "'Lúcida' significa clara y comprensible; su antónimo directo en contexto académico es 'confusa'." },
    { u: ["ucr","una","tec"], tipo: "Lógica Proposicional", d: "Avanzado", g: "Recuerda la contrarrecíproca: si P → Q, entonces ¬Q → ¬P.", q: "Si es verdadero que 'Si llueve en Heredia, entonces la pista está mojada', ¿cuál afirmación es lógicamente equivalente?", o: ["Si la pista está mojada, entonces llovió en Heredia", "Si no llueve en Heredia, la pista está seca", "Si la pista NO está mojada, entonces NO llovió en Heredia", "Siempre llueve en Heredia"], c: 2, e: "La única proposición lógicamente equivalente a P → Q es su contrarrecíproca: ¬Q → ¬P." },
    // RAZONAMIENTO MATEMÁTICO (TEC / UCR / UNA / UTN)
    { u: ["tec","ucr","una","utn","pne"], tipo: "Razonamiento Matemático", d: "Intermedio", g: "Observa el crecimiento de las diferencias entre términos consecutivos.", q: "[Tipo PAA UCR/TEC] En la secuencia 2, 6, 12, 20, 30, ___, ¿qué número continúa?", o: ["38", "40", "42", "44"], c: 2, e: "Las diferencias son +4, +6, +8, +10, por lo que sigue +12: 30 + 12 = 42 (también equivale a n(n+1): 6×7 = 42)." },
    { u: ["tec","ucr","utn"], tipo: "Razonamiento Matemático", d: "Avanzado", g: "Trabaja en proporción inversa: más técnicos completan la misma tarea en menos tiempo.", q: "[Tipo TEC] Si 6 técnicos instalan un laboratorio de redes en 8 horas, ¿cuánto tardarán 4 técnicos al mismo ritmo?", o: ["5.3 horas", "10 horas", "12 horas", "14 horas"], c: 2, e: "Es proporcionalidad inversa: 6 × 8 = 48 horas-técnico. Entre 4 técnicos: 48 / 4 = 12 horas." },
    { u: ["ucr","tec","una","pne"], tipo: "Razonamiento Matemático", d: "Intermedio", g: "Calcula el precio tras el primer descuento y sobre ese resultado aplica el segundo.", q: "Una computadora cuesta ₡400,000. Primero se rebaja un 20% y luego se aplica un 10% adicional sobre el nuevo precio. ¿Cuál es el precio final?", o: ["₡280,000", "₡288,000", "₡300,000", "₡320,000"], c: 1, e: "Tras 20% queda en ₡320,000. El 10% de ₡320,000 es ₡32,000. Precio final: ₡320,000 - ₡32,000 = ₡288,000." },
    { u: ["tec","ucr","utn","pne"], tipo: "Geometría Analítica", d: "Intermedio", g: "Área del triángulo = (base × altura) / 2. Si duplicas ambos, multiplica por 2 × 2.", q: "Si la base y la altura de un triángulo se duplican simultáneamente, ¿qué ocurre con su área?", o: ["Se duplica", "Se triplica", "Se cuadruplica", "Permanece igual"], c: 2, e: "A' = (2b × 2h)/2 = 4(bh/2) = 4A. El área se cuadruplica." },
    { u: ["tec","ucr","una"], tipo: "Probabilidad y Combinatoria", d: "Avanzado", g: "Principio multiplicativo: multiplica las opciones independientes de cada etapa.", q: "Un estudiante debe elegir 1 especialidad entre 4 opciones, 1 taller entre 3 y 1 idioma entre 2. ¿Cuántas combinaciones distintas puede formar?", o: ["9", "14", "24", "32"], c: 2, e: "Por principio fundamental del conteo: 4 × 3 × 2 = 24 combinaciones distintas." },
    { u: ["ucr","tec","una","uned"], tipo: "Lógica Deductiva", d: "Intermedio", g: "Ordena las estaturas de mayor a menor en una línea mental.", q: "Ana es más alta que Luis. Carlos es más bajo que Luis. Sofía es más alta que Ana. ¿Quién es la persona de menor estatura?", o: ["Ana", "Luis", "Carlos", "Sofía"], c: 2, e: "Orden de mayor a menor: Sofía > Ana > Luis > Carlos. Por tanto, Carlos es el de menor estatura." },
    { u: ["uned","utn","pne"], tipo: "Educación a Distancia y Estudio", d: "Básico", g: "La autorregulación es clave en modalidades híbridas y a distancia.", q: "[UNED] ¿Cuál hábito es fundamental para aprobar cursos universitarios en modalidad a distancia?", o: ["Estudiar únicamente el día del examen", "Planificar un cronograma semanal con autoevaluaciones periódicas", "Evitar consultar las orientaciones académicas", "No participar en foros ni tutorías"], c: 1, e: "La gestión autónoma del tiempo y la práctica espaciada son pilares del éxito en la UNED." },
    { u: ["utn","tec"], tipo: "Razonamiento Técnico", d: "Intermedio", g: "Potencia eléctrica P = V × I.", q: "[Articulación UTN / CTP] Un equipo opera a 120 V consumiendo 5 A. ¿Cuál es su potencia eléctrica en Watts?", o: ["24 W", "125 W", "600 W", "1200 W"], c: 2, e: "Aplicando P = V × I = 120 V × 5 A = 600 Watts." }
  ];

  function randInt(min, max) {
    const b = new Uint32Array(1); crypto.getRandomValues(b);
    return min + (b[0] % (max - min + 1));
  }

  function shuffleCrypto(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const b = new Uint32Array(1); crypto.getRandomValues(b);
      const j = b[0] % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function generarParametricosAdmision(univId, cant) {
    const out = [];
    for (let i = 0; i < cant; i++) {
      const kind = i % 5;
      if (kind === 0) {
        // Sucesión cuadrática o aritmética tipo PAA
        const ini = randInt(2, 12), step = randInt(3, 9), inc = randInt(2, 5);
        const s1 = ini, s2 = s1 + step, s3 = s2 + step + inc, s4 = s3 + step + 2 * inc, s5 = s4 + step + 3 * inc;
        out.push({
          tipo: "Razonamiento Matemático (PAA)", d: "Intermedio",
          g: `Analiza cuánto aumenta cada diferencia consecutiva (+${step}, +${step+inc}, +${step+2*inc}...).`,
          q: `[${univId.toUpperCase()}] Observe la sucesión numérica: ${s1}, ${s2}, ${s3}, ${s4}, X. ¿Cuál es el valor de X?`,
          o: [String(s5), String(s5 + inc), String(s5 - 2), String(s5 + step)], c: 0,
          e: `Las diferencias aumentan en +${inc} cada vez. Al sumar ${step + 3 * inc} a ${s4} se obtiene ${s5}.`
        });
      } else if (kind === 1) {
        // Porcentajes y razón
        const total = randInt(4, 20) * 50, pct = [15, 20, 25, 30, 40][randInt(0, 4)];
        const val = Math.round(total * pct / 100);
        out.push({
          tipo: "Razonamiento Cuantitativo", d: "Básico",
          g: `Multiplica ${total} por ${pct} y divide entre 100.`,
          q: `[${univId.toUpperCase()}] En una encuesta a ${total} postulantes, el ${pct}% eligió carreras tecnológicas. ¿Cuántos estudiantes representan ese porcentaje?`,
          o: [String(val), String(val + 15), String(Math.max(5, val - 10)), String(total - val)], c: 0,
          e: `El ${pct}% de ${total} es (${total} × ${pct}) / 100 = ${val} estudiantes.`
        });
      } else if (kind === 2) {
        // Promedio ponderado / aritmético
        const n1 = randInt(70, 95), n2 = randInt(72, 98), prom = randInt(80, 92);
        const n3 = 3 * prom - n1 - n2;
        if (n3 >= 50 && n3 <= 100) {
          out.push({
            tipo: "Estadística PAA", d: "Intermedio",
            g: `La suma de las 3 notas debe ser 3 × ${prom} = ${3 * prom}.`,
            q: `[${univId.toUpperCase()}] Un estudiante obtuvo ${n1} y ${n2} en dos pruebas. ¿Qué nota necesita en la tercera prueba para lograr un promedio exacto de ${prom}?`,
            o: [String(n3), String(Math.min(100, n3 + 4)), String(Math.max(40, n3 - 3)), String(prom)], c: 0,
            e: `Para promediar ${prom} en 3 pruebas se requieren ${3 * prom} puntos. ${3 * prom} - (${n1} + ${n2}) = ${n3}.`
          });
        } else {
          const a = randInt(3, 9), x = randInt(4, 14), b = randInt(5, 20);
          out.push({
            tipo: "Álgebra Admisión", d: "Intermedio",
            g: `Despeja x pasando ${b} a restar y dividiendo entre ${a}.`,
            q: `[${univId.toUpperCase()}] Si ${a}x + ${b} = ${a * x + b}, ¿cuál es el valor de 2x?`,
            o: [String(2 * x), String(x), String(2 * x + 2), String(3 * x)], c: 0,
            e: `Primero x = (${a * x + b} - ${b}) / ${a} = ${x}. Luego 2x = ${2 * x}.`
          });
        }
      } else if (kind === 3) {
        // Velocidad / Tiempo
        const v = randInt(4, 10) * 10, t = randInt(2, 6), dist = v * t;
        out.push({
          tipo: "Problemas de Rapidez", d: "Básico",
          g: "Recuerda que Distancia = Velocidad × Tiempo.",
          q: `[${univId.toUpperCase()}] Un autobús universitario viaja a rapidez constante de ${v} km/h durante ${t} horas. ¿Cuántos kilómetros recorre?`,
          o: [`${dist} km`, `${dist + v} km`, `${Math.round(dist / 2)} km`, `${v + t} km`], c: 0,
          e: `Multiplicando rapidez por tiempo: ${v} km/h × ${t} h = ${dist} km.`
        });
      } else {
        // Proporcionalidad directa
        const p = randInt(2, 6), horas = randInt(3, 8), items = p * horas * 5;
        const h2 = horas + 2, res = p * h2 * 5;
        out.push({
          tipo: "Proporcionalidad PAA", d: "Intermedio",
          g: `Calcula cuántos ítems se resuelven en 1 hora (${Math.round(items / horas)}) y multiplica por ${h2}.`,
          q: `[${univId.toUpperCase()}] Si un grupo resuelve ${items} ejercicios en ${horas} horas al mismo ritmo constante, ¿cuántos resolverá en ${h2} horas?`,
          o: [String(res), String(res - 10), String(res + 15), String(items + h2)], c: 0,
          e: `Tasa por hora: ${items} / ${horas} = ${items / horas}. En ${h2} horas: ${items / horas} × ${h2} = ${res}.`
        });
      }
    }
    return out;
  }

  window.BDS_UNIVERSIDADES = UNIVERSIDADES;

  window.BDS_RENDER_ADMISION = function (shell, univInicial, ganarXP) {
    let univId = univInicial || "ucr";
    let modo = "hub"; // hub | guiada | simulacro | calculadora
    let cantidad = 20;
    let items = [], idx = 0, answers = {}, secLeft = 1800, paused = false, finished = false, timerId = null;
    let promCole = 90, pctSim = 82;

    function stopT() { if (timerId) { clearInterval(timerId); timerId = null; } }

    function lanzarExamen(nuevoModo) {
      stopT();
      modo = nuevoModo;
      let base = BANCO_ADMISION.filter(x => x.u.includes(univId));
      if (base.length < cantidad) base = base.concat(generarParametricosAdmision(univId, cantidad - base.length + 6));
      items = shuffleCrypto(base).slice(0, cantidad).map(it => ({ ...it, opts: shuffleCrypto(it.o.map((txt, i) => ({ txt, ok: i === it.c }))) }));
      idx = 0; answers = {}; paused = false; finished = false;
      secLeft = cantidad * 90;
      if (modo === "simulacro") {
        timerId = setInterval(() => {
          if (!document.getElementById("adm-stage")) { stopT(); return; }
          if (!paused && !finished) {
            secLeft--;
            const ck = document.getElementById("adm-clk");
            if (ck) ck.innerText = `${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}`;
            if (secLeft <= 0) { finished = true; stopT(); draw(); }
          }
        }, 1000);
      }
      draw();
    }

    function calcularNotaAdmision(uObj, promC, pctEx) {
      if (uObj.escalaMax === 800) {
        const notaEx = 200 + (pctEx / 100) * 600;
        const notaCol = 200 + (promC / 100) * 600;
        return Math.round(notaCol * uObj.pesoColegio + notaEx * uObj.pesoExamen);
      }
      if (uObj.escalaMax === 900) {
        const notaEx = (pctEx / 100) * 900;
        const notaCol = (promC / 100) * 900;
        return Math.round(notaCol * uObj.pesoColegio + notaEx * uObj.pesoExamen);
      }
      return Math.round(promC * uObj.pesoColegio + pctEx * uObj.pesoExamen);
    }

    function draw() {
      const uObj = UNIVERSIDADES.find(u => u.id === univId) || UNIVERSIDADES[0];

      shell.innerHTML = `
        <div class="bds-card" id="adm-stage">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1e293b;padding-bottom:12px;margin-bottom:14px;">
            <div>
              <span style="background:${uObj.color};color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:99px;">ADMISIÓN UNIVERSITARIA COSTA RICA • UCR • TEC • UNA • UNED • UTN • PNE MEP</span>
              <h2 style="margin:5px 0 0;font-size:18px;color:#fff;">🎓 ${uObj.nombre}</h2>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button id="ad-hub" style="background:${modo==='hub'?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🏛️ Universidades</button>
              <button id="ad-gui" style="background:${modo==='guiada'?'#059669':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🧭 Práctica Guiada</button>
              <button id="ad-sim" style="background:${modo==='simulacro'?'#d97706':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">⏱️ Simulacro Cronometrado</button>
              <button id="ad-cal" style="background:${modo==='calculadora'?'#7c3aed':'#131f33'};color:#fff;border:1px solid #334155;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🧮 Simulador de Nota</button>
            </div>
          </div>

          <!-- Selector rápido de Universidades -->
          <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid #1e293b;">
            ${UNIVERSIDADES.map(u => `<button data-uid="${u.id}" class="u-pill" style="background:${u.id===univId?u.color:'#131f33'};color:#fff;border:1px solid ${u.id===univId?'#38bdf8':'#26354d'};padding:7px 13px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">${u.sigla}</button>`).join("")}
            <select id="adm-cant" style="margin-left:auto;background:#070d19;color:#fbbf24;border:1px solid #334155;padding:7px 10px;border-radius:8px;font-size:12px;font-weight:800;">
              ${[10, 20, 30, 40, 50, 60].map(c => `<option value="${c}" ${cantidad===c?"selected":""}>${c} preguntas</option>`).join("")}
            </select>
          </div>

          <div id="adm-content"></div>
        </div>
      `;

      shell.querySelectorAll(".u-pill").forEach(b => b.onclick = () => {
        univId = b.getAttribute("data-uid");
        if (modo === "guiada" || modo === "simulacro") lanzarExamen(modo);
        else draw();
      });
      document.getElementById("adm-cant").onchange = (e) => {
        cantidad = Number(e.target.value);
        if (modo === "guiada" || modo === "simulacro") lanzarExamen(modo);
      };
      document.getElementById("ad-hub").onclick = () => { stopT(); modo = "hub"; draw(); };
      document.getElementById("ad-gui").onclick = () => lanzarExamen("guiada");
      document.getElementById("ad-sim").onclick = () => lanzarExamen("simulacro");
      document.getElementById("ad-cal").onclick = () => { stopT(); modo = "calculadora"; draw(); };

      const content = document.getElementById("adm-content");

      if (modo === "hub") {
        content.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;margin-bottom:16px;">
            <div style="background:#070d19;border:1px solid ${uObj.color};border-radius:12px;padding:16px;">
              <h3 style="margin:0 0 6px;color:#38bdf8;">📘 Estructura Oficial — ${uObj.sigla}</h3>
              <p style="margin:0 0 10px;font-size:12.5px;color:#cbd5e1;line-height:1.5;">${uObj.enfoque}</p>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">
                Escala oficial: <b style="color:#fbbf24;">${uObj.escalaMin} – ${uObj.escalaMax} pts</b> • Ponderación: <b>${Math.round(uObj.pesoColegio*100)}% Colegio / ${Math.round(uObj.pesoExamen*100)}% Prueba</b>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button id="hub-g" style="background:#059669;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">🧭 Práctica Guiada (${cantidad} ítems)</button>
                <button id="hub-s" style="background:#d97706;color:#fff;border:none;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">⏱️ Simulacro Oficial (${cantidad} ítems)</button>
              </div>
            </div>
            <div style="background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:16px;">
              <h3 style="margin:0 0 8px;color:#34d399;">🎯 Cortes Referenciales de Carreras (${uObj.sigla})</h3>
              <table style="width:100%;font-size:12px;border-collapse:collapse;">
                ${uObj.cortes.map(c => `<tr><td style="padding:7px 4px;border-bottom:1px solid #1e293b;color:#e2e8f0;">${c.carrera}</td><td style="padding:7px 4px;border-bottom:1px solid #1e293b;text-align:right;font-weight:800;color:#fbbf24;">${c.corte} pts</td></tr>`).join("")}
              </table>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;">
            ${UNIVERSIDADES.map(u => `
              <div data-cardu="${u.id}" class="u-card" style="background:#070d19;border:1px solid #1e293b;border-top:3px solid ${u.color};border-radius:11px;padding:13px;cursor:pointer;">
                <div style="font-weight:900;color:#fff;font-size:14px;">${u.sigla}</div>
                <div style="font-size:11.5px;color:#94a3b8;margin-top:3px;">${u.nombre}</div>
              </div>
            `).join("")}
          </div>
        `;
        document.getElementById("hub-g").onclick = () => lanzarExamen("guiada");
        document.getElementById("hub-s").onclick = () => lanzarExamen("simulacro");
        content.querySelectorAll(".u-card").forEach(el => el.onclick = () => { univId = el.getAttribute("data-cardu"); draw(); });
      }
      else if (modo === "calculadora") {
        const notaProy = calcularNotaAdmision(uObj, promCole, pctSim);
        content.innerHTML = `
          <div style="max-width:680px;margin:0 auto;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:18px;">
            <h3 style="margin:0 0 6px;color:#38bdf8;">🧮 Validador y Proyección de Nota de Admisión (${uObj.sigla})</h3>
            <p style="margin:0 0 14px;font-size:12px;color:#94a3b8;">Ajusta tu promedio de Educación Diversificada (10° y 11°/12°) y tu porcentaje esperado en la prueba:</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:4px;">Promedio de Colegio (0–100):</label>
                <input id="c-col" type="number" min="50" max="100" value="${promCole}" style="width:100%;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:15px;font-weight:800;"/>
              </div>
              <div>
                <label style="font-size:11.5px;color:#cbd5e1;display:block;margin-bottom:4px;">Rendimiento en Simulacro (%):</label>
                <input id="c-sim" type="number" min="0" max="100" value="${pctSim}" style="width:100%;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px;border-radius:8px;font-size:15px;font-weight:800;"/>
              </div>
            </div>
            <div style="text-align:center;background:#0b1322;border:1.5px solid #10b981;border-radius:12px;padding:16px;margin-bottom:14px;">
              <div style="font-size:11.5px;color:#94a3b8;">NOTA DE ADMISIÓN PROYECTADA (${uObj.sigla})</div>
              <div style="font-size:34px;font-weight:900;color:#34d399;margin:4px 0;">${notaProy} / ${uObj.escalaMax} pts</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:7px;">
              ${uObj.cortes.map(c => {
                const cumple = notaProy >= c.corte;
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:8px;background:${cumple?'#064e3b':'#1e293b'};font-size:12.5px;">
                  <span>${c.carrera} (Corte ref: ${c.corte})</span>
                  <b style="color:${cumple?'#6ee7b7':'#fbbf24'};">${cumple ? "✅ Ingresa" : `Faltan ${c.corte - notaProy} pts`}</b>
                </div>`;
              }).join("")}
            </div>
          </div>
        `;
        document.getElementById("c-col").oninput = (e) => { promCole = Math.max(0, Math.min(100, Number(e.target.value) || 0)); draw(); document.getElementById("c-col").focus(); };
        document.getElementById("c-sim").oninput = (e) => { pctSim = Math.max(0, Math.min(100, Number(e.target.value) || 0)); draw(); document.getElementById("c-sim").focus(); };
      }
      else {
        if (finished) {
          stopT();
          let ok = 0;
          items.forEach((it, i) => { if (answers[i] !== undefined && it.opts[answers[i]] && it.opts[answers[i]].ok) ok++; });
          const pct = Math.round((ok / items.length) * 100);
          pctSim = pct;
          const notaUniv = calcularNotaAdmision(uObj, promCole, pct);
          if (pct >= 70 && ganarXP) ganarXP(cantidad * 3, `🎓 ${uObj.sigla} Aprobado`);

          content.innerHTML = `
            <div style="max-width:780px;margin:0 auto;text-align:center;background:#070d19;border:2px solid ${pct>=70?'#10b981':'#f59e0b'};border-radius:14px;padding:22px;">
              <h2 style="margin:0 0 8px;color:#fff;">Resultado Oficial — Simulacro ${uObj.sigla}</h2>
              <p style="font-size:15px;color:#cbd5e1;">Aciertos: <b style="color:#34d399;">${ok}/${items.length} (${pct}%)</b> • Nota Proyectada ${uObj.sigla}: <b style="color:#fbbf24;">${notaUniv} / ${uObj.escalaMax} pts</b></p>
              <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:14px 0;">
                <button id="ad-ag" style="background:#1d4ed8;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:700;cursor:pointer;">🔄 Repetir con Nuevos Ítems</button>
                <button id="ad-tocal" style="background:#7c3aed;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-weight:700;cursor:pointer;">🧮 Ver Cortes por Carrera</button>
              </div>
              <div style="text-align:left;display:flex;flex-direction:column;gap:8px;max-height:320px;overflow-y:auto;margin-top:12px;">
                ${items.map((it, i) => {
                  const ch = answers[i], corr = it.opts.find(o => o.ok), bien = ch !== undefined && it.opts[ch] && it.opts[ch].ok;
                  return `<div style="background:#0b1322;border-left:4px solid ${bien?'#10b981':'#ef4444'};padding:10px;border-radius:8px;font-size:12px;"><b>${i+1}. ${it.q}</b><br/><span style="color:#34d399;">Correcta: ${corr.txt}</span> — <span style="color:#94a3b8;">${it.e}</span></div>`;
                }).join("")}
              </div>
            </div>
          `;
          document.getElementById("ad-ag").onclick = () => lanzarExamen(modo);
          document.getElementById("ad-tocal").onclick = () => { modo = "calculadora"; draw(); };
          return;
        }

        const cur = items[idx], resp = answers[idx];
        content.innerHTML = `
          ${modo === "simulacro" ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;background:#070d19;border:1px solid #f59e0b;padding:10px 14px;border-radius:10px;margin-bottom:12px;">
              <div style="color:#fbbf24;font-weight:800;font-size:14px;">⏱️ Cronómetro ${uObj.sigla}: <span id="adm-clk" style="font-family:monospace;font-size:16px;">${String(Math.floor(secLeft / 60)).padStart(2, "0")}:${String(secLeft % 60).padStart(2, "0")}</span></div>
              <div style="display:flex;gap:6px;">
                <button id="ad-pau" style="background:#b45309;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${paused ? "▶️ Reanudar" : "⏸️ Pausar"}</button>
                <button id="ad-fin" style="background:#059669;color:#fff;border:none;padding:6px 11px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">✅ Entregar</button>
              </div>
            </div>
          ` : ""}
          ${paused ? `<div style="text-align:center;padding:40px;color:#fbbf24;font-weight:800;">⏸️ Simulacro en pausa.</div>` : `
            <div style="max-width:820px;margin:0 auto;background:#070d19;border:1px solid #1e293b;border-radius:12px;padding:18px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                <span style="background:${uObj.color};color:#fff;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:99px;">${uObj.sigla} • ${cur.tipo}</span>
                <span style="font-size:12px;color:#38bdf8;font-weight:800;">Pregunta ${idx + 1} de ${items.length}</span>
              </div>
              ${modo === "guiada" ? `<div style="background:#0b1322;border-left:4px solid #10b981;padding:10px 12px;border-radius:8px;margin-bottom:12px;font-size:12.5px;color:#a7f3d0;"><b>🧭 Estrategia de Resolución:</b> ${cur.g}</div>` : ""}
              <h3 style="margin:0 0 14px;font-size:15.5px;color:#fff;line-height:1.5;">${cur.q}</h3>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${cur.opts.map((o, i) => {
                  let bg = "#131f33", bd = "#26354d";
                  if (modo === "simulacro" && resp === i) { bg = "#1d4ed8"; bd = "#38bdf8"; }
                  else if (modo === "guiada" && resp !== undefined) {
                    if (o.ok) { bg = "#064e3b"; bd = "#10b981"; }
                    else if (resp === i) { bg = "#7f1d1d"; bd = "#ef4444"; }
                  }
                  return `<button data-aoi="${i}" class="ad-opt" style="text-align:left;background:${bg};border:1.5px solid ${bd};color:#fff;padding:11px 14px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;min-height:44px;">${String.fromCharCode(65 + i)}) ${o.txt}</button>`;
                }).join("")}
              </div>
              ${modo === "guiada" && resp !== undefined ? `<div style="margin-top:12px;padding:11px;border-radius:8px;background:${cur.opts[resp].ok?'#064e3b':'#450a0a'};color:${cur.opts[resp].ok?'#6ee7b7':'#fca5a5'};font-size:12.5px;"><b>${cur.opts[resp].ok ? "✅ ¡Excelente! (+10 XP)" : "❌ Explicación:"}</b> ${cur.e}</div>` : ""}
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #1e293b;">
                <button id="ad-prev" ${idx===0?"disabled":""} style="background:#1e293b;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;cursor:pointer;">← Anterior</button>
                <span style="font-size:11.5px;color:#94a3b8;">Respondidas: ${Object.keys(answers).length}/${items.length}</span>
                <button id="ad-next" style="background:#1d4ed8;color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:800;cursor:pointer;">${idx>=items.length-1?"Finalizar":"Siguiente →"}</button>
              </div>
            </div>
          `}
        `;
        if (document.getElementById("ad-pau")) document.getElementById("ad-pau").onclick = () => { paused = !paused; draw(); };
        if (document.getElementById("ad-fin")) document.getElementById("ad-fin").onclick = () => { finished = true; draw(); };
        if (!paused) {
          content.querySelectorAll(".ad-opt").forEach(b => b.onclick = () => {
            const c = Number(b.getAttribute("data-aoi"));
            if (modo === "guiada" && answers[idx] !== undefined) return;
            answers[idx] = c;
            if (modo === "guiada" && cur.opts[c].ok && ganarXP) ganarXP(10);
            draw();
          });
          document.getElementById("ad-prev").onclick = () => { if (idx > 0) { idx--; draw(); } };
          document.getElementById("ad-next").onclick = () => { if (idx < items.length - 1) { idx++; draw(); } else { finished = true; draw(); } };
        }
      }
    }
    draw();
  };
})();