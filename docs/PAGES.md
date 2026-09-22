# Pages and routes

All routes exist in `en` (no prefix) and `es` (`/es/...`) via @nuxtjs/i18n `prefix_except_default`. Every route is prerendered.

| route | page | mode | artboard | title (en) |
|---|---|---|---|---|
| `/` | `pages/index.vue` | first visit; if `vg-mode` cookie exists, client redirects to `/dev` or `/film` after paint (server still renders the landing so the URL stays shareable) | F-Landing | Víctor Garcés · Developer and Filmmaker |
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
- `titleTemplate: '%s · Víctor Garcés'`, `useSeoMeta` with description from front matter or i18n.
- OG image: `defineOgImageComponent('OgDay' | 'OgNight', { title, subtitle })` matching S-OG-Dev / S-OG-Film. 1200×630, fonts loaded from `public/fonts`.
- Schema.org: `Person` on `/`, `/dev/about`, `/film/about`; `BlogPosting` on posts; `VideoObject` on film pages (name, description, thumbnailUrl from manifest, uploadDate, duration); `ImageGallery` on photography.
- `robots`: allow all except `/bag` and `/es/bag`. Sitemap from @nuxtjs/seo with both locales and `lastmod` from content.
- Canonical per locale, `hreflang` en/es, `x-default` = en.
- RSS: `server/routes/rss.xml.ts` from the blog collection.

## Static generation
- `nitro.prerender.crawlLinks: true` plus explicit routes for every collection entry in both locales (hook `nitro:config` or `prerender:routes` reading the collections).
- `app/error.vue` is generated to `404.html` by the static preset; verify after `pnpm generate`.
- Images: @nuxt/image with the `ipx` static provider for local assets; manifest images come pre-sized from the CDN and bypass @nuxt/image.
