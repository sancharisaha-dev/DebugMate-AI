import { z } from "zod";

export const aiResponseSchema = z.object({
  summary: z.string(),
  rootCause: z.string(),
  fix: z.string(),
  severity: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
  ]),
  confidence: z.number().min(0).max(100),
  tags: z.array(z.string())
});

export type AIResponse =
  z.infer<typeof aiResponseSchema>;