import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { getPagination } from "../utils/pagination";
import type {
  CreateErrorReportInput,
  UpdateErrorReportInput
} from "../validators/errorReport.schema";
import { analyzeErrorReport } from "./aiAnalysis.service";

export async function createErrorReport(
  userId: string,
  data: CreateErrorReportInput
) {
  const report = await prisma.errorReport.create({
    data: {
      ...data,
      userId
    }
  });

  // Generate AI in background
  analyzeErrorReport(report.id, report.userId).catch((err) => {
    console.error("AI generation failed:", err);
  });

  return prisma.errorReport.findUnique({
    where: {
      id: report.id
    },
    include: {
      analysis: true,
      tags: true
    }
  });
}

export async function listErrorReports(
  userId: string,
  page?: number,
  limit?: number
) {
  const pagination = getPagination(page, limit);

  const [reports, total] = await Promise.all([
    prisma.errorReport.findMany({
      where: {
        userId
      },
      include: {
        analysis: true,
        tags: true
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: pagination.skip,
      take: pagination.limit
    }),
    prisma.errorReport.count({
      where: {
        userId
      }
    })
  ]);

  return {
    reports,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit)
    }
  };
}

export async function getErrorReportById(
  reportId: string,
  userId: string
) {
  const report = await prisma.errorReport.findFirst({
    where: {
      id: reportId,
      userId
    },
    include: {
      analysis: true,
      tags: true
    }
  });

  if (!report) {
    throw new AppError(
      "Error report not found",
      404,
      "REPORT_NOT_FOUND"
    );
  }

  return report;
}

export async function updateErrorReport(
  reportId: string,
  userId: string,
  data: UpdateErrorReportInput
) {
  await getErrorReportById(reportId, userId);

  return prisma.errorReport.update({
    where: {
      id: reportId
    },
    data,
    include: {
      analysis: true,
      tags: true
    }
  });
}

export async function deleteErrorReport(
  reportId: string,
  userId: string
) {
  await getErrorReportById(reportId, userId);

  await prisma.errorReport.delete({
    where: {
      id: reportId
    }
  });

  return {
    deleted: true
  };
}