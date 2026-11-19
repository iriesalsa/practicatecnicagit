-- ============================================================================
-- pracTICAtecnica.com — BLINDAJE CIBERSEGURIDAD POSTGRESQL / SUPABASE (v721)
-- Proyecto: practicatecnica-prod (tmvhjmevhnaghwgpsqok)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.institutions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                    TEXT UNIQUE NOT NULL,
    name                    TEXT NOT NULL,
    country_code            TEXT NOT NULL DEFAULT 'CR',
    province                TEXT NOT NULL DEFAULT 'Heredia',
    regional_directorate    TEXT NOT NULL DEFAULT 'Direccion Regional de Educacion de Heredia',
    circuit                 TEXT NOT NULL DEFAULT 'Circuito 02',
    director_name           TEXT NOT NULL DEFAULT '',
    supervisor_name         TEXT NOT NULL DEFAULT '',
    regional_director_name  TEXT NOT NULL DEFAULT '',
    cooperative_name        TEXT NOT NULL DEFAULT 'CoopeConvivir R.L.',
    logo_url                TEXT DEFAULT '',
    logo_mode               TEXT NOT NULL DEFAULT 'custom' CHECK (logo_mode IN ('custom', 'wind_rose', 'mascot', 'none')),
    show_mep_logo           BOOLEAN NOT NULL DEFAULT false,
    is_free_courtesy        BOOLEAN NOT NULL DEFAULT false,
    institution_fee_crc     INTEGER NOT NULL DEFAULT 19900 CHECK (institution_fee_crc >= 0),
    per_student_fee_crc     INTEGER NOT NULL DEFAULT 1000 CHECK (per_student_fee_crc >= 0),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.institutions (code, name, province, regional_directorate, circuit, director_name, cooperative_name, is_free_courtesy, institution_fee_crc, per_student_fee_crc)
VALUES ('CTP-MN-02', 'CTP Mercedes Norte', 'Heredia', 'Direccion Regional de Educacion de Heredia', 'Circuito 02', 'MSc. Laura Ramon Elizondo', 'CoopeConvivir R.L.', true, 0, 0)
ON CONFLICT (code) DO UPDATE SET director_name = 'MSc. Laura Ramon Elizondo', is_free_courtesy = true, institution_fee_crc = 0, per_student_fee_crc = 0, updated_at = now();

