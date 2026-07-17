<script setup lang="ts">
const { locale } = useI18n()

const collection = (locale.value === 'es' ? 'index_es' : 'index_en') as 'index_en'

const { data: page } = await useAsyncData(`index-page-${locale.value}`, () =>
  queryCollection(collection).first()
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

const { global, footer } = useAppConfig()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': SITE_NAME,
        'url': SITE_URL,
        'image': global?.picture?.light,
        'jobTitle': 'Full-Stack Developer & Filmmaker',
        'email': `mailto:${global?.email}`,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Santo Domingo',
          'addressCountry': 'DO'
        },
        'sameAs': footer?.links?.map(l => l.to).filter(Boolean) ?? []
      })
    }
  ]
})
</script>

<template>
  <div v-if="page">
    <LandingHero :page />

    <section id="about" class="py-16 scroll-mt-24">
      <UContainer class="grid md:grid-cols-2 gap-12 lg:gap-16">
        <LandingAbout :data="page.about" />
        <div id="experience" class="scroll-mt-24">
          <LandingWorkExperience :data="page.experience" />
        </div>
      </UContainer>
    </section>

    <section>
      <LandingTestimonials :page />
    </section>

    <section id="faq" class="scroll-mt-24">
      <UContainer>
        <LandingFAQ :page />
      </UContainer>
    </section>
  </div>
</template>
