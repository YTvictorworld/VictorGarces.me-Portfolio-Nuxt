<script setup lang="ts">
/**
 * Thin reading-progress bar fixed to the top of the viewport, on post pages.
 * Scroll-linked (not autonomous), so it stays useful under reduced motion.
 */
const progress = ref(0)

const update = () => {
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}

// no explicit `window` reference at setup, keeps the component SSR-safe
useEventListener('scroll', update, { passive: true })
useEventListener('resize', update, { passive: true })
onMounted(update)
</script>

<template>
  <div
    class="fixed top-0 inset-x-0 z-[60] h-0.5 pointer-events-none"
    aria-hidden="true"
  >
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
</style>
