<script setup lang="ts">
/**
 * S-OG-Film: the night Open Graph card (1200x630). Same Satori caveats as OgDay: literal hex
 * and flexbox only, no CSS custom properties and no grid.
 */
withDefaults(defineProps<{
  title?: string
  description?: string
  eyebrow?: string
}>(), {
  title: 'Víctor Garcés',
  description: 'Short films and event photography from Santo Domingo.',
  eyebrow: 'FILMMAKER · @VGFILMX'
})
</script>

<template>
  <div
    style="width: 1200px; height: 630px; display: flex; align-items: center; gap: 40px;
           padding: 64px 72px; background: #121010; color: #F1EBE3;
           font-family: 'Albert Sans', sans-serif;"
  >
    <div style="display: flex; flex-direction: column; flex: 1; gap: 20px;">
      <div style="font-family: 'Source Code Pro', monospace; font-size: 12px; letter-spacing: 0.06em; color: #E2A15B;">
        {{ eyebrow }}
      </div>
      <!-- The night display face: Newsreader italic 500, the same one the site uses -->
      <div style="font-family: 'Newsreader', serif; font-style: italic; font-weight: 500; font-size: 64px; line-height: 1;">
        {{ title }}
      </div>
      <div style="font-size: 22px; line-height: 1.55; color: #A69C91;">
        {{ description }}
      </div>
      <div style="font-family: 'Source Code Pro', monospace; font-size: 16px; color: #A69C91; margin-top: 12px;">
        victorgarces.net
      </div>
    </div>

    <!-- Moon glow behind a film frame, the shape the night hero uses -->
    <div style="display: flex; position: relative; width: 360px; height: 360px; align-items: center; justify-content: center;">
      <div style="position: absolute; top: 0px; left: 160px; width: 180px; height: 180px; border-radius: 90px; background: #E2A15B; opacity: 0.14;" />
      <div style="position: absolute; top: 56px; left: 216px; width: 68px; height: 68px; border-radius: 34px; background: #E2A15B; opacity: 0.25;" />
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div style="display: flex; position: relative; width: 280px; height: 118px; border-radius: 16px; background: #1C1817; overflow: hidden;">
          <div style="width: 140px; height: 118px; background: #6A2A24; opacity: 0.5;" />
          <div style="width: 140px; height: 118px; background: #25314F; opacity: 0.5;" />
          <div style="position: absolute; top: 30px; left: 116px; width: 48px; height: 66px; border-radius: 24px; background: #0B0908;" />
        </div>
        <div style="width: 220px; height: 70px; border-radius: 14px; background: #262120;" />
      </div>
    </div>
  </div>
</template>
