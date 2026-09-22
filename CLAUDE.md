# victorgarces.me · Developer / Filmmaker

Personal portfolio of Víctor Garcés: developer (Vue/Nuxt front-end; C#/.NET, SQL, Docker, AWS back-end) and filmmaker based in Santo Domingo, Dominican Republic. The site itself is the primary work sample: hiring managers read the code and `git log`. It deploys to GitHub Pages at https://victorgarces.me.

Read this file first. Then `docs/PLAN.md` (order of work, plus the **owner decisions that override every other doc**) and `docs/DESIGN.md` before touching any UI. `docs/AUDIT.md` lists every known gap in the handoff, grouped by milestone: read the section for the milestone you are working on. `docs/MIGRATION.md` maps every piece of the old site to its new home.

## Status
Dual-mode refactor in progress on branch `refactor/dual-mode`, milestone by milestone (`docs/PLAN.md`). Until M3/M4 replace them, the old single-mode pages (`app/components/landing/*`, `AppHeader.vue`, the `index_*` collections) are still what renders.

## What this is
Two switchable modes that change the whole look:
- **Day = Developer** (light, Albert Sans, teal accent)
- **Night = Filmmaker** (dark, Newsreader italic headlines, gold accent)

Both modes share components and content sources. Only the Home pages differ structurally. The approved design lives in `design/` as self-contained HTML artboards (reference only, never served); `docs/COMPONENTS.md` maps every artboard to components and `docs/ARTBOARD-SPECS.md` has the extracted values.

## Stack
- **Nuxt 4.5**, `ssr: true` + nitro `static` preset: every route is prerendered, deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `master`. Node 22 (Nuxt 4.5 declares `^22.19`; 22.18 works locally).
- **Nuxt UI 4** (Pro components are free since v4) + Tailwind CSS v4. Components are styled only through the tokens.
- **@nuxt/content 3**: collections are **per locale** (`<name>_en` / `<name>_es` from `content/en/` and `content/es/`); the one single-locale file is `content/contact.yml` (email, city, socials), so the email lives in one place. Content v3 does **not** validate the zod schema at build: validation is our own hook (M2).
- **@nuxtjs/i18n**: English at `/` (default, `prefix_except_default`), Spanish under `/es`. UI strings in `i18n/locales/{en,es}.json`; routes always go through `localePath()`.
- **@nuxtjs/seo** (sitemap, robots, og-image, schema-org, link-checker), **@nuxt/scripts** (cookieless analytics), **@nuxt/image**, **@vueuse/nuxt**, **@nuxt/eslint**. `@nuxt/fonts` comes with Nuxt UI and is configured through the `fonts` key.
- **gsap** is the only tweening library. **media-chrome** + **hls-video-element** for video. **@tresjs/*** is added only in the final 3D milestone.

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

## Gotchas (learned the hard way)
- Content `post.path` carries the collection prefix (`/en/blog/x`), which is NOT the route in the default locale. Always build links with `localePath('/blog/' + slug)`; the same applies to projects (`/dev/work/`) and films (`/film/films/`).
- `@vueuse/motion`'s `<Motion>` (v3.0.3) threw `TypeError: reading 'state'` on vnode updates during page transitions and broke Vue's render queue. It was removed; do not reintroduce it.
- `<MDC>` async client-side parsing never resolves on this static setup; FAQ answers use the escape-then-bold renderer in `landing/FAQ.vue`. Keep it until FAQ moves to `ContentRenderer`.
- Nuxt UI ships its own color mode (`.dark` class, `--ui-*` variables). `useMode` must drive it (or it must be disabled and bridged to the tokens) so primitives follow `data-mode`, not the OS.
- GitHub Pages cannot send HTTP headers: CSP is a `<meta http-equiv>` (no `frame-ancestors`, no `report-uri`) and redirects are prerendered meta-refresh pages listed in `nitro.prerender.routes`.
- `deploy-static.ps1` is destructive: it deletes `.output` (and every untracked file) before copying from it, then force-pushes. Do not run it; deploys go through the Actions workflow.
- Mode-dependent markup renders both variants with `.day-only` / `.night-only` (CSS picks by the nearest `data-mode`). Never branch templates on `mode`: prerendered pages are built in day, the pre-paint script switches them before paint, and a template branch would mismatch on hydration.
- A `key` on a `useHead` meta stops unhead from claiming the prerendered tag, so it appends a duplicate that the browser ignores. Let `name` dedupe metas.
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
content/contact.yml            single-locale facts: email, city, timezone, socials (M2)
content/media/manifest.json    pulled from the pipeline by `pnpm media:pull` (M8)
design/                        approved artboards (reference only)
docs/                          plan, design system, audit, migration map, handoff snippets
```

## Working style
- Work milestone by milestone as in `docs/PLAN.md`. Finish, run `pnpm lint && pnpm typecheck && pnpm generate`, then commit with the milestone id in the message and move on. `pnpm lint:fix` handles formatting (no semicolons, single quotes, no trailing commas).
- When a design detail is ambiguous, open the matching artboard in `design/` and follow it. If it is still ambiguous, pick the simpler option and leave a `// DESIGN:` comment.
- Commit messages: imperative, professional. The repo is public and hiring managers read `git log`.
