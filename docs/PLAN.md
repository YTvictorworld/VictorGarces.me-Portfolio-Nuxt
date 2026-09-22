# Implementation plan

Work in this order. Each milestone ends with `pnpm lint && pnpm typecheck && pnpm generate` passing and the listed checks done. Commit per milestone with the milestone id in the message. Before starting a milestone, read its section in `docs/AUDIT.md`.

## Owner decisions (2026-09-22)
These override anything else in `docs/` and `design/`.
1. **Palette:** the handoff tokens (`docs/snippets/tokens.css`) replace the old Ember orange + pure black brand, including the body film grain.
2. **Email:** `hello@victorgarces.me` everywhere, stored once in the contact collection. The mailbox (MX records) must exist before this branch merges to `master` (M9 gate).
3. **No embeds:** no YouTube or Instagram embeds, only outbound links. So there is **no cookie consent banner**; `/cookies` is a static notice. Privacy §5 is rewritten accordingly.
4. **No captcha:** the contact form posts to Web3Forms (free plan) with its honeypot field only.
5. **Nuxt 4.5 + Nuxt UI 4** (done in M0).
6. **3D goes last:** `Hero/PageExploded` and `Hero/MoonStage` move to **M10**, after release. Until then both heroes render their static fallback.
7. **Copy and translations** (Spanish included) are written by Claude, following the tone of the final copy in the artboards.

## Corrections to the handoff
Found in the audit (`docs/AUDIT.md`, ids in brackets). Where they conflict with the other docs, these win.
- **Content is per locale** [content-locale-strategy]: every collection exists as `<name>_en` / `<name>_es` with sources under `content/en/` and `content/es/`, picked with `useLocalizedContent().collection()`. No `*.es.md` siblings and no fallback: the build reports any file that exists in one language only. `bag` becomes per-locale too (its descriptions get translated). The only single-locale file is `content/profile.yml` (email, city, timezone, socials), so the email is stored once. Blog slugs stay as they are.
- **Schema is validated by us** [schema-not-validated]: Content v3 ignores zod at build, so M2 adds a validation step that parses every file with the shared zod schemas and fails the build (alt text, required fields).
- **Old collections live until their last consumer is rewritten** [snippet-drops-live-collections]: `index_*` and `pages_*` stay until M3/M4 replace the pages that query them.
- **Seeds never ship** [placeholder-seeds-go-public]: `projects`, `films`, `blog` and FAQ entries have `draft`; unknown experience years are `null`, never `[YEAR]`; every bracketed seed is `draft: true` and drafts are filtered out of queries, prerender routes, the sitemap and RSS in production. Seed filenames are plain slugs (`client-site.md`), never `[client-site].md`.
- **Real content wins over seeds** [experience-and-positioning-conflict, faq-flattened, testimonials-migration]: experience merges the 3 current entries with the 4 from the design (7 total); FAQ keeps all 11 current answers with `category`, `order` and `featured`; testimonials keep the 3 current quotes. See `docs/MIGRATION.md`.
- **Mode rule** [mode-middleware-locale-and-prerender, forced-routes-dont-persist-mode, landing-dual-mode-scoping]: forced mode is computed from the locale-stripped path and written with `useHead` (prerendered HTML) and the pre-paint script; visiting a forced route writes the stored preference when none exists; `/` is always day with a nested `data-mode="night"` on the night card; night links to `/contact` carry `?topic=film`.
- **Nuxt UI bridge** [nuxt-ui-color-mode-conflict]: `useMode` drives Nuxt UI's color mode (`.dark` on night) and tokens.css maps `--ui-*` to the tokens, so primitives follow `data-mode`.
- **Home quick forms collect an email** [home-forms-no-sender]: the day and night home forms get an email field, or submit through `/contact`; never a message without a reply address.
- **Deploy** [deploy-script-destructive]: deploys run through `.github/workflows/deploy.yml` (push to `master`). Build-time env vars (Web3Forms access key, analytics id, Sentry DSN) go in that workflow. Do not run `deploy-static.ps1`.
- **GitHub Pages limits** [csp-redirects-cname-on-pages]: CSP is a meta tag; redirects are prerendered meta-refresh pages.
- **OG images** [og-technical-constraints]: `defineOgImage('OgDay' | 'OgNight', props)` (the `...Component` form is deprecated); literal colors from a shared JS token map, TTF/WOFF fonts, no CSS variables.
- **3D** [tresjs-3d-budget, gltf-optimize-breaks-contract]: the lazy 3D chunk budget is about 300 KB gzipped (TresJS pulls all of three), or plain three with named imports; the GLB is optimized with `--flatten false --join false --palette false --instance false --compress draco` and a self-hosted Draco decoder.
- **JS budget** [initial-js-budget-exhausted]: 200 KB gzipped was already spent before the refactor. Track against the baseline in `docs/MIGRATION.md` and cut in M3.

