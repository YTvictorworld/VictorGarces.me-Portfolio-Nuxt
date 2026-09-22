export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  // Prerender full HTML at build time: crawlers and no-JS users get real content
  ssr: true,

  devtools: { enabled: true },

  app: {
    baseURL: '/',
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://victorgarces.me',
    name: 'Víctor Garcés'
  },

  routeRules: {
    // Off-nav gear list: reachable by URL, kept out of search results and the sitemap
    '/bag': { robots: false },
    '/es/bag': { robots: false }
  },

  compatibilityDate: '2025-08-15',

  nitro: {
    preset: 'static',
    prerender: {
      // /bag is intentionally off-nav, so the crawler never finds it
      routes: ['/bag', '/es/bag']
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    baseUrl: 'https://victorgarces.me',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-DO', name: 'Español', file: 'es.json' }
    ]
  },

  // Rendered per mode from OgDay / OgNight in M6; off until those components exist
  ogImage: {
    enabled: false
  },

  sitemap: {
    // One /sitemap.xml with hreflang alternates (the URL already known to search engines),
    // instead of an index plus one sitemap per locale
    sitemaps: false
  }
})
