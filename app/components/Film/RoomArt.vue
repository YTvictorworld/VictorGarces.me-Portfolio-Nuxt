<script setup lang="ts">
/**
 * Stand-in for a film without footage in the pipeline yet: ¿Por qué no?'s room lit in red
 * and blue, with the silhouette in the middle (drawn in the artboards). Decorative.
 */
withDefaults(defineProps<{ opacity?: number }>(), { opacity: 0.5 })
</script>

<template>
  <svg
    class="room"
    viewBox="0 0 860 440"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <rect
      class="base"
      width="860"
      height="440"
    />
    <rect
      class="warm"
      width="430"
      height="440"
      :opacity="opacity"
    />
    <rect
      class="cool"
      x="430"
      width="430"
      height="440"
      :opacity="opacity"
    />
    <ellipse
      class="shadow"
      cx="430"
      cy="270"
      rx="70"
      ry="94"
    />
  </svg>
</template>

<style scoped>
.room {
  display: block;
  width: 100%;
  height: 100%;
}

.base {
  fill: var(--surface);
}

.warm {
  fill: var(--art-warm);
}

.cool {
  fill: var(--art-cool);
}

.shadow {
  fill: var(--art-shadow);
}
</style>
