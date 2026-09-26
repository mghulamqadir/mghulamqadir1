-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";


-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    role text not null default 'editor'
        check (role in ('admin', 'editor')),
    avatar_url text,
    bio text,
    location text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- PROJECTS
-- =========================================================

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    short_description text not null,
    company text not null default '',
    role text not null default '',
    category text not null default 'Full Stack',
    status text not null default 'draft'
        check (status in ('draft', 'published', 'archived')),
    featured boolean not null default false,
    sort_order integer not null default 0,
    overview text,
    problem text,
    solution text,
    my_role text,
    architecture text,
    challenges jsonb not null default '[]'::jsonb,
    outcome text,
    live_url text,
    github_url text,
    cover_image_url text,
    seo_title text,
    seo_description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- TECHNOLOGIES
-- =========================================================

create table if not exists public.technologies (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    category text not null default 'Other',
    icon text,
    featured boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- PROJECT TECHNOLOGIES
-- =========================================================

create table if not exists public.project_technologies (
    project_id uuid
        references public.projects(id)
        on delete cascade,

    technology_id uuid
        references public.technologies(id)
        on delete cascade,

    primary key (project_id, technology_id)
);


-- =========================================================
-- PROJECT IMAGES
-- =========================================================

create table if not exists public.project_images (
    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    public_id text not null,
    secure_url text not null,
    resource_type text not null default 'image',
    format text,
    width integer,
    height integer,
    bytes integer,
    alt_text text not null default '',
    caption text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);


-- =========================================================
-- TESTIMONIALS
-- =========================================================

create table if not exists public.testimonials (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    job_title text,
    company text,
    avatar_url text,
    testimonial text not null,
    source_url text,
    featured boolean not null default false,

    status text not null default 'draft'
        check (status in ('draft', 'published')),

    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- EXPERIENCES
-- Application contract: current_role
-- =========================================================

create table if not exists public.experiences (
    id uuid primary key default gen_random_uuid(),
    company text not null,
    role text not null,
    location text,
    start_date date not null,
    end_date date,

    "current_role" boolean not null default false,

    description text,
    company_url text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- EXPERIENCE HIGHLIGHTS
-- =========================================================

create table if not exists public.experience_highlights (
    id uuid primary key default gen_random_uuid(),

    experience_id uuid not null
        references public.experiences(id)
        on delete cascade,

    content text not null,
    sort_order integer not null default 0
);


-- =========================================================
-- SKILLS
-- =========================================================

create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text not null,
    icon text,
    featured boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- EDUCATION
-- =========================================================

create table if not exists public.education (
    id uuid primary key default gen_random_uuid(),
    institution text not null,
    degree text,
    field text,
    location text,
    start_date date,
    end_date date,
    description text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- CERTIFICATIONS
-- =========================================================

create table if not exists public.certifications (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    issuer text,
    issue_date date,
    credential_url text,
    credential_id text,
    image_url text,
    image_public_id text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- SOCIAL LINKS
-- =========================================================

create table if not exists public.social_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null,
    url text not null,
    icon text,
    enabled boolean not null default true,
    sort_order integer not null default 0
);


-- =========================================================
-- CONTACT SUBMISSIONS
-- =========================================================

create table if not exists public.contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text not null,
    message text not null,

    status text not null default 'unread'
        check (status in ('unread', 'read', 'archived')),

    email_status text not null default 'pending',
    brevo_message_id text,

    created_at timestamptz not null default now()
);


-- =========================================================
-- SITE SETTINGS
-- =========================================================

create table if not exists public.site_settings (
    key text primary key,
    value jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);


-- =========================================================
-- AUDIT LOGS
-- =========================================================

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),

    user_id uuid
        references auth.users(id)
        on delete set null,

    action text not null,
    entity text not null,
    entity_id text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);


-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists projects_public_idx
on public.projects(status, featured, sort_order);

create index if not exists projects_slug_idx
on public.projects(slug);

create index if not exists messages_status_idx
on public.contact_submissions(status, created_at desc);


-- =========================================================
-- ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_images enable row level security;
alter table public.testimonials enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_highlights enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;


-- =========================================================
-- ADMIN CHECK FUNCTION
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
        and role = 'admin'
    );
$$;


-- =========================================================
-- PROJECT POLICIES
-- =========================================================

drop policy if exists "public published projects" on public.projects;
create policy "public published projects"
on public.projects
for select
using (status = 'published');

drop policy if exists "admins manage projects" on public.projects;
create policy "admins manage projects"
on public.projects
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- TECHNOLOGY POLICIES
-- =========================================================

