<script setup lang="ts">
import { formatDate } from '~/utils/format'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const blogCollection = (locale.value === 'es' ? 'blog_es' : 'blog_en') as 'blog_en'
const contentPath = `/${locale.value}/blog/${route.params.slug}`

const { data: post } = await useAsyncData(`blog-post-${contentPath}`, () =>
    queryCollection(blogCollection).path(contentPath).first()
)

if (!post.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
        fatal: true
    })
}

// social crawlers require absolute URLs for og:image
const ogImage = post.value?.image?.startsWith('/')
    ? `${SITE_URL}${post.value.image}`
    : post.value?.image

useSeoMeta({
    title: post.value?.seo?.title || post.value?.title,
    ogTitle: post.value?.seo?.title || post.value?.title,
    description: post.value?.seo?.description || post.value?.description,
    ogDescription: post.value?.seo?.description || post.value?.description,
    ogImage,
    twitterCard: 'summary_large_image'
})
</script>

<template>
    <article v-if="post" class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
            <!-- Back link -->
            <Reveal immediate :duration="500" :y="12">
                <UButton :to="localePath('/blog')" icon="i-lucide-arrow-left" variant="ghost" color="neutral" size="sm" class="mb-8">
                    {{ t('blog.allPosts') }}
                </UButton>
            </Reveal>

            <!-- Header -->
            <header class="mb-10">
                <Reveal immediate :delay="100" :duration="600">
                    <div class="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                        <time v-if="post.date" :datetime="post.date.toString()">
                            {{ formatDate(post.date, locale === 'es' ? 'es-DO' : 'en-US') }}
                        </time>
                        <span v-if="post.minRead" class="flex items-center gap-1.5">
                            <UIcon name="i-lucide-clock" class="size-4" aria-hidden="true" />
                            {{ t('blog.minRead', { min: post.minRead }) }}
                        </span>
                    </div>
                    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white text-balance mb-6">
                        {{ post.title }}
                    </h1>
                    <p class="text-xl text-neutral-600 dark:text-neutral-300 text-pretty">
                        {{ post.description }}
                    </p>
                </Reveal>

                <!-- Author -->
                <Reveal v-if="post.author" immediate :delay="200" :duration="600">
                    <div class="flex items-center gap-3 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                        <UAvatar v-if="post.author.avatar?.src" :src="post.author.avatar.src" :alt="post.author.name"
                            size="md" />
                        <div>
                            <p class="font-medium text-neutral-900 dark:text-white">{{ post.author.name }}</p>
                            <p v-if="post.author.description" class="text-sm text-neutral-500 dark:text-neutral-400">
                                {{ post.author.description }}
                            </p>
                        </div>
                    </div>
                </Reveal>
            </header>

            <!-- Cover image -->
            <Reveal v-if="post.image" immediate :delay="300" :duration="700">
                <AppImage :src="post.image" :alt="post.title" loading="eager" fetchpriority="high"
                    class="w-full rounded-xl shadow-lg mb-12" img-class="w-full aspect-video object-cover" />
            </Reveal>

            <!-- Body -->
            <Reveal immediate :delay="400" :duration="700">
                <div class="post-body">
                    <ContentRenderer :value="post" />
                </div>
            </Reveal>

            <!-- Footer CTA -->
            <Reveal :duration="600">
                <footer class="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p class="text-neutral-600 dark:text-neutral-300">{{ t('blog.thanks') }}</p>
                    <UButton :to="localePath('/blog')" icon="i-lucide-arrow-left" variant="outline" color="neutral">
                        {{ t('blog.backToPosts') }}
                    </UButton>
                </footer>
            </Reveal>
        </div>
    </article>
</template>

<style scoped>
/* Content typography (Nuxt UI Pro prose styles are not available on the free tier) */
.post-body :deep(h1),
.post-body :deep(h2),
.post-body :deep(h3) {
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-neutral-900);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
}

.dark .post-body :deep(h1),
.dark .post-body :deep(h2),
.dark .post-body :deep(h3) {
    color: white;
}

.post-body :deep(h1) { font-size: 1.875rem; }
.post-body :deep(h2) { font-size: 1.5rem; }
.post-body :deep(h3) { font-size: 1.25rem; }

.post-body :deep(p) {
    margin-bottom: 1.25rem;
    line-height: 1.75;
    color: var(--color-neutral-600);
}

.dark .post-body :deep(p) {
    color: var(--color-neutral-300);
}

.post-body :deep(ul),
.post-body :deep(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
    color: var(--color-neutral-600);
}

.dark .post-body :deep(ul),
.dark .post-body :deep(ol) {
    color: var(--color-neutral-300);
}

.post-body :deep(ul) { list-style: disc; }
.post-body :deep(ol) { list-style: decimal; }

.post-body :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.7;
}

.post-body :deep(a) {
    color: var(--color-primary-600);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.dark .post-body :deep(a) {
    color: var(--color-primary-400);
}

.post-body :deep(pre) {
    background: var(--color-neutral-950);
    color: var(--color-neutral-100);
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
}

.post-body :deep(:not(pre) > code) {
    background: var(--color-neutral-100);
    border-radius: 0.375rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.875em;
}

.dark .post-body :deep(:not(pre) > code) {
    background: color-mix(in srgb, white 10%, transparent);
}

.post-body :deep(hr) {
    border-color: var(--color-neutral-200);
    margin: 2.5rem 0;
}

.dark .post-body :deep(hr) {
    border-color: var(--color-neutral-800);
}

.post-body :deep(blockquote) {
    border-left: 3px solid var(--color-primary-500);
    padding-left: 1rem;
    font-style: italic;
    margin-bottom: 1.25rem;
}
</style>
