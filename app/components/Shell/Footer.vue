<script setup lang="ts">
const { t } = useI18n()
const { legal } = useNav()

const siteName = SITE_NAME
// useState so the prerendered year and the hydrated one always agree
const year = useState('footer-year', () => new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <p class="credits">
      © {{ year }} <span translate="no">{{ siteName }}</span> · {{ t('footer.city') }}<span class="night-only"> · {{ t('footer.originalWork') }}</span>
    </p>
    <nav
      v-if="legal.length"
      :aria-label="t('footer.legal')"
    >
      <ul class="links">
        <li
          v-for="item in legal"
          :key="item.path"
        >
          <NuxtLink :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 116px;
  padding: 0 var(--gutter);
  font-size: 13px;
  color: var(--muted);
}

.credits {
  margin: 0;
}

.links {
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links a {
  position: relative;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--t-micro) var(--ease-out);
}

/* The links are bare text: an invisible 24px target (44px on touch) centred on each one,
   no wider than half the gap so neighbours never overlap */
.links a::before {
  content: '';
  position: absolute;
  inset: min(0px, calc(50% - 12px)) -8px;
}

@media (pointer: coarse) {
  .links a::before {
    inset-block: min(0px, calc(50% - 22px));
  }
}

.links a:hover {
  color: var(--accent);
}

/* Room at the bottom for the floating mode pill */
@media (max-width: 1023px) {
  .footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-height: 0;
    padding: 20px var(--gutter) 96px;
    font-size: 11px;
  }

  .links {
    gap: 16px;
  }
}
</style>
