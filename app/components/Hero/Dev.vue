<script setup lang="ts">
interface HeroCopy {
  eyebrow?: string
  title?: string
  lead?: string
  cta?: string
  cta2?: string
}

defineProps<{
  copy: HeroCopy
  /** CV download, only when the file exists */
  cv?: string | null
}>()
</script>

<template>
  <section
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="copy">
      <p class="eyebrow eyebrow--accent">
        {{ copy.eyebrow }}
      </p>
      <h1
        id="hero-title"
        class="title"
      >
        {{ copy.title }}
      </h1>
      <p class="lead">
        {{ copy.lead }}
      </p>
      <div class="actions">
        <a
          href="#work"
          class="btn btn--accent"
        >{{ copy.cta }}</a>
        <a
          v-if="cv"
          :href="cv"
          class="btn"
          download
        >{{ copy.cta2 }}</a>
      </div>
    </div>

    <!-- DESIGN: static drawing until the GLB and the scroll-scrubbed 3D stage land in M10 -->
    <ShellPlaceholder
      source="GLB from Claude Design · M10"
      class="stage"
    >
      <HeroPageExplodedStatic />
    </ShellPlaceholder>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 520px;
  align-items: center;
  gap: 48px;
  padding: 48px var(--gutter) 40px;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.eyebrow {
  margin: 0;
}

.title {
  max-width: 760px;
  font-size: var(--h1-home);
  line-height: 1;
  letter-spacing: -0.03em;
}

.lead {
  max-width: 540px;
  margin: 0;
  font-size: 20px;
  line-height: 1.55;
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 480px;
  padding: 24px;
  background: var(--surface);
  border-radius: var(--r-stage);
}

@media (max-width: 1023px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }

  .stage {
    height: auto;
    aspect-ratio: 13 / 12;
    max-height: 420px;
  }
}

@media (max-width: 767px) {
  .hero {
    padding-top: 16px;
  }

  .copy {
    gap: 16px;
  }

  .lead {
    font-size: 17px;
  }

  .actions .btn {
    flex: 1 1 auto;
  }
}
</style>
