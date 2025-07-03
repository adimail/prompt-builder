import { usePromptStore } from '../../store/promptStore';

export const Header = () => {
  const theme = usePromptStore((state) => state.theme);
  const toggleTheme = usePromptStore((state) => state.actions.toggleTheme);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="material-icons text-primary text-3xl">hub</span>
        <h1 className="text-xl font-bold text-content">Prompt Builder</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Toggle dark/light theme"
        >
          <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <div
          className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center font-semibold text-sm"
          title="User"
        >
          U
        </div>
      </div>
    </header>
  );
};