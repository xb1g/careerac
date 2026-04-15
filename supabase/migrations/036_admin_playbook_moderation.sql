alter table public.profiles
  add column if not exists is_admin boolean not null default false;

drop policy if exists "admins can update all playbooks" on public.playbooks;

create policy "admins can update all playbooks"
  on public.playbooks for update
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
  );
