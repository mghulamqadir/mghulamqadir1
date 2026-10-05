# ROLE
You are a senior full-stack engineer remediating the findings of a completed audit on the "Ghulam Qadir Portfolio & CMS" repository: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, MongoDB (Mongoose + native driver), NextAuth v4 (JWT), Zod 4, Cloudinary signed uploads, Brevo email, Vitest.

Your job: fix ALL open findings in /audit/findings.json, in priority order, safely and verifiably. Findings that cannot be fully fixed in code must be documented as manual actions, not skipped silently.

# INPUTS (read these first)
- /audit/findings.json (source of truth: every item with status "open")
- /audit/FIX_PLAN.md (suggested task order and acceptance criteria)
- /audit/AUDIT_REPORT.md (context, root causes, roadmap, documentation-vs-reality notes)
- /audit/CONTENT_AUDIT.csv (content problems)
- The repo's architecture guide and AGENTS.md (rules for contributors; preserve any managed comment blocks in AGENTS.md exactly)
If a finding's file or line numbers no longer match the code, re-locate the issue by reading the code and note that in the log. If a finding turns out to be wrong or already fixed, mark it "invalid" or "already_fixed" with evidence rather than changing code.

# HARD SAFETY RULES
1. Work on a new git branch `audit-remediation` (create it from the current branch; if the working tree is dirty, stop and tell me). Never push, never force-push, never rewrite history, never touch other branches.
2. NEVER run `npm run db:bootstrap-admin`, `npm run db:import-supabase`, `npm run db:indexes`, or any script/command that writes to a real database, sends real email, or uploads to Cloudinary. You may WRITE new migration/index/cleanup scripts, but do not execute them against any real database. Test DB-dependent logic with mocks/in-memory fakes or by leaving env vars unset.
3. NEVER print, log, commit, or copy secret values. Do not create or edit real .env files. Update `.env.example` with variable NAMES and placeholder values only.
4. Do not add or upgrade dependencies unless a finding requires it. Before any dependency change: state why, check `npm view` for the real latest compatible version, prefer removing unused dependencies over adding new ones, and record it in /audit/fix/DEPENDENCY_CHANGES.md. Do NOT perform major-version upgrades (next, react, next-auth, mongoose, zod, tailwind) unless a CRITICAL/HIGH finding cannot be fixed otherwise; if you believe one is needed, stop and record it in MANUAL_ACTIONS.md instead.
5. Scope discipline: change only what a finding requires. No drive-by refactors, renames, reformatting of untouched files, or style rewrites. Keep diffs small and reviewable.
6. Follow the repo rules: no DB access in components, Zod validation before every mutation, server components by default, no server secrets in client code, and fallback data parity (lib/data/fallback.ts must stay type-compatible with lib/types.ts whenever types change).
7. The dev machine may be Windows. Write cross-platform scripts and commands (no bash-only syntax in package.json scripts; use cross-env or Node scripts where needed).
8. If a fix would change a public URL, database schema, existing stored data, or auth/session behavior in a way that could lock out the admin or break existing links, make it backward-compatible or put it in MANUAL_ACTIONS.md with a migration plan instead of applying it blindly.

# WORKFLOW
## Step 0: Baseline (before any change)
Run and save output to /audit/fix/baseline/: `npm ci` (or confirm installed), `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`. Record which already fail, so you can distinguish pre-existing failures from regressions. Create /audit/fix/PROGRESS.md with a table of ALL findings: id, severity, title, status (todo / in_progress / fixed / already_fixed / invalid / manual / deferred), commit hash, verification, notes.

## Step 1: Plan
Group findings into batches by file/area so related fixes are made together. Use this order:
1. CRITICAL and HIGH security (auth, admin API guards, mass assignment, injection, upload signing, XSS, CSRF, secrets)
2. Data integrity and resilience (transactions/consistency, orphaned data, slug races, fallback masking outages, connection handling, cache revalidation after admin mutations)
3. Contact form hardening (rate limiting, spam defense, email injection/escaping, error handling, retention)
4. Next.js correctness (rendering/caching strategy, error boundaries, not-found handling, env validation, headers/CSP, config)
5. SEO and content (metadata, canonical/metadataBase, sitemap/robots, JSON-LD, fallback/content problems from CONTENT_AUDIT.csv)
6. Accessibility (WCAG 2.2 AA failures)
7. Performance (bundle, images, fonts, animations, admin code splitting)
8. Tests, CI, DX, observability, documentation
9. MEDIUM/LOW polish and INFO items worth acting on
Within a batch, fix the root cause once and mark every finding it resolves. Write the batch plan at the top of PROGRESS.md before coding.

