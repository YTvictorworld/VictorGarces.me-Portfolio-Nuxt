import type { Ref } from 'vue'

/** May return a cleanup function, for anything the scene changed that GSAP did not set itself. */
type SceneBuilder = (kit: GsapKit & { root: HTMLElement }) => unknown

/**
 * A scroll-linked GSAP scene scoped to one component.
 *
 * The prerendered markup is the scene's resting state, which is also what phones and reduced
 * motion get, so nothing here runs during setup or changes the HTML. After mount, and only when
 * SCENE_QUERY matches, GSAP is loaded and `build` runs inside a matchMedia context: every tween
 * and ScrollTrigger it creates is reverted on unmount or when the query stops matching, and a
 * function returned by `build` runs then too, for anything GSAP did not set itself.
 *
 * Scenes wait for the page's ScrollSmoother, because a pin made before it exists would be of
 * the wrong kind.
 */
export function useScrollScene(root: Ref<HTMLElement | null>, build: SceneBuilder) {
  const { $scrollSettled } = useNuxtApp()
  let mm: gsap.MatchMedia | undefined
  let alive = true

  onMounted(async () => {
    if (!matchMedia(SCENE_QUERY).matches) return
    await $scrollSettled()
    const kit = await loadGsap()
    if (!alive || !root.value) return
    const element = root.value
    mm = kit.gsap.matchMedia(element)
    mm.add(SCENE_QUERY, () => {
      const cleanup = build({ ...kit, root: element })
      return typeof cleanup === 'function' ? cleanup as () => void : undefined
    })
  })

  onBeforeUnmount(() => {
    alive = false
    mm?.revert()
  })
}
