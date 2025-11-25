import { useState, useRef } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { TemplateCard } from './TemplateCard';
import { Edit, Folder, FileText, FileJson } from 'lucide-react';
import { StorageStats } from '../ui/StorageStats';
import { cn } from '../../utils/cn';

export const TemplatesView = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'json'>('blocks');
  const prompts = usePromptStore((state) => state.prompts);
  const setView = usePromptStore((state) => state.actions.setView);
  const importPrompts = usePromptStore((state) => state.actions.importPrompts);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPrompts = [...prompts]
    .filter((p) => (p.format || 'blocks') === activeTab)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const promptsToImport = Array.isArray(data) ? data : [data];
      importPrompts(promptsToImport);
    } catch (err) {
      alert('Import failed. The file is not valid JSON.');
    }
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex-col overflow-y-auto p-6 lg:p-8">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-3xl font-bold tracking-wider">MY PROMPTS</h2>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
            title="Return to the prompt editor"
          >
            <Edit className="h-4 w-4" /> Back to Editor
          </button>
        </div>
      </div>

      <div className="mb-6 flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('blocks')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold tracking-wider transition-colors',
            activeTab === 'blocks'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          )}
        >
          <FileText className="h-4 w-4" />
          Text Prompts
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-semibold tracking-wider transition-colors',
            activeTab === 'json'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          )}
        >
          <FileJson className="h-4 w-4" />
          JSON Prompts
        </button>
      </div>

      <div className="space-y-4">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => <TemplateCard key={prompt.id} prompt={prompt} />)
        ) : (
          <div className="rounded-lg border-2 border-dashed border-neutral-800 py-20 text-center">
            <Folder className="mx-auto h-16 w-16 text-neutral-700" />
            <p className="mt-4 text-neutral-500">
              You don't have any saved {activeTab === 'blocks' ? 'text' : 'JSON'} prompts yet.
            </p>
            <p className="mt-2 font-sans text-neutral-500">
              {activeTab === 'blocks'
                ? 'Click "New Prompt" in the sidebar to create one!'
                : 'Go to the JSON Prompt Builder to generate and save one!'}
            </p>
          </div>
        )}
      </div>
      <StorageStats />
    </div>
  );
};
