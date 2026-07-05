<script setup lang="ts">
const colorMode = useColorMode()
const { global } = useAppConfig()
const route = useRoute()

const color = computed(() => colorMode.value === 'dark' ? '#0a0a0a' : 'white')
const canonicalUrl = computed(() => `${SITE_URL}${route.path === '/' ? '' : route.path.replace(/\/$/, '')}`)

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://mir-s3-cdn-cf.behance.net', crossorigin: '' },
    { rel: 'canonical', href: canonicalUrl }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: `%s · ${SITE_NAME}`,
  title: `${SITE_NAME} | Full-Stack Developer & Filmmaker`,
  ogSiteName: SITE_NAME,
  ogType: 'website',
  ogUrl: canonicalUrl,
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
