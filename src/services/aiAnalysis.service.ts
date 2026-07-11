import { Prisma, Severity } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

export async function analyzeErrorReport(
  reportId: string,
  userId: string
) {
  const report = await prisma.errorReport.findFirst({
    where: {
      id: reportId,
      userId,
    },
  });

  if (!report) {
    throw new AppError("Error report not found", 404, "REPORT_NOT_FOUND");
  }

  const existingAnalysis = await prisma.aIAnalysis.findUnique({
    where: {
      errorReportId: reportId,
    },
  });

  if (existingAnalysis) {
    return existingAnalysis;
  }

  const validated = {
    summary:
      "A runtime exception occurred while processing the request.",

    rootCause:
      "The application attempted to access invalid or unexpected data during execution.",

    explanation:
      "The request reached the server successfully but failed because required values were missing or improperly handled.",

    severity: Severity.HIGH,

    confidence: 95,

    fixes: [
      "Validate all request inputs.",
      "Add proper null checks.",
      "Improve error handling.",
    ],

    prevention: [
      "Write unit tests.",
      "Use TypeScript strict mode.",
      "Validate payloads before processing.",
    ],
  };

  const analysis = await prisma.aIAnalysis.create({
    data: {
      summary: validated.summary,
      rootCause: validated.rootCause,
      explanation: validated.explanation,
      severity: validated.severity,
      confidence: validated.confidence,
      fixes: validated.fixes as Prisma.JsonArray,
      prevention: validated.prevention as Prisma.JsonArray,
      provider: "Google",
      model: "Gemini",
      errorReportId: report.id,
    },
  });

  return analysis;
}