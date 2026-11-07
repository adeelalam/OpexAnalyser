import { Router } from "express";

import {
  getExpenses,
  getExpense,
  addExpense,
  editExpense,
  removeExpense,
} from "../controllers/expenseController.js";

import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getExpenses));
router.get("/:id", asyncHandler(getExpense));
router.post("/", asyncHandler(addExpense));
router.put("/:id", asyncHandler(editExpense));
router.delete("/:id", asyncHandler(removeExpense));

export default router;
