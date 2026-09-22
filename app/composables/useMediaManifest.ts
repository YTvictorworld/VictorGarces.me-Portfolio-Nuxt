import manifestJson from '~~/content/media/manifest.json'

/**
 * Shape of content/media/manifest.json as it sits on disk (docs/MEDIA.md). It is validated
 * at build time against `manifestSchema` in content.schemas.ts; this interface mirrors it
 * without shipping zod to the browser.
 */
export interface ManifestPhoto {
  series?: string
  alt: string
  alt_es?: string
  width: number
  height: number
  blurhash: string
  sizes: number[]
  formats: Array<'avif' | 'webp'>
  path: string
}

export interface ManifestVideo {
  title: string
  duration?: number
  aspect: string
  hls?: string
  renditions?: number[]
  poster?: string
  preview?: string
  captions?: Array<{ lang: string, src: string }>
  status?: 'ready' | 'pending'
}

export interface MediaManifest {
  version: 1
  base: string
  photos: Record<string, ManifestPhoto>
  videos: Record<string, ManifestVideo>
  series: Record<string, { title: string, title_es?: string, photos: string[] }>
}

const manifest = manifestJson as MediaManifest

const BASE83 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~'

/** Average color of a blurhash (its DC component): a free placeholder, no canvas needed. */
function blurhashAverage(hash: string): string | undefined {
  if (hash.length < 6) return undefined
  let value = 0
  for (const char of hash.slice(2, 6)) value = value * 83 + BASE83.indexOf(char)
  return `rgb(${value >> 16} ${(value >> 8) & 255} ${value & 255})`
}

/**
 * Reads the media manifest. Components never build media URLs by hand: they ask for a photo
 * or video id and get URLs, srcsets and the alt text in the current language.
 */
export function useMediaManifest() {
  const { locale } = useI18n()
  const url = (path: string) => `${manifest.base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  function photo(id: string): ManifestPhoto | undefined {
    return manifest.photos[id]
  }

  function photoSrc(id: string, size: number, format: 'avif' | 'webp') {
    const entry = manifest.photos[id]
    return entry ? url(`${entry.path}-${size}.${format}`) : undefined
  }

  function srcset(id: string, format: 'avif' | 'webp') {
    const entry = manifest.photos[id]
    if (!entry) return undefined
    return entry.sizes.map(size => `${photoSrc(id, size, format)} ${size}w`).join(', ')
  }

  /** Largest rendition, for the lightbox. */
  function largest(id: string, format: 'avif' | 'webp' = 'webp') {
    const entry = manifest.photos[id]
    return entry ? photoSrc(id, Math.max(...entry.sizes), format) : undefined
  }

  /** Content can override the manifest's alt; Spanish uses `alt_es` when present. */
  function alt(id: string, override?: string) {
    if (override) return override
    const entry = manifest.photos[id]
    if (!entry) return ''
    return locale.value === 'es' && entry.alt_es ? entry.alt_es : entry.alt
  }

  /** Background color to show while a photo loads. */
  function placeholderColor(id: string) {
    const entry = manifest.photos[id]
    return entry ? blurhashAverage(entry.blurhash) : undefined
  }

  function video(id: string) {
    const entry = manifest.videos[id]
    if (!entry) return undefined
    return {
      ...entry,
      ready: entry.status !== 'pending' && Boolean(entry.hls),
      hlsUrl: entry.hls ? url(entry.hls) : undefined,
      posterUrl: entry.poster ? url(entry.poster) : undefined,
      previewUrl: entry.preview ? url(entry.preview) : undefined,
      captions: (entry.captions ?? []).map(track => ({ ...track, src: url(track.src) }))
    }
  }

  function series(id: string) {
    const entry = manifest.series[id]
    if (!entry) return undefined
    return {
      id,
      title: locale.value === 'es' && entry.title_es ? entry.title_es : entry.title,
      photos: entry.photos.filter(photoId => manifest.photos[photoId])
    }
  }

  return { manifest, photo, photoSrc, srcset, largest, alt, placeholderColor, video, series }
}
