<script setup lang="ts">
/**
 * A photo from the media manifest: AVIF then WebP renditions, intrinsic size to avoid layout
 * shift, and the blurhash's average color behind it while it loads. Alt comes from the
 * manifest (Spanish when available); `decorative` hides it.
 */
const props = withDefaults(defineProps<{
  id: string
  /** CSS sizes attribute, e.g. "(max-width: 767px) 100vw, 33vw" */
  sizes?: string
  decorative?: boolean
  /** Eager + high fetch priority, for the LCP image */
  priority?: boolean
}>(), { sizes: '100vw', decorative: false, priority: false })

const media = useMediaManifest()
const photo = computed(() => media.photo(props.id))
const fallback = computed(() => photo.value ? media.photoSrc(props.id, photo.value.sizes[0]!, 'webp') : undefined)
</script>

<template>
  <picture
    v-if="photo"
    class="film-image"
    :style="{ backgroundColor: media.placeholderColor(id) }"
  >
    <source
      v-if="photo.formats.includes('avif')"
      type="image/avif"
      :srcset="media.srcset(id, 'avif')"
      :sizes="sizes"
    >
    <source
      type="image/webp"
      :srcset="media.srcset(id, 'webp')"
      :sizes="sizes"
    >
    <img
      :src="fallback"
      :alt="decorative ? '' : media.alt(id)"
      :width="photo.width"
      :height="photo.height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
    >
  </picture>
</template>

<style scoped>
.film-image {
  display: block;
  overflow: hidden;
}

.film-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
