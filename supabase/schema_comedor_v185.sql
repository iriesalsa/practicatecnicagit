-- ============================================================================
-- pracTICAtecnica.com — Esquema Comedor Escolar MEP / PANEA (v185.0)
-- Compatible 100% con pt_profiles y get_pt_role() • Cero comandos DROP
-- Decreto Ejecutivo N.° 44940-MEP (PANEA) • Circular DVM-A-01-2018
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Configuración multi-institución (Junta Administrativa / Educación, SINPE, tarifas, horarios)
CREATE TABLE IF NOT EXISTS public.cafeteria_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT UNIQUE NOT NULL,
  junta_type TEXT NOT NULL DEFAULT 'Junta Administrativa'
    CHECK (junta_type IN ('Junta Administrativa','Junta de Educación')),
  junta_name TEXT NOT NULL,
  sinpe_phone TEXT NOT NULL,
  student_price_crc NUMERIC(10,2) NOT NULL DEFAULT 1000,
  staff_price_crc NUMERIC(10,2) NOT NULL DEFAULT 1800,
  active_menu_week TEXT NOT NULL DEFAULT 'A' CHECK (active_menu_week IN ('A','B','C','D','E')),
  meal_schedules JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Monedero QR y condición de beca PANEA por usuario
CREATE TABLE IF NOT EXISTS public.cafeteria_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_label TEXT NOT NULL DEFAULT 'Estudiante',
  section_code TEXT,
  qr_code TEXT UNIQUE NOT NULL,
  has_panea_scholarship BOOLEAN NOT NULL DEFAULT FALSE,
  ticket_balance INT NOT NULL DEFAULT 0 CHECK (ticket_balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Compras de tiquetes (SINPE Móvil a la Junta o Efectivo en ventanilla)
CREATE TABLE IF NOT EXISTS public.cafeteria_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_code TEXT UNIQUE NOT NULL,
  wallet_id UUID NOT NULL REFERENCES public.cafeteria_wallets(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('SINPE','EFECTIVO')),
  ticket_qty INT NOT NULL CHECK (ticket_qty > 0),
  unit_price_crc NUMERIC(10,2) NOT NULL,
  total_crc NUMERIC(10,2) NOT NULL,
  sinpe_reference TEXT,
  status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE','APROBADO','RECHAZADO')),
  approved_by UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  receipt_hash_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Registro diario de consumos (control anti-duplicado por día y tiempo de comida)
CREATE TABLE IF NOT EXISTS public.cafeteria_consumption_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.cafeteria_wallets(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_shift TEXT NOT NULL CHECK (meal_shift IN ('desayuno','comp_manana','almuerzo','comp_tarde','cena')),
  access_type TEXT NOT NULL CHECK (access_type IN ('BECA_PANEA','TIQUETE_ESTUDIANTE','TIQUETE_DOCENTE','EFECTIVO_VENTANILLA','PASE_EQUIDAD','EXCEPCION_DIRECCION')),
  charged_crc NUMERIC(10,2) NOT NULL DEFAULT 0,
  operator_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  audit_hash_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Menús rotativos oficiales MEP (Semanas A, B, C, D y E)
CREATE TABLE IF NOT EXISTS public.cafeteria_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  week_code TEXT NOT NULL CHECK (week_code IN ('A','B','C','D','E')),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Lunes','Martes','Miércoles','Jueves','Viernes')),
  breakfast TEXT NOT NULL DEFAULT '',
  complement TEXT NOT NULL DEFAULT '',
  lunch TEXT NOT NULL DEFAULT '',
  dinner TEXT NOT NULL DEFAULT '',
  allergens TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(institution_name, week_code, day_of_week)
);

-- Índices de lectura ultrarrápida en fila de comedor
CREATE INDEX IF NOT EXISTS idx_caf_wallets_qr ON public.cafeteria_wallets(qr_code);
CREATE INDEX IF NOT EXISTS idx_caf_wallets_email ON public.cafeteria_wallets(email);
CREATE INDEX IF NOT EXISTS idx_caf_logs_day_shift ON public.cafeteria_consumption_logs(service_date, meal_shift, wallet_id);
CREATE INDEX IF NOT EXISTS idx_caf_trx_status ON public.cafeteria_transactions(status, created_at DESC);

-- Activar Row Level Security (RLS)
ALTER TABLE public.cafeteria_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_consumption_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_menus ENABLE ROW LEVEL SECURITY;

-- Políticas idempotentes (cero DROP)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_config' AND policyname='caf_cfg_read') THEN
    CREATE POLICY "caf_cfg_read" ON public.cafeteria_config FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_config' AND policyname='caf_cfg_write') THEN
    CREATE POLICY "caf_cfg_write" ON public.cafeteria_config FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_wallets' AND policyname='caf_wlt_read') THEN
    CREATE POLICY "caf_wlt_read" ON public.cafeteria_wallets FOR SELECT
      USING (auth.uid() = profile_id OR public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_wallets' AND policyname='caf_wlt_write') THEN
    CREATE POLICY "caf_wlt_write" ON public.cafeteria_wallets FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_transactions' AND policyname='caf_trx_read') THEN
    CREATE POLICY "caf_trx_read" ON public.cafeteria_transactions FOR SELECT
      USING (
        public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar')
        OR EXISTS (SELECT 1 FROM public.cafeteria_wallets w WHERE w.id = cafeteria_transactions.wallet_id AND w.profile_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_transactions' AND policyname='caf_trx_insert_sinpe') THEN
    CREATE POLICY "caf_trx_insert_sinpe" ON public.cafeteria_transactions FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_transactions' AND policyname='caf_trx_approve') THEN
    CREATE POLICY "caf_trx_approve" ON public.cafeteria_transactions FOR UPDATE
      USING (public.get_pt_role() IN ('SuperAdmin','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Auxiliar'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_consumption_logs' AND policyname='caf_logs_read') THEN
    CREATE POLICY "caf_logs_read" ON public.cafeteria_consumption_logs FOR SELECT
      USING (
        public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar')
        OR EXISTS (SELECT 1 FROM public.cafeteria_wallets w WHERE w.id = cafeteria_consumption_logs.wallet_id AND w.profile_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_consumption_logs' AND policyname='caf_logs_write') THEN
    CREATE POLICY "caf_logs_write" ON public.cafeteria_consumption_logs FOR INSERT
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_menus' AND policyname='caf_menus_read') THEN
    CREATE POLICY "caf_menus_read" ON public.cafeteria_menus FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='cafeteria_menus' AND policyname='caf_menus_write') THEN
    CREATE POLICY "caf_menus_write" ON public.cafeteria_menus FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;
END $$;