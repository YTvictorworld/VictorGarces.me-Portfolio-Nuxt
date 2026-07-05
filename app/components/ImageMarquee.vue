<script setup lang="ts">
interface ImageItem {
  src: string
  alt: string
  width?: number
  height?: number
}

interface Props {
  images: ImageItem[]
  /** Scroll speed in px/second. */
  speed?: number
  pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  pauseOnHover: true
})

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const reducedMotion = usePreferredReducedMotion()
// gated behind mount so server and client render the same structure (hydration-safe)
const mounted = ref(false)
const prefersStatic = computed(() => mounted.value && reducedMotion.value === 'reduce')

let rafId: number | undefined
let lastTime: number | null = null
let translateX = 0
let contentWidth = 0
let hovered = false
let inView = true

const updateDimensions = (): void => {
  if (!contentRef.value) return
  // Content is duplicated once, so a full loop is half the scroll width
  contentWidth = contentRef.value.scrollWidth / 2
}

const tick = (now: number): void => {
  if (lastTime === null) lastTime = now
  const dt = (now - lastTime) / 1000
  lastTime = now

  translateX -= props.speed * dt
  if (contentWidth > 0 && Math.abs(translateX) >= contentWidth) {
    translateX += contentWidth
  }

  if (contentRef.value) {
    contentRef.value.style.transform = `translate3d(${translateX}px, 0, 0)`
  }
  rafId = requestAnimationFrame(tick)
}

const startAnimation = (): void => {
  if (rafId !== undefined || prefersStatic.value || hovered || !inView) return
  lastTime = null
  rafId = requestAnimationFrame(tick)
}

const stopAnimation = (): void => {
  if (rafId !== undefined) {
    cancelAnimationFrame(rafId)
    rafId = undefined
  }
}

const handleMouseEnter = (): void => {
  if (!props.pauseOnHover) return
  hovered = true
  stopAnimation()
}

const handleMouseLeave = (): void => {
  if (!props.pauseOnHover) return
  hovered = false
  startAnimation()
}

let observer: IntersectionObserver | undefined
let cleanupResize: (() => void) | undefined

onMounted(() => {
  mounted.value = true
  nextTick(() => {
    updateDimensions()
    startAnimation()
  })

  const onResize = () => updateDimensions()
  window.addEventListener('resize', onResize)
  cleanupResize = () => window.removeEventListener('resize', onResize)

  // Don't burn frames while the marquee is offscreen
  if (containerRef.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (inView) startAnimation()
      else stopAnimation()
    })
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  stopAnimation()
  cleanupResize?.()
  observer?.disconnect()
})

onActivated(startAnimation)
onDeactivated(stopAnimation)
</script>

<template>
  <div
    ref="containerRef"
    class="marquee-container"
    :class="{ 'marquee-static': prefersStatic }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="contentRef" class="marquee-content">
      <template v-for="copy in (prefersStatic ? 1 : 2)" :key="copy">
        <div
          v-for="(img, index) in images"
          :key="`${copy}-${index}`"
          class="marquee-item"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <AppImage
            :src="img.src"
            :alt="copy === 2 ? '' : img.alt"
            :width="img.width || 234"
            :height="img.height || 280"
            :loading="copy === 1 && index < 3 ? 'eager' : 'lazy'"
            :fetchpriority="copy === 1 && index < 2 ? 'high' : 'auto'"
            class="marquee-photo rounded-lg shadow-lg w-fit"
            :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
            img-class="rounded-lg"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  /* Fade edges so images slide in/out of nothing */
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* Reduced motion: a normal scrollable strip, no animation */
.marquee-static {
  overflow-x: auto;
  mask-image: none;
  -webkit-mask-image: none;
}

.marquee-content {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  will-change: transform;
  backface-visibility: hidden;
}

.marquee-item {
  flex-shrink: 0;
}

.marquee-photo {
  transition: transform 0.3s ease;
  transform: translateZ(0);
}

.marquee-item :deep(.marquee-photo img) {
  display: block;
  object-fit: cover;
}

@media (max-width: 640px) {
  .marquee-item :deep(.marquee-photo img) {
    width: 180px !important;
    height: 284px !important;
  }

  .marquee-content {
    gap: 1rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .marquee-item:hover .marquee-photo {
    transform: translateZ(0) scale(1.05);
  }
}
</style>
