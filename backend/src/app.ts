import express from "express";
import expenseRoutes from "./routes/expenseRoutes.js";
import { prisma } from "./db/prisma.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// CORS: allow requests from the Vue frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Middleware: allows Express to read JSON request bodies
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    application: "OpexAnalyser",
    message: "Backend API is running",
  });
});

// Health-check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/expenses", expenseRoutes);

app.use("/api/auth", authRoutes);

app.get("/health/database", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "Connected",
      database: "PostgreSQL",
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(503).json({
      status: "Unavailable",
      message: "Could not connect to the database",
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Centralized error handler — must be last
app.use(errorHandler);

export default app;
