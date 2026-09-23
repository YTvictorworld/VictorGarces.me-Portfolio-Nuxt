import type { Mode } from '~/utils/mode'

interface SeoInput {
  /** Page title, without the site name: titleTemplate in app.vue adds that. */
  title: string
  description?: string
  /**
   * Which Open Graph template to render. Defaults to the mode the route forces, so a shared
   * link shows the side it belongs to rather than the sharer's stored preference.
   */
  mode?: Mode
  /** og:type, when the page is not a plain website. */
  type?: 'website' | 'article' | 'video.movie'
  /** Big line on the card. The homes pass the name, as the artboards draw it. */
  cardTitle?: string
  /** Extra meta the page owns, merged after ours (article dates, tags). */
  meta?: Record<string, unknown>
}

/**
 * Title, description and the Open Graph card in one call.
 *
 * The card is rendered by Satori at build time from OgDay / OgNight. Every page goes through
 * here so the template choice stays in one place, and so the eyebrow and the strapline are
 * translated rather than baked into the component.
 */
export function useSeo(input: SeoInput) {
  const { t } = useI18n()
  const route = useRoute()

  const mode: Mode = input.mode ?? (forcedModeFor(route.path) ?? 'day')
  const isNight = mode === 'night'

  useSeoMeta({
    title: input.title,
    ogTitle: input.title,
    description: input.description,
    ogDescription: input.description,
    ogType: input.type ?? 'website',
    ...input.meta
  })
  defineOgImage(isNight ? 'OgNight' : 'OgDay', {
    title: input.cardTitle ?? input.title,
    description: input.description ?? t(isNight ? 'og.film.lead' : 'og.dev.lead'),
    eyebrow: t(isNight ? 'og.film.eyebrow' : 'og.dev.eyebrow')
  })
}
