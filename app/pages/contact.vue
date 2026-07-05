<script setup lang="ts">
const { global, footer } = useAppConfig()

useSeoMeta({
  title: 'Contact',
  description: 'Get in touch with Víctor Garcés for web development, photography or filmmaking projects. Based in Santo Domingo, Dominican Republic.',
  ogTitle: 'Contact · Víctor Garcés',
  ogDescription: 'Get in touch with Víctor Garcés for web development, photography or filmmaking projects.'
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
    description: 'Best for work opportunities and professional inquiries.',
    icon: 'i-simple-icons-linkedin',
    to: global?.meetingLink
  },
  {
    label: 'GitHub',
    description: 'My code, projects and open-source activity.',
    icon: 'i-simple-icons-github',
    to: footer?.links?.find(l => l.icon?.includes('github'))?.to
  },
  {
    label: 'Instagram',
    description: 'Photography, filmmaking and behind-the-scenes.',
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
          Contact
        </p>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 text-balance">
          Let's work together
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-300 mb-8 text-pretty">
          Have a project in mind, like a website, a film or a photo session? Tell me about it.
          I usually reply within 24 hours.
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
          {{ global?.available ? 'Available for new projects' : 'Not available at the moment' }}
        </div>
      </Reveal>

      <!-- Email card (primary action) -->
      <Reveal immediate :delay="200" :duration="600">
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-xl border border-primary-300/50 dark:border-primary-800/60 bg-primary-50/50 dark:bg-primary-950/20 mb-8">
          <div class="flex-1">
            <p class="font-semibold text-neutral-900 dark:text-white mb-1">Email me</p>
            <p class="font-mono text-sm text-neutral-600 dark:text-neutral-300 break-all">{{ email }}</p>
          </div>
          <div class="flex gap-2">
            <UButton :to="`mailto:${email}`" icon="i-lucide-mail" color="primary" size="lg">
              Write me
            </UButton>
            <UTooltip :text="copied ? 'Copied!' : 'Copy address'">
              <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" color="neutral" variant="outline" size="lg"
                :aria-label="copied ? 'Email copied' : 'Copy email address'" @click="copyEmail" />
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
          Santo Domingo, Dominican Republic · Working with clients worldwide
        </p>
      </Reveal>
    </div>
  </div>
</template>
