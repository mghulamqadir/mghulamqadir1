# Manual Actions Required

The following items could not be automatically remediated in code during this session and require manual intervention from a developer:

## 1. CMS Project Gallery & Technology Multi-Select (DATA-03)
**Reason skipped**: Building a complex interactive UI to associate multiple technologies and upload gallery images within `ProjectForm` is out of scope for the automated remediation context.
**Action required**: 
1. Enhance `components/admin/project-form.tsx` to query all technologies and render a multi-select checkbox group.
2. Build an inline array-upload capability inside `ProjectForm` reusing `MediaUploader` to populate the `gallery_images` array.
*Note: The backend API validation schema and `createProject`/`updateProject` repository logic have already been implemented to persist these arrays.*

## 2. Disconnected CMS Resources (ARCH-02)
**Reason skipped**: The CMS defines management interfaces for `skills`, `education`, `certifications`, `social_links`, and `site_settings`. However, the public-facing pages have no designs or sections implemented to display them. Generating entire new UI sections autonomously risks diverging from the design language.
**Action required**:
1. Wire `getSkills()`, `getEducation()`, `getCertifications()`, and `getSocialLinks()` from `lib/data/public.ts` into public components.
2. Build UI sections for these items in `app/about/page.tsx` and `components/layout/footer.tsx`.
3. Alternatively, if these entities are not needed, deprecate their schemas and remove them from the admin sidebar.

## 3. Database Indexes (OPS-02)
**Reason skipped**: Explicit safety rule states: "NEVER run these scripts or anything equivalent: `npm run db:bootstrap-admin`, `npm run db:import-supabase`, `npm run db:indexes`."
**Action required**: 
The script `scripts/create-indexes.mjs` has been updated with the correct indexes for `audit_logs` and content collections. Run `node scripts/create-indexes.mjs` against the production MongoDB Atlas instance.
