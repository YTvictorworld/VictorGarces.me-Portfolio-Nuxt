<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section class="py-12">
    <UContainer class="px-0 !pt-0">
      <UCarousel
        :items="page.testimonials"
        :autoplay="{ delay: 4000 }"
        dots
        loop
        class="overflow-visible"
        v-slot="{ item }"
      >
        <div  class="w-full flex-shrink-0 px-4 sm:px-12 lg:px-16">
          <div class="sm:py-12 lg:py-12 sm:gap-8 flex flex-col items-center text-center gap-4">
            <!-- Quote -->
            <p class="!text-xl text-balance relative before:content-['“'] before:text-6xl lg:before:text-7xl before:absolute before:-left-6 lg:before:-left-1 before:-top-2 lg:before:-top-4 after:content-['”'] after:text-5xl lg:after:text-7xl after:absolute after:-right-4 lg:after:-right-1 after:mt-1 lg:after:mt-0">
              {{ item.quote }}
            </p>
            <!-- Avatar and author -->
            <div class="flex flex-col items-center gap-2">
              <UAvatar
                v-if="item.author.avatar"
                :src="item.author.avatar.src"
                :alt="item.author.avatar.alt"
                size="xl"
              />
              <div v-else class="w-16 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span class="text-3xl text-gray-500">{{ item.author.name.charAt(0) }}</span>
              </div>
              <div class="text-lg font-medium text-gray-900 dark:text-white">
                {{ item.author.name }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ item.author.description }}
              </div>
            </div>
          </div>
        </div>
      </UCarousel>
    </UContainer>
  </section>
</template>
