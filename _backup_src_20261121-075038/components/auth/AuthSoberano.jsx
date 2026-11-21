import React, { useState, useEffect } from 'react';

export default function AuthSoberano({ onLoginSuccess, onLogout }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Estudiante');
  const [verClave, setVerClave] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    const n = parseInt(localStorage.getItem('pt_lock_count') || '0', 10);
    if (n >= 5) { setIntentos(n); setBloqueado(true); }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bloqueado) return;
    if (modo === 'recuperar') {
      setAviso('Instrucciones de restablecimiento enviadas a ' + email);
      return;
    }
    if (!email.includes('@') || password.length < 6) {
      const next = intentos + 1;
      setIntentos(next);
      localStorage.setItem('pt_lock_count', String(next));
      if (next >= 5) {
        setBloqueado(true);
        setAviso('Cuenta bloqueada por 5 intentos fallidos. Contacte al SuperAdmin: 6090-6359.');
      } else {
        setAviso('Credenciales inválidas. Intento ' + next + ' de 5.');
      }
      return;
    }
    localStorage.setItem('pt_lock_count', '0');
    if (onLoginSuccess) onLoginSuccess({ email, rol });
  };

  return (
    <div className="min-h-screen bg-[#06101e] flex items-center justify-center p-4 text-white">
      <div className="bg-[#0b192c] border border-cyan-500/30 rounded-2xl shadow-2xl p-7 max-w-md w-full">
        <div className="flex flex-col items-center mb-5">
          <div className="w-16 h-16 rounded-full bg-[#071324] border-2 border-cyan-400 flex items-center justify-center mb-2">
            <svg viewBox="0 0 64 64" className="w-11 h-11">
              <circle cx="32" cy="32" r="30" fill="#0a192f" />
              <path d="M14 18 L28 24 L18 28 Z" fill="#2dd4bf" />
              <path d="M50 18 L36 24 L46 28 Z" fill="#2dd4bf" />
              <circle cx="23" cy="34" r="9" fill="#2dd4bf" />
              <circle cx="41" cy="34" r="9" fill="#2dd4bf" />
              <circle cx="23" cy="34" r="5" fill="#06101e" />
              <circle cx="41" cy="34" r="5" fill="#06101e" />
              <polygon points="32,38 28,46 32,52 36,46" fill="#2dd4bf" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold">prac<span className="text-cyan-400">TICA</span>tecnica.com</h1>
          <p className="text-xs text-cyan-300/80">CTP Mercedes Norte • Portal de Identidad Protegido</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#071220] p-1 rounded-xl mb-4">
          <button type="button" onClick={() => { setModo('login'); setAviso(''); }} className={`py-2 text-xs font-bold rounded-lg ${modo === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}>Iniciar Sesión</button>
          <button type="button" onClick={() => { setModo('recuperar'); setAviso(''); }} className={`py-2 text-xs font-bold rounded-lg ${modo === 'recuperar' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}>Recuperar Clave</button>
        </div>

        {aviso && <div className="p-3 rounded-xl text-xs bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 mb-4">{aviso}</div>}

        {bloqueado ? (
          <div className="bg-red-950/80 border border-red-500 rounded-xl p-4 text-center space-y-3">
            <p className="text-xs font-bold text-red-300">ACCESO BLOQUEADO (MÁXIMO 5 INTENTOS)</p>
            <a href="https://wa.me/50660906359" target="_blank" rel="noreferrer" className="block w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg">Soporte Oficial SuperAdmin: 6090-6359</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Correo Institucional o Gmail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@est.mep.go.cr" autoComplete="off" required className="w-full bg-[#112236] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
            </div>
            {modo === 'login' && (
              <>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Rol Institucional (RBAC)</label>
                  <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full bg-[#112236] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white">
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente MEP">Docente MEP</option>
                    <option value="Padre/Madre">Padre / Madre</option>
                    <option value="Auxiliar">Auxiliar</option>
                    <option value="Jefatura">Jefatura / Dirección</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Contraseña</label>
                  <div className="relative">
                    <input type={verClave ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña segura" autoComplete="new-password" required className="w-full bg-[#112236] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white" />
                    <button type="button" onClick={() => setVerClave(!verClave)} className="absolute right-3 top-2.5 text-xs text-cyan-400">{verClave ? 'Ocultar' : 'Ver'}</button>
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-sm">
              {modo === 'login' ? 'Ingresar a la Plataforma' : 'Enviar Enlace de Recuperación'}
            </button>
            <button type="button" onClick={() => onLoginSuccess && onLoginSuccess({ email: 'oauth@google.com', rol })} className="w-full py-2.5 bg-white text-slate-900 font-bold rounded-xl text-xs">
              Continuar con Google OAuth
            </button>
          </form>
        )}
      </div>
    </div>
  );
}