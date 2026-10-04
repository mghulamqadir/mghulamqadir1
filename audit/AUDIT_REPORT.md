# Comprehensive Due-Diligence Audit Report: Ghulam Qadir Portfolio & CMS

**Target System**: Ghulam Qadir Portfolio & CMS  
**Stack**: Next.js 16.3.6 (Turbopack, App Router), React 19.2.8, TypeScript 5.9.3, Tailwind CSS v4.3.3, MongoDB (Mongoose 9.10 + Native Driver 7.7), NextAuth v4.24, Zod 4.6, Cloudinary 2.11, Brevo REST API  
**Environment**: Windows 11, Node.js v24.12.0, PowerShell  
**Audit Date**: October 4, 2026  
**Auditor**: Principal Engineer (Pre-Launch Due Diligence)  
**Master Findings File**: `/audit/findings.json` (50 Deduplicated Findings)  

---

## 1. Executive Summary

This independent due-diligence audit evaluated "Ghulam Qadir Portfolio & CMS" across architecture, performance, security, accessibility, SEO, content integrity, UX, testing, operations, and data layers. The system achieves an overall weighted score of **47.6 / 100** (**Letter Grade: F / Incomplete**). The final launch-readiness verdict is **NOT READY FOR PRODUCTION**. While the system features commendable architectural patterns—such as a 3-tier Data Access Layer (DAL) separation, server-signed Cloudinary direct uploads, and layered administrative route guards—it exhibits 3 Critical and 24 High severity pre-launch blockers that will cause immediate production failure.

### Top 5 Architectural Strengths
1. **Strict 3-Tier Data Access Separation**: Public presentation components never import database drivers or execute queries directly; all reads route through `lib/data/public.ts` and mutations through `lib/repositories/*`.
2. **Server-Signed Direct Media Upload Pipeline**: Image uploads leverage server-side Cloudinary HMAC SHA-1 signatures (`/api/admin/cloudinary/signature`), eliminating server bandwidth bottlenecks.
3. **Resilient Data Fallback Architecture**: Compile-time verified fallback datasets in `lib/data/fallback.ts` maintain exact parity with `lib/types.ts` to ensure display continuity during outages.
4. **Layered Administrative Authorization Guards**: All 10 administrative API route handlers independently enforce session authentication via `await requireAdmin()`.
5. **Rigorous Server-Side Zod Validation**: Inbound contact submissions and CMS entity mutations undergo runtime schema validation and string trimming.

### Top 5 Critical Production Risks
1. **Total NextAuth Runtime Crash (`SEC-01`)**: Unenforced optional `AUTH_SECRET` in `lib/env.ts` causes NextAuth v4 to throw HTTP 500 `MissingSecretError` on production auth endpoints.
2. **Search Engine De-indexing via Canonical Self-Cannibalization (`SEO-01`)**: Root `app/layout.tsx` hardcodes `alternates: { canonical: '/' }`, instructing search crawlers to de-index all portfolio subpages.
3. **Connected Empty Database Blank-Slate Failure (`DATA-01`)**: Connecting to an unpopulated MongoDB database returns `[]`, bypassing fallback data and rendering an empty portfolio to visitors.
4. **Stale Cache Lock in Headless CMS (`ARCH-01`)**: Generic CMS content handlers mutate database records without calling `revalidatePath()`, preventing updates from appearing on public pages.
5. **Mobile Performance Degradation (`PERF-01`)**: A 156.2 KB `framer-motion` chunk is bundled globally into the root layout for a minor mobile nav fade, dragging Lighthouse Performance to **68/100** with **1,150ms TBT**.

---

## 2. System Profile & Architectural Topology

### 2.1 Technology Stack & Dependency Inventory
- **Framework & Runtime**: Next.js 16.3.6 (Turbopack, App Router), React 19.2.8, React DOM 19.2.8, TypeScript 5.9.3, Node.js v24.12.0.
- **Styling**: Tailwind CSS v4.3.3 (`@tailwindcss/postcss: 4.3.3`).
- **Data Persistence**: MongoDB Native Driver 7.7.0, Mongoose 9.10.4 (Dual driver setup).
- **Authentication**: NextAuth v4.24.15 (JWT session strategy, custom Credentials Provider).
- **Validation**: Zod 4.6.5.
- **Media & Email**: Cloudinary SDK 2.11.0 (HMAC signed uploads); Brevo REST API (native fetch in `lib/email.ts`).
- **Icons & Animation**: Lucide React 1.48.0; Framer Motion 13.4.4.
- **Testing & Quality**: Vitest 2.1.9, ESLint 9.39.5, `eslint-config-next: 16.3.6`.

### 2.2 Repository Codebase Metrics
```text
Directory         Files     LOC      % of Codebase
--------------------------------------------------
components/          24   1,155          54.8%
lib/                 14     397          18.9%
app/                 23     383          18.2%
scripts/              3      82           3.9%
root (proxy, config)  4      68           3.2%
types/                1      13           0.6%
tests/                1       8           0.4%
--------------------------------------------------
Total Source Code    70   2,106         100.0%
```
*(Documentation files: `plan.md` 4,440 lines; `LLMS.md` 270 lines; `README.md` 76 lines).*

### 2.3 Layered System Topology
```
[ Client Browser / Search Crawlers ]
                │
                ▼
      [ Edge Proxy: proxy.ts ]  <── Matches /admin/:path*, /login (Omits /api/admin/*)
                │
    ┌───────────┴────────────────────────┐
    ▼                                    ▼
[ Public Server Components ]    [ Admin UI & REST API ]
  - app/(public)/*                - app/admin/* (SSR)
  - Prerendered Static (SSG)      - app/api/admin/* (REST)
    │                                    │
    ▼                                    ▼
[ lib/data/public.ts ]          [ lib/repositories/* ]
  - React cache()                 - Projects, Content, Messages, Settings
  - Fallback switch logic         - Auditing (audit_logs collection)
    │                                    │
    └─────────────────┬──────────────────┘
                      ▼
         [ MongoDB Driver & Mongoose ]
         - Native Driver: Repositories
         - Mongoose: Connection Pooling & Models
                      │
                      ▼
            [ MongoDB Atlas Cluster ]
```

---

## 3. Documentation vs. Reality (Claims Verification Matrix)

Audit of the 17 core architectural claims made in the project's LLM System & Architecture Guide (`LLMS.md`):

| # | Architectural Claim | Status | Evidence (File:Lines / Command) | Audit Verification Analysis |
| :-: | :--- | :---: | :--- | :--- |
| **1** | Versions in guide header match package.json | **CONFIRMED** | `package.json:18-46`, `package-lock.json` | Next.js 16.3.6, React 19.2.8, TypeScript 5.9.3, Tailwind 4.3.3, MongoDB 7.7.0, Mongoose 9.10.4 match declared and lockfile resolutions exactly. |
| **2** | Directory map in section 3 matches reality | **PARTIAL** | Root file audit vs `LLMS.md:43-118` | Core structure matches, but map omits root files `plan.md` (53 KB), `CLAUDE.md`, and UI atoms `trust-strip.tsx`, `icons.tsx`, `mobile-admin-nav.tsx`. |
| **3** | Components and pages never import MongoDB directly | **CONFIRMED** | `audit/tmp/check-imports.js` (exited 0) | Comprehensive scan across `app/` and `components/` found 0 direct imports of `mongodb`, `mongoose`, or `@/lib/database`. |
| **4** | Public pages use `@/lib/data/public`; admin uses `@/lib/repositories` | **CONFIRMED** | `audit/tmp/check-data-layers.js` (exited 0) | Strict adherence. Public views consume `@/lib/data/public`. Admin views and API routes consume `@/lib/repositories`. |
| **5** | `lib/data/public.ts` wraps reads in `cache()` and falls back to `fallback.ts` | **PARTIAL** | `lib/data/public.ts:7-21` | `getTestimonials` and `getTechnologies` omit `cache()`. Connected empty database returns `[]` and bypasses fallback. `getProject(slug)` returns `null` on error rather than fallback. |
| **6** | Every handler under `app/api/admin/` calls `requireAdmin()` before any work | **PARTIAL** | `app/api/admin/settings/route.ts:9`, `content/[resource]/route.ts:6` | All 10 handlers call `requireAdmin()`, but `PUT /api/admin/settings` runs `schema.safeParse()` before `requireAdmin()`. Content routes validate resource allowlists before auth. |
| **7** | Admin layout & pages call `requireAdmin()`; `proxy.ts` guards `/admin/:path*` | **CONFIRMED** | `app/admin/layout.tsx:6`, `proxy.ts:1-12` | All admin pages enforce `requireAdmin()`. `proxy.ts` reads JWT token via NextAuth mechanism. Notice: `/api/admin/*` is omitted from `proxy.ts` matcher. |
| **8** | `POST /api/contact`: Zod schema, 30s rate limit, honeypot, DB before email | **CONFIRMED** | `app/api/contact/route.ts:7-31` | All functional requirements implemented. Note: Rate limiter relies on spoofable `x-forwarded-for` and has unbounded in-memory growth. |
| **9** | Cloudinary signature route enforces folder allowlist | **CONFIRMED** | `app/api/admin/cloudinary/signature/route.ts:5-6` | Strict regex validation against documented folder paths; raw uploads restricted to resume. |
| **10** | Generic content route enforces resource allowlist and schemas | **CONFIRMED** | `app/api/admin/content/[resource]/route.ts:6-8` | Enforces `isContentResource()` allowlist and parses incoming bodies against `contentSchemas[resource]`. |
| **11** | Admin mutations write `audit_logs` | **CONFIRMED** | `audit/tmp/check-audit-calls.js` (exited 0) | Every mutating handler (`projects`, `content`, `messages`, `settings`) calls `audit()`. |
| **12** | `lib/env.ts` validates env with Zod; required vars are enforced | **CONTRADICTED** | `lib/env.ts:3-18` | All critical secrets (`AUTH_SECRET`, `MONGODB_URI`, `CLOUDINARY_API_SECRET`, `BREVO_API_KEY`) are marked `.optional()`. Zero variables are enforced at startup. |
| **13** | MongoDB indexes in section 5.2 exist in code and match query patterns | **PARTIAL** | `lib/database/indexes.ts:3-16`, `scripts/create-indexes.mjs:10-20` | 9 documented indexes exist, but query patterns for `experiences` (sort_order), `testimonials` (featured, status), and `audit_logs` (created_at) lack indexes. |
| **14** | Connection pool settings (maxPoolSize 50, minPoolSize 5) match code | **CONFIRMED** | `lib/database/mongodb.ts:5-6, 21-22` | Exact match (`maxPoolSize: 50`, `minPoolSize: 5`, `MAX_RETRIES = 5`). |
| **15** | `fallback.ts` matches `types.ts` for projects, experiences, testimonials | **CONFIRMED** | `lib/data/fallback.ts:1-17`, `lib/types.ts:1-16` | Compiles with 0 TypeScript errors under strict type checking. |
| **16** | "Server Components by default": all "use client" files justified | **CONFIRMED** | `audit/tmp/check-client-components.js` | Exactly 13 files declare `"use client"`, all with legitimate UI interaction or event handling justifications. |
| **17** | Tests: only `tests/validations.test.ts` exists; list what it covers | **CONFIRMED** | `tests/validations.test.ts:1-8` | Single file with 3 assertions (contact schema, honeypot, slug regex). 0 tests for repositories, auth, or routes. |

