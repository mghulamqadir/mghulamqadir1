# Ghulam Qadir — Portfolio & CMS

A production-oriented portfolio and private content-management system for **Ghulam Qadir**, a backend-focused full stack engineer working with Node.js, AI/RAG, React, APIs, payments, and SaaS platforms.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- Supabase Auth and PostgreSQL with Row Level Security
- Cloudinary for media assets
- Resend for transactional contact email
- Zod for server-side validation

## Local development

1. Copy `.env.example` to `.env` and provide the required values. Do not commit `.env`.
2. Install dependencies with `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## CV-verified portfolio content

The database import at [`supabase/sql/verified_cv_content.sql`](supabase/sql/verified_cv_content.sql) contains only CV-verified professional content. Education is intentionally excluded.

It imports and updates:

- Professional experience and highlights
- Projects: Klippify, Alevo, CampGenie, and CrowdAxis
- Technologies and skills
- Claude 101 certification
- GitHub and LinkedIn links
- Homepage, SEO, and contact settings

### Verified experience dates

| Company | Role | Dates |
| --- | --- | --- |
| Zweidevs Private Limited | Backend Engineer | Aug 2025 — Present |
| Cinqdev Solutions | Backend Engineer | Dec 2024 — Aug 2025 |
| StepInn Solution | Node.js Developer | Dec 2023 — Nov 2024 |

The UI formats database date values as `MMM YYYY`, including on the homepage, About timeline, and Experience page.

## Supabase setup and import order

Use the Supabase SQL Editor. Run scripts in this order:

1. On a fresh database, run [`supabase/migrations/0001_portfolio.sql`](supabase/migrations/0001_portfolio.sql).
2. Run [`supabase/migrations/0002_production_alignment.sql`](supabase/migrations/0002_production_alignment.sql). It safely aligns existing databases, including the legacy experience-current-role column.
3. Run [`supabase/sql/verified_cv_content.sql`](supabase/sql/verified_cv_content.sql).

Do not rerun migration `0001` against an already-configured database. Migration `0002` and the CV content import are designed to be safe to rerun. The CV import uses a transaction: if any statement fails, PostgreSQL rolls back the entire import rather than leaving partial data.

## Environment variables

Use [`.env.example`](.env.example) as the canonical variable-name reference. Secret values must remain server-only and must never use the `NEXT_PUBLIC_` prefix:

- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_API_SECRET`
- `BREVO_API_KEY`

## Content and media responsibilities

- **Supabase PostgreSQL:** structured portfolio and CMS data.
- **Cloudinary:** project images, gallery media, profile image, certifications, and resume files.
- **Resend:** server-side contact email delivery; visitor email is used only as `Reply-To`.

## Quality and security

- Public content is read through Supabase RLS policies.
- CMS access requires Supabase authentication and explicit admin authorization.
- Contact submissions are validated server-side and stored before email delivery.
- Do not expose service-role, Cloudinary, or email API credentials to the browser.
