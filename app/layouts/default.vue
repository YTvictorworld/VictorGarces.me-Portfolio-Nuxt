<script setup lang="ts">
import { navLinks } from '../utils/links'
</script>


<template>
  <div>
    <AppHeader :links="navLinks" />
    <main class="min-h-screen">
      <UContainer class="max-w-6x1 mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtPage />
      </UContainer>
    </main>
    <AppFooter />
  </div>
</template>