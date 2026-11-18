import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Búho */}
          <div className="flex items-center gap-3">
            <img src="/lumi-owl.svg" alt="Lumi" className="w-9 h-9 animate-pulse" />
            <span className="font-bold text-lg text-cyan-400 tracking-wide">practicatecnica.com</span>
          </div>

          {/* Menú de Escritorio (Oculto en celular) */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#inicio" className="hover:text-cyan-400 transition">Inicio</a>
            <a href="#especialidades" className="hover:text-cyan-400 transition">Especialidades</a>
            <a href="#simuladores" className="hover:text-cyan-400 transition">Simuladores</a>
            <a href="#juegos" className="hover:text-cyan-400 transition">Juegos</a>
          </div>

          {/* Botón de Menú Hamburguesa (Visible solo en celular/tablet) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg bg-slate-800"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable Mobile (Se muestra al hacer clic en la hamburguesa) */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <a href="#inicio" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300">Inicio</a>
          <a href="#especialidades" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300">Especialidades</a>
          <a href="#simuladores" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300">Simuladores</a>
          <a href="#juegos" onClick={() => setIsOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300">Juegos</a>
        </div>
      )}
    </nav>
  );
}
