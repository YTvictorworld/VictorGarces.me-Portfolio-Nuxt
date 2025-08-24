<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

// Ajusta el query para que coincida con tu content.config.ts
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('index').first(), 
  { default: () => ({}) as IndexCollectionItem }
)


/* if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
 */
useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
    <!-- resto de secciones -->

<!--     <LandingHero :page="page as IndexCollectionItem" />
 -->
  <div v-if="page && page.hero">
  
  </div>
  <div v-else class="py-24 text-center text-gray-500">
    No se ha encontrado la sección Hero. Revisa tu contenido en content/index.md.
  </div>
</template>