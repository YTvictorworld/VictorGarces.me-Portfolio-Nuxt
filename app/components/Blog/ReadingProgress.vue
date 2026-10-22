<script setup lang="ts">
/**
 * Thin reading-progress bar fixed to the top of the viewport, on post pages.
 * Scroll-linked (not autonomous), so it stays useful under reduced motion.
 * Where scroll-driven animations exist, CSS runs it off the main thread; the script below is
 * only a fallback for browsers without them.
 */
const progress = ref(0)
const fallback = ref(false)

let frame = 0
const update = () => {
  frame = 0
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}
// One layout read and one write per frame, however many scroll events arrive
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(update)
}

// The target stays undefined until mount decides a fallback is needed, so nothing touches
// `window` during prerender and supporting browsers never get the listeners
const target = computed(() => fallback.value ? window : undefined)
useEventListener(target, 'scroll', schedule, { passive: true })
useEventListener(target, 'resize', schedule, { passive: true })

onMounted(() => {
  if (CSS.supports('animation-timeline: scroll()')) return
  fallback.value = true
  update()
})
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div
    class="fixed top-0 inset-x-0 z-[60] h-0.5 pointer-events-none"
    aria-hidden="true"
  >
    <!-- With a scroll timeline the animation overrides this inline transform -->
    <div
      class="bar h-full origin-left will-change-transform"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<style scoped>
.bar {
  background: var(--accent);
}

@supports (animation-timeline: scroll()) {
  .bar {
    animation: reading-progress linear both;
    animation-timeline: scroll(root);
  }
}

@keyframes reading-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
