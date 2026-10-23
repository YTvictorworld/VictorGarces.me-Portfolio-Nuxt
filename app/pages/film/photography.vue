<script setup lang="ts">
import type { Album } from '~/composables/useMediaManifest'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const { collection } = useLocalizedContent()
const media = useMediaManifest()

const { data: page } = await useAsyncData(`photography-${locale.value}`, () =>
  queryCollection(collection('pages')).path(`/${locale.value}/pages/photography`).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const albums = computed(() => media.albums())
const showcase = computed(() => media.showcase())
const photoCount = computed(() => albums.value.reduce((sum, album) => sum + album.photos.length, 0))

/* Years: a filter once there is more than one, and the headings the albums are grouped under */
const year = useQueryFilter('year')
const years = computed(() => [...new Set(albums.value.map(album => album.year).filter(Boolean))] as string[])
const yearOptions = computed(() => years.value.map(value => ({ id: value, label: value })))
const groups = computed(() => {
  const shown = albums.value.filter(album => !year.value || album.year === year.value)
  const byYear = new Map<string, Album[]>()
  for (const album of shown) {
    const key = album.year ?? ''
    byYear.set(key, [...(byYear.get(key) ?? []), album])
  }
  return [...byYear].map(([key, list]) => ({ year: key, albums: list }))
})

/*
 * The open album lives in ?album=, so it can be linked to and the back button closes it. Like
 * every query filter it is read only after mount: the prerendered page is the album list.
 */
const openId = ref('')
const current = computed(() => albums.value.find(album => album.id === openId.value))
onMounted(() => (openId.value = String(route.query.album ?? '')))
watch(() => route.query.album, value => (openId.value = String(value ?? '')))

const section = ref<HTMLElement | null>(null)
let busy = false

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** ScrollSmoother when the page has it, the window otherwise; just under the fixed header */
async function scrollToElement(element: Element | null) {
  if (!element) return
  const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84
  const { ScrollSmoother } = await loadGsap()
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(element, !reducedMotion(), `top ${header + 16}px`)
  else window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - header - 16, behavior: reducedMotion() ? 'auto' : 'smooth' })
}

/**
 * Keeps the section at least as tall as it was while one layout replaces the other, so the
 * page does not collapse and show the footer while the photos are still in flight.
 */
function holdHeight(element: HTMLElement) {
  element.style.minHeight = `${element.offsetHeight}px`
  return () => element.style.removeProperty('min-height')
}

const setQuery = (album: string) => router.replace({ query: { ...route.query, album: album || undefined } })
const sheetsOf = (root: ParentNode, ids: string[]) =>
  ids.map(id => root.querySelector<HTMLElement>(`[data-flip-id="${CSS.escape(id)}"]`)).filter((el): el is HTMLElement => !!el)

/**
 * Opening flies the fan's sheets into their places in the album's grid; the rest of the photos
 * rise in after them. Closing flies the first ones back into the fan.
 */
