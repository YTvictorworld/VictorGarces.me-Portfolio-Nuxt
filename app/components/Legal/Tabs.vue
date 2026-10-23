<script setup lang="ts">
/**
 * Privacy / Terms / Cookies (S-Legal). Drawn as spans in the artboard; they are real links here,
 * because all three pages exist. The entries come from useNav, which drops any that does not
 * resolve, so the row can never point at a 404.
 */
const { t } = useI18n()
const { legal, isActive } = useNav()
</script>

<template>
  <nav
    v-if="legal.length > 1"
    class="tabs"
    :aria-label="t('legal.tabs')"
  >
    <NuxtLink
      v-for="item in legal"
      :key="item.path"
      :to="item.to"
      class="pill"
      :class="{ active: isActive(item) }"
      :aria-current="isActive(item) ? 'page' : undefined"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px var(--gutter) 0;
}

/* The 44px touch target comes from the shared .pill rule in ui.css */
.pill {
  height: 38px;
  text-decoration: none;
}

.pill:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.active {
  font-weight: 600;
  color: var(--on-accent);
  background: var(--accent);
  border-color: var(--accent);
}
</style>
