<script setup lang="ts">
/**
 * The Developer hero object (F-Home-Dev): a web page separated into its layers. This static
 * drawing is the resting state; on desktop, Hero/Dev scrubs it into an assembled page inside a
 * browser window as you scroll. Phones and reduced motion keep it as it is.
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
    <!-- One group per layer, so the Hero/Dev scroll scene can move them; at rest they draw
         exactly what the static artboard shows -->
    <g transform="translate(90 70)">
      <g class="layer layer--nav">
        <rect
          class="accent"
          x="120"
          width="230"
          height="22"
          rx="11"
        />
      </g>
      <g class="layer layer--hero">
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
      </g>
      <g class="layer layer--cards">
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
      </g>
      <g class="layer layer--code">
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
      </g>
      <g class="layer layer--footer">
        <rect
          class="footer"
          y="380"
          width="230"
          height="30"
          rx="15"
        />
      </g>
      <g class="guides">
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
      <!-- The browser window the assembled page lands in. Hidden at rest: only the scene draws it. -->
      <g class="chrome">
        <rect
          x="44"
          y="4"
          width="262"
          height="348"
          rx="18"
        />
        <path d="M44 30 H306" />
        <circle
          v-for="cx in [60, 72, 84]"
          :key="cx"
          :cx="cx"
          cy="17"
          r="3"
        />
      </g>
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

.chrome {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  opacity: 0;
}
</style>
