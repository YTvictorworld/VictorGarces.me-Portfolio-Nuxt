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
const current = computed(() => props.entries[index.value])

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
    <div
      class="stage"
      :aria-live="running ? 'off' : 'polite'"
      aria-atomic="true"
    >
      <Transition
        name="fade"
        mode="out-in"
      >
        <figure
          v-if="current"
          :key="index"
          class="slide"
          aria-roledescription="slide"
          :aria-label="`${index + 1} / ${entries.length}`"
        >
          <blockquote class="display">
            “{{ current.quote }}”
          </blockquote>
          <figcaption>{{ current.name }} · {{ current.context ?? current.role }}</figcaption>
        </figure>
      </Transition>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
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

.dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 24px hit area around a 4px bar */
.dot {
  position: relative;
  width: 8px;
  height: 24px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  transition: width var(--t-micro) var(--ease-out);
}

.dot::before {
  content: '';
  position: absolute;
  inset: 10px 0;
  background: color-mix(in oklab, var(--text) 45%, var(--bg));
  border-radius: var(--r-pill);
}

.dot.active {
  width: 24px;
}

.dot.active::before {
  background: var(--accent);
}

.pause {
  padding: 6px 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
