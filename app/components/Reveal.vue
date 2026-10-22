<script setup lang="ts">
/**
 * Single motion primitive for the whole site.
 * Fades + slides content in once it becomes visible (or on mount with `immediate`).
 * Pure CSS transitions driven by IntersectionObserver, no animation library.
 * Respects prefers-reduced-motion: renders content statically, no animation.
 *
 * The prerendered HTML is always visible, and hydration cannot hide it: Vue does not patch
 * `style` while hydrating, so a hidden state computed during setup never reached the page and
 * nothing animated on a direct load. A hydrated section is therefore hidden after mount, and only
 * when it starts below the fold, where hiding it cannot flash. A section created by a client-side
 * navigation has nothing on screen yet, so it starts hidden.
 */
const props = withDefaults(defineProps<{
  delay?: number
  duration?: number
  y?: number
  /** Animate on mount instead of when scrolled into view (above-the-fold content). */
  immediate?: boolean
}>(), {
  delay: 0,
  duration: 600,
  y: 24,
  immediate: false
})

type State = 'shown' | 'hidden' | 'revealing'

const el = ref<HTMLElement | null>(null)
const hydrating = useNuxtApp().isHydrating

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const state = ref<State>(import.meta.client && !hydrating && !prefersReducedMotion() ? 'hidden' : 'shown')

const style = computed(() => {
  if (state.value === 'hidden') {
    return { opacity: '0', transform: `translateY(${props.y}px)` }
  }
  if (state.value === 'revealing') {
    return {
      transition: `opacity ${props.duration}ms ease-out ${props.delay}ms, transform ${props.duration}ms var(--ease-out) ${props.delay}ms`,
      opacity: '1',
      transform: 'none'
    }
  }
  return {}
})

function reveal() {
  // double rAF: let the hidden state paint once so the transition runs
  requestAnimationFrame(() => requestAnimationFrame(() => {
    state.value = 'revealing'
  }))
}

onMounted(() => {
  if (prefersReducedMotion() || !('IntersectionObserver' in window) || !el.value) {
    state.value = 'shown'
    return
  }

  if (state.value === 'shown') {
    // Hydrated: content in or above the viewport stays as it is
    if (el.value.getBoundingClientRect().top < window.innerHeight) return
    state.value = 'hidden'
  } else if (props.immediate) {
    reveal()
    return
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
