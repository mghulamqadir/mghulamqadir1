# Remediation Master Plan: Ghulam Qadir Portfolio & CMS

**Document**: Ordered Remediation Tasks for Coding Agents  
**Target System**: Ghulam Qadir Portfolio & CMS  
**Date**: October 4, 2026  
**Safety Mandate**: Every task is self-contained. For this repository, every task MUST conclude with:
```bash
npm run typecheck && npm run lint && npm run test && npm run build
```
all passing with exit code 0, and MUST preserve fallback-data compile parity (`lib/data/fallback.ts` strictly conforms to `lib/types.ts`).  
**Database Safety Notice**: Never run database mutating scripts (`npm run db:indexes`, `npm run db:bootstrap-admin`, `npm run db:import-supabase`) on production. Tasks referencing database migrations or indexes must be executed ONLY on an isolated staging or test database.

---

## Task Execution Dependency Graph

```
[ Task 1: Auth Secret (SEC-01) ] ───────┐
[ Task 2: Root Canonical (SEO-01) ] ────┼──► [ Phase 1: Launch Blockers ]
[ Task 3: Data Fallback (DATA-01) ] ────┤    (Tasks 1 - 10)
[ Task 4: CMS Revalidate (ARCH-01) ] ───┘           │
[ Task 5: Edge Proxy Guard (SEC-02) ]               ▼
[ Task 6: Vitest Upgrade (SEC-03) ] ────────► [ Phase 2: Architecture & Content ]
[ Task 7: Strip Framer Motion (PERF-01) ]    (Tasks 11 - 14)
[ Task 8: Static Params SSR (PERF-02) ]             │
[ Task 9: A11Y Contrast & Skip (A11Y-01) ]          ▼
[ Task 10: Contact Rate Limit (SEC-04) ] ───► [ Phase 3: UX, Polish & Testing ]
                                             (Tasks 15 - 18)
```

---

## Phase 1: Critical Blockers & Quick Wins (Immediate Priority)

### TASK-01 [CRITICAL | SEC-01]: Enforce `AUTH_SECRET` & Add `JWT_SECRET` Fallback in Environment Validation

#### Metadata
- **Area**: Security (`SEC`)
- **Severity**: CRITICAL
- **Associated Findings**: `SEC-01`
- **Files to Modify**:
  - `lib/env.ts`
  - `lib/auth.ts`

#### Context & Problem
In production, NextAuth v4 strictly requires a valid secret string. In `lib/env.ts`, `AUTH_SECRET` is declared as `z.string().min(32).optional()`. Consequently, when the application is deployed without `AUTH_SECRET` explicitly defined, the server boots without error, but any request to `/api/auth/*` or admin endpoints crashes with HTTP 500 `MissingSecretError: Please define a secret in production`. Furthermore, `.env` contains `JWT_SECRET` but lacks `AUTH_SECRET`.

#### Step-by-Step Instructions
1. Open `lib/env.ts`.
2. Update the environment schema for `AUTH_SECRET`:
   - Inspect `process.env.AUTH_SECRET ?? process.env.JWT_SECRET`.
   - In production (`NODE_ENV === "production"`), enforce that either `AUTH_SECRET` or `JWT_SECRET` is provided with a minimum length of 32 characters.
   - Set `AUTH_SECRET: z.string().min(32).default(() => process.env.JWT_SECRET ?? "")` or equivalent runtime transformation:
   ```typescript
   AUTH_SECRET: z
     .string()
     .min(32, "AUTH_SECRET must be at least 32 characters")
     .optional()
     .or(z.literal(""))
     .transform((val) => val || process.env.JWT_SECRET || "")
     .refine((val) => process.env.NODE_ENV !== "production" || val.length >= 32, {
       message: "AUTH_SECRET or JWT_SECRET (min 32 chars) is required in production",
     }),
   ```
3. Open `lib/auth.ts`. Ensure `authOptions` specifies:
   ```typescript
   secret: env.AUTH_SECRET || process.env.JWT_SECRET,
   ```
4. Update `.env.example` to clearly document:
   ```bash
   # NextAuth Secret (min 32 characters)
   AUTH_SECRET=your-random-32-character-secret-key-here
   JWT_SECRET=your-random-32-character-secret-key-here
   ```

#### Acceptance Criteria
- [ ] NextAuth initializes without error in production mode when either `AUTH_SECRET` or `JWT_SECRET` is set.
- [ ] If neither is set in production, `lib/env.ts` throws a clear Zod validation error at application startup rather than crashing during user requests.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-02 [CRITICAL | SEO-01, SEO-03, SEO-04]: Fix Root Canonical Self-Cannibalization and Configure Route-Specific Metadata

