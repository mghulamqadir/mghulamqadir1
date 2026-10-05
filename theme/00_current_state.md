# Phase 0: Current State Audit & Visual Baseline

**Date:** 2026-10-05  
**Auditor:** Principal Product Designer & Front-End Engineer  
**Branch:** `theme-redesign`  

---

## 1. Current Architecture & Visual Look

### Global Tokens & Color Palette
- **Location:** `app/globals.css`
- **Current Palette:**
  - Background: `--background: #09090b` (zinc-950 tone)
  - Elevated surfaces: `--background-elevated: #0f1012`, `--background-card: #121316`, `--background-card-hover: #16171a`
  - Text: `--foreground: #fafafa`, `--foreground-secondary: #a1a1aa`, `--foreground-muted: #9ca3af`, `--foreground-faint: #a1a1aa`
  - Accent: `--accent: #5b8cff` (Electric Blue), `--accent-light: #6c9cff`, `--accent-cyan: #6edaff`
  - Borders: `--border-subtle: rgba(255, 255, 255, 0.08)`, `--border-hover: rgba(255, 255, 255, 0.16)`
- **Problem:** Colors are built around an "Electric Blue / Generic Dark Mode SaaS" palette that clashes completely with the owner's dark double-exposure portrait ("Moonlit Gold"). Many components bypass CSS variables and hardcode raw hex values like `#5b8cff`, `#a1a1aa`, `#71717a`, `#09090b`.

### Typography & Fonts
- **Current Stack:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` for body; `SFMono-Regular, Consolas, Menlo` for monospace.
- **Problem:** No webfont integration (Geist / Geist Mono are missing from `app/layout.tsx`). The site renders system fallback fonts varying across Windows, macOS, and Linux. Display headlines lack optical kerning and tight tracking (`-0.02` to `-0.035em`).

### Layout, Spacing & Container Hierarchy
- Standard container: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` (approx 1152px).
- Vertical rhythm is irregular: Hero uses `pt-12 pb-20 md:pt-20 md:pb-28`, while inner pages jump between `py-16`, `py-20`, and `py-32`.
- Cards share uniform border treatment (`border border-white/10 bg-[#121316] p-6`) with no visual hierarchy distinguishing flagship case studies from secondary skills.

### Navigation & Header / Footer
- **Header:** Sticky with `.glass-panel` (`rgba(9, 9, 11, 0.8)`), 64px (`h-16`). Contains brand mark "GQ", desktop nav links, social icons, and small contact CTA button.
- **Mobile Navigation:** Slide-down drawer with accessible trap and Escape listener, but standard styling.
- **Footer:** Multi-column layout with status indicator ("Systems operational"), social links, and CMS link.

### Hero & Diagrams
- **Hero:** Contains status badge ("Available for select opportunities" — hardcoded, not data-driven), headline ("Backend-Focused Full Stack Engineer"), subtitle, two CTA buttons, and a tech stack pill row.
- **Diagram:** `HeroSystemDiagram` is stacked directly beneath the hero text at full width, displacing all case study work below the fold.
- **Portrait:** Completely absent from the hero and all public pages!

---

## 2. Portrait Asset Inspection

- **File Path:** `public/images/portrait.jpg`
- **Original Dimensions:** 768 x 1024 px (exact 3:4 aspect ratio)
- **File Size:** 518.1 KB (530,583 bytes)
- **Visual Analysis & Focal Points:**
  - **Upper-Left:** Face profile of Ghulam Qadir looking leftward, warm rim lighting along forehead and jaw.
  - **Upper-Right:** Glowing warm golden moon, misty cloud veil, and a multi-tiered mountain pagoda.
  - **Center & Silhouette:** Cascading mountain waterfalls and pine forests blended directly into his dark coat silhouette.
  - **Lower Center / Right:** Japanese torii gate and lantern-lined arched stone bridge glowing with golden light.
  - **Edges:** Deep dark night tone (`#07080B` to `#0D0E12`) on the right edge and bottom.
