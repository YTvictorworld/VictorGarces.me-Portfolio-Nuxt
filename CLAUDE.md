# victorgarces.me · Developer / Filmmaker

Personal portfolio of Víctor Garcés: developer (Vue/Nuxt front-end; C#/.NET, SQL, Docker, AWS back-end) and filmmaker based in Santo Domingo, Dominican Republic. The site itself is the primary work sample: hiring managers read the code and `git log`. It deploys to GitHub Pages at https://victorgarces.me.

Read this file first. Then `docs/PLAN.md` (order of work, plus the **owner decisions that override every other doc**) `docs/DESIGN.md` and `docs/UI-GUIDELINES.md` before touching any UI. `docs/AUDIT.md` lists every known gap in the handoff, grouped by milestone: read the section for the milestone you are working on. `docs/MIGRATION.md` maps every piece of the old site to its new home.

## Status
Dual-mode refactor in progress on branch `refactor/dual-mode`, milestone by milestone (`docs/PLAN.md`). M0 to M7 are done: the landing, both homes, every inner page, the legal pages, the error page, the SEO layer and the bundle cut. Still to come: the media pipeline (M8), release (M9) and the animated heroes (M10, SVG rather than 3D, see PLAN).

## What this is
Two switchable modes that change the whole look:
- **Day = Developer** (light, Albert Sans, teal accent)
- **Night = Filmmaker** (dark, Newsreader italic headlines, gold accent)

Both modes share components and content sources. Only the Home pages differ structurally. The approved design lives in `design/` as self-contained HTML artboards (reference only, never served); `docs/COMPONENTS.md` maps every artboard to components and `docs/ARTBOARD-SPECS.md` has the extracted values.

## Stack
- **Nuxt 4.5**, `ssr: true` + nitro `static` preset: every route is prerendered, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `master`. Node 22 (Nuxt 4.5 declares `^22.19`; 22.18 works locally).
- **Tailwind CSS v4**, wired directly through `@tailwindcss/vite`. Nuxt UI was removed in M7: only three of its components were still in use, while its stylesheet was 247 KiB of which 500 of 526 selectors were never matched. Every component is styled through the tokens and the shared classes in `ui.css`. Do not reintroduce a component library without a reason the tokens cannot serve.
- **@nuxt/content 3**: collections are **per locale** (`<name>_en` / `<name>_es` from `content/en/` and `content/es/`); the one single-locale file is `content/profile.yml` (email, city, socials), so the email lives in one place. Schemas live in `content.schemas.ts`; Content v3 does **not** run them, so a hook in `nuxt.config.ts` validates every file and fails the build (see `docs/CONTENT.md`).
- **@nuxtjs/i18n**: English at `/` (default, `prefix_except_default`), Spanish under `/es`. UI strings in `i18n/locales/{en,es}.json`; routes always go through `localePath()`.
- **@nuxtjs/seo** (sitemap, robots, og-image, schema-org, link-checker), **@nuxt/scripts** (cookieless analytics), **@nuxt/image**, **@vueuse/nuxt**, **@nuxt/eslint**. `@nuxt/fonts` is its own module, configured through the `fonts` key.
- **gsap** is the only animation library: ScrollTrigger, DrawSVG and ScrollSmoother, loaded lazily through `loadGsap()` (`app/utils/gsap.ts`) and used through `useScrollScene()`. Everything else moves with CSS. **media-chrome** + **hls-video-element** for video. No 3D (owner decision, see PLAN M10).

## Hard rules
- Keep every module the current site has: hero, about, experience, blog, testimonials, FAQ, contact, bag, footer. Nothing is removed, only re-themed and, in Filmmaker, reordered. (The old "projects" and "speaking" files were template leftovers, not modules.)
- Mode is a `data-mode="day|night"` attribute on `<html>`; every color, radius and font comes from CSS custom properties in `app/assets/css/tokens.css`. No hard-coded hex in components (exception: OG image components, which Satori renders without CSS variables).
- Routes decide the mode: `/dev/**` and `/es/dev/**` force day, `/film/**` and `/es/film/**` force night, and the forced mode is set with `useHead` so it is in the prerendered HTML. `/` always renders day with a nested night card. Shared pages (`/blog/**`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/bag`, 404) use the stored preference, day by default.
- Anything the design marks with a dashed outline and a `placeholder · source` chip is data-driven: the chip names the collection or manifest field. Do not hard-code that content.
- Real copy in the artboards (headlines, project names, film credits, the email) is final. Text in `[brackets]` is a placeholder: render it from content and keep the sample in the seed files, marked `draft: true` so it never reaches production pages, the sitemap or RSS. Designer annotations that look like copy are listed in `docs/AUDIT.md` (`annotations-read-as-final-copy`) and never ship.
- Copy and translations are written by Claude (owner decision): English is the default, Spanish lives in `content/es/` and `i18n/locales/es.json`. No em-dashes anywhere in UI copy. Never invent facts (dates, clients, numbers): ask or leave the bracketed placeholder.
- Accessibility is not optional: alt is required (enforced by our validation hook and by `useMediaManifest`), `prefers-reduced-motion` disables scrub and tilt, the mode switch announces via `aria-live`, focus rings visible in both modes.
- Performance: LCP under 2.5 s on 4G; initial JS on the Home pages is tracked against the baseline in `docs/MIGRATION.md`; 3D and video code is lazy-loaded and never blocks first paint.
- Every nav entry must resolve to a real page or a real in-page anchor. A dead link costs more credibility than a missing section.
- The media pipeline is a separate repo (`victorgarces-media-pipeline`); this repo only reads its manifest.
- Design skills (taste-skill and the like) never override the approved design. The artboards in `design/` and the tokens are final; a skill may inform work that has no artboard (the M10 SVG heroes) but never changes an artboard's copy, layout, palette or type, and never adds a library the stack does not list.

## Gotchas (learned the hard way)
- Content `post.path` carries the collection prefix (`/en/blog/x`), which is NOT the route in the default locale. Always build links with `localePath('/blog/' + slug)`; the same applies to projects (`/dev/work/`) and films (`/film/films/`).
- `@vueuse/motion`'s `<Motion>` (v3.0.3) threw `TypeError: reading 'state'` on vnode updates during page transitions and broke Vue's render queue. It was removed; do not reintroduce it.
- `<MDC>` async client-side parsing never resolves on this static setup; FAQ answers use the escape-then-bold renderer in `landing/FAQ.vue`. Keep it until FAQ moves to `ContentRenderer`.
- There is no component library and no icon module: icons are inline SVG, and the mobile menu is a native `<dialog>` (the same pattern as `Media/Lightbox`). That is deliberate, see PLAN M7.
- GitHub Pages cannot send HTTP headers: CSP is a `<meta http-equiv>` (no `frame-ancestors`, no `report-uri`) and redirects are prerendered meta-refresh pages listed in `nitro.prerender.routes`.
- `deploy-static.ps1` is destructive: it deletes `.output` (and every untracked file) before copying from it, then force-pushes. Do not run it; deploys go through the Actions workflow.
- Mode-dependent markup renders both variants with `.day-only` / `.night-only` (CSS picks by the nearest `data-mode`). Never branch templates on `mode`: prerendered pages are built in day, the pre-paint script switches them before paint, and a template branch would mismatch on hydration.
- `useAsyncData` keys must include the locale (and slug). Nuxt shares prerendered data between pages with the same key, so a key without the locale serves English data on `/es` pages.
- A `key` on a `useHead` meta stops unhead from claiming the prerendered tag, so it appends a duplicate that the browser ignores. Let `name` dedupe metas.
- `app/error.vue` renders **in place of** `app.vue`, not inside it: no `UApp`, no layout, no route announcer, no `titleTemplate`. It sets its own `data-mode`, theme colour, robots and title, and must not query content (it only ever runs in the browser). On a path that matches a dynamic route, app.vue *does* mount first, so its `titleTemplate` would wrap the error title twice: `error.vue` passes `titleTemplate: null`.
- `404.html` and `200.html` are the SPA shell, always: Nuxt forces both through the no-SSR renderer for static presets. Only `nuxt.config`'s `app.head` reaches them, which is why `MODE_PREPAINT_SCRIPT` lives there and not in `app.vue`.
- State that comes from the URL query must be applied **after mount**, never during setup. Pages are prerendered without a query, and Vue does not rectify a class mismatch while hydrating (only node types and form values), so a shared `/dev/work?kind=infra` would keep the "All" pill highlighted above filtered content, forever. Use `useQueryFilter()` for filters; `/contact` does the same for its topic.
- Open Graph cards are rendered by Satori, which resolves no CSS custom properties and has no grid. `app/components/OgImage/*.satori.vue` is therefore the one place literal hex and flexbox belong, and the `.satori.vue` suffix is mandatory in nuxt-og-image v6. `satori` must stay an explicit dependency.
- A newly added composable fails `pnpm generate`'s typecheck with "Cannot find name" until `pnpm typecheck` has run once on its own. Run it first after adding one.
- vue-i18n reads a bare `@` as its linked-message syntax, so `you@example.com` in a locale file throws "Invalid linked format" and the page 500s at prerender. Escape literal at signs: `you{'@'}example.com`.
- `eslint --fix` rewrites `slot="media"` into `<template #media>`, which never reaches media-chrome (a custom element reads the real DOM attribute). `Media/FilmPlayer.vue` keeps an inline `eslint-disable` block around that element.
- ScrollSmoother (`plugins/smooth-scroll.client.ts`) transforms `#smooth-content`, so nothing fixed or sticky may live inside it on `/dev/**` or `/film/**`: the header and the mode pill sit outside it in `layouts/default.vue`, and the header turns fixed under `html[data-smooth]`. Scroll scenes must be built with `useScrollScene()`, which waits for the page's smoother; a pin created before it exists is of the wrong kind.
- In a scoped `<style>`, Vue keeps only the `:global()` part of a selector, so `:global(html[data-x]) .thing` styles `<html>` itself. Rules that hang off `<html>` go in an unscoped block with an exact selector.
- Tailwind v4 scans every project file: `design/` and `docs/` are excluded with `@source not` in `main.css`.
- `gltf-transform optimize` with default flags merges the named `layer_*` meshes; use the exact command in `docs/3D.md`.

## Where things live
```
app/
  assets/css/tokens.css        design tokens, both modes (M1)
  components/<Group>/<Name>.vue  see docs/COMPONENTS.md, auto-imported as <GroupName>
  components/Reveal.vue        CSS + IntersectionObserver entrance reveal (kept; not a tweening library)
  utils/mode.ts                mode rules: forced routes, toggle siblings, pre-paint script, theme colors
  composables/useMode.ts       mode state + localStorage (no cookie); middleware/mode.global.ts sets it per route
  layouts/default.vue          header with toggle, footer
  pages/                       see docs/PAGES.md
  error.vue                    404 per mode (M5)
  utils/site.ts                SITE_URL / SITE_NAME
content/{en,es}/               per-locale collections, see content.config.ts and docs/CONTENT.md
content/profile.yml            single-locale facts: email, city, timezone, socials
content.schemas.ts             zod schemas for every collection and the media manifest
scripts/media-ingest.mjs       local stand-in for the media pipeline (`pnpm media:ingest`)
content/media/manifest.json    pulled from the pipeline by `pnpm media:pull` (M8)
design/                        approved artboards (reference only)
docs/                          plan, design system, UI guidelines, audit, migration map, handoff snippets
.claude/skills/               project skills; web-design-guidelines reviews UI against docs/UI-GUIDELINES.md
```

## Working style
- Work milestone by milestone as in `docs/PLAN.md`. Finish, run `pnpm lint && pnpm typecheck && pnpm generate`, then commit with the milestone id in the message and move on. `pnpm lint:fix` handles formatting (no semicolons, single quotes, no trailing commas).
- When a design detail is ambiguous, open the matching artboard in `design/` and follow it. If it is still ambiguous, pick the simpler option and leave a `// DESIGN:` comment.
- Commit messages: imperative, professional. The repo is public and hiring managers read `git log`.
