<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()
const { readStored } = useMode()

const { data } = await useAsyncData(`landing-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/landing`).first(),
  queryCollection(collection('films')).order('order', 'ASC').all(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
const film = computed(() => published(data.value?.[1]).find(entry => entry.featured))
const profile = computed(() => data.value?.[2])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

usePersonSchema(profile, t('og.dev.eyebrow'))

useSeo({
  title: page.value.title,
  description: page.value.description,
  // The first-visit card shows the name, not the page title
  cardTitle: SITE_NAME
})

// DESIGN: moves to nuxt-schema-org in M6
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': SITE_NAME,
      'url': SITE_URL,
      'image': `${SITE_URL}/media/portrait.jpg`,
      'jobTitle': t('landing.heading').replace(`${SITE_NAME}, `, ''),
      'email': profile.value ? `mailto:${profile.value.email}` : undefined,
      'address': { '@type': 'PostalAddress', 'addressLocality': 'Santo Domingo', 'addressCountry': 'DO' },
      'sameAs': profile.value?.socials.map(social => social.href) ?? []
    })
  }]
})

// A returning visitor (a stored side) goes straight to it on a fresh load. The pre-paint script
// already hid the landing (data-returning); navigating back to / inside the site shows it.
const firstLoad = useNuxtApp().isHydrating
onMounted(async () => {
  const stored = readStored()
  const root = document.documentElement
  try {
    if (firstLoad && stored) {
      await navigateTo(localePath(stored === 'night' ? '/film' : '/dev'), { replace: true })
    }
  } finally {
    root.removeAttribute('data-returning')
  }
})
</script>

<template>
  <FirstVisitSplit
    v-if="page"
    :day="page.sections?.day ?? {}"
    :night="page.sections?.night ?? {}"
    :day-href="localePath('/dev')"
    :night-href="localePath('/film')"
    :film-title="film?.title"
  />
</template>
