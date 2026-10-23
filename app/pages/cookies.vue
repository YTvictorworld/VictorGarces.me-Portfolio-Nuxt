<script setup lang="ts">
const { locale } = useI18n()
const { collection } = useLocalizedContent()

const { data: doc } = await useAsyncData(`legal-cookies-${locale.value}`, () =>
  queryCollection(collection('legal')).path(`/${locale.value}/legal/cookies`).first())

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeo({ title: doc.value.title, description: doc.value.description })
</script>

<template>
  <LegalPage
    v-if="doc"
    :doc="doc"
  />
</template>
