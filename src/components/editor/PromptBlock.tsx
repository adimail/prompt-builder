import { useCallback } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Block, BlockType } from '../../types';
import { debounce } from '../../utils';
import {
  Badge,
  FileText,
  BookText,
  Gavel,
  Code,
  Lightbulb,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
} from 'lucide-react';

interface BlockConfig {
  icon: React.ElementType;
  name: string;
  colorClass: string;
}

export const blockConfig: Record<BlockType, BlockConfig> = {
  Role: { icon: Badge, name: 'Role', colorClass: 'text-orange-400' },
  Instruction: { icon: FileText, name: 'Instruction', colorClass: 'text-blue-400' },
  Context: { icon: BookText, name: 'Context', colorClass: 'text-purple-400' },
  Constraint: { icon: Gavel, name: 'Constraint', colorClass: 'text-red-400' },
  Variable: { icon: Code, name: 'Variable', colorClass: 'text-green-400' },
  Example: { icon: Lightbulb, name: 'Example', colorClass: 'text-yellow-400' },
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
      className={`prompt-block bg-neutral-900 p-3 rounded-lg border border-neutral-800 transition-opacity ${
        isDragging ? 'opacity-30' : 'opacity-100'
      }`}
      data-block-id={block.id}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <GripVertical
            className="cursor-grab text-neutral-600 hover:text-neutral-400"
          />
          <config.icon className={`w-5 h-5 ${config.colorClass}`} />
          <h3 className="font-semibold tracking-wider text-white">{config.name.toUpperCase()}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleBlockCollapse(block.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="Collapse/Expand Block"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => duplicateBlock(block.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
            title="Duplicate Block"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-red-500/20 hover:text-red-500"
            title="Delete Block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className={`block-content pl-10 ${isCollapsed ? 'hidden' : ''}`}>
        <textarea
          className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-sans text-sm"
          rows={4}
          placeholder={`Enter ${block.type.toLowerCase()} content here...`}
          defaultValue={block.content}
          onChange={(e) => debouncedUpdate(block.id, e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};