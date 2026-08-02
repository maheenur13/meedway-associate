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
official email, phone, WhatsApp number, team headshots, real job listings.
(Logo received — `public/photos/logo.png`, transparent; the swirl is cropped out
to `logo-mark.png` for the navbar/favicon.)

⚠️ **Unverified public claims.** Three numbers on the site are invented and
contradict each other — the hero says **5,000+ workers placed** while the reach
map totals **13,400**. `statPlaced` is the only stat still hardcoded (nothing in
the schema can derive it); countries and vacancies are now counted from live job
data. Get real figures before go-live, or drop the claims. A licensed agency can
be asked to substantiate these.

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
    icon.png / apple-icon.png  # favicon = the logo swirl (see §9)
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
    settings.ts                # server-only CMS resolver (also counts live job stats)
    settings-fields.ts         # SETTING_FIELDS — single source of truth for CMS keys
    trade-categories.ts        # server-only: "What we provide" grid from DB
    trade-icons.ts             # allowlist of lucide icons an admin may choose
    reach.ts                   # server-only: map/legend countries from DB
    reach-map.ts               # pin coordinates by country code (NOT in the DB — see §9)
    utils.ts                   # cn()
    use-media-query.ts         # useMediaQuery / useIsDesktop (gates heavy scroll anims)
  components/
    site/    navbar, footer, logo, locale-switcher, theme-toggle, theme-sync,
             whatsapp-button, aurora-background, scroll-progress
    ui/      button, container, section-header, reveal, accent-dash, parallax,
             count-up, photo
    home/    hero, hero-motion, hero-parallax, hero-slideshow, trust-marquee,
             intro, office-collage, categories, process, why, cta-band, world-reach
    admin/   admin-shell, providers, page-header, dashboard-view, jobs-table,
             trades-table, reach-table, applications-table, requests-table,
             messages-view, settings-form, login-form
messages/en.json  messages/bn.json   # all copy, both languages
public/photos/{office,process,team}/ # images + README with expected filenames
docs/REQUIREMENTS.md  docs/DESIGN_SYSTEM.md
```

---

## 5. Design system (in `globals.css`)

Class-based dark mode: `.dark` on `<html>`. Tokens (light / dark):

- `--accent` **logo indigo** `#302878` / `#958de2` — primary (buttons, links, grid, aurora).
  Taken from the logo's arched wordmark so the mark and the UI agree. It replaced
  royal blue `#1d4ed8`, and is ~3× darker (luminance 0.108 → 0.035) — see gotcha #12.
