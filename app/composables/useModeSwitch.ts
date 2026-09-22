import type { Mode } from '~/utils/mode'
import type { TransitionOrigin } from './useModeTransition'

// Shared by the header toggle and the mobile pill
let quietNextNavigation = false
let clearAnnouncement: ReturnType<typeof setTimeout> | undefined

/**
 * One-shot flag read by the mode middleware: the next navigation runs inside the mode view
 * transition, so it must not also play the out-in page transition. That transition waits on
 * requestAnimationFrame, which the browser pauses while it holds the view-transition frame,
 * so the new page would only appear after the circle had already revealed the old one.
 */
export function consumeQuietNavigation(): boolean {
  const value = quietNextNavigation
  quietNextNavigation = false
  return value
}

/** Resolves once the next page has rendered, or after a safety timeout (also bounds slow fetches). */
function nextPageRendered(): Promise<void> {
  const nuxtApp = useNuxtApp()
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer)
      unhook()
      resolve()
    }
    const unhook = nuxtApp.hook('page:finish', done)
    const timer = setTimeout(done, 1200)
  })
}

/**
 * What the header toggle and the mobile pill do. On a forced page (/dev/**, /film/**) the
 * switch goes to the same page in the other mode; on shared pages it flips the mode in place.
 * The choice is stored, animated from `origin`, and announced to screen readers.
 */
export function useModeSwitch() {
  const route = useRoute()
  const localePath = useLocalePath()
  const { t } = useI18n()
  const { mode, setMode, announcement } = useMode()
  const { exists } = useNav()
  const { run } = useModeTransition()

  async function toggle(origin?: TransitionOrigin) {
    const next: Mode = mode.value === 'day' ? 'night' : 'day'
    const sibling = localePath(siblingPath(route.path))
    const navigate = forcedModeFor(route.path) !== null && exists(siblingPath(route.path))

    // Fetch the sibling's code before the frame freezes, not inside it
    if (navigate) await preloadRouteComponents(sibling)

    await run(async () => {
      setMode(next)
      if (navigate) {
        quietNextNavigation = true
        // Listen before navigating: a cached page can finish before navigateTo settles
        const rendered = nextPageRendered()
        navigateTo(sibling)
        await rendered
        quietNextNavigation = false
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }, origin)

    // Cleared after being read, so the next switch is always a change the live region announces
    announcement.value = t(next === 'night' ? 'mode.announceNight' : 'mode.announceDay')
    clearTimeout(clearAnnouncement)
    clearAnnouncement = setTimeout(() => {
      announcement.value = ''
    }, 1000)
  }

  return { toggle }
}
