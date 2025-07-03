import {
  state,
  saveState,
  addBlock,
  updateBlockContent,
  deleteBlock,
  duplicateBlock,
  toggleBlockCollapse,
  reorderBlocks,
  toggleTheme,
  setView,
  createNewPrompt,
  saveCurrentPrompt,
  updateCurrentPromptName,
  loadPrompt,
  deletePrompt,
  importPrompts,
  getCurrentPrompt,
} from "./state.js";
import {
  render,
  rightPreviewPaneEl,
  blockConfig,
  renderFooter,
  renderPreview,
} from "./ui.js";
import { debounce, downloadJson } from "./utils.js";

const canvasEl = document.getElementById("canvas");
let draggedElement = null;

export function initializeEventListeners() {
  document
    .getElementById("theme-toggle")
    .addEventListener("click", handleThemeToggle);
  document
    .getElementById("toggle-preview")
    .addEventListener("click", handlePreviewToggle);
  document
    .getElementById("block-library")
    .addEventListener("dragstart", handleSidebarDragStart);
  document
    .getElementById("add-block-buttons")
    .addEventListener("click", handleAddBlockClick);
  document.body.addEventListener("click", handleCopyPrompt);

  document
    .getElementById("nav-templates")
    .addEventListener("click", handleNavTemplates);
  document
    .getElementById("new-prompt-btn")
    .addEventListener("click", handleNewPrompt);
  document
    .getElementById("prompt-title-input")
    .addEventListener("input", debounce(handlePromptTitleInput, 300));
  document
    .getElementById("download-prompt-btn")
    .addEventListener("click", handleDownloadPrompt);

  const templatesView = document.getElementById("templates-view");
  templatesView.addEventListener("click", handleTemplatesViewClick);
  document
    .getElementById("import-prompts-btn")
    .addEventListener("click", () =>
      document.getElementById("import-file-input").click()
    );
  document
    .getElementById("import-file-input")
    .addEventListener("change", handleImportFile);

  canvasEl.addEventListener("input", debounce(handleCanvasInput, 250));
  canvasEl.addEventListener("click", handleCanvasClick);
  canvasEl.addEventListener("dragstart", handleCanvasDragStart);
  canvasEl.addEventListener("dragover", handleCanvasDragOver);
  canvasEl.addEventListener("drop", handleCanvasDrop);
  canvasEl.addEventListener("dragend", handleCanvasDragEnd);
}

function handleThemeToggle() {
  toggleTheme();
  render();
}

function handlePreviewToggle() {
  rightPreviewPaneEl.classList.toggle("hidden");
  rightPreviewPaneEl.classList.toggle("flex");
}

function handleNavTemplates() {
  setView("templates");
  render();
  saveState();
}

function handleNewPrompt() {
  const name = prompt("Enter a name for your new prompt:", "New Prompt");
  if (!name || name.trim() === "") {
    return;
  }
  createNewPrompt(name.trim());
  setView("editor");
  render();
  saveState();
}

function handlePromptTitleInput(e) {
  updateCurrentPromptName(e.target.value);
  saveState();
}

function handleDownloadPrompt() {
  const prompt = getCurrentPrompt();
  if (!prompt) {
    alert("There is no active prompt to download.");
    return;
  }
  const sanitizedName = prompt.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  downloadJson(prompt, `${sanitizedName}.json`);
}

function handleTemplatesViewClick(e) {
  const button = e.target.closest("button[data-action]");
  const backButton = e.target.closest("#back-to-editor-btn");
  const exportButton = e.target.closest("#export-prompts-btn");

  if (button) {
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "load") {
      loadPrompt(id);
      setView("editor");
      render();
      saveState();
    } else if (action === "delete") {
      if (
        confirm(`Are you sure you want to delete this prompt? This cannot be undone.`)
      ) {
        deletePrompt(id);
        render();
        saveState();
      }
    }
  } else if (backButton) {
    setView("editor");
    render();
    saveState();
  } else if (exportButton) {
    handleExportPrompts();
  }
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const data = JSON.parse(text);
    const prompts = Array.isArray(data) ? data : [data];
    const count = importPrompts(prompts);
    alert(`${count} new prompt(s) imported successfully!`);
    render();
    saveState();
  } catch (err) {
    alert("Import failed. The file is not valid JSON.");
    console.error("Import error:", err);
  }
  e.target.value = "";
}

