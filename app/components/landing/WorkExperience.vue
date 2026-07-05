<script setup lang="ts">
interface ExperienceItem {
    date: string
    position: string
    company: {
        name: string
        url: string
        logo: string
        color: string
    }
}

interface Props {
    data?: {
        title: string
        description?: string
        items: ExperienceItem[]
    }
}

defineProps<Props>()
</script>

<template>
    <section>
        <Reveal :duration="600">
            <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
                Career
            </p>
            <h2 class="text-3xl font-bold tracking-tight mb-10">{{ data?.title }}</h2>
        </Reveal>

        <ol class="relative flex flex-col gap-10">
            <!-- Timeline line: first child so it paints behind the dots -->
            <ScrollBeam class="inset-y-0 left-0" :anchor="0.7" :glow="false" :fade-top="false" />
            <Reveal v-for="(item, index) in data?.items" :key="item.company.name + item.position" :delay="index * 120"
                :duration="600">
                <li class="ms-6 relative">
                    <!-- Timeline dot -->
                    <span
                        class="absolute -start-[29px] top-1.5 flex size-3 items-center justify-center rounded-full"
                        :style="{
                            backgroundColor: item.company.color,
                            boxShadow: `0 0 0 1px rgb(255 255 255 / 0.35), 0 0 0 5px var(--ui-bg), 0 0 14px 2px ${item.company.color}`
                        }" aria-hidden="true"></span>

                    <time class="text-sm font-mono text-neutral-500 dark:text-neutral-400">{{ item.date }}</time>
                    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mt-1">
                        {{ item.position }}
                    </h3>
                    <component :is="item.company.url ? 'a' : 'span'"
                        :href="item.company.url || undefined"
                        :target="item.company.url ? '_blank' : undefined"
                        :rel="item.company.url ? 'noopener noreferrer' : undefined"
                        class="company-link group inline-flex items-center gap-2 font-medium text-neutral-600 dark:text-neutral-400 transition-colors duration-300"
                        :style="{ '--company-color': item.company.color }">
                        {{ item.company.name }}
                        <svg v-if="item.company.url" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H8m9 0v9" />
                        </svg>
                    </component>
                </li>
            </Reveal>
        </ol>
    </section>
</template>

<style scoped>
.company-link:hover {
    color: var(--company-color);
}
</style>
