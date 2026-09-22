<script setup lang="ts">
interface Film {
  title: string
  kind: 'short' | 'reel' | 'client' | 'vertical'
  year: string
  runtime: string
  synopsis?: string
  logline?: string
  camera?: string
  credits?: Array<{ role: string, name: string }>
  video?: { id: string }
  vertical?: { runtime?: string }
}

const props = defineProps<{
  film: Film
  eyebrow?: string
  title?: string
  cta?: string
  cta2?: string
  /** Film page, once /film/films exists */
  href?: string | null
}>()

const { t } = useI18n()
const media = useMediaManifest()
const video = computed(() => props.film.video ? media.video(props.film.video.id) : undefined)
const meta = computed(() => [t(`film.kind.${props.film.kind}`), props.film.year, props.film.runtime].join(' · '))
// Written by and Directed by first, like the artboard; Cast only when it is known
const credits = computed(() => (props.film.credits ?? []).slice(0, 2))
</script>

<template>
  <section
    id="work"
    class="section"
    aria-labelledby="now-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="now-title"
    />
    <div class="grid">
      <!-- DESIGN: the Media Chrome + HLS player lands in M4; until the film is in the pipeline the
           frame shows the room it was shot in and says the film is coming -->
      <ShellPlaceholder
        source="own player · Media Chrome + HLS · M4"
        class="screen"
      >
        <FilmRoomArt :opacity="0.45" />
        <span
          class="play"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="18"
            viewBox="0 0 12 14"
          ><path
            d="M1 1l10 6-10 6z"
            fill="currentColor"
          /></svg>
        </span>
        <span
          v-if="!video?.ready"
          class="soon mono"
        >{{ t('home.filmSoon') }}</span>
      </ShellPlaceholder>

      <div class="card details">
        <div class="top">
          <p class="eyebrow eyebrow--accent">
            {{ meta }}
          </p>
          <h3 class="film-title">
            {{ film.title }}
          </h3>
          <p class="synopsis">
            {{ film.synopsis ?? film.logline }}
          </p>
          <dl class="credits">
            <template
              v-for="credit in credits"
              :key="credit.role"
            >
              <dt>{{ credit.role }}</dt>
              <dd>{{ credit.name }}</dd>
            </template>
            <template v-if="film.camera">
              <dt>{{ t('film.camera') }}</dt>
              <dd>{{ film.camera }}</dd>
            </template>
            <template v-if="film.vertical?.runtime">
              <dt>{{ t('film.alsoAs') }}</dt>
              <dd>{{ t('film.verticalCut', { runtime: film.vertical.runtime }) }}</dd>
            </template>
          </dl>
        </div>
        <div
          v-if="href"
          class="actions"
        >
          <NuxtLink
            :to="href"
            class="btn btn--accent btn--md"
          >
            {{ cta }}
          </NuxtLink>
          <NuxtLink
            v-if="film.vertical"
            :to="`${href}#vertical`"
            class="btn btn--md"
          >
            {{ cta2 }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.screen {
  position: relative;
  min-height: 440px;
  overflow: hidden;
  background: var(--surface);
  border-radius: var(--r-card);
}

.screen :deep(.room) {
  position: absolute;
  inset: 0;
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  color: var(--on-accent);
  background: var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.85;
}

.soon {
  position: absolute;
  left: 20px;
  bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
}

.top {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.eyebrow {
  margin: 0;
  font-size: 11px;
}

.film-title {
  font-size: 44px;
  line-height: 1;
}

.synopsis {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--muted);
}

.credits {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 6px 12px;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

dt {
  color: var(--muted);
}

dd {
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .screen {
    min-height: 0;
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 767px) {
  .details {
    padding: 20px;
  }

  .film-title {
    font-size: 34px;
  }
}
</style>
