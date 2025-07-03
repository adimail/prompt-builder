import { useCallback } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Block, BlockType } from '../../types';
import { debounce } from '../../utils';

interface BlockConfig {
  icon: string;
  name: string;
  colorClass: string;
}

export const blockConfig: Record<BlockType, BlockConfig> = {
  Instruction: { icon: 'article', name: 'Instruction', colorClass: 'text-blue-500' },
  Context: { icon: 'source', name: 'Context', colorClass: 'text-purple-500' },
  Constraint: { icon: 'gavel', name: 'Constraint', colorClass: 'text-red-500' },
  Variable: { icon: 'code', name: 'Variable', colorClass: 'text-green-500' },
  Example: { icon: 'lightbulb', name: 'Example', colorClass: 'text-yellow-500' },
};

interface PromptBlockProps {
  block: Block;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export const PromptBlock = ({ block, isDragging, onDragStart, onDragEnd }: PromptBlockProps) => {
  const { deleteBlock, duplicateBlock, toggleBlockCollapse, updateBlockContent } = usePromptStore(
    (state) => state.actions
  );

  const debouncedUpdate = useCallback(debounce(updateBlockContent, 250), [updateBlockContent]);

  const config = blockConfig[block.type];
  const isCollapsed = block.isCollapsed;

  return (
    <div
      className={`prompt-block bg-secondary p-3 rounded-lg border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'opacity-50' : ''
      }`}
      data-block-id={block.id}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-icons cursor-grab drag-handle text-gray-400" title="Drag to reorder">
            drag_indicator
          </span>
          <span className={`material-icons ${config.colorClass}`}>{config.icon}</span>
          <h3 className="font-semibold">{config.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleBlockCollapse(block.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Collapse/Expand Block"
          >
            <span className="material-icons text-sm">{isCollapsed ? 'expand_more' : 'expand_less'}</span>
          </button>
          <button
            onClick={() => duplicateBlock(block.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Duplicate Block"
          >
            <span className="material-icons text-sm">content_copy</span>
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800"
            title="Delete Block"
          >
            <span className="material-icons text-sm text-red-500">delete</span>
          </button>
        </div>
      </div>
      <div className={`block-content pl-8 ${isCollapsed ? 'hidden' : ''}`}>
        <textarea
          className="w-full bg-bkg p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary resize-y"
          rows={3}
          style={{ minHeight: '111px' }}
          placeholder={`Enter ${block.type.toLowerCase()}...`}
          defaultValue={block.content}
          onChange={(e) => debouncedUpdate(block.id, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};