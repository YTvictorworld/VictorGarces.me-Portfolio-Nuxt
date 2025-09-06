<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import ImageMarquee from '../ImageMarquee.vue'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

</script>

<template>
  <section class="relative py-24 text-center overflow-hidden">
    <UContainer>
      <!-- Avatar/Picture -->
      <div v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="200"
        :duration="1200" class="flex items-center justify-center mb-8">
        <UAvatar
          class="size-24 z-1 ring-4 ring-primary-500/20 ring-offset-4 ring-offset-white dark:ring-offset-gray-900"
          :chip="{ inset: true, color: 'success', size: '2xl' }"
          :src="$colorMode.value === 'dark' ? global?.picture?.dark : global?.picture?.light"
          :alt="global?.picture?.alt" />
      </div>
      <!-- Title -->
      <Motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="400" :duration="1200">
        <h1 class="text-4x1 sm:text-4xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto leading-tight text-shadow-md">
          {{ page.title }}
        </h1>
        <span class="font-mono">{{ page?.roles }}</span>
      </Motion>

      <!-- Description -->
      <Motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="600" :duration="1200">
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ page.description }}
        </p>
      </Motion>

      <!-- Action Buttons -->
      <Motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="800" :duration="1200">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <!-- Main CTA Button -->

          <UButton :color="page?.hero?.links?.[0]?.color || 'neutral'" size="lg" class="gap-2"
            :to="page?.hero?.links?.[0]?.to" :label="page?.hero?.links?.[0]?.label">
          </UButton>

          <!-- Social Links -->
          <!-- Availability Status -->
          <UButton :color="global?.available ? 'success' : 'error'" variant="ghost" size="lg" class="gap-2"
            :to="global?.available ? global?.meetingLink : ''"
            :label="global?.available ? 'Available for new projects' : 'Not available at the moment'">
            <template #leading>
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global?.available ? 'bg-green-500 animate-ping' : 'bg-red-500'" />
                <span class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global?.available ? 'bg-green-500' : 'bg-red-500'" />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <!-- Social Links -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <Motion v-for="(link, index) of footer?.links" :key="index" :initial="{ opacity: 0, y: 100 }"
          :enter="{ opacity: 1, y: 0, scale: 1 }" :delay="1400" :duration="1200">
          <UButton v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }" />
        </Motion>
      </div>

      <!-- Image Marquee (JavaScript-based for reliable mobile performance) -->
      <div class="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <Motion v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :delay="1200" :duration="1200">
          <ImageMarquee 
            :images="page?.hero?.images?.map(img => ({ 
              src: img.src, 
              alt: img.alt, 
              width: 234, 
              height: 280 
            }))" 
            :speed="50" 
            :pause-on-hover="true" 
          />
        </Motion>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
/* Text shadow utility */
.text-shadow-md {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
}
</style>
