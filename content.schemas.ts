/**
 * Content schemas, shared by content.config.ts (collection types and SQL columns) and the
 * build-time validator in nuxt.config.ts. @nuxt/content does not run these schemas against
 * the files itself, so `validateContentFile` is what actually rejects bad content.
 * Based on docs/snippets/content.config.ts, extended so no existing content is lost
 * (docs/MIGRATION.md).
 */
import { z } from '@nuxt/content'

const text = z.string().trim().min(1)
const optionalText = z.string().trim().min(1).optional()

/** A local image under public/, optimized by @nuxt/image. Alt text is mandatory. */
export const image = z.object({
  src: text,
  alt: z.string().trim().min(3, 'alt text is required for every image'),
  width: z.number().optional(),
  height: z.number().optional()
})

/** A photo or video in content/media/manifest.json. The manifest provides the default alt. */
export const mediaRef = z.object({
  id: text,
  alt: z.string().trim().min(3).optional()
})

const href = z.union([
  z.string().url(),
  z.string().regex(/^\/(?!\/)/, 'relative links start with a single /')
])
export const link = z.object({ label: text, href })

const mode = z.enum(['dev', 'film', 'both']).default('both')
/** Seeds with [bracketed] sample copy are drafts: visible in dev, never in production. */
const draft = z.boolean().default(false)
/** YAML dates arrive as Date objects or ISO strings depending on quoting. */
const date = z.coerce.date()

export const schemas = {
  projects: z.object({
    title: text,
    /** Case-study h1 (D-Project); the card uses `oneLiner` */
    headline: optionalText,
    oneLiner: text,
    year: text,
    role: text,
    /** Whose product it is, when it is not Victor's. Absent means his own. */
    org: optionalText,
    status: z.enum(['live', 'beta', 'in-progress', 'archived']).default('live'),
    kind: z.enum(['web-app', 'infra', 'client', 'experiment', 'archive']),
    stack: z.array(text),
    tags: z.array(text).default([]),
    cover: image.optional(),
    gallery: z.array(image).default([]),
    links: z.array(link).default([]),
    decisions: z.array(z.object({ title: text, why: text })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    next: optionalText,
    draft
  }),

  films: z.object({
    title: text,
    /** One line for cards and the featured slot (N-Films) */
    logline: optionalText,
    kind: z.enum(['short', 'reel', 'client', 'vertical']),
    year: text,
    runtime: text,
    /** Paragraphs separated by a blank line */
    synopsis: optionalText,
    credits: z.array(z.object({ role: text, name: text })).default([]),
    camera: optionalText,
    video: mediaRef.optional(),
    /** A manifest photo used as the card poster */
    poster: mediaRef.optional(),
    preview: mediaRef.optional(),
    vertical: z.object({
      media: mediaRef.optional(),
      runtime: optionalText,
      summary: optionalText,
      links: z.array(link).default([])
    }).optional(),
    stills: z.array(mediaRef).default([]),
    external: z.array(link).default([]),
    /** Slugs of blog posts about this film */
    journal: z.array(text).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    next: optionalText,
    /** For VideoObject structured data */
    uploadDate: date.optional(),
    draft
  }),

  blog: z.object({
    title: text,
    description: text,
    date,
    tags: z.array(text).default([]),
    cover: image.optional(),
    minRead: z.number().int().positive().optional(),
    author: z.object({
      name: text,
      description: optionalText,
      username: optionalText,
      twitter: z.string().url().optional(),
      avatar: image.optional()
    }).optional(),
    draft
  }),

  experience: z.object({
    entries: z.array(z.object({
      /** null when unknown: nothing renders instead of a [YEAR] placeholder */
      from: z.string().nullable().default(null),
      to: z.string().nullable().default(null),
      title: text,
      org: optionalText,
      url: z.string().url().optional(),
      summary: optionalText,
      kind: z.enum(['work', 'education', 'volunteer']).default('work'),
      current: z.boolean().default(false),
      draft
    }))
  }),

  filmography: z.object({
    credits: z.array(z.object({
      year: text,
      title: text,
      role: text,
      note: optionalText,
      /** Film page slug, when the credit has one */
      slug: optionalText,
      draft
    }))
  }),

  testimonials: z.object({
    entries: z.array(z.object({
      quote: text,
      name: text,
      role: text,
      /** Night byline: event or project */
      context: optionalText,
      avatar: image.optional(),
      mode,
      draft
    }))
  }),

  faq: z.object({
    entries: z.array(z.object({
      q: text,
      /** Supports **bold** */
      a: text,
      mode,
      category: optionalText,
      order: z.number().default(99),
      /** Shown on the home page; the rest sits behind "show all" */
      featured: z.boolean().default(false),
      draft
    }))
  }),

  about: z.object({
    title: text,
    mode: z.enum(['dev', 'film']),
    headline: text,
    teaser: text,
    portrait: image.optional(),
    now: optionalText,
    stack: z.array(z.object({ group: text, items: z.array(text) })).default([]),
    kit: z.array(z.object({ label: text, value: text })).default([]),
    services: z.array(z.object({ title: text, summary: text })).default([]),
    cv: z.string().default('/cv-victor-garces.pdf')
  }),

  /** Translated labels for /contact; the facts (email, socials) live in `profile` */
  contact: z.object({
    responseTime: text,
    topics: z.array(z.object({
      id: z.enum(['web', 'film', 'hello']),
      label: text,
      fields: z.array(z.enum(['name', 'email', 'budget', 'timeline', 'date', 'place', 'message']))
    })),
    budgets: z.array(text).default([]),
    timelines: z.array(text).default([])
  }),

  legal: z.object({
    title: text,
    description: optionalText,
    updated: date
  }),

  /** Page copy that does not belong to a collection entry (headings, leads, SEO) */
  pages: z.object({
    title: text,
    description: optionalText,
    seo: z.object({ title: optionalText, description: optionalText }).optional(),
    eyebrow: optionalText,
    lead: optionalText,
    sections: z.record(z.string(), z.object({
      eyebrow: optionalText,
      title: optionalText,
      lead: optionalText,
      cta: optionalText,
      cta2: optionalText,
      /** Input placeholder or a small mono note (e.g. the stack line on a landing card) */
      placeholder: optionalText,
      note: optionalText
    })).default({})
  }),

  bag: z.object({
    categories: z.array(z.object({
      title: text,
      items: z.array(z.object({
        title: text,
        url: z.string().url().optional(),
        description: optionalText,
        icon: optionalText
      }))
    }))
  }),

  /** Single-locale facts: the email is stored once */
  profile: z.object({
    email: z.string().email(),
    city: text,
    timezone: text,
    available: z.boolean().default(true),
    socials: z.array(z.object({
      label: text,
      handle: text,
      href: z.string().url(),
      mode
    }))
  })
}

export type ContentSchemaName = keyof typeof schemas

/* ------------------------------------------------------------------------------------------ */
/* Media manifest (docs/MEDIA.md): produced by the pipeline, validated here before use        */

export const manifestSchema = z.object({
  version: z.literal(1),
  base: text,
  photos: z.record(z.string(), z.object({
    series: optionalText,
    alt: z.string().trim().min(3, 'every photo needs alt text in the manifest'),
    alt_es: z.string().trim().min(3).optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    blurhash: text,
    sizes: z.array(z.number().int().positive()).min(1),
    formats: z.array(z.enum(['avif', 'webp'])).min(1),
    path: text
  })),
  videos: z.record(z.string(), z.object({
    title: text,
    duration: z.number().positive().optional(),
    aspect: z.string().regex(/^\d+:\d+$/),
    hls: optionalText,
    renditions: z.array(z.number().int().positive()).default([]),
    poster: optionalText,
    preview: optionalText,
    captions: z.array(z.object({ lang: text, src: text })).default([]),
    /** `pending` until the file is in the pipeline: components show the poster only */
    status: z.enum(['ready', 'pending']).default('ready')
  })),
  series: z.record(z.string(), z.object({
    title: text,
    title_es: optionalText,
    photos: z.array(text)
  }))
})

export type MediaManifest = ReturnType<typeof manifestSchema.parse>

/** Cross-checks a manifest: series and pending/ready rules. Returns error messages. */
export function checkManifest(manifest: MediaManifest): string[] {
  const errors: string[] = []
  for (const [id, entry] of Object.entries(manifest.series)) {
    for (const photo of entry.photos) {
      if (!manifest.photos[photo]) errors.push(`series "${id}" lists missing photo "${photo}"`)
    }
  }
  for (const [id, video] of Object.entries(manifest.videos)) {
    if (video.status === 'ready' && !video.hls) errors.push(`video "${id}" is ready but has no hls`)
  }
  return errors
}

/* ------------------------------------------------------------------------------------------ */
/* Validation of one parsed content file                                                       */

const PLACEHOLDER = /\[[^\]\n]{1,80}\](?!\()/

/** `[bracketed]` sample text outside drafts; markdown bodies are not scanned. */
function findPlaceholders(value: unknown, trail: string, out: string[]) {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value)) out.push(`${trail}: "${value.slice(0, 60)}"`)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (item && typeof item === 'object' && (item as { draft?: boolean }).draft) return
      findPlaceholders(item, `${trail}[${index}]`, out)
    })
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (['body', 'meta', 'seo', 'navigation', 'excerpt'].includes(key)) continue
      findPlaceholders(child, trail ? `${trail}.${key}` : key, out)
    }
  }
}

