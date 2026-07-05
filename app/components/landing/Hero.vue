<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <section class="relative py-24 text-center overflow-hidden">
    <!-- Soft radial glow behind the hero -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-primary-500)_12%,transparent),transparent_65%)]"
    />
    <UContainer>
      <!-- Avatar -->
      <Reveal immediate :duration="700" :y="32" class="flex items-center justify-center mb-8">
        <UAvatar
          class="size-24 z-1 ring-4 ring-primary-500/20 ring-offset-4 ring-offset-white dark:ring-offset-neutral-900"
          :chip="{ inset: true, color: 'success', size: '2xl' }"
          :src="$colorMode.value === 'dark' ? global?.picture?.dark : global?.picture?.light"
          :alt="global?.picture?.alt" />
      </Reveal>

      <!-- Role overline + Title -->
      <Reveal immediate :delay="100" :duration="700" :y="32">
        <p class="font-mono text-sm uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-4">
          {{ page?.roles }}
        </p>
        <h1
          class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 max-w-4xl mx-auto leading-tight text-balance">
          {{ page.title }}
        </h1>
      </Reveal>

      <!-- Description -->
      <Reveal immediate :delay="200" :duration="700" :y="32">
        <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto text-pretty">
          {{ page.description }}
        </p>
      </Reveal>

      <!-- Action buttons -->
      <Reveal immediate :delay="300" :duration="700" :y="32">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <UButton
            v-for="link in page?.hero?.links"
            :key="link.label"
            v-bind="{ size: 'lg', color: 'neutral', ...link }"
            class="gap-2"
          />

          <!-- Availability status -->
          <UButton :color="global?.available ? 'success' : 'error'" variant="ghost" size="lg" class="gap-2"
            :to="global?.available ? global?.meetingLink : ''"
            :label="global?.available ? 'Available for new projects' : 'Not available at the moment'">
            <template #leading>
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping"
                  :class="global?.available ? 'bg-green-500' : 'bg-red-500'" />
                <span class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global?.available ? 'bg-green-500' : 'bg-red-500'" />
              </span>
            </template>
          </UButton>
        </div>
      </Reveal>

      <!-- Social links -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <Reveal v-for="(link, index) of footer?.links" :key="index" immediate :delay="450 + index * 80" :duration="500" :y="16">
          <UButton v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }" />
        </Reveal>
      </div>

      <!-- Image marquee -->
      <div class="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <Reveal immediate :delay="500" :duration="900" :y="48">
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
        </Reveal>
      </div>
    </UContainer>
  </section>
</template>
