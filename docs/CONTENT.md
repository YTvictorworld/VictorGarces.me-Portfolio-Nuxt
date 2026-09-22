# Content

`snippets/content.config.ts` is the schema. Seed files use the bracketed placeholders from the design so the pages render before the owner fills them in. Every image field requires `alt`; the schema rejects entries without it.

## Collections
| collection | path | used by |
|---|---|---|
| `projects` | `content/projects/*.md` | day home (featured), `/dev/work`, `/dev/work/[slug]` |
| `films` | `content/films/*.md` | night home (featured), `/film/films`, `/film/films/[slug]`; media fields reference manifest ids |
| `blog` | `content/blog/*.md` | `/blog`, `/blog/[slug]`, day home (latest 3), night home and `/film/journal` (tag `film`) |
| `experience` | `content/experience.yml` | day home, `/dev/about` |
| `filmography` | `content/filmography.yml` | night home credits, `/film/about` |
| `testimonials` | `content/testimonials.yml` | both homes; `mode: dev \| film \| both` picks where a quote shows |
| `faq` | `content/faq.yml` | both homes; `mode` field, one list per mode |
| `about` | `content/about.md` (+ `about-film.md`) | About teasers and pages; fields `now`, `stack`, `kit`, `services` |
| `contact` | `content/contact.yml` | topics, budget options, timeline options, socials, response time |
| `legal` | `content/legal/privacy.md`, `terms.md` | `/privacy`, `/terms`; `updated` date |
| `media` | `content/media/manifest.json` | not a collection, plain JSON read by `useMediaManifest()`; pulled by `pnpm media:pull` |

Spanish: content files can have an `es` sibling (`*.es.md`, `experience.es.yml`) resolved by locale with fallback to English. UI strings live in `i18n/locales/{en,es}.json`.

## Seed set (create these, values from the artboards)
- projects: `ada-system.md` (featured, order 1), `sigmedic.md` (featured, 2), `media-pipeline.md` (featured, 3), plus three non-featured `[client-site]`, `[experiment]`, `[older-build]`.
- films: `por-que-no.md` (featured, short, 6 min, credits as in N-Film), `reel-2026.md` (reel), `[client-video].md`.
- blog: five posts with `[Existing post title 0N]`, one tagged `film` twice. Migrate the real posts from the current repo's `content/` first and keep their slugs so old URLs still resolve; add redirects for any that change.
- experience: the four entries from the design, years `[YEAR]`.
- filmography: `¿Por qué no?` 2026, event photography 2025, two `[Title]` placeholders.
- testimonials: three `[Testimonial 0N]`, mode `both`.
- faq: four per mode, questions from the design at night; day questions are placeholders.
- about: headline and the three-paragraph placeholder; `stack` groups from D-About; `kit` and `services` from N-About.
- contact: topics `web`, `film`, `hello`; budget and timeline option lists as placeholders.
- legal: privacy sections from S-Legal (they are real, keep them); terms sections: use of the site, content ownership, third-party links, no warranty, contact.

## Migration from the current repo
Before writing new seed files, read the existing `content/` and `i18n/locales/*.json` in the repo. Anything that already exists (blog posts, testimonials, FAQ answers, experience years, about text) replaces the bracketed placeholder. Do not lose a single entry; if a field does not fit the new schema, extend the schema, do not drop the data.
