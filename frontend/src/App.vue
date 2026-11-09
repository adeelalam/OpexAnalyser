<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <!-- Dashboard layout for authenticated pages -->
  <div v-if="route.meta.requiresAuth" class="flex min-h-screen bg-slate-50">
    <AppSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />

      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Standalone layout for Login and Register -->
  <RouterView v-else />
</template>
