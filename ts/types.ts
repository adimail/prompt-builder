export const blockTypes = [
  "Instruction",
  "Context",
  "Constraint",
  "Variable",
  "Example",
] as const;

export type BlockType = (typeof blockTypes)[number];

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  isCollapsed: boolean;
}

export interface Prompt {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blocks: Block[];
}

export interface AppState {
  theme: "light" | "dark";
  currentView: "editor" | "templates";
  prompts: Prompt[];
  currentPromptId: string | null;
}