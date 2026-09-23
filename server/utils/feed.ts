import type { H3Event } from 'h3'
import { queryCollection } from '@nuxt/content/server'

const SITE_URL = 'https://victorgarces.me'
const SITE_NAME = 'Víctor Garcés'

const escape = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/**
 * RSS for one locale, built at prerender time from the blog collection.
 *
 * Drafts never appear: the seed entries are marked `draft: true` precisely so they stay out of
 * pages, the sitemap and this feed. The route for a post is not its content path (which carries
 * the collection prefix), so it is rebuilt from the slug the same way the pages do it.
 */
export async function blogFeed(event: H3Event, locale: 'en' | 'es') {
  const prefix = locale === 'en' ? '' : '/es'
  const posts = await queryCollection(event, locale === 'en' ? 'blog_en' : 'blog_es')
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'draft')
    .all()

  const items = posts
    .filter(post => !post.draft)
    .map((post) => {
      const slug = String(post.path).split('/').filter(Boolean).at(-1)
      const url = `${SITE_URL}${prefix}/blog/${slug}`
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.description ?? '')}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const title = locale === 'en' ? `${SITE_NAME} · Blog` : `${SITE_NAME} · Blog`
  const description = locale === 'en'
    ? 'Notes from building things, and from shooting them.'
    : 'Notas de construir cosas, y de rodarlas.'

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(title)}</title>
    <link>${SITE_URL}${prefix}/blog</link>
    <description>${escape(description)}</description>
    <language>${locale === 'en' ? 'en-US' : 'es-DO'}</language>
    <atom:link href="${SITE_URL}${prefix}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
}
