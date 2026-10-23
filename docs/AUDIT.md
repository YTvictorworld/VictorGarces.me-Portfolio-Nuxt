# Handoff audit (2026-09-21)

Generated from a multi-agent review of every file in handoff/ against the current repo. 98 findings; critical/high ones that depended on external facts were re-checked by a skeptic agent (none refuted; corrections noted under **Verified**).


## M0

### [critical] missing-lint-typecheck-scripts (tooling)
Every milestone gate runs `pnpm lint && pnpm typecheck && pnpm generate`, but package.json has no lint or typecheck script and ESLint is not configured, so the gate fails from M0. M0's instructions also contradict each other.

- **Evidence:** package.json scripts: build, dev, generate, preview, postinstall, tailwind, dep, deploy:me, deploy:gh-pages, deploy:clean, serve, build:serve. @nuxt/eslint ^1.9.0 is a dependency, but it is not in the nuxt.config.ts modules and no eslint.config exists. PLAN.md: 'Each milestone ends with `pnpm lint && pnpm typecheck && pnpm generate` passing'. PROMPT-CLAUDE-CODE.md l.8: 'Do not change any code in M0', while PLAN M0 says 'Add modules: @nuxtjs/seo, @nuxt/scripts, …'.
- **Fix:** Split M0 into M0a (audit plus MIGRATION.md, no code) and M0b (dependencies and tooling). In M0b, register @nuxt/eslint, add eslint.config.mjs, and add the scripts `"lint": "eslint ."` and `"typecheck": "nuxt typecheck"`. CI runs `--frozen-lockfile`, so commit pnpm-lock.yaml with every dependency change.

### [high] nuxt-bump-and-dependency-cleanup (tooling)
@nuxtjs/seo v5 installs its sub-modules through moduleDependencies, which @nuxt/kit 4.0.3 does not support. On the repo's Nuxt 4.0.3 it would install nothing, and the M0 check would still pass. Leftover and duplicate dependencies make this worse.

- **Evidence:** Installed: nuxt 4.0.3, and @nuxt/kit 4.0.3's dist/index.mjs contains 0 matches for 'moduleDependencies' (checked in node_modules). According to the reviewer, @nuxtjs/seo@5.3.16's setup() is empty and all its sub-modules are listed under moduleDependencies (nuxt-og-image >=6.4.4, sitemap, robots, schema-org). package.json pins `nuxt-og-image: ^5.1.9` (not registered as a module), `@nuxtjs/tailwindcss ^6.14.0` (the Tailwind v3 module, next to tailwindcss v4), and `@vueuse/motion ^3.0.3` (removed from code). PLAN M0's module list omits @tresjs/cientos, which handoff/CLAUDE.md and 3D.md (useGLTF) need. @tresjs/nuxt 5.x reportedly depends on @nuxt/ui ^4, and the app is on 3.3.x. PLAN M0's only check is 'pnpm generate still works'.
- **Fix:** In M0b: bump nuxt to ≥4.1 (preferably the latest 4.x) and vue to match. Remove nuxt-og-image, @nuxtjs/tailwindcss and @vueuse/motion. Add @tresjs/cientos. Decide whether to move to @nuxt/ui 4, and remove app.config's `uiPro` block. Extend the M0 check so it confirms the sitemap, robots, og-image and schema-org modules show up in the build log.
- **Verified:** The core claim holds. The repo resolves nuxt 4.0.3 (pnpm-lock.yaml:5259). Nuxt 4.0.3 core installs every module with `installModule` from its exact-pinned `@nuxt/kit: "4.0.3"` (nuxt/dist/index.mjs:5651), and kit 4.0.3 never reads `moduleDependencies` (0 matches; the feature first appears in kit 4.1.0 and 3.19.0). @nuxtjs/seo@5.3.16's dist/module.mjs has an empty `async setup() {}` and lists robots, sitemap, link-checker, og-image (>=6.4.4), schema-org, seo-utils and site-config only under `moduleDependencies`. Its own kit ^4.5.2 has no fallback: `normalizedModule` just runs setup. Its `meta.compatibility.nuxt` is ">=3.16.0" and its peer range is `^3.16.0 || ^4.0.0 || ^5.0.0`, so neither Nuxt nor pnpm warns. On 4.0.3, adding @nuxtjs/seo installs nothing.

Corrections and additions:
(a) PLAN M0 is gated by more than `pnpm generate`. PLAN.md:3 and handoff/CLAUDE.md:46 also require `pnpm lint && pnpm typecheck`, but package.json has no `lint` or `typecheck` script. None of those commands would notice the missing sub-modules at M0, because no code uses them yet. The problem would only show up at M6 (missing `defineOgImage`/`useSchemaOrg` auto-imports, no sitemap.xml or robots.txt), with no hint of the cause.
(b) The leftover dependency does make it worse. Kit 4.1+ loads a dependency by bare name from `nuxt.options.modulesDir`, which here is the project root, so it gets root `node_modules/nuxt-og-image` at 5.1.9. The `>=6.4.4` version check reads package.json starting from @nuxtjs/seo's own path, where its nested 6.x lives. So even after bumping Nuxt, the check would pass while og-image v5 is loaded. `nuxt-og-image ^5.1.9` must be removed or bumped.
(c) `@nuxtjs/tailwindcss` and `@vueuse/motion` are inert leftovers: neither is in `nuxt.config.ts` modules and nothing in the app uses them. Removing them is cleanup, not a fix for a breakage.
(d) `useGLTF` is referenced in COMPONENTS.md:73, not in 3D.md. PLAN.md:8 does omit @tresjs/cientos, which handoff/CLAUDE.md:16 lists.
(e) @tresjs/nuxt@5.7.0 does list `"@nuxt/ui": "^4.8.2"` and `"@nuxt/kit": "4.1.2"` as runtime dependencies. pnpm would nest a second @nuxt/ui major beside the app's 3.3.3. I have not verified that this causes a clash.
(f) `app/app.config.ts` does have a `uiPro.pageHero` block.

No handoff document tells the implementer to upgrade Nuxt. The fix should bump nuxt to at least 4.1, preferably 4.5.x (the latest, which also matches the `@nuxt/kit ^4.5.2` that @nuxtjs/seo and its sub-modules depend on). It should also remove or bump root nuxt-og-image and add a check that the SEO modules actually loaded (for example, `sitemap.xml` and `robots.txt` exist in `.output/public`).

### [high] template-leftovers (content)
The handoff tells the implementer to keep a 'projects' module the site never had, and to use 'the current About section, verbatim'. The only matching files in content/ are unpersonalised template leftovers (a fake bio and fake talks), and they would be migrated as real content.

- **Evidence:** handoff/CLAUDE.md l.19: 'Keep every module the current site has: hero, about, experience, blog, testimonials, FAQ, projects, contact, footer'. No projects page, collection or component exists. content/about.yml: 'Hi, I'm **Emma Thompson**, a UX/UI Designer … based right here in Boston'. content/speaking.yml: 'VueConf US, Miami, FL', 'Syntax.fm (Guest)'. content/projects.yml: template copy. None of them is in content.config.ts. F-Home-Dev l.127: '[Two lines from the current About section, verbatim. Placeholder · content/about.md]'. The real text is content/{en,es}/index.yml about.description. Repo CLAUDE.md: 'a … fake VueConf talk costs more credibility than a missing section'.
- **Fix:** In MIGRATION.md, list about.yml, projects.yml, speaking.yml and nuxt.schema.ts as do-not-migrate, and delete them. Seed the About story and teaser from index.yml about.description (en and es). Correct the module list to: hero, about, experience, testimonials, FAQ, blog, contact, bag, footer.

### [high] claude-md-overwrite (docs)
The README says to replace the root CLAUDE.md with the handoff version. That would drop working rules, including the one that prevents broken links, and the current CLAUDE.md is itself stale.

- **Evidence:** handoff/README.md: 'CLAUDE.md → put at the repo root'. The root CLAUDE.md holds the 'post.path carries the collection prefix (/en/blog/x) … always build links via localePath' warning, the rule that new posts need both locale files, the @vueuse/motion crash warning, and the commit-message rule. It is also stale: it says `ssr: false`, but nuxt.config.ts has `ssr: true`, and it says @vueuse/motion was removed, but package.json devDependencies still list `@vueuse/motion ^3.0.3`.
- **Fix:** Merge the two files instead of overwriting. Keep the i18n and link rules, the no-motion-library history and the commit rule, and correct the ssr and deploy facts.

## M1

### [critical] palette-vs-owner-ember-rule (design)
The handoff palette replaces the brand rule the owner set explicitly: pure black #0a0a0a and an ember-orange primary. Nothing in the handoff retires that rule, so future sessions would revert the tokens.

- **Evidence:** Repo CLAUDE.md: 'Victor explicitly wants the dark background pure black (#0a0a0a), never blue/slate-tinted', 'primary is a custom ember scale', site-wide body::before grain at 2.8%. User memory: 'custom ember orange primary, background stays pure black, never slate'. snippets/tokens.css and F-Sistema: night --bg #121010, --accent #E2A15B (gold); day #F7F7F4 / teal #1F7A63; grain at 6% on stills only (DESIGN.md). app.config.ts ui.colors primary = 'ember'.
- **Fix:** Before M1, get the owner to confirm explicitly that the approved tokens supersede the Ember / #0a0a0a rule. Then remove the palette section from the root CLAUDE.md, update the memory note, and drop the ember scale and the body grain.

### [high] forced-routes-dont-persist-mode (routing)
Forced routes never write the stored mode, and shared pages default to day. A visitor who lands on /film, for example from a shared link, and opens a Journal post or Contact therefore flips to day mode. Night contact links also drop ?topic=film.

