import { Severity } from "@prisma/client";
import { z } from "zod";

export const aiResponseSchema = z.object({
  summary: z.string(),

  rootCause: z.string(),

  explanation: z.string(),

  severity: z.nativeEnum(Severity),

  confidence: z.number().min(0).max(100),

  fixes: z.array(z.string()),

  prevention: z.array(z.string())
});

export type AIResponse = z.infer<typeof aiResponseSchema>;