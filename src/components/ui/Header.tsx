import { Wand2, Cpu } from 'lucide-react';
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
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <a
          href="/prompt-builder"
          className="text-sm font-bold tracking-wider text-orange-500 md:text-xl"
        >
          PROMPT BUILDER
        </a>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenModelSelection}
          className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
          title="Select AI Model"
        >
          <Cpu className="h-4 w-4" />
          <span className="hidden md:block">{selectedModel?.name || 'Select Model'}</span>
        </button>
        <button
          onClick={onGenerateWithAi}
          className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
          title="Create a new prompt using AI"
        >
          <Wand2 className="h-4 w-4" />
          <span className="hidden md:block">New with AI</span>
        </button>
      </div>
    </header>
  );
};
