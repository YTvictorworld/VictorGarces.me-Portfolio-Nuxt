/** Collections defined once per locale in content.config.ts (`<name>_en` / `<name>_es`). */
type LocalizedBase = 'projects' | 'films' | 'blog' | 'about' | 'legal' | 'pages'
  | 'experience' | 'filmography' | 'testimonials' | 'faq' | 'contact' | 'bag'

/**
 * Content helpers for the current locale. `collection('projects')` names the right
 * per-locale collection; `published()` drops drafts (the [bracketed] seeds) unless
 * placeholders are shown, which is the case in dev builds only.
 */
export function useLocalizedContent() {
  const { locale } = useI18n()
  const { showPlaceholders } = useRuntimeConfig().public

  function collection<B extends LocalizedBase>(base: B) {
    // The _en name only narrows the type: both locales share one schema per base
    return `${base}_${locale.value === 'es' ? 'es' : 'en'}` as `${B}_en`
  }

  function published<T extends { draft?: boolean }>(items: T[] | null | undefined): T[] {
    if (!items) return []
    return showPlaceholders ? items : items.filter(item => !item.draft)
  }

  return { collection, published, showDrafts: showPlaceholders }
}
