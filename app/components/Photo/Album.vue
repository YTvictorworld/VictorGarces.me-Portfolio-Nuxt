<script setup lang="ts">
import type { Album } from '~/composables/useMediaManifest'

/**
 * One album as a small fan of its first photos, cover in front. Each sheet carries its photo id
 * in data-flip-id, which is how the page flies it into the open album's grid and back.
 */
const props = defineProps<{ album: Album }>()
defineEmits<{ open: [] }>()

const { t, locale } = useI18n()

/** The album's photos start with its cover */
const sheets = computed(() => props.album.photos.slice(0, 3))
const date = computed(() => formatAlbumDate(props.album.date, locale.value))
</script>

<template>
  <button
    type="button"
    class="album"
    :data-album="album.id"
    :aria-label="t('film.albums.openAlbum', { title: album.title, n: album.photos.length })"
    @click="$emit('open')"
  >
    <span
      class="fan"
      :data-count="sheets.length"
    >
      <!-- Back to front, so the cover is painted last -->
      <span
        v-for="(photo, place) in [...sheets].reverse()"
        :key="photo"
        class="sheet"
        :class="`sheet--${sheets.length - 1 - place}`"
        :data-flip-id="photo"
      >
        <MediaFilmImage
          :id="photo"
          sizes="(max-width: 767px) 45vw, 18vw"
          decorative
        />
      </span>
    </span>
    <span class="meta">
      <span class="title display">{{ album.title }}</span>
      <span class="detail mono">
        <template v-if="date">{{ date }} · </template>{{ t('home.photos', { n: album.photos.length }) }}
      </span>
    </span>
  </button>
</template>

<style scoped>
.album {
  display: block;
  width: 100%;
  padding: 0;
  color: inherit;
  text-align: left;
  background: none;
  border: 0;
  cursor: pointer;
}

/* The fan: sheets overlap tightly, the two behind tilted out to either side */
.fan {
  position: relative;
  display: block;
  aspect-ratio: 5 / 4;
}

.sheet {
  position: absolute;
  top: 6%;
  left: 50%;
  width: 56%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: var(--r-media);
  box-shadow: var(--shadow-float);
  transform: translateX(-50%) rotate(0deg);
  transition: transform var(--t-card) var(--ease-out-quart);
}

.sheet :deep(.film-image) {
  width: 100%;
  height: 100%;
}

.sheet--1 {
  transform: translateX(-74%) rotate(-7deg);
}

.sheet--2 {
  transform: translateX(-26%) rotate(7deg);
}

/* Two sheets: one each side of the middle */
.fan[data-count="2"] .sheet--0 {
  transform: translateX(-38%) rotate(3deg);
}

.fan[data-count="2"] .sheet--1 {
  transform: translateX(-62%) rotate(-5deg);
}

.album:hover .sheet--0,
.album:focus-visible .sheet--0 {
  transform: translateX(-50%) translateY(-4%) scale(1.03);
}

.album:hover .sheet--1,
.album:focus-visible .sheet--1 {
  transform: translateX(-86%) rotate(-11deg);
}

.album:hover .sheet--2,
.album:focus-visible .sheet--2 {
  transform: translateX(-14%) rotate(11deg);
}

.album:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 6px;
  border-radius: var(--r-card);
}

.meta {
  display: block;
  margin-top: 10px;
  text-align: center;
}

.title {
  display: block;
  font-size: 20px;
  line-height: 1.2;
}

.detail {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--muted);
}
</style>
