(function () {
  const LAB_DATA = {
    en: {
      nom: "🇺🇸 English", code: "en-US",
      listening: [
        { audio: "Good morning! Our technical high school builds accessible web applications and recycles plastic bottles every Friday.", q: "When does the school recycle plastic bottles?", o: ["Every Friday", "Every Sunday", "Once a year", "Never"], c: 0, e: "The audio clearly states «every Friday»." },
        { audio: "Before entering the computer laboratory, students must sign in and verify the room key with their teacher.", q: "What must students do before entering the computer lab?", o: ["Sign in and verify the room key with their teacher", "Turn off all monitors permanently", "Bring food and drinks", "Skip class"], c: 0, e: "The speaker mentions signing in and verifying the key." }
      ],
      speaking: [
        { frase: "Good morning, I am studying web development and cybersecurity.", guia: "Pronuncia claro: «Gud mórning, ai am stóding uéb divélopment and saibersekiúriti»." },
        { frase: "Practice every day builds confidence and real fluency.", guia: "Enfatiza «práctis évri dei bilds cónfidens and ríal flúensi»." }
      ],
      grammar: [
        { q: "Choose the correct First Conditional: «If she ___ daily, she will pass the admission exam.»", o: ["practices", "practiced", "will practice", "practicing"], c: 0, e: "First Conditional uses Simple Present in the If-clause (practices)." },
        { q: "Complete in Simple Past: «Yesterday, we ___ a clean responsive interface.»", o: ["built", "builded", "building", "builds"], c: 0, e: "«Built» is the irregular Simple Past of «build»." }
      ],
      writing: [
        { prompt: "Write 2 sentences in English about your daily study goal (include words: «study» and «today»).", req: ["study", "today"], minWords: 8 }
      ]
    },
    fr: {
      nom: "🇫🇷 Français", code: "fr-FR",
      listening: [
        { audio: "Bonjour ! Je m'appelle Sofía et j'étudie la programmation au collège technique de Heredia.", q: "Qu'est-ce que Sofía étudie au collège technique ?", o: ["La programmation", "La médecine", "L'architecture navale", "La cuisine française"], c: 0, e: "Sofía dit : «j'étudie la programmation»." }
      ],
      speaking: [
        { frase: "Bonjour, je suis étudiant et j'aime apprendre des langues.", guia: "Pronunciación suave en «Bonllúr, ye suí etudián e yem aprándr de lang»." }
      ],
      grammar: [
        { q: "Complétez avec le verbe être : «Nous ___ prêts pour l'examen.»", o: ["sommes", "suis", "êtes", "sont"], c: 0, e: "Avec «Nous», le verbe être au présent est «sommes»." }
      ],
      writing: [
        { prompt: "Écrivez une présentation courte en français (incluez «bonjour» et «merci»).", req: ["bonjour", "merci"], minWords: 6 }
      ]
    },
    pt: {
      nom: "🇧🇷 Português", code: "pt-BR",
      listening: [
        { audio: "Olá! A educação técnica prepara jovens com tecnologia, criatividade e trabalho em equipe.", q: "O que a educação técnica desenvolve nos jovens segundo o áudio?", o: ["Tecnologia, criatividade e trabalho em equipe", "Apenas memorização antiga", "Esportes radicais", "Nenhuma habilidade"], c: 0, e: "O áudio destaca tecnologia, criatividade e trabalho em equipe." }
      ],
      speaking: [
        { frase: "Bom dia, estou praticando português todos os dias.", guia: "Enfatiza «Bon día, estóu pratikándo portugés tódos os días»." }
      ],
      grammar: [
        { q: "Complete corretamente: «Nós ___ tecnologia na escola técnica.»", o: ["estudamos", "estudo", "estuda", "estudam"], c: 0, e: "Com o pronome «Nós», o verbo estudar conjuga-se «estudamos»." }
      ],
      writing: [
        { prompt: "Escreva uma frase em português sobre seus estudos (inclua «hoje» e «aprender»).", req: ["hoje", "aprender"], minWords: 6 }
      ]
    },
    es: {
      nom: "🇨🇷 Español", code: "es-CR",
      listening: [
        { audio: "La comunicación asertiva permite expresar ideas y emociones con claridad, respeto y empatía hacia los demás.", q: "¿Qué caracteriza a la comunicación asertiva según el audio?", o: ["Expresar ideas con claridad, respeto y empatía", "Gritar para imponer una opinión", "Guardar silencio siempre", "Ignorar al interlocutor"], c: 0, e: "El audio define la asertividad mediante claridad, respeto y empatía." }
      ],
      speaking: [
        { frase: "La práctica diaria y la disciplina construyen excelencia profesional.", guia: "Lee con entonación firme y pausas claras en cada palabra." }
      ],
      grammar: [
        { q: "Seleccione la oración con tilde diacrítica correcta:", o: ["Sé que tú lograrás tu meta académica.", "Se que tu lograrás tú meta académica.", "Sé que tu lograrás tu meta académica.", "Se que tú lograrás tú meta académica."], c: 0, e: "«Sé» (saber) y «tú» (pronombre) llevan tilde; «tu» posesivo no." }
      ],
      writing: [
        { prompt: "Redacta un párrafo breve de 2 oraciones sobre tu meta educativa (incluye «disciplina» y «meta»).", req: ["disciplina", "meta"], minWords: 10 }
      ]
    }
  };

  function calcSimilarity(target, spoken) {
    const clean = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const a = clean(target), b = new Set(clean(spoken));
    if (!a.length) return 0;
    const hits = a.filter(w => b.has(w)).length;
    return Math.round((hits / a.length) * 100);
  }

  function evaluarWriting(text, reqWords, minWords) {
    const clean = String(text || "").trim();
    const words = clean.split(/\s+/).filter(Boolean);
    const low = clean.toLowerCase();
    const missing = (reqWords || []).filter(w => !low.includes(w.toLowerCase()));
    const hasPunct = /[.!?]$/.test(clean);
    const score = Math.min(100, (words.length >= minWords ? 50 : Math.round((words.length / minWords) * 50)) + (missing.length === 0 ? 35 : Math.max(0, 35 - missing.length * 18)) + (hasPunct ? 15 : 0));
    return { score, wordCount: words.length, missing, hasPunct };
  }

  window.BDS_IDIOMAS_4SKILLS_API = { LAB_DATA, calcSimilarity, evaluarWriting };

  window.BDS_RENDER_IDIOMAS_LAB = function (shell, ctx) {
    const { ganarXP } = ctx || {};
    let lang = "en", skill = "listening", idx = 0, feedback = "", spokenText = "", writingText = "";

    function speakText(txt, rate) {
      try {
        if (window.BDS_NATIVE) {
          const prev = window.BDS_NATIVE.getTtsRate();
          window.BDS_NATIVE.setTtsRate(rate || 0.95);
          window.BDS_NATIVE.speak(txt, LAB_DATA[lang].code);
          setTimeout(() => window.BDS_NATIVE.setTtsRate(prev), 300);
        }
      } catch {}
    }

    function draw() {
      const L = LAB_DATA[lang] || LAB_DATA.en;
      const list = L[skill] || [];
      const cur = list[idx % Math.max(1, list.length)];

      shell.innerHTML = `
        <div class="bds-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;border-bottom:1px solid #1e293b;padding-bottom:11px;margin-bottom:13px;">
            <div>
              <span style="background:#0284c7;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;">LABORATORIO 4 HABILIDADES • LISTENING • SPEAKING • GRAMMAR • WRITING</span>
              <h2 style="margin:5px 0 0;font-size:17px;color:#fff;">🗣️ Laboratorio Multilingüe Interactivo (EN / FR / PT / ES)</h2>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;">
              ${Object.entries(LAB_DATA).map(([k, v]) => `<button data-il="${k}" class="il-lg" style="background:${lang===k?'#1d4ed8':'#131f33'};color:#fff;border:1px solid #334155;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">${v.nom}</button>`).join("")}
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
            ${[["listening","🎧 Listening"],["speaking","🎤 Speaking"],["grammar","🧩 Grammar"],["writing","✍️ Writing"]].map(([k, lbl]) => `<button data-sk="${k}" class="il-sk" style="background:${skill===k?'#0f766e':'#131f33'};color:#fff;border:1px solid ${skill===k?'#2dd4bf':'#334155'};padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">${lbl}</button>`).join("")}
          </div>

          ${skill === "listening" && cur ? `
            <div style="background:#070d19;border:1px solid #38bdf8;border-radius:12px;padding:15px;">
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                <button id="li-play" style="background:#059669;color:#fff;border:none;padding:10px 15px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">🔊 Reproducir Audio (Normal)</button>
                <button id="li-slow" style="background:#1d4ed8;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🐢 Audio Lento (DUA 0.75×)</button>
                <button id="li-nxt" style="background:#334155;color:#fff;border:none;padding:10px 12px;border-radius:8px;font-size:12px;cursor:pointer;">Siguiente →</button>
              </div>
              <h3 style="margin:0 0 10px;font-size:15px;color:#fff;">${cur.q}</h3>
              <div style="display:flex;flex-direction:column;gap:7px;">
                ${cur.o.map((op, i) => `<button data-oi="${i}" class="li-opt" style="text-align:left;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">${String.fromCharCode(65+i)}) ${op}</button>`).join("")}
              </div>
              ${feedback ? `<div style="margin-top:11px;padding:10px;border-radius:8px;background:#064e3b;color:#a7f3d0;font-size:12.5px;">${feedback}</div>` : ""}
            </div>
          ` : ""}

          ${skill === "speaking" && cur ? `
            <div style="background:#070d19;border:1px solid #10b981;border-radius:12px;padding:15px;">
              <div style="font-size:11px;color:#2dd4bf;font-weight:700;margin-bottom:5px;">LEE ESTA FRASE EN VOZ ALTA (${L.nom}):</div>
              <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;">“${cur.frase}”</div>
              <div style="font-size:12px;color:#fde68a;margin-bottom:12px;">💡 Guía fonética: ${cur.guia}</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <button id="sp-mod" style="background:#1d4ed8;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🔊 Escuchar Modelo</button>
                <button id="sp-rec" style="background:#dc2626;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">🎤 Grabar Mi Voz</button>
                <button id="sp-nxt" style="background:#334155;color:#fff;border:none;padding:10px 12px;border-radius:8px;font-size:12px;cursor:pointer;">Otra Frase →</button>
              </div>
              ${spokenText ? `<div style="background:#0b1322;border:1px solid #334155;padding:10px;border-radius:8px;font-size:12.5px;color:#e2e8f0;"><b>Escuchado:</b> “${spokenText}”</div>` : ""}
              ${feedback ? `<div style="margin-top:10px;padding:10px;border-radius:8px;background:#064e3b;color:#a7f3d0;font-size:12.5px;">${feedback}</div>` : ""}
            </div>
          ` : ""}

          ${skill === "grammar" && cur ? `
            <div style="background:#070d19;border:1px solid #a855f7;border-radius:12px;padding:15px;">
              <h3 style="margin:0 0 11px;font-size:15px;color:#fff;">${cur.q}</h3>
              <div style="display:flex;flex-direction:column;gap:7px;">
                ${cur.o.map((op, i) => `<button data-gi="${i}" class="gr-opt" style="text-align:left;background:#0b1322;border:1px solid #334155;color:#fff;padding:10px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">${String.fromCharCode(65+i)}) ${op}</button>`).join("")}
              </div>
              ${feedback ? `<div style="margin-top:11px;padding:10px;border-radius:8px;background:#1e1b4b;color:#ddd6fe;font-size:12.5px;">${feedback}</div>` : ""}
              <button id="gr-nxt" style="margin-top:10px;background:#1d4ed8;color:#fff;border:none;padding:8px 13px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;">Siguiente Ejercicio →</button>
            </div>
          ` : ""}

          ${skill === "writing" && cur ? `
            <form id="wr-f" style="background:#070d19;border:1px solid #f59e0b;border-radius:12px;padding:15px;display:flex;flex-direction:column;gap:10px;">
              <div style="font-size:14px;font-weight:700;color:#fff;">✍️ ${cur.prompt}</div>
              <textarea id="wr-txt" rows="4" required placeholder="Escribe tu respuesta aquí..." style="background:#0b1322;color:#fff;border:1px solid #334155;padding:10px;border-radius:8px;font-size:13px;">${writingText}</textarea>
              <button type="submit" style="background:#059669;color:#fff;border:none;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:800;cursor:pointer;">✅ Evaluar Writing</button>
              ${feedback ? `<div style="padding:10px;border-radius:8px;background:#064e3b;color:#a7f3d0;font-size:12.5px;">${feedback}</div>` : ""}
            </form>
          ` : ""}
        </div>
      `;

      shell.querySelectorAll(".il-lg").forEach(b => b.onclick = () => { lang = b.getAttribute("data-il"); idx = 0; feedback = ""; spokenText = ""; writingText = ""; draw(); });
      shell.querySelectorAll(".il-sk").forEach(b => b.onclick = () => { skill = b.getAttribute("data-sk"); idx = 0; feedback = ""; spokenText = ""; writingText = ""; draw(); });

      if (skill === "listening" && cur) {
        document.getElementById("li-play").onclick = () => speakText(cur.audio, 0.96);
        document.getElementById("li-slow").onclick = () => speakText(cur.audio, 0.75);
        document.getElementById("li-nxt").onclick = () => { idx++; feedback = ""; draw(); };
        shell.querySelectorAll(".li-opt").forEach(b => b.onclick = () => {
          const ch = Number(b.getAttribute("data-oi"));
          if (ch === cur.c) { feedback = `✅ ¡Correcto! (+15 XP) ${cur.e}`; if (ganarXP) ganarXP(15); }
          else feedback = `❌ Intenta de nuevo. Pista: escucha de nuevo el audio en modo lento.`;
          draw();
        });
      }

      if (skill === "speaking" && cur) {
        document.getElementById("sp-mod").onclick = () => speakText(cur.frase, 0.92);
        document.getElementById("sp-nxt").onclick = () => { idx++; feedback = ""; spokenText = ""; draw(); };
        document.getElementById("sp-rec").onclick = () => {
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SR) { feedback = "⚠️ Tu navegador no soporta reconocimiento de voz directo. Practica con «Escuchar Modelo» en Chrome o Edge."; draw(); return; }
          const rec = new SR();
          rec.lang = L.code; rec.interimResults = false; rec.maxAlternatives = 1;
          feedback = "🎙️ Escuchando... habla claro cerca del micrófono."; draw();
          rec.onresult = (ev) => {
            spokenText = ev.results[0][0].transcript || "";
            const sim = calcSimilarity(cur.frase, spokenText);
            if (sim >= 70) { feedback = `🎉 ¡Excelente pronunciación (${sim}% precisión • +20 XP)!`; if (ganarXP) ganarXP(20); }
            else feedback = `🎯 Precisión: ${sim}%. Escucha el modelo e inténtalo de nuevo.`;
            draw();
          };
          rec.onerror = () => { feedback = "⚠️ No se detectó audio del micrófono. Verifica permisos de micrófono."; draw(); };
          rec.start();
        };
      }

      if (skill === "grammar" && cur) {
        document.getElementById("gr-nxt").onclick = () => { idx++; feedback = ""; draw(); };
        shell.querySelectorAll(".gr-opt").forEach(b => b.onclick = () => {
          const ch = Number(b.getAttribute("data-gi"));
          if (ch === cur.c) { feedback = `✅ ¡Correcto! (+10 XP) ${cur.e}`; if (ganarXP) ganarXP(10); }
          else feedback = `❌ Clave correcta: ${cur.o[cur.c]}. ${cur.e}`;
          draw();
        });
      }

      if (skill === "writing" && cur) {
        document.getElementById("wr-f").onsubmit = (e) => {
          e.preventDefault();
          writingText = document.getElementById("wr-txt").value.trim();
          const ev = evaluarWriting(writingText, cur.req, cur.minWords);
          feedback = `📊 Calificación Writing: <b>${ev.score}/100</b> • Palabras: ${ev.wordCount} ${ev.missing.length ? `• Te faltó incluir: <b>${ev.missing.join(", ")}</b>` : "• ✅ Vocabulario clave completo"} ${ev.hasPunct ? "• ✅ Puntuación final correcta" : "• 💡 Termina con punto final."}`;
          if (ev.score >= 70 && ganarXP) ganarXP(15);
          draw();
        };
      }
    }
    draw();
  };
})();