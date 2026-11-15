import app from "./app.js";
import { logger } from "./utils/logger.js";

const PORT = 3000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, "OpexAnalyser API server started");
});
