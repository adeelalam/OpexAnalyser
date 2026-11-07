import api from './api'

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  department: string
  expenseDate: string
  createdAt: string
  updatedAt: string
}

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get<Expense[]>('/api/expenses')

  return response.data
}
