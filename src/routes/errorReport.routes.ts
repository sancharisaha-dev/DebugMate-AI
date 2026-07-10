import { Router } from "express";

import {
  createErrorReport,
  listErrorReports,
  getErrorReportById,
  updateErrorReport,
  deleteErrorReport
} from "../controllers/errorReport.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";

import {
  createErrorReportSchema,
  listErrorReportsSchema,
  getErrorReportSchema,
  updateErrorReportSchema,
  deleteErrorReportSchema
} from "../validators/errorReport.schema";

export const errorReportRouter = Router();

errorReportRouter.post(
  "/",
  authenticate,
  validate(createErrorReportSchema),
  asyncHandler(createErrorReport)
);

errorReportRouter.get(
  "/",
  authenticate,
  validate(listErrorReportsSchema),
  asyncHandler(listErrorReports)
);

errorReportRouter.get(
  "/:id",
  authenticate,
  validate(getErrorReportSchema),
  asyncHandler(getErrorReportById)
);

errorReportRouter.patch(
  "/:id",
  authenticate,
  validate(updateErrorReportSchema),
  asyncHandler(updateErrorReport)
);

errorReportRouter.delete(
  "/:id",
  authenticate,
  validate(deleteErrorReportSchema),
  asyncHandler(deleteErrorReport)
);