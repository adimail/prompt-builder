import { GoogleGenAI } from "@google/genai";

export async function streamImprovedText(
  apiKey: string,
  textToImprove: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert prompt engineer. Your task is to refine and improve the following text to make it a more effective and clear prompt block. Focus on clarity, specificity, and structure. Do not add any preamble, explanation, or markdown formatting. Only provide the improved text.

Here is the text to improve:
---
${textToImprove}
---
`;

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash", // or "gemini-2.5-flash"
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.text || "";
  return text;
}
