<script setup lang="ts">
definePageMeta({
  fullBleed: true,
  // Reject an unknown slug here, before the content database is instantiated
  validate: route => useRuntimeConfig().public.slugs.films.includes(String(route.params.slug))
})

const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { collection, published, showDrafts } = useLocalizedContent()
const media = useMediaManifest()

const slug = String(route.params.slug)
const { data } = await useAsyncData(`film-${locale.value}-${slug}`, () => Promise.all([
  queryCollection(collection('films')).path(`/${locale.value}/films/${slug}`).first(),
  // Only what the next-film link needs: the bodies would bloat this page's payload
  queryCollection(collection('films')).order('order', 'ASC').select('path', 'title', 'draft').all(),
  queryCollection(collection('blog')).select('path', 'title', 'description', 'date', 'cover', 'draft').all(),
  queryCollection('profile').first()
]))

const film = computed(() => data.value?.[0])
if (!film.value || (film.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Film not found', fatal: true })
}

const all = computed(() => published(data.value?.[1]))
const next = computed(() => {
  const list = all.value
  const explicit = film.value?.next && list.find(entry => slugOf(entry.path) === film.value?.next)
  if (explicit) return explicit
  const index = list.findIndex(entry => entry.path === film.value?.path)
  return index >= 0 ? list[(index + 1) % list.length] : undefined
})
/** Posts this film links to, in the order the film lists them. */
const journal = computed(() => (film.value?.journal ?? [])
  .map(entry => published(data.value?.[2]).find(post => slugOf(post.path) === entry))
  .filter(post => !!post))
const profile = computed(() => data.value?.[3])

const synopsis = computed(() => (film.value?.synopsis ?? '').split(/\n{2,}/).filter(Boolean))
const stills = computed(() => (film.value?.stills ?? []).map(still => still.id))
const openStill = ref<number | null>(null)

useSeoMeta({
  title: film.value.title,
  ogTitle: film.value.title,
  description: film.value.logline ?? film.value.synopsis,
  ogDescription: film.value.logline ?? film.value.synopsis,
  ogType: 'video.movie'
})
</script>

<template>
  <article v-if="film">
    <div class="head">
      <NuxtLink
        :to="localePath('/film/films')"
        class="back mono"
      >
        ← {{ t('page.backToFilms') }}
      </NuxtLink>
      <p class="eyebrow eyebrow--accent">
        {{ t(`film.kind.${film.kind}`) }} · {{ film.year }} · {{ film.runtime }}
      </p>
      <h1 class="title">
        {{ film.title }}
      </h1>
      <p
        v-if="film.logline"
        class="lead"
      >
        {{ film.logline }}
      </p>
    </div>

    <div class="stage">
      <MediaFilmPlayer
        :id="film.video?.id"
        :poster="film.poster?.id"
        :title="film.title"
      />
    </div>

    <div class="section layout">
      <div class="text">
        <p
          v-for="(paragraph, index) in synopsis"
          :key="index"
        >
          {{ paragraph }}
        </p>

        <!-- The night home links here with #vertical ("Vertical cut" on Film/NowShowing) -->
        <div
          v-if="film.vertical?.media"
          id="vertical"
          class="vertical card"
        >
          <p class="eyebrow">
            {{ t('film.alsoAs') }}
          </p>
          <p class="vertical-title">
            {{ t('film.verticalCut', { runtime: film.vertical.runtime ?? film.runtime }) }}
          </p>
          <p
            v-if="film.vertical.summary"
            class="vertical-summary"
          >
            {{ film.vertical.summary }}
          </p>
          <div class="vertical-links">
            <a
              v-for="link in film.vertical.links"
              :key="link.href"
              :href="link.href"
              class="link-accent"
              target="_blank"
              rel="noopener"
            >{{ link.label }}</a>
          </div>
        </div>
      </div>

      <aside class="credits">
        <p class="eyebrow">
          {{ t('page.credits') }}
        </p>
        <dl>
          <template
            v-for="credit in film.credits"
            :key="credit.role + credit.name"
          >
            <dt>{{ credit.role }}</dt>
            <dd>{{ credit.name }}</dd>
          </template>
          <template v-if="film.camera">
            <dt>{{ t('film.camera') }}</dt>
            <dd>{{ film.camera }}</dd>
          </template>
          <template v-if="film.runtime">
            <dt>{{ t('page.runtime') }}</dt>
            <dd>{{ film.runtime }}</dd>
          </template>
        </dl>
        <ul
          v-if="film.external?.length"
          class="external"
        >
          <li
            v-for="link in film.external"
            :key="link.href"
          >
            <a
              :href="link.href"
              target="_blank"
              rel="noopener"
            >{{ link.label }}</a>
          </li>
        </ul>
      </aside>
    </div>

    <section
      v-if="stills.length"
      class="section"
      aria-labelledby="stills-title"
    >
      <h2
        id="stills-title"
        class="h2"
      >
        {{ t('page.stills') }}
      </h2>
      <ul class="stills">
        <li
          v-for="(still, index) in stills"
          :key="still"
        >
          <button
            type="button"
            class="still"
            :aria-label="t('page.openPhotoNamed', { n: index + 1, total: stills.length, alt: media.alt(still) })"
            @click="openStill = index"
          >
            <MediaFilmImage
              :id="still"
              sizes="(max-width: 767px) 50vw, 25vw"
              decorative
            />
          </button>
        </li>
      </ul>
      <MediaLightbox
        v-model:index="openStill"
        :photos="stills"
      />
    </section>

    <section
      v-if="journal.length"
      class="section"
      aria-labelledby="journal-title"
    >
      <h2
        id="journal-title"
        class="h2"
      >
        {{ t('nav.journal') }}
      </h2>
      <div class="posts">
        <BlogJournalCard
          v-for="post in journal"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :cover="post.cover"
          :href="localePath(`/blog/${slugOf(post.path)}`)"
        />
      </div>
    </section>

    <NuxtLink
      v-if="next"
      :to="localePath(`/film/films/${slugOf(next.path)}`)"
      class="next card"
    >
      <span class="eyebrow">{{ t('page.next') }}</span>
      <span class="next-title display">{{ next.title }} <UiArrow /></span>
    </NuxtLink>

    <ContactCta
      v-if="profile"
      :title="t('cta.shoot')"
      :email="profile.email"
      :cta="t('nav.contact')"
      :href="localePath({ path: '/contact', query: { topic: 'film' } })"
    />
  </article>
</template>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 860px;
  padding: var(--section) var(--gutter) 0;
}

