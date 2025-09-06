<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, nextTick } from 'vue'

// TypeScript interfaces
interface ImageItem {
  src: string
  alt: string
  width?: number
  height?: number
}

interface Props {
  images: ImageItem[]
  speed?: number
  pauseOnHover?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  pauseOnHover: true
})

// Reactive references with proper TypeScript types
const marqueeRef = ref<HTMLElement | null>(null)
const isAnimating = ref<boolean>(true)
const animationId = ref<number | undefined>(undefined)

// Animation state variables
const currentTranslateX = ref<number>(0)
const containerWidth = ref<number>(0)
const contentWidth = ref<number>(0)

// Function to update container and content dimensions
const updateDimensions = (): void => {
  if (!marqueeRef.value) return
  
  const container = marqueeRef.value.querySelector('.marquee-track') as HTMLElement | null
  const content = marqueeRef.value.querySelector('.marquee-content') as HTMLElement | null
  
  if (container && content) {
    containerWidth.value = container.offsetWidth
    // Divide by 2 because we have duplicated content
    contentWidth.value = content.scrollWidth / 2
  }
}

// Main animation function
const animate = (): void => {
  if (!isAnimating.value) return
  
  // Move at 60fps
  currentTranslateX.value -= props.speed / 60
  
  // Reset position when we've moved a full content width
  if (Math.abs(currentTranslateX.value) >= contentWidth.value) {
    currentTranslateX.value = 0
  }
  
  // Apply transform to the content
  if (marqueeRef.value) {
    const content = marqueeRef.value.querySelector('.marquee-content') as HTMLElement | null
    if (content) {
      content.style.transform = `translateX(${currentTranslateX.value}px)`
    }
  }
  
  // Continue animation
  animationId.value = requestAnimationFrame(animate)
}

// Start the animation
const startAnimation = (): void => {
  if (animationId.value !== undefined) return
  isAnimating.value = true
  animate()
}

// Stop the animation
const stopAnimation = (): void => {
  isAnimating.value = false
  if (animationId.value !== undefined) {
    cancelAnimationFrame(animationId.value)
    animationId.value = undefined
  }
}

// Mouse event handlers
const handleMouseEnter = (): void => {
  if (props.pauseOnHover) {
    stopAnimation()
  }
}

const handleMouseLeave = (): void => {
  if (props.pauseOnHover) {
    startAnimation()
  }
}

// Resize handler with proper typing
const handleResize = (): void => {
  updateDimensions()
}

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    updateDimensions()
    startAnimation()
  })
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
})

// Keep alive hooks
onActivated(() => {
  startAnimation()
})

onDeactivated(() => {
  stopAnimation()
})
</script>

<template>
  <div 
    ref="marqueeRef"
    class="js-marquee-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="marquee-track">
      <div class="marquee-content">
        <!-- Primera copia -->
        <div v-for="(img, index) in images" :key="`first-${index}`" class="marquee-item">
          <img 
            :src="img.src" 
            :alt="img.alt" 
            :width="img.width || 234" 
            :height="img.height || 234"
            loading="eager"
            class="rounded-lg shadow-lg flex-shrink-0"
            :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          />
        </div>
        
        <!-- Segunda copia para loop continuo -->
        <div v-for="(img, index) in images" :key="`second-${index}`" class="marquee-item">
          <img 
            :src="img.src" 
            :alt="img.alt" 
            :width="img.width || 234" 
            :height="img.height || 234"
            loading="eager"
            class="rounded-lg shadow-lg flex-shrink-0"
            :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.js-marquee-container {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.marquee-track {
  display: flex;
  width: 100%;
  overflow: hidden;
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
  display: inline-block;
}

.marquee-item img {
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .marquee-item img {
    width: 180px !important;
    height: 284px !important;
  }
  
  .marquee-content {
    gap: 1rem;
  }
}

/* Hover effects */
.marquee-item:hover img {
  transform: translateZ(0) scale(1.05);
}
</style>
