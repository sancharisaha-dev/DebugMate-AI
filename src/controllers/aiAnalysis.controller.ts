import type { Request, Response } from "express";
import { analyzeErrorReport } from "../services/aiAnalysis.service";
import { sendSuccess } from "../utils/apiResponse";

export async function analyzeReport(
  req: Request,
  res: Response
): Promise<void> {
  const analysis = await analyzeErrorReport(
    req.params.id,
    req.user!.id
  );

  sendSuccess(
    res,
    200,
    analysis,
    "AI analysis generated successfully"
  );
}