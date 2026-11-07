<script setup lang="ts">
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Building2,
  Settings,
  ChartNoAxesCombined,
} from 'lucide-vue-next'

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Expenses', icon: Receipt, path: '/expenses' },
  { name: 'Categories', icon: Tags, path: '/categories' },
  { name: 'Departments', icon: Building2, path: '/departments' },
]
</script>

<template>
  <aside class="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
    <!-- Brand -->
    <div class="flex h-20 items-center gap-3 border-b border-slate-700 px-6">
      <div class="rounded-lg bg-blue-600 p-2">
        <ChartNoAxesCombined :size="24" />
      </div>

      <div>
        <h1 class="text-lg font-bold">OpexAnalyser</h1>
        <p class="text-xs text-slate-400">Expense Management</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-2 px-4 py-6">
      <p class="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Main Menu
      </p>

      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        active-class="bg-blue-600 text-white hover:bg-blue-600"
      >
        <component :is="item.icon" :size="20" />
        <span>{{ item.name }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom Navigation -->
    <div class="border-t border-slate-700 p-4">
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <Settings :size="20" />
        <span>Settings</span>
      </RouterLink>

      <div class="mt-4 flex items-center gap-3 rounded-lg bg-slate-800 p-3">
        <div class="flex size-9 items-center justify-center rounded-full bg-blue-600 font-semibold">
          OA
        </div>

        <div>
          <p class="text-sm font-medium">Administrator</p>
          <p class="text-xs text-slate-400">OpexAnalyser</p>
        </div>
      </div>
    </div>
  </aside>
</template>
