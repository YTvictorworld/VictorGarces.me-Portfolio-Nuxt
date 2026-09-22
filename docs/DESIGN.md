# Design system

Source of truth: `design/F-Sistema.dc.html` (tokens, Enter states, placeholder legend, 3D contract) and the artboards next to it. Everything below is already in `snippets/tokens.css`.

## Tokens

| token | day (Developer) | night (Filmmaker) |
|---|---|---|
| `--bg` | #F7F7F4 | #121010 |
| `--surface` | #FFFFFF | #1C1817 |
| `--raised` | #E6F1EC | #262120 |
| `--text` | #151617 | #F1EBE3 |
| `--muted` | #5F6266 | #A69C91 |
| `--accent` | #1F7A63 | #E2A15B |
| `--on-accent` | #FFFFFF | #121010 |
| `--border` | #E2E1DB | #2C2624 |
| `--dark` (contact block) | #151617 / text #F7F7F4 / muted #A5A7AE | #1C1817 / text #F1EBE3 / muted #A69C91 |
| `--ph` (placeholder outline, dev only) | rgba(31,122,99,.55) | rgba(226,161,91,.5) |

Night has no drop shadows; day has none either, only 1 px borders. The only shadows are on floating elements: the first-visit Enter button (`0 16px 40px rgba(21,22,23,.28)`), the mobile mode pill and the cookie banner (`0 20px 50px rgba(0,0,0,.25)`).

Night-only texture: film stills and posters get a 6 % grain overlay and warm glow ellipses at 9 to 12 % opacity behind the hero (`accent` at low alpha). Do not use gradients anywhere else.

## Type
- Body, both modes: **Albert Sans** 400/500/600/700. 15 to 20 px, line-height 1.5 to 1.6.
- Display day: Albert Sans 700, letter-spacing -0.02em to -0.03em, line-height 1 to 1.1.
- Display night: **Newsreader** italic 500 (optical size axis on), line-height 0.98 to 1.15. Night body stays Albert Sans.
- Meta, eyebrows, chips, code: **Source Code Pro** 400/500, 10 to 12 px, letter-spacing 0.04 to 0.06em, uppercase for eyebrows.
- Load with @nuxt/fonts, `font-display: swap`, subset latin + latin-ext. Preload the two display faces only.

Scale: h1 76 to 88 (home), 56 to 64 (inner pages), h2 36 (day) / 42 (night), h3 22 to 26, body 15 to 17, meta 11 to 12. Mobile: h1 40 to 44, h2 24 to 28.

## Shape
- Cards 22 px, large stages and contact blocks 28 px, first-visit cards 32 px, chips and controls 999 px, image placeholders 14 px inside cards, 18 px standalone.
- Borders 1 px `--border`. Placeholder outlines 1.5 px dashed `--ph` (dev builds only; hide behind `NUXT_PUBLIC_SHOW_PLACEHOLDERS=false`).
- Page gutter 64 px desktop, 20 px mobile. Grid gap 20 to 24 px. Section top padding 40 px (48 on About).

## Motion
- Micro (hover, focus, chips): 200 ms ease-out.
- Cards and lists: 240 ms ease-out-quart.
- Mode transition day to night: 700 ms. A circle clip-path grows from the toggle position, headlines swap to serif italic at 50 %, the day sphere becomes the night moon (same element, re-lit). Night to day is the reverse.
- First visit Enter: hovering a card recolors the button in 200 ms; clicking runs the mode transition then navigates.
- 3D hero: idle float 6 s loop, scroll scrub over the hero height, hover tilt up to 8° in 300 ms. See `docs/3D.md`.
- `prefers-reduced-motion`: no scrub, no tilt, no circle; mode changes cross-fade 150 ms.

## Placeholder convention
Dashed outline + chip `placeholder · <source>` = data-driven. The chip text is the contract:
- `content/projects` `cover.avif` `diagram.svg` → projects collection
- `media manifest` `still` `reel poster` `preview.mp4` → `content/media/manifest.json`
- `content/blog` `tag film` → blog collection
- `content/experience.yml` `content/filmography.yml` `content/testimonials.yml` `content/faq.yml` `content/about.md` `content/contact.yml`
- `public/cv-victor-garces.pdf` `portrait.avif` `portrait-film.avif`
- `GLB from Claude Design` → `public/models/page-exploded.glb`

Text in `[brackets]` is sample content. It must come from the seed files, never from a template literal.

## Per-mode differences beyond color
| | Day | Night |
|---|---|---|
| Nav | Work · About · Experience · Blog · Contact | Films · Photography · Journal · About · Contact |
| Home structure | hero → work (3 + more) → about → experience → blog → testimonials (3 cards) → faq → contact | hero → now showing → stills strip → more work → credits → one testimonial → journal + about → faq (2 col) → book a shoot |
| Hero object | exploded page GLB | moon glow + floating frames (built in TresJS, no GLB) |
| Contact copy | "Quick message", topic Web project | "Book a shoot", topic Film or photo, date + place fields |
| Footer | identical, plus "All films and photographs are original work" at night |
