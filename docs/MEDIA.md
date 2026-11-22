# Media

The media pipeline lives in its own repo, `victorgarces-media-pipeline` (Terraform, S3, Lambda,
MediaConvert, CloudFront). This site never calls AWS and never knows a bucket name: the only thing
it reads is the pipeline's `manifest.json`, copied into `content/media/manifest.json` by
`pnpm media:pull` before every build. Until the pipeline is deployed, a hand-written manifest with
a few local files in `public/media/` keeps the components working; `Media/*` components do not
care where the URLs point.

## How the two connect

```
upload ─► S3 originals/ ─► Lambdas (images, video + MediaConvert) ─► sidecars/ ─► manifest Lambda
                                                                                     │
                     public/ ─► CloudFront ─► https://media.garceslab.me ◄───────┤ writes manifest.json
                                                                                     │
                                         GitHub repository_dispatch "media-updated" ◄┘ only if it changed
                                                         │
          .github/workflows/deploy.yml ─► pnpm media:pull ─► pnpm generate ─► gh-pages ─► garceslab.me
```

The site is rebuilt when media changes rather than reading the manifest at runtime. Prerendering
puts each photo's `width`, `height` and blurhash colour in the HTML, so nothing shifts while
images load and the LCP image is in the first response; a runtime fetch would give that up for
every visitor to save one rebuild per upload. A burst of uploads cancels into one deploy
(`concurrency` in `deploy.yml`).

## The contract: manifest.json

```json
{
  "version": 1,
  "base": "https://media.garceslab.me",
  "photos": {
    "events-2025-09": {
      "series": "events-2025",
      "alt": "Speaker on stage at a community event, lit from the side",
      "alt_es": "Ponente en el escenario de un evento comunitario, con luz lateral",
      "width": 6000,
      "height": 4000,
      "blurhash": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
      "sizes": [480, 960, 1440, 2048],
      "formats": ["avif", "webp"],
      "path": "photos/events-2025-09",
      "featured": true
    }
  },
  "videos": {
    "por-que-no": {
      "title": "¿Por qué no?",
      "duration": 364,
      "aspect": "16:9",
      "hls": "video/por-que-no/hls/por-que-no.m3u8",
      "renditions": [1080, 720, 480, 360],
      "poster": "video/por-que-no/frames/frame.0000002.jpg",
      "captions": [{ "lang": "es", "src": "video/por-que-no/es.vtt" }],
      "status": "ready"
    }
  },
  "series": {
    "events-2025": { "title": "Events 2025", "title_es": "Eventos 2025", "date": "2025-09", "cover": "events-2025-09", "photos": ["events-2025-09"] }
  }
}
```

Rules, enforced by `manifestSchema` and `checkManifest` in `content.schemas.ts`, which both
`pnpm media:pull` and the build run:

- `base` is the CDN origin, absolute and `https`. It does not include `/public`: CloudFront's
  origin path already maps `/` to the bucket's `public/` prefix. Plain `http` is accepted only for
  `localhost`, for the emulator.
