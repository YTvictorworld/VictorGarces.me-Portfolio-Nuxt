<script setup lang="ts">
/**
 * "More work" tile (F-Home-Dev, F-Home-Film): three ghost cards stacked, a title and an arrow;
 * the whole tile links to the full index. Hover fans the stack out and slides the arrow.
 */
defineProps<{
  eyebrow?: string
  title?: string
  href: string
  /** Accessible name for the link */
  label: string
  /** Entries not shown on the home ("N more"); hidden when 0 */
  count?: number
}>()

const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="href"
    class="tile"
    :aria-label="label"
  >
    <span
      class="stack"
      aria-hidden="true"
    >
      <span class="ghost ghost--back" />
      <span class="ghost ghost--mid" />
      <span class="ghost ghost--front">
        <span
          v-if="count"
          class="mono"
        >{{ t('home.more', { n: count }) }}</span>
      </span>
    </span>
    <span class="text">
      <span class="eyebrow eyebrow--accent">{{ eyebrow }}</span>
      <span class="title display">{{ title }}</span>
    </span>
    <span class="go">
      <UiArrow />
    </span>
  </NuxtLink>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: 470px;
  padding: 16px;
  overflow: hidden;
  color: var(--text);
  text-decoration: none;
  background: var(--raised);
  border-radius: var(--r-card);
}

.stack {
  position: relative;
  display: block;
  height: 200px;
}

.ghost {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-media);
  transform-origin: 50% 100%;
  transition: transform var(--t-card) var(--ease-out-quart);
}

.ghost--back {
  left: 44px;
  right: 0;
  top: 0;
  opacity: 0.5;
}

.ghost--mid {
  left: 22px;
  right: 12px;
  top: 22px;
  opacity: 0.75;
}

.ghost--front {
  left: 0;
  right: 24px;
  top: 44px;
}

.tile:hover .ghost--back {
  transform: rotate(4deg);
}

.tile:hover .ghost--front {
  transform: rotate(-4deg);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 22px;
  line-height: 1.2;
}

.go {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--on-accent);
  background: var(--accent);
  border-radius: 50%;
}

.go :deep(.arrow) {
  width: 18px;
  height: 18px;
}

.tile:hover .go :deep(.arrow) {
  transform: translateX(4px);
}

@media (max-width: 767px) {
  .tile {
    min-height: 0;
  }

  .stack {
    height: 150px;
  }
}
</style>
