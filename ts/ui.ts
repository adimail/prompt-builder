import { getCurrentPrompt, state } from "./state.js";
import { estimateTokens } from "./utils.js";
import { Block, BlockType, Prompt, blockTypes } from "./types.js";

interface BlockConfig {
  icon: string;
  color: string;
  name: string;
}

export const blockConfig: Record<BlockType, BlockConfig> = {
  Instruction: { icon: "article", color: "blue", name: "Instruction" },
  Context: { icon: "source", color: "purple", name: "Context" },
  Constraint: { icon: "gavel", color: "red", name: "Constraint" },
  Variable: { icon: "code", color: "green", name: "Variable" },
  Example: { icon: "lightbulb", color: "yellow", name: "Example" },
};

const editorViewEl = document.getElementById("editor-view") as HTMLDivElement;
const templatesViewEl = document.getElementById(
  "templates-view"
) as HTMLDivElement;
const noPromptViewEl = document.getElementById(
  "no-prompt-view"
) as HTMLDivElement;
const editorContentEl = document.getElementById(
  "editor-content"
) as HTMLDivElement;
const footerBarEl = document.getElementById("footer-bar") as HTMLElement;

const canvasEl = document.getElementById("canvas") as HTMLDivElement;
const canvasPlaceholderEl = document.getElementById(
  "canvas-placeholder"
) as HTMLDivElement;
const blockLibraryEl = document.getElementById(
  "block-library"
) as HTMLDivElement;
const statsCounterEl = document.getElementById(
  "stats-counter"
) as HTMLDivElement;
const previewTextEl = document.getElementById("preview-text") as HTMLPreElement;
const addBlockButtonsEl = document.getElementById(
  "add-block-buttons"
) as HTMLDivElement;
const promptTitleInputEl = document.getElementById(
  "prompt-title-input"
) as HTMLInputElement;
const templatesListContainerEl = document.getElementById(
  "templates-list-container"
) as HTMLDivElement;
export const rightPreviewPaneEl = document.getElementById(
  "right-preview-pane"
) as HTMLElement;

export function render() {
  renderTheme();
  if (state.currentView === "templates") {
    editorViewEl.classList.add("hidden");
    templatesViewEl.classList.remove("hidden");
    footerBarEl.classList.add("hidden");
    renderTemplatesView();
  } else {
    templatesViewEl.classList.add("hidden");
    editorViewEl.classList.remove("hidden");
    footerBarEl.classList.remove("hidden");
    renderEditorView();
  }
}

function renderEditorView() {
  const prompt = getCurrentPrompt();
  if (!prompt) {
    noPromptViewEl.classList.remove("hidden");
    editorContentEl.classList.add("hidden");
    footerBarEl.classList.add("hidden");
    return;
  }

  noPromptViewEl.classList.add("hidden");
  editorContentEl.classList.remove("hidden");
  footerBarEl.classList.remove("hidden");

  renderBlockLibrary();
  renderCanvas();
  renderFooter();
  renderPreview();
  renderAddBlockButtons();
}

function renderTemplatesView() {
  renderBlockLibrary();
  const sortedPrompts = [...state.prompts].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt);
    const dateB = new Date(b.updatedAt || b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  if (sortedPrompts.length === 0) {
    templatesListContainerEl.innerHTML = `<div class="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <span class="material-icons text-6xl text-gray-400 dark:text-gray-500">folder_off</span>
        <p class="text-gray-500 mt-4">You don't have any saved prompts yet.</p>
        <p class="text-gray-500 mt-2">Click "New Prompt" in the sidebar to create one!</p>
    </div>`;
    return;
  }

  templatesListContainerEl.innerHTML = sortedPrompts
    .map((prompt) => createTemplateCard(prompt))
    .join("");
}

function createTemplateCard(prompt: Prompt): string {
  const date = new Date(prompt.updatedAt || prompt.createdAt).toLocaleString();
  const blockSummary =
    prompt.blocks.map((b) => b.type.charAt(0)).join(", ") || "Empty";
  const charCount = prompt.blocks.map((b) => b.content).join("").length;

  return `
    <div class="bg-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
            <h3 class="font-bold text-lg truncate" title="${prompt.name}">${prompt.name}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Last updated: ${date} • ${prompt.blocks.length} blocks • ${charCount.toLocaleString()} chars
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">Blocks: ${blockSummary}</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
            <button data-action="load" data-id="${prompt.id}" class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90" title="Load this prompt in the editor">
                <span class="material-icons text-base">edit</span> Load
            </button>
            <button data-action="delete" data-id="${prompt.id}" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800" title="Delete this prompt">
                <span class="material-icons text-red-500">delete</span>
            </button>
        </div>
    </div>
    `;
}