- **Evidence:** PAGES.md l.26: forcing 'does not touch the stored preference'. l.18-22: /blog, /blog/[slug], /contact, /privacy, /terms and /cookies use the 'stored mode (default day)'. N-Films, N-Film, N-Photography, N-Journal and N-About link nav Contact to D-Contact.dc.html. N-Journal cards link to D-Post.dc.html, and its lead says 'The post page is shared with day mode and re-themed.' 'Book a shoot' on N-Photography and N-About links to D-Contact. grep 'topic=' finds nothing in any of the 23 artboards. The same thing happens in reverse from /dev when the stored mode is night.
- **Fix:** Write one rule into PAGES.md. Either visiting /dev/** or /film/** writes vg-mode (at least when nothing is stored yet), or links to shared pages carry the mode. Every night Contact and 'Book a shoot' link becomes localePath('/contact') + '?topic=film'. State whether the header toggle on a forced page writes the preference.

### [high] mode-middleware-locale-and-prerender (routing)
The mode-forcing rule is written against unprefixed paths, so /es/dev/** and /es/film/** would never force a mode. It also has to work in prerendered HTML and in the pre-paint script, not only in a client middleware.

- **Evidence:** PAGES.md l.26: 'a route middleware reads `route.path`, sets `data-mode` for `/dev/**` and `/film/**`'. PAGES.md l.3: every route exists at /es/... (nuxt.config strategy 'prefix_except_default'). nuxt.config has `ssr: true` and the static preset, so a middleware that touches `document` does nothing at prerender time, and /film HTML would ship day-coloured until hydration. The inline head script applies the stored preference, so a user whose stored mode is night would see night flash on /dev.
- **Fix:** Compute the forced mode from a locale-stripped path (for example `^/(es/)?(dev|film)(/|$)`) or from getRouteBaseName. Set it with useHead({ htmlAttrs: { 'data-mode' } }) so it lands in the prerendered HTML. Have the head script check the path before it reads storage.
- **Verified:** Mostly holds, with one correction. PAGES.md l.26 writes the forcing rule only against the unprefixed patterns `/dev/**` and `/film/**`, matched on `route.path`. PAGES.md l.3 says every route also exists under `/es/...` with `prefix_except_default`, so `route.path` there is `/es/dev/...` and a literal implementation would never force a mode for Spanish URLs. The docs also never say how the forced mode reaches the prerendered HTML, and the pre-paint head script is written to read only the stored preference (COMPONENTS.md l.77). `:root` defaults to day tokens (tokens.css l.4-5), so /film and /es/film would first paint in day for a first-time visitor, and /dev would first paint in night for a user whose stored mode is night, until the client corrects it. The correction: PAGES.md says "route middleware", not "client middleware". Nuxt route middleware does run during SSR/prerender, but touching `document` there would throw rather than "do nothing". The gap is that no mechanism (useHead htmlAttrs or equivalent) is specified. The fix stands: match a locale-stripped path (useRouteBaseName in @nuxtjs/i18n 10.4.1, or `^/(es/)?(dev|film)(/|$)`), set `htmlAttrs['data-mode']` through useHead on forced routes so it lands in the prerendered HTML, and have the inline head script check the path before it reads the cookie or localStorage.

### [high] nuxt-ui-color-mode-conflict (design)
Nuxt UI's bundled color-mode system (the .dark class, --ui-* variables and dark: variants) would compete with data-mode. Nuxt UI primitives would follow the OS theme instead of the site mode, and the handoff has no mapping between the two.

- **Evidence:** app/app.vue:2 `useColorMode()`; :17 theme-color '#0a0a0a'/'white'; app/components/ColorModeButton.vue; app.config ui.colors.primary 'ember'. 69 `dark:` utilities across 14 files. Reportedly, @nuxt/ui 3.3.x registers @nuxtjs/color-mode with a pre-paint script, and its runtime CSS has `.dark{--ui-bg:…}` and a body `bg-default`. tokens.css sets only `html { background: var(--bg) }`. PLAN M0: 'Keep @nuxt/ui for primitives … style them with the tokens', with no mechanism given.
- **Fix:** Set `ui: { colorMode: false }` (or make useMode drive colorMode.preference). Delete ColorModeButton. Bridge the tokens: `[data-mode]{--ui-primary:var(--accent);--ui-bg:var(--bg);--ui-bg-elevated:var(--raised);--ui-text:var(--text);--ui-text-muted:var(--muted);--ui-border:var(--border)}`. Toggle `.dark` together with night so the dark: variants follow the mode. Move theme-color into useMode.
- **Verified:** The finding holds, with small corrections. @nuxt/ui 3.3.3 turns on @nuxtjs/color-mode 3.5.2 by default. Nothing in nuxt.config.ts overrides it, so preference is 'system' (or whatever the old ColorModeButton saved in localStorage 'nuxt-color-mode'), and the html element gets a .dark/.light class. Nuxt UI's runtime CSS then paints two things in @layer base:
- `body{bg-default text-default scheme-light dark:scheme-dark}`
- `:root,.light{--ui-*}` and `.dark{--ui-*}`. The colors plugin also switches `--ui-primary` between ember-500 and ember-400 on .dark.

Two consequences:
- The body paints --ui-bg (white or dark neutral) over the `html{background:var(--bg)}` from tokens.css, and body's color-scheme overrides the `color-scheme` that tokens.css sets under [data-mode].
- Primitives (UButton, UInput, UAccordion, UTooltip) use bg-default, text-highlighted, ring-accented, text-dimmed and primary. They follow .dark and the ember palette, not data-mode, --accent or the other tokens.

No handoff file mentions colorMode, .dark, --ui-* or ColorModeButton. PLAN M0 only says "Keep @nuxt/ui for primitives (buttons, inputs, accordion) but style them with the tokens". The M1 check greps only for hex values, so leftover `dark:` utilities would pass it.

Corrections:
1. The count is 69 lines (84 occurrences) of `dark:` across 14 files. The app/app.config.ts hit is the `picture.dark` key, not a utility, so real `dark:` utilities are in 13 files.
2. app/components/landing/Hero.vue:24 also uses `$colorMode.value` (plus app/app.vue:2/5/17 and ColorModeButton.vue, used in AppHeader.vue:94). With `colorMode: false` all of these must go, or typecheck fails (`typeCheck: true`).
3. `colorMode: false` is a module option and belongs in nuxt.config.ts (`ui: { colorMode: false }`), not in app.config.ts, whose `ui` key is the theme config.
4. The suggested bridge is incomplete. Primitives also read --ui-text-highlighted, --ui-text-dimmed, --ui-border-accented, --ui-bg-muted/accented and --ui-text-inverted. The bridge must also reset body color-scheme, or set `body{background:var(--bg)}`.
5. PLAN M6 does ask for "theme_color per mode via meta swap". Only the removal of the colorMode-driven theme-color in app.vue is unspecified.

### [medium] mode-storage-contradiction (routing)
The docs describe mode persistence in two different ways (localStorage vs cookie). On a prerendered static host a cookie gives no server-side benefit, and the '/' redirect behaviour for /es is not defined.

- **Evidence:** F-Sistema: 'Choice saved in localStorage; the day/night toggle in the nav is the everyday switch.' DESIGN.md calls F-Sistema the source of truth for Enter states. COMPONENTS l.77: 'cookie `vg-mode` (1 year) + localStorage mirror'. PAGES.md '/': 'if `vg-mode` cookie exists, client redirects to /dev or /film'. Output is prerendered once (static preset), so only the client script can read either store.
- **Fix:** Choose one source of truth. localStorage is simplest; if the cookie is kept, it is client-only. The inline script reads it. State that /es redirects to /es/dev or /es/film, and fix the F-Sistema note or COMPONENTS.md to match.

### [medium] toggle-brand-sibling-targets (routing)
The toggle and brand hrefs in the artboards contradict PAGES.md. The sibling map in PAGES.md does not cover several routes, and the brand links to '/', which then redirects based on the stored mode.

- **Evidence:** PAGES.md l.26: the toggle on a forced page goes to its sibling (/dev ↔ /film, /dev/about ↔ /film/about, /dev/work ↔ /film/films), and on shared pages it only flips the attribute. In the artboards, every D-* toggle links to F-Home-Film.dc.html, including shared D-Blog, D-Post and D-Contact. Every N-* toggle links to F-Home-Dev.dc.html. The toggle on shared S-Legal navigates. No sibling is defined for /dev/work/[slug], /film/films/[slug], /film/photography or /film/journal. The brand links to F-Landing ('/') on F-Home-Dev, M-Home-Dev and F-Home-Film, and PAGES says '/' redirects when vg-mode exists, so a user on /dev with a night cookie who clicks the logo lands on /film.
- **Fix:** Follow PAGES.md and treat the artboard hrefs as prototype shortcuts. Add a sibling table: work slug → /film/films, film slug → /dev/work, photography → /dev, journal → /blog. Point the brand at the current mode's home (localePath('/dev') or localePath('/film')).

### [medium] nav-targets-undefined (routing)
Nav labels are specified but their targets are not. The home pages use in-page anchors while inner pages use routes, 'Experience' has no route, and the More tile points at a /work route that does not exist.

- **Evidence:** F-Home-Dev l.26-30 uses '#work', '#about', '#experience', '#blog', '#contact'. F-Home-Film l.28-32 uses '#work', '#photo', '#journal', '#about', '#contact'. On every D-* page and on S-Legal, 'Experience' links to D-About.dc.html, the same target as About. DESIGN.md gives labels only, and COMPONENTS says 'nav from useNav(mode)'. PAGES.md has no experience route. F-Sistema l.84 and the F-Home-Dev More tile say '/work'; PAGES and COMPONENTS say '/dev/work'. Current links.ts uses { to: '/', hash: '#experience' } plus a scroll-spy. The current /#about and /#experience URLs move under /dev. Repo rule: 'Every nav entry … must resolve'.
- **Fix:** Define useNav targets explicitly. Dev: Work → /dev/work, About → /dev/about, Experience → /dev/about#experience (give the timeline section id='experience'), Blog → /blog, Contact → /contact. Film: Films, Photography, Journal and About go to their routes, and Contact → /contact?topic=film. State whether the scroll-spy stays on the homes. Standardise on /dev/work.

### [medium] motion-components-unmapped (design)
The current motion components are not mapped in the handoff and conflict with its rules. The global reduced-motion CSS cancels the mode cross-fade, and the stated page transition does not match the existing one.

- **Evidence:** COMPONENTS, 3D.md and PLAN never mention Reveal.vue (used on every page), ScrollProgress.vue, ScrollBeam.vue, the AppHeader scroll-spy or useFixedHeader. DESIGN.md says 'Do not use gradients anywhere else', but ScrollProgress uses bg-gradient-to-r, ScrollBeam uses bg-gradient-to-b, and Hero.vue has a radial glow. The main.css reduced-motion block sets `transition-duration: 0.01ms !important`, while DESIGN wants a 150ms mode cross-fade. 3D.md: 'keep the existing Nuxt page transition (fade 200 ms)', but the existing transition is 0.25s opacity plus translateY(8px).
- **Fix:** Add a keep, retire or restyle row for each of these to MIGRATION.md. Exempt the mode overlay from the global reduced-motion rule. State the page transition values.

### [low] accent-template-claim-false (tooling)
The README and the first prompt say '{{accent}}' marks the mode accent in some artboards. No artboard contains it: every accent is a literal hex value, and the accent props are unused editor settings.

- **Evidence:** README.md l.7: '`{{accent}}` in a few files resolves to the mode accent'. PROMPT-CLAUDE-CODE.md l.6: '{{accent}} means the mode accent token'. grep '{{' finds 0 matches across all 23 artboards. F-Home-Dev hard-codes #1F7A63 46 times, F-Home-Film #E2A15B 29 times. The data-props accent options (#2E5BD6, #7A3F9A, #E86A6A, #7FB8A4) are never used. No em-dashes were found.
- **Fix:** Fix both docs. Literal #1F7A63 and #E2A15B mean var(--accent), and #FFFFFF or #121010 on top of them means --on-accent. Ignore the prop options, which are design-tool settings.

### [low] off-token-colors (design)
Some colours and one shadow used for real UI are not in tokens.css, so copying them fails the M1 hex grep, and some have no night equivalent.

- **Evidence:** F-Home-Dev l.182 input: `#3A3B40` border and `#232428` background. #3A302B is used for the player track, the testimonial dots and the '+19' tile. #D9CBB9 is used for tile labels. The mobile pill shadow is `0 10px 30px rgba(0,0,0,0.25)`, while DESIGN.md and tokens use --shadow-banner `0 20px 50px`. #6A2A24, #25314F, #0B0908 and #4A3A2E are stand-in image fills.
- **Fix:** Add --dark-input, --dark-line and --track tokens (or map them to --border and --raised). Use --shadow-banner for the pill. Do not port the sample fills.

### [low] off-scale-values (design)
Many radii, type sizes and component sizes in the artboards fall outside DESIGN.md and tokens.css, and no rule says which source wins.

- **Evidence:** Radii 10, 12, 16, 20 and 24 appear, and the token set is only 14/18/22/28/32/999. Contact blocks are 22-24 while DESIGN says 28. Media inside cards is 18 while DESIGN says 14. Type: D-About h1 48 (DESIGN 56-64); h2 28, 32 and 36 at night (DESIGN 42); N-Film h1 72; night tracking -0.02em vs --display-tracking 0; blockquote italic 400 while only 500 is loaded. Enter button: F-Sistema 44px/14px with no arrow vs F-Landing 64px/18px with an arrow. The mobile toggle is 64x32 while COMPONENTS says 'same toggle' 72x36. Landing padding is 40 vs --gutter 64.
- **Fix:** State once that the artboards win, and add the missing tokens (--r-inner 16, --r-item 18, an h2-sm size, .eyebrow--accent), or snap to the scale. Give ModeToggle a size prop. Use italic 500 or load 400.

### [low] placeholder-outline-default (design)
Placeholder outlines show by default unless something sets data-placeholders='off', and nothing is assigned to set it. D-Blog rows would also lose their only border in production.

- **Evidence:** tokens.css:81 applies the dashed border to every [data-placeholder] and hides it only under html[data-placeholders='off']. DESIGN.md: 'hide behind NUXT_PUBLIC_SHOW_PLACEHOLDERS=false', but no owner of that attribute is defined. D-Blog rows have only `1.5px dashed rgba(31,122,99,0.55)` and no solid border.
- **Fix:** Have app.vue set data-placeholders='off' unless runtimeConfig.public.showPlaceholders is on, or make the outline opt-in. Give blog rows a 1px var(--border).

### [low] placeholder-legend-incomplete (content-schema)
The chip legends in F-Sistema and DESIGN.md are declared 'the contract', but they do not cover every chip source.

- **Evidence:** Neither legend lists content/films, which 5 chips use. F-Sistema also omits content/contact.yml and content/legal. 'media/preview.mp4' is in neither. D-Project's unescaped `<slug>` renders as 'content/projects/.md'.
- **Fix:** Add rows for content/films/*.md, contact.yml, legal/*.md and media/preview.mp4 (= manifest.videos[id].preview).

### [low] night-footer-line (design)
The night-only footer line appears only on the film home desktop, as an inline suffix. The N-* pages and mobile omit it, and COMPONENTS calls it an 'extra line'.

- **Evidence:** DESIGN.md: footer 'plus "All films and photographs are original work" at night'. COMPONENTS Shell/Footer: 'extra line at night'. The string appears only in F-Home-Film l.193, appended in the same span. The N-Films, N-Film, N-Photography, N-Journal, N-About and M-Home-Film footers omit it.
- **Fix:** Render it in Shell/Footer on every page in night mode, inline, wrapping on mobile.

### [low] fonts-config (design)
The @nuxt/fonts behaviour DESIGN.md asks for (optical-size axis, latin plus latin-ext subsets, preload of the display faces only) is not the default and needs explicit configuration.

- **Evidence:** DESIGN.md: 'optical size axis on', 'subset latin + latin-ext', 'preload the two display faces only'. According to the reviewer, the default subsets include cyrillic, greek and vietnamese, opsz needs providerOptions.google.experimental.variableAxis, and Albert Sans is both the body face and the day display face, so preloading it preloads every weight.
- **Fix:** Configure fonts.defaults.subsets and per-family weights, styles and preload explicitly. Check the preload count in the generated HTML.

## M2

### [critical] content-locale-strategy (content-schema)
The snippet's collections cannot hold Spanish content. They are single-locale, and the '*.es.md' / 'experience.es.yml' sibling convention in CONTENT.md cannot work with them. The existing content/{en,es} files would either not load at all, or appear twice in the English lists.

- **Evidence:** snippets/content.config.ts sources: 'blog/*.md' (l.70), 'projects/*.md', 'films/*.md', 'about*.md' (l.135), 'legal/*.md', plus the exact files 'experience.yml', 'filmography.yml', 'testimonials.yml', 'faq.yml', 'contact.yml'. No schema has a locale field. CONTENT.md l.20: 'content files can have an `es` sibling (`*.es.md`, `experience.es.yml`) resolved by locale with fallback'. With these globs, 'blog/*.md' also matches foo.es.md and creates a second entry at /blog/foo.es. 'about*.md' returns 4 entries for 2 modes. 'experience.yml' never loads experience.es.yml. A por-que-no.es.md would count as a second featured film. The repo today uses per-locale collections: blog_en 'en/blog/*.md', blog_es 'es/blog/*.md', index_en/index_es, pages_en/pages_es. 'blog/*.md' matches none of the real posts in content/en/blog and content/es/blog.
- **Fix:** Before M2, pick one strategy and fix both CONTENT.md and the snippet. The recommended option is the pattern the repo already uses: one schema factory that emits <name>_en and <name>_es with source '<locale>/…'. Add a queryLocalized() helper that falls back to _en. Keep the post slugs so /blog/<slug> and /es/blog/<slug> still resolve, and keep building links with localePath().

### [critical] snippet-drops-live-collections (tooling)
Dropping in snippets/content.config.ts at M2 removes collections that pages outside M2's scope still query. With typeCheck on, `pnpm generate` fails. The kept /bag page also loses its data.

- **Evidence:** nuxt.config.ts has `typescript: { strict: true, typeCheck: true }`. The snippet has no bag, index_en/index_es, pages_en/pages_es or blog_en/blog_es collections. Code still using them: app/pages/bag.vue queryCollection('bag'); app/pages/index.vue 'index_en'; landing/Hero.vue, FAQ.vue and Testimonials.vue import type IndexEnCollectionItem; blog/index.vue 'pages_en'/'blog_en'. PAGES.md keeps '/bag | existing'. PLAN.md: every milestone ends with `pnpm generate` passing, and the pages are only rewritten in M3/M4.
- **Fix:** Carry `bag` over unchanged, and add a home for the blog.yml page-header copy. Keep the old collections next to the new ones until the milestone that removes their last consumer, or do the M2 content switch together with the M3/M4 page rewrites.

### [high] schema-not-validated (content-schema)
@nuxt/content 3.6.3 never runs the zod schema against content files. 'alt is required by schema' and the M2 check 'schema rejects an image without alt' are therefore both false, and a missing alt passes silently.

- **Evidence:** In node_modules/@nuxt/content 3.6.3 dist/module.mjs, the only .parse( calls are JSON.parse and parser.parse; there is no safeParse or schema.parse. According to the reviewer, the schema is only turned into SQL columns: keys in the schema go to columns and everything else goes to meta. The repo already demonstrates this: bag.yml `icon` and testimonials `avatar.srcset` are not in the schema and load without errors. Claims that depend on validation: CONTENT.md l.3 'the schema rejects entries without it', PLAN M2 check, handoff/CLAUDE.md l.25 'alt is required by schema'.
- **Fix:** Add real validation. Export the zod schemas from a shared module and parse each file in a `content:file:afterParse` hook, throwing on failure, or run a scripts/validate-content.ts from lint or prebuild. Make that the M2 acceptance test.
- **Verified:** The finding holds. @nuxt/content 3.6.3, the version pinned in pnpm-lock.yaml, never runs the zod schema against content files. defineCollection turns the zod object into JSON Schema and throws the zod object away. That JSON Schema only drives the SQL columns and the generated TS types. So `alt: z.string().min(3, ...)` in handoff/snippets/content.config.ts does nothing at build time, and three documents are wrong: CONTENT.md l.3 ("the schema rejects entries without it"), PLAN.md l.20 (the M2 check "schema rejects an image without alt") and handoff/CLAUDE.md l.25 ("alt is required by schema"). Two corrections. (1) The evidence given is weak. zod's z.object strips unknown keys by default and does not reject them, so bag.yml `icon` and `srcset` loading fine would happen even with validation. The strong proof is in content/en/index.yml l.66-85: all three testimonial `author.avatar` objects have `src: ''` and `srcset: ''` and no `alt`. The repo's createImageSchema() requires `alt: z.string()`, not optional, and the site still generates and deploys. (2) The suggested fix of throwing in `content:file:afterParse` does not fail the build. In module.mjs l.2867-2891 the whole parse call, including that hook, is wrapped in try/catch, which logs `"<key>" is ignored because parsing is failed` and drops the file. The build succeeds without that content, which breaks CONTENT.md's "Do not lose a single entry". Real validation needs its own script that exits non-zero, e.g. scripts/validate-content.ts that imports the shared zod schemas and parses every YAML file and front-matter block. Chain it explicitly into the `generate` script (`"generate": "<validate> && nuxt generate"`), because .github/workflows/deploy.yml l.47 runs `pnpm generate`. That script failing on an image without alt becomes the M2 acceptance test. Upgrading does not help: the latest @nuxt/content (3.16.1) also has no validation step.

### [high] manifest-alt-unenforced (media)
The rules for where alt text comes from contradict each other. Manifest-only photos (the Photography masonry and the home filmstrip) have no schema at all, and the sample manifest has an empty alt.

- **Evidence:** MEDIA.md: manifest alt is a default that content can override, and 'the schema requires one of the two to be non-empty'. The manifest example has "alt": "". The same sample lists series photos events-2025-01/02 while the only photo key is events-2025-09. Snippet `mediaRef.alt: z.string().min(3)` is always required, including for video refs. CONTENT.md: media is 'not a collection, plain JSON read by useMediaManifest()'. N-Photography tiles are '[still 0N · alt from manifest]', and the F-Home-Film filmstrip reads series 'events-2025' straight from the manifest.
- **Fix:** Validate the manifest with zod in scripts/media-pull.ts and useMediaManifest(), and fail on an empty alt. Make mediaRef.alt optional, with the rule 'manifest or content, one of the two non-empty' enforced in code. Add alt_es, or a per-locale override. Fix the sample manifest.

### [high] blog-schema-drops-fields (content-schema)
The new blog schema drops front-matter fields that both real posts use and the design still displays (reading time, image, author). The migrated posts would also have no film tags and no alt text, so the Journal would be empty.

- **Evidence:** content/en/blog/ai-and-my-two-crafts.md front matter: `date: 2026-07-04` (unquoted), `image:` (Behance URL, no alt), `minRead: 8`, and `author: {name, description, username, twitter, avatar}`. machine-learning-talk-unapec.md has `minRead: 6` and `image: /images/blog/…jpg`. Neither post has `tags`. Snippet blog schema: title, description, `date: z.string().date()`, tags, `cover: image.optional()` (alt min 3), draft. The design shows reading time: F-Home-Dev 'Read · [N] min', D-Blog '[N] min', D-Post '[DATE] · [N] min read', and F-Sistema 'reading time computed'. The current repo schema uses z.date(). CONTENT.md: 'extend the schema, do not drop the data'. The film Journal needs 2 or more posts tagged 'film'.
- **Fix:** Add `minRead: z.number().optional()`, computed when missing. Map image to cover {src, alt}, with alt text written or approved by the owner. Keep `author` as an optional object, or document that it is retired. Use z.coerce.date() or quoted dates (legal.updated has the same problem). Ask the owner which existing posts get the 'film' tag.
- **Verified:** The snippet's blog schema (handoff/snippets/content.config.ts: title, description, `date: z.string().date()`, `tags` defaulting to [], `cover: image.optional()`, draft) does not declare `image`, `minRead` or `author`. All four real post files (content/{en,es}/blog/ai-and-my-two-crafts.md and machine-learning-talk-unapec.md) use those fields.

**What happens to the undeclared fields.** @nuxt/content 3.6.3 does not delete them. Its parser moves them into `meta` (node_modules/@nuxt/content/dist/module.mjs, around lines 1420-1429). But components built from the artboards read `cover` and `tags`. So the real posts' header images disappear unless `image` is mapped to `cover: {src, alt}`, and that needs new alt text: the posts have none (only the author avatar has alt).

**Reading time.** The design shows it: D-Blog "[N] min", D-Post "[DATE] · [N] min read", F-Home-Dev "Read · [N] min". But F-Sistema says "reading time computed", so leaving `minRead` out of the schema is intended. The real gap is that no handoff doc says how to compute it (no hook or module is named), and a computed value may not match the owner's hand-set 8 and 6.

**Author.** No artboard shows it. D-Post has no byline or avatar. So the only issue is CONTENT.md's rule "extend the schema, do not drop the data": keep `author` as an optional field, or retire it explicitly in the M0 docs/MIGRATION.md.

**Film tags.** Neither post has `tags`, and nothing says which posts get `film`. If the real posts replace the placeholder posts, these would all be empty: /film/journal (N-Journal), the F-Home-Film journal card ("content/blog, tag film") and the M-Home-Film journal list.

**Date (this part of the finding is wrong).** remark-mdc 3.6.0 parses front matter with yaml 2.8.1 (YAML 1.2 core schema). So an unquoted `date: 2026-07-04` becomes the string "2026-07-04", which satisfies `z.string().date()`. No `z.coerce.date()` or quoting is needed, and `legal.updated` has no such problem.

**Validation.** 3.6.3 does not run Zod validation on content at all (there is no safeParse call). So a missing alt will not fail the build, despite CONTENT.md saying "the schema rejects entries without it".

### [high] experience-and-positioning-conflict (content)
The design's four experience entries share nothing with the three real ones, and CONTENT.md asks for both 'the four entries from the design' and 'do not lose a single entry'. The final-copy positioning also contradicts the current real data.

- **Evidence:** F-Home-Dev and D-About show: Freelance developer; Director of Communications & Marketing · La Voz Juvenil RD; Software Engineering · UNAPEC; Technical degree … Instituto Politécnico Francisco José Peynado, all with '[YEAR]'. content/en/index.yml experience.items: Back-End Developer at Sigmedic '2025 - Present'; Volunteer at PLERD 'Current'; Front-End Developer at As de Picas '2024 - 2025'. Each has a company url, logo and color. The new schema has no url, requires `summary` (no current data has one) and `from` (PLERD has only 'Current'). Positioning in the design: hero 'Front-end developer and Software Engineering student', about 'freelance developer by day', and Sigmedic shown as a project '2026 · beta'. The repo says 'full-stack developer … currently studying Computer Science' and lists Sigmedic as a job.
- **Fix:** The owner must decide the merged list (probably 7 entries) and the positioning (front-end vs full-stack, Software Engineering vs Computer Science, whether Sigmedic is a job or a project) before seeding. Add an optional `url`, make `summary` optional, and allow `from` to be null. Define how many entries the home shows; the full list goes on /dev/about.

### [high] faq-flattened (content-schema)
The FAQ schema and design hold 4 flat entries per mode, but the real FAQ has 11 categorised entries per locale with markdown answers. The 'night questions from the design' that CONTENT.md refers to do not exist.

- **Evidence:** content/en/index.yml faq.categories: 'Services & Process' (4), 'Pricing & Timelines' (5), 'About Me' (2), plus faq.title and faq.description, all mirrored in ES. The answers contain **bold** (FAQ.vue uses an escaping renderAnswer()). Snippet: `entries: [{ q, a, mode }]`, with no category, order or featured field. COMPONENTS: 'Faq/List | 4 Faq/Item'. CONTENT.md l.29: 'four per mode, questions from the design at night; day questions are placeholders'. F-Home-Film l.171-174 has only '[FAQ question 01]'…'[FAQ question 04]'. No page in PAGES.md holds the full list.
- **Fix:** Add optional `category`, `order` and `featured` (shown on the home). Render `a` as markdown (MDC), or keep the escape-then-bold renderer. Decide where all 11 entries live (for example /contact or /dev/about). Fix CONTENT.md: the day questions are real and the night ones are placeholders. Seed the night ones as drafts.

### [high] placeholder-seeds-go-public (content)
The bracketed seed entries become real prerendered pages, sitemap URLs and RSS items with fake titles. Only the chip styling is hidden in production, and projects and films have no draft flag. Some seed filenames also contain brackets.

- **Evidence:** CONTENT.md seeds: 'blog: five posts with [Existing post title 0N]' (only 2 real posts exist); projects '[client-site]', '[experiment]', '[older-build]'; films '[client-video].md'. PAGES.md: 'explicit routes for every collection entry in both locales'. Only the blog schema has `draft`. NUXT_PUBLIC_SHOW_PLACEHOLDERS only toggles [data-placeholder] styling. Bracketed filenames produce paths like /dev/work/[client-site], and brackets are route-param syntax in Nuxt.
- **Fix:** Add `draft: z.boolean().default(false)` to projects and films. Mark every placeholder seed draft: true, and filter drafts out of queries, prerender routes, the sitemap and RSS in production. Use plain slugs such as client-site.md, with bracketed titles.
- **Verified:** The core finding holds. Nothing in the handoff keeps bracketed seed entries out of the production build. CONTENT.md seeds 3 non-featured projects ([client-site], [experiment], [older-build]), one film ([client-video].md) and five blog posts titled "[Existing post title 0N]". The current repo has only 2 real posts per locale, so 3 fake posts remain after migration. PAGES.md prerenders "explicit routes for every collection entry in both locales", builds the sitemap from content and builds RSS from the blog collection, and none of them filters anything. With seed data present, Shell/Placeholder renders its slot, so the bracketed text shows in production. NUXT_PUBLIC_SHOW_PLACEHOLDERS only hides the dashed outline and the chip. projects and films have no draft field. blog has one, but no doc says to mark seed posts as drafts or to filter drafts out of queries, prerender, the sitemap or RSS. The M9 Release milestone also has no step that makes anyone replace or remove placeholders before deploy. The filename part of the finding is wrong. The only seed given explicitly as a filename is [client-video].md; the project seeds are listed without an extension. Files under content/ are not Nuxt page routes, so the brackets are not route-param syntax there. @nuxt/content 3.6.3 also slugifies the path: [client-video] becomes client-video, so the URL would be /film/films/client-video, not /film/films/[client-video]. Only the stem keeps the brackets, which matters only if an implementer builds slugs from stem. Plain slugs are still cleaner, but the real problem is that fake entries get published, not that a route breaks.

### [medium] testimonials-migration (content-schema)
The existing testimonials do not fit the new schema or the layout as they are. The design assumes two-line quotes in fixed-height blocks, while the real ones run 4-5 lines, and no mode is assigned to them.

- **Evidence:** Current entries: author {name, description, avatar {src: '', srcset: ''}}. New schema: {name, role, avatar: image (alt min 3), mode}. F-Home-Film l.147: '[Testimonial …, verbatim, two lines at most.]' at 32px in a 300px section. content/en/index.yml has quotes of about 292, 287 and 254 characters. M-Home-Film hard-codes '1 of 3'. The night design wants '[Name] · [Event or project]', which has no field. CONTENT.md seeds 'mode both'.
- **Fix:** Drop empty avatars and render initials instead. Map description to role. Add an optional project/event field. The owner assigns a mode to each quote. Use auto height and a fluid quote size (clamp 22-32px), and compute the counter.

### [medium] socials-handles-contact-facts (content-schema)
The social handles are hard-coded and conflict with the live accounts, placeholder URLs cannot pass socials.href, non-social links are mixed into the socials list, and the response-time claims disagree.

- **Evidence:** '@VGFILMX' is hard-coded in S-OG-Film, F-Home-Film l.49 (no outline), N-About and D-Contact. app/app.config.ts:43 has https://www.instagram.com/the personal account/, and LinkedIn is /in/vgfilm07/. D-Contact 'LinkedIn [handle]' '#linkedin' and 'YouTube [channel]' '#youtube', but the schema has href: z.string().url() and there is no current YouTube account. The contact block's socials row includes 'About me' (#about-page). Response time: contact.intro 'within 24 hours', FAQ 'up to three business days', D-Contact 'replies within [N] days'. app.config `available` and `meetingLink` have no field.
- **Fix:** Confirm the real handles with the owner, render them from contact.socials (filtered by mode on the homes; /contact shows all), and omit YouTube until a URL exists. Render 'About me' as an i18n link. Add `available` and settle on one response time.

### [medium] behance-hotlinks (media)
The current hero photos, the portrait and one blog cover are Behance hotlinks with no place in the new schema or the manifest, and the privacy text would be false while they remain.

- **Evidence:** content/{en,es}/index.yml hero.images: 7 mir-s3-cdn-cf.behance.net URLs with EN and ES alts. app.config global.picture is a Behance URL. The ai-and-my-two-crafts image is a Behance fs_webp URL. app/app.vue preconnects to mir-s3-cdn-cf.behance.net. MEDIA.md builds '${base}/${path}-${size}.${format}' with one alt, and `pnpm media:pull` overwrites manifest.json. S-Legal privacy: 'Images and video are served from media.victorgarces.net on AWS CloudFront'.
- **Fix:** List these 9 images in MIGRATION.md as pipeline ingest inputs. Until they are ingested, allow a plain src image type. Carry over the per-locale alts, and revise the privacy text while third-party hosts remain.

### [low] seed-set-mismatch (content-schema)
The seed list does not cover what the artboards show, and film services are stored twice in different shapes.

- **Evidence:** N-Films shows 4 films including '[Older short]', but the CONTENT.md films seed has 3. The S-Legal lead lists 4 terms sections, CONTENT.md lists 5. N-About services [{title, summary}] come from about.services, while filmography.services is z.array(z.string()) for the home pills.
- **Fix:** Add older-short.md (draft). Settle the terms sections at 5. Derive the home service pills from the about-film services titles.

### [low] owner-confirm-entries (content)
Some existing entries need owner confirmation before they are republished on new surfaces.

- **Evidence:** Testimonial 2's author is 'Elcilia Del Carme Torres G.', possibly a typo for Carmen. content/bag.yml lists desk gear (Keychron K2, MacBook Pro 16", FlexiSpot) with Spanish descriptions in the English file, while N-About says /bag holds the full film kit inventory.
- **Fix:** List these as 'confirm with owner' in MIGRATION.md. Keep the data, but do not add it to new surfaces until the owner confirms.

## M3

### [high] contact-email-unconfirmed (content)
The artboards treat hello@victorgarces.net as final, but the site uses the previous personal address everywhere. Nothing shows that the new mailbox exists, and the main recruiter CTA depends on it.

- **Evidence:** handoff/CLAUDE.md l.24: '…the email) is final'. hello@victorgarces.net appears in F-Home-Dev, M-Home-Dev, F-Home-Film, M-Home-Film, D-Contact, D-Project and S-Legal. the previous personal address appears in app/app.config.ts, the content/{en,es}/index.yml hero mailto, content/{en,es}/blog.yml, and the closing mailto in all 4 post bodies. The site is on GitHub Pages, and no mail setup for the domain is mentioned.
- **Fix:** Confirm with the owner before M3. Store the address only in contact.email and read it from there. Decide whether to rewrite the mailto links in the published post bodies.
- **Verified:** The finding holds, and a DNS check makes it stronger. handoff/CLAUDE.md l.24 calls "the email" in the artboards final. The artboards use hello@victorgarces.net in 7 files: F-Home-Dev, F-Home-Film, M-Home-Dev, M-Home-Film, D-Contact, D-Project and S-Legal. S-Legal also says the Web3Forms form delivers to that address and that data-deletion requests go there. The live site uses the previous personal address in these places: app/app.config.ts global.email (read by app/pages/index.vue and app/pages/contact.vue), content/{en,es}/index.yml hero mailto, content/{en,es}/blog.yml, and the closing mailto of all 4 post files (2 posts x 2 locales: ai-and-my-two-crafts.md, machine-learning-talk-unapec.md). No handoff doc mentions setting up mail for the domain. Right now victorgarces.net has no MX record: public DNS returns only the SOA, so as things stand, mail to hello@ would not reach a mailbox. The schema in snippets/content.config.ts already has contact.email as z.string().email(). But docs/CONTENT.md l.16/31 never says which address to seed. So confirm the address with the owner before Contact/Block and Contact/BookShoot are wired in M3 and the Web3Forms form in M4. Keep the address in content/contact.yml only, and decide whether to rewrite the mailto links in the 4 published post bodies.

### [high] home-forms-no-sender (contact)
Neither home mini-form collects a sender email or name, so a Web3Forms submission from it cannot be answered. Their validation, success and error states are not designed.

- **Evidence:** F-Home-Dev l.181-182: label 'Quick message · Web3Forms + Turnstile', one input 'What are you building?' and 'Send'. There is no email field, no captcha slot and no status area. F-Home-Film l.185-188 'Book a shoot': only Date, Place, 'What happens' and 'Send the request'. COMPONENTS 'Contact/BookShoot | email + 3 fields' is ambiguous: 'email' could mean the displayed mailto or an input. M-Home-Dev and M-Home-Film replace the forms with a link to D-Contact.
- **Fix:** Add a required Email field (and Name) to both, or make both desktop blocks links to /contact (?topic=film on the night side), as mobile already does. Specify where the captcha and the inline success/error messages go.

### [high] annotations-read-as-final-copy (design)
Many designer notes are styled as UI copy with no outline. The rules say unoutlined, unbracketed copy is final, so these notes would ship as visitor-facing text, and some name routes that do not exist.

- **Evidence:** handoff/CLAUDE.md l.24 says real copy 'is final and can be used as is', and F-Sistema: 'Anything without an outline is fixed copy or layout and is final as drawn.' Notes that would ship:
- F-Landing: 'Hover this card and the Enter button turns teal/gold'; the pill 'one button · opens the side you last hovered · …'.
- S-OG-*: 'nuxt-og-image · 1200×630 · template per mode…' inside the canvas.
- F-Home-Dev: More tile 'Whole tile is a link to /work. Hover: the stack fans out…'; 'CV: placeholder · public/cv-victor-garces.pdf'; 'scroll 0 %: page assembled…'; ' · Web3Forms + Turnstile'.
- F-Home-Film: l.57 '3D: the sun of the day mode becomes the moon…'; l.182 'Web3Forms + Turnstile'.
- D-Work lead: 'Filters come from the tags in content/projects…'.
- D-Blog lead: 'Every post in content/blog, newest first…'.
- D-Project: 'Title and one-liner come from the front matter.'
- D-Contact: Turnstile and Web3Forms notes.
- N-Journal lead: 'The same blog, filtered by the film tag…'.
- N-Photography lead: 'Each series is a folder in the media pipeline…'.
- N-About: 'full inventory stays on /bag, off-nav, noindex'.
- S-Legal lead: 'The Terms page uses this same template…'.
- S-404: 'DAY · 404' labels and footnote.
- **Fix:** Add an annotation list to COMPONENTS.md (or restyle these notes as chips in the artboards). Get real visitor-facing leads from the owner for /dev/work, /blog, /film/journal and /film/photography. By default ship only 'Last updated [DATE].' from the S-Legal lead.

### [high] landing-dual-mode-scoping (design)
The '/' landing needs day and night tokens at the same time, but no doc gives '/' a mode or says how to scope the night half. A returning night user would get a dark landing, and the M1 hex grep forbids the literals the night card would otherwise need.

- **Evidence:** F-Landing: page bg #F7F7F4 with a day header. The night card uses #121010, #E2A15B, #A69C91, #1C1817 and Newsreader. The Enter button switches between #1F7A63/#FFFFFF and #E2A15B/#121010. handoff/CLAUDE.md l.22 lists the forced routes and the shared pages, and '/' is in neither list. PAGES.md gives '/' only 'first visit'. The placeholder chip uses var(--accent), so the chip in the night card would render teal.
- **Fix:** Specify that '/' always renders data-mode='day' on <html>. The night card and the Enter button in its night state carry a nested data-mode='night'; this works because the tokens.css selectors are plain attribute selectors. Add '/' to the mode rule in CLAUDE.md and PAGES.md.

### [high] enter-button-selection (design)
The Enter button's selection model is contradictory. If hover resets on leave, the button can never be clicked as 'Enter as Filmmaker', and the cards are links that navigate directly.

- **Evidence:** F-Landing pill: 'opens the side you last hovered · Developer by default'. COMPONENTS Landing/EnterButton: 'state hover: 'day' | 'night' | null … Mobile: tap a card selects, tap Enter goes'. Both cards are <a href=F-Home-Dev/F-Home-Film.dc.html>. The button is absolutely centered over the 24px gap, so the pointer leaves a card to reach it. The artboard script has no state logic. 3D.md's useModeTransition starts from the 'toggle knob center', but the landing has no toggle.
- **Fix:** Make the selection sticky: the last hovered, focused or tapped card sets day or night, and leaving the card does not clear it. Decide whether a desktop card click navigates or only selects. Specify keyboard selection, aria-pressed or aria-live wording, and useModeTransition(origin) taking the Enter button's rect.

### [high] spanish-copy-missing (i18n)
The handoff has no Spanish for any new final string: headings, CTAs, leads, OG eyebrows, legal text or aria labels. The rules forbid inventing content but require Spanish in es.json, so the owner has to decide.

- **Evidence:** The only Spanish in any artboard is S-Cookies ('Este sitio funciona sin cookies de rastreo.', 'Solo necesarias', 'Permitir embeds'). The rest is English only: F-Landing ('I build software.', 'Enter as Developer', and aria-label 'Switch language to Spanish', which only works in one direction), both homes, all D-* and N-* pages, S-404, S-Legal and S-OG-*. handoff/CLAUDE.md l.27 'Spanish in i18n/locales/es.json' and l.48 'Never invent content'. Privacy text is 'real, keep them' (CONTENT.md l.32), so a machine translation carries legal risk. Eyebrows are typed in upper case even though .eyebrow already applies text-transform: uppercase.
- **Fix:** Get the Spanish copy from the owner, at least for the legal pages, or explicitly allow draft translations flagged for review in MIGRATION.md. Store eyebrows in sentence case. Make the LangSwitch aria-label depend on the current locale.

### [high] mobile-home-modules-dropped (design)
The mobile homes drop modules that the 'Nothing is removed' rule requires, and they use item counts and components that contradict COMPONENTS.md.

- **Evidence:** M-Home-Film h2s are only Now showing, Stills, More work, Credits and Journal. It has no About teaser, no FAQ, no second featured card, no services pills and no testimonial controls, and the footer has no night line. M-Home-Dev keeps About and FAQ, but shows 2 projects plus '[N] more', 3 of 4 experience rows, 2 of 3 posts, 1 testimonial with 'swipe for more' (COMPONENTS says the carousel is used only 'when count > 3'), and FAQ rows as plain <div> elements with no answers. handoff/CLAUDE.md l.19: 'Keep every module … Nothing is removed'. PLAN M3: 'Mobile layouts per M-Home-Dev and M-Home-Film'.
- **Fix:** Decide explicitly. The recommended option is to stack every desktop module in one column below 768px, reusing Faq/Item and a scroll-snap testimonial swipe. Otherwise document which modules are hidden on mobile and why, and define the slicing counts per breakpoint.

### [medium] landing-layout-no-shell (design)
The landing has no nav, no mode toggle and no footer, which means no legal links. Yet COMPONENTS.md puts the Shell header and footer on every page, and layouts/default.vue always includes them.

- **Evidence:** F-Landing header: the brand <span> 'Víctor Garcés' and an 'EN / ES' link only, and no footer. COMPONENTS: 'Shell/Header | all F, D, N', 'Shell/Footer | all'. handoff/CLAUDE.md: 'layouts/default.vue  header with toggle, footer, cookie banner slot'.
- **Fix:** Document a separate layout for '/' (layouts/landing.vue, or definePageMeta({ layout: false })) with a header that has only the brand and LangSwitch. Decide whether the Privacy, Terms and Cookies links appear on '/'.

### [medium] mobile-layouts-missing (design)
Only the two homes have mobile artboards. The landing and all inner pages use fixed desktop grids and have no collapse rules.

- **Evidence:** F-Landing is 1440x900 only, with the Enter button 'position:absolute; left:50%; top:50%' over two flex columns. Inner-page grids: D-Blog row `140px minmax(0,1fr) 200px 100px`; D-Project `220px minmax(0,1fr)` plus a 5-column MetaBar; D-Post `minmax(0,1fr) 280px` with a sticky TOC; D-Contact `minmax(0,1fr) 380px`; D-About 380/360px columns; D-Work 3 columns plus 5 pills. The N-* pages are similar. PLAN M3 gives breakpoints but points only to M-Home-*, and M4 has no mobile guidance.
- **Fix:** Write collapse rules using the PLAN breakpoints. Landing: stacked cards, a sticky bottom Enter button, a minimum height for short viewports. Inner pages: one column, TOC collapsed above the article, MetaBar in 2 columns, filters in a horizontally scrolling row, blog rows stacking their meta under the title.

### [medium] mobile-copy-variants (content-schema)
The mobile artboards use shorter versions of final strings that have no field or i18n key, and the hero element order differs from desktop.

- **Evidence:** M-Home-Dev: 'Local-first, multi-agent assistant.' (desktop has the full oneLiner); 'Communications & Marketing · La Voz Juvenil RD'; eyebrow 'DEVELOPER · DAY' (city dropped); 'CV' vs 'Download CV'; h2 'Selected work', 'About'; 'All' vs 'All projects'. The image sits between the h1 and the lead. M-Home-Film: a shorter lead, 'FILMMAKER · NIGHT' without the handle, 'Now showing' vs 'NOW SHOWING'/'One film at a time', and '2025+' vs '2025 to now'. The projects schema has only oneLiner, and about has headline and teaser.
- **Fix:** Declare that mobile reuses the desktop strings (with CSS line-clamp where needed), or add optional short fields (oneLinerShort, headlineShort) and mobile i18n keys. Document the hero reorder (grid areas).

### [medium] hero-copy-no-source (content-schema)
The new hero and section-heading copy has no content source or i18n keys, and the current hero content (the marquee images, the SEO copy, the availability badge) has no destination.

- **Evidence:** Final strings with no collection or key: 'DEVELOPER · DAY · SANTO DOMINGO, DO', 'Thin, end to end. Then hardened.', 'See the work', 'Download CV', 'Projects I keep coming back to', 'Where I've worked and studied', 'Notes from building things', and the film equivalents. The snippet has no home or hero collection. Repo rule: 'no hardcoded strings in components'. Existing content/{en,es}/index.yml has seo.title/description, title, roles, description, hero.links and 7 hero.images. i18n has hero.available ('Available for new projects').
- **Fix:** Specify i18n keys (en and es) for the hero and section headings, or add a `home` data collection. Map the old SEO strings to useSeo. Decide whether the availability badge survives.

### [medium] project-card-meta-links (content-schema)
The project card and case-study meta do not map cleanly onto the projects schema: role vs kind, when status shows, diagram vs cover, and which link kinds appear. The two artboards also give conflicting seed values.

- **Evidence:** The right meta on F-Home-Dev and D-Work shows 'creator' and 'full-stack' (role-like) next to 'infra', 'client', 'experiment' and 'archive' (kind values). The left meta shows '2026 · beta' vs plain '2026'. D-Work shows Ada as '2026' (live), while D-Project STATUS says 'In progress'. The chip 'placeholder · diagram.svg' has no field. 'Repo' appears on every card, and D-Project LINKS 'Repo · Demo' are plain spans. `link` = {label, href} with no type, so Repo, Demo and Live can only be told apart by label, which breaks in Spanish. Desktop cards are not whole-card links, but mobile cards are.
- **Fix:** Right meta = kind, or add a short role field. Append status unless it is 'live'. The diagram uses cover.src (SVG allowed). Add `type: z.enum(['repo','demo','live','other'])` to link. Render only the links that exist, as anchors. Seed ada-system as 'in-progress'. Make the whole card a link on both breakpoints.

### [medium] 3d-fallback-png (3d)
The docs disagree on whether the fallback PNG shows the assembled or the exploded page, give one filename for two renders, and put it on a background that does not match the stage.

- **Evidence:** M-Home-Dev: '[static render of the exploded page · no 3D on phones]'; the desktop SVG also shows the exploded state. 3D.md l.27: 'public/models/page-exploded.png (assembled render on --bg)'. PROMPT-3D.md asks for 'a PNG render of the assembled and exploded states on a plain #F7F7F4 background'. The stage in both boards is #FFFFFF (--surface), so the render would show as a visible box.
- **Fix:** Name both files (page-assembled.png and page-exploded.png) and say which one serves as the mobile, reduced-motion and LCP image. Render with a transparent background or on #FFFFFF.

### [medium] cv-missing-until-m9 (routing)
'Download CV' links to a file that is only planned for M9, so the M3 and M6 link checks fail and the site gets a dead link.

- **Evidence:** The F-Home-Dev and D-About CV button uses about.cv, which defaults to '/cv-victor-garces.pdf'. public/ holds only favicon.ico, images/, robots.txt and sitemap.xml. PLAN M9: 'CV PDF in public/'. M3 checks 'every nav link resolves', and M6 runs the link checker.
- **Fix:** Add the real CV in M3, or hide the button when the file is missing. State that the CV note is a dev-only placeholder.

### [medium] mobile-menu-undesigned (design)
The mobile hamburger menu has no open state in any artboard and no component spec, and the mobile mode toggle only exists on the homes.

- **Evidence:** M-Home-Dev and M-Home-Film have a <button aria-label='Open menu'> with no drawer artboard. COMPONENTS Shell/Header lists brand, ModeToggle, nav and LangSwitch, with no mobile menu. Shell/MobileModePill is mapped only to 'M-Home-*'. The mobile language control shows only 'EN'.
- **Fix:** Add a Shell/MobileMenu spec: a full-screen sheet with nav, LangSwitch and ModeToggle, a focus trap and Esc to close. State whether MobileModePill appears on every mobile page.

### [medium] journal-tags-and-labels (content-schema)
The Journal cards and pills show sub-category labels that have no field, the pills are drawn as fixed copy, there is no fallback for posts without a cover, and the seed does not give enough film posts.

- **Evidence:** F-Home-Film l.157-158: '[DATE] · on set', '[DATE] · writing'. N-Journal pills 'All', 'on set', 'gear', 'writing' (no chip), and card 4 shows 'color', which has no pill. The blog schema has only tags and an optional cover. N-Journal claims 'shown with covers'. CONTENT.md seed: 'one tagged `film` twice' (ambiguous), while N-Journal shows 4 film posts.
- **Fix:** Define the label as the first tag other than 'film', or add `category`. Derive the pills from the tags of film-tagged posts. Design a fallback card for posts without a cover. Seed at least 4 posts tagged film, as drafts.

### [medium] filmstrip-series-config (media)
The home filmstrip's series, count and headline are hard-coded. Nothing configures which series it shows, and the count in the copy would drift from the data.

- **Evidence:** F-Home-Film l.96 chip 'series events-2025'; l.95 'STILLS · EVENT PHOTOGRAPHY · 2025 TO 2026', 'Twenty-four frames, scroll sideways', and a '+19' tile that is not a link. M-Home-Film: 'swipe · 24 frames'. The MEDIA.md sample series 'events-2025' has 2 photos.
- **Fix:** Add a small home config (i18n or a data file) that names the series. Derive the count and '+N'. Make the h2 count-agnostic or interpolated. Link the +N tile to /film/photography?series=<id>.

### [medium] film-home-cta-targets (routing)
Several film CTAs point at anchors or routes that do not exist, and the mobile Reel card is a dead link.

- **Evidence:** F-Home-Film: 'Watch the reel' href '#reel' (l.53) and Reel card '#reel' (l.109), with no reel section or route. 'Vertical cut' '#vertical' (l.87). 'All films' → '#work'. The '+19' tile (l.104) is not a link. M-Home-Film Reel card href='#'. N-Film 'Share' '#share' (COMPONENTS defines Blog/Share only for D-Post).
- **Fix:** Map them: Watch the reel → /film/films/reel-2026 (or a lightbox player; say which); Vertical cut → /film/films/por-que-no#vertical; All films → /film/films; +N → /film/photography. Reuse Blog/Share on Film/Page.

### [medium] second-featured-film (content-schema)
The 'second featured' film slot has no selection rule, and the seed plan provides no second featured film to fill it.

- **Evidence:** F-Home-Film l.114 chip 'content/films, second featured'. CONTENT.md seed: only por-que-no.md is featured; reel-2026.md and [client-video].md are not. The films schema has `featured` and `order`, and kind includes 'reel', which has its own card.
- **Fix:** Define the selection as featured && kind != 'reel', ordered by `order`, and hide the slot if there is none. Seed the client video as featured with order 2 (draft).

### [medium] landing-folder-case-collision (tooling)
The new Landing/* components collide with the existing app/components/landing/ folder on this case-insensitive checkout, while CI on Linux treats them as two folders, so local and CI builds differ.

- **Evidence:** COMPONENTS.md: Landing/Split, Landing/SideCard, Landing/EnterButton. app/components/landing/ exists (About, FAQ, Hero, Testimonials, WorkExperience). `git config core.ignorecase` = true. deploy.yml runs on ubuntu-latest.
- **Fix:** Delete or rename app/components/landing/ in the same commit that adds the new folder, or name the new group FirstVisit/.

### [low] artboard-fixed-heights (design)
The artboards' fixed section heights do not add up to the frame, so they are preview artifacts and should not be copied.

- **Evidence:** F-Home-Dev section heights sum to 3740px inside a 3700px root with overflow:hidden, which clips the footer. Real data (7 experience entries, 11 FAQs) would overflow the fixed 440px and 420px sections.
- **Fix:** Size each section by its content plus padding.

### [low] timeline-rendering-rules (content-schema)
The timeline's dot states, 'to now' text and org placement cannot be derived from the schema, and `to: null` overlaps `current`.

- **Evidence:** F-Home-Dev and D-About: row 1 filled; rows 2-3 ('[YEAR] to now') have an accent ring; row 4 ('[YEAR]') has a border ring. Rows 2-3 read 'title · org', while row 4 puts the institution in the summary. Schema: `to` is nullable and `current` is a separate boolean. COMPONENTS: 'first dot filled'.
- **Fix:** Filled dot = index 0, accent ring = to null, border ring = ended. Show 'from to now', 'from', or 'from to to'. Derive `current` from `to`. Seed org consistently.

### [low] home-blog-card-rules (content)
The home blog cards have no data rules: whether film posts and drafts appear on the Dev home, what shows with fewer than 3 posts, and whether a tag shows in the meta.

- **Evidence:** F-Home-Dev 'BLOG · LATEST 3', but content/en/blog has 2 posts. The desktop meta shows only [DATE], and mobile shows '[DATE] · [tag]'.
- **Fix:** Filter out drafts, decide whether film-tagged posts are included, hide empty slots, and pick one meta format.

### [low] sqlite-wasm-client-queries (perf)
Any content query that runs on the client downloads SQLite WASM plus the collection dump, and nothing in the handoff guards against it.

- **Evidence:** According to the reviewer, the client database lazily loads @sqlite.org/sqlite-wasm (about 393 KB gz) on the first client query. Risky cases: MoonStage (ClientOnly) reading film stills, /blog search and filters, and the es→en fallback queries if they run outside page-level useAsyncData.
- **Fix:** Run every queryCollection in page-level keyed useAsyncData and pass the data to client-only heroes as props. Add a check that the Network tab shows no sqlite3.wasm request during navigation.

## M4

### [high] turnstile-not-feasible (deploy)
'Turnstile via @nuxt/scripts' with Web3Forms cannot work as written on a static host. The captcha script also loads before consent on both homes and on /contact, which breaks the M5 check.

- **Evidence:** PLAN M4: 'Web3Forms endpoint from env, Turnstile via @nuxt/scripts'. Reportedly, @nuxt/scripts 1.3.x has no Turnstile registry entry, and Web3Forms verifies Turnstile only on its Pro plan; the free plan offers hCaptcha. The site is `nitro.preset: static`, so there is no server to call siteverify. F-Home-Dev l.181 and F-Home-Film l.182 put 'Web3Forms + Turnstile' on the homes, and D-Contact says 'Cloudflare Turnstile · invisible unless challenged'. PLAN M5 check: 'no third-party request before consent'. The banner has only 'necessary' and 'embeds'.
- **Fix:** The owner picks either the Web3Forms free plan with hCaptcha plus a honeypot, or Web3Forms Pro with a client-only Turnstile widget. Load the captcha on the form's first focus. Classify it as necessary in /privacy and /cookies, and exempt it from the M5 check explicitly.
- **Verified:** The finding mostly holds, but two of its reasons need correcting. (1) The handoff asks for "Turnstile via @nuxt/scripts" plus Web3Forms (PLAN.md l.32). That only works if the owner pays for Web3Forms Pro, and no handoff doc says so. Web3Forms documents Cloudflare Turnstile as "a PRO feature"; the free plan offers hCaptcha or a honeypot. @nuxt/scripts has no Turnstile registry entry: 1.3.9 and 2.0.0-beta.9 ship only google-recaptcha. The script can still be loaded with generic useScript('https://challenges.cloudflare.com/turnstile/v0/api.js'), so the registry gap is not a blocker. The static host is not a blocker either. With Web3Forms Pro, the Turnstile secret key is entered in the Web3Forms dashboard, so Web3Forms verifies the token itself and the site needs no server of its own. (2) No document says when the captcha script loads. There are forms on /dev (F-Home-Dev l.181), /film (F-Home-Film l.182, BookShoot) and /contact (D-Contact). If the script loads on mount, it breaks the M5 check "no third-party request before consent". The banner "appears only on pages with embeds" (S-Cookies), so consent may never be asked on /contact. The M6 plan for cookieless analytics loaded "via @nuxt/scripts, no consent needed" breaks the same check. So the M5 wording needs an explicit exception list: the captcha, analytics, and the user-initiated Web3Forms POST.

### [medium] video-autoplay-behaviour (media)
The autoplay, hover-preview and inline-player behaviours shown in the artboards are not specified: the landing preview's source, the 'inline' variant, touch devices, reduced motion, loading, and a player placed inside a link.

- **Evidence:** F-Landing chip 'placeholder · media/preview.mp4', caption 'MUTED LOOP · ¿POR QUÉ NO?'; no rule says which film supplies it, and the legend lacks that chip. N-Films tiles '[poster · muted preview on hover]'; featured '[featured · 16:9 · muted loop]'; N-Film '[vertical cut · 9:16 · muted loop]'. MEDIA.md defines FilmPlayer variant 'full' | 'inline' | 'preview' but never describes 'inline'. M-Home-Film wraps the '[16:9 · own player]' block in <a href='N-Film.dc.html'>, which nests controls inside a link. The reduced-motion rules in DESIGN.md and 3D.md cover scrub, tilt and circle only. All x-dc scripts are empty stubs.
- **Fix:** Specify the landing source: the first `featured` film by order, using its preview, with the poster as fallback. Hover or focus attaches and starts the preview. Coarse pointers show the poster only. prefers-reduced-motion disables all autoplay. Attach video only after LCP. Define 'inline'. On mobile, put a poster inside the card link and keep the player out of the anchor.

### [medium] poster-preview-ref-ambiguity (media)
It is unclear whether films.poster and films.preview point at manifest photos or at the poster and preview paths inside a manifest video entry. That gives two sources for the poster.

- **Evidence:** Snippet: 'poster: mediaRef', 'preview: mediaRef.optional()'. MEDIA.md: videos['por-que-no'] already has 'poster': 'video/por-que-no/poster.jpg' and 'preview': 'video/por-que-no/preview.mp4', a single file with no renditions or blurhash. Media/FilmImage expects a photo id with 480/960/1440/2048 renditions.
- **Fix:** Either poster.id is a photos entry, with srcset and blurhash, and videos[].poster is used only by the player, or drop films.poster and films.preview and read them from videos[films.video.id].

### [medium] vertical-cut-schema (content-schema)
The vertical-cut section's copy, platform links and runtime have no schema fields, and its tile ratio and the 'vertical' kind overlap.

- **Evidence:** N-Film: h2 'The 3-minute vertical cut', p 'Same story, re-framed for Reels…', pills 'Instagram' and 'YouTube Shorts' drawn as <span> with no href, credits row 'Runtime: 6 min · vertical cut 3 min'. Schema: only `vertical: mediaRef.optional()` and a generic `external: z.array(link)`. The tile is 300x420 (5:7) but labelled 9:16. kind enum 'vertical' overlaps the `vertical` field. F-Home-Film 'Vertical cut' links to '#vertical', and no element has that id.
- **Fix:** Add films.verticalCut {title, summary, runtime, links[]}, or derive the runtime from the manifest duration. Use a 9:16 box. Give the section id='vertical'. Remove the 'vertical' kind or define what it means.

### [medium] project-headline-field (content-schema)
The D-Project h1 has no schema field, and the D-Project lead does not match the oneLiner that D-Work shows for the same project.

- **Evidence:** D-Project h1: 'A personal assistant that lives on your machine, not in a tab.', while the title is 'Ada System' (eyebrow 'CASE STUDY · ADA SYSTEM', D-Work h3). D-Project lead: 'Local-first, multi-agent, with a pixel-art office and Spanish voice control.' D-Work: 'Local-first, multi-agent personal assistant with a pixel-art office and Spanish voice control.' The projects schema has only title and oneLiner.
- **Fix:** Add `headline: z.string().optional()` (falling back to title) and choose one canonical oneLiner for ada-system.md.

### [medium] kind-filters (design)
The D-Work and N-Films filters are contradictory and underspecified. The chips say tags, but the pills are the kind enum; some kinds have no pill and no i18n labels; filter state and URL behaviour are undefined.

- **Evidence:** D-Work chip 'placeholder · filters from project tags' and lead 'Filters come from the tags', but the pills are All, Web apps, Infra, Client, Experiments, which match `kind` ['web-app','infra','client','experiment','archive']. The tags are free-form ('local-first', 'sqlite', '.net', 'cdk', …), so filtering by tags would give 10+ pills. 'archive' has no pill. N-Films pills: All, Short films, Reels, Client, while the enum also has 'vertical'. Card meta says 'Showreel', eyebrows say 'SHORT FILM'. COMPONENTS has no Film/Filters. Nothing defines what happens to the featured card when a filter excludes it.
- **Fix:** Filter on `kind`, with i18n keys kind.<id>.{singular,plural}. List which kinds get a pill. Sync the filter with a ?kind= query and aria-pressed. Hide the featured card when it is filtered out. Fix the chip text.

### [medium] case-study-sections (content-schema)
No doc says how one project Markdown body becomes the four numbered case-study sections, or where the decisions grid and gallery images are placed.

- **Evidence:** D-Project has rows '01 Context', '02 What I built', '03 Decisions' and '04 Result', each chipped 'content/projects/<slug>.md'. gallery[0] sits inside 02, gallery[1-2] inside 04, and the decisions[] 2x2 grid inside 03. COMPONENTS names Work/Section, Work/DecisionGrid and Work/Gallery with no splitting rule. The raw markup also has an unescaped `<slug>`, so the chip renders as 'content/projects/.md'.
- **Fix:** Document the convention. For example, `##` headings render as numbered sections, and `::decision-grid` and `::gallery` MDC components go in the body. Say whether the section titles are content or i18n, and what renders when a project has fewer sections or no gallery.

### [medium] films-logline (content-schema)
The films schema has no short logline, and synopsis is a single string although the design asks for two paragraphs.

- **Evidence:** N-Films featured blurb: 'One actress, two inner voices, a room lit in red and blue. 6 minutes.' N-Film: '…[Synopsis from content/films/por-que-no.md, two paragraphs.]' Snippet: 'synopsis: z.string()', with no oneLiner (projects has one). films is type 'page', so it also has a Markdown body.
- **Fix:** Add films.logline for cards, and state that the two-paragraph synopsis is the Markdown body.

### [medium] film-credits-mapping (content-schema)
The credits card mixes credits[] entries with rows that come from other fields, and some values have no field.

- **Evidence:** N-Film credit rows: Written by, Directed by, Cast, 'Camera: Sony a7III · [lens]', Sound, Edit and color, 'Runtime: 6 min · vertical cut 3 min', 'Year: 2026'. Schema: credits[{role,name}], camera, runtime and year are separate fields. CONTENT.md says 'credits as in N-Film'. 'Camera: Sony a7III' on the film home could come from either camera or credits.
- **Fix:** State that credits[] holds only people, and that Camera, Runtime and Year are rows appended from their own fields with i18n labels.

### [medium] film-about-modules (design)
N-About contradicts COMPONENTS.md and CONTENT.md on which modules /film/about contains.

- **Evidence:** COMPONENTS: About/PageFilm 'swaps stack for About/Kit and About/Services', which implies the timeline and Now block stay. CONTENT.md: filmography is used by 'night home credits, /film/about'. N-About has only the hero with portrait, Kit and Services: no timeline, no Now block and no credits.
- **Fix:** Decide whether /film/about gets Filmography/Credits and Now, and fix COMPONENTS.md and CONTENT.md to match.

### [medium] photography-series-behaviour (media)
On /film/photography, the series pills have no defined behaviour, deep link or Spanish title, and the masonry's DOM order conflicts with the eager-loading rule.

- **Evidence:** N-Photography pills 'Events 2025' (active), 'On set', '[Series]' are spans with no 'All'. PAGES.md has only /film/photography. The manifest series has a single `title` with no es version. The masonry is column-major (stills 01-03 in column 1), while MEDIA.md says the page 'loads the first 6 images eager'. MEDIA.md also says 'Every FilmImage on the film pages has loading="lazy" except the hero poster'.
- **Fix:** Add ?series=<id>, defaulting to the first series, and decide whether 'All' exists. Add title_es or an i18n map. Use row-major reading order for eager loading and the lightbox. Scope the lazy rule to /film/films/[slug].

### [medium] content-path-vs-route (routing)
Links built from a collection's content path will 404, because the path does not match the route: films and projects are served under /film/films and /dev/work.

- **Evidence:** films source 'films/*.md' gives path '/films/<slug>', while the route is '/film/films/[slug]'. projects gives '/projects/<slug>', while the route is '/dev/work/[slug]'. The repo CLAUDE.md already warns: 'Content post.path carries the collection prefix … always build links via localePath(...)'. Every N-Films card, the N-Film Next card, the Behind-the-scenes links and the project cards depend on this.
- **Fix:** Always build links as localePath('/film/films/' + stem), localePath('/dev/work/' + stem) and localePath('/blog/' + stem). Generate the prerender routes from the collections using the same mapping.

### [medium] shared-pages-night-variant (design)
The night versions of the shared pages /blog and /contact are not designed, and the night nav has no Blog item.

- **Evidence:** PAGES: /blog, /blog/[slug] and /contact use the 'stored mode'. COMPONENTS covers only D-Post, as 'same component at night (serif h1/h2)'. DESIGN night nav: 'Films · Photography · Journal · About · Contact', with no Blog. DESIGN night contact copy is 'Book a shoot' with topic Film or photo, but D-Contact draws only 'Web project' and 'Tell me what you are building.'
- **Fix:** Specify the night /blog nav active state (Journal, or none) and whether its h1 and lead change. At night, /contact defaults to topic film and uses the 'Book a shoot' h1.

### [medium] contact-form-fields-undefined (content-schema)
The contact form's topic-driven fields, consent line and success/error copy are undefined. Only the web topic is drawn.

- **Evidence:** D-Contact draws Name, Email, Budget range, Timeline and Message for 'Web project' only. Schema: topics {id, label, fields: z.array(z.string())}, with no field vocabulary, types or labels. The film fields exist only in prose ('a shoot needs a date and a place'; BookShoot 'date, place, what happens'). The 'Just saying hi' topic is not drawn. The note 'success and error states inline … consent line links to Privacy' has no copy.
- **Fix:** Define a field-id enum (name, email, budget, timeline, date, place, message) with type, label and placeholder in i18n, and seed topics.fields from it. Write the consent, success, error and validation strings.

### [medium] blog-search-pagination-rss (design)
Blog search and pagination are drawn with no behaviour, so the current working search could regress.

- **Evidence:** D-Blog: 'Search' href '#search', 'RSS' href '#rss', and page pills 1/2/3 as spans. COMPONENTS names only Blog/Pagination. There is no page size and no paged route. The current app/pages/blog/index.vue filters with `UInput v-model="searchQuery"`. Only 2 real posts exist.
- **Fix:** Define the page size and a ?page= scheme, or no pagination until there are more than N posts. Search opens an inline field that keeps the current filtering. RSS links to /rss.xml; decide whether there is one feed per locale.

### [medium] post-callout-shiki (design)
The post callout component and the per-mode Shiki theme are not specified, and the code block colours are not tokens. Nuxt Content's dual theme also switches on the .dark class, not data-mode.

- **Evidence:** D-Post: '**Note.** [Callout component from MDC, optional.]', with no component named. The code block comment says 'Shiki theme per mode', with keyword #7FD4B8 and strings #E2A15B inside a day artboard. tokens.css has no code tokens. Reportedly, Nuxt Content's highlight.theme {default, dark} keys off the color-mode .dark class.
- **Fix:** Add components/content/Callout.vue to COMPONENTS. Pick the Shiki themes, or use a css-variables theme mapped to new --code-* tokens scoped by [data-mode].

### [medium] tresjs-iscustomelement-overwrite (media)
@tresjs/nuxt reportedly assigns vue.compilerOptions.isCustomElement instead of composing it. media-chrome's custom elements would then be treated as unresolved Vue components.

- **Evidence:** According to the reviewer, @tresjs/nuxt 5.7 dist/module.mjs:106 assigns isCustomElement to a function that matches only Tres*, tres-* and primitive. The media-chrome tags media-controller and hls-video would then produce 'Failed to resolve component'. PLAN M0 adds @tresjs/nuxt, and M4 adds the FilmPlayer.
- **Fix:** In a modules:done hook, wrap the existing function: `t => tres?.(t) || t.startsWith('media-') || t === 'hls-video'`. Import media-chrome client-side only.

### [low] interactions-unspecified (a11y)
All artboard scripts are empty, so the behaviour of many interactive elements is unspecified, and some actions are drawn as links or spans.

- **Evidence:** Every <script type='text/x-dc'> contains only `renderVals() { return {}; }`. Unspecified behaviour: the D-Post TOC scroll-spy and depth, 'Copy link' feedback, share intent URLs, Prev/Next direction, the D-Project next fallback, hiding the D-About NOW block when empty, the S-Legal TOC scroll-spy, S-Legal tabs as spans, and the S-Cookies actions as <a href='#'>.
- **Fix:** Add a behaviour table to COMPONENTS.md for Blog/Toc, Blog/Share, Blog/PrevNext, Work/Filters, Work/NextCard, Legal/Toc and Legal/Tabs. Render the banner actions as <button>.

### [low] unmapped-sections (design)
Some drawn sections have no component in COMPONENTS.md, and one mapping points at a block that does not exist.

- **Evidence:** The D-Work banner 'Looking for the film side?' / 'Switch to Filmmaker' and the D-Project dark card 'BUILDING SOMETHING SIMILAR?' + 'Contact' have no component. D-Project is mapped to Work/Gallery, but the artboard has no standalone gallery.
- **Fix:** Add Shell/CrossModeBanner and Contact/Cta, and fix the D-Project component list.

### [low] project-cover-video (content-schema)
The D-Project cover allows a 'muted screen recording', but projects have no video field.

- **Evidence:** D-Project cover: '[hero image, 16:9, or muted screen recording]'. The projects schema has only `cover: image`.
- **Fix:** Add `coverVideo: mediaRef.optional()` rendered with the FilmPlayer 'preview' variant, or drop the option.

## M5

### [high] embeds-contradiction (media)
The docs contradict each other on whether YouTube and Instagram embeds exist. The cookie banner and privacy §5 exist only because of embeds, while MEDIA.md forbids them. No artboard shows an embed, and the @nuxt/scripts facades do not fit a static, consent-first site.

- **Evidence:** MEDIA.md: 'Never hotlink from Vimeo, YouTube or Instagram inside the site; external links only.' PLAN M5: 'embeds (YouTube, Instagram) as facades that load only after consent'. handoff/CLAUDE.md: '@nuxt/scripts (consent + embed facades)'. S-Cookies: 'YouTube and Instagram embeds set their own cookies…' and 'appears only on pages with embeds'. S-Legal §5 describes the embeds. N-Film's vertical cut 'Plays inline here, links out to Instagram and YouTube Shorts' is self-hosted. Reportedly, ScriptYouTubePlayer preconnects to i.ytimg.com before consent, ScriptInstagramEmbed needs /_scripts/embed/instagram server handlers, and useScriptTriggerConsent has no categories or storage.
- **Fix:** The owner decides. If there are no embeds, drop the banner (cookieless analytics needs no consent), make /cookies a static notice, and rewrite privacy §5 and M5. If there are embeds, name the pages that host them, update MEDIA.md, build the facade with a self-hosted poster, replace Instagram with a static card and a link, and persist consent in a vg-consent cookie.
- **Verified:** The finding holds. The handoff contradicts itself on YouTube and Instagram embeds. docs/MEDIA.md (Rules) says 'Never hotlink from Vimeo, YouTube or Instagram inside the site; external links only.' But PLAN.md M5 requires 'embeds (YouTube, Instagram) as facades that load only after consent', with the check 'banner not shown on pages without embeds'. handoff/CLAUDE.md lists '@nuxt/scripts (consent + embed facades)', and COMPONENTS.md defines Shell/CookieBanner with 'Allow embeds'. S-Cookies.dc.html says 'YouTube and Instagram embeds set their own cookies…' and 'appears only on pages with embeds'. S-Legal.dc.html §5 reads 'YouTube and Instagram embeds load only after you accept them in the cookie banner.' Neither the artboards nor the schema say where an embed would go. No artboard has an iframe or an embed placeholder. N-Film's vertical cut is a 'media manifest, vertical' placeholder (self-hosted) with plain Instagram and YouTube Shorts links. The films schema in snippets/content.config.ts has only `vertical: mediaRef.optional()` and `external: z.array(link)`, with no embed or YouTube ID field. The library claims check out against @nuxt/scripts 1.3.9, the current npm version, with one small correction. ScriptYouTubePlayer's default placeholder `<img>` loads from https://i.ytimg.com before any click or consent. At prerender it also emits a link to i.ytimg.com: a `preconnect` only when `aboveTheFold`, otherwise a `dns-prefetch`. So "preconnects" is only exactly right for above-the-fold players, but either way there is a third-party request before consent. ScriptInstagramEmbed fetches `${prefix}/embed/instagram` and calls requireRegistryEndpoint, so it needs a Nitro server route that a static deploy does not have. useScriptTriggerConsent keeps a single boolean `consented` ref with accept()/revoke(). It has no categories and no persistence, so the 'consent registry', the `necessary`/`embeds` categories and the '6 months' storage in PLAN M5 and S-Cookies would all have to be hand-built.

### [medium] cookies-page-undefined (legal)
The /cookies page has no design and no content source, and the docs disagree on whether it is a page or a way to reopen the banner.

- **Evidence:** PAGES.md: '/cookies | pages/cookies.vue | S-Cookies | Cookies (reopens the consent choice)'. PLAN M5: '/privacy, /terms, /cookies from content/legal'. CONTENT.md legal: only privacy.md and terms.md. S-Cookies draws only the banner, with the note 'el toggle "Allow embeds" reaparece en Cookies del footer'. The S-Legal tabs include 'Cookies' as a non-link span.
- **Fix:** Add content/legal/cookies.md, rendered with the S-Legal template and an embedded consent toggle (if embeds exist). The footer link navigates to /cookies. Make the legal tabs router links.

### [medium] analytics-consent-privacy (tooling)
The analytics provider is undecided in text marked 'real', one consent rule cannot be implemented on a static host, and the M5 network check conflicts with necessary third-party requests.

- **Evidence:** S-Legal §2: 'Cookieless analytics (Umami or Cloudflare Web Analytics)'. CONTENT.md l.32 says privacy sections 'are real, keep them', and PLAN M6 says to 'document the choice'. S-Cookies: '…or on first visit if analytics needs consent in your region', which needs geo-IP. PLAN M5 check: 'no third-party request before consent', which conflicts with the analytics beacon and the form captcha. S-Legal §3 lists only 'Name, email and message', while the topics collect date, place, budget and timeline. The privacy text says media is served from CloudFront and does not mention GitHub Pages hosting.
- **Fix:** Pick one analytics provider and edit §2. Drop the region clause. List the exempt origins (analytics, form, captcha) in the M5 check. Extend §3 to cover every form field and the hosting.

### [medium] s404-mismatch (design)
S-404 promises a 3D object and actions that its layout does not contain, has no shell, and its mode rule conflicts with the /film/** forcing. The static output's 404.html is also the SPA shell, not a prerendered error.vue.

- **Evidence:** S-404 footnote: 'the 3D object is the exploded page (day) or a blank frame (night), static', but there is no slot for it and 3D.md never mentions a 404. The day copy says 'Search the blog or go back to the projects.' but the buttons are 'Back home' (/dev) and 'Try the film side'. The night copy says 'The reel and the stills are one click away.' with no link to either. The brand is a <span>, and there is no header or footer. PAGES.md: '404 | app/error.vue | stored mode' and 'app/error.vue is generated to 404.html'. The night half's artboard never loads Newsreader. According to the reviewer, Nuxt emits 404.html as an SPA fallback with an empty app.
- **Fix:** Drop the 3D mention or add a static PNG slot. Align the buttons with the copy (/blog and /dev/work; /film/films and /film/photography). State whether error.vue uses the default layout, and that 404s under /film/** render in night mode, decided by the pre-paint script since error.vue renders client-side.

## M6

### [high] static-robots-sitemap-collide (seo)
The static public/robots.txt and public/sitemap.xml would shadow or clash with the generated ones. /bag is currently neither noindex nor excluded from the sitemap, and the plan's robots Disallow would stop crawlers from ever seeing the noindex.

- **Evidence:** public/ contains robots.txt ('Disallow:' with an empty value) and sitemap.xml, which lists /bag and /es/bag. app/pages/bag.vue sets no robots meta. handoff/CLAUDE.md: '/bag stays off-nav and noindex'. PAGES.md: robots 'allow all except /bag and /es/bag' plus noindex. According to the reviewer, nitro skips prerendering any route that exists as a public file, so the old static sitemap would ship, and @nuxtjs/robots renames public/robots.txt to _robots.txt inside the source tree.
- **Fix:** In M6, delete public/robots.txt and public/sitemap.xml. Set routeRules for '/bag' and '/es/bag' to { robots: false } and exclude them from the sitemap, but do not Disallow them in robots.txt. Set site.url to https://victorgarces.net.
- **Verified:** The finding holds, with two corrections to how it works. (1) public/sitemap.xml is stale and lists https://victorgarces.net/bag and /es/bag. Nuxt sets nitro.prerender.ignoreUnprefixedPublicAssets: true, so nitro's own prerenderer skips /sitemap.xml. @nuxtjs/sitemap v8 gets around that skip: it fetches /sitemap.xml itself in prerender:done. But that fetch goes to the nitro-prerender server, which has serveStatic: true. Its static middleware is registered first and serves files from .output/public. public/ is copied there before prerendering (nuxt dist index.mjs:4474 copies, :4493 prerenders). So the fetch returns the old static file and writes it back, and the stale sitemap ships unless public/sitemap.xml is deleted. (2) public/robots.txt is not shadowed. @nuxtjs/robots 6.x merges its rules and then runs fsp.rename to move it to public/_robots.txt inside the source tree, with the warning 'Your robots.txt file was moved to ./public/_robots.txt'. That is an unexpected change to a tracked file. app/pages/bag.vue sets only title and description, with no robots or noindex. The handoff asks for both noindex (handoff/CLAUDE.md, PAGES.md table) and a robots exclusion ('allow all except /bag and /es/bag' in PAGES.md, 'robots excluding /bag' in PLAN.md M6). A robots.txt Disallow stops crawlers from ever seeing the noindex, so the two instructions work against each other. The handoff never says to delete the two public files or to set site.url. The current values to reuse are i18n.baseUrl and SITE_URL in app/utils/site.ts, both 'https://victorgarces.net'. The suggested fix is correct: delete both files; set routeRules robots: false on '/bag' and '/es/bag', which @nuxtjs/sitemap also drops from the sitemap; add no Disallow; set site.url. Severity is closer to medium than high, because /bag is off-nav and the damage is limited to that page plus a stale sitemap.

### [medium] og-template-mapping (seo)
The OG artboards do not map onto PAGES.md's { title, subtitle } props, and no doc says which template shared pages and '/' use, or whether posts keep their photo as the OG image.

- **Evidence:** S-OG-Dev and S-OG-Film have a fixed name at 64px, a fixed eyebrow ('DEVELOPER · SANTO DOMINGO, DO' / 'FILMMAKER · @VGFILMX') and a lead, with no placeholder chips. Their annotation says 'title and mode from route meta'. PAGES.md: defineOgImageComponent('OgDay'|'OgNight', { title, subtitle }). Shared routes use the visitor's stored mode, which prerender cannot know. '/' shows both modes. app/pages/blog/[slug].vue currently sets ogImage to post.image. PLAN M6 check: OG correct for '/dev, /film, a post and a film'.
- **Fix:** Specify whether title replaces the name or is added below it, and that the eyebrow comes from i18n. Assign templates: /blog/** uses OgNight if tags include 'film', else OgDay; /contact, the legal pages and '/' use OgDay. Posts with a cover keep a photo OG via useSeo's image override.

### [medium] og-technical-constraints (seo)
The OG components as specified would not build or render correctly. The renderer needs a name suffix and supported fonts, the night tokens do not resolve outside the page, and the fonts the doc points to do not exist on disk.

- **Evidence:** PAGES.md: 'OG … fonts loaded from public/fonts'. public/ holds only favicon.ico, images/, robots.txt and sitemap.xml. DESIGN.md loads fonts through @nuxt/fonts (variable WOFF2). According to the reviewer, nuxt-og-image v6 requires the .satori.vue/.takumi.vue suffix, Satori does not support WOFF2 or variable fonts, and CSS variables resolve only from :root, so [data-mode='night'] tokens are dropped. S-OG-Film also draws #6A2A24, #25314F and #0B0908. The PLAN M1 hex grep over app/components would flag literal colours.
- **Fix:** Create app/components/OgImage/OgDay.<renderer>.vue and OgNight.<renderer>.vue, and install the renderer. Pass colours from a TS token map generated from tokens.css, and exempt OgImage from the hex grep. Add static TTF/WOFF files under public/fonts: Albert Sans 400/700, Source Code Pro 400/500, Newsreader Italic 500.

### [medium] favicon-spec (seo)
The favicon spec ignores the existing starter favicon.ico and ties the icon colour to the OS scheme instead of the site mode. 'theme_color per mode' cannot live in the manifest, and the icon corners are wrong for iOS and maskable icons.

- **Evidence:** public/favicon.ico is 4286 bytes (the Nuxt starter icon) and is linked in app/app.vue:21. S-Favicon lists only PNG 512/180/32/16 and SVG, with no .ico. Its note says 'accent follows prefers-color-scheme via SVG media query', so /film on a light-OS machine shows the day icon. The night panel draws PNGs, yet the note says 'PNG fallbacks in day colors'. PLAN M6: 'theme_color per mode via meta swap', without naming the token. The 180 and 512 icons use rx 16-18 of 64, leaving transparent corners that iOS fills with black, and no maskable variant is specified.
- **Fix:** Replace or delete favicon.ico. Set manifest theme_color and background_color to the day values. Have useMode set <meta name=theme-color> from the current --bg. Export apple-touch-icon and a maskable 512 as full-bleed squares. State whether the favicon link swaps with the site mode.

### [medium] videoobject-uploaddate (seo)
The required VideoObject structured data needs uploadDate, which neither the films schema nor the manifest provides.

- **Evidence:** PAGES.md l.31: 'VideoObject on film pages (name, description, thumbnailUrl from manifest, uploadDate, duration)'. The films schema has only `year: z.string()`. The MEDIA.md video entry has no date.
- **Fix:** Add films.released (a date), or an uploadDate field in the manifest.

### [medium] sitemap-i18n-lastmod (seo)
With i18n enabled the sitemap module produces an index plus per-locale sitemaps and turns /sitemap.xml into a redirect. 'lastmod from content' needs schema hooks the snippet does not have, and the content paths do not match the routes.

- **Evidence:** PAGES.md: 'Sitemap … with both locales and `lastmod` from content'. The reviewer read @nuxtjs/sitemap 8.x: multi-sitemaps per locale and routeRules['/sitemap.xml'] = redirect to /sitemap_index.xml (a meta refresh on a static host). lastmod needs defineSitemapSchema() or asSitemapCollection(). films/x.md gives /films/x, but the route is /film/films/x.
- **Fix:** Set `sitemap: { sitemaps: false }` for a single sitemap with hreflang, or submit /sitemap_index.xml. Add asSitemapCollection with an onUrl mapping to the /dev and /film routes, or drop the lastmod requirement.

### [low] landing-title-h1 (seo)
The '/' page would get a duplicated title, and the landing has no h1.

- **Evidence:** PAGES.md: the '/' title is 'Víctor Garcés · Developer and Filmmaker' and titleTemplate is '%s · Víctor Garcés', which gives 'Víctor Garcés · Developer and Filmmaker · Víctor Garcés'. F-Landing: both card headlines are <h2> and the brand is a <span>.
- **Fix:** Use titleTemplate null on '/', and add a visually hidden h1 (or make the brand the h1).

### [low] prerender-extra-routes (routing)
Some static outputs need explicit prerender entries that the handoff does not mention: RSS, /es/bag and the old-slug redirect pages.

- **Evidence:** nuxt.config prerender.routes is only ['/bag'], while the sitemap lists /es/bag. PAGES.md: 'RSS: server/routes/rss.xml.ts'. According to the reviewer, the nitro crawler follows only extensionless and .json hrefs. Redirect pages are only written for routes listed in the prerender routes.
- **Fix:** Add '/rss.xml', '/es/bag' and every old slug in both locales to nitro.prerender.routes.

## M7

### [high] initial-js-budget-exhausted (perf)
The budget of 'initial JS under 200 KB gzipped on the Home pages' is already used up by the current stack, before any of the planned modules are added.

- **Evidence:** handoff/CLAUDE.md l.26 and PLAN M7 check: 'initial JS on /dev under 200 KB gzipped'. The reviewer measured the deployed home on origin/gh-pages at gzip -9: entry Ds_C1Hon.js 147,263 B, plus BnTt7CSs.js 23,353 B, XZqo9AHL.js 15,389 B and others, 199,781 B in total. The refactor adds @nuxt/scripts, the seo runtime, the mode/transition code and possibly eager GSAP (about 45 KB gz).
- **Fix:** Record a per-route baseline in M0 after `pnpm generate`. Find out what fills the 147 KB entry chunk (Nuxt UI providers, i18n, content client). Then either restate the budget relative to that baseline or plan the cuts before M3.
- **Verified:** The finding holds, with some refinements. The deployed build on origin/gh-pages (commit 1127f71, built from master HEAD 8b7623f) preloads 12 JS chunks on / and on /es. At gzip -9 they total 200,003 B: that is 200.0 kB in decimal units, or 195.3 KiB. The entry chunk Ds_C1Hon.js alone is 147,324 B. The current Home is therefore right at the handoff's 'initial JS under 200 KB gzipped' budget (handoff/CLAUDE.md l.26, PLAN.md M7), with about 5 KiB of headroom if KB means KiB. The budget targets the new /dev and /film homes, so some page-specific chunks will change. The current landing's Tabs/Accordion chunk BnTt7CSs.js (23 KB gz) is one of them. The shared floor still stays high: the entry (147 KB), the header Tooltip chunk XZqo9AHL.js (15 KB), the layout chunk ClZcW0_s.js (5 KB) and the vueuse chunk (2 KB) come to about 170 KB. Even the simpler /blog index already loads 180,985 B gz. That leaves roughly 20-30 KB for all of /dev's page code plus everything M0-M7 adds eagerly, such as the mode/transition code, @nuxt/scripts consent and any GSAP that is not dynamically imported. M0 should record a per-route baseline, and the budget should be restated or cuts planned before M3.

### [high] tresjs-3d-budget (3d)
The budget 'three + TresJS chunk under 200 KB gzipped' is not achievable with TresJS, because @tresjs/core registers the whole three namespace and three cannot be tree-shaken.

- **Evidence:** 3D.md l.31: 'three + TresJS chunk under 200 KB gzipped'. The reviewer says tres core has `import * as THREE from 'three'` and `extend(THREE)`. Their measurements: three plus Tres core ≈230 KB gz without Vue, ≈282 KB with cientos useGLTF, and plain tree-shaken three with GLTFLoader ≈155 KB.
- **Fix:** Either raise the lazy 3D chunk budget to about 300 KB gz, or build both heroes with plain three using named imports and drop @tresjs/*. In both cases keep the chunk behind onNuxtReady or an IntersectionObserver.
- **Verified:** The core claim holds, but some of the numbers and wording need correcting. handoff/docs/3D.md line 31 sets a budget of "three + TresJS chunk under 200 KB gzipped". That cannot be met with the stack the handoff specifies: @tresjs/nuxt, @tresjs/core 5.9.0 and @tresjs/cientos, listed in handoff/CLAUDE.md line 16. The cause is that TresCanvas imports the three namespace (`import * as THREE from "three"`) and calls `extend(THREE)` in its setup, which keeps all of three in the bundle. Three itself can be tree-shaken; Tres prevents it. The whole three namespace alone is about 189–198 KB gzipped, so almost nothing is left under the budget. Measured with Vue and VueUse kept out of the chunk, since the main bundle already shares them: three + Tres core is about 207–217 KB gz. Adding three's GLTFLoader, which the Day hero GLB needs, gives about 220–231 KB. Adding cientos useGLTF gives about 249–265 KB. Plain three with named imports plus GLTFLoader is about 155–162 KB. The reviewer's figures (≈230 KB, ≈282 KB, ≈155 KB) run 10–20 KB high for the Tres cases, but the conclusion is the same. The suggested fix is sound: either raise the lazy 3D chunk budget to about 250–300 KB gz, or build both heroes with plain three using named imports and drop @tresjs/*. Keep the chunk loaded after onNuxtReady or an IntersectionObserver either way.

### [high] gltf-optimize-breaks-contract (3d)
`gltf-transform optimize` with its default settings flattens and joins the named layer_* meshes and applies meshopt compression. That breaks the by-name animation contract in 3D.md, and cientos useGLTF cannot decode meshopt.

- **Evidence:** 3D.md l.31: 'GLB under 300 KB after `gltf-transform optimize`'. 3D.md animates layer_*, card_* and page_root by name, and l.6 says to rename with gltf-transform. According to the reviewer, the CLI 4.5 defaults are --compress meshopt, --flatten true, --join true and --palette true; cientos wires only DRACOLoader, with the decoder on www.gstatic.com (a third-party request).
- **Fix:** Specify the exact command, for example `gltf-transform optimize in.glb out.glb --flatten false --join false --palette false --instance false --compress draco`. Self-host the Draco decoder (decoderPath '/draco/'). Verify the node names with `gltf-transform inspect`.
- **Verified:** The finding holds, with small refinements. 3D.md l.31 names bare `gltf-transform optimize`. In @gltf-transform/cli 4.5.0 (latest) its defaults are dedup, instance (min 5), palette (min 5), flatten, join with joinNamed=true (named meshes are merged too), weld, simplify, resample, prune (keepLeaves=false) and `--compress meshopt`, which marks EXT_meshopt_compression as required. If the GLB has no baked animation, flatten moves every mesh node to the scene root and prunes empty nodes. That removes `page_root` and the `layer_03_cards` group. Palette then merges the five mat_* materials into one textured material, and join merges sibling primitives across named nodes. The `layer_*` and `card_*` nodes that 3D.md l.20-25 animates by name disappear. Cientos 5.9.0 `useGLTF` (the loader COMPONENTS.md l.73 requires) only accepts `draco`, `decoderPath` and `traverse`. It never calls setMeshoptDecoder, so the three-stdlib GLTFLoader throws "setMeshoptDecoder must be called before loading compressed files". Its default Draco decoderPath is https://www.gstatic.com/draco/versioned/decoders/1.5.6/. That is a third-party request, which conflicts with PLAN.md l.38 ("no third-party request before consent") and the CSP in MEDIA.md l.47. Refinements: (a) `--instance false` is harmless but not needed, because instance() needs 5 or more copies and there are only 3 cards. (b) If the optional baked "explode" clip (PROMPT-3D.md l.28) is present, flatten and join skip the animated nodes, so the names would mostly survive. The clip is optional and 3D.md drives motion from GSAP, so the handoff cannot rely on it, and meshopt still breaks useGLTF. (c) Consider adding `--simplify false`, since simplify is on by default and can distort the 0.04 corner radii. `--compress quantize` (or `false`) avoids decoders altogether, because GLTFLoader decodes KHR_mesh_quantization natively. If Draco is used, self-host the decoder via `decoderPath`. Check the node names afterwards with `gltf-transform inspect`.

### [medium] sun-moon-same-element (3d)
DESIGN.md and a hero note require the day sphere to morph into the night moon as the same element, but the day hero no longer has a sphere, and /dev and /film are separate routes with separate hero components. F-Sistema also describes 3D behaviour that no doc covers.

- **Evidence:** DESIGN.md l.41: 'the day sphere becomes the night moon (same element, re-lit)'. F-Home-Film l.57: '3D: the sun of the day mode becomes the moon: same sphere…'. 3D.md: the day hero is Hero/PageExploded (GLB). F-Sistema: 'the sphere is now the 3D slot for the disassembling page'. F-Home-Dev and M-Home-Dev have no sphere. F-Sistema adds 'Night · same hero', while COMPONENTS has a separate Hero/Film + MoonStage. F-Sistema also mentions a baked 'explode' clip 'fallback for useAnimations' and a '520 px stage', neither of which appears in 3D.md.
- **Fix:** Remove the 'same element' sentence. The mode transition is the circle clip-path only, and MoonStage is independent. Add to 3D.md when the baked clip is used, and the 520px stage height.

### [medium] film-hero-frames (3d)
The film hero's frames contradict 3D.md on image source and scale step, their captions have no data field, and MoonStage has no mobile fallback spec.

- **Evidence:** 3D.md: 'first three stills of the featured film', stacked 'with 10 % scale steps'. F-Home-Film l.45 labels frame 2 'EVENT SERIES · 14/24' and l.44 shows timecode '00:42'. Frame widths are 620 → 440 → 320 (about 29% steps). mediaRef is {id, alt}, and manifest photos have no caption or timecode. M-Home-Film shows only a static SVG, and 3D.md does not cover MoonStage on mobile or coarse pointers.
- **Fix:** Choose one source and one scale step. Drop the captions or add an optional caption to mediaRef. Specify a static PNG fallback for MoonStage on mobile and under reduced motion.

### [low] gsap-entry-bundle (perf)
The usual Nuxt setup of registering GSAP in a .client plugin would put it in the entry bundle, which breaks the M7 lazy-chunk check. ScrollTrigger pinning can also clash with the out-in page transition.

- **Evidence:** PLAN M7 check: 'three/gsap in lazy chunks'. Plugins are part of the entry. The reviewer measured gsap plus ScrollTrigger at about 45 KB gz. nuxt.config has pageTransition mode 'out-in'.
- **Fix:** Dynamic-import gsap and ScrollTrigger inside the lazy hero, and use gsap.context() with ctx.revert() on unmount. Pin an inner wrapper, not the component root.

### [low] blog-post-animation-claim (content)
A published blog post says every animation on the site is hand-rolled. Adding GSAP makes that false.

- **Evidence:** content/en/blog/ai-and-my-two-crafts.md l.37: 'Every animation here is hand-rolled instead of pulled from a library…', and the ES version has the same sentence. The handoff: 'One tweening library: GSAP', plus TresJS.
- **Fix:** Flag this for the owner in MIGRATION.md. Edit the sentence in both locales, or add a dated note, when GSAP lands.

## M8

### [medium] csp-redirects-cname-on-pages (deploy)
GitHub Pages cannot send response headers, so the M8 CSP can only be a meta tag with a longer source list, and the M9 slug redirects can only be meta-refresh pages. There is also no CNAME in the repo, even though deploys use force_orphan.

- **Evidence:** MEDIA.md: 'Content-Security-Policy: allow media.victorgarces.net for img-src, media-src and connect-src'. PLAN M8 'CSP for media.victorgarces.net' and M9 'redirects for changed slugs'. A meta CSP ignores frame-ancestors, report-uri and Report-Only. The static output has inline scripts (__NUXT__, the pre-paint mode script) and inline styles (Nuxt UI colours). HLS needs blob: for media and workers. Other required origins: the form API, the captcha, analytics, and gstatic if the Draco default is kept. deploy.yml has no `cname:` input, and there is no public/CNAME.
- **Fix:** Specify a <meta http-equiv='Content-Security-Policy'> set via useHead, with hashes or 'unsafe-inline', and the full source list. Accept that frame-ancestors is impossible. Use routeRules redirects plus prerender.routes for old slugs, which produce meta-refresh pages. Confirm how the custom domain is configured, and add public/CNAME if needed.

### [medium] hls-safari-claim (media)
MEDIA.md says Safari uses native HLS, but hls-video-element prefers hls.js wherever MSE or ManagedMediaSource exists, and it always pulls in the full hls.js build.

- **Evidence:** MEDIA.md: 'Uses hls-video-element; on Safari native HLS is used.' According to the reviewer, hls-video-element 1.5.x imports 'hls.js/dist/hls.mjs', takes the hls.js path when Hls.isSupported(), and uses native playback only in the else branch. The bundle is about 188 KB gz.
- **Fix:** If native Safari playback matters, check canPlayType('application/vnd.apple.mpegurl') first and use a plain <video> in media-controller. Dynamic-import hls-video-element only when that check fails. Lazy-load the player on the /film home.

## M9

### [critical] deploy-script-destructive (deploy)
The handoff makes deploy-static.ps1 the deploy mechanism and says it must stay unchanged. That script deletes .output before it copies from it, then force-pushes gh-pages. The real pipeline is the GitHub Actions workflow, and the handoff never mentions it.

- **Evidence:** handoff/CLAUDE.md l.13: '`deploy-static.ps1` for deploys'. l.28: 'Do not change `deploy-static.ps1` or the hosting'. PLAN M9: '`deploy-static.ps1` unchanged, deploy'. deploy-static.ps1 l.29 `Remove-Item * -Recurse -Force -Exclude .git` runs before l.33 `Copy-Item ".output/public/*" .`, and l.51 is `git push -f origin $BranchName`. The wildcard also matches untracked handoff/, node_modules and .data. The script never writes a .nojekyll, and the static preset does not either, so Jekyll would hide _nuxt/, _og/, _fonts/ and __sitemap__/. The live deploy is .github/workflows/deploy.yml (push to master → peaceiris/actions-gh-pages@v4, publish_dir ./.output/public, force_orphan). New secrets are not wired into it: the Web3Forms key, the captcha site key, the analytics id, the Sentry DSN and `pnpm media:pull` credentials. The package.json script `dep` (`cp -r .output/public/* docs/`) would also dump build output into the docs/ folder the handoff now uses.
- **Fix:** Rewrite the handoff to say that deploys happen by merging to master, through deploy.yml. Mark deploy-static.ps1 as do-not-run, or fix it (copy .output/public to a temp directory first). Add public/.nojekyll. Delete the scripts dep, deploy:me and deploy:clean. List the env vars and secrets deploy.yml needs.
- **Verified:** The main claim holds. The handoff names deploy-static.ps1 as the deploy mechanism in three places: handoff/CLAUDE.md l.13 ("`deploy-static.ps1` for deploys", under "Stack (existing, keep)"), l.28 ("Do not change `deploy-static.ps1` or the hosting") and PLAN.md M9 ("`deploy-static.ps1` unchanged, deploy."). No handoff document mentions .github/workflows/deploy.yml, GitHub Actions or gh-pages. Running that script is destructive, and I reproduced this on Windows PowerShell 5.1. The script runs `Remove-Item * -Recurse -Force -Exclude .git` at l.29, which deletes .output along with every untracked or gitignored item: handoff/, node_modules, .data and .env. The `Copy-Item ".output/public/*"` at l.33 then fails with a non-terminating error and the script keeps going. It commits only a .gitignore and runs `git push -f origin gh-pages`, which replaces the live site with an empty branch. The script also never writes a .nojekyll, and neither does the nitro `static` preset. The live pipeline is in fact deploy.yml: on a push to master it runs peaceiris/actions-gh-pages@v4 with publish_dir ./.output/public and force_orphan, and origin/gh-pages is authored by github-actions[bot]. Three parts of the finding need correcting. (1) The Actions path is not affected by Jekyll. peaceiris adds .nojekyll by default (enable_jekyll=false), and origin/gh-pages already has .nojekyll even though .output/public has none. So public/.nojekyll matters only for the script and the gh-pages npm scripts. (2) `pnpm media:pull` needs no credentials. MEDIA.md l.3 says it copies the public URL https://media.victorgarces.net/manifest.json. What CI does need is network access during generate, because PLAN M8 puts media:pull inside the generate script. (3) The Web3Forms access key, the Turnstile site key, the analytics id and the Sentry DSN are public values used in the browser, not secrets. They still have to be passed as build-time env vars to `pnpm generate`, and deploy.yml has no env block. The `dep` script (`cp -r .output/public/* docs/`) would indeed write into the root docs/ folder, which PROMPT-CLAUDE-CODE.md l.3 creates when it has the handoff copied to the repo root. That only happens if someone runs `pnpm dep` by hand.

## Tech facts (checked against npm and the official docs)

- **@nuxtjs/seo version:** @nuxtjs/seo is at 5.3.16, with peer nuxt ^3.16.0 || ^4.0.0 || ^5.0.0. It pulls nuxt-og-image ^6.7.8 (latest 6.8.0), @nuxtjs/sitemap ^8.3.4 (8.5.1), @nuxtjs/robots ^6.1.5 (6.2.3), nuxt-schema-org ^6.2.9 (6.3.2), nuxt-link-checker ^5.2.0 (5.3.0) and nuxt-site-config ^4.2.3. nuxt-site-config has peer vue ^3.5.30, but the repo has vue 3.5.20 installed. (pnpm view @nuxtjs/seo / nuxt-og-image / @nuxtjs/sitemap / @nuxtjs/robots / nuxt-schema-org / nuxt-link-checker / nuxt-site-config version peerDependencies dependencies --json (run 2026-09-21))
- **@nuxtjs/sitemap + i18n:** @nuxtjs/sitemap 8.5.1 reads the @nuxtjs/i18n config (i18n >=8 supported). With a non-no_prefix strategy it auto-builds hreflang alternatives plus x-default. By default it also splits into one sitemap per locale plus /sitemap_index.xml. Setting `sitemap.sitemaps: false` keeps a single /sitemap.xml that still has the alternatives. For lastmod from content it needs `defineSitemapSchema()` / `asSitemapCollection()` from '@nuxtjs/sitemap/content'. (@nuxtjs/sitemap@8.5.1 dist/module.mjs lines 705-840 (autoI18n, canI18nMap, usingMultiSitemaps=true), 889 (/sitemap.xml redirect); dist/content.mjs exports asSitemapCollection, defineSitemapSchema)
- **nuxt-og-image v6 on static:** When nitro.static is set, nuxt-og-image 6.8.0 uses the 'nitro-prerender' compatibility, so OG images are rendered at prerender time. This works on GitHub Pages, but only for pages that are prerendered. The files are written under /_og/. (nuxt-og-image@6.8.0 dist/shared/nuxt-og-image.D936Fp6O.mjs lines 295-296 (`if (nuxt.options.nitro.static) return "nitro-prerender"`), 2764-2772)
- **OG API name:** The current API is `defineOgImage('Component', props, options)`. `defineOgImageComponent` still exists but is marked @deprecated with the note "Migration: defineOgImageComponent('X', props, options) → defineOgImage('X', props, options)". (nuxt-og-image@6.8.0 dist/runtime/app/composables/defineOgImageComponent.d.ts; defineOgImage.d.ts; https://nuxtseo.com/docs/og-image/api/define-og-image)
- **OG fonts:** Satori cannot use WOFF2 or variable fonts. Takumi supports WOFF2 and is the recommended v6 renderer; the current package is @takumi-rs/core 2.14.0. Renderers are optional peers that you must install yourself. Fonts are resolved through @nuxt/fonts. (nuxt-og-image@6.8.0 shared chunk line 2560 ("Satori does not support WOFF2 or variable fonts; use static WOFF/TTF sources or the Takumi renderer"), line 2607; https://nuxtseo.com/docs/og-image/guides/custom-fonts (Satori woff2 ❌, Takumi woff2 ✅); pnpm view @takumi-rs/core version)
- **@nuxt/scripts registry:** @nuxt/scripts 1.3.9 includes registry entries for umami-analytics and cloudflare-web-analytics, plus the facade components ScriptYouTubePlayer, ScriptVimeoPlayer and ScriptInstagramEmbed. It has no Turnstile entry; @nuxtjs/turnstile 1.1.3 covers Turnstile, with peer @nuxt/scripts ^1.0.0. On static presets the scripts proxy is disabled and requests go straight to the third-party origins. (nuxt-scripts@1.3.9 dist/runtime/registry/* listing; dist/module.mjs lines 2044-2052 (STATIC_PROXY_PRESETS incl. 'static','github-pages') and 2551; pnpm view @nuxtjs/turnstile)
- **@nuxt/scripts consent:** The consent API is `useScriptTriggerConsent(options)`, which returns a Promise with `accept()`, `revoke()` and a `consented` Ref. It has no categories, no UI and no persistence. (nuxt-scripts@1.3.9 dist/runtime/composables/useScriptTriggerConsent.d.ts)
- **Web3Forms:** The free plan gives 250 submissions per month with zero-config hCaptcha: script https://web3forms.com/client/script.js, `<div class="h-captcha" data-captcha="true">`, free sitekey 50b2fe65-b00b-4b9e-ad62-3ba471098be2. reCAPTCHA and Cloudflare Turnstile are Pro-only, and the Turnstile secret key is entered in the Web3Forms dashboard. The form POSTs to https://api.web3forms.com/submit with a public access_key. (https://docs.web3forms.com/getting-started/pro-features/cloudflare-turnstile-captcha ("This is a PRO feature"); https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha; https://splitforms.com/web3forms-pricing)
- **TresJS versions:** Current versions are @tresjs/nuxt 5.7.0 (Nuxt >=3.16.0, peer three >=0.133), @tresjs/core 5.9.0 (peer vue >=3.4) and @tresjs/cientos 5.9.0 (peer vue >=3.5.17, @tresjs/core 5.9.0). three is at 0.186.0. All are compatible with Nuxt 4 and Vue 3.5.20. useGLTF comes from @tresjs/cientos and returns { state, nodes, materials, isLoading, execute }. Its Draco decoder defaults to https://www.gstatic.com/draco/versioned/decoders/1.5.6/. TresCanvas is registered as a .client component. (pnpm view @tresjs/nuxt @tresjs/core @tresjs/cientos three; tresjs-cientos@5.9.0 dist/trescientos.d.ts lines 14784-14827, trescientos.js line 8163; tresjs-nuxt@5.7.0 dist/module.mjs line 142)
- **3D bundle sizes (measured):** Measured with esbuild --minify and gzip -9 on three 0.186, Tres 5.9. `three` alone (namespace import): 188,861 B gz. Tree-shaken three (WebGLRenderer, Scene, lights, Mesh) plus GLTFLoader: 155,189 B gz. Vue + three + @tresjs/core: 254,848 B gz; Vue alone is 24,702 B, so three + Tres core is about 230 KB. Adding cientos useGLTF: 307,228 B gz, about 282 KB without Vue. gsap + ScrollTrigger: 45,119 B gz. media-chrome: 42,406 B gz. hls-video-element (bundles full hls.js): 188,121 B gz. hls.js/light: 116,299 B gz. (Local bundle test in scratchpad (esbuild, gzip -9), 2026-09-21)
- **GSAP license:** The npm package `gsap` is at 3.15.0 under the "Standard 'no charge' license". Commercial use is allowed, including all plugins such as ScrollTrigger and SplitText. The only restriction is on building tools that compete with Webflow's visual animation builder. It is not an OSI/MIT license. (pnpm view gsap version license; https://gsap.com/standard-license/)
- **media-chrome / HLS:** Current versions are media-chrome 4.19.2 (MIT), hls-video-element 1.5.11 (deps hls.js ^1.6.5, custom-media-element, media-tracks) and hls.js 1.7.3. hls-video-element statically imports 'hls.js/dist/hls.mjs'. It uses hls.js whenever Hls.isSupported() and falls back to native `canPlayType('application/vnd.apple.mpegurl')` only otherwise. hls.js prefers ManagedMediaSource, which iOS 17.1+ supports. (pnpm view media-chrome hls-video-element hls.js; hls-video-element@1.5.11 dist/hls-video-element.js lines 3, 59-70, 202-203; hls.js@1.7.3 dist/hls.mjs line 1242-1246)
- **@nuxt/fonts:** @nuxt/fonts is at 0.14.0 (fontless ^0.2.1, unifont ^0.7.4). Nuxt UI 3 already auto-installs @nuxt/fonts (^0.11.4) with defaults.weights [400,500,600,700]. processCSSVariables defaults to 'font-prefixed-only', so `--font-*` tokens get detected. Default subsets include cyrillic, greek and vietnamese. The Google provider supports opsz only through the experimental `providerOptions.google.experimental.variableAxis`. Preload is set per family, and it is off by default for faces that have a unicodeRange, which covers all Google faces. (node_modules/@nuxt/ui/dist/module.mjs (registerModule('@nuxt/fonts', {defaults:{weights:[400,500,600,700]}})); fontless@0.2.1 dist/index.mjs lines 117-130, 147; unifont@0.7.4 dist/index.d.mts lines 99-123; nuxt-fonts@0.14.0 dist/module.mjs lines 520-529)
- **@nuxt/content z / zod / dates:** @nuxt/content 3.6.3 (installed) and 3.16.1 (latest) both export `z`, built on zod ^3.25 (3.25.76 installed), so z.string().date() exists. The docs now say the `z` re-export is deprecated; zod v4 and valibot are supported via Standard Schema. Front matter is parsed by remark-mdc with `yaml` v2 (YAML 1.2 core), so an unquoted `date: 2026-07-04` stays the string '2026-07-04' and does not fail z.string().date(). The existing posts use `z.date()`, which maps to a SQL DATE column. (node_modules/@nuxt/content/dist/module.d.mts line 759; nuxt-content@3.16.1 module.d.mts line 756; remark-mdc@3.6.0 dist/index.mjs line 3,53; node test yaml.parse('date: 2026-07-04') → string; https://content.nuxt.com/docs/collections/validators)
- **@nuxt/content i18n:** The officially recommended pattern is one collection per locale (content_en, content_fr) with `source: { include: 'en/**' }` folders and a fallback query to the default locale. The docs do not mention a *.es.md sibling convention. The repo already follows the folder pattern (index_en/index_es, blog_en/blog_es). (https://content.nuxt.com/docs/integrations/i18n; repo content.config.ts)
- **SQLite WASM cost:** sqlite3.wasm is 856,028 B raw and 392,762 B gzipped. It only downloads when a client-side queryCollection runs that the prerender payload does not satisfy. The gh-pages branch already ships __nuxt_content dumps and _payload.json. (node_modules/.pnpm/@sqlite.org+sqlite-wasm@3.50.1-build1 sqlite3.wasm; nuxt-content@3.16.1 dist/runtime/internal/database.client.js initializeDatabase(); git ls-tree origin/gh-pages)
- **Nuxt UI color mode / vars:** In Nuxt UI 3.3.3, `ui: { colorMode: false }` turns off the registration of @nuxtjs/color-mode. The --ui-bg, --ui-text* and --ui-border* variables (in :root/.light and .dark) and --ui-primary (injected at runtime by the colors plugin) are all declared inside `@layer base`. Unlayered `[data-mode]` rules therefore override them. (node_modules/@nuxt/ui/dist/module.mjs lines 56-60; dist/runtime/index.css; dist/runtime/plugins/colors.js)
- **Nuxt UI v4:** Nuxt UI v4.0.0 was released on 2025-09-23; the latest is 4.11.1 (2026-09-07). It merges Pro into the free open-source library and requires Nuxt >= 4.1. The last v3 release was 3.3.7 on 2025-10-23. (pnpm view @nuxt/ui time/dist-tags; https://nuxt.com/blog/nuxt-ui-v4; https://ui.nuxt.com/docs/getting-started/migration/v4)
- **GitHub Pages headers / CSP:** GitHub Pages cannot set custom HTTP headers, and a _headers file is ignored. A CSP in <meta http-equiv> does not support report-uri, frame-ancestors or sandbox, and Content-Security-Policy-Report-Only is not supported in meta. (https://w3c.github.io/webappsec-csp/#meta-element; https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors; https://github.com/orgs/community/discussions/54257)
- **Static redirects:** Prerendering a routeRules redirect produces h3's HTML body `<meta http-equiv="refresh" content="0; url=...">`, and nitro accepts 301-308 during prerender. The old URL has to be listed in nitro.prerender.routes, because the crawler only follows extensionless or .json hrefs (allowedExtensions = Set(['', '.json'])). (node_modules/.pnpm/h3@1*/dist/index.mjs line 781; nitropack@2.12.4 dist/core/index.mjs lines 1829, 1844-1869, 2129-2130)
- **Page naming:** pages/dev/work/[slug].vue and pages/film/films/[slug].vue produce distinct route names (dev-work-slug, film-films-slug). i18n adds `___en`/`___es` suffixes and /es-prefixed paths, and I found no known conflict. Nuxt adds /200.html and /404.html as prerender routes on static presets. The deployed 404.html is an SPA shell: error.vue renders client-side, and the page contains the nuxt-color-mode inline script. (nuxt@4.0.3 dist/index.mjs lines 4462-4466; git show origin/gh-pages:404.html)

