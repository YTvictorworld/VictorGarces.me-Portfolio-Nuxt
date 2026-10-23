<script setup lang="ts">
/**
 * Stills strip (F-Home-Film): native horizontal scroll with scroll-snap, no JS carousel.
 * The last tile counts what did not fit and links to the full photography page.
 */
const props = withDefaults(defineProps<{
  photos: string[]
  eyebrow?: string
  title?: string
  cta?: string
  href?: string | null
  /** Photos shown before the "+N" tile */
  limit?: number
}>(), { limit: 8 })

const { t } = useI18n()
const media = useMediaManifest()
const shown = computed(() => props.photos.slice(0, props.limit))
const hidden = computed(() => props.photos.length - shown.value.length)
const width = (id: string) => {
  const photo = media.photo(id)
  return photo ? Math.round(300 * photo.width / photo.height) : 200
}

const section = ref<HTMLElement | null>(null)

/**
 * On desktop the strip stops being a scroller: the section holds still and the vertical scroll
 * slides the stills sideways, each one growing to full size as it reaches the middle. The native
 * scroller, with snap and keyboard access, is what phones and reduced motion keep.
 */
useScrollScene(section, ({ gsap, root }) => {
  const strip = root.querySelector<HTMLElement>('.strip')
  if (!strip) return
  root.classList.add('is-scrubbed')
  const distance = () => strip.scrollWidth - strip.clientWidth
  if (distance() <= 0) {
    root.classList.remove('is-scrubbed')
    return
  }
  // No longer scrollable, so no longer a tab stop. The "+N" tile sits off screen inside a clipped
  // box nobody can scroll, so it leaves the tab order too; "All photography" in the heading goes
  // to the same page.
  strip.setAttribute('tabindex', '-1')
  const more = root.querySelector<HTMLElement>('.still--more a')
  more?.setAttribute('tabindex', '-1')

  const slide = gsap.to(strip, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'center center',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true
    }
  })
  for (const still of root.querySelectorAll('.still')) {
    gsap.fromTo(still, { scale: 0.88, opacity: 0.55 }, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: still, containerAnimation: slide, start: 'left 95%', end: 'left 60%', scrub: true }
    })
  }

  return () => {
    root.classList.remove('is-scrubbed')
    strip.setAttribute('tabindex', '0')
    more?.removeAttribute('tabindex')
  }
})
</script>

<template>
  <section
    id="photo"
    ref="section"
    class="strip-section"
    aria-labelledby="stills-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="stills-title"
      class="head"
    >
      <NuxtLink
        v-if="href"
        :to="href"
        class="btn btn--sm"
      >
        {{ cta }} <UiArrow />
      </NuxtLink>
    </SectionHead>
    <!-- tabindex so the scroller is keyboard operable; no role, or the list semantics go away -->
    <ul
      class="strip"
      tabindex="0"
      :aria-label="title"
    >
      <li
        v-for="id in shown"
        :key="id"
        class="still"
        :style="{ '--w': `${width(id)}px` }"
      >
        <MediaFilmImage
          :id="id"
          :sizes="`${width(id)}px`"
        />
      </li>
      <li
        v-if="hidden > 0 && href"
        class="still still--more"
      >
        <NuxtLink
          :to="href"
          class="mono"
          :aria-label="t('home.morePhotos', { n: hidden })"
        >+{{ hidden }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.strip-section {
  padding-top: var(--section);
}

.head {
  padding: 0 var(--gutter);
}

/* Scrubbed by the scroll scene: the strip overflows the section, which clips it */
.is-scrubbed {
  overflow-x: clip;
}

.is-scrubbed .strip {
  overflow: visible;
  scroll-snap-type: none;
}

.is-scrubbed .still {
  transform-origin: center bottom;
}

.strip {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  margin: 20px 0 0;
  padding: 0 var(--gutter) 8px;
  overflow-x: auto;
  list-style: none;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
  scrollbar-width: thin;
  scrollbar-color: var(--track) transparent;
}

.still {
  flex: 0 0 var(--w);
  height: 300px;
  overflow: hidden;
  border-radius: var(--r-media-lg);
  scroll-snap-align: start;
}

.still :deep(.film-image) {
  width: 100%;
  height: 100%;
}

.still--more {
  --w: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--track);
}

.still--more a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
  text-decoration: none;
}

@media (max-width: 767px) {
  .still {
    flex-basis: calc(var(--w) * 0.73);
    height: 220px;
  }
}
</style>
