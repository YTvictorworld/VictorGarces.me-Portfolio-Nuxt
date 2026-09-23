# Component map

Naming: `app/components/<Group>/<Name>.vue`, auto-imported as `<GroupName>`. Every visual component reads mode from CSS (`[data-mode]` on html) and never from a prop, except where structure changes (marked `mode` prop). Props are typed from the collections in `content.config.ts`.

## Shell
| component | artboards | notes |
|---|---|---|
| `Shell/Header` | all F, D, N | brand (serif at night), `Shell/ModeToggle`, nav from `useNav(mode)`, `Shell/LangSwitch` |
| `Shell/ModeToggle` | F-Sistema | 72×36 pill, knob left = day, right = night. Emits `change`, runs `useModeTransition()` (circle clip-path from the knob), announces "Filmmaker mode" / "Developer mode" via `aria-live="polite"` |
| `Shell/MobileModePill` | M-Home-* | fixed bottom pill, same toggle |
| `Shell/Footer` | all | year, city, Privacy · Terms · Cookies; extra line at night |
| ~~`Shell/CookieBanner`~~ | ~~S-Cookies~~ | **Cancelled.** No embeds (owner decision) and no analytics cookies, so there is nothing to consent to. `/cookies` is a static notice rendered with the S-Legal template. |
| `Shell/Placeholder` | everywhere | dashed box + chip; renders `slot` when data exists, chip when it does not; hidden in production unless `showPlaceholders` |

## First visit
| component | artboard | notes |
|---|---|---|
| `FirstVisit/Split` | F-Landing | both sides and the Enter button in one component (the group is `FirstVisit/`, not `Landing/`, see PLAN M3) |
| `Landing/EnterButton` | F-Landing, F-Sistema | state `hover: 'day' \| 'night' \| null`; label "Enter" / "Enter as Developer" / "Enter as Filmmaker"; colors black / accent-day / accent-night; default target day; on click store mode, transition, navigate to `/dev` or `/film`. Mobile: tap a card selects, tap Enter goes |

## Home, day (`pages/dev/index.vue`)
| component | artboard section |
|---|---|
| `Hero/Dev` | F-Home-Dev hero: eyebrow, h1, lead, two buttons, CV note, `Hero/PageExploded` (3D) |
| `Work/FeaturedGrid` | 3 `Work/ProjectCard` + `Work/MoreTile` (stack of 3 ghost cards, "[N] more", arrow, whole tile links to `/dev/work`) |
| `About/Teaser` | portrait, h2, two lines, "More about me", stack chips |
| `Experience/Timeline` | 150 px year col, dot, title + line; first dot filled |
| `Blog/LatestGrid` | 3 `Blog/PostCard`, "All posts" button |
| `Testimonials/Grid` | 3 `Testimonials/Card`, first one raised background; becomes `Testimonials/Carousel` when count > 3 |
| `Faq/List` | 4 `Faq/Item` (`aria-expanded`, chevron rotates), first open |
| `Contact/Block` | dark rounded block, email, socials, one-field quick form |

## Home, night (`pages/film/index.vue`)
| component | artboard section |
|---|---|
| `Hero/Film` | F-Home-Film hero: `Hero/MoonStage` (TresJS: sphere as light + 3 floating frames with stills from manifest) + copy + "Watch the reel" |
| `Film/NowShowing` | 2fr/1fr: `Media/FilmPlayer` + credits card + Film page / Vertical cut buttons |
| `Photo/Filmstrip` | horizontal scroll, mixed aspect ratios, last tile "+N", "All photography" |
| `Work/MoreRow` | Reel card, second featured, `Work/MoreTile` (night variant, links `/film/films`) |
| `Filmography/Credits` | services pills + one-line-per-credit list (year, title serif, role, note) |
| `Testimonials/Single` | one quote centered, prev/next, dots, auto-advance 8 s, pauses on hover/focus |
| `Blog/JournalRow` + `About/TeaserCard` | two horizontal post cards left, About card right |
| `Faq/TwoColumn` | same `Faq/Item`, 2-col grid, no title column |
| `Contact/BookShoot` | email + 3 fields (date, place, what happens) |

