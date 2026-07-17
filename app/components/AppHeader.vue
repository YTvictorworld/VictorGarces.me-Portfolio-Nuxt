<script setup lang="ts">
import { useFixedHeader } from 'vue-use-fixed-header'
import { navLinks } from '~/utils/links'

const headerRef = ref(null)
const { styles } = useFixedHeader(headerRef)

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const otherLocale = computed(() => (locale.value === 'es' ? 'en' : 'es'))
const homePath = computed(() => localePath('/'))

const items = computed(() => navLinks.map(link => ({
  key: link.key,
  icon: link.icon,
  label: t(`nav.${link.key}`),
  to: localePath(link.to) + (link.hash ?? ''),
  base: localePath(link.to),
  hash: link.hash ?? null
})))

/* --- Scroll spy: highlight the nav item whose section is on screen --- */
const activeSection = ref<string | null>(null)

const updateSpy = () => {
  if (route.path !== homePath.value) {
    activeSection.value = null
    return
  }
  const anchorY = window.innerHeight * 0.4
  const ids = navLinks.map(l => l.hash?.slice(1)).filter((id): id is string => !!id)
  const containing = ids.filter((id) => {
    const el = document.getElementById(id)
    if (!el) return false
    const r = el.getBoundingClientRect()
    return r.top <= anchorY && r.bottom >= anchorY
  })
  // keep the current one while its section still contains the anchor line
  if (activeSection.value && containing.includes(activeSection.value)) return
  activeSection.value = containing[0] ?? null
}

useEventListener('scroll', updateSpy, { passive: true })
watch(() => route.fullPath, () => nextTick(updateSpy))
onMounted(updateSpy)

const onNavClick = (hash: string | null) => {
  if (hash) activeSection.value = hash.slice(1)
}

const isActive = (item: { base: string, hash: string | null }): boolean => {
  if (item.hash) return activeSection.value === item.hash.slice(1)
  if (item.base === homePath.value) return route.path === homePath.value && !activeSection.value
  return route.path === item.base || route.path.startsWith(`${item.base}/`)
}
</script>

<template>
  <div ref="headerRef" :style="styles" class="fixed top-0 w-full z-50 flex justify-center">
    <div class="header-enter">
      <nav :aria-label="t('nav.main')" class="mx-auto px-4 sm:px-6 lg:px-8 inline-block">
        <ul
          class="flex items-center my-4 px-3 text-sm font-medium text-neutral-800 rounded-full bg-white/70 dark:bg-neutral-900/70 shadow-lg shadow-neutral-800/5 ring-1 backdrop-blur dark:text-neutral-200 dark:ring-white/20 ring-neutral-900/5">
          <li v-for="item in items" :key="item.key">
            <UTooltip :text="item.label" :arrow="true">
              <ULink :to="item.to" :active="isActive(item)"
                class="relative px-3 py-4 flex items-center justify-center transition hover:text-primary-500 dark:hover:text-primary-400"
                active-class="text-primary-600 dark:text-primary-400"
                @click="onNavClick(item.hash)">

                <Icon aria-hidden="true" :name="item.icon" class="w-5 h-5 z-10" />

                <span v-if="isActive(item)"
                  class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-primary-500/0 via-primary-500/70 to-primary-500/0 dark:from-primary-400/0 dark:via-primary-400/40 dark:to-primary-400/0"></span>
                <span v-if="isActive(item)"
                  class="absolute h-8 w-8 z-0 rounded-full bg-neutral-100 dark:bg-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                <span class="sr-only">{{ item.label }}</span>
              </ULink>
            </UTooltip>
          </li>
          <li class="flex-1"></li>
          <li>
            <UTooltip :text="t('nav.switchLocale')" :arrow="true">
              <ULink :to="switchLocalePath(otherLocale)"
                class="px-2 py-4 flex items-center justify-center font-mono text-xs uppercase tracking-wider transition hover:text-primary-500 dark:hover:text-primary-400">
                {{ otherLocale }}
              </ULink>
            </UTooltip>
          </li>
          <li>
            <ColorModeButton />
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
@keyframes header-in {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.header-enter {
  animation: header-in 0.5s ease-out both;
}
</style>
