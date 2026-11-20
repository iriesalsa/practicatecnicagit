-- ============================================================================
-- pracTICAtecnica.com — SQL Oficial v229.1 para Supabase SQL Editor
-- Tablas: Plan Familiar ₡1,000, Asistencia Portón Realtime y Tokens Push
-- Cumplimiento: Ley N.° 8968 (PRODHAB) & Ley N.° 7739 (Niñez y Adolescencia)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.bds_familias_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encargado_email TEXT NOT NULL UNIQUE,
  encargado_nombre TEXT NOT NULL,
  plan_nombre TEXT NOT NULL DEFAULT 'Plan Familiar Único ₡1,000/año (Todos los hijos)',
  tarifa_colones INTEGER NOT NULL DEFAULT 1000,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bds_asistencia_porton (
  id TEXT PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA', 'SALIDA')),
  estudiante TEXT NOT NULL,
  carnet TEXT NOT NULL,
  seccion TEXT NOT NULL DEFAULT 'General',
  encargado_email TEXT NOT NULL,
  oficial TEXT NOT NULL DEFAULT 'Personal de Vigilancia / Auxiliar',
  hash_sha256 TEXT NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bds_porton_encargado
  ON public.bds_asistencia_porton (encargado_email, creado_en DESC);

CREATE TABLE IF NOT EXISTS public.bds_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encargado_email TEXT NOT NULL,
  plataforma TEXT NOT NULL CHECK (plataforma IN ('android', 'ios', 'web')),
  token_push TEXT NOT NULL,
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (encargado_email, token_push)
);

-- Activar Row Level Security (RLS)
ALTER TABLE public.bds_familias_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bds_asistencia_porton ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bds_push_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas de privacidad: cada familia solo ve a sus propios hijos/hijas
DROP POLICY IF EXISTS "familia_ver_propio_plan" ON public.bds_familias_plan;
CREATE POLICY "familia_ver_propio_plan" ON public.bds_familias_plan
  FOR SELECT USING (LOWER(encargado_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "familia_ver_sus_marcas" ON public.bds_asistencia_porton;
CREATE POLICY "familia_ver_sus_marcas" ON public.bds_asistencia_porton
  FOR SELECT USING (LOWER(encargado_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));

DROP POLICY IF EXISTS "personal_autorizado_inserta_marca" ON public.bds_asistencia_porton;
CREATE POLICY "personal_autorizado_inserta_marca" ON public.bds_asistencia_porton
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "familia_gestiona_su_token_push" ON public.bds_push_tokens;
CREATE POLICY "familia_gestiona_su_token_push" ON public.bds_push_tokens
  FOR ALL USING (LOWER(encargado_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')))
  WITH CHECK (LOWER(encargado_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));

-- Activar publicación Realtime de Supabase sobre bds_asistencia_porton
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bds_asistencia_porton'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bds_asistencia_porton;
  END IF;
END $$;