#### Metadata
- **Area**: SEO (`SEO`)
- **Severity**: CRITICAL
- **Associated Findings**: `SEO-01`, `SEO-03`, `SEO-04`
- **Files to Modify**:
  - `app/layout.tsx`
  - `app/about/page.tsx`
  - `app/projects/page.tsx`
  - `app/experience/page.tsx`
  - `app/contact/page.tsx`
  - `app/login/page.tsx`
  - `app/admin/layout.tsx`
  - `app/sitemap.ts`
  - `app/robots.ts`

#### Context & Problem
`app/layout.tsx:29` hardcodes `alternates: { canonical: "/" }`. Because child routes do not export their own metadata, all subpages inherit a canonical pointing to the homepage (`/`), instructing search crawlers to de-index `/about`, `/projects`, `/experience`, and `/contact`. Additionally, `sitemap.ts` and `robots.ts` fall back to `http://localhost:3000`, and administrative pages lack `noindex` directives.

#### Step-by-Step Instructions
1. Open `app/layout.tsx`.
   - Remove the global `alternates: { canonical: "/" }` from the root `metadata` object.
   - Keep `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mghulamqadir.dev")`.
2. Add exported `metadata` to each public page:
   - `app/about/page.tsx`:
     ```typescript
     export const metadata: Metadata = {
       title: "About",
       description: "Learn more about Ghulam Qadir, backend-focused full stack engineer.",
       alternates: { canonical: "/about" },
     };
     ```
   - `app/projects/page.tsx`:
     ```typescript
     export const metadata: Metadata = {
       title: "Projects",
       description: "Case studies and software engineering projects by Ghulam Qadir.",
       alternates: { canonical: "/projects" },
     };
     ```
   - `app/experience/page.tsx`:
     ```typescript
     export const metadata: Metadata = {
       title: "Experience",
       description: "Professional software engineering track record and engineering leadership.",
       alternates: { canonical: "/experience" },
     };
     ```
   - `app/contact/page.tsx`:
     ```typescript
     export const metadata: Metadata = {
       title: "Contact",
       description: "Get in touch with Ghulam Qadir for engineering roles and collaborations.",
       alternates: { canonical: "/contact" },
     };
     ```
3. Open `app/login/page.tsx` and `app/admin/layout.tsx`. Add:
   ```typescript
   export const metadata: Metadata = {
     robots: { index: false, follow: false },
   };
   ```
4. Open `app/sitemap.ts` and `app/robots.ts`.
   - Change the fallback URL from `http://localhost:3000` to `https://mghulamqadir.dev`.

#### Acceptance Criteria
- [ ] Root layout does not emit a static `canonical: /` on subpages.
- [ ] Each public page has its own self-referential canonical URL.
- [ ] Admin pages and login route render `<meta name="robots" content="noindex, nofollow"/>`.
- [ ] Sitemap and robots.txt default to `https://mghulamqadir.dev` when `NEXT_PUBLIC_SITE_URL` is unset.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-03 [CRITICAL | DATA-01, DATA-02]: Fix Empty Database Blank-Slate Fallback & Mongoose Database Target

#### Metadata
- **Area**: Data Layer (`DATA`)
- **Severity**: CRITICAL
- **Associated Findings**: `DATA-01`, `DATA-02`
- **Files to Modify**:
  - `lib/data/public.ts`
  - `lib/database/mongodb.ts`

#### Context & Problem
When the application connects to a newly provisioned, empty MongoDB Atlas cluster, `collection.find().toArray()` resolves with `[]`. Because no exception is thrown, `lib/data/public.ts` returns `[]`, bypassing fallback data and displaying 0 projects and 0 experiences. Furthermore, `mongoose.connect()` in `lib/database/mongodb.ts` omits `dbName: env.MONGODB_DB_NAME`, defaulting to the `test` database.

#### Step-by-Step Instructions
1. Open `lib/data/public.ts`.
   - In `getProjects()`:
     ```typescript
     export const getProjects = cache(async (): Promise<Project[]> => {
       if (!hasMongo()) return fallbackProjects;
       try {
         const repository = await getProjectRepository();
         const data = await repository.getPublishedProjects();
         return data.length > 0 ? data : fallbackProjects;
       } catch (error) {
         console.warn("MongoDB getProjects failed, using fallback:", error);
         return fallbackProjects;
       }
     });
     ```
   - Apply the same empty check (`data.length > 0 ? data : fallback...`) to `getExperiences()`, `getTechnologies()`, and `getTestimonials()`.
   - In `getProject(slug: string)`: Ensure that if database lookup throws or returns null, it checks `fallbackProjects.find((p) => p.slug === slug) ?? null`.
