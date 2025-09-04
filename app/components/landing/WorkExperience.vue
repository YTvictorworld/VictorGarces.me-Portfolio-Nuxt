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
    <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
            <h2 class="text-3xl font-bold mb-12 text-center md:text-left">{{ data?.title }}</h2>
        </div>

        <div class="space-y-12">
            <div v-for="item in data?.items" :key="item.company.name + item.position"
                class="flex flex-col md:flex-row md:justify-between items-start gap-6">
                <!-- Fecha con línea vertical -->
                <div class="flex flex-col items-center md:items-start text-gray-500 dark:text-gray-400 min-w-[60px]">
                    <span class="text-sm font-mono">{{ item.date }}</span>
                    <div class="w-px flex-1 bg-gray-300 dark:bg-gray-700 mt-1"></div>
                </div>

                <!-- Posición y empresa -->
                <div class="flex-1">
                    <Motion is="p" preset="slideVisibleLeft">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ item.position }}</h3>
                        <a :href="item.company.url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300"
                            :style="{
                                '--company-color': item.company.color
                            }" @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.color = item.company.color }"
                            @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.color = '' }">
                            <span class="inline-block w-3 h-3 rounded-full" :style="{ backgroundColor: item.company.color }"
                                aria-hidden="true"></span>
                            {{ item.company.name }}
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline-block" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 3h7v7m0 0L10 21l-7-7 11-11z" />
                            </svg>
                        </a>
                    </Motion>

        
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.company-link:hover {
  color: var(--company-color);
}
</style>
