<script setup lang="ts">
/**
 * Night contact block (F-Home-Film): the email plus date, place and what happens.
 * DESIGN: like the day block, it hands the details to /contact?topic=film, where the email is
 * asked for, instead of sending a request nobody could answer.
 */
interface Link {
  label: string
  href: string
}

defineProps<{
  email: string
  links: Link[]
  eyebrow?: string
  cta?: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const fields = reactive({ date: '', place: '', message: '' })

function go() {
  const query: Record<string, string> = { topic: 'film' }
  for (const [key, value] of Object.entries(fields)) {
    if (value.trim()) query[key] = value.trim()
  }
  return navigateTo(localePath({ path: '/contact', query }))
}

const id = useId()
</script>

<template>
  <section
    id="contact"
    class="book"
    aria-labelledby="book-title"
  >
    <div class="left">
      <p
        id="book-title"
        class="eyebrow"
      >
        {{ eyebrow }}
      </p>
      <a
        :href="`mailto:${email}`"
        class="email display"
      >{{ email }}</a>
      <ul class="links">
        <li
          v-for="link in links"
          :key="link.href"
        >
          <a
            :href="link.href"
            target="_blank"
            rel="noopener"
          >{{ link.label }}</a>
        </li>
      </ul>
    </div>

    <form
      class="fields"
      @submit.prevent="go"
    >
      <label
        class="sr-only"
        :for="`${id}-date`"
      >{{ t('home.date') }}</label>
      <input
        :id="`${id}-date`"
        v-model="fields.date"
        type="text"
        name="date"
        :placeholder="t('home.date')"
        autocomplete="off"
      >
      <label
        class="sr-only"
        :for="`${id}-place`"
      >{{ t('home.place') }}</label>
      <input
        :id="`${id}-place`"
        v-model="fields.place"
        type="text"
        name="place"
        :placeholder="t('home.place')"
        autocomplete="off"
      >
      <label
        class="sr-only"
        :for="`${id}-what`"
      >{{ t('home.what') }}</label>
      <input
        :id="`${id}-what`"
        v-model="fields.message"
        class="wide"
        type="text"
        name="message"
        :placeholder="t('home.what')"
        autocomplete="off"
      >
      <button
        type="submit"
        class="btn btn--accent btn--md wide"
      >
        {{ cta }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.book {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 560px;
  align-items: center;
  gap: 32px;
  margin: var(--section) var(--gutter) 0;
  padding: 32px 40px;
  background: var(--surface);
  border: 1px solid var(--border);
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
}

.email {
  font-size: 40px;
  color: var(--text);
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
  color: var(--muted);
  text-decoration: none;
}

.links a:hover {
  color: var(--text);
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.wide {
  grid-column: span 2;
}

input {
  height: 46px;
  min-width: 0;
  padding: 0 16px;
  font: inherit;
  font-size: 14px;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
}

input::placeholder {
  color: var(--muted);
}

@media (max-width: 1023px) {
  .book {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .book {
    padding: 24px 20px;
    border-radius: var(--r-item);
  }

  .email {
    font-size: 28px;
  }
}
</style>
