<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()

const { data } = await useAsyncData(`films-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/films`).first(),
  queryCollection(collection('films')).order('order', 'ASC')
    .select('path', 'title', 'kind', 'year', 'runtime', 'poster', 'video', 'draft').all()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const films = computed(() => published(data.value?.[1]))
const kinds = computed(() => [...new Set(films.value.map(film => film.kind))]
  .map(kind => ({ id: kind, label: t(`film.kind.${kind}`) })))

const kind = useQueryFilter('kind')
const shown = computed(() => kind.value ? films.value.filter(film => film.kind === kind.value) : films.value)

const href = (path: string) => localePath(`/film/films/${slugOf(path)}`)
const subtitle = (film: { kind: string, year: string, runtime: string }) =>
  `${t(`film.kind.${film.kind}`)} · ${film.year} · ${film.runtime}`

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
      :count="t('page.results', { n: shown.length, total: films.length })"
    >
      <UiFilters
        v-if="kinds.length > 1"
        v-model="kind"
        :options="kinds"
        :label="t('filters.label')"
        :all-label="t('filters.all')"
      />
    </PageTitle>

    <p class="section note">
      {{ page.sections?.note?.lead }}
    </p>

    <section
      class="section grid"
      :aria-label="page.title"
    >
      <FilmCard
        v-for="film in shown"
        :key="film.path"
        :title="film.title"
        :subtitle="subtitle(film)"
        :poster="film.poster?.id"
        :video="film.video?.id"
        :href="href(film.path)"
      />
      <p
        v-if="!shown.length"
        class="empty"
      >
        {{ t('page.empty') }}
      </p>
    </section>

    <ShellCrossModeBanner to="day" />
  </div>
</template>

<style scoped>
.note {
  margin: 0;
  color: var(--muted);
}

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
