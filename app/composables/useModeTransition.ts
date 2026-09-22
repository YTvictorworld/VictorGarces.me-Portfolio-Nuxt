export interface TransitionOrigin {
  x: number
  y: number
}

function durationFromToken(name: string, fallback: number): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const ms = Number.parseFloat(value)
  return Number.isFinite(ms) ? ms : fallback
}

/**
 * Day/night switch animation: the new mode is revealed by a circle growing from `origin`
 * (the toggle knob), using the View Transitions API. Reduced motion gets the browser's
 * cross-fade, shortened to --t-mode (150 ms); without the API the change is instant.
 */
export function useModeTransition() {
  const reducedMotion = usePreferredReducedMotion()

  async function run(apply: () => void | Promise<void>, origin?: TransitionOrigin) {
    if (import.meta.server) return

    if (typeof document.startViewTransition !== 'function') {
      await apply()
      return
    }

    const root = document.documentElement
    const circle = reducedMotion.value !== 'reduce'
    const x = origin?.x ?? window.innerWidth / 2
    const y = origin?.y ?? 0
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    if (circle) root.classList.add('mode-circle')
    const transition = document.startViewTransition(() => apply())

    try {
      await transition.ready
      if (circle) {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: durationFromToken('--t-mode', 700),
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        )
      }
      await transition.finished
    } catch {
      // Transition skipped (e.g. a second click): the mode was still applied
    } finally {
      root.classList.remove('mode-circle')
    }
  }

  return { run }
}
