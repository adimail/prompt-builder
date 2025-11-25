import { blockTypes } from '../../types';
import { blockConfig } from './PromptBlock';

export const BlockLibrary = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      <h2 className="mb-3 border-t border-neutral-800 px-2 pt-6 text-sm font-medium uppercase tracking-wider text-neutral-400">
        Block Library
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {blockTypes.map((type) => {
          const config = blockConfig[type];
          return (
            <div
              key={type}
              className="flex cursor-grab flex-col items-center justify-center gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-3 transition-colors hover:border-orange-500/50 hover:bg-neutral-700"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, type)}
              title={`Drag to add a ${type} block`}
            >
              <config.icon className="h-5 w-5 text-neutral-300" />
              <p className="text-xs font-medium text-neutral-300">{type}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
