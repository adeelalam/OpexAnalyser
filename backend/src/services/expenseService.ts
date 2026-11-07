import { prisma } from "../db/prisma.js";
import type { CreateExpenseInput } from "../types/expense.js";

export async function getAllExpenses() {
  return prisma.expense.findMany({
    orderBy: {
      expenseDate: "desc",
    },
  });
}

export async function getExpenseById(id: string) {
  return prisma.expense.findUnique({
    where: { id },
  });
}

export async function createExpense(data: CreateExpenseInput) {
  return prisma.expense.create({
    data: {
      description: data.description.trim(),
      amount: data.amount,
      category: data.category.trim(),
      department: data.department.trim(),
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
    },
  });
}

export async function updateExpense(id: string, data: CreateExpenseInput) {
  return prisma.expense.update({
    where: { id },
    data: {
      description: data.description.trim(),
      amount: data.amount,
      category: data.category.trim(),
      department: data.department.trim(),
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
    },
  });
}

export async function deleteExpense(id: string) {
  return prisma.expense.delete({
    where: { id },
  });
}
