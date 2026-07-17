<script setup lang="ts">
import type { IndexEnCollectionItem as IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

const tabs = computed(() => {
  return props.page.faq?.categories.map(category => ({
    label: category.title,
    key: category.title.toLowerCase(),
    questions: category.questions.map(q => ({
      label: q.label,
      content: q.content
    }))
  })) ?? []
})

// The answers only use **bold**, rendered inline instead of relying on
// <MDC>, whose async client-side parsing never resolves on this static setup.
const renderAnswer = (md: string): string =>
  md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-neutral-900 dark:text-white">$1</strong>')
    .trim()
</script>

<template>
  <section v-if="page.faq" class="py-12">
    <Reveal :duration="600">
      <div class="mb-8">
        <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
          {{ $t('faq.eyebrow') }}
        </p>
        <h2 class="text-3xl font-bold tracking-tight mb-2">{{ page.faq.title }}</h2>
        <p class="text-neutral-600 dark:text-neutral-300">{{ page.faq.description }}</p>
      </div>
    </Reveal>

    <Reveal :delay="100" :duration="600">
      <UTabs
        :items="tabs"
        orientation="horizontal"
        :ui="{
          list: 'bg-transparent dark:bg-transparent gap-2 px-0',
          trigger: 'px-3 py-2 rounded-lg data-[state=inactive]:text-neutral-500 dark:data-[state=inactive]:text-neutral-400'
        }"
      >
        <template #content="{ item }">
          <UAccordion
            :items="item.questions"
            trailing-icon="i-lucide-plus"
            :ui="{
              item: 'border-none mb-2',
              trigger: 'group px-4 rounded-lg bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors',
              trailingIcon: 'transition-transform group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-45'
            }"
          >
            <template #body="{ item: question }">
              <!-- content is our own YAML, escaped above before the v-html -->
              <p class="px-4 pb-2 leading-relaxed text-neutral-600 dark:text-neutral-300" v-html="renderAnswer(question.content ?? '')" />
            </template>
          </UAccordion>
        </template>
      </UTabs>
    </Reveal>
  </section>
</template>
