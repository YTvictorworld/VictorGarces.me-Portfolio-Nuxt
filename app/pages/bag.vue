<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { t, locale } = useI18n()
const { collection } = useLocalizedContent()

const { data: page } = await useAsyncData(`bag-${locale.value}`, () =>
  queryCollection(collection('bag')).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeo({ title: t('bag.title'), description: t('bag.description') })
</script>

<template>
  <div v-if="page">
    <PageTitle
      :eyebrow="t('bag.eyebrow')"
      :title="t('bag.title')"
      :lead="t('bag.description')"
    />

    <section
      v-for="category in page.categories"
      :key="category.title"
      class="section"
      :aria-labelledby="`bag-${category.title}`"
    >
      <h2
        :id="`bag-${category.title}`"
        class="h2"
      >
        {{ category.title }}
      </h2>
      <ul class="items">
        <li
          v-for="item in category.items"
          :key="item.title"
        >
          <component
            :is="item.url ? 'a' : 'div'"
            class="card item"
            :class="{ linked: item.url }"
            :href="item.url"
            :target="item.url ? '_blank' : undefined"
            :rel="item.url ? 'noopener' : undefined"
          >
            <div class="text">
              <p class="item-title">
                {{ item.title }}
              </p>
              <p
                v-if="item.description"
                class="item-note"
              >
                {{ item.description }}
              </p>
            </div>
            <svg
              v-if="item.url"
              class="arrow"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden="true"
            ><path
              d="M4 10L10 4M10 4H5M10 4V9"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
          </component>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  height: 100%;
  padding: 18px 20px;
  color: var(--text);
  text-decoration: none;
}

.linked:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.text {
  min-width: 0;
}

.item-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.item-note {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.arrow {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--muted);
  transition: transform var(--t-micro) var(--ease-out), color var(--t-micro) var(--ease-out);
}

.linked:hover .arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

@media (max-width: 767px) {
  .items {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
