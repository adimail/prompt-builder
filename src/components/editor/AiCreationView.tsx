import { useEffect, useRef, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { PromptBlock } from './PromptBlock';
import {
  Sparkles,
  RotateCcw,
  ArrowRight,
  Loader,
  Terminal,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const AiCreationView = () => {
  const { aiState, actions } = usePromptStore();
  const { isGenerating, isFinished, generatedBlocks, generatedName, rawContent, thoughts } =
    aiState;
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminalContent = thoughts.length > 0 ? thoughts : rawContent;
  const isThinking = thoughts.length > 0;

  useEffect(() => {
    if (terminalRef.current && isGenerating) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalContent, isGenerating]);

  useEffect(() => {
    if (isFinished) {
      setIsTerminalExpanded(false);
    }
  }, [isFinished]);

  if (!isGenerating && !isFinished && generatedBlocks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 overflow-y-auto bg-black/50 p-8 text-center">
        <div className="rounded-full border border-neutral-800 bg-neutral-900/50 p-6">
          <Sparkles className="h-16 w-16 animate-pulse text-orange-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-wider text-white">AI PROMPT CREATOR</h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-lg text-neutral-400">
            Use the sidebar to describe what you need. The AI will construct a structured prompt for
            you automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {isGenerating ? (
            <Loader className="h-5 w-5 animate-spin text-orange-500" />
          ) : (
            <Sparkles className="h-5 w-5 text-orange-500" />
          )}
          <h2 className="text-lg font-bold tracking-wider text-white">
            {isGenerating ? (isThinking ? 'REASONING...' : 'GENERATING...') : 'GENERATION COMPLETE'}
          </h2>
        </div>

        {isFinished && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => actions.resetAiGeneration()}
              className="flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-bold text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => actions.confirmAiGeneration()}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div
            className={cn(
              'overflow-hidden rounded-lg border shadow-lg transition-colors border-blue-900/50 bg-blue-950/10'
            )}
          >
            <button
              onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider hover:text-white',
                isThinking ? 'bg-blue-900/20 text-blue-400' : 'bg-neutral-900 text-neutral-400'
              )}
            >
              <div className="flex items-center gap-2">
			  <BrainCircuit className="h-4 w-4" />
                <span>Internal Reasoning Process</span>
              </div>
              {isTerminalExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            <div
              ref={terminalRef}
              className={cn(
                'overflow-y-auto font-mono text-sm transition-all duration-300 ease-in-out',
                isTerminalExpanded ? 'h-64 border-t p-4' : 'h-0',
                isThinking
                  ? 'border-blue-900/30 text-blue-200/80'
                  : 'border-neutral-800 text-neutral-400'
              )}
            >
              <pre className="whitespace-pre-wrap">
                {terminalContent}
                {isGenerating && (
                  <span
                    className={cn(
                      'ml-1 inline-block h-4 w-2 animate-pulse align-middle',
                      isThinking ? 'bg-blue-400' : 'bg-orange-500'
                    )}
                  />
                )}
              </pre>
            </div>
          </div>

          {generatedName && (
            <div className="animate-fade-in mt-8 text-center">
              <h1 className="text-3xl font-bold tracking-wider text-white">{generatedName}</h1>
              <p className="mt-2 text-sm text-neutral-500">Structured Preview</p>
            </div>
          )}

          <div className="space-y-4">
            {generatedBlocks.map((block) => (
              <div key={block.id} className="animate-accordion-down">
                <PromptBlock
                  block={block}
                  isDragging={false}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                />
              </div>
            ))}
          </div>

          {isGenerating && generatedBlocks.length === 0 && !isThinking && (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <p className="mb-4 text-sm">Analyzing requirements...</p>
              <div className="flex items-center justify-center">
                <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></div>
                <div className="mx-2 h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
