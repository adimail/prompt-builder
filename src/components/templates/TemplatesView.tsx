import { useState, useRef } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { downloadJson } from '../../utils';
import { TemplateCard } from './TemplateCard';
import { Upload, Download, Edit, Folder, FileText, FileJson } from 'lucide-react';
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

  const handleExport = () => {
    if (prompts.length === 0) {
      alert('There are no prompts to export.');
      return;
    }
    downloadJson(prompts, `prompt-builder-export-${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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
    <div className="flex-1 flex-col p-6 lg:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 md:flex-row flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-wider">MY PROMPTS</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
            title="Import prompts from a .json file"
          >
            <Upload className="w-4 h-4" /> <span className="hidden md:block">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
            title="Export all prompts to a .json file"
          >
            <Download className="w-4 h-4" /> <span className="hidden md:block">Export All</span>
          </button>
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold"
            title="Return to the prompt editor"
          >
            <Edit className="w-4 h-4" /> Back to Editor
          </button>
        </div>
      </div>

      <div className="flex border-b border-neutral-800 mb-6">
        <button
          onClick={() => setActiveTab('blocks')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wider border-b-2 transition-colors',
            activeTab === 'blocks'
              ? 'text-orange-500 border-orange-500'
              : 'text-neutral-400 border-transparent hover:text-white'
          )}
        >
          <FileText className="w-4 h-4" />
          Text Prompts
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wider border-b-2 transition-colors',
            activeTab === 'json'
              ? 'text-orange-500 border-orange-500'
              : 'text-neutral-400 border-transparent hover:text-white'
          )}
        >
          <FileJson className="w-4 h-4" />
          JSON Prompts
        </button>
      </div>

      <div className="space-y-4">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => <TemplateCard key={prompt.id} prompt={prompt} />)
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-neutral-800 rounded-lg">
            <Folder className="w-16 h-16 text-neutral-700 mx-auto" />
            <p className="text-neutral-500 mt-4">
              You don't have any saved {activeTab === 'blocks' ? 'text' : 'JSON'} prompts yet.
            </p>
            <p className="text-neutral-500 mt-2 font-sans">
              {activeTab === 'blocks'
                ? 'Click "New Prompt" in the sidebar to create one!'
                : 'Go to the JSON Builder to generate and save one!'}
            </p>
          </div>
        )}
      </div>
      <StorageStats />
    </div>
  );
};