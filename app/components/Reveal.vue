<script setup lang="ts">
/**
 * Single entrance reveal for the whole site.
 * Fades + slides content in once it scrolls into view.
 * Pure CSS transitions driven by IntersectionObserver, no animation library.
 * Respects prefers-reduced-motion: renders content statically, no animation.
 *
 * The prerendered HTML is always visible, and hydration cannot hide it: Vue does not patch
 * `style` while hydrating, so a hidden state computed during setup never reached the page and
 * nothing animated on a direct load. A hydrated section is therefore hidden after mount, and only
 * when it starts below the fold, where hiding it cannot flash. A section created by a client-side
 * navigation has nothing on screen yet, so it starts hidden.
 */
const DURATION = 600
const OFFSET = 24

type State = 'shown' | 'hidden' | 'revealing'

const el = ref<HTMLElement | null>(null)
const hydrating = useNuxtApp().isHydrating

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const state = ref<State>(import.meta.client && !hydrating && !prefersReducedMotion() ? 'hidden' : 'shown')

const style = computed(() => {
  if (state.value === 'hidden') {
    return { opacity: '0', transform: `translateY(${OFFSET}px)` }
  }
  if (state.value === 'revealing') {
    return {
      transition: `opacity ${DURATION}ms ease-out, transform ${DURATION}ms var(--ease-out)`,
      opacity: '1',
      transform: 'none'
    }
  }
  return {}
})

onMounted(() => {
  if (prefersReducedMotion() || !('IntersectionObserver' in window) || !el.value) {
    state.value = 'shown'
    return
  }

  // Hydrated: content in or above the viewport stays as it is
  if (state.value === 'shown') {
    if (el.value.getBoundingClientRect().top < window.innerHeight) return
    state.value = 'hidden'
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      state.value = 'revealing'
      observer.disconnect()
    }
  }, { rootMargin: '0px 0px -40px 0px' })

  observer.observe(el.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="el"
    :style="style"
  >
    <slot />
  </div>
</template>
