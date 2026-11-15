import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { apiLimiter, authLimiter } from "../src/middleware/rateLimiters.js";

describe("Rate Limiting", () => {
  it("should block API requests after 100 requests", async () => {
    const app = express();

    app.use(apiLimiter);
    app.get("/test", (_req, res) => {
      res.status(200).json({ message: "OK" });
    });

    for (let i = 0; i < 100; i++) {
      await request(app).get("/test").expect(200);
    }

    const response = await request(app).get("/test").expect(429);

    expect(response.body).toEqual({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  });

  it("should block authentication requests after 10 attempts", async () => {
    const app = express();

    app.use(authLimiter);
    app.post("/login", (_req, res) => {
      res.status(200).json({ message: "Login endpoint" });
    });

    for (let i = 0; i < 10; i++) {
      await request(app).post("/login").expect(200);
    }

    const response = await request(app).post("/login").expect(429);

    expect(response.body).toEqual({
      success: false,
      message: "Too many authentication attempts. Please try again later.",
    });
  });
});
