<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { collection, published } = useLocalizedContent()
const { exists } = useNav()
const { cv } = useRuntimeConfig().public

const { data } = await useAsyncData(`dev-home-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/dev`).first(),
  queryCollection(collection('projects')).order('order', 'ASC').all(),
  queryCollection(collection('blog')).select('path', 'title', 'description', 'date', 'minRead', 'tags', 'cover', 'draft').order('date', 'DESC').all(),
  queryCollection(collection('about')).path(`/${locale.value}/about/dev`).first(),
  queryCollection(collection('experience')).first(),
  queryCollection(collection('testimonials')).first(),
  queryCollection(collection('faq')).first(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const s = computed(() => page.value?.sections ?? {})
const forDev = <T extends { mode?: string }>(entries: T[] = []) => entries.filter(entry => entry.mode !== 'film')

const projects = computed(() => published(data.value?.[1]))
const featured = computed(() => projects.value.filter(project => project.featured).slice(0, 3))
const moreCount = computed(() => projects.value.length - featured.value.length)
const posts = computed(() => published(data.value?.[2]).slice(0, 3))
const about = computed(() => data.value?.[3])
const experience = computed(() => published(data.value?.[4]?.entries))
const testimonials = computed(() => forDev(published(data.value?.[5]?.entries)))
const faq = computed(() => forDev(published(data.value?.[6]?.entries)).sort((a, b) => (a.order ?? 99) - (b.order ?? 99)))
const profile = computed(() => data.value?.[7])

// Pages that land in M4: link to them only once they exist
const hasCaseStudies = router.getRoutes().some(route => route.path.endsWith('/dev/work/:slug()'))
const workHref = computed(() => exists('/dev/work') ? localePath('/dev/work') : null)
const aboutHref = computed(() => exists('/dev/about') ? localePath('/dev/about') : null)
const caseHref = (path: string) => hasCaseStudies ? localePath(`/dev/work/${slugOf(path)}`) : null

const contactLinks = computed(() => [
  ...(profile.value?.socials ?? [])
    .filter(social => social.mode !== 'film')
    .map(social => ({ label: social.label, href: social.href, external: true })),
  ...(aboutHref.value ? [{ label: s.value.about?.cta ?? '', href: aboutHref.value }] : [])
])

const workEyebrow = computed(() => `${s.value.work?.eyebrow} · ${t('home.ofTotal', { shown: featured.value.length, total: projects.value.length })}`)

useSeo({
  title: page.value.title,
  description: page.value.description,
  // The home card shows the name, as S-OG-Dev draws it
  cardTitle: SITE_NAME
})
</script>

<template>
  <div v-if="page">
    <HeroDev
      :copy="s.hero ?? {}"
      :cv="cv || null"
    />

    <section
      id="work"
      class="section"
      aria-labelledby="work-title"
    >
      <SectionHead
        :eyebrow="workEyebrow"
        :title="s.work?.title"
        title-id="work-title"
      >
        <NuxtLink
          v-if="workHref"
          :to="workHref"
          class="btn btn--sm"
        >
          {{ s.work?.cta }} <UiArrow />
        </NuxtLink>
      </SectionHead>
      <div class="work-grid">
        <WorkProjectCard
          v-for="project in featured"
          :key="project.path"
          :project="project"
          :href="caseHref(project.path)"
        />
        <WorkMoreTile
          v-if="workHref"
          :href="workHref"
          :label="t('home.allProjects')"
          :eyebrow="s.more?.eyebrow"
          :title="s.more?.title"
          :count="moreCount"
        />
      </div>
    </section>

    <Reveal v-if="about">
      <AboutTeaser
        :about="about"
        :eyebrow="s.about?.eyebrow"
        :cta="s.about?.cta"
        :href="aboutHref"
      />
    </Reveal>

    <Reveal>
      <ExperienceTimeline
        :entries="experience"
        :eyebrow="s.experience?.eyebrow"
        :title="s.experience?.title"
      />
    </Reveal>

    <Reveal v-if="posts.length">
      <section
        id="blog"
        class="section"
        aria-labelledby="blog-title"
      >
        <SectionHead
          :eyebrow="s.blog?.eyebrow"
          :title="s.blog?.title"
          title-id="blog-title"
        >
          <NuxtLink
            :to="localePath('/blog')"
            class="btn btn--sm"
          >
            {{ s.blog?.cta }} <UiArrow />
          </NuxtLink>
        </SectionHead>
        <div class="posts">
          <BlogPostCard
            v-for="post in posts"
            :key="post.path"
            :title="post.title"
            :description="post.description"
            :date="post.date"
            :min-read="post.minRead"
            :href="localePath(`/blog/${slugOf(post.path)}`)"
          />
        </div>
      </section>
    </Reveal>

    <Reveal v-if="testimonials.length">
      <TestimonialsGrid
        :entries="testimonials"
        :eyebrow="s.testimonials?.eyebrow"
        :title="s.testimonials?.title"
      />
    </Reveal>

    <Reveal v-if="faq.length">
      <FaqList
        :entries="faq"
        :eyebrow="s.faq?.eyebrow"
        :title="s.faq?.title"
      />
    </Reveal>

    <Reveal v-if="profile">
      <ContactBlock
        :email="profile.email"
        :links="contactLinks"
        :available="profile.available"
        :eyebrow="s.contact?.eyebrow"
        :label="s.contact?.lead"
        :placeholder="s.contact?.placeholder"
        :cta="s.contact?.cta"
      />
    </Reveal>
  </div>
</template>

<style scoped>
.work-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.posts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1023px) {
  .work-grid,
  .posts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .work-grid,
  .posts {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
}
</style>
