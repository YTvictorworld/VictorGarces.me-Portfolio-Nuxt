<script setup lang="ts">
interface Entry {
  q: string
  a: string
  featured?: boolean
}

/**
 * FAQ on a home page. `columns: 1` is the day layout (title left, list right, featured first
 * and the rest behind "show all"); `columns: 2` is the night layout (title on top, two columns).
 */
const props = withDefaults(defineProps<{
  entries: Entry[]
  eyebrow?: string
  title?: string
  columns?: 1 | 2
}>(), { columns: 1 })

const { t } = useI18n()
const expanded = ref(false)

const featured = computed(() => props.entries.filter(entry => entry.featured))
const rest = computed(() => props.entries.filter(entry => !entry.featured))
const visible = computed(() => props.columns === 2 || expanded.value || !featured.value.length
  ? [...featured.value, ...rest.value]
  : featured.value)
</script>

<template>
  <section
    id="faq"
    class="section faq"
    :class="`faq--${columns}`"
    aria-labelledby="faq-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="faq-title"
    />
    <div class="list-wrap">
      <div class="list">
        <FaqItem
          v-for="(entry, index) in visible"
          :key="entry.q"
          :q="entry.q"
          :a="entry.a"
          :default-open="index === 0"
        />
      </div>
      <button
        v-if="columns === 1 && featured.length && rest.length"
        type="button"
        class="btn btn--sm more"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? t('home.showFewer') : t('home.showAll', { n: entries.length }) }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.faq--1 {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  align-items: start;
  gap: 48px;
}

.list-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.faq--2 .list-wrap {
  margin-top: 16px;
}

.faq--2 .list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
}

.faq--2 :deep(.item) {
  padding: 18px 22px;
}

.faq--2 :deep(.question) {
  font-size: 16px;
}

.faq--2 :deep(.answer p) {
  font-size: 14px;
}

@media (max-width: 1023px) {
  .faq--1 {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .faq--2 .list {
    grid-template-columns: minmax(0, 1fr);
  }

  :deep(.item) {
    padding: 14px 16px;
  }

  :deep(.question) {
    font-size: 15px;
  }
}
</style>
