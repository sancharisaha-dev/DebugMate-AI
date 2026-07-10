export function buildErrorAnalysisPrompt(data: {
  title: string;
  description?: string | null;
  rawError: string;
  language: string;
  framework?: string | null;
}) {
  return `
You are a senior software engineer.

Analyze this software error.

Return ONLY valid JSON.

Schema:

{
  "summary": "...",
  "rootCause": "...",
  "explanation": "...",
  "severity":"LOW|MEDIUM|HIGH|CRITICAL",
  "confidence":95,
  "fixes":["...","..."],
  "prevention":["...","..."]
}

Title:
${data.title}

Description:
${data.description ?? "None"}

Language:
${data.language}

Framework:
${data.framework ?? "Unknown"}

Raw Error:
${data.rawError}
`;
}