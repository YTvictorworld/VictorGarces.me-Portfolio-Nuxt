<script setup lang="ts">
/**
 * S-Legal: the shared template behind /privacy, /terms and /cookies. Every word comes from
 * content/{en,es}/legal/<slug>.md; the artboard's own section text is pre-decision and is not
 * copied (it still describes a cookie banner, Turnstile and embeds that this site does not have).
 */
const props = defineProps<{
  /** The parsed legal document, with front matter and body */
  doc: {
    title: string
    description?: string
    updated: string | Date
    body?: { toc?: { links?: Array<{ id: string, text: string }> } }
  }
}>()

const { t, locale } = useI18n()
const toc = computed(() => props.doc.body?.toc?.links ?? [])
</script>

<template>
  <div>
    <PageTitle
      :eyebrow="`${t('legal.eyebrow')} · ${doc.title}`"
      :title="doc.title"
      :lead="doc.description"
    />
    <p class="updated mono">
      {{ t('legal.updated', { date: formatDate(doc.updated, locale) }) }}
    </p>

    <LegalTabs />

    <div class="section layout">
      <!-- The artboard puts the section list on the left, mirroring the blog post page -->
      <nav
        v-if="toc.length"
        class="toc card"
        :aria-label="t('legal.sections')"
      >
        <p class="eyebrow">
          {{ t('legal.sections') }}
        </p>
        <ol>
          <li
            v-for="entry in toc"
            :key="entry.id"
          >
            <a :href="`#${entry.id}`">{{ entry.text }}</a>
          </li>
        </ol>
      </nav>

      <div class="prose body">
        <ContentRenderer :value="doc" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.updated {
  margin: 10px 0 0;
  padding: 0 var(--gutter);
}

.layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 48px;
  align-items: start;
}

.toc {
  position: sticky;
  top: calc(var(--header-h) + 16px);
  padding: 20px;
  border-radius: var(--r-item);
}

.toc p {
  margin: 0 0 10px;
}

.toc ol {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: toc;
}

.toc a {
  font-size: 13px;
  line-height: 1.35;
  color: var(--muted);
  text-decoration: none;
}

.toc a::before {
  counter-increment: toc;
  content: counter(toc) '. ';
}

.toc a:hover {
  color: var(--accent);
}

.body {
  max-width: 720px;
  counter-reset: section;
}

/* The artboard numbers the sections; the markdown headings do not, so the number is presentation
   only and never reaches the table of contents or a copied heading. */
.body :deep(h2) {
  scroll-margin-top: 16px;
}

.body :deep(h2)::before {
  counter-increment: section;
  content: counter(section) '. ';
  font-style: normal;
  color: var(--accent);
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }

  .toc {
    position: static;
  }
}
</style>
