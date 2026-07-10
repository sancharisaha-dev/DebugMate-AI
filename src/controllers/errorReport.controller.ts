import type { Request, Response } from "express";

import { sendSuccess } from "../utils/apiResponse";

import {
  createErrorReport as createErrorReportService,
  listErrorReports as listErrorReportsService,
  getErrorReportById as getErrorReportByIdService,
  updateErrorReport as updateErrorReportService,
  deleteErrorReport as deleteErrorReportService
} from "../services/errorReport.service";

export async function createErrorReport(req: Request, res: Response) {
  const report = await createErrorReportService(
    req.user!.id,
    req.body
  );

  sendSuccess(res, 201, report, "Error report created successfully");
}

export async function listErrorReports(req: Request, res: Response) {
  const page =
  typeof req.query.page === "string"
    ? parseInt(req.query.page)
    : undefined;

const limit =
  typeof req.query.limit === "string"
    ? parseInt(req.query.limit)
    : undefined;

const reports = await listErrorReportsService(
  req.user!.id,
  page,
  limit
);

  sendSuccess(res, 200, reports, "Reports fetched successfully");
}

export async function getErrorReportById(req: Request, res: Response) {
  const report = await getErrorReportByIdService(
    req.params.id,
    req.user!.id
  );

  sendSuccess(res, 200, report, "Report fetched successfully");
}

export async function updateErrorReport(req: Request, res: Response) {
  const report = await updateErrorReportService(
    req.params.id,
    req.user!.id,
    req.body
  );

  sendSuccess(res, 200, report, "Report updated successfully");
}

export async function deleteErrorReport(req: Request, res: Response) {
  const result = await deleteErrorReportService(
    req.params.id,
    req.user!.id
  );

  sendSuccess(res, 200, result, "Report deleted successfully");
}