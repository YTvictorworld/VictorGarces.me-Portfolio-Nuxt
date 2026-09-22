<script setup lang="ts">
import type { Mode } from '~/utils/mode'

interface SideCopy {
  eyebrow?: string
  note?: string
  title?: string
  lead?: string
}

/**
 * First visit (F-Landing): two sides and one Enter button. Hovering (mouse), focusing (keyboard)
 * or tapping (touch) a side selects it, and the selection sticks when the pointer leaves.
 * Activating the selected side, or Enter, stores the mode and opens that home with the circle
 * transition. The cards stay real links, so without JavaScript they still navigate.
 */
defineProps<{
  day: SideCopy
  night: SideCopy
  dayHref: string
  nightHref: string
  /** Title of the film previewed on the night side */
  filmTitle?: string
}>()

const { t } = useI18n()
const { enter } = useModeSwitch()

const selected = ref<Mode | null>(null)
const button = ref<HTMLElement | null>(null)
const entering = ref(false)

const label = computed(() => selected.value === 'night'
  ? t('landing.enterNight')
  : selected.value === 'day' ? t('landing.enterDay') : t('landing.enter'))

// Screen readers activate a card without hovering it first, so the first activation says what happened
const announcement = computed(() => selected.value ? `${label.value}. ${t('landing.selected')}` : '')

function centerOf(el: Element | null) {
  if (!el) return undefined
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

async function go(side: Mode) {
  if (entering.value) return
  entering.value = true
  try {
    await enter(side, centerOf(button.value))
  } finally {
    entering.value = false
  }
}

function onPointerEnter(event: PointerEvent, side: Mode) {
  if (event.pointerType === 'mouse') selected.value = side
}

function onCardClick(event: MouseEvent, side: Mode) {
  // Cmd/ctrl opens a tab, shift a window, alt downloads: leave those to the real href
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  if (selected.value !== side) {
    selected.value = side
    return
  }
  go(side)
}
</script>

<template>
  <div class="split">
    <h1 class="sr-only">
      {{ t('landing.heading') }}
    </h1>

    <a
      :href="dayHref"
      class="side side--day"
      data-mode="day"
      :class="{ selected: selected === 'day' }"
      @pointerenter="onPointerEnter($event, 'day')"
      @focus="selected = 'day'"
      @click="onCardClick($event, 'day')"
    >
      <span class="top">
        <span class="eyebrow eyebrow--accent">{{ day.eyebrow }}</span>
        <span class="mono">{{ day.note }}</span>
      </span>
      <span class="body">
        <svg
          class="layers"
          viewBox="0 0 220 180"
          aria-hidden="true"
        >
          <rect
            class="layer layer--raised"
            x="20"
            y="118"
            width="150"
            height="44"
            rx="12"
          />
          <rect
            class="layer"
            x="35"
            y="78"
            width="150"
            height="44"
            rx="12"
          />
          <rect
            class="layer"
            x="50"
            y="38"
            width="150"
            height="44"
            rx="12"
          />
          <rect
            class="fill"
            x="65"
            y="6"
            width="150"
            height="16"
            rx="8"
          />
          <rect
            class="fill"
            x="62"
            y="50"
            width="40"
            height="20"
            rx="6"
            opacity="0.5"
          />
          <rect
            class="fill"
            x="108"
            y="50"
            width="40"
            height="20"
            rx="6"
            opacity="0.3"
          />
          <rect
            class="line"
            x="47"
            y="90"
            width="90"
            height="8"
            rx="4"
          />
          <rect
            class="line"
            x="47"
            y="104"
            width="60"
            height="8"
            rx="4"
          />
        </svg>
        <span class="title display">{{ day.title }}</span>
        <span class="lead">{{ day.lead }}</span>
      </span>
    </a>

    <a
      :href="nightHref"
      class="side side--night"
      data-mode="night"
      :class="{ selected: selected === 'night' }"
      @pointerenter="onPointerEnter($event, 'night')"
      @focus="selected = 'night'"
      @click="onCardClick($event, 'night')"
    >
      <span class="top">
        <span class="eyebrow eyebrow--accent">{{ night.eyebrow }}</span>
        <span class="mono">{{ night.note }}</span>
      </span>
      <span class="body">
        <!-- DESIGN: the muted preview loop plays here once the film is in the pipeline -->
        <ShellPlaceholder
          source="media manifest · preview.mp4"
          class="still"
          as="span"
        >
          <FilmRoomArt :opacity="0.6" />
          <span
            v-if="filmTitle"
            class="still-label mono"
          >{{ t('landing.mutedLoop') }} · {{ filmTitle }}</span>
        </ShellPlaceholder>
        <span class="title display">{{ night.title }}</span>
        <span class="lead">{{ night.lead }}</span>
      </span>
    </a>

    <div
      class="enter-wrap"
      :data-mode="selected ?? 'day'"
    >
      <button
        ref="button"
        type="button"
        class="enter"
        :class="{ chosen: selected }"
        :disabled="entering"
        @click="go(selected ?? 'day')"
      >
        {{ label }}
        <UiArrow />
      </button>
    </div>
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
  </div>
</template>

<style scoped>
.split {
  /* The landing is day, so the focus ring keeps the day accent even inside the night card */
  --ring: var(--accent);
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  min-height: calc(100dvh - var(--header-h));
  padding: 0 40px 40px;
}

.side:focus-visible,
.enter:focus-visible {
  outline: 2px solid var(--ring);
}

.side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  /* The bottom padding leaves room for the Enter button between the two cards */
  padding: 48px 48px 136px;
  color: var(--text);
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-landing);
  outline-offset: 4px;
  transition: border-color var(--t-micro) var(--ease-out), transform var(--t-card) var(--ease-out-quart);
}

