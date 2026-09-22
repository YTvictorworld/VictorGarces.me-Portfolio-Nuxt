<script setup lang="ts">
/** First-visit layout: only the brand and the language switch, no nav or mode toggle. */
const { announcement } = useMode()
const siteName = SITE_NAME
</script>

<template>
  <div class="landing">
    <header class="bar">
      <span class="brand display">{{ siteName }}</span>
      <ShellLangSwitch />
    </header>
    <main id="main">
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
</style>

<style>
/* A returning visitor is sent to their side before the landing paints (see pages/index.vue).
   Unscoped on purpose: Vue keeps only the :global() part of a scoped selector. */
html[data-returning] .landing {
  visibility: hidden;
}
</style>
