# Migration map

Where every piece of the current site (master @ `8b7623f`, audited 2026-09-22) lands in the dual-mode structure. Rule: nothing real is lost. If a field does not fit the new schema, the schema is extended. Owner decisions and handoff corrections are in `docs/PLAN.md`; the full gap list is `docs/AUDIT.md`.

## 1. Routes

| current route (en + /es) | file today | new home | notes |
|---|---|---|---|
| `/` | `pages/index.vue` (Hero, About, Experience, Testimonials, FAQ) | `/` becomes the first-visit landing (F-Landing); the old home content moves to `/dev` (F-Home-Dev) and, re-ordered, to `/film` (F-Home-Film) | Old in-page anchors `/#about`, `/#experience`, `/#faq` become `/dev#about`, `/dev#experience`, `/dev#faq`. Nothing external links to them. |
| `/blog` | `pages/blog/index.vue` | same route (D-Blog), shared page, stored mode | Search, count and empty state are kept. |
| `/blog/[slug]` | `pages/blog/[slug].vue` | same route (D-Post) | Both slugs unchanged: `ai-and-my-two-crafts`, `machine-learning-talk-unapec`. No redirects needed. |
| `/contact` | `pages/contact.vue` | same route (D-Contact), `?topic=film` preselects film | Channels, availability and copy-email are kept (see §4). |
| `/bag` | `pages/bag.vue` | same route, re-themed | Off-nav, `noindex`, excluded from the sitemap (already true after M0). |
| 404 | Nuxt default error page | `app/error.vue` per mode (S-404) | M5. |
| (new) | | `/dev/work`, `/dev/work/[slug]`, `/dev/about`, `/film/films`, `/film/films/[slug]`, `/film/photography`, `/film/journal`, `/film/about`, `/privacy`, `/terms`, `/cookies`, `/rss.xml` | M4 to M6. |

## 2. Components

| current | new | notes |
|---|---|---|
| `layouts/default.vue` (ScrollProgress + AppHeader + UContainer + AppFooter) | `layouts/default.vue` with `Shell/Header`, `Shell/Footer` | The `max-w-6xl` container becomes the `--gutter` tokens. The landing (`/`) uses no header or footer chrome other than the legal links it needs (M3). |
| `AppHeader.vue` (icon pill nav, tooltips, locale switch, color mode button, scroll-spy, hide-on-scroll, 0.5 s `header-in` entrance) | `Shell/Header` + `Shell/ModeToggle` + `Shell/LangSwitch` + mobile menu | Text nav from `useNav(mode)`. Scroll-spy is kept on `/dev` only, for the Experience anchor (every other item is a route). Hide-on-scroll (`vue-use-fixed-header`) is kept if the artboards allow it; otherwise the header is sticky. The entrance animation goes through `Reveal`. The language link passes `:locale="false"` to `ULink`, because Nuxt UI 4 re-localizes every path (fixed in M0). |
| `AppFooter.vue` (credits + social icons) | `Shell/Footer` | Year stays dynamic. Social links move to the contact block (`contact_*.socials`). |
| `ColorModeButton.vue` (color-mode + view-transition circle) | `Shell/ModeToggle` + `useModeTransition` | Its circle clip-path idea carries over; the English-only aria-label is replaced by i18n keys. Deleted in M1. |
| `AppImage.vue` (img + shimmer + error fallback) | `Media/FilmImage` for manifest images; a slim local-image component (built on `NuxtImg`) keeps the skeleton and error fallback for covers and portraits | M2/M4. |
| `Reveal.vue` (CSS transitions + IntersectionObserver, SSR-visible, reduced-motion static) | kept as the entrance primitive | Not a tweening library, so it does not conflict with "GSAP only". GSAP handles scroll-linked and timeline motion. |
| `ImageMarquee.vue` (rAF marquee of hero photos) | retired; its photos move to `Photo/Filmstrip` (night home) and `/film/photography` | The design uses native scroll-snap, no autonomous marquee. |
| `ScrollBeam.vue` (scroll-drawn gradient line) | retired; `Experience/Timeline` draws a static 1 px line with dots | DESIGN.md forbids gradients outside the night glow. |
| `ScrollProgress.vue` (reading bar) | kept on `/blog/[slug]` only, solid `--accent` | A reading aid on long posts; no gradient. |
| `landing/Hero.vue` | `Hero/Dev`, `Hero/Film` | Avatar goes to `About/Teaser`; social row to the contact block; availability badge to the contact aside; marquee as above; the day radial glow is dropped (night keeps its glow). |
| `landing/About.vue` | `About/Teaser` (day), `About/TeaserCard` (night), `About/Page` / `About/PageFilm` | |
| `landing/WorkExperience.vue` | `Experience/Timeline` | Company links kept via `experience.url`. The per-company colored dot becomes the token dot. |
| `landing/Testimonials.vue` (UCarousel, 5 s) | `Testimonials/Grid` / `Testimonials/Carousel` (day), `Testimonials/Single` (night, 8 s) | Initial-letter avatar fallback kept (no avatars exist today). Quotes run 250 to 290 characters, so cards grow with the text instead of the artboard's fixed two-line height. |
| `landing/FAQ.vue` (UTabs per category + UAccordion, escape-then-bold renderer) | `Faq/List` (day), `Faq/TwoColumn` (night), `Faq/Item` | Categories kept as a field. Home shows `featured` entries with a "show all" expander, so all 11 stay reachable. The bold renderer is kept. |
| `utils/links.ts` | `useNav(mode)` | Every entry resolves: day Work `/dev/work`, About `/dev/about`, Experience `/dev#experience`, Blog `/blog`, Contact `/contact`; night Films `/film/films`, Photography `/film/photography`, Journal `/film/journal`, About `/film/about`, Contact `/contact?topic=film`. |
| `utils/format.ts`, `utils/site.ts` | kept | |

