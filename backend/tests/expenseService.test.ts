import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Prisma so tests never access the real database
vi.mock("../src/db/prisma.js", () => ({
  prisma: {
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
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
} from "../src/services/expenseService.js";

const mockedFindMany = vi.mocked(prisma.expense.findMany);

describe("Expense Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllExpenses", () => {
    it("should retrieve expenses belonging to the specified user", async () => {
      const userId = "user-123";

      const mockExpenses = [
        {
          id: "expense-1",
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
        },
      ];

      mockedFindMany.mockResolvedValue(mockExpenses as never);

      const result = await getAllExpenses(userId);

      // Verify returned expenses
      expect(result).toEqual(mockExpenses);

      // Verify Prisma filters by user ID
      expect(mockedFindMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: {
          expenseDate: "desc",
        },
      });

      expect(mockedFindMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getExpenseById", () => {
    it("should retrieve an expense belonging to the specified user", async () => {
      const expenseId = "expense-123";
      const userId = "user-123";

      const mockExpense = {
        id: expenseId,
        description: "Office supplies",
        amount: 500,
        category: "Office",
        department: "IT",
      };

      const mockedFindFirst = vi.mocked(prisma.expense.findFirst);

      mockedFindFirst.mockResolvedValue(mockExpense as never);

      const result = await getExpenseById(expenseId, userId);

      expect(result).toEqual(mockExpense);

      expect(mockedFindFirst).toHaveBeenCalledWith({
        where: {
          id: expenseId,
          userId,
        },
      });

      expect(mockedFindFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe("createExpense", () => {
    it("should create an expense with trimmed values and the correct user ID", async () => {
      const userId = "user-123";

      const expenseData = {
        description: "  Office supplies  ",
        amount: 500,
        category: "  Office  ",
        department: "  IT  ",
        expenseDate: "2026-11-12",
      };

      const mockedCreate = vi.mocked(prisma.expense.create);

      const mockCreatedExpense = {
        id: "expense-123",
        description: "Office supplies",
        amount: 500,
        category: "Office",
        department: "IT",
        expenseDate: new Date("2026-11-12T00:00:00.000Z"),
        userId,
      };

      mockedCreate.mockResolvedValue(mockCreatedExpense as never);

      const result = await createExpense(expenseData, userId);

      expect(result).toEqual(mockCreatedExpense);

      expect(mockedCreate).toHaveBeenCalledWith({
        data: {
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          userId,
        },
      });

      expect(mockedCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateExpense", () => {
    it("should update an expense belonging to the specified user", async () => {
      const expenseId = "expense-123";
      const userId = "user-123";

      const expenseData = {
        description: "  Updated office supplies  ",
        amount: 750,
        category: "  Office  ",
        department: "  IT  ",
        expenseDate: "2026-11-12",
      };

      const mockedUpdate = vi.mocked(prisma.expense.update);

      const mockUpdatedExpense = {
        id: expenseId,
        description: "Updated office supplies",
        amount: 750,
        category: "Office",
        department: "IT",
        expenseDate: new Date("2026-11-12T00:00:00.000Z"),
        userId,
      };

      mockedUpdate.mockResolvedValue(mockUpdatedExpense as never);

      const result = await updateExpense(expenseId, expenseData, userId);

      expect(result).toEqual(mockUpdatedExpense);

      expect(mockedUpdate).toHaveBeenCalledWith({
        where: {
          id: expenseId,
          userId,
        },
        data: {
          description: "Updated office supplies",
          amount: 750,
          category: "Office",
          department: "IT",
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
        },
      });

      expect(mockedUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteExpense", () => {
    it("should delete an expense belonging to the specified user", async () => {
      const expenseId = "expense-123";
      const userId = "user-123";

      const mockedDeleteMany = vi.mocked(prisma.expense.deleteMany);

      mockedDeleteMany.mockResolvedValue({ count: 1 } as never);

      const result = await deleteExpense(expenseId, userId);

      expect(result).toEqual({ count: 1 });

      expect(mockedDeleteMany).toHaveBeenCalledWith({
        where: {
          id: expenseId,
          userId,
        },
      });

      expect(mockedDeleteMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("exportExpenses", () => {
    it("should export expenses belonging to the specified user", async () => {
      const userId = "user-123";

      const mockExpenses = [
        {
          id: "expense-123",
          description: "Office supplies",
          amount: 500,
          category: "Office",
          department: "IT",
          expenseDate: new Date("2026-11-12T00:00:00.000Z"),
          createdAt: new Date("2026-11-12T10:00:00.000Z"),
        },
      ];

      const mockedFindMany = vi.mocked(prisma.expense.findMany);

      mockedFindMany.mockResolvedValue(mockExpenses as never);

      const result = await exportExpenses(userId);

      expect(result).toEqual(mockExpenses);

      expect(mockedFindMany).toHaveBeenCalledWith({
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

      expect(mockedFindMany).toHaveBeenCalledTimes(1);
    });
  });
});
