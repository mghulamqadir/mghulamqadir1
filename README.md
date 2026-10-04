# Ghulam Qadir — Portfolio & CMS

A production-oriented portfolio and private content-management system for **Ghulam Qadir**, a backend-focused full stack engineer working with Node.js, AI/RAG, React, APIs, payments, and SaaS platforms.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- MongoDB Atlas, Auth.js JWT sessions, and server-enforced admin authorization
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

## Application structure

```text
app/                 Routes, pages, and Route Handlers
components/          Reusable UI, grouped by feature
lib/auth.ts          Auth.js configuration and admin authorization
lib/content/         CMS content schemas and metadata
lib/database/        Mongoose connection, document helpers, and indexes
lib/repositories/    Persistence operations grouped by domain
lib/data/            Public-page data orchestration and local fallbacks
lib/email/           Transactional email construction
scripts/             One-time database bootstrap, import, and index tasks
types/               Application-wide TypeScript module declarations
```

Route Handlers validate input and authorize the caller; repositories own database access; pages and components never connect to MongoDB directly.

## MongoDB setup and cutover

Create a MongoDB Atlas database and add its connection string as `MONGODB_URI`. Generate an `AUTH_SECRET` (at least 32 random characters) and set the bootstrap owner credentials in server-only environment variables.

1. Run `npm run db:indexes`.
2. Run `npm run db:bootstrap-admin` to create the CMS owner account.
3. For a one-time Supabase cutover only, set `SUPABASE_IMPORT_URL` and `SUPABASE_IMPORT_SERVICE_ROLE_KEY`, then run `npm run db:import-supabase`.
4. Confirm each reported source/target count, sign in with the newly created owner account, then remove the temporary import variables.

The importer is idempotent: it preserves source UUIDs and can be rerun safely. Supabase user passwords are not imported; use the bootstrap account instead.

## Environment variables

Use [`.env.example`](.env.example) as the canonical variable-name reference. Secret values must remain server-only and must never use the `NEXT_PUBLIC_` prefix:

- `MONGODB_URI`
- `AUTH_SECRET`
- `CLOUDINARY_API_SECRET`
- `BREVO_API_KEY`

## Content and media responsibilities

- **MongoDB Atlas:** structured portfolio and CMS data.
- **Cloudinary:** project images, gallery media, profile image, certifications, and resume files.
- **Resend:** server-side contact email delivery; visitor email is used only as `Reply-To`.

## Quality and security

- Public content is read only by server-side MongoDB repositories.
- CMS access requires Auth.js authentication and explicit admin authorization.
- Contact submissions are validated server-side and stored before email delivery.
- Do not expose service-role, Cloudinary, or email API credentials to the browser.
