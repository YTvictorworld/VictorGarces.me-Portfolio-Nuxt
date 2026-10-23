import type { Ref } from 'vue'

interface SceneKit extends GsapKit {
  root: HTMLElement
  /** The fixed header's height, read live, for pins that start just below it */
  headerOffset: () => number
}

/** May return a cleanup function, for anything the scene changed that GSAP did not set itself. */
type SceneBuilder = (kit: SceneKit) => unknown

function headerOffset() {
  return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0
}

/**
 * A scroll-linked GSAP scene scoped to one component.
 *
 * The prerendered markup is the scene's resting state, which is also what phones and reduced
 * motion get, so nothing here runs during setup or changes the HTML. After mount, and only while
 * SCENE_QUERY matches, GSAP is loaded and `build` runs inside a matchMedia context: every tween
 * and ScrollTrigger it creates is reverted on unmount or when the query stops matching. A page
 * opened in a narrow window gets its scene once the window is widened.
 *
 * Scenes wait for the page's ScrollSmoother, because a pin made before it exists is of the wrong
 * kind. That means they are built after the router has scrolled, and a pin's spacer pushes
 * everything below it down, so the router's target is re-applied once the scene exists
 * (utils/scroll-intent.ts).
 */
export function useScrollScene(root: Ref<HTMLElement | null>, build: SceneBuilder) {
  const { $scrollSettled } = useNuxtApp()
  const query = import.meta.client ? matchMedia(SCENE_QUERY) : undefined
  let mm: gsap.MatchMedia | undefined
  let alive = true
  let begun = false

  async function begin() {
    if (begun) return
    begun = true
    query?.removeEventListener('change', onChange)
    await $scrollSettled()
    const kit = await loadGsap()
    if (!alive || !root.value) return
    const element = root.value
    mm = kit.gsap.matchMedia(element)
    mm.add(SCENE_QUERY, () => {
      const cleanup = build({ ...kit, root: element, headerOffset })
      return typeof cleanup === 'function' ? cleanup as () => void : undefined
    })

    kit.ScrollTrigger.refresh()
    reapplyScrollIntent(kit.ScrollSmoother.get())
  }

  function onChange(event: MediaQueryListEvent) {
    if (event.matches) begin()
  }

  onMounted(() => {
    if (query?.matches) begin()
    else query?.addEventListener('change', onChange)
  })

  onBeforeUnmount(() => {
    alive = false
    query?.removeEventListener('change', onChange)
    mm?.revert()
  })
}
