import type { RouteLocationRaw } from 'vue-router'

interface NavEntry {
  /** i18n key */
  label: string
  /** Unlocalized route */
  to: { path: string, hash?: string, query?: Record<string, string> }
}

export interface NavItem {
  label: string
  to: RouteLocationRaw
  /** Localized path without hash or query, for the active state */
  path: string
}

const DAY: NavEntry[] = [
  { label: 'nav.work', to: { path: '/dev/work' } },
  { label: 'nav.about', to: { path: '/dev/about' } },
  { label: 'nav.experience', to: { path: '/dev', hash: '#experience' } },
  { label: 'nav.blog', to: { path: '/blog' } },
  { label: 'nav.contact', to: { path: '/contact' } }
]

const NIGHT: NavEntry[] = [
  { label: 'nav.films', to: { path: '/film/films' } },
  { label: 'nav.photography', to: { path: '/film/photography' } },
  { label: 'nav.journal', to: { path: '/film/journal' } },
  { label: 'nav.about', to: { path: '/film/about' } },
  { label: 'nav.contact', to: { path: '/contact', query: { topic: 'film' } } }
]

const LEGAL: NavEntry[] = [
  { label: 'footer.privacy', to: { path: '/privacy' } },
  { label: 'footer.terms', to: { path: '/terms' } },
  { label: 'footer.cookies', to: { path: '/cookies' } }
]

/**
 * Navigation per mode. Entries whose page does not exist yet are left out, so the
 * nav never links to a 404 while the refactor lands page by page.
 */
export function useNav() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const router = useRouter()
  const route = useRoute()

  const routePaths = new Set(router.getRoutes().map(r => r.path))
  const exists = (path: string) => routePaths.has(localePath(path))

  const build = (entries: NavEntry[]) => computed<NavItem[]>(() => entries
    .filter(entry => exists(entry.to.path))
    .map(entry => ({
      label: t(entry.label),
      to: localePath({ path: entry.to.path, hash: entry.to.hash, query: entry.to.query }),
      path: localePath(entry.to.path)
    })))

  const home = computed(() => ({
    day: localePath(exists('/dev') ? '/dev' : '/'),
    night: localePath(exists('/film') ? '/film' : '/')
  }))

  /** Section pages stay active on their children (/dev/work/ada-system keeps Work lit). */
  function isActive(item: NavItem) {
    if (typeof item.to === 'string' && item.to.includes('#')) return false
    return route.path === item.path || route.path.startsWith(`${item.path}/`)
  }

  return {
    day: build(DAY),
    night: build(NIGHT),
    legal: build(LEGAL),
    home,
    exists,
    isActive
  }
}
