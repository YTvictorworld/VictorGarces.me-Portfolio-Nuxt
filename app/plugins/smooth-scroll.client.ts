import type { ScrollSmoother } from 'gsap/ScrollSmoother'

/** The developer and filmmaker sections, in both languages. Shared pages scroll natively. */
const SMOOTH_PATH = /^(?:\/es)?\/(?:dev|film)(?:\/|$)/

/**
 * ScrollSmoother on the developer and filmmaker pages (owner decision, 2026-10-22).
 *
 * The scroll itself stays native, so find-in-page, the keyboard and the scrollbar all work; the
 * content follows it with a short glide. It is created per page, once the page transition and
 * the router's scroll have finished, and killed when a navigation is confirmed, so the new page
 * starts where it should instead of gliding there from the old one. It never runs on touch
 * screens or under reduced motion.
 *
 * Shared pages (blog, legal, contact) are left out on purpose: their sticky sidebars would stop
 * working inside the transformed content.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  let smoother: ScrollSmoother | undefined
  /** Bumped by every confirmed navigation, so a start() that outlived its page does nothing */
  let generation = 0
  let startedFor: string | undefined
  let settle!: () => void
  let settled = new Promise<void>(resolve => (settle = resolve))

  /**
   * Kills the smoother but leaves data-smooth alone: the header stays fixed and the content keeps
   * its padding while the old page fades out, instead of jumping up by the header's height.
   * start() settles the attribute for the next page.
   */
  function stop() {
    smoother?.kill()
    smoother = undefined
  }

  async function start(path: string) {
    const ticket = generation
    const done = settle
    if (SMOOTH_PATH.test(path) && matchMedia(SMOOTH_QUERY).matches && document.getElementById('smooth-wrapper')) {
      const { ScrollSmoother, ScrollTrigger } = await loadGsap()
      // Another navigation was confirmed while GSAP was loading: that page starts its own
      if (ticket !== generation) return
      document.documentElement.setAttribute('data-smooth', '')
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1,
        // No data-speed or data-lag anywhere yet, so there is nothing for effects to scan
        effects: false
      })
      ScrollTrigger.refresh()
      // create() moves the native scroll: back to where the router aimed, without a glide. Late
      // web fonts reflow the text above an anchor, so the target is taken again once they load.
      reapplyScrollIntent(smoother)
      const created = smoother
      document.fonts.ready.then(() => {
        if (smoother !== created) return
        ScrollTrigger.refresh()
        reapplyScrollIntent(created)
      })
    } else {
      document.documentElement.removeAttribute('data-smooth')
    }
    done()
  }

  // afterEach, not beforeEach: an aborted or failed navigation leaves the current page as it was
  router.afterEach((to, from, failure) => {
    if (failure || to.path === from.path) return
    generation++
    stop()
    startedFor = undefined
    settled = new Promise<void>(resolve => (settle = resolve))
  })

  nuxtApp.hook('page:finish', async () => {
    const path = router.currentRoute.value.path
    if (startedFor === path) return
    startedFor = path
    const ticket = generation
    // After the out-in transition and the router's scroll to the top, which wait for the same
    await nuxtApp['~transitionPromise']
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    if (ticket === generation) await start(path)
  })

  return {
    provide: {
      /** Resolves once this page's smoother exists, or once it is known there will not be one. */
      scrollSettled: () => settled
    }
  }
})
