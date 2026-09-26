-- Verified CV content import (education intentionally excluded).
-- Run 0002_production_alignment.sql first so experiences.current_role exists.

begin;

-- Professional experience. Month-only CV dates are normalized to the first day
-- for starts and the final day of the stated month for ends.
insert into public.experiences (company, role, location, start_date, end_date, "current_role", description, sort_order)
select company, role, location, start_date, end_date, "current_role", description, sort_order
from (
  values
    ('Zweidevs Private Limited', 'Backend Engineer', 'Lahore, Pakistan', '2025-08-01'::date, null::date, true,
     'Develop production backend services and REST APIs using Node.js, Express.js, PostgreSQL, Supabase, and MongoDB. Build AI-powered applications using RAG pipelines, vector search, LLM integrations, and structured AI workflows.', 1),
    ('Cinqdev Solutions', 'Backend Engineer', 'Lahore, Pakistan', '2024-12-01'::date, '2025-08-31'::date, false,
     'Developed backend and full-stack applications using Node.js, Express.js, React.js, FastAPI, PostgreSQL, and MongoDB. Built AI chatbot and document-processing systems using RAG pipelines, LLM APIs, vector databases, embeddings, and prompt workflows.', 2),
    ('StepInn Solution', 'Node.js Developer', 'Lahore, Pakistan', '2023-12-01'::date, '2024-11-30'::date, false,
     'Developed REST APIs using Node.js and Express.js for web and mobile applications. Designed MongoDB schemas and improved backend reliability by resolving API, database, and performance issues.', 3)
) as source(company, role, location, start_date, end_date, "current_role", description, sort_order)
where not exists (select 1 from public.experiences experience where experience.company = source.company);

update public.experiences
set
  role = case company
    when 'Zweidevs Private Limited' then 'Backend Engineer'
    when 'Cinqdev Solutions' then 'Backend Engineer'
    when 'StepInn Solution' then 'Node.js Developer'
    else role
  end,
  location = 'Lahore, Pakistan',
  start_date = case company
    when 'Zweidevs Private Limited' then '2025-08-01'::date
    when 'Cinqdev Solutions' then '2024-12-01'::date
    when 'StepInn Solution' then '2023-12-01'::date
    else start_date
  end,
  end_date = case company
    when 'Zweidevs Private Limited' then null
    when 'Cinqdev Solutions' then '2025-08-31'::date
    when 'StepInn Solution' then '2024-11-30'::date
    else end_date
  end,
  "current_role" = (company = 'Zweidevs Private Limited'),
  sort_order = case company
    when 'Zweidevs Private Limited' then 1
    when 'Cinqdev Solutions' then 2
    when 'StepInn Solution' then 3
    else sort_order
  end
where company in ('Zweidevs Private Limited', 'Cinqdev Solutions', 'StepInn Solution');

-- CV-verified experience highlights.
delete from public.experience_highlights
where experience_id in (
  select id from public.experiences
  where company in ('Zweidevs Private Limited', 'Cinqdev Solutions', 'StepInn Solution')
);

insert into public.experience_highlights (experience_id, content, sort_order)
select experience.id, source.highlight, source.sort_order
from public.experiences experience
join (
  values
    ('Zweidevs Private Limited', 'Develop production backend services and REST APIs using Node.js, Express.js, PostgreSQL, Supabase, and MongoDB.', 1),
    ('Zweidevs Private Limited', 'Build AI-powered applications using RAG pipelines, vector search, LLM integrations, and structured AI workflows.', 2),
    ('Zweidevs Private Limited', 'Integrate payment gateways, Perplexity API workflows, authentication systems, and external APIs.', 3),
    ('Cinqdev Solutions', 'Built AI chatbot and document-processing systems using RAG pipelines, LLM APIs, vector databases, embeddings, and prompt workflows.', 1),
    ('Cinqdev Solutions', 'Implemented RBAC, authentication systems, modular backend architecture, and secure REST APIs.', 2),
    ('StepInn Solution', 'Developed REST APIs using Node.js and Express.js for web and mobile applications.', 1),
    ('StepInn Solution', 'Designed MongoDB schemas and optimized database structures based on application requirements.', 2)
) as source(company, highlight, sort_order) using (company);

