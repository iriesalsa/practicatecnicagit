-- pracTICAtecnica.com — Extensión PostgreSQL para Neon DB (v180.0)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.pt_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  google_sub TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'Estudiante'
    CHECK (role IN ('SuperAdmin','Director','Docente','Estudiante','Padre','Auxiliar','Visitante')),
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  circuit_code TEXT NOT NULL DEFAULT 'Circuito 02',
  section_code TEXT,
  trial_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subscription_plan TEXT NOT NULL DEFAULT 'trial_13d'
    CHECK (subscription_plan IN ('trial_13d','docente_3500','estudiante_2500','colegio_activo_1000','institucion_10000')),
  subscription_expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '13 days'),
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.pt_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.pt_profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.verification_registry (
  hash_sha256 TEXT PRIMARY KEY,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('carnet','justificacion','permiso','horario','certificado')),
  issuer_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  holder_name TEXT NOT NULL,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  circuit_code TEXT NOT NULL DEFAULT 'Circuito 02',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'VALIDO' CHECK (status IN ('VALIDO','REVOCADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_uuid TEXT UNIQUE,
  student_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  section_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mep_code TEXT NOT NULL CHECK (mep_code IN ('P','AI','AJ','TI','TJ','SA')),
  recorded_by UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  justification_hash TEXT REFERENCES public.verification_registry(hash_sha256) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gradebook_rea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  section_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'CTP',
  cotidiano NUMERIC(5,2) NOT NULL DEFAULT 0,
  tareas NUMERIC(5,2) NOT NULL DEFAULT 0,
  pruebas NUMERIC(5,2) NOT NULL DEFAULT 0,
  proyecto NUMERIC(5,2) NOT NULL DEFAULT 0,
  asistencia NUMERIC(5,2) NOT NULL DEFAULT 100,
  indicador_rea INT NOT NULL DEFAULT 3 CHECK (indicador_rea IN (1,2,3)),
  teacher_id UUID REFERENCES public.pt_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institutional_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_code TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.pt_profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  sender_section TEXT,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_profiles_email ON public.pt_profiles(email);
CREATE INDEX IF NOT EXISTS idx_attendance_sec_date ON public.attendance_records(section_code, attendance_date);
CREATE INDEX IF NOT EXISTS idx_gradebook_sec_subj ON public.gradebook_rea(section_code, subject_name);
CREATE INDEX IF NOT EXISTS idx_chats_channel_date ON public.institutional_chats(channel_code, created_at DESC);