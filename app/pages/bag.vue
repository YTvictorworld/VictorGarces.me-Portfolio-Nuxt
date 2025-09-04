<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// Ajusta el query para que coincida con tu content.config.ts
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('bag').first(), 
  { default: () => ({}) as IndexCollectionItem }
)

</script>

<template>
  <Motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }"
        :delay="200"
        :duration="1200"
  >
    This is just for test porpuse
  </Motion>

  <Motion is="p" preset="slideVisibleLeft">Text in Motion!</Motion>



</template>
  
