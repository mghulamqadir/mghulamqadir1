# Open Questions & Owner Action Items

This document highlights decisions, placeholder data, or assets that require owner confirmation or manual follow-up before public promotion.

---

## 1. Availability Status Toggle
- **Current State:** The header and hero show a dynamic availability badge: `"Available for select opportunities"` (in production hero proof strip and header pill).
- **Question for Owner:** Would you prefer this availability state to be dynamically driven by a MongoDB site setting (e.g. `SiteSettings.availability`) editable from `/admin/settings`, or remain statically declared in `components/portfolio/brand-config.ts`?
- **Current Location:** Configured in `components/portfolio/brand-config.ts` (`BRAND_CONFIG.availableForWork = true`).

---

## 2. Resume / CV Download Asset
- **Current State:** The Hero secondary button provides `"Download CV"` linking to `/resume.pdf`.
- **Question for Owner:** Please ensure your updated PDF resume is placed at `public/resume.pdf` so visitors clicking "Download CV" receive your latest resume file.
- **Current Fallback:** If `public/resume.pdf` is missing, the button still renders cleanly with `download="Ghulam_Qadir_Resume.pdf"`.

---

## 3. Project Production URLs
- **Current State:** In `lib/data/fallback.ts`:
  - CrowdAxis: `live_url: "https://crowdaxis.com"`, `github_url: "https://github.com/ghulamqadir/crowdaxis"`
  - Klippify: `live_url: "https://klippify.com"`, `github_url: "https://github.com/ghulamqadir/klippify"`
  - Alevo: `live_url: "https://alevo.ai"`, `github_url: "https://github.com/ghulamqadir/alevo"`
  - CampGenie: `live_url: "https://campgenie.com"`, `github_url: "https://github.com/ghulamqadir/campgenie"`
- **Question for Owner:** Are any of these repositories private or have updated public demo URLs? If private, the GitHub button gracefully hides itself when `github_url` is omitted or empty.

---

## 4. Production Cloudinary & Image Uploads
- **Current State:** The local mock/seed database references remote Cloudinary URLs or local assets. In development/testing, if Cloudinary credentials are unset, fallback records are utilized seamlessly.
- **Question for Owner:** Confirm your production Cloudinary environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are configured in Vercel / hosting environment for ongoing CMS image uploads.

---

## 5. Contact Email Service (Brevo)
- **Current State:** The contact form POSTs to `/api/contact` which records inquiries in MongoDB and triggers transactional emails via Brevo when `BREVO_API_KEY` is present.
- **Question for Owner:** Confirm your Brevo sender email and recipient address match the email verified in Brevo.
