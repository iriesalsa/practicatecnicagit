-- ============================================================================
-- pracTICAtecnica.com (BDS Devs) - Migracion v4.1: Trazabilidad Total + RBAC
-- Regla de oro: Todo usuario nuevo inicia estrictamente como 'Estudiante'.
-- Solo 'SuperAdmin' puede cambiar roles y consultar todos los ingresos en BD.
-- ============================================================================

create extension if not exists pgcrypto;

-- 1. Tabla de perfiles y control de roles RBAC
create table if not exists public.perfiles_rbac (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  correo text not null unique,
  nombre_visible text not null default 'Estudiante pracTICA',
  tipo_cuenta text not null default 'gmail' check (tipo_cuenta in ('gmail', 'mep', 'institucional')),
  rol text not null default 'Estudiante' check (rol in ('Estudiante', 'Padre/Madre', 'Auxiliar', 'Docente', 'Jefatura', 'SuperAdmin')),
  estado text not null default 'activo' check (estado in ('activo', 'suspendido', 'bloqueado')),
  intentos_fallidos integer not null default 0,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  actualizado_por text
);

-- 2. Tabla de trazabilidad total (ingresos CON cuenta, SIN cuenta y activos en vivo)
create table if not exists public.trazabilidad_ingresos (
  id uuid primary key default gen_random_uuid(),
  sesion_id text not null unique,
  perfil_id uuid references public.perfiles_rbac(id) on delete set null,
  correo text,
  tipo_ingreso text not null check (tipo_ingreso in ('con_cuenta', 'sin_cuenta')),
  rol_en_sesion text not null default 'Estudiante',
  vista_actual text not null default 'Inicio',
  dispositivo text not null default 'Web',
  activo boolean not null default true,
  ingreso_en timestamptz not null default now(),
  ultimo_latido timestamptz not null default now(),
  salida_en timestamptz,
  sha256_evento text not null
);

-- 3. Bitacora inmutable de cambios de rol realizados por SuperAdmin
create table if not exists public.auditoria_cambios_rol (
  id uuid primary key default gen_random_uuid(),
  correo_objetivo text not null,
  rol_anterior text not null,
  rol_nuevo text not null,
  ejecutado_por text not null,
  motivo text not null default 'Gestion administrativa RBAC',
  sha256_firma text not null,
  creado_en timestamptz not null default now()
);

create index if not exists idx_traza_activo_latido on public.trazabilidad_ingresos (activo, ultimo_latido desc);
create index if not exists idx_traza_tipo on public.trazabilidad_ingresos (tipo_ingreso);
create index if not exists idx_perfiles_rol on public.perfiles_rbac (rol);

-- 4. Trigger: impedir que cualquier insert directo sin SuperAdmin se asigne otro rol distinto a Estudiante
create or replace function public.fn_forzar_rol_estudiante_inicial()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.rol is null or new.rol <> 'Estudiante' then
    if coalesce(current_setting('request.jwt.claim.email', true), '') = '' then
      new.rol := 'Estudiante';
    elsif not exists (
      select 1 from public.perfiles_rbac p
      where lower(p.correo) = lower(current_setting('request.jwt.claim.email', true))
        and p.rol = 'SuperAdmin'
        and p.estado = 'activo'
    ) then
      new.rol := 'Estudiante';
    end if;
  end if;
  new.correo := lower(trim(new.correo));
  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists trg_forzar_rol_estudiante on public.perfiles_rbac;
create trigger trg_forzar_rol_estudiante
before insert on public.perfiles_rbac
for each row execute function public.fn_forzar_rol_estudiante_inicial();

