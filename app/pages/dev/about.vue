<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()
const { cv } = useRuntimeConfig().public

const { data } = await useAsyncData(`about-dev-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/about-dev`).first(),
  queryCollection(collection('about')).path(`/${locale.value}/about/dev`).first(),
  queryCollection(collection('experience')).first(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
const about = computed(() => data.value?.[1])
if (!page.value || !about.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const sections = computed(() => page.value?.sections ?? {})
const entries = computed(() => published(data.value?.[2]?.entries))
const profile = computed(() => data.value?.[3])

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

    <section class="section intro">
      <div class="portrait">
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
          source="content/about/dev · portrait"
        />
      </div>

      <div class="story">
        <div class="prose">
          <ContentRenderer :value="about" />
        </div>
        <div class="actions">
          <a
            v-if="cv"
            :href="cv"
            class="btn btn--accent btn--sm"
            download
          >{{ t('about.downloadCv') }}</a>
          <NuxtLink
            :to="localePath('/contact')"
            class="btn btn--sm"
          >
            {{ t('nav.contact') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <section
      v-if="about.stack?.length"
      class="section stack"
      aria-labelledby="stack-title"
    >
      <h2
        id="stack-title"
        class="h2"
      >
        {{ sections.stack?.title ?? t('about.stack') }}
      </h2>
      <div class="groups">
        <div
          v-for="group in about.stack"
          :key="group.group"
          class="card group"
        >
          <p class="eyebrow">
            {{ group.group }}
          </p>
          <ul>
            <li
              v-for="item in group.items"
              :key="item"
              class="chip"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <ExperienceTimeline
      v-if="entries.length"
      :entries="entries"
      :eyebrow="sections.experience?.eyebrow"
      :title="sections.experience?.title"
    />

    <section
      v-if="about.now"
      class="section now"
      aria-labelledby="now-title"
    >
      <p
        id="now-title"
        class="eyebrow eyebrow--accent"
      >
        {{ sections.now?.eyebrow }}
      </p>
      <p class="now-text display">
        {{ about.now }}
      </p>
    </section>

    <ShellCrossModeBanner to="night" />

    <ContactCta
      v-if="profile"
      :title="sections.now?.cta ?? t('nav.contact')"
      :email="profile.email"
      :cta="t('nav.contact')"
      :href="localePath('/contact')"
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

.groups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.group {
  padding: 20px;
}

.group ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.now-text {
  max-width: 820px;
  margin: 10px 0 0;
  font-size: 26px;
  line-height: 1.3;
}

@media (max-width: 1023px) {
  .intro {
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 28px;
  }

  .groups {
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

  .now-text {
    font-size: 21px;
  }
}
</style>
