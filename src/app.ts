import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./routes/auth.routes";
import { healthRouter } from "./routes/health.routes";
import testRoutes from "./routes/test.routes";
import { errorReportRouter } from "./routes/errorReport.routes";
import aiRoutes from "./routes/ai.routes";
import searchRoutes from "./routes/search.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { swaggerUi, swaggerDocument } from "./docs/swagger";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  pinoHttp({
    logger
  })
);

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRoutes);
app.use("/api/errors", errorReportRouter);
app.use("/api", aiRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DebugMate AI API 🚀",
    version: "1.0.0",
    documentation: "/docs",
    status: "running"
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  });
});

app.use(errorHandler);