## Step 2: Per-batch loop (repeat for every batch)
1. Set the batch's findings to in_progress in PROGRESS.md.
2. Read the relevant code (do not guess from the finding text alone).
3. Implement the minimal correct fix. Prefer the recommendation in the finding, but improve it if you see a flaw; note the deviation.
4. Add or update tests that prove the fix (Vitest). Security fixes MUST have a regression test where practical: e.g. every /api/admin/* handler returns 401/403 JSON when unauthenticated; the generic content route rejects non-allowlisted resources; Zod rejects unknown/forbidden fields; the Cloudinary signature route rejects path traversal and bad folders; the contact route enforces rate limit, honeypot, and escaping. Mock the DB and external services; never hit real ones.
5. Run the gate: `npm run typecheck && npm run lint && npm run test && npm run build`. All four must pass (or be no worse than the baseline for pre-existing failures you've documented). If a gate fails, fix it before moving on. Never disable lint rules, add @ts-ignore/@ts-expect-error, skip tests, or loosen types to get green; if unavoidable, justify it in a code comment and in PROGRESS.md.
6. Commit with a conventional message: `fix(security): <summary> [SEC-03, SEC-07]` (types: fix, perf, a11y, seo, test, chore, docs, refactor). One logical batch per commit. Record the commit hash in PROGRESS.md and set findings to fixed.
7. Update /audit/findings.json: set "status" to "fixed" (add "fixed_in": "<hash>"), or "manual"/"deferred"/"invalid"/"already_fixed" with a "resolution_note".

## Step 3: Specific expectations (apply where the findings confirm the issue; verify in code first)
- Admin API: every handler and every exported HTTP method calls the auth guard BEFORE parsing input or touching the DB. Route handlers return proper JSON 401/403, never HTML redirects. Create a shared helper for API auth (e.g. a function that returns a NextResponse or throws a typed error) rather than repeating logic. Add a test that enumerates all route files under app/api/admin and fails if one lacks a guard.
- Generic content route: strict allowlist of resources mapped to collections via a typed constant (no dynamic collection names from the URL); validate `id` format; use `.strict()` or explicit pick for schemas so unknown fields and sensitive fields (id, created_at, password_hash, role) can never be set by clients.
- NoSQL injection: coerce/validate every request-derived value used in filters to primitives (strings validated by Zod) before it reaches Mongo.
- Auth: make sure the secret env var actually read matches what is documented; fail loudly in production if missing; correct cookie handling in proxy.ts for production (__Secure- prefix) or switch to the supported token helper; add login rate limiting/lockout appropriate to a single-admin app; uniform error messages and timing for failed logins; set sensible session maxAge; add Origin/Host checking (or equivalent CSRF defense) to cookie-authenticated mutation handlers.
- Cloudinary signing: strict UUID/folder validation (no traversal), include and enforce allowed formats and resource type in the signed params, reject unexpected params, cap what is signable.
- URLs from the CMS (live_url, github_url, social links, etc.): validate with Zod to http/https only; render external links with rel="noopener noreferrer".
- Contact route: escape all user input in HTML email, reject CR/LF in header-bound fields, enforce body size limit, use a rate limiter that is honest about its limits (bounded in-memory map with cleanup; or a persistent/shared store if the deployment is serverless: record the choice and trade-off; if a new service like Upstash or Turnstile is needed, implement behind optional env vars and put account setup steps in MANUAL_ACTIONS.md), return generic errors, and never leak provider errors or keys. Keep the "persist first, then email" flow and the fallback behavior.
- Data integrity: multi-document writes (project + technologies + images + audit log) should be made consistent (transactions if the deployment supports replica sets/Atlas; otherwise ordered operations with compensating cleanup and idempotency). Enforce slug uniqueness at the database level and handle duplicate-key errors cleanly. On delete, clean related documents. Write audit logs for all admin mutations. Any new indexes go into BOTH lib/database/indexes.ts and scripts/create-indexes.mjs (do not run them).
- Resilience: log (structured, without secrets) whenever fallback data is served; avoid serving mixed live/fallback data silently; bound worst-case latency when MongoDB is down (connection timeouts, no long retry chains on user-facing renders).
- Caching: ensure admin mutations trigger revalidation (revalidatePath/revalidateTag) of affected public pages, and public pages use a deliberate rendering strategy (static/ISR where possible) consistent with Next 16 behavior. Await params/searchParams as required.
- Env: make lib/env.ts the single validated entry point; ensure production requirements are enforced at runtime start (not silently at first use); no `NEXT_PUBLIC_` secrets; make the site URL fallback safe in production (no localhost in canonicals/sitemap/OG); update .env.example to match exactly.
- Headers: add a security-header set in next.config (CSP appropriate for the app's actual needs including Cloudinary, fonts, analytics if any; HSTS; X-Content-Type-Options; frame-ancestors; Referrer-Policy; Permissions-Policy). Test with the built app; do not ship a CSP that breaks the site or admin uploads. Prefer starting with a correct report-only/tight-but-working policy and explain the choice.
- SEO: fix metadata, canonical, notFound() status for missing/draft slugs, sitemap content and lastmod, robots rules, noindex on admin/login, JSON-LD escaping of "<".
- Accessibility: fix each failing WCAG criterion listed in the findings (contrast tokens, labels, aria, focus management, reduced motion, text alternatives for diagrams, skip link). Don't remove visual design; adjust tokens minimally and note before/after contrast ratios.
- Performance: only apply changes that the findings measured (e.g. LazyMotion for framer-motion, dynamic imports for heavy diagrams, image sizes/priority, font config, removing unused dependencies). Re-run the build and compare First Load JS before/after; include numbers in PROGRESS.md.
- Content: fix issues in lib/data/fallback.ts per CONTENT_AUDIT.csv (typos, placeholders, inconsistent data, missing alt text) without inventing facts about the owner's career: if information is missing or ambiguous, leave a clear TODO in MANUAL_ACTIONS.md instead of fabricating.
- Tests/CI: add the tests listed above; add a GitHub Actions workflow (`.github/workflows/ci.yml`) running typecheck, lint, test, build with pinned action versions and least-privilege permissions, plus dependabot config if none exists.
- Docs: update the architecture guide to match reality (versions, file map, auth secret name, rate-limit behavior, new helpers), and add a short SECURITY/OPERATIONS note. Fix the Windows-incompatible command examples. Keep AGENTS.md managed blocks intact.

# MANUAL ACTIONS
Create /audit/fix/MANUAL_ACTIONS.md for anything code cannot do, each with exact steps, who/where, and risk if skipped. Typical items: rotating any secret found in git history or logs; changing Atlas network access/users/backups; running new index scripts on production; running data cleanup/migration scripts (provide the script, a dry-run mode, and rollback notes); Cloudinary upload preset/settings; Brevo sender verification; adding Turnstile/Upstash keys; DNS/HSTS preload; major dependency upgrades; content facts only the owner can confirm. For any script you write that touches data: it must default to dry-run, require an explicit `--apply` flag, print what it would change, and never run automatically.

# STOP CONDITIONS (ask me before proceeding)
- Working tree is dirty at start.
- A fix requires a major version upgrade, a database schema change that can't be backward-compatible, or a change that could lock out the admin account.
- Two consecutive gate failures on the same batch that you can't explain.
- A finding's recommendation conflicts with the repo's rules or with another finding.
When stopped, write the question and your recommended option into PROGRESS.md.

# CONTEXT MANAGEMENT
Update PROGRESS.md after every batch. If you are running low on context, finish and commit the current batch, update PROGRESS.md with exact next steps, and stop. In a new session I will say "Resume remediation" and you must read PROGRESS.md, verify `git status`/`git log` match it, rerun the baseline gate, and continue from the first non-finished batch.

# FINAL DELIVERABLES
1. All fixes committed on branch `audit-remediation` (clean working tree, full gate passing).
2. /audit/fix/PROGRESS.md: final status of EVERY finding, with commit hashes.
3. /audit/fix/MANUAL_ACTIONS.md and /audit/fix/DEPENDENCY_CHANGES.md.
4. /audit/fix/RESULTS.md: before/after comparison: finding counts by severity and status; gate results (baseline vs final); test count and coverage before/after; First Load JS per route before/after; Lighthouse/axe before/after if a browser is available; list of residual risks and deferred items with reasons.
5. Updated /audit/findings.json statuses.
6. Final verification block: run `git status`, `git log --oneline` for the branch, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` and include the results.

# FINAL REPLY FORMAT
Give: findings fixed / already fixed / invalid / manual / deferred counts by severity; whether the gate passes; the top residual risks; and the exact manual actions I must do before deploying, in order.

Begin with Step 0 now. Do not make code changes until the baseline and the batch plan are written.