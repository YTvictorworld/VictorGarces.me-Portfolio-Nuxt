import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { schemas } from './content.schemas'

type CollectionType = 'page' | 'data'
type Schema = (typeof schemas)[keyof typeof schemas]

const LOCALES = ['en', 'es'] as const

/**
 * `<name>_en` and `<name>_es` from `content/en/<source>` and `content/es/<source>`.
 * Same filename in both folders = translations of each other (and the same slug).
 */
function perLocale(name: string, type: CollectionType, source: string, schema: Schema) {
  return Object.fromEntries(LOCALES.map(locale => [
    `${name}_${locale}`,
    defineCollection({ type, source: `${locale}/${source}`, schema })
  ]))
}

/* --- Legacy: the pre-refactor home (content/{en,es}/index.yml), queried by app/pages/index.vue
   and app/components/landing/*. Removed in M3 when /dev and /film replace them. --- */
const legacyImage = z.object({ src: z.string(), alt: z.string() })
const legacyButton = z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})
const legacySection = z.object({ title: z.string(), description: z.string() })
const legacyIndex = z.object({
  hero: z.object({ links: z.array(legacyButton), images: z.array(legacyImage) }),
  roles: z.string().optional(),
  about: legacySection,
  experience: legacySection.extend({
    items: z.array(z.object({
      date: z.string(),
      position: z.string(),
      company: z.object({ name: z.string(), url: z.string(), logo: z.string(), color: z.string() })
    }))
  }),
  testimonials: z.array(z.object({
    quote: z.string(),
    author: z.object({
      name: z.string(),
      description: z.string().optional(),
      avatar: legacyImage.optional()
    })
  })),
  blog: legacySection,
  faq: legacySection.extend({
    categories: z.array(z.object({
      title: z.string().nonempty(),
      questions: z.array(z.object({ label: z.string().nonempty(), content: z.string().nonempty() }))
    }))
  })
})

export default defineContentConfig({
  collections: {
    ...perLocale('index', 'page', 'index.yml', legacyIndex as unknown as Schema),

    ...perLocale('projects', 'page', 'projects/*.md', schemas.projects),
    ...perLocale('films', 'page', 'films/*.md', schemas.films),
    ...perLocale('blog', 'page', 'blog/*.md', schemas.blog),
    ...perLocale('about', 'page', 'about/*.md', schemas.about),
    ...perLocale('legal', 'page', 'legal/*.md', schemas.legal),
    ...perLocale('pages', 'page', 'pages/*.yml', schemas.pages),

    ...perLocale('experience', 'data', 'experience.yml', schemas.experience),
    ...perLocale('filmography', 'data', 'filmography.yml', schemas.filmography),
    ...perLocale('testimonials', 'data', 'testimonials.yml', schemas.testimonials),
    ...perLocale('faq', 'data', 'faq.yml', schemas.faq),
    ...perLocale('contact', 'data', 'contact.yml', schemas.contact),
    ...perLocale('bag', 'data', 'bag.yml', schemas.bag),

    profile: defineCollection({ type: 'data', source: 'profile.yml', schema: schemas.profile })
  }
})