### Claims Matrix Summary Statistics
- **CONFIRMED**: 10 claims (58.8%)
- **PARTIAL**: 6 claims (35.3%)
- **CONTRADICTED**: 1 claim (5.9%)
- **Total Architectural Claims Audited**: 17 (100.0%)

---

## 4. Scorecard & Weighted System Evaluation

The system was evaluated across nine core dimensions using predefined production due-diligence weights:

| Evaluation Dimension | Weight | Score (0–10) | Weighted Score | Evaluative Justification |
| :--- | :---: | :---: | :---: | :--- |
| **Architecture** | 15% | **6.0** | 0.900 | Clean 3-tier DAL separation, marred by broken CMS cache invalidation and 5 unrendered entities. |
| **Performance** | 15% | **5.5** | 0.825 | Fast static core, severely degraded by a 156 KB unconditioned Framer Motion chunk and unoptimized SSR. |
| **Security** | 15% | **4.5** | 0.675 | Strong signing pipeline, but critical NextAuth crash bug, edge proxy gaps, and timing attacks. |
| **Accessibility** | 12% | **4.0** | 0.480 | Sleek visuals fail fundamental WCAG 2.2 AA criteria (2.57:1 contrast, no skip link, untrapped focus). |
| **SEO** | 10% | **4.0** | 0.400 | Quality metadata on homepage destroyed by root canonical self-cannibalization and soft-404s. |
| **Content Integrity** | 10% | **5.0** | 0.500 | One high-quality lead case study, but 75% of fallback projects are hollow stubs and testimonials unmount. |
| **UX & Responsiveness** | 8% | **6.0** | 0.480 | Attractive responsive UI, lacking essential catalog filtering and unstyled loading boundaries. |
| **Testing, Ops & DX** | 10% | **2.5** | 0.250 | Zero CI/CD automation, near-zero test coverage, broken E2E scripts, and critical dependency CVEs. |
| **Data Layer** | 5% | **5.0** | 0.250 | Mongoose models are well-typed, but empty databases wipe the site and Mongoose connects to `test`. |
| **TOTAL SYSTEM SCORE** | **100%** | — | **4.76 / 10** | **47.6 / 100 (Letter Grade: F / Incomplete)** |

---

## 5. Coverage Statement

### 5.1 Extent of Codebase Review
- **Source Code**: 100% of all 70 source files reviewed across `app/`, `components/`, `lib/`, `scripts/`, `types/`, `proxy.ts`, and configuration files.
- **Automated Tooling Executed**:
  - `npm ci --dry-run` (Lockfile parity verified)
  - `tsc --noEmit` (Type checking: 0 errors verified)
  - `eslint` (Linting: 0 errors verified)
  - `vitest run` (Test execution: 3/3 passed)
  - `next build` (Turbopack production build: 24s compilation verified)
  - `npm audit --json` (10 supply-chain vulnerabilities cataloged)
  - `depcheck` & `knip` (Unused dependencies, dead files, unlisted binaries cataloged)
  - `npx npm-check-updates` (Outdated dependency analysis)
  - `npx license-checker` (All 436 packages audited; copyleft compliance confirmed)
  - `lighthouse` (Headless Chrome v13.5.0 performance and accessibility audit)
- **Live Local Server Probing**:
  - Tested on `http://localhost:3000` using passive HTTP GET/POST/HEAD queries.
  - 9 public routes, 8 admin pages, and 4 API endpoints evaluated.
- **Database Content Audit**:
  - Safe, read-only inspection performed on the configured MongoDB Atlas cluster.
  - Confirmed 0 documents across all collections, revealing the critical empty-database blank-slate defect.

### 5.2 UNVERIFIED Items & Rationale
1. **Live Email Deliverability (Brevo)**: UNVERIFIED. Per Hard Safety Rule 5 (never send real emails), live SMTP delivery to real inboxes was not executed. Verified statically via payload parsing and Brevo REST API code inspection.
2. **Live Cloudinary Asset Upload**: UNVERIFIED. Per Hard Safety Rule 5 (never upload live assets), live asset binary transmissions were not executed. Verified HMAC SHA-1 signature generation and folder allowlists.
3. **Production Edge Network Latency & Global CDN Caching**: UNVERIFIED. Per Hard Safety Rule 6 (no attacks/load tests against deployed URLs), tests were restricted to local `next start`.

---


## Detailed Findings: Architecture & System Topology (ARCH)

