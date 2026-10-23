import type { Mode } from '~/utils/mode'

/** Writes the mode to <html> right away, so a view transition captures the new frame. */
function applyToDocument(value: Mode) {
  const root = document.documentElement
  root.setAttribute('data-mode', value)
}

/**
 * Day (Developer) / night (Filmmaker) mode. The state drives the <html> attributes via
 * useHead in app.vue; the route middleware sets it on every navigation. Templates should
 * not branch on it: render both variants and let `.day-only` / `.night-only` pick, which
 * keeps prerendered HTML and hydration in agreement.
 */
export function useMode() {
  const mode = useState<Mode>('mode', () => 'day')
  const announcement = useState<string>('mode-announcement', () => '')

  function readStored(): Mode | null {
    if (import.meta.server) return null
    try {
      const value = localStorage.getItem(MODE_STORAGE_KEY)
      return isMode(value) ? value : null
    } catch {
      return null
    }
  }

  function setMode(value: Mode, { persist = true }: { persist?: boolean } = {}) {
    mode.value = value
    if (import.meta.client) {
      applyToDocument(value)
      if (persist) {
        try {
          localStorage.setItem(MODE_STORAGE_KEY, value)
        } catch {
          // storage blocked: the mode still applies for this page view
        }
      }
    }
  }

  return {
    mode: readonly(mode),
    isNight: computed(() => mode.value === 'night'),
    announcement,
    setMode,
    readStored
  }
}
