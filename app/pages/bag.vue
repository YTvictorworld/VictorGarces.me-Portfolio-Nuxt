<script setup lang="ts">
const { data: page } = await useAsyncData('bag-page', () =>
  queryCollection('bag').first()
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { t } = useI18n()

useSeoMeta({
  title: () => t('bag.title'),
  description: () => t('bag.description')
})
</script>

<template>
  <div class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <Reveal immediate :duration="600">
        <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
          {{ $t('bag.eyebrow') }}
        </p>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
          {{ $t('bag.title') }}
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-12 text-pretty">
          {{ $t('bag.description') }}
        </p>
      </Reveal>

      <div class="space-y-12">
        <Reveal v-for="(category, index) in page?.categories" :key="category.title" :delay="index * 100"
          :duration="600">
          <section>
            <h2 class="text-2xl font-bold tracking-tight mb-6">{{ category.title }}</h2>
            <ul class="space-y-4">
              <li v-for="item in category.items" :key="item.title">
                <component :is="item.url ? 'a' : 'div'" :href="item.url" :target="item.url ? '_blank' : undefined"
                  :rel="item.url ? 'noopener noreferrer' : undefined"
                  class="group flex items-start gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md transition-all duration-300">
                  <div class="flex-1">
                    <p
                      class="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {{ item.title }}
                    </p>
                    <p v-if="item.description" class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {{ item.description }}
                    </p>
                  </div>
                  <UIcon v-if="item.url" name="i-lucide-arrow-up-right"
                    class="size-4 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-1"
                    aria-hidden="true" />
                </component>
              </li>
            </ul>
          </section>
        </Reveal>
      </div>
    </div>
  </div>
</template>
