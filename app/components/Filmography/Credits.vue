<script setup lang="ts">
interface Credit {
  year: string
  title: string
  role: string
  note?: string
  slug?: string
}

defineProps<{
  credits: Credit[]
  services: string[]
  eyebrow?: string
  title?: string
}>()
</script>

<template>
  <section
    id="filmography"
    class="section"
    aria-labelledby="credits-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="credits-title"
    >
      <ul class="services">
        <li
          v-for="service in services"
          :key="service"
          class="pill"
        >
          {{ service }}
        </li>
      </ul>
    </SectionHead>
    <ol class="rows">
      <li
        v-for="(credit, index) in credits"
        :key="`${credit.year}-${credit.title}`"
        class="row"
      >
        <span
          class="year mono"
          :class="{ latest: index === 0 }"
        >{{ credit.year }}</span>
        <span class="title display">{{ credit.title }}</span>
        <span class="role">{{ credit.role }}<template v-if="credit.note"> · {{ credit.note }}</template></span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.services {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rows {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) minmax(0, 1.3fr);
  align-items: baseline;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: 0;
}

.year.latest {
  color: var(--accent);
}

.title {
  font-size: 24px;
}

.role {
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 767px) {
  .row {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }

  .title {
    font-size: 21px;
  }
}
</style>