-- Projects and only CV-verified facts.
insert into public.projects (
  title, slug, short_description, company, role, category, status, featured, sort_order,
  overview, my_role, solution, live_url
)
values
  ('Klippify', 'klippify', 'Creator and brand performance platform for campaigns, verified engagement, analytics, earnings, and platform workflows.', 'Klippify', 'Backend Engineer', 'SaaS', 'published', true, 1,
   'Creator and brand performance platform supporting campaigns, engagement tracking, analytics, earnings, and platform workflows.',
   'Developed backend architecture, REST APIs, database structures, social integrations, click and view tracking systems, and Stripe payment functionality.',
   'Designed backend workflows for scalable campaign management and performance-based creator payments.', 'https://klippify.com'),
  ('Alevo', 'alevo', 'AI-powered coaching platform with user management, content processing, and production application workflows.', 'Alevo', 'Full Stack Developer', 'AI', 'published', true, 2,
   'AI-powered coaching platform with backend services supporting coaching experiences, user management, content processing, and application workflows.',
   'Developed backend services, LLM-powered processing pipelines, APIs, third-party integrations, and Stripe payment workflows.',
   'Integrated AI functionality into production backend systems.', 'https://app.alevo.ai'),
  ('CampGenie', 'campgenie', 'Camp discovery and booking marketplace supporting sessions, registrations, capacity management, bookings, and role-based users.', 'CampGenie', 'Backend Engineer', 'Marketplace', 'published', true, 3,
   'Camp discovery and booking marketplace for families, providers, users, and platform operations.',
   'Developed marketplace workflows, APIs, database structures, Stripe Connect marketplace payments, and application functionality using Next.js and Supabase.',
   'Designed APIs and data structures for registrations, capacity management, bookings, and role-based users.', 'https://thisiscampgenie.com'),
  ('CrowdAxis', 'crowdaxis', 'Marketing intelligence platform for event research, audience intelligence, campaign analysis, and AI-generated insights.', 'CrowdAxis', 'Backend Engineer', 'AI', 'published', true, 4,
   'Marketing intelligence platform supporting event research, audience intelligence, campaign analysis, and AI-generated insights.',
   'Developed backend functionality, Perplexity API-powered AI pipelines, third-party API integrations, payment workflows, and backend services.',
   'Built AI pipelines for retrieving, processing, and structuring market data.', 'https://www.crowdaxis.co')
on conflict (slug) do update set
  title = excluded.title, short_description = excluded.short_description, company = excluded.company,
  role = excluded.role, category = excluded.category, status = excluded.status, featured = excluded.featured,
  sort_order = excluded.sort_order, overview = excluded.overview, my_role = excluded.my_role,
  solution = excluded.solution, live_url = excluded.live_url, updated_at = now();

-- CV-verified technologies.
insert into public.technologies (name, category, featured, sort_order)
values
  ('Node.js', 'Backend', true, 1), ('Express.js', 'Backend', true, 2), ('FastAPI', 'Backend', true, 3),
  ('REST APIs', 'Backend', true, 4), ('RAG', 'AI', true, 5), ('LLM Integration', 'AI', true, 6),
  ('Vector Search', 'AI', true, 7), ('Qdrant', 'AI', false, 8), ('Perplexity API', 'AI', true, 9),
  ('PostgreSQL', 'Databases', true, 10), ('MongoDB', 'Databases', true, 11), ('Supabase', 'Databases', true, 12),
  ('React.js', 'Frontend', true, 13), ('Next.js', 'Frontend', true, 14), ('Tailwind CSS', 'Frontend', false, 15),
  ('Stripe', 'Payments', true, 16), ('Stripe Connect', 'Payments', true, 17), ('Docker', 'Infrastructure', false, 18),
  ('AWS EC2', 'Infrastructure', false, 19), ('Vercel', 'Infrastructure', false, 20), ('Railway', 'Infrastructure', false, 21), ('Render', 'Infrastructure', false, 22)
