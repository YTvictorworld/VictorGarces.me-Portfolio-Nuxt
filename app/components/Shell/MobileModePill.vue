<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="pill mode-pill">
    <span
      class="label label--day"
      aria-hidden="true"
    >{{ t('mode.pillDay') }}</span>
    <ShellModeToggle size="sm" />
    <span
      class="label label--night"
      aria-hidden="true"
    >{{ t('mode.night') }}</span>
  </div>
</template>

<style scoped>
.pill {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  z-index: 30;
  display: none;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-pill);
}

.label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  transition: color var(--t-micro) var(--ease-out);
}

[data-mode='day'] .label--day,
[data-mode='night'] .label--night {
  color: var(--accent);
}

@media (forced-colors: active) {
  [data-mode='day'] .label--day,
  [data-mode='night'] .label--night {
    text-decoration: underline;
  }
}

@media (max-width: 1023px) {
  .pill {
    display: flex;
  }
}
</style>

<!-- Unscoped: the rule hangs off <html>, and a scoped :global() keeps only that part -->
<style>
/* While a field has focus the pill would sit on the very thing being typed into, and on a phone
   on the keyboard's toolbar too. It comes back as soon as the field is left. */
html:has(:is(input, textarea, select):focus) .mode-pill {
  visibility: hidden;
  opacity: 0;
}
</style>
