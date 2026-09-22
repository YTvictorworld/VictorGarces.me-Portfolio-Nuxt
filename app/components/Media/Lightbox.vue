<script setup lang="ts">
/**
 * Full-size photo viewer. A native <dialog> gives the focus trap, Esc and the backdrop for
 * free; arrows move between photos and the counter is announced.
 */
const props = defineProps<{
  photos: string[]
  /** Index of the open photo, or null when closed */
  index: number | null
}>()

const emit = defineEmits<{ 'update:index': [value: number | null] }>()

const { t } = useI18n()
const media = useMediaManifest()
const dialog = ref<HTMLDialogElement | null>(null)
const current = computed(() => props.index === null ? undefined : props.photos[props.index])

function move(step: number) {
  if (props.index === null) return
  emit('update:index', (props.index + step + props.photos.length) % props.photos.length)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') move(1)
  if (event.key === 'ArrowLeft') move(-1)
}

watch(() => props.index, (value) => {
  const el = dialog.value
  if (!el) return
  if (value === null) {
    if (el.open) el.close()
  } else if (!el.open) {
    el.showModal()
  }
})
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="t('page.photoOf', { n: (index ?? 0) + 1, total: photos.length })"
    @close="emit('update:index', null)"
    @keydown="onKeydown"
  >
    <div
      v-if="current"
      class="frame"
    >
      <img
        :src="media.largest(current)"
        :alt="media.alt(current)"
        :width="media.photo(current)?.width"
        :height="media.photo(current)?.height"
      >
    </div>

    <p
      class="counter mono"
      aria-live="polite"
    >
      {{ t('page.photoOf', { n: (index ?? 0) + 1, total: photos.length }) }}
    </p>

    <button
      type="button"
      class="control close"
      :aria-label="t('page.closeLightbox')"
      @click="emit('update:index', null)"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
      ><path
        d="M3 3l10 10M13 3L3 13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      /></svg>
    </button>
    <button
      v-if="photos.length > 1"
      type="button"
      class="control prev"
      :aria-label="t('page.previousPhoto')"
      @click="move(-1)"
    >
      <UiArrow />
    </button>
    <button
      v-if="photos.length > 1"
      type="button"
      class="control next"
      :aria-label="t('page.nextPhoto')"
      @click="move(1)"
    >
      <UiArrow />
    </button>
  </dialog>
</template>

<style scoped>
.lightbox {
  width: 100vw;
  max-width: 100vw;
  height: 100dvh;
  max-height: 100dvh;
  padding: 0;
  color: var(--text);
  background: var(--bg);
  border: 0;
}

.lightbox::backdrop {
  background: rgb(0 0 0 / 80%);
}

.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 56px 20px;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--r-media);
}

.counter {
  position: absolute;
  left: 20px;
  bottom: 18px;
  margin: 0;
}

.control {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

.close {
  right: 20px;
  top: 20px;
}

.prev,
.next {
  top: 50%;
  transform: translateY(-50%);
}

.prev {
  left: 20px;
}

.prev :deep(.arrow) {
  transform: rotate(180deg);
}

.next {
  right: 20px;
}
</style>
