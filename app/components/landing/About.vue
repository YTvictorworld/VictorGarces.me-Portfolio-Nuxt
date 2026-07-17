<script setup lang="ts">
interface Props {
  data?: {
    title: string
    description: string
  }
}

defineProps<Props>()
</script>

<template>
  <section class="pb-12">
    <Reveal :duration="600">
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
        {{ $t('about.eyebrow') }}
      </p>
      <h2 class="text-3xl font-bold tracking-tight mb-6">{{ data?.title }}</h2>
    </Reveal>
    <Reveal :delay="100" :duration="600">
      <p class="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed text-pretty">
        {{ data?.description }}
      </p>
    </Reveal>
  </section>
</template>
