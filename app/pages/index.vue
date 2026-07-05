<script setup lang="ts">
const { data: page } = await useAsyncData('index-page', () =>
  queryCollection('index').first()
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

    <div class="relative">
      <!-- Background beam that draws itself downward on scroll -->
      <ScrollBeam class="inset-y-0 -left-2 lg:-left-6 hidden md:block" />

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
  </div>
</template>