### ARCH-01 | HIGH | Missing Cache Revalidation in Generic CMS Content Mutations
- **Location**: `app/api/admin/content/[resource]/route.ts` (Lines: `6`)
- **Evidence**:
```text
In `app/api/admin/content/[resource]/route.ts` and `[id]/route.ts`, mutations execute `createResource`, `updateResource`, and `deleteResource` but never invoke `revalidatePath()`. In contrast, `app/api/admin/projects/route.ts:6` explicitly calls `revalidatePath('/')` and `revalidatePath('/projects')`.
```
- **Impact**: Content edits made to experiences, testimonials, skills, and settings in the CMS will never appear on public prerendered pages until a manual redeployment or unrelated project mutation triggers cache invalidation.
- **Recommendation**:
Import `revalidatePath` from `next/cache` and add revalidation triggers (`revalidatePath('/')`, `revalidatePath('/about')`, `revalidatePath('/experience')`) upon successful completion of POST, PATCH, and DELETE operations in generic content route handlers.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### ARCH-02 | HIGH | Disconnected CMS Resources: 5 Entities Never Displayed on Public Pages
- **Location**: `lib/content/content-config.ts` (Lines: `10-14`)
- **Evidence**:
```text
The CMS defines schemas and administrative management interfaces for `skills`, `education`, `certifications`, `social_links`, and `site_settings`. However, inspection of `lib/data/public.ts` and public page routes shows zero queries or read paths for these 5 collections; public pages display hardcoded UI text instead.
```
- **Impact**: Content authors managing skills, education, certifications, and settings via the admin dashboard will experience zero reflection of their changes on the live website, rendering 50% of the CMS interface completely redundant.
- **Recommendation**:
Wire public read getters in `lib/data/public.ts` (`getSkills`, `getEducation`, `getCertifications`, `getSocialLinks`) into the respective public views (`app/about/page.tsx`, `components/portfolio/tech-stack.tsx`, `components/layout/footer.tsx`), or deprecate the unused admin resources.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### ARCH-03 | HIGH | MongoDB Connection Pool Exhaustion Risk in Serverless Deployments
- **Location**: `lib/database/mongodb.ts` (Lines: `20-27`)
- **Evidence**:
```text
`mongoose.connect()` in `lib/database/mongodb.ts` configures `maxPoolSize: 50` and `minPoolSize: 5`. The connection promise is stored on `global.mongooseConnectionPromise`.
```
- **Impact**: In serverless deployment environments (e.g. Vercel, AWS Lambda), each isolated function instance instantiates its own connection pool. A modest burst of 20 concurrent requests can open up to 1,000 connections, crashing shared MongoDB Atlas tiers (which cap at 500 connections) and causing widespread application outages.
- **Recommendation**:
Dynamically set connection pool sizing based on runtime environment: set `maxPoolSize: 1` or `2` and `minPoolSize: 0` for serverless runtimes, or configure a connection proxy (such as MongoDB Atlas Serverless or Prisma Accelerate).
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### ARCH-04 | HIGH | Non-Transactional Relational Deletions Causing Orphan Database Records
- **Location**: `lib/repositories/projects.ts` (Lines: `39-42`)
- **Evidence**:
```text
`deleteProject()` executes `await Promise.all([db.collection('projects').deleteOne({ id }), db.collection('project_technologies').deleteMany({ project_id: id }), db.collection('project_images').deleteMany({ project_id: id })])` without a MongoDB session or multi-document transaction.
```
- **Impact**: If the application server crashes or a network partition occurs between delete operations, project junction rows or media references remain permanently orphaned in the database, corrupting relational integrity.
- **Recommendation**:
Wrap relational cascade deletions in a MongoDB client session with `session.withTransaction()`: `const session = client.startSession(); try { await session.withTransaction(async () => { ... }); } finally { await session.endSession(); }`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### ARCH-05 | LOW | Dead Code Files and Unused Database Utility Exports
- **Location**: `lib/database/indexes.ts` (Lines: `1-17`)
- **Evidence**:
```text
Static analysis via `knip` and directory search reveals that `lib/database/indexes.ts` (17 lines) is an exact duplicate of `scripts/create-indexes.mjs` and has 0 imports in the repository. Similarly, `components/ui/section.tsx` has 0 references, and `lib/cloudinary.ts` exports an unused `getCloudinary` helper.
```
- **Impact**: Increases codebase maintenance overhead and confuses engineers regarding the canonical location of database index specifications.
- **Recommendation**:
Remove `lib/database/indexes.ts` and `components/ui/section.tsx`, and prune unused exports in `lib/cloudinary.ts` and `lib/database/mongodb.ts`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Data Layer & Database Persistence (DATA)

### DATA-01 | CRITICAL | Empty Connected MongoDB Database Completely Wipes Out Public Portfolio Content
- **Location**: `lib/data/public.ts` (Lines: `7-21`)
- **Evidence**:
```text
Live server probing confirmed that when `MONGODB_URI` connects to an empty database (0 documents), `repository.getPublishedProjects()` resolves with `[]`. Because no exception is thrown, the catch block is bypassed. `lib/data/public.ts` returns empty arrays, completely bypassing `lib/data/fallback.ts`. The public homepage, `/projects`, and `/experience` render 0 items.
```
- **Impact**: A newly provisioned database or accidental collection drop immediately wipes out all portfolio projects, work experience, and testimonials on the public site, displaying an empty blank slate to visitors and prospective clients.
- **Recommendation**:
Refactor fallback conditions in `lib/data/public.ts` to activate when query results are empty: `const result = await repository.getPublishedProjects(); return result.length > 0 ? result : fallbackProjects;`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### DATA-02 | HIGH | Mongoose Connection Ignores MONGODB_DB_NAME Configuration and Connects to 'test'
- **Location**: `lib/database/mongodb.ts` (Lines: `20-27`)
- **Evidence**:
```text
`mongoose.connect(env.MONGODB_URI!, { ... })` in `lib/database/mongodb.ts` does not pass `dbName: env.MONGODB_DB_NAME`. If `MONGODB_URI` does not specify a database name path, Mongoose defaults to database `test`. Conversely, CLI scripts in `scripts/` explicitly target `client.db(MONGODB_DB_NAME)` (defaulting to `portfolio`).
```
- **Impact**: The web application and migration scripts can operate on two completely different databases simultaneously. Migration and bootstrap scripts seed `portfolio` while the live application queries `test`, causing all live queries to return 0 results.
- **Recommendation**:
Explicitly pass `dbName: env.MONGODB_DB_NAME` in the connection options of `mongoose.connect()` in `lib/database/mongodb.ts`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### DATA-03 | HIGH | CMS Project Authoring Cannot Associate Technologies or Gallery Images
- **Location**: `components/admin/project-form.tsx` (Lines: `30-50`)
- **Evidence**:
```text
`ProjectForm` contains zero input controls for selecting associated technologies or managing gallery images. Furthermore, `projectSchema` in `lib/validations.ts:4` omits `technologies` and `images` fields, and `createProject()` in `lib/repositories/projects.ts` only writes to the `projects` collection.
```
- **Impact**: Administrators cannot attach technology tags or gallery screenshots to projects via the CMS UI. Every project created through the CMS is permanently missing technology badges and gallery showcases on public case study pages.
- **Recommendation**:
Add multi-select technology input and gallery image management controls to `ProjectForm`. Update `projectSchema` to validate arrays of technology IDs and image URLs, and update `createProject` / `updateProject` to persist junction rows in `project_technologies` and `project_images`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Security, Authentication & Perimeter Defense (SEC)

