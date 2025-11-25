import { useMemo, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Clipboard, Check } from 'lucide-react';

interface RightPreviewPaneProps {
  width: number;
}

export const RightPreviewPane = ({ width }: RightPreviewPaneProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );

  const assembledText = useMemo(() => {
    if (!currentPrompt) return '';
    return currentPrompt.blocks.map((b) => `// ${b.type.toUpperCase()}\n${b.content}`).join('\n\n');
  }, [currentPrompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(assembledText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <aside
      style={{ width: `${width}px` }}
      className="flex h-full flex-shrink-0 flex-col border-l border-neutral-800 bg-neutral-900 p-4"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold tracking-wider text-neutral-300">ASSEMBLED PROMPT</h3>
          <button
            onClick={handleCopy}
            disabled={isCopied}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-70"
            title="Copy Prompt"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </button>
        </div>
        <pre className="h-full max-h-[calc(100vh-200px)] w-full overflow-auto whitespace-pre-wrap rounded-md border border-neutral-800 bg-black p-3 font-mono text-sm text-neutral-300">
          {assembledText}
        </pre>
      </div>
    </aside>
  );
};
