<script setup lang="ts">
/**
 * S-OG-Dev: the day Open Graph card (1200x630).
 *
 * Satori renders this without a browser, so the usual rules do not apply here: CSS custom
 * properties never resolve (only :root would, and there is no document), and there is no grid
 * layout. Hex values and flexbox are therefore correct in this one place, which is the exception
 * the hard rule in CLAUDE.md allows. The illustration is built from plain boxes rather than an
 * SVG so it survives Satori's partial SVG support.
 */
withDefaults(defineProps<{
  title?: string
  description?: string
  eyebrow?: string
}>(), {
  title: 'Víctor Garcés',
  description: 'Vue, Nuxt, .NET and AWS. Case studies, code and a blog.',
  eyebrow: 'DEVELOPER · SANTO DOMINGO, DO'
})
</script>

<template>
  <div
    style="width: 1200px; height: 630px; display: flex; align-items: center; gap: 40px;
           padding: 64px 72px; background: #F7F7F4; color: #151617;
           font-family: 'Albert Sans', sans-serif;"
  >
    <div style="display: flex; flex-direction: column; flex: 1; gap: 20px;">
      <div style="font-family: 'Source Code Pro', monospace; font-size: 12px; letter-spacing: 0.06em; color: #1F7A63;">
        {{ eyebrow }}
      </div>
      <div style="font-size: 64px; font-weight: 700; line-height: 1; letter-spacing: -0.02em;">
        {{ title }}
      </div>
      <div style="font-size: 22px; line-height: 1.55; color: #5F6266;">
        {{ description }}
      </div>
      <div style="font-family: 'Source Code Pro', monospace; font-size: 16px; color: #5F6266; margin-top: 12px;">
        garceslab.me
      </div>
    </div>

    <!-- The exploded page, the same shape the day hero uses -->
    <div style="display: flex; flex-direction: column; width: 360px; height: 360px; align-items: center; justify-content: center; gap: 14px;">
      <div style="width: 200px; height: 18px; border-radius: 9px; background: #1F7A63;" />
      <div style="width: 200px; height: 70px; border-radius: 14px; background: #FFFFFF; border: 2px solid #1F7A63;" />
      <div style="display: flex; gap: 10px;">
        <div style="width: 60px; height: 50px; border-radius: 10px; background: #E6F1EC; border: 2px solid #1F7A63;" />
        <div style="width: 60px; height: 50px; border-radius: 10px; background: #E6F1EC; border: 2px solid #1F7A63;" />
        <div style="width: 60px; height: 50px; border-radius: 10px; background: #E6F1EC; border: 2px solid #1F7A63;" />
      </div>
      <div style="width: 200px; height: 60px; border-radius: 12px; background: #151617;" />
    </div>
  </div>
</template>
