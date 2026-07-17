<script setup lang="ts">
/**
 * Remote image with a shimmer skeleton while loading and a graceful
 * fallback on error. Made for slow connections: no layout jumps, no
 * broken-image icons. Sizing/rounding go on the root via `class`;
 * fit/aspect classes for the <img> itself go in `img-class`.
 */
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto'
  imgClass?: string
}>(), {
  loading: 'lazy',
  fetchpriority: 'auto'
})

const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const failed = ref(false)

const onLoad = (): void => {
  loaded.value = true
}

const onError = (): void => {
  failed.value = true
}

// cached images may be complete before hydration attaches @load
onMounted(() => {
  const el = imgRef.value
  if (el?.complete) {
    if (el.naturalWidth > 0) loaded.value = true
    else if (el.src) failed.value = true
  }
})
</script>

<template>
  <div class="relative overflow-hidden">
    <img
      ref="imgRef"
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :loading="props.loading"
      :fetchpriority="props.fetchpriority"
      decoding="async"
      :class="props.imgClass"
      :style="{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.5s ease' }"
      @load="onLoad"
      @error="onError"
    />

    <!-- Shimmer skeleton while loading -->
    <div v-if="!loaded && !failed" class="img-skeleton absolute inset-0" aria-hidden="true" />

    <!-- Quiet fallback when the image can't load -->
    <div
      v-else-if="failed"
      class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-white/5"
      aria-hidden="true"
    >
      <UIcon name="i-lucide-image-off" class="size-6 text-neutral-400 dark:text-neutral-600" />
    </div>
  </div>
</template>

<style scoped>
.img-skeleton {
  background-color: var(--color-neutral-200);
  overflow: hidden;
}

.dark .img-skeleton {
  background-color: color-mix(in srgb, white 6%, transparent);
}

.img-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, white 45%, transparent),
    transparent
  );
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

.dark .img-skeleton::after {
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, white 9%, transparent),
    transparent
  );
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