CREATE TABLE IF NOT EXISTS public.role_switch_whitelist (
    email               TEXT PRIMARY KEY,
    full_name           TEXT NOT NULL,
    authorized_role     TEXT NOT NULL CHECK (authorized_role IN ('superadmin', 'director')),
    is_vip_beta_tester  BOOLEAN NOT NULL DEFAULT true,
    demo_showcase       BOOLEAN NOT NULL DEFAULT true,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    notes               TEXT DEFAULT '',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.role_switch_whitelist (email, full_name, authorized_role, is_vip_beta_tester, demo_showcase, notes) VALUES
    ('maxi.salsa@gmail.com',            'Ing. Max Salazar Sanchez',   'superadmin', true, true, 'SuperAdmin GICM / BDS Devs'),
    ('max.salazar.sanchez@mep.go.cr',   'Ing. Max Salazar Sanchez',   'superadmin', true, true, 'SuperAdmin MEP'),
    ('ramon.laura@gmail.com',           'MSc. Laura Ramon Elizondo',  'director',   true, true, 'Beta Tester Especial — Directora CTP Mercedes Norte (Gmail)'),
    ('laura.ramon.elizondo@mep.go.cr',  'MSc. Laura Ramon Elizondo',  'director',   true, true, 'Beta Tester Especial — Directora CTP Mercedes Norte (MEP)')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, authorized_role = EXCLUDED.authorized_role, is_vip_beta_tester = true, demo_showcase = true, is_active = true;

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id      UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    email               TEXT NOT NULL CHECK (position('@' in email) > 1),
    secondary_email     TEXT CHECK (secondary_email IS NULL OR position('@' in secondary_email) > 1),
    full_name           TEXT NOT NULL DEFAULT '',
    role                TEXT NOT NULL DEFAULT 'student',
    section_code        TEXT DEFAULT '',
    is_homeroom_teacher BOOLEAN NOT NULL DEFAULT false,
    homeroom_section    TEXT DEFAULT '',
    is_vip_beta_tester  BOOLEAN NOT NULL DEFAULT false,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.pt_current_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $pt_fn$
    SELECT COALESCE((SELECT role FROM public.user_profiles WHERE id = auth.uid() AND is_active = true), 'guest');
$pt_fn$;

CREATE OR REPLACE FUNCTION public.pt_guard_user_profile_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $pt_trg$
DECLARE
    v_wl RECORD;
    v_caller_role TEXT;
BEGIN
    SELECT * INTO v_wl FROM public.role_switch_whitelist
    WHERE lower(email) = lower(NEW.email) AND is_active = true LIMIT 1;

    IF FOUND THEN
        NEW.role := v_wl.authorized_role;
        NEW.full_name := COALESCE(NULLIF(NEW.full_name, ''), v_wl.full_name);
        NEW.is_vip_beta_tester := true;
        IF NEW.institution_id IS NULL THEN
            SELECT id INTO NEW.institution_id FROM public.institutions WHERE code = 'CTP-MN-02' LIMIT 1;
        END IF;
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
        v_caller_role := public.pt_current_role();
        IF v_caller_role NOT IN ('superadmin', 'director') THEN
            RAISE EXCEPTION 'Ciberseguridad RBAC: prohibida la auto-escalada de rol (% -> %).', OLD.role, NEW.role;
        END IF;
        IF v_caller_role = 'director' AND NEW.role = 'superadmin' THEN
            RAISE EXCEPTION 'Ciberseguridad RBAC: una direccion no puede asignar rol superadmin.';
        END IF;
    END IF;

    IF TG_OP = 'INSERT' AND NEW.role IN ('superadmin', 'director') THEN
        NEW.role := 'student';
    END IF;

    RETURN NEW;
END
$pt_trg$;

DROP TRIGGER IF EXISTS trg_pt_guard_profile ON public.user_profiles;
CREATE TRIGGER trg_pt_guard_profile BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.pt_guard_user_profile_security();

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL,
    target_ref  TEXT DEFAULT '',
    details     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reac_conduct_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    section_code        TEXT NOT NULL,
    homeroom_teacher_id UUID NOT NULL REFERENCES public.user_profiles(id),
    period_number       SMALLINT NOT NULL DEFAULT 1 CHECK (period_number IN (1, 2)),
    conduct_score       INTEGER NOT NULL DEFAULT 100 CHECK (conduct_score BETWEEN 1 AND 100),
    observations        TEXT NOT NULL DEFAULT '',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_wallets (
    user_id             UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    institution_id      UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    comedor_balance_crc INTEGER NOT NULL DEFAULT 0 CHECK (comedor_balance_crc >= 0),
    eco_colones_balance INTEGER NOT NULL DEFAULT 0 CHECK (eco_colones_balance >= 0),
    plastic_kg_recycled NUMERIC(8,2) NOT NULL DEFAULT 0,
    paper_kg_recycled   NUMERIC(8,2) NOT NULL DEFAULT 0,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exit_permits (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id          UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id              UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    guardian_name           TEXT NOT NULL,
    reason_category         TEXT NOT NULL CHECK (reason_category IN ('cita_medica', 'institucion_estado', 'viaje', 'motivo_personal')),
    reason_detail           TEXT NOT NULL,
    liability_waiver_signed BOOLEAN NOT NULL DEFAULT false,
    status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'used_at_gate')),
    qr_token_sha256         TEXT UNIQUE NOT NULL,
    valid_until             TIMESTAMPTZ NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.question_bank_v700 (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_domain   TEXT NOT NULL CHECK (curriculum_domain IN ('primaria', 'secundaria_academica', 'secundaria_tecnica', 'nocturna_cindea_ipec', 'universidad', 'mopt_vial', 'efemerides')),
    specialty_id        TEXT NOT NULL,
    difficulty          TEXT NOT NULL CHECK (difficulty IN ('basico', 'medio', 'intermedio', 'avanzado')),
    stem                TEXT NOT NULL,
    options_json        JSONB NOT NULL,
    correct_index       SMALLINT NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    author_id           UUID REFERENCES public.user_profiles(id),
    is_validated        BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.institutions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions          FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.role_switch_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_switch_whitelist FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles         FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs   FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.reac_conduct_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reac_conduct_records  FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.student_wallets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_wallets       FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.exit_permits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exit_permits          FORCE  ROW LEVEL SECURITY;
ALTER TABLE public.question_bank_v700    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank_v700    FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_insert_auth" ON public.security_audit_logs;
CREATE POLICY "audit_insert_auth" ON public.security_audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "audit_select_admins" ON public.security_audit_logs;
CREATE POLICY "audit_select_admins" ON public.security_audit_logs FOR SELECT USING (public.pt_current_role() IN ('superadmin', 'director'));

DROP POLICY IF EXISTS "wl_read_own_or_admin" ON public.role_switch_whitelist;
CREATE POLICY "wl_read_own_or_admin" ON public.role_switch_whitelist FOR SELECT USING (
    public.pt_current_role() = 'superadmin' OR lower(email) = lower(auth.jwt() ->> 'email')
);

DROP POLICY IF EXISTS "qb_v700_read" ON public.question_bank_v700;
CREATE POLICY "qb_v700_read" ON public.question_bank_v700 FOR SELECT USING (is_validated = true);

DROP POLICY IF EXISTS "qb_v700_write_staff_only" ON public.question_bank_v700;
CREATE POLICY "qb_v700_write_staff_only" ON public.question_bank_v700 FOR INSERT WITH CHECK (
    public.pt_current_role() IN ('teacher', 'asistente_direccion', 'subdirector', 'director', 'superadmin')
);

DROP POLICY IF EXISTS "conduct_write_homeroom_only" ON public.reac_conduct_records;
CREATE POLICY "conduct_write_homeroom_only" ON public.reac_conduct_records FOR ALL USING (
    public.pt_current_role() IN ('superadmin', 'director', 'subdirector')
    OR EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.is_homeroom_teacher = true AND up.homeroom_section = reac_conduct_records.section_code
    )
);