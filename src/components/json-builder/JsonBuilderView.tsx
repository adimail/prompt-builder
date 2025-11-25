import { useState, useRef, useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePromptStore } from '../../store/promptStore';
import { streamJsonForBuilder } from '../../services/geminiService';
import { JsonBuilderType } from '../../types';
import { downloadJson, cleanJsonString } from '../../utils';
import { Loader, Wand2, AlertTriangle, Download, FileJson, Save, Copy, Check } from 'lucide-react';

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
    className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 p-3 transition-colors hover:bg-neutral-700 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-900/50"
  >
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 accent-orange-500"
    />
    <span className="font-medium">{label}</span>
  </label>
);

const builderOptions: { id: JsonBuilderType; label: string }[] = [
  { id: 'Video', label: 'Video' },
  { id: 'Image', label: 'Image' },
  { id: 'UI', label: 'UI' },
  { id: 'Custom', label: 'Custom' },
];

const getPlaceholderText = (builderType: JsonBuilderType): string => {
  switch (builderType) {
    case 'Video':
      return 'e.g., "Ocean waves crashing on rocky shore, slow motion, cinematic style"';

    case 'Image':
      return 'e.g., "Abstract geometric shapes in vibrant colors, modern art style"';

    case 'UI':
      return 'e.g., "Login form with email field, password input, and submit button"';

    case 'Custom':
      return 'e.g., "Customer order with items, shipping address, and payment method"';

    default:
      return 'e.g., "Describe your data structure and desired JSON format"';
  }
};

export const JsonBuilderView = () => {
  const [builderType, setBuilderType] = useState<JsonBuilderType>('Video');
  const [description, setDescription] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const previewRef = useRef<HTMLTextAreaElement>(null);

  const { apiKey, model, temperature, topP } = useSettingsStore();
  const { setView, saveJsonPrompt } = usePromptStore((state) => state.actions);

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem('jsonBuilderLiveState');
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.builderType) {
          setBuilderType(savedState.builderType);
        }
        if (savedState.description) {
          setDescription(savedState.description);
        }
        if (savedState.generatedJson) {
          setGeneratedJson(savedState.generatedJson);
        }
      }
    } catch (err) {
      console.error('Failed to load JSON Prompt Builder state from localStorage:', err);
      localStorage.removeItem('jsonBuilderLiveState');
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      builderType,
      description,
      generatedJson,
    };
    localStorage.setItem('jsonBuilderLiveState', JSON.stringify(stateToSave));
  }, [builderType, description, generatedJson]);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [generatedJson]);

  const handleCopy = () => {
    if (!generatedJson || isLoading || isCopied) return;
    navigator.clipboard.writeText(generatedJson);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please provide a description for the JSON you want to build.');
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
    let fullResponse = '';

    try {
      await streamJsonForBuilder(
        apiKey,
        model,
        temperature,
        topP,
        builderType,
        description,
        (chunk) => {
          fullResponse += chunk;
          setGeneratedJson(fullResponse);
        }
      );

      const cleanedString = cleanJsonString(fullResponse);
      try {
        const parsedJson = JSON.parse(cleanedString);
        setGeneratedJson(JSON.stringify(parsedJson, null, 2));
      } catch (parseError) {
        console.error('Final JSON parsing failed:', parseError);
        setError('The AI returned data in an invalid JSON format. Please review the output.');
        setGeneratedJson(cleanedString);
      }
    } catch (err) {
      console.error('Failed to generate JSON:', err);
      let errorMessage =
        'An unexpected error occurred. The AI may have returned an invalid format. Please check the console for details.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedJson || isLoading) return;
    try {
      const data = JSON.parse(generatedJson);
      downloadJson(data, `json-builder-${builderType.toLowerCase()}-output.json`);
    } catch (e) {
      alert('Cannot download, the generated JSON is not valid.');
    }
  };

  const handleSave = () => {
    if (!generatedJson || isLoading) return;
    const name = prompt('Enter a name for this JSON prompt:', 'My JSON Prompt');
    if (name && name.trim()) {
      try {
        JSON.parse(generatedJson);
        saveJsonPrompt(name.trim(), generatedJson);
      } catch (e) {
        alert('Cannot save, the content is not valid JSON. Please correct it.');
      }
    }
  };

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col border-neutral-800 p-6 lg:border-r lg:p-8">
        <h2 className="mb-5 flex-shrink-0 text-3xl font-bold tracking-wider">
          JSON Prompt Builder
        </h2>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-6 flex-shrink-0">
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              1. CHOOSE A BUILDER TYPE
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {builderOptions.map(({ id, label }) => (
                <RadioButton
                  key={id}
                  id={`type-${id}`}
                  name="builderType"
                  value={id}
                  label={label}
                  checked={builderType === id}
                  onChange={() => setBuilderType(id)}
                />
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <label
              htmlFor="description-input"
              className="mb-2 block flex-shrink-0 text-sm font-medium text-neutral-300"
            >
              2. DESCRIBE WHAT YOU WANT TO BUILD
            </label>
            <textarea
              id="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full flex-1 resize-none rounded-md border border-neutral-700 bg-neutral-900 p-3 font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={getPlaceholderText(builderType)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mt-4 flex flex-shrink-0 items-start gap-2 overflow-hidden rounded-md border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex-shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !description.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-base font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  BUILD JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-neutral-950 p-6 lg:p-8">
        <div className="mb-4 flex flex-shrink-0 items-center justify-between">
          <h3 className="font-bold tracking-wider text-neutral-300">GENERATED JSON</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!generatedJson || isLoading}
              className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Save JSON as a prompt"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={handleCopy}
              disabled={!generatedJson || isLoading || isCopied}
              className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Copy JSON"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={!generatedJson || isLoading}
              className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Download JSON file"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-md border border-neutral-800 bg-black">
          {generatedJson || isLoading ? (
            <textarea
              ref={previewRef}
              value={generatedJson}
              onChange={(e) => setGeneratedJson(e.target.value)}
              readOnly={isLoading}
              className="h-full w-full flex-1 resize-none whitespace-pre-wrap bg-transparent p-4 font-mono text-sm text-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center text-neutral-600">
              <FileJson className="mb-4 h-16 w-16" />
              <p>Your generated JSON will appear here.</p>
              <p className="font-sans text-sm">Fill out the form and click "Build JSON".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
