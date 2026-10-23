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
            v-for="(item, index) in items"
            :key="item.path"
            :style="{ '--i': index }"
          >
            <NuxtLink
              :to="item.to"
              class="menu-link"
              :class="{ active: isActive(item) }"
              :aria-current="isActive(item) ? 'page' : undefined"
              @click="menuOpen = false"
            >
              <span
                class="menu-index"
                aria-hidden="true"
              >{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="menu-label">{{ item.label }}</span>
              <UiArrow class="menu-arrow" />
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <p class="menu-foot eyebrow">
        <span class="day-only">{{ t('og.dev.eyebrow') }}</span>
        <span class="night-only">{{ t('og.film.eyebrow') }}</span>
      </p>
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
  flex-direction: column;
  width: min(420px, 100vw);
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0 0 0 auto;
  padding: 20px var(--gutter) calc(28px + env(safe-area-inset-bottom, 0px));
  color: var(--text);
  background: var(--bg);
  border: 0;
  border-left: 1px solid var(--border);
  box-shadow: -24px 0 60px rgb(0 0 0 / 18%);
  overscroll-behavior: contain;
}

.menu[open] {
  display: flex;
}

.menu::backdrop {
  background: var(--backdrop);
}

/* A modal (this menu or the lightbox) keeps the page behind it still. Here rather than in the
   lightbox because the header is on every page, so the rule is always loaded. */
:global(html:has(dialog:modal)) {
  overflow: hidden;
}

/* Motion. The panel arrives on the sheet curve, a fast start that settles slowly, and the page
   dims behind it; the contents follow a beat later, one link after another. Closing is quicker
   and accelerates away, the way a drawer is pushed shut, with no stagger.

   A dialog leaves the top layer the moment it closes, so display and overlay transition as
   discrete properties to keep it there until the slide out has finished. Browsers without
   @starting-style just show and hide it; reduced motion zeroes --t-sheet, so it is instant. */
.menu,
.menu::backdrop {
  transition:
    transform var(--t-sheet) var(--ease-sheet),
    opacity var(--t-sheet) var(--ease-sheet),
    overlay var(--t-sheet) allow-discrete,
    display var(--t-sheet) allow-discrete;
}

.menu:not([open]),
.menu:not([open])::backdrop {
  transition-duration: calc(var(--t-sheet) * 0.6);
  transition-timing-function: var(--ease-in);
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

.menu-head,
.menu-list li,
.menu-foot {
  transition:
    opacity calc(var(--t-sheet) * 0.8) var(--ease-out),
    transform calc(var(--t-sheet) * 0.8) var(--ease-sheet);
}

.menu-head {
  transition-delay: calc(var(--t-sheet) * 0.15);
}

.menu-list li {
  transition-delay: calc(var(--t-sheet) * 0.2 + var(--i, 0) * var(--t-sheet) * 0.07);
}

.menu-foot {
  transition-delay: calc(var(--t-sheet) * 0.55);
}

@starting-style {
  .menu[open] .menu-head,
  .menu[open] .menu-foot {
    opacity: 0;
  }

  .menu[open] .menu-list li {
    opacity: 0;
    transform: translateY(14px);
  }
}

/* Leaving, everything goes with the panel at once */
.menu:not([open]) :is(.menu-head, .menu-list li, .menu-foot) {
  transition-delay: 0s;
}

.menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
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
  transition: transform var(--t-card) var(--ease-out), border-color var(--t-card) var(--ease-out);
}

.menu-close:active {
  transform: scale(0.94);
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
  border-top: 1px solid var(--border);
}

/* The mode's display face: Albert Sans by day, Newsreader italic by night */
.menu-link {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 18px 0;
  font-family: var(--font-display);
  font-style: var(--display-style);
  font-weight: var(--display-weight);
  font-size: clamp(28px, 8.5vw, 36px);
  line-height: 1.1;
  letter-spacing: var(--display-tracking);
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}

.menu-index {
  flex: none;
  width: 2ch;
  font-family: var(--font-mono);
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.menu-label {
  flex: 1;
  min-width: 0;
}

.menu-arrow {
  align-self: center;
  color: var(--muted);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity var(--t-card) var(--ease-out), transform var(--t-card) var(--ease-out);
}

.menu-link:active .menu-arrow,
.menu-link.active .menu-arrow {
  opacity: 1;
  transform: none;
}

.menu-link.active,
.menu-link.active .menu-index,
.menu-link.active .menu-arrow {
  color: var(--accent);
}

.menu-foot {
  margin: auto 0 0;
  padding-top: 32px;
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
