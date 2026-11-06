
import express from "express";
import expenseRoutes from "./routes/expenseRoutes.js";

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
