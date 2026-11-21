import React from "react";

export function BuhoAzulCircular({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="B\u00faho Azul Circular pracTICAtecnica.com">
      <defs>
        <radialGradient id="bdsOwlReactD2" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="65%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      <circle cx="64" cy="64" r="60" fill="url(#bdsOwlReactD2)" stroke="#93c5fd" strokeWidth="4" />
      <path d="M24 44 Q42 26 64 42 Q86 26 104 44" fill="none" stroke="#dbeafe" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="63" r="18" fill="#ffffff" />
      <circle cx="84" cy="63" r="18" fill="#ffffff" />
      <circle cx="46" cy="63" r="9" fill="#0f172a" />
      <circle cx="82" cy="63" r="9" fill="#0f172a" />
      <circle cx="49" cy="59" r="3.2" fill="#ffffff" />
      <circle cx="85" cy="59" r="3.2" fill="#ffffff" />
      <polygon points="64,73 55,87 73,87" fill="#f59e0b" stroke="#fde68a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}