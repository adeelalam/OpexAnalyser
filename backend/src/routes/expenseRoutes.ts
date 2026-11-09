import { Router } from "express";

import {
  getExpenses,
  getExpense,
  addExpense,
  editExpense,
  removeExpense,
} from "../controllers/expenseController.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Require authentication for all expense endpoints
router.use(authenticateToken);

router.get("/", asyncHandler(getExpenses));
router.get("/:id", asyncHandler(getExpense));
router.post("/", asyncHandler(addExpense));
router.put("/:id", asyncHandler(editExpense));
router.delete("/:id", asyncHandler(removeExpense));

export default router;
