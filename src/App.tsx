import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'signup'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('¡Registro exitoso! Revisa tu correo o inicia sesión.');
      }
    }
  };

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

  // SI NO HAY SESIÓN: Mostrar Portal de Acceso Independiente (Correo/Contraseña + Google)
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <img src="/lumi-owl.svg" alt="Lumi Búho" className="w-16 h-16 mx-auto mb-3 animate-pulse" />
            <h1 className="text-2xl font-bold text-slate-100">practicatecnica.com</h1>
            <p className="text-xs text-cyan-400 mt-1">Portal Institucional CTP Mercedes Norte</p>
          </div>

          {errorMsg && <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">{errorMsg}</div>}
          {successMsg && <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs rounded-lg">{successMsg}</div>}

          {/* Formulario Correo / Contraseña (Independiente tipo ISPUM) */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Correo Institucional / Personal</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@est.mep.go.cr"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-lg transition"
            >
              {authMode === 'login' ? 'Ingresar al Sistema' : 'Registrar Cuenta'}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
            <button 
              type="button" 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="hover:text-cyan-400 underline"
            >
              {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs">o conéctate con</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Botón de Google Auth de respaldo */}
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
              });
            }}
            className="w-full mt-4 bg-white hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.12 0 9.8 0 12s.43 3.88 1.18 5.39l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Ingresar con Google
          </button>
        </div>
      </div>
    );
  }

  // SI SÍ HAY SESIÓN: Mostrar plataforma con barra superior y botón de cerrar sesión visible
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/lumi-owl.svg" alt="Búho" className="w-8 h-8" />
          <span className="font-bold text-cyan-400">practicatecnica.com</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-300 hidden sm:inline">{session.user.email}</span>
          <button
            onClick={handleSignOut}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">¡Bienvenido al Sistema, {session.user.email}!</h1>
          <p className="text-slate-400 text-sm">Sesión activa e independiente funcionando al 100%.</p>
        </div>
      </main>
    </div>
  );
}
