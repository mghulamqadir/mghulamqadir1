-- Additive production alignment for databases that already applied 0001.
alter table public.profiles add column if not exists headline text;
alter table public.profiles add column if not exists short_bio text;
alter table public.profiles add column if not exists long_bio text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_public_id text;
alter table public.profiles add column if not exists availability_status text;

alter table public.projects add column if not exists cover_image_public_id text;
alter table public.projects add column if not exists published_at timestamptz;
alter table public.technologies add column if not exists slug text;
create unique index if not exists technologies_slug_unique_idx on public.technologies(slug) where slug is not null;
alter table public.testimonials add column if not exists avatar_public_id text;

-- The existing hosted database was created with the older `is_current` name.
-- Preserve its values while aligning it with the application contract.
do $$
declare
  relation_id oid := 'public.experiences'::regclass;
begin
  if exists (
    select 1 from pg_attribute
    where attrelid = relation_id
      and attname = 'is' || chr(95) || 'current'
      and not attisdropped
  ) and not exists (
    select 1 from pg_attribute
    where attrelid = relation_id
      and attname = 'current' || chr(95) || 'role'
      and not attisdropped
  ) then
    execute format(
      'alter table public.experiences rename column %I to %I',
      'is' || chr(95) || 'current',
      'current' || chr(95) || 'role'
    );
  end if;
end;
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists technologies_set_updated_at on public.technologies;
create trigger technologies_set_updated_at before update on public.technologies for each row execute function public.set_updated_at();
drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at before update on public.experiences for each row execute function public.set_updated_at();
drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at before update on public.skills for each row execute function public.set_updated_at();
drop trigger if exists education_set_updated_at on public.education;
create trigger education_set_updated_at before update on public.education for each row execute function public.set_updated_at();
drop trigger if exists certifications_set_updated_at on public.certifications;
create trigger certifications_set_updated_at before update on public.certifications for each row execute function public.set_updated_at();

drop policy if exists "public profile" on public.profiles;
create policy "public profile" on public.profiles for select using (true);

drop policy if exists "admins delete messages" on public.contact_submissions;
create policy "admins delete messages" on public.contact_submissions for delete using (public.is_admin());

-- Production contact requests are written only by the server service-role client.
revoke insert on table public.contact_submissions from anon, authenticated;
drop policy if exists "controlled contact insert" on public.contact_submissions;
