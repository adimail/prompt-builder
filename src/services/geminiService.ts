import { GoogleGenAI } from "@google/genai";
import { Block, Prompt } from "../types";

export async function streamImprovedText(
  apiKey: string,
  blockToImprove: Block,
  fullPrompt: Prompt,
  onStream: (chunk: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });

  const fullPromptContext = fullPrompt.blocks
    .map(block => `// ${block.type.toUpperCase()}\n${block.content}`)
    .join('\n\n');

  const prompt = `You are an expert prompt engineer. Your task is to refine and improve a specific block within a larger prompt structure.

You will be given the full prompt, which is composed of several blocks (like ROLE, INSTRUCTION, CONTEXT, etc.). Your goal is to rewrite the content of **only one** of these blocks to make it more effective, clear, and synergistic with the other blocks.

The full prompt is:
---
// PROMPT NAME: ${fullPrompt.name}

${fullPromptContext}
---

The specific block you need to improve is the one with the type "${blockToImprove.type.toUpperCase()}" and the following content:
---
${blockToImprove.content}
---

Please provide **only** the improved text for this specific block. Do not add any preamble, explanation, or markdown formatting. Your output should be a direct replacement for the original block's content.`;

  const result = await ai.models.generateContentStream({
    model: "gemini-1.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  for await (const chunk of result) {
    const chunkText = chunk.text;
    if (typeof chunkText === "string") {
      onStream(chunkText);
    }
  }
}