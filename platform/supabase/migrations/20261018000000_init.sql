-- ORVEX Platform — schema inicial
-- Cada linha pertence a uma conta (auth.users). RLS garante o isolamento.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- Perfis
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  agency_name text not null default '',
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, agency_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'agency_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- Automações
-- ---------------------------------------------------------------
create table public.automations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  template text,
  trigger_type text not null check (trigger_type in ('manual', 'webhook', 'schedule', 'event')),
  source_app text not null default '' check (char_length(source_app) <= 120),
  actions jsonb not null default '[]'::jsonb check (jsonb_typeof(actions) = 'array'),
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  n8n_webhook_path text check (n8n_webhook_path is null or n8n_webhook_path ~ '^[A-Za-z0-9/_-]{1,200}$'),
  wait_for_callback boolean not null default false,
  webhook_token text not null default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'paused' check (status in ('active', 'paused', 'error')),
  last_error text,
  last_run_at timestamptz,
  run_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index automations_user_idx on public.automations (user_id, created_at desc);
create unique index automations_webhook_token_idx on public.automations (webhook_token);

-- ---------------------------------------------------------------
-- Execuções
-- ---------------------------------------------------------------
create table public.executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  automation_id uuid not null references public.automations (id) on delete cascade,
  trigger_source text not null check (trigger_source in ('manual', 'webhook', 'n8n')),
  idempotency_key text not null check (char_length(idempotency_key) between 1 and 200),
  status text not null default 'pending' check (status in ('pending', 'running', 'success', 'error')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms integer,
  error_message text,
  input jsonb,
  output jsonb,
  n8n_execution_id text,
  created_at timestamptz not null default now(),
  unique (automation_id, idempotency_key)
);

create index executions_user_idx on public.executions (user_id, started_at desc);
create index executions_automation_idx on public.executions (automation_id, started_at desc);

-- Contadores da automação derivados das execuções reais
create or replace function public.bump_automation_run()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.automations
     set run_count = run_count + 1,
         last_run_at = greatest(coalesce(last_run_at, new.started_at), new.started_at)
   where id = new.automation_id;
  return new;
end;
$$;

create trigger on_execution_created
  after insert on public.executions
  for each row execute function public.bump_automation_run();

-- ---------------------------------------------------------------
-- APIs externas cadastradas (sem segredos: credenciais ficam no n8n)
-- ---------------------------------------------------------------
create table public.api_endpoints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  base_url text not null check (base_url ~ '^https?://' and char_length(base_url) <= 500),
  health_path text not null default '' check (char_length(health_path) <= 200),
  status text not null default 'unknown' check (status in ('unknown', 'online', 'error')),
  last_status_code integer,
  last_error text,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create index api_endpoints_user_idx on public.api_endpoints (user_id, created_at desc);

-- ---------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger automations_touch before update on public.automations
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.automations enable row level security;
alter table public.executions enable row level security;
alter table public.api_endpoints enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = (select auth.uid()));
create policy "profiles_update_own" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "automations_all_own" on public.automations
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Execuções são criadas somente pelo servidor (service role); o usuário apenas lê.
create policy "executions_select_own" on public.executions
  for select using (user_id = (select auth.uid()));

create policy "api_endpoints_all_own" on public.api_endpoints
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Campos mantidos pelo sistema (contadores, token, dono) não podem ser alterados pelo usuário
revoke update on public.automations from authenticated, anon;
grant update (name, description, template, trigger_type, source_app, actions, config,
  n8n_webhook_path, wait_for_callback, status, last_error) on public.automations to authenticated;
revoke all on public.executions from anon;
revoke insert, update, delete on public.executions from authenticated;