-- 5. RPC segura: SOLO SuperAdmin puede cambiar el rol de un usuario en BD
create or replace function public.cambiar_rol_superadmin(
  p_correo_objetivo text,
  p_nuevo_rol text,
  p_motivo text default 'Actualizacion RBAC por SuperAdmin'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_ejecutor text;
  v_es_super boolean;
  v_rol_prev text;
  v_firma text;
begin
  v_ejecutor := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  select exists(
    select 1 from public.perfiles_rbac
    where lower(correo) = v_ejecutor and rol = 'SuperAdmin' and estado = 'activo'
  ) into v_es_super;

  if not v_es_super then
    raise exception 'ACCESO_DENEGADO: Solo SuperAdmin puede modificar roles RBAC.';
  end if;

  if p_nuevo_rol not in ('Estudiante', 'Padre/Madre', 'Auxiliar', 'Docente', 'Jefatura', 'SuperAdmin') then
    raise exception 'ROL_INVALIDO: %', p_nuevo_rol;
  end if;

  select rol into v_rol_prev
  from public.perfiles_rbac
  where lower(correo) = lower(trim(p_correo_objetivo));

  if v_rol_prev is null then
    raise exception 'USUARIO_NO_ENCONTRADO: %', p_correo_objetivo;
  end if;

  update public.perfiles_rbac
     set rol = p_nuevo_rol,
         actualizado_en = now(),
         actualizado_por = v_ejecutor
   where lower(correo) = lower(trim(p_correo_objetivo));

  update public.trazabilidad_ingresos
     set rol_en_sesion = p_nuevo_rol
   where lower(coalesce(correo, '')) = lower(trim(p_correo_objetivo))
     and activo = true;

  v_firma := encode(digest(v_ejecutor || '|' || lower(trim(p_correo_objetivo)) || '|' || v_rol_prev || '->' || p_nuevo_rol || '|' || now()::text, 'sha256'), 'hex');

  insert into public.auditoria_cambios_rol (correo_objetivo, rol_anterior, rol_nuevo, ejecutado_por, motivo, sha256_firma)
  values (lower(trim(p_correo_objetivo)), v_rol_prev, p_nuevo_rol, v_ejecutor, p_motivo, v_firma);

  return jsonb_build_object(
    'ok', true,
    'correo', lower(trim(p_correo_objetivo)),
    'rol_anterior', v_rol_prev,
    'rol_nuevo', p_nuevo_rol,
    'sha256', v_firma
  );
end;
$$;

-- 6. Politicas RLS (Row-Level Security)
alter table public.perfiles_rbac enable row level security;
alter table public.trazabilidad_ingresos enable row level security;
alter table public.auditoria_cambios_rol enable row level security;

drop policy if exists "perfil_propio_o_superadmin_select" on public.perfiles_rbac;
create policy "perfil_propio_o_superadmin_select" on public.perfiles_rbac
for select using (
  lower(correo) = lower(coalesce(auth.jwt() ->> 'email', ''))
  or exists (
    select 1 from public.perfiles_rbac s
    where lower(s.correo) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and s.rol = 'SuperAdmin'
  )
);

drop policy if exists "registro_inicial_estudiante" on public.perfiles_rbac;
create policy "registro_inicial_estudiante" on public.perfiles_rbac
for insert with check (rol = 'Estudiante');

drop policy if exists "traza_insert_todos" on public.trazabilidad_ingresos;
create policy "traza_insert_todos" on public.trazabilidad_ingresos
for insert with check (true);

drop policy if exists "traza_update_propia_sesion" on public.trazabilidad_ingresos;
create policy "traza_update_propia_sesion" on public.trazabilidad_ingresos
for update using (true) with check (true);

drop policy if exists "traza_select_superadmin" on public.trazabilidad_ingresos;
create policy "traza_select_superadmin" on public.trazabilidad_ingresos
for select using (
  exists (
    select 1 from public.perfiles_rbac s
    where lower(s.correo) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and s.rol = 'SuperAdmin'
  )
);

drop policy if exists "auditoria_select_superadmin" on public.auditoria_cambios_rol;
create policy "auditoria_select_superadmin" on public.auditoria_cambios_rol
for select using (
  exists (
    select 1 from public.perfiles_rbac s
    where lower(s.correo) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and s.rol = 'SuperAdmin'
  )
);