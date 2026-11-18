import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function RoleManager({ session }) {
  const [currentRole, setCurrentRole] = useState('estudiante');

  // Determinar rol inicial basado en metadatos o correo
  useEffect(() => {
    if (session?.user) {
      const metadataRole = session.user.user_metadata?.role;
      if (metadataRole) {
        setCurrentRole(metadataRole);
      }
    }
  }, [session]);

  const handleSignOut = async () => {
    // Limpieza profunda de almacenamiento local de Supabase y sesión
    localStorage.clear();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 my-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img 
          src={session?.user?.user_metadata?.avatar_url || "/lumi-owl.svg"} 
          alt="Avatar" 
          className="w-12 h-12 rounded-full border-2 border-cyan-500 object-cover" 
        />
        <div>
          <h3 className="font-bold text-slate-100">
            ¡Hola, {session?.user?.user_metadata?.full_name || session?.user?.email}!
          </h3>
          <p className="text-xs text-cyan-400 capitalize">
            Rol Activo: <span className="font-semibold px-2 py-0.5 bg-cyan-950 border border-cyan-800 rounded">{currentRole}</span>
          </p>
        </div>
      </div>

      {/* Selector de Rol Dinámico (Simulador / Selector Institucional) */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <label className="text-xs text-slate-400 font-medium">Cambiar Vista:</label>
        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
        >
          <option value="estudiante">Estudiante</option>
          <option value="padre">Padre / Madre de Familia</option>
          <option value="docente">Docente</option>
          <option value="director">Director / Directora</option>
          <option value="superadmin">SuperAdmin Global</option>
        </select>
      </div>

      {/* Botón de Cerrar Sesión Real y Definitivo */}
      <button
        onClick={handleSignOut}
        className="w-full md:w-auto bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar Sesión
      </button>
    </div>
  );
}
