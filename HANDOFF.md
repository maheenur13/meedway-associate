# Meed Associate Ltd. — Project Handoff

Context doc for any Claude session (or developer) picking up this project.
Read this first, then `AGENTS.md`, then the code.

---

## 1. What this is

A **bilingual (English + Bengali) marketing website with a CMS admin portal**
for **Meed Associate Ltd.**, a Bangladesh-based overseas recruitment agency.
Public visitors browse jobs, apply, request workers, and contact the company;
admins will manage all content and view submissions.

**Design language:** "premium minimal" (Apple/Stripe-inspired) — lots of
whitespace, big type, one primary accent + a secondary accent, subtle motion.

---

## 2. Real company details (source of truth: `src/lib/site-config.ts`)

- **Name:** **Meed Associate Ltd.** — note SINGULAR "Associate" (confirmed from
  the office signboard). Bengali: **মিড এসোসিয়েট লিমিটেড**.
- **Recruiting Licence:** RL-2927 · **BAIRA member**
- **Managing Director:** Shafiqul Haider Bhuiyan
- **Office:** H-95, 4th Floor, Bir Uttam Ziaur Rahman Road (Kakoli), Banani, Dhaka-1213
- **Primary markets:** Malaysia & Saudi Arabia (also UAE, Qatar, Kuwait, Oman, Bahrain, Jordan)

**Still TODO from the client (placeholders in place):** year established,
official email, phone, WhatsApp number, a clean logo asset (SVG/transparent PNG),
team + MD headshots, real job listings.

---

## 3. Tech stack

| Area | Choice |
|------|--------|
| Framework | **Next.js 16** (App Router, `src/` dir, Turbopack dev) |
| Language | TypeScript, React 19 |
| Package manager | **pnpm** (only) |
| Styling | **Tailwind CSS 4** (CSS `@theme` in `src/app/globals.css` — no `tailwind.config`) |
| Animation | **Framer Motion** |
| i18n | **next-intl v4** (locales `en`, `bn`; `localePrefix: "as-needed"`) |
| DB (planned) | **Prisma + Neon Postgres** |
| Auth (planned) | **Auth.js / next-auth v5 beta** (email + password) |
| Uploads (planned) | **Cloudinary** (`next-cloudinary`) |
| Forms (planned) | react-hook-form + zod |
| Deploy | **Vercel** |

### Commands
```bash
pnpm dev          # dev server (see gotcha #1 below)
pnpm build        # production build (Vercel runs this)
pnpm exec tsc --noEmit   # type-check — RUN THIS before pushing (Vercel fails the build on type errors)
```

---

## 4. Architecture / key files

```
src/
  app/
    layout.tsx                 # root layout = pass-through (returns children only)
    not-found.tsx              # global fallback, renders its OWN <html>/<body>
    icon.svg / apple-icon.svg  # favicon = gold plane on blue square
    globals.css                # Tailwind import + ALL theme tokens + keyframes
    [locale]/
      layout.tsx               # renders <html>/<body>, fonts, no-flash theme script, chrome
      page.tsx                 # home page (composes home sections)
      not-found.tsx            # localized 404 (inside locale chrome)
      [...rest]/page.tsx       # catch-all -> notFound() (see gotcha #3)
  i18n/
    routing.ts navigation.ts request.ts
  proxy.ts                     # next-intl middleware (Next 16 renamed middleware->proxy)
  lib/
    site-config.ts             # company details + whatsappLink()
    utils.ts                   # cn()
    use-media-query.ts         # useMediaQuery / useIsDesktop (gates heavy scroll anims)
  components/
    site/    navbar, footer, logo, locale-switcher, theme-toggle, theme-sync,
             whatsapp-button, aurora-background, scroll-progress
    ui/      button, container, section-header, reveal, accent-dash, parallax,
             count-up, photo
    home/    hero, hero-motion, trust-marquee, intro, office-collage,
             categories, process, why, cta-band
messages/en.json  messages/bn.json   # all copy, both languages
public/photos/{office,process,team}/ # images + README with expected filenames
docs/REQUIREMENTS.md  docs/DESIGN_SYSTEM.md
```

---

## 5. Design system (in `globals.css`)

Class-based dark mode: `.dark` on `<html>`. Tokens (light / dark):

- `--accent` **royal blue** `#1d4ed8` / `#60a5fa` — primary (buttons, links, grid, aurora)
- `--gold` **brand gold** `#c9a227` / `#e3c15a` — secondary accent (small highlights, logo lettering, marquee ticks)
- `--paper` / `--paper-2` — page / raised surfaces
- `--ink` / `--ink-soft` / `--ink-mute` — text
- `--line` / `--line-2` — borders
- `--panel` / `--panel-2` / `--panel-ink` — **always-dark** bands (footer, CTA) that stay dark in BOTH themes
- `--grid-line` / `--grid-line-strong` — aurora dot/line grid

Fonts: **Sora** (display/headings, `.font-display`), **Inter** (body),
**Noto Sans Bengali** (bn). Tight tracking helper: `.tracking-tighter-2`.

**Theming rule:** anything meant to read as a dark surface must use `panel`
tokens, NOT `ink` — because `--ink` flips to light in dark mode. Any element
using `text-white` on an `ink`/`accent` surface must instead use `text-paper`
so it flips correctly (bit us on buttons, logo, locale switcher).

---

## 6. Signature UI (home page)

- **Aurora background** (`aurora-background.tsx`): blurred blue/gold blobs +
  cursor glow + cursor-lit line grid + film grain + hue drift + scroll parallax.
