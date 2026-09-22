# Artboard specs (extracted)

## handoff/design/F-Sistema.dc.html (both)
Design-system reference sheet (1440x800), not a page: palettes for both modes, Enter button states, placeholder legend, the 3D hero contract, and a Home Developer changelog. DESIGN.md line 3 names it the source of truth for tokens, Enter states, the placeholder legend and the 3D contract. The script is an empty DCLogic (renderVals returns {}) with no state logic. The file has no U+2014 or U+2013 characters and no {{...}} tokens.

**Sections:**
- Title row (space-between, baseline): h1 Albert Sans 700 26px -0.02em 'Final · first visit from Lumen, everything else from Día y noche' (designer note, not UI) + mono 12px #5F6266 meta 'Albert Sans by day · Newsreader italic by night · Source Code Pro for meta · radii 18 to 32 · teal #1F7A63 / gold #E2A15B'
- Row 1: grid minmax(0,1fr) 460px, gap 20. Left: 2-col grid, gap 12
-   DAY · DEVELOPER palette card: pad 16, bg #F7F7F4, 1px #E2E1DB, r20. 6 swatches (h34, r8, gap 6): bg F7F7F4, surface FFFFFF, text 151617, muted 5F6266, accent 1F7A63, 'tint' E6F1EC (= --raised); caption adds border E2E1DB
-   NIGHT · FILMMAKER palette card: bg #121010, r20. 6 swatches: bg 121010, surface 1C1817, raised 262120, text F1EBE3, muted A69C91, accent E2A15B; caption adds border 2C2624. All 14 values match tokens.css
-   FIRST VISIT states (spans 2 cols, r20, 1px border): 3 pills (h44, pad 0 20, r999, 700 14px, no arrow icon): 'Enter' bg #151617 / #F7F7F4; 'Enter as Developer' #1F7A63 / #FFFFFF; 'Enter as Filmmaker' #E2A15B / #121010. Note: 'No hover: opens Developer. Hover or tap a card: the button takes its color and label. Choice saved in localStorage; the day/night toggle in the nav is the everyday switch.'
-   Right, PLACEHOLDER CONVENTION panel: sample box 90x44 r12 bg #E6F1EC, 1.5px dashed rgba(31,122,99,.55), chip 8px mono white-on-#1F7A63 'placeholder · src'. Legend grid 130px/1fr, mono 11px, 8 rows: projects, films+stills, experience, blog+journal, testimonials, faq, about+cv, 3D
- Row 2: grid 1fr 460px, flex-grow. Left, 3D HERO CONTRACT: 4 tiles (h110, r14, bg F7F7F4): 'scroll 0 % · assembled, idle float' / 'scroll 50 % · layers slide apart in z' / 'scroll 100 % · exploded, guide lines fade in' / 'hover: whole group tilts up to 8° toward the cursor, 300 ms ease-out; reduced motion or mobile: static render, no scroll scrub'. Mesh-name paragraph: layer_01_nav..layer_05_footer under page_root, +Y up, 1 unit = page width, 'optional baked clip "explode" is a fallback for useAnimations'
-   Right, WHAT CHANGED IN HOME DEVELOPER: Hero = 3D slot, 520 px stage. Work = 3 featured + 'more' tile linking to '/work', header '3 of [N]', 'All projects' is a real button. About teaser (portrait, two lines, stack chips). Blog/FAQ titles are placeholders. Nav: About next to Work. Night order: Now showing → stills filmstrip → more work → credits+services → one testimonial → journal + About → FAQ 2 col → Book a shoot

**Nav:** (referenced only) Day nav: About moved next to Work, i.e. Work · About · Experience · Blog · Contact per DESIGN.md

**Placeholders:**
- `src (legend demo chip)` → n/a, it only illustrates the convention — The chip is 8px, pad 2/5, inset 6px. tokens.css uses 10px, pad 4/8, inset 10px. Use tokens.css.
- `legend: projects · cover, tags, links, order, featured: true` → projects.cover, projects.tags, projects.links, projects.order, projects.featured
- `legend: films, stills · manifest.json (poster, preview.mp4, HLS)` → films.poster/preview/video/stills (mediaRef ids) → manifest.videos[id].poster/.preview/.hls, manifest.photos[id] — The legend skips the content/films collection, which 5 chips in other artboards name ('content/films', 'content/films, second featured', 'kinds from content/films', 'featured: true in content/films · ...'). DESIGN.md's legend also leaves it out.
- `legend: experience · content/experience.yml (years pending) · filmography.yml` → experience.entries[].from/to/title/summary; filmography.services, filmography.credits
- `legend: blog, journal · journal = tag film · reading time computed` → blog.tags includes 'film'; reading time → no field **(no schema field)** — The blog schema has no readingTime or minRead field. The two live posts carry minRead: 8 and minRead: 6, which the new schema drops.
- `legend: testimonials · carousel when more than 3` → testimonials.entries[] (count > 3 → Testimonials/Carousel)
- `legend: faq · one list per mode` → faq.entries[].mode (enum dev|film|both, default both)
- `legend: about, cv · content/about.md · public/cv-victor-garces.pdf · portrait.avif` → about.portrait (image{src,alt}), about.cv (default '/cv-victor-garces.pdf') — public/ has no CV file yet
- `legend: 3D · public/models/page-exploded.glb (dev) · frames + moon in TresJS (film)` → static asset public/models/page-exploded.glb + page-exploded.png fallback — Not a content field. Neither file exists yet.
- `'header shows 3 of [N]'` → count of the projects collection (derived) — [N] has to be computed, not seeded as literal text

**Final copy:** "Enter", "Enter as Developer", "Enter as Filmmaker"

**Bracketed samples:** [N] (in '3 of [N]')

