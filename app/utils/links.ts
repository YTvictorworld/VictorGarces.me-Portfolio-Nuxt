interface navLinksOpts {
  readonly label: string;
  readonly icon: string;
  readonly to: string;
}

export const navLinks: navLinksOpts[] = [
  {
    label: "Home",
    icon: "i-lucide-home",
    to: "/",
  },
  {
    label: "About",
    icon: "i-lucide-user",
    to: "/#about",
  },
  {
    label: "Experience",
    icon: "i-lucide-briefcase",
    to: "/#experience",
  },
  {
    label: "Blog",
    icon: "i-lucide-file-text",
    to: "/blog",
  },
  {
    label: "Contact",
    icon: "i-lucide-mail",
    to: "/contact",
  },
];
