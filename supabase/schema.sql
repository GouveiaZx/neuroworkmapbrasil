-- ============================================
-- Neurowork — Estrutura do Banco de Dados
-- Executar no Supabase SQL Editor
-- ============================================

-- Tabela profiles (vinculada ao auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  bio text,
  foto_url text,
  estado text,
  cidade text,
  instagram text,
  facebook text,
  youtube text,
  linkedin text,
  email_contato text,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Perfis são públicos" on public.profiles
  for select using (true);

create policy "Usuário insere próprio perfil" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "Usuário edita próprio perfil" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Trigger: cria perfil automaticamente ao registrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email_contato)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabela techniques
create table if not exists public.techniques (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamp with time zone default now()
);

alter table public.techniques enable row level security;

create policy "Técnicas são públicas" on public.techniques
  for select using (true);

-- Seed das técnicas pré-cadastradas
insert into public.techniques (nome) values
  ('FOTOBIOESTIMULAÇÃO'),
  ('NEUROFEEDBACK'),
  ('BIOFEEDBACK'),
  ('ESTIMULAÇÃO TRANSCRANIANA POR CORRENTE CONTÍNUA'),
  ('REALIDADE VIRTUAL'),
  ('ESTIMULAÇÃO DO NERVO VAGO');

-- Tabela profile_techniques (many-to-many)
create table if not exists public.profile_techniques (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  technique_id uuid references public.techniques(id) on delete cascade,
  unique(profile_id, technique_id)
);

alter table public.profile_techniques enable row level security;

create policy "Relações são públicas" on public.profile_techniques
  for select using (true);

create policy "Usuário gerencia suas técnicas" on public.profile_techniques
  for insert to authenticated
  with check (profile_id = auth.uid());

create policy "Usuário remove suas técnicas" on public.profile_techniques
  for delete to authenticated
  using (profile_id = auth.uid());

-- Storage para fotos de perfil
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Fotos são públicas" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Usuário faz upload da foto" on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars');

create policy "Usuário atualiza foto" on storage.objects
  for update to authenticated using (bucket_id = 'avatars');
