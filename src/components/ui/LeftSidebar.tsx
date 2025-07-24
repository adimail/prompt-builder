import { usePromptStore } from '../../store/promptStore';
import { BlockLibrary } from '../editor/BlockLibrary';
import { PlusCircle, Folder, LayoutGrid, Settings, Wand2, FileJson } from 'lucide-react';

interface LeftSidebarProps {
  width: number;
  onGenerateWithAi: () => void;
}

export const LeftSidebar = ({ width, onGenerateWithAi }: LeftSidebarProps) => {
  const { createNewPrompt, setView } = usePromptStore((state) => state.actions);

  const handleNewPrompt = () => {
    const name = prompt('Enter a name for your new prompt:', 'New Prompt');
    if (name && name.trim() !== '') {
      createNewPrompt(name.trim());
    }
  };

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-neutral-900 p-4 border-r border-neutral-800 flex flex-col gap-6 overflow-y-auto flex-shrink-0 h-full"
    >
      <div>
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 px-2">
          Actions
        </h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={handleNewPrompt}
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Create a new blank prompt"
            >
              <PlusCircle className="w-5 h-5" /> New Prompt
            </button>
          </li>
          <li>
            <button
              onClick={onGenerateWithAi}
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Create a new prompt using AI"
            >
              <Wand2 className="w-5 h-5" /> New Prompt with AI
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('templates')}
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Manage your saved prompts"
            >
              <Folder className="w-5 h-5" /> My Prompts
            </button>
          </li>
          <li>
            <a
              href="gallery.html"
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Browse community prompts"
            >
              <LayoutGrid className="w-5 h-5" /> Prompt Gallery
            </a>
          </li>
          <li>
            <button
              onClick={() => setView('json-config')}
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Generate JSON Configs"
            >
              <FileJson className="w-5 h-5" /> JSON Configs
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('settings')}
              className="flex items-center gap-3 p-2 rounded-md text-neutral-300 hover:bg-neutral-800 hover:text-white text-sm w-full"
              title="Configure Settings"
            >
              <Settings className="w-5 h-5" /> Settings
            </button>
          </li>
        </ul>
      </div>
      <div className="border-t border-neutral-800 my-2"></div>
      <BlockLibrary />
    </aside>
  );
};