2. Open `lib/database/mongodb.ts`.
   - In `connectMongoose()`, pass `dbName` option:
     ```typescript
     await mongoose.connect(env.MONGODB_URI, {
       dbName: env.MONGODB_DB_NAME,
       maxPoolSize: 50,
       minPoolSize: 5,
     });
     ```

#### Acceptance Criteria
- [ ] Public site renders fallback projects and experiences even when connected to an empty MongoDB database.
- [ ] Mongoose connects explicitly to the database specified in `MONGODB_DB_NAME`.
- [ ] Fallback data parity with `lib/types.ts` is strictly maintained.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-04 [HIGH | ARCH-01]: Add Next.js App Router Cache Revalidation to CMS Content Mutation Endpoints

#### Metadata
- **Area**: Architecture (`ARCH`)
- **Severity**: HIGH
- **Associated Findings**: `ARCH-01`
- **Files to Modify**:
  - `app/api/admin/content/[resource]/route.ts`
  - `app/api/admin/content/[resource]/[id]/route.ts`

#### Context & Problem
In `app/api/admin/content/[resource]/route.ts` and `[id]/route.ts`, `POST`, `PATCH`, and `DELETE` handlers successfully persist mutations in MongoDB and write audit logs, but never invoke `revalidatePath()`. Content updates to experiences, skills, testimonials, and settings are never reflected on statically prerendered public pages.

#### Step-by-Step Instructions
1. Open `app/api/admin/content/[resource]/route.ts`.
   - Import `revalidatePath` from `next/cache`.
   - In the POST handler, upon successful creation, trigger revalidation for impacted public routes:
     ```typescript
     revalidatePath("/");
     revalidatePath("/about");
     revalidatePath("/experience");
     revalidatePath("/projects");
     ```
2. Open `app/api/admin/content/[resource]/[id]/route.ts`.
   - Import `revalidatePath` from `next/cache`.
   - In both PATCH and DELETE handlers, upon successful completion, invoke the same revalidation calls.

#### Acceptance Criteria
- [ ] Every successful POST, PATCH, and DELETE request in CMS content routes triggers `revalidatePath`.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-05 [HIGH | SEC-02]: Protect Admin REST APIs in Edge Proxy and Standardize 401 Unauthorized JSON Responses

#### Metadata
- **Area**: Security (`SEC`)
- **Severity**: HIGH
- **Associated Findings**: `SEC-02`
- **Files to Modify**:
  - `proxy.ts`
  - `lib/auth.ts`

#### Context & Problem
`proxy.ts` configures `matcher: ['/admin/:path*', '/login']`, omitting `/api/admin/:path*`. REST API endpoints lack an edge security perimeter. Furthermore, when unauthenticated requests reach `requireAdmin()`, it throws or issues HTML redirects instead of returning a standard 401 Unauthorized JSON response.

#### Step-by-Step Instructions
1. Open `proxy.ts`.
   - Update `config.matcher` to:
     ```typescript
     export const config = {
       matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
     };
     ```
   - In the proxy handler, check if the request path starts with `/api/admin/`:
     ```typescript
     if (request.nextUrl.pathname.startsWith("/api/admin")) {
       if (!token) {
         return NextResponse.json(
           { error: "Unauthorized: Admin session required" },
           { status: 401 }
         );
       }
       return NextResponse.next();
     }
     ```
2. Open `lib/auth.ts`.
   - Ensure `requireAdmin()` returns or throws a recognizable Unauthorized error, and when called in API routes, yields a JSON 401 response:
     ```typescript
     export async function requireAdminApi() {
       const session = await getServerSession(authOptions);
       if (!session?.user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }
       return session;
     }
     ```

#### Acceptance Criteria
- [ ] Unauthenticated requests to `/api/admin/*` are blocked at the edge proxy with HTTP 401 and JSON body `{"error": "Unauthorized: Admin session required"}`.
- [ ] Unauthenticated requests to `/admin/*` continue to redirect to `/login` with HTTP 307.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-06 [HIGH | SEC-03, TEST-02, TEST-03]: Upgrade Vitest, Install Coverage Tooling, and Fix Test NPM Scripts

#### Metadata
- **Area**: Security / Testing (`SEC` / `TEST`)
- **Severity**: HIGH
- **Associated Findings**: `SEC-03`, `TEST-02`, `TEST-03`
- **Files to Modify**:
  - `package.json`
  - `package-lock.json`

#### Context & Problem
`vitest: ^2.1.9` has a CVSS 9.8 Critical Remote Code Execution vulnerability (GHSA-5xrq-8626-4rwp). Additionally, `@vitest/coverage-v8` is missing, causing `vitest run --coverage` to fail. `npm run test:e2e` fails because `playwright` is not installed.

