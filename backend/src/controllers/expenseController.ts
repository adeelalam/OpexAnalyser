import type { Request, Response } from "express";

import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
} from "../services/expenseService.js";

import type { CreateExpenseInput } from "../types/expense.js";

// Validate incoming expense data
function isValidExpense(body: unknown): body is CreateExpenseInput {
  if (!body || typeof body !== "object") return false;

  const expense = body as Record<string, unknown>;

  return (
    typeof expense.description === "string" &&
    expense.description.trim().length > 0 &&
    typeof expense.amount === "number" &&
    Number.isFinite(expense.amount) &&
    expense.amount > 0 &&
    typeof expense.category === "string" &&
    expense.category.trim().length > 0 &&
    typeof expense.department === "string" &&
    expense.department.trim().length > 0 &&
    typeof expense.expenseDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(expense.expenseDate) &&
    !Number.isNaN(Date.parse(expense.expenseDate))
  );
}

function getExpenseId(req: Request): string | null {
  const id = req.params.id;

  return typeof id === "string" ? id : null;
}

// GET /api/expenses
export async function getExpenses(_req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const expenses = await getAllExpenses(userId);

  res.status(200).json(expenses);
}

// GET /api/expenses/:id
export async function getExpense(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const id = getExpenseId(req);

  if (!id) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  const expense = await getExpenseById(id, userId);

  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.status(200).json(expense);
}

// POST /api/expenses
export async function addExpense(req: Request, res: Response) {
  const userId = res.locals.userId as string;

  if (!isValidExpense(req.body)) {
    res.status(400).json({ message: "Invalid expense data" });
    return;
  }

  const expense = await createExpense(req.body, userId);

  res.status(201).json(expense);
}

// PUT /api/expenses/:id
export async function editExpense(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const id = getExpenseId(req);

  if (!id) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  if (!isValidExpense(req.body)) {
    res.status(400).json({ message: "Invalid expense data" });
    return;
  }

  const existingExpense = await getExpenseById(id, userId);

  if (!existingExpense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  const expense = await updateExpense(id, req.body, userId);

  res.status(200).json(expense);
}

// DELETE /api/expenses/:id
export async function removeExpense(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const id = getExpenseId(req);

  if (!id) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  const existingExpense = await getExpenseById(id, userId);

  if (!existingExpense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  await deleteExpense(id, userId);

  res.status(200).json({
    message: "Expense deleted successfully",
  });
}

// GET /api/expenses/export
export async function exportExpensesController(_req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const expenses = await exportExpenses(userId);

  function escapeCsvValue(value: string | number | null | undefined): string {
    const text = String(value ?? "");

    if (/[",\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  const headers = [
    "ID",
    "Description",
    "Amount",
    "Category",
    "Department",
    "Expense Date",
    "Created At",
  ];

  const rows = expenses.map((expense) => [
    expense.id,
    expense.description,
    expense.amount.toString(),
    expense.category,
    expense.department,
    expense.expenseDate.toISOString().slice(0, 10),
    expense.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");

  // UTF-8 BOM improves compatibility with Microsoft Excel
  const csvWithBom = "\uFEFF" + csv;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="opex-expenses.csv"');

  res.status(200).send(csvWithBom);
}
