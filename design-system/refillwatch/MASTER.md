# Design System Master File — RefillWatch

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** RefillWatch  
**Category:** Consumer watchdog · affiliate editorial  
**Tone:** Navy authority + red alert accents · trustworthy, investigative, readable

---

## Global Rules

### Color Palette (brand-locked)

| Role | Hex | Tailwind / usage |
|------|-----|------------------|
| Primary (navy) | `#1E3A8A` | `navy`, `primary`, links on light surfaces |
| Accent / CTA (red) | `#DC2626` | `terracotta-500`, `accent`, `.btn-primary` |
| Accent hover | `#991B1B` | `terracotta-600` |
| Surface | `#F8FAFC` | `cream-50`, `.site-page-bg` |
| Ink / text | `#0B1120` | `ink-900`, headings |
| Muted text | `#334155` | `ink-700`, body copy |
| Destructive | `#DC2626` | price-hike callouts |

**Color Notes:** Navy radial gradients in hero band; red used sparingly for CTAs and watchdog alerts — never as full-page background.

### Typography

- **Display:** Archivo — headlines, pillar titles, stat numbers
- **Body:** Inter — paragraphs, UI chrome
- **Mono:** JetBrains Mono — eyebrows, badges, metadata
- **Google Fonts:** Archivo + Inter (see `brand.config.json` → `fontCssHref`)

### Spacing & layout

- Max content width: `max-w-site` (72rem)
- Section rhythm: `py-10 md:py-14` for major bands; `py-8` for compact grids
- Touch targets: minimum 44×44px on all interactive controls
- Hero band: dark `ink-900` with cream-50 text; rest of homepage stays light

### Motion

- Transitions: 150–300ms ease on hovers
- Hero video: autoplay muted loop with `poster` fallback
- **Always** respect `prefers-reduced-motion: reduce` — show poster only

---

## Component Specs

### Buttons

- `.btn-primary` — red fill, white text, pill shape, subtle lift on hover
- `.btn-secondary` — white/outline on light; translucent on dark hero band
- All buttons: `cursor-pointer`, visible `:focus-visible` ring

### Cards

- `.card-soft` — white surface, `rounded-3xl`, `shadow-soft`, hover lift ≤ 4px
- Pillar tiles: min-height 240px, border `cream-200`, hover `terracotta-400` border

### Hero visual

- `HeroVisual.astro` supports `videoUrl` + `imageUrl` (poster)
- MP4 in `/public/hero/`; JPG poster required for LCP and reduced-motion

---

## Anti-Patterns (Do NOT Use)

- ❌ Pink / generic SaaS palette (overrides auto-generated DS)
- ❌ Emojis as icons — use Heroicons/Lucide SVGs
- ❌ Missing `cursor:pointer` on clickable elements
- ❌ Layout-shifting scale hovers on grid cards
- ❌ Low-contrast cream-on-cream text (maintain 4.5:1)
- ❌ Autoplay video without poster + reduced-motion fallback
- ❌ Full-page dark mode (hero band only)

---

## Pre-Delivery Checklist

- [ ] Navy/red palette applied in `tailwind.config.mjs`
- [ ] Archivo display font loaded
- [ ] Hero MP4 + JPG poster wired in `brand.config.json`
- [ ] `prefers-reduced-motion` tested
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Focus states visible on nav, CTAs, pillar cards
- [ ] No horizontal scroll on mobile