#### Step-by-Step Instructions
1. Open `package.json`.
   - Upgrade `vitest` in `devDependencies` to `^3.2.6` or latest `^3.x` / `^2.1.9` patched release.
   - Add `@vitest/coverage-v8` to `devDependencies`.
   - Update or comment out the `test:e2e` script, or install `@playwright/test` if E2E is desired:
     ```json
     "test:coverage": "vitest run --coverage",
     ```
2. Run `npm install` (or `npx` upgrade) in accordance with read-only rules during implementation phase.
3. Verify that `npm audit` resolves the critical advisory.

#### Acceptance Criteria
- [ ] `npm audit` reports 0 critical vulnerabilities.
- [ ] `npm run test` executes and passes.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-07 [HIGH | PERF-01, A11Y-04]: Replace Framer Motion with Tailwind Transitions and Implement Accessible Mobile Drawer

#### Metadata
- **Area**: Performance / Accessibility (`PERF` / `A11Y`)
- **Severity**: HIGH
- **Associated Findings**: `PERF-01`, `A11Y-04`
- **Files to Modify**:
  - `components/layout/mobile-nav.tsx`
  - `components/layout/header.tsx`

#### Context & Problem
`framer-motion` adds a 156.2 KB JavaScript chunk to every page load solely for a 200ms mobile dropdown animation. Furthermore, the mobile menu lacks `aria-expanded`, `aria-controls`, focus trapping, Escape key closing, and focus restoration to the hamburger trigger button.

#### Step-by-Step Instructions
1. Open `components/layout/mobile-nav.tsx`.
   - Remove `import { AnimatePresence, motion } from "framer-motion";`.
   - Replace animated wrappers with Tailwind CSS transition classes (`transition-all duration-200 ease-in-out`, `opacity-0 pointer-events-none` vs `opacity-100 pointer-events-auto`).
   - Add accessible keyboard and focus handling:
     - On hamburger button: add `aria-expanded={isOpen}`, `aria-controls="mobile-nav-menu"`, and `id="mobile-nav-trigger"`.
     - On menu panel: add `id="mobile-nav-menu"`, `role="dialog"`, `aria-modal="true"`, `aria-label="Mobile Navigation"`.
     - Implement `useEffect` listener for `Escape` key to close menu and return focus to the hamburger button.
     - Implement focus trap so Tab key cycles within open drawer links.
2. In `package.json`, remove or deprecate `framer-motion` if no other component uses it.

#### Acceptance Criteria
- [ ] Client JavaScript bundle decreases by ~156 KB.
- [ ] Mobile navigation opens and closes smoothly using pure Tailwind CSS transitions.
- [ ] Drawer complies with WCAG 2.1.2, 2.4.3, and 4.1.2 (accessible dialog, focus trap, escape key, focus restoration).
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-08 [HIGH | PERF-02, SEO-02]: Implement `generateStaticParams` and Fix Soft-404 on Project Detail Route

#### Metadata
- **Area**: Performance / SEO (`PERF` / `SEO`)
- **Severity**: HIGH
- **Associated Findings**: `PERF-02`, `SEO-02`
- **Files to Modify**:
  - `app/projects/[slug]/page.tsx`
  - `app/projects/[slug]/not-found.tsx` (create if absent)

#### Context & Problem
Dynamic case study pages (`/projects/[slug]`) omit `generateStaticParams`, forcing on-demand SSR with remote Atlas queries on every request, adding 250–650ms TTFB. When an invalid slug is requested, layout Suspense boundaries stream an HTTP 200 response with "Project not found" (soft-404).

#### Step-by-Step Instructions
1. Open `app/projects/[slug]/page.tsx`.
   - Export `generateStaticParams`:
     ```typescript
     export async function generateStaticParams() {
       const projects = await getProjects();
       return projects.map((p) => ({ slug: p.slug }));
     }
     ```
   - Set `export const dynamicParams = true;`.
   - In `generateMetadata({ params })`, await `params` properly for Next.js 16 conventions:
     ```typescript
     const { slug } = await params;
     const project = await getProject(slug);
     if (!project) return { title: "Project Not Found" };
     return {
       title: project.title,
       description: project.overview || project.tagline || `Case study for ${project.title}`,
       alternates: { canonical: `/projects/${slug}` },
     };
     ```
2. Add dedicated `app/projects/[slug]/not-found.tsx` with semantic 404 presentation to ensure Next.js returns HTTP 404 status.

