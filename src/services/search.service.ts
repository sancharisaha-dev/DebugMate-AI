import { prisma } from "../config/prisma";

export async function searchReports(
  userId: string,
  query: string
) {
  const reports = await prisma.errorReport.findMany({
    where: {
      userId,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          rawError: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          language: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          framework: {
            contains: query,
            mode: "insensitive"
          }
        }
      ]
    },
    include: {
      analysis: true,
      tags: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  await prisma.searchHistory.create({
    data: {
      userId,
      query
    }
  });

  return reports;
}