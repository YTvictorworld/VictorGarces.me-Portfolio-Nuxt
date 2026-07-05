<script setup lang="ts">
import { navLinks } from '../utils/links'
</script>


<template>
  <div>
    <ScrollProgress />
    <AppHeader :links="navLinks" />
    <main class="min-h-screen">
      <UContainer class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtPage />
      </UContainer>
    </main>
    <AppFooter />
  </div>
</template>