#### Acceptance Criteria
- [ ] Known project case studies are statically pregenerated at build time (SSG).
- [ ] Non-existent slugs return genuine HTTP 404 status codes.
- [ ] Dynamic case study pages have self-referential canonical URLs and unique metadata.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-09 [HIGH | A11Y-01, A11Y-02, A11Y-03]: Elevate Color Contrast Tokens, Add Accessible SVG Names, and Add Skip Link

#### Metadata
- **Area**: Accessibility (`A11Y`)
- **Severity**: HIGH
- **Associated Findings**: `A11Y-01`, `A11Y-02`, `A11Y-03`
- **Files to Modify**:
  - `app/globals.css`
  - `app/layout.tsx`
  - `components/layout/footer.tsx`
  - `components/ui/icons.tsx`

#### Context & Problem
Footer copyright and "CMS Portal" link use `--foreground-faint` (#52525b on #09090b), delivering only 2.57:1 contrast (violates WCAG 1.4.3). Footer bio uses `--foreground-muted` (#71717a), delivering 4.11:1. The application lacks a Skip to Main Content link (WCAG 2.4.1), and SVG social icons lack accessible text (WCAG 1.1.1).

#### Step-by-Step Instructions
1. Open `app/globals.css`.
   - Update dark mode color tokens:
     ```css
     --foreground-muted: #9ca3af; /* 7.8:1 contrast on #09090b */
     --foreground-faint: #a1a1aa; /* 8.5:1 contrast on #09090b */
     ```
2. Open `app/layout.tsx`.
   - At the beginning of `<body>`, before `<Header />`, insert:
     ```tsx
     <a
       href="#main-content"
       className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-black focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none"
     >
       Skip to main content
     </a>
     ```
   - Add `id="main-content"` and `tabIndex={-1}` to the `<main>` tag.
3. Open `components/ui/icons.tsx`.
   - Update `GitHubIcon` and `LinkedInIcon` to accept `title` prop and render `<title>{title || 'GitHub'}</title>`, or apply `aria-hidden="true"` when enclosed in links with text.
4. Open `components/layout/footer.tsx`. Ensure social links contain `aria-label="GitHub Profile"` and `aria-label="LinkedIn Profile"`.

#### Acceptance Criteria
- [ ] All body text, links, and copyright notices achieve >= 4.5:1 contrast ratio against dark backgrounds.
- [ ] Keyboard users can skip header navigation directly to main content.
- [ ] Screen readers announce social links accurately without ambiguous icon reads.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-10 [HIGH | SEC-04, UX-04, A11Y-05]: Harden Contact API with Bounded In-Memory Map, Honeypot ARIA, and Form Accessibility

#### Metadata
- **Area**: Security / UX / Accessibility (`SEC` / `UX` / `A11Y`)
- **Severity**: HIGH
- **Associated Findings**: `SEC-04`, `UX-04`, `A11Y-05`
- **Files to Modify**:
  - `app/api/contact/route.ts`
  - `components/portfolio/contact-form.tsx`
  - `components/auth/login-form.tsx`

#### Context & Problem
The contact route stores IP timestamps in an unbounded in-memory `Map` without eviction, creating an OOM memory leak under sustained traffic. It also blindly trusts `x-forwarded-for`. Public contact forms lack `autoComplete` attributes, form error messages lack `role="alert"`, and Brevo email delivery failures return generic 500 errors to visitors even when the message is safely persisted to MongoDB.

#### Step-by-Step Instructions
1. Open `app/api/contact/route.ts`.
   - Implement map eviction / LRU cleanup:
     ```typescript
     const RATE_LIMIT_WINDOW = 30 * 1000; // 30s
     const MAX_TRACKED_IPS = 1000;
     const ipRequests = new Map<string, number>();

     function isRateLimited(ip: string): boolean {
       const now = Date.now();
       if (ipRequests.size > MAX_TRACKED_IPS) {
         for (const [key, timestamp] of ipRequests.entries()) {
           if (now - timestamp > RATE_LIMIT_WINDOW) ipRequests.delete(key);
         }
       }
       const last = ipRequests.get(ip);
       if (last && now - last < RATE_LIMIT_WINDOW) return true;
       ipRequests.set(ip, now);
       return false;
     }
     ```
   - Fallback IP resolution: `request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1"`.
   - When database save succeeds but Brevo delivery fails, record `email_status: "failed"` and still return `{ success: true, message: "Message received" }` with status 200, logging a warning rather than breaking the user experience.
2. Open `components/portfolio/contact-form.tsx`.
   - Add `autoComplete="name"` to name input, `autoComplete="email"` to email input.
   - Add `role="alert"` and `aria-live="assertive"` to the error notification message.
   - Add `aria-invalid={!!errors.email}` and `aria-describedby` linking to error labels.
3. Open `components/auth/login-form.tsx`.
   - Add `autoComplete="email"` and `autoComplete="current-password"`.
   - Add `role="alert"` to the login error box.

#### Acceptance Criteria
- [ ] Rate limiter evicts expired timestamps and bounds memory usage to prevent OOM.
- [ ] Contact form submission handles email provider degradation gracefully without losing messages.
- [ ] Form inputs have standard autocomplete and accessible error announcements.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

## Phase 2: Architecture, Content & Hardening (High Priority)

### TASK-11 [HIGH | CONT-01, CONT-02, CONT-03]: Populate Complete Fallback Case Studies and Testimonials

#### Metadata
- **Area**: Content Integrity (`CONT`)
- **Severity**: HIGH
- **Associated Findings**: `CONT-01`, `CONT-02`, `CONT-03`
- **Files to Modify**:
  - `lib/data/fallback.ts`
  - `lib/types.ts`

#### Context & Problem
75% of fallback projects (`klippify`, `alevo`, `campgenie`) are hollow 10% stubs missing overviews, challenges, architectures, and outcomes. `fallbackTestimonials` is completely empty (`[]`), unmounting the homepage social proof section. Category taxonomies have duplicate "Database" vs "Databases" entries.

#### Step-by-Step Instructions
1. Open `lib/data/fallback.ts`.
   - Populate complete case study narratives for `klippify` (Video Processing Pipeline), `alevo` (Fintech / Banking Core), and `campgenie` (AI Camping Platform) with:
     - `overview`, `problem`, `solution`, `architecture`, `challenges`, `outcome`, `metrics`, and `tags`.
   - Populate 2–3 verified testimonial entries in `fallbackTestimonials` (e.g. engineering managers, co-founders) with valid `quote`, `author`, `role`, and `company`.
   - Standardize category taxonomies across all objects to use `Databases` (plural) consistently.
2. Confirm that `lib/data/fallback.ts` strictly conforms to the `Project`, `Experience`, and `Testimonial` interfaces defined in `lib/types.ts`.

#### Acceptance Criteria
- [ ] All 4 fallback projects have >= 80% completeness scores with rich technical narratives.
- [ ] `fallbackTestimonials` contains at least 2 entries; homepage testimonials section renders cleanly.
- [ ] Fallback-data parity is 100% maintained.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-12 [HIGH | DATA-03]: Add Technology Multi-Selection and Gallery Controls to CMS Project Form

#### Metadata
- **Area**: Data Layer (`DATA`)
- **Severity**: HIGH
- **Associated Findings**: `DATA-03`
- **Files to Modify**:
  - `components/admin/project-form.tsx`
  - `lib/validations.ts`

#### Context & Problem
`ProjectForm` provides no UI inputs to assign technologies or upload gallery images. Furthermore, `ProjectForm` marks `company` and `role` as optional, while `projectSchema` requires non-empty strings, causing submissions to fail with HTTP 400.

#### Step-by-Step Instructions
1. Open `lib/validations.ts`.
   - Align `projectSchema`: allow `company` and `role` to be optional strings (`z.string().optional()`), or update the form UI with mandatory indicators.
   - Add schema validation for `technology_ids: z.array(z.string()).optional()`.
2. Open `components/admin/project-form.tsx`.
   - Add technology multi-select tag input or checkbox group.
   - Integrate `MediaUploader` to allow attaching gallery images in addition to the cover image.
   - Synchronize submit payload with the updated schema.

#### Acceptance Criteria
- [ ] Administrators can select technologies and upload gallery images when authoring projects.
- [ ] Form submission succeeds without schema mismatch validation errors.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-13 [HIGH | ARCH-02]: Wire Skills, Education, Certifications, and Social Links to Public Pages

#### Metadata
- **Area**: Architecture (`ARCH`)
- **Severity**: HIGH
- **Associated Findings**: `ARCH-02`
- **Files to Modify**:
  - `lib/data/public.ts`
  - `app/about/page.tsx`
  - `components/portfolio/tech-stack.tsx`
  - `components/layout/footer.tsx`

#### Context & Problem
The CMS defines schemas and admin dashboards for `skills`, `education`, `certifications`, and `social_links`. However, public pages never query these collections; they display hardcoded UI text instead, making 50% of the CMS redundant.

#### Step-by-Step Instructions
1. Open `lib/data/public.ts`.
   - Export `getSkills()`, `getEducation()`, `getCertifications()`, and `getSocialLinks()` with MongoDB queries and fallback defaults.
2. Open `components/portfolio/tech-stack.tsx`.
   - Update component to accept dynamic skills/technologies from `lib/data/public.ts`.
3. Open `app/about/page.tsx`.
   - Render dynamic education and certification sections populated from the data layer.
4. Open `components/layout/footer.tsx`.
   - Render social links dynamically based on `getSocialLinks()`.

#### Acceptance Criteria
- [ ] CMS updates to skills, education, certifications, and social links are displayed on public pages.
- [ ] Hardcoded mock data in public components is replaced with DAL calls.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-14 [HIGH | OPS-01, OPS-02]: Setup GitHub Actions CI Pipeline and Database Indexes with TTL

#### Metadata
- **Area**: Operations (`OPS`)
- **Severity**: HIGH
- **Associated Findings**: `OPS-01`, `OPS-02`
- **Files to Modify**:
  - `.github/workflows/ci.yml` (create file)
  - `scripts/create-indexes.mjs`
  - `lib/database/indexes.ts`

#### Context & Problem
The repository has zero automated CI/CD pipelines. `audit_logs` has no indexes and no TTL expiration, creating unbounded database growth.

#### Step-by-Step Instructions
1. Create `.github/workflows/ci.yml`:
   ```yaml
   name: CI
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   jobs:
     verify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: 'npm'
         - run: npm ci
         - run: npm run typecheck
         - run: npm run lint
         - run: npm run test
         - run: npm run build
   ```
2. Open `scripts/create-indexes.mjs` and `lib/database/indexes.ts`.
   - Add compound indexes:
     - `experiences`: `{ sort_order: 1 }`
     - `testimonials`: `{ featured: 1, sort_order: 1 }`
     - `audit_logs`: `{ created_at: -1 }` and TTL index `{ expireAfterSeconds: 7776000 }` (90 days).
   > **STAGING DATABASE SAFETY NOTE**: Running `npm run db:indexes` must be executed ONLY against a staging or test database, NEVER against production without planned maintenance.

#### Acceptance Criteria
- [ ] CI workflow file is created and validates typecheck, lint, test, and build.
- [ ] Indexes for audit logs and query patterns are documented and added.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

## Phase 3: UX, Polish & Scaling (Medium / Polish Priority)

### TASK-15 [MEDIUM | SEC-05, SEC-06]: Fix Login Timing Attack and Complete HTTP Security Headers

#### Metadata
- **Area**: Security (`SEC`)
- **Severity**: MEDIUM
- **Associated Findings**: `SEC-05`, `SEC-06`
- **Files to Modify**:
  - `lib/auth.ts`
  - `next.config.ts`

#### Context & Problem
Password validation short-circuits on non-existent emails, allowing attackers to enumerate valid admin emails via response timing differences (~5ms vs ~200ms). `next.config.ts` lacks HSTS, CSP, and Permissions-Policy headers.

#### Step-by-Step Instructions
1. Open `lib/auth.ts`.
   - Precompute a dummy bcrypt hash: `const DUMMY_HASH = "$2a$12$e80yq5kZf6X1l7sWf7Y5Ue5m5K5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5";`.
   - In `authorize(credentials)`, if user is not found, still execute `await bcrypt.compare(credentials.password, DUMMY_HASH)` before returning null.
2. Open `next.config.ts`.
   - Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
   - Add `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
   - Configure basic Content-Security-Policy header.

#### Acceptance Criteria
- [ ] Password verification takes consistent time regardless of email validity.
- [ ] Security headers include HSTS, CSP, and Permissions-Policy.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-16 [MEDIUM | PERF-03, PERF-04]: Convert Diagrams to Server Components and Add Cloudinary Optimization Loader

#### Metadata
- **Area**: Performance (`PERF`)
- **Severity**: MEDIUM
- **Associated Findings**: `PERF-03`, `PERF-04`
- **Files to Modify**:
  - `components/diagrams/hero-system-diagram.tsx`
  - `components/diagrams/architecture-diagram.tsx`
  - `lib/cloudinary.ts`

#### Context & Problem
Diagrams declare `"use client"` despite containing no browser APIs or client state. Cloudinary image URLs lack automatic format and compression parameters (`f_auto,q_auto`), forcing Next.js server CPU to resize uncompressed originals.

#### Step-by-Step Instructions
1. Open `components/diagrams/hero-system-diagram.tsx` and `components/diagrams/architecture-diagram.tsx`.
   - Remove `"use client";` directive.
   - Refactor `useMemo` in `architecture-diagram.tsx` to standard server computation.
2. Open `lib/cloudinary.ts`.
   - Add a Cloudinary image URL transformation helper:
     ```typescript
     export function getOptimizedImageUrl(url: string, width = 800): string {
       if (!url.includes("res.cloudinary.com")) return url;
       return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
     }
     ```

#### Acceptance Criteria
- [ ] Diagrams render as Server Components with 0 client JS hydration payload.
- [ ] Cloudinary images use automatic WebP/AVIF format and quality compression.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-17 [MEDIUM | UX-01, UX-02, UX-03, UX-05, A11Y-07]: Add Project Filtering, Style Loading States, and Add Admin Boundaries

#### Metadata
- **Area**: UX / Accessibility (`UX` / `A11Y`)
- **Severity**: MEDIUM
- **Associated Findings**: `UX-01`, `UX-02`, `UX-03`, `UX-05`, `A11Y-07`
- **Files to Modify**:
  - `app/projects/page.tsx`
  - `components/portfolio/project-filter.tsx` (create file)
  - `app/loading.tsx`
  - `app/admin/loading.tsx` (create file)
  - `app/admin/error.tsx` (create file)
  - `components/admin/content-manager.tsx`

#### Context & Problem
The projects catalog is an unfilterable grid without category pills. Root loading state renders unstyled text. The admin dashboard lacks dedicated loading and error boundaries. CMS list buttons have ambiguous labels ("Edit", "Delete").

#### Step-by-Step Instructions
1. Create `components/portfolio/project-filter.tsx` with category buttons (All, Full Stack, Backend, Systems, AI) that filter projects via URL query parameter or client state.
2. Open `app/loading.tsx`. Replace plain text with an accessible skeleton layout using Tailwind `animate-pulse`.
3. Create `app/admin/loading.tsx` and `app/admin/error.tsx` to catch admin interface errors gracefully.
4. Open `components/admin/content-manager.tsx`.
   - Update action buttons: `<button aria-label={`Edit ${item.title || item.name || 'item'}`}>Edit</button>`.

#### Acceptance Criteria
- [ ] Visitors can filter projects by category.
- [ ] Loading transitions display polished skeletons.
- [ ] Admin pages handle network or query errors gracefully without breaking the layout.
- [ ] Verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```

---

### TASK-18 [LOW | ARCH-03, ARCH-04, ARCH-05, OPS-04, OPS-05, CONT-04, CONT-05, TEST-01]: Clean Up Dead Dependencies, Relational Transactions, Serverless Pooling, and Core Test Suite

#### Metadata
- **Area**: Architecture / Operations / Testing (`ARCH` / `OPS` / `TEST`)
- **Severity**: LOW / MEDIUM
- **Associated Findings**: `ARCH-03`, `ARCH-04`, `ARCH-05`, `OPS-04`, `OPS-05`, `CONT-04`, `CONT-05`, `TEST-01`
- **Files to Modify**:
  - `package.json`
  - `lib/repositories/projects.ts`
  - `lib/database/mongodb.ts`
  - `components/diagrams/hero-system-diagram.tsx`
  - `components/diagrams/architecture-diagram.tsx`
  - `tests/auth.test.ts` (create file)
  - `tests/repositories.test.ts` (create file)
  - `README.md`

#### Context & Problem
Cascade deletions in `projects.ts` lack MongoDB sessions/transactions. Connection pool size 50 is excessive for serverless. Dead dependencies (`resend`, `sonner`) clutter `package.json`. Hero diagram references obsolete PostgreSQL/Supabase. Only 3 trivial tests exist.

#### Step-by-Step Instructions
1. Open `package.json`.
   - Remove `resend` and `sonner` dependencies.
2. Open `lib/repositories/projects.ts`.
   - Wrap `deleteProject()` operations in a MongoDB client session transaction where supported.
3. Open `lib/database/mongodb.ts`.
   - Adjust `maxPoolSize` to `process.env.VERCEL ? 2 : 50` and `minPoolSize: 0` for serverless.
4. Open `components/diagrams/hero-system-diagram.tsx`.
   - Update database node copy from "PostgreSQL / Supabase" to "MongoDB / Mongoose".
5. Open `components/diagrams/architecture-diagram.tsx`.
   - Update string split regex to handle ASCII arrows: `/→|->|-->|
/`.
6. Create `tests/auth.test.ts` and `tests/repositories.test.ts` testing:
   - Secret enforcement logic.
   - Fallback data parity when database is disconnected or empty.
   - Zod validation edge cases.
7. Open `README.md`. Update email provider documentation from Resend to Brevo.

#### Acceptance Criteria
- [ ] `resend` and `sonner` are removed with 0 compilation errors.
- [ ] Hero diagram accurately reflects the production MongoDB architecture.
- [ ] Unit test suite expands to cover authentication and repository fallback logic.
- [ ] Final verification command passes:
  ```bash
  npm run typecheck && npm run lint && npm run test && npm run build
  ```