## M0 · Audit and branch (done)
- Branch `refactor/dual-mode`. Handoff docs moved to `docs/`, artboards to `design/`, snippets to `docs/snippets/`; root `CLAUDE.md` merged.
- `docs/MIGRATION.md`: every existing module, content entry, locale string and route, and where it lands. Template leftovers (fake about/projects/speaking content, Studio schema, `uiPro` config) deleted.
- Tooling: Nuxt 4.5, Nuxt UI 4, @nuxt/content 3.16, @nuxtjs/i18n 10.6, @nuxt/image 2; added @nuxtjs/seo, @nuxt/scripts, gsap, media-chrome, hls-video-element, @nuxt/eslint with `lint` / `typecheck` scripts; removed @vueuse/motion, @nuxtjs/tailwindcss, nuxt-og-image (now via @nuxtjs/seo), autoprefixer/postcss; static `robots.txt` and `sitemap.xml` replaced by the generated ones; `public/.nojekyll`; CI on Node 22. @nuxt/fonts ships with Nuxt UI. @tresjs/* waits for M10.
- Check: `pnpm lint && pnpm typecheck && pnpm generate` pass; JS baseline recorded.

## M1 · Tokens, mode, shell (done)
- `tokens.css` from `docs/snippets/`, `--ui-*` bridge, fonts via the `fonts` key (Albert Sans, Newsreader italic with optical size, Source Code Pro; latin + latin-ext; preload the display faces only), `useMode`, inline head script that sets `data-mode` before paint (no flash), locale-aware mode forcing for `/dev/**` and `/film/**`.
- `Shell/Header` with `ModeToggle` and `LangSwitch`, `Shell/Footer`, `Shell/MobileModePill`, mobile menu, `useModeTransition` (circle), `aria-live` announcement.
- `Shell/Placeholder` and the `data-placeholder` attribute convention; `NUXT_PUBLIC_SHOW_PLACEHOLDERS` (off in production).
- Remove the Ember scale, body grain and `ColorModeButton`; scope the global reduced-motion rule so the 150 ms mode cross-fade survives.
- Check: toggling mode on any page changes every color and the display font; `grep -rn "#[0-9A-Fa-f]\{6\}" app/components` returns only OG components.
- Decisions taken in M1: the mode is stored in localStorage only (F-Sistema says so; nothing server-side reads a cookie; the only cookie on the site is @nuxtjs/i18n's language choice, listed on /cookies); fonts load the latin subset only (it covers Spanish, and the preload then picks the file actually used); nav entries whose page does not exist yet are hidden until it lands; the toggle is a button labelled with its action ("Switch to Filmmaker, night mode"); the Nuxt UI `neutral-*` / `primary-*` scales are derived from the tokens, so the old pages already follow both modes.

## M2 · Content (done)
- Per-locale `content.config.ts` (from `docs/snippets/`, corrected as above), seed files per `docs/CONTENT.md`, migrated real entries from `docs/MIGRATION.md`, validation step.
- Local copies of the photos currently hotlinked from Behance in `public/media/`, and a hand-written `content/media/manifest.json` (photos + one video) read by `useMediaManifest()`, which also validates the manifest.
- Check: `queryCollection` for every collection returns the seed in both locales; the build fails on an image without alt.
- Decisions taken in M2: schemas live in `content.schemas.ts`; the validator collects problems and fails the build in `build:done`, because @nuxt/content swallows errors thrown while parsing and drops the file; a `[bracketed]` string outside a draft also fails the build; missing translations are reported; videos without files are `status: pending` in the manifest; budget ranges stay empty (the form hides the field) until the owner provides them.

## M3 · First visit and both homes (done)
- `/` landing (F-Landing), `/dev` (F-Home-Dev), `/film` (F-Home-Film) with every module wired to content. Heroes render their static fallback (3D is M10).
- `Work/MoreTile`, `Photo/Filmstrip`, `Testimonials/Single`, `Filmography/Credits`, `Contact/Block`, `Contact/BookShoot`.
- Mobile layouts per M-Home-Dev and M-Home-Film (breakpoints: 390 to 767 single column, 768 to 1023 two columns, 1024+ desktop). Every desktop module is present on mobile.
- Check: Lighthouse mobile on `/dev` and `/film`: performance 90+, accessibility 100; every nav link resolves; initial JS at or below the M0 baseline.
- Result: accessibility 100 on `/dev` and `/film`, best practices and SEO 100. Performance **88 (`/dev`) and 91 (`/film`) with real (devtools) throttling**, LCP 2.2 s and 1.9 s, both inside the 2.5 s budget. Lighthouse's default simulated throttling reports 79 and 70 against a local server, where every request starts before first paint and Lantern puts the whole page on the critical path (observed FCP without throttling: 170 ms). **The 90+ target is therefore met under real throttling only**; the render-blocking global CSS (33 KiB gzipped, mostly Nuxt UI) is the next cut and belongs to M7. Initial JS: 222 KiB (`/dev`), 226 KiB (`/film`), 204 KiB (`/`), under the 244 KiB M0 baseline; the page payloads dropped from 37 KiB to 21 KiB by selecting only the blog fields the cards render.
- Decisions taken in M3: the first-visit group is `FirstVisit/` (a `Landing/` folder collides with the old `landing/` on case-insensitive disks); `/` is forced day but does not store it, and a returning visitor is sent to their side before the landing paints (only on a fresh load, so Back still shows it); the Enter selection sticks (hover, focus or first tap selects; activating the selected side enters) and the button sits between the cards at the bottom; the home message boxes continue to `/contact` with the text prefilled instead of sending without a reply address; Newsreader loads italic 500 with the optical size axis (65 KB instead of 144 KB for a weight range) and is not preloaded; rebuilt pages set `definePageMeta({ fullBleed: true })` to drop the legacy container; links to pages that land in M4 (case studies, film pages, About, indexes) stay hidden until those routes exist.

## M4 · Inner pages (done)
- Day: `/dev/work`, `/dev/work/[slug]`, `/dev/about`. Shared: `/blog`, `/blog/[slug]`, `/contact`.
- Night: `/film/films`, `/film/films/[slug]`, `/film/photography`, `/film/journal`, `/film/about`.
- `Media/FilmImage`, `Media/FilmPlayer`, `Media/Lightbox`.
- Contact form: Web3Forms access key from env, honeypot, inline success/error, topic-driven fields, `?topic=film`.
- Check: keyboard-only pass through every page; lightbox and player fully operable without a mouse.
- Result: 118 routes prerendered, link checker 0 errors on 40 pages. Keyboard pass over all 11 new pages (headless Chrome, real key events): every stop has an accessible name and a visible focus ring, no nameless controls, skip link first. Lightbox: Enter opens it, focus lands on Close, arrows move the announced counter, Tab stays inside, Esc and the Close button both close it and focus returns to the tile that opened it. Filters are buttons: Enter applies, `aria-pressed` follows, the URL gets `?kind=`/`?series=`. Contact validation: empty submit shows the three required errors, moves focus to the first failing field and sets `aria-invalid` plus `aria-describedby`; a malformed address shows only the email error; nothing is posted while validation fails.
- Decisions taken in M4: indexes filter by `kind` (films and work) or `series` (photography) through the URL, so a filtered list can be shared, and only values that have an entry get a pill; case-study bodies number their `##` headings with a CSS counter (01, 02, 03) while `decisions` and `gallery` stay structured front matter; the blog has search plus tag pills and no pagination until there are more than 12 posts; post pages get a TOC from `body.toc`, a reading bar and share actions (copy link, X, LinkedIn); `/film/journal` is the film side of the same blog (posts tagged `film`), so a post is never written twice; a shared `.prose` in `ui.css` replaces the Pro-only prose styles; `/contact` renders both mode variants of its eyebrow and lead through `.day-only`/`.night-only` rather than branching on mode, and picks the film topic on the client only; without `NUXT_PUBLIC_WEB3FORMS_KEY` the form composes the same message as a `mailto:` instead of showing a Send button that cannot work.
- Adversarial review (5 dimensions, every finding put to a refuter): 37 findings raised, 20 refuted, 17 fixed. The one that mattered: query-driven state (`?topic=`, `?kind=`, `?series=`, `?tag=`) was read during setup, but these pages are prerendered without a query, and Vue does not rectify a class mismatch while hydrating; a shared link left the wrong pill highlighted above the right content, permanently. `useQueryFilter` now applies the URL after mount, and `/contact` does the same for its topic and prefills. Also fixed: live regions for the result count and the form result (a region inserted with its text is often not announced), `NuxtRouteAnnouncer` plus a focus reset into `<main>` on navigation, photo alt text in the lightbox trigger labels, the honeypot hidden from assistive tech, translated tag labels on post pages, the missing `blog.tag.film` label, the `#vertical` anchor the night home links to, the player's accessible name and caption tracks, an `--danger` token per mode in place of a hard-coded red that failed contrast at night, tag chips that were invisible on the day background, and `.select()` on the sibling and index queries (the case-study payload dropped from 8.7 KB to 2.7 KB). The dead `contact.*` i18n namespace was removed.
- Gotcha found: vue-i18n reads a bare `@` as a linked message, so `you@example.com` in a locale file crashed the prerender of `/contact`. Literal at signs are written `you{'@'}example.com`.
- Gotcha found: `eslint --fix` rewrites `slot="media"` into `<template #media>`, which breaks media-chrome (a custom element reads the DOM attribute). That one element keeps an inline `eslint-disable` block.

## M5 · Legal and errors
- `/privacy`, `/terms`, `/cookies` from `content/{en,es}/legal/`; `/cookies` is a static notice (no banner, no embeds).
- `app/error.vue` per mode; confirm `404.html` in the static output is the prerendered error page.
- Check: no third-party request on any page apart from the cookieless analytics (Network tab).

## M6 · SEO and metadata
- `titleTemplate`, `useSeo` on every page, `OgDay` / `OgNight` components (S-OG-*), sitemap with both locales and `lastmod` (keep `/sitemap.xml` a real XML file, not a redirect), robots with `/bag` noindex but not disallowed, canonical + hreflang (`x-default` = en), schema.org per `docs/PAGES.md`, RSS route, favicon set from S-Favicon (`favicon.svg` with `prefers-color-scheme` media query, PNG 16/32/180/512, `manifest.webmanifest`, `theme_color` per mode via meta swap).
- Cookieless analytics (Umami or Cloudflare Web Analytics) via @nuxt/scripts, no consent needed; document the choice in `docs/MIGRATION.md`.
- Check: @nuxtjs/seo link checker passes; OG preview correct for `/dev`, `/film`, a post and a film.

## M7 · Motion
- GSAP for scroll-linked and timeline motion (lazy chunk, registered on demand, never in the entry). Mode transition polish, card hovers, More tile fan, FAQ height animation, testimonial crossfade.
- Update the blog post line that says every animation is hand-rolled (both locales).
- Check: GSAP is not in the entry chunk; reduced motion disables every non-essential animation.

## M8 · Media pipeline hookup
- `scripts/media-pull.ts`, `pnpm media:pull` in the generate script, CSP meta for `media.victorgarces.me`, real manifest.
- Check: photography page serves AVIF with WebP fallback; film page plays HLS in Chrome and Safari.

## M9 · Release
- Sentry (optional, only if DSN set), CV PDF in `public/`, redirects for changed slugs, final Lighthouse and axe pass, MX records for `hello@victorgarces.me` confirmed, merge to `master` (deploys through Actions).

## M10 · 3D heroes
- `Hero/PageExploded` with the GLB (or the PNG until it arrives), GSAP ScrollTrigger scrub, hover tilt, reduced-motion path. `Hero/MoonStage` procedural. Add @tresjs/nuxt + @tresjs/cientos (or plain three).
- Check: 3D code in lazy chunks only, within the 3D budget; CPU idle under 5 % with the hero at rest; reduced motion disables scrub and tilt.

## Technical checklist (from the brief) → milestone
privacy M5 · media compression M8 (pipeline) + M2/M4 (@nuxt/image) · terms M5 · sitemap.xml M6 · meta titles M6 · real contact M4 · cookie notice M5 · alt on images M2 · custom 404 M5 · mobile breakpoints M3 · analytics M6 · favicon M6 · Open Graph M6 · reduced motion M7 · JSON-LD M6 · RSS M6 · CV M9 · Sentry M9 · 3D M10.
