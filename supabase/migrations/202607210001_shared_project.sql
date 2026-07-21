create table if not exists public.renovation_projects (
  id text primary key,
  data jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create or replace function public.set_renovation_project_metadata()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  if tg_op = 'UPDATE' then
    new.revision = old.revision + 1;
  end if;
  return new;
end;
$$;

drop trigger if exists set_renovation_project_metadata on public.renovation_projects;
create trigger set_renovation_project_metadata
before insert or update on public.renovation_projects
for each row execute function public.set_renovation_project_metadata();

alter table public.renovation_projects enable row level security;

drop policy if exists "Authenticated users can view the shared project" on public.renovation_projects;
create policy "Authenticated users can view the shared project"
on public.renovation_projects for select
to authenticated
using (true);

drop policy if exists "Authenticated users can create the shared project" on public.renovation_projects;
create policy "Authenticated users can create the shared project"
on public.renovation_projects for insert
to authenticated
with check (id = 'home-renovation');

drop policy if exists "Authenticated users can update the shared project" on public.renovation_projects;
create policy "Authenticated users can update the shared project"
on public.renovation_projects for update
to authenticated
using (id = 'home-renovation')
with check (id = 'home-renovation');

alter table public.renovation_projects replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.renovation_projects;
exception
  when duplicate_object then null;
end $$;
