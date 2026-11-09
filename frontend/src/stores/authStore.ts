import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  loginUser,
  registerUser,
  type User,
  type LoginInput,
  type RegisterInput,
} from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = ref(!!token.value)

  function saveSession(authResponse: { user: User; token: string }) {
    user.value = authResponse.user
    token.value = authResponse.token
    isAuthenticated.value = true

    localStorage.setItem('token', authResponse.token)
    localStorage.setItem('user', JSON.stringify(authResponse.user))
  }

  async function login(data: LoginInput) {
    const response = await loginUser(data)
    saveSession(response)
    return response
  }

  async function register(data: RegisterInput) {
    const response = await registerUser(data)
    saveSession(response)
    return response
  }

  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false

    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function initializeAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        user.value = JSON.parse(storedUser) as User
        token.value = storedToken
        isAuthenticated.value = true
      } catch {
        logout()
      }
    } else {
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  }
})
