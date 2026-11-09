<script setup lang="ts">
import { Search, Bell, CalendarDays, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
    <!-- Page title -->
    <div>
      <h2 class="text-xl font-semibold text-slate-800">OpexAnalyser</h2>
      <p class="text-sm text-slate-500">Operating Expense Management</p>
    </div>

    <!-- Header actions -->
    <div class="flex items-center gap-5">
      <button
        class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        aria-label="Search"
      >
        <Search :size="20" />
      </button>

      <button
        class="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell :size="20" />
        <span class="absolute right-2 top-2 size-2 rounded-full bg-red-500"></span>
      </button>

      <div class="flex items-center gap-2 border-l border-slate-200 pl-5">
        <CalendarDays :size="18" class="text-slate-500" />
        <span class="text-sm text-slate-600">November 2026</span>
      </div>

      <!-- Logged-in user -->
      <div class="flex items-center gap-3 border-l border-slate-200 pl-5">
        <div class="text-right">
          <p class="text-sm font-semibold text-slate-700">
            {{ authStore.user?.name }}
          </p>
          <p class="text-xs text-slate-500">
            {{ authStore.user?.email }}
          </p>
        </div>

        <button
          @click="handleLogout"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Log out"
        >
          <LogOut :size="18" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </header>
</template>
