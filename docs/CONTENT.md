# Content

All copy lives in `content/`; components render whatever the collections return. The schemas are in `content.schemas.ts` (shared by `content.config.ts` and the build-time validator), and `docs/MIGRATION.md` records where every piece of the old site went.

> **`projects.org`** names whose product a project is, when it is not Víctor's. Absent means
> his own work. The card renders "<role> for <org>" and the case study gains a FOR row, so a
> client or employer project can never read as if he owned it.

## Layout

```
content/
  en/ and es/            same files in both folders: the shared filename links translations
    projects/*.md        case studies (day)
    films/*.md           films (night); media fields point at manifest ids
    blog/*.md            posts; the `film` tag also shows a post in the Journal
    about/dev.md, film.md
    legal/privacy.md, terms.md, cookies.md
    pages/*.yml          page copy that belongs to no entry (headings, leads, SEO)
    experience.yml  filmography.yml  testimonials.yml  faq.yml  contact.yml  bag.yml
    index.yml            legacy home copy, removed in M3
  profile.yml            single-locale facts: email, city, timezone, availability, socials
  media/manifest.json    photos and videos (docs/MEDIA.md), not a collection
```

Every folder under `en/` and `es/` becomes two collections, `<name>_en` and `<name>_es`. `useLocalizedContent().collection('projects')` returns the one for the current locale. The build reports a file that exists in one language only.

## Collections

| collection | source | used by |
|---|---|---|
| `projects_*` | `projects/*.md` | day home (featured), `/dev/work`, `/dev/work/[slug]` |
| `films_*` | `films/*.md` | night home (featured), `/film/films`, `/film/films/[slug]` |
| `blog_*` | `blog/*.md` | `/blog`, `/blog/[slug]`, day home (latest 3), night home and `/film/journal` (tag `film`) |
| `about_*` | `about/{dev,film}.md` | About teasers and pages (`mode: dev` or `film`) |
| `legal_*` | `legal/*.md` | `/privacy`, `/terms`, `/cookies` |
| `pages_*` | `pages/*.yml` | page headings, leads and SEO |
| `experience_*` | `experience.yml` | day home timeline, `/dev/about` |
| `filmography_*` | `filmography.yml` | night home credits, `/film/about` |
| `testimonials_*` | `testimonials.yml` | both homes (`mode: dev \| film \| both`) |
| `faq_*` | `faq.yml` | both homes (`mode`, `featured`, `category`) |
| `contact_*` | `contact.yml` | `/contact` topics and option lists (labels only) |
| `bag_*` | `bag.yml` | `/bag` |
| `profile` | `profile.yml` | email, socials, city, availability, everywhere |

## Rules

- **Validation.** @nuxt/content does not run the zod schemas itself. A `content:file:afterParse` hook in `nuxt.config.ts` does: a file that does not match its schema, a missing alt text, a media id that is not in the manifest, or a `[bracketed]` placeholder outside a draft fails `pnpm generate` (in `pnpm dev` the file is left out with a warning).
- **Drafts.** Seed entries with `[bracketed]` sample copy carry `draft: true` (whole files for projects, films and posts; single entries inside faq and filmography). They show in dev and are dropped in production by `useLocalizedContent().published()`. Unknown years in `experience.yml` are `null`, never `[YEAR]`.
- **Images.** Local images are `{ src, alt }` under `public/` (covers, portraits). Photos and videos from the media pipeline are referenced by manifest id; the manifest supplies the alt (`alt_es` in Spanish), content can override it.
- **Keys.** `useAsyncData` keys must include the locale (and the slug on detail pages). Nuxt shares prerendered data between pages with the same key, so a shared key serves English data on Spanish pages.
- **Facts.** Real entries replace design placeholders; nothing is invented. Anything the owner still has to provide stays a draft or is left out (see `docs/MIGRATION.md` §7).

## Media until the pipeline exists

`pnpm media:ingest` (`scripts/media-ingest.mjs`) downloads the source photos, writes AVIF and WebP renditions plus a blurhash to `public/media/photos/`, and rewrites `content/media/manifest.json` in the pipeline's format. Videos without files are listed with `status: pending`, so components show a poster slot instead of a broken player. `pnpm media:pull` (M8) replaces this with the real manifest.