.head p {
  margin: 0;
}

.back {
  color: var(--muted);
  text-decoration: none;
}

.back:hover {
  color: var(--accent);
}

.title {
  font-size: var(--h1-page);
  line-height: 1.02;
}

.lead {
  font-size: 19px;
  line-height: 1.45;
  color: var(--muted);
}

.stage {
  padding: 28px var(--gutter) 0;
}

.stage :deep(.player) {
  aspect-ratio: 16 / 9;
  border-radius: var(--r-stage);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 48px;
  align-items: start;
}

.text p {
  margin: 0 0 16px;
  font-size: 17px;
  line-height: 1.65;
  color: var(--muted);
}

.vertical {
  padding: 20px 24px;
  scroll-margin-top: 16px;
}

.vertical p {
  margin: 0;
}

.vertical-title {
  margin-top: 6px !important;
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
}

.vertical-summary {
  margin-top: 4px !important;
  font-size: 14px;
}

.vertical-links {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.credits dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 16px;
  margin: 10px 0 0;
  font-size: 14px;
}

.credits dt {
  color: var(--muted);
}

.credits dd {
  margin: 0;
}

.external {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.external a {
  display: inline-flex;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}

.external a:hover {
  border-color: var(--accent);
}

.stills {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.still {
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: none;
  border: 0;
  border-radius: var(--r-media);
  cursor: pointer;
}

.still :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.posts {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.next {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: var(--section) var(--gutter) 0;
  padding: 24px;
  color: var(--text);
  text-decoration: none;
}

.next:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.next-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .stills {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .stills {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
