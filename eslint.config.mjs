// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Reference material, never built or served
    ignores: ['design/**', 'docs/**']
  },
  {
    rules: {
      // Components follow the Group/Name.vue convention (Shell/Header.vue -> <ShellHeader>),
      // so the file name alone is intentionally a single word
      'vue/multi-word-component-names': 'off'
    }
  }
)
