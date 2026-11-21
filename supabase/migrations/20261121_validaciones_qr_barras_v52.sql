-- pracTICAtecnica.com (BDS Devs) — Tabla de Validaciones QR y Barras (v5.2)
create table if not exists public.validaciones_qr_institucional (
  id uuid primary key default gen_random_uuid(),
  modulo text not null,
  tipo_persona text not null,
  identificacion text not null,
  nombre_persona text not null,
  formato_codigo text not null,
  codigo_crudo text not null,
  estado_validacion text not null check (estado_validacion in ('AUTORIZADO', 'DUPLICADO_HOY', 'FIRMA_INVALIDA')),
  sha256_sello text not null,
  registrado_en timestamptz not null default now()
);

create index if not exists idx_val_qr_modulo_fecha on public.validaciones_qr_institucional (modulo, registrado_en desc);
create index if not exists idx_val_qr_identificacion on public.validaciones_qr_institucional (identificacion);

alter table public.validaciones_qr_institucional enable row level security;

drop policy if exists "val_qr_insert_todos" on public.validaciones_qr_institucional;
create policy "val_qr_insert_todos" on public.validaciones_qr_institucional
for insert with check (true);

drop policy if exists "val_qr_select_superadmin_o_docente" on public.validaciones_qr_institucional;
create policy "val_qr_select_superadmin_o_docente" on public.validaciones_qr_institucional
for select using (
  public.es_superadmin()
  or exists (
    select 1 from public.perfiles_rbac p
    where lower(p.correo) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and p.rol in ('SuperAdmin', 'Jefatura', 'Docente', 'Auxiliar')
      and p.estado = 'activo'
  )
);

grant select, insert on public.validaciones_qr_institucional to anon, authenticated;