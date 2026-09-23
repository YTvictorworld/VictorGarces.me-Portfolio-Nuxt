<script setup lang="ts">
definePageMeta({
  fullBleed: true,
  // Reject an unknown slug here, before the content database is instantiated
  validate: route => useRuntimeConfig().public.slugs.blog.includes(String(route.params.slug))
})

const { locale, t, te } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { collection, published, showDrafts } = useLocalizedContent()

const slug = String(route.params.slug)
const { data } = await useAsyncData(`post-${locale.value}-${slug}`, () => Promise.all([
  queryCollection(collection('blog')).path(`/${locale.value}/blog/${slug}`).first(),
  queryCollection(collection('blog')).order('date', 'DESC')
    .select('path', 'title', 'date', 'draft').all()
]))

const post = computed(() => data.value?.[0])
if (!post.value || (post.value.draft && !showDrafts)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const siblings = computed(() => {
  const list = published(data.value?.[1])
  const index = list.findIndex(entry => entry.path === post.value?.path)
  return { previous: index > 0 ? list[index - 1] : undefined, next: list[index + 1] }
})

/** `##` headings only: a two-level list would be noise on posts this short. */
const toc = computed(() => post.value?.body?.toc?.links ?? [])

// Same guarded lookup as /blog and /film/journal: a tag without a label shows as written
const tagLabel = (tag: string) => te(`blog.tag.${tag}`) ? t(`blog.tag.${tag}`) : tag

const url = computed(() => `${SITE_URL}${localePath(`/blog/${slug}`)}`)
const share = computed(() => [
  { label: 'X', href: `https://x.com/intent/tweet?text=${encodeURIComponent(post.value?.title ?? '')}&url=${encodeURIComponent(url.value)}` },
  { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url.value)}` }
])

const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(url.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // clipboard blocked: the address bar still has the URL
  }
}

useSeoMeta({
  title: post.value.title,
  ogTitle: post.value.title,
  description: post.value.description,
  ogDescription: post.value.description,
  ogType: 'article',
  articlePublishedTime: new Date(post.value.date).toISOString(),
  articleTag: post.value.tags
})
</script>

<template>
  <article v-if="post">
    <BlogReadingProgress />

    <div class="head">
      <NuxtLink
        :to="localePath('/blog')"
        class="back mono"
      >
        ← {{ t('page.backToPosts') }}
      </NuxtLink>
      <p class="eyebrow eyebrow--accent">
        <time :datetime="new Date(post.date).toISOString().slice(0, 10)">{{ formatDate(post.date, locale) }}</time>
        <template v-if="post.minRead">
          · {{ t('page.minRead', { min: post.minRead }) }}
        </template>
      </p>
      <h1 class="title">
        {{ post.title }}
      </h1>
      <p class="lead">
        {{ post.description }}
      </p>
      <ul
        v-if="post.tags?.length"
        class="tags"
      >
        <li
          v-for="tag in post.tags"
          :key="tag"
          class="chip"
        >
          {{ tagLabel(tag) }}
        </li>
      </ul>
    </div>

    <NuxtImg
      v-if="post.cover"
      :src="post.cover.src"
      :alt="post.cover.alt"
      class="cover"
      width="1200"
      height="600"
      sizes="(max-width: 1023px) 100vw, 1100px"
      loading="eager"
      fetchpriority="high"
    />

    <div class="section layout">
      <div class="prose body">
        <ContentRenderer :value="post" />
      </div>

      <aside class="aside">
        <nav
          v-if="toc.length"
          class="toc"
          :aria-label="t('page.onThisPage')"
        >
          <p class="eyebrow">
            {{ t('page.onThisPage') }}
          </p>
          <ul>
            <li
              v-for="entry in toc"
              :key="entry.id"
            >
              <a :href="`#${entry.id}`">{{ entry.text }}</a>
            </li>
          </ul>
        </nav>

        <div class="share">
          <p class="eyebrow">
            {{ t('page.share') }}
          </p>
          <button
            type="button"
            class="pill"
            @click="copyLink"
          >
            {{ copied ? t('page.linkCopied') : t('page.copyLink') }}
          </button>
          <a
            v-for="target in share"
            :key="target.label"
            :href="target.href"
            class="pill"
            target="_blank"
            rel="noopener"
          >{{ target.label }}</a>
        </div>
      </aside>
    </div>

    <nav
      class="section siblings"
      :aria-label="t('page.backToPosts')"
    >
      <NuxtLink
        v-if="siblings.previous"
        :to="localePath(`/blog/${slugOf(siblings.previous.path)}`)"
        class="card sibling"
      >
        <span class="eyebrow">{{ t('page.previous') }}</span>
        <span class="sibling-title">{{ siblings.previous.title }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="siblings.next"
        :to="localePath(`/blog/${slugOf(siblings.next.path)}`)"
        class="card sibling sibling--next"
      >
        <span class="eyebrow">{{ t('page.next') }}</span>
        <span class="sibling-title">{{ siblings.next.title }}</span>
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 820px;
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
  line-height: 1.05;
}

.lead {
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

/* These chips sit on the page, not in a card, where --chip-bg equals the day background */
.tags .chip {
  background: var(--raised);
}

.cover {
  display: block;
  width: calc(100% - var(--gutter) * 2);
  height: auto;
  margin: 28px var(--gutter) 0;
  object-fit: cover;
  border-radius: var(--r-stage);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 48px;
  align-items: start;
}

.body {
  max-width: 720px;
}

.body :deep(h2) {
  scroll-margin-top: 16px;
}

.aside {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.aside p {
  margin: 0 0 10px;
}

.toc ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.toc a {
  font-size: 14px;
  line-height: 1.35;
  color: var(--muted);
  text-decoration: none;
}

.toc a:hover {
  color: var(--accent);
}

.share {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.share p {
  flex-basis: 100%;
}

.share .pill {
  cursor: pointer;
  text-decoration: none;
}

.siblings {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.sibling {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 24px;
  color: var(--text);
  text-decoration: none;
}

.sibling:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.sibling--next {
  grid-column: 2;
  text-align: right;
}

.sibling-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }

  .aside {
    position: static;
  }
}

@media (max-width: 767px) {
  .siblings {
    grid-template-columns: minmax(0, 1fr);
  }

  .sibling--next {
    grid-column: 1;
    text-align: left;
  }
}
</style>
