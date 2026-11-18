import React from 'react';
import LoginGate from './components/LoginGate';

export default function App() {
  return (
    <LoginGate>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Encabezado Institucional */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/lumi-owl.svg" alt="Lumi Búho" className="w-14 h-14 animate-pulse" />
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-wide">practicatecnica.com</h1>
              <p className="text-sm text-cyan-400 font-medium">CTP Mercedes Norte • Cursos, Simuladores y Registros</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs text-slate-300 font-semibold">Sistema Activo & Seguro (Supabase)</span>
          </div>
        </div>

        {/* Panel de Bienvenida y Roles */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-2">¡Bienvenido al Ecosistema CTP!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Selecciona una herramienta o accede a tus simuladores de examen y registros institucionales con tu cuenta autorizada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-cyan-500 transition cursor-pointer">
              <h3 className="font-bold text-cyan-400 mb-1">Simuladores UCR / TEC</h3>
              <p className="text-xs text-slate-400">Pruebas de admisión y prácticas guiadas para estudiantes.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-cyan-500 transition cursor-pointer">
              <h3 className="font-bold text-cyan-400 mb-1">Permisos y Tardías</h3>
              <p className="text-xs text-slate-400">Control administrativo y gestión directa con Dirección.</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl hover:border-cyan-500 transition cursor-pointer">
              <h3 className="font-bold text-cyan-400 mb-1">Registros MEP CSV</h3>
              <p className="text-xs text-slate-400">Exportación de notas y plantillas oficiales para docentes.</p>
            </div>
          </div>
        </div>

      </div>
    </LoginGate>
  );
}
