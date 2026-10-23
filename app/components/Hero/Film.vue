<script setup lang="ts">
interface HeroCopy {
  eyebrow?: string
  title?: string
  lead?: string
  cta?: string
  cta2?: string
}

const props = defineProps<{
  copy: HeroCopy
  /** Label for the big frame, e.g. "¿Por qué no? · 2026" */
  filmLabel?: string
  /** Two manifest photos for the smaller frames */
  photos: string[]
  photosLabel?: string
  reelHref?: string | null
  filmsHref?: string | null
}>()

const { t } = useI18n()
const front = computed(() => props.photos[0])
const back = computed(() => props.photos[1])

const hero = ref<HTMLElement | null>(null)

/**
 * Night falls as you scroll: the hero holds still, the moon sinks below a horizon that draws
 * itself across the stage, the frames drift apart and dim, and the copy lifts away.
 */
useScrollScene(hero, ({ gsap, root, headerOffset }) => {
  const $ = (selector: string) => root.querySelectorAll(selector)
  gsap.set($('.horizon, .dusk'), { opacity: 1 })
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: () => `top ${headerOffset()}px`, end: '+=700', pin: true, scrub: 0.6 }
  })
    .from($('.horizon path'), { drawSVG: '50% 50%', duration: 0.5 }, 0)
    .from($('.dusk'), { opacity: 0, duration: 0.5 }, 0)
    .to($('.glow--core'), { yPercent: 190, duration: 1 }, 0)
    .to($('.glow--wide'), { yPercent: 55, opacity: 0.03, duration: 1 }, 0)
    .to($('.label'), { opacity: 0, duration: 0.2 }, 0)
    .to($('.frame--film'), { xPercent: -8, yPercent: -12, rotation: -3, opacity: 0.25, duration: 1 }, 0)
    .to($('.frame--mid'), { xPercent: 16, yPercent: 10, rotation: 4, opacity: 0.2, duration: 1 }, 0)
    .to($('.frame--small'), { xPercent: 8, yPercent: 60, rotation: 2, opacity: 0.1, duration: 1 }, 0)
    .to($('.copy'), { y: -48, opacity: 0, duration: 0.6 }, 0.4)
})
</script>

<template>
  <section
    ref="hero"
    class="hero"
    aria-labelledby="hero-title"
  >
    <!-- M10: SVG and CSS instead of TresJS (owner decision). The scroll scene lives in the
         script; this composition is its resting state. -->
    <ShellPlaceholder
      source="scroll scene · M10"
      class="stage"
    >
      <div
        class="scene"
        role="img"
        :aria-label="t('home.nightStage')"
      >
        <span class="glow glow--wide" />
        <span class="glow glow--core" />
        <!-- Below the horizon the moon fades into the night. Both are hidden at rest. -->
        <span class="dusk" />
        <svg
          class="horizon"
          viewBox="0 0 800 4"
          preserveAspectRatio="none"
          aria-hidden="true"
        ><path d="M0 2 H800" /></svg>
        <div class="frame frame--film">
          <FilmRoomArt />
        </div>
        <div
          v-if="front"
          class="frame frame--mid"
        >
          <MediaFilmImage
            :id="front"
            sizes="(max-width: 1023px) 60vw, 440px"
            decorative
            priority
          />
        </div>
        <div
          v-if="back"
          class="frame frame--small"
        >
          <MediaFilmImage
            :id="back"
            sizes="(max-width: 1023px) 45vw, 320px"
            decorative
          />
        </div>
        <span
          v-if="filmLabel"
          class="label label--film"
        >{{ filmLabel }}</span>
        <span
          v-if="photosLabel && front"
          class="label label--photos"
        >{{ photosLabel }}</span>
      </div>
    </ShellPlaceholder>

    <div class="copy">
      <p class="eyebrow eyebrow--accent">
        {{ copy.eyebrow }}
      </p>
      <h1
        id="hero-title"
        class="title"
      >
        {{ copy.title }}
      </h1>
      <p class="lead">
        {{ copy.lead }}
      </p>
      <div class="actions">
        <NuxtLink
          v-if="reelHref"
          :to="reelHref"
          class="btn btn--accent"
        >
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            aria-hidden="true"
          ><path
            d="M1 1l10 6-10 6z"
            fill="currentColor"
          /></svg>
          {{ copy.cta }}
        </NuxtLink>
        <NuxtLink
          :to="filmsHref ?? '#work'"
          class="btn"
        >
          {{ copy.cta2 }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 620px;
  padding: 72px var(--gutter) 40px;
  overflow: hidden;
}

.copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 600px;
}

.eyebrow {
  margin: 0;
}

.title {
  font-size: var(--h1-home);
  line-height: 0.98;
  letter-spacing: -0.02em;
}

.lead {
  max-width: 520px;
  margin: 0;
  font-size: 19px;
  line-height: 1.55;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* The stage sits behind the copy on the right, like the artboard (800 x 620 composition) */
.stage {
  position: absolute;
  top: 0;
  right: 0;
  width: min(800px, 58%);
  height: 620px;
}

.scene {
  position: relative;
  width: 100%;
  height: 100%;
}

.glow {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  pointer-events: none;
}

.glow--wide {
  left: 25%;
  top: -16%;
  width: 65%;
  opacity: 0.09;
}

.glow--core {
  left: 46.25%;
  top: 11.3%;
  width: 22.5%;
  opacity: 0.12;
}

.dusk {
  position: absolute;
  left: 0;
  right: 0;
  top: 62%;
  bottom: -10%;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--bg) 70%, transparent), var(--bg) 35%);
  opacity: 0;
  pointer-events: none;
}

.horizon {
  position: absolute;
  left: 0;
  top: 62%;
  width: 100%;
  height: 4px;
  overflow: visible;
  opacity: 0;
}

.horizon path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.frame {
  position: absolute;
  overflow: hidden;
  background: var(--surface);
}

.frame :deep(.film-image) {
  width: 100%;
  height: 100%;
}

.frame :deep(img) {
  object-position: 50% 20%;
}

.frame--film {
  left: 7.5%;
  top: 16.1%;
  width: 77.5%;
  aspect-ratio: 620 / 260;
  border-radius: var(--r-media-lg);
}

.frame--mid {
  left: 27.5%;
  top: 50%;
  width: 55%;
  aspect-ratio: 440 / 184;
  border-radius: var(--r-inner);
  opacity: 0.8;
}

.frame--small {
  left: 42.5%;
  top: 72.6%;
  width: 40%;
  aspect-ratio: 320 / 134;
  border-radius: var(--r-media);
  opacity: 0.6;
}

.label {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.label--film {
  left: 9.5%;
  top: 43.5%;
}

.label--photos {
  left: 29.5%;
  top: 76%;
  color: var(--text);
  text-shadow: 0 1px 8px var(--bg);
}

@media (max-width: 1023px) {
  .hero {
    display: flex;
    flex-direction: column-reverse;
    gap: 24px;
    min-height: 0;
    padding-top: 24px;
  }

  .stage {
    position: relative;
    width: 100%;
    height: auto;
    aspect-ratio: 800 / 560;
  }
}

@media (max-width: 767px) {
  /* Small stage: the labels would sit on top of the photos */
  .label {
    display: none;
  }

  .lead {
    font-size: 17px;
  }

  .actions .btn {
    flex: 1 1 auto;
  }
}
</style>
