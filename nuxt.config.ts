
export default defineNuxtConfig({
  compatibilityDate: '2025-08-15',
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  css: [
     '/assets/css/main.css'
  ]
})
