export const blockTypes = [
  'Role',
  'Instruction',
  'Context',
  'Constraint',
  'Variable',
  'Example',
] as const;

export type BlockType = (typeof blockTypes)[number];
export type JsonBuilderType = 'Video' | 'Image' | 'UI' | 'Custom';
export const paraphraseModes = ['Funny', 'Strict', 'Grammar Fix', 'Custom'] as const;
export type ParaphraseMode = (typeof paraphraseModes)[number];

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  isCollapsed: boolean;
}

export type PromptFormat = 'blocks' | 'json';

export interface Prompt {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  format: PromptFormat;
  blocks: Block[];
  content: string;
}

export type AppView = 'editor' | 'templates' | 'settings' | 'json-builder' | 'paraphrase';

export interface PersistedState {
  currentView: AppView;
  prompts: Prompt[];
  currentPromptId: string | null;
}

export interface AppState extends PersistedState {
  actions: AppActions;
}

export interface AppActions {
  setView: (view: AppView) => void;
  loadPrompt: (promptId: string) => void;
  createNewPrompt: (name: string) => void;
  loadGeneratedPrompt: (prompt: Prompt) => void;
  deletePrompt: (promptId: string) => void;
  deleteAllPrompts: () => void;
  updateCurrentPromptName: (name: string) => void;
  importPrompts: (importedPrompts: any[]) => number;
  saveJsonPrompt: (name: string, content: string) => void;
  addBlock: (type: BlockType, index?: number) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  updateBlockContent: (blockId: string, content: string) => void;
  updatePromptContent: (content: string) => void;
  reorderBlocks: (draggedId: string, targetId: string | null) => void;
  toggleBlockCollapse: (blockId: string) => void;
}