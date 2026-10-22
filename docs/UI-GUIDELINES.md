# UI guidelines

Rules for building and reviewing UI in this repository. Read before touching a component, and
review against it with the `web-design-guidelines` skill (`.claude/skills/`).

Adapted from Vercel's [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines),
which are written for React. This version is rewritten for Vue 3 + Nuxt 4, a fully prerendered
static site, and the conventions already set in `CLAUDE.md`. Where the two disagree, the reason
is stated. MUST is a defect when broken, SHOULD needs a reason not to, NEVER is always a defect.

**Precedence.** `CLAUDE.md` hard rules, then `docs/PLAN.md` owner decisions, then the approved
artboards in `design/` and the tokens, then this file. A guideline never justifies changing an
artboard's copy, layout, palette or type.

## Accessibility

- MUST: Prefer native semantics (`<button>`, `<a>`, `<label>`, `<table>`, `<dialog>`) before ARIA.
- MUST: `<button>` for actions, `<NuxtLink>` for navigation. NEVER a `<div>` or `<span>` with `@click`, and never `@click` + `router.push()` where a link would do: a link keeps Cmd/Ctrl/middle-click and "open in new tab".
- MUST: Icon-only buttons have an `aria-label`, from `i18n/locales/*.json` like every other UI string.
- MUST: Decorative icons and SVGs carry `aria-hidden="true"`. Icons are inline SVG here (no icon module), so this is per component.
- MUST: Every form control has a `<label>` (wrapping it, or `for`/`id`) or an `aria-label`.
- MUST: Custom interactive elements handle the keyboard (`@keydown`), following the [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern they implement.
- MUST: Images have `alt`, or `alt=""` when decorative. Manifest photos get it from `useMediaManifest().alt()`, which already enforces it; content images from front matter, which the validation hook enforces.
- MUST: Async updates (mode switch, form result, validation) announce through a polite `aria-live` region. The mode switch already does.
- MUST: One `<h1>` per page, headings in order. Skip link to `#main` in the layout (and in `error.vue`, which has no layout).
- MUST: `scroll-margin-top` on anchor targets, at least the fixed header's height.
- MUST: Films have captions when the manifest lists them (`captions`), and media-chrome controls stay keyboard-operable. Decorative loops are `aria-hidden` and muted.
- MUST: Accessible names exist even where the design shows no label.

## Focus

- MUST: Visible focus on every interactive element, in both modes. The global `:focus-visible` ring in `tokens.css` (2px `--accent`) is the default; override it only with something at least as visible. Use `:focus-visible`, not `:focus`, so a click shows no ring.
- NEVER: `outline: none` without a `:focus-visible` replacement on the same element.
- SHOULD: `:focus-within` for compound controls (filters, the mode toggle).
- MUST: The fixed header, the mobile mode pill and the cross-mode banner never cover the focused element.
- MUST: Dialogs manage focus. Use native `<dialog>` with `showModal()` (the `Media/Lightbox` and mobile menu pattern), which traps focus and handles Esc, and return focus to the trigger on close.

## Forms

The only form is `/contact` (Web3Forms). These apply to it and to any form added later.

- MUST: `name` and the right `autocomplete` token on each field: `name`, `email`. NEVER `autocomplete="off"` on those two; it only fights the browser for no gain here.
- MUST: Correct `type` and `inputmode` (`type="email"`).
- MUST: `spellcheck="false"` on the email field.
- MUST: Mobile inputs at 16px or more, or iOS zooms on focus.
- NEVER: Block paste.
- MUST: Accept free text and validate after; never block typing. Trim values before sending.
- MUST: Submit stays enabled until the request starts, then shows a spinner and keeps its label ("Sending…").
- MUST: Errors inline next to the field; on a failed submit, focus the first one.
- MUST: Error messages say how to fix it, not only what went wrong.
- SHOULD: Placeholders show an example and end with `…`. Remember the `{'@'}` escape for an example address in the locale files.
- SHOULD: Warn before leaving with an unsent message (router guard plus `beforeunload`).
- MUST: Native `<select>` has an explicit `background-color` and `color`, or Windows dark mode renders it unreadable.
- MUST: Checkbox and radio share one hit target with their label.
- MUST: Topic or other state taken from the URL query is applied after mount (see Hydration).

## Navigation and state

- MUST: Every route through `localePath()`. Content `path` carries the collection prefix and is never a route.
- MUST: Filters live in the URL query, through `useQueryFilter()`, so they deep-link and survive Back.
- MUST: Back/Forward restores scroll position.
- MUST: Every nav entry resolves to a real page or anchor (`CLAUDE.md`).
- MUST: No dead ends: every page, the 404 included, offers a next step.
- MUST: Destructive actions confirm or offer undo. (None exist today.)

## Animation

- MUST: `prefers-reduced-motion` disables scrub, tilt and decorative loops; give a reduced variant or none.
- SHOULD: CSS first (`Reveal.vue`, transitions, scroll-driven animations), then the Web Animations API. GSAP is the only tweening library allowed, and only for what CSS cannot do.
- MUST: Animate `transform` and `opacity` only. NEVER layout properties (`top`, `left`, `width`, `height`).
- NEVER: `transition: all`. List the properties, and take durations from the tokens (`--t-card`, `--t-page`, `--t-mode`).
- MUST: Correct `transform-origin`. In SVG, transform a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`. This matters for the M10 SVG heroes.
- MUST: Animations are interruptible and driven by input. Autoplay only for muted, non-essential loops; anything over 5 s next to other content gets pause, stop or hide.
- SHOULD: Animate only to explain cause and effect, or for deliberate delight.

## Typography and copy

- MUST: `…`, not `...`, including loading states ("Loading…").
- MUST: Curly quotes `“ ”` and apostrophes `’` in copy.
- NEVER: Em-dashes anywhere in UI copy (`CLAUDE.md`). This overrides any style guide.
- MUST: Non-breaking spaces where a break would read wrong: `10&nbsp;MB`, `⌘&nbsp;K`, names.
- MUST: `font-variant-numeric: tabular-nums` where numbers are compared (dates in the timeline, durations).
- SHOULD: `text-wrap: balance` on headings, `text-wrap: pretty` on body text.
- MUST: Artboard copy is final and placeholders stay in brackets. Never invent dates, clients or numbers.
- SHOULD: Active voice, numerals for counts, specific button labels ("Send message", not "Continue"), `&` only where space is tight.
- Not adopted: Chicago Title Case (artboard casing is final) and "second person, avoid first person" (this is a personal site, written in the first person on purpose).

## Content handling

- MUST: Text containers survive short, average and very long content: `truncate`, `line-clamp-*` or `break-words`.
- MUST: Flex children that truncate get `min-w-0`.
- MUST: Empty states render something deliberate: no broken card for a missing cover, no empty section for an empty collection.
- MUST: `<title>` matches the page, through `useSeo()`.

## Images and media

- MUST: Every `<img>` has `width` and `height`. Manifest photos take them from the manifest, so nothing shifts.
- MUST: The LCP image gets `fetchpriority="high"` and no lazy loading; everything below the fold gets `loading="lazy"`.
- SHOULD: Show the blurhash average (`placeholderColor()`) behind a loading photo.
- SHOULD: Muted `<video autoplay muted loop playsinline>` instead of a GIF, with a still for reduced motion.
- MUST: Video code (media-chrome, hls) and any 3D code is lazy and never blocks first paint.
- Gotcha: `slot="media"` must stay a real attribute; `eslint --fix` breaks it (`Media/FilmPlayer.vue`).

## Performance

- MUST: Zero third-party origins on load. It is a published property of this site, not a guideline.
- SHOULD: `<link rel="preconnect">` only for first-party asset hosts, such as the media subdomain once the pipeline serves from it.
- Fonts are self-hosted by `@nuxt/fonts`, with `preload: false` on purpose (see the comment in `nuxt.config.ts`). Change it only with an LCP measurement in hand.
- NEVER: Layout reads (`getBoundingClientRect`, `offsetHeight`, `scrollTop`) in `setup` or render. Read after mount, batch reads before writes, and use `requestAnimationFrame` for scroll work.
- SHOULD: Flex and grid over JavaScript measurement.
- MUST: Keep initial JS on the homes within the budget in `docs/MIGRATION.md`, and LCP under 2.5 s on 4G.
- MUST: Profile with CPU and network throttling, with extensions disabled. Use Vue DevTools for re-renders.
- Not adopted: list virtualization (no list here comes near 50 items) and the 500 ms mutation target (a static site has no mutations beyond the contact form).

## Touch and layout

- MUST: Hit targets of 24px or more, 44px on touch; expand the hit area when the visual is smaller.
- MUST: `touch-action: manipulation`.
- SHOULD: `-webkit-tap-highlight-color` set on purpose, with a token colour or `transparent` plus a visible `:active` state.
- MUST: `overscroll-behavior: contain` on `<dialog>`s and the mobile menu.
- SHOULD: `overscroll-behavior: none` on `<html>` only inside `@media (pointer: fine)`; keep coarse-pointer defaults for pull-to-refresh.
- MUST: Fixed elements at the edges respect `env(safe-area-inset-*)`, the bottom mode pill especially.
- MUST: No accidental horizontal scroll at any width. Check phone, laptop and ultra-wide (50% zoom).
- NEVER: `user-scalable=no` or `maximum-scale=1`.

## Modes and theming

- MUST: Mode is `data-mode` on `<html>`, and every colour, radius and font comes from `tokens.css`. No hex in components (OG images excepted).
- MUST: `color-scheme` follows the mode, not the OS. `tokens.css` sets it per `data-mode`; keep it there.
- MUST: `<meta name="theme-color">` matches the page background, from `utils/mode.ts`.
- NEVER: Branch templates on mode. Render both with `.day-only` / `.night-only`.
- MUST: Hover, active and focus raise contrast over rest, in both modes. Meet contrast; APCA preferred over WCAG 2.
- SHOULD: Nested radii concentric (child no larger than parent), shadows layered, borders tinted toward the background.

## Locale and i18n

- MUST: UI strings in `i18n/locales/{en,es}.json`, content in `content/{en,es}/`. Nothing user-facing hard-coded in a component.
- MUST: Dates and numbers through `Intl.DateTimeFormat` / `Intl.NumberFormat` with the current locale (`en-US`, `es-DO`). Never a hand-built format.
- MUST: The language comes from the URL prefix. Any detection uses `navigator.languages`, never IP.
- SHOULD: `translate="no"` on names, project names and code tokens.

## Hydration

Pages are prerendered in day mode with no query string, then hydrated. Vue rectifies node types
and form values on hydration but never classes, so a mismatch is permanent.

- MUST: State from the URL query is applied after mount (`useQueryFilter()`), never in `setup`.
- MUST: Dates are formatted with an explicit locale and `timeZone`, so the build machine and the browser agree.
- MUST: `useAsyncData` keys include the locale and slug.
- SHOULD: `data-allow-mismatch` only where a mismatch is intended and harmless, with a comment saying why.
- Not adopted: the React rules on controlled inputs and `onChange`. In Vue, `v-model` covers it.

## Anti-patterns to flag

- `user-scalable=no` or `maximum-scale=1`
- Paste blocked on an input
- `transition: all`
- `outline: none` without a `:focus-visible` replacement
- `@click` navigation without a link; `<div>`/`<span>` with click handlers
- `<img>` without `width` and `height`
- Inputs without a label; icon buttons without `aria-label`
- Hand-built date or number formats
- `autofocus` without a reason (desktop, single primary input only)
- Animated GIF where a muted video would do
- Gesture-only actions with no click or keyboard alternative
- Hex colours in a component, template branches on mode, query state read in `setup`
- Em-dashes in copy, `...` instead of `…`

## Review output

Group by file, one finding per line as `file:line - issue`, so VS Code can open it. Terse: state
the problem and its location; explain only when the fix is not obvious. A clean file is `✓ pass`.
No preamble.

```text
## app/components/Shell/Header.vue

app/components/Shell/Header.vue:42 - icon button missing aria-label
app/components/Shell/Header.vue:67 - transition: all → list properties

## app/components/Media/Lightbox.vue

app/components/Media/Lightbox.vue:12 - missing overscroll-behavior: contain

## app/components/Ui/Arrow.vue

✓ pass
```
