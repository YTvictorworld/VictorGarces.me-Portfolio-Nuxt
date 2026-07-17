<script setup lang="ts">
import { formatDate } from '~/utils/format'

const { t, locale } = useI18n()

const pagesCollection = (locale.value === 'es' ? 'pages_es' : 'pages_en') as 'pages_en'
const blogCollection = (locale.value === 'es' ? 'blog_es' : 'blog_en') as 'blog_en'

const { data: page } = await useAsyncData(`blog-page-${locale.value}`, () =>
    queryCollection(pagesCollection).first()
)

if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}

const { data: posts } = await useAsyncData(`blog-posts-${locale.value}`, () =>
    queryCollection(blogCollection).order('date', 'DESC').all()
)

useSeoMeta({
    title: page.value?.seo?.title || page.value?.title,
    ogTitle: page.value?.seo?.title || page.value?.title,
    description: page.value?.seo?.description || page.value?.description,
    ogDescription: page.value?.seo?.description || page.value?.description
})

const searchQuery = ref('')

const clearSearch = (): void => {
    searchQuery.value = ''
}

const filteredPosts = computed(() => {
    const all = posts.value || []
    if (!searchQuery.value) return all

    const query = searchQuery.value.toLowerCase()
    return all.filter(post =>
        post.title?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
    )
})

const dateLocale = computed(() => locale.value === 'es' ? 'es-DO' : 'en-US')

const localePath = useLocalePath()

// content paths carry the collection prefix (/en/blog/x, /es/blog/x);
// the actual route is the localized /blog/<slug>
const postLink = (contentPath: string): string =>
    localePath(`/blog/${contentPath.split('/').pop()}`)
</script>

<template>
    <div v-if="page" class="min-h-screen">
        <!-- Hero -->
        <section class="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <Reveal immediate :duration="600">
                    <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
                        {{ t('blog.eyebrow') }}
                    </p>
                    <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                        {{ page.title }}
                    </h1>
                    <p class="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mb-8 text-pretty">
                        {{ page.description }}
                    </p>
                </Reveal>

                <Reveal immediate :delay="150" :duration="600">
                    <div v-if="page.links && page.links.length > 0" class="flex flex-wrap gap-4">
                        <UButton v-for="link in page.links" :key="link.label" v-bind="{ size: 'md', ...link }" />
                    </div>
                </Reveal>
            </div>
        </section>

        <!-- Posts -->
        <section class="py-8 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <!-- Search -->
                <Reveal immediate :delay="250" :duration="600">
                    <div class="mb-12">
                        <UInput v-model="searchQuery" type="search" icon="i-lucide-search"
                            :placeholder="t('blog.searchPlaceholder')" size="lg" class="w-full"
                            :ui="{ base: 'rounded-full' }" />
                        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-4" role="status">
                            {{ t('blog.postsFound', { count: filteredPosts.length }, filteredPosts.length) }}
                        </p>
                    </div>
                </Reveal>

                <!-- Post cards -->
                <div v-if="filteredPosts.length > 0" class="space-y-10">
                    <Reveal v-for="(post, index) in filteredPosts" :key="post.path" :delay="index * 80" :duration="600">
                        <NuxtLink :to="postLink(post.path)"
                            class="group flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 md:p-8">
                            <!-- Cover -->
                            <div v-if="post.image" class="flex-shrink-0 w-full md:w-64 h-48 md:h-auto overflow-hidden rounded-lg">
                                <AppImage :src="post.image" :alt="post.title" loading="lazy" class="w-full h-full"
                                    img-class="w-full h-full object-cover group-hover:scale-105" />
                            </div>

                            <!-- Content -->
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h2
                                        class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {{ post.title }}
                                    </h2>
                                    <p class="text-neutral-600 dark:text-neutral-300 text-lg mb-4 line-clamp-3">
                                        {{ post.description }}
                                    </p>
                                </div>

                                <div class="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                                    <time :datetime="post.date?.toString()">
                                        {{ formatDate(post.date, dateLocale) }}
                                    </time>
                                    <span v-if="post.minRead" class="flex items-center gap-1.5">
                                        <UIcon name="i-lucide-clock" class="size-4" aria-hidden="true" />
                                        {{ t('blog.minRead', { min: post.minRead }) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Arrow -->
                            <div
                                class="hidden md:flex flex-shrink-0 size-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform self-center"
                                aria-hidden="true">
                                <UIcon name="i-lucide-arrow-right" class="size-4" />
                            </div>
                        </NuxtLink>
                    </Reveal>
                </div>

                <!-- Empty state -->
                <div v-else class="py-20 text-center">
                    <UIcon name="i-lucide-search-x" class="mx-auto size-12 text-neutral-400 mb-4" aria-hidden="true" />
                    <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-6">
                        {{ t('blog.noResults') }}
                    </p>
                    <UButton color="primary" @click="clearSearch">{{ t('blog.clearSearch') }}</UButton>
                </div>
            </div>
        </section>
    </div>
</template>
