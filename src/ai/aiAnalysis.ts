import { generateAI } from "./aiClient";
import { aiResponseSchema } from "./ai.schema";

export async function analyzeWithAI(prompt: string) {
  const raw = await generateAI(prompt);

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return aiResponseSchema.parse(JSON.parse(cleaned));
}