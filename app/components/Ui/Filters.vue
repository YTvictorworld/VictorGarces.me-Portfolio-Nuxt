<script setup lang="ts">
/**
 * Pill filters (D-Work, N-Films, N-Photography, D-Blog). The active pill is a pressed button,
 * and the page keeps the value in the URL so a filtered list can be shared.
 */
defineProps<{
  options: Array<{ id: string, label: string }>
  modelValue: string
  label: string
  /** Label of the "no filter" pill */
  allLabel: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div
    class="filters"
    role="group"
    :aria-label="label"
  >
    <button
      type="button"
      class="pill"
      :class="{ active: !modelValue }"
      :aria-pressed="!modelValue"
      @click="$emit('update:modelValue', '')"
    >
      {{ allLabel }}
    </button>
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="pill"
      :class="{ active: modelValue === option.id }"
      :aria-pressed="modelValue === option.id"
      @click="$emit('update:modelValue', option.id)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  font-family: inherit;
  cursor: pointer;
  transition: color var(--t-micro) var(--ease-out), background-color var(--t-micro) var(--ease-out), border-color var(--t-micro) var(--ease-out);
}

.pill:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

.pill.active {
  color: var(--on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 767px) {
  /* One row that scrolls sideways instead of a block of pills */
  .filters {
    flex-wrap: nowrap;
    margin-inline: calc(var(--gutter) * -1);
    padding-inline: var(--gutter);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .pill {
    flex: none;
  }
}
</style>
