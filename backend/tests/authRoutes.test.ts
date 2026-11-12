import { beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// Mock Prisma to avoid connecting to the real database.
vi.mock("../src/db/prisma.js", () => ({
  prisma: {
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
    $queryRaw: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-test-password"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

import { prisma } from "../src/db/prisma.js";
import app from "../src/app.js";

describe("Authentication API Integration Tests", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-for-integration-tests";
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return an authentication token", async () => {
      const mockUser = {
        id: "user-456",
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date("2026-11-12T10:00:00.000Z"),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: " Test User ",
          email: " TEST@EXAMPLE.COM ",
          password: "Password123",
        })
        .expect(201);

      expect(response.body.message).toBe("Registration successful");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.name).toBe("Test User");
      expect(response.body.user.passwordHash).toBeUndefined();

      expect(response.body.token).toBeDefined();

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET!) as jwt.JwtPayload;

      expect(decoded.userId).toBe("user-456");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Test User",
          email: "test@example.com",
          passwordHash: expect.any(String),
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    });

    it("should reject registration with invalid data", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "",
          email: "test@example.com",
          password: "short",
        })
        .expect(400);

      expect(response.body).toEqual({
        message: "Name, valid email and password (minimum 8 characters) are required",
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("should reject registration when the email is already registered", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "existing-user",
        name: "Existing User",
        email: "test@example.com",
        passwordHash: "existing-hash",
        createdAt: new Date("2026-11-12T10:00:00.000Z"),
      } as never);

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: "test@example.com",
          password: "Password123",
        })
        .expect(409);

      expect(response.body).toEqual({
        message: "Email is already registered",
      });

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user and return an authentication token", async () => {
      const mockUser = {
        id: "user-456",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "$2b$12$mockedPasswordHash",
        createdAt: new Date("2026-11-12T10:00:00.000Z"),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as never);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "TEST@EXAMPLE.COM",
          password: "Password123",
        })
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.token).toBeDefined();

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET!) as jwt.JwtPayload;

      expect(decoded.userId).toBe("user-456");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should reject login with invalid input", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "",
          password: "",
        })
        .expect(400);

      expect(response.body).toEqual({
        message: "Email and password are required",
      });

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("should reject login when the email does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unknown@example.com",
          password: "Password123",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });

    it("should reject login when the password is incorrect", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user-456",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed-test-password",
        createdAt: new Date("2026-11-12T10:00:00.000Z"),
      } as never);

      const { default: bcrypt } = await import("bcryptjs");
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword123",
        })
        .expect(401);

      expect(response.body).toEqual({
        message: "Invalid email or password",
      });
    });
  });
});
