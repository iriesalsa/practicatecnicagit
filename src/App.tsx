import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    setSession(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-bold">
        Cargando pracTICAtecnica.com...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barra superior de control de sesión y Cierre de Sesión */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/lumi-owl.svg" alt="Búho" className="w-8 h-8" />
          <span className="font-bold text-cyan-400">practicatecnica.com</span>
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-300 hidden sm:inline">{session.user.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
            className="bg-white text-slate-900 font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-slate-200 transition"
          >
            Ingresar
          </button>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">¡Bienvenido, {session?.user?.user_metadata?.full_name || 'Profesor Max'}!</h1>
          <p className="text-slate-400 text-sm">Sistema institucional activo para CTP Mercedes Norte.</p>
        </div>
      </main>
    </div>
  );
}
