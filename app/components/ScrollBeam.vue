<script setup lang="ts">
/**
 * Vertical line that "draws" itself downward as its container scrolls
 * through the viewport, with a glowing comet tip.
 *
 * Position it absolutely inside a `relative` parent:
 *   <ScrollBeam class="absolute inset-y-0 left-4" />
 *
 * Under prefers-reduced-motion it renders as a fully drawn static line.
 */
const props = withDefaults(defineProps<{
  /** Where in the viewport the tip "sits", 0 = top, 1 = bottom. */
  anchor?: number
  /** Show the glowing tip dot. */
  glow?: boolean
  /** Fade the top of the fill out (nice for page spines, off for timelines). */
  fadeTop?: boolean
}>(), {
  anchor: 0.6,
  glow: true,
  fadeTop: true
})

const trackRef = ref<HTMLElement | null>(null)
const { top, height } = useElementBounding(trackRef)
const { height: viewportHeight } = useWindowSize()

const reducedMotion = usePreferredReducedMotion()
const isStatic = computed(() => reducedMotion.value === 'reduce')

const progress = computed(() => {
  if (isStatic.value) return 1
  if (!height.value) return 0
  const raw = (viewportHeight.value * props.anchor - top.value) / height.value
  return Math.min(1, Math.max(0, raw))
})
</script>

<template>
  <div ref="trackRef" class="scroll-beam w-0.5" aria-hidden="true">
    <!-- Track -->
    <div class="absolute inset-0 rounded-full bg-neutral-200 dark:bg-white/10" />

    <!-- Fill -->
    <div
      class="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b"
      :class="fadeTop
        ? 'from-primary-500/0 via-primary-500 to-primary-400'
        : 'from-primary-600 via-primary-500 to-primary-400'"
      :style="{ height: `${progress * 100}%` }"
    />

    <!-- Comet tip -->
    <div
      v-if="glow && !isStatic"
      class="beam-tip absolute left-1/2 size-2.5 rounded-full bg-primary-400"
      :style="{ top: `${progress * 100}%`, opacity: progress > 0 && progress < 1 ? 1 : 0 }"
    />
  </div>
</template>

<style scoped>
.scroll-beam {
  position: absolute;
  pointer-events: none;
}

.beam-tip {
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 8px 2px color-mix(in oklab, var(--color-primary-400) 80%, transparent),
    0 0 24px 6px color-mix(in oklab, var(--color-primary-500) 40%, transparent);
  transition: opacity 0.3s ease;
}
</style>