- `--accent-on-panel` `#a9a1ef`, `--accent-on-panel-soft`, `--accent-on-panel-fill` `#302878`
  — accent for use ON dark panel surfaces. **Deliberately not redefined under `.dark`**:
  those surfaces are dark in both themes, so their accent must not follow the page
  theme. See gotcha #13.
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
- **Hero** (`hero.tsx` + `hero-slideshow.tsx` + `hero-parallax.tsx`): full-bleed
  photo banner, headline over a left-heavy scrim, frosted **stat cards with count-up**
  straddling the bottom edge (`lg:-mt-12`; below `lg` they sit under the banner —
  full-width cards collide with the slideshow controls otherwise).
  - **Carousel**: three destination skylines (Dubai / Kuala Lumpur / Riyadh), 6.5s
    hold. Transition is a **clip-path wipe** with a gold hairline on the leading
    edge — not a cross-fade, so no frame ever shows two ghosted photos. Slides never
    unmount; only stacking order and the incoming slide's clip change (remounting
    `<Image>` mid-transition risks a decode flash). Needs a two-phase state — set
    the clip with transitions off, open it the next frame — plus a 200ms rAF
    fallback, since browsers pause rAF in background tabs.
  - Each slide carries a `lift` brightness value: the three photos were shot in
    different light (mean luminance 163 / 132 / 118) and an uncorrected transition
    reads as a brightness step.
  - **Parallax**: photo drifts inside an overscanned frame. Travel must stay under
    the overscan or an edge shows — see gotcha #14.
  - The headline's accent word is white on an `--accent-on-panel-fill` block; that
    forced `leading-[1.32]` (a padded inline box is taller than the line spacing at
    the site's usual 1.02).
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
11. **Restart `next dev` after any Prisma schema change.** `src/lib/prisma.ts`
    caches the client on `globalThis` in dev so hot reloads don't open new pools —
    which means the instance created at boot survives every HMR cycle *and*
    `prisma generate`. Add a model, and the running server keeps a client that has
    never heard of it: `Cannot read properties of undefined (reading 'findMany')`.
    Regenerating does not help; only killing the process does. Symptom to watch
    for: the public page silently shows its fallback data while an admin page
    throws, because the readers in `lib/` catch and fall back but admin pages don't.
12. **Overlay opacities are coupled to `--accent`'s weight.** Changing the accent
    from royal blue to the (3× darker) logo indigo silently buried every photo on
    the site — `ui/photo.tsx` stacks three accent-tinted layers whose opacities were
    tuned for the lighter colour. If the accent ever changes again, re-check those
    numbers. Same class of bug: the admin AntD theme hardcodes the accent hex,
    because AntD derives hover/active/border shades and cannot do that from a `var()`.
13. **Dark surfaces need theme-independent accents.** `text-accent` on the hero
    scrim measured **1.18:1** in light mode (invisible) because `--accent` is tuned
    for the light *page*, while the banner is dark in *both* themes. Use
    `accent-on-panel*` on anything sitting on `--panel` — banner, footer, CTA band.
    Same trap in reverse: `bg-accent-soft` (near-white) on a dark card.
14. **Parallax has two constraints, and they fight.** (a) Travel must stay inside
    the wrapper's overscan or the photo's edge is exposed — `y` is a share of the
    *inner* element, so the sum is `travel × height` vs the slack. (b) `<HeroMotion>`
    pulls the whole hero up ~70px over the same scroll range, so travel must clearly
    beat that or the two cancel and the photo just tracks the page, looking static.
    First attempt netted 2px of apparent movement.
15. **z-index needs a stacking context to be contained.** The slideshow stacks
    slides with z-index; on desktop the parallax wrapper's `transform` created a
    context by accident, but the reduced-motion / mobile branch was a plain div —
    so the z-indexes escaped and the photo painted over the scrim AND the headline.
    `isolate` on that wrapper is load-bearing, not decoration.
16. **Translucent cards over changing backdrops.** The hero stat cards at 70%
    opacity washed out to grey wherever the backdrop was light — and the carousel
    changes the backdrop every 6.5s. Check any `bg-*/NN` surface against *both*
    extremes it can sit on (bright sky, dark photo, light page), not just one.

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

**Phase 2 — ADMIN + DB DONE (local dev):**
- **Prisma 7** (new `prisma-client` generator → `src/generated/prisma`, config in
  `prisma.config.ts`). DB = **Neon Postgres via the pg driver adapter** (`PrismaPg`
  from `@prisma/adapter-pg` + `pg`; Prisma 7 REQUIRES a driver adapter — no bare
  `new PrismaClient()`). The `datasource` block has NO `url` — the URL comes from
  `prisma.config.ts` (CLI) and `src/lib/prisma.ts` (runtime), both off `DATABASE_URL`.
  Client singleton: `src/lib/prisma.ts`. Models: User, Job, Application,
  WorkerRequest, ContactMessage, SiteContent, TradeCategory, ReachCountry.
  Seed: `pnpm db:seed` → admin user + jobs + trades + reach countries (each block
  is skipped if its table already has rows, so it is safe to re-run).
- **`src/generated/prisma` is gitignored**, so `prisma generate` MUST run on every
  install/build — wired as `postinstall` + prefixed onto `build` in package.json.
  Without it, Turbopack fails with `Can't resolve '@/generated/prisma/client'`.
  Scripts: `db:migrate` (dev), `db:deploy` (CI/prod), `db:seed`, `db:studio`.
- **Auth.js v5** (`src/lib/auth.ts`, credentials + bcrypt, JWT). Admin at `/admin`
  (outside `[locale]`, own html/body). Guard: `auth()` check in
  `app/admin/(panel)/layout.tsx`; login at `/admin/login`.
  **Dev admin login: `admin@meedassociates.com` / `admin1234`** (seed default —
  delete before go-live). Real admin: `meedassociateltd@gmail.com` (password not
  recorded here on purpose). Emails are stored + compared lowercased.
  Add or reset an admin with `pnpm db:create-admin <email> <password> [name]`
  (`scripts/create-admin.ts`, bcrypt cost 10, upserts by email).
- **Admin UI = Ant Design v6** (native React 19). Setup: `@ant-design/nextjs-registry`
  `AntdRegistry` + `AdminProviders` (ConfigProvider mapped onto the site tokens + antd
  `App`) in `app/admin/layout.tsx`. Responsive shell `components/admin/admin-shell.tsx`:
  antd `Layout` with fixed `Sider` on desktop, `Drawer` + hamburger on mobile
  (Grid.useBreakpoint, lg=992px). Pages are server components (prisma fetch) that pass
  plain DTOs to client antd views: `dashboard-view` (Statistic cards + Table),
  `jobs-table` (Table + **Modal** create/edit form, Popconfirm delete, publish Switch),
  `applications-table` / `requests-table` (Table + status Select), `messages-view`
  (List of Cards), `settings-form` (Form). Mutations = client-callable server actions
  in `app/admin/actions.ts` (plain args, no redirect: upsertJob/removeJob/setJobPublished/
  updateStatus/updateSettings) + `router.refresh()`. Login = antd Form.
  Needs `dayjs` (DatePicker).
- **Content CMS (`/admin/content`) — bilingual, field-driven.**
  `src/lib/settings-fields.ts` holds `SETTING_FIELDS` (key, label, group, `localized`,
  hint) — the single source of truth for the DB keys, the admin form, AND the resolver.
  **Add a field there and it appears in the admin automatically**; no form edits needed.
  `src/lib/settings.ts` (marked `server-only`) resolves it: `getSettings(locale)` merges
  SiteContent over per-locale defaults, where localized defaults come from
  `messages/{en,bn}.json` and the rest from `siteConfig`.
  Resolution order per field: `valueBn` (bn only) → `valueEn` → built-in default, so
  **blank means "use the default"** and filling only English covers both languages.
  `getSiteSettings()` is the convenience wrapper that reads the request locale.
  IMPORTANT: `settings.ts` imports Prisma — client components MUST import from
  `settings-fields.ts` instead, or `pg` lands in the browser bundle and the build fails
  (`the chunking context does not support external modules`). `server-only` makes that
  mistake loud.
  The brand name and licence were ALSO hardcoded inside `messages/{en,bn}.json`, so
  they are now ICU placeholders — `hero.badge`/`trust.licence` take `{licence}`,
  `why.eyebrow`/`reach.subtitle`/`about.intro`/`about.leadership.quote` take `{company}`
  (`about.intro` takes both). **Any component rendering those keys must pass the values**
  (`t("badge", { licence: settings.licence })`) or the raw `{licence}` shows up. That is
  why `Intro`/`Why`/`WorldReach`/`TrustMarquee` are now async server components.
  Wired into: navbar/footer logo (`Logo name={...}`), footer blurb + social pills,
  `generateMetadata` titles, contact page (details, map, tel, WhatsApp), about page
  (licence, MD), CTA band + floating WhatsApp button, and the three hero counters
  (`splitStat("5,000+")` → `{value:5000,suffix:"+"}`, falling back to the hardcoded
  default if unparseable), plus the admin chrome (login heading, sidebar, tab title).
  Navbar / WhatsappButton / OfficeCollage / AdminShell are client components, so their
  server parent resolves the values and passes them as props.
  Note `shortName` resolves as: stored shortName → **stored company name** → shipped
  default, so editing only "Company name" does change the navbar.
- **Public forms now PERSIST**: `/api/{contact,worker-requests,applications}` write
  to DB (verified). CVs saved to `public/uploads/cv/` in dev (TODO: Cloudinary).
  Public `/jobs` reads published jobs from DB.

**Phase 3 — CMS breadth, rebrand, hero rebuild:**
- **Rebrand to the logo indigo.** `--accent` → `#302878` (light) / `#958de2` (dark),
  plus `--accent-on-panel*`. Everything that hardcoded the old blue was repointed:
  grid lines, aurora blobs, category hover shadow, and the four admin files feeding
  AntD's `colorPrimary`. Navbar mark + favicon + apple-icon are now the logo swirl,
  cropped from `logo.png` to `public/photos/logo-mark.png` (see §9).
- **Hero rebuilt** as a full-bleed 3-slide carousel with parallax (see §6).
  Photos in `public/photos/hero/skyline-{dubai,malaysia,saudi}.jpg`, 2800px,
  Unsplash licence. Swapping one means re-checking its `lift` value in `hero.tsx`.
- **Stats are partly live now.** `statCountries` = distinct countries on published
  jobs; `statVacancies` = sum of their `vacancies` (replaced the unverifiable
  "98% deployment rate"). Both are *defaults* — an admin value still overrides.
  Only `statPlaced` remains invented. `settings.ts` holds the two counters.
- **Two new CMS-managed sections**, both following the same shape as Jobs
  (server page → plain DTOs → client AntD table → server actions → `revalidatePath("/","layout")`):
  - **`TradeCategory` / `/admin/trades`** — the "What we provide" grid. Icons are an
    **allowlist** (`trade-icons.ts`); the stored value is a string from the DB, so
    mapping it straight onto an import would let a bad row crash the render.
  - **`ReachCountry` / `/admin/reach`** — the map + legend. 47 supported countries.
    Map coordinates live in `reach-map.ts`, NOT the DB (see §9). HQ pin is hardcoded.
  Both fall back to the shipped hardcoded list when the table is empty or the query
  fails — an empty section reads as a broken page.
- **Applications can be deleted**, and the delete removes the CV file too. CVs are
  served publicly from `public/uploads/cv/`, so deleting only the row would leave
  someone's CV at a guessable URL. The path is guarded — it comes from stored data.
- **Admin UI pass.** AntD tokens mapped onto the site's design system, sidebar in
  `--panel` navy with the real logo, header shows the current page name, modals
  `centered` + scrollable body (tall forms pushed their footer off-screen), and
  navigation runs in `useTransition` with an indeterminate progress bar + a
  `(panel)/loading.tsx` skeleton. Admin pages stay `force-dynamic` — that is
  correct, they must never serve cached rows; the slowness was missing *feedback*.
- **Locale switcher** is now `<Link>`-based so Next prefetches the other language
  (it was a `<button>` + `router.replace`, so nothing was prefetched and the UI gave
  no sign it had registered the click). Pending dot via `useLinkStatus`.
- **`/[locale]/jobs` is SSG + `revalidate = 3600`** instead of `force-dynamic`; the
  admin job actions already revalidate, so edits still appear immediately.

**Env:** `.env` / `.env.local` (READ-LOCKED — tools cannot open them) hold
`DATABASE_URL` (Neon **pooled** `-pooler` string) + `AUTH_SECRET`. Optional
`DIRECT_URL` = the same string with `-pooler` removed; when set, the Prisma CLI and
seed use it for DDL while the app keeps the pooled one. Same vars must exist in
Vercel → Project → Settings → Environment Variables.

**STILL TODO (needs Cloudinary creds):**
1. Swap local CV storage → Cloudinary upload in `app/api/applications/route.ts`
   (`public/uploads/` is not writable on Vercel — uploads will fail in prod until this
   lands).
2. Extend the CMS to full page copy (About/Services body text) + media/photos. Brand,
   contact, social and the hero counters are done — add a row to `SETTING_FIELDS` for
   anything else that is a single string.
3. Harden: rate-limit forms, admin user management UI, pagination on admin lists.
4. **Real numbers from the client** — see the warning in §2. `statPlaced` and the
   per-country worker counts on the reach map are invented and mutually
   contradictory. Nothing in the schema can derive "workers placed": `Application`
   only records people who applied *through this site*, and its statuses stop at
   `shortlisted`. Either get figures the client will stand behind, or drop them.
5. **Real contact details** — `phone`, `whatsapp` and `email` in `site-config.ts`
   are still placeholders (`+880 0000 000000`). The floating WhatsApp button and
   the contact page currently point at a number that does not exist.
6. Delete for Worker Requests + Messages (Applications has it; the other two
   inboxes still don't).

**Pending credentials:** Cloudinary cloud name + API key/secret. (Neon is wired up —
migrations applied to the `neondb` public schema and seeded.)

---

## 9. Generated assets — how to redo them

**Logo mark / favicons.** `public/photos/logo.png` is the full company seal
(transparent, 794×1123). The arched wordmark and licence line turn to mush below
~120px, so small surfaces use only the four-figure swirl, cropped to
`public/photos/logo-mark.png` (372×372). There is only ~15px of clearance between
the swirl and the ring text — the crop was found by counting opaque pixels on
square rings around the centre and taking the radius where that count hits zero
(half-size 186 from centre 402,594). `src/app/icon.png` (256, transparent) and
`apple-icon.png` (180, white field) are downscaled from the mark with **alpha
premultiplied before averaging**, or transparent pixels drag colour into the
edges and fringe it. The apple icon needs an opaque background because iOS
ignores transparency — the swirl's counter would otherwise go black.

**Map pin coordinates** (`reach-map.ts`). `public/images/world-dotted.svg` was
generated by `dotted-map` with **`{ height: 52, grid: "diagonal", projection: { name: "mercator" } }`**
— confirmed by regenerating candidates and matching both the viewBox and the
2,292-dot count. To add a country, place it through the same library and read the
position back rather than eyeballing:

```js
const m = new DottedMap({ height: 52, grid: "diagonal", projection: { name: "mercator" } });
m.addPin({ lat, lng, svgOptions: { color: "#f0f", radius: 0.9 } });
// find the r="0.9" circle in m.getSVG(...) → left = cx/103*100, top = cy/52*100
```

Two checks on anything added: `left` must stay under **99.5** (the map's
easternmost dot — New Zealand computes to 102.4 and renders off-image), and
small neighbours can snap to the same dot (Cyprus landed on Lebanon's, and is
nudged). The method reproduces 5 of the original 8 pins exactly, worst case 1.6pp.

---

## 10. Conventions

- Match existing component style; reuse `ui/` primitives (`Button`, `Container`,
  `SectionHeader`, `Reveal`, `Photo`).
- All user-facing copy goes in `messages/en.json` + `messages/bn.json` (keep keys
  in sync). Content that will be CMS-managed later should stay easy to relocate.
- Use `Link`/`useRouter`/`usePathname` from `@/i18n/navigation` (locale-aware),
  not `next/link` / `next/navigation`, for internal locale routes.
- Company facts come from `siteConfig`, never hardcoded in components.
- Run `pnpm exec tsc --noEmit` before declaring done / pushing.
