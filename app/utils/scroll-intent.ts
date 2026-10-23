import type { ScrollSmoother } from 'gsap/ScrollSmoother'

/**
 * Where the router meant a new page to land: the top, an anchor, or the position Back restores.
 *
 * The router scrolls before ScrollSmoother and the scroll scenes exist, and both change the page
 * afterwards: the smoother moves the native scroll when it is created, and every pin adds a spacer
 * that pushes the content below it down. Each of them calls reapplyScrollIntent() once it has
 * changed the layout, so the visitor still ends up where the router aimed. The intent is dropped
 * the moment the visitor scrolls, types or touches, so nothing ever pulls them back.
 */
interface ScrollIntent {
  top: number
  hash?: string
}

const USER_INPUT = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const

let intent: ScrollIntent | undefined
let expiry: ReturnType<typeof setTimeout> | undefined

function forget() {
  intent = undefined
  clearTimeout(expiry)
  for (const type of USER_INPUT) window.removeEventListener(type, forget, { capture: true })
}

export function setScrollIntent(next: ScrollIntent) {
  forget()
  intent = next
  for (const type of USER_INPUT) window.addEventListener(type, forget, { capture: true, passive: true })
  // Long enough for GSAP to arrive on a slow connection, short enough not to surprise anyone
  expiry = setTimeout(forget, 4000)
}

function anchorTarget(hash: string) {
  try {
    return document.querySelector<HTMLElement>(hash)
  } catch {
    // A hash that is not a valid selector
    return null
  }
}

/**
 * The element's distance from the top of the document as laid out, ignoring transforms. Both
 * matter here: ScrollSmoother moves the whole content with one, and a Reveal section still
 * sliding in has its own, and neither changes where the scroll has to go.
 */
function layoutTop(element: HTMLElement) {
  let top = 0
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop
  }
  return top
}

export function reapplyScrollIntent(smoother?: ScrollSmoother | null) {
  if (!intent) return
  let top = intent.top
  const target = intent.hash ? anchorTarget(intent.hash) : null
  if (target) {
    const offset = (Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0)
      + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
    top = layoutTop(target) - offset
  }

  if (!smoother) {
    window.scrollTo({ top, behavior: 'instant' })
    return
  }
  // `false` jumps instead of gliding. Not smooth(0): that stops the content following the scroll.
  smoother.scrollTo(top, false)
}
