-- ============================================================================
-- pracTICA (pracTICAtecnica.com) — Esquema Maestro Odín 2.0 (v202.0)
-- Matrícula Digital + Validación Encargado Legal + Conducta REA + Notas SEA
-- 100% Idempotente • Cero DROP • Compatible con RLS y Offline-First
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabla maestra de sincronización Offline-First
CREATE TABLE IF NOT EXISTS public.pt_cloud_sync (
  sync_key TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT NOT NULL DEFAULT 'system',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Matrícula Digital y Documentos validados por Padre/Madre/Encargado Legal (QR SHA-256)
CREATE TABLE IF NOT EXISTS public.pt_matricula_digital (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  anio_lectivo INTEGER NOT NULL DEFAULT 2027,
  estudiante_nombre TEXT NOT NULL,
  estudiante_cedula TEXT NOT NULL,
  estudiante_email TEXT NOT NULL,
  seccion TEXT NOT NULL,
  especialidad TEXT NOT NULL DEFAULT 'General',
  encargado_nombre TEXT NOT NULL,
  encargado_cedula TEXT NOT NULL,
  encargado_email TEXT NOT NULL,
  encargado_telefono TEXT DEFAULT '',
  documentos JSONB NOT NULL DEFAULT '[]'::jsonb,
  validado_encargado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_validacion_encargado TIMESTAMPTZ,
  qr_sha256 TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'PENDIENTE_ENCARGADO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seguimiento de Conducta según REA (Base 100 pts + Boletas QR + Firma Encargado)
CREATE TABLE IF NOT EXISTS public.pt_conducta_rea (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  anio_lectivo INTEGER NOT NULL DEFAULT 2027,
  periodo TEXT NOT NULL DEFAULT 'I Semestre',
  estudiante_email TEXT NOT NULL,
  estudiante_nombre TEXT NOT NULL,
  seccion TEXT NOT NULL,
  categoria_rea TEXT NOT NULL,
  puntos_rebajo INTEGER NOT NULL DEFAULT 0,
  descripcion TEXT NOT NULL,
  reportado_por TEXT NOT NULL,
  rol_reportante TEXT NOT NULL DEFAULT 'Docente Guía',
  asignatura TEXT DEFAULT 'Guía / General',
  enterado_encargado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_enterado TIMESTAMPTZ,
  qr_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Calificaciones compatibles con SEA (Docente Guía vs Docente de Asignatura)
CREATE TABLE IF NOT EXISTS public.pt_notas_sea (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  anio_lectivo INTEGER NOT NULL DEFAULT 2027,
  periodo TEXT NOT NULL DEFAULT 'I Semestre',
  seccion TEXT NOT NULL,
  asignatura TEXT NOT NULL,
  docente_email TEXT NOT NULL,
  tipo_docente TEXT NOT NULL DEFAULT 'Docente de Asignatura',
  estudiante_email TEXT NOT NULL,
  estudiante_nombre TEXT NOT NULL,
  cotidiano NUMERIC(5,2) DEFAULT 0,
  tareas NUMERIC(5,2) DEFAULT 0,
  pruebas NUMERIC(5,2) DEFAULT 0,
  proyecto NUMERIC(5,2) DEFAULT 0,
  asistencia NUMERIC(5,2) DEFAULT 10,
  conducta_rea NUMERIC(5,2) DEFAULT 100,
  nota_final NUMERIC(5,2) DEFAULT 0,
  qr_sha256 TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_mat_est ON public.pt_matricula_digital(anio_lectivo, seccion, estudiante_email);
CREATE INDEX IF NOT EXISTS idx_pt_mat_enc ON public.pt_matricula_digital(encargado_email);
CREATE INDEX IF NOT EXISTS idx_pt_cond_est ON public.pt_conducta_rea(anio_lectivo, seccion, estudiante_email);
CREATE INDEX IF NOT EXISTS idx_pt_sea_sec ON public.pt_notas_sea(anio_lectivo, seccion, asignatura);

ALTER TABLE public.pt_cloud_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_matricula_digital ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_conducta_rea ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_notas_sea ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_cloud_sync' AND policyname='pt_sync_all_v202') THEN
    CREATE POLICY "pt_sync_all_v202" ON public.pt_cloud_sync FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_matricula_digital' AND policyname='pt_mat_all_v202') THEN
    CREATE POLICY "pt_mat_all_v202" ON public.pt_matricula_digital FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_conducta_rea' AND policyname='pt_cond_all_v202') THEN
    CREATE POLICY "pt_cond_all_v202" ON public.pt_conducta_rea FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_notas_sea' AND policyname='pt_sea_all_v202') THEN
    CREATE POLICY "pt_sea_all_v202" ON public.pt_notas_sea FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;