on conflict (name) do update set category = excluded.category, featured = excluded.featured, sort_order = excluded.sort_order;

-- Attach verified technologies to each project.
delete from public.project_technologies
where project_id in (select id from public.projects where slug in ('klippify', 'alevo', 'campgenie', 'crowdaxis'));

insert into public.project_technologies (project_id, technology_id)
select project.id, technology.id
from public.projects project
join (
  values
    ('klippify', 'Node.js'), ('klippify', 'REST APIs'), ('klippify', 'Stripe'),
    ('alevo', 'Node.js'), ('alevo', 'LLM Integration'), ('alevo', 'Stripe'),
    ('campgenie', 'Next.js'), ('campgenie', 'Supabase'), ('campgenie', 'Stripe Connect'),
    ('crowdaxis', 'Node.js'), ('crowdaxis', 'Perplexity API'), ('crowdaxis', 'RAG')
) as source(slug, technology_name) on source.slug = project.slug
join public.technologies technology on technology.name = source.technology_name;

-- Skills are inserted only when they do not already exist.
insert into public.skills (name, category, featured, sort_order)
select name, category, featured, sort_order
from (
  values
    ('JavaScript (ES6+)', 'Languages', true, 1), ('TypeScript', 'Languages', true, 2), ('Python', 'Languages', false, 3),
    ('Node.js', 'Backend', true, 4), ('Express.js', 'Backend', true, 5), ('FastAPI', 'Backend', true, 6),
    ('RAG', 'AI', true, 7), ('LLM Integration', 'AI', true, 8), ('Vector Embeddings', 'AI', false, 9), ('Qdrant', 'AI', false, 10),
    ('PostgreSQL', 'Databases', true, 11), ('MongoDB', 'Databases', true, 12), ('Supabase', 'Databases', true, 13),
    ('React.js', 'Frontend', true, 14), ('Next.js', 'Frontend', true, 15), ('Tailwind CSS', 'Frontend', false, 16),
    ('Stripe', 'Payments', true, 17), ('Stripe Connect', 'Payments', true, 18), ('Docker', 'Infrastructure', false, 19)
) as source(name, category, featured, sort_order)
where not exists (select 1 from public.skills skill where skill.name = source.name);

-- Certification from the CV. Education is intentionally not imported.
insert into public.certifications (name, issuer, issue_date, credential_url, sort_order)
select 'Claude 101', 'Anthropic', '2026-01-01', 'https://verify.skilljar.com/c/d2jwogd3v8gw', 1
where not exists (select 1 from public.certifications where name = 'Claude 101' and issuer = 'Anthropic');

-- Verified public social links.
insert into public.social_links (platform, url, enabled, sort_order)
select platform, url, true, sort_order
from (values
  ('LinkedIn', 'https://linkedin.com/in/mghulamqadir', 1),
  ('GitHub', 'https://github.com/mghulamqadir', 2)
) as source(platform, url, sort_order)
where not exists (select 1 from public.social_links link where link.platform = source.platform);

-- CMS-managed public copy based on the CV.
insert into public.site_settings (key, value)
values
  ('homepage', jsonb_build_object(
    'hero_eyebrow', 'Backend-Focused Full Stack Engineer · Lahore, Pakistan',
    'hero_title', 'Backend-Focused Full Stack Engineer.',
    'hero_description', 'I build production SaaS platforms, AI-powered applications, REST APIs, payment systems, and scalable backend services.'
  )),
  ('seo', jsonb_build_object(
    'title', 'Ghulam Qadir — Backend-Focused Full Stack Engineer',
    'description', 'Backend-Focused Full Stack Engineer with 3 years of professional experience in Node.js, AI/RAG, React, APIs, payments, and production SaaS platforms.'
  )),
  ('contact', jsonb_build_object('email', 'mohammadghulam.qadir@gmail.com'))
on conflict (key) do update set value = excluded.value, updated_at = now();

commit;
