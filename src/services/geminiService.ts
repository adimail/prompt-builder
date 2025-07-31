import { GoogleGenAI } from '@google/genai';
import { Block, Prompt } from '../types';
import { JsonBuilderType } from '../types';

export async function streamImprovedText(
  apiKey: string,
  modelId: string,
  temperature: number,
  topP: number,
  blockToImprove: Block,
  fullPrompt: Prompt,
  onStream: (chunk: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });

  const fullPromptContext = fullPrompt.blocks
    .map((block) => `// ${block.type.toUpperCase()}\n${block.content}`)
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
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature, topP },
  });

  for await (const chunk of result) {
    const chunkText = chunk.text;
    if (typeof chunkText === 'string') {
      onStream(chunkText);
    }
  }
}

export async function generatePromptFromScratch(
  apiKey: string,
  modelId: string,
  temperature: number,
  topP: number,
  requirements: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert prompt architect. Your task is to generate a structured prompt in JSON format based on a user's requirements.

The user wants a prompt for: "${requirements}"

Generate a JSON object that adheres to the following structure.
- The root object should have a "name" (string) and a "blocks" (array) property.
- The "name" should be a concise, descriptive title for the prompt, derived from the user's requirements.
- Each object in the "blocks" array represents a part of the prompt and must have:
  - "type": A string, one of "Role", "Instruction", "Context", "Constraint", "Variable", "Example".
  - "content": A string containing the text for that block.

**IMPORTANT RULES:**
1.  Analyze the user's requirements and break them down into logical blocks. Use a variety of block types where appropriate.
2.  The generated JSON MUST be a single, valid JSON object. Do not wrap it in markdown backticks or any other text.
3.  Do NOT include "id", "createdAt", "updatedAt", or "isCollapsed" fields. These will be added by the application.

**EXAMPLE OUTPUT FORMAT:**
{
  "name": "Creative Story Writer",
  "blocks": [
    {
      "type": "Role",
      "content": "You are a master storyteller, capable of weaving intricate plots and developing compelling characters."
    },
    {
      "type": "Instruction",
      "content": "Write a short story about a young cartographer who discovers a map that leads to a city that moves."
    }
  ]
}

Now, generate the JSON for the user's requirement. Your entire response must be only the JSON object.`;

  const result = await ai.models.generateContent({
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature, topP },
  });

  return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function streamJsonForBuilder(
  apiKey: string,
  modelId: string,
  temperature: number,
  topP: number,
  builderType: JsonBuilderType,
  description: string,
  onStream: (chunk: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });

  const typeInstructions = {
    Video: `Generate a JSON object representing a video. The user's description is: "${description}". The JSON should include fields like "title", "duration_seconds", "description", "tags" (an array of strings), and more. Infer the values from the user's description. If specific settings like lighting or color schemes are not explicitly mentioned, infer appropriate settings based on the overall description.`,
    Image: `Generate a JSON object for an image generation prompt. The user's description is: "${description}". The JSON should include fields like "prompt_text", "negative_prompt", "style" (e.g., "photorealistic", "anime", "impressionistic"), "resolution" (e.g., "1024x1024"), "seed", and "steps". Infer the values from the user's description. If details like lighting, colors, or environment are missing, infer suitable values to create a coherent and visually appealing image.`,
    UI: `Generate a JSON object describing a UI component or layout. The user's description is: "${description}". The JSON should represent a tree structure, with fields like "component_name", "properties" (an object of key-value pairs), and "children" (an array of other UI component objects).`,
    Custom: `Generate a well-structured JSON object based on the user's description. The user's description is: "${description}". Analyze the description to infer a logical schema, including keys, values, and nested structures. The structure should be intuitive and accurately represent the described data. If any settings or properties are not explicitly mentioned, infer reasonable defaults or values based on the context of the description.`,
  };

  const prompt = `You are an expert at creating structured JSON data based on natural language descriptions.

Your task is to generate a JSON object based on the user's chosen type and description.

Builder Type: "${builderType}"

**Instructions:**
1.  Follow the specific instructions for the chosen builder type:
    -   ${typeInstructions[builderType]}
2.  Your entire response MUST be a single, valid JSON object.
3.  Do not wrap the JSON in markdown backticks (\`\`\`json ... \`\`\`) or any other explanatory text. The output must be parsable JSON directly.

Generate the JSON now.`;

  const result = await ai.models.generateContentStream({
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature, topP },
  });

  for await (const chunk of result) {
    const chunkText = chunk.text;
    if (typeof chunkText === 'string') {
      onStream(chunkText);
    }
  }
}