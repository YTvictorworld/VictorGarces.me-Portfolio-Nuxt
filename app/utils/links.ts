export interface NavLink {
  /** i18n key under `nav.` */
  readonly key: string
  readonly icon: string
  /** Route path (unlocalized — AppHeader runs it through localePath). */
  readonly to: string
  /** Optional in-page anchor appended to the localized route. */
  readonly hash?: string
}

export const navLinks: NavLink[] = [
  { key: 'home', icon: 'i-lucide-home', to: '/' },
  { key: 'about', icon: 'i-lucide-user', to: '/', hash: '#about' },
  { key: 'experience', icon: 'i-lucide-briefcase', to: '/', hash: '#experience' },
  { key: 'blog', icon: 'i-lucide-file-text', to: '/blog' },
  { key: 'contact', icon: 'i-lucide-mail', to: '/contact' },
]
