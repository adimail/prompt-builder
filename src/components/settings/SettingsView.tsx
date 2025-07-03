import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePromptStore } from '../../store/promptStore';
import { Save, Eye, EyeOff, Edit, Trash2, AlertTriangle } from 'lucide-react';

export const SettingsView = () => {
  const { apiKey, setApiKey } = useSettingsStore();
  const setView = usePromptStore((state) => state.actions.setView);

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
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 flex-col p-6 lg:p-8 overflow-y-auto max-w-2xl mx-auto ">
      <div className="flex justify-between items-center my-10">
        <h2 className="text-3xl font-bold tracking-wider">SETTINGS</h2>
        <button
          onClick={() => setView('editor')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold"
          title="Return to the prompt editor"
        >
          <Edit className="w-4 h-4" /> Back to Editor
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
          <h3 className="text-xl font-semibold tracking-wider mb-4">Gemini API Key</h3>
          <p className="text-neutral-400 font-sans mb-4">
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
                className="w-full p-3 pr-12 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                placeholder="Enter your Gemini API key"
              />
              <button
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-400 hover:text-white"
                title={isKeyVisible ? 'Hide API Key' : 'Show API Key'}
              >
                {isKeyVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 font-sans">
              Your key is stored securely in your browser's local storage.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold disabled:opacity-50"
              disabled={isSaved || currentKey === apiKey}
            >
              <Save className="w-4 h-4" />
              {isSaved ? 'Saved!' : 'Save API Key'}
            </button>
          </div>
        </div>

        <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/50">
          <h3 className="text-xl font-semibold tracking-wider mb-2 text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-red-400/80 font-sans mb-4">
            This action is irreversible. All your saved prompts and settings will be permanently
            deleted from this browser.
          </p>
          <button
            onClick={handleClearAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-bold"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};