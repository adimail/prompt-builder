import { useRef } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { downloadJson } from '../../utils';
import { TemplateCard } from './TemplateCard';

export const TemplatesView = () => {
  const prompts = usePromptStore((state) => state.prompts);
  const setView = usePromptStore((state) => state.actions.setView);
  const importPrompts = usePromptStore((state) => state.actions.importPrompts);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedPrompts = [...prompts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

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
      const count = importPrompts(promptsToImport);
      alert(`${count} new prompt(s) imported successfully!`);
    } catch (err) {
      alert('Import failed. The file is not valid JSON.');
    }
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex-col p-6 lg:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Prompts</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-secondary"
            title="Import prompts from a .json file"
          >
            <span className="material-icons text-base">upload_file</span> Import
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-secondary"
            title="Export all prompts to a .json file"
          >
            <span className="material-icons text-base">download</span> Export All
          </button>
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
            title="Return to the prompt editor"
          >
            <span className="material-icons text-base">edit</span> Back to Editor
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {sortedPrompts.length > 0 ? (
          sortedPrompts.map((prompt) => <TemplateCard key={prompt.id} prompt={prompt} />)
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <span className="material-icons text-6xl text-gray-400 dark:text-gray-500">folder_off</span>
            <p className="text-gray-500 mt-4">You don't have any saved prompts yet.</p>
            <p className="text-gray-500 mt-2">Click "New Prompt" in the sidebar to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};