<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()

const { data } = await useAsyncData(`work-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/work`).first(),
  queryCollection(collection('projects')).order('order', 'ASC')
    .select('path', 'title', 'oneLiner', 'year', 'role', 'status', 'stack', 'tags', 'cover', 'kind', 'draft').all()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const projects = computed(() => published(data.value?.[1]))
// Only kinds that actually have a project get a pill
const kinds = computed(() => [...new Set(projects.value.map(project => project.kind))]
  .map(kind => ({ id: kind, label: t(`kind.${kind}`) })))

const kind = useQueryFilter('kind')
const shown = computed(() => kind.value ? projects.value.filter(project => project.kind === kind.value) : projects.value)

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <div v-if="page">
    <PageTitle
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.lead"
      :count="t('page.results', { n: shown.length, total: projects.length })"
    >
      <UiFilters
        v-if="kinds.length > 1"
        v-model="kind"
        :options="kinds"
        :label="t('filters.label')"
        :all-label="t('filters.all')"
      />
    </PageTitle>

    <section
      class="section grid"
      :aria-label="page.title"
    >
      <WorkProjectCard
        v-for="project in shown"
        :key="project.path"
        :project="project"
        :href="localePath(`/dev/work/${slugOf(project.path)}`)"
      />
      <p
        v-if="!shown.length"
        class="empty"
      >
        {{ t('page.empty') }}
      </p>
    </section>

    <ShellCrossModeBanner to="night" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.empty {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--muted);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
