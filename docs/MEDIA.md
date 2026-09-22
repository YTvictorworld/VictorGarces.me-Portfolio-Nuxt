# Media

The AWS pipeline lives in its own repo (`victorgarces-media-pipeline`, CDK). This repo only consumes `https://media.victorgarces.me/manifest.json`, copied into `content/media/manifest.json` by `pnpm media:pull` (a small script in `scripts/media-pull.ts`, run before `pnpm generate`). Until the pipeline exists, a hand-written manifest with a few local files in `public/media/` keeps the components working; `Media/*` components must not care where the URL points.

## manifest.json
```json
{
  "version": 1,
  "base": "https://media.victorgarces.me/public",
  "photos": {
    "events-2025-09": {
      "series": "events-2025",
      "alt": "",
      "width": 6000, "height": 4000,
      "blurhash": "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
      "sizes": [480, 960, 1440, 2048],
      "formats": ["avif", "webp"],
      "path": "photos/events-2025-09"
    }
  },
  "videos": {
    "por-que-no": {
      "title": "¿Por qué no?",
      "duration": 364,
      "aspect": "16:9",
      "hls": "video/por-que-no/master.m3u8",
      "renditions": [1080, 720, 480, 360],
      "poster": "video/por-que-no/poster.jpg",
      "preview": "video/por-que-no/preview.mp4",
      "captions": [{ "lang": "es", "src": "video/por-que-no/es.vtt" }]
    }
  },
  "series": {
    "events-2025": { "title": "Events 2025", "photos": ["events-2025-01", "events-2025-02"] }
  }
}
```
URL for a photo rendition: `${base}/${path}-${size}.${format}`. `alt` in the manifest is a default; the film or photo entry in content can override it, and the schema requires one of the two to be non-empty.

## Components
- `Media/FilmImage` props: `id`, `sizes` (CSS sizes string), `alt?` (overrides manifest), `priority?` (eager + fetchpriority high for LCP). Renders `<picture>` with AVIF then WebP sources, blurhash canvas behind, `width`/`height` attributes to avoid CLS.
- `Media/FilmPlayer` props: `id`, `variant: 'full' | 'inline' | 'preview'`. `full` = media-chrome controls (play, time, seek, captions, quality, fullscreen), keyboard accessible, no branding. `preview` = muted autoplay loop of `preview.mp4`, `playsinline`, pauses when off-screen (IntersectionObserver). Uses `hls-video-element`; on Safari native HLS is used.
- `Media/Lightbox`: opens `FilmImage` at the 2048 size, arrows, Esc, swipe.

## Rules
- Never hotlink from Vimeo, YouTube or Instagram inside the site; external links only.
- `Content-Security-Policy`: allow `media.victorgarces.me` for `img-src`, `media-src` and `connect-src` (HLS segments).
- Photography page loads the first 6 images eager, the rest lazy.
- Every `FilmImage` on the film pages has `loading="lazy"` except the hero poster.
