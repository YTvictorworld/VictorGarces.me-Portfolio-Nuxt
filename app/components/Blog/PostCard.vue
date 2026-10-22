<script setup lang="ts">
defineProps<{
  title: string
  description: string
  date: string | Date
  minRead?: number
  href: string
}>()

const { t, localeProperties } = useI18n()
</script>

<template>
  <article class="card post">
    <time
      class="mono"
      :datetime="new Date(date).toISOString().slice(0, 10)"
    >{{ formatDate(date, localeProperties.language) }}</time>
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
    <span
      class="link-accent read"
      aria-hidden="true"
    >{{ minRead ? t('home.readMin', { min: minRead }) : t('blog.readPost') }}</span>
  </article>
</template>

<style scoped>
.post {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 250px;
  padding: 24px;
  transition: transform var(--t-card) var(--ease-out-quart), border-color var(--t-card) var(--ease-out-quart);
}

/* Hover only where it can end: on touch it would stick after a tap */
@media (hover: hover) {
  .post:hover {
    transform: translateY(-2px);
    border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  }
}

/* Keyboard focus gets the hover treatment, and the ring goes around the card the link covers */
.post:has(.stretched:focus-visible) {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.post:has(.stretched:focus-visible) .stretched:focus-visible {
  outline: none;
}

.title {
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.01em;
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
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.read {
  margin-top: auto;
}
</style>
