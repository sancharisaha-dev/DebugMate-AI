import { z } from "zod";

const httpMethodEnum = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
]);

const severityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
]);

export const createErrorReportSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().max(1000).optional(),
    rawError: z.string().trim().min(5),
    language: z.string().trim().min(2).max(50),
    framework: z.string().trim().max(50).optional(),
    endpoint: z.string().trim().max(200).optional(),
    httpMethod: httpMethodEnum.optional(),
    severity: severityEnum.optional()
  })
});

export const updateErrorReportSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    title: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().max(1000).optional(),
    framework: z.string().trim().max(50).optional(),
    endpoint: z.string().trim().max(200).optional(),
    severity: severityEnum.optional(),
    status: z.enum(["OPEN", "RESOLVED", "IGNORED"]).optional()
  })
});

export const getErrorReportSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  })
});

export const listErrorReportsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional()
  })
});

export const deleteErrorReportSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  })
});

export type CreateErrorReportInput =
  z.infer<typeof createErrorReportSchema>["body"];

export type UpdateErrorReportInput =
  z.infer<typeof updateErrorReportSchema>["body"];