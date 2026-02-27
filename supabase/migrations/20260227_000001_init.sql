-- Liberta: schema inicial + RLS + trial
-- Observação: este arquivo assume execução no Supabase (Postgres) com schema auth já existente.

create extension if not exists pgcrypto;

-- ===== Enums =====
do $$ begin
  create type public.transaction_type as enum ('income', 'expense');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid');
exception when duplicate_object then null;
end $$;

-- ===== Tabelas =====
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  trial_ends_at timestamptz not null,
  subscription_status public.subscription_status not null default 'trialing',
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents bigint not null,
  type public.transaction_type not null,
  category text,
  description text,
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on public.transactions(user_id, date desc);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_cents bigint not null,
  current_cents bigint not null default 0,
  deadline date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists goals_user_created_idx on public.goals(user_id, created_at desc);

-- ===== Helpers =====
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists(select 1 from public.admin_users au where au.user_id = uid);
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists entitlements_touch_updated_at on public.entitlements;
create trigger entitlements_touch_updated_at
before update on public.entitlements
for each row execute function public.touch_updated_at();

-- Cria profile e entitlement ao criar auth.user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text;
begin
  full_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');

  insert into public.profiles (id, full_name)
  values (new.id, full_name)
  on conflict (id) do update set full_name = excluded.full_name;

  insert into public.entitlements (user_id, trial_ends_at, subscription_status)
  values (new.id, now() + interval '4 days', 'trialing')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- IMPORTANTE: não removemos triggers existentes em auth.users (banco legado).
-- Criamos um trigger próprio do Liberta apenas se ainda não existir.
do $$
begin
  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'liberta_on_auth_user_created'
      and n.nspname = 'auth'
      and c.relname = 'users'
  ) then
    execute 'create trigger liberta_on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();';
  end if;
end;
$$;

-- ===== RLS =====
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.admin_users enable row level security;

-- profiles: usuário lê/atualiza seu perfil; admin pode ver tudo
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- entitlements: usuário lê o próprio; escrita apenas via service role/edge function (não dar update direto)
drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own on public.entitlements
for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- transactions: CRUD do próprio; admin pode ver tudo
drop policy if exists transactions_select_own on public.transactions;
create policy transactions_select_own on public.transactions
for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists transactions_insert_own on public.transactions;
create policy transactions_insert_own on public.transactions
for insert with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists transactions_update_own on public.transactions;
create policy transactions_update_own on public.transactions
for update using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists transactions_delete_own on public.transactions;
create policy transactions_delete_own on public.transactions
for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- goals: CRUD do próprio; admin pode ver tudo
drop policy if exists goals_select_own on public.goals;
create policy goals_select_own on public.goals
for select using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists goals_insert_own on public.goals;
create policy goals_insert_own on public.goals
for insert with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists goals_update_own on public.goals;
create policy goals_update_own on public.goals
for update using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists goals_delete_own on public.goals;
create policy goals_delete_own on public.goals
for delete using (user_id = auth.uid() or public.is_admin(auth.uid()));

-- admin_users: apenas admins podem ver; escrita recomendada via SQL manual (dashboard)
drop policy if exists admin_users_select_admin on public.admin_users;
create policy admin_users_select_admin on public.admin_users
for select using (public.is_admin(auth.uid()));

