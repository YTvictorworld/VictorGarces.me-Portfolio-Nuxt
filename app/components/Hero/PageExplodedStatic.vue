<script setup lang="ts">
/**
 * The Developer hero object as a static drawing (F-Home-Dev): a web page separated into its
 * layers. Stands in for the 3D GLB until M10, and stays as its reduced-motion fallback.
 */
const { t } = useI18n()
</script>

<template>
  <svg
    class="exploded"
    viewBox="0 0 520 480"
    role="img"
    :aria-label="t('home.explodedPage')"
  >
    <g transform="translate(90 70)">
      <rect
        class="accent"
        x="120"
        width="230"
        height="22"
        rx="11"
      />
      <rect
        class="surface outlined"
        x="90"
        y="60"
        width="230"
        height="80"
        rx="16"
      />
      <rect
        class="line"
        x="108"
        y="78"
        width="120"
        height="10"
        rx="5"
      />
      <rect
        class="line"
        x="108"
        y="96"
        width="80"
        height="10"
        rx="5"
      />
      <rect
        class="accent"
        x="108"
        y="116"
        width="52"
        height="14"
        rx="7"
      />
      <rect
        v-for="x in [60, 140, 220]"
        :key="x"
        class="raised outlined"
        :x="x"
        y="180"
        width="70"
        height="56"
        rx="12"
      />
      <rect
        class="code"
        x="30"
        y="276"
        width="230"
        height="70"
        rx="14"
      />
      <rect
        class="accent"
        x="46"
        y="292"
        width="90"
        height="8"
        rx="4"
      />
      <rect
        class="muted"
        x="46"
        y="308"
        width="140"
        height="8"
        rx="4"
      />
      <rect
        class="muted"
        x="46"
        y="324"
        width="60"
        height="8"
        rx="4"
      />
      <rect
        class="footer"
        y="380"
        width="230"
        height="30"
        rx="15"
      />
      <line
        v-for="([x1, y1, x2, y2], i) in [[235, 22, 205, 60], [205, 140, 175, 180], [175, 236, 145, 276], [145, 346, 115, 380]]"
        :key="i"
        class="guide"
        :x1="x1"
        :y1="y1"
        :x2="x2"
        :y2="y2"
      />
    </g>
  </svg>
</template>

<style scoped>
.exploded {
  display: block;
  width: 100%;
  height: auto;
  max-height: 100%;
}

.accent {
  fill: var(--accent);
}

.surface {
  fill: var(--surface);
}

.raised {
  fill: var(--raised);
}

.outlined {
  stroke: var(--accent);
  stroke-width: 1.5;
}

.line {
  fill: var(--border);
}

.code {
  fill: var(--dark);
}

.muted {
  fill: var(--muted);
}

.footer {
  fill: var(--bg);
  stroke: var(--border);
  stroke-width: 1.5;
}

.guide {
  stroke: var(--accent);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}
</style>
