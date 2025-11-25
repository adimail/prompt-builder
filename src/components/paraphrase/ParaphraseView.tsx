import { useState, useEffect, useRef, useCallback } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { usePromptStore } from '../../store/promptStore';
import { streamParaphrasedText } from '../../services/geminiService';
import { ParaphraseMode, paraphraseModes } from '../../types';
import {
  Loader,
  Wand2,
  AlertTriangle,
  Copy,
  Check,
  Repeat,
  ChevronDown,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { SimpleSlider } from '../ui/SimpleSlider';

const PARAPHRASE_STATE_KEY = 'paraphraseViewLiveState';

export const ParaphraseView = () => {
  const [mode, setMode] = useState<ParaphraseMode>('Funny');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<number | null>(null);
  const [numberOfVariations, setNumberOfVariations] = useState(3);
  const [outputPaneWidth, setOutputPaneWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 600
  );
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  const { apiKey, model, temperature, topP } = useSettingsStore();
  const { setView } = usePromptStore((state) => state.actions);

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(PARAPHRASE_STATE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.mode) setMode(savedState.mode);
        if (savedState.customInstruction) setCustomInstruction(savedState.customInstruction);
        if (savedState.inputText) setInputText(savedState.inputText);
        if (savedState.outputText) setOutputText(savedState.outputText);
        if (savedState.numberOfVariations) setNumberOfVariations(savedState.numberOfVariations);
      }
    } catch (err) {
      console.error('Failed to load Paraphrase Tool state from localStorage:', err);
      localStorage.removeItem(PARAPHRASE_STATE_KEY);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      mode,
      customInstruction,
      inputText,
      outputText,
      numberOfVariations,
    };
    localStorage.setItem(PARAPHRASE_STATE_KEY, JSON.stringify(stateToSave));
  }, [mode, customInstruction, inputText, outputText, numberOfVariations]);

  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [outputText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modeDropdownRef]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = outputPaneWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth - (moveEvent.clientX - startX);
        if (newWidth > 300 && newWidth < window.innerWidth * 0.8) {
          setOutputPaneWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [outputPaneWidth]
  );

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to paraphrase.');
      return;
    }
    if (mode === 'Custom' && !customInstruction.trim()) {
      setError('Please provide a custom instruction.');
      return;
    }
    if (!apiKey) {
      alert('Please set your Gemini API key in the Settings page to use this feature.');
      setView('settings');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText([]);
    let fullResponse = '';

    try {
      await streamParaphrasedText(
        apiKey,
        model,
        temperature,
        topP,
        mode,
        customInstruction,
        inputText,
        numberOfVariations,
        (chunk) => {
          fullResponse += chunk;
          const variations = fullResponse
            .split('---VARIATION_SEPARATOR---')
            .map((v) => v.trimStart());
          setOutputText(variations);
        }
      );
      const finalVariations = fullResponse
        .split('---VARIATION_SEPARATOR---')
        .map((v) => v.trim())
        .filter(Boolean);
      setOutputText(finalVariations);
    } catch (err) {
      console.error('Failed to paraphrase text:', err);
      let errorMessage = 'An unexpected error occurred. Please check the console for details.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    if (!text || isLoading || isCopied === index) return;
    navigator.clipboard.writeText(text);
    setIsCopied(index);
    setTimeout(() => {
      setIsCopied(null);
    }, 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText([]);
    setError(null);
  };

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 lg:p-8">
        <h2 className="mb-5 flex items-center gap-3 text-3xl font-bold tracking-wider">
          <Repeat className="h-8 w-8 text-orange-500" />
          Paraphrase Tool
        </h2>

        <div className="flex min-h-0 flex-1 flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              1. CHOOSE A MODE
            </label>
            <div className="relative" ref={modeDropdownRef}>
              <button
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className="flex w-full items-center justify-between rounded-md border border-neutral-700 bg-neutral-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span>{mode}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isModeDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isModeDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 shadow-lg">
                  <ul className="py-1">
                    {paraphraseModes.map((m) => (
                      <li key={m}>
                        <button
                          onClick={() => {
                            setMode(m);
                            setIsModeDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-orange-500/20 hover:text-white"
                        >
                          {m}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {mode === 'Custom' && (
            <div>
              <label
                htmlFor="custom-instruction"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                2. DEFINE YOUR CUSTOM INSTRUCTION
              </label>
              <input
                id="custom-instruction"
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-3 font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 'Make it sound like a pirate'"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col">
            <label
              htmlFor="input-text"
              className="mb-2 block flex-shrink-0 text-sm font-medium text-neutral-300"
            >
              {mode === 'Custom' ? '3. ENTER TEXT TO PARAPHRASE' : '2. ENTER TEXT TO PARAPHRASE'}
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full flex-1 resize-none rounded-md border border-neutral-700 bg-neutral-900 p-3 font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Paste or type your text here..."
              disabled={isLoading}
            />
          </div>

          <div className="px-2">
            <SimpleSlider
              id="variations"
              label="Number of Variations"
              value={numberOfVariations}
              min={1}
              max={10}
              step={1}
              onChange={setNumberOfVariations}
              displayValue={String(numberOfVariations)}
            />
          </div>

          {error && (
            <div className="flex flex-shrink-0 items-start gap-2 rounded-md border border-red-500/50 bg-red-900/30 p-3 text-sm text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-shrink-0">
            <button
              onClick={handleParaphrase}
              disabled={isLoading || !inputText.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-base font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  PARAPHRASING...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  PARAPHRASE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="hidden w-1 flex-shrink-0 cursor-col-resize bg-neutral-800 transition-colors hover:bg-orange-500/50 lg:block"
        title="Resize pane"
      />

      <div
        style={{ width: `${outputPaneWidth}px` }}
        className="flex min-h-0 flex-1 flex-col bg-neutral-950 p-6 lg:flex-none lg:p-8"
      >
        <div className="mb-4 flex flex-shrink-0 items-center justify-between">
          <h3 className="font-bold tracking-wider text-neutral-300">OUTPUT</h3>
          <button
            onClick={handleClear}
            disabled={!inputText && outputText.length === 0}
            className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            title="Clear input and output"
          >
            <XCircle className="h-4 w-4" /> Clear
          </button>
        </div>
        <div
          ref={outputContainerRef}
          className="flex min-h-0 flex-1 flex-col overflow-auto rounded-md border border-neutral-800 bg-black"
        >
          {isLoading || outputText.some((v) => v.trim()) ? (
            <div className="space-y-4 p-4">
              {outputText.map((variation, index) => (
                <div
                  key={index}
                  className="group relative rounded-md border border-neutral-700 bg-neutral-900 p-3"
                >
                  <button
                    onClick={() => handleCopy(variation, index)}
                    disabled={isCopied === index}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-700 hover:text-white disabled:opacity-70 group-hover:opacity-100"
                    title="Copy Variation"
                  >
                    {isCopied === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <pre className="whitespace-pre-wrap pr-8 font-mono text-sm text-neutral-300">
                    {variation}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center text-neutral-600">
              <Repeat className="mb-4 h-16 w-16" />
              <p>Your paraphrased text will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
