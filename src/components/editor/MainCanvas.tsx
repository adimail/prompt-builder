import { useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Block, BlockType, blockTypes } from '../../types';
import { PromptBlock, blockConfig } from './PromptBlock';
import { PlusCircle } from 'lucide-react';

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
          <div className="text-center py-20 border-2 border-dashed border-neutral-700 rounded-lg">
            <p className="text-neutral-500">
              DRAG BLOCKS FROM THE LIBRARY TO START BUILDING YOUR PROMPT.
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
          <span className="text-sm font-medium mr-2 text-neutral-400">ADD BLOCK:</span>
          {blockTypes.map((type) => {
            const config = blockConfig[type];
            return (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
                title={`Add a new ${type} block`}
              >
                <config.icon className="w-4 h-4" />
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};