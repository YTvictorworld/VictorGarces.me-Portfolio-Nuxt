<script setup lang="ts">
import type { IndexEnCollectionItem as IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section class="py-12">
    <UContainer class="px-0 !pt-0">
      <Reveal :duration="600">
        <div class="text-center mb-4">
          <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
            {{ $t('testimonials.eyebrow') }}
          </p>
          <h2 class="text-3xl font-bold tracking-tight">{{ $t('testimonials.title') }}</h2>
        </div>
      </Reveal>

      <Reveal :delay="150" :duration="700">
        <UCarousel
          :items="page.testimonials"
          :autoplay="{ delay: 5000 }"
          dots
          loop
          class="overflow-visible"
          v-slot="{ item }"
        >
          <div class="w-full flex-shrink-0 px-4 sm:px-12 lg:px-16">
            <figure class="sm:py-12 lg:py-12 sm:gap-8 flex flex-col items-center text-center gap-4">
              <!-- Quote -->
              <blockquote
                class="!text-xl text-balance relative before:content-['“'] before:text-6xl lg:before:text-7xl before:text-primary-500/30 before:absolute before:-left-6 lg:before:-left-1 before:-top-2 lg:before:-top-4 after:content-['”'] after:text-5xl lg:after:text-7xl after:text-primary-500/30 after:absolute after:-right-4 lg:after:-right-1 after:mt-1 lg:after:mt-0">
                {{ item.quote }}
              </blockquote>
              <!-- Author -->
              <figcaption class="flex flex-col items-center gap-2">
                <UAvatar
                  v-if="item.author.avatar?.src"
                  :src="item.author.avatar.src"
                  :alt="item.author.name"
                  size="xl"
                />
                <div v-else
                  class="size-12 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center">
                  <span class="text-xl font-semibold">{{ item.author.name.charAt(0) }}</span>
                </div>
                <div class="text-lg font-medium text-neutral-900 dark:text-white">
                  {{ item.author.name }}
                </div>
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                  {{ item.author.description }}
                </div>
              </figcaption>
            </figure>
          </div>
        </UCarousel>
      </Reveal>
    </UContainer>
  </section>
</template>
