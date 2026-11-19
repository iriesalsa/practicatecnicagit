-- ============================================================================
-- pracTICAtecnica.com — Tabla Maestra de Sincronización en Vivo (v192.0)
-- Idempotente • Cero DROP • Offline-First Multi-Dispositivo
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.pt_cloud_sync (
  sync_key TEXT PRIMARY KEY,
  institution_id TEXT NOT NULL DEFAULT 'INST-001',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT NOT NULL DEFAULT 'system',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_cloud_sync_inst ON public.pt_cloud_sync(institution_id, updated_at DESC);

ALTER TABLE public.pt_cloud_sync ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_cloud_sync' AND policyname='pt_sync_read_all') THEN
    CREATE POLICY "pt_sync_read_all" ON public.pt_cloud_sync FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='pt_cloud_sync' AND policyname='pt_sync_write_all') THEN
    CREATE POLICY "pt_sync_write_all" ON public.pt_cloud_sync FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;