## Stale statements in the current root CLAUDE.md

- 'Nuxt 4 (SPA, `ssr: false`, `nitro.preset: static`)'. nuxt.config.ts line 28 is `ssr: true` with the comment 'Prerender full HTML at build time'. Reveal.vue also has an explicit import.meta.server branch for prerendered HTML.
- Core decision 5, 'SPA + static output keeps GitHub Pages hosting free'. The site is prerendered SSG (ssr: true), not an SPA.
- '@vueuse/motion was removed'. It is gone from code and from `modules`, but package.json devDependencies still lists "@vueuse/motion": "^3.0.3" and it is installed in node_modules/@vueuse/motion. Other unused deps are also still present: @nuxtjs/tailwindcss ^6.14.0 (a Tailwind 3 module) and nuxt-og-image ^5.1.9 (never registered).
- 'canonical/sitemap URLs live in app/utils/site.ts'. site.ts only exports SITE_URL and SITE_NAME. The sitemap is a hand-written public/sitemap.xml with hard-coded URLs and lastmod 2026-07-17. Canonical/hreflang come from useLocaleHead using the separate `i18n.baseUrl: 'https://victorgarces.net'` in nuxt.config.ts.
- 'Victor explicitly wants the dark background pure black (#0a0a0a)'. This is not implemented. main.css never overrides --ui-bg, and @nuxt/ui 3.3.3 sets `.dark{--ui-bg:var(--ui-color-neutral-900)}` (#171717) with `body{@apply ... bg-default}`. #0a0a0a appears only in the theme-color meta (app/app.vue line 5).
- 'validated by shared Zod schemas' / 'Components render whatever the Zod-validated YAML provides'. @nuxt/content 3.6.3 does not validate content against the schema at build time. dist/module.mjs only splits keys into schema columns vs `meta`, with no parse/safeParse. Unknown keys such as bag.yml `icon` or testimonials `avatar.srcset` pass silently.
- 'content/ # all copy — no hardcoded strings in components'. Several strings are hard-coded: ColorModeButton aria-label `Switch to ${nextTheme} mode` (English on /es), contact.vue channel labels 'LinkedIn'/'GitHub'/'Instagram', index.vue JSON-LD jobTitle 'Full-Stack Developer & Filmmaker' and 'Santo Domingo', app.vue default title (English on /es), app.config 'Copyright ©', aria-label 'Social Media' and alt 'My profile picture'. UI copy lives in i18n/locales, not content/.
- 'collections are per-locale: index_en/index_es, blog_en/blog_es, pages_en/pages_es'. This omits the single-locale `bag` collection (content/bag.yml at the content root). It serves both /bag and /es/bag, and its descriptions mix English and Spanish.
- The architecture tree is incomplete. It omits app/pages/contact.vue (a live nav route), app/layouts/default.vue, app/utils/site.ts, and the AppFooter.vue, AppImage.vue and ColorModeButton.vue components.
- 'The site deploys to GitHub Pages at https://victorgarces.net'. This cannot be verified from the repo. There is no CNAME in public/ or on origin/gh-pages (`git show origin/gh-pages:CNAME` fails), and deploy.yml uses peaceiris with force_orphan: true but no `cname:` input, which normally clears a custom domain on each deploy.
- 'Free Nuxt UI only ... no @nuxt/ui-pro'. The code complies, but dead Pro config remains in app/app.config.ts (`uiPro.pageHero`) and nuxt.schema.ts (template defaults 'ui-pro@nuxt.com', 'https://cal.com/', primary 'green', neutral 'slate').
