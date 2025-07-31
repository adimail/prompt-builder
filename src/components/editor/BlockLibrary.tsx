import { blockTypes } from '../../types';
import { blockConfig } from './PromptBlock';

export const BlockLibrary = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 px-2 border-t border-neutral-800 pt-6">
        Block Library
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {blockTypes.map((type) => {
          const config = blockConfig[type];
          return (
            <div
              key={type}
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-orange-500/50 cursor-grab transition-colors"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, type)}
              title={`Drag to add a ${type} block`}
            >
              <config.icon className="w-5 h-5 text-neutral-300" />
              <p className="text-xs font-medium text-neutral-300">{type}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};