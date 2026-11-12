import { beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { prisma } from "../src/db/prisma.js";

// Mock Prisma to avoid connecting to the real database
vi.mock("../src/db/prisma.js", () => ({
  prisma: {
    expense: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

import app from "../src/app.js";

describe("Expense API Integration Tests", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-for-integration-tests";
  });
  describe("Authentication", () => {
    it("should reject requests without an authentication token", async () => {
      const response = await request(app).get("/api/expenses").expect(401);

      expect(response.body).toEqual({
        message: "Authentication token is required",
      });
    });

    it("should reject a token without a valid user ID", async () => {
      const token = jwt.sign("invalid-payload", process.env.JWT_SECRET!);
      const response = await request(app)
        .get("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid authentication token",
      });

      expect(prisma.expense.findMany).not.toHaveBeenCalled();
    });

    it("should accept a valid authentication token", async () => {
      const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      vi.mocked(prisma.expense.findMany).mockResolvedValue([] as never);

      const response = await request(app)
        .get("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return 500 when JWT_SECRET is not configured", async () => {
      const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, { expiresIn: "1h" });

      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      try {
        const response = await request(app)
          .get("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .expect(500);

        expect(response.body).toEqual({
          success: false,
          message: "Internal server error",
        });
      } finally {
        process.env.JWT_SECRET = originalSecret;
      }
    });

    describe("GET /api/expenses", () => {
      it("should return expenses for the authenticated user", async () => {
        const userId = "user-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const mockExpenses = [
          {
            id: "expense-123",
            description: "Office supplies",
            amount: 500,
            category: "Office",
            department: "IT",
            expenseDate: new Date("2026-11-12T00:00:00.000Z"),
            createdAt: new Date("2026-11-12T10:00:00.000Z"),
            userId,
          },
        ];

        vi.mocked(prisma.expense.findMany).mockResolvedValue(mockExpenses as never);

        const response = await request(app)
          .get("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].id).toBe("expense-123");
        expect(response.body[0].description).toBe("Office supplies");

        expect(prisma.expense.findMany).toHaveBeenCalledWith({
          where: { userId },
          orderBy: {
            expenseDate: "desc",
          },
        });
      });
    });

    describe("GET /api/expenses/:id", () => {
      it("should return a specific expense belonging to the authenticated user", async () => {
        const userId = "user-123";
        const expenseId = "expense-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const mockExpense = {
          id: expenseId,
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          createdAt: new Date("2026-11-12T10:00:00.000Z"),
          userId,
        };

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(mockExpense as never);

        const response = await request(app)
          .get(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.body.id).toBe(expenseId);
        expect(response.body.description).toBe("Office supplies");

        expect(prisma.expense.findFirst).toHaveBeenCalledWith({
          where: {
            id: expenseId,
            userId,
          },
        });
      });

      it("should return 404 when the expense does not exist", async () => {
        const userId = "user-123";
        const expenseId = "unknown-expense";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(null);

        const response = await request(app)
          .get(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(404);

        expect(response.body).toEqual({
          message: "Expense not found",
        });
      });
    });

    describe("POST /api/expenses", () => {
      it("should create an expense for the authenticated user", async () => {
        const userId = "user-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const expenseInput = {
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
          expenseDate: "2026-11-12",
        };

        const mockExpense = {
          id: "expense-456",
          ...expenseInput,
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          createdAt: new Date("2026-11-12T10:00:00.000Z"),
          userId,
        };

        vi.mocked(prisma.expense.create).mockResolvedValue(mockExpense as never);

        const response = await request(app)
          .post("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send(expenseInput)
          .expect(201);

        expect(response.body.id).toBe("expense-456");
        expect(response.body.description).toBe("Office supplies");

        expect(prisma.expense.create).toHaveBeenCalledWith({
          data: {
            ...expenseInput,
            expenseDate: new Date("2026-11-12"),
            userId,
          },
        });
      });

      it("should reject an expense with invalid data", async () => {
        const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        const invalidExpense = {
          description: "",
          amount: -100,
          category: "Office",
          department: "IT",
          expenseDate: "2026-11-12",
        };

        const response = await request(app)
          .post("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidExpense)
          .expect(400);

        expect(response.body).toEqual({
          message: "Invalid expense data",
        });

        expect(prisma.expense.create).not.toHaveBeenCalled();
      });

      it("should reject an expense with a non-numeric amount", async () => {
        const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        const response = await request(app)
          .post("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send({
            description: "Office supplies",
            amount: "500",
            category: "Office",
            department: "IT",
            expenseDate: "2026-11-12",
          })
          .expect(400);

        expect(response.body).toEqual({
          message: "Invalid expense data",
        });

        expect(prisma.expense.create).not.toHaveBeenCalled();
      });

      it("should reject an expense with an invalid date", async () => {
        const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        const response = await request(app)
          .post("/api/expenses")
          .set("Authorization", `Bearer ${token}`)
          .send({
            description: "Office supplies",
            amount: 500,
            category: "Office",
            department: "IT",
            expenseDate: "not-a-valid-date",
          })
          .expect(400);

        expect(response.body).toEqual({
          message: "Invalid expense data",
        });

        expect(prisma.expense.create).not.toHaveBeenCalled();
      });
    });

    describe("PUT /api/expenses/:id", () => {
      it("should update an existing expense belonging to the authenticated user", async () => {
        const userId = "user-123";
        const expenseId = "expense-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const expenseInput = {
          description: "Updated office supplies",
          amount: 750,
          category: "Office",
          department: "IT",
          expenseDate: "2026-11-12",
        };

        const existingExpense = {
          id: expenseId,
          ...expenseInput,
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          createdAt: new Date("2026-11-12T10:00:00.000Z"),
          userId,
        };

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(existingExpense as never);

        vi.mocked(prisma.expense.update).mockResolvedValue(existingExpense as never);

        const response = await request(app)
          .put(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .send(expenseInput)
          .expect(200);

        expect(response.body.description).toBe("Updated office supplies");
        expect(response.body.amount).toBe(750);

        expect(prisma.expense.update).toHaveBeenCalledWith({
          where: {
            id: expenseId,
            userId,
          },
          data: {
            ...expenseInput,
            expenseDate: new Date("2026-11-12"),
          },
        });
      });

      it("should return 404 when updating a non-existent expense", async () => {
        const userId = "user-123";
        const expenseId = "unknown-expense";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(null);

        const response = await request(app)
          .put(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            description: "Updated office supplies",
            amount: 750,
            category: "Office",
            department: "IT",
            expenseDate: "2026-11-12",
          })
          .expect(404);

        expect(response.body).toEqual({
          message: "Expense not found",
        });

        expect(prisma.expense.update).not.toHaveBeenCalled();
      });

      it("should reject an update with invalid expense data", async () => {
        const token = jwt.sign({ userId: "user-123" }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        const response = await request(app)
          .put("/api/expenses/expense-123")
          .set("Authorization", `Bearer ${token}`)
          .send({
            description: "Office supplies",
            amount: 0,
            category: "Office",
            department: "IT",
            expenseDate: "2026-11-12",
          })
          .expect(400);

        expect(response.body).toEqual({
          message: "Invalid expense data",
        });

        expect(prisma.expense.findFirst).not.toHaveBeenCalled();
        expect(prisma.expense.update).not.toHaveBeenCalled();
      });
    });

    describe("DELETE /api/expenses/:id", () => {
      it("should delete an existing expense belonging to the authenticated user", async () => {
        const userId = "user-123";
        const expenseId = "expense-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const existingExpense = {
          id: expenseId,
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          createdAt: new Date("2026-11-12T10:00:00.000Z"),
          userId,
        };

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(existingExpense as never);

        vi.mocked(prisma.expense.deleteMany).mockResolvedValue({
          count: 1,
        } as never);

        const response = await request(app)
          .delete(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.body).toEqual({
          message: "Expense deleted successfully",
        });

        expect(prisma.expense.findFirst).toHaveBeenCalledWith({
          where: {
            id: expenseId,
            userId,
          },
        });

        expect(prisma.expense.deleteMany).toHaveBeenCalledWith({
          where: {
            id: expenseId,
            userId,
          },
        });
      });

      it("should return 404 when deleting a non-existent expense", async () => {
        const userId = "user-123";
        const expenseId = "unknown-expense";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        vi.mocked(prisma.expense.findFirst).mockResolvedValue(null);

        const response = await request(app)
          .delete(`/api/expenses/${expenseId}`)
          .set("Authorization", `Bearer ${token}`)
          .expect(404);

        expect(response.body).toEqual({
          message: "Expense not found",
        });

        expect(prisma.expense.deleteMany).not.toHaveBeenCalled();
      });
    });

    describe("GET /api/expenses/export", () => {
      it("should export expenses as a CSV file for the authenticated user", async () => {
        const userId = "user-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        const mockExpenses = [
          {
            id: "expense-123",
            description: "Office supplies",
            amount: 500,
            category: "Office",
            department: "IT",
            expenseDate: new Date("2026-11-12T00:00:00.000Z"),
            createdAt: new Date("2026-11-12T10:00:00.000Z"),
            userId,
          },
        ];

        vi.mocked(prisma.expense.findMany).mockResolvedValue(mockExpenses as never);

        const response = await request(app)
          .get("/api/expenses/export")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.headers["content-type"]).toContain("text/csv");
        expect(response.headers["content-disposition"]).toContain("opex-expenses.csv");

        expect(response.text).toContain("Office supplies");
        expect(response.text).toContain("500");

        expect(prisma.expense.findMany).toHaveBeenCalledWith({
          where: { userId },
          orderBy: {
            expenseDate: "desc",
          },
          select: {
            id: true,
            description: true,
            amount: true,
            category: true,
            department: true,
            expenseDate: true,
            createdAt: true,
          },
        });
      });

      it("should escape commas and quotation marks in CSV values", async () => {
        const userId = "user-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        vi.mocked(prisma.expense.findMany).mockResolvedValue([
          {
            id: "expense-789",
            description: 'Office supplies, "urgent"',
            amount: 500,
            category: "Office",
            department: "IT",
            expenseDate: new Date("2026-11-12T00:00:00.000Z"),
            createdAt: new Date("2026-11-12T10:00:00.000Z"),
            userId,
          },
        ] as never);

        const response = await request(app)
          .get("/api/expenses/export")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.text).toContain('"Office supplies, ""urgent"""');
      });

      it("should escape line breaks in CSV values", async () => {
        const userId = "user-123";

        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        vi.mocked(prisma.expense.findMany).mockResolvedValue([
          {
            id: "expense-790",
            description: "Office supplies\nUrgent purchase",
            amount: 500,
            category: "Office",
            department: "IT",
            expenseDate: new Date("2026-11-12T00:00:00.000Z"),
            createdAt: new Date("2026-11-12T10:00:00.000Z"),
            userId,
          },
        ] as never);

        const response = await request(app)
          .get("/api/expenses/export")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);

        expect(response.text).toContain('"Office supplies\nUrgent purchase"');
      });
    });
  });
});

it("should reject requests with an invalid authentication token", async () => {
  const response = await request(app)
    .get("/api/expenses")
    .set("Authorization", "Bearer invalid-token")
    .expect(401);

  expect(response.body).toEqual({
    message: "Invalid or expired authentication token",
  });
});
