import { usePromptStore } from '../../store/promptStore';
import { Prompt } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface TemplateCardProps {
  prompt: Prompt;
}

export const TemplateCard = ({ prompt }: TemplateCardProps) => {
  const { loadPrompt, deletePrompt, setView } = usePromptStore((state) => state.actions);

  const date = new Date(prompt.updatedAt || prompt.createdAt).toLocaleString();

  const stats =
    (prompt.format || 'blocks') === 'json'
      ? `${prompt.content.length.toLocaleString()} chars`
      : `${prompt.blocks.length} blocks • ${prompt.blocks
          .map((b) => b.content)
          .join('')
          .length.toLocaleString()} chars`;

  const handleLoad = () => {
    loadPrompt(prompt.id);
    setView('editor');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the prompt "${prompt.name}"?`)) {
      deletePrompt(prompt.id);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-orange-500/50">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-bold tracking-wider text-white" title={prompt.name}>
          {prompt.name}
        </h3>
        <p className="font-sans text-sm text-neutral-400">
          Last updated: {date} • {stats}
        </p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={handleLoad}
          className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
          title="Load this prompt in the editor"
        >
          <Edit className="h-4 w-4" /> Load
        </button>
        <button
          onClick={handleDelete}
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-400 hover:bg-red-500/20 hover:text-red-500"
          title="Delete this prompt"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
