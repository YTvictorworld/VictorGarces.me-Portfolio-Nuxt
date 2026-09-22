/**
 * FAQ answers only use **bold**. Rendered here instead of through <MDC>, whose async client-side
 * parsing never resolves on this static setup. HTML is escaped first, so v-html is safe.
 */
export function renderBold(markdown: string): string {
  return markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .trim()
}

/** Last path segment of a content path: `/en/blog/my-post` -> `my-post`. */
export function slugOf(path: string): string {
  return path.split('/').filter(Boolean).at(-1) ?? ''
}
