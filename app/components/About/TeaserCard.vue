<script setup lang="ts">
interface About {
  headline: string
  teaser: string
  portrait?: { src: string, alt: string }
  kit?: Array<{ label: string, value: string }>
}

defineProps<{
  about: About
  eyebrow?: string
  cta?: string
  href?: string | null
}>()
</script>

<template>
  <section
    id="about"
    class="card about"
    aria-labelledby="about-title"
  >
    <div class="top">
      <ShellPlaceholder
        v-if="!about.portrait"
        source="about · portrait-film.avif"
        class="portrait"
        empty
      />
      <NuxtImg
        v-else
        :src="about.portrait.src"
        :alt="about.portrait.alt"
        class="portrait"
        width="96"
        height="96"
        loading="lazy"
      />
      <div class="heading">
        <p class="eyebrow">
          {{ eyebrow }}
        </p>
        <h2
          id="about-title"
          class="headline"
        >
          {{ about.headline }}
        </h2>
      </div>
    </div>
    <p class="teaser">
      {{ about.teaser }}
    </p>
    <ul
      v-if="about.kit?.length"
      class="kit"
    >
      <li
        v-for="item in about.kit"
        :key="item.label"
        class="chip"
      >
        {{ item.value }}
      </li>
    </ul>
    <NuxtLink
      v-if="href"
      :to="href"
      class="link-accent"
    >
      {{ cta }} →
    </NuxtLink>
  </section>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
}

.top {
  display: flex;
  align-items: center;
  gap: 16px;
}

.portrait {
  flex: 0 0 96px;
  width: 96px;
  height: 96px;
  object-fit: cover;
  background: var(--raised);
  border-radius: 50%;
}

.heading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eyebrow {
  margin: 0;
  font-size: 11px;
}

.headline {
  font-size: 24px;
  line-height: 1.15;
}

.teaser {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.kit {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
