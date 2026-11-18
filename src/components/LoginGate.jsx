import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginGate({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios de autenticación en tiempo real
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400">
        <img src="/lumi-owl.svg" alt="Lumi Búho" className="w-16 h-16 animate-bounce mb-4" />
        <p className="font-semibold text-lg tracking-wider">Cargando Sistema pracTICAtecnica.com...</p>
      </div>
    );
  }

  // SI NO HAY SESIÓN: Mostrar Pantalla de Acceso Institucional Obligatoria (Bloqueo total)
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <img src="/lumi-owl.svg" alt="Lumi Búho" className="w-20 h-20 mx-auto mb-4 drop-shadow-lg animate-pulse" />
          <h1 className="text-2xl font-bold text-slate-100 mb-2">practicatecnica.com</h1>
          <p className="text-sm text-cyan-400 mb-6">CTP Mercedes Norte • Plataforma Oficial</p>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Acceso restringido. Debe iniciar sesión con su cuenta institucional autorizada de Google para ingresar a los simuladores, registros y herramientas.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
              });
            }}
            className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-3 text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.12 0 9.8 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Ingresar con Google (Institucional)
          </button>
        </div>
      </div>
    );
  }

  // SI SÍ HAY SESIÓN: Renderizar la app completa + Barra Superior con el Botón de Cerrar Sesión VISIBLE y Real
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barra superior flotante de sesión activa y Cerrar Sesión */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <img src={session.user.user_metadata?.avatar_url || "/lumi-owl.svg"} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-500" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            {session.user.user_metadata?.full_name || session.user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido protegido de la aplicación */}
      <main>
        {children}
      </main>
    </div>
  );
}
