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
    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-800 flex items-center justify-between gap-4 hover:border-orange-500/50 transition-colors">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg truncate text-white tracking-wider" title={prompt.name}>
          {prompt.name}
        </h3>
        <p className="text-sm text-neutral-400 font-sans">
          Last updated: {date} • {stats}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleLoad}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold"
          title="Load this prompt in the editor"
        >
          <Edit className="w-4 h-4" /> Load
        </button>
        <button
          onClick={handleDelete}
          className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-400 hover:bg-red-500/20 hover:text-red-500"
          title="Delete this prompt"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};