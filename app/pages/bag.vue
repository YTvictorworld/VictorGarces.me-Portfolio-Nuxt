<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// Ajusta el query para que coincida con tu content.config.ts
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('bag').first(), 
  { default: () => ({}) as IndexCollectionItem }
)



</script>

<template>
U HAVE FOUND A SECRET ITEM
</template>
  
