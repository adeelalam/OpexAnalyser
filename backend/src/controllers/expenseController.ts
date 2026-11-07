import type { Request, Response } from "express";

import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
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
export async function getExpenses(
  _req: Request,
  res: Response
) {
  try {
    const expenses = await getAllExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not retrieve expenses" });
  }
}

// GET /api/expenses/:id
export async function getExpense(
  req: Request,
  res: Response
) {
  const id = getExpenseId(req);

  if (!id) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  try {
    const expense = await getExpenseById(id);

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not retrieve expense" });
  }
}

// POST /api/expenses
export async function addExpense(
  req: Request,
  res: Response
) {
  if (!isValidExpense(req.body)) {
    res.status(400).json({ message: "Invalid expense data" });
    return;
  }

  try {
    const expense = await createExpense(req.body);
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create expense" });
  }
}

// PUT /api/expenses/:id
export async function editExpense(
  req: Request,
  res: Response
) {

  const id = getExpenseId(req);
    
  if (!id) {
    res.status(400).json({ message: "Invalid expense ID" });
    return;
  }

  if (!isValidExpense(req.body)) {
    res.status(400).json({ message: "Invalid expense data" });
    return;
  }

  try {
    const existingExpense = await getExpenseById(id);

    if (!existingExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    const expense = await updateExpense(id, req.body);
    res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update expense" });
  }
}

// DELETE /api/expenses/:id
export async function removeExpense(
  req: Request,
  res: Response
) {
    const id = getExpenseId(req);

if (!id) {
  res.status(400).json({ message: "Invalid expense ID" });
  return;
}
  try {
    const existingExpense = await getExpenseById(id);

    if (!existingExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    await deleteExpense(id);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not delete expense" });
  }
}