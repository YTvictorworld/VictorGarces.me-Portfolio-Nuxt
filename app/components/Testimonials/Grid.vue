<script setup lang="ts">
interface Testimonial {
  quote: string
  name: string
  role: string
}

defineProps<{
  entries: Testimonial[]
  eyebrow?: string
  title?: string
}>()

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
</script>

<template>
  <section
    id="testimonials"
    class="section"
    aria-labelledby="testimonials-title"
  >
    <SectionHead
      :eyebrow="eyebrow"
      :title="title"
      title-id="testimonials-title"
    />
    <!-- DESIGN: a carousel takes over when there are more than three; with three the grid shows all -->
    <div
      class="grid"
      tabindex="0"
      role="group"
      :aria-label="title"
    >
      <figure
        v-for="(entry, index) in entries"
        :key="entry.name"
        class="card quote"
        :class="{ 'quote--raised': index === 0 }"
      >
        <blockquote>“{{ entry.quote }}”</blockquote>
        <figcaption>
          <span
            class="avatar"
            aria-hidden="true"
          >{{ initials(entry.name) }}</span>
          <span class="who">
            <span class="name">{{ entry.name }}</span>
            <span class="role">{{ entry.role }}</span>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.quote {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 28px;
}

.quote--raised {
  background: var(--raised);
  border-color: transparent;
}

blockquote {
  margin: 0;
  font-size: 17px;
  line-height: 1.5;
}

figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.avatar {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  background: var(--raised);
  border-radius: 50%;
}

.quote--raised .avatar {
  background: var(--surface);
}

.who {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 600;
}

.role {
  font-size: 13px;
  color: var(--muted);
}

@media (max-width: 767px) {
  /* Swipe instead of a tall stack */
  .grid {
    display: flex;
    gap: 12px;
    margin-inline: calc(var(--gutter) * -1);
    padding-inline: var(--gutter);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .quote {
    flex: 0 0 85%;
    scroll-snap-align: center;
    padding: 20px;
  }

  blockquote {
    font-size: 15px;
  }
}
</style>
