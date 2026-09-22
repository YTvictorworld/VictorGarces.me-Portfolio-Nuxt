import { defineCollection, defineContentConfig } from '@nuxt/content'
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

export default defineContentConfig({
  collections: {
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
