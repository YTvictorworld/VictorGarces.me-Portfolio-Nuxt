<script setup lang="ts">
/**
 * Single motion primitive for the whole site.
 * Fades + slides content in once it becomes visible (or on mount with `immediate`).
 * Pure CSS transitions driven by IntersectionObserver, no animation library.
 * Respects prefers-reduced-motion: renders content statically, no animation.
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

const el = ref<HTMLElement | null>(null)
const reducedMotion = usePreferredReducedMotion()
const revealed = ref(false)

const style = computed(() => {
  // SSR/prerender: emit fully visible content so crawlers and no-JS users see everything
  if (import.meta.server) return {}
  if (revealed.value) {
    return {
      transition: `opacity ${props.duration}ms ease-out ${props.delay}ms, transform ${props.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${props.delay}ms`,
      opacity: '1',
      transform: 'none'
    }
  }
  return {
    opacity: '0',
    transform: `translateY(${props.y}px)`
  }
})

onMounted(() => {
  if (reducedMotion.value === 'reduce' || !('IntersectionObserver' in window)) {
    revealed.value = true
    return
  }

  if (props.immediate) {
    // double rAF: let the hidden state paint once so the transition runs
    requestAnimationFrame(() => requestAnimationFrame(() => {
      revealed.value = true
    }))
    return
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      revealed.value = true
      observer.disconnect()
    }
  }, { rootMargin: '0px 0px -40px 0px' })

  if (el.value) observer.observe(el.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div ref="el" :style="style" data-allow-mismatch="style">
    <slot />
  </div>
</template>
