import { GoogleGenAI } from '@google/genai';
import { Block, Prompt, JsonBuilderType, ParaphraseMode } from '../types';

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

export async function streamPromptGeneration(
  apiKey: string,
  modelId: string,
  temperature: number,
  topP: number,
  requirements: string,
  onStream: (chunk: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert prompt architect. Your task is to generate a structured prompt based on a user's requirements.

The user wants a prompt for: "${requirements}"

**OUTPUT FORMAT INSTRUCTIONS:**
Do NOT output JSON.
Output the prompt as a series of blocks.
Each block must start with a specific separator containing the block type, followed by the content.

The separator format is exactly:
===
~~ TYPE
===

Where TYPE is one of: NAME, Role, Instruction, Context, Constraint, Variable, Example.

**IMPORTANT:**
1. The FIRST block MUST be of type "NAME". The content should be a concise, descriptive title for the prompt.
2. Subsequent blocks should be the actual prompt components (Role, Instruction, etc.).
3. Start immediately with the first block separator.
4. Do not add any introductory text or markdown code blocks.

Example Output:
===
~~ NAME
===
Data Analysis Assistant
===
~~ Role
===
You are an expert data scientist.
===
~~ Instruction
===
Analyze the following dataset...

Generate the prompt now.`;

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
    Video: `You are an AI that converts a user’s video description into a reproducible, richly detailed JSON for video generation.

Input: “${description}”

  Base fields (for reproduction):
  - prompt_text
  - negative_prompt
  - style
  - resolution
  - seed
  - steps
  - background
  - lighting

  Dynamic fields (inferred to enrich scene and motion):  
  - character_count (int)  
  - atmosphere (string)  
  - color_theme (string)  
  - time_setting (string)  
  - object_details (array of { type, quantity })  
  - behavior_profiles (array of { object_type, behavior, speed, path })  
  - interactions (array of { subject, object, interaction_type })  
  - camera_movement (string)  
  - transitions (array of strings)  
  - soundtrack (string)  
  - special_effects (array of strings)  

For each behavior_profile, infer how each object moves (e.g. “butterflies fluttering along a spiral path at slow speed”) and for interactions describe how elements relate (e.g. “water ripples reacting to stones thrown”). Populate all fields to fully realize the user’s vision and ensure seed, steps, duration, and frame_rate guarantee identical output each time.`,
    Image: `You are an AI that turns a user's image description into a reproducible, richly detailed JSON for image generation.

Input: “${description}”

Output: a JSON object containing:

  Base fields (for reproduction):  
  - prompt_text  
  - negative_prompt  
  - style  
  - resolution  
  - seed  
  - steps  
  - background  
  - lighting  

  Dynamic fields (inferred from the scene to enrich detail):  
  - character_count (int)  
  - atmosphere (string)  
  - color_theme (string)  
  - action (string)  
  - object_details (array of objects with type and quantity)  
  - time_setting (string)  
  - special_effects (array of strings)  

Populate each field with types and values that match and enhance the user's description. Ensure the seed and steps guarantee identical output each time.`,
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

export async function streamParaphrasedText(
  apiKey: string,
  modelId: string,
  temperature: number,
  topP: number,
  mode: ParaphraseMode,
  customInstruction: string,
  textToParaphrase: string,
  numberOfVariations: number,
  onStream: (chunk: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });

  let instruction = '';
  switch (mode) {
    case 'Funny':
      instruction =
        'Rewrite the following text to be more humorous, witty, and funny. Use clever wordplay and exaggeration if appropriate.';
      break;
    case 'Strict':
      instruction =
        'Rewrite the following text to be more formal, professional, and strict. Use precise language and a serious tone.';
      break;
    case 'Casual':
      instruction =
        'Rewrite the following text in a more casual, relaxed, and conversational tone. Use everyday language.';
      break;
    case 'Professional':
      instruction =
        'Rewrite the following text to be more professional, formal, and suitable for a business context. Avoid slang and use clear, concise language.';
      break;
    case 'Poetic':
      instruction =
        'Rewrite the following text into a more poetic and artistic form. Use figurative language, imagery, and rhythm.';
      break;
    case 'Academic':
      instruction =
        'Rewrite the following text in a formal, academic style. Use sophisticated vocabulary and a structured, objective tone.';
      break;
    case 'Simplify':
      instruction =
        "Rewrite the following text to be simpler and easier to understand. Use basic vocabulary and short sentences. Explain it like I'm 5 years old.";
      break;
    case 'Expand':
      instruction =
        'Expand on the following text, adding more detail, explanation, and examples to make it more comprehensive. Elaborate on the key points.';
      break;
    case 'Grammar Fix':
      instruction =
        'Correct any grammatical errors, spelling mistakes, and punctuation issues in the following text. Improve sentence structure and clarity while preserving the original meaning.';
      break;
    case 'Custom':
      instruction = customInstruction || 'Paraphrase the following text.';
      break;
  }

  const variationInstruction =
    numberOfVariations > 1
      ? `Generate ${numberOfVariations} different versions of the text. Separate each version with "---VARIATION_SEPARATOR---". Do not number the variations or add any other formatting between them.`
      : 'Generate one version of the text.';

  const prompt = `${instruction}

${variationInstruction}

Here is the text:
---
${textToParaphrase}
---

Provide only the paraphrased text as your response. Do not include any preamble, explanation, or markdown formatting.`;

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
