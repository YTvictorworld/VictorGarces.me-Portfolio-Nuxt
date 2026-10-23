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
 *
 * With `--watch` (`pnpm media:watch`) it keeps polling, for local work against the emulator: an
 * upload shows up in `pnpm dev` seconds after the pipeline rewrites the manifest. A bad manifest
 * is reported and skipped instead of stopping the watch, and the manifest that was on disk
 * before is put back on exit, so the emulator's never ends up in a commit.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { checkManifest, manifestSchema } from '../content.schemas.ts'

const FILE = new URL('../content/media/manifest.json', import.meta.url)
const POLL_MS = 2_000
const url = process.env.MEDIA_MANIFEST_URL?.trim()
const watch = process.argv.includes('--watch')

if (!url) {
  if (watch) {
    console.error('media:watch: set MEDIA_MANIFEST_URL to the manifest to follow (docs/MEDIA.md)')
    process.exit(1)
  }
  console.log('media:pull: MEDIA_MANIFEST_URL is not set, keeping the committed manifest')
  process.exit(0)
}

/** The schema, the cross-checks and the base, in that order. Returns the problems, or none. */
function validate(json) {
  const parsed = manifestSchema.safeParse(json)
  if (!parsed.success) {
    return { problems: parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`) }
  }

  const problems = checkManifest(parsed.data)
  if (problems.length) return { problems }

  // Absolute media URLs only: a relative base would point at this site, where the files are not.
  // Plain http is allowed for the local emulator and nothing else.
  if (!/^(?:https:\/\/|http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$))/.test(parsed.data.base)) {
    return { problems: [`base must be an https URL on the media host, got "${parsed.data.base}"`] }
  }

  return { data: parsed.data, problems: [] }
}

/** Writes the manifest if it differs from the file. Returns what happened, for the log. */
function write(data) {
  const next = `${JSON.stringify(data, null, 2)}\n`
  if (next === readFileSync(FILE, 'utf8')) return 'manifest unchanged'
  writeFileSync(FILE, next)
  return `wrote ${Object.keys(data.photos).length} photos and ${Object.keys(data.videos).length} videos from ${url}`
}

async function pullOnce() {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { accept: 'application/json' } })
  if (!response.ok) {
    console.error(`media:pull: ${url} answered ${response.status} ${response.statusText}`)
    process.exit(1)
  }

  const { data, problems } = validate(await response.json())
  if (!data) {
    console.error(`media:pull: the manifest at ${url} was rejected:`)
    for (const problem of problems) console.error(`  ${problem}`)
    process.exit(1)
  }

  console.log(`media:pull: ${write(data)}`)
}

async function follow() {
  const original = readFileSync(FILE, 'utf8')
  const restore = () => {
    writeFileSync(FILE, original)
    console.log('\nmedia:watch: put the committed manifest back')
    process.exit(0)
  }
  process.on('SIGINT', restore)
  process.on('SIGTERM', restore)

  console.log(`media:watch: following ${url} every ${POLL_MS / 1000}s, Ctrl+C to stop`)

  let etag
  let lastError
  for (;;) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10_000),
        headers: { accept: 'application/json', ...(etag ? { 'if-none-match': etag } : {}) }
      })

      if (response.status === 404) {
        // The manifest is written on the first finished conversion, not before
        if (lastError !== 404) console.log('media:watch: no manifest yet, waiting for the first upload')
        lastError = 404
      } else if (response.ok) {
        etag = response.headers.get('etag') ?? undefined
        const { data, problems } = validate(await response.json())
        if (data) {
          console.log(`media:watch: ${write(data)}`)
        } else {
          console.error('media:watch: skipped a manifest the build would reject:')
          for (const problem of problems) console.error(`  ${problem}`)
        }
        lastError = undefined
      } else if (response.status !== 304) {
        console.error(`media:watch: ${url} answered ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      // The emulator restarting is normal while working on the pipeline: say it once, keep going
      if (lastError !== 'network') console.error(`media:watch: cannot reach ${url} (${error.cause?.code ?? error.message}), retrying`)
      lastError = 'network'
    }

    await new Promise(resolve => setTimeout(resolve, POLL_MS))
  }
}

await (watch ? follow() : pullOnce())
