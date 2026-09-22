import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const image = z.object({
  src: z.string(),
  alt: z.string().min(3, 'alt is required for every image'),
  width: z.number().optional(),
  height: z.number().optional(),
})

// An id in content/media/manifest.json (photos or videos produced by the AWS pipeline)
const mediaRef = z.object({
  id: z.string(),
  alt: z.string().min(3),
})

const link = z.object({ label: z.string(), href: z.string().url().or(z.string().startsWith('/')) })

const mode = z.enum(['dev', 'film', 'both']).default('both')

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        oneLiner: z.string(),
        year: z.string(),
        role: z.string(),
        status: z.enum(['live', 'beta', 'in-progress', 'archived']).default('live'),
        kind: z.enum(['web-app', 'infra', 'client', 'experiment', 'archive']),
        stack: z.array(z.string()),
        tags: z.array(z.string()),
        cover: image,
        gallery: z.array(image).default([]),
        links: z.array(link).default([]),
        decisions: z.array(z.object({ title: z.string(), why: z.string() })).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        next: z.string().optional(),
      }),
    }),

    films: defineCollection({
      type: 'page',
      source: 'films/*.md',
      schema: z.object({
        title: z.string(),
        kind: z.enum(['short', 'reel', 'client', 'vertical']),
        year: z.string(),
        runtime: z.string(),
        synopsis: z.string(),
        credits: z.array(z.object({ role: z.string(), name: z.string() })),
        camera: z.string().optional(),
        video: mediaRef,
        poster: mediaRef,
        preview: mediaRef.optional(),
        vertical: mediaRef.optional(),
        stills: z.array(mediaRef).default([]),
        external: z.array(link).default([]),
        journal: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        order: z.number().default(99),
        next: z.string().optional(),
      }),
    }),

    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().date(),
        tags: z.array(z.string()).default([]),
        cover: image.optional(),
        draft: z.boolean().default(false),
      }),
    }),

    experience: defineCollection({
      type: 'data',
      source: 'experience.yml',
      schema: z.object({
        entries: z.array(z.object({
          from: z.string(),
          to: z.string().nullable(),
          title: z.string(),
          org: z.string().optional(),
          summary: z.string(),
          current: z.boolean().default(false),
        })),
      }),
    }),

    filmography: defineCollection({
      type: 'data',
      source: 'filmography.yml',
      schema: z.object({
        services: z.array(z.string()),
        credits: z.array(z.object({
          year: z.string(),
          title: z.string(),
          role: z.string(),
          note: z.string().optional(),
          slug: z.string().optional(),
        })),
      }),
    }),

    testimonials: defineCollection({
      type: 'data',
      source: 'testimonials.yml',
      schema: z.object({
        entries: z.array(z.object({
          quote: z.string(),
          name: z.string(),
          role: z.string(),
          avatar: image.optional(),
          mode,
        })),
      }),
    }),

    faq: defineCollection({
      type: 'data',
      source: 'faq.yml',
      schema: z.object({
        entries: z.array(z.object({ q: z.string(), a: z.string(), mode })),
      }),
    }),

    about: defineCollection({
      type: 'page',
      source: 'about*.md',
      schema: z.object({
        mode: z.enum(['dev', 'film']),
        headline: z.string(),
        teaser: z.string(),
        portrait: image,
        now: z.string().optional(),
        stack: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
        kit: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
        services: z.array(z.object({ title: z.string(), summary: z.string() })).default([]),
        cv: z.string().default('/cv-victor-garces.pdf'),
      }),
    }),

    contact: defineCollection({
      type: 'data',
      source: 'contact.yml',
      schema: z.object({
        email: z.string().email(),
        city: z.string(),
        timezone: z.string(),
        responseTime: z.string(),
        topics: z.array(z.object({ id: z.enum(['web', 'film', 'hello']), label: z.string(), fields: z.array(z.string()) })),
        budgets: z.array(z.string()),
        timelines: z.array(z.string()),
        socials: z.array(z.object({ label: z.string(), handle: z.string(), href: z.string().url(), mode })),
      }),
    }),

    legal: defineCollection({
      type: 'page',
      source: 'legal/*.md',
      schema: z.object({ title: z.string(), updated: z.string().date() }),
    }),
  },
})
