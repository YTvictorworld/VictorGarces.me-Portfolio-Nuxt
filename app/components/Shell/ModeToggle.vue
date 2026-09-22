<script setup lang="ts">
/**
 * Day/night switch (F-Sistema): a pill with a knob, left for day and right for night.
 * Position, colors and label all come from CSS on [data-mode], so the prerendered markup
 * is identical in both modes and hydration never disagrees with the pre-paint script.
 */
withDefaults(defineProps<{
  /** md: 72x36 header toggle; sm: 64x32 inside the mobile pill */
  size?: 'md' | 'sm'
}>(), { size: 'md' })

const { t } = useI18n()
const { toggle } = useModeSwitch()

function onClick(event: MouseEvent) {
  const knob = (event.currentTarget as HTMLElement).querySelector('.knob')
  const rect = (knob ?? event.currentTarget as HTMLElement).getBoundingClientRect()
  toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
}
</script>

<template>
  <button
    type="button"
    class="toggle"
    :class="`toggle--${size}`"
    @click="onClick"
  >
    <span class="knob" />
    <span class="sr-only day-only">{{ t('mode.toNight') }}</span>
    <span class="sr-only night-only">{{ t('mode.toDay') }}</span>
  </button>
</template>

<style scoped>
.toggle {
  --w: 72px;
  --h: 36px;
  --knob: 28px;
  position: relative;
  display: block;
  flex: none;
  width: var(--w);
  height: var(--h);
  border-radius: var(--r-pill);
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color var(--t-micro) var(--ease-out);
}

.toggle--sm {
  --w: 64px;
  --h: 32px;
  --knob: 24px;
  background: var(--bg);
}

.toggle:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.knob {
  position: absolute;
  left: 3px;
  top: 50%;
  width: var(--knob);
  height: var(--knob);
  border-radius: 50%;
  background: var(--accent);
  transform: translate(0, -50%);
  transition: transform var(--t-micro) var(--ease-out), background-color var(--t-micro) var(--ease-out);
}

/* 1px borders on each side, 3px inset on each end */
[data-mode='night'] .knob {
  transform: translate(calc(var(--w) - var(--knob) - 8px), -50%);
}

/* High contrast replaces backgrounds with Canvas; a system color keeps the knob visible */
@media (forced-colors: active) {
  .knob {
    background: ButtonText;
  }
}
</style>
