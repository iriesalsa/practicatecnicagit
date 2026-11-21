import React from "react";

export function ItemVisual({ tipo = "senderismo", titulo = "Ilustracion del ejercicio" }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <svg
        viewBox="0 0 800 320"
        className="h-44 w-full object-cover sm:h-56"
        role="img"
        aria-label={titulo}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <rect width="800" height="320" fill="url(#skyGrad)" />
        <polygon points="0,320 220,120 420,320" fill="#1e293b" opacity="0.85" />
        <polygon points="320,320 560,95 800,320" fill="#334155" opacity="0.9" />
        <circle cx="650" cy="75" r="34" fill="#fbbf24" opacity="0.9" />
        <rect x="40" y="248" width="720" height="8" rx="4" fill="url(#accentGrad)" />
        <text
          x="40"
          y="56"
          fill="#ffffff"
          fontSize="24"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
        >
          pracTICAtecnica.com — {tipo.toUpperCase()}
        </text>
        <text
          x="40"
          y="290"
          fill="#e2e8f0"
          fontSize="16"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Material didactico interactivo con soporte de audio
        </text>
      </svg>
    </div>
  );
}
