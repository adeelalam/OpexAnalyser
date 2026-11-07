<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader />

      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