async function openAlbum(id: string) {
  const root = section.value
  if (busy || !root) return
  if (reducedMotion()) {
    openId.value = id
    await setQuery(id)
    await nextTick()
    return scrollToElement(root)
  }

  busy = true
  const { gsap, Flip, ScrollTrigger } = await loadFlip()
  const card = root.querySelector(`[data-album="${CSS.escape(id)}"]`)
  const state = Flip.getState(card ? [...card.querySelectorAll('[data-flip-id]')] : [])
  const release = holdHeight(root)

  openId.value = id
  await nextTick()

  gsap.from(root.querySelectorAll('.album-head > *'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
  Flip.from(state, {
    targets: root.querySelectorAll('.tile [data-flip-id]'),
    duration: 0.8,
    ease: 'power3.inOut',
    scale: true,
    absolute: true,
    nested: true,
    onEnter: entering => gsap.fromTo(entering, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.35, stagger: 0.025, ease: 'power3.out' }),
    onComplete: () => {
      release()
      ScrollTrigger.refresh()
      busy = false
    }
  })
  scrollToElement(root)
  setQuery(id)
}

async function closeAlbum() {
  const root = section.value
  const album = current.value
  if (busy || !root || !album) return
  if (reducedMotion()) {
    openId.value = ''
    await setQuery('')
    await nextTick()
    return scrollToElement(root.querySelector(`[data-album="${CSS.escape(album.id)}"]`))
  }

  busy = true
  const { gsap, Flip, ScrollTrigger } = await loadFlip()
  const state = Flip.getState(sheetsOf(root.querySelector('.album-grid') ?? root, album.photos.slice(0, 3)))

  openId.value = ''
  await nextTick()

  const card = root.querySelector(`[data-album="${CSS.escape(album.id)}"]`)
  gsap.from(root.querySelectorAll('.albums-list .album-item'), { opacity: 0, duration: 0.5, ease: 'power2.out' })
  Flip.from(state, {
    targets: card ? card.querySelectorAll('[data-flip-id]') : [],
    duration: 0.7,
    ease: 'power3.inOut',
    scale: true,
    absolute: true,
    onComplete: () => {
      ScrollTrigger.refresh()
      busy = false
    }
  })
  scrollToElement(card)
  setQuery('')
}

/* One lightbox for both the showcase and an open album */
const lightboxPhotos = ref<string[]>([])
const lightboxIndex = ref<number | null>(null)
function openLightbox(photos: string[], index: number) {
  lightboxPhotos.value = photos
  lightboxIndex.value = index
}

// A real gallery of real photographs: the ids all resolve in the media manifest
const absolute = (url: string | undefined) => !url ? undefined : /^https?:\/\//.test(url) ? url : `${SITE_URL}${url}`
useSchemaOrg([{
  '@type': 'ImageGallery',
  'name': page.value.title,
  'description': page.value.description,
  'image': albums.value.flatMap(album => album.photos).map(id => absolute(media.largest(id))).filter(Boolean)
}])

useSeo({ title: page.value.title, description: page.value.description })
</script>

<template>
  <div v-if="page">
    <PageTitle
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.lead"
      :count="`${t('film.albums.albums', { n: albums.length })} · ${t('home.photos', { n: photoCount })}`"
    >
      <UiFilters
        v-if="yearOptions.length > 1 && !current"
        v-model="year"
        :options="yearOptions"
        :label="t('film.albums.year')"
        :all-label="t('filters.all')"
      />
    </PageTitle>

    <PhotoShowcase
      :photos="showcase"
      :label="t('film.albums.showcase')"
      @open="index => openLightbox(showcase, index)"
    />

    <section
      ref="section"
      class="section albums-section"
      :aria-label="current ? current.title : page.title"
    >
      <!-- One album open: its photos in a grid, the first three flown in from the fan -->
      <div
        v-if="current"
        class="album-open"
      >
        <header class="album-head">
          <button
            type="button"
            class="back pill"
            @click="closeAlbum"
          >
            <span aria-hidden="true">←</span> {{ t('film.albums.back') }}
          </button>
          <h2 class="album-title display">
            {{ current.title }}
          </h2>
          <p class="album-detail mono">
            <template v-if="current.date">
              {{ formatAlbumDate(current.date, locale) }} ·
            </template>{{ t('home.photos', { n: current.photos.length }) }}
          </p>
        </header>
        <ul class="album-grid">
          <li
            v-for="(photo, index) in current.photos"
            :key="photo"
            class="tile"
          >
            <button
              type="button"
              class="tile-button"
              :aria-label="t('page.openPhotoNamed', { n: index + 1, total: current.photos.length, alt: media.alt(photo) })"
              @click="openLightbox(current.photos, index)"
            >
              <span
                class="tile-sheet"
                :data-flip-id="photo"
              >
                <MediaFilmImage
                  :id="photo"
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  :priority="index < 2"
                  decorative
                />
              </span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Every album as a fan, newest first, under its year -->
      <div
        v-else
        class="albums-list"
      >
        <div
          v-for="group in groups"
          :key="group.year"
          class="year-group"
        >
          <h2 class="year eyebrow">
            {{ group.year || t('film.albums.undated') }}
          </h2>
          <ul class="albums">
            <li
              v-for="album in group.albums"
              :key="album.id"
              class="album-item"
            >
              <PhotoAlbum
                :album="album"
                @open="openAlbum(album.id)"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>

    <MediaLightbox
      v-model:index="lightboxIndex"
      :photos="lightboxPhotos"
    />

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
.albums-section {
  scroll-margin-top: var(--header-h);
}

.year-group + .year-group {
  margin-top: 32px;
}

.year {
  margin: 0 0 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

/* Tight: the fans nearly touch, so a year reads as one shelf */
.albums {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.album-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 16px;
  margin-bottom: 20px;
}

.back {
  font-family: inherit;
  cursor: pointer;
}

.album-title {
  flex: 1 1 auto;
  margin: 0;
  font-size: var(--h2);
}

.album-detail {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tile-button {
  display: block;
  width: 100%;
  padding: 0;
  background: none;
  border: 0;
  cursor: zoom-in;
}

.tile-sheet {
  display: block;
  overflow: hidden;
  border-radius: var(--r-media);
  aspect-ratio: 3 / 4;
}

.tile-sheet :deep(.film-image) {
  width: 100%;
  height: 100%;
  transition: transform var(--t-card) var(--ease-out-quart);
}

.tile-button:hover :deep(.film-image) {
  transform: scale(1.03);
}

.tile-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: var(--r-media);
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
  .albums,
  .album-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .albums,
  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
