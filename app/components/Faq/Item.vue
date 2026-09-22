<script setup lang="ts">
/** One question. The answer animates its height with the grid-rows trick (0fr to 1fr). */
const props = defineProps<{
  q: string
  a: string
  defaultOpen?: boolean
}>()

const open = ref(props.defaultOpen ?? false)
const id = useId()
</script>

<template>
  <div
    class="item"
    :class="{ open }"
  >
    <h3 class="question-wrap">
      <button
        :id="`${id}-q`"
        type="button"
        class="question"
        :aria-expanded="open"
        :aria-controls="`${id}-a`"
        @click="open = !open"
      >
        <span>{{ q }}</span>
        <svg
          class="chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
        ><path
          d="M3 6l5 5 5-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        /></svg>
      </button>
    </h3>
    <div
      :id="`${id}-a`"
      class="answer"
      role="region"
      :aria-labelledby="`${id}-q`"
      :inert="!open"
    >
      <div class="answer-inner">
        <!-- Our own YAML, HTML-escaped by renderBold before only <strong> is added back -->
        <!-- eslint-disable vue/no-v-html -->
        <p v-html="renderBold(a)" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  padding: 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-item);
}

.question-wrap {
  margin: 0;
  font-family: var(--font-body);
  font-style: normal;
  font-weight: 600;
  letter-spacing: 0;
}

.question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 0;
  font: inherit;
  font-size: 17px;
  color: var(--text);
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.chevron {
  flex: none;
  color: var(--muted);
  transition: transform var(--t-card) var(--ease-out-quart);
}

.open .chevron {
  transform: rotate(180deg);
}

.answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--t-card) var(--ease-out-quart);
}

.open .answer {
  grid-template-rows: 1fr;
}

.answer-inner {
  overflow: hidden;
}

.answer p {
  margin: 0;
  padding-top: 10px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--muted);
}

.answer p :deep(strong) {
  font-weight: 600;
  color: var(--text);
}
</style>
