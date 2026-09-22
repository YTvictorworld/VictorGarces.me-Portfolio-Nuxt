<script setup lang="ts">
/**
 * Day contact block (F-Home-Dev): the email, a few links and a one-field message box.
 * DESIGN: the box does not send anything by itself (it would have no reply address);
 * it opens /contact with the message filled in, where the email is asked for.
 */
interface Link {
  label: string
  href: string
  external?: boolean
}

const props = defineProps<{
  email: string
  links: Link[]
  available?: boolean
  eyebrow?: string
  label?: string
  placeholder?: string
  cta?: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const message = ref('')

function go() {
  return navigateTo(localePath({ path: '/contact', query: { topic: 'web', ...(message.value.trim() ? { message: message.value.trim() } : {}) } }))
}

const inputId = useId()
const mailto = computed(() => `mailto:${props.email}`)
</script>

<template>
  <section
    id="contact"
    class="contact"
    aria-labelledby="contact-title"
  >
    <div class="left">
      <p
        id="contact-title"
        class="eyebrow"
      >
        {{ eyebrow }}
      </p>
      <a
        :href="mailto"
        class="email"
      >{{ email }}</a>
      <ul class="links">
        <li
          v-for="link in links"
          :key="link.href"
        >
          <NuxtLink
            :to="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
      <p
        v-if="available"
        class="available"
      >
        <span
          class="ping"
          aria-hidden="true"
        />{{ t('home.availableShort') }}
      </p>
    </div>

    <form
      class="quick"
      @submit.prevent="go"
    >
      <label
        :for="inputId"
        class="label"
      >{{ label }}</label>
      <div class="row">
        <input
          :id="inputId"
          v-model="message"
          type="text"
          name="message"
          :placeholder="placeholder"
          autocomplete="off"
        >
        <button
          type="submit"
          class="btn btn--accent btn--md"
        >
          {{ cta }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  align-items: center;
  gap: 32px;
  margin: var(--section) var(--gutter) 0;
  padding: 36px 40px;
  color: var(--dark-text);
  background: var(--dark);
  border-radius: var(--r-stage);
}

.left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.eyebrow {
  margin: 0;
  color: var(--dark-muted);
}

.email {
  font-family: var(--font-display);
  font-size: 40px;
  font-style: var(--display-style);
  font-weight: var(--display-weight);
  letter-spacing: var(--display-tracking);
  color: var(--dark-text);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.email:hover {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a {
  font-size: 14px;
  font-weight: 500;
  color: var(--dark-muted);
  text-decoration: none;
}

.links a:hover {
  color: var(--dark-text);
}

.available {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--dark-muted);
}

.ping {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
}

.quick {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  font-size: 13px;
  color: var(--dark-muted);
}

.row {
  display: flex;
  gap: 8px;
}

input {
  flex: 1 1 auto;
  min-width: 0;
  height: 48px;
  padding: 0 16px;
  font: inherit;
  font-size: 14px;
  color: var(--dark-text);
  background: var(--dark-input);
  border: 1px solid var(--dark-line);
  border-radius: var(--r-pill);
}

input::placeholder {
  color: var(--dark-muted);
}

.row .btn {
  height: 48px;
}

@media (max-width: 1023px) {
  .contact {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .contact {
    padding: 24px 20px;
    border-radius: var(--r-item);
  }

  .email {
    font-size: 26px;
  }
}
</style>
