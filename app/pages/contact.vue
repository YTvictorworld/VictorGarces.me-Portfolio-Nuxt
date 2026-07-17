<script setup lang="ts">
const { global, footer } = useAppConfig()
const { t } = useI18n()

const seoDescription = computed(() => t('contact.intro'))

useSeoMeta({
  title: () => t('contact.eyebrow'),
  description: seoDescription,
  ogTitle: () => `${t('contact.eyebrow')} · Víctor Garcés`,
  ogDescription: seoDescription
})

const email = computed(() => global?.email ?? '')
const copied = ref(false)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // clipboard unavailable; the mailto link still works
  }
}

const channels = computed(() => [
  {
    label: 'LinkedIn',
    description: t('contact.linkedinDesc'),
    icon: 'i-simple-icons-linkedin',
    to: global?.meetingLink
  },
  {
    label: 'GitHub',
    description: t('contact.githubDesc'),
    icon: 'i-simple-icons-github',
    to: footer?.links?.find(l => l.icon?.includes('github'))?.to
  },
  {
    label: 'Instagram',
    description: t('contact.instagramDesc'),
    icon: 'i-simple-icons-instagram',
    to: footer?.links?.find(l => l.icon?.includes('instagram'))?.to
  }
].filter(c => c.to))
</script>

<template>
  <div class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <Reveal immediate :duration="600">
        <p class="font-mono text-xs uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
          {{ $t('contact.eyebrow') }}
        </p>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 text-balance">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8 text-pretty">
          {{ $t('contact.intro') }}
        </p>
      </Reveal>

      <!-- Availability -->
      <Reveal immediate :delay="100" :duration="600">
        <div class="inline-flex items-center gap-2 mb-12 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm"
          :class="global?.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping"
              :class="global?.available ? 'bg-green-500' : 'bg-red-500'" />
            <span class="relative inline-flex size-2 scale-90 rounded-full"
              :class="global?.available ? 'bg-green-500' : 'bg-red-500'" />
          </span>
          {{ global?.available ? $t('hero.available') : $t('hero.unavailable') }}
        </div>
      </Reveal>

      <!-- Email card (primary action) -->
      <Reveal immediate :delay="200" :duration="600">
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-xl border border-primary-300/50 dark:border-primary-800/60 bg-primary-50/50 dark:bg-primary-950/20 mb-8">
          <div class="flex-1">
            <p class="font-semibold text-neutral-900 dark:text-white mb-1">{{ $t('contact.emailMe') }}</p>
            <p class="font-mono text-sm text-neutral-600 dark:text-neutral-300 break-all">{{ email }}</p>
          </div>
          <div class="flex gap-2">
            <UButton :to="`mailto:${email}`" icon="i-lucide-mail" color="primary" size="lg">
              {{ $t('contact.writeMe') }}
            </UButton>
            <UTooltip :text="copied ? $t('contact.copied') : $t('contact.copy')">
              <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" color="neutral" variant="outline" size="lg"
                :aria-label="copied ? $t('contact.copiedAria') : $t('contact.copyAria')" @click="copyEmail" />
            </UTooltip>
          </div>
        </div>
      </Reveal>

      <!-- Other channels -->
      <div class="grid sm:grid-cols-3 gap-4">
        <Reveal v-for="(channel, index) in channels" :key="channel.label" immediate :delay="300 + index * 100"
          :duration="600">
          <a :href="channel.to" target="_blank" rel="noopener noreferrer"
            class="group flex flex-col gap-3 p-6 h-full rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <UIcon :name="channel.icon"
              class="size-6 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 transition-colors"
              aria-hidden="true" />
            <div>
              <p
                class="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ channel.label }}
              </p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{{ channel.description }}</p>
            </div>
          </a>
        </Reveal>
      </div>

      <!-- Location note -->
      <Reveal :delay="200" :duration="600">
        <p class="flex items-center gap-2 mt-12 text-sm text-neutral-500 dark:text-neutral-400">
          <UIcon name="i-lucide-map-pin" class="size-4" aria-hidden="true" />
          {{ $t('contact.location') }}
        </p>
      </Reveal>
    </div>
  </div>
</template>
