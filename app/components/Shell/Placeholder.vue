<script setup lang="ts">
/**
 * Marks a data-driven area (design/F-Sistema placeholder convention): dashed outline plus a
 * `placeholder · <source>` chip naming the collection or manifest field it reads from.
 * The outline shows only when `showPlaceholders` is on (dev builds). With `empty`, the area
 * has no data yet: it renders as an outlined box in dev and not at all in production.
 */
const props = withDefaults(defineProps<{
  source: string
  empty?: boolean
  as?: string
}>(), { empty: false, as: 'div' })

const { showPlaceholders } = useRuntimeConfig().public
const visible = computed(() => !props.empty || showPlaceholders)
</script>

<template>
  <component
    :is="as"
    v-if="visible"
    :data-placeholder="source"
  >
    <slot v-if="!empty" />
  </component>
</template>
