export type Mode = 'day' | 'night'

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

/** The first-visit landing: day, with the night card scoped to night inside it. */
const LANDING = /^\/$/

const FORCED: ReadonlyArray<{ pattern: RegExp, mode: Mode, remember: boolean }> = [
  { pattern: /^\/dev(?:\/|$)/, mode: 'day', remember: true },
  { pattern: /^\/film(?:\/|$)/, mode: 'night', remember: true },
  // The landing is where the visitor chooses, so rendering it in day must not count as a choice
  { pattern: LANDING, mode: 'day', remember: false }
]

/** The mode a route imposes (`/dev/**` day, `/film/**` night, `/` day), or null for shared pages. */
export function forcedModeFor(path: string): Mode | null {
  const base = stripLocale(path)
  return FORCED.find(rule => rule.pattern.test(base))?.mode ?? null
}

/** Whether visiting the route stores its mode as the visitor's preference (when none is stored). */
export function remembersMode(path: string): boolean {
  const base = stripLocale(path)
  return FORCED.find(rule => rule.pattern.test(base))?.remember ?? false
}

export function isLanding(path: string): boolean {
  return LANDING.test(stripLocale(path))
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
}var s=null;try{s=localStorage.getItem('${MODE_STORAGE_KEY}')}catch(e){}if(s!=='day'&&s!=='night')s=null;if(${LANDING.toString()}.test(p)&&s){d.setAttribute('data-returning','');m=s;setTimeout(function(){d.removeAttribute('data-returning')},4000)}m=m||s||'day';d.setAttribute('data-mode',m)}catch(e){}})()`
