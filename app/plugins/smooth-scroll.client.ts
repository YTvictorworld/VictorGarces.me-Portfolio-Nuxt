import type { ScrollSmoother } from 'gsap/ScrollSmoother'

/** The developer and filmmaker sections, in both languages. Shared pages scroll natively. */
const SMOOTH_PATH = /^(?:\/es)?\/(?:dev|film)(?:\/|$)/

/**
 * ScrollSmoother on the developer and filmmaker pages (owner decision, 2026-10-22).
 *
 * The scroll itself stays native, so find-in-page, the keyboard and the scrollbar all work; the
 * content follows it with a short glide. It is created per page, once the page transition and
 * the router's scroll have finished, and killed before every navigation, so the new page starts
 * where it should instead of gliding there from the old one. It never runs on touch screens or
 * under reduced motion.
 *
 * Shared pages (blog, legal, contact) are left out on purpose: their sticky sidebars would stop
 * working inside the transformed content.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  let smoother: ScrollSmoother | undefined
  let startedFor: string | undefined
  let settle!: () => void
  let settled = new Promise<void>(resolve => (settle = resolve))

  function stop() {
    smoother?.kill()
    smoother = undefined
    document.documentElement.removeAttribute('data-smooth')
  }

  async function start(path: string) {
    if (SMOOTH_PATH.test(path) && matchMedia(SMOOTH_QUERY).matches && document.getElementById('smooth-wrapper')) {
      const { ScrollSmoother, ScrollTrigger } = await loadGsap()
      // The visitor may have navigated again while GSAP was loading
      if (router.currentRoute.value.path !== path) return
      document.documentElement.setAttribute('data-smooth', '')
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1,
        effects: true
      })
      ScrollTrigger.refresh()
    }
    settle()
  }

  router.beforeEach((to, from) => {
    if (to.path === from.path) return
    stop()
    startedFor = undefined
    settled = new Promise<void>(resolve => (settle = resolve))
  })

  nuxtApp.hook('page:finish', async () => {
    const path = router.currentRoute.value.path
    if (startedFor === path) return
    startedFor = path
    // After the out-in transition and the router's scroll to the top, which wait for the same
    await nuxtApp['~transitionPromise']
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    if (router.currentRoute.value.path === path) await start(path)
  })

  return {
    provide: {
      /** Resolves once this page's smoother exists, or once it is known there will not be one. */
      scrollSettled: () => settled
    }
  }
})
