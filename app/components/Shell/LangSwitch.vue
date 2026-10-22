<script setup lang="ts">
withDefaults(defineProps<{
  /** Smaller padding for the mobile header */
  compact?: boolean
}>(), { compact: false })

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const codes = computed(() => locales.value.map(l => l.code))
const other = computed(() => codes.value.find(code => code !== locale.value) ?? 'en')
</script>

<template>
  <NuxtLink
    :to="switchLocalePath(other)"
    :hreflang="other"
    class="lang"
    :class="{ 'lang--compact': compact }"
  >
    <!-- Visible codes stay in the accessible name (label in name), then the description -->
    <span>
      <template
        v-for="(code, index) in codes"
        :key="code"
      >
        <span v-if="index > 0"> / </span>
        <span :class="{ current: code === locale }">{{ code.toUpperCase() }}</span>
      </template>
    </span>
    <span class="sr-only">, {{ t('nav.switchLocale') }}</span>
  </NuxtLink>
</template>

<style scoped>
.lang {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: none;
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1;
  color: var(--muted);
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--surface);
  transition: color var(--t-micro) var(--ease-out), border-color var(--t-micro) var(--ease-out);
}

[data-mode='night'] .lang {
  background: transparent;
}

.lang--compact {
  padding: 8px 10px;
}

/* The compact pill is about 30px tall and only shown on touch layouts: grow the target to 44px */
.lang--compact::before {
  content: '';
  position: absolute;
  inset: min(0px, calc(50% - 22px)) 0;
}

.lang:hover {
  color: var(--text);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.current {
  color: var(--text);
}
</style>
