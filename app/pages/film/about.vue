<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()
const { exists } = useNav()

const { data } = await useAsyncData(`about-film-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/about-film`).first(),
  queryCollection(collection('about')).path(`/${locale.value}/about/film`).first(),
  queryCollection(collection('filmography')).first(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
const about = computed(() => data.value?.[1])
if (!page.value || !about.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const sections = computed(() => page.value?.sections ?? {})
const credits = computed(() => published(data.value?.[2]?.credits))
const profile = computed(() => data.value?.[3])
const bookHref = computed(() => localePath({ path: '/contact', query: { topic: 'film' } }))
// The bag page is off-nav but real; the kit note points at it only if it resolves
const bagHref = computed(() => exists('/bag') ? localePath('/bag') : null)
// No portrait yet (docs/MIGRATION.md §7): the column collapses instead of reserving empty space
const { showDrafts } = useLocalizedContent()
const showPortrait = computed(() => Boolean(about.value?.portrait) || showDrafts)

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <div v-if="page && about">
    <PageTitle
      :eyebrow="page.eyebrow"
      :title="about.headline"
      :lead="about.teaser"
    />

    <section
      class="section intro"
      :class="{ 'intro--text': !showPortrait }"
    >
      <div
        v-if="showPortrait"
        class="portrait"
      >
        <NuxtImg
          v-if="about.portrait"
          :src="about.portrait.src"
          :alt="about.portrait.alt"
          width="480"
          height="640"
          sizes="(max-width: 767px) 100vw, 380px"
          loading="eager"
        />
        <ShellPlaceholder
          v-else
          source="content/about/film · portrait"
        />
      </div>

      <div class="story">
        <div class="prose">
          <ContentRenderer :value="about" />
        </div>
        <div class="actions">
          <NuxtLink
            :to="bookHref"
            class="btn btn--accent btn--sm"
          >
            {{ sections.book?.cta }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/film/films')"
            class="btn btn--sm"
          >
            {{ t('nav.films') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      v-if="about.services?.length"
      class="section"
      aria-labelledby="services-title"
    >
      <h2
        id="services-title"
        class="h2"
      >
        {{ sections.services?.title }}
      </h2>
      <ul class="services">
        <li
          v-for="service in about.services"
          :key="service.title"
          class="card service"
        >
          <p class="service-title display">
            {{ service.title }}
          </p>
          <p class="service-summary">
            {{ service.summary }}
          </p>
        </li>
      </ul>
    </section>

    <section
      v-if="about.kit?.length"
      class="section"
      aria-labelledby="kit-title"
    >
      <h2
        id="kit-title"
        class="h2"
      >
        {{ sections.kit?.title }}
      </h2>
      <p class="kit-lead">
        {{ sections.kit?.lead }}
        <NuxtLink
          v-if="bagHref"
          :to="bagHref"
          class="link-accent"
        >
          {{ sections.kit?.cta }}
        </NuxtLink>
      </p>
      <dl class="kit">
        <div
          v-for="item in about.kit"
          :key="item.label"
          class="card kit-item"
        >
          <dt class="eyebrow">
            {{ item.label }}
          </dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </section>

    <FilmographyCredits
      v-if="credits.length"
      :credits="credits"
      :services="[]"
      :title="sections.filmography?.title"
    />

    <ShellCrossModeBanner to="day" />

    <ContactCta
      v-if="profile"
      :title="t('cta.shoot')"
      :email="profile.email"
      :cta="sections.book?.cta ?? t('nav.contact')"
      :href="bookHref"
    />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

/* Two classes so it also wins over the responsive .intro rules below */
.intro.intro--text {
  grid-template-columns: minmax(0, 1fr);
  max-width: 760px;
}

.portrait img,
.portrait :deep(.placeholder) {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--r-media-lg);
}

.story {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.services {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.service {
  padding: 20px;
}

.service p {
  margin: 0;
}

.service-title {
  font-size: 19px;
}

.service-summary {
  margin-top: 8px !important;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.kit-lead {
  max-width: 620px;
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--muted);
}

.kit {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 0;
}

.kit-item {
  padding: 18px 20px;
}

.kit-item dd {
  margin: 6px 0 0;
  font-size: 16px;
}

@media (max-width: 1023px) {
  .intro {
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 28px;
  }

  .services,
  .kit {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .portrait {
    max-width: 280px;
  }

  .services,
  .kit {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
