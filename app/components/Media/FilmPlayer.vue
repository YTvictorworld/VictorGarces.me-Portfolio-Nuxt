<script setup lang="ts">
/**
 * Video from the manifest, played with our own controls (media-chrome + hls-video-element),
 * so there is no third-party branding or tracking. Until the pipeline has the file, the entry
 * is `status: pending` and this shows the poster with a "coming soon" note instead.
 * The player code loads on the client only, after the poster has painted.
 */
const props = withDefaults(defineProps<{
  /** Video id in content/media/manifest.json */
  id?: string
  /** Manifest photo used as the poster */
  poster?: string
  title?: string
  /** Eager, high-priority poster, for the player that is the page's LCP */
  priority?: boolean
}>(), { priority: false })

const { t, te } = useI18n()
// The track menu shows a language name, not the raw code from the manifest
const trackLabel = (lang: string) => te(`lang.${lang}`) ? t(`lang.${lang}`) : lang
const media = useMediaManifest()
const video = computed(() => props.id ? media.video(props.id) : undefined)
const ready = computed(() => Boolean(video.value?.ready))
const loaded = ref(false)

onMounted(async () => {
  if (!ready.value) return
  // Custom elements, not Vue components (see vue.compilerOptions in nuxt.config)
  await Promise.all([import('media-chrome'), import('hls-video-element')])
  loaded.value = true
})
</script>

<template>
  <div class="player">
    <template v-if="ready && loaded">
      <media-controller :aria-label="title">
        <!-- A real slot attribute: media-controller is a custom element, not a Vue component,
             so it reads slot="media" from the DOM. A Vue <template #media> never reaches it. -->
        <!-- eslint-disable vue/no-deprecated-slot-attribute -->
        <hls-video
          slot="media"
          :src="video?.hlsUrl"
          :poster="video?.posterUrl"
          :title="title"
          crossorigin
        >
          <track
            v-for="caption in video?.captions"
            :key="caption.lang"
            kind="subtitles"
            :src="caption.src"
            :srclang="caption.lang"
            :label="trackLabel(caption.lang)"
          >
        </hls-video>
        <!-- eslint-enable vue/no-deprecated-slot-attribute -->
        <media-control-bar>
          <media-play-button />
          <media-time-display showduration />
          <media-time-range />
          <!-- Only offered when the film actually ships a subtitle track -->
          <media-captions-button v-if="video?.captions?.length" />
          <media-mute-button />
          <media-fullscreen-button />
        </media-control-bar>
      </media-controller>
    </template>

    <template v-else>
      <MediaFilmImage
        v-if="poster"
        :id="poster"
        sizes="(max-width: 1023px) 100vw, 60vw"
        decorative
        :priority="priority"
      />
      <FilmRoomArt v-else />
      <span
        v-if="!ready"
        class="soon mono"
      >{{ t('home.filmSoon') }}</span>
      <span
        v-else
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
    </template>
  </div>
</template>

<style scoped>
.player {
  position: relative;
  overflow: hidden;
  background: var(--surface);
  border-radius: var(--r-card);
}

.player :deep(.film-image),
.player :deep(.room),
.player media-controller {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

media-controller {
  --media-primary-color: var(--text);
  --media-secondary-color: var(--surface);
  --media-control-hover-background: var(--raised);
  --media-range-track-height: 3px;
  --media-range-bar-color: var(--accent);
}

.soon {
  position: absolute;
  left: 20px;
  bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
}
</style>