- Every other path is relative to `base`. A photo rendition is `${base}/${path}-${size}.${format}`.
- `aspect` is `W:H` with integers (`16:9`, `9:16`), never `16 / 9`.
- Every photo has `alt` (3 characters or more); `alt_es` is used on Spanish pages when present.
- A video is `pending` until it has `hls`; components then show the poster and "coming soon".
- A series can only list photos that exist in the manifest, and its `cover`, when present, is one of them.
- A series is an album on `/film/photography`. `date` (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`) orders the
  albums newest first and groups them by year; an album without one is listed last. `cover` is the
  photo in front of the album's fan and the first one when it opens; without it, the first photo.
- `featured` photos fill the showcase at the top of `/film/photography`. With none featured, the
  newest albums' covers do.

`media:pull` validates before it writes. A manifest that fails stops the deploy at that step and
leaves the last good one in place; the live site is untouched.

## Where configuration and secrets live

This repository is public, so it records *where* each setting lives and never a value, a resource
name or a command that would carry one. The pipeline's own runbook, kept out of this repo, holds
the specifics.

| What | Where it lives | Secret |
| --- | --- | --- |
| `MEDIA_MANIFEST_URL` | This repo's Actions **variables** | No: it is the public manifest URL |
| `WEB3FORMS_KEY` | This repo's Actions **secrets** | No: it names the form, not an account |
| The token that triggers a rebuild | An encrypted parameter in the AWS account's parameter store, read only by the manifest function | **Yes** |
| Cloud credentials for deploying the pipeline | Outside both repositories: short-lived credentials from the identity provider, and keyless OIDC in CI | **Yes** |
| Terraform state | Private remote storage in the same account, configured by an uncommitted backend file | Private |
| TLS certificate and DNS for the media host | The certificate service and the domain's registrar | No |

Principles that hold whatever the specifics:

- **This repository holds no cloud credentials.** It downloads one public URL; the rebuild is
  triggered from the pipeline's side.
- **The rebuild token is as narrow as GitHub allows**: a fine-grained token for this repository
  only, with the single permission `repository_dispatch` needs, and an expiry. When it lapses,
  uploads still publish to the CDN and only the automatic rebuild stops; a deploy can still be run
  from the Actions tab. It is never stored in Terraform, in a function's environment or in a
  repository.
- **Infrastructure is applied deliberately.** The pipeline's Terraform refuses to touch a real
  account unless it is explicitly allowed and the caller is the expected account.

## First deployment, in order

1. Deploy the pipeline from its repository, with the production settings and the media host's
   domain.
2. Validate the certificate, then point the media host at the CDN, both at the domain's registrar.
3. Create the rebuild token and store it where the manifest function reads it.
4. Upload a first photo with its `alt` metadata and confirm the public manifest lists it.
5. Set `MEDIA_MANIFEST_URL` in this repo and run **Deploy to gh-pages** by hand once. From then on
   uploads rebuild the site on their own.
6. Move the remaining photos to the pipeline, then delete `public/media/photos/` and
   `scripts/media-ingest.mjs`, the local stand-in.

## Local development against the emulator

```bash
# One terminal: follow the emulator's manifest, Ctrl+C to stop
MEDIA_MANIFEST_URL=http://localhost:4566/victorgarces-media-local/public/manifest.json pnpm media:watch

# Another: the dev server reloads whenever the manifest changes
pnpm dev
```

`media:watch` polls every two seconds and writes only a manifest that passes the same checks as
`media:pull`; one that would fail is reported and skipped, and the watch carries on through an
emulator restart. On Ctrl+C it puts back the manifest that was on disk when it started, because
the committed file is the fallback for local work and forks and CI always pulls a fresh one. If
it was killed rather than stopped, restore it by hand (`git checkout content/media/manifest.json`).
`media:pull` with the same variable does a single copy, and leaves restoring to you.

## What the pipeline has to do for this side

- Write `aspect` as `W:H`.
- After writing `manifest.json`, send a `repository_dispatch` with the event type
  `media-updated` to this repository, **only if the file changed**, and skip it when no token is
  configured, which is the emulator's case.
- Make sure the build sees the new file: either do not cache `/manifest.json` at the edge
  (nothing but the build ever reads it, so caching saves nothing), or invalidate it before
  dispatching.
- Allow `https://garceslab.me` in CORS, for the HLS playlists and segments.
- Serve renditions with `Cache-Control: public, max-age=31536000, immutable`; a changed photo gets
  a new id.

## Components

- `Media/FilmImage` props: `id`, `sizes` (CSS sizes string), `decorative?` (empty alt),
  `priority?` (eager and `fetchpriority="high"`, for the LCP image). Renders a `<picture>` with
  AVIF then WebP sources, `width`/`height` from the manifest to avoid layout shift, and the
  blurhash's average colour behind it while it loads.
- `Media/FilmPlayer` props: `id`, `poster?`, `title?`, `priority?`. media-chrome controls (play,
  time, seek, captions, quality, fullscreen), keyboard accessible, no third-party branding. The
  player code loads on the client only, after the poster; a `pending` video shows the poster with
  "coming soon".
- `Media/Lightbox`: opens a photo at its largest rendition, with arrows, Esc and swipe.

## Rules

- Never hotlink from Vimeo, YouTube or Instagram inside the site; external links only.
- The media host is first-party (`media.garceslab.me`), so it does not break the
  zero-third-party-origins rule. `nuxt.config.ts` adds a `preconnect` to it as soon as the
  manifest's `base` is absolute.
- If a Content-Security-Policy is ever added, allow the media host for `img-src`, `media-src` and
  `connect-src` (HLS segments are fetched).
- On `/film/photography` the first two photos load with high priority, the rest lazily. Every
  other `FilmImage` is lazy except the one that is the page's LCP.
