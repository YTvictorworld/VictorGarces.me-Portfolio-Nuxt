<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t, te } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { collection, published } = useLocalizedContent()
const { exists } = useNav()
const media = useMediaManifest()

const { data } = await useAsyncData(`film-home-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/film`).first(),
  queryCollection(collection('films')).order('order', 'ASC').all(),
  queryCollection(collection('blog')).select('path', 'title', 'description', 'date', 'minRead', 'tags', 'cover', 'draft').order('date', 'DESC').all(),
  queryCollection(collection('about')).path(`/${locale.value}/about/film`).first(),
  queryCollection(collection('filmography')).first(),
  queryCollection(collection('testimonials')).first(),
  queryCollection(collection('faq')).first(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const s = computed(() => page.value?.sections ?? {})
const forFilm = <T extends { mode?: string }>(entries: T[] = []) => entries.filter(entry => entry.mode !== 'dev')

const films = computed(() => published(data.value?.[1]))
const featuredFilms = computed(() => films.value.filter(film => film.featured && film.kind !== 'reel'))
const film = computed(() => featuredFilms.value[0])
const secondFilm = computed(() => featuredFilms.value[1])
const reel = computed(() => films.value.find(entry => entry.kind === 'reel'))
const moreCount = computed(() => films.value.length - [film.value, secondFilm.value, reel.value].filter(Boolean).length)
const journal = computed(() => published(data.value?.[2]).filter(post => post.tags?.includes('film')).slice(0, 2))
const about = computed(() => data.value?.[3])
const credits = computed(() => published(data.value?.[4]?.credits))
const testimonials = computed(() => forFilm(published(data.value?.[5]?.entries)))
const faq = computed(() => forFilm(published(data.value?.[6]?.entries)).sort((a, b) => (a.order ?? 99) - (b.order ?? 99)))
const profile = computed(() => data.value?.[7])

// The strip shows every series, events first; the hero frames borrow two of its photos
const series = ['events-2025', 'portraits'].map(id => media.series(id)).filter(entry => !!entry)
const photos = series.flatMap(entry => entry.photos)
const heroPhotos = [photos[2], photos[5]].filter((id): id is string => !!id)
const photosLabel = series[0] ? `${series[0].title} · ${t('home.photos', { n: series[0].photos.length })}` : undefined

// Pages that land in M4: link to them only once they exist
const hasFilmPages = router.getRoutes().some(route => route.path.endsWith('/film/films/:slug()'))
const filmHref = (path?: string) => path && hasFilmPages ? localePath(`/film/films/${slugOf(path)}`) : null
const filmsHref = computed(() => exists('/film/films') ? localePath('/film/films') : null)
const photographyHref = computed(() => exists('/film/photography') ? localePath('/film/photography') : null)
const journalHref = computed(() => exists('/film/journal') ? localePath('/film/journal') : null)
const aboutHref = computed(() => exists('/film/about') ? localePath('/film/about') : null)

const kindLabel = (kind: string) => t(`film.kind.${kind}`)
// Only tags with a written label reach the card; a raw slug never does
const journalLabel = (tags: string[] = []) => {
  const tag = tags.find(entry => entry !== 'film')
  return tag && te(`blog.tag.${tag}`) ? t(`blog.tag.${tag}`) : undefined
}
const bookLinks = computed(() => (profile.value?.socials ?? [])
  .filter(social => social.mode !== 'dev')
  .map(social => ({ label: social.label, href: social.href })))

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <div v-if="page">
    <HeroFilm
      :copy="s.hero ?? {}"
      :film-label="film ? `${film.title} · ${film.year}` : undefined"
      :photos="heroPhotos"
      :photos-label="photosLabel"
      :reel-href="filmHref(reel?.path)"
      :films-href="filmsHref"
    />

    <FilmNowShowing
      v-if="film"
      :film="film"
      :eyebrow="s.nowShowing?.eyebrow"
      :title="s.nowShowing?.title"
      :cta="s.nowShowing?.cta"
      :cta2="s.nowShowing?.cta2"
      :href="filmHref(film.path)"
    />

    <Reveal v-if="photos.length">
      <PhotoFilmstrip
        :photos="photos"
        :eyebrow="s.stills?.eyebrow"
        :title="s.stills?.title"
        :cta="s.stills?.cta"
        :href="photographyHref"
      />
    </Reveal>

    <Reveal v-if="reel || secondFilm || filmsHref">
      <section
        id="more"
        class="section more"
        aria-labelledby="more-title"
      >
        <SectionHead
          :eyebrow="s.more?.eyebrow"
          :title="s.more?.title"
          title-id="more-title"
          class="more-head"
        />
        <FilmCard
          v-if="reel"
          :title="reel.title"
          :subtitle="reel.logline ?? `${kindLabel(reel.kind)} · ${reel.runtime}`"
          :href="filmHref(reel.path)"
        />
        <FilmCard
          v-if="secondFilm"
          :title="secondFilm.title"
          :subtitle="`${kindLabel(secondFilm.kind)} · ${secondFilm.year}`"
          :href="filmHref(secondFilm.path)"
          :poster="secondFilm.poster?.id"
        />
        <WorkMoreTile
          v-if="filmsHref"
          :href="filmsHref"
          :label="t('home.allFilms')"
          :eyebrow="s.more?.eyebrow"
          :title="s.more?.title"
          :count="moreCount"
          class="more-tile"
        />
      </section>
    </Reveal>

    <Reveal v-if="credits.length">
      <FilmographyCredits
        :credits="credits"
        :services="about?.services?.map(service => service.title) ?? []"
        :eyebrow="s.credits?.eyebrow"
        :title="s.credits?.title"
      />
    </Reveal>

    <Reveal v-if="testimonials.length">
      <TestimonialsSingle
        :entries="testimonials"
        :eyebrow="s.testimonials?.eyebrow"
      />
    </Reveal>

    <Reveal>
      <section
        id="journal"
        class="section journal"
      >
        <div
          v-if="journal.length"
          class="entries"
        >
          <SectionHead
            :eyebrow="s.journal?.eyebrow"
            :title="s.journal?.title"
            title-id="journal-title"
          >
            <NuxtLink
              v-if="journalHref"
              :to="journalHref"
              class="link-accent"
            >
              {{ s.journal?.cta }} →
            </NuxtLink>
          </SectionHead>
          <BlogJournalCard
            v-for="post in journal"
            :key="post.path"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :label="journalLabel(post.tags)"
            :cover="post.cover"
            :href="localePath(`/blog/${slugOf(post.path)}`)"
          />
        </div>
        <AboutTeaserCard
          v-if="about"
          :about="about"
          :eyebrow="s.about?.eyebrow"
          :cta="s.about?.cta"
          :href="aboutHref"
        />
      </section>
    </Reveal>

    <Reveal v-if="faq.length">
      <FaqList
        :entries="faq"
        :title="s.faq?.title"
        :columns="2"
      />
    </Reveal>

    <Reveal v-if="profile">
      <ContactBookShoot
        :email="profile.email"
        :links="bookLinks"
        :eyebrow="s.contact?.eyebrow"
        :cta="s.contact?.cta"
      />
    </Reveal>
  </div>
</template>

<style scoped>
.more {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.more-head {
  grid-column: 1 / -1;
  margin-bottom: 4px;
}

.more :deep(.more-tile) {
  min-height: 0;
  background: var(--raised);
}

.more :deep(.more-tile .stack) {
  height: 150px;
}

.journal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 20px;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (max-width: 1023px) {
  .more {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journal {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .more {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
