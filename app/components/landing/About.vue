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
  <section class="pb-12 grid md:grid-cols-1 gap-6 items-start">
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
      <Motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }"
        :delay="200"
        :duration="100"
      >
      <h2 class="text-3xl font-bold mb-6 text-pretty text-md text-center">{{ data?.title }}</h2>
      </Motion>
      <Motion
      v-motion-pop-visible-once
      :duration="200"
      >
        <p class="text-pretty text-center text-md">{{ data?.description }}</p>
      </Motion>
    </div>
  </section>
</template>
