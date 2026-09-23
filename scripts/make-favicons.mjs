/**
 * Builds the favicon set from S-Favicon: one V glyph, day and night.
 *
 * The SVG carries both modes through a prefers-color-scheme media query, so the tab icon
 * follows the reader's system theme. The PNG fallbacks are day colours only, as the artboard
 * note says. The 180 and 512 tiles are full bleed: iOS fills transparent corners with black,
 * and a maskable icon is cropped to a circle on Android, so the glyph stays inside a safe area.
 *
 * Run with `pnpm favicons` after changing the tokens. No .ico is written: the explicit <link>
 * tags in nuxt.config cover every browser that matters, and sharp cannot produce a real ICO
 * container (it would only be a PNG wearing the extension).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// sharp arrives as a transitive dependency of @nuxt/image, so resolve it by path
const sharp = require(resolve(root, 'node_modules/.pnpm/sharp@0.35.4_@types+node@26.6.2/node_modules/sharp'))

const DAY = { bg: '#F7F7F4', stroke: '#1F7A63' }
const NIGHT = { bg: '#121010', stroke: '#E2A15B' }
const GLYPH = 'M14 16 L32 50 L50 16'

/** One 64x64 tile. `radius` 0 gives the full-bleed square the app icons need. */
const tile = ({ bg, stroke }, radius, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="${radius}" fill="${bg}"/>
  <g transform="translate(32 32) scale(${scale}) translate(-32 -32)">
    <path d="${GLYPH}" fill="none" stroke="${stroke}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`

/** The one file that changes with the reader's system theme. */
const adaptive = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <style>
    .bg { fill: ${DAY.bg} }
    .mark { stroke: ${DAY.stroke} }
    @media (prefers-color-scheme: dark) {
      .bg { fill: ${NIGHT.bg} }
      .mark { stroke: ${NIGHT.stroke} }
    }
  </style>
  <rect class="bg" width="64" height="64" rx="12"/>
  <path class="mark" d="${GLYPH}" fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const manifest = {
  name: 'Víctor Garcés',
  short_name: 'V. Garcés',
  description: 'Developer and filmmaker in Santo Domingo, Dominican Republic.',
  start_url: '/',
  display: 'standalone',
  // Day values: a manifest holds one theme, and the site opens in day by default
  theme_color: DAY.bg,
  background_color: DAY.bg,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}

const out = resolve(root, 'public')
mkdirSync(out, { recursive: true })

const png = (svg, size, name) => sharp(Buffer.from(svg))
  .resize(size, size)
  .png({ compressionLevel: 9 })
  .toFile(resolve(out, name))
  .then(() => console.log(`  ${name} (${size}x${size})`))

writeFileSync(resolve(out, 'favicon.svg'), adaptive)
console.log('  favicon.svg (adaptive)')
writeFileSync(resolve(out, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n')
console.log('  manifest.webmanifest')

await Promise.all([
  png(tile(DAY, 8), 16, 'favicon-16.png'),
  png(tile(DAY, 12), 32, 'favicon-32.png'),
  // Full bleed: iOS paints its own rounded mask over this one
  png(tile(DAY, 0), 180, 'apple-touch-icon.png'),
  png(tile(DAY, 0), 192, 'icon-192.png'),
  png(tile(DAY, 0), 512, 'icon-512.png'),
  // Android crops a maskable icon to a circle, so the glyph is scaled into the safe area
  png(tile(DAY, 0, 0.7), 512, 'icon-maskable-512.png')
])
