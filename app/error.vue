<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * S-404. Nuxt renders this in place of app.vue, so there is no UApp, no layout, no header and
 * no titleTemplate: everything this page needs, it sets itself. It also renders only in the
 * browser (the static preset writes 404.html with SSR off), so it never queries content — the
 * one page whose job is to get the visitor out should not download the content database first.
 */
const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const { mode } = useMode()
const { showPlaceholders } = useRuntimeConfig().public

// Read defensively: a stale chunk after a redeploy arrives here too, and it is not a 404
const status = computed(() => Number(props.error?.statusCode ?? 404))
const notFound = computed(() => status.value === 404)

// app.vue is unmounted, so unhead would otherwise strip data-mode and leave a night visitor
// on a white page with both mode variants showing
useHead(() => ({
  htmlAttrs: {
    'data-mode': mode.value,
    'class': mode.value === 'night' ? 'dark' : 'light',
    'data-placeholders': showPlaceholders ? 'on' : 'off'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: THEME_COLOR[mode.value] },
    { name: 'robots', content: 'noindex' }
  ],
  // A full title, not a template. On an unmatched URL app.vue never mounts, but on a path that
  // matches a dynamic route it does, and its titleTemplate would wrap this one a second time.
  titleTemplate: null,
  title: `${notFound.value ? t('error.notFound.title') : t('error.generic.title')} · ${SITE_NAME}`
}))

/**
 * Back to a real page. clearError drops the error state and redirects with router.replace, so
 * the dead URL does not stay in history. Modified clicks are left to the browser, which is the
 * whole reason these are links rather than buttons.
 */
function leave(event: MouseEvent, path: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  clearError({ redirect: localePath(path) })
}

// app.vue is not mounted, so neither its route announcer nor its focus reset exist here
onMounted(() => document.getElementById('main')?.focus({ preventScroll: true }))
</script>

<template>
  <div class="error">
    <header class="top">
      <NuxtLink
        :to="localePath('/')"
        class="brand display"
      >
        {{ SITE_NAME }}
      </NuxtLink>
      <span class="mono code">{{ status }}</span>
    </header>

    <main
      id="main"
      class="body"
      tabindex="-1"
    >
      <span
        class="numeral mono"
        aria-hidden="true"
      >{{ status }}</span>

      <!-- Both variants render and CSS picks by data-mode, as everywhere else in the site -->
      <template v-if="notFound">
        <h1 class="title display day-only">
          {{ t('error.notFound.day.title') }}
        </h1>
        <h1 class="title display night-only">
          {{ t('error.notFound.night.title') }}
        </h1>
        <p class="lead day-only">
          {{ t('error.notFound.day.lead') }}
        </p>
        <p class="lead night-only">
          {{ t('error.notFound.night.lead') }}
        </p>
      </template>
      <template v-else>
        <h1 class="title display">
          {{ t('error.generic.title') }}
        </h1>
        <p class="lead">
          {{ t('error.generic.lead') }}
        </p>
      </template>

      <div
        v-if="notFound"
        class="actions day-only"
      >
        <NuxtLink
          :to="localePath('/dev')"
          class="btn btn--accent"
          @click="leave($event, '/dev')"
        >
          {{ t('error.home') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/film')"
          class="btn"
          @click="leave($event, '/film')"
        >
          {{ t('error.tryFilm') }}
        </NuxtLink>
      </div>
      <div
        v-if="notFound"
        class="actions night-only"
      >
        <NuxtLink
          :to="localePath('/film')"
          class="btn btn--accent"
          @click="leave($event, '/film')"
        >
          {{ t('error.home') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/dev')"
          class="btn"
          @click="leave($event, '/dev')"
        >
          {{ t('error.tryDev') }}
        </NuxtLink>
      </div>
      <div
        v-else
        class="actions"
      >
        <NuxtLink
          :to="localePath('/')"
          class="btn btn--accent"
          @click="leave($event, '/')"
        >
          {{ t('error.home') }}
        </NuxtLink>
      </div>

      <!-- The lead promises these two, so they are on the page rather than only implied -->
      <p
        v-if="notFound"
        class="elsewhere day-only"
      >
        <NuxtLink
          :to="localePath('/blog')"
          class="link-accent"
          @click="leave($event, '/blog')"
        >
          {{ t('nav.blog') }}
        </NuxtLink>
        <span aria-hidden="true">·</span>
        <NuxtLink
          :to="localePath('/dev/work')"
          class="link-accent"
          @click="leave($event, '/dev/work')"
        >
          {{ t('nav.work') }}
        </NuxtLink>
      </p>
      <p
        v-if="notFound"
        class="elsewhere night-only"
      >
        <NuxtLink
          :to="localePath('/film/films')"
          class="link-accent"
          @click="leave($event, '/film/films')"
        >
          {{ t('nav.films') }}
        </NuxtLink>
        <span aria-hidden="true">·</span>
        <NuxtLink
          :to="localePath('/film/photography')"
          class="link-accent"
          @click="leave($event, '/film/photography')"
        >
          {{ t('nav.photography') }}
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 48px var(--gutter);
  background: var(--bg);
  color: var(--text);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  font-size: 18px;
  color: var(--text);
  text-decoration: none;
}

.code {
  color: var(--accent);
  letter-spacing: 0.06em;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  margin-top: auto;
  outline: none;
}

.numeral {
  font-size: 120px;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--accent);
}

.title {
  margin: 0;
  font-size: 40px;
  line-height: 1.02;
}

.lead {
  max-width: 460px;
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.elsewhere {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--muted);
}

.elsewhere a {
  text-decoration: none;
}

@media (max-width: 767px) {
  .error {
    padding: 28px var(--gutter);
  }

  .numeral {
    font-size: 84px;
  }

  .title {
    font-size: 30px;
  }
}
</style>
