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
  <section class="py-12 grid md:grid-cols-1 gap-6 items-start">
    <div class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
      <h2 class="text-3xl font-bold mb-6 text-pretty text-md">{{ data?.title }}</h2>
      <p class="text-pretty text-md">{{ data?.description }}</p>
    </div>
  </section>
</template>
