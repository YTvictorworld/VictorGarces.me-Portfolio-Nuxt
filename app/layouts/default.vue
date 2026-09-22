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
      class="min-h-screen outline-none"
    >
      <!-- DESIGN: pages still built on the old container until M3/M4 move them to the --gutter tokens -->
      <UContainer class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtPage />
      </UContainer>
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

<style scoped>
.skip-link {
  position: absolute;
  left: 16px;
  top: -64px;
  z-index: 50;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--on-accent);
  background: var(--accent);
  border-radius: var(--r-pill);
  text-decoration: none;
}

.skip-link:focus {
  top: 16px;
}
</style>