function renderTheme() {
  const html = document.documentElement;
  const themeToggleIcon = document.querySelector("#theme-toggle span");
  if (!themeToggleIcon) return;

  if (state.theme === "dark") {
    html.classList.add("dark");
    themeToggleIcon.textContent = "light_mode";
  } else {
    html.classList.remove("dark");
    themeToggleIcon.textContent = "dark_mode";
  }
}

function renderBlockLibrary() {
  blockLibraryEl.innerHTML = (blockTypes as readonly string[])
    .map(
      (type) => `
        <div class="block-card bg-bkg p-2 rounded-md border border-gray-300 dark:border-gray-600 cursor-grab text-center" draggable="true" data-block-type="${type}" title="Drag to add a ${type} block">
            <span class="material-icons text-${blockConfig[type as BlockType].color}-500">${blockConfig[type as BlockType].icon}</span>
            <p class="text-xs font-medium">${type}</p>
        </div>
    `
    )
    .join("");
}

export function renderCanvas() {
  const prompt = getCurrentPrompt();
  if (!prompt) return;

  promptTitleInputEl.value = prompt.name;
  const blocks = prompt.blocks;

  canvasPlaceholderEl.style.display = blocks.length === 0 ? "block" : "none";
  canvasEl.querySelectorAll(".prompt-block").forEach((el) => el.remove());
  blocks.forEach((block) => {
    canvasEl.appendChild(createBlockElement(block));
  });
}

function createBlockElement(block: Block): HTMLDivElement {
  const config = blockConfig[block.type];
  const element = document.createElement("div");
  element.className =
    "prompt-block bg-secondary p-3 rounded-lg border border-gray-200 dark:border-gray-700";
  element.dataset.blockId = block.id;
  element.draggable = true;

  const isCollapsed = block.isCollapsed;
  const collapseIcon = isCollapsed ? "expand_more" : "expand_less";
  const contentVisibility = isCollapsed ? "hidden" : "";

  element.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
                <span class="material-icons cursor-grab drag-handle text-gray-400" title="Drag to reorder">drag_indicator</span>
                <span class="material-icons text-${config.color}-500">${config.icon}</span>
                <h3 class="font-semibold">${config.name}</h3>
            </div>
            <div class="flex items-center gap-1">
                <button class="w-5 h-7 p-5 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600" data-action="collapse" title="Collapse/Expand Block">
                    <span class="material-icons text-sm">${collapseIcon}</span>
                </button>
                <button class="w-5 h-7 p-5 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600" data-action="duplicate" title="Duplicate Block">
                    <span class="material-icons text-sm">content_copy</span>
                </button>
                <button class="w-5 h-7 p-5 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800" data-action="delete" title="Delete Block">
                    <span class="material-icons text-sm text-red-500">delete</span>
                </button>
            </div>
        </div>
        <div class="block-content pl-8 ${contentVisibility}">
            <textarea class="w-full bg-bkg p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary resize-y" rows="3" style="min-height: 111px;" placeholder="Enter ${block.type.toLowerCase()}...">${block.content}</textarea>
        </div>
    `;
  return element;
}

function renderAddBlockButtons() {
  addBlockButtonsEl.innerHTML = `
        <span class="text-sm font-medium mr-2">Add Block:</span>
        ${(blockTypes as readonly string[])
          .map(
            (type) => `
            <button class="add-block-btn flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700" data-block-type="${type}" title="Add a new ${type} block">
                <span class="material-icons text-base text-${blockConfig[type as BlockType].color}-500">${blockConfig[type as BlockType].icon}</span>
                ${type}
            </button>
        `
          )
          .join("")}
    `;
}

export function renderFooter() {
  const prompt = getCurrentPrompt();
  if (!prompt) {
    statsCounterEl.textContent = `0 chars / 0 tokens`;
    return;
  }
  const fullText = prompt.blocks.map((b) => b.content).join("\n\n");
  const charCount = fullText.length;
  const tokenCount = estimateTokens(fullText);

  statsCounterEl.textContent = `${charCount.toLocaleString()} chars / ${tokenCount.toLocaleString()} tokens`;
}

export function renderPreview() {
  const prompt = getCurrentPrompt();
  if (!prompt) {
    previewTextEl.textContent = "";
    return;
  }
  const fullText = prompt.blocks
    .map((b) => `// ${b.type.toUpperCase()}\n${b.content}`)
    .join("\n\n");
  previewTextEl.textContent = fullText;
}