-- ============================================================================
-- pracTICAtecnica.com — Esquema Matrícula, Docentes, Horarios y Planes IA v187
-- Idempotente • Cero DROP • Compatible con pt_profiles y get_pt_role()
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_code TEXT UNIQUE NOT NULL,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  student_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  student_email TEXT NOT NULL,
  section_code TEXT NOT NULL,
  specialty TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  documents_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'MATRICULADO',
  qr_hash_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  teacher_name TEXT NOT NULL,
  national_id TEXT NOT NULL,
  teacher_email TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  classroom TEXT NOT NULL DEFAULT 'Aula General',
  qr_hash_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  schedule_grid JSONB NOT NULL,
  blocks_assigned INT NOT NULL DEFAULT 0,
  conflicts_count INT NOT NULL DEFAULT 0,
  qr_hash_sha256 TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  teacher_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  teacher_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  subarea TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  study_unit TEXT NOT NULL,
  topic TEXT NOT NULL,
  plan_payload JSONB NOT NULL,
  qr_hash_sha256 TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lesson_plans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='student_enrollments' AND policyname='enr_admin_all') THEN
    CREATE POLICY "enr_admin_all" ON public.student_enrollments FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='teacher_assignments' AND policyname='tea_read_auth') THEN
    CREATE POLICY "tea_read_auth" ON public.teacher_assignments FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='teacher_assignments' AND policyname='tea_write_admin') THEN
    CREATE POLICY "tea_write_admin" ON public.teacher_assignments FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_schedules' AND policyname='sch_read_auth') THEN
    CREATE POLICY "sch_read_auth" ON public.ai_schedules FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_schedules' AND policyname='sch_write_admin') THEN
    CREATE POLICY "sch_write_admin" ON public.ai_schedules FOR ALL
      USING (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Director','Auxiliar'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_lesson_plans' AND policyname='pln_teacher_all') THEN
    CREATE POLICY "pln_teacher_all" ON public.ai_lesson_plans FOR ALL
      USING (auth.uid() = teacher_id OR public.get_pt_role() IN ('SuperAdmin','Director','Docente'))
      WITH CHECK (public.get_pt_role() IN ('SuperAdmin','Docente'));
  END IF;
END $$;