<script setup lang="ts">
import type { Mode } from '~/utils/mode'

/** "Looking for the film side?" (D-Work). Switches mode and opens that home. */
const props = defineProps<{ to: Mode }>()

const { t } = useI18n()
const { enter } = useModeSwitch()
const keys = computed(() => props.to === 'night' ? 'cross.toFilm' : 'cross.toDev')

function onClick(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  enter(props.to, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
}
</script>

<template>
  <section class="banner">
    <div class="text">
      <p class="title display">
        {{ t(`${keys}.title`) }}
      </p>
      <p class="lead">
        {{ t(`${keys}.lead`) }}
      </p>
    </div>
    <button
      type="button"
      class="btn btn--sm"
      @click="onClick"
    >
      {{ t(`${keys}.cta`) }} <UiArrow />
    </button>
  </section>
</template>

<style scoped>
.banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  margin: var(--section) var(--gutter) 0;
  padding: 24px 28px;
  background: var(--raised);
  border-radius: var(--r-stage);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  margin: 0;
  font-size: 22px;
}

.lead {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}
</style>
