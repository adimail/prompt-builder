import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AppActions, Prompt, Block, BlockType } from '../types';
import { generateId } from '../utils';

const createNewPromptObject = (name: string = 'Untitled Prompt'): Prompt => ({
  id: generateId(),
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [],
});

export const usePromptStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: 'editor',
      prompts: [],
      currentPromptId: null,
      actions: {
        setView: (view) => set({ currentView: view }),
        loadPrompt: (promptId) => set({ currentPromptId: promptId }),
        createNewPrompt: (name) => {
          const newPrompt = createNewPromptObject(name);
          set((state) => ({
            prompts: [newPrompt, ...state.prompts],
            currentPromptId: newPrompt.id,
            currentView: 'editor',
          }));
        },
        deletePrompt: (promptId) =>
          set((state) => {
            const newPrompts = state.prompts.filter((p) => p.id !== promptId);
            let newCurrentId = state.currentPromptId;
            if (state.currentPromptId === promptId) {
              newCurrentId = newPrompts[0]?.id || null;
            }
            return { prompts: newPrompts, currentPromptId: newCurrentId };
          }),
        updateCurrentPromptName: (name) =>
          set((state) => {
            const newPrompts = state.prompts.map((p) =>
              p.id === state.currentPromptId
                ? { ...p, name: name.trim() || 'Untitled Prompt', updatedAt: new Date().toISOString() }
                : p
            );
            return { prompts: newPrompts };
          }),
        importPrompts: (importedPrompts) => {
          let importCount = 0;
          if (!Array.isArray(importedPrompts)) return 0;
          set((state) => {
            const existingIds = new Set(state.prompts.map((p) => p.id));
            const newPrompts = [...state.prompts];
            importedPrompts.forEach((p) => {
              if (p.id && p.name && Array.isArray(p.blocks) && !existingIds.has(p.id)) {
                newPrompts.push(p as Prompt);
                importCount++;
              }
            });
            return { prompts: newPrompts };
          });
          return importCount;
        },
        addBlock: (type, index) =>
          set((state) => {
            const newBlock: Block = { id: generateId(), type, content: '', isCollapsed: false };
            const newPrompts = state.prompts.map((p) => {
              if (p.id !== state.currentPromptId) return p;
              const newBlocks = [...p.blocks];
              if (index === undefined) {
                newBlocks.push(newBlock);
              } else {
                newBlocks.splice(index, 0, newBlock);
              }
              return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
            });
            return { prompts: newPrompts };
          }),
        deleteBlock: (blockId) =>
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === state.currentPromptId
                ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId), updatedAt: new Date().toISOString() }
                : p
            ),
          })),
        duplicateBlock: (blockId) =>
          set((state) => {
            const newPrompts = state.prompts.map((p) => {
              if (p.id !== state.currentPromptId) return p;
              const originalIndex = p.blocks.findIndex((b) => b.id === blockId);
              if (originalIndex === -1) return p;
              const newBlock: Block = { ...p.blocks[originalIndex], id: generateId() };
              const newBlocks = [...p.blocks];
              newBlocks.splice(originalIndex + 1, 0, newBlock);
              return { ...p, blocks: newBlocks, updatedAt: new Date().toISOString() };
            });
            return { prompts: newPrompts };
          }),
        updateBlockContent: (blockId, content) =>
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === state.currentPromptId
                ? {
                    ...p,
                    blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, content } : b)),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          })),
        reorderBlocks: (draggedId, targetId) =>
          set((state) => {
            const newPrompts = state.prompts.map((p) => {
              if (p.id !== state.currentPromptId) return p;
              const blocks = [...p.blocks];
              const draggedIndex = blocks.findIndex((b) => b.id === draggedId);
              if (draggedIndex === -1) return p;
              const [draggedBlock] = blocks.splice(draggedIndex, 1);
              if (targetId) {
                const targetIndex = blocks.findIndex((b) => b.id === targetId);
                blocks.splice(targetIndex, 0, draggedBlock);
              } else {
                blocks.push(draggedBlock);
              }
              return { ...p, blocks, updatedAt: new Date().toISOString() };
            });
            return { prompts: newPrompts };
          }),
        toggleBlockCollapse: (blockId) =>
          set((state) => ({
            prompts: state.prompts.map((p) =>
              p.id === state.currentPromptId
                ? {
                    ...p,
                    blocks: p.blocks.map((b) =>
                      b.id === blockId ? { ...b, isCollapsed: !b.isCollapsed } : b
                    ),
                  }
                : p
            ),
          })),
      },
    }),
    {
      name: 'promptBuilderState',
      partialize: (state) => ({
        prompts: state.prompts,
        currentPromptId: state.currentPromptId,
        currentView: state.currentView,
      }),
    }
  )
);