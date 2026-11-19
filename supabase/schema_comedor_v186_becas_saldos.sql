-- ============================================================================
-- pracTICAtecnica.com — Extensión Comedor v186.0 (Saldo Colones + Becas PANEA)
-- Idempotente • Cero DROP • Compatible con schema_comedor_v185.sql
-- ============================================================================

ALTER TABLE public.cafeteria_wallets
  ADD COLUMN IF NOT EXISTS balance_crc NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (balance_crc >= 0);

ALTER TABLE public.cafeteria_wallets
  ADD COLUMN IF NOT EXISTS scholarship_type TEXT NOT NULL DEFAULT 'Sin beca';

ALTER TABLE public.cafeteria_wallets
  ADD COLUMN IF NOT EXISTS scholarship_expires_at DATE;

CREATE TABLE IF NOT EXISTS public.cafeteria_scholarship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  wallet_id UUID REFERENCES public.cafeteria_wallets(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  section_code TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE','APROBADA','RECHAZADA')),
  reviewed_by UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  audit_hash_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_caf_becas_status ON public.cafeteria_scholarship_requests(status, created_at DESC);
ALTER TABLE public.cafeteria_scholarship_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_scholarship_requests' AND policyname='caf_becas_read') THEN
    CREATE POLICY "caf_becas_read" ON public.cafeteria_scholarship_requests FOR SELECT
      USING (auth.uid() IS NOT NULL AND (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar') OR student_email = (SELECT email FROM public.pt_profiles WHERE id = auth.uid() LIMIT 1)));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_scholarship_requests' AND policyname='caf_becas_insert') THEN
    CREATE POLICY "caf_becas_insert" ON public.cafeteria_scholarship_requests FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_scholarship_requests' AND policyname='caf_becas_update') THEN
    CREATE POLICY "caf_becas_update" ON public.cafeteria_scholarship_requests FOR UPDATE
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;
END $$;