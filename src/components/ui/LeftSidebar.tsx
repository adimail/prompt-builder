import { usePromptStore } from '../../store/promptStore';
import { BlockLibrary } from '../editor/BlockLibrary';

export const LeftSidebar = () => {
  const { createNewPrompt, setView } = usePromptStore((state) => state.actions);

  const handleNewPrompt = () => {
    const name = prompt('Enter a name for your new prompt:', 'New Prompt');
    if (name && name.trim() !== '') {
      createNewPrompt(name.trim());
    }
  };

  return (
    <aside className="w-64 bg-secondary p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col gap-6 overflow-y-auto">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Library
        </h2>
        <ul className="space-y-1">
          <li>
            <button
              onClick={handleNewPrompt}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm w-full"
              title="Create a new blank prompt"
            >
              <span className="material-icons text-base">add_circle</span> New Prompt
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('templates')}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm w-full"
              title="Manage your saved prompts"
            >
              <span className="material-icons text-base">folder</span> My Prompts
            </button>
          </li>
        </ul>
      </div>
      <BlockLibrary />
    </aside>
  );
};