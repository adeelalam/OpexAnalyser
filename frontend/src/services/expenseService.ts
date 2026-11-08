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

export const createExpense = async (
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Expense> => {
  const response = await api.post<Expense>('/api/expenses', expense)

  return response.data
}
