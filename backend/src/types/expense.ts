
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  department: string;
  expenseDate: string;
  createdAt: string;
}

export type CreateExpenseInput = Omit<
  Expense,
  "id" | "createdAt"
>;
