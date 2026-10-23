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
    <!-- ScrollSmoother moves #smooth-content (plugins/smooth-scroll.client.ts). The header and
         the mode pill stay outside it: anything fixed or sticky inside a transformed element
         scrolls away with it. Without a smoother these are two plain divs. -->
    <div id="smooth-wrapper">
      <div id="smooth-content">
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
      </div>
    </div>
    <ShellMobileModePill />
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
  </div>
</template>

<!-- Unscoped: both rules hang off <html>, and Vue would keep only the :global() part of a
     scoped selector -->
<style>
/* Under ScrollSmoother the header sits outside the moving content, where sticky has nothing
   to stick to, so it turns fixed and the content makes room for it */
html[data-smooth] #site-header {
  position: fixed;
  left: 0;
  right: 0;
}

html[data-smooth] #smooth-content {
  padding-top: var(--header-h);
}
</style>
