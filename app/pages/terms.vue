<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale } = useI18n()
const { collection } = useLocalizedContent()

const { data: doc } = await useAsyncData(`legal-terms-${locale.value}`, () =>
  queryCollection(collection('legal')).path(`/${locale.value}/legal/terms`).first())

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
