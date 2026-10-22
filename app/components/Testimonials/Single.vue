<script setup lang="ts">
/**
 * One testimonial at a time (F-Home-Film): cross-fade, auto-advance every 8 s, paused on hover,
 * on focus, by the pause button and always under reduced motion. Dots are buttons.
 */
interface Testimonial {
  quote: string
  name: string
  role: string
  context?: string
}

const props = defineProps<{
  entries: Testimonial[]
  eyebrow?: string
}>()

const { t } = useI18n()
const reducedMotion = usePreferredReducedMotion()

const index = ref(0)
const hovered = ref(false)
const focused = ref(false)
const paused = ref(false)

function go(step: number) {
  const count = props.entries.length
  index.value = (index.value + step + count) % count
}

const running = computed(() => props.entries.length > 1 && !hovered.value && !focused.value && !paused.value && reducedMotion.value !== 'reduce')
const { pause, resume } = useIntervalFn(() => go(1), 8000, { immediate: false })
watch(running, value => value ? resume() : pause())
onMounted(() => {
  if (running.value) resume()
})
</script>

<template>
  <section
    id="testimonials"
    class="single"
    :aria-label="eyebrow"
    aria-roledescription="carousel"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <p class="eyebrow">
      {{ eyebrow }}
    </p>
    <!-- Every slide sits in the same grid cell, so the stage is as tall as the longest quote and
         the controls below never jump on advance. Hidden slides use visibility, which also takes
         them out of the accessibility tree. -->
    <div
      class="stage"
      :aria-live="running ? 'off' : 'polite'"
      aria-atomic="true"
    >
      <figure
        v-for="(entry, i) in entries"
        :key="entry.name"
        class="slide"
        :class="{ current: i === index }"
        aria-roledescription="slide"
        :aria-label="`${i + 1} / ${entries.length}`"
      >
        <blockquote class="display">
          “{{ entry.quote }}”
        </blockquote>
        <figcaption><span translate="no">{{ entry.name }}</span> · {{ entry.context ?? entry.role }}</figcaption>
      </figure>
    </div>

    <div
      v-if="entries.length > 1"
      class="controls"
    >
      <button
        type="button"
        class="nav nav--prev"
        :aria-label="t('home.previous')"
        @click="go(-1)"
      >
        <UiArrow />
      </button>
      <div class="dots">
        <button
          v-for="(entry, i) in entries"
          :key="entry.name"
          type="button"
          class="dot"
          :class="{ active: i === index }"
          :aria-label="t('home.goTo', { n: i + 1 })"
          :aria-current="i === index ? 'true' : undefined"
          @click="index = i"
        />
      </div>
      <button
        type="button"
        class="nav nav--next"
        :aria-label="t('home.next')"
        @click="go(1)"
      >
        <UiArrow />
      </button>
      <button
        type="button"
        class="pause mono"
        @click="paused = !paused"
      >
        {{ paused ? t('home.resume') : t('home.pause') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.single {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin: var(--section) var(--gutter) 0;
  padding: 40px 64px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-stage);
}

.eyebrow {
  margin: 0;
}

.stage {
  display: grid;
  justify-items: center;
}

/* Fade out, then fade in, as the out-in transition this replaces did */
.slide {
  display: flex;
  flex-direction: column;
  gap: 18px;
  grid-area: 1 / 1;
  align-self: center;
  margin: 0;
  visibility: hidden;
  opacity: 0;
  transition: opacity var(--t-card) var(--ease-out), visibility 0s linear var(--t-card);
}

.slide.current {
  visibility: visible;
  opacity: 1;
  transition: opacity var(--t-card) var(--ease-out) var(--t-card), visibility 0s linear var(--t-card);
}

blockquote {
  max-width: 900px;
  margin: 0;
  font-size: clamp(22px, 2.2vw, 28px);
  line-height: 1.35;
}

figcaption {
  font-size: 14px;
  color: var(--muted);
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

.nav--prev :deep(.arrow) {
  transform: rotate(180deg);
}

/* Bars are 8px (24px when active) with 8px between them. Each button is a 16px slot, the bar
   plus half the gap on each side, so the targets tile the row without overlapping. The margins
   give back the half gap at the start and the active bar's extra 16px at the end, so the row
   keeps its old width. */
.dots {
  display: flex;
  margin-inline: -4px 12px;
}

/* Layout never changes: the active bar scales and the bars after it slide, both as transforms */
.dot {
  position: relative;
  flex: none;
  width: 16px;
  height: 44px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  transition: transform var(--t-micro) var(--ease-out);
}

.dot.active ~ .dot {
  transform: translateX(16px);
}

/* A 24px bar scaled to 8px. Percentage radii keep the 2px round ends once scaled. */
.dot::before {
  content: '';
  position: absolute;
  left: 4px;
  top: calc(50% - 2px);
  width: 24px;
  height: 4px;
  background: color-mix(in oklab, var(--text) 45%, var(--bg));
  border-radius: 25% / 50%;
  transform: scaleX(calc(1 / 3));
  transform-origin: left center;
  transition: transform var(--t-micro) var(--ease-out);
}

.dot.active::before {
  background: var(--accent);
  border-radius: var(--r-pill);
  transform: none;
}

.pause {
  position: relative;
  padding: 6px 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
}

@media (pointer: coarse) {
  .pause::before {
    content: '';
    position: absolute;
    inset: min(0px, calc(50% - 22px)) 0;
  }
}

@media (max-width: 767px) {
  .single {
    padding: 28px 20px;
    border-radius: var(--r-item);
  }

  blockquote {
    font-size: 19px;
  }
}
</style>
