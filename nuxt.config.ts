import { existsSync, readdirSync, readFileSync, watch, type FSWatcher } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { NuxtHooks } from 'nuxt/schema'
import { checkManifest, manifestSchema, validateContentFile, type MediaManifest } from './content.schemas'
import { MODE_PREPAINT_SCRIPT } from './app/utils/mode'
import tailwindcss from '@tailwindcss/vite'

const production = process.env.NODE_ENV === 'production'
const MANIFEST_FILE = new URL('./content/media/manifest.json', import.meta.url)

/**
 * The media host, once the manifest comes from the pipeline (`pnpm media:pull`). Every page with
 * a photo then talks to it first, so the connection is opened before the first image is asked
 * for. While the manifest still points at this site's own /media there is nothing to open.
 */
function mediaOrigin(): string | undefined {
  try {
    const { base } = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8')) as { base?: string }
    return base && /^https?:\/\//.test(base) ? new URL(base).origin : undefined
  } catch {
    return undefined
  }
}
const MEDIA_ORIGIN = mediaOrigin()

/**
 * Content validation. @nuxt/content turns an error thrown while parsing into a warning and
 * silently drops the file, so every problem is also collected here and `build:done` fails a
 * production build if any are left. In `nuxt dev` the file stays out, with the warning.
 */
const contentProblems: string[] = []
function problem(title: string, lines: string[]) {
  const text = [title, ...lines.map(line => `  - ${line}`)].join('\n')
  contentProblems.push(text)
  return text
}

/** The one public address, from content/profile.yml: legal copy must not drift from it. */
let profileEmailCache: string | undefined
function profileEmail(): string | undefined {
  if (profileEmailCache) return profileEmailCache
  const file = new URL('./content/profile.yml', import.meta.url)
  if (!existsSync(file)) return undefined
  profileEmailCache = /^email:\s*(\S+)/m.exec(readFileSync(file, 'utf8'))?.[1]
  return profileEmailCache
}

// Each dot must be followed by more of the domain, so a sentence's full stop is not swallowed
const EMAIL_RE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g

let manifestCache: MediaManifest | undefined
function loadManifest(): MediaManifest | undefined {
  if (manifestCache || !existsSync(MANIFEST_FILE)) return manifestCache
  const parsed = manifestSchema.safeParse(JSON.parse(readFileSync(MANIFEST_FILE, 'utf8')))
  if (!parsed.success) {
    console.error(problem('content/media/manifest.json is invalid:', parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)))
    return undefined
  }
  const issues = checkManifest(parsed.data)
  if (issues.length) console.error(problem('content/media/manifest.json:', issues))
  manifestCache = parsed.data
  return manifestCache
}

/**
 * Slugs that exist, per dynamic collection. A [slug] page checks the URL against this before it
 * does anything, so an unknown slug reaches the error page without booting @nuxt/content's
 * client database first. Drafts are included: they resolve to a route and then 404 on their own.
 */
function slugsIn(folder: string): string[] {
  const dir = new URL(`./content/en/${folder}`, import.meta.url)
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(file => file.endsWith('.md')).map(file => file.replace(/\.md$/, ''))
}

/** Every file in content/en has a twin in content/es: the shared filename links translations. */
function checkLocaleParity() {
  const list = (locale: string) => new Set((readdirSync(new URL(`./content/${locale}`, import.meta.url), { recursive: true }) as string[])
    .map(file => file.replaceAll('\\', '/'))
    .filter(file => /\.(md|ya?ml)$/.test(file)))
  const en = list('en')
  const es = list('es')
  const missing = [...[...en].filter(f => !es.has(f)).map(f => `content/es/${f} (translation of content/en/${f})`), ...[...es].filter(f => !en.has(f)).map(f => `content/en/${f} (original of content/es/${f})`)]
  if (missing.length) console.error(problem('Missing translations:', missing))
}

/**
 * @nuxt/content tells Vite to ignore everything under content/, the media manifest included, so
 * `pnpm media:watch` rewriting it would never reach a running dev server. This watches that one
 * file and passes the change on. Dev server only.
 */
type ViteServer = Parameters<NuxtHooks['vite:serverCreated']>[0]
interface ManifestFollow { servers: Map<'client' | 'server', ViteServer>, watcher?: FSWatcher }

// Nuxt runs one Vite server for the browser and one for server rendering, each with its own
// module graph, and both have to drop the old manifest or the page renders new and hydrates
// old. Kept on globalThis because Nuxt re-imports this file on every config change, and a
// second watcher would keep calling servers that are already closed.
const follow: ManifestFollow = ((globalThis as { __mediaManifestFollow?: ManifestFollow }).__mediaManifestFollow ??= { servers: new Map() })

function manifestChanged(file: string) {
  for (const [role, server] of follow.servers) {
    // The browser reloads the page rather than patching components in place: the manifest feeds
    // the whole page, and a hot patch that lands mid-transition throws inside Vue
    if (role === 'client') {
      for (const mod of server.moduleGraph.getModulesByFile(file) ?? []) server.moduleGraph.invalidateModule(mod)
      server.ws.send({ type: 'full-reload' })
    } else {
      server.watcher.emit('change', file)
    }
  }
}

