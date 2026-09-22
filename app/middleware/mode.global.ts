/**
 * Routes decide the mode: /dev/** is day, /film/** is night (with or without the /es prefix).
 * Shared pages use the visitor's stored choice, day by default. A first visit straight to a
 * forced route stores that side, so opening a post or Contact from /film stays at night.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { setMode, readStored } = useMode()
  const forced = forcedModeFor(to.path)

  if (import.meta.server) {
    setMode(forced ?? 'day', { persist: false })
    return
  }

  // Toggle navigation (useModeSwitch): the view transition animates it. With css: false the
  // leave completes synchronously, so the new page is in the DOM when page:finish fires.
  if (consumeQuietNavigation()) {
    to.meta.pageTransition = { name: 'page', mode: 'out-in', css: false }
  }

  const stored = readStored()
  if (forced) {
    setMode(forced, { persist: !stored })
  } else {
    setMode(stored ?? 'day', { persist: false })
  }
})