drop policy if exists "public technologies" on public.technologies;
create policy "public technologies"
on public.technologies
for select
using (true);

drop policy if exists "admins manage technologies" on public.technologies;
create policy "admins manage technologies"
on public.technologies
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- PROJECT TECHNOLOGY POLICIES
-- =========================================================

drop policy if exists "public project technologies" on public.project_technologies;
create policy "public project technologies"
on public.project_technologies
for select
using (
    exists (
        select 1
        from public.projects p
        where p.id = project_id
        and p.status = 'published'
    )
);

drop policy if exists "admins manage project technologies" on public.project_technologies;
create policy "admins manage project technologies"
on public.project_technologies
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- PROJECT IMAGE POLICIES
-- =========================================================

drop policy if exists "public project images" on public.project_images;
create policy "public project images"
on public.project_images
for select
using (
    exists (
        select 1
        from public.projects p
        where p.id = project_id
        and p.status = 'published'
    )
);

drop policy if exists "admins manage project images" on public.project_images;
create policy "admins manage project images"
on public.project_images
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- TESTIMONIAL POLICIES
-- =========================================================

drop policy if exists "public testimonials" on public.testimonials;
create policy "public testimonials"
on public.testimonials
for select
using (status = 'published');

drop policy if exists "admins manage testimonials" on public.testimonials;
create policy "admins manage testimonials"
on public.testimonials
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- EXPERIENCE POLICIES
-- =========================================================

drop policy if exists "public experiences" on public.experiences;
create policy "public experiences"
on public.experiences
for select
using (true);

drop policy if exists "admins manage experiences" on public.experiences;
create policy "admins manage experiences"
on public.experiences
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- EXPERIENCE HIGHLIGHT POLICIES
-- =========================================================

drop policy if exists "public highlights" on public.experience_highlights;
create policy "public highlights"
on public.experience_highlights
for select
using (true);

drop policy if exists "admins manage highlights" on public.experience_highlights;
create policy "admins manage highlights"
on public.experience_highlights
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- SKILLS POLICIES
-- =========================================================

drop policy if exists "public skills" on public.skills;
create policy "public skills"
on public.skills
for select
using (true);

drop policy if exists "admins manage skills" on public.skills;
create policy "admins manage skills"
on public.skills
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- EDUCATION POLICIES
-- =========================================================

drop policy if exists "public education" on public.education;
create policy "public education"
on public.education
for select
using (true);

drop policy if exists "admins manage education" on public.education;
create policy "admins manage education"
on public.education
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- CERTIFICATION POLICIES
-- =========================================================

drop policy if exists "public certifications" on public.certifications;
create policy "public certifications"
on public.certifications
for select
using (true);

drop policy if exists "admins manage certifications" on public.certifications;
create policy "admins manage certifications"
on public.certifications
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- SOCIAL LINK POLICIES
-- =========================================================

drop policy if exists "public social links" on public.social_links;
create policy "public social links"
on public.social_links
for select
using (enabled = true);

drop policy if exists "admins manage social links" on public.social_links;
create policy "admins manage social links"
on public.social_links
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- SITE SETTINGS POLICIES
-- =========================================================

drop policy if exists "public settings" on public.site_settings;
create policy "public settings"
on public.site_settings
for select
using (
    key in (
        'profile',
        'homepage',
        'seo',
        'contact',
        'resume'
    )
);

drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings"
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- CONTACT SUBMISSION POLICIES
-- =========================================================

grant usage on schema public to anon, authenticated;
grant insert on table public.contact_submissions to anon, authenticated;

drop policy if exists "controlled contact insert" on public.contact_submissions;
create policy "controlled contact insert"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "admins manage messages" on public.contact_submissions;
create policy "admins manage messages"
on public.contact_submissions
for select
using (public.is_admin());

drop policy if exists "admins update messages" on public.contact_submissions;
create policy "admins update messages"
on public.contact_submissions
for update
using (public.is_admin())
with check (public.is_admin());


-- =========================================================
-- PROFILE POLICIES
-- =========================================================

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles"
on public.profiles
for all
using (
    public.is_admin()
    or id = auth.uid()
)
with check (
    public.is_admin()
    or id = auth.uid()
);


-- =========================================================
-- AUDIT LOG POLICIES
-- =========================================================

drop policy if exists "admins audit logs" on public.audit_logs;
create policy "admins audit logs"
on public.audit_logs
for select
using (public.is_admin());

drop policy if exists "admins insert audit logs" on public.audit_logs;
create policy "admins insert audit logs"
on public.audit_logs
for insert
with check (
    public.is_admin()
    or user_id = auth.uid()
);