## Inner pages
| component | artboard |
|---|---|
| `Page/Title` | eyebrow + h1 + lead + right slot (filters), used on every index page |
| `Work/Filters`, `Work/Grid` | D-Work |
| `Work/CaseStudy` (`Work/MetaBar`, `Work/Section` numbered 01 to 04, `Work/DecisionGrid`, `Work/Gallery`, `Work/NextCard`) | D-Project |
| `Blog/List` (rows), `Blog/Pagination` | D-Blog |
| `Blog/Article` (prose from MDC), `Blog/Toc` sticky, `Blog/Share`, `Blog/PrevNext` | D-Post; same component at night (serif h1/h2) |
| `About/Page` (portrait, story, stack groups, timeline, Now block) | D-About; `About/PageFilm` swaps stack for `About/Kit` and `About/Services` | N-About |
| `Contact/Form` (topic switch changes fields), `Contact/Aside` | D-Contact |
| `Film/Index` (`Film/FeaturedCard` + `Film/Grid`) | N-Films |
| `Film/Page` (`Media/FilmPlayer` full width, synopsis, `Film/Credits`, `Film/Stills`, `Film/VerticalCut`, next) | N-Film |
| `Photo/Series` (pills) + `Photo/Masonry` (3 cols, `Media/FilmImage`, lightbox) | N-Photography |
| `Blog/JournalGrid` | N-Journal |
| `Legal/Page` (title block, `Legal/Tabs`, sticky table of contents from `body.toc`, numbered prose sections) | S-Legal |
| `Legal/Tabs` (Privacy / Terms / Cookies as real NuxtLinks from `useNav().legal`, `aria-current` on the open one) | S-Legal |
| `error.vue` | S-404, split by mode |

## Shared page furniture (M4)
| component | notes |
|---|---|
| `Page/Title` | eyebrow (with an optional count) + h1 + lead, plus a right slot for filters or actions. Every index page uses it; `/contact` does not, because its eyebrow and lead change with the mode |
| `Ui/Filters` | pill filters as buttons with `aria-pressed`; the page keeps the value in the URL (`?kind=`, `?series=`, `?tag=`) so a filtered list can be shared |
| `Shell/CrossModeBanner` | "Looking for the film side?" at the end of an index; switches mode and opens that home through `useModeSwitch().enter` |
| `Contact/Cta` | closing dark block on a detail page: question, email, link to `/contact` |

## Media
| component | notes |
|---|---|
| `Media/FilmImage` | reads manifest entry: srcset of 480/960/1440/2048 AVIF + WebP, blurhash placeholder, `alt` required, `sizes` from prop |
| `Media/FilmPlayer` | media-chrome + `hls-video-element`; poster and HLS master from manifest; muted autoplay loop for `preview` variant; captions from `.vtt` if present; no third-party branding |
| `Media/Lightbox` | keyboard: arrows, Esc; focus trap; swipe on touch |

## 3D
| component | notes |
|---|---|
| `Hero/PageExploded` | `<ClientOnly>`, lazy; loads `public/models/page-exploded.glb` with `useGLTF`; GSAP ScrollTrigger scrubs `position.z` of `layer_*`; hover tilt; static PNG fallback (`public/models/page-exploded.png`) on mobile and reduced motion |
| `Hero/MoonStage` | procedural: sphere light + 3 planes textured with manifest stills, parallax on pointer; static fallback |

## Open Graph (M6)
| component | notes |
|---|---|
| `OgImage/OgDay.satori.vue`, `OgImage/OgNight.satori.vue` | S-OG-Dev / S-OG-Film, 1200×630, rendered by Satori at build time. The `.satori.vue` suffix is required by nuxt-og-image v6. Literal hex and flexbox only: Satori resolves no CSS custom properties and has no grid, which is the exception the "no hard-coded hex" rule allows. Props: `title`, `description`, `eyebrow`, all supplied by `useSeo()`. |

## Composables
- `useMode()` → `{ mode, setMode, isDay, isNight }`; localStorage `vg-mode` (no cookie, see PLAN M1); inline head script sets `data-mode` before paint.
- `useModeTransition()` → circle clip-path animation, respects reduced motion.
- `useNav(mode)` → nav items per mode with i18n keys.
- `useSeo({ title, description, mode?, type?, cardTitle?, meta? })` → title, description and the Open Graph card in one call. Every page uses it; none calls `useSeoMeta` directly. The template is OgDay unless the route forces night.
- `usePersonSchema(profile, jobTitle)` → Person structured data from `content/profile.yml`, on the landing and both About pages.
