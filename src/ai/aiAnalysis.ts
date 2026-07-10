import { generateAI as generateGemini } from "./aiClient";
import { aiResponseSchema } from "./ai.schema";

export async function analyzeWithAI(prompt: string) {
  const raw = await generateGemini(prompt);

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return aiResponseSchema.parse(parsed);
}