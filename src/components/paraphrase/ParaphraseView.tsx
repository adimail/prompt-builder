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
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-screen">
      <div className="flex-1 flex flex-col p-6 lg:p-8 min-h-0 overflow-y-auto">
        <h2 className="text-3xl font-bold tracking-wider mb-5 flex items-center gap-3">
          <Repeat className="w-8 h-8 text-orange-500" />
          Paraphrase Tool
        </h2>

        <div className="flex flex-col flex-1 min-h-0 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-300 mb-2 block">
              1. CHOOSE A MODE
            </label>
            <div className="relative" ref={modeDropdownRef}>
              <button
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span>{mode}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isModeDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isModeDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {paraphraseModes.map((m) => (
                      <li key={m}>
                        <button
                          onClick={() => {
                            setMode(m);
                            setIsModeDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-orange-500/20 hover:text-white"
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
                className="text-sm font-medium text-neutral-300 mb-2 block"
              >
                2. DEFINE YOUR CUSTOM INSTRUCTION
              </label>
              <input
                id="custom-instruction"
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                placeholder="e.g., 'Make it sound like a pirate'"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex flex-col flex-1 min-h-0">
            <label
              htmlFor="input-text"
              className="text-sm font-medium text-neutral-300 mb-2 block flex-shrink-0"
            >
              {mode === 'Custom' ? '3. ENTER TEXT TO PARAPHRASE' : '2. ENTER TEXT TO PARAPHRASE'}
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono flex-1 resize-none"
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
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-md text-sm flex items-start gap-2 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-shrink-0">
            <button
              onClick={handleParaphrase}
              disabled={isLoading || !inputText.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  PARAPHRASING...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  PARAPHRASE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:block w-1 cursor-col-resize bg-neutral-800 hover:bg-orange-500/50 transition-colors flex-shrink-0"
        title="Resize pane"
      />

      <div
        style={{ width: `${outputPaneWidth}px` }}
        className="flex-1 lg:flex-none flex flex-col p-6 lg:p-8 bg-neutral-950 min-h-0"
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="font-bold tracking-wider text-neutral-300">OUTPUT</h3>
          <button
            onClick={handleClear}
            disabled={!inputText && outputText.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear input and output"
          >
            <XCircle className="w-4 h-4" /> Clear
          </button>
        </div>
        <div
          ref={outputContainerRef}
          className="flex-1 bg-black rounded-md border border-neutral-800 overflow-auto flex flex-col min-h-0"
        >
          {isLoading || outputText.some((v) => v.trim()) ? (
            <div className="p-4 space-y-4">
              {outputText.map((variation, index) => (
                <div
                  key={index}
                  className="bg-neutral-900 p-3 rounded-md border border-neutral-700 relative group"
                >
                  <button
                    onClick={() => handleCopy(variation, index)}
                    disabled={isCopied === index}
                    className="absolute top-2 right-2 w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 bg-neutral-800 hover:bg-neutral-700 hover:text-white disabled:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy Variation"
                  >
                    {isCopied === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <pre className="whitespace-pre-wrap text-sm text-neutral-300 font-mono pr-8">
                    {variation}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-600 p-4">
              <Repeat className="w-16 h-16 mb-4" />
              <p>Your paraphrased text will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};