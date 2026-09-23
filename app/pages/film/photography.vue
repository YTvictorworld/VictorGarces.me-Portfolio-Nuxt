<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection } = useLocalizedContent()
const media = useMediaManifest()

const { data: page } = await useAsyncData(`photography-${locale.value}`, () =>
  queryCollection(collection('pages')).path(`/${locale.value}/pages/photography`).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const allSeries = computed(() => Object.keys(media.manifest.series)
  .map(id => media.series(id))
  .filter(entry => !!entry))
const options = computed(() => allSeries.value.map(entry => ({ id: entry.id, label: entry.title })))

const series = useQueryFilter('series')
const photos = computed(() => allSeries.value
  .filter(entry => !series.value || entry.id === series.value)
  .flatMap(entry => entry.photos))

const open = ref<number | null>(null)

// A real gallery of real photographs: the ids all resolve in the media manifest
useSchemaOrg([{
  '@type': 'ImageGallery',
  'name': page.value.title,
  'description': page.value.description,
  'image': photos.value.map(id => `${SITE_URL}${media.largest(id)}`)
}])

useSeo({ title: page.value.title, description: page.value.description })
</script>

<template>
  <div v-if="page">
    <PageTitle
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.lead"
      :count="t('home.photos', { n: photos.length })"
    >
      <UiFilters
        v-if="options.length > 1"
        v-model="series"
        :options="options"
        :label="t('filters.series')"
        :all-label="t('filters.all')"
      />
    </PageTitle>

    <section
      class="section"
      :aria-label="page.title"
    >
      <ul class="grid">
        <li
          v-for="(photo, index) in photos"
          :key="photo"
        >
          <button
            type="button"
            class="tile"
            :aria-label="t('page.openPhotoNamed', { n: index + 1, total: photos.length, alt: media.alt(photo) })"
            @click="open = index"
          >
            <MediaFilmImage
              :id="photo"
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              :priority="index < 4"
              decorative
            />
          </button>
        </li>
      </ul>
      <MediaLightbox
        v-model:index="open"
        :photos="photos"
      />
    </section>

    <section class="section book">
      <div>
        <p class="book-title display">
          {{ page.sections?.book?.title }}
        </p>
        <p class="book-lead">
          {{ page.sections?.book?.lead }}
        </p>
      </div>
      <NuxtLink
        :to="localePath({ path: '/contact', query: { topic: 'film' } })"
        class="btn btn--accent btn--sm"
      >
        {{ page.sections?.book?.cta }}
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tile {
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: none;
  border: 0;
  border-radius: var(--r-media);
  cursor: pointer;
}

.tile :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  transition: transform var(--t-card) var(--ease-out-quart);
}

.tile:hover :deep(img) {
  transform: scale(1.03);
}

.book {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
}

.book p {
  margin: 0;
}

.book-title {
  font-size: 24px;
}

.book-lead {
  margin-top: 4px !important;
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
