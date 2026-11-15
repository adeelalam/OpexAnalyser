import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    logger.warn({ statusCode: error.statusCode, message: error.message }, "API request error");

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  logger.error({ err: error }, "Unexpected API error");

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
