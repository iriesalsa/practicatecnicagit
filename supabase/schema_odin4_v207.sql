-- ============================================================================
-- pracTICAtecnica.com — Esquema Maestro Odín 4.0 (v207.0) • Idempotente • Cero DROP
-- Sincronización + Matrícula QR + Conducta REAC + Notas SEA + Orientación REAC + Licencias
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.pt_cloud_sync (
  sync_key TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT NOT NULL DEFAULT 'system',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.pt_orientacion_reac_procesos (
  id TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_informe TEXT NOT NULL,
  estudiante_nombre TEXT NOT NULL,
  estudiante_email TEXT NOT NULL,
  seccion TEXT NOT NULL,
  encargado_email TEXT DEFAULT '',
  emitido_por TEXT NOT NULL,
  rol_emisor TEXT NOT NULL DEFAULT 'Orientador(a)',
  hechos TEXT NOT NULL,
  acuerdos_dua TEXT NOT NULL,
  fundamentos_legales JSONB NOT NULL DEFAULT '[]'::jsonb,
  prioridad TEXT NOT NULL DEFAULT 'PREVENTIVA',
  estado TEXT NOT NULL DEFAULT 'EN_SEGUIMIENTO',
  enterado_familia BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_enterado TIMESTAMPTZ,
  qr_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pt_instituciones_licencias (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Beta 13 días',
  anualidad_crc INTEGER NOT NULL DEFAULT 19100,
  vence TEXT DEFAULT 'Permanente',
  tiene_cooperativa BOOLEAN NOT NULL DEFAULT TRUE,
  nombre_cooperativa TEXT DEFAULT 'Coopeconvivir R.L.',
  estudiantes_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pt_cloud_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_matricula_digital ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_conducta_rea ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_notas_sea ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_orientacion_reac_procesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_instituciones_licencias ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_orientacion_reac_procesos' AND policyname='pt_ori_all_v207') THEN
    CREATE POLICY "pt_ori_all_v207" ON public.pt_orientacion_reac_procesos FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;