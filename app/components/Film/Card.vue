<script setup lang="ts">
/** A film in the "more work" row (F-Home-Film): poster or stand-in art, title, format and year. */
const props = defineProps<{
  title: string
  subtitle: string
  href?: string | null
  poster?: string
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="card film"
    :class="{ linked: href }"
  >
    <div class="poster">
      <MediaFilmImage
        v-if="poster"
        :id="poster"
        sizes="(max-width: 767px) 100vw, 33vw"
        decorative
      />
      <FilmRoomArt v-else />
      <span
        v-if="href"
        class="play"
        aria-hidden="true"
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
        ><path
          d="M1 1l10 6-10 6z"
          fill="currentColor"
        /></svg>
      </span>
    </div>
    <h3 class="title">
      <NuxtLink
        v-if="href"
        :to="href"
        class="stretched"
        :aria-label="t('home.openFilm', { title: props.title })"
      >{{ title }}</NuxtLink>
      <template v-else>
        {{ title }}
      </template>
    </h3>
    <p class="subtitle">
      {{ subtitle }}
    </p>
  </article>
</template>

<style scoped>
.film {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  transition: transform var(--t-card) var(--ease-out-quart), border-color var(--t-card) var(--ease-out-quart);
}

.linked:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.poster {
  position: relative;
  height: 150px;
  margin-bottom: 8px;
  overflow: hidden;
  background: var(--raised);
  border-radius: var(--r-media);
}

.poster :deep(.film-image),
.poster :deep(.room) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: var(--on-accent);
  background: var(--accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.title {
  padding: 0 4px;
  font-size: 26px;
}

.stretched {
  color: inherit;
  text-decoration: none;
}

.stretched::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.subtitle {
  margin: 0;
  padding: 0 4px;
  font-size: 13px;
  color: var(--muted);
}
</style>
