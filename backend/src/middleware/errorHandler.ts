import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error({ err: error }, "API Error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
