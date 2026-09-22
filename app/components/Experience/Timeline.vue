<script setup lang="ts">
interface Entry {
  from?: string | null
  to?: string | null
  title: string
  org?: string
  url?: string
  summary?: string
  current?: boolean
}

defineProps<{
  entries: Entry[]
  eyebrow?: string
  title?: string
}>()

const { t } = useI18n()

/** "2025 to now", "2024 to 2025", "2024"; nothing when the year is unknown. */
function years(entry: Entry) {
  if (entry.from && entry.current) return `${entry.from} ${t('home.toNow')}`
  if (entry.from && entry.to && entry.to !== entry.from) return `${entry.from} ${t('home.to')} ${entry.to}`
  return entry.from ?? entry.to ?? ''
}
</script>

<template>
  <section
    id="experience"
    class="section experience"
    aria-labelledby="experience-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="experience-title"
    />
    <ol class="rows">
      <li
        v-for="(entry, index) in entries"
        :key="`${entry.title}-${entry.org}`"
        class="row"
      >
        <span class="years mono">{{ years(entry) }}</span>
        <span
          class="dot"
          :class="{ 'dot--first': index === 0, 'dot--current': index > 0 && entry.current }"
          aria-hidden="true"
        />
        <span class="body">
          <span class="role">
            {{ entry.title }}<template v-if="entry.org"> · <a
              v-if="entry.url"
              :href="entry.url"
              target="_blank"
              rel="noopener"
              class="org"
            >{{ entry.org }}</a><template v-else>{{ entry.org }}</template></template>
          </span>
          <span
            v-if="entry.summary"
            class="summary"
          >{{ entry.summary }}</span>
        </span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.experience {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  align-items: start;
  gap: 48px;
}

.rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: 150px 24px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: 0;
}

.years {
  padding-top: 4px;
}

.dot {
  width: 12px;
  height: 12px;
  margin-top: 5px;
  border: 2px solid var(--border);
  border-radius: 50%;
}

.dot--current {
  border-color: var(--accent);
}

.dot--first {
  background: var(--accent);
  border-color: var(--accent);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role {
  font-size: 17px;
  font-weight: 600;
}

.org {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: color-mix(in oklab, currentColor 45%, transparent);
  text-underline-offset: 4px;
}

.org:hover {
  color: var(--accent);
  text-decoration-color: currentColor;
}

.summary {
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 1023px) {
  .experience {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .row {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 4px 12px;
    padding: 12px 0;
  }

  .years {
    grid-column: 2;
    grid-row: 2;
    padding: 0;
  }

  .dot {
    grid-row: 1;
  }

  .role {
    font-size: 15px;
  }
}
</style>
