<script setup lang="ts">
definePageMeta({ fullBleed: true })

type FieldName = 'name' | 'email' | 'budget' | 'timeline' | 'date' | 'place' | 'message'

const { locale, t } = useI18n()
const route = useRoute()
const { collection } = useLocalizedContent()
const { isNight } = useMode()
const { exists } = useNav()
const localePath = useLocalePath()
// The privacy page landed in M5; the link only appears once that route resolves
const privacyHref = computed(() => exists('/privacy') ? localePath('/privacy') : null)
const { web3formsKey } = useRuntimeConfig().public

const { data } = await useAsyncData(`contact-${locale.value}`, () => Promise.all([
  queryCollection(collection('pages')).path(`/${locale.value}/pages/contact`).first(),
  queryCollection(collection('contact')).first(),
  queryCollection('profile').first()
]))

const page = computed(() => data.value?.[0])
const labels = computed(() => data.value?.[1])
if (!page.value || !labels.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const sections = computed(() => page.value?.sections ?? {})
const budgets = computed(() => labels.value?.budgets ?? [])
const timelines = computed(() => labels.value?.timelines ?? [])
const profile = computed(() => data.value?.[2])
const email = computed(() => profile.value?.email ?? '')

const single = (value: unknown) => Array.isArray(value) ? value[0] as string : value as string | undefined
const topics = computed(() => labels.value?.topics ?? [])

/**
 * The home blocks and the night nav link here with ?topic=web|film and the details filled in.
 * This page is prerendered without a query, so the URL is only read after mount: Vue does not
 * rectify a class mismatch while hydrating, and the "Web project" pill would keep the accent
 * highlight from the prerendered HTML while the film fields showed underneath it. The mode is
 * client-only for the same reason.
 */
const topic = ref('web')
function applyQuery() {
  const wanted = single(route.query.topic)
  if (topics.value.some(entry => entry.id === wanted)) topic.value = wanted!
  else if (isNight.value) topic.value = 'film'
  form.date = single(route.query.date) ?? form.date
  form.place = single(route.query.place) ?? form.place
  form.message = single(route.query.message) ?? form.message
}
onMounted(applyQuery)
watch(() => route.query, applyQuery)

const fields = computed<FieldName[]>(() =>
  topics.value.find(entry => entry.id === topic.value)?.fields ?? ['name', 'email', 'message'])
const shows = (field: FieldName) => fields.value.includes(field)

const form = reactive({
  name: '',
  email: '',
  budget: '',
  timeline: '',
  date: '',
  place: '',
  message: ''
})
/** Bots fill hidden inputs; people do not. Web3Forms drops the submission when it is set. */
const botcheck = ref('')

const errors = ref<Partial<Record<FieldName, string>>>({})
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

/** Only name, email and message are required; the rest help but never block a message. */
function validate() {
  const found: Partial<Record<FieldName, string>> = {}
  for (const field of fields.value) {
    if (field === 'budget' || field === 'timeline' || field === 'date' || field === 'place') continue
    if (!form[field].trim()) found[field] = t('form.required')
  }
  if (!found.email && shows('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    found.email = t('form.invalidEmail')
  }
  errors.value = found
  return Object.keys(found).length === 0
}

const topicLabel = computed(() => topics.value.find(entry => entry.id === topic.value)?.label ?? topic.value)

/** Plain-text body, used by the Web3Forms message and the mailto fallback alike. */
const body = computed(() => ([
  ['budget', t('form.budget')], ['timeline', t('form.timeline')],
  ['date', t('form.date')], ['place', t('form.place')]
] as Array<[FieldName, string]>)
  .filter(([field]) => shows(field) && form[field])
  .map(([field, label]) => `${label}: ${form[field]}`)
  .concat(form.message)
  .join('\n'))

const mailto = computed(() =>
  `mailto:${email.value}?subject=${encodeURIComponent(topicLabel.value)}&body=${encodeURIComponent(body.value)}`)

async function submit() {
  if (!validate()) {
    // Focus the first field that failed, so the error is not only visual
    document.getElementById(`field-${Object.keys(errors.value)[0]}`)?.focus()
    return
  }
  if (botcheck.value) return
  state.value = 'sending'
  try {
    await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: {
        access_key: web3formsKey,
        subject: `${topicLabel.value} — ${form.name}`,
        from_name: form.name,
        name: form.name,
        email: form.email,
        message: body.value,
        botcheck: botcheck.value
      }
    })
    state.value = 'sent'
  } catch {
    state.value = 'error'
  }
}

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <div v-if="page && labels">
    <!-- Not PageTitle: the eyebrow and lead change with the mode, so both variants render -->
    <div class="head">
      <p class="eyebrow eyebrow--accent day-only">
        {{ page.eyebrow }}
      </p>
      <p class="eyebrow eyebrow--accent night-only">
        {{ sections.film?.eyebrow }}
      </p>
      <h1 class="title">
        {{ page.title }}
      </h1>
      <p class="lead day-only">
        {{ page.lead }}
      </p>
      <p class="lead night-only">
        {{ sections.film?.lead }}
      </p>
    </div>

    <div class="section layout">
      <form
        class="card form"
        novalidate
        @submit.prevent="submit"
      >
        <fieldset class="topics">
          <legend class="eyebrow">
            {{ t('form.topic') }}
          </legend>
          <label
            v-for="entry in topics"
            :key="entry.id"
            class="pill"
            :class="{ active: topic === entry.id }"
          >
            <input
              v-model="topic"
              type="radio"
              name="topic"
              :value="entry.id"
              class="sr-only"
            >
            {{ entry.label }}
          </label>
        </fieldset>

        <div class="row">
          <div
            v-if="shows('name')"
            class="field"
          >
            <label for="field-name">{{ t('form.name') }}</label>
            <input
              id="field-name"
              v-model="form.name"
              class="input"
              autocomplete="name"
              :placeholder="t('form.namePlaceholder')"
              :aria-invalid="Boolean(errors.name)"
              :aria-describedby="errors.name ? 'error-name' : undefined"
            >
            <p
              v-if="errors.name"
              id="error-name"
              class="error"
            >
              {{ errors.name }}
            </p>
          </div>

          <div
            v-if="shows('email')"
            class="field"
          >
            <label for="field-email">{{ t('form.email') }}</label>
            <input
              id="field-email"
              v-model="form.email"
              type="email"
              class="input"
              autocomplete="email"
              :placeholder="t('form.emailPlaceholder')"
              :aria-invalid="Boolean(errors.email)"
              :aria-describedby="errors.email ? 'error-email' : undefined"
            >
            <p
              v-if="errors.email"
              id="error-email"
              class="error"
            >
              {{ errors.email }}
            </p>
          </div>
        </div>

        <div class="row">
          <div
            v-if="shows('budget') && budgets.length"
            class="field"
          >
            <label for="field-budget">{{ t('form.budget') }}</label>
            <select
              id="field-budget"
              v-model="form.budget"
              class="input"
            >
              <option value="">
                {{ t('form.budgetPlaceholder') }}
              </option>
              <option
                v-for="option in budgets"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <div
            v-if="shows('timeline')"
            class="field"
          >
            <label for="field-timeline">{{ t('form.timeline') }}</label>
            <select
              id="field-timeline"
              v-model="form.timeline"
              class="input"
            >
              <option value="">
                {{ t('form.timelinePlaceholder') }}
              </option>
              <option
                v-for="option in timelines"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <div
            v-if="shows('date')"
            class="field"
          >
            <label for="field-date">{{ t('form.date') }}</label>
            <input
              id="field-date"
              v-model="form.date"
              type="date"
              class="input"
            >
          </div>

          <div
            v-if="shows('place')"
            class="field"
          >
            <label for="field-place">{{ t('form.place') }}</label>
            <input
              id="field-place"
              v-model="form.place"
              class="input"
              :placeholder="t('form.placePlaceholder')"
            >
          </div>
        </div>

        <div class="field">
          <label for="field-message">{{ t('form.message') }}</label>
          <textarea
            id="field-message"
            v-model="form.message"
            class="input"
            rows="6"
            :placeholder="t('form.messagePlaceholder')"
            :aria-invalid="Boolean(errors.message)"
            :aria-describedby="errors.message ? 'error-message' : undefined"
          />
          <p
            v-if="errors.message"
            id="error-message"
            class="error"
          >
            {{ errors.message }}
          </p>
        </div>

        <!-- Honeypot: off-screen rather than display:none, which bots skip. Hidden from
             assistive tech, so nobody using a screen reader is asked to fill it in. -->
        <label
          class="sr-only"
          aria-hidden="true"
        >
          <span>Leave this field empty</span>
          <input
            v-model="botcheck"
            type="text"
            tabindex="-1"
            autocomplete="off"
          >
        </label>

        <div class="actions">
          <button
            v-if="web3formsKey"
            type="submit"
            class="btn btn--accent btn--md"
            :disabled="state === 'sending'"
          >
            {{ state === 'sending' ? t('form.sending') : t('form.send') }}
          </button>
          <!-- No form endpoint configured: the same message, composed in the visitor's email app -->
          <a
            v-else
            :href="mailto"
            class="btn btn--accent btn--md"
          >{{ t('form.emailFallback') }}</a>
          <p class="consent">
            {{ web3formsKey ? t('form.consent') : t('form.consentEmail') }}
            <NuxtLink
              v-if="privacyHref"
              :to="privacyHref"
              class="link-accent"
            >
              {{ t('footer.privacy') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Always mounted: a live region inserted together with its text is often not read -->
        <p
          class="note"
          :class="{ 'note--ok': state === 'sent', 'note--bad': state === 'error' }"
          role="status"
          aria-live="polite"
        >
          <template v-if="state === 'sent'">
            {{ t('form.success') }}
          </template>
          <template v-else-if="state === 'error'">
            {{ t('form.error', { email }) }}
          </template>
        </p>
      </form>

      <aside class="aside">
        <p class="eyebrow">
          {{ sections.aside?.eyebrow }}
        </p>
        <a
          :href="`mailto:${email}`"
          class="email display"
        >{{ email }}</a>
        <p class="reply mono">
          {{ labels.responseTime }}
        </p>

        <p class="eyebrow elsewhere">
          {{ sections.aside?.title }}
        </p>
        <ul class="socials">
          <li
            v-for="social in profile?.socials"
            :key="social.href"
          >
            <a
              :href="social.href"
              target="_blank"
              rel="me noopener"
            >
              <span>{{ social.label }}</span>
              <span class="mono">{{ social.handle }}</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 720px;
  padding: var(--section) var(--gutter) 0;
}

.head p {
  margin: 0;
}

.title {
  font-size: var(--h1-page);
  line-height: 1.02;
}

.lead {
  font-size: 18px;
  color: var(--muted);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 32px;
  align-items: start;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: 0;
}

.topics legend {
  margin-bottom: 10px;
}

.topics .pill {
  cursor: pointer;
}

.topics .pill:has(:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.topics .pill.active {
  color: var(--on-accent);
  background: var(--accent);
  border-color: var(--accent);
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.row:empty {
  display: none;
}

.field {
  display: flex;
  flex: 1 1 200px;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
}

.error {
  margin: 0;
  font-size: 12px;
  color: var(--danger);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.consent {
  flex: 1 1 260px;
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--muted);
}

.note {
  margin: 0;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: var(--r-inner);
}

/* The live region stays in the DOM with nothing to say, so it must take no space */
.note:empty {
  padding: 0;
}

.note--ok {
  color: var(--on-accent);
  background: var(--accent);
}

.note--bad {
  color: var(--text);
  background: var(--raised);
}

.aside {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.aside p {
  margin: 0;
}

.email {
  font-size: 22px;
  color: var(--text);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.email:hover {
  color: var(--accent);
}

.elsewhere {
  margin-top: 24px !important;
}

.socials {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.socials a {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  color: var(--text);
  text-decoration: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  font-size: 14px;
}

.socials a:hover {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
}

@media (max-width: 1023px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .form {
    padding: 20px;
  }
}
</style>
