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

/** Offsets that bring each exploded layer into one stacked page, in SVG units */
const ASSEMBLE: Record<string, { x: number, y: number }> = {
  nav: { x: -60, y: 40 },
  hero: { x: -30, y: 12 },
  cards: { x: 0, y: -18 },
  code: { x: 30, y: -48 },
  footer: { x: 60, y: -72 }
}

const hero = ref<HTMLElement | null>(null)

/**
 * The page builds itself as you scroll: the hero holds still, the exploded layers close into
 * one page, the guides fade, and a browser window draws itself around the result.
 */
useScrollScene(hero, ({ gsap, root, headerOffset }) => {
  const scene = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: () => `top ${headerOffset()}px`, end: '+=600', pin: true, scrub: 0.6 }
  })

  for (const [layer, offset] of Object.entries(ASSEMBLE)) {
    scene.to(root.querySelector(`.layer--${layer}`), { ...offset, ease: 'power2.inOut', duration: 0.7 }, 0)
  }
  scene
    .to(root.querySelectorAll('.guide'), { opacity: 0, duration: 0.3 }, 0)
    .set(root.querySelector('.chrome'), { opacity: 1 }, 0.55)
    .from(root.querySelectorAll('.chrome > *'), { drawSVG: 0, duration: 0.45, stagger: 0.05 }, 0.55)
})
</script>

<template>
  <section
    ref="hero"
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

    <!-- M10: SVG instead of the 3D GLB (owner decision). The scroll scene lives in the script. -->
    <ShellPlaceholder
      source="SVG scroll scene · M10"
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
