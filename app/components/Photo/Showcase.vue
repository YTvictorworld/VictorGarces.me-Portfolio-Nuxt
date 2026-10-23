<script setup lang="ts">
/**
 * The photography page's opening: the selected photographs on a line that recedes into the
 * page, drifting slowly towards the viewer. The receding line is CSS and is the prerendered,
 * touch and reduced-motion state; the drift is added on top where motion is welcome.
 */
const props = defineProps<{
  /** Manifest ids, in the order they should come forward */
  photos: string[]
  label: string
}>()

const emit = defineEmits<{ open: [index: number] }>()

const { t } = useI18n()
const media = useMediaManifest()

/** Fewer photos than this repeat, so the line always reaches the back of the stage */
const MIN_SLOTS = 8
/** Slots that come forward per second */
const SPEED = 0.22
const MOTION_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

const slots = computed(() => {
  if (!props.photos.length) return []
  const count = Math.max(props.photos.length, MIN_SLOTS)
  return Array.from({ length: count }, (_, slot) => ({
    slot,
    id: props.photos[slot % props.photos.length]!,
    index: slot % props.photos.length,
    // A repeat is decoration: one button per photo reaches the keyboard and screen readers
    repeat: slot >= props.photos.length
  }))
})

const section = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)

/**
 * As the page scrolls the showcase rises a little faster than the page and fades, gone by the
 * time it passes under the header: the same exit the home heroes make. The stage carries it,
 * not the line, because opacity on the line itself would flatten its 3D.
 */
useScrollScene(section, ({ gsap, root, headerOffset }) => {
  gsap.to(root.querySelector('.stage'), {
    yPercent: -14,
    scale: 0.96,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: root, start: 0, end: () => `bottom ${headerOffset()}px`, scrub: 0.6 }
  })
})
let cleanup: (() => void) | undefined
let unmounted = false

onBeforeUnmount(() => {
  unmounted = true
  cleanup?.()
})

onMounted(async () => {
  const root = stage.value
  if (!root || !window.matchMedia(MOTION_QUERY).matches) return

  const { gsap } = await loadGsap()
  if (unmounted) return
  const items = [...root.querySelectorAll<HTMLElement>('.slot')]
  const total = items.length
  const speed = { value: SPEED }
  let offset = 0
  let visible = true

  const observer = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting))
  observer.observe(root)

  // Every slot reads its place on the line from --p; the transform and the fade are CSS
  const tick = (_: number, deltaMs: number) => {
    if (!visible || document.hidden) return
    offset = (offset + (speed.value * deltaMs) / 1000) % total
    for (const [slot, item] of items.entries()) {
      let place = (slot - offset + total) % total
      // The front slot slides out to the left and comes back in at the far end
      if (place > total - 1) place -= total
      item.style.setProperty('--p', place.toFixed(4))
    }
  }

  const mm = gsap.matchMedia(root)
  mm.add(MOTION_QUERY, () => {
    gsap.ticker.add(tick)
    const slow = () => gsap.to(speed, { value: SPEED * 0.15, duration: 0.6, ease: 'power2.out' })
    const resume = () => gsap.to(speed, { value: SPEED, duration: 0.9, ease: 'power2.inOut' })
    root.addEventListener('pointerenter', slow)
    root.addEventListener('pointerleave', resume)
    root.addEventListener('focusin', slow)
    root.addEventListener('focusout', resume)
    return () => {
      gsap.ticker.remove(tick)
      root.removeEventListener('pointerenter', slow)
      root.removeEventListener('pointerleave', resume)
      root.removeEventListener('focusin', slow)
      root.removeEventListener('focusout', resume)
      for (const item of items) item.style.removeProperty('--p')
    }
  })

  cleanup = () => {
    observer.disconnect()
    mm.revert()
  }
})
</script>

<template>
  <section
    v-if="slots.length"
    ref="section"
    class="showcase"
    :aria-label="label"
  >
    <div
      ref="stage"
      class="stage"
    >
      <ul
        class="line"
        :style="{ '--n': slots.length }"
      >
        <li
          v-for="item in slots"
          :key="item.slot"
          class="slot"
          :style="{ '--p': item.slot }"
          :aria-hidden="item.repeat || undefined"
        >
          <span
            class="number mono"
            aria-hidden="true"
          >{{ String(item.index + 1).padStart(2, '0') }}</span>
          <button
            type="button"
            class="card"
            :tabindex="item.repeat ? -1 : undefined"
            :aria-label="t('page.openPhotoNamed', { n: item.index + 1, total: photos.length, alt: media.alt(item.id) })"
            @click="emit('open', item.index)"
          >
            <MediaFilmImage
              :id="item.id"
              sizes="(max-width: 767px) 60vw, 20vw"
              :priority="item.slot < 3"
              decorative
            />
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  padding: var(--section) 0 0;
  overflow: hidden;
}

/* Touch and small screens: a plain row that scrolls sideways */
.line {
  display: flex;
  gap: 12px;
  margin: 0;
  padding: 0 var(--gutter) 8px;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.slot {
  position: relative;
  flex: none;
  width: 60vw;
  scroll-snap-align: start;
}

.number {
  display: block;
  margin-bottom: 6px;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--muted);
}

.card {
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: none;
  border: 0;
  border-radius: var(--r-media);
  cursor: zoom-in;
  aspect-ratio: 3 / 4;
  box-shadow: var(--shadow-float);
}

.card :deep(.film-image) {
  width: 100%;
  height: 100%;
}

.card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

/* From tablet up: the line recedes. --p is the place on it, 0 at the front */
@media (min-width: 768px) {
  .stage {
    position: relative;
    height: clamp(380px, 44vw, 600px);
    perspective: 1500px;
    perspective-origin: 50% 50%;
  }

  /*
   * The line is laid out around the middle of the stage: --mid is its halfway place, so the
   * front and the back sit either side of the centre. Depth shrinks the far end towards the
   * vanishing point, which would leave the line heavy on the left and low, so --lean and --rise
   * move it right and up by about what the back loses. Both measured at 1024, 1280 and 1440.
   */
  .line {
    --w: clamp(170px, 18vw, 270px);
    --step-x: 9.5vw;
    --step-y: 2.6vw;
    --mid: calc((var(--n) - 1.4) / 2);
    --lean: 12vw;
    --rise: 6vw;

    position: absolute;
    inset: 0;
    display: block;
    padding: 0;
    overflow: visible;
    transform-style: preserve-3d;
  }

  .slot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--w);
    /* A 3:4 card plus its number, centred on the stage's middle */
    margin: calc(var(--w) * -0.7) 0 0 calc(var(--w) / -2);
    transform:
      translate3d(
        calc((var(--p) - var(--mid)) * var(--step-x) + var(--lean)),
        calc((var(--p) - var(--mid)) * var(--step-y) * -1 - var(--rise)),
        calc(var(--p) * -150px)
      )
      rotateY(-22deg);
    transform-style: preserve-3d;
    /* Fades in at the back and out as it leaves past the front */
    opacity: clamp(0, min(1 + var(--p), (var(--n) - 1.4 - var(--p)) / 1.6), 1);
    will-change: transform, opacity;
  }

  .card {
    transition: transform var(--t-card) var(--ease-out-quart), box-shadow var(--t-card) var(--ease-out-quart);
  }

  .card:hover,
  .card:focus-visible {
    transform: translateZ(60px) scale(1.02);
  }
}
</style>
