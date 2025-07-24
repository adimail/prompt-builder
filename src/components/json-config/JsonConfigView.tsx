import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePromptStore } from '../../store/promptStore';
import { generateJsonConfig, ConfigType } from '../../services/geminiService';
import { downloadJson, cleanJsonString } from '../../utils';
import { Loader, Wand2, AlertTriangle, Download, FileJson, Edit } from 'lucide-react';

const RadioButton = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label
    htmlFor={id}
    className="flex items-center gap-2 p-3 rounded-md bg-neutral-800 border border-neutral-700 cursor-pointer hover:bg-neutral-700 has-[:checked]:bg-orange-900/50 has-[:checked]:border-orange-500 transition-colors"
  >
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-orange-500"
    />
    <span className="font-medium">{label}</span>
  </label>
);

export const JsonConfigView = () => {
  const [configType, setConfigType] = useState<ConfigType>('design');
  const [sourceCode, setSourceCode] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKey, model } = useSettingsStore();
  const { setView } = usePromptStore((state) => state.actions);

  const handleGenerate = async () => {
    if (!sourceCode.trim()) {
      setError('Please paste some source code to analyze.');
      return;
    }
    if (!apiKey) {
      alert('Please set your Gemini API key in the Settings page to use this feature.');
      setView('settings');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedJson('');

    try {
      const jsonString = await generateJsonConfig(apiKey, model, configType, sourceCode);
      const cleanedString = cleanJsonString(jsonString);
      const parsedJson = JSON.parse(cleanedString);
      setGeneratedJson(JSON.stringify(parsedJson, null, 2));
    } catch (err) {
      console.error('Failed to generate JSON config:', err);
      let errorMessage =
        'An unexpected error occurred. The AI may have returned an invalid format. Please check the console for details.';
      if (err instanceof SyntaxError) {
        errorMessage =
          'The AI returned data in an invalid JSON format. Please try again or adjust your source code input.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedJson) return;
    const data = JSON.parse(generatedJson);
    downloadJson(data, `prompt-builder-${configType}-config.json`);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto lg:border-r border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-wider">JSON CONFIGS</h2>
          <button
            onClick={() => setView('editor')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold"
            title="Return to the prompt editor"
          >
            <Edit className="w-4 h-4" /> Back to Editor
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-neutral-300 mb-2 block">
              1. CHOOSE CONFIG TYPE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RadioButton
                id="design-schema"
                name="configType"
                value="design"
                label="Design Schema"
                checked={configType === 'design'}
                onChange={() => setConfigType('design')}
              />
              <RadioButton
                id="architecture"
                name="configType"
                value="architecture"
                label="Architecture"
                checked={configType === 'architecture'}
                onChange={() => setConfigType('architecture')}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="source-code-input"
              className="text-sm font-medium text-neutral-300 mb-2 block"
            >
              2. PASTE INSPIRATION SOURCE CODE
            </label>
            <textarea
              id="source-code-input"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              rows={15}
              placeholder="Paste your HTML, CSS, JS, React components, etc. here..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-900/30 overflow-hidden border border-red-500/50 text-red-400 p-3 rounded-md text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !sourceCode.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  GENERATE JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto bg-neutral-950">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold tracking-wider text-neutral-300">GENERATED JSON PREVIEW</h3>
          <button
            onClick={handleDownload}
            disabled={!generatedJson}
            className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download JSON file"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
        <div className="flex-1 bg-black rounded-md border border-neutral-800 overflow-auto">
          {generatedJson ? (
            <pre className="p-4 text-sm text-neutral-300 font-mono whitespace-pre-wrap">
              <code>{generatedJson}</code>
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-600 p-4">
              <FileJson className="w-16 h-16 mb-4" />
              <p>Your generated JSON will appear here.</p>
              <p className="text-sm font-sans">Fill out the form and click "Generate JSON".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};