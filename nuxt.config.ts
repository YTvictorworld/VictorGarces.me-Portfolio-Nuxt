export default defineNuxtConfig({
  compatibilityDate: '2025-08-15',
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],
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
