<script setup lang="ts">
/** Eyebrow + h2 on the left, an optional action (button, chips) on the right. */
defineProps<{
  eyebrow?: string
  title?: string
  /** id for the h2, so the section can use it as aria-labelledby */
  titleId?: string
}>()
</script>

<template>
  <div class="head">
    <div class="text">
      <p
        v-if="eyebrow"
        class="eyebrow"
      >
        {{ eyebrow }}
      </p>
      <h2
        v-if="title"
        :id="titleId"
        class="h2"
      >
        {{ title }}
      </h2>
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
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eyebrow {
  margin: 0;
}

/* Only changes a heading that wraps: its lines come out even instead of one orphaned word */
.h2 {
  text-wrap: balance;
}

.aside {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
</style>
