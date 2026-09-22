<script setup lang="ts">
import { en, es } from '@nuxt/ui/locale'

const { global } = useAppConfig()
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
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://mir-s3-cdn-cf.behance.net', crossorigin: '' },
    ...(localeHead.value.link || [])
  ],
  script: [
    // Sets data-mode before first paint: no flash of day for a returning night visitor
    { key: 'mode-prepaint', innerHTML: MODE_PREPAINT_SCRIPT, tagPriority: 'critical' }
  ]
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
  ogImage: global?.picture?.light,
  twitterImage: global?.picture?.light,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp :locale="uiLocale">
    <NuxtRouteAnnouncer />
    <NuxtLayout />
  </UApp>
</template>
