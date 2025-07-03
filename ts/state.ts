import { generateId } from "./utils.js";
import { AppState, Prompt, Block, BlockType } from "./types.js";

const LOCAL_STORAGE_KEY = "promptBuilderState";

function createNewPromptObject(name: string = "Untitled Prompt"): Prompt {
  return {
    id: generateId(),
    name: name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [],
  };
}

const defaultState: AppState = {
  theme: "light",
  currentView: "editor",
  prompts: [],
  currentPromptId: null,
};

export let state: AppState = {} as AppState;

export function getCurrentPrompt(): Prompt | undefined {
  return state.prompts.find((p) => p.id === state.currentPromptId);
}

export function loadState() {
  const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
  let savedState: any;
  if (savedStateJSON) {
    savedState = JSON.parse(savedStateJSON);
  }

  if (savedState && savedState.currentPrompt && !savedState.prompts) {
    const migratedState: AppState = {
      theme: savedState.theme || "light",
      currentView: "editor",
      prompts: [
        {
          ...savedState.currentPrompt,
          updatedAt: savedState.currentPrompt.createdAt,
        },
      ],
      currentPromptId: savedState.currentPrompt.id,
    };
    Object.assign(state, migratedState);
    saveState();
    return;
  }

  if (savedState) {
    Object.assign(state, savedState);
  } else {
    Object.assign(state, JSON.parse(JSON.stringify(defaultState)));
  }

  if (!state.prompts) {
    state.prompts = [];
  }
  if (!state.prompts.find((p) => p.id === state.currentPromptId)) {
    state.currentPromptId = state.prompts[0]?.id || null;
  }
}

export function saveState() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function setView(view: "editor" | "templates") {
  state.currentView = view;
}

export function createNewPrompt(name: string): Prompt {
  const newPrompt = createNewPromptObject(name);
  state.prompts.unshift(newPrompt);
  state.currentPromptId = newPrompt.id;
  return newPrompt;
}

export function saveCurrentPrompt() {
  const prompt = getCurrentPrompt();
  if (prompt) {
    prompt.updatedAt = new Date().toISOString();
  }
}

export function loadPrompt(promptId: string) {
  const prompt = state.prompts.find((p) => p.id === promptId);
  if (prompt) {
    state.currentPromptId = promptId;
  }
}

export function deletePrompt(promptId: string) {
  const index = state.prompts.findIndex((p) => p.id === promptId);
  if (index === -1) return;

  state.prompts.splice(index, 1);

  if (state.currentPromptId === promptId) {
    state.currentPromptId = state.prompts[0]?.id || null;
  }
}

export function updateCurrentPromptName(newName: string) {
  const prompt = getCurrentPrompt();
  if (prompt) {
    prompt.name = newName.trim() || "Untitled Prompt";
    prompt.updatedAt = new Date().toISOString();
  }
}

export function importPrompts(importedPrompts: any[]): number {
  if (!Array.isArray(importedPrompts)) {
    console.error("Import failed: data is not an array.");
    return 0;
  }
  let importCount = 0;
  importedPrompts.forEach((p) => {
    if (p.id && p.name && Array.isArray(p.blocks)) {
      if (!state.prompts.some((existing) => existing.id === p.id)) {
        state.prompts.push(p as Prompt);
        importCount++;
      }
    }
  });
  return importCount;
}

export function addBlock(type: BlockType, index?: number) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const newBlock: Block = {
    id: generateId(),
    type,
    content: "",
    isCollapsed: false,
  };
  if (index === undefined) {
    prompt.blocks.push(newBlock);
  } else {
    prompt.blocks.splice(index, 0, newBlock);
  }
}

export function duplicateBlock(blockId: string) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const originalIndex = prompt.blocks.findIndex((b) => b.id === blockId);
  if (originalIndex === -1) return;

  const originalBlock = prompt.blocks[originalIndex];
  const newBlock: Block = {
    ...JSON.parse(JSON.stringify(originalBlock)),
    id: generateId(),
  };

  prompt.blocks.splice(originalIndex + 1, 0, newBlock);
}

export function updateBlockContent(blockId: string, content: string) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const block = prompt.blocks.find((b) => b.id === blockId);
  if (block) {
    block.content = content;
  }
}

export function deleteBlock(blockId: string) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  prompt.blocks = prompt.blocks.filter((b) => b.id !== blockId);
}

export function reorderBlocks(draggedId: string, targetId: string | null) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const blocks = prompt.blocks;
  const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
  if (draggedIndex === -1) return;

  const [draggedBlock] = blocks.splice(draggedIndex, 1);

  if (targetId) {
    const targetIndex = blocks.findIndex((b) => b.id === targetId);
    if (targetIndex !== -1) {
      blocks.splice(targetIndex, 0, draggedBlock);
    } else {
      blocks.push(draggedBlock);
    }
  } else {
    blocks.push(draggedBlock);
  }
}

export function toggleBlockCollapse(blockId: string) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const block = prompt.blocks.find((b) => b.id === blockId);
  if (block) {
    block.isCollapsed = !block.isCollapsed;
  }
}

export function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveState();
}
