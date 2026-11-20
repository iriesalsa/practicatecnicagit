(function () {
  const MODEL_KEY = "bds_free_ai_model_v216";

  // Modelos / perfiles gratuitos configurables con respaldo automático entre opciones
  const MODELOS_GRATUITOS = [
    { id: "local-rules-pro", nombre: "Motor Local Gratuito (Reglas + Plantillas)", tipo: "local", endpoint: "" },
    { id: "pollinations-text", nombre: "Pollinations Texto Gratuito (Sin Key)", tipo: "pollinations", endpoint: "https://text.pollinations.ai/" },
    { id: "openrouter-free-auto", nombre: "OpenRouter Free Router (Con Key Gratuita Opcional)", tipo: "openrouter", endpoint: "https://openrouter.ai/api/v1/chat/completions" },
    { id: "huggingface-free", nombre: "HuggingFace Inference Free (Con Key Gratuita Opcional)", tipo: "hf", endpoint: "https://api-inference.huggingface.co/" }
  ];

  const DESTINATARIOS_CORDIALES = {
    jefatura: {
      etiqueta: "Jefatura / Dirección / Subdirección / Asistente",
      saludo: "Estimada jefatura y equipo directivo,",
      cierre: "Agradecemos de antemano su valiosa guía, acompañamiento y pronta atención. Quedamos a su entera disposición."
    },
    personal: {
      etiqueta: "Personal Docente y Administrativo",
      saludo: "Estimado equipo docente y administrativo,",
      cierre: "Les agradecemos su compromiso diario con el estudiantado y la comunidad educativa. ¡Muchas gracias por su apoyo!"
    },
    familia: {
      etiqueta: "Padre / Madre / Persona Encargada Legal",
      saludo: "Estimada familia / persona encargada legal,",
      cierre: "Agradecemos profundamente su acompañamiento y confianza. Trabajando juntos apoyamos el bienestar y el aprendizaje de su hijo(a)."
    }
  };

  function getModeloActivo() {
    const id = localStorage.getItem(MODEL_KEY) || MODELOS_GRATUITOS[0].id;
    return MODELOS_GRATUITOS.find(m => m.id === id) || MODELOS_GRATUITOS[0];
  }

  function setModeloActivo(id) {
    const m = MODELOS_GRATUITOS.find(x => x.id === id) || MODELOS_GRATUITOS[0];
    localStorage.setItem(MODEL_KEY, m.id);
    return m;
  }

  function redactarMensajeCordial(destKey, tema, contexto) {
    const d = DESTINATARIOS_CORDIALES[destKey] || DESTINATARIOS_CORDIALES.familia;
    const t = String(tema || "Seguimiento y coordinación").trim();
    const ctx = String(contexto || "Compartimos información relevante con respeto, claridad y ánimo constructivo.").trim();
    return `${d.saludo}\n\nAsunto: ${t}.\n\n${ctx}\n\n${d.cierre}\n\nCon aprecio,\npracTICAtecnica.com`;
  }

  // Intenta usar modelo gratuito remoto si está seleccionado y hay red; si falla o es local, responde al instante sin error
  async function generarConRespaldoGratuito(destKey, tema, contexto, freeApiKey) {
    const borrador = redactarMensajeCordial(destKey, tema, contexto);
    const modelo = getModeloActivo();

    if (modelo.tipo === "pollinations" && typeof fetch === "function") {
      try {
        const prompt = encodeURIComponent(`Redacta de forma cordial, respetuosa y clara en español (sin groserías ni tecnicismos innecesarios) un mensaje para ${DESTINATARIOS_CORDIALES[destKey]?.etiqueta || "la comunidad educativa"} sobre "${tema}". Contexto: ${contexto}`);
        const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), 3500) : null;
        const res = await fetch(`${modelo.endpoint}${prompt}`, ctrl ? { signal: ctrl.signal } : {});
        if (timer) clearTimeout(timer);
        if (res && res.ok) {
          const txt = (await res.text() || "").trim();
          if (txt && txt.length > 15 && txt.length < 2500) {
            return { texto: txt, modeloUsado: modelo.nombre, fallback: false };
          }
        }
      } catch {}
    }

    if ((modelo.tipo === "openrouter" || modelo.tipo === "hf") && freeApiKey && typeof fetch === "function") {
      try {
        if (modelo.tipo === "openrouter") {
          const res = await fetch(modelo.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${freeApiKey}` },
            body: JSON.stringify({
              model: "openrouter/free",
              messages: [{ role: "user", content: `Redacta un mensaje cordial en español para ${DESTINATARIOS_CORDIALES[destKey]?.etiqueta || "comunidad educativa"}. Tema: ${tema}. Detalle: ${contexto}` }]
            })
          });
          if (res && res.ok) {
            const j = await res.json();
            const content = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
            if (content) return { texto: String(content).trim(), modeloUsado: modelo.nombre, fallback: false };
          }
        }
      } catch {}
    }

    return {
      texto: borrador,
      modeloUsado: `${modelo.nombre} (Respaldo automático activo)`,
      fallback: modelo.tipo !== "local"
    };
  }

  function injectCordialAssistant() {
    if (typeof document === "undefined" || !document.body) return;
    const shell = document.getElementById("bds-shell");
    if (!shell || document.getElementById("bds-cordial-ai-box")) return;
    const isOrientacion = /orientación|orientacion|reac/i.test(shell.innerText || "");
    if (!isOrientacion) return;

    const firstCard = shell.querySelector(".bds-card");
    if (!firstCard) return;

    const modAct = getModeloActivo();
    const box = document.createElement("div");
    box.id = "bds-cordial-ai-box";
    box.style.cssText = "background:#070d19;border:1px solid #0284c7;border-radius:11px;padding:12px;margin-bottom:12px;font-size:12px;";
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        <b style="color:#38bdf8;font-size:13px;">🕊️ Redactor Cordial (Jefatura, Personal y Familia) • IA Gratuita con Respaldo</b>
        <select id="bds-ai-mod-sel" style="background:#0b1322;color:#34d399;border:1px solid #334155;padding:5px 8px;border-radius:7px;font-size:11px;font-weight:700;">
          ${MODELOS_GRATUITOS.map(m => `<option value="${m.id}" ${modAct.id===m.id?"selected":""}>${m.nombre}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:7px;margin-bottom:8px;">
        <select id="bds-crd-dest" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;">
          ${Object.entries(DESTINATARIOS_CORDIALES).map(([k, v]) => `<option value="${k}">${v.etiqueta}</option>`).join("")}
        </select>
        <input id="bds-crd-tema" type="text" value="Acompañamiento y seguimiento cordial" placeholder="Tema del mensaje" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
        <input id="bds-crd-key" type="password" placeholder="API Key gratuita opcional (si aplica)" style="background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;"/>
      </div>
      <textarea id="bds-crd-ctx" rows="2" placeholder="Escribe los puntos clave que deseas comunicar con amabilidad..." style="width:100%;background:#0b1322;color:#fff;border:1px solid #334155;padding:7px;border-radius:7px;font-size:11.5px;margin-bottom:8px;"></textarea>
      <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;">
        <button type="button" id="bds-crd-gen" style="background:#059669;color:#fff;border:none;padding:7px 12px;border-radius:7px;font-size:11.5px;font-weight:800;cursor:pointer;">✨ Redactar Cordialmente</button>
        <button type="button" id="bds-crd-cpy" style="background:#1d4ed8;color:#fff;border:none;padding:7px 11px;border-radius:7px;font-size:11.5px;font-weight:700;cursor:pointer;">📋 Copiar</button>
        <span id="bds-crd-st" style="font-size:10.5px;color:#94a3b8;">Modelo: ${modAct.nombre}</span>
      </div>
      <textarea id="bds-crd-out" rows="4" style="width:100%;margin-top:8px;background:#0b1322;color:#e2e8f0;border:1px solid #334155;padding:8px;border-radius:7px;font-size:11.5px;">${redactarMensajeCordial("familia", "Acompañamiento y seguimiento cordial", "Le compartimos con aprecio el avance de su estudiante y quedamos a su disposición.")}</textarea>
    `;

    firstCard.insertBefore(box, firstCard.children[1] || null);
    document.getElementById("bds-ai-mod-sel").onchange = (e) => {
      const m = setModeloActivo(e.target.value);
      document.getElementById("bds-crd-st").innerText = `Modelo: ${m.nombre}`;
    };
    document.getElementById("bds-crd-gen").onclick = async () => {
      const stEl = document.getElementById("bds-crd-st");
      if (stEl) stEl.innerText = "⏳ Redactando con respaldo gratuito...";
      const res = await generarConRespaldoGratuito(
        document.getElementById("bds-crd-dest").value,
        document.getElementById("bds-crd-tema").value,
        document.getElementById("bds-crd-ctx").value,
        document.getElementById("bds-crd-key").value.trim()
      );
      const outEl = document.getElementById("bds-crd-out");
      if (outEl) outEl.value = res.texto;
      if (stEl) stEl.innerText = `Usado: ${res.modeloUsado}`;
    };
    document.getElementById("bds-crd-cpy").onclick = () => {
      const outEl = document.getElementById("bds-crd-out");
      if (outEl && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outEl.value).catch(() => {});
      }
    };
  }

  window.BDS_IA_MENSAJES_V216 = {
    MODELOS_GRATUITOS, DESTINATARIOS_CORDIALES,
    getModeloActivo, setModeloActivo, redactarMensajeCordial, generarConRespaldoGratuito
  };

  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("DOMContentLoaded", () => {
      if (typeof MutationObserver !== "undefined" && document.body) {
        new MutationObserver(() => injectCordialAssistant()).observe(document.body, { childList: true, subtree: true });
      }
      setTimeout(injectCordialAssistant, 450);
    });
  }
})();