<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
const { footer, global } = useAppConfig()

// Ajusta el query para que coincida con tu content.config.ts
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('index').first(), 
  { default: () => ({}) as IndexCollectionItem }
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

 
useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})


</script>

<template>
  <div v-if="page">
    <LandingHero :page />
    <section class="py-16">
      <UContainer class="grid md:grid-cols-2 gap-12s lg:gap-16" >
          <LandingAbout :data="page.about" />
          <LandingWorkExperience :data="page.experience"/>
      </UContainer>
    </section>
    <section>
      <LandingTestimonials :page/>
    </section>
  </div>
  <div v-else>
    <h1>No page found</h1>
  </div>
</template>