- **Cropping & Positioning Strategy:**
  - `object-position: 50% 20%` preserves both the face and the golden moon cleanly in frame.
  - An edge fade/vignette using CSS gradient or radial mask will seamlessly blend the dark silhouette into the page background (`--bg: #07080B`).
  - Because file size is 518 KB (> 400 KB budget limit), we must produce an optimized WebP/JPEG version for production delivery to safeguard LCP.

---

## 3. Responsive Screenshot Baseline (theme/before/)

All 28 baseline screenshots have been captured via automated Playwright execution on Windows Edge headless across 4 standard viewports (390x844 mobile, 768x1024 tablet, 1280x720 desktop, 1920x1080 widescreen):

| Route | Viewports Captured | Output Files |
| :--- | :--- | :--- |
| `/` (Homepage) | 390, 768, 1280, 1920 | `theme/before/home-{390,768,1280,1920}.png` |
| `/about` | 390, 768, 1280, 1920 | `theme/before/about-{390,768,1280,1920}.png` |
| `/projects` | 390, 768, 1280, 1920 | `theme/before/projects-{390,768,1280,1920}.png` |
| `/projects/crowdaxis` | 390, 768, 1280, 1920 | `theme/before/project-detail-{390,768,1280,1920}.png` |
| `/experience` | 390, 768, 1280, 1920 | `theme/before/experience-{390,768,1280,1920}.png` |
| `/contact` | 390, 768, 1280, 1920 | `theme/before/contact-{390,768,1280,1920}.png` |
| `/404` (Not Found) | 390, 768, 1280, 1920 | `theme/before/404-{390,768,1280,1920}.png` |

---

## 4. Performance & Lighthouse Baseline

### Lighthouse Mobile Audit (http://localhost:3005/)
- **Performance:** **43 / 100**
- **Accessibility:** **95 / 100**
- **Best Practices:** **100 / 100**
- **SEO:** **100 / 100**
- **Core Web Vitals:**
  - First Contentful Paint (FCP): **1.0 s**
  - Largest Contentful Paint (LCP): **3.8 s**
  - Total Blocking Time (TBT): **1,430 ms**
  - Cumulative Layout Shift (CLS): **0.42** *(High failure threshold > 0.1)*

### First Load JS per Route (Turbopack Client Chunks)
- Shared Polyfill & Turbopack runtime: **119.5 KB raw / 42.5 KB gzip**
- Shared Framework Chunks: **419.2 KB raw / 123.1 KB gzip**
- **Total Shared Client Bundle:** **538.6 KB raw / 165.6 KB gzip**

---

## 5. Top 10 Weaknesses Hurting First Impression

1. **Missing Personal Portrait in Hero:** The hero lacks human presence. In engineering hiring, a compelling personal portrait creates immediate trust and identity.
2. **Generic Electric Blue Palette:** The current `#5b8cff` blue looks like a standard developer template rather than a premium, bespoke engineering studio aesthetic.
3. **Fails the 5-Second Test:** A first-time visitor cannot instantly grasp who Ghulam is, what signature value he provides, and what to click next without encountering an uncontextualized system diagram.
4. **Hero System Diagram Displacing Proof:** The full-width system diagram in the hero pushes case study outcomes and social proof below the fold on both desktop and mobile.
5. **High Cumulative Layout Shift (CLS 0.42):** Unsized SVG elements, fonts, and dynamic diagram nodes trigger layout shifts during initial load.
6. **Hardcoded Hex Tokens Everywhere:** Over 40 components bypass Tailwind CSS variables and hardcode raw `#5b8cff`, `#a1a1aa`, `#71717a`, `#09090b`.
7. **Monotonous Card Grids:** Every section uses identical 1px border rounded rectangles (`bg-[#121316] rounded-2xl`). There is no visual hierarchy, no flagship lead case study, and no editorial breathing room.
8. **Lack of Distinctive Typography:** Uses system default sans-serif without optical tracking or fluid `clamp()` sizing, diminishing the studio polish.
9. **Unbacked Availability Badge:** Displays "Available for select opportunities" without backing by site settings or data model, violating truth-in-advertising guidelines.
10. **Subtle, Low-Affordance CTAs:** Action buttons have standard 38-42px heights and modest contrast, failing to draw immediate focus to "View projects" and "Get in touch".
