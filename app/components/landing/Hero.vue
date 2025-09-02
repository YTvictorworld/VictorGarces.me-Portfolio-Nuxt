<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()

</script>

<template>
  <section class="relative py-24 text-center overflow-hidden">
    <UContainer>
      <!-- Avatar/Picture -->
      <div class="flex items-center justify-center mb-8">
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.1
          }"
        >
          <!-- Alternativa a UColorModeAvatar -->
          <UAvatar
            class="size-22 ring-4 ring-primary-500/20 ring-offset-4 ring-offset-white dark:ring-offset-gray-900"
            :src="$colorMode.value === 'dark' ? global?.picture?.dark : global?.picture?.light"
            :alt="global?.picture?.alt"
            size="3xl"
          />
        </Motion>
      </div>

      <!-- Title -->
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <h1 class="text-4x1 sm:text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight text-shadow-md">
          {{ page.title }}
        </h1>
      </Motion>

      <!-- Description -->
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ page.description }}
        </p>
      </Motion>

      <!-- Action Buttons -->
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <!-- Main CTA Button -->
        
          <UButton
            :color="page?.hero?.links?.[0]?.color || 'neutral'"
            size="lg"
            class="gap-2"
            :to="page?.hero?.links?.[0]?.to"
            :label="page?.hero?.links?.[0]?.label"
          >
          </UButton>

      <!-- Social Links -->
        
          
          <!-- Availability Status -->
          <UButton
            :color="global?.available ? 'success' : 'error'"
            variant="ghost"
            size="lg"
            class="gap-2"
            :to="global?.available ? global?.meetingLink : ''"
            :label="global?.available ? 'Available for new projects' : 'Not available at the moment'"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global?.available ? 'bg-green-500 animate-ping' : 'bg-red-500'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global?.available ? 'bg-green-500' : 'bg-red-500'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <!-- Social Links -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>

      <!-- Image Marquee (alternativa a UPageMarquee) -->
      <div class="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
        <div class="flex animate-marquee gap-6 py-4 hover:pause">
          <template v-for="(img, index) in page?.hero?.images" :key="index">
            <Motion
              :initial="{
                scale: 1.1,
                opacity: 0,
                filter: 'blur(20px)'
              }"
              :animate="{
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)'
              }"
              :transition="{
                duration: 0.6,
                delay: index * 0.1
              }"
            >
              <img
                v-bind="img"
                width="234"
                height="234"
                class="rounded-lg shadow-lg flex-shrink-0"
                :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
              />
            </Motion>
          </template>
          
          <!-- Duplicate for seamless loop -->
          <template v-for="(img, index) in page?.hero?.images" :key="`dup-${index}`">
            <img
              v-bind="img"
              width="234"
              height="234"
              class="rounded-lg shadow-lg flex-shrink-0"
              :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
            />
          </template>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
/* Alternativa CSS para el marquee */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 40s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

/* Text shadow utility */
.text-shadow-md {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
}
</style>
