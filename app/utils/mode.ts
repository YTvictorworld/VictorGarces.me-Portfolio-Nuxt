export type Mode = 'day' | 'night'

export const MODES: readonly Mode[] = ['day', 'night']

/** localStorage key for the visitor's chosen mode. No cookie: nothing server-side reads it. */
export const MODE_STORAGE_KEY = 'vg-mode'

/** Mirrors `--bg` in tokens.css, for places CSS variables cannot reach (theme-color meta). */
export const THEME_COLOR: Record<Mode, string> = {
  day: '#F7F7F4',
  night: '#121010'
}

// Locale prefixes other than the default one (prefix_except_default)
const LOCALE_PREFIX = /^\/es(?=\/|$)/

/** Route path without its locale prefix: `/es/film/about` -> `/film/about`. */
export function stripLocale(path: string): string {
  return path.replace(LOCALE_PREFIX, '') || '/'
}

const FORCED: ReadonlyArray<{ pattern: RegExp, mode: Mode }> = [
  { pattern: /^\/dev(?:\/|$)/, mode: 'day' },
  { pattern: /^\/film(?:\/|$)/, mode: 'night' }
]

/** The mode a route imposes (`/dev/**` day, `/film/**` night), or null for shared pages. */
export function forcedModeFor(path: string): Mode | null {
  const base = stripLocale(path)
  return FORCED.find(rule => rule.pattern.test(base))?.mode ?? null
}

export function isMode(value: unknown): value is Mode {
  return value === 'day' || value === 'night'
}

/**
 * Where the header toggle goes from a forced page: the same page in the other mode
 * when one exists, otherwise that mode's closest index. Paths are locale-stripped.
 */
export function siblingPath(path: string): string {
  const base = stripLocale(path)
  const pairs: Array<[RegExp, string]> = [
    [/^\/dev\/?$/, '/film'],
    [/^\/film\/?$/, '/dev'],
    [/^\/dev\/about\/?$/, '/film/about'],
    [/^\/film\/about\/?$/, '/dev/about'],
    [/^\/dev\/work(?:\/.*)?$/, '/film/films'],
    [/^\/film\/films(?:\/.*)?$/, '/dev/work'],
    [/^\/film\/journal\/?$/, '/blog']
  ]
  const match = pairs.find(([pattern]) => pattern.test(base))
  if (match) return match[1]
  return forcedModeFor(base) === 'night' ? '/dev' : '/film'
}

/**
 * Inline script that sets `data-mode` on <html> before first paint, so a returning
 * night visitor never sees a flash of day. Same rules as `forcedModeFor` + storage.
 */
export const MODE_PREPAINT_SCRIPT = `(function(){try{var d=document.documentElement,p=location.pathname.replace(${LOCALE_PREFIX.toString()},'')||'/',m=null;${
  FORCED.map(rule => `if(${rule.pattern.toString()}.test(p))m='${rule.mode}';`).join('')
}if(!m){try{var s=localStorage.getItem('${MODE_STORAGE_KEY}');if(s==='day'||s==='night')m=s}catch(e){}}m=m||'day';d.setAttribute('data-mode',m);d.classList.toggle('dark',m==='night');d.classList.toggle('light',m!=='night')}catch(e){}})()`
