export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

export const availableModels: GeminiModel[] = [
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    description:
      "Google's most powerful agentic and coding model. As a 'thinking model', it reasons before responding, offering state-of-the-art performance in complex instruction following and multimodal understanding with a 1M token context window.",
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description:
      "This is Google's most advanced reasoning model, capable of tackling complex problems across various domains like coding, math, and STEM. It excels in multimodal understanding and can process long contexts.",
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description:
      "Optimized for price-performance, this model offers well-rounded capabilities and is suitable for tasks requiring adaptive thinking and cost efficiency. It's ideal for large-scale processing, low-latency, and high-volume use cases.",
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    description:
      'This is the fastest and most cost-efficient Gemini 2.5 model, designed for high-throughput tasks.',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description:
      'This model offers next-generation features, improved speed, and real-time streaming capabilities.',
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: 'A cost-efficient and low-latency version of Gemini 2.0 Flash.',
  },
];

export const defaultModelId = 'gemini-2.5-flash';