function handleExportPrompts() {
  if (state.prompts.length === 0) {
    alert("There are no prompts to export.");
    return;
  }
  downloadJson(
    state.prompts,
    `prompt-builder-export-${new Date().toISOString().split("T")[0]}.json`
  );
}

function handleCanvasInput(e) {
  if (e.target.tagName === "TEXTAREA") {
    const blockId = e.target.closest(".prompt-block").dataset.blockId;
    updateBlockContent(blockId, e.target.value);
    saveCurrentPrompt();
    renderPreview();
    renderFooter();
    saveState();
  }
}

function handleCanvasClick(e) {
  const actionButton = e.target.closest("button[data-action]");
  if (!actionButton) return;

  const blockId = actionButton.closest(".prompt-block").dataset.blockId;
  const action = actionButton.dataset.action;

  if (action === "delete") {
    deleteBlock(blockId);
    render();
    saveState();
  } else if (action === "duplicate") {
    duplicateBlock(blockId);
    render();
    saveState();
  } else if (action === "collapse") {
    toggleBlockCollapse(blockId);
    render();
    saveState();
  }
}

function handleAddBlockClick(e) {
  const button = e.target.closest(".add-block-btn");
  if (!button) return;

  const blockType = button.dataset.blockType;
  addBlock(blockType);
  render();
  saveState();
  canvasEl.lastElementChild?.querySelector("textarea")?.focus();
}

async function handleCopyPrompt(e) {
  const button = e.target.closest(".copy-prompt-btn");
  if (!button) return;

  const prompt = getCurrentPrompt();
  if (!prompt) return;

  const fullText = prompt.blocks
    .map((b) => `// ${b.type.toUpperCase()}\n${b.content}`)
    .join("\n\n");

  if (!fullText) return;

  try {
    await navigator.clipboard.writeText(fullText);
    const originalContent = button.innerHTML;
    button.innerHTML = button.innerHTML.includes("Copy Prompt")
      ? "Copied!"
      : `<span class="material-icons text-base">done</span>`;
    button.disabled = true;
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.disabled = false;
    }, 1500);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    button.innerHTML = "Error!";
  }
}

function handleSidebarDragStart(e) {
  if (e.target.classList.contains("block-card")) {
    e.dataTransfer.setData("text/plain", e.target.dataset.blockType);
    e.dataTransfer.effectAllowed = "copy";
  }
}

function handleCanvasDragStart(e) {
  if (e.target.classList.contains("prompt-block")) {
    draggedElement = e.target;
    e.dataTransfer.setData("text/plain", e.target.dataset.blockId);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      draggedElement.classList.add("opacity-50");
    }, 0);
  }
}

function handleCanvasDragOver(e) {
  e.preventDefault();
  const target = e.target.closest(".prompt-block");
  if (target && target !== draggedElement) {
    const rect = target.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;
    if (isAfter) {
      target.parentNode.insertBefore(draggedElement, target.nextSibling);
    } else {
      target.parentNode.insertBefore(draggedElement, target);
    }
  }
}

function handleCanvasDrop(e) {
  e.preventDefault();
  const blockType = e.dataTransfer.getData("text/plain");
  const prompt = getCurrentPrompt();
  if (!prompt) return;

  const targetBlock = e.target.closest(".prompt-block");
  const targetIndex = targetBlock
    ? prompt.blocks.findIndex((b) => b.id === targetBlock.dataset.blockId)
    : undefined;

  if (blockConfig[blockType]) {
    addBlock(blockType, targetIndex);
  } else if (draggedElement) {
    const draggedId = draggedElement.dataset.blockId;
    const newTargetId = draggedElement.nextSibling
      ? draggedElement.nextSibling.dataset.blockId
      : null;
    reorderBlocks(draggedId, newTargetId);
  }

  render();
  saveState();
}

function handleCanvasDragEnd(e) {
  if (draggedElement) {
    draggedElement.classList.remove("opacity-50");
    draggedElement = null;
    render();
  }
}