export default defineNuxtConfig({
  compatibilityDate: '2025-08-15',
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    baseUrl: 'https://victorgarces.me',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-DO', name: 'Español', file: 'es.json' }
    ]
  },
  nitro: {
    preset: 'static',
    prerender: {
      // /bag is intentionally off-nav, so the crawler never finds it
      routes: ['/bag']
    }
  },
  // Prerender full HTML at build time: crawlers and no-JS users get real content
  ssr: true,
  app: {
    baseURL: '/',
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  css: [
    '~/assets/css/main.css'
  ]
})
