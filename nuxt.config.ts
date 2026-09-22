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

  // Mode is data-mode on <html> (useMode); Nuxt UI's own color mode would follow the OS instead
  ui: {
    colorMode: false
  },

  runtimeConfig: {
    public: {
      // Dashed outline + chip on data-driven areas; on in dev, off in production builds
      showPlaceholders: process.env.NODE_ENV !== 'production'
    }
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

  fonts: {
    defaults: {
      preload: false,
      // Latin covers English and Spanish (á é í ó ú ñ ¿ ¡ are Latin-1); latin-ext would only add requests
      // and the preload would pick the wrong file
      subsets: ['latin']
    },
    families: [
      // Body in both modes and the day display face
      { name: 'Albert Sans', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal'], preload: true },
      // Night display face: italic with the optical size axis
      {
        name: 'Newsreader',
        provider: 'google',
        weights: [400, 500],
        styles: ['italic'],
        preload: true,
        providerOptions: { google: { experimental: { variableAxis: { opsz: [['6', '72']] } } } }
      },
      { name: 'Source Code Pro', provider: 'google', weights: [400, 500], styles: ['normal'] }
    ]
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
