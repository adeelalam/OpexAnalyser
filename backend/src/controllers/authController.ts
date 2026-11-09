import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService.js";
import jwt from "jsonwebtoken";

function generateToken(userId: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: "Name, valid email and password (minimum 8 characters) are required",
    });
  }

  try {
    const user = await registerUser(name, email, password);
    const token = generateToken(user.id);

    return res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email is already registered") {
      return res.status(409).json({
        message: error.message,
      });
    }

    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await loginUser(email, password);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user.id);

  return res.status(200).json({
    message: "Login successful",
    user,
    token,
  });
}
