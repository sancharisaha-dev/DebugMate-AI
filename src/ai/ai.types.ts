export interface AIAnalysisResult {
  summary: string;

  rootCause: string;

  explanation: string;

  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  fixes: string[];

  prevention: string[];

  confidence: number;
}