**Colors not in tokens:** none. All hexes/rgba match tokens.css (#E6F1EC is called 'tint' here and --raised in tokens.css). The sheet's own panel radius 20px and swatch radius 8px are not tokens, but they only style the sheet.

**Fonts:** Albert Sans 700 26px (title), 13px notes, 12px, Source Code Pro 8/10/11/12px, Newsreader ital 500 + upright 400 loaded in the <link> but unused in this file

**Links/routes:**
- No hrefs other than the Google Fonts CSS link
- 'links to /work' (Work note) → NOT defined in PAGES.md. The route is /dev/work (COMPONENTS.md: Work/MoreTile links to /dev/work)
- 'linking to the About page' → /dev/about (defined)
- public/cv-victor-garces.pdf (static file, not present in public/ yet)
- public/models/page-exploded.glb (static file, not present yet)

## handoff/design/F-Landing.dc.html (both)
First-visit split page at route '/' (PAGES.md title 'Víctor Garcés · Developer and Filmmaker'), 1440x900. Two side cards and one centered Enter button. The script only defines two unused editor props, devAccent (#1F7A63) and filmAccent (#E2A15B). No markup reads them and no hover or selection state is coded, so all behaviour lives in the prose annotations. The file has no U+2014 or U+2013 characters and no {{accent}} token.

**Sections:**
- Header: h84, pad 0 64, space-between. Brand is a <span>, not a link: 'Víctor Garcés' Albert Sans 700 18px ls -0.01em. LangSwitch <a href=#lang aria-label='Switch language to Spanish'>: 'EN / ES', mono 12px #5F6266, pad 10/14, 1px #E2E1DB, r999, bg #FFFFFF. No ModeToggle, no nav, no footer on this page
- Split grid: 2 x minmax(0,1fr), gap 24, pad 0 40 40 40 (not the 64 gutter), flex-grow fills the viewport height below the header
- Day card, <a> → F-Home-Dev (/dev): pad 48, bg #FFFFFF, 1px #E2E1DB, r32, column space-between. Top row: eyebrow 'DAY · DEVELOPER' mono 12 #1F7A63 ls .06em + 'vue · nuxt · .net · aws' mono 12 muted. Middle (gap 20): inline SVG 220x180 of exploded page layers (stroke #1F7A63 1.5, fills #E6F1EC/#FFFFFF/#E2E1DB, accent rects at .5/.3 opacity, aria-label 'Exploded page layers, the Developer object'); h2 'I build software.' Albert Sans 700 56/1 -0.03em; lead 18/1.55 muted, max-w 440. Bottom: mono 12 muted caption
- Night card, <a> → F-Home-Film (/film): pad 48, bg #121010, no border, r32, text #F1EBE3. Top row: 'NIGHT · FILMMAKER' mono 12 #E2A15B ls .06em + 'short films · photography · reels' mono 12 #A69C91. Middle: media box 320x134, r18, bg #1C1817, 1.5px dashed rgba(226,161,91,.5), sample SVG, chip (9px, pad 3/7, gold bg) 'placeholder · media/preview.mp4', caption bottom-left 14/12 mono 10 #A69C91 ls .06 'MUTED LOOP · ¿POR QUÉ NO?'. h2 'I shoot stories.' Newsreader italic 500 64/1 -0.02em; lead 18/1.55 #A69C91 max-w 440. Bottom: caption
- Center overlay: absolute left/top 50%, translate(-50%,-50%), column gap 12, straddling both cards across the 24px gap. Enter <a> → /dev: h64, pad 0 32, gap 12, bg #151617, text #F7F7F4, r999, Albert Sans 700 18, shadow 0 16px 40px rgba(21,22,23,.28) (= --shadow-float), arrow SVG 18x18 path 'M3 9h12M10 4l5 5-5 5' stroke 2 round. Helper pill below: mono 11 #5F6266, bg #F7F7F4, pad 6/12, r999
- States (F-Sistema): default black 'Enter' → /dev; hover or tap the day card → teal 'Enter as Developer'; night card → gold 'Enter as Filmmaker' → /film; 200 ms recolor; click stores mode, runs the circle transition, navigates (DESIGN.md Motion, COMPONENTS Landing/EnterButton)

**Nav:** none: the header has only the brand and 'EN / ES'

**Placeholders:**
- `media/preview.mp4` → films entry (featured, lowest order?) .preview.id → content/media/manifest.json videos[id].preview (fallback videos[id].poster) — films.preview is mediaRef.optional() and manifest videos.*.preview exists. Nothing says which film feeds the landing. The chip string is not in the DESIGN.md legend, which has 'preview.mp4' and 'media manifest'. No rule for reduced motion or the no-preview case.
- `(inside the same dashed box) 'MUTED LOOP · ¿POR QUÉ NO?'` → prefix 'MUTED LOOP ·' = i18n string; title = films.title or manifest.videos[id].title, uppercased — Do not hard-code the film title. It sits inside the placeholder.

**Final copy:** "Víctor Garcés (brand)", "EN / ES", "Switch language to Spanish (aria-label)", "DAY · DEVELOPER", "vue · nuxt · .net · aws", "Exploded page layers, the Developer object (svg aria-label)", "I build software.", "Local-first tools, .NET backends and serverless pipelines. Case studies, code and a blog.", "Hover this card and the Enter button turns teal (annotation-like, see issues)", "NIGHT · FILMMAKER", "short films · photography · reels", "MUTED LOOP · ¿POR QUÉ NO?", "I shoot stories.", "Short films and event photography from Santo Domingo. The reel, the stills, the journal.", "Hover this card and the Enter button turns gold (annotation-like)", "Enter", "Enter as Developer", "Enter as Filmmaker", "one button · opens the side you last hovered · Developer by default · remembered next time (annotation-like helper pill)", "Page title (PAGES.md): Víctor Garcés · Developer and Filmmaker"

**Colors not in tokens:** #6A2A24 (opacity .6) in the night-card placeholder SVG, left half; #25314F (opacity .6) in the same SVG, right half; #0B0908 ellipse silhouette in the same SVG. All three are sample imagery inside the placeholder and are replaced by the preview video.; Everything else maps to tokens: #151617/#F7F7F4 Enter = day --text/--bg (or --dark/--dark-text); rgba(21,22,23,.28) = --shadow-float; rgba(226,161,91,.5) = night --ph. The page needs day AND night tokens at the same time (see issues).

**Fonts:** Albert Sans 700 18px (brand, Enter), 700 56px (day h2), 400 18px (leads), Newsreader italic 500 64px, ls -0.02em (night h2), Source Code Pro 9/10/11/12px

**Links/routes:**
- #lang → LangSwitch, should be switchLocalePath('es') = /es. Defined: PAGES.md says every route exists under /es
- Day card href 'F-Home-Dev.dc.html' → /dev (defined), /es/dev
- Night card href 'F-Home-Film.dc.html' → /film (defined), /es/film
- Enter href 'F-Home-Dev.dc.html' → /dev by default, /film when the night card is the active side (defined)
- No links to /privacy, /terms, /cookies (no footer)

## handoff/design/S-Favicon.dc.html (both)
Favicon set sheet (1200x440): one 'V' glyph in day and night colors at 512 (PWA), 180 (apple), 32, 16 and 'svg · any'. Note: 'one V, accent follows prefers-color-scheme via SVG media query · PNG fallbacks in day colors · manifest.webmanifest theme_color per mode'. Empty script. No U+2014 and no {{...}} tokens.

**Sections:**
- Header row: 'Favicon set' Albert Sans 700 20px + mono 11px #5F6266 spec note
- 2-col grid, gap 16. Day panel: pad 28, bg #F7F7F4, r22, 1px #E2E1DB, eyebrow 'FAVICON · DAY' mono 12 ls .06. Previews (gap 20, align bottom): 512 · PWA (drawn 128px, rect rx 18 of 64), 180 · apple (90px, rx 16), 32 (48px, rx 12), 16 (32px, rx 8), svg · any (48px, rx 12). Glyph path 'M14 16 L32 50 L50 16', stroke-width 10, round cap and join, fill none, stroke #1F7A63 on a #F7F7F4 tile
- Night panel: bg #121010, 1px #2C2624, r22, eyebrow 'FAVICON · NIGHT' #A69C91. Same five previews with a #121010 tile and #E2A15B stroke, although the note says PNG fallbacks are day colors only

**Placeholders:**


**Final copy:** 

**Colors not in tokens:** none (#F7F7F4, #1F7A63, #121010, #E2A15B, #E2E1DB, #2C2624, #5F6266, #A69C91 are all tokens)

**Fonts:** Albert Sans 700 20px (sheet title only), Source Code Pro 10/11/12px (labels only). The icon itself has no text.

**Links/routes:**
- Implied static files: favicon.svg, PNG 16/32/180/512, manifest.webmanifest (PLAN.md M6). PNG and apple-touch filenames are not given in PAGES.md or anywhere else
- Existing public/favicon.ico, linked from app/app.vue:21 as { rel: 'icon', href: '/favicon.ico' }. Not addressed by the artboard

## handoff/design/S-OG-Dev.dc.html (day)
Day Open Graph template (1200x630) for nuxt-og-image, 'OgDay' in PAGES.md. Annotation: 'nuxt-og-image · 1200×630 · template per mode · title and mode from route meta'. Empty script. No U+2014 and no {{...}} tokens.

**Sections:**
- Canvas 1200x630, bg #F7F7F4, text #151617
- Grid minmax(0,1fr) 360px, gap 40, align-items center, pad 64 72. Left column gap 20: eyebrow 'DEVELOPER · SANTO DOMINGO, DO' mono 12 #1F7A63 ls .06em; name 'Víctor Garcés' Albert Sans 700 64/1 -0.02em; paragraph 22/1.55 #5F6266; 'victorgarces.me' mono 16 #5F6266 mt 12
- Right: SVG 360x360, exploded page translated (60,40): nav bar 200x18 rx9 #1F7A63; hero 200x70 rx14 #FFFFFF with 2px #1F7A63 stroke; 3 cards 60x50 rx10 #E6F1EC with accent stroke; footer block 200x60 rx12 #151617
- Annotation absolute right 20 bottom 16, mono 10 #5F6266 (not part of the image)

**Placeholders:**
- `(no chip drawn) 'Víctor Garcés' 64px line` → defineOgImageComponent('OgDay', { title }) from useSeo({ title }). Could be the page title or always the name. — The artboard shows a fixed name. PAGES.md passes { title, subtitle }. The mapping is ambiguous (see issues).
- `(no chip drawn) lead paragraph` → props.subtitle ← page description (blog.description, projects.oneLiner, i18n)
- `(no chip drawn) eyebrow 'DEVELOPER · SANTO DOMINGO, DO'` → no prop defined. Could be i18n plus contact.city **(no schema field)** — PAGES.md only defines { title, subtitle }

**Final copy:** "DEVELOPER · SANTO DOMINGO, DO", "Víctor Garcés", "Vue, Nuxt, .NET and AWS. Case studies, code and a blog.", "victorgarces.me"

**Colors not in tokens:** none (#F7F7F4, #151617, #1F7A63, #5F6266, #FFFFFF, #E6F1EC)

**Fonts:** Albert Sans 700 64px (name), 400 22px (lead), Source Code Pro 12px (eyebrow), 16px (domain), 10px (annotation)

**Links/routes:**
- 'victorgarces.me' is display text and matches SITE_URL in app/utils/site.ts. No hrefs.
- Rendered per route by nuxt-og-image (PAGES.md: defineOgImageComponent('OgDay' | 'OgNight', { title, subtitle }), fonts from public/fonts, which does not exist)

## handoff/design/S-OG-Film.dc.html (night)
Night Open Graph template (1200x630), 'OgNight'. Same grid as OG-Dev with a moon-glow and film-frame illustration. Empty script. No U+2014 and no {{...}} tokens.

**Sections:**
- Canvas 1200x630, bg #121010, text #F1EBE3
- Grid 1fr 360px, gap 40, center, pad 64 72. Left column gap 20: eyebrow 'FILMMAKER · @VGFILMX' mono 12 #E2A15B ls .06em; name 'Víctor Garcés' Newsreader italic 500 64/1, no tracking; paragraph 22/1.55 Albert Sans #A69C91; 'victorgarces.me' mono 16 #A69C91 mt 12
- Right: SVG 360x360. Glow circles at (250,90), r90 #E2A15B op .14 and r34 op .25. Frame 280x118 rx16 #1C1817 with halves #6A2A24/#25314F op .5 and a #0B0908 silhouette ellipse. Lower card 220x70 rx14 #262120
- Annotation bottom-right mono 10 #A69C91 (not part of the image)

**Placeholders:**
- `(no chip drawn) 'Víctor Garcés'` → OgNight props.title (page or film title?) — Same ambiguity as OG-Dev
- `(no chip drawn) lead paragraph` → props.subtitle ← films.synopsis / description
- `(no chip drawn) '@VGFILMX' in eyebrow` → contact.socials[mode film].handle (Instagram) — The field exists but PAGES.md does not wire it, and the handle conflicts with the live site's Instagram (the personal account)
- `(no chip drawn) frame illustration` → static illustration, or the film poster from the manifest? **(no schema field)** — No slot for a real still, so film pages share a generic frame

**Final copy:** "FILMMAKER · @VGFILMX", "Víctor Garcés", "Short films and event photography from Santo Domingo.", "victorgarces.me"

**Colors not in tokens:** #6A2A24 (opacity .5) frame left half; #25314F (opacity .5) frame right half; #0B0908 silhouette ellipse. These three are not placeholders here: the illustration is drawn as final, so they would be shipped as hard-coded hex.

**Fonts:** Newsreader italic 500 64px (the OG renderer needs a static italic 500 instance), Albert Sans 400 22px, Source Code Pro 12/16/10px

**Links/routes:**
- 'victorgarces.me' display text only, no hrefs

## handoff/design/F-Home-Dev.dc.html (day)
Desktop (1440 px) Developer home, /dev (pages/dev/index.vue), day mode. Order: header, hero + 3D stage, featured work (3 cards + More tile), about teaser, experience timeline, latest 3 posts, 3 testimonials, FAQ, dark contact block, footer.

**Sections:**
- Header (L18-33): h84, pad 0 64, 3 groups space-between. Brand 'Víctor Garcés' Albert Sans 700 18px -0.01em links to / (F-Landing). Center: 'Day' mono 12 accent + 72x36 pill (surface, 1px border, 28px accent knob left:3 top:3) linking to /film + 'Night' mono 12 muted. Nav 14px/500 gap 28: 5 anchors + 'EN / ES' pill (mono 12 muted, pad 10 14, border, surface, r999)
- Hero (L35-74): h620, pad 48 64 40, grid minmax(0,1fr) 520px gap 48 center. Left gap 26: eyebrow mono 12 ACCENT ls .06em; h1 76/1/-0.03em max-w 760; lead 20/1.55 muted max-w 540; 2 pill buttons h54 pad 0 28 15/600 (accent+white / surface+border); CV note mono 11 muted. Right: 3D stage h480 r28 surface, dashed --ph, chip at 14/14, SVG 520x480 showing 5 layers EXPLODED (nav pill, hero card, 3 cards, dark code block, footer pill) + 2 mono-10 annotation lines at bottom
- Work #work (L76-120): pad 24 64 0 gap 24. Header: eyebrow 'SELECTED WORK · 3 OF [N]' mono 12 muted, h2 36/-0.02em, 'All projects' pill h44 pad 0 20 14/600 + arrow. Grid repeat(4,1fr) gap 20. ProjectCard <article> pad 16 surface border r22 min-h 470 gap 12: cover h170 r14 --raised + chip; meta row mono 12 muted (year[ · status] left, role/kind right); h3 22/700/-0.01em; one-liner 14/1.5 muted; 2 tag chips 12/500 pad 5 10 bg --bg r999 margin-top auto; links 14/600 accent gap 16. MoreTile: whole <a>, --raised r22 pad 16 min-h 470: 3 ghost cards h120 r14 surface+border (offsets 44/22/0, opacity .5/.75/1) with '[N] more' mono 11; eyebrow 'MORE WORK' accent; title 22/700; 14px muted line (designer annotation); 48px accent circle with arrow
- About #about (L122-134): margin 40 64 0, pad 32, surface, border, r28, grid 200px 1fr 260px gap 32 center. Portrait h196 r20 --raised + chip; eyebrow ABOUT; h2 32/-0.02em/1.1; p 15/1.5 muted max-w 620; 'More about me →' 14/600 accent; STACK eyebrow mono 11 + 7 chips (12/500 bg --bg r999)
- Experience #experience (L136-144): pad 40 64 0, grid 360px 1fr gap 48. Left: eyebrow, h2 36, chip. Right: 4 rows, grid 150px 24px 1fr gap 16, pad 18 0, border-bottom (none on last): year mono 12 muted; 12px dot (row1 filled accent; rows 2-3 2px accent ring; row4 2px #E2E1DB ring); title 17/600; summary 14 muted
- Blog #blog (L146-153): pad 40 64 0 gap 24. Header: eyebrow 'BLOG · LATEST 3', h2 36, 'All posts' pill. Grid 3 cols gap 24. Card = <a>, pad 24, surface, whole card dashed --ph, r22, min-h 250, gap 12, chip top-right: meta row (space-between, only [DATE]) mono 12; title 22/700/1.2; excerpt 14/1.5 muted; 'Read · [N] min' 14/600 accent margin-top auto
- Testimonials (L155-162): pad 40 64 0 gap 24. Header: eyebrow, h2 36, chip on right. Grid 3 cols gap 24. <figure> pad 28 r22 min-h 200 gap 16, dashed; card 1 --raised, 2-3 surface. Blockquote 17/1.5 with the quote marks added by the template. Figcaption: 40px avatar circle + name 14/600 + role 13 muted
- FAQ #faq (L164-172): pad 40 64 0, grid 360px 1fr gap 48. Left: eyebrow, h2 36, chip. Right: 4 items, gap 10, pad 20 24, surface, border, r18. <button aria-expanded> 17/600 + 16px chevron (up when open, down when closed). Answer 15/1.5 muted. Item 1 open
- Contact #contact (L174-184): margin 40 64 0, pad 36 40, --dark bg, --dark-text, r28, grid 1fr 420px gap 32. Eyebrow CONTACT --dark-muted; mailto email 40/700/-0.02em; links row 14/500 gap 20 --dark-muted (GitHub, LinkedIn, About me). Right: label 13 --dark-muted; pill input h48 pad 0 16 (border #3A3B40, bg #232428, 14px) + 'Send' button h48 pad 0 20 accent 14/600
- Footer (L186-189): h116, pad 0 64, 13px muted, space-between: copyright + Privacy/Terms/Cookies gap 24
- Script (L193-199): accent prop (default #1F7A63, options #1F7A63/#2E5BD6/#7A3F9A). renderVals returns {accent} but the markup never uses it. No state logic, so nothing in the script is interactive

**Nav:** Work · About · Experience · Blog · Contact · EN / ES

**Placeholders:**
- `3D placeholder · GLB from Claude Design · TresJS + GSAP ScrollTrigger` → public/models/page-exploded.glb (+ page-exploded.png fallback), per 3D.md — Asset contract, not a content field. Chip prefix '3D placeholder' differs from the 'placeholder · <source>' convention
- `CV: placeholder · public/cv-victor-garces.pdf (plain mono text, not a chip)` → about.cv (default '/cv-victor-garces.pdf') — The file does not exist in public/ yet
- `placeholder · cover.avif (Ada System, Sigmedic)` → projects.cover {src, alt}
- `placeholder · diagram.svg (Media pipeline)` → projects.cover.src (the schema has no diagram field) **(no schema field)** — DESIGN.md lists diagram.svg under the projects collection, but the schema has only cover. The implementer has to guess that it is cover.src
- `placeholder · portrait.avif` → about.portrait {src, alt} where mode='dev'
- `[Two lines from the current About section, verbatim. Placeholder · content/about.md]` → about.teaser — The 'current About section' is content/en/index.yml about.description. It is NOT content/about.yml, which is template leftover
- `placeholder · years and descriptions · content/experience.yml` → experience.entries[].from/to/title/org/summary/current — No rule defines how dot state or a single-year entry maps to the fields
- `placeholder · content/blog (x3)` → blog title, description (excerpt), date; link /blog/[slug]
- `'Read · [N] min' inside blog card` → blog.minRead (dropped) **(no schema field)** — The existing schema and posts have minRead. The new blog schema removed it
- `placeholder · content/testimonials.yml · carousel if more than 3` → testimonials.entries[] quote/name/role/avatar, filtered mode in [dev, both]
- `placeholder · questions and answers · content/faq.yml` → faq.entries[] q/a, mode dev|both — No category, order or show-on-home field. The current site has 11 FAQ entries, but the board shows 4
- `(unchipped) SELECTED WORK · 3 OF [N] / [N] more` → count(projects), featured + order
- `(unchipped) project meta 'creator' / 'full-stack' / 'infra' and '2026 · beta'` → projects.role or projects.kind; projects.year + status **(no schema field)** — 'creator' and 'full-stack' are not kind enum values, and 'infra' is not a role
- `(unchipped) STACK chips` → about.stack[{group, items}] flattened — The board shows a flat list of 7. Nothing says which groups or items appear
- `(unchipped) email, GitHub, LinkedIn` → contact.email, contact.socials (mode dev|both)
- `(unchipped) 'About me' link in the socials row` → none (contact.socials.href is z.string().url(), so '/dev/about' fails validation) **(no schema field)**
- `(unchipped) footer city 'Santo Domingo, DO'` → contact.city
- `(unchipped) hero eyebrow/h1/lead/CTA labels and section h2s` → none: no home/hero collection; must be i18n keys **(no schema field)**

**Final copy:** "Víctor Garcés", "Day", "Night", "aria: Switch to Filmmaker, night mode", "Work", "About", "Experience", "Blog", "Contact", "EN / ES", "aria: Switch language to Spanish", "DEVELOPER · DAY · SANTO DOMINGO, DO", "Thin, end to end. Then hardened.", "Front-end developer and Software Engineering student. Vue and Nuxt on the front, .NET on the back, AWS underneath.", "See the work", "Download CV", "aria: Exploded view of a web page: header, hero, cards and code layers separated in depth", "SELECTED WORK · 3 OF [N]", "Projects I keep coming back to", "All projects", "Ada System", "Local-first, multi-agent personal assistant with a pixel-art office and Spanish voice control.", "Sigmedic", "Personal health record for the Dominican Republic, with patient and doctor profiles.", "Media pipeline", "Serverless image and HLS pipeline on AWS that serves the Filmmaker side of this site.", "2026 / creator; 2026 · beta / full-stack; 2026 / infra", "tags: local-first, multi-agent, health records, .net, lambda, cdk", "Repo", "Live", "Case study", "aria: See all projects", "MORE WORK", "Client sites, experiments and older builds", "ABOUT", "Software Engineering student by night, freelance developer by day, filmmaker on weekends.", "More about me →", "STACK", "Vue, Nuxt, TypeScript, .NET, EF Core, AWS, SQLite", "EXPERIENCE", "Where I've worked and studied", "Freelance developer / Web apps and platforms for clients, Vue/Nuxt and .NET.", "Director of Communications & Marketing · La Voz Juvenil RD / Brand, content and team coordination for a youth leadership organization.", "Software Engineering · UNAPEC / Evening classes, Santo Domingo.", "Technical degree, Development and Administration of Computer Applications / Instituto Politécnico Francisco José Peynado.", "to now", "BLOG · LATEST 3", "Notes from building things", "All posts", "Read · [N] min", "TESTIMONIALS", "What people I've worked with say", "FAQ", "Questions I get before a project", "CONTACT", "hello@victorgarces.me", "GitHub", "LinkedIn", "About me", "Quick message", "What are you building? (input placeholder)", "Send", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies", "NOT copy (designer annotations in copy slots): 'Whole tile is a link to /work. Hover: the stack fans out and the arrow slides right.'; 'scroll 0 %: page assembled · 100 % of hero: layers exploded'; 'hover: tilts toward the cursor · reduced motion: static'; 'CV: placeholder · public/cv-victor-garces.pdf'; ' · Web3Forms + Turnstile' suffix on the label"

**Bracketed samples:** [N] (3 OF [N], [N] more), [screenshot · command center], [screenshot · patient profile], [s3 → lambda → cloudfront], [portrait], [Two lines from the current About section, verbatim. Placeholder · content/about.md], [YEAR] to now (x3), [YEAR], [DATE], [Existing post title 01..03], [Post excerpt, two lines.], Read · [N] min, [Testimonial 01..03 from the current site, verbatim.], [Name], [Role, company], [Existing FAQ question 01..04], [Answer from the current FAQ, verbatim.]

**Colors not in tokens:** #232428: quick-message input background in the contact block (L182); #3A3B40: quick-message input border (L182); #2E5BD6 and #7A3F9A: script accent prop options only (L193), never rendered; All other values map to tokens: #F7F7F4 --bg, #FFFFFF --surface, #E6F1EC --raised, #151617 --text/--dark, #5F6266 --muted, #1F7A63 --accent, #E2E1DB --border, #A5A7AE --dark-muted, rgba(31,122,99,0.55) --ph

**Fonts:** Albert Sans 400/500/600/700 (body and display), Source Code Pro 400/500 (eyebrows, meta, chips, toggle labels), Loaded via a Google Fonts <link> in the artboard; DESIGN.md requires @nuxt/fonts

**Links/routes:**
- Brand → F-Landing = / (defined; with a vg-mode cookie it paints the landing, then redirects)
- Mode toggle → F-Home-Film = /film (defined; sibling navigation per PAGES)
- Nav #work #about #experience #blog #contact → in-page anchors on /dev (PAGES/COMPONENTS define no targets; 'Experience' has no route)
- EN / ES #lang → /es/dev via i18n (defined by prefix_except_default)
- See the work #work → anchor
- Download CV #cv → /cv-victor-garces.pdf (static file, not in PAGES; missing from public/)
- All projects #work-page → /dev/work (defined)
- Case study #case → /dev/work/[slug] (defined)
- Repo #repo / Live #live → projects.links[].href (external)
- More tile #work-page → /dev/work (defined); its annotation text says '/work' (NOT defined)
- More about me → #about-page → /dev/about (defined)
- All posts #all-posts → /blog (defined, stored mode)
- Post cards #post-1..3 → /blog/[slug] (defined, stored mode)
- mailto:hello@victorgarces.me
- GitHub #github / LinkedIn #linkedin → contact.socials (external)
- About me #about-page → /dev/about (defined)
- Footer #privacy #terms #cookies → /privacy /terms /cookies (defined)

## handoff/design/M-Home-Dev.dc.html (day)
Mobile (390 px) Developer home, /dev below 768 px. Condensed single column: header with language and hamburger, hero with static PNG, 2 projects + more row, about card, 3 experience rows, 2 posts, 1 testimonial, 2 FAQ rows, contact card, footer, fixed bottom mode pill.

**Sections:**
- Header: h64, pad 0 20. Brand 17/700/-0.02em links to /. Right: 'EN' pill (mono 12 muted, pad 8 10, border, surface) + 44x44 round hamburger <button aria-label='Open menu'>. No nav and no mode toggle in the header
- Hero: pad 16 20 0, gap 14, DOM order eyebrow, h1, image, lead, buttons (image sits between h1 and lead, unlike desktop). Eyebrow 'DEVELOPER · DAY' mono 12 accent; h1 40/1.02/-0.02em; static image h190 r22 surface dashed + chip; lead 15/1.55 muted (shortened); 2 buttons h48 flex 1 gap 8 ('See the work' accent, 'CV' surface + border)
- Selected work: pad 24 20 0, gap 12. Row: h2 24 'Selected work' + 'All' 13/600 accent. 2 cards, each a whole <a href='#'>: pad 12, surface, border, r20, gap 8; cover h120 r14 --raised + chip; title 19/700; 13px muted short one-liner. Then a '[N] more projects →' row (pad 16 18, --raised, r16, 14/600, accent arrow)
- About: h2 'About'. Card grid 72px 1fr, gap 12, pad 14, surface, border, r18. Portrait 72px circle (r36) + chip. 13px muted line + 'More about me →' 13/600 accent
- Experience: h2. 3 rows (the degree row is dropped): grid 20px 1fr, gap 12, pad 10 0, border-bottom. 12px dot (first filled accent, others accent ring). Title 15/600, year mono 11 below. No summaries
- Blog: h2 'Blog' + 'All posts'. 2 cards <a>: pad 14 16, surface, dashed, r16, gap 4. '[DATE] · [tag]' mono 11 + title 16/700
- Testimonials: h2. 1 figure, pad 18, --raised, dashed, r18. Quote 15/1.5; caption 12 muted '[Name] · [Role] · swipe for more'
- FAQ: h2. 2 non-interactive <div> rows: pad 14 16, surface, border, r14, 15/600, '⌄' glyph muted. No answers shown
- Contact: margin 24 20 0, pad 20, --dark, r22, gap 6. Eyebrow CONTACT --dark-muted, mailto 19/700, 'Or use the form →' 13 --dark-muted. No quick form, no socials
- Footer: pad 20 20 96 20 (clears the pill), 11px muted, column gap 8: copyright + Privacy/Terms/Cookies gap 16
- MobileModePill: bottom pill (absolute in the artboard; COMPONENTS says fixed), left/right/bottom 20, h58, pad 0 20, surface, border, r999, shadow 0 10px 30px rgba(0,0,0,.25). 'Day · Developer' mono 12 accent; 64x32 toggle (bg --bg, border, 24px accent knob at left) → /film, aria 'Switch mode'; 'Night' mono 12 muted
- Script: empty renderVals, no props or state

**Nav:** EN · Open menu (hamburger, contents undefined)

**Placeholders:**
- `placeholder · page-exploded.png` → public/models/page-exploded.png (3D.md fallback) — Missing from the DESIGN.md placeholder legend. The text says 'exploded page', but 3D.md says the PNG is an assembled render
- `placeholder · cover (x2)` → projects.cover
- `(unchipped) short one-liners 'Local-first, multi-agent assistant.' / 'Personal health record for the DR.'` → none (projects has only oneLiner) **(no schema field)**
- `placeholder · portrait` → about.portrait
- `(unchipped) 'Student by night, developer by day, filmmaker on weekends.'` → none (about has headline and teaser only; this is a shortened headline) **(no schema field)**
- `(dashed, no chip) blog cards '[DATE] · [tag]'` → blog.date + blog.tags[0] + title
- `(dashed, no chip) testimonial` → testimonials.entries[0] quote/name/role
- `(unchipped) '[N] more projects'` → count(projects) minus shown (2 here, 3 on desktop)
- `(unchipped) experience title 'Communications & Marketing · La Voz Juvenil RD'` → experience title/org (desktop title starts 'Director of...'; no short field) **(no schema field)**

**Final copy:** "Víctor Garcés", "EN", "aria: Switch language to Spanish", "aria: Open menu", "DEVELOPER · DAY", "Thin, end to end. Then hardened.", "Vue and Nuxt on the front, .NET on the back, AWS underneath.", "See the work", "CV", "Selected work", "All", "Ada System", "Local-first, multi-agent assistant.", "Sigmedic", "Personal health record for the DR.", "more projects →", "About", "Student by night, developer by day, filmmaker on weekends.", "More about me →", "Experience", "Freelance developer", "Communications & Marketing · La Voz Juvenil RD", "Software Engineering · UNAPEC", "to now", "Blog", "All posts", "Testimonials", "swipe for more", "FAQ", "CONTACT", "hello@victorgarces.me", "Or use the form →", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies", "Day · Developer", "aria: Switch mode", "Night"

**Bracketed samples:** [static render of the exploded page · no 3D on phones], [N] more projects, [YEAR] to now (x3), [DATE] · [tag], [Existing post title 01], [Existing post title 02], [Testimonial 01, verbatim.], [Name] · [Role] · swipe for more, [FAQ question 01], [FAQ question 02]

**Colors not in tokens:** box-shadow 0 10px 30px rgba(0,0,0,0.25) on the mobile mode pill. DESIGN.md assigns the pill 0 20px 50px rgba(0,0,0,.25) (= --shadow-banner), and tokens.css has no pill shadow; Radii 16px (more row, blog cards), 20px (project cards), 36px (portrait circle) are not in the token set; All other colors map to tokens

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500, Glyphs '⌄' (U+2304) and '→' come from the text font; Albert Sans may not include U+2304

**Links/routes:**
- Brand → F-Landing = / (defined)
- EN #lang → /es/dev (defined via i18n)
- Open menu → no target; no open state is designed anywhere
- See the work #work → anchor (the mobile work section has no id in the artboard)
- CV #cv → /cv-victor-garces.pdf (file missing)
- All → D-Work = /dev/work (defined)
- Project cards href='#' → presumably /dev/work/[slug] (not specified)
- [N] more projects → D-Work = /dev/work (defined)
- More about me → D-About = /dev/about (defined)
- All posts → D-Blog = /blog (defined, stored mode)
- Post cards → D-Post = /blog/[slug] (defined, stored mode)
- mailto:hello@victorgarces.me
- Or use the form → D-Contact = /contact (defined; no ?topic= specified)
- Privacy / Terms → S-Legal = /privacy, /terms (defined)
- Cookies → S-Cookies = /cookies (defined)
- Mode pill → F-Home-Film = /film (defined)

## handoff/design/F-Home-Film.dc.html (night)
Desktop (1440x3960) Filmmaker home at /film (pages/film/index.vue), forced night mode.

**Sections:**
- Header 84px, padding 0 64. Brand is Newsreader italic 500 22px and links to F-Landing. Toggle group (gap 12): 'Day' in mono 12 muted, then a 72x36 track (surface, 1px border) with a 28px accent knob at right:3 top:3, then 'Night' in mono 12 accent. The toggle is an <a> to F-Home-Dev. Nav: gap 28, 14px/500, plus an 'EN / ES' pill (mono 12, padding 10 14, border, r999).
- Hero 620px, overflow hidden. SVG accent glows at (1100,160): r260 op .09 and r90 op .12. Three 2.39:1 frames: 620x260 rx18 at (700,100), 440x184 rx16 at (860,310) op .8, 320x134 rx14 at (980,450) op .6. Captions in mono 11. Chip top-right at 24/64. Copy block at left 64, top 72, gap 22, max 600: eyebrow in mono 12 accent; h1 88px, lh .98, -0.02em; lead 19px/1.55 muted, max 520. Buttons 54h, padding 0 28, r999, 15/600: accent 'Watch the reel' with play icon, and a surface+border 'All films'. Annotation text sits bottom-left.
- Now showing (#work): 560px, padding 40 64 0, gap 20. Header: eyebrow + h2 42px on the left, chip on the right. Grid 2fr/1fr, gap 20. Player: 440h, r22, dashed ph, 72px accent play disc, control bar in mono 11 (00:00, 3px track #3A302B with 18% accent fill, 06:04, CC, 1080p). Credits card: padding 28, surface, border, r22. It holds: meta in mono 11 accent; h3 44px lh1; synopsis 15/1.55 muted; credits grid 90px/1fr, gap 6 12, 13px; two 46h r999 14/600 buttons, 'Film page' (accent) and 'Vertical cut' (outline).
- Stills (#photo): 460px, padding 40 0 0. Header (padding 0 64): eyebrow + h2 42px; on the right, a chip and an 'All photography' 44h pill with arrow. Strip: gap 14, align flex-end, padding-left 64, bleeds off the right edge, 300h, dashed r18 tiles: 300x300 (01 2:3), 420x240 (02 16:9), 220x270 (03 4:5), 360x300 (04 6:5), 300x220 (05 3:2), then a '+19' tile 200x300 in raised at op .6 (not a link).
- More row (#more): 340px, padding 40 64 0, 3 x 1fr, gap 20. Cards: padding 16, surface, border, r22, 150h media r14 dashed. (1) Reel card: 52px accent play button, title Newsreader 26, meta 13 muted. (2) Second featured film. (3) More tile: raised background, no border; 3 ghost cards r14 offset left 44/22/0, top 0/20/40, op .5/.75/1, '[N] more' on the front card; eyebrow 'MORE WORK' in mono 11 accent; title 26; 44px accent arrow disc.
- Credits (#filmography): 420px, padding 40 64 0, gap 20. Header: eyebrow + h2 'Credits' on the left, 4 service pills on the right (13/500, padding 10 16, surface, border, r999). Chip. Rows: grid 100px/1fr/260px/120px, gap 16, padding 14 0, border-bottom (none on the last row), baseline aligned. Year in mono 12 (accent on the newest row, muted otherwise), title Newsreader 24, role 14 muted, note 13 muted right-aligned. 4 rows.
- Testimonial (#testimonials): margin 40 64 0, padding 40 64, fixed 300h, surface, border, r28, centered, gap 18. Chip top-left 20. Eyebrow. Blockquote Newsreader italic 400, 32/1.3, max 900. Attribution 14 muted. Dots: active 24x4 accent, inactive 8x4 #3A302B. Prev/next buttons are 44px circles (bg --bg, border) at left/right 20, vertically centered.
- Journal + About (#journal): 400px, padding 40 64 0, grid 1fr/420px, gap 20. Left column, gap 14: eyebrow + h2 36px, 'All entries ->' (accent 14/600). Two post cards: grid 200px/1fr, gap 16, padding 12, surface, dashed ph, r20; cover 110h r14; meta mono 11; title Newsreader 24/1.15; excerpt 13/1.5. Right column, About card (#about): padding 24, surface, border, r22. It holds: a 96px round dashed portrait; 'ABOUT' eyebrow in mono 11; headline Newsreader 24/1.15; teaser 14/1.5 muted; kit chips (12/500, padding 5 10, raised, r999); accent link.
- FAQ (#faq): 360px, padding 40 64 0, gap 16. Row with h2 36px and chip. Grid 2 x 1fr, gap 10. Items: padding 18 22, surface, border, r18. Question button 16/600 Albert Sans with a chevron (up when open). The first item is open (aria-expanded=true) with its answer at 14/1.5 muted.
- Book a shoot (#contact): margin 40 64 0, padding 32 40, 220h, surface, border, r28, grid 1fr/560px, gap 32. Left: eyebrow; mailto in Newsreader 40; socials 14/500 muted, gap 20; annotation 'Web3Forms + Turnstile'. Right: form grid 2 cols, gap 8, with inputs Date and Place, then 'What happens' spanning 2. Inputs are 46h, r999, bg --bg, border, 14px. Submit spans 2, 46h, accent, 14/600.
- Footer: 116px, padding 0 64, 13px muted, space-between; links gap 24.

**Nav:** Films -> #work · Photography -> #photo · Journal -> #journal · About -> #about · Contact -> #contact · EN / ES -> #lang

**Placeholders:**
- `3D placeholder · moon + floating frames · TresJS · stills from the media manifest` → films(featured).stills[0..2].id -> manifest.photos; films.preview -> manifest.videos[].preview for the front plane — Frame 2 caption reads 'EVENT SERIES · 14/24', an event photo, but 3D.md says all three planes come from the featured film
- `(SVG frame captions) '¿POR QUÉ NO? · 00:42', 'EVENT SERIES · 14/24'` → none: still timecode and series index **(no schema field)** — mediaRef has only {id, alt}; manifest photos has no timecode or caption
- `placeholder · featured: true in content/films · HLS from the media manifest` → films where featured (lowest order): title, kind, year, runtime, synopsis, credits[], camera, video.id -> manifest.videos[].hls/poster/duration
- `placeholder · own player, Media Chrome + HLS` → Media/FilmPlayer id=films.video.id: manifest.videos duration (06:04 = 364 s), captions (CC), renditions (1080p), poster — films.poster (mediaRef) and manifest.videos[].poster are two sources for the poster
- `(credits card row) 'Also as: 3-minute vertical cut for Reels'` → films.credits[{role:'Also as'}] or films.vertical + manifest duration — Only works if written as a generic credits row; films.vertical is a mediaRef with no description. 'Camera' could come from either films.camera or credits
- `placeholder · media manifest · series events-2025` → manifest.series['events-2025'].photos -> manifest.photos (width/height for aspect, alt, blurhash) — No content field selects which series the home page shows. The '+19' count and 'Twenty-four' must be derived.
- `placeholder · reel poster` → films(kind='reel').poster -> manifest; title 'Reel 2026', runtime '1 min 30'
- `placeholder · content/films, second featured` → films featured, order 2: poster, title '[Project or client video]', kind+year '[Format · year]' — The CONTENT.md seed marks only por-que-no as featured, so this slot renders empty
- `(More tile) '[N] more'` → count(films) minus the films shown
- `placeholder · content/filmography.yml · one line per credit, newest first` → filmography.credits[] year/title/role/note; pills = filmography.services — year is a free string ('2025 to now', '[YEAR]'), so 'newest first' cannot be sorted; keep file order
- `placeholder · content/testimonials.yml · one at a time, auto-advance 8 s` → testimonials.entries where mode in (film, both): quote, name, role ('[Event or project]')
- `(journal meta) '[DATE] · on set · content/blog, tag film'` → blog where tags includes 'film': date, title, description; the category label 'on set'/'writing' has no field **(no schema field)** — The blog schema has only title, description, date, tags, cover and draft
- `placeholder · cover (journal cards)` → blog.cover (image, optional) — No fallback specified for posts without a cover
- `placeholder portrait` → about(mode film).portrait (portrait-film.avif)
- `[... Placeholder · content/about.md]` → about(mode film).teaser — The chip names about.md, but the film version is about-film.md per CONTENT.md
- `(kit chips) Sony a7III, [lens], [light], [edit + color app]` → about(film).kit[].value — kit is {label,value}; the chips show a single string
- `placeholder · content/faq.yml, film list` → faq.entries where mode=film: q, a
- `(unoutlined) email, Instagram, YouTube, form fields, footer city` → contact.email, contact.socials(mode film/both), contact.topics[id=film].fields, contact.city — socials.href must be z.string().url(), so a placeholder YouTube URL fails validation

**Final copy:** "Víctor Garcés", "Day", "Night", "Films", "Photography", "Journal", "About", "Contact", "EN / ES", "aria: Switch to Developer, day mode", "aria: Switch language to Spanish", "FILMMAKER · NIGHT · @VGFILMX", "Stories that fit in six minutes.", "Short films and event photography from Santo Domingo. Small crews, one camera, a lot of natural light.", "Watch the reel", "All films", "aria: Night stage with a soft moon glow and floating frames", "NOW SHOWING", "One film at a time", "SHORT FILM · 2026 · 6 MIN", "¿Por qué no?", "One actress, two inner voices: ambition on one side, enjoyment on the other, in a room lit in red and blue.", "Written by / Directed by / Cast / Camera / Also as", "Víctor Garcés", "Sony a7III", "3-minute vertical cut for Reels", "00:00 / 06:04 / CC / 1080p", "Film page", "Vertical cut", "STILLS · EVENT PHOTOGRAPHY · 2025 TO 2026", "Twenty-four frames, scroll sideways", "All photography", "+19", "Reel 2026", "Showreel · 1 min 30", "aria: Open the 2026 reel", "aria: Open project", "aria: See all films and series", "MORE WORK", "Older shorts and client videos", "SERVICES & FILMOGRAPHY", "Credits", "Short films", "Event photography", "Vertical reels", "Color and edit", "2026 | ¿Por qué no? | Writer, director · short film, 6 min | + vertical cut", "2025 to now | Event photography | Photographer · conferences, launches, community events | Santo Domingo", "FROM PEOPLE IN FRONT OF THE CAMERA", "aria: Previous testimonial / Next testimonial", "JOURNAL", "Behind the scenes", "All entries →", "ABOUT", "Writer, director and the person holding the camera, most of the time.", "More about me and the gear →", "Before you book", "BOOK A SHOOT", "hello@victorgarces.me", "Instagram", "YouTube", "Date", "Place", "What happens", "Send the request", "© 2026 Víctor Garcés · Santo Domingo, DO · All films and photographs are original work", "Privacy", "Terms", "Cookies", "NOT COPY (annotations): '3D: the sun of the day mode becomes the moon: same sphere, now a light source behind floating frames, parallax on cursor', 'Web3Forms + Turnstile', 'still 0N · ratio'"

**Bracketed samples:** [Actress], [Project or client video], [Format · year], [N] more, [YEAR], [Title], [Role · format], [note], "[Testimonial from an event or film client, verbatim, two lines at most.]", [Name] · [Event or project], [DATE] · on set / [DATE] · writing, [Blog post tagged film, title 01], [Blog post tagged film, title 02], [One-line excerpt.], [Two lines from the current About section, film version. Placeholder · content/about.md], [lens], [light], [edit + color app], [FAQ question 01] to [FAQ question 04], [Answer, verbatim.]

**Colors not in tokens:** #3A302B: real UI (player progress track line 69, inactive testimonial dots line 149, '+19' tile line 104), plus sample fills (hero back frame line 43, still 01 line 99, post-1 cover line 157); #D9CBB9: tile label text (lines 99, 101, 157); #6A2A24: sample image stand-in (hero frame line 41, player line 67, still 04 line 102, post-2 cover line 158); #25314F: sample stand-in (lines 41, 67); #0B0908: silhouette ellipse (lines 41, 67); #4A3A2E: still 03 tile (line 101); #E86A6A, #7FB8A4: data-props accent options only (line 199)

**Fonts:** Albert Sans 400/500/600/700 (body, buttons, FAQ questions, inputs), Newsreader italic 500 (brand, h1-h3, card titles, email); testimonial blockquote uses italic 400 (line 147), a weight the Google Fonts link does not load (only 1,6..72,500), Source Code Pro 400/500 (eyebrows, meta, chips, toggle labels, player time)

**Links/routes:**
- F-Landing.dc.html (brand) -> / : defined, but / client-redirects to /dev or /film when the vg-mode cookie exists
- F-Home-Dev.dc.html (toggle <a>) -> /dev : defined
- #work (nav Films, and hero 'All films') -> in-page anchor to Now showing; if the intent is /film/films, that route is defined
- #photo -> in-page; /film/photography defined
- #journal -> in-page; /film/journal defined
- #about -> in-page About card; /film/about defined
- #contact -> in-page; /contact defined (stored mode; ?topic=film)
- #lang -> /es/film via i18n prefix : defined
- #reel (Watch the reel, and the Reel card) -> NOT defined: no reel section on the page and no reel route (only possible via /film/films/reel-2026)
- #film-page -> /film/films/por-que-no : defined via [slug]
- #vertical -> NOT defined (no route or anchor)
- #photo-page -> /film/photography : defined
- #project -> /film/films/[slug] : defined
- #films-page (More tile) -> /film/films : defined
- #all-posts -> /film/journal : defined
- #post-1, #post-2 -> /blog/[slug] : defined (stored mode)
- #about-page -> /film/about : defined
- mailto:hello@victorgarces.me
- #instagram, #youtube -> external, from contact.socials
- #privacy, #terms, #cookies -> /privacy, /terms, /cookies : defined

## handoff/design/M-Home-Film.dc.html (night)
Mobile (390x1780) Filmmaker home at /film, forced night mode.

**Sections:**
- Header 64px, padding 0 20. Brand Newsreader 21px. Right side, gap 8: 'EN' pill (mono 12, padding 8 10, surface, border) and a 44x44 round menu button with a hamburger icon.
- Hero 380h. SVG glows at (320,60): r150 op .09 and r50 op .12. Frames 240x100 rx16 at (150,40) and 180x76 rx14 at (210,160) op .8. No 3D chip. Copy pinned bottom 16, left/right 20, gap 12: eyebrow mono 12 accent; h1 44/1.02; lead 15/1.55 muted; full-width 48h accent CTA (no icon, no second button).
- Now showing: padding 24 20 0, gap 12, h2 28. The whole card is an <a> to N-Film: padding 12, surface, border, r20. Player area 196h, r14, dashed, with a chip. Title Newsreader 28; meta 13 muted.
- Stills: h2 28 + 'All' (accent 13/600). Strip gap 10: tiles 160h, r14, widths 120/200/120, dashed, each with a chip. Caption mono 10 'swipe · 24 frames'.
- More work: h2 28. Reel card (padding 12, r20, 110h media r14 with chip, title Newsreader 19, meta 13), href '#'. Then a '[N] more films ->' row (padding 16 18, raised, r16, 14/600). No second featured card.
- Credits: h2 28. Rows grid 70px/1fr, gap 10, padding 10 0, border-bottom. Year mono 11 (accent on the first row); title Newsreader 20. Only 3 rows; no services pills, role or note.
- Testimonial: margin 24 20 0, padding 22, surface, border, r20, centered. Blockquote Newsreader italic 20/1.3; attribution 12 muted with '1 of 3'. No eyebrow, controls or dots.
- Journal: h2 28 + 'All'. Two cards: grid 80px/1fr, gap 12, padding 10, dashed, r16; thumb 60h r10; meta mono 11; title Newsreader 17/1.2.
- Book a shoot: margin 24 20 0, padding 20, surface, border, r22, gap 6. Eyebrow; mailto Newsreader 22; link 13 muted to D-Contact. No inline form.
- Footer: padding 20 20 96 (clears the pill), 11px muted, gap 8. Links gap 16. The night-only line is missing.
- Mode pill: absolute, left/right/bottom 20, 58h, padding 0 20, surface, border, r999, shadow 0 10px 30px rgba(0,0,0,.25). Contents: 'Day · Developer' (mono 12 muted), a 64x32 toggle (track --bg, 24px accent knob at right) as an <a> to F-Home-Dev with aria-label 'Switch mode', and 'Night' (mono 12 accent).
- ABSENT vs desktop: About teaser card, FAQ, second featured film, services pills, testimonial controls, the inline booking form, and the footer night line.

**Nav:** EN (#lang) · Open menu (hamburger button, no menu designed) · Mode pill: Day · Developer / Night

**Placeholders:**
- `placeholder · media manifest (Now showing player '[16:9 · own player]')` → films(featured).video.id -> manifest.videos poster/hls — The player sits inside an <a> to the film page (nested interactive controls)
- `placeholder · manifest (stills 01-03)` → manifest.series[...].photos -> manifest.photos — The series is not named here; the caption 'swipe · 24 frames' hard-codes the count
- `placeholder · cover (Reel card)` → films(kind reel).poster -> manifest — The desktop chip calls the same thing 'reel poster'
- `(dashed, no chip) journal cards '[DATE] · on set'` → blog tag film: date, title, cover; the 'on set' label has no field **(no schema field)**
- `(no chip) credits rows '2025+'` → filmography.credits[].year — The same entry reads '2025 to now' on desktop; the schema has one year field
- `(no chip) testimonial '[Name] · [Event] · 1 of 3'` → testimonials(film/both) name, role; the count is derived
- `(no chip) '[N] more films'` → count(films)

**Final copy:** "Víctor Garcés", "EN", "aria: Switch language to Spanish", "aria: Open menu", "FILMMAKER · NIGHT", "Stories that fit in six minutes.", "Short films and event photography from Santo Domingo.", "Watch the reel", "Now showing", "¿Por qué no?", "Short film · 2026 · 6 min · vertical cut available", "Stills", "All", "swipe · 24 frames", "More work", "Reel 2026", "Showreel · 1 min 30", "Credits", "2026 | ¿Por qué no?", "2025+ | Event photography", "Journal", "BOOK A SHOOT", "hello@victorgarces.me", "Date, place, what happens →", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies", "Day · Developer", "Night", "aria: Switch mode"

**Bracketed samples:** [16:9 · own player], [N] more films, [YEAR], [Title], "[Testimonial, verbatim.]", [Name] · [Event] · 1 of 3, [DATE] · on set, [Blog post tagged film, title 01], [Blog post tagged film, title 02]

**Colors not in tokens:** #6A2A24: hero frame half, still 03 tile, journal thumb 2 (sample stand-ins); #25314F: hero frame half (sample); #3A302B: still 01 tile, journal thumb 1; box-shadow 0 10px 30px rgba(0,0,0,0.25) on the mode pill: not --shadow-float or --shadow-banner (0 20px 50px rgba(0,0,0,.25))

**Fonts:** Albert Sans (body), Newsreader italic 500 (brand, h1, h2, titles, email); blockquote italic with no weight set (defaults to 400), Source Code Pro (eyebrow, meta, chips, pill labels)

**Links/routes:**
- F-Landing.dc.html (brand) -> / : defined (redirects if the cookie is set)
- #lang -> /es/film : defined
- #reel (Watch the reel) -> NOT defined
- N-Film.dc.html (Now showing card) -> /film/films/[slug] : defined
- N-Photography.dc.html (Stills 'All') -> /film/photography : defined
- href='#' (Reel card) -> dead link, NOT defined
- N-Films.dc.html ('[N] more films') -> /film/films : defined
- N-Journal.dc.html (Journal 'All') -> /film/journal : defined
- D-Post.dc.html x2 -> /blog/[slug] : defined (stored mode, may render day)
- mailto:hello@victorgarces.me
- D-Contact.dc.html ('Date, place, what happens') -> /contact : defined; should carry ?topic=film
- S-Legal.dc.html x2 (Privacy, Terms) -> /privacy and /terms : defined (both point to the same artboard)
- S-Cookies.dc.html -> /cookies : defined
- F-Home-Dev.dc.html (mode pill) -> /dev : defined
- Open menu button -> no target, no menu designed

## handoff/design/D-Work.dc.html (day)
/dev/work project index (Work/Filters + Work/Grid). Canvas 1440x1560. Script is an empty renderVals(), so there is no state logic.

**Sections:**
- Header: 84px tall, padding 0 64. Brand 'Víctor Garcés' (Albert Sans 700 18px, -0.01em). Centre: 'Day' (mono 12, accent), a 72x36 pill toggle (white, 1px border, 28px accent knob at left 3/top 3), 'Night' (mono 12, muted). Right: nav, gap 28, 14px/500, then an EN / ES pill (mono 12, padding 10 14, border, r999)
- Page title (padding 40 64 0): flex, align-end, space-between. Left column max 760, gap 12: eyebrow (mono 12, muted, .06em), h1 64px/1.02 -0.02em, lead 18/1.55 muted. Right column: the chip, then filter pills (h38, padding 0 16, 13px, r999, gap 8; active = accent bg + white 600; inactive = white + 1px border, 500)
- Grid (padding 40 64 0): 3 columns, gap 20, 6 cards. Card: padding 16, gap 12, white, 1px border, r22. Cover 180px tall, r14, --raised. Meta row: mono 12 muted, space-between (year[ · status] | role/kind). h3 22/700. oneLiner 14/1.55 muted. Tag pills (12/500, padding 5 10, --raised, r999, gap 6, margin-top auto). Links row (gap 16, 14/600, accent): 'Case study', 'Repo'
- Cross-mode banner (padding 32 64 0): white card, padding 24 28, 1px border, r22. Title 17/600 + line 14 muted on the left, outline button on the right (h50, padding 0 24, r999, 15/600)
- Footer: 116px, margin-top auto, padding 0 64, 13px muted. Copyright line on the left, Privacy · Terms · Cookies on the right (gap 24)

**Nav:** Work (active: 700, accent) · About · Experience · Blog · Contact · EN / ES

**Placeholders:**
- `filters from project tags` → projects.tags (per the chip) but the labels match projects.kind — The pill labels All/Web apps/Infra/Client/Experiments are the kind enum. tags are free-form. There is no pill for kind 'archive'
- `cover.avif (Ada System, Sigmedic)` → projects.cover {src, alt}
- `diagram.svg (Media pipeline)` → projects.cover.src (an SVG) — No separate diagram field. The cover holds an SVG
- `content/projects (3 non-featured cards)` → projects.cover + title/oneLiner/tags of the seed entries client-site, experiment, older-build
- `eyebrow '[N] PROJECTS' (no chip)` → count(projects) for the locale
- `meta row right text (no chip)` → projects.role OR projects.kind, which is ambiguous — The values 'creator'/'full-stack' look like role. 'infra'/'client'/'experiment'/'archive' are kind values
- `meta row left '2026 · beta' (no chip)` → projects.year + projects.status (shown when status is not live)
- `'Repo' link (no chip)` → projects.links[] picked by label **(no schema field)** — link has no kind, so Repo/Demo/Live can only be matched by label string

**Final copy:** "Víctor Garcés", "Day", "Night", "Work", "About", "Experience", "Blog", "Contact", "EN / ES", "aria-label: Switch to Filmmaker, night mode", "aria-label: Switch language to Spanish", "WORK · [N] PROJECTS (template)", "Everything I have shipped, or nearly.", "Filters come from the tags in content/projects. Featured ones sit on the home page; the rest live here in date order. (designer note written as copy)", "All", "Web apps", "Infra", "Client", "Experiments", "Case study", "Repo", "Ada System", "Local-first, multi-agent personal assistant with a pixel-art office and Spanish voice control.", "2026", "creator", "local-first", "multi-agent", "sqlite", "Sigmedic", "2026 · beta", "full-stack", "Personal health record for the Dominican Republic, with patient and doctor profiles.", "health records", ".net", "nuxt", "Media pipeline", "infra", "Serverless image and HLS pipeline on AWS that serves the Filmmaker side of this site.", "s3", "lambda", "mediaconvert", "cdk", "client", "experiment", "archive", "Looking for the film side?", "Short films and photography live in night mode.", "Switch to Filmmaker", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [N], [screenshot], [diagram], [cover], [YEAR], [Client site], [Experiment], [Older build], [One line from content/projects.], [tag]

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500

**Links/routes:**
- Brand -> F-Home-Dev = /dev (defined). F-Home-Dev's own brand goes to F-Landing = /
- Toggle -> F-Home-Film = /film (defined, but PAGES says /dev/work toggles to its sibling /film/films)
- Work -> D-Work = /dev/work (defined)
- About -> D-About = /dev/about (defined)
- Experience -> D-About = /dev/about with no anchor (PAGES has no experience route)
- Blog -> D-Blog = /blog (defined)
- Contact -> D-Contact = /contact (defined)
- EN / ES -> #lang (switch to /es/dev/work, defined via prefix_except_default)
- Case study (all 6 cards) -> D-Project = /dev/work/[slug] (defined)
- Repo -> #repo (external, from projects.links; no route)
- Switch to Filmmaker -> N-Films = /film/films (defined)
- Privacy -> S-Legal = /privacy (defined)
- Terms -> S-Legal = /terms (defined)
- Cookies -> S-Cookies = /cookies (defined)

## handoff/design/D-Project.dc.html (day)
/dev/work/[slug] case study for Ada System (Work/CaseStudy with MetaBar, numbered Sections, DecisionGrid, NextCard). Canvas 1440x2560. Script is an empty renderVals().

**Sections:**
- Header: same as D-Work, with Work active
- Intro (padding 40 64 0): back link (mono 12, muted). Block (margin-top 20, gap 16, max 900): eyebrow (mono 12, ACCENT, .06em), h1 60px/1.02, lead 18/1.55 muted (max 700)
- MetaBar: 5-column grid, gap 20, margin-top 32, padding 24 28, white, 1px border, r22. Each cell: label (mono 11, muted, .06em) over a 15/600 value. Cells: ROLE, YEAR, STATUS, STACK, LINKS
- Cover: margin-top 24, 520px tall, r22 (DESIGN says standalone media is 18), --raised
- Case sections (padding 40 64 0): 4 rows. Each row: grid 220px/1fr, gap 32, padding 32 0, 1px top border. Left: mono 12 number + h2 28/700. Right: body 16/1.6 (max 680, gap 20). 01 Context (body + helper line 14 muted). 02 What I built (body + gallery[0], 320px, r14). 03 Decisions (body + 2x2 grid, gap 12, of cards: padding 18, white, border, r16; title 15/600, why 13 muted). 04 Result (body + gallery[1] and gallery[2], 200px each, r14, flex gap 12)
- Next/CTA row (padding 8 64 0): 2 columns, gap 20. NextCard (whole card is a link; padding 28, white, border, r22): 'NEXT PROJECT' (mono 12) + title 26/700 + a 44px accent circle '→'. Dark card (padding 28, --dark #151617, --dark-text, r22): eyebrow (mono 11, --dark-muted) + email 26/700 (a span, not a mailto link) + accent button h50 'Contact'
- Footer (same as D-Work)

**Nav:** Work (active) · About · Experience · Blog · Contact · EN / ES

**Placeholders:**
- `cover.avif` → projects.cover
- `cover.avif '[... or muted screen recording]'` → a video cover **(no schema field)** — projects has no video/mediaRef field
- `placeholder · content/projects/<slug>.md (plain text, x4)` → projects body (MDC), split into 4 numbered sections — No rule says how the single body maps to 01-04, or whether the h2 titles come from the body or from i18n. The raw '<slug>' is unescaped and renders as an element
- `gallery[0]` → projects.gallery[0] (inside section 02)
- `gallery[1]` → projects.gallery[1] (inside section 04)
- `gallery[2]` → projects.gallery[2] (inside section 04)
- `[Why, one line. Placeholder · decisions[] in front matter]` → projects.decisions[].title / .why
- `h1 'A personal assistant that lives on your machine, not in a tab.' (no chip)` → none. title is 'Ada System' **(no schema field)** — Needs a headline field
- `lead (no chip)` → projects.oneLiner — The text differs from the D-Work card's oneLiner
- `MetaBar values (no chip)` → projects.role, year, status (enum to label), stack[] joined by ', ', links[] labels
- `NEXT PROJECT 'Sigmedic' (no chip)` → projects.next (slug) -> the referenced project's title — next is optional and has no fallback rule
- `email in dark card (no chip)` → contact.email

**Final copy:** "← All projects", "CASE STUDY · ADA SYSTEM (template 'CASE STUDY · {title}')", "A personal assistant that lives on your machine, not in a tab.", "Local-first, multi-agent, with a pixel-art office and Spanish voice control.", "Title and one-liner come from the front matter. (designer note appended to the lead)", "ROLE", "YEAR", "STATUS", "STACK", "LINKS", "Creator, full-stack", "2026", "In progress", "Python, SQLite, Vue", "Repo · Demo", "01", "02", "03", "04", "Context", "What I built", "Decisions", "Result", "Who it is for and why it exists. Two short paragraphs, no jargon. (writing guideline written as copy)", "NEXT PROJECT", "Sigmedic", "→", "BUILDING SOMETHING SIMILAR?", "hello@victorgarces.me", "Contact", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [hero image, 16:9, or muted screen recording], [screenshot or diagram], [Decision 1], [Decision 2], [Decision 3], [Decision 4], [Why, one line. Placeholder · decisions[] in front matter], [screenshot]

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500

**Links/routes:**
- Brand -> /dev (defined)
- Toggle -> /film (defined; PAGES defines no sibling for /dev/work/[slug])
- Nav: /dev/work, /dev/about, Experience -> /dev/about (no experience route), /blog, /contact (all defined)
- EN / ES -> #lang (/es/dev/work/[slug])
- ← All projects -> D-Work = /dev/work (defined)
- LINKS 'Repo · Demo' is shown as plain spans, not anchors (external hrefs from projects.links)
- NEXT PROJECT card -> D-Project = /dev/work/[next] (defined)
- Contact button -> D-Contact = /contact (defined; no ?topic given)
- Footer: /privacy, /terms, /cookies (defined)

## handoff/design/D-About.dc.html (day)
/dev/about (About/Page: portrait + story, stack groups, experience timeline, Now block). Canvas 1440x1860. Script is an empty renderVals().

**Sections:**
- Header: same as D-Work, with About active
- Hero (padding 40 64 0): grid 380px/1fr, gap 48, align-center. Portrait 460px tall, r28, --raised (labelled 4:5, but 380x460 is not 4:5). Right column (gap 18): eyebrow (mono 12, ACCENT) 'ABOUT · DAY', h1 48px/1.02 (DESIGN says 56-64 for inner pages), story 17/1.55 muted (max 620). Buttons (gap 12): primary accent h50 'Download CV' and outline 'See the film side'. Mono 11 note under the buttons
- Stack (padding 48 64 0): eyebrow 'STACK', then a 4-column grid (gap 12) of cards (padding 20, white, border, r18, gap 8). Each card: group label (mono 12, muted) + pills (12/500, --raised, r999)
- Experience (padding 48 64 0): grid 360px/1fr, gap 48. Left: eyebrow 'EXPERIENCE', h2 36/1.1, then the chip. Right: rows (grid 150px 24px 1fr, gap 16, padding 18 0, 1px bottom border). Each row: year (mono 12, muted), 12px dot (first row filled accent, the rest a 2px accent ring), title 17/600 + summary 14 muted
- Now block (padding 40 64 0): --dark card, r22, padding 28 32, space-between. 'NOW' (mono 11, --dark-muted) + text 17px on the left, accent button 'Say hello' on the right
- Footer (same as D-Work)

**Nav:** Work · About (active) · Experience (points to the same page but is never active) · Blog · Contact · EN / ES

**Placeholders:**
- `portrait.avif` → about.portrait {src, alt} (entry with mode dev)
- `[Story from content/about.md ...] (no chip)` → about body (markdown)
- `placeholder · public/cv-victor-garces.pdf · same CV in both modes (plain text)` → about.cv (default '/cv-victor-garces.pdf') — The file does not exist in public/ yet
- `h1 (no chip)` → about.headline
- `stack cards (no chip)` → about.stack[{group, items[]}]
- `years · content/experience.yml` → experience.entries[].from/to/title/org/summary/current — The rule for the filled dot (first vs current) and for 'to now' (to=null) is not stated
- `[... Placeholder · content/about.md, now: field]` → about.now

**Final copy:** "ABOUT · DAY", "Software Engineering student by night, freelance developer by day, filmmaker on weekends.", "Download CV", "See the film side", "STACK", "FRONT", "BACK", "CLOUD", "ALSO", "Vue", "Nuxt", "TypeScript", "Tailwind", ".NET", "EF Core", "SQL", "SQLite", "AWS", "Lambda", "S3", "CloudFront", "CDK", "Python", "Git", "Figma", "EXPERIENCE", "Where I have worked and studied", "to now", "Freelance developer", "Web apps and platforms for clients, Vue/Nuxt and .NET.", "Director of Communications & Marketing · La Voz Juvenil RD", "Brand, content and team coordination for a youth leadership organization.", "Software Engineering · UNAPEC", "Evening classes, Santo Domingo.", "Technical degree, Development and Administration of Computer Applications", "Instituto Politécnico Francisco José Peynado.", "NOW", "Say hello", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [portrait, 4:5], [Story from content/about.md, three short paragraphs: how you started, what you build now, what you want to build next.], [more], [YEAR] to now, [YEAR], [What you are working on this month. Placeholder · content/about.md, now: field]

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500

**Links/routes:**
- Brand -> /dev (defined)
- Toggle -> /film (defined, but PAGES says /dev/about toggles to /film/about)
- Nav: /dev/work, /dev/about, Experience -> /dev/about (no anchor, no route), /blog, /contact
- EN / ES -> #lang (/es/dev/about)
- Download CV -> #cv = about.cv '/cv-victor-garces.pdf' (static file, currently missing)
- See the film side -> N-About = /film/about (defined)
- Say hello -> D-Contact = /contact (defined)
- Footer: /privacy, /terms, /cookies (defined)

## handoff/design/D-Blog.dc.html (day)
/blog post index (Page/Title + Blog/List rows + Blog/Pagination). Shared page that uses the stored mode. Only the day version is drawn. Canvas 1440x1360. Script is an empty renderVals().

**Sections:**
- Header: same as D-Work, with Blog active
- Page title (padding 40 64 0): eyebrow 'BLOG · [N] POSTS', h1 64/1.02, lead 18 muted. Right: the chip, then tag pills (h38, 13px; All active accent)
- List (padding 40 64 0): column, gap 10, 5 rows. Each row is a link: grid 140px / 1fr / 200px / 100px, gap 20, padding 22 24, white, r18. The row's only border is the 1.5px dashed --ph placeholder outline, with no chip. Cells: date (mono 12, muted); title 22/700 + excerpt 14 muted; tag pill(s) 12/500 --raised; '[N] min' (mono 12, accent, right-aligned)
- Pagination row (padding 24 64 0): space-between. Page pills 1 (active accent), 2, 3 (h38, r999, drawn as spans). Right: 'RSS' and 'Search' links (14/600, accent)
- Footer (same as D-Work)

**Nav:** Work · About · Experience · Blog (active) · Contact · EN / ES

**Placeholders:**
- `tags from content/blog` → union of blog.tags — The existing posts have no tags, so only 'All' would render
- `dashed row outline (no chip)` → blog entries: date, title, description (excerpt, clamped to one line?), tags
- `'[N] min' (no chip)` → reading time **(no schema field)** — The snippet blog schema has no minRead. The existing posts have minRead: 8 / 6
- `'BLOG · [N] POSTS' (no chip)` → count(blog) for the locale, excluding drafts

**Final copy:** "BLOG · [N] POSTS (template)", "Notes from building things.", "Every post in content/blog, newest first. Posts tagged film also show in the Filmmaker journal. (designer note written as copy)", "All", "nuxt", ".net", "aws", "process", "film", "1", "2", "3", "RSS", "Search", "min (in '[N] min')", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [N], [DATE], [Existing post title 01], [Existing post title 02], [Existing post title 03], [Existing post title 04], [Existing post title 05], [Excerpt, one line.], [N] min

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500

**Links/routes:**
- Brand -> /dev (defined; at night this presumably should be /film, not specified)
- Toggle -> /film (PAGES says shared pages only flip the attribute and do not navigate)
- Nav: /dev/work, /dev/about, Experience -> /dev/about, /blog, /contact
- EN / ES -> #lang (/es/blog)
- Row -> D-Post = /blog/[slug] (defined)
- Pagination 1/2/3: no href and no paged route (/blog?page= or /blog/page/[n]) in PAGES
- RSS -> #rss (PAGES defines server/routes/rss.xml.ts, so the href is presumably /rss.xml)
- Search -> #search (undefined; no route or behaviour)
- Footer: /privacy, /terms, /cookies (defined)

## handoff/design/D-Post.dc.html (day)
/blog/[slug] article (Blog/Article, Blog/Toc sticky, Blog/Share, Blog/PrevNext). Shared page that uses the stored mode. The night version is described only as 'serif h1/h2'. Canvas 1440x2160. Script is an empty renderVals().

**Sections:**
- Header: same as D-Work, with Blog active
- Intro (padding 40 64 0): back link (mono 12). Block (margin-top 20, gap 16, max 860): row with a tag pill + meta (mono 12: '[DATE] · [N] min read'), h1 56px/1.02, description 18 muted. Cover: margin-top 28, 420px tall, r22, --raised (optional)
- Body (padding 40 64 0): grid 1fr/280px, gap 48. Article (17px/1.65, max 720, gap 24): paragraphs, h2 28/700 with ids, code block (--dark bg, r16, padding 20 24, mono 13/1.7, Shiki-coloured), callout (--raised, r16, padding 18 22, 15px, bold 'Note.' prefix). Aside (gap 24): TOC card, sticky top 24 (padding 20, white, border, r18): 'ON THIS PAGE' + links 13px, first link accent (active), the rest muted. Share card: 'SHARE' + pills 'Copy link', 'X', 'LinkedIn' (h38)
- Prev/Next (padding 40 64 0): 2 columns, gap 20. Link cards (padding 24, white, border, r22): '← PREVIOUS' / 'NEXT →' (mono 12) + title 22/700; the next card is right-aligned
- Footer (same as D-Work)

**Nav:** Work · About · Experience · Blog (active) · Contact · EN / ES

**Placeholders:**
- `placeholder · content/blog/<slug>.md (inline in the meta row)` → blog.date + blog.tags[0] + reading time **(no schema field)** — date and tags exist; reading time (minRead) is missing from the snippet schema
- `h1 / lead (no chip)` → blog.title / blog.description
- `cover` → blog.cover (image.optional, alt required) — The existing posts use `image: <string>` with no alt
- `body (x4, plain text)` → blog body via ContentRenderer
- `// placeholder · fenced code from the post, Shiki theme per mode` → body code fences + content.build.markdown.highlight config — The theme names and the per-mode mechanism are not specified
- `[Callout component from MDC, optional.]` → a custom MDC component (name not given) **(no schema field)** — No component in COMPONENTS.md. Free Nuxt UI 3 has no prose callout
- `TOC (no chip)` → post.body.toc.links
- `Prev/Next (no chip)` → queryCollectionItemSurroundings on blog (locale, non-draft)

**Final copy:** "← All posts", "min read (in '[DATE] · [N] min read')", "nuxt", "Note.", "ON THIS PAGE", "SHARE", "Copy link", "X", "LinkedIn", "← PREVIOUS", "NEXT →", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [DATE], [N] min read, [Existing post title 01], [Post description from front matter. One or two lines.], [cover image, optional], [Heading 1], [Heading 2], [Heading 3], [Heading 4], [Heading 5], [Callout component from MDC, optional.], [Post title], sample code: export default defineNuxtConfig({ modules: ['@nuxt/content', '@nuxtjs/seo'] })

**Colors not in tokens:** #7FD4B8 (code block keyword 'export default'); #E2A15B (code block string literals). This is the NIGHT accent, used inside a day artboard

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500 (code block 13px)

**Links/routes:**
- Brand -> /dev
- Toggle -> /film (PAGES says shared pages only flip the attribute)
- Nav: /dev/work, /dev/about, Experience -> /dev/about, /blog, /contact
- EN / ES -> #lang (/es/blog/[slug], a linked translation)
- ← All posts -> D-Blog = /blog (defined)
- TOC -> #h1..#h5 in-page anchors (heading ids from MDC)
- Share: Copy link (clipboard), X and LinkedIn share intents (external, URLs not specified)
- ← PREVIOUS / NEXT → -> D-Post = /blog/[slug] (defined)
- Footer: /privacy, /terms, /cookies (defined)

## handoff/design/D-Contact.dc.html (day)
/contact (Page/Title + Contact/Form with topic switch + Contact/Aside). Shared page that uses the stored mode; ?topic=film preselects the film topic. Only the day version with the web topic is drawn. Canvas 1440x1180. Script is an empty renderVals().

**Sections:**
- Header: same as D-Work, with Contact active
- Page title (padding 40 64 0): eyebrow 'CONTACT', h1 64/1.02, lead 18 muted (no right slot)
- Main (padding 40 64 0): grid 1fr/380px, gap 24
- Form card: 2-column grid, gap 16, padding 32, white, 1px border, r24 (not a token). Topic row (span 2): label 13 muted + pills (h38; active accent). Fields: Name | Email; Budget range | Timeline; Message (span 2, 140px tall, r16). Field label 13 muted, gap 6. Inputs 48px tall, r999, --bg fill, 1px border, 14px muted placeholder. Footer row: Turnstile box (r12, mono 11) on the left, accent 'Send' h50 on the right. Mono 11 annotation line below
- Aside (gap 16): dark card (--dark, r24, padding 28): eyebrow (mono 11, --dark-muted), mailto email 26/700, meta line 14 --dark-muted. 'Elsewhere' card (white, border, r24, padding 24): eyebrow (mono 12) + 4 rows (15/500, handle in muted, padding 8 0, bottom border)
- Footer (same as D-Work)

**Nav:** Work · About · Experience · Blog · Contact (active) · EN / ES

**Placeholders:**
- `'Pick one · placeholder · options in content/contact.yml' (inline in the Budget field)` → contact.budgets[]
- `Timeline 'When do you need it' (no chip)` → contact.timelines[]
- `Topic pills (no chip)` → contact.topics[{id: web|film|hello, label, fields[]}] — fields is a bare string[]: no vocabulary, types, labels or placeholders. The film and hello field sets are not drawn
- `email (no chip)` → contact.email
- `'Santo Domingo, DO · GMT-4 · replies within [N] days'` → contact.city · contact.timezone · contact.responseTime
- `Elsewhere rows (no chip)` → contact.socials[{label, handle, href (url()), mode}] — href must pass z.string().url(), but the LinkedIn and YouTube seeds are bracketed
- `consent line, success and error states (annotation only)` → i18n strings (not drawn) **(no schema field)**

**Final copy:** "CONTACT", "Tell me what you are building.", "One form for both modes. The topic changes the fields: a project needs a budget range, a shoot needs a date and a place. (borderline: reads like a design note)", "Topic", "Web project", "Film or photo", "Just saying hi", "Name", "Your name", "Email", "you@example.com", "Budget range", "Pick one", "Timeline", "When do you need it", "Message", "What it is, who it is for, what exists already", "Send", "Cloudflare Turnstile · invisible unless challenged (annotation)", "Web3Forms endpoint · success and error states inline, no redirect · consent line links to Privacy (annotation)", "OR JUST EMAIL", "hello@victorgarces.me", "Santo Domingo, DO · GMT-4 · replies within [N] days", "ELSEWHERE", "GitHub", "@YTvictorworld", "LinkedIn", "Instagram", "@vgfilmx", "YouTube", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [N] days, [handle], [channel]

**Fonts:** Albert Sans 400/500/600/700, Source Code Pro 400/500

**Links/routes:**
- Brand -> /dev
- Toggle -> /film (PAGES says shared pages only flip the attribute)
- Nav: /dev/work, /dev/about, Experience -> /dev/about, /blog, /contact
- EN / ES -> #lang (/es/contact)
- Send -> #send (form POST to the Web3Forms endpoint from env; external)
- mailto:hello@victorgarces.me
- GitHub -> #github, LinkedIn -> #linkedin, Instagram -> #instagram, YouTube -> #youtube (external, from contact.socials.href)
- Consent line -> /privacy (defined, but the line itself is not drawn)
- /contact?topic=film preselects the film topic (PAGES); not drawn
- Footer: /privacy, /terms, /cookies (defined)

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/N-Films.dc.html (night)
/film/films (Film/Index): night films index with kind filter pills, one featured card and a 3-col grid. Canvas 1440x1500.

**Sections:**
- Header (same on every N-* page): h84, pad 0 64, space-between. Brand 'Víctor Garcés' Newsreader italic 500 22px. Toggle group gap 12: 'Day' mono 12 muted, pill 72x36 r999 surface + 1px border, knob 28px accent at right:3 top:3, 'Night' mono 12 accent. Nav gap 28, 14px/500, active item 700 + accent. EN / ES pill mono 12 muted, pad 10x14, r999, surface + border
- Page title (Page/Title): section pad 40 64 0; flex space-between align-end gap 24. Left col gap 12, max-w 760: eyebrow mono 12 ls .06em muted, h1 Newsreader italic 500 64/1.02, lead 18/1.55 muted. Right col (align end, gap 10): chip, then 4 pills h38 pad 0 16 13px r999 gap 8 (active: accent bg / on-accent 600; idle: surface + border 500)
- Featured card (Film/FeaturedCard): section pad 40 64 0; whole card is one link; grid 2fr/1fr gap 20, pad 12, surface, 1px border, radius 24px (not a token). Media h400 r18 raised. Text col pad 20, space-between: eyebrow mono 12 accent, title Newsreader 44/1, blurb 15/1.55 muted, 'Watch →' 14/600 accent
- Grid (Film/Grid): section pad 24 64 0; 3 cols gap 20; each card is a link, flex col gap 10, pad 12, surface + border r22. Media h280 r14 raised. Text pad 4 10 10, gap 4: title Newsreader 26, meta 13/1.55 muted. Featured film is not repeated in the grid
- Footer (same on every N-* page): h116, pad 0 64, 13px muted. Left '© 2026 Víctor Garcés · Santo Domingo, DO'; right Privacy · Terms · Cookies, gap 24. No night-only 'original work' line

**Nav:** Films (active: 700 + accent) · Photography · Journal · About · Contact · EN / ES (pill, aria-label 'Switch language to Spanish')

**Placeholders:**
- `placeholder · kinds from content/films` → films.kind enum (short|reel|client|vertical) -> pill labels — No label mapping exists anywhere. The pills read All/Short films/Reels/Client, and 'vertical' has no pill
- `placeholder · media manifest ([featured · 16:9 · muted loop])` → films where featured=true (lowest order) .preview.id -> manifest.videos[id].preview, falling back to poster
- `placeholder · media manifest (Reel 2026, [poster · muted preview on hover])` → films.poster.id + films.preview.id -> manifest — Same card component as the next two cards, but the chip is different
- `placeholder · content/films (x2: [Client video], [Older short])` → films.title, kind, year, runtime, poster, preview
- `(no chip) featured blurb 'One actress, two inner voices, a room lit in red and blue. 6 minutes.'` → needs a films.logline/oneLiner field **(no schema field)** — Differs from the N-Film synopsis text. The films schema has only synopsis
- `(no chip) eyebrow 'FILMS · [N] TITLES'` → count(films)

**Final copy:** "FILMS · [N] TITLES", "Short films, reels and client work.", "Everything with moving images. Photography has its own page.", "All", "Short films", "Reels", "Client", "FEATURED · SHORT FILM · 2026", "¿Por qué no?", "One actress, two inner voices, a room lit in red and blue. 6 minutes.", "Watch →", "Reel 2026", "Showreel · 1 min 30", "aria-label pattern: Open <title>", "Víctor Garcés", "Day", "Night", "aria-label: Switch to Developer, day mode", "© 2026 Víctor Garcés · Santo Domingo, DO", "Privacy", "Terms", "Cookies"

**Bracketed samples:** [N], [featured · 16:9 · muted loop], [poster · muted preview on hover], [Client video], [Older short], [Format · year] · content/films (the ' · content/films' part is OUTSIDE the brackets)

**Fonts:** Albert Sans 400/500/600/700, Newsreader italic 500 (opsz 6..72), Source Code Pro 400/500

**Links/routes:**
- brand -> F-Home-Film = /film (defined)
- toggle -> F-Home-Dev = /dev (route defined, but PAGES.md says the toggle on /film/films goes to its sibling /dev/work)
- nav Films -> /film/films, Photography -> /film/photography, Journal -> /film/journal, About -> /film/about (all defined)
- nav Contact -> D-Contact = /contact (defined; shared stored-mode page)
- #lang -> locale switch (/es prefix), not a route
- featured card + 3 grid cards -> N-Film = /film/films/[slug] (defined)
- footer Privacy -> /privacy, Terms -> /terms (both S-Legal, defined); Cookies -> S-Cookies = /cookies (defined, but only the banner has an artboard)

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/N-Film.dc.html (night)
/film/films/[slug] (Film/Page), shown for ¿Por qué no?: full-width own player, title + synopsis + credits, stills, vertical cut, next film. Canvas 1440x2820.

**Sections:**
- Header (night, Films active)
- Back link + player: section pad 40 64 0. '← All films' mono 12 muted. Stage margin-top 20, 1312x738 (16:9), radius 24px (not a token), surface bg, dashed. Center play button 88px accent circle with a #121010 triangle. Control bar left/right 24, bottom 20, gap 14, mono 12 muted: '00:00', 4px r999 track #3A302B (not a token), '06:04', 'CC', '1080p', '⤢'
- Info: section pad 40 64 0; grid 1fr/420px gap 48. Left col gap 20: eyebrow mono 12 accent, h1 Newsreader 72/1.02 (DESIGN.md says 56-64 for inner pages), synopsis 18/1.55 muted max-w 640, buttons h50 pad 0 24 15/600 r999 gap 12 (primary accent 'Vertical cut'; secondary surface + border 'Behind the scenes', 'Share'). Right: credits card pad 24 28 r22 gap 6, eyebrow 'CREDITS', rows grid 160px/1fr gap 12 pad 12 0 border-bottom 15px, label muted
- Stills (Film/Stills): section pad 48 64 0. Header row space-between baseline: h2 'Stills' Newsreader 36/1.1 (DESIGN h2 night = 42) + chip. Flex row gap 14: 4 equal tiles h220 r14, lightbox
- Vertical cut (Film/VerticalCut): section pad 40 64 0; grid 300px/1fr gap 20. Tile h420 r22: 300x420 is 5:7, although it is labelled 9:16. Card pad 28 r22 space-between: eyebrow 'ALSO AS', h2 Newsreader 32/1.1, p 15/1.55 muted max-w 520, pills h38 'Instagram', 'YouTube Shorts' (spans, not links)
- Next: section pad 40 64 0; link card pad 28 r22 flex space-between: eyebrow 'NEXT' + title Newsreader 28; 44px accent circle '→'
- Footer (no night 'original work' line)

**Nav:** Films (active) · Photography · Journal · About · Contact · EN / ES

**Placeholders:**
- `placeholder · own player · HLS 1080/720/480/360 · poster from manifest · captions .vtt` → films.video.id -> manifest.videos[id].{hls, renditions, poster, captions, duration} — The poster comes from videos[id].poster here, yet films also has its own poster mediaRef
- `placeholder · stills[] in front matter · lightbox` → films.stills[] (mediaRef[])
- `placeholder · media manifest (x4: [still 01]..[still 04])` → manifest.photos[films.stills[i].id]
- `placeholder · media manifest, vertical ([vertical cut · 9:16 · muted loop])` → films.vertical.id -> manifest.videos[id] — The media is covered. The section title, body copy, platform links and vertical runtime have no fields
- `(bracket) [Synopsis from content/films/por-que-no.md, two paragraphs.]` → films.synopsis (z.string) or the .md body — Two paragraphs in a front-matter string, or the markdown body? Ambiguous
- `(no chip) eyebrow 'SHORT FILM · 2026 · 6 MIN'` → films.kind label + year + runtime — No kind-label mapping
- `(no chip) credits rows` → films.credits[{role,name}] + camera + runtime + year **(no schema field)** — 'vertical cut 3 min' has no field, and it is unclear whether the Camera/Runtime/Year rows are credits[] entries or derived
- `(no chip) vertical-cut heading/paragraph/Instagram + YouTube Shorts pills` → none (films.external[] can hold links but cannot mark them as belonging to the vertical cut) **(no schema field)**
- `(no chip) NEXT 'Reel 2026'` → films.next -> films[next].title
- `(no chip) 'Behind the scenes' button` → films.journal[] (post slugs) — The artboard links to /film/journal, not to the linked posts

**Final copy:** "← All films", "00:00", "06:04", "CC", "1080p", "⤢", "SHORT FILM · 2026 · 6 MIN", "¿Por qué no?", "One actress, two inner voices: ambition on one side, enjoyment on the other, in a room lit in red and blue.", "Vertical cut", "Behind the scenes", "Share", "CREDITS", "Written by: Víctor Garcés", "Directed by: Víctor Garcés", "Cast", "Camera: Sony a7III · [lens]", "Sound", "Edit and color: Víctor Garcés", "Runtime: 6 min · vertical cut 3 min", "Year: 2026", "Stills", "ALSO AS", "The 3-minute vertical cut", "Same story, re-framed for Reels. Plays inline here, links out to Instagram and YouTube Shorts.", "Instagram", "YouTube Shorts", "NEXT", "Reel 2026", "→"

**Bracketed samples:** [Synopsis from content/films/por-que-no.md, two paragraphs.], [Actress], [lens], [Name], [still 01], [still 02], [still 03], [still 04], [vertical cut · 9:16 · muted loop]

**Colors not in tokens:** #3A302B: player progress track (a real UI element) and still 01 fill; #6A2A24: left half of the player sample SVG (opacity .4) and still 02 fill; #25314F: right half of the player sample SVG (opacity .4) and still 03 fill; #0B0908: silhouette ellipse in the player sample SVG

**Fonts:** Albert Sans, Newsreader italic 500, Source Code Pro

**Links/routes:**
- header/footer links same as N-Films (toggle -> /dev; PAGES.md defines no dev sibling for /film/films/[slug])
- '← All films' -> N-Films = /film/films (defined)
- 'Vertical cut' -> #vertical (in-page anchor; no element in the artboard has id=vertical)
- 'Behind the scenes' -> N-Journal = /film/journal (defined; films.journal[] suggests /blog/[slug] instead)
- 'Share' -> #share (not a route; behaviour undefined)
- Instagram / YouTube Shorts: spans, no href
- Next card -> N-Film = /film/films/[next] (defined)

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/N-Photography.dc.html (night)
/film/photography (Photo/Series + Photo/Masonry): series pills, 3-col masonry of manifest photos with lightbox, and an event-shoot CTA. Canvas 1440x1720.

**Sections:**
- Header (night, Photography active)
- Page title: same layout as N-Films. Eyebrow 'PHOTOGRAPHY · [N] SERIES', h1 64/1.02, lead 18. Right: chip + series pills h38 (first active, no 'All' pill)
- Masonry: section pad 40 64 0; grid 3 cols gap 14 (DESIGN.md says 20-24); each col flex gap 14; 9 tiles radius 16px (neither 14 nor 18). Heights: col1 300/240/260, col2 220/300/280, col3 260/220/240. Column-major order: 01-03 col1, 04-06 col2, 07-09 col3
- CTA card: section pad 32 64 0; flex space-between, pad 24 28, r22, surface + border. Title Newsreader 24, p 14/1.55 muted, primary button h50 'Book a shoot'. Not listed in COMPONENTS.md
- Footer (no night line)

**Nav:** Films · Photography (active) · Journal · About · Contact · EN / ES

**Placeholders:**
- `placeholder · series from the media manifest` → manifest.series[*].title — The title is a single string, with no es translation
- `placeholder · media manifest (x9: [still 0N · alt from manifest])` → manifest.series[active].photos[] -> manifest.photos[id].{alt,width,height,blurhash,sizes,formats,path} **(no schema field)** — The media fields exist, but nothing enforces alt: photos have no content entry, the manifest is unvalidated JSON, and the MEDIA.md example has alt ''
- `(no chip) '[N] SERIES'` → count(manifest.series)

**Final copy:** "PHOTOGRAPHY · [N] SERIES", "Stills, by series.", "Each series is a folder in the media pipeline: originals in S3, AVIF and WebP renditions here, blurhash while loading, lightbox on click.", "Events 2025", "On set", "Need photos of your event?", "Conferences, launches and community events in Santo Domingo.", "Book a shoot"

**Bracketed samples:** [N], [Series], [still 01 · alt from manifest] .. [still 09 · alt from manifest]

**Colors not in tokens:** #3A302B: tiles 01 and 08 (sample fill); #6A2A24: tile 02 (sample fill); #25314F: tile 03 (sample fill); #4A3A2E: tiles 06 and 07 (sample fill)

**Fonts:** Albert Sans, Newsreader italic 500, Source Code Pro

**Links/routes:**
- header/footer same as N-Films (toggle -> /dev; PAGES.md defines no dev sibling for /film/photography)
- 'Book a shoot' -> D-Contact = /contact (defined; the ?topic=film preselect from PAGES.md is not used)
- series pills: spans, no href or query param

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/N-Journal.dc.html (night)
/film/journal (Blog/JournalGrid): blog posts tagged film, with covers, in a 2-col grid with sub-tag pills. Canvas 1440x1360.

**Sections:**
- Header (night, Journal active)
- Page title: eyebrow 'JOURNAL · [N] ENTRIES', h1 'Behind the scenes.' 64/1.02, lead 18. Right: 4 pills h38 (All active, on set, gear, writing) with NO placeholder chip
- Grid: section pad 40 64 0; 2 cols gap 20; card is a link, flex col gap 12, pad 12, surface, 1.5px dashed --ph border (the whole card is a placeholder), r22. Cover h220 r14. Text pad 4 10 10 gap 6: meta mono 11 muted '[DATE] · <tag>', title Newsreader 26/1.1, excerpt 14/1.55 muted. 4 cards, no pagination
- Footer (no night line)

**Nav:** Films · Photography · Journal (active) · About · Contact · EN / ES

**Placeholders:**
- `placeholder · content/blog, tag film (x4, [cover])` → blog.cover (image, optional) for posts whose tags include 'film' — cover is optional; no fallback is designed
- `(no chip) [DATE] · on set|gear|writing|color` → blog.date + one entry of blog.tags — No rule for which tag to show
- `(no chip) title / excerpt` → blog.title / blog.description
- `(no chip) filter pills All/on set/gear/writing` → distinct tags of film posts (implied) — Not marked as data-driven, and card 4's tag 'color' has no pill
- `(no chip) '[N] ENTRIES'` → count(film-tagged posts)

**Final copy:** "JOURNAL · [N] ENTRIES", "Behind the scenes.", "The same blog, filtered by the film tag and shown with covers. The post page is shared with day mode and re-themed.", "All", "on set", "gear", "writing", "color"

**Bracketed samples:** [N], [cover], [DATE], [Blog post tagged film, title 01] .. [Blog post tagged film, title 04], [One-line excerpt.]

**Colors not in tokens:** #3A302B: cover 1 (sample fill); #6A2A24: cover 3 (sample fill); #25314F: cover 4 (sample fill)

**Fonts:** Albert Sans, Newsreader italic 500, Source Code Pro

**Links/routes:**
- header/footer same as N-Films (toggle -> /dev; PAGES.md defines no dev sibling for /film/journal)
- 4 cards -> D-Post = /blog/[slug] (defined; shared page, stored mode, default day)
- filter pills: spans, no href or query param

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/N-About.dc.html (night)
/film/about (About/PageFilm): film bio hero with portrait, a kit card and a services card. Canvas 1440x1560.

**Sections:**
- Header (night, About active)
- Hero: section pad 40 64 0; grid 1fr/460px gap 48 align center. Left col gap 18: eyebrow mono 12 accent, h1 Newsreader 60/1.02, story 17/1.55 muted max-w 620, buttons h50 gap 12 (primary 'Book a shoot', secondary 'See the developer side'). Right: portrait 460x560 r28 raised
- Kit + Services: section pad 48 64 0; grid 2 cols gap 20. Kit card pad 28 r22 gap 6: eyebrow, 5 rows grid 120px/1fr gap 12 pad 12 0 border-bottom 15px, then a footnote mono 11 muted with margin-top 8. Services card pad 28 r22 gap 14: eyebrow, 3 items (title Newsreader 24, summary 14 muted, pad 12 0, border-bottom)
- Footer (no night line). No timeline, Now block, filmography credits or CV button

**Nav:** Films · Photography · Journal · About (active) · Contact · EN / ES

**Placeholders:**
- `placeholder · portrait-film.avif ([portrait on set, 4:5])` → about (mode=film, about-film.md).portrait {src:'/portrait-film.avif', alt}
- `(bracket) [Story from content/about.md, film version: ...]` → about-film.md body (or teaser) — The bracket names content/about.md, while CONTENT.md uses about-film.md
- `(no chip) h1` → about.headline
- `(no chip) kit rows` → about.kit[{label,value}]
- `(no chip) services` → about.services[{title,summary}] — filmography.services (string[]) is a second source for services
- `(no chip) handle in eyebrow '@VGFILMX'` → contact.socials[mode=film].handle (implied)

**Final copy:** "ABOUT · NIGHT · @VGFILMX", "Writer, director and the person holding the camera, most of the time.", "Book a shoot", "See the developer side", "KIT · THE PUBLIC PART", "Camera: Sony a7III", "Lenses", "Light", "Sound", "Edit", "full inventory stays on /bag, off-nav, noindex", "SERVICES", "Short films: Writing, directing, editing. Small crews, one camera.", "Event photography: Conferences, launches, community events. Delivery in [N] days.", "Vertical reels: Cut for Instagram and Shorts from existing footage or shot for it."

**Bracketed samples:** [Story from content/about.md, film version: the monologue that became a short, why small crews, what you want to shoot next.], [portrait on set, 4:5], [lens] · [lens], [light] · [modifier], [recorder] · [mic], [edit + color app], [N] days

**Fonts:** Albert Sans, Newsreader italic 500, Source Code Pro

**Links/routes:**
- header/footer same as N-Films (toggle -> /dev; PAGES.md says /film/about toggles to /dev/about)
- 'Book a shoot' -> D-Contact = /contact (defined; no ?topic=film)
- 'See the developer side' -> D-About = /dev/about (defined)
- /bag is named in the footnote text but not linked

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/S-404.dc.html (both)
app/error.vue 404, drawn as a day half and a night half side by side (only one renders, per mode). Canvas 1440x900.

**Sections:**
- Split into 2 equal cols of 900h. Each half pad 48 56, flex col space-between. No Shell header, nav or footer
- Top row: brand 'Víctor Garcés' (day: Albert Sans 700 18 -0.02em; night: Newsreader italic 500 18), a span rather than a link. Right: mono 12 accent ls .06em 'DAY · 404' / 'NIGHT · 404'
- Middle, gap 18: '404' Source Code Pro 120/1 accent ls -0.04em; h1 40/1.02 (day Albert 700 -0.02em, night Newsreader italic 500); p 16/1.55 muted max-w 460; buttons h50 pad 0 24 gap 10 (primary accent + on-accent; secondary surface + border)
- Bottom: mono 11 muted annotation 'app/error.vue · static build writes 404.html · the 3D object is the exploded page (day) or a blank frame (night), static'. No 3D slot is drawn

**Placeholders:**


**Final copy:** "404", "This page never shipped.", "The link is old or the slug changed. Search the blog or go back to the projects.", "Back home", "Try the film side", "Scene missing.", "Nothing was shot here. The reel and the stills are one click away.", "Try the developer side", "DAY · 404 / NIGHT · 404 (label or annotation? unclear)"

**Fonts:** Albert Sans, Newsreader italic 500 (used in the night half but NOT in the artboard's Google Fonts link, so it renders in the fallback serif), Source Code Pro (also used at 120px for the numeral)

**Links/routes:**
- day 'Back home' -> F-Home-Dev = /dev (defined)
- day 'Try the film side' -> F-Home-Film = /film (defined)
- night 'Back home' -> /film (defined)
- night 'Try the developer side' -> /dev (defined)
- no link to /blog (the copy says 'Search the blog') or /dev/work ('go back to the projects'); no reel or photography link despite the night copy

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/S-Cookies.dc.html (both)
Shell/CookieBanner, shown as a day EN variant and a night ES variant. Canvas 1440x640.

**Sections:**
- Split into 2 cols, each pad 40 56, space-between: caption mono 12 (annotation), banner, annotation mono 11
- Banner: w420, pad 24, gap 14, surface bg, 1px border, r22, shadow 0 20px 50px rgba(0,0,0,.25) (= --shadow-banner). Title 16/600, body 14/1.55 muted. Action row gap 8 align center: primary h42 pad 0 24 14/600 accent, secondary h42 surface + border, 'Privacy' text link 13 muted with margin-left auto
- Placement, stated only in the annotation: bottom-left, 24px from the edges; shown only on pages with embeds or when analytics needs consent in the visitor's region; @nuxt/scripts consent; choice stored 6 months; 'Allow embeds' reappears under footer Cookies

**Placeholders:**


**Final copy:** "This site runs without tracking cookies.", "Analytics are cookieless. YouTube and Instagram embeds set their own cookies, so they stay off until you allow them.", "Only necessary", "Allow embeds", "Privacy", "Este sitio funciona sin cookies de rastreo.", "La analítica no usa cookies. Los embeds de YouTube e Instagram sí, por eso quedan apagados hasta que los permitas.", "Solo necesarias", "Permitir embeds", "Privacidad"

**Fonts:** Albert Sans, Source Code Pro

**Links/routes:**
- 'Only necessary' / 'Solo necesarias' -> href='#' (an action; should be a button)
- 'Allow embeds' / 'Permitir embeds' -> href='#' (an action)
- 'Privacy' / 'Privacidad' -> S-Legal = /privacy and /es/privacy (defined)
- footer Cookies reopening the choice vs the /cookies page (see issues)

## C:/Users/Victor/Documents/Repos/VictorGarces.com-NuxtUI/handoff/design/S-Legal.dc.html (day)
/privacy (and /terms with the same template), Legal/Page: title, legal tabs, sticky TOC and numbered sections from content/legal. Canvas 1440x1700.

**Sections:**
- Header (day): brand Albert Sans 700 18 -0.01em. 'Day' mono 12 accent, pill 72x36 #FFFFFF + border, knob left:3 accent, 'Night' muted. Nav gap 28 14/500. EN / ES pill surface + border
- Title: section pad 40 64 0; col gap 12 max-w 800: eyebrow 'LEGAL · PRIVACY', h1 Albert 700 56/1.02 -0.02em, lead 16/1.55 muted, 3 pills h38 (Privacy active accent/on-accent; Terms, Cookies surface + border), all non-link spans
- Body: section pad 40 64 0; grid 260px/1fr gap 48. Aside TOC: pad 20, surface, border, r18, sticky top 24, gap 10; eyebrow 'SECTIONS'; 7 links 13px (first accent, rest muted). Content col max-w 720 gap 32. Sections id s1..s7, gap 10: h2 Albert 700 24 -0.02em, p 15/1.55 muted, 2 skeleton lines h12 r6 --raised (100%, 96%), mono 10 source label (plain text, not a pill chip)
- Footer (day): same strings, muted

**Nav:** Work · About · Experience · Blog · Contact · EN / ES (no active item)

**Placeholders:**
- `placeholder · content/legal/privacy.md (x7, rendered as plain mono text)` → legal(privacy).body, split by h2 sections; TOC from body.toc
- `(bracket) Last updated [DATE]` → legal.updated
- `(no chip) eyebrow / h1` → legal.title

**Final copy:** "LEGAL · PRIVACY", "Privacy", "Last updated [DATE].", "Terms", "Cookies", "SECTIONS", "1. What this site collects", "Very little. No accounts, no tracking pixels.", "2. Analytics", "Cookieless analytics (Umami or Cloudflare Web Analytics): page views and referrers, no personal data, no cookies.", "3. Contact form", "Name, email and message go to Web3Forms and then to hello@victorgarces.me. Turnstile checks you are human.", "4. Media and CDN", "Images and video are served from media.victorgarces.me on AWS CloudFront; standard access logs, kept [N] days.", "5. Embeds", "YouTube and Instagram embeds load only after you accept them in the cookie banner.", "6. Your rights", "Ask for a copy or deletion of anything you sent through the form: hello@victorgarces.me.", "7. Changes", "This page shows its last-updated date at the top.", "aria-label: Switch to Filmmaker, night mode"

**Bracketed samples:** [DATE], [N] days

**Fonts:** Albert Sans, Source Code Pro

**Links/routes:**
- brand -> F-Home-Dev = /dev (defined)
- toggle -> F-Home-Film = /film (PAGES.md: on shared pages the toggle only flips the attribute, with no navigation)
- Work -> D-Work = /dev/work (defined)
- About -> D-About = /dev/about (defined)
- Experience -> D-About = /dev/about (no experience route or anchor defined)
- Blog -> D-Blog = /blog (defined)
- Contact -> /contact (defined)
- tabs Privacy/Terms/Cookies: non-link spans (-> /privacy, /terms, /cookies, all defined)
- TOC -> #s1..#s7 in-page anchors
- footer -> /privacy, /terms, /cookies
