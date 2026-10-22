<script setup lang="ts">
/** First-visit layout: only the brand and the language switch, no nav or mode toggle. */
const { t } = useI18n()
const { announcement } = useMode()
const siteName = SITE_NAME
</script>

<template>
  <div class="landing">
    <a
      href="#main"
      class="skip-link"
    >{{ t('a11y.skipToContent') }}</a>
    <header class="bar">
      <span class="brand display">{{ siteName }}</span>
      <ShellLangSwitch />
    </header>
    <!-- tabindex: app.vue moves focus here after a navigation, as in the default layout -->
    <main
      id="main"
      tabindex="-1"
      class="landing-main"
    >
      <NuxtPage />
    </main>
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
  padding: 0 var(--gutter);
}

.brand {
  font-size: 18px;
  letter-spacing: -0.01em;
}

/* Focused by script, never by Tab: no ring around the whole page (as .main in ui.css) */
.landing-main {
  outline: none;
}
</style>

<style>
/* A returning visitor is sent to their side before the landing paints (see pages/index.vue).
   Unscoped on purpose: Vue keeps only the :global() part of a scoped selector. */
html[data-returning] .landing {
  visibility: hidden;
}
</style>
