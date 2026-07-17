<script setup lang="ts">
const colorMode = useColorMode()
const { global } = useAppConfig()

const color = computed(() => colorMode.value === 'dark' ? '#0a0a0a' : 'white')

// lang attr, canonical, hreflang alternates and og:locale per language
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: {
    ...localeHead.value.htmlAttrs
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color.value },
    ...(localeHead.value.meta || [])
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://mir-s3-cdn-cf.behance.net', crossorigin: '' },
    ...(localeHead.value.link || [])
  ]
}))

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
  <UApp>
    <NuxtLayout />
  </UApp>
</template>
