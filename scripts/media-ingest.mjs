// Local stand-in for the media pipeline (victorgarces-media-pipeline) until it exists.
// Downloads the source photos, writes AVIF + WebP renditions and a blurhash per photo to
// public/media/photos/, and rebuilds content/media/manifest.json in the pipeline's format
// (docs/MEDIA.md). `pnpm media:pull` replaces this in M8.
//
//   node scripts/media-ingest.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { encode } from 'blurhash'

const ROOT = path.resolve(import.meta.dirname, '..')
const CACHE = path.join(ROOT, 'node_modules/.cache/media-ingest')
// Originals dropped by hand live here, untracked. A photo entry uses either `file` (a name in
// this folder) or `source` (the Behance path the first seven came from).
const INCOMING = path.join(ROOT, 'media-src')
const OUT = path.join(ROOT, 'public/media/photos')
const MANIFEST = path.join(ROOT, 'content/media/manifest.json')
const WIDTHS = [480, 960, 1440, 2048]
const BEHANCE = 'https://mir-s3-cdn-cf.behance.net/project_modules/'

const photos = [
  {
    id: 'events-2025-01', series: 'events-2025', source: 'hd_webp/4255dc233842739.68b76fb853545.jpg',
    alt: 'Student with an event lanyard smiling in front of a bright graffiti mural',
    alt_es: 'Estudiante con credencial del evento sonriendo frente a un mural de grafiti de colores vivos'
  },
  {
    id: 'events-2025-02', series: 'events-2025', source: 'hd_webp/6a876d233842845.68b77038f15ed.jpg',
    alt: 'Student in a white top and beige trousers leaning on a railing on a campus walkway',
    alt_es: 'Estudiante con blusa blanca y pantalón beige apoyada en una baranda de un pasillo del campus'
  },
  {
    id: 'events-2025-03', series: 'events-2025', source: 'hd_webp/6bd644233842611.68b76ec5d2866.jpg',
    alt: 'Smiling student in a navy Yale Young Global Scholars T-shirt sitting on a stone ledge',
    alt_es: 'Estudiante sonriente con camiseta azul de Yale Young Global Scholars sentada en un muro de piedra'
  },
  {
    id: 'events-2025-04', series: 'events-2025', source: 'hd_webp/7c43b9233842611.68b76ec5d56e1.jpg',
    alt: 'Two friends hugging and laughing on a lawn under the trees',
    alt_es: 'Dos amigas abrazadas y riendo en un jardín bajo los árboles'
  },
  {
    id: 'events-2025-05', series: 'events-2025', source: 'hd_webp/28c737233842611.68b76ec5c72b8.jpg',
    alt: 'Student with glasses in a Yale T-shirt standing in front of a brick building',
    alt_es: 'Estudiante con lentes y camiseta de Yale frente a un edificio de ladrillo'
  },
  {
    id: 'portraits-01', series: 'portraits', source: 'fs_webp/06895b212781749.673b4e14df4a8.jpg',
    alt: 'Low-angle portrait of a woman with curly hair against a concrete wall, bag over her shoulder',
    alt_es: 'Retrato en contrapicado de una mujer de cabello rizado contra una pared de concreto, con un bolso al hombro'
  },
  {
    id: 'portraits-02', series: 'portraits', source: 'max_1200/1389a2212781749.673b4e14dcafc.jpg',
    alt: 'Young man in a cap and glasses looking away beside a tree, wearing a Santo Domingo T-shirt',
    alt_es: 'Joven con gorra y lentes mirando a un lado junto a un árbol, con una camiseta de Santo Domingo'
  }
]

const series = {
  'events-2025': { title: 'Events 2025', title_es: 'Eventos 2025' },
  'portraits': { title: 'Portraits', title_es: 'Retratos' }
}

// Films whose files are not in the pipeline yet: listed so content can reference them
const videos = {
  'por-que-no': { title: '¿Por qué no?', duration: 364, aspect: '16:9', status: 'pending' },
  'por-que-no-vertical': { title: '¿Por qué no? (vertical cut)', duration: 180, aspect: '9:16', status: 'pending' },
  'reel-2026': { title: 'Reel 2026', duration: 90, aspect: '16:9', status: 'pending' }
}

async function resolveSource(photo) {
  if (photo.file) {
    const file = path.join(INCOMING, photo.file)
    if (!fs.existsSync(file)) throw new Error(`${photo.id}: media-src/${photo.file} not found`)
    return file
  }
  const file = path.join(CACHE, photo.source.replace('/', '__'))
  if (!fs.existsSync(file)) {
    const response = await fetch(BEHANCE + photo.source)
    if (!response.ok) throw new Error(`${photo.source}: HTTP ${response.status}`)
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
  }
  return file
}

async function blurhashOf(file) {
  const { data, info } = await sharp(file).resize(32, 32, { fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3)
}

fs.mkdirSync(CACHE, { recursive: true })
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })

const manifest = { version: 1, base: '/media', photos: {}, videos, series: {} }

for (const photo of photos) {
  const file = await resolveSource(photo)
  const { width, height } = await sharp(file).metadata()
  // Standard widths the source can fill, plus the source width itself when it sits between them
  const sizes = WIDTHS.filter(w => w <= width)
  if (!sizes.includes(width) && width < WIDTHS.at(-1)) sizes.push(width)

  for (const size of sizes) {
    const base = path.join(OUT, `${photo.id}-${size}`)
    await sharp(file).resize({ width: size }).avif({ quality: 55, effort: 5 }).toFile(`${base}.avif`)
    await sharp(file).resize({ width: size }).webp({ quality: 78 }).toFile(`${base}.webp`)
  }

  manifest.photos[photo.id] = {
    series: photo.series,
    alt: photo.alt,
    alt_es: photo.alt_es,
    width,
    height,
    blurhash: await blurhashOf(file),
    sizes,
    formats: ['avif', 'webp'],
    path: `photos/${photo.id}`
  }
  console.log(`${photo.id}: ${width}x${height} -> ${sizes.join(', ')}`)
}

for (const [id, meta] of Object.entries(series)) {
  manifest.series[id] = { ...meta, photos: photos.filter(p => p.series === id).map(p => p.id) }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`manifest: ${Object.keys(manifest.photos).length} photos, ${Object.keys(manifest.videos).length} videos`)
