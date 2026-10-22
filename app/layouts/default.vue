<script setup lang="ts">
const { t } = useI18n()
const { announcement } = useMode()
</script>

<template>
  <div>
    <a
      href="#main"
      class="skip-link"
    >{{ t('a11y.skipToContent') }}</a>
    <ShellHeader />
    <main
      id="main"
      tabindex="-1"
      class="main"
    >
      <!-- Every page now lays itself out with the --gutter tokens, so there is no container.
           One NuxtPage for both layouts, so the page transition plays across the boundary. -->
      <NuxtPage />
    </main>
    <ShellFooter />
    <ShellMobileModePill />
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
  </div>
</template>
