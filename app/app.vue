<script setup lang="ts">
import { en, es } from '@nuxt/ui/locale'

const { locale } = useI18n()
// Nuxt UI's own strings (close buttons, carousel controls) follow the site language
const uiLocale = computed(() => locale.value === 'es' ? es : en)
const { mode } = useMode()
const { showPlaceholders } = useRuntimeConfig().public

// lang attr, canonical, hreflang alternates and og:locale per language
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: {
    ...localeHead.value.htmlAttrs,
    'data-mode': mode.value,
    'class': mode.value === 'night' ? 'dark' : 'light',
    'data-placeholders': showPlaceholders ? 'on' : 'off'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // No `key`: with one, unhead cannot claim the prerendered tag and appends a duplicate
    { name: 'theme-color', content: THEME_COLOR[mode.value] },
    ...(localeHead.value.meta || [])
  ],
  link: [
    // One feed per locale, prerendered by server/routes (see nitro.prerender.routes)
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: `${SITE_NAME} · Blog`,
      href: locale.value === 'es' ? '/es/rss.xml' : '/rss.xml'
    },
    ...(localeHead.value.link || [])
  ]
  // The pre-paint mode script lives in nuxt.config's app.head, not here: app.vue does not
  // render for the SPA shell (404.html), and that is the one page that most needs it.
}))

/**
 * Client-side navigation swaps the page without telling a screen reader and leaves focus on
 * <body>. NuxtRouteAnnouncer reads the new title; this puts focus back into <main>, so the
 * next Tab continues inside the new page instead of restarting at the skip link.
 */
const router = useRouter()
if (import.meta.client) {
  router.afterEach((to, from) => {
    if (to.path === from.path) return
    nextTick(() => document.getElementById('main')?.focus({ preventScroll: true }))
  })
}

useSeoMeta({
  titleTemplate: `%s · ${SITE_NAME}`,
  title: `${SITE_NAME} | Full-Stack Developer & Filmmaker`,
  ogSiteName: SITE_NAME,
  ogType: 'website',
  // Victor's own portrait, served from this site. M6 replaces it with a rendered OG image.
  ogImage: `${SITE_URL}/media/portrait.jpg`,
  twitterImage: `${SITE_URL}/media/portrait.jpg`,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtRouteAnnouncer />
    <NuxtLayout />
  </UApp>
</template>
