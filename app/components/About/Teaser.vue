<script setup lang="ts">
interface About {
  headline: string
  teaser: string
  portrait?: { src: string, alt: string }
  stack?: Array<{ group: string, items: string[] }>
}

const props = defineProps<{
  about: About
  eyebrow?: string
  cta?: string
  href?: string | null
}>()

const { t } = useI18n()
// The home shows a short flat list; /dev/about has the groups
const stack = computed(() => (props.about.stack ?? []).flatMap(group => group.items).slice(0, 7))
</script>

<template>
  <section
    id="about"
    class="about card"
    aria-labelledby="about-title"
  >
    <ShellPlaceholder
      v-if="!about.portrait"
      source="about · portrait.avif"
      class="portrait"
      empty
    />
    <NuxtImg
      v-else
      :src="about.portrait.src"
      :alt="about.portrait.alt"
      class="portrait"
      width="200"
      height="196"
      loading="lazy"
    />

    <div class="text">
      <p class="eyebrow">
        {{ eyebrow }}
      </p>
      <h2
        id="about-title"
        class="headline"
      >
        {{ about.headline }}
      </h2>
      <p class="teaser">
        {{ about.teaser }}
      </p>
      <NuxtLink
        v-if="href"
        :to="href"
        class="link-accent"
      >
        {{ cta }} <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <div
      v-if="stack.length"
      class="stack"
    >
      <p class="eyebrow">
        {{ t('home.stack') }}
      </p>
      <ul class="chips">
        <li
          v-for="item in stack"
          :key="item"
          class="chip"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) 260px;
  align-items: center;
  gap: 32px;
  margin: var(--section) var(--gutter) 0;
  padding: 32px;
  border-radius: var(--r-stage);
}

.portrait {
  display: block;
  width: 100%;
  height: 196px;
  object-fit: cover;
  object-position: 50% 30%;
  background: var(--raised);
  border-radius: 20px;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.eyebrow {
  margin: 0;
}

.headline {
  font-size: 32px;
  line-height: 1.1;
}

.teaser {
  max-width: 620px;
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--muted);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stack .eyebrow {
  font-size: 11px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 1023px) {
  .about {
    grid-template-columns: 160px minmax(0, 1fr);
  }

  .stack {
    grid-column: 1 / -1;
  }
}

@media (max-width: 767px) {
  .about {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 16px;
    padding: 16px;
    border-radius: var(--r-item);
  }

  .portrait {
    height: 72px;
    border-radius: 50%;
  }

  .headline {
    font-size: 22px;
  }
}
</style>
