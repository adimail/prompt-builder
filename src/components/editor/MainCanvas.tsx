import { useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Block, BlockType, blockTypes } from '../../types';
import { PromptBlock, blockConfig } from './PromptBlock';

export const MainCanvas = () => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );
  const addBlock = usePromptStore((state) => state.actions.addBlock);
  const reorderBlocks = usePromptStore((state) => state.actions.reorderBlocks);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (blockTypes.includes(data as BlockType)) {
      addBlock(data as BlockType);
    } else if (draggedId) {
      const target = (e.target as HTMLElement).closest('.prompt-block');
      const targetId = target ? (target as HTMLElement).dataset.blockId ?? null : null;
      if (draggedId !== targetId) {
        reorderBlocks(draggedId, targetId);
      }
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  if (!currentPrompt) return null;

  return (
    <>
      <div
        id="canvas"
        className="min-h-[50vh] space-y-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentPrompt.blocks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500">
              Drag blocks from the library to start building your prompt.
            </p>
          </div>
        ) : (
          currentPrompt.blocks.map((block: Block) => (
            <PromptBlock
              key={block.id}
              block={block}
              isDragging={draggedId === block.id}
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>
      <div className="mt-20 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm font-medium mr-2">Add Block:</span>
          {blockTypes.map((type) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              title={`Add a new ${type} block`}
            >
              <span className={`material-icons text-base`}>
                {blockConfig[type].icon}
              </span>
              {type}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};