import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));

export default router;
