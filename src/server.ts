import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, () => {
  logger.info(`DebugMate AI API running on port ${env.PORT}`);
});

function shutdown(signal: string): void {
  logger.info({ signal }, "Shutting down server");
  server.close(() => {
    logger.info("Server closed");
    void prisma.$disconnect().finally(() => {
      process.exit(0);
    });
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
