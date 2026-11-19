-- ============================================================================
-- pracTICAtecnica.com — Esquema PostgreSQL + RLS (Supabase) v180.0
-- Cumplimiento Ley 8968 (PRODHAB), Decreto N.° 45509-MEP (REA) y DGEC 2026
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Perfiles, RBAC y suscripciones validadas en servidor
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'Estudiante' CHECK (role IN ('SuperAdmin','Director','Docente','Estudiante','Padre','Auxiliar','Visitante')),
  institution_name TEXT DEFAULT 'CTP Mercedes Norte',
  circuit_code TEXT DEFAULT 'Circuito 02',
  section_code TEXT,
  trial_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subscription_plan TEXT DEFAULT 'trial_13d' CHECK (subscription_plan IN ('trial_13d','docente_3500','estudiante_2500','colegio_activo_1000','institucion_10000')),
  subscription_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '13 days'),
  failed_login_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vinculación multi-hijo (Padre/Madre con 1, 2, 3 o más estudiantes en distintas instituciones)
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- 3. Registro público de verificación criptográfica QR + SHA-256
CREATE TABLE IF NOT EXISTS public.verification_registry (
  hash_sha256 TEXT PRIMARY KEY,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('carnet','justificacion','permiso','horario','certificado')),
  issuer_id UUID REFERENCES public.profiles(id),
  holder_name TEXT NOT NULL,
  institution_name TEXT NOT NULL DEFAULT 'CTP Mercedes Norte',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'VALIDO' CHECK (status IN ('VALIDO','REVOCADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Asistencia digital cero papel (códigos MEP + sincronización offline)
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_uuid TEXT UNIQUE,
  student_id UUID REFERENCES public.profiles(id),
  student_name TEXT NOT NULL,
  section_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mep_code TEXT NOT NULL CHECK (mep_code IN ('P','AI','AJ','TI','TJ','SA')),
  recorded_by UUID REFERENCES public.profiles(id),
  justification_hash TEXT REFERENCES public.verification_registry(hash_sha256),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Libreta REA (Decreto Ejecutivo N.° 45509-MEP) — Dirección/Estudiante SOLO LECTURA
CREATE TABLE IF NOT EXISTS public.gradebook_rea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id),
  student_name TEXT NOT NULL,
  section_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'CTP',
  cotidiano NUMERIC(5,2) DEFAULT 0,
  tareas NUMERIC(5,2) DEFAULT 0,
  pruebas NUMERIC(5,2) DEFAULT 0,
  proyecto NUMERIC(5,2) DEFAULT 0,
  asistencia NUMERIC(5,2) DEFAULT 100,
  indicador_rea INT DEFAULT 3 CHECK (indicador_rea IN (1,2,3)),
  teacher_id UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Chats institucionales multimedia (ocultos a visitantes)
CREATE TABLE IF NOT EXISTS public.institutional_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_code TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  sender_section TEXT,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACTIVACIÓN DE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gradebook_rea ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_chats ENABLE ROW LEVEL SECURITY;

-- Políticas esenciales PRODHAB / RBAC
CREATE POLICY "verificacion_publica_por_hash" ON public.verification_registry FOR SELECT USING (true);
CREATE POLICY "perfiles_propios_o_direccion" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SuperAdmin','Director','Docente'))
);
CREATE POLICY "notas_lectura_roles_autorizados" ON public.gradebook_rea FOR SELECT USING (
  auth.uid() = student_id
  OR auth.uid() = teacher_id
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SuperAdmin','Director'))
  OR EXISTS (SELECT 1 FROM public.parent_student_links l WHERE l.parent_id = auth.uid() AND l.student_id = gradebook_rea.student_id)
);
CREATE POLICY "notas_edicion_solo_docente_superadmin" ON public.gradebook_rea FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SuperAdmin','Docente'))
);
CREATE POLICY "chats_solo_usuarios_autenticados" ON public.institutional_chats FOR ALL USING (
  auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role <> 'Visitante')
);