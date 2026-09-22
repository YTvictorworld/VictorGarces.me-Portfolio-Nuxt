<script setup lang="ts">
const { t } = useI18n()
const { announcement } = useMode()
const route = useRoute()
// One NuxtPage for both layouts, so the page transition still plays across the boundary
const UContainer = resolveComponent('UContainer')
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
      <!-- Rebuilt pages set `fullBleed` and use the --gutter tokens; the rest keep the old
           container until M4 rebuilds them -->
      <component
        :is="route.meta.fullBleed ? 'div' : UContainer"
        :class="route.meta.fullBleed ? undefined : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'"
      >
        <NuxtPage />
      </component>
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
