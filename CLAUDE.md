# VictorGarces.com — Portfolio

Personal portfolio of Víctor Garcés: full-stack developer (Vue/Nuxt front-end; C#/.NET, SQL, Docker, AWS, microservices back-end) and filmmaker based in Santo Domingo, Dominican Republic. The site itself is the primary work sample — every engineering decision here is on display for hiring managers. The site deploys to GitHub Pages at https://victorgarces.me (canonical/sitemap URLs live in `app/utils/site.ts`).

## Stack

- **Nuxt 4** (SPA, `ssr: false`, `nitro.preset: static`) deployed to GitHub Pages via Actions (`.github/workflows/deploy.yml`)
- **Nuxt UI 3** (free tier — do NOT use `UPage*` / Pro-only components) + Tailwind CSS v4
- **@nuxt/content 3** — all copy lives in `content/*.yml` and `content/blog/*.md`, validated by Zod schemas in `content.config.ts`
- **No animation library** — motion is hand-rolled (IntersectionObserver + CSS transitions in `Reveal.vue`, rAF in `ImageMarquee.vue`, scroll-linked beams). @vueuse/motion was removed: its `<Motion>` component (v3.0.3) throws `TypeError: reading 'state'` on vnode updates during page transitions and breaks Vue's render queue. Do not reintroduce it.
- **@vueuse/nuxt** for composables

## Architecture

```
app/
  components/
    Reveal.vue          # THE motion primitive — all scroll/mount reveals go through it
    ImageMarquee.vue    # rAF marquee: delta-time based, pauses offscreen, reduced-motion aware
    AppHeader.vue       # floating pill nav (icons + tooltips), fixed via vue-use-fixed-header
    landing/            # Hero, About, WorkExperience, Testimonials, FAQ — one section each
  pages/
    index.vue           # landing: Hero → About/Experience → Testimonials → FAQ
    blog/index.vue      # searchable post list
    blog/[slug].vue     # post page via ContentRenderer (manual prose styles — no UI Pro)
    bag.vue             # gear list (off-nav, reachable by URL)
  utils/
    links.ts            # single source of truth for nav — every entry MUST resolve
    format.ts           # shared formatDate
content/                # all copy — no hardcoded strings in components
```

## Brand palette — "Ember" (cinematic orange & teal grade)

Victor is a filmmaker, so the UI reads like film: **ember-orange highlights over a pure black background**. `primary` is a custom `ember` scale (sunset orange, defined in `@theme` in `main.css` — not a stock Tailwind name); `neutral` stays `neutral` — Victor explicitly wants the dark background pure black (#0a0a0a), never blue/slate-tinted. All text/border/bg utilities use `neutral-*`. A near-invisible film-grain overlay (`body::before`, 2.8% opacity SVG noise) reinforces the identity. When adding UI, always use `primary-*` / `neutral-*` tokens.

## Core decisions (and the reasoning)

1. **One motion system.** All entrance animation goes through `Reveal.vue` (pure CSS transitions + IntersectionObserver): `immediate` for above-the-fold, viewport-triggered otherwise. It renders static content when `prefers-reduced-motion: reduce`. Scroll-linked motion lives in `ScrollBeam.vue` (self-drawing line + comet tip) and `ScrollProgress.vue` (top reading bar). The nav (`AppHeader.vue`) has a scroll-spy that follows sections on the home page.
2. **Content/code separation.** Components render whatever the Zod-validated YAML provides. Copy edits never touch `.vue` files.
3. **Nav integrity.** `links.ts` only lists routes that exist. Template pages that were never personalized (projects, speaking) stay out of nav — a dead link or fake VueConf talk costs more credibility than a missing section.
4. **Marquee is JS-driven but disciplined:** delta-time (frame-rate independent), IntersectionObserver pause offscreen, static scrollable strip under reduced motion, edge fade masks.
5. **SPA + static output** keeps GitHub Pages hosting free; SEO metadata is set per-page with `useSeoMeta`, OG image is Victor's own (never the Nuxt template asset).

## Metrics this redesign targets

- **Recruiter conversion:** hero CTA changed from "Use this template" (template leftover) to "Get in touch" (mailto) + GitHub — the two actions a hiring manager actually takes.
- **Zero dead ends:** removed 3 nav links that 404'd (`/projects`, `/speaking`, `/about`); blog post page went from raw-slug stub to full rendered article.
- **Performance:** marquee no longer burns rAF frames offscreen; images lazy-load beyond the first three; animations are GPU-friendly transforms only.
- **Accessibility:** full `prefers-reduced-motion` support (CSS + JS), aria-labels on nav/socials, semantic `figure`/`blockquote`/`time` markup.

## Rules for future changes

- Every nav entry in `links.ts` must resolve to a real page — check before adding.
- New sections: copy in `content/`, schema in `content.config.ts`, component in `landing/`, wrapped in `Reveal`.
- Free Nuxt UI only (`UButton`, `UAvatar`, `UCarousel`, `UTabs`, `UAccordion`, `UInput`, `UContainer`, `UTooltip`); no `@nuxt/ui-pro` components.
- Run `pnpm generate` before pushing — `typeCheck: true` makes the build the test suite.
- Commit messages: imperative, professional. The repo is public and hiring managers read `git log`.
