import { Star, Wand2, Cpu } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { availableModels } from '../../config/models';

interface HeaderProps {
  onGenerateWithAi: () => void;
  onOpenModelSelection: () => void;
}

export const Header = ({ onGenerateWithAi, onOpenModelSelection }: HeaderProps) => {
  const selectedModelId = useSettingsStore((state) => state.model);
  const selectedModel = availableModels.find((m) => m.id === selectedModelId);

  return (
    <header className="flex items-center justify-between px-4 h-16 bg-neutral-900 border-b border-neutral-800 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="md:text-xl text-sm font-bold text-orange-500 tracking-wider">
          PROMPT BUILDER
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenModelSelection}
          className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
          title="Select AI Model"
        >
          <Cpu className="w-4 h-4" />
          <span className="hidden md:block">{selectedModel?.name || 'Select Model'}</span>
        </button>
        <button
          onClick={onGenerateWithAi}
          className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
          title="Create a new prompt using AI"
        >
          <Wand2 className="w-4 h-4" />
          <span className="hidden md:block">New with AI</span>
        </button>
        <button
          className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-orange-500"
          title="Star"
        >
          <Star className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};