import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { analytics } from "../controllers/analytics.controller";

const router = Router();

router.get("/", authenticate, analytics);

export default router;