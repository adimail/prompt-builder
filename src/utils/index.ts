import { Prompt, PersistedState } from '../types';

export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export function downloadJson(data: object, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadGalleryPromptIntoStorage(promptToLoad: Prompt): void {
  const STORAGE_KEY = 'promptBuilderState';

  const newPrompt: Prompt = {
    ...promptToLoad,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const storedStateJSON = localStorage.getItem(STORAGE_KEY);
    let currentState: { state: PersistedState; version: number };

    if (storedStateJSON) {
      currentState = JSON.parse(storedStateJSON);
    } else {
      currentState = {
        state: {
          prompts: [],
          currentPromptId: null,
          currentView: 'editor',
        },
        version: 0,
      };
    }

    if (!Array.isArray(currentState.state.prompts)) {
      currentState.state.prompts = [];
    }

    currentState.state.prompts.unshift(newPrompt);
    currentState.state.currentPromptId = newPrompt.id;
    currentState.state.currentView = 'editor';

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));

    window.location.href = 'studio.html';
  } catch (error) {
    console.error('Failed to load prompt into storage:', error);
    alert('Could not load the prompt. Your local storage might be corrupted or full.');
  }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}