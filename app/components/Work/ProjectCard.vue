<script setup lang="ts">
export interface ProjectCardData {
  title: string
  oneLiner: string
  year: string
  role: string
  status?: string
  stack?: string[]
  tags?: string[]
  cover?: { src: string, alt: string }
}

const props = defineProps<{
  project: ProjectCardData
  /** Case-study page, when it exists: the whole card links there */
  href?: string | null
}>()

const { t } = useI18n()
const statusLabel = computed(() => props.project.status && props.project.status !== 'live'
  ? t(`project.status.${props.project.status}`)
  : '')
</script>

<template>
  <article
    class="card project"
    :class="{ linked: href }"
  >
    <ShellPlaceholder
      v-if="!project.cover"
      source="content/projects · cover"
      class="cover cover--typographic"
    >
      <!-- No screenshot yet: the stack stands in, so the card never shows an empty box -->
      <span class="stack">{{ project.stack?.join(' · ') }}</span>
    </ShellPlaceholder>
    <NuxtImg
      v-else
      :src="project.cover.src"
      :alt="project.cover.alt"
      class="cover"
      width="600"
      height="340"
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
      loading="lazy"
    />

    <div class="meta mono">
      <span>{{ project.year }}<template v-if="statusLabel"> · {{ statusLabel }}</template></span>
      <span>{{ project.role }}</span>
    </div>

    <h3 class="title">
      <NuxtLink
        v-if="href"
        :to="href"
        class="stretched"
      >
        {{ project.title }}
      </NuxtLink>
      <template v-else>
        {{ project.title }}
      </template>
    </h3>
    <p class="summary">
      {{ project.oneLiner }}
    </p>

    <ul
      v-if="project.tags?.length"
      class="tags"
    >
      <li
        v-for="tag in project.tags.slice(0, 2)"
        :key="tag"
        class="chip"
      >
        {{ tag }}
      </li>
    </ul>

    <span
      v-if="href"
      class="link-accent case"
      aria-hidden="true"
    >{{ t('project.caseStudy') }} <UiArrow /></span>
  </article>
</template>

<style scoped>
.project {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 470px;
  padding: 16px;
  transition: transform var(--t-card) var(--ease-out-quart), border-color var(--t-card) var(--ease-out-quart);
}

.linked:hover {
  transform: translateY(-2px);
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.cover {
  display: block;
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: var(--r-media);
  background: var(--raised);
}

.cover--typographic {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
}

.stack {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font-size: 22px;
  letter-spacing: -0.01em;
}

.stretched {
  color: inherit;
  text-decoration: none;
}

/* The title link covers the whole card */
.stretched::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.summary {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: auto 0 0;
  padding: 0;
  list-style: none;
}

.case {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.linked:hover .case :deep(.arrow) {
  transform: translateX(4px);
}

@media (max-width: 767px) {
  .project {
    min-height: 0;
  }
}
</style>