function followManifest(role: 'client' | 'server', server: ViteServer) {
  follow.servers.set(role, server)
  if (follow.watcher) return

  // Vite keys its module graphs by forward-slash paths
  const file = fileURLToPath(MANIFEST_FILE).replace(/\\/g, '/')
  const name = file.slice(file.lastIndexOf('/') + 1)
  let pending: ReturnType<typeof setTimeout> | undefined
  // The folder, not the file: `git checkout` replaces the file, which ends a watch on the file
  // itself. Windows also reports one write as several events, folded here into one reload.
  follow.watcher = watch(fileURLToPath(new URL('.', MANIFEST_FILE)), (_, changed) => {
    if (changed !== name) return
    clearTimeout(pending)
    pending = setTimeout(() => manifestChanged(file), 150)
  })
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
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
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        // Sets data-mode before first paint: no flash of day for a returning night visitor.
        // It lives here rather than in app.vue because only `app.head` reaches the SPA shell
        // that nitro writes to 404.html, and an unknown URL is exactly where it is needed.
        { key: 'mode-prepaint', innerHTML: MODE_PREPAINT_SCRIPT, tagPriority: 'critical' }
      ],
      // Built by `pnpm favicons` from the tokens (scripts/make-favicons.mjs). The SVG follows
      // the reader's system theme; the PNGs are the day mark. Here rather than in app.vue so
      // the SPA shell and the error page get them too.
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        ...(MEDIA_ORIGIN ? [{ rel: 'preconnect' as const, href: MEDIA_ORIGIN }] : [])
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  // media-chrome and hls-video-element are custom elements, not Vue components
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('media-') || tag === 'hls-video'
    }
  },

  site: {
    url: 'https://garceslab.me',
    name: 'Víctor Garcés'
  },

  runtimeConfig: {
    public: {
      // Dashed outline + chip on data-driven areas; on in dev, off in production builds
      showPlaceholders: process.env.NODE_ENV !== 'production',
      // "Download CV" shows only once the file is in public/
      cv: existsSync(new URL('./public/cv-victor-garces.pdf', import.meta.url)) ? '/cv-victor-garces.pdf' : '',
      // Web3Forms access key (public by design). Without it the contact form falls back to email.
      web3formsKey: process.env.NUXT_PUBLIC_WEB3FORMS_KEY ?? '',
      // Checked by the [slug] pages before they query anything (see slugsIn)
      slugs: {
        blog: slugsIn('blog'),
        projects: slugsIn('projects'),
        films: slugsIn('films')
      }
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
      // /bag is intentionally off-nav, so the crawler never finds it. The feeds are server
      // routes: the crawler only follows extensionless and .json links, so they are listed too.
      routes: ['/bag', '/es/bag', '/rss.xml', '/es/rss.xml']
    }
  },

  // Tailwind came bundled with Nuxt UI; it is wired directly now that Nuxt UI is gone
  vite: {
    plugins: [tailwindcss()]
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  hooks: {
    'vite:serverCreated'(server, { isClient }) {
      if (!production) followManifest(isClient ? 'client' : 'server', server)
    },
    // @nuxt/content does not validate files against the collection schemas: this does
    'modules:done'() {
      loadManifest()
      checkLocaleParity()
    },
    'content:file:afterParse'({ file, content, collection }) {
      const check = validateContentFile(collection.name, content as Record<string, unknown>, loadManifest())
      if (check.errors.length) {
        throw new Error(problem(`${file.path} (${collection.name}) does not match its schema:`, check.errors))
      }
      const known = profileEmail()
      const strays = known ? [...new Set(String(file.body ?? '').match(EMAIL_RE) ?? [])].filter(address => address !== known) : []
      if (strays.length) {
        throw new Error(problem(`${file.path} contains an email address that is not the one in content/profile.yml (${known}):`, strays))
      }
      if (check.placeholders.length) {
        throw new Error(problem(`${file.path} has [bracketed] placeholders outside a draft (mark the entry draft: true or fill it in):`, check.placeholders))
      }
    },
    'build:done'() {
      if (production && contentProblems.length) {
        throw new Error(`Content validation failed:\n\n${contentProblems.join('\n\n')}`)
      }
    }
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
      // Night display face: italic 500 with the optical size axis. A single weight keeps the file at
      // ~65 KB instead of ~144 KB for a 400 to 500 range; not preloaded, since day pages never use it
      {
        name: 'Newsreader',
        provider: 'google',
        weights: [500],
        styles: ['italic'],
        preload: false,
        providerOptions: { google: { experimental: { variableAxis: { opsz: [['6', '72']] } } } }
      },
      { name: 'Source Code Pro', provider: 'google', weights: [400, 500], styles: ['normal'] }
    ]
  },

  i18n: {
    baseUrl: 'https://garceslab.me',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-DO', name: 'Español', file: 'es.json' }
    ]
  },

  // Rendered at build time by Satori from app/components/OgImage/*.satori.vue (v6 requires that
  // suffix). Each page picks its template through useSeo(), because a prerendered card cannot
  // know the visitor's stored mode. Fonts come from the @nuxt/fonts config above.
  ogImage: {
    defaults: { width: 1200, height: 630 },
    // Every card is rendered during the build, so the runtime generator would only ship dead
    // code and a route that a static host cannot serve anyway
    zeroRuntime: true
  },

  sitemap: {
    // One /sitemap.xml with hreflang alternates (the URL already known to search engines),
    // instead of an index plus one sitemap per locale
    sitemaps: false
  }
})
