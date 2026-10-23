<script setup lang="ts">
const { locale, t, te } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { collection, published } = useLocalizedContent()

const { data } = await useAsyncData(`blog-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/blog`).first(),
  queryCollection(collection('blog')).order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'minRead', 'tags', 'draft').all()
]))

const page = computed(() => data.value?.[0])
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const posts = computed(() => published(data.value?.[1]))
/** Known tags get a translated label; anything else shows as written. */
const tags = computed(() => [...new Set(posts.value.flatMap(post => post.tags ?? []))]
  .map(tag => ({ id: tag, label: te(`blog.tag.${tag}`) ? t(`blog.tag.${tag}`) : tag })))

const tag = useQueryFilter('tag')

// The term goes in ?q= like the tag, so a search can be shared. The box keeps its own value and
// the query follows it after a pause, so typing never waits on the router or fills history.
const query = useQueryFilter('q')
const search = ref('')
let written = ''
const listPath = router.currentRoute.value.path
// A shared link fills the box after mount; the box's own writes do not echo back into it
watch(query, (value) => {
  if (value !== written) search.value = value
  written = value
})
watchDebounced(search, (value) => {
  // A write still pending when a post link is followed would land on the post's query
  if (router.currentRoute.value.path !== listPath) return
  written = value
  query.value = value
}, { debounce: 300 })

const shown = computed(() => {
  const term = search.value.trim().toLowerCase()
  return posts.value.filter((post) => {
    if (tag.value && !post.tags?.includes(tag.value)) return false
    if (!term) return true
    return [post.title, post.description, ...(post.tags ?? [])]
      .some(field => field?.toLowerCase().includes(term))
  })
})

function clear() {
  search.value = ''
  tag.value = ''
}

useSeo({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description
})
</script>

<template>
  <div v-if="page">
    <PageTitle
      :eyebrow="page.eyebrow"
      :title="page.title"
      :lead="page.lead"
      :count="t('page.results', { n: shown.length, total: posts.length })"
    >
      <label class="search">
        <span class="sr-only">{{ t('page.search') }}</span>
        <input
          v-model="search"
          type="search"
          class="input"
          :placeholder="t('blog.searchPlaceholder')"
        >
      </label>
    </PageTitle>

    <div
      v-if="tags.length > 1"
      class="section"
    >
      <UiFilters
        v-model="tag"
        :options="tags"
        :label="t('filters.tag')"
        :all-label="t('blog.allPosts')"
      />
    </div>

    <section
      class="section grid"
      :aria-label="page.title"
    >
      <BlogPostCard
        v-for="post in shown"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :min-read="post.minRead"
        :href="localePath(`/blog/${slugOf(post.path)}`)"
      />
    </section>

    <p
      class="results"
      role="status"
    >
      <template v-if="!shown.length">
        {{ t('blog.noResults') }}
        <button
          type="button"
          class="link-accent"
          @click="clear"
        >
          {{ t('blog.clearSearch') }}
        </button>
      </template>
    </p>
  </div>
</template>

<style scoped>
.search {
  display: block;
  min-width: 260px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.results {
  margin: 0;
  padding: 24px var(--gutter) 0;
  color: var(--muted);
}

.results:empty {
  padding: 0;
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

  .search {
    flex: 1 1 100%;
    min-width: 0;
  }
}
</style>
