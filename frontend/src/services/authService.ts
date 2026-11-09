import api from './api'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

// Register a new user
export async function registerUser(data: RegisterInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/register', data)

  return response.data
}

// Login an existing user
export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', data)

  return response.data
}
