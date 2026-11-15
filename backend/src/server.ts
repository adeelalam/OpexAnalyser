import app from "./app.js";
import { prisma } from "./db/prisma.js";
import { logger } from "./utils/logger.js";

const PORT = 3000;

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, "OpexAnalyser API server started");
});

// Gracefully shut down the server
async function shutdown(signal: string) {
  logger.info({ signal }, "Shutdown signal received");

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, "Error closing HTTP server");
      process.exit(1);
    }

    try {
      await prisma.$disconnect();

      logger.info("Database connection closed");
      logger.info("OpexAnalyser API server shut down successfully");

      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, "Error disconnecting from database");
      process.exit(1);
    }
  });
}

// Handle operating system shutdown signals
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
