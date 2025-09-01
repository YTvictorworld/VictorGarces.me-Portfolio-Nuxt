<script setup lang="ts">
import { useFixedHeader } from 'vue-use-fixed-header';
const headerRef = ref(null);
const { styles } = useFixedHeader(headerRef);
import type { NavigationMenuItem } from '@nuxt/ui';

defineProps<{
  links: NavigationMenuItem[]
}>()


</script>

<template>
   <div ref="headerRef" :style="styles" class="fixed top-0 w-full z-50 flex justify-center">
    <nav class="mx-auto px-4 sm:px-6 lg:px-8 inline-block">
      <ul
        class="flex items-center my-4 px-3 text-sm font-medium text-gray-800 rounded-full shadow-lg shadow-gray-800/5 ring-1 backdrop-blur dark:text-gray-200 dark:ring-white/20 ring-gray-900/5"
      >
        <li v-for="item in links" :key="item.label">
          <UTooltip
            :text="item.label"
            :arrow="true"
          >
            <ULink
              :to="item.to"
              class="relative px-3 py-4 flex items-center justify-center transition hover:text-primary-500 dark:hover:text-primary-400"
              active-class="text-primary-600 dark:text-primary-400"
            >

             <Icon v-if="item.icon" aria-hidden="true" :name="item.icon" class="w-5 h-5 z-10" />

              <span
                v-if="$route.path === item.path"
                class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-primary-500/0 via-primary-500/70 to-primary-500/0 dark:from-primary-400/0 dark:via-primary-400/40 dark:to-primary-400/0"
              ></span>
              <span
                v-if="$route.path === item.path"
                class="absolute h-8 w-8 z-0 rounded-full bg-gray-100 dark:bg-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              ></span>
              <span class="sr-only">{{ item.label }}</span>
            </ULink>
          </UTooltip>
        </li>
        <li class="flex-1"></li>
        <li>
          <ColorModeButton class="pl-4"/>
        </li>
      </ul>
    </nav>
  </div>
</template>


