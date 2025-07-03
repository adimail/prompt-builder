import { usePromptStore } from '../../store/promptStore';
import { Prompt } from '../../types';
import { estimateTokens } from '../../utils';

interface TemplateCardProps {
  prompt: Prompt;
}

export const TemplateCard = ({ prompt }: TemplateCardProps) => {
  const { loadPrompt, deletePrompt, setView } = usePromptStore((state) => state.actions);

  const date = new Date(prompt.updatedAt || prompt.createdAt).toLocaleString();
  const charCount = prompt.blocks.map((b) => b.content).join('').length;

  const handleLoad = () => {
    loadPrompt(prompt.id);
    setView('editor');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${prompt.name}"? This cannot be undone.`)) {
      deletePrompt(prompt.id);
    }
  };

  return (
    <div className="bg-secondary p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg truncate" title={prompt.name}>
          {prompt.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {date} • {prompt.blocks.length} blocks • {charCount.toLocaleString()} chars
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleLoad}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          title="Load this prompt in the editor"
        >
          <span className="material-icons text-base">edit</span> Load
        </button>
        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800"
          title="Delete this prompt"
        >
          <span className="material-icons text-red-500">delete</span>
        </button>
      </div>
    </div>
  );
};