interface Profile {
  email: string
  city: string
  socials?: Array<{ label: string, href: string }>
}

/**
 * Person structured data, from content/profile.yml so the facts stay in one place.
 *
 * Used on the pages that are about Víctor: the first-visit landing and both About pages.
 * `sameAs` is what tells a search engine the GitHub, LinkedIn and Instagram accounts are the
 * same person as the site.
 */
export function usePersonSchema(profile: MaybeRefOrGetter<Profile | null | undefined>, jobTitle: string) {
  const person = computed(() => toValue(profile))
  useSchemaOrg([
    definePerson({
      name: SITE_NAME,
      url: SITE_URL,
      email: person.value?.email,
      jobTitle,
      image: `${SITE_URL}/media/portrait-dev.jpg`,
      sameAs: (person.value?.socials ?? []).map(social => social.href)
    })
  ])
}
