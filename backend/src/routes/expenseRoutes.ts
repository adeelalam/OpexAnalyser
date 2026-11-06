
import { Router } from "express";
import { randomUUID } from "node:crypto";
import type { Expense, CreateExpenseInput } from "../types/expense.js";

const router = Router();

// Temporary in-memory data
let expenses: Expense[] = [
  {
    id: randomUUID(),
    description: "Office equipment",
    amount: 12500,
    category: "Equipment",
    department: "IT",
    expenseDate: "2026-11-01",
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    description: "Team travel",
    amount: 4500,
    category: "Travel",
    department: "Sales",
    expenseDate: "2026-11-03",
    createdAt: new Date().toISOString(),
  },
];

// Validate incoming expense data
function isValidExpense(body: unknown): body is CreateExpenseInput {
  if (!body || typeof body !== "object") {
    return false;
  }

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
    !Number.isNaN(Date.parse(expense.expenseDate))
  );
}

// GET all expenses
router.get("/", (_req, res) => {
  res.status(200).json(expenses);
});

// GET expense by ID
router.get("/:id", (req, res) => {
  const expense = expenses.find(
    (item) => item.id === req.params.id
  );

  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.status(200).json(expense);
});

// CREATE expense
router.post("/", (req, res) => {
  if (!isValidExpense(req.body)) {
    res.status(400).json({
      message: "Invalid expense data",
    });
    return;
  }

  const newExpense: Expense = {
    ...req.body,
    description: req.body.description.trim(),
    category: req.body.category.trim(),
    department: req.body.department.trim(),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  expenses.push(newExpense);

  res.status(201).json(newExpense);
});

// UPDATE expense
router.put("/:id", (req, res) => {
  const index = expenses.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  if (!isValidExpense(req.body)) {
    res.status(400).json({
      message: "Invalid expense data",
    });
    return;
  }

  const updatedExpense: Expense = {
    ...req.body,
    description: req.body.description.trim(),
    category: req.body.category.trim(),
    department: req.body.department.trim(),
    id: expenses[index].id,
    createdAt: expenses[index].createdAt,
  };

  expenses[index] = updatedExpense;

  res.status(200).json(updatedExpense);
});

// DELETE expense
router.delete("/:id", (req, res) => {
  const expense = expenses.find(
    (item) => item.id === req.params.id
  );

  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  expenses = expenses.filter(
    (item) => item.id !== req.params.id
  );

  res.status(200).json({
    message: "Expense deleted successfully",
  });
});

export default router;