## 3. Content, entry by entry

New layout: `content/en/…` and `content/es/…` mirror each other; every collection is defined per locale.

### Home copy (`content/{en,es}/index.yml`, collection `index_*`)

| entry | lands in |
|---|---|
| `seo.title`, `seo.description` | `content/{en,es}/pages/dev.yml` `seo` (page-copy collection `pages_*`). The title becomes "Developer" per PAGES.md (today it renders the name twice: "Víctor Garcés \| Full-Stack Developer & Filmmaker · Víctor Garcés"). The `/` landing gets its own copy. |
| `title` "Hey, I'm Víctor Garcés", `roles`, `description` | Replaced by the final hero copy in F-Home-Dev ("Thin, end to end. Then hardened.") and F-Home-Film ("Stories that fit in six minutes."). The current description is kept as the `/` landing's meta description. |
| `hero.links` (Get in touch / GitHub) | Hero buttons become "See the work" + "Download CV" (final copy); the email and GitHub move to the contact block. |
| `hero.images` (7 Behance photos, alt EN + ES) | Downloaded to `public/media/` and listed in the hand-written manifest (M2). They come from two Behance projects (portrait, editorial, event and cinematic frames), so series are assigned after looking at them, not all as `events-2025`. The manifest contract gains `alt_es` so the Spanish alts survive. |
| `about.title`, `about.description` | `content/{en,es}/about/dev.md`: the description becomes the story body, aligned with the positioning in §7; the `teaser` is a two-line version of it (the first two sentences run about 70 words, too long for the design's two lines). The film version (`about/film.md`) is written from the same facts. |
| `experience.title` | Replaced by the design heading "Where I've worked and studied" (page copy). |
| `experience.items` (3) | `content/{en,es}/experience.yml`, merged with the design's 4 (below). |
| `testimonials` (3) | `content/{en,es}/testimonials.yml` (below). |
| `blog.title`, `blog.description` | Never rendered today; replaced by the design heading "Notes from building things". |
| `faq.title`, `faq.description`, `faq.categories` (3 categories, 11 questions) | `content/{en,es}/faq.yml` (below); headings become "Questions I get before a project" (day) and "Before you book" (night). |

### Experience (7 entries, both locales)
Schema extension: `url` optional, `summary` optional, `from` nullable. An unknown year is stored as `null` and renders nothing: no `[YEAR]` ever reaches a page.

| entry | source | from → to |
|---|---|---|
| Back-End Developer · Sigmedic | current site | 2025 → now (`current: true`) |
| Volunteer · PLERD (url `https://plerd.minerd.gob.do`) | current site | start year unknown → now |
| Front-End Developer · As de Picas (url `https://asdepicassalones.es`) | current site | 2024 → 2025 |
| Freelance developer | design | unknown (`null`) → now |
| Director of Communications & Marketing · La Voz Juvenil RD | design | unknown (`null`) → now |
| Software Engineering · UNAPEC | design | unknown (`null`) → now |
| Technical degree, Development and Administration of Computer Applications · Instituto Politécnico Francisco José Peynado | design | unknown (`null`) |

The home shows the most recent entries; the full list lives on `/dev/about`. Company colors (`#2dd4bf`, `#033b74`, `#00DC82`) are dropped: the timeline uses token dots.

### Testimonials (3, both locales)
`quote`, `name`, `role` (from `author.description`), `mode`, plus an optional `context` for the night byline ("[Name] · [Event or project]"); empty avatar fields are omitted.

| name | role | mode | why |
|---|---|---|---|
| Derwin Eusebio | Audiovisual Coordinator, PLERD | both | film work for PLERD; also fits the day heading "What people I've worked with say" |
| Elcilia Del Carme Torres G. | Educational Manager and Trainer | both | event photography |
| Victor J. Garces | Software Engineer | dev | web work: it must not appear under the night heading "From people in front of the camera" |

Day shows all three (matches the 3-card grid); night rotates the two film quotes.

### FAQ (11, both locales)
Schema extension: `category`, `order`, `featured`, `draft`, and answers rendered with the bold renderer. Q6 keeps its "within up to three business days" policy; the contact response time (§3 Contact) is the typical one, so the two do not contradict.

| # | question | category | mode |
|---|---|---|---|
| 1 | What services do you offer? | Services & Process | dev |
| 2 | What technologies do you work with? | Services & Process | dev |
| 3 | How do you work? | Services & Process | dev |
| 4 | What will you need from me? | Services & Process | dev |
| 5 | How is a project priced and billed? | Pricing & Timelines | dev |
| 6 | How long does a project take? | Pricing & Timelines | dev |
| 7 | How many revisions are included? | Pricing & Timelines | dev |
| 8 | What about hosting, domains and other services? | Pricing & Timelines | dev |
| 9 | Do you offer maintenance and support? | Pricing & Timelines | dev |
| 10 | What do you enjoy most about your work? | About Me | both |
| 11 | What are your hobbies outside of work? | About Me | both |

Night gets four film questions ("Before you book") written in M2 from facts already on the site; any that need a number or a policy stay bracketed and `draft: true` until confirmed.

### Blog (2 posts × 2 locales)
`content/{en,es}/blog/ai-and-my-two-crafts.md` and `machine-learning-talk-unapec.md` stay in place (same slugs). Front matter changes:
- `image` (string) → `cover: { src, alt }`, with alt written in both locales; the Behance cover of `ai-and-my-two-crafts` is downloaded to `public/media/`.
- `minRead` and `author` stay (schema extended; `author` is optional). `author.avatar` points at the downloaded portrait; `author.description` follows the positioning in §7; `author.username` / `author.twitter` (`YTvictorworld`) stay in front matter and join the socials question in §7.
- The closing line of each post links to the localized `/contact` route instead of a literal mailto, so the address lives in one place.
- `tags`: `ai-and-my-two-crafts` gets `film` (it covers both crafts, so it also appears in the Journal); `machine-learning-talk-unapec` gets `talks`.
- `date` keeps the unquoted YAML date (`z.date()` / coerce).

`content/{en,es}/blog.yml` (collection `pages_*`: title, description, links) becomes `content/{en,es}/pages/blog.yml` and feeds the `/blog` Page/Title and SEO. Its "Get in touch" mailto button is dropped: D-Blog has no CTA and Contact is in the nav.

### Bag
`content/bag.yml` mixes English and Spanish descriptions and serves both locales. In M2 it becomes per-locale (`content/{en,es}/bag.yml`, collections `bag_en` / `bag_es`) with every description translated. Items unchanged: Hardware (Keychron K2, MacBook Pro 16"), Software (Visual Studio Code, Figma), Desk (FlexiSpot), Other (Sony WH-1000XM4). The unused `icon` fields stay.

### Contact, socials and global config (`app/app.config.ts`)

| entry | lands in |
|---|---|
| `global.email` the previous personal address (also in both `index.yml`, both `blog.yml` and the closing line of all 4 post bodies) | `hello@victorgarces.me` (owner decision), stored once in the single-locale `content/profile.yml` (email, city, timezone, socials); `content/{en,es}/contact.yml` holds only the translated labels (topics, budgets, timelines, response time). Post closing lines link to `/contact`. |
| `contact.intro` "I usually reply within 24 hours" | `contact_*.responseTime` ("usually within 24 hours"); it was also the /contact meta description, now the D-Contact lead |
| `contact.location` "Santo Domingo, Dominican Republic · Working with clients worldwide" | `content/profile.yml` `city` + `timezone`; "Working with clients worldwide" moves into the aside line |
| `global.meetingLink` (LinkedIn) | `contact_*.socials` |
| `global.available` | `contact_*.available` (schema extension), shown in `Contact/Aside` and the contact block |
| `global.picture` (Behance portrait, used as avatar, og:image and JSON-LD image; alt "My profile picture") | Downloaded to `public/media/portrait.*`; `about_*.portrait` with a descriptive alt in both locales; OG images come from `OgDay`/`OgNight` (M6). Once no Behance URL is left (M2), the `preconnect` to `mir-s3-cdn-cf.behance.net` in `app.vue` goes too. |
| `footer.links`: LinkedIn `vgfilm07`, GitHub `YTvictorworld`, Instagram (personal account) (aria-label "Social Media") | `content/profile.yml` socials with `mode` (GitHub dev, Instagram film, LinkedIn both); the Instagram label becomes "Instagram". The design's Instagram handle `@vgfilmx` and a YouTube channel do not match today's accounts; see §7. |
| Hero availability chip on the avatar and its button to `meetingLink` | availability line in the contact block and `Contact/Aside`; LinkedIn stays in socials |
| `footer.credits` | `Shell/Footer` |
| `ui.colors` (ember / neutral) | Retired in M1 (tokens) |
| `uiPro`, `footer.colorMode` | Deleted in M0 (unused template config) |

### Media and public files

| file | fate |
|---|---|
| `public/images/blog/machine-learning-talk-unapec.jpg` | kept, referenced by `cover.src` |
| `public/favicon.ico` | kept until the S-Favicon set lands (M6) |
| `public/robots.txt`, `public/sitemap.xml` | deleted in M0; generated by @nuxtjs/seo (`/bag` noindex, not in the sitemap) |

## 4. UI strings (`i18n/locales/{en,es}.json`)

| key | fate |
|---|---|
| `nav.about`, `nav.experience`, `nav.blog`, `nav.contact`, `nav.main`, `nav.switchLocale` | kept by `useNav` / `Shell/Header` / `Shell/LangSwitch`; new keys `nav.work`, `nav.films`, `nav.photography`, `nav.journal` |
| `nav.home` | dropped: the brand link's accessible name stays its visible text "Víctor Garcés" (label-in-name) |
| `hero.available`, `hero.unavailable` | availability line in the contact block and aside |
| `about.eyebrow`, `experience.eyebrow`, `testimonials.eyebrow`, `faq.eyebrow` | section eyebrows (values updated to the design copy: "About", "Experience", "Testimonials", "FAQ") |
| `testimonials.title` | replaced by the design headings (day and night keys) |
| `blog.eyebrow`, `blog.searchPlaceholder`, `blog.postsFound`, `blog.noResults`, `blog.clearSearch`, `blog.minRead` | kept by `/blog` and the post cards |
| `blog.allPosts` | D-Post "← All posts" back link (today it is only the post page's top button) and the home "All posts" button |
| `blog.thanks`, `blog.backToPosts` | kept as the post footer above `Blog/PrevNext` |
| `contact.eyebrow`, `contact.emailMe`, `contact.copy`, `contact.copied`, `contact.copyAria`, `contact.copiedAria`, `contact.linkedinDesc`, `contact.githubDesc`, `contact.instagramDesc` | kept by `Contact/Aside` (the copy-email button stays) |
| `contact.title`, `contact.intro`, `contact.writeMe`, `contact.location` | replaced by the D-Contact copy; "Working with clients worldwide" moves into the aside line |
| `bag.eyebrow`, `bag.title`, `bag.description` | kept by `/bag` |

## 5. Behaviour and config

| behaviour | fate |
|---|---|
| Prerendered SSG (`ssr: true`, static preset, `nitro.prerender.routes` now `['/bag', '/es/bag']`), `typescript.strict` + `typeCheck`, `app.baseURL: '/'` | kept |
| i18n config (`prefix_except_default`, en-US / es-DO, `baseUrl`) and head (`useLocaleHead`: lang, canonical, hreflang including `x-default`, og:locale) | kept; M6 only verifies |
| Global SEO in `app.vue`: titleTemplate `%s · Víctor Garcés`, default title, `ogSiteName`, `ogType`, `ogImage` / `twitterImage` (Behance portrait), `twitterCard` | `useSeo` composable + `OgDay` / `OgNight` (M6) |
| Per-page SEO: `/blog` from the `pages_*` title/description; posts from front matter with the cover as absolute og:image; `/contact` from `contact.eyebrow` / `contact.intro`; `/bag` from `bag.title` / `bag.description` | `useSeo` per page with the same sources (page copy in `pages_*`); posts keep their cover as og:image unless an OG template is chosen in M6 |
| Sitemap and robots (hand-written files until M0) | generated by @nuxtjs/seo since M0: one `/sitemap.xml` with hreflang alternates, `/bag` noindex and excluded, robots allows all. `lastmod` is missing until M6 wires the content dates |
| Post body markup | since Nuxt UI 4 (M0), Markdown renders through its Prose components (extra classes on p, ul, li, h2, a, blockquote); the scoped `.post-body` rules still win where they set a value. `Blog/Article` (M4) either adopts the prose theme or overrides it in `app.config` |
| JSON-LD `Person` in `pages/index.vue` | schema-org `Person` on `/`, `/dev/about`, `/film/about` (M6) |
| `theme-color` from color mode | per-mode meta swap in `useMode` (M1); M6 verifies it with the favicon set |
| Page transition (`page`, out-in, 250 ms opacity + 8 px) | kept, retimed to 200 ms tokens |
| Global reduced-motion rule (`transition-duration: 0.01ms !important`) | scoped in M1 so the 150 ms mode cross-fade survives |
| Smooth scroll, `::selection` | kept; selection uses `--accent` / `--on-accent` |
| Film grain `body::before` | retired (owner decision); night stills get the 6 % grain from DESIGN.md |
| Blog client-side search | kept |
| Post prose styles | `Blog/Article` (serif headings at night, Shiki theme per mode) |
| Copy-email button | kept in `Contact/Aside` |
| Deploy | `.github/workflows/deploy.yml` (push to `master`); `deploy-static.ps1` is not used |

## 6. Dropped

| item | why |
|---|---|
| `content/about.yml` ("Emma Thompson, Boston"), `content/projects.yml`, `content/speaking.yml` (fake VueConf talks) | Nuxt template leftovers, never real content. Deleted in M0. The new `projects` collection is seeded from the design (Ada System, Sigmedic, Media pipeline). |
| `nuxt.schema.ts` (Studio schema with template defaults) | Template leftover. Deleted in M0. |
| `app.config` `uiPro`, `footer.colorMode` | Unused template config. Deleted in M0. |
| `package.json` scripts `dep` (copied the build into `docs/`) and `tailwind` | Obsolete; `dep` would now overwrite the documentation. Deleted in M0. |
| `@vueuse/motion`, `@nuxtjs/tailwindcss`, `autoprefixer`, `postcss`, standalone `nuxt-og-image` | Unused or superseded. Removed in M0. |
| Ember palette, body film grain, day hero glow, marquee, scroll beam | Replaced by the approved design (owner decision). |
| Following the OS light/dark preference | The mode is now a side of the portfolio, chosen by route or by the visitor, not a system theme. Shared pages default to day. |
| `package.json` scripts `deploy:me`, `deploy:gh-pages`, `deploy:clean` and the `gh-pages` package | They published straight to `gh-pages` from any branch, skipping the Actions workflow (and the M9 mailbox gate). Removed in M0; `serve` now runs through `npx`. |
| Always-empty fields: experience `company.logo`, testimonial `avatar.src` / `avatar.srcset` | Nothing to migrate. |
| `/blog` "Get in touch" button | See §3 Blog. |

## 7. Open items for the owner (non-blocking)
- **Mailbox:** `hello@victorgarces.me` needs MX records before merging to `master`; until then the live site keeps the Gmail address.
- **Positioning:** the design says "Front-end developer and Software Engineering student"; the current site says "Full-stack developer … studying Computer Science", and the experience list includes a back-end role at Sigmedic (2025 to now; the design also lists Sigmedic as a 2026 beta project). The design copy is used unless you say otherwise, applied to every place that states it: hero, about story and teaser, `/dev` SEO, the default title, JSON-LD `jobTitle`, FAQ Q1/Q2 and the post author descriptions.
- **Years** for the four design experience entries and the PLERD start year are unknown, so they are stored as `null` (nothing renders) until you give them.
- **Socials:** answered 2026-09-23. `@vgfilmx` is the film-specific Instagram and is what the night side and the night OG card link to; the personal account is not linked from the site. Still open: whether a YouTube channel should be listed, and the Twitter/X handle `YTvictorworld` in the posts' front matter.
- **Testimonial 2:** confirm the spelling "Elcilia Del Carme Torres G." (possibly "Carmen").
- **Portrait:** the only portrait available is the 240×320 Behance thumbnail (`public/media/portrait.jpg`). The About pages need a larger one (the design uses a 4:5 photo at 380×460), plus an on-set portrait for the Filmmaker side.
- **Film files:** `¿Por qué no?`, its vertical cut and the 2026 reel are listed in the manifest as `pending`; the players need the video files (or the pipeline in M8), and the film pages need stills and a poster.
- **Budget ranges** for the web contact form are empty, so the field stays hidden until you give them. Also missing: photo delivery time (a draft FAQ), the lenses, light and sound in the film kit, the cast of ¿Por qué no?, and the Instagram / YouTube Shorts links for the vertical cut.
- **Cover of the machine learning post** (`public/images/blog/machine-learning-talk-unapec.jpg`, a black-and-white chess board): if it is a stock photo it needs a visible credit, or it gets replaced by one of your own. The Terms only claim the films and photographs as your original work.
- **Color grading app** for the film kit (design slot `[edit + color app]`); only Premiere Pro for editing is stated today.
- **CV PDF** (`public/cv-victor-garces.pdf`) is needed by M9; until then the "Download CV" buttons stay hidden rather than linking to a missing file.
- **Bag:** confirm the gear list is current.

## 8. Baselines
Initial JS (gzip -9, `modulepreload` + entry, prefetch excluded):

| build | `/` | `/blog` | `/contact` |
|---|---|---|---|
| master `8b7623f` (Nuxt 4.0, UI 3) | 195.3 KiB | 176.7 KiB | 169.3 KiB |
| M0 (Nuxt 4.5, UI 4, @nuxtjs/seo, @nuxt/scripts) | 244.3 KiB | 221.8 KiB | 216.0 KiB |
| M3 (`/` landing, `/dev` 221.9 KiB, `/film` 225.5 KiB) | 204.0 KiB | 219.7 KiB | n/a |

The upgrade added 45 to 49 KiB per page before any new page exists. M3 has to bring the homes back to or below the M0 number, and investigate what the entry chunk (75.8 KiB alone) carries.

## 9. Analytics
**None. Owner decision, 2026-09-23 (M6).**

Both candidates cost something the site currently has. Cloudflare Web Analytics is free and
cookieless, but its beacon sends every visitor's IP to Cloudflare on every page load, which would
end the "zero third-party requests" property that M5 established and verified. Self-hosted Umami
keeps the data in your hands but needs a server and a database to run, and its default counting
stores a daily salted hash of IP plus user agent server-side.

Nothing counts a visit today, and `/privacy` and `/cookies` say exactly that, in both languages.

### Adding it later
`@nuxt/scripts` is already installed, so this is a small, self-contained change:

1. Add the provider with `useScript` in a client plugin (a `defer`red beacon; no consent is
   needed for a cookieless one, so there is still no banner).
2. Rewrite the Analytics section of `content/en/legal/privacy.md` and its Spanish twin: name the
   vendor, say what it counts and where the data goes. For Cloudflare, say it is a third party.
   For Umami, say the server keeps a daily hash that cannot be traced back to the visitor.
3. Update the "no analytics at all" sentence in `content/{en,es}/legal/cookies.md`.
4. Bump `updated:` in all four legal files, and update this section.
5. Re-run the M5 network check and move the beacon's origin into the documented exemption list in
   `docs/PLAN.md` M5, which currently reads "zero".
