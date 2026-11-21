import React, { useEffect, useRef, useState } from "react";

export function ItemAudioPlayer({ audioSrc, textoAudio, lang = "en-US" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [rate, setRate] = useState(1);

  useEffect(() => {
    stopAll();
    setStatusMsg("");
    return () => stopAll();
  }, [audioSrc, textoAudio]);

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }

  function speakFallback() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatusMsg("Audio no disponible en este navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(textoAudio);
    utter.lang = lang;
    utter.rate = rate;
    utter.onstart = () => {
      setIsPlaying(true);
      setStatusMsg("Reproduciendo audio sintetizado (" + lang + ")");
    };
    utter.onend = () => {
      setIsPlaying(false);
      setStatusMsg("");
    };
    utter.onerror = () => {
      setIsPlaying(false);
      setStatusMsg("No se pudo reproducir el audio.");
    };
    window.speechSynthesis.speak(utter);
  }

  async function handleTogglePlay() {
    if (isPlaying) {
      stopAll();
      return;
    }

    if (audioSrc && audioRef.current) {
      try {
        audioRef.current.playbackRate = rate;
        await audioRef.current.play();
        setIsPlaying(true);
        setStatusMsg("Reproduciendo audio");
        return;
      } catch (_err) {
        speakFallback();
        return;
      }
    }
    speakFallback();
  }

  return (
    <div className="w-full rounded-xl border border-orange-200 bg-orange-50/90 px-4 py-3 shadow-sm">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        onEnded={() => {
          setIsPlaying(false);
          setStatusMsg("");
        }}
        onError={() => {
          setIsPlaying(false);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Detener audio" : "Reproducir audio"}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <span>{isPlaying ? "■" : "▶"}</span>
          <span>{isPlaying ? "Detener" : "Escuchar audio"}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-700">
          <label htmlFor="bds-audio-rate" className="font-medium">Velocidad:</label>
          <select
            id="bds-audio-rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1.0x</option>
            <option value={1.25}>1.25x</option>
          </select>
        </div>
      </div>

      {statusMsg ? (
        <p className="mt-2 text-xs font-medium text-orange-800">{statusMsg}</p>
      ) : null}
    </div>
  );
}