.side--night {
  background: var(--bg);
}

.side.selected {
  border-color: var(--accent);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layers {
  width: 220px;
  height: 180px;
}

.layer {
  fill: var(--surface);
  stroke: var(--accent);
  stroke-width: 1.5;
}

.layer--raised {
  fill: var(--raised);
}

.fill {
  fill: var(--accent);
}

.line {
  fill: var(--border);
}

.still {
  position: relative;
  display: block;
  width: min(320px, 100%);
  height: 134px;
  overflow: hidden;
  background: var(--surface);
  border-radius: var(--r-media-lg);
}

.still :deep(.room) {
  position: absolute;
  inset: 0;
}

.still-label {
  position: absolute;
  left: 14px;
  bottom: 12px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.title {
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.03em;
}

.side--night .title {
  font-size: 64px;
  letter-spacing: -0.02em;
}

.lead {
  max-width: 440px;
  font-size: 18px;
  line-height: 1.55;
  color: var(--muted);
}

.enter-wrap {
  position: absolute;
  left: 50%;
  bottom: 76px;
  transform: translateX(-50%);
}

.enter {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 32px;
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 700;
  color: var(--bg);
  background: var(--text);
  border: 0;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-float);
  cursor: pointer;
  transition: background-color var(--t-micro) var(--ease-out), color var(--t-micro) var(--ease-out);
}

.enter.chosen {
  color: var(--on-accent);
  background: var(--accent);
}

.enter:hover :deep(.arrow) {
  transform: translateX(4px);
}

.enter :deep(.arrow) {
  width: 18px;
  height: 18px;
}

@media (max-width: 1023px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 0 var(--gutter) 104px;
  }

  .side {
    gap: 24px;
    padding: 28px;
  }

  .title,
  .side--night .title {
    font-size: 42px;
  }

  .lead {
    font-size: 16px;
  }

  /* On phones the button waits at the bottom of the screen */
  .enter-wrap {
    position: fixed;
    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    z-index: 20;
  }
}

@media (max-width: 767px) {
  .top {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .layers {
    width: 160px;
    height: 130px;
  }
}
</style>
