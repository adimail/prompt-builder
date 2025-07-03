import { blockTypes } from '../../types';
import { blockConfig } from './PromptBlock';

export const BlockLibrary = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Block Library
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {blockTypes.map((type) => (
          <div
            key={type}
            className="block-card bg-bkg p-2 rounded-md border border-gray-300 dark:border-gray-600 cursor-grab text-center"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, type)}
            title={`Drag to add a ${type} block`}
          >
            <span className={`material-icons ${blockConfig[type].colorClass}`}>
              {blockConfig[type].icon}
            </span>
            <p className="text-xs font-medium">{type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};