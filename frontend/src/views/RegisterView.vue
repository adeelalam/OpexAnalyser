<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-800">OpexAnalyser</h1>
        <p class="mt-2 text-slate-500">Create your account</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700"> Full name </label>

          <input
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="Your name"
            class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700"> Email address </label>

          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700"> Password </label>

          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            placeholder="Minimum 8 characters"
            class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-600">
        Already have an account?
        <RouterLink to="/login" class="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
