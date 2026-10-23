<script setup lang="ts">
/** Horizontal post card for the Journal (F-Home-Film): cover left, date + label, title, excerpt. */
defineProps<{
  title: string
  description: string
  date: string | Date
  label?: string
  href: string
  cover?: { src: string, alt: string }
}>()

const { localeProperties } = useI18n()
</script>

<template>
  <article class="card entry">
    <NuxtImg
      v-if="cover"
      :src="cover.src"
      :alt="cover.alt"
      class="cover"
      width="400"
      height="220"
      sizes="(max-width: 767px) 40vw, 200px"
      loading="lazy"
    />
    <span
      v-else
      class="cover cover--empty"
      aria-hidden="true"
    />
    <div class="text">
      <p class="meta mono">
        <time :datetime="new Date(date).toISOString().slice(0, 10)">{{ formatDate(date, localeProperties.language) }}</time><template v-if="label">
          · {{ label }}
        </template>
      </p>
      <h3 class="title">
        <NuxtLink
          :to="href"
          class="stretched"
        >
          {{ title }}
        </NuxtLink>
      </h3>
      <p class="excerpt">
        {{ description }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.entry {
  position: relative;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 20px;
  transition: border-color var(--t-card) var(--ease-out-quart);
}

/* Hover only where it can end: on touch it would stick after a tap */
@media (hover: hover) {
  .entry:hover {
    border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  }
}

.cover {
  display: block;
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: var(--r-media);
}

.cover--empty {
  background: var(--track);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.meta {
  margin: 0;
  font-size: 11px;
}

.title {
  font-size: 24px;
  line-height: 1.15;
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

.excerpt {
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .entry {
    grid-template-columns: 110px minmax(0, 1fr);
  }

  .cover {
    height: 84px;
  }

  .title {
    font-size: 19px;
  }
}
</style>
