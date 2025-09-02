import type { NavigationMenuItem } from '@nuxt/ui'

interface navLinksOpts {
 readonly label: string;
 readonly icon: string;
 readonly to: string;
}

export const navLinks: navLinksOpts[] = [
{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}/*, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'Speaking',
  icon: 'i-lucide-mic',
  to: '/speaking'
},  {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
},  {
  label: 'What is in my bag?',
  icon: 'i-lucide-backpack',
  to: '/bag'
} */

]
