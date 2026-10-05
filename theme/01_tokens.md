# Phase 1: Design Tokens Specification ("Moonlit Gold")

**Date:** 2026-10-05  
**Version:** 1.0.0  
**Engine:** Tailwind CSS v4 (`@theme` in `app/globals.css`)  

---

## 1. Design Direction: "Moonlit Gold"
The palette directly echoes the owner's dark double-exposure portrait (`public/images/portrait.jpg`): near-black night tones, a glowing gold moon and lanterns, and subtle blue-grey mountain mist. The visual weight strictly adheres to the **90% / 8% / 2% rule**:
- **90% Neutrals:** Near-black backgrounds, elevated surface cards, hairline dividers, off-white text.
- **8% Accent:** Moonlit Gold for primary CTAs, links, focal indicators, and interactive states.
- **2% Secondary:** Fog blue for subtle gradients and technical diagram node accents.

---

## 2. Core Semantic Token Palette

### Primary Palette: "Moonlit Gold" (Default)
| Token | Hex / Value | Role | Ratio vs `#07080B` (Page BG) | Ratio vs `#13141A` (Surface) | WCAG Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--bg` | `#07080B` | Canvas background | Base (1.00:1) | — | — |
| `--bg-elevated` | `#0D0E12` | Header, footer, bands | 1.05:1 | — | Base |
| `--surface` | `#13141A` | Cards, panels | 1.10:1 | Base (1.00:1) | Base |
| `--surface-2` | `#1A1C23` | Raised/hover cards, inputs | 1.20:1 | 1.09:1 | Base |
| `--border` | `#25262E` | Hairline dividers | 1.33:1 | 1.21:1 | Structural |
| `--border-strong` | `#5E6174` | Active borders, input borders | **3.28:1** | **3.01:1** | **WCAG 2.2 AA (>= 3:1)** |
| `--text` | `#F2EEE6` | Primary body and headings | **17.31:1** | **15.88:1** | **WCAG 2.2 AAA (>= 7:1)** |
| `--text-muted` | `#ABA9A6` | Secondary copy, descriptions | **8.54:1** | **7.84:1** | **WCAG 2.2 AAA (>= 7:1)** |
| `--text-faint` | `#8B8D95` | Metadata, tags, dates | **6.05:1** | **5.55:1** | **WCAG 2.2 AA (>= 4.5:1)** |
| `--accent` | `#F2B864` | Moon gold CTA fill, links | **11.27:1** | **10.34:1** | **WCAG 2.2 AAA (>= 7:1)** |
| `--accent-strong`| `#FFCB7E` | Hover/pressed CTA state | **13.08:1** | **12.00:1** | **WCAG 2.2 AAA (>= 7:1)** |
| `--accent-ink` | `#231600` | Text on `--accent` buttons | **9.96:1** *(vs #F2B864)* | — | **WCAG 2.2 AAA (>= 7:1)** |
| `--accent-glow` | `rgba(242,184,100,0.20)` | Button & card ambient glow | — | — | Decorative |
| `--accent-2` | `#9DB4D6` | Fog blue gradient tail | **9.53:1** | **8.74:1** | **WCAG 2.2 AAA (>= 7:1)** |
| `--success` | `#4ADE80` | Status indicators | **12.56:1** | **11.52:1** | Pass |
| `--warning` | `#FBBF24` | Warnings, notes | **11.83:1** | **10.85:1** | Pass |
| `--danger` | `#F87171` | Form validation errors | **6.31:1** | **5.79:1** | Pass |

### Signature Gradient Rule
- **Formula:** `linear-gradient(135deg, #F2B864 0%, #9DB4D6 100%)`
- **Permitted Locations ONLY:**
  1. Exactly **one** word in the Hero H1 headline.
  2. The 1px hairline border of the **featured lead project card** (`border-signature-gradient`).
  3. The primary CTA button hover glow.
  *(Strictly prohibited on body copy, generic cards, or backgrounds).*

---

## 3. Contrast Calibration Record (Before vs After)

Under WCAG 2.2:
- Primary text requires >= 4.5:1 (AA) and preferably >= 7.0:1 (AAA).
- UI component boundaries without background contrast (e.g., input borders) require >= 3.0:1 (WCAG 2.2 1.4.11).
- Every text element must achieve at least 4.5:1.

| Element | Initial Proposed Hex | Initial Ratio | Calibrated Final Hex | Final Ratio | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Moonlit Gold `--border-strong` | `#363945` | 1.74:1 | `#5E6174` | **3.28:1** | Elevates input borders to meet WCAG 2.2 1.4.11 UI non-text threshold (>= 3:1). |
| Obsidian Mint `--text-faint` | `#718096` | 4.47:1 | `#78889E` | **4.97:1** | Ensures metadata text passes 4.5:1 threshold on card surfaces. |
| Graphite & Amber `--text-faint` | `#71717A` | 4.09:1 | `#82828C` | **4.79:1** | Ensures faint metadata text passes 4.5:1 on `#0A0A0B`. |
| Graphite & Amber `--border-strong`| `#404047` | 1.92:1 | `#5E5E69` | **3.01:1** | Provides compliant 3:1 boundary on active controls. |
| Ink & Violet `--text-faint` | `#77799E` | 4.14:1 | `#8082A8` | **4.68:1** | Ensures metadata tags pass 4.5:1 on `#17192C`. |

---

## 4. Alternate Palettes (Available via `data-theme`)

### 1. "Obsidian Mint" (`data-theme="obsidian-mint"`)
- `--bg: #07090D`, `--bg-elevated: #0D1017`, `--surface: #121720`, `--surface-2: #18202C`
- `--border: #232E3E`, `--border-strong: #4D617F`
- `--text: #EDF2F7`, `--text-muted: #A0AEC0`, `--text-faint: #78889E`
- `--accent: #5EEAD4` (Clean Mint), `--accent-ink: #042F2E`, `--accent-2: #8B7CFF` (Lavender)

### 2. "Graphite & Amber" (`data-theme="graphite-amber"`)
- `--bg: #0A0A0B`, `--bg-elevated: #111113`, `--surface: #18181B`, `--surface-2: #222226`
- `--border: #2E2E33`, `--border-strong: #5E5E69`
- `--text: #F4F4F5`, `--text-muted: #A1A1AA`, `--text-faint: #82828C`
- `--accent: #F5B84B` (Warm Amber), `--accent-ink: #241400`, `--accent-2: #FF7A59` (Coral)

### 3. "Ink & Violet" (`data-theme="ink-violet"`)
- `--bg: #0A0B14`, `--bg-elevated: #111220`, `--surface: #17192C`, `--surface-2: #20223A`
- `--border: #2C2E4E`, `--border-strong: #595D94`
- `--text: #F1F1F8`, `--text-muted: #A5A6C4`, `--text-faint: #8082A8`
- `--accent: #A78BFA` (Electric Violet), `--accent-ink: #1E1238`, `--accent-2: #38BDF8` (Sky)

---

## 5. Typography Scale & Specifications

Integrated via `next/font/google` with zero layout shift (`display: swap`):
- **Primary Sans:** `Geist` (weights 400, 500, 600) mapped to `--font-sans`.
  - Display tracking: `-0.02em` to `-0.035em` for large headlines.
  - Line-height: `1.08` to `1.15` for display, `1.65` for body measure.
- **Monospace:** `Geist Mono` (weights 400, 500) mapped to `--font-mono`.
  - Reserved for technical badges, date stamps, and architecture diagram flow text.
- **Editorial Serif:** `Instrument Serif` (weight 400, italic) mapped to `--font-serif`.
  - Reserved for the single editorial pull-quote in the Engineering Philosophy section.

### Fluid Clamp Scale
- **Display H1:** `clamp(2.5rem, 5vw + 1rem, 4.5rem)` (40px to 72px)
- **Heading 2:** `clamp(1.75rem, 3vw + 0.5rem, 2.5rem)` (28px to 40px)
- **Body Large:** `clamp(1rem, 1vw + 0.5rem, 1.125rem)` (16px to 18px)
- **Minimum Readable Size:** 14px (`text-sm`), metadata at 12px (`text-xs`).

---

## 6. Spacing, Shapes & Depth Standards

- **Grid:** 8px base grid.
- **Section Rhythm:**
  - Desktop: 96px to 144px (`py-24` to `py-36`).
  - Mobile: 64px to 80px (`py-16` to `py-20`).
- **Container Widths:**
  - Standard Content: Max `1200px` (`max-w-6xl`).
  - Editorial / Reading: Max `68ch` to `72ch` (`max-w-3xl`).
- **Border Radii:**
  - Cards: `14px` (`rounded-xl` / `rounded-2xl`).
  - Buttons / Inputs: `10px` (`rounded-lg`).
  - Tags / Badges: `999px` (`rounded-full`).
- **Depth & Polish:**
  - 1px hairline borders (`--border`) plus a faint top-lit card gradient (`linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)`).
  - Maximum of one radial glow per viewport.
  - Tactile focus indicator: `outline: 2px solid var(--accent); outline-offset: 2px;`.
