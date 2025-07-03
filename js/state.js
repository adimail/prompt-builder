import { generateId } from "./utils.js";

const LOCAL_STORAGE_KEY = "promptBuilderState";

function createNewPromptObject(name = "Untitled Prompt") {
  return {
    id: generateId(),
    name: name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [],
  };
}

const defaultState = {
  theme: "light",
  currentView: "editor",
  prompts: [],
  currentPromptId: null,
};

export let state = {};

export function getCurrentPrompt() {
  return state.prompts.find((p) => p.id === state.currentPromptId);
}

export function loadState() {
  const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
  let savedState;
  if (savedStateJSON) {
    savedState = JSON.parse(savedStateJSON);
  }

  if (savedState && savedState.currentPrompt && !savedState.prompts) {
    const migratedState = {
      theme: savedState.theme || "light",
      currentView: "editor",
      prompts: [
        { ...savedState.currentPrompt, updatedAt: savedState.currentPrompt.createdAt },
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

export function setView(view) {
  state.currentView = view;
}

export function createNewPrompt(name) {
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

export function loadPrompt(promptId) {
  const prompt = state.prompts.find((p) => p.id === promptId);
  if (prompt) {
    state.currentPromptId = promptId;
  }
}

export function deletePrompt(promptId) {
  const index = state.prompts.findIndex((p) => p.id === promptId);
  if (index === -1) return;

  state.prompts.splice(index, 1);

  if (state.currentPromptId === promptId) {
    state.currentPromptId = state.prompts[0]?.id || null;
  }
}

export function updateCurrentPromptName(newName) {
  const prompt = getCurrentPrompt();
  if (prompt) {
    prompt.name = newName.trim() || "Untitled Prompt";
    prompt.updatedAt = new Date().toISOString();
  }
}

export function importPrompts(importedPrompts) {
  if (!Array.isArray(importedPrompts)) {
    console.error("Import failed: data is not an array.");
    return 0;
  }
  let importCount = 0;
  importedPrompts.forEach((p) => {
    if (p.id && p.name && Array.isArray(p.blocks)) {
      if (!state.prompts.some((existing) => existing.id === p.id)) {
        state.prompts.push(p);
        importCount++;
      }
    }
  });
  return importCount;
}

export function addBlock(type, index) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const newBlock = {
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

export function duplicateBlock(blockId) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const originalIndex = prompt.blocks.findIndex((b) => b.id === blockId);
  if (originalIndex === -1) return;

  const originalBlock = prompt.blocks[originalIndex];
  const newBlock = {
    ...JSON.parse(JSON.stringify(originalBlock)),
    id: generateId(),
  };

  prompt.blocks.splice(originalIndex + 1, 0, newBlock);
}

export function updateBlockContent(blockId, content) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const block = prompt.blocks.find((b) => b.id === blockId);
  if (block) {
    block.content = content;
  }
}

export function deleteBlock(blockId) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  prompt.blocks = prompt.blocks.filter((b) => b.id !== blockId);
}

export function reorderBlocks(draggedId, targetId) {
  const prompt = getCurrentPrompt();
  if (!prompt) return;
  const blocks = prompt.blocks;
  const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
  const [draggedBlock] = blocks.splice(draggedIndex, 1);

  if (targetId) {
    const targetIndex = blocks.findIndex((b) => b.id === targetId);
    blocks.splice(targetIndex, 0, draggedBlock);
  } else {
    blocks.push(draggedBlock);
  }
}

export function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  saveState();
}
