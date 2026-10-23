import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'
import { START_LOCATION } from 'vue-router'

/**
 * Nuxt's default scroll behaviour, with explicit `behavior` on every position it returns.
 *
 * The default returns `{ left: 0, top: 0 }` with no behaviour, so `scroll-behavior: smooth` on
 * <html> turned every navigation into a visible scroll back to the top, after the page
 * transition had already finished. A new page, an anchor on another page and a Back restore are
 * now instant; only an anchor on the same page scrolls smoothly, and not under reduced motion.
 */
function anchorBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
}

/** The anchor's scroll-margin plus the header offset, as Nuxt computes it. */
function anchorOffset(selector: string) {
  try {
    const element = document.querySelector(selector)
    if (!element) return 0
    return (Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0)
      + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
  } catch {
    // A hash that is not a valid selector
    return 0
  }
}

function anchor(hash: string) {
  return { el: hash, top: anchorOffset(hash), behavior: anchorBehavior() }
}

/**
 * Where a new page starts. An anchor on another page is landed on, not travelled to. The same
 * target is recorded as the scroll intent, which the smoother and the scroll scenes re-apply once
 * they have changed the layout (utils/scroll-intent.ts).
 */
function position(to: RouteLocationNormalized, saved: { left: number, top: number } | null) {
  if (saved) {
    setScrollIntent({ top: saved.top })
    return { ...saved, behavior: 'instant' as const }
  }
  if (to.hash) {
    setScrollIntent({ top: 0, hash: to.hash })
    return { ...anchor(to.hash), behavior: 'instant' as const }
  }
  setScrollIntent({ top: 0 })
  return { left: 0, top: 0, behavior: 'instant' as const }
}

export default <RouterConfig>{
  scrollBehavior(to, from, saved) {
    // Same page: only a hash change scrolls. A query change (the filters) keeps the position.
    if (to.path.replace(/\/$/, '') === from.path.replace(/\/$/, '')) {
      if (from.hash && !to.hash) return saved ?? { left: 0, top: 0, behavior: 'instant' }
      if (to.hash) {
        // Also how a direct load with a hash arrives: hydration first rewrites the URL without
        // it, then restores it as a same-page change. The smoother and the scenes come later.
        setScrollIntent({ top: 0, hash: to.hash })
        return useNuxtApp().isHydrating ? { ...anchor(to.hash), behavior: 'instant' as const } : anchor(to.hash)
      }
      return false
    }

    if (from === START_LOCATION) return position(to, saved)

    // Wait for the new page and its transition, as Nuxt does, so the scroll lands on it
    const nuxtApp = useNuxtApp()
    const router = useRouter()
    return new Promise((resolve) => {
      const scroll = () => requestAnimationFrame(() => {
        resolve(router.currentRoute.value.fullPath === to.fullPath ? position(to, saved) : false)
      })
      nuxtApp.hooks.hookOnce('page:loading:end', () => {
        const transition = nuxtApp['~transitionPromise']
        if (transition) transition.then(scroll)
        else scroll()
      })
    })
  }
}
