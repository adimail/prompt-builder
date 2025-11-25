import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePromptStore } from '../../store/promptStore';
import { useUiStore } from '../../store/uiStore';
import { Save, Eye, EyeOff, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { FontSizeControl } from '../ui/FontSizeControl';

export const SettingsView = () => {
  const { apiKey, setApiKey } = useSettingsStore();
  const { setView, deleteAllPrompts } = usePromptStore((state) => state.actions);

  const [currentKey, setCurrentKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const handleSave = () => {
    setApiKey(currentKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearAllData = () => {
    const confirmation = confirm(
      'ARE YOU ABSOLUTELY SURE?\n\nThis will permanently delete all your prompts, settings, and API key. This action cannot be undone.'
    );
    if (confirmation) {
      usePromptStore.persist.clearStorage();
      useSettingsStore.persist.clearStorage();
      useUiStore.persist.clearStorage();
      window.location.reload();
    }
  };

  const handleDeleteAllPrompts = () => {
    const confirmation = confirm(
      'ARE YOU SURE?\n\nThis will permanently delete all your prompts. This action cannot be undone.'
    );
    if (confirmation) {
      deleteAllPrompts();
      alert('All prompts have been deleted.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl flex-1 flex-col overflow-y-auto p-6 lg:p-8 ">
      <div className="my-10 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-wider">SETTINGS</h2>
        <button
          onClick={() => setView('editor')}
          className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
          title="Return to the prompt editor"
        >
          <Edit className="h-4 w-4" /> Back to Editor
        </button>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <FontSizeControl />
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="mb-4 text-xl font-semibold tracking-wider">Gemini API Key</h3>
          <p className="mb-4 font-sans text-neutral-400">
            To use the "Improve Prompt" feature, you need a Google AI Gemini API key. You can
            generate one for free from the{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Google AI Studio
            </a>
            .
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-neutral-300">
              Your API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={isKeyVisible ? 'text' : 'password'}
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 pr-12 font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your Gemini API key"
              />
              <button
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-white"
                title={isKeyVisible ? 'Hide API Key' : 'Show API Key'}
              >
                {isKeyVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="font-sans text-xs text-neutral-500">
              Your key is stored securely in your browser's local storage.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
              disabled={isSaved || currentKey === apiKey}
            >
              <Save className="h-4 w-4" />
              {isSaved ? 'Saved!' : 'Save API Key'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-wider text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-sans text-red-400/80">
                Permanently delete all saved prompts. Your settings and API key will not be
                affected.
              </p>
              <button
                onClick={handleDeleteAllPrompts}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete All Prompts
              </button>
            </div>
            <div className="border-t border-red-500/30 pt-4">
              <p className="mb-2 font-sans text-red-400/80">
                This action is irreversible. All your saved prompts and settings will be permanently
                deleted from this browser.
              </p>
              <button
                onClick={handleClearAllData}
                className="flex items-center gap-2 rounded-md bg-red-800 px-4 py-2 text-sm font-bold text-white hover:bg-red-900"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
