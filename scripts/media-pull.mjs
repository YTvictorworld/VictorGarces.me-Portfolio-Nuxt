/**
 * Copies the media pipeline's manifest into content/media/manifest.json, which is the only thing
 * the site reads (docs/MEDIA.md). Run before `pnpm generate`; CI does it on every deploy.
 *
 *   MEDIA_MANIFEST_URL=https://media.victorgarces.net/manifest.json pnpm media:pull
 *
 * The URL is public on purpose: the manifest is served from the CDN like any photo, so there is
 * no secret here and nothing to leak. Without the variable the committed manifest is kept, which
 * is what local development and forks get.
 *
 * The download is validated with the same schema and cross-checks the build uses, before
 * anything is written: a broken manifest from the pipeline fails this step loudly and leaves the
 * last good one in place, instead of reaching the site.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { checkManifest, manifestSchema } from '../content.schemas.ts'

const FILE = new URL('../content/media/manifest.json', import.meta.url)
const url = process.env.MEDIA_MANIFEST_URL?.trim()

if (!url) {
  console.log('media:pull: MEDIA_MANIFEST_URL is not set, keeping the committed manifest')
  process.exit(0)
}

const response = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { accept: 'application/json' } })
if (!response.ok) {
  console.error(`media:pull: ${url} answered ${response.status} ${response.statusText}`)
  process.exit(1)
}

const parsed = manifestSchema.safeParse(await response.json())
if (!parsed.success) {
  console.error(`media:pull: the manifest at ${url} does not match the schema:`)
  for (const issue of parsed.error.issues) console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  process.exit(1)
}

const problems = checkManifest(parsed.data)
if (problems.length) {
  console.error(`media:pull: the manifest at ${url} is inconsistent:`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

// Absolute media URLs only: a relative base would point at this site, where the files are not.
// Plain http is allowed for the local emulator and nothing else.
if (!/^(?:https:\/\/|http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$))/.test(parsed.data.base)) {
  console.error(`media:pull: base must be an https URL on the media host, got "${parsed.data.base}"`)
  process.exit(1)
}

const next = `${JSON.stringify(parsed.data, null, 2)}\n`
const current = readFileSync(FILE, 'utf8')
if (next === current) {
  console.log('media:pull: manifest unchanged')
} else {
  writeFileSync(FILE, next)
  const { photos, videos } = parsed.data
  console.log(`media:pull: wrote ${Object.keys(photos).length} photos and ${Object.keys(videos).length} videos from ${url}`)
}
