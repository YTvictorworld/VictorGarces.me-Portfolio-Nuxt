import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

// Shared schemas for both locales (en/ and es/ mirror each other)
const createIndexSchema = () => z.object({
  hero: z.object({
    links: z.array(createButtonSchema()),
    images: z.array(createImageSchema())
  }),
  roles: z.string().optional(),
  about: createBaseSchema(),
  experience: createBaseSchema().extend({
    items: z.array(z.object({
      date: z.string(),
      position: z.string(),
      company: z.object({
        name: z.string(),
        url: z.string(),
        logo: z.string().editor({ input: 'icon' }),
        color: z.string()
      })
    }))
  }),
  testimonials: z.array(createTestimonialSchema()),
  blog: createBaseSchema(),
  faq: createBaseSchema().extend({
    categories: z.array(
      z.object({
        title: z.string().nonempty(),
        questions: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      }))
  })
})

const createBlogSchema = () => z.object({
  minRead: z.number(),
  date: z.date(),
  image: z.string().nonempty().editor({ input: 'media' }),
  author: createAuthorSchema()
})

const createPagesSchema = () => z.object({
  links: z.array(createButtonSchema())
})

export default defineContentConfig({
  collections: {
    index_en: defineCollection({
      type: 'page',
      source: 'en/index.yml',
      schema: createIndexSchema()
    }),
    index_es: defineCollection({
      type: 'page',
      source: 'es/index.yml',
      schema: createIndexSchema()
    }),
    blog_en: defineCollection({
      type: 'page',
      source: 'en/blog/*.md',
      schema: createBlogSchema()
    }),
    blog_es: defineCollection({
      type: 'page',
      source: 'es/blog/*.md',
      schema: createBlogSchema()
    }),
    pages_en: defineCollection({
      type: 'page',
      source: [{ include: 'en/blog.yml' }],
      schema: createPagesSchema()
    }),
    pages_es: defineCollection({
      type: 'page',
      source: [{ include: 'es/blog.yml' }],
      schema: createPagesSchema()
    }),
    bag: defineCollection({
      type: 'data',
      source: 'bag.yml',
      schema: z.object({
        categories: z.array(
          z.object({
            title: z.string().nonempty(),
            items: z.array(
              z.object({
                title: z.string().nonempty(),
                url: z.string().url().optional(),
                description: z.string().optional()
              })
            )
          })
        )
      })
    })
  }
})
