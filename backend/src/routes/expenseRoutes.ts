import { Router } from "express";

import {
  getExpenses,
  getExpense,
  addExpense,
  editExpense,
  removeExpense,
} from "../controllers/expenseController.js";

const router = Router();

// GET /api/expenses
router.get("/", getExpenses);

// GET /api/expenses/:id
router.get("/:id", getExpense);

// POST /api/expenses
router.post("/", addExpense);

// PUT /api/expenses/:id
router.put("/:id", editExpense);

// DELETE /api/expenses/:id
router.delete("/:id", removeExpense);

export default router;