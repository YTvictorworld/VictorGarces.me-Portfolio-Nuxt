import type { gsap as Gsap } from 'gsap'
import type { DrawSVGPlugin as DrawSVG } from 'gsap/DrawSVGPlugin'
import type { ScrollSmoother as Smoother } from 'gsap/ScrollSmoother'
import type { ScrollTrigger as Trigger } from 'gsap/ScrollTrigger'

export interface GsapKit {
  gsap: typeof Gsap
  ScrollTrigger: typeof Trigger
  ScrollSmoother: typeof Smoother
  DrawSVGPlugin: typeof DrawSVG
}

/**
 * Where the scroll scenes run: a desktop-sized viewport, and never under reduced motion.
 * Below it every scene keeps its static drawing, which is also the prerendered state.
 */
export const SCENE_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

/** Smooth scrolling also needs a mouse or trackpad: touch screens already have their own inertia. */
export const SMOOTH_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

let kit: Promise<GsapKit> | undefined

/**
 * GSAP and its scroll plugins, imported once and only on a page that animates, so none of it
 * reaches the entry chunk.
 */
export function loadGsap() {
  kit ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollSmoother'),
    import('gsap/DrawSVGPlugin')
  ]).then(([{ gsap }, { ScrollTrigger }, { ScrollSmoother }, { DrawSVGPlugin }]) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin)
    return { gsap, ScrollTrigger, ScrollSmoother, DrawSVGPlugin }
  })
  return kit
}
