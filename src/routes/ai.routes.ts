import { Router } from "express";
import { analyzeReport } from "../controllers/aiAnalysis.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/errors/:id/analyze",
  authenticate,
  asyncHandler(analyzeReport)
);

export default router;