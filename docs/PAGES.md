# Pages and routes

All routes exist in `en` (no prefix) and `es` (`/es/...`) via @nuxtjs/i18n `prefix_except_default`. Every route is prerendered.

| route | page | mode | artboard | title (en) |
|---|---|---|---|---|
| `/` | `pages/index.vue` | first visit; if `vg-mode` is stored (localStorage, no cookie), client redirects to `/dev` or `/film` after paint (server still renders the landing so the URL stays shareable) | F-Landing | Víctor Garcés · Developer and Filmmaker |
| `/dev` | `pages/dev/index.vue` | forces day | F-Home-Dev | Developer |
| `/dev/work` | `pages/dev/work/index.vue` | day | D-Work | Work |
| `/dev/work/[slug]` | `pages/dev/work/[slug].vue` | day | D-Project | project title |
| `/dev/about` | `pages/dev/about.vue` | day | D-About | About |
| `/film` | `pages/film/index.vue` | forces night | F-Home-Film | Filmmaker |
| `/film/films` | `pages/film/films/index.vue` | night | N-Films | Films |
| `/film/films/[slug]` | `pages/film/films/[slug].vue` | night | N-Film | film title |
| `/film/photography` | `pages/film/photography.vue` | night | N-Photography | Photography |
| `/film/journal` | `pages/film/journal.vue` | night | N-Journal | Journal |
| `/film/about` | `pages/film/about.vue` | night | N-About | About |
| `/blog` | `pages/blog/index.vue` | stored mode (default day) | D-Blog | Blog |
| `/blog/[slug]` | `pages/blog/[slug].vue` | stored mode | D-Post | post title |
| `/contact` | `pages/contact.vue` | stored mode; `?topic=film` preselects the film topic | D-Contact | Contact |
| `/privacy`, `/terms` | `pages/privacy.vue`, `pages/terms.vue` | stored mode | S-Legal | Privacy, Terms |
| `/cookies` | `pages/cookies.vue` | stored mode | S-Cookies | Cookies (reopens the consent choice) |
| `/bag` | existing | stored mode | none | noindex, not in sitemap, not in nav |
| 404 | `app/error.vue` | stored mode | S-404 | Page not found |

Forcing mode: a route middleware reads `route.path`, sets `data-mode` for `/dev/**` and `/film/**`, and does not touch the stored preference. The header toggle on a forced page navigates to the sibling in the other mode (`/dev` ↔ `/film`, `/dev/about` ↔ `/film/about`, `/dev/work` ↔ `/film/films`), and on shared pages it just flips the attribute.

## SEO per page
- Every page calls **`useSeo({ title, description, mode?, type?, cardTitle?, meta? })`** (`app/composables/useSeo.ts`). It sets the title, the description and the Open Graph card in one place; no page calls `useSeoMeta` directly. `titleTemplate: '%s · Víctor Garcés'` lives in `app.vue`.
- OG image: rendered by Satori at build time from `app/components/OgImage/OgDay.satori.vue` and `OgNight.satori.vue` (S-OG-Dev / S-OG-Film), 1200×630. The `.satori.vue` suffix is required by nuxt-og-image v6. Fonts come from the `@nuxt/fonts` config, not from `public/fonts`. `zeroRuntime` is on: the cards exist as files, and no generator ships.
  - Template by route: `/film/**` → OgNight, everything else → OgDay. A blog post tagged `film` passes `mode: 'night'`.
  - The card's big line is the page title, except on `/`, `/dev` and `/film`, which pass `cardTitle: SITE_NAME` as the artboards draw it. The eyebrow and the fallback strapline are i18n (`og.dev.*`, `og.film.*`), so both languages get their own.
  - Post covers are not used as OG images; every page gets the rendered card.
- Schema.org: `Person` on `/`, `/dev/about`, `/film/about` (from `content/profile.yml`, with `sameAs` for all three accounts); `Article`/`BlogPosting` on posts; `ImageGallery` on `/film/photography`. **No `VideoObject` yet**: it needs `uploadDate`, no film has one, and the videos are still `pending` in the manifest. It lands with M8.
- `robots`: allow all, no `Disallow`; `/bag` and `/es/bag` carry `robots: false` through `routeRules`, which also drops them from the sitemap. Sitemap is a single `/sitemap.xml` (`sitemaps: false`) with both locales; `lastmod` comes from the blog dates.
- Canonical per locale, `hreflang` en/es, `x-default` = en, all from `useLocaleHead()` in `app.vue`.
- RSS: `server/routes/rss.xml.ts` and `server/routes/es/rss.xml.ts`, both built on `server/utils/feed.ts`. Drafts are excluded. They are server routes, so they are listed explicitly in `nitro.prerender.routes` (the crawler only follows extensionless and `.json` links), and each page links its own locale's feed.
- Favicons: `pnpm favicons` regenerates the whole set from the tokens (`scripts/make-favicons.mjs`). `favicon.svg` follows the reader's system theme through a `prefers-color-scheme` media query; the PNGs are the day mark; the 180 and 512 tiles are full bleed, plus a maskable 512. No `.ico` ships. The links live in `nuxt.config`'s `app.head` so the SPA shell and the error page get them too.

## Static generation
- `nitro.prerender.crawlLinks: true` plus explicit routes for every collection entry in both locales (hook `nitro:config` or `prerender:routes` reading the collections).
- `404.html` is NOT a prerendered `app/error.vue`. Nuxt renders `/200.html` and `/404.html` with SSR disabled for every static preset, so both are the empty SPA shell and `error.vue` mounts client-side on top of whichever URL failed. That is why the mode pre-paint script lives in `nuxt.config.ts` under `app.head`: only that reaches the shell, so an unknown URL still paints in the right mode. GitHub Pages serves the one root `404.html` for every unknown path, `/es/**` included.
- Images: @nuxt/image with the `ipx` static provider for local assets; manifest images come pre-sized from the CDN and bypass @nuxt/image.
