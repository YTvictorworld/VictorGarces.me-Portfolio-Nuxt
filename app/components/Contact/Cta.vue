<script setup lang="ts">
/** Closing block of a detail page (D-Project, N-Film): a question, the email and a link. */
defineProps<{
  title: string
  email: string
  cta: string
  href: string
}>()
</script>

<template>
  <section class="cta">
    <div class="text">
      <p class="eyebrow">
        {{ title }}
      </p>
      <a
        :href="`mailto:${email}`"
        class="email display"
      >{{ email }}</a>
    </div>
    <NuxtLink
      :to="href"
      class="btn btn--accent btn--sm"
    >
      {{ cta }}
    </NuxtLink>
  </section>
</template>

<style scoped>
.cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  margin: var(--section) var(--gutter) 0;
  padding: 28px 32px;
  color: var(--dark-text);
  background: var(--dark);
  border-radius: var(--r-stage);
}

.text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.eyebrow {
  margin: 0;
  color: var(--dark-muted);
}

.email {
  font-size: 28px;
  color: var(--dark-text);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.email:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
