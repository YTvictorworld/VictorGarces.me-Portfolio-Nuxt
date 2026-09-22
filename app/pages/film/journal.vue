<script setup lang="ts">
definePageMeta({ fullBleed: true })

const { locale, t, te } = useI18n()
const localePath = useLocalePath()
const { collection, published } = useLocalizedContent()

const { data } = await useAsyncData(`journal-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/journal`).first(),
  queryCollection(collection('blog')).order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'tags', 'cover', 'draft').all()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

/** The journal is the film side of the blog: posts tagged `film`, same as the night home. */
const posts = computed(() => published(data.value?.[1]).filter(post => post.tags?.includes('film')))

// Only a tag with a written label reaches the card; a raw slug never does
const label = (tags: string[] = []) => {
  const tag = tags.find(entry => entry !== 'film')
  return tag && te(`blog.tag.${tag}`) ? t(`blog.tag.${tag}`) : undefined
}

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
      :count="t('page.results', { n: posts.length, total: posts.length })"
    />

    <section
      class="section posts"
      :aria-label="page.title"
    >
      <BlogJournalCard
        v-for="post in posts"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :label="label(post.tags)"
        :cover="post.cover"
        :href="localePath(`/blog/${slugOf(post.path)}`)"
      />
      <p
        v-if="!posts.length"
        class="empty"
      >
        {{ t('page.empty') }}
      </p>
    </section>

    <div class="section all">
      <NuxtLink
        :to="localePath('/blog')"
        class="link-accent"
      >
        {{ t('blog.allPosts') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.posts {
  display: grid;
  gap: 16px;
}

.empty {
  margin: 0;
  color: var(--muted);
}

.all {
  padding-bottom: 8px;
}
</style>
