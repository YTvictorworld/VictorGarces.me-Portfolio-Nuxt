<script setup lang="ts">
definePageMeta({
  fullBleed: true,
  // Reject an unknown slug here, before the content database is instantiated
  validate: route => useRuntimeConfig().public.slugs.projects.includes(String(route.params.slug))
})

const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { collection, published, showDrafts } = useLocalizedContent()

const slug = String(route.params.slug)
const { data } = await useAsyncData(`project-${locale.value}-${slug}`, () => Promise.all([
  queryCollection(collection('projects')).path(`/${locale.value}/projects/${slug}`).first(),
  // Only what the next-project link needs: the bodies would triple this page's payload
  queryCollection(collection('projects')).order('order', 'ASC').select('path', 'title', 'draft').all(),
  queryCollection('profile').first()
]))

const project = computed(() => data.value?.[0])
if (!project.value || (project.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const all = computed(() => published(data.value?.[1]))
const next = computed(() => {
  const list = all.value
  const explicit = project.value?.next && list.find(entry => slugOf(entry.path) === project.value?.next)
  if (explicit) return explicit
  const index = list.findIndex(entry => entry.path === project.value?.path)
  return index >= 0 ? list[(index + 1) % list.length] : undefined
})
const profile = computed(() => data.value?.[2])

const meta = computed(() => [
  { label: t('page.role'), value: project.value?.role },
  { label: t('page.year'), value: project.value?.year },
  { label: t('page.status'), value: project.value?.status ? t(`project.status.${project.value.status}`) : undefined },
  { label: t('page.stack'), value: project.value?.stack?.join(', ') }
].filter(row => row.value))

useSeoMeta({
  title: project.value.title,
  ogTitle: project.value.title,
  description: project.value.oneLiner,
  ogDescription: project.value.oneLiner
})
</script>

<template>
  <article v-if="project">
    <div class="intro">
      <NuxtLink
        :to="localePath('/dev/work')"
        class="back mono"
      >
        ← {{ t('page.backToWork') }}
      </NuxtLink>
      <p class="eyebrow eyebrow--accent">
        {{ t('project.caseStudy') }} · {{ project.title }}
      </p>
      <h1 class="title">
        {{ project.headline ?? project.title }}
      </h1>
      <p class="lead">
        {{ project.oneLiner }}
      </p>
    </div>

    <NuxtImg
      v-if="project.cover"
      :src="project.cover.src"
      :alt="project.cover.alt"
      class="cover"
      width="1400"
      height="700"
      sizes="(max-width: 1023px) 100vw, 1280px"
      loading="eager"
      fetchpriority="high"
    />

    <dl class="meta">
      <div
        v-for="row in meta"
        :key="row.label"
      >
        <dt class="eyebrow">
          {{ row.label }}
        </dt>
        <dd>{{ row.value }}</dd>
      </div>
      <div v-if="project.links?.length">
        <dt class="eyebrow">
          {{ t('page.links') }}
        </dt>
        <dd class="links">
          <a
            v-for="link in project.links"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
          >{{ link.label }}</a>
        </dd>
      </div>
    </dl>

    <!-- DESIGN: each `##` in the body becomes one numbered case-study section (01 to 04) -->
    <div class="body prose">
      <ContentRenderer :value="project" />
    </div>

    <section
      v-if="project.decisions?.length"
      class="section decisions"
      aria-labelledby="decisions-title"
    >
      <h2
        id="decisions-title"
        class="h2"
      >
        {{ t('page.decisions') }}
      </h2>
      <ul>
        <li
          v-for="decision in project.decisions"
          :key="decision.title"
          class="card decision"
        >
          <p class="decision-title">
            {{ decision.title }}
          </p>
          <p class="why">
            {{ decision.why }}
          </p>
        </li>
      </ul>
    </section>

    <section
      v-if="project.gallery?.length"
      class="section gallery"
      aria-labelledby="gallery-title"
    >
      <h2
        id="gallery-title"
        class="h2"
      >
        {{ t('page.gallery') }}
      </h2>
      <div class="shots">
        <NuxtImg
          v-for="shot in project.gallery"
          :key="shot.src"
          :src="shot.src"
          :alt="shot.alt"
          width="800"
          height="500"
          sizes="(max-width: 767px) 100vw, 50vw"
          loading="lazy"
        />
      </div>
    </section>

    <NuxtLink
      v-if="next"
      :to="localePath(`/dev/work/${slugOf(next.path)}`)"
      class="next card"
    >
      <span class="eyebrow">{{ t('page.nextProject') }}</span>
      <span class="next-title">{{ next.title }} <UiArrow /></span>
    </NuxtLink>

    <ContactCta
      v-if="profile"
      :title="t('cta.similar')"
      :email="profile.email"
      :cta="t('nav.contact')"
      :href="localePath('/contact')"
    />
  </article>
</template>

<style scoped>
.intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 860px;
  padding: var(--section) var(--gutter) 0;
}

.back {
  color: var(--muted);
  text-decoration: none;
}

.back:hover {
  color: var(--accent);
}

.eyebrow {
  margin: 0;
}

.title {
  font-size: var(--h1-page);
  line-height: 1.02;
}

.lead {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
}

.cover {
  display: block;
  width: calc(100% - var(--gutter) * 2);
  height: auto;
  margin: 28px var(--gutter) 0;
  object-fit: cover;
  border-radius: var(--r-stage);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 48px;
  margin: var(--section) var(--gutter) 0;
  padding: 20px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.meta dt {
  margin-bottom: 4px;
}

.meta dd {
  margin: 0;
  font-size: 15px;
}

.links {
  display: flex;
  gap: 16px;
}

.links a {
  color: var(--accent);
  text-decoration: none;
}

.body {
  max-width: 820px;
  padding: var(--section) var(--gutter) 0;
  counter-reset: section;
}

/* Numbered case-study sections: 01, 02, 03 from the `##` headings in the body */
.body :deep(h2) {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.body :deep(h2)::before {
  counter-increment: section;
  content: '0' counter(section);
  font-family: var(--font-mono);
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  color: var(--accent);
}

.decisions ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.decision {
  padding: 20px 24px;
}

.decision-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
}

.why {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.shots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.shots img {
  width: 100%;
  height: auto;
  border-radius: var(--r-media-lg);
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
  font-size: 22px;
  font-weight: 700;
}

@media (max-width: 767px) {
  .decisions ul,
  .shots {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