function mediaRefs(schema: ContentSchemaName, data: Record<string, unknown>) {
  if (schema !== 'films') return []
  const film = data as ReturnType<typeof schemas.films.parse>
  const photos = [film.poster, ...film.stills].filter(Boolean).map(ref => ({ kind: 'photos' as const, ref: ref! }))
  const videos = [film.video, film.preview, film.vertical?.media].filter(Boolean).map(ref => ({ kind: 'videos' as const, ref: ref! }))
  return [...photos, ...videos]
}

export interface ContentCheck {
  errors: string[]
  placeholders: string[]
}

/**
 * Validates a parsed content file against its collection schema (`<name>_en` / `<name>_es`
 * use `<name>`), checks that media references exist in the manifest, and lists bracketed
 * placeholders left in non-draft entries.
 */
export function validateContentFile(collection: string, content: Record<string, unknown>, manifest?: MediaManifest): ContentCheck {
  const base = collection.replace(/_(en|es)$/, '') as ContentSchemaName
  const schema = schemas[base]
  const result: ContentCheck = { errors: [], placeholders: [] }
  if (!schema) return result

  const parsed = schema.safeParse(content)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      result.errors.push(`${issue.path.join('.') || '(root)'}: ${issue.message}`)
    }
    return result
  }

  if (manifest) {
    for (const { kind, ref } of mediaRefs(base, parsed.data as Record<string, unknown>)) {
      if (!manifest[kind][ref.id]) result.errors.push(`media "${ref.id}" is not in manifest.${kind}`)
    }
  }

  if (!(parsed.data as { draft?: boolean }).draft) {
    findPlaceholders(parsed.data, '', result.placeholders)
  }
  return result
}