- **Hero**: big headline, gold badge dot, frosted glass **stat cards with count-up**.
- **Trust marquee**: infinite hover-to-pause strip of credentials (gold ticks).
- **Office collage** (`office-collage.tsx`): the layered photo bento is the
  DEFAULT (rest) state; **as the section scrolls to centre, the photos detach
  into a clean, evenly-spaced aligned grid** (scroll-scrubbed, plateaus at centre,
  rejoins on exit). Desktop only; mobile shows the static grid. Photos carry a
  clip-path hover sweep + a `mix-blend-overlay` brand colour grade.
- **Process**: numbered nodes joined by connectors drawn relative to each node.
- **Categories / Why / CTA band**: reveal-on-scroll, rich hovers.
- **Scroll progress bar**, **animated hamburger**, **theme toggle**, **WhatsApp FAB**.

`Photo` component (`ui/photo.tsx`): next/image with clarity grade + brand blend +
hover sweep, graceful labelled placeholder if the file is missing, `fill` mode
for collages. Serves quality 90 (see gotcha #5).

---

## 7. GOTCHAS (things that already bit us — don't repeat)

1. **Only ever run ONE `next dev`.** Two dev servers on the same `.next` fight
   over files and cause an infinite Fast Refresh loop (looks like the page
   "continuously rendering"). If it loops: kill all node, `rm -rf .next`, start one.
2. **`preview_logs` is cumulative.** Stale errors (old `intro.tsx` parse errors,
   old `InteractiveBackground` refs) persist in the log tail long after they're
   fixed. Verify with live DOM checks, not the log tail.
3. **Root layout is a pass-through** so unmatched routes would hit it without
   `<html>`/`<body>`. Fixed via `[locale]/[...rest]/page.tsx` (→ notFound) +
   `[locale]/not-found.tsx` + a root `not-found.tsx` that renders its own html/body.
4. **Dark mode + client navigation:** switching locale re-renders `<html>` and
   wipes the imperatively-added `dark` class. `theme-sync.tsx` re-applies the
   saved theme on every route change. Keep it mounted.
5. **next/image quality:** Next 16 ignores a `quality` prop unless the value is
   in `next.config.ts` `images.qualities`. It's set to `[75, 90, 100]`. Also give
   generous `sizes` — a landscape photo covering a tall box upscales and looks blurry.
6. **next-intl typed router:** `router.replace(pathname, { locale })` — do NOT
   pass `{ pathname, params }` (localized routes have no dynamic segments; it's a
   TYPE ERROR that fails the Vercel build).
7. **whileInView + parent transform:** per-child scroll observers break when a
   parent applies a continuous transform (e.g. a Parallax wrapper). Use ONE
   observer on the parent that staggers children via variants, or drive children
   with `useScroll` directly. The collage learned this the hard way.
8. **Heavy scroll animations are desktop-only** via `useIsDesktop()` — on mobile
   they misbehaved (hero fade hid content, parallax fought layout). Keep gating.
9. **Watch horizontal scroll** on any absolute/translated element; `html`/`body`
   have `overflow-x: hidden` but verify (docW == vw) after layout changes.
10. Respect `prefers-reduced-motion` (aurora, marquee, floaty already do).

---

## 8. Status

**DONE:** full home page, design system, i18n (en/bn), dark mode, responsive +
animated hamburger, real company details + blue/gold rebrand, favicon/logo,
office photos wired into the animated collage, localized 404s.

**Phase 2 — public pages DONE (bilingual):** About (`[locale]/about`), Services
(`[locale]/services`), Available Jobs (`[locale]/jobs` — filters + cards from
`lib/jobs-data.ts` seed), Apply (`[locale]/jobs/apply` — CV upload + position
pre-fill via query), Contact (`[locale]/contact`), Request Workers
(`[locale]/request-workers`). Forms use react-hook-form + zod (schema built in
component with `useTranslations` for bilingual errors), submit to API routes
`app/api/{contact,worker-requests,applications}/route.ts` which validate + ack
(NO persistence yet — TODO Prisma + Cloudinary). Shared: `ui/page-hero.tsx`,
`ui/form.tsx` (Field + fieldClass), `components/forms/*`, `components/jobs/jobs-browser.tsx`.
NOTE: forms only capture values from REAL keyboard input (RHF ignores programmatic
`.value`/`form_input`) — verify form flows with the `computer` type action, not JS.

**NOT STARTED — rest of Phase 2+ (needs Neon + Cloudinary creds):**
1. **Prisma schema + Neon** — models: `User`(admin), `Job`, `Application`,
   `WorkerRequest`, `CompanyProfile`/content, `WorkerCategory`, `Industry`,
   `Country`, `MediaAsset` (see `docs/REQUIREMENTS.md` §6). Then wire the 3 API
   routes to persist + upload CVs to Cloudinary.
2. **Admin portal:** Auth.js login + dashboard — job CRUD, view applications
   (download CV) + worker requests, full bilingual content CMS + media management.

**Pending credentials (needed for Phase 2 DB/upload work):** Neon connection
string, Cloudinary cloud name + API key/secret.

---

## 9. Conventions

- Match existing component style; reuse `ui/` primitives (`Button`, `Container`,
  `SectionHeader`, `Reveal`, `Photo`).
- All user-facing copy goes in `messages/en.json` + `messages/bn.json` (keep keys
  in sync). Content that will be CMS-managed later should stay easy to relocate.
- Use `Link`/`useRouter`/`usePathname` from `@/i18n/navigation` (locale-aware),
  not `next/link` / `next/navigation`, for internal locale routes.
- Company facts come from `siteConfig`, never hardcoded in components.
- Run `pnpm exec tsc --noEmit` before declaring done / pushing.
