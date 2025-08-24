<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <footer class="z-10 bg-transparent border-gray-200 dark:border-gray-800">
    <UContainer class="py-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Left side - Credits -->
        <div class="text-xs text-gray-600 dark:text-gray-400 order-2 md:order-1">
          {{ footer?.credits }}
        </div>
        
        <!-- Right side - Links -->
        <div class="flex items-center gap-2 order-1 md:order-2" v-if="footer?.links">
          <UButton
            v-for="(link, index) of footer?.links"
            :key="index"
            size="xs"
            color="neutral"
            variant="ghost"
            v-bind="link"
          />
        </div>
      </div>
    </UContainer>
  </footer>
</template>
