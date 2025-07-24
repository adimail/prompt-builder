export const blockTypes = [
  'Role',
  'Instruction',
  'Context',
  'Constraint',
  'Variable',
  'Example',
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

export type AppView = 'editor' | 'templates' | 'settings' | 'json-config';

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
  updateCurrentPromptName: (name: string) => void;
  importPrompts: (importedPrompts: any[]) => number;
  addBlock: (type: BlockType, index?: number) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  updateBlockContent: (blockId: string, content: string) => void;
  reorderBlocks: (draggedId: string, targetId: string | null) => void;
  toggleBlockCollapse: (blockId: string) => void;
}