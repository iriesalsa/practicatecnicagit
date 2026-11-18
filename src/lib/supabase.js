import { createClient } from '@supabase/supabase-js'

// Variables de entorno o credenciales inyectadas del proyecto
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://tu-proyecto.supabase.co"
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "tu-anon-key"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
})
