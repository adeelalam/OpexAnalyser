
import express from "express";
import expenseRoutes from "./routes/expenseRoutes.js";
import { prisma } from "./db/prisma.js";

const app = express();

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
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
