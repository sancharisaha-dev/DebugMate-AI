import { prisma } from "../config/prisma";

export async function getAnalytics(userId: string) {
  const [
    totalReports,
    openReports,
    resolvedReports,
    ignoredReports,
    analyses,
    apiUsage,
    searches
  ] = await Promise.all([
    prisma.errorReport.count({
      where: { userId }
    }),

    prisma.errorReport.count({
      where: {
        userId,
        status: "OPEN"
      }
    }),

    prisma.errorReport.count({
      where: {
        userId,
        status: "RESOLVED"
      }
    }),

    prisma.errorReport.count({
      where: {
        userId,
        status: "IGNORED"
      }
    }),

    prisma.aIAnalysis.count({
      where: {
        errorReport: {
          userId
        }
      }
    }),

    prisma.apiUsage.aggregate({
      where: { userId },
      _sum: {
        totalTokens: true,
        processingTimeMs: true
      }
    }),

    prisma.searchHistory.count({
      where: { userId }
    })
  ]);

  return {
    totalReports,
    openReports,
    resolvedReports,
    ignoredReports,
    totalAnalyses: analyses,
    totalSearches: searches,
    totalTokens: apiUsage._sum.totalTokens ?? 0,
    totalProcessingTimeMs: apiUsage._sum.processingTimeMs ?? 0
  };
}