### SEC-01 | CRITICAL | AUTH_SECRET Optional in Validation Causing Total Production NextAuth Crash
- **Location**: `lib/env.ts` (Lines: `8`)
- **Evidence**:
```text
`AUTH_SECRET: z.string().min(32).optional()` in `lib/env.ts:8` permits the application to start without a JWT secret. In `.env`, only `JWT_SECRET` is defined. Live HTTP probing confirmed that NextAuth throws `MissingSecretError` (HTTP 500) on `/api/auth/csrf`, `/api/auth/session`, and all admin mutations when `AUTH_SECRET` is unset in production.
```
- **Impact**: Complete denial of service for the administrative portal and authentication subsystem in production. Administrators are permanently locked out of the CMS.
- **Recommendation**:
Make `AUTH_SECRET` strictly required in `lib/env.ts`: `AUTH_SECRET: z.string().min(32)` (or map `JWT_SECRET` fallback: `process.env.AUTH_SECRET || process.env.JWT_SECRET`). Ensure deployment environments inject a cryptographically secure 32+ character secret.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEC-02 | HIGH | Edge Proxy Excludes /api/admin/* and Uses 307 Redirect for API Unauthorized Requests
- **Location**: `proxy.ts` (Lines: `7,12`)
- **Evidence**:
```text
`proxy.ts` matcher configuration specifies `config = { matcher: ['/admin/:path*', '/login'] }`, entirely omitting `/api/admin/*`. Furthermore, `requireAdmin()` in `lib/auth.ts:41` executes `redirect('/login')` which returns an HTTP 307 Temporary Redirect instead of standard 401/403 JSON responses.
```
- **Impact**: All admin REST API endpoints lack edge perimeter protection, forcing every unauthorized API probe to invoke full Node.js runtime execution. API consumers receive HTML redirects instead of JSON error responses, breaking client fetch error handling.
- **Recommendation**:
Update `proxy.ts` matcher to include `'/api/admin/:path*'`. In `proxy.ts` and `requireAdmin()`, differentiate between page requests and API requests: return `NextResponse.json({ error: 'Unauthorized' }, { status: 401 })` for paths starting with `/api/`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEC-03 | HIGH | Critical Supply Chain Vulnerability in Vitest UI Server (CVSS 9.8)
- **Location**: `package.json` (Lines: `40`)
- **Evidence**:
```text
`npm audit --json` identified a CVSS 9.8 Critical vulnerability (GHSA-5xrq-8626-4rwp) in `vitest@2.1.9` allowing arbitrary remote code execution and file reads via the Vitest development server. DevDependencies also carry 6 High severity vulnerabilities in `vite`, `micromatch`, and `braces`.
```
- **Impact**: Developers running Vitest locally or CI environments executing test suites with network exposure are vulnerable to local file read and remote code execution exploits.
- **Recommendation**:
Upgrade `vitest` from `^2.1.9` to `^3.2.6` or latest `^5.0.3` (`npm install -D vitest@latest`), resolving all downstream high and critical advisories.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEC-04 | HIGH | Rate Limiting Bypass via Spoofed Headers and Unbounded Memory Leak in Contact Form
- **Location**: `app/api/contact/route.ts` (Lines: `7-16`)
- **Evidence**:
```text
`const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';` in `app/api/contact/route.ts`. The in-memory `recent = new Map<string, number>()` has zero eviction logic or size ceiling.
```
- **Impact**: Attackers can bypass the 30-second rate limiter completely by rotating spoofed `X-Forwarded-For` header values, exhausting Brevo transactional email quotas and stuffing visitor inboxes. Sustained traffic will cause unbounded Map memory growth, triggering Out-Of-Memory (OOM) server crashes.
- **Recommendation**:
Replace the in-memory Map with a Redis/Upstash sliding window rate limiter, or implement periodic eviction (`setInterval` cleanup every 10 minutes). Do not trust raw `x-forwarded-for` headers unless request ingress is behind a verified reverse proxy.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### SEC-05 | MEDIUM | Admin Email Enumeration via Login Timing Attack
- **Location**: `lib/auth.ts` (Lines: `22-23`)
- **Evidence**:
```text
`if (!profile?.password_hash || profile.role !== 'admin' || !(await bcrypt.compare(password, profile.password_hash))) return null;`. Because JS short-circuits `||`, `bcrypt.compare` (~200ms) only runs if the email exists in the database. Non-existent emails return in <5ms.
```
- **Impact**: Remote attackers can programmatically probe the `/api/auth/callback/credentials` endpoint with candidate emails. Significant response timing discrepancies reveal which email addresses belong to registered administrators.
- **Recommendation**:
Compute a static dummy bcrypt hash at startup. Always execute `bcrypt.compare(password, profile?.password_hash ?? DUMMY_HASH)` to ensure constant-time response execution regardless of email existence.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEC-06 | MEDIUM | Missing Essential HTTP Security Headers (HSTS, CSP, Permissions-Policy)
- **Location**: `next.config.ts` (Lines: `8-10`)
- **Evidence**:
```text
`next.config.ts` configures `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options`, but omits `Strict-Transport-Security` (HSTS), `Content-Security-Policy` (CSP), and `Permissions-Policy`.
```
- **Impact**: Leaves users vulnerable to SSL stripping / man-in-the-middle downgrade attacks (missing HSTS) and leaves the application without defense-in-depth against zero-day cross-site scripting (missing CSP).
- **Recommendation**:
Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` and a tailored `Content-Security-Policy` to the `headers()` configuration array in `next.config.ts`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Runtime Performance & Bundle Delivery (PERF)

### PERF-01 | HIGH | Severe Root Bundle Bloat from Unconditioned Framer Motion
- **Location**: `components/layout/mobile-nav.tsx` (Lines: `7,41-48`)
- **Evidence**:
```text
`import { motion, AnimatePresence } from 'framer-motion';` in `components/layout/mobile-nav.tsx`. Because `Header` in `app/layout.tsx` imports `MobileNav`, a 156.2 KB JavaScript chunk (`static/chunks/3q4wb6r3rugsl.js`) is unconditionally loaded by 100% of visitors on every route, including desktop users where the component has `className='md:hidden'`.
```
- **Impact**: Degrades Lighthouse performance score to 68/100, inflates Total Blocking Time (TBT) to 1,150ms on mobile devices, and wastes 156 KB of bandwidth per initial page load.
- **Recommendation**:
Replace Framer Motion in `mobile-nav.tsx` with standard Tailwind CSS transitions (`transition-all duration-200`, `opacity-0`/`opacity-100`, `translate-y-[-10px]`/`translate-y-0`) or dynamically import `MobileNav` with `next/dynamic` (`ssr: false`).
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### PERF-02 | HIGH | High Dynamic TTFB and Missing Static Generation on Dynamic Case Studies
- **Location**: `app/projects/[slug]/page.tsx` (Lines: `10-11`)
- **Evidence**:
```text
`app/projects/[slug]/page.tsx` lacks `generateStaticParams`. Turbopack build outputs `/projects/[slug]` as `ƒ (Dynamic)` server-rendered on demand. Every request executes `getProject(slug)` querying remote MongoDB Atlas over the network.
```
- **Impact**: TTFB on project case study pages spikes to 250ms–650ms due to database roundtrips. Under traffic spikes, cold serverless invocations and database connection overhead degrade user experience and Core Web Vitals.
- **Recommendation**:
Export `generateStaticParams` in `app/projects/[slug]/page.tsx` to pre-render published project slugs at build time: `export async function generateStaticParams() { const projects = await getProjects(); return projects.map((p) => ({ slug: p.slug })); }` and set `export const dynamicParams = true;`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### PERF-03 | MEDIUM | Unnecessary Client Component Directives on Static Architectural Diagrams
- **Location**: `components/diagrams/hero-system-diagram.tsx` (Lines: `1`)
- **Evidence**:
```text
`components/diagrams/hero-system-diagram.tsx` and `components/diagrams/architecture-diagram.tsx` both declare `"use client";` at line 1 despite containing 0 event handlers, 0 browser APIs, and 0 interactive state (`hero-system-diagram.tsx` contains pure static JSX; `architecture-diagram.tsx` uses only `useMemo` for string splitting).
```
- **Impact**: Forces Next.js Turbopack compiler to ship diagram markup, Lucide icons, and component code into the client JavaScript bundle instead of emitting pure static HTML during server rendering.
- **Recommendation**:
Remove `"use client";` from both diagram components. In `architecture-diagram.tsx`, replace `useMemo(() => value.split(...))` with simple standard string splitting during server execution.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### PERF-04 | MEDIUM | Missing Cloudinary Automatic Format & Compression Optimization Pipeline
- **Location**: `app/projects/[slug]/page.tsx` (Lines: `11`)
- **Evidence**:
```text
`<Image src={project.cover_image_url} ... fill priority sizes="..." />` uses raw Cloudinary URLs directly (`res.cloudinary.com/...`). No custom Cloudinary image loader or URL transformation params (`f_auto,q_auto,w_...`) are configured in `next.config.ts` or component props.
```
- **Impact**: Next.js internal image optimization server (`/_next/image`) must repeatedly download uncompressed source assets from Cloudinary and process them on the application server CPU, increasing memory consumption and initial image delivery latency.
- **Recommendation**:
Implement a custom image loader in `lib/cloudinary.ts` that injects Cloudinary transformations (`f_auto,q_auto`) directly into the asset URL, bypassing Next.js server image re-encoding: `export default function cloudinaryLoader({ src, width, quality }) { return src.replace('/upload/', `/upload/f_auto,q_${quality || 'auto'},w_${width}/`); }`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### PERF-05 | MEDIUM | Lack of Cross-Request Server-Side Data Caching in Data Layer
- **Location**: `lib/data/public.ts` (Lines: `7,12,16`)
- **Evidence**:
```text
`lib/data/public.ts` wraps database getters with React's `cache()` (`import { cache } from 'react';`). React `cache` only memoizes requests within the lifespan of a SINGLE render pass; it does not persist across requests.
```
- **Impact**: Whenever a route is dynamically rendered or revalidated, MongoDB is re-queried across all 4 public datasets, increasing database load and latency.
- **Recommendation**:
Wrap repository calls with Next.js `unstable_cache` from `next/cache` with specific cache tags (`tags: ['projects']`) and revalidation intervals: `export const getProjects = unstable_cache(async () => repository.getPublishedProjects(), ['projects'], { tags: ['projects'], revalidate: 3600 });`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### PERF-06 | LOW | Absence of next/font Subsetting and Variable Font Metric Overrides
- **Location**: `app/globals.css` (Lines: `44-53`)
- **Evidence**:
```text
`app/globals.css` specifies system font stacks `--font-sans: ui-sans-serif, system-ui...` and `--font-mono: 'SFMono-Regular', Consolas...`. There are zero imports of `next/font` in `app/layout.tsx` or any styles.
```
- **Impact**: While avoiding third-party font request latency, typography renders inconsistently across OS environments (Windows displays Segoe UI while macOS displays San Francisco), without optical sizing or modern variable font typographic metrics.
- **Recommendation**:
Adopt `next/font/google` with `Geist` and `Geist_Mono` (or `Inter`) with `subsets: ['latin']`, `display: 'swap'`, and inject CSS variables into `html` tag for seamless cross-platform typography with zero layout shift.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Search Engine Optimization & Indexing (SEO)

### SEO-01 | CRITICAL | Canonical Tag Self-Cannibalization on All Public Subpages
- **Location**: `app/layout.tsx` (Lines: `29`)
- **Evidence**:
```text
`app/layout.tsx:29` declares `alternates: { canonical: '/' }`. None of the public subpages (`/about`, `/projects`, `/experience`, `/contact`) export their own metadata or canonical tags.
```
- **Impact**: Every public subpage explicitly instructs Google and Bing that `/` is the single authoritative canonical URL. Search engines will de-index `/about`, `/projects`, `/experience`, and `/contact`, eliminating the portfolio's organic search visibility.
- **Recommendation**:
Remove `alternates: { canonical: '/' }` from root `app/layout.tsx`. Export explicit metadata with proper page-specific canonicals on each subpage (`alternates: { canonical: '/projects' }`, etc.).
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEO-02 | HIGH | Soft 404 Response on Dynamic Project Detail Route
- **Location**: `app/projects/[slug]/page.tsx` (Lines: `11`)
- **Evidence**:
```text
Live HTTP probe confirmed that `GET /projects/non-existent-slug` returns `HTTP 200 OK` (with HTML title 'Project not found | Ghulam Qadir'). Streaming Suspense boundaries in `app/layout.tsx` flush HTTP 200 headers before `notFound()` executes.
```
- **Impact**: Search engine crawlers index dead/broken project URLs as legitimate 200 OK pages with error content ('Soft 404'), penalizing site domain quality score in Google Search Console.
- **Recommendation**:
Ensure `generateMetadata` in `app/projects/[slug]/page.tsx` calls `notFound()` when the project is missing, or verify that dynamic routes evaluate existence prior to streaming headers.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEO-03 | HIGH | Localhost Domain Leak in Sitemap and Robots.txt When Env Unset
- **Location**: `lib/env.ts` (Lines: `4`)
- **Evidence**:
```text
`NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000')` in `lib/env.ts`. When `NEXT_PUBLIC_SITE_URL` is omitted in production, `app/sitemap.ts` and `app/robots.ts` emit absolute URLs with `http://localhost:3000`.
```
- **Impact**: Submitting the sitemap to Google Search Console leads to 100% crawl rejection because all sitemap URLs point to localhost.
- **Recommendation**:
Make `NEXT_PUBLIC_SITE_URL` strictly required in production without a localhost fallback, or fail the build if `NEXT_PUBLIC_SITE_URL` is missing.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEO-04 | MEDIUM | Admin Workspace and Login Pages Lack Noindex Directives
- **Location**: `app/admin/layout.tsx` (Lines: `1-10`)
- **Evidence**:
```text
`app/admin/layout.tsx` and `app/login/page.tsx` do not specify `robots: { index: false, follow: false }` metadata. While `app/robots.ts` disallows `/admin/`, modern search engines still index URLs discovered via external links if meta robots noindex is missing.
```
- **Impact**: Private administrative login forms and portal URLs can appear in public search engine index results.
- **Recommendation**:
Export `export const metadata: Metadata = { robots: { index: false, follow: false } };` in `app/admin/layout.tsx` and `app/login/page.tsx`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### SEO-05 | MEDIUM | Missing Structured Data on Project Case Studies and JSON-LD Unescaped Content
- **Location**: `app/projects/[slug]/page.tsx` (Lines: `10-12`)
- **Evidence**:
```text
Project detail pages omit `TechArticle` or `SoftwareSourceCode` JSON-LD structured schemas. Furthermore, `components/seo-json-ld.tsx` injects JSON via `dangerouslySetInnerHTML` without escaping closing tags (`</script>`), risking script block termination.
```
- **Impact**: Missing rich snippet eligibility in Google search results and potential markup parsing errors.
- **Recommendation**:
Add rich `SoftwareApplication` / `TechArticle` structured data to project case studies, and sanitize JSON-LD serialization with `.replace(/</g, '\u003c')`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Accessibility & WCAG 2.2 AA Compliance (A11Y)

### A11Y-01 | HIGH | WCAG 1.4.3 Contrast Violations on Muted and Faint Text Tokens
- **Location**: `components/layout/footer.tsx` (Lines: `19,55-64`)
- **Evidence**:
```text
In `components/layout/footer.tsx`: text styled with `#52525b` (`--foreground-faint`) against `#09090b` has a measured contrast ratio of 2.57:1 (failing the 4.5:1 minimum threshold). Text styled with `#71717a` (`--foreground-muted`) against `#09090b` has a measured ratio of 4.11:1. Offending elements: Copyright notice, 'Systems operational' status text, and 'CMS Portal' anchor tag.
```
- **Impact**: Users with low vision or viewing screens in high-ambient lighting environments cannot perceive crucial legal notices, footer links, and status text.
- **Recommendation**:
Elevate `--foreground-muted` from `#71717a` to `#9ca3af` (5.8:1 ratio) and `--foreground-faint` from `#52525b` to `#a1a1aa` (8.5:1 ratio) in `app/globals.css`. Ensure all text elements achieve at least 4.5:1 contrast against `#09090b`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-02 | HIGH | WCAG 1.1.1 & 4.1.2 Failure on SVG Social Icons Lacking Accessible Names
- **Location**: `components/ui/icons.tsx` (Lines: `6,20`)
- **Evidence**:
```text
`GitHubIcon` and `LinkedInIcon` in `components/ui/icons.tsx` render `<svg role='img' ...>` with zero accessible names (`aria-label`, `aria-labelledby`, or inner `<title>` element).
```
- **Impact**: Screen readers announce the icons as unlabelled graphical images. When nested within links or standalone buttons, assistive technologies fail to announce their role and intent properly, triggering automated Lighthouse and axe core failures.
- **Recommendation**:
Remove `role='img'` and replace with `aria-hidden='true'` if the icon is purely decorative alongside text. If the icon represents a standalone button or interactive control, add an explicit `<title>` or pass `aria-label` / `aria-hidden` as props.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-03 | HIGH | WCAG 2.4.1 Bypass Blocks Failure (Missing Skip Navigation Link)
- **Location**: `app/layout.tsx` (Lines: `42-47`)
- **Evidence**:
```text
`app/layout.tsx` renders `<Header />` directly before `<main>` without a Skip to Content link. The `<main>` tag also lacks an `id='main'` attribute.
```
- **Impact**: Keyboard-only and screen-reader users must tab through all header links and buttons on every single page view before reaching the primary page content.
- **Recommendation**:
Add a visually hidden, focus-visible Skip Link at the very top of `<body>` in `app/layout.tsx`: `<a href='#main-content' className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#5b8cff] focus:px-4 focus:py-2 focus:text-white'>Skip to main content</a>` and add `id='main-content'` to `<main>`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-04 | HIGH | WCAG 2.4.3 & 2.1.2 Mobile Navigation Focus Management and Trap Deficiencies
- **Location**: `components/layout/mobile-nav.tsx` (Lines: `33-40,43-49`)
- **Evidence**:
```text
`MobileNav` opens a modal-like navigation overlay when `isOpen === true`. However: 1) The hamburger button lacks `aria-expanded` and `aria-controls`. 2) Focus is not trapped inside the overlay (keyboard users tab into background content). 3) Pressing Escape does not close the menu. 4) Focus does not return to the trigger button upon closing.
```
- **Impact**: Blind and motor-impaired keyboard users become disoriented navigating an open mobile navigation drawer on smaller viewports.
- **Recommendation**:
Add `aria-expanded={isOpen}` and `aria-controls='mobile-navigation-drawer'` to the button. Attach an `onKeyDown` listener checking for `event.key === 'Escape'` to call `close()`. Use a focus-trap wrapper or standard `useEffect` focus management to trap and restore focus.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-05 | HIGH | WCAG 3.3.1, 4.1.3 & 1.3.5 Form Accessibility Violations in Public and Admin Forms
- **Location**: `components/portfolio/contact-form.tsx` (Lines: `3`)
- **Evidence**:
```text
In `ContactForm` and `LoginForm`: 1) Error message `<p className='text-sm text-red-400'>{error}</p>` lacks `role='alert'` and `aria-live='assertive'`. 2) Form inputs lack `aria-invalid` and `aria-describedby` linking to error text. 3) Standard text inputs lack `autoComplete` attributes (`autoComplete='name'`, `autoComplete='email'`, `autoComplete='current-password'`).
```
- **Impact**: When a submission fails or validation triggers, assistive technology remains silent, leaving vision-impaired users unaware that an error occurred or what fields need correction.
- **Recommendation**:
Add `role='alert'` and `aria-live='assertive'` to error containers. Link inputs using `aria-describedby='form-error'` and `aria-invalid={state === 'error'}`. Provide appropriate `autoComplete` attributes on all personal identity inputs.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-06 | MEDIUM | WCAG 2.3.3 & 2.2.2 Reduced Motion Neglect across Animations and Diagrams
- **Location**: `components/diagrams/hero-system-diagram.tsx` (Lines: `22,58`)
- **Evidence**:
```text
`HeroSystemDiagram` utilizes `animate-pulse` and `animate-ping` classes without checking user motion preferences. `MobileNav` animates opacity and translation via Framer Motion without `useReducedMotion()`. 0 occurrences of `motion-reduce` or `prefers-reduced-motion` exist across the codebase.
```
- **Impact**: Users with vestibular disorders or motion sensitivities suffer discomfort and distraction from looping and sudden layout animations.
- **Recommendation**:
Add `motion-reduce:animate-none` to Tailwind pulsing/pinging elements in `hero-system-diagram.tsx` and integrate `useReducedMotion` into Framer Motion animations.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### A11Y-07 | MEDIUM | WCAG 2.4.4 & 4.1.2 Ambiguous Action Button Labels in Admin CMS Lists
- **Location**: `components/admin/content-manager.tsx` (Lines: `22`)
- **Evidence**:
```text
In `ContentManager`, every item row renders generic action buttons: `<button ...>Edit</button>` and `<button ...>Delete</button>` without unique accessible names.
```
- **Impact**: Screen reader users navigating via button lists or Rotor hear a repetitive list of 'Edit', 'Edit', 'Delete', 'Delete' with no indication of which specific entity is being modified or deleted.
- **Recommendation**:
Add an explicit `aria-label` to each action button referencing the item title: `aria-label={`Edit ${item.name || item.company || 'item'}`}` and `aria-label={`Delete ${item.name || item.company || 'item'}`}`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Content Integrity & Fallback Systems (CONT)

### CONT-01 | HIGH | 75% of Fallback Projects Are Hollow Stubs Missing Case Studies and Images
- **Location**: `lib/data/fallback.ts` (Lines: `3-8`)
- **Evidence**:
```text
In `lib/data/fallback.ts`, 3 of the 4 projects (`klippify`, `alevo`, `campgenie`) have empty strings for `overview`, `problem`, `solution`, `my_role`, `outcome`, `cover_image_url`, `live_url`, and `github_url`. Only `crowdaxis` has complete content.
```
- **Impact**: When fallback mode activates, clicking 3 of the 4 featured case studies displays near-empty pages with blank headings, creating an unprofessional, unpolished impression for recruiters and clients.
- **Recommendation**:
Populate complete case study text, roles, challenges, and cover images for all 4 fallback projects in `lib/data/fallback.ts`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### CONT-02 | HIGH | Empty Testimonials Fallback Array Unmounting Social Proof Section
- **Location**: `lib/data/fallback.ts` (Lines: `17`)
- **Evidence**:
```text
`export const fallbackTestimonials: Testimonial[] = [];` in `lib/data/fallback.ts:17`. When MongoDB is offline or unpopulated, `Testimonials` in `components/portfolio/testimonials.tsx:10` hits `if (!testimonials.length) return null;` and completely unmounts.
```
- **Impact**: A key trust-building section on the homepage vanishes silently whenever fallback mode is active.
- **Recommendation**:
Provide 2–3 verified testimonial entries with names, companies, roles, and quotes in `fallbackTestimonials`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### CONT-03 | MEDIUM | Inconsistent Technology Category Taxonomy Between Projects and Global Skills
- **Location**: `lib/data/fallback.ts` (Lines: `13-16`)
- **Evidence**:
```text
Project technologies in `fallbackProjects` use category names like 'Database', 'Backend', 'AI / LLM'. Global technologies in `fallbackTechnologies` use categories like 'Core', 'AI & Data', 'Infrastructure'.
```
- **Impact**: Fragmented technology taxonomy makes skill filtering confusing and inconsistent across different sections of the portfolio.
- **Recommendation**:
Standardize on a unified enum/list of technology categories across `projects`, `technologies`, and `skills`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### CONT-04 | MEDIUM | Hero Architecture Diagram Displays Obsolete PostgreSQL / Supabase Stack
- **Location**: `components/diagrams/hero-system-diagram.tsx` (Lines: `103-107`)
- **Evidence**:
```text
`HeroSystemDiagram` displays 'PostgreSQL / Supabase' and 'ACID • RLS Protected' as the active persistence layer. The portfolio and CMS actually run on MongoDB Atlas, Mongoose, and NextAuth.
```
- **Impact**: Severe technical contradiction on the hero section of a senior backend engineer's portfolio, raising due-diligence concerns about architectural accuracy.
- **Recommendation**:
Update the diagram node copy to reflect the actual MongoDB Atlas / Document Store architecture, or clarify that it represents external client systems.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### CONT-05 | LOW | Architecture Diagram Parser Fails on Standard ASCII Arrow Notation
- **Location**: `components/diagrams/architecture-diagram.tsx` (Lines: `6`)
- **Evidence**:
```text
`value.split(/→|\n/)` in `components/diagrams/architecture-diagram.tsx`. If an author enters standard ASCII `->` or `-->`, the parser treats the entire string as a single unbroken block.
```
- **Impact**: Case study authors entering ASCII arrows end up with unbroken monolithic text blocks instead of sequential diagram stages.
- **Recommendation**:
Update the splitting regex to `/→|->|-->|\n/`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: User Experience & Component Polish (UX)

### UX-01 | HIGH | Projects Catalog Lacks Category Filtering, Search, and URL Query Synchronization
- **Location**: `app/projects/page.tsx` (Lines: `1-15`)
- **Evidence**:
```text
`app/projects/page.tsx` renders a flat static list of projects without search input, category filters, or URL query parameters.
```
- **Impact**: Visitors cannot filter work by domain (e.g. 'AI/RAG', 'Backend', 'Full Stack'), reducing discoverability as the portfolio grows.
- **Recommendation**:
Add client-side category pill filters with URL search params synchronization (`useSearchParams`) to `/projects`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### UX-02 | MEDIUM | Root Loading State Renders Unstyled Text Without Skeleton or Landmarks
- **Location**: `app/loading.tsx` (Lines: `1`)
- **Evidence**:
```text
`app/loading.tsx` renders `<div className='p-8 font-mono text-sm text-[#71717a]'>Loading...</div>`.
```
- **Impact**: Abrupt visual jump and lack of skeleton loading placeholders during client route transitions.
- **Recommendation**:
Replace with an accessible skeleton layout matching the header, hero, and card grid layout.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### UX-03 | MEDIUM | Admin Workspace Lacks Dedicated Error and Loading Boundaries
- **Location**: `app/admin/` (Lines: `0`)
- **Evidence**:
```text
Directory `app/admin/` contains no `loading.tsx` or `error.tsx` file. CMS errors crash into root `app/error.tsx`.
```
- **Impact**: CMS mutation or loading errors disrupt the entire page layout rather than containing errors within the admin view.
- **Recommendation**:
Add `app/admin/loading.tsx` and `app/admin/error.tsx` providing contextual admin recovery buttons.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### UX-04 | MEDIUM | Contact Form Displays Generic Error on Brevo Failure Despite DB Insertion
- **Location**: `app/api/contact/route.ts` (Lines: `24,29`)
- **Evidence**:
```text
When Brevo email delivery fails, the endpoint returns HTTP 502 with error 'Message saved, but email delivery failed.'. However, `ContactForm` displays a red generic error 'Unable to send your message.', prompting the user to submit repeatedly.
```
- **Impact**: Visitors repeatedly resubmit duplicate inquiries, cluttering the database inbox.
- **Recommendation**:
Distinguish between database persistence failure (503) and email dispatch failure (502). For 502, inform the user: 'Your message was saved, though email dispatch was delayed.'
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### UX-05 | LOW | CMS ContentManager Relies on Native Browser Confirm Dialog for Deletions
- **Location**: `components/admin/content-manager.tsx` (Lines: `21`)
- **Evidence**:
```text
`if (!confirm('Delete this item permanently?')) return;` in `ContentManager`.
```
- **Impact**: Jarring browser-native dialog disrupts UX and is not styled to match the dark engineering aesthetic.
- **Recommendation**:
Replace `window.confirm` with an accessible custom modal or confirmation popover.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Test Automation & Verification Surface (TEST)

### TEST-01 | HIGH | Severe Test Coverage Deficit Across Auth, Repositories, and Route Handlers
- **Location**: `tests/validations.test.ts` (Lines: `1-8`)
- **Evidence**:
```text
Repository contains exactly 1 test file with 3 assertions testing two Zod schemas. Zero tests exist for `requireAdmin()`, NextAuth callbacks, any `/api/admin/*` route handlers, `/api/contact` rate limiter and failure paths, repository cascading deletes, or data fallback parity.
```
- **Impact**: Refactors, library upgrades (e.g. Next.js 16.3.6 to 16.3.8 or React 19 patches), or database schema updates can introduce silent regressions and security vulnerabilities unnoticed prior to deployment.
- **Recommendation**:
Implement an automated unit and integration test suite in `tests/` covering: 1) `requireAdmin` redirect and session extraction, 2) `/api/admin/content/[resource]` allowlist validation and 401 unauthenticated enforcement, 3) `/api/contact` honeypot rejection and error reporting, 4) Type parity verification between `lib/data/fallback.ts` and `lib/types.ts`.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### TEST-03 | MEDIUM | Broken End-to-End Test NPM Script Due to Missing Dependency
- **Location**: `package.json` (Lines: `14`)
- **Evidence**:
```text
`package.json` declares `"test:e2e": "playwright test"`, but `@playwright/test` is absent from dependencies and devDependencies, causing `npm run test:e2e` to fail immediately.
```
- **Impact**: Misleads developers and CI systems attempting to execute end-to-end regression tests.
- **Recommendation**:
Either install `@playwright/test` and initialize Playwright configuration, or remove the dead script entry from `package.json`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### TEST-02 | LOW | Missing Vitest Code Coverage Instrumentation Dependency
- **Location**: `package.json` (Lines: `41`)
- **Evidence**:
```text
Running `npx vitest run --coverage` exits with code 1: `@vitest/coverage-v8` is not installed in `devDependencies`.
```
- **Impact**: Developers and automated CI pipelines cannot measure code coverage metrics.
- **Recommendation**:
Install `@vitest/coverage-v8` as a development dependency: `npm install -D @vitest/coverage-v8`.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---


## Detailed Findings: Operations, CI/CD, Observability & Developer Experience (OPS)

### OPS-01 | HIGH | Total Absence of Continuous Integration & Deployment Automation
- **Location**: `.github/workflows` (Lines: `0`)
- **Evidence**:
```text
Directory `.github/workflows/` does not exist. No GitHub Actions, GitLab CI, or pre-commit hooks (Husky / lint-staged) are configured in the repository.
```
- **Impact**: Pull requests and commits can introduce syntax errors, broken TypeScript types, failing builds, or security regressions directly into the `main` branch without verification.
- **Recommendation**:
Establish a GitHub Actions workflow (`.github/workflows/ci.yml`) executing `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` on every push and pull request.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### OPS-02 | HIGH | Missing Indexes and Unbounded Audit Log Storage in MongoDB
- **Location**: `scripts/create-indexes.mjs` (Lines: `10-20`)
- **Evidence**:
```text
1) `audit_logs` collection has zero indexes on `user_id` or `created_at`, and lacks a TTL index. 2) Content collections (`experiences`, `testimonials`, `skills`, `education`, `certifications`, `social_links`) lack indexes for `sort_order` and status filters.
```
- **Impact**: As administrators perform CMS actions, `audit_logs` will grow unboundedly, leading to full-collection scans during audit reviews and eventual database storage exhaustion. Queries on content tables suffer unindexed sorting performance.
- **Recommendation**:
In `scripts/create-indexes.mjs`, create indexes on `audit_logs` (`{ created_at: -1 }`, `{ user_id: 1 }`, and an optional 90-day TTL index `{ created_at: 1 }, { expireAfterSeconds: 7776000 }`), and add `{ sort_order: 1 }` indexes across all content collections.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### OPS-03 | MEDIUM | Zero Production Observability, Crash Tracking, and Fallback Logging
- **Location**: `lib/data/public.ts` (Lines: `8,13,17`)
- **Evidence**:
```text
1) No error-monitoring SDK (Sentry, Datadog, Axiom) is integrated. 2) In `lib/data/public.ts`, fallback data is activated silently without emitting warning logs when `hasMongo()` is false. 3) Failed contact email deliveries are logged to `console.error` without alerting administrators.
```
- **Impact**: Silent system degradations, third-party API rate limits (Brevo/Cloudinary), or database connection drops go completely undetected by engineering until external users complain.
- **Recommendation**:
Integrate Sentry or Axiom for Next.js 16 runtime error tracking. Log structured warnings (`console.warn`) when database fallbacks engage, and trigger alerts on contact email delivery failures.
- **Effort**: `M` | **Confidence**: `High` | **Status**: `open`

---

### OPS-04 | MEDIUM | Documentation and Configuration Discrepancies (Resend vs Brevo & Env Aliases)
- **Location**: `README.md` (Lines: `10,68`)
- **Evidence**:
```text
1) `README.md` lines 10 & 68 state that the project uses 'Resend for transactional contact email', and `package.json` includes `"resend": "^6.30.0"`. However, runtime code in `app/api/contact/route.ts` exclusively uses Brevo via `BREVO_API_KEY`. 2) `.env.example` lists `BREVO_SENDER_EMAIL` and `MONGODB_URI`, while `.env` contains `SENDER_EMAIL` and `MONGO_URI`.
```
- **Impact**: Causes severe confusion for onboarding engineers and operations teams configuring deployment pipelines.
- **Recommendation**:
Update `README.md` to reference Brevo accurately. Remove unused `resend` from `package.json`. Standardize `.env.example` and `lib/env.ts` on canonical variable names (`MONGODB_URI`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`).
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---

### OPS-05 | LOW | Windows Shell Developer Incompatibility in Setup Script Documentation
- **Location**: `scripts/bootstrap-admin.mjs` (Lines: `6-8`)
- **Evidence**:
```text
`scripts/bootstrap-admin.mjs` reads `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` from `process.env`. Standard Unix-style inline assignment `BOOTSTRAP_ADMIN_EMAIL=x node scripts/...` fails in Windows PowerShell.
```
- **Impact**: Developers attempting to bootstrap their local admin account on Windows receive syntax errors and are unable to proceed without troubleshooting PowerShell environment variable syntax.
- **Recommendation**:
Document Windows PowerShell syntax (`$env:BOOTSTRAP_ADMIN_EMAIL="..."; node scripts/bootstrap-admin.mjs`) alongside bash syntax in `README.md`, or accept interactive prompts via `readline` if variables are unset.
- **Effort**: `S` | **Confidence**: `High` | **Status**: `open`

---



## 6. Quick Wins, Remediation Roadmap & Technical Debt

### 6.1 Quick Wins (< 1 Hour Each — Immediate Execution)
1. **Fix Canonical Cannibalization (`SEO-01`)**: Delete line 29 (`alternates: { canonical: '/' }`) from `app/layout.tsx` and configure route-specific metadata.
2. **Enforce `AUTH_SECRET` (`SEC-01`)**: Make `AUTH_SECRET` required in `lib/env.ts` and map `JWT_SECRET` as a fallback.
3. **Fix Empty Database Fallback (`DATA-01`)**: Check `result.length > 0` in `lib/data/public.ts` before returning empty arrays.
4. **Fix Mongoose Database Target (`DATA-02`)**: Pass `dbName: env.MONGODB_DB_NAME` to `mongoose.connect()` in `lib/database/mongodb.ts`.
5. **Protect Admin APIs at Edge (`SEC-02`)**: Add `'/api/admin/:path*'` to `proxy.ts` matcher and return 401 JSON for unauthenticated API requests.
6. **Elevate Color Contrast Tokens (`A11Y-01`)**: Update `--foreground-faint` to `#a1a1aa` and `--foreground-muted` to `#9ca3af` in `app/globals.css`.
7. **Add Skip Navigation Link (`A11Y-03`)**: Insert accessible skip link into `app/layout.tsx`.
8. **Correct Obsolete System Architecture Diagram Copy (`CONT-04`)**: Update "PostgreSQL / Supabase" in `HeroSystemDiagram` to reflect MongoDB.

### 6.2 Prioritized Remediation Roadmap

#### Phase 1: Launch Blockers & Critical Polish (Week 1)
- Strip `framer-motion` from `MobileNav` in favor of pure Tailwind transitions (`PERF-01`).
- Implement `generateStaticParams` on `app/projects/[slug]/page.tsx` (`PERF-02`).
- Implement `revalidatePath` across CMS content mutation routes (`ARCH-01`).
- Patch critical `vitest` dependency advisory via `npm install -D vitest@latest` (`SEC-03`).
- Implement bounded IP tracking and honeypot validation in `/api/contact` (`SEC-04`).
- Populate comprehensive fallback case study narratives for `klippify`, `alevo`, and `campgenie` (`CONT-01`).
- Add 2–3 verified testimonial entries to `fallbackTestimonials` (`CONT-02`).

#### Phase 2: Architecture & Hardening (Weeks 2–3)
- Establish GitHub Actions CI pipeline (`.github/workflows/ci.yml`) for lint, typecheck, test, and build (`OPS-01`).
- Implement unit and integration test suite covering auth, admin routes, and repositories (`TEST-01`).
- Wire unused CMS resources (skills, education, certifications) to public pages (`ARCH-02`).
- Add technology multi-selection and gallery upload controls to `ProjectForm` (`DATA-03`).
- Create indexes and TTL auto-pruning for `audit_logs` in `scripts/create-indexes.mjs` (`OPS-02`).
- Implement Cloudinary automatic format and compression loader (`PERF-04`).
- Convert static architectural diagrams from Client to Server Components (`PERF-03`).

#### Phase 3: Scale & Observability (Weeks 4–6)
- Integrate Sentry or Axiom for runtime error logging and Core Web Vitals telemetry (`OPS-03`).
- Wrap multi-document cascade deletions in MongoDB ClientSession transactions (`ARCH-04`).
- Implement interactive project catalog filtering and search with URL query synchronization (`UX-01`).
- Prune dead dependencies (`resend`, `sonner`) and orphaned files (`ARCH-05`, `OPS-04`).
- Adopt `@next/font/google` for standardized cross-platform typography (`PERF-06`).

### 6.3 Technical Debt Estimate (Engineer-Days)

| Domain | Finding Count | Key Remediation Scope | Estimated Effort |
| :--- | :---: | :--- | :---: |
| **Architecture (ARCH)** | 5 | Add cache revalidation to CMS, wire unused collections, dynamic connection pooling | **2.5 days** |
| **Data Layer (DATA)** | 3 | Fix empty array fallback logic, pass `dbName` to Mongoose, add CMS tech tags | **2.0 days** |
| **Security (SEC)** | 6 | Enforce `AUTH_SECRET`, add API proxy guard, patch Vitest CVE, fix timing attack | **2.0 days** |
| **Performance (PERF)**| 6 | Strip Framer Motion, implement `generateStaticParams`, Cloudinary image loader | **2.0 days** |
| **SEO & Crawling (SEO)**| 5 | Remove root canonical tag, add page metadata, fix soft-404s, add noindex to admin | **1.5 days** |
| **Accessibility (A11Y)**| 7 | Fix color contrast tokens, add skip link, trap mobile nav focus, ARIA form errors | **2.0 days** |
| **Content (CONT)** | 5 | Complete hollow fallback case studies, add testimonials, update Hero diagram copy | **1.5 days** |
| **UX & Polish (UX)** | 5 | Add project category filtering, skeleton loading states, admin error boundaries | **2.0 days** |
| **Testing (TEST)** | 3 | Implement auth, route, and repository unit/integration test suite | **3.0 days** |
| **Operations (OPS)** | 5 | Setup GitHub Actions CI, add MongoDB indexes & TTL, remove dead dependencies | **2.0 days** |
| **TOTAL TECHNICAL DEBT**| **50** | **Complete Pre-Launch Remediation** | **20.5 engineer-days** |

---

## 7. Appendix

### 7.1 Automated Tool Output Summaries
- **TypeScript Compiler (`tsc --noEmit`)**: Exit code `0`. Zero compilation errors across 70 source files.
- **ESLint (`eslint`)**: Exit code `0`. Zero lint warnings or errors.
- **Production Turbopack Build (`next build`)**: Exit code `0`. Compiled in 24.1s. Produced 9 static routes, 15 dynamic routes, and 1 proxy middleware. Total client JavaScript: 848.6 KB.
- **Vulnerability Audit (`npm audit --json`)**: Exit code `1`. 10 vulnerabilities detected (1 Critical, 6 High, 3 Moderate). Critical CVE in `vitest` (<3.2.6: GHSA-5xrq-8626-4rwp).
- **Dependency Health (`depcheck` & `knip`)**: Flagged `resend` and `sonner` as completely unused; flagged `components/ui/section.tsx` and `lib/database/indexes.ts` as dead code; flagged `@playwright/test` as missing unlisted binary.
- **Software Licenses (`license-checker`)**: Audited 436 total packages. 367 MIT, 27 Apache-2.0, 20 ISC, 9 BSD-2-Clause, 3 MPL-2.0, 3 BSD-3-Clause, 1 LGPL-3.0-or-later. Zero copyleft license risks in frontend client bundles.
- **Lighthouse Performance & A11Y Audit**:
  - Performance: **68 / 100** (FCP: 1.1s, LCP: 3.4s, TBT: 1,150ms, CLS: 0.000).
  - Accessibility: **95 / 100** (Sub-4.5:1 contrast failures on footer tokens).
  - Best Practices: **100 / 100**.
  - SEO: **100 / 100** (Homepage only).

### 7.2 Complete Dependency Inventory

| Package Name | Declared Version | Resolved Version | Classification | License | Audit Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `next` | `16.3.6` | `16.3.6` | Production | MIT | Up to date; App Router Turbopack |
| `react` | `19.2.8` | `19.2.8` | Production | MIT | React 19 core runtime |
| `react-dom` | `19.2.8` | `19.2.8` | Production | MIT | React 19 DOM renderer |
| `mongodb` | `^7.7.0` | `7.7.0` | Production | Apache-2.0 | Native MongoDB driver |
| `mongoose` | `^9.10.4` | `9.10.4` | Production | MIT | ODM & connection pooling |
| `next-auth` | `^4.24.15` | `4.24.15` | Production | ISC | JWT session authentication |
| `zod` | `^4.6.5` | `4.6.5` | Production | MIT | Schema validation |
| `cloudinary` | `^2.11.0` | `2.11.0` | Production | MIT | Media management & signatures |
| `resend` | `^6.30.0` | `6.30.0` | Production | MIT | **UNUSED**: Dead dependency |
| `framer-motion` | `^13.4.4` | `13.4.4` | Production | MIT | **BLOAT**: 156 KB mobile nav chunk |
| `lucide-react` | `^1.48.0` | `1.48.0` | Production | ISC | UI iconography |
| `bcryptjs` | `^3.0.3` | `3.0.3` | Production | MIT | Password hashing |
| `sonner` | `^2.0.8` | `2.0.8` | Production | MIT | **UNUSED**: Dead dependency |
| `clsx` | `^2.1.1` | `2.1.1` | Production | MIT | Class string utility |
| `tailwind-merge` | `^3.7.0` | `3.7.0` | Production | MIT | Tailwind conflict resolver |
| `dotenv` | `^16.6.1` | `16.6.1` | Production | BSD-2-Clause | CLI env loader |
| `vitest` | `^2.1.9` | `2.1.9` | Development | MIT | **VULNERABLE**: CVSS 9.8 CVE |
| `eslint` | `^9` | `9.39.5` | Development | MIT | Linter |
| `eslint-config-next` | `16.3.6` | `16.3.6` | Development | MIT | Next.js lint configurations |

### 7.3 Route Verification & Security Perimeter Matrix

| Route Path | Type | Method | Unauthenticated Status | Expected Status | Perimeter Defense Findings |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `/` | Page (SSG) | GET | `200 OK` | `200 OK` | Canonical hardcoded to `/` (`SEO-01`) |
| `/about` | Page (SSG) | GET | `200 OK` | `200 OK` | Inherits root canonical `/` (`SEO-01`) |
| `/projects` | Page (SSG) | GET | `200 OK` | `200 OK` | Empty DB causes 0 items (`DATA-01`) |
| `/projects/[slug]` | Page (SSR) | GET | `200 OK` (Soft-404) | `404 Not Found` | Missing project returns 200 OK (`SEO-02`) |
| `/experience` | Page (SSG) | GET | `200 OK` | `200 OK` | Empty DB causes 0 items (`DATA-01`) |
| `/contact` | Page (SSG) | GET | `200 OK` | `200 OK` | Inherits root canonical `/` (`SEO-01`) |
| `/login` | Page (SSG) | GET | `200 OK` | `200 OK` | Missing noindex header (`SEO-04`) |
| `/robots.txt` | Route (Static) | GET | `200 OK` | `200 OK` | Falls back to localhost if unset (`SEO-03`) |
| `/sitemap.xml` | Route (Static) | GET | `200 OK` | `200 OK` | Falls back to localhost if unset (`SEO-03`) |
| `/admin` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/projects` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/settings` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/messages` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/experience` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/social-links`| Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/testimonials`| Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/admin/media` | Page (SSR) | GET | `307 Redirect` | `307 Redirect` | Edge proxy redirects to `/login` |
| `/api/admin/projects` | API (Dynamic) | GET | `405 Method Not Allowed`| `401 Unauthorized` | Omitted from proxy matcher (`SEC-02`) |
| `/api/admin/settings` | API (Dynamic) | GET | `405 Method Not Allowed`| `401 Unauthorized` | Omitted from proxy matcher (`SEC-02`) |
| `/api/admin/content/*` | API (Dynamic) | GET | `405 Method Not Allowed`| `401 Unauthorized` | Omitted from proxy matcher (`SEC-02`) |
| `/api/admin/cloudinary/signature` | API (Dynamic) | POST | `500 Server Error` | `401 Unauthorized` | MissingSecretError crash (`SEC-01`) |
| `/api/auth/csrf` | Auth (Dynamic) | GET | `500 Server Error` | `200 OK` | NextAuth MissingSecretError (`SEC-01`) |
| `/api/auth/session` | Auth (Dynamic) | GET | `500 Server Error` | `200 OK` | NextAuth MissingSecretError (`SEC-01`) |

### 7.4 Content Dataset Completeness Summary (`CONTENT_AUDIT.csv`)

| Entity Type | Identifier / Title | Completeness Score | Word Count | Defect Summary |
| :--- | :--- | :---: | :---: | :--- |
| **Project** | `crowdaxis` ("CrowdAxis") | **70%** (7/10) | 77 | Missing cover image; missing SEO metadata. |
| **Project** | `klippify` ("Klippify") | **10%** (1/10) | 19 | Missing cover image, case study, problem, solution, architecture, outcome. |
| **Project** | `alevo` ("Alevo") | **10%** (1/10) | 20 | Missing cover image, case study, problem, solution, architecture, outcome. |
| **Project** | `campgenie` ("CampGenie") | **10%** (1/10) | 20 | Missing cover image, case study, problem, solution, architecture, outcome. |
| **Experience** | `zweidevs` (Backend Engineer) | **100%** (6/6) | 9 | Missing company URL and bulleted highlights list. |
| **Experience** | `cinqdev` (Backend Engineer) | **100%** (6/6) | 9 | Missing company URL and bulleted highlights list. |
| **Experience** | `stepinn` (Node.js Developer) | **100%** (6/6) | 9 | Missing company URL and bulleted highlights list. |
| **Testimonial** | `NONE` | **0%** (0/0) | 0 | `fallbackTestimonials` is empty `[]`. Section completely unmounts. |
