<script setup lang="ts">
/** Eyebrow + h1 + lead, with an optional right slot for filters or actions (every index page). */
defineProps<{
  eyebrow?: string
  title?: string
  lead?: string
  /** Appended to the eyebrow, e.g. "12 posts" */
  count?: string
}>()
</script>

<template>
  <div class="page-title">
    <div class="text">
      <p
        v-if="eyebrow"
        class="eyebrow"
      >
        {{ eyebrow }}<template v-if="count">
          · <span aria-hidden="true">{{ count }}</span>
        </template>
      </p>
      <!-- Always mounted, so filtering or searching announces the new result count -->
      <p
        class="sr-only"
        role="status"
      >
        {{ count }}
      </p>
      <h1 class="title">
        {{ title }}
      </h1>
      <p
        v-if="lead"
        class="lead"
      >
        {{ lead }}
      </p>
    </div>
    <div
      v-if="$slots.default"
      class="aside"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-title {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 32px;
  padding: var(--section) var(--gutter) 0;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 720px;
}

.eyebrow {
  margin: 0;
}

.title {
  font-size: var(--h1-page);
  line-height: 1.02;
}

.lead {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
}

.aside {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

@media (max-width: 767px) {
  .lead {
    font-size: 16px;
  }

  /* Filters and the search box get the full width instead of a leftover column */
  .aside {
    width: 100%;
  }
}
</style>
