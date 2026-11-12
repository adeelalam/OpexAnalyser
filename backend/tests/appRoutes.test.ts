import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { errorHandler } from "../src/middleware/errorHandler.js";

vi.mock("../src/db/prisma.js", () => ({
  prisma: {
    $queryRaw: vi.fn(),
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    expense: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "../src/db/prisma.js";
import app from "../src/app.js";

describe("Application Routes Integration Tests", () => {
  describe("GET /", () => {
    it("should return the application information", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.body).toEqual({
        application: "OpexAnalyser",
        message: "Backend API is running",
      });
    });
  });

  describe("GET /health", () => {
    it("should return the application health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.status).toBe("Healthy");
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe("GET /health/database", () => {
    it("should return database connection status", async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue(1 as never);

      const response = await request(app).get("/health/database").expect(200);

      expect(response.body).toEqual({
        status: "Connected",
        database: "PostgreSQL",
        message: "Database connection successful",
      });
    });

    it("should return an error when the database is unavailable", async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("Database connection failed"));

      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const response = await request(app).get("/health/database").expect(503);

      expect(response.body).toEqual({
        status: "Unavailable",
        message: "Could not connect to the database",
      });

      consoleError.mockRestore();
    });
  });

  describe("404 handling", () => {
    it("should return 404 for an unknown route", async () => {
      const response = await request(app).get("/api/unknown").expect(404);

      expect(response.body).toEqual({
        message: "Route not found",
      });
    });
  });

  describe("Global Error Handler", () => {
    it("should return a generic 500 response for unexpected errors", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      const req = {} as import("express").Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as import("express").Response;

      const next = vi.fn();

      errorHandler(new Error("Unexpected database error"), req, res, next);

      expect(consoleError).toHaveBeenCalledWith("API Error:", expect.any(Error));

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });

      expect(next).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });
});
