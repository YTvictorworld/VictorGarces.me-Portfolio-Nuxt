<script setup lang="ts">
import { useFixedHeader } from 'vue-use-fixed-header'

const { t } = useI18n()
const route = useRoute()
const { day, night, home, isActive } = useNav()

const headerRef = ref<HTMLElement | null>(null)
const { styles } = useFixedHeader(headerRef)

const siteName = SITE_NAME

const menuOpen = ref(false)
const menuDialog = ref<HTMLDialogElement | null>(null)

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

// showModal/close are imperative, so the ref drives the element rather than a prop
watch(menuOpen, (open) => {
  const dialog = menuDialog.value
  if (!dialog) return
  if (open && !dialog.open) dialog.showModal()
  if (!open && dialog.open) dialog.close()
})
</script>

<template>
  <header
    id="site-header"
    ref="headerRef"
    class="header"
    :style="styles"
  >
    <div class="bar">
      <NuxtLink
        :to="home.day"
        class="brand display day-only"
        translate="no"
      >
        {{ siteName }}
      </NuxtLink>
      <NuxtLink
        :to="home.night"
        class="brand display night-only"
        translate="no"
      >
        {{ siteName }}
      </NuxtLink>

      <div class="mode">
        <span
          class="mode-label mode-label--day"
          aria-hidden="true"
        >{{ t('mode.day') }}</span>
        <ShellModeToggle />
        <span
          class="mode-label mode-label--night"
          aria-hidden="true"
        >{{ t('mode.night') }}</span>
      </div>

      <nav
        :aria-label="t('nav.main')"
        class="nav"
      >
        <ul
          v-for="(items, key) in { day, night }"
          :key="key"
          :class="key === 'day' ? 'day-only' : 'night-only'"
        >
          <li
            v-for="item in items"
            :key="item.path"
          >
            <NuxtLink
              :to="item.to"
              class="nav-link"
              :class="{ active: isActive(item) }"
              :aria-current="isActive(item) ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <ShellLangSwitch />
      </nav>

      <div class="compact">
        <ShellLangSwitch compact />
        <button
          type="button"
          class="menu-button"
          :aria-label="t('nav.openMenu')"
          aria-haspopup="dialog"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            aria-hidden="true"
          >
            <path
              d="M0 1h18M0 6h18M0 11h18"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- A native dialog gives the focus trap, Esc and the backdrop for free, the same way the
         lightbox does. It replaces USlideover, which was the last reason to ship Nuxt UI. -->
    <dialog
      ref="menuDialog"
      class="menu"
      :aria-label="t('nav.menu')"
      @close="menuOpen = false"
    >
      <div class="menu-head">
        <p class="eyebrow">
          {{ t('nav.menu') }}
        </p>
        <button
          type="button"
          class="menu-close"
          :aria-label="t('page.closeLightbox')"
          @click="menuOpen = false"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          ><path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          /></svg>
        </button>
      </div>
      <nav :aria-label="t('nav.main')">
        <ul
          v-for="(items, key) in { day, night }"
          :key="key"
          class="menu-list"
          :class="key === 'day' ? 'day-only' : 'night-only'"
        >
          <li
            v-for="item in items"
            :key="item.path"
          >
            <NuxtLink
              :to="item.to"
              class="menu-link"
              :class="{ active: isActive(item) }"
              :aria-current="isActive(item) ? 'page' : undefined"
              @click="menuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </dialog>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--bg);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: var(--header-h);
  padding: 0 var(--gutter);
}

.brand {
  flex: none;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: var(--text);
  text-decoration: none;
}

[data-mode='night'] .brand {
  font-size: 22px;
  letter-spacing: 0;
}

.mode {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  transition: color var(--t-micro) var(--ease-out);
}

[data-mode='day'] .mode-label--day,
[data-mode='night'] .mode-label--night {
  color: var(--accent);
}

@media (forced-colors: active) {
  [data-mode='day'] .mode-label--day,
  [data-mode='night'] .mode-label--night {
    text-decoration: underline;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav ul {
  display: flex;
  align-items: center;
  gap: 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  transition: color var(--t-micro) var(--ease-out);
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link.active {
  font-weight: 700;
  color: var(--accent);
}

.compact {
  display: none;
  align-items: center;
  gap: 8px;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  background: var(--surface);
  cursor: pointer;
}

[data-mode='night'] .menu-button {
  background: transparent;
}

/* Slides in from the right, like the panel it replaces */
.menu {
  width: min(360px, 86vw);
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0 0 0 auto;
  padding: 24px var(--gutter);
  color: var(--text);
  background: var(--bg);
  border: 0;
  border-left: 1px solid var(--border);
  overscroll-behavior: contain;
}

.menu::backdrop {
  background: var(--backdrop);
}

/* The panel slides in from the edge it is attached to and the page dims behind it, both ways.
   A dialog leaves the top layer the moment it closes, so display and overlay transition as
   discrete properties to keep it there until the slide out has finished. Browsers without
   @starting-style just show and hide it, and reduced motion cuts every duration to nothing. */
.menu,
.menu::backdrop {
  transition:
    transform var(--t-card) var(--ease-out),
    opacity var(--t-card) var(--ease-out),
    overlay var(--t-card) allow-discrete,
    display var(--t-card) allow-discrete;
}

.menu:not([open]) {
  transform: translateX(100%);
}

.menu:not([open])::backdrop {
  opacity: 0;
}

@starting-style {
  .menu[open] {
    transform: translateX(100%);
  }

  .menu[open]::backdrop {
    opacity: 0;
  }
}

/* The links follow the panel by a beat, so the menu reads as arriving rather than appearing */
.menu-list li {
  transition: opacity var(--t-card) var(--ease-out) 60ms, transform var(--t-card) var(--ease-out) 60ms;
}

@starting-style {
  .menu[open] .menu-list li {
    opacity: 0;
    transform: translateX(16px);
  }
}

/* A modal (this menu or the lightbox) keeps the page behind it still. Here rather than in the
   lightbox because the header is on every page, so the rule is always loaded. */
:global(html:has(dialog:modal)) {
  overflow: hidden;
}

.menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.menu-head p {
  margin: 0;
}

.menu-close {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text);
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

/* 44px touch target around the 40px circle, without changing what is drawn */
.menu-close::before {
  content: '';
  position: absolute;
  inset: -3px;
}

.menu-list {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-link {
  display: block;
  padding: 14px 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}

.menu-link.active {
  color: var(--accent);
}

/* Below 1024 px the nav and the toggle move to the menu and the bottom mode pill */
@media (max-width: 1023px) {
  .brand {
    font-size: 17px;
    letter-spacing: -0.02em;
  }

  [data-mode='night'] .brand {
    font-size: 20px;
    letter-spacing: 0;
  }

  .mode,
  .nav {
    display: none;
  }

  .compact {
    display: flex;
  }
}
</style>
