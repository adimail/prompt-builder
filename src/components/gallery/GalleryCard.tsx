import { Prompt } from '../../types';
import { cn } from '../../utils/cn';
import { MessageSquareText, Layers } from 'lucide-react';

interface GalleryCardProps {
  prompt: Prompt;
  isSelected: boolean;
  onClick: () => void;
}

export const GalleryCard = ({ prompt, isSelected, onClick }: GalleryCardProps) => {
  const charCount = prompt.blocks.map((b) => b.content).join('').length;

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-neutral-900 p-4 rounded-lg border border-neutral-800 cursor-pointer transition-all h-full flex flex-col',
        'hover:border-orange-500/50 hover:bg-neutral-800/50',
        isSelected ? 'border-orange-500 bg-neutral-800' : 'border-neutral-800'
      )}
    >
      <div className="flex-grow">
        <h3 className="font-bold text-lg truncate text-white tracking-wider" title={prompt.name}>
          {prompt.name}
        </h3>
        <p className="text-sm text-neutral-400 font-sans mt-2 line-clamp-2">
          {prompt.blocks[0]?.content || 'No description available.'}
        </p>
      </div>
      <div className="flex items-center gap-4 text-xs text-neutral-500 mt-4 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          <span>{prompt.blocks.length} Blocks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquareText className="w-3 h-3" />
          <span>{charCount.toLocaleString()} Chars</span>
        </div>
      </div>
    </div>
  );
};