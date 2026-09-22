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
</script>

<template>
  <section
    class="hero"
    aria-labelledby="hero-title"
  >
    <!-- DESIGN: static composition until the procedural moon stage lands in M10 -->
    <ShellPlaceholder
      source="moon + floating frames · TresJS · M10"
      class="stage"
    >
      <div
        class="scene"
        role="img"
        :aria-label="t('home.nightStage')"
      >
        <span class="glow glow--wide" />
        <span class="glow glow--core" />
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
