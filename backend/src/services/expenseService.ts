import { prisma } from "../db/prisma.js";
import type { CreateExpenseInput } from "../types/expense.js";

export async function getAllExpenses(userId: string) {
  return prisma.expense.findMany({
    where: { userId },
    orderBy: {
      expenseDate: "desc",
    },
  });
}

export async function getExpenseById(id: string, userId: string) {
  return prisma.expense.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function createExpense(data: CreateExpenseInput, userId: string) {
  return prisma.expense.create({
    data: {
      description: data.description.trim(),
      amount: data.amount,
      category: data.category.trim(),
      department: data.department.trim(),
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
      userId,
    },
  });
}

export async function updateExpense(id: string, data: CreateExpenseInput, userId: string) {
  return prisma.expense.update({
    where: {
      id,
      userId,
    },
    data: {
      description: data.description.trim(),
      amount: data.amount,
      category: data.category.trim(),
      department: data.department.trim(),
      expenseDate: new Date(`${data.expenseDate}T00:00:00.000Z`),
    },
  });
}

export async function deleteExpense(id: string, userId: string) {
  return prisma.expense.deleteMany({
    where: {
      id,
      userId,
    },
  });
}
